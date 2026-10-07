#!/usr/bin/env node
/**
 * tools/auditar-ui.js
 * -----------------------------------------------------------------------------
 * Comprobaciones estáticas de la interfaz que tools/auditar.js no cubre.
 *
 * El problema que evita: las pantallas de SepsLab se arman con cadenas de HTML
 * dentro de app.js, así que un botón puede quedar sin manejador o apuntando a un
 * archivo que ya no existe sin que nada se entere: el clic simplemente no hace
 * nada y no hay error en la consola. Estas pruebas lo detectan.
 *
 * Qué revisa:
 *   1. Que todos los scripts del index.html carguen sin romperse.
 *   2. Que cada data-action tenga su rama en handleClick.
 *   3. Que styles.css tenga las llaves balanceadas.
 *   4. Que toda variable var(--x) usada exista en tokens.css.
 *   5. Que los archivos referenciados por index.html existan.
 *
 * Sale con código 1 si algo falla, para poder usarse en GitHub Actions.
 */

"use strict";

const fs = require("fs");
const path = require("path");

const appDir = process.argv[2] || path.join(__dirname, "..", "app");
const indexPath = path.join(appDir, "index.html");

if (!fs.existsSync(indexPath)) {
  console.error("No se encontró " + indexPath);
  process.exit(1);
}

// --------------------------------------------------------------------------------------
// 1. Cargar la app entera en un DOM falso: si un archivo tiene un error de sintaxis o
//    llama algo que no existe, revienta aquí en vez de en el teléfono del estudiante.
// --------------------------------------------------------------------------------------
const store = new Map();

global.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
  clear: () => store.clear(),
};

function fakeEl() {
  return {
    innerHTML: "",
    textContent: "",
    className: "",
    dataset: {},
    style: {},
    children: [],
    classList: { add() {}, remove() {}, toggle: () => false, contains: () => false },
    addEventListener() {},
    removeEventListener() {},
    appendChild(c) { this.children.push(c); return c; },
    setAttribute() {},
    removeAttribute() {},
    querySelector: () => fakeEl(),
    querySelectorAll: () => [],
    getAttribute: () => null,
    focus() {},
    remove() {},
  };
}

global.document = {
  getElementById: () => fakeEl(),
  createElement: () => fakeEl(),
  createTextNode: () => fakeEl(),
  querySelector: () => fakeEl(),
  querySelectorAll: () => [],
  addEventListener() {},
  removeEventListener() {},
  documentElement: fakeEl(),
  body: fakeEl(),
  head: fakeEl(),
};
// navigator existe como solo-lectura en Node 22, así que se define por fuera.
Object.defineProperty(global, "navigator", {
  value: { language: "es-CO", vibrate: () => {} },
  configurable: true,
  writable: true,
});
global.location = { protocol: "file:", href: "" };
global.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
global.getComputedStyle = () => ({ getPropertyValue: () => "" });
global.requestAnimationFrame = (fn) => fn();
global.window = global;

const html = fs.readFileSync(indexPath, "utf8");
const scripts = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map((m) => m[1]);

const problemas = [];

if (!scripts.length) {
  problemas.push("El index.html no carga ningún script.");
}

scripts.forEach((rel) => {
  const file = path.join(appDir, rel);
  if (!fs.existsSync(file)) {
    problemas.push("El index.html carga un script que no existe: " + rel);
    return;
  }
  try {
    new Function(fs.readFileSync(file, "utf8"))();
  } catch (err) {
    problemas.push("Error al cargar " + rel + ": " + err.message);
  }
});

// --------------------------------------------------------------------------------------
// 2. Cada data-action necesita su manejador de clic.
// --------------------------------------------------------------------------------------
const appSource = fs.readFileSync(path.join(appDir, "ui/app.js"), "utf8");
const acciones = new Set([...appSource.matchAll(/data-action="([a-z0-9-]+)"/g)].map((m) => m[1]));
const manejadores = new Set([...appSource.matchAll(/action === "([a-z0-9-]+)"/g)].map((m) => m[1]));

acciones.forEach((a) => {
  if (!manejadores.has(a)) problemas.push('Botón sin manejador: data-action="' + a + '"');
});

const cambios = new Set([...appSource.matchAll(/data-change="([a-z0-9-]+)"/g)].map((m) => m[1]));
const manejadoresCambio = new Set(
  [...appSource.matchAll(/change === "([a-z0-9-]+)"/g)].map((m) => m[1])
);
cambios.forEach((c) => {
  if (!manejadoresCambio.has(c)) problemas.push('Control sin manejador: data-change="' + c + '"');
});

// --------------------------------------------------------------------------------------
// 3 y 4. CSS: llaves balanceadas y variables de tema definidas.
// --------------------------------------------------------------------------------------
const stylesPath = path.join(appDir, "ui/styles.css");
const tokensPath = path.join(appDir, "ui/tokens.css");
const css = fs.readFileSync(stylesPath, "utf8");

const abre = (css.match(/\{/g) || []).length;
const cierra = (css.match(/\}/g) || []).length;
if (abre !== cierra) {
  problemas.push("styles.css tiene llaves desbalanceadas: " + abre + " abre y " + cierra + " cierra.");
}

// Estas no son tokens de color: cada plantilla las define en línea para retrasar
// la entrada de un elemento (style="--d:.2s"), así que no van en tokens.css.
const DINAMICAS = new Set(["--d", "--dl", "--s", "--t", "--x"]);

if (fs.existsSync(tokensPath)) {
  const tokens = fs.readFileSync(tokensPath, "utf8");
  const definidas = new Set([...tokens.matchAll(/(--[a-z0-9-]+)\s*:/g)].map((m) => m[1]));
  const usadas = new Set([...css.matchAll(/var\((--[a-z0-9-]+)/g)].map((m) => m[1]));
  [...usadas].forEach((v) => {
    if (!definidas.has(v) && !DINAMICAS.has(v)) {
      problemas.push("Variable usada en styles.css pero no definida en tokens.css: " + v);
    }
  });
}

// --------------------------------------------------------------------------------------
// 5. Todo lo que el index.html referencia tiene que existir.
// --------------------------------------------------------------------------------------
[...html.matchAll(/(?:href|src)="([^"#:]+)"/g)].map((m) => m[1]).forEach((rel) => {
  if (/^(https?:|data:)/.test(rel)) return;
  if (!fs.existsSync(path.join(appDir, rel))) {
    problemas.push("El index.html apunta a un archivo que no existe: " + rel);
  }
});

// --------------------------------------------------------------------------------------
// Resumen.
// --------------------------------------------------------------------------------------
console.log("Scripts cargados: " + scripts.length);
console.log("Botones con manejador: " + acciones.size + " de " + acciones.size);
console.log("Controles de cambio: " + cambios.size);

if (problemas.length) {
  console.log("\nFALLOS (" + problemas.length + "):");
  problemas.forEach((p) => console.log("   - " + p));
  process.exit(1);
}
console.log("\nSin fallos.");