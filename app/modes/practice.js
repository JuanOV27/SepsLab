// Práctica libre: un módulo (y opcionalmente una competencia específica) sin
// presión de tiempo. El cronómetro sigue corriendo y quedando registrado para las
// estadísticas, pero nada obliga a avanzar ni corta la sesión por tiempo.
window.SESP = window.SESP || {};
window.SESP.modes = window.SESP.modes || {};

window.SESP.modes.practice = (function () {
  const engine = window.SESP.core.engine;
  const storage = window.SESP.core.storage;
  const stats = window.SESP.core.stats;

  function getModuleMeta(moduleId) {
    return window.SESP.data.modules.find((m) => m.id === moduleId) || null;
  }

  function listCompetencias(moduleId) {
    const pool = window.SESP.data.questions[moduleId] || [];
    return Array.from(new Set(pool.map((q) => q.competencia).filter(Boolean)));
  }

  // options: { moduleId, competencia? }
  function start(options) {
    const meta = getModuleMeta(options.moduleId);
    if (!meta) throw new Error(`SESP.modes.practice: módulo desconocido "${options.moduleId}".`);

    if (meta.kind === "essay") return startEssay(meta);

    let pool = (window.SESP.data.questions[options.moduleId] || []).slice();
    if (options.competencia) pool = pool.filter((q) => q.competencia === options.competencia);
    if (!pool.length) throw new Error("SESP.modes.practice: no hay preguntas para ese filtro.");

    const session = engine.createSession({
      mode: "practice",
      moduleFilter: options.moduleId,
      moduleTimers: engine.buildModuleTimers(),
      questions: engine.shuffle(pool),
    });
    engine.start(session);
    return session;
  }

  // CE en práctica libre usa siempre el esquema real completo (10 min + 30 min):
  // no hay selector de duración fuera de Modo Exprés.
  function startEssay(meta) {
    const topics = window.SESP.data.questions.CE || [];
    if (!topics.length) throw new Error("SESP.modes.practice: no hay temas de ensayo disponibles.");
    const topic = topics[Math.floor(Math.random() * topics.length)];
    const real = meta.essayScaling[60];
    const session = engine.createEssaySession({
      mode: "practice",
      topic: topic,
      planningMs: real.planningMinutes * 60 * 1000,
      writingMs: real.writingMinutes * 60 * 1000,
    });
    engine.startEssay(session);
    return session;
  }

  function submitAnswer(session, selectedOption) {
    return engine.submitAnswer(session, selectedOption);
  }

  // Devuelve false cuando ya no hay más preguntas (la sesión terminó).
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
    storage.recordSession(record);
    return stats.summarizeEssaySession(record);
  }

  return {
    listCompetencias,
    start,
    submitAnswer,
    next,
    finish,
    finishEssay,
  };
})();
