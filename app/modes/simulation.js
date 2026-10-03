// Simulacro cronometrado: reproduce el ritmo real de UN módulo completo, sin
// pausas ni vuelta atrás — a diferencia de Práctica libre (sin presión de tiempo)
// y de Modo Exprés (duración fija elegida por el usuario, mezcla de áreas).
//
// Nota de alcance: docs/PLAN.md no detalla si el simulacro debe encadenar los 5
// módulos genéricos en una sola sesión de ~4h40m (como el examen real completo)
// o simular un módulo a la vez. Se implementó módulo a la vez porque es lo que
// queda unívocamente definido con la información disponible; si se quiere el
// maratón completo de 5 módulos encadenados, es un cambio a futuro sobre este mismo archivo.
window.SESP = window.SESP || {};
window.SESP.modes = window.SESP.modes || {};

window.SESP.modes.simulation = (function () {
  const engine = window.SESP.core.engine;
  const storage = window.SESP.core.storage;
  const stats = window.SESP.core.stats;

  function getModuleMeta(moduleId) {
    return window.SESP.data.modules.find((m) => m.id === moduleId) || null;
  }

  // options: { moduleId }
  function start(options) {
    const meta = getModuleMeta(options.moduleId);
    if (!meta) throw new Error(`SESP.modes.simulation: módulo desconocido "${options.moduleId}".`);

    if (meta.kind === "essay") return startEssay(meta);

    const pool = (window.SESP.data.questions[options.moduleId] || []).slice();
    if (!pool.length) throw new Error("SESP.modes.simulation: no hay preguntas para ese módulo.");

    // Tiempo total realista del bloque: todas las preguntas del módulo al ritmo objetivo.
    const totalTimeLimitMs = pool.length * meta.targetSeconds * 1000;

    const session = engine.createSession({
      mode: "simulation",
      moduleFilter: options.moduleId,
      moduleTimers: engine.buildModuleTimers(),
      totalTimeLimitMs: totalTimeLimitMs,
      questions: engine.shuffle(pool),
    });
    engine.start(session);
    return session;
  }

  // CE ya es, de por sí, un bloque cronometrado sin pausas (10 min + 30 min reales):
  // simularlo es simplemente correr el esquema real completo.
  function startEssay(meta) {
    const topics = window.SESP.data.questions.CE || [];
    if (!topics.length) throw new Error("SESP.modes.simulation: no hay temas de ensayo disponibles.");
    const topic = topics[Math.floor(Math.random() * topics.length)];
    const real = meta.essayScaling[60];
    const session = engine.createEssaySession({
      mode: "simulation",
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

  // "Sin pausas": solo se puede seguir adelante. Si el banco se agota antes de
  // tiempo (no debería pasar, el límite ya se calculó sobre el total de preguntas),
  // la sesión simplemente termina ahí.
  function next(session) {
    if (!engine.hasMoreQuestions(session)) return false;
    engine.advance(session);
    return true;
  }

  function isSessionOver(session, now) {
    return engine.isTimeUp(session, now);
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
    start,
    submitAnswer,
    next,
    isSessionOver,
    finish,
    finishEssay,
  };
})();
