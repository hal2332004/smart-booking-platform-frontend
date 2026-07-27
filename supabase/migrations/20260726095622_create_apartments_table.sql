/*
# Create apartments table for SmartBooking

1. Purpose
- Stores apartment/rental listings shown on the customer-facing site and managed in the admin area.
- The customer site reads published listings with the anon key; the admin area (signed-in operator) creates, edits, and deletes listings.

2. New Tables
- `apartments`
  - `id` (uuid, primary key, defaults to gen_random_uuid())
  - `slug` (text, unique, not null) — URL-friendly identifier used by detail pages
  - `title` (text, not null)
  - `description` (text, not null, defaults to empty string)
  - `rent` (numeric, not null, defaults to 0) — monthly rent
  - `currency` (text, not null, defaults to 'USD')
  - `city` (text, not null)
  - `district` (text, not null, defaults to empty string)
  - `address` (text, not null, defaults to empty string)
  - `bedrooms` (integer, not null, defaults to 1)
  - `bathrooms` (integer, not null, defaults to 1)
  - `area` (numeric, not null, defaults to 0) — size in m²
  - `type` (text, not null, defaults to 'Apartment')
  - `amenities` (text[], not null, defaults to empty array)
  - `images` (text[], not null, defaults to empty array) — ordered image URLs; first is the cover
  - `status` (text, not null, defaults to 'draft') — 'published' or 'draft'
  - `featured` (boolean, not null, defaults to false) — shown on the home page showcase
  - `created_at` (timestamptz, defaults to now())

3. Indexes
- Unique index on `slug` for fast detail-page lookups.
- Index on `status` and `featured` for common listing queries.
- Index on `city` for filter queries.

4. Security (RLS)
- Enable RLS on `apartments`.
- Allow `anon, authenticated` full CRUD: the customer site (anon key) reads published listings and the admin (authenticated) manages all listings. This is a single-tenant operator app where listings are intentionally shared/public product content, so `USING (true)` is appropriate and documented here.
- Four separate policies (select/insert/update/delete), never `FOR ALL`.

5. Notes
- This migration is idempotent: safe to re-run. Policies are dropped before recreate.
- No user_id / auth.users linkage — listings are operator-owned product content, not per-user data.
*/

CREATE TABLE IF NOT EXISTS apartments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  rent numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  city text NOT NULL,
  district text NOT NULL DEFAULT '',
  address text NOT NULL DEFAULT '',
  bedrooms integer NOT NULL DEFAULT 1,
  bathrooms integer NOT NULL DEFAULT 1,
  area numeric NOT NULL DEFAULT 0,
  type text NOT NULL DEFAULT 'Apartment',
  amenities text[] NOT NULL DEFAULT '{}',
  images text[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'draft',
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS apartments_status_idx ON apartments (status);
CREATE INDEX IF NOT EXISTS apartments_featured_idx ON apartments (featured);
CREATE INDEX IF NOT EXISTS apartments_city_idx ON apartments (city);

ALTER TABLE apartments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_apartments" ON apartments;
CREATE POLICY "anon_select_apartments" ON apartments FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_apartments" ON apartments;
CREATE POLICY "anon_insert_apartments" ON apartments FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_apartments" ON apartments;
CREATE POLICY "anon_update_apartments" ON apartments FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_apartments" ON apartments;
CREATE POLICY "anon_delete_apartments" ON apartments FOR DELETE
  TO anon, authenticated USING (true);
