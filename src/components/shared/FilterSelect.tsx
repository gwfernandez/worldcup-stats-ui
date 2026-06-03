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
        className="w-full appearance-none bg-[#161925] border border-[#2a2d3a] rounded-lg px-3 py-[7px] pr-7 text-xs text-[#e8eaf0] outline-none focus:border-[#e8c84a] transition-colors cursor-pointer"
      >
        {placeholderOption !== undefined && <option value="">{placeholderOption}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8a8fa8] pointer-events-none"
        size={11}
        aria-hidden="true"
      />
    </div>
  );
}
