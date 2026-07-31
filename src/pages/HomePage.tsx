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
import { ScrollReveal } from '@/components/ui/ScrollReveal';

function useAutoScroll(speed = 0.5) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let animationFrameId: number;
    let direction = 1; // 1 for right, -1 for left
    let isInteracting = false;
    let exactScrollLeft = el.scrollLeft;

    const scrollStep = () => {
      if (!isInteracting && el.scrollWidth > el.clientWidth) {
        const maxScrollLeft = el.scrollWidth - el.clientWidth;
        
        if (Math.abs(exactScrollLeft - el.scrollLeft) > 2) {
          exactScrollLeft = el.scrollLeft; // Sync if user swiped
        }

        exactScrollLeft += direction * speed;
        el.scrollLeft = exactScrollLeft;

        if (el.scrollLeft >= maxScrollLeft - 1) {
          direction = -1;
        } else if (el.scrollLeft <= 1) {
          direction = 1;
        }
      }
      animationFrameId = requestAnimationFrame(scrollStep);
    };

    const timeoutId = setTimeout(() => {
      animationFrameId = requestAnimationFrame(scrollStep);
    }, 500);

    const startInteract = () => { isInteracting = true; };
    const stopInteract = () => { isInteracting = false; };

    el.addEventListener('touchstart', startInteract, { passive: true });
    el.addEventListener('touchend', stopInteract, { passive: true });
    el.addEventListener('mouseenter', startInteract);
    el.addEventListener('mouseleave', stopInteract);

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(animationFrameId);
      el.removeEventListener('touchstart', startInteract);
      el.removeEventListener('touchend', stopInteract);
      el.removeEventListener('mouseenter', startInteract);
      el.removeEventListener('mouseleave', stopInteract);
    };
  }, [speed]);

  return scrollRef;
}

export function HomePage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  
  const featuresRef = useAutoScroll(0.8);
  const testimonialsRef = useAutoScroll(0.6);

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
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/80" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-primary/30 blur-[100px]" />
        <div className="pointer-events-none absolute -left-24 top-40 h-72 w-72 rounded-full bg-accent/30 blur-[100px]" />
        
        <div className="container-app relative py-12 z-10">
          <div className="mx-auto max-w-4xl text-center">
            
            <h1 className="mt-6 animate-fade-up text-balance text-4xl font-extrabold tracking-tighter text-white drop-shadow-2xl sm:text-5xl lg:text-7xl" style={{ animationDelay: '60ms' }}>
              {t('home.hero.title')}
            </h1>
            
            <p className="mx-auto mt-6 max-w-2xl animate-fade-up text-balance text-base leading-relaxed text-white/95 drop-shadow-lg sm:text-lg lg:text-xl font-medium" style={{ animationDelay: '120ms' }}>
              {t('home.hero.subtitle')}
            </p>

            <div className="mt-10 animate-fade-up flex justify-center" style={{ animationDelay: '180ms' }}>
              <Link to="/apartments" className="inline-flex items-center justify-center rounded-full bg-white text-primary hover:bg-white/90 px-10 py-4 text-base lg:text-lg shadow-[0_0_40px_rgba(255,255,255,0.25)] font-extrabold transition-all hover:scale-105 active:scale-95">
                {t('cta.explore')}
              </Link>
            </div>
            <div className="mt-16 animate-fade-up flex justify-center" style={{ animationDelay: '240ms' }}>
              <button 
                onClick={() => {
                  const nextSection = document.getElementById('features');
                  if (nextSection) {
                    const headerOffset = 64;
                    const elementPosition = nextSection.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.scrollY - headerOffset;
                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                  }
                }}
                className="flex flex-col items-center animate-bounce cursor-pointer group"
                aria-label="Scroll down"
              >
                <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-lg transition-transform group-hover:scale-110 group-hover:bg-white/20">
                  <div className="flex flex-col items-center">
                    <Mouse className="h-5 w-5 sm:h-6 sm:w-6" />
                    <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 -mt-1" />
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

      </section>


      {/* Features */}
      <section id="features" className="container-app py-8 lg:py-12 overflow-hidden">
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <span className="chip mx-auto text-primary">{t('home.features.eyebrow')}</span>
          <h2 className="mt-4 text-balance text-2xl font-extrabold tracking-tight text-ink-heading sm:text-3xl lg:text-4xl">{t('home.features.title')}</h2>
          <p className="mt-4 text-balance text-base leading-relaxed text-ink-body">{t('home.features.subtitle')}</p>
        </ScrollReveal>
        <ScrollReveal delay={150} className="mt-8 flex overflow-x-auto gap-4 pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 sm:pb-0 sm:grid sm:gap-6 sm:grid-cols-2 lg:grid-cols-4 sm:overflow-visible no-scrollbar" ref={featuresRef}>
          {features.map((f) => (
            <Card key={f.title} hover className="p-6 w-[85vw] max-w-[280px] shrink-0 sm:w-auto sm:max-w-none sm:shrink">
              <span className="flex h-12 w-12 items-center justify-center rounded-sm bg-primary-soft text-primary">
                <f.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-base font-bold text-ink-heading">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-body">{f.body}</p>
            </Card>
          ))}
        </ScrollReveal>
      </section>

      {/* Featured */}
      <section className="bg-surface py-8 lg:py-12 overflow-hidden">
        <div className="container-app">
          <ScrollReveal animation="fade-left" className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div className="max-w-xl">
              <span className="chip text-primary">{t('home.featured.eyebrow')}</span>
              <h2 className="mt-4 text-balance text-2xl font-extrabold tracking-tight text-ink-heading sm:text-3xl lg:text-4xl">{t('home.featured.title')}</h2>
              <p className="mt-3 text-balance text-base text-ink-body">{t('home.featured.subtitle')}</p>
            </div>
            <Button to="/apartments" variant="outline">
              {t('cta.browse')}<ArrowRight className="h-4 w-4" />
            </Button>
          </ScrollReveal>

          <ScrollReveal delay={150} className="mt-6">
            {loading ? (
              <div className="flex justify-center py-16"><Spinner className="h-6 w-6 text-primary" /></div>
            ) : apartments.length === 0 ? (
              <Card className="p-12 text-center text-ink-muted">{t('home.featured.empty')}</Card>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
                {apartments.map((a, idx) => (
                  <ScrollReveal key={a.id} animation="zoom-in" delay={idx * 100}>
                    <ApartmentCard apartment={a} />
                  </ScrollReveal>
                ))}
              </div>
            )}
          </ScrollReveal>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container-app py-8 lg:py-12 overflow-hidden">
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <span className="chip mx-auto text-primary">{t('home.testimonials.eyebrow')}</span>
          <h2 className="mt-4 text-balance text-2xl font-extrabold tracking-tight text-ink-heading sm:text-3xl lg:text-4xl">{t('home.testimonials.title')}</h2>
        </ScrollReveal>
        <ScrollReveal delay={150} animation="fade-right" className="mt-8 flex overflow-x-auto gap-4 pb-6 -mx-4 px-4 md:mx-0 md:px-0 md:pb-0 md:grid md:gap-6 md:grid-cols-3 md:overflow-visible no-scrollbar" ref={testimonialsRef}>
          {testimonials.map((tm) => (
            <Card key={tm.name} className="p-6 w-[85vw] max-w-[320px] shrink-0 md:w-auto md:max-w-none md:shrink">
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
        </ScrollReveal>
      </section>

      {/* CTA */}
      <section className="pb-12 lg:pb-16 overflow-hidden">
        <div className="container-app">
          <ScrollReveal animation="zoom-in" className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary-hover px-6 py-10 text-center shadow-lift sm:px-12">
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
            <div className="relative mx-auto max-w-2xl">
              <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl lg:text-4xl">{t('home.cta.title')}</h2>
              <p className="mt-4 text-base leading-relaxed text-white/85">{t('home.cta.subtitle')}</p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link to="/apartments" className="inline-flex items-center gap-2 rounded-sm bg-white px-6 py-3 text-sm font-bold text-primary transition hover:bg-white/90">
                  {t('cta.browse')}<ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
