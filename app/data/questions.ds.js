// Banco de preguntas — Diseño de Software (DS)
// Fuente: ICFES, "Cuadernillo de preguntas — Módulo de diseño de software, Saber Pro" (2018)
// https://www.icfes.gov.co/wp-content/uploads/2025/01/14_02_diseno_software_Cuadernillo_de_preguntas_diseno_de_software_saber_pro_2018.pdf
// Transcripción literal de preguntas reales de aplicaciones anteriores. Uso académico (licencia ICFES).
//
// Competencia evaluada y afirmaciones: según la Guía de orientación Saber Pro — Módulo Diseño de
// Software (ICFES, aplicación 2024-2; no existe un marco de referencia separado publicado para este
// módulo), el examen evalúa UNA sola "competencia evaluada" (el diseño de software entendido como
// proceso sistémico de análisis de requerimientos, modelado de datos e interfaces, casos de uso y
// arquitectura de software), desagregada en tres afirmaciones. El propio cuadernillo de 2018 trae al
// final una tabla ("Información de cada pregunta") que etiqueta cada posición con una de esas tres
// afirmaciones (texto verbatim de esa tabla) y con la respuesta correcta; ese es el valor usado aquí
// en el campo `competencia` de cada pregunta. La fuente no publica un desglose de "componente"/área de
// contenido por pregunta, así que `contentArea` es una clasificación temática de apoyo (no oficial),
// asignada por tema de ingeniería de software. Tampoco se publica ningún desglose porcentual de pesos
// por afirmación, ni en la guía ni en el cuadernillo.
//
// Contextos compartidos: DS-2018-CTX-01 (caso TPMENS/TENSOFT) aplica a las preguntas 1-8.
// DS-2018-CTX-06 (caso WebGallery) aplica solo a la pregunta 23: las preguntas 24 y 25 también
// pertenecen al bloque "responda las preguntas 23 a 25" del cuadernillo, pero cada una tiene su propio
// diagrama de respuesta como material más específico y se le asignó ese contexto propio en su lugar
// (mismo criterio que RC-2018-Q23, que usa su propia tabla CTX-09 en vez de la CTX-08 compartida).
// El resto de contextos (CTX-02 a CTX-05, CTX-07, CTX-08) son diagramas de una sola pregunta
// (estructura de módulos, mockups de interfaz gráfica, UML de clases/secuencia, patrón Observador,
// diagramas de dominio, diagramas de casos de uso) que el cuadernillo original presenta como figuras;
// aquí se describen en texto lo más completo posible a partir de inspección visual directa de las
// páginas del PDF (no solo de la extracción de texto plano, que pierde las figuras). Cada uno de esos
// contextos referencia un campo `image.src` (assets/images/DS-2018-CTX-0N.png) que es un marcador de
// posición: el archivo de imagen real AÚN NO EXISTE y debe generarse a partir de
// data-source/ds-2018/cuadernillo-ds-2018-icfes.pdf (páginas 8, 9, 10, 13 y 14).
//
// Nota de fidelidad: la pregunta 11 tiene una inconsistencia en el propio cuadernillo original: el
// enunciado nombra el módulo "LeeDatos", pero el diagrama de la figura lo rotula "LeerDatos". Se
// transcribe cada uno tal como aparece en su lugar de origen (enunciado vs. descripción del diagrama
// en el contexto), sin corregir la discrepancia.
window.SESP = window.SESP || {};
window.SESP.data = window.SESP.data || {};
window.SESP.data.contexts = window.SESP.data.contexts || {};
window.SESP.data.questions = window.SESP.data.questions || {};

window.SESP.data.contexts.DS = [
  {
    id: "DS-2018-CTX-01",
    module: "DS",
    type: "text",
    title: "Caso TPMENS / TENSOFT — sistema de información corporativo",
    body: "TPMENS, una empresa estadounidense con filiales en Europa y Asia, se especializa en la producción y el suministro de partes electrónicas a la industria automotriz, aeronáutica y componentes de sonido. La dirección de la compañía, con miras a tener una mayor cobertura a nivel global y advertidas por el incremento en la demanda de productos y servicios, ve la necesidad de contratar a la empresa TENSOFT para el desarrollo e implementación de una solución informática que permita lograr ese objetivo.\n\nDespués de un diagnóstico inicial, los analistas de TENSOFT encontraron que:\n\n• Se cuenta con algunas funciones automatizadas relacionadas con las áreas de producción, mercadeo y finanzas de la compañía. Sin embargo, estas funciones no están integradas entre sí, lo que dificulta la consolidación de la información. Esto implica pérdida de tiempo en la toma de decisiones.\n• No hay un sistema integrado que proporcione en línea la información de producción, inventarios y estados financieros.\n• El manejo y la elaboración de informes y reportes financieros son básicos y planos.\n• No existen reportes gráficos unificados ni consolidados.\n• No hay buen manejo en el flujo de información ni control documental.\n• No se cuenta con aplicativos de gestión sobre la relación con los consumidores.\n\nEl nuevo sistema de información deberá contemplar:\n\n• La integración con los sistemas existentes actualmente por medio de bases de datos centralizadas.\n• Escalabilidad y transaccionalidad.\n\nPor otro lado, se debe tener en cuenta que en las fases de diseño e implementación del nuevo sistema de información, se podrán modificar los requerimientos y especificaciones de este. Además, al considerar el tiempo como un recurso primario que debe optimizarse, se deberá hacer uso de metodologías y procedimientos estándares para el análisis, diseño, programación y prueba.",
    appliesTo: ["DS-2018-Q01", "DS-2018-Q02", "DS-2018-Q03", "DS-2018-Q04", "DS-2018-Q05", "DS-2018-Q06", "DS-2018-Q07", "DS-2018-Q08"]
  },
  {
    id: "DS-2018-CTX-02",
    module: "DS",
    type: "diagram",
    title: "Diagrama de módulos del programa (pregunta 11)",
    body: "Un software en desarrollo tiene 4 módulos. El módulo “DatosClase” es el módulo fundamental en términos de la lógica del programa, pero también el de mayor complejidad y mayor probabilidad de contener errores.",
    image: { src: "assets/images/DS-2018-CTX-02.png", alt: "Diagrama de estructura del programa: el módulo \"Comunicación\" está en el nivel superior y llama a los módulos \"DatosGeneral\" y \"LeerDatos\" (nivel intermedio); ambos módulos, a su vez, llaman al módulo \"DatosClase\" en el nivel inferior. Es decir, DatosClase es invocado tanto desde DatosGeneral como desde LeerDatos, y estos dos son invocados desde Comunicación." },
    appliesTo: ["DS-2018-Q11"]
  },
  {
    id: "DS-2018-CTX-03",
    module: "DS",
    type: "image",
    title: "Opciones de interfaz gráfica para ventas por producto (pregunta 12)",
    body: "Una cadena de tiendas segmenta sus productos de consumo alimenticio en cinco grupos: Cereales, Empaquetados, Carnes, Verduras y Frutas. Se necesita una interfaz gráfica que le permita al gerente general comparar de manera rápida los totales de ventas del primer semestre de 2015 (en millones de pesos) para tomar decisiones. Se presentan cuatro posibles diseños de interfaz (A a D).",
    image: { src: "assets/images/DS-2018-CTX-03.png", alt: "Cuatro mockups de interfaz gráfica etiquetados A a D. A: tabla titulada 'Ventas totales por producto para el primer semestre del 2015 (en millones de pesos)', con una fila 'Valor' (100, 35, 28, 201, 30) y una fila 'Producto' (Cereales, Empaquetados, Carnes, Verduras, Frutas). B: tabla con el mismo título y columnas 'Producto' (una lista desplegable rotulada 'Lista de productos') y 'Total', es decir, una plantilla genérica donde se elegiría un producto de una lista para ver su total, en lugar de mostrar todos los productos a la vez. C: gráfico de barras titulado 'Ventas totales para el primer semestre (en millones de pesos)', eje vertical de 0 a 250 en incrementos de 50, eje horizontal 'Productos' con una barra por cada categoría (Cereales, Empaquetados, Carnes, Verduras, Frutas) de alturas distintas. D: gráfico circular (de pastel) titulado 'Ventas totales para el primer semestre del 2015 (en millones de pesos)', con una leyenda de colores para Cereales, Empaquetados, Carnes, Verduras y Frutas, sin valores ni ejes visibles." },
    appliesTo: ["DS-2018-Q12"]
  },
  {
    id: "DS-2018-CTX-04",
    module: "DS",
    type: "diagram",
    title: "Diagrama de clases y de secuencia UML (pregunta 14)",
    body: "El ingeniero define un diagrama de clases UML con dos clases relacionadas por una asociación de multiplicidad 1 a 1, y luego un diagrama de secuencia entre un objeto de cada clase.",
    image: { src: "assets/images/DS-2018-CTX-04.png", alt: "Diagrama de clases UML: Clase_A (con el método público +operacion_X(): void) se asocia con multiplicidad 1 a 1 con Clase_B; Clase_B tiene el método público +operacion_Y(): void y el método privado -operacion_W(): void. Diagrama de secuencia: dos líneas de vida, ':clase_A' y ':clase_B'; un mensaje sale del objeto :clase_A hacia el objeto :clase_B rotulado 'operación ?' (el nombre de la operación invocada no se muestra y es lo que la pregunta pide deducir)." },
    appliesTo: ["DS-2018-Q14"]
  },
  {
    id: "DS-2018-CTX-05",
    module: "DS",
    type: "diagram",
    title: "Diagrama del patrón de diseño Observador (pregunta 16)",
    body: "La figura ilustra el patrón de diseño orientado a objetos Observador (Observer), en su estructura clásica de cuatro elementos: Sujeto, Observador, SujetoConcreto y ObservadorConcreto.",
    image: { src: "assets/images/DS-2018-CTX-05.png", alt: "Diagrama de clases UML del patrón Observador. La clase 'Sujeto' tiene los métodos Suscribir(Observador), cancelarSuscripcion(Observador) y notificar(); tiene una asociación llamada 'observadores' hacia la clase 'Observador', que declara el método modificar(). Una nota junto a Sujeto da el pseudocódigo de notificar(): 'For all s in Observadores s->modificar()' (recorre a todos los observadores suscritos invocando su modificar()). La clase 'SujetoConcreto' hereda (generalización) de 'Sujeto', tiene el atributo 'estado' y los métodos setEstado()/getEstado(). La clase 'ObservadorConcreto' hereda (generalización) de 'Observador', tiene el atributo 'estadoObservado', el método modificar(), y una referencia llamada 'sujeto' hacia SujetoConcreto; una nota indica el pseudocódigo 'estadoObservado = sujeto->getEstado()' (al notificarse, el observador concreto consulta el estado actual directamente al sujeto concreto)." },
    appliesTo: ["DS-2018-Q16"]
  },
  {
    id: "DS-2018-CTX-06",
    module: "DS",
    type: "text",
    title: "Caso WebGallery — plataforma de compraventa de obras de arte",
    body: "La galería WebGallery requiere una plataforma web para ofrecer sus servicios de intermediación en la compra y venta de obras de arte por Internet. WebGallery maneja dos tipos de usuario: artistas y compradores, y cada uno debe registrarse para tener acceso a la plataforma.\n\nLos artistas pueden publicar sus obras en la colección de la Galería describiendo las características físicas, estilo y valor de cada una. Los compradores acceden a las obras por Internet, para lo cual consultan la colección de obras, seleccionan la obra de arte que le interesa y validan el pago correspondiente. El valor final de compra se determina tomando el valor dado por el artista más la comisión del 2 % que gana WebGallery. Para realizar el pago se ofrecen al comprador dos opciones: usando el botón de pagos seguros en línea (PSE) o con tarjeta de crédito, esto se hace direccionando al comprador a la plataforma OnLinePayments, que se encarga de obtener la autorización de la entidad financiera a la que pertenece la cuenta o tarjeta y transfiere el dinero a una cuenta de WebGallery.",
    appliesTo: ["DS-2018-Q23"]
  },
  {
    id: "DS-2018-CTX-07",
    module: "DS",
    type: "diagram",
    title: "Diagramas de dominio candidatos (pregunta 24)",
    body: "Cuatro diagramas de dominio candidatos (A a D) para representar que \"un artista es un usuario que publica obras de arte\", usando dos convenciones indicadas en la propia figura: Generalización (flecha de triángulo hueco, de la subclase hacia la superclase) y Composición (línea con rombo relleno del lado de la clase que compone/contiene a la otra).",
    image: { src: "assets/images/DS-2018-CTX-07.png", alt: "Cuatro diagramas de clases UML. A: la clase Obra_de_Arte (nombre, descripción, estilo, valor) tiene una composición (rombo relleno del lado de Usuario) con la clase Usuario (user, nombre); por separado, Artista (curriculum, distinciones) es una generalización de Usuario (Artista hereda de Usuario); Artista no tiene ninguna relación directa con Obra_de_Arte. B: Usuario (user, nombre); Artista (curriculum, distinciones) es una generalización de Usuario; Artista tiene una composición (rombo relleno del lado de Artista) con Obra_de_Arte (nombre, descripción, estilo, valor). C: Usuario (user, nombre) tiene una composición (rombo relleno del lado de Usuario) con Artista (curriculum, distinciones) —es decir, Usuario 'compuesto de' Artista en vez de heredar—; Artista tiene una relación de generalización (flecha hueca) hacia Obra_de_Arte (nombre, descripción, estilo, valor) —es decir, Obra_de_Arte aparece como si fuera superclase de Artista—. D: Usuario (user, nombre) tiene una composición (rombo relleno del lado de Usuario) con Artista (curriculum, distinciones) —igual que en C, Usuario 'compuesto de' Artista en vez de heredar—; Artista tiene además una composición (rombo relleno del lado de Artista) con Obra_de_Arte (nombre, descripción, estilo, valor)." },
    appliesTo: ["DS-2018-Q24"]
  },
  {
    id: "DS-2018-CTX-08",
    module: "DS",
    type: "diagram",
    title: "Diagramas de casos de uso candidatos para el proceso de compra (pregunta 25)",
    body: "El caso WebGallery describe cómo un comprador adquiere obras de arte: consulta la colección, selecciona una obra y valida el pago, ya sea con el botón de pagos seguros en línea (PSE) o con tarjeta de crédito. Adicionalmente, al realizar el pago, el comprador puede, de forma opcional, hacer un aporte voluntario a un fondo de ayuda a los artistas. Se presentan cuatro diagramas de casos de uso candidatos (A a D) para representar esta interacción entre el actor Comprador y la plataforma.",
    image: { src: "assets/images/DS-2018-CTX-08.png", alt: "Cuatro diagramas de casos de uso UML (A a D). El actor 'Comprador' se asocia en los cuatro diagramas con el caso de uso 'Comprador obra de arte' (rotulado así, tal como aparece en el cuadernillo). Los demás casos de uso son 'Consultar colección', 'Validar pago', 'Pagar con PSE', 'Pagar con tarjeta de crédito' y 'Donar al fondo de artistas'. A: 'Comprador obra de arte' se relaciona con <<extend>> hacia 'Consultar colección' y con <<extend>> hacia 'Validar pago'; 'Donar al fondo de artistas' se relaciona sin ninguna etiqueta (línea con flecha simple, sin estereotipo) hacia 'Validar pago'; 'Validar pago' se relaciona con <<Include>> hacia 'Pagar con PSE' y hacia 'Pagar con tarjeta de crédito'. B: 'Comprador obra de arte' se relaciona con <<Include>> hacia 'Consultar colección' y con <<Include>> hacia 'Validar pago'; 'Donar al fondo de artistas' se relaciona con <<extend>> hacia 'Validar pago'; 'Pagar con PSE' y 'Pagar con tarjeta de crédito' se relacionan con <<extend>> hacia 'Validar pago'. C: 'Comprador obra de arte' se relaciona con <<Include>> hacia 'Consultar colección' y con <<Include>> hacia 'Validar pago'; 'Donar al fondo de artistas' se relaciona con <<extend>> hacia 'Validar pago'; 'Pagar con PSE' y 'Pagar con tarjeta de crédito' se relacionan mediante una generalización (flecha de línea continua con punta triangular hueca, sin estereotipo) hacia 'Validar pago', es decir, se modelan como especializaciones de 'Validar pago' en lugar de extensiones. D: 'Comprador obra de arte' se relaciona mediante generalización (flecha continua, punta triangular hueca, sin estereotipo) hacia 'Consultar colección', y 'Validar pago' se relaciona de la misma forma (generalización sin estereotipo) hacia 'Comprador obra de arte'; 'Validar pago' se relaciona con <<Include>> hacia 'Donar al fondo de artistas'; 'Pagar con PSE' y 'Pagar con tarjeta de crédito' se relacionan con <<extend>> hacia 'Validar pago'." },
    appliesTo: ["DS-2018-Q25"]
  }
];

window.SESP.data.questions.DS = [
  { id: "DS-2018-Q01", module: "DS", source: { cuadernillo: "Cuadernillo Saber Pro — Diseño de Software", year: 2018, publisher: "ICFES", url: "https://www.icfes.gov.co/wp-content/uploads/2025/01/14_02_diseno_software_Cuadernillo_de_preguntas_diseno_de_software_saber_pro_2018.pdf", originalNumber: 1 }, contextId: "DS-2018-CTX-01", competencia: "Analizar alternativas de solución y selecciona la más adecuada, teniendo en cuenta criterios técnicos, económicos, financieros, sociales, éticos y ambientales.", contentArea: "Aseguramiento de la calidad del software", situationContext: "laboral", kind: "single-select",
    prompt: "Uno de los aspectos generales organizacionales es trabajar según el esquema de gestión de calidad organizacional utilizando metodologías y procedimientos estándares para el control de la calidad del software.\n\nTomando en cuenta las consideraciones anteriores, la actividad que permite un mayor control de la calidad del software en el ciclo de vida es",
    options: [{ key: "A", text: "codificación por pares." }, { key: "B", text: "plan de pruebas." }, { key: "C", text: "diseño detallado." }, { key: "D", text: "análisis de pruebas." }],
    correctOption: "B", tags: ["aseguramiento-de-calidad", "plan-de-pruebas", "ciclo-de-vida-del-software"] },
  { id: "DS-2018-Q02", module: "DS", source: { cuadernillo: "Cuadernillo Saber Pro — Diseño de Software", year: 2018, publisher: "ICFES", url: "https://www.icfes.gov.co/wp-content/uploads/2025/01/14_02_diseno_software_Cuadernillo_de_preguntas_diseno_de_software_saber_pro_2018.pdf", originalNumber: 2 }, contextId: "DS-2018-CTX-01", competencia: "Analizar alternativas de solución y selecciona la más adecuada, teniendo en cuenta criterios técnicos, económicos, financieros, sociales, éticos y ambientales.", contentArea: "Mantenimiento del software", situationContext: "laboral", kind: "single-select",
    prompt: "Teniendo en cuenta las necesidades de la empresa, relacionadas con la implementación del sistema de información en un menor tiempo posible, TENSOFT utiliza el mantenimiento evolutivo en una de sus fases del ciclo de vida; de esta manera se evitarán pérdidas de tiempo, atraso en las operaciones y costos tecnológicos altos, entre otros. Esta decisión permite",
    options: [{ key: "A", text: "eliminar problemas surgidos durante la fase de operación del sistema que no se hayan detectado anteriormente." }, { key: "B", text: "gestionar el proceso y su desarrollo basado en revisiones de los documentos generados en la funcionalidad del sistema." }, { key: "C", text: "mejorar la funcionalidad del sistema con relación con su ejecución, optimización, uso y tiempos de respuesta." }, { key: "D", text: "modificar y ampliar o sustituir la funcionalidad del sistema para adaptarla a las nuevas necesidades de las interfaces, del hardware, del software y del usuario." }],
    correctOption: "D", tags: ["mantenimiento-evolutivo", "mantenimiento-de-software", "ciclo-de-vida-del-software"] },
  { id: "DS-2018-Q03", module: "DS", source: { cuadernillo: "Cuadernillo Saber Pro — Diseño de Software", year: 2018, publisher: "ICFES", url: "https://www.icfes.gov.co/wp-content/uploads/2025/01/14_02_diseno_software_Cuadernillo_de_preguntas_diseno_de_software_saber_pro_2018.pdf", originalNumber: 3 }, contextId: "DS-2018-CTX-01", competencia: "Analizar alternativas de solución y selecciona la más adecuada, teniendo en cuenta criterios técnicos, económicos, financieros, sociales, éticos y ambientales.", contentArea: "Gestión de la configuración del software", situationContext: "laboral", kind: "single-select",
    prompt: "De acuerdo con los aspectos generales de la empresa, la propuesta económica se replanteó para tener en cuenta la incorporación del sistema actual con el nuevo. Por esta razón, el principal elemento para establecer los conceptos de gestión de la configuración del software es",
    options: [{ key: "A", text: "la información de línea base." }, { key: "B", text: "el control de cambios." }, { key: "C", text: "la capacidad de desempeño." }, { key: "D", text: "la factibilidad operacional." }],
    correctOption: "A", tags: ["gestion-de-configuracion", "linea-base", "control-de-cambios"] },
  { id: "DS-2018-Q04", module: "DS", source: { cuadernillo: "Cuadernillo Saber Pro — Diseño de Software", year: 2018, publisher: "ICFES", url: "https://www.icfes.gov.co/wp-content/uploads/2025/01/14_02_diseno_software_Cuadernillo_de_preguntas_diseno_de_software_saber_pro_2018.pdf", originalNumber: 4 }, contextId: "DS-2018-CTX-01", competencia: "Analizar alternativas de solución y selecciona la más adecuada, teniendo en cuenta criterios técnicos, económicos, financieros, sociales, éticos y ambientales.", contentArea: "Modelos de ciclo de vida del software", situationContext: "laboral", kind: "single-select",
    prompt: "Para la construcción del sistema de información, TENSOFT propone trabajar un modelo de ciclo de vida de software que permita evaluar cada una de sus fases y cambios de requerimientos.\n\nDe acuerdo con lo anterior, la metodología de desarrollo por utilizar y su respectiva secuencia de actividades son:",
    options: [{ key: "A", text: "Cascada; análisis de requerimientos, diseño, codificación, pruebas, mantenimiento." }, { key: "B", text: "Prototipos; plan rápido, modelo diseño rápido, construcción del prototipo, comunicación, desarrollo, entrega y retroalimentación." }, { key: "C", text: "Espiral; comunicación con el cliente, planificación, análisis de riesgos, ingeniería, evaluación del cliente, construcción y adaptación." }, { key: "D", text: "Incremental; combinación de elementos repetitivamente, secuencias lineales, construcción de prototipos, entregas incrementales al cliente." }],
    correctOption: "C", tags: ["modelo-espiral", "ciclo-de-vida-del-software", "metodologias-de-desarrollo"] },
  { id: "DS-2018-Q05", module: "DS", source: { cuadernillo: "Cuadernillo Saber Pro — Diseño de Software", year: 2018, publisher: "ICFES", url: "https://www.icfes.gov.co/wp-content/uploads/2025/01/14_02_diseno_software_Cuadernillo_de_preguntas_diseno_de_software_saber_pro_2018.pdf", originalNumber: 5 }, contextId: "DS-2018-CTX-01", competencia: "Analizar alternativas de solución y selecciona la más adecuada, teniendo en cuenta criterios técnicos, económicos, financieros, sociales, éticos y ambientales.", contentArea: "Pruebas de software", situationContext: "laboral", kind: "single-select",
    prompt: "Como una parte de la estrategia de aseguramiento de calidad durante el proceso de construcción de sistemas de información, se debe elaborar y aplicar un plan de pruebas que permita verificar detalles procedimentales de estos.\n\nEl método de pruebas más adecuado es el de",
    options: [{ key: "A", text: "caja negra." }, { key: "B", text: "caja blanca." }, { key: "C", text: "flujo de datos." }, { key: "D", text: "flujo de control." }],
    correctOption: "B", tags: ["pruebas-de-caja-blanca", "plan-de-pruebas", "verificacion"] },
  { id: "DS-2018-Q06", module: "DS", source: { cuadernillo: "Cuadernillo Saber Pro — Diseño de Software", year: 2018, publisher: "ICFES", url: "https://www.icfes.gov.co/wp-content/uploads/2025/01/14_02_diseno_software_Cuadernillo_de_preguntas_diseno_de_software_saber_pro_2018.pdf", originalNumber: 6 }, contextId: "DS-2018-CTX-01", competencia: "Identificar y formular un problema de diseño a partir del análisis de una situación contextualizada, basado en información que puede ser incompleta, sobrante o incierta.", contentArea: "Arquitectura de software", situationContext: "laboral", kind: "single-select",
    prompt: "TENSOFT deberá diseñar la arquitectura del sistema de información de acuerdo con los requerimientos planteado por TPMENS. En este caso, la arquitectura más adecuada es la de",
    options: [{ key: "A", text: "repositorio." }, { key: "B", text: "eventos." }, { key: "C", text: "aspectos." }, { key: "D", text: "multiniveles." }],
    correctOption: "D", tags: ["arquitectura-multinivel", "arquitectura-de-software", "estilos-arquitectonicos"] },
  { id: "DS-2018-Q07", module: "DS", source: { cuadernillo: "Cuadernillo Saber Pro — Diseño de Software", year: 2018, publisher: "ICFES", url: "https://www.icfes.gov.co/wp-content/uploads/2025/01/14_02_diseno_software_Cuadernillo_de_preguntas_diseno_de_software_saber_pro_2018.pdf", originalNumber: 7 }, contextId: "DS-2018-CTX-01", competencia: "Analizar alternativas de solución y selecciona la más adecuada, teniendo en cuenta criterios técnicos, económicos, financieros, sociales, éticos y ambientales.", contentArea: "Arquitectura de software", situationContext: "laboral", kind: "single-select",
    prompt: "Para posibilitar la integración de los componentes del nuevo sistema de la empresa, junto a los aplicativos existentes, de manera que no afecte el traspaso de información entre los clientes, se utilizan mecanismos de coordinación para la transferencia de dicha información.\n\nLa arquitectura que debe utilizarse es",
    options: [{ key: "A", text: "por capas." }, { key: "B", text: "centrada en datos." }, { key: "C", text: "orientada por eventos." }, { key: "D", text: "orientada por objetos." }],
    correctOption: "B", tags: ["arquitectura-centrada-en-datos", "arquitectura-de-software", "integracion-de-sistemas"] },
  { id: "DS-2018-Q08", module: "DS", source: { cuadernillo: "Cuadernillo Saber Pro — Diseño de Software", year: 2018, publisher: "ICFES", url: "https://www.icfes.gov.co/wp-content/uploads/2025/01/14_02_diseno_software_Cuadernillo_de_preguntas_diseno_de_software_saber_pro_2018.pdf", originalNumber: 8 }, contextId: "DS-2018-CTX-01", competencia: "Analizar alternativas de solución y selecciona la más adecuada, teniendo en cuenta criterios técnicos, económicos, financieros, sociales, éticos y ambientales.", contentArea: "Estudio de factibilidad", situationContext: "laboral", kind: "single-select",
    prompt: "El desarrollo del sistema de información implica que la empresa Tensoft realice una serie de etapas establecidas como el ciclo de vida, una de ellas es el estudio de factibilidad que identifica las necesidades por satisfacer con la aplicación computacional. Teniendo en cuenta lo anterior, en el desarrollo de este sistema, el aspecto principal para el desarrollo del proyecto es",
    options: [{ key: "A", text: "técnico." }, { key: "B", text: "económico." }, { key: "C", text: "operacional." }, { key: "D", text: "administrativo." }],
    correctOption: "A", tags: ["estudio-de-factibilidad", "factibilidad-tecnica", "ciclo-de-vida-del-software"] },
  { id: "DS-2018-Q09", module: "DS", source: { cuadernillo: "Cuadernillo Saber Pro — Diseño de Software", year: 2018, publisher: "ICFES", url: "https://www.icfes.gov.co/wp-content/uploads/2025/01/14_02_diseno_software_Cuadernillo_de_preguntas_diseno_de_software_saber_pro_2018.pdf", originalNumber: 9 }, contextId: null, competencia: "Identificar y formular un problema de diseño a partir del análisis de una situación contextualizada, basado en información que puede ser incompleta, sobrante o incierta.", contentArea: "Programación orientada a objetos", situationContext: "laboral", kind: "single-select",
    prompt: "En el contexto de la programación orientada a objetos es posible realizar operaciones de una clase sin instanciar objetos de la misma, porque",
    options: [{ key: "A", text: "se pueden invocar métodos heredados de su superclase." }, { key: "B", text: "se pueden invocar métodos estáticos de la misma clase." }, { key: "C", text: "los métodos de la clase pueden haber sido redefinidos." }, { key: "D", text: "los métodos de la clase pueden haber sido sobrecargados." }],
    correctOption: "B", tags: ["metodos-estaticos", "programacion-orientada-a-objetos", "clases-y-objetos"] },
  { id: "DS-2018-Q10", module: "DS", source: { cuadernillo: "Cuadernillo Saber Pro — Diseño de Software", year: 2018, publisher: "ICFES", url: "https://www.icfes.gov.co/wp-content/uploads/2025/01/14_02_diseno_software_Cuadernillo_de_preguntas_diseno_de_software_saber_pro_2018.pdf", originalNumber: 10 }, contextId: null, competencia: "Aplicar los conocimientos de las matemáticas, las ciencias, la tecnología y las ciencias de la ingeniería, para especificar de forma detallada un producto tecnológico.", contentArea: "Programación orientada a objetos", situationContext: "laboral", kind: "single-select",
    prompt: "El polimorfismo es una propiedad potente dentro del paradigma de orientación a objetos, el cual se implementa a menudo mediante la técnica de redefinición de métodos. Un método puede ser redefinido en una subclase si es marcado en la superclase como",
    options: [{ key: "A", text: "abreviado." }, { key: "B", text: "sobrecargado." }, { key: "C", text: "estático." }, { key: "D", text: "abstracto." }],
    correctOption: "D", tags: ["polimorfismo", "metodos-abstractos", "herencia", "programacion-orientada-a-objetos"] }
];
