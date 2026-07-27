import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Building2, LogOut, ExternalLink, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui/Button';

export function AdminLayout() {
  const { signOut } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const navItems = [
    { to: '/admin', label: t('admin.nav.dashboard'), icon: LayoutDashboard, end: true },
    { to: '/admin/apartments', label: t('admin.nav.apartments'), icon: Building2 },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-canvas">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-line bg-surface transition-transform duration-300 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-line px-5">
          <Link to="/admin" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary text-white">
              <Building2 className="h-4 w-4" />
            </span>
            <span className="text-base font-extrabold text-ink-heading">{t('brand.name')}</span>
          </Link>
          <button className="rounded-sm p-1.5 text-ink-muted lg:hidden" onClick={() => setOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="space-y-1 p-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-primary-soft text-primary'
                    : 'text-ink-body hover:bg-line/40 hover:text-ink-heading'
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute inset-x-0 bottom-0 space-y-1 border-t border-line p-3">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-semibold text-ink-body transition hover:bg-line/40 hover:text-ink-heading"
          >
            <ExternalLink className="h-4 w-4" />
            {t('admin.nav.viewSite')}
          </Link>
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-semibold text-danger transition hover:bg-danger-soft"
          >
            <LogOut className="h-4 w-4" />
            {t('admin.nav.signout')}
          </button>
        </div>
      </aside>

      {open && <div className="fixed inset-0 z-40 bg-ink-heading/40 lg:hidden" onClick={() => setOpen(false)} />}

      {/* Main */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-surface/85 px-5 backdrop-blur lg:px-8">
          <button className="rounded-sm p-2 text-ink-heading lg:hidden" onClick={() => setOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden lg:block">
            <p className="text-sm font-semibold text-ink-muted">{t('admin.nav.dashboard')}</p>
          </div>
          <Button to="/admin/apartments/create" size="sm">
            <Building2 className="h-4 w-4" /> {t('admin.apartments.create')}
          </Button>
        </header>

        <main className="p-5 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
