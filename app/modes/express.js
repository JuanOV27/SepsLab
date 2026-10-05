// Modo Exprés: sesión de duración fija (15/30/60 min) sobre las áreas y las fuentes
// que el usuario marque. Ver docs/PLAN.md, sección "Modo Exprés — diseño detallado".
//
// Dos ejes independientes:
//  - `modules`: qué áreas entran a la mezcla (RC, LC, CC, IN, FP, DS, PC o CE).
//  - `sources`: de dónde salen las preguntas — "oficial" (cuadernillos ICFES) y/o
//    "generado" (banco de entrenamiento, ver app/data/questions.gen.*.js).
//
// CE es de ensayo, no de opción múltiple: solo corre si es la única área marcada.
window.SESP = window.SESP || {};
window.SESP.modes = window.SESP.modes || {};

window.SESP.modes.express = (function () {
  const engine = window.SESP.core.engine;
  const storage = window.SESP.core.storage;
  const stats = window.SESP.core.stats;

  const VALID_DURATIONS = [15, 30, 60];

  function getModuleMeta(moduleId) {
    return window.SESP.data.modules.find((m) => m.id === moduleId) || null;
  }

  // Áreas que se pueden mezclar entre sí (todo lo que sea de opción múltiple).
  function mixableModules() {
    return (window.SESP.data.modules || []).filter((m) => m.kind === "single-select");
  }

  function officialPool(moduleId) {
    return (window.SESP.data.questions[moduleId] || []).filter((q) => q.kind === "single-select");
  }

  function generatedPool(moduleId) {
    return (window.SESP.data.questions.GEN || []).filter((q) => q.module === moduleId && q.kind === "single-select");
  }

  // Cuántas preguntas quedarían con una selección dada (lo usa la UI para avisar
  // antes de empezar, sin tener que crear la sesión).
  function countFor(modules, sources) {
    return buildPool(modules || [], sources || []).length;
  }

  function buildPool(modules, sources) {
    const wantsOfficial = sources.indexOf("oficial") !== -1;
    const wantsGenerated = sources.indexOf("generado") !== -1;
    return modules.reduce((acc, moduleId) => {
      if (wantsOfficial) acc = acc.concat(officialPool(moduleId));
      if (wantsGenerated) acc = acc.concat(generatedPool(moduleId));
      return acc;
    }, []);
  }

  function essayTopics(sources) {
    const wantsOfficial = sources.indexOf("oficial") !== -1;
    const wantsGenerated = sources.indexOf("generado") !== -1;
    let topics = [];
    if (wantsOfficial) topics = topics.concat(window.SESP.data.questions.CE || []);
    if (wantsGenerated) topics = topics.concat((window.SESP.data.questions.GEN || []).filter((q) => q.module === "CE" && q.kind === "essay"));
    return topics;
  }

  // Etiqueta corta para el historial de sesiones ("RC+LC", "Todas", "CE"…).
  function describeSelection(modules) {
    const mixable = mixableModules().map((m) => m.id);
    if (modules.length === mixable.length && mixable.every((id) => modules.indexOf(id) !== -1)) return "Todas";
    return modules.join("+");
  }

  // options: { durationMinutes: 15|30|60, modules: string[], sources: ("oficial"|"generado")[] }
  function start(options) {
    if (VALID_DURATIONS.indexOf(options.durationMinutes) === -1) {
      throw new Error("SESP.modes.express: duración inválida, debe ser 15, 30 o 60.");
    }
    const modules = options.modules || [];
    const sources = options.sources || [];
    if (!modules.length) throw new Error("Marca al menos un área para practicar.");
    if (!sources.length) throw new Error("Marca al menos una fuente de preguntas.");

    if (modules.length === 1 && modules[0] === "CE") return startEssay(options.durationMinutes, sources);

    const pool = buildPool(modules, sources);
    if (!pool.length) throw new Error("No hay preguntas con esa combinación de áreas y fuentes.");

    const session = engine.createSession({
      mode: "express",
      areaFilter: describeSelection(modules),
      durationMinutes: options.durationMinutes,
      moduleTimers: engine.buildModuleTimers(),
      totalTimeLimitMs: options.durationMinutes * 60 * 1000,
      questions: engine.shuffle(pool),
    });
    session.modules = modules.slice();
    session.sources = sources.slice();
    session._pool = pool; // banco filtrado completo, para rebarajar si se agota
    engine.start(session);
    return session;
  }

  // CE nunca se mezcla con las demás áreas. Si la duración es 60, se usa el
  // esquema real completo (10+30=40 min, la sesión no necesita agotar los 60).
  // Si es 15 o 30, se usa el escalamiento ya calculado en app/data/modules.js.
  function startEssay(durationMinutes, sources) {
    const meta = getModuleMeta("CE");
    const topics = essayTopics(sources);
    if (!topics.length) throw new Error("No hay temas de ensayo con esa fuente.");
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
    mixableModules,
    countFor,
    start,
    submitAnswer,
    advance,
    isSessionOver,
    finish,
    finishEssay,
  };
})();
