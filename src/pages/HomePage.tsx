import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  Search, ShieldCheck, CalendarClock, Headphones, BadgeDollarSign,
  ArrowRight, Star, Building2, MapPin, Sparkles,
} from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { fetchFeaturedApartments } from '@/lib/apartmentService';
import type { Apartment } from '@/lib/types';
import { ApartmentCard } from '@/components/ApartmentCard';
import { HeroSlideshow } from '@/components/HeroSlideshow';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Card';
import { SEO } from '@/components/SEO';

export function HomePage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetchFeaturedApartments()
      .then(setApartments)
      .catch(() => setApartments([]))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(query ? `/apartments?search=${encodeURIComponent(query)}` : '/apartments');
  };

  const chips = [
    { icon: ShieldCheck, label: t('home.chip.verified') },
    { icon: CalendarClock, label: t('home.chip.flexible') },
    { icon: Headphones, label: t('home.chip.support') },
    { icon: Sparkles, label: t('home.chip.trusted') },
  ];

  const features = [
    { icon: ShieldCheck, title: t('home.features.verified.title'), body: t('home.features.verified.body') },
    { icon: CalendarClock, title: t('home.features.flexible.title'), body: t('home.features.flexible.body') },
    { icon: Headphones, title: t('home.features.support.title'), body: t('home.features.support.body') },
    { icon: BadgeDollarSign, title: t('home.features.transparent.title'), body: t('home.features.transparent.body') },
  ];

  const stats = [
    { value: '1,200+', label: t('home.stats.listings') },
    { value: '5', label: t('home.stats.cities') },
    { value: '8,500+', label: t('home.stats.tenants') },
    { value: '< 2h', label: t('home.stats.response') },
  ];

  const testimonials = [
    { name: t('home.t1.name'), city: t('home.t1.city'), text: t('home.t1.text') },
    { name: t('home.t2.name'), city: t('home.t2.city'), text: t('home.t2.text') },
    { name: t('home.t3.name'), city: t('home.t3.city'), text: t('home.t3.text') },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <HeroSlideshow />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-heading/80 via-ink-heading/70 to-ink-heading/85" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 top-40 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
        <div className="container-app relative py-20 sm:py-24 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <span className="chip mx-auto animate-fade-up border-white/30 bg-white/10 text-white backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              {t('home.hero.eyebrow')}
            </span>
            <h1 className="mt-6 animate-fade-up text-balance text-4xl font-extrabold tracking-tight text-white drop-shadow-lg sm:text-5xl lg:text-6xl" style={{ animationDelay: '60ms' }}>
              {t('home.hero.title')}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl animate-fade-up text-balance text-base leading-relaxed text-white/90 drop-shadow sm:text-lg" style={{ animationDelay: '120ms' }}>
              {t('home.hero.subtitle')}
            </p>

            <form onSubmit={handleSearch} className="mx-auto mt-8 flex max-w-xl animate-fade-up items-center gap-2 rounded-lg border border-white/20 bg-white/95 p-2 shadow-lift backdrop-blur" style={{ animationDelay: '180ms' }}>
              <div className="flex flex-1 items-center gap-2 pl-2">
                <Search className="h-5 w-5 text-ink-muted" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t('home.hero.search.placeholder')}
                  className="w-full bg-transparent py-2 text-sm text-ink-heading placeholder:text-ink-muted focus:outline-none"
                />
              </div>
              <Button type="submit" size="md">{t('cta.explore')}<ArrowRight className="h-4 w-4" /></Button>
            </form>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
              {chips.map((c) => (
                <span key={c.label} className="chip border-white/30 bg-white/10 text-white backdrop-blur">
                  <c.icon className="h-3.5 w-3.5 text-white" />
                  {c.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-line bg-surface">
        <div className="container-app grid grid-cols-2 gap-6 py-10 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-extrabold tracking-tight text-primary">{s.value}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-ink-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="container-app py-16 lg:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <span className="chip mx-auto text-primary">{t('home.features.eyebrow')}</span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-ink-heading sm:text-4xl">{t('home.features.title')}</h2>
          <p className="mt-4 text-base leading-relaxed text-ink-body">{t('home.features.subtitle')}</p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <Card key={f.title} hover className="p-6">
              <span className="flex h-12 w-12 items-center justify-center rounded-sm bg-primary-soft text-primary">
                <f.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-base font-bold text-ink-heading">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-body">{f.body}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="bg-surface py-16 lg:py-20">
        <div className="container-app">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div className="max-w-xl">
              <span className="chip text-primary">{t('home.featured.eyebrow')}</span>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-ink-heading sm:text-4xl">{t('home.featured.title')}</h2>
              <p className="mt-3 text-base text-ink-body">{t('home.featured.subtitle')}</p>
            </div>
            <Button to="/apartments" variant="outline">
              {t('cta.browse')}<ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-10">
            {loading ? (
              <div className="flex justify-center py-16"><Spinner className="h-6 w-6 text-primary" /></div>
            ) : apartments.length === 0 ? (
              <Card className="p-12 text-center text-ink-muted">{t('home.featured.empty')}</Card>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {apartments.map((a) => (
                  <ApartmentCard key={a.id} apartment={a} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container-app py-16 lg:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <span className="chip mx-auto text-primary">{t('home.testimonials.eyebrow')}</span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-ink-heading sm:text-4xl">{t('home.testimonials.title')}</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((tm) => (
            <Card key={tm.name} className="p-6">
              <div className="flex gap-0.5 text-warning">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-ink-body">"{tm.text}"</p>
              <div className="mt-5 flex items-center gap-3 border-t border-line pt-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-soft text-sm font-bold text-primary">
                  {tm.name.charAt(0)}
                </span>
                <div>
                  <p className="text-sm font-bold text-ink-heading">{tm.name}</p>
                  <p className="text-xs text-ink-muted">{tm.city}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20">
        <div className="container-app">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary-hover px-8 py-14 text-center shadow-lift sm:px-16">
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
            <div className="relative mx-auto max-w-2xl">
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">{t('home.cta.title')}</h2>
              <p className="mt-4 text-base leading-relaxed text-white/85">{t('home.cta.subtitle')}</p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link to="/apartments" className="inline-flex items-center gap-2 rounded-sm bg-white px-6 py-3 text-sm font-bold text-primary transition hover:bg-white/90">
                  {t('cta.browse')}<ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/apartments" className="inline-flex items-center gap-2 rounded-sm border border-white/40 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10">
                  {t('cta.contact')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
