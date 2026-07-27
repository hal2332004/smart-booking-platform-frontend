import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Pencil, Trash2, Plus, MapPin, AlertCircle } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { fetchApartments, deleteApartment } from '@/lib/apartmentService';
import type { Apartment } from '@/lib/types';
import { formatPrice } from '@/lib/format';
import { Card, Badge, Spinner } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export function AdminApartmentsPage() {
  const { t } = useI18n();
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    setError(false);
    fetchApartments()
      .then(setApartments)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('admin.apartments.deleteConfirm'))) return;
    setDeletingId(id);
    try {
      await deleteApartment(id);
      setApartments((prev) => prev.filter((a) => a.id !== id));
    } catch {
      alert(t('admin.apartments.deleteError'));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink-heading">{t('admin.apartments.title')}</h1>
          <p className="mt-1 text-sm text-ink-muted">{t('admin.apartments.subtitle')}</p>
        </div>
        <Button to="/admin/apartments/create">
          <Plus className="h-4 w-4" /> {t('admin.apartments.create')}
        </Button>
      </div>

      <Card className="overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-20"><Spinner className="h-7 w-7 text-primary" /></div>
        ) : error ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <AlertCircle className="h-8 w-8 text-danger" />
            <p className="text-sm text-ink-body">{t('admin.apartments.deleteError')}</p>
            <Button variant="outline" size="sm" onClick={load}>Retry</Button>
          </div>
        ) : apartments.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-line/50 text-ink-muted">
              <Building2 className="h-7 w-7" />
            </span>
            <p className="text-sm font-semibold text-ink-heading">{t('admin.apartments.empty')}</p>
            <Button to="/admin/apartments/create" size="sm">{t('admin.apartments.emptyCta')}</Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-10 bg-surface text-left text-xs font-bold uppercase tracking-wide text-ink-muted">
                <tr className="border-b border-line">
                  <th className="px-5 py-3.5">{t('admin.apartments.th.title')}</th>
                  <th className="px-5 py-3.5">{t('admin.apartments.th.location')}</th>
                  <th className="px-5 py-3.5">{t('admin.apartments.th.rent')}</th>
                  <th className="px-5 py-3.5">{t('admin.apartments.th.status')}</th>
                  <th className="px-5 py-3.5 text-right">{t('admin.apartments.th.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {apartments.map((a) => (
                  <tr key={a.id} className="transition hover:bg-canvas/60">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-14 shrink-0 overflow-hidden rounded-xs bg-line/40">
                          {a.apartment_media?.[0]?.storage_path && (
                            <img src={a.apartment_media[0].storage_path} alt="" className="h-full w-full object-cover" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-bold text-ink-heading">{a.title_vi}</p>
                          <p className="truncate text-xs text-ink-muted">{a.apartment_type} · {a.bedrooms} {t('common.beds')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="flex items-center gap-1 text-ink-body">
                        <MapPin className="h-3.5 w-3.5 text-ink-muted" />
                        <span className="truncate">{a.cities?.name_vi}</span>
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-bold text-ink-heading">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(a.rent_price)}
                    </td>
                    <td className="px-5 py-3.5">
                      {a.published ? (
                        <Badge tone="success">{t('admin.apartments.status.live')}</Badge>
                      ) : (
                        <Badge tone="warning">Draft</Badge>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/admin/apartments/edit/${a.id}`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-sm border border-line text-ink-body transition hover:border-primary hover:text-primary"
                          title={t('admin.apartments.edit')}
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(a.id)}
                          disabled={deletingId === a.id}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-sm border border-line text-ink-body transition hover:border-danger hover:text-danger disabled:opacity-50"
                          title={t('admin.apartments.delete')}
                        >
                          {deletingId === a.id ? <Spinner /> : <Trash2 className="h-4 w-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
