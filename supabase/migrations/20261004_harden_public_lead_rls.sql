-- Harden public data access while preserving the existing service-role backend.
-- This migration intentionally does not drop indexes or change user_profiles role controls.

BEGIN;

-- The old policies were named for service-role access but were granted to
-- public, which made them broader than intended. Scope them to service_role.
DROP POLICY IF EXISTS "Allow service role full access to blogs" ON public.blogs_078be9eb;
CREATE POLICY "Allow service role full access to blogs"
  ON public.blogs_078be9eb
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow service role full access to homes" ON public.homes_078be9eb;
CREATE POLICY "Allow service role full access to homes"
  ON public.homes_078be9eb
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow service role full access to enquiries" ON public.enquiries_078be9eb;
CREATE POLICY "Allow service role full access to enquiries"
  ON public.enquiries_078be9eb
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Public lead capture needs INSERT only. Keep the policy constrained so the
-- browser cannot write arbitrary records or admin fields.
DROP POLICY IF EXISTS "Public can submit enquiries" ON public.enquiries_078be9eb;
CREATE POLICY "Public can submit enquiries"
  ON public.enquiries_078be9eb
  FOR INSERT
  TO anon
  WITH CHECK (
    name IS NOT NULL
    AND length(btrim(name)) BETWEEN 2 AND 120
    AND email IS NOT NULL
    AND length(btrim(email)) BETWEEN 3 AND 254
    AND phone IS NOT NULL
    AND length(btrim(phone)) BETWEEN 5 AND 40
    AND regexp_replace(phone, '[^0-9]', '', 'g') ~ '^[6-9][0-9]{9}
    AND city IS NOT NULL
    AND length(btrim(city)) BETWEEN 1 AND 120
    AND project_type IS NOT NULL
    AND length(btrim(project_type)) BETWEEN 1 AND 120
    AND budget IS NOT NULL
    AND length(btrim(budget)) BETWEEN 1 AND 120
    AND timeline IS NOT NULL
    AND length(btrim(timeline)) BETWEEN 1 AND 120
    AND design_style IS NOT NULL
    AND length(btrim(design_style)) BETWEEN 1 AND 120
    AND (configuration IS NULL OR length(configuration) <= 120)
    AND (message IS NULL OR length(message) <= 5000)
    AND (source IS NULL OR length(source) <= 200)
    AND status = 'new'
    AND notes IS NULL
  );

-- The browser only needs to INSERT into this lead table. Other operations
-- remain blocked by RLS because there are no anon SELECT/UPDATE/DELETE policies.
REVOKE SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER
  ON public.enquiries_078be9eb FROM anon;

COMMIT;

    AND city IS NOT NULL
    AND length(btrim(city)) BETWEEN 1 AND 120
    AND project_type IS NOT NULL
    AND length(btrim(project_type)) BETWEEN 1 AND 120
    AND budget IS NOT NULL
    AND length(btrim(budget)) BETWEEN 1 AND 120
    AND timeline IS NOT NULL
    AND length(btrim(timeline)) BETWEEN 1 AND 120
    AND design_style IS NOT NULL
    AND length(btrim(design_style)) BETWEEN 1 AND 120
    AND (configuration IS NULL OR length(configuration) <= 120)
    AND (message IS NULL OR length(message) <= 5000)
    AND (source IS NULL OR length(source) <= 200)
    AND status = 'new'
    AND notes IS NULL
  );

-- The browser only needs to INSERT into this lead table. Other operations
-- remain blocked by RLS because there are no anon SELECT/UPDATE/DELETE policies.
REVOKE SELECT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER
  ON public.enquiries_078be9eb FROM anon;

COMMIT;
