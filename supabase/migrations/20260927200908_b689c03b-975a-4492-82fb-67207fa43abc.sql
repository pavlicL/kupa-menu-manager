UPDATE public.seasonal_news SET image_url = '/images/kvaka-seasonal-soup.png' WHERE title = 'Početak soup season';

INSERT INTO public.menu_categories (id, name, sort_order) VALUES
 ('44444444-4444-4444-4444-444444444444', 'Lignje', 4),
 ('55555555-5555-5555-5555-555555555555', 'Jela od mesa', 5),
 ('66666666-6666-6666-6666-666666666666', 'Riba', 6),
 ('77777777-7777-7777-7777-777777777777', 'Prilozi', 7),
 ('88888888-8888-8888-8888-888888888888', 'Salate', 8),
 ('99999999-9999-9999-9999-999999999999', 'Umaci', 9),
 ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Deserti', 10);

INSERT INTO public.menu_items (category_id, name, unit, price, description, sort_order) VALUES
 ('44444444-4444-4444-4444-444444444444', 'Lignje sa žara', 'por.', 17.00, 'Uz blitvu i krumpir', 1),
 ('44444444-4444-4444-4444-444444444444', 'Pohane lignje', 'por.', 17.00, 'Uz lađice od krumpira i tartarom', 2),
 ('44444444-4444-4444-4444-444444444444', 'Pržene lignje', 'por.', 17.00, 'Uz lađice od krumpira i tartarom', 3),
 ('44444444-4444-4444-4444-444444444444', 'Punjene lignje', 'por.', 17.00, 'Pršut, sir uz blitvu i krumpir', 4),
 ('44444444-4444-4444-4444-444444444444', 'Lignje po odabiru', 'por.', 14.00, 'Bez priloga', 5),

 ('55555555-5555-5555-5555-555555555555', 'Gulaš od divljači', 'por.', 16.00, 'Uz okruglice od kruha', 1),
 ('55555555-5555-5555-5555-555555555555', 'Biftek u demi glace umaku', 'por.', 33.00, 'S pečenim krumpirom', 2),
 ('55555555-5555-5555-5555-555555555555', 'Medaljoni lungića', 'por.', 16.00, 'U umaku od vrganja s fužima', 3),
 ('55555555-5555-5555-5555-555555555555', 'Punjena svinjska vješalica', 'por.', 16.00, 'U panceti s pečenim krumpirom', 4),
 ('55555555-5555-5555-5555-555555555555', 'Svinjski ražnjići punjeni pancetom i kaduljom', 'por.', 16.00, 'Uz lađice od krumpira i umakom od kapara', 5),
 ('55555555-5555-5555-5555-555555555555', 'Zagrebački odrezak', 'por.', 15.00, 'S pekarskim krumpirom i tartarom', 6),
 ('55555555-5555-5555-5555-555555555555', 'Gurmanska pljeskavica', 'por.', 16.00, 'S pečenim krumpirom, luk i ajvar', 7),
 ('55555555-5555-5555-5555-555555555555', 'Ćevapi', 'por.', 15.00, 'S lađicama od krumpira, luk i ajvar', 8),
 ('55555555-5555-5555-5555-555555555555', 'Miješano meso', 'por.', 20.00, 'Ćevapi, pileći ražnjić umotan u pancetu, gurmanska kobasica, pljeskavica s pekarskim krumpirom, luk i ajvar', 9),
 ('55555555-5555-5555-5555-555555555555', 'Pileći bečki odrezak', 'por.', 14.00, 'S lađicama od krumpira i tartarom', 10),
 ('55555555-5555-5555-5555-555555555555', 'Pileći pohanci', 'por.', 8.00, 'Za djecu. Lađice od krumpira, ketchup', 11),
 ('55555555-5555-5555-5555-555555555555', 'Plata Kvaka za dvije osobe', 'por.', 40.00, 'Ćevapi, lungić medaljoni, pileći ražnjići, pileći file u panko mrvicama, gurmanska kobasica, batat, pekarski krumpir, ajvar, luk, tartar, sezonska salata i kruh', 12),
 ('55555555-5555-5555-5555-555555555555', 'Rolana teletina s pire krumpirom', 'por.', 20.00, 'Upitati konobara. Umak od pečenja', 13),

 ('66666666-6666-6666-6666-666666666666', 'Bijela riba', 'por.', 20.00, 'Cca. 300–350 g. Orada ili brancin, blitva i krumpir uz umak od češnjaka', 1),
 ('66666666-6666-6666-6666-666666666666', 'Pastrva na žaru', 'por.', 16.00, 'Uz blitvu i krumpir', 2),
 ('66666666-6666-6666-6666-666666666666', 'File smuđa u panko mrvicama', 'por.', 25.00, 'Uz lađice od krumpira i tartar', 3),
 ('66666666-6666-6666-6666-666666666666', 'File smuđa na žaru', 'por.', 25.00, 'Uz blitvu i krumpir', 4),
 ('66666666-6666-6666-6666-666666666666', 'Otkošteni fiš paprikaš', 'por.', 15.00, 'Smuđ i som uz pappardelle', 5),

 ('77777777-7777-7777-7777-777777777777', 'Lađice od krumpira', 'por.', 3.00, NULL, 1),
 ('77777777-7777-7777-7777-777777777777', 'Pekarski krumpir', 'por.', 4.00, NULL, 2),
 ('77777777-7777-7777-7777-777777777777', 'Batat', 'por.', 4.50, NULL, 3),
 ('77777777-7777-7777-7777-777777777777', 'Slani krumpir', 'por.', 3.00, NULL, 4),
 ('77777777-7777-7777-7777-777777777777', 'Povrće na žaru', 'por.', 5.00, NULL, 5),
 ('77777777-7777-7777-7777-777777777777', 'Blitva', 'por.', 3.50, NULL, 6),
 ('77777777-7777-7777-7777-777777777777', 'Blitva s krumpirom', 'por.', 4.50, NULL, 7),
 ('77777777-7777-7777-7777-777777777777', 'Parmezan', 'por.', 1.60, NULL, 8),
 ('77777777-7777-7777-7777-777777777777', 'Kruh', 'por.', 1.00, NULL, 9),
 ('77777777-7777-7777-7777-777777777777', 'Kajmak', 'por.', 2.50, NULL, 10),

 ('88888888-8888-8888-8888-888888888888', 'Sezonske salate', 'por.', 4.00, NULL, 1),
 ('88888888-8888-8888-8888-888888888888', 'Šopska salata', 'por.', 5.00, NULL, 2),
 ('88888888-8888-8888-8888-888888888888', 'Pečena paprika', 'por.', 5.00, NULL, 3),

 ('99999999-9999-9999-9999-999999999999', 'Senf', 'por.', 1.60, NULL, 1),
 ('99999999-9999-9999-9999-999999999999', 'Tartar', 'por.', 1.60, NULL, 2),
 ('99999999-9999-9999-9999-999999999999', 'Ajvar', 'por.', 1.60, NULL, 3),
 ('99999999-9999-9999-9999-999999999999', 'Ketchup', 'por.', 1.60, NULL, 4),
 ('99999999-9999-9999-9999-999999999999', 'Majoneza', 'por.', 1.60, NULL, 5),
 ('99999999-9999-9999-9999-999999999999', 'Kajmak', 'por.', 2.50, NULL, 6),

 ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Lava cake', 'por.', 6.00, 'Na podlozi od ukuhanog šumskog voća, domaći sladoled od burbon vanilije, prah pistacija', 1),
 ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Domaće štrudle', 'por.', 6.00, 'Razni okusi', 2),
 ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Cheesecake', 'por.', 4.00, NULL, 3),
 ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Američke palačinke', 'por.', 6.00, 'S čokoladom, javorovim sirupom i oreo keksima', 4),
 ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Crumble', 'por.', 7.00, 'Orašasti plodovi, kruška uz domaći sladoled od burbon vanilije preliven karamelom', 5),
 ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Dnevna torta', 'por.', 4.00, 'Upitati konobara', 6);