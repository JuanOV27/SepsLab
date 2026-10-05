// BANCO DE ENTRENAMIENTO — Comunicación Escrita (NO OFICIAL)
//
// Ver la cabecera de questions.gen.rc.js para la advertencia completa: esto NO es
// material del ICFES. Son 5 temas nuevos con la misma estructura de los oficiales
// (situación polémica breve + pregunta cerrada que exige tomar postura y sustentarla).
//
// Diferencia con los temas oficiales: la rúbrica de abajo NO intenta reproducir la del
// ICFES, porque el cuadernillo oficial no publica uno. Es una lista de autoevaluación
// concreta, construida a partir de los criterios que el examen sí declara (postura,
// desarrollo de argumentos, estructura, claridad), y sirve para revisarse uno mismo
// después de escribir — que es para lo que se practica este módulo.
//
// Viven en window.SESP.data.questions.GEN con kind: "essay", igual que las preguntas
// generadas de opción múltiple viven ahí con kind: "single-select".
window.SESP = window.SESP || {};
window.SESP.data = window.SESP.data || {};
window.SESP.data.questions = window.SESP.data.questions || {};
window.SESP.data.questions.GEN = window.SESP.data.questions.GEN || [];

(function () {
  const SOURCE = {
    cuadernillo: "Banco de entrenamiento SESP",
    year: 2026,
    publisher: "Generado para este proyecto — NO es material del ICFES",
    url: null,
  };

  // Los tres criterios son los mismos para todos los temas (es lo que evalúa el módulo,
  // no el tema); lo que cambia es el contenido sobre el que se aplican.
  const RUBRIC = {
    planteamiento: "¿Respondiste LA pregunta que te hicieron, y no una parecida? Es la causa número uno de anulación. ¿Tu postura queda explícita en el primer párrafo, sin rodeos del tipo «hay opiniones divididas»? ¿Diste al menos dos razones distintas que la sostengan (no la misma razón dicha dos veces)? ¿Cada razón viene con algo que la respalde — un dato, un ejemplo concreto, una consecuencia verificable — y no solo con una afirmación más? ¿Reconociste al menos una objeción de la postura contraria y dijiste por qué no te hace cambiar de opinión? El examen no premia la posición que tomes: premia cómo la sostienes.",
    organizacion: "¿Se distinguen introducción, desarrollo y conclusión? ¿Cada párrafo desarrolla una sola idea, en lugar de amontonar varias? ¿Usaste conectores que marquen de verdad la relación entre ideas (por eso, sin embargo, en cambio, por lo tanto) y no solo para rellenar? ¿La conclusión cierra con algo más que repetir la introducción — una implicación, una condición, una consecuencia? Con 30 minutos de escritura, tres o cuatro párrafos bien armados valen más que seis a medias.",
    formaExpresion: "¿Se entiende a la primera lectura? ¿Las frases son de largo manejable o hay oraciones de cinco líneas sin punto? ¿Revisaste concordancia (sujeto-verbo, género-número), tildes y puntuación? ¿Evitaste muletillas y frases de relleno del tipo «desde tiempos inmemoriales» o «es un tema muy importante en la actualidad»? El registro debe ser formal pero no rebuscado: usar palabras difíciles mal empleadas penaliza más que usar palabras simples bien empleadas.",
  };

  window.SESP.data.questions.GEN.push(
    {
      id: "GEN-CE-T01",
      module: "CE",
      generated: true,
      source: { ...SOURCE },
      kind: "essay",
      title: "Celulares en las aulas de clase",
      context: "Varios países han prohibido el uso de teléfonos celulares dentro de las aulas de colegios públicos. Quienes apoyan la medida sostienen que el dispositivo fragmenta la atención y que el rendimiento académico mejora cuando desaparece del salón. Quienes se oponen argumentan que el celular es hoy una herramienta de consulta y de inclusión —no todos los estudiantes tienen computador en casa— y que prohibirlo evade el problema de fondo, que es enseñar a usarlo.",
      prompt: "¿Está de acuerdo con que se prohíba el uso de celulares dentro de las aulas de clase en Colombia?",
      rubric: RUBRIC,
    },
    {
      id: "GEN-CE-T02",
      module: "CE",
      generated: true,
      source: { ...SOURCE },
      kind: "essay",
      title: "Inteligencia artificial en los trabajos universitarios",
      context: "Algunas universidades han prohibido el uso de herramientas de inteligencia artificial para elaborar trabajos académicos y lo sancionan como fraude. Otras han optado por permitirlo con la condición de que el estudiante declare cómo lo usó. Los primeros alegan que delegar la escritura impide desarrollar el pensamiento propio; los segundos, que prohibir una herramienta que el estudiante usará toda su vida profesional deja a la universidad desconectada del mundo laboral.",
      prompt: "¿Está de acuerdo con que las universidades colombianas prohíban el uso de inteligencia artificial en los trabajos académicos?",
      rubric: RUBRIC,
    },
    {
      id: "GEN-CE-T03",
      module: "CE",
      generated: true,
      source: { ...SOURCE },
      kind: "essay",
      title: "Voto obligatorio",
      context: "En Colombia el voto es un derecho, no un deber exigible: quien no vota no recibe sanción. Varios países de la región, en cambio, tienen voto obligatorio con multa para quien se abstiene. Quienes proponen adoptarlo aquí señalan que la abstención supera con frecuencia la mitad del censo electoral y que eso debilita la legitimidad de los elegidos. Quienes lo rechazan responden que obligar a votar no produce votantes informados, y que la abstención también es una forma de manifestación política.",
      prompt: "¿Está de acuerdo con que en Colombia el voto sea obligatorio?",
      rubric: RUBRIC,
    },
    {
      id: "GEN-CE-T04",
      module: "CE",
      generated: true,
      source: { ...SOURCE },
      kind: "essay",
      title: "Jornada laboral de cuatro días",
      context: "Varias empresas en distintos países han ensayado una jornada laboral de cuatro días sin reducir el salario. Los resultados reportados señalan menor ausentismo y mejor salud mental de los trabajadores, con productividad igual o superior. Los críticos advierten que esos ensayos se hicieron casi siempre en empresas de oficina, y que el esquema es difícil de trasladar a sectores como la salud, el comercio, el transporte o la manufactura, donde la operación depende de que haya alguien presente.",
      prompt: "¿Está de acuerdo con que en Colombia se adopte por ley una jornada laboral de cuatro días?",
      rubric: RUBRIC,
    },
    {
      id: "GEN-CE-T05",
      module: "CE",
      generated: true,
      source: { ...SOURCE },
      kind: "essay",
      title: "Programación como asignatura obligatoria",
      context: "Se ha propuesto que la programación sea una asignatura obligatoria en todos los colegios del país, desde la básica secundaria. Quienes están a favor sostienen que programar enseña a descomponer problemas y que la alfabetización digital será un requisito básico de empleabilidad. Quienes se oponen señalan que muchos colegios del país no tienen conectividad estable ni docentes formados en el área, y que volverla obligatoria sin resolver eso ampliaría la brecha entre quienes ya tienen acceso y quienes no.",
      prompt: "¿Está de acuerdo con que la programación sea una asignatura obligatoria en los colegios colombianos?",
      rubric: RUBRIC,
    }
  );
})();
