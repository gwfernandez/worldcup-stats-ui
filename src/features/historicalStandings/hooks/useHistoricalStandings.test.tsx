import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useHistoricalStandings } from './useHistoricalStandings';
import { getHistoricalStandings } from '@/services/historicalStandingsService';
import { MOCK_HISTORICAL_STANDINGS } from '@/features/historicalStandings/mocks/historicalStandings.mock';
import type { ReactNode } from 'react';

// Mock the service
vi.mock('@/services/historicalStandingsService', () => ({
  getHistoricalStandings: vi.fn(),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  const Wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = 'QueryClientWrapper';
  return Wrapper;
};

describe('useHistoricalStandings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debería retornar el estado inicial de carga', () => {
    vi.mocked(getHistoricalStandings).mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useHistoricalStandings(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.standings).toEqual([]);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('debería retornar la tabla de posiciones exitosamente', async () => {
    vi.mocked(getHistoricalStandings).mockResolvedValue(MOCK_HISTORICAL_STANDINGS);

    const { result } = renderHook(() => useHistoricalStandings(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.standings).toEqual(MOCK_HISTORICAL_STANDINGS);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('debería retornar un estado de error si el servicio falla', async () => {
    const mockError = new Error('API Error');
    vi.mocked(getHistoricalStandings).mockRejectedValue(mockError);

    const { result } = renderHook(() => useHistoricalStandings(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.standings).toEqual([]);
    expect(result.current.error).toEqual(mockError);
  });
});
