// Verificación de los bancos de preguntas del proyecto SESP.
//
//   node tools/auditar.js
//
// Sin dependencias: usa el mismo motor de Node que ya está en la máquina.
// Se ejecuta en dos bloques:
//
//  1. CLAVES CONTRA LOS PDF OFICIALES. Las tablas de abajo están transcritas de la
//     sección "Información de cada pregunta" (RC, LC, CC, IN, FP, DS) y "Tabla de
//     respuestas correctas" (PC 2026) de cada cuadernillo del ICFES, que se pueden
//     volver a leer en data-source/ con:
//       pdftotext -layout data-source/<módulo>/*.pdf -
//     Si algún día se cambia una clave del banco, este script lo detecta; si se
//     cambia una de estas tablas, hay que volver a copiarla del PDF.
//
//  2. COHERENCIA INTERNA DE LOS BANCOS: ids únicos y con prefijo coherente con su
//     banco, correctOption dentro de las opciones, número de opciones que el examen
//     real usa, competencia registrada en modules.js, contextId resoluble y
//     coherente con appliesTo, imágenes referenciadas que existen en disco, y
//     explicaciones presentes, sin huérfanas ni sospechosamente cortas.
//
// Sale con código 1 si algo falla, para poder encadenarlo en cualquier revisión.

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
const APP = path.join(ROOT, "app");

// --------------------------------------------------------------------------------------
// Claves oficiales, transcritas de los cuadernillos del ICFES (posición -> letra).
// LC va de 1 a 26; la 15 está excluida del banco por contenido sensible.
// --------------------------------------------------------------------------------------
const CLAVES_OFICIALES = {
  RC: "B C B C A C A A B B B D B B D B A B A B C D C B C".split(" "),
  LC: "A B B D A C C A C B B D A B B C B B D D C B D D C B".split(" "),
  CC: "D C D B D D B C B C D C A D C A D A B D A C A C D".split(" "),
  IN: "F E B G H A B A C B B C B A A B C A B A B C A B A".split(" "),
  FP: "A D C C D D D C A B A A B C B A B C C C B C".split(" "),
  DS: "B D A C B D B A B D A C C B A D C B A B C A C B C".split(" "),
  PC: "C C B A A A C B B B B C B B C B B C C B D A B D".split(" "),
};

// --------------------------------------------------------------------------------------
// Carga de los bancos como lo haría el navegador (window.SESP.data).
// --------------------------------------------------------------------------------------
const ARCHIVOS = [
  "data/modules.js",
  "data/questions.rc.js", "data/questions.lc.js", "data/questions.cc.js",
  "data/questions.in.js", "data/questions.ce.js", "data/questions.fp.js",
  "data/questions.ds.js", "data/questions.pc.js",
  "data/questions.gen.rc.js", "data/questions.gen.lc.js", "data/questions.gen.cc.js",
  "data/questions.gen.in.js", "data/questions.gen.ce.js",
  // El banco del Simulacro 2026-2 no viene del ICFES: es un simulacro del
  // docente. Se carga igual para que pase por las mismas comprobaciones de
  // coherencia, y además por las suyas (bloque 3).
  "data/questions.s2.js",
  "data/explanations.js",
];

const sandbox = { window: {}, console };
vm.createContext(sandbox);
for (const archivo of ARCHIVOS) {
  const codigo = fs.readFileSync(path.join(APP, archivo), "utf8");
  try {
    vm.runInContext(codigo, sandbox, { filename: archivo });
  } catch (e) {
    console.error(`No se pudo cargar ${archivo}: ${e.message}`);
    process.exit(1);
  }
}
const D = sandbox.window.SESP.data;

const problemas = [];
const avisos = [];

// Preguntas del Simulacro 2026-2 (del docente, no del ICFES). Se definen aquí
// porque hacen falta en varios bloques de más abajo.
const esS2 = (q) => String(q.id || "").startsWith("S2-");

// --------------------------------------------------------------------------------------
// 1. Claves contra los PDF oficiales.
// --------------------------------------------------------------------------------------
console.log("1) Claves contra la tabla oficial de cada cuadernillo");
for (const [modulo, oficial] of Object.entries(CLAVES_OFICIALES)) {
  const banco = D.questions[modulo] || [];
  const malas = [];
  const ausentes = [];
  for (let posicion = 1; posicion <= oficial.length; posicion++) {
    const q = banco.find((x) => x.source && x.source.originalNumber === posicion);
    if (!q) { ausentes.push(posicion); continue; }
    if (q.correctOption !== oficial[posicion - 1]) {
      malas.push(`${q.id}: banco ${q.correctOption} / oficial ${oficial[posicion - 1]}`);
    }
  }
  console.log(`   ${modulo}: ${banco.length} preguntas, ${malas.length} discrepancias` +
    (ausentes.length ? `, posiciones ausentes: ${ausentes.join(",")}` : ""));
  if (modulo === "LC") console.log("      (la 15 está excluida del banco a propósito: ver docs/PLAN.md)");
  malas.forEach((m) => { console.log(`      ✗ ${m}`); problemas.push(`clave oficial: ${m}`); });
}

// --------------------------------------------------------------------------------------
// 2. Coherencia interna.
// --------------------------------------------------------------------------------------
console.log("\n2) Coherencia interna de los bancos");
const todas = [];
for (const [banco, preguntas] of Object.entries(D.questions)) {
  for (const q of preguntas) todas.push({ banco, q });
}

const modulos = new Map((D.modules || []).map((m) => [m.id, m]));
const vistas = new Map();

for (const { banco, q } of todas) {
  if (!q.id) { problemas.push(`${banco}: pregunta sin id`); continue; }
  if (vistas.has(q.id)) problemas.push(`id duplicado: ${q.id}`);
  vistas.set(q.id, q);
  // S2-CE-01 vive en el banco CE (es un ensayo, y los ensayos se guardan ahí),
  // pero su id lleva el prefijo del simulacro del que viene. Se acepta.
  const bancoEsperado = esS2(q) ? q.id.split("-")[0] : banco;
  if (!q.id.startsWith(bancoEsperado + "-")) problemas.push(`${q.id}: el prefijo no coincide con el banco ${banco}`);

  if (q.kind === "essay") {
    if (!q.prompt || !q.prompt.trim()) problemas.push(`${q.id}: ensayo sin enunciado`);
  } else {
    const keys = (q.options || []).map((o) => o.key);
    if (new Set(keys).size !== keys.length) problemas.push(`${q.id}: keys de opción repetidas`);
    // El examen ofrece 8 opciones en el emparejamiento de Inglés (Parte 2), 3 en las
    // Partes 3-5 de Inglés y 4 en el resto de módulos de opción múltiple.
    const minimo = q.module === "IN" ? (keys.length === 8 ? 8 : 3) : 4;
    if (keys.length < minimo) problemas.push(`${q.id}: le faltan opciones (tiene ${keys.join(",")})`);
    if (q.module !== "IN" && keys.length > 4) problemas.push(`${q.id}: más de 4 opciones`);
    if (!keys.includes(q.correctOption)) problemas.push(`${q.id}: correctOption "${q.correctOption}" no está entre las opciones`);
    if (!q.prompt || !q.prompt.trim()) problemas.push(`${q.id}: enunciado vacío`);
    for (const o of q.options || []) {
      if (!o.text || !String(o.text).trim()) problemas.push(`${q.id}: opción ${o.key} vacía`);
    }
  }

  const meta = modulos.get(q.module);
  if (!meta) problemas.push(`${q.id}: el módulo "${q.module}" no está en modules.js`);
  else if (q.competencia && !(meta.competencias || []).some((c) => c.name === q.competencia)
    && !(meta.parts || []).some((c) => c.name === q.competencia)) {
    // Para Inglés la competencia es la parte del examen y modules.js la modela en `parts`.
    problemas.push(`${q.id}: competencia "${q.competencia}" no figura en modules.js para ${q.module}`);
  }
}

// Contextos: resolubilidad y coherencia con appliesTo.
const idsContexto = new Set();
const imagenes = [];
for (const contextos of Object.values(D.contexts || {})) {
  for (const c of contextos) {
    idsContexto.add(c.id);
    if (c.image) imagenes.push(c.image.src);
    for (const id of c.appliesTo || []) if (!vistas.has(id)) problemas.push(`${c.id}: appliesTo apunta a ${id}, que no existe`);
  }
}
for (const { q } of todas) {
  const duenas = [];
  for (const contextos of Object.values(D.contexts || {})) {
    for (const c of contextos) if ((c.appliesTo || []).includes(q.id)) duenas.push(c.id);
  }
  if (q.contextId && !idsContexto.has(q.contextId)) problemas.push(`${q.id}: contextId ${q.contextId} no existe`);
  if (q.contextId && duenas.length && !duenas.includes(q.contextId)) {
    problemas.push(`${q.id}: apunta a ${q.contextId} pero figura en appliesTo de ${duenas.join(", ")}`);
  }
  if (!q.contextId && duenas.length) problemas.push(`${q.id}: sin contextId pero figura en ${duenas.join(", ")}`);
}

// Imágenes referenciadas vs. imágenes en disco.
for (const src of imagenes) {
  const p = path.join(APP, src);
  if (!fs.existsSync(p)) problemas.push(`imagen inexistente: ${src}`);
  else if (fs.statSync(p).size < 1000) problemas.push(`imagen sospechosamente pequeña: ${src}`);
}
const enDisco = fs.existsSync(path.join(APP, "assets/images"))
  ? fs.readdirSync(path.join(APP, "assets/images")).filter((f) => f.endsWith(".png"))
  : [];
// Los iconos de la PWA los referencia manifest.json, no un contexto de pregunta.
const manifest = path.join(APP, "manifest.json");
if (fs.existsSync(manifest)) {
  const m = JSON.parse(fs.readFileSync(manifest, "utf8"));
  (m.icons || []).forEach((ic) => imagenes.push(ic.src));
}
const sinReferenciar = enDisco.filter((f) => !imagenes.some((src) => src.endsWith(f)));
sinReferenciar.forEach((f) => avisos.push(`imagen en disco que ningún contexto referencia: ${f}`));

// Explicaciones: cobertura de las preguntas de opción múltiple, sin huérfanas.
// El banco S2 es la excepción, y a propósito: sus claves todavía no están
// verificadas por el docente, así que redactar la explicación ahora serviría
// para dar por buena una clave que puede cambiar. Sale como aviso, no como fallo,
// pero queda escrito en la salida de la auditoría para que no se pierda.
const explicaciones = D.explanations || {};
const conExplicacion = (q) => q.explanation || explicaciones[q.id];
let s2SinExplicacion = 0;
for (const { q } of todas) {
  if (q.kind === "essay") continue; // los ensayos se califican con rúbrica, no con explicación
  if (!conExplicacion(q)) {
    if (esS2(q)) { s2SinExplicacion++; continue; }
    problemas.push(`${q.id}: sin explicación`);
  }
  else if (String(conExplicacion(q)).length < 120) avisos.push(`${q.id}: explicación muy corta`);
}
for (const id of Object.keys(explicaciones)) {
  if (!vistas.has(id)) problemas.push(`explicación sin pregunta que la use: ${id}`);
}

// Totales del bloque 2.
const oficiales = todas.filter(({ q }) => !q.generated).length;
const generadas = todas.length - oficiales;
console.log(`   ${oficiales} preguntas oficiales + ${generadas} del banco propio = ${todas.length}`);
console.log(`   ${imagenes.length} imágenes referenciadas, ${enDisco.length} en disco`);

// --------------------------------------------------------------------------------------
// 3. El banco del Simulacro 2026-2.
// --------------------------------------------------------------------------------------
// No hay tabla oficial contra la que comparar (el documento del que salió no
// trae clave), así que aquí no se comprueba que las claves sean "correctas": se
// comprueba que estén marcadas como provisionales, que apunten a una opción que
// exista, y que el estudiante REALLY se entere de que son provisionales.
console.log("\n3) Banco del Simulacro 2026-2 (claves provisionales)");
const s2 = todas.filter(({ q }) => esS2(q));
if (s2.length) {
  let provisionales = 0;
  let sinDeclarar = [];
  const reparto = new Map();
  for (const { q } of s2) {
    if (q.keyStatus === "derived") provisionales++;
    else if (q.kind === "essay") { /* los ensayos no llevan clave */ }
    else sinDeclarar.push(q.id);
    if (q.correctOption) reparto.set(q.correctOption, (reparto.get(q.correctOption) || 0) + 1);
    // Que correctOption sea una opción de verdad ya lo comprueba el bloque 2.
  }
  const conClave = s2.filter(({ q }) => q.correctOption).length;
  console.log(`   ${s2.length} preguntas, ${provisionales} con clave derivada (pendiente del docente), ${conClave - provisionales} sin clave`);

  if (sinDeclarar.length) {
    // Una clave sin marcar sería el peor caso: parecería oficial sin serlo.
    sinDeclarar.forEach((id) => problemas.push(`${id}: clave sin keyStatus "derived" (parecería oficial y no lo está)`));
  }

  // Reparto desigual de claves: no es un error, pero en un examen real se nota,
  // y un estudiante que sospeche puede acertar sin leer. Se avisa para que el
  // docente lo mire cuando revise.
  const total = [...reparto.values()].reduce((a, b) => a + b, 0);
  if (total) {
    const cuotas = [...reparto.entries()].map(([k, n]) => `${k}:${n}`).join(" ");
    const ideal = total / 4;
    const peor = Math.max(...reparto.values());
    console.log(`   reparto de claves: ${cuotas} (ideal ${ideal.toFixed(1)} cada una)`);
    if (peor > ideal * 1.6) avisos.push(`S2: las claves están muy concentradas (${cuotas}). Repartiría mejor: un estudiante que sospeche puede acertar sin leer.`);
  }

  // Lo importante: que el estudiante vea el aviso. Si algún día se quita el
  // rótulo de "pendiente de verificación", la app estaría afirmando algo que
  // nadie ha comprobado.
  const app = fs.readFileSync(path.join(APP, "ui/app.js"), "utf8");
  if (!/S2-/.test(app) || !/pendiente de verificaci/i.test(app)) {
    problemas.push("S2: la app no avisa al estudiante de que las claves están pendientes de verificación");
  } else {
    console.log("   la app avisa al estudiante de que la clave está pendiente de verificación: sí");
  }
  if (s2SinExplicacion) {
    avisos.push(`S2: ${s2SinExplicacion} preguntas sin explicación (se escribirán cuando el docente verifique las claves)`);
  }
}

// --------------------------------------------------------------------------------------
// Resumen.
// --------------------------------------------------------------------------------------
if (avisos.length) {
  console.log("\nAvisos (no bloquean):");
  avisos.forEach((a) => console.log("   · " + a));
}
console.log("\n" + (problemas.length ? `FALLOS (${problemas.length}):` : "Sin fallos."));
problemas.forEach((p) => console.log("   ✗ " + p));
process.exit(problemas.length ? 1 : 0);