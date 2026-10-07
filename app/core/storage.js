// Persistencia de historial de sesiones y cola de repaso en localStorage.
// No conoce el DOM ni las preguntas: solo guarda y lee lo que le pasan engine.js/modes/*.js.
window.SESP = window.SESP || {};
window.SESP.core = window.SESP.core || {};

window.SESP.core.storage = (function () {
  const SESSIONS_KEY = "sesp.sessions.v1";
  const REVIEW_KEY = "sesp.review.v1";
  const SESSION_KEY = "sesp.session.v1";
  const REMEMBER_KEY = "sesp_user";
  const GAME_KEY = "sesp.game.v1";
  const PREFS_KEY = "sesp.prefs.v1";
  const PROFILE_KEY = "sesp.profile.v1";

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
      game: getGame(),
      prefs: getPrefs(),
      profile: getProfile(),
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

    // Gamificación: quedarse con el de mayor XP para no perder progreso.
    if (data.game && typeof data.game === "object") {
      const current = getGame();
      if ((data.game.xp || 0) > (current.xp || 0)) saveGame(Object.assign(defaultGame(), data.game));
    }

    if (data.prefs && typeof data.prefs === "object") savePrefs(data.prefs);

    if (data.profile && typeof data.profile === "object" && data.profile.name) setProfile(data.profile);

    return { sessionsCount: mergedSessions.length, reviewCount: Object.keys(existingReview).length };
  }

  // ---------- auth local (login solo front, sin servidor) ----------
  // La sesión actual vive en localStorage para que al recargar siga logueado.
  // El progreso (sesiones/repaso) NO se borra al cerrar sesión: es por navegador.
  function getCurrentUser() {
    return readJSON(SESSION_KEY, null);
  }

  function setCurrentUser(userObj) {
    writeJSON(SESSION_KEY, userObj);
    return userObj;
  }

  function clearCurrentUser() {
    try { localStorage.removeItem(SESSION_KEY); } catch (err) { /* noop */ }
  }

  function getRememberedUser() {
    try { return localStorage.getItem(REMEMBER_KEY) || ""; } catch (err) { return ""; }
  }

  function setRememberedUser(username) {
    try {
      if (username) localStorage.setItem(REMEMBER_KEY, username);
      else localStorage.removeItem(REMEMBER_KEY);
    } catch (err) { /* noop */ }
  }

  // ---------- gamificación local (XP, racha, avatar) ----------
  function defaultGame() {
    return { xp: 0, streak: 0, lastLoginDate: null, avatar: "🧪", logins: 0 };
  }

  function getGame() {
    const g = readJSON(GAME_KEY, null);
    if (!g || typeof g !== "object") return defaultGame();
    return Object.assign(defaultGame(), g);
  }

  function saveGame(game) {
    writeJSON(GAME_KEY, game);
    return game;
  }

  function levelForXp(xp) {
    return Math.floor((xp || 0) / 100) + 1;
  }

  function setAvatar(emoji) {
    const g = getGame();
    g.avatar = emoji;
    return saveGame(g);
  }

  function todayStr(d) {
    const d2 = d || new Date();
    return d2.toISOString().slice(0, 10);
  }

  // Premio por entrar: +25 XP base, +5 por día de racha (tope +50).
  // Re-entrar el mismo día solo da +5 y no rompe la racha.
  function awardLogin() {
    const g = getGame();
    const today = todayStr();
    const yesterday = todayStr(new Date(Date.now() - 86400000));
    const beforeLevel = levelForXp(g.xp);
    let gained = 0;
    if (g.lastLoginDate === today) {
      gained = 5;
    } else if (g.lastLoginDate === yesterday) {
      g.streak += 1;
      gained = 25 + Math.min(g.streak * 5, 50);
    } else {
      g.streak = 1;
      gained = 25;
    }
    g.xp += gained;
    g.logins += 1;
    g.lastLoginDate = today;
    saveGame(g);
    const afterLevel = levelForXp(g.xp);
    return { game: g, gained, leveledUp: afterLevel > beforeLevel, level: afterLevel };
  }

  // ---------- preferencias de accesibilidad y tema ----------
  // theme: "dark" | "light" · fontScale: 1 | 1.125 | 1.25 · highContrast: bool
  function defaultPrefs() {
    return { theme: "dark", fontScale: 1, highContrast: false };
  }

  function getPrefs() {
    const p = readJSON(PREFS_KEY, null);
    if (!p || typeof p !== "object") return defaultPrefs();
    const d = defaultPrefs();
    return {
      theme: p.theme === "light" ? "light" : "dark",
      fontScale: [1, 1.125, 1.25].indexOf(p.fontScale) >= 0 ? p.fontScale : 1,
      highContrast: !!p.highContrast,
    };
  }

  function savePrefs(prefs) {
    const merged = Object.assign(defaultPrefs(), prefs || {});
    writeJSON(PREFS_KEY, merged);
    return merged;
  }

  // ---------- perfil del jugador (sin contraseña) ----------
  // El perfil es lo que permite guardar el progreso: nombre + avatar elegidos una
  // vez. Vive aparte de la sesión activa para poder retomarla tras cerrar sesión.
  function getProfile() {
    const p = readJSON(PROFILE_KEY, null);
    if (!p || typeof p !== "object" || !p.name) return null;
    return p;
  }

  function setProfile(profile) {
    writeJSON(PROFILE_KEY, profile);
    return profile;
  }

  function clearProfile() {
    try { localStorage.removeItem(PROFILE_KEY); } catch (err) { /* noop */ }
  }

  return {
    getSessions,
    recordSession,
    getReviewState,
    getDueReviewQuestionIds,
    clearAll,
    exportData,
    importData,
    getPrefs,
    savePrefs,
    getProfile,
    setProfile,
    clearProfile,
    getCurrentUser,
    setCurrentUser,
    clearCurrentUser,
    getRememberedUser,
    setRememberedUser,
    getGame,
    saveGame,
    setAvatar,
    levelForXp,
    awardLogin,
  };
})();
