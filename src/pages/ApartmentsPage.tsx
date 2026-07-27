import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, MapPin, Building2, BedDouble, RotateCcw } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { fetchPublishedApartments } from '@/lib/apartmentService';
import {
  type Apartment, type ApartmentFilters, DEFAULT_FILTERS, CITIES, PROPERTY_TYPES,
} from '@/lib/types';
import { ApartmentCard } from '@/components/ApartmentCard';
import { Card, Spinner } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Field, Input, Select } from '@/components/ui/Field';

export function ApartmentsPage() {
  const { t } = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filters, setFilters] = useState<ApartmentFilters>({
    ...DEFAULT_FILTERS,
    search: searchParams.get('search') ?? '',
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchPublishedApartments()
      .then(setApartments)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const q = filters.search;
    if (q) setSearchParams({ search: q }, { replace: true });
    else setSearchParams({}, { replace: true });
  }, [filters.search, setSearchParams]);

  const filtered = useMemo(() => {
    return apartments.filter((a) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const hay = `${a.title} ${a.city} ${a.district} ${a.address}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (filters.city && a.city !== filters.city) return false;
      if (filters.type && a.type !== filters.type) return false;
      if (filters.bedrooms) {
        if (filters.bedrooms === 'studio' && a.bedrooms !== 0) return false;
        if (filters.bedrooms !== 'studio' && a.bedrooms < Number(filters.bedrooms)) return false;
      }
      if (filters.minPrice !== '' && a.rent < Number(filters.minPrice)) return false;
      if (filters.maxPrice !== '' && a.rent > Number(filters.maxPrice)) return false;
      return true;
    });
  }, [apartments, filters]);

  const update = (patch: Partial<ApartmentFilters>) => setFilters((f) => ({ ...f, ...patch }));
  const reset = () => setFilters(DEFAULT_FILTERS);

  return (
    <div className="container-app py-10 lg:py-14">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink-heading sm:text-4xl">{t('list.title')}</h1>
        <p className="mt-2 text-base text-ink-body">{t('list.subtitle')}</p>
      </div>

      <div className="mb-6 flex items-center gap-3 lg:hidden">
        <Button variant="outline" size="sm" onClick={() => setShowFilters((v) => !v)}>
          <SlidersHorizontal className="h-4 w-4" /> {t('list.filters')}
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        {/* Sidebar */}
        <aside className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
          <Card className="sticky top-24 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-sm font-bold text-ink-heading">
                <SlidersHorizontal className="h-4 w-4 text-primary" />
                {t('list.filters')}
              </h2>
              <button onClick={reset} className="text-xs font-semibold text-primary hover:underline">
                {t('list.filters.reset')}
              </button>
            </div>

            <div className="space-y-4">
              <Field label={t('list.filters.city')}>
                <Select value={filters.city} onChange={(e) => update({ city: e.target.value })}>
                  <option value="">{t('list.filters.any')}</option>
                  {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </Select>
              </Field>

              <Field label={t('list.filters.type')}>
                <Select value={filters.type} onChange={(e) => update({ type: e.target.value })}>
                  <option value="">{t('list.filters.any')}</option>
                  {PROPERTY_TYPES.map((c) => <option key={c} value={c}>{c}</option>)}
                </Select>
              </Field>

              <Field label={t('list.filters.bedrooms')}>
                <Select value={filters.bedrooms} onChange={(e) => update({ bedrooms: e.target.value })}>
                  <option value="">{t('list.filters.bedsAny')}</option>
                  <option value="studio">{t('list.filters.bedsStudio')}</option>
                  <option value="2">2 {t('list.filters.bedsPlus')}</option>
                  <option value="3">3 {t('list.filters.bedsPlus')}</option>
                  <option value="4">4 {t('list.filters.bedsPlus')}</option>
                </Select>
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label={t('list.filters.minPrice')}>
                  <Input
                    type="number"
                    min={0}
                    value={filters.minPrice}
                    onChange={(e) => update({ minPrice: e.target.value === '' ? '' : Number(e.target.value) })}
                    placeholder="0"
                  />
                </Field>
                <Field label={t('list.filters.maxPrice')}>
                  <Input
                    type="number"
                    min={0}
                    value={filters.maxPrice}
                    onChange={(e) => update({ maxPrice: e.target.value === '' ? '' : Number(e.target.value) })}
                    placeholder="∞"
                  />
                </Field>
              </div>
            </div>
          </Card>
        </aside>

        {/* Results */}
        <section>
          <div className="mb-5 flex items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
              <Input
                value={filters.search}
                onChange={(e) => update({ search: e.target.value })}
                placeholder={t('home.hero.search.placeholder')}
                className="pl-9"
              />
            </div>
            <p className="text-sm font-semibold text-ink-muted">
              {loading ? '…' : `${filtered.length} ${t('list.results')}`}
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-24"><Spinner className="h-8 w-8 text-primary" /></div>
          ) : error ? (
            <Card className="p-12 text-center">
              <p className="text-ink-body">{t('list.error')}</p>
            </Card>
          ) : filtered.length === 0 ? (
            <Card className="flex flex-col items-center justify-center gap-4 p-16 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-line/50 text-ink-muted">
                <Building2 className="h-7 w-7" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-ink-heading">{t('list.empty.title')}</h3>
                <p className="mt-1 text-sm text-ink-muted">{t('list.empty.body')}</p>
              </div>
              <Button variant="outline" size="sm" onClick={reset}>
                <RotateCcw className="h-4 w-4" /> {t('list.filters.reset')}
              </Button>
            </Card>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((a) => (
                <ApartmentCard key={a.id} apartment={a} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
