CREATE SCHEMA IF NOT EXISTS private;
GRANT USAGE ON SCHEMA private TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;
REVOKE EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO anon, authenticated, service_role;

DROP POLICY "Public can view visible categories" ON public.menu_categories;
DROP POLICY "Admins manage categories" ON public.menu_categories;
DROP POLICY "Public can view visible items" ON public.menu_items;
DROP POLICY "Admins manage items" ON public.menu_items;

CREATE POLICY "Public can view visible categories" ON public.menu_categories FOR SELECT TO anon, authenticated USING (is_visible OR private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage categories" ON public.menu_categories FOR ALL TO authenticated USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Public can view visible items" ON public.menu_items FOR SELECT TO anon, authenticated USING (is_visible OR private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage items" ON public.menu_items FOR ALL TO authenticated USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));

DROP FUNCTION public.has_role(uuid, public.app_role);