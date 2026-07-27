import { supabase } from './supabase';
import api from './api';
import type { Apartment, ApartmentInput } from './types';

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function mapApartmentCompat(a: any): Apartment {
  if (!a) return a;
  return {
    ...a,
    title: a.title || a.title_vi || '',
    description: a.description || a.description_vi || '',
    rent: a.rent !== undefined ? a.rent : (a.rent_price || 0),
    currency: a.currency || 'VND',
    city: a.city || a.cities?.name_vi || '',
    district: a.district || a.districts?.name_vi || '',
    type: a.type || a.apartment_type || '',
    status: a.published ? 'published' : 'draft',
    images: a.images || a.apartment_media?.map((m: any) => m.storage_path) || [],
    amenities: a.amenities || a.apartment_amenities?.map((am: any) => am.amenities?.name_vi || '') || [],
  };
}

export async function fetchApartments(params = {}): Promise<Apartment[]> {
  const response = await api.get('/apartments/admin/all', { params });
  return ((response.data?.data ?? []) as any[]).map(mapApartmentCompat);
}

export async function fetchPublishedApartments(params = {}): Promise<Apartment[]> {
  const response = await api.get('/apartments', { params });
  return ((response.data?.data ?? []) as any[]).map(mapApartmentCompat);
}

export async function fetchFeaturedApartments(): Promise<Apartment[]> {
  const response = await api.get('/apartments', { params: { limit: 50 } });
  const list = ((response.data?.data ?? []) as any[]).map(mapApartmentCompat);
  return list.filter((a) => a.featured).slice(0, 6);
}

export async function fetchApartmentBySlug(slug: string): Promise<Apartment | null> {
  const response = await api.get(`/apartments/${slug}`);
  return mapApartmentCompat(response.data ?? null);
}

export async function fetchApartmentById(id: string): Promise<Apartment | null> {
  // Fetch apartment with related media and amenities directly from Supabase
  // matching EditApartment.jsx:73
  const { data, error } = await supabase
    .from('apartments')
    .select(`*, apartment_media (*), apartment_amenities (*)`)
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return mapApartmentCompat(data);
}

export async function createApartment(input: ApartmentInput): Promise<Apartment> {
  const payload = { ...input, slug: input.slug || slugify(input.title_vi) };
  const response = await api.post('/apartments', payload);
  return mapApartmentCompat(response.data);
}

export async function updateApartment(id: string, input: ApartmentInput): Promise<Apartment> {
  const payload = { ...input, slug: input.slug || slugify(input.title_vi) };
  const response = await api.put(`/apartments/${id}`, payload);
  return mapApartmentCompat(response.data);
}

export async function deleteApartment(id: string): Promise<void> {
  await api.delete(`/apartments/${id}`);
}

export function makeSlug(value: string): string {
  return slugify(value);
}
