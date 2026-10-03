// Banco de preguntas — Formulación de Proyectos de Ingeniería (FP)
// Fuente: ICFES, "Cuadernillo de preguntas — Módulo de formulación de proyectos de ingeniería, Saber Pro" (2018)
// https://www.icfes.gov.co/wp-content/uploads/2025/01/20_02_Cuadernillo_de_preguntas-formulacion_de_proyectos_de_ingenieria_Saber_Pro_2018.pdf
// Transcripción literal de preguntas reales de aplicaciones anteriores. Uso académico (licencia ICFES).
//
// El cuadernillo fuente incluye, al final, una tabla "Información de cada pregunta" que asocia cada
// posición con una de tres afirmaciones oficiales (competencias) y su respuesta correcta; esa tabla
// se usó tal cual para llenar el campo competencia de cada pregunta, en lugar de inferirlo. Las tres
// afirmaciones y su ponderación oficial (40 % / 40 % / 20 %) se confirmaron, con el mismo texto
// literal, en el Marco de referencia y en la Guía de orientación del módulo (ver fuentes citadas en
// el reporte de construcción de este módulo). El campo contentArea, en cambio, sí es una
// categorización propia de este banco (a partir de los "contenidos temáticos" que ambos documentos
// oficiales listan para cada afirmación), no un campo que traiga el cuadernillo.
//
// A diferencia de RC, este cuadernillo no trae escenarios/casos compartidos por varias preguntas:
// cada una de las 22 preguntas presenta su propia situación autocontenida en el enunciado (igual que
// CC). Sin embargo, 6 preguntas incluyen una tabla o un diagrama de red de precedencias (AON) propio
// de esa única pregunta; esos casos se modelaron como contexts.FP con appliesTo de una sola
// pregunta, igual que ya ocurre en RC (p. ej. RC-2018-Q23) y LC (p. ej. LC-2018-Q07). Los tres
// diagramas de red (preguntas 7, 15 y 20) se representan como tabla de precedencias equivalente
// (actividad / precedente / duración), reconstruida a partir de las flechas del diagrama original y
// verificada contra la respuesta oficial de cada pregunta; no se generaron imágenes recortadas del
// PDF para este módulo.
window.SESP = window.SESP || {};
window.SESP.data = window.SESP.data || {};
window.SESP.data.contexts = window.SESP.data.contexts || {};
window.SESP.data.questions = window.SESP.data.questions || {};

window.SESP.data.contexts.FP = [
  {
    id: "FP-2018-CTX-01",
    module: "FP",
    type: "text+table",
    title: "Red de precedencias — 9 actividades (AON)",
    body: "La figura muestra la red de precedencias de un proyecto planeado con 9 actividades (A a I), representada como red de actividades en los nodos (AON — activity on node). Se transcribe aquí como tabla de precedencias equivalente al diagrama original.",
    table: {
      headers: ["Actividad", "Precedente", "Duración (días)"],
      rows: [
        ["A", "-", "6"],
        ["B", "A", "8"],
        ["C", "A", "4"],
        ["D", "A", "9"],
        ["E", "B y C", "7"],
        ["F", "C y D", "5"],
        ["G", "D", "3"],
        ["H", "E y F", "3"],
        ["I", "G", "2"]
      ]
    },
    appliesTo: ["FP-2018-Q07"]
  },
  {
    id: "FP-2018-CTX-02",
    module: "FP",
    type: "table",
    title: "Actividades para línea de transmisión de energía eléctrica",
    body: "Tabla de actividades, precedentes y duraciones (en días) para construir una línea de transmisión de energía eléctrica. El precedente de LN7 se transcribe tal como aparece impreso en el cuadernillo original, que lista \"LN4, LN5 y LN7\".",
    table: {
      headers: ["Actividad", "Precedente", "Duración"],
      rows: [
        ["LN1", "-", "3"],
        ["LN2", "-", "4"],
        ["LN3", "-", "3"],
        ["LN4", "LN1", "5"],
        ["LN5", "LN2", "5"],
        ["LN6", "LN2 y LN3", "2"],
        ["LN7", "LN4, LN5 y LN7", "5"]
      ]
    },
    appliesTo: ["FP-2018-Q08"]
  },
  {
    id: "FP-2018-CTX-03",
    module: "FP",
    type: "table",
    title: "Rentabilidad de mantequilla y queso azul",
    body: "Una empresa productora de lácteos reúne información financiera de dos de sus productos.",
    table: {
      headers: ["Concepto", "Mantequilla", "Queso azul"],
      rows: [
        ["Costo insumos requeridos por tonelada", "$500", "$6.000"],
        ["Se produce en", "1 día", "30 días"],
        ["Genera ingresos netos mensuales por", "$30.000", "$21.000"],
        ["Valor presente neto", "$12.500", "$12.000"],
        ["Periodo de repago", "15 días", "16 días"]
      ]
    },
    appliesTo: ["FP-2018-Q12"]
  },
  {
    id: "FP-2018-CTX-04",
    module: "FP",
    type: "table",
    title: "Alternativas de inversión mutuamente excluyentes",
    body: "Cuatro alternativas de inversión con su inversión inicial, valor presente neto (VPN) y tasa interna de retorno (TIR). La empresa considera que la TMAR (tasa mínima atractiva de retorno) es de 30 % anual.",
    table: {
      headers: ["Alternativa", "Inversión inicial (millones de $)", "VPN ($)", "TIR (%)"],
      rows: [
        ["1", "(6.000)", "0", "30"],
        ["2", "(6.000)", "1.068", "40"],
        ["3", "(7.200)", "0", "30"],
        ["4", "(7.200)", "1.009", "40"]
      ]
    },
    appliesTo: ["FP-2018-Q13"]
  },
  {
    id: "FP-2018-CTX-05",
    module: "FP",
    type: "text+table",
    title: "Red de actividades — expansión red de telecomunicaciones La Guajira",
    body: "Diagrama de red del proyecto de expansión de la red de telecomunicaciones del departamento de La Guajira, con 7 actividades (A1 a A7), sus duraciones en semanas y sus interdependencias. Se transcribe aquí como tabla de precedencias equivalente al diagrama original.",
    table: {
      headers: ["Actividad", "Precedente", "Duración (semanas)"],
      rows: [
        ["A1", "-", "3"],
        ["A2", "-", "3"],
        ["A3", "-", "4"],
        ["A4", "A1", "4"],
        ["A5", "A2", "5"],
        ["A6", "A3 y A4", "2"],
        ["A7", "A4, A5 y A6", "5"]
      ]
    },
    appliesTo: ["FP-2018-Q15"]
  },
  {
    id: "FP-2018-CTX-06",
    module: "FP",
    type: "text+table",
    title: "Diagrama de remodelación de vivienda",
    body: "Diagrama del proyecto de remodelación de una vivienda, con 6 actividades (A a F), sus duraciones en días y sus interdependencias. Se transcribe aquí como tabla de precedencias equivalente al diagrama original. El enunciado indica que la ruta crítica del diagrama es A, D, E y F.",
    table: {
      headers: ["Actividad", "Descripción", "Precedente", "Duración (días)"],
      rows: [
        ["A", "Demoler muro de cocina", "-", "3"],
        ["B", "Retirar alfombrado de piso", "-", "2"],
        ["C", "Realizar adecuaciones hidrosanitarias", "A", "7"],
        ["D", "Realizar adecuaciones eléctricas", "A y B", "8"],
        ["E", "Instalar nuevo piso de madera", "D", "6"],
        ["F", "Pintar muro y techo", "C y E", "9"]
      ]
    },
    appliesTo: ["FP-2018-Q20"]
  }
];

window.SESP.data.questions.FP = [
  { id: "FP-2018-Q01", module: "FP", source: { cuadernillo: "Cuadernillo de preguntas — Módulo de formulación de proyectos de ingeniería, Saber Pro", year: 2018, publisher: "ICFES", url: "https://www.icfes.gov.co/wp-content/uploads/2025/01/20_02_Cuadernillo_de_preguntas-formulacion_de_proyectos_de_ingenieria_Saber_Pro_2018.pdf", originalNumber: 1 }, contextId: null, competencia: "Reconoce su papel y responsabilidad disciplinar, social y ética como ingeniero en un contexto de desempeño profesional.", contentArea: "Ética profesional y responsabilidad social del ingeniero", situationContext: "laboral", kind: "single-select",
    prompt: "Juan trabaja en la empresa Ingenieros Consultores Ambientales. Pedro, su jefe inmediato, lo envía al campo de explotación de una empresa petrolera, que es cliente de la compañía, a desarrollar un proyecto para hacer un estudio de aguas. Juan, mientras lo realiza, encuentra que el manejo de los desechos de esa empresa es inadecuado, que la empresa está contaminando el medio ambiente y que esa acción es sancionable y multable. Al informarle esta situación a Pedro, este le ordena que reporte el estudio de aguas y que no haga comentarios sobre la situación de contaminación.\n\nFrente a su responsabilidad profesional, en el contexto dado, su acción más apropiada es:",
    options: [{ key: "A", text: "Solicitarle a su jefe inmediato que le informe al cliente de la situación de contaminación." }, { key: "B", text: "Solicitarle al gerente general de su empresa que informe sobre la situación de contaminación." }, { key: "C", text: "Que Juan le informe al cliente que su empresa está contaminando el medio ambiente." }, { key: "D", text: "Que Juan le informe al Ministerio del Medio Ambiente del caso de contaminación." }],
    correctOption: "A", tags: ["etica-profesional", "responsabilidad-social", "contaminacion-ambiental", "consultoria"] },

  { id: "FP-2018-Q02", module: "FP", source: { cuadernillo: "Cuadernillo de preguntas — Módulo de formulación de proyectos de ingeniería, Saber Pro", year: 2018, publisher: "ICFES", url: "https://www.icfes.gov.co/wp-content/uploads/2025/01/20_02_Cuadernillo_de_preguntas-formulacion_de_proyectos_de_ingenieria_Saber_Pro_2018.pdf", originalNumber: 2 }, contextId: null, competencia: "Reconoce su papel y responsabilidad disciplinar, social y ética como ingeniero en un contexto de desempeño profesional.", contentArea: "Impacto ambiental y social de los proyectos", situationContext: "comunitario-social", kind: "single-select",
    prompt: "Un hacendado recibe la licencia ambiental para la construcción y operación de una microcentral hidroeléctrica, que se instalará en una zona boscosa en la cuenca del río; esta le permitirá cubrir la demanda de una planta procesadora de alimentos.\n\nDe acuerdo con este resultado, los habitantes de la región analizaron los efectos de este proyecto y deciden objetar la licencia principalmente porque se",
    options: [{ key: "A", text: "beneficiará al propietario de la procesadora." }, { key: "B", text: "transformará el cauce natural de este río." }, { key: "C", text: "afectará una zona protegida para turismo." }, { key: "D", text: "modificará flora y fauna nativa de la zona." }],
    correctOption: "D", tags: ["licencia-ambiental", "impacto-ambiental", "hidroelectrica", "comunidad-afectada"] },

  { id: "FP-2018-Q03", module: "FP", source: { cuadernillo: "Cuadernillo de preguntas — Módulo de formulación de proyectos de ingeniería, Saber Pro", year: 2018, publisher: "ICFES", url: "https://www.icfes.gov.co/wp-content/uploads/2025/01/20_02_Cuadernillo_de_preguntas-formulacion_de_proyectos_de_ingenieria_Saber_Pro_2018.pdf", originalNumber: 3 }, contextId: null, competencia: "Reconoce su papel y responsabilidad disciplinar, social y ética como ingeniero en un contexto de desempeño profesional.", contentArea: "Ética profesional y responsabilidad social del ingeniero", situationContext: "laboral", kind: "single-select",
    prompt: "Durante la consolidación del informe técnico final de un proyecto del Plan de Ordenamiento Territorial (POT) de un municipio colombiano, un ingeniero copió una parte de un documento elaborado en otro estudio realizado por un profesional ajeno al presente proyecto, sin su previa autorización y sin darle los créditos a este.\n\nTeniendo en cuenta la reglamentación del ejercicio de la ingeniería y el Código de Ética Profesional, la actuación del ingeniero corresponde a una transgresión a la norma",
    options: [{ key: "A", text: "que establece los deberes del ingeniero con sus colegas y demás profesionales." }, { key: "B", text: "que vela por el respeto a la dignidad de su profesión." }, { key: "C", text: "que establece el respeto a sus colegas y demás profesionales." }, { key: "D", text: "que establece el deber general de cualquier ingeniero con su profesión." }],
    correctOption: "C", tags: ["plagio", "codigo-de-etica", "propiedad-intelectual", "informe-tecnico"] },

  { id: "FP-2018-Q04", module: "FP", source: { cuadernillo: "Cuadernillo de preguntas — Módulo de formulación de proyectos de ingeniería, Saber Pro", year: 2018, publisher: "ICFES", url: "https://www.icfes.gov.co/wp-content/uploads/2025/01/20_02_Cuadernillo_de_preguntas-formulacion_de_proyectos_de_ingenieria_Saber_Pro_2018.pdf", originalNumber: 4 }, contextId: null, competencia: "Reconoce su papel y responsabilidad disciplinar, social y ética como ingeniero en un contexto de desempeño profesional.", contentArea: "Ética profesional y responsabilidad social del ingeniero", situationContext: "laboral", kind: "single-select",
    prompt: "En la fase final del proyecto para la producción de un nuevo producto cerámico, se efectuaron pruebas de control de calidad, las cuales se realizaron con un equipo de laboratorio que requiere calibración semestral por una empresa certificadora.\n\nEl ingeniero a cargo del proyecto efectúa el análisis de los resultados de las pruebas realizadas en las últimas semanas, porque se aproxima la entrega del informe final ante el comité ejecutivo de la organización. El ingeniero se entera de que la certificación de calibración del equipo se venció hace un mes, por tanto, los datos registrados no son confiables.\n\nAnte esta situación y dada la premura para la entrega del informe final y las limitaciones presupuestarias, el ingeniero le propone al comité contratar un laboratorio privado que dispone de equipos calibrados y certificados, el cual cobra por prueba realizada. Como consecuencia, usted decide repetir aquellas pruebas que",
    options: [{ key: "A", text: "se elijan de manera aleatoria, de acuerdo con el cálculo del tamaño de una muestra." }, { key: "B", text: "hayan arrojado resultados muy alejados de los esperados en el proyecto." }, { key: "C", text: "hayan sido establecidas en la metodología definitiva del proyecto." }, { key: "D", text: "se consideren las más relevantes para ajustar los resultados del proyecto." }],
    correctOption: "C", tags: ["control-de-calidad", "calibracion-de-equipos", "integridad-de-datos", "etica-profesional"] },

  { id: "FP-2018-Q05", module: "FP", source: { cuadernillo: "Cuadernillo de preguntas — Módulo de formulación de proyectos de ingeniería, Saber Pro", year: 2018, publisher: "ICFES", url: "https://www.icfes.gov.co/wp-content/uploads/2025/01/20_02_Cuadernillo_de_preguntas-formulacion_de_proyectos_de_ingenieria_Saber_Pro_2018.pdf", originalNumber: 5 }, contextId: null, competencia: "Reconoce e identifica condiciones políticas, legislativas, socioeconómicas, técnicas y ambientales del entorno, relevantes para la caracterización y formulación de proyectos.", contentArea: "Caracterización del entorno del proyecto", situationContext: "laboral", kind: "single-select",
    prompt: "Una empresa colombiana está considerando ampliar su portafolio de productos y servicios, incursionando en el sector de la construcción y ha establecido dentro de su marco estratégico la producción de ladrillos y tejas derivados de la arcilla, atendiendo al mercado nacional e internacional. Para iniciar la formulación del proyecto, los ingenieros de la empresa cuentan con la siguiente información:\n\n1. Análisis de índice de precios del productor (IPP) en los 5 últimos años.\n2. Variaciones de precios del ladrillo y tejas a nivel nacional e internacional.\n3. Análisis de índice de Desarrollo Humano (IDH) nacional, en la última década.\n4. Análisis estadístico de la variación de la TRM (Tasa de cambio representativa del mercado) en los 10 últimos años.\n\nSiendo un proyecto de inversión, la información más pertinente para iniciar el análisis del entorno es la que se presenta en los numerales,",
    options: [{ key: "A", text: "1, 2 y 3." }, { key: "B", text: "2, 3 y 4." }, { key: "C", text: "1, 3 y 4." }, { key: "D", text: "1, 2 y 4." }],
    correctOption: "D", tags: ["analisis-del-entorno", "proyecto-de-inversion", "indicadores-economicos", "formulacion-de-proyectos"] },

  { id: "FP-2018-Q06", module: "FP", source: { cuadernillo: "Cuadernillo de preguntas — Módulo de formulación de proyectos de ingeniería, Saber Pro", year: 2018, publisher: "ICFES", url: "https://www.icfes.gov.co/wp-content/uploads/2025/01/20_02_Cuadernillo_de_preguntas-formulacion_de_proyectos_de_ingenieria_Saber_Pro_2018.pdf", originalNumber: 6 }, contextId: null, competencia: "Reconoce e identifica condiciones políticas, legislativas, socioeconómicas, técnicas y ambientales del entorno, relevantes para la caracterización y formulación de proyectos.", contentArea: "Tipología y etapas del proyecto (pre-inversión e inversión)", situationContext: "laboral", kind: "single-select",
    prompt: "Una entidad gubernamental está encargada de promover, financiar y ejecutar proyectos que mejoren la competitividad del país en mercados globalizados de bienes y servicios agropecuarios, con énfasis en el análisis de la eficiencia en la asignación de recursos presupuestarios y de logro de objetivos de desarrollo del país.\n\nPara efectos de clasificación del proyecto y sus correspondientes implicaciones en cuanto a enfoques, criterios y metodologías pertinentes a su formulación y evaluación, el proyecto se considera de índole",
    options: [{ key: "A", text: "social." }, { key: "B", text: "financiero." }, { key: "C", text: "agrícola." }, { key: "D", text: "económico." }],
    correctOption: "D", tags: ["clasificacion-de-proyectos", "sector-agropecuario", "entidad-gubernamental", "tipologia-de-proyectos"] },

  { id: "FP-2018-Q07", module: "FP", source: { cuadernillo: "Cuadernillo de preguntas — Módulo de formulación de proyectos de ingeniería, Saber Pro", year: 2018, publisher: "ICFES", url: "https://www.icfes.gov.co/wp-content/uploads/2025/01/20_02_Cuadernillo_de_preguntas-formulacion_de_proyectos_de_ingenieria_Saber_Pro_2018.pdf", originalNumber: 7 }, contextId: "FP-2018-CTX-01", competencia: "Reconoce e identifica condiciones políticas, legislativas, socioeconómicas, técnicas y ambientales del entorno, relevantes para la caracterización y formulación de proyectos.", contentArea: "Planeación del tiempo: cronograma y ruta crítica", situationContext: "laboral", kind: "single-select",
    prompt: "En la figura se muestra la red de precedencias de un proyecto que se ha planeado y tiene 9 actividades (A, B, C, D, E, F, G, H, I).\n\nFigura. Red de actividades en los nodos-AON (activity on node).\n\nDe acuerdo con el diagrama de precedencia presentado y el tiempo de cada actividad, la duración mínima del proyecto planeado será de",
    options: [{ key: "A", text: "18 días." }, { key: "B", text: "20 días." }, { key: "C", text: "23 días." }, { key: "D", text: "24 días." }],
    correctOption: "D", tags: ["ruta-critica", "red-de-precedencias", "aon", "cronograma"] },

  { id: "FP-2018-Q08", module: "FP", source: { cuadernillo: "Cuadernillo de preguntas — Módulo de formulación de proyectos de ingeniería, Saber Pro", year: 2018, publisher: "ICFES", url: "https://www.icfes.gov.co/wp-content/uploads/2025/01/20_02_Cuadernillo_de_preguntas-formulacion_de_proyectos_de_ingenieria_Saber_Pro_2018.pdf", originalNumber: 8 }, contextId: "FP-2018-CTX-02", competencia: "Formula y evalúa el proyecto, apoyándose en un marco metodológico pertinente, a partir de las consideraciones del entorno y del análisis de alternativas.", contentArea: "Planeación del tiempo: cronograma y ruta crítica", situationContext: "laboral", kind: "single-select",
    prompt: "Las siguientes actividades pueden formar parte de un proyecto para construir una línea de transmisión de energía eléctrica:\n\nEn las anteriores actividades, forman la ruta crítica",
    options: [{ key: "A", text: "Inicio-LN1-LN4-LN 7-Fin." }, { key: "B", text: "Inicio-LN 2-LN6-LN 7-Fin." }, { key: "C", text: "Inicio-LN 2-LN 5-LN 7-Fin." }, { key: "D", text: "Inicio-LN 3-LN6-LN 7-Fin." }],
    correctOption: "C", tags: ["ruta-critica", "cronograma", "linea-de-transmision", "gestion-de-tiempo"] },

  { id: "FP-2018-Q09", module: "FP", source: { cuadernillo: "Cuadernillo de preguntas — Módulo de formulación de proyectos de ingeniería, Saber Pro", year: 2018, publisher: "ICFES", url: "https://www.icfes.gov.co/wp-content/uploads/2025/01/20_02_Cuadernillo_de_preguntas-formulacion_de_proyectos_de_ingenieria_Saber_Pro_2018.pdf", originalNumber: 9 }, contextId: null, competencia: "Formula y evalúa el proyecto, apoyándose en un marco metodológico pertinente, a partir de las consideraciones del entorno y del análisis de alternativas.", contentArea: "Estimación y control de costos", situationContext: "laboral", kind: "single-select",
    prompt: "En el proyecto del Acueducto La Manguera, una actividad del tramo 1 de 30 m requiere un trabajo de 3 días (8 horas por día) y la utilización de los siguientes recursos:\n\n●     Un soldador calificado que trabaja a un costo de $10/h, con una dedicación de 100 % a la actividad.\n●     El costo de la tubería es de $50/m.\n●     Un equipo de soldar cuyo costo total de movilización es de $120 y su alquiler es de $20/hora.\n●     El motor del equipo de soldadura consume gasolina a una tasa de 5 galones/hora.\n●     El costo de la gasolina es de $10/galón.\n\nEl costo total, el costo fijo y el costo variable de la actividad, respectivamente, son:",
    options: [{ key: "A", text: "$3.540, $1.620, $1.920" }, { key: "B", text: "$3.540, $1.500, $2.040" }, { key: "C", text: "$2.340, $1.620, $720" }, { key: "D", text: "$2.340, $1.500, $840" }],
    correctOption: "A", tags: ["costos-fijos-y-variables", "estimacion-de-costos", "acueducto", "presupuesto"] },

  { id: "FP-2018-Q10", module: "FP", source: { cuadernillo: "Cuadernillo de preguntas — Módulo de formulación de proyectos de ingeniería, Saber Pro", year: 2018, publisher: "ICFES", url: "https://www.icfes.gov.co/wp-content/uploads/2025/01/20_02_Cuadernillo_de_preguntas-formulacion_de_proyectos_de_ingenieria_Saber_Pro_2018.pdf", originalNumber: 10 }, contextId: null, competencia: "Reconoce e identifica condiciones políticas, legislativas, socioeconómicas, técnicas y ambientales del entorno, relevantes para la caracterización y formulación de proyectos.", contentArea: "Caracterización del entorno del proyecto", situationContext: "laboral", kind: "single-select",
    prompt: "En la producción de pantallas publicitarias móviles para el mercado nacional, con un diseño de alto brillo y que emitan mensajes llamativos, se implementan sistemas de bajo consumo de energía y que remplacen la tecnología tradicional de iluminación.\n\nPara estimar el volumen mensual de producción de pantallas publicitarias móviles, los diseñadores del proyecto deben inicialmente considerar la variación de",
    options: [{ key: "A", text: "los precios de los dispositivos eléctricos y electrónicos." }, { key: "B", text: "la demanda de productos publicitarios innovadores." }, { key: "C", text: "el volumen de insumos en la fabricación de pantallas." }, { key: "D", text: "la oferta de fuentes de energía no convencionales." }],
    correctOption: "B", tags: ["estudio-de-mercado", "demanda", "manufactura", "entorno-del-proyecto"] },

  { id: "FP-2018-Q11", module: "FP", source: { cuadernillo: "Cuadernillo de preguntas — Módulo de formulación de proyectos de ingeniería, Saber Pro", year: 2018, publisher: "ICFES", url: "https://www.icfes.gov.co/wp-content/uploads/2025/01/20_02_Cuadernillo_de_preguntas-formulacion_de_proyectos_de_ingenieria_Saber_Pro_2018.pdf", originalNumber: 11 }, contextId: null, competencia: "Reconoce e identifica condiciones políticas, legislativas, socioeconómicas, técnicas y ambientales del entorno, relevantes para la caracterización y formulación de proyectos.", contentArea: "Estudio de mercado", situationContext: "laboral", kind: "single-select",
    prompt: "Una empresa quiere realizar un proyecto de readecuación, modernización y puesta en operación de plantas de procesamiento de fruta, las cuales han estado fuera del servicio por varios años, por lo que se analizaron los antecedentes del mercado y de la planta en los últimos 5 años antes del cierre. Su diagnóstico identificó los siguientes aspectos como causas del cierre:\n\n•     Variación de precios en el mercado, pérdidas de producto y desestimulo de los productores.\n•     Bajos rendimientos y poca utilidad de los cultivos.\n•     Falta de asesoría técnica al cultivador y de financiación.\n•     Altos costos operativos de conservación, transporte y distribución a los centros de consumo.\n•     Dificultades técnicas de procesamiento, de logística en la comercialización y deficiencias en los canales de distribución.\n•     Fluctuación en volúmenes de producción, incumplimiento en entregas y aumento en la demanda insatisfecha.\n\nPara cumplir el objetivo propuesto y teniendo en cuenta lo anterior, se debe realizar un estudio de mercado. Los aspectos para tener en cuenta en ese estudio son:",
    options: [{ key: "A", text: "La oferta actual y proyectada; la demanda insatisfecha a nivel nacional y regional; la variación de los precios en los últimos 5 años; los canales de distribución y comercialización existentes." }, { key: "B", text: "La determinación de volúmenes y precios de venta previstos para la operación de la planta; las pérdidas por conservación y transporte; las utilidades de producción y fuentes de financiación." }, { key: "C", text: "La determinación de la variación de precios de productos en el mercado; los rendimientos de los cultivos y los costos de producción, transporte y distribución a los centros de consumo." }, { key: "D", text: "La oferta actual y la demanda; la variación actual de los precios; la identificación de los procesos y los recursos para la readecuación y modernización de la planta de procesamiento." }],
    correctOption: "A", tags: ["estudio-de-mercado", "agroindustria", "oferta-y-demanda", "canales-de-distribucion"] },

  { id: "FP-2018-Q12", module: "FP", source: { cuadernillo: "Cuadernillo de preguntas — Módulo de formulación de proyectos de ingeniería, Saber Pro", year: 2018, publisher: "ICFES", url: "https://www.icfes.gov.co/wp-content/uploads/2025/01/20_02_Cuadernillo_de_preguntas-formulacion_de_proyectos_de_ingenieria_Saber_Pro_2018.pdf", originalNumber: 12 }, contextId: "FP-2018-CTX-03", competencia: "Formula y evalúa el proyecto, apoyándose en un marco metodológico pertinente, a partir de las consideraciones del entorno y del análisis de alternativas.", contentArea: "Evaluación financiera y rentabilidad", situationContext: "laboral", kind: "single-select",
    prompt: "Una empresa productora de lácteos analiza la rentabilidad de dos de sus productos, mantequilla y queso azul, y reúne la información que se muestra en la tabla.\n\nCon base en el análisis de esta información, el argumento más acertado es:",
    options: [{ key: "A", text: "La mantequilla es más viable financieramente que el queso azul, porque su valor presente neto es mayor." }, { key: "B", text: "El queso azul es más viable financieramente que la mantequilla, porque su periodo de repago es mayor." }, { key: "C", text: "La mantequilla es más rentable que el queso azul, porque sus ingresos netos mensuales son mayores." }, { key: "D", text: "El queso azul es más rentable que la mantequilla, porque el costo de sus insumos por tonelada es mayor." }],
    correctOption: "A", tags: ["evaluacion-financiera", "valor-presente-neto", "rentabilidad", "periodo-de-repago"] },

  { id: "FP-2018-Q13", module: "FP", source: { cuadernillo: "Cuadernillo de preguntas — Módulo de formulación de proyectos de ingeniería, Saber Pro", year: 2018, publisher: "ICFES", url: "https://www.icfes.gov.co/wp-content/uploads/2025/01/20_02_Cuadernillo_de_preguntas-formulacion_de_proyectos_de_ingenieria_Saber_Pro_2018.pdf", originalNumber: 13 }, contextId: "FP-2018-CTX-04", competencia: "Formula y evalúa el proyecto, apoyándose en un marco metodológico pertinente, a partir de las consideraciones del entorno y del análisis de alternativas.", contentArea: "Evaluación financiera y rentabilidad", situationContext: "laboral", kind: "single-select",
    prompt: "Con el propósito de incrementar el nivel de producción en un 20 %, una empresa Colombiana del sector privado efectúa el análisis financiero de cuatro alternativas mutuamente excluyentes, las cuales se presentan en la tabla. El gerente cuenta con autorización de la junta directiva para invertir $7.200 millones en el proyecto y la alternativa seleccionada debe ser la de mayor rentabilidad. La empresa considera que la TMAR (tasa mínima atractiva de retorno) es de 30 % anual.\n\nDe acuerdo con el análisis anterior, la alternativa que debe recomendársele a la junta directiva es la",
    options: [{ key: "A", text: "1" }, { key: "B", text: "2" }, { key: "C", text: "3" }, { key: "D", text: "4" }],
    correctOption: "B", tags: ["tir", "vpn", "tmar", "alternativas-de-inversion"] },

  { id: "FP-2018-Q14", module: "FP", source: { cuadernillo: "Cuadernillo de preguntas — Módulo de formulación de proyectos de ingeniería, Saber Pro", year: 2018, publisher: "ICFES", url: "https://www.icfes.gov.co/wp-content/uploads/2025/01/20_02_Cuadernillo_de_preguntas-formulacion_de_proyectos_de_ingenieria_Saber_Pro_2018.pdf", originalNumber: 14 }, contextId: null, competencia: "Reconoce e identifica condiciones políticas, legislativas, socioeconómicas, técnicas y ambientales del entorno, relevantes para la caracterización y formulación de proyectos.", contentArea: "Tipología y etapas del proyecto (pre-inversión e inversión)", situationContext: "laboral", kind: "single-select",
    prompt: "El equipo de ingenieros del área del diseño y desarrollo de una empresa que fabrica autopartes para vehículos automotores tiene asignado el estudio de prefactibilidad para el \"Rediseño de tapas gasolina\". El comité ejecutivo de la empresa les exige que las nuevas tapas de gasolina sean una innovación y, tengan bajo costo, dada las características del producto de la competencia.\n\nEn el próximo comité ejecutivo los ingenieros expondrán los resultados del estudio técnico, para lo cual deben presentar",
    options: [{ key: "A", text: "los bosquejos de la primera serie de tapas de gasolina con el nuevo diseño." }, { key: "B", text: "los proveedores de equipo para el ensamble del nuevo diseño de tapa de gasolina." }, { key: "C", text: "los diseños detallados y manuales de manufactura de las nuevas tapas de gasolina." }, { key: "D", text: "los pronósticos financieros sobre la venta con el nuevo diseño de tapas de gasolina." }],
    correctOption: "C", tags: ["estudio-de-prefactibilidad", "estudio-tecnico", "diseno-de-producto", "autopartes"] },

  { id: "FP-2018-Q15", module: "FP", source: { cuadernillo: "Cuadernillo de preguntas — Módulo de formulación de proyectos de ingeniería, Saber Pro", year: 2018, publisher: "ICFES", url: "https://www.icfes.gov.co/wp-content/uploads/2025/01/20_02_Cuadernillo_de_preguntas-formulacion_de_proyectos_de_ingenieria_Saber_Pro_2018.pdf", originalNumber: 15 }, contextId: "FP-2018-CTX-05", competencia: "Formula y evalúa el proyecto, apoyándose en un marco metodológico pertinente, a partir de las consideraciones del entorno y del análisis de alternativas.", contentArea: "Planeación del tiempo: cronograma y ruta crítica", situationContext: "laboral", kind: "single-select",
    prompt: "La compañía para la cual usted trabaja le encomienda desarrollar el cronograma del nuevo proyecto de expansión de la red de telecomunicaciones del departamento de La Guajira. De acuerdo con los objetivos por cumplir se definen las actividades que se muestran en la tabla.\n\nLa ruta crítica para el proyecto de expansión de la red de telecomunicaciones es:",
    options: [{ key: "A", text: "Inicio, A1, A4, A7, Fin." }, { key: "B", text: "Inicio, A1, A4, A6, A7, Fin." }, { key: "C", text: "Inicio, A2, A5, A7, Fin." }, { key: "D", text: "Inicio, A3, A6, A7, Fin." }],
    correctOption: "B", tags: ["ruta-critica", "cronograma", "telecomunicaciones", "red-de-actividades"] },

  { id: "FP-2018-Q16", module: "FP", source: { cuadernillo: "Cuadernillo de preguntas — Módulo de formulación de proyectos de ingeniería, Saber Pro", year: 2018, publisher: "ICFES", url: "https://www.icfes.gov.co/wp-content/uploads/2025/01/20_02_Cuadernillo_de_preguntas-formulacion_de_proyectos_de_ingenieria_Saber_Pro_2018.pdf", originalNumber: 16 }, contextId: null, competencia: "Formula y evalúa el proyecto, apoyándose en un marco metodológico pertinente, a partir de las consideraciones del entorno y del análisis de alternativas.", contentArea: "Estudio técnico y tecnológico", situationContext: "laboral", kind: "single-select",
    prompt: "Un grupo de profesionales y expertos en tecnología proyecta diseñar un nuevo producto que facilite la transferencia de archivos entre dispositivos móviles. Como una parte de su desarrollo, se deberá ejecutar la formulación y evaluación que garantice la viabilidad de su objetivo. En consecuencia, el equipo decidió iniciar con la elaboración de un estudio técnico, para lo cual las principales actividades por desarrollar deben ser:",
    options: [{ key: "A", text: "elaborar los diseños básicos del dispositivo y definir las alternativas en materiales y tipos de tecnologías para su elaboración y optimización de recursos." }, { key: "B", text: "determinar las tendencias de demanda de las tecnologías, materiales y diseños propuestos para el dispositivo de transferencia de archivos." }, { key: "C", text: "estimar las inversiones y los costos correspondientes al diseño tecnológico, materiales y elaboración del dispositivo de transferencia." }, { key: "D", text: "determinar la oferta real y proyectada de las tecnologías, materiales y diseños propuestos en el diseño conceptual del dispositivo." }],
    correctOption: "A", tags: ["estudio-tecnico", "formulacion-y-evaluacion", "desarrollo-de-producto", "tecnologia"] },

  { id: "FP-2018-Q17", module: "FP", source: { cuadernillo: "Cuadernillo de preguntas — Módulo de formulación de proyectos de ingeniería, Saber Pro", year: 2018, publisher: "ICFES", url: "https://www.icfes.gov.co/wp-content/uploads/2025/01/20_02_Cuadernillo_de_preguntas-formulacion_de_proyectos_de_ingenieria_Saber_Pro_2018.pdf", originalNumber: 17 }, contextId: null, competencia: "Formula y evalúa el proyecto, apoyándose en un marco metodológico pertinente, a partir de las consideraciones del entorno y del análisis de alternativas.", contentArea: "Estimación y control de costos", situationContext: "laboral", kind: "single-select",
    prompt: "Una empresa realizará la instalación de un gasoducto de 20 km cuyo presupuesto asignado es de $1.000 millones. La empresa determinó que con cuatro cuadrillas cuyo horario normal es 8 horas diarias, puede construir el proyecto en 5 meses, considerando que todas las cuadrillas trabajan con la misma eficiencia. A cada cuadrilla se le paga de acuerdo con la longitud de gasoducto que entregue.\n\nDespués de preparar el plan de trabajo con las condiciones anteriores, la empresa recibió una solicitud indicando que el proyecto se debe construir en 4 meses, lo cual representa una reducción del 20 % en tiempo respecto al plan inicial.\n\nLa mejor opción que la empresa puede adoptar para cumplir este requerimiento es:",
    options: [{ key: "A", text: "Solicitar un incremento del 20 % en el valor del presupuesto para compensar el cambio en tiempo." }, { key: "B", text: "Asignar una cuadrilla adicional para un total de 5 cuadrillas, con el fin de aumentar el rendimiento diario." }, { key: "C", text: "Incrementar el horario de trabajo de las 4 cuadrillas en 25 % lo cual aumentara, por cuadrilla, el costo por hora adicional en 40 %." }, { key: "D", text: "Remplazar las 4 cuadrillas previstas inicialmente por 4 cuadrillas más experimentadas con un rendimiento 20 % mayor y un costo 20 % más alto." }],
    correctOption: "B", tags: ["gestion-de-tiempo", "costo-beneficio", "cuadrillas-de-trabajo", "gasoducto"] },

  { id: "FP-2018-Q18", module: "FP", source: { cuadernillo: "Cuadernillo de preguntas — Módulo de formulación de proyectos de ingeniería, Saber Pro", year: 2018, publisher: "ICFES", url: "https://www.icfes.gov.co/wp-content/uploads/2025/01/20_02_Cuadernillo_de_preguntas-formulacion_de_proyectos_de_ingenieria_Saber_Pro_2018.pdf", originalNumber: 18 }, contextId: null, competencia: "Reconoce e identifica condiciones políticas, legislativas, socioeconómicas, técnicas y ambientales del entorno, relevantes para la caracterización y formulación de proyectos.", contentArea: "Tipología y etapas del proyecto (pre-inversión e inversión)", situationContext: "laboral", kind: "single-select",
    prompt: "Una organización regional abre un concurso, en el que se definen varias categorías, con el objetivo de premiar proyectos innovadores que incidan positivamente en la sostenibilidad de país.\n\nUn grupo de ingenieros quiere participar y para ello propone la fabricación y comercialización de productos de limpieza biodegradables para la industria. La participación en este concurso exige inscribirse en la categoría de proyectos",
    options: [{ key: "A", text: "de interés social." }, { key: "B", text: "económicos." }, { key: "C", text: "productivos." }, { key: "D", text: "de servicios." }],
    correctOption: "C", tags: ["tipologia-de-proyectos", "proyectos-productivos", "sostenibilidad", "innovacion"] },

  { id: "FP-2018-Q19", module: "FP", source: { cuadernillo: "Cuadernillo de preguntas — Módulo de formulación de proyectos de ingeniería, Saber Pro", year: 2018, publisher: "ICFES", url: "https://www.icfes.gov.co/wp-content/uploads/2025/01/20_02_Cuadernillo_de_preguntas-formulacion_de_proyectos_de_ingenieria_Saber_Pro_2018.pdf", originalNumber: 19 }, contextId: null, competencia: "Formula y evalúa el proyecto, apoyándose en un marco metodológico pertinente, a partir de las consideraciones del entorno y del análisis de alternativas.", contentArea: "Estimación y control de costos", situationContext: "laboral", kind: "single-select",
    prompt: "En un proyecto de construcción, una tarea cuya duración se estima en 5 semanas requiere para su realización:\n\n•         La compra inicial de equipos por valor de $5 millones.\n•         Alquiler de otros equipos a razón de $1 millón por mes. El periodo mínimo de alquiler es un mes.\n•         Mano de obra de un equipo de trabajo a razón de $400.000 por día.\n\nSi una semana consta de 5 días hábiles y un mes consta de 4 semanas, el costo de ejecución de esta tarea en 5 semanas es de $17 millones.\n\nAl efectuar un levantamiento detallado de las condiciones del proyecto, se identifica que la tarea no se puede cumplir en 5 semanas y que para completarla realmente se requieren 7 semanas. En estas condiciones, el costo de la actividad será",
    options: [{ key: "A", text: "$22 millones, debido al incremento en los costos de mano de obra y compra de equipos." }, { key: "B", text: "$21 millones, debido a mayores costos de alquiler de equipos y mano de obra." }, { key: "C", text: "$21 millones, debido al incremento en los costos de mano de obra." }, { key: "D", text: "$22 millones, debido al incremento en todos los costos variables." }],
    correctOption: "C", tags: ["estimacion-de-costos", "costos-variables", "mano-de-obra", "alquiler-de-equipos"] },

  { id: "FP-2018-Q20", module: "FP", source: { cuadernillo: "Cuadernillo de preguntas — Módulo de formulación de proyectos de ingeniería, Saber Pro", year: 2018, publisher: "ICFES", url: "https://www.icfes.gov.co/wp-content/uploads/2025/01/20_02_Cuadernillo_de_preguntas-formulacion_de_proyectos_de_ingenieria_Saber_Pro_2018.pdf", originalNumber: 20 }, contextId: "FP-2018-CTX-06", competencia: "Formula y evalúa el proyecto, apoyándose en un marco metodológico pertinente, a partir de las consideraciones del entorno y del análisis de alternativas.", contentArea: "Planeación del tiempo: cronograma y ruta crítica", situationContext: "familiar-personal", kind: "single-select",
    prompt: "Para un proyecto de remodelación de una vivienda se elabora el siguiente diagrama con sus actividades, interdependencias y duraciones en días, de forma que las actividades que corresponden a la ruta crítica son A, D, E y F.\n\nLos ingenieros que tienen a cargo el proyecto evalúan la posibilidad de modificar la duración de algunas actividades, con el fin de ajustarse a algunas condiciones del proyecto. Ante estas modificaciones, es correcto afirmar que",
    options: [{ key: "A", text: "la duración del proyecto se mantendrá igual y las actividades críticas serán A, D, E y F, si B se hace en 4 días." }, { key: "B", text: "la duración del proyecto se incrementará en 8 días y las actividades críticas serán A, C y F, si C se hace en 15 días." }, { key: "C", text: "la duración del proyecto se reducirá en 1 día y las actividades críticas serán B, D, E y F, si A se hace en 1 día." }, { key: "D", text: "la duración del proyecto se reducirá en 6 días y las actividades críticas serán A, C y F, si D se hace en 2 días." }],
    correctOption: "C", tags: ["ruta-critica", "diagrama-de-red", "remodelacion", "gestion-de-tiempo"] },

  { id: "FP-2018-Q21", module: "FP", source: { cuadernillo: "Cuadernillo de preguntas — Módulo de formulación de proyectos de ingeniería, Saber Pro", year: 2018, publisher: "ICFES", url: "https://www.icfes.gov.co/wp-content/uploads/2025/01/20_02_Cuadernillo_de_preguntas-formulacion_de_proyectos_de_ingenieria_Saber_Pro_2018.pdf", originalNumber: 21 }, contextId: null, competencia: "Reconoce e identifica condiciones políticas, legislativas, socioeconómicas, técnicas y ambientales del entorno, relevantes para la caracterización y formulación de proyectos.", contentArea: "Caracterización del entorno del proyecto", situationContext: "laboral", kind: "single-select",
    prompt: "Un diagnóstico efectuado a una plantación de hortalizas evidenció, altos periódos entre la siembra y cosecha que no permiten atender la demanda del mercado, las altas pérdidas de hortalizas debido a la variación de temperatura y altos consumos de energía.\n\nAnte esta situación, se deben mejorar los resultados en la producción e invertir en",
    options: [{ key: "A", text: "la construcción de un invernadero automatizado de hortalizas." }, { key: "B", text: "un estudio técnico para optimizar la producción de hortalizas." }, { key: "C", text: "la construcción de una bodega climatizada para el almacenar hortalizas." }, { key: "D", text: "un estudio financiero para evaluar los costos por consumo de energía." }],
    correctOption: "B", tags: ["estudio-tecnico", "diagnostico-de-produccion", "agroindustria", "invernadero"] },

  { id: "FP-2018-Q22", module: "FP", source: { cuadernillo: "Cuadernillo de preguntas — Módulo de formulación de proyectos de ingeniería, Saber Pro", year: 2018, publisher: "ICFES", url: "https://www.icfes.gov.co/wp-content/uploads/2025/01/20_02_Cuadernillo_de_preguntas-formulacion_de_proyectos_de_ingenieria_Saber_Pro_2018.pdf", originalNumber: 22 }, contextId: null, competencia: "Reconoce e identifica condiciones políticas, legislativas, socioeconómicas, técnicas y ambientales del entorno, relevantes para la caracterización y formulación de proyectos.", contentArea: "Caracterización del entorno del proyecto", situationContext: "comunitario-social", kind: "single-select",
    prompt: "Un proyecto de desarrollo local que incrementará la producción de alimentos permitirá, además de mejorar la infraestructura de la región, la electrificación de áreas agrícolas y la introducción de nuevas tecnologías. Teniendo en cuenta el efecto del proyecto en el contexto de las comunidades campesinas de la región, en su formulación será necesario",
    options: [{ key: "A", text: "aislar el proyecto alimentario del contexto actual, dado que se están consdirerando variables que son independientes del proyecto." }, { key: "B", text: "velar para que el proyecto se ejecute como un proceso autosuficiente y aislado a los variables cambiantes en el que se desarrolla." }, { key: "C", text: "considerar en el proyecto las variables económicos, sociales, culturales y otras que puedan incidir en el desarrollo del proyecto alimentario." }, { key: "D", text: "proponer un proyecto abierto y dinámico respecto a las comunidades campesinas y sectores económicos relacionados con el proyecto." }],
    correctOption: "C", tags: ["entorno-del-proyecto", "comunidades-campesinas", "desarrollo-local", "variables-socioeconomicas"] }
];
