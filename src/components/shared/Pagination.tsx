import { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  itemsLabel?: string;
  onPageChange: (page: number) => void;
}

/**
 * Reusable pagination component.
 * Displays item range, total items, and page navigation buttons.
 */
export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  itemsLabel,
  onPageChange,
}: PaginationProps) {
  const { t } = useTranslation('common');
  const resolvedItemsLabel = itemsLabel ?? t('pagination.items');

  // Range of visible pages (max 5 buttons)
  const pageRange = useMemo((): (number | '...')[] => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);

    if (currentPage <= 3) return [1, 2, 3, 4, '...', totalPages];
    if (currentPage >= totalPages - 2)
      return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];

    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  }, [currentPage, totalPages]);

  if (totalPages <= 1) return null;

  const from = (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex items-center justify-between mt-4 pt-3 border-t border-wc-border-primary">
      {/* Range info */}
      <span className="text-[11px] text-wc-text-muted">
        {t('pagination.range', {
          from,
          to,
          total: totalItems,
          itemsLabel: resolvedItemsLabel,
        })}
      </span>

      {/* Buttons */}
      <div className="flex items-center gap-1">
        {/* Previous */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center justify-center w-7 h-7 rounded-md border border-wc-border-primary text-wc-text-muted hover:border-wc-accent-gold hover:text-wc-accent-gold disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-wc-border-primary disabled:hover:text-wc-text-muted transition-colors focus:outline-none"
          aria-label={t('pagination.previous')}
        >
          <ChevronLeft size={12} aria-hidden="true" />
        </button>

        {/* Page numbers */}
        {pageRange.map((page, i) =>
          page === '...' ? (
            <span
              key={`ellipsis-${i}`}
              className="w-7 h-7 flex items-center justify-center text-[11px] text-wc-text-muted"
            >
              …
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={`w-7 h-7 rounded-md border text-[11px] transition-colors focus:outline-none ${
                currentPage === page
                  ? 'bg-wc-success-surface border-wc-success-border text-wc-accent-gold font-medium'
                  : 'border-wc-border-primary text-wc-text-muted hover:border-wc-accent-gold hover:text-wc-accent-gold'
              }`}
              aria-label={t('pagination.page', { page })}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </button>
          ),
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center justify-center w-7 h-7 rounded-md border border-wc-border-primary text-wc-text-muted hover:border-wc-accent-gold hover:text-wc-accent-gold disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-wc-border-primary disabled:hover:text-wc-text-muted transition-colors focus:outline-none"
          aria-label={t('pagination.next')}
        >
          <ChevronRight size={12} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
