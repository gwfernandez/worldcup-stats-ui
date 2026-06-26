import { useState, useMemo } from 'react';
import { MapPin, Clock } from 'lucide-react';
import type { ChampionshipStadium } from '@/types/stadium.types';
import type { Match } from '@/types/championship.types';
import { MatchModal } from '../shared/MatchModal';
import { StadiumMatchesModal } from '../shared/StadiumMatchesModal';
import { SearchInput, TableSkeleton } from '@/components/shared';
import { useTranslation } from 'react-i18next';
import { useUIStore } from '@/store/ui.store';
import { useChampionshipStadiums } from '../../hooks/useChampionshipStadiums';

// ─── Props ────────────────────────────────────────────────────────────────────

export interface StadiumsTabProps {
  year: number;
}

// ─── Componente ───────────────────────────────────────────────────────────────

/**
 * Solapa de estadios.
 * Filtro por nombre, tabla con capacidad y conteo de partidos,
 * pais y partidos (modal).
 * Al hacer click en un partido del modal se abre el MatchModal de detalle.
 */
export function StadiumsTab({ year }: StadiumsTabProps) {
  const { t } = useTranslation(['common', 'championships']);
  const [selectedStadium, setSelectedStadium] = useState<ChampionshipStadium | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const { stadiums, isLoading, isError } = useChampionshipStadiums(year);
  const searchName = useUIStore((state) => state.filters.championshipStadiums?.name ?? '');
  const setFilter = useUIStore((state) => state.setFilter);

  const filtered = useMemo(
    () => stadiums.filter((s) => s.name.toLowerCase().includes(searchName.toLowerCase())),
    [stadiums, searchName],
  );

  const handleMatchSelect = (match: Match) => {
    setSelectedStadium(null); // cierra modal de estadio
    setSelectedMatch(match); // abre modal de partido
  };

  if (isLoading) {
    return <TableSkeleton cols={6} rows={8} showPagination={false} />;
  }

  if (isError) {
    return (
      <p className="py-8 text-center text-sm text-wc-danger-text">
        {t('championships:stadiums.loadError')}
      </p>
    );
  }

  return (
    <>
      {/* ── Filtro ───────────────────────────────────────────────── */}
      <div className="flex gap-2.5 mb-4">
        <SearchInput
          className="flex-[2]"
          placeholder={t('search.stadium')}
          value={searchName}
          onChange={(e) => setFilter('championshipStadiums', 'name', e.target.value)}
        />
      </div>

      {/* ── Tabla ────────────────────────────────────────────────── */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-wc-border-primary">
            <th className="text-left text-[11px] font-normal text-wc-text-muted pb-2">
              {t('labels.stadium')}
            </th>
            <th className="text-left text-[11px] font-normal text-wc-text-muted pb-2">
              {t('labels.city')}
            </th>
            <th className="text-left text-[11px] font-normal text-wc-text-muted pb-2">
              {t('labels.country')}
            </th>
            <th className="text-left text-[11px] font-normal text-wc-text-muted pb-2">
              {t('labels.capacity')}
            </th>
            <th className="text-left text-[11px] font-normal text-wc-text-muted pb-2">
              {t('labels.matches')}
            </th>
            <th className="text-center text-[11px] font-normal text-wc-text-muted pb-2">
              {t('labels.actions')}
            </th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 && (
            <tr>
              <td colSpan={6} className="py-8 text-center text-sm text-wc-text-muted">
                {t('empty.stadiums')}
              </td>
            </tr>
          )}
          {filtered.map((stadium) => (
            <tr
              key={stadium.id}
              className="border-t border-wc-surface-secondary hover:bg-wc-surface-primary transition-colors duration-150"
            >
              {/* Nombre */}
              <td className="py-2.5 pr-3">
                <span className="text-xs text-wc-text-primary">{stadium.name}</span>
              </td>

              {/* Ciudad */}
              <td className="py-2.5 pr-3">
                <div className="flex items-center gap-1.5 text-xs text-wc-text-muted">
                  <MapPin size={11} aria-hidden="true" />
                  {stadium.cityName}
                </div>
              </td>

              {/* Pais */}
              <td className="py-2.5 pr-3">
                <span className="text-xs text-wc-text-muted">{stadium.country?.name ?? '—'}</span>
              </td>

              {/* Capacidad */}
              <td className="py-2.5 pr-3">
                <span className="text-xs text-wc-text-muted">
                  {stadium.capacity > 0 ? stadium.capacity.toLocaleString() : '—'}
                </span>
              </td>

              {/* Conteo de partidos */}
              <td className="py-2.5 pr-3">
                <div className="flex items-center gap-1.5 text-xs text-wc-text-muted">
                  <Clock size={11} aria-hidden="true" />
                  {stadium.matchesPlayed}
                </div>
              </td>

              {/* Acciones */}
              <td className="py-2.5 text-center">
                <div className="flex items-center justify-center gap-1.5">
                  {/* Botón partidos */}
                  <div className="relative group/matches">
                    <button
                      onClick={() => setSelectedStadium(stadium)}
                      className="flex items-center justify-center w-7 h-7 border border-wc-border-primary rounded-md text-wc-text-muted hover:border-wc-accent-gold hover:text-wc-accent-gold transition-colors focus:outline-none"
                      aria-label={t('actions.viewMatchesAt', { stadium: stadium.name })}
                    >
                      <Clock size={13} aria-hidden="true" />
                    </button>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-wc-surface-secondary border border-wc-border-primary rounded-md text-[10px] text-wc-text-primary whitespace-nowrap opacity-0 group-hover/matches:opacity-100 transition-opacity duration-150 pointer-events-none z-10">
                      {t('labels.matches')}
                      <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-wc-border-primary" />
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal partidos del estadio */}
      <StadiumMatchesModal
        stadium={selectedStadium}
        onClose={() => setSelectedStadium(null)}
        onMatchSelect={handleMatchSelect}
      />

      {/* Modal detalle de partido */}
      <MatchModal match={selectedMatch} onClose={() => setSelectedMatch(null)} />
    </>
  );
}
