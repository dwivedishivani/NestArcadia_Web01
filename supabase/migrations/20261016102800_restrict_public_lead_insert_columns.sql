BEGIN;
REVOKE INSERT ON TABLE public.enquiries_078be9eb FROM anon, authenticated;
REVOKE INSERT (id, name, email, phone, city, project_type, configuration, budget, timeline, design_style, message, source, status, notes, created_at, updated_at)
  ON TABLE public.enquiries_078be9eb FROM anon, authenticated;
GRANT INSERT (id, name, email, phone, city, project_type, configuration, budget, timeline, design_style, message, source)
  ON TABLE public.enquiries_078be9eb TO anon;
COMMIT;