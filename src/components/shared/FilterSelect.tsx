import { ChevronDown } from 'lucide-react';

export interface FilterSelectOption {
  value: string;
  label: string;
}

export interface FilterSelectProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: FilterSelectOption[];
  placeholderOption?: string;
  className?: string;
}

/**
 * Styled select with chevron for filter bars.
 */
export function FilterSelect({
  value,
  onChange,
  options,
  placeholderOption,
  className = '',
}: FilterSelectProps) {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={onChange}
        className="w-full appearance-none bg-wc-surface-primary border border-wc-border-primary rounded-lg px-3 py-[7px] pr-7 text-xs text-wc-text-primary outline-none focus:border-wc-accent-gold transition-colors cursor-pointer"
      >
        {placeholderOption !== undefined && <option value="">{placeholderOption}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-wc-text-muted pointer-events-none"
        size={11}
        aria-hidden="true"
      />
    </div>
  );
}
