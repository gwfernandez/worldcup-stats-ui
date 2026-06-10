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
3. Leer el campo "Rama sugerida" del issue
   - Si existe → usar ese nombre
   - Si no existe → solicitarme el nombre antes de continuar
4. Crear el branch localmente con ese nombre desde `main`
5. Hacer checkout al branch creado
6. Cambiar el estado del issue a **En curso** publicando un comentario en el issue de GitHub mediante la integración

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

## Fase 3.5 — Auditoría de calidad

1. Ejecutar la skill `code-quality-react` en **modo Git Diff** para auditar todos los archivos `.ts` y `.tsx` modificados en el branch actual
2. Revisar los hallazgos reportados y aplicar las correcciones aprobadas
3. Si hay hallazgos 🔴 Críticos → **corregir obligatoriamente** antes de continuar
4. Si hay hallazgos 🟠 Importantes → corregir salvo decisión explícita del usuario de postergarlos
5. Registrar las correcciones con la skill `semantic-commit-ui` si corresponde

> Esta fase es obligatoria. No avanzar a Testing sin haber ejecutado la auditoría de calidad.

---

## Fase 4 — Testing

1. Crear los tests necesarios para alcanzar un **coverage mínimo del 80%** sobre los archivos del issue
   - Componentes: usar **React Testing Library** con enfoque en comportamiento del usuario (queries por rol, texto, label)
   - Hooks: usar `renderHook` de React Testing Library; mockear llamadas HTTP con `msw` o `vi.fn()`
   - Services: tests unitarios puros mockeando la instancia de Axios
   - Store (Zustand): tests del estado inicial y de cada acción
2. Ejecutar todos los tests:
```bash
npx vitest run --coverage
```
3. Si algún test falla → corregir el código o el test hasta que todos pasen
4. Si el coverage es menor al 80% → agregar los tests faltantes
5. Validar que los tests cubren todos los `✅ Criterios de Aceptación` definidos en el issue original
6. Una vez que todos los tests pasen y el coverage sea ≥ 80%, **usar la integración de GitHub para agregar como comentario en el issue original** el reporte de ejecución como evidencia

---

## Fase 5 — Pull Request

1. Usar la herramienta de creación de Pull Requests de GitHub para generar un PR desde el branch actual hacia `main` con:
   - **Título:** `tipo(scope): descripción breve (#numero_issue)`
   - **Descripción:**
     - Resumen del issue de GitHub resuelto
     - Principales cambios realizados
     - Componentes o features nuevas (si aplica)
     - Rutas nuevas o modificadas (si aplica)
     - Impacto SemVer estimado (MAJOR/MINOR/PATCH)
     - Confirmación de cumplimiento de los `✅ Criterios de Aceptación`
     - Link al issue: `Closes #numero_issue`
   - **Formato obligatorio de la descripción:**
     - Escribir la descripción completa en un archivo Markdown temporal (por ejemplo `/tmp/pr-body.md` o `/private/tmp/pr-body.md`)
     - Crear o editar el PR usando `--body-file <archivo>` para preservar saltos de línea, listas y checklists
     - No pasar descripciones largas inline con `--body "..."`, porque puede generar escapes `\n` y dejar el PR ilegible
     - Usar secciones Markdown claras: `Resumen`, `Cambios Realizados`, `Rutas Impactadas` (si aplica), `Validación`, `Criterios de Aceptación`, `Impacto SemVer` y `Closes #numero_issue`
2. Asignarme como reviewer (si la API lo permite, si no, dejar documentado)
3. **Usar la herramienta de comentarios de GitHub** para publicar el documento de resumen ("Walkthrough") como un comentario final en el issue original, indicando que el trabajo ha concluido.
   - Para comentarios largos, escribir el contenido en un archivo Markdown temporal y publicarlo con `--body-file <archivo>`
   - No usar bodies largos inline con `--body "..."`
