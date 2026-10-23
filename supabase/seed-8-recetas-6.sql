-- Sexta tanda de la base (1.25): recetas, parte 6 de 8. Después de seed-8-alimentos.sql. Se puede correr de nuevo: agrega solo lo que falta. Generado con scripts/gen-seed.mjs

insert into public.recipes (slug, name, minutes, servings, meal_types, portable, steps) values
  ('bocaditos-de-brocoli-y-queso-con-ensalada', 'Bocaditos de brócoli y queso con ensalada', 40, 1, '{almuerzo,cena}', true, 'Hervís el brócoli 4 minutos y lo picás fino. Lo mezclás con el queso en cubitos, el huevo, la avena, sal y nuez moscada.
Armás bocaditos y los horneás en placa aceitada 20 minutos a 200 °C, dándolos vuelta a la mitad.
Servís con ensalada de lechuga y tomate.'),
  ('croquetas-de-papa-y-atun-con-ensalada', 'Croquetas de papa y atún con ensalada', 40, 1, '{almuerzo,cena}', true, 'Pisás la papa hervida y la mezclás con el atún escurrido, el huevo, perejil, sal y pimienta.
Armás croquetas, las pasás por pan rallado y las horneás en placa aceitada 20 minutos a 200 °C.
Servís con ensalada de lechuga y tomate.'),
  ('hamburguesa-vegetal-con-ensalada-y-papas', 'Hamburguesa vegetal con ensalada y papas', 40, 1, '{almuerzo,cena}', true, 'Cortás las papas en gajos, las mezclás con una parte del aceite y sal y las horneás 35 minutos a 220 °C.
Cocinás la hamburguesa vegetal en plancha con una gota de aceite, 4 minutos por lado.
Servís con ensalada de lechuga y tomate aderezada con el resto del aceite.'),
  ('wrap-de-lomito-de-cerdo-rucula-y-mostaza', 'Wrap de lomito de cerdo, rúcula y mostaza', 17, 1, '{almuerzo,cena,merienda}', true, 'Cocinás el lomo en rodajas finas en plancha caliente 2 minutos por lado, con sal y pimienta.
Calentás el wrap 20 segundos en una sartén seca para que se doble sin romperse.
Ponés el relleno en el centro, doblás los costados y enrollás bien apretado. Cortás al medio.'),
  ('pan-arabe-de-garbanzos-aplastados-y-palta', 'Pan árabe de garbanzos aplastados y palta', 9, 1, '{almuerzo,cena,merienda}', true, 'Aplastás los garbanzos con la palta, sal, limón y comino; cortás el tomate en rodajas.
Abrís el pan árabe a la mitad y lo calentás 30 segundos.
Armás con todos los ingredientes, apretás suave y cortás al medio.'),
  ('sandwich-de-pavo-mostaza-y-pepinillos-en-pan-de-centeno', 'Sándwich de pavo, mostaza y pepinillos en pan de centeno', 8, 1, '{almuerzo,cena,merienda}', true, 'Cortás el pavo cocido en fetas finas y los pepinillos en rodajas.
Tostás el pan 2 minutos para que quede firme y no se humedezca.
Armás con todos los ingredientes, apretás suave y cortás al medio.'),
  ('bagel-de-jamon-queso-y-tomate', 'Bagel de jamón, queso y tomate', 8, 1, '{almuerzo,cena,merienda}', true, 'Cortás el tomate en rodajas y armás en capas con el jamón y el queso.
Tostás el pan 2 minutos para que quede firme y no se humedezca.
Armás con todos los ingredientes, apretás suave y cortás al medio.'),
  ('wrap-de-pavita-queso-untable-y-rucula', 'Wrap de pavita, queso untable y rúcula', 8, 1, '{almuerzo,cena,merienda}', true, 'Untás el pan con el queso y armás con la pavita, la rúcula y el tomate.
Calentás el wrap 20 segundos en una sartén seca para que se doble sin romperse.
Ponés el relleno en el centro, doblás los costados y enrollás bien apretado. Cortás al medio.'),
  ('pan-arabe-de-caprese-tomate-muzzarella-y-pesto', 'Pan árabe de caprese: tomate, muzzarella y pesto', 8, 1, '{almuerzo,cena,merienda}', true, 'Cortás el tomate y la muzzarella en rodajas y las alternás con el pesto.
Abrís el pan árabe a la mitad y lo calentás 30 segundos.
Armás con todos los ingredientes, apretás suave y cortás al medio.'),
  ('pan-arabe-de-queso-de-cabra-remolacha-y-rucula', 'Pan árabe de queso de cabra, remolacha y rúcula', 9, 1, '{almuerzo,cena,merienda}', true, 'Rallás la remolacha cocida, desmenuzás el queso de cabra y picás las nueces.
Abrís el pan árabe a la mitad y lo calentás 30 segundos.
Armás con todos los ingredientes, apretás suave y cortás al medio.'),
  ('bagel-de-queso-crema-salmon-ahumado-y-pepino', 'Bagel de queso crema, salmón ahumado y pepino', 9, 1, '{almuerzo,cena,merienda}', true, 'Cortás el pepino en rodajas finas y la cebolla morada en aros.
Tostás el pan 2 minutos para que quede firme y no se humedezca.
Armás con todos los ingredientes, apretás suave y cortás al medio.'),
  ('pan-arabe-de-pavita-queso-untable-y-rucula', 'Pan árabe de pavita, queso untable y rúcula', 8, 1, '{almuerzo,cena,merienda}', true, 'Untás el pan con el queso y armás con la pavita, la rúcula y el tomate.
Abrís el pan árabe a la mitad y lo calentás 30 segundos.
Armás con todos los ingredientes, apretás suave y cortás al medio.'),
  ('wrap-de-huevo-revuelto-tomate-y-queso', 'Wrap de huevo revuelto, tomate y queso', 11, 1, '{almuerzo,cena,merienda}', true, 'Revolvés los huevos con sal en una sartén con el aceite, 2 minutos, y sumás el queso en cubitos al final.
Calentás el wrap 20 segundos en una sartén seca para que se doble sin romperse.
Ponés el relleno en el centro, doblás los costados y enrollás bien apretado. Cortás al medio.'),
  ('ciabatta-de-garbanzos-aplastados-y-palta', 'Ciabatta de garbanzos aplastados y palta', 9, 1, '{almuerzo,cena,merienda}', true, 'Aplastás los garbanzos con la palta, sal, limón y comino; cortás el tomate en rodajas.
Tostás el pan 2 minutos para que quede firme y no se humedezca.
Armás con todos los ingredientes, apretás suave y cortás al medio.'),
  ('sandwich-de-ricota-tomate-y-albahaca-en-pan-con-semillas', 'Sándwich de ricota, tomate y albahaca en pan con semillas', 8, 1, '{almuerzo,cena,merienda}', true, 'Mezclás la ricota con sal, pimienta y un chorrito de aceite; cortás el tomate en rodajas.
Tostás el pan 2 minutos para que quede firme y no se humedezca.
Armás con todos los ingredientes, apretás suave y cortás al medio.'),
  ('wrap-de-pavo-mostaza-y-pepinillos', 'Wrap de pavo, mostaza y pepinillos', 8, 1, '{almuerzo,cena,merienda}', true, 'Cortás el pavo cocido en fetas finas y los pepinillos en rodajas.
Calentás el wrap 20 segundos en una sartén seca para que se doble sin romperse.
Ponés el relleno en el centro, doblás los costados y enrollás bien apretado. Cortás al medio.'),
  ('ciabatta-de-pechuga-grillada-palta-y-cherry', 'Ciabatta de pechuga grillada, palta y cherry', 17, 1, '{almuerzo,cena,merienda}', true, 'Grillás la pechuga en fetas finas con sal y pimienta (3 minutos por lado) y cortás los cherry al medio.
Tostás el pan 2 minutos para que quede firme y no se humedezca.
Armás con todos los ingredientes, apretás suave y cortás al medio.'),
  ('bagel-de-ricota-tomate-y-albahaca', 'Bagel de ricota, tomate y albahaca', 8, 1, '{almuerzo,cena,merienda}', true, 'Mezclás la ricota con sal, pimienta y un chorrito de aceite; cortás el tomate en rodajas.
Tostás el pan 2 minutos para que quede firme y no se humedezca.
Armás con todos los ingredientes, apretás suave y cortás al medio.'),
  ('wrap-de-queso-de-cabra-remolacha-y-rucula', 'Wrap de queso de cabra, remolacha y rúcula', 9, 1, '{almuerzo,cena,merienda}', true, 'Rallás la remolacha cocida, desmenuzás el queso de cabra y picás las nueces.
Calentás el wrap 20 segundos en una sartén seca para que se doble sin romperse.
Ponés el relleno en el centro, doblás los costados y enrollás bien apretado. Cortás al medio.'),
  ('pan-arabe-de-atun-tomate-y-lechuga', 'Pan árabe de atún, tomate y lechuga', 9, 1, '{almuerzo,cena,merienda}', true, 'Escurrís el atún y lo mezclás con la mayonesa light; cortás el tomate en rodajas.
Abrís el pan árabe a la mitad y lo calentás 30 segundos.
Armás con todos los ingredientes, apretás suave y cortás al medio.'),
  ('sandwich-de-huevo-palta-y-rucula-en-pan-con-semillas', 'Sándwich de huevo, palta y rúcula en pan con semillas', 17, 1, '{almuerzo,cena,merienda}', true, 'Hacés los huevos duros (9 minutos), los pelás y los aplastás; pisás la palta con sal y limón.
Tostás el pan 2 minutos para que quede firme y no se humedezca.
Armás con todos los ingredientes, apretás suave y cortás al medio.'),
  ('sandwich-de-pechuga-grillada-palta-y-cherry-en-pan-de', 'Sándwich de pechuga grillada, palta y cherry en pan de centeno', 17, 1, '{almuerzo,cena,merienda}', true, 'Grillás la pechuga en fetas finas con sal y pimienta (3 minutos por lado) y cortás los cherry al medio.
Tostás el pan 2 minutos para que quede firme y no se humedezca.
Armás con todos los ingredientes, apretás suave y cortás al medio.'),
  ('sandwich-de-berenjena-asada-muzzarella-y-albahaca-en', 'Sándwich de berenjena asada, muzzarella y albahaca en pan con semillas', 18, 1, '{almuerzo,cena,merienda}', true, 'Cortás la berenjena en rodajas, las pincelás con aceite y las dorás en plancha 3 minutos por lado; sumás la muzzarella para que se derrita.
Tostás el pan 2 minutos para que quede firme y no se humedezca.
Armás con todos los ingredientes, apretás suave y cortás al medio.'),
  ('sandwich-de-carne-cebolla-caramelizada-y-queso-en-pan', 'Sándwich de carne, cebolla caramelizada y queso en pan de centeno', 13, 1, '{almuerzo,cena,merienda}', true, 'Cortás el peceto cocido en fetas finas y lo calentás 1 minuto en la plancha con la cebolla.
Tostás el pan 2 minutos para que quede firme y no se humedezca.
Armás con todos los ingredientes, apretás suave y cortás al medio.'),
  ('sandwich-de-milanesa-de-soja-lechuga-y-tomate-en-pan', 'Sándwich de milanesa de soja, lechuga y tomate en pan con semillas', 19, 1, '{almuerzo,cena,merienda}', true, 'Calentás la milanesa en horno a 200 °C, 12 minutos, y cortás el tomate en rodajas.
Tostás el pan 2 minutos para que quede firme y no se humedezca.
Armás con todos los ingredientes, apretás suave y cortás al medio.'),
  ('sandwich-de-caprese-tomate-muzzarella-y-pesto-en-pan-de', 'Sándwich de caprese: tomate, muzzarella y pesto en pan de centeno', 8, 1, '{almuerzo,cena,merienda}', true, 'Cortás el tomate y la muzzarella en rodajas y las alternás con el pesto.
Tostás el pan 2 minutos para que quede firme y no se humedezca.
Armás con todos los ingredientes, apretás suave y cortás al medio.'),
  ('ciabatta-de-huevo-palta-y-rucula', 'Ciabatta de huevo, palta y rúcula', 17, 1, '{almuerzo,cena,merienda}', true, 'Hacés los huevos duros (9 minutos), los pelás y los aplastás; pisás la palta con sal y limón.
Tostás el pan 2 minutos para que quede firme y no se humedezca.
Armás con todos los ingredientes, apretás suave y cortás al medio.'),
  ('sandwich-de-hummus-zanahoria-y-pepino-en-pan-integral', 'Sándwich de hummus, zanahoria y pepino en pan integral', 9, 1, '{almuerzo,cena,merienda}', true, 'Rallás la zanahoria y cortás el pepino en bastones.
Tostás el pan 2 minutos para que quede firme y no se humedezca.
Armás con todos los ingredientes, apretás suave y cortás al medio.'),
  ('wrap-de-tofu-zanahoria-y-brotes', 'Wrap de tofu, zanahoria y brotes', 18, 1, '{almuerzo,cena,merienda}', true, 'Marinás el tofu en tiras con la salsa de soja 5 minutos y lo dorás en sartén 3 minutos por lado; rallás la zanahoria.
Calentás el wrap 20 segundos en una sartén seca para que se doble sin romperse.
Ponés el relleno en el centro, doblás los costados y enrollás bien apretado. Cortás al medio.'),
  ('ciabatta-de-huevo-revuelto-tomate-y-queso', 'Ciabatta de huevo revuelto, tomate y queso', 11, 1, '{almuerzo,cena,merienda}', true, 'Revolvés los huevos con sal en una sartén con el aceite, 2 minutos, y sumás el queso en cubitos al final.
Tostás el pan 2 minutos para que quede firme y no se humedezca.
Armás con todos los ingredientes, apretás suave y cortás al medio.'),
  ('pan-arabe-de-sardinas-tomate-y-cebolla-morada', 'Pan árabe de sardinas, tomate y cebolla morada', 9, 1, '{almuerzo,cena,merienda}', true, 'Escurrís las sardinas y las aplastás apenas con limón; cortás el tomate y la cebolla finos.
Abrís el pan árabe a la mitad y lo calentás 30 segundos.
Armás con todos los ingredientes, apretás suave y cortás al medio.'),
  ('pan-arabe-de-pechuga-grillada-palta-y-cherry', 'Pan árabe de pechuga grillada, palta y cherry', 17, 1, '{almuerzo,cena,merienda}', true, 'Grillás la pechuga en fetas finas con sal y pimienta (3 minutos por lado) y cortás los cherry al medio.
Abrís el pan árabe a la mitad y lo calentás 30 segundos.
Armás con todos los ingredientes, apretás suave y cortás al medio.'),
  ('bagel-de-caprese-tomate-muzzarella-y-pesto', 'Bagel de caprese: tomate, muzzarella y pesto', 8, 1, '{almuerzo,cena,merienda}', true, 'Cortás el tomate y la muzzarella en rodajas y las alternás con el pesto.
Tostás el pan 2 minutos para que quede firme y no se humedezca.
Armás con todos los ingredientes, apretás suave y cortás al medio.'),
  ('sandwich-de-jamon-queso-y-tomate-en-pan-integral', 'Sándwich de jamón, queso y tomate en pan integral', 8, 1, '{almuerzo,cena,merienda}', true, 'Cortás el tomate en rodajas y armás en capas con el jamón y el queso.
Tostás el pan 2 minutos para que quede firme y no se humedezca.
Armás con todos los ingredientes, apretás suave y cortás al medio.'),
  ('ciabatta-de-pavo-mostaza-y-pepinillos', 'Ciabatta de pavo, mostaza y pepinillos', 8, 1, '{almuerzo,cena,merienda}', true, 'Cortás el pavo cocido en fetas finas y los pepinillos en rodajas.
Tostás el pan 2 minutos para que quede firme y no se humedezca.
Armás con todos los ingredientes, apretás suave y cortás al medio.'),
  ('ciabatta-de-tofu-zanahoria-y-brotes', 'Ciabatta de tofu, zanahoria y brotes', 18, 1, '{almuerzo,cena,merienda}', true, 'Marinás el tofu en tiras con la salsa de soja 5 minutos y lo dorás en sartén 3 minutos por lado; rallás la zanahoria.
Tostás el pan 2 minutos para que quede firme y no se humedezca.
Armás con todos los ingredientes, apretás suave y cortás al medio.'),
  ('sandwich-de-huevo-palta-y-rucula-en-pan-de-centeno', 'Sándwich de huevo, palta y rúcula en pan de centeno', 17, 1, '{almuerzo,cena,merienda}', true, 'Hacés los huevos duros (9 minutos), los pelás y los aplastás; pisás la palta con sal y limón.
Tostás el pan 2 minutos para que quede firme y no se humedezca.
Armás con todos los ingredientes, apretás suave y cortás al medio.'),
  ('ciabatta-de-queso-de-cabra-remolacha-y-rucula', 'Ciabatta de queso de cabra, remolacha y rúcula', 9, 1, '{almuerzo,cena,merienda}', true, 'Rallás la remolacha cocida, desmenuzás el queso de cabra y picás las nueces.
Tostás el pan 2 minutos para que quede firme y no se humedezca.
Armás con todos los ingredientes, apretás suave y cortás al medio.'),
  ('sandwich-de-milanesa-de-soja-lechuga-y-tomate-en-pan-de', 'Sándwich de milanesa de soja, lechuga y tomate en pan de centeno', 19, 1, '{almuerzo,cena,merienda}', true, 'Calentás la milanesa en horno a 200 °C, 12 minutos, y cortás el tomate en rodajas.
Tostás el pan 2 minutos para que quede firme y no se humedezca.
Armás con todos los ingredientes, apretás suave y cortás al medio.'),
  ('sandwich-de-queso-crema-salmon-ahumado-y-pepino-en-pan', 'Sándwich de queso crema, salmón ahumado y pepino en pan con semillas', 9, 1, '{almuerzo,cena,merienda}', true, 'Cortás el pepino en rodajas finas y la cebolla morada en aros.
Tostás el pan 2 minutos para que quede firme y no se humedezca.
Armás con todos los ingredientes, apretás suave y cortás al medio.'),
  ('wrap-de-ricota-tomate-y-albahaca', 'Wrap de ricota, tomate y albahaca', 8, 1, '{almuerzo,cena,merienda}', true, 'Mezclás la ricota con sal, pimienta y un chorrito de aceite; cortás el tomate en rodajas.
Calentás el wrap 20 segundos en una sartén seca para que se doble sin romperse.
Ponés el relleno en el centro, doblás los costados y enrollás bien apretado. Cortás al medio.'),
  ('ciabatta-de-pavita-queso-untable-y-rucula', 'Ciabatta de pavita, queso untable y rúcula', 8, 1, '{almuerzo,cena,merienda}', true, 'Untás el pan con el queso y armás con la pavita, la rúcula y el tomate.
Tostás el pan 2 minutos para que quede firme y no se humedezca.
Armás con todos los ingredientes, apretás suave y cortás al medio.'),
  ('ciabatta-de-pollo-palta-y-tomate', 'Ciabatta de pollo, palta y tomate', 11, 1, '{almuerzo,cena,merienda}', true, 'Desmenuzás el pollo, pisás la palta con sal y limón y cortás el tomate en rodajas.
Tostás el pan 2 minutos para que quede firme y no se humedezca.
Armás con todos los ingredientes, apretás suave y cortás al medio.'),
  ('sandwich-de-milanesa-de-soja-lechuga-y-tomate-en-pan-2', 'Sándwich de milanesa de soja, lechuga y tomate en pan integral', 19, 1, '{almuerzo,cena,merienda}', true, 'Calentás la milanesa en horno a 200 °C, 12 minutos, y cortás el tomate en rodajas.
Tostás el pan 2 minutos para que quede firme y no se humedezca.
Armás con todos los ingredientes, apretás suave y cortás al medio.'),
  ('sandwich-de-pechuga-grillada-palta-y-cherry-en-pan-con', 'Sándwich de pechuga grillada, palta y cherry en pan con semillas', 17, 1, '{almuerzo,cena,merienda}', true, 'Grillás la pechuga en fetas finas con sal y pimienta (3 minutos por lado) y cortás los cherry al medio.
Tostás el pan 2 minutos para que quede firme y no se humedezca.
Armás con todos los ingredientes, apretás suave y cortás al medio.'),
  ('wrap-de-hummus-zanahoria-y-pepino', 'Wrap de hummus, zanahoria y pepino', 9, 1, '{almuerzo,cena,merienda}', true, 'Rallás la zanahoria y cortás el pepino en bastones.
Calentás el wrap 20 segundos en una sartén seca para que se doble sin romperse.
Ponés el relleno en el centro, doblás los costados y enrollás bien apretado. Cortás al medio.'),
  ('wrap-de-queso-crema-salmon-ahumado-y-pepino', 'Wrap de queso crema, salmón ahumado y pepino', 9, 1, '{almuerzo,cena,merienda}', true, 'Cortás el pepino en rodajas finas y la cebolla morada en aros.
Calentás el wrap 20 segundos en una sartén seca para que se doble sin romperse.
Ponés el relleno en el centro, doblás los costados y enrollás bien apretado. Cortás al medio.'),
  ('sandwich-de-huevo-revuelto-tomate-y-queso-en-pan-de', 'Sándwich de huevo revuelto, tomate y queso en pan de centeno', 11, 1, '{almuerzo,cena,merienda}', true, 'Revolvés los huevos con sal en una sartén con el aceite, 2 minutos, y sumás el queso en cubitos al final.
Tostás el pan 2 minutos para que quede firme y no se humedezca.
Armás con todos los ingredientes, apretás suave y cortás al medio.'),
  ('sandwich-de-queso-crema-salmon-ahumado-y-pepino-en-pan-2', 'Sándwich de queso crema, salmón ahumado y pepino en pan integral', 9, 1, '{almuerzo,cena,merienda}', true, 'Cortás el pepino en rodajas finas y la cebolla morada en aros.
Tostás el pan 2 minutos para que quede firme y no se humedezca.
Armás con todos los ingredientes, apretás suave y cortás al medio.'),
  ('sandwich-de-ricota-tomate-y-albahaca-en-pan-de-centeno', 'Sándwich de ricota, tomate y albahaca en pan de centeno', 8, 1, '{almuerzo,cena,merienda}', true, 'Mezclás la ricota con sal, pimienta y un chorrito de aceite; cortás el tomate en rodajas.
Tostás el pan 2 minutos para que quede firme y no se humedezca.
Armás con todos los ingredientes, apretás suave y cortás al medio.'),
  ('sandwich-de-berenjena-asada-muzzarella-y-albahaca-en-2', 'Sándwich de berenjena asada, muzzarella y albahaca en pan de centeno', 18, 1, '{almuerzo,cena,merienda}', true, 'Cortás la berenjena en rodajas, las pincelás con aceite y las dorás en plancha 3 minutos por lado; sumás la muzzarella para que se derrita.
Tostás el pan 2 minutos para que quede firme y no se humedezca.
Armás con todos los ingredientes, apretás suave y cortás al medio.'),
  ('ciabatta-de-lomito-de-cerdo-rucula-y-mostaza', 'Ciabatta de lomito de cerdo, rúcula y mostaza', 17, 1, '{almuerzo,cena,merienda}', true, 'Cocinás el lomo en rodajas finas en plancha caliente 2 minutos por lado, con sal y pimienta.
Tostás el pan 2 minutos para que quede firme y no se humedezca.
Armás con todos los ingredientes, apretás suave y cortás al medio.'),
  ('sandwich-de-pavo-mostaza-y-pepinillos-en-pan-integral', 'Sándwich de pavo, mostaza y pepinillos en pan integral', 8, 1, '{almuerzo,cena,merienda}', true, 'Cortás el pavo cocido en fetas finas y los pepinillos en rodajas.
Tostás el pan 2 minutos para que quede firme y no se humedezca.
Armás con todos los ingredientes, apretás suave y cortás al medio.'),
  ('sandwich-de-pollo-palta-y-tomate-en-pan-de-centeno', 'Sándwich de pollo, palta y tomate en pan de centeno', 11, 1, '{almuerzo,cena,merienda}', true, 'Desmenuzás el pollo, pisás la palta con sal y limón y cortás el tomate en rodajas.
Tostás el pan 2 minutos para que quede firme y no se humedezca.
Armás con todos los ingredientes, apretás suave y cortás al medio.'),
  ('sandwich-de-pechuga-grillada-palta-y-cherry-en-pan', 'Sándwich de pechuga grillada, palta y cherry en pan integral', 17, 1, '{almuerzo,cena,merienda}', true, 'Grillás la pechuga en fetas finas con sal y pimienta (3 minutos por lado) y cortás los cherry al medio.
Tostás el pan 2 minutos para que quede firme y no se humedezca.
Armás con todos los ingredientes, apretás suave y cortás al medio.'),
  ('sandwich-de-ricota-tomate-y-albahaca-en-pan-integral', 'Sándwich de ricota, tomate y albahaca en pan integral', 8, 1, '{almuerzo,cena,merienda}', true, 'Mezclás la ricota con sal, pimienta y un chorrito de aceite; cortás el tomate en rodajas.
Tostás el pan 2 minutos para que quede firme y no se humedezca.
Armás con todos los ingredientes, apretás suave y cortás al medio.'),
  ('sandwich-de-queso-de-cabra-remolacha-y-rucula-en-pan', 'Sándwich de queso de cabra, remolacha y rúcula en pan con semillas', 9, 1, '{almuerzo,cena,merienda}', true, 'Rallás la remolacha cocida, desmenuzás el queso de cabra y picás las nueces.
Tostás el pan 2 minutos para que quede firme y no se humedezca.
Armás con todos los ingredientes, apretás suave y cortás al medio.'),
  ('sandwich-de-huevo-revuelto-tomate-y-queso-en-pan-con', 'Sándwich de huevo revuelto, tomate y queso en pan con semillas', 11, 1, '{almuerzo,cena,merienda}', true, 'Revolvés los huevos con sal en una sartén con el aceite, 2 minutos, y sumás el queso en cubitos al final.
Tostás el pan 2 minutos para que quede firme y no se humedezca.
Armás con todos los ingredientes, apretás suave y cortás al medio.'),
  ('pan-arabe-de-carne-cebolla-caramelizada-y-queso', 'Pan árabe de carne, cebolla caramelizada y queso', 13, 1, '{almuerzo,cena,merienda}', true, 'Cortás el peceto cocido en fetas finas y lo calentás 1 minuto en la plancha con la cebolla.
Abrís el pan árabe a la mitad y lo calentás 30 segundos.
Armás con todos los ingredientes, apretás suave y cortás al medio.'),
  ('sandwich-de-carne-cebolla-caramelizada-y-queso-en-pan-2', 'Sándwich de carne, cebolla caramelizada y queso en pan con semillas', 13, 1, '{almuerzo,cena,merienda}', true, 'Cortás el peceto cocido en fetas finas y lo calentás 1 minuto en la plancha con la cebolla.
Tostás el pan 2 minutos para que quede firme y no se humedezca.
Armás con todos los ingredientes, apretás suave y cortás al medio.'),
  ('sandwich-de-caprese-tomate-muzzarella-y-pesto-en-pan', 'Sándwich de caprese: tomate, muzzarella y pesto en pan con semillas', 8, 1, '{almuerzo,cena,merienda}', true, 'Cortás el tomate y la muzzarella en rodajas y las alternás con el pesto.
Tostás el pan 2 minutos para que quede firme y no se humedezca.
Armás con todos los ingredientes, apretás suave y cortás al medio.'),
  ('pan-arabe-de-lomito-de-cerdo-rucula-y-mostaza', 'Pan árabe de lomito de cerdo, rúcula y mostaza', 17, 1, '{almuerzo,cena,merienda}', true, 'Cocinás el lomo en rodajas finas en plancha caliente 2 minutos por lado, con sal y pimienta.
Abrís el pan árabe a la mitad y lo calentás 30 segundos.
Armás con todos los ingredientes, apretás suave y cortás al medio.'),
  ('sandwich-de-pavita-queso-untable-y-rucula-en-pan-con', 'Sándwich de pavita, queso untable y rúcula en pan con semillas', 8, 1, '{almuerzo,cena,merienda}', true, 'Untás el pan con el queso y armás con la pavita, la rúcula y el tomate.
Tostás el pan 2 minutos para que quede firme y no se humedezca.
Armás con todos los ingredientes, apretás suave y cortás al medio.'),
  ('ciabatta-de-atun-tomate-y-lechuga', 'Ciabatta de atún, tomate y lechuga', 9, 1, '{almuerzo,cena,merienda}', true, 'Escurrís el atún y lo mezclás con la mayonesa light; cortás el tomate en rodajas.
Tostás el pan 2 minutos para que quede firme y no se humedezca.
Armás con todos los ingredientes, apretás suave y cortás al medio.'),
  ('ciabatta-de-ricota-tomate-y-albahaca', 'Ciabatta de ricota, tomate y albahaca', 8, 1, '{almuerzo,cena,merienda}', true, 'Mezclás la ricota con sal, pimienta y un chorrito de aceite; cortás el tomate en rodajas.
Tostás el pan 2 minutos para que quede firme y no se humedezca.
Armás con todos los ingredientes, apretás suave y cortás al medio.'),
  ('sandwich-de-tofu-zanahoria-y-brotes-en-pan-integral', 'Sándwich de tofu, zanahoria y brotes en pan integral', 18, 1, '{almuerzo,cena,merienda}', true, 'Marinás el tofu en tiras con la salsa de soja 5 minutos y lo dorás en sartén 3 minutos por lado; rallás la zanahoria.
Tostás el pan 2 minutos para que quede firme y no se humedezca.
Armás con todos los ingredientes, apretás suave y cortás al medio.'),
  ('sandwich-de-pavita-queso-untable-y-rucula-en-pan', 'Sándwich de pavita, queso untable y rúcula en pan integral', 8, 1, '{almuerzo,cena,merienda}', true, 'Untás el pan con el queso y armás con la pavita, la rúcula y el tomate.
Tostás el pan 2 minutos para que quede firme y no se humedezca.
Armás con todos los ingredientes, apretás suave y cortás al medio.'),
  ('bagel-de-milanesa-de-soja-lechuga-y-tomate', 'Bagel de milanesa de soja, lechuga y tomate', 19, 1, '{almuerzo,cena,merienda}', true, 'Calentás la milanesa en horno a 200 °C, 12 minutos, y cortás el tomate en rodajas.
Tostás el pan 2 minutos para que quede firme y no se humedezca.
Armás con todos los ingredientes, apretás suave y cortás al medio.'),
  ('wrap-de-berenjena-asada-muzzarella-y-albahaca', 'Wrap de berenjena asada, muzzarella y albahaca', 18, 1, '{almuerzo,cena,merienda}', true, 'Cortás la berenjena en rodajas, las pincelás con aceite y las dorás en plancha 3 minutos por lado; sumás la muzzarella para que se derrita.
Calentás el wrap 20 segundos en una sartén seca para que se doble sin romperse.
Ponés el relleno en el centro, doblás los costados y enrollás bien apretado. Cortás al medio.'),
  ('pan-arabe-de-queso-crema-salmon-ahumado-y-pepino', 'Pan árabe de queso crema, salmón ahumado y pepino', 9, 1, '{almuerzo,cena,merienda}', true, 'Cortás el pepino en rodajas finas y la cebolla morada en aros.
Abrís el pan árabe a la mitad y lo calentás 30 segundos.
Armás con todos los ingredientes, apretás suave y cortás al medio.'),
  ('pan-arabe-de-ricota-tomate-y-albahaca', 'Pan árabe de ricota, tomate y albahaca', 8, 1, '{almuerzo,cena,merienda}', true, 'Mezclás la ricota con sal, pimienta y un chorrito de aceite; cortás el tomate en rodajas.
Abrís el pan árabe a la mitad y lo calentás 30 segundos.
Armás con todos los ingredientes, apretás suave y cortás al medio.'),
  ('bagel-de-pollo-palta-y-tomate', 'Bagel de pollo, palta y tomate', 11, 1, '{almuerzo,cena,merienda}', true, 'Desmenuzás el pollo, pisás la palta con sal y limón y cortás el tomate en rodajas.
Tostás el pan 2 minutos para que quede firme y no se humedezca.
Armás con todos los ingredientes, apretás suave y cortás al medio.'),
  ('wrap-de-caprese-tomate-muzzarella-y-pesto', 'Wrap de caprese: tomate, muzzarella y pesto', 8, 1, '{almuerzo,cena,merienda}', true, 'Cortás el tomate y la muzzarella en rodajas y las alternás con el pesto.
Calentás el wrap 20 segundos en una sartén seca para que se doble sin romperse.
Ponés el relleno en el centro, doblás los costados y enrollás bien apretado. Cortás al medio.'),
  ('bagel-de-garbanzos-aplastados-y-palta', 'Bagel de garbanzos aplastados y palta', 9, 1, '{almuerzo,cena,merienda}', true, 'Aplastás los garbanzos con la palta, sal, limón y comino; cortás el tomate en rodajas.
Tostás el pan 2 minutos para que quede firme y no se humedezca.
Armás con todos los ingredientes, apretás suave y cortás al medio.'),
  ('ciabatta-de-sardinas-tomate-y-cebolla-morada', 'Ciabatta de sardinas, tomate y cebolla morada', 9, 1, '{almuerzo,cena,merienda}', true, 'Escurrís las sardinas y las aplastás apenas con limón; cortás el tomate y la cebolla finos.
Tostás el pan 2 minutos para que quede firme y no se humedezca.
Armás con todos los ingredientes, apretás suave y cortás al medio.'),
  ('pan-arabe-de-jamon-queso-y-tomate', 'Pan árabe de jamón, queso y tomate', 8, 1, '{almuerzo,cena,merienda}', true, 'Cortás el tomate en rodajas y armás en capas con el jamón y el queso.
Abrís el pan árabe a la mitad y lo calentás 30 segundos.
Armás con todos los ingredientes, apretás suave y cortás al medio.'),
  ('wrap-de-huevo-palta-y-rucula', 'Wrap de huevo, palta y rúcula', 17, 1, '{almuerzo,cena,merienda}', true, 'Hacés los huevos duros (9 minutos), los pelás y los aplastás; pisás la palta con sal y limón.
Calentás el wrap 20 segundos en una sartén seca para que se doble sin romperse.
Ponés el relleno en el centro, doblás los costados y enrollás bien apretado. Cortás al medio.'),
  ('bagel-de-queso-de-cabra-remolacha-y-rucula', 'Bagel de queso de cabra, remolacha y rúcula', 9, 1, '{almuerzo,cena,merienda}', true, 'Rallás la remolacha cocida, desmenuzás el queso de cabra y picás las nueces.
Tostás el pan 2 minutos para que quede firme y no se humedezca.
Armás con todos los ingredientes, apretás suave y cortás al medio.'),
  ('sandwich-de-pavita-queso-untable-y-rucula-en-pan-de', 'Sándwich de pavita, queso untable y rúcula en pan de centeno', 8, 1, '{almuerzo,cena,merienda}', true, 'Untás el pan con el queso y armás con la pavita, la rúcula y el tomate.
Tostás el pan 2 minutos para que quede firme y no se humedezca.
Armás con todos los ingredientes, apretás suave y cortás al medio.'),
  ('ciabatta-de-berenjena-asada-muzzarella-y-albahaca', 'Ciabatta de berenjena asada, muzzarella y albahaca', 18, 1, '{almuerzo,cena,merienda}', true, 'Cortás la berenjena en rodajas, las pincelás con aceite y las dorás en plancha 3 minutos por lado; sumás la muzzarella para que se derrita.
Tostás el pan 2 minutos para que quede firme y no se humedezca.
Armás con todos los ingredientes, apretás suave y cortás al medio.'),
  ('wrap-de-jamon-queso-y-tomate', 'Wrap de jamón, queso y tomate', 8, 1, '{almuerzo,cena,merienda}', true, 'Cortás el tomate en rodajas y armás en capas con el jamón y el queso.
Calentás el wrap 20 segundos en una sartén seca para que se doble sin romperse.
Ponés el relleno en el centro, doblás los costados y enrollás bien apretado. Cortás al medio.'),
  ('sandwich-de-huevo-revuelto-tomate-y-queso-en-pan', 'Sándwich de huevo revuelto, tomate y queso en pan integral', 11, 1, '{almuerzo,cena,merienda}', true, 'Revolvés los huevos con sal en una sartén con el aceite, 2 minutos, y sumás el queso en cubitos al final.
Tostás el pan 2 minutos para que quede firme y no se humedezca.
Armás con todos los ingredientes, apretás suave y cortás al medio.'),
  ('wrap-de-milanesa-de-soja-lechuga-y-tomate', 'Wrap de milanesa de soja, lechuga y tomate', 19, 1, '{almuerzo,cena,merienda}', true, 'Calentás la milanesa en horno a 200 °C, 12 minutos, y cortás el tomate en rodajas.
Calentás el wrap 20 segundos en una sartén seca para que se doble sin romperse.
Ponés el relleno en el centro, doblás los costados y enrollás bien apretado. Cortás al medio.'),
  ('sandwich-de-queso-de-cabra-remolacha-y-rucula-en-pan-2', 'Sándwich de queso de cabra, remolacha y rúcula en pan integral', 9, 1, '{almuerzo,cena,merienda}', true, 'Rallás la remolacha cocida, desmenuzás el queso de cabra y picás las nueces.
Tostás el pan 2 minutos para que quede firme y no se humedezca.
Armás con todos los ingredientes, apretás suave y cortás al medio.'),
  ('wrap-de-pollo-palta-y-tomate', 'Wrap de pollo, palta y tomate', 11, 1, '{almuerzo,cena,merienda}', true, 'Desmenuzás el pollo, pisás la palta con sal y limón y cortás el tomate en rodajas.
Calentás el wrap 20 segundos en una sartén seca para que se doble sin romperse.
Ponés el relleno en el centro, doblás los costados y enrollás bien apretado. Cortás al medio.'),
  ('pan-arabe-de-berenjena-asada-muzzarella-y-albahaca', 'Pan árabe de berenjena asada, muzzarella y albahaca', 18, 1, '{almuerzo,cena,merienda}', true, 'Cortás la berenjena en rodajas, las pincelás con aceite y las dorás en plancha 3 minutos por lado; sumás la muzzarella para que se derrita.
Abrís el pan árabe a la mitad y lo calentás 30 segundos.
Armás con todos los ingredientes, apretás suave y cortás al medio.'),
  ('ciabatta-de-milanesa-de-soja-lechuga-y-tomate', 'Ciabatta de milanesa de soja, lechuga y tomate', 19, 1, '{almuerzo,cena,merienda}', true, 'Calentás la milanesa en horno a 200 °C, 12 minutos, y cortás el tomate en rodajas.
Tostás el pan 2 minutos para que quede firme y no se humedezca.
Armás con todos los ingredientes, apretás suave y cortás al medio.'),
  ('sandwich-de-garbanzos-aplastados-y-palta-en-pan-de', 'Sándwich de garbanzos aplastados y palta en pan de centeno', 9, 1, '{almuerzo,cena,merienda}', true, 'Aplastás los garbanzos con la palta, sal, limón y comino; cortás el tomate en rodajas.
Tostás el pan 2 minutos para que quede firme y no se humedezca.
Armás con todos los ingredientes, apretás suave y cortás al medio.'),
  ('sandwich-de-pollo-palta-y-tomate-en-pan-integral', 'Sándwich de pollo, palta y tomate en pan integral', 11, 1, '{almuerzo,cena,merienda}', true, 'Desmenuzás el pollo, pisás la palta con sal y limón y cortás el tomate en rodajas.
Tostás el pan 2 minutos para que quede firme y no se humedezca.
Armás con todos los ingredientes, apretás suave y cortás al medio.'),
  ('sandwich-de-berenjena-asada-muzzarella-y-albahaca-en-3', 'Sándwich de berenjena asada, muzzarella y albahaca en pan integral', 18, 1, '{almuerzo,cena,merienda}', true, 'Cortás la berenjena en rodajas, las pincelás con aceite y las dorás en plancha 3 minutos por lado; sumás la muzzarella para que se derrita.
Tostás el pan 2 minutos para que quede firme y no se humedezca.
Armás con todos los ingredientes, apretás suave y cortás al medio.'),
  ('ciabatta-de-queso-crema-salmon-ahumado-y-pepino', 'Ciabatta de queso crema, salmón ahumado y pepino', 9, 1, '{almuerzo,cena,merienda}', true, 'Cortás el pepino en rodajas finas y la cebolla morada en aros.
Tostás el pan 2 minutos para que quede firme y no se humedezca.
Armás con todos los ingredientes, apretás suave y cortás al medio.'),
  ('sandwich-de-lomito-de-cerdo-rucula-y-mostaza-en-pan-de', 'Sándwich de lomito de cerdo, rúcula y mostaza en pan de centeno', 17, 1, '{almuerzo,cena,merienda}', true, 'Cocinás el lomo en rodajas finas en plancha caliente 2 minutos por lado, con sal y pimienta.
Tostás el pan 2 minutos para que quede firme y no se humedezca.
Armás con todos los ingredientes, apretás suave y cortás al medio.'),
  ('wrap-de-atun-tomate-y-lechuga', 'Wrap de atún, tomate y lechuga', 9, 1, '{almuerzo,cena,merienda}', true, 'Escurrís el atún y lo mezclás con la mayonesa light; cortás el tomate en rodajas.
Calentás el wrap 20 segundos en una sartén seca para que se doble sin romperse.
Ponés el relleno en el centro, doblás los costados y enrollás bien apretado. Cortás al medio.'),
  ('tostadas-de-tostadas-integrales-con-huevo-revuelto-y', 'Tostadas de tostadas integrales con huevo revuelto y espinaca', 7, 1, '{desayuno,almuerzo}', false, 'Salteás la espinaca con el aceite 1 minuto, sumás los huevos batidos y revolvés 2 minutos.
Tostás el pan hasta que esté crocante y armás las tostadas con todo lo anterior. Servís enseguida.'),
  ('tostadas-de-tostadas-integrales-con-atun-y-palta', 'Tostadas de tostadas integrales con atún y palta', 5, 1, '{almuerzo,cena}', false, 'Escurrís el atún y lo mezclás con la palta pisada, limón, sal y pimienta.
Tostás el pan hasta que esté crocante y armás las tostadas con todo lo anterior. Servís enseguida.'),
  ('tostadas-de-tostadas-integrales-con-queso-untable-y', 'Tostadas de tostadas integrales con queso untable y tomate', 4, 1, '{desayuno,merienda}', false, 'Untás el queso y cubrís con rodajas de tomate, sal, aceite de oliva y albahaca.
Tostás el pan hasta que esté crocante y armás las tostadas con todo lo anterior. Servís enseguida.'),
  ('tostadas-de-tostadas-integrales-con-mantequilla-de-mani', 'Tostadas de tostadas integrales con mantequilla de maní y banana', 3, 1, '{desayuno,merienda}', false, 'Untás la pasta de maní y sumás la banana en rodajas.
Tostás el pan hasta que esté crocante y armás las tostadas con todo lo anterior. Servís enseguida.'),
  ('tostadas-de-pan-con-semillas-con-hummus-tomate-y', 'Tostadas de pan con semillas con hummus, tomate y semillas', 4, 1, '{desayuno,merienda}', false, 'Untás el hummus, sumás el tomate en rodajas y las semillas.
Tostás el pan hasta que esté crocante y armás las tostadas con todo lo anterior. Servís enseguida.'),
  ('tostadas-de-pan-integral-con-salmon-ahumado-y-queso', 'Tostadas de pan integral con salmón ahumado y queso crema', 5, 1, '{desayuno,almuerzo}', false, 'Untás el queso crema, sumás el salmón y el pepino en rodajas finas y la cebolla de verdeo picada.
Tostás el pan hasta que esté crocante y armás las tostadas con todo lo anterior. Servís enseguida.'),
  ('tostadas-de-pan-de-centeno-con-ricota-y-mermelada-de', 'Tostadas de pan de centeno con ricota y mermelada de frutilla', 4, 1, '{desayuno,merienda}', false, 'Untás la ricota, sumás las frutillas en láminas y la mermelada.
Tostás el pan hasta que esté crocante y armás las tostadas con todo lo anterior. Servís enseguida.'),
  ('tostadas-de-pan-de-centeno-con-salmon-ahumado-y-queso', 'Tostadas de pan de centeno con salmón ahumado y queso crema', 5, 1, '{desayuno,almuerzo}', false, 'Untás el queso crema, sumás el salmón y el pepino en rodajas finas y la cebolla de verdeo picada.
Tostás el pan hasta que esté crocante y armás las tostadas con todo lo anterior. Servís enseguida.'),
  ('tostadas-de-pan-de-centeno-con-palta-y-huevo-poche', 'Tostadas de pan de centeno con palta y huevo poché', 10, 1, '{desayuno,almuerzo}', false, 'Pisás la palta con sal, limón y pimienta. Hacés el huevo poché 3 minutos en agua con un chorrito de vinagre, apenas hirviendo.
Tostás el pan hasta que esté crocante y armás las tostadas con todo lo anterior. Servís enseguida.'),
  ('tostadas-de-tostadas-integrales-con-ricota-y-mermelada', 'Tostadas de tostadas integrales con ricota y mermelada de frutilla', 4, 1, '{desayuno,merienda}', false, 'Untás la ricota, sumás las frutillas en láminas y la mermelada.
Tostás el pan hasta que esté crocante y armás las tostadas con todo lo anterior. Servís enseguida.'),
  ('tostadas-de-pan-de-centeno-con-hummus-tomate-y-semillas', 'Tostadas de pan de centeno con hummus, tomate y semillas', 4, 1, '{desayuno,merienda}', false, 'Untás el hummus, sumás el tomate en rodajas y las semillas.
Tostás el pan hasta que esté crocante y armás las tostadas con todo lo anterior. Servís enseguida.'),
  ('tostadas-de-pan-de-centeno-con-tomate-asado-ricota-y', 'Tostadas de pan de centeno con tomate asado, ricota y albahaca', 12, 1, '{almuerzo,cena}', false, 'Asás el tomate en rodajas 8 minutos a 200 °C y lo apoyás sobre la ricota con la albahaca y el aceite de oliva.
Tostás el pan hasta que esté crocante y armás las tostadas con todo lo anterior. Servís enseguida.'),
  ('tostadas-de-tostadas-integrales-con-tomate-asado-ricota', 'Tostadas de tostadas integrales con tomate asado, ricota y albahaca', 12, 1, '{almuerzo,cena}', false, 'Asás el tomate en rodajas 8 minutos a 200 °C y lo apoyás sobre la ricota con la albahaca y el aceite de oliva.
Tostás el pan hasta que esté crocante y armás las tostadas con todo lo anterior. Servís enseguida.'),
  ('tostadas-de-pan-integral-con-queso-untable-y-tomate', 'Tostadas de pan integral con queso untable y tomate', 4, 1, '{desayuno,merienda}', false, 'Untás el queso y cubrís con rodajas de tomate, sal, aceite de oliva y albahaca.
Tostás el pan hasta que esté crocante y armás las tostadas con todo lo anterior. Servís enseguida.'),
  ('tostadas-de-pan-con-semillas-con-palta-y-huevo-poche', 'Tostadas de pan con semillas con palta y huevo poché', 10, 1, '{desayuno,almuerzo}', false, 'Pisás la palta con sal, limón y pimienta. Hacés el huevo poché 3 minutos en agua con un chorrito de vinagre, apenas hirviendo.
Tostás el pan hasta que esté crocante y armás las tostadas con todo lo anterior. Servís enseguida.'),
  ('tostadas-de-pan-con-semillas-con-ricota-y-mermelada-de', 'Tostadas de pan con semillas con ricota y mermelada de frutilla', 4, 1, '{desayuno,merienda}', false, 'Untás la ricota, sumás las frutillas en láminas y la mermelada.
Tostás el pan hasta que esté crocante y armás las tostadas con todo lo anterior. Servís enseguida.'),
  ('tostadas-de-pan-de-centeno-con-mantequilla-de-mani-y', 'Tostadas de pan de centeno con mantequilla de maní y banana', 3, 1, '{desayuno,merienda}', false, 'Untás la pasta de maní y sumás la banana en rodajas.
Tostás el pan hasta que esté crocante y armás las tostadas con todo lo anterior. Servís enseguida.'),
  ('tostadas-de-pan-de-centeno-con-champinones-y-queso', 'Tostadas de pan de centeno con champiñones y queso', 12, 1, '{desayuno,almuerzo}', false, 'Salteás los champiñones laminados con el aceite 6 minutos y los apoyás sobre la tostada con el queso en lonjas; gratinás 2 minutos.
Tostás el pan hasta que esté crocante y armás las tostadas con todo lo anterior. Servís enseguida.'),
  ('tostadas-de-pan-integral-con-champinones-y-queso', 'Tostadas de pan integral con champiñones y queso', 12, 1, '{desayuno,almuerzo}', false, 'Salteás los champiñones laminados con el aceite 6 minutos y los apoyás sobre la tostada con el queso en lonjas; gratinás 2 minutos.
Tostás el pan hasta que esté crocante y armás las tostadas con todo lo anterior. Servís enseguida.'),
  ('tostadas-de-tostadas-integrales-con-palta-y-huevo-poche', 'Tostadas de tostadas integrales con palta y huevo poché', 10, 1, '{desayuno,almuerzo}', false, 'Pisás la palta con sal, limón y pimienta. Hacés el huevo poché 3 minutos en agua con un chorrito de vinagre, apenas hirviendo.
Tostás el pan hasta que esté crocante y armás las tostadas con todo lo anterior. Servís enseguida.'),
  ('tostadas-de-pan-con-semillas-con-champinones-y-queso', 'Tostadas de pan con semillas con champiñones y queso', 12, 1, '{desayuno,almuerzo}', false, 'Salteás los champiñones laminados con el aceite 6 minutos y los apoyás sobre la tostada con el queso en lonjas; gratinás 2 minutos.
Tostás el pan hasta que esté crocante y armás las tostadas con todo lo anterior. Servís enseguida.'),
  ('tostadas-de-pan-de-centeno-con-queso-untable-y-tomate', 'Tostadas de pan de centeno con queso untable y tomate', 4, 1, '{desayuno,merienda}', false, 'Untás el queso y cubrís con rodajas de tomate, sal, aceite de oliva y albahaca.
Tostás el pan hasta que esté crocante y armás las tostadas con todo lo anterior. Servís enseguida.'),
  ('tostadas-de-pan-con-semillas-con-banana-avena-y-canela', 'Tostadas de pan con semillas con banana, avena y canela', 4, 1, '{desayuno,merienda}', false, 'Aplastás la banana, la untás y cubrís con yogur, avena y canela.
Tostás el pan hasta que esté crocante y armás las tostadas con todo lo anterior. Servís enseguida.'),
  ('tostadas-de-pan-de-centeno-con-ricota-miel-y-nueces', 'Tostadas de pan de centeno con ricota, miel y nueces', 4, 1, '{desayuno,merienda}', false, 'Untás la ricota y terminás con un hilo de miel y las nueces picadas.
Tostás el pan hasta que esté crocante y armás las tostadas con todo lo anterior. Servís enseguida.'),
  ('tostadas-de-pan-con-semillas-con-huevo-revuelto-y', 'Tostadas de pan con semillas con huevo revuelto y espinaca', 7, 1, '{desayuno,almuerzo}', false, 'Salteás la espinaca con el aceite 1 minuto, sumás los huevos batidos y revolvés 2 minutos.
Tostás el pan hasta que esté crocante y armás las tostadas con todo lo anterior. Servís enseguida.'),
  ('tostadas-de-tostadas-integrales-con-banana-avena-y', 'Tostadas de tostadas integrales con banana, avena y canela', 4, 1, '{desayuno,merienda}', false, 'Aplastás la banana, la untás y cubrís con yogur, avena y canela.
Tostás el pan hasta que esté crocante y armás las tostadas con todo lo anterior. Servís enseguida.'),
  ('tostadas-de-pan-integral-con-atun-y-palta', 'Tostadas de pan integral con atún y palta', 5, 1, '{almuerzo,cena}', false, 'Escurrís el atún y lo mezclás con la palta pisada, limón, sal y pimienta.
Tostás el pan hasta que esté crocante y armás las tostadas con todo lo anterior. Servís enseguida.'),
  ('tostadas-de-pan-con-semillas-con-salmon-ahumado-y-queso', 'Tostadas de pan con semillas con salmón ahumado y queso crema', 5, 1, '{desayuno,almuerzo}', false, 'Untás el queso crema, sumás el salmón y el pepino en rodajas finas y la cebolla de verdeo picada.
Tostás el pan hasta que esté crocante y armás las tostadas con todo lo anterior. Servís enseguida.'),
  ('tostadas-de-pan-de-centeno-con-atun-y-palta', 'Tostadas de pan de centeno con atún y palta', 5, 1, '{almuerzo,cena}', false, 'Escurrís el atún y lo mezclás con la palta pisada, limón, sal y pimienta.
Tostás el pan hasta que esté crocante y armás las tostadas con todo lo anterior. Servís enseguida.'),
  ('tostadas-de-tostadas-integrales-con-hummus-tomate-y', 'Tostadas de tostadas integrales con hummus, tomate y semillas', 4, 1, '{desayuno,merienda}', false, 'Untás el hummus, sumás el tomate en rodajas y las semillas.
Tostás el pan hasta que esté crocante y armás las tostadas con todo lo anterior. Servís enseguida.'),
  ('tostadas-de-pan-integral-con-hummus-tomate-y-semillas', 'Tostadas de pan integral con hummus, tomate y semillas', 4, 1, '{desayuno,merienda}', false, 'Untás el hummus, sumás el tomate en rodajas y las semillas.
Tostás el pan hasta que esté crocante y armás las tostadas con todo lo anterior. Servís enseguida.'),
  ('tostadas-de-tostadas-integrales-con-ricota-miel-y-nueces', 'Tostadas de tostadas integrales con ricota, miel y nueces', 4, 1, '{desayuno,merienda}', false, 'Untás la ricota y terminás con un hilo de miel y las nueces picadas.
Tostás el pan hasta que esté crocante y armás las tostadas con todo lo anterior. Servís enseguida.'),
  ('tostadas-de-pan-integral-con-palta-y-huevo-poche', 'Tostadas de pan integral con palta y huevo poché', 10, 1, '{desayuno,almuerzo}', false, 'Pisás la palta con sal, limón y pimienta. Hacés el huevo poché 3 minutos en agua con un chorrito de vinagre, apenas hirviendo.
Tostás el pan hasta que esté crocante y armás las tostadas con todo lo anterior. Servís enseguida.'),
  ('tostadas-de-pan-integral-con-ricota-y-mermelada-de', 'Tostadas de pan integral con ricota y mermelada de frutilla', 4, 1, '{desayuno,merienda}', false, 'Untás la ricota, sumás las frutillas en láminas y la mermelada.
Tostás el pan hasta que esté crocante y armás las tostadas con todo lo anterior. Servís enseguida.'),
  ('tostadas-de-tostadas-integrales-con-salmon-ahumado-y', 'Tostadas de tostadas integrales con salmón ahumado y queso crema', 5, 1, '{desayuno,almuerzo}', false, 'Untás el queso crema, sumás el salmón y el pepino en rodajas finas y la cebolla de verdeo picada.
Tostás el pan hasta que esté crocante y armás las tostadas con todo lo anterior. Servís enseguida.'),
  ('tostadas-de-pan-integral-con-banana-avena-y-canela', 'Tostadas de pan integral con banana, avena y canela', 4, 1, '{desayuno,merienda}', false, 'Aplastás la banana, la untás y cubrís con yogur, avena y canela.
Tostás el pan hasta que esté crocante y armás las tostadas con todo lo anterior. Servís enseguida.'),
  ('bowl-de-burgol-pollo-y-kale-mango-y-cebolla-morada', 'Bowl de burgol, pollo y kale, mango y cebolla morada', 24, 1, '{almuerzo,cena}', true, 'Hidratás el burgol con agua caliente (1 a 1,5), lo tapás 15 minutos y lo desgranás.
Cocinás la pechuga en plancha con sal y pimienta, 5 minutos por lado, y la cortás en tiras.
Masajeás el kale con una pizca de sal y aceite 1 minuto, cortás el mango en cubos y la cebolla en aros.
Mezclás el yogur con la menta picada, el limón y sal.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-burgol-langostinos-y-hojas-verdes-manzana-y-apio', 'Bowl de burgol, langostinos y hojas verdes, manzana y apio', 20, 1, '{almuerzo,cena}', true, 'Hidratás el burgol con agua caliente (1 a 1,5), lo tapás 15 minutos y lo desgranás.
Salteás los langostinos pelados con el ajo y el aceite 2 minutos por lado.
Cortás la manzana y el apio en bastones finos y los mezclás con las hojas.
Aderezás con el pesto, aflojado con una cucharada de agua tibia.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-fideos-de-arroz-tempeh-y-kale-mango-y-cebolla', 'Bowl de fideos de arroz, tempeh y kale, mango y cebolla morada', 24, 1, '{almuerzo,cena}', true, 'Hervís los fideos de arroz 4 minutos, los enjuagás con agua fría y los escurrís.
Cortás el tempeh en láminas, lo marinás con la soja y lo dorás en sartén 3 minutos por lado.
Masajeás el kale con una pizca de sal y aceite 1 minuto, cortás el mango en cubos y la cebolla en aros.
Aderezás con el pesto, aflojado con una cucharada de agua tibia.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-cuscus-huevo-y-kale-mango-y-cebolla-morada', 'Bowl de cuscús, huevo y kale, mango y cebolla morada', 22, 1, '{almuerzo,cena}', true, 'Hidratás el cuscús con agua caliente (1 a 1), lo tapás 5 minutos y lo desgranás con un tenedor.
Hacés los huevos duros (9 minutos), los pelás y los cortás al medio.
Masajeás el kale con una pizca de sal y aceite 1 minuto, cortás el mango en cubos y la cebolla en aros.
Servís con una cucharada de guacamole.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-burgol-salmon-y-palta-pepino-y-zanahoria', 'Bowl de burgol, salmón y palta, pepino y zanahoria', 22, 1, '{almuerzo,cena}', true, 'Hidratás el burgol con agua caliente (1 a 1,5), lo tapás 15 minutos y lo desgranás.
Cocinás el salmón en la plancha 4 minutos por lado con sal y limón, y lo desmenuzás en lascas.
Cortás la palta y el pepino en láminas; rallás la zanahoria.
Aderezás con el pesto, aflojado con una cucharada de agua tibia.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-fideos-de-arroz-tempeh-y-palta-pepino-y', 'Bowl de fideos de arroz, tempeh y palta, pepino y zanahoria', 24, 1, '{almuerzo,cena}', true, 'Hervís los fideos de arroz 4 minutos, los enjuagás con agua fría y los escurrís.
Cortás el tempeh en láminas, lo marinás con la soja y lo dorás en sartén 3 minutos por lado.
Cortás la palta y el pepino en láminas; rallás la zanahoria.
Mezclás el yogur con la menta picada, el limón y sal.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-burgol-tempeh-y-palta-pepino-y-zanahoria', 'Bowl de burgol, tempeh y palta, pepino y zanahoria', 24, 1, '{almuerzo,cena}', true, 'Hidratás el burgol con agua caliente (1 a 1,5), lo tapás 15 minutos y lo desgranás.
Cortás el tempeh en láminas, lo marinás con la soja y lo dorás en sartén 3 minutos por lado.
Cortás la palta y el pepino en láminas; rallás la zanahoria.
Mezclás el yogur con la menta picada, el limón y sal.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-batata-asada-atun-y-palta-pepino-y-zanahoria', 'Bowl de batata asada, atún y palta, pepino y zanahoria', 15, 1, '{almuerzo,cena}', true, 'Cortás la batata en cubos, los mezclás con el aceite y sal y los asás 25 minutos a 220 °C.
Escurrís el atún y lo desmenuzás.
Cortás la palta y el pepino en láminas; rallás la zanahoria.
Mezclás el tahini con el limón, agua tibia, sal y ajo hasta lograr una salsa lisa.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-batata-asada-atun-y-repollo-colorado-edamame-y', 'Bowl de batata asada, atún y repollo colorado, edamame y zanahoria', 15, 1, '{almuerzo,cena}', true, 'Cortás la batata en cubos, los mezclás con el aceite y sal y los asás 25 minutos a 220 °C.
Escurrís el atún y lo desmenuzás.
Cortás el repollo en tiras finísimas, hervís el edamame 4 minutos y rallás la zanahoria.
Mezclás el yogur con la menta picada, el limón y sal.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-batata-asada-langostinos-y-palta-pepino-y', 'Bowl de batata asada, langostinos y palta, pepino y zanahoria', 20, 1, '{almuerzo,cena}', true, 'Cortás la batata en cubos, los mezclás con el aceite y sal y los asás 25 minutos a 220 °C.
Salteás los langostinos pelados con el ajo y el aceite 2 minutos por lado.
Cortás la palta y el pepino en láminas; rallás la zanahoria.
Aderezás con el pesto, aflojado con una cucharada de agua tibia.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-arroz-integral-huevo-y-brocoli-choclo-y-tomate', 'Bowl de arroz integral, huevo y brócoli, choclo y tomate cherry', 22, 1, '{almuerzo,cena}', true, 'Hervís el arroz integral (o usás uno ya cocido) y lo dejás entibiar.
Hacés los huevos duros (9 minutos), los pelás y los cortás al medio.
Hervís el brócoli 3 minutos y lo enfriás con agua; cortás los cherry al medio.
Mezclás la soja con el jengibre rallado y el aceite de sésamo.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-burgol-pollo-y-palta-pepino-y-zanahoria', 'Bowl de burgol, pollo y palta, pepino y zanahoria', 24, 1, '{almuerzo,cena}', true, 'Hidratás el burgol con agua caliente (1 a 1,5), lo tapás 15 minutos y lo desgranás.
Cocinás la pechuga en plancha con sal y pimienta, 5 minutos por lado, y la cortás en tiras.
Cortás la palta y el pepino en láminas; rallás la zanahoria.
Servís con una cucharada de guacamole.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-quinoa-tempeh-y-espinaca-remolacha-y-semillas', 'Bowl de quinoa, tempeh y espinaca, remolacha y semillas', 24, 1, '{almuerzo,cena}', true, 'Enjuagás la quinoa, la hervís 12 minutos en el doble de agua y la desgranás con un tenedor.
Cortás el tempeh en láminas, lo marinás con la soja y lo dorás en sartén 3 minutos por lado.
Lavás la espinaca, cortás la remolacha en cubos y sumás las semillas.
Mezclás el tahini con el limón, agua tibia, sal y ajo hasta lograr una salsa lisa.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-cuscus-pollo-y-repollo-colorado-edamame-y', 'Bowl de cuscús, pollo y repollo colorado, edamame y zanahoria', 24, 1, '{almuerzo,cena}', true, 'Hidratás el cuscús con agua caliente (1 a 1), lo tapás 5 minutos y lo desgranás con un tenedor.
Cocinás la pechuga en plancha con sal y pimienta, 5 minutos por lado, y la cortás en tiras.
Cortás el repollo en tiras finísimas, hervís el edamame 4 minutos y rallás la zanahoria.
Aderezás con el pesto, aflojado con una cucharada de agua tibia.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-batata-asada-pollo-y-kale-mango-y-cebolla-morada', 'Bowl de batata asada, pollo y kale, mango y cebolla morada', 24, 1, '{almuerzo,cena}', true, 'Cortás la batata en cubos, los mezclás con el aceite y sal y los asás 25 minutos a 220 °C.
Cocinás la pechuga en plancha con sal y pimienta, 5 minutos por lado, y la cortás en tiras.
Masajeás el kale con una pizca de sal y aceite 1 minuto, cortás el mango en cubos y la cebolla en aros.
Mezclás el yogur con la menta picada, el limón y sal.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-batata-asada-garbanzos-y-palta-pepino-y', 'Bowl de batata asada, garbanzos y palta, pepino y zanahoria', 20, 1, '{almuerzo,cena}', true, 'Cortás la batata en cubos, los mezclás con el aceite y sal y los asás 25 minutos a 220 °C.
Dorás los garbanzos escurridos en sartén con el aceite, comino y pimentón, 5 minutos, hasta que estén crocantes por fuera.
Cortás la palta y el pepino en láminas; rallás la zanahoria.
Mezclás el yogur con la menta picada, el limón y sal.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-arroz-integral-atun-y-palta-pepino-y-zanahoria', 'Bowl de arroz integral, atún y palta, pepino y zanahoria', 15, 1, '{almuerzo,cena}', true, 'Hervís el arroz integral (o usás uno ya cocido) y lo dejás entibiar.
Escurrís el atún y lo desmenuzás.
Cortás la palta y el pepino en láminas; rallás la zanahoria.
Mezclás el tahini con el limón, agua tibia, sal y ajo hasta lograr una salsa lisa.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-quinoa-carne-y-brocoli-choclo-y-tomate-cherry', 'Bowl de quinoa, carne y brócoli, choclo y tomate cherry', 22, 1, '{almuerzo,cena}', true, 'Enjuagás la quinoa, la hervís 12 minutos en el doble de agua y la desgranás con un tenedor.
Cocinás el peceto en tiras en plancha caliente con sal y pimienta, 3 minutos.
Hervís el brócoli 3 minutos y lo enfriás con agua; cortás los cherry al medio.
Mezclás el tahini con el limón, agua tibia, sal y ajo hasta lograr una salsa lisa.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-quinoa-tofu-y-hojas-verdes-manzana-y-apio', 'Bowl de quinoa, tofu y hojas verdes, manzana y apio', 27, 1, '{almuerzo,cena}', true, 'Enjuagás la quinoa, la hervís 12 minutos en el doble de agua y la desgranás con un tenedor.
Cortás el tofu en cubos, lo marinás con la soja 10 minutos y lo dorás en sartén con el aceite de sésamo.
Cortás la manzana y el apio en bastones finos y los mezclás con las hojas.
Mezclás la soja con el jengibre rallado y el aceite de sésamo.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-fideos-de-arroz-pollo-y-hojas-verdes-manzana-y', 'Bowl de fideos de arroz, pollo y hojas verdes, manzana y apio', 24, 1, '{almuerzo,cena}', true, 'Hervís los fideos de arroz 4 minutos, los enjuagás con agua fría y los escurrís.
Cocinás la pechuga en plancha con sal y pimienta, 5 minutos por lado, y la cortás en tiras.
Cortás la manzana y el apio en bastones finos y los mezclás con las hojas.
Servís con una cucharada de guacamole.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-cuscus-carne-y-repollo-colorado-edamame-y', 'Bowl de cuscús, carne y repollo colorado, edamame y zanahoria', 22, 1, '{almuerzo,cena}', true, 'Hidratás el cuscús con agua caliente (1 a 1), lo tapás 5 minutos y lo desgranás con un tenedor.
Cocinás el peceto en tiras en plancha caliente con sal y pimienta, 3 minutos.
Cortás el repollo en tiras finísimas, hervís el edamame 4 minutos y rallás la zanahoria.
Aderezás con el pesto, aflojado con una cucharada de agua tibia.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-cuscus-atun-y-palta-pepino-y-zanahoria', 'Bowl de cuscús, atún y palta, pepino y zanahoria', 15, 1, '{almuerzo,cena}', true, 'Hidratás el cuscús con agua caliente (1 a 1), lo tapás 5 minutos y lo desgranás con un tenedor.
Escurrís el atún y lo desmenuzás.
Cortás la palta y el pepino en láminas; rallás la zanahoria.
Mezclás el tahini con el limón, agua tibia, sal y ajo hasta lograr una salsa lisa.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-cuscus-lentejas-y-brocoli-choclo-y-tomate-cherry', 'Bowl de cuscús, lentejas y brócoli, choclo y tomate cherry', 15, 1, '{almuerzo,cena}', true, 'Hidratás el cuscús con agua caliente (1 a 1), lo tapás 5 minutos y lo desgranás con un tenedor.
Enjuagás las lentejas hervidas y las escurrís.
Hervís el brócoli 3 minutos y lo enfriás con agua; cortás los cherry al medio.
Aderezás con el pesto, aflojado con una cucharada de agua tibia.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-fideos-de-arroz-pollo-y-repollo-colorado', 'Bowl de fideos de arroz, pollo y repollo colorado, edamame y zanahoria', 24, 1, '{almuerzo,cena}', true, 'Hervís los fideos de arroz 4 minutos, los enjuagás con agua fría y los escurrís.
Cocinás la pechuga en plancha con sal y pimienta, 5 minutos por lado, y la cortás en tiras.
Cortás el repollo en tiras finísimas, hervís el edamame 4 minutos y rallás la zanahoria.
Aderezás con el pesto, aflojado con una cucharada de agua tibia.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-quinoa-tempeh-y-kale-mango-y-cebolla-morada', 'Bowl de quinoa, tempeh y kale, mango y cebolla morada', 24, 1, '{almuerzo,cena}', true, 'Enjuagás la quinoa, la hervís 12 minutos en el doble de agua y la desgranás con un tenedor.
Cortás el tempeh en láminas, lo marinás con la soja y lo dorás en sartén 3 minutos por lado.
Masajeás el kale con una pizca de sal y aceite 1 minuto, cortás el mango en cubos y la cebolla en aros.
Aderezás con el pesto, aflojado con una cucharada de agua tibia.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-cuscus-lentejas-y-hojas-verdes-manzana-y-apio', 'Bowl de cuscús, lentejas y hojas verdes, manzana y apio', 15, 1, '{almuerzo,cena}', true, 'Hidratás el cuscús con agua caliente (1 a 1), lo tapás 5 minutos y lo desgranás con un tenedor.
Enjuagás las lentejas hervidas y las escurrís.
Cortás la manzana y el apio en bastones finos y los mezclás con las hojas.
Mezclás la soja con el jengibre rallado y el aceite de sésamo.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-cuscus-carne-y-brocoli-choclo-y-tomate-cherry', 'Bowl de cuscús, carne y brócoli, choclo y tomate cherry', 22, 1, '{almuerzo,cena}', true, 'Hidratás el cuscús con agua caliente (1 a 1), lo tapás 5 minutos y lo desgranás con un tenedor.
Cocinás el peceto en tiras en plancha caliente con sal y pimienta, 3 minutos.
Hervís el brócoli 3 minutos y lo enfriás con agua; cortás los cherry al medio.
Mezclás el tahini con el limón, agua tibia, sal y ajo hasta lograr una salsa lisa.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-quinoa-carne-y-repollo-colorado-edamame-y', 'Bowl de quinoa, carne y repollo colorado, edamame y zanahoria', 22, 1, '{almuerzo,cena}', true, 'Enjuagás la quinoa, la hervís 12 minutos en el doble de agua y la desgranás con un tenedor.
Cocinás el peceto en tiras en plancha caliente con sal y pimienta, 3 minutos.
Cortás el repollo en tiras finísimas, hervís el edamame 4 minutos y rallás la zanahoria.
Aderezás con el pesto, aflojado con una cucharada de agua tibia.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-arroz-integral-lentejas-y-palta-pepino-y', 'Bowl de arroz integral, lentejas y palta, pepino y zanahoria', 15, 1, '{almuerzo,cena}', true, 'Hervís el arroz integral (o usás uno ya cocido) y lo dejás entibiar.
Enjuagás las lentejas hervidas y las escurrís.
Cortás la palta y el pepino en láminas; rallás la zanahoria.
Mezclás la soja con el jengibre rallado y el aceite de sésamo.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-cuscus-huevo-y-brocoli-choclo-y-tomate-cherry', 'Bowl de cuscús, huevo y brócoli, choclo y tomate cherry', 22, 1, '{almuerzo,cena}', true, 'Hidratás el cuscús con agua caliente (1 a 1), lo tapás 5 minutos y lo desgranás con un tenedor.
Hacés los huevos duros (9 minutos), los pelás y los cortás al medio.
Hervís el brócoli 3 minutos y lo enfriás con agua; cortás los cherry al medio.
Mezclás la soja con el jengibre rallado y el aceite de sésamo.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-quinoa-langostinos-y-hojas-verdes-manzana-y-apio', 'Bowl de quinoa, langostinos y hojas verdes, manzana y apio', 20, 1, '{almuerzo,cena}', true, 'Enjuagás la quinoa, la hervís 12 minutos en el doble de agua y la desgranás con un tenedor.
Salteás los langostinos pelados con el ajo y el aceite 2 minutos por lado.
Cortás la manzana y el apio en bastones finos y los mezclás con las hojas.
Aderezás con el pesto, aflojado con una cucharada de agua tibia.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-quinoa-lentejas-y-brocoli-choclo-y-tomate-cherry', 'Bowl de quinoa, lentejas y brócoli, choclo y tomate cherry', 15, 1, '{almuerzo,cena}', true, 'Enjuagás la quinoa, la hervís 12 minutos en el doble de agua y la desgranás con un tenedor.
Enjuagás las lentejas hervidas y las escurrís.
Hervís el brócoli 3 minutos y lo enfriás con agua; cortás los cherry al medio.
Aderezás con el pesto, aflojado con una cucharada de agua tibia.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-batata-asada-huevo-y-hojas-verdes-manzana-y-apio', 'Bowl de batata asada, huevo y hojas verdes, manzana y apio', 22, 1, '{almuerzo,cena}', true, 'Cortás la batata en cubos, los mezclás con el aceite y sal y los asás 25 minutos a 220 °C.
Hacés los huevos duros (9 minutos), los pelás y los cortás al medio.
Cortás la manzana y el apio en bastones finos y los mezclás con las hojas.
Mezclás el tahini con el limón, agua tibia, sal y ajo hasta lograr una salsa lisa.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-burgol-huevo-y-palta-pepino-y-zanahoria', 'Bowl de burgol, huevo y palta, pepino y zanahoria', 22, 1, '{almuerzo,cena}', true, 'Hidratás el burgol con agua caliente (1 a 1,5), lo tapás 15 minutos y lo desgranás.
Hacés los huevos duros (9 minutos), los pelás y los cortás al medio.
Cortás la palta y el pepino en láminas; rallás la zanahoria.
Mezclás el tahini con el limón, agua tibia, sal y ajo hasta lograr una salsa lisa.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-cuscus-huevo-y-espinaca-remolacha-y-semillas', 'Bowl de cuscús, huevo y espinaca, remolacha y semillas', 22, 1, '{almuerzo,cena}', true, 'Hidratás el cuscús con agua caliente (1 a 1), lo tapás 5 minutos y lo desgranás con un tenedor.
Hacés los huevos duros (9 minutos), los pelás y los cortás al medio.
Lavás la espinaca, cortás la remolacha en cubos y sumás las semillas.
Aderezás con el pesto, aflojado con una cucharada de agua tibia.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-cuscus-huevo-y-repollo-colorado-edamame-y', 'Bowl de cuscús, huevo y repollo colorado, edamame y zanahoria', 22, 1, '{almuerzo,cena}', true, 'Hidratás el cuscús con agua caliente (1 a 1), lo tapás 5 minutos y lo desgranás con un tenedor.
Hacés los huevos duros (9 minutos), los pelás y los cortás al medio.
Cortás el repollo en tiras finísimas, hervís el edamame 4 minutos y rallás la zanahoria.
Mezclás el yogur con la menta picada, el limón y sal.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-cuscus-pollo-y-palta-pepino-y-zanahoria', 'Bowl de cuscús, pollo y palta, pepino y zanahoria', 24, 1, '{almuerzo,cena}', true, 'Hidratás el cuscús con agua caliente (1 a 1), lo tapás 5 minutos y lo desgranás con un tenedor.
Cocinás la pechuga en plancha con sal y pimienta, 5 minutos por lado, y la cortás en tiras.
Cortás la palta y el pepino en láminas; rallás la zanahoria.
Servís con una cucharada de guacamole.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-arroz-integral-huevo-y-palta-pepino-y-zanahoria', 'Bowl de arroz integral, huevo y palta, pepino y zanahoria', 22, 1, '{almuerzo,cena}', true, 'Hervís el arroz integral (o usás uno ya cocido) y lo dejás entibiar.
Hacés los huevos duros (9 minutos), los pelás y los cortás al medio.
Cortás la palta y el pepino en láminas; rallás la zanahoria.
Mezclás el tahini con el limón, agua tibia, sal y ajo hasta lograr una salsa lisa.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-arroz-integral-atun-y-kale-mango-y-cebolla', 'Bowl de arroz integral, atún y kale, mango y cebolla morada', 15, 1, '{almuerzo,cena}', true, 'Hervís el arroz integral (o usás uno ya cocido) y lo dejás entibiar.
Escurrís el atún y lo desmenuzás.
Masajeás el kale con una pizca de sal y aceite 1 minuto, cortás el mango en cubos y la cebolla en aros.
Servís con una cucharada de guacamole.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-arroz-integral-tofu-y-repollo-colorado-edamame', 'Bowl de arroz integral, tofu y repollo colorado, edamame y zanahoria', 27, 1, '{almuerzo,cena}', true, 'Hervís el arroz integral (o usás uno ya cocido) y lo dejás entibiar.
Cortás el tofu en cubos, lo marinás con la soja 10 minutos y lo dorás en sartén con el aceite de sésamo.
Cortás el repollo en tiras finísimas, hervís el edamame 4 minutos y rallás la zanahoria.
Servís con una cucharada de guacamole.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-batata-asada-pollo-y-hojas-verdes-manzana-y-apio', 'Bowl de batata asada, pollo y hojas verdes, manzana y apio', 24, 1, '{almuerzo,cena}', true, 'Cortás la batata en cubos, los mezclás con el aceite y sal y los asás 25 minutos a 220 °C.
Cocinás la pechuga en plancha con sal y pimienta, 5 minutos por lado, y la cortás en tiras.
Cortás la manzana y el apio en bastones finos y los mezclás con las hojas.
Servís con una cucharada de guacamole.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-burgol-salmon-y-hojas-verdes-manzana-y-apio', 'Bowl de burgol, salmón y hojas verdes, manzana y apio', 22, 1, '{almuerzo,cena}', true, 'Hidratás el burgol con agua caliente (1 a 1,5), lo tapás 15 minutos y lo desgranás.
Cocinás el salmón en la plancha 4 minutos por lado con sal y limón, y lo desmenuzás en lascas.
Cortás la manzana y el apio en bastones finos y los mezclás con las hojas.
Aderezás con el pesto, aflojado con una cucharada de agua tibia.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-batata-asada-carne-y-kale-mango-y-cebolla-morada', 'Bowl de batata asada, carne y kale, mango y cebolla morada', 22, 1, '{almuerzo,cena}', true, 'Cortás la batata en cubos, los mezclás con el aceite y sal y los asás 25 minutos a 220 °C.
Cocinás el peceto en tiras en plancha caliente con sal y pimienta, 3 minutos.
Masajeás el kale con una pizca de sal y aceite 1 minuto, cortás el mango en cubos y la cebolla en aros.
Mezclás el yogur con la menta picada, el limón y sal.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-arroz-integral-huevo-y-repollo-colorado-edamame', 'Bowl de arroz integral, huevo y repollo colorado, edamame y zanahoria', 22, 1, '{almuerzo,cena}', true, 'Hervís el arroz integral (o usás uno ya cocido) y lo dejás entibiar.
Hacés los huevos duros (9 minutos), los pelás y los cortás al medio.
Cortás el repollo en tiras finísimas, hervís el edamame 4 minutos y rallás la zanahoria.
Mezclás el yogur con la menta picada, el limón y sal.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-batata-asada-tofu-y-hojas-verdes-manzana-y-apio', 'Bowl de batata asada, tofu y hojas verdes, manzana y apio', 27, 1, '{almuerzo,cena}', true, 'Cortás la batata en cubos, los mezclás con el aceite y sal y los asás 25 minutos a 220 °C.
Cortás el tofu en cubos, lo marinás con la soja 10 minutos y lo dorás en sartén con el aceite de sésamo.
Cortás la manzana y el apio en bastones finos y los mezclás con las hojas.
Mezclás la soja con el jengibre rallado y el aceite de sésamo.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-cuscus-lentejas-y-repollo-colorado-edamame-y', 'Bowl de cuscús, lentejas y repollo colorado, edamame y zanahoria', 15, 1, '{almuerzo,cena}', true, 'Hidratás el cuscús con agua caliente (1 a 1), lo tapás 5 minutos y lo desgranás con un tenedor.
Enjuagás las lentejas hervidas y las escurrís.
Cortás el repollo en tiras finísimas, hervís el edamame 4 minutos y rallás la zanahoria.
Servís con una cucharada de guacamole.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-burgol-pollo-y-espinaca-remolacha-y-semillas', 'Bowl de burgol, pollo y espinaca, remolacha y semillas', 24, 1, '{almuerzo,cena}', true, 'Hidratás el burgol con agua caliente (1 a 1,5), lo tapás 15 minutos y lo desgranás.
Cocinás la pechuga en plancha con sal y pimienta, 5 minutos por lado, y la cortás en tiras.
Lavás la espinaca, cortás la remolacha en cubos y sumás las semillas.
Mezclás la soja con el jengibre rallado y el aceite de sésamo.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-batata-asada-garbanzos-y-brocoli-choclo-y', 'Bowl de batata asada, garbanzos y brócoli, choclo y tomate cherry', 20, 1, '{almuerzo,cena}', true, 'Cortás la batata en cubos, los mezclás con el aceite y sal y los asás 25 minutos a 220 °C.
Dorás los garbanzos escurridos en sartén con el aceite, comino y pimentón, 5 minutos, hasta que estén crocantes por fuera.
Hervís el brócoli 3 minutos y lo enfriás con agua; cortás los cherry al medio.
Servís con una cucharada de guacamole.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-quinoa-huevo-y-palta-pepino-y-zanahoria', 'Bowl de quinoa, huevo y palta, pepino y zanahoria', 22, 1, '{almuerzo,cena}', true, 'Enjuagás la quinoa, la hervís 12 minutos en el doble de agua y la desgranás con un tenedor.
Hacés los huevos duros (9 minutos), los pelás y los cortás al medio.
Cortás la palta y el pepino en láminas; rallás la zanahoria.
Mezclás el tahini con el limón, agua tibia, sal y ajo hasta lograr una salsa lisa.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-cuscus-salmon-y-kale-mango-y-cebolla-morada', 'Bowl de cuscús, salmón y kale, mango y cebolla morada', 22, 1, '{almuerzo,cena}', true, 'Hidratás el cuscús con agua caliente (1 a 1), lo tapás 5 minutos y lo desgranás con un tenedor.
Cocinás el salmón en la plancha 4 minutos por lado con sal y limón, y lo desmenuzás en lascas.
Masajeás el kale con una pizca de sal y aceite 1 minuto, cortás el mango en cubos y la cebolla en aros.
Mezclás la soja con el jengibre rallado y el aceite de sésamo.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-burgol-huevo-y-hojas-verdes-manzana-y-apio', 'Bowl de burgol, huevo y hojas verdes, manzana y apio', 22, 1, '{almuerzo,cena}', true, 'Hidratás el burgol con agua caliente (1 a 1,5), lo tapás 15 minutos y lo desgranás.
Hacés los huevos duros (9 minutos), los pelás y los cortás al medio.
Cortás la manzana y el apio en bastones finos y los mezclás con las hojas.
Mezclás el tahini con el limón, agua tibia, sal y ajo hasta lograr una salsa lisa.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-arroz-integral-pollo-y-espinaca-remolacha-y', 'Bowl de arroz integral, pollo y espinaca, remolacha y semillas', 24, 1, '{almuerzo,cena}', true, 'Hervís el arroz integral (o usás uno ya cocido) y lo dejás entibiar.
Cocinás la pechuga en plancha con sal y pimienta, 5 minutos por lado, y la cortás en tiras.
Lavás la espinaca, cortás la remolacha en cubos y sumás las semillas.
Mezclás la soja con el jengibre rallado y el aceite de sésamo.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-cuscus-huevo-y-hojas-verdes-manzana-y-apio', 'Bowl de cuscús, huevo y hojas verdes, manzana y apio', 22, 1, '{almuerzo,cena}', true, 'Hidratás el cuscús con agua caliente (1 a 1), lo tapás 5 minutos y lo desgranás con un tenedor.
Hacés los huevos duros (9 minutos), los pelás y los cortás al medio.
Cortás la manzana y el apio en bastones finos y los mezclás con las hojas.
Mezclás el tahini con el limón, agua tibia, sal y ajo hasta lograr una salsa lisa.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-burgol-tempeh-y-hojas-verdes-manzana-y-apio', 'Bowl de burgol, tempeh y hojas verdes, manzana y apio', 24, 1, '{almuerzo,cena}', true, 'Hidratás el burgol con agua caliente (1 a 1,5), lo tapás 15 minutos y lo desgranás.
Cortás el tempeh en láminas, lo marinás con la soja y lo dorás en sartén 3 minutos por lado.
Cortás la manzana y el apio en bastones finos y los mezclás con las hojas.
Mezclás el yogur con la menta picada, el limón y sal.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-quinoa-tofu-y-brocoli-choclo-y-tomate-cherry', 'Bowl de quinoa, tofu y brócoli, choclo y tomate cherry', 27, 1, '{almuerzo,cena}', true, 'Enjuagás la quinoa, la hervís 12 minutos en el doble de agua y la desgranás con un tenedor.
Cortás el tofu en cubos, lo marinás con la soja 10 minutos y lo dorás en sartén con el aceite de sésamo.
Hervís el brócoli 3 minutos y lo enfriás con agua; cortás los cherry al medio.
Aderezás con el pesto, aflojado con una cucharada de agua tibia.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-batata-asada-langostinos-y-kale-mango-y-cebolla', 'Bowl de batata asada, langostinos y kale, mango y cebolla morada', 20, 1, '{almuerzo,cena}', true, 'Cortás la batata en cubos, los mezclás con el aceite y sal y los asás 25 minutos a 220 °C.
Salteás los langostinos pelados con el ajo y el aceite 2 minutos por lado.
Masajeás el kale con una pizca de sal y aceite 1 minuto, cortás el mango en cubos y la cebolla en aros.
Mezclás la soja con el jengibre rallado y el aceite de sésamo.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-quinoa-pollo-y-espinaca-remolacha-y-semillas', 'Bowl de quinoa, pollo y espinaca, remolacha y semillas', 24, 1, '{almuerzo,cena}', true, 'Enjuagás la quinoa, la hervís 12 minutos en el doble de agua y la desgranás con un tenedor.
Cocinás la pechuga en plancha con sal y pimienta, 5 minutos por lado, y la cortás en tiras.
Lavás la espinaca, cortás la remolacha en cubos y sumás las semillas.
Mezclás la soja con el jengibre rallado y el aceite de sésamo.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-batata-asada-tempeh-y-repollo-colorado-edamame', 'Bowl de batata asada, tempeh y repollo colorado, edamame y zanahoria', 24, 1, '{almuerzo,cena}', true, 'Cortás la batata en cubos, los mezclás con el aceite y sal y los asás 25 minutos a 220 °C.
Cortás el tempeh en láminas, lo marinás con la soja y lo dorás en sartén 3 minutos por lado.
Cortás el repollo en tiras finísimas, hervís el edamame 4 minutos y rallás la zanahoria.
Mezclás la soja con el jengibre rallado y el aceite de sésamo.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-batata-asada-atun-y-hojas-verdes-manzana-y-apio', 'Bowl de batata asada, atún y hojas verdes, manzana y apio', 15, 1, '{almuerzo,cena}', true, 'Cortás la batata en cubos, los mezclás con el aceite y sal y los asás 25 minutos a 220 °C.
Escurrís el atún y lo desmenuzás.
Cortás la manzana y el apio en bastones finos y los mezclás con las hojas.
Mezclás el tahini con el limón, agua tibia, sal y ajo hasta lograr una salsa lisa.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-burgol-salmon-y-repollo-colorado-edamame-y', 'Bowl de burgol, salmón y repollo colorado, edamame y zanahoria', 22, 1, '{almuerzo,cena}', true, 'Hidratás el burgol con agua caliente (1 a 1,5), lo tapás 15 minutos y lo desgranás.
Cocinás el salmón en la plancha 4 minutos por lado con sal y limón, y lo desmenuzás en lascas.
Cortás el repollo en tiras finísimas, hervís el edamame 4 minutos y rallás la zanahoria.
Mezclás el tahini con el limón, agua tibia, sal y ajo hasta lograr una salsa lisa.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-cuscus-tofu-y-espinaca-remolacha-y-semillas', 'Bowl de cuscús, tofu y espinaca, remolacha y semillas', 27, 1, '{almuerzo,cena}', true, 'Hidratás el cuscús con agua caliente (1 a 1), lo tapás 5 minutos y lo desgranás con un tenedor.
Cortás el tofu en cubos, lo marinás con la soja 10 minutos y lo dorás en sartén con el aceite de sésamo.
Lavás la espinaca, cortás la remolacha en cubos y sumás las semillas.
Mezclás el yogur con la menta picada, el limón y sal.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-fideos-de-arroz-pollo-y-espinaca-remolacha-y', 'Bowl de fideos de arroz, pollo y espinaca, remolacha y semillas', 24, 1, '{almuerzo,cena}', true, 'Hervís los fideos de arroz 4 minutos, los enjuagás con agua fría y los escurrís.
Cocinás la pechuga en plancha con sal y pimienta, 5 minutos por lado, y la cortás en tiras.
Lavás la espinaca, cortás la remolacha en cubos y sumás las semillas.
Mezclás la soja con el jengibre rallado y el aceite de sésamo.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-batata-asada-lentejas-y-brocoli-choclo-y-tomate', 'Bowl de batata asada, lentejas y brócoli, choclo y tomate cherry', 15, 1, '{almuerzo,cena}', true, 'Cortás la batata en cubos, los mezclás con el aceite y sal y los asás 25 minutos a 220 °C.
Enjuagás las lentejas hervidas y las escurrís.
Hervís el brócoli 3 minutos y lo enfriás con agua; cortás los cherry al medio.
Aderezás con el pesto, aflojado con una cucharada de agua tibia.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-quinoa-atun-y-brocoli-choclo-y-tomate-cherry', 'Bowl de quinoa, atún y brócoli, choclo y tomate cherry', 15, 1, '{almuerzo,cena}', true, 'Enjuagás la quinoa, la hervís 12 minutos en el doble de agua y la desgranás con un tenedor.
Escurrís el atún y lo desmenuzás.
Hervís el brócoli 3 minutos y lo enfriás con agua; cortás los cherry al medio.
Mezclás la soja con el jengibre rallado y el aceite de sésamo.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-batata-asada-langostinos-y-repollo-colorado', 'Bowl de batata asada, langostinos y repollo colorado, edamame y zanahoria', 20, 1, '{almuerzo,cena}', true, 'Cortás la batata en cubos, los mezclás con el aceite y sal y los asás 25 minutos a 220 °C.
Salteás los langostinos pelados con el ajo y el aceite 2 minutos por lado.
Cortás el repollo en tiras finísimas, hervís el edamame 4 minutos y rallás la zanahoria.
Mezclás el tahini con el limón, agua tibia, sal y ajo hasta lograr una salsa lisa.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-fideos-de-arroz-pollo-y-palta-pepino-y-zanahoria', 'Bowl de fideos de arroz, pollo y palta, pepino y zanahoria', 24, 1, '{almuerzo,cena}', true, 'Hervís los fideos de arroz 4 minutos, los enjuagás con agua fría y los escurrís.
Cocinás la pechuga en plancha con sal y pimienta, 5 minutos por lado, y la cortás en tiras.
Cortás la palta y el pepino en láminas; rallás la zanahoria.
Servís con una cucharada de guacamole.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-fideos-de-arroz-carne-y-repollo-colorado', 'Bowl de fideos de arroz, carne y repollo colorado, edamame y zanahoria', 22, 1, '{almuerzo,cena}', true, 'Hervís los fideos de arroz 4 minutos, los enjuagás con agua fría y los escurrís.
Cocinás el peceto en tiras en plancha caliente con sal y pimienta, 3 minutos.
Cortás el repollo en tiras finísimas, hervís el edamame 4 minutos y rallás la zanahoria.
Aderezás con el pesto, aflojado con una cucharada de agua tibia.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-burgol-salmon-y-espinaca-remolacha-y-semillas', 'Bowl de burgol, salmón y espinaca, remolacha y semillas', 22, 1, '{almuerzo,cena}', true, 'Hidratás el burgol con agua caliente (1 a 1,5), lo tapás 15 minutos y lo desgranás.
Cocinás el salmón en la plancha 4 minutos por lado con sal y limón, y lo desmenuzás en lascas.
Lavás la espinaca, cortás la remolacha en cubos y sumás las semillas.
Servís con una cucharada de guacamole.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-arroz-integral-tempeh-y-brocoli-choclo-y-tomate', 'Bowl de arroz integral, tempeh y brócoli, choclo y tomate cherry', 24, 1, '{almuerzo,cena}', true, 'Hervís el arroz integral (o usás uno ya cocido) y lo dejás entibiar.
Cortás el tempeh en láminas, lo marinás con la soja y lo dorás en sartén 3 minutos por lado.
Hervís el brócoli 3 minutos y lo enfriás con agua; cortás los cherry al medio.
Servís con una cucharada de guacamole.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-cuscus-garbanzos-y-espinaca-remolacha-y-semillas', 'Bowl de cuscús, garbanzos y espinaca, remolacha y semillas', 20, 1, '{almuerzo,cena}', true, 'Hidratás el cuscús con agua caliente (1 a 1), lo tapás 5 minutos y lo desgranás con un tenedor.
Dorás los garbanzos escurridos en sartén con el aceite, comino y pimentón, 5 minutos, hasta que estén crocantes por fuera.
Lavás la espinaca, cortás la remolacha en cubos y sumás las semillas.
Mezclás el tahini con el limón, agua tibia, sal y ajo hasta lograr una salsa lisa.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.'),
  ('bowl-de-cuscus-garbanzos-y-palta-pepino-y-zanahoria', 'Bowl de cuscús, garbanzos y palta, pepino y zanahoria', 20, 1, '{almuerzo,cena}', true, 'Hidratás el cuscús con agua caliente (1 a 1), lo tapás 5 minutos y lo desgranás con un tenedor.
Dorás los garbanzos escurridos en sartén con el aceite, comino y pimentón, 5 minutos, hasta que estén crocantes por fuera.
Cortás la palta y el pepino en láminas; rallás la zanahoria.
Mezclás el yogur con la menta picada, el limón y sal.
Armás el bowl con la base abajo, la proteína y las verduras por sectores y la salsa por encima.')
on conflict (slug) do nothing;

insert into public.recipe_items (recipe_id, food_id, qty)
select r.id, f.id, v.qty from (values
  ('bocaditos-de-brocoli-y-queso-con-ensalada', 'brocoli', 150),
  ('bocaditos-de-brocoli-y-queso-con-ensalada', 'queso-cremoso', 40),
  ('bocaditos-de-brocoli-y-queso-con-ensalada', 'huevo', 1),
  ('bocaditos-de-brocoli-y-queso-con-ensalada', 'avena', 25),
  ('bocaditos-de-brocoli-y-queso-con-ensalada', 'lechuga', 60),
  ('bocaditos-de-brocoli-y-queso-con-ensalada', 'tomate', 1),
  ('bocaditos-de-brocoli-y-queso-con-ensalada', 'aceite', 8),
  ('croquetas-de-papa-y-atun-con-ensalada', 'papa-hervida', 150),
  ('croquetas-de-papa-y-atun-con-ensalada', 'atun-natural', 1),
  ('croquetas-de-papa-y-atun-con-ensalada', 'huevo', 0.5),
  ('croquetas-de-papa-y-atun-con-ensalada', 'pan-rallado', 20),
  ('croquetas-de-papa-y-atun-con-ensalada', 'lechuga', 60),
  ('croquetas-de-papa-y-atun-con-ensalada', 'tomate', 1),
  ('croquetas-de-papa-y-atun-con-ensalada', 'aceite', 8),
  ('hamburguesa-vegetal-con-ensalada-y-papas', 'hamburguesa-vegetal', 1),
  ('hamburguesa-vegetal-con-ensalada-y-papas', 'papa', 180),
  ('hamburguesa-vegetal-con-ensalada-y-papas', 'lechuga', 60),
  ('hamburguesa-vegetal-con-ensalada-y-papas', 'tomate', 1),
  ('hamburguesa-vegetal-con-ensalada-y-papas', 'aceite', 10),
  ('wrap-de-lomito-de-cerdo-rucula-y-mostaza', 'wrap-integral', 2),
  ('wrap-de-lomito-de-cerdo-rucula-y-mostaza', 'lomo-cerdo', 90),
  ('wrap-de-lomito-de-cerdo-rucula-y-mostaza', 'rucula', 15),
  ('wrap-de-lomito-de-cerdo-rucula-y-mostaza', 'mostaza', 8),
  ('wrap-de-lomito-de-cerdo-rucula-y-mostaza', 'cebolla-caramelizada', 25),
  ('pan-arabe-de-garbanzos-aplastados-y-palta', 'pan-arabe', 1),
  ('pan-arabe-de-garbanzos-aplastados-y-palta', 'garbanzos-hervidos', 80),
  ('pan-arabe-de-garbanzos-aplastados-y-palta', 'palta', 0.5),
  ('pan-arabe-de-garbanzos-aplastados-y-palta', 'tomate', 0.5),
  ('pan-arabe-de-garbanzos-aplastados-y-palta', 'jengibre', 1),
  ('sandwich-de-pavo-mostaza-y-pepinillos-en-pan-de-centeno', 'pan-centeno', 2),
  ('sandwich-de-pavo-mostaza-y-pepinillos-en-pan-de-centeno', 'pechuga-pavo', 80),
  ('sandwich-de-pavo-mostaza-y-pepinillos-en-pan-de-centeno', 'mostaza', 8),
  ('sandwich-de-pavo-mostaza-y-pepinillos-en-pan-de-centeno', 'pepinillos', 20),
  ('sandwich-de-pavo-mostaza-y-pepinillos-en-pan-de-centeno', 'lechuga', 15),
  ('bagel-de-jamon-queso-y-tomate', 'bagel', 1),
  ('bagel-de-jamon-queso-y-tomate', 'jamon-cocido', 35),
  ('bagel-de-jamon-queso-y-tomate', 'queso-port-salut', 35),
  ('bagel-de-jamon-queso-y-tomate', 'tomate', 0.5),
  ('bagel-de-jamon-queso-y-tomate', 'lechuga', 15),
  ('wrap-de-pavita-queso-untable-y-rucula', 'wrap-integral', 2),
  ('wrap-de-pavita-queso-untable-y-rucula', 'pavita-fiambre', 50),
  ('wrap-de-pavita-queso-untable-y-rucula', 'queso-untable-clasico', 30),
  ('wrap-de-pavita-queso-untable-y-rucula', 'rucula', 15),
  ('wrap-de-pavita-queso-untable-y-rucula', 'tomate', 0.5),
  ('pan-arabe-de-caprese-tomate-muzzarella-y-pesto', 'pan-arabe', 1),
  ('pan-arabe-de-caprese-tomate-muzzarella-y-pesto', 'tomate', 0.5),
  ('pan-arabe-de-caprese-tomate-muzzarella-y-pesto', 'muzzarella', 45),
  ('pan-arabe-de-caprese-tomate-muzzarella-y-pesto', 'pesto', 10),
  ('pan-arabe-de-caprese-tomate-muzzarella-y-pesto', 'rucula', 10),
  ('pan-arabe-de-queso-de-cabra-remolacha-y-rucula', 'pan-arabe', 1),
  ('pan-arabe-de-queso-de-cabra-remolacha-y-rucula', 'queso-cabra', 40),
  ('pan-arabe-de-queso-de-cabra-remolacha-y-rucula', 'remolacha-cocida', 50),
  ('pan-arabe-de-queso-de-cabra-remolacha-y-rucula', 'rucula', 15),
  ('pan-arabe-de-queso-de-cabra-remolacha-y-rucula', 'nueces', 8),
  ('bagel-de-queso-crema-salmon-ahumado-y-pepino', 'bagel', 1),
  ('bagel-de-queso-crema-salmon-ahumado-y-pepino', 'queso-untable', 30),
  ('bagel-de-queso-crema-salmon-ahumado-y-pepino', 'salmon-ahumado', 40),
  ('bagel-de-queso-crema-salmon-ahumado-y-pepino', 'pepino', 0.5),
  ('bagel-de-queso-crema-salmon-ahumado-y-pepino', 'cebolla-morada', 0.5),
  ('pan-arabe-de-pavita-queso-untable-y-rucula', 'pan-arabe', 1),
  ('pan-arabe-de-pavita-queso-untable-y-rucula', 'pavita-fiambre', 50),
  ('pan-arabe-de-pavita-queso-untable-y-rucula', 'queso-untable-clasico', 30),
  ('pan-arabe-de-pavita-queso-untable-y-rucula', 'rucula', 15),
  ('pan-arabe-de-pavita-queso-untable-y-rucula', 'tomate', 0.5),
  ('wrap-de-huevo-revuelto-tomate-y-queso', 'wrap-integral', 2),
  ('wrap-de-huevo-revuelto-tomate-y-queso', 'huevo', 2),
  ('wrap-de-huevo-revuelto-tomate-y-queso', 'tomate', 0.5),
  ('wrap-de-huevo-revuelto-tomate-y-queso', 'queso-cremoso', 25),
  ('wrap-de-huevo-revuelto-tomate-y-queso', 'aceite', 3),
  ('ciabatta-de-garbanzos-aplastados-y-palta', 'ciabatta', 1),
  ('ciabatta-de-garbanzos-aplastados-y-palta', 'garbanzos-hervidos', 80),
  ('ciabatta-de-garbanzos-aplastados-y-palta', 'palta', 0.5),
  ('ciabatta-de-garbanzos-aplastados-y-palta', 'tomate', 0.5),
  ('ciabatta-de-garbanzos-aplastados-y-palta', 'jengibre', 1),
  ('sandwich-de-ricota-tomate-y-albahaca-en-pan-con-semillas', 'pan-semillas', 2),
  ('sandwich-de-ricota-tomate-y-albahaca-en-pan-con-semillas', 'ricota', 70),
  ('sandwich-de-ricota-tomate-y-albahaca-en-pan-con-semillas', 'tomate', 0.5),
  ('sandwich-de-ricota-tomate-y-albahaca-en-pan-con-semillas', 'albahaca', 3),
  ('wrap-de-pavo-mostaza-y-pepinillos', 'wrap-integral', 2),
  ('wrap-de-pavo-mostaza-y-pepinillos', 'pechuga-pavo', 80),
  ('wrap-de-pavo-mostaza-y-pepinillos', 'mostaza', 8),
  ('wrap-de-pavo-mostaza-y-pepinillos', 'pepinillos', 20),
  ('wrap-de-pavo-mostaza-y-pepinillos', 'lechuga', 15),
  ('ciabatta-de-pechuga-grillada-palta-y-cherry', 'ciabatta', 1),
  ('ciabatta-de-pechuga-grillada-palta-y-cherry', 'pechuga-pollo', 90),
  ('ciabatta-de-pechuga-grillada-palta-y-cherry', 'palta', 0.5),
  ('ciabatta-de-pechuga-grillada-palta-y-cherry', 'tomate-cherry', 40),
  ('ciabatta-de-pechuga-grillada-palta-y-cherry', 'lechuga', 15),
  ('bagel-de-ricota-tomate-y-albahaca', 'bagel', 1),
  ('bagel-de-ricota-tomate-y-albahaca', 'ricota', 70),
  ('bagel-de-ricota-tomate-y-albahaca', 'tomate', 0.5),
  ('bagel-de-ricota-tomate-y-albahaca', 'albahaca', 3),
  ('wrap-de-queso-de-cabra-remolacha-y-rucula', 'wrap-integral', 2),
  ('wrap-de-queso-de-cabra-remolacha-y-rucula', 'queso-cabra', 40),
  ('wrap-de-queso-de-cabra-remolacha-y-rucula', 'remolacha-cocida', 50),
  ('wrap-de-queso-de-cabra-remolacha-y-rucula', 'rucula', 15),
  ('wrap-de-queso-de-cabra-remolacha-y-rucula', 'nueces', 8),
  ('pan-arabe-de-atun-tomate-y-lechuga', 'pan-arabe', 1),
  ('pan-arabe-de-atun-tomate-y-lechuga', 'atun-natural', 1),
  ('pan-arabe-de-atun-tomate-y-lechuga', 'tomate', 0.5),
  ('pan-arabe-de-atun-tomate-y-lechuga', 'lechuga', 20),
  ('pan-arabe-de-atun-tomate-y-lechuga', 'mayonesa-light', 10),
  ('sandwich-de-huevo-palta-y-rucula-en-pan-con-semillas', 'pan-semillas', 2),
  ('sandwich-de-huevo-palta-y-rucula-en-pan-con-semillas', 'huevo', 1),
  ('sandwich-de-huevo-palta-y-rucula-en-pan-con-semillas', 'palta', 0.5),
  ('sandwich-de-huevo-palta-y-rucula-en-pan-con-semillas', 'rucula', 15),
  ('sandwich-de-pechuga-grillada-palta-y-cherry-en-pan-de', 'pan-centeno', 2),
  ('sandwich-de-pechuga-grillada-palta-y-cherry-en-pan-de', 'pechuga-pollo', 90),
  ('sandwich-de-pechuga-grillada-palta-y-cherry-en-pan-de', 'palta', 0.5),
  ('sandwich-de-pechuga-grillada-palta-y-cherry-en-pan-de', 'tomate-cherry', 40),
  ('sandwich-de-pechuga-grillada-palta-y-cherry-en-pan-de', 'lechuga', 15),
  ('sandwich-de-berenjena-asada-muzzarella-y-albahaca-en', 'pan-semillas', 2),
  ('sandwich-de-berenjena-asada-muzzarella-y-albahaca-en', 'berenjena', 0.5),
  ('sandwich-de-berenjena-asada-muzzarella-y-albahaca-en', 'muzzarella', 40),
  ('sandwich-de-berenjena-asada-muzzarella-y-albahaca-en', 'albahaca', 3),
  ('sandwich-de-berenjena-asada-muzzarella-y-albahaca-en', 'aceite', 5),
  ('sandwich-de-carne-cebolla-caramelizada-y-queso-en-pan', 'pan-centeno', 2),
  ('sandwich-de-carne-cebolla-caramelizada-y-queso-en-pan', 'peceto', 80),
  ('sandwich-de-carne-cebolla-caramelizada-y-queso-en-pan', 'cebolla-caramelizada', 30),
  ('sandwich-de-carne-cebolla-caramelizada-y-queso-en-pan', 'queso-port-salut', 30),
  ('sandwich-de-carne-cebolla-caramelizada-y-queso-en-pan', 'rucula', 10),
  ('sandwich-de-milanesa-de-soja-lechuga-y-tomate-en-pan', 'pan-semillas', 2),
  ('sandwich-de-milanesa-de-soja-lechuga-y-tomate-en-pan', 'milanesa-soja', 1),
  ('sandwich-de-milanesa-de-soja-lechuga-y-tomate-en-pan', 'lechuga', 20),
  ('sandwich-de-milanesa-de-soja-lechuga-y-tomate-en-pan', 'tomate', 0.5),
  ('sandwich-de-milanesa-de-soja-lechuga-y-tomate-en-pan', 'mayonesa-light', 8),
  ('sandwich-de-caprese-tomate-muzzarella-y-pesto-en-pan-de', 'pan-centeno', 2),
  ('sandwich-de-caprese-tomate-muzzarella-y-pesto-en-pan-de', 'tomate', 0.5),
  ('sandwich-de-caprese-tomate-muzzarella-y-pesto-en-pan-de', 'muzzarella', 45),
  ('sandwich-de-caprese-tomate-muzzarella-y-pesto-en-pan-de', 'pesto', 10),
  ('sandwich-de-caprese-tomate-muzzarella-y-pesto-en-pan-de', 'rucula', 10),
  ('ciabatta-de-huevo-palta-y-rucula', 'ciabatta', 1),
  ('ciabatta-de-huevo-palta-y-rucula', 'huevo', 1),
  ('ciabatta-de-huevo-palta-y-rucula', 'palta', 0.5),
  ('ciabatta-de-huevo-palta-y-rucula', 'rucula', 15),
  ('sandwich-de-hummus-zanahoria-y-pepino-en-pan-integral', 'pan-integral', 3),
  ('sandwich-de-hummus-zanahoria-y-pepino-en-pan-integral', 'hummus', 50),
  ('sandwich-de-hummus-zanahoria-y-pepino-en-pan-integral', 'zanahoria', 0.5),
  ('sandwich-de-hummus-zanahoria-y-pepino-en-pan-integral', 'pepino', 0.5),
  ('sandwich-de-hummus-zanahoria-y-pepino-en-pan-integral', 'lechuga', 15),
  ('wrap-de-tofu-zanahoria-y-brotes', 'wrap-integral', 2),
  ('wrap-de-tofu-zanahoria-y-brotes', 'tofu', 90),
  ('wrap-de-tofu-zanahoria-y-brotes', 'zanahoria', 0.5),
  ('wrap-de-tofu-zanahoria-y-brotes', 'brotes-soja', 20),
  ('wrap-de-tofu-zanahoria-y-brotes', 'salsa-soja', 8),
  ('ciabatta-de-huevo-revuelto-tomate-y-queso', 'ciabatta', 1),
  ('ciabatta-de-huevo-revuelto-tomate-y-queso', 'huevo', 2),
  ('ciabatta-de-huevo-revuelto-tomate-y-queso', 'tomate', 0.5),
  ('ciabatta-de-huevo-revuelto-tomate-y-queso', 'queso-cremoso', 25),
  ('ciabatta-de-huevo-revuelto-tomate-y-queso', 'aceite', 3),
  ('pan-arabe-de-sardinas-tomate-y-cebolla-morada', 'pan-arabe', 1),
  ('pan-arabe-de-sardinas-tomate-y-cebolla-morada', 'sardinas', 70),
  ('pan-arabe-de-sardinas-tomate-y-cebolla-morada', 'tomate', 0.5),
  ('pan-arabe-de-sardinas-tomate-y-cebolla-morada', 'cebolla-morada', 0.5),
  ('pan-arabe-de-sardinas-tomate-y-cebolla-morada', 'limon-exprimido', 5),
  ('pan-arabe-de-pechuga-grillada-palta-y-cherry', 'pan-arabe', 1),
  ('pan-arabe-de-pechuga-grillada-palta-y-cherry', 'pechuga-pollo', 90),
  ('pan-arabe-de-pechuga-grillada-palta-y-cherry', 'palta', 0.5),
  ('pan-arabe-de-pechuga-grillada-palta-y-cherry', 'tomate-cherry', 40),
  ('pan-arabe-de-pechuga-grillada-palta-y-cherry', 'lechuga', 15),
  ('bagel-de-caprese-tomate-muzzarella-y-pesto', 'bagel', 1),
  ('bagel-de-caprese-tomate-muzzarella-y-pesto', 'tomate', 0.5),
  ('bagel-de-caprese-tomate-muzzarella-y-pesto', 'muzzarella', 45),
  ('bagel-de-caprese-tomate-muzzarella-y-pesto', 'pesto', 10),
  ('bagel-de-caprese-tomate-muzzarella-y-pesto', 'rucula', 10),
  ('sandwich-de-jamon-queso-y-tomate-en-pan-integral', 'pan-integral', 3),
  ('sandwich-de-jamon-queso-y-tomate-en-pan-integral', 'jamon-cocido', 35),
  ('sandwich-de-jamon-queso-y-tomate-en-pan-integral', 'queso-port-salut', 35),
  ('sandwich-de-jamon-queso-y-tomate-en-pan-integral', 'tomate', 0.5),
  ('sandwich-de-jamon-queso-y-tomate-en-pan-integral', 'lechuga', 15),
  ('ciabatta-de-pavo-mostaza-y-pepinillos', 'ciabatta', 1),
  ('ciabatta-de-pavo-mostaza-y-pepinillos', 'pechuga-pavo', 80),
  ('ciabatta-de-pavo-mostaza-y-pepinillos', 'mostaza', 8),
  ('ciabatta-de-pavo-mostaza-y-pepinillos', 'pepinillos', 20),
  ('ciabatta-de-pavo-mostaza-y-pepinillos', 'lechuga', 15),
  ('ciabatta-de-tofu-zanahoria-y-brotes', 'ciabatta', 1),
  ('ciabatta-de-tofu-zanahoria-y-brotes', 'tofu', 90),
  ('ciabatta-de-tofu-zanahoria-y-brotes', 'zanahoria', 0.5),
  ('ciabatta-de-tofu-zanahoria-y-brotes', 'brotes-soja', 20),
  ('ciabatta-de-tofu-zanahoria-y-brotes', 'salsa-soja', 8),
  ('sandwich-de-huevo-palta-y-rucula-en-pan-de-centeno', 'pan-centeno', 2),
  ('sandwich-de-huevo-palta-y-rucula-en-pan-de-centeno', 'huevo', 1),
  ('sandwich-de-huevo-palta-y-rucula-en-pan-de-centeno', 'palta', 0.5),
  ('sandwich-de-huevo-palta-y-rucula-en-pan-de-centeno', 'rucula', 15),
  ('ciabatta-de-queso-de-cabra-remolacha-y-rucula', 'ciabatta', 1),
  ('ciabatta-de-queso-de-cabra-remolacha-y-rucula', 'queso-cabra', 40),
  ('ciabatta-de-queso-de-cabra-remolacha-y-rucula', 'remolacha-cocida', 50),
  ('ciabatta-de-queso-de-cabra-remolacha-y-rucula', 'rucula', 15),
  ('ciabatta-de-queso-de-cabra-remolacha-y-rucula', 'nueces', 8),
  ('sandwich-de-milanesa-de-soja-lechuga-y-tomate-en-pan-de', 'pan-centeno', 2),
  ('sandwich-de-milanesa-de-soja-lechuga-y-tomate-en-pan-de', 'milanesa-soja', 1),
  ('sandwich-de-milanesa-de-soja-lechuga-y-tomate-en-pan-de', 'lechuga', 20),
  ('sandwich-de-milanesa-de-soja-lechuga-y-tomate-en-pan-de', 'tomate', 0.5),
  ('sandwich-de-milanesa-de-soja-lechuga-y-tomate-en-pan-de', 'mayonesa-light', 8),
  ('sandwich-de-queso-crema-salmon-ahumado-y-pepino-en-pan', 'pan-semillas', 2),
  ('sandwich-de-queso-crema-salmon-ahumado-y-pepino-en-pan', 'queso-untable', 30),
  ('sandwich-de-queso-crema-salmon-ahumado-y-pepino-en-pan', 'salmon-ahumado', 40),
  ('sandwich-de-queso-crema-salmon-ahumado-y-pepino-en-pan', 'pepino', 0.5),
  ('sandwich-de-queso-crema-salmon-ahumado-y-pepino-en-pan', 'cebolla-morada', 0.5),
  ('wrap-de-ricota-tomate-y-albahaca', 'wrap-integral', 2),
  ('wrap-de-ricota-tomate-y-albahaca', 'ricota', 70),
  ('wrap-de-ricota-tomate-y-albahaca', 'tomate', 0.5),
  ('wrap-de-ricota-tomate-y-albahaca', 'albahaca', 3),
  ('ciabatta-de-pavita-queso-untable-y-rucula', 'ciabatta', 1),
  ('ciabatta-de-pavita-queso-untable-y-rucula', 'pavita-fiambre', 50),
  ('ciabatta-de-pavita-queso-untable-y-rucula', 'queso-untable-clasico', 30),
  ('ciabatta-de-pavita-queso-untable-y-rucula', 'rucula', 15),
  ('ciabatta-de-pavita-queso-untable-y-rucula', 'tomate', 0.5),
  ('ciabatta-de-pollo-palta-y-tomate', 'ciabatta', 1),
  ('ciabatta-de-pollo-palta-y-tomate', 'pollo-desmenuzado', 80),
  ('ciabatta-de-pollo-palta-y-tomate', 'palta', 0.5),
  ('ciabatta-de-pollo-palta-y-tomate', 'tomate', 0.5),
  ('ciabatta-de-pollo-palta-y-tomate', 'lechuga', 15),
  ('sandwich-de-milanesa-de-soja-lechuga-y-tomate-en-pan-2', 'pan-integral', 3),
  ('sandwich-de-milanesa-de-soja-lechuga-y-tomate-en-pan-2', 'milanesa-soja', 1),
  ('sandwich-de-milanesa-de-soja-lechuga-y-tomate-en-pan-2', 'lechuga', 20),
  ('sandwich-de-milanesa-de-soja-lechuga-y-tomate-en-pan-2', 'tomate', 0.5),
  ('sandwich-de-milanesa-de-soja-lechuga-y-tomate-en-pan-2', 'mayonesa-light', 8),
  ('sandwich-de-pechuga-grillada-palta-y-cherry-en-pan-con', 'pan-semillas', 2),
  ('sandwich-de-pechuga-grillada-palta-y-cherry-en-pan-con', 'pechuga-pollo', 90),
  ('sandwich-de-pechuga-grillada-palta-y-cherry-en-pan-con', 'palta', 0.5),
  ('sandwich-de-pechuga-grillada-palta-y-cherry-en-pan-con', 'tomate-cherry', 40),
  ('sandwich-de-pechuga-grillada-palta-y-cherry-en-pan-con', 'lechuga', 15),
  ('wrap-de-hummus-zanahoria-y-pepino', 'wrap-integral', 2),
  ('wrap-de-hummus-zanahoria-y-pepino', 'hummus', 50),
  ('wrap-de-hummus-zanahoria-y-pepino', 'zanahoria', 0.5),
  ('wrap-de-hummus-zanahoria-y-pepino', 'pepino', 0.5),
  ('wrap-de-hummus-zanahoria-y-pepino', 'lechuga', 15),
  ('wrap-de-queso-crema-salmon-ahumado-y-pepino', 'wrap-integral', 2),
  ('wrap-de-queso-crema-salmon-ahumado-y-pepino', 'queso-untable', 30),
  ('wrap-de-queso-crema-salmon-ahumado-y-pepino', 'salmon-ahumado', 40),
  ('wrap-de-queso-crema-salmon-ahumado-y-pepino', 'pepino', 0.5),
  ('wrap-de-queso-crema-salmon-ahumado-y-pepino', 'cebolla-morada', 0.5),
  ('sandwich-de-huevo-revuelto-tomate-y-queso-en-pan-de', 'pan-centeno', 2),
  ('sandwich-de-huevo-revuelto-tomate-y-queso-en-pan-de', 'huevo', 2),
  ('sandwich-de-huevo-revuelto-tomate-y-queso-en-pan-de', 'tomate', 0.5),
  ('sandwich-de-huevo-revuelto-tomate-y-queso-en-pan-de', 'queso-cremoso', 25),
  ('sandwich-de-huevo-revuelto-tomate-y-queso-en-pan-de', 'aceite', 3),
  ('sandwich-de-queso-crema-salmon-ahumado-y-pepino-en-pan-2', 'pan-integral', 3),
  ('sandwich-de-queso-crema-salmon-ahumado-y-pepino-en-pan-2', 'queso-untable', 30),
  ('sandwich-de-queso-crema-salmon-ahumado-y-pepino-en-pan-2', 'salmon-ahumado', 40),
  ('sandwich-de-queso-crema-salmon-ahumado-y-pepino-en-pan-2', 'pepino', 0.5),
  ('sandwich-de-queso-crema-salmon-ahumado-y-pepino-en-pan-2', 'cebolla-morada', 0.5),
  ('sandwich-de-ricota-tomate-y-albahaca-en-pan-de-centeno', 'pan-centeno', 2),
  ('sandwich-de-ricota-tomate-y-albahaca-en-pan-de-centeno', 'ricota', 70),
  ('sandwich-de-ricota-tomate-y-albahaca-en-pan-de-centeno', 'tomate', 0.5),
  ('sandwich-de-ricota-tomate-y-albahaca-en-pan-de-centeno', 'albahaca', 3),
  ('sandwich-de-berenjena-asada-muzzarella-y-albahaca-en-2', 'pan-centeno', 2),
  ('sandwich-de-berenjena-asada-muzzarella-y-albahaca-en-2', 'berenjena', 0.5),
  ('sandwich-de-berenjena-asada-muzzarella-y-albahaca-en-2', 'muzzarella', 40),
  ('sandwich-de-berenjena-asada-muzzarella-y-albahaca-en-2', 'albahaca', 3),
  ('sandwich-de-berenjena-asada-muzzarella-y-albahaca-en-2', 'aceite', 5),
  ('ciabatta-de-lomito-de-cerdo-rucula-y-mostaza', 'ciabatta', 1),
  ('ciabatta-de-lomito-de-cerdo-rucula-y-mostaza', 'lomo-cerdo', 90),
  ('ciabatta-de-lomito-de-cerdo-rucula-y-mostaza', 'rucula', 15),
  ('ciabatta-de-lomito-de-cerdo-rucula-y-mostaza', 'mostaza', 8),
  ('ciabatta-de-lomito-de-cerdo-rucula-y-mostaza', 'cebolla-caramelizada', 25),
  ('sandwich-de-pavo-mostaza-y-pepinillos-en-pan-integral', 'pan-integral', 3),
  ('sandwich-de-pavo-mostaza-y-pepinillos-en-pan-integral', 'pechuga-pavo', 80),
  ('sandwich-de-pavo-mostaza-y-pepinillos-en-pan-integral', 'mostaza', 8),
  ('sandwich-de-pavo-mostaza-y-pepinillos-en-pan-integral', 'pepinillos', 20),
  ('sandwich-de-pavo-mostaza-y-pepinillos-en-pan-integral', 'lechuga', 15),
  ('sandwich-de-pollo-palta-y-tomate-en-pan-de-centeno', 'pan-centeno', 2),
  ('sandwich-de-pollo-palta-y-tomate-en-pan-de-centeno', 'pollo-desmenuzado', 80),
  ('sandwich-de-pollo-palta-y-tomate-en-pan-de-centeno', 'palta', 0.5),
  ('sandwich-de-pollo-palta-y-tomate-en-pan-de-centeno', 'tomate', 0.5),
  ('sandwich-de-pollo-palta-y-tomate-en-pan-de-centeno', 'lechuga', 15),
  ('sandwich-de-pechuga-grillada-palta-y-cherry-en-pan', 'pan-integral', 3),
  ('sandwich-de-pechuga-grillada-palta-y-cherry-en-pan', 'pechuga-pollo', 90),
  ('sandwich-de-pechuga-grillada-palta-y-cherry-en-pan', 'palta', 0.5),
  ('sandwich-de-pechuga-grillada-palta-y-cherry-en-pan', 'tomate-cherry', 40),
  ('sandwich-de-pechuga-grillada-palta-y-cherry-en-pan', 'lechuga', 15),
  ('sandwich-de-ricota-tomate-y-albahaca-en-pan-integral', 'pan-integral', 3),
  ('sandwich-de-ricota-tomate-y-albahaca-en-pan-integral', 'ricota', 70),
  ('sandwich-de-ricota-tomate-y-albahaca-en-pan-integral', 'tomate', 0.5),
  ('sandwich-de-ricota-tomate-y-albahaca-en-pan-integral', 'albahaca', 3),
  ('sandwich-de-queso-de-cabra-remolacha-y-rucula-en-pan', 'pan-semillas', 2),
  ('sandwich-de-queso-de-cabra-remolacha-y-rucula-en-pan', 'queso-cabra', 40),
  ('sandwich-de-queso-de-cabra-remolacha-y-rucula-en-pan', 'remolacha-cocida', 50),
  ('sandwich-de-queso-de-cabra-remolacha-y-rucula-en-pan', 'rucula', 15),
  ('sandwich-de-queso-de-cabra-remolacha-y-rucula-en-pan', 'nueces', 8),
  ('sandwich-de-huevo-revuelto-tomate-y-queso-en-pan-con', 'pan-semillas', 2),
  ('sandwich-de-huevo-revuelto-tomate-y-queso-en-pan-con', 'huevo', 2),
  ('sandwich-de-huevo-revuelto-tomate-y-queso-en-pan-con', 'tomate', 0.5),
  ('sandwich-de-huevo-revuelto-tomate-y-queso-en-pan-con', 'queso-cremoso', 25),
  ('sandwich-de-huevo-revuelto-tomate-y-queso-en-pan-con', 'aceite', 3),
  ('pan-arabe-de-carne-cebolla-caramelizada-y-queso', 'pan-arabe', 1),
  ('pan-arabe-de-carne-cebolla-caramelizada-y-queso', 'peceto', 80),
  ('pan-arabe-de-carne-cebolla-caramelizada-y-queso', 'cebolla-caramelizada', 30),
  ('pan-arabe-de-carne-cebolla-caramelizada-y-queso', 'queso-port-salut', 30),
  ('pan-arabe-de-carne-cebolla-caramelizada-y-queso', 'rucula', 10),
  ('sandwich-de-carne-cebolla-caramelizada-y-queso-en-pan-2', 'pan-semillas', 2),
  ('sandwich-de-carne-cebolla-caramelizada-y-queso-en-pan-2', 'peceto', 80),
  ('sandwich-de-carne-cebolla-caramelizada-y-queso-en-pan-2', 'cebolla-caramelizada', 30),
  ('sandwich-de-carne-cebolla-caramelizada-y-queso-en-pan-2', 'queso-port-salut', 30),
  ('sandwich-de-carne-cebolla-caramelizada-y-queso-en-pan-2', 'rucula', 10),
  ('sandwich-de-caprese-tomate-muzzarella-y-pesto-en-pan', 'pan-semillas', 2),
  ('sandwich-de-caprese-tomate-muzzarella-y-pesto-en-pan', 'tomate', 0.5),
  ('sandwich-de-caprese-tomate-muzzarella-y-pesto-en-pan', 'muzzarella', 45),
  ('sandwich-de-caprese-tomate-muzzarella-y-pesto-en-pan', 'pesto', 10),
  ('sandwich-de-caprese-tomate-muzzarella-y-pesto-en-pan', 'rucula', 10),
  ('pan-arabe-de-lomito-de-cerdo-rucula-y-mostaza', 'pan-arabe', 1),
  ('pan-arabe-de-lomito-de-cerdo-rucula-y-mostaza', 'lomo-cerdo', 90),
  ('pan-arabe-de-lomito-de-cerdo-rucula-y-mostaza', 'rucula', 15),
  ('pan-arabe-de-lomito-de-cerdo-rucula-y-mostaza', 'mostaza', 8),
  ('pan-arabe-de-lomito-de-cerdo-rucula-y-mostaza', 'cebolla-caramelizada', 25),
  ('sandwich-de-pavita-queso-untable-y-rucula-en-pan-con', 'pan-semillas', 2),
  ('sandwich-de-pavita-queso-untable-y-rucula-en-pan-con', 'pavita-fiambre', 50),
  ('sandwich-de-pavita-queso-untable-y-rucula-en-pan-con', 'queso-untable-clasico', 30),
  ('sandwich-de-pavita-queso-untable-y-rucula-en-pan-con', 'rucula', 15),
  ('sandwich-de-pavita-queso-untable-y-rucula-en-pan-con', 'tomate', 0.5),
  ('ciabatta-de-atun-tomate-y-lechuga', 'ciabatta', 1),
  ('ciabatta-de-atun-tomate-y-lechuga', 'atun-natural', 1),
  ('ciabatta-de-atun-tomate-y-lechuga', 'tomate', 0.5),
  ('ciabatta-de-atun-tomate-y-lechuga', 'lechuga', 20),
  ('ciabatta-de-atun-tomate-y-lechuga', 'mayonesa-light', 10),
  ('ciabatta-de-ricota-tomate-y-albahaca', 'ciabatta', 1),
  ('ciabatta-de-ricota-tomate-y-albahaca', 'ricota', 70),
  ('ciabatta-de-ricota-tomate-y-albahaca', 'tomate', 0.5),
  ('ciabatta-de-ricota-tomate-y-albahaca', 'albahaca', 3),
  ('sandwich-de-tofu-zanahoria-y-brotes-en-pan-integral', 'pan-integral', 3),
  ('sandwich-de-tofu-zanahoria-y-brotes-en-pan-integral', 'tofu', 90),
  ('sandwich-de-tofu-zanahoria-y-brotes-en-pan-integral', 'zanahoria', 0.5),
  ('sandwich-de-tofu-zanahoria-y-brotes-en-pan-integral', 'brotes-soja', 20),
  ('sandwich-de-tofu-zanahoria-y-brotes-en-pan-integral', 'salsa-soja', 8),
  ('sandwich-de-pavita-queso-untable-y-rucula-en-pan', 'pan-integral', 3),
  ('sandwich-de-pavita-queso-untable-y-rucula-en-pan', 'pavita-fiambre', 50),
  ('sandwich-de-pavita-queso-untable-y-rucula-en-pan', 'queso-untable-clasico', 30),
  ('sandwich-de-pavita-queso-untable-y-rucula-en-pan', 'rucula', 15),
  ('sandwich-de-pavita-queso-untable-y-rucula-en-pan', 'tomate', 0.5),
  ('bagel-de-milanesa-de-soja-lechuga-y-tomate', 'bagel', 1),
  ('bagel-de-milanesa-de-soja-lechuga-y-tomate', 'milanesa-soja', 1),
  ('bagel-de-milanesa-de-soja-lechuga-y-tomate', 'lechuga', 20),
  ('bagel-de-milanesa-de-soja-lechuga-y-tomate', 'tomate', 0.5),
  ('bagel-de-milanesa-de-soja-lechuga-y-tomate', 'mayonesa-light', 8),
  ('wrap-de-berenjena-asada-muzzarella-y-albahaca', 'wrap-integral', 2),
  ('wrap-de-berenjena-asada-muzzarella-y-albahaca', 'berenjena', 0.5),
  ('wrap-de-berenjena-asada-muzzarella-y-albahaca', 'muzzarella', 40),
  ('wrap-de-berenjena-asada-muzzarella-y-albahaca', 'albahaca', 3),
  ('wrap-de-berenjena-asada-muzzarella-y-albahaca', 'aceite', 5),
  ('pan-arabe-de-queso-crema-salmon-ahumado-y-pepino', 'pan-arabe', 1),
  ('pan-arabe-de-queso-crema-salmon-ahumado-y-pepino', 'queso-untable', 30),
  ('pan-arabe-de-queso-crema-salmon-ahumado-y-pepino', 'salmon-ahumado', 40),
  ('pan-arabe-de-queso-crema-salmon-ahumado-y-pepino', 'pepino', 0.5),
  ('pan-arabe-de-queso-crema-salmon-ahumado-y-pepino', 'cebolla-morada', 0.5),
  ('pan-arabe-de-ricota-tomate-y-albahaca', 'pan-arabe', 1),
  ('pan-arabe-de-ricota-tomate-y-albahaca', 'ricota', 70),
  ('pan-arabe-de-ricota-tomate-y-albahaca', 'tomate', 0.5),
  ('pan-arabe-de-ricota-tomate-y-albahaca', 'albahaca', 3),
  ('bagel-de-pollo-palta-y-tomate', 'bagel', 1),
  ('bagel-de-pollo-palta-y-tomate', 'pollo-desmenuzado', 80),
  ('bagel-de-pollo-palta-y-tomate', 'palta', 0.5),
  ('bagel-de-pollo-palta-y-tomate', 'tomate', 0.5),
  ('bagel-de-pollo-palta-y-tomate', 'lechuga', 15),
  ('wrap-de-caprese-tomate-muzzarella-y-pesto', 'wrap-integral', 2),
  ('wrap-de-caprese-tomate-muzzarella-y-pesto', 'tomate', 0.5),
  ('wrap-de-caprese-tomate-muzzarella-y-pesto', 'muzzarella', 45),
  ('wrap-de-caprese-tomate-muzzarella-y-pesto', 'pesto', 10),
  ('wrap-de-caprese-tomate-muzzarella-y-pesto', 'rucula', 10),
  ('bagel-de-garbanzos-aplastados-y-palta', 'bagel', 1),
  ('bagel-de-garbanzos-aplastados-y-palta', 'garbanzos-hervidos', 80),
  ('bagel-de-garbanzos-aplastados-y-palta', 'palta', 0.5),
  ('bagel-de-garbanzos-aplastados-y-palta', 'tomate', 0.5),
  ('bagel-de-garbanzos-aplastados-y-palta', 'jengibre', 1),
  ('ciabatta-de-sardinas-tomate-y-cebolla-morada', 'ciabatta', 1),
  ('ciabatta-de-sardinas-tomate-y-cebolla-morada', 'sardinas', 70),
  ('ciabatta-de-sardinas-tomate-y-cebolla-morada', 'tomate', 0.5),
  ('ciabatta-de-sardinas-tomate-y-cebolla-morada', 'cebolla-morada', 0.5),
  ('ciabatta-de-sardinas-tomate-y-cebolla-morada', 'limon-exprimido', 5),
  ('pan-arabe-de-jamon-queso-y-tomate', 'pan-arabe', 1),
  ('pan-arabe-de-jamon-queso-y-tomate', 'jamon-cocido', 35),
  ('pan-arabe-de-jamon-queso-y-tomate', 'queso-port-salut', 35),
  ('pan-arabe-de-jamon-queso-y-tomate', 'tomate', 0.5),
  ('pan-arabe-de-jamon-queso-y-tomate', 'lechuga', 15),
  ('wrap-de-huevo-palta-y-rucula', 'wrap-integral', 2),
  ('wrap-de-huevo-palta-y-rucula', 'huevo', 1),
  ('wrap-de-huevo-palta-y-rucula', 'palta', 0.5),
  ('wrap-de-huevo-palta-y-rucula', 'rucula', 15),
  ('bagel-de-queso-de-cabra-remolacha-y-rucula', 'bagel', 1),
  ('bagel-de-queso-de-cabra-remolacha-y-rucula', 'queso-cabra', 40),
  ('bagel-de-queso-de-cabra-remolacha-y-rucula', 'remolacha-cocida', 50),
  ('bagel-de-queso-de-cabra-remolacha-y-rucula', 'rucula', 15),
  ('bagel-de-queso-de-cabra-remolacha-y-rucula', 'nueces', 8),
  ('sandwich-de-pavita-queso-untable-y-rucula-en-pan-de', 'pan-centeno', 2),
  ('sandwich-de-pavita-queso-untable-y-rucula-en-pan-de', 'pavita-fiambre', 50),
  ('sandwich-de-pavita-queso-untable-y-rucula-en-pan-de', 'queso-untable-clasico', 30),
  ('sandwich-de-pavita-queso-untable-y-rucula-en-pan-de', 'rucula', 15),
  ('sandwich-de-pavita-queso-untable-y-rucula-en-pan-de', 'tomate', 0.5),
  ('ciabatta-de-berenjena-asada-muzzarella-y-albahaca', 'ciabatta', 1),
  ('ciabatta-de-berenjena-asada-muzzarella-y-albahaca', 'berenjena', 0.5),
  ('ciabatta-de-berenjena-asada-muzzarella-y-albahaca', 'muzzarella', 40),
  ('ciabatta-de-berenjena-asada-muzzarella-y-albahaca', 'albahaca', 3),
  ('ciabatta-de-berenjena-asada-muzzarella-y-albahaca', 'aceite', 5),
  ('wrap-de-jamon-queso-y-tomate', 'wrap-integral', 2),
  ('wrap-de-jamon-queso-y-tomate', 'jamon-cocido', 35),
  ('wrap-de-jamon-queso-y-tomate', 'queso-port-salut', 35),
  ('wrap-de-jamon-queso-y-tomate', 'tomate', 0.5),
  ('wrap-de-jamon-queso-y-tomate', 'lechuga', 15),
  ('sandwich-de-huevo-revuelto-tomate-y-queso-en-pan', 'pan-integral', 3),
  ('sandwich-de-huevo-revuelto-tomate-y-queso-en-pan', 'huevo', 2),
  ('sandwich-de-huevo-revuelto-tomate-y-queso-en-pan', 'tomate', 0.5),
  ('sandwich-de-huevo-revuelto-tomate-y-queso-en-pan', 'queso-cremoso', 25),
  ('sandwich-de-huevo-revuelto-tomate-y-queso-en-pan', 'aceite', 3),
  ('wrap-de-milanesa-de-soja-lechuga-y-tomate', 'wrap-integral', 2),
  ('wrap-de-milanesa-de-soja-lechuga-y-tomate', 'milanesa-soja', 1),
  ('wrap-de-milanesa-de-soja-lechuga-y-tomate', 'lechuga', 20),
  ('wrap-de-milanesa-de-soja-lechuga-y-tomate', 'tomate', 0.5),
  ('wrap-de-milanesa-de-soja-lechuga-y-tomate', 'mayonesa-light', 8),
  ('sandwich-de-queso-de-cabra-remolacha-y-rucula-en-pan-2', 'pan-integral', 3),
  ('sandwich-de-queso-de-cabra-remolacha-y-rucula-en-pan-2', 'queso-cabra', 40),
  ('sandwich-de-queso-de-cabra-remolacha-y-rucula-en-pan-2', 'remolacha-cocida', 50),
  ('sandwich-de-queso-de-cabra-remolacha-y-rucula-en-pan-2', 'rucula', 15),
  ('sandwich-de-queso-de-cabra-remolacha-y-rucula-en-pan-2', 'nueces', 8),
  ('wrap-de-pollo-palta-y-tomate', 'wrap-integral', 2),
  ('wrap-de-pollo-palta-y-tomate', 'pollo-desmenuzado', 80),
  ('wrap-de-pollo-palta-y-tomate', 'palta', 0.5),
  ('wrap-de-pollo-palta-y-tomate', 'tomate', 0.5),
  ('wrap-de-pollo-palta-y-tomate', 'lechuga', 15),
  ('pan-arabe-de-berenjena-asada-muzzarella-y-albahaca', 'pan-arabe', 1),
  ('pan-arabe-de-berenjena-asada-muzzarella-y-albahaca', 'berenjena', 0.5),
  ('pan-arabe-de-berenjena-asada-muzzarella-y-albahaca', 'muzzarella', 40),
  ('pan-arabe-de-berenjena-asada-muzzarella-y-albahaca', 'albahaca', 3),
  ('pan-arabe-de-berenjena-asada-muzzarella-y-albahaca', 'aceite', 5),
  ('ciabatta-de-milanesa-de-soja-lechuga-y-tomate', 'ciabatta', 1),
  ('ciabatta-de-milanesa-de-soja-lechuga-y-tomate', 'milanesa-soja', 1),
  ('ciabatta-de-milanesa-de-soja-lechuga-y-tomate', 'lechuga', 20),
  ('ciabatta-de-milanesa-de-soja-lechuga-y-tomate', 'tomate', 0.5),
  ('ciabatta-de-milanesa-de-soja-lechuga-y-tomate', 'mayonesa-light', 8),
  ('sandwich-de-garbanzos-aplastados-y-palta-en-pan-de', 'pan-centeno', 2),
  ('sandwich-de-garbanzos-aplastados-y-palta-en-pan-de', 'garbanzos-hervidos', 80),
  ('sandwich-de-garbanzos-aplastados-y-palta-en-pan-de', 'palta', 0.5),
  ('sandwich-de-garbanzos-aplastados-y-palta-en-pan-de', 'tomate', 0.5),
  ('sandwich-de-garbanzos-aplastados-y-palta-en-pan-de', 'jengibre', 1),
  ('sandwich-de-pollo-palta-y-tomate-en-pan-integral', 'pan-integral', 3),
  ('sandwich-de-pollo-palta-y-tomate-en-pan-integral', 'pollo-desmenuzado', 80),
  ('sandwich-de-pollo-palta-y-tomate-en-pan-integral', 'palta', 0.5),
  ('sandwich-de-pollo-palta-y-tomate-en-pan-integral', 'tomate', 0.5),
  ('sandwich-de-pollo-palta-y-tomate-en-pan-integral', 'lechuga', 15),
  ('sandwich-de-berenjena-asada-muzzarella-y-albahaca-en-3', 'pan-integral', 3),
  ('sandwich-de-berenjena-asada-muzzarella-y-albahaca-en-3', 'berenjena', 0.5),
  ('sandwich-de-berenjena-asada-muzzarella-y-albahaca-en-3', 'muzzarella', 40),
  ('sandwich-de-berenjena-asada-muzzarella-y-albahaca-en-3', 'albahaca', 3),
  ('sandwich-de-berenjena-asada-muzzarella-y-albahaca-en-3', 'aceite', 5),
  ('ciabatta-de-queso-crema-salmon-ahumado-y-pepino', 'ciabatta', 1),
  ('ciabatta-de-queso-crema-salmon-ahumado-y-pepino', 'queso-untable', 30),
  ('ciabatta-de-queso-crema-salmon-ahumado-y-pepino', 'salmon-ahumado', 40),
  ('ciabatta-de-queso-crema-salmon-ahumado-y-pepino', 'pepino', 0.5),
  ('ciabatta-de-queso-crema-salmon-ahumado-y-pepino', 'cebolla-morada', 0.5),
  ('sandwich-de-lomito-de-cerdo-rucula-y-mostaza-en-pan-de', 'pan-centeno', 2),
  ('sandwich-de-lomito-de-cerdo-rucula-y-mostaza-en-pan-de', 'lomo-cerdo', 90),
  ('sandwich-de-lomito-de-cerdo-rucula-y-mostaza-en-pan-de', 'rucula', 15),
  ('sandwich-de-lomito-de-cerdo-rucula-y-mostaza-en-pan-de', 'mostaza', 8),
  ('sandwich-de-lomito-de-cerdo-rucula-y-mostaza-en-pan-de', 'cebolla-caramelizada', 25),
  ('wrap-de-atun-tomate-y-lechuga', 'wrap-integral', 2),
  ('wrap-de-atun-tomate-y-lechuga', 'atun-natural', 1),
  ('wrap-de-atun-tomate-y-lechuga', 'tomate', 0.5),
  ('wrap-de-atun-tomate-y-lechuga', 'lechuga', 20),
  ('wrap-de-atun-tomate-y-lechuga', 'mayonesa-light', 10),
  ('tostadas-de-tostadas-integrales-con-huevo-revuelto-y', 'tostadas-integrales', 4),
  ('tostadas-de-tostadas-integrales-con-huevo-revuelto-y', 'huevo', 2),
  ('tostadas-de-tostadas-integrales-con-huevo-revuelto-y', 'espinaca', 30),
  ('tostadas-de-tostadas-integrales-con-huevo-revuelto-y', 'aceite', 3),
  ('tostadas-de-tostadas-integrales-con-atun-y-palta', 'tostadas-integrales', 4),
  ('tostadas-de-tostadas-integrales-con-atun-y-palta', 'atun-natural', 0.5),
  ('tostadas-de-tostadas-integrales-con-atun-y-palta', 'palta', 0.5),
  ('tostadas-de-tostadas-integrales-con-atun-y-palta', 'limon-exprimido', 5),
  ('tostadas-de-tostadas-integrales-con-queso-untable-y', 'tostadas-integrales', 4),
  ('tostadas-de-tostadas-integrales-con-queso-untable-y', 'queso-untable', 35),
  ('tostadas-de-tostadas-integrales-con-queso-untable-y', 'tomate', 0.5),
  ('tostadas-de-tostadas-integrales-con-queso-untable-y', 'albahaca', 2),
  ('tostadas-de-tostadas-integrales-con-mantequilla-de-mani', 'tostadas-integrales', 4),
  ('tostadas-de-tostadas-integrales-con-mantequilla-de-mani', 'mani-pasta', 20),
  ('tostadas-de-tostadas-integrales-con-mantequilla-de-mani', 'banana', 1),
  ('tostadas-de-pan-con-semillas-con-hummus-tomate-y', 'pan-semillas', 2),
  ('tostadas-de-pan-con-semillas-con-hummus-tomate-y', 'hummus', 50),
  ('tostadas-de-pan-con-semillas-con-hummus-tomate-y', 'tomate', 0.5),
  ('tostadas-de-pan-con-semillas-con-hummus-tomate-y', 'semillas-girasol', 6),
  ('tostadas-de-pan-integral-con-salmon-ahumado-y-queso', 'pan-integral', 2),
  ('tostadas-de-pan-integral-con-salmon-ahumado-y-queso', 'salmon-ahumado', 40),
  ('tostadas-de-pan-integral-con-salmon-ahumado-y-queso', 'queso-untable', 30),
  ('tostadas-de-pan-integral-con-salmon-ahumado-y-queso', 'pepino', 0.5),
  ('tostadas-de-pan-integral-con-salmon-ahumado-y-queso', 'cebolla-verdeo', 5),
  ('tostadas-de-pan-de-centeno-con-ricota-y-mermelada-de', 'pan-centeno', 2),
  ('tostadas-de-pan-de-centeno-con-ricota-y-mermelada-de', 'ricota', 60),
  ('tostadas-de-pan-de-centeno-con-ricota-y-mermelada-de', 'mermelada-light', 15),
  ('tostadas-de-pan-de-centeno-con-ricota-y-mermelada-de', 'frutilla', 40),
  ('tostadas-de-pan-de-centeno-con-salmon-ahumado-y-queso', 'pan-centeno', 2),
  ('tostadas-de-pan-de-centeno-con-salmon-ahumado-y-queso', 'salmon-ahumado', 40),
  ('tostadas-de-pan-de-centeno-con-salmon-ahumado-y-queso', 'queso-untable', 30),
  ('tostadas-de-pan-de-centeno-con-salmon-ahumado-y-queso', 'pepino', 0.5),
  ('tostadas-de-pan-de-centeno-con-salmon-ahumado-y-queso', 'cebolla-verdeo', 5),
  ('tostadas-de-pan-de-centeno-con-palta-y-huevo-poche', 'pan-centeno', 2),
  ('tostadas-de-pan-de-centeno-con-palta-y-huevo-poche', 'palta', 0.5),
  ('tostadas-de-pan-de-centeno-con-palta-y-huevo-poche', 'huevo', 1),
  ('tostadas-de-tostadas-integrales-con-ricota-y-mermelada', 'tostadas-integrales', 4),
  ('tostadas-de-tostadas-integrales-con-ricota-y-mermelada', 'ricota', 60),
  ('tostadas-de-tostadas-integrales-con-ricota-y-mermelada', 'mermelada-light', 15),
  ('tostadas-de-tostadas-integrales-con-ricota-y-mermelada', 'frutilla', 40),
  ('tostadas-de-pan-de-centeno-con-hummus-tomate-y-semillas', 'pan-centeno', 2),
  ('tostadas-de-pan-de-centeno-con-hummus-tomate-y-semillas', 'hummus', 50),
  ('tostadas-de-pan-de-centeno-con-hummus-tomate-y-semillas', 'tomate', 0.5),
  ('tostadas-de-pan-de-centeno-con-hummus-tomate-y-semillas', 'semillas-girasol', 6),
  ('tostadas-de-pan-de-centeno-con-tomate-asado-ricota-y', 'pan-centeno', 2),
  ('tostadas-de-pan-de-centeno-con-tomate-asado-ricota-y', 'tomate', 1),
  ('tostadas-de-pan-de-centeno-con-tomate-asado-ricota-y', 'ricota', 50),
  ('tostadas-de-pan-de-centeno-con-tomate-asado-ricota-y', 'albahaca', 2),
  ('tostadas-de-pan-de-centeno-con-tomate-asado-ricota-y', 'aceite-oliva', 4),
  ('tostadas-de-tostadas-integrales-con-tomate-asado-ricota', 'tostadas-integrales', 4),
  ('tostadas-de-tostadas-integrales-con-tomate-asado-ricota', 'tomate', 1),
  ('tostadas-de-tostadas-integrales-con-tomate-asado-ricota', 'ricota', 50),
  ('tostadas-de-tostadas-integrales-con-tomate-asado-ricota', 'albahaca', 2),
  ('tostadas-de-tostadas-integrales-con-tomate-asado-ricota', 'aceite-oliva', 4),
  ('tostadas-de-pan-integral-con-queso-untable-y-tomate', 'pan-integral', 2),
  ('tostadas-de-pan-integral-con-queso-untable-y-tomate', 'queso-untable', 35),
  ('tostadas-de-pan-integral-con-queso-untable-y-tomate', 'tomate', 0.5),
  ('tostadas-de-pan-integral-con-queso-untable-y-tomate', 'albahaca', 2),
  ('tostadas-de-pan-con-semillas-con-palta-y-huevo-poche', 'pan-semillas', 2),
  ('tostadas-de-pan-con-semillas-con-palta-y-huevo-poche', 'palta', 0.5),
  ('tostadas-de-pan-con-semillas-con-palta-y-huevo-poche', 'huevo', 1),
  ('tostadas-de-pan-con-semillas-con-ricota-y-mermelada-de', 'pan-semillas', 2),
  ('tostadas-de-pan-con-semillas-con-ricota-y-mermelada-de', 'ricota', 60),
  ('tostadas-de-pan-con-semillas-con-ricota-y-mermelada-de', 'mermelada-light', 15),
  ('tostadas-de-pan-con-semillas-con-ricota-y-mermelada-de', 'frutilla', 40),
  ('tostadas-de-pan-de-centeno-con-mantequilla-de-mani-y', 'pan-centeno', 2),
  ('tostadas-de-pan-de-centeno-con-mantequilla-de-mani-y', 'mani-pasta', 20),
  ('tostadas-de-pan-de-centeno-con-mantequilla-de-mani-y', 'banana', 1),
  ('tostadas-de-pan-de-centeno-con-champinones-y-queso', 'pan-centeno', 2),
  ('tostadas-de-pan-de-centeno-con-champinones-y-queso', 'champinones', 90),
  ('tostadas-de-pan-de-centeno-con-champinones-y-queso', 'queso-cremoso', 30),
  ('tostadas-de-pan-de-centeno-con-champinones-y-queso', 'aceite', 4),
  ('tostadas-de-pan-integral-con-champinones-y-queso', 'pan-integral', 2),
  ('tostadas-de-pan-integral-con-champinones-y-queso', 'champinones', 90),
  ('tostadas-de-pan-integral-con-champinones-y-queso', 'queso-cremoso', 30),
  ('tostadas-de-pan-integral-con-champinones-y-queso', 'aceite', 4),
  ('tostadas-de-tostadas-integrales-con-palta-y-huevo-poche', 'tostadas-integrales', 4),
  ('tostadas-de-tostadas-integrales-con-palta-y-huevo-poche', 'palta', 0.5),
  ('tostadas-de-tostadas-integrales-con-palta-y-huevo-poche', 'huevo', 1),
  ('tostadas-de-pan-con-semillas-con-champinones-y-queso', 'pan-semillas', 2),
  ('tostadas-de-pan-con-semillas-con-champinones-y-queso', 'champinones', 90),
  ('tostadas-de-pan-con-semillas-con-champinones-y-queso', 'queso-cremoso', 30),
  ('tostadas-de-pan-con-semillas-con-champinones-y-queso', 'aceite', 4),
  ('tostadas-de-pan-de-centeno-con-queso-untable-y-tomate', 'pan-centeno', 2),
  ('tostadas-de-pan-de-centeno-con-queso-untable-y-tomate', 'queso-untable', 35),
  ('tostadas-de-pan-de-centeno-con-queso-untable-y-tomate', 'tomate', 0.5),
  ('tostadas-de-pan-de-centeno-con-queso-untable-y-tomate', 'albahaca', 2),
  ('tostadas-de-pan-con-semillas-con-banana-avena-y-canela', 'pan-semillas', 2),
  ('tostadas-de-pan-con-semillas-con-banana-avena-y-canela', 'banana', 1),
  ('tostadas-de-pan-con-semillas-con-banana-avena-y-canela', 'yogur-natural', 40),
  ('tostadas-de-pan-con-semillas-con-banana-avena-y-canela', 'avena', 10),
  ('tostadas-de-pan-de-centeno-con-ricota-miel-y-nueces', 'pan-centeno', 2),
  ('tostadas-de-pan-de-centeno-con-ricota-miel-y-nueces', 'ricota', 70),
  ('tostadas-de-pan-de-centeno-con-ricota-miel-y-nueces', 'miel', 8),
  ('tostadas-de-pan-de-centeno-con-ricota-miel-y-nueces', 'nueces', 10),
  ('tostadas-de-pan-con-semillas-con-huevo-revuelto-y', 'pan-semillas', 2),
  ('tostadas-de-pan-con-semillas-con-huevo-revuelto-y', 'huevo', 2),
  ('tostadas-de-pan-con-semillas-con-huevo-revuelto-y', 'espinaca', 30),
  ('tostadas-de-pan-con-semillas-con-huevo-revuelto-y', 'aceite', 3),
  ('tostadas-de-tostadas-integrales-con-banana-avena-y', 'tostadas-integrales', 4),
  ('tostadas-de-tostadas-integrales-con-banana-avena-y', 'banana', 1),
  ('tostadas-de-tostadas-integrales-con-banana-avena-y', 'yogur-natural', 40),
  ('tostadas-de-tostadas-integrales-con-banana-avena-y', 'avena', 10),
  ('tostadas-de-pan-integral-con-atun-y-palta', 'pan-integral', 2),
  ('tostadas-de-pan-integral-con-atun-y-palta', 'atun-natural', 0.5),
  ('tostadas-de-pan-integral-con-atun-y-palta', 'palta', 0.5),
  ('tostadas-de-pan-integral-con-atun-y-palta', 'limon-exprimido', 5),
  ('tostadas-de-pan-con-semillas-con-salmon-ahumado-y-queso', 'pan-semillas', 2),
  ('tostadas-de-pan-con-semillas-con-salmon-ahumado-y-queso', 'salmon-ahumado', 40),
  ('tostadas-de-pan-con-semillas-con-salmon-ahumado-y-queso', 'queso-untable', 30),
  ('tostadas-de-pan-con-semillas-con-salmon-ahumado-y-queso', 'pepino', 0.5),
  ('tostadas-de-pan-con-semillas-con-salmon-ahumado-y-queso', 'cebolla-verdeo', 5),
  ('tostadas-de-pan-de-centeno-con-atun-y-palta', 'pan-centeno', 2),
  ('tostadas-de-pan-de-centeno-con-atun-y-palta', 'atun-natural', 0.5),
  ('tostadas-de-pan-de-centeno-con-atun-y-palta', 'palta', 0.5),
  ('tostadas-de-pan-de-centeno-con-atun-y-palta', 'limon-exprimido', 5),
  ('tostadas-de-tostadas-integrales-con-hummus-tomate-y', 'tostadas-integrales', 4),
  ('tostadas-de-tostadas-integrales-con-hummus-tomate-y', 'hummus', 50),
  ('tostadas-de-tostadas-integrales-con-hummus-tomate-y', 'tomate', 0.5),
  ('tostadas-de-tostadas-integrales-con-hummus-tomate-y', 'semillas-girasol', 6),
  ('tostadas-de-pan-integral-con-hummus-tomate-y-semillas', 'pan-integral', 2),
  ('tostadas-de-pan-integral-con-hummus-tomate-y-semillas', 'hummus', 50),
  ('tostadas-de-pan-integral-con-hummus-tomate-y-semillas', 'tomate', 0.5),
  ('tostadas-de-pan-integral-con-hummus-tomate-y-semillas', 'semillas-girasol', 6),
  ('tostadas-de-tostadas-integrales-con-ricota-miel-y-nueces', 'tostadas-integrales', 4),
  ('tostadas-de-tostadas-integrales-con-ricota-miel-y-nueces', 'ricota', 70),
  ('tostadas-de-tostadas-integrales-con-ricota-miel-y-nueces', 'miel', 8),
  ('tostadas-de-tostadas-integrales-con-ricota-miel-y-nueces', 'nueces', 10),
  ('tostadas-de-pan-integral-con-palta-y-huevo-poche', 'pan-integral', 2),
  ('tostadas-de-pan-integral-con-palta-y-huevo-poche', 'palta', 0.5),
  ('tostadas-de-pan-integral-con-palta-y-huevo-poche', 'huevo', 1),
  ('tostadas-de-pan-integral-con-ricota-y-mermelada-de', 'pan-integral', 2),
  ('tostadas-de-pan-integral-con-ricota-y-mermelada-de', 'ricota', 60),
  ('tostadas-de-pan-integral-con-ricota-y-mermelada-de', 'mermelada-light', 15),
  ('tostadas-de-pan-integral-con-ricota-y-mermelada-de', 'frutilla', 40),
  ('tostadas-de-tostadas-integrales-con-salmon-ahumado-y', 'tostadas-integrales', 4),
  ('tostadas-de-tostadas-integrales-con-salmon-ahumado-y', 'salmon-ahumado', 40),
  ('tostadas-de-tostadas-integrales-con-salmon-ahumado-y', 'queso-untable', 30),
  ('tostadas-de-tostadas-integrales-con-salmon-ahumado-y', 'pepino', 0.5),
  ('tostadas-de-tostadas-integrales-con-salmon-ahumado-y', 'cebolla-verdeo', 5),
  ('tostadas-de-pan-integral-con-banana-avena-y-canela', 'pan-integral', 2),
  ('tostadas-de-pan-integral-con-banana-avena-y-canela', 'banana', 1),
  ('tostadas-de-pan-integral-con-banana-avena-y-canela', 'yogur-natural', 40),
  ('tostadas-de-pan-integral-con-banana-avena-y-canela', 'avena', 10),
  ('bowl-de-burgol-pollo-y-kale-mango-y-cebolla-morada', 'burgol-hervido', 150),
  ('bowl-de-burgol-pollo-y-kale-mango-y-cebolla-morada', 'pechuga-pollo', 110),
  ('bowl-de-burgol-pollo-y-kale-mango-y-cebolla-morada', 'kale', 40),
  ('bowl-de-burgol-pollo-y-kale-mango-y-cebolla-morada', 'mango', 50),
  ('bowl-de-burgol-pollo-y-kale-mango-y-cebolla-morada', 'cebolla-morada', 0.5),
  ('bowl-de-burgol-pollo-y-kale-mango-y-cebolla-morada', 'yogur-natural', 50),
  ('bowl-de-burgol-pollo-y-kale-mango-y-cebolla-morada', 'menta', 2),
  ('bowl-de-burgol-pollo-y-kale-mango-y-cebolla-morada', 'limon-exprimido', 5),
  ('bowl-de-burgol-langostinos-y-hojas-verdes-manzana-y-apio', 'burgol-hervido', 150),
  ('bowl-de-burgol-langostinos-y-hojas-verdes-manzana-y-apio', 'langostinos', 110),
  ('bowl-de-burgol-langostinos-y-hojas-verdes-manzana-y-apio', 'ajo', 0.5),
  ('bowl-de-burgol-langostinos-y-hojas-verdes-manzana-y-apio', 'aceite', 4),
  ('bowl-de-burgol-langostinos-y-hojas-verdes-manzana-y-apio', 'hojas-verdes', 40),
  ('bowl-de-burgol-langostinos-y-hojas-verdes-manzana-y-apio', 'manzana-verde', 0.5),
  ('bowl-de-burgol-langostinos-y-hojas-verdes-manzana-y-apio', 'apio', 30),
  ('bowl-de-burgol-langostinos-y-hojas-verdes-manzana-y-apio', 'pesto', 15),
  ('bowl-de-fideos-de-arroz-tempeh-y-kale-mango-y-cebolla', 'fideos-arroz-hervidos', 150),
  ('bowl-de-fideos-de-arroz-tempeh-y-kale-mango-y-cebolla', 'tempeh', 100),
  ('bowl-de-fideos-de-arroz-tempeh-y-kale-mango-y-cebolla', 'salsa-soja', 8),
  ('bowl-de-fideos-de-arroz-tempeh-y-kale-mango-y-cebolla', 'kale', 40),
  ('bowl-de-fideos-de-arroz-tempeh-y-kale-mango-y-cebolla', 'mango', 50),
  ('bowl-de-fideos-de-arroz-tempeh-y-kale-mango-y-cebolla', 'cebolla-morada', 0.5),
  ('bowl-de-fideos-de-arroz-tempeh-y-kale-mango-y-cebolla', 'pesto', 15),
  ('bowl-de-cuscus-huevo-y-kale-mango-y-cebolla-morada', 'cuscus-hervido', 150),
  ('bowl-de-cuscus-huevo-y-kale-mango-y-cebolla-morada', 'huevo', 2),
  ('bowl-de-cuscus-huevo-y-kale-mango-y-cebolla-morada', 'kale', 40),
  ('bowl-de-cuscus-huevo-y-kale-mango-y-cebolla-morada', 'mango', 50),
  ('bowl-de-cuscus-huevo-y-kale-mango-y-cebolla-morada', 'cebolla-morada', 0.5),
  ('bowl-de-cuscus-huevo-y-kale-mango-y-cebolla-morada', 'guacamole', 40),
  ('bowl-de-burgol-salmon-y-palta-pepino-y-zanahoria', 'burgol-hervido', 150),
  ('bowl-de-burgol-salmon-y-palta-pepino-y-zanahoria', 'salmon', 110),
  ('bowl-de-burgol-salmon-y-palta-pepino-y-zanahoria', 'palta', 0.5),
  ('bowl-de-burgol-salmon-y-palta-pepino-y-zanahoria', 'pepino', 0.5),
  ('bowl-de-burgol-salmon-y-palta-pepino-y-zanahoria', 'zanahoria-rallada', 50),
  ('bowl-de-burgol-salmon-y-palta-pepino-y-zanahoria', 'pesto', 15),
  ('bowl-de-fideos-de-arroz-tempeh-y-palta-pepino-y', 'fideos-arroz-hervidos', 150),
  ('bowl-de-fideos-de-arroz-tempeh-y-palta-pepino-y', 'tempeh', 100),
  ('bowl-de-fideos-de-arroz-tempeh-y-palta-pepino-y', 'salsa-soja', 8),
  ('bowl-de-fideos-de-arroz-tempeh-y-palta-pepino-y', 'palta', 0.5),
  ('bowl-de-fideos-de-arroz-tempeh-y-palta-pepino-y', 'pepino', 0.5),
  ('bowl-de-fideos-de-arroz-tempeh-y-palta-pepino-y', 'zanahoria-rallada', 50),
  ('bowl-de-fideos-de-arroz-tempeh-y-palta-pepino-y', 'yogur-natural', 50),
  ('bowl-de-fideos-de-arroz-tempeh-y-palta-pepino-y', 'menta', 2),
  ('bowl-de-fideos-de-arroz-tempeh-y-palta-pepino-y', 'limon-exprimido', 5),
  ('bowl-de-burgol-tempeh-y-palta-pepino-y-zanahoria', 'burgol-hervido', 150),
  ('bowl-de-burgol-tempeh-y-palta-pepino-y-zanahoria', 'tempeh', 100),
  ('bowl-de-burgol-tempeh-y-palta-pepino-y-zanahoria', 'salsa-soja', 8),
  ('bowl-de-burgol-tempeh-y-palta-pepino-y-zanahoria', 'palta', 0.5),
  ('bowl-de-burgol-tempeh-y-palta-pepino-y-zanahoria', 'pepino', 0.5),
  ('bowl-de-burgol-tempeh-y-palta-pepino-y-zanahoria', 'zanahoria-rallada', 50),
  ('bowl-de-burgol-tempeh-y-palta-pepino-y-zanahoria', 'yogur-natural', 50),
  ('bowl-de-burgol-tempeh-y-palta-pepino-y-zanahoria', 'menta', 2),
  ('bowl-de-burgol-tempeh-y-palta-pepino-y-zanahoria', 'limon-exprimido', 5),
  ('bowl-de-batata-asada-atun-y-palta-pepino-y-zanahoria', 'batata', 180),
  ('bowl-de-batata-asada-atun-y-palta-pepino-y-zanahoria', 'aceite', 5),
  ('bowl-de-batata-asada-atun-y-palta-pepino-y-zanahoria', 'atun-natural', 1),
  ('bowl-de-batata-asada-atun-y-palta-pepino-y-zanahoria', 'palta', 0.5),
  ('bowl-de-batata-asada-atun-y-palta-pepino-y-zanahoria', 'pepino', 0.5),
  ('bowl-de-batata-asada-atun-y-palta-pepino-y-zanahoria', 'zanahoria-rallada', 50),
  ('bowl-de-batata-asada-atun-y-palta-pepino-y-zanahoria', 'tahini', 10),
  ('bowl-de-batata-asada-atun-y-palta-pepino-y-zanahoria', 'limon-exprimido', 10),
  ('bowl-de-batata-asada-atun-y-repollo-colorado-edamame-y', 'batata', 180),
  ('bowl-de-batata-asada-atun-y-repollo-colorado-edamame-y', 'aceite', 5),
  ('bowl-de-batata-asada-atun-y-repollo-colorado-edamame-y', 'atun-natural', 1),
  ('bowl-de-batata-asada-atun-y-repollo-colorado-edamame-y', 'repollo-colorado', 50),
  ('bowl-de-batata-asada-atun-y-repollo-colorado-edamame-y', 'edamame', 50),
  ('bowl-de-batata-asada-atun-y-repollo-colorado-edamame-y', 'zanahoria-rallada', 40),
  ('bowl-de-batata-asada-atun-y-repollo-colorado-edamame-y', 'yogur-natural', 50),
  ('bowl-de-batata-asada-atun-y-repollo-colorado-edamame-y', 'menta', 2),
  ('bowl-de-batata-asada-atun-y-repollo-colorado-edamame-y', 'limon-exprimido', 5),
  ('bowl-de-batata-asada-langostinos-y-palta-pepino-y', 'batata', 180),
  ('bowl-de-batata-asada-langostinos-y-palta-pepino-y', 'aceite', 9),
  ('bowl-de-batata-asada-langostinos-y-palta-pepino-y', 'langostinos', 110),
  ('bowl-de-batata-asada-langostinos-y-palta-pepino-y', 'ajo', 0.5),
  ('bowl-de-batata-asada-langostinos-y-palta-pepino-y', 'palta', 0.5),
  ('bowl-de-batata-asada-langostinos-y-palta-pepino-y', 'pepino', 0.5),
  ('bowl-de-batata-asada-langostinos-y-palta-pepino-y', 'zanahoria-rallada', 50),
  ('bowl-de-batata-asada-langostinos-y-palta-pepino-y', 'pesto', 15),
  ('bowl-de-arroz-integral-huevo-y-brocoli-choclo-y-tomate', 'arroz-integral-hervido', 150),
  ('bowl-de-arroz-integral-huevo-y-brocoli-choclo-y-tomate', 'huevo', 2),
  ('bowl-de-arroz-integral-huevo-y-brocoli-choclo-y-tomate', 'brocoli', 80),
  ('bowl-de-arroz-integral-huevo-y-brocoli-choclo-y-tomate', 'choclo', 50),
  ('bowl-de-arroz-integral-huevo-y-brocoli-choclo-y-tomate', 'tomate-cherry', 60),
  ('bowl-de-arroz-integral-huevo-y-brocoli-choclo-y-tomate', 'salsa-soja', 10),
  ('bowl-de-arroz-integral-huevo-y-brocoli-choclo-y-tomate', 'jengibre', 2),
  ('bowl-de-arroz-integral-huevo-y-brocoli-choclo-y-tomate', 'aceite-sesamo', 4),
  ('bowl-de-burgol-pollo-y-palta-pepino-y-zanahoria', 'burgol-hervido', 150),
  ('bowl-de-burgol-pollo-y-palta-pepino-y-zanahoria', 'pechuga-pollo', 110),
  ('bowl-de-burgol-pollo-y-palta-pepino-y-zanahoria', 'palta', 0.5),
  ('bowl-de-burgol-pollo-y-palta-pepino-y-zanahoria', 'pepino', 0.5),
  ('bowl-de-burgol-pollo-y-palta-pepino-y-zanahoria', 'zanahoria-rallada', 50),
  ('bowl-de-burgol-pollo-y-palta-pepino-y-zanahoria', 'guacamole', 40),
  ('bowl-de-quinoa-tempeh-y-espinaca-remolacha-y-semillas', 'quinoa-hervida', 150),
  ('bowl-de-quinoa-tempeh-y-espinaca-remolacha-y-semillas', 'tempeh', 100),
  ('bowl-de-quinoa-tempeh-y-espinaca-remolacha-y-semillas', 'salsa-soja', 8),
  ('bowl-de-quinoa-tempeh-y-espinaca-remolacha-y-semillas', 'espinaca', 40),
  ('bowl-de-quinoa-tempeh-y-espinaca-remolacha-y-semillas', 'remolacha-cocida', 60),
  ('bowl-de-quinoa-tempeh-y-espinaca-remolacha-y-semillas', 'semillas-girasol', 8),
  ('bowl-de-quinoa-tempeh-y-espinaca-remolacha-y-semillas', 'tahini', 10),
  ('bowl-de-quinoa-tempeh-y-espinaca-remolacha-y-semillas', 'limon-exprimido', 10),
  ('bowl-de-cuscus-pollo-y-repollo-colorado-edamame-y', 'cuscus-hervido', 150),
  ('bowl-de-cuscus-pollo-y-repollo-colorado-edamame-y', 'pechuga-pollo', 110),
  ('bowl-de-cuscus-pollo-y-repollo-colorado-edamame-y', 'repollo-colorado', 50),
  ('bowl-de-cuscus-pollo-y-repollo-colorado-edamame-y', 'edamame', 50),
  ('bowl-de-cuscus-pollo-y-repollo-colorado-edamame-y', 'zanahoria-rallada', 40),
  ('bowl-de-cuscus-pollo-y-repollo-colorado-edamame-y', 'pesto', 15),
  ('bowl-de-batata-asada-pollo-y-kale-mango-y-cebolla-morada', 'batata', 180),
  ('bowl-de-batata-asada-pollo-y-kale-mango-y-cebolla-morada', 'aceite', 5),
  ('bowl-de-batata-asada-pollo-y-kale-mango-y-cebolla-morada', 'pechuga-pollo', 110),
  ('bowl-de-batata-asada-pollo-y-kale-mango-y-cebolla-morada', 'kale', 40),
  ('bowl-de-batata-asada-pollo-y-kale-mango-y-cebolla-morada', 'mango', 50),
  ('bowl-de-batata-asada-pollo-y-kale-mango-y-cebolla-morada', 'cebolla-morada', 0.5),
  ('bowl-de-batata-asada-pollo-y-kale-mango-y-cebolla-morada', 'yogur-natural', 50),
  ('bowl-de-batata-asada-pollo-y-kale-mango-y-cebolla-morada', 'menta', 2),
  ('bowl-de-batata-asada-pollo-y-kale-mango-y-cebolla-morada', 'limon-exprimido', 5),
  ('bowl-de-batata-asada-garbanzos-y-palta-pepino-y', 'batata', 180),
  ('bowl-de-batata-asada-garbanzos-y-palta-pepino-y', 'aceite', 9),
  ('bowl-de-batata-asada-garbanzos-y-palta-pepino-y', 'garbanzos-hervidos', 120),
  ('bowl-de-batata-asada-garbanzos-y-palta-pepino-y', 'palta', 0.5),
  ('bowl-de-batata-asada-garbanzos-y-palta-pepino-y', 'pepino', 0.5),
  ('bowl-de-batata-asada-garbanzos-y-palta-pepino-y', 'zanahoria-rallada', 50),
  ('bowl-de-batata-asada-garbanzos-y-palta-pepino-y', 'yogur-natural', 50),
  ('bowl-de-batata-asada-garbanzos-y-palta-pepino-y', 'menta', 2),
  ('bowl-de-batata-asada-garbanzos-y-palta-pepino-y', 'limon-exprimido', 5),
  ('bowl-de-arroz-integral-atun-y-palta-pepino-y-zanahoria', 'arroz-integral-hervido', 150),
  ('bowl-de-arroz-integral-atun-y-palta-pepino-y-zanahoria', 'atun-natural', 1),
  ('bowl-de-arroz-integral-atun-y-palta-pepino-y-zanahoria', 'palta', 0.5),
  ('bowl-de-arroz-integral-atun-y-palta-pepino-y-zanahoria', 'pepino', 0.5),
  ('bowl-de-arroz-integral-atun-y-palta-pepino-y-zanahoria', 'zanahoria-rallada', 50),
  ('bowl-de-arroz-integral-atun-y-palta-pepino-y-zanahoria', 'tahini', 10),
  ('bowl-de-arroz-integral-atun-y-palta-pepino-y-zanahoria', 'limon-exprimido', 10),
  ('bowl-de-quinoa-carne-y-brocoli-choclo-y-tomate-cherry', 'quinoa-hervida', 150),
  ('bowl-de-quinoa-carne-y-brocoli-choclo-y-tomate-cherry', 'peceto', 100),
  ('bowl-de-quinoa-carne-y-brocoli-choclo-y-tomate-cherry', 'brocoli', 80),
  ('bowl-de-quinoa-carne-y-brocoli-choclo-y-tomate-cherry', 'choclo', 50),
  ('bowl-de-quinoa-carne-y-brocoli-choclo-y-tomate-cherry', 'tomate-cherry', 60),
  ('bowl-de-quinoa-carne-y-brocoli-choclo-y-tomate-cherry', 'tahini', 10),
  ('bowl-de-quinoa-carne-y-brocoli-choclo-y-tomate-cherry', 'limon-exprimido', 10),
  ('bowl-de-quinoa-tofu-y-hojas-verdes-manzana-y-apio', 'quinoa-hervida', 150),
  ('bowl-de-quinoa-tofu-y-hojas-verdes-manzana-y-apio', 'tofu', 120),
  ('bowl-de-quinoa-tofu-y-hojas-verdes-manzana-y-apio', 'salsa-soja', 20),
  ('bowl-de-quinoa-tofu-y-hojas-verdes-manzana-y-apio', 'aceite-sesamo', 8),
  ('bowl-de-quinoa-tofu-y-hojas-verdes-manzana-y-apio', 'hojas-verdes', 40),
  ('bowl-de-quinoa-tofu-y-hojas-verdes-manzana-y-apio', 'manzana-verde', 0.5),
  ('bowl-de-quinoa-tofu-y-hojas-verdes-manzana-y-apio', 'apio', 30),
  ('bowl-de-quinoa-tofu-y-hojas-verdes-manzana-y-apio', 'jengibre', 2),
  ('bowl-de-fideos-de-arroz-pollo-y-hojas-verdes-manzana-y', 'fideos-arroz-hervidos', 150),
  ('bowl-de-fideos-de-arroz-pollo-y-hojas-verdes-manzana-y', 'pechuga-pollo', 110),
  ('bowl-de-fideos-de-arroz-pollo-y-hojas-verdes-manzana-y', 'hojas-verdes', 40),
  ('bowl-de-fideos-de-arroz-pollo-y-hojas-verdes-manzana-y', 'manzana-verde', 0.5),
  ('bowl-de-fideos-de-arroz-pollo-y-hojas-verdes-manzana-y', 'apio', 30),
  ('bowl-de-fideos-de-arroz-pollo-y-hojas-verdes-manzana-y', 'guacamole', 40),
  ('bowl-de-cuscus-carne-y-repollo-colorado-edamame-y', 'cuscus-hervido', 150),
  ('bowl-de-cuscus-carne-y-repollo-colorado-edamame-y', 'peceto', 100),
  ('bowl-de-cuscus-carne-y-repollo-colorado-edamame-y', 'repollo-colorado', 50),
  ('bowl-de-cuscus-carne-y-repollo-colorado-edamame-y', 'edamame', 50),
  ('bowl-de-cuscus-carne-y-repollo-colorado-edamame-y', 'zanahoria-rallada', 40),
  ('bowl-de-cuscus-carne-y-repollo-colorado-edamame-y', 'pesto', 15),
  ('bowl-de-cuscus-atun-y-palta-pepino-y-zanahoria', 'cuscus-hervido', 150),
  ('bowl-de-cuscus-atun-y-palta-pepino-y-zanahoria', 'atun-natural', 1),
  ('bowl-de-cuscus-atun-y-palta-pepino-y-zanahoria', 'palta', 0.5),
  ('bowl-de-cuscus-atun-y-palta-pepino-y-zanahoria', 'pepino', 0.5),
  ('bowl-de-cuscus-atun-y-palta-pepino-y-zanahoria', 'zanahoria-rallada', 50),
  ('bowl-de-cuscus-atun-y-palta-pepino-y-zanahoria', 'tahini', 10),
  ('bowl-de-cuscus-atun-y-palta-pepino-y-zanahoria', 'limon-exprimido', 10),
  ('bowl-de-cuscus-lentejas-y-brocoli-choclo-y-tomate-cherry', 'cuscus-hervido', 150),
  ('bowl-de-cuscus-lentejas-y-brocoli-choclo-y-tomate-cherry', 'lentejas-hervidas', 130),
  ('bowl-de-cuscus-lentejas-y-brocoli-choclo-y-tomate-cherry', 'brocoli', 80),
  ('bowl-de-cuscus-lentejas-y-brocoli-choclo-y-tomate-cherry', 'choclo', 50),
  ('bowl-de-cuscus-lentejas-y-brocoli-choclo-y-tomate-cherry', 'tomate-cherry', 60),
  ('bowl-de-cuscus-lentejas-y-brocoli-choclo-y-tomate-cherry', 'pesto', 15),
  ('bowl-de-fideos-de-arroz-pollo-y-repollo-colorado', 'fideos-arroz-hervidos', 150),
  ('bowl-de-fideos-de-arroz-pollo-y-repollo-colorado', 'pechuga-pollo', 110),
  ('bowl-de-fideos-de-arroz-pollo-y-repollo-colorado', 'repollo-colorado', 50),
  ('bowl-de-fideos-de-arroz-pollo-y-repollo-colorado', 'edamame', 50),
  ('bowl-de-fideos-de-arroz-pollo-y-repollo-colorado', 'zanahoria-rallada', 40),
  ('bowl-de-fideos-de-arroz-pollo-y-repollo-colorado', 'pesto', 15),
  ('bowl-de-quinoa-tempeh-y-kale-mango-y-cebolla-morada', 'quinoa-hervida', 150),
  ('bowl-de-quinoa-tempeh-y-kale-mango-y-cebolla-morada', 'tempeh', 100),
  ('bowl-de-quinoa-tempeh-y-kale-mango-y-cebolla-morada', 'salsa-soja', 8),
  ('bowl-de-quinoa-tempeh-y-kale-mango-y-cebolla-morada', 'kale', 40),
  ('bowl-de-quinoa-tempeh-y-kale-mango-y-cebolla-morada', 'mango', 50),
  ('bowl-de-quinoa-tempeh-y-kale-mango-y-cebolla-morada', 'cebolla-morada', 0.5),
  ('bowl-de-quinoa-tempeh-y-kale-mango-y-cebolla-morada', 'pesto', 15),
  ('bowl-de-cuscus-lentejas-y-hojas-verdes-manzana-y-apio', 'cuscus-hervido', 150),
  ('bowl-de-cuscus-lentejas-y-hojas-verdes-manzana-y-apio', 'lentejas-hervidas', 130),
  ('bowl-de-cuscus-lentejas-y-hojas-verdes-manzana-y-apio', 'hojas-verdes', 40),
  ('bowl-de-cuscus-lentejas-y-hojas-verdes-manzana-y-apio', 'manzana-verde', 0.5),
  ('bowl-de-cuscus-lentejas-y-hojas-verdes-manzana-y-apio', 'apio', 30),
  ('bowl-de-cuscus-lentejas-y-hojas-verdes-manzana-y-apio', 'salsa-soja', 10),
  ('bowl-de-cuscus-lentejas-y-hojas-verdes-manzana-y-apio', 'jengibre', 2),
  ('bowl-de-cuscus-lentejas-y-hojas-verdes-manzana-y-apio', 'aceite-sesamo', 4),
  ('bowl-de-cuscus-carne-y-brocoli-choclo-y-tomate-cherry', 'cuscus-hervido', 150),
  ('bowl-de-cuscus-carne-y-brocoli-choclo-y-tomate-cherry', 'peceto', 100),
  ('bowl-de-cuscus-carne-y-brocoli-choclo-y-tomate-cherry', 'brocoli', 80),
  ('bowl-de-cuscus-carne-y-brocoli-choclo-y-tomate-cherry', 'choclo', 50),
  ('bowl-de-cuscus-carne-y-brocoli-choclo-y-tomate-cherry', 'tomate-cherry', 60),
  ('bowl-de-cuscus-carne-y-brocoli-choclo-y-tomate-cherry', 'tahini', 10),
  ('bowl-de-cuscus-carne-y-brocoli-choclo-y-tomate-cherry', 'limon-exprimido', 10),
  ('bowl-de-quinoa-carne-y-repollo-colorado-edamame-y', 'quinoa-hervida', 150),
  ('bowl-de-quinoa-carne-y-repollo-colorado-edamame-y', 'peceto', 100),
  ('bowl-de-quinoa-carne-y-repollo-colorado-edamame-y', 'repollo-colorado', 50),
  ('bowl-de-quinoa-carne-y-repollo-colorado-edamame-y', 'edamame', 50),
  ('bowl-de-quinoa-carne-y-repollo-colorado-edamame-y', 'zanahoria-rallada', 40),
  ('bowl-de-quinoa-carne-y-repollo-colorado-edamame-y', 'pesto', 15),
  ('bowl-de-arroz-integral-lentejas-y-palta-pepino-y', 'arroz-integral-hervido', 150),
  ('bowl-de-arroz-integral-lentejas-y-palta-pepino-y', 'lentejas-hervidas', 130),
  ('bowl-de-arroz-integral-lentejas-y-palta-pepino-y', 'palta', 0.5),
  ('bowl-de-arroz-integral-lentejas-y-palta-pepino-y', 'pepino', 0.5),
  ('bowl-de-arroz-integral-lentejas-y-palta-pepino-y', 'zanahoria-rallada', 50),
  ('bowl-de-arroz-integral-lentejas-y-palta-pepino-y', 'salsa-soja', 10),
  ('bowl-de-arroz-integral-lentejas-y-palta-pepino-y', 'jengibre', 2),
  ('bowl-de-arroz-integral-lentejas-y-palta-pepino-y', 'aceite-sesamo', 4),
  ('bowl-de-cuscus-huevo-y-brocoli-choclo-y-tomate-cherry', 'cuscus-hervido', 150),
  ('bowl-de-cuscus-huevo-y-brocoli-choclo-y-tomate-cherry', 'huevo', 2),
  ('bowl-de-cuscus-huevo-y-brocoli-choclo-y-tomate-cherry', 'brocoli', 80),
  ('bowl-de-cuscus-huevo-y-brocoli-choclo-y-tomate-cherry', 'choclo', 50),
  ('bowl-de-cuscus-huevo-y-brocoli-choclo-y-tomate-cherry', 'tomate-cherry', 60),
  ('bowl-de-cuscus-huevo-y-brocoli-choclo-y-tomate-cherry', 'salsa-soja', 10),
  ('bowl-de-cuscus-huevo-y-brocoli-choclo-y-tomate-cherry', 'jengibre', 2),
  ('bowl-de-cuscus-huevo-y-brocoli-choclo-y-tomate-cherry', 'aceite-sesamo', 4),
  ('bowl-de-quinoa-langostinos-y-hojas-verdes-manzana-y-apio', 'quinoa-hervida', 150),
  ('bowl-de-quinoa-langostinos-y-hojas-verdes-manzana-y-apio', 'langostinos', 110),
  ('bowl-de-quinoa-langostinos-y-hojas-verdes-manzana-y-apio', 'ajo', 0.5),
  ('bowl-de-quinoa-langostinos-y-hojas-verdes-manzana-y-apio', 'aceite', 4),
  ('bowl-de-quinoa-langostinos-y-hojas-verdes-manzana-y-apio', 'hojas-verdes', 40),
  ('bowl-de-quinoa-langostinos-y-hojas-verdes-manzana-y-apio', 'manzana-verde', 0.5),
  ('bowl-de-quinoa-langostinos-y-hojas-verdes-manzana-y-apio', 'apio', 30),
  ('bowl-de-quinoa-langostinos-y-hojas-verdes-manzana-y-apio', 'pesto', 15),
  ('bowl-de-quinoa-lentejas-y-brocoli-choclo-y-tomate-cherry', 'quinoa-hervida', 150),
  ('bowl-de-quinoa-lentejas-y-brocoli-choclo-y-tomate-cherry', 'lentejas-hervidas', 130),
  ('bowl-de-quinoa-lentejas-y-brocoli-choclo-y-tomate-cherry', 'brocoli', 80),
  ('bowl-de-quinoa-lentejas-y-brocoli-choclo-y-tomate-cherry', 'choclo', 50),
  ('bowl-de-quinoa-lentejas-y-brocoli-choclo-y-tomate-cherry', 'tomate-cherry', 60),
  ('bowl-de-quinoa-lentejas-y-brocoli-choclo-y-tomate-cherry', 'pesto', 15),
  ('bowl-de-batata-asada-huevo-y-hojas-verdes-manzana-y-apio', 'batata', 180),
  ('bowl-de-batata-asada-huevo-y-hojas-verdes-manzana-y-apio', 'aceite', 5),
  ('bowl-de-batata-asada-huevo-y-hojas-verdes-manzana-y-apio', 'huevo', 2),
  ('bowl-de-batata-asada-huevo-y-hojas-verdes-manzana-y-apio', 'hojas-verdes', 40),
  ('bowl-de-batata-asada-huevo-y-hojas-verdes-manzana-y-apio', 'manzana-verde', 0.5),
  ('bowl-de-batata-asada-huevo-y-hojas-verdes-manzana-y-apio', 'apio', 30),
  ('bowl-de-batata-asada-huevo-y-hojas-verdes-manzana-y-apio', 'tahini', 10),
  ('bowl-de-batata-asada-huevo-y-hojas-verdes-manzana-y-apio', 'limon-exprimido', 10),
  ('bowl-de-burgol-huevo-y-palta-pepino-y-zanahoria', 'burgol-hervido', 150),
  ('bowl-de-burgol-huevo-y-palta-pepino-y-zanahoria', 'huevo', 2),
  ('bowl-de-burgol-huevo-y-palta-pepino-y-zanahoria', 'palta', 0.5),
  ('bowl-de-burgol-huevo-y-palta-pepino-y-zanahoria', 'pepino', 0.5),
  ('bowl-de-burgol-huevo-y-palta-pepino-y-zanahoria', 'zanahoria-rallada', 50),
  ('bowl-de-burgol-huevo-y-palta-pepino-y-zanahoria', 'tahini', 10),
  ('bowl-de-burgol-huevo-y-palta-pepino-y-zanahoria', 'limon-exprimido', 10),
  ('bowl-de-cuscus-huevo-y-espinaca-remolacha-y-semillas', 'cuscus-hervido', 150),
  ('bowl-de-cuscus-huevo-y-espinaca-remolacha-y-semillas', 'huevo', 2),
  ('bowl-de-cuscus-huevo-y-espinaca-remolacha-y-semillas', 'espinaca', 40),
  ('bowl-de-cuscus-huevo-y-espinaca-remolacha-y-semillas', 'remolacha-cocida', 60),
  ('bowl-de-cuscus-huevo-y-espinaca-remolacha-y-semillas', 'semillas-girasol', 8),
  ('bowl-de-cuscus-huevo-y-espinaca-remolacha-y-semillas', 'pesto', 15),
  ('bowl-de-cuscus-huevo-y-repollo-colorado-edamame-y', 'cuscus-hervido', 150),
  ('bowl-de-cuscus-huevo-y-repollo-colorado-edamame-y', 'huevo', 2),
  ('bowl-de-cuscus-huevo-y-repollo-colorado-edamame-y', 'repollo-colorado', 50),
  ('bowl-de-cuscus-huevo-y-repollo-colorado-edamame-y', 'edamame', 50),
  ('bowl-de-cuscus-huevo-y-repollo-colorado-edamame-y', 'zanahoria-rallada', 40),
  ('bowl-de-cuscus-huevo-y-repollo-colorado-edamame-y', 'yogur-natural', 50),
  ('bowl-de-cuscus-huevo-y-repollo-colorado-edamame-y', 'menta', 2),
  ('bowl-de-cuscus-huevo-y-repollo-colorado-edamame-y', 'limon-exprimido', 5),
  ('bowl-de-cuscus-pollo-y-palta-pepino-y-zanahoria', 'cuscus-hervido', 150),
  ('bowl-de-cuscus-pollo-y-palta-pepino-y-zanahoria', 'pechuga-pollo', 110),
  ('bowl-de-cuscus-pollo-y-palta-pepino-y-zanahoria', 'palta', 0.5),
  ('bowl-de-cuscus-pollo-y-palta-pepino-y-zanahoria', 'pepino', 0.5),
  ('bowl-de-cuscus-pollo-y-palta-pepino-y-zanahoria', 'zanahoria-rallada', 50),
  ('bowl-de-cuscus-pollo-y-palta-pepino-y-zanahoria', 'guacamole', 40),
  ('bowl-de-arroz-integral-huevo-y-palta-pepino-y-zanahoria', 'arroz-integral-hervido', 150),
  ('bowl-de-arroz-integral-huevo-y-palta-pepino-y-zanahoria', 'huevo', 2),
  ('bowl-de-arroz-integral-huevo-y-palta-pepino-y-zanahoria', 'palta', 0.5),
  ('bowl-de-arroz-integral-huevo-y-palta-pepino-y-zanahoria', 'pepino', 0.5),
  ('bowl-de-arroz-integral-huevo-y-palta-pepino-y-zanahoria', 'zanahoria-rallada', 50),
  ('bowl-de-arroz-integral-huevo-y-palta-pepino-y-zanahoria', 'tahini', 10),
  ('bowl-de-arroz-integral-huevo-y-palta-pepino-y-zanahoria', 'limon-exprimido', 10),
  ('bowl-de-arroz-integral-atun-y-kale-mango-y-cebolla', 'arroz-integral-hervido', 150),
  ('bowl-de-arroz-integral-atun-y-kale-mango-y-cebolla', 'atun-natural', 1),
  ('bowl-de-arroz-integral-atun-y-kale-mango-y-cebolla', 'kale', 40),
  ('bowl-de-arroz-integral-atun-y-kale-mango-y-cebolla', 'mango', 50),
  ('bowl-de-arroz-integral-atun-y-kale-mango-y-cebolla', 'cebolla-morada', 0.5),
  ('bowl-de-arroz-integral-atun-y-kale-mango-y-cebolla', 'guacamole', 40),
  ('bowl-de-arroz-integral-tofu-y-repollo-colorado-edamame', 'arroz-integral-hervido', 150),
  ('bowl-de-arroz-integral-tofu-y-repollo-colorado-edamame', 'tofu', 120),
  ('bowl-de-arroz-integral-tofu-y-repollo-colorado-edamame', 'salsa-soja', 8),
  ('bowl-de-arroz-integral-tofu-y-repollo-colorado-edamame', 'aceite-sesamo', 4),
  ('bowl-de-arroz-integral-tofu-y-repollo-colorado-edamame', 'repollo-colorado', 50),
  ('bowl-de-arroz-integral-tofu-y-repollo-colorado-edamame', 'edamame', 50),
  ('bowl-de-arroz-integral-tofu-y-repollo-colorado-edamame', 'zanahoria-rallada', 40),
  ('bowl-de-arroz-integral-tofu-y-repollo-colorado-edamame', 'guacamole', 40),
  ('bowl-de-batata-asada-pollo-y-hojas-verdes-manzana-y-apio', 'batata', 180),
  ('bowl-de-batata-asada-pollo-y-hojas-verdes-manzana-y-apio', 'aceite', 5),
  ('bowl-de-batata-asada-pollo-y-hojas-verdes-manzana-y-apio', 'pechuga-pollo', 110),
  ('bowl-de-batata-asada-pollo-y-hojas-verdes-manzana-y-apio', 'hojas-verdes', 40),
  ('bowl-de-batata-asada-pollo-y-hojas-verdes-manzana-y-apio', 'manzana-verde', 0.5),
  ('bowl-de-batata-asada-pollo-y-hojas-verdes-manzana-y-apio', 'apio', 30),
  ('bowl-de-batata-asada-pollo-y-hojas-verdes-manzana-y-apio', 'guacamole', 40),
  ('bowl-de-burgol-salmon-y-hojas-verdes-manzana-y-apio', 'burgol-hervido', 150),
  ('bowl-de-burgol-salmon-y-hojas-verdes-manzana-y-apio', 'salmon', 110),
  ('bowl-de-burgol-salmon-y-hojas-verdes-manzana-y-apio', 'hojas-verdes', 40),
  ('bowl-de-burgol-salmon-y-hojas-verdes-manzana-y-apio', 'manzana-verde', 0.5),
  ('bowl-de-burgol-salmon-y-hojas-verdes-manzana-y-apio', 'apio', 30),
  ('bowl-de-burgol-salmon-y-hojas-verdes-manzana-y-apio', 'pesto', 15),
  ('bowl-de-batata-asada-carne-y-kale-mango-y-cebolla-morada', 'batata', 180),
  ('bowl-de-batata-asada-carne-y-kale-mango-y-cebolla-morada', 'aceite', 5),
  ('bowl-de-batata-asada-carne-y-kale-mango-y-cebolla-morada', 'peceto', 100),
  ('bowl-de-batata-asada-carne-y-kale-mango-y-cebolla-morada', 'kale', 40),
  ('bowl-de-batata-asada-carne-y-kale-mango-y-cebolla-morada', 'mango', 50),
  ('bowl-de-batata-asada-carne-y-kale-mango-y-cebolla-morada', 'cebolla-morada', 0.5),
  ('bowl-de-batata-asada-carne-y-kale-mango-y-cebolla-morada', 'yogur-natural', 50),
  ('bowl-de-batata-asada-carne-y-kale-mango-y-cebolla-morada', 'menta', 2),
  ('bowl-de-batata-asada-carne-y-kale-mango-y-cebolla-morada', 'limon-exprimido', 5),
  ('bowl-de-arroz-integral-huevo-y-repollo-colorado-edamame', 'arroz-integral-hervido', 150),
  ('bowl-de-arroz-integral-huevo-y-repollo-colorado-edamame', 'huevo', 2),
  ('bowl-de-arroz-integral-huevo-y-repollo-colorado-edamame', 'repollo-colorado', 50),
  ('bowl-de-arroz-integral-huevo-y-repollo-colorado-edamame', 'edamame', 50),
  ('bowl-de-arroz-integral-huevo-y-repollo-colorado-edamame', 'zanahoria-rallada', 40),
  ('bowl-de-arroz-integral-huevo-y-repollo-colorado-edamame', 'yogur-natural', 50),
  ('bowl-de-arroz-integral-huevo-y-repollo-colorado-edamame', 'menta', 2),
  ('bowl-de-arroz-integral-huevo-y-repollo-colorado-edamame', 'limon-exprimido', 5),
  ('bowl-de-batata-asada-tofu-y-hojas-verdes-manzana-y-apio', 'batata', 180),
  ('bowl-de-batata-asada-tofu-y-hojas-verdes-manzana-y-apio', 'aceite', 5),
  ('bowl-de-batata-asada-tofu-y-hojas-verdes-manzana-y-apio', 'tofu', 120),
  ('bowl-de-batata-asada-tofu-y-hojas-verdes-manzana-y-apio', 'salsa-soja', 20),
  ('bowl-de-batata-asada-tofu-y-hojas-verdes-manzana-y-apio', 'aceite-sesamo', 8),
  ('bowl-de-batata-asada-tofu-y-hojas-verdes-manzana-y-apio', 'hojas-verdes', 40),
  ('bowl-de-batata-asada-tofu-y-hojas-verdes-manzana-y-apio', 'manzana-verde', 0.5),
  ('bowl-de-batata-asada-tofu-y-hojas-verdes-manzana-y-apio', 'apio', 30),
  ('bowl-de-batata-asada-tofu-y-hojas-verdes-manzana-y-apio', 'jengibre', 2),
  ('bowl-de-cuscus-lentejas-y-repollo-colorado-edamame-y', 'cuscus-hervido', 150),
  ('bowl-de-cuscus-lentejas-y-repollo-colorado-edamame-y', 'lentejas-hervidas', 130),
  ('bowl-de-cuscus-lentejas-y-repollo-colorado-edamame-y', 'repollo-colorado', 50),
  ('bowl-de-cuscus-lentejas-y-repollo-colorado-edamame-y', 'edamame', 50),
  ('bowl-de-cuscus-lentejas-y-repollo-colorado-edamame-y', 'zanahoria-rallada', 40),
  ('bowl-de-cuscus-lentejas-y-repollo-colorado-edamame-y', 'guacamole', 40),
  ('bowl-de-burgol-pollo-y-espinaca-remolacha-y-semillas', 'burgol-hervido', 150),
  ('bowl-de-burgol-pollo-y-espinaca-remolacha-y-semillas', 'pechuga-pollo', 110),
  ('bowl-de-burgol-pollo-y-espinaca-remolacha-y-semillas', 'espinaca', 40),
  ('bowl-de-burgol-pollo-y-espinaca-remolacha-y-semillas', 'remolacha-cocida', 60),
  ('bowl-de-burgol-pollo-y-espinaca-remolacha-y-semillas', 'semillas-girasol', 8),
  ('bowl-de-burgol-pollo-y-espinaca-remolacha-y-semillas', 'salsa-soja', 10),
  ('bowl-de-burgol-pollo-y-espinaca-remolacha-y-semillas', 'jengibre', 2),
  ('bowl-de-burgol-pollo-y-espinaca-remolacha-y-semillas', 'aceite-sesamo', 4),
  ('bowl-de-batata-asada-garbanzos-y-brocoli-choclo-y', 'batata', 180),
  ('bowl-de-batata-asada-garbanzos-y-brocoli-choclo-y', 'aceite', 9),
  ('bowl-de-batata-asada-garbanzos-y-brocoli-choclo-y', 'garbanzos-hervidos', 120),
  ('bowl-de-batata-asada-garbanzos-y-brocoli-choclo-y', 'brocoli', 80),
  ('bowl-de-batata-asada-garbanzos-y-brocoli-choclo-y', 'choclo', 50),
  ('bowl-de-batata-asada-garbanzos-y-brocoli-choclo-y', 'tomate-cherry', 60),
  ('bowl-de-batata-asada-garbanzos-y-brocoli-choclo-y', 'guacamole', 40),
  ('bowl-de-quinoa-huevo-y-palta-pepino-y-zanahoria', 'quinoa-hervida', 150),
  ('bowl-de-quinoa-huevo-y-palta-pepino-y-zanahoria', 'huevo', 2),
  ('bowl-de-quinoa-huevo-y-palta-pepino-y-zanahoria', 'palta', 0.5),
  ('bowl-de-quinoa-huevo-y-palta-pepino-y-zanahoria', 'pepino', 0.5),
  ('bowl-de-quinoa-huevo-y-palta-pepino-y-zanahoria', 'zanahoria-rallada', 50),
  ('bowl-de-quinoa-huevo-y-palta-pepino-y-zanahoria', 'tahini', 10),
  ('bowl-de-quinoa-huevo-y-palta-pepino-y-zanahoria', 'limon-exprimido', 10),
  ('bowl-de-cuscus-salmon-y-kale-mango-y-cebolla-morada', 'cuscus-hervido', 150),
  ('bowl-de-cuscus-salmon-y-kale-mango-y-cebolla-morada', 'salmon', 110),
  ('bowl-de-cuscus-salmon-y-kale-mango-y-cebolla-morada', 'kale', 40),
  ('bowl-de-cuscus-salmon-y-kale-mango-y-cebolla-morada', 'mango', 50),
  ('bowl-de-cuscus-salmon-y-kale-mango-y-cebolla-morada', 'cebolla-morada', 0.5),
  ('bowl-de-cuscus-salmon-y-kale-mango-y-cebolla-morada', 'salsa-soja', 10),
  ('bowl-de-cuscus-salmon-y-kale-mango-y-cebolla-morada', 'jengibre', 2),
  ('bowl-de-cuscus-salmon-y-kale-mango-y-cebolla-morada', 'aceite-sesamo', 4),
  ('bowl-de-burgol-huevo-y-hojas-verdes-manzana-y-apio', 'burgol-hervido', 150),
  ('bowl-de-burgol-huevo-y-hojas-verdes-manzana-y-apio', 'huevo', 2),
  ('bowl-de-burgol-huevo-y-hojas-verdes-manzana-y-apio', 'hojas-verdes', 40),
  ('bowl-de-burgol-huevo-y-hojas-verdes-manzana-y-apio', 'manzana-verde', 0.5),
  ('bowl-de-burgol-huevo-y-hojas-verdes-manzana-y-apio', 'apio', 30),
  ('bowl-de-burgol-huevo-y-hojas-verdes-manzana-y-apio', 'tahini', 10),
  ('bowl-de-burgol-huevo-y-hojas-verdes-manzana-y-apio', 'limon-exprimido', 10),
  ('bowl-de-arroz-integral-pollo-y-espinaca-remolacha-y', 'arroz-integral-hervido', 150),
  ('bowl-de-arroz-integral-pollo-y-espinaca-remolacha-y', 'pechuga-pollo', 110),
  ('bowl-de-arroz-integral-pollo-y-espinaca-remolacha-y', 'espinaca', 40),
  ('bowl-de-arroz-integral-pollo-y-espinaca-remolacha-y', 'remolacha-cocida', 60),
  ('bowl-de-arroz-integral-pollo-y-espinaca-remolacha-y', 'semillas-girasol', 8),
  ('bowl-de-arroz-integral-pollo-y-espinaca-remolacha-y', 'salsa-soja', 10),
  ('bowl-de-arroz-integral-pollo-y-espinaca-remolacha-y', 'jengibre', 2),
  ('bowl-de-arroz-integral-pollo-y-espinaca-remolacha-y', 'aceite-sesamo', 4),
  ('bowl-de-cuscus-huevo-y-hojas-verdes-manzana-y-apio', 'cuscus-hervido', 150),
  ('bowl-de-cuscus-huevo-y-hojas-verdes-manzana-y-apio', 'huevo', 2),
  ('bowl-de-cuscus-huevo-y-hojas-verdes-manzana-y-apio', 'hojas-verdes', 40),
  ('bowl-de-cuscus-huevo-y-hojas-verdes-manzana-y-apio', 'manzana-verde', 0.5),
  ('bowl-de-cuscus-huevo-y-hojas-verdes-manzana-y-apio', 'apio', 30),
  ('bowl-de-cuscus-huevo-y-hojas-verdes-manzana-y-apio', 'tahini', 10),
  ('bowl-de-cuscus-huevo-y-hojas-verdes-manzana-y-apio', 'limon-exprimido', 10),
  ('bowl-de-burgol-tempeh-y-hojas-verdes-manzana-y-apio', 'burgol-hervido', 150),
  ('bowl-de-burgol-tempeh-y-hojas-verdes-manzana-y-apio', 'tempeh', 100),
  ('bowl-de-burgol-tempeh-y-hojas-verdes-manzana-y-apio', 'salsa-soja', 8),
  ('bowl-de-burgol-tempeh-y-hojas-verdes-manzana-y-apio', 'hojas-verdes', 40),
  ('bowl-de-burgol-tempeh-y-hojas-verdes-manzana-y-apio', 'manzana-verde', 0.5),
  ('bowl-de-burgol-tempeh-y-hojas-verdes-manzana-y-apio', 'apio', 30),
  ('bowl-de-burgol-tempeh-y-hojas-verdes-manzana-y-apio', 'yogur-natural', 50),
  ('bowl-de-burgol-tempeh-y-hojas-verdes-manzana-y-apio', 'menta', 2),
  ('bowl-de-burgol-tempeh-y-hojas-verdes-manzana-y-apio', 'limon-exprimido', 5),
  ('bowl-de-quinoa-tofu-y-brocoli-choclo-y-tomate-cherry', 'quinoa-hervida', 150),
  ('bowl-de-quinoa-tofu-y-brocoli-choclo-y-tomate-cherry', 'tofu', 120),
  ('bowl-de-quinoa-tofu-y-brocoli-choclo-y-tomate-cherry', 'salsa-soja', 8),
  ('bowl-de-quinoa-tofu-y-brocoli-choclo-y-tomate-cherry', 'aceite-sesamo', 4),
  ('bowl-de-quinoa-tofu-y-brocoli-choclo-y-tomate-cherry', 'brocoli', 80),
  ('bowl-de-quinoa-tofu-y-brocoli-choclo-y-tomate-cherry', 'choclo', 50),
  ('bowl-de-quinoa-tofu-y-brocoli-choclo-y-tomate-cherry', 'tomate-cherry', 60),
  ('bowl-de-quinoa-tofu-y-brocoli-choclo-y-tomate-cherry', 'pesto', 15),
  ('bowl-de-batata-asada-langostinos-y-kale-mango-y-cebolla', 'batata', 180),
  ('bowl-de-batata-asada-langostinos-y-kale-mango-y-cebolla', 'aceite', 9),
  ('bowl-de-batata-asada-langostinos-y-kale-mango-y-cebolla', 'langostinos', 110),
  ('bowl-de-batata-asada-langostinos-y-kale-mango-y-cebolla', 'ajo', 0.5),
  ('bowl-de-batata-asada-langostinos-y-kale-mango-y-cebolla', 'kale', 40),
  ('bowl-de-batata-asada-langostinos-y-kale-mango-y-cebolla', 'mango', 50),
  ('bowl-de-batata-asada-langostinos-y-kale-mango-y-cebolla', 'cebolla-morada', 0.5),
  ('bowl-de-batata-asada-langostinos-y-kale-mango-y-cebolla', 'salsa-soja', 10),
  ('bowl-de-batata-asada-langostinos-y-kale-mango-y-cebolla', 'jengibre', 2),
  ('bowl-de-batata-asada-langostinos-y-kale-mango-y-cebolla', 'aceite-sesamo', 4),
  ('bowl-de-quinoa-pollo-y-espinaca-remolacha-y-semillas', 'quinoa-hervida', 150),
  ('bowl-de-quinoa-pollo-y-espinaca-remolacha-y-semillas', 'pechuga-pollo', 110),
  ('bowl-de-quinoa-pollo-y-espinaca-remolacha-y-semillas', 'espinaca', 40),
  ('bowl-de-quinoa-pollo-y-espinaca-remolacha-y-semillas', 'remolacha-cocida', 60),
  ('bowl-de-quinoa-pollo-y-espinaca-remolacha-y-semillas', 'semillas-girasol', 8),
  ('bowl-de-quinoa-pollo-y-espinaca-remolacha-y-semillas', 'salsa-soja', 10),
  ('bowl-de-quinoa-pollo-y-espinaca-remolacha-y-semillas', 'jengibre', 2),
  ('bowl-de-quinoa-pollo-y-espinaca-remolacha-y-semillas', 'aceite-sesamo', 4),
  ('bowl-de-batata-asada-tempeh-y-repollo-colorado-edamame', 'batata', 180),
  ('bowl-de-batata-asada-tempeh-y-repollo-colorado-edamame', 'aceite', 5),
  ('bowl-de-batata-asada-tempeh-y-repollo-colorado-edamame', 'tempeh', 100),
  ('bowl-de-batata-asada-tempeh-y-repollo-colorado-edamame', 'salsa-soja', 20),
  ('bowl-de-batata-asada-tempeh-y-repollo-colorado-edamame', 'repollo-colorado', 50),
  ('bowl-de-batata-asada-tempeh-y-repollo-colorado-edamame', 'edamame', 50),
  ('bowl-de-batata-asada-tempeh-y-repollo-colorado-edamame', 'zanahoria-rallada', 40),
  ('bowl-de-batata-asada-tempeh-y-repollo-colorado-edamame', 'jengibre', 2),
  ('bowl-de-batata-asada-tempeh-y-repollo-colorado-edamame', 'aceite-sesamo', 4),
  ('bowl-de-batata-asada-atun-y-hojas-verdes-manzana-y-apio', 'batata', 180),
  ('bowl-de-batata-asada-atun-y-hojas-verdes-manzana-y-apio', 'aceite', 5),
  ('bowl-de-batata-asada-atun-y-hojas-verdes-manzana-y-apio', 'atun-natural', 1),
  ('bowl-de-batata-asada-atun-y-hojas-verdes-manzana-y-apio', 'hojas-verdes', 40),
  ('bowl-de-batata-asada-atun-y-hojas-verdes-manzana-y-apio', 'manzana-verde', 0.5),
  ('bowl-de-batata-asada-atun-y-hojas-verdes-manzana-y-apio', 'apio', 30),
  ('bowl-de-batata-asada-atun-y-hojas-verdes-manzana-y-apio', 'tahini', 10),
  ('bowl-de-batata-asada-atun-y-hojas-verdes-manzana-y-apio', 'limon-exprimido', 10),
  ('bowl-de-burgol-salmon-y-repollo-colorado-edamame-y', 'burgol-hervido', 150),
  ('bowl-de-burgol-salmon-y-repollo-colorado-edamame-y', 'salmon', 110),
  ('bowl-de-burgol-salmon-y-repollo-colorado-edamame-y', 'repollo-colorado', 50),
  ('bowl-de-burgol-salmon-y-repollo-colorado-edamame-y', 'edamame', 50),
  ('bowl-de-burgol-salmon-y-repollo-colorado-edamame-y', 'zanahoria-rallada', 40),
  ('bowl-de-burgol-salmon-y-repollo-colorado-edamame-y', 'tahini', 10),
  ('bowl-de-burgol-salmon-y-repollo-colorado-edamame-y', 'limon-exprimido', 10),
  ('bowl-de-cuscus-tofu-y-espinaca-remolacha-y-semillas', 'cuscus-hervido', 150),
  ('bowl-de-cuscus-tofu-y-espinaca-remolacha-y-semillas', 'tofu', 120),
  ('bowl-de-cuscus-tofu-y-espinaca-remolacha-y-semillas', 'salsa-soja', 8),
  ('bowl-de-cuscus-tofu-y-espinaca-remolacha-y-semillas', 'aceite-sesamo', 4),
  ('bowl-de-cuscus-tofu-y-espinaca-remolacha-y-semillas', 'espinaca', 40),
  ('bowl-de-cuscus-tofu-y-espinaca-remolacha-y-semillas', 'remolacha-cocida', 60),
  ('bowl-de-cuscus-tofu-y-espinaca-remolacha-y-semillas', 'semillas-girasol', 8),
  ('bowl-de-cuscus-tofu-y-espinaca-remolacha-y-semillas', 'yogur-natural', 50),
  ('bowl-de-cuscus-tofu-y-espinaca-remolacha-y-semillas', 'menta', 2),
  ('bowl-de-cuscus-tofu-y-espinaca-remolacha-y-semillas', 'limon-exprimido', 5),
  ('bowl-de-fideos-de-arroz-pollo-y-espinaca-remolacha-y', 'fideos-arroz-hervidos', 150),
  ('bowl-de-fideos-de-arroz-pollo-y-espinaca-remolacha-y', 'pechuga-pollo', 110),
  ('bowl-de-fideos-de-arroz-pollo-y-espinaca-remolacha-y', 'espinaca', 40),
  ('bowl-de-fideos-de-arroz-pollo-y-espinaca-remolacha-y', 'remolacha-cocida', 60),
  ('bowl-de-fideos-de-arroz-pollo-y-espinaca-remolacha-y', 'semillas-girasol', 8),
  ('bowl-de-fideos-de-arroz-pollo-y-espinaca-remolacha-y', 'salsa-soja', 10),
  ('bowl-de-fideos-de-arroz-pollo-y-espinaca-remolacha-y', 'jengibre', 2),
  ('bowl-de-fideos-de-arroz-pollo-y-espinaca-remolacha-y', 'aceite-sesamo', 4),
  ('bowl-de-batata-asada-lentejas-y-brocoli-choclo-y-tomate', 'batata', 180),
  ('bowl-de-batata-asada-lentejas-y-brocoli-choclo-y-tomate', 'aceite', 5),
  ('bowl-de-batata-asada-lentejas-y-brocoli-choclo-y-tomate', 'lentejas-hervidas', 130),
  ('bowl-de-batata-asada-lentejas-y-brocoli-choclo-y-tomate', 'brocoli', 80),
  ('bowl-de-batata-asada-lentejas-y-brocoli-choclo-y-tomate', 'choclo', 50),
  ('bowl-de-batata-asada-lentejas-y-brocoli-choclo-y-tomate', 'tomate-cherry', 60),
  ('bowl-de-batata-asada-lentejas-y-brocoli-choclo-y-tomate', 'pesto', 15),
  ('bowl-de-quinoa-atun-y-brocoli-choclo-y-tomate-cherry', 'quinoa-hervida', 150),
  ('bowl-de-quinoa-atun-y-brocoli-choclo-y-tomate-cherry', 'atun-natural', 1),
  ('bowl-de-quinoa-atun-y-brocoli-choclo-y-tomate-cherry', 'brocoli', 80),
  ('bowl-de-quinoa-atun-y-brocoli-choclo-y-tomate-cherry', 'choclo', 50),
  ('bowl-de-quinoa-atun-y-brocoli-choclo-y-tomate-cherry', 'tomate-cherry', 60),
  ('bowl-de-quinoa-atun-y-brocoli-choclo-y-tomate-cherry', 'salsa-soja', 10),
  ('bowl-de-quinoa-atun-y-brocoli-choclo-y-tomate-cherry', 'jengibre', 2),
  ('bowl-de-quinoa-atun-y-brocoli-choclo-y-tomate-cherry', 'aceite-sesamo', 4),
  ('bowl-de-batata-asada-langostinos-y-repollo-colorado', 'batata', 180),
  ('bowl-de-batata-asada-langostinos-y-repollo-colorado', 'aceite', 9),
  ('bowl-de-batata-asada-langostinos-y-repollo-colorado', 'langostinos', 110),
  ('bowl-de-batata-asada-langostinos-y-repollo-colorado', 'ajo', 0.5),
  ('bowl-de-batata-asada-langostinos-y-repollo-colorado', 'repollo-colorado', 50),
  ('bowl-de-batata-asada-langostinos-y-repollo-colorado', 'edamame', 50),
  ('bowl-de-batata-asada-langostinos-y-repollo-colorado', 'zanahoria-rallada', 40),
  ('bowl-de-batata-asada-langostinos-y-repollo-colorado', 'tahini', 10),
  ('bowl-de-batata-asada-langostinos-y-repollo-colorado', 'limon-exprimido', 10),
  ('bowl-de-fideos-de-arroz-pollo-y-palta-pepino-y-zanahoria', 'fideos-arroz-hervidos', 150),
  ('bowl-de-fideos-de-arroz-pollo-y-palta-pepino-y-zanahoria', 'pechuga-pollo', 110),
  ('bowl-de-fideos-de-arroz-pollo-y-palta-pepino-y-zanahoria', 'palta', 0.5),
  ('bowl-de-fideos-de-arroz-pollo-y-palta-pepino-y-zanahoria', 'pepino', 0.5),
  ('bowl-de-fideos-de-arroz-pollo-y-palta-pepino-y-zanahoria', 'zanahoria-rallada', 50),
  ('bowl-de-fideos-de-arroz-pollo-y-palta-pepino-y-zanahoria', 'guacamole', 40),
  ('bowl-de-fideos-de-arroz-carne-y-repollo-colorado', 'fideos-arroz-hervidos', 150),
  ('bowl-de-fideos-de-arroz-carne-y-repollo-colorado', 'peceto', 100),
  ('bowl-de-fideos-de-arroz-carne-y-repollo-colorado', 'repollo-colorado', 50),
  ('bowl-de-fideos-de-arroz-carne-y-repollo-colorado', 'edamame', 50),
  ('bowl-de-fideos-de-arroz-carne-y-repollo-colorado', 'zanahoria-rallada', 40),
  ('bowl-de-fideos-de-arroz-carne-y-repollo-colorado', 'pesto', 15),
  ('bowl-de-burgol-salmon-y-espinaca-remolacha-y-semillas', 'burgol-hervido', 150),
  ('bowl-de-burgol-salmon-y-espinaca-remolacha-y-semillas', 'salmon', 110),
  ('bowl-de-burgol-salmon-y-espinaca-remolacha-y-semillas', 'espinaca', 40),
  ('bowl-de-burgol-salmon-y-espinaca-remolacha-y-semillas', 'remolacha-cocida', 60),
  ('bowl-de-burgol-salmon-y-espinaca-remolacha-y-semillas', 'semillas-girasol', 8),
  ('bowl-de-burgol-salmon-y-espinaca-remolacha-y-semillas', 'guacamole', 40),
  ('bowl-de-arroz-integral-tempeh-y-brocoli-choclo-y-tomate', 'arroz-integral-hervido', 150),
  ('bowl-de-arroz-integral-tempeh-y-brocoli-choclo-y-tomate', 'tempeh', 100),
  ('bowl-de-arroz-integral-tempeh-y-brocoli-choclo-y-tomate', 'salsa-soja', 8),
  ('bowl-de-arroz-integral-tempeh-y-brocoli-choclo-y-tomate', 'brocoli', 80),
  ('bowl-de-arroz-integral-tempeh-y-brocoli-choclo-y-tomate', 'choclo', 50),
  ('bowl-de-arroz-integral-tempeh-y-brocoli-choclo-y-tomate', 'tomate-cherry', 60),
  ('bowl-de-arroz-integral-tempeh-y-brocoli-choclo-y-tomate', 'guacamole', 40),
  ('bowl-de-cuscus-garbanzos-y-espinaca-remolacha-y-semillas', 'cuscus-hervido', 150),
  ('bowl-de-cuscus-garbanzos-y-espinaca-remolacha-y-semillas', 'garbanzos-hervidos', 120),
  ('bowl-de-cuscus-garbanzos-y-espinaca-remolacha-y-semillas', 'aceite', 4),
  ('bowl-de-cuscus-garbanzos-y-espinaca-remolacha-y-semillas', 'espinaca', 40),
  ('bowl-de-cuscus-garbanzos-y-espinaca-remolacha-y-semillas', 'remolacha-cocida', 60),
  ('bowl-de-cuscus-garbanzos-y-espinaca-remolacha-y-semillas', 'semillas-girasol', 8),
  ('bowl-de-cuscus-garbanzos-y-espinaca-remolacha-y-semillas', 'tahini', 10),
  ('bowl-de-cuscus-garbanzos-y-espinaca-remolacha-y-semillas', 'limon-exprimido', 10),
  ('bowl-de-cuscus-garbanzos-y-palta-pepino-y-zanahoria', 'cuscus-hervido', 150),
  ('bowl-de-cuscus-garbanzos-y-palta-pepino-y-zanahoria', 'garbanzos-hervidos', 120),
  ('bowl-de-cuscus-garbanzos-y-palta-pepino-y-zanahoria', 'aceite', 4),
  ('bowl-de-cuscus-garbanzos-y-palta-pepino-y-zanahoria', 'palta', 0.5),
  ('bowl-de-cuscus-garbanzos-y-palta-pepino-y-zanahoria', 'pepino', 0.5),
  ('bowl-de-cuscus-garbanzos-y-palta-pepino-y-zanahoria', 'zanahoria-rallada', 50),
  ('bowl-de-cuscus-garbanzos-y-palta-pepino-y-zanahoria', 'yogur-natural', 50),
  ('bowl-de-cuscus-garbanzos-y-palta-pepino-y-zanahoria', 'menta', 2),
  ('bowl-de-cuscus-garbanzos-y-palta-pepino-y-zanahoria', 'limon-exprimido', 5)
) as v(recipe_slug, food_slug, qty)
join public.recipes r on r.slug = v.recipe_slug
join public.foods f on f.slug = v.food_slug
on conflict do nothing;
