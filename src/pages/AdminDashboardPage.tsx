import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2, CheckCircle2, FileEdit, Star, Wallet, ArrowRight, Plus, MapPin,
} from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { fetchApartments } from '@/lib/apartmentService';
import type { Apartment } from '@/lib/types';
import { formatPrice, formatNumber } from '@/lib/format';
import { Card, Badge, Spinner } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export function AdminDashboardPage() {
  const { t } = useI18n();
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApartments()
      .then(setApartments)
      .catch(() => setApartments([]))
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const published = apartments.filter((a) => a.status === 'published').length;
    const drafts = apartments.filter((a) => a.status === 'draft').length;
    const featured = apartments.filter((a) => a.featured).length;
    const avgRent = apartments.length
      ? apartments.reduce((s, a) => s + Number(a.rent), 0) / apartments.length
      : 0;
    return { total: apartments.length, published, drafts, featured, avgRent };
  }, [apartments]);

  const byCity = useMemo(() => {
    const map = new Map<string, number>();
    apartments.forEach((a) => map.set(a.city, (map.get(a.city) ?? 0) + 1));
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [apartments]);

  const recent = apartments.slice(0, 5);

  const kpis = [
    { icon: Building2, label: t('admin.kpi.apartments'), value: formatNumber(stats.total), tone: 'primary' as const },
    { icon: CheckCircle2, label: t('admin.kpi.published'), value: formatNumber(stats.published), tone: 'success' as const },
    { icon: FileEdit, label: t('admin.kpi.drafts'), value: formatNumber(stats.drafts), tone: 'warning' as const },
    { icon: Star, label: t('admin.kpi.featured'), value: formatNumber(stats.featured), tone: 'primary' as const },
    { icon: Wallet, label: t('admin.kpi.avgRent'), value: formatPrice(stats.avgRent), tone: 'success' as const },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink-heading">{t('admin.dashboard.welcome')}</h1>
        <p className="mt-1 text-sm text-ink-muted">{t('admin.dashboard.subtitle')}</p>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {kpis.map((k) => (
          <Card key={k.label} hover className="p-5">
            <div className="flex items-center justify-between">
              <span className={`flex h-10 w-10 items-center justify-center rounded-sm ${
                k.tone === 'success' ? 'bg-success-soft text-success' : 'bg-primary-soft text-primary'
              }`}>
                <k.icon className="h-5 w-5" />
              </span>
            </div>
            <p className="mt-4 text-2xl font-extrabold tracking-tight text-ink-heading">{k.value}</p>
            <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-ink-muted">{k.label}</p>
          </Card>
        ))}
      </div>

      {/* Quick actions */}
      <Card className="p-6">
        <h2 className="text-base font-bold text-ink-heading">{t('admin.workflow.title')}</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button to="/admin/apartments/create" size="sm">
            <Plus className="h-4 w-4" /> {t('admin.workflow.create')}
          </Button>
          <Button to="/admin/apartments" variant="outline" size="sm">
            <Building2 className="h-4 w-4" /> {t('admin.workflow.manage')}
          </Button>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Recent listings */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-ink-heading">{t('admin.recent.title')}</h2>
            <Link to="/admin/apartments" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
              {t('admin.recent.viewAll')} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {loading ? (
            <div className="flex justify-center py-12"><Spinner className="h-6 w-6 text-primary" /></div>
          ) : recent.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm text-ink-muted">{t('admin.recent.empty')}</p>
              <Button to="/admin/apartments/create" size="sm" className="mt-4">{t('admin.apartments.emptyCta')}</Button>
            </div>
          ) : (
            <div className="mt-4 divide-y divide-line">
              {recent.map((a) => (
                <div key={a.id} className="flex items-center gap-4 py-3">
                  <div className="h-12 w-16 shrink-0 overflow-hidden rounded-xs bg-line/40">
                    {a.images?.[0] && <img src={a.images[0]} alt="" className="h-full w-full object-cover" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-ink-heading">{a.title}</p>
                    <p className="flex items-center gap-1 text-xs text-ink-muted">
                      <MapPin className="h-3 w-3" /> {a.city}
                    </p>
                  </div>
                  <div className="hidden sm:block text-sm font-bold text-ink-heading">
                    {formatPrice(Number(a.rent), a.currency)}
                  </div>
                  {a.status === 'published' ? (
                    <Badge tone="success">{t('admin.apartments.status.live')}</Badge>
                  ) : (
                    <Badge tone="warning">Draft</Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* By city */}
        <Card className="p-6">
          <h2 className="text-base font-bold text-ink-heading">{t('admin.workflow.byCity')}</h2>
          {byCity.length === 0 ? (
            <p className="mt-4 text-sm text-ink-muted">—</p>
          ) : (
            <div className="mt-4 space-y-3">
              {byCity.map(([city, count]) => {
                const max = byCity[0][1];
                return (
                  <div key={city}>
                    <div className="flex items-center justify-between text-xs font-semibold text-ink-body">
                      <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-primary" />{city}</span>
                      <span>{count}</span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-line/50">
                      <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(count / max) * 100}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
