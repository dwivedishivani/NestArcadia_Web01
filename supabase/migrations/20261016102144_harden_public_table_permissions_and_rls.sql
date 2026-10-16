BEGIN;

DROP POLICY IF EXISTS "Allow service role full access to blogs" ON public.blogs_078be9eb;
DROP POLICY IF EXISTS "Allow service role full access to homes" ON public.homes_078be9eb;
DROP POLICY IF EXISTS "Allow service role full access to enquiries" ON public.enquiries_078be9eb;
DROP POLICY IF EXISTS "Public can read published blogs" ON public.blogs_078be9eb;
DROP POLICY IF EXISTS "Public can read published homes" ON public.homes_078be9eb;
DROP POLICY IF EXISTS "Public can submit enquiries" ON public.enquiries_078be9eb;
DROP POLICY IF EXISTS "Public can read site image assets" ON public.site_image_assets;
DROP POLICY IF EXISTS "Public can read site image slots" ON public.site_image_slots;

CREATE POLICY "Allow service role full access to blogs"
  ON public.blogs_078be9eb FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "Allow service role full access to homes"
  ON public.homes_078be9eb FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "Allow service role full access to enquiries"
  ON public.enquiries_078be9eb FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "Public can read published blogs"
  ON public.blogs_078be9eb FOR SELECT TO anon, authenticated
  USING (status = 'published' AND published_at IS NOT NULL AND published_at <= now());

CREATE POLICY "Public can read published homes"
  ON public.homes_078be9eb FOR SELECT TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "Public can submit enquiries"
  ON public.enquiries_078be9eb FOR INSERT TO anon
  WITH CHECK (
    id IS NOT NULL
    AND name IS NOT NULL AND length(btrim(name)) BETWEEN 2 AND 120
    AND email IS NOT NULL AND length(btrim(email)) BETWEEN 3 AND 254
    AND phone IS NOT NULL AND length(regexp_replace(phone, '[^0-9]', '', 'g')) BETWEEN 5 AND 15
    AND city IS NOT NULL AND length(btrim(city)) BETWEEN 1 AND 120
    AND project_type IS NOT NULL AND length(btrim(project_type)) BETWEEN 1 AND 120
    AND budget IS NOT NULL AND length(btrim(budget)) BETWEEN 1 AND 120
    AND timeline IS NOT NULL AND length(btrim(timeline)) BETWEEN 1 AND 120
    AND design_style IS NOT NULL AND length(btrim(design_style)) BETWEEN 1 AND 120
    AND (configuration IS NULL OR length(configuration) <= 120)
    AND (message IS NULL OR length(message) <= 5000)
    AND (source IS NULL OR length(source) <= 200)
    AND status = 'new'
    AND notes IS NULL
  );

REVOKE ALL PRIVILEGES ON TABLE public.blogs_078be9eb FROM anon, authenticated;
GRANT SELECT ON TABLE public.blogs_078be9eb TO anon, authenticated;

REVOKE ALL PRIVILEGES ON TABLE public.homes_078be9eb FROM anon, authenticated;
GRANT SELECT ON TABLE public.homes_078be9eb TO anon, authenticated;

REVOKE ALL PRIVILEGES ON TABLE public.enquiries_078be9eb FROM anon, authenticated;
GRANT INSERT ON TABLE public.enquiries_078be9eb TO anon;

REVOKE ALL PRIVILEGES ON TABLE public.site_image_assets FROM anon, authenticated;
REVOKE ALL PRIVILEGES ON TABLE public.site_image_slots FROM anon, authenticated;

COMMIT;