import { describe, expect, it } from 'vitest';
import { CONTINENT_BY_COUNTRY_CODE } from './championshipFilter.utils';

describe('CONTINENT_BY_COUNTRY_CODE', () => {
  it('resuelve codigos FIFA/ISO3 devueltos por la API', () => {
    expect(CONTINENT_BY_COUNTRY_CODE.URU).toBe('América');
    expect(CONTINENT_BY_COUNTRY_CODE.BRA).toBe('América');
    expect(CONTINENT_BY_COUNTRY_CODE.ITA).toBe('Europa');
    expect(CONTINENT_BY_COUNTRY_CODE.GER).toBe('Europa');
    expect(CONTINENT_BY_COUNTRY_CODE.KOR).toBe('Asia');
    expect(CONTINENT_BY_COUNTRY_CODE.RSA).toBe('África');
  });
});
