import { useState, useMemo } from 'react';
import type { Scorer } from '@/types/scorer.types';
import { ScorerModal } from '@/features/championships/components/shared/ScorerModal';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const FLAG_URL = (code: string) => `https://flagcdn.com/24x18/${code.toLowerCase()}.png`;

const PAGE_SIZE = 10;

// ─── Props ────────────────────────────────────────────────────────────────────

export interface ScorersTabProps {
  scorers: Scorer[];
}

import { Pagination } from '@/components/shared/Pagination';

// ─── Componente principal ─────────────────────────────────────────────────────

/**
 * Solapa de goleadores.
 * Incluye filtros por nombre, selección y fase, tabla paginada y modal de detalle.
 * Muestra todos los jugadores con al menos un gol (PAGE_SIZE filas por página).
 */
export function ScorersTab({ scorers }: ScorersTabProps) {
  const [selectedScorer, setSelectedScorer] = useState<Scorer | null>(null);
  const [searchName, setSearchName] = useState('');
  const [filterTeam, setFilterTeam] = useState('');
  const [filterPhase, setFilterPhase] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Opciones dinámicas para los selects
  const teamOptions = useMemo(() => {
    const teams = [
      ...new Map(scorers.map((s) => [s.teamCode, { code: s.teamCode, name: s.teamName }])).values(),
    ];
    return teams.sort((a, b) => a.name.localeCompare(b.name));
  }, [scorers]);

  const phaseOptions = useMemo(() => {
    const phases = new Set(scorers.flatMap((s) => s.goals.map((g) => g.phase)));
    return [...phases].sort();
  }, [scorers]);

  // Máximo de goles para la barra proporcional
  const maxGoals = useMemo(() => Math.max(...scorers.map((s) => s.totalGoals), 1), [scorers]);

  // Filtrado completo (resetea página al cambiar filtros)
  const filtered = useMemo(() => {
    return scorers.filter((s) => {
      const matchesName = s.playerName.toLowerCase().includes(searchName.toLowerCase());
      const matchesTeam = filterTeam === '' || s.teamCode === filterTeam;
      const matchesPhase = filterPhase === '' || s.goals.some((g) => g.phase === filterPhase);
      return matchesName && matchesTeam && matchesPhase;
    });
  }, [scorers, searchName, filterTeam, filterPhase]);

  // Resetear a página 1 cuando cambian los filtros
  const handleFilterChange =
    (setter: (v: string) => void) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setter(e.target.value);
      setCurrentPage(1);
    };

  // Paginado
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Ranking global (posición sobre la lista filtrada completa, no solo la página)
  const globalRankOf = (scorer: Scorer) => filtered.indexOf(scorer) + 1;

  return (
    <>
      <div className="max-w-4xl mx-auto">
        {/* ── Fila 1: Filtros ─────────────────────────────────────── */}
        <div className="flex gap-2.5 mb-4">
          <div className="flex-[2] relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a8fa8] pointer-events-none"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Buscar jugador..."
              value={searchName}
              onChange={handleFilterChange(setSearchName)}
              className="w-full bg-[#161925] border border-[#2a2d3a] rounded-lg pl-8 pr-3 py-[7px] text-xs text-[#e8eaf0] placeholder:text-[#8a8fa8] outline-none focus:border-[#e8c84a] transition-colors"
            />
          </div>

          <div className="flex-1 relative">
            <select
              value={filterTeam}
              onChange={handleFilterChange(setFilterTeam)}
              className="w-full appearance-none bg-[#161925] border border-[#2a2d3a] rounded-lg px-3 py-[7px] pr-7 text-xs text-[#e8eaf0] outline-none focus:border-[#e8c84a] transition-colors cursor-pointer"
            >
              <option value="">Todas las selecciones</option>
              {teamOptions.map((t) => (
                <option key={t.code} value={t.code}>
                  {t.name}
                </option>
              ))}
            </select>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8a8fa8] pointer-events-none"
              aria-hidden="true"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>

          <div className="flex-1 relative">
            <select
              value={filterPhase}
              onChange={handleFilterChange(setFilterPhase)}
              className="w-full appearance-none bg-[#161925] border border-[#2a2d3a] rounded-lg px-3 py-[7px] pr-7 text-xs text-[#e8eaf0] outline-none focus:border-[#e8c84a] transition-colors cursor-pointer"
            >
              <option value="">Todas las fases</option>
              {phaseOptions.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8a8fa8] pointer-events-none"
              aria-hidden="true"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>

        {/* ── Fila 2: Tabla ───────────────────────────────────────── */}
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[#2a2d3a]">
              <th className="text-left text-[11px] font-normal text-[#8a8fa8] pb-2 pl-2 w-8">#</th>
              <th className="text-left text-[11px] font-normal text-[#8a8fa8] pb-2">Jugador</th>
              <th className="text-left text-[11px] font-normal text-[#8a8fa8] pb-2">Selección</th>
              <th className="text-right text-[11px] font-normal text-[#8a8fa8] pb-2 pr-2">Goles</th>
              <th className="text-right text-[11px] font-normal text-[#8a8fa8] pb-2 pr-2">
                Promedio
              </th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-sm text-[#8a8fa8]">
                  No se encontraron goleadores con esos filtros
                </td>
              </tr>
            )}
            {paginated.map((scorer) => {
              const rank = globalRankOf(scorer);
              const isTop3 = rank <= 3;
              const barWidth = Math.round((scorer.totalGoals / maxGoals) * 100);

              return (
                <tr
                  key={scorer.id}
                  onClick={() => setSelectedScorer(scorer)}
                  className="border-t border-[#1e2233] cursor-pointer hover:bg-[#161925] transition-colors duration-150 group"
                >
                  <td className="py-2.5 pl-2">
                    <span
                      className={`text-[11px] ${isTop3 ? 'text-[#e8c84a] font-medium' : 'text-[#8a8fa8]'}`}
                    >
                      {rank}
                    </span>
                  </td>
                  <td className="py-2.5 pr-3">
                    <span className="text-xs text-[#e8eaf0] group-hover:text-[#e8c84a] transition-colors">
                      {scorer.playerName}
                    </span>
                  </td>
                  <td className="py-2.5 pr-3">
                    <div className="flex items-center gap-1.5">
                      <img
                        src={FLAG_URL(scorer.teamCode)}
                        alt={scorer.teamName}
                        width={16}
                        height={11}
                        className="rounded-[1px] shrink-0"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <span className="text-xs text-[#e8eaf0]">{scorer.teamName}</span>
                    </div>
                  </td>
                  <td className="py-2.5 pr-2">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-1 bg-[#2a2d3a] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#e8c84a] rounded-full"
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                      <span className="text-[13px] font-medium text-[#e8c84a] min-w-[16px] text-right">
                        {scorer.totalGoals}
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 pr-2 text-right">
                    <span className="text-xs text-[#8a8fa8]">{scorer.average.toFixed(2)}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* ── Paginado ────────────────────────────────────────────── */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filtered.length}
          pageSize={PAGE_SIZE}
          itemsLabel="jugadores"
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Modal */}
      <ScorerModal scorer={selectedScorer} onClose={() => setSelectedScorer(null)} />
    </>
  );
}
