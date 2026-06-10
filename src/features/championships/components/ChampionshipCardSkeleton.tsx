import { Skeleton } from '@/components/ui/Skeleton';

/**
 * Esqueleto de carga para ChampionshipCard.
 * Replica la estructura visual de la tarjeta (logo, año, país, campeón)
 * con elementos difusos animados para evitar layout shift.
 */
export function ChampionshipCardSkeleton() {
  return (
    <div
      className="relative w-full bg-wc-surface-primary border border-wc-border-primary rounded-xl overflow-hidden"
      aria-hidden="true"
    >
      {/* Barra lateral */}
      <Skeleton className="absolute top-0 left-0 w-[3px] h-full rounded-none opacity-30" />

      {/* Logo placeholder */}
      <div className="flex items-center justify-center h-24 bg-wc-surface-secondary border-b border-wc-border-primary px-4">
        <Skeleton className="h-14 w-14 rounded-lg" />
      </div>

      {/* Info */}
      <div className="pl-4 pr-3 py-3 flex flex-col gap-2">
        {/* Año */}
        <Skeleton className="h-4 w-10" />

        {/* País */}
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-3 w-4 rounded-[2px]" />
          <Skeleton className="h-3 w-16" />
        </div>

        {/* Divider */}
        <div className="h-px bg-wc-border-primary" />

        {/* Campeón */}
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}
