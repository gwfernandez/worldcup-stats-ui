import { useEffect } from 'react';
import { X } from 'lucide-react';
import type { Champion } from '@/types/champion.types';
import { FlagImage } from '@/components/shared';
import { useTranslation } from 'react-i18next';
import { MOCK_CHAMPION_TITLE_DETAILS } from '../mocks/champions.mock';

export interface ChampionshipsModalProps {
  team: Champion | null;
  onClose: () => void;
}

export function ChampionshipsModal({ team, onClose }: ChampionshipsModalProps) {
  const { t } = useTranslation('common');

  useEffect(() => {
    if (!team) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [team, onClose]);

  if (!team) return null;

  const years = [...team.years].sort((a, b) => a - b);
  const detailsByYear = new Map(
    (MOCK_CHAMPION_TITLE_DETAILS[team.team.code] ?? []).map((detail) => [detail.year, detail]),
  );

  return (
    <div
      className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 px-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={t('titlesDialog.titleFor', { team: team.team.name })}
    >
      <div
        className="bg-wc-surface-primary border border-wc-border-primary rounded-xl w-full max-w-lg max-h-[85vh] overflow-y-auto"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-wc-border-primary">
          <div className="flex items-center gap-2 text-sm font-medium text-wc-text-primary">
            <FlagImage
              countryCode={team.team.code}
              alt={team.team.name}
              width={20}
              height={15}
              className="rounded-[2px]"
            />
            {team.team.name} - {t('labels.titles')}
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
          <div className="flex gap-5 px-4 py-3 bg-wc-surface-secondary border border-wc-border-primary rounded-lg mb-4">
            {[
              { val: `${team.wins} 🏆`, lbl: t('labels.totalTitles') },
              { val: years[0] ?? '-', lbl: t('labels.firstTitle') },
              { val: years[years.length - 1] ?? '-', lbl: t('labels.lastTitle') },
            ].map(({ val, lbl }) => (
              <div key={lbl} className="text-center flex-1">
                <p className="text-[17px] font-medium text-wc-accent-gold leading-none">{val}</p>
                <p className="text-[10px] text-wc-text-muted mt-1">{lbl}</p>
              </div>
            ))}
          </div>

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
              {years.map((year) => {
                const detail = detailsByYear.get(year);

                return (
                  <tr key={year} className="border-t border-wc-surface-secondary">
                    <td className="py-2 pr-3">
                      <span className="font-medium text-wc-accent-gold text-[12px]">{year}</span>
                    </td>
                    <td className="py-2 pr-3">
                      {detail ? (
                        <div className="flex items-center gap-1.5">
                          <FlagImage
                            countryCode={detail.hostCode}
                            alt={detail.host}
                            width={13}
                            height={9}
                            className="rounded-[1px] shrink-0"
                          />
                          <span className="text-wc-text-muted">{detail.host}</span>
                        </div>
                      ) : (
                        <span className="text-wc-text-muted">—</span>
                      )}
                    </td>
                    <td className="py-2 text-right">
                      {detail ? (
                        <>
                          <span className="font-medium text-wc-accent-gold">
                            {detail.finalScore}
                          </span>{' '}
                          <span className="text-wc-text-muted">
                            vs{' '}
                            <FlagImage
                              countryCode={detail.finalOpponentCode}
                              alt=""
                              width={12}
                              height={8}
                              className="rounded-[1px] inline-block mx-0.5 align-middle"
                            />
                            {detail.finalOpponent}
                          </span>
                        </>
                      ) : (
                        <span className="text-wc-text-muted">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
