import { Link } from 'react-router-dom';
import { BedDouble, Bath, Maximize, MapPin } from 'lucide-react';
import type { Apartment } from '@/lib/types';
import { formatPrice } from '@/lib/format';
import { useI18n } from '@/lib/i18n';

export function ApartmentCard({ apartment }: { apartment: Apartment }) {
  const { t } = useI18n();
  const cover = apartment.images?.[0];

  return (
    <Link
      to={`/apartments/${apartment.slug}`}
      className="card card-hover group block overflow-hidden"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-line/40">
        {cover ? (
          <img
            src={cover}
            alt={apartment.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-ink-muted">
            <Maximize className="h-8 w-8" />
          </div>
        )}
        <div className="absolute left-3 top-3 flex gap-2">
          {apartment.featured && (
            <span className="badge bg-white/90 text-primary shadow-soft">{t('detail.featured')}</span>
          )}
        </div>
        <div className="absolute bottom-3 right-3 rounded-sm bg-ink-heading/85 px-2.5 py-1 text-sm font-bold text-white backdrop-blur">
          {formatPrice(apartment.rent, apartment.currency)}
          <span className="ml-0.5 text-xs font-medium text-white/70">{t('common.perMonth')}</span>
        </div>
      </div>

      <div className="space-y-3 p-4">
        <div>
          <h3 className="line-clamp-1 text-base font-bold text-ink-heading group-hover:text-primary">
            {apartment.title}
          </h3>
          <p className="mt-1 flex items-center gap-1 text-xs text-ink-muted">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="line-clamp-1">
              {apartment.district ? `${apartment.district}, ` : ''}
              {apartment.city}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-4 border-t border-line pt-3 text-xs font-medium text-ink-body">
          <span className="inline-flex items-center gap-1.5">
            <BedDouble className="h-4 w-4 text-primary" />
            {apartment.bedrooms} {t('common.beds')}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Bath className="h-4 w-4 text-primary" />
            {apartment.bathrooms} {t('common.baths')}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Maximize className="h-4 w-4 text-primary" />
            {apartment.area} {t('common.area')}
          </span>
        </div>
      </div>
    </Link>
  );
}
