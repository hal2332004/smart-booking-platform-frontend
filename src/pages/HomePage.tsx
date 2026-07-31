import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import {
  Search, ShieldCheck, CalendarClock, Headphones, BadgeDollarSign,
  ArrowRight, Star, Building2, MapPin, Sparkles, Mouse, ChevronDown
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

function useAutoScroll(intervalMs = 3000) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let intervalId: ReturnType<typeof setInterval>;

    const startAutoScroll = () => {
      clearInterval(intervalId);
      if (el.scrollWidth > el.clientWidth) {
        intervalId = setInterval(() => {
          const maxScrollLeft = el.scrollWidth - el.clientWidth;
          if (el.scrollLeft >= maxScrollLeft - 10) {
            el.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            const firstChild = el.firstElementChild as HTMLElement;
            const scrollAmount = firstChild ? firstChild.offsetWidth + 16 : 300;
            el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
          }
        }, intervalMs);
      }
    };

    // Delay initial start slightly to ensure layout is ready
    const initTimer = setTimeout(startAutoScroll, 500);
    window.addEventListener('resize', startAutoScroll);

    const stopAutoScroll = () => clearInterval(intervalId);
    el.addEventListener('touchstart', stopAutoScroll, { passive: true });
    el.addEventListener('touchend', startAutoScroll, { passive: true });
    el.addEventListener('mouseenter', stopAutoScroll);
    el.addEventListener('mouseleave', startAutoScroll);

    return () => {
      clearTimeout(initTimer);
      clearInterval(intervalId);
      window.removeEventListener('resize', startAutoScroll);
      el.removeEventListener('touchstart', stopAutoScroll);
      el.removeEventListener('touchend', startAutoScroll);
      el.removeEventListener('mouseenter', stopAutoScroll);
      el.removeEventListener('mouseleave', startAutoScroll);
    };
  }, [intervalMs]);

  return scrollRef;
}

export function HomePage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  
  const featuresRef = useAutoScroll(3500);
  const testimonialsRef = useAutoScroll(4500);

  useEffect(() => {
    fetchFeaturedApartments()
      .then(setApartments)
      .catch(() => setApartments([]))
      .finally(() => setLoading(false));
  }, []);





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
      <section className="relative overflow-hidden min-h-[100dvh] flex flex-col justify-center pt-16 pb-20">
        <HeroSlideshow />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-heading/80 via-ink-heading/70 to-ink-heading/85" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 top-40 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
        <div className="container-app relative py-12">
          <div className="mx-auto max-w-3xl text-center">

            <h1 className="mt-6 animate-fade-up text-balance text-3xl font-extrabold tracking-tight text-white drop-shadow-lg sm:text-5xl lg:text-6xl" style={{ animationDelay: '60ms' }}>
              {t('home.hero.title')}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl animate-fade-up text-balance text-base leading-relaxed text-white/90 drop-shadow sm:text-lg" style={{ animationDelay: '120ms' }}>
              {t('home.hero.subtitle')}
            </p>

            <div className="mt-10 animate-fade-up flex justify-center" style={{ animationDelay: '180ms' }}>
              <Button to="/apartments" size="lg" className="rounded-full px-10 py-4 text-base shadow-lift font-extrabold transition-transform hover:scale-105 active:scale-95">
                {t('cta.explore')}
              </Button>
            </div>


          </div>
        </div>

        {/* Scroll Indicator */}
        <button 
          onClick={() => {
            const nextSection = document.getElementById('stats');
            if (nextSection) {
              const headerOffset = 64;
              const elementPosition = nextSection.getBoundingClientRect().top;
              const offsetPosition = elementPosition + window.scrollY - headerOffset;
              window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
          }}
          className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce cursor-pointer opacity-70 hover:opacity-100 transition-opacity z-10"
          aria-label="Scroll down"
        >
          <Mouse className="h-6 w-6 sm:h-7 sm:w-7 text-white/90" />
          <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-white/90 -mt-1" />
        </button>
      </section>

      {/* Stats */}
      <section id="stats" className="border-y border-line bg-surface">
        <div className="container-app grid grid-cols-2 gap-6 py-6 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-primary">{s.value}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-ink-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="container-app py-8 lg:py-12">
        <div className="mx-auto max-w-2xl text-center">
          <span className="chip mx-auto text-primary">{t('home.features.eyebrow')}</span>
          <h2 className="mt-4 text-balance text-2xl font-extrabold tracking-tight text-ink-heading sm:text-3xl lg:text-4xl">{t('home.features.title')}</h2>
          <p className="mt-4 text-balance text-base leading-relaxed text-ink-body">{t('home.features.subtitle')}</p>
        </div>
        <div ref={featuresRef} className="mt-8 flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 sm:pb-0 sm:grid sm:gap-6 sm:grid-cols-2 lg:grid-cols-4 sm:overflow-visible no-scrollbar">
          {features.map((f) => (
            <Card key={f.title} hover className="p-6 w-[85vw] max-w-[280px] shrink-0 snap-start sm:w-auto sm:max-w-none sm:shrink sm:snap-none">
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
      <section className="bg-surface py-8 lg:py-12">
        <div className="container-app">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div className="max-w-xl">
              <span className="chip text-primary">{t('home.featured.eyebrow')}</span>
              <h2 className="mt-4 text-balance text-2xl font-extrabold tracking-tight text-ink-heading sm:text-3xl lg:text-4xl">{t('home.featured.title')}</h2>
              <p className="mt-3 text-balance text-base text-ink-body">{t('home.featured.subtitle')}</p>
            </div>
            <Button to="/apartments" variant="outline">
              {t('cta.browse')}<ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-6">
            {loading ? (
              <div className="flex justify-center py-16"><Spinner className="h-6 w-6 text-primary" /></div>
            ) : apartments.length === 0 ? (
              <Card className="p-12 text-center text-ink-muted">{t('home.featured.empty')}</Card>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
                {apartments.map((a) => (
                  <div key={a.id}>
                    <ApartmentCard apartment={a} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container-app py-8 lg:py-12">
        <div className="mx-auto max-w-2xl text-center">
          <span className="chip mx-auto text-primary">{t('home.testimonials.eyebrow')}</span>
          <h2 className="mt-4 text-balance text-2xl font-extrabold tracking-tight text-ink-heading sm:text-3xl lg:text-4xl">{t('home.testimonials.title')}</h2>
        </div>
        <div ref={testimonialsRef} className="mt-8 flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6 -mx-4 px-4 md:mx-0 md:px-0 md:pb-0 md:grid md:gap-6 md:grid-cols-3 md:overflow-visible no-scrollbar">
          {testimonials.map((tm) => (
            <Card key={tm.name} className="p-6 w-[85vw] max-w-[320px] shrink-0 snap-start md:w-auto md:max-w-none md:shrink md:snap-none">
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
      <section className="pb-12 lg:pb-16">
        <div className="container-app">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary-hover px-6 py-10 text-center shadow-lift sm:px-12">
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
            <div className="relative mx-auto max-w-2xl">
              <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl lg:text-4xl">{t('home.cta.title')}</h2>
              <p className="mt-4 text-base leading-relaxed text-white/85">{t('home.cta.subtitle')}</p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
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
