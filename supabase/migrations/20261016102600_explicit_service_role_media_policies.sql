BEGIN;
DROP POLICY IF EXISTS "Service role manages site image assets" ON public.site_image_assets;
CREATE POLICY "Service role manages site image assets"
  ON public.site_image_assets FOR ALL TO service_role
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role manages site image slots" ON public.site_image_slots;
CREATE POLICY "Service role manages site image slots"
  ON public.site_image_slots FOR ALL TO service_role
  USING (true) WITH CHECK (true);
COMMIT;