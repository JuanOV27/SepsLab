// Máquina de estados de una sesión: pregunta actual, cronómetro, respuestas.
// No conoce localStorage ni el DOM: modes/*.js arma la cola de preguntas y llama a
// core/storage.js al terminar; ui/app.js dibuja la pantalla y hace tick del reloj
// llamando repetidamente a los getters de tiempo de aquí.
window.SESP = window.SESP || {};
window.SESP.core = window.SESP.core || {};

window.SESP.core.engine = (function () {
  // config: { mode, questions, moduleTimers, totalTimeLimitMs, areaFilter, durationMinutes }
  // moduleTimers: { RC: 100000, LC: 100000, ... } tiempo objetivo por pregunta en ms, por módulo.
  function createSession(config) {
    return {
      mode: config.mode, // "practice" | "simulation" | "review" | "express"
      moduleFilter: config.moduleFilter || null, // null = mezcla de módulos
      moduleTimers: config.moduleTimers || {},
      durationMinutes: config.durationMinutes || null, // solo exprés
      areaFilter: config.areaFilter || null, // solo exprés
      totalTimeLimitMs: config.totalTimeLimitMs || null, // opcional; lo usa exprés
      questions: config.questions.slice(),
      currentIndex: 0,
      answers: [],
      startedAt: null,
      endedAt: null,
      currentQuestionStartedAt: null,
    };
  }

  function start(session) {
    session.startedAt = Date.now();
    session.currentQuestionStartedAt = session.startedAt;
    return session;
  }

  function getCurrentQuestion(session) {
    return session.questions[session.currentIndex] || null;
  }

  function getElapsedForCurrentQuestionMs(session, now) {
    if (session.currentQuestionStartedAt == null) return 0;
    return (now || Date.now()) - session.currentQuestionStartedAt;
  }

  function getTotalElapsedMs(session, now) {
    if (session.startedAt == null) return 0;
    return (now || Date.now()) - session.startedAt;
  }

  function getRemainingTotalMs(session, now) {
    if (session.totalTimeLimitMs == null) return null;
    return Math.max(0, session.totalTimeLimitMs - getTotalElapsedMs(session, now));
  }

  // Registra la respuesta a la pregunta actual. No decide si la sesión terminó ni
  // cuál es la siguiente pregunta: eso lo maneja el modo, que puede necesitar
  // rebarajar el banco (exprés) o cerrar la sesión.
  function submitAnswer(session, selectedOption) {
    const question = getCurrentQuestion(session);
    if (!question) throw new Error("SESP.engine: no hay pregunta actual para responder.");

    const now = Date.now();
    const timeMs = now - session.currentQuestionStartedAt;
    const isScored = question.kind === "single-select";
    const targetMs = session.moduleTimers[question.module] != null ? session.moduleTimers[question.module] : null;

    // Si la pregunta aún no tiene clave (correctOption null), no se califica:
    // se registra tiempo y respuesta, pero correct queda null (igual que CE).
    const scorable = isScored && question.correctOption != null;
    const answer = {
      questionId: question.id,
      module: question.module,
      competencia: question.competencia || null,
      kind: question.kind,
      selectedOption: selectedOption,
      correct: scorable ? selectedOption === question.correctOption : null,
      timeMs: timeMs,
      targetMs: targetMs,
      answeredAt: new Date(now).toISOString(),
    };

    session.answers.push(answer);
    return answer;
  }

  // Avanza a la siguiente pregunta de la cola ya armada por el modo. Si el modo
  // necesita agregar más preguntas (exprés al agotar el banco filtrado), debe
  // hacerlo sobre session.questions antes de llamar a advance().
  function advance(session) {
    session.currentIndex += 1;
    session.currentQuestionStartedAt = Date.now();
    return getCurrentQuestion(session);
  }

  function hasMoreQuestions(session) {
    return session.currentIndex < session.questions.length - 1;
  }

  function isTimeUp(session, now) {
    return session.totalTimeLimitMs != null && getRemainingTotalMs(session, now) <= 0;
  }

  function finish(session) {
    session.endedAt = Date.now();
    return session;
  }

  // --- Utilidades compartidas por modes/*.js (evita repetirlas en cada modo) ---

  function shuffle(list) {
    const result = list.slice();
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  // Lee window.SESP.data.modules y arma { RC: ms, LC: ms, ... } para los módulos de
  // opción múltiple (CE no tiene targetSeconds: usa su propio esquema de ensayo).
  function buildModuleTimers() {
    const modules = (window.SESP.data && window.SESP.data.modules) || [];
    const timers = {};
    modules.forEach((m) => {
      if (m.targetSeconds != null) timers[m.id] = m.targetSeconds * 1000;
    });
    return timers;
  }

  // El id de cada pregunta empieza con el código de módulo (p. ej. "CC-2018-Q01"),
  // así que no hace falta buscar en los 5 bancos: se va directo al correcto.
  function findQuestionById(id) {
    const moduleId = id.split("-")[0];
    const pool = window.SESP.data.questions[moduleId] || [];
    return pool.find((q) => q.id === id) || null;
  }

  // --- Sesión de ensayo (CE): dos fases con su propio cronómetro, sin lista de preguntas ---

  // config: { mode, topic, planningMs, writingMs }
  function createEssaySession(config) {
    return {
      mode: config.mode,
      kind: "essay",
      topic: config.topic, // objeto de window.SESP.data.questions.CE
      phase: "planning", // "planning" | "writing" | "done"
      planningMsAllotted: config.planningMs,
      writingMsAllotted: config.writingMs,
      startedAt: null,
      phaseStartedAt: null,
      planningMsUsed: null,
      writingMsUsed: null,
      text: "",
      endedAt: null,
    };
  }

  function startEssay(session) {
    session.startedAt = Date.now();
    session.phaseStartedAt = session.startedAt;
    return session;
  }

  function getEssayPhaseElapsedMs(session, now) {
    if (session.phaseStartedAt == null) return 0;
    return (now || Date.now()) - session.phaseStartedAt;
  }

  function getEssayPhaseRemainingMs(session, now) {
    const allotted = session.phase === "writing" ? session.writingMsAllotted : session.planningMsAllotted;
    return Math.max(0, allotted - getEssayPhaseElapsedMs(session, now));
  }

  function isEssayPhaseTimeUp(session, now) {
    return session.phase !== "done" && getEssayPhaseRemainingMs(session, now) <= 0;
  }

  function setEssayText(session, text) {
    session.text = text;
    return session;
  }

  // Pasa de planeación a escritura (o de escritura a terminado), registrando el
  // tiempo realmente usado en la fase que cierra.
  function advanceEssayPhase(session) {
    const now = Date.now();
    if (session.phase === "planning") {
      session.planningMsUsed = now - session.phaseStartedAt;
      session.phase = "writing";
      session.phaseStartedAt = now;
    } else if (session.phase === "writing") {
      session.writingMsUsed = now - session.phaseStartedAt;
      session.phase = "done";
    }
    return session;
  }

  function finishEssay(session) {
    const now = Date.now();
    if (session.phase === "writing" && session.writingMsUsed == null) {
      session.writingMsUsed = now - session.phaseStartedAt;
    }
    session.phase = "done";
    session.endedAt = now;
    return session;
  }

  function countWords(text) {
    return text ? text.trim().split(/\s+/).filter(Boolean).length : 0;
  }

  // Convierte la sesión de ensayo al formato plano que esperan core/stats.js y
  // core/storage.js (mismo "shape" que una sesión normal, pero con `essay` en vez de `answers`).
  function essaySessionToRecord(session) {
    return {
      mode: session.mode,
      module: "CE",
      kind: "essay",
      startedAt: session.startedAt,
      endedAt: session.endedAt,
      essay: {
        title: session.topic ? session.topic.title : null,
        planningMsAllotted: session.planningMsAllotted,
        writingMsAllotted: session.writingMsAllotted,
        planningMsUsed: session.planningMsUsed,
        writingMsUsed: session.writingMsUsed,
        wordCount: countWords(session.text),
        rubric: session.topic ? session.topic.rubric : null,
      },
    };
  }

  return {
    createSession,
    start,
    getCurrentQuestion,
    getElapsedForCurrentQuestionMs,
    getTotalElapsedMs,
    getRemainingTotalMs,
    submitAnswer,
    advance,
    hasMoreQuestions,
    isTimeUp,
    finish,
    shuffle,
    buildModuleTimers,
    findQuestionById,
    createEssaySession,
    startEssay,
    getEssayPhaseElapsedMs,
    getEssayPhaseRemainingMs,
    isEssayPhaseTimeUp,
    setEssayText,
    advanceEssayPhase,
    finishEssay,
    essaySessionToRecord,
  };
})();
