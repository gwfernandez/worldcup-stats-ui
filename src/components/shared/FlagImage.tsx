import { getFlagUrl, FLAG_DISPLAY_SIZE, type FlagSize } from '@/utils/flag.utils';

export interface FlagImageProps {
  countryCode: string;
  alt: string;
  size?: FlagSize;
  className?: string;
  width?: number;
  height?: number;
}

/**
 * Country flag from FlagCDN with hide-on-error fallback.
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

  return (
    <img
      src={getFlagUrl(countryCode, size)}
      alt={alt}
      width={width ?? dimensions.width}
      height={height ?? dimensions.height}
      className={className}
      onError={(e) => {
        e.currentTarget.style.display = 'none';
      }}
    />
  );
}
