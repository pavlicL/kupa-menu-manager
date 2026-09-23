CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE TABLE public.menu_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.menu_categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.menu_categories TO authenticated;
GRANT ALL ON public.menu_categories TO service_role;
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view visible categories" ON public.menu_categories FOR SELECT TO anon, authenticated USING (is_visible OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage categories" ON public.menu_categories FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES public.menu_categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  unit text NOT NULL DEFAULT 'por.',
  price numeric(10,2) NOT NULL DEFAULT 0,
  description text,
  sort_order integer NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.menu_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.menu_items TO authenticated;
GRANT ALL ON public.menu_items TO service_role;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view visible items" ON public.menu_items FOR SELECT TO anon, authenticated USING (is_visible OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage items" ON public.menu_items FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.update_updated_at_column() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER menu_items_updated_at BEFORE UPDATE ON public.menu_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.menu_categories (id, name, sort_order) VALUES
 ('11111111-1111-1111-1111-111111111111', 'Predjela', 1),
 ('22222222-2222-2222-2222-222222222222', 'Juhe', 2),
 ('33333333-3333-3333-3333-333333333333', 'Tjestenine i rižota', 3);

INSERT INTO public.menu_items (category_id, name, unit, price, description, sort_order) VALUES
 ('11111111-1111-1111-1111-111111111111', 'Platica', 'por.', 16.00, 'Drniški pršut, ovčji sir s chutney od buče i muštradom, kruh', 1),
 ('11111111-1111-1111-1111-111111111111', 'Žabe pržene', 'kg', 40.00, NULL, 2),
 ('11111111-1111-1111-1111-111111111111', 'Pohani sir', 'por.', 9.00, 'Salata, cherry rajčica, tartar', 3),
 ('11111111-1111-1111-1111-111111111111', 'Mazalice', 'por.', 10.00, '100% juneće mljeveno meso, kruh', 4),
 ('11111111-1111-1111-1111-111111111111', 'Gurmanske mazalice', 'por.', 11.00, '100% juneće mljeveno meso, sir, panceta, tucana paprika, kruh', 5),
 ('22222222-2222-2222-2222-222222222222', 'Goveđa juha', 'por.', 4.00, 'Domaći rezanci', 1),
 ('22222222-2222-2222-2222-222222222222', 'Juha od vrganja', 'por.', 5.00, NULL, 2),
 ('22222222-2222-2222-2222-222222222222', 'Dnevna juha', 'por.', 5.00, 'Upitati konobara', 3),
 ('33333333-3333-3333-3333-333333333333', 'Šurlice s dimljenim lososom', 'por.', 17.00, 'Listići badema i rikola', 1),
 ('33333333-3333-3333-3333-333333333333', 'Fuži s listićima bifteka', 'por.', 18.00, 'U dami glace umaku s sušenim rajčicama, rikola, grana padano', 2),
 ('33333333-3333-3333-3333-333333333333', 'Domaći njoki s pršutom', 'por.', 15.00, 'Kadulja uz čips od pancete, listići grana padana', 3),
 ('33333333-3333-3333-3333-333333333333', 'Rižoto od vrganja i lungića', 'por.', 14.00, 'Čips od pancete', 4),
 ('33333333-3333-3333-3333-333333333333', 'Rižoto od lignji', 'por.', 18.00, 'Grana padano', 5);