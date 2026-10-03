// Cálculo de métricas de velocidad/precisión y generador de tips a partir de una sesión.
// Reglas simples, no hay IA en vivo generando el reporte.
window.SESP = window.SESP || {};
window.SESP.core = window.SESP.core || {};

window.SESP.core.stats = (function () {
  // Clasificación de una respuesta: rápida/lenta según targetMs, cruzado con correcto/incorrecto.
  function classify(answer) {
    if (answer.correct == null) return null; // CE u otros tipos sin corrección automática
    const isFast = answer.targetMs == null || answer.timeMs <= answer.targetMs;
    if (isFast && answer.correct) return "rapida-correcta";
    if (isFast && !answer.correct) return "rapida-incorrecta";
    if (!isFast && answer.correct) return "lenta-correcta";
    return "lenta-incorrecta";
  }

  function average(nums) {
    if (!nums.length) return null;
    return nums.reduce((a, b) => a + b, 0) / nums.length;
  }

  function median(nums) {
    if (!nums.length) return null;
    const sorted = nums.slice().sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  }

  function emptyBucket() {
    return {
      total: 0,
      correct: 0,
      times: [],
      classifications: { "rapida-correcta": 0, "rapida-incorrecta": 0, "lenta-correcta": 0, "lenta-incorrecta": 0 },
    };
  }

  function addToBucket(bucket, answer, classification) {
    bucket.total += 1;
    if (answer.correct) bucket.correct += 1;
    bucket.times.push(answer.timeMs);
    if (classification) bucket.classifications[classification] += 1;
  }

  function finalizeBucket(bucket) {
    return {
      total: bucket.total,
      correct: bucket.correct,
      accuracy: bucket.total ? bucket.correct / bucket.total : null,
      avgMs: average(bucket.times),
      medianMs: median(bucket.times),
      classifications: bucket.classifications,
    };
  }

  // Resume una sesión de opción múltiple (practice/simulation/review/exprés no-CE).
  // Desglose por módulo y, dentro de cada módulo, por competencia — evita mezclar
  // competencias de nombre igual entre módulos distintos (p. ej. "Argumentación" en RC y CC).
  function summarizeSession(session) {
    const scored = session.answers.filter((a) => a.correct != null);
    if (!scored.length) {
      return { kind: "single-select", total: 0, overall: finalizeBucket(emptyBucket()), byModule: {}, fastest: [], slowest: [], tips: [] };
    }

    const overallBucket = emptyBucket();
    const byModuleRaw = {};

    scored.forEach((answer) => {
      const classification = classify(answer);
      addToBucket(overallBucket, answer, classification);

      if (!byModuleRaw[answer.module]) byModuleRaw[answer.module] = { bucket: emptyBucket(), byCompetencia: {} };
      addToBucket(byModuleRaw[answer.module].bucket, answer, classification);

      const comp = answer.competencia || "Sin competencia";
      if (!byModuleRaw[answer.module].byCompetencia[comp]) byModuleRaw[answer.module].byCompetencia[comp] = emptyBucket();
      addToBucket(byModuleRaw[answer.module].byCompetencia[comp], answer, classification);
    });

    const byModule = {};
    Object.keys(byModuleRaw).forEach((moduleId) => {
      const byCompetencia = {};
      Object.keys(byModuleRaw[moduleId].byCompetencia).forEach((comp) => {
        byCompetencia[comp] = finalizeBucket(byModuleRaw[moduleId].byCompetencia[comp]);
      });
      byModule[moduleId] = { ...finalizeBucket(byModuleRaw[moduleId].bucket), byCompetencia };
    });

    const bySpeed = scored.slice().sort((a, b) => a.timeMs - b.timeMs);

    const summary = {
      kind: "single-select",
      total: scored.length,
      overall: finalizeBucket(overallBucket),
      byModule: byModule,
      fastest: bySpeed.slice(0, 3),
      slowest: bySpeed.slice(-3).reverse(),
    };

    summary.tips = generateTips(summary);
    return summary;
  }

  // CE se califica por rúbrica, no hay correcto/incorrecto: el reporte muestra
  // tiempo usado y palabras escritas, con la rúbrica como referencia.
  function summarizeEssaySession(session) {
    const essay = session.essay || {};
    return {
      kind: "essay",
      title: essay.title || null,
      planningMsUsed: essay.planningMsUsed || 0,
      writingMsUsed: essay.writingMsUsed || 0,
      planningMsAllotted: essay.planningMsAllotted || null,
      writingMsAllotted: essay.writingMsAllotted || null,
      wordCount: essay.wordCount || 0,
      rubric: essay.rubric || null,
    };
  }

  function generateTips(summary) {
    const tips = [];
    const totalScored = summary.overall.total;
    if (totalScored < 3) return tips; // muestra muy chica para sacar conclusiones fiables

    const c = summary.overall.classifications;

    if (summary.overall.accuracy != null && summary.overall.accuracy < 0.6) {
      tips.push("Tu precisión global está por debajo del 60 %: antes de entrenar velocidad, refuerza contenido en los módulos con más errores.");
    }

    if (c["rapida-incorrecta"] / totalScored > 0.25) {
      tips.push("Tienes bastantes respuestas rápidas pero incorrectas: puede ser afán. Lee la pregunta completa antes de mirar las opciones.");
    }

    if (c["lenta-correcta"] / totalScored > 0.25) {
      tips.push("Varias respuestas correctas te tomaron más tiempo del objetivo: dominas el contenido, pero te falta fluidez — practica con cronómetro visible.");
    }

    if (c["lenta-incorrecta"] / totalScored > 0.2) {
      tips.push("Hay un grupo de preguntas lentas e incorrectas: son la prioridad de estudio, revísalas en el modo Repaso.");
    }

    Object.keys(summary.byModule).forEach((moduleId) => {
      const m = summary.byModule[moduleId];
      if (m.total < 4) return; // muestra muy chica para sacar conclusiones fiables
      const slowCorrectCount = m.classifications["lenta-correcta"];
      // Exige al menos 2 casos reales, no solo una proporción: con muestras chicas una
      // sola respuesta lenta ya cruza cualquier umbral porcentual sin ser un patrón real.
      if (slowCorrectCount >= 2 && slowCorrectCount / m.total > 0.3) {
        tips.push(`En ${moduleId} superas el tiempo objetivo en varias preguntas que sí respondes bien: practica lectura selectiva o eliminación rápida de opciones antes de decidir.`);
      }
    });

    return tips;
  }

  // Compara el tiempo promedio de esta sesión contra sesiones previas ya resumidas.
  function computeTrend(currentSummary, previousSessions) {
    if (!previousSessions || !previousSessions.length) return null;
    const previousSummaries = previousSessions.map(summarizeSession).filter((s) => s.total > 0);
    if (!previousSummaries.length) return null;

    const prevAvg = average(previousSummaries.map((s) => s.overall.avgMs));
    const currAvg = currentSummary.overall.avgMs;
    if (prevAvg == null || currAvg == null) return null;

    return { previousAvgMs: prevAvg, currentAvgMs: currAvg, deltaMs: currAvg - prevAvg };
  }

  return {
    classify,
    summarizeSession,
    summarizeEssaySession,
    generateTips,
    computeTrend,
  };
})();
