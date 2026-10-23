-- Sexta tanda de la base (1.25): recetas, parte 8 de 8. Después de seed-8-alimentos.sql. Se puede correr de nuevo: agrega solo lo que falta. Generado con scripts/gen-seed.mjs

insert into public.recipes (slug, name, minutes, servings, meal_types, portable, steps) values
  ('hongos-portobello-rellenos-de-arroz-y-atun', 'Hongos portobello rellenos de arroz y atún', 43, 1, '{almuerzo,cena}', true, 'Sacás el tallo a los hongos grandes y los picás para el relleno.
Mezclás el arroz con el atún escurrido y el tomate en cubitos, sal y orégano.
Rellenás cada pieza, espolvoreás con queso rallado y un hilo de aceite.
Horneás en una fuente a 200 °C, 25 minutos, hasta que estén tiernas y gratinadas.'),
  ('calabacines-rellenos-de-garbanzos-y-verduras', 'Calabacines rellenos de garbanzos y verduras', 47, 1, '{almuerzo,cena}', true, 'Cortás los calabacines al medio a lo largo y los ahuecás; picás la pulpa para el relleno.
Mezclás los garbanzos con la cebolla y la zanahoria salteadas y el tomate triturado, con comino y sal.
Rellenás cada pieza, espolvoreás con queso rallado y un hilo de aceite.
Horneás en una fuente a 200 °C, 25 minutos, hasta que estén tiernas y gratinadas.'),
  ('calabacines-rellenos-de-quinoa-y-verduras', 'Calabacines rellenos de quinoa y verduras', 47, 1, '{almuerzo,cena}', true, 'Cortás los calabacines al medio a lo largo y los ahuecás; picás la pulpa para el relleno.
Mezclás la quinoa con la zanahoria rallada, el choclo y el queso en cubitos.
Rellenás cada pieza, espolvoreás con queso rallado y un hilo de aceite.
Horneás en una fuente a 200 °C, 25 minutos, hasta que estén tiernas y gratinadas.'),
  ('berenjenas-rellenos-de-carne', 'Berenjenas rellenos de carne', 55, 1, '{almuerzo,cena}', true, 'Cortás las berenjenas al medio, las hervís o asás 10 minutos y ahuecás la pulpa, que picás y sumás al relleno.
Salteás la carne con la cebolla picada hasta que se dore (6 minutos) y sazonás con sal, pimienta y pimentón.
Rellenás cada pieza, espolvoreás con queso rallado y un hilo de aceite.
Horneás en una fuente a 200 °C, 25 minutos, hasta que estén tiernas y gratinadas.'),
  ('berenjenas-rellenos-de-arroz-y-atun', 'Berenjenas rellenos de arroz y atún', 55, 1, '{almuerzo,cena}', true, 'Cortás las berenjenas al medio, las hervís o asás 10 minutos y ahuecás la pulpa, que picás y sumás al relleno.
Mezclás el arroz con el atún escurrido y el tomate en cubitos, sal y orégano.
Rellenás cada pieza, espolvoreás con queso rallado y un hilo de aceite.
Horneás en una fuente a 200 °C, 25 minutos, hasta que estén tiernas y gratinadas.'),
  ('tomates-rellenos-de-champinones-y-queso', 'Tomates rellenos de champiñones y queso', 45, 1, '{almuerzo,cena}', true, 'Cortás la tapita de los tomates, los ahuecás con una cuchara y reservás la pulpa picada para el relleno.
Salteás la cebolla y los champiñones picados con el aceite 7 minutos y mezclás con el queso en cubitos.
Rellenás cada pieza, espolvoreás con queso rallado y un hilo de aceite.
Horneás en una fuente a 200 °C, 25 minutos, hasta que estén tiernas y gratinadas.'),
  ('morrones-rellenos-de-pollo-y-queso', 'Morrones rellenos de pollo y queso', 47, 1, '{almuerzo,cena}', true, 'Cortás los morrones al medio, sacás las semillas y los hervís 4 minutos.
Salteás el pollo picado con la cebolla 6 minutos y mezclás con el queso en cubitos.
Rellenás cada pieza, espolvoreás con queso rallado y un hilo de aceite.
Horneás en una fuente a 200 °C, 25 minutos, hasta que estén tiernas y gratinadas.'),
  ('zapallitos-rellenos-de-pavo-y-verduras', 'Zapallitos rellenos de pavo y verduras', 50, 1, '{almuerzo,cena}', true, 'Cortás los zapallitos al medio a lo largo, los hervís 5 minutos y los ahuecás con una cuchara; picás la pulpa y la sumás al relleno.
Salteás el pavo picado con la cebolla y la zanahoria rallada 6 minutos, con sal y pimienta.
Rellenás cada pieza, espolvoreás con queso rallado y un hilo de aceite.
Horneás en una fuente a 200 °C, 25 minutos, hasta que estén tiernas y gratinadas.'),
  ('papas-rellenos-de-quinoa-y-verduras', 'Papas rellenos de quinoa y verduras', 60, 1, '{almuerzo,cena}', true, 'Hervís las papas con cáscara 20 minutos, las cortás al medio y las ahuecás un poco.
Mezclás la quinoa con la zanahoria rallada, el choclo y el queso en cubitos.
Rellenás cada pieza, espolvoreás con queso rallado y un hilo de aceite.
Horneás en una fuente a 200 °C, 25 minutos, hasta que estén tiernas y gratinadas.'),
  ('morrones-rellenos-de-arroz-y-atun', 'Morrones rellenos de arroz y atún', 47, 1, '{almuerzo,cena}', true, 'Cortás los morrones al medio, sacás las semillas y los hervís 4 minutos.
Mezclás el arroz con el atún escurrido y el tomate en cubitos, sal y orégano.
Rellenás cada pieza, espolvoreás con queso rallado y un hilo de aceite.
Horneás en una fuente a 200 °C, 25 minutos, hasta que estén tiernas y gratinadas.'),
  ('morrones-rellenos-de-jamon-y-queso', 'Morrones rellenos de jamón y queso', 47, 1, '{almuerzo,cena}', true, 'Cortás los morrones al medio, sacás las semillas y los hervís 4 minutos.
Mezclás el jamón picado y el queso en cubitos con la salsa blanca.
Rellenás cada pieza, espolvoreás con queso rallado y un hilo de aceite.
Horneás en una fuente a 200 °C, 25 minutos, hasta que estén tiernas y gratinadas.'),
  ('zapallitos-rellenos-de-garbanzos-y-verduras', 'Zapallitos rellenos de garbanzos y verduras', 50, 1, '{almuerzo,cena}', true, 'Cortás los zapallitos al medio a lo largo, los hervís 5 minutos y los ahuecás con una cuchara; picás la pulpa y la sumás al relleno.
Mezclás los garbanzos con la cebolla y la zanahoria salteadas y el tomate triturado, con comino y sal.
Rellenás cada pieza, espolvoreás con queso rallado y un hilo de aceite.
Horneás en una fuente a 200 °C, 25 minutos, hasta que estén tiernas y gratinadas.'),
  ('berenjenas-rellenos-de-ricota-y-espinaca', 'Berenjenas rellenos de ricota y espinaca', 55, 1, '{almuerzo,cena}', true, 'Cortás las berenjenas al medio, las hervís o asás 10 minutos y ahuecás la pulpa, que picás y sumás al relleno.
Salteás la espinaca picada 2 minutos, la mezclás con la ricota, el queso rallado, sal y nuez moscada.
Rellenás cada pieza, espolvoreás con queso rallado y un hilo de aceite.
Horneás en una fuente a 200 °C, 25 minutos, hasta que estén tiernas y gratinadas.'),
  ('hongos-portobello-rellenos-de-pavo-y-verduras', 'Hongos portobello rellenos de pavo y verduras', 43, 1, '{almuerzo,cena}', true, 'Sacás el tallo a los hongos grandes y los picás para el relleno.
Salteás el pavo picado con la cebolla y la zanahoria rallada 6 minutos, con sal y pimienta.
Rellenás cada pieza, espolvoreás con queso rallado y un hilo de aceite.
Horneás en una fuente a 200 °C, 25 minutos, hasta que estén tiernas y gratinadas.'),
  ('papas-rellenos-de-pollo-y-queso', 'Papas rellenos de pollo y queso', 60, 1, '{almuerzo,cena}', true, 'Hervís las papas con cáscara 20 minutos, las cortás al medio y las ahuecás un poco.
Salteás el pollo picado con la cebolla 6 minutos y mezclás con el queso en cubitos.
Rellenás cada pieza, espolvoreás con queso rallado y un hilo de aceite.
Horneás en una fuente a 200 °C, 25 minutos, hasta que estén tiernas y gratinadas.'),
  ('cebollas-rellenos-de-jamon-y-queso', 'Cebollas rellenos de jamón y queso', 55, 1, '{almuerzo,cena}', true, 'Pelás las cebollas, las hervís 10 minutos y las ahuecás, dejando 2 capas.
Mezclás el jamón picado y el queso en cubitos con la salsa blanca.
Rellenás cada pieza, espolvoreás con queso rallado y un hilo de aceite.
Horneás en una fuente a 200 °C, 25 minutos, hasta que estén tiernas y gratinadas.'),
  ('hongos-portobello-rellenos-de-lentejas', 'Hongos portobello rellenos de lentejas', 43, 1, '{almuerzo,cena}', true, 'Sacás el tallo a los hongos grandes y los picás para el relleno.
Mezclás las lentejas con la cebolla salteada y el tomate triturado, comino y sal.
Rellenás cada pieza, espolvoreás con queso rallado y un hilo de aceite.
Horneás en una fuente a 200 °C, 25 minutos, hasta que estén tiernas y gratinadas.'),
  ('berenjenas-rellenos-de-pollo-y-queso', 'Berenjenas rellenos de pollo y queso', 55, 1, '{almuerzo,cena}', true, 'Cortás las berenjenas al medio, las hervís o asás 10 minutos y ahuecás la pulpa, que picás y sumás al relleno.
Salteás el pollo picado con la cebolla 6 minutos y mezclás con el queso en cubitos.
Rellenás cada pieza, espolvoreás con queso rallado y un hilo de aceite.
Horneás en una fuente a 200 °C, 25 minutos, hasta que estén tiernas y gratinadas.'),
  ('morrones-rellenos-de-garbanzos-y-verduras', 'Morrones rellenos de garbanzos y verduras', 47, 1, '{almuerzo,cena}', true, 'Cortás los morrones al medio, sacás las semillas y los hervís 4 minutos.
Mezclás los garbanzos con la cebolla y la zanahoria salteadas y el tomate triturado, con comino y sal.
Rellenás cada pieza, espolvoreás con queso rallado y un hilo de aceite.
Horneás en una fuente a 200 °C, 25 minutos, hasta que estén tiernas y gratinadas.'),
  ('tomates-rellenos-de-garbanzos-y-verduras', 'Tomates rellenos de garbanzos y verduras', 45, 1, '{almuerzo,cena}', true, 'Cortás la tapita de los tomates, los ahuecás con una cuchara y reservás la pulpa picada para el relleno.
Mezclás los garbanzos con la cebolla y la zanahoria salteadas y el tomate triturado, con comino y sal.
Rellenás cada pieza, espolvoreás con queso rallado y un hilo de aceite.
Horneás en una fuente a 200 °C, 25 minutos, hasta que estén tiernas y gratinadas.'),
  ('tomates-rellenos-de-pollo-y-queso', 'Tomates rellenos de pollo y queso', 45, 1, '{almuerzo,cena}', true, 'Cortás la tapita de los tomates, los ahuecás con una cuchara y reservás la pulpa picada para el relleno.
Salteás el pollo picado con la cebolla 6 minutos y mezclás con el queso en cubitos.
Rellenás cada pieza, espolvoreás con queso rallado y un hilo de aceite.
Horneás en una fuente a 200 °C, 25 minutos, hasta que estén tiernas y gratinadas.'),
  ('hongos-portobello-rellenos-de-champinones-y-queso', 'Hongos portobello rellenos de champiñones y queso', 43, 1, '{almuerzo,cena}', true, 'Sacás el tallo a los hongos grandes y los picás para el relleno.
Salteás la cebolla y los champiñones picados con el aceite 7 minutos y mezclás con el queso en cubitos.
Rellenás cada pieza, espolvoreás con queso rallado y un hilo de aceite.
Horneás en una fuente a 200 °C, 25 minutos, hasta que estén tiernas y gratinadas.'),
  ('calabacines-rellenos-de-ricota-y-espinaca', 'Calabacines rellenos de ricota y espinaca', 47, 1, '{almuerzo,cena}', true, 'Cortás los calabacines al medio a lo largo y los ahuecás; picás la pulpa para el relleno.
Salteás la espinaca picada 2 minutos, la mezclás con la ricota, el queso rallado, sal y nuez moscada.
Rellenás cada pieza, espolvoreás con queso rallado y un hilo de aceite.
Horneás en una fuente a 200 °C, 25 minutos, hasta que estén tiernas y gratinadas.'),
  ('canelones-de-ricota-y-espinaca', 'Canelones de ricota y espinaca', 60, 1, '{almuerzo,cena}', true, 'Salteás la espinaca picada 2 minutos y la mezclás con la ricota, sal y nuez moscada.
Hidratás las tapas, las rellenás y las enrollás.
Las acomodás en una fuente con la salsa de tomate y el queso rallado, y horneás 25 minutos a 200 °C.'),
  ('canelones-de-pollo-y-verduras', 'Canelones de pollo y verduras', 60, 1, '{almuerzo,cena}', true, 'Salteás el pollo con la cebolla y la zanahoria rallada 7 minutos, con sal y pimienta.
Hidratás las tapas, las rellenás y las enrollás.
Las acomodás con la salsa de tomate y el queso rallado, y horneás 25 minutos a 200 °C.'),
  ('lasana-de-verduras', 'Lasaña de verduras', 60, 1, '{almuerzo,cena}', true, 'Cortás la calabaza y el zapallito en rodajas finas y las salteás 5 minutos.
Armás capas alternando tapas, verduras, ricota, salsa de tomate y muzzarella; terminás con muzzarella.
Horneás tapada 25 minutos a 190 °C y 10 minutos destapada para gratinar.'),
  ('lasana-de-carne', 'Lasaña de carne', 60, 1, '{almuerzo,cena}', true, 'Cocinás la carne picada con un poco de salsa de tomate, cebolla, sal y orégano, 8 minutos.
Armás capas: tapas, carne, salsa blanca y muzzarella; terminás con salsa y queso.
Horneás 30 minutos a 190 °C hasta que burbujee y se dore.'),
  ('panqueques-de-verdura-y-ricota-gratinados', 'Panqueques de verdura y ricota gratinados', 60, 1, '{almuerzo,cena}', true, 'Salteás la espinaca picada 2 minutos y la mezclás con la ricota, sal y nuez moscada.
Rellenás los panqueques y los enrollás.
Los acomodás con la salsa de tomate y el queso rallado y gratinás 15 minutos a 200 °C.'),
  ('bastones-de-zanahoria-con-hummus', 'Bastones de zanahoria con hummus', 5, 1, '{merienda}', true, 'Pelás la zanahoria y la cortás en bastones.
Servís con el hummus para mojar.'),
  ('bastones-de-pepino-con-tzatziki', 'Bastones de pepino con tzatziki', 5, 1, '{merienda}', true, 'Cortás el pepino en bastones.
Servís con el tzatziki para mojar.'),
  ('manzana-con-mantequilla-de-mani', 'Manzana con mantequilla de maní', 3, 1, '{merienda}', true, 'Cortás la manzana en gajos.
Servís con la pasta de maní para untar.'),
  ('palta-rellena-con-atun', 'Palta rellena con atún', 6, 1, '{merienda}', true, 'Cortás la palta al medio y sacás el carozo.
Mezclás el atún escurrido con limón, sal y pimienta y rellenás las paltas.'),
  ('huevos-duros-con-tomate-cherry', 'Huevos duros con tomate cherry', 12, 1, '{merienda}', true, 'Hervís los huevos 9 minutos, los enfriás y los pelás.
Servís con los cherry, sal y orégano.'),
  ('yogur-con-frutos-secos-y-miel', 'Yogur con frutos secos y miel', 3, 1, '{merienda}', true, 'Servís el yogur en un bowl.
Sumás las nueces picadas y un hilo de miel.'),
  ('tostada-de-arroz-con-ricota-y-tomate', 'Tostada de arroz con ricota y tomate', 4, 1, '{merienda}', true, 'Untás las galletas de arroz con la ricota.
Sumás rodajas de tomate, sal y orégano.'),
  ('garbanzos-asados-crocantes', 'Garbanzos asados crocantes', 30, 1, '{merienda}', true, 'Secás bien los garbanzos y los mezclás con el aceite, pimentón, comino y sal.
Los asás en horno a 220 °C, 25 minutos, moviendo la placa a la mitad, hasta que estén crocantes.'),
  ('chips-de-batata-al-horno', 'Chips de batata al horno', 30, 1, '{merienda}', true, 'Cortás la batata en rodajas finísimas con mandolina y las mezclás con el aceite y sal.
Las asás en placa, sin superponerlas, 20 minutos a 180 °C, dándolas vuelta a la mitad.'),
  ('bolitas-de-datiles-y-avena', 'Bolitas de dátiles y avena', 40, 1, '{merienda}', true, 'Procesás los dátiles con la avena, el cacao y la pasta de maní hasta lograr una masa.
Formás bolitas y las dejás 30 minutos en la heladera.'),
  ('queso-con-membrillo-y-nueces', 'Queso con membrillo y nueces', 4, 1, '{merienda}', true, 'Cortás el queso y el membrillo en láminas.
Armás las porciones y sumás las nueces.'),
  ('rollitos-de-jamon-y-queso', 'Rollitos de jamón y queso', 6, 1, '{merienda}', true, 'Untás las fetas de jamón con el queso.
Sumás un bastón de pepino y enrollás.'),
  ('ensalada-de-frutas-con-yogur', 'Ensalada de frutas con yogur', 6, 1, '{merienda}', true, 'Cortás la fruta en cubitos.
Servís con el yogur y un hilo de miel.'),
  ('bruschettas-de-tomate-y-albahaca', 'Bruschettas de tomate y albahaca', 12, 1, '{merienda}', true, 'Cortás el pan en rodajas y lo tostás.
Mezclás el tomate en cubitos con la albahaca, el aceite de oliva y sal; lo apoyás sobre el pan.'),
  ('budin-de-banana', 'Budín de banana', 55, 8, '{merienda,desayuno}', true, 'Aplastás las bananas y las mezclás con los huevos, la avena y el polvo de hornear; sumás canela.
Volcás la mezcla en un molde de budín aceitado y enharinado.
Horneás a 180 °C, 40 minutos, hasta que un palillo salga limpio. Dejás enfriar antes de desmoldar y cortás en 8 porciones.'),
  ('budin-de-zanahoria', 'Budín de zanahoria', 55, 8, '{merienda,desayuno}', true, 'Rallás la zanahoria fina y la mezclás con los huevos, el azúcar y el aceite; sumás la harina con el polvo de hornear.
Volcás la mezcla en un molde de budín aceitado y enharinado.
Horneás a 180 °C, 40 minutos, hasta que un palillo salga limpio. Dejás enfriar antes de desmoldar y cortás en 8 porciones.'),
  ('budin-de-manzana-y-canela', 'Budín de manzana y canela', 55, 8, '{merienda,desayuno}', true, 'Rallás la manzana y la mezclás con los huevos, el azúcar, la avena, canela y el polvo de hornear.
Volcás la mezcla en un molde de budín aceitado y enharinado.
Horneás a 180 °C, 40 minutos, hasta que un palillo salga limpio. Dejás enfriar antes de desmoldar y cortás en 8 porciones.'),
  ('budin-de-limon-y-yogur', 'Budín de limón y yogur', 55, 8, '{merienda,desayuno}', true, 'Mezclás el yogur con los huevos, el azúcar, el aceite y el jugo de limón; sumás la harina con el polvo de hornear.
Volcás la mezcla en un molde de budín aceitado y enharinado.
Horneás a 180 °C, 40 minutos, hasta que un palillo salga limpio. Dejás enfriar antes de desmoldar y cortás en 8 porciones.'),
  ('budin-de-cacao-y-avena', 'Budín de cacao y avena', 55, 8, '{merienda,desayuno}', true, 'Procesás la avena con la banana, los huevos, la leche, el cacao y el polvo de hornear hasta que quede lisa.
Volcás la mezcla en un molde de budín aceitado y enharinado.
Horneás a 180 °C, 40 minutos, hasta que un palillo salga limpio. Dejás enfriar antes de desmoldar y cortás en 8 porciones.'),
  ('budin-de-calabaza', 'Budín de calabaza', 55, 8, '{merienda,desayuno}', true, 'Mezclás el puré de calabaza con los huevos, el azúcar y el aceite; sumás la harina con el polvo de hornear y canela.
Volcás la mezcla en un molde de budín aceitado y enharinado.
Horneás a 180 °C, 40 minutos, hasta que un palillo salga limpio. Dejás enfriar antes de desmoldar y cortás en 8 porciones.'),
  ('manzanas-asadas-con-canela-y-nueces', 'Manzanas asadas con canela y nueces', 35, 1, '{merienda}', false, 'Sacás el centro de las manzanas y las rellenás con las nueces picadas, canela y miel.
Las horneás 30 minutos a 180 °C, hasta que estén tiernas.'),
  ('peras-al-horno-con-yogur', 'Peras al horno con yogur', 30, 1, '{merienda}', false, 'Cortás las peras al medio, sacás el centro y las horneás con canela y miel 25 minutos a 180 °C.
Servís tibias con el yogur.'),
  ('helado-casero-de-banana', 'Helado casero de banana', 8, 1, '{merienda}', false, 'Procesás la banana congelada en trozos hasta lograr una crema suave (3–4 minutos).
Servís enseguida o freezás 30 minutos para que tome cuerpo.'),
  ('helado-casero-de-frutilla', 'Helado casero de frutilla', 6, 1, '{merienda}', false, 'Procesás la frutilla congelada con el yogur hasta que quede cremosa.
Servís enseguida.'),
  ('mousse-de-chocolate-y-palta', 'Mousse de chocolate y palta', 70, 1, '{merienda}', false, 'Procesás la palta con el cacao, la miel y la leche hasta que quede muy lisa.
Dejás enfriar 1 hora y servís en vasitos.'),
  ('pudin-de-chia-y-frutilla', 'Pudín de chía y frutilla', 250, 1, '{merienda}', false, 'Mezclás la chía con la leche y la miel y la dejás en la heladera mínimo 4 horas.
Servís con las frutillas en láminas.'),
  ('pudin-de-chia-y-mango', 'Pudín de chía y mango', 250, 1, '{merienda}', false, 'Mezclás la chía con la leche y la miel y la dejás en la heladera mínimo 4 horas.
Servís con el mango en cubos.'),
  ('ensalada-de-frutas-con-menta', 'Ensalada de frutas con menta', 8, 1, '{merienda}', false, 'Cortás la fruta en cubitos.
Mezclás con el jugo de limón y la menta picada. Servís bien fría.'),
  ('flan-casero-liviano', 'Flan casero liviano', 55, 1, '{merienda}', false, 'Batís los huevos con el azúcar y la leche, y colás la mezcla.
Volcás en flaneras y cocinás a baño María en horno a 170 °C, 40 minutos.
Enfriás y servís con dulce de leche light.'),
  ('ricota-con-miel-y-canela', 'Ricota con miel y canela', 3, 1, '{merienda}', false, 'Servís la ricota en un bowl.
Sumás un hilo de miel, canela y las nueces picadas.'),
  ('arroz-con-leche-liviano', 'Arroz con leche liviano', 30, 1, '{merienda}', false, 'Hervís el arroz con la leche, el azúcar, una tira de cáscara de limón y canela, a fuego bajo, 25 minutos, revolviendo seguido.
Servís tibio o frío.'),
  ('gelatina-de-frutas-casera', 'Gelatina de frutas casera', 250, 1, '{merienda}', false, 'Hidratás la gelatina sin sabor y la disolvés en el jugo tibio.
Sumás la fruta picada y llevás a la heladera 4 horas.'),
  ('empanadas-de-atun-y-cebolla-al-horno', 'Empanadas de atún y cebolla al horno', 50, 1, '{almuerzo,cena}', true, 'Escurrís el atún y lo mezclás con la cebolla salteada y el tomate en cubitos.
Rellenás las tapas con una cucharada del relleno, cerrás con un repulgue o con un tenedor y las pincelás con huevo o aceite.
Las horneás en placa a 220 °C, 18–20 minutos, hasta que estén doradas.'),
  ('empanadas-de-verdura-y-queso-al-horno', 'Empanadas de verdura y queso al horno', 50, 1, '{almuerzo,cena}', true, 'Hervís la acelga, la escurrís y la picás; la mezclás con la cebolla salteada y el queso.
Rellenás las tapas con una cucharada del relleno, cerrás con un repulgue o con un tenedor y las pincelás con huevo o aceite.
Las horneás en placa a 220 °C, 18–20 minutos, hasta que estén doradas.'),
  ('empanadas-de-caprese-al-horno', 'Empanadas de caprese al horno', 50, 1, '{almuerzo,cena}', true, 'Cortás el tomate sin semillas y la muzzarella en cubitos y los mezclás con la albahaca picada y sal.
Rellenás las tapas con una cucharada del relleno, cerrás con un repulgue o con un tenedor y las pincelás con huevo o aceite.
Las horneás en placa a 220 °C, 18–20 minutos, hasta que estén doradas.'),
  ('empanadas-de-lentejas-y-verduras-al-horno', 'Empanadas de lentejas y verduras al horno', 50, 1, '{almuerzo,cena}', true, 'Mezclás las lentejas con la zanahoria rallada y la cebolla salteada; condimentás con comino y pimentón.
Rellenás las tapas con una cucharada del relleno, cerrás con un repulgue o con un tenedor y las pincelás con huevo o aceite.
Las horneás en placa a 220 °C, 18–20 minutos, hasta que estén doradas.'),
  ('empanadas-de-humita-al-horno', 'Empanadas de humita al horno', 50, 1, '{almuerzo,cena}', true, 'Salteás la cebolla y sumás el choclo cremoso, sal y pimentón; cocinás 5 minutos y mezclás con el queso.
Rellenás las tapas con una cucharada del relleno, cerrás con un repulgue o con un tenedor y las pincelás con huevo o aceite.
Las horneás en placa a 220 °C, 18–20 minutos, hasta que estén doradas.'),
  ('empanadas-de-pollo-y-morron-al-horno', 'Empanadas de pollo y morrón al horno', 50, 1, '{almuerzo,cena}', true, 'Salteás el morrón y la cebolla en tiras y los mezclás con el pollo; sazonás con pimentón.
Rellenás las tapas con una cucharada del relleno, cerrás con un repulgue o con un tenedor y las pincelás con huevo o aceite.
Las horneás en placa a 220 °C, 18–20 minutos, hasta que estén doradas.'),
  ('empanadas-de-cebolla-y-queso-al-horno', 'Empanadas de cebolla y queso al horno', 50, 1, '{almuerzo,cena}', true, 'Cocinás la cebolla en plumas a fuego bajo hasta que esté bien tierna (15 minutos) y la mezclás con el queso en cubitos.
Rellenás las tapas con una cucharada del relleno, cerrás con un repulgue o con un tenedor y las pincelás con huevo o aceite.
Las horneás en placa a 220 °C, 18–20 minutos, hasta que estén doradas.'),
  ('empanadas-de-espinaca-y-ricota-al-horno', 'Empanadas de espinaca y ricota al horno', 50, 1, '{almuerzo,cena}', true, 'Salteás la espinaca picada 2 minutos y la mezclás con la ricota, el queso rallado y nuez moscada.
Rellenás las tapas con una cucharada del relleno, cerrás con un repulgue o con un tenedor y las pincelás con huevo o aceite.
Las horneás en placa a 220 °C, 18–20 minutos, hasta que estén doradas.'),
  ('empanadas-de-pollo-y-verdeo-al-horno', 'Empanadas de pollo y verdeo al horno', 50, 1, '{almuerzo,cena}', true, 'Mezclás el pollo desmenuzado con la cebolla de verdeo salteada y el queso en cubitos; sazonás.
Rellenás las tapas con una cucharada del relleno, cerrás con un repulgue o con un tenedor y las pincelás con huevo o aceite.
Las horneás en placa a 220 °C, 18–20 minutos, hasta que estén doradas.'),
  ('empanadas-de-calabaza-y-queso-al-horno', 'Empanadas de calabaza y queso al horno', 50, 1, '{almuerzo,cena}', true, 'Hervís la calabaza y la pisás; la mezclás con la cebolla salteada y el queso.
Rellenás las tapas con una cucharada del relleno, cerrás con un repulgue o con un tenedor y las pincelás con huevo o aceite.
Las horneás en placa a 220 °C, 18–20 minutos, hasta que estén doradas.'),
  ('empanadas-de-jamon-y-queso-al-horno', 'Empanadas de jamón y queso al horno', 50, 1, '{almuerzo,cena}', true, 'Cortás el jamón y el queso en cubitos y los mezclás.
Rellenás las tapas con una cucharada del relleno, cerrás con un repulgue o con un tenedor y las pincelás con huevo o aceite.
Las horneás en placa a 220 °C, 18–20 minutos, hasta que estén doradas.')
on conflict (slug) do nothing;

insert into public.recipe_items (recipe_id, food_id, qty)
select r.id, f.id, v.qty from (values
  ('hongos-portobello-rellenos-de-arroz-y-atun', 'champinones', 250),
  ('hongos-portobello-rellenos-de-arroz-y-atun', 'arroz-hervido', 80),
  ('hongos-portobello-rellenos-de-arroz-y-atun', 'atun-natural', 1),
  ('hongos-portobello-rellenos-de-arroz-y-atun', 'tomate', 0.5),
  ('hongos-portobello-rellenos-de-arroz-y-atun', 'queso-rallado', 10),
  ('hongos-portobello-rellenos-de-arroz-y-atun', 'aceite', 4),
  ('calabacines-rellenos-de-garbanzos-y-verduras', 'zapallito', 2),
  ('calabacines-rellenos-de-garbanzos-y-verduras', 'garbanzos-hervidos', 100),
  ('calabacines-rellenos-de-garbanzos-y-verduras', 'zanahoria', 0.5),
  ('calabacines-rellenos-de-garbanzos-y-verduras', 'cebolla', 0.5),
  ('calabacines-rellenos-de-garbanzos-y-verduras', 'tomate-triturado', 40),
  ('calabacines-rellenos-de-garbanzos-y-verduras', 'queso-rallado', 10),
  ('calabacines-rellenos-de-garbanzos-y-verduras', 'aceite', 4),
  ('calabacines-rellenos-de-quinoa-y-verduras', 'zapallito', 2),
  ('calabacines-rellenos-de-quinoa-y-verduras', 'quinoa-hervida', 90),
  ('calabacines-rellenos-de-quinoa-y-verduras', 'zanahoria', 0.5),
  ('calabacines-rellenos-de-quinoa-y-verduras', 'choclo', 30),
  ('calabacines-rellenos-de-quinoa-y-verduras', 'queso-cremoso', 25),
  ('calabacines-rellenos-de-quinoa-y-verduras', 'queso-rallado', 10),
  ('calabacines-rellenos-de-quinoa-y-verduras', 'aceite', 4),
  ('berenjenas-rellenos-de-carne', 'berenjena', 1),
  ('berenjenas-rellenos-de-carne', 'carne-picada-magra', 120),
  ('berenjenas-rellenos-de-carne', 'cebolla', 0.5),
  ('berenjenas-rellenos-de-carne', 'queso-rallado', 20),
  ('berenjenas-rellenos-de-carne', 'aceite', 4),
  ('berenjenas-rellenos-de-arroz-y-atun', 'berenjena', 1),
  ('berenjenas-rellenos-de-arroz-y-atun', 'arroz-hervido', 80),
  ('berenjenas-rellenos-de-arroz-y-atun', 'atun-natural', 1),
  ('berenjenas-rellenos-de-arroz-y-atun', 'tomate', 0.5),
  ('berenjenas-rellenos-de-arroz-y-atun', 'queso-rallado', 10),
  ('berenjenas-rellenos-de-arroz-y-atun', 'aceite', 4),
  ('tomates-rellenos-de-champinones-y-queso', 'tomate', 2.5),
  ('tomates-rellenos-de-champinones-y-queso', 'champinones', 100),
  ('tomates-rellenos-de-champinones-y-queso', 'queso-cremoso', 40),
  ('tomates-rellenos-de-champinones-y-queso', 'cebolla', 0.5),
  ('tomates-rellenos-de-champinones-y-queso', 'aceite', 9),
  ('tomates-rellenos-de-champinones-y-queso', 'queso-rallado', 10),
  ('morrones-rellenos-de-pollo-y-queso', 'morron', 1.5),
  ('morrones-rellenos-de-pollo-y-queso', 'picada-pollo', 120),
  ('morrones-rellenos-de-pollo-y-queso', 'queso-cremoso', 30),
  ('morrones-rellenos-de-pollo-y-queso', 'cebolla', 0.5),
  ('morrones-rellenos-de-pollo-y-queso', 'queso-rallado', 10),
  ('morrones-rellenos-de-pollo-y-queso', 'aceite', 4),
  ('zapallitos-rellenos-de-pavo-y-verduras', 'zapallito', 2),
  ('zapallitos-rellenos-de-pavo-y-verduras', 'picada-pavo', 120),
  ('zapallitos-rellenos-de-pavo-y-verduras', 'zanahoria', 0.5),
  ('zapallitos-rellenos-de-pavo-y-verduras', 'cebolla', 0.5),
  ('zapallitos-rellenos-de-pavo-y-verduras', 'queso-rallado', 20),
  ('zapallitos-rellenos-de-pavo-y-verduras', 'aceite', 4),
  ('papas-rellenos-de-quinoa-y-verduras', 'papa', 250),
  ('papas-rellenos-de-quinoa-y-verduras', 'quinoa-hervida', 90),
  ('papas-rellenos-de-quinoa-y-verduras', 'zanahoria', 0.5),
  ('papas-rellenos-de-quinoa-y-verduras', 'choclo', 30),
  ('papas-rellenos-de-quinoa-y-verduras', 'queso-cremoso', 25),
  ('papas-rellenos-de-quinoa-y-verduras', 'queso-rallado', 10),
  ('papas-rellenos-de-quinoa-y-verduras', 'aceite', 4),
  ('morrones-rellenos-de-arroz-y-atun', 'morron', 1.5),
  ('morrones-rellenos-de-arroz-y-atun', 'arroz-hervido', 80),
  ('morrones-rellenos-de-arroz-y-atun', 'atun-natural', 1),
  ('morrones-rellenos-de-arroz-y-atun', 'tomate', 0.5),
  ('morrones-rellenos-de-arroz-y-atun', 'queso-rallado', 10),
  ('morrones-rellenos-de-arroz-y-atun', 'aceite', 4),
  ('morrones-rellenos-de-jamon-y-queso', 'morron', 1.5),
  ('morrones-rellenos-de-jamon-y-queso', 'jamon-cocido', 50),
  ('morrones-rellenos-de-jamon-y-queso', 'queso-cremoso', 50),
  ('morrones-rellenos-de-jamon-y-queso', 'salsa-blanca', 40),
  ('morrones-rellenos-de-jamon-y-queso', 'queso-rallado', 10),
  ('morrones-rellenos-de-jamon-y-queso', 'aceite', 4),
  ('zapallitos-rellenos-de-garbanzos-y-verduras', 'zapallito', 2),
  ('zapallitos-rellenos-de-garbanzos-y-verduras', 'garbanzos-hervidos', 100),
  ('zapallitos-rellenos-de-garbanzos-y-verduras', 'zanahoria', 0.5),
  ('zapallitos-rellenos-de-garbanzos-y-verduras', 'cebolla', 0.5),
  ('zapallitos-rellenos-de-garbanzos-y-verduras', 'tomate-triturado', 40),
  ('zapallitos-rellenos-de-garbanzos-y-verduras', 'queso-rallado', 10),
  ('zapallitos-rellenos-de-garbanzos-y-verduras', 'aceite', 4),
  ('berenjenas-rellenos-de-ricota-y-espinaca', 'berenjena', 1),
  ('berenjenas-rellenos-de-ricota-y-espinaca', 'ricota', 90),
  ('berenjenas-rellenos-de-ricota-y-espinaca', 'espinaca', 60),
  ('berenjenas-rellenos-de-ricota-y-espinaca', 'queso-rallado', 20),
  ('berenjenas-rellenos-de-ricota-y-espinaca', 'aceite', 4),
  ('hongos-portobello-rellenos-de-pavo-y-verduras', 'champinones', 250),
  ('hongos-portobello-rellenos-de-pavo-y-verduras', 'picada-pavo', 120),
  ('hongos-portobello-rellenos-de-pavo-y-verduras', 'zanahoria', 0.5),
  ('hongos-portobello-rellenos-de-pavo-y-verduras', 'cebolla', 0.5),
  ('hongos-portobello-rellenos-de-pavo-y-verduras', 'queso-rallado', 20),
  ('hongos-portobello-rellenos-de-pavo-y-verduras', 'aceite', 4),
  ('papas-rellenos-de-pollo-y-queso', 'papa', 250),
  ('papas-rellenos-de-pollo-y-queso', 'picada-pollo', 120),
  ('papas-rellenos-de-pollo-y-queso', 'queso-cremoso', 30),
  ('papas-rellenos-de-pollo-y-queso', 'cebolla', 0.5),
  ('papas-rellenos-de-pollo-y-queso', 'queso-rallado', 10),
  ('papas-rellenos-de-pollo-y-queso', 'aceite', 4),
  ('cebollas-rellenos-de-jamon-y-queso', 'cebolla', 2),
  ('cebollas-rellenos-de-jamon-y-queso', 'jamon-cocido', 50),
  ('cebollas-rellenos-de-jamon-y-queso', 'queso-cremoso', 50),
  ('cebollas-rellenos-de-jamon-y-queso', 'salsa-blanca', 40),
  ('cebollas-rellenos-de-jamon-y-queso', 'queso-rallado', 10),
  ('cebollas-rellenos-de-jamon-y-queso', 'aceite', 4),
  ('hongos-portobello-rellenos-de-lentejas', 'champinones', 250),
  ('hongos-portobello-rellenos-de-lentejas', 'lentejas-hervidas', 120),
  ('hongos-portobello-rellenos-de-lentejas', 'cebolla', 0.5),
  ('hongos-portobello-rellenos-de-lentejas', 'tomate-triturado', 40),
  ('hongos-portobello-rellenos-de-lentejas', 'queso-rallado', 20),
  ('hongos-portobello-rellenos-de-lentejas', 'aceite', 4),
  ('berenjenas-rellenos-de-pollo-y-queso', 'berenjena', 1),
  ('berenjenas-rellenos-de-pollo-y-queso', 'picada-pollo', 120),
  ('berenjenas-rellenos-de-pollo-y-queso', 'queso-cremoso', 30),
  ('berenjenas-rellenos-de-pollo-y-queso', 'cebolla', 0.5),
  ('berenjenas-rellenos-de-pollo-y-queso', 'queso-rallado', 10),
  ('berenjenas-rellenos-de-pollo-y-queso', 'aceite', 4),
  ('morrones-rellenos-de-garbanzos-y-verduras', 'morron', 1.5),
  ('morrones-rellenos-de-garbanzos-y-verduras', 'garbanzos-hervidos', 100),
  ('morrones-rellenos-de-garbanzos-y-verduras', 'zanahoria', 0.5),
  ('morrones-rellenos-de-garbanzos-y-verduras', 'cebolla', 0.5),
  ('morrones-rellenos-de-garbanzos-y-verduras', 'tomate-triturado', 40),
  ('morrones-rellenos-de-garbanzos-y-verduras', 'queso-rallado', 10),
  ('morrones-rellenos-de-garbanzos-y-verduras', 'aceite', 4),
  ('tomates-rellenos-de-garbanzos-y-verduras', 'tomate', 2.5),
  ('tomates-rellenos-de-garbanzos-y-verduras', 'garbanzos-hervidos', 100),
  ('tomates-rellenos-de-garbanzos-y-verduras', 'zanahoria', 0.5),
  ('tomates-rellenos-de-garbanzos-y-verduras', 'cebolla', 0.5),
  ('tomates-rellenos-de-garbanzos-y-verduras', 'tomate-triturado', 40),
  ('tomates-rellenos-de-garbanzos-y-verduras', 'queso-rallado', 10),
  ('tomates-rellenos-de-garbanzos-y-verduras', 'aceite', 4),
  ('tomates-rellenos-de-pollo-y-queso', 'tomate', 2.5),
  ('tomates-rellenos-de-pollo-y-queso', 'picada-pollo', 120),
  ('tomates-rellenos-de-pollo-y-queso', 'queso-cremoso', 30),
  ('tomates-rellenos-de-pollo-y-queso', 'cebolla', 0.5),
  ('tomates-rellenos-de-pollo-y-queso', 'queso-rallado', 10),
  ('tomates-rellenos-de-pollo-y-queso', 'aceite', 4),
  ('hongos-portobello-rellenos-de-champinones-y-queso', 'champinones', 350),
  ('hongos-portobello-rellenos-de-champinones-y-queso', 'queso-cremoso', 40),
  ('hongos-portobello-rellenos-de-champinones-y-queso', 'cebolla', 0.5),
  ('hongos-portobello-rellenos-de-champinones-y-queso', 'aceite', 9),
  ('hongos-portobello-rellenos-de-champinones-y-queso', 'queso-rallado', 10),
  ('calabacines-rellenos-de-ricota-y-espinaca', 'zapallito', 2),
  ('calabacines-rellenos-de-ricota-y-espinaca', 'ricota', 90),
  ('calabacines-rellenos-de-ricota-y-espinaca', 'espinaca', 60),
  ('calabacines-rellenos-de-ricota-y-espinaca', 'queso-rallado', 20),
  ('calabacines-rellenos-de-ricota-y-espinaca', 'aceite', 4),
  ('canelones-de-ricota-y-espinaca', 'tapas-canelones', 3),
  ('canelones-de-ricota-y-espinaca', 'ricota', 100),
  ('canelones-de-ricota-y-espinaca', 'espinaca', 60),
  ('canelones-de-ricota-y-espinaca', 'salsa-tomate', 100),
  ('canelones-de-ricota-y-espinaca', 'queso-rallado', 15),
  ('canelones-de-pollo-y-verduras', 'tapas-canelones', 3),
  ('canelones-de-pollo-y-verduras', 'picada-pollo', 100),
  ('canelones-de-pollo-y-verduras', 'zanahoria', 0.5),
  ('canelones-de-pollo-y-verduras', 'cebolla', 0.5),
  ('canelones-de-pollo-y-verduras', 'salsa-tomate', 100),
  ('canelones-de-pollo-y-verduras', 'queso-rallado', 15),
  ('lasana-de-verduras', 'tapas-lasana', 2),
  ('lasana-de-verduras', 'calabaza', 100),
  ('lasana-de-verduras', 'zapallito', 0.5),
  ('lasana-de-verduras', 'salsa-tomate', 100),
  ('lasana-de-verduras', 'muzzarella', 40),
  ('lasana-de-verduras', 'ricota-light', 50),
  ('lasana-de-carne', 'tapas-lasana', 2),
  ('lasana-de-carne', 'carne-picada-magra', 100),
  ('lasana-de-carne', 'salsa-tomate', 120),
  ('lasana-de-carne', 'muzzarella', 40),
  ('lasana-de-carne', 'salsa-blanca', 50),
  ('panqueques-de-verdura-y-ricota-gratinados', 'panqueque-simple', 2),
  ('panqueques-de-verdura-y-ricota-gratinados', 'ricota', 80),
  ('panqueques-de-verdura-y-ricota-gratinados', 'espinaca', 50),
  ('panqueques-de-verdura-y-ricota-gratinados', 'salsa-tomate', 80),
  ('panqueques-de-verdura-y-ricota-gratinados', 'queso-rallado', 15),
  ('bastones-de-zanahoria-con-hummus', 'zanahoria', 1.5),
  ('bastones-de-zanahoria-con-hummus', 'hummus', 50),
  ('bastones-de-pepino-con-tzatziki', 'pepino', 1),
  ('bastones-de-pepino-con-tzatziki', 'tzatziki', 60),
  ('manzana-con-mantequilla-de-mani', 'manzana', 1),
  ('manzana-con-mantequilla-de-mani', 'mani-pasta', 15),
  ('palta-rellena-con-atun', 'palta', 0.5),
  ('palta-rellena-con-atun', 'atun-natural', 0.5),
  ('palta-rellena-con-atun', 'limon-exprimido', 5),
  ('huevos-duros-con-tomate-cherry', 'huevo', 2),
  ('huevos-duros-con-tomate-cherry', 'tomate-cherry', 100),
  ('yogur-con-frutos-secos-y-miel', 'yogur-natural', 150),
  ('yogur-con-frutos-secos-y-miel', 'nueces', 10),
  ('yogur-con-frutos-secos-y-miel', 'miel', 8),
  ('tostada-de-arroz-con-ricota-y-tomate', 'galleta-arroz', 3),
  ('tostada-de-arroz-con-ricota-y-tomate', 'ricota', 60),
  ('tostada-de-arroz-con-ricota-y-tomate', 'tomate', 0.5),
  ('garbanzos-asados-crocantes', 'garbanzos-hervidos', 120),
  ('garbanzos-asados-crocantes', 'aceite', 5),
  ('chips-de-batata-al-horno', 'batata', 150),
  ('chips-de-batata-al-horno', 'aceite', 5),
  ('bolitas-de-datiles-y-avena', 'datiles', 40),
  ('bolitas-de-datiles-y-avena', 'avena', 25),
  ('bolitas-de-datiles-y-avena', 'cacao-amargo', 5),
  ('bolitas-de-datiles-y-avena', 'mani-pasta', 10),
  ('queso-con-membrillo-y-nueces', 'queso-port-salut', 40),
  ('queso-con-membrillo-y-nueces', 'dulce-membrillo', 30),
  ('queso-con-membrillo-y-nueces', 'nueces', 10),
  ('rollitos-de-jamon-y-queso', 'jamon-cocido', 50),
  ('rollitos-de-jamon-y-queso', 'queso-untable', 40),
  ('rollitos-de-jamon-y-queso', 'pepino', 0.5),
  ('ensalada-de-frutas-con-yogur', 'ensalada-frutas', 150),
  ('ensalada-de-frutas-con-yogur', 'yogur-natural', 80),
  ('ensalada-de-frutas-con-yogur', 'miel', 5),
  ('bruschettas-de-tomate-y-albahaca', 'pan-frances', 60),
  ('bruschettas-de-tomate-y-albahaca', 'tomate', 1),
  ('bruschettas-de-tomate-y-albahaca', 'albahaca', 3),
  ('bruschettas-de-tomate-y-albahaca', 'aceite-oliva', 6),
  ('budin-de-banana', 'banana', 5),
  ('budin-de-banana', 'avena', 150),
  ('budin-de-banana', 'huevo', 2.5),
  ('budin-de-banana', 'polvo-hornear', 8),
  ('budin-de-zanahoria', 'zanahoria', 4.5),
  ('budin-de-zanahoria', 'harina-integral', 150),
  ('budin-de-zanahoria', 'huevo', 5),
  ('budin-de-zanahoria', 'azucar-mascabo', 65),
  ('budin-de-zanahoria', 'aceite', 50),
  ('budin-de-zanahoria', 'polvo-hornear', 10),
  ('budin-de-manzana-y-canela', 'manzana', 3.5),
  ('budin-de-manzana-y-canela', 'avena', 150),
  ('budin-de-manzana-y-canela', 'huevo', 5),
  ('budin-de-manzana-y-canela', 'azucar-mascabo', 50),
  ('budin-de-manzana-y-canela', 'polvo-hornear', 10),
  ('budin-de-limon-y-yogur', 'yogur-natural', 375),
  ('budin-de-limon-y-yogur', 'harina', 250),
  ('budin-de-limon-y-yogur', 'huevo', 5),
  ('budin-de-limon-y-yogur', 'azucar-mascabo', 100),
  ('budin-de-limon-y-yogur', 'aceite', 75),
  ('budin-de-limon-y-yogur', 'polvo-hornear', 15),
  ('budin-de-limon-y-yogur', 'limon-exprimido', 50),
  ('budin-de-cacao-y-avena', 'avena', 200),
  ('budin-de-cacao-y-avena', 'cacao-amargo', 40),
  ('budin-de-cacao-y-avena', 'huevo', 5),
  ('budin-de-cacao-y-avena', 'banana', 2.5),
  ('budin-de-cacao-y-avena', 'leche', 250),
  ('budin-de-cacao-y-avena', 'polvo-hornear', 10),
  ('budin-de-calabaza', 'pure-calabaza', 500),
  ('budin-de-calabaza', 'harina-integral', 200),
  ('budin-de-calabaza', 'huevo', 5),
  ('budin-de-calabaza', 'azucar-mascabo', 75),
  ('budin-de-calabaza', 'aceite', 50),
  ('budin-de-calabaza', 'polvo-hornear', 10),
  ('manzanas-asadas-con-canela-y-nueces', 'manzana', 1),
  ('manzanas-asadas-con-canela-y-nueces', 'nueces', 10),
  ('manzanas-asadas-con-canela-y-nueces', 'miel', 8),
  ('peras-al-horno-con-yogur', 'pera', 1),
  ('peras-al-horno-con-yogur', 'yogur-natural', 100),
  ('peras-al-horno-con-yogur', 'miel', 8),
  ('helado-casero-de-banana', 'banana-congelada', 180),
  ('helado-casero-de-frutilla', 'frutilla-congelada', 150),
  ('helado-casero-de-frutilla', 'yogur-natural', 60),
  ('mousse-de-chocolate-y-palta', 'palta', 0.5),
  ('mousse-de-chocolate-y-palta', 'cacao-amargo', 15),
  ('mousse-de-chocolate-y-palta', 'miel', 20),
  ('mousse-de-chocolate-y-palta', 'leche', 40),
  ('pudin-de-chia-y-frutilla', 'chia', 25),
  ('pudin-de-chia-y-frutilla', 'leche', 180),
  ('pudin-de-chia-y-frutilla', 'frutilla', 80),
  ('pudin-de-chia-y-frutilla', 'miel', 8),
  ('pudin-de-chia-y-mango', 'chia', 25),
  ('pudin-de-chia-y-mango', 'leche', 180),
  ('pudin-de-chia-y-mango', 'mango', 80),
  ('pudin-de-chia-y-mango', 'miel', 8),
  ('ensalada-de-frutas-con-menta', 'ensalada-frutas', 200),
  ('ensalada-de-frutas-con-menta', 'menta', 2),
  ('ensalada-de-frutas-con-menta', 'limon-exprimido', 8),
  ('flan-casero-liviano', 'huevo', 2),
  ('flan-casero-liviano', 'leche', 200),
  ('flan-casero-liviano', 'azucar', 20),
  ('flan-casero-liviano', 'dulce-leche-light', 15),
  ('ricota-con-miel-y-canela', 'ricota', 100),
  ('ricota-con-miel-y-canela', 'miel', 10),
  ('ricota-con-miel-y-canela', 'nueces', 8),
  ('arroz-con-leche-liviano', 'arroz', 40),
  ('arroz-con-leche-liviano', 'leche', 250),
  ('arroz-con-leche-liviano', 'azucar', 15),
  ('gelatina-de-frutas-casera', 'gelatina-sin-sabor', 6),
  ('gelatina-de-frutas-casera', 'jugo-naranja', 180),
  ('gelatina-de-frutas-casera', 'frutilla', 60),
  ('empanadas-de-atun-y-cebolla-al-horno', 'tapa-empanada', 3),
  ('empanadas-de-atun-y-cebolla-al-horno', 'atun-natural', 1),
  ('empanadas-de-atun-y-cebolla-al-horno', 'cebolla', 0.5),
  ('empanadas-de-atun-y-cebolla-al-horno', 'tomate', 0.5),
  ('empanadas-de-atun-y-cebolla-al-horno', 'aceite', 3),
  ('empanadas-de-verdura-y-queso-al-horno', 'tapa-empanada', 3),
  ('empanadas-de-verdura-y-queso-al-horno', 'acelga', 70),
  ('empanadas-de-verdura-y-queso-al-horno', 'cebolla', 0.5),
  ('empanadas-de-verdura-y-queso-al-horno', 'queso-cremoso', 40),
  ('empanadas-de-verdura-y-queso-al-horno', 'aceite', 3),
  ('empanadas-de-caprese-al-horno', 'tapa-empanada', 3),
  ('empanadas-de-caprese-al-horno', 'tomate', 0.5),
  ('empanadas-de-caprese-al-horno', 'muzzarella', 50),
  ('empanadas-de-caprese-al-horno', 'albahaca', 2),
  ('empanadas-de-caprese-al-horno', 'aceite', 3),
  ('empanadas-de-lentejas-y-verduras-al-horno', 'tapa-empanada', 3),
  ('empanadas-de-lentejas-y-verduras-al-horno', 'lentejas-hervidas', 100),
  ('empanadas-de-lentejas-y-verduras-al-horno', 'zanahoria', 0.5),
  ('empanadas-de-lentejas-y-verduras-al-horno', 'cebolla', 0.5),
  ('empanadas-de-lentejas-y-verduras-al-horno', 'aceite', 3),
  ('empanadas-de-humita-al-horno', 'tapa-empanada', 3),
  ('empanadas-de-humita-al-horno', 'choclo-cremoso', 100),
  ('empanadas-de-humita-al-horno', 'cebolla', 0.5),
  ('empanadas-de-humita-al-horno', 'queso-cremoso', 25),
  ('empanadas-de-humita-al-horno', 'aceite', 3),
  ('empanadas-de-pollo-y-morron-al-horno', 'tapa-empanada', 3),
  ('empanadas-de-pollo-y-morron-al-horno', 'pollo-desmenuzado', 80),
  ('empanadas-de-pollo-y-morron-al-horno', 'morron', 0.5),
  ('empanadas-de-pollo-y-morron-al-horno', 'cebolla', 0.5),
  ('empanadas-de-pollo-y-morron-al-horno', 'aceite', 3),
  ('empanadas-de-cebolla-y-queso-al-horno', 'tapa-empanada', 3),
  ('empanadas-de-cebolla-y-queso-al-horno', 'cebolla', 1),
  ('empanadas-de-cebolla-y-queso-al-horno', 'queso-cremoso', 50),
  ('empanadas-de-cebolla-y-queso-al-horno', 'aceite', 3),
  ('empanadas-de-espinaca-y-ricota-al-horno', 'tapa-empanada', 3),
  ('empanadas-de-espinaca-y-ricota-al-horno', 'espinaca', 70),
  ('empanadas-de-espinaca-y-ricota-al-horno', 'ricota', 60),
  ('empanadas-de-espinaca-y-ricota-al-horno', 'queso-rallado', 10),
  ('empanadas-de-espinaca-y-ricota-al-horno', 'aceite', 3),
  ('empanadas-de-pollo-y-verdeo-al-horno', 'tapa-empanada', 3),
  ('empanadas-de-pollo-y-verdeo-al-horno', 'pollo-desmenuzado', 90),
  ('empanadas-de-pollo-y-verdeo-al-horno', 'cebolla-verdeo', 30),
  ('empanadas-de-pollo-y-verdeo-al-horno', 'queso-cremoso', 25),
  ('empanadas-de-pollo-y-verdeo-al-horno', 'aceite', 3),
  ('empanadas-de-calabaza-y-queso-al-horno', 'tapa-empanada', 3),
  ('empanadas-de-calabaza-y-queso-al-horno', 'calabaza', 120),
  ('empanadas-de-calabaza-y-queso-al-horno', 'queso-cremoso', 40),
  ('empanadas-de-calabaza-y-queso-al-horno', 'cebolla', 0.5),
  ('empanadas-de-calabaza-y-queso-al-horno', 'aceite', 3),
  ('empanadas-de-jamon-y-queso-al-horno', 'tapa-empanada', 3),
  ('empanadas-de-jamon-y-queso-al-horno', 'jamon-cocido', 50),
  ('empanadas-de-jamon-y-queso-al-horno', 'queso-cremoso', 50),
  ('empanadas-de-jamon-y-queso-al-horno', 'aceite', 3)
) as v(recipe_slug, food_slug, qty)
join public.recipes r on r.slug = v.recipe_slug
join public.foods f on f.slug = v.food_slug
on conflict do nothing;
