CREATE TABLE public.wine_categories (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL, sort_order integer NOT NULL DEFAULT 0, is_visible boolean NOT NULL DEFAULT true,
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.wine_categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.wine_categories TO authenticated;
GRANT ALL ON public.wine_categories TO service_role;
ALTER TABLE public.wine_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads visible wine categories" ON public.wine_categories FOR SELECT TO anon, authenticated USING (is_visible OR private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage wine categories" ON public.wine_categories FOR ALL TO authenticated USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE TRIGGER wine_categories_updated_at BEFORE UPDATE ON public.wine_categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.wines (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), category_id uuid NOT NULL REFERENCES public.wine_categories(id) ON DELETE CASCADE,
 name text NOT NULL, bottle_size text NOT NULL, bottle_price numeric(10,2) NOT NULL CHECK (bottle_price >= 0), glass_size text, glass_price numeric(10,2) CHECK (glass_price >= 0),
 sort_order integer NOT NULL DEFAULT 0, is_visible boolean NOT NULL DEFAULT true,
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.wines TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.wines TO authenticated;
GRANT ALL ON public.wines TO service_role;
ALTER TABLE public.wines ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads visible wines" ON public.wines FOR SELECT TO anon, authenticated USING (is_visible OR private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage wines" ON public.wines FOR ALL TO authenticated USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE TRIGGER wines_updated_at BEFORE UPDATE ON public.wines FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.seasonal_news (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), title text NOT NULL, body text, image_url text,
 sort_order integer NOT NULL DEFAULT 0, is_visible boolean NOT NULL DEFAULT true,
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.seasonal_news TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.seasonal_news TO authenticated;
GRANT ALL ON public.seasonal_news TO service_role;
ALTER TABLE public.seasonal_news ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads visible seasonal news" ON public.seasonal_news FOR SELECT TO anon, authenticated USING (is_visible OR private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage seasonal news" ON public.seasonal_news FOR ALL TO authenticated USING (private.has_role(auth.uid(), 'admin')) WITH CHECK (private.has_role(auth.uid(), 'admin'));
CREATE TRIGGER seasonal_news_updated_at BEFORE UPDATE ON public.seasonal_news FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.wine_categories (id, name, sort_order) VALUES
 ('aaaaaaaa-0000-4000-8000-000000000001','Sortna bijela vina',1),
 ('aaaaaaaa-0000-4000-8000-000000000002','Buteljirana bijela vina',2),
 ('aaaaaaaa-0000-4000-8000-000000000003','Sortna crvena i rosé vina',3),
 ('aaaaaaaa-0000-4000-8000-000000000004','Buteljirana crvena i rosé vina',4),
 ('aaaaaaaa-0000-4000-8000-000000000005','Pjenušava vina',5),
 ('aaaaaaaa-0000-4000-8000-000000000006','Desertna vina',6);

INSERT INTO public.wines (category_id,name,bottle_size,bottle_price,glass_size,glass_price,sort_order) VALUES
 ('aaaaaaaa-0000-4000-8000-000000000001','Šoštar Chardonnay','1,00 l',18,'0,10 l',1.80,1),
 ('aaaaaaaa-0000-4000-8000-000000000001','Šoštar Rajski rizling','1,00 l',18,'0,10 l',1.80,2),
 ('aaaaaaaa-0000-4000-8000-000000000001','Iločki podrumi Graševina','1,00 l',20,'0,10 l',2,3),
 ('aaaaaaaa-0000-4000-8000-000000000001','Lešćanec Graševina','1,00 l',17,'0,10 l',1.70,4),
 ('aaaaaaaa-0000-4000-8000-000000000001','Đakovo Talijanski rizling','1,00 l',20,'0,10 l',2,5),
 ('aaaaaaaa-0000-4000-8000-000000000001','Šoštar Traminac','1,00 l',18,'0,10 l',1.80,6),
 ('aaaaaaaa-0000-4000-8000-000000000001','Irius Muškat','0,75 l',25,'0,10 l',3.60,7),
 ('aaaaaaaa-0000-4000-8000-000000000001','Terra Unica Malvazija','1,00 l',20,'0,10 l',2.90,8),
 ('aaaaaaaa-0000-4000-8000-000000000002','Kozlović Malvazija','0,75 l',35,NULL,NULL,1),
 ('aaaaaaaa-0000-4000-8000-000000000002','Matošević Malvazija','0,75 l',30,NULL,NULL,2),
 ('aaaaaaaa-0000-4000-8000-000000000002','Meneghetti Dubrovačka malvazija','0,75 l',39,NULL,NULL,3),
 ('aaaaaaaa-0000-4000-8000-000000000002','Krauthaker Sivi pinot','0,75 l',30,NULL,NULL,4),
 ('aaaaaaaa-0000-4000-8000-000000000002','Korak Sauvignon','0,75 l',30,NULL,NULL,5),
 ('aaaaaaaa-0000-4000-8000-000000000002','Irius Sauvignon','0,75 l',25,NULL,NULL,6),
 ('aaaaaaaa-0000-4000-8000-000000000002','Meneghetti Chardonnay','0,75 l',27,NULL,NULL,7),
 ('aaaaaaaa-0000-4000-8000-000000000002','Čara Pošip','0,75 l',30,NULL,NULL,8),
 ('aaaaaaaa-0000-4000-8000-000000000002','Enjingi Traminac','0,75 l',30,NULL,NULL,9),
 ('aaaaaaaa-0000-4000-8000-000000000002','Bolfan Muškat','0,75 l',25,NULL,NULL,10),
 ('aaaaaaaa-0000-4000-8000-000000000002','Matuško Grk','0,75 l',39,NULL,NULL,11),
 ('aaaaaaaa-0000-4000-8000-000000000002','KAST Graševina','0,75 l',30,NULL,NULL,12),
 ('aaaaaaaa-0000-4000-8000-000000000002','KAST Traminac','0,75 l',30,NULL,NULL,13),
 ('aaaaaaaa-0000-4000-8000-000000000002','KAST Chardonnay','0,75 l',30,NULL,NULL,14),
 ('aaaaaaaa-0000-4000-8000-000000000003','Šoštar Frankovka','1,00 l',18,'0,10 l',1.80,1),
 ('aaaaaaaa-0000-4000-8000-000000000003','Plenković Plavac mali','1,00 l',20,'0,10 l',2.50,2),
 ('aaaaaaaa-0000-4000-8000-000000000003','Tikveš Vitač','1,00 l',20,'0,10 l',2.50,3),
 ('aaaaaaaa-0000-4000-8000-000000000003','Terra Unica Merlot','1,00 l',20,'0,10 l',2.50,4),
 ('aaaaaaaa-0000-4000-8000-000000000003','Royal Hill Rosé','0,75 l',20,'0,10 l',2.50,5),
 ('aaaaaaaa-0000-4000-8000-000000000004','Petrač Karizma','0,75 l',34,NULL,NULL,1),
 ('aaaaaaaa-0000-4000-8000-000000000004','Kozlović Teran','0,75 l',31,NULL,NULL,2),
 ('aaaaaaaa-0000-4000-8000-000000000004','Zdjelarević Cabernet Sauvignon','0,75 l',30,NULL,NULL,3),
 ('aaaaaaaa-0000-4000-8000-000000000004','Plenković Plavac mali','0,75 l',30,NULL,NULL,4),
 ('aaaaaaaa-0000-4000-8000-000000000004','Stina Plavac mali Majstor','0,75 l',50,NULL,NULL,5),
 ('aaaaaaaa-0000-4000-8000-000000000004','Donja Banda Pošip','0,75 l',28,NULL,NULL,6),
 ('aaaaaaaa-0000-4000-8000-000000000004','Meneghetti Merlot','0,75 l',30,NULL,NULL,7),
 ('aaaaaaaa-0000-4000-8000-000000000004','Korlat Merlot Boutique','0,75 l',39,NULL,NULL,8),
 ('aaaaaaaa-0000-4000-8000-000000000004','Korlat Syrah','0,75 l',30,NULL,NULL,9),
 ('aaaaaaaa-0000-4000-8000-000000000004','Laguna Muškat ruža','0,75 l',20,NULL,NULL,10),
 ('aaaaaaaa-0000-4000-8000-000000000004','Josić Pannonium Dea Rosé','0,75 l',25,NULL,NULL,11),
 ('aaaaaaaa-0000-4000-8000-000000000004','KAST Frankovka','0,75 l',30,NULL,NULL,12),
 ('aaaaaaaa-0000-4000-8000-000000000005','Bolfan Centurion','0,75 l',30,NULL,NULL,1),
 ('aaaaaaaa-0000-4000-8000-000000000005','Moët & Chandon','0,75 l',100,NULL,NULL,2),
 ('aaaaaaaa-0000-4000-8000-000000000005','Astoria DOCG','0,75 l',25,NULL,NULL,3),
 ('aaaaaaaa-0000-4000-8000-000000000005','Freixenet','0,20 l',8,NULL,NULL,4),
 ('aaaaaaaa-0000-4000-8000-000000000005','Chandon Garden Spritz','0,187 l',12,NULL,NULL,5),
 ('aaaaaaaa-0000-4000-8000-000000000005','Almare Hugo','0,75 l',20,NULL,NULL,6),
 ('aaaaaaaa-0000-4000-8000-000000000005','Astoria DOCG','0,10 l',3.60,NULL,NULL,7),
 ('aaaaaaaa-0000-4000-8000-000000000006','Prošek','0,10 l',2.70,NULL,NULL,1),
 ('aaaaaaaa-0000-4000-8000-000000000006','Martini Bianco','0,10 l',3.40,NULL,NULL,2);
INSERT INTO public.seasonal_news (title,body,image_url,sort_order) VALUES ('Početak soup season','Sezona juha je počela. Uživajte u toploj zdjelici uz Kupu.','/__l5e/assets-v1/90a6e968-9edc-482d-bf2a-654461f290f6/kvaka-seasonal-soup.png',1);