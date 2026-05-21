export type TooltipGroupName = 'conf' | 'action' | 'th' | 'tooltip';

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

export interface TooltipProps {
  content: string;
  children: React.ReactNode;
  groupName?: TooltipGroupName;
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
  className = '',
  hideWhenEmpty = false,
}: TooltipProps) {
  if (hideWhenEmpty && !content) {
    return <>{children}</>;
  }

  const wrapperGroup = GROUP_WRAPPER[groupName];
  const hoverGroup = GROUP_HOVER[groupName];

  return (
    <div className={`relative inline-flex ${wrapperGroup} cursor-default ${className}`}>
      {children}
      <div
        className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-[#1e2233] border border-[#2a2d3a] rounded-md text-[10px] text-[#e8eaf0] whitespace-nowrap opacity-0 ${hoverGroup} transition-opacity duration-150 pointer-events-none z-10`}
      >
        {content}
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#2a2d3a]" />
      </div>
    </div>
  );
}
