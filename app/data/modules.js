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
  {
    id: "FP",
    name: "Formulación de Proyectos de Ingeniería",
    color: "#0d9488",
    kind: "single-select",
    targetSeconds: 105,
    // Pesos oficiales: Marco de Referencia (Tabla 1, §2.3.4) y Guía de Orientación 2023-2
    // (Tabla 4), ambos coinciden. Ver docs/FUENTES.md.
    competencias: [
      { name: "Reconoce e identifica condiciones políticas, legislativas, socioeconómicas, técnicas y ambientales del entorno, relevantes para la caracterización y formulación de proyectos.", weight: 0.40 },
      { name: "Formula y evalúa el proyecto, apoyándose en un marco metodológico pertinente, a partir de las consideraciones del entorno y del análisis de alternativas.", weight: 0.40 },
      { name: "Reconoce su papel y responsabilidad disciplinar, social y ética como ingeniero en un contexto de desempeño profesional.", weight: 0.20 },
    ],
  },
  {
    id: "DS",
    name: "Diseño de Software",
    color: "#db2777",
    kind: "single-select",
    targetSeconds: 100,
    // La Guía de Orientación (aplicación 2024-2) no publica un desglose porcentual de pesos
    // por afirmación (no existe un marco de referencia separado para este módulo); los pesos
    // de abajo son un reparto igualitario propio de este proyecto, no un dato oficial de ICFES.
    competencias: [
      { name: "Analizar alternativas de solución y selecciona la más adecuada, teniendo en cuenta criterios técnicos, económicos, financieros, sociales, éticos y ambientales.", weight: 0.34 },
      { name: "Identificar y formular un problema de diseño a partir del análisis de una situación contextualizada, basado en información que puede ser incompleta, sobrante o incierta.", weight: 0.33 },
      { name: "Aplicar los conocimientos de las matemáticas, las ciencias, la tecnología y las ciencias de la ingeniería, para especificar de forma detallada un producto tecnológico.", weight: 0.33 },
    ],
  },
  {
    id: "PC",
    name: "Pensamiento Científico",
    color: "#65a30d",
    kind: "single-select",
    targetSeconds: 105,
    // Banco de solo núcleo común (ver cabecera de questions.pc.js): 5 competencias
    // transversales del marco de referencia, sin desglose porcentual oficial entre ellas
    // (el único peso oficial publicado es a nivel de componente: núcleo común 62.5% / núcleo
    // específico 37.5% del total de 40 preguntas del módulo real). Pesos iguales asumidos aquí.
    competencias: [
      { name: "Adquirir e interpretar información para abordar y entender una situación problema", weight: 0.20 },
      { name: "Analizar críticamente los resultados y derivar conclusiones", weight: 0.20 },
      { name: "Comprender, comparar, utilizar o proponer modelos que permiten describir, explicar y predecir fenómenos o sistemas", weight: 0.20 },
      { name: "Establecer estrategias adecuadas para abordar y resolver problemas", weight: 0.20 },
      { name: "Plantear preguntas y proponer explicaciones o conjeturas que puedan ser abordadas con rigor científico", weight: 0.20 },
    ],
  },
];
