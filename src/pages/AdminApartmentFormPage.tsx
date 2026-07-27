import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, AlertCircle, Check, Film, Image as ImageIcon, X } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import {
  fetchApartmentById, createApartment, updateApartment, makeSlug,
} from '@/lib/apartmentService';
import { supabase } from '@/lib/supabase';
import { getCities, getDistricts } from '@/lib/locationService';
import { getAmenities } from '@/lib/amenityService';
import {
  type ApartmentMedia, type City, type District, type Amenity,
} from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Field, Input, Textarea, Select } from '@/components/ui/Field';

interface ApartmentFormInput {
  code: string;
  title_vi: string;
  slug: string;
  apartment_type: string;
  rent_price: string;
  electricity_price: string;
  water_price: string;
  parking_fee: string;
  management_fee: string;
  city_id: string;
  district_id: string;
  address: string;
  latitude: string;
  longitude: string;
  contact_phone: string;
  contact_zalo: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  description_vi: string;
  published: boolean;
  featured: boolean;
}

const emptyForm: ApartmentFormInput = {
  code: '',
  title_vi: '',
  slug: '',
  apartment_type: 'serviced',
  rent_price: '',
  electricity_price: '',
  water_price: '',
  parking_fee: '',
  management_fee: '',
  city_id: '',
  district_id: '',
  address: '',
  latitude: '',
  longitude: '',
  contact_phone: '',
  contact_zalo: '',
  bedrooms: 1,
  bathrooms: 1,
  area: '',
  description_vi: '',
  published: false,
  featured: false,
};

const generateCode = () => `APT-${Math.floor(100000 + Math.random() * 900000)}`;

export function AdminApartmentFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const { t } = useI18n();
  const navigate = useNavigate();

  const [form, setForm] = useState<ApartmentFormInput>(emptyForm);
  const [existingMedia, setExistingMedia] = useState<ApartmentMedia[]>([]);
  const [newFiles, setNewFiles] = useState<Array<{ file: File; preview: string; type: 'image' | 'video'; isCover: boolean }>>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [allAmenities, setAllAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);

  // ---------- Media handling helpers ----------
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newItems: Array<{ file: File; preview: string; type: 'image' | 'video'; isCover: boolean }> = [];
    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);
      const type = file.type.startsWith('video') ? 'video' : 'image';
      newItems.push({ file, preview: url, type, isCover: false });
    });
    setNewFiles((prev) => [...prev, ...newItems]);
  };

  const removeNewFile = (index: number) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const deleteExistingMedia = async (mediaId: string, storagePath: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa file này?')) return;
    try {
      setSaving(true);
      // Delete from storage bucket
      let path = storagePath;
      if (storagePath.includes('/storage/v1/object/public/apartments/')) {
        path = storagePath.split('/storage/v1/object/public/apartments/')[1];
      }
      const { error: storageErr } = await supabase.storage.from('apartments').remove([path]);
      if (storageErr) {
        console.warn('Storage deletion warning:', storageErr);
      }
      // Delete DB row
      const { error: dbErr } = await supabase.from('apartment_media').delete().eq('id', mediaId);
      if (dbErr) throw dbErr;
      setExistingMedia((prev) => prev.filter((m) => m.id !== mediaId));
      alert('Đã xóa file thành công!');
    } catch (e: any) {
      console.error('Failed to delete media', e);
      alert('Lỗi khi xóa media: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  const setCoverMedia = async (mediaId: string) => {
    if (!id) return;
    try {
      setSaving(true);
      // Clear cover flags for this apartment
      const { error: clearErr } = await supabase
        .from('apartment_media')
        .update({ is_cover: false })
        .eq('apartment_id', id);
      if (clearErr) throw clearErr;

      // Set new cover flag
      const { error: setErr } = await supabase
        .from('apartment_media')
        .update({ is_cover: true })
        .eq('id', mediaId);
      if (setErr) throw setErr;

      setExistingMedia((prev) =>
        prev.map((m) => ({ ...m, is_cover: m.id === mediaId }))
      );
    } catch (e: any) {
      console.error('Failed to set cover', e);
      alert('Lỗi đặt ảnh bìa: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [citiesData, amenitiesData] = await Promise.all([getCities(), getAmenities()]);
        setCities(citiesData || []);
        setAllAmenities(amenitiesData || []);

        if (id) {
          const a = await fetchApartmentById(id);
          if (!a) {
            setNotFound(true);
            return;
          }
          setForm({
            code: a.code || '',
            title_vi: a.title_vi || '',
            slug: a.slug || '',
            apartment_type: a.apartment_type || 'serviced',
            rent_price: a.rent_price !== null && a.rent_price !== undefined ? String(a.rent_price) : '',
            electricity_price: a.electricity_price !== null && a.electricity_price !== undefined ? String(a.electricity_price) : '',
            water_price: a.water_price !== null && a.water_price !== undefined ? String(a.water_price) : '',
            parking_fee: a.parking_fee !== null && a.parking_fee !== undefined ? String(a.parking_fee) : '',
            management_fee: a.management_fee !== null && a.management_fee !== undefined ? String(a.management_fee) : '',
            city_id: a.city_id !== null && a.city_id !== undefined ? String(a.city_id) : '',
            district_id: a.district_id !== null && a.district_id !== undefined ? String(a.district_id) : '',
            address: a.address || '',
            latitude: a.latitude !== null && a.latitude !== undefined ? String(a.latitude) : '',
            longitude: a.longitude !== null && a.longitude !== undefined ? String(a.longitude) : '',
            contact_phone: a.contact_phone || '',
            contact_zalo: a.contact_zalo || '',
            bedrooms: a.bedrooms || 1,
            bathrooms: a.bathrooms || 1,
            area: a.area !== null && a.area !== undefined ? String(a.area) : '',
            description_vi: a.description_vi || '',
            published: a.published || false,
            featured: a.featured || false,
          });

          if (a.city_id) {
            const districtsData = await getDistricts(String(a.city_id));
            setDistricts(districtsData || []);
          }

          setExistingMedia(a.apartment_media || []);
          setSelectedAmenities(a.apartment_amenities?.map((am: any) => String(am.amenity_id)) || []);
        } else {
          setForm({
            ...emptyForm,
            code: generateCode(),
          });
        }
      } catch (e) {
        console.error(e);
        setError('Không thể tải thông tin căn hộ');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const [notFound, setNotFound] = useState(false);

  const update = (patch: Partial<ApartmentFormInput>) => setForm((f) => ({ ...f, ...patch }));

  const handleTitleChange = (title: string) => {
    update({ title_vi: title });
    if (!slugTouched) update({ slug: makeSlug(title) });
  };

  const handleSlugChange = (slug: string) => {
    setSlugTouched(true);
    update({ slug });
  };

  const handleCityChange = async (cityId: string) => {
    update({ city_id: cityId, district_id: '' });
    if (cityId) {
      try {
        const districtsData = await getDistricts(cityId);
        setDistricts(districtsData || []);
      } catch (err) {
        console.error(err);
      }
    } else {
      setDistricts([]);
    }
  };

  const toggleAmenity = (amenityId: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenityId)
        ? prev.filter((x) => x !== amenityId)
        : [...prev, amenityId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.address) {
      alert('Vui lòng nhập Địa chỉ chi tiết!');
      return;
    }
    setSaving(true);
    setError(null);

    const payload = {
      code: form.code,
      title_vi: form.title_vi,
      slug: form.slug || makeSlug(form.title_vi),
      apartment_type: form.apartment_type,
      rent_price: parseFloat(form.rent_price) || 0,
      electricity_price: form.electricity_price ? parseFloat(form.electricity_price) : null,
      water_price: form.water_price ? parseFloat(form.water_price) : null,
      parking_fee: form.parking_fee ? parseFloat(form.parking_fee) : null,
      management_fee: form.management_fee ? parseFloat(form.management_fee) : null,
      city_id: form.city_id ? parseInt(form.city_id) : null,
      district_id: form.district_id ? parseInt(form.district_id) : null,
      address: form.address,
      latitude: form.latitude ? parseFloat(form.latitude) : null,
      longitude: form.longitude ? parseFloat(form.longitude) : null,
      contact_phone: form.contact_phone || null,
      contact_zalo: form.contact_zalo || null,
      bedrooms: parseInt(String(form.bedrooms)) || 1,
      bathrooms: parseInt(String(form.bathrooms)) || 1,
      area: form.area ? parseFloat(form.area) : null,
      description_vi: form.description_vi || '',
      published: form.published,
      featured: form.featured,
    };

    try {
      let apartmentId = id;
      if (isEdit && id) {
        await updateApartment(id, payload as any);
      } else {
        const newApt = await createApartment(payload as any);
        apartmentId = newApt.id;
      }

      if (apartmentId) {
        // Sync amenities
        const { error: delAmenError } = await supabase
          .from('apartment_amenities')
          .delete()
          .eq('apartment_id', apartmentId);
        if (delAmenError) throw delAmenError;

        if (selectedAmenities.length > 0) {
          const rows = selectedAmenities.map((aid) => ({
            apartment_id: apartmentId,
            amenity_id: parseInt(aid),
          }));
          const { error: insAmenError } = await supabase.from('apartment_amenities').insert(rows);
          if (insAmenError) throw insAmenError;
        }

        // Upload new files
        if (newFiles.length > 0) {
          const startSortOrder = existingMedia.length;
          for (let i = 0; i < newFiles.length; i++) {
            const item = newFiles[i];
            const ext = item.file.name.split('.').pop();
            const fileName = `${Date.now()}_new_${i}.${ext}`;
            const storagePath = `${apartmentId}/${fileName}`;

            const { error: uploadErr } = await supabase.storage.from('apartments').upload(storagePath, item.file);
            if (uploadErr) throw uploadErr;

            const { data: { publicUrl } } = supabase.storage.from('apartments').getPublicUrl(storagePath);

            await supabase.from('apartment_media').insert({
              apartment_id: apartmentId,
              media_type: item.type,
              storage_path: publicUrl,
              file_name: fileName,
              file_size: item.file.size,
              mime_type: item.file.type,
              is_cover: false,
              sort_order: startSortOrder + i,
            });
          }
        }
      }
      alert(isEdit ? 'Cập nhật căn hộ thành công!' : 'Tạo căn hộ thành công!');
      navigate('/admin/apartments');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.details || err.response?.data?.message || err.message || 'Lỗi khi lưu căn hộ');
    } finally {
      setSaving(false);
    }
  };

  if (notFound) {
    return (
      <div className="py-20 text-center">
        <AlertCircle className="mx-auto h-10 w-10 text-ink-muted" />
        <p className="mt-4 text-sm text-ink-body">{t('admin.form.notFound')}</p>
        <Button to="/admin/apartments" className="mt-4">{t('common.back')}</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link to="/admin/apartments" className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-muted transition hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> {t('common.back')}
        </Link>
        <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-ink-heading">
          {isEdit ? t('admin.form.edit.title') : t('admin.form.create.title')}
        </h1>
        <p className="mt-1 text-sm text-ink-muted">{t('admin.form.subtitle')}</p>
      </div>

      {loading ? (
        <Card className="h-64 animate-pulse bg-line/30" />
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basics */}
          <Card className="p-6">
            <h2 className="text-base font-bold text-ink-heading">{t('admin.form.section.basics')}</h2>
            <div className="mt-4 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Mã căn hộ *" required>
                  <Input value={form.code} onChange={(e) => update({ code: e.target.value })} required />
                </Field>
                <Field label="Loại căn hộ">
                  <Select value={form.apartment_type} onChange={(e) => update({ apartment_type: e.target.value })}>
                    <option value="serviced">Căn hộ dịch vụ (Serviced)</option>
                    <option value="apartment">Chung cư (Condo)</option>
                    <option value="studio">Studio</option>
                    <option value="penthouse">Penthouse</option>
                    <option value="duplex">Duplex</option>
                  </Select>
                </Field>
              </div>
              <Field label="Tên căn hộ (Tiếng Việt) *" required>
                <Input value={form.title_vi} onChange={(e) => handleTitleChange(e.target.value)} required placeholder="Ví dụ: Căn Hộ Vinhomes Central Park Studio Cao Cấp" />
              </Field>
              <Field label="Đường dẫn tĩnh (Slug) *" hint="vinhomes-central-park-studio">
                <Input value={form.slug} onChange={(e) => handleSlugChange(e.target.value)} placeholder="vinhomes-central-park-studio" />
              </Field>
              <Field label="Mô tả chi tiết">
                <Textarea rows={4} value={form.description_vi} onChange={(e) => update({ description_vi: e.target.value })} placeholder="Nhập thông tin mô tả chi tiết về căn hộ..." />
              </Field>
            </div>
          </Card>

          {/* Pricing & Specification */}
          <Card className="p-6">
            <h2 className="text-base font-bold text-ink-heading">Thông tin giá & Chi tiết</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Giá thuê / tháng (VND) *" required>
                <Input type="number" value={form.rent_price} onChange={(e) => update({ rent_price: e.target.value })} required />
              </Field>
              <Field label="Diện tích (m²)">
                <Input type="number" value={form.area} onChange={(e) => update({ area: e.target.value })} />
              </Field>
              <Field label="Số phòng ngủ *" required>
                <Input type="number" min={1} value={form.bedrooms} onChange={(e) => update({ bedrooms: parseInt(e.target.value) || 1 })} required />
              </Field>
              <Field label="Số phòng tắm *" required>
                <Input type="number" min={1} value={form.bathrooms} onChange={(e) => update({ bathrooms: parseInt(e.target.value) || 1 })} required />
              </Field>
              <Field label="Giá điện (VND / kWh)">
                <Input type="number" value={form.electricity_price} onChange={(e) => update({ electricity_price: e.target.value })} placeholder="Ví dụ: 4000" />
              </Field>
              <Field label="Giá nước (VND / m³ hoặc người)">
                <Input type="number" value={form.water_price} onChange={(e) => update({ water_price: e.target.value })} placeholder="Ví dụ: 100000" />
              </Field>
              <Field label="Phí gửi xe (VND / xe / tháng)">
                <Input type="number" value={form.parking_fee} onChange={(e) => update({ parking_fee: e.target.value })} placeholder="Ví dụ: 150000" />
              </Field>
              <Field label="Phí quản lý (VND / tháng)">
                <Input type="number" value={form.management_fee} onChange={(e) => update({ management_fee: e.target.value })} />
              </Field>
            </div>
          </Card>

          {/* Location */}
          <Card className="p-6">
            <h2 className="text-base font-bold text-ink-heading">{t('admin.form.section.location')}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Thành phố *" required>
                <Select value={form.city_id} onChange={(e) => handleCityChange(e.target.value)} required>
                  <option value="">-- Chọn Thành phố --</option>
                  {cities.map((c) => <option key={c.id} value={c.id}>{c.name_vi}</option>)}
                </Select>
              </Field>
              <Field label="Quận/Huyện *" required>
                <Select value={form.district_id} onChange={(e) => update({ district_id: e.target.value })} disabled={!form.city_id} required>
                  <option value="">-- Chọn Quận/Huyện --</option>
                  {districts.map((d) => <option key={d.id} value={d.id}>{d.name_vi}</option>)}
                </Select>
              </Field>
              <div className="sm:col-span-2">
                <Field label="Địa chỉ chi tiết *" required>
                  <Input value={form.address} onChange={(e) => update({ address: e.target.value })} placeholder="Ví dụ: 208 Nguyễn Hữu Cảnh, Phường 22, Bình Thạnh" required />
                </Field>
              </div>
              <Field label="Vĩ độ (Latitude)">
                <Input type="number" step="any" value={form.latitude} onChange={(e) => update({ latitude: e.target.value })} placeholder="Ví dụ: 10.7947" />
              </Field>
              <Field label="Kinh độ (Longitude)">
                <Input type="number" step="any" value={form.longitude} onChange={(e) => update({ longitude: e.target.value })} placeholder="Ví dụ: 106.7218" />
              </Field>
            </div>
          </Card>

          {/* Contact */}
          <Card className="p-6">
            <h2 className="text-base font-bold text-ink-heading">Thông tin liên hệ</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Số điện thoại liên hệ">
                <Input value={form.contact_phone} onChange={(e) => update({ contact_phone: e.target.value })} placeholder="Ví dụ: 0935057511" />
              </Field>
              <Field label="Liên kết Zalo (URL hoặc SĐT)">
                <Input value={form.contact_zalo} onChange={(e) => update({ contact_zalo: e.target.value })} placeholder="Ví dụ: https://zalo.me/0935057511" />
              </Field>
            </div>
          </Card>

          {/* Amenities */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-ink-heading">{t('admin.form.section.amenities')}</h2>
              <span className="text-xs text-ink-muted">{t('admin.form.amenitiesHint')}</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {allAmenities.map((a) => {
                const active = selectedAmenities.includes(String(a.id));
                return (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => toggleAmenity(String(a.id))}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                      active
                        ? 'border-primary bg-primary-soft text-primary'
                        : 'border-line bg-surface text-ink-body hover:border-primary/50'
                    }`}
                  >
                    {active && <Check className="h-3.5 w-3.5" />}
                    {a.name_vi}
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Existing Media Preview */}
          {isEdit && existingMedia.length > 0 && (
            <Card className="p-6">
              <h2 className="text-base font-bold text-ink-heading">Ảnh & Video hiện có</h2>
              <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
                {existingMedia.map((media) => (
                  <div key={media.id} className={`relative aspect-square overflow-hidden rounded-xs border ${media.is_cover ? 'border-primary ring-2 ring-primary/20' : 'border-line'}`}>
                    {media.media_type === 'image' ? (
                      <img src={media.storage_path} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <video src={media.storage_path} className="h-full w-full object-cover" muted />
                    )}
                    
                    <div className="absolute right-1 top-1 flex gap-1">
                      <button
                        type="button"
                        onClick={() => deleteExistingMedia(media.id, media.storage_path)}
                        className="rounded-full bg-danger/80 p-1 text-white hover:bg-danger"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="absolute bottom-1 left-1 flex gap-1">
                      {media.media_type === 'image' && (
                        <button
                          type="button"
                          onClick={() => setCoverMedia(media.id)}
                          className={`rounded-xs px-1.5 py-0.5 text-[10px] font-bold text-white transition ${media.is_cover ? 'bg-primary' : 'bg-canvas/80 text-ink-heading hover:bg-primary'}`}
                        >
                          {media.is_cover ? 'Ảnh bìa' : 'Làm ảnh bìa'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* New Media Upload */}
          <Card className="p-6">
            <h2 className="text-base font-bold text-ink-heading">Tải lên Ảnh & Video mới</h2>
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="mt-2"
            />
            {newFiles.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
                {newFiles.map((item, idx) => (
                  <div key={idx} className="relative aspect-square overflow-hidden rounded-xs border border-line">
                    {item.type === 'image' ? (
                      <img src={item.preview} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <video src={item.preview} className="h-full w-full object-cover" muted />
                    )}
                    <button
                      type="button"
                      onClick={() => removeNewFile(idx)}
                      className="absolute right-1 top-1 rounded-full bg-danger/80 p-0.5 text-white hover:bg-danger"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Status & Settings */}
          <Card className="p-6">
            <h2 className="text-base font-bold text-ink-heading">Thiết lập xuất bản</h2>
            <div className="mt-4 space-y-4">
              <div className="flex gap-2">
                {[
                  { key: 'published', label: 'Xuất bản (Hiển thị công khai)', value: true },
                  { key: 'draft', label: 'Bản nháp (Ẩn)', value: false }
                ].map((s) => (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => update({ published: s.value })}
                    className={`flex-1 rounded-sm border px-4 py-3 text-sm font-semibold transition ${
                      form.published === s.value
                        ? 'border-primary bg-primary-soft text-primary'
                        : 'border-line bg-surface text-ink-body hover:border-primary/50'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              <label className="flex cursor-pointer items-center gap-3 rounded-sm bg-canvas p-3">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => update({ featured: e.target.checked })}
                  className="h-4 w-4 rounded border-line text-primary focus:ring-primary/20"
                />
                <span className="text-sm font-medium text-ink-body">Căn hộ nổi bật (Featured)</span>
              </label>
            </div>
          </Card>

          {error && (
            <div className="flex items-center gap-2 rounded-sm bg-danger-soft px-4 py-3 text-sm font-semibold text-danger">
              <AlertCircle className="h-4 w-4" /> {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-3">
            <Button to="/admin/apartments" variant="outline" type="button" disabled={saving}>
              {t('admin.form.cancel')}
            </Button>
            <Button type="submit" disabled={saving}>
              <Save className="h-4 w-4" /> {saving ? t('admin.form.saving') : t('admin.form.save')}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
