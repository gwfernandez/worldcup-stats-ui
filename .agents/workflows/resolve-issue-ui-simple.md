---
description: Workflow que guía al agente en la resolución completa de un issue de GitHub, usando herramientas de integración para la asignación, comentarios y PRs, asegurando cobertura de tests del 90% y trazabilidad total en GitHub.
---

# Workflow — Resolver Issue de GitHub

## Contexto del proyecto
- Repositorio: worldcup-stats-ui
- Lenguaje: TypeScript (strict)
- Framework: React 19 + Vite
- Arquitectura: Feature-based (features → hooks → services)
- Rama principal: main
- Convención de branches: indicada en el campo "Rama sugerida" del issue de GitHub

---

## Fase 1 — Preparación

1. Leer el issue de GitHub completo usando las herramientas de búsqueda/lectura y entender el requerimiento
2. Asignarme el issue usando la herramienta de actualización de issues de GitHub
3. Cambiar el estado real del issue a **In Progress / En curso** en GitHub Projects al momento de la asignación:
   - Consultar si el issue está asociado a uno o más Project items (`projectItems`)
   - Si existe Project item:
     - Identificar el campo de estado (`Status`, `Estado` o equivalente)
     - Actualizar el valor del campo a **In Progress** o **En curso**, según las opciones disponibles del Project
     - Verificar luego de la actualización que el valor quedó aplicado correctamente
   - Si el issue no está asociado a ningún Project item:
     - No considerar cumplido el cambio de estado
     - Informarme explícitamente que el issue no pertenece a ningún Project y que no se pudo mover a **In Progress / En curso**
     - Publicar un comentario de trazabilidad indicando que el trabajo comienza, aclarando que el estado de Project no pudo actualizarse por falta de Project item
   - Si la API o permisos de GitHub no permiten actualizar el estado:
     - Informarme explícitamente el motivo técnico
     - Publicar un comentario de trazabilidad indicando que el trabajo comienza y que el cambio de estado de Project quedó pendiente
4. Leer el campo "Rama sugerida" del issue
   - Si existe → usar ese nombre
   - Si no existe → solicitarme el nombre antes de continuar
5. Crear el branch localmente con ese nombre desde `main`
6. Hacer checkout al branch creado
7. Publicar un comentario breve en el issue de GitHub indicando que el trabajo está **En curso**, solo como trazabilidad; este comentario no reemplaza la actualización real del estado en GitHub Projects

---

## Fase 2 — Planificación

1. Analizar el issue de GitHub, tomando como base la sección `📋 Tareas Técnicas` del SDD si existe, y elaborar un plan de acción detallado que incluya:
   - Archivos a crear o modificar
   - Capas involucradas (feature / hook / service / store / types)
   - Componentes nuevos y su ubicación (`components/shared/` o dentro de la feature)
   - Tipos TypeScript nuevos o modificados en `src/types/`
   - Tests unitarios necesarios que cubran los `✅ Criterios de Aceptación`
2. Presentarme el plan (Implementation Plan) y **esperar mi confirmación antes de continuar**
3. Una vez que apruebe el plan, **DEBES usar la herramienta de GitHub para publicar el "Implementation Plan" completo como un comentario en el issue original**

---

## Fase 3 — Desarrollo

1. Ejecutar el plan de acción confirmado
2. Seguir las convenciones del proyecto:
   - Nombres de archivos de componentes: `PascalCase.tsx` (ej: `MatchCard.tsx`)
   - Nombres de archivos de hooks: `camelCase.ts` con prefijo `use` (ej: `useFixture.ts`)
   - Nombres de archivos de servicios: `camelCase.ts` (ej: `fixtureService.ts`)
   - Nombres de archivos de tipos: `camelCase.ts` (ej: `fixture.types.ts`)
   - Tests: `{NombreArchivo}.test.tsx` o `{NombreArchivo}.test.ts` en el mismo directorio
   - Cada feature se organiza internamente con subcarpetas: `components/`, `hooks/`, `types/` si la complejidad lo justifica
3. No modificar archivos fuera del alcance del issue de GitHub
4. Si el issue contiene una lista de tareas (tasks), realizar un commit independiente utilizando la skill `semantic-commit-ui` por cada tarea completada. El mensaje del commit debe reflejar fielmente la tarea realizada. En caso de no haber una lista, realizar commits por cada hito lógico finalizado.
5. Respetar estrictamente la sección `🚫 Fuera de Alcance` del issue para evitar cambios innecesarios y mantener el foco.


---

## Fase 4 — Pull Request

1. Usar la herramienta de creación de Pull Requests de GitHub para generar un PR desde el branch actual hacia `main` con:
   - **Título:** `tipo(scope): descripción breve (#numero_issue)`
   - **Descripción:**
     - Resumen del issue de GitHub resuelto
     - Principales cambios realizados
     - Componentes o features nuevas (si aplica)
     - Rutas nuevas o modificadas (si aplica)
     - Impacto SemVer estimado (MAJOR/MINOR/PATCH)
     - Confirmación de cumplimiento de los `✅ Criterios de Aceptación`
     - Link de cierre obligatorio al issue: `Closes #numero_issue`
   - **Formato obligatorio de la descripción:**
     - Escribir la descripción completa en un archivo Markdown temporal (por ejemplo `/tmp/pr-body.md` o `/private/tmp/pr-body.md`)
     - Crear o editar el PR usando `--body-file <archivo>` para preservar saltos de línea, listas y checklists
     - No pasar descripciones largas inline con `--body "..."`, porque puede generar escapes `\n` y dejar el PR ilegible
     - Usar secciones Markdown claras: `Resumen`, `Cambios Realizados`, `Rutas Impactadas` (si aplica), `Validación`, `Criterios de Aceptación`, `Impacto SemVer` y `Closes #numero_issue`
2. Verificar que el PR quedó vinculado al issue como cierre automático:
   - Confirmar que la descripción del PR contiene una closing keyword válida (`Closes #numero_issue`, `Fixes #numero_issue` o `Resolves #numero_issue`)
   - Verificar con GitHub que el PR referencia el issue en `closingIssuesReferences` o equivalente
   - Si el vínculo de cierre no quedó aplicado, editar el PR usando `--body-file` para corregir la descripción antes de continuar
   - Tener en cuenta que GitHub cierra el issue automáticamente al hacer **merge** del PR hacia `main`; la aprobación/review del PR por sí sola no cierra el issue
3. Asignarme como reviewer (si la API lo permite, si no, dejar documentado)
4. **Usar la herramienta de comentarios de GitHub** para publicar el documento de resumen ("Walkthrough") como un comentario final en el issue original, indicando que el PR quedó listo para revisión/merge.
   - Para comentarios largos, escribir el contenido en un archivo Markdown temporal y publicarlo con `--body-file <archivo>`
   - No usar bodies largos inline con `--body "..."`
