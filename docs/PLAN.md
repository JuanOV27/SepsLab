# Plan: Software de práctica para las Pruebas Saber Pro

## Contexto y objetivo

El usuario necesita un software local para practicar preguntas tipo Saber Pro. Los requisitos, en orden de importancia:

1. **Medir y evaluar** el desempeño del usuario (precisión, progreso en el tiempo).
2. **Mejorar la velocidad de respuesta**: en el examen real hay ~1-2 minutos por pregunta, así que ese es el cuello de botella a entrenar, no solo el conocimiento.
3. **Preguntas 100% reales**, sacadas de bancos oficiales del ICFES — nunca inventadas por el modelo.
4. **Feedback al final de cada sesión**: velocidad de respuesta, aspectos a mejorar, y tips concretos.

No es un proyecto de código existente: se construye desde cero en `C:\Users\jdort\Documents\SESP`.

## Investigación realizada (completa y verificada)

### Estructura oficial del examen
Fuente: *Guía de orientación del Examen Saber Pro, Aplicación 2026-1* (ICFES).

- 5 módulos de **competencias genéricas**, obligatorios para todos: **Razonamiento Cuantitativo (RC)**, **Lectura Crítica (LC)**, **Competencias Ciudadanas (CC)**, **Comunicación Escrita (CE)**, **Inglés (IN)**.
- Sesión de módulos genéricos: **4 horas 40 minutos** en total (más tiempo adicional si el evaluado tiene módulos específicos: +1h15 por cada uno, hasta 3).
- Formato: selección múltiple con única respuesta (A-D) en RC/LC/CC/IN. **CE es distinto**: una tarea de escritura de un texto argumentativo (10 min para organizar ideas + 30 min para escribir).
- Puntaje: escala 0-300 por módulo (sin decimales). Puntaje Global (PG) = promedio aritmético de los 5 módulos (o de 4 si el evaluado está exento de inglés).

### Competencias evaluadas por módulo

- **RC** — Interpretación y representación (33%), Formulación y ejecución (33%), Argumentación (34%). Contenidos transversales: Estadística, Geometría, Álgebra y cálculo. Contextos: familiar/personal, laboral, divulgación científica, comunitario/social.
- **LC** — Identifica contenidos locales (26%), Comprende articulación y sentido global (40%), Reflexiona y evalúa el contenido (34%). Textos continuos/discontinuos, literarios/informativos (descriptivo, expositivo, argumentativo), máx. 500 palabras por texto.
- **CC** — Conocimientos (30%), Argumentación (20%), Multiperspectivismo (30%), Pensamiento sistémico (20%).
- **CE** — Se califica el planteamiento, la organización del texto y la forma de expresión.
- **IN** — 7 partes alineadas al Marco Común Europeo (MCER/CEFR, 4 niveles de desempeño). % de preguntas por parte: 11, 11, 11, 18, 16, 11, 22.

### Bancos de preguntas reales usados (fuente: cuadernillos oficiales ICFES 2018, uso académico autorizado explícitamente por el ICFES)

| Módulo | Preguntas reales capturadas | Notas |
|---|---|---|
| RC | 25 (Q1-Q25 completas) | Con contextos (tablas/gráficos) y clave de respuestas verificada. ✅ `questions.rc.js` escrito |
| LC | 25 (Q1-Q14, Q16-Q26; 25 de 26) | ✅ `questions.lc.js` escrito. Q12 ("Mafalda") transcrita leyendo únicamente la página 11 del PDF original (verificada segura). Q15 excluida por contenido sensible (pasaje real sobre trata de personas, ver sección "Manejo de bloqueos" abajo) |
| CC | 25 (Q1-Q25 completas) | Clave verificada cruzando dos extracciones distintas del PDF. ✅ `questions.cc.js` escrito (incluye temas sensibles "normales" — violencia de género, narcotráfico, discriminación, religión — sin ningún bloqueo) |
| IN | 25 (Partes 2, 3, 4 y 5 completas: 5+5+8+7) | Nota vieja de este archivo decía que la Parte 4 (cloze) se excluía por pérdida del párrafo base — quedó resuelto en una revisión posterior y las 4 partes están completas. ✅ `questions.in.js` escrito |
| CE | 2 temas de ensayo argumentativo completos | Sin clave (se califica por rúbrica: planteamiento / organización / forma de expresión), no por respuesta correcta. ✅ `questions.ce.js` escrito |

Cada pregunta en el banco de datos queda etiquetada con: módulo, competencia oficial, número original en el cuadernillo, y URL fuente — para trazabilidad total y para poder citar el origen dentro de la propia app.

### Métodos de estudio / velocidad de respuesta (investigación general aplicada al diseño)

- Practicar con cronómetro visible entrena el manejo del tiempo tanto como el contenido.
- Técnica de eliminación de opciones evidentemente incorrectas para decidir más rápido.
- Orden estratégico: responder primero lo fácil, marcar y volver después a lo difícil.
- Leer la pregunta completa (no saltar a las opciones) identificando palabras clave.
- Conocer de antemano el sistema de puntuación reduce ansiedad y mejora el ritmo real.

## Arquitectura del software (decidida)

App **web estática local** en HTML/CSS/JavaScript puro — **sin Node, sin Python, sin build**, porque la máquina no tiene esas herramientas disponibles y, de todas formas, no hacen falta para este alcance. Se abre `app/index.html` directamente en el navegador. El progreso se guarda entre sesiones con `localStorage` (por eso hay que abrir siempre el mismo archivo, no copias).

```
SESP/
  app/
    data/                     Bancos de preguntas reales (namespace window.SESP.data)
      questions.rc.js         ✅ escrito (25 preguntas)
      questions.lc.js         ✅ escrito (25 de 26 preguntas; Q15 excluida por contenido sensible)
      questions.cc.js         ✅ escrito (25 preguntas)
      questions.in.js         ✅ escrito (25 preguntas)
      questions.ce.js         ✅ escrito (2 temas de ensayo)
      modules.js              pendiente — metadata: nombre, color, tiempo objetivo por pregunta
    core/                     Motor de la app, sin UI
      storage.js              historial de sesiones + registro de errores en localStorage
      engine.js               máquina de estados de una sesión: pregunta actual, cronómetro, respuestas
      stats.js                cálculo de métricas de velocidad/precisión + generador de tips
    modes/
      practice.js             práctica libre por módulo/competencia, cronómetro informativo
      simulation.js           simulacro cronometrado al ritmo real del examen
      review.js                repaso de preguntas falladas o respondidas lento
      express.js               modo exprés: sesión de duración fija (15/30/60 min), mezcla de áreas o filtrada a una sola
    ui/
      styles.css
      app.js                  render de pantallas: inicio, pregunta, dashboard de resultados
    index.html                punto de entrada; carga todo con <script> (nada de fetch, para evitar problemas de CORS con file://)
  docs/
    PLAN.md                   este documento
    FUENTES.md                cita completa de cada cuadernillo/guía usado (pendiente)
  data-source/                carpetas de staging por módulo, ya no se usan (las preguntas viven directo en app/data)
```

## Sistema de medición de velocidad (el foco principal del pedido)

- Cronómetro visible por pregunta, cuenta hacia arriba y cambia de color al acercarse/superar el tiempo objetivo del módulo.
- Tiempo objetivo configurable por módulo (por defecto ~90-100 s en RC/LC/CC/IN; CE usa el esquema real de 10+30 min).
- Por cada respuesta se registra: tiempo en milisegundos, si fue correcta, módulo, competencia.
- Clasificación automática de cada pregunta respondida:
  - Rápida y correcta → dominio real.
  - Rápida pero incorrecta → posible descuido/afán.
  - Lenta pero correcta → sabe el tema, falta fluidez.
  - Lenta e incorrecta → vacío de contenido, prioridad de estudio.

## Reporte al final de cada sesión

- Precisión global y desglosada por competencia y por módulo.
- Tiempo promedio y mediana de respuesta vs. el objetivo, con tendencia respecto a sesiones anteriores.
- Las preguntas más lentas y más rápidas de la sesión.
- Tips generados por reglas simples (no IA en vivo) según el patrón detectado — por ejemplo: "en Lectura Crítica superas el tiempo objetivo en textos largos: practica lectura selectiva de la idea principal por párrafo antes de mirar las opciones."

## Modos de uso

1. **Práctica libre** — elegir módulo/competencia específica, sin presión estricta de tiempo.
2. **Simulacro cronometrado** — simula el ritmo real del examen, sin pausas.
3. **Repaso de errores** — cola de preguntas falladas o lentas, estilo repetición espaciada simple.
4. **Modo Exprés** — sesión de duración fija (15/30/60 min), con preguntas mezcladas de todas las áreas o filtradas a una sola. Ver detalle abajo.

## Modo Exprés — diseño detallado

Cuarto modo (`modes/express.js`), pensado para sesiones cortas y acotadas en el tiempo — a diferencia de Práctica libre (sin límite) y Simulacro (reproduce la duración completa del examen real).

**Configuración al iniciar:**
- Duración: 15, 30 o 60 minutos.
- Área: "Todas" (mezcla RC, LC, CC, IN) o una específica (RC, LC, CC, IN, CE).

**Selección de preguntas — extracción dinámica por tiempo:**
Se arma una cola barajada del banco filtrado. Tras cada respuesta se compara el tiempo total transcurrido contra la duración elegida:
- Si ya se cumplió, la sesión cierra al terminar esa pregunta (no corta a la mitad).
- Si se agota el banco filtrado antes de tiempo (p. ej. IN solo tiene 17 preguntas), se rebaraja el mismo banco evitando repetir la pregunta inmediatamente anterior, y se continúa.
- El usuario puede terminar la sesión antes voluntariamente ("Terminar sesión").

Se descartó armar una cola de tamaño fijo estimado (duración ÷ tiempo objetivo del módulo): si el usuario va más lento de lo estimado, la sesión se alargaría más allá del bloque de tiempo elegido, rompiendo el propósito central del modo.

**Caso especial CE:** CE (ensayo, sin opción múltiple) solo aparece cuando el área filtrada es exactamente CE, nunca mezclado con las demás. Se toma un tema aleatorio del banco de ensayos. Si la duración elegida es 60 min, se usa el formato real completo (10 min planeación + 30 min escritura = 40 min; la sesión termina ahí, sin necesidad de agotar los 60). Si es 15 o 30 min, el tiempo se escala manteniendo la proporción real 25% planeación / 75% escritura, redondeando la planeación al minuto más cercano: 15 min → 4+11, 30 min → 8+22. El reporte final de una sesión CE no tiene correcto/incorrecto (se califica por rúbrica): muestra tiempo usado y palabras escritas, con la rúbrica como guía — este comportamiento no es exclusivo de Exprés, aplica a CE en cualquier modo.

**Impacto en el resto del motor (aún sin escribir):**
- `core/engine.js` — necesita soportar un límite de tiempo total de sesión, opcional (lo usa exprés; los demás modos lo dejan vacío).
- `core/storage.js` — cada sesión guardada añade `mode` (`practice`/`simulation`/`review`/`express`) y, si es exprés, `durationMinutes` + `areaFilter`.
- `core/stats.js` — cuando área="Todas", el reporte usa el desglose por módulo/competencia ya planeado en el reporte general.
- `ui/app.js` — pantalla de inicio con selector de duración + área; contador regresivo del tiempo total visible durante toda la sesión, además del cronómetro por pregunta.
- `data/modules.js` — sin cambios de esquema; sigue siendo solo metadata de presentación (nombre, color, tiempo objetivo por pregunta).

## Manejo de bloqueos de seguridad de contenido (IMPORTANTE — leer antes de tocar LC)

Contexto para cualquier sesión/agente que retome este proyecto, sobre todo el módulo LC:

**Qué pasó:** al procesar el cuadernillo oficial de Lectura Crítica, la pregunta 15 se basa en un pasaje periodístico real sobre trata de personas que incluye el relato en primera persona de una adolescente víctima de explotación sexual por una red de trata. Al intentar leer/transcribir esa parte del PDF (incluso en un subagente aislado, con instrucciones explícitas de NO citarla y solo anotarla y saltarla), la respuesta fue bloqueada por el filtro de contenido de la plataforma (`API Error: 400 Output blocked by content filtering policy`).

**Conclusión validada con evidencia de este mismo proyecto:**
- Los temas sensibles "normales" de una prueba de competencias ciudadanas — violencia de género, narcotráfico, discriminación religiosa/racial/regional, derechos LGBT, pena de muerte, aborto de poderes del Estado, etc. — **no bloquean nada**. Prueba de ello: `app/data/questions.cc.js` tiene las 25 preguntas completas, varias sobre esos temas exactos, escritas sin ningún problema por un subagente en segundo plano.
- El límite real y no negociable es contenido que describe explotación sexual de menores (aunque sea una cita periodística real y de uso educativo legítimo autorizado por ICFES). Esto se bloquea a nivel de la API misma (error 400), no es un rechazo conversacional del modelo que se pueda persuadir reformulando el mensaje. **No sirve insistir, reformular, ni pedir "solo un resumen neutral" — el bloqueo ocurre aunque la instrucción explícita sea no citar ni describir el contenido.**
- Si una sesión de chat queda con ese contenido en su historial, los turnos siguientes de esa misma conversación pueden seguir bloqueándose aunque el mensaje nuevo sea inocuo. Si eso pasa, no sigas insistiendo en la misma conversación — es mejor continuar en una sesión nueva o delegar la tarea puntual a un subagente aislado.

**Cómo continuar LC sin repetir el bloqueo:**
1. El PDF ya está descargado localmente en `data-source/lc-2018/cuadernillo-lc-2018-icfes.pdf` (fuente: https://www.icfes.gov.co/wp-content/uploads/2024/12/01_02_Cuadernillo_de_preguntas_Lectura_Critica-_Saber-Pro.pdf, 19 páginas) — no hace falta volver a descargarlo.
2. **Mapa de páginas ya localizado con `pdftotext` local (sin exponer el contenido sensible a ningún modelo — solo se miraron conteos de caracteres y coincidencias de palabras sueltas):**
   - Preguntas 1-2 → página 5; 3-4 → pág. 6; 5-6 → pág. 7; 7 → pág. 8; 8-9 → pág. 9; 10-11 → pág. 10; **12 (Mafalda, cómic) → pág. 11** (segura, sin coincidencias de términos sensibles); 13-14 → pág. 12 (segura); **15 → pág. 13 — ESTA es la página con el pasaje explícito (alta concentración de términos como "adolescente", "prostitución" x4, "proxenetismo" x2). NO ABRIR/RENDERIZAR ESTA PÁGINA BAJO NINGUNA CIRCUNSTANCIA**; 16-17 → pág. 14; 18-20 → pág. 15; 21-23 → pág. 16; 24-26 → pág. 17; clave de respuestas probablemente en pág. 18 o 19.
   - Páginas 2-4 (antes de Q1) mencionan trata/explotación de forma general (probablemente la introducción temática del cuadernillo) — sin problema, es tratamiento general/estadístico, igual que los temas de narcotráfico/violencia de género que ya están en `questions.cc.js` sin bloqueo.
3. Transcribe normalmente las preguntas 1-14 leyendo páginas 1-12, y las preguntas 16-26 leyendo páginas 14-19 en una segunda llamada — **saltando la página 13 por completo, sin incluirla en ningún rango de lectura.** Q12 "Mafalda" se lee directo de la imagen de la página 11, sin problema.
4. Deja la pregunta 15 fuera del archivo de datos por completo. En el comentario de cabecera de `questions.lc.js` (mismo estilo que `questions.cc.js`), agrega una línea neutra: `// Se excluye la pregunta 15 del cuadernillo original: pasaje periodístico real sobre trata de personas, considerado sensible para este banco de preguntas.` Sin más detalle.
5. Si por algún motivo el bloqueo vuelve a aparecer en páginas distintas a la 15, trátalo igual: no insistas, documenta la exclusión con una nota neutra de una línea (mismo patrón ya usado para el cloze de IN Parte 4), y sigue adelante. El objetivo del proyecto nunca requirió el 100 % de las preguntas originales, solo preguntas 100 % reales y verificadas de las que sí se pudieron recuperar.
6. Esquema de datos a seguir: ver `app/data/questions.rc.js` (usa `contexts` compartidos entre preguntas — el patrón que aplica a LC, ya que varias preguntas comparten un mismo texto base) y `app/data/questions.cc.js` (preguntas autocontenidas, para referencia de formato de objeto).

## Estado actual

- [x] Investigación de estructura del examen y competencias (ICFES, guía oficial 2026-1)
- [x] Investigación de métodos de estudio orientados a velocidad
- [x] Descarga y transcripción verificada de preguntas reales: RC (25), LC (25 de 26), CC (25), IN (25), CE (2 temas)
- [x] `app/data/questions.rc.js` escrito
- [x] `app/data/questions.cc.js` escrito
- [x] `app/data/questions.in.js` escrito
- [x] `app/data/questions.ce.js` escrito
- [x] Diseño del Modo Exprés (duración fija 15/30/60 min, mezcla o filtro por área — ver sección arriba)
- [x] `app/data/questions.lc.js` escrito (25 de 26 preguntas; Q15 excluida por contenido sensible, ver sección "Manejo de bloqueos" arriba)
- [x] Escribir `app/data/modules.js` (metadata de presentación: nombre, color, tiempo objetivo, competencias/pesos oficiales, escalamiento de tiempos de CE para Modo Exprés)
- [x] Escribir el motor (`core/storage.js`, `core/engine.js`, `core/stats.js`) — incluye soporte de límite de tiempo total de sesión para Modo Exprés (`totalTimeLimitMs` / `isTimeUp`). Verificado con un script Node ad-hoc (sesión completa con preguntas reales de CC: clasificación rápida/lenta × correcta/incorrecta, tips generados, cola de repaso) — no forma parte del repo, el proyecto no tiene test runner
- [x] Escribir los modos (`modes/practice.js`, `modes/simulation.js`, `modes/review.js`, `modes/express.js`). Verificado con script Node ad-hoc cubriendo los 4 modos + flujo de ensayo (CE) + rebarajado de Exprés al agotar el banco, con datos reales. Nota de alcance: `simulation.js` corre un módulo completo a la vez al ritmo objetivo (no encadena los 5 módulos genéricos en una sola sesión de 4h40m); no estaba unívocamente especificado en el plan, revisar si se quiere el maratón completo
- [x] Escribir la interfaz (`ui/styles.css`, `ui/app.js`, `index.html`) — incluye pantalla de inicio de Modo Exprés (duración + área) y contador regresivo total
- [x] Probar el flujo completo en el navegador (los 4 modos, incluido CE, con datos reales, usando un servidor estático local solo para la prueba — ver `.claude/launch.json`; la app en sí sigue siendo `file://` sin servidor). Persistencia verificada con recarga real de página. Sin errores de consola
- [x] Escribir `docs/FUENTES.md` con la cita completa de cada documento oficial usado

## Estado del proyecto: funcional de punta a punta

Los 5 módulos, el motor, los 4 modos y la interfaz están completos y probados. `app/index.html` se puede abrir directamente en el navegador. Pendientes opcionales, no bloqueantes: confirmar con el usuario si el Simulacro debería encadenar los 5 módulos en una sola sesión de ~4h40m (ver nota de alcance en `modes/simulation.js`), y decidir si vale la pena reintentar la pregunta 15 de LC más adelante.

## Ronda 2 de mejoras (post-lanzamiento, con feedback de uso real)

- [x] **Corte inmediato de tiempo en Exprés/Simulacro**: si el tiempo se agota con una pregunta sin responder, ya no se deja contestarla — se corta ahí mismo con una pantalla "Se acabó el tiempo" y se va directo a resultados (antes se dejaba terminar esa pregunta, lo cual el usuario no quería). También se corrigió que el conteo regresivo mostrara "0:00" hasta un segundo antes de agotarse realmente (`fmtCountdown` usa `ceil`, no `round`).
- [x] **Tips de `core/stats.js` menos ruidosos con muestras chicas**: el tip de "vas lento en el módulo X" exigía solo un 30% de respuestas lentas sobre el total del módulo, lo que con 3 preguntas alcanzaba con una sola lenta para dispararse — ahora exige mínimo 4 preguntas del módulo y al menos 2 casos lentos reales, no solo un porcentaje inflado por poca muestra.
- [x] **Rediseño visual**: paleta sin azul en el fondo (gris carbón neutro), `color-scheme: dark` para evitar que el navegador re-invierta colores de botones/selects.
- [x] **Pantalla "Ver progreso"**: gráfico de precisión por módulo a través de las sesiones guardadas (para ver mejoría/estancamiento) + tabla de historial completo.
- [x] **Exportar/Importar progreso** (`core/storage.js`: `exportData`/`importData`, botones en la pantalla de Progreso): descarga/carga un `.json` con sesiones + cola de repaso. Al importar, se combina con lo que ya hay (dedup por `startedAt` en sesiones, se queda la entrada más reciente por pregunta en la cola de repaso) — nunca reemplaza ni borra al importar.
- [x] **Modal propio en vez de `alert()`/`confirm()` nativos**: en pruebas se comprobó que los diálogos nativos del navegador podían quedar bloqueados de forma poco fiable en algunos entornos. Se reemplazaron por un modal HTML/CSS propio (`showMessage`/`showConfirm` en `ui/app.js`). De paso se encontró y corrigió un bug real: el callback de confirmación se borraba a sí mismo por el orden en que `showModal()` limpiaba el modal anterior.
- [x] **Imágenes reales del cuadernillo** en las preguntas que las necesitan (antes solo tenían una descripción en texto): 4 en RC (`RC-2018-CTX-02` árbol genealógico, `CTX-04` gráfico de inversión vial, `CTX-07` diagrama de pistas de aterrizaje, `CTX-10` fuente de chocolate) y 3 en LC (`LC-2018-CTX-06` publicidad Tetra Pak, `CTX-07` cómic de Mafalda, `CTX-12` propaganda vintage). Extraídas de los PDFs oficiales con `pdftoppm`/`convert` (recorte manual verificado visualmente por el agente antes de guardar), guardadas en `app/assets/images/` y referenciadas desde cada contexto con `image: { src, alt }`. `ui/app.js` (`renderContext`) y `ui/styles.css` (`.context-image`) ya soportan este campo para cualquier contexto futuro. Ninguna requirió que el usuario tomara capturas manuales; para LC se respetó la restricción de no tocar nunca la página 13 del PDF (ver sección de arriba).

Estructura de archivos actualizada: se agregó `app/assets/images/` (imágenes reales recortadas de los cuadernillos) y `data-source/rc-2018/` (PDF fuente de RC, descargado para la extracción de imágenes, igual que ya existía `data-source/lc-2018/`).
