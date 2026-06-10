import { Skeleton } from '../ui/Skeleton';

export interface TableSkeletonProps {
  cols?: number;
  rows?: number;
  showFilters?: boolean;
}

export function TableSkeleton({
  cols = 4,
  rows = 5,
  showFilters = true,
}: TableSkeletonProps) {
  return (
    <div className="w-full flex flex-col gap-4" data-testid="table-skeleton">
      {/* Filters Placeholder */}
      {showFilters && (
        <div className="flex gap-2.5" data-testid="table-skeleton-filters">
          <Skeleton className="flex-[2] h-9" />
          <Skeleton className="flex-1 h-9" />
          <Skeleton className="flex-1 h-9" />
        </div>
      )}

      {/* Table Structure */}
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[#2a2d3a]">
              {Array.from({ length: cols }).map((_, i) => (
                <th key={i} className="pb-3 pr-3 text-left">
                  <Skeleton className="h-3 w-16" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex} className="border-t border-[#1e2233]">
                {Array.from({ length: cols }).map((_, colIndex) => (
                  <td key={colIndex} className="py-3.5 pr-3">
                    <Skeleton
                      className={`h-3.5 ${
                        colIndex === 0
                          ? 'w-8'
                          : colIndex === 1
                            ? 'w-24'
                            : 'w-16'
                      }`}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Placeholder */}
      <div
        className="flex items-center justify-between border-t border-[#2a2d3a] pt-4 mt-2"
        data-testid="table-skeleton-pagination"
      >
        <Skeleton className="h-4 w-32" />
        <div className="flex gap-1.5">
          <Skeleton className="w-8 h-8 rounded-md" />
          <Skeleton className="w-8 h-8 rounded-md" />
        </div>
      </div>
    </div>
  );
}
