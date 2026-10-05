// Modo Entrenamiento: corre sobre el banco NO oficial (window.SESP.data.questions.GEN,
// ver app/data/questions.gen.*.js) en vez de los cuadernillos del ICFES.
//
// Existe por dos razones:
//  1. El banco oficial se agota — cuando ya se sabe la respuesta de memoria, repetirlo
//     mide memoria y no competencia.
//  2. Cada pregunta de este banco trae `explanation` con el razonamiento resuelto, que
//     es justo lo que los cuadernillos oficiales no publican.
//
// Deliberadamente NO toca los demás modos: práctica, simulacro, exprés y repaso siguen
// corriendo solo sobre material oficial.
window.SESP = window.SESP || {};
window.SESP.modes = window.SESP.modes || {};

window.SESP.modes.training = (function () {
  const engine = window.SESP.core.engine;
  const storage = window.SESP.core.storage;
  const stats = window.SESP.core.stats;

  function allQuestions() {
    return window.SESP.data.questions.GEN || [];
  }

  // Solo los módulos que realmente tienen preguntas generadas, en el orden en que
  // aparecen en modules.js (para que el selector no liste módulos vacíos).
  function listModules() {
    const withQuestions = new Set(allQuestions().map((q) => q.module));
    return (window.SESP.data.modules || []).filter((m) => withQuestions.has(m.id));
  }

  function countFor(moduleId) {
    if (!moduleId || moduleId === "Todas") return allQuestions().filter((q) => q.kind === "single-select").length;
    return allQuestions().filter((q) => q.module === moduleId).length;
  }

  function listCompetencias(moduleId) {
    const pool = allQuestions().filter((q) => q.module === moduleId);
    return Array.from(new Set(pool.map((q) => q.competencia).filter(Boolean)));
  }

  function getModuleMeta(moduleId) {
    return (window.SESP.data.modules || []).find((m) => m.id === moduleId) || null;
  }

  // options: { moduleId: "RC"|…|"CE"|"Todas", competencia? }
  function start(options) {
    const moduleId = options.moduleId || "Todas";
    const meta = getModuleMeta(moduleId);
    if (meta && meta.kind === "essay") return startEssay(meta);

    // "Todas" nunca mezcla ensayos con opción múltiple: son sesiones distintas.
    let pool = allQuestions().filter((q) => q.kind === "single-select");
    if (moduleId !== "Todas") pool = pool.filter((q) => q.module === moduleId);
    if (options.competencia) pool = pool.filter((q) => q.competencia === options.competencia);
    if (!pool.length) throw new Error("SESP.modes.training: no hay preguntas de entrenamiento para ese filtro.");

    const session = engine.createSession({
      mode: "training",
      moduleFilter: moduleId === "Todas" ? null : moduleId,
      moduleTimers: engine.buildModuleTimers(),
      questions: engine.shuffle(pool),
    });
    engine.start(session);
    return session;
  }

  // Igual que en Práctica libre: esquema real completo (10 min de planeación + 30 de
  // escritura), con un tema del banco generado.
  function startEssay(meta) {
    const topics = allQuestions().filter((q) => q.module === meta.id && q.kind === "essay");
    if (!topics.length) throw new Error("SESP.modes.training: no hay temas de ensayo en el banco de entrenamiento.");
    const topic = topics[Math.floor(Math.random() * topics.length)];
    const real = meta.essayScaling[60];
    const session = engine.createEssaySession({
      mode: "training",
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
    listModules,
    listCompetencias,
    countFor,
    start,
    submitAnswer,
    next,
    finish,
    finishEssay,
  };
})();
