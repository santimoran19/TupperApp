-- Sexta tanda de la base (1.25): recetas, parte 2 de 8. Después de seed-8-alimentos.sql. Se puede correr de nuevo: agrega solo lo que falta. Generado con scripts/gen-seed.mjs

insert into public.recipes (slug, name, minutes, servings, meal_types, portable, steps) values
  ('salteado-de-salmon-picante-con-kale-y-champinones-sobre', 'Salteado de salmón picante con kale y champiñones sobre quinoa', 32, 1, '{almuerzo,cena}', true, 'Enjuagás la quinoa, la hervís 12 minutos en el doble de agua con sal y la dejás tapada 5 minutos.
Preparás las verduras: el kale sin los tallos y cortado fino, los champiñones en láminas y la cebolla en plumas. Picás el ajo.
Cortás el salmón en cubos, los salpimentás y los dorás en el wok caliente con la mitad del aceite, 1 minuto por lado. Los retirás con cuidado para que no se rompan.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Mezclás la soja con la salsa picante, la miel y 2 cucharadas de agua. La volcás sobre las verduras, devolvés el salmón al wok y mezclás 1 minuto.
Servís sobre quinoa con semillas de sésamo por arriba.'),
  ('wok-de-salmon-con-miel-y-soja-con-zapallito-morron-y', 'Wok de salmón con miel y soja con zapallito, morrón y cebolla', 22, 1, '{almuerzo,cena}', true, 'Preparás las verduras: el zapallito en medias lunas, el morrón en tiras y la cebolla en plumas. Picás el ajo.
Cortás el salmón en cubos, los salpimentás y los dorás en el wok caliente con la mitad del aceite, 1 minuto por lado. Los retirás con cuidado para que no se rompan.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Mezclás la salsa de soja con la miel y 2 cucharadas de agua. La volcás sobre las verduras, devolvés el salmón al wok y mezclás 1 minuto.
Servís con semillas de sésamo por arriba.'),
  ('wok-de-pollo-picante-con-berenjena-morron-y-cebolla-2', 'Wok de pollo picante con berenjena, morrón y cebolla morada sobre cuscús', 29, 1, '{almuerzo,cena}', true, 'Cubrís el cuscús con la misma cantidad de agua caliente y sal, tapás 5 minutos y lo desgranás con un tenedor.
Preparás las verduras: la berenjena en cubos, el morrón en tiras y la cebolla morada en plumas. Picás el ajo.
Cortás la pechuga en tiras finas, las salpimentás y las sellás en el wok bien caliente con la mitad del aceite, 4–5 minutos, hasta que estén doradas. Las retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Mezclás la soja con la salsa picante, la miel y 2 cucharadas de agua. La volcás sobre las verduras, devolvés el pollo al wok y mezclás 1 minuto.
Servís sobre cuscús con semillas de sésamo por arriba.'),
  ('wok-de-salmon-al-limon-con-champinones-espinaca-y', 'Wok de salmón al limón con champiñones, espinaca y cebolla sobre quinoa', 32, 1, '{almuerzo,cena}', true, 'Enjuagás la quinoa, la hervís 12 minutos en el doble de agua con sal y la dejás tapada 5 minutos.
Preparás las verduras: los champiñones en láminas, la cebolla en plumas y la espinaca lavada. Picás el ajo.
Cortás el salmón en cubos, los salpimentás y los dorás en el wok caliente con la mitad del aceite, 1 minuto por lado. Los retirás con cuidado para que no se rompan.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Mezclás la soja con el jugo de limón, la miel y 2 cucharadas de agua. La volcás sobre las verduras, devolvés el salmón al wok y mezclás 1 minuto.
Servís sobre quinoa con semillas de sésamo por arriba.'),
  ('wok-de-carne-agridulce-con-zanahoria-cebolla-y-morron', 'Wok de carne agridulce con zanahoria, cebolla y morrón sobre fideos', 32, 1, '{almuerzo,cena}', true, 'Hervís los fideos al dente, los escurrís y los pasás por un chorrito de aceite para que no se peguen.
Preparás las verduras: la zanahoria en bastones finos, la cebolla en plumas y el morrón en tiras. Picás el ajo.
Cortás la nalga en tiras finas a contrapelo y las sellás en el wok humeante con la mitad del aceite, 2–3 minutos, sin amontonarlas. Las retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Mezclás el ketchup con la soja, el vinagre, el azúcar y 3 cucharadas de agua. La volcás sobre las verduras, devolvés la carne al wok y mezclás 1 minuto.
Servís sobre fideos con semillas de sésamo por arriba.'),
  ('wok-de-carne-con-salsa-de-mani-con-brocoli-y-morron', 'Wok de carne con salsa de maní con brócoli y morrón sobre quinoa', 32, 1, '{almuerzo,cena}', true, 'Enjuagás la quinoa, la hervís 12 minutos en el doble de agua con sal y la dejás tapada 5 minutos.
Preparás las verduras: el brócoli en arbolitos chicos y el morrón en tiras. Picás el ajo.
Cortás la nalga en tiras finas a contrapelo y las sellás en el wok humeante con la mitad del aceite, 2–3 minutos, sin amontonarlas. Las retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Mezclás la pasta de maní con la soja, el jugo de limón y 3 cucharadas de agua tibia hasta que quede lisa. La volcás sobre las verduras, devolvés la carne al wok y mezclás 1 minuto.
Servís sobre quinoa con semillas de sésamo por arriba.'),
  ('wok-de-huevo-al-limon-con-chauchas-zanahoria-y-repollo', 'Wok de huevo al limón con chauchas, zanahoria y repollo sobre quinoa', 29, 1, '{almuerzo,cena}', true, 'Enjuagás la quinoa, la hervís 12 minutos en el doble de agua con sal y la dejás tapada 5 minutos.
Preparás las verduras: las chauchas en trozos, la zanahoria en bastones y el repollo en tiras finas. Picás el ajo.
Batís los huevos con una pizca de sal. Los cocinás en el wok con la mitad del aceite, revolviendo, hasta que cuajen pero queden jugosos (1–2 minutos). Los retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Mezclás la soja con el jugo de limón, la miel y 2 cucharadas de agua. La volcás sobre las verduras, devolvés el huevo al wok y mezclás 1 minuto.
Servís sobre quinoa con semillas de sésamo por arriba.'),
  ('wok-de-cuadril-al-limon-con-brocoli-y-morron-sobre', 'Wok de cuadril al limón con brócoli y morrón sobre quinoa', 32, 1, '{almuerzo,cena}', true, 'Enjuagás la quinoa, la hervís 12 minutos en el doble de agua con sal y la dejás tapada 5 minutos.
Preparás las verduras: el brócoli en arbolitos chicos y el morrón en tiras. Picás el ajo.
Cortás el cuadril en tiras finas a contrapelo y las sellás en el wok humeante con la mitad del aceite, 2–3 minutos. Las retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Mezclás la soja con el jugo de limón, la miel y 2 cucharadas de agua. La volcás sobre las verduras, devolvés el cuadril al wok y mezclás 1 minuto.
Servís sobre quinoa con semillas de sésamo por arriba.'),
  ('wok-de-huevo-al-limon-con-esparragos-y-zanahoria-sobre', 'Wok de huevo al limón con espárragos y zanahoria sobre cuscús', 26, 1, '{almuerzo,cena}', true, 'Cubrís el cuscús con la misma cantidad de agua caliente y sal, tapás 5 minutos y lo desgranás con un tenedor.
Preparás las verduras: los espárragos en trozos de 4 cm, la zanahoria en bastones finos y la cebolla de verdeo en rodajas. Picás el ajo.
Batís los huevos con una pizca de sal. Los cocinás en el wok con la mitad del aceite, revolviendo, hasta que cuajen pero queden jugosos (1–2 minutos). Los retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Mezclás la soja con el jugo de limón, la miel y 2 cucharadas de agua. La volcás sobre las verduras, devolvés el huevo al wok y mezclás 1 minuto.
Servís sobre cuscús con semillas de sésamo por arriba.'),
  ('wok-de-cerdo-agridulce-con-brocoli-y-morron-sobre', 'Wok de cerdo agridulce con brócoli y morrón sobre fideos de arroz', 30, 1, '{almuerzo,cena}', true, 'Hidratás los fideos de arroz en agua recién hervida, 6 minutos, y los escurrís.
Preparás las verduras: el brócoli en arbolitos chicos y el morrón en tiras. Picás el ajo.
Cortás el solomillo de cerdo en tiras finas, las salpimentás y las sellás en el wok bien caliente con la mitad del aceite, 4 minutos. Las retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Mezclás el ketchup con la soja, el vinagre, el azúcar y 3 cucharadas de agua. La volcás sobre las verduras, devolvés el cerdo al wok y mezclás 1 minuto.
Servís sobre fideos de arroz con semillas de sésamo por arriba.'),
  ('wok-de-salmon-al-teriyaki-con-kale-y-champinones-sobre', 'Wok de salmón al teriyaki con kale y champiñones sobre cuscús', 29, 1, '{almuerzo,cena}', true, 'Cubrís el cuscús con la misma cantidad de agua caliente y sal, tapás 5 minutos y lo desgranás con un tenedor.
Preparás las verduras: el kale sin los tallos y cortado fino, los champiñones en láminas y la cebolla en plumas. Picás el ajo.
Cortás el salmón en cubos, los salpimentás y los dorás en el wok caliente con la mitad del aceite, 1 minuto por lado. Los retirás con cuidado para que no se rompan.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Diluís el teriyaki con 2 cucharadas de agua. La volcás sobre las verduras, devolvés el salmón al wok y mezclás 1 minuto.
Servís sobre cuscús con semillas de sésamo por arriba.'),
  ('wok-de-tempeh-picante-con-zanahoria-arvejas-y-choclo', 'Wok de tempeh picante con zanahoria, arvejas y choclo sobre arroz integral', 32, 1, '{almuerzo,cena}', true, 'Hervís el arroz integral en abundante agua con sal, 30 minutos, y lo escurrís.
Preparás las verduras: la zanahoria en cubitos; las arvejas y el choclo van enteros. Picás el ajo.
Cortás el tempeh en tiras finas y las dorás en el wok caliente con la mitad del aceite, 3 minutos por lado. Las retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Mezclás la soja con la salsa picante, la miel y 2 cucharadas de agua. La volcás sobre las verduras, devolvés el tempeh al wok y mezclás 1 minuto.
Servís sobre arroz integral con semillas de sésamo por arriba.'),
  ('wok-de-pollo-con-miso-con-kale-y-champinones-sobre', 'Wok de pollo con miso con kale y champiñones sobre arroz basmati', 32, 1, '{almuerzo,cena}', true, 'Lavás el arroz basmati hasta que el agua salga clara, lo hervís 10 minutos y lo escurrís.
Preparás las verduras: el kale sin los tallos y cortado fino, los champiñones en láminas y la cebolla en plumas. Picás el ajo.
Cortás la pechuga en tiras finas, las salpimentás y las sellás en el wok bien caliente con la mitad del aceite, 4–5 minutos, hasta que estén doradas. Las retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Disolvés la pasta de miso en 4 cucharadas de agua caliente con el vinagre. La volcás sobre las verduras, devolvés el pollo al wok y mezclás 1 minuto.
Servís sobre arroz basmati con semillas de sésamo por arriba.'),
  ('wok-de-huevo-con-miel-y-soja-con-zanahoria-arvejas-y', 'Wok de huevo con miel y soja con zanahoria, arvejas y choclo sobre arroz', 29, 1, '{almuerzo,cena}', true, 'Hervís el arroz en abundante agua con sal, 12 minutos, y lo escurrís.
Preparás las verduras: la zanahoria en cubitos; las arvejas y el choclo van enteros. Picás el ajo.
Batís los huevos con una pizca de sal. Los cocinás en el wok con la mitad del aceite, revolviendo, hasta que cuajen pero queden jugosos (1–2 minutos). Los retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Mezclás la salsa de soja con la miel y 2 cucharadas de agua. La volcás sobre las verduras, devolvés el huevo al wok y mezclás 1 minuto.
Servís sobre arroz con semillas de sésamo por arriba.'),
  ('wok-de-huevo-al-teriyaki-con-coliflor-y-zanahoria', 'Wok de huevo al teriyaki con coliflor y zanahoria', 19, 1, '{almuerzo,cena}', true, 'Preparás las verduras: la coliflor en arbolitos chicos, la zanahoria en rodajas finas y la cebolla en plumas. Picás el ajo.
Batís los huevos con una pizca de sal. Los cocinás en el wok con la mitad del aceite, revolviendo, hasta que cuajen pero queden jugosos (1–2 minutos). Los retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Diluís el teriyaki con 2 cucharadas de agua. La volcás sobre las verduras, devolvés el huevo al wok y mezclás 1 minuto.
Servís con semillas de sésamo por arriba.'),
  ('wok-de-pollo-agridulce-con-kale-y-champinones-sobre', 'Wok de pollo agridulce con kale y champiñones sobre fideos', 32, 1, '{almuerzo,cena}', true, 'Hervís los fideos al dente, los escurrís y los pasás por un chorrito de aceite para que no se peguen.
Preparás las verduras: el kale sin los tallos y cortado fino, los champiñones en láminas y la cebolla en plumas. Picás el ajo.
Cortás la pechuga en tiras finas, las salpimentás y las sellás en el wok bien caliente con la mitad del aceite, 4–5 minutos, hasta que estén doradas. Las retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Mezclás el ketchup con la soja, el vinagre, el azúcar y 3 cucharadas de agua. La volcás sobre las verduras, devolvés el pollo al wok y mezclás 1 minuto.
Servís sobre fideos con semillas de sésamo por arriba.'),
  ('wok-de-huevo-agridulce-con-champinones-espinaca-y', 'Wok de huevo agridulce con champiñones, espinaca y cebolla sobre cuscús', 26, 1, '{almuerzo,cena}', true, 'Cubrís el cuscús con la misma cantidad de agua caliente y sal, tapás 5 minutos y lo desgranás con un tenedor.
Preparás las verduras: los champiñones en láminas, la cebolla en plumas y la espinaca lavada. Picás el ajo.
Batís los huevos con una pizca de sal. Los cocinás en el wok con la mitad del aceite, revolviendo, hasta que cuajen pero queden jugosos (1–2 minutos). Los retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Mezclás el ketchup con la soja, el vinagre, el azúcar y 3 cucharadas de agua. La volcás sobre las verduras, devolvés el huevo al wok y mezclás 1 minuto.
Servís sobre cuscús con semillas de sésamo por arriba.'),
  ('wok-de-pavo-con-miso-con-zanahoria-cebolla-y-morron', 'Wok de pavo con miso con zanahoria, cebolla y morrón sobre arroz integral', 32, 1, '{almuerzo,cena}', true, 'Hervís el arroz integral en abundante agua con sal, 30 minutos, y lo escurrís.
Preparás las verduras: la zanahoria en bastones finos, la cebolla en plumas y el morrón en tiras. Picás el ajo.
Cortás la pechuga de pavo en tiras finas, las salpimentás y las sellás en el wok bien caliente con la mitad del aceite, 4 minutos. Las retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Disolvés la pasta de miso en 4 cucharadas de agua caliente con el vinagre. La volcás sobre las verduras, devolvés el pavo al wok y mezclás 1 minuto.
Servís sobre arroz integral con semillas de sésamo por arriba.'),
  ('wok-de-langostinos-al-limon-con-esparragos-y-zanahoria', 'Wok de langostinos al limón con espárragos y zanahoria sobre cuscús', 27, 1, '{almuerzo,cena}', true, 'Cubrís el cuscús con la misma cantidad de agua caliente y sal, tapás 5 minutos y lo desgranás con un tenedor.
Preparás las verduras: los espárragos en trozos de 4 cm, la zanahoria en bastones finos y la cebolla de verdeo en rodajas. Picás el ajo.
Pelás los langostinos, los secás bien y los salteás en el wok bien caliente con la mitad del aceite, 1–2 minutos por lado. Los retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Mezclás la soja con el jugo de limón, la miel y 2 cucharadas de agua. La volcás sobre las verduras, devolvés los langostinos al wok y mezclás 1 minuto.
Servís sobre cuscús con semillas de sésamo por arriba.'),
  ('salteado-de-salmon-al-teriyaki-con-zanahoria-arvejas-y', 'Salteado de salmón al teriyaki con zanahoria, arvejas y choclo', 22, 1, '{almuerzo,cena}', true, 'Preparás las verduras: la zanahoria en cubitos; las arvejas y el choclo van enteros. Picás el ajo.
Cortás el salmón en cubos, los salpimentás y los dorás en el wok caliente con la mitad del aceite, 1 minuto por lado. Los retirás con cuidado para que no se rompan.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Diluís el teriyaki con 2 cucharadas de agua. La volcás sobre las verduras, devolvés el salmón al wok y mezclás 1 minuto.
Servís con semillas de sésamo por arriba.'),
  ('agnolotis-con-jamon-y-arvejas', 'Agnolotis con jamón y arvejas', 21, 1, '{almuerzo,cena}', true, 'Hervís los agnolotis en agua con sal hasta que floten y 1 minuto más. Los sacás con espumadera.
Dorás la cebolla con el aceite, sumás el jamón en cubitos y las arvejas, 3 minutos. Agregás la crema, sal, pimienta y un poco de agua de cocción.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís enseguida.'),
  ('tallarines-con-cuatro-quesos', 'Tallarines con cuatro quesos', 16, 1, '{almuerzo,cena}', true, 'Hervís los tallarines frescos en abundante agua con sal, 3 minutos. Reservás un poco del agua de cocción y escurrís.
Calentás la leche a fuego bajo y derretís los quesos cortados en cubos, revolviendo, hasta que quede una salsa lisa. Pimienta recién molida.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís con un poco de queso rallado si querés.'),
  ('noquis-con-pesto-y-tomates-cherry', 'Ñoquis con pesto y tomates cherry', 12, 1, '{almuerzo,cena}', true, 'Hervís los ñoquis en agua con sal; cuando suben a la superficie, esperás 1 minuto y los sacás con espumadera.
Cortás los tomates cherry por la mitad. Mezclás el pesto con 2 cucharadas del agua de cocción para que quede cremoso.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís con un poco de queso rallado si querés.'),
  ('fideos-con-zucchini-y-limon', 'Fideos con zucchini y limón', 27, 1, '{almuerzo,cena}', true, 'Hervís los fideos en abundante agua con sal, al dente (unos 2 minutos menos que lo que dice el paquete). Reservás una taza del agua de cocción y escurrís.
Rallás los zapallitos con rallador grueso y los salteás 3 minutos con el aceite de oliva y el ajo. Fuera del fuego sumás el jugo de limón, ralladura y parmesano.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Probás y corregís la sal antes de servir.'),
  ('fideos-con-albondigas', 'Fideos con albóndigas', 52, 1, '{almuerzo,cena}', true, 'Hervís los fideos en abundante agua con sal, al dente (unos 2 minutos menos que lo que dice el paquete). Reservás una taza del agua de cocción y escurrís.
Mezclás la carne con la cebolla rallada, el ajo picado, el perejil, el pan rallado, el huevo, sal y pimienta; armás albóndigas del tamaño de una nuez. Las dorás en el aceite 5 minutos, sumás el tomate triturado y cocinás tapadas 20 minutos.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís enseguida.'),
  ('tallarines-con-jamon-y-arvejas', 'Tallarines con jamón y arvejas', 19, 1, '{almuerzo,cena}', true, 'Hervís los tallarines frescos en abundante agua con sal, 3 minutos. Reservás un poco del agua de cocción y escurrís.
Dorás la cebolla con el aceite, sumás el jamón en cubitos y las arvejas, 3 minutos. Agregás la crema, sal, pimienta y un poco de agua de cocción.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís enseguida.'),
  ('fideos-de-arroz-con-calabaza-y-queso-azul', 'Fideos de arroz con calabaza y queso azul', 38, 1, '{almuerzo,cena}', true, 'Hidratás los fideos de arroz en agua recién hervida, 6–7 minutos, y los escurrís.
Asás la calabaza en cubos con el aceite, 20 minutos a 200 °C. Dorás la cebolla, sumás la calabaza y el queso azul desmenuzado, y revolvés hasta que se derrita. Terminás con nueces picadas.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Probás y corregís la sal antes de servir.'),
  ('espaguetis-con-atun-y-tomate', 'Espaguetis con atún y tomate', 32, 1, '{almuerzo,cena}', true, 'Hervís los espaguetis en abundante agua con sal, al dente. Reservás una taza del agua de cocción y escurrís.
Dorás la cebolla con el aceite, sumás el tomate triturado, sal y pimienta y cocinás 10 minutos. Agregás el atún escurrido y las aceitunas picadas, 3 minutos más, y terminás con perejil.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís enseguida.'),
  ('tallarines-con-verduras-asadas', 'Tallarines con verduras asadas', 39, 1, '{almuerzo,cena}', true, 'Hervís los tallarines frescos en abundante agua con sal, 3 minutos. Reservás un poco del agua de cocción y escurrís.
Cortás las verduras en cubos, las mezclás con el aceite, sal, ajo y orégano, y las asás en horno a 220 °C, 25 minutos, dándolas vuelta a la mitad. Al servir sumás albahaca.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Probás y corregís la sal antes de servir.'),
  ('fideos-con-cuatro-quesos', 'Fideos con cuatro quesos', 24, 1, '{almuerzo,cena}', true, 'Hervís los fideos en abundante agua con sal, al dente (unos 2 minutos menos que lo que dice el paquete). Reservás una taza del agua de cocción y escurrís.
Calentás la leche a fuego bajo y derretís los quesos cortados en cubos, revolviendo, hasta que quede una salsa lisa. Pimienta recién molida.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís con un poco de queso rallado si querés.'),
  ('fideos-integrales-con-langostinos-al-ajillo', 'Fideos integrales con langostinos al ajillo', 27, 1, '{almuerzo,cena}', true, 'Hervís los fideos integrales en abundante agua con sal, al dente. Reservás una taza del agua de cocción y escurrís.
Dorás el ajo laminado con el aceite de oliva, sumás los langostinos pelados 2 minutos por lado, y terminás con jugo de limón y perejil picado.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís enseguida.'),
  ('tallarines-con-albondigas', 'Tallarines con albóndigas', 44, 1, '{almuerzo,cena}', true, 'Hervís los tallarines frescos en abundante agua con sal, 3 minutos. Reservás un poco del agua de cocción y escurrís.
Mezclás la carne con la cebolla rallada, el ajo picado, el perejil, el pan rallado, el huevo, sal y pimienta; armás albóndigas del tamaño de una nuez. Las dorás en el aceite 5 minutos, sumás el tomate triturado y cocinás tapadas 20 minutos.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís con un poco de queso rallado si querés.'),
  ('tallarines-con-ajo-y-aceite', 'Tallarines con ajo y aceite', 12, 1, '{almuerzo,cena}', true, 'Hervís los tallarines frescos en abundante agua con sal, 3 minutos. Reservás un poco del agua de cocción y escurrís.
Calentás el aceite de oliva a fuego bajo con el ajo laminado, 2–3 minutos, sin que se queme. Sumás perejil picado y un poco de agua de cocción.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís bien caliente.'),
  ('tallarines-con-zucchini-y-limon', 'Tallarines con zucchini y limón', 19, 1, '{almuerzo,cena}', true, 'Hervís los tallarines frescos en abundante agua con sal, 3 minutos. Reservás un poco del agua de cocción y escurrís.
Rallás los zapallitos con rallador grueso y los salteás 3 minutos con el aceite de oliva y el ajo. Fuera del fuego sumás el jugo de limón, ralladura y parmesano.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís enseguida.'),
  ('fideos-integrales-con-puttanesca', 'Fideos integrales con puttanesca', 32, 1, '{almuerzo,cena}', true, 'Hervís los fideos integrales en abundante agua con sal, al dente. Reservás una taza del agua de cocción y escurrís.
Dorás el ajo y las anchoas picadas con el aceite hasta que se deshagan. Sumás el tomate triturado, las aceitunas y las alcaparras, y cocinás 12 minutos. Terminás con perejil.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís con un poco de queso rallado si querés.'),
  ('noquis-con-salsa-blanca-y-jamon', 'Ñoquis con salsa blanca y jamón', 16, 1, '{almuerzo,cena}', true, 'Hervís los ñoquis en agua con sal; cuando suben a la superficie, esperás 1 minuto y los sacás con espumadera.
Calentás la salsa blanca con el jamón en cubitos y un chorrito de agua de cocción. Sazonás con nuez moscada y pimienta.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís bien caliente.'),
  ('espaguetis-con-brocoli-y-ajo', 'Espaguetis con brócoli y ajo', 27, 1, '{almuerzo,cena}', true, 'Hervís los espaguetis en abundante agua con sal, al dente. Reservás una taza del agua de cocción y escurrís.
Hervís el brócoli en trocitos junto con la pasta los últimos 4 minutos. En una sartén dorás el ajo laminado con el aceite de oliva; sumás el brócoli y lo aplastás un poco con el tenedor.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís bien caliente.'),
  ('ravioles-con-jamon-y-arvejas', 'Ravioles con jamón y arvejas', 21, 1, '{almuerzo,cena}', true, 'Hervís los ravioles en agua con sal hasta que floten y 1 minuto más. Los sacás con espumadera, sin romperlos.
Dorás la cebolla con el aceite, sumás el jamón en cubitos y las arvejas, 3 minutos. Agregás la crema, sal, pimienta y un poco de agua de cocción.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís enseguida.'),
  ('noquis-con-salsa-de-calabaza', 'Ñoquis con salsa de calabaza', 34, 1, '{almuerzo,cena}', true, 'Hervís los ñoquis en agua con sal; cuando suben a la superficie, esperás 1 minuto y los sacás con espumadera.
Hervís la calabaza en cubos hasta que esté tierna (15 minutos). Dorás la cebolla y el ajo con el aceite, sumás la calabaza y un poco del agua de cocción y lo hacés puré con un tenedor o una minipimer. Sazonás con sal, pimienta y nuez moscada.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís enseguida.'),
  ('tallarines-con-salsa-fileto', 'Tallarines con salsa fileto', 24, 1, '{almuerzo,cena}', true, 'Hervís los tallarines frescos en abundante agua con sal, 3 minutos. Reservás un poco del agua de cocción y escurrís.
Dorás la cebolla picada fina y el ajo con el aceite, 4 minutos. Sumás el tomate triturado, sal y una pizca de azúcar, y cocinás 15 minutos a fuego bajo. Al final agregás la albahaca.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís con un poco de queso rallado si querés.'),
  ('tallarines-con-berenjenas-y-tomate', 'Tallarines con berenjenas y tomate', 29, 1, '{almuerzo,cena}', true, 'Hervís los tallarines frescos en abundante agua con sal, 3 minutos. Reservás un poco del agua de cocción y escurrís.
Cortás la berenjena en cubos y la dorás con el aceite, 8 minutos. Sumás la cebolla picada y el tomate triturado, y cocinás 10 minutos. Servís con la muzzarella en cubos, que se derrite con el calor.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís enseguida.'),
  ('fideos-con-calabaza-y-queso-azul', 'Fideos con calabaza y queso azul', 42, 1, '{almuerzo,cena}', true, 'Hervís los fideos en abundante agua con sal, al dente (unos 2 minutos menos que lo que dice el paquete). Reservás una taza del agua de cocción y escurrís.
Asás la calabaza en cubos con el aceite, 20 minutos a 200 °C. Dorás la cebolla, sumás la calabaza y el queso azul desmenuzado, y revolvés hasta que se derrita. Terminás con nueces picadas.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís bien caliente.'),
  ('fideos-con-pesto-y-tomates-cherry', 'Fideos con pesto y tomates cherry', 20, 1, '{almuerzo,cena}', true, 'Hervís los fideos en abundante agua con sal, al dente (unos 2 minutos menos que lo que dice el paquete). Reservás una taza del agua de cocción y escurrís.
Cortás los tomates cherry por la mitad. Mezclás el pesto con 2 cucharadas del agua de cocción para que quede cremoso.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Probás y corregís la sal antes de servir.'),
  ('sorrentinos-con-rucula-cherry-y-parmesano', 'Sorrentinos con rúcula, cherry y parmesano', 14, 1, '{almuerzo,cena}', true, 'Hervís los sorrentinos en agua con sal hasta que floten y 2 minutos más. Los sacás con espumadera.
Cortás los cherry al medio y los salteás 2 minutos con el aceite y el ajo. Mezclás con la pasta caliente, sumás la rúcula (se marchita con el calor) y lascas de parmesano.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís bien caliente.'),
  ('tallarines-con-mejillones-y-tomate', 'Tallarines con mejillones y tomate', 22, 1, '{almuerzo,cena}', true, 'Hervís los tallarines frescos en abundante agua con sal, 3 minutos. Reservás un poco del agua de cocción y escurrís.
Dorás el ajo con el aceite, sumás el tomate triturado y cocinás 8 minutos. Agregás los mejillones cocidos y perejil, 2 minutos más.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís con un poco de queso rallado si querés.'),
  ('espaguetis-con-puttanesca', 'Espaguetis con puttanesca', 32, 1, '{almuerzo,cena}', true, 'Hervís los espaguetis en abundante agua con sal, al dente. Reservás una taza del agua de cocción y escurrís.
Dorás el ajo y las anchoas picadas con el aceite hasta que se deshagan. Sumás el tomate triturado, las aceitunas y las alcaparras, y cocinás 12 minutos. Terminás con perejil.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís enseguida.'),
  ('noquis-con-rucula-cherry-y-parmesano', 'Ñoquis con rúcula, cherry y parmesano', 12, 1, '{almuerzo,cena}', true, 'Hervís los ñoquis en agua con sal; cuando suben a la superficie, esperás 1 minuto y los sacás con espumadera.
Cortás los cherry al medio y los salteás 2 minutos con el aceite y el ajo. Mezclás con la pasta caliente, sumás la rúcula (se marchita con el calor) y lascas de parmesano.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís enseguida.'),
  ('fideos-integrales-con-verduras-asadas', 'Fideos integrales con verduras asadas', 47, 1, '{almuerzo,cena}', true, 'Hervís los fideos integrales en abundante agua con sal, al dente. Reservás una taza del agua de cocción y escurrís.
Cortás las verduras en cubos, las mezclás con el aceite, sal, ajo y orégano, y las asás en horno a 220 °C, 25 minutos, dándolas vuelta a la mitad. Al servir sumás albahaca.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Probás y corregís la sal antes de servir.'),
  ('agnolotis-con-tomates-asados-y-albahaca', 'Agnolotis con tomates asados y albahaca', 36, 1, '{almuerzo,cena}', true, 'Hervís los agnolotis en agua con sal hasta que floten y 1 minuto más. Los sacás con espumadera.
Asás los tomates cherry con el ajo, el aceite de oliva, sal y orégano en horno a 200 °C, 20 minutos, hasta que revienten. Los aplastás un poco con el tenedor y sumás albahaca.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís con un poco de queso rallado si querés.'),
  ('espaguetis-con-pollo-champinones-y-crema', 'Espaguetis con pollo, champiñones y crema', 34, 1, '{almuerzo,cena}', true, 'Hervís los espaguetis en abundante agua con sal, al dente. Reservás una taza del agua de cocción y escurrís.
Dorás la pechuga en cubos con el aceite, 5 minutos. Sumás la cebolla picada y los champiñones, 5 minutos más. Agregás la crema, sal y pimienta y cocinás 3 minutos.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís enseguida.'),
  ('espaguetis-con-crema-y-champinones', 'Espaguetis con crema y champiñones', 27, 1, '{almuerzo,cena}', true, 'Hervís los espaguetis en abundante agua con sal, al dente. Reservás una taza del agua de cocción y escurrís.
Salteás la cebolla y el ajo con el aceite. Sumás los champiñones laminados hasta que larguen el agua y se doren (6 minutos). Agregás la crema, sal, pimienta y un poco de agua de cocción; cocinás 3 minutos.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Probás y corregís la sal antes de servir.'),
  ('sorrentinos-con-jamon-y-arvejas', 'Sorrentinos con jamón y arvejas', 21, 1, '{almuerzo,cena}', true, 'Hervís los sorrentinos en agua con sal hasta que floten y 2 minutos más. Los sacás con espumadera.
Dorás la cebolla con el aceite, sumás el jamón en cubitos y las arvejas, 3 minutos. Agregás la crema, sal, pimienta y un poco de agua de cocción.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís enseguida.'),
  ('espaguetis-con-langostinos-al-ajillo', 'Espaguetis con langostinos al ajillo', 27, 1, '{almuerzo,cena}', true, 'Hervís los espaguetis en abundante agua con sal, al dente. Reservás una taza del agua de cocción y escurrís.
Dorás el ajo laminado con el aceite de oliva, sumás los langostinos pelados 2 minutos por lado, y terminás con jugo de limón y perejil picado.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís bien caliente.'),
  ('fideos-integrales-con-rucula-cherry-y-parmesano', 'Fideos integrales con rúcula, cherry y parmesano', 20, 1, '{almuerzo,cena}', true, 'Hervís los fideos integrales en abundante agua con sal, al dente. Reservás una taza del agua de cocción y escurrís.
Cortás los cherry al medio y los salteás 2 minutos con el aceite y el ajo. Mezclás con la pasta caliente, sumás la rúcula (se marchita con el calor) y lascas de parmesano.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Probás y corregís la sal antes de servir.'),
  ('espaguetis-con-rucula-cherry-y-parmesano', 'Espaguetis con rúcula, cherry y parmesano', 20, 1, '{almuerzo,cena}', true, 'Hervís los espaguetis en abundante agua con sal, al dente. Reservás una taza del agua de cocción y escurrís.
Cortás los cherry al medio y los salteás 2 minutos con el aceite y el ajo. Mezclás con la pasta caliente, sumás la rúcula (se marchita con el calor) y lascas de parmesano.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís bien caliente.'),
  ('fideos-con-espinaca-y-ricota', 'Fideos con espinaca y ricota', 27, 1, '{almuerzo,cena}', true, 'Hervís los fideos en abundante agua con sal, al dente (unos 2 minutos menos que lo que dice el paquete). Reservás una taza del agua de cocción y escurrís.
Salteás el ajo con el aceite, sumás la espinaca lavada hasta que se achique (2 minutos). Fuera del fuego mezclás con la ricota, sal, pimienta y nuez moscada, y un poco del agua de cocción.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís enseguida.'),
  ('fideos-integrales-con-tuco', 'Fideos integrales con tuco', 37, 1, '{almuerzo,cena}', true, 'Hervís los fideos integrales en abundante agua con sal, al dente. Reservás una taza del agua de cocción y escurrís.
Dorás la cebolla, el morrón y el ajo picados con el aceite, 6 minutos. Sumás el tomate triturado, orégano, sal y pimienta, y cocinás 20 minutos a fuego bajo.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Probás y corregís la sal antes de servir.'),
  ('fideos-integrales-con-brocoli-y-ajo', 'Fideos integrales con brócoli y ajo', 27, 1, '{almuerzo,cena}', true, 'Hervís los fideos integrales en abundante agua con sal, al dente. Reservás una taza del agua de cocción y escurrís.
Hervís el brócoli en trocitos junto con la pasta los últimos 4 minutos. En una sartén dorás el ajo laminado con el aceite de oliva; sumás el brócoli y lo aplastás un poco con el tenedor.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís con un poco de queso rallado si querés.'),
  ('fideos-con-atun-limon-y-rucula', 'Fideos con atún, limón y rúcula', 22, 1, '{almuerzo,cena}', true, 'Hervís los fideos en abundante agua con sal, al dente (unos 2 minutos menos que lo que dice el paquete). Reservás una taza del agua de cocción y escurrís.
Desmenuzás el atún escurrido y lo mezclás con el jugo de limón, el aceite de oliva y las alcaparras. Lo sumás a la pasta caliente con la rúcula.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís con un poco de queso rallado si querés.'),
  ('fideos-de-arroz-con-crema-y-champinones', 'Fideos de arroz con crema y champiñones', 23, 1, '{almuerzo,cena}', true, 'Hidratás los fideos de arroz en agua recién hervida, 6–7 minutos, y los escurrís.
Salteás la cebolla y el ajo con el aceite. Sumás los champiñones laminados hasta que larguen el agua y se doren (6 minutos). Agregás la crema, sal, pimienta y un poco de agua de cocción; cocinás 3 minutos.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís bien caliente.'),
  ('fideos-de-arroz-con-cuatro-quesos', 'Fideos de arroz con cuatro quesos', 20, 1, '{almuerzo,cena}', true, 'Hidratás los fideos de arroz en agua recién hervida, 6–7 minutos, y los escurrís.
Calentás la leche a fuego bajo y derretís los quesos cortados en cubos, revolviendo, hasta que quede una salsa lisa. Pimienta recién molida.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Probás y corregís la sal antes de servir.'),
  ('espaguetis-con-bolonesa-casera', 'Espaguetis con boloñesa casera', 47, 1, '{almuerzo,cena}', true, 'Hervís los espaguetis en abundante agua con sal, al dente. Reservás una taza del agua de cocción y escurrís.
Dorás la cebolla, la zanahoria rallada y el ajo con el aceite. Sumás la carne y la desgranás con un tenedor hasta que cambie de color. Agregás el tomate triturado, sal, orégano y pimienta, y cocinás 25 minutos a fuego bajo.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Probás y corregís la sal antes de servir.'),
  ('ravioles-con-tuco', 'Ravioles con tuco', 31, 1, '{almuerzo,cena}', true, 'Hervís los ravioles en agua con sal hasta que floten y 1 minuto más. Los sacás con espumadera, sin romperlos.
Dorás la cebolla, el morrón y el ajo picados con el aceite, 6 minutos. Sumás el tomate triturado, orégano, sal y pimienta, y cocinás 20 minutos a fuego bajo.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís enseguida.'),
  ('espaguetis-con-pollo-y-verduras-salteadas', 'Espaguetis con pollo y verduras salteadas', 37, 1, '{almuerzo,cena}', true, 'Hervís los espaguetis en abundante agua con sal, al dente. Reservás una taza del agua de cocción y escurrís.
Cortás la pechuga y las verduras en tiras. Dorás el pollo con el aceite 5 minutos, sumás las verduras 5 minutos y terminás con un chorrito de soja.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís bien caliente.'),
  ('fideos-con-zapallitos-y-ricota', 'Fideos con zapallitos y ricota', 30, 1, '{almuerzo,cena}', true, 'Hervís los fideos en abundante agua con sal, al dente (unos 2 minutos menos que lo que dice el paquete). Reservás una taza del agua de cocción y escurrís.
Cortás los zapallitos en cubitos y los salteás con el aceite y el ajo 6–8 minutos hasta que estén tiernos. Fuera del fuego sumás la ricota, la albahaca y un poco de agua de cocción.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís bien caliente.'),
  ('fideos-integrales-con-champinones-y-espinaca', 'Fideos integrales con champiñones y espinaca', 27, 1, '{almuerzo,cena}', true, 'Hervís los fideos integrales en abundante agua con sal, al dente. Reservás una taza del agua de cocción y escurrís.
Salteás los champiñones laminados con el aceite y el ajo hasta que se doren. Sumás la espinaca y la crema light, sal y pimienta, y cocinás 2 minutos.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Probás y corregís la sal antes de servir.'),
  ('fideos-de-arroz-con-pollo-y-brocoli', 'Fideos de arroz con pollo y brócoli', 28, 1, '{almuerzo,cena}', true, 'Hidratás los fideos de arroz en agua recién hervida, 6–7 minutos, y los escurrís.
Cortás la pechuga en cubos, la salpimentás y la dorás con el aceite 5 minutos. Sumás el ajo picado y el brócoli en arbolitos con medio vaso de agua; tapás y cocinás 6 minutos más.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís con un poco de queso rallado si querés.'),
  ('fideos-integrales-con-mejillones-y-tomate', 'Fideos integrales con mejillones y tomate', 30, 1, '{almuerzo,cena}', true, 'Hervís los fideos integrales en abundante agua con sal, al dente. Reservás una taza del agua de cocción y escurrís.
Dorás el ajo con el aceite, sumás el tomate triturado y cocinás 8 minutos. Agregás los mejillones cocidos y perejil, 2 minutos más.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Probás y corregís la sal antes de servir.'),
  ('espaguetis-con-salsa-fileto', 'Espaguetis con salsa fileto', 32, 1, '{almuerzo,cena}', true, 'Hervís los espaguetis en abundante agua con sal, al dente. Reservás una taza del agua de cocción y escurrís.
Dorás la cebolla picada fina y el ajo con el aceite, 4 minutos. Sumás el tomate triturado, sal y una pizca de azúcar, y cocinás 15 minutos a fuego bajo. Al final agregás la albahaca.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Probás y corregís la sal antes de servir.'),
  ('sorrentinos-con-salsa-de-calabaza', 'Sorrentinos con salsa de calabaza', 36, 1, '{almuerzo,cena}', true, 'Hervís los sorrentinos en agua con sal hasta que floten y 2 minutos más. Los sacás con espumadera.
Hervís la calabaza en cubos hasta que esté tierna (15 minutos). Dorás la cebolla y el ajo con el aceite, sumás la calabaza y un poco del agua de cocción y lo hacés puré con un tenedor o una minipimer. Sazonás con sal, pimienta y nuez moscada.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís enseguida.'),
  ('fideos-con-salsa-fileto', 'Fideos con salsa fileto', 32, 1, '{almuerzo,cena}', true, 'Hervís los fideos en abundante agua con sal, al dente (unos 2 minutos menos que lo que dice el paquete). Reservás una taza del agua de cocción y escurrís.
Dorás la cebolla picada fina y el ajo con el aceite, 4 minutos. Sumás el tomate triturado, sal y una pizca de azúcar, y cocinás 15 minutos a fuego bajo. Al final agregás la albahaca.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Probás y corregís la sal antes de servir.'),
  ('tallarines-con-atun-y-tomate', 'Tallarines con atún y tomate', 24, 1, '{almuerzo,cena}', true, 'Hervís los tallarines frescos en abundante agua con sal, 3 minutos. Reservás un poco del agua de cocción y escurrís.
Dorás la cebolla con el aceite, sumás el tomate triturado, sal y pimienta y cocinás 10 minutos. Agregás el atún escurrido y las aceitunas picadas, 3 minutos más, y terminás con perejil.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís bien caliente.'),
  ('fideos-de-arroz-con-morrones-asados-y-ricota', 'Fideos de arroz con morrones asados y ricota', 38, 1, '{almuerzo,cena}', true, 'Hidratás los fideos de arroz en agua recién hervida, 6–7 minutos, y los escurrís.
Asás los morrones enteros en horno fuerte 25 minutos, los pelás y los cortás en tiras. Los mezclás con el ajo picado, el aceite y la ricota.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís enseguida.'),
  ('ravioles-con-ajo-y-aceite', 'Ravioles con ajo y aceite', 14, 1, '{almuerzo,cena}', true, 'Hervís los ravioles en agua con sal hasta que floten y 1 minuto más. Los sacás con espumadera, sin romperlos.
Calentás el aceite de oliva a fuego bajo con el ajo laminado, 2–3 minutos, sin que se queme. Sumás perejil picado y un poco de agua de cocción.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís enseguida.'),
  ('tallarines-con-tomates-asados-y-albahaca', 'Tallarines con tomates asados y albahaca', 34, 1, '{almuerzo,cena}', true, 'Hervís los tallarines frescos en abundante agua con sal, 3 minutos. Reservás un poco del agua de cocción y escurrís.
Asás los tomates cherry con el ajo, el aceite de oliva, sal y orégano en horno a 200 °C, 20 minutos, hasta que revienten. Los aplastás un poco con el tenedor y sumás albahaca.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís enseguida.'),
  ('fideos-integrales-con-ajo-y-aceite', 'Fideos integrales con ajo y aceite', 20, 1, '{almuerzo,cena}', true, 'Hervís los fideos integrales en abundante agua con sal, al dente. Reservás una taza del agua de cocción y escurrís.
Calentás el aceite de oliva a fuego bajo con el ajo laminado, 2–3 minutos, sin que se queme. Sumás perejil picado y un poco de agua de cocción.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís con un poco de queso rallado si querés.'),
  ('fideos-integrales-con-carbonara-liviana', 'Fideos integrales con carbonara liviana', 27, 1, '{almuerzo,cena}', true, 'Hervís los fideos integrales en abundante agua con sal, al dente. Reservás una taza del agua de cocción y escurrís.
Cortás la panceta en tiritas y la dorás en una sartén sin aceite hasta que quede crocante. Batís los huevos con el queso rallado y mucha pimienta. Fuera del fuego, mezclás la pasta caliente con la panceta y los huevos, revolviendo rápido y sumando agua de cocción hasta que quede cremosa.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Probás y corregís la sal antes de servir.'),
  ('fideos-de-arroz-con-salmon-y-crema', 'Fideos de arroz con salmón y crema', 28, 1, '{almuerzo,cena}', true, 'Hidratás los fideos de arroz en agua recién hervida, 6–7 minutos, y los escurrís.
Cortás el salmón en cubos y lo dorás 1 minuto por lado con el aceite. Sumás la cebolla de verdeo picada, la crema, el jugo de limón, sal y pimienta; 3 minutos a fuego bajo.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís bien caliente.'),
  ('fideos-con-rucula-cherry-y-parmesano', 'Fideos con rúcula, cherry y parmesano', 20, 1, '{almuerzo,cena}', true, 'Hervís los fideos en abundante agua con sal, al dente (unos 2 minutos menos que lo que dice el paquete). Reservás una taza del agua de cocción y escurrís.
Cortás los cherry al medio y los salteás 2 minutos con el aceite y el ajo. Mezclás con la pasta caliente, sumás la rúcula (se marchita con el calor) y lascas de parmesano.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Probás y corregís la sal antes de servir.'),
  ('tallarines-con-salsa-blanca-y-jamon', 'Tallarines con salsa blanca y jamón', 16, 1, '{almuerzo,cena}', true, 'Hervís los tallarines frescos en abundante agua con sal, 3 minutos. Reservás un poco del agua de cocción y escurrís.
Calentás la salsa blanca con el jamón en cubitos y un chorrito de agua de cocción. Sazonás con nuez moscada y pimienta.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís con un poco de queso rallado si querés.'),
  ('fideos-con-atun-y-tomate', 'Fideos con atún y tomate', 32, 1, '{almuerzo,cena}', true, 'Hervís los fideos en abundante agua con sal, al dente (unos 2 minutos menos que lo que dice el paquete). Reservás una taza del agua de cocción y escurrís.
Dorás la cebolla con el aceite, sumás el tomate triturado, sal y pimienta y cocinás 10 minutos. Agregás el atún escurrido y las aceitunas picadas, 3 minutos más, y terminás con perejil.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís bien caliente.'),
  ('fideos-con-garbanzos-y-espinaca', 'Fideos con garbanzos y espinaca', 30, 1, '{almuerzo,cena}', true, 'Hervís los fideos en abundante agua con sal, al dente (unos 2 minutos menos que lo que dice el paquete). Reservás una taza del agua de cocción y escurrís.
Dorás el ajo con el aceite y una pizca de comino, sumás el tomate triturado y los garbanzos escurridos, 8 minutos. Agregás la espinaca hasta que se achique.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Probás y corregís la sal antes de servir.'),
  ('fideos-con-tuco', 'Fideos con tuco', 37, 1, '{almuerzo,cena}', true, 'Hervís los fideos en abundante agua con sal, al dente (unos 2 minutos menos que lo que dice el paquete). Reservás una taza del agua de cocción y escurrís.
Dorás la cebolla, el morrón y el ajo picados con el aceite, 6 minutos. Sumás el tomate triturado, orégano, sal y pimienta, y cocinás 20 minutos a fuego bajo.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís enseguida.'),
  ('espaguetis-con-verduras-asadas', 'Espaguetis con verduras asadas', 47, 1, '{almuerzo,cena}', true, 'Hervís los espaguetis en abundante agua con sal, al dente. Reservás una taza del agua de cocción y escurrís.
Cortás las verduras en cubos, las mezclás con el aceite, sal, ajo y orégano, y las asás en horno a 220 °C, 25 minutos, dándolas vuelta a la mitad. Al servir sumás albahaca.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís enseguida.'),
  ('ravioles-con-rucula-cherry-y-parmesano', 'Ravioles con rúcula, cherry y parmesano', 14, 1, '{almuerzo,cena}', true, 'Hervís los ravioles en agua con sal hasta que floten y 1 minuto más. Los sacás con espumadera, sin romperlos.
Cortás los cherry al medio y los salteás 2 minutos con el aceite y el ajo. Mezclás con la pasta caliente, sumás la rúcula (se marchita con el calor) y lascas de parmesano.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís enseguida.'),
  ('tallarines-con-bolonesa-casera', 'Tallarines con boloñesa casera', 39, 1, '{almuerzo,cena}', true, 'Hervís los tallarines frescos en abundante agua con sal, 3 minutos. Reservás un poco del agua de cocción y escurrís.
Dorás la cebolla, la zanahoria rallada y el ajo con el aceite. Sumás la carne y la desgranás con un tenedor hasta que cambie de color. Agregás el tomate triturado, sal, orégano y pimienta, y cocinás 25 minutos a fuego bajo.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Probás y corregís la sal antes de servir.'),
  ('fideos-de-arroz-con-salsa-blanca-y-jamon', 'Fideos de arroz con salsa blanca y jamón', 20, 1, '{almuerzo,cena}', true, 'Hidratás los fideos de arroz en agua recién hervida, 6–7 minutos, y los escurrís.
Calentás la salsa blanca con el jamón en cubitos y un chorrito de agua de cocción. Sazonás con nuez moscada y pimienta.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís bien caliente.'),
  ('tallarines-con-salsa-de-calabaza', 'Tallarines con salsa de calabaza', 34, 1, '{almuerzo,cena}', true, 'Hervís los tallarines frescos en abundante agua con sal, 3 minutos. Reservás un poco del agua de cocción y escurrís.
Hervís la calabaza en cubos hasta que esté tierna (15 minutos). Dorás la cebolla y el ajo con el aceite, sumás la calabaza y un poco del agua de cocción y lo hacés puré con un tenedor o una minipimer. Sazonás con sal, pimienta y nuez moscada.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís con un poco de queso rallado si querés.'),
  ('fideos-integrales-con-albondigas', 'Fideos integrales con albóndigas', 52, 1, '{almuerzo,cena}', true, 'Hervís los fideos integrales en abundante agua con sal, al dente. Reservás una taza del agua de cocción y escurrís.
Mezclás la carne con la cebolla rallada, el ajo picado, el perejil, el pan rallado, el huevo, sal y pimienta; armás albóndigas del tamaño de una nuez. Las dorás en el aceite 5 minutos, sumás el tomate triturado y cocinás tapadas 20 minutos.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Probás y corregís la sal antes de servir.'),
  ('fideos-integrales-con-atun-y-tomate', 'Fideos integrales con atún y tomate', 32, 1, '{almuerzo,cena}', true, 'Hervís los fideos integrales en abundante agua con sal, al dente. Reservás una taza del agua de cocción y escurrís.
Dorás la cebolla con el aceite, sumás el tomate triturado, sal y pimienta y cocinás 10 minutos. Agregás el atún escurrido y las aceitunas picadas, 3 minutos más, y terminás con perejil.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís bien caliente.'),
  ('tallarines-con-tuco', 'Tallarines con tuco', 29, 1, '{almuerzo,cena}', true, 'Hervís los tallarines frescos en abundante agua con sal, 3 minutos. Reservás un poco del agua de cocción y escurrís.
Dorás la cebolla, el morrón y el ajo picados con el aceite, 6 minutos. Sumás el tomate triturado, orégano, sal y pimienta, y cocinás 20 minutos a fuego bajo.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Probás y corregís la sal antes de servir.'),
  ('fideos-integrales-con-garbanzos-y-espinaca', 'Fideos integrales con garbanzos y espinaca', 30, 1, '{almuerzo,cena}', true, 'Hervís los fideos integrales en abundante agua con sal, al dente. Reservás una taza del agua de cocción y escurrís.
Dorás el ajo con el aceite y una pizca de comino, sumás el tomate triturado y los garbanzos escurridos, 8 minutos. Agregás la espinaca hasta que se achique.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís con un poco de queso rallado si querés.'),
  ('espaguetis-con-salsa-blanca-y-jamon', 'Espaguetis con salsa blanca y jamón', 24, 1, '{almuerzo,cena}', true, 'Hervís los espaguetis en abundante agua con sal, al dente. Reservás una taza del agua de cocción y escurrís.
Calentás la salsa blanca con el jamón en cubitos y un chorrito de agua de cocción. Sazonás con nuez moscada y pimienta.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís bien caliente.'),
  ('tallarines-con-pollo-y-verduras-salteadas', 'Tallarines con pollo y verduras salteadas', 29, 1, '{almuerzo,cena}', true, 'Hervís los tallarines frescos en abundante agua con sal, 3 minutos. Reservás un poco del agua de cocción y escurrís.
Cortás la pechuga y las verduras en tiras. Dorás el pollo con el aceite 5 minutos, sumás las verduras 5 minutos y terminás con un chorrito de soja.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís bien caliente.'),
  ('fideos-de-arroz-con-calamares-al-ajillo', 'Fideos de arroz con calamares al ajillo', 26, 1, '{almuerzo,cena}', true, 'Hidratás los fideos de arroz en agua recién hervida, 6–7 minutos, y los escurrís.
Cortás el calamar en anillos y lo salteás 2 minutos con el aceite y el ajo. Sumás el tomate triturado y cocinás 6 minutos. Terminás con perejil.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís con un poco de queso rallado si querés.'),
  ('espaguetis-con-zucchini-y-limon', 'Espaguetis con zucchini y limón', 27, 1, '{almuerzo,cena}', true, 'Hervís los espaguetis en abundante agua con sal, al dente. Reservás una taza del agua de cocción y escurrís.
Rallás los zapallitos con rallador grueso y los salteás 3 minutos con el aceite de oliva y el ajo. Fuera del fuego sumás el jugo de limón, ralladura y parmesano.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís bien caliente.'),
  ('agnolotis-con-ajo-y-aceite', 'Agnolotis con ajo y aceite', 14, 1, '{almuerzo,cena}', true, 'Hervís los agnolotis en agua con sal hasta que floten y 1 minuto más. Los sacás con espumadera.
Calentás el aceite de oliva a fuego bajo con el ajo laminado, 2–3 minutos, sin que se queme. Sumás perejil picado y un poco de agua de cocción.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Probás y corregís la sal antes de servir.'),
  ('tallarines-con-salmon-y-crema', 'Tallarines con salmón y crema', 24, 1, '{almuerzo,cena}', true, 'Hervís los tallarines frescos en abundante agua con sal, 3 minutos. Reservás un poco del agua de cocción y escurrís.
Cortás el salmón en cubos y lo dorás 1 minuto por lado con el aceite. Sumás la cebolla de verdeo picada, la crema, el jugo de limón, sal y pimienta; 3 minutos a fuego bajo.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís bien caliente.'),
  ('noquis-con-jamon-y-arvejas', 'Ñoquis con jamón y arvejas', 19, 1, '{almuerzo,cena}', true, 'Hervís los ñoquis en agua con sal; cuando suben a la superficie, esperás 1 minuto y los sacás con espumadera.
Dorás la cebolla con el aceite, sumás el jamón en cubitos y las arvejas, 3 minutos. Agregás la crema, sal, pimienta y un poco de agua de cocción.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís bien caliente.'),
  ('fideos-de-arroz-con-atun-y-tomate', 'Fideos de arroz con atún y tomate', 28, 1, '{almuerzo,cena}', true, 'Hidratás los fideos de arroz en agua recién hervida, 6–7 minutos, y los escurrís.
Dorás la cebolla con el aceite, sumás el tomate triturado, sal y pimienta y cocinás 10 minutos. Agregás el atún escurrido y las aceitunas picadas, 3 minutos más, y terminás con perejil.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís bien caliente.'),
  ('sorrentinos-con-tuco', 'Sorrentinos con tuco', 31, 1, '{almuerzo,cena}', true, 'Hervís los sorrentinos en agua con sal hasta que floten y 2 minutos más. Los sacás con espumadera.
Dorás la cebolla, el morrón y el ajo picados con el aceite, 6 minutos. Sumás el tomate triturado, orégano, sal y pimienta, y cocinás 20 minutos a fuego bajo.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís enseguida.'),
  ('sorrentinos-con-salsa-blanca-y-jamon', 'Sorrentinos con salsa blanca y jamón', 18, 1, '{almuerzo,cena}', true, 'Hervís los sorrentinos en agua con sal hasta que floten y 2 minutos más. Los sacás con espumadera.
Calentás la salsa blanca con el jamón en cubitos y un chorrito de agua de cocción. Sazonás con nuez moscada y pimienta.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís con un poco de queso rallado si querés.'),
  ('fideos-integrales-con-atun-limon-y-rucula', 'Fideos integrales con atún, limón y rúcula', 22, 1, '{almuerzo,cena}', true, 'Hervís los fideos integrales en abundante agua con sal, al dente. Reservás una taza del agua de cocción y escurrís.
Desmenuzás el atún escurrido y lo mezclás con el jugo de limón, el aceite de oliva y las alcaparras. Lo sumás a la pasta caliente con la rúcula.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís con un poco de queso rallado si querés.'),
  ('fideos-de-arroz-con-atun-limon-y-rucula', 'Fideos de arroz con atún, limón y rúcula', 18, 1, '{almuerzo,cena}', true, 'Hidratás los fideos de arroz en agua recién hervida, 6–7 minutos, y los escurrís.
Desmenuzás el atún escurrido y lo mezclás con el jugo de limón, el aceite de oliva y las alcaparras. Lo sumás a la pasta caliente con la rúcula.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Probás y corregís la sal antes de servir.'),
  ('espaguetis-con-espinaca-y-ricota', 'Espaguetis con espinaca y ricota', 27, 1, '{almuerzo,cena}', true, 'Hervís los espaguetis en abundante agua con sal, al dente. Reservás una taza del agua de cocción y escurrís.
Salteás el ajo con el aceite, sumás la espinaca lavada hasta que se achique (2 minutos). Fuera del fuego mezclás con la ricota, sal, pimienta y nuez moscada, y un poco del agua de cocción.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís con un poco de queso rallado si querés.'),
  ('agnolotis-con-salsa-fileto', 'Agnolotis con salsa fileto', 26, 1, '{almuerzo,cena}', true, 'Hervís los agnolotis en agua con sal hasta que floten y 1 minuto más. Los sacás con espumadera.
Dorás la cebolla picada fina y el ajo con el aceite, 4 minutos. Sumás el tomate triturado, sal y una pizca de azúcar, y cocinás 15 minutos a fuego bajo. Al final agregás la albahaca.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís enseguida.'),
  ('fideos-integrales-con-cuatro-quesos', 'Fideos integrales con cuatro quesos', 24, 1, '{almuerzo,cena}', true, 'Hervís los fideos integrales en abundante agua con sal, al dente. Reservás una taza del agua de cocción y escurrís.
Calentás la leche a fuego bajo y derretís los quesos cortados en cubos, revolviendo, hasta que quede una salsa lisa. Pimienta recién molida.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís con un poco de queso rallado si querés.'),
  ('fideos-de-arroz-con-zucchini-y-limon', 'Fideos de arroz con zucchini y limón', 23, 1, '{almuerzo,cena}', true, 'Hidratás los fideos de arroz en agua recién hervida, 6–7 minutos, y los escurrís.
Rallás los zapallitos con rallador grueso y los salteás 3 minutos con el aceite de oliva y el ajo. Fuera del fuego sumás el jugo de limón, ralladura y parmesano.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Probás y corregís la sal antes de servir.'),
  ('fideos-con-mejillones-y-tomate', 'Fideos con mejillones y tomate', 30, 1, '{almuerzo,cena}', true, 'Hervís los fideos en abundante agua con sal, al dente (unos 2 minutos menos que lo que dice el paquete). Reservás una taza del agua de cocción y escurrís.
Dorás el ajo con el aceite, sumás el tomate triturado y cocinás 8 minutos. Agregás los mejillones cocidos y perejil, 2 minutos más.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Probás y corregís la sal antes de servir.'),
  ('espaguetis-con-pesto-y-tomates-cherry', 'Espaguetis con pesto y tomates cherry', 20, 1, '{almuerzo,cena}', true, 'Hervís los espaguetis en abundante agua con sal, al dente. Reservás una taza del agua de cocción y escurrís.
Cortás los tomates cherry por la mitad. Mezclás el pesto con 2 cucharadas del agua de cocción para que quede cremoso.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís bien caliente.'),
  ('tallarines-con-brocoli-y-ajo', 'Tallarines con brócoli y ajo', 19, 1, '{almuerzo,cena}', true, 'Hervís los tallarines frescos en abundante agua con sal, 3 minutos. Reservás un poco del agua de cocción y escurrís.
Hervís el brócoli en trocitos junto con la pasta los últimos 4 minutos. En una sartén dorás el ajo laminado con el aceite de oliva; sumás el brócoli y lo aplastás un poco con el tenedor.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Probás y corregís la sal antes de servir.'),
  ('espaguetis-con-carbonara-liviana', 'Espaguetis con carbonara liviana', 27, 1, '{almuerzo,cena}', true, 'Hervís los espaguetis en abundante agua con sal, al dente. Reservás una taza del agua de cocción y escurrís.
Cortás la panceta en tiritas y la dorás en una sartén sin aceite hasta que quede crocante. Batís los huevos con el queso rallado y mucha pimienta. Fuera del fuego, mezclás la pasta caliente con la panceta y los huevos, revolviendo rápido y sumando agua de cocción hasta que quede cremosa.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís enseguida.'),
  ('fideos-con-salsa-blanca-y-jamon', 'Fideos con salsa blanca y jamón', 24, 1, '{almuerzo,cena}', true, 'Hervís los fideos en abundante agua con sal, al dente (unos 2 minutos menos que lo que dice el paquete). Reservás una taza del agua de cocción y escurrís.
Calentás la salsa blanca con el jamón en cubitos y un chorrito de agua de cocción. Sazonás con nuez moscada y pimienta.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Probás y corregís la sal antes de servir.'),
  ('fideos-de-arroz-con-bolonesa-casera', 'Fideos de arroz con boloñesa casera', 43, 1, '{almuerzo,cena}', true, 'Hidratás los fideos de arroz en agua recién hervida, 6–7 minutos, y los escurrís.
Dorás la cebolla, la zanahoria rallada y el ajo con el aceite. Sumás la carne y la desgranás con un tenedor hasta que cambie de color. Agregás el tomate triturado, sal, orégano y pimienta, y cocinás 25 minutos a fuego bajo.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís con un poco de queso rallado si querés.'),
  ('sorrentinos-con-crema-y-champinones', 'Sorrentinos con crema y champiñones', 21, 1, '{almuerzo,cena}', true, 'Hervís los sorrentinos en agua con sal hasta que floten y 2 minutos más. Los sacás con espumadera.
Salteás la cebolla y el ajo con el aceite. Sumás los champiñones laminados hasta que larguen el agua y se doren (6 minutos). Agregás la crema, sal, pimienta y un poco de agua de cocción; cocinás 3 minutos.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís con un poco de queso rallado si querés.'),
  ('tallarines-con-morrones-asados-y-ricota', 'Tallarines con morrones asados y ricota', 34, 1, '{almuerzo,cena}', true, 'Hervís los tallarines frescos en abundante agua con sal, 3 minutos. Reservás un poco del agua de cocción y escurrís.
Asás los morrones enteros en horno fuerte 25 minutos, los pelás y los cortás en tiras. Los mezclás con el ajo picado, el aceite y la ricota.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís bien caliente.'),
  ('sorrentinos-con-pesto-y-tomates-cherry', 'Sorrentinos con pesto y tomates cherry', 14, 1, '{almuerzo,cena}', true, 'Hervís los sorrentinos en agua con sal hasta que floten y 2 minutos más. Los sacás con espumadera.
Cortás los tomates cherry por la mitad. Mezclás el pesto con 2 cucharadas del agua de cocción para que quede cremoso.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís bien caliente.'),
  ('espaguetis-con-pollo-y-brocoli', 'Espaguetis con pollo y brócoli', 32, 1, '{almuerzo,cena}', true, 'Hervís los espaguetis en abundante agua con sal, al dente. Reservás una taza del agua de cocción y escurrís.
Cortás la pechuga en cubos, la salpimentás y la dorás con el aceite 5 minutos. Sumás el ajo picado y el brócoli en arbolitos con medio vaso de agua; tapás y cocinás 6 minutos más.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís bien caliente.'),
  ('espaguetis-con-atun-limon-y-rucula', 'Espaguetis con atún, limón y rúcula', 22, 1, '{almuerzo,cena}', true, 'Hervís los espaguetis en abundante agua con sal, al dente. Reservás una taza del agua de cocción y escurrís.
Desmenuzás el atún escurrido y lo mezclás con el jugo de limón, el aceite de oliva y las alcaparras. Lo sumás a la pasta caliente con la rúcula.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís con un poco de queso rallado si querés.'),
  ('fideos-integrales-con-morrones-asados-y-ricota', 'Fideos integrales con morrones asados y ricota', 42, 1, '{almuerzo,cena}', true, 'Hervís los fideos integrales en abundante agua con sal, al dente. Reservás una taza del agua de cocción y escurrís.
Asás los morrones enteros en horno fuerte 25 minutos, los pelás y los cortás en tiras. Los mezclás con el ajo picado, el aceite y la ricota.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís bien caliente.'),
  ('fideos-con-champinones-y-espinaca', 'Fideos con champiñones y espinaca', 27, 1, '{almuerzo,cena}', true, 'Hervís los fideos en abundante agua con sal, al dente (unos 2 minutos menos que lo que dice el paquete). Reservás una taza del agua de cocción y escurrís.
Salteás los champiñones laminados con el aceite y el ajo hasta que se doren. Sumás la espinaca y la crema light, sal y pimienta, y cocinás 2 minutos.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís enseguida.'),
  ('espaguetis-con-calamares-al-ajillo', 'Espaguetis con calamares al ajillo', 30, 1, '{almuerzo,cena}', true, 'Hervís los espaguetis en abundante agua con sal, al dente. Reservás una taza del agua de cocción y escurrís.
Cortás el calamar en anillos y lo salteás 2 minutos con el aceite y el ajo. Sumás el tomate triturado y cocinás 6 minutos. Terminás con perejil.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís bien caliente.'),
  ('fideos-con-jamon-y-arvejas', 'Fideos con jamón y arvejas', 27, 1, '{almuerzo,cena}', true, 'Hervís los fideos en abundante agua con sal, al dente (unos 2 minutos menos que lo que dice el paquete). Reservás una taza del agua de cocción y escurrís.
Dorás la cebolla con el aceite, sumás el jamón en cubitos y las arvejas, 3 minutos. Agregás la crema, sal, pimienta y un poco de agua de cocción.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís bien caliente.'),
  ('espaguetis-con-cuatro-quesos', 'Espaguetis con cuatro quesos', 24, 1, '{almuerzo,cena}', true, 'Hervís los espaguetis en abundante agua con sal, al dente. Reservás una taza del agua de cocción y escurrís.
Calentás la leche a fuego bajo y derretís los quesos cortados en cubos, revolviendo, hasta que quede una salsa lisa. Pimienta recién molida.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís bien caliente.'),
  ('tallarines-con-zapallitos-y-ricota', 'Tallarines con zapallitos y ricota', 22, 1, '{almuerzo,cena}', true, 'Hervís los tallarines frescos en abundante agua con sal, 3 minutos. Reservás un poco del agua de cocción y escurrís.
Cortás los zapallitos en cubitos y los salteás con el aceite y el ajo 6–8 minutos hasta que estén tiernos. Fuera del fuego sumás la ricota, la albahaca y un poco de agua de cocción.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís enseguida.'),
  ('tallarines-con-carbonara-liviana', 'Tallarines con carbonara liviana', 19, 1, '{almuerzo,cena}', true, 'Hervís los tallarines frescos en abundante agua con sal, 3 minutos. Reservás un poco del agua de cocción y escurrís.
Cortás la panceta en tiritas y la dorás en una sartén sin aceite hasta que quede crocante. Batís los huevos con el queso rallado y mucha pimienta. Fuera del fuego, mezclás la pasta caliente con la panceta y los huevos, revolviendo rápido y sumando agua de cocción hasta que quede cremosa.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Probás y corregís la sal antes de servir.'),
  ('noquis-con-tomates-asados-y-albahaca', 'Ñoquis con tomates asados y albahaca', 34, 1, '{almuerzo,cena}', true, 'Hervís los ñoquis en agua con sal; cuando suben a la superficie, esperás 1 minuto y los sacás con espumadera.
Asás los tomates cherry con el ajo, el aceite de oliva, sal y orégano en horno a 200 °C, 20 minutos, hasta que revienten. Los aplastás un poco con el tenedor y sumás albahaca.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Probás y corregís la sal antes de servir.'),
  ('fideos-de-arroz-con-bolonesa-de-lentejas', 'Fideos de arroz con boloñesa de lentejas', 38, 1, '{almuerzo,cena}', true, 'Hidratás los fideos de arroz en agua recién hervida, 6–7 minutos, y los escurrís.
Dorás la cebolla, la zanahoria rallada y el ajo con el aceite. Sumás las lentejas ya hervidas, el tomate triturado, sal, orégano y pimentón, y cocinás 20 minutos; las aplastás un poco para que espese.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís enseguida.'),
  ('espaguetis-con-morrones-asados-y-ricota', 'Espaguetis con morrones asados y ricota', 42, 1, '{almuerzo,cena}', true, 'Hervís los espaguetis en abundante agua con sal, al dente. Reservás una taza del agua de cocción y escurrís.
Asás los morrones enteros en horno fuerte 25 minutos, los pelás y los cortás en tiras. Los mezclás con el ajo picado, el aceite y la ricota.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís enseguida.'),
  ('fideos-de-arroz-con-rucula-cherry-y-parmesano', 'Fideos de arroz con rúcula, cherry y parmesano', 16, 1, '{almuerzo,cena}', true, 'Hidratás los fideos de arroz en agua recién hervida, 6–7 minutos, y los escurrís.
Cortás los cherry al medio y los salteás 2 minutos con el aceite y el ajo. Mezclás con la pasta caliente, sumás la rúcula (se marchita con el calor) y lascas de parmesano.
Mezclás la pasta con la salsa 1 minuto a fuego bajo, sumando agua de cocción si hace falta. Servís bien caliente.'),
  ('omelette-de-espinaca-y-queso', 'Omelette de espinaca y queso', 12, 1, '{almuerzo,cena}', true, 'Salteás la espinaca lavada con el aceite hasta que se achique (2 minutos), la escurrís y la picás. Cortás el queso en cubitos.
Batís los huevos con sal y pimienta.
En una sartén antiadherente con una gota de aceite, volcás los huevos a fuego medio y los dejás cuajar sin mover 2 minutos.
Ponés el relleno en la mitad, doblás el omelette y lo cocinás 1 minuto más. Servís enseguida.'),
  ('frittata-de-espinaca-y-queso-al-horno', 'Frittata de espinaca y queso al horno', 16, 2, '{almuerzo,cena}', true, 'Precalentás el horno a 190 °C.
Salteás la espinaca lavada con el aceite hasta que se achique (2 minutos), la escurrís y la picás. Cortás el queso en cubitos.
Batís los huevos con sal, pimienta y una cucharada de queso rallado; sumás el relleno.
Volcás la mezcla en una sartén que vaya al horno (o una tartera aceitada) y cocinás 18–20 minutos, hasta que esté firme y dorada. Cortás en porciones.'),
  ('tarta-de-pollo-y-puerro', 'Tarta de pollo y puerro', 47, 4, '{almuerzo,cena}', true, 'Precalentás el horno a 200 °C. Forrás una tartera con la tapa de tarta y la pinchás con un tenedor.
Cocinás el puerro en rodajas con el aceite, tapado, 8 minutos; lo mezclás con el pollo desmenuzado.
Batís los huevos con la leche, sal, pimienta y nuez moscada. Mezclás con el relleno.
Volcás en la tartera y horneás 30–35 minutos, hasta que esté firme y dorada. Dejás entibiar 5 minutos antes de cortar en 4 porciones.'),
  ('omelette-de-cebolla-y-queso-azul', 'Omelette de cebolla y queso azul', 24, 1, '{almuerzo,cena}', true, 'Cocinás la cebolla en plumas con el aceite a fuego bajo, 15 minutos, hasta que esté dorada y dulce. Desmenuzás el queso azul.
Batís los huevos con sal y pimienta.
En una sartén antiadherente con una gota de aceite, volcás los huevos a fuego medio y los dejás cuajar sin mover 2 minutos.
Ponés el relleno en la mitad, doblás el omelette y lo cocinás 1 minuto más. Servís enseguida.'),
  ('frittata-de-panceta-y-queso-al-horno', 'Frittata de panceta y queso al horno', 19, 2, '{almuerzo,cena}', true, 'Precalentás el horno a 190 °C.
Cortás la panceta en tiritas y la dorás en la sartén sin aceite, 4 minutos; sumás la cebolla picada 3 minutos. Cortás el queso en cubitos.
Batís los huevos con sal, pimienta y una cucharada de queso rallado; sumás el relleno.
Volcás la mezcla en una sartén que vaya al horno (o una tartera aceitada) y cocinás 18–20 minutos, hasta que esté firme y dorada. Cortás en porciones.'),
  ('tarta-de-jamon-crudo-y-rucula', 'Tarta de jamón crudo y rúcula', 38, 4, '{almuerzo,cena}', true, 'Precalentás el horno a 200 °C. Forrás una tartera con la tapa de tarta y la pinchás con un tenedor.
Cortás el jamón crudo en tiras, picás la rúcula y cortás el queso en cubitos (la rúcula se suma recién al final).
Batís los huevos con la leche, sal, pimienta y nuez moscada. Mezclás con el relleno.
Volcás en la tartera y horneás 30–35 minutos, hasta que esté firme y dorada. Dejás entibiar 5 minutos antes de cortar en 4 porciones.'),
  ('omelette-de-morron-y-cebolla', 'Omelette de morrón y cebolla', 18, 1, '{almuerzo,cena}', true, 'Cortás el morrón y la cebolla en tiras finas y los cocinás con el aceite, 8 minutos, hasta que estén tiernos.
Batís los huevos con sal y pimienta.
En una sartén antiadherente con una gota de aceite, volcás los huevos a fuego medio y los dejás cuajar sin mover 2 minutos.
Ponés el relleno en la mitad, doblás el omelette y lo cocinás 1 minuto más. Servís enseguida.'),
  ('tortilla-de-palmitos-y-queso', 'Tortilla de palmitos y queso', 12, 1, '{almuerzo,cena}', true, 'Escurrís los palmitos y los cortás en rodajas; picás la cebolla de verdeo y cortás el queso en cubitos.
Batís los huevos con sal y pimienta, sumás el relleno y mezclás.
Volcás todo en una sartén antiadherente con una gota de aceite a fuego medio. Cocinás 4–5 minutos, hasta que los bordes estén firmes.
Das vuelta la tortilla con ayuda de un plato y cocinás 3 minutos del otro lado. Servís tibia o fría.'),
  ('tarta-de-tomate-y-albahaca', 'Tarta de tomate y albahaca', 39, 4, '{almuerzo,cena}', true, 'Precalentás el horno a 200 °C. Forrás una tartera con la tapa de tarta y la pinchás con un tenedor.
Cortás el tomate en cubitos sin semillas, la muzzarella en cubitos y picás la albahaca.
Batís los huevos con la leche, sal, pimienta y nuez moscada. Mezclás con el relleno.
Volcás en la tartera y horneás 30–35 minutos, hasta que esté firme y dorada. Dejás entibiar 5 minutos antes de cortar en 4 porciones.'),
  ('frittata-de-tomate-y-albahaca-al-horno', 'Frittata de tomate y albahaca al horno', 14, 2, '{almuerzo,cena}', true, 'Precalentás el horno a 190 °C.
Cortás el tomate en cubitos sin semillas, la muzzarella en cubitos y picás la albahaca.
Batís los huevos con sal, pimienta y una cucharada de queso rallado; sumás el relleno.
Volcás la mezcla en una sartén que vaya al horno (o una tartera aceitada) y cocinás 18–20 minutos, hasta que esté firme y dorada. Cortás en porciones.'),
  ('tarta-de-verduras-asadas', 'Tarta de verduras asadas', 60, 4, '{almuerzo,cena}', true, 'Precalentás el horno a 200 °C. Forrás una tartera con la tapa de tarta y la pinchás con un tenedor.
Cortás las verduras en cubos, las mezclás con el aceite y sal, y las asás en horno a 220 °C, 20 minutos.
Batís los huevos con la leche, sal, pimienta y nuez moscada. Mezclás con el relleno.
Volcás en la tartera y horneás 30–35 minutos, hasta que esté firme y dorada. Dejás entibiar 5 minutos antes de cortar en 4 porciones.'),
  ('tortilla-de-jamon-crudo-y-rucula', 'Tortilla de jamón crudo y rúcula', 11, 1, '{almuerzo,cena}', true, 'Cortás el jamón crudo en tiras, picás la rúcula y cortás el queso en cubitos (la rúcula se suma recién al final).
Batís los huevos con sal y pimienta, sumás el relleno y mezclás.
Volcás todo en una sartén antiadherente con una gota de aceite a fuego medio. Cocinás 4–5 minutos, hasta que los bordes estén firmes.
Das vuelta la tortilla con ayuda de un plato y cocinás 3 minutos del otro lado. Servís tibia o fría.'),
  ('revuelto-de-cebolla-y-queso-azul', 'Revuelto de cebolla y queso azul', 23, 1, '{almuerzo,cena}', true, 'Cocinás la cebolla en plumas con el aceite a fuego bajo, 15 minutos, hasta que esté dorada y dulce. Desmenuzás el queso azul.
En una sartén antiadherente calentás el relleno 1 minuto.
Sumás los huevos batidos con sal y pimienta y revolvés suave con una espátula, 2–3 minutos, hasta que cuajen pero queden cremosos.
Servís enseguida, con una tostada si querés.'),
  ('revuelto-de-jamon-crudo-y-rucula', 'Revuelto de jamón crudo y rúcula', 8, 1, '{almuerzo,cena}', true, 'Cortás el jamón crudo en tiras, picás la rúcula y cortás el queso en cubitos (la rúcula se suma recién al final).
En una sartén antiadherente calentás el relleno 1 minuto.
Sumás los huevos batidos con sal y pimienta y revolvés suave con una espátula, 2–3 minutos, hasta que cuajen pero queden cremosos.
Servís enseguida, con una tostada si querés.'),
  ('tortilla-de-jamon-y-queso', 'Tortilla de jamón y queso', 11, 1, '{almuerzo,cena}', true, 'Cortás el jamón y el queso en cubitos.
Batís los huevos con sal y pimienta, sumás el relleno y mezclás.
Volcás todo en una sartén antiadherente con una gota de aceite a fuego medio. Cocinás 4–5 minutos, hasta que los bordes estén firmes.
Das vuelta la tortilla con ayuda de un plato y cocinás 3 minutos del otro lado. Servís tibia o fría.'),
  ('tortilla-de-brocoli-y-queso', 'Tortilla de brócoli y queso', 16, 1, '{almuerzo,cena}', true, 'Hervís el brócoli en arbolitos 4 minutos, lo escurrís y lo picás. Cortás el queso en cubitos.
Batís los huevos con sal y pimienta, sumás el relleno y mezclás.
Volcás todo en una sartén antiadherente con una gota de aceite a fuego medio. Cocinás 4–5 minutos, hasta que los bordes estén firmes.
Das vuelta la tortilla con ayuda de un plato y cocinás 3 minutos del otro lado. Servís tibia o fría.'),
  ('tortilla-de-ricota-y-espinaca', 'Tortilla de ricota y espinaca', 14, 1, '{almuerzo,cena}', true, 'Salteás la espinaca con el aceite hasta que se achique, la picás y la mezclás con la ricota, sal y nuez moscada.
Batís los huevos con sal y pimienta, sumás el relleno y mezclás.
Volcás todo en una sartén antiadherente con una gota de aceite a fuego medio. Cocinás 4–5 minutos, hasta que los bordes estén firmes.
Das vuelta la tortilla con ayuda de un plato y cocinás 3 minutos del otro lado. Servís tibia o fría.'),
  ('frittata-de-jamon-crudo-y-rucula-al-horno', 'Frittata de jamón crudo y rúcula al horno', 13, 2, '{almuerzo,cena}', true, 'Precalentás el horno a 190 °C.
Cortás el jamón crudo en tiras, picás la rúcula y cortás el queso en cubitos (la rúcula se suma recién al final).
Batís los huevos con sal, pimienta y una cucharada de queso rallado; sumás el relleno.
Volcás la mezcla en una sartén que vaya al horno (o una tartera aceitada) y cocinás 18–20 minutos, hasta que esté firme y dorada. Cortás en porciones.'),
  ('revuelto-de-calabaza-y-feta', 'Revuelto de calabaza y feta', 25, 1, '{almuerzo,cena}', true, 'Asás o hervís la calabaza en cubitos hasta que esté tierna y la dejás entibiar; desmenuzás el feta.
En una sartén antiadherente calentás el relleno 1 minuto.
Sumás los huevos batidos con sal y pimienta y revolvés suave con una espátula, 2–3 minutos, hasta que cuajen pero queden cremosos.
Servís enseguida, con una tostada si querés.'),
  ('tortilla-de-coliflor-y-queso', 'Tortilla de coliflor y queso', 18, 1, '{almuerzo,cena}', true, 'Hervís la coliflor en arbolitos 6 minutos, la escurrís y la picás. Cortás el queso en cubitos.
Batís los huevos con sal y pimienta, sumás el relleno y mezclás.
Volcás todo en una sartén antiadherente con una gota de aceite a fuego medio. Cocinás 4–5 minutos, hasta que los bordes estén firmes.
Das vuelta la tortilla con ayuda de un plato y cocinás 3 minutos del otro lado. Servís tibia o fría.'),
  ('frittata-de-calabaza-y-feta-al-horno', 'Frittata de calabaza y feta al horno', 30, 2, '{almuerzo,cena}', true, 'Precalentás el horno a 190 °C.
Asás o hervís la calabaza en cubitos hasta que esté tierna y la dejás entibiar; desmenuzás el feta.
Batís los huevos con sal, pimienta y una cucharada de queso rallado; sumás el relleno.
Volcás la mezcla en una sartén que vaya al horno (o una tartera aceitada) y cocinás 18–20 minutos, hasta que esté firme y dorada. Cortás en porciones.'),
  ('revuelto-de-jamon-y-queso', 'Revuelto de jamón y queso', 8, 1, '{almuerzo,cena}', true, 'Cortás el jamón y el queso en cubitos.
En una sartén antiadherente calentás el relleno 1 minuto.
Sumás los huevos batidos con sal y pimienta y revolvés suave con una espátula, 2–3 minutos, hasta que cuajen pero queden cremosos.
Servís enseguida, con una tostada si querés.'),
  ('tortilla-de-pollo-y-puerro', 'Tortilla de pollo y puerro', 20, 1, '{almuerzo,cena}', true, 'Cocinás el puerro en rodajas con el aceite, tapado, 8 minutos; lo mezclás con el pollo desmenuzado.
Batís los huevos con sal y pimienta, sumás el relleno y mezclás.
Volcás todo en una sartén antiadherente con una gota de aceite a fuego medio. Cocinás 4–5 minutos, hasta que los bordes estén firmes.
Das vuelta la tortilla con ayuda de un plato y cocinás 3 minutos del otro lado. Servís tibia o fría.'),
  ('tortilla-de-zanahoria-y-arvejas', 'Tortilla de zanahoria y arvejas', 16, 1, '{almuerzo,cena}', true, 'Rallás la zanahoria gruesa y la salteás con las arvejas y el aceite, 5 minutos.
Batís los huevos con sal y pimienta, sumás el relleno y mezclás.
Volcás todo en una sartén antiadherente con una gota de aceite a fuego medio. Cocinás 4–5 minutos, hasta que los bordes estén firmes.
Das vuelta la tortilla con ayuda de un plato y cocinás 3 minutos del otro lado. Servís tibia o fría.'),
  ('tortilla-de-espinaca-y-queso', 'Tortilla de espinaca y queso', 14, 1, '{almuerzo,cena}', true, 'Salteás la espinaca lavada con el aceite hasta que se achique (2 minutos), la escurrís y la picás. Cortás el queso en cubitos.
Batís los huevos con sal y pimienta, sumás el relleno y mezclás.
Volcás todo en una sartén antiadherente con una gota de aceite a fuego medio. Cocinás 4–5 minutos, hasta que los bordes estén firmes.
Das vuelta la tortilla con ayuda de un plato y cocinás 3 minutos del otro lado. Servís tibia o fría.'),
  ('revuelto-de-champinones-y-cebolla', 'Revuelto de champiñones y cebolla', 15, 1, '{almuerzo,cena}', true, 'Salteás la cebolla en plumas con el aceite, sumás los champiñones laminados y cocinás 7 minutos hasta que se doren.
En una sartén antiadherente calentás el relleno 1 minuto.
Sumás los huevos batidos con sal y pimienta y revolvés suave con una espátula, 2–3 minutos, hasta que cuajen pero queden cremosos.
Servís enseguida, con una tostada si querés.'),
  ('frittata-de-hongos-y-queso-de-cabra-al-horno', 'Frittata de hongos y queso de cabra al horno', 21, 2, '{almuerzo,cena}', true, 'Precalentás el horno a 190 °C.
Dorás la cebolla y los champiñones laminados con el aceite, 7 minutos. Desmenuzás el queso de cabra.
Batís los huevos con sal, pimienta y una cucharada de queso rallado; sumás el relleno.
Volcás la mezcla en una sartén que vaya al horno (o una tartera aceitada) y cocinás 18–20 minutos, hasta que esté firme y dorada. Cortás en porciones.'),
  ('tortilla-de-chauchas-y-queso', 'Tortilla de chauchas y queso', 18, 1, '{almuerzo,cena}', true, 'Hervís las chauchas en trozos 6 minutos, las escurrís; cortás el queso en cubitos.
Batís los huevos con sal y pimienta, sumás el relleno y mezclás.
Volcás todo en una sartén antiadherente con una gota de aceite a fuego medio. Cocinás 4–5 minutos, hasta que los bordes estén firmes.
Das vuelta la tortilla con ayuda de un plato y cocinás 3 minutos del otro lado. Servís tibia o fría.'),
  ('tortilla-de-cebolla-y-queso-azul', 'Tortilla de cebolla y queso azul', 26, 1, '{almuerzo,cena}', true, 'Cocinás la cebolla en plumas con el aceite a fuego bajo, 15 minutos, hasta que esté dorada y dulce. Desmenuzás el queso azul.
Batís los huevos con sal y pimienta, sumás el relleno y mezclás.
Volcás todo en una sartén antiadherente con una gota de aceite a fuego medio. Cocinás 4–5 minutos, hasta que los bordes estén firmes.
Das vuelta la tortilla con ayuda de un plato y cocinás 3 minutos del otro lado. Servís tibia o fría.'),
  ('revuelto-de-brocoli-y-queso', 'Revuelto de brócoli y queso', 13, 1, '{almuerzo,cena}', true, 'Hervís el brócoli en arbolitos 4 minutos, lo escurrís y lo picás. Cortás el queso en cubitos.
En una sartén antiadherente calentás el relleno 1 minuto.
Sumás los huevos batidos con sal y pimienta y revolvés suave con una espátula, 2–3 minutos, hasta que cuajen pero queden cremosos.
Servís enseguida, con una tostada si querés.'),
  ('revuelto-de-verduras-asadas', 'Revuelto de verduras asadas', 30, 1, '{almuerzo,cena}', true, 'Cortás las verduras en cubos, las mezclás con el aceite y sal, y las asás en horno a 220 °C, 20 minutos.
En una sartén antiadherente calentás el relleno 1 minuto.
Sumás los huevos batidos con sal y pimienta y revolvés suave con una espátula, 2–3 minutos, hasta que cuajen pero queden cremosos.
Servís enseguida, con una tostada si querés.'),
  ('tortilla-de-calabaza-y-cebolla', 'Tortilla de calabaza y cebolla', 24, 1, '{almuerzo,cena}', true, 'Cortás la calabaza en cubitos chicos y la cebolla en plumas; los cocinás en la sartén con el aceite, tapados, 12 minutos, hasta que se ablanden.
Batís los huevos con sal y pimienta, sumás el relleno y mezclás.
Volcás todo en una sartén antiadherente con una gota de aceite a fuego medio. Cocinás 4–5 minutos, hasta que los bordes estén firmes.
Das vuelta la tortilla con ayuda de un plato y cocinás 3 minutos del otro lado. Servís tibia o fría.'),
  ('tarta-de-champinones-y-cebolla', 'Tarta de champiñones y cebolla', 45, 4, '{almuerzo,cena}', true, 'Precalentás el horno a 200 °C. Forrás una tartera con la tapa de tarta y la pinchás con un tenedor.
Salteás la cebolla en plumas con el aceite, sumás los champiñones laminados y cocinás 7 minutos hasta que se doren.
Batís los huevos con la leche, sal, pimienta y nuez moscada. Mezclás con el relleno.
Volcás en la tartera y horneás 30–35 minutos, hasta que esté firme y dorada. Dejás entibiar 5 minutos antes de cortar en 4 porciones.'),
  ('tortilla-de-tomate-y-albahaca', 'Tortilla de tomate y albahaca', 12, 1, '{almuerzo,cena}', true, 'Cortás el tomate en cubitos sin semillas, la muzzarella en cubitos y picás la albahaca.
Batís los huevos con sal y pimienta, sumás el relleno y mezclás.
Volcás todo en una sartén antiadherente con una gota de aceite a fuego medio. Cocinás 4–5 minutos, hasta que los bordes estén firmes.
Das vuelta la tortilla con ayuda de un plato y cocinás 3 minutos del otro lado. Servís tibia o fría.'),
  ('revuelto-de-morron-y-cebolla', 'Revuelto de morrón y cebolla', 17, 1, '{almuerzo,cena}', true, 'Cortás el morrón y la cebolla en tiras finas y los cocinás con el aceite, 8 minutos, hasta que estén tiernos.
En una sartén antiadherente calentás el relleno 1 minuto.
Sumás los huevos batidos con sal y pimienta y revolvés suave con una espátula, 2–3 minutos, hasta que cuajen pero queden cremosos.
Servís enseguida, con una tostada si querés.'),
  ('omelette-de-acelga-y-queso', 'Omelette de acelga y queso', 14, 1, '{almuerzo,cena}', true, 'Hervís la acelga 3 minutos, la escurrís bien, la exprimís y la picás. Cortás el queso en cubitos.
Batís los huevos con sal y pimienta.
En una sartén antiadherente con una gota de aceite, volcás los huevos a fuego medio y los dejás cuajar sin mover 2 minutos.
Ponés el relleno en la mitad, doblás el omelette y lo cocinás 1 minuto más. Servís enseguida.'),
  ('tortilla-de-champinones-y-cebolla', 'Tortilla de champiñones y cebolla', 18, 1, '{almuerzo,cena}', true, 'Salteás la cebolla en plumas con el aceite, sumás los champiñones laminados y cocinás 7 minutos hasta que se doren.
Batís los huevos con sal y pimienta, sumás el relleno y mezclás.
Volcás todo en una sartén antiadherente con una gota de aceite a fuego medio. Cocinás 4–5 minutos, hasta que los bordes estén firmes.
Das vuelta la tortilla con ayuda de un plato y cocinás 3 minutos del otro lado. Servís tibia o fría.'),
  ('omelette-de-calabaza-y-feta', 'Omelette de calabaza y feta', 26, 1, '{almuerzo,cena}', true, 'Asás o hervís la calabaza en cubitos hasta que esté tierna y la dejás entibiar; desmenuzás el feta.
Batís los huevos con sal y pimienta.
En una sartén antiadherente con una gota de aceite, volcás los huevos a fuego medio y los dejás cuajar sin mover 2 minutos.
Ponés el relleno en la mitad, doblás el omelette y lo cocinás 1 minuto más. Servís enseguida.'),
  ('omelette-de-papa-y-cebolla', 'Omelette de papa y cebolla', 26, 1, '{almuerzo,cena}', true, 'Pelás las papas y las cortás en rodajas finas; picás la cebolla. Las cocinás en una sartén con el aceite y sal, tapadas y a fuego bajo, 15 minutos, hasta que estén tiernas.
Batís los huevos con sal y pimienta.
En una sartén antiadherente con una gota de aceite, volcás los huevos a fuego medio y los dejás cuajar sin mover 2 minutos.
Ponés el relleno en la mitad, doblás el omelette y lo cocinás 1 minuto más. Servís enseguida.'),
  ('revuelto-de-hongos-y-queso-de-cabra', 'Revuelto de hongos y queso de cabra', 16, 1, '{almuerzo,cena}', true, 'Dorás la cebolla y los champiñones laminados con el aceite, 7 minutos. Desmenuzás el queso de cabra.
En una sartén antiadherente calentás el relleno 1 minuto.
Sumás los huevos batidos con sal y pimienta y revolvés suave con una espátula, 2–3 minutos, hasta que cuajen pero queden cremosos.
Servís enseguida, con una tostada si querés.'),
  ('frittata-de-puerro-y-queso-al-horno', 'Frittata de puerro y queso al horno', 22, 2, '{almuerzo,cena}', true, 'Precalentás el horno a 190 °C.
Cortás el puerro en rodajas finas y lo cocinás con el aceite, tapado, 8 minutos hasta que se ablande. Cortás el queso en cubitos.
Batís los huevos con sal, pimienta y una cucharada de queso rallado; sumás el relleno.
Volcás la mezcla en una sartén que vaya al horno (o una tartera aceitada) y cocinás 18–20 minutos, hasta que esté firme y dorada. Cortás en porciones.'),
  ('tarta-de-zapallitos-y-cebolla', 'Tarta de zapallitos y cebolla', 47, 4, '{almuerzo,cena}', true, 'Precalentás el horno a 200 °C. Forrás una tartera con la tapa de tarta y la pinchás con un tenedor.
Cortás el zapallito en rodajas finas y la cebolla en plumas, y los cocinás en la sartén con el aceite, 8 minutos, hasta que estén tiernos.
Batís los huevos con la leche, sal, pimienta y nuez moscada. Mezclás con el relleno.
Volcás en la tartera y horneás 30–35 minutos, hasta que esté firme y dorada. Dejás entibiar 5 minutos antes de cortar en 4 porciones.'),
  ('tortilla-de-morron-y-cebolla', 'Tortilla de morrón y cebolla', 20, 1, '{almuerzo,cena}', true, 'Cortás el morrón y la cebolla en tiras finas y los cocinás con el aceite, 8 minutos, hasta que estén tiernos.
Batís los huevos con sal y pimienta, sumás el relleno y mezclás.
Volcás todo en una sartén antiadherente con una gota de aceite a fuego medio. Cocinás 4–5 minutos, hasta que los bordes estén firmes.
Das vuelta la tortilla con ayuda de un plato y cocinás 3 minutos del otro lado. Servís tibia o fría.'),
  ('tortilla-de-salmon-ahumado-y-cebolla-de-verdeo', 'Tortilla de salmón ahumado y cebolla de verdeo', 12, 1, '{almuerzo,cena}', true, 'Cortás el salmón ahumado en tiras y la cebolla de verdeo en rodajitas.
Batís los huevos con sal y pimienta, sumás el relleno y mezclás.
Volcás todo en una sartén antiadherente con una gota de aceite a fuego medio. Cocinás 4–5 minutos, hasta que los bordes estén firmes.
Das vuelta la tortilla con ayuda de un plato y cocinás 3 minutos del otro lado. Servís tibia o fría.'),
  ('tarta-de-panceta-y-queso', 'Tarta de panceta y queso', 44, 4, '{almuerzo,cena}', true, 'Precalentás el horno a 200 °C. Forrás una tartera con la tapa de tarta y la pinchás con un tenedor.
Cortás la panceta en tiritas y la dorás en la sartén sin aceite, 4 minutos; sumás la cebolla picada 3 minutos. Cortás el queso en cubitos.
Batís los huevos con la leche, sal, pimienta y nuez moscada. Mezclás con el relleno.
Volcás en la tartera y horneás 30–35 minutos, hasta que esté firme y dorada. Dejás entibiar 5 minutos antes de cortar en 4 porciones.'),
  ('frittata-de-pollo-y-puerro-al-horno', 'Frittata de pollo y puerro al horno', 22, 2, '{almuerzo,cena}', true, 'Precalentás el horno a 190 °C.
Cocinás el puerro en rodajas con el aceite, tapado, 8 minutos; lo mezclás con el pollo desmenuzado.
Batís los huevos con sal, pimienta y una cucharada de queso rallado; sumás el relleno.
Volcás la mezcla en una sartén que vaya al horno (o una tartera aceitada) y cocinás 18–20 minutos, hasta que esté firme y dorada. Cortás en porciones.'),
  ('omelette-de-jamon-crudo-y-rucula', 'Omelette de jamón crudo y rúcula', 9, 1, '{almuerzo,cena}', true, 'Cortás el jamón crudo en tiras, picás la rúcula y cortás el queso en cubitos (la rúcula se suma recién al final).
Batís los huevos con sal y pimienta.
En una sartén antiadherente con una gota de aceite, volcás los huevos a fuego medio y los dejás cuajar sin mover 2 minutos.
Ponés el relleno en la mitad, doblás el omelette y lo cocinás 1 minuto más. Servís enseguida.'),
  ('tarta-de-morron-y-cebolla', 'Tarta de morrón y cebolla', 47, 4, '{almuerzo,cena}', true, 'Precalentás el horno a 200 °C. Forrás una tartera con la tapa de tarta y la pinchás con un tenedor.
Cortás el morrón y la cebolla en tiras finas y los cocinás con el aceite, 8 minutos, hasta que estén tiernos.
Batís los huevos con la leche, sal, pimienta y nuez moscada. Mezclás con el relleno.
Volcás en la tartera y horneás 30–35 minutos, hasta que esté firme y dorada. Dejás entibiar 5 minutos antes de cortar en 4 porciones.'),
  ('frittata-de-palmitos-y-queso-al-horno', 'Frittata de palmitos y queso al horno', 14, 2, '{almuerzo,cena}', true, 'Precalentás el horno a 190 °C.
Escurrís los palmitos y los cortás en rodajas; picás la cebolla de verdeo y cortás el queso en cubitos.
Batís los huevos con sal, pimienta y una cucharada de queso rallado; sumás el relleno.
Volcás la mezcla en una sartén que vaya al horno (o una tartera aceitada) y cocinás 18–20 minutos, hasta que esté firme y dorada. Cortás en porciones.'),
  ('tortilla-de-zapallitos-y-cebolla', 'Tortilla de zapallitos y cebolla', 20, 1, '{almuerzo,cena}', true, 'Cortás el zapallito en rodajas finas y la cebolla en plumas, y los cocinás en la sartén con el aceite, 8 minutos, hasta que estén tiernos.
Batís los huevos con sal y pimienta, sumás el relleno y mezclás.
Volcás todo en una sartén antiadherente con una gota de aceite a fuego medio. Cocinás 4–5 minutos, hasta que los bordes estén firmes.
Das vuelta la tortilla con ayuda de un plato y cocinás 3 minutos del otro lado. Servís tibia o fría.'),
  ('revuelto-de-palmitos-y-queso', 'Revuelto de palmitos y queso', 9, 1, '{almuerzo,cena}', true, 'Escurrís los palmitos y los cortás en rodajas; picás la cebolla de verdeo y cortás el queso en cubitos.
En una sartén antiadherente calentás el relleno 1 minuto.
Sumás los huevos batidos con sal y pimienta y revolvés suave con una espátula, 2–3 minutos, hasta que cuajen pero queden cremosos.
Servís enseguida, con una tostada si querés.'),
  ('omelette-de-zapallitos-y-cebolla', 'Omelette de zapallitos y cebolla', 18, 1, '{almuerzo,cena}', true, 'Cortás el zapallito en rodajas finas y la cebolla en plumas, y los cocinás en la sartén con el aceite, 8 minutos, hasta que estén tiernos.
Batís los huevos con sal y pimienta.
En una sartén antiadherente con una gota de aceite, volcás los huevos a fuego medio y los dejás cuajar sin mover 2 minutos.
Ponés el relleno en la mitad, doblás el omelette y lo cocinás 1 minuto más. Servís enseguida.'),
  ('revuelto-de-calabaza-y-cebolla', 'Revuelto de calabaza y cebolla', 21, 1, '{almuerzo,cena}', true, 'Cortás la calabaza en cubitos chicos y la cebolla en plumas; los cocinás en la sartén con el aceite, tapados, 12 minutos, hasta que se ablanden.
En una sartén antiadherente calentás el relleno 1 minuto.
Sumás los huevos batidos con sal y pimienta y revolvés suave con una espátula, 2–3 minutos, hasta que cuajen pero queden cremosos.
Servís enseguida, con una tostada si querés.'),
  ('tortilla-de-hongos-y-queso-de-cabra', 'Tortilla de hongos y queso de cabra', 19, 1, '{almuerzo,cena}', true, 'Dorás la cebolla y los champiñones laminados con el aceite, 7 minutos. Desmenuzás el queso de cabra.
Batís los huevos con sal y pimienta, sumás el relleno y mezclás.
Volcás todo en una sartén antiadherente con una gota de aceite a fuego medio. Cocinás 4–5 minutos, hasta que los bordes estén firmes.
Das vuelta la tortilla con ayuda de un plato y cocinás 3 minutos del otro lado. Servís tibia o fría.'),
  ('frittata-de-papa-y-cebolla-al-horno', 'Frittata de papa y cebolla al horno', 30, 2, '{almuerzo,cena}', true, 'Precalentás el horno a 190 °C.
Pelás las papas y las cortás en rodajas finas; picás la cebolla. Las cocinás en una sartén con el aceite y sal, tapadas y a fuego bajo, 15 minutos, hasta que estén tiernas.
Batís los huevos con sal, pimienta y una cucharada de queso rallado; sumás el relleno.
Volcás la mezcla en una sartén que vaya al horno (o una tartera aceitada) y cocinás 18–20 minutos, hasta que esté firme y dorada. Cortás en porciones.'),
  ('revuelto-de-ricota-y-espinaca', 'Revuelto de ricota y espinaca', 11, 1, '{almuerzo,cena}', true, 'Salteás la espinaca con el aceite hasta que se achique, la picás y la mezclás con la ricota, sal y nuez moscada.
En una sartén antiadherente calentás el relleno 1 minuto.
Sumás los huevos batidos con sal y pimienta y revolvés suave con una espátula, 2–3 minutos, hasta que cuajen pero queden cremosos.
Servís enseguida, con una tostada si querés.'),
  ('tarta-de-coliflor-y-queso', 'Tarta de coliflor y queso', 45, 4, '{almuerzo,cena}', true, 'Precalentás el horno a 200 °C. Forrás una tartera con la tapa de tarta y la pinchás con un tenedor.
Hervís la coliflor en arbolitos 6 minutos, la escurrís y la picás. Cortás el queso en cubitos.
Batís los huevos con la leche, sal, pimienta y nuez moscada. Mezclás con el relleno.
Volcás en la tartera y horneás 30–35 minutos, hasta que esté firme y dorada. Dejás entibiar 5 minutos antes de cortar en 4 porciones.'),
  ('tarta-de-palmitos-y-queso', 'Tarta de palmitos y queso', 39, 4, '{almuerzo,cena}', true, 'Precalentás el horno a 200 °C. Forrás una tartera con la tapa de tarta y la pinchás con un tenedor.
Escurrís los palmitos y los cortás en rodajas; picás la cebolla de verdeo y cortás el queso en cubitos.
Batís los huevos con la leche, sal, pimienta y nuez moscada. Mezclás con el relleno.
Volcás en la tartera y horneás 30–35 minutos, hasta que esté firme y dorada. Dejás entibiar 5 minutos antes de cortar en 4 porciones.'),
  ('revuelto-de-coliflor-y-queso', 'Revuelto de coliflor y queso', 15, 1, '{almuerzo,cena}', true, 'Hervís la coliflor en arbolitos 6 minutos, la escurrís y la picás. Cortás el queso en cubitos.
En una sartén antiadherente calentás el relleno 1 minuto.
Sumás los huevos batidos con sal y pimienta y revolvés suave con una espátula, 2–3 minutos, hasta que cuajen pero queden cremosos.
Servís enseguida, con una tostada si querés.'),
  ('omelette-de-ricota-y-espinaca', 'Omelette de ricota y espinaca', 12, 1, '{almuerzo,cena}', true, 'Salteás la espinaca con el aceite hasta que se achique, la picás y la mezclás con la ricota, sal y nuez moscada.
Batís los huevos con sal y pimienta.
En una sartén antiadherente con una gota de aceite, volcás los huevos a fuego medio y los dejás cuajar sin mover 2 minutos.
Ponés el relleno en la mitad, doblás el omelette y lo cocinás 1 minuto más. Servís enseguida.'),
  ('revuelto-de-acelga-y-queso', 'Revuelto de acelga y queso', 13, 1, '{almuerzo,cena}', true, 'Hervís la acelga 3 minutos, la escurrís bien, la exprimís y la picás. Cortás el queso en cubitos.
En una sartén antiadherente calentás el relleno 1 minuto.
Sumás los huevos batidos con sal y pimienta y revolvés suave con una espátula, 2–3 minutos, hasta que cuajen pero queden cremosos.
Servís enseguida, con una tostada si querés.'),
  ('frittata-de-zanahoria-y-arvejas-al-horno', 'Frittata de zanahoria y arvejas al horno', 18, 2, '{almuerzo,cena}', true, 'Precalentás el horno a 190 °C.
Rallás la zanahoria gruesa y la salteás con las arvejas y el aceite, 5 minutos.
Batís los huevos con sal, pimienta y una cucharada de queso rallado; sumás el relleno.
Volcás la mezcla en una sartén que vaya al horno (o una tartera aceitada) y cocinás 18–20 minutos, hasta que esté firme y dorada. Cortás en porciones.'),
  ('tarta-de-acelga-y-queso', 'Tarta de acelga y queso', 43, 4, '{almuerzo,cena}', true, 'Precalentás el horno a 200 °C. Forrás una tartera con la tapa de tarta y la pinchás con un tenedor.
Hervís la acelga 3 minutos, la escurrís bien, la exprimís y la picás. Cortás el queso en cubitos.
Batís los huevos con la leche, sal, pimienta y nuez moscada. Mezclás con el relleno.
Volcás en la tartera y horneás 30–35 minutos, hasta que esté firme y dorada. Dejás entibiar 5 minutos antes de cortar en 4 porciones.'),
  ('tarta-de-choclo-y-cebolla-de-verdeo', 'Tarta de choclo y cebolla de verdeo', 39, 4, '{almuerzo,cena}', true, 'Precalentás el horno a 200 °C. Forrás una tartera con la tapa de tarta y la pinchás con un tenedor.
Escurrís el choclo, picás la cebolla de verdeo y cortás el queso en cubitos.
Batís los huevos con la leche, sal, pimienta y nuez moscada. Mezclás con el relleno.
Volcás en la tartera y horneás 30–35 minutos, hasta que esté firme y dorada. Dejás entibiar 5 minutos antes de cortar en 4 porciones.'),
  ('frittata-de-berenjena-y-tomate-al-horno', 'Frittata de berenjena y tomate al horno', 24, 2, '{almuerzo,cena}', true, 'Precalentás el horno a 190 °C.
Cortás la berenjena en cubos y la dorás con el aceite 8 minutos; sumás el tomate en cubitos y cocinás 3 minutos más.
Batís los huevos con sal, pimienta y una cucharada de queso rallado; sumás el relleno.
Volcás la mezcla en una sartén que vaya al horno (o una tartera aceitada) y cocinás 18–20 minutos, hasta que esté firme y dorada. Cortás en porciones.'),
  ('frittata-de-coliflor-y-queso-al-horno', 'Frittata de coliflor y queso al horno', 20, 2, '{almuerzo,cena}', true, 'Precalentás el horno a 190 °C.
Hervís la coliflor en arbolitos 6 minutos, la escurrís y la picás. Cortás el queso en cubitos.
Batís los huevos con sal, pimienta y una cucharada de queso rallado; sumás el relleno.
Volcás la mezcla en una sartén que vaya al horno (o una tartera aceitada) y cocinás 18–20 minutos, hasta que esté firme y dorada. Cortás en porciones.'),
  ('tarta-de-espinaca-y-queso', 'Tarta de espinaca y queso', 41, 4, '{almuerzo,cena}', true, 'Precalentás el horno a 200 °C. Forrás una tartera con la tapa de tarta y la pinchás con un tenedor.
Salteás la espinaca lavada con el aceite hasta que se achique (2 minutos), la escurrís y la picás. Cortás el queso en cubitos.
Batís los huevos con la leche, sal, pimienta y nuez moscada. Mezclás con el relleno.
Volcás en la tartera y horneás 30–35 minutos, hasta que esté firme y dorada. Dejás entibiar 5 minutos antes de cortar en 4 porciones.'),
  ('frittata-de-acelga-y-queso-al-horno', 'Frittata de acelga y queso al horno', 18, 2, '{almuerzo,cena}', true, 'Precalentás el horno a 190 °C.
Hervís la acelga 3 minutos, la escurrís bien, la exprimís y la picás. Cortás el queso en cubitos.
Batís los huevos con sal, pimienta y una cucharada de queso rallado; sumás el relleno.
Volcás la mezcla en una sartén que vaya al horno (o una tartera aceitada) y cocinás 18–20 minutos, hasta que esté firme y dorada. Cortás en porciones.'),
  ('frittata-de-zapallitos-y-cebolla-al-horno', 'Frittata de zapallitos y cebolla al horno', 22, 2, '{almuerzo,cena}', true, 'Precalentás el horno a 190 °C.
Cortás el zapallito en rodajas finas y la cebolla en plumas, y los cocinás en la sartén con el aceite, 8 minutos, hasta que estén tiernos.
Batís los huevos con sal, pimienta y una cucharada de queso rallado; sumás el relleno.
Volcás la mezcla en una sartén que vaya al horno (o una tartera aceitada) y cocinás 18–20 minutos, hasta que esté firme y dorada. Cortás en porciones.'),
  ('revuelto-de-chauchas-y-queso', 'Revuelto de chauchas y queso', 15, 1, '{almuerzo,cena}', true, 'Hervís las chauchas en trozos 6 minutos, las escurrís; cortás el queso en cubitos.
En una sartén antiadherente calentás el relleno 1 minuto.
Sumás los huevos batidos con sal y pimienta y revolvés suave con una espátula, 2–3 minutos, hasta que cuajen pero queden cremosos.
Servís enseguida, con una tostada si querés.')
on conflict (slug) do nothing;

insert into public.recipe_items (recipe_id, food_id, qty)
select r.id, f.id, v.qty from (values
  ('salteado-de-salmon-picante-con-kale-y-champinones-sobre', 'salmon', 140),
  ('salteado-de-salmon-picante-con-kale-y-champinones-sobre', 'kale', 60),
  ('salteado-de-salmon-picante-con-kale-y-champinones-sobre', 'champinones', 90),
  ('salteado-de-salmon-picante-con-kale-y-champinones-sobre', 'cebolla', 0.5),
  ('salteado-de-salmon-picante-con-kale-y-champinones-sobre', 'quinoa', 55),
  ('salteado-de-salmon-picante-con-kale-y-champinones-sobre', 'salsa-soja', 10),
  ('salteado-de-salmon-picante-con-kale-y-champinones-sobre', 'salsa-picante', 10),
  ('salteado-de-salmon-picante-con-kale-y-champinones-sobre', 'miel', 5),
  ('salteado-de-salmon-picante-con-kale-y-champinones-sobre', 'aceite', 10),
  ('salteado-de-salmon-picante-con-kale-y-champinones-sobre', 'ajo', 1),
  ('salteado-de-salmon-picante-con-kale-y-champinones-sobre', 'sesamo', 4),
  ('wok-de-salmon-con-miel-y-soja-con-zapallito-morron-y', 'salmon', 140),
  ('wok-de-salmon-con-miel-y-soja-con-zapallito-morron-y', 'zapallito', 0.5),
  ('wok-de-salmon-con-miel-y-soja-con-zapallito-morron-y', 'morron', 0.5),
  ('wok-de-salmon-con-miel-y-soja-con-zapallito-morron-y', 'cebolla', 0.5),
  ('wok-de-salmon-con-miel-y-soja-con-zapallito-morron-y', 'salsa-soja', 15),
  ('wok-de-salmon-con-miel-y-soja-con-zapallito-morron-y', 'miel', 8),
  ('wok-de-salmon-con-miel-y-soja-con-zapallito-morron-y', 'aceite', 10),
  ('wok-de-salmon-con-miel-y-soja-con-zapallito-morron-y', 'ajo', 1),
  ('wok-de-salmon-con-miel-y-soja-con-zapallito-morron-y', 'sesamo', 4),
  ('wok-de-pollo-picante-con-berenjena-morron-y-cebolla-2', 'pechuga-cruda', 150),
  ('wok-de-pollo-picante-con-berenjena-morron-y-cebolla-2', 'berenjena', 0.5),
  ('wok-de-pollo-picante-con-berenjena-morron-y-cebolla-2', 'morron', 0.5),
  ('wok-de-pollo-picante-con-berenjena-morron-y-cebolla-2', 'cebolla-morada', 0.5),
  ('wok-de-pollo-picante-con-berenjena-morron-y-cebolla-2', 'cuscus', 60),
  ('wok-de-pollo-picante-con-berenjena-morron-y-cebolla-2', 'salsa-soja', 10),
  ('wok-de-pollo-picante-con-berenjena-morron-y-cebolla-2', 'salsa-picante', 10),
  ('wok-de-pollo-picante-con-berenjena-morron-y-cebolla-2', 'miel', 5),
  ('wok-de-pollo-picante-con-berenjena-morron-y-cebolla-2', 'aceite', 10),
  ('wok-de-pollo-picante-con-berenjena-morron-y-cebolla-2', 'ajo', 1),
  ('wok-de-pollo-picante-con-berenjena-morron-y-cebolla-2', 'sesamo', 4),
  ('wok-de-salmon-al-limon-con-champinones-espinaca-y', 'salmon', 140),
  ('wok-de-salmon-al-limon-con-champinones-espinaca-y', 'champinones', 90),
  ('wok-de-salmon-al-limon-con-champinones-espinaca-y', 'espinaca', 50),
  ('wok-de-salmon-al-limon-con-champinones-espinaca-y', 'cebolla', 0.5),
  ('wok-de-salmon-al-limon-con-champinones-espinaca-y', 'quinoa', 55),
  ('wok-de-salmon-al-limon-con-champinones-espinaca-y', 'salsa-soja', 10),
  ('wok-de-salmon-al-limon-con-champinones-espinaca-y', 'limon-exprimido', 20),
  ('wok-de-salmon-al-limon-con-champinones-espinaca-y', 'miel', 5),
  ('wok-de-salmon-al-limon-con-champinones-espinaca-y', 'aceite', 10),
  ('wok-de-salmon-al-limon-con-champinones-espinaca-y', 'ajo', 1),
  ('wok-de-salmon-al-limon-con-champinones-espinaca-y', 'sesamo', 4),
  ('wok-de-carne-agridulce-con-zanahoria-cebolla-y-morron', 'bife-nalga', 150),
  ('wok-de-carne-agridulce-con-zanahoria-cebolla-y-morron', 'zanahoria', 1),
  ('wok-de-carne-agridulce-con-zanahoria-cebolla-y-morron', 'cebolla', 0.5),
  ('wok-de-carne-agridulce-con-zanahoria-cebolla-y-morron', 'morron', 0.5),
  ('wok-de-carne-agridulce-con-zanahoria-cebolla-y-morron', 'fideos', 70),
  ('wok-de-carne-agridulce-con-zanahoria-cebolla-y-morron', 'ketchup', 15),
  ('wok-de-carne-agridulce-con-zanahoria-cebolla-y-morron', 'salsa-soja', 10),
  ('wok-de-carne-agridulce-con-zanahoria-cebolla-y-morron', 'vinagre-manzana', 8),
  ('wok-de-carne-agridulce-con-zanahoria-cebolla-y-morron', 'azucar', 5),
  ('wok-de-carne-agridulce-con-zanahoria-cebolla-y-morron', 'aceite', 10),
  ('wok-de-carne-agridulce-con-zanahoria-cebolla-y-morron', 'ajo', 1),
  ('wok-de-carne-agridulce-con-zanahoria-cebolla-y-morron', 'sesamo', 4),
  ('wok-de-carne-con-salsa-de-mani-con-brocoli-y-morron', 'bife-nalga', 150),
  ('wok-de-carne-con-salsa-de-mani-con-brocoli-y-morron', 'brocoli', 110),
  ('wok-de-carne-con-salsa-de-mani-con-brocoli-y-morron', 'morron', 0.5),
  ('wok-de-carne-con-salsa-de-mani-con-brocoli-y-morron', 'quinoa', 55),
  ('wok-de-carne-con-salsa-de-mani-con-brocoli-y-morron', 'mani-pasta', 20),
  ('wok-de-carne-con-salsa-de-mani-con-brocoli-y-morron', 'salsa-soja', 10),
  ('wok-de-carne-con-salsa-de-mani-con-brocoli-y-morron', 'limon-exprimido', 10),
  ('wok-de-carne-con-salsa-de-mani-con-brocoli-y-morron', 'aceite', 10),
  ('wok-de-carne-con-salsa-de-mani-con-brocoli-y-morron', 'ajo', 1),
  ('wok-de-carne-con-salsa-de-mani-con-brocoli-y-morron', 'sesamo', 4),
  ('wok-de-huevo-al-limon-con-chauchas-zanahoria-y-repollo', 'huevo', 2),
  ('wok-de-huevo-al-limon-con-chauchas-zanahoria-y-repollo', 'chauchas', 80),
  ('wok-de-huevo-al-limon-con-chauchas-zanahoria-y-repollo', 'zanahoria', 0.5),
  ('wok-de-huevo-al-limon-con-chauchas-zanahoria-y-repollo', 'repollo', 70),
  ('wok-de-huevo-al-limon-con-chauchas-zanahoria-y-repollo', 'quinoa', 55),
  ('wok-de-huevo-al-limon-con-chauchas-zanahoria-y-repollo', 'salsa-soja', 10),
  ('wok-de-huevo-al-limon-con-chauchas-zanahoria-y-repollo', 'limon-exprimido', 20),
  ('wok-de-huevo-al-limon-con-chauchas-zanahoria-y-repollo', 'miel', 5),
  ('wok-de-huevo-al-limon-con-chauchas-zanahoria-y-repollo', 'aceite', 10),
  ('wok-de-huevo-al-limon-con-chauchas-zanahoria-y-repollo', 'ajo', 1),
  ('wok-de-huevo-al-limon-con-chauchas-zanahoria-y-repollo', 'sesamo', 4),
  ('wok-de-cuadril-al-limon-con-brocoli-y-morron-sobre', 'cuadril', 150),
  ('wok-de-cuadril-al-limon-con-brocoli-y-morron-sobre', 'brocoli', 110),
  ('wok-de-cuadril-al-limon-con-brocoli-y-morron-sobre', 'morron', 0.5),
  ('wok-de-cuadril-al-limon-con-brocoli-y-morron-sobre', 'quinoa', 55),
  ('wok-de-cuadril-al-limon-con-brocoli-y-morron-sobre', 'salsa-soja', 10),
  ('wok-de-cuadril-al-limon-con-brocoli-y-morron-sobre', 'limon-exprimido', 20),
  ('wok-de-cuadril-al-limon-con-brocoli-y-morron-sobre', 'miel', 5),
  ('wok-de-cuadril-al-limon-con-brocoli-y-morron-sobre', 'aceite', 10),
  ('wok-de-cuadril-al-limon-con-brocoli-y-morron-sobre', 'ajo', 1),
  ('wok-de-cuadril-al-limon-con-brocoli-y-morron-sobre', 'sesamo', 4),
  ('wok-de-huevo-al-limon-con-esparragos-y-zanahoria-sobre', 'huevo', 2),
  ('wok-de-huevo-al-limon-con-esparragos-y-zanahoria-sobre', 'esparragos', 100),
  ('wok-de-huevo-al-limon-con-esparragos-y-zanahoria-sobre', 'zanahoria', 1),
  ('wok-de-huevo-al-limon-con-esparragos-y-zanahoria-sobre', 'cebolla-verdeo', 15),
  ('wok-de-huevo-al-limon-con-esparragos-y-zanahoria-sobre', 'cuscus', 60),
  ('wok-de-huevo-al-limon-con-esparragos-y-zanahoria-sobre', 'salsa-soja', 10),
  ('wok-de-huevo-al-limon-con-esparragos-y-zanahoria-sobre', 'limon-exprimido', 20),
  ('wok-de-huevo-al-limon-con-esparragos-y-zanahoria-sobre', 'miel', 5),
  ('wok-de-huevo-al-limon-con-esparragos-y-zanahoria-sobre', 'aceite', 10),
  ('wok-de-huevo-al-limon-con-esparragos-y-zanahoria-sobre', 'ajo', 1),
  ('wok-de-huevo-al-limon-con-esparragos-y-zanahoria-sobre', 'sesamo', 4),
  ('wok-de-cerdo-agridulce-con-brocoli-y-morron-sobre', 'lomo-cerdo', 150),
  ('wok-de-cerdo-agridulce-con-brocoli-y-morron-sobre', 'brocoli', 110),
  ('wok-de-cerdo-agridulce-con-brocoli-y-morron-sobre', 'morron', 0.5),
  ('wok-de-cerdo-agridulce-con-brocoli-y-morron-sobre', 'fideos-arroz', 60),
  ('wok-de-cerdo-agridulce-con-brocoli-y-morron-sobre', 'ketchup', 15),
  ('wok-de-cerdo-agridulce-con-brocoli-y-morron-sobre', 'salsa-soja', 10),
  ('wok-de-cerdo-agridulce-con-brocoli-y-morron-sobre', 'vinagre-manzana', 8),
  ('wok-de-cerdo-agridulce-con-brocoli-y-morron-sobre', 'azucar', 5),
  ('wok-de-cerdo-agridulce-con-brocoli-y-morron-sobre', 'aceite', 10),
  ('wok-de-cerdo-agridulce-con-brocoli-y-morron-sobre', 'ajo', 1),
  ('wok-de-cerdo-agridulce-con-brocoli-y-morron-sobre', 'sesamo', 4),
  ('wok-de-salmon-al-teriyaki-con-kale-y-champinones-sobre', 'salmon', 140),
  ('wok-de-salmon-al-teriyaki-con-kale-y-champinones-sobre', 'kale', 60),
  ('wok-de-salmon-al-teriyaki-con-kale-y-champinones-sobre', 'champinones', 90),
  ('wok-de-salmon-al-teriyaki-con-kale-y-champinones-sobre', 'cebolla', 0.5),
  ('wok-de-salmon-al-teriyaki-con-kale-y-champinones-sobre', 'cuscus', 60),
  ('wok-de-salmon-al-teriyaki-con-kale-y-champinones-sobre', 'salsa-teriyaki', 30),
  ('wok-de-salmon-al-teriyaki-con-kale-y-champinones-sobre', 'aceite', 10),
  ('wok-de-salmon-al-teriyaki-con-kale-y-champinones-sobre', 'ajo', 1),
  ('wok-de-salmon-al-teriyaki-con-kale-y-champinones-sobre', 'sesamo', 4),
  ('wok-de-tempeh-picante-con-zanahoria-arvejas-y-choclo', 'tempeh', 110),
  ('wok-de-tempeh-picante-con-zanahoria-arvejas-y-choclo', 'zanahoria', 1),
  ('wok-de-tempeh-picante-con-zanahoria-arvejas-y-choclo', 'arvejas-frescas', 50),
  ('wok-de-tempeh-picante-con-zanahoria-arvejas-y-choclo', 'choclo', 50),
  ('wok-de-tempeh-picante-con-zanahoria-arvejas-y-choclo', 'arroz-integral', 65),
  ('wok-de-tempeh-picante-con-zanahoria-arvejas-y-choclo', 'salsa-soja', 10),
  ('wok-de-tempeh-picante-con-zanahoria-arvejas-y-choclo', 'salsa-picante', 10),
  ('wok-de-tempeh-picante-con-zanahoria-arvejas-y-choclo', 'miel', 5),
  ('wok-de-tempeh-picante-con-zanahoria-arvejas-y-choclo', 'aceite', 10),
  ('wok-de-tempeh-picante-con-zanahoria-arvejas-y-choclo', 'ajo', 1),
  ('wok-de-tempeh-picante-con-zanahoria-arvejas-y-choclo', 'sesamo', 4),
  ('wok-de-pollo-con-miso-con-kale-y-champinones-sobre', 'pechuga-cruda', 150),
  ('wok-de-pollo-con-miso-con-kale-y-champinones-sobre', 'kale', 60),
  ('wok-de-pollo-con-miso-con-kale-y-champinones-sobre', 'champinones', 90),
  ('wok-de-pollo-con-miso-con-kale-y-champinones-sobre', 'cebolla', 0.5),
  ('wok-de-pollo-con-miso-con-kale-y-champinones-sobre', 'arroz-basmati', 65),
  ('wok-de-pollo-con-miso-con-kale-y-champinones-sobre', 'pasta-miso', 10),
  ('wok-de-pollo-con-miso-con-kale-y-champinones-sobre', 'vinagre-manzana', 5),
  ('wok-de-pollo-con-miso-con-kale-y-champinones-sobre', 'aceite', 10),
  ('wok-de-pollo-con-miso-con-kale-y-champinones-sobre', 'ajo', 1),
  ('wok-de-pollo-con-miso-con-kale-y-champinones-sobre', 'sesamo', 4),
  ('wok-de-huevo-con-miel-y-soja-con-zanahoria-arvejas-y', 'huevo', 2),
  ('wok-de-huevo-con-miel-y-soja-con-zanahoria-arvejas-y', 'zanahoria', 1),
  ('wok-de-huevo-con-miel-y-soja-con-zanahoria-arvejas-y', 'arvejas-frescas', 50),
  ('wok-de-huevo-con-miel-y-soja-con-zanahoria-arvejas-y', 'choclo', 50),
  ('wok-de-huevo-con-miel-y-soja-con-zanahoria-arvejas-y', 'arroz', 65),
  ('wok-de-huevo-con-miel-y-soja-con-zanahoria-arvejas-y', 'salsa-soja', 15),
  ('wok-de-huevo-con-miel-y-soja-con-zanahoria-arvejas-y', 'miel', 8),
  ('wok-de-huevo-con-miel-y-soja-con-zanahoria-arvejas-y', 'aceite', 10),
  ('wok-de-huevo-con-miel-y-soja-con-zanahoria-arvejas-y', 'ajo', 1),
  ('wok-de-huevo-con-miel-y-soja-con-zanahoria-arvejas-y', 'sesamo', 4),
  ('wok-de-huevo-al-teriyaki-con-coliflor-y-zanahoria', 'huevo', 2),
  ('wok-de-huevo-al-teriyaki-con-coliflor-y-zanahoria', 'coliflor', 100),
  ('wok-de-huevo-al-teriyaki-con-coliflor-y-zanahoria', 'zanahoria', 1),
  ('wok-de-huevo-al-teriyaki-con-coliflor-y-zanahoria', 'cebolla', 0.5),
  ('wok-de-huevo-al-teriyaki-con-coliflor-y-zanahoria', 'salsa-teriyaki', 30),
  ('wok-de-huevo-al-teriyaki-con-coliflor-y-zanahoria', 'aceite', 10),
  ('wok-de-huevo-al-teriyaki-con-coliflor-y-zanahoria', 'ajo', 1),
  ('wok-de-huevo-al-teriyaki-con-coliflor-y-zanahoria', 'sesamo', 4),
  ('wok-de-pollo-agridulce-con-kale-y-champinones-sobre', 'pechuga-cruda', 150),
  ('wok-de-pollo-agridulce-con-kale-y-champinones-sobre', 'kale', 60),
  ('wok-de-pollo-agridulce-con-kale-y-champinones-sobre', 'champinones', 90),
  ('wok-de-pollo-agridulce-con-kale-y-champinones-sobre', 'cebolla', 0.5),
  ('wok-de-pollo-agridulce-con-kale-y-champinones-sobre', 'fideos', 70),
  ('wok-de-pollo-agridulce-con-kale-y-champinones-sobre', 'ketchup', 15),
  ('wok-de-pollo-agridulce-con-kale-y-champinones-sobre', 'salsa-soja', 10),
  ('wok-de-pollo-agridulce-con-kale-y-champinones-sobre', 'vinagre-manzana', 8),
  ('wok-de-pollo-agridulce-con-kale-y-champinones-sobre', 'azucar', 5),
  ('wok-de-pollo-agridulce-con-kale-y-champinones-sobre', 'aceite', 10),
  ('wok-de-pollo-agridulce-con-kale-y-champinones-sobre', 'ajo', 1),
  ('wok-de-pollo-agridulce-con-kale-y-champinones-sobre', 'sesamo', 4),
  ('wok-de-huevo-agridulce-con-champinones-espinaca-y', 'huevo', 2),
  ('wok-de-huevo-agridulce-con-champinones-espinaca-y', 'champinones', 90),
  ('wok-de-huevo-agridulce-con-champinones-espinaca-y', 'espinaca', 50),
  ('wok-de-huevo-agridulce-con-champinones-espinaca-y', 'cebolla', 0.5),
  ('wok-de-huevo-agridulce-con-champinones-espinaca-y', 'cuscus', 60),
  ('wok-de-huevo-agridulce-con-champinones-espinaca-y', 'ketchup', 15),
  ('wok-de-huevo-agridulce-con-champinones-espinaca-y', 'salsa-soja', 10),
  ('wok-de-huevo-agridulce-con-champinones-espinaca-y', 'vinagre-manzana', 8),
  ('wok-de-huevo-agridulce-con-champinones-espinaca-y', 'azucar', 5),
  ('wok-de-huevo-agridulce-con-champinones-espinaca-y', 'aceite', 10),
  ('wok-de-huevo-agridulce-con-champinones-espinaca-y', 'ajo', 1),
  ('wok-de-huevo-agridulce-con-champinones-espinaca-y', 'sesamo', 4),
  ('wok-de-pavo-con-miso-con-zanahoria-cebolla-y-morron', 'pechuga-pavo', 150),
  ('wok-de-pavo-con-miso-con-zanahoria-cebolla-y-morron', 'zanahoria', 1),
  ('wok-de-pavo-con-miso-con-zanahoria-cebolla-y-morron', 'cebolla', 0.5),
  ('wok-de-pavo-con-miso-con-zanahoria-cebolla-y-morron', 'morron', 0.5),
  ('wok-de-pavo-con-miso-con-zanahoria-cebolla-y-morron', 'arroz-integral', 65),
  ('wok-de-pavo-con-miso-con-zanahoria-cebolla-y-morron', 'pasta-miso', 10),
  ('wok-de-pavo-con-miso-con-zanahoria-cebolla-y-morron', 'vinagre-manzana', 5),
  ('wok-de-pavo-con-miso-con-zanahoria-cebolla-y-morron', 'aceite', 10),
  ('wok-de-pavo-con-miso-con-zanahoria-cebolla-y-morron', 'ajo', 1),
  ('wok-de-pavo-con-miso-con-zanahoria-cebolla-y-morron', 'sesamo', 4),
  ('wok-de-langostinos-al-limon-con-esparragos-y-zanahoria', 'langostinos', 130),
  ('wok-de-langostinos-al-limon-con-esparragos-y-zanahoria', 'esparragos', 100),
  ('wok-de-langostinos-al-limon-con-esparragos-y-zanahoria', 'zanahoria', 1),
  ('wok-de-langostinos-al-limon-con-esparragos-y-zanahoria', 'cebolla-verdeo', 15),
  ('wok-de-langostinos-al-limon-con-esparragos-y-zanahoria', 'cuscus', 60),
  ('wok-de-langostinos-al-limon-con-esparragos-y-zanahoria', 'salsa-soja', 10),
  ('wok-de-langostinos-al-limon-con-esparragos-y-zanahoria', 'limon-exprimido', 20),
  ('wok-de-langostinos-al-limon-con-esparragos-y-zanahoria', 'miel', 5),
  ('wok-de-langostinos-al-limon-con-esparragos-y-zanahoria', 'aceite', 10),
  ('wok-de-langostinos-al-limon-con-esparragos-y-zanahoria', 'ajo', 1),
  ('wok-de-langostinos-al-limon-con-esparragos-y-zanahoria', 'sesamo', 4),
  ('salteado-de-salmon-al-teriyaki-con-zanahoria-arvejas-y', 'salmon', 140),
  ('salteado-de-salmon-al-teriyaki-con-zanahoria-arvejas-y', 'zanahoria', 1),
  ('salteado-de-salmon-al-teriyaki-con-zanahoria-arvejas-y', 'arvejas-frescas', 50),
  ('salteado-de-salmon-al-teriyaki-con-zanahoria-arvejas-y', 'choclo', 50),
  ('salteado-de-salmon-al-teriyaki-con-zanahoria-arvejas-y', 'salsa-teriyaki', 30),
  ('salteado-de-salmon-al-teriyaki-con-zanahoria-arvejas-y', 'aceite', 10),
  ('salteado-de-salmon-al-teriyaki-con-zanahoria-arvejas-y', 'ajo', 1),
  ('salteado-de-salmon-al-teriyaki-con-zanahoria-arvejas-y', 'sesamo', 4),
  ('agnolotis-con-jamon-y-arvejas', 'agnolotis', 160),
  ('agnolotis-con-jamon-y-arvejas', 'jamon-cocido', 60),
  ('agnolotis-con-jamon-y-arvejas', 'arvejas-frescas', 60),
  ('agnolotis-con-jamon-y-arvejas', 'crema', 40),
  ('agnolotis-con-jamon-y-arvejas', 'cebolla', 0.5),
  ('agnolotis-con-jamon-y-arvejas', 'aceite', 5),
  ('tallarines-con-cuatro-quesos', 'fideos-frescos', 125),
  ('tallarines-con-cuatro-quesos', 'queso-cremoso', 40),
  ('tallarines-con-cuatro-quesos', 'muzzarella', 20),
  ('tallarines-con-cuatro-quesos', 'queso-azul', 15),
  ('tallarines-con-cuatro-quesos', 'queso-rallado', 10),
  ('tallarines-con-cuatro-quesos', 'leche', 60),
  ('noquis-con-pesto-y-tomates-cherry', 'noquis', 210),
  ('noquis-con-pesto-y-tomates-cherry', 'pesto', 35),
  ('noquis-con-pesto-y-tomates-cherry', 'tomate-cherry', 80),
  ('noquis-con-pesto-y-tomates-cherry', 'queso-rallado', 10),
  ('fideos-con-zucchini-y-limon', 'fideos', 85),
  ('fideos-con-zucchini-y-limon', 'zapallito', 1),
  ('fideos-con-zucchini-y-limon', 'limon-exprimido', 15),
  ('fideos-con-zucchini-y-limon', 'aceite-oliva', 10),
  ('fideos-con-zucchini-y-limon', 'ajo', 0.5),
  ('fideos-con-zucchini-y-limon', 'parmesano', 15),
  ('fideos-con-albondigas', 'fideos', 85),
  ('fideos-con-albondigas', 'carne-picada-cruda', 100),
  ('fideos-con-albondigas', 'pan-rallado', 15),
  ('fideos-con-albondigas', 'tomate-triturado', 120),
  ('fideos-con-albondigas', 'cebolla', 0.5),
  ('fideos-con-albondigas', 'ajo', 1),
  ('fideos-con-albondigas', 'aceite', 6),
  ('fideos-con-albondigas', 'perejil', 3),
  ('fideos-con-albondigas', 'huevo', 0.5),
  ('tallarines-con-jamon-y-arvejas', 'fideos-frescos', 125),
  ('tallarines-con-jamon-y-arvejas', 'jamon-cocido', 60),
  ('tallarines-con-jamon-y-arvejas', 'arvejas-frescas', 60),
  ('tallarines-con-jamon-y-arvejas', 'crema', 40),
  ('tallarines-con-jamon-y-arvejas', 'cebolla', 0.5),
  ('tallarines-con-jamon-y-arvejas', 'aceite', 5),
  ('fideos-de-arroz-con-calabaza-y-queso-azul', 'fideos-arroz', 75),
  ('fideos-de-arroz-con-calabaza-y-queso-azul', 'calabaza', 150),
  ('fideos-de-arroz-con-calabaza-y-queso-azul', 'queso-azul', 25),
  ('fideos-de-arroz-con-calabaza-y-queso-azul', 'cebolla', 0.5),
  ('fideos-de-arroz-con-calabaza-y-queso-azul', 'aceite', 6),
  ('fideos-de-arroz-con-calabaza-y-queso-azul', 'nueces', 10),
  ('espaguetis-con-atun-y-tomate', 'fideos', 85),
  ('espaguetis-con-atun-y-tomate', 'atun-natural', 1),
  ('espaguetis-con-atun-y-tomate', 'tomate-triturado', 100),
  ('espaguetis-con-atun-y-tomate', 'cebolla', 0.5),
  ('espaguetis-con-atun-y-tomate', 'aceitunas', 15),
  ('espaguetis-con-atun-y-tomate', 'aceite', 6),
  ('espaguetis-con-atun-y-tomate', 'perejil', 3),
  ('tallarines-con-verduras-asadas', 'fideos-frescos', 125),
  ('tallarines-con-verduras-asadas', 'berenjena', 0.5),
  ('tallarines-con-verduras-asadas', 'morron', 0.5),
  ('tallarines-con-verduras-asadas', 'zapallito', 0.5),
  ('tallarines-con-verduras-asadas', 'cebolla', 0.5),
  ('tallarines-con-verduras-asadas', 'aceite', 10),
  ('tallarines-con-verduras-asadas', 'albahaca', 3),
  ('tallarines-con-verduras-asadas', 'ajo', 0.5),
  ('fideos-con-cuatro-quesos', 'fideos', 85),
  ('fideos-con-cuatro-quesos', 'queso-cremoso', 40),
  ('fideos-con-cuatro-quesos', 'muzzarella', 20),
  ('fideos-con-cuatro-quesos', 'queso-azul', 15),
  ('fideos-con-cuatro-quesos', 'queso-rallado', 10),
  ('fideos-con-cuatro-quesos', 'leche', 60),
  ('fideos-integrales-con-langostinos-al-ajillo', 'fideos-integrales', 85),
  ('fideos-integrales-con-langostinos-al-ajillo', 'langostinos', 120),
  ('fideos-integrales-con-langostinos-al-ajillo', 'ajo', 2),
  ('fideos-integrales-con-langostinos-al-ajillo', 'aceite-oliva', 10),
  ('fideos-integrales-con-langostinos-al-ajillo', 'perejil', 5),
  ('fideos-integrales-con-langostinos-al-ajillo', 'limon-exprimido', 10),
  ('tallarines-con-albondigas', 'fideos-frescos', 125),
  ('tallarines-con-albondigas', 'carne-picada-cruda', 100),
  ('tallarines-con-albondigas', 'pan-rallado', 15),
  ('tallarines-con-albondigas', 'tomate-triturado', 120),
  ('tallarines-con-albondigas', 'cebolla', 0.5),
  ('tallarines-con-albondigas', 'ajo', 1),
  ('tallarines-con-albondigas', 'aceite', 6),
  ('tallarines-con-albondigas', 'perejil', 3),
  ('tallarines-con-albondigas', 'huevo', 0.5),
  ('tallarines-con-ajo-y-aceite', 'fideos-frescos', 125),
  ('tallarines-con-ajo-y-aceite', 'aceite-oliva', 10),
  ('tallarines-con-ajo-y-aceite', 'ajo', 2),
  ('tallarines-con-ajo-y-aceite', 'perejil', 5),
  ('tallarines-con-ajo-y-aceite', 'queso-rallado', 10),
  ('tallarines-con-zucchini-y-limon', 'fideos-frescos', 125),
  ('tallarines-con-zucchini-y-limon', 'zapallito', 1),
  ('tallarines-con-zucchini-y-limon', 'limon-exprimido', 15),
  ('tallarines-con-zucchini-y-limon', 'aceite-oliva', 10),
  ('tallarines-con-zucchini-y-limon', 'ajo', 0.5),
  ('tallarines-con-zucchini-y-limon', 'parmesano', 15),
  ('fideos-integrales-con-puttanesca', 'fideos-integrales', 85),
  ('fideos-integrales-con-puttanesca', 'tomate-triturado', 120),
  ('fideos-integrales-con-puttanesca', 'aceitunas', 25),
  ('fideos-integrales-con-puttanesca', 'alcaparras', 8),
  ('fideos-integrales-con-puttanesca', 'anchoas', 10),
  ('fideos-integrales-con-puttanesca', 'ajo', 1),
  ('fideos-integrales-con-puttanesca', 'aceite', 8),
  ('fideos-integrales-con-puttanesca', 'perejil', 3),
  ('noquis-con-salsa-blanca-y-jamon', 'noquis', 210),
  ('noquis-con-salsa-blanca-y-jamon', 'salsa-blanca', 90),
  ('noquis-con-salsa-blanca-y-jamon', 'jamon-cocido', 50),
  ('noquis-con-salsa-blanca-y-jamon', 'queso-rallado', 10),
  ('espaguetis-con-brocoli-y-ajo', 'fideos', 85),
  ('espaguetis-con-brocoli-y-ajo', 'brocoli', 130),
  ('espaguetis-con-brocoli-y-ajo', 'ajo', 1.5),
  ('espaguetis-con-brocoli-y-ajo', 'aceite-oliva', 10),
  ('espaguetis-con-brocoli-y-ajo', 'queso-rallado', 10),
  ('ravioles-con-jamon-y-arvejas', 'ravioles', 160),
  ('ravioles-con-jamon-y-arvejas', 'jamon-cocido', 60),
  ('ravioles-con-jamon-y-arvejas', 'arvejas-frescas', 60),
  ('ravioles-con-jamon-y-arvejas', 'crema', 40),
  ('ravioles-con-jamon-y-arvejas', 'cebolla', 0.5),
  ('ravioles-con-jamon-y-arvejas', 'aceite', 5),
  ('noquis-con-salsa-de-calabaza', 'noquis', 210),
  ('noquis-con-salsa-de-calabaza', 'calabaza', 150),
  ('noquis-con-salsa-de-calabaza', 'cebolla', 0.5),
  ('noquis-con-salsa-de-calabaza', 'ajo', 0.5),
  ('noquis-con-salsa-de-calabaza', 'aceite', 6),
  ('noquis-con-salsa-de-calabaza', 'queso-rallado', 10),
  ('tallarines-con-salsa-fileto', 'fideos-frescos', 125),
  ('tallarines-con-salsa-fileto', 'tomate-triturado', 130),
  ('tallarines-con-salsa-fileto', 'cebolla', 0.5),
  ('tallarines-con-salsa-fileto', 'ajo', 1),
  ('tallarines-con-salsa-fileto', 'aceite', 8),
  ('tallarines-con-salsa-fileto', 'albahaca', 4),
  ('tallarines-con-berenjenas-y-tomate', 'fideos-frescos', 125),
  ('tallarines-con-berenjenas-y-tomate', 'berenjena', 0.5),
  ('tallarines-con-berenjenas-y-tomate', 'tomate-triturado', 100),
  ('tallarines-con-berenjenas-y-tomate', 'cebolla', 0.5),
  ('tallarines-con-berenjenas-y-tomate', 'aceite', 10),
  ('tallarines-con-berenjenas-y-tomate', 'muzzarella', 40),
  ('fideos-con-calabaza-y-queso-azul', 'fideos', 85),
  ('fideos-con-calabaza-y-queso-azul', 'calabaza', 150),
  ('fideos-con-calabaza-y-queso-azul', 'queso-azul', 25),
  ('fideos-con-calabaza-y-queso-azul', 'cebolla', 0.5),
  ('fideos-con-calabaza-y-queso-azul', 'aceite', 6),
  ('fideos-con-calabaza-y-queso-azul', 'nueces', 10),
  ('fideos-con-pesto-y-tomates-cherry', 'fideos', 85),
  ('fideos-con-pesto-y-tomates-cherry', 'pesto', 35),
  ('fideos-con-pesto-y-tomates-cherry', 'tomate-cherry', 80),
  ('fideos-con-pesto-y-tomates-cherry', 'queso-rallado', 10),
  ('sorrentinos-con-rucula-cherry-y-parmesano', 'sorrentinos', 160),
  ('sorrentinos-con-rucula-cherry-y-parmesano', 'rucula', 40),
  ('sorrentinos-con-rucula-cherry-y-parmesano', 'tomate-cherry', 120),
  ('sorrentinos-con-rucula-cherry-y-parmesano', 'aceite-oliva', 10),
  ('sorrentinos-con-rucula-cherry-y-parmesano', 'parmesano', 15),
  ('sorrentinos-con-rucula-cherry-y-parmesano', 'ajo', 0.5),
  ('tallarines-con-mejillones-y-tomate', 'fideos-frescos', 125),
  ('tallarines-con-mejillones-y-tomate', 'mejillones', 120),
  ('tallarines-con-mejillones-y-tomate', 'tomate-triturado', 100),
  ('tallarines-con-mejillones-y-tomate', 'ajo', 1),
  ('tallarines-con-mejillones-y-tomate', 'aceite', 8),
  ('tallarines-con-mejillones-y-tomate', 'perejil', 3),
  ('espaguetis-con-puttanesca', 'fideos', 85),
  ('espaguetis-con-puttanesca', 'tomate-triturado', 120),
  ('espaguetis-con-puttanesca', 'aceitunas', 25),
  ('espaguetis-con-puttanesca', 'alcaparras', 8),
  ('espaguetis-con-puttanesca', 'anchoas', 10),
  ('espaguetis-con-puttanesca', 'ajo', 1),
  ('espaguetis-con-puttanesca', 'aceite', 8),
  ('espaguetis-con-puttanesca', 'perejil', 3),
  ('noquis-con-rucula-cherry-y-parmesano', 'noquis', 210),
  ('noquis-con-rucula-cherry-y-parmesano', 'rucula', 40),
  ('noquis-con-rucula-cherry-y-parmesano', 'tomate-cherry', 120),
  ('noquis-con-rucula-cherry-y-parmesano', 'aceite-oliva', 10),
  ('noquis-con-rucula-cherry-y-parmesano', 'parmesano', 15),
  ('noquis-con-rucula-cherry-y-parmesano', 'ajo', 0.5),
  ('fideos-integrales-con-verduras-asadas', 'fideos-integrales', 85),
  ('fideos-integrales-con-verduras-asadas', 'berenjena', 0.5),
  ('fideos-integrales-con-verduras-asadas', 'morron', 0.5),
  ('fideos-integrales-con-verduras-asadas', 'zapallito', 0.5),
  ('fideos-integrales-con-verduras-asadas', 'cebolla', 0.5),
  ('fideos-integrales-con-verduras-asadas', 'aceite', 10),
  ('fideos-integrales-con-verduras-asadas', 'albahaca', 3),
  ('fideos-integrales-con-verduras-asadas', 'ajo', 0.5),
  ('agnolotis-con-tomates-asados-y-albahaca', 'agnolotis', 160),
  ('agnolotis-con-tomates-asados-y-albahaca', 'tomate-cherry', 200),
  ('agnolotis-con-tomates-asados-y-albahaca', 'ajo', 1),
  ('agnolotis-con-tomates-asados-y-albahaca', 'aceite-oliva', 10),
  ('agnolotis-con-tomates-asados-y-albahaca', 'albahaca', 5),
  ('agnolotis-con-tomates-asados-y-albahaca', 'queso-rallado', 10),
  ('espaguetis-con-pollo-champinones-y-crema', 'fideos', 85),
  ('espaguetis-con-pollo-champinones-y-crema', 'pechuga-cruda', 110),
  ('espaguetis-con-pollo-champinones-y-crema', 'champinones', 80),
  ('espaguetis-con-pollo-champinones-y-crema', 'crema', 40),
  ('espaguetis-con-pollo-champinones-y-crema', 'cebolla', 0.5),
  ('espaguetis-con-pollo-champinones-y-crema', 'aceite', 5),
  ('espaguetis-con-crema-y-champinones', 'fideos', 85),
  ('espaguetis-con-crema-y-champinones', 'champinones', 110),
  ('espaguetis-con-crema-y-champinones', 'crema', 40),
  ('espaguetis-con-crema-y-champinones', 'cebolla', 0.5),
  ('espaguetis-con-crema-y-champinones', 'ajo', 0.5),
  ('espaguetis-con-crema-y-champinones', 'aceite', 5),
  ('espaguetis-con-crema-y-champinones', 'queso-rallado', 10),
  ('sorrentinos-con-jamon-y-arvejas', 'sorrentinos', 160),
  ('sorrentinos-con-jamon-y-arvejas', 'jamon-cocido', 60),
  ('sorrentinos-con-jamon-y-arvejas', 'arvejas-frescas', 60),
  ('sorrentinos-con-jamon-y-arvejas', 'crema', 40),
  ('sorrentinos-con-jamon-y-arvejas', 'cebolla', 0.5),
  ('sorrentinos-con-jamon-y-arvejas', 'aceite', 5),
  ('espaguetis-con-langostinos-al-ajillo', 'fideos', 85),
  ('espaguetis-con-langostinos-al-ajillo', 'langostinos', 120),
  ('espaguetis-con-langostinos-al-ajillo', 'ajo', 2),
  ('espaguetis-con-langostinos-al-ajillo', 'aceite-oliva', 10),
  ('espaguetis-con-langostinos-al-ajillo', 'perejil', 5),
  ('espaguetis-con-langostinos-al-ajillo', 'limon-exprimido', 10),
  ('fideos-integrales-con-rucula-cherry-y-parmesano', 'fideos-integrales', 85),
  ('fideos-integrales-con-rucula-cherry-y-parmesano', 'rucula', 40),
  ('fideos-integrales-con-rucula-cherry-y-parmesano', 'tomate-cherry', 120),
  ('fideos-integrales-con-rucula-cherry-y-parmesano', 'aceite-oliva', 10),
  ('fideos-integrales-con-rucula-cherry-y-parmesano', 'parmesano', 15),
  ('fideos-integrales-con-rucula-cherry-y-parmesano', 'ajo', 0.5),
  ('espaguetis-con-rucula-cherry-y-parmesano', 'fideos', 85),
  ('espaguetis-con-rucula-cherry-y-parmesano', 'rucula', 40),
  ('espaguetis-con-rucula-cherry-y-parmesano', 'tomate-cherry', 120),
  ('espaguetis-con-rucula-cherry-y-parmesano', 'aceite-oliva', 10),
  ('espaguetis-con-rucula-cherry-y-parmesano', 'parmesano', 15),
  ('espaguetis-con-rucula-cherry-y-parmesano', 'ajo', 0.5),
  ('fideos-con-espinaca-y-ricota', 'fideos', 85),
  ('fideos-con-espinaca-y-ricota', 'espinaca', 120),
  ('fideos-con-espinaca-y-ricota', 'ricota', 70),
  ('fideos-con-espinaca-y-ricota', 'ajo', 0.5),
  ('fideos-con-espinaca-y-ricota', 'aceite', 6),
  ('fideos-con-espinaca-y-ricota', 'queso-rallado', 10),
  ('fideos-integrales-con-tuco', 'fideos-integrales', 85),
  ('fideos-integrales-con-tuco', 'tomate-triturado', 130),
  ('fideos-integrales-con-tuco', 'cebolla', 0.5),
  ('fideos-integrales-con-tuco', 'morron', 0.5),
  ('fideos-integrales-con-tuco', 'ajo', 1),
  ('fideos-integrales-con-tuco', 'aceite', 8),
  ('fideos-integrales-con-brocoli-y-ajo', 'fideos-integrales', 85),
  ('fideos-integrales-con-brocoli-y-ajo', 'brocoli', 130),
  ('fideos-integrales-con-brocoli-y-ajo', 'ajo', 1.5),
  ('fideos-integrales-con-brocoli-y-ajo', 'aceite-oliva', 10),
  ('fideos-integrales-con-brocoli-y-ajo', 'queso-rallado', 10),
  ('fideos-con-atun-limon-y-rucula', 'fideos', 85),
  ('fideos-con-atun-limon-y-rucula', 'atun-natural', 1),
  ('fideos-con-atun-limon-y-rucula', 'limon-exprimido', 10),
  ('fideos-con-atun-limon-y-rucula', 'rucula', 40),
  ('fideos-con-atun-limon-y-rucula', 'aceite-oliva', 10),
  ('fideos-con-atun-limon-y-rucula', 'alcaparras', 5),
  ('fideos-de-arroz-con-crema-y-champinones', 'fideos-arroz', 75),
  ('fideos-de-arroz-con-crema-y-champinones', 'champinones', 110),
  ('fideos-de-arroz-con-crema-y-champinones', 'crema', 40),
  ('fideos-de-arroz-con-crema-y-champinones', 'cebolla', 0.5),
  ('fideos-de-arroz-con-crema-y-champinones', 'ajo', 0.5),
  ('fideos-de-arroz-con-crema-y-champinones', 'aceite', 5),
  ('fideos-de-arroz-con-crema-y-champinones', 'queso-rallado', 10),
  ('fideos-de-arroz-con-cuatro-quesos', 'fideos-arroz', 75),
  ('fideos-de-arroz-con-cuatro-quesos', 'queso-cremoso', 40),
  ('fideos-de-arroz-con-cuatro-quesos', 'muzzarella', 20),
  ('fideos-de-arroz-con-cuatro-quesos', 'queso-azul', 15),
  ('fideos-de-arroz-con-cuatro-quesos', 'queso-rallado', 10),
  ('fideos-de-arroz-con-cuatro-quesos', 'leche', 60),
  ('espaguetis-con-bolonesa-casera', 'fideos', 85),
  ('espaguetis-con-bolonesa-casera', 'carne-picada-cruda', 85),
  ('espaguetis-con-bolonesa-casera', 'tomate-triturado', 120),
  ('espaguetis-con-bolonesa-casera', 'cebolla', 0.5),
  ('espaguetis-con-bolonesa-casera', 'zanahoria', 0.5),
  ('espaguetis-con-bolonesa-casera', 'ajo', 1),
  ('espaguetis-con-bolonesa-casera', 'aceite', 6),
  ('ravioles-con-tuco', 'ravioles', 160),
  ('ravioles-con-tuco', 'tomate-triturado', 130),
  ('ravioles-con-tuco', 'cebolla', 0.5),
  ('ravioles-con-tuco', 'morron', 0.5),
  ('ravioles-con-tuco', 'ajo', 1),
  ('ravioles-con-tuco', 'aceite', 8),
  ('espaguetis-con-pollo-y-verduras-salteadas', 'fideos', 85),
  ('espaguetis-con-pollo-y-verduras-salteadas', 'pechuga-cruda', 110),
  ('espaguetis-con-pollo-y-verduras-salteadas', 'zanahoria', 0.5),
  ('espaguetis-con-pollo-y-verduras-salteadas', 'zapallito', 0.5),
  ('espaguetis-con-pollo-y-verduras-salteadas', 'morron', 0.5),
  ('espaguetis-con-pollo-y-verduras-salteadas', 'aceite', 8),
  ('espaguetis-con-pollo-y-verduras-salteadas', 'salsa-soja', 8),
  ('fideos-con-zapallitos-y-ricota', 'fideos', 85),
  ('fideos-con-zapallitos-y-ricota', 'zapallito', 1),
  ('fideos-con-zapallitos-y-ricota', 'ricota', 60),
  ('fideos-con-zapallitos-y-ricota', 'ajo', 0.5),
  ('fideos-con-zapallitos-y-ricota', 'aceite', 8),
  ('fideos-con-zapallitos-y-ricota', 'albahaca', 3),
  ('fideos-con-zapallitos-y-ricota', 'queso-rallado', 8),
  ('fideos-integrales-con-champinones-y-espinaca', 'fideos-integrales', 85),
  ('fideos-integrales-con-champinones-y-espinaca', 'champinones', 100),
  ('fideos-integrales-con-champinones-y-espinaca', 'espinaca', 60),
  ('fideos-integrales-con-champinones-y-espinaca', 'ajo', 0.5),
  ('fideos-integrales-con-champinones-y-espinaca', 'aceite', 8),
  ('fideos-integrales-con-champinones-y-espinaca', 'crema-light', 30),
  ('fideos-de-arroz-con-pollo-y-brocoli', 'fideos-arroz', 75),
  ('fideos-de-arroz-con-pollo-y-brocoli', 'pechuga-cruda', 120),
  ('fideos-de-arroz-con-pollo-y-brocoli', 'brocoli', 100),
  ('fideos-de-arroz-con-pollo-y-brocoli', 'ajo', 1),
  ('fideos-de-arroz-con-pollo-y-brocoli', 'aceite', 8),
  ('fideos-de-arroz-con-pollo-y-brocoli', 'queso-rallado', 10),
  ('fideos-integrales-con-mejillones-y-tomate', 'fideos-integrales', 85),
  ('fideos-integrales-con-mejillones-y-tomate', 'mejillones', 120),
  ('fideos-integrales-con-mejillones-y-tomate', 'tomate-triturado', 100),
  ('fideos-integrales-con-mejillones-y-tomate', 'ajo', 1),
  ('fideos-integrales-con-mejillones-y-tomate', 'aceite', 8),
  ('fideos-integrales-con-mejillones-y-tomate', 'perejil', 3),
  ('espaguetis-con-salsa-fileto', 'fideos', 85),
  ('espaguetis-con-salsa-fileto', 'tomate-triturado', 130),
  ('espaguetis-con-salsa-fileto', 'cebolla', 0.5),
  ('espaguetis-con-salsa-fileto', 'ajo', 1),
  ('espaguetis-con-salsa-fileto', 'aceite', 8),
  ('espaguetis-con-salsa-fileto', 'albahaca', 4),
  ('sorrentinos-con-salsa-de-calabaza', 'sorrentinos', 160),
  ('sorrentinos-con-salsa-de-calabaza', 'calabaza', 150),
  ('sorrentinos-con-salsa-de-calabaza', 'cebolla', 0.5),
  ('sorrentinos-con-salsa-de-calabaza', 'ajo', 0.5),
  ('sorrentinos-con-salsa-de-calabaza', 'aceite', 6),
  ('sorrentinos-con-salsa-de-calabaza', 'queso-rallado', 10),
  ('fideos-con-salsa-fileto', 'fideos', 85),
  ('fideos-con-salsa-fileto', 'tomate-triturado', 130),
  ('fideos-con-salsa-fileto', 'cebolla', 0.5),
  ('fideos-con-salsa-fileto', 'ajo', 1),
  ('fideos-con-salsa-fileto', 'aceite', 8),
  ('fideos-con-salsa-fileto', 'albahaca', 4),
  ('tallarines-con-atun-y-tomate', 'fideos-frescos', 125),
  ('tallarines-con-atun-y-tomate', 'atun-natural', 1),
  ('tallarines-con-atun-y-tomate', 'tomate-triturado', 100),
  ('tallarines-con-atun-y-tomate', 'cebolla', 0.5),
  ('tallarines-con-atun-y-tomate', 'aceitunas', 15),
  ('tallarines-con-atun-y-tomate', 'aceite', 6),
  ('tallarines-con-atun-y-tomate', 'perejil', 3),
  ('fideos-de-arroz-con-morrones-asados-y-ricota', 'fideos-arroz', 75),
  ('fideos-de-arroz-con-morrones-asados-y-ricota', 'morron', 1),
  ('fideos-de-arroz-con-morrones-asados-y-ricota', 'ricota', 60),
  ('fideos-de-arroz-con-morrones-asados-y-ricota', 'aceite', 6),
  ('fideos-de-arroz-con-morrones-asados-y-ricota', 'ajo', 0.5),
  ('ravioles-con-ajo-y-aceite', 'ravioles', 160),
  ('ravioles-con-ajo-y-aceite', 'aceite-oliva', 10),
  ('ravioles-con-ajo-y-aceite', 'ajo', 2),
  ('ravioles-con-ajo-y-aceite', 'perejil', 5),
  ('ravioles-con-ajo-y-aceite', 'queso-rallado', 10),
  ('tallarines-con-tomates-asados-y-albahaca', 'fideos-frescos', 125),
  ('tallarines-con-tomates-asados-y-albahaca', 'tomate-cherry', 200),
  ('tallarines-con-tomates-asados-y-albahaca', 'ajo', 1),
  ('tallarines-con-tomates-asados-y-albahaca', 'aceite-oliva', 10),
  ('tallarines-con-tomates-asados-y-albahaca', 'albahaca', 5),
  ('tallarines-con-tomates-asados-y-albahaca', 'queso-rallado', 10),
  ('fideos-integrales-con-ajo-y-aceite', 'fideos-integrales', 85),
  ('fideos-integrales-con-ajo-y-aceite', 'aceite-oliva', 10),
  ('fideos-integrales-con-ajo-y-aceite', 'ajo', 2),
  ('fideos-integrales-con-ajo-y-aceite', 'perejil', 5),
  ('fideos-integrales-con-ajo-y-aceite', 'queso-rallado', 10),
  ('fideos-integrales-con-carbonara-liviana', 'fideos-integrales', 85),
  ('fideos-integrales-con-carbonara-liviana', 'huevo', 2),
  ('fideos-integrales-con-carbonara-liviana', 'panceta', 30),
  ('fideos-integrales-con-carbonara-liviana', 'queso-rallado', 20),
  ('fideos-de-arroz-con-salmon-y-crema', 'fideos-arroz', 75),
  ('fideos-de-arroz-con-salmon-y-crema', 'salmon', 110),
  ('fideos-de-arroz-con-salmon-y-crema', 'crema', 40),
  ('fideos-de-arroz-con-salmon-y-crema', 'cebolla-verdeo', 15),
  ('fideos-de-arroz-con-salmon-y-crema', 'aceite', 5),
  ('fideos-de-arroz-con-salmon-y-crema', 'limon-exprimido', 8),
  ('fideos-con-rucula-cherry-y-parmesano', 'fideos', 85),
  ('fideos-con-rucula-cherry-y-parmesano', 'rucula', 40),
  ('fideos-con-rucula-cherry-y-parmesano', 'tomate-cherry', 120),
  ('fideos-con-rucula-cherry-y-parmesano', 'aceite-oliva', 10),
  ('fideos-con-rucula-cherry-y-parmesano', 'parmesano', 15),
  ('fideos-con-rucula-cherry-y-parmesano', 'ajo', 0.5),
  ('tallarines-con-salsa-blanca-y-jamon', 'fideos-frescos', 125),
  ('tallarines-con-salsa-blanca-y-jamon', 'salsa-blanca', 90),
  ('tallarines-con-salsa-blanca-y-jamon', 'jamon-cocido', 50),
  ('tallarines-con-salsa-blanca-y-jamon', 'queso-rallado', 10),
  ('fideos-con-atun-y-tomate', 'fideos', 85),
  ('fideos-con-atun-y-tomate', 'atun-natural', 1),
  ('fideos-con-atun-y-tomate', 'tomate-triturado', 100),
  ('fideos-con-atun-y-tomate', 'cebolla', 0.5),
  ('fideos-con-atun-y-tomate', 'aceitunas', 15),
  ('fideos-con-atun-y-tomate', 'aceite', 6),
  ('fideos-con-atun-y-tomate', 'perejil', 3),
  ('fideos-con-garbanzos-y-espinaca', 'fideos', 85),
  ('fideos-con-garbanzos-y-espinaca', 'garbanzos-hervidos', 100),
  ('fideos-con-garbanzos-y-espinaca', 'espinaca', 60),
  ('fideos-con-garbanzos-y-espinaca', 'ajo', 0.5),
  ('fideos-con-garbanzos-y-espinaca', 'tomate-triturado', 60),
  ('fideos-con-garbanzos-y-espinaca', 'aceite', 8),
  ('fideos-con-tuco', 'fideos', 85),
  ('fideos-con-tuco', 'tomate-triturado', 130),
  ('fideos-con-tuco', 'cebolla', 0.5),
  ('fideos-con-tuco', 'morron', 0.5),
  ('fideos-con-tuco', 'ajo', 1),
  ('fideos-con-tuco', 'aceite', 8),
  ('espaguetis-con-verduras-asadas', 'fideos', 85),
  ('espaguetis-con-verduras-asadas', 'berenjena', 0.5),
  ('espaguetis-con-verduras-asadas', 'morron', 0.5),
  ('espaguetis-con-verduras-asadas', 'zapallito', 0.5),
  ('espaguetis-con-verduras-asadas', 'cebolla', 0.5),
  ('espaguetis-con-verduras-asadas', 'aceite', 10),
  ('espaguetis-con-verduras-asadas', 'albahaca', 3),
  ('espaguetis-con-verduras-asadas', 'ajo', 0.5),
  ('ravioles-con-rucula-cherry-y-parmesano', 'ravioles', 160),
  ('ravioles-con-rucula-cherry-y-parmesano', 'rucula', 40),
  ('ravioles-con-rucula-cherry-y-parmesano', 'tomate-cherry', 120),
  ('ravioles-con-rucula-cherry-y-parmesano', 'aceite-oliva', 10),
  ('ravioles-con-rucula-cherry-y-parmesano', 'parmesano', 15),
  ('ravioles-con-rucula-cherry-y-parmesano', 'ajo', 0.5),
  ('tallarines-con-bolonesa-casera', 'fideos-frescos', 125),
  ('tallarines-con-bolonesa-casera', 'carne-picada-cruda', 85),
  ('tallarines-con-bolonesa-casera', 'tomate-triturado', 120),
  ('tallarines-con-bolonesa-casera', 'cebolla', 0.5),
  ('tallarines-con-bolonesa-casera', 'zanahoria', 0.5),
  ('tallarines-con-bolonesa-casera', 'ajo', 1),
  ('tallarines-con-bolonesa-casera', 'aceite', 6),
  ('fideos-de-arroz-con-salsa-blanca-y-jamon', 'fideos-arroz', 75),
  ('fideos-de-arroz-con-salsa-blanca-y-jamon', 'salsa-blanca', 90),
  ('fideos-de-arroz-con-salsa-blanca-y-jamon', 'jamon-cocido', 50),
  ('fideos-de-arroz-con-salsa-blanca-y-jamon', 'queso-rallado', 10),
  ('tallarines-con-salsa-de-calabaza', 'fideos-frescos', 125),
  ('tallarines-con-salsa-de-calabaza', 'calabaza', 150),
  ('tallarines-con-salsa-de-calabaza', 'cebolla', 0.5),
  ('tallarines-con-salsa-de-calabaza', 'ajo', 0.5),
  ('tallarines-con-salsa-de-calabaza', 'aceite', 6),
  ('tallarines-con-salsa-de-calabaza', 'queso-rallado', 10),
  ('fideos-integrales-con-albondigas', 'fideos-integrales', 85),
  ('fideos-integrales-con-albondigas', 'carne-picada-cruda', 100),
  ('fideos-integrales-con-albondigas', 'pan-rallado', 15),
  ('fideos-integrales-con-albondigas', 'tomate-triturado', 120),
  ('fideos-integrales-con-albondigas', 'cebolla', 0.5),
  ('fideos-integrales-con-albondigas', 'ajo', 1),
  ('fideos-integrales-con-albondigas', 'aceite', 6),
  ('fideos-integrales-con-albondigas', 'perejil', 3),
  ('fideos-integrales-con-albondigas', 'huevo', 0.5),
  ('fideos-integrales-con-atun-y-tomate', 'fideos-integrales', 85),
  ('fideos-integrales-con-atun-y-tomate', 'atun-natural', 1),
  ('fideos-integrales-con-atun-y-tomate', 'tomate-triturado', 100),
  ('fideos-integrales-con-atun-y-tomate', 'cebolla', 0.5),
  ('fideos-integrales-con-atun-y-tomate', 'aceitunas', 15),
  ('fideos-integrales-con-atun-y-tomate', 'aceite', 6),
  ('fideos-integrales-con-atun-y-tomate', 'perejil', 3),
  ('tallarines-con-tuco', 'fideos-frescos', 125),
  ('tallarines-con-tuco', 'tomate-triturado', 130),
  ('tallarines-con-tuco', 'cebolla', 0.5),
  ('tallarines-con-tuco', 'morron', 0.5),
  ('tallarines-con-tuco', 'ajo', 1),
  ('tallarines-con-tuco', 'aceite', 8),
  ('fideos-integrales-con-garbanzos-y-espinaca', 'fideos-integrales', 85),
  ('fideos-integrales-con-garbanzos-y-espinaca', 'garbanzos-hervidos', 100),
  ('fideos-integrales-con-garbanzos-y-espinaca', 'espinaca', 60),
  ('fideos-integrales-con-garbanzos-y-espinaca', 'ajo', 0.5),
  ('fideos-integrales-con-garbanzos-y-espinaca', 'tomate-triturado', 60),
  ('fideos-integrales-con-garbanzos-y-espinaca', 'aceite', 8),
  ('espaguetis-con-salsa-blanca-y-jamon', 'fideos', 85),
  ('espaguetis-con-salsa-blanca-y-jamon', 'salsa-blanca', 90),
  ('espaguetis-con-salsa-blanca-y-jamon', 'jamon-cocido', 50),
  ('espaguetis-con-salsa-blanca-y-jamon', 'queso-rallado', 10),
  ('tallarines-con-pollo-y-verduras-salteadas', 'fideos-frescos', 125),
  ('tallarines-con-pollo-y-verduras-salteadas', 'pechuga-cruda', 110),
  ('tallarines-con-pollo-y-verduras-salteadas', 'zanahoria', 0.5),
  ('tallarines-con-pollo-y-verduras-salteadas', 'zapallito', 0.5),
  ('tallarines-con-pollo-y-verduras-salteadas', 'morron', 0.5),
  ('tallarines-con-pollo-y-verduras-salteadas', 'aceite', 8),
  ('tallarines-con-pollo-y-verduras-salteadas', 'salsa-soja', 8),
  ('fideos-de-arroz-con-calamares-al-ajillo', 'fideos-arroz', 75),
  ('fideos-de-arroz-con-calamares-al-ajillo', 'calamar', 130),
  ('fideos-de-arroz-con-calamares-al-ajillo', 'tomate-triturado', 80),
  ('fideos-de-arroz-con-calamares-al-ajillo', 'ajo', 1),
  ('fideos-de-arroz-con-calamares-al-ajillo', 'aceite', 8),
  ('fideos-de-arroz-con-calamares-al-ajillo', 'perejil', 3),
  ('espaguetis-con-zucchini-y-limon', 'fideos', 85),
  ('espaguetis-con-zucchini-y-limon', 'zapallito', 1),
  ('espaguetis-con-zucchini-y-limon', 'limon-exprimido', 15),
  ('espaguetis-con-zucchini-y-limon', 'aceite-oliva', 10),
  ('espaguetis-con-zucchini-y-limon', 'ajo', 0.5),
  ('espaguetis-con-zucchini-y-limon', 'parmesano', 15),
  ('agnolotis-con-ajo-y-aceite', 'agnolotis', 160),
  ('agnolotis-con-ajo-y-aceite', 'aceite-oliva', 10),
  ('agnolotis-con-ajo-y-aceite', 'ajo', 2),
  ('agnolotis-con-ajo-y-aceite', 'perejil', 5),
  ('agnolotis-con-ajo-y-aceite', 'queso-rallado', 10),
  ('tallarines-con-salmon-y-crema', 'fideos-frescos', 125),
  ('tallarines-con-salmon-y-crema', 'salmon', 110),
  ('tallarines-con-salmon-y-crema', 'crema', 40),
  ('tallarines-con-salmon-y-crema', 'cebolla-verdeo', 15),
  ('tallarines-con-salmon-y-crema', 'aceite', 5),
  ('tallarines-con-salmon-y-crema', 'limon-exprimido', 8),
  ('noquis-con-jamon-y-arvejas', 'noquis', 210),
  ('noquis-con-jamon-y-arvejas', 'jamon-cocido', 60),
  ('noquis-con-jamon-y-arvejas', 'arvejas-frescas', 60),
  ('noquis-con-jamon-y-arvejas', 'crema', 40),
  ('noquis-con-jamon-y-arvejas', 'cebolla', 0.5),
  ('noquis-con-jamon-y-arvejas', 'aceite', 5),
  ('fideos-de-arroz-con-atun-y-tomate', 'fideos-arroz', 75),
  ('fideos-de-arroz-con-atun-y-tomate', 'atun-natural', 1),
  ('fideos-de-arroz-con-atun-y-tomate', 'tomate-triturado', 100),
  ('fideos-de-arroz-con-atun-y-tomate', 'cebolla', 0.5),
  ('fideos-de-arroz-con-atun-y-tomate', 'aceitunas', 15),
  ('fideos-de-arroz-con-atun-y-tomate', 'aceite', 6),
  ('fideos-de-arroz-con-atun-y-tomate', 'perejil', 3),
  ('sorrentinos-con-tuco', 'sorrentinos', 160),
  ('sorrentinos-con-tuco', 'tomate-triturado', 130),
  ('sorrentinos-con-tuco', 'cebolla', 0.5),
  ('sorrentinos-con-tuco', 'morron', 0.5),
  ('sorrentinos-con-tuco', 'ajo', 1),
  ('sorrentinos-con-tuco', 'aceite', 8),
  ('sorrentinos-con-salsa-blanca-y-jamon', 'sorrentinos', 160),
  ('sorrentinos-con-salsa-blanca-y-jamon', 'salsa-blanca', 90),
  ('sorrentinos-con-salsa-blanca-y-jamon', 'jamon-cocido', 50),
  ('sorrentinos-con-salsa-blanca-y-jamon', 'queso-rallado', 10),
  ('fideos-integrales-con-atun-limon-y-rucula', 'fideos-integrales', 85),
  ('fideos-integrales-con-atun-limon-y-rucula', 'atun-natural', 1),
  ('fideos-integrales-con-atun-limon-y-rucula', 'limon-exprimido', 10),
  ('fideos-integrales-con-atun-limon-y-rucula', 'rucula', 40),
  ('fideos-integrales-con-atun-limon-y-rucula', 'aceite-oliva', 10),
  ('fideos-integrales-con-atun-limon-y-rucula', 'alcaparras', 5),
  ('fideos-de-arroz-con-atun-limon-y-rucula', 'fideos-arroz', 75),
  ('fideos-de-arroz-con-atun-limon-y-rucula', 'atun-natural', 1),
  ('fideos-de-arroz-con-atun-limon-y-rucula', 'limon-exprimido', 10),
  ('fideos-de-arroz-con-atun-limon-y-rucula', 'rucula', 40),
  ('fideos-de-arroz-con-atun-limon-y-rucula', 'aceite-oliva', 10),
  ('fideos-de-arroz-con-atun-limon-y-rucula', 'alcaparras', 5),
  ('espaguetis-con-espinaca-y-ricota', 'fideos', 85),
  ('espaguetis-con-espinaca-y-ricota', 'espinaca', 120),
  ('espaguetis-con-espinaca-y-ricota', 'ricota', 70),
  ('espaguetis-con-espinaca-y-ricota', 'ajo', 0.5),
  ('espaguetis-con-espinaca-y-ricota', 'aceite', 6),
  ('espaguetis-con-espinaca-y-ricota', 'queso-rallado', 10),
  ('agnolotis-con-salsa-fileto', 'agnolotis', 160),
  ('agnolotis-con-salsa-fileto', 'tomate-triturado', 130),
  ('agnolotis-con-salsa-fileto', 'cebolla', 0.5),
  ('agnolotis-con-salsa-fileto', 'ajo', 1),
  ('agnolotis-con-salsa-fileto', 'aceite', 8),
  ('agnolotis-con-salsa-fileto', 'albahaca', 4),
  ('fideos-integrales-con-cuatro-quesos', 'fideos-integrales', 85),
  ('fideos-integrales-con-cuatro-quesos', 'queso-cremoso', 40),
  ('fideos-integrales-con-cuatro-quesos', 'muzzarella', 20),
  ('fideos-integrales-con-cuatro-quesos', 'queso-azul', 15),
  ('fideos-integrales-con-cuatro-quesos', 'queso-rallado', 10),
  ('fideos-integrales-con-cuatro-quesos', 'leche', 60),
  ('fideos-de-arroz-con-zucchini-y-limon', 'fideos-arroz', 75),
  ('fideos-de-arroz-con-zucchini-y-limon', 'zapallito', 1),
  ('fideos-de-arroz-con-zucchini-y-limon', 'limon-exprimido', 15),
  ('fideos-de-arroz-con-zucchini-y-limon', 'aceite-oliva', 10),
  ('fideos-de-arroz-con-zucchini-y-limon', 'ajo', 0.5),
  ('fideos-de-arroz-con-zucchini-y-limon', 'parmesano', 15),
  ('fideos-con-mejillones-y-tomate', 'fideos', 85),
  ('fideos-con-mejillones-y-tomate', 'mejillones', 120),
  ('fideos-con-mejillones-y-tomate', 'tomate-triturado', 100),
  ('fideos-con-mejillones-y-tomate', 'ajo', 1),
  ('fideos-con-mejillones-y-tomate', 'aceite', 8),
  ('fideos-con-mejillones-y-tomate', 'perejil', 3),
  ('espaguetis-con-pesto-y-tomates-cherry', 'fideos', 85),
  ('espaguetis-con-pesto-y-tomates-cherry', 'pesto', 35),
  ('espaguetis-con-pesto-y-tomates-cherry', 'tomate-cherry', 80),
  ('espaguetis-con-pesto-y-tomates-cherry', 'queso-rallado', 10),
  ('tallarines-con-brocoli-y-ajo', 'fideos-frescos', 125),
  ('tallarines-con-brocoli-y-ajo', 'brocoli', 130),
  ('tallarines-con-brocoli-y-ajo', 'ajo', 1.5),
  ('tallarines-con-brocoli-y-ajo', 'aceite-oliva', 10),
  ('tallarines-con-brocoli-y-ajo', 'queso-rallado', 10),
  ('espaguetis-con-carbonara-liviana', 'fideos', 85),
  ('espaguetis-con-carbonara-liviana', 'huevo', 2),
  ('espaguetis-con-carbonara-liviana', 'panceta', 30),
  ('espaguetis-con-carbonara-liviana', 'queso-rallado', 20),
  ('fideos-con-salsa-blanca-y-jamon', 'fideos', 85),
  ('fideos-con-salsa-blanca-y-jamon', 'salsa-blanca', 90),
  ('fideos-con-salsa-blanca-y-jamon', 'jamon-cocido', 50),
  ('fideos-con-salsa-blanca-y-jamon', 'queso-rallado', 10),
  ('fideos-de-arroz-con-bolonesa-casera', 'fideos-arroz', 75),
  ('fideos-de-arroz-con-bolonesa-casera', 'carne-picada-cruda', 85),
  ('fideos-de-arroz-con-bolonesa-casera', 'tomate-triturado', 120),
  ('fideos-de-arroz-con-bolonesa-casera', 'cebolla', 0.5),
  ('fideos-de-arroz-con-bolonesa-casera', 'zanahoria', 0.5),
  ('fideos-de-arroz-con-bolonesa-casera', 'ajo', 1),
  ('fideos-de-arroz-con-bolonesa-casera', 'aceite', 6),
  ('sorrentinos-con-crema-y-champinones', 'sorrentinos', 160),
  ('sorrentinos-con-crema-y-champinones', 'champinones', 110),
  ('sorrentinos-con-crema-y-champinones', 'crema', 40),
  ('sorrentinos-con-crema-y-champinones', 'cebolla', 0.5),
  ('sorrentinos-con-crema-y-champinones', 'ajo', 0.5),
  ('sorrentinos-con-crema-y-champinones', 'aceite', 5),
  ('sorrentinos-con-crema-y-champinones', 'queso-rallado', 10),
  ('tallarines-con-morrones-asados-y-ricota', 'fideos-frescos', 125),
  ('tallarines-con-morrones-asados-y-ricota', 'morron', 1),
  ('tallarines-con-morrones-asados-y-ricota', 'ricota', 60),
  ('tallarines-con-morrones-asados-y-ricota', 'aceite', 6),
  ('tallarines-con-morrones-asados-y-ricota', 'ajo', 0.5),
  ('sorrentinos-con-pesto-y-tomates-cherry', 'sorrentinos', 160),
  ('sorrentinos-con-pesto-y-tomates-cherry', 'pesto', 35),
  ('sorrentinos-con-pesto-y-tomates-cherry', 'tomate-cherry', 80),
  ('sorrentinos-con-pesto-y-tomates-cherry', 'queso-rallado', 10),
  ('espaguetis-con-pollo-y-brocoli', 'fideos', 85),
  ('espaguetis-con-pollo-y-brocoli', 'pechuga-cruda', 120),
  ('espaguetis-con-pollo-y-brocoli', 'brocoli', 100),
  ('espaguetis-con-pollo-y-brocoli', 'ajo', 1),
  ('espaguetis-con-pollo-y-brocoli', 'aceite', 8),
  ('espaguetis-con-pollo-y-brocoli', 'queso-rallado', 10),
  ('espaguetis-con-atun-limon-y-rucula', 'fideos', 85),
  ('espaguetis-con-atun-limon-y-rucula', 'atun-natural', 1),
  ('espaguetis-con-atun-limon-y-rucula', 'limon-exprimido', 10),
  ('espaguetis-con-atun-limon-y-rucula', 'rucula', 40),
  ('espaguetis-con-atun-limon-y-rucula', 'aceite-oliva', 10),
  ('espaguetis-con-atun-limon-y-rucula', 'alcaparras', 5),
  ('fideos-integrales-con-morrones-asados-y-ricota', 'fideos-integrales', 85),
  ('fideos-integrales-con-morrones-asados-y-ricota', 'morron', 1),
  ('fideos-integrales-con-morrones-asados-y-ricota', 'ricota', 60),
  ('fideos-integrales-con-morrones-asados-y-ricota', 'aceite', 6),
  ('fideos-integrales-con-morrones-asados-y-ricota', 'ajo', 0.5),
  ('fideos-con-champinones-y-espinaca', 'fideos', 85),
  ('fideos-con-champinones-y-espinaca', 'champinones', 100),
  ('fideos-con-champinones-y-espinaca', 'espinaca', 60),
  ('fideos-con-champinones-y-espinaca', 'ajo', 0.5),
  ('fideos-con-champinones-y-espinaca', 'aceite', 8),
  ('fideos-con-champinones-y-espinaca', 'crema-light', 30),
  ('espaguetis-con-calamares-al-ajillo', 'fideos', 85),
  ('espaguetis-con-calamares-al-ajillo', 'calamar', 130),
  ('espaguetis-con-calamares-al-ajillo', 'tomate-triturado', 80),
  ('espaguetis-con-calamares-al-ajillo', 'ajo', 1),
  ('espaguetis-con-calamares-al-ajillo', 'aceite', 8),
  ('espaguetis-con-calamares-al-ajillo', 'perejil', 3),
  ('fideos-con-jamon-y-arvejas', 'fideos', 85),
  ('fideos-con-jamon-y-arvejas', 'jamon-cocido', 60),
  ('fideos-con-jamon-y-arvejas', 'arvejas-frescas', 60),
  ('fideos-con-jamon-y-arvejas', 'crema', 40),
  ('fideos-con-jamon-y-arvejas', 'cebolla', 0.5),
  ('fideos-con-jamon-y-arvejas', 'aceite', 5),
  ('espaguetis-con-cuatro-quesos', 'fideos', 85),
  ('espaguetis-con-cuatro-quesos', 'queso-cremoso', 40),
  ('espaguetis-con-cuatro-quesos', 'muzzarella', 20),
  ('espaguetis-con-cuatro-quesos', 'queso-azul', 15),
  ('espaguetis-con-cuatro-quesos', 'queso-rallado', 10),
  ('espaguetis-con-cuatro-quesos', 'leche', 60),
  ('tallarines-con-zapallitos-y-ricota', 'fideos-frescos', 125),
  ('tallarines-con-zapallitos-y-ricota', 'zapallito', 1),
  ('tallarines-con-zapallitos-y-ricota', 'ricota', 60),
  ('tallarines-con-zapallitos-y-ricota', 'ajo', 0.5),
  ('tallarines-con-zapallitos-y-ricota', 'aceite', 8),
  ('tallarines-con-zapallitos-y-ricota', 'albahaca', 3),
  ('tallarines-con-zapallitos-y-ricota', 'queso-rallado', 8),
  ('tallarines-con-carbonara-liviana', 'fideos-frescos', 125),
  ('tallarines-con-carbonara-liviana', 'huevo', 2),
  ('tallarines-con-carbonara-liviana', 'panceta', 30),
  ('tallarines-con-carbonara-liviana', 'queso-rallado', 20),
  ('noquis-con-tomates-asados-y-albahaca', 'noquis', 210),
  ('noquis-con-tomates-asados-y-albahaca', 'tomate-cherry', 200),
  ('noquis-con-tomates-asados-y-albahaca', 'ajo', 1),
  ('noquis-con-tomates-asados-y-albahaca', 'aceite-oliva', 10),
  ('noquis-con-tomates-asados-y-albahaca', 'albahaca', 5),
  ('noquis-con-tomates-asados-y-albahaca', 'queso-rallado', 10),
  ('fideos-de-arroz-con-bolonesa-de-lentejas', 'fideos-arroz', 75),
  ('fideos-de-arroz-con-bolonesa-de-lentejas', 'lentejas-hervidas', 90),
  ('fideos-de-arroz-con-bolonesa-de-lentejas', 'tomate-triturado', 120),
  ('fideos-de-arroz-con-bolonesa-de-lentejas', 'zanahoria', 0.5),
  ('fideos-de-arroz-con-bolonesa-de-lentejas', 'cebolla', 0.5),
  ('fideos-de-arroz-con-bolonesa-de-lentejas', 'ajo', 1),
  ('fideos-de-arroz-con-bolonesa-de-lentejas', 'aceite', 6),
  ('espaguetis-con-morrones-asados-y-ricota', 'fideos', 85),
  ('espaguetis-con-morrones-asados-y-ricota', 'morron', 1),
  ('espaguetis-con-morrones-asados-y-ricota', 'ricota', 60),
  ('espaguetis-con-morrones-asados-y-ricota', 'aceite', 6),
  ('espaguetis-con-morrones-asados-y-ricota', 'ajo', 0.5),
  ('fideos-de-arroz-con-rucula-cherry-y-parmesano', 'fideos-arroz', 75),
  ('fideos-de-arroz-con-rucula-cherry-y-parmesano', 'rucula', 40),
  ('fideos-de-arroz-con-rucula-cherry-y-parmesano', 'tomate-cherry', 120),
  ('fideos-de-arroz-con-rucula-cherry-y-parmesano', 'aceite-oliva', 10),
  ('fideos-de-arroz-con-rucula-cherry-y-parmesano', 'parmesano', 15),
  ('fideos-de-arroz-con-rucula-cherry-y-parmesano', 'ajo', 0.5),
  ('omelette-de-espinaca-y-queso', 'huevo', 3),
  ('omelette-de-espinaca-y-queso', 'espinaca', 90),
  ('omelette-de-espinaca-y-queso', 'queso-cremoso', 40),
  ('omelette-de-espinaca-y-queso', 'aceite', 7),
  ('frittata-de-espinaca-y-queso-al-horno', 'huevo', 6),
  ('frittata-de-espinaca-y-queso-al-horno', 'espinaca', 180),
  ('frittata-de-espinaca-y-queso-al-horno', 'queso-cremoso', 80),
  ('frittata-de-espinaca-y-queso-al-horno', 'aceite', 15),
  ('frittata-de-espinaca-y-queso-al-horno', 'queso-rallado', 20),
  ('tarta-de-pollo-y-puerro', 'huevo', 3),
  ('tarta-de-pollo-y-puerro', 'pollo-desmenuzado', 360),
  ('tarta-de-pollo-y-puerro', 'puerro', 320),
  ('tarta-de-pollo-y-puerro', 'aceite', 20),
  ('tarta-de-pollo-y-puerro', 'tapa-tarta', 1),
  ('tarta-de-pollo-y-puerro', 'leche', 160),
  ('tarta-de-pollo-y-puerro', 'queso-rallado', 30),
  ('omelette-de-cebolla-y-queso-azul', 'huevo', 3),
  ('omelette-de-cebolla-y-queso-azul', 'cebolla', 1),
  ('omelette-de-cebolla-y-queso-azul', 'queso-azul', 25),
  ('omelette-de-cebolla-y-queso-azul', 'aceite', 9),
  ('frittata-de-panceta-y-queso-al-horno', 'huevo', 6),
  ('frittata-de-panceta-y-queso-al-horno', 'panceta', 60),
  ('frittata-de-panceta-y-queso-al-horno', 'queso-cremoso', 80),
  ('frittata-de-panceta-y-queso-al-horno', 'cebolla', 0.5),
  ('frittata-de-panceta-y-queso-al-horno', 'queso-rallado', 20),
  ('frittata-de-panceta-y-queso-al-horno', 'aceite', 6),
  ('tarta-de-jamon-crudo-y-rucula', 'huevo', 3),
  ('tarta-de-jamon-crudo-y-rucula', 'jamon-crudo', 160),
  ('tarta-de-jamon-crudo-y-rucula', 'rucula', 120),
  ('tarta-de-jamon-crudo-y-rucula', 'queso-cremoso', 120),
  ('tarta-de-jamon-crudo-y-rucula', 'tapa-tarta', 1),
  ('tarta-de-jamon-crudo-y-rucula', 'leche', 160),
  ('tarta-de-jamon-crudo-y-rucula', 'queso-rallado', 30),
  ('omelette-de-morron-y-cebolla', 'huevo', 3),
  ('omelette-de-morron-y-cebolla', 'morron', 0.5),
  ('omelette-de-morron-y-cebolla', 'cebolla', 0.5),
  ('omelette-de-morron-y-cebolla', 'aceite', 9),
  ('tortilla-de-palmitos-y-queso', 'huevo', 3),
  ('tortilla-de-palmitos-y-queso', 'palmitos', 100),
  ('tortilla-de-palmitos-y-queso', 'queso-cremoso', 40),
  ('tortilla-de-palmitos-y-queso', 'cebolla-verdeo', 15),
  ('tortilla-de-palmitos-y-queso', 'aceite', 3),
  ('tarta-de-tomate-y-albahaca', 'huevo', 3),
  ('tarta-de-tomate-y-albahaca', 'tomate', 5),
  ('tarta-de-tomate-y-albahaca', 'albahaca', 20),
  ('tarta-de-tomate-y-albahaca', 'muzzarella', 160),
  ('tarta-de-tomate-y-albahaca', 'tapa-tarta', 1),
  ('tarta-de-tomate-y-albahaca', 'leche', 160),
  ('tarta-de-tomate-y-albahaca', 'queso-rallado', 30),
  ('frittata-de-tomate-y-albahaca-al-horno', 'huevo', 6),
  ('frittata-de-tomate-y-albahaca-al-horno', 'tomate', 2.5),
  ('frittata-de-tomate-y-albahaca-al-horno', 'albahaca', 10),
  ('frittata-de-tomate-y-albahaca-al-horno', 'muzzarella', 80),
  ('frittata-de-tomate-y-albahaca-al-horno', 'queso-rallado', 20),
  ('frittata-de-tomate-y-albahaca-al-horno', 'aceite', 6),
  ('tarta-de-verduras-asadas', 'huevo', 3),
  ('tarta-de-verduras-asadas', 'berenjena', 1),
  ('tarta-de-verduras-asadas', 'morron', 1.5),
  ('tarta-de-verduras-asadas', 'zapallito', 2),
  ('tarta-de-verduras-asadas', 'cebolla', 1),
  ('tarta-de-verduras-asadas', 'aceite', 30),
  ('tarta-de-verduras-asadas', 'tapa-tarta', 1),
  ('tarta-de-verduras-asadas', 'leche', 160),
  ('tarta-de-verduras-asadas', 'queso-rallado', 30),
  ('tortilla-de-jamon-crudo-y-rucula', 'huevo', 3),
  ('tortilla-de-jamon-crudo-y-rucula', 'jamon-crudo', 40),
  ('tortilla-de-jamon-crudo-y-rucula', 'rucula', 30),
  ('tortilla-de-jamon-crudo-y-rucula', 'queso-cremoso', 30),
  ('tortilla-de-jamon-crudo-y-rucula', 'aceite', 3),
  ('revuelto-de-cebolla-y-queso-azul', 'huevo', 3),
  ('revuelto-de-cebolla-y-queso-azul', 'cebolla', 1),
  ('revuelto-de-cebolla-y-queso-azul', 'queso-azul', 25),
  ('revuelto-de-cebolla-y-queso-azul', 'aceite', 9),
  ('revuelto-de-jamon-crudo-y-rucula', 'huevo', 3),
  ('revuelto-de-jamon-crudo-y-rucula', 'jamon-crudo', 40),
  ('revuelto-de-jamon-crudo-y-rucula', 'rucula', 30),
  ('revuelto-de-jamon-crudo-y-rucula', 'queso-cremoso', 30),
  ('revuelto-de-jamon-crudo-y-rucula', 'aceite', 3),
  ('tortilla-de-jamon-y-queso', 'huevo', 3),
  ('tortilla-de-jamon-y-queso', 'jamon-cocido', 50),
  ('tortilla-de-jamon-y-queso', 'queso-cremoso', 40),
  ('tortilla-de-jamon-y-queso', 'aceite', 3),
  ('tortilla-de-brocoli-y-queso', 'huevo', 3),
  ('tortilla-de-brocoli-y-queso', 'brocoli', 120),
  ('tortilla-de-brocoli-y-queso', 'queso-cremoso', 40),
  ('tortilla-de-brocoli-y-queso', 'aceite', 3),
  ('tortilla-de-ricota-y-espinaca', 'huevo', 3),
  ('tortilla-de-ricota-y-espinaca', 'espinaca', 80),
  ('tortilla-de-ricota-y-espinaca', 'ricota', 60),
  ('tortilla-de-ricota-y-espinaca', 'aceite', 7),
  ('frittata-de-jamon-crudo-y-rucula-al-horno', 'huevo', 6),
  ('frittata-de-jamon-crudo-y-rucula-al-horno', 'jamon-crudo', 80),
  ('frittata-de-jamon-crudo-y-rucula-al-horno', 'rucula', 60),
  ('frittata-de-jamon-crudo-y-rucula-al-horno', 'queso-cremoso', 60),
  ('frittata-de-jamon-crudo-y-rucula-al-horno', 'queso-rallado', 20),
  ('frittata-de-jamon-crudo-y-rucula-al-horno', 'aceite', 6),
  ('revuelto-de-calabaza-y-feta', 'huevo', 3),
  ('revuelto-de-calabaza-y-feta', 'calabaza', 140),
  ('revuelto-de-calabaza-y-feta', 'feta', 40),
  ('revuelto-de-calabaza-y-feta', 'aceite', 8),
  ('tortilla-de-coliflor-y-queso', 'huevo', 3),
  ('tortilla-de-coliflor-y-queso', 'coliflor', 130),
  ('tortilla-de-coliflor-y-queso', 'queso-cremoso', 40),
  ('tortilla-de-coliflor-y-queso', 'aceite', 3),
  ('frittata-de-calabaza-y-feta-al-horno', 'huevo', 6),
  ('frittata-de-calabaza-y-feta-al-horno', 'calabaza', 280),
  ('frittata-de-calabaza-y-feta-al-horno', 'feta', 80),
  ('frittata-de-calabaza-y-feta-al-horno', 'aceite', 15),
  ('frittata-de-calabaza-y-feta-al-horno', 'queso-rallado', 20),
  ('revuelto-de-jamon-y-queso', 'huevo', 3),
  ('revuelto-de-jamon-y-queso', 'jamon-cocido', 50),
  ('revuelto-de-jamon-y-queso', 'queso-cremoso', 40),
  ('revuelto-de-jamon-y-queso', 'aceite', 3),
  ('tortilla-de-pollo-y-puerro', 'huevo', 3),
  ('tortilla-de-pollo-y-puerro', 'pollo-desmenuzado', 90),
  ('tortilla-de-pollo-y-puerro', 'puerro', 80),
  ('tortilla-de-pollo-y-puerro', 'aceite', 8),
  ('tortilla-de-zanahoria-y-arvejas', 'huevo', 3),
  ('tortilla-de-zanahoria-y-arvejas', 'zanahoria', 1),
  ('tortilla-de-zanahoria-y-arvejas', 'arvejas-frescas', 60),
  ('tortilla-de-zanahoria-y-arvejas', 'aceite', 8),
  ('tortilla-de-espinaca-y-queso', 'huevo', 3),
  ('tortilla-de-espinaca-y-queso', 'espinaca', 90),
  ('tortilla-de-espinaca-y-queso', 'queso-cremoso', 40),
  ('tortilla-de-espinaca-y-queso', 'aceite', 7),
  ('revuelto-de-champinones-y-cebolla', 'huevo', 3),
  ('revuelto-de-champinones-y-cebolla', 'champinones', 120),
  ('revuelto-de-champinones-y-cebolla', 'cebolla', 0.5),
  ('revuelto-de-champinones-y-cebolla', 'aceite', 9),
  ('frittata-de-hongos-y-queso-de-cabra-al-horno', 'huevo', 6),
  ('frittata-de-hongos-y-queso-de-cabra-al-horno', 'champinones', 200),
  ('frittata-de-hongos-y-queso-de-cabra-al-horno', 'queso-cabra', 80),
  ('frittata-de-hongos-y-queso-de-cabra-al-horno', 'cebolla', 0.5),
  ('frittata-de-hongos-y-queso-de-cabra-al-horno', 'aceite', 15),
  ('frittata-de-hongos-y-queso-de-cabra-al-horno', 'queso-rallado', 20),
  ('tortilla-de-chauchas-y-queso', 'huevo', 3),
  ('tortilla-de-chauchas-y-queso', 'chauchas', 120),
  ('tortilla-de-chauchas-y-queso', 'queso-cremoso', 40),
  ('tortilla-de-chauchas-y-queso', 'aceite', 3),
  ('tortilla-de-cebolla-y-queso-azul', 'huevo', 3),
  ('tortilla-de-cebolla-y-queso-azul', 'cebolla', 1),
  ('tortilla-de-cebolla-y-queso-azul', 'queso-azul', 25),
  ('tortilla-de-cebolla-y-queso-azul', 'aceite', 9),
  ('revuelto-de-brocoli-y-queso', 'huevo', 3),
  ('revuelto-de-brocoli-y-queso', 'brocoli', 120),
  ('revuelto-de-brocoli-y-queso', 'queso-cremoso', 40),
  ('revuelto-de-brocoli-y-queso', 'aceite', 3),
  ('revuelto-de-verduras-asadas', 'huevo', 3),
  ('revuelto-de-verduras-asadas', 'berenjena', 0.5),
  ('revuelto-de-verduras-asadas', 'morron', 0.5),
  ('revuelto-de-verduras-asadas', 'zapallito', 0.5),
  ('revuelto-de-verduras-asadas', 'cebolla', 0.5),
  ('revuelto-de-verduras-asadas', 'aceite', 11),
  ('tortilla-de-calabaza-y-cebolla', 'huevo', 3),
  ('tortilla-de-calabaza-y-cebolla', 'calabaza', 150),
  ('tortilla-de-calabaza-y-cebolla', 'cebolla', 0.5),
  ('tortilla-de-calabaza-y-cebolla', 'aceite', 9),
  ('tarta-de-champinones-y-cebolla', 'huevo', 3),
  ('tarta-de-champinones-y-cebolla', 'champinones', 480),
  ('tarta-de-champinones-y-cebolla', 'cebolla', 1.5),
  ('tarta-de-champinones-y-cebolla', 'aceite', 25),
  ('tarta-de-champinones-y-cebolla', 'tapa-tarta', 1),
  ('tarta-de-champinones-y-cebolla', 'leche', 160),
  ('tarta-de-champinones-y-cebolla', 'queso-rallado', 30),
  ('tortilla-de-tomate-y-albahaca', 'huevo', 3),
  ('tortilla-de-tomate-y-albahaca', 'tomate', 1.5),
  ('tortilla-de-tomate-y-albahaca', 'albahaca', 5),
  ('tortilla-de-tomate-y-albahaca', 'muzzarella', 40),
  ('tortilla-de-tomate-y-albahaca', 'aceite', 3),
  ('revuelto-de-morron-y-cebolla', 'huevo', 3),
  ('revuelto-de-morron-y-cebolla', 'morron', 0.5),
  ('revuelto-de-morron-y-cebolla', 'cebolla', 0.5),
  ('revuelto-de-morron-y-cebolla', 'aceite', 9),
  ('omelette-de-acelga-y-queso', 'huevo', 3),
  ('omelette-de-acelga-y-queso', 'acelga', 100),
  ('omelette-de-acelga-y-queso', 'queso-cremoso', 40),
  ('omelette-de-acelga-y-queso', 'aceite', 7),
  ('tortilla-de-champinones-y-cebolla', 'huevo', 3),
  ('tortilla-de-champinones-y-cebolla', 'champinones', 120),
  ('tortilla-de-champinones-y-cebolla', 'cebolla', 0.5),
  ('tortilla-de-champinones-y-cebolla', 'aceite', 9),
  ('omelette-de-calabaza-y-feta', 'huevo', 3),
  ('omelette-de-calabaza-y-feta', 'calabaza', 140),
  ('omelette-de-calabaza-y-feta', 'feta', 40),
  ('omelette-de-calabaza-y-feta', 'aceite', 8),
  ('omelette-de-papa-y-cebolla', 'huevo', 3),
  ('omelette-de-papa-y-cebolla', 'papa', 160),
  ('omelette-de-papa-y-cebolla', 'cebolla', 0.5),
  ('omelette-de-papa-y-cebolla', 'aceite', 15),
  ('revuelto-de-hongos-y-queso-de-cabra', 'huevo', 3),
  ('revuelto-de-hongos-y-queso-de-cabra', 'champinones', 100),
  ('revuelto-de-hongos-y-queso-de-cabra', 'queso-cabra', 40),
  ('revuelto-de-hongos-y-queso-de-cabra', 'cebolla', 0.5),
  ('revuelto-de-hongos-y-queso-de-cabra', 'aceite', 8),
  ('frittata-de-puerro-y-queso-al-horno', 'huevo', 6),
  ('frittata-de-puerro-y-queso-al-horno', 'puerro', 200),
  ('frittata-de-puerro-y-queso-al-horno', 'queso-cremoso', 80),
  ('frittata-de-puerro-y-queso-al-horno', 'aceite', 15),
  ('frittata-de-puerro-y-queso-al-horno', 'queso-rallado', 20),
  ('tarta-de-zapallitos-y-cebolla', 'huevo', 3),
  ('tarta-de-zapallitos-y-cebolla', 'zapallito', 4),
  ('tarta-de-zapallitos-y-cebolla', 'cebolla', 1.5),
  ('tarta-de-zapallitos-y-cebolla', 'aceite', 25),
  ('tarta-de-zapallitos-y-cebolla', 'tapa-tarta', 1),
  ('tarta-de-zapallitos-y-cebolla', 'leche', 160),
  ('tarta-de-zapallitos-y-cebolla', 'queso-rallado', 30),
  ('tortilla-de-morron-y-cebolla', 'huevo', 3),
  ('tortilla-de-morron-y-cebolla', 'morron', 0.5),
  ('tortilla-de-morron-y-cebolla', 'cebolla', 0.5),
  ('tortilla-de-morron-y-cebolla', 'aceite', 9),
  ('tortilla-de-salmon-ahumado-y-cebolla-de-verdeo', 'huevo', 3),
  ('tortilla-de-salmon-ahumado-y-cebolla-de-verdeo', 'salmon-ahumado', 60),
  ('tortilla-de-salmon-ahumado-y-cebolla-de-verdeo', 'cebolla-verdeo', 25),
  ('tortilla-de-salmon-ahumado-y-cebolla-de-verdeo', 'queso-untable', 30),
  ('tortilla-de-salmon-ahumado-y-cebolla-de-verdeo', 'aceite', 3),
  ('tarta-de-panceta-y-queso', 'huevo', 3),
  ('tarta-de-panceta-y-queso', 'panceta', 120),
  ('tarta-de-panceta-y-queso', 'queso-cremoso', 160),
  ('tarta-de-panceta-y-queso', 'cebolla', 1),
  ('tarta-de-panceta-y-queso', 'tapa-tarta', 1),
  ('tarta-de-panceta-y-queso', 'leche', 160),
  ('tarta-de-panceta-y-queso', 'queso-rallado', 30),
  ('frittata-de-pollo-y-puerro-al-horno', 'huevo', 6),
  ('frittata-de-pollo-y-puerro-al-horno', 'pollo-desmenuzado', 180),
  ('frittata-de-pollo-y-puerro-al-horno', 'puerro', 160),
  ('frittata-de-pollo-y-puerro-al-horno', 'aceite', 15),
  ('frittata-de-pollo-y-puerro-al-horno', 'queso-rallado', 20),
  ('omelette-de-jamon-crudo-y-rucula', 'huevo', 3),
  ('omelette-de-jamon-crudo-y-rucula', 'jamon-crudo', 40),
  ('omelette-de-jamon-crudo-y-rucula', 'rucula', 30),
  ('omelette-de-jamon-crudo-y-rucula', 'queso-cremoso', 30),
  ('omelette-de-jamon-crudo-y-rucula', 'aceite', 3),
  ('tarta-de-morron-y-cebolla', 'huevo', 3),
  ('tarta-de-morron-y-cebolla', 'morron', 2.5),
  ('tarta-de-morron-y-cebolla', 'cebolla', 1.5),
  ('tarta-de-morron-y-cebolla', 'aceite', 25),
  ('tarta-de-morron-y-cebolla', 'tapa-tarta', 1),
  ('tarta-de-morron-y-cebolla', 'leche', 160),
  ('tarta-de-morron-y-cebolla', 'queso-rallado', 30),
  ('frittata-de-palmitos-y-queso-al-horno', 'huevo', 6),
  ('frittata-de-palmitos-y-queso-al-horno', 'palmitos', 200),
  ('frittata-de-palmitos-y-queso-al-horno', 'queso-cremoso', 80),
  ('frittata-de-palmitos-y-queso-al-horno', 'cebolla-verdeo', 30),
  ('frittata-de-palmitos-y-queso-al-horno', 'queso-rallado', 20),
  ('frittata-de-palmitos-y-queso-al-horno', 'aceite', 6),
  ('tortilla-de-zapallitos-y-cebolla', 'huevo', 3),
  ('tortilla-de-zapallitos-y-cebolla', 'zapallito', 1),
  ('tortilla-de-zapallitos-y-cebolla', 'cebolla', 0.5),
  ('tortilla-de-zapallitos-y-cebolla', 'aceite', 9),
  ('revuelto-de-palmitos-y-queso', 'huevo', 3),
  ('revuelto-de-palmitos-y-queso', 'palmitos', 100),
  ('revuelto-de-palmitos-y-queso', 'queso-cremoso', 40),
  ('revuelto-de-palmitos-y-queso', 'cebolla-verdeo', 15),
  ('revuelto-de-palmitos-y-queso', 'aceite', 3),
  ('omelette-de-zapallitos-y-cebolla', 'huevo', 3),
  ('omelette-de-zapallitos-y-cebolla', 'zapallito', 1),
  ('omelette-de-zapallitos-y-cebolla', 'cebolla', 0.5),
  ('omelette-de-zapallitos-y-cebolla', 'aceite', 9),
  ('revuelto-de-calabaza-y-cebolla', 'huevo', 3),
  ('revuelto-de-calabaza-y-cebolla', 'calabaza', 150),
  ('revuelto-de-calabaza-y-cebolla', 'cebolla', 0.5),
  ('revuelto-de-calabaza-y-cebolla', 'aceite', 9),
  ('tortilla-de-hongos-y-queso-de-cabra', 'huevo', 3),
  ('tortilla-de-hongos-y-queso-de-cabra', 'champinones', 100),
  ('tortilla-de-hongos-y-queso-de-cabra', 'queso-cabra', 40),
  ('tortilla-de-hongos-y-queso-de-cabra', 'cebolla', 0.5),
  ('tortilla-de-hongos-y-queso-de-cabra', 'aceite', 8),
  ('frittata-de-papa-y-cebolla-al-horno', 'huevo', 6),
  ('frittata-de-papa-y-cebolla-al-horno', 'papa', 320),
  ('frittata-de-papa-y-cebolla-al-horno', 'cebolla', 1),
  ('frittata-de-papa-y-cebolla-al-horno', 'aceite', 25),
  ('frittata-de-papa-y-cebolla-al-horno', 'queso-rallado', 20),
  ('revuelto-de-ricota-y-espinaca', 'huevo', 3),
  ('revuelto-de-ricota-y-espinaca', 'espinaca', 80),
  ('revuelto-de-ricota-y-espinaca', 'ricota', 60),
  ('revuelto-de-ricota-y-espinaca', 'aceite', 7),
  ('tarta-de-coliflor-y-queso', 'huevo', 3),
  ('tarta-de-coliflor-y-queso', 'coliflor', 520),
  ('tarta-de-coliflor-y-queso', 'queso-cremoso', 160),
  ('tarta-de-coliflor-y-queso', 'tapa-tarta', 1),
  ('tarta-de-coliflor-y-queso', 'leche', 160),
  ('tarta-de-coliflor-y-queso', 'queso-rallado', 30),
  ('tarta-de-palmitos-y-queso', 'huevo', 3),
  ('tarta-de-palmitos-y-queso', 'palmitos', 400),
  ('tarta-de-palmitos-y-queso', 'queso-cremoso', 160),
  ('tarta-de-palmitos-y-queso', 'cebolla-verdeo', 60),
  ('tarta-de-palmitos-y-queso', 'tapa-tarta', 1),
  ('tarta-de-palmitos-y-queso', 'leche', 160),
  ('tarta-de-palmitos-y-queso', 'queso-rallado', 30),
  ('revuelto-de-coliflor-y-queso', 'huevo', 3),
  ('revuelto-de-coliflor-y-queso', 'coliflor', 130),
  ('revuelto-de-coliflor-y-queso', 'queso-cremoso', 40),
  ('revuelto-de-coliflor-y-queso', 'aceite', 3),
  ('omelette-de-ricota-y-espinaca', 'huevo', 3),
  ('omelette-de-ricota-y-espinaca', 'espinaca', 80),
  ('omelette-de-ricota-y-espinaca', 'ricota', 60),
  ('omelette-de-ricota-y-espinaca', 'aceite', 7),
  ('revuelto-de-acelga-y-queso', 'huevo', 3),
  ('revuelto-de-acelga-y-queso', 'acelga', 100),
  ('revuelto-de-acelga-y-queso', 'queso-cremoso', 40),
  ('revuelto-de-acelga-y-queso', 'aceite', 7),
  ('frittata-de-zanahoria-y-arvejas-al-horno', 'huevo', 6),
  ('frittata-de-zanahoria-y-arvejas-al-horno', 'zanahoria', 2),
  ('frittata-de-zanahoria-y-arvejas-al-horno', 'arvejas-frescas', 120),
  ('frittata-de-zanahoria-y-arvejas-al-horno', 'aceite', 15),
  ('frittata-de-zanahoria-y-arvejas-al-horno', 'queso-rallado', 20),
  ('tarta-de-acelga-y-queso', 'huevo', 3),
  ('tarta-de-acelga-y-queso', 'acelga', 400),
  ('tarta-de-acelga-y-queso', 'queso-cremoso', 160),
  ('tarta-de-acelga-y-queso', 'aceite', 15),
  ('tarta-de-acelga-y-queso', 'tapa-tarta', 1),
  ('tarta-de-acelga-y-queso', 'leche', 160),
  ('tarta-de-acelga-y-queso', 'queso-rallado', 30),
  ('tarta-de-choclo-y-cebolla-de-verdeo', 'huevo', 3),
  ('tarta-de-choclo-y-cebolla-de-verdeo', 'choclo', 320),
  ('tarta-de-choclo-y-cebolla-de-verdeo', 'cebolla-verdeo', 100),
  ('tarta-de-choclo-y-cebolla-de-verdeo', 'queso-cremoso', 120),
  ('tarta-de-choclo-y-cebolla-de-verdeo', 'tapa-tarta', 1),
  ('tarta-de-choclo-y-cebolla-de-verdeo', 'leche', 160),
  ('tarta-de-choclo-y-cebolla-de-verdeo', 'queso-rallado', 30),
  ('frittata-de-berenjena-y-tomate-al-horno', 'huevo', 6),
  ('frittata-de-berenjena-y-tomate-al-horno', 'berenjena', 1),
  ('frittata-de-berenjena-y-tomate-al-horno', 'tomate', 1.5),
  ('frittata-de-berenjena-y-tomate-al-horno', 'aceite', 20),
  ('frittata-de-berenjena-y-tomate-al-horno', 'queso-rallado', 20),
  ('frittata-de-coliflor-y-queso-al-horno', 'huevo', 6),
  ('frittata-de-coliflor-y-queso-al-horno', 'coliflor', 260),
  ('frittata-de-coliflor-y-queso-al-horno', 'queso-cremoso', 80),
  ('frittata-de-coliflor-y-queso-al-horno', 'queso-rallado', 20),
  ('frittata-de-coliflor-y-queso-al-horno', 'aceite', 6),
  ('tarta-de-espinaca-y-queso', 'huevo', 3),
  ('tarta-de-espinaca-y-queso', 'espinaca', 360),
  ('tarta-de-espinaca-y-queso', 'queso-cremoso', 160),
  ('tarta-de-espinaca-y-queso', 'aceite', 15),
  ('tarta-de-espinaca-y-queso', 'tapa-tarta', 1),
  ('tarta-de-espinaca-y-queso', 'leche', 160),
  ('tarta-de-espinaca-y-queso', 'queso-rallado', 30),
  ('frittata-de-acelga-y-queso-al-horno', 'huevo', 6),
  ('frittata-de-acelga-y-queso-al-horno', 'acelga', 200),
  ('frittata-de-acelga-y-queso-al-horno', 'queso-cremoso', 80),
  ('frittata-de-acelga-y-queso-al-horno', 'aceite', 15),
  ('frittata-de-acelga-y-queso-al-horno', 'queso-rallado', 20),
  ('frittata-de-zapallitos-y-cebolla-al-horno', 'huevo', 6),
  ('frittata-de-zapallitos-y-cebolla-al-horno', 'zapallito', 2),
  ('frittata-de-zapallitos-y-cebolla-al-horno', 'cebolla', 0.5),
  ('frittata-de-zapallitos-y-cebolla-al-horno', 'aceite', 20),
  ('frittata-de-zapallitos-y-cebolla-al-horno', 'queso-rallado', 20),
  ('revuelto-de-chauchas-y-queso', 'huevo', 3),
  ('revuelto-de-chauchas-y-queso', 'chauchas', 120),
  ('revuelto-de-chauchas-y-queso', 'queso-cremoso', 40),
  ('revuelto-de-chauchas-y-queso', 'aceite', 3)
) as v(recipe_slug, food_slug, qty)
join public.recipes r on r.slug = v.recipe_slug
join public.foods f on f.slug = v.food_slug
on conflict do nothing;
