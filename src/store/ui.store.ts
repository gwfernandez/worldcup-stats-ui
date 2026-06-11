import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type SupportedLanguage = 'es' | 'en';

export type UIFilterScope =
  | 'championships'
  | 'championshipTeams'
  | 'championshipScorers'
  | 'championshipStadiums'
  | 'historicalStandings'
  | 'historicalScorers';

export type UIFilterValues = Record<string, string>;

export interface UIStoreState {
  language: SupportedLanguage;
  selectedYear: number | null;
  filters: Partial<Record<UIFilterScope, UIFilterValues>>;
  setLanguage: (language: SupportedLanguage) => void;
  setSelectedYear: (year: number | null) => void;
  setFilter: (scope: UIFilterScope, key: string, value: string) => void;
  setFilters: (scope: UIFilterScope, filters: UIFilterValues) => void;
  resetFilters: (scope: UIFilterScope) => void;
}

export const DEFAULT_LANGUAGE: SupportedLanguage = 'es';

const initialState = {
  language: DEFAULT_LANGUAGE,
  selectedYear: null,
  filters: {},
};

export const useUIStore = create<UIStoreState>()(
  persist(
    (set) => ({
      ...initialState,
      setLanguage: (language) => set({ language }),
      setSelectedYear: (selectedYear) => set({ selectedYear }),
      setFilter: (scope, key, value) =>
        set((state) => ({
          filters: {
            ...state.filters,
            [scope]: {
              ...state.filters[scope],
              [key]: value,
            },
          },
        })),
      setFilters: (scope, filters) =>
        set((state) => ({
          filters: {
            ...state.filters,
            [scope]: filters,
          },
        })),
      resetFilters: (scope) =>
        set((state) => {
          const filters = { ...state.filters };
          delete filters[scope];
          return { filters };
        }),
    }),
    {
      name: 'worldcup-stats-ui',
      storage: createJSONStorage(() => localStorage),
      partialize: ({ language, selectedYear, filters }) => ({
        language,
        selectedYear,
        filters,
      }),
    },
  ),
);

export const resetUIStore = (): void => {
  useUIStore.setState(initialState);
};
