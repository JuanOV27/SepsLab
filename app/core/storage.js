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

  // Repetición espaciada por cajas (Leitner). Cada pregunta sube de caja mientras se
  // responde bien y dentro del tiempo objetivo; cada error la devuelve a la primera.
  // Una pregunta consolidada solo vuelve a la cola cuando le toca por fecha:
  //
  //   caja 0 → 1 día    caja 1 → 3 días    caja 2 → 7 días    caja 3 → 16 días
  //   caja 4 → consolidada: se repasa cada 30 días
  //
  // Antes el criterio era binario ("2 aciertos seguidos y sale de la cola"), lo que
  // mezclaba una pregunta ya dominada con las nuevas sin distinguirlas.
  const REVIEW_BOX_DAYS = [1, 3, 7, 16, 30];
  const REVIEW_MASTER_BOX = REVIEW_BOX_DAYS.length - 1;

  function reviewIntervalDays(box) {
    return REVIEW_BOX_DAYS[Math.max(0, Math.min(REVIEW_MASTER_BOX, box || 0))];
  }

  function applyAnswerToReviewState(reviewState, answer) {
    const entry = reviewState[answer.questionId] || {
      questionId: answer.questionId,
      module: answer.module,
      wrongCount: 0,
      fastCorrectStreak: 0,
      box: 0,
      dueForReview: false,
      nextDueAt: null,
      lastSeenAt: null,
    };

    // Datos guardados con la versión anterior: se llevan a la caja 0 sin perder nada.
    if (entry.box == null) entry.box = 0;

    const isFast = answer.targetMs == null || answer.timeMs <= answer.targetMs;

    if (!answer.correct) {
      entry.wrongCount += 1;
      entry.fastCorrectStreak = 0;
      entry.box = 0;
    } else if (!isFast) {
      // Acierto pero lento: no consolida, se queda donde estaba para repetirla.
      entry.fastCorrectStreak = 0;
    } else {
      entry.fastCorrectStreak += 1;
      entry.box = Math.min(REVIEW_MASTER_BOX, (entry.box || 0) + 1);
    }

    entry.lastSeenAt = answer.answeredAt;
    entry.nextDueAt = new Date(Date.now() + reviewIntervalDays(entry.box) * 86400000).toISOString();
    // Solo entra a la cola inmediata cuando está en caja baja: las mastered
    // vuelven por calendario, que es justo el efecto que se busca.
    entry.dueForReview = entry.box < 2;
    reviewState[answer.questionId] = entry;
    return reviewState;
  }

  // Guarda una sesión terminada y actualiza la cola de repaso a partir de sus respuestas.
  function recordSession(session) {
    const sessions = getSessions();
    // Red de seguridad: si la misma sesión llega dos veces (un doble toque al
    // terminar, o dos caminos de código que cierran), se ignora la segunda. La
    // interfaz ya tiene su propia guarda; esto protege los datos aunque alguien
    // añada otra vía de cierre sin acordarse de ella.
    if (session && session.startedAt && sessions.some((s) => s && s.startedAt === session.startedAt)) {
      return session;
    }
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
    const now = Date.now();
    return Object.values(reviewState)
      .filter((entry) => {
        if (moduleFilter && entry.module !== moduleFilter) return false;
        if (entry.dueForReview) return true;
        // Las preguntas de caja alta no están en la cola inmediata, pero vuelven
        // cuando vence su intervalo. Sin este filtro nunca se volverían a ver.
        if (!entry.nextDueAt) return false;
        return new Date(entry.nextDueAt).getTime() <= now;
      })
      .sort((a, b) => (b.wrongCount || 0) - (a.wrongCount || 0)
        || String(a.nextDueAt || "9999").localeCompare(String(b.nextDueAt || "9999"))
        || String(a.lastSeenAt).localeCompare(String(b.lastSeenAt)))
      .map((entry) => entry.questionId);
  }

  // Resumen de las cajas, para mostrar en la pantalla de Progreso.
  function getReviewBoxSummary() {
    const reviewState = getReviewState();
    const summary = { total: 0, byBox: [0, 0, 0, 0, 0], dueNow: 0 };
    const now = Date.now();
    Object.values(reviewState).forEach((entry) => {
      summary.total += 1;
      const box = Math.max(0, Math.min(REVIEW_MASTER_BOX, entry.box || 0));
      summary.byBox[box] += 1;
      const due = entry.dueForReview || (entry.nextDueAt && new Date(entry.nextDueAt).getTime() <= now);
      if (due) summary.dueNow += 1;
    });
    return summary;
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

  // Día en formato YYYY-MM-DD **en hora local**. Con toISOString() el día cambiaba
  // a las 19:00 en Colombia (UTC-5): quien estudiaba de noche y al día siguiente
  // temprano a la mañana contaba como el mismo día y su racha no avanzaba.
  function todayStr(d) {
    const x = d || new Date();
    return x.getFullYear() + "-" + String(x.getMonth() + 1).padStart(2, "0") + "-" + String(x.getDate()).padStart(2, "0");
  }

  // Premio por entrar: +25 XP base, +5 por día de racha (tope +50).
  // Entrar dos veces el mismo día no da nada: si no, cerrar y volver a iniciar
  // sesión era una forma de farmear XP ilimitada.
  function awardLogin() {
    const g = getGame();
    const today = todayStr();
    const yesterday = todayStr(new Date(Date.now() - 86400000));
    const beforeLevel = levelForXp(g.xp);
    let gained = 0;
    if (g.lastLoginDate === today) {
      gained = 0;
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
    return { game: g, gained, leveledUp: afterLevel > beforeLevel, level: afterLevel, alreadyToday: gained === 0 };
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
    getReviewBoxSummary,
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
