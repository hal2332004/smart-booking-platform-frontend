import { useEffect, useMemo, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, Building2, RotateCcw } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { useCurrency } from '@/lib/currencyContext';
import { formatPrice } from '@/lib/format';
import { convertVndToUsdSync, convertUsdToVndSync } from '@/lib/currencyService';
import { fetchPublishedApartments } from '@/lib/apartmentService';
import {
  type Apartment, type ApartmentFilters, DEFAULT_FILTERS, CITIES, PROPERTY_TYPES,
} from '@/lib/types';
import { ApartmentCard } from '@/components/ApartmentCard';
import { Card, Spinner } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Field, Input, Select } from '@/components/ui/Field';
import { SEO } from '@/components/SEO';

export function ApartmentsPage() {
  const { t } = useI18n();
  const { currency } = useCurrency();
  const [searchParams, setSearchParams] = useSearchParams();
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filters, setFilters] = useState<ApartmentFilters>({
    ...DEFAULT_FILTERS,
    search: searchParams.get('search') ?? '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 12;

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

  const availableCities = useMemo(() => {
    const list = [...CITIES];
    apartments.forEach((a) => {
      const cityName = a.city || a.cities?.name_vi;
      if (cityName && !list.includes(cityName)) {
        list.push(cityName);
      }
    });
    return list;
  }, [apartments]);

  // Danh sách chuẩn 94 phường/xã/đặc khu TP Đà Nẵng sau sáp nhập
  const DA_NANG_DISTRICTS = [
    'Phường Hải Châu', 'Phường Hòa Cường', 'Phường Thanh Khê', 'Phường An Khê',
    'Phường An Hải', 'Phường Sơn Trà', 'Phường Ngũ Hành Sơn', 'Phường Hòa Khánh',
    'Phường Hải Vân', 'Phường Liên Chiểu', 'Phường Cẩm Lệ', 'Phường Hòa Xuân',
    'Phường Tam Kỳ', 'Phường Quảng Phú', 'Phường Hương Trà', 'Phường Bàn Thạch',
    'Phường Điện Bàn', 'Phường Điện Bàn Đông', 'Phường An Thắng', 'Phường Điện Bàn Bắc',
    'Phường Hội An', 'Phường Hội An Đông', 'Phường Hội An Tây', 'Xã Hòa Vang',
    'Xã Hòa Tiến', 'Xã Bà Nà', 'Xã Núi Thành', 'Xã Tam Mỹ', 'Xã Tam Anh',
    'Xã Đức Phú', 'Xã Tam Xuân', 'Xã Tây Hồ', 'Xã Chiên Đàn', 'Xã Phú Ninh',
    'Xã Lãnh Ngọc', 'Xã Tiên Phước', 'Xã Thạnh Bình', 'Xã Sơn Cẩm Hà', 'Xã Trà Liên',
    'Xã Trà Giáp', 'Xã Trà Tân', 'Xã Trà Đốc', 'Xã Trà My', 'Xã Nam Trà My',
    'Xã Trà Tập', 'Xã Trà Vân', 'Xã Trà Linh', 'Xã Trà Leng', 'Xã Thăng Bình',
    'Xã Thăng An', 'Xã Thăng Trường', 'Xã Thăng Điền', 'Xã Thăng Phú', 'Xã Đồng Dương',
    'Xã Quế Sơn Trung', 'Xã Quế Sơn', 'Xã Xuân Phú', 'Xã Nông Sơn', 'Xã Quế Phước',
    'Xã Duy Nghĩa', 'Xã Nam Phước', 'Xã Duy Xuyên', 'Xã Thu Bồn', 'Xã Điện Bàn Tây',
    'Xã Gò Nổi', 'Xã Đại Lộc', 'Xã Hà Nha', 'Xã Thượng Đức', 'Xã Vu Gia',
    'Xã Phú Thuận', 'Xã Thạnh Mỹ', 'Xã Bến Giằng', 'Xã Nam Giang', 'Xã Đắc Pring',
    'Xã La Dêê', 'Xã La Êê', 'Xã Sông Vàng', 'Xã Sông Kôn', 'Xã Đông Giang',
    'Xã Bến Hiên', 'Xã Avương', 'Xã Tây Giang', 'Xã Hùng Sơn', 'Xã Hiệp Đức',
    'Xã Việt An', 'Xã Phước Trà', 'Xã Khâm Đức', 'Xã Phước Năng', 'Xã Phước Chánh',
    'Xã Phước Thành', 'Xã Phước Hiệp', 'Đặc khu Hoàng Sa', 'Xã Tam Hải', 'Xã Tân Hiệp'
  ];

  const availableDistricts = useMemo(() => {
    const set = new Set<string>(DA_NANG_DISTRICTS);
    apartments.forEach((a) => {
      const dist = a.district || a.districts?.name_vi;
      if (dist) set.add(dist);
    });
    return Array.from(set);
  }, [apartments]);

  const availableTypes = useMemo(() => {
    const list = [...PROPERTY_TYPES];
    apartments.forEach((a) => {
      const typeName = a.type || a.apartment_type;
      if (typeName && !list.includes(typeName)) {
        list.push(typeName);
      }
    });
    return list;
  }, [apartments]);

  const formatTypeLabel = (type: string) => {
    const lower = type.toLowerCase();
    if (lower === 'serviced' || lower.includes('dịch vụ')) return 'Căn hộ dịch vụ (Serviced)';
    if (lower === 'apartment' || lower === 'condo' || lower.includes('chung cư')) return 'Chung cư (Condo)';
    if (lower === 'studio') return 'Studio';
    if (lower === 'penthouse') return 'Penthouse';
    if (lower === 'duplex') return 'Duplex';
    return type;
  };

  // Price slider range bounds based on currency
  const maxPriceRange = currency === 'USD' ? 2000 : 50000000;
  const priceStep = currency === 'USD' ? 25 : 500000;

  // Local slider states for smooth 60fps dragging
  const [sliderMin, setSliderMin] = useState<number>(0);
  const [sliderMax, setSliderMax] = useState<number>(maxPriceRange);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Synchronize local slider values when filters or currency change
  useEffect(() => {
    const minVal = filters.minPrice !== ''
      ? (currency === 'USD' ? convertVndToUsdSync(Number(filters.minPrice)) : Number(filters.minPrice))
      : 0;
    const maxVal = filters.maxPrice !== ''
      ? (currency === 'USD' ? convertVndToUsdSync(Number(filters.maxPrice)) : Number(filters.maxPrice))
      : maxPriceRange;
    setSliderMin(minVal);
    setSliderMax(maxVal);
  }, [filters.minPrice, filters.maxPrice, currency, maxPriceRange]);

  const updateFiltersDebounced = (newMin: number, newMax: number) => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      const vndMin = currency === 'USD' ? convertUsdToVndSync(newMin) : newMin;
      const vndMax = currency === 'USD' ? convertUsdToVndSync(newMax) : newMax;

      setFilters((prev) => ({
        ...prev,
        minPrice: vndMin <= 0 ? '' : vndMin,
        maxPrice: newMax >= maxPriceRange ? '' : vndMax,
      }));
    }, 40); // Fast 40ms debounce for butter-smooth responsiveness
  };

  const handleMinSliderChange = (val: number) => {
    setSliderMin(val);
    updateFiltersDebounced(val, sliderMax);
  };

  const handleMaxSliderChange = (val: number) => {
    setSliderMax(val);
    updateFiltersDebounced(sliderMin, val);
  };

  const filtered = useMemo(() => {
    return apartments.filter((a) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const hay = `${a.title} ${a.city} ${a.district} ${a.address}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (filters.city) {
        const c1 = (a.city || '').toLowerCase();
        const c2 = (a.cities?.name_vi || '').toLowerCase();
        const target = filters.city.toLowerCase();
        if (c1 !== target && c2 !== target && !c1.includes(target) && !target.includes(c1)) return false;
      }
      if (filters.district) {
        const d1 = (a.district || '').toLowerCase();
        const d2 = (a.districts?.name_vi || '').toLowerCase();
        const target = filters.district.toLowerCase();
        if (d1 !== target && d2 !== target && !d1.includes(target) && !target.includes(d1)) return false;
      }
      if (filters.type) {
        const t1 = (a.type || '').toLowerCase();
        const t2 = (a.apartment_type || '').toLowerCase();
        const target = filters.type.toLowerCase();

        const normalizeType = (str: string) => {
          if (str.includes('dịch vụ') || str === 'serviced') return 'serviced';
          if (str.includes('chung cư') || str === 'apartment' || str === 'condo') return 'apartment';
          return str;
        };

        if (normalizeType(t1) !== normalizeType(target) && normalizeType(t2) !== normalizeType(target)) {
          return false;
        }
      }
      if (filters.bedrooms) {
        if (a.bedrooms < Number(filters.bedrooms)) return false;
      }
      if (filters.minPrice !== '' && a.rent < Number(filters.minPrice)) return false;
      if (filters.maxPrice !== '' && a.rent > Number(filters.maxPrice)) return false;
      return true;
    });
  }, [apartments, filters]);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  const displayed = useMemo(() => {
    return filtered.slice(0, page * ITEMS_PER_PAGE);
  }, [filtered, page]);

  const update = (patch: Partial<ApartmentFilters>) => setFilters((f) => ({ ...f, ...patch }));
  const reset = () => setFilters(DEFAULT_FILTERS);

  // Format displayed slider text
  const displayMinPriceText = useMemo(() => {
    if (sliderMin <= 0) return '0';
    const vndVal = currency === 'USD' ? convertUsdToVndSync(sliderMin) : sliderMin;
    return formatPrice(vndVal, currency);
  }, [sliderMin, currency]);

  const displayMaxPriceText = useMemo(() => {
    if (sliderMax >= maxPriceRange) return `${currency === 'USD' ? '2,000$' : '50.000.000đ'}+`;
    const vndVal = currency === 'USD' ? convertUsdToVndSync(sliderMax) : sliderMax;
    return formatPrice(vndVal, currency);
  }, [sliderMax, maxPriceRange, currency]);

  return (
    <div className="container-app py-4 lg:py-6">
      <SEO title={t('nav.apartments')} />
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-ink-heading sm:text-3xl lg:text-4xl">{t('list.title')}</h1>
        <p className="mt-1 sm:mt-2 text-sm sm:text-base text-ink-body">{t('list.subtitle')}</p>
      </div>

      <div className="mb-6 flex items-center gap-3 lg:hidden">
        <Button variant="outline" size="sm" onClick={() => setShowFilters((v) => !v)}>
          <SlidersHorizontal className="h-4 w-4" /> {t('list.filters')}
        </Button>
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-[280px_1fr]">
        {/* Sidebar */}
        <aside className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
          <Card className="sticky top-24 p-5 space-y-5">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h2 className="flex items-center gap-2 text-sm font-bold text-ink-heading">
                <SlidersHorizontal className="h-4 w-4 text-primary" />
                {t('list.filters')}
              </h2>
              <button onClick={reset} className="text-xs font-semibold text-primary hover:underline">
                {t('list.filters.reset')}
              </button>
            </div>

            <div className="space-y-4">
              {/* City Filter */}
              <Field label={t('list.filters.city')}>
                <Select value={filters.city} onChange={(e) => update({ city: e.target.value, district: '' })}>
                  <option value="">{t('list.filters.any')}</option>
                  {availableCities.map((c) => <option key={c} value={c}>{c}</option>)}
                </Select>
              </Field>

              {/* District Filter: Searchable Input + Options Datalist */}
              <Field label={t('list.filters.district')}>
                <div className="relative w-full">
                  <Input
                    list="district-options"
                    value={filters.district}
                    onChange={(e) => update({ district: e.target.value })}
                    placeholder={t('list.filters.districtPlaceholder')}
                    className="pr-7 text-xs font-semibold"
                  />
                  {filters.district && (
                    <button
                      type="button"
                      onClick={() => update({ district: '' })}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink-heading"
                      title="Xoá"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <datalist id="district-options">
                    {availableDistricts.map((d) => (
                      <option key={d} value={d} />
                    ))}
                  </datalist>
                </div>
              </Field>

              {/* Property Type Filter */}
              <Field label={t('list.filters.type')}>
                <Select value={filters.type} onChange={(e) => update({ type: e.target.value })}>
                  <option value="">{t('list.filters.any')}</option>
                  {availableTypes.map((c) => <option key={c} value={c}>{formatTypeLabel(c)}</option>)}
                </Select>
              </Field>

              {/* Bedrooms Filter (Removed Studio) */}
              <Field label={t('list.filters.bedrooms')}>
                <Select value={filters.bedrooms} onChange={(e) => update({ bedrooms: e.target.value })}>
                  <option value="">{t('list.filters.bedsAny')}</option>
                  <option value="1">1+ {t('common.beds')}</option>
                  <option value="2">2+ {t('common.beds')}</option>
                  <option value="3">3+ {t('common.beds')}</option>
                  <option value="4">4+ {t('common.beds')}</option>
                </Select>
              </Field>

              {/* Ultra-Smooth 60FPS Range Sliders for Price */}
              <div className="space-y-4 pt-2 border-t border-line">
                {/* Min Price Slider */}
                <Field label={t('list.filters.minPrice')}>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-ink-heading">
                      <span className="text-primary font-bold">{displayMinPriceText}</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={maxPriceRange}
                      step={priceStep}
                      value={sliderMin}
                      onChange={(e) => handleMinSliderChange(Number(e.target.value))}
                      className="w-full h-2 bg-line rounded-lg appearance-none cursor-pointer accent-primary transition-all active:scale-[1.01]"
                    />
                  </div>
                </Field>

                {/* Max Price Slider */}
                <Field label={t('list.filters.maxPrice')}>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-ink-heading">
                      <span className="text-primary font-bold">{displayMaxPriceText}</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={maxPriceRange}
                      step={priceStep}
                      value={sliderMax}
                      onChange={(e) => handleMaxSliderChange(Number(e.target.value))}
                      className="w-full h-2 bg-line rounded-lg appearance-none cursor-pointer accent-primary transition-all active:scale-[1.01]"
                    />
                  </div>
                </Field>
              </div>
            </div>
          </Card>
        </aside>

        {/* Results */}
        <section>
          <div className="mb-4 flex items-center justify-between gap-3">
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
            <>
              <div className="grid grid-cols-2 gap-3 sm:gap-6 xl:grid-cols-3">
                {displayed.map((a) => (
                  <ApartmentCard key={a.id} apartment={a} />
                ))}
              </div>
              {displayed.length < filtered.length && (
                <div className="mt-10 flex justify-center">
                  <Button variant="outline" onClick={() => setPage((p) => p + 1)}>
                    {t('cta.browse') || 'Xem thêm'}
                  </Button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
