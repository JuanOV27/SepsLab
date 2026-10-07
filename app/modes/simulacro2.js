// Simulacro 2026-2: las preguntas del Word del simulacro interno (preguntas 4 a 48),
// en una sección propia separada del banco ICFES 2018. Funciona como práctica libre
// (cronómetro informativo por pregunta, sin corte de tiempo): el área filtra por
// módulo real (RC/LC/CC/IN/CE) o mezcla todo con "Todas".
//
// Nota sobre la clave: ver app/data/questions.s2.js — las opciones correctas se
// resolvieron desde el enunciado (`keyStatus: "derived"`) y están pendientes de
// verificación oficial con el docente.
window.SESP = window.SESP || {};
window.SESP.modes = window.SESP.modes || {};

window.SESP.modes.simulacro2 = (function () {
  const engine = window.SESP.core.engine;
  const storage = window.SESP.core.storage;
  const stats = window.SESP.core.stats;

  const AREAS = ["Todas", "RC", "LC", "CC", "IN", "CE"];

  function listAreas() {
    return AREAS.slice();
  }

  function countByArea(area) {
    const pool = window.SESP.data.questions.S2 || [];
    if (area === "Todas") return pool.length;
    return pool.filter((q) => q.module === area).length;
  }

  // options: { areaFilter } — "Todas" o un módulo ("RC"/"LC"/"CC"/"IN"/"CE").
  function start(options) {
    const area = (options && options.areaFilter) || "Todas";

    if (area === "CE") {
      const topics = (window.SESP.data.questions.CE || []).filter((t) => t.id === "S2-CE-01");
      const topic = topics[0] || window.SESP.data.questions.CE[0];
      if (!topic) throw new Error("SESP.modes.simulacro2: no hay tema de ensayo del simulacro.");
      const meta = window.SESP.data.modules.find((m) => m.id === "CE");
      const real = meta.essayScaling[60];
      const session = engine.createEssaySession({
        mode: "simulacro2",
        topic: topic,
        planningMs: real.planningMinutes * 60 * 1000,
        writingMs: real.writingMinutes * 60 * 1000,
      });
      session.areaFilter = area;
      engine.startEssay(session);
      return session;
    }

    let pool = (window.SESP.data.questions.S2 || []).slice();
    if (area !== "Todas") pool = pool.filter((q) => q.module === area);
    if (!pool.length) throw new Error("SESP.modes.simulacro2: no hay preguntas para ese filtro.");

    const session = engine.createSession({
      mode: "simulacro2",
      moduleFilter: area === "Todas" ? null : area,
      moduleTimers: engine.buildModuleTimers(),
      areaFilter: "S2-" + area,
      questions: engine.shuffle(pool),
    });
    engine.start(session);
    return session;
  }

  function submitAnswer(session, selectedOption) {
    return engine.submitAnswer(session, selectedOption);
  }

  function next(session) {
    if (!engine.hasMoreQuestions(session)) return false;
    engine.advance(session);
    return true;
  }

  function finish(session) {
    engine.finish(session);
    storage.recordSession(session);
    return stats.summarizeSession(session);
  }

  function finishEssay(session) {
    engine.finishEssay(session);
    const record = engine.essaySessionToRecord(session);
    record.areaFilter = session.areaFilter || "S2-CE";
    storage.recordSession(record);
    return stats.summarizeEssaySession(record);
  }

  return {
    listAreas,
    countByArea,
    start,
    submitAnswer,
    next,
    finish,
    finishEssay,
  };
})();
