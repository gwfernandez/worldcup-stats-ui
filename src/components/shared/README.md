# Componentes compartidos (`src/components/shared/`)

Componentes reutilizables de UI usados en múltiples features. No importan desde `features/`.

## SearchInput

Input de texto con ícono de búsqueda para barras de filtros.

```tsx
<SearchInput
  className="flex-[2]"
  placeholder="Buscar selección..."
  value={searchName}
  onChange={(e) => setSearchName(e.target.value)}
/>
```

## FilterSelect

`<select>` estilizado con chevron y opción vacía configurable.

```tsx
<FilterSelect
  className="flex-1"
  value={filterConf}
  onChange={(e) => setFilterConf(e.target.value)}
  placeholderOption="Todas las confederaciones"
  options={confOptions.map((c) => ({ value: c, label: c }))}
/>
```

## Tooltip

Tooltip CSS al hover. Usa `groupName` fijos (`conf`, `action`, `th`, `tooltip`) para compatibilidad con Tailwind.

```tsx
<Tooltip content={confTooltip} groupName="conf" hideWhenEmpty>
  <span>{team.confederation}</span>
</Tooltip>
```

## FlagImage

Imagen de bandera vía [FlagCDN](https://flagcdn.com). Oculta la imagen si falla la carga.

```tsx
<FlagImage countryCode={team.teamCode} alt={team.name} />
<FlagImage countryCode={homeTeamCode} alt={homeTeam} size="md" width={36} height={27} />
```

La URL se construye con `getFlagUrl()` en `src/utils/flag.utils.ts`.

## Pagination

Paginado reutilizable (ver `Pagination.tsx`).
