import { describe, it, expect } from 'vitest';
import { fifaToAlpha2 } from './flag.utils';

describe('fifaToAlpha2', () => {
  it('maps FIFA codes to flag-icons alpha-2 codes', () => {
    expect(fifaToAlpha2('ARG')).toBe('ar');
    expect(fifaToAlpha2('BRA')).toBe('br');
    expect(fifaToAlpha2('URU')).toBe('uy');
    expect(fifaToAlpha2('ITA')).toBe('it');
    expect(fifaToAlpha2('GER')).toBe('de');
    expect(fifaToAlpha2('FRG')).toBe('de');
    expect(fifaToAlpha2('USA')).toBe('us');
    expect(fifaToAlpha2('MEX')).toBe('mx');
    expect(fifaToAlpha2('CAN')).toBe('ca');
  });

  it('maps special flag-icons country subdivision codes', () => {
    expect(fifaToAlpha2('ENG')).toBe('gb-eng');
    expect(fifaToAlpha2('SCO')).toBe('gb-sct');
    expect(fifaToAlpha2('WAL')).toBe('gb-wls');
    expect(fifaToAlpha2('NIR')).toBe('gb-nir');
  });

  it('keeps compatibility with supported alpha-2 codes already used by the UI', () => {
    expect(fifaToAlpha2('AR')).toBe('ar');
    expect(fifaToAlpha2('br')).toBe('br');
    expect(fifaToAlpha2('DE')).toBe('de');
    expect(fifaToAlpha2('GB')).toBe('gb');
  });

  it('returns null for dissolved or unsupported nations', () => {
    expect(fifaToAlpha2('URS')).toBeNull();
    expect(fifaToAlpha2('TCH')).toBeNull();
    expect(fifaToAlpha2('YUG')).toBeNull();
    expect(fifaToAlpha2('SCG')).toBeNull();
    expect(fifaToAlpha2('ZAI')).toBeNull();
    expect(fifaToAlpha2('SU')).toBeNull();
    expect(fifaToAlpha2('CS')).toBeNull();
  });

  it('returns null for invalid codes', () => {
    expect(fifaToAlpha2('XX')).toBeNull();
    expect(fifaToAlpha2('UNKNOWN')).toBeNull();
    expect(fifaToAlpha2('')).toBeNull();
  });
});
