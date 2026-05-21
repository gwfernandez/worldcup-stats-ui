import { describe, it, expect } from 'vitest';
import { getFlagUrl } from './flag.utils';

describe('getFlagUrl', () => {
  it('returns sm flag url by default', () => {
    expect(getFlagUrl('AR')).toBe('https://flagcdn.com/24x18/ar.png');
  });

  it('returns md flag url when size is md', () => {
    expect(getFlagUrl('DE', 'md')).toBe('https://flagcdn.com/48x36/de.png');
  });
});
