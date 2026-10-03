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

## Guía de orientación del examen

- **Guía de orientación del Examen Saber Pro, Aplicación 2026-1** — ICFES. Usada para la estructura del examen (módulos, tiempos, puntaje) y las competencias/pesos por módulo (ver `docs/PLAN.md`, sección "Investigación realizada"). URL: https://www.icfes.gov.co/wp-content/uploads/2026/03/guia-orientacion-examen-saber-pro-2026-1.pdf
- **Oferta de combinatorias para el Examen Saber Pro, Aplicación 2026-2** — ICFES. Usada para confirmar qué módulos de competencias específicas ofrece el NBC "Ingeniería de sistemas, telemática y afines" (ver sección de módulos específicos más abajo). URL: https://www.icfes.gov.co/wp-content/uploads/2026/09/16-marzo-oferta-combinatorias-saber-pro-2026-2.pdf

## Exclusiones documentadas (contenido no incluido y por qué)

- **LC, pregunta 15** (de 26): pasaje periodístico real sobre trata de personas, considerado sensible — excluida del banco. Ver `docs/PLAN.md`, sección "Manejo de bloqueos de seguridad de contenido", para el detalle completo del proceso usado para identificarla y excluirla sin exponer el contenido.
- **Licencia de uso**: los cuadernillos del ICFES usados están publicados por la propia entidad para consulta pública; este proyecto es de uso académico/personal, sin fines comerciales, y cada pregunta cita su fuente exacta.
