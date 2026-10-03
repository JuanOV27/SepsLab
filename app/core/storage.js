// Persistencia de historial de sesiones y cola de repaso en localStorage.
// No conoce el DOM ni las preguntas: solo guarda y lee lo que le pasan engine.js/modes/*.js.
window.SESP = window.SESP || {};
window.SESP.core = window.SESP.core || {};

window.SESP.core.storage = (function () {
  const SESSIONS_KEY = "sesp.sessions.v1";
  const REVIEW_KEY = "sesp.review.v1";

  function readJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      return parsed == null ? fallback : parsed;
    } catch (err) {
      console.warn(`SESP.storage: no se pudo leer "${key}", se usa el valor por defecto.`, err);
      return fallback;
    }
  }

  function writeJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.warn(`SESP.storage: no se pudo guardar "${key}".`, err);
    }
  }

  function getSessions() {
    return readJSON(SESSIONS_KEY, []);
  }

  function getReviewState() {
    return readJSON(REVIEW_KEY, {});
  }

  // Repetición espaciada simple: una pregunta queda "pendiente de repaso" en cuanto
  // se falla o se responde más lento que el objetivo del módulo, y sale de la cola
  // tras 2 aciertos consecutivos dentro del tiempo objetivo.
  function applyAnswerToReviewState(reviewState, answer) {
    const entry = reviewState[answer.questionId] || {
      questionId: answer.questionId,
      module: answer.module,
      wrongCount: 0,
      fastCorrectStreak: 0,
      dueForReview: false,
      lastSeenAt: null,
    };

    const isFast = answer.targetMs == null || answer.timeMs <= answer.targetMs;

    if (!answer.correct) {
      entry.wrongCount += 1;
      entry.fastCorrectStreak = 0;
      entry.dueForReview = true;
    } else if (!isFast) {
      entry.fastCorrectStreak = 0;
      entry.dueForReview = true;
    } else {
      entry.fastCorrectStreak += 1;
      if (entry.fastCorrectStreak >= 2) entry.dueForReview = false;
    }

    entry.lastSeenAt = answer.answeredAt;
    reviewState[answer.questionId] = entry;
    return reviewState;
  }

  // Guarda una sesión terminada y actualiza la cola de repaso a partir de sus respuestas.
  function recordSession(session) {
    const sessions = getSessions();
    sessions.push(session);
    writeJSON(SESSIONS_KEY, sessions);

    if (Array.isArray(session.answers)) {
      const reviewState = getReviewState();
      session.answers.forEach((answer) => {
        if (answer.correct == null) return; // CE u otros tipos sin corrección automática
        applyAnswerToReviewState(reviewState, answer);
      });
      writeJSON(REVIEW_KEY, reviewState);
    }

    return session;
  }

  function getDueReviewQuestionIds(moduleFilter) {
    const reviewState = getReviewState();
    return Object.values(reviewState)
      .filter((entry) => entry.dueForReview && (!moduleFilter || entry.module === moduleFilter))
      .sort((a, b) => b.wrongCount - a.wrongCount || String(a.lastSeenAt).localeCompare(String(b.lastSeenAt)))
      .map((entry) => entry.questionId);
  }

  function clearAll() {
    localStorage.removeItem(SESSIONS_KEY);
    localStorage.removeItem(REVIEW_KEY);
  }

  // Para respaldo manual (botón "Exportar" en la UI): todo lo que hay en
  // localStorage, en un objeto plano serializable a JSON.
  function exportData() {
    return {
      app: "SESP",
      version: 1,
      exportedAt: new Date().toISOString(),
      sessions: getSessions(),
      reviewState: getReviewState(),
    };
  }

  // Combina (no reemplaza) lo importado con lo que ya hay en este navegador,
  // para que restaurar un respaldo nunca borre progreso hecho después de exportarlo.
  // Sesiones: se deduplican por startedAt (único por sesión).
  // Cola de repaso: por pregunta, se queda la entrada con lastSeenAt más reciente.
  function importData(data) {
    if (!data || typeof data !== "object" || !Array.isArray(data.sessions) || typeof data.reviewState !== "object" || data.reviewState === null) {
      throw new Error("El archivo no tiene el formato esperado de un respaldo de SESP.");
    }

    const existingSessions = getSessions();
    const seenStartedAt = new Set(existingSessions.map((s) => s.startedAt));
    const mergedSessions = existingSessions.slice();
    data.sessions.forEach((s) => {
      if (s && !seenStartedAt.has(s.startedAt)) {
        mergedSessions.push(s);
        seenStartedAt.add(s.startedAt);
      }
    });
    writeJSON(SESSIONS_KEY, mergedSessions);

    const existingReview = getReviewState();
    Object.keys(data.reviewState).forEach((questionId) => {
      const incoming = data.reviewState[questionId];
      const current = existingReview[questionId];
      if (!current || String(incoming.lastSeenAt) > String(current.lastSeenAt)) {
        existingReview[questionId] = incoming;
      }
    });
    writeJSON(REVIEW_KEY, existingReview);

    return { sessionsCount: mergedSessions.length, reviewCount: Object.keys(existingReview).length };
  }

  return {
    getSessions,
    recordSession,
    getReviewState,
    getDueReviewQuestionIds,
    clearAll,
    exportData,
    importData,
  };
})();
