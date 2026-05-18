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

| Categoría | Tecnología |
|---|---|
| Framework | React 19 + Vite |
| Lenguaje | TypeScript (strict) |
| Routing | React Router v7 |
| Data fetching | TanStack Query v5 + Axios |
| Validación de esquemas | Zod |
| Estado global | Zustand |
| Estilos | Tailwind CSS v4 + shadcn/ui |
| Iconografía | Lucide React |
| Gráficos | Recharts |
| i18n | react-i18next |
| Testing | Vitest + React Testing Library |
| Calidad | ESLint + Prettier + Husky + lint-staged |

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

| Variable | Descripción |
|---|---|
| `VITE_API_BASE_URL` | URL base de la REST API de datos |

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

| Ruta | Descripción |
|---|---|
| `/` | Home — listado de todas las ediciones |
| `/worldcup/:year` | Vista general de un mundial |
| `/worldcup/:year/teams` | Equipos participantes |
| `/worldcup/:year/fixture` | Fixture y resultados |
| `/worldcup/:year/scorers` | Tabla de goleadores |
| `/worldcup/:year/team/:id` | Plantel de una selección |

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

| Tipo | Convención | Ejemplo |
|---|---|---|
| Componente | `PascalCase.tsx` | `MatchCard.tsx` |
| Hook | `camelCase.ts` (prefijo `use`) | `useFixture.ts` |
| Service | `camelCase.ts` | `fixtureService.ts` |
| Tipos | `camelCase.types.ts` | `fixture.types.ts` |
| Test | `{archivo}.test.tsx/ts` | `MatchCard.test.tsx` |

### Commits

Este proyecto sigue la especificación [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(scorers): agregar tabla de goleadores con paginación
fix(fixture): corregir renderizado de partidos sin resultado
style(teams): ajustar espaciado en la card de selección
types(players): agregar interfaz PlayerStats
```

Los commits se validan automáticamente en el pre-commit hook mediante **Husky** y **lint-staged**.

---

## 🤝 Contribución

1. Crear un branch desde `main` con el nombre indicado en el issue
2. Desarrollar los cambios siguiendo las convenciones del proyecto
3. Asegurarse de que los tests pasen y el coverage sea ≥ 80%
4. Abrir un Pull Request hacia `main` referenciando el issue (`Closes #N`)

---

## 📄 Licencia

MIT
