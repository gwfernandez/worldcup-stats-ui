---
name: semantic-commit-ui
description: >
  Redactar mensajes de commit que cumplan con Conventional Commits y sean compatibles con
  semantic-release para versionado semántico automático (SemVer) en proyectos React + TypeScript.
  Analiza los cambios del usuario, determina el tipo correcto (feat/fix/chore/etc.), el impacto
  en versión (MAJOR/MINOR/PATCH), genera el mensaje formateado y ejecuta el commit con confirmación.

  Usar este skill SIEMPRE que el usuario mencione: "hacer un commit", "commitear", "escribir un
  commit message", "preparar un commit", "git commit", "quiero versionar", "cambios para commitear",
  o cuando describa cambios en el código y quiera registrarlos en git. Activar también cuando
  el usuario diga "rompí algo", "agregué una feature", "arreglé un bug", "refactoricé X",
  "actualicé dependencias", o cualquier descripción de cambio en el código que implique
  querer hacer commit.
---

# Semantic Commit Skill — React

Skill para generar mensajes de commit que cumplan con la especificación **Conventional Commits**
compatible con **semantic-release**, determinando automáticamente el impacto en versión SemVer
y ejecutando el commit con confirmación del usuario.

---

## Flujo principal

```
1. RECIBIR   → Descripción libre de los cambios realizados
2. ANALIZAR  → Determinar tipo, scope, breaking change e impacto en versión
3. COMPLETAR → Pedir datos faltantes si es necesario (máx. 1 ronda)
4. GENERAR   → Mensaje de commit formateado según la spec
5. MOSTRAR   → Preview con impacto en versión explicado
6. CONFIRMAR → Pedir aprobación y ejecutar git commit
```

---

## Paso 1 — Recibir la descripción

Aceptar cualquier descripción libre. El usuario puede escribir:

> "agregué el componente de tabla de goleadores"
> "rompí el hook useFixture, cambié lo que retorna"
> "moví los tipos de Player a su propio archivo"

No pedir información extra hasta haber intentado inferirla.

---

## Paso 2 — Analizar y determinar campos

### Estructura del mensaje (formato Conventional Commits)

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Tipos y su impacto en versión

| Tipo | Impacto SemVer | Cuándo usarlo |
|------|---------------|---------------|
| `feat` | **MINOR** (0.X.0) | Nuevo componente, página, feature visible al usuario |
| `fix` | **PATCH** (0.0.X) | Corrección de bug en componente, hook o lógica |
| `perf` | **PATCH** | Mejora de performance (memoización, lazy load, etc.) |
| `refactor` | Sin release* | Refactoring sin cambio de comportamiento o UI |
| `style` | Sin release* | Cambios de estilos, Tailwind, ajustes visuales sin lógica |
| `types` | Sin release* | Agregar o modificar interfaces/types TypeScript |
| `docs` | Sin release* | Solo documentación |
| `test` | Sin release* | Agregar o corregir tests (Vitest, RTL) |
| `build` | Sin release* | Vite config, dependencias, tsconfig |
| `ci` | Sin release* | Configuración de CI/CD |
| `chore` | Sin release* | Tareas de mantenimiento generales |
| `revert` | **PATCH** | Revertir un commit anterior |

> *Sin release por defecto en semantic-release. Configurable en `.releaserc`.

### Breaking Change → MAJOR (X.0.0)

Un commit de **cualquier tipo** se convierte en MAJOR si incluye:

```
feat(hooks)!: cambiar valor de retorno de useChampionships

BREAKING CHANGE: el hook ahora retorna `{ data, isLoading }` en lugar de `[data, isLoading]`
```

Indicadores de breaking change en la descripción del usuario:
- "rompí", "cambié lo que retorna el hook", "cambié las props", "eliminé un componente"
- "renombré", "ya no es compatible", "hay que migrar", "cambió la interfaz"

### Inferencia de scope

El scope mapea directamente a las capas o features del proyecto:

| Scope | Cuándo usarlo |
|---|---|
| `championships` | Feature de lista/detalle de campeonatos mundiales |
| `teams` | Feature de equipos y selecciones |
| `fixture` | Feature de fixture y resultados |
| `players` | Feature de planteles |
| `scorers` | Feature de goleadores |
| `router` | Cambios en rutas de React Router |
| `store` | Cambios en slices de Zustand |
| `services` | Cambios en la capa de servicios (Axios) |
| `hooks` | Cambios en custom hooks reutilizables |
| `ui` | Componentes de `components/ui/` (shadcn) |
| `shared` | Componentes de `components/shared/` |
| `types` | Archivos de `src/types/` |
| `i18n` | Diccionarios y configuración de react-i18next |
| `config` | Vite, tsconfig, ESLint, Prettier, Husky |

Si el cambio es transversal → omitir scope. Si hay duda → preguntar solo si agrega valor real.

---

## Paso 3 — Completar información faltante

Hacer preguntas **solo si son necesarias** para escribir el commit correctamente.
Máximo **una ronda** de preguntas. Agrupar todo en un solo mensaje.

**Preguntar si:**
- No está claro si es breaking change (ej: cambio en props o retorno de hook)
- No está claro si es `feat` o `fix` (impacto diferente en versión)
- El scope agregaría claridad significativa y no se puede inferir

**No preguntar si:**
- El tipo es obvio por contexto
- El scope no agrega valor
- La descripción es suficientemente clara

---

## Paso 4 — Generar el mensaje

### Reglas de formato

**Header** (obligatorio):
- Máximo 72 caracteres
- Tipo en minúscula
- Descripción: verbo en imperativo, minúscula, sin punto final
- `!` antes del `:` si es breaking change

**Body** (incluir cuando el cambio no es obvio):
- Separado del header por línea en blanco
- Explicar el *qué* y el *por qué*, no el *cómo*
- Máximo 100 caracteres por línea
- En el mismo idioma que el proyecto (inferir del contexto)

**Footer** (obligatorio si hay breaking change):
```
BREAKING CHANGE: descripción del cambio incompatible
```

También válido para referencias:
```
Closes #123
Refs #456
```

### Ejemplos de commits bien formados

```bash
# PATCH — fix en componente
fix(fixture): corregir renderizado de partidos sin resultado

# MINOR — nuevo componente/feature
feat(scorers): agregar tabla de goleadores con paginación

# MINOR — nueva feature con body explicativo
feat(championships): agregar vista de detalle por edición

Muestra el campeón, sede, cantidad de equipos y goles totales.
Consume el endpoint /api/worldcups/:year del servicio REST.

Closes #14

# MINOR — nuevo hook
feat(hooks): agregar useTeamPlayers para obtener plantel por selección

# PATCH — mejora de performance
perf(fixture): memoizar lista de partidos con useMemo

# Sin release — cambio de estilos
style(scorers): ajustar espaciado y colores de la tabla de goleadores

# Sin release — tipos TypeScript
types(players): agregar interfaz PlayerStats con goles y asistencias

# Sin release — refactor de hook
refactor(hooks): extraer lógica de paginación a usePagination

# Sin release — i18n
chore(i18n): agregar traducciones al español para la sección fixture

# Sin release — config
build(config): actualizar configuración de Tailwind CSS a v4

# MAJOR — breaking change en hook
feat(hooks)!: cambiar valor de retorno de useFixture

BREAKING CHANGE: el hook ahora retorna `{ matches, isLoading, error }`
en lugar del array `[matches, isLoading]`. Actualizar todos los consumidores.
```

---

## Paso 5 — Mostrar preview con impacto en versión

Mostrar siempre el impacto antes de ejecutar:

```
📝 Commit generado:

  feat(scorers): agregar tabla de goleadores con paginación

  Muestra los goleadores históricos del mundial seleccionado.
  Incluye nombre, selección, partidos jugados y goles convertidos.

  Closes #21

📦 Impacto en versión (semantic-release):
  Versión actual: v0.3.1  →  Nueva versión: v0.4.0  (MINOR)
  Motivo: `feat` incrementa el MINOR

¿Confirmás este commit? [Sí / Modificar / Cancelar]
```

Si no se conoce la versión actual, mostrar solo el tipo de bump:
```
📦 Impacto: MINOR bump (feat → incrementa X.Y.0)
```

---

## Paso 6 — Confirmar y ejecutar

### Si hay terminal disponible (`bash_tool`)

```bash
git add -A   # o el staging que corresponda
git commit -m "<header>" -m "<body>" -m "<footer>"
```

Mostrar el output de git después de ejecutar.

Si el usuario quiere stagear archivos específicos, preguntar antes de `git add`.

### Si NO hay terminal disponible

Mostrar el comando listo para copiar:

```bash
git commit -m "feat(scorers): agregar tabla de goleadores con paginación" \
  -m "Muestra los goleadores históricos del mundial seleccionado.
Incluye nombre, selección, partidos jugados y goles convertidos." \
  -m "Closes #21"
```

---

## Validaciones antes de generar

Verificar antes de mostrar el commit:

- [ ] Header ≤ 72 caracteres
- [ ] Tipo es uno de los valores válidos
- [ ] Scope corresponde a una feature, capa o área del proyecto React
- [ ] Descripción en imperativo y minúscula
- [ ] Sin punto final en el header
- [ ] Footer `BREAKING CHANGE:` presente si hay `!` en el tipo
- [ ] Body separado del header por línea en blanco

---

## Casos especiales

### Múltiples cambios independientes → múltiples commits
Si el usuario describe cambios de tipos o features distintas, sugerir dividirlos:
```
Detecté dos cambios independientes. Te recomiendo hacer commits separados:
1. feat(teams): agregar card de selección con bandera y estadísticas
2. style(shared): unificar border-radius en componentes de card
¿Querés commitearlos por separado?
```

### Nuevo componente + su test
Si el usuario agrega un componente y su test en el mismo cambio, es un solo commit:
```bash
feat(fixture): agregar componente MatchCard con resultado y equipos
```
No separar el test en un commit aparte a menos que sea un test sobre código preexistente.

### Revert
```bash
revert: revert "feat(scorers): agregar tabla de goleadores"

This reverts commit abc1234.
```

### WIP / trabajo incompleto
Sugerir usar `chore` con aclaración, recordando que no genera release:
```bash
chore(wip): avance en componente de fixture [no release]
```

---

## Referencias

- `references/conventional-commits-spec.md` — Spec completa con ejemplos edge cases
- `references/semver-impact-table.md` — Tabla completa de tipos → impacto en versión con configuración semantic-release
