// Repaso de errores: cola de preguntas falladas o lentas (repetición espaciada
// simple, ver core/storage.js). No aplica a CE, que no se autocalifica.
window.SESP = window.SESP || {};
window.SESP.modes = window.SESP.modes || {};

window.SESP.modes.review = (function () {
  const engine = window.SESP.core.engine;
  const storage = window.SESP.core.storage;
  const stats = window.SESP.core.stats;

  // Cuántas preguntas hay pendientes de repaso ahora mismo (para mostrarlo en la UI
  // antes de empezar, o para saber si el modo está disponible).
  function countDue(moduleFilter) {
    return storage.getDueReviewQuestionIds(moduleFilter || null).length;
  }

  // options: { moduleFilter? } — si no se da, mezcla preguntas pendientes de todos los módulos.
  function start(options) {
    const moduleFilter = (options && options.moduleFilter) || null;
    const ids = storage.getDueReviewQuestionIds(moduleFilter);
    const pool = ids.map(engine.findQuestionById).filter(Boolean);
    if (!pool.length) return null; // nada pendiente de repasar

    const session = engine.createSession({
      mode: "review",
      moduleFilter: moduleFilter,
      moduleTimers: engine.buildModuleTimers(),
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

  // Al guardar, core/storage.js ya actualiza la cola de repaso con estas mismas
  // respuestas: lo que se acertó rápido dos veces seguidas sale de la cola.
  function finish(session) {
    engine.finish(session);
    storage.recordSession(session);
    return stats.summarizeSession(session);
  }

  return {
    countDue,
    start,
    submitAnswer,
    next,
    finish,
  };
})();
