import { Search } from 'lucide-react';

export interface SearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  className?: string;
}

/**
 * Text input with a search icon for filter bars.
 */
export function SearchInput({ value, onChange, placeholder, className = '' }: SearchInputProps) {
  return (
    <div className={`relative ${className}`}>
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a8fa8] pointer-events-none"
        size={13}
        aria-hidden="true"
      />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full bg-[#161925] border border-[#2a2d3a] rounded-lg pl-8 pr-3 py-[7px] text-xs text-[#e8eaf0] placeholder:text-[#8a8fa8] outline-none focus:border-[#e8c84a] transition-colors"
      />
    </div>
  );
}
