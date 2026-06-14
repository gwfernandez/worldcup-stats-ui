import { cn } from '@/lib/utils';
import { fifaToAlpha2, FLAG_DISPLAY_SIZE, type FlagSize } from '@/utils/flag.utils';

export interface FlagImageProps {
  countryCode: string;
  alt: string;
  size?: FlagSize;
  className?: string;
  width?: number;
  height?: number;
}

/**
 * Country flag rendered with flag-icons and a neutral fallback for unsupported codes.
 */
export function FlagImage({
  countryCode,
  alt,
  size = 'sm',
  className = 'rounded-[2px] shrink-0',
  width,
  height,
}: FlagImageProps) {
  const dimensions = FLAG_DISPLAY_SIZE[size];
  const alpha2Code = fifaToAlpha2(countryCode);
  const resolvedWidth = width ?? dimensions.width;
  const resolvedHeight = height ?? dimensions.height;
  const inlineSize = `${resolvedWidth}px`;
  const blockSize = `${resolvedHeight}px`;

  if (!alpha2Code) {
    return (
      <span
        role="img"
        aria-label={alt}
        title={alt}
        className={cn(
          'inline-flex items-center justify-center rounded-[2px] border border-wc-border-primary bg-wc-surface-secondary text-[8px] font-medium leading-none text-wc-text-muted shrink-0',
          className,
        )}
        style={{ width: inlineSize, height: blockSize }}
      >
        {countryCode.trim().slice(0, 2).toUpperCase()}
      </span>
    );
  }

  return (
    <span
      role="img"
      aria-label={alt}
      title={alt}
      className={cn('fi', `fi-${alpha2Code}`, className)}
      style={{ width: inlineSize, height: blockSize }}
    />
  );
}
