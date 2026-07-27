import { useState, useRef, useEffect } from 'react';
import { DollarSign, ChevronDown, Check } from 'lucide-react';
import { useCurrency, type Currency } from '@/lib/currencyContext';

export function CurrencyToggle() {
  const { currency, setCurrency } = useCurrency();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currencies: Array<{ code: Currency; symbol: string }> = [
    { code: 'VND', symbol: 'đ' },
    { code: 'USD', symbol: '$' },
  ];

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      {/* Dropdown Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-1.5 rounded-sm border border-line bg-surface px-2.5 py-1.5 text-xs font-bold text-ink-heading shadow-soft transition hover:border-primary hover:text-primary focus:outline-none"
        aria-expanded={open}
        aria-label="Currency"
      >
        <DollarSign className="h-3.5 w-3.5 text-emerald-600" />
        <span>{currency}</span>
        <ChevronDown className={`h-3 w-3 text-ink-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu - Minimal & Clean */}
      {open && (
        <div className="absolute right-0 mt-1.5 w-32 origin-top-right rounded-sm border border-line bg-surface p-1 shadow-lift ring-1 ring-black/5 z-50 animate-in fade-in zoom-in-95 duration-150">
          {currencies.map((c) => (
            <button
              key={c.code}
              type="button"
              onClick={() => {
                setCurrency(c.code);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between rounded-xs px-2.5 py-1.5 text-xs font-medium transition ${
                currency === c.code
                  ? 'bg-primary-soft font-bold text-primary'
                  : 'text-ink-body hover:bg-canvas hover:text-ink-heading'
              }`}
            >
              <span className="font-bold">{c.code} ({c.symbol})</span>
              {currency === c.code && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
