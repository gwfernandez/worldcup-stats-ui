import { api } from '@/services/api';
import { ChampionListResponseSchema, type ChampionListResponse } from '@/types/champion.types';
import type { SupportedLanguage } from '@/store/ui.store';

export const CHAMPIONS_PAGE = 1;
export const CHAMPIONS_PAGE_SIZE = 15;

export const getChampions = async (
  page = CHAMPIONS_PAGE,
  size = CHAMPIONS_PAGE_SIZE,
  language: SupportedLanguage = 'es',
): Promise<ChampionListResponse> => {
  const { data } = await api.get('/api/champions', {
    params: { page, size },
    headers: { 'Accept-Language': language },
  });
  return ChampionListResponseSchema.parse(data);
};
