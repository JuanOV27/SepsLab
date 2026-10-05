// Banco de preguntas — Pensamiento Científico (PC), núcleo común
// Fuente: ICFES, "Cuadernillo de preguntas — Módulo de pensamiento científico, Saber Pro" (2026)
// https://www.icfes.gov.co/wp-content/uploads/2026/06/20-mayo-cuadernillo-pensamiento-cientifico-saber-pro-2026.pdf
//
// Nota sobre el alcance de este banco: el módulo de Pensamiento Científico tiene un núcleo común
// (25 preguntas, compartidas por todas las áreas) y un núcleo específico (15 preguntas) de UNA de
// cinco áreas que elige la institución educativa (Ciencias Biológicas, Ciencias Físicas, Ciencias
// de la Tierra, Matemáticas y Estadística, o Química). Este cuadernillo de 24 preguntas corresponde
// al núcleo común: cubre las 5 competencias transversales del módulo repartidas de forma pareja
// entre las 5 disciplinas (no es un cuadernillo del núcleo específico de Matemáticas y Estadística,
// que ICFES no publica para consulta pública). Aplica sin importar qué área específica le asignen
// al usuario.
//
// Nota técnica de transcripción: el PDF de origen tiene el texto incrustado sin mapa a Unicode
// (pdftotext no extrae nada legible de ninguna página), así que cada pregunta se transcribió leyendo
// visualmente la página renderizada (pdftoppm), no copiando texto. Se verificaron las 24 respuestas
// correctas y las 5 competencias contra la tabla de respuestas oficial del propio cuadernillo
// (págs. 29-30). Revisión de contenido sensible: se revisaron visualmente las 24 preguntas sin
// encontrar nada parecido al único patrón que ha bloqueado contenido en este proyecto (explotación
// sexual de menores, ver docs/PLAN.md) — son preguntas de física, química, biología, geología y
// matemáticas sin ningún tema sensible.
//
// 7 preguntas (1, 3, 5, 8, 21, 22, 23) dependen de una gráfica/diagrama que solo se puede responder
// viéndolo (comparar formas o alturas de curvas/barras no descriptibles en texto sin revelar la
// respuesta): se incluyen con la imagen real recortada del cuadernillo, igual que en RC/LC.
window.SESP = window.SESP || {};
window.SESP.data = window.SESP.data || {};
window.SESP.data.contexts = window.SESP.data.contexts || {};
window.SESP.data.questions = window.SESP.data.questions || {};

const PC_SOURCE = {
  cuadernillo: "Cuadernillo Saber Pro — Pensamiento Científico (núcleo común)",
  year: 2026,
  publisher: "ICFES",
  url: "https://www.icfes.gov.co/wp-content/uploads/2026/06/20-mayo-cuadernillo-pensamiento-cientifico-saber-pro-2026.pdf",
};

window.SESP.data.contexts.PC = [
  {
    id: "PC-2026-CTX-01", module: "PC", type: "image",
    title: "Fluorescencia de dos candidatos a sensor",
    body: "Algunas sustancias pueden emitir luz, característica conocida como fluorescencia. Esta propiedad puede usarse en la construcción de sensores, en los cuales la detección se basa en la disminución considerable de la cantidad de luz emitida por la sustancia (decaimiento de la fluorescencia). Las gráficas muestran la fluorescencia de dos candidatos para la construcción de un sensor, tanto aislados como en presencia de la molécula X que se quiere detectar.",
    image: { src: "assets/images/PC-2026-CTX-01.png", alt: "Dos gráficas de fluorescencia vs. longitud de onda, una por candidato, cada una con una curva 'candidato aislado' y otra 'candidato en presencia de X'." },
    appliesTo: ["PC-2026-Q01"],
  },
  {
    id: "PC-2026-CTX-03", module: "PC", type: "image",
    title: "Crecimiento de fríjol inoculado con Rhyzobium",
    body: "Para mejorar la obtención de nitrógeno en suelos deficientes, se inocula a las leguminosas con bacterias Rhyzobium. Se recomienda no aplicar abono nitrogenado en altas dosis al momento de la siembra, pues si bien una alta concentración de nitrógeno mejora el crecimiento inicial, inhibe la asociación simbiótica y produce un desarrollo deficiente de la planta en etapas posteriores.",
    image: { src: "assets/images/PC-2026-CTX-03.png", alt: "Cuatro gráficas A-D de peso seco total vs. semanas, cada una comparando el crecimiento con y sin aplicación inicial de abono nitrogenado." },
    appliesTo: ["PC-2026-Q03"],
  },
  {
    id: "PC-2026-CTX-05", module: "PC", type: "image",
    title: "Geocronología detrítica de cuatro muestras",
    body: "La gráfica muestra los resultados obtenidos de geocronología detrítica procedente de cuatro (4) muestras tomadas de una capa de rocas sedimentarias de 210 Ma, cuya proveniencia es un complejo metamórfico formado hace 2500 Ma.",
    image: { src: "assets/images/PC-2026-CTX-05.png", alt: "Gráfica de probabilidad relativa de la edad vs. edad de circones detríticos (Ma), con cuatro curvas apiladas (Muestra 1 a 4)." },
    appliesTo: ["PC-2026-Q05"],
  },
  {
    id: "PC-2026-CTX-08", module: "PC", type: "image",
    title: "Correlación entre notas de asignaturas",
    body: "Se realiza un estudio con un grupo de estudiantes en diversas clases, para evaluar la relación entre los resultados de pares de asignaturas. Los datos se organizaron en las gráficas que se muestran a continuación.",
    image: { src: "assets/images/PC-2026-CTX-08.png", alt: "Dos diagramas de dispersión: Español vs. Cálculo, e Historia vs. Física." },
    appliesTo: ["PC-2026-Q08"],
  },
  {
    id: "PC-2026-CTX-21", module: "PC", type: "image",
    title: "Sucesión de rocas y Ley de Walther",
    body: "La Ley de Walther establece que una sucesión vertical de rocas con características similares (facies), sin discontinuidades estratigráficas, deben haber sido el producto de ambientes asociados espacialmente. De este modo, dichas facies han sido formadas en ambientes lateralmente adyacentes. La clasificación de las facies puede ser por características litológicas (similares o distintas) o por cómo se depositaron (al mismo tiempo o en tiempos distintos). En el modelo se observa una sucesión de rocas, depositadas en tres tiempos distintos (1, 2 y 3).",
    image: { src: "assets/images/PC-2026-CTX-21.png", alt: "Corte transversal de capas de roca dipping hacia la derecha, con una 'Línea M' vertical que corta las capas marcadas Tiempo 1, Tiempo 2 y Tiempo 3, y una leyenda de litología (conglomerados y arenitas, calizas, lodolitas, discordancia, basamento)." },
    appliesTo: ["PC-2026-Q21"],
  },
  {
    id: "PC-2026-CTX-22", module: "PC", type: "image",
    title: "Granulometría de sedimentos costeros",
    body: "En un sistema costero, el tamaño del sedimento que predomina en la parte alta de las playas depositado por las olas indica el régimen de la dinámica del oleaje sobre la costa: si predominan sedimentos de tamaño grueso, el régimen es erosivo (retroceso de la línea de costa); si el tamaño predominante es fino, el régimen es constructivo (avance de la línea de costa). La gráfica representa la distribución granulométrica promedio de muestras de sedimentos tomadas en la parte alta de una playa.",
    image: { src: "assets/images/PC-2026-CTX-22.png", alt: "Gráfica de barras de porcentaje vs. tipo de grano (Grava, A.mg, A.g, A.md, A.f, A.mf, Lodo), de grueso a fino." },
    appliesTo: ["PC-2026-Q22"],
  },
  {
    id: "PC-2026-CTX-23", module: "PC", type: "image",
    title: "Espectroscopía de óxidos de níquel",
    body: "En la fabricación de materiales, las superficies se someten a procesos como el recocido y el depositado, en los cuales se modifica la estructura química de la superficie. Un material analizado en un laboratorio se compone de níquel (Ni) y oxígeno (O), y puede estar formado por NiO o Ni₂O₃, según el estado de oxidación del níquel. Se muestran los resultados obtenidos al analizar la superficie de este material con un instrumento que permite conocer la cantidad relativa de Ni²⁺ y Ni³⁺ en cada proceso.",
    image: { src: "assets/images/PC-2026-CTX-23.png", alt: "Gráfica de intensidad vs. energía de unión (eV), con dos curvas (recocido y depositado) y dos picos marcados Ni³⁺ y Ni²⁺." },
    appliesTo: ["PC-2026-Q23"],
  },
];

window.SESP.data.questions.PC = [
  {
    id: "PC-2026-Q01", module: "PC", source: { ...PC_SOURCE, originalNumber: 1 }, contextId: "PC-2026-CTX-01",
    competencia: "Analizar críticamente los resultados y derivar conclusiones", contentArea: "Fluorescencia y sensores", situationContext: "divulgacion-cientifica",
    kind: "single-select",
    prompt: "Con base en la información anterior, ¿cuál es el mejor candidato para la construcción de un sensor?",
    options: [
      { key: "A", text: "El candidato 2, porque presenta mayor fluorescencia que el candidato 1." },
      { key: "B", text: "El candidato 1, porque, aunque hay una disminución en la fluorescencia, el valor no llega a ser cero." },
      { key: "C", text: "El candidato 1, porque presenta la mayor disminución de la fluorescencia." },
      { key: "D", text: "El candidato 2, porque la fluorescencia no se afecta tanto por la presencia de X." },
    ],
    correctOption: "C", tags: ["fluorescencia", "diseno-de-sensores"],
  },
  {
    id: "PC-2026-Q02", module: "PC", source: { ...PC_SOURCE, originalNumber: 2 }, contextId: null,
    competencia: "Analizar críticamente los resultados y derivar conclusiones", contentArea: "Diseño experimental — fisiología del ejercicio", situationContext: "divulgacion-cientifica",
    kind: "single-select",
    prompt: "En un estudio, se investigó si entrenar a 2.500 metros sobre el nivel del mar (m s. n. m.) mejora el desempeño de los atletas en competencias de ciudades costeras.\n\nEn el estudio se comparó el desempeño de tres atletas (H1, H2 y H3) que entrenaban en una ciudad a 2.500 m s. n. m. con otros tres atletas (L1, L2 y L3) que entrenaban en una ciudad costera al nivel del mar. Posteriormente, se midió el desempeño de los seis atletas, a varias intensidades de ejercicio, en la ciudad costera: todos alcanzaron valores de consumo de O2 similares entre sí (entre aprox. 35 y 60 mL/kg/min) a medida que aumentaba la intensidad, sin que el grupo de entrenamiento en altitud (H) se distinguiera claramente del grupo de nivel del mar (L).\n\nLos investigadores concluyeron que el desempeño dependía del atleta y no de la altitud del lugar donde se entrenaba.\n\n¿Qué cambios en la metodología propuesta por los investigadores les ayudaría a determinar mejor el efecto del entrenamiento a 2.500 m s. n. m. sobre el desempeño de los atletas?",
    options: [
      { key: "A", text: "Cambiar a un grupo de atletas de menor edad al evaluado en el primer experimento para medir el consumo de O2." },
      { key: "B", text: "Aumentar el rango de alturas del entrenamiento para estar más seguros de las conclusiones." },
      { key: "C", text: "Medir el consumo de oxígeno del mismo grupo de atletas antes y después de dos semanas de realizar el entrenamiento en altitud." },
      { key: "D", text: "Medir el consumo de oxígeno de los atletas después de la competencia en la ciudad costera." },
    ],
    correctOption: "C", tags: ["diseno-experimental", "variables-confusoras"],
  },
  {
    id: "PC-2026-Q03", module: "PC", source: { ...PC_SOURCE, originalNumber: 3 }, contextId: "PC-2026-CTX-03",
    competencia: "Adquirir e interpretar información para abordar y entender una situación problema", contentArea: "Diseño experimental — fijación de nitrógeno", situationContext: "divulgacion-cientifica",
    kind: "single-select",
    prompt: "Con base en la información anterior, ¿cuál de las siguientes gráficas mostraría los resultados esperados del crecimiento de un cultivo de fríjol inoculado con Rhyzobium, con una sola fertilización inicial y sin fertilización inicial con abono nitrogenado?",
    options: [
      { key: "A", text: "Gráfica A (ver imagen)." },
      { key: "B", text: "Gráfica B (ver imagen)." },
      { key: "C", text: "Gráfica C (ver imagen)." },
      { key: "D", text: "Gráfica D (ver imagen)." },
    ],
    correctOption: "B", tags: ["diseno-experimental", "fijacion-de-nitrogeno"],
  },
  {
    id: "PC-2026-Q04", module: "PC", source: { ...PC_SOURCE, originalNumber: 4 }, contextId: null,
    competencia: "Comprender, comparar, utilizar o proponer modelos que permiten describir, explicar y predecir fenómenos o sistemas", contentArea: "Nanopartículas — modelo de la partícula en una caja", situationContext: "divulgacion-cientifica",
    kind: "single-select",
    prompt: "Cuando se fabrican partículas de un semiconductor (selenuro de cadmio, CdSe) a escala nanométrica, el gap energético entre la banda de conducción y la banda de valencia aumenta, respecto al gap de partículas fabricadas a escala macroscópica. En escala \"nano\", el gap energético depende principalmente de las características de la nanopartícula. Para explicar este comportamiento se utiliza el modelo de la partícula en una caja, en el que se modela la energía de una sola partícula confinada en una caja tridimensional y se relacionan estas propiedades a través de la siguiente ecuación:\n\nE_nanopartícula = E_material + (ħ²π²)/(2μr²)\n\nDonde: E_nanopartícula = gap energético de las partículas de CdSe a escala nanométrica. E_material = gap energético de las partículas de CdSe a escala macroscópica. ħ = constante de Dirac. μ = masa de la nanopartícula. r = radio de la nanopartícula.\n\nTeniendo en cuenta el modelo de la partícula en una caja, ¿si se quiere maximizar el gap energético de las nanopartículas de CdSe, qué variables deben modificarse?",
    options: [
      { key: "A", text: "Se debe disminuir el radio (r) y la masa de las nanopartículas (μ); el gap energético de las partículas a escala macroscópica (E_material) no se puede modificar porque es una constante." },
      { key: "B", text: "Se debe disminuir el radio (r) y el gap energético de las partículas a escala macroscópica (E_material); la masa de las nanopartículas (μ) no se puede modificar porque es una constante." },
      { key: "C", text: "Se debe aumentar el radio (r) y la masa de las nanopartículas (μ); el gap energético de las partículas a escala macroscópica (E_material) debe disminuirse." },
      { key: "D", text: "Se debe aumentar la masa de las nanopartículas (μ) y el gap energético de las partículas a escala macroscópica (E_material); el radio (r) debe disminuirse." },
    ],
    correctOption: "A", tags: ["nanotecnologia", "mecanica-cuantica"],
  },
  {
    id: "PC-2026-Q05", module: "PC", source: { ...PC_SOURCE, originalNumber: 5 }, contextId: "PC-2026-CTX-05",
    competencia: "Adquirir e interpretar información para abordar y entender una situación problema", contentArea: "Geocronología — circones detríticos", situationContext: "divulgacion-cientifica",
    kind: "single-select",
    prompt: "¿Cuál de las muestras en la gráfica tiene resultados más precisos para documentar un evento metamórfico ocurrido entre 1600 Ma y 2000 Ma?",
    options: [
      { key: "A", text: "La muestra 4, porque presenta una menor dispersión en el pico alrededor de 1800 Ma." },
      { key: "B", text: "La muestra 3, porque presenta una baja probabilidad relativa alrededor de 1800 Ma." },
      { key: "C", text: "La muestra 2, porque presenta probabilidades en todo el rango de 1600 Ma a 2000 Ma." },
      { key: "D", text: "La muestra 1, porque presenta la mayor probabilidad relativa a la edad de 1900 Ma." },
    ],
    correctOption: "A", tags: ["geocronologia", "precision-de-medicion"],
  },
  {
    id: "PC-2026-Q06", module: "PC", source: { ...PC_SOURCE, originalNumber: 6 }, contextId: null,
    competencia: "Establecer estrategias adecuadas para abordar y resolver problemas", contentArea: "Trabajo y potencia mecánica", situationContext: "familiar-personal",
    kind: "single-select",
    prompt: "Un atleta hace el siguiente experimento con el propósito de estimar la potencia que pueden desarrollar sus piernas. Sube trotando por las escaleras de un edificio, de altura conocida, mientras lleva cajas de 20 kg, 40 kg y 60 kg. La potencia será calculada usando la ecuación\n\nP = mgh / t\n\nDonde m es la masa, g la aceleración de la gravedad, h la altura del edificio y t el tiempo que tarda en subir.\n\nAdemás de la información suministrada, ¿qué más debe conocer el atleta para lograr su propósito?",
    options: [
      { key: "A", text: "Su masa." },
      { key: "B", text: "La longitud de sus piernas." },
      { key: "C", text: "El tiempo que tarda en subir el edificio sin cajas." },
      { key: "D", text: "El promedio de los tiempos medidos para diferentes cajas." },
    ],
    correctOption: "A", tags: ["trabajo-y-potencia", "diseno-experimental"],
  },
  {
    id: "PC-2026-Q07", module: "PC", source: { ...PC_SOURCE, originalNumber: 7 }, contextId: null,
    competencia: "Comprender, comparar, utilizar o proponer modelos que permiten describir, explicar y predecir fenómenos o sistemas", contentArea: "Dinámica — fuerza de fricción con el aire", situationContext: "divulgacion-cientifica",
    kind: "single-select",
    prompt: "Un modelo para el análisis de las fuerzas que actúan sobre un paracaidista cuando desciende considera dos fuerzas: la fuerza de fricción con el aire Ff, hacia arriba, dada por |Ff| = b·v² (donde b es una constante y v es la velocidad con la que desciende el paracaidista), y el peso mg, hacia abajo.\n\n¿Cuál de las siguientes opciones es una predicción que se puede hacer teniendo en cuenta el modelo?",
    options: [
      { key: "A", text: "Cuando |Ff| es igual a |mg|, la velocidad de caída del paracaidista es cero." },
      { key: "B", text: "Si |mg| es mayor que |Ff|, la aceleración del paracaidista es hacia arriba." },
      { key: "C", text: "Si |Ff| es igual a |mg|, la aceleración del paracaidista es cero." },
      { key: "D", text: "Durante toda la caída, la aceleración del paracaidista es g." },
    ],
    correctOption: "C", tags: ["dinamica", "velocidad-terminal"],
  },
  {
    id: "PC-2026-Q08", module: "PC", source: { ...PC_SOURCE, originalNumber: 8 }, contextId: "PC-2026-CTX-08",
    competencia: "Adquirir e interpretar información para abordar y entender una situación problema", contentArea: "Correlación estadística", situationContext: "divulgacion-cientifica",
    kind: "single-select",
    prompt: "De acuerdo con lo anterior, ¿cuál de las siguientes conclusiones sobre las notas es correcta?",
    options: [
      { key: "A", text: "La nota de Español depende de la nota en Cálculo porque su correlación es alta; entre las notas de Historia y Física no hay tal dependencia." },
      { key: "B", text: "Existe una baja correlación entre las notas de Física e Historia; hay una alta correlación entre las notas de Cálculo y Español." },
      { key: "C", text: "En ninguno de los dos casos se puede concluir existencia de correlación entre las notas de las asignaturas." },
      { key: "D", text: "Dada la correlación entre las notas de Español y Cálculo, se observa que aumentos en la nota de Español ocasionan aumentos en la nota de Cálculo." },
    ],
    correctOption: "B", tags: ["correlacion", "estadistica"],
  },
  {
    id: "PC-2026-Q09", module: "PC", source: { ...PC_SOURCE, originalNumber: 9 }, contextId: null,
    competencia: "Establecer estrategias adecuadas para abordar y resolver problemas", contentArea: "Geometría analítica — curvas paramétricas", situationContext: "divulgacion-cientifica",
    kind: "single-select",
    prompt: "Un resorte de n vueltas se parametriza en el espacio como\n\nf(s) = (x = cos(2s), y = sen(2s), z = s/π) con s en [0, nπ]\n\nDe acuerdo con la información anterior, ¿qué par de puntos sirven para calcular la distancia (d) entre cada vuelta del resorte?",
    options: [
      { key: "A", text: "f(0) y f(π/2)." },
      { key: "B", text: "f(0) y f(π)." },
      { key: "C", text: "f(0) y f(π/4)." },
      { key: "D", text: "f(0) y f(1)." },
    ],
    correctOption: "B", tags: ["curvas-parametricas", "geometria-analitica"],
  },
  {
    id: "PC-2026-Q10", module: "PC", source: { ...PC_SOURCE, originalNumber: 10 }, contextId: null,
    competencia: "Adquirir e interpretar información para abordar y entender una situación problema", contentArea: "Bioestratigrafía — datación por fósiles", situationContext: "divulgacion-cientifica",
    kind: "single-select",
    prompt: "Para datar la edad de las rocas sedimentarias es común el uso de fósiles; este método da como resultado intervalos de tiempo. En una columna de rocas se documentó el rango de edad (en millones de años, Ma) en el que existió cada uno de cuatro fósiles: F1 aparece de forma continua entre 10 y 90 Ma; F2 aparece entre 20 y 50 Ma; F3 aparece entre 20 y 60 Ma; F4 aparece entre 40 y 80 Ma.\n\nDespués de tomar 500 muestras en una capa de rocas se encuentran los fósiles F1, F2 y F3, pero no F4. Con base en estos resultados, ¿cuál es la edad de la capa?",
    options: [
      { key: "A", text: "Entre 10 y 90 millones de años." },
      { key: "B", text: "Entre 20 y 40 millones de años." },
      { key: "C", text: "Entre 20 y 50 millones de años." },
      { key: "D", text: "Entre 10 y 60 millones de años." },
    ],
    correctOption: "B", tags: ["bioestratigrafia", "datacion-por-fosiles"],
  },
  {
    id: "PC-2026-Q11", module: "PC", source: { ...PC_SOURCE, originalNumber: 11 }, contextId: null,
    competencia: "Plantear preguntas y proponer explicaciones o conjeturas que puedan ser abordadas con rigor científico", contentArea: "Superconductividad", situationContext: "divulgacion-cientifica",
    kind: "single-select",
    prompt: "A los materiales en los que la resistencia eléctrica se anula, al disminuir su temperatura por debajo de un valor crítico Tc, se les llama superconductores. En un laboratorio se preguntan si la Tc de determinado superconductor depende del ancho de la muestra. Para responder la pregunta, se midió la temperatura crítica de diferentes muestras del material superconductor cuya única diferencia fue su ancho. Los resultados (anchos entre 2 mm y 8 mm) muestran valores de Tc agrupados cerca de 70-75 K en todo el rango medido, sin mostrar una tendencia clara con el ancho.\n\nTeniendo en cuenta la información anterior, ¿qué nueva pregunta podría derivarse de este estudio?",
    options: [
      { key: "A", text: "¿Por qué unos materiales son superconductores y otros no?" },
      { key: "B", text: "¿Cambia el valor de Tc cuando el ancho de la muestra es menor que 2 mm?" },
      { key: "C", text: "¿Cuál es el mejor modelo para explicar la superconductividad?" },
      { key: "D", text: "¿Cómo cambia Tc cuando el ancho de la muestra está entre 2 mm y 8 mm?" },
    ],
    correctOption: "B", tags: ["superconductividad", "diseno-experimental"],
  },
  {
    id: "PC-2026-Q12", module: "PC", source: { ...PC_SOURCE, originalNumber: 12 }, contextId: null,
    competencia: "Adquirir e interpretar información para abordar y entender una situación problema", contentArea: "Precisión y exactitud de instrumentos", situationContext: "laboral",
    kind: "single-select",
    prompt: "En una tienda se utilizan tres pesas, con la certeza de que la pesa X está bien calibrada pero no se sabe cómo están las otras dos. Se pesaron cuatro productos en las tres pesas y se obtuvieron los siguientes resultados:\n\nProducto — X (kg) — Y (kg) — Z (kg)\nFresas — 4,0 — 4,0 — 4,3\nNaranjas — 4,0 — 4,1 — 4,2\nManzanas — 4,0 — 4,0 — 4,3\nLimones — 4,0 — 4,1 — 4,2\n\nTeniendo en cuenta los resultados obtenidos para las pesas Y y Z, ¿cuál de las dos proporciona los resultados más exactos?",
    options: [
      { key: "A", text: "La pesa Y, porque dos mediciones son iguales a las de la pesa X." },
      { key: "B", text: "La pesa Z, porque sus cuatro mediciones son cercanas entre ellas." },
      { key: "C", text: "La pesa Y, porque las cuatro mediciones son cercanas a las de la pesa X." },
      { key: "D", text: "La pesa Z, porque hay dos pares de mediciones iguales entre sí." },
    ],
    correctOption: "C", tags: ["exactitud-y-precision", "metrologia"],
  },
  {
    id: "PC-2026-Q13", module: "PC", source: { ...PC_SOURCE, originalNumber: 13 }, contextId: null,
    competencia: "Establecer estrategias adecuadas para abordar y resolver problemas", contentArea: "Oscilador armónico — ley de Hooke", situationContext: "divulgacion-cientifica",
    kind: "single-select",
    prompt: "Una molécula diatómica puede modelarse como un sistema de dos masas unidas por un resorte, en el que la constante de elasticidad del resorte daría cuenta de la fuerza de ligadura entre los átomos de acuerdo con la ley de Hooke:\n\nFuerza = −K · Δx\n\nDonde K es la constante del resorte y Δx es la distancia entre los átomos que conforman la molécula.\n\nSi se considera el caso en el que los dos átomos son iguales, la frecuencia de oscilación de la molécula podría expresarse como\n\nf = (1/2π) · √(2K/m)\n\nDonde m es la masa de cada átomo. En la práctica, se mide la frecuencia de oscilación de la molécula para determinar la fuerza efectiva entre los átomos. En este caso, ¿cuáles serían las variables de entrada y de salida del modelo?",
    options: [
      { key: "A", text: "Entrada: la frecuencia de oscilación, la constante del resorte y la masa de los átomos. Salida: la fuerza efectiva entre los átomos." },
      { key: "B", text: "Entrada: la masa de los átomos, la frecuencia de oscilación y la distancia interatómica. Salida: la fuerza efectiva entre los átomos." },
      { key: "C", text: "Entrada: la constante del resorte, la distancia interatómica y la masa del resorte. Salida: la frecuencia de oscilación." },
      { key: "D", text: "Entrada: la fuerza entre los átomos, la frecuencia de oscilación y la masa del resorte. Salida: la energía de ligadura." },
    ],
    correctOption: "B", tags: ["oscilador-armonico", "modelos-fisicos"],
  },
  {
    id: "PC-2026-Q14", module: "PC", source: { ...PC_SOURCE, originalNumber: 14 }, contextId: null,
    competencia: "Plantear preguntas y proponer explicaciones o conjeturas que puedan ser abordadas con rigor científico", contentArea: "Selección sexual y evolución", situationContext: "divulgacion-cientifica",
    kind: "single-select",
    prompt: "Se cree que el color llamativo de los machos en ciertas especies de peces puede ser explicado por la siguiente hipótesis de selección sexual: \"las hembras eligen machos con características prominentes, como aletas caudales grandes y coloridas, pero estas características tienen un costo, porque mantenerlas hasta la edad reproductiva implica mayores gastos energéticos y hace a los machos más vulnerables\". ¿Cuál de las siguientes premisas apoya esta hipótesis?",
    options: [
      { key: "A", text: "Los peces machos tienen color llamativo únicamente durante la época reproductiva y el color sirve para señalar vigor sexual." },
      { key: "B", text: "Los peces machos con colores llamativos son identificados más fácilmente por depredadores, pero tienen mayor probabilidad de reproducirse en la etapa adulta." },
      { key: "C", text: "Los peces machos compiten entre sí por las hembras y solo los machos vencedores se reproducen." },
      { key: "D", text: "El color llamativo de los machos es heredable y es seleccionado porque las hembras buscan tener crías con colores llamativos para continuar en la próxima generación." },
    ],
    correctOption: "B", tags: ["seleccion-sexual", "evolucion"],
  },
  {
    id: "PC-2026-Q15", module: "PC", source: { ...PC_SOURCE, originalNumber: 15 }, contextId: null,
    competencia: "Establecer estrategias adecuadas para abordar y resolver problemas", contentArea: "Diseño experimental — antibióticos", situationContext: "divulgacion-cientifica",
    kind: "single-select",
    prompt: "En un hospital realizaron el siguiente protocolo a algunos pacientes con infecciones bacterianas:\n\n1. Toma de muestras de las secreciones donde se presenta infección bacteriana en los pacientes.\n2. Siembra de las muestras de cada paciente en medios de cultivo con tetraciclina, penicilina o sulfonamidas como antibióticos.\n3. Tabulación de resultados (muestras de 3 pacientes, en medios con tetraciclina, penicilina, sulfonamidas y un control sin antibiótico), donde se colocará (+) si hay crecimiento de bacterias y (−) si no hay crecimiento de bacterias.\n\nCon base en la información anterior, ¿qué se quiere con este protocolo?",
    options: [
      { key: "A", text: "Analizar los antibióticos que causan efectos secundarios en cada paciente." },
      { key: "B", text: "Establecer el medio de cultivo que permite el crecimiento de todo tipo de bacterias." },
      { key: "C", text: "Identificar el antibiótico a usar, para que disminuya la infección de cada paciente." },
      { key: "D", text: "Cuantificar el número de bacterias que posee cada uno de los pacientes enfermos." },
    ],
    correctOption: "C", tags: ["diseno-experimental", "microbiologia"],
  },
  {
    id: "PC-2026-Q16", module: "PC", source: { ...PC_SOURCE, originalNumber: 16 }, contextId: null,
    competencia: "Adquirir e interpretar información para abordar y entender una situación problema", contentArea: "Diseño experimental — fijación de nitrógeno en soya", situationContext: "divulgacion-cientifica",
    kind: "single-select",
    prompt: "En un estudio se quiere probar el efecto de las bacterias fijadoras de nitrógeno sobre el crecimiento de frutos en plantas de soya. Para esto se tomaron varias plantas de soya; a un grupo (P) de estas plantas se le inocularon bacterias fijadoras de nitrógeno, y al otro grupo (R) no se le inocularon. Se registró, después de 150 días del experimento, el peso del fruto (g) en una muestra de 5 plantas de cada grupo:\n\nPlanta — P (inoculadas) — R (no inoculadas)\n1 — 1,76 — 0,49\n2 — (sin dato) — 0,85\n3 — 1,03 — (sin dato)\n4 — 1,53 — 1,54\n5 — (sin dato) — 1,01\n\nEn algunas de estas plantas no se registraron datos porque fueron atacadas por una plaga; por tanto, hay una incertidumbre en los datos. Para disminuir esta incertidumbre, ¿qué decisión sería más apropiada?",
    options: [
      { key: "A", text: "Inocular otras plantas diferentes de la soya." },
      { key: "B", text: "Aumentar el muestreo de las plantas." },
      { key: "C", text: "Cambiar de terreno las plantas inoculadas." },
      { key: "D", text: "Probar otros instrumentos más precisos para obtener el peso." },
    ],
    correctOption: "B", tags: ["diseno-experimental", "incertidumbre"],
  },
  {
    id: "PC-2026-Q17", module: "PC", source: { ...PC_SOURCE, originalNumber: 17 }, contextId: null,
    competencia: "Adquirir e interpretar información para abordar y entender una situación problema", contentArea: "Teoría cinética de los gases", situationContext: "divulgacion-cientifica",
    kind: "single-select",
    prompt: "La siguiente gráfica se usa para mostrar el comportamiento de un gas ideal, el cual puede ser descrito como una gran cantidad de partículas que se mueven aleatoriamente mientras chocan unas con otras: en el eje vertical Q y en el eje horizontal P se traza una curva que sube desde el origen, alcanza un máximo marcado R, y luego desciende de forma asimétrica hacia valores altos de P.\n\nLa magnitud de la velocidad de las partículas obedece una distribución de probabilidades tal que pocas partículas tienen velocidades muy pequeñas o muy altas. Con base en lo anterior, ¿cuáles pueden ser los rótulos P, Q y R en la gráfica para que se describa la distribución de velocidades?",
    options: [
      { key: "A", text: "P: Número de partículas. Q: Velocidad. R: Velocidad promedio." },
      { key: "B", text: "P: Velocidad. Q: Número de partículas. R: Velocidad promedio." },
      { key: "C", text: "P: Velocidad. Q: Número de partículas. R: Velocidad más probable." },
      { key: "D", text: "P: Número de partículas. Q: Velocidad. R: Número de partículas promedio." },
    ],
    correctOption: "B", tags: ["teoria-cinetica-de-los-gases", "distribucion-de-probabilidad"],
  },
  {
    id: "PC-2026-Q18", module: "PC", source: { ...PC_SOURCE, originalNumber: 18 }, contextId: null,
    competencia: "Adquirir e interpretar información para abordar y entender una situación problema", contentArea: "Estática — tensión y fuerza", situationContext: "laboral",
    kind: "single-select",
    prompt: "En una construcción, se deben transportar bloques de cemento, y para hacerlo cuentan con cuerdas que resisten un peso máximo de 500 N cada una; no se sabe cuánto pesan los bloques con el contenedor que los mantiene juntos. La masa de los bloques está entre los 60 kg y 100 kg, mientras que la del contenedor está entre 70 kg y 80 kg (suponga que la aceleración gravitacional es 10 m/s²), y todas las cuerdas usadas sostienen el peso por igual.\n\nTeniendo en cuenta la información anterior, ¿cuál es el número mínimo de cuerdas que debe usarse para transportar los bloques sin que haya riesgo de ruptura?",
    options: [
      { key: "A", text: "Cinco cuerdas." },
      { key: "B", text: "Una cuerda." },
      { key: "C", text: "Cuatro cuerdas." },
      { key: "D", text: "Tres cuerdas." },
    ],
    correctOption: "C", tags: ["estatica", "tension"],
  },
  {
    id: "PC-2026-Q19", module: "PC", source: { ...PC_SOURCE, originalNumber: 19 }, contextId: null,
    competencia: "Establecer estrategias adecuadas para abordar y resolver problemas", contentArea: "Códigos binarios y paridad", situationContext: "laboral",
    kind: "single-select",
    prompt: "Una técnica para la detección de errores en la transmisión de mensajes en código binario (series de ceros y unos) consiste en agregar al final de cada mensaje enviado un 0 o un 1 de forma que el número total de unos en el mensaje sea siempre un número par. Si en un mensaje recibido el número de unos es impar, es porque parte del mensaje se alteró en la transmisión.\n\nUn ingeniero recibe el siguiente mensaje enviado con la técnica mencionada:\n\n01001000 01100101 01101100 011011111\n\nAl analizarlo, él concluye que hay exactamente un número incorrecto en el mensaje. ¿Esta conclusión se puede deducir a partir del mensaje recibido?",
    options: [
      { key: "A", text: "No, porque el mensaje contiene una cantidad par de unos y por lo tanto no puede contener ningún error." },
      { key: "B", text: "Sí, porque el mensaje contiene una cantidad impar de unos y esto garantiza que hubo un solo error en la transmisión." },
      { key: "C", text: "No, porque solo es posible establecer que hay números incorrectos, pero no la cantidad exacta de estos." },
      { key: "D", text: "Sí, porque el número incorrecto podría ser el último, que se agregó a propósito, y el resto del mensaje podría ser correcto." },
    ],
    correctOption: "C", tags: ["codigos-binarios", "deteccion-de-errores"],
  },
  {
    id: "PC-2026-Q20", module: "PC", source: { ...PC_SOURCE, originalNumber: 20 }, contextId: null,
    competencia: "Comprender, comparar, utilizar o proponer modelos que permiten describir, explicar y predecir fenómenos o sistemas", contentArea: "Modelos exponenciales/logarítmicos — decaimiento radiactivo", situationContext: "divulgacion-cientifica",
    kind: "single-select",
    prompt: "La masa (m) de cierto isótopo radiactivo decae exponencialmente en función del tiempo transcurrido (t). Para este isótopo se tienen las siguientes mediciones:\n\nt — m\n0 — 60\n2 — 30\n4 — 15\n\nUn modelo que estima el tiempo transcurrido t cuando quedan m gramos del isótopo es el siguiente:\n\nt = 2 · log2(m/60)\n\n¿Este modelo representa el tiempo transcurrido adecuadamente?",
    options: [
      { key: "A", text: "Sí, porque transcurren 2 horas cada vez que la masa se reduce a la mitad." },
      { key: "B", text: "No, porque cuando m > 60 la estimación del tiempo es negativa." },
      { key: "C", text: "Sí, porque cuando m = 0 el tiempo transcurrido t es 0." },
      { key: "D", text: "No, porque a medida que la masa disminuye, el tiempo estimado disminuye." },
    ],
    correctOption: "B", tags: ["decaimiento-exponencial", "logaritmos"],
  },
  {
    id: "PC-2026-Q21", module: "PC", source: { ...PC_SOURCE, originalNumber: 21 }, contextId: "PC-2026-CTX-21",
    competencia: "Comprender, comparar, utilizar o proponer modelos que permiten describir, explicar y predecir fenómenos o sistemas", contentArea: "Estratigrafía — Ley de Walther", situationContext: "divulgacion-cientifica",
    kind: "single-select",
    prompt: "De acuerdo con lo anterior, ¿cuál de las siguientes inferencias es correcta sobre las rocas cortadas por la línea M?",
    options: [
      { key: "A", text: "Se depositaron al mismo tiempo y tienen características litológicas similares." },
      { key: "B", text: "Se depositaron en distintos tiempos y tienen características litológicas diferentes." },
      { key: "C", text: "Se depositaron al mismo tiempo y tienen características litológicas diferentes." },
      { key: "D", text: "Se depositaron en distintos tiempos y tienen características litológicas similares." },
    ],
    correctOption: "D", tags: ["estratigrafia", "ley-de-walther"],
  },
  {
    id: "PC-2026-Q22", module: "PC", source: { ...PC_SOURCE, originalNumber: 22 }, contextId: "PC-2026-CTX-22",
    competencia: "Adquirir e interpretar información para abordar y entender una situación problema", contentArea: "Sedimentología — granulometría costera", situationContext: "divulgacion-cientifica",
    kind: "single-select",
    prompt: "A partir de los datos de granulometría se deduce que el régimen de la dinámica del oleaje es de estable a erosivo.\n\nA partir de la información anterior, ¿es válida la interpretación de los datos?",
    options: [
      { key: "A", text: "Sí, porque predominan sedimentos de tamaño medio y grueso." },
      { key: "B", text: "No, porque predominan sedimentos de tamaño grueso." },
      { key: "C", text: "Sí, porque predominan sedimentos de tamaño medio y fino." },
      { key: "D", text: "No, porque predominan sedimentos de tamaño fino." },
    ],
    correctOption: "A", tags: ["sedimentologia", "granulometria"],
  },
  {
    id: "PC-2026-Q23", module: "PC", source: { ...PC_SOURCE, originalNumber: 23 }, contextId: "PC-2026-CTX-23",
    competencia: "Analizar críticamente los resultados y derivar conclusiones", contentArea: "Espectroscopía — estados de oxidación", situationContext: "divulgacion-cientifica",
    kind: "single-select",
    prompt: "Un investigador concluye que en el proceso de recocido el compuesto presente en mayor cantidad en la superficie del material es el NiO. Con base en lo anterior, ¿es adecuada la conclusión del investigador?",
    options: [
      { key: "A", text: "Sí, porque se puede ver que la cantidad relativa de cada estado de oxidación del níquel varía según el proceso al que se somete el material." },
      { key: "B", text: "No, porque después del recocido el Ni³⁺ está presente en una mayor proporción, por lo cual el Ni₂O₃ será el compuesto mayoritario." },
      { key: "C", text: "No, porque se puede conocer la cantidad relativa de cada estado de oxidación del níquel pero no se puede determinar la identidad del óxido formado." },
      { key: "D", text: "Sí, porque después del recocido el Ni³⁺ está presente en una mayor proporción, por lo cual el NiO será el compuesto mayoritario." },
    ],
    correctOption: "B", tags: ["espectroscopia", "quimica-inorganica"],
  },
  {
    id: "PC-2026-Q24", module: "PC", source: { ...PC_SOURCE, originalNumber: 24 }, contextId: null,
    competencia: "Establecer estrategias adecuadas para abordar y resolver problemas", contentArea: "Cinética química — reacciones redox", situationContext: "divulgacion-cientifica",
    kind: "single-select",
    prompt: "Al estudiar la reducción del permanganato de potasio (KMnO4) se colocan 5 mL de una solución de KMnO4 0,01 M en un tubo de ensayo y se adiciona un determinado volumen de ácido oxálico. A partir de la adición de ácido oxálico, se mide el tiempo transcurrido hasta el final de la reacción, que se detecta por la aparición de un color amarillo pálido. A continuación, en otro tubo se repite este mismo experimento, pero agregando unas gotas de cloruro de manganeso (II) (MnCl2) simultáneamente con el ácido oxálico.\n\nNuevamente se mide el tiempo hasta la aparición del color amarillo pálido y se comparan los resultados obtenidos. Teniendo en cuenta la información, ¿cuál es el objetivo del experimento?",
    options: [
      { key: "A", text: "Determinar la capacidad oxidante del KMnO4 en diferentes soluciones acuosas." },
      { key: "B", text: "Registrar los tiempos de reducción de las mezclas de reacción." },
      { key: "C", text: "Determinar la cantidad de KMnO4 que es reducida bajo las condiciones de reacción." },
      { key: "D", text: "Estudiar el efecto del Mn²⁺ sobre la velocidad de la reducción del KMnO4." },
    ],
    correctOption: "D", tags: ["cinetica-quimica", "catalisis"],
  },
];
