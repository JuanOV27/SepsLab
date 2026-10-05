# Fuentes

Todas las preguntas de este proyecto son reales, tomadas de cuadernillos oficiales del ICFES publicados para consulta y uso académico. Ninguna pregunta fue inventada ni generada por el modelo.

## Cuadernillos de preguntas (Saber Pro, aplicación 2018)


| Módulo | Cuadernillo | Publicador | Año | URL |
|---|---|---|---|---|
| Razonamiento Cuantitativo (RC) | Cuadernillo de preguntas — Módulo de razonamiento cuantitativo, Saber Pro | ICFES | 2018 | https://www.icfes.gov.co/wp-content/uploads/2024/12/02_02_Cuadernillo_de_preguntas_razonamiento_cuantitativo_saber_pro_2018.pdf |
| Lectura Crítica (LC) | Cuadernillo de preguntas — Módulo de lectura crítica, Saber Pro | ICFES | 2018 | https://www.icfes.gov.co/wp-content/uploads/2024/12/01_02_Cuadernillo_de_preguntas_Lectura_Critica-_Saber-Pro.pdf |
| Competencias Ciudadanas (CC) | Cuadernillo de preguntas — Módulo de competencias ciudadanas, Saber Pro | ICFES | 2018 | https://www.icfes.gov.co/wp-content/uploads/2025/01/03_02_Cuadernillo_de_preguntas_competencias_ciudadanas_Saber_Pro_2018.pdf |
| Inglés (IN) | Cuadernillo de preguntas — Módulo de inglés, Saber Pro | ICFES | 2018 | https://www.icfes.gov.co/wp-content/uploads/2025/01/05_02_Cuadernillo_de_preguntas_ingles_Saber_Pro.pdf |
| Comunicación Escrita (CE) | Cuadernillo de preguntas — Módulo de comunicación escrita, Saber Pro | ICFES | 2018 | https://www.icfes.gov.co/wp-content/uploads/2025/01/04_02_Cuadernillo_de_preguntas_comunicacion_escrita_Saber_Pro_2018.pdf |

Cada pregunta en `app/data/questions.*.js` incluye además su propio objeto `source` (cuadernillo, año, publicador, URL y número original en el cuadernillo), para trazabilidad puntual dentro de la propia app.

## Módulos de competencias específicas (Ingeniería de Sistemas)

Según el documento "Oferta de combinatorias" (ver abajo), el NBC "Ingeniería de sistemas, telemática y afines" solo ofrece estos tres módulos específicos. Se construyeron los tres bancos para no depender de que el usuario confirme a tiempo cuál le aplica (ver `docs/PLAN.md`).

| Módulo | Cuadernillo | Publicador | Año | URL |
|---|---|---|---|---|
| Formulación de Proyectos de Ingeniería (FP) | Cuadernillo de preguntas — Módulo de formulación de proyectos de ingeniería, Saber Pro | ICFES | 2018 | https://www.icfes.gov.co/wp-content/uploads/2025/01/20_02_Cuadernillo_de_preguntas-formulacion_de_proyectos_de_ingenieria_Saber_Pro_2018.pdf |
| Diseño de Software (DS) | Cuadernillo de preguntas — Módulo de diseño de software, Saber Pro | ICFES | 2018 | https://www.icfes.gov.co/wp-content/uploads/2025/01/14_02_diseno_software_Cuadernillo_de_preguntas_diseno_de_software_saber_pro_2018.pdf |
| Pensamiento Científico (PC), núcleo común | Cuadernillo de preguntas — Módulo de pensamiento científico, Saber Pro | ICFES | 2026 | https://www.icfes.gov.co/wp-content/uploads/2026/06/20-mayo-cuadernillo-pensamiento-cientifico-saber-pro-2026.pdf |

- **FP**: pesos oficiales de sus 3 competencias tomados del Marco de Referencia (https://www.icfes.gov.co/wp-content/uploads/2024/12/MR-Formulacion-de-proyectos-de-ingenieria-Saber-Pro.pdf) y la Guía de Orientación 2023-2 (https://www.icfes.gov.co/wp-content/uploads/2024/11/07-Septiembre_GDO-Modulo-Formulacion-de-Proyectos-de-Ingenieria-Saber-Pro-2023-2.pdf), que coinciden.
- **DS**: 3 competencias tomadas de la Guía de Orientación 2024-2 (https://www.icfes.gov.co/wp-content/uploads/2024/11/10-Mayo_Disen%CC%83o-de-Software-Saber-Pro-2024-2.pdf); no existe un marco de referencia separado ni pesos porcentuales oficiales publicados para este módulo.
- **PC**: el banco de 24 preguntas es de **núcleo común** (compartido por las 5 áreas posibles), no del núcleo específico de Matemáticas y Estadística — ICFES no publica un cuadernillo de práctica para esa área específica. Competencias y la proporción oficial núcleo común/específico (25/15 preguntas) tomadas del Marco de Referencia: https://www.icfes.gov.co/wp-content/uploads/2024/11/Descargue-AQUI-el-marco-de-referencia-Pensamiento-cientifico-Saber-Pro.pdf

## Banco de entrenamiento (contenido NO oficial)

Además de los cuadernillos, el proyecto incluye un banco propio de 130 preguntas en
`app/data/questions.gen.*.js`: 125 de opción múltiple (30 de RC, 30 de LC, 30 de CC y 35 de IN)
más 5 temas de ensayo argumentativo para CE. **Estas preguntas no son del ICFES**: fueron
redactadas para este proyecto imitando el formato, el nivel, las competencias y los tipos de
contexto de los cuadernillos oficiales.

Divergencia deliberada de formato, declarada aquí para que no se lea como un error: en las Partes 3, 4 y 5
del banco propio de Inglés hay 4 opciones (A-D) donde el examen real ofrece 3. Se dejó así
porque el banco de entrenamiento no es material de examen y cuatro opciones permiten
comprobar el razonamiento de cada distractor. El emparejamiento de vocabulario (Parte 2) sí
reproduce el formato real de 8 opciones A-H, con ocho palabras, una usada como ejemplo y dos sin usar.

Separación explícita, para que la afirmación de arriba ("ninguna pregunta fue inventada")
siga siendo cierta del material oficial:

- Viven en `window.SESP.data.questions.GEN`, no en los bancos por módulo.
- Llevan `generated: true` y un `source` que dice que no son del ICFES.
- Solo las usa el **Modo Entrenamiento**. Práctica, Simulacro, Exprés y Repaso siguen
  corriendo exclusivamente sobre material oficial (verificado: cero preguntas generadas en
  las colas de esos modos).
- En pantalla, cada una muestra el distintivo "No oficial".

Qué aportan sobre el banco oficial: cada pregunta trae `explanation` con el razonamiento
resuelto. Los cuadernillos del ICFES publican la clave de respuesta pero no el porqué, y sin
el porqué repetir preguntas entrena memoria en vez de competencia.

Los pasajes de Lectura Crítica son textos originales escritos para el proyecto, no fragmentos
de obras de terceros. El contenido jurídico de Competencias Ciudadanas cita la norma aplicable
(Constitución Política, Ley 1755 de 2015, Ley 1757 de 2015, Convenio 169 de la OIT); si alguna
cambia, manda la norma y no esta app.

La letra de la respuesta correcta está repartida de forma homogénea entre A, B, C y D en RC, LC
y CC, sin rachas de tres ni ciclos regulares — un banco sesgado hacia una letra enseña a adivinar
la letra. En IN el reparto incluye además E, F, G y H, que son las claves que usan los cinco
ítems de emparejamiento de la Parte 2. Los módulos FP, DS y PC no se rebalancearon: su clave es
la oficial del ICFES y no se toca.

## Guía de orientación del examen

- **Guía de orientación del Examen Saber Pro, Aplicación 2026-1** — ICFES. Usada para la estructura del examen (módulos, tiempos, puntaje) y las competencias/pesos por módulo (ver `docs/PLAN.md`, sección "Investigación realizada"). URL: https://www.icfes.gov.co/wp-content/uploads/2026/03/guia-orientacion-examen-saber-pro-2026-1.pdf
- **Oferta de combinatorias para el Examen Saber Pro, Aplicación 2026-2** — ICFES. Usada para confirmar qué módulos de competencias específicas ofrece el NBC "Ingeniería de sistemas, telemática y afines". URL: https://www.icfes.gov.co/wp-content/uploads/2026/09/16-marzo-oferta-combinatorias-saber-pro-2026-2.pdf

## Exclusiones documentadas (contenido no incluido y por qué)

- **LC, pregunta 15** (de 26): pasaje periodístico real sobre trata de personas, considerado sensible — excluida del banco. Ver `docs/PLAN.md`, sección "Manejo de bloqueos de seguridad de contenido", para el detalle completo del proceso usado para identificarla y excluirla sin exponer el contenido.
- **Licencia de uso**: los cuadernillos del ICFES usados están publicados por la propia entidad para consulta pública; este proyecto es de uso académico/personal, sin fines comerciales, y cada pregunta cita su fuente exacta.
