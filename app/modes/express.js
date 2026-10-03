// Modo Exprés: sesión de duración fija (15/30/60 min), área "Todas" (mezcla
// RC+LC+CC+IN) o una específica (RC/LC/CC/IN/CE). Ver docs/PLAN.md, sección
// "Modo Exprés — diseño detallado" para las reglas exactas que esto implementa.
window.SESP = window.SESP || {};
window.SESP.modes = window.SESP.modes || {};

window.SESP.modes.express = (function () {
  const engine = window.SESP.core.engine;
  const storage = window.SESP.core.storage;
  const stats = window.SESP.core.stats;

  const MIXED_MODULES = ["RC", "LC", "CC", "IN"];
  const VALID_DURATIONS = [15, 30, 60];

  function getModuleMeta(moduleId) {
    return window.SESP.data.modules.find((m) => m.id === moduleId) || null;
  }

  function buildPool(areaFilter) {
    if (areaFilter === "Todas") {
      return MIXED_MODULES.reduce((acc, moduleId) => acc.concat(window.SESP.data.questions[moduleId] || []), []);
    }
    return (window.SESP.data.questions[areaFilter] || []).slice();
  }

  // options: { durationMinutes: 15|30|60, areaFilter: "Todas"|"RC"|"LC"|"CC"|"IN"|"CE" }
  function start(options) {
    if (VALID_DURATIONS.indexOf(options.durationMinutes) === -1) {
      throw new Error("SESP.modes.express: duración inválida, debe ser 15, 30 o 60.");
    }

    if (options.areaFilter === "CE") return startEssay(options.durationMinutes);

    const pool = buildPool(options.areaFilter);
    if (!pool.length) throw new Error("SESP.modes.express: no hay preguntas para esa área.");

    const session = engine.createSession({
      mode: "express",
      areaFilter: options.areaFilter,
      durationMinutes: options.durationMinutes,
      moduleTimers: engine.buildModuleTimers(),
      totalTimeLimitMs: options.durationMinutes * 60 * 1000,
      questions: engine.shuffle(pool),
    });
    session._pool = pool; // banco filtrado completo, para rebarajar si se agota
    engine.start(session);
    return session;
  }

  // CE nunca se mezcla con las demás áreas. Si la duración es 60, se usa el
  // esquema real completo (10+30=40 min, la sesión no necesita agotar los 60).
  // Si es 15 o 30, se usa el escalamiento ya calculado en app/data/modules.js.
  function startEssay(durationMinutes) {
    const meta = getModuleMeta("CE");
    const topics = window.SESP.data.questions.CE || [];
    if (!topics.length) throw new Error("SESP.modes.express: no hay temas de ensayo disponibles.");
    const topic = topics[Math.floor(Math.random() * topics.length)];
    const scaled = meta.essayScaling[durationMinutes];

    const session = engine.createEssaySession({
      mode: "express",
      topic: topic,
      planningMs: scaled.planningMinutes * 60 * 1000,
      writingMs: scaled.writingMinutes * 60 * 1000,
    });
    session.durationMinutes = durationMinutes;
    engine.startEssay(session);
    return session;
  }

  // Se llama DESPUÉS de registrar la respuesta actual (nunca antes): la sesión
  // exprés siempre termina la pregunta que ya empezó, no corta a la mitad.
  function isSessionOver(session, now) {
    return engine.isTimeUp(session, now);
  }

  // Avanza a la siguiente pregunta. Si el banco filtrado se agotó antes de que
  // se cumpliera el tiempo, lo rebaraja evitando repetir la pregunta que se
  // acaba de responder, y sigue por ahí.
  function advance(session) {
    if (!engine.hasMoreQuestions(session)) {
      const lastQuestion = engine.getCurrentQuestion(session);
      let reshuffled = engine.shuffle(session._pool);
      if (reshuffled.length > 1 && reshuffled[0].id === lastQuestion.id) {
        [reshuffled[0], reshuffled[1]] = [reshuffled[1], reshuffled[0]];
      }
      session.questions = session.questions.concat(reshuffled);
    }
    engine.advance(session);
    return engine.getCurrentQuestion(session);
  }

  function submitAnswer(session, selectedOption) {
    return engine.submitAnswer(session, selectedOption);
  }

  function finish(session) {
    engine.finish(session);
    storage.recordSession(session);
    return stats.summarizeSession(session);
  }

  function finishEssay(session) {
    engine.finishEssay(session);
    const record = engine.essaySessionToRecord(session);
    record.durationMinutes = session.durationMinutes;
    storage.recordSession(record);
    return stats.summarizeEssaySession(record);
  }

  return {
    start,
    submitAnswer,
    advance,
    isSessionOver,
    finish,
    finishEssay,
  };
})();
