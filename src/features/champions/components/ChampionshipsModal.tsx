import { useEffect } from 'react';
import { X } from 'lucide-react';
import type { ChampionTeam } from '@/types/champion.types';
import { FlagImage } from '@/components/shared';
import { useTranslation } from 'react-i18next';

// ─── Props ────────────────────────────────────────────────────────────────────

export interface ChampionshipsModalProps {
  team: ChampionTeam | null;
  onClose: () => void;
}

// ─── Componente ───────────────────────────────────────────────────────────────

/**
 * Modal con el detalle de todos los campeonatos ganados por una selección.
 * Muestra año, sede y resultado de la final.
 */
export function ChampionshipsModal({ team, onClose }: ChampionshipsModalProps) {
  const { t } = useTranslation('common');

  useEffect(() => {
    if (!team) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [team, onClose]);

  if (!team) return null;

  const sorted = [...team.championships].sort((a, b) => a.year - b.year);
  const firstTitle = sorted[0]?.year;
  const lastTitle = sorted[sorted.length - 1]?.year;

  return (
    <div
      className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 px-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={t('titlesDialog.titleFor', { team: team.teamName })}
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
              alt={team.teamName}
              width={20}
              height={15}
              className="rounded-[2px]"
            />
            {team.teamName} - {t('labels.titles')}
          </div>
          <button
            onClick={onClose}
            className="text-wc-text-muted hover:text-wc-text-primary transition-colors focus:outline-none"
            aria-label={t('actions.close')}
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-4 py-4">
          {/* Stats resumen */}
          <div className="flex gap-5 px-4 py-3 bg-wc-surface-secondary border border-wc-border-primary rounded-lg mb-4">
            {[
              { val: `${team.titles} 🏆`, lbl: t('labels.totalTitles') },
              { val: firstTitle ?? '-', lbl: t('labels.firstTitle') },
              { val: lastTitle ?? '-', lbl: t('labels.lastTitle') },
            ].map(({ val, lbl }) => (
              <div key={lbl} className="text-center flex-1">
                <p className="text-[17px] font-medium text-wc-accent-gold leading-none">{val}</p>
                <p className="text-[10px] text-wc-text-muted mt-1">{lbl}</p>
              </div>
            ))}
          </div>

          {/* Tabla de campeonatos */}
          <table className="w-full border-collapse text-[11px]">
            <thead>
              <tr className="border-b border-wc-border-primary">
                <th className="text-left font-normal text-wc-text-muted pb-2 pr-3">
                  {t('labels.year')}
                </th>
                <th className="text-left font-normal text-wc-text-muted pb-2 pr-3">
                  {t('labels.host')}
                </th>
                <th className="text-right font-normal text-wc-text-muted pb-2">
                  {t('labels.final')}
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((c) => (
                <tr key={c.year} className="border-t border-wc-surface-secondary">
                  {/* Año */}
                  <td className="py-2 pr-3">
                    <span className="font-medium text-wc-accent-gold text-[12px]">{c.year}</span>
                  </td>

                  {/* Sede */}
                  <td className="py-2 pr-3">
                    <div className="flex items-center gap-1.5">
                      <FlagImage
                        countryCode={c.hostCode}
                        alt={c.host}
                        width={13}
                        height={9}
                        className="rounded-[1px] shrink-0"
                      />
                      <span className="text-wc-text-muted">{c.host}</span>
                    </div>
                  </td>

                  {/* Resultado de la final */}
                  <td className="py-2 text-right">
                    <span className="font-medium text-wc-accent-gold">{c.finalScore}</span>{' '}
                    <span className="text-wc-text-muted">
                      vs{' '}
                      <FlagImage
                        countryCode={c.finalOpponentCode}
                        alt=""
                        width={12}
                        height={8}
                        className="rounded-[1px] inline-block mx-0.5 align-middle"
                      />
                      {c.finalOpponent}
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
