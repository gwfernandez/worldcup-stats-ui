import { api } from '@/services/api';
import {
  ChampionshipStadiumListResponseSchema,
  type ChampionshipStadiumList,
  type ChampionshipStadiumListResponse,
} from '@/types/stadium.types';

export const CHAMPIONSHIP_STADIUMS_PAGE_SIZE = 100;

const getChampionshipStadiumsPage = async (
  year: number,
  page: number,
): Promise<ChampionshipStadiumListResponse> => {
  const { data } = await api.get(`/api/championships/${year}/stadiums`, {
    params: { page, size: CHAMPIONSHIP_STADIUMS_PAGE_SIZE },
  });

  return ChampionshipStadiumListResponseSchema.parse(data);
};

export const getChampionshipStadiums = async (
  year: number,
): Promise<ChampionshipStadiumList> => {
  const firstPage = await getChampionshipStadiumsPage(year, 1);
  const stadiums = [...firstPage.data];

  for (let page = 2; page <= firstPage.pagination.totalPages; page += 1) {
    const response = await getChampionshipStadiumsPage(year, page);
    stadiums.push(...response.data);
  }

  return stadiums;
};
