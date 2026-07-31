import { Link, NavLink, Outlet } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { LanguageToggle } from '@/components/LanguageToggle';
import { CurrencyToggle } from '@/components/CurrencyToggle';

const facebookLink = import.meta.env.VITE_FACEBOOK_LINK;
const zaloLink = import.meta.env.VITE_ZALO_LINK;


export function PublicLayout() {
  const { t } = useI18n();


  const navItems = [
    { to: '/', label: t('nav.home'), end: true },
    { to: '/apartments', label: t('nav.apartments') },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-line bg-surface/85 backdrop-blur">
        <div className="container-app flex h-16 items-center justify-between gap-2">
          <Link to="/" className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <span className="flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-sm bg-primary text-white shadow-soft">
              <Building2 className="h-4 w-4 sm:h-5 sm:w-5" />
            </span>
            <span className="hidden sm:block text-lg font-extrabold tracking-tight text-ink-heading">
              {t('brand.name')}
            </span>
          </Link>

          <div className="flex items-center gap-1 sm:gap-4 shrink-0">
            <nav className="flex items-center gap-0.5 sm:gap-1 overflow-x-auto no-scrollbar">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `rounded-sm px-2 py-1.5 sm:px-3.5 sm:py-2 text-[11px] sm:text-sm font-semibold transition whitespace-nowrap ${
                      isActive ? 'bg-primary-soft text-primary' : 'text-ink-body hover:text-ink-heading'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center gap-1 sm:gap-2.5">
              <CurrencyToggle />
              <LanguageToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>


    </div>
  );
}
