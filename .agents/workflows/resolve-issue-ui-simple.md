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
4. Si el issue contiene una lista de tareas (tasks), realizar un commit independiente utilizando la skill `semantic-commit` por cada tarea completada. El mensaje del commit debe reflejar fielmente la tarea realizada. En caso de no haber una lista, realizar commits por cada hito lógico finalizado.
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
     - Link al issue: `Closes #numero_issue`
2. Asignarme como reviewer (si la API lo permite, si no, dejar documentado)
3. **Usar la herramienta de comentarios de GitHub** para publicar el documento de resumen ("Walkthrough") como un comentario final en el issue original, indicando que el trabajo ha concluido.