import { useEffect } from 'react';
import type { Stadium } from '../../../../types/stadium.types';
import { MatchRow } from './MatchRow';
import type { Match } from '../../../../types/worldcup.types';

// ─── Props ────────────────────────────────────────────────────────────────────

export interface StadiumMatchesModalProps {
  stadium: Stadium | null;
  onClose: () => void;
  onMatchSelect: (match: Match) => void;
}

// ─── Componente ───────────────────────────────────────────────────────────────

/**
 * Modal con los partidos jugados en un estadio.
 * Reutiliza MatchRow para consistencia visual con el resto de la app.
 */
export function StadiumMatchesModal({ stadium, onClose, onMatchSelect }: StadiumMatchesModalProps) {
  useEffect(() => {
    if (!stadium) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [stadium, onClose]);

  if (!stadium) return null;

  const sorted = [...stadium.matches].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  return (
    <div
      className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 px-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Partidos en ${stadium.name}`}
    >
      <div
        className="bg-[#161925] border border-[#2a2d3a] rounded-xl w-full max-w-lg max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#2a2d3a]">
          <div className="flex items-center gap-2 text-sm font-medium text-[#e8eaf0]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#e8c84a"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8" />
              <path d="M6 20v-2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" />
              <path d="M2 10V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4" />
            </svg>
            {stadium.name}
          </div>
          <button
            onClick={onClose}
            className="text-[#8a8fa8] hover:text-[#e8eaf0] transition-colors focus:outline-none"
            aria-label="Cerrar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="px-4 py-4">
          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-2 px-3 py-2.5 bg-[#1e2233] border border-[#2a2d3a] rounded-lg mb-4 text-[11px]">
            <span className="text-[#8a8fa8] flex items-center gap-1">
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
                aria-hidden="true"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              Ciudad: <span className="text-[#e8eaf0] ml-1">{stadium.city}</span>
            </span>
            {stadium.capacity && (
              <>
                <span className="text-[#2a2d3a]">·</span>
                <span className="text-[#8a8fa8] flex items-center gap-1">
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
                    aria-hidden="true"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  Cap:{' '}
                  <span className="text-[#e8eaf0] ml-1">{stadium.capacity.toLocaleString()}</span>
                </span>
              </>
            )}
            <span className="text-[#2a2d3a]">·</span>
            <span className="text-[#8a8fa8] flex items-center gap-1">
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
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              Partidos: <span className="text-[#e8eaf0] ml-1">{stadium.matches.length}</span>
            </span>
          </div>

          {/* Lista de partidos */}
          <div className="bg-[#1e2233] border border-[#2a2d3a] rounded-lg overflow-hidden">
            {sorted.map((match) => (
              <MatchRow key={match.id} match={match} onSelect={onMatchSelect} showWinner />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
