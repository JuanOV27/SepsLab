// Metadata de presentación de los 5 módulos genéricos del Saber Pro.
// Sin preguntas aquí — solo lo necesario para pintar selectores, colores y
// tiempos objetivo. Fuente de las competencias/pesos: Guía de orientación del
// Examen Saber Pro, Aplicación 2026-1 (ICFES), ver docs/PLAN.md.
window.SESP = window.SESP || {};
window.SESP.data = window.SESP.data || {};

window.SESP.data.modules = [
  {
    id: "RC",
    name: "Razonamiento Cuantitativo",
    color: "#2563eb",
    kind: "single-select",
    targetSeconds: 100,
    competencias: [
      { name: "Interpretación y representación", weight: 0.33 },
      { name: "Formulación y ejecución", weight: 0.33 },
      { name: "Argumentación", weight: 0.34 },
    ],
  },
  {
    id: "LC",
    name: "Lectura Crítica",
    color: "#7c3aed",
    kind: "single-select",
    targetSeconds: 100,
    competencias: [
      { name: "Identifica contenidos locales", weight: 0.26 },
      { name: "Comprende articulación y sentido global", weight: 0.40 },
      { name: "Reflexiona y evalúa el contenido", weight: 0.34 },
    ],
  },
  {
    id: "CC",
    name: "Competencias Ciudadanas",
    color: "#059669",
    kind: "single-select",
    targetSeconds: 90,
    competencias: [
      { name: "Conocimientos", weight: 0.30 },
      { name: "Argumentación", weight: 0.20 },
      { name: "Multiperspectivismo", weight: 0.30 },
      { name: "Pensamiento sistémico", weight: 0.20 },
    ],
  },
  {
    id: "IN",
    name: "Inglés",
    color: "#d97706",
    kind: "single-select",
    targetSeconds: 90,
    // Partes del examen real alineadas al MCER/CEFR y su peso oficial. El banco de
    // preguntas de este proyecto solo cubre las Partes 2-5 (ver app/data/questions.in.js).
    parts: [
      { name: "Parte 1", weight: 0.11 },
      { name: "Parte 2", weight: 0.11 },
      { name: "Parte 3", weight: 0.11 },
      { name: "Parte 4", weight: 0.18 },
      { name: "Parte 5", weight: 0.16 },
      { name: "Parte 6", weight: 0.11 },
      { name: "Parte 7", weight: 0.22 },
    ],
  },
  {
    id: "CE",
    name: "Comunicación Escrita",
    color: "#dc2626",
    kind: "essay",
    // Esquema real: 10 min de planeación + 30 min de escritura = 40 min.
    // Para duraciones distintas a 60 min (Modo Exprés), se escala manteniendo
    // la proporción real 25% planeación / 75% escritura.
    essayScaling: {
      15: { planningMinutes: 4, writingMinutes: 11 },
      30: { planningMinutes: 8, writingMinutes: 22 },
      60: { planningMinutes: 10, writingMinutes: 30 },
    },
    rubricCriteria: ["planteamiento", "organizacion", "formaExpresion"],
  },
];
