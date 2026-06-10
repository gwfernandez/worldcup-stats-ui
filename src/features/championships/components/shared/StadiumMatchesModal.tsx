import { useEffect } from 'react';
import { Building, X, MapPin, Users, AlertCircle } from 'lucide-react';
import type { Stadium } from '@/types/stadium.types';
import { MatchRow } from './MatchRow';
import type { Match } from '@/types/championship.types';

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
            <Building size={15} stroke="#e8c84a" aria-hidden="true" />
            {stadium.name}
          </div>
          <button
            onClick={onClose}
            className="text-[#8a8fa8] hover:text-[#e8eaf0] transition-colors focus:outline-none"
            aria-label="Cerrar"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-4 py-4">
          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-2 px-3 py-2.5 bg-[#1e2233] border border-[#2a2d3a] rounded-lg mb-4 text-[11px]">
            <span className="text-[#8a8fa8] flex items-center gap-1">
              <MapPin size={11} aria-hidden="true" />
              Ciudad: <span className="text-[#e8eaf0] ml-1">{stadium.city}</span>
            </span>
            {stadium.capacity && (
              <>
                <span className="text-[#2a2d3a]">·</span>
                <span className="text-[#8a8fa8] flex items-center gap-1">
                  <Users size={11} aria-hidden="true" />
                  Cap:{' '}
                  <span className="text-[#e8eaf0] ml-1">{stadium.capacity.toLocaleString()}</span>
                </span>
              </>
            )}
            <span className="text-[#2a2d3a]">·</span>
            <span className="text-[#8a8fa8] flex items-center gap-1">
              <AlertCircle size={11} aria-hidden="true" />
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
