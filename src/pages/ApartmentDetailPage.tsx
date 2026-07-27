import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, BedDouble, Bath, Maximize, MapPin, Check,
  CalendarClock, Building2, ShieldCheck, Phone, Share2, Sparkles,
  CheckCircle2, Heart
} from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { fetchApartmentBySlug, fetchPublishedApartments } from '@/lib/apartmentService';
import type { Apartment } from '@/lib/types';
import { formatPrice } from '@/lib/format';
import { Button } from '@/components/ui/Button';
import { Card, Badge, Spinner } from '@/components/ui/Card';
import { ApartmentCard } from '@/components/ApartmentCard';
import { MediaGallery } from '@/components/MediaGallery';

const facebookLinkEnv = import.meta.env.VITE_FACEBOOK_LINK;
const zaloLinkEnv = import.meta.env.VITE_ZALO_LINK;

export function ApartmentDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, language } = useI18n();
  const navigate = useNavigate();
  const [apartment, setApartment] = useState<Apartment | null>(null);
  const [similar, setSimilar] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setNotFound(false);
    fetchApartmentBySlug(slug)
      .then((data) => {
        if (!data) setNotFound(true);
        else {
          setApartment(data);
          fetchPublishedApartments()
            .then((all) => setSimilar(all.filter((a) => a.id !== data.id && a.city === data.city).slice(0, 3)))
            .catch(() => setSimilar([]));
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (loading) {
    return (
      <div className="container-app flex justify-center py-32">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    );
  }

  if (notFound || !apartment) {
    return (
      <div className="container-app py-24 text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-line/50 text-ink-muted">
          <Building2 className="h-8 w-8" />
        </span>
        <h1 className="mt-6 text-2xl font-extrabold text-ink-heading">{t('detail.notFound')}</h1>
        <p className="mt-2 text-ink-body">{t('detail.notFoundBody')}</p>
        <Button to="/apartments" className="mt-6">{t('detail.browseAll')}</Button>
      </div>
    );
  }

  // Map backend media to image/video URLs
  const media = (apartment.apartment_media ?? []).map((m) => ({
    url: m.storage_path,
    type: m.media_type as 'image' | 'video',
  }));

  const specs = [
    { icon: BedDouble, label: t('detail.bedrooms'), value: `${apartment.bedrooms}` },
    { icon: Bath, label: t('detail.bathrooms'), value: `${apartment.bathrooms}` },
    { icon: Maximize, label: t('detail.area'), value: `${apartment.area} m²` },
    { icon: Building2, label: t('detail.propertyType'), value: apartment.type || (language === 'vi' ? 'Chưng cư' : 'Apartment') },
  ];

  const zaloTarget = apartment.contact_zalo || zaloLinkEnv;
  const fbTarget = facebookLinkEnv;
  const phoneTarget = apartment.contact_phone || '0905 123 456';

  return (
    <div className="bg-canvas/40 pb-20">
      {/* Top Header & Gallery Area */}
      <div className="bg-surface border-b border-line pb-8">
        <div className="container-app py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-ink-muted transition hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" /> {t('common.back')}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-ink-body shadow-soft transition hover:border-primary hover:text-primary"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Share2 className="h-3.5 w-3.5" />}
              <span>{copied ? t('detail.linkCopied') : t('detail.share')}</span>
            </button>
            <button
              onClick={() => setIsSaved(!isSaved)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold shadow-soft transition ${
                isSaved
                  ? 'border-rose-500 bg-rose-50 text-rose-600'
                  : 'border-line bg-surface text-ink-body hover:border-rose-500 hover:text-rose-600'
              }`}
            >
              <Heart className={`h-3.5 w-3.5 ${isSaved ? 'fill-rose-600' : ''}`} />
              <span>{isSaved ? t('detail.saved') : t('detail.save')}</span>
            </button>
          </div>
        </div>

        {/* Title & Badges Bar */}
        <div className="container-app pb-4">
          <div className="flex flex-wrap items-center gap-2">
            {apartment.status === 'published' ? (
              <Badge tone="success" className="gap-1 font-bold">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {t('detail.status.published')}
              </Badge>
            ) : (
              <Badge tone="warning">{t('detail.status.draft')}</Badge>
            )}
            {apartment.featured && (
              <Badge tone="primary" className="gap-1 font-bold">
                <Sparkles className="h-3 w-3" /> {t('detail.featured')}
              </Badge>
            )}
          </div>

          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-ink-heading sm:text-3xl lg:text-4xl">
            {apartment.title}
          </h1>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-ink-muted">
            <MapPin className="h-4 w-4 text-primary shrink-0" />
            <span>
              {apartment.address ? `${apartment.address}, ` : ''}
              {apartment.district ? `${apartment.district}, ` : ''}
              {apartment.city}
            </span>
          </p>
        </div>

        {/* Responsive Media Gallery */}
        <div className="container-app">
          <MediaGallery items={media} title={apartment.title_vi} />
        </div>
      </div>

      {/* Main Content & Sidebar Grid */}
      <div className="container-app py-8 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Main Content Area */}
          <div className="space-y-8">
            {/* Quick Specs Dashboard */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {specs.map((s) => (
                <div
                  key={s.label}
                  className="flex flex-col items-center justify-center rounded-xl border border-line/80 bg-surface p-4 text-center shadow-soft transition hover:border-primary/40 hover:shadow-card"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-soft text-primary">
                    <s.icon className="h-5 w-5" />
                  </span>
                  <p className="mt-2 text-base font-extrabold text-ink-heading">{s.value}</p>
                  <p className="text-xs font-medium uppercase tracking-wider text-ink-muted">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Description Card */}
            <Card className="p-6 sm:p-8">
              <h2 className="text-xl font-bold text-ink-heading flex items-center gap-2 border-b border-line/60 pb-4">
                <Sparkles className="h-5 w-5 text-primary" />
                {t('detail.overview')}
              </h2>
              <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-ink-body font-normal">
                {apartment.description}
              </p>
            </Card>

            {/* Amenities Section */}
            {apartment.amenities && apartment.amenities.length > 0 && (
              <Card className="p-6 sm:p-8">
                <h2 className="text-xl font-bold text-ink-heading flex items-center gap-2 border-b border-line/60 pb-4">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  {t('detail.amenitiesTitle')}
                </h2>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {apartment.amenities.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 rounded-lg border border-line/60 bg-canvas/40 px-3.5 py-2.5 text-xs font-semibold text-ink-heading"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                        <Check className="h-3 w-3" />
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Location & Map Section */}
            <Card className="p-6 sm:p-8">
              <h2 className="text-xl font-bold text-ink-heading flex items-center gap-2 border-b border-line/60 pb-4">
                <MapPin className="h-5 w-5 text-rose-500" />
                {t('detail.location')}
              </h2>
              <div className="mt-4 flex items-start gap-3 rounded-xl bg-canvas p-4 border border-line/60">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div className="text-sm text-ink-body">
                  <p className="font-bold text-ink-heading">
                    {apartment.address ? `${apartment.address}, ` : ''}
                    {apartment.district ? `${apartment.district}, ` : ''}
                    {apartment.city}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-muted">
                    {t('detail.mapNote')}
                  </p>
                </div>
              </div>
              <div className="relative mt-4 h-[300px] w-full overflow-hidden rounded-xl border border-line shadow-soft">
                <iframe
                  title="Bản đồ vị trí căn hộ"
                  className="absolute -top-[105px] -left-[10px] h-[430px] w-[calc(100%+20px)] border-0"
                  scrolling="no"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(
                    `${apartment.address ? `${apartment.address}, ` : ''}${apartment.district ? `${apartment.district}, ` : ''}${apartment.city || 'Đà Nẵng'}`
                  )}&t=&z=15&ie=UTF8&iwloc=near&output=embed`}
                ></iframe>
              </div>
            </Card>
          </div>

          {/* Sticky Sidebar: Clean Fixed Price & Direct Contact Action Center */}
          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <Card className="overflow-hidden p-6 shadow-lift border border-line/80">
              {/* Rent Price Box — Fixed Layout */}
              <div className="rounded-xl bg-gradient-to-br from-primary-soft/80 to-primary-soft/30 p-5 text-center border border-primary/20">
                <p className="text-xs font-bold uppercase tracking-wider text-primary">{t('detail.priceLabel')}</p>
                <div className="mt-2 flex items-baseline justify-center gap-1.5 flex-wrap">
                  <span className="text-2xl font-black tracking-tight text-ink-heading sm:text-3xl whitespace-nowrap">
                    {formatPrice(apartment.rent, apartment.currency)}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wide text-ink-muted whitespace-nowrap">
                    {t('detail.perMonth')}
                  </span>
                </div>
                <p className="mt-2 text-xs font-medium text-ink-muted">{t('detail.priceCommit')}</p>
              </div>

              {/* Property Key Info Checklist */}
              <div className="mt-5 space-y-3 border-b border-line pb-5 text-sm">
                <div className="flex items-center justify-between text-ink-body">
                  <span className="flex items-center gap-2 text-ink-muted text-xs font-semibold">
                    <CalendarClock className="h-4 w-4 text-emerald-500" /> {t('detail.roomStatus')}
                  </span>
                  <span className="font-bold text-xs text-emerald-600 flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> {t('detail.roomReady')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-ink-body">
                  <span className="flex items-center gap-2 text-ink-muted text-xs font-semibold">
                    <Building2 className="h-4 w-4 text-primary" /> {t('detail.propertyType')}
                  </span>
                  <span className="font-semibold text-xs text-ink-heading">{apartment.type || (language === 'vi' ? 'Chưng cư' : 'Apartment')}</span>
                </div>
              </div>

              {/* Direct Landlord Contact Buttons */}
              <div className="mt-5 space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-ink-muted text-center">
                  {t('detail.contactTitle')}
                </p>

                {/* Zalo Button */}
                {zaloTarget && (
                  <a
                    href={zaloTarget}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-[#0068FF] to-[#0056D2] px-4 py-3.5 text-sm font-bold text-white shadow-soft transition-all duration-200 hover:shadow-lift hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span className="rounded bg-white/20 px-1.5 py-0.5 text-[10px] font-black uppercase tracking-tight">Zalo</span>
                    <span>{t('detail.chatZalo')}</span>
                  </a>
                )}

                {/* Facebook Messenger Button */}
                {fbTarget && (
                  <a
                    href={fbTarget}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-[#1877F2] to-[#166FE5] px-4 py-3.5 text-sm font-bold text-white shadow-soft transition-all duration-200 hover:shadow-lift hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span>{t('detail.chatFacebook')}</span>
                  </a>
                )}

                {/* Direct Phone Button */}
                {phoneTarget && (
                  <a
                    href={`tel:${phoneTarget}`}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm font-bold text-primary transition-all duration-200 hover:bg-primary hover:text-white"
                  >
                    <Phone className="h-4 w-4" />
                    <span>{t('detail.hotline')}: {phoneTarget}</span>
                  </a>
                )}
              </div>

              {/* Trust Signals Footer */}
              <div className="mt-5 space-y-2 rounded-xl bg-canvas/70 p-3.5 border border-line/60 text-xs text-ink-muted">
                <div className="flex items-center gap-2 font-medium text-ink-heading">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>{t('detail.trust1')}</span>
                </div>
                <div className="flex items-center gap-2 font-medium text-ink-heading">
                  <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                  <span>{t('detail.trust2')}</span>
                </div>
                <div className="flex items-center gap-2 font-medium text-ink-heading">
                  <Sparkles className="h-4 w-4 text-amber-500 shrink-0" />
                  <span>{t('detail.trust3')}</span>
                </div>
              </div>
            </Card>
          </aside>
        </div>

        {/* Similar Apartments Section */}
        {similar.length > 0 && (
          <section className="mt-16 border-t border-line/60 pt-12">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-ink-heading">{t('detail.similar')}</h2>
                <p className="mt-1 text-sm text-ink-muted">{t('detail.similarNote')}</p>
              </div>
              <Button to="/apartments" variant="ghost" size="sm">
                {t('detail.browseAll')} &rarr;
              </Button>
            </div>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((a) => (
                <ApartmentCard key={a.id} apartment={a} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}


