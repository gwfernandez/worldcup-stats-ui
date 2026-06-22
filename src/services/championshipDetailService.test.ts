import { describe, expect, it } from 'vitest';
import { getChampionshipDetail } from './championshipDetailService';

describe('championshipDetailService', () => {
  it('retorna el detalle mockeado validado para el año solicitado', async () => {
    const result = await getChampionshipDetail(1970);

    expect(result.year).toBe(1970);
    expect(result.country).toBe('Mexico');
    expect(result.groups.length).toBeGreaterThan(0);
    expect(result.eliminationPhases.length).toBeGreaterThan(0);
    expect(result.scorers.length).toBeGreaterThan(0);
    expect(result.stadiums.length).toBeGreaterThan(0);
    expect(result.standings.length).toBeGreaterThan(0);
  });
});
