-- Sexta tanda de la base (1.25): recetas, parte 7 de 8. Después de seed-8-alimentos.sql. Se puede correr de nuevo: agrega solo lo que falta. Generado con scripts/gen-seed.mjs

insert into public.recipes (slug, name, minutes, servings, meal_types, portable, steps) values
  ('bowl-de-quinoa-garbanzos-y-kale-mango-y-cebolla-morada', 'Bowl de quinoa, garbanzos y kale, mango y cebolla morada', 20, 1, '{almuerzo,cena}', true, 'Enjuagás la quinoa, la hervís 12 minutos en el doble de agua y la desgranás con un tenedor.
Dorás los garbanzos escurridos en sartén con el aceite, comino y pimentón, 5 minutos, hasta que estén crocantes por fuera.
Masajeás el kale con una pizca de sal y aceite 1 minuto, cortás el mango en cubos y la cebolla en aros.
Aderezás con el pesto, aflojado con una cucharada de agua tibia.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-quinoa-pollo-y-kale-mango-y-cebolla-morada', 'Bowl de quinoa, pollo y kale, mango y cebolla morada', 24, 1, '{almuerzo,cena}', true, 'Enjuagás la quinoa, la hervís 12 minutos en el doble de agua y la desgranás con un tenedor.
Cocinás la pechuga en plancha con sal y pimienta, 5 minutos por lado, y la cortás en tiras.
Masajeás el kale con una pizca de sal y aceite 1 minuto, cortás el mango en cubos y la cebolla en aros.
Mezclás el yogur con la menta picada, el limón y sal.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-burgol-langostinos-y-palta-pepino-y-zanahoria', 'Bowl de burgol, langostinos y palta, pepino y zanahoria', 20, 1, '{almuerzo,cena}', true, 'Hidratás el burgol con agua caliente (1 a 1,5), lo tapás 15 minutos y lo desgranás.
Salteás los langostinos pelados con el ajo y el aceite 2 minutos por lado.
Cortás la palta y el pepino en láminas; rallás la zanahoria.
Aderezás con el pesto, aflojado con una cucharada de agua tibia.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-batata-asada-huevo-y-kale-mango-y-cebolla-morada', 'Bowl de batata asada, huevo y kale, mango y cebolla morada', 22, 1, '{almuerzo,cena}', true, 'Cortás la batata en cubos, los mezclás con el aceite y sal y los asás 25 minutos a 220 °C.
Hacés los huevos duros (9 minutos), los pelás y los cortás al medio.
Masajeás el kale con una pizca de sal y aceite 1 minuto, cortás el mango en cubos y la cebolla en aros.
Servís con una cucharada de guacamole.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-batata-asada-huevo-y-espinaca-remolacha-y', 'Bowl de batata asada, huevo y espinaca, remolacha y semillas', 22, 1, '{almuerzo,cena}', true, 'Cortás la batata en cubos, los mezclás con el aceite y sal y los asás 25 minutos a 220 °C.
Hacés los huevos duros (9 minutos), los pelás y los cortás al medio.
Lavás la espinaca, cortás la remolacha en cubos y sumás las semillas.
Aderezás con el pesto, aflojado con una cucharada de agua tibia.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-arroz-integral-salmon-y-kale-mango-y-cebolla', 'Bowl de arroz integral, salmón y kale, mango y cebolla morada', 22, 1, '{almuerzo,cena}', true, 'Hervís el arroz integral (o usás uno ya cocido) y lo dejás entibiar.
Cocinás el salmón en la plancha 4 minutos por lado con sal y limón, y lo desmenuzás en lascas.
Masajeás el kale con una pizca de sal y aceite 1 minuto, cortás el mango en cubos y la cebolla en aros.
Mezclás la soja con el jengibre rallado y el aceite de sésamo.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-burgol-lentejas-y-palta-pepino-y-zanahoria', 'Bowl de burgol, lentejas y palta, pepino y zanahoria', 15, 1, '{almuerzo,cena}', true, 'Hidratás el burgol con agua caliente (1 a 1,5), lo tapás 15 minutos y lo desgranás.
Enjuagás las lentejas hervidas y las escurrís.
Cortás la palta y el pepino en láminas; rallás la zanahoria.
Mezclás la soja con el jengibre rallado y el aceite de sésamo.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-fideos-de-arroz-salmon-y-palta-pepino-y', 'Bowl de fideos de arroz, salmón y palta, pepino y zanahoria', 22, 1, '{almuerzo,cena}', true, 'Hervís los fideos de arroz 4 minutos, los enjuagás con agua fría y los escurrís.
Cocinás el salmón en la plancha 4 minutos por lado con sal y limón, y lo desmenuzás en lascas.
Cortás la palta y el pepino en láminas; rallás la zanahoria.
Aderezás con el pesto, aflojado con una cucharada de agua tibia.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-burgol-garbanzos-y-repollo-colorado-edamame-y', 'Bowl de burgol, garbanzos y repollo colorado, edamame y zanahoria', 20, 1, '{almuerzo,cena}', true, 'Hidratás el burgol con agua caliente (1 a 1,5), lo tapás 15 minutos y lo desgranás.
Dorás los garbanzos escurridos en sartén con el aceite, comino y pimentón, 5 minutos, hasta que estén crocantes por fuera.
Cortás el repollo en tiras finísimas, hervís el edamame 4 minutos y rallás la zanahoria.
Mezclás la soja con el jengibre rallado y el aceite de sésamo.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('avena-en-frio-overnight-con-manzana-y-cacao', 'Avena en frío (overnight) con manzana y cacao', 8, 1, '{desayuno,merienda}', true, 'Mezclás la avena con el yogur, la leche y la chía en un frasco, tapás y dejás en la heladera toda la noche (mínimo 6 horas).
Cortás la manzana en cubitos (con cáscara).
Servís la avena en un bowl y sumás la fruta.
Espolvoreás el cacao amargo.'),
  ('avena-en-frio-overnight-con-arandanos-y-coco-rallado', 'Avena en frío (overnight) con arándanos y coco rallado', 8, 1, '{desayuno,merienda}', true, 'Mezclás la avena con el yogur, la leche y la chía en un frasco, tapás y dejás en la heladera toda la noche (mínimo 6 horas).
Lavás los arándanos.
Servís la avena en un bowl y sumás la fruta.
Espolvoreás el coco rallado.'),
  ('avena-en-frio-overnight-con-kiwi-y-semillas-de-girasol', 'Avena en frío (overnight) con kiwi y semillas de girasol', 8, 1, '{desayuno,merienda}', true, 'Mezclás la avena con el yogur, la leche y la chía en un frasco, tapás y dejás en la heladera toda la noche (mínimo 6 horas).
Pelás el kiwi y lo cortás en rodajas.
Servís la avena en un bowl y sumás la fruta.
Esparcís las semillas de girasol.'),
  ('avena-con-cacao-con-kiwi-y-pasas-de-uva', 'Avena con cacao con kiwi y pasas de uva', 13, 1, '{desayuno,merienda}', false, 'Cocinás la avena con la leche y el cacao a fuego bajo, revolviendo, 6 minutos.
Pelás el kiwi y lo cortás en rodajas.
Servís la avena en un bowl y sumás la fruta.
Sumás las pasas de uva.'),
  ('avena-cocida-con-frambuesas-y-almendras', 'Avena cocida con frambuesas y almendras', 13, 1, '{desayuno,merienda}', false, 'Cocinás la avena con la leche a fuego bajo, revolviendo, 6 minutos, hasta que espese.
Lavás las frambuesas con cuidado.
Servís la avena en un bowl y sumás la fruta.
Picás las almendras y las espolvoreás por encima.'),
  ('avena-con-cacao-con-manzana-y-semillas-de-girasol', 'Avena con cacao con manzana y semillas de girasol', 13, 1, '{desayuno,merienda}', false, 'Cocinás la avena con la leche y el cacao a fuego bajo, revolviendo, 6 minutos.
Cortás la manzana en cubitos (con cáscara).
Servís la avena en un bowl y sumás la fruta.
Esparcís las semillas de girasol.'),
  ('avena-con-cacao-con-arandanos-y-pasas-de-uva', 'Avena con cacao con arándanos y pasas de uva', 13, 1, '{desayuno,merienda}', false, 'Cocinás la avena con la leche y el cacao a fuego bajo, revolviendo, 6 minutos.
Lavás los arándanos.
Servís la avena en un bowl y sumás la fruta.
Sumás las pasas de uva.'),
  ('avena-con-cacao-con-pera-y-almendras', 'Avena con cacao con pera y almendras', 13, 1, '{desayuno,merienda}', false, 'Cocinás la avena con la leche y el cacao a fuego bajo, revolviendo, 6 minutos.
Cortás la pera en cubitos.
Servís la avena en un bowl y sumás la fruta.
Picás las almendras y las espolvoreás por encima.'),
  ('avena-cocida-con-durazno-y-miel', 'Avena cocida con durazno y miel', 13, 1, '{desayuno,merienda}', false, 'Cocinás la avena con la leche a fuego bajo, revolviendo, 6 minutos, hasta que espese.
Cortás el durazno en gajos.
Servís la avena en un bowl y sumás la fruta.
Terminás con un hilo de miel.'),
  ('avena-en-frio-overnight-con-manzana-y-coco-rallado', 'Avena en frío (overnight) con manzana y coco rallado', 8, 1, '{desayuno,merienda}', true, 'Mezclás la avena con el yogur, la leche y la chía en un frasco, tapás y dejás en la heladera toda la noche (mínimo 6 horas).
Cortás la manzana en cubitos (con cáscara).
Servís la avena en un bowl y sumás la fruta.
Espolvoreás el coco rallado.'),
  ('avena-cocida-con-frambuesas-y-cacao', 'Avena cocida con frambuesas y cacao', 13, 1, '{desayuno,merienda}', false, 'Cocinás la avena con la leche a fuego bajo, revolviendo, 6 minutos, hasta que espese.
Lavás las frambuesas con cuidado.
Servís la avena en un bowl y sumás la fruta.
Espolvoreás el cacao amargo.'),
  ('avena-cocida-con-manzana-y-semillas-de-girasol', 'Avena cocida con manzana y semillas de girasol', 13, 1, '{desayuno,merienda}', false, 'Cocinás la avena con la leche a fuego bajo, revolviendo, 6 minutos, hasta que espese.
Cortás la manzana en cubitos (con cáscara).
Servís la avena en un bowl y sumás la fruta.
Esparcís las semillas de girasol.'),
  ('avena-con-yogur-griego-con-durazno-y-cacao', 'Avena con yogur griego con durazno y cacao', 7, 1, '{desayuno,merienda}', false, 'Remojás la avena en la leche 3 minutos y la mezclás con el yogur griego.
Cortás el durazno en gajos.
Servís la avena en un bowl y sumás la fruta.
Espolvoreás el cacao amargo.'),
  ('avena-en-frio-overnight-con-banana-y-cacao', 'Avena en frío (overnight) con banana y cacao', 8, 1, '{desayuno,merienda}', true, 'Mezclás la avena con el yogur, la leche y la chía en un frasco, tapás y dejás en la heladera toda la noche (mínimo 6 horas).
Cortás la banana en rodajas.
Servís la avena en un bowl y sumás la fruta.
Espolvoreás el cacao amargo.'),
  ('avena-en-frio-overnight-con-pera-y-semillas-de-girasol', 'Avena en frío (overnight) con pera y semillas de girasol', 8, 1, '{desayuno,merienda}', true, 'Mezclás la avena con el yogur, la leche y la chía en un frasco, tapás y dejás en la heladera toda la noche (mínimo 6 horas).
Cortás la pera en cubitos.
Servís la avena en un bowl y sumás la fruta.
Esparcís las semillas de girasol.'),
  ('avena-cocida-con-banana-y-miel', 'Avena cocida con banana y miel', 13, 1, '{desayuno,merienda}', false, 'Cocinás la avena con la leche a fuego bajo, revolviendo, 6 minutos, hasta que espese.
Cortás la banana en rodajas.
Servís la avena en un bowl y sumás la fruta.
Terminás con un hilo de miel.'),
  ('avena-con-cacao-con-frambuesas-y-almendras', 'Avena con cacao con frambuesas y almendras', 13, 1, '{desayuno,merienda}', false, 'Cocinás la avena con la leche y el cacao a fuego bajo, revolviendo, 6 minutos.
Lavás las frambuesas con cuidado.
Servís la avena en un bowl y sumás la fruta.
Picás las almendras y las espolvoreás por encima.'),
  ('avena-en-frio-overnight-con-pera-y-miel', 'Avena en frío (overnight) con pera y miel', 8, 1, '{desayuno,merienda}', true, 'Mezclás la avena con el yogur, la leche y la chía en un frasco, tapás y dejás en la heladera toda la noche (mínimo 6 horas).
Cortás la pera en cubitos.
Servís la avena en un bowl y sumás la fruta.
Terminás con un hilo de miel.'),
  ('avena-con-yogur-griego-con-arandanos-y-pasas-de-uva', 'Avena con yogur griego con arándanos y pasas de uva', 7, 1, '{desayuno,merienda}', false, 'Remojás la avena en la leche 3 minutos y la mezclás con el yogur griego.
Lavás los arándanos.
Servís la avena en un bowl y sumás la fruta.
Sumás las pasas de uva.'),
  ('avena-con-yogur-griego-con-manzana-y-almendras', 'Avena con yogur griego con manzana y almendras', 7, 1, '{desayuno,merienda}', false, 'Remojás la avena en la leche 3 minutos y la mezclás con el yogur griego.
Cortás la manzana en cubitos (con cáscara).
Servís la avena en un bowl y sumás la fruta.
Picás las almendras y las espolvoreás por encima.'),
  ('avena-cocida-con-arandanos-y-nueces', 'Avena cocida con arándanos y nueces', 13, 1, '{desayuno,merienda}', false, 'Cocinás la avena con la leche a fuego bajo, revolviendo, 6 minutos, hasta que espese.
Lavás los arándanos.
Servís la avena en un bowl y sumás la fruta.
Picás las nueces y las espolvoreás por encima.'),
  ('avena-cocida-con-banana-y-almendras', 'Avena cocida con banana y almendras', 13, 1, '{desayuno,merienda}', false, 'Cocinás la avena con la leche a fuego bajo, revolviendo, 6 minutos, hasta que espese.
Cortás la banana en rodajas.
Servís la avena en un bowl y sumás la fruta.
Picás las almendras y las espolvoreás por encima.'),
  ('avena-con-yogur-griego-con-mango-y-almendras', 'Avena con yogur griego con mango y almendras', 7, 1, '{desayuno,merienda}', false, 'Remojás la avena en la leche 3 minutos y la mezclás con el yogur griego.
Cortás el mango en cubos.
Servís la avena en un bowl y sumás la fruta.
Picás las almendras y las espolvoreás por encima.'),
  ('avena-con-yogur-griego-con-pera-y-semillas-de-girasol', 'Avena con yogur griego con pera y semillas de girasol', 7, 1, '{desayuno,merienda}', false, 'Remojás la avena en la leche 3 minutos y la mezclás con el yogur griego.
Cortás la pera en cubitos.
Servís la avena en un bowl y sumás la fruta.
Esparcís las semillas de girasol.'),
  ('avena-con-cacao-con-pera-y-cacao', 'Avena con cacao con pera y cacao', 13, 1, '{desayuno,merienda}', false, 'Cocinás la avena con la leche y el cacao a fuego bajo, revolviendo, 6 minutos.
Cortás la pera en cubitos.
Servís la avena en un bowl y sumás la fruta.
Espolvoreás el cacao amargo.'),
  ('avena-con-yogur-griego-con-banana-y-semillas-de-girasol', 'Avena con yogur griego con banana y semillas de girasol', 7, 1, '{desayuno,merienda}', false, 'Remojás la avena en la leche 3 minutos y la mezclás con el yogur griego.
Cortás la banana en rodajas.
Servís la avena en un bowl y sumás la fruta.
Esparcís las semillas de girasol.'),
  ('avena-con-yogur-griego-con-frutilla-y-semillas-de-chia', 'Avena con yogur griego con frutilla y semillas de chía', 7, 1, '{desayuno,merienda}', false, 'Remojás la avena en la leche 3 minutos y la mezclás con el yogur griego.
Lavás las frutillas y las cortás en láminas.
Servís la avena en un bowl y sumás la fruta.
Espolvoreás la chía por encima.'),
  ('avena-cocida-con-durazno-y-nueces', 'Avena cocida con durazno y nueces', 13, 1, '{desayuno,merienda}', false, 'Cocinás la avena con la leche a fuego bajo, revolviendo, 6 minutos, hasta que espese.
Cortás el durazno en gajos.
Servís la avena en un bowl y sumás la fruta.
Picás las nueces y las espolvoreás por encima.'),
  ('avena-con-yogur-griego-con-pera-y-coco-rallado', 'Avena con yogur griego con pera y coco rallado', 7, 1, '{desayuno,merienda}', false, 'Remojás la avena en la leche 3 minutos y la mezclás con el yogur griego.
Cortás la pera en cubitos.
Servís la avena en un bowl y sumás la fruta.
Espolvoreás el coco rallado.'),
  ('avena-con-yogur-griego-con-arandanos-y-miel', 'Avena con yogur griego con arándanos y miel', 7, 1, '{desayuno,merienda}', false, 'Remojás la avena en la leche 3 minutos y la mezclás con el yogur griego.
Lavás los arándanos.
Servís la avena en un bowl y sumás la fruta.
Terminás con un hilo de miel.'),
  ('avena-en-frio-overnight-con-arandanos-y-semillas-de', 'Avena en frío (overnight) con arándanos y semillas de girasol', 8, 1, '{desayuno,merienda}', true, 'Mezclás la avena con el yogur, la leche y la chía en un frasco, tapás y dejás en la heladera toda la noche (mínimo 6 horas).
Lavás los arándanos.
Servís la avena en un bowl y sumás la fruta.
Esparcís las semillas de girasol.'),
  ('avena-en-frio-overnight-con-banana-y-semillas-de-chia', 'Avena en frío (overnight) con banana y semillas de chía', 8, 1, '{desayuno,merienda}', true, 'Mezclás la avena con el yogur, la leche y la chía en un frasco, tapás y dejás en la heladera toda la noche (mínimo 6 horas).
Cortás la banana en rodajas.
Servís la avena en un bowl y sumás la fruta.
Espolvoreás la chía por encima.'),
  ('avena-en-frio-overnight-con-pera-y-pasas-de-uva', 'Avena en frío (overnight) con pera y pasas de uva', 8, 1, '{desayuno,merienda}', true, 'Mezclás la avena con el yogur, la leche y la chía en un frasco, tapás y dejás en la heladera toda la noche (mínimo 6 horas).
Cortás la pera en cubitos.
Servís la avena en un bowl y sumás la fruta.
Sumás las pasas de uva.'),
  ('avena-con-yogur-griego-con-mango-y-cacao', 'Avena con yogur griego con mango y cacao', 7, 1, '{desayuno,merienda}', false, 'Remojás la avena en la leche 3 minutos y la mezclás con el yogur griego.
Cortás el mango en cubos.
Servís la avena en un bowl y sumás la fruta.
Espolvoreás el cacao amargo.'),
  ('avena-con-yogur-griego-con-anana-y-semillas-de-girasol', 'Avena con yogur griego con anana y semillas de girasol', 7, 1, '{desayuno,merienda}', false, 'Remojás la avena en la leche 3 minutos y la mezclás con el yogur griego.
Cortás el ananá en trozos chicos.
Servís la avena en un bowl y sumás la fruta.
Esparcís las semillas de girasol.'),
  ('avena-con-cacao-con-banana-y-nueces', 'Avena con cacao con banana y nueces', 13, 1, '{desayuno,merienda}', false, 'Cocinás la avena con la leche y el cacao a fuego bajo, revolviendo, 6 minutos.
Cortás la banana en rodajas.
Servís la avena en un bowl y sumás la fruta.
Picás las nueces y las espolvoreás por encima.'),
  ('avena-con-cacao-con-manzana-y-miel', 'Avena con cacao con manzana y miel', 13, 1, '{desayuno,merienda}', false, 'Cocinás la avena con la leche y el cacao a fuego bajo, revolviendo, 6 minutos.
Cortás la manzana en cubitos (con cáscara).
Servís la avena en un bowl y sumás la fruta.
Terminás con un hilo de miel.'),
  ('avena-cocida-con-arandanos-y-cacao', 'Avena cocida con arándanos y cacao', 13, 1, '{desayuno,merienda}', false, 'Cocinás la avena con la leche a fuego bajo, revolviendo, 6 minutos, hasta que espese.
Lavás los arándanos.
Servís la avena en un bowl y sumás la fruta.
Espolvoreás el cacao amargo.'),
  ('avena-cocida-con-anana-y-nueces', 'Avena cocida con anana y nueces', 13, 1, '{desayuno,merienda}', false, 'Cocinás la avena con la leche a fuego bajo, revolviendo, 6 minutos, hasta que espese.
Cortás el ananá en trozos chicos.
Servís la avena en un bowl y sumás la fruta.
Picás las nueces y las espolvoreás por encima.'),
  ('avena-con-yogur-griego-con-frambuesas-y-almendras', 'Avena con yogur griego con frambuesas y almendras', 7, 1, '{desayuno,merienda}', false, 'Remojás la avena en la leche 3 minutos y la mezclás con el yogur griego.
Lavás las frambuesas con cuidado.
Servís la avena en un bowl y sumás la fruta.
Picás las almendras y las espolvoreás por encima.'),
  ('avena-cocida-con-durazno-y-pasas-de-uva', 'Avena cocida con durazno y pasas de uva', 13, 1, '{desayuno,merienda}', false, 'Cocinás la avena con la leche a fuego bajo, revolviendo, 6 minutos, hasta que espese.
Cortás el durazno en gajos.
Servís la avena en un bowl y sumás la fruta.
Sumás las pasas de uva.'),
  ('avena-con-yogur-griego-con-frambuesas-y-pasas-de-uva', 'Avena con yogur griego con frambuesas y pasas de uva', 7, 1, '{desayuno,merienda}', false, 'Remojás la avena en la leche 3 minutos y la mezclás con el yogur griego.
Lavás las frambuesas con cuidado.
Servís la avena en un bowl y sumás la fruta.
Sumás las pasas de uva.'),
  ('avena-con-yogur-griego-con-banana-y-almendras', 'Avena con yogur griego con banana y almendras', 7, 1, '{desayuno,merienda}', false, 'Remojás la avena en la leche 3 minutos y la mezclás con el yogur griego.
Cortás la banana en rodajas.
Servís la avena en un bowl y sumás la fruta.
Picás las almendras y las espolvoreás por encima.'),
  ('avena-con-yogur-griego-con-kiwi-y-nueces', 'Avena con yogur griego con kiwi y nueces', 7, 1, '{desayuno,merienda}', false, 'Remojás la avena en la leche 3 minutos y la mezclás con el yogur griego.
Pelás el kiwi y lo cortás en rodajas.
Servís la avena en un bowl y sumás la fruta.
Picás las nueces y las espolvoreás por encima.'),
  ('avena-cocida-con-anana-y-coco-rallado', 'Avena cocida con anana y coco rallado', 13, 1, '{desayuno,merienda}', false, 'Cocinás la avena con la leche a fuego bajo, revolviendo, 6 minutos, hasta que espese.
Cortás el ananá en trozos chicos.
Servís la avena en un bowl y sumás la fruta.
Espolvoreás el coco rallado.'),
  ('avena-con-yogur-griego-con-frambuesas-y-semillas-de-chia', 'Avena con yogur griego con frambuesas y semillas de chía', 7, 1, '{desayuno,merienda}', false, 'Remojás la avena en la leche 3 minutos y la mezclás con el yogur griego.
Lavás las frambuesas con cuidado.
Servís la avena en un bowl y sumás la fruta.
Espolvoreás la chía por encima.'),
  ('avena-cocida-con-anana-y-cacao', 'Avena cocida con anana y cacao', 13, 1, '{desayuno,merienda}', false, 'Cocinás la avena con la leche a fuego bajo, revolviendo, 6 minutos, hasta que espese.
Cortás el ananá en trozos chicos.
Servís la avena en un bowl y sumás la fruta.
Espolvoreás el cacao amargo.'),
  ('avena-en-frio-overnight-con-manzana-y-almendras', 'Avena en frío (overnight) con manzana y almendras', 8, 1, '{desayuno,merienda}', true, 'Mezclás la avena con el yogur, la leche y la chía en un frasco, tapás y dejás en la heladera toda la noche (mínimo 6 horas).
Cortás la manzana en cubitos (con cáscara).
Servís la avena en un bowl y sumás la fruta.
Picás las almendras y las espolvoreás por encima.'),
  ('avena-cocida-con-frutilla-y-semillas-de-chia', 'Avena cocida con frutilla y semillas de chía', 13, 1, '{desayuno,merienda}', false, 'Cocinás la avena con la leche a fuego bajo, revolviendo, 6 minutos, hasta que espese.
Lavás las frutillas y las cortás en láminas.
Servís la avena en un bowl y sumás la fruta.
Espolvoreás la chía por encima.'),
  ('avena-con-cacao-con-arandanos-y-almendras', 'Avena con cacao con arándanos y almendras', 13, 1, '{desayuno,merienda}', false, 'Cocinás la avena con la leche y el cacao a fuego bajo, revolviendo, 6 minutos.
Lavás los arándanos.
Servís la avena en un bowl y sumás la fruta.
Picás las almendras y las espolvoreás por encima.'),
  ('cottage-con-banana-y-avena', 'Cottage con banana y avena', 4, 1, '{desayuno,merienda}', true, 'Cortás la banana en rodajas.
Servís el cottage en un bowl o frasco y sumás la fruta.
Sumás la avena cruda y mezclás.'),
  ('yogur-natural-con-durazno-y-granola', 'Yogur natural con durazno y granola', 4, 1, '{desayuno,merienda}', true, 'Cortás el durazno en gajos.
Servís el yogur natural en un bowl o frasco y sumás la fruta.
Sumás la granola recién al servir, para que quede crocante.'),
  ('yogur-proteico-con-durazno-y-muesli', 'Yogur proteico con durazno y muesli', 4, 1, '{desayuno,merienda}', true, 'Cortás el durazno en gajos.
Servís el yogur proteico en un bowl o frasco y sumás la fruta.
Sumás el muesli por encima.'),
  ('cottage-con-mango-y-avena', 'Cottage con mango y avena', 4, 1, '{desayuno,merienda}', true, 'Cortás el mango en cubos.
Servís el cottage en un bowl o frasco y sumás la fruta.
Sumás la avena cruda y mezclás.'),
  ('yogur-proteico-con-kiwi-y-avena', 'Yogur proteico con kiwi y avena', 4, 1, '{desayuno,merienda}', true, 'Pelás el kiwi y lo cortás en rodajas.
Servís el yogur proteico en un bowl o frasco y sumás la fruta.
Sumás la avena cruda y mezclás.'),
  ('yogur-proteico-con-durazno-y-avena', 'Yogur proteico con durazno y avena', 4, 1, '{desayuno,merienda}', true, 'Cortás el durazno en gajos.
Servís el yogur proteico en un bowl o frasco y sumás la fruta.
Sumás la avena cruda y mezclás.'),
  ('yogur-natural-con-banana-y-granola', 'Yogur natural con banana y granola', 4, 1, '{desayuno,merienda}', true, 'Cortás la banana en rodajas.
Servís el yogur natural en un bowl o frasco y sumás la fruta.
Sumás la granola recién al servir, para que quede crocante.'),
  ('yogur-proteico-con-arandanos-y-granola', 'Yogur proteico con arándanos y granola', 4, 1, '{desayuno,merienda}', true, 'Lavás los arándanos.
Servís el yogur proteico en un bowl o frasco y sumás la fruta.
Sumás la granola recién al servir, para que quede crocante.'),
  ('yogur-proteico-con-mango-y-granola', 'Yogur proteico con mango y granola', 4, 1, '{desayuno,merienda}', true, 'Cortás el mango en cubos.
Servís el yogur proteico en un bowl o frasco y sumás la fruta.
Sumás la granola recién al servir, para que quede crocante.'),
  ('cottage-con-kiwi-y-muesli', 'Cottage con kiwi y muesli', 4, 1, '{desayuno,merienda}', true, 'Pelás el kiwi y lo cortás en rodajas.
Servís el cottage en un bowl o frasco y sumás la fruta.
Sumás el muesli por encima.'),
  ('yogur-griego-con-kiwi-y-granola', 'Yogur griego con kiwi y granola', 4, 1, '{desayuno,merienda}', true, 'Pelás el kiwi y lo cortás en rodajas.
Servís el yogur griego en un bowl o frasco y sumás la fruta.
Sumás la granola recién al servir, para que quede crocante.'),
  ('cottage-con-durazno-y-granola', 'Cottage con durazno y granola', 4, 1, '{desayuno,merienda}', true, 'Cortás el durazno en gajos.
Servís el cottage en un bowl o frasco y sumás la fruta.
Sumás la granola recién al servir, para que quede crocante.'),
  ('yogur-griego-con-anana-y-granola', 'Yogur griego con anana y granola', 4, 1, '{desayuno,merienda}', true, 'Cortás el ananá en trozos chicos.
Servís el yogur griego en un bowl o frasco y sumás la fruta.
Sumás la granola recién al servir, para que quede crocante.'),
  ('yogur-griego-con-arandanos-y-muesli', 'Yogur griego con arándanos y muesli', 4, 1, '{desayuno,merienda}', true, 'Lavás los arándanos.
Servís el yogur griego en un bowl o frasco y sumás la fruta.
Sumás el muesli por encima.'),
  ('cottage-con-durazno-y-avena', 'Cottage con durazno y avena', 4, 1, '{desayuno,merienda}', true, 'Cortás el durazno en gajos.
Servís el cottage en un bowl o frasco y sumás la fruta.
Sumás la avena cruda y mezclás.'),
  ('yogur-griego-con-anana-y-muesli', 'Yogur griego con anana y muesli', 4, 1, '{desayuno,merienda}', true, 'Cortás el ananá en trozos chicos.
Servís el yogur griego en un bowl o frasco y sumás la fruta.
Sumás el muesli por encima.'),
  ('yogur-proteico-con-pera-y-granola', 'Yogur proteico con pera y granola', 4, 1, '{desayuno,merienda}', true, 'Cortás la pera en cubitos.
Servís el yogur proteico en un bowl o frasco y sumás la fruta.
Sumás la granola recién al servir, para que quede crocante.'),
  ('yogur-natural-con-durazno-y-muesli', 'Yogur natural con durazno y muesli', 4, 1, '{desayuno,merienda}', true, 'Cortás el durazno en gajos.
Servís el yogur natural en un bowl o frasco y sumás la fruta.
Sumás el muesli por encima.'),
  ('yogur-griego-con-manzana-y-muesli', 'Yogur griego con manzana y muesli', 4, 1, '{desayuno,merienda}', true, 'Cortás la manzana en cubitos (con cáscara).
Servís el yogur griego en un bowl o frasco y sumás la fruta.
Sumás el muesli por encima.'),
  ('yogur-proteico-con-pera-y-avena', 'Yogur proteico con pera y avena', 4, 1, '{desayuno,merienda}', true, 'Cortás la pera en cubitos.
Servís el yogur proteico en un bowl o frasco y sumás la fruta.
Sumás la avena cruda y mezclás.'),
  ('cottage-con-mango-y-muesli', 'Cottage con mango y muesli', 4, 1, '{desayuno,merienda}', true, 'Cortás el mango en cubos.
Servís el cottage en un bowl o frasco y sumás la fruta.
Sumás el muesli por encima.'),
  ('yogur-natural-con-manzana-y-granola', 'Yogur natural con manzana y granola', 4, 1, '{desayuno,merienda}', true, 'Cortás la manzana en cubitos (con cáscara).
Servís el yogur natural en un bowl o frasco y sumás la fruta.
Sumás la granola recién al servir, para que quede crocante.'),
  ('yogur-natural-con-frambuesas-y-granola', 'Yogur natural con frambuesas y granola', 4, 1, '{desayuno,merienda}', true, 'Lavás las frambuesas con cuidado.
Servís el yogur natural en un bowl o frasco y sumás la fruta.
Sumás la granola recién al servir, para que quede crocante.'),
  ('yogur-natural-con-anana-y-granola', 'Yogur natural con anana y granola', 4, 1, '{desayuno,merienda}', true, 'Cortás el ananá en trozos chicos.
Servís el yogur natural en un bowl o frasco y sumás la fruta.
Sumás la granola recién al servir, para que quede crocante.'),
  ('yogur-proteico-con-manzana-y-granola', 'Yogur proteico con manzana y granola', 4, 1, '{desayuno,merienda}', true, 'Cortás la manzana en cubitos (con cáscara).
Servís el yogur proteico en un bowl o frasco y sumás la fruta.
Sumás la granola recién al servir, para que quede crocante.'),
  ('yogur-natural-con-banana-y-muesli', 'Yogur natural con banana y muesli', 4, 1, '{desayuno,merienda}', true, 'Cortás la banana en rodajas.
Servís el yogur natural en un bowl o frasco y sumás la fruta.
Sumás el muesli por encima.'),
  ('cottage-con-anana-y-granola', 'Cottage con anana y granola', 4, 1, '{desayuno,merienda}', true, 'Cortás el ananá en trozos chicos.
Servís el cottage en un bowl o frasco y sumás la fruta.
Sumás la granola recién al servir, para que quede crocante.'),
  ('yogur-natural-con-arandanos-y-avena', 'Yogur natural con arándanos y avena', 4, 1, '{desayuno,merienda}', true, 'Lavás los arándanos.
Servís el yogur natural en un bowl o frasco y sumás la fruta.
Sumás la avena cruda y mezclás.'),
  ('cottage-con-durazno-y-muesli', 'Cottage con durazno y muesli', 4, 1, '{desayuno,merienda}', true, 'Cortás el durazno en gajos.
Servís el cottage en un bowl o frasco y sumás la fruta.
Sumás el muesli por encima.'),
  ('yogur-griego-con-frutilla-y-granola', 'Yogur griego con frutilla y granola', 4, 1, '{desayuno,merienda}', true, 'Lavás las frutillas y las cortás en láminas.
Servís el yogur griego en un bowl o frasco y sumás la fruta.
Sumás la granola recién al servir, para que quede crocante.'),
  ('yogur-proteico-con-arandanos-y-avena', 'Yogur proteico con arándanos y avena', 4, 1, '{desayuno,merienda}', true, 'Lavás los arándanos.
Servís el yogur proteico en un bowl o frasco y sumás la fruta.
Sumás la avena cruda y mezclás.'),
  ('yogur-natural-con-kiwi-y-avena', 'Yogur natural con kiwi y avena', 4, 1, '{desayuno,merienda}', true, 'Pelás el kiwi y lo cortás en rodajas.
Servís el yogur natural en un bowl o frasco y sumás la fruta.
Sumás la avena cruda y mezclás.'),
  ('cottage-con-frambuesas-y-avena', 'Cottage con frambuesas y avena', 4, 1, '{desayuno,merienda}', true, 'Lavás las frambuesas con cuidado.
Servís el cottage en un bowl o frasco y sumás la fruta.
Sumás la avena cruda y mezclás.'),
  ('yogur-natural-con-kiwi-y-granola', 'Yogur natural con kiwi y granola', 4, 1, '{desayuno,merienda}', true, 'Pelás el kiwi y lo cortás en rodajas.
Servís el yogur natural en un bowl o frasco y sumás la fruta.
Sumás la granola recién al servir, para que quede crocante.'),
  ('cottage-con-manzana-y-granola', 'Cottage con manzana y granola', 4, 1, '{desayuno,merienda}', true, 'Cortás la manzana en cubitos (con cáscara).
Servís el cottage en un bowl o frasco y sumás la fruta.
Sumás la granola recién al servir, para que quede crocante.'),
  ('yogur-griego-con-banana-y-avena', 'Yogur griego con banana y avena', 4, 1, '{desayuno,merienda}', true, 'Cortás la banana en rodajas.
Servís el yogur griego en un bowl o frasco y sumás la fruta.
Sumás la avena cruda y mezclás.'),
  ('licuado-de-pera-con-proteina-yogur', 'Licuado de pera con proteína (yogur)', 5, 1, '{desayuno,merienda}', true, 'Cortás la pera en cubitos.
Ponés en la licuadora yogur, la fruta y sumás la proteína en polvo, con unos cubos de hielo si querés.
Licuás 1 minuto, hasta que quede cremoso y sin grumos, y tomás enseguida.'),
  ('licuado-de-frambuesas-con-jengibre-leche', 'Licuado de frambuesas con jengibre (leche)', 5, 1, '{desayuno,merienda}', true, 'Lavás las frambuesas con cuidado.
Ponés en la licuadora leche, la fruta y sumás el jengibre rallado y la miel, con unos cubos de hielo si querés.
Licuás 1 minuto, hasta que quede cremoso y sin grumos, y tomás enseguida.'),
  ('licuado-de-frutilla-con-cacao-yogur', 'Licuado de frutilla con cacao (yogur)', 5, 1, '{desayuno,merienda}', true, 'Lavás las frutillas y las cortás en láminas.
Ponés en la licuadora yogur, la fruta y sumás el cacao y la miel, con unos cubos de hielo si querés.
Licuás 1 minuto, hasta que quede cremoso y sin grumos, y tomás enseguida.'),
  ('licuado-de-frutilla-con-proteina-yogur', 'Licuado de frutilla con proteína (yogur)', 5, 1, '{desayuno,merienda}', true, 'Lavás las frutillas y las cortás en láminas.
Ponés en la licuadora yogur, la fruta y sumás la proteína en polvo, con unos cubos de hielo si querés.
Licuás 1 minuto, hasta que quede cremoso y sin grumos, y tomás enseguida.'),
  ('licuado-de-durazno-con-espinaca-yogur', 'Licuado de durazno con espinaca (yogur)', 5, 1, '{desayuno,merienda}', true, 'Cortás el durazno en gajos.
Ponés en la licuadora yogur, la fruta y sumás la espinaca, con unos cubos de hielo si querés.
Licuás 1 minuto, hasta que quede cremoso y sin grumos, y tomás enseguida.'),
  ('licuado-de-frutilla-con-proteina-leche', 'Licuado de frutilla con proteína (leche)', 5, 1, '{desayuno,merienda}', true, 'Lavás las frutillas y las cortás en láminas.
Ponés en la licuadora leche, la fruta y sumás la proteína en polvo, con unos cubos de hielo si querés.
Licuás 1 minuto, hasta que quede cremoso y sin grumos, y tomás enseguida.'),
  ('licuado-de-pera-con-espinaca-yogur', 'Licuado de pera con espinaca (yogur)', 5, 1, '{desayuno,merienda}', true, 'Cortás la pera en cubitos.
Ponés en la licuadora yogur, la fruta y sumás la espinaca, con unos cubos de hielo si querés.
Licuás 1 minuto, hasta que quede cremoso y sin grumos, y tomás enseguida.'),
  ('licuado-de-mango-con-avena-leche', 'Licuado de mango con avena (leche)', 5, 1, '{desayuno,merienda}', true, 'Cortás el mango en cubos.
Ponés en la licuadora leche, la fruta y sumás la avena, con unos cubos de hielo si querés.
Licuás 1 minuto, hasta que quede cremoso y sin grumos, y tomás enseguida.'),
  ('licuado-de-mango-con-avena-bebida-de-avena', 'Licuado de mango con avena (bebida de avena)', 5, 1, '{desayuno,merienda}', true, 'Cortás el mango en cubos.
Ponés en la licuadora bebida de avena, la fruta y sumás la avena, con unos cubos de hielo si querés.
Licuás 1 minuto, hasta que quede cremoso y sin grumos, y tomás enseguida.'),
  ('licuado-de-manzana-con-mantequilla-de-mani-bebida-de', 'Licuado de manzana con mantequilla de maní (bebida de avena)', 5, 1, '{desayuno,merienda}', true, 'Cortás la manzana en cubitos (con cáscara).
Ponés en la licuadora bebida de avena, la fruta y sumás la pasta de maní, con unos cubos de hielo si querés.
Licuás 1 minuto, hasta que quede cremoso y sin grumos, y tomás enseguida.'),
  ('licuado-de-banana-con-mantequilla-de-mani-bebida-de', 'Licuado de banana con mantequilla de maní (bebida de avena)', 5, 1, '{desayuno,merienda}', true, 'Cortás la banana en rodajas.
Ponés en la licuadora bebida de avena, la fruta y sumás la pasta de maní, con unos cubos de hielo si querés.
Licuás 1 minuto, hasta que quede cremoso y sin grumos, y tomás enseguida.'),
  ('licuado-de-manzana-con-avena-yogur', 'Licuado de manzana con avena (yogur)', 5, 1, '{desayuno,merienda}', true, 'Cortás la manzana en cubitos (con cáscara).
Ponés en la licuadora yogur, la fruta y sumás la avena, con unos cubos de hielo si querés.
Licuás 1 minuto, hasta que quede cremoso y sin grumos, y tomás enseguida.'),
  ('licuado-de-anana-con-proteina-bebida-de-almendras', 'Licuado de anana con proteína (bebida de almendras)', 5, 1, '{desayuno,merienda}', true, 'Cortás el ananá en trozos chicos.
Ponés en la licuadora bebida de almendras, la fruta y sumás la proteína en polvo, con unos cubos de hielo si querés.
Licuás 1 minuto, hasta que quede cremoso y sin grumos, y tomás enseguida.'),
  ('licuado-de-anana-con-jengibre-yogur', 'Licuado de anana con jengibre (yogur)', 5, 1, '{desayuno,merienda}', true, 'Cortás el ananá en trozos chicos.
Ponés en la licuadora yogur, la fruta y sumás el jengibre rallado y la miel, con unos cubos de hielo si querés.
Licuás 1 minuto, hasta que quede cremoso y sin grumos, y tomás enseguida.'),
  ('licuado-de-pera-con-proteina-bebida-de-avena', 'Licuado de pera con proteína (bebida de avena)', 5, 1, '{desayuno,merienda}', true, 'Cortás la pera en cubitos.
Ponés en la licuadora bebida de avena, la fruta y sumás la proteína en polvo, con unos cubos de hielo si querés.
Licuás 1 minuto, hasta que quede cremoso y sin grumos, y tomás enseguida.'),
  ('licuado-de-anana-con-proteina-bebida-de-avena', 'Licuado de anana con proteína (bebida de avena)', 5, 1, '{desayuno,merienda}', true, 'Cortás el ananá en trozos chicos.
Ponés en la licuadora bebida de avena, la fruta y sumás la proteína en polvo, con unos cubos de hielo si querés.
Licuás 1 minuto, hasta que quede cremoso y sin grumos, y tomás enseguida.'),
  ('licuado-de-frutilla-con-mantequilla-de-mani-leche', 'Licuado de frutilla con mantequilla de maní (leche)', 5, 1, '{desayuno,merienda}', true, 'Lavás las frutillas y las cortás en láminas.
Ponés en la licuadora leche, la fruta y sumás la pasta de maní, con unos cubos de hielo si querés.
Licuás 1 minuto, hasta que quede cremoso y sin grumos, y tomás enseguida.'),
  ('licuado-de-frambuesas-con-mantequilla-de-mani-bebida-de', 'Licuado de frambuesas con mantequilla de maní (bebida de avena)', 5, 1, '{desayuno,merienda}', true, 'Lavás las frambuesas con cuidado.
Ponés en la licuadora bebida de avena, la fruta y sumás la pasta de maní, con unos cubos de hielo si querés.
Licuás 1 minuto, hasta que quede cremoso y sin grumos, y tomás enseguida.'),
  ('licuado-de-banana-con-mantequilla-de-mani-yogur', 'Licuado de banana con mantequilla de maní (yogur)', 5, 1, '{desayuno,merienda}', true, 'Cortás la banana en rodajas.
Ponés en la licuadora yogur, la fruta y sumás la pasta de maní, con unos cubos de hielo si querés.
Licuás 1 minuto, hasta que quede cremoso y sin grumos, y tomás enseguida.'),
  ('licuado-de-arandanos-con-avena-leche', 'Licuado de arándanos con avena (leche)', 5, 1, '{desayuno,merienda}', true, 'Lavás los arándanos.
Ponés en la licuadora leche, la fruta y sumás la avena, con unos cubos de hielo si querés.
Licuás 1 minuto, hasta que quede cremoso y sin grumos, y tomás enseguida.'),
  ('licuado-de-anana-con-avena-bebida-de-avena', 'Licuado de anana con avena (bebida de avena)', 5, 1, '{desayuno,merienda}', true, 'Cortás el ananá en trozos chicos.
Ponés en la licuadora bebida de avena, la fruta y sumás la avena, con unos cubos de hielo si querés.
Licuás 1 minuto, hasta que quede cremoso y sin grumos, y tomás enseguida.'),
  ('licuado-de-banana-con-avena-bebida-de-avena', 'Licuado de banana con avena (bebida de avena)', 5, 1, '{desayuno,merienda}', true, 'Cortás la banana en rodajas.
Ponés en la licuadora bebida de avena, la fruta y sumás la avena, con unos cubos de hielo si querés.
Licuás 1 minuto, hasta que quede cremoso y sin grumos, y tomás enseguida.'),
  ('licuado-de-durazno-con-proteina-leche', 'Licuado de durazno con proteína (leche)', 5, 1, '{desayuno,merienda}', true, 'Cortás el durazno en gajos.
Ponés en la licuadora leche, la fruta y sumás la proteína en polvo, con unos cubos de hielo si querés.
Licuás 1 minuto, hasta que quede cremoso y sin grumos, y tomás enseguida.'),
  ('licuado-de-arandanos-con-avena-bebida-de-avena', 'Licuado de arándanos con avena (bebida de avena)', 5, 1, '{desayuno,merienda}', true, 'Lavás los arándanos.
Ponés en la licuadora bebida de avena, la fruta y sumás la avena, con unos cubos de hielo si querés.
Licuás 1 minuto, hasta que quede cremoso y sin grumos, y tomás enseguida.'),
  ('licuado-de-frambuesas-con-jengibre-yogur', 'Licuado de frambuesas con jengibre (yogur)', 5, 1, '{desayuno,merienda}', true, 'Lavás las frambuesas con cuidado.
Ponés en la licuadora yogur, la fruta y sumás el jengibre rallado y la miel, con unos cubos de hielo si querés.
Licuás 1 minuto, hasta que quede cremoso y sin grumos, y tomás enseguida.'),
  ('licuado-de-arandanos-con-proteina-bebida-de-avena', 'Licuado de arándanos con proteína (bebida de avena)', 5, 1, '{desayuno,merienda}', true, 'Lavás los arándanos.
Ponés en la licuadora bebida de avena, la fruta y sumás la proteína en polvo, con unos cubos de hielo si querés.
Licuás 1 minuto, hasta que quede cremoso y sin grumos, y tomás enseguida.'),
  ('licuado-de-mango-con-proteina-bebida-de-almendras', 'Licuado de mango con proteína (bebida de almendras)', 5, 1, '{desayuno,merienda}', true, 'Cortás el mango en cubos.
Ponés en la licuadora bebida de almendras, la fruta y sumás la proteína en polvo, con unos cubos de hielo si querés.
Licuás 1 minuto, hasta que quede cremoso y sin grumos, y tomás enseguida.'),
  ('licuado-de-manzana-con-jengibre-leche', 'Licuado de manzana con jengibre (leche)', 5, 1, '{desayuno,merienda}', true, 'Cortás la manzana en cubitos (con cáscara).
Ponés en la licuadora leche, la fruta y sumás el jengibre rallado y la miel, con unos cubos de hielo si querés.
Licuás 1 minuto, hasta que quede cremoso y sin grumos, y tomás enseguida.'),
  ('licuado-de-pera-con-proteina-bebida-de-almendras', 'Licuado de pera con proteína (bebida de almendras)', 5, 1, '{desayuno,merienda}', true, 'Cortás la pera en cubitos.
Ponés en la licuadora bebida de almendras, la fruta y sumás la proteína en polvo, con unos cubos de hielo si querés.
Licuás 1 minuto, hasta que quede cremoso y sin grumos, y tomás enseguida.'),
  ('licuado-de-frutilla-con-cacao-leche', 'Licuado de frutilla con cacao (leche)', 5, 1, '{desayuno,merienda}', true, 'Lavás las frutillas y las cortás en láminas.
Ponés en la licuadora leche, la fruta y sumás el cacao y la miel, con unos cubos de hielo si querés.
Licuás 1 minuto, hasta que quede cremoso y sin grumos, y tomás enseguida.'),
  ('licuado-de-mango-con-mantequilla-de-mani-leche', 'Licuado de mango con mantequilla de maní (leche)', 5, 1, '{desayuno,merienda}', true, 'Cortás el mango en cubos.
Ponés en la licuadora leche, la fruta y sumás la pasta de maní, con unos cubos de hielo si querés.
Licuás 1 minuto, hasta que quede cremoso y sin grumos, y tomás enseguida.'),
  ('licuado-de-mango-con-cacao-yogur', 'Licuado de mango con cacao (yogur)', 5, 1, '{desayuno,merienda}', true, 'Cortás el mango en cubos.
Ponés en la licuadora yogur, la fruta y sumás el cacao y la miel, con unos cubos de hielo si querés.
Licuás 1 minuto, hasta que quede cremoso y sin grumos, y tomás enseguida.'),
  ('licuado-de-anana-con-avena-leche', 'Licuado de anana con avena (leche)', 5, 1, '{desayuno,merienda}', true, 'Cortás el ananá en trozos chicos.
Ponés en la licuadora leche, la fruta y sumás la avena, con unos cubos de hielo si querés.
Licuás 1 minuto, hasta que quede cremoso y sin grumos, y tomás enseguida.'),
  ('licuado-de-manzana-con-avena-leche', 'Licuado de manzana con avena (leche)', 5, 1, '{desayuno,merienda}', true, 'Cortás la manzana en cubitos (con cáscara).
Ponés en la licuadora leche, la fruta y sumás la avena, con unos cubos de hielo si querés.
Licuás 1 minuto, hasta que quede cremoso y sin grumos, y tomás enseguida.'),
  ('licuado-de-frambuesas-con-proteina-yogur', 'Licuado de frambuesas con proteína (yogur)', 5, 1, '{desayuno,merienda}', true, 'Lavás las frambuesas con cuidado.
Ponés en la licuadora yogur, la fruta y sumás la proteína en polvo, con unos cubos de hielo si querés.
Licuás 1 minuto, hasta que quede cremoso y sin grumos, y tomás enseguida.'),
  ('licuado-de-frutilla-con-proteina-bebida-de-almendras', 'Licuado de frutilla con proteína (bebida de almendras)', 5, 1, '{desayuno,merienda}', true, 'Lavás las frutillas y las cortás en láminas.
Ponés en la licuadora bebida de almendras, la fruta y sumás la proteína en polvo, con unos cubos de hielo si querés.
Licuás 1 minuto, hasta que quede cremoso y sin grumos, y tomás enseguida.'),
  ('licuado-de-durazno-con-proteina-yogur', 'Licuado de durazno con proteína (yogur)', 5, 1, '{desayuno,merienda}', true, 'Cortás el durazno en gajos.
Ponés en la licuadora yogur, la fruta y sumás la proteína en polvo, con unos cubos de hielo si querés.
Licuás 1 minuto, hasta que quede cremoso y sin grumos, y tomás enseguida.'),
  ('licuado-de-pera-con-jengibre-leche', 'Licuado de pera con jengibre (leche)', 5, 1, '{desayuno,merienda}', true, 'Cortás la pera en cubitos.
Ponés en la licuadora leche, la fruta y sumás el jengibre rallado y la miel, con unos cubos de hielo si querés.
Licuás 1 minuto, hasta que quede cremoso y sin grumos, y tomás enseguida.'),
  ('licuado-de-frutilla-con-mantequilla-de-mani-bebida-de', 'Licuado de frutilla con mantequilla de maní (bebida de avena)', 5, 1, '{desayuno,merienda}', true, 'Lavás las frutillas y las cortás en láminas.
Ponés en la licuadora bebida de avena, la fruta y sumás la pasta de maní, con unos cubos de hielo si querés.
Licuás 1 minuto, hasta que quede cremoso y sin grumos, y tomás enseguida.'),
  ('licuado-de-banana-con-mantequilla-de-mani-bebida-de-2', 'Licuado de banana con mantequilla de maní (bebida de almendras)', 5, 1, '{desayuno,merienda}', true, 'Cortás la banana en rodajas.
Ponés en la licuadora bebida de almendras, la fruta y sumás la pasta de maní, con unos cubos de hielo si querés.
Licuás 1 minuto, hasta que quede cremoso y sin grumos, y tomás enseguida.'),
  ('licuado-de-arandanos-con-jengibre-yogur', 'Licuado de arándanos con jengibre (yogur)', 5, 1, '{desayuno,merienda}', true, 'Lavás los arándanos.
Ponés en la licuadora yogur, la fruta y sumás el jengibre rallado y la miel, con unos cubos de hielo si querés.
Licuás 1 minuto, hasta que quede cremoso y sin grumos, y tomás enseguida.'),
  ('licuado-de-manzana-con-proteina-yogur', 'Licuado de manzana con proteína (yogur)', 5, 1, '{desayuno,merienda}', true, 'Cortás la manzana en cubitos (con cáscara).
Ponés en la licuadora yogur, la fruta y sumás la proteína en polvo, con unos cubos de hielo si querés.
Licuás 1 minuto, hasta que quede cremoso y sin grumos, y tomás enseguida.'),
  ('licuado-de-durazno-con-proteina-bebida-de-almendras', 'Licuado de durazno con proteína (bebida de almendras)', 5, 1, '{desayuno,merienda}', true, 'Cortás el durazno en gajos.
Ponés en la licuadora bebida de almendras, la fruta y sumás la proteína en polvo, con unos cubos de hielo si querés.
Licuás 1 minuto, hasta que quede cremoso y sin grumos, y tomás enseguida.'),
  ('licuado-de-frambuesas-con-mantequilla-de-mani-yogur', 'Licuado de frambuesas con mantequilla de maní (yogur)', 5, 1, '{desayuno,merienda}', true, 'Lavás las frambuesas con cuidado.
Ponés en la licuadora yogur, la fruta y sumás la pasta de maní, con unos cubos de hielo si querés.
Licuás 1 minuto, hasta que quede cremoso y sin grumos, y tomás enseguida.'),
  ('panqueques-de-avena-con-manzana-y-canela', 'Panqueques de avena con manzana y canela', 20, 1, '{desayuno,merienda}', false, 'Licuás la avena con el huevo y la leche hasta obtener una mezcla lisa; la dejás reposar 5 minutos.
Calentás una sartén antiadherente con una gota de aceite y cocinás cucharones de masa a fuego medio, 2 minutos por lado, hasta que se doren.
Servís los panqueques con manzana y canela por encima.'),
  ('panqueques-de-ricota-con-banana-y-dulce-de-leche-light', 'Panqueques de ricota con banana y dulce de leche light', 20, 1, '{desayuno,merienda}', false, 'Mezclás la ricota con el huevo y la harina hasta obtener una masa espesa.
Calentás una sartén antiadherente con una gota de aceite y cocinás cucharones de masa a fuego medio, 2 minutos por lado, hasta que se doren.
Servís los panqueques con banana y dulce de leche light por encima.'),
  ('tortitas-de-yogur-con-manzana-y-canela', 'Tortitas de yogur con manzana y canela', 20, 1, '{desayuno,merienda}', false, 'Mezclás la harina con el polvo de hornear; sumás el yogur y el huevo y revolvés hasta integrar.
Calentás una sartén antiadherente con una gota de aceite y cocinás cucharones de masa a fuego medio, 2 minutos por lado, hasta que se doren.
Servís los panqueques con manzana y canela por encima.'),
  ('panqueques-de-banana-con-arandanos-y-yogur', 'Panqueques de banana con arándanos y yogur', 20, 1, '{desayuno,merienda}', false, 'Aplastás la banana, la mezclás con el huevo y la avena hasta obtener una masa espesa.
Calentás una sartén antiadherente con una gota de aceite y cocinás cucharones de masa a fuego medio, 2 minutos por lado, hasta que se doren.
Servís los panqueques con arándanos y yogur por encima.'),
  ('panqueques-de-avena-con-mango-y-coco', 'Panqueques de avena con mango y coco', 20, 1, '{desayuno,merienda}', false, 'Licuás la avena con el huevo y la leche hasta obtener una mezcla lisa; la dejás reposar 5 minutos.
Calentás una sartén antiadherente con una gota de aceite y cocinás cucharones de masa a fuego medio, 2 minutos por lado, hasta que se doren.
Servís los panqueques con mango y coco por encima.'),
  ('panqueques-de-ricota-con-cacao-y-frutillas', 'Panqueques de ricota con cacao y frutillas', 20, 1, '{desayuno,merienda}', false, 'Mezclás la ricota con el huevo y la harina hasta obtener una masa espesa.
Calentás una sartén antiadherente con una gota de aceite y cocinás cucharones de masa a fuego medio, 2 minutos por lado, hasta que se doren.
Servís los panqueques con cacao y frutillas por encima.'),
  ('panqueques-de-avena-con-cacao-y-frutillas', 'Panqueques de avena con cacao y frutillas', 20, 1, '{desayuno,merienda}', false, 'Licuás la avena con el huevo y la leche hasta obtener una mezcla lisa; la dejás reposar 5 minutos.
Calentás una sartén antiadherente con una gota de aceite y cocinás cucharones de masa a fuego medio, 2 minutos por lado, hasta que se doren.
Servís los panqueques con cacao y frutillas por encima.'),
  ('tortitas-de-yogur-con-durazno-y-ricota', 'Tortitas de yogur con durazno y ricota', 20, 1, '{desayuno,merienda}', false, 'Mezclás la harina con el polvo de hornear; sumás el yogur y el huevo y revolvés hasta integrar.
Calentás una sartén antiadherente con una gota de aceite y cocinás cucharones de masa a fuego medio, 2 minutos por lado, hasta que se doren.
Servís los panqueques con durazno y ricota por encima.'),
  ('panqueques-de-banana-con-cacao-y-frutillas', 'Panqueques de banana con cacao y frutillas', 20, 1, '{desayuno,merienda}', false, 'Aplastás la banana, la mezclás con el huevo y la avena hasta obtener una masa espesa.
Calentás una sartén antiadherente con una gota de aceite y cocinás cucharones de masa a fuego medio, 2 minutos por lado, hasta que se doren.
Servís los panqueques con cacao y frutillas por encima.'),
  ('panqueques-de-banana-con-manzana-y-canela', 'Panqueques de banana con manzana y canela', 20, 1, '{desayuno,merienda}', false, 'Aplastás la banana, la mezclás con el huevo y la avena hasta obtener una masa espesa.
Calentás una sartén antiadherente con una gota de aceite y cocinás cucharones de masa a fuego medio, 2 minutos por lado, hasta que se doren.
Servís los panqueques con manzana y canela por encima.'),
  ('panqueques-de-avena-con-banana-y-dulce-de-leche-light', 'Panqueques de avena con banana y dulce de leche light', 20, 1, '{desayuno,merienda}', false, 'Licuás la avena con el huevo y la leche hasta obtener una mezcla lisa; la dejás reposar 5 minutos.
Calentás una sartén antiadherente con una gota de aceite y cocinás cucharones de masa a fuego medio, 2 minutos por lado, hasta que se doren.
Servís los panqueques con banana y dulce de leche light por encima.'),
  ('panqueques-de-avena-con-frutillas-y-miel', 'Panqueques de avena con frutillas y miel', 20, 1, '{desayuno,merienda}', false, 'Licuás la avena con el huevo y la leche hasta obtener una mezcla lisa; la dejás reposar 5 minutos.
Calentás una sartén antiadherente con una gota de aceite y cocinás cucharones de masa a fuego medio, 2 minutos por lado, hasta que se doren.
Servís los panqueques con frutillas y miel por encima.'),
  ('tortitas-de-yogur-con-cacao-y-frutillas', 'Tortitas de yogur con cacao y frutillas', 20, 1, '{desayuno,merienda}', false, 'Mezclás la harina con el polvo de hornear; sumás el yogur y el huevo y revolvés hasta integrar.
Calentás una sartén antiadherente con una gota de aceite y cocinás cucharones de masa a fuego medio, 2 minutos por lado, hasta que se doren.
Servís los panqueques con cacao y frutillas por encima.'),
  ('panqueques-de-banana-con-banana-y-dulce-de-leche-light', 'Panqueques de banana con banana y dulce de leche light', 20, 1, '{desayuno,merienda}', false, 'Aplastás la banana, la mezclás con el huevo y la avena hasta obtener una masa espesa.
Calentás una sartén antiadherente con una gota de aceite y cocinás cucharones de masa a fuego medio, 2 minutos por lado, hasta que se doren.
Servís los panqueques con banana y dulce de leche light por encima.'),
  ('panqueques-de-ricota-con-durazno-y-ricota', 'Panqueques de ricota con durazno y ricota', 20, 1, '{desayuno,merienda}', false, 'Mezclás la ricota con el huevo y la harina hasta obtener una masa espesa.
Calentás una sartén antiadherente con una gota de aceite y cocinás cucharones de masa a fuego medio, 2 minutos por lado, hasta que se doren.
Servís los panqueques con durazno y ricota por encima.'),
  ('panqueques-de-ricota-con-arandanos-y-yogur', 'Panqueques de ricota con arándanos y yogur', 20, 1, '{desayuno,merienda}', false, 'Mezclás la ricota con el huevo y la harina hasta obtener una masa espesa.
Calentás una sartén antiadherente con una gota de aceite y cocinás cucharones de masa a fuego medio, 2 minutos por lado, hasta que se doren.
Servís los panqueques con arándanos y yogur por encima.'),
  ('tortitas-de-yogur-con-mantequilla-de-mani-y-banana', 'Tortitas de yogur con mantequilla de maní y banana', 20, 1, '{desayuno,merienda}', false, 'Mezclás la harina con el polvo de hornear; sumás el yogur y el huevo y revolvés hasta integrar.
Calentás una sartén antiadherente con una gota de aceite y cocinás cucharones de masa a fuego medio, 2 minutos por lado, hasta que se doren.
Servís los panqueques con mantequilla de maní y banana por encima.'),
  ('tortitas-de-yogur-con-arandanos-y-yogur', 'Tortitas de yogur con arándanos y yogur', 20, 1, '{desayuno,merienda}', false, 'Mezclás la harina con el polvo de hornear; sumás el yogur y el huevo y revolvés hasta integrar.
Calentás una sartén antiadherente con una gota de aceite y cocinás cucharones de masa a fuego medio, 2 minutos por lado, hasta que se doren.
Servís los panqueques con arándanos y yogur por encima.'),
  ('panqueques-de-avena-con-mantequilla-de-mani-y-banana', 'Panqueques de avena con mantequilla de maní y banana', 20, 1, '{desayuno,merienda}', false, 'Licuás la avena con el huevo y la leche hasta obtener una mezcla lisa; la dejás reposar 5 minutos.
Calentás una sartén antiadherente con una gota de aceite y cocinás cucharones de masa a fuego medio, 2 minutos por lado, hasta que se doren.
Servís los panqueques con mantequilla de maní y banana por encima.'),
  ('panqueques-de-banana-con-mantequilla-de-mani-y-banana', 'Panqueques de banana con mantequilla de maní y banana', 20, 1, '{desayuno,merienda}', false, 'Aplastás la banana, la mezclás con el huevo y la avena hasta obtener una masa espesa.
Calentás una sartén antiadherente con una gota de aceite y cocinás cucharones de masa a fuego medio, 2 minutos por lado, hasta que se doren.
Servís los panqueques con mantequilla de maní y banana por encima.'),
  ('panqueques-de-banana-con-frutillas-y-miel', 'Panqueques de banana con frutillas y miel', 20, 1, '{desayuno,merienda}', false, 'Aplastás la banana, la mezclás con el huevo y la avena hasta obtener una masa espesa.
Calentás una sartén antiadherente con una gota de aceite y cocinás cucharones de masa a fuego medio, 2 minutos por lado, hasta que se doren.
Servís los panqueques con frutillas y miel por encima.'),
  ('panqueques-de-ricota-con-mantequilla-de-mani-y-banana', 'Panqueques de ricota con mantequilla de maní y banana', 20, 1, '{desayuno,merienda}', false, 'Mezclás la ricota con el huevo y la harina hasta obtener una masa espesa.
Calentás una sartén antiadherente con una gota de aceite y cocinás cucharones de masa a fuego medio, 2 minutos por lado, hasta que se doren.
Servís los panqueques con mantequilla de maní y banana por encima.'),
  ('panqueques-de-banana-con-mango-y-coco', 'Panqueques de banana con mango y coco', 20, 1, '{desayuno,merienda}', false, 'Aplastás la banana, la mezclás con el huevo y la avena hasta obtener una masa espesa.
Calentás una sartén antiadherente con una gota de aceite y cocinás cucharones de masa a fuego medio, 2 minutos por lado, hasta que se doren.
Servís los panqueques con mango y coco por encima.'),
  ('tortitas-de-yogur-con-banana-y-dulce-de-leche-light', 'Tortitas de yogur con banana y dulce de leche light', 20, 1, '{desayuno,merienda}', false, 'Mezclás la harina con el polvo de hornear; sumás el yogur y el huevo y revolvés hasta integrar.
Calentás una sartén antiadherente con una gota de aceite y cocinás cucharones de masa a fuego medio, 2 minutos por lado, hasta que se doren.
Servís los panqueques con banana y dulce de leche light por encima.'),
  ('zapallitos-rellenos-de-ricota-y-espinaca', 'Zapallitos rellenos de ricota y espinaca', 50, 1, '{almuerzo,cena}', true, 'Cortás los zapallitos al medio a lo largo, los hervís 5 minutos y los ahuecás con una cuchara; picás la pulpa y la sumás al relleno.
Salteás la espinaca picada 2 minutos, la mezclás con la ricota, el queso rallado, sal y nuez moscada.
Rellenás cada pieza, espolvoreás con queso rallado y un hilo de aceite.
Horneás en una fuente a 200 °C, 25 minutos, hasta que estén tiernas y gratinadas.'),
  ('zapallitos-rellenos-de-lentejas', 'Zapallitos rellenos de lentejas', 50, 1, '{almuerzo,cena}', true, 'Cortás los zapallitos al medio a lo largo, los hervís 5 minutos y los ahuecás con una cuchara; picás la pulpa y la sumás al relleno.
Mezclás las lentejas con la cebolla salteada y el tomate triturado, comino y sal.
Rellenás cada pieza, espolvoreás con queso rallado y un hilo de aceite.
Horneás en una fuente a 200 °C, 25 minutos, hasta que estén tiernas y gratinadas.'),
  ('tomates-rellenos-de-quinoa-y-verduras', 'Tomates rellenos de quinoa y verduras', 45, 1, '{almuerzo,cena}', true, 'Cortás la tapita de los tomates, los ahuecás con una cuchara y reservás la pulpa picada para el relleno.
Mezclás la quinoa con la zanahoria rallada, el choclo y el queso en cubitos.
Rellenás cada pieza, espolvoreás con queso rallado y un hilo de aceite.
Horneás en una fuente a 200 °C, 25 minutos, hasta que estén tiernas y gratinadas.'),
  ('zapallitos-rellenos-de-quinoa-y-verduras', 'Zapallitos rellenos de quinoa y verduras', 50, 1, '{almuerzo,cena}', true, 'Cortás los zapallitos al medio a lo largo, los hervís 5 minutos y los ahuecás con una cuchara; picás la pulpa y la sumás al relleno.
Mezclás la quinoa con la zanahoria rallada, el choclo y el queso en cubitos.
Rellenás cada pieza, espolvoreás con queso rallado y un hilo de aceite.
Horneás en una fuente a 200 °C, 25 minutos, hasta que estén tiernas y gratinadas.'),
  ('cebollas-rellenos-de-carne', 'Cebollas rellenos de carne', 55, 1, '{almuerzo,cena}', true, 'Pelás las cebollas, las hervís 10 minutos y las ahuecás, dejando 2 capas.
Salteás la carne con la cebolla picada hasta que se dore (6 minutos) y sazonás con sal, pimienta y pimentón.
Rellenás cada pieza, espolvoreás con queso rallado y un hilo de aceite.
Horneás en una fuente a 200 °C, 25 minutos, hasta que estén tiernas y gratinadas.'),
  ('berenjenas-rellenos-de-champinones-y-queso', 'Berenjenas rellenos de champiñones y queso', 55, 1, '{almuerzo,cena}', true, 'Cortás las berenjenas al medio, las hervís o asás 10 minutos y ahuecás la pulpa, que picás y sumás al relleno.
Salteás la cebolla y los champiñones picados con el aceite 7 minutos y mezclás con el queso en cubitos.
Rellenás cada pieza, espolvoreás con queso rallado y un hilo de aceite.
Horneás en una fuente a 200 °C, 25 minutos, hasta que estén tiernas y gratinadas.'),
  ('morrones-rellenos-de-pavo-y-verduras', 'Morrones rellenos de pavo y verduras', 47, 1, '{almuerzo,cena}', true, 'Cortás los morrones al medio, sacás las semillas y los hervís 4 minutos.
Salteás el pavo picado con la cebolla y la zanahoria rallada 6 minutos, con sal y pimienta.
Rellenás cada pieza, espolvoreás con queso rallado y un hilo de aceite.
Horneás en una fuente a 200 °C, 25 minutos, hasta que estén tiernas y gratinadas.'),
  ('calabacines-rellenos-de-arroz-y-atun', 'Calabacines rellenos de arroz y atún', 47, 1, '{almuerzo,cena}', true, 'Cortás los calabacines al medio a lo largo y los ahuecás; picás la pulpa para el relleno.
Mezclás el arroz con el atún escurrido y el tomate en cubitos, sal y orégano.
Rellenás cada pieza, espolvoreás con queso rallado y un hilo de aceite.
Horneás en una fuente a 200 °C, 25 minutos, hasta que estén tiernas y gratinadas.'),
  ('papas-rellenos-de-lentejas', 'Papas rellenos de lentejas', 60, 1, '{almuerzo,cena}', true, 'Hervís las papas con cáscara 20 minutos, las cortás al medio y las ahuecás un poco.
Mezclás las lentejas con la cebolla salteada y el tomate triturado, comino y sal.
Rellenás cada pieza, espolvoreás con queso rallado y un hilo de aceite.
Horneás en una fuente a 200 °C, 25 minutos, hasta que estén tiernas y gratinadas.'),
  ('papas-rellenos-de-garbanzos-y-verduras', 'Papas rellenos de garbanzos y verduras', 60, 1, '{almuerzo,cena}', true, 'Hervís las papas con cáscara 20 minutos, las cortás al medio y las ahuecás un poco.
Mezclás los garbanzos con la cebolla y la zanahoria salteadas y el tomate triturado, con comino y sal.
Rellenás cada pieza, espolvoreás con queso rallado y un hilo de aceite.
Horneás en una fuente a 200 °C, 25 minutos, hasta que estén tiernas y gratinadas.'),
  ('cebollas-rellenos-de-pavo-y-verduras', 'Cebollas rellenos de pavo y verduras', 55, 1, '{almuerzo,cena}', true, 'Pelás las cebollas, las hervís 10 minutos y las ahuecás, dejando 2 capas.
Salteás el pavo picado con la cebolla y la zanahoria rallada 6 minutos, con sal y pimienta.
Rellenás cada pieza, espolvoreás con queso rallado y un hilo de aceite.
Horneás en una fuente a 200 °C, 25 minutos, hasta que estén tiernas y gratinadas.'),
  ('morrones-rellenos-de-carne', 'Morrones rellenos de carne', 47, 1, '{almuerzo,cena}', true, 'Cortás los morrones al medio, sacás las semillas y los hervís 4 minutos.
Salteás la carne con la cebolla picada hasta que se dore (6 minutos) y sazonás con sal, pimienta y pimentón.
Rellenás cada pieza, espolvoreás con queso rallado y un hilo de aceite.
Horneás en una fuente a 200 °C, 25 minutos, hasta que estén tiernas y gratinadas.'),
  ('morrones-rellenos-de-lentejas', 'Morrones rellenos de lentejas', 47, 1, '{almuerzo,cena}', true, 'Cortás los morrones al medio, sacás las semillas y los hervís 4 minutos.
Mezclás las lentejas con la cebolla salteada y el tomate triturado, comino y sal.
Rellenás cada pieza, espolvoreás con queso rallado y un hilo de aceite.
Horneás en una fuente a 200 °C, 25 minutos, hasta que estén tiernas y gratinadas.'),
  ('cebollas-rellenos-de-lentejas', 'Cebollas rellenos de lentejas', 55, 1, '{almuerzo,cena}', true, 'Pelás las cebollas, las hervís 10 minutos y las ahuecás, dejando 2 capas.
Mezclás las lentejas con la cebolla salteada y el tomate triturado, comino y sal.
Rellenás cada pieza, espolvoreás con queso rallado y un hilo de aceite.
Horneás en una fuente a 200 °C, 25 minutos, hasta que estén tiernas y gratinadas.'),
  ('zapallitos-rellenos-de-arroz-y-atun', 'Zapallitos rellenos de arroz y atún', 50, 1, '{almuerzo,cena}', true, 'Cortás los zapallitos al medio a lo largo, los hervís 5 minutos y los ahuecás con una cuchara; picás la pulpa y la sumás al relleno.
Mezclás el arroz con el atún escurrido y el tomate en cubitos, sal y orégano.
Rellenás cada pieza, espolvoreás con queso rallado y un hilo de aceite.
Horneás en una fuente a 200 °C, 25 minutos, hasta que estén tiernas y gratinadas.'),
  ('cebollas-rellenos-de-ricota-y-espinaca', 'Cebollas rellenos de ricota y espinaca', 55, 1, '{almuerzo,cena}', true, 'Pelás las cebollas, las hervís 10 minutos y las ahuecás, dejando 2 capas.
Salteás la espinaca picada 2 minutos, la mezclás con la ricota, el queso rallado, sal y nuez moscada.
Rellenás cada pieza, espolvoreás con queso rallado y un hilo de aceite.
Horneás en una fuente a 200 °C, 25 minutos, hasta que estén tiernas y gratinadas.'),
  ('papas-rellenos-de-pavo-y-verduras', 'Papas rellenos de pavo y verduras', 60, 1, '{almuerzo,cena}', true, 'Hervís las papas con cáscara 20 minutos, las cortás al medio y las ahuecás un poco.
Salteás el pavo picado con la cebolla y la zanahoria rallada 6 minutos, con sal y pimienta.
Rellenás cada pieza, espolvoreás con queso rallado y un hilo de aceite.
Horneás en una fuente a 200 °C, 25 minutos, hasta que estén tiernas y gratinadas.'),
  ('berenjenas-rellenos-de-quinoa-y-verduras', 'Berenjenas rellenos de quinoa y verduras', 55, 1, '{almuerzo,cena}', true, 'Cortás las berenjenas al medio, las hervís o asás 10 minutos y ahuecás la pulpa, que picás y sumás al relleno.
Mezclás la quinoa con la zanahoria rallada, el choclo y el queso en cubitos.
Rellenás cada pieza, espolvoreás con queso rallado y un hilo de aceite.
Horneás en una fuente a 200 °C, 25 minutos, hasta que estén tiernas y gratinadas.'),
  ('berenjenas-rellenos-de-jamon-y-queso', 'Berenjenas rellenos de jamón y queso', 55, 1, '{almuerzo,cena}', true, 'Cortás las berenjenas al medio, las hervís o asás 10 minutos y ahuecás la pulpa, que picás y sumás al relleno.
Mezclás el jamón picado y el queso en cubitos con la salsa blanca.
Rellenás cada pieza, espolvoreás con queso rallado y un hilo de aceite.
Horneás en una fuente a 200 °C, 25 minutos, hasta que estén tiernas y gratinadas.'),
  ('zapallitos-rellenos-de-carne', 'Zapallitos rellenos de carne', 50, 1, '{almuerzo,cena}', true, 'Cortás los zapallitos al medio a lo largo, los hervís 5 minutos y los ahuecás con una cuchara; picás la pulpa y la sumás al relleno.
Salteás la carne con la cebolla picada hasta que se dore (6 minutos) y sazonás con sal, pimienta y pimentón.
Rellenás cada pieza, espolvoreás con queso rallado y un hilo de aceite.
Horneás en una fuente a 200 °C, 25 minutos, hasta que estén tiernas y gratinadas.'),
  ('morrones-rellenos-de-ricota-y-espinaca', 'Morrones rellenos de ricota y espinaca', 47, 1, '{almuerzo,cena}', true, 'Cortás los morrones al medio, sacás las semillas y los hervís 4 minutos.
Salteás la espinaca picada 2 minutos, la mezclás con la ricota, el queso rallado, sal y nuez moscada.
Rellenás cada pieza, espolvoreás con queso rallado y un hilo de aceite.
Horneás en una fuente a 200 °C, 25 minutos, hasta que estén tiernas y gratinadas.'),
  ('calabacines-rellenos-de-lentejas', 'Calabacines rellenos de lentejas', 47, 1, '{almuerzo,cena}', true, 'Cortás los calabacines al medio a lo largo y los ahuecás; picás la pulpa para el relleno.
Mezclás las lentejas con la cebolla salteada y el tomate triturado, comino y sal.
Rellenás cada pieza, espolvoreás con queso rallado y un hilo de aceite.
Horneás en una fuente a 200 °C, 25 minutos, hasta que estén tiernas y gratinadas.'),
  ('hongos-portobello-rellenos-de-quinoa-y-verduras', 'Hongos portobello rellenos de quinoa y verduras', 43, 1, '{almuerzo,cena}', true, 'Sacás el tallo a los hongos grandes y los picás para el relleno.
Mezclás la quinoa con la zanahoria rallada, el choclo y el queso en cubitos.
Rellenás cada pieza, espolvoreás con queso rallado y un hilo de aceite.
Horneás en una fuente a 200 °C, 25 minutos, hasta que estén tiernas y gratinadas.'),
  ('tomates-rellenos-de-ricota-y-espinaca', 'Tomates rellenos de ricota y espinaca', 45, 1, '{almuerzo,cena}', true, 'Cortás la tapita de los tomates, los ahuecás con una cuchara y reservás la pulpa picada para el relleno.
Salteás la espinaca picada 2 minutos, la mezclás con la ricota, el queso rallado, sal y nuez moscada.
Rellenás cada pieza, espolvoreás con queso rallado y un hilo de aceite.
Horneás en una fuente a 200 °C, 25 minutos, hasta que estén tiernas y gratinadas.'),
  ('cebollas-rellenos-de-quinoa-y-verduras', 'Cebollas rellenos de quinoa y verduras', 55, 1, '{almuerzo,cena}', true, 'Pelás las cebollas, las hervís 10 minutos y las ahuecás, dejando 2 capas.
Mezclás la quinoa con la zanahoria rallada, el choclo y el queso en cubitos.
Rellenás cada pieza, espolvoreás con queso rallado y un hilo de aceite.
Horneás en una fuente a 200 °C, 25 minutos, hasta que estén tiernas y gratinadas.'),
  ('tomates-rellenos-de-carne', 'Tomates rellenos de carne', 45, 1, '{almuerzo,cena}', true, 'Cortás la tapita de los tomates, los ahuecás con una cuchara y reservás la pulpa picada para el relleno.
Salteás la carne con la cebolla picada hasta que se dore (6 minutos) y sazonás con sal, pimienta y pimentón.
Rellenás cada pieza, espolvoreás con queso rallado y un hilo de aceite.
Horneás en una fuente a 200 °C, 25 minutos, hasta que estén tiernas y gratinadas.'),
  ('papas-rellenos-de-champinones-y-queso', 'Papas rellenos de champiñones y queso', 60, 1, '{almuerzo,cena}', true, 'Hervís las papas con cáscara 20 minutos, las cortás al medio y las ahuecás un poco.
Salteás la cebolla y los champiñones picados con el aceite 7 minutos y mezclás con el queso en cubitos.
Rellenás cada pieza, espolvoreás con queso rallado y un hilo de aceite.
Horneás en una fuente a 200 °C, 25 minutos, hasta que estén tiernas y gratinadas.'),
  ('calabacines-rellenos-de-carne', 'Calabacines rellenos de carne', 47, 1, '{almuerzo,cena}', true, 'Cortás los calabacines al medio a lo largo y los ahuecás; picás la pulpa para el relleno.
Salteás la carne con la cebolla picada hasta que se dore (6 minutos) y sazonás con sal, pimienta y pimentón.
Rellenás cada pieza, espolvoreás con queso rallado y un hilo de aceite.
Horneás en una fuente a 200 °C, 25 minutos, hasta que estén tiernas y gratinadas.'),
  ('berenjenas-rellenos-de-lentejas', 'Berenjenas rellenos de lentejas', 55, 1, '{almuerzo,cena}', true, 'Cortás las berenjenas al medio, las hervís o asás 10 minutos y ahuecás la pulpa, que picás y sumás al relleno.
Mezclás las lentejas con la cebolla salteada y el tomate triturado, comino y sal.
Rellenás cada pieza, espolvoreás con queso rallado y un hilo de aceite.
Horneás en una fuente a 200 °C, 25 minutos, hasta que estén tiernas y gratinadas.'),
  ('zapallitos-rellenos-de-champinones-y-queso', 'Zapallitos rellenos de champiñones y queso', 50, 1, '{almuerzo,cena}', true, 'Cortás los zapallitos al medio a lo largo, los hervís 5 minutos y los ahuecás con una cuchara; picás la pulpa y la sumás al relleno.
Salteás la cebolla y los champiñones picados con el aceite 7 minutos y mezclás con el queso en cubitos.
Rellenás cada pieza, espolvoreás con queso rallado y un hilo de aceite.
Horneás en una fuente a 200 °C, 25 minutos, hasta que estén tiernas y gratinadas.'),
  ('calabacines-rellenos-de-pavo-y-verduras', 'Calabacines rellenos de pavo y verduras', 47, 1, '{almuerzo,cena}', true, 'Cortás los calabacines al medio a lo largo y los ahuecás; picás la pulpa para el relleno.
Salteás el pavo picado con la cebolla y la zanahoria rallada 6 minutos, con sal y pimienta.
Rellenás cada pieza, espolvoreás con queso rallado y un hilo de aceite.
Horneás en una fuente a 200 °C, 25 minutos, hasta que estén tiernas y gratinadas.'),
  ('berenjenas-rellenos-de-garbanzos-y-verduras', 'Berenjenas rellenos de garbanzos y verduras', 55, 1, '{almuerzo,cena}', true, 'Cortás las berenjenas al medio, las hervís o asás 10 minutos y ahuecás la pulpa, que picás y sumás al relleno.
Mezclás los garbanzos con la cebolla y la zanahoria salteadas y el tomate triturado, con comino y sal.
Rellenás cada pieza, espolvoreás con queso rallado y un hilo de aceite.
Horneás en una fuente a 200 °C, 25 minutos, hasta que estén tiernas y gratinadas.'),
  ('berenjenas-rellenos-de-pavo-y-verduras', 'Berenjenas rellenos de pavo y verduras', 55, 1, '{almuerzo,cena}', true, 'Cortás las berenjenas al medio, las hervís o asás 10 minutos y ahuecás la pulpa, que picás y sumás al relleno.
Salteás el pavo picado con la cebolla y la zanahoria rallada 6 minutos, con sal y pimienta.
Rellenás cada pieza, espolvoreás con queso rallado y un hilo de aceite.
Horneás en una fuente a 200 °C, 25 minutos, hasta que estén tiernas y gratinadas.'),
  ('calabacines-rellenos-de-pollo-y-queso', 'Calabacines rellenos de pollo y queso', 47, 1, '{almuerzo,cena}', true, 'Cortás los calabacines al medio a lo largo y los ahuecás; picás la pulpa para el relleno.
Salteás el pollo picado con la cebolla 6 minutos y mezclás con el queso en cubitos.
Rellenás cada pieza, espolvoreás con queso rallado y un hilo de aceite.
Horneás en una fuente a 200 °C, 25 minutos, hasta que estén tiernas y gratinadas.'),
  ('cebollas-rellenos-de-arroz-y-atun', 'Cebollas rellenos de arroz y atún', 55, 1, '{almuerzo,cena}', true, 'Pelás las cebollas, las hervís 10 minutos y las ahuecás, dejando 2 capas.
Mezclás el arroz con el atún escurrido y el tomate en cubitos, sal y orégano.
Rellenás cada pieza, espolvoreás con queso rallado y un hilo de aceite.
Horneás en una fuente a 200 °C, 25 minutos, hasta que estén tiernas y gratinadas.'),
  ('cebollas-rellenos-de-champinones-y-queso', 'Cebollas rellenos de champiñones y queso', 55, 1, '{almuerzo,cena}', true, 'Pelás las cebollas, las hervís 10 minutos y las ahuecás, dejando 2 capas.
Salteás la cebolla y los champiñones picados con el aceite 7 minutos y mezclás con el queso en cubitos.
Rellenás cada pieza, espolvoreás con queso rallado y un hilo de aceite.
Horneás en una fuente a 200 °C, 25 minutos, hasta que estén tiernas y gratinadas.'),
  ('morrones-rellenos-de-champinones-y-queso', 'Morrones rellenos de champiñones y queso', 47, 1, '{almuerzo,cena}', true, 'Cortás los morrones al medio, sacás las semillas y los hervís 4 minutos.
Salteás la cebolla y los champiñones picados con el aceite 7 minutos y mezclás con el queso en cubitos.
Rellenás cada pieza, espolvoreás con queso rallado y un hilo de aceite.
Horneás en una fuente a 200 °C, 25 minutos, hasta que estén tiernas y gratinadas.')
on conflict (slug) do nothing;

insert into public.recipe_items (recipe_id, food_id, qty)
select r.id, f.id, v.qty from (values
  ('bowl-de-quinoa-garbanzos-y-kale-mango-y-cebolla-morada', 'quinoa-hervida', 150),
  ('bowl-de-quinoa-garbanzos-y-kale-mango-y-cebolla-morada', 'garbanzos-hervidos', 120),
  ('bowl-de-quinoa-garbanzos-y-kale-mango-y-cebolla-morada', 'aceite', 4),
  ('bowl-de-quinoa-garbanzos-y-kale-mango-y-cebolla-morada', 'kale', 40),
  ('bowl-de-quinoa-garbanzos-y-kale-mango-y-cebolla-morada', 'mango', 50),
  ('bowl-de-quinoa-garbanzos-y-kale-mango-y-cebolla-morada', 'cebolla-morada', 0.5),
  ('bowl-de-quinoa-garbanzos-y-kale-mango-y-cebolla-morada', 'pesto', 15),
  ('bowl-de-quinoa-pollo-y-kale-mango-y-cebolla-morada', 'quinoa-hervida', 150),
  ('bowl-de-quinoa-pollo-y-kale-mango-y-cebolla-morada', 'pechuga-pollo', 110),
  ('bowl-de-quinoa-pollo-y-kale-mango-y-cebolla-morada', 'kale', 40),
  ('bowl-de-quinoa-pollo-y-kale-mango-y-cebolla-morada', 'mango', 50),
  ('bowl-de-quinoa-pollo-y-kale-mango-y-cebolla-morada', 'cebolla-morada', 0.5),
  ('bowl-de-quinoa-pollo-y-kale-mango-y-cebolla-morada', 'yogur-natural', 50),
  ('bowl-de-quinoa-pollo-y-kale-mango-y-cebolla-morada', 'menta', 2),
  ('bowl-de-quinoa-pollo-y-kale-mango-y-cebolla-morada', 'limon-exprimido', 5),
  ('bowl-de-burgol-langostinos-y-palta-pepino-y-zanahoria', 'burgol-hervido', 150),
  ('bowl-de-burgol-langostinos-y-palta-pepino-y-zanahoria', 'langostinos', 110),
  ('bowl-de-burgol-langostinos-y-palta-pepino-y-zanahoria', 'ajo', 0.5),
  ('bowl-de-burgol-langostinos-y-palta-pepino-y-zanahoria', 'aceite', 4),
  ('bowl-de-burgol-langostinos-y-palta-pepino-y-zanahoria', 'palta', 0.5),
  ('bowl-de-burgol-langostinos-y-palta-pepino-y-zanahoria', 'pepino', 0.5),
  ('bowl-de-burgol-langostinos-y-palta-pepino-y-zanahoria', 'zanahoria-rallada', 50),
  ('bowl-de-burgol-langostinos-y-palta-pepino-y-zanahoria', 'pesto', 15),
  ('bowl-de-batata-asada-huevo-y-kale-mango-y-cebolla-morada', 'batata', 180),
  ('bowl-de-batata-asada-huevo-y-kale-mango-y-cebolla-morada', 'aceite', 5),
  ('bowl-de-batata-asada-huevo-y-kale-mango-y-cebolla-morada', 'huevo', 2),
  ('bowl-de-batata-asada-huevo-y-kale-mango-y-cebolla-morada', 'kale', 40),
  ('bowl-de-batata-asada-huevo-y-kale-mango-y-cebolla-morada', 'mango', 50),
  ('bowl-de-batata-asada-huevo-y-kale-mango-y-cebolla-morada', 'cebolla-morada', 0.5),
  ('bowl-de-batata-asada-huevo-y-kale-mango-y-cebolla-morada', 'guacamole', 40),
  ('bowl-de-batata-asada-huevo-y-espinaca-remolacha-y', 'batata', 180),
  ('bowl-de-batata-asada-huevo-y-espinaca-remolacha-y', 'aceite', 5),
  ('bowl-de-batata-asada-huevo-y-espinaca-remolacha-y', 'huevo', 2),
  ('bowl-de-batata-asada-huevo-y-espinaca-remolacha-y', 'espinaca', 40),
  ('bowl-de-batata-asada-huevo-y-espinaca-remolacha-y', 'remolacha-cocida', 60),
  ('bowl-de-batata-asada-huevo-y-espinaca-remolacha-y', 'semillas-girasol', 8),
  ('bowl-de-batata-asada-huevo-y-espinaca-remolacha-y', 'pesto', 15),
  ('bowl-de-arroz-integral-salmon-y-kale-mango-y-cebolla', 'arroz-integral-hervido', 150),
  ('bowl-de-arroz-integral-salmon-y-kale-mango-y-cebolla', 'salmon', 110),
  ('bowl-de-arroz-integral-salmon-y-kale-mango-y-cebolla', 'kale', 40),
  ('bowl-de-arroz-integral-salmon-y-kale-mango-y-cebolla', 'mango', 50),
  ('bowl-de-arroz-integral-salmon-y-kale-mango-y-cebolla', 'cebolla-morada', 0.5),
  ('bowl-de-arroz-integral-salmon-y-kale-mango-y-cebolla', 'salsa-soja', 10),
  ('bowl-de-arroz-integral-salmon-y-kale-mango-y-cebolla', 'jengibre', 2),
  ('bowl-de-arroz-integral-salmon-y-kale-mango-y-cebolla', 'aceite-sesamo', 4),
  ('bowl-de-burgol-lentejas-y-palta-pepino-y-zanahoria', 'burgol-hervido', 150),
  ('bowl-de-burgol-lentejas-y-palta-pepino-y-zanahoria', 'lentejas-hervidas', 130),
  ('bowl-de-burgol-lentejas-y-palta-pepino-y-zanahoria', 'palta', 0.5),
  ('bowl-de-burgol-lentejas-y-palta-pepino-y-zanahoria', 'pepino', 0.5),
  ('bowl-de-burgol-lentejas-y-palta-pepino-y-zanahoria', 'zanahoria-rallada', 50),
  ('bowl-de-burgol-lentejas-y-palta-pepino-y-zanahoria', 'salsa-soja', 10),
  ('bowl-de-burgol-lentejas-y-palta-pepino-y-zanahoria', 'jengibre', 2),
  ('bowl-de-burgol-lentejas-y-palta-pepino-y-zanahoria', 'aceite-sesamo', 4),
  ('bowl-de-fideos-de-arroz-salmon-y-palta-pepino-y', 'fideos-arroz-hervidos', 150),
  ('bowl-de-fideos-de-arroz-salmon-y-palta-pepino-y', 'salmon', 110),
  ('bowl-de-fideos-de-arroz-salmon-y-palta-pepino-y', 'palta', 0.5),
  ('bowl-de-fideos-de-arroz-salmon-y-palta-pepino-y', 'pepino', 0.5),
  ('bowl-de-fideos-de-arroz-salmon-y-palta-pepino-y', 'zanahoria-rallada', 50),
  ('bowl-de-fideos-de-arroz-salmon-y-palta-pepino-y', 'pesto', 15),
  ('bowl-de-burgol-garbanzos-y-repollo-colorado-edamame-y', 'burgol-hervido', 150),
  ('bowl-de-burgol-garbanzos-y-repollo-colorado-edamame-y', 'garbanzos-hervidos', 120),
  ('bowl-de-burgol-garbanzos-y-repollo-colorado-edamame-y', 'aceite', 4),
  ('bowl-de-burgol-garbanzos-y-repollo-colorado-edamame-y', 'repollo-colorado', 50),
  ('bowl-de-burgol-garbanzos-y-repollo-colorado-edamame-y', 'edamame', 50),
  ('bowl-de-burgol-garbanzos-y-repollo-colorado-edamame-y', 'zanahoria-rallada', 40),
  ('bowl-de-burgol-garbanzos-y-repollo-colorado-edamame-y', 'salsa-soja', 10),
  ('bowl-de-burgol-garbanzos-y-repollo-colorado-edamame-y', 'jengibre', 2),
  ('bowl-de-burgol-garbanzos-y-repollo-colorado-edamame-y', 'aceite-sesamo', 4),
  ('avena-en-frio-overnight-con-manzana-y-cacao', 'avena', 40),
  ('avena-en-frio-overnight-con-manzana-y-cacao', 'yogur-natural', 80),
  ('avena-en-frio-overnight-con-manzana-y-cacao', 'leche', 80),
  ('avena-en-frio-overnight-con-manzana-y-cacao', 'chia', 5),
  ('avena-en-frio-overnight-con-manzana-y-cacao', 'manzana', 1),
  ('avena-en-frio-overnight-con-manzana-y-cacao', 'cacao-amargo', 5),
  ('avena-en-frio-overnight-con-arandanos-y-coco-rallado', 'avena', 40),
  ('avena-en-frio-overnight-con-arandanos-y-coco-rallado', 'yogur-natural', 80),
  ('avena-en-frio-overnight-con-arandanos-y-coco-rallado', 'leche', 80),
  ('avena-en-frio-overnight-con-arandanos-y-coco-rallado', 'chia', 5),
  ('avena-en-frio-overnight-con-arandanos-y-coco-rallado', 'arandanos', 80),
  ('avena-en-frio-overnight-con-arandanos-y-coco-rallado', 'coco-rallado', 8),
  ('avena-en-frio-overnight-con-kiwi-y-semillas-de-girasol', 'avena', 40),
  ('avena-en-frio-overnight-con-kiwi-y-semillas-de-girasol', 'yogur-natural', 80),
  ('avena-en-frio-overnight-con-kiwi-y-semillas-de-girasol', 'leche', 80),
  ('avena-en-frio-overnight-con-kiwi-y-semillas-de-girasol', 'chia', 5),
  ('avena-en-frio-overnight-con-kiwi-y-semillas-de-girasol', 'kiwi', 1.5),
  ('avena-en-frio-overnight-con-kiwi-y-semillas-de-girasol', 'semillas-girasol', 10),
  ('avena-con-cacao-con-kiwi-y-pasas-de-uva', 'avena', 40),
  ('avena-con-cacao-con-kiwi-y-pasas-de-uva', 'leche', 180),
  ('avena-con-cacao-con-kiwi-y-pasas-de-uva', 'cacao-amargo', 6),
  ('avena-con-cacao-con-kiwi-y-pasas-de-uva', 'kiwi', 1.5),
  ('avena-con-cacao-con-kiwi-y-pasas-de-uva', 'pasas', 15),
  ('avena-cocida-con-frambuesas-y-almendras', 'avena', 40),
  ('avena-cocida-con-frambuesas-y-almendras', 'leche', 180),
  ('avena-cocida-con-frambuesas-y-almendras', 'frambuesa', 80),
  ('avena-cocida-con-frambuesas-y-almendras', 'almendras', 10),
  ('avena-con-cacao-con-manzana-y-semillas-de-girasol', 'avena', 40),
  ('avena-con-cacao-con-manzana-y-semillas-de-girasol', 'leche', 180),
  ('avena-con-cacao-con-manzana-y-semillas-de-girasol', 'cacao-amargo', 6),
  ('avena-con-cacao-con-manzana-y-semillas-de-girasol', 'manzana', 1),
  ('avena-con-cacao-con-manzana-y-semillas-de-girasol', 'semillas-girasol', 10),
  ('avena-con-cacao-con-arandanos-y-pasas-de-uva', 'avena', 40),
  ('avena-con-cacao-con-arandanos-y-pasas-de-uva', 'leche', 180),
  ('avena-con-cacao-con-arandanos-y-pasas-de-uva', 'cacao-amargo', 6),
  ('avena-con-cacao-con-arandanos-y-pasas-de-uva', 'arandanos', 80),
  ('avena-con-cacao-con-arandanos-y-pasas-de-uva', 'pasas', 15),
  ('avena-con-cacao-con-pera-y-almendras', 'avena', 40),
  ('avena-con-cacao-con-pera-y-almendras', 'leche', 180),
  ('avena-con-cacao-con-pera-y-almendras', 'cacao-amargo', 6),
  ('avena-con-cacao-con-pera-y-almendras', 'pera', 1),
  ('avena-con-cacao-con-pera-y-almendras', 'almendras', 10),
  ('avena-cocida-con-durazno-y-miel', 'avena', 40),
  ('avena-cocida-con-durazno-y-miel', 'leche', 180),
  ('avena-cocida-con-durazno-y-miel', 'durazno', 1),
  ('avena-cocida-con-durazno-y-miel', 'miel', 10),
  ('avena-en-frio-overnight-con-manzana-y-coco-rallado', 'avena', 40),
  ('avena-en-frio-overnight-con-manzana-y-coco-rallado', 'yogur-natural', 80),
  ('avena-en-frio-overnight-con-manzana-y-coco-rallado', 'leche', 80),
  ('avena-en-frio-overnight-con-manzana-y-coco-rallado', 'chia', 5),
  ('avena-en-frio-overnight-con-manzana-y-coco-rallado', 'manzana', 1),
  ('avena-en-frio-overnight-con-manzana-y-coco-rallado', 'coco-rallado', 8),
  ('avena-cocida-con-frambuesas-y-cacao', 'avena', 40),
  ('avena-cocida-con-frambuesas-y-cacao', 'leche', 180),
  ('avena-cocida-con-frambuesas-y-cacao', 'frambuesa', 80),
  ('avena-cocida-con-frambuesas-y-cacao', 'cacao-amargo', 5),
  ('avena-cocida-con-manzana-y-semillas-de-girasol', 'avena', 40),
  ('avena-cocida-con-manzana-y-semillas-de-girasol', 'leche', 180),
  ('avena-cocida-con-manzana-y-semillas-de-girasol', 'manzana', 1),
  ('avena-cocida-con-manzana-y-semillas-de-girasol', 'semillas-girasol', 10),
  ('avena-con-yogur-griego-con-durazno-y-cacao', 'avena', 35),
  ('avena-con-yogur-griego-con-durazno-y-cacao', 'yogur-griego', 120),
  ('avena-con-yogur-griego-con-durazno-y-cacao', 'leche', 40),
  ('avena-con-yogur-griego-con-durazno-y-cacao', 'durazno', 1),
  ('avena-con-yogur-griego-con-durazno-y-cacao', 'cacao-amargo', 5),
  ('avena-en-frio-overnight-con-banana-y-cacao', 'avena', 40),
  ('avena-en-frio-overnight-con-banana-y-cacao', 'yogur-natural', 80),
  ('avena-en-frio-overnight-con-banana-y-cacao', 'leche', 80),
  ('avena-en-frio-overnight-con-banana-y-cacao', 'chia', 5),
  ('avena-en-frio-overnight-con-banana-y-cacao', 'banana', 1),
  ('avena-en-frio-overnight-con-banana-y-cacao', 'cacao-amargo', 5),
  ('avena-en-frio-overnight-con-pera-y-semillas-de-girasol', 'avena', 40),
  ('avena-en-frio-overnight-con-pera-y-semillas-de-girasol', 'yogur-natural', 80),
  ('avena-en-frio-overnight-con-pera-y-semillas-de-girasol', 'leche', 80),
  ('avena-en-frio-overnight-con-pera-y-semillas-de-girasol', 'chia', 5),
  ('avena-en-frio-overnight-con-pera-y-semillas-de-girasol', 'pera', 1),
  ('avena-en-frio-overnight-con-pera-y-semillas-de-girasol', 'semillas-girasol', 10),
  ('avena-cocida-con-banana-y-miel', 'avena', 40),
  ('avena-cocida-con-banana-y-miel', 'leche', 180),
  ('avena-cocida-con-banana-y-miel', 'banana', 1),
  ('avena-cocida-con-banana-y-miel', 'miel', 10),
  ('avena-con-cacao-con-frambuesas-y-almendras', 'avena', 40),
  ('avena-con-cacao-con-frambuesas-y-almendras', 'leche', 180),
  ('avena-con-cacao-con-frambuesas-y-almendras', 'cacao-amargo', 6),
  ('avena-con-cacao-con-frambuesas-y-almendras', 'frambuesa', 80),
  ('avena-con-cacao-con-frambuesas-y-almendras', 'almendras', 10),
  ('avena-en-frio-overnight-con-pera-y-miel', 'avena', 40),
  ('avena-en-frio-overnight-con-pera-y-miel', 'yogur-natural', 80),
  ('avena-en-frio-overnight-con-pera-y-miel', 'leche', 80),
  ('avena-en-frio-overnight-con-pera-y-miel', 'chia', 5),
  ('avena-en-frio-overnight-con-pera-y-miel', 'pera', 1),
  ('avena-en-frio-overnight-con-pera-y-miel', 'miel', 10),
  ('avena-con-yogur-griego-con-arandanos-y-pasas-de-uva', 'avena', 35),
  ('avena-con-yogur-griego-con-arandanos-y-pasas-de-uva', 'yogur-griego', 120),
  ('avena-con-yogur-griego-con-arandanos-y-pasas-de-uva', 'leche', 40),
  ('avena-con-yogur-griego-con-arandanos-y-pasas-de-uva', 'arandanos', 80),
  ('avena-con-yogur-griego-con-arandanos-y-pasas-de-uva', 'pasas', 15),
  ('avena-con-yogur-griego-con-manzana-y-almendras', 'avena', 35),
  ('avena-con-yogur-griego-con-manzana-y-almendras', 'yogur-griego', 120),
  ('avena-con-yogur-griego-con-manzana-y-almendras', 'leche', 40),
  ('avena-con-yogur-griego-con-manzana-y-almendras', 'manzana', 1),
  ('avena-con-yogur-griego-con-manzana-y-almendras', 'almendras', 10),
  ('avena-cocida-con-arandanos-y-nueces', 'avena', 40),
  ('avena-cocida-con-arandanos-y-nueces', 'leche', 180),
  ('avena-cocida-con-arandanos-y-nueces', 'arandanos', 80),
  ('avena-cocida-con-arandanos-y-nueces', 'nueces', 10),
  ('avena-cocida-con-banana-y-almendras', 'avena', 40),
  ('avena-cocida-con-banana-y-almendras', 'leche', 180),
  ('avena-cocida-con-banana-y-almendras', 'banana', 1),
  ('avena-cocida-con-banana-y-almendras', 'almendras', 10),
  ('avena-con-yogur-griego-con-mango-y-almendras', 'avena', 35),
  ('avena-con-yogur-griego-con-mango-y-almendras', 'yogur-griego', 120),
  ('avena-con-yogur-griego-con-mango-y-almendras', 'leche', 40),
  ('avena-con-yogur-griego-con-mango-y-almendras', 'mango', 100),
  ('avena-con-yogur-griego-con-mango-y-almendras', 'almendras', 10),
  ('avena-con-yogur-griego-con-pera-y-semillas-de-girasol', 'avena', 35),
  ('avena-con-yogur-griego-con-pera-y-semillas-de-girasol', 'yogur-griego', 120),
  ('avena-con-yogur-griego-con-pera-y-semillas-de-girasol', 'leche', 40),
  ('avena-con-yogur-griego-con-pera-y-semillas-de-girasol', 'pera', 1),
  ('avena-con-yogur-griego-con-pera-y-semillas-de-girasol', 'semillas-girasol', 10),
  ('avena-con-cacao-con-pera-y-cacao', 'avena', 40),
  ('avena-con-cacao-con-pera-y-cacao', 'leche', 180),
  ('avena-con-cacao-con-pera-y-cacao', 'cacao-amargo', 11),
  ('avena-con-cacao-con-pera-y-cacao', 'pera', 1),
  ('avena-con-yogur-griego-con-banana-y-semillas-de-girasol', 'avena', 35),
  ('avena-con-yogur-griego-con-banana-y-semillas-de-girasol', 'yogur-griego', 120),
  ('avena-con-yogur-griego-con-banana-y-semillas-de-girasol', 'leche', 40),
  ('avena-con-yogur-griego-con-banana-y-semillas-de-girasol', 'banana', 1),
  ('avena-con-yogur-griego-con-banana-y-semillas-de-girasol', 'semillas-girasol', 10),
  ('avena-con-yogur-griego-con-frutilla-y-semillas-de-chia', 'avena', 35),
  ('avena-con-yogur-griego-con-frutilla-y-semillas-de-chia', 'yogur-griego', 120),
  ('avena-con-yogur-griego-con-frutilla-y-semillas-de-chia', 'leche', 40),
  ('avena-con-yogur-griego-con-frutilla-y-semillas-de-chia', 'frutilla', 100),
  ('avena-con-yogur-griego-con-frutilla-y-semillas-de-chia', 'chia', 8),
  ('avena-cocida-con-durazno-y-nueces', 'avena', 40),
  ('avena-cocida-con-durazno-y-nueces', 'leche', 180),
  ('avena-cocida-con-durazno-y-nueces', 'durazno', 1),
  ('avena-cocida-con-durazno-y-nueces', 'nueces', 10),
  ('avena-con-yogur-griego-con-pera-y-coco-rallado', 'avena', 35),
  ('avena-con-yogur-griego-con-pera-y-coco-rallado', 'yogur-griego', 120),
  ('avena-con-yogur-griego-con-pera-y-coco-rallado', 'leche', 40),
  ('avena-con-yogur-griego-con-pera-y-coco-rallado', 'pera', 1),
  ('avena-con-yogur-griego-con-pera-y-coco-rallado', 'coco-rallado', 8),
  ('avena-con-yogur-griego-con-arandanos-y-miel', 'avena', 35),
  ('avena-con-yogur-griego-con-arandanos-y-miel', 'yogur-griego', 120),
  ('avena-con-yogur-griego-con-arandanos-y-miel', 'leche', 40),
  ('avena-con-yogur-griego-con-arandanos-y-miel', 'arandanos', 80),
  ('avena-con-yogur-griego-con-arandanos-y-miel', 'miel', 10),
  ('avena-en-frio-overnight-con-arandanos-y-semillas-de', 'avena', 40),
  ('avena-en-frio-overnight-con-arandanos-y-semillas-de', 'yogur-natural', 80),
  ('avena-en-frio-overnight-con-arandanos-y-semillas-de', 'leche', 80),
  ('avena-en-frio-overnight-con-arandanos-y-semillas-de', 'chia', 5),
  ('avena-en-frio-overnight-con-arandanos-y-semillas-de', 'arandanos', 80),
  ('avena-en-frio-overnight-con-arandanos-y-semillas-de', 'semillas-girasol', 10),
  ('avena-en-frio-overnight-con-banana-y-semillas-de-chia', 'avena', 40),
  ('avena-en-frio-overnight-con-banana-y-semillas-de-chia', 'yogur-natural', 80),
  ('avena-en-frio-overnight-con-banana-y-semillas-de-chia', 'leche', 80),
  ('avena-en-frio-overnight-con-banana-y-semillas-de-chia', 'chia', 15),
  ('avena-en-frio-overnight-con-banana-y-semillas-de-chia', 'banana', 1),
  ('avena-en-frio-overnight-con-pera-y-pasas-de-uva', 'avena', 40),
  ('avena-en-frio-overnight-con-pera-y-pasas-de-uva', 'yogur-natural', 80),
  ('avena-en-frio-overnight-con-pera-y-pasas-de-uva', 'leche', 80),
  ('avena-en-frio-overnight-con-pera-y-pasas-de-uva', 'chia', 5),
  ('avena-en-frio-overnight-con-pera-y-pasas-de-uva', 'pera', 1),
  ('avena-en-frio-overnight-con-pera-y-pasas-de-uva', 'pasas', 15),
  ('avena-con-yogur-griego-con-mango-y-cacao', 'avena', 35),
  ('avena-con-yogur-griego-con-mango-y-cacao', 'yogur-griego', 120),
  ('avena-con-yogur-griego-con-mango-y-cacao', 'leche', 40),
  ('avena-con-yogur-griego-con-mango-y-cacao', 'mango', 100),
  ('avena-con-yogur-griego-con-mango-y-cacao', 'cacao-amargo', 5),
  ('avena-con-yogur-griego-con-anana-y-semillas-de-girasol', 'avena', 35),
  ('avena-con-yogur-griego-con-anana-y-semillas-de-girasol', 'yogur-griego', 120),
  ('avena-con-yogur-griego-con-anana-y-semillas-de-girasol', 'leche', 40),
  ('avena-con-yogur-griego-con-anana-y-semillas-de-girasol', 'anana', 100),
  ('avena-con-yogur-griego-con-anana-y-semillas-de-girasol', 'semillas-girasol', 10),
  ('avena-con-cacao-con-banana-y-nueces', 'avena', 40),
  ('avena-con-cacao-con-banana-y-nueces', 'leche', 180),
  ('avena-con-cacao-con-banana-y-nueces', 'cacao-amargo', 6),
  ('avena-con-cacao-con-banana-y-nueces', 'banana', 1),
  ('avena-con-cacao-con-banana-y-nueces', 'nueces', 10),
  ('avena-con-cacao-con-manzana-y-miel', 'avena', 40),
  ('avena-con-cacao-con-manzana-y-miel', 'leche', 180),
  ('avena-con-cacao-con-manzana-y-miel', 'cacao-amargo', 6),
  ('avena-con-cacao-con-manzana-y-miel', 'manzana', 1),
  ('avena-con-cacao-con-manzana-y-miel', 'miel', 10),
  ('avena-cocida-con-arandanos-y-cacao', 'avena', 40),
  ('avena-cocida-con-arandanos-y-cacao', 'leche', 180),
  ('avena-cocida-con-arandanos-y-cacao', 'arandanos', 80),
  ('avena-cocida-con-arandanos-y-cacao', 'cacao-amargo', 5),
  ('avena-cocida-con-anana-y-nueces', 'avena', 40),
  ('avena-cocida-con-anana-y-nueces', 'leche', 180),
  ('avena-cocida-con-anana-y-nueces', 'anana', 100),
  ('avena-cocida-con-anana-y-nueces', 'nueces', 10),
  ('avena-con-yogur-griego-con-frambuesas-y-almendras', 'avena', 35),
  ('avena-con-yogur-griego-con-frambuesas-y-almendras', 'yogur-griego', 120),
  ('avena-con-yogur-griego-con-frambuesas-y-almendras', 'leche', 40),
  ('avena-con-yogur-griego-con-frambuesas-y-almendras', 'frambuesa', 80),
  ('avena-con-yogur-griego-con-frambuesas-y-almendras', 'almendras', 10),
  ('avena-cocida-con-durazno-y-pasas-de-uva', 'avena', 40),
  ('avena-cocida-con-durazno-y-pasas-de-uva', 'leche', 180),
  ('avena-cocida-con-durazno-y-pasas-de-uva', 'durazno', 1),
  ('avena-cocida-con-durazno-y-pasas-de-uva', 'pasas', 15),
  ('avena-con-yogur-griego-con-frambuesas-y-pasas-de-uva', 'avena', 35),
  ('avena-con-yogur-griego-con-frambuesas-y-pasas-de-uva', 'yogur-griego', 120),
  ('avena-con-yogur-griego-con-frambuesas-y-pasas-de-uva', 'leche', 40),
  ('avena-con-yogur-griego-con-frambuesas-y-pasas-de-uva', 'frambuesa', 80),
  ('avena-con-yogur-griego-con-frambuesas-y-pasas-de-uva', 'pasas', 15),
  ('avena-con-yogur-griego-con-banana-y-almendras', 'avena', 35),
  ('avena-con-yogur-griego-con-banana-y-almendras', 'yogur-griego', 120),
  ('avena-con-yogur-griego-con-banana-y-almendras', 'leche', 40),
  ('avena-con-yogur-griego-con-banana-y-almendras', 'banana', 1),
  ('avena-con-yogur-griego-con-banana-y-almendras', 'almendras', 10),
  ('avena-con-yogur-griego-con-kiwi-y-nueces', 'avena', 35),
  ('avena-con-yogur-griego-con-kiwi-y-nueces', 'yogur-griego', 120),
  ('avena-con-yogur-griego-con-kiwi-y-nueces', 'leche', 40),
  ('avena-con-yogur-griego-con-kiwi-y-nueces', 'kiwi', 1.5),
  ('avena-con-yogur-griego-con-kiwi-y-nueces', 'nueces', 10),
  ('avena-cocida-con-anana-y-coco-rallado', 'avena', 40),
  ('avena-cocida-con-anana-y-coco-rallado', 'leche', 180),
  ('avena-cocida-con-anana-y-coco-rallado', 'anana', 100),
  ('avena-cocida-con-anana-y-coco-rallado', 'coco-rallado', 8),
  ('avena-con-yogur-griego-con-frambuesas-y-semillas-de-chia', 'avena', 35),
  ('avena-con-yogur-griego-con-frambuesas-y-semillas-de-chia', 'yogur-griego', 120),
  ('avena-con-yogur-griego-con-frambuesas-y-semillas-de-chia', 'leche', 40),
  ('avena-con-yogur-griego-con-frambuesas-y-semillas-de-chia', 'frambuesa', 80),
  ('avena-con-yogur-griego-con-frambuesas-y-semillas-de-chia', 'chia', 8),
  ('avena-cocida-con-anana-y-cacao', 'avena', 40),
  ('avena-cocida-con-anana-y-cacao', 'leche', 180),
  ('avena-cocida-con-anana-y-cacao', 'anana', 100),
  ('avena-cocida-con-anana-y-cacao', 'cacao-amargo', 5),
  ('avena-en-frio-overnight-con-manzana-y-almendras', 'avena', 40),
  ('avena-en-frio-overnight-con-manzana-y-almendras', 'yogur-natural', 80),
  ('avena-en-frio-overnight-con-manzana-y-almendras', 'leche', 80),
  ('avena-en-frio-overnight-con-manzana-y-almendras', 'chia', 5),
  ('avena-en-frio-overnight-con-manzana-y-almendras', 'manzana', 1),
  ('avena-en-frio-overnight-con-manzana-y-almendras', 'almendras', 10),
  ('avena-cocida-con-frutilla-y-semillas-de-chia', 'avena', 40),
  ('avena-cocida-con-frutilla-y-semillas-de-chia', 'leche', 180),
  ('avena-cocida-con-frutilla-y-semillas-de-chia', 'frutilla', 100),
  ('avena-cocida-con-frutilla-y-semillas-de-chia', 'chia', 8),
  ('avena-con-cacao-con-arandanos-y-almendras', 'avena', 40),
  ('avena-con-cacao-con-arandanos-y-almendras', 'leche', 180),
  ('avena-con-cacao-con-arandanos-y-almendras', 'cacao-amargo', 6),
  ('avena-con-cacao-con-arandanos-y-almendras', 'arandanos', 80),
  ('avena-con-cacao-con-arandanos-y-almendras', 'almendras', 10),
  ('cottage-con-banana-y-avena', 'cottage', 150),
  ('cottage-con-banana-y-avena', 'avena', 25),
  ('cottage-con-banana-y-avena', 'banana', 1),
  ('yogur-natural-con-durazno-y-granola', 'yogur-natural', 170),
  ('yogur-natural-con-durazno-y-granola', 'granola', 30),
  ('yogur-natural-con-durazno-y-granola', 'durazno', 1),
  ('yogur-proteico-con-durazno-y-muesli', 'yogur-proteico', 160),
  ('yogur-proteico-con-durazno-y-muesli', 'muesli', 30),
  ('yogur-proteico-con-durazno-y-muesli', 'durazno', 1),
  ('cottage-con-mango-y-avena', 'cottage', 150),
  ('cottage-con-mango-y-avena', 'avena', 25),
  ('cottage-con-mango-y-avena', 'mango', 100),
  ('yogur-proteico-con-kiwi-y-avena', 'yogur-proteico', 160),
  ('yogur-proteico-con-kiwi-y-avena', 'avena', 25),
  ('yogur-proteico-con-kiwi-y-avena', 'kiwi', 1.5),
  ('yogur-proteico-con-durazno-y-avena', 'yogur-proteico', 160),
  ('yogur-proteico-con-durazno-y-avena', 'avena', 25),
  ('yogur-proteico-con-durazno-y-avena', 'durazno', 1),
  ('yogur-natural-con-banana-y-granola', 'yogur-natural', 170),
  ('yogur-natural-con-banana-y-granola', 'granola', 30),
  ('yogur-natural-con-banana-y-granola', 'banana', 1),
  ('yogur-proteico-con-arandanos-y-granola', 'yogur-proteico', 160),
  ('yogur-proteico-con-arandanos-y-granola', 'granola', 30),
  ('yogur-proteico-con-arandanos-y-granola', 'arandanos', 80),
  ('yogur-proteico-con-mango-y-granola', 'yogur-proteico', 160),
  ('yogur-proteico-con-mango-y-granola', 'granola', 30),
  ('yogur-proteico-con-mango-y-granola', 'mango', 100),
  ('cottage-con-kiwi-y-muesli', 'cottage', 150),
  ('cottage-con-kiwi-y-muesli', 'muesli', 30),
  ('cottage-con-kiwi-y-muesli', 'kiwi', 1.5),
  ('yogur-griego-con-kiwi-y-granola', 'yogur-griego', 150),
  ('yogur-griego-con-kiwi-y-granola', 'granola', 30),
  ('yogur-griego-con-kiwi-y-granola', 'kiwi', 1.5),
  ('cottage-con-durazno-y-granola', 'cottage', 150),
  ('cottage-con-durazno-y-granola', 'granola', 30),
  ('cottage-con-durazno-y-granola', 'durazno', 1),
  ('yogur-griego-con-anana-y-granola', 'yogur-griego', 150),
  ('yogur-griego-con-anana-y-granola', 'granola', 30),
  ('yogur-griego-con-anana-y-granola', 'anana', 100),
  ('yogur-griego-con-arandanos-y-muesli', 'yogur-griego', 150),
  ('yogur-griego-con-arandanos-y-muesli', 'muesli', 30),
  ('yogur-griego-con-arandanos-y-muesli', 'arandanos', 80),
  ('cottage-con-durazno-y-avena', 'cottage', 150),
  ('cottage-con-durazno-y-avena', 'avena', 25),
  ('cottage-con-durazno-y-avena', 'durazno', 1),
  ('yogur-griego-con-anana-y-muesli', 'yogur-griego', 150),
  ('yogur-griego-con-anana-y-muesli', 'muesli', 30),
  ('yogur-griego-con-anana-y-muesli', 'anana', 100),
  ('yogur-proteico-con-pera-y-granola', 'yogur-proteico', 160),
  ('yogur-proteico-con-pera-y-granola', 'granola', 30),
  ('yogur-proteico-con-pera-y-granola', 'pera', 1),
  ('yogur-natural-con-durazno-y-muesli', 'yogur-natural', 170),
  ('yogur-natural-con-durazno-y-muesli', 'muesli', 30),
  ('yogur-natural-con-durazno-y-muesli', 'durazno', 1),
  ('yogur-griego-con-manzana-y-muesli', 'yogur-griego', 150),
  ('yogur-griego-con-manzana-y-muesli', 'muesli', 30),
  ('yogur-griego-con-manzana-y-muesli', 'manzana', 1),
  ('yogur-proteico-con-pera-y-avena', 'yogur-proteico', 160),
  ('yogur-proteico-con-pera-y-avena', 'avena', 25),
  ('yogur-proteico-con-pera-y-avena', 'pera', 1),
  ('cottage-con-mango-y-muesli', 'cottage', 150),
  ('cottage-con-mango-y-muesli', 'muesli', 30),
  ('cottage-con-mango-y-muesli', 'mango', 100),
  ('yogur-natural-con-manzana-y-granola', 'yogur-natural', 170),
  ('yogur-natural-con-manzana-y-granola', 'granola', 30),
  ('yogur-natural-con-manzana-y-granola', 'manzana', 1),
  ('yogur-natural-con-frambuesas-y-granola', 'yogur-natural', 170),
  ('yogur-natural-con-frambuesas-y-granola', 'granola', 30),
  ('yogur-natural-con-frambuesas-y-granola', 'frambuesa', 80),
  ('yogur-natural-con-anana-y-granola', 'yogur-natural', 170),
  ('yogur-natural-con-anana-y-granola', 'granola', 30),
  ('yogur-natural-con-anana-y-granola', 'anana', 100),
  ('yogur-proteico-con-manzana-y-granola', 'yogur-proteico', 160),
  ('yogur-proteico-con-manzana-y-granola', 'granola', 30),
  ('yogur-proteico-con-manzana-y-granola', 'manzana', 1),
  ('yogur-natural-con-banana-y-muesli', 'yogur-natural', 170),
  ('yogur-natural-con-banana-y-muesli', 'muesli', 30),
  ('yogur-natural-con-banana-y-muesli', 'banana', 1),
  ('cottage-con-anana-y-granola', 'cottage', 150),
  ('cottage-con-anana-y-granola', 'granola', 30),
  ('cottage-con-anana-y-granola', 'anana', 100),
  ('yogur-natural-con-arandanos-y-avena', 'yogur-natural', 170),
  ('yogur-natural-con-arandanos-y-avena', 'avena', 25),
  ('yogur-natural-con-arandanos-y-avena', 'arandanos', 80),
  ('cottage-con-durazno-y-muesli', 'cottage', 150),
  ('cottage-con-durazno-y-muesli', 'muesli', 30),
  ('cottage-con-durazno-y-muesli', 'durazno', 1),
  ('yogur-griego-con-frutilla-y-granola', 'yogur-griego', 150),
  ('yogur-griego-con-frutilla-y-granola', 'granola', 30),
  ('yogur-griego-con-frutilla-y-granola', 'frutilla', 100),
  ('yogur-proteico-con-arandanos-y-avena', 'yogur-proteico', 160),
  ('yogur-proteico-con-arandanos-y-avena', 'avena', 25),
  ('yogur-proteico-con-arandanos-y-avena', 'arandanos', 80),
  ('yogur-natural-con-kiwi-y-avena', 'yogur-natural', 170),
  ('yogur-natural-con-kiwi-y-avena', 'avena', 25),
  ('yogur-natural-con-kiwi-y-avena', 'kiwi', 1.5),
  ('cottage-con-frambuesas-y-avena', 'cottage', 150),
  ('cottage-con-frambuesas-y-avena', 'avena', 25),
  ('cottage-con-frambuesas-y-avena', 'frambuesa', 80),
  ('yogur-natural-con-kiwi-y-granola', 'yogur-natural', 170),
  ('yogur-natural-con-kiwi-y-granola', 'granola', 30),
  ('yogur-natural-con-kiwi-y-granola', 'kiwi', 1.5),
  ('cottage-con-manzana-y-granola', 'cottage', 150),
  ('cottage-con-manzana-y-granola', 'granola', 30),
  ('cottage-con-manzana-y-granola', 'manzana', 1),
  ('yogur-griego-con-banana-y-avena', 'yogur-griego', 150),
  ('yogur-griego-con-banana-y-avena', 'avena', 25),
  ('yogur-griego-con-banana-y-avena', 'banana', 1),
  ('licuado-de-pera-con-proteina-yogur', 'yogur-natural', 120),
  ('licuado-de-pera-con-proteina-yogur', 'leche', 80),
  ('licuado-de-pera-con-proteina-yogur', 'proteina-polvo', 25),
  ('licuado-de-pera-con-proteina-yogur', 'pera', 1),
  ('licuado-de-frambuesas-con-jengibre-leche', 'leche', 200),
  ('licuado-de-frambuesas-con-jengibre-leche', 'jengibre', 3),
  ('licuado-de-frambuesas-con-jengibre-leche', 'miel', 8),
  ('licuado-de-frambuesas-con-jengibre-leche', 'frambuesa', 80),
  ('licuado-de-frutilla-con-cacao-yogur', 'yogur-natural', 120),
  ('licuado-de-frutilla-con-cacao-yogur', 'leche', 80),
  ('licuado-de-frutilla-con-cacao-yogur', 'cacao-amargo', 6),
  ('licuado-de-frutilla-con-cacao-yogur', 'miel', 8),
  ('licuado-de-frutilla-con-cacao-yogur', 'frutilla', 100),
  ('licuado-de-frutilla-con-proteina-yogur', 'yogur-natural', 120),
  ('licuado-de-frutilla-con-proteina-yogur', 'leche', 80),
  ('licuado-de-frutilla-con-proteina-yogur', 'proteina-polvo', 25),
  ('licuado-de-frutilla-con-proteina-yogur', 'frutilla', 100),
  ('licuado-de-durazno-con-espinaca-yogur', 'yogur-natural', 120),
  ('licuado-de-durazno-con-espinaca-yogur', 'leche', 80),
  ('licuado-de-durazno-con-espinaca-yogur', 'espinaca', 30),
  ('licuado-de-durazno-con-espinaca-yogur', 'durazno', 1),
  ('licuado-de-frutilla-con-proteina-leche', 'leche', 200),
  ('licuado-de-frutilla-con-proteina-leche', 'proteina-polvo', 25),
  ('licuado-de-frutilla-con-proteina-leche', 'frutilla', 100),
  ('licuado-de-pera-con-espinaca-yogur', 'yogur-natural', 120),
  ('licuado-de-pera-con-espinaca-yogur', 'leche', 80),
  ('licuado-de-pera-con-espinaca-yogur', 'espinaca', 30),
  ('licuado-de-pera-con-espinaca-yogur', 'pera', 1),
  ('licuado-de-mango-con-avena-leche', 'leche', 200),
  ('licuado-de-mango-con-avena-leche', 'avena', 20),
  ('licuado-de-mango-con-avena-leche', 'mango', 100),
  ('licuado-de-mango-con-avena-bebida-de-avena', 'bebida-avena', 200),
  ('licuado-de-mango-con-avena-bebida-de-avena', 'avena', 20),
  ('licuado-de-mango-con-avena-bebida-de-avena', 'mango', 100),
  ('licuado-de-manzana-con-mantequilla-de-mani-bebida-de', 'bebida-avena', 200),
  ('licuado-de-manzana-con-mantequilla-de-mani-bebida-de', 'mani-pasta', 15),
  ('licuado-de-manzana-con-mantequilla-de-mani-bebida-de', 'manzana', 1),
  ('licuado-de-banana-con-mantequilla-de-mani-bebida-de', 'bebida-avena', 200),
  ('licuado-de-banana-con-mantequilla-de-mani-bebida-de', 'mani-pasta', 15),
  ('licuado-de-banana-con-mantequilla-de-mani-bebida-de', 'banana', 1),
  ('licuado-de-manzana-con-avena-yogur', 'yogur-natural', 120),
  ('licuado-de-manzana-con-avena-yogur', 'leche', 80),
  ('licuado-de-manzana-con-avena-yogur', 'avena', 20),
  ('licuado-de-manzana-con-avena-yogur', 'manzana', 1),
  ('licuado-de-anana-con-proteina-bebida-de-almendras', 'bebida-almendras', 200),
  ('licuado-de-anana-con-proteina-bebida-de-almendras', 'proteina-polvo', 25),
  ('licuado-de-anana-con-proteina-bebida-de-almendras', 'anana', 100),
  ('licuado-de-anana-con-jengibre-yogur', 'yogur-natural', 120),
  ('licuado-de-anana-con-jengibre-yogur', 'leche', 80),
  ('licuado-de-anana-con-jengibre-yogur', 'jengibre', 3),
  ('licuado-de-anana-con-jengibre-yogur', 'miel', 8),
  ('licuado-de-anana-con-jengibre-yogur', 'anana', 100),
  ('licuado-de-pera-con-proteina-bebida-de-avena', 'bebida-avena', 200),
  ('licuado-de-pera-con-proteina-bebida-de-avena', 'proteina-polvo', 25),
  ('licuado-de-pera-con-proteina-bebida-de-avena', 'pera', 1),
  ('licuado-de-anana-con-proteina-bebida-de-avena', 'bebida-avena', 200),
  ('licuado-de-anana-con-proteina-bebida-de-avena', 'proteina-polvo', 25),
  ('licuado-de-anana-con-proteina-bebida-de-avena', 'anana', 100),
  ('licuado-de-frutilla-con-mantequilla-de-mani-leche', 'leche', 200),
  ('licuado-de-frutilla-con-mantequilla-de-mani-leche', 'mani-pasta', 15),
  ('licuado-de-frutilla-con-mantequilla-de-mani-leche', 'frutilla', 100),
  ('licuado-de-frambuesas-con-mantequilla-de-mani-bebida-de', 'bebida-avena', 200),
  ('licuado-de-frambuesas-con-mantequilla-de-mani-bebida-de', 'mani-pasta', 15),
  ('licuado-de-frambuesas-con-mantequilla-de-mani-bebida-de', 'frambuesa', 80),
  ('licuado-de-banana-con-mantequilla-de-mani-yogur', 'yogur-natural', 120),
  ('licuado-de-banana-con-mantequilla-de-mani-yogur', 'leche', 80),
  ('licuado-de-banana-con-mantequilla-de-mani-yogur', 'mani-pasta', 15),
  ('licuado-de-banana-con-mantequilla-de-mani-yogur', 'banana', 1),
  ('licuado-de-arandanos-con-avena-leche', 'leche', 200),
  ('licuado-de-arandanos-con-avena-leche', 'avena', 20),
  ('licuado-de-arandanos-con-avena-leche', 'arandanos', 80),
  ('licuado-de-anana-con-avena-bebida-de-avena', 'bebida-avena', 200),
  ('licuado-de-anana-con-avena-bebida-de-avena', 'avena', 20),
  ('licuado-de-anana-con-avena-bebida-de-avena', 'anana', 100),
  ('licuado-de-banana-con-avena-bebida-de-avena', 'bebida-avena', 200),
  ('licuado-de-banana-con-avena-bebida-de-avena', 'avena', 20),
  ('licuado-de-banana-con-avena-bebida-de-avena', 'banana', 1),
  ('licuado-de-durazno-con-proteina-leche', 'leche', 200),
  ('licuado-de-durazno-con-proteina-leche', 'proteina-polvo', 25),
  ('licuado-de-durazno-con-proteina-leche', 'durazno', 1),
  ('licuado-de-arandanos-con-avena-bebida-de-avena', 'bebida-avena', 200),
  ('licuado-de-arandanos-con-avena-bebida-de-avena', 'avena', 20),
  ('licuado-de-arandanos-con-avena-bebida-de-avena', 'arandanos', 80),
  ('licuado-de-frambuesas-con-jengibre-yogur', 'yogur-natural', 120),
  ('licuado-de-frambuesas-con-jengibre-yogur', 'leche', 80),
  ('licuado-de-frambuesas-con-jengibre-yogur', 'jengibre', 3),
  ('licuado-de-frambuesas-con-jengibre-yogur', 'miel', 8),
  ('licuado-de-frambuesas-con-jengibre-yogur', 'frambuesa', 80),
  ('licuado-de-arandanos-con-proteina-bebida-de-avena', 'bebida-avena', 200),
  ('licuado-de-arandanos-con-proteina-bebida-de-avena', 'proteina-polvo', 25),
  ('licuado-de-arandanos-con-proteina-bebida-de-avena', 'arandanos', 80),
  ('licuado-de-mango-con-proteina-bebida-de-almendras', 'bebida-almendras', 200),
  ('licuado-de-mango-con-proteina-bebida-de-almendras', 'proteina-polvo', 25),
  ('licuado-de-mango-con-proteina-bebida-de-almendras', 'mango', 100),
  ('licuado-de-manzana-con-jengibre-leche', 'leche', 200),
  ('licuado-de-manzana-con-jengibre-leche', 'jengibre', 3),
  ('licuado-de-manzana-con-jengibre-leche', 'miel', 8),
  ('licuado-de-manzana-con-jengibre-leche', 'manzana', 1),
  ('licuado-de-pera-con-proteina-bebida-de-almendras', 'bebida-almendras', 200),
  ('licuado-de-pera-con-proteina-bebida-de-almendras', 'proteina-polvo', 25),
  ('licuado-de-pera-con-proteina-bebida-de-almendras', 'pera', 1),
  ('licuado-de-frutilla-con-cacao-leche', 'leche', 200),
  ('licuado-de-frutilla-con-cacao-leche', 'cacao-amargo', 6),
  ('licuado-de-frutilla-con-cacao-leche', 'miel', 8),
  ('licuado-de-frutilla-con-cacao-leche', 'frutilla', 100),
  ('licuado-de-mango-con-mantequilla-de-mani-leche', 'leche', 200),
  ('licuado-de-mango-con-mantequilla-de-mani-leche', 'mani-pasta', 15),
  ('licuado-de-mango-con-mantequilla-de-mani-leche', 'mango', 100),
  ('licuado-de-mango-con-cacao-yogur', 'yogur-natural', 120),
  ('licuado-de-mango-con-cacao-yogur', 'leche', 80),
  ('licuado-de-mango-con-cacao-yogur', 'cacao-amargo', 6),
  ('licuado-de-mango-con-cacao-yogur', 'miel', 8),
  ('licuado-de-mango-con-cacao-yogur', 'mango', 100),
  ('licuado-de-anana-con-avena-leche', 'leche', 200),
  ('licuado-de-anana-con-avena-leche', 'avena', 20),
  ('licuado-de-anana-con-avena-leche', 'anana', 100),
  ('licuado-de-manzana-con-avena-leche', 'leche', 200),
  ('licuado-de-manzana-con-avena-leche', 'avena', 20),
  ('licuado-de-manzana-con-avena-leche', 'manzana', 1),
  ('licuado-de-frambuesas-con-proteina-yogur', 'yogur-natural', 120),
  ('licuado-de-frambuesas-con-proteina-yogur', 'leche', 80),
  ('licuado-de-frambuesas-con-proteina-yogur', 'proteina-polvo', 25),
  ('licuado-de-frambuesas-con-proteina-yogur', 'frambuesa', 80),
  ('licuado-de-frutilla-con-proteina-bebida-de-almendras', 'bebida-almendras', 200),
  ('licuado-de-frutilla-con-proteina-bebida-de-almendras', 'proteina-polvo', 25),
  ('licuado-de-frutilla-con-proteina-bebida-de-almendras', 'frutilla', 100),
  ('licuado-de-durazno-con-proteina-yogur', 'yogur-natural', 120),
  ('licuado-de-durazno-con-proteina-yogur', 'leche', 80),
  ('licuado-de-durazno-con-proteina-yogur', 'proteina-polvo', 25),
  ('licuado-de-durazno-con-proteina-yogur', 'durazno', 1),
  ('licuado-de-pera-con-jengibre-leche', 'leche', 200),
  ('licuado-de-pera-con-jengibre-leche', 'jengibre', 3),
  ('licuado-de-pera-con-jengibre-leche', 'miel', 8),
  ('licuado-de-pera-con-jengibre-leche', 'pera', 1),
  ('licuado-de-frutilla-con-mantequilla-de-mani-bebida-de', 'bebida-avena', 200),
  ('licuado-de-frutilla-con-mantequilla-de-mani-bebida-de', 'mani-pasta', 15),
  ('licuado-de-frutilla-con-mantequilla-de-mani-bebida-de', 'frutilla', 100),
  ('licuado-de-banana-con-mantequilla-de-mani-bebida-de-2', 'bebida-almendras', 200),
  ('licuado-de-banana-con-mantequilla-de-mani-bebida-de-2', 'mani-pasta', 15),
  ('licuado-de-banana-con-mantequilla-de-mani-bebida-de-2', 'banana', 1),
  ('licuado-de-arandanos-con-jengibre-yogur', 'yogur-natural', 120),
  ('licuado-de-arandanos-con-jengibre-yogur', 'leche', 80),
  ('licuado-de-arandanos-con-jengibre-yogur', 'jengibre', 3),
  ('licuado-de-arandanos-con-jengibre-yogur', 'miel', 8),
  ('licuado-de-arandanos-con-jengibre-yogur', 'arandanos', 80),
  ('licuado-de-manzana-con-proteina-yogur', 'yogur-natural', 120),
  ('licuado-de-manzana-con-proteina-yogur', 'leche', 80),
  ('licuado-de-manzana-con-proteina-yogur', 'proteina-polvo', 25),
  ('licuado-de-manzana-con-proteina-yogur', 'manzana', 1),
  ('licuado-de-durazno-con-proteina-bebida-de-almendras', 'bebida-almendras', 200),
  ('licuado-de-durazno-con-proteina-bebida-de-almendras', 'proteina-polvo', 25),
  ('licuado-de-durazno-con-proteina-bebida-de-almendras', 'durazno', 1),
  ('licuado-de-frambuesas-con-mantequilla-de-mani-yogur', 'yogur-natural', 120),
  ('licuado-de-frambuesas-con-mantequilla-de-mani-yogur', 'leche', 80),
  ('licuado-de-frambuesas-con-mantequilla-de-mani-yogur', 'mani-pasta', 15),
  ('licuado-de-frambuesas-con-mantequilla-de-mani-yogur', 'frambuesa', 80),
  ('panqueques-de-avena-con-manzana-y-canela', 'avena', 35),
  ('panqueques-de-avena-con-manzana-y-canela', 'huevo', 1),
  ('panqueques-de-avena-con-manzana-y-canela', 'leche', 80),
  ('panqueques-de-avena-con-manzana-y-canela', 'manzana', 0.5),
  ('panqueques-de-avena-con-manzana-y-canela', 'azucar-mascabo', 5),
  ('panqueques-de-avena-con-manzana-y-canela', 'aceite', 3),
  ('panqueques-de-ricota-con-banana-y-dulce-de-leche-light', 'ricota', 80),
  ('panqueques-de-ricota-con-banana-y-dulce-de-leche-light', 'huevo', 1),
  ('panqueques-de-ricota-con-banana-y-dulce-de-leche-light', 'harina', 25),
  ('panqueques-de-ricota-con-banana-y-dulce-de-leche-light', 'banana', 1),
  ('panqueques-de-ricota-con-banana-y-dulce-de-leche-light', 'dulce-leche-light', 15),
  ('panqueques-de-ricota-con-banana-y-dulce-de-leche-light', 'aceite', 3),
  ('tortitas-de-yogur-con-manzana-y-canela', 'harina-integral', 40),
  ('tortitas-de-yogur-con-manzana-y-canela', 'yogur-natural', 60),
  ('tortitas-de-yogur-con-manzana-y-canela', 'huevo', 1),
  ('tortitas-de-yogur-con-manzana-y-canela', 'polvo-hornear', 2),
  ('tortitas-de-yogur-con-manzana-y-canela', 'manzana', 0.5),
  ('tortitas-de-yogur-con-manzana-y-canela', 'azucar-mascabo', 5),
  ('tortitas-de-yogur-con-manzana-y-canela', 'aceite', 3),
  ('panqueques-de-banana-con-arandanos-y-yogur', 'banana', 1),
  ('panqueques-de-banana-con-arandanos-y-yogur', 'huevo', 1),
  ('panqueques-de-banana-con-arandanos-y-yogur', 'avena', 25),
  ('panqueques-de-banana-con-arandanos-y-yogur', 'arandanos', 60),
  ('panqueques-de-banana-con-arandanos-y-yogur', 'yogur-natural', 50),
  ('panqueques-de-banana-con-arandanos-y-yogur', 'aceite', 3),
  ('panqueques-de-avena-con-mango-y-coco', 'avena', 35),
  ('panqueques-de-avena-con-mango-y-coco', 'huevo', 1),
  ('panqueques-de-avena-con-mango-y-coco', 'leche', 80),
  ('panqueques-de-avena-con-mango-y-coco', 'mango', 80),
  ('panqueques-de-avena-con-mango-y-coco', 'coco-rallado', 6),
  ('panqueques-de-avena-con-mango-y-coco', 'aceite', 3),
  ('panqueques-de-ricota-con-cacao-y-frutillas', 'ricota', 80),
  ('panqueques-de-ricota-con-cacao-y-frutillas', 'huevo', 1),
  ('panqueques-de-ricota-con-cacao-y-frutillas', 'harina', 25),
  ('panqueques-de-ricota-con-cacao-y-frutillas', 'cacao-amargo', 5),
  ('panqueques-de-ricota-con-cacao-y-frutillas', 'frutilla', 80),
  ('panqueques-de-ricota-con-cacao-y-frutillas', 'miel', 8),
  ('panqueques-de-ricota-con-cacao-y-frutillas', 'aceite', 3),
  ('panqueques-de-avena-con-cacao-y-frutillas', 'avena', 35),
  ('panqueques-de-avena-con-cacao-y-frutillas', 'huevo', 1),
  ('panqueques-de-avena-con-cacao-y-frutillas', 'leche', 80),
  ('panqueques-de-avena-con-cacao-y-frutillas', 'cacao-amargo', 5),
  ('panqueques-de-avena-con-cacao-y-frutillas', 'frutilla', 80),
  ('panqueques-de-avena-con-cacao-y-frutillas', 'miel', 8),
  ('panqueques-de-avena-con-cacao-y-frutillas', 'aceite', 3),
  ('tortitas-de-yogur-con-durazno-y-ricota', 'harina-integral', 40),
  ('tortitas-de-yogur-con-durazno-y-ricota', 'yogur-natural', 60),
  ('tortitas-de-yogur-con-durazno-y-ricota', 'huevo', 1),
  ('tortitas-de-yogur-con-durazno-y-ricota', 'polvo-hornear', 2),
  ('tortitas-de-yogur-con-durazno-y-ricota', 'durazno', 1),
  ('tortitas-de-yogur-con-durazno-y-ricota', 'ricota', 40),
  ('tortitas-de-yogur-con-durazno-y-ricota', 'aceite', 3),
  ('panqueques-de-banana-con-cacao-y-frutillas', 'banana', 1),
  ('panqueques-de-banana-con-cacao-y-frutillas', 'huevo', 1),
  ('panqueques-de-banana-con-cacao-y-frutillas', 'avena', 25),
  ('panqueques-de-banana-con-cacao-y-frutillas', 'cacao-amargo', 5),
  ('panqueques-de-banana-con-cacao-y-frutillas', 'frutilla', 80),
  ('panqueques-de-banana-con-cacao-y-frutillas', 'miel', 8),
  ('panqueques-de-banana-con-cacao-y-frutillas', 'aceite', 3),
  ('panqueques-de-banana-con-manzana-y-canela', 'banana', 1),
  ('panqueques-de-banana-con-manzana-y-canela', 'huevo', 1),
  ('panqueques-de-banana-con-manzana-y-canela', 'avena', 25),
  ('panqueques-de-banana-con-manzana-y-canela', 'manzana', 0.5),
  ('panqueques-de-banana-con-manzana-y-canela', 'azucar-mascabo', 5),
  ('panqueques-de-banana-con-manzana-y-canela', 'aceite', 3),
  ('panqueques-de-avena-con-banana-y-dulce-de-leche-light', 'avena', 35),
  ('panqueques-de-avena-con-banana-y-dulce-de-leche-light', 'huevo', 1),
  ('panqueques-de-avena-con-banana-y-dulce-de-leche-light', 'leche', 80),
  ('panqueques-de-avena-con-banana-y-dulce-de-leche-light', 'banana', 1),
  ('panqueques-de-avena-con-banana-y-dulce-de-leche-light', 'dulce-leche-light', 15),
  ('panqueques-de-avena-con-banana-y-dulce-de-leche-light', 'aceite', 3),
  ('panqueques-de-avena-con-frutillas-y-miel', 'avena', 35),
  ('panqueques-de-avena-con-frutillas-y-miel', 'huevo', 1),
  ('panqueques-de-avena-con-frutillas-y-miel', 'leche', 80),
  ('panqueques-de-avena-con-frutillas-y-miel', 'frutilla', 80),
  ('panqueques-de-avena-con-frutillas-y-miel', 'miel', 10),
  ('panqueques-de-avena-con-frutillas-y-miel', 'aceite', 3),
  ('tortitas-de-yogur-con-cacao-y-frutillas', 'harina-integral', 40),
  ('tortitas-de-yogur-con-cacao-y-frutillas', 'yogur-natural', 60),
  ('tortitas-de-yogur-con-cacao-y-frutillas', 'huevo', 1),
  ('tortitas-de-yogur-con-cacao-y-frutillas', 'polvo-hornear', 2),
  ('tortitas-de-yogur-con-cacao-y-frutillas', 'cacao-amargo', 5),
  ('tortitas-de-yogur-con-cacao-y-frutillas', 'frutilla', 80),
  ('tortitas-de-yogur-con-cacao-y-frutillas', 'miel', 8),
  ('tortitas-de-yogur-con-cacao-y-frutillas', 'aceite', 3),
  ('panqueques-de-banana-con-banana-y-dulce-de-leche-light', 'banana', 2),
  ('panqueques-de-banana-con-banana-y-dulce-de-leche-light', 'huevo', 1),
  ('panqueques-de-banana-con-banana-y-dulce-de-leche-light', 'avena', 25),
  ('panqueques-de-banana-con-banana-y-dulce-de-leche-light', 'dulce-leche-light', 15),
  ('panqueques-de-banana-con-banana-y-dulce-de-leche-light', 'aceite', 3),
  ('panqueques-de-ricota-con-durazno-y-ricota', 'ricota', 120),
  ('panqueques-de-ricota-con-durazno-y-ricota', 'huevo', 1),
  ('panqueques-de-ricota-con-durazno-y-ricota', 'harina', 25),
  ('panqueques-de-ricota-con-durazno-y-ricota', 'durazno', 1),
  ('panqueques-de-ricota-con-durazno-y-ricota', 'aceite', 3),
  ('panqueques-de-ricota-con-arandanos-y-yogur', 'ricota', 80),
  ('panqueques-de-ricota-con-arandanos-y-yogur', 'huevo', 1),
  ('panqueques-de-ricota-con-arandanos-y-yogur', 'harina', 25),
  ('panqueques-de-ricota-con-arandanos-y-yogur', 'arandanos', 60),
  ('panqueques-de-ricota-con-arandanos-y-yogur', 'yogur-natural', 50),
  ('panqueques-de-ricota-con-arandanos-y-yogur', 'aceite', 3),
  ('tortitas-de-yogur-con-mantequilla-de-mani-y-banana', 'harina-integral', 40),
  ('tortitas-de-yogur-con-mantequilla-de-mani-y-banana', 'yogur-natural', 60),
  ('tortitas-de-yogur-con-mantequilla-de-mani-y-banana', 'huevo', 1),
  ('tortitas-de-yogur-con-mantequilla-de-mani-y-banana', 'polvo-hornear', 2),
  ('tortitas-de-yogur-con-mantequilla-de-mani-y-banana', 'mani-pasta', 15),
  ('tortitas-de-yogur-con-mantequilla-de-mani-y-banana', 'banana', 0.5),
  ('tortitas-de-yogur-con-mantequilla-de-mani-y-banana', 'aceite', 3),
  ('tortitas-de-yogur-con-arandanos-y-yogur', 'harina-integral', 40),
  ('tortitas-de-yogur-con-arandanos-y-yogur', 'yogur-natural', 110),
  ('tortitas-de-yogur-con-arandanos-y-yogur', 'huevo', 1),
  ('tortitas-de-yogur-con-arandanos-y-yogur', 'polvo-hornear', 2),
  ('tortitas-de-yogur-con-arandanos-y-yogur', 'arandanos', 60),
  ('tortitas-de-yogur-con-arandanos-y-yogur', 'aceite', 3),
  ('panqueques-de-avena-con-mantequilla-de-mani-y-banana', 'avena', 35),
  ('panqueques-de-avena-con-mantequilla-de-mani-y-banana', 'huevo', 1),
  ('panqueques-de-avena-con-mantequilla-de-mani-y-banana', 'leche', 80),
  ('panqueques-de-avena-con-mantequilla-de-mani-y-banana', 'mani-pasta', 15),
  ('panqueques-de-avena-con-mantequilla-de-mani-y-banana', 'banana', 0.5),
  ('panqueques-de-avena-con-mantequilla-de-mani-y-banana', 'aceite', 3),
  ('panqueques-de-banana-con-mantequilla-de-mani-y-banana', 'banana', 1.5),
  ('panqueques-de-banana-con-mantequilla-de-mani-y-banana', 'huevo', 1),
  ('panqueques-de-banana-con-mantequilla-de-mani-y-banana', 'avena', 25),
  ('panqueques-de-banana-con-mantequilla-de-mani-y-banana', 'mani-pasta', 15),
  ('panqueques-de-banana-con-mantequilla-de-mani-y-banana', 'aceite', 3),
  ('panqueques-de-banana-con-frutillas-y-miel', 'banana', 1),
  ('panqueques-de-banana-con-frutillas-y-miel', 'huevo', 1),
  ('panqueques-de-banana-con-frutillas-y-miel', 'avena', 25),
  ('panqueques-de-banana-con-frutillas-y-miel', 'frutilla', 80),
  ('panqueques-de-banana-con-frutillas-y-miel', 'miel', 10),
  ('panqueques-de-banana-con-frutillas-y-miel', 'aceite', 3),
  ('panqueques-de-ricota-con-mantequilla-de-mani-y-banana', 'ricota', 80),
  ('panqueques-de-ricota-con-mantequilla-de-mani-y-banana', 'huevo', 1),
  ('panqueques-de-ricota-con-mantequilla-de-mani-y-banana', 'harina', 25),
  ('panqueques-de-ricota-con-mantequilla-de-mani-y-banana', 'mani-pasta', 15),
  ('panqueques-de-ricota-con-mantequilla-de-mani-y-banana', 'banana', 0.5),
  ('panqueques-de-ricota-con-mantequilla-de-mani-y-banana', 'aceite', 3),
  ('panqueques-de-banana-con-mango-y-coco', 'banana', 1),
  ('panqueques-de-banana-con-mango-y-coco', 'huevo', 1),
  ('panqueques-de-banana-con-mango-y-coco', 'avena', 25),
  ('panqueques-de-banana-con-mango-y-coco', 'mango', 80),
  ('panqueques-de-banana-con-mango-y-coco', 'coco-rallado', 6),
  ('panqueques-de-banana-con-mango-y-coco', 'aceite', 3),
  ('tortitas-de-yogur-con-banana-y-dulce-de-leche-light', 'harina-integral', 40),
  ('tortitas-de-yogur-con-banana-y-dulce-de-leche-light', 'yogur-natural', 60),
  ('tortitas-de-yogur-con-banana-y-dulce-de-leche-light', 'huevo', 1),
  ('tortitas-de-yogur-con-banana-y-dulce-de-leche-light', 'polvo-hornear', 2),
  ('tortitas-de-yogur-con-banana-y-dulce-de-leche-light', 'banana', 1),
  ('tortitas-de-yogur-con-banana-y-dulce-de-leche-light', 'dulce-leche-light', 15),
  ('tortitas-de-yogur-con-banana-y-dulce-de-leche-light', 'aceite', 3),
  ('zapallitos-rellenos-de-ricota-y-espinaca', 'zapallito', 2),
  ('zapallitos-rellenos-de-ricota-y-espinaca', 'ricota', 90),
  ('zapallitos-rellenos-de-ricota-y-espinaca', 'espinaca', 60),
  ('zapallitos-rellenos-de-ricota-y-espinaca', 'queso-rallado', 20),
  ('zapallitos-rellenos-de-ricota-y-espinaca', 'aceite', 4),
  ('zapallitos-rellenos-de-lentejas', 'zapallito', 2),
  ('zapallitos-rellenos-de-lentejas', 'lentejas-hervidas', 120),
  ('zapallitos-rellenos-de-lentejas', 'cebolla', 0.5),
  ('zapallitos-rellenos-de-lentejas', 'tomate-triturado', 40),
  ('zapallitos-rellenos-de-lentejas', 'queso-rallado', 20),
  ('zapallitos-rellenos-de-lentejas', 'aceite', 4),
  ('tomates-rellenos-de-quinoa-y-verduras', 'tomate', 2.5),
  ('tomates-rellenos-de-quinoa-y-verduras', 'quinoa-hervida', 90),
  ('tomates-rellenos-de-quinoa-y-verduras', 'zanahoria', 0.5),
  ('tomates-rellenos-de-quinoa-y-verduras', 'choclo', 30),
  ('tomates-rellenos-de-quinoa-y-verduras', 'queso-cremoso', 25),
  ('tomates-rellenos-de-quinoa-y-verduras', 'queso-rallado', 10),
  ('tomates-rellenos-de-quinoa-y-verduras', 'aceite', 4),
  ('zapallitos-rellenos-de-quinoa-y-verduras', 'zapallito', 2),
  ('zapallitos-rellenos-de-quinoa-y-verduras', 'quinoa-hervida', 90),
  ('zapallitos-rellenos-de-quinoa-y-verduras', 'zanahoria', 0.5),
  ('zapallitos-rellenos-de-quinoa-y-verduras', 'choclo', 30),
  ('zapallitos-rellenos-de-quinoa-y-verduras', 'queso-cremoso', 25),
  ('zapallitos-rellenos-de-quinoa-y-verduras', 'queso-rallado', 10),
  ('zapallitos-rellenos-de-quinoa-y-verduras', 'aceite', 4),
  ('cebollas-rellenos-de-carne', 'cebolla', 2.5),
  ('cebollas-rellenos-de-carne', 'carne-picada-magra', 120),
  ('cebollas-rellenos-de-carne', 'queso-rallado', 20),
  ('cebollas-rellenos-de-carne', 'aceite', 4),
  ('berenjenas-rellenos-de-champinones-y-queso', 'berenjena', 1),
  ('berenjenas-rellenos-de-champinones-y-queso', 'champinones', 100),
  ('berenjenas-rellenos-de-champinones-y-queso', 'queso-cremoso', 40),
  ('berenjenas-rellenos-de-champinones-y-queso', 'cebolla', 0.5),
  ('berenjenas-rellenos-de-champinones-y-queso', 'aceite', 9),
  ('berenjenas-rellenos-de-champinones-y-queso', 'queso-rallado', 10),
  ('morrones-rellenos-de-pavo-y-verduras', 'morron', 1.5),
  ('morrones-rellenos-de-pavo-y-verduras', 'picada-pavo', 120),
  ('morrones-rellenos-de-pavo-y-verduras', 'zanahoria', 0.5),
  ('morrones-rellenos-de-pavo-y-verduras', 'cebolla', 0.5),
  ('morrones-rellenos-de-pavo-y-verduras', 'queso-rallado', 20),
  ('morrones-rellenos-de-pavo-y-verduras', 'aceite', 4),
  ('calabacines-rellenos-de-arroz-y-atun', 'zapallito', 2),
  ('calabacines-rellenos-de-arroz-y-atun', 'arroz-hervido', 80),
  ('calabacines-rellenos-de-arroz-y-atun', 'atun-natural', 1),
  ('calabacines-rellenos-de-arroz-y-atun', 'tomate', 0.5),
  ('calabacines-rellenos-de-arroz-y-atun', 'queso-rallado', 10),
  ('calabacines-rellenos-de-arroz-y-atun', 'aceite', 4),
  ('papas-rellenos-de-lentejas', 'papa', 250),
  ('papas-rellenos-de-lentejas', 'lentejas-hervidas', 120),
  ('papas-rellenos-de-lentejas', 'cebolla', 0.5),
  ('papas-rellenos-de-lentejas', 'tomate-triturado', 40),
  ('papas-rellenos-de-lentejas', 'queso-rallado', 20),
  ('papas-rellenos-de-lentejas', 'aceite', 4),
  ('papas-rellenos-de-garbanzos-y-verduras', 'papa', 250),
  ('papas-rellenos-de-garbanzos-y-verduras', 'garbanzos-hervidos', 100),
  ('papas-rellenos-de-garbanzos-y-verduras', 'zanahoria', 0.5),
  ('papas-rellenos-de-garbanzos-y-verduras', 'cebolla', 0.5),
  ('papas-rellenos-de-garbanzos-y-verduras', 'tomate-triturado', 40),
  ('papas-rellenos-de-garbanzos-y-verduras', 'queso-rallado', 10),
  ('papas-rellenos-de-garbanzos-y-verduras', 'aceite', 4),
  ('cebollas-rellenos-de-pavo-y-verduras', 'cebolla', 2.5),
  ('cebollas-rellenos-de-pavo-y-verduras', 'picada-pavo', 120),
  ('cebollas-rellenos-de-pavo-y-verduras', 'zanahoria', 0.5),
  ('cebollas-rellenos-de-pavo-y-verduras', 'queso-rallado', 20),
  ('cebollas-rellenos-de-pavo-y-verduras', 'aceite', 4),
  ('morrones-rellenos-de-carne', 'morron', 1.5),
  ('morrones-rellenos-de-carne', 'carne-picada-magra', 120),
  ('morrones-rellenos-de-carne', 'cebolla', 0.5),
  ('morrones-rellenos-de-carne', 'queso-rallado', 20),
  ('morrones-rellenos-de-carne', 'aceite', 4),
  ('morrones-rellenos-de-lentejas', 'morron', 1.5),
  ('morrones-rellenos-de-lentejas', 'lentejas-hervidas', 120),
  ('morrones-rellenos-de-lentejas', 'cebolla', 0.5),
  ('morrones-rellenos-de-lentejas', 'tomate-triturado', 40),
  ('morrones-rellenos-de-lentejas', 'queso-rallado', 20),
  ('morrones-rellenos-de-lentejas', 'aceite', 4),
  ('cebollas-rellenos-de-lentejas', 'cebolla', 2.5),
  ('cebollas-rellenos-de-lentejas', 'lentejas-hervidas', 120),
  ('cebollas-rellenos-de-lentejas', 'tomate-triturado', 40),
  ('cebollas-rellenos-de-lentejas', 'queso-rallado', 20),
  ('cebollas-rellenos-de-lentejas', 'aceite', 4),
  ('zapallitos-rellenos-de-arroz-y-atun', 'zapallito', 2),
  ('zapallitos-rellenos-de-arroz-y-atun', 'arroz-hervido', 80),
  ('zapallitos-rellenos-de-arroz-y-atun', 'atun-natural', 1),
  ('zapallitos-rellenos-de-arroz-y-atun', 'tomate', 0.5),
  ('zapallitos-rellenos-de-arroz-y-atun', 'queso-rallado', 10),
  ('zapallitos-rellenos-de-arroz-y-atun', 'aceite', 4),
  ('cebollas-rellenos-de-ricota-y-espinaca', 'cebolla', 2),
  ('cebollas-rellenos-de-ricota-y-espinaca', 'ricota', 90),
  ('cebollas-rellenos-de-ricota-y-espinaca', 'espinaca', 60),
  ('cebollas-rellenos-de-ricota-y-espinaca', 'queso-rallado', 20),
  ('cebollas-rellenos-de-ricota-y-espinaca', 'aceite', 4),
  ('papas-rellenos-de-pavo-y-verduras', 'papa', 250),
  ('papas-rellenos-de-pavo-y-verduras', 'picada-pavo', 120),
  ('papas-rellenos-de-pavo-y-verduras', 'zanahoria', 0.5),
  ('papas-rellenos-de-pavo-y-verduras', 'cebolla', 0.5),
  ('papas-rellenos-de-pavo-y-verduras', 'queso-rallado', 20),
  ('papas-rellenos-de-pavo-y-verduras', 'aceite', 4),
  ('berenjenas-rellenos-de-quinoa-y-verduras', 'berenjena', 1),
  ('berenjenas-rellenos-de-quinoa-y-verduras', 'quinoa-hervida', 90),
  ('berenjenas-rellenos-de-quinoa-y-verduras', 'zanahoria', 0.5),
  ('berenjenas-rellenos-de-quinoa-y-verduras', 'choclo', 30),
  ('berenjenas-rellenos-de-quinoa-y-verduras', 'queso-cremoso', 25),
  ('berenjenas-rellenos-de-quinoa-y-verduras', 'queso-rallado', 10),
  ('berenjenas-rellenos-de-quinoa-y-verduras', 'aceite', 4),
  ('berenjenas-rellenos-de-jamon-y-queso', 'berenjena', 1),
  ('berenjenas-rellenos-de-jamon-y-queso', 'jamon-cocido', 50),
  ('berenjenas-rellenos-de-jamon-y-queso', 'queso-cremoso', 50),
  ('berenjenas-rellenos-de-jamon-y-queso', 'salsa-blanca', 40),
  ('berenjenas-rellenos-de-jamon-y-queso', 'queso-rallado', 10),
  ('berenjenas-rellenos-de-jamon-y-queso', 'aceite', 4),
  ('zapallitos-rellenos-de-carne', 'zapallito', 2),
  ('zapallitos-rellenos-de-carne', 'carne-picada-magra', 120),
  ('zapallitos-rellenos-de-carne', 'cebolla', 0.5),
  ('zapallitos-rellenos-de-carne', 'queso-rallado', 20),
  ('zapallitos-rellenos-de-carne', 'aceite', 4),
  ('morrones-rellenos-de-ricota-y-espinaca', 'morron', 1.5),
  ('morrones-rellenos-de-ricota-y-espinaca', 'ricota', 90),
  ('morrones-rellenos-de-ricota-y-espinaca', 'espinaca', 60),
  ('morrones-rellenos-de-ricota-y-espinaca', 'queso-rallado', 20),
  ('morrones-rellenos-de-ricota-y-espinaca', 'aceite', 4),
  ('calabacines-rellenos-de-lentejas', 'zapallito', 2),
  ('calabacines-rellenos-de-lentejas', 'lentejas-hervidas', 120),
  ('calabacines-rellenos-de-lentejas', 'cebolla', 0.5),
  ('calabacines-rellenos-de-lentejas', 'tomate-triturado', 40),
  ('calabacines-rellenos-de-lentejas', 'queso-rallado', 20),
  ('calabacines-rellenos-de-lentejas', 'aceite', 4),
  ('hongos-portobello-rellenos-de-quinoa-y-verduras', 'champinones', 250),
  ('hongos-portobello-rellenos-de-quinoa-y-verduras', 'quinoa-hervida', 90),
  ('hongos-portobello-rellenos-de-quinoa-y-verduras', 'zanahoria', 0.5),
  ('hongos-portobello-rellenos-de-quinoa-y-verduras', 'choclo', 30),
  ('hongos-portobello-rellenos-de-quinoa-y-verduras', 'queso-cremoso', 25),
  ('hongos-portobello-rellenos-de-quinoa-y-verduras', 'queso-rallado', 10),
  ('hongos-portobello-rellenos-de-quinoa-y-verduras', 'aceite', 4),
  ('tomates-rellenos-de-ricota-y-espinaca', 'tomate', 2.5),
  ('tomates-rellenos-de-ricota-y-espinaca', 'ricota', 90),
  ('tomates-rellenos-de-ricota-y-espinaca', 'espinaca', 60),
  ('tomates-rellenos-de-ricota-y-espinaca', 'queso-rallado', 20),
  ('tomates-rellenos-de-ricota-y-espinaca', 'aceite', 4),
  ('cebollas-rellenos-de-quinoa-y-verduras', 'cebolla', 2),
  ('cebollas-rellenos-de-quinoa-y-verduras', 'quinoa-hervida', 90),
  ('cebollas-rellenos-de-quinoa-y-verduras', 'zanahoria', 0.5),
  ('cebollas-rellenos-de-quinoa-y-verduras', 'choclo', 30),
  ('cebollas-rellenos-de-quinoa-y-verduras', 'queso-cremoso', 25),
  ('cebollas-rellenos-de-quinoa-y-verduras', 'queso-rallado', 10),
  ('cebollas-rellenos-de-quinoa-y-verduras', 'aceite', 4),
  ('tomates-rellenos-de-carne', 'tomate', 2.5),
  ('tomates-rellenos-de-carne', 'carne-picada-magra', 120),
  ('tomates-rellenos-de-carne', 'cebolla', 0.5),
  ('tomates-rellenos-de-carne', 'queso-rallado', 20),
  ('tomates-rellenos-de-carne', 'aceite', 4),
  ('papas-rellenos-de-champinones-y-queso', 'papa', 250),
  ('papas-rellenos-de-champinones-y-queso', 'champinones', 100),
  ('papas-rellenos-de-champinones-y-queso', 'queso-cremoso', 40),
  ('papas-rellenos-de-champinones-y-queso', 'cebolla', 0.5),
  ('papas-rellenos-de-champinones-y-queso', 'aceite', 9),
  ('papas-rellenos-de-champinones-y-queso', 'queso-rallado', 10),
  ('calabacines-rellenos-de-carne', 'zapallito', 2),
  ('calabacines-rellenos-de-carne', 'carne-picada-magra', 120),
  ('calabacines-rellenos-de-carne', 'cebolla', 0.5),
  ('calabacines-rellenos-de-carne', 'queso-rallado', 20),
  ('calabacines-rellenos-de-carne', 'aceite', 4),
  ('berenjenas-rellenos-de-lentejas', 'berenjena', 1),
  ('berenjenas-rellenos-de-lentejas', 'lentejas-hervidas', 120),
  ('berenjenas-rellenos-de-lentejas', 'cebolla', 0.5),
  ('berenjenas-rellenos-de-lentejas', 'tomate-triturado', 40),
  ('berenjenas-rellenos-de-lentejas', 'queso-rallado', 20),
  ('berenjenas-rellenos-de-lentejas', 'aceite', 4),
  ('zapallitos-rellenos-de-champinones-y-queso', 'zapallito', 2),
  ('zapallitos-rellenos-de-champinones-y-queso', 'champinones', 100),
  ('zapallitos-rellenos-de-champinones-y-queso', 'queso-cremoso', 40),
  ('zapallitos-rellenos-de-champinones-y-queso', 'cebolla', 0.5),
  ('zapallitos-rellenos-de-champinones-y-queso', 'aceite', 9),
  ('zapallitos-rellenos-de-champinones-y-queso', 'queso-rallado', 10),
  ('calabacines-rellenos-de-pavo-y-verduras', 'zapallito', 2),
  ('calabacines-rellenos-de-pavo-y-verduras', 'picada-pavo', 120),
  ('calabacines-rellenos-de-pavo-y-verduras', 'zanahoria', 0.5),
  ('calabacines-rellenos-de-pavo-y-verduras', 'cebolla', 0.5),
  ('calabacines-rellenos-de-pavo-y-verduras', 'queso-rallado', 20),
  ('calabacines-rellenos-de-pavo-y-verduras', 'aceite', 4),
  ('berenjenas-rellenos-de-garbanzos-y-verduras', 'berenjena', 1),
  ('berenjenas-rellenos-de-garbanzos-y-verduras', 'garbanzos-hervidos', 100),
  ('berenjenas-rellenos-de-garbanzos-y-verduras', 'zanahoria', 0.5),
  ('berenjenas-rellenos-de-garbanzos-y-verduras', 'cebolla', 0.5),
  ('berenjenas-rellenos-de-garbanzos-y-verduras', 'tomate-triturado', 40),
  ('berenjenas-rellenos-de-garbanzos-y-verduras', 'queso-rallado', 10),
  ('berenjenas-rellenos-de-garbanzos-y-verduras', 'aceite', 4),
  ('berenjenas-rellenos-de-pavo-y-verduras', 'berenjena', 1),
  ('berenjenas-rellenos-de-pavo-y-verduras', 'picada-pavo', 120),
  ('berenjenas-rellenos-de-pavo-y-verduras', 'zanahoria', 0.5),
  ('berenjenas-rellenos-de-pavo-y-verduras', 'cebolla', 0.5),
  ('berenjenas-rellenos-de-pavo-y-verduras', 'queso-rallado', 20),
  ('berenjenas-rellenos-de-pavo-y-verduras', 'aceite', 4),
  ('calabacines-rellenos-de-pollo-y-queso', 'zapallito', 2),
  ('calabacines-rellenos-de-pollo-y-queso', 'picada-pollo', 120),
  ('calabacines-rellenos-de-pollo-y-queso', 'queso-cremoso', 30),
  ('calabacines-rellenos-de-pollo-y-queso', 'cebolla', 0.5),
  ('calabacines-rellenos-de-pollo-y-queso', 'queso-rallado', 10),
  ('calabacines-rellenos-de-pollo-y-queso', 'aceite', 4),
  ('cebollas-rellenos-de-arroz-y-atun', 'cebolla', 2),
  ('cebollas-rellenos-de-arroz-y-atun', 'arroz-hervido', 80),
  ('cebollas-rellenos-de-arroz-y-atun', 'atun-natural', 1),
  ('cebollas-rellenos-de-arroz-y-atun', 'tomate', 0.5),
  ('cebollas-rellenos-de-arroz-y-atun', 'queso-rallado', 10),
  ('cebollas-rellenos-de-arroz-y-atun', 'aceite', 4),
  ('cebollas-rellenos-de-champinones-y-queso', 'cebolla', 2.5),
  ('cebollas-rellenos-de-champinones-y-queso', 'champinones', 100),
  ('cebollas-rellenos-de-champinones-y-queso', 'queso-cremoso', 40),
  ('cebollas-rellenos-de-champinones-y-queso', 'aceite', 9),
  ('cebollas-rellenos-de-champinones-y-queso', 'queso-rallado', 10),
  ('morrones-rellenos-de-champinones-y-queso', 'morron', 1.5),
  ('morrones-rellenos-de-champinones-y-queso', 'champinones', 100),
  ('morrones-rellenos-de-champinones-y-queso', 'queso-cremoso', 40),
  ('morrones-rellenos-de-champinones-y-queso', 'cebolla', 0.5),
  ('morrones-rellenos-de-champinones-y-queso', 'aceite', 9),
  ('morrones-rellenos-de-champinones-y-queso', 'queso-rallado', 10)
) as v(recipe_slug, food_slug, qty)
join public.recipes r on r.slug = v.recipe_slug
join public.foods f on f.slug = v.food_slug
on conflict do nothing;
