/**
 * Types that reflect the backend data model.
 * The backend uses snake_case fields and relational tables for cities, districts,
 * amenities and media. These types are used throughout the new frontend after the migration.
 */

export type ApartmentStatus = 'published' | 'draft';

export interface City {
  id: string;
  name_vi: string;
  name_en?: string;
}

export interface District {
  id: string;
  name_vi: string;
  name_en?: string;
  city_id: string;
}

export interface Amenity {
  id: string;
  name_vi: string;
  name_en?: string;
  icon_name: string;
}

export interface ApartmentMedia {
  id: string;
  storage_path: string;
  media_type: string;
  is_cover: boolean;
}

export interface ApartmentAmenity {
  id: string;
  amenities: Amenity;
}

export interface Apartment {
  id: string;
  slug: string;
  code: string;
  title_vi: string;
  title_en?: string;
  description_vi: string;
  description_en?: string;
  rent_price: number;
  electricity_price: number;
  water_price: number;
  parking_fee: number;
  management_fee: number;
  city_id: string;
  district_id: string;
  address: string;
  latitude: string;
  longitude: string;
  contact_phone: string;
  contact_zalo: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  apartment_type: string;
  published: boolean;
  featured: boolean;
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
  // relational data (joined via supabase select)
  cities?: City;
  districts?: District;
  apartment_media?: ApartmentMedia[];
  apartment_amenities?: ApartmentAmenity[];
  // Compatibility properties for customer UI pages
  title: string;
  description: string;
  rent: number;
  currency: string;
  city: string;
  district: string;
  type: string;
  status: string;
  amenities: string[];
  images: string[];
}

export type ApartmentInput = Omit<Apartment, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>;

export interface ApartmentFilters {
  search: string;
  city_id: string;
  district_id: string;
  type: string;
  min_price: number | '';
  max_price: number | '';
  bedrooms: string;
  // Compatibility properties
  city: string;
  minPrice: number | '';
  maxPrice: number | '';
}

export const DEFAULT_FILTERS: ApartmentFilters = {
  search: '',
  city_id: '',
  district_id: '',
  type: '',
  min_price: '',
  max_price: '',
  bedrooms: '',
  city: '',
  minPrice: '',
  maxPrice: '',
};

// ---------------------------------------------------------------------------
// Nền tảng hiện tại chỉ phục vụ Đà Nẵng (đã sáp nhập Quảng Nam).
// ---------------------------------------------------------------------------
export const CITIES: string[] = ['Đà Nẵng'];

export const PROPERTY_TYPES: string[] = [
  'serviced',
  'apartment',
  'studio',
  'penthouse',
  'duplex',
];

export const ALL_AMENITIES: string[] = [];

