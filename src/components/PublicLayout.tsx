import { Link, NavLink, Outlet } from 'react-router-dom';
import { Building2, Menu, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { LanguageToggle } from '@/components/LanguageToggle';
import { CurrencyToggle } from '@/components/CurrencyToggle';

const facebookLink = import.meta.env.VITE_FACEBOOK_LINK;
const zaloLink = import.meta.env.VITE_ZALO_LINK;

/* CSS keyframes injected once into <head> */
const ATTENTION_CSS = `
@keyframes sb-wiggle {
  0%   { transform: scale(1)     rotate(0deg);   }
  10%  { transform: scale(1.15)  rotate(-8deg);  }
  20%  { transform: scale(1.15)  rotate(8deg);   }
  30%  { transform: scale(1.15)  rotate(-6deg);  }
  40%  { transform: scale(1.15)  rotate(6deg);   }
  50%  { transform: scale(1.12)  rotate(0deg);   }
  60%  { transform: scale(1.08)  rotate(0deg);   }
  100% { transform: scale(1)     rotate(0deg);   }
}
.sb-float-btn.sb-attention {
  animation: sb-wiggle 0.7s cubic-bezier(.36,.07,.19,.97) both;
  box-shadow: 0 0 0 6px rgba(99,179,237,.45), 0 8px 24px rgba(0,0,0,.25);
}
`;

export function PublicLayout() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [attention, setAttention] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* Inject CSS once */
  useEffect(() => {
    if (document.getElementById('sb-float-css')) return;
    const style = document.createElement('style');
    style.id = 'sb-float-css';
    style.textContent = ATTENTION_CSS;
    document.head.appendChild(style);
  }, []);

  /* After 5 s idle, pulse every 8 s */
  useEffect(() => {
    if (!facebookLink && !zaloLink) return;

    const trigger = () => {
      setAttention(true);
      // Remove class after animation completes so it can re-trigger
      setTimeout(() => setAttention(false), 800);
    };

    const initialTimer = setTimeout(() => {
      trigger();
      intervalRef.current = setInterval(trigger, 8000);
    }, 5000);

    return () => {
      clearTimeout(initialTimer);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const navItems = [
    { to: '/', label: t('nav.home'), end: true },
    { to: '/apartments', label: t('nav.apartments') },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-line bg-surface/85 backdrop-blur">
        <div className="container-app flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-sm bg-primary text-white shadow-soft">
              <Building2 className="h-5 w-5" />
            </span>
            <span className="text-lg font-extrabold tracking-tight text-ink-heading">
              {t('brand.name')}
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `rounded-sm px-3.5 py-2 text-sm font-semibold transition ${
                    isActive ? 'bg-primary-soft text-primary' : 'text-ink-body hover:text-ink-heading'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-2.5 md:flex">
            <CurrencyToggle />
            <LanguageToggle />
          </div>

          <button
            className="rounded-sm p-2 text-ink-heading md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div className="border-t border-line bg-surface md:hidden">
            <div className="container-app space-y-1 py-3">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-sm px-3 py-2.5 text-sm font-semibold ${
                      isActive ? 'bg-primary-soft text-primary' : 'text-ink-body'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <div className="flex items-center justify-between gap-2 pt-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <CurrencyToggle />
                  <LanguageToggle />
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Floating Contact Widget */}
      {(facebookLink || zaloLink) && (
        <div className="fixed bottom-7 right-7 z-50 flex flex-col gap-3.5">
          {facebookLink && (
            <a
              href={facebookLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`sb-float-btn${attention ? ' sb-attention' : ''} flex h-[52px] w-[52px] items-center justify-center rounded-full bg-gradient-to-br from-[#1877F2] to-[#166FE5] text-white shadow-lg transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-xl`}
              title="Chat Facebook"
            >
              <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
          )}

          {zaloLink && (
            <a
              href={zaloLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`sb-float-btn${attention ? ' sb-attention' : ''} flex h-[52px] w-[52px] items-center justify-center rounded-full bg-gradient-to-br from-[#0068FF] to-[#0056D2] text-white shadow-lg transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-xl no-underline`}
              title="Chat Zalo"
            >
              <span className="font-bold text-[11px] tracking-tight uppercase">Zalo</span>
            </a>
          )}
        </div>
      )}

    </div>
  );
}
