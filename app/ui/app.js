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
  let state = { screen: "home" };
  let modalEl = null;
  let pendingConfirmCallback = null;

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

  // ---------- ciclo de render ----------

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
    if (!root) return;
    const key = currentRenderKey();
    const changed = key !== lastRenderKey;
    lastRenderKey = key;
    if (state.screen === "home") root.innerHTML = renderHome();
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

  function updateQuestionTimers() {
    const session = state.session;
    const qTimerEl = document.getElementById("question-timer");
    if (qTimerEl) {
      const q = engine.getCurrentQuestion(session);
      const target = session.moduleTimers ? session.moduleTimers[q.module] : null;
      const elapsed = engine.getElapsedForCurrentQuestionMs(session);
      qTimerEl.textContent = fmtMs(elapsed);
      qTimerEl.className = "timer-chip " + (target == null ? "" : elapsed <= target ? "fast" : elapsed <= target * 1.3 ? "slow" : "over");
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

  // ---------- pantalla: inicio ----------

  function renderHome() {
    const dueCount = storage.getDueReviewQuestionIds(null).length;
    const sessionsCount = storage.getSessions().length;
    return `
      <h1>SESP — Práctica Saber Pro</h1>
      <p class="muted">Preguntas reales de cuadernillos oficiales del ICFES. Elige un modo para empezar.</p>
      <div class="mode-grid">
        <button class="mode-card" data-action="go-config" data-mode="practice">
          <h3>Práctica libre</h3>
          <p class="muted">Un módulo (y competencia opcional), sin presión de tiempo.</p>
        </button>
        <button class="mode-card" data-action="go-config" data-mode="simulation">
          <h3>Simulacro</h3>
          <p class="muted">Un módulo completo al ritmo objetivo del examen, sin pausas.</p>
        </button>
        <button class="mode-card" data-action="go-config" data-mode="review">
          <h3>Repaso</h3>
          <p class="muted">${dueCount} pregunta${dueCount === 1 ? "" : "s"} pendiente${dueCount === 1 ? "" : "s"} de repasar.</p>
        </button>
        <button class="mode-card" data-action="go-config" data-mode="express">
          <h3>Modo Exprés</h3>
          <p class="muted">Sesión de duración fija: 15, 30 o 60 minutos.</p>
        </button>
        <button class="mode-card" data-action="go-config" data-mode="training">
          <h3>Entrenamiento</h3>
          <p class="muted">${modesApi.training.countFor("Todas")} preguntas nuevas con explicación resuelta. No son del ICFES.</p>
        </button>
      </div>
      <button class="btn btn-secondary btn-block" data-action="go-progress" style="margin-top:16px;">Ver progreso</button>
      <p class="muted" style="margin-top:12px;">
        ${sessionsCount} sesión${sessionsCount === 1 ? "" : "es"} guardada${sessionsCount === 1 ? "" : "s"} en este navegador.
      </p>
    `;
  }

  // ---------- pantalla: configuración de modo ----------

  function startModeConfig(modeId) {
    let config = {};
    if (modeId === "practice") config = { moduleId: "RC", competencia: "" };
    else if (modeId === "simulation") config = { moduleId: "RC" };
    else if (modeId === "review") config = { moduleFilter: "" };
    else if (modeId === "express") config = { durationMinutes: 15, modules: ["RC", "LC", "CC", "IN"], sources: ["oficial"] };
    else if (modeId === "training") config = { moduleId: "Todas", competencia: "" };
    state = { screen: "modeConfig", modeId, config };
    render();
  }

  function renderModeConfig() {
    const titleMap = { practice: "Práctica libre", simulation: "Simulacro", review: "Repaso", express: "Modo Exprés", training: "Entrenamiento" };
    let body = "";
    if (state.modeId === "practice") body = renderPracticeConfig();
    else if (state.modeId === "simulation") body = renderSimulationConfig();
    else if (state.modeId === "review") body = renderReviewConfig();
    else if (state.modeId === "express") body = renderExpressConfig();
    else if (state.modeId === "training") body = renderTrainingConfig();
    return `
      <button class="link-btn" data-action="go-home">&larr; Volver</button>
      <h2>${titleMap[state.modeId]}</h2>
      ${body}
    `;
  }

  function moduleSelectOptions(selectedId) {
    return modules.map((m) => `<option value="${m.id}" ${m.id === selectedId ? "selected" : ""}>${m.name}</option>`).join("");
  }

  function renderPracticeConfig() {
    const meta = moduleMeta(state.config.moduleId);
    let extra;
    if (meta.kind === "essay") {
      extra = `<p class="muted">Ensayo argumentativo con el esquema real: 10 min de planeación + 30 min de escritura.</p>`;
    } else {
      const comps = modesApi.practice.listCompetencias(state.config.moduleId);
      const opts = [`<option value="">Todas las competencias</option>`]
        .concat(comps.map((c) => `<option value="${c}" ${c === state.config.competencia ? "selected" : ""}>${c}</option>`))
        .join("");
      extra = `<div class="field"><label>Competencia (opcional)</label><select data-field="competencia">${opts}</select></div>`;
    }
    return `
      <div class="card">
        <div class="field"><label>Módulo</label><select data-field="moduleId">${moduleSelectOptions(state.config.moduleId)}</select></div>
        ${extra}
        <button class="btn btn-block" data-action="start-session">Comenzar</button>
      </div>
    `;
  }

  function renderSimulationConfig() {
    return `
      <div class="card">
        <div class="field"><label>Módulo</label><select data-field="moduleId">${moduleSelectOptions(state.config.moduleId)}</select></div>
        <p class="muted">Se corren todas las preguntas de ese módulo al ritmo objetivo, sin pausas ni volver atrás.</p>
        <button class="btn btn-block" data-action="start-session">Comenzar simulacro</button>
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
        <div class="field"><label>Módulo</label><select data-field="moduleFilter">${options}</select></div>
        <p class="muted">${dueNow} pregunta${dueNow === 1 ? "" : "s"} pendiente${dueNow === 1 ? "" : "s"} con este filtro.</p>
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
        session = modesApi.practice.start({ moduleId: state.config.moduleId, competencia: state.config.competencia || undefined });
      } else if (state.modeId === "simulation") {
        session = modesApi.simulation.start({ moduleId: state.config.moduleId });
      } else if (state.modeId === "review") {
        session = modesApi.review.start({ moduleFilter: state.config.moduleFilter || null });
        if (!session) { showMessage("No hay preguntas pendientes de repaso con ese filtro."); return; }
      } else if (state.modeId === "express") {
        session = modesApi.express.start({ durationMinutes: Number(state.config.durationMinutes), modules: state.config.modules, sources: state.config.sources });
      } else if (state.modeId === "training") {
        session = modesApi.training.start({ moduleId: state.config.moduleId, competencia: state.config.competencia || undefined });
      }
      state.session = session;
      state.answered = false;
      state.lastAnswer = null;
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
      return `<button class="${cls}" data-action="select-option" data-value="${opt.key}" ${disabled}>${escapeHtml(opt.key)}. ${escapeHtml(opt.text)}</button>`;
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

    return `
      <div class="top-actions"><button class="link-btn" data-action="finish-session">Terminar sesión</button></div>
      <div class="timer-bar">
        <span class="pill" style="background:${meta.color}">${meta.name}</span>
        ${q.generated ? `<span class="pill pill-warn" title="Pregunta escrita para este proyecto, no tomada de un cuadernillo del ICFES">No oficial</span>` : ""}
        <span class="timer-chip fast" id="question-timer">${fmtMs(engine.getElapsedForCurrentQuestionMs(session))}</span>
        ${totalTimerHtml}
      </div>
      ${context ? renderContext(context) : ""}
      <p class="prompt">${escapeHtml(q.prompt)}</p>
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

    return `
      <h2>Resultados</h2>
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

    const rowsHtml = sessions.slice().reverse().map((s) => {
      const date = new Date(s.startedAt);
      const dateStr = `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
      if (s.answers) {
        const summary = statsApi.summarizeSession(s);
        const areaLabel = s.areaFilter || s.moduleFilter || "Mezcla";
        return `<tr><td>${dateStr}</td><td>${s.mode}</td><td>${escapeHtml(areaLabel)}</td><td>${fmtPercent(summary.overall.accuracy)}</td><td>${fmtMs(summary.overall.avgMs)}</td></tr>`;
      }
      return `<tr><td>${dateStr}</td><td>${s.mode}</td><td>CE</td><td>—</td><td>${s.essay.wordCount} palabras</td></tr>`;
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
    if (action === "go-config") startModeConfig(actionEl.dataset.mode);
    else if (action === "go-home") { state = { screen: "home" }; render(); }
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
  }

  function init() {
    root = document.getElementById("app");
    root.addEventListener("click", handleClick);
    root.addEventListener("change", handleChange);
    root.addEventListener("input", handleInput);
    render();
  }

  return { init };
})();

document.addEventListener("DOMContentLoaded", function () {
  window.SESP.ui.init();
});
