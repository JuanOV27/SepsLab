// Banco de preguntas — Segundo Simulacro 2026-2 (preguntas 4 a 48)
// Fuente: documento Word/PDF del simulacro aportado por el usuario (Microsoft Forms,
// "SEGUNDO SIMULACRO 2026-2"). Transcripción fiel de enunciados y opciones.
// IMPORTANTE SOBRE LA CLAVE: el documento no trae clave oficial de respuestas.
// Cada pregunta trae `keyStatus: "derived"`: la opción marcada se resolvió desde el
// propio enunciado (cálculo o comprensión directa) y queda PENDIENTE DE VERIFICACIÓN
// con el docente antes de considerarse oficial. No inventar usos oficiales de esta clave.
window.SESP = window.SESP || {};
window.SESP.data = window.SESP.data || {};
window.SESP.data.contexts = window.SESP.data.contexts || {};
window.SESP.data.questions = window.SESP.data.questions || {};

(function () {
  var SRC = function (n) {
    return { cuadernillo: "Segundo Simulacro 2026-2 (Microsoft Forms)", year: 2026, publisher: "Simulacro interno (docente)", url: null, originalNumber: n };
  };

  // ---------- Contextos compartidos (se agregan a los módulos existentes) ----------
  window.SESP.data.contexts.RC = window.SESP.data.contexts.RC || [];
  window.SESP.data.contexts.LC = window.SESP.data.contexts.LC || [];
  window.SESP.data.contexts.IN = window.SESP.data.contexts.IN || [];

  window.SESP.data.contexts.RC.push(
    {
      id: "S2-RC-CTX-01",
      module: "RC",
      type: "text+table",
      title: "Encuesta de pregrados",
      body: "En una Institución Educativa se realizó una encuesta a los estudiantes sobre los programas académicos que desearían continuar en pregrados universitarios. La tabla cruza frecuencia absoluta y frecuencia relativa por programa.",
      table: {
        headers: ["Programa", "Medicina", "Ingenierías", "Derecho", "Licenciatura", "Sociales"],
        rows: [
          ["Frecuencia absoluta", "9", "6", "—", "7", "—"],
          ["Frecuencia relativa", "—", "1/5", "1/6", "—", "1/10"]
        ]
      },
      appliesTo: ["S2-RC-Q11"]
    },
    {
      id: "S2-RC-CTX-02",
      module: "RC",
      type: "text",
      title: "Eficiencia en PQR por departamento",
      body: "Cuatro departamentos de una empresa reciben la misma cantidad de peticiones, quejas y reclamos (PQR) en un año. Eficiencia de atención antes de 24 horas:\n\nDEPARTAMENTO 1: 2 de cada 3 reclamaciones fueron atendidas antes de 24 horas.\nDEPARTAMENTO 2: 5 de cada 6 reclamaciones fueron atendidas antes de 24 horas.\nDEPARTAMENTO 3: 9 de cada 10 reclamaciones fueron atendidas antes de 24 horas.\nDEPARTAMENTO 4: 3 de cada 5 reclamaciones fueron atendidas antes de 24 horas.",
      appliesTo: ["S2-RC-Q12"]
    },
    {
      id: "S2-RC-CTX-03",
      module: "RC",
      type: "text+table",
      title: "Gastos diarios de Micaela",
      body: "Micaela acaba de entrar a un nuevo empleo y por cada día tiene los gastos que se muestran en la tabla. Debe ir de lunes a sábado a trabajar.",
      table: {
        headers: ["Gasto", "Valor"],
        rows: [
          ["Transporte", "$7.000"],
          ["Almuerzo", "$9.000"],
          ["Varios", "$5.000"]
        ]
      },
      appliesTo: ["S2-RC-Q13"]
    }
  );

  window.SESP.data.contexts.LC.push({
    id: "S2-LC-CTX-01",
    module: "LC",
    type: "text",
    title: "Muertos de hambre (Leila Guerriero)",
    body: "LECTURA 1 (preguntas 14 a 18).\n\nMUERTOS DE HAMBRE\n\nMe hacen falta muchas cosas, pero no sé cuáles son. Desconecté, como un módulo desprendido de una nave, y orbito un planeta que soy yo misma, mudo, sordo, a veces ciego. Con un núcleo en llamas. Ayer bajé a la calle. Tapabocas, carro de compras, zapatos de andar por ahí. En el umbral del edificio había un hombre desastroso, con varias bolsas en las que llevaba lo que tenía para vivir en la calle. Conozco a los mendigos del barrio. Este era uno de los nuevos. Lo saludé, le pregunté qué necesitaba.\n\nMe dijo: Nada, estoy bien. Me quedé azorada. ¿De verdad estaba bien?, ¿cómo era posible? No insistí y me fui a hacer las compras. Cuando volví, el hombre ya no estaba. Oxfam Internacional publicó un informe según el cual la pobreza causada por la pandemia será más mortífera que el virus: según las estimaciones, en 2019 había 821 millones de personas en situación de inseguridad alimentaria, de las cuales aproximadamente 149 millones sufrían hambrunas de nivel de crisis. El Programa Mundial de Alimentos estima que el número de personas que sufren hambrunas de nivel de crisis se incremente hasta alcanzar los 270 millones antes de que acabe el año. Esto significa que, antes de 2021, podrían morir de hambre entre 6.000 y 12.000 personas al día a consecuencia de los impactos sociales y económicos de la pandemia. He escuchado demasiadas veces esa frase de ceguera descomunal: Esta pandemia demuestra que el virus no discrimina. ¿No discrimina? El nuevo mendigo no ha vuelto a aparecer. Yo sigo haciendo mis compras. Con tarjeta de crédito. Y, sumida en la patética nostalgia por todo lo que era demasiado, que a veces parecía tan poco y a veces incluso parecía molesto, supongo que olvidaré al hombre mañana, como olvidaré las cifras de los muertos de hambre.\n\nTomado y adaptado de: Guerriero, L. (6 de septiembre de 2020). Muertos de hambre. El País.",
    appliesTo: ["S2-LC-Q14", "S2-LC-Q15", "S2-LC-Q16", "S2-LC-Q17", "S2-LC-Q18"]
  });

  window.SESP.data.contexts.IN.push(
    {
      id: "S2-IN-CTX-01",
      module: "IN",
      type: "cloze",
      title: "Morning routine (cloze)",
      body: "Lea el texto y seleccione la palabra adecuada para cada espacio.\n\nEvery morning, I wake up early and get ready (6) ____ work. The streets are already busy, and people hurry to catch (7) ____ buses or trains. I usually stop at a small café near my apartment to grab a coffee. The barista knows me well and always prepares (8) ____ order quickly. After that, I walk to the subway station and try to find a seat, but it is often crowded. During the ride, I listen (9) ____ music or read the news on my phone. When I finally arrive, I feel ready to start the day and focus (10) ____ my tasks.",
      appliesTo: ["S2-IN-Q29", "S2-IN-Q30", "S2-IN-Q31", "S2-IN-Q32", "S2-IN-Q33"]
    },
    {
      id: "S2-IN-CTX-02",
      module: "IN",
      type: "reading",
      title: "The Day of the Dead in Mexico",
      body: "The Day of the Dead, or Día de los Muertos, is a traditional Mexican celebration held on November 1st and 2nd. It honors deceased loved ones through joyful remembrance rather than mourning. Families create colorful altars, known as ofrendas, decorated with flowers, candles, food, and photographs. One of the most famous symbols is the calavera, or skull, often made from sugar and brightly decorated. People also visit cemeteries to clean graves and spend time with the spirits of their relatives. Music, traditional foods like pan de muerto (bread of the dead), and storytelling are central to the celebration. Though rooted in Aztec traditions, the holiday blends indigenous and Catholic elements, making it a unique cultural event. In 2008, UNESCO recognized the Day of the Dead as part of the Intangible Cultural Heritage of Humanity.",
      appliesTo: ["S2-IN-Q34", "S2-IN-Q35", "S2-IN-Q36", "S2-IN-Q37", "S2-IN-Q38"]
    }
  );

  // ---------- Preguntas (todas single-select; módulo real para tiempos y stats) ----------
  window.SESP.data.questions.S2 = [
    { id: "S2-RC-Q04", module: "RC", source: SRC(4), contextId: null, competencia: "Formulación y ejecución", contentArea: "Estadística", situationContext: "laboral", kind: "single-select",
      prompt: "En el cuestionario que deben responder las personas que solicitan empleo en la Agencia pública de Empleo del SENA para una vacante de médico veterinario se plantea la pregunta «¿tiene experiencia en el empleo al cual está aspirando?» para lo cual el 57% de los aspirantes responden que sí. Si se toma una muestra de 10 encuestados, ¿cuál es la probabilidad de que 6 de ellos hayan respondido afirmativamente?",
      options: [{ key: "A", text: "0.1645" }, { key: "B", text: "0.2062" }, { key: "C", text: "0.2462" }, { key: "D", text: "0.3567" }],
      correctOption: "C", keyStatus: "derived", tags: ["probabilidad", "binomial"] },
    { id: "S2-RC-Q05", module: "RC", source: SRC(5), contextId: null, competencia: "Interpretación y representación", contentArea: "Estadística", situationContext: "familiar-personal", kind: "single-select",
      prompt: "Una bolsa contiene pelotas numeradas del 1 al 10. Si se extrae al azar una pelota, ¿cuál es la probabilidad de obtener la pelota marcada con el número 7?",
      options: [{ key: "A", text: "1/2" }, { key: "B", text: "1/10" }, { key: "C", text: "7/10" }, { key: "D", text: "5/10" }],
      correctOption: "B", keyStatus: "derived", tags: ["probabilidad", "laplace"] },
    { id: "S2-RC-Q06", module: "RC", source: SRC(6), contextId: null, competencia: "Argumentación", contentArea: "Álgebra y cálculo", situationContext: "laboral", kind: "single-select",
      prompt: "En una bodega hay cinco tipos de cajas que se distinguen por su color: verde, rojas, amarillas, blancas y cafés. La báscula solo puede registrar el peso de dos o más cajas juntas. Se registraron estas equivalencias: el peso de dos cajas cafés es igual al peso de tres cajas rojas; el peso de tres cajas blancas es igual al peso de dos cajas amarillas; el peso de tres cajas verdes es igual al peso de dos cajas rojas.\n\nA partir de la información registrada, ¿cuáles de los siguientes datos les permitirán a los operarios conocer el peso exacto de cada tipo de caja?",
      options: [{ key: "A", text: "El peso de una caja café y el peso de una caja verde" }, { key: "B", text: "El peso de una caja blanca y el peso de una caja amarilla" }, { key: "C", text: "El peso de una caja amarilla y el peso de una caja café" }, { key: "D", text: "El peso de una caja verde y el peso de una caja roja" }],
      correctOption: "C", keyStatus: "derived", tags: ["ecuaciones", "sistema"] },
    { id: "S2-RC-Q07", module: "RC", source: SRC(7), contextId: null, competencia: "Formulación y ejecución", contentArea: "Álgebra y cálculo", situationContext: "familiar-personal", kind: "single-select",
      prompt: "Hay 54 canicas, y se ponen en 6 bolsas, de modo que hay el mismo número de canicas en cada bolsa. ¿Cuántas canicas hay en 2 bolsas?",
      options: [{ key: "A", text: "18 canicas" }, { key: "B", text: "20 canicas" }, { key: "C", text: "21 canicas" }, { key: "D", text: "22 canicas" }],
      correctOption: "A", keyStatus: "derived", tags: ["proporcionalidad"] },
    { id: "S2-RC-Q08", module: "RC", source: SRC(8), contextId: null, competencia: "Formulación y ejecución", contentArea: "Álgebra y cálculo", situationContext: "comunitario-social", kind: "single-select",
      prompt: "El largo del puente A es 3 veces el largo del puente B. Si la longitud de ambos puentes suma 120 metros, entonces la longitud del puente más largo en metros es de",
      options: [{ key: "A", text: "30" }, { key: "B", text: "60" }, { key: "C", text: "90" }, { key: "D", text: "120" }],
      correctOption: "C", keyStatus: "derived", tags: ["ecuaciones"] },
    { id: "S2-RC-Q09", module: "RC", source: SRC(9), contextId: null, competencia: "Formulación y ejecución", contentArea: "Álgebra y cálculo", situationContext: "familiar-personal", kind: "single-select",
      prompt: "Un padre reparte un premio de $384.000 a sus tres hijos Marta, Juan y Diego, que aprobaron el año sin nivelaciones. Tienen anotaciones en el informe disciplinario: Marta tuvo 2, Juan 3 y Diego 6. El reparto se hace de forma inversamente proporcional a las anotaciones. ¿Cuánto recibió cada uno de ellos respectivamente?",
      options: [{ key: "A", text: "(284000, 60000, 40000)" }, { key: "B", text: "(192000, 128000, 64000)" }, { key: "C", text: "(184000, 100000, 40000)" }, { key: "D", text: "(180000, 160000, 44000)" }],
      correctOption: "B", keyStatus: "derived", tags: ["reparto-proporcional"] },
    { id: "S2-RC-Q10", module: "RC", source: SRC(10), contextId: null, competencia: "Argumentación", contentArea: "Geometría", situationContext: "divulgacion-cientifica", kind: "single-select",
      prompt: "Un rectángulo se divide en cuatro regiones (1, 2 y 3 sombreadas; 4 en blanco), como lo muestra la figura del simulacro. ¿Cuál(es) de los siguientes procedimientos permite(n) calcular el área de la región sombreada?\n\nI. Sumar las áreas de las regiones 1, 2 y 3. II. Hallar el área del rectángulo y restar el área de la región 4. III. Sumar las áreas de las regiones 2, 3 y 4.",
      options: [{ key: "A", text: "I solamente." }, { key: "B", text: "II solamente." }, { key: "C", text: "I y II solamente." }, { key: "D", text: "I y III solamente." }],
      correctOption: "C", keyStatus: "derived", tags: ["areas"] },
    { id: "S2-RC-Q11", module: "RC", source: SRC(11), contextId: "S2-RC-CTX-01", competencia: "Interpretación y representación", contentArea: "Estadística", situationContext: "comunitario-social", kind: "single-select",
      prompt: "Con los datos de la tabla de la encuesta de pregrados, ¿cuántos estudiantes fueron encuestados?",
      options: [{ key: "A", text: "20" }, { key: "B", text: "30" }, { key: "C", text: "60" }, { key: "D", text: "90" }],
      correctOption: "B", keyStatus: "derived", tags: ["frecuencias"] },
    { id: "S2-RC-Q12", module: "RC", source: SRC(12), contextId: "S2-RC-CTX-02", competencia: "Interpretación y representación", contentArea: "Estadística", situationContext: "laboral", kind: "single-select",
      prompt: "Si una persona presentó una PQR al departamento 4, ¿cuál es la probabilidad de que NO se la respondan en 24 horas?",
      options: [{ key: "A", text: "60%" }, { key: "B", text: "40%" }, { key: "C", text: "24%" }, { key: "D", text: "30%" }],
      correctOption: "B", keyStatus: "derived", tags: ["probabilidad", "complemento"] },
    { id: "S2-RC-Q13", module: "RC", source: SRC(13), contextId: "S2-RC-CTX-03", competencia: "Argumentación", contentArea: "Álgebra y cálculo", situationContext: "laboral", kind: "single-select",
      prompt: "Micaela debe ir de lunes a sábado a trabajar, y para calcular el gasto de la semana decide sumar los valores y luego dividir el total entre 6; es decir, (7.000+9.000+5.000)/6. Micaela cometió un error. ¿Cuál fue?",
      options: [{ key: "A", text: "No debe dividir en 6 sino sumar 6, que es el número de días, es decir, (7.000+9.000+5.000)+6." }, { key: "B", text: "No debe dividir el total en 6, sino multiplicarlo por 6, esto es (7.000+9.000+5.000)x6." }, { key: "C", text: "No tiene en cuenta el número de los gastos, debe resolver (7.000+9.000+5.000)/3." }, { key: "D", text: "No es correcto el orden de la operación; lo correcto es 7.000/6+9.000/6+5.000/6." }],
      correctOption: "B", keyStatus: "derived", tags: ["promedio", "error-frecuente"] },

    { id: "S2-LC-Q14", module: "LC", source: SRC(14), contextId: "S2-LC-CTX-01", competencia: "Identifica contenidos locales", contentArea: "Texto literario - crónica de opinión", situationContext: "comunitario-social", kind: "single-select",
      prompt: "La narradora del texto es",
      options: [{ key: "A", text: "una testigo, porque a pesar de que el texto está narrado en primera persona, es objetivo en sus observaciones y nos cuenta la historia con pocas referencias a sí misma." }, { key: "B", text: "omnisciente, porque conoce todo lo que pasa, desde los millones de personas que están muriendo de hambre hasta los pensamientos más íntimos del mendigo." }, { key: "C", text: "la protagonista, porque se sitúa a sí misma en el centro de la acción, habla en primera persona y cuenta los hechos desde su propio punto de vista subjetivo." }, { key: "D", text: "observadora porque hace una descripción de los hechos en segunda persona, con un conocimiento limitado a lo que puede percibir de un personaje." }],
      correctOption: "C", keyStatus: "derived", tags: ["narrador"] },
    { id: "S2-LC-Q15", module: "LC", source: SRC(15), contextId: "S2-LC-CTX-01", competencia: "Comprende articulación y sentido global", contentArea: "Texto literario - crónica de opinión", situationContext: "comunitario-social", kind: "single-select",
      prompt: "La pregunta central a la que responde el texto es:",
      options: [{ key: "A", text: "¿Cuántas personas sufrirán hambrunas en 2020?" }, { key: "B", text: "¿Cómo afecta la pandemia a ricos y a pobres?" }, { key: "C", text: "¿Por qué la pandemia afecta más a ricos que a pobres?" }, { key: "D", text: "¿Por qué el mendigo dijo que no necesitaba nada?" }],
      correctOption: "B", keyStatus: "derived", tags: ["idea-global"] },
    { id: "S2-LC-Q16", module: "LC", source: SRC(16), contextId: "S2-LC-CTX-01", competencia: "Reflexiona y evalúa el contenido", contentArea: "Texto literario - crónica de opinión", situationContext: "comunitario-social", kind: "single-select",
      prompt: "Teniendo en cuenta su estructura, tono y estilo, ¿en qué tipo de publicación podría aparecer el texto?",
      options: [{ key: "A", text: "En un libro de historia sobre los impactos sociales y económicos de la pandemia." }, { key: "B", text: "En la sección de opinión de un periódico o revista." }, { key: "C", text: "En una pieza publicitaria que promociona una nueva tarjeta de crédito." }, { key: "D", text: "En la sección de noticias de un medio de comunicación." }],
      correctOption: "B", keyStatus: "derived", tags: ["tipologia"] },
    { id: "S2-LC-Q17", module: "LC", source: SRC(17), contextId: "S2-LC-CTX-01", competencia: "Comprende articulación y sentido global", contentArea: "Texto literario - crónica de opinión", situationContext: "comunitario-social", kind: "single-select",
      prompt: "Considere los siguientes enunciados del texto:\nEnunciado 1: Esta pandemia demuestra que el virus no discrimina.\nEnunciado 2: El nuevo mendigo no ha vuelto a aparecer. Yo sigo haciendo mis compras. Con tarjeta de crédito.\n\n¿Cuál es la relación entre los enunciados 1 y 2?",
      options: [{ key: "A", text: "2 es una razón a favor de lo dicho en 1." }, { key: "B", text: "1 es una conclusión que se sigue de lo dicho en 2." }, { key: "C", text: "2 presenta una razón en contra de lo dicho en 1." }, { key: "D", text: "1 presenta una afirmación similar a lo dicho en 2." }],
      correctOption: "C", keyStatus: "derived", tags: ["relaciones-enunciados"] },
    { id: "S2-LC-Q18", module: "LC", source: SRC(18), contextId: "S2-LC-CTX-01", competencia: "Reflexiona y evalúa el contenido", contentArea: "Texto literario - crónica de opinión", situationContext: "comunitario-social", kind: "single-select",
      prompt: "De acuerdo al texto, ¿cuál de los siguientes fragmentos contiene una crítica de la autora sobre la desigualdad social durante la pandemia?",
      options: [{ key: "A", text: "Me hacen falta muchas cosas, pero no sé cuáles son. Desconecté, como un módulo desprendido de una nave, y orbito un planeta que soy yo misma, mudo, sordo, a veces ciego. Con un núcleo en llamas." }, { key: "B", text: "En el umbral del edificio había un hombre desastroso, con varias bolsas en las que llevaba lo que tenía para vivir en la calle. Conozco a los mendigos del barrio. Este era uno de los nuevos." }, { key: "C", text: "Según las estimaciones, en 2019 había 821 millones de personas en situación de inseguridad alimentaria, de las cuales aproximadamente 149 millones sufrían hambrunas de nivel de crisis." }, { key: "D", text: "He escuchado demasiadas veces esa frase de ceguera descomunal: Esta pandemia demuestra que el virus no discrimina. ¿No discrimina? El nuevo mendigo no ha vuelto a aparecer. Yo sigo haciendo mis compras. Con tarjeta de crédito." }],
      correctOption: "D", keyStatus: "derived", tags: ["critica", "desigualdad"] },
    { id: "S2-LC-Q19", module: "LC", source: SRC(19), contextId: null, competencia: "Comprende articulación y sentido global", contentArea: "Texto informativo - expositivo", situationContext: "comunitario-social", kind: "single-select",
      prompt: "La pandemia evidenció la fragilidad de los sistemas de salud y la desigualdad global en el acceso a la atención médica. Mientras algunos países acumularon vacunas, otros ni siquiera pudieron proteger a su personal sanitario. La salud, que debería ser un bien común, se convirtió en un privilegio condicionado por el poder económico. Adaptado de The Lancet (2021).\n\nEl texto plantea que la pandemia:",
      options: [{ key: "A", text: "Demostró la eficiencia del sistema de salud internacional." }, { key: "B", text: "Reforzó la cooperación entre los países ricos y pobres." }, { key: "C", text: "Puso en evidencia las desigualdades en el acceso a la salud." }, { key: "D", text: "Fue controlada gracias a la distribución equitativa de vacunas." }],
      correctOption: "C", keyStatus: "derived", tags: ["tesis"] },
    { id: "S2-LC-Q20", module: "LC", source: SRC(20), contextId: null, competencia: "Comprende articulación y sentido global", contentArea: "Texto informativo - expositivo", situationContext: "comunitario-social", kind: "single-select",
      prompt: "En la enseñanza de lenguas, los errores no deben verse como fracasos, sino como parte natural del aprendizaje. Cada error refleja una hipótesis del estudiante sobre el funcionamiento del idioma. En lugar de corregirlos de inmediato, el docente puede aprovecharlos para promover una reflexión más profunda sobre la lengua y su uso. Adaptado de Corder, S. P. (1967).\n\n¿Qué concepción del error defiende el autor?",
      options: [{ key: "A", text: "Es una muestra de descuido del estudiante." }, { key: "B", text: "Es un obstáculo que debe evitarse." }, { key: "C", text: "Es una oportunidad para aprender." }, { key: "D", text: "Es irrelevante en el proceso educativo." }],
      correctOption: "C", keyStatus: "derived", tags: ["tesis"] },
    { id: "S2-LC-Q21", module: "LC", source: SRC(21), contextId: null, competencia: "Comprende articulación y sentido global", contentArea: "Texto informativo - argumentativo", situationContext: "comunitario-social", kind: "single-select",
      prompt: "El cambio climático no solo es un fenómeno ambiental, sino también social. Las comunidades más pobres son las que menos contaminan y, sin embargo, las más afectadas por los desastres naturales. Combatir el calentamiento global implica repensar los modelos de desarrollo que perpetúan esa injusticia. Adaptado de Klein, N. (2014).\n\n¿Cuál es la tesis principal del texto?",
      options: [{ key: "A", text: "El cambio climático afecta principalmente a los países desarrollados." }, { key: "B", text: "La crisis ambiental es también una cuestión de desigualdad social." }, { key: "C", text: "Las comunidades pobres no tienen responsabilidad en el cambio climático." }, { key: "D", text: "El calentamiento global puede resolverse con educación ambiental." }],
      correctOption: "B", keyStatus: "derived", tags: ["tesis"] },
    { id: "S2-LC-Q22", module: "LC", source: SRC(22), contextId: null, competencia: "Comprende articulación y sentido global", contentArea: "Texto informativo - argumentativo", situationContext: "divulgacion-cientifica", kind: "single-select",
      prompt: "El desarrollo tecnológico no siempre ha significado progreso humano. A menudo, las innovaciones se centran en la eficiencia o la ganancia económica, dejando de lado consideraciones éticas o ambientales. La automatización, por ejemplo, ha aumentado la productividad, pero también ha desplazado a miles de trabajadores. La cuestión central no es si debemos avanzar tecnológicamente, sino cómo asegurarnos de que ese avance beneficie a todos y no solo a unos pocos. Adaptado de Harari, Y. N. (2016).\n\nSegún el autor, el verdadero problema del avance tecnológico radica en:",
      options: [{ key: "A", text: "La falta de inversión en nuevos desarrollos." }, { key: "B", text: "El desempleo que genera la automatización." }, { key: "C", text: "La ausencia de un enfoque ético y equitativo en su aplicación." }, { key: "D", text: "La resistencia de algunos sectores al cambio tecnológico." }],
      correctOption: "C", keyStatus: "derived", tags: ["tesis"] },
    { id: "S2-LC-Q23", module: "LC", source: SRC(23), contextId: null, competencia: "Comprende articulación y sentido global", contentArea: "Texto informativo - argumentativo", situationContext: "comunitario-social", kind: "single-select",
      prompt: "Las ciudades actuales están diseñadas, en muchos casos, para los automóviles más que para las personas. Las zonas verdes ceden paso a estacionamientos, y el peatón se ve obligado a esquivar vehículos. El reto del urbanismo moderno es recuperar el espacio público como lugar de encuentro y convivencia. Una ciudad verdaderamente sostenible no se mide por sus autopistas, sino por la calidad de vida que ofrece a sus habitantes. Adaptado de Jacobs, J. (1961).\n\n¿Qué se critica principalmente en el texto?",
      options: [{ key: "A", text: "La contaminación generada por los automóviles." }, { key: "B", text: "El crecimiento desordenado de las ciudades." }, { key: "C", text: "El diseño urbano centrado en los vehículos." }, { key: "D", text: "La falta de transporte público eficiente." }],
      correctOption: "C", keyStatus: "derived", tags: ["critica"] },
    { id: "S2-LC-Q24", module: "LC", source: SRC(24), contextId: null, competencia: "Comprende articulación y sentido global", contentArea: "Texto informativo - expositivo", situationContext: "comunitario-social", kind: "single-select",
      prompt: "La música no solo refleja la identidad de un pueblo, sino que también actúa como un puente emocional entre generaciones. En el Caribe colombiano, los ritmos tradicionales como el vallenato o la cumbia han resistido el paso del tiempo gracias a su capacidad de adaptarse sin perder su esencia. Hoy, los jóvenes reinterpretan esos sonidos en fusiones modernas, demostrando que la tradición no está reñida con la innovación. Adaptado de Restrepo, M. (2021).\n\n¿Qué idea central se destaca en el texto?",
      options: [{ key: "A", text: "Los jóvenes han reemplazado completamente la música tradicional." }, { key: "B", text: "La música tradicional caribeña está desapareciendo lentamente." }, { key: "C", text: "La tradición y la modernidad pueden coexistir en la música." }, { key: "D", text: "El vallenato y la cumbia son géneros que no atraen a las nuevas generaciones." }],
      correctOption: "C", keyStatus: "derived", tags: ["idea-central"] },
    { id: "S2-LC-Q25", module: "LC", source: SRC(25), contextId: null, competencia: "Reflexiona y evalúa el contenido", contentArea: "Texto informativo - expositivo", situationContext: "divulgacion-cientifica", kind: "single-select",
      prompt: "La ciencia no busca verdades absolutas, sino explicaciones provisionales que se sostienen hasta que aparece una mejor. Este carácter dinámico es lo que permite su progreso constante. Sin embargo, la sociedad suele interpretar los cambios científicos como contradicciones o fracasos, cuando en realidad son la evidencia más clara de su vitalidad. Adaptado de Sagan, C. (1996).\n\n¿Qué pretende aclarar el autor sobre la ciencia?",
      options: [{ key: "A", text: "Que sus resultados deben ser incuestionables." }, { key: "B", text: "Que los cambios científicos son señales de progreso." }, { key: "C", text: "Que la ciencia se basa en verdades inmutables." }, { key: "D", text: "Que el público no confía en los científicos." }],
      correctOption: "B", keyStatus: "derived", tags: ["tesis"] },
    { id: "S2-LC-Q26", module: "LC", source: SRC(26), contextId: null, competencia: "Comprende articulación y sentido global", contentArea: "Texto informativo - argumentativo", situationContext: "comunitario-social", kind: "single-select",
      prompt: "Leer literatura no solo amplía el vocabulario o mejora la ortografía: también cultiva la empatía. Al adentrarse en la vida de otros, el lector aprende a ver el mundo desde perspectivas distintas. En tiempos de polarización, la literatura actúa como un espacio de encuentro donde la diferencia deja de ser amenaza y se convierte en posibilidad de comprensión. Adaptado de Nussbaum, M. C. (2010).\n\nSegún el texto, la lectura literaria contribuye principalmente a:",
      options: [{ key: "A", text: "Incrementar los conocimientos lingüísticos." }, { key: "B", text: "Fomentar la comprensión entre personas diversas." }, { key: "C", text: "Promover la lectura como hábito académico." }, { key: "D", text: "Desarrollar habilidades narrativas." }],
      correctOption: "B", keyStatus: "derived", tags: ["tesis"] },
    { id: "S2-LC-Q27", module: "LC", source: SRC(27), contextId: null, competencia: "Comprende articulación y sentido global", contentArea: "Texto informativo - expositivo", situationContext: "divulgacion-cientifica", kind: "single-select",
      prompt: "Los océanos cubren más del 70% del planeta, pero siguen siendo el ecosistema menos conocido. La contaminación por plásticos ha alcanzado zonas donde el ser humano nunca ha estado. Paradójicamente, el destino de la humanidad depende de la salud de un sistema que apenas comprendemos. Cuidar el mar no es una opción ecológica: es una condición de supervivencia. Adaptado de National Geographic (2021).\n\n¿Qué relación establece el autor entre los océanos y la humanidad?",
      options: [{ key: "A", text: "Los océanos dependen del comportamiento humano." }, { key: "B", text: "La humanidad puede sobrevivir sin los océanos." }, { key: "C", text: "El bienestar humano está ligado a la salud marina." }, { key: "D", text: "La contaminación marina es un problema inevitable." }],
      correctOption: "C", keyStatus: "derived", tags: ["tesis"] },
    { id: "S2-LC-Q28", module: "LC", source: SRC(28), contextId: null, competencia: "Reflexiona y evalúa el contenido", contentArea: "Texto informativo - argumentativo", situationContext: "comunitario-social", kind: "single-select",
      prompt: "Las lenguas indígenas de América Latina están desapareciendo a un ritmo alarmante. Cada vez que muere una lengua, se extingue también una forma de entender el mundo, una cosmovisión única. Los esfuerzos por revitalizarlas no pueden limitarse a la escuela: requieren políticas públicas que garanticen su uso cotidiano en la vida social y comunitaria. Adaptado de UNESCO (2022).\n\n¿Cuál es la postura del autor frente a la pérdida de las lenguas indígenas?",
      options: [{ key: "A", text: "Es un proceso inevitable del progreso cultural." }, { key: "B", text: "Constituye una pérdida irreparable de diversidad cultural." }, { key: "C", text: "Puede resolverse únicamente con programas escolares." }, { key: "D", text: "No tiene mayor impacto en la identidad de los pueblos." }],
      correctOption: "B", keyStatus: "derived", tags: ["postura"] },

    { id: "S2-IN-Q29", module: "IN", source: SRC(29), contextId: "S2-IN-CTX-01", competencia: "Parte 4", contentArea: "Grammar", situationContext: "familiar-personal", kind: "single-select",
      prompt: "Every morning, I wake up early and get ready (6) ____ work.",
      options: [{ key: "A", text: "for" }, { key: "B", text: "to" }, { key: "C", text: "at" }],
      correctOption: "A", keyStatus: "derived", tags: ["cloze", "preposicion"] },
    { id: "S2-IN-Q30", module: "IN", source: SRC(30), contextId: "S2-IN-CTX-01", competencia: "Parte 4", contentArea: "Grammar", situationContext: "familiar-personal", kind: "single-select",
      prompt: "People hurry to catch (7) ____ buses or trains.",
      options: [{ key: "A", text: "they're" }, { key: "B", text: "there" }, { key: "C", text: "their" }],
      correctOption: "C", keyStatus: "derived", tags: ["cloze", "posesivo"] },
    { id: "S2-IN-Q31", module: "IN", source: SRC(31), contextId: "S2-IN-CTX-01", competencia: "Parte 4", contentArea: "Grammar", situationContext: "familiar-personal", kind: "single-select",
      prompt: "The barista knows me well and always prepares (8) ____ order quickly.",
      options: [{ key: "A", text: "me" }, { key: "B", text: "my" }, { key: "C", text: "mine" }],
      correctOption: "B", keyStatus: "derived", tags: ["cloze", "posesivo"] },
    { id: "S2-IN-Q32", module: "IN", source: SRC(32), contextId: "S2-IN-CTX-01", competencia: "Parte 4", contentArea: "Grammar", situationContext: "familiar-personal", kind: "single-select",
      prompt: "During the ride, I listen (9) ____ music or read the news on my phone.",
      options: [{ key: "A", text: "for" }, { key: "B", text: "to" }, { key: "C", text: "with" }],
      correctOption: "B", keyStatus: "derived", tags: ["cloze", "preposicion"] },
    { id: "S2-IN-Q33", module: "IN", source: SRC(33), contextId: "S2-IN-CTX-01", competencia: "Parte 4", contentArea: "Grammar", situationContext: "familiar-personal", kind: "single-select",
      prompt: "When I finally arrive, I feel ready to start the day and focus (10) ____ my tasks.",
      options: [{ key: "A", text: "in" }, { key: "B", text: "on" }, { key: "C", text: "at" }],
      correctOption: "B", keyStatus: "derived", tags: ["cloze", "preposicion"] },
    { id: "S2-IN-Q34", module: "IN", source: SRC(34), contextId: "S2-IN-CTX-02", competencia: "Parte 5", contentArea: "Reading comprehension", situationContext: "comunitario-social", kind: "single-select",
      prompt: "What is the main purpose of the Day of the Dead?",
      options: [{ key: "A", text: "To clean cemeteries" }, { key: "B", text: "To mourn the dead" }, { key: "C", text: "To remember deceased loved ones joyfully" }, { key: "D", text: "To prepare for Christmas" }],
      correctOption: "C", keyStatus: "derived", tags: ["lectura", "idea-principal"] },
    { id: "S2-IN-Q35", module: "IN", source: SRC(35), contextId: "S2-IN-CTX-02", competencia: "Parte 5", contentArea: "Reading comprehension", situationContext: "comunitario-social", kind: "single-select",
      prompt: "What are ofrendas?",
      options: [{ key: "A", text: "Traditional clothes" }, { key: "B", text: "Decorations for homes" }, { key: "C", text: "Foods served during the holiday" }, { key: "D", text: "Altars decorated to honor the dead" }],
      correctOption: "D", keyStatus: "derived", tags: ["lectura", "vocabulario"] },
    { id: "S2-IN-Q36", module: "IN", source: SRC(36), contextId: "S2-IN-CTX-02", competencia: "Parte 5", contentArea: "Reading comprehension", situationContext: "comunitario-social", kind: "single-select",
      prompt: "What is pan de muerto?",
      options: [{ key: "A", text: "A type of flower" }, { key: "B", text: "A traditional sweet bread" }, { key: "C", text: "A musical instrument" }, { key: "D", text: "A kind of candle" }],
      correctOption: "B", keyStatus: "derived", tags: ["lectura", "vocabulario"] },
    { id: "S2-IN-Q37", module: "IN", source: SRC(37), contextId: "S2-IN-CTX-02", competencia: "Parte 5", contentArea: "Reading comprehension", situationContext: "comunitario-social", kind: "single-select",
      prompt: "What two cultural traditions influence the Day of the Dead?",
      options: [{ key: "A", text: "Mayan and American" }, { key: "B", text: "Catholic and Aztec" }, { key: "C", text: "European and Incan" }, { key: "D", text: "Spanish and Greek" }],
      correctOption: "B", keyStatus: "derived", tags: ["lectura", "detalle"] },
    { id: "S2-IN-Q38", module: "IN", source: SRC(38), contextId: "S2-IN-CTX-02", competencia: "Parte 5", contentArea: "Reading comprehension", situationContext: "comunitario-social", kind: "single-select",
      prompt: "When did UNESCO recognize the Day of the Dead?",
      options: [{ key: "A", text: "2012" }, { key: "B", text: "1995" }, { key: "C", text: "2008" }, { key: "D", text: "2020" }],
      correctOption: "C", keyStatus: "derived", tags: ["lectura", "detalle"] },

    { id: "S2-CC-Q39", module: "CC", source: SRC(39), contextId: null, competencia: "Argumentación", contentArea: "Pluralidad, identidad y valoración de las diferencias", situationContext: "comunitario-social", kind: "single-select",
      prompt: "El secretario general de la Real Academia Española de la Lengua (RAE) declaró: «A lo largo de 300 años de historia, unos mil hombres han ocupado los sillones de la Real Academia Española de la Lengua mientras que apenas 10 mujeres han estado allí. Hoy, cinco de los 46 sillones de la Academia están ocupados por mujeres. Por la defunción de sus titulares hay tres plazas vacantes. Será un buen día para que la RAE, además de enmendar la plana a textos ajenos, empiece a corregir los errores propios».\n\n¿Existe algún prejuicio injustificable en la anterior declaración?",
      options: [{ key: "A", text: "No, pues afirma que los hombres han construido con su esfuerzo 300 años de historia de la RAE." }, { key: "B", text: "Sí, pues afirma que apenas 10 mujeres han ocupado los sillones de la Real Academia Española de la Lengua." }, { key: "C", text: "No, porque señala una desigualdad histórica en la participación de las mujeres en la RAE." }, { key: "D", text: "Sí, pues señala que a lo largo de la historia la RAE no les ha dado a los hombres la importancia que merecen." }],
      correctOption: "C", keyStatus: "derived", tags: ["prejuicio", "igualdad"] },
    { id: "S2-CC-Q40", module: "CC", source: SRC(40), contextId: null, competencia: "Pensamiento sistémico", contentArea: "Pluralidad, identidad y valoración de las diferencias", situationContext: "comunitario-social", kind: "single-select",
      prompt: "Los pueblos indígenas han ido asimilando el término desarrollo, casi siempre asociado al de la pobreza, en un enfoque estrictamente occidental: su destino parecería orientado a transitar por el sendero trazado por occidente, entre la tradición o la modernidad. La asimilación de estos paradigmas es creciente a través de centros educativos, maestros bilingües, ONGs y la propia dirigencia indígena. Tomado de Carlos Viteri Gualinga, Polis.\n\nPara el autor, ¿qué efecto negativo tiene en los pueblos indígenas la introducción del concepto de desarrollo?",
      options: [{ key: "A", text: "La cooperación de las ONGs." }, { key: "B", text: "El acceso a servicios y bienes." }, { key: "C", text: "La aniquilación de sus tradiciones." }, { key: "D", text: "La modernización de su discurso político." }],
      correctOption: "C", keyStatus: "derived", tags: ["pueblos-indigenas", "desarrollo"] },
    { id: "S2-CC-Q41", module: "CC", source: SRC(41), contextId: null, competencia: "Argumentación", contentArea: "Pluralidad, identidad y valoración de las diferencias", situationContext: "comunitario-social", kind: "single-select",
      prompt: "En una localidad del sur de la China se celebra el día más largo del año con un festival en el que se comen miles de perros. Perros y cerdos han sido criados desde siglos atrás por su carne, ya que por mucho tiempo la comida fue escasa. Según la medicina tradicional china, comer carne de perro puede aumentar la energía en el invierno, pero no debe consumirse en la primavera.\n\n¿Cuál de los siguientes enunciados NO explica la práctica de comer perros en esa localidad?",
      options: [{ key: "A", text: "Comer perros es una tradición que se ha mantenido a través de varias generaciones." }, { key: "B", text: "Comer perros se concibe por la medicina tradicional china como una práctica saludable." }, { key: "C", text: "Comer perros se considera una práctica necesaria para aumentar la energía en las estaciones del año." }, { key: "D", text: "Comer perros obedece a la escasez de otro tipo de carne animal, como la de cerdo y la de vaca." }],
      correctOption: "C", keyStatus: "derived", tags: ["multiperspectivismo", "tradicion"] },
    { id: "S2-CC-Q42", module: "CC", source: SRC(42), contextId: null, competencia: "Conocimientos", contentArea: "Participación y responsabilidad democrática", situationContext: "comunitario-social", kind: "single-select",
      prompt: "La Constitución colombiana establece que los trabajadores tienen derecho a constituir sindicatos sin intervención del Estado. Un senador promueve un proyecto de ley para que las juntas directivas de los sindicatos tengan que ser aprobadas por el Ministerio del Trabajo.\n\nEs posible que este proyecto de ley sea",
      options: [{ key: "A", text: "rechazado porque no puede ir en contravía de un mandato constitucional." }, { key: "B", text: "aprobado porque la Constitución se puede modificar para aumentar el poder del Ejecutivo." }, { key: "C", text: "rechazado porque esa no es una de las funciones del Ministerio de Trabajo establecidas en la Constitución." }, { key: "D", text: "aprobado porque mejoraría la organización y legitimidad de los sindicatos." }],
      correctOption: "A", keyStatus: "derived", tags: ["constitucion", "sindicatos"] },
    { id: "S2-CC-Q43", module: "CC", source: SRC(43), contextId: null, competencia: "Argumentación", contentArea: "Participación y responsabilidad democrática", situationContext: "laboral", kind: "single-select",
      prompt: "El Gobierno Nacional busca, ante todo, disminuir la tasa de desempleo apoyando a las empresas para que sus costos de operación disminuyan, tengan más ingresos, crezcan más y generen más empleo. Por eso el ministro propone que el incremento del salario mínimo sea relativamente bajo.\n\n¿Cuál refleja la relación planteada por el ministro entre el desempleo y el aumento del salario?",
      options: [{ key: "A", text: "Un incremento bajo del salario mínimo favorece las finanzas de los empleadores y, por ende, no los motiva hacia la búsqueda de una mayor competitividad." }, { key: "B", text: "Aunque el incremento del salario mínimo sea alto, el desempleo no va a aumentar porque los márgenes de ganancia de los empleadores son muy amplios." }, { key: "C", text: "Por más que el incremento del salario mínimo sea bajo no deja de ser un incremento y, por ende, motiva a los empleadores a disminuir el número de empleados." }, { key: "D", text: "Un incremento sustantivo del salario mínimo aumenta los gastos de los empleadores y, por ende, desmotiva la contratación de nuevos empleados." }],
      correctOption: "D", keyStatus: "derived", tags: ["salario-minimo", "desempleo"] },
    { id: "S2-CC-Q44", module: "CC", source: SRC(44), contextId: null, competencia: "Multiperspectivismo", contentArea: "Convivencia y paz", situationContext: "comunitario-social", kind: "single-select",
      prompt: "Según la vicepresidenta, las llamadas de auxilio a las líneas de emergencia durante el aislamiento crecieron 103 por ciento; los casos de violencia intrafamiliar en Bogotá prácticamente se duplicaron; Medicina Legal registra más de 11.800 ataques físicos y psicológicos contra mujeres. Tenemos una sociedad enfermiza, misógina, incapaz de respetarlas y darles garantías plenas. Lo más doloroso es que las cifras no se compadecen con la realidad porque muchas tienen que quedarse calladas. Tomado de Semana.\n\n¿Cuál explica de mejor manera el punto de vista de la autora respecto de la posición de la mujer en nuestra sociedad?",
      options: [{ key: "A", text: "La mujer está en posición desventajosa puesto que es frágil e incapaz de defenderse." }, { key: "B", text: "La mujer está en posición de igualdad respecto del hombre." }, { key: "C", text: "La mujer es sujeto de derechos lo que le permite garantías para desenvolverse plenamente en nuestra sociedad." }, { key: "D", text: "La mujer es objeto de prejuicios que la ubican en relaciones subalternas y de vulnerabilidad." }],
      correctOption: "D", keyStatus: "derived", tags: ["genero", "violencia"] },
    { id: "S2-CC-Q45", module: "CC", source: SRC(45), contextId: null, competencia: "Conocimientos", contentArea: "Participación y responsabilidad democrática", situationContext: "comunitario-social", kind: "single-select",
      prompt: "La revolución industrial se debió, entre otras causas, a la invención de la maquinaria de vapor y la concentración del capital, que permitió adquirir máquinas para producir en masa. Se pasó de la explotación de la tierra a la producción de bienes, del telar familiar a la gran fábrica, de la manufactura a la producción tecnificada.\n\nUna de las consecuencias de esta revolución, respecto a la población, fue",
      options: [{ key: "A", text: "traslado del campo a la ciudad y el surgimiento del proletariado urbano." }, { key: "B", text: "crecimiento de la población rural sobre la urbana." }, { key: "C", text: "nacimiento de la elite propietaria de la tierra." }, { key: "D", text: "desarrollo de un modelo económico para la protección del proletariado." }],
      correctOption: "A", keyStatus: "derived", tags: ["revolucion-industrial"] },
    { id: "S2-CC-Q46", module: "CC", source: SRC(46), contextId: null, competencia: "Multiperspectivismo", contentArea: "Pluralidad, identidad y valoración de las diferencias", situationContext: "comunitario-social", kind: "single-select",
      prompt: "En el último párrafo del extracto citado sobre la visión indígena del desarrollo (Viteri Gualinga, Polis), ¿cuál de las siguientes afirmaciones describe la forma como el escritor utiliza la expresión «en vías de desarrollo»?",
      options: [{ key: "A", text: "Niega que los pueblos indígenas quieran adoptar el concepto de desarrollo en los términos occidentales." }, { key: "B", text: "Enfatiza en que los pueblos indígenas acuñan términos occidentales." }, { key: "C", text: "Afirma que los pueblos indígenas son colectividades en vía de desarrollo." }, { key: "D", text: "La emplea en sentido irónico denotando que la expresión es inapropiada para explicar la realidad del fenómeno." }],
      correctOption: "D", keyStatus: "derived", tags: ["pueblos-indigenas", "ironia"] },
    { id: "S2-CC-Q47", module: "CC", source: SRC(47), contextId: null, competencia: "Conocimientos", contentArea: "Participación y responsabilidad democrática", situationContext: "comunitario-social", kind: "single-select",
      prompt: "En el barrio de Pedro hay un humedal usado como botadero de basura y escombrera. La comunidad ha presentado reiteradas peticiones ante la Corporación Ambiental, que afirma que intervendrá pero en la práctica no ha adelantado los controles que las normas imponen.\n\n¿De las siguientes opciones jurídicas cuál es la más pertinente para que Pedro y sus vecinos logren que la autoridad ambiental intervenga y controle la situación?",
      options: [{ key: "A", text: "Acción de grupo." }, { key: "B", text: "Acción de cumplimiento." }, { key: "C", text: "Conciliación extrajudicial." }, { key: "D", text: "Derecho de petición." }],
      correctOption: "B", keyStatus: "derived", tags: ["mecanismos", "accion-de-cumplimiento"] }
  ];

  // ---------- Ensayo del simulacro (pregunta 48): se suma al banco CE existente ----------
  window.SESP.data.questions.CE = window.SESP.data.questions.CE || [];
  window.SESP.data.questions.CE.push({
    id: "S2-CE-01",
    module: "CE",
    source: { cuadernillo: "Segundo Simulacro 2026-2 (Microsoft Forms)", year: 2026, publisher: "Simulacro interno (docente)", url: null, originalNumber: 48 },
    kind: "essay",
    title: "Lenguaje incluyente en documentos oficiales y académicos",
    context: "En Colombia, el uso del lenguaje incluyente ha suscitado un intenso debate. Sus defensores creen que podría fomentar la equidad de género y la inclusión en la comunicación pública y académica; sus detractores argumentan que podría causar confusión y complicar la comprensión del lenguaje.",
    prompt: "¿Considera usted que es beneficioso implementar el lenguaje incluyente en documentos oficiales y académicos en Colombia? Justifique su respuesta.",
    rubric: {
      planteamiento: "Plantee una posición clara (a favor o en contra), sustentada exclusivamente en la información del texto.",
      organizacion: "Organice el escrito en introducción, desarrollo y conclusión, retomando ideas centrales (beneficios, riesgos o conclusiones). Extensión sugerida: entre 120 y 180 palabras.",
      formaExpresion: "Mantenga coherencia global, claridad en las ideas y adecuada redacción."
    }
  });
})();
