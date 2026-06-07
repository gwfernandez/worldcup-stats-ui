import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useChampions } from './useChampions';
import { getChampions } from '@/services/championsService';
import { MOCK_CHAMPIONS } from '@/features/champions/mocks/champions.mock';
import type { ReactNode } from 'react';

// Mock the service
vi.mock('@/services/championsService', () => ({
  getChampions: vi.fn(),
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

describe('useChampions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debería retornar el estado inicial de carga', () => {
    vi.mocked(getChampions).mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useChampions(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.champions).toEqual([]);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('debería retornar la lista de campeones exitosamente', async () => {
    vi.mocked(getChampions).mockResolvedValue(MOCK_CHAMPIONS);

    const { result } = renderHook(() => useChampions(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.champions).toEqual(MOCK_CHAMPIONS);
    expect(result.current.isError).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('debería retornar un estado de error si el servicio falla', async () => {
    const mockError = new Error('API Error');
    vi.mocked(getChampions).mockRejectedValue(mockError);

    const { result } = renderHook(() => useChampions(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.champions).toEqual([]);
    expect(result.current.error).toEqual(mockError);
  });
});
