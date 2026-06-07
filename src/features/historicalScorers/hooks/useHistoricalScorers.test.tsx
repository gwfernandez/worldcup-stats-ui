import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useHistoricalScorers } from './useHistoricalScorers';
import { getHistoricalScorers } from '@/services/historicalScorersService';
import { MOCK_HISTORICAL_SCORERS } from '@/features/historicalScorers/mocks/historicalScorers.mock';
import type { ReactNode } from 'react';

// Mock the service
vi.mock('@/services/historicalScorersService', () => ({
  getHistoricalScorers: vi.fn(),
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

describe('useHistoricalScorers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debería retornar el estado inicial de carga', () => {
    vi.mocked(getHistoricalScorers).mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useHistoricalScorers(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.scorers).toEqual([]);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('debería retornar la lista de goleadores exitosamente', async () => {
    vi.mocked(getHistoricalScorers).mockResolvedValue(MOCK_HISTORICAL_SCORERS);

    const { result } = renderHook(() => useHistoricalScorers(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.scorers).toEqual(MOCK_HISTORICAL_SCORERS);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('debería retornar un estado de error si el servicio falla', async () => {
    const mockError = new Error('API Error');
    vi.mocked(getHistoricalScorers).mockRejectedValue(mockError);

    const { result } = renderHook(() => useHistoricalScorers(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.scorers).toEqual([]);
    expect(result.current.error).toEqual(mockError);
  });
});
