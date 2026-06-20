# 🏆 worldcup-stats-ui

Aplicación web para explorar estadísticas históricas de los Mundiales de Fútbol. Permite navegar por cada edición del torneo, consultar los equipos participantes, el fixture con resultados, los planteles por selección y la tabla de goleadores.

> Proyecto frontend que consume la REST API externa **worldcup-stats-service** como fuente de datos.

---

## ✨ Funcionalidades

- 📅 Listado de todas las ediciones de la Copa del Mundo
- 🌍 Detalle por mundial: sede, campeón, equipos participantes y estadísticas generales
- 📋 Fixture completo con resultados por fase (grupos, octavos, cuartos, semifinal, final)
- 👕 Plantel de cada selección con datos de jugadores
- ⚽ Tabla de goleadores por edición
- 🌐 Interfaz multiidioma (react-i18next)

---

## 🛠️ Stack tecnológico

| Categoría              | Tecnología                              |
| ---------------------- | --------------------------------------- |
| Framework              | React 19 + Vite                         |
| Lenguaje               | TypeScript (strict)                     |
| Routing                | React Router v7                         |
| Data fetching          | TanStack Query v5 + Axios               |
| Validación de esquemas | Zod                                     |
| Estado global          | Zustand                                 |
| Estilos                | Tailwind CSS v4 + shadcn/ui             |
| Iconografía            | Lucide React                            |
| Gráficos               | Recharts                                |
| i18n                   | react-i18next                           |
| Testing                | Vitest + React Testing Library          |
| Calidad                | ESLint + Prettier + Husky + lint-staged |

---

## 📁 Estructura del proyecto

```
src/
├── assets/                  # Imágenes, íconos, fuentes
├── components/
│   ├── ui/                  # Componentes base (shadcn/ui)
│   └── shared/              # Componentes reutilizables propios
├── features/                # Módulos por dominio
│   ├── championships/       # Lista y detalle de mundiales
│   ├── teams/               # Equipos y selecciones
│   ├── fixture/             # Fixture y resultados
│   ├── players/             # Planteles por selección
│   └── scorers/             # Tabla de goleadores
├── hooks/                   # Custom hooks (TanStack Query)
├── i18n/                    # Diccionarios de idiomas
├── services/                # Capa de comunicación con la API (Axios)
├── store/                   # Estado global (Zustand)
├── types/                   # Interfaces y tipos TypeScript
├── utils/                   # Helpers y funciones utilitarias
└── router/                  # Definición de rutas
```

---

## 🚀 Inicio rápido

### Requisitos previos

- Node.js >= 20
- npm >= 10

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/gwfernandez/worldcup-stats-ui.git
cd worldcup-stats-ui

# Instalar dependencias
npm install
```

### Variables de entorno

Crear un archivo `.env` en la raíz del proyecto basándose en `.env.example`:

```bash
cp .env.example .env
```

| Variable               | Descripción                                      |
| ---------------------- | ------------------------------------------------ |
| `VITE_API_BASE_URL`    | URL base de la REST API de datos o `same-origin` |
| `BACKEND_API_BASE_URL` | URL base privada usada por el proxy de Vercel    |
| `VITE_USE_MOCK`        | Mantiene mocks en los services aún no integrados |

### Modo mock local

Mientras la integración con `worldcup-stats-service` no esté cerrada, el modo recomendado
para desarrollo frontend es usar datos mockeados:

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_USE_MOCK=true
```

`VITE_USE_MOCK` se evalúa por service. Con `true`, las features que todavía no están integradas
con `worldcup-stats-service` conservan sus datos locales validados con Zod. Las páginas de
mundiales, campeones y posiciones históricas ya consultan siempre sus endpoints reales aunque
esta variable siga activa.

Para deshabilitar todos los fallbacks mock disponibles, configurar:

```env
VITE_USE_MOCK=false
```

En Vercel, configurar la API como `same-origin` para usar el proxy definido en `vercel.ts`:

```env
VITE_API_BASE_URL=same-origin
BACKEND_API_BASE_URL=https://worldcup-stats-service.onrender.com/api
VITE_USE_MOCK=false
```

> **Cómo funciona:** `vercel.ts` usa `BACKEND_API_BASE_URL` como variable de entorno de Vercel
> para reescribir `/api/*` hacia el backend. El frontend debe usar `VITE_API_BASE_URL=same-origin`
> para llamar al mismo origen y dejar que Vercel haga el proxy. Para usar otro servicio productivo,
> solo actualizar `BACKEND_API_BASE_URL` en el dashboard de Vercel y redeployar.

> Nota técnica: el contrato frontend/backend todavía requiere alineación. El frontend conserva
> endpoints históricos como `/worldcups`, mientras que `worldcup-stats-service` documenta rutas
> actuales como `/championships`. Mantener el modo mock activo hasta completar esa planificación.

La página `/champions` consume siempre el endpoint real `GET /api/champions` con
`page=1&size=15`, independientemente de `VITE_USE_MOCK`.
Los filtros por selección y confederación se aplican localmente sobre esa página de resultados.
El modal de títulos consulta `GET /api/champions/:teamCode` sin parámetros de paginado y muestra
los anfitriones, rivales y resultados localizados provistos por el backend.

La página `/standings` consume siempre `GET /api/standings` con filtros remotos por selección y
confederación. Solicita hasta 100 registros por página y reúne automáticamente páginas adicionales,
pero presenta todas las selecciones en una única tabla sin controles de paginación.

La página `/scorers` consume siempre `GET /api/scorers` con paginación de 10 registros y filtros
remotos por nombre de jugador, selección y confederación. Las opciones de selección se obtienen de
`GET /api/teams`, incluyendo selecciones disueltas y reuniendo todas las páginas disponibles. El
modal de detalle conserva temporalmente estadísticas locales fijas de Lionel Messi hasta que exista
un endpoint de detalle por jugador.

### Comandos disponibles

```bash
# Servidor de desarrollo
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview

# Ejecutar tests
npm run test

# Tests con coverage
npm run test:coverage

# Linting
npm run lint

# Formateo
npm run format
```

---

## 🗺️ Rutas de la aplicación

| Ruta                       | Descripción                           |
| -------------------------- | ------------------------------------- |
| `/`                        | Home — listado de todas las ediciones |
| `/worldcup/:year`          | Vista general de un mundial           |
| `/worldcup/:year/teams`    | Equipos participantes                 |
| `/worldcup/:year/fixture`  | Fixture y resultados                  |
| `/worldcup/:year/scorers`  | Tabla de goleadores                   |
| `/worldcup/:year/team/:id` | Plantel de una selección              |

---

## 🧪 Testing

El proyecto usa **Vitest** y **React Testing Library**. La estrategia de testing por capa es:

- **Componentes** — black-box testing orientado al comportamiento del usuario
- **Hooks** — `renderHook` mockeando llamadas HTTP con `vi.fn()`
- **Services** — tests unitarios puros mockeando la instancia de Axios
- **Store** — validación del estado inicial y de cada acción de Zustand

```bash
# Correr todos los tests
npm run test

# Con reporte de coverage
npm run test:coverage
```

Coverage mínimo requerido: **80%**

---

## 📐 Convenciones del proyecto

### Nombres de archivos

| Tipo       | Convención                     | Ejemplo              |
| ---------- | ------------------------------ | -------------------- |
| Componente | `PascalCase.tsx`               | `MatchCard.tsx`      |
| Hook       | `camelCase.ts` (prefijo `use`) | `useFixture.ts`      |
| Service    | `camelCase.ts`                 | `fixtureService.ts`  |
| Tipos      | `camelCase.types.ts`           | `fixture.types.ts`   |
| Test       | `{archivo}.test.tsx/ts`        | `MatchCard.test.tsx` |

### i18n

La internacionalización está configurada con **i18next** y **react-i18next** desde
`src/i18n/config.ts`. Los diccionarios viven en:

```txt
src/i18n/locales/{es,en}/{namespace}.json
```

Namespaces activos:

- `common`
- `championships`
- `champions`
- `historicalScorers`
- `historicalStandings`

Los componentes deben usar `useTranslation` y evitar strings visibles hardcodeadas. Los nombres
propios o valores que vienen de la API, como selecciones, jugadores, estadios y sedes, se renderizan
tal como llegan desde el backend.

### Commits

Este proyecto sigue la especificación [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(scorers): agregar tabla de goleadores con paginación
fix(fixture): corregir renderizado de partidos sin resultado
style(teams): ajustar espaciado en la card de selección
types(players): agregar interfaz PlayerStats
```

Los commits se validan automáticamente en el pre-commit hook mediante **Husky** y **lint-staged**.

### Design tokens

La paleta visual de la aplicación está centralizada en `src/index.css` mediante custom properties
con prefijo `--wc-*`, expuestas a Tailwind v4 como clases semánticas `wc-*`.

Usar estos tokens en lugar de hexadecimales hardcodeados:

```tsx
<div className="bg-wc-bg-primary text-wc-text-primary border-wc-border-primary">
  <span className="text-wc-accent-gold">Argentina 1978</span>
</div>
```

Tokens principales:

| Uso                   | Clase Tailwind                              | CSS custom property      |
| --------------------- | ------------------------------------------- | ------------------------ |
| Fondo principal       | `bg-wc-bg-primary`                          | `--wc-bg-primary`        |
| Superficie primaria   | `bg-wc-surface-primary`                     | `--wc-surface-primary`   |
| Superficie secundaria | `bg-wc-surface-secondary`                   | `--wc-surface-secondary` |
| Borde principal       | `border-wc-border-primary`                  | `--wc-border-primary`    |
| Texto principal       | `text-wc-text-primary`                      | `--wc-text-primary`      |
| Texto secundario      | `text-wc-text-muted`                        | `--wc-text-muted`        |
| Acento dorado         | `text-wc-accent-gold` / `bg-wc-accent-gold` | `--wc-accent-gold`       |
| Éxito                 | `text-wc-success` / `bg-wc-success-surface` | `--wc-success`           |
| Error                 | `text-wc-danger`                            | `--wc-danger`            |

---

## 🤝 Contribución

1. Crear un branch desde `main` con el nombre indicado en el issue
2. Desarrollar los cambios siguiendo las convenciones del proyecto
3. Asegurarse de que los tests pasen y el coverage sea ≥ 80%
4. Abrir un Pull Request hacia `main` referenciando el issue (`Closes #N`)

---

## 📄 Licencia

MIT
