export type TooltipGroupName = 'conf' | 'action' | 'th' | 'tooltip';
export type TooltipAlign = 'start' | 'center' | 'end';

const GROUP_WRAPPER: Record<TooltipGroupName, string> = {
  conf: 'group/conf',
  action: 'group/action',
  th: 'group/th',
  tooltip: 'group/tooltip',
};

const GROUP_HOVER: Record<TooltipGroupName, string> = {
  conf: 'group-hover/conf:opacity-100',
  action: 'group-hover/action:opacity-100',
  th: 'group-hover/th:opacity-100',
  tooltip: 'group-hover/tooltip:opacity-100',
};

const TOOLTIP_ALIGNMENT: Record<TooltipAlign, string> = {
  start: 'left-0',
  center: 'left-1/2 -translate-x-1/2',
  end: 'right-0',
};

const ARROW_ALIGNMENT: Record<TooltipAlign, string> = {
  start: 'left-3',
  center: 'left-1/2 -translate-x-1/2',
  end: 'right-3',
};

export interface TooltipProps {
  content: string;
  children: React.ReactNode;
  groupName?: TooltipGroupName;
  align?: TooltipAlign;
  className?: string;
  /** When true, only renders children if content is empty (for optional tooltips). */
  hideWhenEmpty?: boolean;
}

/**
 * CSS hover tooltip wrapping arbitrary trigger content.
 */
export function Tooltip({
  content,
  children,
  groupName = 'tooltip',
  align = 'center',
  className = '',
  hideWhenEmpty = false,
}: TooltipProps) {
  if (hideWhenEmpty && !content) {
    return <>{children}</>;
  }

  const wrapperGroup = GROUP_WRAPPER[groupName];
  const hoverGroup = GROUP_HOVER[groupName];
  const tooltipAlignment = TOOLTIP_ALIGNMENT[align];
  const arrowAlignment = ARROW_ALIGNMENT[align];

  return (
    <div className={`relative inline-flex ${wrapperGroup} cursor-default ${className}`}>
      {children}
      <div
        className={`absolute bottom-full mb-1.5 whitespace-nowrap rounded-md border border-wc-border-primary bg-wc-surface-secondary px-2 py-1 text-[10px] text-wc-text-primary opacity-0 transition-opacity duration-150 pointer-events-none z-10 ${tooltipAlignment} ${hoverGroup}`}
      >
        {content}
        <span
          className={`absolute top-full border-4 border-transparent border-t-wc-border-primary ${arrowAlignment}`}
        />
      </div>
    </div>
  );
}
