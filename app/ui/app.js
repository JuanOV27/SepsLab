// Render de pantallas: inicio, configuración de modo, pregunta, ensayo, resultados.
// Une core/*.js y modes/*.js con el DOM. No hay build ni fetch: todo llega por <script>.
window.SESP = window.SESP || {};

window.SESP.ui = (function () {
  const engine = window.SESP.core.engine;
  const storage = window.SESP.core.storage;
  const statsApi = window.SESP.core.stats;
  const modesApi = window.SESP.modes;
  const modules = window.SESP.data.modules;

  let root = null;
  let tickHandle = null;
  // El login es opcional: se entra directo a la práctica y la cuenta solo se pide
// si alguien la quiere, para tener avatar, XP y racha guardados en el navegador.
let state = { screen: "home" };
  let modalEl = null;
  let pendingConfirmCallback = null;
  let pendingAvatar = null;
  let pendingReward = null;
  let answerStreak = 0;
  let toastTimer = null;

  const AVATARS = ["🧪", "🚀", "🧠", "⚡", "🎯", "👾"];
  const DAILY_TIPS = [
    "Lea la pregunta completa antes de revisar las opciones de respuesta.",
    "Descarte primero la opción evidentemente incorrecta.",
    "Si supera los 100 segundos, marque la pregunta y retómela después.",
    "En Lectura Crítica, identifique la idea principal de cada párrafo.",
    "En Razonamiento Cuantitativo, estime el orden de magnitud antes de calcular.",
    "La gestión del tiempo también se entrena: observe el cronómetro visible.",
    "El repaso de errores concentra el mayor valor formativo."
  ];

  function dailyTip() {
    return DAILY_TIPS[new Date().getDate() % DAILY_TIPS.length];
  }

  function moduleMeta(id) {
    return modules.find((m) => m.id === id);
  }

  // Modal propio en vez de alert()/confirm(): en algunos navegadores (sandboxed,
  // Electron embebido, etc.) los diálogos nativos se bloquean de forma poco fiable.
  function showModal(innerHtml) {
    closeModal();
    modalEl = document.createElement("div");
    modalEl.className = "modal-overlay";
    modalEl.innerHTML = `<div class="modal-box">${innerHtml}</div>`;
    modalEl.addEventListener("click", (e) => {
      if (e.target === modalEl) { closeModal(); return; }
      const actionEl = e.target.closest("[data-modal-action]");
      if (!actionEl) return;
      const a = actionEl.dataset.modalAction;
      if (a === "close" || a === "cancel") closeModal();
      else if (a === "confirm") {
        const cb = pendingConfirmCallback;
        closeModal();
        if (cb) cb();
      }
    });
    document.body.appendChild(modalEl);
  }

  function closeModal() {
    if (modalEl) { modalEl.remove(); modalEl = null; }
    pendingConfirmCallback = null;
  }

  function showMessage(message) {
    showModal(`<p>${escapeHtml(message)}</p><button class="btn btn-block" data-modal-action="close">Entendido</button>`);
  }

  function showConfirm(message, onConfirm) {
    // showModal() limpia el modal anterior (y su callback) antes de crear el nuevo;
    // por eso el callback se asigna DESPUÉS de llamar a showModal(), no antes.
    showModal(`
      <p>${escapeHtml(message)}</p>
      <div class="row">
        <button class="btn btn-secondary" data-modal-action="cancel">Cancelar</button>
        <button class="btn" data-modal-action="confirm">Confirmar</button>
      </div>
    `);
    pendingConfirmCallback = onConfirm;
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => (
      { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
    ));
  }

  function fmtMs(ms) {
    if (ms == null || Number.isNaN(ms)) return "--:--";
    const totalSeconds = Math.max(0, Math.round(ms / 1000));
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  }

  function fmtPercent(x) {
    return x == null ? "—" : `${Math.round(x * 100)}%`;
  }

  // Para cuentas regresivas: redondear (fmtMs) puede mostrar "0:00" hasta un
  // segundo antes de que el tiempo realmente se agote. ceil evita ese falso cero.
  function fmtCountdown(ms) {
    if (ms == null || Number.isNaN(ms)) return "--:--";
    const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  }

  // ---------- preferencias: tema, tamaño de texto y contraste ----------
  function getPrefs() {
    try { return storage.getPrefs(); } catch (err) { return { theme: "dark", fontScale: 1, highContrast: false }; }
  }

  function applyPrefs() {
    const p = getPrefs();
    try {
      document.documentElement.dataset.theme = p.theme;
      document.documentElement.dataset.contrast = p.highContrast ? "high" : "normal";
      document.documentElement.style.fontSize = (16 * p.fontScale) + "px";
    } catch (err) { /* noop */ }
    return p;
  }

  function fontLabel(scale) {
    return scale >= 1.25 ? "Texto: muy grande" : scale >= 1.125 ? "Texto: grande" : "Texto: normal";
  }

  function controlsHtml() {
    const p = getPrefs();
    const isLight = p.theme === "light";
    const themeSvg = isLight
      ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>`
      : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>`;
    return `
      <span class="a11y-controls" role="group" aria-label="Apariencia y accesibilidad">
        <button class="chip-btn" data-action="toggle-theme" title="${isLight ? "Cambiar a modo oscuro" : "Cambiar a modo claro"}" aria-label="${isLight ? "Cambiar a modo oscuro" : "Cambiar a modo claro"}">${themeSvg}</button>
        <button class="chip-btn" data-action="cycle-font" title="Tamaño de texto: ${fontLabel(p.fontScale).toLowerCase()}. Activar para cambiar." aria-label="Cambiar tamaño de texto. Actual: ${fontLabel(p.fontScale).toLowerCase()}"><svg viewBox="0 0 24 24" aria-hidden="true"><text x="12" y="17" text-anchor="middle" font-size="14" font-weight="800" fill="currentColor">A</text></svg></button>
        <button class="chip-btn${p.highContrast ? " is-on" : ""}" data-action="toggle-contrast" title="Alto contraste: ${p.highContrast ? "activado" : "desactivado"}" aria-label="Alternar alto contraste" aria-pressed="${p.highContrast}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor" stroke="none"/></svg></button>
      </span>
    `;
  }

  // Micro-celebración sobria de rachas, sin confeti: toast inferior que se disipa solo.
  function showStreakToast(streak) {
    try {
      let msg = null;
      if (streak === 3) msg = "Racha de 3 aciertos seguidos. Vas bien.";
      else if (streak === 5) msg = "¡5 seguidas! Ritmo de examen real.";
      else if (streak === 8) msg = "¡8 seguidas! Nivel avanzado.";
      else if (streak > 8 && streak % 5 === 0) msg = "¡" + streak + " seguidas! Imparable.";
      if (!msg) return;
      let toast = document.getElementById("streak-toast");
      if (!toast) {
        toast = document.createElement("div");
        toast.id = "streak-toast";
        toast.setAttribute("role", "status");
        document.body.appendChild(toast);
      }
      toast.innerHTML = `<span class="streak-star" aria-hidden="true">★</span> ${escapeHtml(msg)}`;
      toast.classList.remove("show");
      void toast.offsetWidth;
      toast.classList.add("show");
      if (toastTimer) clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toast.classList.remove("show"), 2300);
    } catch (err) { /* noop */ }
  }

  // ---------- ciclo de render ----------

let spotTimer = null;
  let spotIndex = 0;

  function stopSpotlight() {
    if (spotTimer) { clearInterval(spotTimer); spotTimer = null; }
  }

  function goSpot(i) {
    spotIndex = ((i % 3) + 3) % 3;
    document.querySelectorAll(".spot-slide").forEach((s) => s.classList.toggle("is-active", Number(s.dataset.slide) === spotIndex));
    document.querySelectorAll(".spot-dot").forEach((d) => d.classList.toggle("is-active", Number(d.dataset.slide) === spotIndex));
    const fill = document.getElementById("spot-progress-fill");
    if (fill) { fill.style.animation = "none"; void fill.offsetWidth; fill.style.animation = ""; }
  }

  function startSpotlight() {
    // Sin uso en el login minimal: se conserva por compatibilidad.
    stopSpotlight();
  }

  // Consejo destacado del login: tarjeta con rotación automática.
  let tipTimer = null;
  let tipIndex = 0;

  function stopLoginTip() {
    if (tipTimer) { clearInterval(tipTimer); tipTimer = null; }
  }

  function paintTip(dir) {
    const textEl = document.getElementById("login-tip-text");
    if (!textEl) return;
    textEl.textContent = DAILY_TIPS[tipIndex];
    textEl.classList.remove("tip-slide-left", "tip-slide-right");
    void textEl.offsetWidth;
    textEl.classList.add(dir < 0 ? "tip-slide-left" : "tip-slide-right");
  }

  function startLoginTip(keepIndex) {
    stopLoginTip();
    const textEl = document.getElementById("login-tip-text");
    if (!textEl) return;
    if (!keepIndex) {
      tipIndex = new Date().getDate() % DAILY_TIPS.length;
      paintTip(1);
    }
    tipTimer = setInterval(() => {
      if (state.screen !== "login") { stopLoginTip(); return; }
      const box = document.getElementById("login-tip");
      if (!box) return;
      if (box.matches(":hover")) return; // pausa al pasar el cursor
      tipIndex = (tipIndex + 1) % DAILY_TIPS.length;
      paintTip(1);
    }, 6000);
  }

  // Volver arriba no en cada render(), sino solo cuando cambia la pantalla o la
  // pregunta: render() también se dispara al responder (para pintar el feedback) y
  // en ese caso saltaría al passage mientras se está leyendo la explicación.
  let lastRenderKey = null;

  function currentRenderKey() {
    const s = state.session;
    // La sesión de ensayo (CE) no tiene cola de preguntas: getCurrentQuestion
    // explotaría con ella, así que aquí no se pregunta.
    const q = s && s.questions ? engine.getCurrentQuestion(s) : null;
    return `${state.screen}|${state.modeId}|${q ? q.id : "-"}`;
  }

  function render() {
    stopTick();
    stopSpotlight();
    stopLoginTip();
    if (!root) return;
const key = currentRenderKey();
    const changed = key !== lastRenderKey;
    lastRenderKey = key;
    // El login es opcional: la práctica se abre directo, como antes. Quien quiera
    // la cuenta (avatar, XP y racha) la pide desde el inicio, y entonces sí se
    // guarda en el navegador.
    if (state.screen === "login") { root.innerHTML = renderLogin(); startLoginTip(); }
    else if (state.screen === "home") root.innerHTML = renderHome();
    else if (state.screen === "modeConfig") root.innerHTML = renderModeConfig();
    else if (state.screen === "question") { root.innerHTML = renderQuestion(); startTick(); }
    else if (state.screen === "essay") { root.innerHTML = renderEssay(); startTick(); }
    else if (state.screen === "results") root.innerHTML = renderResults();
    else if (state.screen === "essayResults") root.innerHTML = renderEssayResults();
    else if (state.screen === "timeUp") root.innerHTML = renderTimeUp();
    else if (state.screen === "progress") root.innerHTML = renderProgress();
    else root.innerHTML = renderHome();
    // En el teléfono es obligatorio: se lee un pasaje largo con el pulgar y al
    // pasar a la pregunta siguiente el texto nuevo saldría a media pantalla.
    if (changed) window.scrollTo(0, 0);
  }

  function startTick() {
    tickHandle = setInterval(tick, 500);
  }

  function stopTick() {
    if (tickHandle) { clearInterval(tickHandle); tickHandle = null; }
  }

  // Los ticks solo parchan los nodos del cronómetro (no hacen render() completo)
  // para no perder el foco/cursor del textarea de CE mientras el usuario escribe.
  function tick() {
    if (state.screen === "question") {
      updateQuestionTimers();
      // Corte inmediato en Exprés/Simulacro: si se acaba el tiempo mientras la
      // pregunta actual sigue sin responder, no se deja contestarla ni avanzar
      // más — se corta ahí mismo y se muestra la pantalla de cierre.
      if (!state.answered && (state.modeId === "express" || state.modeId === "simulation")) {
        const over = state.modeId === "express" ? modesApi.express.isSessionOver(state.session) : modesApi.simulation.isSessionOver(state.session);
        if (over) {
          state.screen = "timeUp";
          render();
        }
      }
    } else if (state.screen === "essay") {
      updateEssayTimer();
      if (engine.isEssayPhaseTimeUp(state.session)) {
        if (state.session.phase === "planning") {
          engine.advanceEssayPhase(state.session);
          render();
        } else if (state.session.phase === "writing") {
          essayFinish();
        }
      }
    }
  }

  // Cuenta regresiva por pregunta (toque gamificado): muestra lo que QUEDA del
  // tiempo objetivo con una barra que se vacía; al agotarse cuenta el overtime.
  function updateQuestionTimers() {
    const session = state.session;
    const qTimerEl = document.getElementById("question-timer");
    if (qTimerEl) {
      const q = engine.getCurrentQuestion(session);
      const target = session.moduleTimers ? session.moduleTimers[q.module] : null;
      const elapsed = engine.getElapsedForCurrentQuestionMs(session);
      if (target == null) {
        qTimerEl.textContent = fmtMs(elapsed);
        qTimerEl.className = "timer-chip";
      } else {
        const remaining = target - elapsed;
        if (remaining > target * 0.3) {
          qTimerEl.textContent = "⏳ " + fmtCountdown(remaining);
          qTimerEl.className = "timer-chip fast";
        } else if (remaining > 0) {
          qTimerEl.textContent = "🔥 " + fmtCountdown(remaining) + " ¡date prisa!";
          qTimerEl.className = "timer-chip slow";
        } else {
          qTimerEl.textContent = "⏰ +" + fmtMs(-remaining) + " de más";
          qTimerEl.className = "timer-chip over";
        }
      }
      const fillEl = document.getElementById("countdown-fill");
      if (fillEl) {
        if (target == null) {
          fillEl.style.width = "100%";
          fillEl.className = "countdown-fill";
        } else {
          const pct = Math.max(0, Math.min(100, ((target - elapsed) / target) * 100));
          fillEl.style.width = pct + "%";
          fillEl.className = "countdown-fill " + (pct > 30 ? "fast" : pct > 0 ? "slow" : "over");
        }
      }
    }
    const totalTimerEl = document.getElementById("total-timer");
    if (totalTimerEl && session.totalTimeLimitMs != null) {
      const remaining = engine.getRemainingTotalMs(session);
      totalTimerEl.textContent = fmtCountdown(remaining);
      totalTimerEl.className = "timer-chip " + (remaining > 60000 ? "fast" : remaining > 0 ? "slow" : "over");
    }
  }

  function updateEssayTimer() {
    const timerEl = document.getElementById("essay-timer");
    if (!timerEl) return;
    const remaining = engine.getEssayPhaseRemainingMs(state.session);
    timerEl.textContent = fmtCountdown(remaining);
    timerEl.className = "timer-chip " + (remaining > 30000 ? "fast" : remaining > 0 ? "slow" : "over");
  }

  function updateWordCountBadge() {
    const badge = document.getElementById("word-count-badge");
    const textarea = document.getElementById("essay-textarea");
    if (badge && textarea) {
      const trimmed = textarea.value.trim();
      const count = trimmed ? trimmed.split(/\s+/).length : 0;
      badge.textContent = `(${count} palabra${count === 1 ? "" : "s"})`;
    }
  }

  // ---------- pantalla: login ----------

  function currentUser() {
    try { return storage.getCurrentUser(); } catch (err) { return null; }
  }

  function gameHudHtml(compact) {
    let g;
    try { g = storage.getGame(); } catch (err) { g = { xp: 0, streak: 0, avatar: "🧪", logins: 0 }; }
    const level = storage.levelForXp ? storage.levelForXp(g.xp) : Math.floor((g.xp || 0) / 100) + 1;
    const pct = ((g.xp || 0) % 100);
    const next = 100 - pct;
    return `
      <div class="game-hud${compact ? " compact" : ""}">
        <div class="avatar-badge" aria-hidden="true">${escapeHtml(pendingAvatar || g.avatar || "🧪")}</div>
        <div class="game-info">
          <div class="game-top"><span class="level-badge">Nivel ${level}</span><span class="streak" title="Días consecutivos de estudio">Constancia: ${g.streak || 0} día${(g.streak || 0) === 1 ? "" : "s"}</span></div>
          <div class="xp-bar" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100" title="${g.xp || 0} puntos acumulados"><div class="xp-fill" style="width:${pct}%"></div></div>
          <div class="xp-label">${pct}/100 puntos · ${next} para el Nivel ${level + 1} · Total: ${g.xp || 0}</div>
        </div>
      </div>
    `;
  }

  function renderLogin() {
    let remembered = "";
    try { remembered = storage.getRememberedUser() || ""; } catch (err) { remembered = ""; }
    try {
      const g = storage.getGame();
      if (!pendingAvatar) pendingAvatar = g.avatar || "🧪";
    } catch (err) { if (!pendingAvatar) pendingAvatar = "🧪"; }
    return `
      <div class="login-minimal academic">
        <div class="login-topbar anim-in" style="--d:0s">${controlsHtml()}</div>
        <header class="login-brand anim-in" style="--d:.05s">
          <img class="logo logo-animated" src="assets/images/logo.png" alt="Logotipo institucional de SepsLab" onerror="this.outerHTML='<div class=&quot;logo-fallback&quot; aria-hidden=&quot;true&quot;>SL</div>'">
          <p class="brand-kicker">Plataforma de preparación · Saber Pro</p>
          <h1>SepsLab</h1>
          <p class="muted">Práctica con cuadernillos oficiales del ICFES</p>
        </header>
        <main class="card login-card login-pro anim-in" style="--d:.15s" aria-label="Acceso a la plataforma">
          <h2 class="login-title">Iniciar sesión</h2>
          <div id="login-error-box" class="error-summary" role="alert"></div>
          <form id="login-form" novalidate>
            <div class="field">
              <label for="login-username">Usuario o correo electrónico</label>
              <div class="input-wrap"><svg class="input-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg><input type="text" id="login-username" autocomplete="username" inputmode="email" placeholder="usuario@correo.com" value="${escapeHtml(remembered)}"></div>
              <div class="field-error" id="login-uErr"></div>
            </div>
            <div class="field">
              <label for="login-password">Contraseña</label>
              <div class="input-group input-wrap"><svg class="input-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg><input type="password" id="login-password" autocomplete="current-password" placeholder="Ingrese su contraseña">
                <button type="button" class="icon-btn" data-action="toggle-password" aria-label="Mostrar contraseña" aria-pressed="false"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg></button>
              </div>
              <div class="caps-warn" id="capsWarn">Bloq Mayús activado — revise su contraseña.</div>
              <div class="field-error" id="login-pErr"></div>
            </div>
            <div class="row-between">
              <label class="check"><input type="checkbox" id="login-remember" ${remembered ? "checked" : ""}> Mantener la sesión iniciada</label>
              <button type="button" class="link-btn" data-action="login-forgot">¿Olvidó su contraseña?</button>
            </div>
            <button type="submit" class="btn btn-block btn-arrow" id="login-submit"><span class="label">Ingresar a la plataforma</span><span class="spinner" aria-hidden="true"></span></button>
          </form>
          <div class="divider"><span>o continúe sin una cuenta</span></div>
          <button type="button" class="btn btn-secondary btn-block" data-action="login-guest">Explorar como invitado</button>
          <ul class="trust-list" aria-label="Garantías del servicio">
            <li>Datos almacenados únicamente en este navegador</li>
            <li>Preguntas oficiales ICFES 2018 y simulacro 2026-2</li>
          </ul>
        </main>
        <footer class="login-footer anim-in" style="--d:.25s">
          <div class="tip-card" id="login-tip" aria-live="polite">
            <svg class="tip-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.3 1.1 2.2h5c0-.9.4-1.6 1.1-2.2A6 6 0 0 0 12 3z"/></svg>
            <div class="tip-body">
              <p class="tip-kicker">Consejo de estudio</p>
              <p class="tip-text" id="login-tip-text"></p>
            </div>
          </div>
          <p class="muted">© 2026 SepsLab · Uso académico y formativo</p>
        </footer>
      </div>
      <div id="reward-overlay" aria-live="polite"></div>
    `;
  }

  function loginFail(fieldErrId, msg, inputEl) {
    const el = document.getElementById(fieldErrId);
    if (el) el.textContent = msg;
    if (inputEl) inputEl.setAttribute("aria-invalid", "true");
  }

  function clearLoginError(inputEl, errId) {
    if (inputEl) inputEl.removeAttribute("aria-invalid");
    const el = document.getElementById(errId);
    if (el) el.textContent = "";
  }

  function doLogin() {
    const uEl = document.getElementById("login-username");
    const pEl = document.getElementById("login-password");
    const rEl = document.getElementById("login-remember");
    const box = document.getElementById("login-error-box");
    const btn = document.getElementById("login-submit");
    if (!uEl || !pEl) return;
    if (box) { box.classList.remove("show"); box.textContent = ""; }
    const uv = uEl.value.trim();
    const pv = pEl.value;
    let ok = true;
    clearLoginError(uEl, "login-uErr");
    clearLoginError(pEl, "login-pErr");
    if (!uv) { loginFail("login-uErr", "Ingrese su usuario o correo electrónico.", uEl); ok = false; }
    else if (uv.includes("@") && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(uv)) { loginFail("login-uErr", "El correo electrónico no es válido.", uEl); ok = false; }
    if (pv.length < 6) { loginFail("login-pErr", "La contraseña debe tener mínimo 6 caracteres.", pEl); ok = false; }
    if (!ok) {
      if (box) { box.textContent = "Revise los campos marcados."; box.classList.add("show"); }
      return;
    }
    if (btn) { btn.classList.add("loading"); btn.disabled = true; }
    // Auth local simulada: cualquier credencial válida entra. Sin servidor.
    setTimeout(() => {
      let reward = null;
      try {
        if (pendingAvatar) storage.setAvatar(pendingAvatar);
        reward = storage.awardLogin();
        if (reward && reward.game) reward.game.avatar = pendingAvatar || reward.game.avatar;
        storage.setCurrentUser({ user: uv, ts: new Date().toISOString(), guest: false, avatar: pendingAvatar });
        storage.setRememberedUser(rEl && rEl.checked ? uv : "");
      } catch (err) { /* noop */ }
      if (reward) showReward(reward);
      else { state = { screen: "home" }; render(); }
    }, 450);
  }

  function loginAsGuest() {
    let reward = null;
    try {
      if (pendingAvatar) storage.setAvatar(pendingAvatar);
      reward = storage.awardLogin();
      storage.setCurrentUser({ user: "invitado", ts: new Date().toISOString(), guest: true, avatar: pendingAvatar });
    } catch (err) { /* noop */ }
    if (reward && document.getElementById("reward-overlay")) showReward(reward);
    else { state = { screen: "home" }; render(); }
  }

  function logout() {
    try { storage.clearCurrentUser(); } catch (err) { /* noop */ }
    state = { screen: "login" };
    render();
  }

  function showReward(reward) {
    pendingReward = reward;
    const overlay = document.getElementById("reward-overlay");
    if (!overlay) {
      state = { screen: "home" };
      render();
      return;
    }
    const r = reward;
    overlay.innerHTML = `
      <div class="reward-card" role="dialog" aria-label="Constancia registrada">
        <div class="reward-avatar">${escapeHtml((r.game && r.game.avatar) || "🧪")}</div>
        <h3>Constancia registrada: +${r.gained} puntos</h3>
        <p class="muted">Días consecutivos de estudio: <strong>${r.game.streak}</strong>${r.leveledUp ? ` · Ha alcanzado el <strong>Nivel ${r.level}</strong>.` : ""}</p>
        <button class="btn btn-block" data-action="reward-continue">Continuar a la plataforma</button>
      </div>
    `;
    overlay.classList.add("show");
    // Enfoque académico: sin confeti, transición sobria.
    setTimeout(() => {
      if (pendingReward) { pendingReward = null; state = { screen: "home" }; render(); }
    }, 3200);
  }

  // ---------- pantalla: inicio ----------

  function renderHome() {
    const dueCount = storage.getDueReviewQuestionIds(null).length;
    const sessionsCount = storage.getSessions().length;
    const user = currentUser();
    const userLabel = user ? escapeHtml(user.user) : "invitado";
    const guestTag = user && user.guest ? ` <span class="muted">(invitado)</span>` : "";
    let homeGame = "";
    // La barra de nivel solo si hay sesión: los puntos y la racha se dan al
    // entrar, así que sin cuenta se quedaría siempre en cero y sería engañoso.
    try {
      const g = storage.getGame();
      const avatar = (user && user.avatar) || g.avatar || "🧪";
      pendingAvatar = avatar;
      if (user) {
        const level = storage.levelForXp(g.xp);
        const pct = ((g.xp || 0) % 100);
        homeGame = `
        <div class="card game-hud home-hud">
          <div class="avatar-badge">${escapeHtml(avatar)}</div>
          <div class="game-info">
            <div class="game-top"><span class="level-badge">Nivel ${level}</span><span class="streak">Constancia: ${g.streak || 0} días · ${g.xp || 0} puntos</span></div>
            <div class="xp-bar"><div class="xp-fill" style="width:${pct}%"></div></div>
          </div>
        </div>`;
      }
    } catch (err) { homeGame = ""; }
    return `
      <div class="top-actions home-bar" style="justify-content:space-between; align-items:center;">
        ${user
          ? `<span class="muted">Hola, <strong style="color:var(--text);">${userLabel}</strong>${guestTag}</span>`
          : `<span class="muted">Practica sin cuenta.</span>`}
        <span class="home-tools">${controlsHtml()}${user
          ? `<button class="link-btn" data-action="logout">Cerrar sesión</button>`
          : `<button class="link-btn" data-action="login">Iniciar sesión</button>`}</span>
      </div>
      ${homeGame}
      ${user ? "" : `<p class="muted" style="margin:-8px 0 12px;">Crear una cuenta guarda aquí tu avatar, tus puntos y tu racha de días. No hace falta para practicar.</p>`}
      <div class="home-brand">
        <img src="assets/images/logo.png" alt="Logo SepsLab" onerror="this.style.display='none'">
        <div><h1 style="margin:0;">SepsLab — Práctica Saber Pro</h1></div>
      </div>
      <p class="muted">Preguntas reales de cuadernillos oficiales ICFES 2018. Elige un modo para empezar.</p>
      <div class="guide-steps anim-in" style="--d:.08s" aria-label="Cómo funciona">
        <div class="guide-step is-now"><b>1</b><span>Elige un modo</span></div>
        <div class="guide-step"><b>2</b><span>Configura</span></div>
        <div class="guide-step"><b>3</b><span>Responde</span></div>
        <div class="guide-step"><b>4</b><span>Revisa y repasa</span></div>
      </div>
      <p class="guide-hello anim-in" style="--d:.1s">¿Qué entrenamos hoy? Toca una tarjeta para dar el primer paso.</p>
      ${dueCount > 0 ? `<button class="resume-banner anim-in" style="--d:.1s" data-action="go-config" data-mode="review"><span>🔁 Tienes <strong>${dueCount} pendiente${dueCount === 1 ? "" : "s"}</strong> de repaso — retoma donde quedaste →</span></button>` : ""}
      <div class="mode-grid">
        <button class="mode-card anim-in" style="--d:.15s" data-action="go-config" data-mode="practice">
          <span class="mode-ico" aria-hidden="true">📚</span><h3>Práctica libre</h3>
          <p class="muted">Un módulo (y competencia opcional), sin presión de tiempo.</p>
        </button>
        <button class="mode-card anim-in" style="--d:.22s" data-action="go-config" data-mode="simulation">
          <span class="mode-ico" aria-hidden="true">⏱️</span><h3>Simulacro</h3>
          <p class="muted">Un módulo completo al ritmo objetivo del examen, sin pausas.</p>
        </button>
        <button class="mode-card anim-in" style="--d:.29s" data-action="go-config" data-mode="review">
          <span class="mode-ico" aria-hidden="true">🔁</span><h3>Repaso ${dueCount > 0 ? `<span class="count-pill">${dueCount}</span>` : ""}</h3>
          <p class="muted">${dueCount} pregunta${dueCount === 1 ? "" : "s"} pendiente${dueCount === 1 ? "" : "s"} de repasar.</p>
        </button>
        <button class="mode-card anim-in" style="--d:.36s" data-action="go-config" data-mode="express">
          <span class="mode-ico" aria-hidden="true">⚡</span><h3>Modo Exprés</h3>
          <p class="muted">Sesión de duración fija: 15, 30 o 60 minutos.</p>
        </button>
        <button class="mode-card anim-in" style="--d:.4s" data-action="go-config" data-mode="training">
          <span class="mode-ico" aria-hidden="true">🎯</span><h3>Entrenamiento</h3>
          <p class="muted">${modesApi.training.countFor("Todas")} preguntas nuevas con explicación resuelta. No son del ICFES.</p>
        </button>
        <button class="mode-card anim-in" style="--d:.43s; grid-column:1/-1;" data-action="go-config" data-mode="simulacro2">
          <span class="mode-ico" aria-hidden="true">📝</span><h3>Simulacro 2026-2</h3>
          <p class="muted">Practica el simulacro interno 2026-2 con cronómetro por pregunta.</p>
        </button>
      </div>
      <button class="btn btn-secondary btn-block anim-in" data-action="go-progress" style="margin-top:16px; --d:.43s;">Ver mi progreso 📊</button>
      <p class="muted" style="margin-top:12px;">
        ${sessionsCount} sesión${sessionsCount === 1 ? "" : "es"} guardada${sessionsCount === 1 ? "" : "s"} en este navegador.
      </p>
    `;
  }

  // ---------- pantalla: configuración de modo ----------

  function startModeConfig(modeId) {
    let config = {};
    if (modeId === "practice") config = { moduleId: "", competencia: "" };
    else if (modeId === "simulation") config = { moduleId: "" };
    else if (modeId === "review") config = { moduleFilter: "" };
    else if (modeId === "express") config = { durationMinutes: 15, modules: ["RC", "LC", "CC", "IN"], sources: ["oficial"] };
    else if (modeId === "training") config = { moduleId: "Todas", competencia: "" };
    else if (modeId === "simulacro2") config = { areaFilter: "Todas" };
    state = { screen: "modeConfig", modeId, config };
    render();
  }

  function configStepHeader(subtitle) {
    return `
      <div class="config-steps" aria-label="Progreso de configuración">
        <span class="config-dot done">1</span><span class="config-line"></span>
        <span class="config-dot now">2</span><span class="config-line"></span>
        <span class="config-dot">3</span>
      </div>
      <p class="muted config-sub">${subtitle}</p>
    `;
  }

  function renderModeConfig() {
    const titleMap = { practice: "Práctica libre", simulation: "Simulacro", review: "Repaso", express: "Modo Exprés", training: "Entrenamiento", simulacro2: "Simulacro 2026-2" };
    const subMap = {
      practice: "Paso 2 de 3 · Elige qué quieres reforzar hoy.",
      simulation: "Paso 2 de 3 · Elige el módulo a simular al ritmo real del examen.",
      review: "Paso 2 de 3 · Elige qué errores quieres repasar.",
      express: "Paso 2 de 3 · Arma tu sesión corta a la medida.",
      training: "Paso 2 de 3 · Elige el banco de entrenamiento.",
      simulacro2: "Paso 2 de 3 · Elige el área del simulacro interno."
    };
    let body = "";
    if (state.modeId === "practice") body = renderPracticeConfig();
    else if (state.modeId === "simulation") body = renderSimulationConfig();
    else if (state.modeId === "review") body = renderReviewConfig();
    else if (state.modeId === "express") body = renderExpressConfig();
    else if (state.modeId === "training") body = renderTrainingConfig();
    else if (state.modeId === "simulacro2") body = renderSimulacro2Config();
    return `
      <button class="link-btn" data-action="go-home">&larr; Volver</button>
      <h2>${titleMap[state.modeId]}</h2>
      ${configStepHeader(subMap[state.modeId] || "")}
      ${body}
    `;
  }

  function moduleSelectOptions(selectedId, placeholder) {
    const ph = `<option value="">${placeholder || "— Por favor selecciona un módulo —"}</option>`;
    return ph + modules.map((m) => `<option value="${m.id}" ${m.id === selectedId ? "selected" : ""}>${m.name}</option>`).join("");
  }

  function modulePoolCount(moduleId) {
    if (!moduleId) return 0;
    return (window.SESP.data.questions[moduleId] || []).length;
  }

  function renderPracticeConfig() {
    const meta = moduleMeta(state.config.moduleId);
    let extra;
    let ctaDisabled = "";
    if (!meta) {
      extra = `<p class="guide-hint">👆 Primero selecciona un módulo: te mostraré sus competencias y cuántas preguntas te esperan.</p>`;
      ctaDisabled = "disabled";
    } else if (meta.kind === "essay") {
      extra = `<p class="muted">Ensayo argumentativo con el esquema real: 10 min de planeación + 30 min de escritura.</p>
        <p class="guide-ok">Buena elección: <strong>${meta.name}</strong>. Solo escribe, sin límite de preguntas.</p>`;
    } else {
      const comps = modesApi.practice.listCompetencias(state.config.moduleId);
      const opts = [`<option value="">Todas las competencias</option>`]
        .concat(comps.map((c) => `<option value="${c}" ${c === state.config.competencia ? "selected" : ""}>${c}</option>`))
        .join("");
      extra = `<div class="field"><label>Competencia (opcional)</label><select data-field="competencia">${opts}</select></div>
        <p class="guide-ok">Buena elección: <strong>${meta.name}</strong> · ${modulePoolCount(meta.id)} preguntas · ritmo objetivo ${meta.targetSeconds} s por pregunta.</p>`;
    }
    return `
      <div class="card">
        <div class="field"><label>1 · Módulo</label><select data-field="moduleId">${moduleSelectOptions(state.config.moduleId)}</select></div>
        ${extra}
        <button class="btn btn-block" data-action="start-session" ${ctaDisabled}>Comenzar la práctica →</button>
      </div>
    `;
  }

  function renderSimulationConfig() {
    const meta = moduleMeta(state.config.moduleId);
    const okHtml = meta
      ? `<p class="guide-ok">Buena elección: <strong>${meta.name}</strong> · ${modulePoolCount(meta.id)} preguntas al ritmo objetivo, sin pausas.</p>`
      : `<p class="guide-hint">👆 Selecciona un módulo para simularlo como en el examen real.</p>`;
    return `
      <div class="card">
        <div class="field"><label>1 · Módulo a simular</label><select data-field="moduleId">${moduleSelectOptions(state.config.moduleId)}</select></div>
        <p class="muted">Se corren todas las preguntas de ese módulo al ritmo objetivo, sin pausas ni volver atrás.</p>
        ${okHtml}
        <button class="btn btn-block" data-action="start-session" ${meta ? "" : "disabled"}>Comenzar simulacro →</button>
      </div>
    `;
  }

  function renderSimulacro2Config() {
    const areas = modesApi.simulacro2.listAreas();
    const labels = { Todas: "Todas (mezcla RC, LC, CC, IN)", RC: "Razonamiento Cuantitativo (4-13)", LC: "Lectura Crítica (14-28)", CC: "Competencias Ciudadanas (39-47)", IN: "Inglés (29-38)", CE: "Comunicación Escrita (48, ensayo)" };
    const options = areas.map((a) => {
      const n = a === "CE" ? 1 : modesApi.simulacro2.countByArea(a);
      return `<option value="${a}" ${a === state.config.areaFilter ? "selected" : ""}>${labels[a]} — ${n}</option>`;
    }).join("");
    return `
      <div class="card">
        <div class="field"><label>1 · Área del simulacro</label><select data-field="areaFilter">${options}</select></div>
        <p class="muted">Preguntas 4 a 48 del Word del simulacro interno. Las claves se resolvieron desde el enunciado y están <strong>pendientes de verificación oficial</strong> con tu docente.</p>
        <button class="btn btn-block" data-action="start-session">Comenzar</button>
      </div>
    `;
  }

  function renderReviewConfig() {
    const overallDue = storage.getDueReviewQuestionIds(null).length;
    const singleSelectModules = modules.filter((m) => m.kind === "single-select");
    const options = [`<option value="">Todos los módulos (${overallDue})</option>`]
      .concat(singleSelectModules.map((m) => {
        const due = storage.getDueReviewQuestionIds(m.id).length;
        return `<option value="${m.id}" ${m.id === state.config.moduleFilter ? "selected" : ""}>${m.name} (${due})</option>`;
      }))
      .join("");
    const dueNow = storage.getDueReviewQuestionIds(state.config.moduleFilter || null).length;
    return `
      <div class="card">
        <div class="field"><label>1 · Módulo a repasar</label><select data-field="moduleFilter">${options}</select></div>
        <p class="muted">${dueNow} pregunta${dueNow === 1 ? "" : "s"} pendiente${dueNow === 1 ? "" : "s"} con este filtro. Repasar errores vale doble.</p>
        <button class="btn btn-block" data-action="start-session" ${dueNow === 0 ? "disabled" : ""}>Comenzar repaso</button>
      </div>
    `;
  }

  function renderExpressConfig() {
    const durationHtml = [15, 30, 60].map((d) => `
      <label class="check-item">
        <input type="radio" name="durationMinutes" data-field="durationMinutes" value="${d}" ${Number(state.config.durationMinutes) === d ? "checked" : ""}> ${d} min
      </label>
    `).join("");

    const selected = state.config.modules;
    const areaHtml = modules.map((m) => `
      <label class="check-item">
        <input type="checkbox" data-field="modules" data-value="${m.id}" ${selected.indexOf(m.id) !== -1 ? "checked" : ""}>
        ${escapeHtml(m.name)}${m.kind === "essay" ? " (ensayo)" : ""}
      </label>
    `).join("");

    const sources = state.config.sources;
    const sourceHtml = [
      { id: "oficial", label: "Cuadernillos oficiales del ICFES" },
      { id: "generado", label: "Banco de entrenamiento (no oficial)" },
    ].map((s) => `
      <label class="check-item">
        <input type="checkbox" data-field="sources" data-value="${s.id}" ${sources.indexOf(s.id) !== -1 ? "checked" : ""}>
        ${s.label}
      </label>
    `).join("");

    const isEssay = selected.length === 1 && selected[0] === "CE";
    const available = isEssay ? null : modesApi.express.countFor(selected, sources);
    let hint;
    if (!selected.length) hint = "Marca al menos un área.";
    else if (!sources.length) hint = "Marca al menos una fuente.";
    else if (isEssay) hint = "Sesión de ensayo: Comunicación Escrita no se mezcla con otras áreas.";
    else hint = `${available} pregunta${available === 1 ? "" : "s"} disponible${available === 1 ? "" : "s"} con esta selección. Si se agotan antes de que acabe el tiempo, se rebarajan.`;

    return `
      <div class="card">
        <div class="field"><label>Duración</label><div class="check-grid">${durationHtml}</div></div>
        <div class="field"><label>Áreas</label><div class="check-grid">${areaHtml}</div></div>
        <div class="field"><label>Fuente de las preguntas</label><div class="check-grid">${sourceHtml}</div></div>
        <p class="muted">${escapeHtml(hint)}</p>
        <button class="btn btn-block" data-action="start-session" ${!selected.length || !sources.length || available === 0 ? "disabled" : ""}>Comenzar</button>
      </div>
    `;
  }

  // El selector de módulo aquí no es el global: solo lista los módulos que tienen
  // preguntas en el banco de entrenamiento, con su conteo, para no ofrecer filtros vacíos.
  function renderTrainingConfig() {
    const trainingModules = modesApi.training.listModules();
    const moduleOptions = [`<option value="Todas" ${state.config.moduleId === "Todas" ? "selected" : ""}>Todos (${modesApi.training.countFor("Todas")})</option>`]
      .concat(trainingModules.map((m) => `<option value="${m.id}" ${m.id === state.config.moduleId ? "selected" : ""}>${m.name} (${modesApi.training.countFor(m.id)})</option>`))
      .join("");

    const selectedMeta = moduleMeta(state.config.moduleId);
    let competenciaField = "";
    if (selectedMeta && selectedMeta.kind === "essay") {
      competenciaField = `<p class="muted">Ensayo argumentativo con el esquema real: 10 min de planeación + 30 min de escritura. Al terminar verás una lista de autoevaluación en vez de una calificación.</p>`;
    } else if (state.config.moduleId !== "Todas") {
      const comps = modesApi.training.listCompetencias(state.config.moduleId);
      const opts = [`<option value="">Todas las competencias</option>`]
        .concat(comps.map((c) => `<option value="${c}" ${c === state.config.competencia ? "selected" : ""}>${c}</option>`))
        .join("");
      competenciaField = `<div class="field"><label>Competencia (opcional)</label><select data-field="competencia">${opts}</select></div>`;
    }

    return `
      <div class="card">
        <p class="muted">Banco <strong>no oficial</strong>: preguntas escritas para este proyecto imitando el formato del ICFES. Sirven para practicar cuando ya te sabes de memoria las de los cuadernillos — pero la fuente de verdad siguen siendo los modos con material oficial.</p>
        <p class="muted">Cada pregunta muestra la explicación resuelta después de que respondas.</p>
        <div class="field"><label>Módulo</label><select data-field="moduleId">${moduleOptions}</select></div>
        ${competenciaField}
        <button class="btn btn-block" data-action="start-session">Comenzar entrenamiento</button>
      </div>
    `;
  }

  // ---------- arranque de sesión ----------

  function startSession() {
    try {
      let session;
      if (state.modeId === "practice") {
        if (!state.config.moduleId) { showMessage("Por favor selecciona un módulo para continuar. Si es tu primera vez, te recomendamos Razonamiento Cuantitativo."); return; }
        session = modesApi.practice.start({ moduleId: state.config.moduleId, competencia: state.config.competencia || undefined });
      } else if (state.modeId === "simulation") {
        if (!state.config.moduleId) { showMessage("Por favor selecciona el módulo que quieres simular. Para calentar, elige uno corto como Inglés."); return; }
        session = modesApi.simulation.start({ moduleId: state.config.moduleId });
      } else if (state.modeId === "review") {
        session = modesApi.review.start({ moduleFilter: state.config.moduleFilter || null });
        if (!session) { showMessage("No hay preguntas pendientes de repaso con ese filtro."); return; }
      } else if (state.modeId === "express") {
        session = modesApi.express.start({ durationMinutes: Number(state.config.durationMinutes), modules: state.config.modules, sources: state.config.sources });
      } else if (state.modeId === "training") {
        session = modesApi.training.start({ moduleId: state.config.moduleId, competencia: state.config.competencia || undefined });
      } else if (state.modeId === "simulacro2") {
        session = modesApi.simulacro2.start({ areaFilter: state.config.areaFilter });
      }
      state.session = session;
      state.answered = false;
      state.lastAnswer = null;
      answerStreak = 0;
      state.screen = session.kind === "essay" ? "essay" : "question";
      render();
    } catch (err) {
      showMessage(err.message);
    }
  }

  // ---------- pantalla: pregunta ----------

  function canContinue() {
    const session = state.session;
    if (state.modeId === "express") return !modesApi.express.isSessionOver(session);
    if (state.modeId === "simulation") return !modesApi.simulation.isSessionOver(session) && engine.hasMoreQuestions(session);
    return engine.hasMoreQuestions(session);
  }

  function renderContext(context) {
    let tableHtml = "";
    if (context.table) {
      const headerRow = context.table.headers.map((h) => `<th>${escapeHtml(h)}</th>`).join("");
      const bodyRows = context.table.rows.map((r) => `<tr>${r.map((c) => `<td>${escapeHtml(c)}</td>`).join("")}</tr>`).join("");
      // La tabla va dentro de un contenedor con scroll propio: las de los cuadernillos
      // tienen hasta 7 columnas y no caben en un teléfono. Sin esto, la página entera
      // se desplaza de lado y se pierde el lugar del texto al leerla.
      tableHtml = `<div class="table-scroll"><table><thead><tr>${headerRow}</tr></thead><tbody>${bodyRows}</tbody></table></div>`;
    }
    let imageHtml = "";
    if (context.image) {
      imageHtml = `<img class="context-image" src="${escapeHtml(context.image.src)}" alt="${escapeHtml(context.image.alt || context.title || "Imagen del cuadernillo")}">`;
    }
    const titleHtml = context.title ? `<strong>${escapeHtml(context.title)}</strong>\n\n` : "";
    return `<div class="context-box">${titleHtml}${escapeHtml(context.body)}${imageHtml}${tableHtml}</div>`;
  }

  // Los contextos oficiales viven en contexts[<módulo>]; los del banco de
  // entrenamiento, en contexts.GEN (aunque su pregunta declare module: "RC").
  function findContext(q) {
    if (!q.contextId) return null;
    const pools = window.SESP.data.contexts || {};
    return (pools[q.module] || []).find((c) => c.id === q.contextId)
      || (pools.GEN || []).find((c) => c.id === q.contextId)
      || null;
  }

  // El banco de entrenamiento trae la explicación dentro de la propia pregunta. Las
  // oficiales la tienen aparte, en data/explanations.js: los archivos de cuadernillo
  // son transcripción literal del ICFES y no deben mezclarse con análisis propio.
  function explanationFor(q) {
    return q.explanation || (window.SESP.data.explanations || {})[q.id] || null;
  }

  function renderQuestion() {
    const session = state.session;
    const q = engine.getCurrentQuestion(session);
    const meta = moduleMeta(q.module);
    const context = findContext(q);

    const optionsHtml = q.options.map((opt) => {
      let cls = "option";
      let disabled = "";
      if (state.answered) {
        disabled = "disabled";
        if (opt.key === q.correctOption) cls += " correct";
        else if (opt.key === state.lastAnswer.selectedOption) cls += " incorrect";
      }
      return `<button class="${cls}" data-action="select-option" data-value="${opt.key}" ${disabled}><span class="opt-key">${escapeHtml(opt.key)}</span><span>${escapeHtml(opt.text)}</span></button>`;
    }).join("");

    let feedbackHtml = "";
    let nextButtonHtml = "";
    if (state.answered) {
      feedbackHtml = state.lastAnswer.correct
        ? `<p class="feedback correct">Correcto — ${fmtMs(state.lastAnswer.timeMs)}</p>`
        : `<p class="feedback incorrect">Incorrecto — la respuesta correcta era ${q.correctOption} — ${fmtMs(state.lastAnswer.timeMs)}</p>`;
      // Entrenamiento explica siempre. Repaso explica solo al fallar: llegar aquí ya
      // significa haberla fallado antes, así que un segundo error es justo donde deja
      // de servir repetir y hace falta el razonamiento. Los modos cronometrados
      // (Simulacro, Exprés) no explican, para no romper la simulación del examen.
      const explanation = explanationFor(q);
      const shouldExplain = state.modeId === "training" || (state.modeId === "review" && !state.lastAnswer.correct);
      if (explanation && shouldExplain) {
        const heading = state.modeId === "review" ? "Por qué — la volviste a fallar" : "Por qué";
        feedbackHtml += `<div class="explanation"><h4>${heading}</h4><p>${escapeHtml(explanation)}</p></div>`;
      }
      nextButtonHtml = canContinue()
        ? `<button class="btn btn-block" data-action="next-question">Siguiente</button>`
        : `<button class="btn btn-block" data-action="finish-session">Ver resultados</button>`;
    }

    const totalTimerHtml = session.totalTimeLimitMs != null
      ? `<span class="timer-chip fast" id="total-timer">${fmtCountdown(engine.getRemainingTotalMs(session))}</span>`
      : "";

    const qTotal = session.questions ? session.questions.length : 0;
    const qNum = Math.min(session.currentIndex + 1, qTotal);
    const qPct = qTotal ? Math.round((session.currentIndex / qTotal) * 100) : 0;
    return `
      <div class="top-actions"><button class="link-btn" data-action="finish-session">Terminar sesión</button></div>
      <div class="quest-progress" aria-label="Avance de la sesión">
        <span>Pregunta ${qNum} de ${qTotal} · Paso 3 de 4</span>
        <div class="quest-bar"><div class="quest-fill" style="width:${qPct}%"></div></div>
      </div>
      <div class="timer-bar">
        <span class="pill" style="background:${meta.color}">${meta.name}</span>
        ${q.generated ? `<span class="pill pill-warn" title="Pregunta escrita para este proyecto, no tomada de un cuadernillo del ICFES">No oficial</span>` : ""}
        <span class="timer-chip fast" id="question-timer">⏳ --:--</span>
        ${totalTimerHtml}
      </div>
      <div class="countdown-track" aria-hidden="true"><div class="countdown-fill fast" id="countdown-fill" style="width:100%"></div></div>
      ${context ? renderContext(context) : ""}
      <p class="prompt">${escapeHtml(q.prompt)}</p>
      ${q.id && q.id.indexOf("S2-") === 0 ? `<p class="muted" style="font-size:.8em;">Simulacro 2026-2 · pregunta ${q.source && q.source.originalNumber != null ? q.source.originalNumber : ""} · clave derivada por el equipo, pendiente de verificación oficial.</p>` : ""}
      <div class="options">${optionsHtml}</div>
      ${feedbackHtml}
      ${nextButtonHtml}
    `;
  }

  function chooseOption(value) {
    if (state.answered) return;
    const answer = modesApi[state.modeId].submitAnswer(state.session, value);
    state.answered = true;
    state.lastAnswer = answer;
    if (answer.correct == null) answerStreak = 0;
    else if (answer.correct) {
      answerStreak += 1;
      render();
      showStreakToast(answerStreak);
      return;
    } else answerStreak = 0;
    render();
    revealAnswer();
  }

  // En un teléfono, las opciones ocupan casi toda la pantalla: cuando se responde, el
  // "Correcto/Incorrecto" y el botón de siguiente quedan por debajo del borde y lo
  // único que cambia es el color de la opción, así que parece que la app no arrancó.
  // Se trae el bloque a la vista sin mover nada cuando ya cabe. En escritorio no hace
  // falta (todo se ve a la vez) y el salto distraería, así que se limita a móvil.
  function revealAnswer() {
    if (window.innerWidth > 720) return;
    const feedback = document.querySelector(".feedback");
    if (!feedback) return;
    // "Terminar sesión" de la barra superior también es data-action="finish-session":
    // el botón de avanzar es el último de los dos.
    const candidatos = document.querySelectorAll('[data-action="next-question"],[data-action="finish-session"]');
    const next = candidatos[candidatos.length - 1] || null;
    const arriba = feedback.getBoundingClientRect().top;
    const abajo = (next || feedback).getBoundingClientRect().bottom;
    const alto = window.innerHeight;
    if (arriba >= 0 && abajo <= alto) return;
    const bloque = abajo - arriba;
    if (bloque + 40 < alto) window.scrollBy({ top: arriba - (alto - bloque) / 2, behavior: "smooth" });
    else window.scrollBy({ top: arriba - 90, behavior: "smooth" }); // 90 px dejan libre el cronómetro fijo
  }

  function goNext() {
    // Si el tiempo se agotó mientras el usuario miraba el feedback de la pregunta
    // que ya respondió, no se abre una pregunta nueva: se corta la sesión ahí mismo.
    if ((state.modeId === "express" && modesApi.express.isSessionOver(state.session)) ||
        (state.modeId === "simulation" && modesApi.simulation.isSessionOver(state.session))) {
      finishSession();
      return;
    }
    if (state.modeId === "express") modesApi.express.advance(state.session);
    else modesApi[state.modeId].next(state.session);
    state.answered = false;
    state.lastAnswer = null;
    render();
  }

  function finishSession() {
    state.summary = modesApi[state.modeId].finish(state.session);
    state.screen = "results";
    render();
  }

  // ---------- pantalla: se acabó el tiempo (Exprés/Simulacro) ----------

  function renderTimeUp() {
    return `
      <div class="card" style="text-align:center;">
        <h2>Se acabó el tiempo</h2>
        <p class="muted">La sesión terminó porque se cumplió la duración. La pregunta que estaba abierta no se cuenta.</p>
        <button class="btn btn-block" data-action="finish-session">Ver resultados</button>
      </div>
    `;
  }

  // ---------- pantalla: ensayo (CE) ----------

  function renderEssay() {
    const session = state.session;
    const topic = session.topic;
    const meta = moduleMeta("CE");
    const phaseLabel = session.phase === "planning" ? "Planeación" : "Escritura";
    const phaseActionHtml = session.phase === "planning"
      ? `<button class="btn btn-secondary btn-block" data-action="essay-advance-phase">Pasar a escritura ahora</button>`
      : `<button class="btn btn-block" data-action="essay-finish">Terminar</button>`;

    return `
      <div class="top-actions"><button class="link-btn" data-action="go-home">Salir</button></div>
      <div class="timer-bar">
        <span class="pill" style="background:${meta.color}">Comunicación Escrita — ${phaseLabel}</span>
        <span class="timer-chip fast" id="essay-timer">${fmtCountdown(engine.getEssayPhaseRemainingMs(session))}</span>
      </div>
      <h3>${escapeHtml(topic.title)}</h3>
      <div class="context-box">${escapeHtml(topic.context)}</div>
      <p class="prompt">${escapeHtml(topic.prompt)}</p>
      <div class="field">
        <label>Tu texto argumentativo <span class="muted" id="word-count-badge">(0 palabras)</span></label>
        <textarea id="essay-textarea" rows="14" placeholder="Escribe aquí...">${escapeHtml(session.text || "")}</textarea>
      </div>
      ${phaseActionHtml}
    `;
  }

  function essayAdvancePhase() {
    engine.advanceEssayPhase(state.session);
    render();
  }

  function essayFinish() {
    state.summary = modesApi[state.modeId].finishEssay(state.session);
    state.screen = "essayResults";
    render();
  }

  // ---------- pantallas: resultados ----------

  function getPreviousSessionsForTrend(session) {
    return storage.getSessions().filter((s) => (
      s.answers && s.mode === session.mode && s.startedAt !== session.startedAt &&
      (session.moduleFilter ? s.moduleFilter === session.moduleFilter : true)
    ));
  }

  function renderResults() {
    const summary = state.summary;
    const session = state.session;
    const previous = getPreviousSessionsForTrend(session);
    const trend = statsApi.computeTrend(summary, previous);

    const moduleBars = Object.keys(summary.byModule).map((moduleId) => {
      const m = summary.byModule[moduleId];
      const meta = moduleMeta(moduleId);
      const pct = m.accuracy == null ? 0 : Math.round(m.accuracy * 100);
      return `
        <div style="margin-bottom:10px;">
          <div class="row" style="justify-content:space-between;">
            <strong>${meta.name}</strong>
            <span class="muted">${m.correct}/${m.total} · prom. ${fmtMs(m.avgMs)} (objetivo ${fmtMs(meta.targetSeconds * 1000)})</span>
          </div>
          <div class="bar-row"><div class="bar-track"><div class="bar-fill" style="width:${pct}%; background:${meta.color}"></div></div><span class="muted">${pct}%</span></div>
        </div>
      `;
    }).join("");

    const fastestHtml = summary.fastest.map((a) => `<li>${escapeHtml(a.questionId)} — ${fmtMs(a.timeMs)}</li>`).join("") || `<li class="muted">—</li>`;
    const slowestHtml = summary.slowest.map((a) => `<li>${escapeHtml(a.questionId)} — ${fmtMs(a.timeMs)}</li>`).join("") || `<li class="muted">—</li>`;

    const tipsHtml = summary.tips.length
      ? `<ul class="tips">${summary.tips.map((t) => `<li>${escapeHtml(t)}</li>`).join("")}</ul>`
      : `<p class="muted">Sin tips para esta sesión (muestra chica o desempeño parejo).</p>`;

    const trendHtml = trend
      ? `<p class="muted">Vs. tu tiempo promedio anterior en este modo: ${trend.deltaMs <= 0 ? "mejoraste" : "más lento"} en ${fmtMs(Math.abs(trend.deltaMs))}.</p>`
      : "";

    const c = summary.overall.classifications;

    // Paso 4 de 4: celebra el avance y propone qué hacer después, como un guía.
    let nextStepHtml = "";
    try {
      const acc = summary && summary.overall ? summary.overall.accuracy : null;
      const cheer = acc == null
        ? "Sesión completada. La constancia es lo que más suma."
        : acc >= 0.8 ? "¡Excelente nivel! Estás listo para subir la dificultad."
        : acc >= 0.5 ? "Buen avance. Ahora convierte esos errores en puntos."
        : "Cada error de hoy es un acierto del examen. Vamos a repasarlos.";
      let due = 0;
      try { due = storage.getDueReviewQuestionIds(null).length; } catch (err) { due = 0; }
      const cta = due > 0
        ? `<button class="btn btn-block" data-action="go-config" data-mode="review">Repasar mis ${due} pendientes →</button>`
        : `<button class="btn btn-block" data-action="go-config" data-mode="express">Probar el Modo Exprés →</button>`;
      nextStepHtml = `
        <div class="card next-step">
          <h3>Paso 4 de 4 · ¿Qué sigue?</h3>
          <p class="muted">${cheer}</p>
          ${cta}
          <button class="btn btn-secondary btn-block" data-action="go-progress" style="margin-top:8px;">Ver mi progreso</button>
        </div>
      `;
    } catch (err) { nextStepHtml = ""; }

    const s2Notice = session && session.mode === "simulacro2"
      ? `<div class="card" style="border-color:var(--warn);"><p style="margin:0;"><strong>Simulacro 2026-2:</strong> <span class="muted">las claves de estas preguntas se resolvieron desde el enunciado y están pendientes de verificación oficial con tu docente. Prioriza los tiempos y los tips.</span></p></div>`
      : "";

    return `
      <h2>Resultados</h2>
      ${s2Notice}
      <div class="stat-grid">
        <div class="stat-box"><div class="value">${fmtPercent(summary.overall.accuracy)}</div><div class="label">Precisión global</div></div>
        <div class="stat-box"><div class="value">${summary.total}</div><div class="label">Preguntas respondidas</div></div>
        <div class="stat-box"><div class="value">${fmtMs(summary.overall.avgMs)}</div><div class="label">Tiempo promedio</div></div>
        <div class="stat-box"><div class="value">${fmtMs(summary.overall.medianMs)}</div><div class="label">Tiempo mediana</div></div>
      </div>
      ${trendHtml}
      <div class="card">
        <h3>Por módulo</h3>
        ${moduleBars}
      </div>
      <div class="card">
        <h3>Clasificación</h3>
        <p class="muted">Rápida y correcta: ${c["rapida-correcta"]} · Rápida e incorrecta: ${c["rapida-incorrecta"]} · Lenta y correcta: ${c["lenta-correcta"]} · Lenta e incorrecta: ${c["lenta-incorrecta"]}</p>
      </div>
      <div class="row">
        <div class="card" style="flex:1; min-width:220px;"><h3>Más rápidas</h3><ul>${fastestHtml}</ul></div>
        <div class="card" style="flex:1; min-width:220px;"><h3>Más lentas</h3><ul>${slowestHtml}</ul></div>
      </div>
      <div class="card">
        <h3>Tips</h3>
        ${tipsHtml}
      </div>
      ${nextStepHtml}
      <button class="btn btn-block" data-action="go-home">Volver al inicio</button>
    `;
  }

  function renderEssayResults() {
    const summary = state.summary;
    const rubric = summary.rubric || {};
    const rubricHtml = ["planteamiento", "organizacion", "formaExpresion"]
      .filter((k) => rubric[k])
      .map((k) => `<div class="rubric-block"><h4>${escapeHtml(k)}</h4><p class="muted">${escapeHtml(rubric[k])}</p></div>`)
      .join("");

    return `
      <h2>Resultados — Comunicación Escrita</h2>
      <p class="muted">CE se califica por rúbrica, no hay respuesta correcta automática: usa esto como guía de autoevaluación.</p>
      <div class="stat-grid">
        <div class="stat-box"><div class="value">${fmtMs(summary.planningMsUsed)}</div><div class="label">Planeación (de ${fmtMs(summary.planningMsAllotted)})</div></div>
        <div class="stat-box"><div class="value">${fmtMs(summary.writingMsUsed)}</div><div class="label">Escritura (de ${fmtMs(summary.writingMsAllotted)})</div></div>
        <div class="stat-box"><div class="value">${summary.wordCount}</div><div class="label">Palabras escritas</div></div>
      </div>
      <div class="card">
        <h3>Rúbrica de referencia — ${escapeHtml(summary.title || "")}</h3>
        ${rubricHtml}
      </div>
      <button class="btn btn-block" data-action="go-home">Volver al inicio</button>
    `;
  }

  // ---------- pantalla: progreso ----------

  // Serie de precisión por módulo a través de todas las sesiones guardadas, en
  // orden cronológico, para ver de un vistazo si hay mejoría o estancamiento.
  // Se muestra siempre, tenga o no sesiones guardadas: importar un respaldo es
  // justo lo que se necesita cuando el navegador está vacío (recién instalado,
  // se borró el historial, se cambió de equipo, etc.).
  function renderDataManagementCard() {
    return `
      <div class="card">
        <h3>Apariencia y accesibilidad</h3>
        <div class="row" style="margin-bottom:12px;">${controlsHtml()}</div>
      </div>
      <div class="card">
        <h3>Tus datos</h3>
        <p class="muted">Todo vive solo en este navegador. Exporta de vez en cuando por si se borra el historial del navegador, cambias de equipo, o algo similar.</p>
        <div class="row">
          <button class="btn btn-secondary" data-action="export-progress">Exportar progreso</button>
          <button class="btn btn-secondary" data-action="trigger-import">Importar progreso</button>
          <button class="link-btn" data-action="clear-history">Borrar historial</button>
        </div>
        <input type="file" id="import-file-input" accept="application/json" style="display:none;">
      </div>
    `;
  }

  function renderProgress() {
    const sessions = storage.getSessions().slice().sort((a, b) => new Date(a.startedAt) - new Date(b.startedAt));

    if (!sessions.length) {
      return `
        <button class="link-btn" data-action="go-home">&larr; Volver</button>
        <h2>Tu progreso</h2>
        <p class="muted">Todavía no hay sesiones guardadas. Completa una para empezar a ver tu evolución aquí, o importa un respaldo si ya tenías progreso.</p>
        ${renderDataManagementCard()}
      `;
    }

    const byModuleSeries = {};
    sessions.forEach((s) => {
      if (!s.answers) return; // sesión de ensayo (CE), no tiene precisión
      const summary = statsApi.summarizeSession(s);
      Object.keys(summary.byModule).forEach((moduleId) => {
        if (summary.byModule[moduleId].accuracy == null) return;
        byModuleSeries[moduleId] = byModuleSeries[moduleId] || [];
        byModuleSeries[moduleId].push(summary.byModule[moduleId].accuracy);
      });
    });

    const chartsHtml = Object.keys(byModuleSeries).length
      ? Object.keys(byModuleSeries).map((moduleId) => {
          const meta = moduleMeta(moduleId);
          const series = byModuleSeries[moduleId];
          const bars = series.map((acc) => {
            const pct = Math.round(acc * 100);
            return `<div class="progress-bar-mini" style="height:${Math.max(6, pct)}%; background:${meta.color};" title="${pct}%"></div>`;
          }).join("");
          let trendTxt = "";
          if (series.length > 1) {
            const deltaPts = Math.round((series[series.length - 1] - series[0]) * 100);
            trendTxt = deltaPts === 0 ? "sin cambio" : deltaPts > 0 ? `mejoró ${deltaPts} pts` : `bajó ${Math.abs(deltaPts)} pts`;
          }
          return `
            <div class="card">
              <div class="row" style="justify-content:space-between;">
                <strong>${meta.name}</strong>
                <span class="muted">${series.length} sesión${series.length === 1 ? "" : "es"}${trendTxt ? " · " + trendTxt : ""}</span>
              </div>
              <div class="progress-chart">${bars}</div>
            </div>
          `;
        }).join("")
      : `<p class="muted">Todavía no hay sesiones de opción múltiple para graficar.</p>`;

    const modeLabels = { practice: "Práctica", simulation: "Simulacro", review: "Repaso", express: "Exprés", training: "Entrenamiento", simulacro2: "Simulacro 2026-2" };
    const rowsHtml = sessions.slice().reverse().map((s) => {
      const date = new Date(s.startedAt);
      const dateStr = `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
      const modeLabel = modeLabels[s.mode] || s.mode;
      if (s.answers) {
        const summary = statsApi.summarizeSession(s);
        const areaLabel = s.areaFilter || s.moduleFilter || "Mezcla";
        return `<tr><td>${dateStr}</td><td>${modeLabel}</td><td>${escapeHtml(areaLabel)}</td><td>${fmtPercent(summary.overall.accuracy)}</td><td>${fmtMs(summary.overall.avgMs)}</td></tr>`;
      }
      return `<tr><td>${dateStr}</td><td>${modeLabel}</td><td>CE</td><td>—</td><td>${s.essay.wordCount} palabras</td></tr>`;
    }).join("");

    return `
      <button class="link-btn" data-action="go-home">&larr; Volver</button>
      <h2>Tu progreso</h2>
      <p class="muted">Precisión por módulo a lo largo de tus sesiones (más reciente a la derecha).</p>
      ${chartsHtml}
      <div class="card">
        <h3>Historial de sesiones</h3>
        <div style="overflow-x:auto;">
          <table>
            <thead><tr><th>Fecha</th><th>Modo</th><th>Módulo/Área</th><th>Precisión</th><th>Tiempo/palabras</th></tr></thead>
            <tbody>${rowsHtml}</tbody>
          </table>
        </div>
      </div>
      ${renderDataManagementCard()}
    `;
  }

  // ---------- eventos ----------

  function handleClick(e) {
    const actionEl = e.target.closest("[data-action]");
    if (!actionEl) return;
    const action = actionEl.dataset.action;
    if (action === "login-guest") { loginAsGuest(); return; }
    else if (action === "login") { state = { screen: "login" }; render(); return; }
    else if (action === "logout") { logout(); return; }
    else if (action === "toggle-password") {
      const input = document.getElementById("login-password");
      if (!input) return;
      const show = input.type === "password";
      input.type = show ? "text" : "password";
      actionEl.classList.toggle("showing", show);
      actionEl.setAttribute("aria-pressed", String(show));
      actionEl.setAttribute("aria-label", show ? "Ocultar contraseña" : "Mostrar contraseña");
      input.focus();
      return;
    }
    else if (action === "login-forgot") {
      const box = document.getElementById("login-error-box");
      if (box) { box.textContent = "Demo local: no hay servidor. Usa Explorar como invitado o ingresa con cualquier contraseña válida."; box.classList.add("show"); }
      return;
    }
    else if (action === "toggle-theme") {
      const p = getPrefs();
      storage.savePrefs({ theme: p.theme === "light" ? "dark" : "light", fontScale: p.fontScale, highContrast: p.highContrast });
      applyPrefs();
      render();
      return;
    }
    else if (action === "cycle-font") {
      const p = getPrefs();
      const next = p.fontScale >= 1.25 ? 1 : p.fontScale >= 1.125 ? 1.25 : 1.125;
      storage.savePrefs({ theme: p.theme, fontScale: next, highContrast: p.highContrast });
      applyPrefs();
      render();
      return;
    }
    else if (action === "toggle-contrast") {
      const p = getPrefs();
      storage.savePrefs({ theme: p.theme, fontScale: p.fontScale, highContrast: !p.highContrast });
      applyPrefs();
      render();
      return;
    }
    else if (action === "reward-continue") { pendingReward = null; state = { screen: "home" }; render(); return; }
    else if (action === "go-config") startModeConfig(actionEl.dataset.mode);
    else if (action === "go-home") { state = { screen: storage.getCurrentUser() ? "home" : "login" }; render(); }
    else if (action === "go-progress") { state = { screen: "progress" }; render(); }
    else if (action === "start-session") startSession();
    else if (action === "select-option") chooseOption(actionEl.dataset.value);
    else if (action === "next-question") goNext();
    else if (action === "finish-session") finishSession();
    else if (action === "essay-advance-phase") essayAdvancePhase();
    else if (action === "essay-finish") essayFinish();
    else if (action === "clear-history") {
      showConfirm("¿Borrar todo el historial de sesiones y la cola de repaso? No se puede deshacer.", () => {
        storage.clearAll();
        render();
      });
    }
    else if (action === "export-progress") exportProgress();
    else if (action === "trigger-import") {
      const input = document.getElementById("import-file-input");
      if (input) input.click();
    }
  }

  // Genera el archivo de respaldo y dispara la descarga del navegador (sin servidor).
  //
  // Salvedad importante en el móvil: dentro del WebView de la app instalada (o de
  // una PWA en Android) una descarga de un blob no hace nada visible, porque no hay
  // interfaz de descargas del navegador. Antes que fallar en silencio, ahí se muestra
  // el JSON en un cuadro de texto para copiarlo (a un correo, a Drive, a notas).
  function exportProgress() {
    const data = storage.exportData();
    const texto = JSON.stringify(data, null, 2);
    const enWebViewNativo = !!(window.Capacitor && window.Capacitor.isNativePlatform
      && window.Capacitor.isNativePlatform());
    if (enWebViewNativo) {
      showModal(`
        <p class="muted">Copia este texto y guárdalo donde quieras (por ejemplo, en un correo o en Drive). Es el respaldo de tu progreso.</p>
        <textarea readonly style="min-height:40vh;font-size:12px;">${escapeHtml(texto)}</textarea>
        <button class="btn btn-block" data-modal-action="close">Entendido</button>
      `);
      return;
    }
    const blob = new Blob([texto], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sesp-progreso-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function importProgressFile(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        const result = storage.importData(data);
        showMessage(`Progreso importado: ${result.sessionsCount} sesiones y ${result.reviewCount} preguntas en la cola de repaso en total.`);
        render();
      } catch (err) {
        showMessage("No se pudo importar el archivo: " + err.message);
      }
    };
    reader.onerror = () => showMessage("No se pudo leer el archivo.");
    reader.readAsText(file);
  }

  function handleChange(e) {
    const t = e.target;
    if (t.id === "import-file-input") {
      if (t.files && t.files[0]) importProgressFile(t.files[0]);
      return;
    }
    if (!t.matches("[data-field]")) return;

    if (t.type === "checkbox") {
      toggleInConfigList(t.dataset.field, t.dataset.value, t.checked);
      render();
      return;
    }

    state.config[t.dataset.field] = t.value;
    // Cambiar de módulo invalida la competencia elegida (pertenece al módulo anterior):
    // si no se limpia, el filtro combinado deja el banco vacío y la sesión no arranca.
    if (t.dataset.field === "moduleId") state.config.competencia = "";
    render();
  }

  // Los módulos de ensayo (CE) no se mezclan con los de opción múltiple: marcarlo
  // deselecciona el resto, y marcar cualquier otro lo deselecciona a él.
  function toggleInConfigList(field, value, checked) {
    const current = state.config[field] || [];
    let next = checked ? current.concat([value]) : current.filter((v) => v !== value);

    if (field === "modules" && checked) {
      const isEssay = (id) => { const m = moduleMeta(id); return m && m.kind === "essay"; };
      next = isEssay(value) ? [value] : next.filter((id) => !isEssay(id));
    }

    state.config[field] = next;
  }

  function handleInput(e) {
    if (e.target.id === "essay-textarea") {
      engine.setEssayText(state.session, e.target.value);
      updateWordCountBadge();
    }
    if (e.target.id === "login-username") clearLoginError(e.target, "login-uErr");
    if (e.target.id === "login-password") {
      clearLoginError(e.target, "login-pErr");
      const warn = document.getElementById("capsWarn");
      if (warn && e.getModifierState) {
        try { warn.classList.toggle("show", e.getModifierState("CapsLock")); } catch (err) { /* noop */ }
      }
    }
  }

  function handleSubmit(e) {
    if (e.target && e.target.id === "login-form") {
      e.preventDefault();
      doLogin();
    }
  }

  function init() {
    root = document.getElementById("app");
    applyPrefs();
    root.addEventListener("click", handleClick);
    root.addEventListener("change", handleChange);
    root.addEventListener("input", handleInput);
    root.addEventListener("submit", handleSubmit);
    // Si ya había sesión guardada, entrar directo; si no, pedir login.
    try {
      state = { screen: storage.getCurrentUser() ? "home" : "login" };
    } catch (err) {
      state = { screen: "login" };
    }
    render();
  }

  return { init };
})();

document.addEventListener("DOMContentLoaded", function () {
  window.SESP.ui.init();
});
