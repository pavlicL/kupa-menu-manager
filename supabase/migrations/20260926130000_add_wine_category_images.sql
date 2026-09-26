ALTER TABLE public.wine_categories ADD COLUMN image_url text;

UPDATE public.wine_categories SET image_url = '/__l5e/assets-v1/536a9237-59d2-409a-a629-79c5d2ed2dfd/kast-wines.png'
WHERE id = 'aaaaaaaa-0000-4000-8000-000000000002';
