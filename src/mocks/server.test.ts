import { describe, expect, it } from 'vitest';
import { api } from '@/services/api';
import { MOCK_CHAMPIONSHIPS_RESPONSE } from '@/features/championships/mocks/championship.mock';

describe('msw server', () => {
  it('intercepta una petición HTTP hecha con la instancia de Axios', async () => {
    const { data } = await api.get('/api/championships?size=50');

    expect(data).toEqual(MOCK_CHAMPIONSHIPS_RESPONSE);
  });
});
