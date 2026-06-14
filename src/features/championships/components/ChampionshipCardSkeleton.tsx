import { Skeleton } from '@/components/ui/Skeleton';

/**
 * Esqueleto de carga para ChampionshipCard.
 * Replica la estructura minimalista de la tarjeta (bandera, año y país)
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

      {/* Contenido centrado */}
      <div className="flex flex-col items-center gap-2.5 px-4 py-5">
        <Skeleton className="h-[72px] w-24 rounded-md" />
        <Skeleton className="h-[22px] w-14" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}
