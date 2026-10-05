// Banco de preguntas — Razonamiento Cuantitativo (RC)
// Fuente: ICFES, "Cuadernillo de preguntas — Módulo de razonamiento cuantitativo, Saber Pro" (2018)
// https://www.icfes.gov.co/wp-content/uploads/2024/12/02_02_Cuadernillo_de_preguntas_razonamiento_cuantitativo_saber_pro_2018.pdf
// Transcripción literal de preguntas reales de aplicaciones anteriores. Uso académico (licencia ICFES).
window.SESP = window.SESP || {};
window.SESP.data = window.SESP.data || {};
window.SESP.data.contexts = window.SESP.data.contexts || {};
window.SESP.data.questions = window.SESP.data.questions || {};

window.SESP.data.contexts.RC = [
  {
    id: "RC-2018-CTX-01",
    module: "RC",
    type: "text+table",
    title: "Sismos registrados 2001-2010",
    body: "La tabla muestra el total de sismos registrados en el planeta durante la primera década del siglo XXI y la distribución de aquellos con magnitud mayor a 5,0.",
    table: {
      headers: ["Magnitud", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "Total por magnitud"],
      rows: [
        ["5,0 - 5,9", "1.224", "1.201", "1.203", "1.514", "1.693", "1.712", "2.074", "1.768", "1.832", "1.944", "16.165"],
        ["6,0 - 6,9", "121", "127", "140", "141", "140", "142", "121", "168", "151", "151", "1.459"],
        ["7,0 - 7,9", "15", "13", "14", "14", "10", "9", "15", "12", "21", "21", "143"],
        ["8,0 - 8,9", "1", "0", "1", "1", "1", "2", "1", "0", "1", "1", "12"],
        ["Total por año (incluye sismos < 5,0)", "3.362", "3.343", "3.361", "3.674", "3.849", "3.871", "3.362", "3.956", "4.014", "4.127", "36.919"]
      ]
    },
    appliesTo: ["RC-2018-Q01", "RC-2018-Q02", "RC-2018-Q03", "RC-2018-Q04", "RC-2018-Q05"]
  },
  {
    id: "RC-2018-CTX-02",
    module: "RC",
    type: "text+diagram",
    title: "Herencia de la señora Antonia",
    body: "Antes de fallecer, la señora Antonia organizará su testamento en el que hereda a sus sobrinos y a los hijos de estos, pues son sus familiares más cercanos. La señora Antonia tiene una casa que actualmente vale $240.000.000 y un porcentaje en un apartamento que actualmente vale $160.000.000.\n\nEsquema de herederos: Tía Antonia tiene cinco sobrinos: Beatriz (fallecida, con hijos Patricia y Jaime), Jacinto, Antonio (fallecido, con hijo Juan), Blanca, y Héctor (con hijos Teresa y Bernardo).\n\nFragmento del testamento: \"El valor que me corresponde en cada uno de los bienes en los que tengo participación debe distribuirse en partes iguales entre mis cinco sobrinos. El dinero correspondiente a cada sobrino ya fallecido debe distribuirse en partes iguales entre los hijos que este haya tenido.\"",
    image: { src: "assets/images/RC-2018-CTX-02.png", alt: "Árbol genealógico de la señora Antonia: sus cinco sobrinos (Beatriz y Antonio fallecidos, Jacinto, Blanca y Héctor) y los hijos de los sobrinos fallecidos (Patricia y Jaime, hijos de Beatriz; Juan, hijo de Antonio) y de Héctor (Teresa y Bernardo)" },
    appliesTo: ["RC-2018-Q06", "RC-2018-Q07"]
  },
  {
    id: "RC-2018-CTX-03",
    module: "RC",
    type: "text+table",
    title: "Clases de pilates",
    // Tabla 1 y horario verificados contra la página 7 del cuadernillo. Una transcripción
    // anterior corría los costos una fila (1→280.000, 2→384.000…), lo que volvía irresoluble
    // la pregunta 8, y omitía por completo el horario que necesita la pregunta 9.
    body: "Un instructor de pilates tiene un estudio con los equipos necesarios para que una persona reciba entrenamiento personalizado. La tabla 1 muestra la cantidad de sesiones por semana, el total en el mes y el costo mensual que una persona tendría que pagar por el entrenamiento. La tabla 2 muestra, en gris, los momentos del día que ya tiene clase con alguna persona, cada semana.",
    table: {
      headers: ["No. de sesiones por semana", "No. de clases al mes", "Costo mensual ($)"],
      rows: [
        ["2", "8", "280.000"],
        ["3", "12", "384.000"],
        ["4", "16", "480.000"]
      ]
    },
    image: { src: "assets/images/RC-2018-CTX-03.png", alt: "Tabla 2: horario semanal de lunes (L) a sábado (S) con nueve franjas de una hora (8 a.m. a 2 p.m. y 4 p.m. a 7 p.m.); las celdas en gris indican las horas que el instructor ya tiene ocupadas con otras personas" },
    appliesTo: ["RC-2018-Q08", "RC-2018-Q09"]
  },
  {
    id: "RC-2018-CTX-04",
    module: "RC",
    type: "text+graph",
    title: "Inversión en seguridad vial",
    body: "La gráfica muestra la inversión que hizo un país, en temas de seguridad vial, durante 7 años (en millones de euros). Tomado de http://elmundo.es/elmundo/2003/graficos/jun/s1/datos_renfe.html, junio de 2003.",
    image: { src: "assets/images/RC-2018-CTX-04.png", alt: "Gráfica de línea 'Inversión en seguridad' con la inversión en millones de euros por año, de 1996 a 2002: 135,10; 109,68; 110,95; 108,96; 166,36; 195,77; 194,39" },
    // Valores verificados contra la gráfica del cuadernillo (ver assets/images/RC-2018-CTX-04.png):
    // la inversión baja de 1996 a 1999 y se dispara en 2000-2002. Una transcripción anterior
    // tenía los años desordenados, lo que invalidaba la pregunta 10.
    table: {
      headers: ["Año", "Inversión (millones de euros)"],
      rows: [
        ["1996", "135,10"], ["1997", "109,68"], ["1998", "110,95"], ["1999", "108,96"],
        ["2000", "166,36"], ["2001", "195,77"], ["2002", "194,39"]
      ]
    },
    appliesTo: ["RC-2018-Q10", "RC-2018-Q11"]
  },
  {
    id: "RC-2018-CTX-05",
    module: "RC",
    type: "text",
    title: "Reciclaje de papel y cartón",
    body: "En una ciudad se producen en promedio 600 toneladas diarias de residuos domésticos, de las cuales el 25% corresponde a papel y cartón, materiales fácilmente reciclables. Por cada tonelada de papel y cartón que se recicla: se evita la tala de 17 árboles adultos y la plantación masiva de especies para la producción de pasta de papel; y se ahorran 140 litros de petróleo y 50.000 litros de agua.\nTomado y adaptado de: papelesecologicos.com",
    appliesTo: ["RC-2018-Q12", "RC-2018-Q13"]
  },
  {
    id: "RC-2018-CTX-06",
    module: "RC",
    type: "text+table",
    title: "Comportamiento de cinco aves",
    body: "Un científico estudia el comportamiento de cinco aves a lo largo de cuatro sesiones de 30 minutos cada una. Durante las sesiones, el científico mide el tiempo (en minutos) que le toma a cada ave realizar cada una de siete actividades.",
    // Tabla verificada contra la página 10 del cuadernillo. Una transcripción anterior tenía
    // las filas desplazadas y las columnas de las aves 2 a 4 revueltas, lo que hacía que la
    // pregunta 16 no tuviera respuesta coherente con la clave oficial.
    table: {
      headers: ["Actividad", "Ave 1", "Ave 2", "Ave 3", "Ave 4", "Ave 5"],
      rows: [
        ["1 Alimentación", "30", "21", "27", "15", "45"],
        ["2 Acicalamiento", "16", "35", "5", "25", "12"],
        ["3 Descanso", "20", "10", "25", "20", "15"],
        ["4 Desplazamiento", "25", "15", "30", "25", "20"],
        ["5 Orientación", "4", "2", "5", "4", "3"],
        ["6 Defecación", "10", "7", "9", "5", "15"],
        ["7 Comunicación", "15", "30", "19", "26", "10"]
      ]
    },
    appliesTo: ["RC-2018-Q14", "RC-2018-Q15", "RC-2018-Q16"]
  },
  {
    id: "RC-2018-CTX-07",
    module: "RC",
    type: "text+diagram",
    title: "Pistas de aterrizaje",
    body: "Las pistas de aterrizaje de los aeropuertos se marcan en sus extremos de acuerdo con su alineación con el norte magnético. Cada pista recibe dos números, uno en cada extremo, según la dirección en la que se orienta una aeronave cuando se aproxima para aterrizar en ese extremo. Los dos números corresponden a las dos direcciones en que se puede aterrizar en una pista. Como marcas se usan los dos primeros dígitos de la dirección magnética en grados. Por ejemplo, una aeronave orientada hacia los 120° magnéticos en su aterrizaje, aterriza en el extremo 12 (y en el extremo opuesto, 300°, marcado como 30).",
    image: { src: "assets/images/RC-2018-CTX-07.png", alt: "Dos diagramas de rosa de los vientos (0° a 360°, marcados N, E, S, O) que muestran cómo se numeran los extremos de una pista de aterrizaje; en el primero una aeronave orientada a 120° aterriza en el extremo marcado 12, con el extremo opuesto marcado 30" },
    appliesTo: ["RC-2018-Q17", "RC-2018-Q18", "RC-2018-Q19"]
  },
  {
    id: "RC-2018-CTX-08",
    module: "RC",
    type: "text+table",
    title: "Jabón de tocador",
    body: "Una microempresa de productos de aseo elabora jabón de tocador en dos presentaciones (barra y líquido), y ofrece tres contenidos para cada una. Cada presentación y contenido se encuentra disponible en tres aromas: natural, coco y vainilla.",
    table: {
      headers: ["Presentación", "Contenido", "Precio por unidad"],
      rows: [
        ["Barra", "110g", "$1.760"],
        ["Barra", "125g", "$2.000"],
        ["Barra", "150g", "$2.400"],
        ["Líquido", "300mL", "$5.100"],
        ["Líquido", "500mL", "$8.500"],
        ["Líquido", "700mL", "$11.900"]
      ]
    },
    appliesTo: ["RC-2018-Q20", "RC-2018-Q21", "RC-2018-Q22"]
  },
  {
    id: "RC-2018-CTX-09",
    module: "RC",
    type: "table",
    title: "Ventas semanales de jabón",
    body: "La microempresa otorga incentivos a los vendedores cuyas ventas semanales sean superiores a $500.000. La tabla muestra las unidades vendidas por tres vendedores durante una semana, por presentación y contenido.",
    table: {
      headers: ["Presentación", "Contenido", "Vendedor I", "Vendedor II", "Vendedor III"],
      rows: [
        ["Barra", "110 g", "10", "100", "10"],
        ["Barra", "125 g", "200", "100", "10"],
        ["Barra", "150 g", "0", "0", "10"],
        ["Líquido", "300 mL", "100", "100", "10"],
        ["Líquido", "500 mL", "10", "50", "10"],
        ["Líquido", "700 mL", "10", "50", "10"]
      ]
    },
    appliesTo: ["RC-2018-Q23"]
  },
  {
    id: "RC-2018-CTX-10",
    module: "RC",
    type: "text+diagram",
    title: "Fuente de chocolate de tres niveles",
    body: "Para una fiesta infantil se tiene una fuente de chocolate con tres niveles, cuyos recipientes son cilíndricos. El tubo cilíndrico que los une permite que el chocolate suba desde el nivel más bajo hasta el más alto. Cuando el nivel superior se llena, el chocolate se desborda al nivel medio y, cuando este se llena, el chocolate pasa al nivel inferior. El organizador de la fiesta quiere estimar la capacidad de la fuente, para lo cual mide la altura y el radio del recipiente en el nivel inferior.",
    image: { src: "assets/images/RC-2018-CTX-10.png", alt: "Fuente de chocolate de tres niveles con recipientes cilíndricos de distinto tamaño (el inferior más grande, el superior más pequeño) unidos por un tubo cilíndrico central" },
    appliesTo: ["RC-2018-Q25"]
  }
];

window.SESP.data.questions.RC = [
  { id: "RC-2018-Q01", module: "RC", source: { cuadernillo: "Cuadernillo Saber Pro — Razonamiento Cuantitativo", year: 2018, publisher: "ICFES", url: "https://www.icfes.gov.co/wp-content/uploads/2024/12/02_02_Cuadernillo_de_preguntas_razonamiento_cuantitativo_saber_pro_2018.pdf", originalNumber: 1 }, contextId: "RC-2018-CTX-01", competencia: "Interpretación y representación", contentArea: "Estadística", situationContext: "divulgacion-cientifica", kind: "single-select",
    prompt: "Un sismólogo afirma que en cualquier año era más probable que hubiese sismos de baja que de alta magnitud. Según el registro histórico, la relación que justifica la opinión del sismólogo es:",
    options: [{ key: "A", text: "A mayor magnitud, mayor cantidad de sismos." }, { key: "B", text: "A mayor magnitud, menor cantidad de sismos." }, { key: "C", text: "A mayor cantidad de sismos, menor magnitud de estos." }, { key: "D", text: "A mayor cantidad de sismos, mayor magnitud de estos." }],
    correctOption: "B", tags: ["tabla"] },
  { id: "RC-2018-Q02", module: "RC", source: { cuadernillo: "Cuadernillo Saber Pro — Razonamiento Cuantitativo", year: 2018, publisher: "ICFES", url: "https://www.icfes.gov.co/wp-content/uploads/2024/12/02_02_Cuadernillo_de_preguntas_razonamiento_cuantitativo_saber_pro_2018.pdf", originalNumber: 2 }, contextId: "RC-2018-CTX-01", competencia: "Argumentación", contentArea: "Estadística", situationContext: "divulgacion-cientifica", kind: "single-select",
    prompt: "A partir de los datos, una persona predice que en el 2011 se presentarán exactamente 173 sismos de magnitud igual o superior a 6,0 grados. Que suceda lo que esta persona predice es",
    options: [{ key: "A", text: "imposible, pues el número de sismos, de cualquier magnitud, ha ido disminuyendo desde 2007." }, { key: "B", text: "poco probable, porque, de acuerdo con la tendencia, el número de sismos en el 2011 será mayor que 173." }, { key: "C", text: "incierto, pues a partir del número de sismos de cualquier magnitud presentado en el pasado no se puede predecir el número de sismos futuros." }, { key: "D", text: "seguro, pues la tendencia de los dos años anteriores a 2011 indica que se presentarán 151 sismos de magnitud entre 6,0 y 6,9; 21 de magnitud entre 7,0 y 7,9, y 1 de magnitud superior a 8,0." }],
    correctOption: "C", tags: ["tabla", "prediccion"] },
  { id: "RC-2018-Q03", module: "RC", source: { cuadernillo: "Cuadernillo Saber Pro — Razonamiento Cuantitativo", year: 2018, publisher: "ICFES", url: "https://www.icfes.gov.co/wp-content/uploads/2024/12/02_02_Cuadernillo_de_preguntas_razonamiento_cuantitativo_saber_pro_2018.pdf", originalNumber: 3 }, contextId: "RC-2018-CTX-01", competencia: "Formulación y ejecución", contentArea: "Estadística", situationContext: "divulgacion-cientifica", kind: "single-select",
    prompt: "¿Cuál de los siguientes cocientes permite estimar la cantidad de sismos mensuales?",
    options: [{ key: "A", text: "Total de sismos sobre meses del año." }, { key: "B", text: "Total de sismos por año sobre meses del año." }, { key: "C", text: "Total de sismos por año sobre días del año." }, { key: "D", text: "Total de sismos sobre su magnitud." }],
    correctOption: "B", tags: ["tabla"] },
  { id: "RC-2018-Q04", module: "RC", source: { cuadernillo: "Cuadernillo Saber Pro — Razonamiento Cuantitativo", year: 2018, publisher: "ICFES", url: "https://www.icfes.gov.co/wp-content/uploads/2024/12/02_02_Cuadernillo_de_preguntas_razonamiento_cuantitativo_saber_pro_2018.pdf", originalNumber: 4 }, contextId: "RC-2018-CTX-01", competencia: "Interpretación y representación", contentArea: "Estadística", situationContext: "divulgacion-cientifica", kind: "single-select",
    prompt: "El promedio anual de sismos en la primera década del siglo XXI fue 3.783. Los años con el número de sismos más cercano y más lejano al promedio son",
    options: [{ key: "A", text: "2007 y 2010, respectivamente." }, { key: "B", text: "2006 y 2005, respectivamente." }, { key: "C", text: "2005 y 2002, respectivamente." }, { key: "D", text: "2002 y 2008, respectivamente." }],
    correctOption: "C", tags: ["tabla", "promedio"] },
  { id: "RC-2018-Q05", module: "RC", source: { cuadernillo: "Cuadernillo Saber Pro — Razonamiento Cuantitativo", year: 2018, publisher: "ICFES", url: "https://www.icfes.gov.co/wp-content/uploads/2024/12/02_02_Cuadernillo_de_preguntas_razonamiento_cuantitativo_saber_pro_2018.pdf", originalNumber: 5 }, contextId: "RC-2018-CTX-01", competencia: "Interpretación y representación", contentArea: "Estadística", situationContext: "divulgacion-cientifica", kind: "single-select",
    prompt: "En la primera década del siglo XXI, la proporción de sismos de magnitud entre 8,0 y 8,9 es de, aproximadamente,",
    options: [{ key: "A", text: "1 de cada 3.000 sismos." }, { key: "B", text: "1 de cada 12 sismos." }, { key: "C", text: "12 de cada 18.000 sismos." }, { key: "D", text: "12 de cada 4.000 sismos." }],
    correctOption: "A", tags: ["tabla", "proporcion"] },

  { id: "RC-2018-Q06", module: "RC", source: { cuadernillo: "Cuadernillo Saber Pro — Razonamiento Cuantitativo", year: 2018, publisher: "ICFES", url: "https://www.icfes.gov.co/wp-content/uploads/2024/12/02_02_Cuadernillo_de_preguntas_razonamiento_cuantitativo_saber_pro_2018.pdf", originalNumber: 6 }, contextId: "RC-2018-CTX-02", competencia: "Argumentación", contentArea: "Álgebra y cálculo", situationContext: "familiar-personal", kind: "single-select",
    prompt: "Patricia está muy contenta, pues afirma que, de la forma en que su tía repartió el dinero de sus bienes, ella obtendrá más dinero que si la herencia se dividiera en partes iguales entre los familiares vivos de la tía según el esquema. La afirmación de Patricia es",
    options: [{ key: "A", text: "incorrecta, pues de cualquiera de las dos formas los herederos reciben $32.000.000." }, { key: "B", text: "correcta, pues según el testamento la herencia se distribuye entre 6 personas; de la otra forma se debe repartir entre 8." }, { key: "C", text: "incorrecta, pues Patricia recibirá 10% de la herencia, que es menos que el 12,5% que recibiría con la otra distribución." }, { key: "D", text: "correcta, pues el dinero se divide solo entre ella y su hermano." }],
    correctOption: "C", tags: ["herencia", "porcentajes"] },
  { id: "RC-2018-Q07", module: "RC", source: { cuadernillo: "Cuadernillo Saber Pro — Razonamiento Cuantitativo", year: 2018, publisher: "ICFES", url: "https://www.icfes.gov.co/wp-content/uploads/2024/12/02_02_Cuadernillo_de_preguntas_razonamiento_cuantitativo_saber_pro_2018.pdf", originalNumber: 7 }, contextId: "RC-2018-CTX-02", competencia: "Interpretación y representación", contentArea: "Álgebra y cálculo", situationContext: "familiar-personal", kind: "single-select",
    prompt: "¿Qué parte de la herencia le corresponde a Juan?",
    options: [{ key: "A", text: "La quinta parte." }, { key: "B", text: "La mitad." }, { key: "C", text: "La octava parte." }, { key: "D", text: "La tercera parte." }],
    correctOption: "A", tags: ["herencia", "fracciones"] },

  { id: "RC-2018-Q08", module: "RC", source: { cuadernillo: "Cuadernillo Saber Pro — Razonamiento Cuantitativo", year: 2018, publisher: "ICFES", url: "https://www.icfes.gov.co/wp-content/uploads/2024/12/02_02_Cuadernillo_de_preguntas_razonamiento_cuantitativo_saber_pro_2018.pdf", originalNumber: 8 }, contextId: "RC-2018-CTX-03", competencia: "Argumentación", contentArea: "Álgebra y cálculo", situationContext: "familiar-personal", kind: "single-select",
    prompt: "Camilo quiere inscribirse a las clases de pilates ofrecidas por el instructor y escoger el total de sesiones mensual en la que el costo por sesión sea de menor precio. Camilo elige tomar 2 sesiones semanales. ¿Logra Camilo cumplir su propósito de que el costo por sesión sea el de menor precio?",
    options: [{ key: "A", text: "No, pues el costo por sesión de menor precio lo obtiene si toma 4 sesiones por semana." }, { key: "B", text: "Sí, pues tomar 2 sesiones por semana tiene el menor costo mensual de todas las opciones." }, { key: "C", text: "No, pues se paga un menor precio por sesión si toma 3 sesiones por semana." }, { key: "D", text: "Sí, pues tomar menos sesiones garantiza pagar menos por cada una de ellas." }],
    correctOption: "A", tags: ["tabla", "costo-unitario"] },
  { id: "RC-2018-Q09", module: "RC", source: { cuadernillo: "Cuadernillo Saber Pro — Razonamiento Cuantitativo", year: 2018, publisher: "ICFES", url: "https://www.icfes.gov.co/wp-content/uploads/2024/12/02_02_Cuadernillo_de_preguntas_razonamiento_cuantitativo_saber_pro_2018.pdf", originalNumber: 9 }, contextId: "RC-2018-CTX-03", competencia: "Interpretación y representación", contentArea: "Estadística", situationContext: "familiar-personal", kind: "single-select",
    prompt: "¿Cuál de las siguientes afirmaciones es incorrecta?",
    options: [{ key: "A", text: "Hay más horas disponibles de 8 a.m. a 1 p.m., que de 1 p.m. a 7 p.m." }, { key: "B", text: "Todos los días hay 5 horas disponibles." }, { key: "C", text: "Hay más horas disponibles de jueves a sábado, que de lunes a miércoles." }, { key: "D", text: "El sábado de 12 m. a 7 p.m. no hay clases asignadas." }],
    correctOption: "B", tags: ["horario"] },

  { id: "RC-2018-Q10", module: "RC", source: { cuadernillo: "Cuadernillo Saber Pro — Razonamiento Cuantitativo", year: 2018, publisher: "ICFES", url: "https://www.icfes.gov.co/wp-content/uploads/2024/12/02_02_Cuadernillo_de_preguntas_razonamiento_cuantitativo_saber_pro_2018.pdf", originalNumber: 10 }, contextId: "RC-2018-CTX-04", competencia: "Interpretación y representación", contentArea: "Estadística", situationContext: "comunitario-social", kind: "single-select",
    prompt: "Durante el período 1996-2002, los años en los que se hizo mayor inversión en seguridad vial fueron",
    options: [{ key: "A", text: "1997, 1998, 1999 y 2000." }, { key: "B", text: "2000, 2001 y 2002." }, { key: "C", text: "1997, 1998 y 1999." }, { key: "D", text: "1996, 1997, 1998 y 1999." }],
    correctOption: "B", tags: ["grafica"] },
  { id: "RC-2018-Q11", module: "RC", source: { cuadernillo: "Cuadernillo Saber Pro — Razonamiento Cuantitativo", year: 2018, publisher: "ICFES", url: "https://www.icfes.gov.co/wp-content/uploads/2024/12/02_02_Cuadernillo_de_preguntas_razonamiento_cuantitativo_saber_pro_2018.pdf", originalNumber: 11 }, contextId: "RC-2018-CTX-04", competencia: "Formulación y ejecución", contentArea: "Álgebra y cálculo", situationContext: "comunitario-social", kind: "single-select",
    prompt: "La inversión en seguridad se realiza el 10 de enero de cada año. En enero 10 de 2002, un euro equivalía a 2.800 pesos colombianos, aproximadamente. Se proponen los siguientes procedimientos para hallar el valor de la inversión en seguridad en pesos colombianos: I. Convertir 194,39 millones de euros a pesos colombianos. II. Convertir 2.800 pesos colombianos a euros. III. Multiplicar 194,39 por 2.800 y luego dividir entre el total de años. ¿Cuál o cuáles de los procedimientos es correcto para hallar lo solicitado?",
    options: [{ key: "A", text: "I y III solamente." }, { key: "B", text: "I solamente." }, { key: "C", text: "II y III solamente." }, { key: "D", text: "II solamente." }],
    correctOption: "B", tags: ["conversion-unidades"] },

  { id: "RC-2018-Q12", module: "RC", source: { cuadernillo: "Cuadernillo Saber Pro — Razonamiento Cuantitativo", year: 2018, publisher: "ICFES", url: "https://www.icfes.gov.co/wp-content/uploads/2024/12/02_02_Cuadernillo_de_preguntas_razonamiento_cuantitativo_saber_pro_2018.pdf", originalNumber: 12 }, contextId: "RC-2018-CTX-05", competencia: "Formulación y ejecución", contentArea: "Álgebra y cálculo", situationContext: "comunitario-social", kind: "single-select",
    prompt: "Se realizó una campaña de reciclaje durante tres días en una unidad residencial, en la que se recogieron 2 toneladas diarias de papel y cartón; por tanto, se evitó la tala de 2 × 3 × 17 = 102 árboles adultos. Si esta campaña se efectuara durante 20 días en la misma unidad y se recolectara la misma cantidad, se podrían ahorrar",
    options: [{ key: "A", text: "680 litros de agua." }, { key: "B", text: "5.600 litros de agua." }, { key: "C", text: "300.000 litros de agua." }, { key: "D", text: "2.000.000 litros de agua." }],
    correctOption: "D", tags: ["proporcionalidad"] },
  { id: "RC-2018-Q13", module: "RC", source: { cuadernillo: "Cuadernillo Saber Pro — Razonamiento Cuantitativo", year: 2018, publisher: "ICFES", url: "https://www.icfes.gov.co/wp-content/uploads/2024/12/02_02_Cuadernillo_de_preguntas_razonamiento_cuantitativo_saber_pro_2018.pdf", originalNumber: 13 }, contextId: "RC-2018-CTX-05", competencia: "Argumentación", contentArea: "Álgebra y cálculo", situationContext: "comunitario-social", kind: "single-select",
    prompt: "Una persona afirma: \"Como al día se ahorran 140 litros de petróleo por cada tonelada de papel y cartón reciclado en la ciudad, durante un mes se ahorrarán exactamente 30 veces 140 litros de petróleo\". Su afirmación es",
    options: [{ key: "A", text: "correcta, porque el número 30 indica el número de días que tiene un mes." }, { key: "B", text: "incorrecta, porque debe tener en cuenta las 150 toneladas de papel y cartón reciclado por día." }, { key: "C", text: "correcta, porque tiene en cuenta que día tras día hay 140 litros más de petróleo ahorrado." }, { key: "D", text: "incorrecta, porque debe tener en cuenta las 25 toneladas de papel y cartón reciclado por día (600 × 25%)." }],
    correctOption: "B", tags: ["porcentajes"] },

  { id: "RC-2018-Q14", module: "RC", source: { cuadernillo: "Cuadernillo Saber Pro — Razonamiento Cuantitativo", year: 2018, publisher: "ICFES", url: "https://www.icfes.gov.co/wp-content/uploads/2024/12/02_02_Cuadernillo_de_preguntas_razonamiento_cuantitativo_saber_pro_2018.pdf", originalNumber: 14 }, contextId: "RC-2018-CTX-06", competencia: "Argumentación", contentArea: "Álgebra y cálculo", situationContext: "divulgacion-cientifica", kind: "single-select",
    prompt: "Los resultados indican que el ave 5 tarda más alimentándose que desplazándose. Esto es correcto, puesto que el tiempo en alimentación excede al de desplazamiento en",
    options: [{ key: "A", text: "20 minutos." }, { key: "B", text: "25 minutos." }, { key: "C", text: "33 minutos." }, { key: "D", text: "45 minutos." }],
    correctOption: "B", tags: ["tabla", "resta"] },
  { id: "RC-2018-Q15", module: "RC", source: { cuadernillo: "Cuadernillo Saber Pro — Razonamiento Cuantitativo", year: 2018, publisher: "ICFES", url: "https://www.icfes.gov.co/wp-content/uploads/2024/12/02_02_Cuadernillo_de_preguntas_razonamiento_cuantitativo_saber_pro_2018.pdf", originalNumber: 15 }, contextId: "RC-2018-CTX-06", competencia: "Argumentación", contentArea: "Álgebra y cálculo", situationContext: "divulgacion-cientifica", kind: "single-select",
    prompt: "Al analizar los resultados, el científico afirma que la relación entre cada tiempo de las actividades del ave 1 y del ave 5 es 3:2. La afirmación del científico es",
    options: [{ key: "A", text: "correcta, porque el tiempo invertido en las actividades 2, 5 y 6 por el ave 1 es igual al tiempo invertido en las actividades 4 y 7 por el ave 5." }, { key: "B", text: "incorrecta, porque el tiempo invertido en las actividades 3, 6 y 7 por el ave 1 es igual al tiempo invertido en las actividades 4, 6 y 7 por el ave 5." }, { key: "C", text: "correcta, porque para la actividad Comunicación la relación entre los tiempos está dada por 15:10 = 3:2." }, { key: "D", text: "incorrecta, porque para la actividad Alimentación la relación entre los tiempos está dada por 30:45 = 2:3." }],
    correctOption: "D", tags: ["tabla", "razones"] },
  { id: "RC-2018-Q16", module: "RC", source: { cuadernillo: "Cuadernillo Saber Pro — Razonamiento Cuantitativo", year: 2018, publisher: "ICFES", url: "https://www.icfes.gov.co/wp-content/uploads/2024/12/02_02_Cuadernillo_de_preguntas_razonamiento_cuantitativo_saber_pro_2018.pdf", originalNumber: 16 }, contextId: "RC-2018-CTX-06", competencia: "Formulación y ejecución", contentArea: "Estadística", situationContext: "divulgacion-cientifica", kind: "single-select",
    prompt: "El científico quiere identificar cuál de las aves presenta las características de la siguiente descripción: (1) tarda el doble del tiempo o más en alimentarse que en descansar; (2) la defecación dura menos del 10% del tiempo total de las sesiones. Estas características corresponden al ave",
    options: [{ key: "A", text: "1." }, { key: "B", text: "2." }, { key: "C", text: "3." }, { key: "D", text: "5." }],
    correctOption: "B", tags: ["tabla", "filtrado-criterios"] },

  { id: "RC-2018-Q17", module: "RC", source: { cuadernillo: "Cuadernillo Saber Pro — Razonamiento Cuantitativo", year: 2018, publisher: "ICFES", url: "https://www.icfes.gov.co/wp-content/uploads/2024/12/02_02_Cuadernillo_de_preguntas_razonamiento_cuantitativo_saber_pro_2018.pdf", originalNumber: 17 }, contextId: "RC-2018-CTX-07", competencia: "Formulación y ejecución", contentArea: "Geometría", situationContext: "divulgacion-cientifica", kind: "single-select",
    prompt: "Una pista marcada en un extremo con el número 24, en el extremo opuesto está marcada con el número",
    options: [{ key: "A", text: "06" }, { key: "B", text: "18" }, { key: "C", text: "36" }, { key: "D", text: "42" }],
    correctOption: "A", tags: ["angulos"] },
  { id: "RC-2018-Q18", module: "RC", source: { cuadernillo: "Cuadernillo Saber Pro — Razonamiento Cuantitativo", year: 2018, publisher: "ICFES", url: "https://www.icfes.gov.co/wp-content/uploads/2024/12/02_02_Cuadernillo_de_preguntas_razonamiento_cuantitativo_saber_pro_2018.pdf", originalNumber: 18 }, contextId: "RC-2018-CTX-07", competencia: "Formulación y ejecución", contentArea: "Geometría", situationContext: "divulgacion-cientifica", kind: "single-select",
    prompt: "Al piloto de un avión que está alineado para aterrizar en el extremo 24 se le pide que cambie su rumbo girando 30 grados a su derecha para que use una pista libre. El número que encuentra en la nueva pista es",
    options: [{ key: "A", text: "06" }, { key: "B", text: "21" }, { key: "C", text: "27" }, { key: "D", text: "54" }],
    correctOption: "B", tags: ["angulos"] },
  { id: "RC-2018-Q19", module: "RC", source: { cuadernillo: "Cuadernillo Saber Pro — Razonamiento Cuantitativo", year: 2018, publisher: "ICFES", url: "https://www.icfes.gov.co/wp-content/uploads/2024/12/02_02_Cuadernillo_de_preguntas_razonamiento_cuantitativo_saber_pro_2018.pdf", originalNumber: 19 }, contextId: "RC-2018-CTX-07", competencia: "Formulación y ejecución", contentArea: "Geometría", situationContext: "divulgacion-cientifica", kind: "single-select",
    prompt: "Un avión que despega en dirección al extremo 32, va hacia el",
    options: [{ key: "A", text: "sureste." }, { key: "B", text: "noreste." }, { key: "C", text: "suroeste." }, { key: "D", text: "noroeste." }],
    correctOption: "A", tags: ["angulos", "orientacion"] },

  { id: "RC-2018-Q20", module: "RC", source: { cuadernillo: "Cuadernillo Saber Pro — Razonamiento Cuantitativo", year: 2018, publisher: "ICFES", url: "https://www.icfes.gov.co/wp-content/uploads/2024/12/02_02_Cuadernillo_de_preguntas_razonamiento_cuantitativo_saber_pro_2018.pdf", originalNumber: 20 }, contextId: "RC-2018-CTX-08", competencia: "Interpretación y representación", contentArea: "Álgebra y cálculo", situationContext: "laboral", kind: "single-select",
    prompt: "Un tanque almacena exactamente la cantidad de jabón líquido necesaria para envasar exactamente 50 unidades de cada tipo de contenido. Teniendo en cuenta que 1 litro contiene 1.000 mL, ¿cuál es la capacidad del tanque?",
    options: [{ key: "A", text: "15 litros." }, { key: "B", text: "75 litros." }, { key: "C", text: "1.500 litros." }, { key: "D", text: "75.000 litros." }],
    correctOption: "B", tags: ["conversion-unidades", "tabla"] },
  { id: "RC-2018-Q21", module: "RC", source: { cuadernillo: "Cuadernillo Saber Pro — Razonamiento Cuantitativo", year: 2018, publisher: "ICFES", url: "https://www.icfes.gov.co/wp-content/uploads/2024/12/02_02_Cuadernillo_de_preguntas_razonamiento_cuantitativo_saber_pro_2018.pdf", originalNumber: 21 }, contextId: "RC-2018-CTX-08", competencia: "Formulación y ejecución", contentArea: "Álgebra y cálculo", situationContext: "laboral", kind: "single-select",
    prompt: "De acuerdo con la información de la tabla, si se conservara la relación entre el contenido y el precio por unidad, ¿cuál debería ser el precio de la presentación de jabón líquido con contenido de 1.800 mL?",
    options: [{ key: "A", text: "$15.300" }, { key: "B", text: "$18.000" }, { key: "C", text: "$30.600" }, { key: "D", text: "$31.660" }],
    correctOption: "C", tags: ["proporcionalidad", "tabla"] },
  { id: "RC-2018-Q22", module: "RC", source: { cuadernillo: "Cuadernillo Saber Pro — Razonamiento Cuantitativo", year: 2018, publisher: "ICFES", url: "https://www.icfes.gov.co/wp-content/uploads/2024/12/02_02_Cuadernillo_de_preguntas_razonamiento_cuantitativo_saber_pro_2018.pdf", originalNumber: 22 }, contextId: "RC-2018-CTX-08", competencia: "Formulación y ejecución", contentArea: "Estadística", situationContext: "laboral", kind: "single-select",
    prompt: "La etiqueta del jabón debe especificar tres aspectos: presentación, contenido y aroma. ¿Cuántas etiquetas diferentes debe utilizar la fábrica?",
    options: [{ key: "A", text: "2" }, { key: "B", text: "6" }, { key: "C", text: "12" }, { key: "D", text: "18" }],
    correctOption: "D", tags: ["conteo", "principio-multiplicacion"] },

  { id: "RC-2018-Q23", module: "RC", source: { cuadernillo: "Cuadernillo Saber Pro — Razonamiento Cuantitativo", year: 2018, publisher: "ICFES", url: "https://www.icfes.gov.co/wp-content/uploads/2024/12/02_02_Cuadernillo_de_preguntas_razonamiento_cuantitativo_saber_pro_2018.pdf", originalNumber: 23 }, contextId: "RC-2018-CTX-09", competencia: "Formulación y ejecución", contentArea: "Estadística", situationContext: "laboral", kind: "single-select",
    prompt: "¿A cuál o cuáles de los vendedores se debe dar el incentivo (ventas semanales superiores a $500.000)?",
    options: [{ key: "A", text: "I solamente." }, { key: "B", text: "III solamente." }, { key: "C", text: "I y II solamente." }, { key: "D", text: "I, II y III." }],
    correctOption: "C", tags: ["tabla", "calculo-total"] },

  { id: "RC-2018-Q24", module: "RC", source: { cuadernillo: "Cuadernillo Saber Pro — Razonamiento Cuantitativo", year: 2018, publisher: "ICFES", url: "https://www.icfes.gov.co/wp-content/uploads/2024/12/02_02_Cuadernillo_de_preguntas_razonamiento_cuantitativo_saber_pro_2018.pdf", originalNumber: 24 }, contextId: null, competencia: "Argumentación", contentArea: "Álgebra y cálculo", situationContext: "divulgacion-cientifica", kind: "single-select",
    prompt: "Usualmente, las distancias en el espacio se miden en años luz. Un año luz corresponde a la distancia que recorre la luz en un año (aproximadamente 9,46 × 10¹² km). Un estudiante sabe que el diámetro de la Vía Láctea mide aproximadamente 10²¹ m, y para determinar la cantidad de años luz a la que esto equivale usa la expresión: 10²¹ / (9,46×10¹²) = 10⁹/9,46 ≈ 106 millones. El estudiante concluye que el diámetro es 106 millones de años luz. El anterior procedimiento es incorrecto, porque",
    options: [{ key: "A", text: "el denominador de la fracción debe expresarse en potencias de diez." }, { key: "B", text: "no se tiene en cuenta la equivalencia de unidades entre las magnitudes involucradas (m frente a km)." }, { key: "C", text: "para obtener el diámetro se debe determinar el producto entre ambas medidas relacionadas." }, { key: "D", text: "el resultado no se expresa en potencias de diez como los otros datos." }],
    correctOption: "B", tags: ["notacion-cientifica", "unidades"] },

  { id: "RC-2018-Q25", module: "RC", source: { cuadernillo: "Cuadernillo Saber Pro — Razonamiento Cuantitativo", year: 2018, publisher: "ICFES", url: "https://www.icfes.gov.co/wp-content/uploads/2024/12/02_02_Cuadernillo_de_preguntas_razonamiento_cuantitativo_saber_pro_2018.pdf", originalNumber: 25 }, contextId: "RC-2018-CTX-10", competencia: "Argumentación", contentArea: "Geometría", situationContext: "familiar-personal", kind: "single-select",
    prompt: "De las medidas halladas por el organizador (altura y radio del recipiente del nivel inferior) para estimar la capacidad total de la fuente, es verdadero afirmar que",
    options: [{ key: "A", text: "no son suficientes, pues falta conocer el peso del chocolate y la resistencia que tiene el material de los recipientes." }, { key: "B", text: "son suficientes, pues si se llenan los otros recipientes, el chocolate se saldrá de la fuente cuando esta comience a operar." }, { key: "C", text: "no son suficientes, pues no toman en cuenta la capacidad de los otros recipientes y el chocolate del tubo de circulación." }, { key: "D", text: "son suficientes, pues el recipiente más bajo es el que recibe el chocolate que se vierte de los otros dos." }],
    correctOption: "C", tags: ["cilindros", "volumen"] }
];
