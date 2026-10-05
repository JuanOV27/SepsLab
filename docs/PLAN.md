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
      training.js              modo entrenamiento: único que usa el banco propio (no oficial)
    manifest.json              PWA: instalable desde el navegador del teléfono
    ui/
      styles.css
      app.js                  render de pantallas: inicio, pregunta, dashboard de resultados
    index.html                punto de entrada; carga todo con <script> (nada de fetch, para evitar problemas de CORS con file://)
  docs/
    PLAN.md                   este documento
    FUENTES.md                cita completa de cada cuadernillo/guía usado (pendiente)
  data-source/                PDFs originales de los cuadernillos, solo local (ignorados por git):
                             sirven para volver a transcribir o recortar imágenes; no se redistribuyen
  tools/
    auditar.js                verificación de claves contra las tablas oficiales del ICFES +
                             coherencia interna de los bancos (npm run auditar)
  package.json               solo para las herramientas de empaquetado, NO para la app:
                             la app sigue siendo HTML/CSS/JS sin build
  capacitor.config.json      configuración de Capacitor (webDir: app)
  android/                   proyecto nativo de Capacitor (ignora los artefactos y los
                             assets web copiados; se generan con `npm run sync`)
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

## Ronda 3: módulos de competencia específica (Ingeniería de Sistemas)

El usuario necesita saber cuál módulo específico le aplicará en su Saber Pro real. Según el documento oficial "Oferta de combinatorias Saber Pro 2026-2" (ver `docs/FUENTES.md`), el NBC "Ingeniería de sistemas, telemática y afines" solo ofrece tres módulos específicos posibles (combinatoria 49 = los tres; combinatoria 36 = solo los dos primeros; combinatoria 0 = ninguno). En vez de esperar la confirmación, se construyeron los tres bancos completos:

- [x] **`questions.fp.js` — Formulación de Proyectos de Ingeniería** (22 preguntas reales del cuadernillo 2018, 6 con contexto/tabla propia). Competencias y pesos oficiales (40/40/20) verificados contra dos fuentes independientes (marco de referencia + guía de orientación) y contra la tabla de respuestas del propio cuadernillo.
- [x] **`questions.ds.js` — Diseño de Software** (25 preguntas reales del cuadernillo 2018, 8 contextos — 1 caso compartido TPMENS/TENSOFT para Q1-8, 1 caso compartido WebGallery para Q23-25, y 6 diagramas UML/mockups de una sola pregunta cada uno: estructura de módulos, mockups de interfaz, diagrama de clases+secuencia, patrón Observador, diagramas de dominio, diagramas de casos de uso). Las 6 imágenes de diagramas se recortaron de `data-source/ds-2018/` con el mismo método que RC/LC. No hay pesos oficiales publicados por competencia para este módulo (ver `docs/FUENTES.md`); se usó un reparto igualitario propio, documentado como tal en el código.
- [x] **`questions.pc.js` — Pensamiento Científico, núcleo común** (24 preguntas). Nota importante de alcance: el único cuadernillo de práctica que ICFES publica para este módulo cubre el **núcleo común** (24 de las 25 preguntas comunes a las 5 áreas posibles), no el núcleo específico de Matemáticas y Estadística — ICFES no publica cuadernillo de práctica para ningún núcleo específico. Se intentó primero con el cuadernillo 2018 (mismo hallazgo) y luego con el 2026 que dio el usuario (contenido distinto, mismo problema de alcance); de las 24 preguntas del cuadernillo 2026, 7 necesitaron la gráfica/diagrama original (no se pueden resolver de forma justa solo con texto sin arriesgarse a revelar o malinterpretar la respuesta) y se recortaron como imágenes reales, igual que en RC/LC/DS.

**Nota técnica**: el PDF del cuadernillo de Pensamiento Científico 2026 no es extraíble con `pdftotext` (el texto está incrustado sin mapa a Unicode); las 24 preguntas se transcribieron leyendo visualmente cada página renderizada con `pdftoppm`, no copiando texto. Las respuestas y competencias de los tres módulos se verificaron contra la tabla de respuestas oficial de cada cuadernillo.

Integración completa: los 3 módulos están dados de alta en `app/data/modules.js` (colores `#0d9488`/`#db2777`/`#65a30d`, sin colisión con los 5 genéricos) y cargados en `app/index.html`. Probado en navegador real: los 8 módulos aparecen en el selector de Practice, las preguntas con imagen (verificado con PC) renderizan la imagen real sin romperse, y una verificación automatizada confirmó que las 13 imágenes del proyecto (7 de RC/LC + 6 de DS + 7 de PC — el total incluye las de rondas anteriores) responden 200 sin ninguna rota.

Pendiente del usuario: confirmar en su citación de ICFES (o con el director de programa) cuál de los tres módulos específicos le aplica realmente, para priorizar la práctica.

## Ronda 4: Modo Entrenamiento (banco propio, no oficial)

El problema que motivó esta ronda lo describió el usuario así: *"las preguntas que se repiten las respondo más rápido, porque ya sé la respuesta"*. Con el examen el 2026-10-18 y los bancos oficiales de RC/LC/CC/IN ya recorridos varias veces, repetirlos mide memoria, no competencia. Los módulos específicos (FP/DS/PC, 71 preguntas) sí estaban sin usar, pero son 1 de 5 módulos del examen; los genéricos son 4 de 5.

- [x] **`app/data/questions.gen.{rc,lc,cc,in,ce}.js` — banco propio de 130 ítems** (30 preguntas de opción múltiple de RC, 30 de LC, 30 de CC y 35 de IN, más 5 temas de ensayo argumentativo para CE), redactados imitando formato, nivel, competencias y tipos de contexto de los cuadernillos oficiales. Contextos nuevos: tablas de datos, pasajes de lectura, cloze de inglés, texto discontinuo publicitario y un ejercicio de emparejamiento de vocabulario A-H con wordBank. Los pasajes de LC son textos originales, no fragmentos de obras de terceros.
- [x] **Cada pregunta trae `explanation`** con el razonamiento resuelto, incluido por qué falla cada distractor. Esto es lo que los cuadernillos del ICFES no publican, y es la diferencia entre fallar y aprender algo al fallar.
- [x] **`app/modes/training.js` — Modo Entrenamiento**, con filtro por módulo y por competencia. Solo este modo toca el banco generado.
- [x] **Separación estricta del material oficial**: el banco vive en `window.SESP.data.questions.GEN`, cada pregunta lleva `generated: true`, y en pantalla aparece el distintivo "No oficial". Verificado en navegador: Práctica, Simulacro y Exprés devuelven **cero** preguntas generadas en sus colas.

**Decisión de diseño — por qué la clave `GEN` y no un banco por módulo**: `engine.findQuestionById()` resuelve el banco a partir del prefijo del id (`"RC-2018-Q01".split("-")[0]`). Dándole a las preguntas generadas ids con prefijo `GEN-` (p. ej. `GEN-RC-Q04`) quedan en su propio banco sin tocar el motor, pero conservan `module: "RC"`, así que los cronómetros objetivo, las estadísticas por módulo y la cola de repaso siguen funcionando sin cambios. Verificado: una pregunta generada fallada entra a la cola de repaso bajo RC y el Modo Repaso la resuelve correctamente.

**Balance de la clave de respuesta**: el primer borrador salió con 31 de 60 respuestas en "B" y una sola en "D" — un banco así entrena a adivinar la letra. Se rebalanceó a 15/15/15/15 reordenando los textos de las opciones y reescribiendo las referencias por letra dentro de cada explicación. El primer intento de rebalanceo produjo un ciclo perfecto (`BCDABCDABCD…`), aún más adivinable que el sesgo original, así que el reparto final es aleatorio con semilla fija y rechaza explícitamente rachas de tres y pasos constantes. Quedaron fuera del reordenamiento las preguntas con opciones numéricas o de magnitud creciente (el orden ascendente es la convención del examen) y las que se refieren a los "planes A/B/C" de su propio contexto. (El banco creció después a 130 ítems; el reparto actual por módulo está entre 6 y 9 respuestas por letra, ver `docs/FUENTES.md`.)

Pendiente, para rondas siguientes (las otras dos opciones que pidió el usuario y que esta ronda dejó para después):
- Buscar bancos no oficiales de terceros y explicaciones de docentes en video. Se despriorizó: calidad no verificable y costo alto de extracción frente al tiempo que queda antes del examen.
- Sección de estudio/afianzamiento previo en el menú principal (videos, enlaces, documentos y texto, clasificados por área). Es el contenedor natural de lo que salga del punto anterior.

## Ronda 5: auditoría de datos y explicaciones

El banco oficial ya estaba recorrido varias veces, pero nadie lo había **verificado** contra las tablas de respuestas de los cuadernillos, ni contra las tablas y gráficas que el motor usa para resolver las preguntas. Dos riesgos distintos: una clave mal transcrita (el estudiante falla siempre la misma pregunta y no sabe por qué) y un dato de contexto corrido (la pregunta se vuelve irresoluble y el estudiante que la "acierta" la adivinó).

### Verificación de claves contra los PDF oficiales

Se transcribió la sección "Información de cada pregunta" (RC, LC, CC, IN, FP, DS) y "Tabla de respuestas correctas" (PC 2026) de cada cuadernillo y se comparó posición por posición contra `correctOption` en los bancos. Resultado: **171 preguntas de opción múltiple, 0 discrepancias**. La única posición ausente es LC 15, la excluida por contenido sensible. También se contrastaron las competencias de RC y PC contra la misma tabla.

### Errores de transcripción encontrados y corregidos (RC)

Eran reales y afectaban la resolubilidad de las preguntas, no solo la clave:

- **Tabla de clases de pilates**: los costos iban corridos una fila (1→280.000, 2→384.000… cuando el cuadernillo dice 2→280.000, 3→384.000, 4→480.000). Con la tabla corrida, la pregunta 8 daba dos respuestas posibles. Además faltaba por completo el horario que la pregunta 9 necesita: se extrajo como imagen real `RC-2018-CTX-03.png` desde la página 7 del PDF. Verificado por análisis píxel a píxel de la imagen contra el PDF: lunes 4 horas libres, martes a viernes 5, sábado 6; 17 libres en la mañana y 13 en la tarde, que es exactamente lo que afirma la explicación de la pregunta 9.
- **Gráfica de inversión vial**: los años estaban desordenados, lo que invalidaba la pregunta 10. Orden correcto: 135,10 (1996), 109,68, 110,95, 108,96, 166,36 (2000), 195,77, 194,39.
- **Tabla de las cinco aves**: filas desplazadas y columnas de las aves 2 a 4 revueltas. Verificada contra la página 10 del cuadernillo, celda por celda.
- **Tres claves** que no correspondían a la tabla oficial.

LC, FP y DS quedaron sin cambios: sus claves y competencias ya coincidían con el PDF.

### Explicaciones de las 171 preguntas oficiales (`app/data/explanations.js`)

El ICFES publica la clave pero no el razonamiento, así que reintentar una pregunta solo entrena memoria. Las explicaciones viven en un archivo aparte, no dentro de `questions.*.js`, para no mezclar transcripción oficial con análisis propio. Se muestran en dos lugares, y solo en dos: **Modo Entrenamiento** (siempre) y **Modo Repaso** (solo al fallar, porque llegar a Repaso ya significa haberla fallado antes). Simulacro y Exprés no las muestran, para no romper la simulación del examen.

Cuando la clave oficial no coincide con la opción que el razonamiento obtiene (RC 18 y PC 17, PC 20), la explicación dice explícitamente qué dice la clave y cuál es el argumento técnico, en vez de inventar una justificación para que cuadren. Queda escrito en la explicación que el método general es el que se repite en el examen.

### Auditoría del banco propio con subagentes

Las 125 preguntas de opción múltiple del banco de entrenamiento se repartieron entre cuatro subagentes, uno por módulo, con la instrucción de resolver cada pregunta por cuenta propia y no fiar de la explicación. Salieron 3 problemas graves y 12 menores; todos corregidos:

- **Doble respuesta válida** (grave, es el fallo que más confunde): GEN-RC-Q03, donde el distractor D también era cierto; GEN-CC-Q17, donde tutela y habeas corpus eran ambos defendibles (se reescribió para pedir el mecanismo *específico*); GEN-IN-Q06, un diálogo en el que un pasajero "abre la ventana" y la opción C era una negativa perfectamente válida (se reemplazó por un ejercicio donde los distractores responden a otra pregunta).
- **Distractor duplicado**: en GEN-RC-Q22 las opciones C y D eran la misma expresión matemática.
- **Enunciado mal planteado**: GEN-RC-Q08 ("¿a partir de qué consumo…?" con opciones "más de 40/45/55 GB", donde tres eran ciertas) se reformuló como "menor consumo a partir del cual".
- **Atribución legal incorrecta**: GEN-CC-Q18 daba por bueno un cabildo abierto sobre "un proyecto" cuando el parágrafo del artículo 23 de la Ley 1757 de 2015 prohíbe expresamente presentar iniciativas de ordenanza, acuerdo o resolución local en ese mecanismo. Se ajustó el enunciado a una obra y se documentó el límite en la explicación. En GEN-CC-Q14 se corrigió la atribución de la gradualidad de la sanción a la Ley 1620 de 2013 (la ley crea la ruta de atención; la gradualidad la impone la jurisprudencia).
- **Errores en las explicaciones** (no en las claves): referencias cruzadas a las letras de las opciones, un "Me neither" que no existe en inglés, un calco del español ("transport stations"), atribuciones equivocadas del error que produce cada distractor y un conteo ("repite tres veces" en vez de cuatro).
- **Falta de cobertura**: el banco propio no tenía ningún ejercicio de emparejamiento A-H, que es el formato real de la Parte 2 de Inglés (11 % del módulo). Se añadió `GEN-IN-CTX-05` con wordBank de ocho palabras y cinco ítems, con la misma convención del cuadernillo oficial: una palabra usada como ejemplo y dos sin usar.

### Verificación automatizada repetible

Quedó en `tools/auditar.js` (Node, sin dependencias, se corre con `node tools/auditar.js`) un chequeo en dos bloques repetible en cualquier momento. El primero transcribe las tablas de respuestas oficiales de los siete cuadernillos y las compara posición por posición con `correctOption`; el segundo revisa la coherencia interna de todos los bancos: ids únicos y con prefijo coherente con su banco, `correctOption` dentro de las opciones, número de opciones que el examen real usa en cada módulo, competencia registrada en `modules.js`, `contextId` resoluble y coherente con `appliesTo`, imágenes referenciadas que existen en disco y explicaciones presentes, sin huérfanas ni sospechosamente cortas. Sale con código 1 si algo falla.
Resultado actual: **0 discrepancias de clave en 171 preguntas y 0 fallos estructurales en los 303 ítems del proyecto** (173 oficiales + 130 del banco propio). Se comprobó que el script detecta de verdad los errores que dice detectar, mutando a propósito una clave, una competencia y una explicación.

## Ronda 6: versión móvil (rama `phone-version`)

El objetivo declarado era usar la app en el teléfono. La app web ya funcionaba en un navegador móvil, pero eso no es lo mismo que "funcionar con el dedo": se auditó a 320, 360 y 414 px de ancho, con pantalla táctil, sobre las pantallas reales de la app.

### Empaquetado (ya montado en la rama)

Dos vías, ambas sobre los mismos archivos de `app/`:

- **PWA**: `app/manifest.json` + iconos 192/512 y `<link rel="manifest">`. No hay service worker a propósito: durante las pruebas un caché agresivo sirvió código viejo tras cada cambio, y esta app no necesita funcionar sin conexión (los datos son locales, pero el código cambia seguido).
- **APK de Android con Capacitor 8**: proyecto nativo en `android/`, `webDir: app` (no hay paso de build porque la app es HTML/CSS/JS puro).

Flujo: `npm run sync` copia `app/` a `android/app/src/main/assets/public/` y actualiza los plugins; `npm run apk` hace el sync y luego `./gradlew assembleDebug`. El APK sale en `android/app/build/outputs/apk/debug/` (6 MB) y se instala con `adb install -r android/app/build/outputs/apk/debug/app-debug.apk`.

**Hace falta un JDK 21** (el proyecto nativo lo fija: `sourceCompatibility JavaVersion.VERSION_21`). En esta máquina no había ninguno y no hay sudo sin contraseña, así que se instaló uno portable, sin tocar el sistema:

```
curl -sL -o jdk.tar.gz "https://api.adoptium.net/v3/binary/latest/21/ga/linux/x64/jdk/hotspot/normal/eclipse"
tar xzf jdk.tar.gz -C ~/tools          # queda en ~/tools/jdk-21.0.12.1+1
export JAVA_HOME="$HOME/tools/jdk-21.0.12.1+1"
export ANDROID_HOME="$HOME/Android/Sdk"
export PATH="$JAVA_HOME/bin:$ANDROID_HOME/platform-tools:$PATH"
npm run apk
```

El SDK de Android sí estaba en `~/Android/Sdk` (platform 36, build-tools 36). `npm run auditar`, `npm run servidor` y `npx cap sync` no necesitan nada de esto: solo el APK.

### Bugs reales encontrados y corregidos en el móvil

1. **La página se desplazaba de lado al leer una pregunta.** Dos causas distintas, y la segunda no era ninguna tabla:
   - Las tablas de los cuadernillos tienen hasta 7 columnas y no caben en 320 px. Ahora cada tabla va en un contenedor con scroll propio (`.table-scroll`), con la primera columna fija (`position: sticky`) para no perder de vista el nombre de la fila al desplazar. La página ya no se desplaza, solo la tabla.
   - Una palabra larga que no se puede cortar por espacios —la URL de origen de la gráfica de inversión, en el contexto `RC-2018-CTX-04`— desbordaba 537 px. No lo detectaba ningún elemento porque el desbordamiento venía de un nodo de texto, no de una caja: se resolvió con `overflow-wrap: break-word` en `body`.
2. **Al pasar de pregunta se perdía el lugar.** `render()` reemplaza el HTML completo pero no volvía arriba: se leía un pasaje largo hasta el final, se pulsaba "Siguiente" y la pregunta siguiente aparecía a media pantalla. Ahora se vuelve arriba solo cuando cambian la pantalla o la pregunta, nunca en el re-render que pinta el feedback (si no, saltaría mientras se lee la explicación).
3. **Botones demasiado pequeños para el dedo**: "Terminar sesión", "← Volver" y "Borrar historial" medían 27 px de alto; ahora 44 px, el mínimo recomendado.
4. **Los desplegables parecían campos de texto**: `appearance: none` quita la flecha nativa, que además es invisible en modo oscuro. Se dibujó una flecha propia en CSS y el selector del sistema sigue siendo el nativo al tocarlo.
5. **Zoom no deseado del navegador**: `textarea` a 0.95 em (≈15 px) hace que iOS acerque el zoom al enfocar. En móvil los campos van a 16 px.
6. **El área de escritura del ensayo de CE** quedaba en cinco líneas con el teclado abierto; ahora con `min-height: 40vh`.
7. **Exportar progreso no hacía nada dentro del APK.** En el WebView de Android una descarga de un blob no tiene dónde aparecer, así que el botón fallaba en silencio. Ahora, cuando detecta el puente de Capacitor, muestra el JSON en un cuadro de texto para copiarlo; en el navegador sigue descargando el `.json` como antes. Importar sí funciona (el `<input type="file">` abre el selector del sistema).
8. **Crash en el ensayo de CE** que salió al implementar el punto 2: la sesión de ensayo no tiene cola de preguntas y la nueva clave de render la consultaba. Se detecta antes de preguntar.

También: `viewport-fit=cover` (sin él, `env(safe-area-inset-*)` vale 0 y el contenido queda bajo la barra de gestos del notch), `text-size-adjust: 100%`, `touch-action: manipulation`, cronómetro pegado arriba al desplazar un pasaje largo, botones de acción principal a ancho completo, modal con scroll, hoja única de reglas `@media (max-width: 480px)` (antes había tres bloques dispersos) y una segunda para landscape.

### Un problema más que solo aparece en el teléfono real

Con el APK instalado y tocado en el dispositivo salió un fallo que en el emulador no se notaba: al responder una pregunta, el "Correcto/Incorrecto" y el botón "Siguiente" quedan por debajo del borde inferior, porque las cuatro opciones ocupan casi toda la pantalla. Lo único que cambia es el color de la opción, así que la app parece no haber arrancado y no hay ninguna señal de cuál es el siguiente paso. Ahora, al responder, el bloque con el veredicto y el botón se trae a la vista (centrado si cabe; si no, con su parte alta bajo el cronómetro fijo). Solo en móvil: en escritorio el salto distraería y no hace falta. Cuidado con un detalle al implementarlo: "Terminar sesión" de la barra superior también es `data-action="finish-session"`, así que el botón de avanzar es el **último** de los dos; si se coge el primero, el cálculo cree que ya está todo a la vista y no se mueve nada.

### Verificación

Auditoría de maquetación con navegador real a 320, 360 y 414 px: cero scroll horizontal (recorriendo los 303 ítems del proyecto y las 64 pantallas/conjuntos de datos), cero controles por debajo de 32 px, cero errores JS. Los flujos de CE (planeación → escritura → resultados con rúbrica), de Exprés con tiempo agotado, el de progreso con sus modales y el horizontal también se probaron en pantalla táctil. En escritorio (1280 px) se verificó que las tablas siguen entrando sin scroll y que nada cambió de aspecto.

Sobre el teléfono de verdad (TECNO KJ5, Android 13, 720×1612 px): APK compilado e instalado, y probados con el dedo el arranque, el menú de Exprés, el avance entre preguntas, el cronómetro que queda fijo al desplazar, las imágenes de los cuadernillos, los desplegables con su flecha y el desplazamiento lateral de una tabla (la primera columna se queda fija mientras se arrastra). El ajuste del feedback descrito arriba se confirmó en el dispositivo, no solo en el emulador.

`npm run auditar` (la verificación de datos de la ronda 5) sigue pasando sin fallos: los cambios de esta ronda son de presentación y no tocaron ni una clave ni un enunciado.

---

## Ronda 7 — Integrar el trabajo del colaborador

### Por qué una rama aparte y no un "fast forward"

La rama `feature/simulacro-2026-2` de un colaborador sale de `63bd380`, que es la
punta exacta de `main`, y llega en **un solo commit**. Fusionarla sobre `main`
sería técnicamente un `fast-forward` sin conflictos, y eso es justo el problema:
`main` es el estado con la auditoría pasando, y sería sustituido de golpe, sin
revisión. Pero el trabajo móvil (`phone-version`) también sale de `63bd380`, así
que la decisión real era de tres.

Se integró en `integracion-2026-2`: las dos ramas encima de `main`, y sobre eso
los arreglos. El cruce fue de **4 bloques de conflicto en 3 archivos**:

| Archivo | Conflicto | Cómo se resolvió |
|---|---|---|
| `index.html` | `viewport-fit` + manifest frente a fuente e icono | Se conservan ambos |
| `ui/app.js` | Su carrusel frente a mi clave de render | Se conservan ambos |
| `ui/styles.css` | Su bloque de login frente a mi bloque móvil | Son consecutivos: van seguidos |

En `styles.css` su lado terminó sin cerrar el `@media (min-width: 1024px)`: el
corte de git dejó el corchete fuera. Antes de dar por buena la resolución se
contaron las llaves (483 abren, 483 cierran) y se comparó con el final original de
cada rama.

### Lo que sí estaba bien y se quedó

Su CSS es **96 % aditivo** (1935 líneas nuevas, 38 eliminadas): no tiró la base,
la amplió. La accesibilidad es trabajo de verdad: 8 bloques
`prefers-reduced-motion`, modo claro, alto contraste, tamaño de texto y unos 30
atributos ARIA, con `aria-invalid` en los campos del login y `role="alert"` en el
resumen de errores. Y una honestidad que conviene decir en voz alta: sus 44
claves están marcadas `keyStatus: "derived"` y la app le dice al estudiante, en la
pantalla de cada pregunta, que la clave está *pendiente de verificación oficial*.

El "recorrido guiado en 4 pasos con módulo obligatorio" del mensaje de commit
asusta más de lo que es: no es un modal que haya que completar, son cuatro
pastillas decorativas (1 Elige un modo, 2 Configura, 3 Responde, 4 Revisa). No
hay ninguna puerta que cruzar.

### Los cuatro arreglos

**1. El login deja de ser puerta.** Antes, sin sesión en el navegador, `render()`
mandaba a la pantalla de ingreso. Como la sesión es local, eso ponía un
obstáculo delante de cada estudiante para nada: el propio código admite
`cualquier credencial válida entra. Sin servidor`. Ahora se abre directo a la
práctica y la cuenta se pide desde el inicio, con un enlace. Al destaparlo
aparecieron **dos puertas más** que se habían pasado: volver al inicio y el
cierre de la sesión de ensayo elegían entre `home` y `login` según hubiera
cuenta. Y la barra de nivel solo se pinta con sesión, porque los puntos se dan al
entrar y sin cuenta se quedaría en cero para siempre.

**2. Los 130 px de desborde lateral.** Los adornos de fondo del login (los orbes
difuminados) miden 380 px y se cuelgan por fuera del borde, pensados para
pantalla ancha; en un teléfono de 360 empujaban la página 130 px de lado y se veía
el borde de un círculo de luz. Se probaron cinco arreglo y el resultado fue el
contrario de lo que se suponía:

| Arreglo | Desborde |
|---|---|
| nada | 130 px |
| `html { overflow-x: clip }` | 130 px |
| `html { overflow-x: hidden }` | 130 px |
| `body { overflow-x: clip }` | **0 px** |
| `#app { overflow-x: clip }` | **0 px** |

Ni `html` ni `body` alcanzan a los adornos. Se quedó `#app`, y con `clip` y no
`hidden` porque `hidden` convierte el elemento en contenedor de desplazamiento y
el cronómetro pegado arriba dejaría de pegarse. Comprobado: sigue en
`position: sticky` y con `top: 0` tras bajar 500 px.

**3. La fuente, sin red.** El diseño carga Nunito desde Google Fonts, y `main`
no tenía ninguna dependencia externa. Se autoaloja en `app/assets/fonts/`: solo
los subconjuntos latin y latin-ext, que es lo que necesita el español (325 KB), con
la licencia OFL al lado. Así se conserva el diseño y la app arranca sin conexión,
que es justo cuando más se usa.

**4. La auditoría mira el banco nuevo.** Este era el hueco más serio: `tools/auditar.js`
no sabía qué era `s2`, así que sus 45 preguntas **no pasaban por ninguna
comprobación** y el total se quedaba en 303. Ahora hay un bloque 3 que, como el
documento del que salieron no trae clave oficial, no comprueba si las claves son
"correctas" sino lo que sí es comprobable: que estén marcadas como provisionales,
que no se repitan de más y que la app avise al estudiante. El total sube a 348.

También se calló un aviso falso: `logo.png` salía como "imagen que ningún contexto
referencia" cuando sí se usa, porque se pinta desde el código. Ahora se buscan
también las referencias en `ui/app.js`, `index.html` y `styles.css`.

### Lo que queda pendiente, a propósito

- **Las 44 preguntas de S2 no tienen explicación.** Es lo único que la app enseña
  con detalle, y es justo lo que falta. Sale como aviso, no como fallo, y
  deliberadamente: sus claves las resolvió el equipo y el docente todavía no las
  verifica, así que escribir la explicación ahora daría por buena una clave que
  puede cambiar. Se escriben después de la revisión.
- **Las claves están concentradas**: C:18, B:17, A:4, D:5, cuando lo repartido
  serían 11 y 11. Puede ser que el simulacro fuera así de verdad, pero conviene
  mirarlo cuando el docente revise.
- **El APK sigue siendo de depuración**, sin firmar, así que Android lo marca como
  app no verificada. Publicarlo en Play Store exige una clave propia.

### Verificación

`npm run auditar` pasa. En navegador, a 320/360/414/768/1280 px: cero scroll
horizontal, cero errores JS, el cronómetro sigue pegado al desplazar, la tabla del
escritorio entra sin scroll (734 px en un contenedor de 800) y el módulo nuevo
responde con su cuenta regresiva.

Sobre el teléfono de verdad (TECNO KJ5, Android 13): APK de 6,6 MB compilado,
instalado y tocado. Se comprobó con el dedo que arrastrar la pantalla hacia los
lados **no mueve la página** (que era el fallo), que se entra directo a la práctica
sin cuenta, que "Simulacro 2026-2" arranca, que la cuenta regresiva por pregunta
corre, que el rótulo de clave provisional aparece bajo el enunciado y que al
responder el veredicto y el botón Siguiente quedan a la vista.

