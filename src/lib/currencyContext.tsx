import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type Currency = 'VND' | 'USD';

interface CurrencyContextValue {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  toggleCurrency: () => void;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

const STORAGE_KEY = 'smartbooking-currency';

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    if (typeof window === 'undefined') return 'VND';
    return (localStorage.getItem(STORAGE_KEY) as Currency) || 'VND';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, currency);
  }, [currency]);

  const toggleCurrency = () => {
    setCurrencyState((prev) => (prev === 'VND' ? 'USD' : 'VND'));
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency: setCurrencyState, toggleCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    throw new Error('useCurrency must be used within CurrencyProvider');
  }
  return ctx;
}
