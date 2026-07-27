import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2, ArrowRight, Plus, MapPin, Activity, Users,
  MousePointerClick, Monitor, Smartphone, TrendingUp, Search
} from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { fetchApartments } from '@/lib/apartmentService';
import type { Apartment } from '@/lib/types';
import { formatPrice, formatNumber } from '@/lib/format';
import { Card, Badge, Spinner } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

// Mock Tracking Data
const mockTraffic = [450, 520, 480, 800, 950, 1100, 1050];
const maxTraffic = Math.max(...mockTraffic);
const mockDevices = { mobile: 68, desktop: 32 };
const mockSearches = [
  { keyword: 'studio đà nẵng', count: 1240 },
  { keyword: '2 bedroom pool', count: 850 },
  { keyword: 'sea view apartment', count: 620 },
  { hcmc: 'hcmc center 1 bed', count: 410 }
];
const mockGeographic = [
  { city: 'Da Nang', count: 4500, percentage: 45 },
  { city: 'Ho Chi Minh', count: 3500, percentage: 35 },
  { city: 'Hanoi', count: 2000, percentage: 20 },
];

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
    return { total: apartments.length, published, drafts, featured };
  }, [apartments]);

  // Give apartments mock views for the ranking
  const popularApartments = useMemo(() => {
    return [...apartments]
      .map((a, i) => ({ ...a, views: 1500 - i * 150 + Math.floor(Math.random() * 100) }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);
  }, [apartments]);

  const kpis = [
    { icon: Activity, label: t('admin.dashboard.views'), value: '54,230', trend: '+12.5%', tone: 'primary' },
    { icon: Users, label: t('admin.dashboard.visitors'), value: '12,840', trend: '+8.2%', tone: 'success' },
    { icon: Building2, label: t('admin.dashboard.activeListings'), value: formatNumber(stats.published), trend: '+2', tone: 'warning' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-ink-heading">{t('admin.dashboard.welcome')}</h1>
          <p className="mt-1 text-sm text-ink-muted">{t('admin.dashboard.subtitle')}</p>
        </div>
        <div className="flex gap-3">
          <Button to="/admin/apartments/create" size="sm" className="shadow-lg shadow-primary/20">
            <Plus className="h-4 w-4" /> {t('admin.workflow.create')}
          </Button>
        </div>
      </div>

      {/* Hero KPIs */}
      <div className="grid gap-4 sm:grid-cols-3">
        {kpis.map((k) => (
          <div key={k.label} className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-line/50 transition-all hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-bold text-ink-muted">{k.label}</p>
                <p className="mt-2 text-3xl font-extrabold tracking-tight text-ink-heading">{k.value}</p>
              </div>
              <span className={`flex h-12 w-12 items-center justify-center rounded-full bg-${k.tone}-soft text-${k.tone}`}>
                <k.icon className="h-6 w-6" />
              </span>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm font-semibold">
              <TrendingUp className="h-4 w-4 text-success" />
              <span className="text-success">{k.trend}</span>
              <span className="text-ink-muted font-medium text-xs">vs last 30 days</span>
            </div>
            {/* Decorative background shape */}
            <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-${k.tone} opacity-5 blur-2xl`} />
          </div>
        ))}
      </div>

      {/* Main Analytics Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* Traffic Chart (2 cols) */}
        <div className="lg:col-span-2 rounded-2xl bg-[#0F172A] p-6 text-white shadow-xl relative overflow-hidden group">
          {/* Ambient Glow */}
          <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-primary/20 blur-3xl transition-all duration-700 group-hover:bg-primary/30" />
          
          <div className="relative z-10 flex items-center justify-between mb-8">
            <div>
              <h2 className="text-lg font-bold">{t('admin.dashboard.traffic')}</h2>
              <p className="text-sm text-slate-400">{t('admin.dashboard.trafficLast7Days')}</p>
            </div>
            <Badge tone="primary" className="bg-primary/20 text-primary-light border-0">Live Tracking</Badge>
          </div>
          
          {/* Custom CSS Bar Chart */}
          <div className="relative z-10 h-64 flex items-end justify-between gap-2 sm:gap-4 mt-8">
            {mockTraffic.map((value, i) => (
              <div key={i} className="relative flex flex-col items-center justify-end h-full flex-1 group/bar">
                {/* Tooltip */}
                <div className="absolute -top-10 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-slate-800 text-xs font-bold px-2 py-1 rounded shadow-xl whitespace-nowrap pointer-events-none">
                  {value} views
                </div>
                {/* Bar */}
                <div 
                  className="w-full bg-gradient-to-t from-primary/20 to-primary/80 rounded-t-md transition-all duration-700 ease-out hover:to-primary"
                  style={{ height: `${(value / maxTraffic) * 100}%` }}
                />
                <span className="text-xs text-slate-400 mt-3 font-medium">Day {i + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Geographic & Devices */}
        <div className="space-y-6">
          {/* Geographic */}
          <Card className="p-6">
            <h2 className="text-base font-bold text-ink-heading mb-4 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" /> {t('admin.dashboard.geographic')}
            </h2>
            <div className="space-y-4">
              {mockGeographic.map((geo) => (
                <div key={geo.city}>
                  <div className="flex justify-between text-sm font-semibold mb-1">
                    <span>{geo.city}</span>
                    <span>{geo.percentage}%</span>
                  </div>
                  <div className="h-2 w-full bg-line/50 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${geo.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Devices */}
          <Card className="p-6">
            <h2 className="text-base font-bold text-ink-heading mb-4 flex items-center gap-2">
              <MousePointerClick className="h-4 w-4 text-primary" /> {t('admin.dashboard.devices')}
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex-1 flex flex-col items-center p-4 rounded-xl bg-slate-50 border border-line">
                <Smartphone className="h-6 w-6 text-ink-heading mb-2" />
                <span className="text-2xl font-black">{mockDevices.mobile}%</span>
                <span className="text-xs text-ink-muted font-semibold">{t('admin.dashboard.mobile')}</span>
              </div>
              <div className="flex-1 flex flex-col items-center p-4 rounded-xl bg-slate-50 border border-line">
                <Monitor className="h-6 w-6 text-ink-heading mb-2" />
                <span className="text-2xl font-black">{mockDevices.desktop}%</span>
                <span className="text-xs text-ink-muted font-semibold">{t('admin.dashboard.desktop')}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Most Viewed Apartments */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-bold text-ink-heading">{t('admin.dashboard.mostViewed')}</h2>
            <Link to="/admin/apartments" className="text-sm font-semibold text-primary hover:underline">
              {t('admin.recent.viewAll')} &rarr;
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12"><Spinner className="h-6 w-6 text-primary" /></div>
          ) : popularApartments.length === 0 ? (
            <div className="py-10 text-center text-sm text-ink-muted">{t('admin.recent.empty')}</div>
          ) : (
            <div className="space-y-4">
              {popularApartments.map((a, i) => (
                <div key={a.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-line group">
                  <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-line/40 relative">
                    {a.images?.[0] && <img src={a.images[0]} alt="" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />}
                    <div className="absolute top-1 left-1 bg-black/60 text-white text-[10px] font-bold px-1.5 py-0.5 rounded backdrop-blur-md">
                      #{i + 1}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-ink-heading">{a.title}</p>
                    <p className="flex items-center gap-1 text-xs text-ink-muted mt-1 font-medium">
                      <MapPin className="h-3 w-3" /> {a.city} • {a.district || ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-primary">{formatNumber(a.views)}</p>
                    <p className="text-[10px] uppercase font-bold text-ink-muted">{t('admin.dashboard.viewsCount')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Top Search Keywords */}
        <Card className="p-6">
          <h2 className="text-base font-bold text-ink-heading mb-6 flex items-center gap-2">
            <Search className="h-4 w-4 text-primary" /> {t('admin.dashboard.topSearches')}
          </h2>
          <div className="space-y-3">
            {mockSearches.map((search, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-line bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500">
                    {i + 1}
                  </span>
                  <span className="text-sm font-bold text-ink-heading">"{search.keyword || Object.values(search)[0]}"</span>
                </div>
                <Badge tone="success" className="bg-success/10 text-success border-0">
                  {formatNumber(search.count)} {t('admin.dashboard.viewsCount')}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
