import { useEffect } from 'react';
import { X } from 'lucide-react';
import type { Team } from '@/types/team.types';
import {
  POSITION_LABEL,
  POSITION_STYLES,
  PERFORMANCE_LABEL,
  PERFORMANCE_STYLES,
} from '@/types/team.types';
import { FlagImage } from '@/components/shared';

// ─── Props ────────────────────────────────────────────────────────────────────

export interface PlayersModalProps {
  team: Team | null;
  onClose: () => void;
}

// ─── Componente ───────────────────────────────────────────────────────────────

/**
 * Modal con el plantel completo de una selección.
 * Muestra metadata del equipo y tabla de jugadores con posición coloreada.
 */
export function PlayersModal({ team, onClose }: PlayersModalProps) {
  useEffect(() => {
    if (!team) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [team, onClose]);

  if (!team) return null;

  const sorted = [...team.players].sort((a, b) => a.number - b.number);

  return (
    <div
      className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 px-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Plantel de ${team.name}`}
    >
      <div
        className="bg-wc-surface-primary border border-wc-border-primary rounded-xl w-full max-w-lg max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-wc-border-primary">
          <div className="flex items-center gap-2 text-sm font-medium text-wc-text-primary">
            <FlagImage
              countryCode={team.teamCode}
              alt={team.name}
              width={20}
              height={15}
              className="rounded-[2px]"
            />
            {team.name} — Plantel
          </div>
          <button
            onClick={onClose}
            className="text-wc-text-muted hover:text-wc-text-primary transition-colors focus:outline-none"
            aria-label="Cerrar"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-4 py-4">
          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-2 px-3 py-2.5 bg-wc-surface-secondary border border-wc-border-primary rounded-lg mb-4">
            <span className="text-[11px] text-wc-text-muted flex items-center gap-1">
              DT: <span className="text-wc-text-primary ml-1">{team.coach}</span>
            </span>
            <span className="text-wc-border-primary">·</span>
            <span className="text-[11px] text-wc-text-muted flex items-center gap-1">
              Grupo: <span className="text-wc-text-primary ml-1">{team.group}</span>
            </span>
            <span className="text-wc-border-primary">·</span>
            <span className="text-[11px] text-wc-text-muted flex items-center gap-1">
              Conf: <span className="text-wc-text-primary ml-1">{team.confederation}</span>
            </span>
            <span className="text-wc-border-primary">·</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full border ${PERFORMANCE_STYLES[team.performance]}`}
            >
              {PERFORMANCE_LABEL[team.performance]}
            </span>
          </div>

          {/* Tabla de jugadores */}
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-wc-border-primary">
                <th className="text-left text-[11px] font-normal text-wc-text-muted pb-2 pr-3 w-9">
                  #
                </th>
                <th className="text-left text-[11px] font-normal text-wc-text-muted pb-2 pr-3">
                  Nombre
                </th>
                <th className="text-left text-[11px] font-normal text-wc-text-muted pb-2 pr-3">
                  Apellido
                </th>
                <th className="text-left text-[11px] font-normal text-wc-text-muted pb-2">
                  Posición
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((player) => (
                <tr key={player.id} className="border-t border-wc-surface-secondary">
                  <td className="py-2 pr-3 text-[11px] text-wc-text-muted">{player.number}</td>
                  <td className="py-2 pr-3 text-xs text-wc-text-primary">{player.firstName}</td>
                  <td className="py-2 pr-3 text-xs text-wc-text-primary">{player.lastName}</td>
                  <td className="py-2">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full border ${POSITION_STYLES[player.position]}`}
                    >
                      {POSITION_LABEL[player.position]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
