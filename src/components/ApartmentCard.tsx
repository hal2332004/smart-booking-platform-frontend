import { Link } from 'react-router-dom';
import { BedDouble, Bath, Maximize, MapPin } from 'lucide-react';
import type { Apartment } from '@/lib/types';
import { formatPrice } from '@/lib/format';
import { useI18n } from '@/lib/i18n';
import { useCurrency } from '@/lib/currencyContext';
import { localizeApartment } from '@/lib/apartmentService';

export function ApartmentCard({ apartment: rawApartment }: { apartment: Apartment }) {
  const { t, language } = useI18n();
  const { currency } = useCurrency();
  const apartment = localizeApartment(rawApartment, language);
  const cover = apartment.images?.[0];

  return (
    <Link
      to={`/apartments/${apartment.slug}`}
      className="card card-hover group flex flex-col h-full overflow-hidden"
    >
      <div className="relative w-full aspect-square sm:aspect-[4/3] shrink-0 overflow-hidden bg-line/40">
        {cover ? (
          <img
            src={cover}
            alt={apartment.title}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-ink-muted">
            <Maximize className="h-8 w-8" />
          </div>
        )}
        <div className="absolute left-2 top-2 sm:left-3 sm:top-3 flex gap-1 sm:gap-2">
          {apartment.featured && (
            <span className="badge bg-white/90 text-primary shadow-soft font-bold text-[10px] sm:text-xs px-2 py-0.5 sm:px-2.5 sm:py-1">{t('detail.featured')}</span>
          )}
        </div>
        <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 max-w-[calc(100%-1rem)] rounded-sm bg-ink-heading/90 px-2 py-1 sm:px-2.5 text-[11px] sm:text-xs font-bold text-white backdrop-blur shadow-soft truncate">
          {formatPrice(apartment.rent, currency)}
          <span className="ml-1 text-[9px] sm:text-[11px] font-normal text-white/80">{t('common.perMonth')}</span>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-2.5 sm:p-4 gap-1.5 sm:gap-0">
        <div>
          <h3 className="line-clamp-2 sm:line-clamp-1 text-sm sm:text-base font-bold text-ink-heading group-hover:text-primary leading-snug">
            {apartment.title}
          </h3>
          <p className="mt-1 flex items-center gap-1 text-[11px] sm:text-xs text-ink-muted">
            <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0 text-primary/70" />
            <span className="line-clamp-1">
              {apartment.district ? `${apartment.district}, ` : ''}
              {apartment.city}
            </span>
          </p>
        </div>
        <div className="grid grid-cols-3 gap-0.5 sm:gap-1 border-t border-line pt-2 sm:pt-3 text-[10px] sm:text-xs font-medium text-ink-body mt-auto">
          <div className="flex items-center justify-center gap-1 min-w-0 text-center" title={`${apartment.bedrooms} ${t('common.beds')}`}>
            <BedDouble className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary shrink-0" />
            <span className="truncate font-semibold">{apartment.bedrooms} {t('common.bedsShort')}</span>
          </div>
          <div className="flex items-center justify-center gap-1 min-w-0 border-x border-line/60 px-1 text-center" title={`${apartment.bathrooms} ${t('common.baths')}`}>
            <Bath className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary shrink-0" />
            <span className="truncate font-semibold">{apartment.bathrooms} {t('common.bathsShort')}</span>
          </div>
          <div className="flex items-center justify-center gap-1 min-w-0 text-center" title={`${apartment.area} ${t('common.area')}`}>
            <Maximize className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary shrink-0" />
            <span className="truncate font-semibold">{apartment.area} {t('common.area')}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
