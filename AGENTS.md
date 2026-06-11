# CONTEXT.md — worldcup-stats-ui

> Documento de referencia para agentes de desarrollo. Contiene todo el contexto necesario para entender, navegar y contribuir al proyecto sin ambigüedad. Leer completo antes de ejecutar cualquier tarea.

---

## 1. Descripción del proyecto

**worldcup-stats-ui** es una aplicación web de **solo lectura pública** que expone estadísticas históricas de los Mundiales de Fútbol. El usuario puede explorar cada edición del torneo, los equipos participantes, el fixture con resultados, los planteles por selección y la tabla de goleadores.

- No tiene autenticación ni panel de administración
- Toda la información proviene de una **REST API externa** (worldcup-stats-api)
- El frontend no persiste datos propios

---

## 2. Stack tecnológico

| Categoría | Tecnología | Versión |
|---|---|---|
| Framework | React | 19 |
| Bundler | Vite | latest |
| Lenguaje | TypeScript | strict mode |
| Routing | React Router | v7 |
| Data fetching | TanStack Query | v5 |
| Cliente HTTP | Axios | latest |
| Validación de esquemas | Zod | latest |
| Estado global | Zustand | latest |
| Estilos | Tailwind CSS | v4 |
| Componentes base | shadcn/ui | latest |
| Iconografía | Lucide React | latest |
| Gráficos | Recharts | latest |
| i18n | react-i18next | latest |
| Testing | Vitest + React Testing Library | latest |
| Linting | ESLint + reglas React/TS | latest |
| Formateo | Prettier | latest |
| Git hooks | Husky + lint-staged | latest |

---

## 3. Arquitectura

El proyecto sigue una arquitectura **feature-based** con separación clara por capas de responsabilidad.

### Capas del sistema

```
REST API (worldcup-stats-api)
        ↓
   src/services/        ← Axios: llamadas HTTP puras, sin estado
        ↓
   src/hooks/           ← TanStack Query: caché, loading, error
        ↓
   src/features/        ← Componentes que consumen los hooks
        ↓
   src/store/           ← Zustand: estado global de UI (filtros, preferencias)
```

### Reglas de dependencia entre capas

- `services` no importa desde `hooks`, `features` ni `store`
- `hooks` solo importa desde `services` y `types`
- `features` puede importar desde `hooks`, `store`, `components` y `types`
- `store` no importa desde `features` ni `hooks`
- `components/shared` no importa desde `features`
- Nunca saltear capas (un componente no llama directamente a `services`)

---

## 4. Estructura de carpetas

```
src/
├── assets/                        # Imágenes, íconos, fuentes estáticas
├── components/
│   ├── ui/                        # Componentes shadcn/ui (no modificar directamente)
│   └── shared/                    # Componentes reutilizables propios (layout, feedback, etc.)
├── features/                      # Un directorio por dominio de negocio
│   ├── championships/             # Lista y detalle de campeonatos mundiales
│   ├── teams/                     # Equipos y selecciones
│   ├── fixture/                   # Fixture y resultados de partidos
│   ├── players/                   # Planteles por selección
│   └── scorers/                   # Tabla de goleadores
├── hooks/                         # Custom hooks reutilizables (TanStack Query)
├── i18n/                          # Configuración y diccionarios de idiomas
├── services/                      # Funciones de llamada a la API (Axios)
├── store/                         # Slices de Zustand
├── types/                         # Interfaces y tipos TypeScript del dominio
├── utils/                         # Helpers y funciones puras sin efectos
└── router/                        # Definición de rutas con React Router v7
```

### Estructura interna de una feature

Cuando una feature crece, se organiza internamente así:

```
features/fixture/
├── components/        # Componentes propios de la feature
├── hooks/             # Hooks específicos de la feature
├── types/             # Tipos propios si no son compartidos
└── index.ts           # Barrel export de la feature
```

---

## 5. Convenciones de nombres

| Tipo de archivo | Convención | Ejemplo |
|---|---|---|
| Componente React | `PascalCase.tsx` | `MatchCard.tsx` |
| Hook | `camelCase.ts` con prefijo `use` | `useFixture.ts` |
| Service | `camelCase.ts` | `fixtureService.ts` |
| Tipos / Interfaces | `camelCase.types.ts` | `fixture.types.ts` |
| Zustand slice | `camelCase.store.ts` | `championshipDetail.store.ts` |
| Utilidades | `camelCase.utils.ts` | `date.utils.ts` |
| Test de componente | `NombreComponente.test.tsx` | `MatchCard.test.tsx` |
| Test de hook/service | `nombreArchivo.test.ts` | `useFixture.test.ts` |

### Convenciones de código TypeScript

- Siempre tipado explícito en props de componentes (nunca `any`)
- Interfaces para objetos del dominio, `type` para uniones y aliases
- Props de componentes nombradas como `NombreComponenteProps`
- Hooks retornan objetos nombrados, no arrays (salvo casos triviales)

```ts
// ✅ Correcto
export interface MatchCardProps { match: Match; showDate?: boolean }
const useFixture = (): { matches: Match[]; isLoading: boolean; error: Error | null } => { ... }

// ❌ Incorrecto
const useFixture = (): [Match[], boolean] => { ... }
```

---

## 6. Rutas de la aplicación

| Ruta | Componente / Feature | Descripción |
|---|---|---|
| `/` | `worldcups` | Home — listado de todas las ediciones |
| `/worldcup/:year` | `worldcups` | Vista general de un mundial |
| `/worldcup/:year/teams` | `teams` | Equipos participantes |
| `/worldcup/:year/fixture` | `fixture` | Fixture y resultados |
| `/worldcup/:year/scorers` | `scorers` | Tabla de goleadores |
| `/worldcup/:year/team/:id` | `players` | Plantel de una selección |

---

## 7. Tipos del dominio

Los tipos principales del dominio se ubican en `src/types/`. Toda interacción con la API debe estar tipada y validada con **Zod**.

```ts
// Tipos principales del dominio
Championship   // Edición del campeonato mundial (año, sede, campeón, etc.)
Team           // Selección participante
Player         // Jugador dentro de un plantel
Match          // Partido con equipos, resultado y fase
Goal           // Gol con jugador, minuto y tipo
Group          // Grupo de la fase clasificatoria
Stage          // Fase del torneo (grupos, octavos, etc.)
Scorer         // Goleador con total de goles por mundial
```

Los esquemas Zod viven junto a sus tipos en `src/types/` y se usan para validar las respuestas de la API antes de pasarlas al estado o la UI.

---

## 8. Comunicación con la API

### Instancia base de Axios

Ubicada en `src/services/api.ts`. Toda llamada HTTP debe usar esta instancia, nunca `fetch` nativo ni una instancia nueva de Axios.

```ts
// src/services/api.ts
import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})
```

### Patrón de service

```ts
// src/services/fixtureService.ts
import { api } from './api'
import { MatchListSchema } from '../types/fixture.types'

export const getFixture = async (year: number): Promise<Match[]> => {
  const { data } = await api.get(`/worldcups/${year}/fixture`)
  return MatchListSchema.parse(data)   // validación Zod obligatoria
}
```

### Patrón de hook (TanStack Query)

```ts
// src/hooks/useFixture.ts
import { useQuery } from '@tanstack/react-query'
import { getFixture } from '../services/fixtureService'

export const useFixture = (year: number) =>
  useQuery({
    queryKey: ['fixture', year],
    queryFn: () => getFixture(year),
  })
```

### Query keys

Usar arrays descriptivos y jerárquicos:

```ts
['championships']               // lista de campeonatos mundiales
['championship', year]            // detalle de un campeonato mundial
['fixture', year]                 // fixture de un campeonato mundial
['teams', year]                   // equipos de un campeonato mundial
['players', year, teamId]         // plantel de una selección
['scorers', year]                 // goleadores de un campeonato mundial
```

---

## 9. Estado global (Zustand)

Zustand se usa **exclusivamente para estado de UI**, nunca para cachear datos del servidor (eso es responsabilidad de TanStack Query).

Casos de uso válidos:
- Edición/mundial seleccionado actualmente
- Filtros activos (fase, grupo, selección)
- Preferencias de UI (tema, idioma)

El store global de UI vive en `src/store/ui.store.ts` y expone `useUIStore`.
Los filtros se guardan por scope de vista para evitar mezclar estados entre tablas
(`championshipTeams`, `championshipScorers`, `championshipStadiums`, `historicalStandings`,
`historicalScorers`, etc.). La persistencia se limita a preferencias de UI y filtros; no se
deben almacenar respuestas de la API ni datos derivados del servidor.

```ts
// src/store/championship.store.ts
interface ChampionshipStore {
  selectedYear: number | null
  setSelectedYear: (year: number) => void
}
```

---

## 10. Estilos

- Usar **clases de Tailwind CSS v4** para todo el estilo
- Los componentes de `shadcn/ui` se copian a `src/components/ui/` y pueden modificarse
- No usar estilos en línea (`style={{}}`) salvo valores dinámicos que no se puedan expresar con Tailwind
- No crear archivos `.css` propios salvo para casos excepcionales (animaciones complejas, fuentes)
- Las variantes de componentes se manejan con `class-variance-authority (cva)`

---

## 11. Internacionalización (i18n)

- Configurado con **react-i18next** desde el inicio
- Los diccionarios se ubican en `src/i18n/{lang}/{namespace}.json`
- Namespaces sugeridos: `common`, `championships`, `fixture`, `teams`, `players`, `scorers`
- Nunca hardcodear strings de UI directamente en los componentes

```ts
// ✅ Correcto
const { t } = useTranslation('fixture')
<h1>{t('title')}</h1>

// ❌ Incorrecto
<h1>Fixture</h1>
```

---

## 12. Testing

### Estrategia por capa

| Capa | Tipo de test | Herramienta | Enfoque |
|---|---|---|---|
| Componentes | Black-box | React Testing Library | Comportamiento del usuario (queries por rol, texto, label) |
| Hooks | Unitario | `renderHook` + `vi.fn()` | Mockear servicios, verificar estados |
| Services | Unitario | Vitest | Mockear instancia Axios, verificar llamadas y parseo Zod |
| Store | Unitario | Vitest | Estado inicial y resultado de cada acción |

### Coverage mínimo requerido: **80%**

### Comandos

```bash
npx vitest run              # correr todos los tests una vez
npx vitest                  # modo watch
npx vitest run --coverage   # con reporte de coverage
```

### Reglas de testing

- No testear detalles de implementación (clases CSS, estructura del DOM)
- Testear lo que el usuario ve y puede hacer
- Mockear siempre la capa `services` en tests de hooks y componentes
- Un test por comportamiento, no por línea de código

---

## 13. Commits y versionado

El proyecto sigue **Conventional Commits** compatible con **semantic-release**.

### Tipos de commit y scopes válidos

**Tipos:** `feat` · `fix` · `perf` · `refactor` · `style` · `types` · `docs` · `test` · `build` · `ci` · `chore` · `revert`

**Scopes:** `championships` · `teams` · `fixture` · `players` · `scorers` · `router` · `store` · `services` · `hooks` · `ui` · `shared` · `types` · `i18n` · `config`

```bash
feat(scorers): agregar tabla de goleadores con paginación
fix(fixture): corregir renderizado de partidos sin resultado
style(teams): ajustar espaciado en card de selección
types(players): agregar interfaz PlayerStats
build(config): actualizar configuración de Tailwind CSS a v4
```

Los commits se validan automáticamente en el **pre-commit hook** (Husky + lint-staged).

---

## 14. Variables de entorno

| Variable | Requerida | Descripción |
|---|---|---|
| `VITE_API_BASE_URL` | ✅ | URL base de la REST API de datos |

- Las variables de entorno para Vite deben tener el prefijo `VITE_`
- El archivo `.env` no se commitea; sí se commitea `.env.example` con las claves sin valores

---

## 15. Lo que este proyecto NO hace

Para evitar scope creep, tener en cuenta que está explícitamente **fuera de alcance**:

- ❌ Autenticación o roles de usuario
- ❌ Panel de administración o carga de datos
- ❌ Persistencia local de datos (sin localStorage, sin IndexedDB)
- ❌ Server-side rendering (SSR) o generación estática (SSG)
- ❌ Comunicación en tiempo real (WebSockets)
- ❌ Lógica de negocio propia (todo viene de la API)
