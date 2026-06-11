import { beforeEach, describe, expect, it } from 'vitest';
import { resetUIStore, useUIStore } from './ui.store';

describe('useUIStore', () => {
  beforeEach(() => {
    localStorage.clear();
    resetUIStore();
  });

  it('expone el estado inicial de preferencias de UI', () => {
    expect(useUIStore.getState()).toMatchObject({
      language: 'es',
      selectedYear: null,
      filters: {},
    });
  });

  it('actualiza idioma y mundial seleccionado', () => {
    useUIStore.getState().setLanguage('en');
    useUIStore.getState().setSelectedYear(1986);

    expect(useUIStore.getState().language).toBe('en');
    expect(useUIStore.getState().selectedYear).toBe(1986);
  });

  it('guarda filtros por scope sin mezclar vistas', () => {
    useUIStore.getState().setFilter('championshipTeams', 'name', 'Argentina');
    useUIStore.getState().setFilter('historicalStandings', 'confederation', 'UEFA');

    expect(useUIStore.getState().filters.championshipTeams).toEqual({
      name: 'Argentina',
    });
    expect(useUIStore.getState().filters.historicalStandings).toEqual({
      confederation: 'UEFA',
    });
  });

  it('reemplaza y limpia filtros de un scope', () => {
    useUIStore.getState().setFilters('championshipScorers', {
      team: 'BR',
      phase: 'Final',
    });

    expect(useUIStore.getState().filters.championshipScorers).toEqual({
      team: 'BR',
      phase: 'Final',
    });

    useUIStore.getState().resetFilters('championshipScorers');

    expect(useUIStore.getState().filters.championshipScorers).toBeUndefined();
  });
});
