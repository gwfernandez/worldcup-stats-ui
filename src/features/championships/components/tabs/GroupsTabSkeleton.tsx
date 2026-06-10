import { Skeleton } from '@/components/ui/Skeleton';

interface GroupCardSkeletonProps {
  matchCount?: number;
  teamCount?: number;
}

function GroupCardSkeleton({ matchCount = 3, teamCount = 4 }: GroupCardSkeletonProps) {
  return (
    <div className="bg-wc-surface-primary border border-wc-border-primary rounded-xl mb-3 overflow-hidden">
      {/* Header */}
      <div className="px-3 py-2 border-b border-wc-border-primary">
        <Skeleton className="h-3.5 w-16" />
      </div>

      {/* Body: tabla | partidos */}
      <div className="grid grid-cols-2">
        {/* Tabla de posiciones */}
        <div className="border-r border-wc-border-primary p-2 flex flex-col gap-2">
          {/* Header row */}
          <div className="flex justify-between pb-1 border-b border-wc-border-primary">
            <Skeleton className="h-2.5 w-20" />
            <Skeleton className="h-2.5 w-16" />
          </div>
          {/* Team rows */}
          {Array.from({ length: teamCount }).map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Skeleton className="w-4 h-3 rounded-[2px]" />
                <Skeleton className="h-2.5 w-16" />
              </div>
              <Skeleton className="h-2.5 w-12" />
            </div>
          ))}
        </div>

        {/* Partidos */}
        <div className="flex flex-col">
          {Array.from({ length: matchCount }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-3 py-2 border-b border-wc-surface-secondary last:border-b-0"
            >
              <div className="flex items-center gap-1.5">
                <Skeleton className="w-4 h-3 rounded-[2px]" />
                <Skeleton className="h-2.5 w-12" />
              </div>
              <Skeleton className="h-5 w-10 rounded" />
              <div className="flex items-center gap-1.5">
                <Skeleton className="h-2.5 w-12" />
                <Skeleton className="w-4 h-3 rounded-[2px]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export interface GroupsTabSkeletonProps {
  groupCount?: number;
}

/**
 * Esqueleto de carga para la pestaña de Grupos y Fixture.
 * Simula múltiples GroupCards con tabla de posiciones y partidos.
 */
export function GroupsTabSkeleton({ groupCount = 4 }: GroupsTabSkeletonProps) {
  return (
    <div data-testid="groups-tab-skeleton">
      {/* Sección "Fase de grupos" */}
      <div className="flex items-center gap-1.5 mb-2.5">
        <Skeleton className="w-3 h-3 rounded-sm" />
        <Skeleton className="h-2.5 w-24" />
      </div>

      {Array.from({ length: groupCount }).map((_, i) => (
        <GroupCardSkeleton key={i} />
      ))}

      {/* Sección "Fase eliminatoria" */}
      <div className="mt-4">
        <div className="flex items-center gap-1.5 mb-2.5">
          <Skeleton className="w-3 h-3 rounded-sm" />
          <Skeleton className="h-2.5 w-28" />
        </div>
        <div className="bg-wc-surface-primary border border-wc-border-primary rounded-xl p-3 flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between py-1.5">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-5 w-10 rounded" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
