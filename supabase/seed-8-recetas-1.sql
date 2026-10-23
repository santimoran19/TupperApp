-- Sexta tanda de la base (1.25): recetas, parte 1 de 8. Después de seed-8-alimentos.sql. Se puede correr de nuevo: agrega solo lo que falta. Generado con scripts/gen-seed.mjs

insert into public.recipes (slug, name, minutes, servings, meal_types, portable, steps) values
  ('ensalada-de-kale-con-alubias-pepino-y-arvejas', 'Ensalada de kale con alubias, pepino y arvejas', 11, 1, '{almuerzo,cena}', true, 'Sacás los tallos del kale, lo cortás fino y lo masajeás un minuto con unas gotas de limón para que se ablande.
Preparás el pepino en rodajas y las arvejas hervidas 3 minutos.
Enjuagás las alubias y las escurrís bien.
Sumás todo al bowl. Batís la mostaza con la miel, el aceite de oliva, el vinagre de manzana y una pizca de sal; aderezás al servir. Se puede llevar con el aderezo aparte.'),
  ('ensalada-de-repollo-colorado-con-queso-cottage', 'Ensalada de repollo colorado con queso cottage, parmesano y frutillas', 9, 1, '{almuerzo,cena}', true, 'Cortás el repollo colorado en tiras muy finas y lo masajeás un minuto con una pizca de sal.
Preparás el parmesano en lascas con el pelapapas y las frutillas en cuartos.
Reservás el queso cottage para servir arriba.
Sumás todo al bowl. Aderezás con el jugo de limón, el aceite de oliva, sal y pimienta. Servís enseguida.'),
  ('ensalada-de-hojas-verdes-con-atun-apio-y-hinojo', 'Ensalada de hojas verdes con atún, apio y hinojo', 11, 1, '{almuerzo,cena}', true, 'Lavás y secás las hojas verdes y las ponés en un bowl grande.
Preparás el apio en rodajitas y el hinojo en láminas finas.
Escurrís bien el atún y lo desmenuzás con un tenedor.
Sumás todo al bowl. Batís la mostaza con la miel, el aceite de oliva, el vinagre de manzana y una pizca de sal; aderezás al servir. Se puede llevar con el aderezo aparte.'),
  ('ensalada-de-espinaca-con-atun-morron-y-tomate', 'Ensalada de espinaca con atún, morrón y tomate', 11, 1, '{almuerzo,cena}', true, 'Lavás y secás bien las hojas de espinaca y las ponés en un bowl grande.
Preparás el morrón en tiras y el tomate en gajos.
Escurrís bien el atún y lo desmenuzás con un tenedor.
Sumás todo al bowl. Aderezás con una cucharada sopera de salsa césar y mezclás bien. Se puede llevar con el aderezo aparte.'),
  ('ensalada-de-hojas-verdes-con-queso-cottage-palta-y', 'Ensalada de hojas verdes con queso cottage, palta y zanahoria', 9, 1, '{almuerzo,cena}', true, 'Lavás y secás las hojas verdes y las ponés en un bowl grande.
Preparás la palta en cubos y la zanahoria rallada.
Reservás el queso cottage para servir arriba.
Sumás todo al bowl. Aderezás con una cucharada sopera de salsa césar y mezclás bien. Se puede llevar con el aderezo aparte.'),
  ('ensalada-de-repollo-con-garbanzos-cebolla-morada-y', 'Ensalada de repollo con garbanzos, cebolla morada y remolacha', 11, 1, '{almuerzo,cena}', true, 'Cortás el repollo en tiras muy finas y lo masajeás un minuto con una pizca de sal para que se ablande.
Preparás la cebolla morada en plumas finitas y la remolacha cocida en cubos.
Enjuagás los garbanzos y los escurrís bien.
Sumás todo al bowl. Aderezás con una cucharada sopera de salsa césar y mezclás bien. Servís enseguida.'),
  ('ensalada-de-repollo-con-alubias-croutons-y-morron', 'Ensalada de repollo con alubias, croutons y morrón', 11, 1, '{almuerzo,cena}', true, 'Cortás el repollo en tiras muy finas y lo masajeás un minuto con una pizca de sal para que se ablande.
Preparás los croutons y el morrón en tiras.
Enjuagás las alubias y las escurrís bien.
Sumás todo al bowl. Diluís el tahini con el jugo de limón, un chorrito de agua y sal hasta que quede cremoso; lo volcás por encima. Servís enseguida.'),
  ('ensalada-de-hojas-verdes-con-pollo-grillado-almendras-y', 'Ensalada de hojas verdes con pollo grillado, almendras y morrón', 23, 1, '{almuerzo,cena}', true, 'Lavás y secás las hojas verdes y las ponés en un bowl grande.
Preparás las almendras fileteadas y el morrón en tiras.
Salpimentás la pechuga y la cocinás en una plancha bien caliente, 5–6 minutos por lado. La dejás reposar 3 minutos y la cortás en tiras.
Sumás todo al bowl. Aderezás con el aceto, el aceite de oliva, sal y pimienta. Se puede llevar con el aderezo aparte.'),
  ('ensalada-de-berro-con-tofu-dorado-tomate-y-palta', 'Ensalada de berro con tofu dorado, tomate y palta', 18, 1, '{almuerzo,cena}', true, 'Lavás el berro, sacás los tallos más duros y lo secás bien.
Preparás el tomate en gajos y la palta en cubos.
Cortás el tofu en cubos y los dorás en una sartén con una gota de aceite, 4 minutos por lado.
Sumás todo al bowl. Aderezás con el aceto, el aceite de oliva, sal y pimienta. Se puede llevar con el aderezo aparte.'),
  ('ensalada-de-escarola-con-alubias-apio-y-arvejas', 'Ensalada de escarola con alubias, apio y arvejas', 11, 1, '{almuerzo,cena}', true, 'Lavás y secás la escarola y la cortás en trozos.
Preparás el apio en rodajitas y las arvejas hervidas 3 minutos.
Enjuagás las alubias y las escurrís bien.
Sumás todo al bowl. Aderezás con el aceto, el aceite de oliva, sal y pimienta. Servís enseguida.'),
  ('ensalada-de-lechuga-con-garbanzos-palta-y-zanahoria', 'Ensalada de lechuga con garbanzos, palta y zanahoria', 11, 1, '{almuerzo,cena}', true, 'Lavás y secás bien la lechuga, la cortás con la mano y la ponés en un bowl grande.
Preparás la palta en cubos y la zanahoria rallada.
Enjuagás los garbanzos y los escurrís bien.
Sumás todo al bowl. Mezclás el yogur con la mostaza antigua, sal y pimienta, y aderezás al servir. Se puede llevar con el aderezo aparte.'),
  ('ensalada-de-escarola-con-edamame-rabanitos-y-tomate', 'Ensalada de escarola con edamame, rabanitos y tomate', 11, 1, '{almuerzo,cena}', true, 'Lavás y secás la escarola y la cortás en trozos.
Preparás los rabanitos en rodajas finas y el tomate en gajos.
Descongelás el edamame con agua caliente y lo escurrís.
Sumás todo al bowl. Diluís el tahini con el jugo de limón, un chorrito de agua y sal hasta que quede cremoso; lo volcás por encima. Mezclás suave y servís.'),
  ('ensalada-de-rucula-con-atun-apio-y-palta', 'Ensalada de rúcula con atún, apio y palta', 11, 1, '{almuerzo,cena}', true, 'Lavás y secás la rúcula; la ponés en un bowl grande.
Preparás el apio en rodajitas y la palta en cubos.
Escurrís bien el atún y lo desmenuzás con un tenedor.
Sumás todo al bowl. Aderezás con el aceto, el aceite de oliva, sal y pimienta. Servís enseguida.'),
  ('ensalada-de-repollo-con-queso-de-cabra-hinojo-y', 'Ensalada de repollo con queso de cabra, hinojo y remolacha', 10, 1, '{almuerzo,cena}', true, 'Cortás el repollo en tiras muy finas y lo masajeás un minuto con una pizca de sal para que se ablande.
Preparás el hinojo en láminas finas y la remolacha cocida en cubos.
Desmenuzás el queso de cabra por encima.
Sumás todo al bowl. Mezclás el yogur con la mostaza antigua, sal y pimienta, y aderezás al servir. Servís enseguida.'),
  ('ensalada-de-kale-con-queso-de-cabra-tomate-y-parmesano', 'Ensalada de kale con queso de cabra, tomate y parmesano', 10, 1, '{almuerzo,cena}', true, 'Sacás los tallos del kale, lo cortás fino y lo masajeás un minuto con unas gotas de limón para que se ablande.
Preparás el tomate en gajos y el parmesano en lascas con el pelapapas.
Desmenuzás el queso de cabra por encima.
Sumás todo al bowl. Mezclás el yogur con la mostaza antigua, sal y pimienta, y aderezás al servir. Mezclás suave y servís.'),
  ('ensalada-de-repollo-colorado-con-pollo-grillado-morron', 'Ensalada de repollo colorado con pollo grillado, morrón y manzana', 23, 1, '{almuerzo,cena}', true, 'Cortás el repollo colorado en tiras muy finas y lo masajeás un minuto con una pizca de sal.
Preparás el morrón en tiras y la manzana en cubitos (con unas gotas de limón para que no se oscurezca).
Salpimentás la pechuga y la cocinás en una plancha bien caliente, 5–6 minutos por lado. La dejás reposar 3 minutos y la cortás en tiras.
Sumás todo al bowl. Aderezás con el jugo de limón, el aceite de oliva, sal y pimienta. Mezclás suave y servís.'),
  ('ensalada-de-escarola-con-pollo-grillado-palta-y-nueces', 'Ensalada de escarola con pollo grillado, palta y nueces', 23, 1, '{almuerzo,cena}', true, 'Lavás y secás la escarola y la cortás en trozos.
Preparás la palta en cubos y las nueces picadas.
Salpimentás la pechuga y la cocinás en una plancha bien caliente, 5–6 minutos por lado. La dejás reposar 3 minutos y la cortás en tiras.
Sumás todo al bowl. Aderezás con el aceto, el aceite de oliva, sal y pimienta. Se puede llevar con el aderezo aparte.'),
  ('ensalada-de-rucula-con-langostinos-palta-y-zanahoria', 'Ensalada de rúcula con langostinos, palta y zanahoria rallada', 16, 1, '{almuerzo,cena}', true, 'Lavás y secás la rúcula; la ponés en un bowl grande.
Preparás la palta en cubos y la zanahoria rallada.
Salteás los langostinos pelados 2 minutos por lado con una pizca de ajo y sal.
Sumás todo al bowl. Batís la mostaza con la miel, el aceite de oliva, el vinagre de manzana y una pizca de sal; aderezás al servir. Servís enseguida.'),
  ('ensalada-de-repollo-colorado-con-salmon-ahumado-uvas-y', 'Ensalada de repollo colorado con salmón ahumado, uvas y cebolla morada', 10, 1, '{almuerzo,cena}', true, 'Cortás el repollo colorado en tiras muy finas y lo masajeás un minuto con una pizca de sal.
Preparás las uvas cortadas al medio y la cebolla morada en plumas finitas.
Cortás el salmón ahumado en tiras.
Sumás todo al bowl. Aderezás con el jugo de limón, el aceite de oliva, sal y pimienta. Servís enseguida.'),
  ('ensalada-de-rucula-con-tofu-dorado-aceitunas-y-arvejas', 'Ensalada de rúcula con tofu dorado, aceitunas y arvejas', 18, 1, '{almuerzo,cena}', true, 'Lavás y secás la rúcula; la ponés en un bowl grande.
Preparás las aceitunas y las arvejas hervidas 3 minutos.
Cortás el tofu en cubos y los dorás en una sartén con una gota de aceite, 4 minutos por lado.
Sumás todo al bowl. Mezclás una cucharada sopera de pesto con una cucharada de agua y aderezás. Se puede llevar con el aderezo aparte.'),
  ('ensalada-de-espinaca-con-lentejas-apio-y-aceitunas', 'Ensalada de espinaca con lentejas, apio y aceitunas', 11, 1, '{almuerzo,cena}', true, 'Lavás y secás bien las hojas de espinaca y las ponés en un bowl grande.
Preparás el apio en rodajitas y las aceitunas.
Enjuagás las lentejas y las escurrís bien.
Sumás todo al bowl. Mezclás una cucharada sopera de pesto con una cucharada de agua y aderezás. Mezclás suave y servís.'),
  ('ensalada-de-radicheta-con-lentejas-cebolla-morada-y', 'Ensalada de radicheta con lentejas, cebolla morada y aceitunas', 11, 1, '{almuerzo,cena}', true, 'Lavás y secás la radicheta y la cortás en trozos.
Preparás la cebolla morada en plumas finitas y las aceitunas.
Enjuagás las lentejas y las escurrís bien.
Sumás todo al bowl. Batís la mostaza con la miel, el aceite de oliva, el vinagre de manzana y una pizca de sal; aderezás al servir. Mezclás suave y servís.'),
  ('ensalada-de-repollo-colorado-con-langostinos-palmitos-y', 'Ensalada de repollo colorado con langostinos, palmitos y rabanitos', 16, 1, '{almuerzo,cena}', true, 'Cortás el repollo colorado en tiras muy finas y lo masajeás un minuto con una pizca de sal.
Preparás los palmitos en rodajas y los rabanitos en rodajas finas.
Salteás los langostinos pelados 2 minutos por lado con una pizca de ajo y sal.
Sumás todo al bowl. Mezclás el yogur con el jugo de limón, sal, pimienta y una pizca de ajo en polvo; aderezás justo antes de servir. Mezclás suave y servís.'),
  ('ensalada-de-lechuga-morada-con-porotos-negros-palta-y', 'Ensalada de lechuga morada con porotos negros, palta y palmitos', 11, 1, '{almuerzo,cena}', true, 'Lavás y secás la lechuga morada, la cortás con la mano y la ponés en un bowl grande.
Preparás la palta en cubos y los palmitos en rodajas.
Enjuagás los porotos negros y los escurrís bien.
Sumás todo al bowl. Aderezás con una cucharada sopera de salsa césar y mezclás bien. Se puede llevar con el aderezo aparte.'),
  ('ensalada-de-kale-con-garbanzos-rabanitos-y-brotes-de', 'Ensalada de kale con garbanzos, rabanitos y brotes de soja', 11, 1, '{almuerzo,cena}', true, 'Sacás los tallos del kale, lo cortás fino y lo masajeás un minuto con unas gotas de limón para que se ablande.
Preparás los rabanitos en rodajas finas y los brotes de soja.
Enjuagás los garbanzos y los escurrís bien.
Sumás todo al bowl. Diluís el tahini con el jugo de limón, un chorrito de agua y sal hasta que quede cremoso; lo volcás por encima. Mezclás suave y servís.'),
  ('ensalada-de-repollo-colorado-con-jamon-crudo-croutons-y', 'Ensalada de repollo colorado con jamón crudo, croutons y pera', 10, 1, '{almuerzo,cena}', true, 'Cortás el repollo colorado en tiras muy finas y lo masajeás un minuto con una pizca de sal.
Preparás los croutons y la pera en láminas.
Rompés el jamón crudo en tiras con la mano.
Sumás todo al bowl. Aderezás con el jugo de limón, el aceite de oliva, sal y pimienta. Mezclás suave y servís.'),
  ('ensalada-de-escarola-con-mejillones-tomate-y-palmitos', 'Ensalada de escarola con mejillones, tomate y palmitos', 10, 1, '{almuerzo,cena}', true, 'Lavás y secás la escarola y la cortás en trozos.
Preparás el tomate en gajos y los palmitos en rodajas.
Escurrís los mejillones y los sumás enteros.
Sumás todo al bowl. Aderezás con el aceto, el aceite de oliva, sal y pimienta. Servís enseguida.'),
  ('ensalada-de-repollo-con-porotos-arvejas-y-parmesano', 'Ensalada de repollo con porotos, arvejas y parmesano', 11, 1, '{almuerzo,cena}', true, 'Cortás el repollo en tiras muy finas y lo masajeás un minuto con una pizca de sal para que se ablande.
Preparás las arvejas hervidas 3 minutos y el parmesano en lascas con el pelapapas.
Enjuagás los porotos y los escurrís bien.
Sumás todo al bowl. Aderezás con el aceto, el aceite de oliva, sal y pimienta. Mezclás suave y servís.'),
  ('ensalada-de-lechuga-con-alubias-rabanitos-y-morron', 'Ensalada de lechuga con alubias, rabanitos y morrón', 11, 1, '{almuerzo,cena}', true, 'Lavás y secás bien la lechuga, la cortás con la mano y la ponés en un bowl grande.
Preparás los rabanitos en rodajas finas y el morrón en tiras.
Enjuagás las alubias y las escurrís bien.
Sumás todo al bowl. Mezclás el yogur con el jugo de limón, sal, pimienta y una pizca de ajo en polvo; aderezás justo antes de servir. Mezclás suave y servís.'),
  ('ensalada-de-lechuga-con-queso-de-cabra-apio-y-frutillas', 'Ensalada de lechuga con queso de cabra, apio y frutillas', 10, 1, '{almuerzo,cena}', true, 'Lavás y secás bien la lechuga, la cortás con la mano y la ponés en un bowl grande.
Preparás el apio en rodajitas y las frutillas en cuartos.
Desmenuzás el queso de cabra por encima.
Sumás todo al bowl. Aderezás con el aceto, el aceite de oliva, sal y pimienta. Mezclás suave y servís.'),
  ('ensalada-de-rucula-con-mejillones-zanahoria-rallada-y', 'Ensalada de rúcula con mejillones, zanahoria rallada y palta', 10, 1, '{almuerzo,cena}', true, 'Lavás y secás la rúcula; la ponés en un bowl grande.
Preparás la zanahoria rallada y la palta en cubos.
Escurrís los mejillones y los sumás enteros.
Sumás todo al bowl. Aderezás con una cucharada sopera de salsa césar y mezclás bien. Servís enseguida.'),
  ('ensalada-de-hojas-verdes-con-jamon-crudo-zanahoria-y', 'Ensalada de hojas verdes con jamón crudo, zanahoria y manzana', 10, 1, '{almuerzo,cena}', true, 'Lavás y secás las hojas verdes y las ponés en un bowl grande.
Preparás la zanahoria rallada y la manzana en cubitos (con unas gotas de limón para que no se oscurezca).
Rompés el jamón crudo en tiras con la mano.
Sumás todo al bowl. Aderezás con el aceto, el aceite de oliva, sal y pimienta. Servís enseguida.'),
  ('ensalada-de-repollo-con-queso-feta-tomates-cherry-y', 'Ensalada de repollo con queso feta, tomates cherry y aceitunas', 10, 1, '{almuerzo,cena}', true, 'Cortás el repollo en tiras muy finas y lo masajeás un minuto con una pizca de sal para que se ablande.
Preparás los tomates cherry por la mitad y las aceitunas.
Cortás el feta en cubos.
Sumás todo al bowl. Aderezás con el aceto, el aceite de oliva, sal y pimienta. Servís enseguida.'),
  ('ensalada-de-kale-con-tofu-dorado-tomate-y-parmesano', 'Ensalada de kale con tofu dorado, tomate y parmesano', 18, 1, '{almuerzo,cena}', true, 'Sacás los tallos del kale, lo cortás fino y lo masajeás un minuto con unas gotas de limón para que se ablande.
Preparás el tomate en gajos y el parmesano en lascas con el pelapapas.
Cortás el tofu en cubos y los dorás en una sartén con una gota de aceite, 4 minutos por lado.
Sumás todo al bowl. Batís la mostaza con la miel, el aceite de oliva, el vinagre de manzana y una pizca de sal; aderezás al servir. Mezclás suave y servís.'),
  ('ensalada-de-repollo-con-mejillones-cebolla-morada-y', 'Ensalada de repollo con mejillones, cebolla morada y remolacha', 10, 1, '{almuerzo,cena}', true, 'Cortás el repollo en tiras muy finas y lo masajeás un minuto con una pizca de sal para que se ablande.
Preparás la cebolla morada en plumas finitas y la remolacha cocida en cubos.
Escurrís los mejillones y los sumás enteros.
Sumás todo al bowl. Aderezás con el jugo de limón, el aceite de oliva, sal y pimienta. Mezclás suave y servís.'),
  ('ensalada-de-radicheta-con-atun-choclo-y-apio', 'Ensalada de radicheta con atún, choclo y apio', 11, 1, '{almuerzo,cena}', true, 'Lavás y secás la radicheta y la cortás en trozos.
Preparás el choclo escurrido y el apio en rodajitas.
Escurrís bien el atún y lo desmenuzás con un tenedor.
Sumás todo al bowl. Aderezás con una cucharada sopera de salsa césar y mezclás bien. Se puede llevar con el aderezo aparte.'),
  ('ensalada-de-escarola-con-porotos-palmitos-y-brotes-de', 'Ensalada de escarola con porotos, palmitos y brotes de soja', 11, 1, '{almuerzo,cena}', true, 'Lavás y secás la escarola y la cortás en trozos.
Preparás los palmitos en rodajas y los brotes de soja.
Enjuagás los porotos y los escurrís bien.
Sumás todo al bowl. Diluís el tahini con el jugo de limón, un chorrito de agua y sal hasta que quede cremoso; lo volcás por encima. Se puede llevar con el aderezo aparte.'),
  ('ensalada-de-kale-con-porotos-tomate-y-brotes-de-soja', 'Ensalada de kale con porotos, tomate y brotes de soja', 11, 1, '{almuerzo,cena}', true, 'Sacás los tallos del kale, lo cortás fino y lo masajeás un minuto con unas gotas de limón para que se ablande.
Preparás el tomate en gajos y los brotes de soja.
Enjuagás los porotos y los escurrís bien.
Sumás todo al bowl. Diluís el tahini con el jugo de limón, un chorrito de agua y sal hasta que quede cremoso; lo volcás por encima. Mezclás suave y servís.'),
  ('ensalada-de-escarola-con-queso-de-cabra-rabanitos-y', 'Ensalada de escarola con queso de cabra, rabanitos y semillas de girasol', 10, 1, '{almuerzo,cena}', true, 'Lavás y secás la escarola y la cortás en trozos.
Preparás los rabanitos en rodajas finas y las semillas de girasol.
Desmenuzás el queso de cabra por encima.
Sumás todo al bowl. Mezclás una cucharada sopera de pesto con una cucharada de agua y aderezás. Se puede llevar con el aderezo aparte.'),
  ('ensalada-de-espinaca-con-pollo-grillado-pera-y-semillas', 'Ensalada de espinaca con pollo grillado, pera y semillas de girasol', 23, 1, '{almuerzo,cena}', true, 'Lavás y secás bien las hojas de espinaca y las ponés en un bowl grande.
Preparás la pera en láminas y las semillas de girasol.
Salpimentás la pechuga y la cocinás en una plancha bien caliente, 5–6 minutos por lado. La dejás reposar 3 minutos y la cortás en tiras.
Sumás todo al bowl. Batís la mostaza con la miel, el aceite de oliva, el vinagre de manzana y una pizca de sal; aderezás al servir. Servís enseguida.'),
  ('ensalada-de-lechuga-morada-con-queso-cottage-palmitos-y', 'Ensalada de lechuga morada con queso cottage, palmitos y croutons', 9, 1, '{almuerzo,cena}', true, 'Lavás y secás la lechuga morada, la cortás con la mano y la ponés en un bowl grande.
Preparás los palmitos en rodajas y los croutons.
Reservás el queso cottage para servir arriba.
Sumás todo al bowl. Mezclás el yogur con el jugo de limón, sal, pimienta y una pizca de ajo en polvo; aderezás justo antes de servir. Se puede llevar con el aderezo aparte.'),
  ('ensalada-de-rucula-con-queso-feta-tomate-y-naranja', 'Ensalada de rúcula con queso feta, tomate y naranja', 10, 1, '{almuerzo,cena}', true, 'Lavás y secás la rúcula; la ponés en un bowl grande.
Preparás el tomate en gajos y la naranja pelada a vivo y en gajos.
Cortás el feta en cubos.
Sumás todo al bowl. Batís la mostaza con la miel, el aceite de oliva, el vinagre de manzana y una pizca de sal; aderezás al servir. Se puede llevar con el aderezo aparte.'),
  ('ensalada-de-espinaca-con-jamon-cocido-apio-y-palta', 'Ensalada de espinaca con jamón cocido, apio y palta', 10, 1, '{almuerzo,cena}', true, 'Lavás y secás bien las hojas de espinaca y las ponés en un bowl grande.
Preparás el apio en rodajitas y la palta en cubos.
Cortás el jamón en tiritas.
Sumás todo al bowl. Batís la mostaza con la miel, el aceite de oliva, el vinagre de manzana y una pizca de sal; aderezás al servir. Se puede llevar con el aderezo aparte.'),
  ('ensalada-de-lechuga-morada-con-pollo-grillado-palmitos', 'Ensalada de lechuga morada con pollo grillado, palmitos y rabanitos', 23, 1, '{almuerzo,cena}', true, 'Lavás y secás la lechuga morada, la cortás con la mano y la ponés en un bowl grande.
Preparás los palmitos en rodajas y los rabanitos en rodajas finas.
Salpimentás la pechuga y la cocinás en una plancha bien caliente, 5–6 minutos por lado. La dejás reposar 3 minutos y la cortás en tiras.
Sumás todo al bowl. Aderezás con el jugo de limón, el aceite de oliva, sal y pimienta. Servís enseguida.'),
  ('ensalada-de-lechuga-con-lentejas-zanahoria-rallada-y', 'Ensalada de lechuga con lentejas, zanahoria rallada y tomate', 11, 1, '{almuerzo,cena}', true, 'Lavás y secás bien la lechuga, la cortás con la mano y la ponés en un bowl grande.
Preparás la zanahoria rallada y el tomate en gajos.
Enjuagás las lentejas y las escurrís bien.
Sumás todo al bowl. Mezclás el yogur con el jugo de limón, sal, pimienta y una pizca de ajo en polvo; aderezás justo antes de servir. Servís enseguida.'),
  ('ensalada-de-hojas-verdes-con-porotos-negros-morron-y', 'Ensalada de hojas verdes con porotos negros, morrón y tomates cherry', 11, 1, '{almuerzo,cena}', true, 'Lavás y secás las hojas verdes y las ponés en un bowl grande.
Preparás el morrón en tiras y los tomates cherry por la mitad.
Enjuagás los porotos negros y los escurrís bien.
Sumás todo al bowl. Aderezás con el aceto, el aceite de oliva, sal y pimienta. Servís enseguida.'),
  ('ensalada-de-lechuga-morada-con-mejillones-croutons-y', 'Ensalada de lechuga morada con mejillones, croutons y rabanitos', 10, 1, '{almuerzo,cena}', true, 'Lavás y secás la lechuga morada, la cortás con la mano y la ponés en un bowl grande.
Preparás los croutons y los rabanitos en rodajas finas.
Escurrís los mejillones y los sumás enteros.
Sumás todo al bowl. Mezclás el yogur con la mostaza antigua, sal y pimienta, y aderezás al servir. Mezclás suave y servís.'),
  ('ensalada-de-repollo-colorado-con-atun-brotes-de-soja-y', 'Ensalada de repollo colorado con atún, brotes de soja y remolacha', 11, 1, '{almuerzo,cena}', true, 'Cortás el repollo colorado en tiras muy finas y lo masajeás un minuto con una pizca de sal.
Preparás los brotes de soja y la remolacha cocida en cubos.
Escurrís bien el atún y lo desmenuzás con un tenedor.
Sumás todo al bowl. Batís la mostaza con la miel, el aceite de oliva, el vinagre de manzana y una pizca de sal; aderezás al servir. Mezclás suave y servís.'),
  ('ensalada-de-kale-con-mejillones-apio-y-brotes-de-soja', 'Ensalada de kale con mejillones, apio y brotes de soja', 10, 1, '{almuerzo,cena}', true, 'Sacás los tallos del kale, lo cortás fino y lo masajeás un minuto con unas gotas de limón para que se ablande.
Preparás el apio en rodajitas y los brotes de soja.
Escurrís los mejillones y los sumás enteros.
Sumás todo al bowl. Aderezás con una cucharada sopera de salsa césar y mezclás bien. Mezclás suave y servís.'),
  ('ensalada-de-repollo-colorado-con-queso-feta-hinojo-y', 'Ensalada de repollo colorado con queso feta, hinojo y tomate', 10, 1, '{almuerzo,cena}', true, 'Cortás el repollo colorado en tiras muy finas y lo masajeás un minuto con una pizca de sal.
Preparás el hinojo en láminas finas y el tomate en gajos.
Cortás el feta en cubos.
Sumás todo al bowl. Aderezás con una cucharada sopera de salsa césar y mezclás bien. Servís enseguida.'),
  ('ensalada-de-lechuga-morada-con-jamon-crudo-nueces-y', 'Ensalada de lechuga morada con jamón crudo, nueces y choclo', 10, 1, '{almuerzo,cena}', true, 'Lavás y secás la lechuga morada, la cortás con la mano y la ponés en un bowl grande.
Preparás las nueces picadas y el choclo escurrido.
Rompés el jamón crudo en tiras con la mano.
Sumás todo al bowl. Batís la mostaza con la miel, el aceite de oliva, el vinagre de manzana y una pizca de sal; aderezás al servir. Servís enseguida.'),
  ('ensalada-de-hojas-verdes-con-queso-cremoso-zanahoria', 'Ensalada de hojas verdes con queso cremoso, zanahoria rallada y parmesano', 10, 1, '{almuerzo,cena}', true, 'Lavás y secás las hojas verdes y las ponés en un bowl grande.
Preparás la zanahoria rallada y el parmesano en lascas con el pelapapas.
Cortás el queso en cubos.
Sumás todo al bowl. Mezclás el yogur con la mostaza antigua, sal y pimienta, y aderezás al servir. Mezclás suave y servís.'),
  ('ensalada-de-rucula-con-muzzarella-morron-y-zanahoria', 'Ensalada de rúcula con muzzarella, morrón y zanahoria rallada', 10, 1, '{almuerzo,cena}', true, 'Lavás y secás la rúcula; la ponés en un bowl grande.
Preparás el morrón en tiras y la zanahoria rallada.
Cortás la muzzarella en cubos o la rompés a mano.
Sumás todo al bowl. Aderezás con el jugo de limón, el aceite de oliva, sal y pimienta. Servís enseguida.'),
  ('ensalada-de-espinaca-con-muzzarella-cebolla-morada-y', 'Ensalada de espinaca con muzzarella, cebolla morada y morrón', 10, 1, '{almuerzo,cena}', true, 'Lavás y secás bien las hojas de espinaca y las ponés en un bowl grande.
Preparás la cebolla morada en plumas finitas y el morrón en tiras.
Cortás la muzzarella en cubos o la rompés a mano.
Sumás todo al bowl. Mezclás el yogur con el jugo de limón, sal, pimienta y una pizca de ajo en polvo; aderezás justo antes de servir. Mezclás suave y servís.'),
  ('ensalada-de-repollo-colorado-con-alubias-brotes-de-soja', 'Ensalada de repollo colorado con alubias, brotes de soja y tomates cherry', 11, 1, '{almuerzo,cena}', true, 'Cortás el repollo colorado en tiras muy finas y lo masajeás un minuto con una pizca de sal.
Preparás los brotes de soja y los tomates cherry por la mitad.
Enjuagás las alubias y las escurrís bien.
Sumás todo al bowl. Aderezás con el jugo de limón, el aceite de oliva, sal y pimienta. Mezclás suave y servís.'),
  ('ensalada-de-hojas-verdes-con-garbanzos-zanahoria', 'Ensalada de hojas verdes con garbanzos, zanahoria rallada y remolacha', 11, 1, '{almuerzo,cena}', true, 'Lavás y secás las hojas verdes y las ponés en un bowl grande.
Preparás la zanahoria rallada y la remolacha cocida en cubos.
Enjuagás los garbanzos y los escurrís bien.
Sumás todo al bowl. Aderezás con el jugo de limón, el aceite de oliva, sal y pimienta. Mezclás suave y servís.'),
  ('ensalada-de-repollo-con-lentejas-apio-y-zanahoria', 'Ensalada de repollo con lentejas, apio y zanahoria rallada', 11, 1, '{almuerzo,cena}', true, 'Cortás el repollo en tiras muy finas y lo masajeás un minuto con una pizca de sal para que se ablande.
Preparás el apio en rodajitas y la zanahoria rallada.
Enjuagás las lentejas y las escurrís bien.
Sumás todo al bowl. Diluís el tahini con el jugo de limón, un chorrito de agua y sal hasta que quede cremoso; lo volcás por encima. Se puede llevar con el aderezo aparte.'),
  ('ensalada-de-espinaca-con-jamon-crudo-croutons-y', 'Ensalada de espinaca con jamón crudo, croutons y parmesano', 10, 1, '{almuerzo,cena}', true, 'Lavás y secás bien las hojas de espinaca y las ponés en un bowl grande.
Preparás los croutons y el parmesano en lascas con el pelapapas.
Rompés el jamón crudo en tiras con la mano.
Sumás todo al bowl. Batís la mostaza con la miel, el aceite de oliva, el vinagre de manzana y una pizca de sal; aderezás al servir. Se puede llevar con el aderezo aparte.'),
  ('ensalada-de-repollo-con-queso-cottage-manzana-y', 'Ensalada de repollo con queso cottage, manzana y parmesano', 9, 1, '{almuerzo,cena}', true, 'Cortás el repollo en tiras muy finas y lo masajeás un minuto con una pizca de sal para que se ablande.
Preparás la manzana en cubitos (con unas gotas de limón para que no se oscurezca) y el parmesano en lascas con el pelapapas.
Reservás el queso cottage para servir arriba.
Sumás todo al bowl. Batís la mostaza con la miel, el aceite de oliva, el vinagre de manzana y una pizca de sal; aderezás al servir. Se puede llevar con el aderezo aparte.'),
  ('ensalada-de-repollo-con-langostinos-arvejas-y-morron', 'Ensalada de repollo con langostinos, arvejas y morrón', 16, 1, '{almuerzo,cena}', true, 'Cortás el repollo en tiras muy finas y lo masajeás un minuto con una pizca de sal para que se ablande.
Preparás las arvejas hervidas 3 minutos y el morrón en tiras.
Salteás los langostinos pelados 2 minutos por lado con una pizca de ajo y sal.
Sumás todo al bowl. Mezclás una cucharada sopera de pesto con una cucharada de agua y aderezás. Mezclás suave y servís.'),
  ('ensalada-de-espinaca-con-queso-cottage-nueces-y-tomate', 'Ensalada de espinaca con queso cottage, nueces y tomate', 9, 1, '{almuerzo,cena}', true, 'Lavás y secás bien las hojas de espinaca y las ponés en un bowl grande.
Preparás las nueces picadas y el tomate en gajos.
Reservás el queso cottage para servir arriba.
Sumás todo al bowl. Diluís el tahini con el jugo de limón, un chorrito de agua y sal hasta que quede cremoso; lo volcás por encima. Mezclás suave y servís.'),
  ('ensalada-de-hojas-verdes-con-mejillones-rabanitos-y', 'Ensalada de hojas verdes con mejillones, rabanitos y morrón', 10, 1, '{almuerzo,cena}', true, 'Lavás y secás las hojas verdes y las ponés en un bowl grande.
Preparás los rabanitos en rodajas finas y el morrón en tiras.
Escurrís los mejillones y los sumás enteros.
Sumás todo al bowl. Aderezás con el aceto, el aceite de oliva, sal y pimienta. Se puede llevar con el aderezo aparte.'),
  ('ensalada-de-repollo-con-jamon-cocido-hinojo-y-tomates', 'Ensalada de repollo con jamón cocido, hinojo y tomates cherry', 10, 1, '{almuerzo,cena}', true, 'Cortás el repollo en tiras muy finas y lo masajeás un minuto con una pizca de sal para que se ablande.
Preparás el hinojo en láminas finas y los tomates cherry por la mitad.
Cortás el jamón en tiritas.
Sumás todo al bowl. Diluís el tahini con el jugo de limón, un chorrito de agua y sal hasta que quede cremoso; lo volcás por encima. Mezclás suave y servís.'),
  ('ensalada-de-rucula-con-huevo-duro-tomate-y-tomates', 'Ensalada de rúcula con huevo duro, tomate y tomates cherry', 20, 1, '{almuerzo,cena}', true, 'Lavás y secás la rúcula; la ponés en un bowl grande.
Preparás el tomate en gajos y los tomates cherry por la mitad.
Hervís los huevos 10 minutos, los pasás por agua fría, los pelás y los cortás en cuartos.
Sumás todo al bowl. Aderezás con una cucharada sopera de salsa césar y mezclás bien. Servís enseguida.'),
  ('ensalada-de-rucula-con-queso-cremoso-aceitunas-y-naranja', 'Ensalada de rúcula con queso cremoso, aceitunas y naranja', 10, 1, '{almuerzo,cena}', true, 'Lavás y secás la rúcula; la ponés en un bowl grande.
Preparás las aceitunas y la naranja pelada a vivo y en gajos.
Cortás el queso en cubos.
Sumás todo al bowl. Aderezás con el aceto, el aceite de oliva, sal y pimienta. Se puede llevar con el aderezo aparte.'),
  ('ensalada-de-rucula-con-porotos-negros-apio-y-rabanitos', 'Ensalada de rúcula con porotos negros, apio y rabanitos', 11, 1, '{almuerzo,cena}', true, 'Lavás y secás la rúcula; la ponés en un bowl grande.
Preparás el apio en rodajitas y los rabanitos en rodajas finas.
Enjuagás los porotos negros y los escurrís bien.
Sumás todo al bowl. Mezclás el yogur con la mostaza antigua, sal y pimienta, y aderezás al servir. Se puede llevar con el aderezo aparte.'),
  ('ensalada-de-berro-con-bife-de-nalga-pepino-y-parmesano', 'Ensalada de berro con bife de nalga, pepino y parmesano', 20, 1, '{almuerzo,cena}', true, 'Lavás el berro, sacás los tallos más duros y lo secás bien.
Preparás el pepino en rodajas y el parmesano en lascas con el pelapapas.
Sellás el bife en una plancha bien caliente 3 minutos por lado, con sal y pimienta. Lo dejás reposar 3 minutos y lo cortás en tiras.
Sumás todo al bowl. Mezclás el yogur con la mostaza antigua, sal y pimienta, y aderezás al servir. Mezclás suave y servís.'),
  ('ensalada-de-repollo-colorado-con-huevo-duro-croutons-y', 'Ensalada de repollo colorado con huevo duro, croutons y aceitunas', 20, 1, '{almuerzo,cena}', true, 'Cortás el repollo colorado en tiras muy finas y lo masajeás un minuto con una pizca de sal.
Preparás los croutons y las aceitunas.
Hervís los huevos 10 minutos, los pasás por agua fría, los pelás y los cortás en cuartos.
Sumás todo al bowl. Batís la mostaza con la miel, el aceite de oliva, el vinagre de manzana y una pizca de sal; aderezás al servir. Se puede llevar con el aderezo aparte.'),
  ('ensalada-de-kale-con-jamon-cocido-rabanitos-y-palmitos', 'Ensalada de kale con jamón cocido, rabanitos y palmitos', 10, 1, '{almuerzo,cena}', true, 'Sacás los tallos del kale, lo cortás fino y lo masajeás un minuto con unas gotas de limón para que se ablande.
Preparás los rabanitos en rodajas finas y los palmitos en rodajas.
Cortás el jamón en tiritas.
Sumás todo al bowl. Aderezás con el aceto, el aceite de oliva, sal y pimienta. Mezclás suave y servís.'),
  ('ensalada-de-radicheta-con-edamame-palmitos-y-tomate', 'Ensalada de radicheta con edamame, palmitos y tomate', 11, 1, '{almuerzo,cena}', true, 'Lavás y secás la radicheta y la cortás en trozos.
Preparás los palmitos en rodajas y el tomate en gajos.
Descongelás el edamame con agua caliente y lo escurrís.
Sumás todo al bowl. Mezclás una cucharada sopera de pesto con una cucharada de agua y aderezás. Se puede llevar con el aderezo aparte.'),
  ('ensalada-de-radicheta-con-alubias-pepino-y-cebolla', 'Ensalada de radicheta con alubias, pepino y cebolla morada', 11, 1, '{almuerzo,cena}', true, 'Lavás y secás la radicheta y la cortás en trozos.
Preparás el pepino en rodajas y la cebolla morada en plumas finitas.
Enjuagás las alubias y las escurrís bien.
Sumás todo al bowl. Aderezás con el aceto, el aceite de oliva, sal y pimienta. Se puede llevar con el aderezo aparte.'),
  ('ensalada-de-kale-con-jamon-crudo-remolacha-y-palmitos', 'Ensalada de kale con jamón crudo, remolacha y palmitos', 10, 1, '{almuerzo,cena}', true, 'Sacás los tallos del kale, lo cortás fino y lo masajeás un minuto con unas gotas de limón para que se ablande.
Preparás la remolacha cocida en cubos y los palmitos en rodajas.
Rompés el jamón crudo en tiras con la mano.
Sumás todo al bowl. Mezclás el yogur con la mostaza antigua, sal y pimienta, y aderezás al servir. Se puede llevar con el aderezo aparte.'),
  ('ensalada-de-radicheta-con-porotos-negros-remolacha-y', 'Ensalada de radicheta con porotos negros, remolacha y palmitos', 11, 1, '{almuerzo,cena}', true, 'Lavás y secás la radicheta y la cortás en trozos.
Preparás la remolacha cocida en cubos y los palmitos en rodajas.
Enjuagás los porotos negros y los escurrís bien.
Sumás todo al bowl. Mezclás el yogur con el jugo de limón, sal, pimienta y una pizca de ajo en polvo; aderezás justo antes de servir. Mezclás suave y servís.'),
  ('ensalada-de-radicheta-con-jamon-cocido-parmesano-y-apio', 'Ensalada de radicheta con jamón cocido, parmesano y apio', 10, 1, '{almuerzo,cena}', true, 'Lavás y secás la radicheta y la cortás en trozos.
Preparás el parmesano en lascas con el pelapapas y el apio en rodajitas.
Cortás el jamón en tiritas.
Sumás todo al bowl. Aderezás con una cucharada sopera de salsa césar y mezclás bien. Se puede llevar con el aderezo aparte.'),
  ('ensalada-de-hojas-verdes-con-queso-feta-apio-y-frutillas', 'Ensalada de hojas verdes con queso feta, apio y frutillas', 10, 1, '{almuerzo,cena}', true, 'Lavás y secás las hojas verdes y las ponés en un bowl grande.
Preparás el apio en rodajitas y las frutillas en cuartos.
Cortás el feta en cubos.
Sumás todo al bowl. Aderezás con el jugo de limón, el aceite de oliva, sal y pimienta. Servís enseguida.'),
  ('ensalada-de-espinaca-con-mejillones-aceitunas-y-tomate', 'Ensalada de espinaca con mejillones, aceitunas y tomate', 10, 1, '{almuerzo,cena}', true, 'Lavás y secás bien las hojas de espinaca y las ponés en un bowl grande.
Preparás las aceitunas y el tomate en gajos.
Escurrís los mejillones y los sumás enteros.
Sumás todo al bowl. Mezclás una cucharada sopera de pesto con una cucharada de agua y aderezás. Servís enseguida.'),
  ('ensalada-de-lechuga-morada-con-garbanzos-remolacha-y', 'Ensalada de lechuga morada con garbanzos, remolacha y pepino', 11, 1, '{almuerzo,cena}', true, 'Lavás y secás la lechuga morada, la cortás con la mano y la ponés en un bowl grande.
Preparás la remolacha cocida en cubos y el pepino en rodajas.
Enjuagás los garbanzos y los escurrís bien.
Sumás todo al bowl. Mezclás una cucharada sopera de pesto con una cucharada de agua y aderezás. Servís enseguida.'),
  ('ensalada-de-berro-con-pollo-grillado-cebolla-morada-y', 'Ensalada de berro con pollo grillado, cebolla morada y aceitunas', 23, 1, '{almuerzo,cena}', true, 'Lavás el berro, sacás los tallos más duros y lo secás bien.
Preparás la cebolla morada en plumas finitas y las aceitunas.
Salpimentás la pechuga y la cocinás en una plancha bien caliente, 5–6 minutos por lado. La dejás reposar 3 minutos y la cortás en tiras.
Sumás todo al bowl. Diluís el tahini con el jugo de limón, un chorrito de agua y sal hasta que quede cremoso; lo volcás por encima. Servís enseguida.'),
  ('ensalada-de-lechuga-con-jamon-crudo-parmesano-y-tomate', 'Ensalada de lechuga con jamón crudo, parmesano y tomate', 10, 1, '{almuerzo,cena}', true, 'Lavás y secás bien la lechuga, la cortás con la mano y la ponés en un bowl grande.
Preparás el parmesano en lascas con el pelapapas y el tomate en gajos.
Rompés el jamón crudo en tiras con la mano.
Sumás todo al bowl. Aderezás con el aceto, el aceite de oliva, sal y pimienta. Mezclás suave y servís.'),
  ('ensalada-de-kale-con-pollo-grillado-morron-y-pera', 'Ensalada de kale con pollo grillado, morrón y pera', 23, 1, '{almuerzo,cena}', true, 'Sacás los tallos del kale, lo cortás fino y lo masajeás un minuto con unas gotas de limón para que se ablande.
Preparás el morrón en tiras y la pera en láminas.
Salpimentás la pechuga y la cocinás en una plancha bien caliente, 5–6 minutos por lado. La dejás reposar 3 minutos y la cortás en tiras.
Sumás todo al bowl. Aderezás con el aceto, el aceite de oliva, sal y pimienta. Se puede llevar con el aderezo aparte.'),
  ('ensalada-de-repollo-colorado-con-queso-cremoso-tomate-y', 'Ensalada de repollo colorado con queso cremoso, tomate y remolacha', 10, 1, '{almuerzo,cena}', true, 'Cortás el repollo colorado en tiras muy finas y lo masajeás un minuto con una pizca de sal.
Preparás el tomate en gajos y la remolacha cocida en cubos.
Cortás el queso en cubos.
Sumás todo al bowl. Diluís el tahini con el jugo de limón, un chorrito de agua y sal hasta que quede cremoso; lo volcás por encima. Servís enseguida.'),
  ('ensalada-de-rucula-con-pollo-grillado-brotes-de-soja-y', 'Ensalada de rúcula con pollo grillado, brotes de soja y palmitos', 23, 1, '{almuerzo,cena}', true, 'Lavás y secás la rúcula; la ponés en un bowl grande.
Preparás los brotes de soja y los palmitos en rodajas.
Salpimentás la pechuga y la cocinás en una plancha bien caliente, 5–6 minutos por lado. La dejás reposar 3 minutos y la cortás en tiras.
Sumás todo al bowl. Mezclás el yogur con el jugo de limón, sal, pimienta y una pizca de ajo en polvo; aderezás justo antes de servir. Servís enseguida.'),
  ('ensalada-de-espinaca-con-bife-de-nalga-palta-y-semillas', 'Ensalada de espinaca con bife de nalga, palta y semillas de girasol', 20, 1, '{almuerzo,cena}', true, 'Lavás y secás bien las hojas de espinaca y las ponés en un bowl grande.
Preparás la palta en cubos y las semillas de girasol.
Sellás el bife en una plancha bien caliente 3 minutos por lado, con sal y pimienta. Lo dejás reposar 3 minutos y lo cortás en tiras.
Sumás todo al bowl. Mezclás el yogur con la mostaza antigua, sal y pimienta, y aderezás al servir. Mezclás suave y servís.'),
  ('ensalada-de-escarola-con-tofu-dorado-pepino-y-morron', 'Ensalada de escarola con tofu dorado, pepino y morrón', 18, 1, '{almuerzo,cena}', true, 'Lavás y secás la escarola y la cortás en trozos.
Preparás el pepino en rodajas y el morrón en tiras.
Cortás el tofu en cubos y los dorás en una sartén con una gota de aceite, 4 minutos por lado.
Sumás todo al bowl. Batís la mostaza con la miel, el aceite de oliva, el vinagre de manzana y una pizca de sal; aderezás al servir. Servís enseguida.'),
  ('ensalada-de-repollo-con-bife-de-nalga-arvejas-y', 'Ensalada de repollo con bife de nalga, arvejas y zanahoria rallada', 20, 1, '{almuerzo,cena}', true, 'Cortás el repollo en tiras muy finas y lo masajeás un minuto con una pizca de sal para que se ablande.
Preparás las arvejas hervidas 3 minutos y la zanahoria rallada.
Sellás el bife en una plancha bien caliente 3 minutos por lado, con sal y pimienta. Lo dejás reposar 3 minutos y lo cortás en tiras.
Sumás todo al bowl. Diluís el tahini con el jugo de limón, un chorrito de agua y sal hasta que quede cremoso; lo volcás por encima. Se puede llevar con el aderezo aparte.'),
  ('ensalada-de-kale-con-queso-cremoso-palta-y-cebolla', 'Ensalada de kale con queso cremoso, palta y cebolla morada', 10, 1, '{almuerzo,cena}', true, 'Sacás los tallos del kale, lo cortás fino y lo masajeás un minuto con unas gotas de limón para que se ablande.
Preparás la palta en cubos y la cebolla morada en plumas finitas.
Cortás el queso en cubos.
Sumás todo al bowl. Aderezás con el jugo de limón, el aceite de oliva, sal y pimienta. Mezclás suave y servís.'),
  ('ensalada-de-hojas-verdes-con-jamon-cocido-cebolla', 'Ensalada de hojas verdes con jamón cocido, cebolla morada y parmesano', 10, 1, '{almuerzo,cena}', true, 'Lavás y secás las hojas verdes y las ponés en un bowl grande.
Preparás la cebolla morada en plumas finitas y el parmesano en lascas con el pelapapas.
Cortás el jamón en tiritas.
Sumás todo al bowl. Aderezás con el jugo de limón, el aceite de oliva, sal y pimienta. Se puede llevar con el aderezo aparte.'),
  ('ensalada-de-espinaca-con-langostinos-pasas-de-uva-y', 'Ensalada de espinaca con langostinos, pasas de uva y aceitunas', 16, 1, '{almuerzo,cena}', true, 'Lavás y secás bien las hojas de espinaca y las ponés en un bowl grande.
Preparás las pasas de uva y las aceitunas.
Salteás los langostinos pelados 2 minutos por lado con una pizca de ajo y sal.
Sumás todo al bowl. Aderezás con el aceto, el aceite de oliva, sal y pimienta. Se puede llevar con el aderezo aparte.'),
  ('ensalada-de-lechuga-morada-con-bife-de-nalga-palta-y', 'Ensalada de lechuga morada con bife de nalga, palta y tomate', 20, 1, '{almuerzo,cena}', true, 'Lavás y secás la lechuga morada, la cortás con la mano y la ponés en un bowl grande.
Preparás la palta en cubos y el tomate en gajos.
Sellás el bife en una plancha bien caliente 3 minutos por lado, con sal y pimienta. Lo dejás reposar 3 minutos y lo cortás en tiras.
Sumás todo al bowl. Mezclás el yogur con el jugo de limón, sal, pimienta y una pizca de ajo en polvo; aderezás justo antes de servir. Se puede llevar con el aderezo aparte.'),
  ('ensalada-de-lechuga-morada-con-salmon-ahumado-pepino-y', 'Ensalada de lechuga morada con salmón ahumado, pepino y apio', 10, 1, '{almuerzo,cena}', true, 'Lavás y secás la lechuga morada, la cortás con la mano y la ponés en un bowl grande.
Preparás el pepino en rodajas y el apio en rodajitas.
Cortás el salmón ahumado en tiras.
Sumás todo al bowl. Mezclás una cucharada sopera de pesto con una cucharada de agua y aderezás. Se puede llevar con el aderezo aparte.'),
  ('ensalada-de-rucula-con-garbanzos-arvejas-y-rabanitos', 'Ensalada de rúcula con garbanzos, arvejas y rabanitos', 11, 1, '{almuerzo,cena}', true, 'Lavás y secás la rúcula; la ponés en un bowl grande.
Preparás las arvejas hervidas 3 minutos y los rabanitos en rodajas finas.
Enjuagás los garbanzos y los escurrís bien.
Sumás todo al bowl. Mezclás una cucharada sopera de pesto con una cucharada de agua y aderezás. Se puede llevar con el aderezo aparte.'),
  ('ensalada-de-repollo-con-pavo-grillado-palmitos-y-morron', 'Ensalada de repollo con pavo grillado, palmitos y morrón', 23, 1, '{almuerzo,cena}', true, 'Cortás el repollo en tiras muy finas y lo masajeás un minuto con una pizca de sal para que se ablande.
Preparás los palmitos en rodajas y el morrón en tiras.
Salpimentás la pechuga de pavo y la cocinás en plancha caliente 5 minutos por lado. La dejás reposar 3 minutos y la cortás en tiras.
Sumás todo al bowl. Mezclás el yogur con el jugo de limón, sal, pimienta y una pizca de ajo en polvo; aderezás justo antes de servir. Se puede llevar con el aderezo aparte.'),
  ('ensalada-de-rucula-con-edamame-palmitos-y-tomate', 'Ensalada de rúcula con edamame, palmitos y tomate', 11, 1, '{almuerzo,cena}', true, 'Lavás y secás la rúcula; la ponés en un bowl grande.
Preparás los palmitos en rodajas y el tomate en gajos.
Descongelás el edamame con agua caliente y lo escurrís.
Sumás todo al bowl. Aderezás con el jugo de limón, el aceite de oliva, sal y pimienta. Servís enseguida.'),
  ('ensalada-de-lechuga-morada-con-atun-brotes-de-soja-y', 'Ensalada de lechuga morada con atún, brotes de soja y arvejas', 11, 1, '{almuerzo,cena}', true, 'Lavás y secás la lechuga morada, la cortás con la mano y la ponés en un bowl grande.
Preparás los brotes de soja y las arvejas hervidas 3 minutos.
Escurrís bien el atún y lo desmenuzás con un tenedor.
Sumás todo al bowl. Mezclás el yogur con la mostaza antigua, sal y pimienta, y aderezás al servir. Se puede llevar con el aderezo aparte.'),
  ('ensalada-de-lechuga-con-jamon-cocido-parmesano-y-pepino', 'Ensalada de lechuga con jamón cocido, parmesano y pepino', 10, 1, '{almuerzo,cena}', true, 'Lavás y secás bien la lechuga, la cortás con la mano y la ponés en un bowl grande.
Preparás el parmesano en lascas con el pelapapas y el pepino en rodajas.
Cortás el jamón en tiritas.
Sumás todo al bowl. Batís la mostaza con la miel, el aceite de oliva, el vinagre de manzana y una pizca de sal; aderezás al servir. Servís enseguida.'),
  ('ensalada-de-radicheta-con-queso-de-cabra-palta-y', 'Ensalada de radicheta con queso de cabra, palta y remolacha', 10, 1, '{almuerzo,cena}', true, 'Lavás y secás la radicheta y la cortás en trozos.
Preparás la palta en cubos y la remolacha cocida en cubos.
Desmenuzás el queso de cabra por encima.
Sumás todo al bowl. Aderezás con el jugo de limón, el aceite de oliva, sal y pimienta. Mezclás suave y servís.'),
  ('ensalada-de-berro-con-pavo-grillado-pepino-y-cebolla', 'Ensalada de berro con pavo grillado, pepino y cebolla morada', 23, 1, '{almuerzo,cena}', true, 'Lavás el berro, sacás los tallos más duros y lo secás bien.
Preparás el pepino en rodajas y la cebolla morada en plumas finitas.
Salpimentás la pechuga de pavo y la cocinás en plancha caliente 5 minutos por lado. La dejás reposar 3 minutos y la cortás en tiras.
Sumás todo al bowl. Aderezás con el aceto, el aceite de oliva, sal y pimienta. Se puede llevar con el aderezo aparte.'),
  ('ensalada-de-lechuga-con-queso-feta-croutons-y-zanahoria', 'Ensalada de lechuga con queso feta, croutons y zanahoria', 10, 1, '{almuerzo,cena}', true, 'Lavás y secás bien la lechuga, la cortás con la mano y la ponés en un bowl grande.
Preparás los croutons y la zanahoria rallada.
Cortás el feta en cubos.
Sumás todo al bowl. Mezclás el yogur con la mostaza antigua, sal y pimienta, y aderezás al servir. Se puede llevar con el aderezo aparte.'),
  ('ensalada-de-escarola-con-garbanzos-cebolla-morada-y', 'Ensalada de escarola con garbanzos, cebolla morada y zanahoria rallada', 11, 1, '{almuerzo,cena}', true, 'Lavás y secás la escarola y la cortás en trozos.
Preparás la cebolla morada en plumas finitas y la zanahoria rallada.
Enjuagás los garbanzos y los escurrís bien.
Sumás todo al bowl. Aderezás con una cucharada sopera de salsa césar y mezclás bien. Se puede llevar con el aderezo aparte.'),
  ('ensalada-de-kale-con-edamame-arvejas-y-pepino', 'Ensalada de kale con edamame, arvejas y pepino', 11, 1, '{almuerzo,cena}', true, 'Sacás los tallos del kale, lo cortás fino y lo masajeás un minuto con unas gotas de limón para que se ablande.
Preparás las arvejas hervidas 3 minutos y el pepino en rodajas.
Descongelás el edamame con agua caliente y lo escurrís.
Sumás todo al bowl. Mezclás el yogur con el jugo de limón, sal, pimienta y una pizca de ajo en polvo; aderezás justo antes de servir. Mezclás suave y servís.'),
  ('ensalada-de-berro-con-queso-feta-zanahoria-y-tomates', 'Ensalada de berro con queso feta, zanahoria y tomates cherry', 10, 1, '{almuerzo,cena}', true, 'Lavás el berro, sacás los tallos más duros y lo secás bien.
Preparás la zanahoria rallada y los tomates cherry por la mitad.
Cortás el feta en cubos.
Sumás todo al bowl. Mezclás una cucharada sopera de pesto con una cucharada de agua y aderezás. Servís enseguida.'),
  ('ensalada-de-escarola-con-atun-morron-y-choclo', 'Ensalada de escarola con atún, morrón y choclo', 11, 1, '{almuerzo,cena}', true, 'Lavás y secás la escarola y la cortás en trozos.
Preparás el morrón en tiras y el choclo escurrido.
Escurrís bien el atún y lo desmenuzás con un tenedor.
Sumás todo al bowl. Mezclás el yogur con la mostaza antigua, sal y pimienta, y aderezás al servir. Se puede llevar con el aderezo aparte.'),
  ('ensalada-de-radicheta-con-tofu-dorado-aceitunas-y', 'Ensalada de radicheta con tofu dorado, aceitunas y croutons', 18, 1, '{almuerzo,cena}', true, 'Lavás y secás la radicheta y la cortás en trozos.
Preparás las aceitunas y los croutons.
Cortás el tofu en cubos y los dorás en una sartén con una gota de aceite, 4 minutos por lado.
Sumás todo al bowl. Batís la mostaza con la miel, el aceite de oliva, el vinagre de manzana y una pizca de sal; aderezás al servir. Servís enseguida.'),
  ('ensalada-de-berro-con-queso-cremoso-zanahoria-y-uvas', 'Ensalada de berro con queso cremoso, zanahoria y uvas', 10, 1, '{almuerzo,cena}', true, 'Lavás el berro, sacás los tallos más duros y lo secás bien.
Preparás la zanahoria rallada y las uvas cortadas al medio.
Cortás el queso en cubos.
Sumás todo al bowl. Aderezás con el aceto, el aceite de oliva, sal y pimienta. Se puede llevar con el aderezo aparte.'),
  ('ensalada-de-lechuga-morada-con-edamame-zanahoria-y-palta', 'Ensalada de lechuga morada con edamame, zanahoria y palta', 11, 1, '{almuerzo,cena}', true, 'Lavás y secás la lechuga morada, la cortás con la mano y la ponés en un bowl grande.
Preparás la zanahoria rallada y la palta en cubos.
Descongelás el edamame con agua caliente y lo escurrís.
Sumás todo al bowl. Mezclás una cucharada sopera de pesto con una cucharada de agua y aderezás. Servís enseguida.'),
  ('ensalada-de-repollo-colorado-con-tofu-dorado-remolacha', 'Ensalada de repollo colorado con tofu dorado, remolacha y apio', 18, 1, '{almuerzo,cena}', true, 'Cortás el repollo colorado en tiras muy finas y lo masajeás un minuto con una pizca de sal.
Preparás la remolacha cocida en cubos y el apio en rodajitas.
Cortás el tofu en cubos y los dorás en una sartén con una gota de aceite, 4 minutos por lado.
Sumás todo al bowl. Mezclás el yogur con la mostaza antigua, sal y pimienta, y aderezás al servir. Mezclás suave y servís.'),
  ('ensalada-de-espinaca-con-tofu-dorado-brotes-de-soja-y', 'Ensalada de espinaca con tofu dorado, brotes de soja y parmesano', 18, 1, '{almuerzo,cena}', true, 'Lavás y secás bien las hojas de espinaca y las ponés en un bowl grande.
Preparás los brotes de soja y el parmesano en lascas con el pelapapas.
Cortás el tofu en cubos y los dorás en una sartén con una gota de aceite, 4 minutos por lado.
Sumás todo al bowl. Batís la mostaza con la miel, el aceite de oliva, el vinagre de manzana y una pizca de sal; aderezás al servir. Servís enseguida.'),
  ('ensalada-de-lechuga-con-mejillones-tomate-y-morron', 'Ensalada de lechuga con mejillones, tomate y morrón', 10, 1, '{almuerzo,cena}', true, 'Lavás y secás bien la lechuga, la cortás con la mano y la ponés en un bowl grande.
Preparás el tomate en gajos y el morrón en tiras.
Escurrís los mejillones y los sumás enteros.
Sumás todo al bowl. Mezclás el yogur con la mostaza antigua, sal y pimienta, y aderezás al servir. Se puede llevar con el aderezo aparte.'),
  ('ensalada-de-hojas-verdes-con-pavo-grillado-palta-y', 'Ensalada de hojas verdes con pavo grillado, palta y brotes de soja', 23, 1, '{almuerzo,cena}', true, 'Lavás y secás las hojas verdes y las ponés en un bowl grande.
Preparás la palta en cubos y los brotes de soja.
Salpimentás la pechuga de pavo y la cocinás en plancha caliente 5 minutos por lado. La dejás reposar 3 minutos y la cortás en tiras.
Sumás todo al bowl. Aderezás con el aceto, el aceite de oliva, sal y pimienta. Se puede llevar con el aderezo aparte.'),
  ('ensalada-de-escarola-con-lentejas-arvejas-y-tomate', 'Ensalada de escarola con lentejas, arvejas y tomate', 11, 1, '{almuerzo,cena}', true, 'Lavás y secás la escarola y la cortás en trozos.
Preparás las arvejas hervidas 3 minutos y el tomate en gajos.
Enjuagás las lentejas y las escurrís bien.
Sumás todo al bowl. Aderezás con el aceto, el aceite de oliva, sal y pimienta. Servís enseguida.'),
  ('wok-de-langostinos-con-salsa-de-mani-con-mix-de', 'Wok de langostinos con salsa de maní con mix de verduras sobre quinoa', 30, 1, '{almuerzo,cena}', true, 'Enjuagás la quinoa, la hervís 12 minutos en el doble de agua con sal y la dejás tapada 5 minutos.
Preparás las verduras: el mix ya viene listo. Picás el ajo.
Pelás los langostinos, los secás bien y los salteás en el wok bien caliente con la mitad del aceite, 1–2 minutos por lado. Los retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Mezclás la pasta de maní con la soja, el jugo de limón y 3 cucharadas de agua tibia hasta que quede lisa. La volcás sobre las verduras, devolvés los langostinos al wok y mezclás 1 minuto.
Servís sobre quinoa con semillas de sésamo por arriba.'),
  ('salteado-de-cuadril-agridulce-con-brocoli-y-morron', 'Salteado de cuadril agridulce con brócoli y morrón sobre arroz basmati', 32, 1, '{almuerzo,cena}', true, 'Lavás el arroz basmati hasta que el agua salga clara, lo hervís 10 minutos y lo escurrís.
Preparás las verduras: el brócoli en arbolitos chicos y el morrón en tiras. Picás el ajo.
Cortás el cuadril en tiras finas a contrapelo y las sellás en el wok humeante con la mitad del aceite, 2–3 minutos. Las retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Mezclás el ketchup con la soja, el vinagre, el azúcar y 3 cucharadas de agua. La volcás sobre las verduras, devolvés el cuadril al wok y mezclás 1 minuto.
Servís sobre arroz basmati con semillas de sésamo por arriba.'),
  ('wok-de-pavo-con-miel-y-soja-con-coliflor-y-zanahoria', 'Wok de pavo con miel y soja con coliflor y zanahoria sobre arroz', 32, 1, '{almuerzo,cena}', true, 'Hervís el arroz en abundante agua con sal, 12 minutos, y lo escurrís.
Preparás las verduras: la coliflor en arbolitos chicos, la zanahoria en rodajas finas y la cebolla en plumas. Picás el ajo.
Cortás la pechuga de pavo en tiras finas, las salpimentás y las sellás en el wok bien caliente con la mitad del aceite, 4 minutos. Las retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Mezclás la salsa de soja con la miel y 2 cucharadas de agua. La volcás sobre las verduras, devolvés el pavo al wok y mezclás 1 minuto.
Servís sobre arroz con semillas de sésamo por arriba.'),
  ('wok-de-pavo-al-teriyaki-con-champinones-espinaca-y', 'Wok de pavo al teriyaki con champiñones, espinaca y cebolla', 22, 1, '{almuerzo,cena}', true, 'Preparás las verduras: los champiñones en láminas, la cebolla en plumas y la espinaca lavada. Picás el ajo.
Cortás la pechuga de pavo en tiras finas, las salpimentás y las sellás en el wok bien caliente con la mitad del aceite, 4 minutos. Las retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Diluís el teriyaki con 2 cucharadas de agua. La volcás sobre las verduras, devolvés el pavo al wok y mezclás 1 minuto.
Servís con semillas de sésamo por arriba.'),
  ('salteado-de-pollo-picante-con-kale-y-champinones-sobre', 'Salteado de pollo picante con kale y champiñones sobre cuscús', 29, 1, '{almuerzo,cena}', true, 'Cubrís el cuscús con la misma cantidad de agua caliente y sal, tapás 5 minutos y lo desgranás con un tenedor.
Preparás las verduras: el kale sin los tallos y cortado fino, los champiñones en láminas y la cebolla en plumas. Picás el ajo.
Cortás la pechuga en tiras finas, las salpimentás y las sellás en el wok bien caliente con la mitad del aceite, 4–5 minutos, hasta que estén doradas. Las retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Mezclás la soja con la salsa picante, la miel y 2 cucharadas de agua. La volcás sobre las verduras, devolvés el pollo al wok y mezclás 1 minuto.
Servís sobre cuscús con semillas de sésamo por arriba.'),
  ('wok-de-tofu-con-miso-con-repollo-zanahoria-y-brotes-de', 'Wok de tofu con miso con repollo, zanahoria y brotes de soja sobre fideos', 34, 1, '{almuerzo,cena}', true, 'Hervís los fideos al dente, los escurrís y los pasás por un chorrito de aceite para que no se peguen.
Preparás las verduras: el repollo en tiras finas y la zanahoria en bastones; los brotes de soja van enteros. Picás el ajo.
Cortás el tofu en cubos, lo secás con papel y lo dorás en el wok caliente con la mitad del aceite, 3–4 minutos, moviéndolo poco. Lo retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Disolvés la pasta de miso en 4 cucharadas de agua caliente con el vinagre. La volcás sobre las verduras, devolvés el tofu al wok y mezclás 1 minuto.
Servís sobre fideos con semillas de sésamo por arriba.'),
  ('wok-de-salmon-con-miso-con-repollo-colorado-zanahoria-y', 'Wok de salmón con miso con repollo colorado, zanahoria y apio sobre fideos', 32, 1, '{almuerzo,cena}', true, 'Hervís los fideos al dente, los escurrís y los pasás por un chorrito de aceite para que no se peguen.
Preparás las verduras: el repollo colorado en tiras finas, la zanahoria en bastones y el apio en rodajitas. Picás el ajo.
Cortás el salmón en cubos, los salpimentás y los dorás en el wok caliente con la mitad del aceite, 1 minuto por lado. Los retirás con cuidado para que no se rompan.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Disolvés la pasta de miso en 4 cucharadas de agua caliente con el vinagre. La volcás sobre las verduras, devolvés el salmón al wok y mezclás 1 minuto.
Servís sobre fideos con semillas de sésamo por arriba.'),
  ('wok-de-salmon-al-teriyaki-con-coliflor-y-zanahoria', 'Wok de salmón al teriyaki con coliflor y zanahoria sobre fideos', 32, 1, '{almuerzo,cena}', true, 'Hervís los fideos al dente, los escurrís y los pasás por un chorrito de aceite para que no se peguen.
Preparás las verduras: la coliflor en arbolitos chicos, la zanahoria en rodajas finas y la cebolla en plumas. Picás el ajo.
Cortás el salmón en cubos, los salpimentás y los dorás en el wok caliente con la mitad del aceite, 1 minuto por lado. Los retirás con cuidado para que no se rompan.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Diluís el teriyaki con 2 cucharadas de agua. La volcás sobre las verduras, devolvés el salmón al wok y mezclás 1 minuto.
Servís sobre fideos con semillas de sésamo por arriba.'),
  ('wok-de-cerdo-con-miso-con-kale-y-champinones-sobre', 'Wok de cerdo con miso con kale y champiñones sobre fideos', 32, 1, '{almuerzo,cena}', true, 'Hervís los fideos al dente, los escurrís y los pasás por un chorrito de aceite para que no se peguen.
Preparás las verduras: el kale sin los tallos y cortado fino, los champiñones en láminas y la cebolla en plumas. Picás el ajo.
Cortás el solomillo de cerdo en tiras finas, las salpimentás y las sellás en el wok bien caliente con la mitad del aceite, 4 minutos. Las retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Disolvés la pasta de miso en 4 cucharadas de agua caliente con el vinagre. La volcás sobre las verduras, devolvés el cerdo al wok y mezclás 1 minuto.
Servís sobre fideos con semillas de sésamo por arriba.'),
  ('salteado-de-pavo-al-limon-con-coliflor-y-zanahoria', 'Salteado de pavo al limón con coliflor y zanahoria sobre fideos de arroz', 30, 1, '{almuerzo,cena}', true, 'Hidratás los fideos de arroz en agua recién hervida, 6 minutos, y los escurrís.
Preparás las verduras: la coliflor en arbolitos chicos, la zanahoria en rodajas finas y la cebolla en plumas. Picás el ajo.
Cortás la pechuga de pavo en tiras finas, las salpimentás y las sellás en el wok bien caliente con la mitad del aceite, 4 minutos. Las retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Mezclás la soja con el jugo de limón, la miel y 2 cucharadas de agua. La volcás sobre las verduras, devolvés el pavo al wok y mezclás 1 minuto.
Servís sobre fideos de arroz con semillas de sésamo por arriba.'),
  ('wok-de-salmon-al-teriyaki-con-chauchas-zanahoria-y', 'Wok de salmón al teriyaki con chauchas, zanahoria y repollo sobre arroz', 32, 1, '{almuerzo,cena}', true, 'Hervís el arroz en abundante agua con sal, 12 minutos, y lo escurrís.
Preparás las verduras: las chauchas en trozos, la zanahoria en bastones y el repollo en tiras finas. Picás el ajo.
Cortás el salmón en cubos, los salpimentás y los dorás en el wok caliente con la mitad del aceite, 1 minuto por lado. Los retirás con cuidado para que no se rompan.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Diluís el teriyaki con 2 cucharadas de agua. La volcás sobre las verduras, devolvés el salmón al wok y mezclás 1 minuto.
Servís sobre arroz con semillas de sésamo por arriba.'),
  ('wok-de-cuadril-agridulce-con-zanahoria-arvejas-y-choclo', 'Wok de cuadril agridulce con zanahoria, arvejas y choclo sobre quinoa', 32, 1, '{almuerzo,cena}', true, 'Enjuagás la quinoa, la hervís 12 minutos en el doble de agua con sal y la dejás tapada 5 minutos.
Preparás las verduras: la zanahoria en cubitos; las arvejas y el choclo van enteros. Picás el ajo.
Cortás el cuadril en tiras finas a contrapelo y las sellás en el wok humeante con la mitad del aceite, 2–3 minutos. Las retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Mezclás el ketchup con la soja, el vinagre, el azúcar y 3 cucharadas de agua. La volcás sobre las verduras, devolvés el cuadril al wok y mezclás 1 minuto.
Servís sobre quinoa con semillas de sésamo por arriba.'),
  ('wok-de-pollo-picante-con-berenjena-morron-y-cebolla', 'Wok de pollo picante con berenjena, morrón y cebolla morada sobre fideos', 32, 1, '{almuerzo,cena}', true, 'Hervís los fideos al dente, los escurrís y los pasás por un chorrito de aceite para que no se peguen.
Preparás las verduras: la berenjena en cubos, el morrón en tiras y la cebolla morada en plumas. Picás el ajo.
Cortás la pechuga en tiras finas, las salpimentás y las sellás en el wok bien caliente con la mitad del aceite, 4–5 minutos, hasta que estén doradas. Las retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Mezclás la soja con la salsa picante, la miel y 2 cucharadas de agua. La volcás sobre las verduras, devolvés el pollo al wok y mezclás 1 minuto.
Servís sobre fideos con semillas de sésamo por arriba.'),
  ('salteado-de-cuadril-con-miel-y-soja-con-brocoli-y', 'Salteado de cuadril con miel y soja con brócoli y morrón sobre arroz', 32, 1, '{almuerzo,cena}', true, 'Hervís el arroz en abundante agua con sal, 12 minutos, y lo escurrís.
Preparás las verduras: el brócoli en arbolitos chicos y el morrón en tiras. Picás el ajo.
Cortás el cuadril en tiras finas a contrapelo y las sellás en el wok humeante con la mitad del aceite, 2–3 minutos. Las retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Mezclás la salsa de soja con la miel y 2 cucharadas de agua. La volcás sobre las verduras, devolvés el cuadril al wok y mezclás 1 minuto.
Servís sobre arroz con semillas de sésamo por arriba.'),
  ('wok-de-tempeh-a-la-soja-y-jengibre-con-mix-de-verduras', 'Wok de tempeh a la soja y jengibre con mix de verduras sobre quinoa', 32, 1, '{almuerzo,cena}', true, 'Enjuagás la quinoa, la hervís 12 minutos en el doble de agua con sal y la dejás tapada 5 minutos.
Preparás las verduras: el mix ya viene listo. Picás el ajo.
Cortás el tempeh en tiras finas y las dorás en el wok caliente con la mitad del aceite, 3 minutos por lado. Las retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Mezclás la salsa de soja con el jengibre rallado y 2 cucharadas de agua. La volcás sobre las verduras, devolvés el tempeh al wok y mezclás 1 minuto.
Servís sobre quinoa con semillas de sésamo por arriba.'),
  ('salteado-de-tofu-agridulce-con-chauchas-zanahoria-y', 'Salteado de tofu agridulce con chauchas, zanahoria y repollo sobre cuscús', 31, 1, '{almuerzo,cena}', true, 'Cubrís el cuscús con la misma cantidad de agua caliente y sal, tapás 5 minutos y lo desgranás con un tenedor.
Preparás las verduras: las chauchas en trozos, la zanahoria en bastones y el repollo en tiras finas. Picás el ajo.
Cortás el tofu en cubos, lo secás con papel y lo dorás en el wok caliente con la mitad del aceite, 3–4 minutos, moviéndolo poco. Lo retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Mezclás el ketchup con la soja, el vinagre, el azúcar y 3 cucharadas de agua. La volcás sobre las verduras, devolvés el tofu al wok y mezclás 1 minuto.
Servís sobre cuscús con semillas de sésamo por arriba.'),
  ('wok-de-carne-picante-con-brocoli-y-morron-sobre-cuscus', 'Wok de carne picante con brócoli y morrón sobre cuscús', 29, 1, '{almuerzo,cena}', true, 'Cubrís el cuscús con la misma cantidad de agua caliente y sal, tapás 5 minutos y lo desgranás con un tenedor.
Preparás las verduras: el brócoli en arbolitos chicos y el morrón en tiras. Picás el ajo.
Cortás la nalga en tiras finas a contrapelo y las sellás en el wok humeante con la mitad del aceite, 2–3 minutos, sin amontonarlas. Las retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Mezclás la soja con la salsa picante, la miel y 2 cucharadas de agua. La volcás sobre las verduras, devolvés la carne al wok y mezclás 1 minuto.
Servís sobre cuscús con semillas de sésamo por arriba.'),
  ('salteado-de-pollo-agridulce-con-mix-de-verduras-sobre', 'Salteado de pollo agridulce con mix de verduras sobre arroz', 32, 1, '{almuerzo,cena}', true, 'Hervís el arroz en abundante agua con sal, 12 minutos, y lo escurrís.
Preparás las verduras: el mix ya viene listo. Picás el ajo.
Cortás la pechuga en tiras finas, las salpimentás y las sellás en el wok bien caliente con la mitad del aceite, 4–5 minutos, hasta que estén doradas. Las retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Mezclás el ketchup con la soja, el vinagre, el azúcar y 3 cucharadas de agua. La volcás sobre las verduras, devolvés el pollo al wok y mezclás 1 minuto.
Servís sobre arroz con semillas de sésamo por arriba.'),
  ('wok-de-cerdo-con-miso-con-repollo-zanahoria-y-brotes-de', 'Wok de cerdo con miso con repollo, zanahoria y brotes de soja sobre arroz', 32, 1, '{almuerzo,cena}', true, 'Hervís el arroz en abundante agua con sal, 12 minutos, y lo escurrís.
Preparás las verduras: el repollo en tiras finas y la zanahoria en bastones; los brotes de soja van enteros. Picás el ajo.
Cortás el solomillo de cerdo en tiras finas, las salpimentás y las sellás en el wok bien caliente con la mitad del aceite, 4 minutos. Las retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Disolvés la pasta de miso en 4 cucharadas de agua caliente con el vinagre. La volcás sobre las verduras, devolvés el cerdo al wok y mezclás 1 minuto.
Servís sobre arroz con semillas de sésamo por arriba.'),
  ('salteado-de-pollo-al-teriyaki-con-kale-y-champinones', 'Salteado de pollo al teriyaki con kale y champiñones', 22, 1, '{almuerzo,cena}', true, 'Preparás las verduras: el kale sin los tallos y cortado fino, los champiñones en láminas y la cebolla en plumas. Picás el ajo.
Cortás la pechuga en tiras finas, las salpimentás y las sellás en el wok bien caliente con la mitad del aceite, 4–5 minutos, hasta que estén doradas. Las retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Diluís el teriyaki con 2 cucharadas de agua. La volcás sobre las verduras, devolvés el pollo al wok y mezclás 1 minuto.
Servís con semillas de sésamo por arriba.'),
  ('wok-de-tempeh-a-la-soja-y-jengibre-con-brocoli-y-morron', 'Wok de tempeh a la soja y jengibre con brócoli y morrón sobre arroz', 32, 1, '{almuerzo,cena}', true, 'Hervís el arroz en abundante agua con sal, 12 minutos, y lo escurrís.
Preparás las verduras: el brócoli en arbolitos chicos y el morrón en tiras. Picás el ajo.
Cortás el tempeh en tiras finas y las dorás en el wok caliente con la mitad del aceite, 3 minutos por lado. Las retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Mezclás la salsa de soja con el jengibre rallado y 2 cucharadas de agua. La volcás sobre las verduras, devolvés el tempeh al wok y mezclás 1 minuto.
Servís sobre arroz con semillas de sésamo por arriba.'),
  ('wok-de-langostinos-agridulce-con-mix-de-verduras-sobre', 'Wok de langostinos agridulce con mix de verduras sobre arroz integral', 30, 1, '{almuerzo,cena}', true, 'Hervís el arroz integral en abundante agua con sal, 30 minutos, y lo escurrís.
Preparás las verduras: el mix ya viene listo. Picás el ajo.
Pelás los langostinos, los secás bien y los salteás en el wok bien caliente con la mitad del aceite, 1–2 minutos por lado. Los retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Mezclás el ketchup con la soja, el vinagre, el azúcar y 3 cucharadas de agua. La volcás sobre las verduras, devolvés los langostinos al wok y mezclás 1 minuto.
Servís sobre arroz integral con semillas de sésamo por arriba.'),
  ('wok-de-carne-al-teriyaki-con-chauchas-zanahoria-y', 'Wok de carne al teriyaki con chauchas, zanahoria y repollo sobre cuscús', 29, 1, '{almuerzo,cena}', true, 'Cubrís el cuscús con la misma cantidad de agua caliente y sal, tapás 5 minutos y lo desgranás con un tenedor.
Preparás las verduras: las chauchas en trozos, la zanahoria en bastones y el repollo en tiras finas. Picás el ajo.
Cortás la nalga en tiras finas a contrapelo y las sellás en el wok humeante con la mitad del aceite, 2–3 minutos, sin amontonarlas. Las retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Diluís el teriyaki con 2 cucharadas de agua. La volcás sobre las verduras, devolvés la carne al wok y mezclás 1 minuto.
Servís sobre cuscús con semillas de sésamo por arriba.'),
  ('wok-de-salmon-a-la-soja-y-jengibre-con-coliflor-y', 'Wok de salmón a la soja y jengibre con coliflor y zanahoria', 22, 1, '{almuerzo,cena}', true, 'Preparás las verduras: la coliflor en arbolitos chicos, la zanahoria en rodajas finas y la cebolla en plumas. Picás el ajo.
Cortás el salmón en cubos, los salpimentás y los dorás en el wok caliente con la mitad del aceite, 1 minuto por lado. Los retirás con cuidado para que no se rompan.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Mezclás la salsa de soja con el jengibre rallado y 2 cucharadas de agua. La volcás sobre las verduras, devolvés el salmón al wok y mezclás 1 minuto.
Servís con semillas de sésamo por arriba.'),
  ('wok-de-cerdo-picante-con-chauchas-zanahoria-y-repollo', 'Wok de cerdo picante con chauchas, zanahoria y repollo sobre fideos', 32, 1, '{almuerzo,cena}', true, 'Hervís los fideos al dente, los escurrís y los pasás por un chorrito de aceite para que no se peguen.
Preparás las verduras: las chauchas en trozos, la zanahoria en bastones y el repollo en tiras finas. Picás el ajo.
Cortás el solomillo de cerdo en tiras finas, las salpimentás y las sellás en el wok bien caliente con la mitad del aceite, 4 minutos. Las retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Mezclás la soja con la salsa picante, la miel y 2 cucharadas de agua. La volcás sobre las verduras, devolvés el cerdo al wok y mezclás 1 minuto.
Servís sobre fideos con semillas de sésamo por arriba.'),
  ('salteado-de-pollo-con-miso-con-mix-de-verduras-sobre', 'Salteado de pollo con miso con mix de verduras sobre fideos', 32, 1, '{almuerzo,cena}', true, 'Hervís los fideos al dente, los escurrís y los pasás por un chorrito de aceite para que no se peguen.
Preparás las verduras: el mix ya viene listo. Picás el ajo.
Cortás la pechuga en tiras finas, las salpimentás y las sellás en el wok bien caliente con la mitad del aceite, 4–5 minutos, hasta que estén doradas. Las retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Disolvés la pasta de miso en 4 cucharadas de agua caliente con el vinagre. La volcás sobre las verduras, devolvés el pollo al wok y mezclás 1 minuto.
Servís sobre fideos con semillas de sésamo por arriba.'),
  ('wok-de-calamar-picante-con-brocoli-y-morron-sobre-arroz', 'Wok de calamar picante con brócoli y morrón sobre arroz', 30, 1, '{almuerzo,cena}', true, 'Hervís el arroz en abundante agua con sal, 12 minutos, y lo escurrís.
Preparás las verduras: el brócoli en arbolitos chicos y el morrón en tiras. Picás el ajo.
Cortás el calamar en anillos, los secás bien y los salteás en el wok humeante con la mitad del aceite, 1–2 minutos (más tiempo los endurece). Los retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Mezclás la soja con la salsa picante, la miel y 2 cucharadas de agua. La volcás sobre las verduras, devolvés el calamar al wok y mezclás 1 minuto.
Servís sobre arroz con semillas de sésamo por arriba.'),
  ('wok-de-tofu-con-miel-y-soja-con-zapallito-morron-y', 'Wok de tofu con miel y soja con zapallito, morrón y cebolla sobre arroz', 34, 1, '{almuerzo,cena}', true, 'Hervís el arroz en abundante agua con sal, 12 minutos, y lo escurrís.
Preparás las verduras: el zapallito en medias lunas, el morrón en tiras y la cebolla en plumas. Picás el ajo.
Cortás el tofu en cubos, lo secás con papel y lo dorás en el wok caliente con la mitad del aceite, 3–4 minutos, moviéndolo poco. Lo retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Mezclás la salsa de soja con la miel y 2 cucharadas de agua. La volcás sobre las verduras, devolvés el tofu al wok y mezclás 1 minuto.
Servís sobre arroz con semillas de sésamo por arriba.'),
  ('wok-de-calamar-con-miso-con-brocoli-y-morron-sobre', 'Wok de calamar con miso con brócoli y morrón sobre fideos', 30, 1, '{almuerzo,cena}', true, 'Hervís los fideos al dente, los escurrís y los pasás por un chorrito de aceite para que no se peguen.
Preparás las verduras: el brócoli en arbolitos chicos y el morrón en tiras. Picás el ajo.
Cortás el calamar en anillos, los secás bien y los salteás en el wok humeante con la mitad del aceite, 1–2 minutos (más tiempo los endurece). Los retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Disolvés la pasta de miso en 4 cucharadas de agua caliente con el vinagre. La volcás sobre las verduras, devolvés el calamar al wok y mezclás 1 minuto.
Servís sobre fideos con semillas de sésamo por arriba.'),
  ('wok-de-carne-con-miel-y-soja-con-zapallito-morron-y', 'Wok de carne con miel y soja con zapallito, morrón y cebolla sobre arroz', 32, 1, '{almuerzo,cena}', true, 'Hervís el arroz en abundante agua con sal, 12 minutos, y lo escurrís.
Preparás las verduras: el zapallito en medias lunas, el morrón en tiras y la cebolla en plumas. Picás el ajo.
Cortás la nalga en tiras finas a contrapelo y las sellás en el wok humeante con la mitad del aceite, 2–3 minutos, sin amontonarlas. Las retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Mezclás la salsa de soja con la miel y 2 cucharadas de agua. La volcás sobre las verduras, devolvés la carne al wok y mezclás 1 minuto.
Servís sobre arroz con semillas de sésamo por arriba.'),
  ('wok-de-carne-con-salsa-de-mani-con-zanahoria-cebolla-y', 'Wok de carne con salsa de maní con zanahoria, cebolla y morrón', 22, 1, '{almuerzo,cena}', true, 'Preparás las verduras: la zanahoria en bastones finos, la cebolla en plumas y el morrón en tiras. Picás el ajo.
Cortás la nalga en tiras finas a contrapelo y las sellás en el wok humeante con la mitad del aceite, 2–3 minutos, sin amontonarlas. Las retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Mezclás la pasta de maní con la soja, el jugo de limón y 3 cucharadas de agua tibia hasta que quede lisa. La volcás sobre las verduras, devolvés la carne al wok y mezclás 1 minuto.
Servís con semillas de sésamo por arriba.'),
  ('wok-de-huevo-con-miso-con-brocoli-zanahoria-y-cebolla', 'Wok de huevo con miso con brócoli, zanahoria y cebolla de verdeo', 19, 1, '{almuerzo,cena}', true, 'Preparás las verduras: el brócoli en arbolitos, la zanahoria en rodajas finas y la cebolla de verdeo en trozos. Picás el ajo.
Batís los huevos con una pizca de sal. Los cocinás en el wok con la mitad del aceite, revolviendo, hasta que cuajen pero queden jugosos (1–2 minutos). Los retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Disolvés la pasta de miso en 4 cucharadas de agua caliente con el vinagre. La volcás sobre las verduras, devolvés el huevo al wok y mezclás 1 minuto.
Servís con semillas de sésamo por arriba.'),
  ('wok-de-cerdo-al-teriyaki-con-mix-de-verduras-sobre-arroz', 'Wok de cerdo al teriyaki con mix de verduras sobre arroz', 32, 1, '{almuerzo,cena}', true, 'Hervís el arroz en abundante agua con sal, 12 minutos, y lo escurrís.
Preparás las verduras: el mix ya viene listo. Picás el ajo.
Cortás el solomillo de cerdo en tiras finas, las salpimentás y las sellás en el wok bien caliente con la mitad del aceite, 4 minutos. Las retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Diluís el teriyaki con 2 cucharadas de agua. La volcás sobre las verduras, devolvés el cerdo al wok y mezclás 1 minuto.
Servís sobre arroz con semillas de sésamo por arriba.'),
  ('salteado-de-tofu-con-miso-con-mix-de-verduras-sobre', 'Salteado de tofu con miso con mix de verduras sobre fideos', 34, 1, '{almuerzo,cena}', true, 'Hervís los fideos al dente, los escurrís y los pasás por un chorrito de aceite para que no se peguen.
Preparás las verduras: el mix ya viene listo. Picás el ajo.
Cortás el tofu en cubos, lo secás con papel y lo dorás en el wok caliente con la mitad del aceite, 3–4 minutos, moviéndolo poco. Lo retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Disolvés la pasta de miso en 4 cucharadas de agua caliente con el vinagre. La volcás sobre las verduras, devolvés el tofu al wok y mezclás 1 minuto.
Servís sobre fideos con semillas de sésamo por arriba.'),
  ('wok-de-salmon-con-miel-y-soja-con-mix-de-verduras', 'Wok de salmón con miel y soja con mix de verduras', 22, 1, '{almuerzo,cena}', true, 'Preparás las verduras: el mix ya viene listo. Picás el ajo.
Cortás el salmón en cubos, los salpimentás y los dorás en el wok caliente con la mitad del aceite, 1 minuto por lado. Los retirás con cuidado para que no se rompan.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Mezclás la salsa de soja con la miel y 2 cucharadas de agua. La volcás sobre las verduras, devolvés el salmón al wok y mezclás 1 minuto.
Servís con semillas de sésamo por arriba.'),
  ('salteado-de-tempeh-al-teriyaki-con-brocoli-y-morron', 'Salteado de tempeh al teriyaki con brócoli y morrón sobre fideos de arroz', 30, 1, '{almuerzo,cena}', true, 'Hidratás los fideos de arroz en agua recién hervida, 6 minutos, y los escurrís.
Preparás las verduras: el brócoli en arbolitos chicos y el morrón en tiras. Picás el ajo.
Cortás el tempeh en tiras finas y las dorás en el wok caliente con la mitad del aceite, 3 minutos por lado. Las retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Diluís el teriyaki con 2 cucharadas de agua. La volcás sobre las verduras, devolvés el tempeh al wok y mezclás 1 minuto.
Servís sobre fideos de arroz con semillas de sésamo por arriba.'),
  ('wok-de-cuadril-picante-con-esparragos-y-zanahoria-sobre', 'Wok de cuadril picante con espárragos y zanahoria sobre cuscús', 29, 1, '{almuerzo,cena}', true, 'Cubrís el cuscús con la misma cantidad de agua caliente y sal, tapás 5 minutos y lo desgranás con un tenedor.
Preparás las verduras: los espárragos en trozos de 4 cm, la zanahoria en bastones finos y la cebolla de verdeo en rodajas. Picás el ajo.
Cortás el cuadril en tiras finas a contrapelo y las sellás en el wok humeante con la mitad del aceite, 2–3 minutos. Las retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Mezclás la soja con la salsa picante, la miel y 2 cucharadas de agua. La volcás sobre las verduras, devolvés el cuadril al wok y mezclás 1 minuto.
Servís sobre cuscús con semillas de sésamo por arriba.'),
  ('wok-de-tofu-picante-con-brocoli-y-morron-sobre-quinoa', 'Wok de tofu picante con brócoli y morrón sobre quinoa', 34, 1, '{almuerzo,cena}', true, 'Enjuagás la quinoa, la hervís 12 minutos en el doble de agua con sal y la dejás tapada 5 minutos.
Preparás las verduras: el brócoli en arbolitos chicos y el morrón en tiras. Picás el ajo.
Cortás el tofu en cubos, lo secás con papel y lo dorás en el wok caliente con la mitad del aceite, 3–4 minutos, moviéndolo poco. Lo retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Mezclás la soja con la salsa picante, la miel y 2 cucharadas de agua. La volcás sobre las verduras, devolvés el tofu al wok y mezclás 1 minuto.
Servís sobre quinoa con semillas de sésamo por arriba.'),
  ('wok-de-tempeh-agridulce-con-zapallito-morron-y-cebolla', 'Wok de tempeh agridulce con zapallito, morrón y cebolla sobre fideos', 32, 1, '{almuerzo,cena}', true, 'Hervís los fideos al dente, los escurrís y los pasás por un chorrito de aceite para que no se peguen.
Preparás las verduras: el zapallito en medias lunas, el morrón en tiras y la cebolla en plumas. Picás el ajo.
Cortás el tempeh en tiras finas y las dorás en el wok caliente con la mitad del aceite, 3 minutos por lado. Las retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Mezclás el ketchup con la soja, el vinagre, el azúcar y 3 cucharadas de agua. La volcás sobre las verduras, devolvés el tempeh al wok y mezclás 1 minuto.
Servís sobre fideos con semillas de sésamo por arriba.'),
  ('wok-de-tempeh-agridulce-con-esparragos-y-zanahoria', 'Wok de tempeh agridulce con espárragos y zanahoria sobre arroz', 32, 1, '{almuerzo,cena}', true, 'Hervís el arroz en abundante agua con sal, 12 minutos, y lo escurrís.
Preparás las verduras: los espárragos en trozos de 4 cm, la zanahoria en bastones finos y la cebolla de verdeo en rodajas. Picás el ajo.
Cortás el tempeh en tiras finas y las dorás en el wok caliente con la mitad del aceite, 3 minutos por lado. Las retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Mezclás el ketchup con la soja, el vinagre, el azúcar y 3 cucharadas de agua. La volcás sobre las verduras, devolvés el tempeh al wok y mezclás 1 minuto.
Servís sobre arroz con semillas de sésamo por arriba.'),
  ('wok-de-cuadril-al-teriyaki-con-zanahoria-arvejas-y', 'Wok de cuadril al teriyaki con zanahoria, arvejas y choclo sobre arroz', 32, 1, '{almuerzo,cena}', true, 'Hervís el arroz en abundante agua con sal, 12 minutos, y lo escurrís.
Preparás las verduras: la zanahoria en cubitos; las arvejas y el choclo van enteros. Picás el ajo.
Cortás el cuadril en tiras finas a contrapelo y las sellás en el wok humeante con la mitad del aceite, 2–3 minutos. Las retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Diluís el teriyaki con 2 cucharadas de agua. La volcás sobre las verduras, devolvés el cuadril al wok y mezclás 1 minuto.
Servís sobre arroz con semillas de sésamo por arriba.'),
  ('wok-de-cuadril-al-teriyaki-con-coliflor-y-zanahoria', 'Wok de cuadril al teriyaki con coliflor y zanahoria sobre fideos', 32, 1, '{almuerzo,cena}', true, 'Hervís los fideos al dente, los escurrís y los pasás por un chorrito de aceite para que no se peguen.
Preparás las verduras: la coliflor en arbolitos chicos, la zanahoria en rodajas finas y la cebolla en plumas. Picás el ajo.
Cortás el cuadril en tiras finas a contrapelo y las sellás en el wok humeante con la mitad del aceite, 2–3 minutos. Las retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Diluís el teriyaki con 2 cucharadas de agua. La volcás sobre las verduras, devolvés el cuadril al wok y mezclás 1 minuto.
Servís sobre fideos con semillas de sésamo por arriba.'),
  ('salteado-de-tempeh-con-miso-con-zanahoria-arvejas-y', 'Salteado de tempeh con miso con zanahoria, arvejas y choclo sobre quinoa', 32, 1, '{almuerzo,cena}', true, 'Enjuagás la quinoa, la hervís 12 minutos en el doble de agua con sal y la dejás tapada 5 minutos.
Preparás las verduras: la zanahoria en cubitos; las arvejas y el choclo van enteros. Picás el ajo.
Cortás el tempeh en tiras finas y las dorás en el wok caliente con la mitad del aceite, 3 minutos por lado. Las retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Disolvés la pasta de miso en 4 cucharadas de agua caliente con el vinagre. La volcás sobre las verduras, devolvés el tempeh al wok y mezclás 1 minuto.
Servís sobre quinoa con semillas de sésamo por arriba.'),
  ('wok-de-pollo-con-miso-con-mix-de-verduras-sobre-fideos', 'Wok de pollo con miso con mix de verduras sobre fideos de arroz', 30, 1, '{almuerzo,cena}', true, 'Hidratás los fideos de arroz en agua recién hervida, 6 minutos, y los escurrís.
Preparás las verduras: el mix ya viene listo. Picás el ajo.
Cortás la pechuga en tiras finas, las salpimentás y las sellás en el wok bien caliente con la mitad del aceite, 4–5 minutos, hasta que estén doradas. Las retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Disolvés la pasta de miso en 4 cucharadas de agua caliente con el vinagre. La volcás sobre las verduras, devolvés el pollo al wok y mezclás 1 minuto.
Servís sobre fideos de arroz con semillas de sésamo por arriba.'),
  ('wok-de-tempeh-con-miel-y-soja-con-esparragos-y', 'Wok de tempeh con miel y soja con espárragos y zanahoria sobre quinoa', 32, 1, '{almuerzo,cena}', true, 'Enjuagás la quinoa, la hervís 12 minutos en el doble de agua con sal y la dejás tapada 5 minutos.
Preparás las verduras: los espárragos en trozos de 4 cm, la zanahoria en bastones finos y la cebolla de verdeo en rodajas. Picás el ajo.
Cortás el tempeh en tiras finas y las dorás en el wok caliente con la mitad del aceite, 3 minutos por lado. Las retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Mezclás la salsa de soja con la miel y 2 cucharadas de agua. La volcás sobre las verduras, devolvés el tempeh al wok y mezclás 1 minuto.
Servís sobre quinoa con semillas de sésamo por arriba.'),
  ('salteado-de-tofu-al-limon-con-berenjena-morron-y', 'Salteado de tofu al limón con berenjena, morrón y cebolla morada', 24, 1, '{almuerzo,cena}', true, 'Preparás las verduras: la berenjena en cubos, el morrón en tiras y la cebolla morada en plumas. Picás el ajo.
Cortás el tofu en cubos, lo secás con papel y lo dorás en el wok caliente con la mitad del aceite, 3–4 minutos, moviéndolo poco. Lo retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Mezclás la soja con el jugo de limón, la miel y 2 cucharadas de agua. La volcás sobre las verduras, devolvés el tofu al wok y mezclás 1 minuto.
Servís con semillas de sésamo por arriba.'),
  ('salteado-de-pollo-al-limon-con-kale-y-champinones-sobre', 'Salteado de pollo al limón con kale y champiñones sobre fideos de arroz', 30, 1, '{almuerzo,cena}', true, 'Hidratás los fideos de arroz en agua recién hervida, 6 minutos, y los escurrís.
Preparás las verduras: el kale sin los tallos y cortado fino, los champiñones en láminas y la cebolla en plumas. Picás el ajo.
Cortás la pechuga en tiras finas, las salpimentás y las sellás en el wok bien caliente con la mitad del aceite, 4–5 minutos, hasta que estén doradas. Las retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Mezclás la soja con el jugo de limón, la miel y 2 cucharadas de agua. La volcás sobre las verduras, devolvés el pollo al wok y mezclás 1 minuto.
Servís sobre fideos de arroz con semillas de sésamo por arriba.'),
  ('wok-de-cerdo-con-salsa-de-mani-con-kale-y-champinones', 'Wok de cerdo con salsa de maní con kale y champiñones', 22, 1, '{almuerzo,cena}', true, 'Preparás las verduras: el kale sin los tallos y cortado fino, los champiñones en láminas y la cebolla en plumas. Picás el ajo.
Cortás el solomillo de cerdo en tiras finas, las salpimentás y las sellás en el wok bien caliente con la mitad del aceite, 4 minutos. Las retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Mezclás la pasta de maní con la soja, el jugo de limón y 3 cucharadas de agua tibia hasta que quede lisa. La volcás sobre las verduras, devolvés el cerdo al wok y mezclás 1 minuto.
Servís con semillas de sésamo por arriba.'),
  ('salteado-de-carne-con-miel-y-soja-con-mix-de-verduras', 'Salteado de carne con miel y soja con mix de verduras sobre cuscús', 29, 1, '{almuerzo,cena}', true, 'Cubrís el cuscús con la misma cantidad de agua caliente y sal, tapás 5 minutos y lo desgranás con un tenedor.
Preparás las verduras: el mix ya viene listo. Picás el ajo.
Cortás la nalga en tiras finas a contrapelo y las sellás en el wok humeante con la mitad del aceite, 2–3 minutos, sin amontonarlas. Las retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Mezclás la salsa de soja con la miel y 2 cucharadas de agua. La volcás sobre las verduras, devolvés la carne al wok y mezclás 1 minuto.
Servís sobre cuscús con semillas de sésamo por arriba.'),
  ('wok-de-tempeh-con-miso-con-mix-de-verduras-sobre-arroz', 'Wok de tempeh con miso con mix de verduras sobre arroz integral', 32, 1, '{almuerzo,cena}', true, 'Hervís el arroz integral en abundante agua con sal, 30 minutos, y lo escurrís.
Preparás las verduras: el mix ya viene listo. Picás el ajo.
Cortás el tempeh en tiras finas y las dorás en el wok caliente con la mitad del aceite, 3 minutos por lado. Las retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Disolvés la pasta de miso en 4 cucharadas de agua caliente con el vinagre. La volcás sobre las verduras, devolvés el tempeh al wok y mezclás 1 minuto.
Servís sobre arroz integral con semillas de sésamo por arriba.'),
  ('wok-de-tofu-con-miso-con-repollo-colorado-zanahoria-y', 'Wok de tofu con miso con repollo colorado, zanahoria y apio sobre quinoa', 34, 1, '{almuerzo,cena}', true, 'Enjuagás la quinoa, la hervís 12 minutos en el doble de agua con sal y la dejás tapada 5 minutos.
Preparás las verduras: el repollo colorado en tiras finas, la zanahoria en bastones y el apio en rodajitas. Picás el ajo.
Cortás el tofu en cubos, lo secás con papel y lo dorás en el wok caliente con la mitad del aceite, 3–4 minutos, moviéndolo poco. Lo retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Disolvés la pasta de miso en 4 cucharadas de agua caliente con el vinagre. La volcás sobre las verduras, devolvés el tofu al wok y mezclás 1 minuto.
Servís sobre quinoa con semillas de sésamo por arriba.'),
  ('salteado-de-pavo-con-miso-con-esparragos-y-zanahoria', 'Salteado de pavo con miso con espárragos y zanahoria sobre fideos de arroz', 30, 1, '{almuerzo,cena}', true, 'Hidratás los fideos de arroz en agua recién hervida, 6 minutos, y los escurrís.
Preparás las verduras: los espárragos en trozos de 4 cm, la zanahoria en bastones finos y la cebolla de verdeo en rodajas. Picás el ajo.
Cortás la pechuga de pavo en tiras finas, las salpimentás y las sellás en el wok bien caliente con la mitad del aceite, 4 minutos. Las retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Disolvés la pasta de miso en 4 cucharadas de agua caliente con el vinagre. La volcás sobre las verduras, devolvés el pavo al wok y mezclás 1 minuto.
Servís sobre fideos de arroz con semillas de sésamo por arriba.'),
  ('wok-de-tempeh-al-limon-con-brocoli-zanahoria-y-cebolla', 'Wok de tempeh al limón con brócoli, zanahoria y cebolla de verdeo', 22, 1, '{almuerzo,cena}', true, 'Preparás las verduras: el brócoli en arbolitos, la zanahoria en rodajas finas y la cebolla de verdeo en trozos. Picás el ajo.
Cortás el tempeh en tiras finas y las dorás en el wok caliente con la mitad del aceite, 3 minutos por lado. Las retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Mezclás la soja con el jugo de limón, la miel y 2 cucharadas de agua. La volcás sobre las verduras, devolvés el tempeh al wok y mezclás 1 minuto.
Servís con semillas de sésamo por arriba.'),
  ('wok-de-calamar-con-miso-con-berenjena-morron-y-cebolla', 'Wok de calamar con miso con berenjena, morrón y cebolla morada sobre arroz', 30, 1, '{almuerzo,cena}', true, 'Hervís el arroz en abundante agua con sal, 12 minutos, y lo escurrís.
Preparás las verduras: la berenjena en cubos, el morrón en tiras y la cebolla morada en plumas. Picás el ajo.
Cortás el calamar en anillos, los secás bien y los salteás en el wok humeante con la mitad del aceite, 1–2 minutos (más tiempo los endurece). Los retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Disolvés la pasta de miso en 4 cucharadas de agua caliente con el vinagre. La volcás sobre las verduras, devolvés el calamar al wok y mezclás 1 minuto.
Servís sobre arroz con semillas de sésamo por arriba.'),
  ('wok-de-huevo-con-miso-con-zapallito-morron-y-cebolla', 'Wok de huevo con miso con zapallito, morrón y cebolla sobre fideos', 29, 1, '{almuerzo,cena}', true, 'Hervís los fideos al dente, los escurrís y los pasás por un chorrito de aceite para que no se peguen.
Preparás las verduras: el zapallito en medias lunas, el morrón en tiras y la cebolla en plumas. Picás el ajo.
Batís los huevos con una pizca de sal. Los cocinás en el wok con la mitad del aceite, revolviendo, hasta que cuajen pero queden jugosos (1–2 minutos). Los retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Disolvés la pasta de miso en 4 cucharadas de agua caliente con el vinagre. La volcás sobre las verduras, devolvés el huevo al wok y mezclás 1 minuto.
Servís sobre fideos con semillas de sésamo por arriba.'),
  ('wok-de-cerdo-con-miso-con-berenjena-morron-y-cebolla', 'Wok de cerdo con miso con berenjena, morrón y cebolla morada sobre fideos', 32, 1, '{almuerzo,cena}', true, 'Hervís los fideos al dente, los escurrís y los pasás por un chorrito de aceite para que no se peguen.
Preparás las verduras: la berenjena en cubos, el morrón en tiras y la cebolla morada en plumas. Picás el ajo.
Cortás el solomillo de cerdo en tiras finas, las salpimentás y las sellás en el wok bien caliente con la mitad del aceite, 4 minutos. Las retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Disolvés la pasta de miso en 4 cucharadas de agua caliente con el vinagre. La volcás sobre las verduras, devolvés el cerdo al wok y mezclás 1 minuto.
Servís sobre fideos con semillas de sésamo por arriba.'),
  ('salteado-de-huevo-picante-con-esparragos-y-zanahoria', 'Salteado de huevo picante con espárragos y zanahoria sobre fideos de arroz', 27, 1, '{almuerzo,cena}', true, 'Hidratás los fideos de arroz en agua recién hervida, 6 minutos, y los escurrís.
Preparás las verduras: los espárragos en trozos de 4 cm, la zanahoria en bastones finos y la cebolla de verdeo en rodajas. Picás el ajo.
Batís los huevos con una pizca de sal. Los cocinás en el wok con la mitad del aceite, revolviendo, hasta que cuajen pero queden jugosos (1–2 minutos). Los retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Mezclás la soja con la salsa picante, la miel y 2 cucharadas de agua. La volcás sobre las verduras, devolvés el huevo al wok y mezclás 1 minuto.
Servís sobre fideos de arroz con semillas de sésamo por arriba.'),
  ('wok-de-tofu-al-limon-con-zanahoria-cebolla-y-morron', 'Wok de tofu al limón con zanahoria, cebolla y morrón sobre fideos', 34, 1, '{almuerzo,cena}', true, 'Hervís los fideos al dente, los escurrís y los pasás por un chorrito de aceite para que no se peguen.
Preparás las verduras: la zanahoria en bastones finos, la cebolla en plumas y el morrón en tiras. Picás el ajo.
Cortás el tofu en cubos, lo secás con papel y lo dorás en el wok caliente con la mitad del aceite, 3–4 minutos, moviéndolo poco. Lo retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Mezclás la soja con el jugo de limón, la miel y 2 cucharadas de agua. La volcás sobre las verduras, devolvés el tofu al wok y mezclás 1 minuto.
Servís sobre fideos con semillas de sésamo por arriba.'),
  ('salteado-de-cuadril-agridulce-con-champinones-espinaca', 'Salteado de cuadril agridulce con champiñones, espinaca y cebolla', 22, 1, '{almuerzo,cena}', true, 'Preparás las verduras: los champiñones en láminas, la cebolla en plumas y la espinaca lavada. Picás el ajo.
Cortás el cuadril en tiras finas a contrapelo y las sellás en el wok humeante con la mitad del aceite, 2–3 minutos. Las retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Mezclás el ketchup con la soja, el vinagre, el azúcar y 3 cucharadas de agua. La volcás sobre las verduras, devolvés el cuadril al wok y mezclás 1 minuto.
Servís con semillas de sésamo por arriba.'),
  ('wok-de-cuadril-a-la-soja-y-jengibre-con-coliflor-y', 'Wok de cuadril a la soja y jengibre con coliflor y zanahoria sobre arroz', 32, 1, '{almuerzo,cena}', true, 'Hervís el arroz en abundante agua con sal, 12 minutos, y lo escurrís.
Preparás las verduras: la coliflor en arbolitos chicos, la zanahoria en rodajas finas y la cebolla en plumas. Picás el ajo.
Cortás el cuadril en tiras finas a contrapelo y las sellás en el wok humeante con la mitad del aceite, 2–3 minutos. Las retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Mezclás la salsa de soja con el jengibre rallado y 2 cucharadas de agua. La volcás sobre las verduras, devolvés el cuadril al wok y mezclás 1 minuto.
Servís sobre arroz con semillas de sésamo por arriba.'),
  ('wok-de-carne-a-la-soja-y-jengibre-con-mix-de-verduras', 'Wok de carne a la soja y jengibre con mix de verduras sobre arroz basmati', 32, 1, '{almuerzo,cena}', true, 'Lavás el arroz basmati hasta que el agua salga clara, lo hervís 10 minutos y lo escurrís.
Preparás las verduras: el mix ya viene listo. Picás el ajo.
Cortás la nalga en tiras finas a contrapelo y las sellás en el wok humeante con la mitad del aceite, 2–3 minutos, sin amontonarlas. Las retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Mezclás la salsa de soja con el jengibre rallado y 2 cucharadas de agua. La volcás sobre las verduras, devolvés la carne al wok y mezclás 1 minuto.
Servís sobre arroz basmati con semillas de sésamo por arriba.'),
  ('wok-de-cuadril-picante-con-mix-de-verduras-sobre-arroz', 'Wok de cuadril picante con mix de verduras sobre arroz', 32, 1, '{almuerzo,cena}', true, 'Hervís el arroz en abundante agua con sal, 12 minutos, y lo escurrís.
Preparás las verduras: el mix ya viene listo. Picás el ajo.
Cortás el cuadril en tiras finas a contrapelo y las sellás en el wok humeante con la mitad del aceite, 2–3 minutos. Las retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Mezclás la soja con la salsa picante, la miel y 2 cucharadas de agua. La volcás sobre las verduras, devolvés el cuadril al wok y mezclás 1 minuto.
Servís sobre arroz con semillas de sésamo por arriba.'),
  ('wok-de-tofu-con-miel-y-soja-con-brocoli-y-morron-sobre', 'Wok de tofu con miel y soja con brócoli y morrón sobre cuscús', 31, 1, '{almuerzo,cena}', true, 'Cubrís el cuscús con la misma cantidad de agua caliente y sal, tapás 5 minutos y lo desgranás con un tenedor.
Preparás las verduras: el brócoli en arbolitos chicos y el morrón en tiras. Picás el ajo.
Cortás el tofu en cubos, lo secás con papel y lo dorás en el wok caliente con la mitad del aceite, 3–4 minutos, moviéndolo poco. Lo retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Mezclás la salsa de soja con la miel y 2 cucharadas de agua. La volcás sobre las verduras, devolvés el tofu al wok y mezclás 1 minuto.
Servís sobre cuscús con semillas de sésamo por arriba.'),
  ('wok-de-tempeh-con-miso-con-coliflor-y-zanahoria-sobre', 'Wok de tempeh con miso con coliflor y zanahoria sobre fideos', 32, 1, '{almuerzo,cena}', true, 'Hervís los fideos al dente, los escurrís y los pasás por un chorrito de aceite para que no se peguen.
Preparás las verduras: la coliflor en arbolitos chicos, la zanahoria en rodajas finas y la cebolla en plumas. Picás el ajo.
Cortás el tempeh en tiras finas y las dorás en el wok caliente con la mitad del aceite, 3 minutos por lado. Las retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Disolvés la pasta de miso en 4 cucharadas de agua caliente con el vinagre. La volcás sobre las verduras, devolvés el tempeh al wok y mezclás 1 minuto.
Servís sobre fideos con semillas de sésamo por arriba.'),
  ('wok-de-langostinos-con-miel-y-soja-con-coliflor-y', 'Wok de langostinos con miel y soja con coliflor y zanahoria sobre fideos', 30, 1, '{almuerzo,cena}', true, 'Hervís los fideos al dente, los escurrís y los pasás por un chorrito de aceite para que no se peguen.
Preparás las verduras: la coliflor en arbolitos chicos, la zanahoria en rodajas finas y la cebolla en plumas. Picás el ajo.
Pelás los langostinos, los secás bien y los salteás en el wok bien caliente con la mitad del aceite, 1–2 minutos por lado. Los retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Mezclás la salsa de soja con la miel y 2 cucharadas de agua. La volcás sobre las verduras, devolvés los langostinos al wok y mezclás 1 minuto.
Servís sobre fideos con semillas de sésamo por arriba.'),
  ('salteado-de-cerdo-con-miso-con-mix-de-verduras-sobre', 'Salteado de cerdo con miso con mix de verduras sobre fideos', 32, 1, '{almuerzo,cena}', true, 'Hervís los fideos al dente, los escurrís y los pasás por un chorrito de aceite para que no se peguen.
Preparás las verduras: el mix ya viene listo. Picás el ajo.
Cortás el solomillo de cerdo en tiras finas, las salpimentás y las sellás en el wok bien caliente con la mitad del aceite, 4 minutos. Las retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Disolvés la pasta de miso en 4 cucharadas de agua caliente con el vinagre. La volcás sobre las verduras, devolvés el cerdo al wok y mezclás 1 minuto.
Servís sobre fideos con semillas de sésamo por arriba.'),
  ('wok-de-pollo-al-teriyaki-con-brocoli-y-morron', 'Wok de pollo al teriyaki con brócoli y morrón', 22, 1, '{almuerzo,cena}', true, 'Preparás las verduras: el brócoli en arbolitos chicos y el morrón en tiras. Picás el ajo.
Cortás la pechuga en tiras finas, las salpimentás y las sellás en el wok bien caliente con la mitad del aceite, 4–5 minutos, hasta que estén doradas. Las retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Diluís el teriyaki con 2 cucharadas de agua. La volcás sobre las verduras, devolvés el pollo al wok y mezclás 1 minuto.
Servís con semillas de sésamo por arriba.'),
  ('wok-de-tofu-picante-con-kale-y-champinones-sobre-fideos', 'Wok de tofu picante con kale y champiñones sobre fideos de arroz', 32, 1, '{almuerzo,cena}', true, 'Hidratás los fideos de arroz en agua recién hervida, 6 minutos, y los escurrís.
Preparás las verduras: el kale sin los tallos y cortado fino, los champiñones en láminas y la cebolla en plumas. Picás el ajo.
Cortás el tofu en cubos, lo secás con papel y lo dorás en el wok caliente con la mitad del aceite, 3–4 minutos, moviéndolo poco. Lo retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Mezclás la soja con la salsa picante, la miel y 2 cucharadas de agua. La volcás sobre las verduras, devolvés el tofu al wok y mezclás 1 minuto.
Servís sobre fideos de arroz con semillas de sésamo por arriba.'),
  ('salteado-de-tempeh-picante-con-coliflor-y-zanahoria', 'Salteado de tempeh picante con coliflor y zanahoria sobre quinoa', 32, 1, '{almuerzo,cena}', true, 'Enjuagás la quinoa, la hervís 12 minutos en el doble de agua con sal y la dejás tapada 5 minutos.
Preparás las verduras: la coliflor en arbolitos chicos, la zanahoria en rodajas finas y la cebolla en plumas. Picás el ajo.
Cortás el tempeh en tiras finas y las dorás en el wok caliente con la mitad del aceite, 3 minutos por lado. Las retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Mezclás la soja con la salsa picante, la miel y 2 cucharadas de agua. La volcás sobre las verduras, devolvés el tempeh al wok y mezclás 1 minuto.
Servís sobre quinoa con semillas de sésamo por arriba.'),
  ('wok-de-tofu-picante-con-zanahoria-arvejas-y-choclo', 'Wok de tofu picante con zanahoria, arvejas y choclo sobre arroz basmati', 34, 1, '{almuerzo,cena}', true, 'Lavás el arroz basmati hasta que el agua salga clara, lo hervís 10 minutos y lo escurrís.
Preparás las verduras: la zanahoria en cubitos; las arvejas y el choclo van enteros. Picás el ajo.
Cortás el tofu en cubos, lo secás con papel y lo dorás en el wok caliente con la mitad del aceite, 3–4 minutos, moviéndolo poco. Lo retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Mezclás la soja con la salsa picante, la miel y 2 cucharadas de agua. La volcás sobre las verduras, devolvés el tofu al wok y mezclás 1 minuto.
Servís sobre arroz basmati con semillas de sésamo por arriba.'),
  ('wok-de-carne-al-limon-con-champinones-espinaca-y', 'Wok de carne al limón con champiñones, espinaca y cebolla sobre arroz', 32, 1, '{almuerzo,cena}', true, 'Hervís el arroz en abundante agua con sal, 12 minutos, y lo escurrís.
Preparás las verduras: los champiñones en láminas, la cebolla en plumas y la espinaca lavada. Picás el ajo.
Cortás la nalga en tiras finas a contrapelo y las sellás en el wok humeante con la mitad del aceite, 2–3 minutos, sin amontonarlas. Las retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Mezclás la soja con el jugo de limón, la miel y 2 cucharadas de agua. La volcás sobre las verduras, devolvés la carne al wok y mezclás 1 minuto.
Servís sobre arroz con semillas de sésamo por arriba.'),
  ('salteado-de-tempeh-agridulce-con-brocoli-y-morron-sobre', 'Salteado de tempeh agridulce con brócoli y morrón sobre fideos', 32, 1, '{almuerzo,cena}', true, 'Hervís los fideos al dente, los escurrís y los pasás por un chorrito de aceite para que no se peguen.
Preparás las verduras: el brócoli en arbolitos chicos y el morrón en tiras. Picás el ajo.
Cortás el tempeh en tiras finas y las dorás en el wok caliente con la mitad del aceite, 3 minutos por lado. Las retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Mezclás el ketchup con la soja, el vinagre, el azúcar y 3 cucharadas de agua. La volcás sobre las verduras, devolvés el tempeh al wok y mezclás 1 minuto.
Servís sobre fideos con semillas de sésamo por arriba.'),
  ('wok-de-calamar-con-salsa-de-mani-con-coliflor-y', 'Wok de calamar con salsa de maní con coliflor y zanahoria sobre arroz', 30, 1, '{almuerzo,cena}', true, 'Hervís el arroz en abundante agua con sal, 12 minutos, y lo escurrís.
Preparás las verduras: la coliflor en arbolitos chicos, la zanahoria en rodajas finas y la cebolla en plumas. Picás el ajo.
Cortás el calamar en anillos, los secás bien y los salteás en el wok humeante con la mitad del aceite, 1–2 minutos (más tiempo los endurece). Los retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Mezclás la pasta de maní con la soja, el jugo de limón y 3 cucharadas de agua tibia hasta que quede lisa. La volcás sobre las verduras, devolvés el calamar al wok y mezclás 1 minuto.
Servís sobre arroz con semillas de sésamo por arriba.'),
  ('wok-de-pavo-al-limon-con-zanahoria-cebolla-y-morron', 'Wok de pavo al limón con zanahoria, cebolla y morrón sobre fideos', 32, 1, '{almuerzo,cena}', true, 'Hervís los fideos al dente, los escurrís y los pasás por un chorrito de aceite para que no se peguen.
Preparás las verduras: la zanahoria en bastones finos, la cebolla en plumas y el morrón en tiras. Picás el ajo.
Cortás la pechuga de pavo en tiras finas, las salpimentás y las sellás en el wok bien caliente con la mitad del aceite, 4 minutos. Las retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Mezclás la soja con el jugo de limón, la miel y 2 cucharadas de agua. La volcás sobre las verduras, devolvés el pavo al wok y mezclás 1 minuto.
Servís sobre fideos con semillas de sésamo por arriba.'),
  ('wok-de-langostinos-al-teriyaki-con-zanahoria-arvejas-y', 'Wok de langostinos al teriyaki con zanahoria, arvejas y choclo sobre arroz', 30, 1, '{almuerzo,cena}', true, 'Hervís el arroz en abundante agua con sal, 12 minutos, y lo escurrís.
Preparás las verduras: la zanahoria en cubitos; las arvejas y el choclo van enteros. Picás el ajo.
Pelás los langostinos, los secás bien y los salteás en el wok bien caliente con la mitad del aceite, 1–2 minutos por lado. Los retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Diluís el teriyaki con 2 cucharadas de agua. La volcás sobre las verduras, devolvés los langostinos al wok y mezclás 1 minuto.
Servís sobre arroz con semillas de sésamo por arriba.'),
  ('wok-de-calamar-picante-con-chauchas-zanahoria-y-repollo', 'Wok de calamar picante con chauchas, zanahoria y repollo sobre cuscús', 27, 1, '{almuerzo,cena}', true, 'Cubrís el cuscús con la misma cantidad de agua caliente y sal, tapás 5 minutos y lo desgranás con un tenedor.
Preparás las verduras: las chauchas en trozos, la zanahoria en bastones y el repollo en tiras finas. Picás el ajo.
Cortás el calamar en anillos, los secás bien y los salteás en el wok humeante con la mitad del aceite, 1–2 minutos (más tiempo los endurece). Los retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Mezclás la soja con la salsa picante, la miel y 2 cucharadas de agua. La volcás sobre las verduras, devolvés el calamar al wok y mezclás 1 minuto.
Servís sobre cuscús con semillas de sésamo por arriba.'),
  ('wok-de-tofu-al-teriyaki-con-brocoli-y-morron-sobre', 'Wok de tofu al teriyaki con brócoli y morrón sobre fideos', 34, 1, '{almuerzo,cena}', true, 'Hervís los fideos al dente, los escurrís y los pasás por un chorrito de aceite para que no se peguen.
Preparás las verduras: el brócoli en arbolitos chicos y el morrón en tiras. Picás el ajo.
Cortás el tofu en cubos, lo secás con papel y lo dorás en el wok caliente con la mitad del aceite, 3–4 minutos, moviéndolo poco. Lo retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Diluís el teriyaki con 2 cucharadas de agua. La volcás sobre las verduras, devolvés el tofu al wok y mezclás 1 minuto.
Servís sobre fideos con semillas de sésamo por arriba.'),
  ('wok-de-pavo-al-teriyaki-con-berenjena-morron-y-cebolla', 'Wok de pavo al teriyaki con berenjena, morrón y cebolla morada', 22, 1, '{almuerzo,cena}', true, 'Preparás las verduras: la berenjena en cubos, el morrón en tiras y la cebolla morada en plumas. Picás el ajo.
Cortás la pechuga de pavo en tiras finas, las salpimentás y las sellás en el wok bien caliente con la mitad del aceite, 4 minutos. Las retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Diluís el teriyaki con 2 cucharadas de agua. La volcás sobre las verduras, devolvés el pavo al wok y mezclás 1 minuto.
Servís con semillas de sésamo por arriba.'),
  ('salteado-de-tofu-con-miel-y-soja-con-zanahoria-cebolla', 'Salteado de tofu con miel y soja con zanahoria, cebolla y morrón', 24, 1, '{almuerzo,cena}', true, 'Preparás las verduras: la zanahoria en bastones finos, la cebolla en plumas y el morrón en tiras. Picás el ajo.
Cortás el tofu en cubos, lo secás con papel y lo dorás en el wok caliente con la mitad del aceite, 3–4 minutos, moviéndolo poco. Lo retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Mezclás la salsa de soja con la miel y 2 cucharadas de agua. La volcás sobre las verduras, devolvés el tofu al wok y mezclás 1 minuto.
Servís con semillas de sésamo por arriba.'),
  ('wok-de-huevo-con-salsa-de-mani-con-esparragos-y', 'Wok de huevo con salsa de maní con espárragos y zanahoria sobre arroz', 29, 1, '{almuerzo,cena}', true, 'Hervís el arroz en abundante agua con sal, 12 minutos, y lo escurrís.
Preparás las verduras: los espárragos en trozos de 4 cm, la zanahoria en bastones finos y la cebolla de verdeo en rodajas. Picás el ajo.
Batís los huevos con una pizca de sal. Los cocinás en el wok con la mitad del aceite, revolviendo, hasta que cuajen pero queden jugosos (1–2 minutos). Los retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Mezclás la pasta de maní con la soja, el jugo de limón y 3 cucharadas de agua tibia hasta que quede lisa. La volcás sobre las verduras, devolvés el huevo al wok y mezclás 1 minuto.
Servís sobre arroz con semillas de sésamo por arriba.'),
  ('wok-de-pollo-al-limon-con-esparragos-y-zanahoria-sobre', 'Wok de pollo al limón con espárragos y zanahoria sobre arroz', 32, 1, '{almuerzo,cena}', true, 'Hervís el arroz en abundante agua con sal, 12 minutos, y lo escurrís.
Preparás las verduras: los espárragos en trozos de 4 cm, la zanahoria en bastones finos y la cebolla de verdeo en rodajas. Picás el ajo.
Cortás la pechuga en tiras finas, las salpimentás y las sellás en el wok bien caliente con la mitad del aceite, 4–5 minutos, hasta que estén doradas. Las retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Mezclás la soja con el jugo de limón, la miel y 2 cucharadas de agua. La volcás sobre las verduras, devolvés el pollo al wok y mezclás 1 minuto.
Servís sobre arroz con semillas de sésamo por arriba.'),
  ('wok-de-cuadril-con-miso-con-repollo-zanahoria-y-brotes', 'Wok de cuadril con miso con repollo, zanahoria y brotes de soja', 22, 1, '{almuerzo,cena}', true, 'Preparás las verduras: el repollo en tiras finas y la zanahoria en bastones; los brotes de soja van enteros. Picás el ajo.
Cortás el cuadril en tiras finas a contrapelo y las sellás en el wok humeante con la mitad del aceite, 2–3 minutos. Las retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Disolvés la pasta de miso en 4 cucharadas de agua caliente con el vinagre. La volcás sobre las verduras, devolvés el cuadril al wok y mezclás 1 minuto.
Servís con semillas de sésamo por arriba.'),
  ('wok-de-carne-al-limon-con-repollo-colorado-zanahoria-y', 'Wok de carne al limón con repollo colorado, zanahoria y apio sobre cuscús', 29, 1, '{almuerzo,cena}', true, 'Cubrís el cuscús con la misma cantidad de agua caliente y sal, tapás 5 minutos y lo desgranás con un tenedor.
Preparás las verduras: el repollo colorado en tiras finas, la zanahoria en bastones y el apio en rodajitas. Picás el ajo.
Cortás la nalga en tiras finas a contrapelo y las sellás en el wok humeante con la mitad del aceite, 2–3 minutos, sin amontonarlas. Las retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Mezclás la soja con el jugo de limón, la miel y 2 cucharadas de agua. La volcás sobre las verduras, devolvés la carne al wok y mezclás 1 minuto.
Servís sobre cuscús con semillas de sésamo por arriba.'),
  ('wok-de-salmon-agridulce-con-chauchas-zanahoria-y', 'Wok de salmón agridulce con chauchas, zanahoria y repollo sobre fideos', 32, 1, '{almuerzo,cena}', true, 'Hervís los fideos al dente, los escurrís y los pasás por un chorrito de aceite para que no se peguen.
Preparás las verduras: las chauchas en trozos, la zanahoria en bastones y el repollo en tiras finas. Picás el ajo.
Cortás el salmón en cubos, los salpimentás y los dorás en el wok caliente con la mitad del aceite, 1 minuto por lado. Los retirás con cuidado para que no se rompan.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Mezclás el ketchup con la soja, el vinagre, el azúcar y 3 cucharadas de agua. La volcás sobre las verduras, devolvés el salmón al wok y mezclás 1 minuto.
Servís sobre fideos con semillas de sésamo por arriba.'),
  ('wok-de-pollo-con-salsa-de-mani-con-mix-de-verduras', 'Wok de pollo con salsa de maní con mix de verduras sobre arroz basmati', 32, 1, '{almuerzo,cena}', true, 'Lavás el arroz basmati hasta que el agua salga clara, lo hervís 10 minutos y lo escurrís.
Preparás las verduras: el mix ya viene listo. Picás el ajo.
Cortás la pechuga en tiras finas, las salpimentás y las sellás en el wok bien caliente con la mitad del aceite, 4–5 minutos, hasta que estén doradas. Las retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Mezclás la pasta de maní con la soja, el jugo de limón y 3 cucharadas de agua tibia hasta que quede lisa. La volcás sobre las verduras, devolvés el pollo al wok y mezclás 1 minuto.
Servís sobre arroz basmati con semillas de sésamo por arriba.'),
  ('wok-de-tofu-con-salsa-de-mani-con-coliflor-y-zanahoria', 'Wok de tofu con salsa de maní con coliflor y zanahoria sobre fideos', 34, 1, '{almuerzo,cena}', true, 'Hervís los fideos al dente, los escurrís y los pasás por un chorrito de aceite para que no se peguen.
Preparás las verduras: la coliflor en arbolitos chicos, la zanahoria en rodajas finas y la cebolla en plumas. Picás el ajo.
Cortás el tofu en cubos, lo secás con papel y lo dorás en el wok caliente con la mitad del aceite, 3–4 minutos, moviéndolo poco. Lo retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Mezclás la pasta de maní con la soja, el jugo de limón y 3 cucharadas de agua tibia hasta que quede lisa. La volcás sobre las verduras, devolvés el tofu al wok y mezclás 1 minuto.
Servís sobre fideos con semillas de sésamo por arriba.'),
  ('wok-de-carne-con-miel-y-soja-con-esparragos-y-zanahoria', 'Wok de carne con miel y soja con espárragos y zanahoria sobre cuscús', 29, 1, '{almuerzo,cena}', true, 'Cubrís el cuscús con la misma cantidad de agua caliente y sal, tapás 5 minutos y lo desgranás con un tenedor.
Preparás las verduras: los espárragos en trozos de 4 cm, la zanahoria en bastones finos y la cebolla de verdeo en rodajas. Picás el ajo.
Cortás la nalga en tiras finas a contrapelo y las sellás en el wok humeante con la mitad del aceite, 2–3 minutos, sin amontonarlas. Las retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Mezclás la salsa de soja con la miel y 2 cucharadas de agua. La volcás sobre las verduras, devolvés la carne al wok y mezclás 1 minuto.
Servís sobre cuscús con semillas de sésamo por arriba.'),
  ('wok-de-pollo-con-miso-con-zapallito-morron-y-cebolla', 'Wok de pollo con miso con zapallito, morrón y cebolla', 22, 1, '{almuerzo,cena}', true, 'Preparás las verduras: el zapallito en medias lunas, el morrón en tiras y la cebolla en plumas. Picás el ajo.
Cortás la pechuga en tiras finas, las salpimentás y las sellás en el wok bien caliente con la mitad del aceite, 4–5 minutos, hasta que estén doradas. Las retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Disolvés la pasta de miso en 4 cucharadas de agua caliente con el vinagre. La volcás sobre las verduras, devolvés el pollo al wok y mezclás 1 minuto.
Servís con semillas de sésamo por arriba.'),
  ('wok-de-carne-con-salsa-de-mani-con-coliflor-y-zanahoria', 'Wok de carne con salsa de maní con coliflor y zanahoria', 22, 1, '{almuerzo,cena}', true, 'Preparás las verduras: la coliflor en arbolitos chicos, la zanahoria en rodajas finas y la cebolla en plumas. Picás el ajo.
Cortás la nalga en tiras finas a contrapelo y las sellás en el wok humeante con la mitad del aceite, 2–3 minutos, sin amontonarlas. Las retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Mezclás la pasta de maní con la soja, el jugo de limón y 3 cucharadas de agua tibia hasta que quede lisa. La volcás sobre las verduras, devolvés la carne al wok y mezclás 1 minuto.
Servís con semillas de sésamo por arriba.'),
  ('wok-de-langostinos-con-miso-con-zanahoria-cebolla-y', 'Wok de langostinos con miso con zanahoria, cebolla y morrón sobre cuscús', 27, 1, '{almuerzo,cena}', true, 'Cubrís el cuscús con la misma cantidad de agua caliente y sal, tapás 5 minutos y lo desgranás con un tenedor.
Preparás las verduras: la zanahoria en bastones finos, la cebolla en plumas y el morrón en tiras. Picás el ajo.
Pelás los langostinos, los secás bien y los salteás en el wok bien caliente con la mitad del aceite, 1–2 minutos por lado. Los retirás.
En el mismo wok (o una sartén grande) salteás las verduras con el resto del aceite y el ajo, 4–5 minutos a fuego fuerte: tienen que quedar firmes, no blandas.
Disolvés la pasta de miso en 4 cucharadas de agua caliente con el vinagre. La volcás sobre las verduras, devolvés los langostinos al wok y mezclás 1 minuto.
Servís sobre cuscús con semillas de sésamo por arriba.')
on conflict (slug) do nothing;

insert into public.recipe_items (recipe_id, food_id, qty)
select r.id, f.id, v.qty from (values
  ('ensalada-de-kale-con-alubias-pepino-y-arvejas', 'kale', 55),
  ('ensalada-de-kale-con-alubias-pepino-y-arvejas', 'alubias', 130),
  ('ensalada-de-kale-con-alubias-pepino-y-arvejas', 'pepino', 0.5),
  ('ensalada-de-kale-con-alubias-pepino-y-arvejas', 'arvejas-frescas', 45),
  ('ensalada-de-kale-con-alubias-pepino-y-arvejas', 'mostaza', 8),
  ('ensalada-de-kale-con-alubias-pepino-y-arvejas', 'miel', 8),
  ('ensalada-de-kale-con-alubias-pepino-y-arvejas', 'aceite-oliva', 8),
  ('ensalada-de-kale-con-alubias-pepino-y-arvejas', 'vinagre-manzana', 5),
  ('ensalada-de-repollo-colorado-con-queso-cottage', 'repollo-colorado', 90),
  ('ensalada-de-repollo-colorado-con-queso-cottage', 'cottage', 100),
  ('ensalada-de-repollo-colorado-con-queso-cottage', 'parmesano', 15),
  ('ensalada-de-repollo-colorado-con-queso-cottage', 'frutilla', 70),
  ('ensalada-de-repollo-colorado-con-queso-cottage', 'aceite-oliva', 8),
  ('ensalada-de-repollo-colorado-con-queso-cottage', 'limon-exprimido', 15),
  ('ensalada-de-hojas-verdes-con-atun-apio-y-hinojo', 'hojas-verdes', 75),
  ('ensalada-de-hojas-verdes-con-atun-apio-y-hinojo', 'atun-natural', 1),
  ('ensalada-de-hojas-verdes-con-atun-apio-y-hinojo', 'apio', 35),
  ('ensalada-de-hojas-verdes-con-atun-apio-y-hinojo', 'hinojo', 45),
  ('ensalada-de-hojas-verdes-con-atun-apio-y-hinojo', 'mostaza', 8),
  ('ensalada-de-hojas-verdes-con-atun-apio-y-hinojo', 'miel', 8),
  ('ensalada-de-hojas-verdes-con-atun-apio-y-hinojo', 'aceite-oliva', 8),
  ('ensalada-de-hojas-verdes-con-atun-apio-y-hinojo', 'vinagre-manzana', 5),
  ('ensalada-de-espinaca-con-atun-morron-y-tomate', 'espinaca', 60),
  ('ensalada-de-espinaca-con-atun-morron-y-tomate', 'atun-natural', 1),
  ('ensalada-de-espinaca-con-atun-morron-y-tomate', 'morron', 0.5),
  ('ensalada-de-espinaca-con-atun-morron-y-tomate', 'tomate', 1),
  ('ensalada-de-espinaca-con-atun-morron-y-tomate', 'aderezo-cesar', 20),
  ('ensalada-de-hojas-verdes-con-queso-cottage-palta-y', 'hojas-verdes', 75),
  ('ensalada-de-hojas-verdes-con-queso-cottage-palta-y', 'cottage', 100),
  ('ensalada-de-hojas-verdes-con-queso-cottage-palta-y', 'palta', 0.5),
  ('ensalada-de-hojas-verdes-con-queso-cottage-palta-y', 'zanahoria', 1),
  ('ensalada-de-hojas-verdes-con-queso-cottage-palta-y', 'aderezo-cesar', 20),
  ('ensalada-de-repollo-con-garbanzos-cebolla-morada-y', 'repollo', 90),
  ('ensalada-de-repollo-con-garbanzos-cebolla-morada-y', 'garbanzos-hervidos', 130),
  ('ensalada-de-repollo-con-garbanzos-cebolla-morada-y', 'cebolla-morada', 0.5),
  ('ensalada-de-repollo-con-garbanzos-cebolla-morada-y', 'remolacha-cocida', 70),
  ('ensalada-de-repollo-con-garbanzos-cebolla-morada-y', 'aderezo-cesar', 20),
  ('ensalada-de-repollo-con-alubias-croutons-y-morron', 'repollo', 90),
  ('ensalada-de-repollo-con-alubias-croutons-y-morron', 'alubias', 130),
  ('ensalada-de-repollo-con-alubias-croutons-y-morron', 'croutons', 20),
  ('ensalada-de-repollo-con-alubias-croutons-y-morron', 'morron', 0.5),
  ('ensalada-de-repollo-con-alubias-croutons-y-morron', 'tahini', 15),
  ('ensalada-de-repollo-con-alubias-croutons-y-morron', 'limon-exprimido', 15),
  ('ensalada-de-hojas-verdes-con-pollo-grillado-almendras-y', 'hojas-verdes', 75),
  ('ensalada-de-hojas-verdes-con-pollo-grillado-almendras-y', 'pechuga-cruda', 150),
  ('ensalada-de-hojas-verdes-con-pollo-grillado-almendras-y', 'almendras', 15),
  ('ensalada-de-hojas-verdes-con-pollo-grillado-almendras-y', 'morron', 0.5),
  ('ensalada-de-hojas-verdes-con-pollo-grillado-almendras-y', 'aceto', 10),
  ('ensalada-de-hojas-verdes-con-pollo-grillado-almendras-y', 'aceite-oliva', 8),
  ('ensalada-de-hojas-verdes-con-pollo-grillado-almendras-y', 'aceite', 4),
  ('ensalada-de-berro-con-tofu-dorado-tomate-y-palta', 'berro', 55),
  ('ensalada-de-berro-con-tofu-dorado-tomate-y-palta', 'tofu', 120),
  ('ensalada-de-berro-con-tofu-dorado-tomate-y-palta', 'tomate', 1),
  ('ensalada-de-berro-con-tofu-dorado-tomate-y-palta', 'palta', 0.5),
  ('ensalada-de-berro-con-tofu-dorado-tomate-y-palta', 'aceto', 10),
  ('ensalada-de-berro-con-tofu-dorado-tomate-y-palta', 'aceite-oliva', 8),
  ('ensalada-de-berro-con-tofu-dorado-tomate-y-palta', 'aceite', 5),
  ('ensalada-de-escarola-con-alubias-apio-y-arvejas', 'escarola', 65),
  ('ensalada-de-escarola-con-alubias-apio-y-arvejas', 'alubias', 130),
  ('ensalada-de-escarola-con-alubias-apio-y-arvejas', 'apio', 35),
  ('ensalada-de-escarola-con-alubias-apio-y-arvejas', 'arvejas-frescas', 45),
  ('ensalada-de-escarola-con-alubias-apio-y-arvejas', 'aceto', 10),
  ('ensalada-de-escarola-con-alubias-apio-y-arvejas', 'aceite-oliva', 8),
  ('ensalada-de-lechuga-con-garbanzos-palta-y-zanahoria', 'lechuga', 80),
  ('ensalada-de-lechuga-con-garbanzos-palta-y-zanahoria', 'garbanzos-hervidos', 130),
  ('ensalada-de-lechuga-con-garbanzos-palta-y-zanahoria', 'palta', 0.5),
  ('ensalada-de-lechuga-con-garbanzos-palta-y-zanahoria', 'zanahoria', 1),
  ('ensalada-de-lechuga-con-garbanzos-palta-y-zanahoria', 'yogur-natural', 45),
  ('ensalada-de-lechuga-con-garbanzos-palta-y-zanahoria', 'mostaza-antigua', 6),
  ('ensalada-de-escarola-con-edamame-rabanitos-y-tomate', 'escarola', 65),
  ('ensalada-de-escarola-con-edamame-rabanitos-y-tomate', 'edamame', 100),
  ('ensalada-de-escarola-con-edamame-rabanitos-y-tomate', 'rabanito', 30),
  ('ensalada-de-escarola-con-edamame-rabanitos-y-tomate', 'tomate', 1),
  ('ensalada-de-escarola-con-edamame-rabanitos-y-tomate', 'tahini', 15),
  ('ensalada-de-escarola-con-edamame-rabanitos-y-tomate', 'limon-exprimido', 15),
  ('ensalada-de-rucula-con-atun-apio-y-palta', 'rucula', 60),
  ('ensalada-de-rucula-con-atun-apio-y-palta', 'atun-natural', 1),
  ('ensalada-de-rucula-con-atun-apio-y-palta', 'apio', 35),
  ('ensalada-de-rucula-con-atun-apio-y-palta', 'palta', 0.5),
  ('ensalada-de-rucula-con-atun-apio-y-palta', 'aceto', 10),
  ('ensalada-de-rucula-con-atun-apio-y-palta', 'aceite-oliva', 8),
  ('ensalada-de-repollo-con-queso-de-cabra-hinojo-y', 'repollo', 90),
  ('ensalada-de-repollo-con-queso-de-cabra-hinojo-y', 'queso-cabra', 60),
  ('ensalada-de-repollo-con-queso-de-cabra-hinojo-y', 'hinojo', 45),
  ('ensalada-de-repollo-con-queso-de-cabra-hinojo-y', 'remolacha-cocida', 70),
  ('ensalada-de-repollo-con-queso-de-cabra-hinojo-y', 'yogur-natural', 45),
  ('ensalada-de-repollo-con-queso-de-cabra-hinojo-y', 'mostaza-antigua', 6),
  ('ensalada-de-kale-con-queso-de-cabra-tomate-y-parmesano', 'kale', 55),
  ('ensalada-de-kale-con-queso-de-cabra-tomate-y-parmesano', 'queso-cabra', 60),
  ('ensalada-de-kale-con-queso-de-cabra-tomate-y-parmesano', 'tomate', 1),
  ('ensalada-de-kale-con-queso-de-cabra-tomate-y-parmesano', 'parmesano', 15),
  ('ensalada-de-kale-con-queso-de-cabra-tomate-y-parmesano', 'yogur-natural', 45),
  ('ensalada-de-kale-con-queso-de-cabra-tomate-y-parmesano', 'mostaza-antigua', 6),
  ('ensalada-de-repollo-colorado-con-pollo-grillado-morron', 'repollo-colorado', 90),
  ('ensalada-de-repollo-colorado-con-pollo-grillado-morron', 'pechuga-cruda', 150),
  ('ensalada-de-repollo-colorado-con-pollo-grillado-morron', 'morron', 0.5),
  ('ensalada-de-repollo-colorado-con-pollo-grillado-morron', 'manzana', 0.5),
  ('ensalada-de-repollo-colorado-con-pollo-grillado-morron', 'aceite-oliva', 8),
  ('ensalada-de-repollo-colorado-con-pollo-grillado-morron', 'limon-exprimido', 15),
  ('ensalada-de-repollo-colorado-con-pollo-grillado-morron', 'aceite', 4),
  ('ensalada-de-escarola-con-pollo-grillado-palta-y-nueces', 'escarola', 65),
  ('ensalada-de-escarola-con-pollo-grillado-palta-y-nueces', 'pechuga-cruda', 150),
  ('ensalada-de-escarola-con-pollo-grillado-palta-y-nueces', 'palta', 0.5),
  ('ensalada-de-escarola-con-pollo-grillado-palta-y-nueces', 'nueces', 15),
  ('ensalada-de-escarola-con-pollo-grillado-palta-y-nueces', 'aceto', 10),
  ('ensalada-de-escarola-con-pollo-grillado-palta-y-nueces', 'aceite-oliva', 8),
  ('ensalada-de-escarola-con-pollo-grillado-palta-y-nueces', 'aceite', 4),
  ('ensalada-de-rucula-con-langostinos-palta-y-zanahoria', 'rucula', 60),
  ('ensalada-de-rucula-con-langostinos-palta-y-zanahoria', 'langostinos', 120),
  ('ensalada-de-rucula-con-langostinos-palta-y-zanahoria', 'palta', 0.5),
  ('ensalada-de-rucula-con-langostinos-palta-y-zanahoria', 'zanahoria-rallada', 60),
  ('ensalada-de-rucula-con-langostinos-palta-y-zanahoria', 'mostaza', 8),
  ('ensalada-de-rucula-con-langostinos-palta-y-zanahoria', 'miel', 8),
  ('ensalada-de-rucula-con-langostinos-palta-y-zanahoria', 'aceite-oliva', 8),
  ('ensalada-de-rucula-con-langostinos-palta-y-zanahoria', 'vinagre-manzana', 5),
  ('ensalada-de-rucula-con-langostinos-palta-y-zanahoria', 'aceite', 5),
  ('ensalada-de-repollo-colorado-con-salmon-ahumado-uvas-y', 'repollo-colorado', 90),
  ('ensalada-de-repollo-colorado-con-salmon-ahumado-uvas-y', 'salmon-ahumado', 60),
  ('ensalada-de-repollo-colorado-con-salmon-ahumado-uvas-y', 'uva', 60),
  ('ensalada-de-repollo-colorado-con-salmon-ahumado-uvas-y', 'cebolla-morada', 0.5),
  ('ensalada-de-repollo-colorado-con-salmon-ahumado-uvas-y', 'aceite-oliva', 8),
  ('ensalada-de-repollo-colorado-con-salmon-ahumado-uvas-y', 'limon-exprimido', 15),
  ('ensalada-de-rucula-con-tofu-dorado-aceitunas-y-arvejas', 'rucula', 60),
  ('ensalada-de-rucula-con-tofu-dorado-aceitunas-y-arvejas', 'tofu', 120),
  ('ensalada-de-rucula-con-tofu-dorado-aceitunas-y-arvejas', 'aceitunas', 20),
  ('ensalada-de-rucula-con-tofu-dorado-aceitunas-y-arvejas', 'arvejas-frescas', 45),
  ('ensalada-de-rucula-con-tofu-dorado-aceitunas-y-arvejas', 'pesto', 20),
  ('ensalada-de-rucula-con-tofu-dorado-aceitunas-y-arvejas', 'aceite', 5),
  ('ensalada-de-espinaca-con-lentejas-apio-y-aceitunas', 'espinaca', 60),
  ('ensalada-de-espinaca-con-lentejas-apio-y-aceitunas', 'lentejas-hervidas', 130),
  ('ensalada-de-espinaca-con-lentejas-apio-y-aceitunas', 'apio', 35),
  ('ensalada-de-espinaca-con-lentejas-apio-y-aceitunas', 'aceitunas', 20),
  ('ensalada-de-espinaca-con-lentejas-apio-y-aceitunas', 'pesto', 20),
  ('ensalada-de-radicheta-con-lentejas-cebolla-morada-y', 'radicheta', 55),
  ('ensalada-de-radicheta-con-lentejas-cebolla-morada-y', 'lentejas-hervidas', 130),
  ('ensalada-de-radicheta-con-lentejas-cebolla-morada-y', 'cebolla-morada', 0.5),
  ('ensalada-de-radicheta-con-lentejas-cebolla-morada-y', 'aceitunas', 20),
  ('ensalada-de-radicheta-con-lentejas-cebolla-morada-y', 'mostaza', 8),
  ('ensalada-de-radicheta-con-lentejas-cebolla-morada-y', 'miel', 8),
  ('ensalada-de-radicheta-con-lentejas-cebolla-morada-y', 'aceite-oliva', 8),
  ('ensalada-de-radicheta-con-lentejas-cebolla-morada-y', 'vinagre-manzana', 5),
  ('ensalada-de-repollo-colorado-con-langostinos-palmitos-y', 'repollo-colorado', 90),
  ('ensalada-de-repollo-colorado-con-langostinos-palmitos-y', 'langostinos', 120),
  ('ensalada-de-repollo-colorado-con-langostinos-palmitos-y', 'palmitos', 45),
  ('ensalada-de-repollo-colorado-con-langostinos-palmitos-y', 'rabanito', 30),
  ('ensalada-de-repollo-colorado-con-langostinos-palmitos-y', 'yogur-natural', 45),
  ('ensalada-de-repollo-colorado-con-langostinos-palmitos-y', 'limon-exprimido', 10),
  ('ensalada-de-repollo-colorado-con-langostinos-palmitos-y', 'aceite', 5),
  ('ensalada-de-lechuga-morada-con-porotos-negros-palta-y', 'lechuga-morada', 70),
  ('ensalada-de-lechuga-morada-con-porotos-negros-palta-y', 'porotos-negros-hervidos', 130),
  ('ensalada-de-lechuga-morada-con-porotos-negros-palta-y', 'palta', 0.5),
  ('ensalada-de-lechuga-morada-con-porotos-negros-palta-y', 'palmitos', 45),
  ('ensalada-de-lechuga-morada-con-porotos-negros-palta-y', 'aderezo-cesar', 20),
  ('ensalada-de-kale-con-garbanzos-rabanitos-y-brotes-de', 'kale', 55),
  ('ensalada-de-kale-con-garbanzos-rabanitos-y-brotes-de', 'garbanzos-hervidos', 130),
  ('ensalada-de-kale-con-garbanzos-rabanitos-y-brotes-de', 'rabanito', 30),
  ('ensalada-de-kale-con-garbanzos-rabanitos-y-brotes-de', 'brotes-soja', 30),
  ('ensalada-de-kale-con-garbanzos-rabanitos-y-brotes-de', 'tahini', 15),
  ('ensalada-de-kale-con-garbanzos-rabanitos-y-brotes-de', 'limon-exprimido', 15),
  ('ensalada-de-repollo-colorado-con-jamon-crudo-croutons-y', 'repollo-colorado', 90),
  ('ensalada-de-repollo-colorado-con-jamon-crudo-croutons-y', 'jamon-crudo', 45),
  ('ensalada-de-repollo-colorado-con-jamon-crudo-croutons-y', 'croutons', 20),
  ('ensalada-de-repollo-colorado-con-jamon-crudo-croutons-y', 'pera', 0.5),
  ('ensalada-de-repollo-colorado-con-jamon-crudo-croutons-y', 'aceite-oliva', 8),
  ('ensalada-de-repollo-colorado-con-jamon-crudo-croutons-y', 'limon-exprimido', 15),
  ('ensalada-de-escarola-con-mejillones-tomate-y-palmitos', 'escarola', 65),
  ('ensalada-de-escarola-con-mejillones-tomate-y-palmitos', 'mejillones', 100),
  ('ensalada-de-escarola-con-mejillones-tomate-y-palmitos', 'tomate', 1),
  ('ensalada-de-escarola-con-mejillones-tomate-y-palmitos', 'palmitos', 45),
  ('ensalada-de-escarola-con-mejillones-tomate-y-palmitos', 'aceto', 10),
  ('ensalada-de-escarola-con-mejillones-tomate-y-palmitos', 'aceite-oliva', 8),
  ('ensalada-de-repollo-con-porotos-arvejas-y-parmesano', 'repollo', 90),
  ('ensalada-de-repollo-con-porotos-arvejas-y-parmesano', 'porotos-hervidos', 130),
  ('ensalada-de-repollo-con-porotos-arvejas-y-parmesano', 'arvejas-frescas', 45),
  ('ensalada-de-repollo-con-porotos-arvejas-y-parmesano', 'parmesano', 15),
  ('ensalada-de-repollo-con-porotos-arvejas-y-parmesano', 'aceto', 10),
  ('ensalada-de-repollo-con-porotos-arvejas-y-parmesano', 'aceite-oliva', 8),
  ('ensalada-de-lechuga-con-alubias-rabanitos-y-morron', 'lechuga', 80),
  ('ensalada-de-lechuga-con-alubias-rabanitos-y-morron', 'alubias', 130),
  ('ensalada-de-lechuga-con-alubias-rabanitos-y-morron', 'rabanito', 30),
  ('ensalada-de-lechuga-con-alubias-rabanitos-y-morron', 'morron', 0.5),
  ('ensalada-de-lechuga-con-alubias-rabanitos-y-morron', 'yogur-natural', 45),
  ('ensalada-de-lechuga-con-alubias-rabanitos-y-morron', 'limon-exprimido', 10),
  ('ensalada-de-lechuga-con-queso-de-cabra-apio-y-frutillas', 'lechuga', 80),
  ('ensalada-de-lechuga-con-queso-de-cabra-apio-y-frutillas', 'queso-cabra', 60),
  ('ensalada-de-lechuga-con-queso-de-cabra-apio-y-frutillas', 'apio', 35),
  ('ensalada-de-lechuga-con-queso-de-cabra-apio-y-frutillas', 'frutilla', 70),
  ('ensalada-de-lechuga-con-queso-de-cabra-apio-y-frutillas', 'aceto', 10),
  ('ensalada-de-lechuga-con-queso-de-cabra-apio-y-frutillas', 'aceite-oliva', 8),
  ('ensalada-de-rucula-con-mejillones-zanahoria-rallada-y', 'rucula', 60),
  ('ensalada-de-rucula-con-mejillones-zanahoria-rallada-y', 'mejillones', 100),
  ('ensalada-de-rucula-con-mejillones-zanahoria-rallada-y', 'zanahoria-rallada', 60),
  ('ensalada-de-rucula-con-mejillones-zanahoria-rallada-y', 'palta', 0.5),
  ('ensalada-de-rucula-con-mejillones-zanahoria-rallada-y', 'aderezo-cesar', 20),
  ('ensalada-de-hojas-verdes-con-jamon-crudo-zanahoria-y', 'hojas-verdes', 75),
  ('ensalada-de-hojas-verdes-con-jamon-crudo-zanahoria-y', 'jamon-crudo', 45),
  ('ensalada-de-hojas-verdes-con-jamon-crudo-zanahoria-y', 'zanahoria', 1),
  ('ensalada-de-hojas-verdes-con-jamon-crudo-zanahoria-y', 'manzana', 0.5),
  ('ensalada-de-hojas-verdes-con-jamon-crudo-zanahoria-y', 'aceto', 10),
  ('ensalada-de-hojas-verdes-con-jamon-crudo-zanahoria-y', 'aceite-oliva', 8),
  ('ensalada-de-repollo-con-queso-feta-tomates-cherry-y', 'repollo', 90),
  ('ensalada-de-repollo-con-queso-feta-tomates-cherry-y', 'feta', 60),
  ('ensalada-de-repollo-con-queso-feta-tomates-cherry-y', 'tomate-cherry', 80),
  ('ensalada-de-repollo-con-queso-feta-tomates-cherry-y', 'aceitunas', 20),
  ('ensalada-de-repollo-con-queso-feta-tomates-cherry-y', 'aceto', 10),
  ('ensalada-de-repollo-con-queso-feta-tomates-cherry-y', 'aceite-oliva', 8),
  ('ensalada-de-kale-con-tofu-dorado-tomate-y-parmesano', 'kale', 55),
  ('ensalada-de-kale-con-tofu-dorado-tomate-y-parmesano', 'tofu', 120),
  ('ensalada-de-kale-con-tofu-dorado-tomate-y-parmesano', 'tomate', 1),
  ('ensalada-de-kale-con-tofu-dorado-tomate-y-parmesano', 'parmesano', 15),
  ('ensalada-de-kale-con-tofu-dorado-tomate-y-parmesano', 'mostaza', 8),
  ('ensalada-de-kale-con-tofu-dorado-tomate-y-parmesano', 'miel', 8),
  ('ensalada-de-kale-con-tofu-dorado-tomate-y-parmesano', 'aceite-oliva', 8),
  ('ensalada-de-kale-con-tofu-dorado-tomate-y-parmesano', 'vinagre-manzana', 5),
  ('ensalada-de-kale-con-tofu-dorado-tomate-y-parmesano', 'aceite', 5),
  ('ensalada-de-repollo-con-mejillones-cebolla-morada-y', 'repollo', 90),
  ('ensalada-de-repollo-con-mejillones-cebolla-morada-y', 'mejillones', 100),
  ('ensalada-de-repollo-con-mejillones-cebolla-morada-y', 'cebolla-morada', 0.5),
  ('ensalada-de-repollo-con-mejillones-cebolla-morada-y', 'remolacha-cocida', 70),
  ('ensalada-de-repollo-con-mejillones-cebolla-morada-y', 'aceite-oliva', 8),
  ('ensalada-de-repollo-con-mejillones-cebolla-morada-y', 'limon-exprimido', 15),
  ('ensalada-de-radicheta-con-atun-choclo-y-apio', 'radicheta', 55),
  ('ensalada-de-radicheta-con-atun-choclo-y-apio', 'atun-natural', 1),
  ('ensalada-de-radicheta-con-atun-choclo-y-apio', 'choclo', 50),
  ('ensalada-de-radicheta-con-atun-choclo-y-apio', 'apio', 35),
  ('ensalada-de-radicheta-con-atun-choclo-y-apio', 'aderezo-cesar', 20),
  ('ensalada-de-escarola-con-porotos-palmitos-y-brotes-de', 'escarola', 65),
  ('ensalada-de-escarola-con-porotos-palmitos-y-brotes-de', 'porotos-hervidos', 130),
  ('ensalada-de-escarola-con-porotos-palmitos-y-brotes-de', 'palmitos', 45),
  ('ensalada-de-escarola-con-porotos-palmitos-y-brotes-de', 'brotes-soja', 30),
  ('ensalada-de-escarola-con-porotos-palmitos-y-brotes-de', 'tahini', 15),
  ('ensalada-de-escarola-con-porotos-palmitos-y-brotes-de', 'limon-exprimido', 15),
  ('ensalada-de-kale-con-porotos-tomate-y-brotes-de-soja', 'kale', 55),
  ('ensalada-de-kale-con-porotos-tomate-y-brotes-de-soja', 'porotos-hervidos', 130),
  ('ensalada-de-kale-con-porotos-tomate-y-brotes-de-soja', 'tomate', 1),
  ('ensalada-de-kale-con-porotos-tomate-y-brotes-de-soja', 'brotes-soja', 30),
  ('ensalada-de-kale-con-porotos-tomate-y-brotes-de-soja', 'tahini', 15),
  ('ensalada-de-kale-con-porotos-tomate-y-brotes-de-soja', 'limon-exprimido', 15),
  ('ensalada-de-escarola-con-queso-de-cabra-rabanitos-y', 'escarola', 65),
  ('ensalada-de-escarola-con-queso-de-cabra-rabanitos-y', 'queso-cabra', 60),
  ('ensalada-de-escarola-con-queso-de-cabra-rabanitos-y', 'rabanito', 30),
  ('ensalada-de-escarola-con-queso-de-cabra-rabanitos-y', 'semillas-girasol', 10),
  ('ensalada-de-escarola-con-queso-de-cabra-rabanitos-y', 'pesto', 20),
  ('ensalada-de-espinaca-con-pollo-grillado-pera-y-semillas', 'espinaca', 60),
  ('ensalada-de-espinaca-con-pollo-grillado-pera-y-semillas', 'pechuga-cruda', 150),
  ('ensalada-de-espinaca-con-pollo-grillado-pera-y-semillas', 'pera', 0.5),
  ('ensalada-de-espinaca-con-pollo-grillado-pera-y-semillas', 'semillas-girasol', 10),
  ('ensalada-de-espinaca-con-pollo-grillado-pera-y-semillas', 'mostaza', 8),
  ('ensalada-de-espinaca-con-pollo-grillado-pera-y-semillas', 'miel', 8),
  ('ensalada-de-espinaca-con-pollo-grillado-pera-y-semillas', 'aceite-oliva', 8),
  ('ensalada-de-espinaca-con-pollo-grillado-pera-y-semillas', 'vinagre-manzana', 5),
  ('ensalada-de-espinaca-con-pollo-grillado-pera-y-semillas', 'aceite', 4),
  ('ensalada-de-lechuga-morada-con-queso-cottage-palmitos-y', 'lechuga-morada', 70),
  ('ensalada-de-lechuga-morada-con-queso-cottage-palmitos-y', 'cottage', 100),
  ('ensalada-de-lechuga-morada-con-queso-cottage-palmitos-y', 'palmitos', 45),
  ('ensalada-de-lechuga-morada-con-queso-cottage-palmitos-y', 'croutons', 20),
  ('ensalada-de-lechuga-morada-con-queso-cottage-palmitos-y', 'yogur-natural', 45),
  ('ensalada-de-lechuga-morada-con-queso-cottage-palmitos-y', 'limon-exprimido', 10),
  ('ensalada-de-rucula-con-queso-feta-tomate-y-naranja', 'rucula', 60),
  ('ensalada-de-rucula-con-queso-feta-tomate-y-naranja', 'feta', 60),
  ('ensalada-de-rucula-con-queso-feta-tomate-y-naranja', 'tomate', 1),
  ('ensalada-de-rucula-con-queso-feta-tomate-y-naranja', 'naranja', 0.5),
  ('ensalada-de-rucula-con-queso-feta-tomate-y-naranja', 'mostaza', 8),
  ('ensalada-de-rucula-con-queso-feta-tomate-y-naranja', 'miel', 8),
  ('ensalada-de-rucula-con-queso-feta-tomate-y-naranja', 'aceite-oliva', 8),
  ('ensalada-de-rucula-con-queso-feta-tomate-y-naranja', 'vinagre-manzana', 5),
  ('ensalada-de-espinaca-con-jamon-cocido-apio-y-palta', 'espinaca', 60),
  ('ensalada-de-espinaca-con-jamon-cocido-apio-y-palta', 'jamon-cocido', 70),
  ('ensalada-de-espinaca-con-jamon-cocido-apio-y-palta', 'apio', 35),
  ('ensalada-de-espinaca-con-jamon-cocido-apio-y-palta', 'palta', 0.5),
  ('ensalada-de-espinaca-con-jamon-cocido-apio-y-palta', 'mostaza', 8),
  ('ensalada-de-espinaca-con-jamon-cocido-apio-y-palta', 'miel', 8),
  ('ensalada-de-espinaca-con-jamon-cocido-apio-y-palta', 'aceite-oliva', 8),
  ('ensalada-de-espinaca-con-jamon-cocido-apio-y-palta', 'vinagre-manzana', 5),
  ('ensalada-de-lechuga-morada-con-pollo-grillado-palmitos', 'lechuga-morada', 70),
  ('ensalada-de-lechuga-morada-con-pollo-grillado-palmitos', 'pechuga-cruda', 150),
  ('ensalada-de-lechuga-morada-con-pollo-grillado-palmitos', 'palmitos', 45),
  ('ensalada-de-lechuga-morada-con-pollo-grillado-palmitos', 'rabanito', 30),
  ('ensalada-de-lechuga-morada-con-pollo-grillado-palmitos', 'aceite-oliva', 8),
  ('ensalada-de-lechuga-morada-con-pollo-grillado-palmitos', 'limon-exprimido', 15),
  ('ensalada-de-lechuga-morada-con-pollo-grillado-palmitos', 'aceite', 4),
  ('ensalada-de-lechuga-con-lentejas-zanahoria-rallada-y', 'lechuga', 80),
  ('ensalada-de-lechuga-con-lentejas-zanahoria-rallada-y', 'lentejas-hervidas', 130),
  ('ensalada-de-lechuga-con-lentejas-zanahoria-rallada-y', 'zanahoria-rallada', 60),
  ('ensalada-de-lechuga-con-lentejas-zanahoria-rallada-y', 'tomate', 1),
  ('ensalada-de-lechuga-con-lentejas-zanahoria-rallada-y', 'yogur-natural', 45),
  ('ensalada-de-lechuga-con-lentejas-zanahoria-rallada-y', 'limon-exprimido', 10),
  ('ensalada-de-hojas-verdes-con-porotos-negros-morron-y', 'hojas-verdes', 75),
  ('ensalada-de-hojas-verdes-con-porotos-negros-morron-y', 'porotos-negros-hervidos', 130),
  ('ensalada-de-hojas-verdes-con-porotos-negros-morron-y', 'morron', 0.5),
  ('ensalada-de-hojas-verdes-con-porotos-negros-morron-y', 'tomate-cherry', 80),
  ('ensalada-de-hojas-verdes-con-porotos-negros-morron-y', 'aceto', 10),
  ('ensalada-de-hojas-verdes-con-porotos-negros-morron-y', 'aceite-oliva', 8),
  ('ensalada-de-lechuga-morada-con-mejillones-croutons-y', 'lechuga-morada', 70),
  ('ensalada-de-lechuga-morada-con-mejillones-croutons-y', 'mejillones', 100),
  ('ensalada-de-lechuga-morada-con-mejillones-croutons-y', 'croutons', 20),
  ('ensalada-de-lechuga-morada-con-mejillones-croutons-y', 'rabanito', 30),
  ('ensalada-de-lechuga-morada-con-mejillones-croutons-y', 'yogur-natural', 45),
  ('ensalada-de-lechuga-morada-con-mejillones-croutons-y', 'mostaza-antigua', 6),
  ('ensalada-de-repollo-colorado-con-atun-brotes-de-soja-y', 'repollo-colorado', 90),
  ('ensalada-de-repollo-colorado-con-atun-brotes-de-soja-y', 'atun-natural', 1),
  ('ensalada-de-repollo-colorado-con-atun-brotes-de-soja-y', 'brotes-soja', 30),
  ('ensalada-de-repollo-colorado-con-atun-brotes-de-soja-y', 'remolacha-cocida', 70),
  ('ensalada-de-repollo-colorado-con-atun-brotes-de-soja-y', 'mostaza', 8),
  ('ensalada-de-repollo-colorado-con-atun-brotes-de-soja-y', 'miel', 8),
  ('ensalada-de-repollo-colorado-con-atun-brotes-de-soja-y', 'aceite-oliva', 8),
  ('ensalada-de-repollo-colorado-con-atun-brotes-de-soja-y', 'vinagre-manzana', 5),
  ('ensalada-de-kale-con-mejillones-apio-y-brotes-de-soja', 'kale', 55),
  ('ensalada-de-kale-con-mejillones-apio-y-brotes-de-soja', 'mejillones', 100),
  ('ensalada-de-kale-con-mejillones-apio-y-brotes-de-soja', 'apio', 35),
  ('ensalada-de-kale-con-mejillones-apio-y-brotes-de-soja', 'brotes-soja', 30),
  ('ensalada-de-kale-con-mejillones-apio-y-brotes-de-soja', 'aderezo-cesar', 20),
  ('ensalada-de-repollo-colorado-con-queso-feta-hinojo-y', 'repollo-colorado', 90),
  ('ensalada-de-repollo-colorado-con-queso-feta-hinojo-y', 'feta', 60),
  ('ensalada-de-repollo-colorado-con-queso-feta-hinojo-y', 'hinojo', 45),
  ('ensalada-de-repollo-colorado-con-queso-feta-hinojo-y', 'tomate', 1),
  ('ensalada-de-repollo-colorado-con-queso-feta-hinojo-y', 'aderezo-cesar', 20),
  ('ensalada-de-lechuga-morada-con-jamon-crudo-nueces-y', 'lechuga-morada', 70),
  ('ensalada-de-lechuga-morada-con-jamon-crudo-nueces-y', 'jamon-crudo', 45),
  ('ensalada-de-lechuga-morada-con-jamon-crudo-nueces-y', 'nueces', 15),
  ('ensalada-de-lechuga-morada-con-jamon-crudo-nueces-y', 'choclo', 50),
  ('ensalada-de-lechuga-morada-con-jamon-crudo-nueces-y', 'mostaza', 8),
  ('ensalada-de-lechuga-morada-con-jamon-crudo-nueces-y', 'miel', 8),
  ('ensalada-de-lechuga-morada-con-jamon-crudo-nueces-y', 'aceite-oliva', 8),
  ('ensalada-de-lechuga-morada-con-jamon-crudo-nueces-y', 'vinagre-manzana', 5),
  ('ensalada-de-hojas-verdes-con-queso-cremoso-zanahoria', 'hojas-verdes', 75),
  ('ensalada-de-hojas-verdes-con-queso-cremoso-zanahoria', 'queso-cremoso', 80),
  ('ensalada-de-hojas-verdes-con-queso-cremoso-zanahoria', 'zanahoria-rallada', 60),
  ('ensalada-de-hojas-verdes-con-queso-cremoso-zanahoria', 'parmesano', 15),
  ('ensalada-de-hojas-verdes-con-queso-cremoso-zanahoria', 'yogur-natural', 45),
  ('ensalada-de-hojas-verdes-con-queso-cremoso-zanahoria', 'mostaza-antigua', 6),
  ('ensalada-de-rucula-con-muzzarella-morron-y-zanahoria', 'rucula', 60),
  ('ensalada-de-rucula-con-muzzarella-morron-y-zanahoria', 'muzzarella', 80),
  ('ensalada-de-rucula-con-muzzarella-morron-y-zanahoria', 'morron', 0.5),
  ('ensalada-de-rucula-con-muzzarella-morron-y-zanahoria', 'zanahoria-rallada', 60),
  ('ensalada-de-rucula-con-muzzarella-morron-y-zanahoria', 'aceite-oliva', 8),
  ('ensalada-de-rucula-con-muzzarella-morron-y-zanahoria', 'limon-exprimido', 15),
  ('ensalada-de-espinaca-con-muzzarella-cebolla-morada-y', 'espinaca', 60),
  ('ensalada-de-espinaca-con-muzzarella-cebolla-morada-y', 'muzzarella', 80),
  ('ensalada-de-espinaca-con-muzzarella-cebolla-morada-y', 'cebolla-morada', 0.5),
  ('ensalada-de-espinaca-con-muzzarella-cebolla-morada-y', 'morron', 0.5),
  ('ensalada-de-espinaca-con-muzzarella-cebolla-morada-y', 'yogur-natural', 45),
  ('ensalada-de-espinaca-con-muzzarella-cebolla-morada-y', 'limon-exprimido', 10),
  ('ensalada-de-repollo-colorado-con-alubias-brotes-de-soja', 'repollo-colorado', 90),
  ('ensalada-de-repollo-colorado-con-alubias-brotes-de-soja', 'alubias', 130),
  ('ensalada-de-repollo-colorado-con-alubias-brotes-de-soja', 'brotes-soja', 30),
  ('ensalada-de-repollo-colorado-con-alubias-brotes-de-soja', 'tomate-cherry', 80),
  ('ensalada-de-repollo-colorado-con-alubias-brotes-de-soja', 'aceite-oliva', 8),
  ('ensalada-de-repollo-colorado-con-alubias-brotes-de-soja', 'limon-exprimido', 15),
  ('ensalada-de-hojas-verdes-con-garbanzos-zanahoria', 'hojas-verdes', 75),
  ('ensalada-de-hojas-verdes-con-garbanzos-zanahoria', 'garbanzos-hervidos', 130),
  ('ensalada-de-hojas-verdes-con-garbanzos-zanahoria', 'zanahoria-rallada', 60),
  ('ensalada-de-hojas-verdes-con-garbanzos-zanahoria', 'remolacha-cocida', 70),
  ('ensalada-de-hojas-verdes-con-garbanzos-zanahoria', 'aceite-oliva', 8),
  ('ensalada-de-hojas-verdes-con-garbanzos-zanahoria', 'limon-exprimido', 15),
  ('ensalada-de-repollo-con-lentejas-apio-y-zanahoria', 'repollo', 90),
  ('ensalada-de-repollo-con-lentejas-apio-y-zanahoria', 'lentejas-hervidas', 130),
  ('ensalada-de-repollo-con-lentejas-apio-y-zanahoria', 'apio', 35),
  ('ensalada-de-repollo-con-lentejas-apio-y-zanahoria', 'zanahoria-rallada', 60),
  ('ensalada-de-repollo-con-lentejas-apio-y-zanahoria', 'tahini', 15),
  ('ensalada-de-repollo-con-lentejas-apio-y-zanahoria', 'limon-exprimido', 15),
  ('ensalada-de-espinaca-con-jamon-crudo-croutons-y', 'espinaca', 60),
  ('ensalada-de-espinaca-con-jamon-crudo-croutons-y', 'jamon-crudo', 45),
  ('ensalada-de-espinaca-con-jamon-crudo-croutons-y', 'croutons', 20),
  ('ensalada-de-espinaca-con-jamon-crudo-croutons-y', 'parmesano', 15),
  ('ensalada-de-espinaca-con-jamon-crudo-croutons-y', 'mostaza', 8),
  ('ensalada-de-espinaca-con-jamon-crudo-croutons-y', 'miel', 8),
  ('ensalada-de-espinaca-con-jamon-crudo-croutons-y', 'aceite-oliva', 8),
  ('ensalada-de-espinaca-con-jamon-crudo-croutons-y', 'vinagre-manzana', 5),
  ('ensalada-de-repollo-con-queso-cottage-manzana-y', 'repollo', 90),
  ('ensalada-de-repollo-con-queso-cottage-manzana-y', 'cottage', 100),
  ('ensalada-de-repollo-con-queso-cottage-manzana-y', 'manzana', 0.5),
  ('ensalada-de-repollo-con-queso-cottage-manzana-y', 'parmesano', 15),
  ('ensalada-de-repollo-con-queso-cottage-manzana-y', 'mostaza', 8),
  ('ensalada-de-repollo-con-queso-cottage-manzana-y', 'miel', 8),
  ('ensalada-de-repollo-con-queso-cottage-manzana-y', 'aceite-oliva', 8),
  ('ensalada-de-repollo-con-queso-cottage-manzana-y', 'vinagre-manzana', 5),
  ('ensalada-de-repollo-con-langostinos-arvejas-y-morron', 'repollo', 90),
  ('ensalada-de-repollo-con-langostinos-arvejas-y-morron', 'langostinos', 120),
  ('ensalada-de-repollo-con-langostinos-arvejas-y-morron', 'arvejas-frescas', 45),
  ('ensalada-de-repollo-con-langostinos-arvejas-y-morron', 'morron', 0.5),
  ('ensalada-de-repollo-con-langostinos-arvejas-y-morron', 'pesto', 20),
  ('ensalada-de-repollo-con-langostinos-arvejas-y-morron', 'aceite', 5),
  ('ensalada-de-espinaca-con-queso-cottage-nueces-y-tomate', 'espinaca', 60),
  ('ensalada-de-espinaca-con-queso-cottage-nueces-y-tomate', 'cottage', 100),
  ('ensalada-de-espinaca-con-queso-cottage-nueces-y-tomate', 'nueces', 15),
  ('ensalada-de-espinaca-con-queso-cottage-nueces-y-tomate', 'tomate', 1),
  ('ensalada-de-espinaca-con-queso-cottage-nueces-y-tomate', 'tahini', 15),
  ('ensalada-de-espinaca-con-queso-cottage-nueces-y-tomate', 'limon-exprimido', 15),
  ('ensalada-de-hojas-verdes-con-mejillones-rabanitos-y', 'hojas-verdes', 75),
  ('ensalada-de-hojas-verdes-con-mejillones-rabanitos-y', 'mejillones', 100),
  ('ensalada-de-hojas-verdes-con-mejillones-rabanitos-y', 'rabanito', 30),
  ('ensalada-de-hojas-verdes-con-mejillones-rabanitos-y', 'morron', 0.5),
  ('ensalada-de-hojas-verdes-con-mejillones-rabanitos-y', 'aceto', 10),
  ('ensalada-de-hojas-verdes-con-mejillones-rabanitos-y', 'aceite-oliva', 8),
  ('ensalada-de-repollo-con-jamon-cocido-hinojo-y-tomates', 'repollo', 90),
  ('ensalada-de-repollo-con-jamon-cocido-hinojo-y-tomates', 'jamon-cocido', 70),
  ('ensalada-de-repollo-con-jamon-cocido-hinojo-y-tomates', 'hinojo', 45),
  ('ensalada-de-repollo-con-jamon-cocido-hinojo-y-tomates', 'tomate-cherry', 80),
  ('ensalada-de-repollo-con-jamon-cocido-hinojo-y-tomates', 'tahini', 15),
  ('ensalada-de-repollo-con-jamon-cocido-hinojo-y-tomates', 'limon-exprimido', 15),
  ('ensalada-de-rucula-con-huevo-duro-tomate-y-tomates', 'rucula', 60),
  ('ensalada-de-rucula-con-huevo-duro-tomate-y-tomates', 'huevo', 2),
  ('ensalada-de-rucula-con-huevo-duro-tomate-y-tomates', 'tomate', 1),
  ('ensalada-de-rucula-con-huevo-duro-tomate-y-tomates', 'tomate-cherry', 80),
  ('ensalada-de-rucula-con-huevo-duro-tomate-y-tomates', 'aderezo-cesar', 20),
  ('ensalada-de-rucula-con-queso-cremoso-aceitunas-y-naranja', 'rucula', 60),
  ('ensalada-de-rucula-con-queso-cremoso-aceitunas-y-naranja', 'queso-cremoso', 80),
  ('ensalada-de-rucula-con-queso-cremoso-aceitunas-y-naranja', 'aceitunas', 20),
  ('ensalada-de-rucula-con-queso-cremoso-aceitunas-y-naranja', 'naranja', 0.5),
  ('ensalada-de-rucula-con-queso-cremoso-aceitunas-y-naranja', 'aceto', 10),
  ('ensalada-de-rucula-con-queso-cremoso-aceitunas-y-naranja', 'aceite-oliva', 8),
  ('ensalada-de-rucula-con-porotos-negros-apio-y-rabanitos', 'rucula', 60),
  ('ensalada-de-rucula-con-porotos-negros-apio-y-rabanitos', 'porotos-negros-hervidos', 130),
  ('ensalada-de-rucula-con-porotos-negros-apio-y-rabanitos', 'apio', 35),
  ('ensalada-de-rucula-con-porotos-negros-apio-y-rabanitos', 'rabanito', 30),
  ('ensalada-de-rucula-con-porotos-negros-apio-y-rabanitos', 'yogur-natural', 45),
  ('ensalada-de-rucula-con-porotos-negros-apio-y-rabanitos', 'mostaza-antigua', 6),
  ('ensalada-de-berro-con-bife-de-nalga-pepino-y-parmesano', 'berro', 55),
  ('ensalada-de-berro-con-bife-de-nalga-pepino-y-parmesano', 'bife-nalga', 150),
  ('ensalada-de-berro-con-bife-de-nalga-pepino-y-parmesano', 'pepino', 0.5),
  ('ensalada-de-berro-con-bife-de-nalga-pepino-y-parmesano', 'parmesano', 15),
  ('ensalada-de-berro-con-bife-de-nalga-pepino-y-parmesano', 'yogur-natural', 45),
  ('ensalada-de-berro-con-bife-de-nalga-pepino-y-parmesano', 'mostaza-antigua', 6),
  ('ensalada-de-berro-con-bife-de-nalga-pepino-y-parmesano', 'aceite', 4),
  ('ensalada-de-repollo-colorado-con-huevo-duro-croutons-y', 'repollo-colorado', 90),
  ('ensalada-de-repollo-colorado-con-huevo-duro-croutons-y', 'huevo', 2),
  ('ensalada-de-repollo-colorado-con-huevo-duro-croutons-y', 'croutons', 20),
  ('ensalada-de-repollo-colorado-con-huevo-duro-croutons-y', 'aceitunas', 20),
  ('ensalada-de-repollo-colorado-con-huevo-duro-croutons-y', 'mostaza', 8),
  ('ensalada-de-repollo-colorado-con-huevo-duro-croutons-y', 'miel', 8),
  ('ensalada-de-repollo-colorado-con-huevo-duro-croutons-y', 'aceite-oliva', 8),
  ('ensalada-de-repollo-colorado-con-huevo-duro-croutons-y', 'vinagre-manzana', 5),
  ('ensalada-de-kale-con-jamon-cocido-rabanitos-y-palmitos', 'kale', 55),
  ('ensalada-de-kale-con-jamon-cocido-rabanitos-y-palmitos', 'jamon-cocido', 70),
  ('ensalada-de-kale-con-jamon-cocido-rabanitos-y-palmitos', 'rabanito', 30),
  ('ensalada-de-kale-con-jamon-cocido-rabanitos-y-palmitos', 'palmitos', 45),
  ('ensalada-de-kale-con-jamon-cocido-rabanitos-y-palmitos', 'aceto', 10),
  ('ensalada-de-kale-con-jamon-cocido-rabanitos-y-palmitos', 'aceite-oliva', 8),
  ('ensalada-de-radicheta-con-edamame-palmitos-y-tomate', 'radicheta', 55),
  ('ensalada-de-radicheta-con-edamame-palmitos-y-tomate', 'edamame', 100),
  ('ensalada-de-radicheta-con-edamame-palmitos-y-tomate', 'palmitos', 45),
  ('ensalada-de-radicheta-con-edamame-palmitos-y-tomate', 'tomate', 1),
  ('ensalada-de-radicheta-con-edamame-palmitos-y-tomate', 'pesto', 20),
  ('ensalada-de-radicheta-con-alubias-pepino-y-cebolla', 'radicheta', 55),
  ('ensalada-de-radicheta-con-alubias-pepino-y-cebolla', 'alubias', 130),
  ('ensalada-de-radicheta-con-alubias-pepino-y-cebolla', 'pepino', 0.5),
  ('ensalada-de-radicheta-con-alubias-pepino-y-cebolla', 'cebolla-morada', 0.5),
  ('ensalada-de-radicheta-con-alubias-pepino-y-cebolla', 'aceto', 10),
  ('ensalada-de-radicheta-con-alubias-pepino-y-cebolla', 'aceite-oliva', 8),
  ('ensalada-de-kale-con-jamon-crudo-remolacha-y-palmitos', 'kale', 55),
  ('ensalada-de-kale-con-jamon-crudo-remolacha-y-palmitos', 'jamon-crudo', 45),
  ('ensalada-de-kale-con-jamon-crudo-remolacha-y-palmitos', 'remolacha-cocida', 70),
  ('ensalada-de-kale-con-jamon-crudo-remolacha-y-palmitos', 'palmitos', 45),
  ('ensalada-de-kale-con-jamon-crudo-remolacha-y-palmitos', 'yogur-natural', 45),
  ('ensalada-de-kale-con-jamon-crudo-remolacha-y-palmitos', 'mostaza-antigua', 6),
  ('ensalada-de-radicheta-con-porotos-negros-remolacha-y', 'radicheta', 55),
  ('ensalada-de-radicheta-con-porotos-negros-remolacha-y', 'porotos-negros-hervidos', 130),
  ('ensalada-de-radicheta-con-porotos-negros-remolacha-y', 'remolacha-cocida', 70),
  ('ensalada-de-radicheta-con-porotos-negros-remolacha-y', 'palmitos', 45),
  ('ensalada-de-radicheta-con-porotos-negros-remolacha-y', 'yogur-natural', 45),
  ('ensalada-de-radicheta-con-porotos-negros-remolacha-y', 'limon-exprimido', 10),
  ('ensalada-de-radicheta-con-jamon-cocido-parmesano-y-apio', 'radicheta', 55),
  ('ensalada-de-radicheta-con-jamon-cocido-parmesano-y-apio', 'jamon-cocido', 70),
  ('ensalada-de-radicheta-con-jamon-cocido-parmesano-y-apio', 'parmesano', 15),
  ('ensalada-de-radicheta-con-jamon-cocido-parmesano-y-apio', 'apio', 35),
  ('ensalada-de-radicheta-con-jamon-cocido-parmesano-y-apio', 'aderezo-cesar', 20),
  ('ensalada-de-hojas-verdes-con-queso-feta-apio-y-frutillas', 'hojas-verdes', 75),
  ('ensalada-de-hojas-verdes-con-queso-feta-apio-y-frutillas', 'feta', 60),
  ('ensalada-de-hojas-verdes-con-queso-feta-apio-y-frutillas', 'apio', 35),
  ('ensalada-de-hojas-verdes-con-queso-feta-apio-y-frutillas', 'frutilla', 70),
  ('ensalada-de-hojas-verdes-con-queso-feta-apio-y-frutillas', 'aceite-oliva', 8),
  ('ensalada-de-hojas-verdes-con-queso-feta-apio-y-frutillas', 'limon-exprimido', 15),
  ('ensalada-de-espinaca-con-mejillones-aceitunas-y-tomate', 'espinaca', 60),
  ('ensalada-de-espinaca-con-mejillones-aceitunas-y-tomate', 'mejillones', 100),
  ('ensalada-de-espinaca-con-mejillones-aceitunas-y-tomate', 'aceitunas', 20),
  ('ensalada-de-espinaca-con-mejillones-aceitunas-y-tomate', 'tomate', 1),
  ('ensalada-de-espinaca-con-mejillones-aceitunas-y-tomate', 'pesto', 20),
  ('ensalada-de-lechuga-morada-con-garbanzos-remolacha-y', 'lechuga-morada', 70),
  ('ensalada-de-lechuga-morada-con-garbanzos-remolacha-y', 'garbanzos-hervidos', 130),
  ('ensalada-de-lechuga-morada-con-garbanzos-remolacha-y', 'remolacha-cocida', 70),
  ('ensalada-de-lechuga-morada-con-garbanzos-remolacha-y', 'pepino', 0.5),
  ('ensalada-de-lechuga-morada-con-garbanzos-remolacha-y', 'pesto', 20),
  ('ensalada-de-berro-con-pollo-grillado-cebolla-morada-y', 'berro', 55),
  ('ensalada-de-berro-con-pollo-grillado-cebolla-morada-y', 'pechuga-cruda', 150),
  ('ensalada-de-berro-con-pollo-grillado-cebolla-morada-y', 'cebolla-morada', 0.5),
  ('ensalada-de-berro-con-pollo-grillado-cebolla-morada-y', 'aceitunas', 20),
  ('ensalada-de-berro-con-pollo-grillado-cebolla-morada-y', 'tahini', 15),
  ('ensalada-de-berro-con-pollo-grillado-cebolla-morada-y', 'limon-exprimido', 15),
  ('ensalada-de-berro-con-pollo-grillado-cebolla-morada-y', 'aceite', 4),
  ('ensalada-de-lechuga-con-jamon-crudo-parmesano-y-tomate', 'lechuga', 80),
  ('ensalada-de-lechuga-con-jamon-crudo-parmesano-y-tomate', 'jamon-crudo', 45),
  ('ensalada-de-lechuga-con-jamon-crudo-parmesano-y-tomate', 'parmesano', 15),
  ('ensalada-de-lechuga-con-jamon-crudo-parmesano-y-tomate', 'tomate', 1),
  ('ensalada-de-lechuga-con-jamon-crudo-parmesano-y-tomate', 'aceto', 10),
  ('ensalada-de-lechuga-con-jamon-crudo-parmesano-y-tomate', 'aceite-oliva', 8),
  ('ensalada-de-kale-con-pollo-grillado-morron-y-pera', 'kale', 55),
  ('ensalada-de-kale-con-pollo-grillado-morron-y-pera', 'pechuga-cruda', 150),
  ('ensalada-de-kale-con-pollo-grillado-morron-y-pera', 'morron', 0.5),
  ('ensalada-de-kale-con-pollo-grillado-morron-y-pera', 'pera', 0.5),
  ('ensalada-de-kale-con-pollo-grillado-morron-y-pera', 'aceto', 10),
  ('ensalada-de-kale-con-pollo-grillado-morron-y-pera', 'aceite-oliva', 8),
  ('ensalada-de-kale-con-pollo-grillado-morron-y-pera', 'aceite', 4),
  ('ensalada-de-repollo-colorado-con-queso-cremoso-tomate-y', 'repollo-colorado', 90),
  ('ensalada-de-repollo-colorado-con-queso-cremoso-tomate-y', 'queso-cremoso', 80),
  ('ensalada-de-repollo-colorado-con-queso-cremoso-tomate-y', 'tomate', 1),
  ('ensalada-de-repollo-colorado-con-queso-cremoso-tomate-y', 'remolacha-cocida', 70),
  ('ensalada-de-repollo-colorado-con-queso-cremoso-tomate-y', 'tahini', 15),
  ('ensalada-de-repollo-colorado-con-queso-cremoso-tomate-y', 'limon-exprimido', 15),
  ('ensalada-de-rucula-con-pollo-grillado-brotes-de-soja-y', 'rucula', 60),
  ('ensalada-de-rucula-con-pollo-grillado-brotes-de-soja-y', 'pechuga-cruda', 150),
  ('ensalada-de-rucula-con-pollo-grillado-brotes-de-soja-y', 'brotes-soja', 30),
  ('ensalada-de-rucula-con-pollo-grillado-brotes-de-soja-y', 'palmitos', 45),
  ('ensalada-de-rucula-con-pollo-grillado-brotes-de-soja-y', 'yogur-natural', 45),
  ('ensalada-de-rucula-con-pollo-grillado-brotes-de-soja-y', 'limon-exprimido', 10),
  ('ensalada-de-rucula-con-pollo-grillado-brotes-de-soja-y', 'aceite', 4),
  ('ensalada-de-espinaca-con-bife-de-nalga-palta-y-semillas', 'espinaca', 60),
  ('ensalada-de-espinaca-con-bife-de-nalga-palta-y-semillas', 'bife-nalga', 150),
  ('ensalada-de-espinaca-con-bife-de-nalga-palta-y-semillas', 'palta', 0.5),
  ('ensalada-de-espinaca-con-bife-de-nalga-palta-y-semillas', 'semillas-girasol', 10),
  ('ensalada-de-espinaca-con-bife-de-nalga-palta-y-semillas', 'yogur-natural', 45),
  ('ensalada-de-espinaca-con-bife-de-nalga-palta-y-semillas', 'mostaza-antigua', 6),
  ('ensalada-de-espinaca-con-bife-de-nalga-palta-y-semillas', 'aceite', 4),
  ('ensalada-de-escarola-con-tofu-dorado-pepino-y-morron', 'escarola', 65),
  ('ensalada-de-escarola-con-tofu-dorado-pepino-y-morron', 'tofu', 120),
  ('ensalada-de-escarola-con-tofu-dorado-pepino-y-morron', 'pepino', 0.5),
  ('ensalada-de-escarola-con-tofu-dorado-pepino-y-morron', 'morron', 0.5),
  ('ensalada-de-escarola-con-tofu-dorado-pepino-y-morron', 'mostaza', 8),
  ('ensalada-de-escarola-con-tofu-dorado-pepino-y-morron', 'miel', 8),
  ('ensalada-de-escarola-con-tofu-dorado-pepino-y-morron', 'aceite-oliva', 8),
  ('ensalada-de-escarola-con-tofu-dorado-pepino-y-morron', 'vinagre-manzana', 5),
  ('ensalada-de-escarola-con-tofu-dorado-pepino-y-morron', 'aceite', 5),
  ('ensalada-de-repollo-con-bife-de-nalga-arvejas-y', 'repollo', 90),
  ('ensalada-de-repollo-con-bife-de-nalga-arvejas-y', 'bife-nalga', 150),
  ('ensalada-de-repollo-con-bife-de-nalga-arvejas-y', 'arvejas-frescas', 45),
  ('ensalada-de-repollo-con-bife-de-nalga-arvejas-y', 'zanahoria-rallada', 60),
  ('ensalada-de-repollo-con-bife-de-nalga-arvejas-y', 'tahini', 15),
  ('ensalada-de-repollo-con-bife-de-nalga-arvejas-y', 'limon-exprimido', 15),
  ('ensalada-de-repollo-con-bife-de-nalga-arvejas-y', 'aceite', 4),
  ('ensalada-de-kale-con-queso-cremoso-palta-y-cebolla', 'kale', 55),
  ('ensalada-de-kale-con-queso-cremoso-palta-y-cebolla', 'queso-cremoso', 80),
  ('ensalada-de-kale-con-queso-cremoso-palta-y-cebolla', 'palta', 0.5),
  ('ensalada-de-kale-con-queso-cremoso-palta-y-cebolla', 'cebolla-morada', 0.5),
  ('ensalada-de-kale-con-queso-cremoso-palta-y-cebolla', 'aceite-oliva', 8),
  ('ensalada-de-kale-con-queso-cremoso-palta-y-cebolla', 'limon-exprimido', 15),
  ('ensalada-de-hojas-verdes-con-jamon-cocido-cebolla', 'hojas-verdes', 75),
  ('ensalada-de-hojas-verdes-con-jamon-cocido-cebolla', 'jamon-cocido', 70),
  ('ensalada-de-hojas-verdes-con-jamon-cocido-cebolla', 'cebolla-morada', 0.5),
  ('ensalada-de-hojas-verdes-con-jamon-cocido-cebolla', 'parmesano', 15),
  ('ensalada-de-hojas-verdes-con-jamon-cocido-cebolla', 'aceite-oliva', 8),
  ('ensalada-de-hojas-verdes-con-jamon-cocido-cebolla', 'limon-exprimido', 15),
  ('ensalada-de-espinaca-con-langostinos-pasas-de-uva-y', 'espinaca', 60),
  ('ensalada-de-espinaca-con-langostinos-pasas-de-uva-y', 'langostinos', 120),
  ('ensalada-de-espinaca-con-langostinos-pasas-de-uva-y', 'pasas', 15),
  ('ensalada-de-espinaca-con-langostinos-pasas-de-uva-y', 'aceitunas', 20),
  ('ensalada-de-espinaca-con-langostinos-pasas-de-uva-y', 'aceto', 10),
  ('ensalada-de-espinaca-con-langostinos-pasas-de-uva-y', 'aceite-oliva', 8),
  ('ensalada-de-espinaca-con-langostinos-pasas-de-uva-y', 'aceite', 5),
  ('ensalada-de-lechuga-morada-con-bife-de-nalga-palta-y', 'lechuga-morada', 70),
  ('ensalada-de-lechuga-morada-con-bife-de-nalga-palta-y', 'bife-nalga', 150),
  ('ensalada-de-lechuga-morada-con-bife-de-nalga-palta-y', 'palta', 0.5),
  ('ensalada-de-lechuga-morada-con-bife-de-nalga-palta-y', 'tomate', 1),
  ('ensalada-de-lechuga-morada-con-bife-de-nalga-palta-y', 'yogur-natural', 45),
  ('ensalada-de-lechuga-morada-con-bife-de-nalga-palta-y', 'limon-exprimido', 10),
  ('ensalada-de-lechuga-morada-con-bife-de-nalga-palta-y', 'aceite', 4),
  ('ensalada-de-lechuga-morada-con-salmon-ahumado-pepino-y', 'lechuga-morada', 70),
  ('ensalada-de-lechuga-morada-con-salmon-ahumado-pepino-y', 'salmon-ahumado', 60),
  ('ensalada-de-lechuga-morada-con-salmon-ahumado-pepino-y', 'pepino', 0.5),
  ('ensalada-de-lechuga-morada-con-salmon-ahumado-pepino-y', 'apio', 35),
  ('ensalada-de-lechuga-morada-con-salmon-ahumado-pepino-y', 'pesto', 20),
  ('ensalada-de-rucula-con-garbanzos-arvejas-y-rabanitos', 'rucula', 60),
  ('ensalada-de-rucula-con-garbanzos-arvejas-y-rabanitos', 'garbanzos-hervidos', 130),
  ('ensalada-de-rucula-con-garbanzos-arvejas-y-rabanitos', 'arvejas-frescas', 45),
  ('ensalada-de-rucula-con-garbanzos-arvejas-y-rabanitos', 'rabanito', 30),
  ('ensalada-de-rucula-con-garbanzos-arvejas-y-rabanitos', 'pesto', 20),
  ('ensalada-de-repollo-con-pavo-grillado-palmitos-y-morron', 'repollo', 90),
  ('ensalada-de-repollo-con-pavo-grillado-palmitos-y-morron', 'pechuga-pavo', 150),
  ('ensalada-de-repollo-con-pavo-grillado-palmitos-y-morron', 'palmitos', 45),
  ('ensalada-de-repollo-con-pavo-grillado-palmitos-y-morron', 'morron', 0.5),
  ('ensalada-de-repollo-con-pavo-grillado-palmitos-y-morron', 'yogur-natural', 45),
  ('ensalada-de-repollo-con-pavo-grillado-palmitos-y-morron', 'limon-exprimido', 10),
  ('ensalada-de-repollo-con-pavo-grillado-palmitos-y-morron', 'aceite', 4),
  ('ensalada-de-rucula-con-edamame-palmitos-y-tomate', 'rucula', 60),
  ('ensalada-de-rucula-con-edamame-palmitos-y-tomate', 'edamame', 100),
  ('ensalada-de-rucula-con-edamame-palmitos-y-tomate', 'palmitos', 45),
  ('ensalada-de-rucula-con-edamame-palmitos-y-tomate', 'tomate', 1),
  ('ensalada-de-rucula-con-edamame-palmitos-y-tomate', 'aceite-oliva', 8),
  ('ensalada-de-rucula-con-edamame-palmitos-y-tomate', 'limon-exprimido', 15),
  ('ensalada-de-lechuga-morada-con-atun-brotes-de-soja-y', 'lechuga-morada', 70),
  ('ensalada-de-lechuga-morada-con-atun-brotes-de-soja-y', 'atun-natural', 1),
  ('ensalada-de-lechuga-morada-con-atun-brotes-de-soja-y', 'brotes-soja', 30),
  ('ensalada-de-lechuga-morada-con-atun-brotes-de-soja-y', 'arvejas-frescas', 45),
  ('ensalada-de-lechuga-morada-con-atun-brotes-de-soja-y', 'yogur-natural', 45),
  ('ensalada-de-lechuga-morada-con-atun-brotes-de-soja-y', 'mostaza-antigua', 6),
  ('ensalada-de-lechuga-con-jamon-cocido-parmesano-y-pepino', 'lechuga', 80),
  ('ensalada-de-lechuga-con-jamon-cocido-parmesano-y-pepino', 'jamon-cocido', 70),
  ('ensalada-de-lechuga-con-jamon-cocido-parmesano-y-pepino', 'parmesano', 15),
  ('ensalada-de-lechuga-con-jamon-cocido-parmesano-y-pepino', 'pepino', 0.5),
  ('ensalada-de-lechuga-con-jamon-cocido-parmesano-y-pepino', 'mostaza', 8),
  ('ensalada-de-lechuga-con-jamon-cocido-parmesano-y-pepino', 'miel', 8),
  ('ensalada-de-lechuga-con-jamon-cocido-parmesano-y-pepino', 'aceite-oliva', 8),
  ('ensalada-de-lechuga-con-jamon-cocido-parmesano-y-pepino', 'vinagre-manzana', 5),
  ('ensalada-de-radicheta-con-queso-de-cabra-palta-y', 'radicheta', 55),
  ('ensalada-de-radicheta-con-queso-de-cabra-palta-y', 'queso-cabra', 60),
  ('ensalada-de-radicheta-con-queso-de-cabra-palta-y', 'palta', 0.5),
  ('ensalada-de-radicheta-con-queso-de-cabra-palta-y', 'remolacha-cocida', 70),
  ('ensalada-de-radicheta-con-queso-de-cabra-palta-y', 'aceite-oliva', 8),
  ('ensalada-de-radicheta-con-queso-de-cabra-palta-y', 'limon-exprimido', 15),
  ('ensalada-de-berro-con-pavo-grillado-pepino-y-cebolla', 'berro', 55),
  ('ensalada-de-berro-con-pavo-grillado-pepino-y-cebolla', 'pechuga-pavo', 150),
  ('ensalada-de-berro-con-pavo-grillado-pepino-y-cebolla', 'pepino', 0.5),
  ('ensalada-de-berro-con-pavo-grillado-pepino-y-cebolla', 'cebolla-morada', 0.5),
  ('ensalada-de-berro-con-pavo-grillado-pepino-y-cebolla', 'aceto', 10),
  ('ensalada-de-berro-con-pavo-grillado-pepino-y-cebolla', 'aceite-oliva', 8),
  ('ensalada-de-berro-con-pavo-grillado-pepino-y-cebolla', 'aceite', 4),
  ('ensalada-de-lechuga-con-queso-feta-croutons-y-zanahoria', 'lechuga', 80),
  ('ensalada-de-lechuga-con-queso-feta-croutons-y-zanahoria', 'feta', 60),
  ('ensalada-de-lechuga-con-queso-feta-croutons-y-zanahoria', 'croutons', 20),
  ('ensalada-de-lechuga-con-queso-feta-croutons-y-zanahoria', 'zanahoria', 1),
  ('ensalada-de-lechuga-con-queso-feta-croutons-y-zanahoria', 'yogur-natural', 45),
  ('ensalada-de-lechuga-con-queso-feta-croutons-y-zanahoria', 'mostaza-antigua', 6),
  ('ensalada-de-escarola-con-garbanzos-cebolla-morada-y', 'escarola', 65),
  ('ensalada-de-escarola-con-garbanzos-cebolla-morada-y', 'garbanzos-hervidos', 130),
  ('ensalada-de-escarola-con-garbanzos-cebolla-morada-y', 'cebolla-morada', 0.5),
  ('ensalada-de-escarola-con-garbanzos-cebolla-morada-y', 'zanahoria-rallada', 60),
  ('ensalada-de-escarola-con-garbanzos-cebolla-morada-y', 'aderezo-cesar', 20),
  ('ensalada-de-kale-con-edamame-arvejas-y-pepino', 'kale', 55),
  ('ensalada-de-kale-con-edamame-arvejas-y-pepino', 'edamame', 100),
  ('ensalada-de-kale-con-edamame-arvejas-y-pepino', 'arvejas-frescas', 45),
  ('ensalada-de-kale-con-edamame-arvejas-y-pepino', 'pepino', 0.5),
  ('ensalada-de-kale-con-edamame-arvejas-y-pepino', 'yogur-natural', 45),
  ('ensalada-de-kale-con-edamame-arvejas-y-pepino', 'limon-exprimido', 10),
  ('ensalada-de-berro-con-queso-feta-zanahoria-y-tomates', 'berro', 55),
  ('ensalada-de-berro-con-queso-feta-zanahoria-y-tomates', 'feta', 60),
  ('ensalada-de-berro-con-queso-feta-zanahoria-y-tomates', 'zanahoria', 1),
  ('ensalada-de-berro-con-queso-feta-zanahoria-y-tomates', 'tomate-cherry', 80),
  ('ensalada-de-berro-con-queso-feta-zanahoria-y-tomates', 'pesto', 20),
  ('ensalada-de-escarola-con-atun-morron-y-choclo', 'escarola', 65),
  ('ensalada-de-escarola-con-atun-morron-y-choclo', 'atun-natural', 1),
  ('ensalada-de-escarola-con-atun-morron-y-choclo', 'morron', 0.5),
  ('ensalada-de-escarola-con-atun-morron-y-choclo', 'choclo', 50),
  ('ensalada-de-escarola-con-atun-morron-y-choclo', 'yogur-natural', 45),
  ('ensalada-de-escarola-con-atun-morron-y-choclo', 'mostaza-antigua', 6),
  ('ensalada-de-radicheta-con-tofu-dorado-aceitunas-y', 'radicheta', 55),
  ('ensalada-de-radicheta-con-tofu-dorado-aceitunas-y', 'tofu', 120),
  ('ensalada-de-radicheta-con-tofu-dorado-aceitunas-y', 'aceitunas', 20),
  ('ensalada-de-radicheta-con-tofu-dorado-aceitunas-y', 'croutons', 20),
  ('ensalada-de-radicheta-con-tofu-dorado-aceitunas-y', 'mostaza', 8),
  ('ensalada-de-radicheta-con-tofu-dorado-aceitunas-y', 'miel', 8),
  ('ensalada-de-radicheta-con-tofu-dorado-aceitunas-y', 'aceite-oliva', 8),
  ('ensalada-de-radicheta-con-tofu-dorado-aceitunas-y', 'vinagre-manzana', 5),
  ('ensalada-de-radicheta-con-tofu-dorado-aceitunas-y', 'aceite', 5),
  ('ensalada-de-berro-con-queso-cremoso-zanahoria-y-uvas', 'berro', 55),
  ('ensalada-de-berro-con-queso-cremoso-zanahoria-y-uvas', 'queso-cremoso', 80),
  ('ensalada-de-berro-con-queso-cremoso-zanahoria-y-uvas', 'zanahoria', 1),
  ('ensalada-de-berro-con-queso-cremoso-zanahoria-y-uvas', 'uva', 60),
  ('ensalada-de-berro-con-queso-cremoso-zanahoria-y-uvas', 'aceto', 10),
  ('ensalada-de-berro-con-queso-cremoso-zanahoria-y-uvas', 'aceite-oliva', 8),
  ('ensalada-de-lechuga-morada-con-edamame-zanahoria-y-palta', 'lechuga-morada', 70),
  ('ensalada-de-lechuga-morada-con-edamame-zanahoria-y-palta', 'edamame', 100),
  ('ensalada-de-lechuga-morada-con-edamame-zanahoria-y-palta', 'zanahoria', 1),
  ('ensalada-de-lechuga-morada-con-edamame-zanahoria-y-palta', 'palta', 0.5),
  ('ensalada-de-lechuga-morada-con-edamame-zanahoria-y-palta', 'pesto', 20),
  ('ensalada-de-repollo-colorado-con-tofu-dorado-remolacha', 'repollo-colorado', 90),
  ('ensalada-de-repollo-colorado-con-tofu-dorado-remolacha', 'tofu', 120),
  ('ensalada-de-repollo-colorado-con-tofu-dorado-remolacha', 'remolacha-cocida', 70),
  ('ensalada-de-repollo-colorado-con-tofu-dorado-remolacha', 'apio', 35),
  ('ensalada-de-repollo-colorado-con-tofu-dorado-remolacha', 'yogur-natural', 45),
  ('ensalada-de-repollo-colorado-con-tofu-dorado-remolacha', 'mostaza-antigua', 6),
  ('ensalada-de-repollo-colorado-con-tofu-dorado-remolacha', 'aceite', 5),
  ('ensalada-de-espinaca-con-tofu-dorado-brotes-de-soja-y', 'espinaca', 60),
  ('ensalada-de-espinaca-con-tofu-dorado-brotes-de-soja-y', 'tofu', 120),
  ('ensalada-de-espinaca-con-tofu-dorado-brotes-de-soja-y', 'brotes-soja', 30),
  ('ensalada-de-espinaca-con-tofu-dorado-brotes-de-soja-y', 'parmesano', 15),
  ('ensalada-de-espinaca-con-tofu-dorado-brotes-de-soja-y', 'mostaza', 8),
  ('ensalada-de-espinaca-con-tofu-dorado-brotes-de-soja-y', 'miel', 8),
  ('ensalada-de-espinaca-con-tofu-dorado-brotes-de-soja-y', 'aceite-oliva', 8),
  ('ensalada-de-espinaca-con-tofu-dorado-brotes-de-soja-y', 'vinagre-manzana', 5),
  ('ensalada-de-espinaca-con-tofu-dorado-brotes-de-soja-y', 'aceite', 5),
  ('ensalada-de-lechuga-con-mejillones-tomate-y-morron', 'lechuga', 80),
  ('ensalada-de-lechuga-con-mejillones-tomate-y-morron', 'mejillones', 100),
  ('ensalada-de-lechuga-con-mejillones-tomate-y-morron', 'tomate', 1),
  ('ensalada-de-lechuga-con-mejillones-tomate-y-morron', 'morron', 0.5),
  ('ensalada-de-lechuga-con-mejillones-tomate-y-morron', 'yogur-natural', 45),
  ('ensalada-de-lechuga-con-mejillones-tomate-y-morron', 'mostaza-antigua', 6),
  ('ensalada-de-hojas-verdes-con-pavo-grillado-palta-y', 'hojas-verdes', 75),
  ('ensalada-de-hojas-verdes-con-pavo-grillado-palta-y', 'pechuga-pavo', 150),
  ('ensalada-de-hojas-verdes-con-pavo-grillado-palta-y', 'palta', 0.5),
  ('ensalada-de-hojas-verdes-con-pavo-grillado-palta-y', 'brotes-soja', 30),
  ('ensalada-de-hojas-verdes-con-pavo-grillado-palta-y', 'aceto', 10),
  ('ensalada-de-hojas-verdes-con-pavo-grillado-palta-y', 'aceite-oliva', 8),
  ('ensalada-de-hojas-verdes-con-pavo-grillado-palta-y', 'aceite', 4),
  ('ensalada-de-escarola-con-lentejas-arvejas-y-tomate', 'escarola', 65),
  ('ensalada-de-escarola-con-lentejas-arvejas-y-tomate', 'lentejas-hervidas', 130),
  ('ensalada-de-escarola-con-lentejas-arvejas-y-tomate', 'arvejas-frescas', 45),
  ('ensalada-de-escarola-con-lentejas-arvejas-y-tomate', 'tomate', 1),
  ('ensalada-de-escarola-con-lentejas-arvejas-y-tomate', 'aceto', 10),
  ('ensalada-de-escarola-con-lentejas-arvejas-y-tomate', 'aceite-oliva', 8),
  ('wok-de-langostinos-con-salsa-de-mani-con-mix-de', 'langostinos', 130),
  ('wok-de-langostinos-con-salsa-de-mani-con-mix-de', 'verduras-wok', 220),
  ('wok-de-langostinos-con-salsa-de-mani-con-mix-de', 'quinoa', 55),
  ('wok-de-langostinos-con-salsa-de-mani-con-mix-de', 'mani-pasta', 20),
  ('wok-de-langostinos-con-salsa-de-mani-con-mix-de', 'salsa-soja', 10),
  ('wok-de-langostinos-con-salsa-de-mani-con-mix-de', 'limon-exprimido', 10),
  ('wok-de-langostinos-con-salsa-de-mani-con-mix-de', 'aceite', 10),
  ('wok-de-langostinos-con-salsa-de-mani-con-mix-de', 'ajo', 1),
  ('wok-de-langostinos-con-salsa-de-mani-con-mix-de', 'sesamo', 4),
  ('salteado-de-cuadril-agridulce-con-brocoli-y-morron', 'cuadril', 150),
  ('salteado-de-cuadril-agridulce-con-brocoli-y-morron', 'brocoli', 110),
  ('salteado-de-cuadril-agridulce-con-brocoli-y-morron', 'morron', 0.5),
  ('salteado-de-cuadril-agridulce-con-brocoli-y-morron', 'arroz-basmati', 65),
  ('salteado-de-cuadril-agridulce-con-brocoli-y-morron', 'ketchup', 15),
  ('salteado-de-cuadril-agridulce-con-brocoli-y-morron', 'salsa-soja', 10),
  ('salteado-de-cuadril-agridulce-con-brocoli-y-morron', 'vinagre-manzana', 8),
  ('salteado-de-cuadril-agridulce-con-brocoli-y-morron', 'azucar', 5),
  ('salteado-de-cuadril-agridulce-con-brocoli-y-morron', 'aceite', 10),
  ('salteado-de-cuadril-agridulce-con-brocoli-y-morron', 'ajo', 1),
  ('salteado-de-cuadril-agridulce-con-brocoli-y-morron', 'sesamo', 4),
  ('wok-de-pavo-con-miel-y-soja-con-coliflor-y-zanahoria', 'pechuga-pavo', 150),
  ('wok-de-pavo-con-miel-y-soja-con-coliflor-y-zanahoria', 'coliflor', 100),
  ('wok-de-pavo-con-miel-y-soja-con-coliflor-y-zanahoria', 'zanahoria', 1),
  ('wok-de-pavo-con-miel-y-soja-con-coliflor-y-zanahoria', 'cebolla', 0.5),
  ('wok-de-pavo-con-miel-y-soja-con-coliflor-y-zanahoria', 'arroz', 65),
  ('wok-de-pavo-con-miel-y-soja-con-coliflor-y-zanahoria', 'salsa-soja', 15),
  ('wok-de-pavo-con-miel-y-soja-con-coliflor-y-zanahoria', 'miel', 8),
  ('wok-de-pavo-con-miel-y-soja-con-coliflor-y-zanahoria', 'aceite', 10),
  ('wok-de-pavo-con-miel-y-soja-con-coliflor-y-zanahoria', 'ajo', 1),
  ('wok-de-pavo-con-miel-y-soja-con-coliflor-y-zanahoria', 'sesamo', 4),
  ('wok-de-pavo-al-teriyaki-con-champinones-espinaca-y', 'pechuga-pavo', 150),
  ('wok-de-pavo-al-teriyaki-con-champinones-espinaca-y', 'champinones', 90),
  ('wok-de-pavo-al-teriyaki-con-champinones-espinaca-y', 'espinaca', 50),
  ('wok-de-pavo-al-teriyaki-con-champinones-espinaca-y', 'cebolla', 0.5),
  ('wok-de-pavo-al-teriyaki-con-champinones-espinaca-y', 'salsa-teriyaki', 30),
  ('wok-de-pavo-al-teriyaki-con-champinones-espinaca-y', 'aceite', 10),
  ('wok-de-pavo-al-teriyaki-con-champinones-espinaca-y', 'ajo', 1),
  ('wok-de-pavo-al-teriyaki-con-champinones-espinaca-y', 'sesamo', 4),
  ('salteado-de-pollo-picante-con-kale-y-champinones-sobre', 'pechuga-cruda', 150),
  ('salteado-de-pollo-picante-con-kale-y-champinones-sobre', 'kale', 60),
  ('salteado-de-pollo-picante-con-kale-y-champinones-sobre', 'champinones', 90),
  ('salteado-de-pollo-picante-con-kale-y-champinones-sobre', 'cebolla', 0.5),
  ('salteado-de-pollo-picante-con-kale-y-champinones-sobre', 'cuscus', 60),
  ('salteado-de-pollo-picante-con-kale-y-champinones-sobre', 'salsa-soja', 10),
  ('salteado-de-pollo-picante-con-kale-y-champinones-sobre', 'salsa-picante', 10),
  ('salteado-de-pollo-picante-con-kale-y-champinones-sobre', 'miel', 5),
  ('salteado-de-pollo-picante-con-kale-y-champinones-sobre', 'aceite', 10),
  ('salteado-de-pollo-picante-con-kale-y-champinones-sobre', 'ajo', 1),
  ('salteado-de-pollo-picante-con-kale-y-champinones-sobre', 'sesamo', 4),
  ('wok-de-tofu-con-miso-con-repollo-zanahoria-y-brotes-de', 'tofu', 130),
  ('wok-de-tofu-con-miso-con-repollo-zanahoria-y-brotes-de', 'repollo', 80),
  ('wok-de-tofu-con-miso-con-repollo-zanahoria-y-brotes-de', 'zanahoria', 0.5),
  ('wok-de-tofu-con-miso-con-repollo-zanahoria-y-brotes-de', 'brotes-soja', 40),
  ('wok-de-tofu-con-miso-con-repollo-zanahoria-y-brotes-de', 'fideos', 70),
  ('wok-de-tofu-con-miso-con-repollo-zanahoria-y-brotes-de', 'pasta-miso', 10),
  ('wok-de-tofu-con-miso-con-repollo-zanahoria-y-brotes-de', 'vinagre-manzana', 5),
  ('wok-de-tofu-con-miso-con-repollo-zanahoria-y-brotes-de', 'aceite', 10),
  ('wok-de-tofu-con-miso-con-repollo-zanahoria-y-brotes-de', 'ajo', 1),
  ('wok-de-tofu-con-miso-con-repollo-zanahoria-y-brotes-de', 'sesamo', 4),
  ('wok-de-salmon-con-miso-con-repollo-colorado-zanahoria-y', 'salmon', 140),
  ('wok-de-salmon-con-miso-con-repollo-colorado-zanahoria-y', 'repollo-colorado', 80),
  ('wok-de-salmon-con-miso-con-repollo-colorado-zanahoria-y', 'zanahoria', 0.5),
  ('wok-de-salmon-con-miso-con-repollo-colorado-zanahoria-y', 'apio', 40),
  ('wok-de-salmon-con-miso-con-repollo-colorado-zanahoria-y', 'fideos', 70),
  ('wok-de-salmon-con-miso-con-repollo-colorado-zanahoria-y', 'pasta-miso', 10),
  ('wok-de-salmon-con-miso-con-repollo-colorado-zanahoria-y', 'vinagre-manzana', 5),
  ('wok-de-salmon-con-miso-con-repollo-colorado-zanahoria-y', 'aceite', 10),
  ('wok-de-salmon-con-miso-con-repollo-colorado-zanahoria-y', 'ajo', 1),
  ('wok-de-salmon-con-miso-con-repollo-colorado-zanahoria-y', 'sesamo', 4),
  ('wok-de-salmon-al-teriyaki-con-coliflor-y-zanahoria', 'salmon', 140),
  ('wok-de-salmon-al-teriyaki-con-coliflor-y-zanahoria', 'coliflor', 100),
  ('wok-de-salmon-al-teriyaki-con-coliflor-y-zanahoria', 'zanahoria', 1),
  ('wok-de-salmon-al-teriyaki-con-coliflor-y-zanahoria', 'cebolla', 0.5),
  ('wok-de-salmon-al-teriyaki-con-coliflor-y-zanahoria', 'fideos', 70),
  ('wok-de-salmon-al-teriyaki-con-coliflor-y-zanahoria', 'salsa-teriyaki', 30),
  ('wok-de-salmon-al-teriyaki-con-coliflor-y-zanahoria', 'aceite', 10),
  ('wok-de-salmon-al-teriyaki-con-coliflor-y-zanahoria', 'ajo', 1),
  ('wok-de-salmon-al-teriyaki-con-coliflor-y-zanahoria', 'sesamo', 4),
  ('wok-de-cerdo-con-miso-con-kale-y-champinones-sobre', 'lomo-cerdo', 150),
  ('wok-de-cerdo-con-miso-con-kale-y-champinones-sobre', 'kale', 60),
  ('wok-de-cerdo-con-miso-con-kale-y-champinones-sobre', 'champinones', 90),
  ('wok-de-cerdo-con-miso-con-kale-y-champinones-sobre', 'cebolla', 0.5),
  ('wok-de-cerdo-con-miso-con-kale-y-champinones-sobre', 'fideos', 70),
  ('wok-de-cerdo-con-miso-con-kale-y-champinones-sobre', 'pasta-miso', 10),
  ('wok-de-cerdo-con-miso-con-kale-y-champinones-sobre', 'vinagre-manzana', 5),
  ('wok-de-cerdo-con-miso-con-kale-y-champinones-sobre', 'aceite', 10),
  ('wok-de-cerdo-con-miso-con-kale-y-champinones-sobre', 'ajo', 1),
  ('wok-de-cerdo-con-miso-con-kale-y-champinones-sobre', 'sesamo', 4),
  ('salteado-de-pavo-al-limon-con-coliflor-y-zanahoria', 'pechuga-pavo', 150),
  ('salteado-de-pavo-al-limon-con-coliflor-y-zanahoria', 'coliflor', 100),
  ('salteado-de-pavo-al-limon-con-coliflor-y-zanahoria', 'zanahoria', 1),
  ('salteado-de-pavo-al-limon-con-coliflor-y-zanahoria', 'cebolla', 0.5),
  ('salteado-de-pavo-al-limon-con-coliflor-y-zanahoria', 'fideos-arroz', 60),
  ('salteado-de-pavo-al-limon-con-coliflor-y-zanahoria', 'salsa-soja', 10),
  ('salteado-de-pavo-al-limon-con-coliflor-y-zanahoria', 'limon-exprimido', 20),
  ('salteado-de-pavo-al-limon-con-coliflor-y-zanahoria', 'miel', 5),
  ('salteado-de-pavo-al-limon-con-coliflor-y-zanahoria', 'aceite', 10),
  ('salteado-de-pavo-al-limon-con-coliflor-y-zanahoria', 'ajo', 1),
  ('salteado-de-pavo-al-limon-con-coliflor-y-zanahoria', 'sesamo', 4),
  ('wok-de-salmon-al-teriyaki-con-chauchas-zanahoria-y', 'salmon', 140),
  ('wok-de-salmon-al-teriyaki-con-chauchas-zanahoria-y', 'chauchas', 80),
  ('wok-de-salmon-al-teriyaki-con-chauchas-zanahoria-y', 'zanahoria', 0.5),
  ('wok-de-salmon-al-teriyaki-con-chauchas-zanahoria-y', 'repollo', 70),
  ('wok-de-salmon-al-teriyaki-con-chauchas-zanahoria-y', 'arroz', 65),
  ('wok-de-salmon-al-teriyaki-con-chauchas-zanahoria-y', 'salsa-teriyaki', 30),
  ('wok-de-salmon-al-teriyaki-con-chauchas-zanahoria-y', 'aceite', 10),
  ('wok-de-salmon-al-teriyaki-con-chauchas-zanahoria-y', 'ajo', 1),
  ('wok-de-salmon-al-teriyaki-con-chauchas-zanahoria-y', 'sesamo', 4),
  ('wok-de-cuadril-agridulce-con-zanahoria-arvejas-y-choclo', 'cuadril', 150),
  ('wok-de-cuadril-agridulce-con-zanahoria-arvejas-y-choclo', 'zanahoria', 1),
  ('wok-de-cuadril-agridulce-con-zanahoria-arvejas-y-choclo', 'arvejas-frescas', 50),
  ('wok-de-cuadril-agridulce-con-zanahoria-arvejas-y-choclo', 'choclo', 50),
  ('wok-de-cuadril-agridulce-con-zanahoria-arvejas-y-choclo', 'quinoa', 55),
  ('wok-de-cuadril-agridulce-con-zanahoria-arvejas-y-choclo', 'ketchup', 15),
  ('wok-de-cuadril-agridulce-con-zanahoria-arvejas-y-choclo', 'salsa-soja', 10),
  ('wok-de-cuadril-agridulce-con-zanahoria-arvejas-y-choclo', 'vinagre-manzana', 8),
  ('wok-de-cuadril-agridulce-con-zanahoria-arvejas-y-choclo', 'azucar', 5),
  ('wok-de-cuadril-agridulce-con-zanahoria-arvejas-y-choclo', 'aceite', 10),
  ('wok-de-cuadril-agridulce-con-zanahoria-arvejas-y-choclo', 'ajo', 1),
  ('wok-de-cuadril-agridulce-con-zanahoria-arvejas-y-choclo', 'sesamo', 4),
  ('wok-de-pollo-picante-con-berenjena-morron-y-cebolla', 'pechuga-cruda', 150),
  ('wok-de-pollo-picante-con-berenjena-morron-y-cebolla', 'berenjena', 0.5),
  ('wok-de-pollo-picante-con-berenjena-morron-y-cebolla', 'morron', 0.5),
  ('wok-de-pollo-picante-con-berenjena-morron-y-cebolla', 'cebolla-morada', 0.5),
  ('wok-de-pollo-picante-con-berenjena-morron-y-cebolla', 'fideos', 70),
  ('wok-de-pollo-picante-con-berenjena-morron-y-cebolla', 'salsa-soja', 10),
  ('wok-de-pollo-picante-con-berenjena-morron-y-cebolla', 'salsa-picante', 10),
  ('wok-de-pollo-picante-con-berenjena-morron-y-cebolla', 'miel', 5),
  ('wok-de-pollo-picante-con-berenjena-morron-y-cebolla', 'aceite', 10),
  ('wok-de-pollo-picante-con-berenjena-morron-y-cebolla', 'ajo', 1),
  ('wok-de-pollo-picante-con-berenjena-morron-y-cebolla', 'sesamo', 4),
  ('salteado-de-cuadril-con-miel-y-soja-con-brocoli-y', 'cuadril', 150),
  ('salteado-de-cuadril-con-miel-y-soja-con-brocoli-y', 'brocoli', 110),
  ('salteado-de-cuadril-con-miel-y-soja-con-brocoli-y', 'morron', 0.5),
  ('salteado-de-cuadril-con-miel-y-soja-con-brocoli-y', 'arroz', 65),
  ('salteado-de-cuadril-con-miel-y-soja-con-brocoli-y', 'salsa-soja', 15),
  ('salteado-de-cuadril-con-miel-y-soja-con-brocoli-y', 'miel', 8),
  ('salteado-de-cuadril-con-miel-y-soja-con-brocoli-y', 'aceite', 10),
  ('salteado-de-cuadril-con-miel-y-soja-con-brocoli-y', 'ajo', 1),
  ('salteado-de-cuadril-con-miel-y-soja-con-brocoli-y', 'sesamo', 4),
  ('wok-de-tempeh-a-la-soja-y-jengibre-con-mix-de-verduras', 'tempeh', 110),
  ('wok-de-tempeh-a-la-soja-y-jengibre-con-mix-de-verduras', 'verduras-wok', 220),
  ('wok-de-tempeh-a-la-soja-y-jengibre-con-mix-de-verduras', 'quinoa', 55),
  ('wok-de-tempeh-a-la-soja-y-jengibre-con-mix-de-verduras', 'salsa-soja', 15),
  ('wok-de-tempeh-a-la-soja-y-jengibre-con-mix-de-verduras', 'jengibre', 6),
  ('wok-de-tempeh-a-la-soja-y-jengibre-con-mix-de-verduras', 'aceite', 10),
  ('wok-de-tempeh-a-la-soja-y-jengibre-con-mix-de-verduras', 'ajo', 1),
  ('wok-de-tempeh-a-la-soja-y-jengibre-con-mix-de-verduras', 'sesamo', 4),
  ('salteado-de-tofu-agridulce-con-chauchas-zanahoria-y', 'tofu', 130),
  ('salteado-de-tofu-agridulce-con-chauchas-zanahoria-y', 'chauchas', 80),
  ('salteado-de-tofu-agridulce-con-chauchas-zanahoria-y', 'zanahoria', 0.5),
  ('salteado-de-tofu-agridulce-con-chauchas-zanahoria-y', 'repollo', 70),
  ('salteado-de-tofu-agridulce-con-chauchas-zanahoria-y', 'cuscus', 60),
  ('salteado-de-tofu-agridulce-con-chauchas-zanahoria-y', 'ketchup', 15),
  ('salteado-de-tofu-agridulce-con-chauchas-zanahoria-y', 'salsa-soja', 10),
  ('salteado-de-tofu-agridulce-con-chauchas-zanahoria-y', 'vinagre-manzana', 8),
  ('salteado-de-tofu-agridulce-con-chauchas-zanahoria-y', 'azucar', 5),
  ('salteado-de-tofu-agridulce-con-chauchas-zanahoria-y', 'aceite', 10),
  ('salteado-de-tofu-agridulce-con-chauchas-zanahoria-y', 'ajo', 1),
  ('salteado-de-tofu-agridulce-con-chauchas-zanahoria-y', 'sesamo', 4),
  ('wok-de-carne-picante-con-brocoli-y-morron-sobre-cuscus', 'bife-nalga', 150),
  ('wok-de-carne-picante-con-brocoli-y-morron-sobre-cuscus', 'brocoli', 110),
  ('wok-de-carne-picante-con-brocoli-y-morron-sobre-cuscus', 'morron', 0.5),
  ('wok-de-carne-picante-con-brocoli-y-morron-sobre-cuscus', 'cuscus', 60),
  ('wok-de-carne-picante-con-brocoli-y-morron-sobre-cuscus', 'salsa-soja', 10),
  ('wok-de-carne-picante-con-brocoli-y-morron-sobre-cuscus', 'salsa-picante', 10),
  ('wok-de-carne-picante-con-brocoli-y-morron-sobre-cuscus', 'miel', 5),
  ('wok-de-carne-picante-con-brocoli-y-morron-sobre-cuscus', 'aceite', 10),
  ('wok-de-carne-picante-con-brocoli-y-morron-sobre-cuscus', 'ajo', 1),
  ('wok-de-carne-picante-con-brocoli-y-morron-sobre-cuscus', 'sesamo', 4),
  ('salteado-de-pollo-agridulce-con-mix-de-verduras-sobre', 'pechuga-cruda', 150),
  ('salteado-de-pollo-agridulce-con-mix-de-verduras-sobre', 'verduras-wok', 220),
  ('salteado-de-pollo-agridulce-con-mix-de-verduras-sobre', 'arroz', 65),
  ('salteado-de-pollo-agridulce-con-mix-de-verduras-sobre', 'ketchup', 15),
  ('salteado-de-pollo-agridulce-con-mix-de-verduras-sobre', 'salsa-soja', 10),
  ('salteado-de-pollo-agridulce-con-mix-de-verduras-sobre', 'vinagre-manzana', 8),
  ('salteado-de-pollo-agridulce-con-mix-de-verduras-sobre', 'azucar', 5),
  ('salteado-de-pollo-agridulce-con-mix-de-verduras-sobre', 'aceite', 10),
  ('salteado-de-pollo-agridulce-con-mix-de-verduras-sobre', 'ajo', 1),
  ('salteado-de-pollo-agridulce-con-mix-de-verduras-sobre', 'sesamo', 4),
  ('wok-de-cerdo-con-miso-con-repollo-zanahoria-y-brotes-de', 'lomo-cerdo', 150),
  ('wok-de-cerdo-con-miso-con-repollo-zanahoria-y-brotes-de', 'repollo', 80),
  ('wok-de-cerdo-con-miso-con-repollo-zanahoria-y-brotes-de', 'zanahoria', 0.5),
  ('wok-de-cerdo-con-miso-con-repollo-zanahoria-y-brotes-de', 'brotes-soja', 40),
  ('wok-de-cerdo-con-miso-con-repollo-zanahoria-y-brotes-de', 'arroz', 65),
  ('wok-de-cerdo-con-miso-con-repollo-zanahoria-y-brotes-de', 'pasta-miso', 10),
  ('wok-de-cerdo-con-miso-con-repollo-zanahoria-y-brotes-de', 'vinagre-manzana', 5),
  ('wok-de-cerdo-con-miso-con-repollo-zanahoria-y-brotes-de', 'aceite', 10),
  ('wok-de-cerdo-con-miso-con-repollo-zanahoria-y-brotes-de', 'ajo', 1),
  ('wok-de-cerdo-con-miso-con-repollo-zanahoria-y-brotes-de', 'sesamo', 4),
  ('salteado-de-pollo-al-teriyaki-con-kale-y-champinones', 'pechuga-cruda', 150),
  ('salteado-de-pollo-al-teriyaki-con-kale-y-champinones', 'kale', 60),
  ('salteado-de-pollo-al-teriyaki-con-kale-y-champinones', 'champinones', 90),
  ('salteado-de-pollo-al-teriyaki-con-kale-y-champinones', 'cebolla', 0.5),
  ('salteado-de-pollo-al-teriyaki-con-kale-y-champinones', 'salsa-teriyaki', 30),
  ('salteado-de-pollo-al-teriyaki-con-kale-y-champinones', 'aceite', 10),
  ('salteado-de-pollo-al-teriyaki-con-kale-y-champinones', 'ajo', 1),
  ('salteado-de-pollo-al-teriyaki-con-kale-y-champinones', 'sesamo', 4),
  ('wok-de-tempeh-a-la-soja-y-jengibre-con-brocoli-y-morron', 'tempeh', 110),
  ('wok-de-tempeh-a-la-soja-y-jengibre-con-brocoli-y-morron', 'brocoli', 110),
  ('wok-de-tempeh-a-la-soja-y-jengibre-con-brocoli-y-morron', 'morron', 0.5),
  ('wok-de-tempeh-a-la-soja-y-jengibre-con-brocoli-y-morron', 'arroz', 65),
  ('wok-de-tempeh-a-la-soja-y-jengibre-con-brocoli-y-morron', 'salsa-soja', 15),
  ('wok-de-tempeh-a-la-soja-y-jengibre-con-brocoli-y-morron', 'jengibre', 6),
  ('wok-de-tempeh-a-la-soja-y-jengibre-con-brocoli-y-morron', 'aceite', 10),
  ('wok-de-tempeh-a-la-soja-y-jengibre-con-brocoli-y-morron', 'ajo', 1),
  ('wok-de-tempeh-a-la-soja-y-jengibre-con-brocoli-y-morron', 'sesamo', 4),
  ('wok-de-langostinos-agridulce-con-mix-de-verduras-sobre', 'langostinos', 130),
  ('wok-de-langostinos-agridulce-con-mix-de-verduras-sobre', 'verduras-wok', 220),
  ('wok-de-langostinos-agridulce-con-mix-de-verduras-sobre', 'arroz-integral', 65),
  ('wok-de-langostinos-agridulce-con-mix-de-verduras-sobre', 'ketchup', 15),
  ('wok-de-langostinos-agridulce-con-mix-de-verduras-sobre', 'salsa-soja', 10),
  ('wok-de-langostinos-agridulce-con-mix-de-verduras-sobre', 'vinagre-manzana', 8),
  ('wok-de-langostinos-agridulce-con-mix-de-verduras-sobre', 'azucar', 5),
  ('wok-de-langostinos-agridulce-con-mix-de-verduras-sobre', 'aceite', 10),
  ('wok-de-langostinos-agridulce-con-mix-de-verduras-sobre', 'ajo', 1),
  ('wok-de-langostinos-agridulce-con-mix-de-verduras-sobre', 'sesamo', 4),
  ('wok-de-carne-al-teriyaki-con-chauchas-zanahoria-y', 'bife-nalga', 150),
  ('wok-de-carne-al-teriyaki-con-chauchas-zanahoria-y', 'chauchas', 80),
  ('wok-de-carne-al-teriyaki-con-chauchas-zanahoria-y', 'zanahoria', 0.5),
  ('wok-de-carne-al-teriyaki-con-chauchas-zanahoria-y', 'repollo', 70),
  ('wok-de-carne-al-teriyaki-con-chauchas-zanahoria-y', 'cuscus', 60),
  ('wok-de-carne-al-teriyaki-con-chauchas-zanahoria-y', 'salsa-teriyaki', 30),
  ('wok-de-carne-al-teriyaki-con-chauchas-zanahoria-y', 'aceite', 10),
  ('wok-de-carne-al-teriyaki-con-chauchas-zanahoria-y', 'ajo', 1),
  ('wok-de-carne-al-teriyaki-con-chauchas-zanahoria-y', 'sesamo', 4),
  ('wok-de-salmon-a-la-soja-y-jengibre-con-coliflor-y', 'salmon', 140),
  ('wok-de-salmon-a-la-soja-y-jengibre-con-coliflor-y', 'coliflor', 100),
  ('wok-de-salmon-a-la-soja-y-jengibre-con-coliflor-y', 'zanahoria', 1),
  ('wok-de-salmon-a-la-soja-y-jengibre-con-coliflor-y', 'cebolla', 0.5),
  ('wok-de-salmon-a-la-soja-y-jengibre-con-coliflor-y', 'salsa-soja', 15),
  ('wok-de-salmon-a-la-soja-y-jengibre-con-coliflor-y', 'jengibre', 6),
  ('wok-de-salmon-a-la-soja-y-jengibre-con-coliflor-y', 'aceite', 10),
  ('wok-de-salmon-a-la-soja-y-jengibre-con-coliflor-y', 'ajo', 1),
  ('wok-de-salmon-a-la-soja-y-jengibre-con-coliflor-y', 'sesamo', 4),
  ('wok-de-cerdo-picante-con-chauchas-zanahoria-y-repollo', 'lomo-cerdo', 150),
  ('wok-de-cerdo-picante-con-chauchas-zanahoria-y-repollo', 'chauchas', 80),
  ('wok-de-cerdo-picante-con-chauchas-zanahoria-y-repollo', 'zanahoria', 0.5),
  ('wok-de-cerdo-picante-con-chauchas-zanahoria-y-repollo', 'repollo', 70),
  ('wok-de-cerdo-picante-con-chauchas-zanahoria-y-repollo', 'fideos', 70),
  ('wok-de-cerdo-picante-con-chauchas-zanahoria-y-repollo', 'salsa-soja', 10),
  ('wok-de-cerdo-picante-con-chauchas-zanahoria-y-repollo', 'salsa-picante', 10),
  ('wok-de-cerdo-picante-con-chauchas-zanahoria-y-repollo', 'miel', 5),
  ('wok-de-cerdo-picante-con-chauchas-zanahoria-y-repollo', 'aceite', 10),
  ('wok-de-cerdo-picante-con-chauchas-zanahoria-y-repollo', 'ajo', 1),
  ('wok-de-cerdo-picante-con-chauchas-zanahoria-y-repollo', 'sesamo', 4),
  ('salteado-de-pollo-con-miso-con-mix-de-verduras-sobre', 'pechuga-cruda', 150),
  ('salteado-de-pollo-con-miso-con-mix-de-verduras-sobre', 'verduras-wok', 220),
  ('salteado-de-pollo-con-miso-con-mix-de-verduras-sobre', 'fideos', 70),
  ('salteado-de-pollo-con-miso-con-mix-de-verduras-sobre', 'pasta-miso', 10),
  ('salteado-de-pollo-con-miso-con-mix-de-verduras-sobre', 'vinagre-manzana', 5),
  ('salteado-de-pollo-con-miso-con-mix-de-verduras-sobre', 'aceite', 10),
  ('salteado-de-pollo-con-miso-con-mix-de-verduras-sobre', 'ajo', 1),
  ('salteado-de-pollo-con-miso-con-mix-de-verduras-sobre', 'sesamo', 4),
  ('wok-de-calamar-picante-con-brocoli-y-morron-sobre-arroz', 'calamar', 150),
  ('wok-de-calamar-picante-con-brocoli-y-morron-sobre-arroz', 'brocoli', 110),
  ('wok-de-calamar-picante-con-brocoli-y-morron-sobre-arroz', 'morron', 0.5),
  ('wok-de-calamar-picante-con-brocoli-y-morron-sobre-arroz', 'arroz', 65),
  ('wok-de-calamar-picante-con-brocoli-y-morron-sobre-arroz', 'salsa-soja', 10),
  ('wok-de-calamar-picante-con-brocoli-y-morron-sobre-arroz', 'salsa-picante', 10),
  ('wok-de-calamar-picante-con-brocoli-y-morron-sobre-arroz', 'miel', 5),
  ('wok-de-calamar-picante-con-brocoli-y-morron-sobre-arroz', 'aceite', 10),
  ('wok-de-calamar-picante-con-brocoli-y-morron-sobre-arroz', 'ajo', 1),
  ('wok-de-calamar-picante-con-brocoli-y-morron-sobre-arroz', 'sesamo', 4),
  ('wok-de-tofu-con-miel-y-soja-con-zapallito-morron-y', 'tofu', 130),
  ('wok-de-tofu-con-miel-y-soja-con-zapallito-morron-y', 'zapallito', 0.5),
  ('wok-de-tofu-con-miel-y-soja-con-zapallito-morron-y', 'morron', 0.5),
  ('wok-de-tofu-con-miel-y-soja-con-zapallito-morron-y', 'cebolla', 0.5),
  ('wok-de-tofu-con-miel-y-soja-con-zapallito-morron-y', 'arroz', 65),
  ('wok-de-tofu-con-miel-y-soja-con-zapallito-morron-y', 'salsa-soja', 15),
  ('wok-de-tofu-con-miel-y-soja-con-zapallito-morron-y', 'miel', 8),
  ('wok-de-tofu-con-miel-y-soja-con-zapallito-morron-y', 'aceite', 10),
  ('wok-de-tofu-con-miel-y-soja-con-zapallito-morron-y', 'ajo', 1),
  ('wok-de-tofu-con-miel-y-soja-con-zapallito-morron-y', 'sesamo', 4),
  ('wok-de-calamar-con-miso-con-brocoli-y-morron-sobre', 'calamar', 150),
  ('wok-de-calamar-con-miso-con-brocoli-y-morron-sobre', 'brocoli', 110),
  ('wok-de-calamar-con-miso-con-brocoli-y-morron-sobre', 'morron', 0.5),
  ('wok-de-calamar-con-miso-con-brocoli-y-morron-sobre', 'fideos', 70),
  ('wok-de-calamar-con-miso-con-brocoli-y-morron-sobre', 'pasta-miso', 10),
  ('wok-de-calamar-con-miso-con-brocoli-y-morron-sobre', 'vinagre-manzana', 5),
  ('wok-de-calamar-con-miso-con-brocoli-y-morron-sobre', 'aceite', 10),
  ('wok-de-calamar-con-miso-con-brocoli-y-morron-sobre', 'ajo', 1),
  ('wok-de-calamar-con-miso-con-brocoli-y-morron-sobre', 'sesamo', 4),
  ('wok-de-carne-con-miel-y-soja-con-zapallito-morron-y', 'bife-nalga', 150),
  ('wok-de-carne-con-miel-y-soja-con-zapallito-morron-y', 'zapallito', 0.5),
  ('wok-de-carne-con-miel-y-soja-con-zapallito-morron-y', 'morron', 0.5),
  ('wok-de-carne-con-miel-y-soja-con-zapallito-morron-y', 'cebolla', 0.5),
  ('wok-de-carne-con-miel-y-soja-con-zapallito-morron-y', 'arroz', 65),
  ('wok-de-carne-con-miel-y-soja-con-zapallito-morron-y', 'salsa-soja', 15),
  ('wok-de-carne-con-miel-y-soja-con-zapallito-morron-y', 'miel', 8),
  ('wok-de-carne-con-miel-y-soja-con-zapallito-morron-y', 'aceite', 10),
  ('wok-de-carne-con-miel-y-soja-con-zapallito-morron-y', 'ajo', 1),
  ('wok-de-carne-con-miel-y-soja-con-zapallito-morron-y', 'sesamo', 4),
  ('wok-de-carne-con-salsa-de-mani-con-zanahoria-cebolla-y', 'bife-nalga', 150),
  ('wok-de-carne-con-salsa-de-mani-con-zanahoria-cebolla-y', 'zanahoria', 1),
  ('wok-de-carne-con-salsa-de-mani-con-zanahoria-cebolla-y', 'cebolla', 0.5),
  ('wok-de-carne-con-salsa-de-mani-con-zanahoria-cebolla-y', 'morron', 0.5),
  ('wok-de-carne-con-salsa-de-mani-con-zanahoria-cebolla-y', 'mani-pasta', 20),
  ('wok-de-carne-con-salsa-de-mani-con-zanahoria-cebolla-y', 'salsa-soja', 10),
  ('wok-de-carne-con-salsa-de-mani-con-zanahoria-cebolla-y', 'limon-exprimido', 10),
  ('wok-de-carne-con-salsa-de-mani-con-zanahoria-cebolla-y', 'aceite', 10),
  ('wok-de-carne-con-salsa-de-mani-con-zanahoria-cebolla-y', 'ajo', 1),
  ('wok-de-carne-con-salsa-de-mani-con-zanahoria-cebolla-y', 'sesamo', 4),
  ('wok-de-huevo-con-miso-con-brocoli-zanahoria-y-cebolla', 'huevo', 2),
  ('wok-de-huevo-con-miso-con-brocoli-zanahoria-y-cebolla', 'brocoli', 90),
  ('wok-de-huevo-con-miso-con-brocoli-zanahoria-y-cebolla', 'zanahoria', 0.5),
  ('wok-de-huevo-con-miso-con-brocoli-zanahoria-y-cebolla', 'cebolla-verdeo', 20),
  ('wok-de-huevo-con-miso-con-brocoli-zanahoria-y-cebolla', 'pasta-miso', 10),
  ('wok-de-huevo-con-miso-con-brocoli-zanahoria-y-cebolla', 'vinagre-manzana', 5),
  ('wok-de-huevo-con-miso-con-brocoli-zanahoria-y-cebolla', 'aceite', 10),
  ('wok-de-huevo-con-miso-con-brocoli-zanahoria-y-cebolla', 'ajo', 1),
  ('wok-de-huevo-con-miso-con-brocoli-zanahoria-y-cebolla', 'sesamo', 4),
  ('wok-de-cerdo-al-teriyaki-con-mix-de-verduras-sobre-arroz', 'lomo-cerdo', 150),
  ('wok-de-cerdo-al-teriyaki-con-mix-de-verduras-sobre-arroz', 'verduras-wok', 220),
  ('wok-de-cerdo-al-teriyaki-con-mix-de-verduras-sobre-arroz', 'arroz', 65),
  ('wok-de-cerdo-al-teriyaki-con-mix-de-verduras-sobre-arroz', 'salsa-teriyaki', 30),
  ('wok-de-cerdo-al-teriyaki-con-mix-de-verduras-sobre-arroz', 'aceite', 10),
  ('wok-de-cerdo-al-teriyaki-con-mix-de-verduras-sobre-arroz', 'ajo', 1),
  ('wok-de-cerdo-al-teriyaki-con-mix-de-verduras-sobre-arroz', 'sesamo', 4),
  ('salteado-de-tofu-con-miso-con-mix-de-verduras-sobre', 'tofu', 130),
  ('salteado-de-tofu-con-miso-con-mix-de-verduras-sobre', 'verduras-wok', 220),
  ('salteado-de-tofu-con-miso-con-mix-de-verduras-sobre', 'fideos', 70),
  ('salteado-de-tofu-con-miso-con-mix-de-verduras-sobre', 'pasta-miso', 10),
  ('salteado-de-tofu-con-miso-con-mix-de-verduras-sobre', 'vinagre-manzana', 5),
  ('salteado-de-tofu-con-miso-con-mix-de-verduras-sobre', 'aceite', 10),
  ('salteado-de-tofu-con-miso-con-mix-de-verduras-sobre', 'ajo', 1),
  ('salteado-de-tofu-con-miso-con-mix-de-verduras-sobre', 'sesamo', 4),
  ('wok-de-salmon-con-miel-y-soja-con-mix-de-verduras', 'salmon', 140),
  ('wok-de-salmon-con-miel-y-soja-con-mix-de-verduras', 'verduras-wok', 220),
  ('wok-de-salmon-con-miel-y-soja-con-mix-de-verduras', 'salsa-soja', 15),
  ('wok-de-salmon-con-miel-y-soja-con-mix-de-verduras', 'miel', 8),
  ('wok-de-salmon-con-miel-y-soja-con-mix-de-verduras', 'aceite', 10),
  ('wok-de-salmon-con-miel-y-soja-con-mix-de-verduras', 'ajo', 1),
  ('wok-de-salmon-con-miel-y-soja-con-mix-de-verduras', 'sesamo', 4),
  ('salteado-de-tempeh-al-teriyaki-con-brocoli-y-morron', 'tempeh', 110),
  ('salteado-de-tempeh-al-teriyaki-con-brocoli-y-morron', 'brocoli', 110),
  ('salteado-de-tempeh-al-teriyaki-con-brocoli-y-morron', 'morron', 0.5),
  ('salteado-de-tempeh-al-teriyaki-con-brocoli-y-morron', 'fideos-arroz', 60),
  ('salteado-de-tempeh-al-teriyaki-con-brocoli-y-morron', 'salsa-teriyaki', 30),
  ('salteado-de-tempeh-al-teriyaki-con-brocoli-y-morron', 'aceite', 10),
  ('salteado-de-tempeh-al-teriyaki-con-brocoli-y-morron', 'ajo', 1),
  ('salteado-de-tempeh-al-teriyaki-con-brocoli-y-morron', 'sesamo', 4),
  ('wok-de-cuadril-picante-con-esparragos-y-zanahoria-sobre', 'cuadril', 150),
  ('wok-de-cuadril-picante-con-esparragos-y-zanahoria-sobre', 'esparragos', 100),
  ('wok-de-cuadril-picante-con-esparragos-y-zanahoria-sobre', 'zanahoria', 1),
  ('wok-de-cuadril-picante-con-esparragos-y-zanahoria-sobre', 'cebolla-verdeo', 15),
  ('wok-de-cuadril-picante-con-esparragos-y-zanahoria-sobre', 'cuscus', 60),
  ('wok-de-cuadril-picante-con-esparragos-y-zanahoria-sobre', 'salsa-soja', 10),
  ('wok-de-cuadril-picante-con-esparragos-y-zanahoria-sobre', 'salsa-picante', 10),
  ('wok-de-cuadril-picante-con-esparragos-y-zanahoria-sobre', 'miel', 5),
  ('wok-de-cuadril-picante-con-esparragos-y-zanahoria-sobre', 'aceite', 10),
  ('wok-de-cuadril-picante-con-esparragos-y-zanahoria-sobre', 'ajo', 1),
  ('wok-de-cuadril-picante-con-esparragos-y-zanahoria-sobre', 'sesamo', 4),
  ('wok-de-tofu-picante-con-brocoli-y-morron-sobre-quinoa', 'tofu', 130),
  ('wok-de-tofu-picante-con-brocoli-y-morron-sobre-quinoa', 'brocoli', 110),
  ('wok-de-tofu-picante-con-brocoli-y-morron-sobre-quinoa', 'morron', 0.5),
  ('wok-de-tofu-picante-con-brocoli-y-morron-sobre-quinoa', 'quinoa', 55),
  ('wok-de-tofu-picante-con-brocoli-y-morron-sobre-quinoa', 'salsa-soja', 10),
  ('wok-de-tofu-picante-con-brocoli-y-morron-sobre-quinoa', 'salsa-picante', 10),
  ('wok-de-tofu-picante-con-brocoli-y-morron-sobre-quinoa', 'miel', 5),
  ('wok-de-tofu-picante-con-brocoli-y-morron-sobre-quinoa', 'aceite', 10),
  ('wok-de-tofu-picante-con-brocoli-y-morron-sobre-quinoa', 'ajo', 1),
  ('wok-de-tofu-picante-con-brocoli-y-morron-sobre-quinoa', 'sesamo', 4),
  ('wok-de-tempeh-agridulce-con-zapallito-morron-y-cebolla', 'tempeh', 110),
  ('wok-de-tempeh-agridulce-con-zapallito-morron-y-cebolla', 'zapallito', 0.5),
  ('wok-de-tempeh-agridulce-con-zapallito-morron-y-cebolla', 'morron', 0.5),
  ('wok-de-tempeh-agridulce-con-zapallito-morron-y-cebolla', 'cebolla', 0.5),
  ('wok-de-tempeh-agridulce-con-zapallito-morron-y-cebolla', 'fideos', 70),
  ('wok-de-tempeh-agridulce-con-zapallito-morron-y-cebolla', 'ketchup', 15),
  ('wok-de-tempeh-agridulce-con-zapallito-morron-y-cebolla', 'salsa-soja', 10),
  ('wok-de-tempeh-agridulce-con-zapallito-morron-y-cebolla', 'vinagre-manzana', 8),
  ('wok-de-tempeh-agridulce-con-zapallito-morron-y-cebolla', 'azucar', 5),
  ('wok-de-tempeh-agridulce-con-zapallito-morron-y-cebolla', 'aceite', 10),
  ('wok-de-tempeh-agridulce-con-zapallito-morron-y-cebolla', 'ajo', 1),
  ('wok-de-tempeh-agridulce-con-zapallito-morron-y-cebolla', 'sesamo', 4),
  ('wok-de-tempeh-agridulce-con-esparragos-y-zanahoria', 'tempeh', 110),
  ('wok-de-tempeh-agridulce-con-esparragos-y-zanahoria', 'esparragos', 100),
  ('wok-de-tempeh-agridulce-con-esparragos-y-zanahoria', 'zanahoria', 1),
  ('wok-de-tempeh-agridulce-con-esparragos-y-zanahoria', 'cebolla-verdeo', 15),
  ('wok-de-tempeh-agridulce-con-esparragos-y-zanahoria', 'arroz', 65),
  ('wok-de-tempeh-agridulce-con-esparragos-y-zanahoria', 'ketchup', 15),
  ('wok-de-tempeh-agridulce-con-esparragos-y-zanahoria', 'salsa-soja', 10),
  ('wok-de-tempeh-agridulce-con-esparragos-y-zanahoria', 'vinagre-manzana', 8),
  ('wok-de-tempeh-agridulce-con-esparragos-y-zanahoria', 'azucar', 5),
  ('wok-de-tempeh-agridulce-con-esparragos-y-zanahoria', 'aceite', 10),
  ('wok-de-tempeh-agridulce-con-esparragos-y-zanahoria', 'ajo', 1),
  ('wok-de-tempeh-agridulce-con-esparragos-y-zanahoria', 'sesamo', 4),
  ('wok-de-cuadril-al-teriyaki-con-zanahoria-arvejas-y', 'cuadril', 150),
  ('wok-de-cuadril-al-teriyaki-con-zanahoria-arvejas-y', 'zanahoria', 1),
  ('wok-de-cuadril-al-teriyaki-con-zanahoria-arvejas-y', 'arvejas-frescas', 50),
  ('wok-de-cuadril-al-teriyaki-con-zanahoria-arvejas-y', 'choclo', 50),
  ('wok-de-cuadril-al-teriyaki-con-zanahoria-arvejas-y', 'arroz', 65),
  ('wok-de-cuadril-al-teriyaki-con-zanahoria-arvejas-y', 'salsa-teriyaki', 30),
  ('wok-de-cuadril-al-teriyaki-con-zanahoria-arvejas-y', 'aceite', 10),
  ('wok-de-cuadril-al-teriyaki-con-zanahoria-arvejas-y', 'ajo', 1),
  ('wok-de-cuadril-al-teriyaki-con-zanahoria-arvejas-y', 'sesamo', 4),
  ('wok-de-cuadril-al-teriyaki-con-coliflor-y-zanahoria', 'cuadril', 150),
  ('wok-de-cuadril-al-teriyaki-con-coliflor-y-zanahoria', 'coliflor', 100),
  ('wok-de-cuadril-al-teriyaki-con-coliflor-y-zanahoria', 'zanahoria', 1),
  ('wok-de-cuadril-al-teriyaki-con-coliflor-y-zanahoria', 'cebolla', 0.5),
  ('wok-de-cuadril-al-teriyaki-con-coliflor-y-zanahoria', 'fideos', 70),
  ('wok-de-cuadril-al-teriyaki-con-coliflor-y-zanahoria', 'salsa-teriyaki', 30),
  ('wok-de-cuadril-al-teriyaki-con-coliflor-y-zanahoria', 'aceite', 10),
  ('wok-de-cuadril-al-teriyaki-con-coliflor-y-zanahoria', 'ajo', 1),
  ('wok-de-cuadril-al-teriyaki-con-coliflor-y-zanahoria', 'sesamo', 4),
  ('salteado-de-tempeh-con-miso-con-zanahoria-arvejas-y', 'tempeh', 110),
  ('salteado-de-tempeh-con-miso-con-zanahoria-arvejas-y', 'zanahoria', 1),
  ('salteado-de-tempeh-con-miso-con-zanahoria-arvejas-y', 'arvejas-frescas', 50),
  ('salteado-de-tempeh-con-miso-con-zanahoria-arvejas-y', 'choclo', 50),
  ('salteado-de-tempeh-con-miso-con-zanahoria-arvejas-y', 'quinoa', 55),
  ('salteado-de-tempeh-con-miso-con-zanahoria-arvejas-y', 'pasta-miso', 10),
  ('salteado-de-tempeh-con-miso-con-zanahoria-arvejas-y', 'vinagre-manzana', 5),
  ('salteado-de-tempeh-con-miso-con-zanahoria-arvejas-y', 'aceite', 10),
  ('salteado-de-tempeh-con-miso-con-zanahoria-arvejas-y', 'ajo', 1),
  ('salteado-de-tempeh-con-miso-con-zanahoria-arvejas-y', 'sesamo', 4),
  ('wok-de-pollo-con-miso-con-mix-de-verduras-sobre-fideos', 'pechuga-cruda', 150),
  ('wok-de-pollo-con-miso-con-mix-de-verduras-sobre-fideos', 'verduras-wok', 220),
  ('wok-de-pollo-con-miso-con-mix-de-verduras-sobre-fideos', 'fideos-arroz', 60),
  ('wok-de-pollo-con-miso-con-mix-de-verduras-sobre-fideos', 'pasta-miso', 10),
  ('wok-de-pollo-con-miso-con-mix-de-verduras-sobre-fideos', 'vinagre-manzana', 5),
  ('wok-de-pollo-con-miso-con-mix-de-verduras-sobre-fideos', 'aceite', 10),
  ('wok-de-pollo-con-miso-con-mix-de-verduras-sobre-fideos', 'ajo', 1),
  ('wok-de-pollo-con-miso-con-mix-de-verduras-sobre-fideos', 'sesamo', 4),
  ('wok-de-tempeh-con-miel-y-soja-con-esparragos-y', 'tempeh', 110),
  ('wok-de-tempeh-con-miel-y-soja-con-esparragos-y', 'esparragos', 100),
  ('wok-de-tempeh-con-miel-y-soja-con-esparragos-y', 'zanahoria', 1),
  ('wok-de-tempeh-con-miel-y-soja-con-esparragos-y', 'cebolla-verdeo', 15),
  ('wok-de-tempeh-con-miel-y-soja-con-esparragos-y', 'quinoa', 55),
  ('wok-de-tempeh-con-miel-y-soja-con-esparragos-y', 'salsa-soja', 15),
  ('wok-de-tempeh-con-miel-y-soja-con-esparragos-y', 'miel', 8),
  ('wok-de-tempeh-con-miel-y-soja-con-esparragos-y', 'aceite', 10),
  ('wok-de-tempeh-con-miel-y-soja-con-esparragos-y', 'ajo', 1),
  ('wok-de-tempeh-con-miel-y-soja-con-esparragos-y', 'sesamo', 4),
  ('salteado-de-tofu-al-limon-con-berenjena-morron-y', 'tofu', 130),
  ('salteado-de-tofu-al-limon-con-berenjena-morron-y', 'berenjena', 0.5),
  ('salteado-de-tofu-al-limon-con-berenjena-morron-y', 'morron', 0.5),
  ('salteado-de-tofu-al-limon-con-berenjena-morron-y', 'cebolla-morada', 0.5),
  ('salteado-de-tofu-al-limon-con-berenjena-morron-y', 'salsa-soja', 10),
  ('salteado-de-tofu-al-limon-con-berenjena-morron-y', 'limon-exprimido', 20),
  ('salteado-de-tofu-al-limon-con-berenjena-morron-y', 'miel', 5),
  ('salteado-de-tofu-al-limon-con-berenjena-morron-y', 'aceite', 10),
  ('salteado-de-tofu-al-limon-con-berenjena-morron-y', 'ajo', 1),
  ('salteado-de-tofu-al-limon-con-berenjena-morron-y', 'sesamo', 4),
  ('salteado-de-pollo-al-limon-con-kale-y-champinones-sobre', 'pechuga-cruda', 150),
  ('salteado-de-pollo-al-limon-con-kale-y-champinones-sobre', 'kale', 60),
  ('salteado-de-pollo-al-limon-con-kale-y-champinones-sobre', 'champinones', 90),
  ('salteado-de-pollo-al-limon-con-kale-y-champinones-sobre', 'cebolla', 0.5),
  ('salteado-de-pollo-al-limon-con-kale-y-champinones-sobre', 'fideos-arroz', 60),
  ('salteado-de-pollo-al-limon-con-kale-y-champinones-sobre', 'salsa-soja', 10),
  ('salteado-de-pollo-al-limon-con-kale-y-champinones-sobre', 'limon-exprimido', 20),
  ('salteado-de-pollo-al-limon-con-kale-y-champinones-sobre', 'miel', 5),
  ('salteado-de-pollo-al-limon-con-kale-y-champinones-sobre', 'aceite', 10),
  ('salteado-de-pollo-al-limon-con-kale-y-champinones-sobre', 'ajo', 1),
  ('salteado-de-pollo-al-limon-con-kale-y-champinones-sobre', 'sesamo', 4),
  ('wok-de-cerdo-con-salsa-de-mani-con-kale-y-champinones', 'lomo-cerdo', 150),
  ('wok-de-cerdo-con-salsa-de-mani-con-kale-y-champinones', 'kale', 60),
  ('wok-de-cerdo-con-salsa-de-mani-con-kale-y-champinones', 'champinones', 90),
  ('wok-de-cerdo-con-salsa-de-mani-con-kale-y-champinones', 'cebolla', 0.5),
  ('wok-de-cerdo-con-salsa-de-mani-con-kale-y-champinones', 'mani-pasta', 20),
  ('wok-de-cerdo-con-salsa-de-mani-con-kale-y-champinones', 'salsa-soja', 10),
  ('wok-de-cerdo-con-salsa-de-mani-con-kale-y-champinones', 'limon-exprimido', 10),
  ('wok-de-cerdo-con-salsa-de-mani-con-kale-y-champinones', 'aceite', 10),
  ('wok-de-cerdo-con-salsa-de-mani-con-kale-y-champinones', 'ajo', 1),
  ('wok-de-cerdo-con-salsa-de-mani-con-kale-y-champinones', 'sesamo', 4),
  ('salteado-de-carne-con-miel-y-soja-con-mix-de-verduras', 'bife-nalga', 150),
  ('salteado-de-carne-con-miel-y-soja-con-mix-de-verduras', 'verduras-wok', 220),
  ('salteado-de-carne-con-miel-y-soja-con-mix-de-verduras', 'cuscus', 60),
  ('salteado-de-carne-con-miel-y-soja-con-mix-de-verduras', 'salsa-soja', 15),
  ('salteado-de-carne-con-miel-y-soja-con-mix-de-verduras', 'miel', 8),
  ('salteado-de-carne-con-miel-y-soja-con-mix-de-verduras', 'aceite', 10),
  ('salteado-de-carne-con-miel-y-soja-con-mix-de-verduras', 'ajo', 1),
  ('salteado-de-carne-con-miel-y-soja-con-mix-de-verduras', 'sesamo', 4),
  ('wok-de-tempeh-con-miso-con-mix-de-verduras-sobre-arroz', 'tempeh', 110),
  ('wok-de-tempeh-con-miso-con-mix-de-verduras-sobre-arroz', 'verduras-wok', 220),
  ('wok-de-tempeh-con-miso-con-mix-de-verduras-sobre-arroz', 'arroz-integral', 65),
  ('wok-de-tempeh-con-miso-con-mix-de-verduras-sobre-arroz', 'pasta-miso', 10),
  ('wok-de-tempeh-con-miso-con-mix-de-verduras-sobre-arroz', 'vinagre-manzana', 5),
  ('wok-de-tempeh-con-miso-con-mix-de-verduras-sobre-arroz', 'aceite', 10),
  ('wok-de-tempeh-con-miso-con-mix-de-verduras-sobre-arroz', 'ajo', 1),
  ('wok-de-tempeh-con-miso-con-mix-de-verduras-sobre-arroz', 'sesamo', 4),
  ('wok-de-tofu-con-miso-con-repollo-colorado-zanahoria-y', 'tofu', 130),
  ('wok-de-tofu-con-miso-con-repollo-colorado-zanahoria-y', 'repollo-colorado', 80),
  ('wok-de-tofu-con-miso-con-repollo-colorado-zanahoria-y', 'zanahoria', 0.5),
  ('wok-de-tofu-con-miso-con-repollo-colorado-zanahoria-y', 'apio', 40),
  ('wok-de-tofu-con-miso-con-repollo-colorado-zanahoria-y', 'quinoa', 55),
  ('wok-de-tofu-con-miso-con-repollo-colorado-zanahoria-y', 'pasta-miso', 10),
  ('wok-de-tofu-con-miso-con-repollo-colorado-zanahoria-y', 'vinagre-manzana', 5),
  ('wok-de-tofu-con-miso-con-repollo-colorado-zanahoria-y', 'aceite', 10),
  ('wok-de-tofu-con-miso-con-repollo-colorado-zanahoria-y', 'ajo', 1),
  ('wok-de-tofu-con-miso-con-repollo-colorado-zanahoria-y', 'sesamo', 4),
  ('salteado-de-pavo-con-miso-con-esparragos-y-zanahoria', 'pechuga-pavo', 150),
  ('salteado-de-pavo-con-miso-con-esparragos-y-zanahoria', 'esparragos', 100),
  ('salteado-de-pavo-con-miso-con-esparragos-y-zanahoria', 'zanahoria', 1),
  ('salteado-de-pavo-con-miso-con-esparragos-y-zanahoria', 'cebolla-verdeo', 15),
  ('salteado-de-pavo-con-miso-con-esparragos-y-zanahoria', 'fideos-arroz', 60),
  ('salteado-de-pavo-con-miso-con-esparragos-y-zanahoria', 'pasta-miso', 10),
  ('salteado-de-pavo-con-miso-con-esparragos-y-zanahoria', 'vinagre-manzana', 5),
  ('salteado-de-pavo-con-miso-con-esparragos-y-zanahoria', 'aceite', 10),
  ('salteado-de-pavo-con-miso-con-esparragos-y-zanahoria', 'ajo', 1),
  ('salteado-de-pavo-con-miso-con-esparragos-y-zanahoria', 'sesamo', 4),
  ('wok-de-tempeh-al-limon-con-brocoli-zanahoria-y-cebolla', 'tempeh', 110),
  ('wok-de-tempeh-al-limon-con-brocoli-zanahoria-y-cebolla', 'brocoli', 90),
  ('wok-de-tempeh-al-limon-con-brocoli-zanahoria-y-cebolla', 'zanahoria', 0.5),
  ('wok-de-tempeh-al-limon-con-brocoli-zanahoria-y-cebolla', 'cebolla-verdeo', 20),
  ('wok-de-tempeh-al-limon-con-brocoli-zanahoria-y-cebolla', 'salsa-soja', 10),
  ('wok-de-tempeh-al-limon-con-brocoli-zanahoria-y-cebolla', 'limon-exprimido', 20),
  ('wok-de-tempeh-al-limon-con-brocoli-zanahoria-y-cebolla', 'miel', 5),
  ('wok-de-tempeh-al-limon-con-brocoli-zanahoria-y-cebolla', 'aceite', 10),
  ('wok-de-tempeh-al-limon-con-brocoli-zanahoria-y-cebolla', 'ajo', 1),
  ('wok-de-tempeh-al-limon-con-brocoli-zanahoria-y-cebolla', 'sesamo', 4),
  ('wok-de-calamar-con-miso-con-berenjena-morron-y-cebolla', 'calamar', 150),
  ('wok-de-calamar-con-miso-con-berenjena-morron-y-cebolla', 'berenjena', 0.5),
  ('wok-de-calamar-con-miso-con-berenjena-morron-y-cebolla', 'morron', 0.5),
  ('wok-de-calamar-con-miso-con-berenjena-morron-y-cebolla', 'cebolla-morada', 0.5),
  ('wok-de-calamar-con-miso-con-berenjena-morron-y-cebolla', 'arroz', 65),
  ('wok-de-calamar-con-miso-con-berenjena-morron-y-cebolla', 'pasta-miso', 10),
  ('wok-de-calamar-con-miso-con-berenjena-morron-y-cebolla', 'vinagre-manzana', 5),
  ('wok-de-calamar-con-miso-con-berenjena-morron-y-cebolla', 'aceite', 10),
  ('wok-de-calamar-con-miso-con-berenjena-morron-y-cebolla', 'ajo', 1),
  ('wok-de-calamar-con-miso-con-berenjena-morron-y-cebolla', 'sesamo', 4),
  ('wok-de-huevo-con-miso-con-zapallito-morron-y-cebolla', 'huevo', 2),
  ('wok-de-huevo-con-miso-con-zapallito-morron-y-cebolla', 'zapallito', 0.5),
  ('wok-de-huevo-con-miso-con-zapallito-morron-y-cebolla', 'morron', 0.5),
  ('wok-de-huevo-con-miso-con-zapallito-morron-y-cebolla', 'cebolla', 0.5),
  ('wok-de-huevo-con-miso-con-zapallito-morron-y-cebolla', 'fideos', 70),
  ('wok-de-huevo-con-miso-con-zapallito-morron-y-cebolla', 'pasta-miso', 10),
  ('wok-de-huevo-con-miso-con-zapallito-morron-y-cebolla', 'vinagre-manzana', 5),
  ('wok-de-huevo-con-miso-con-zapallito-morron-y-cebolla', 'aceite', 10),
  ('wok-de-huevo-con-miso-con-zapallito-morron-y-cebolla', 'ajo', 1),
  ('wok-de-huevo-con-miso-con-zapallito-morron-y-cebolla', 'sesamo', 4),
  ('wok-de-cerdo-con-miso-con-berenjena-morron-y-cebolla', 'lomo-cerdo', 150),
  ('wok-de-cerdo-con-miso-con-berenjena-morron-y-cebolla', 'berenjena', 0.5),
  ('wok-de-cerdo-con-miso-con-berenjena-morron-y-cebolla', 'morron', 0.5),
  ('wok-de-cerdo-con-miso-con-berenjena-morron-y-cebolla', 'cebolla-morada', 0.5),
  ('wok-de-cerdo-con-miso-con-berenjena-morron-y-cebolla', 'fideos', 70),
  ('wok-de-cerdo-con-miso-con-berenjena-morron-y-cebolla', 'pasta-miso', 10),
  ('wok-de-cerdo-con-miso-con-berenjena-morron-y-cebolla', 'vinagre-manzana', 5),
  ('wok-de-cerdo-con-miso-con-berenjena-morron-y-cebolla', 'aceite', 10),
  ('wok-de-cerdo-con-miso-con-berenjena-morron-y-cebolla', 'ajo', 1),
  ('wok-de-cerdo-con-miso-con-berenjena-morron-y-cebolla', 'sesamo', 4),
  ('salteado-de-huevo-picante-con-esparragos-y-zanahoria', 'huevo', 2),
  ('salteado-de-huevo-picante-con-esparragos-y-zanahoria', 'esparragos', 100),
  ('salteado-de-huevo-picante-con-esparragos-y-zanahoria', 'zanahoria', 1),
  ('salteado-de-huevo-picante-con-esparragos-y-zanahoria', 'cebolla-verdeo', 15),
  ('salteado-de-huevo-picante-con-esparragos-y-zanahoria', 'fideos-arroz', 60),
  ('salteado-de-huevo-picante-con-esparragos-y-zanahoria', 'salsa-soja', 10),
  ('salteado-de-huevo-picante-con-esparragos-y-zanahoria', 'salsa-picante', 10),
  ('salteado-de-huevo-picante-con-esparragos-y-zanahoria', 'miel', 5),
  ('salteado-de-huevo-picante-con-esparragos-y-zanahoria', 'aceite', 10),
  ('salteado-de-huevo-picante-con-esparragos-y-zanahoria', 'ajo', 1),
  ('salteado-de-huevo-picante-con-esparragos-y-zanahoria', 'sesamo', 4),
  ('wok-de-tofu-al-limon-con-zanahoria-cebolla-y-morron', 'tofu', 130),
  ('wok-de-tofu-al-limon-con-zanahoria-cebolla-y-morron', 'zanahoria', 1),
  ('wok-de-tofu-al-limon-con-zanahoria-cebolla-y-morron', 'cebolla', 0.5),
  ('wok-de-tofu-al-limon-con-zanahoria-cebolla-y-morron', 'morron', 0.5),
  ('wok-de-tofu-al-limon-con-zanahoria-cebolla-y-morron', 'fideos', 70),
  ('wok-de-tofu-al-limon-con-zanahoria-cebolla-y-morron', 'salsa-soja', 10),
  ('wok-de-tofu-al-limon-con-zanahoria-cebolla-y-morron', 'limon-exprimido', 20),
  ('wok-de-tofu-al-limon-con-zanahoria-cebolla-y-morron', 'miel', 5),
  ('wok-de-tofu-al-limon-con-zanahoria-cebolla-y-morron', 'aceite', 10),
  ('wok-de-tofu-al-limon-con-zanahoria-cebolla-y-morron', 'ajo', 1),
  ('wok-de-tofu-al-limon-con-zanahoria-cebolla-y-morron', 'sesamo', 4),
  ('salteado-de-cuadril-agridulce-con-champinones-espinaca', 'cuadril', 150),
  ('salteado-de-cuadril-agridulce-con-champinones-espinaca', 'champinones', 90),
  ('salteado-de-cuadril-agridulce-con-champinones-espinaca', 'espinaca', 50),
  ('salteado-de-cuadril-agridulce-con-champinones-espinaca', 'cebolla', 0.5),
  ('salteado-de-cuadril-agridulce-con-champinones-espinaca', 'ketchup', 15),
  ('salteado-de-cuadril-agridulce-con-champinones-espinaca', 'salsa-soja', 10),
  ('salteado-de-cuadril-agridulce-con-champinones-espinaca', 'vinagre-manzana', 8),
  ('salteado-de-cuadril-agridulce-con-champinones-espinaca', 'azucar', 5),
  ('salteado-de-cuadril-agridulce-con-champinones-espinaca', 'aceite', 10),
  ('salteado-de-cuadril-agridulce-con-champinones-espinaca', 'ajo', 1),
  ('salteado-de-cuadril-agridulce-con-champinones-espinaca', 'sesamo', 4),
  ('wok-de-cuadril-a-la-soja-y-jengibre-con-coliflor-y', 'cuadril', 150),
  ('wok-de-cuadril-a-la-soja-y-jengibre-con-coliflor-y', 'coliflor', 100),
  ('wok-de-cuadril-a-la-soja-y-jengibre-con-coliflor-y', 'zanahoria', 1),
  ('wok-de-cuadril-a-la-soja-y-jengibre-con-coliflor-y', 'cebolla', 0.5),
  ('wok-de-cuadril-a-la-soja-y-jengibre-con-coliflor-y', 'arroz', 65),
  ('wok-de-cuadril-a-la-soja-y-jengibre-con-coliflor-y', 'salsa-soja', 15),
  ('wok-de-cuadril-a-la-soja-y-jengibre-con-coliflor-y', 'jengibre', 6),
  ('wok-de-cuadril-a-la-soja-y-jengibre-con-coliflor-y', 'aceite', 10),
  ('wok-de-cuadril-a-la-soja-y-jengibre-con-coliflor-y', 'ajo', 1),
  ('wok-de-cuadril-a-la-soja-y-jengibre-con-coliflor-y', 'sesamo', 4),
  ('wok-de-carne-a-la-soja-y-jengibre-con-mix-de-verduras', 'bife-nalga', 150),
  ('wok-de-carne-a-la-soja-y-jengibre-con-mix-de-verduras', 'verduras-wok', 220),
  ('wok-de-carne-a-la-soja-y-jengibre-con-mix-de-verduras', 'arroz-basmati', 65),
  ('wok-de-carne-a-la-soja-y-jengibre-con-mix-de-verduras', 'salsa-soja', 15),
  ('wok-de-carne-a-la-soja-y-jengibre-con-mix-de-verduras', 'jengibre', 6),
  ('wok-de-carne-a-la-soja-y-jengibre-con-mix-de-verduras', 'aceite', 10),
  ('wok-de-carne-a-la-soja-y-jengibre-con-mix-de-verduras', 'ajo', 1),
  ('wok-de-carne-a-la-soja-y-jengibre-con-mix-de-verduras', 'sesamo', 4),
  ('wok-de-cuadril-picante-con-mix-de-verduras-sobre-arroz', 'cuadril', 150),
  ('wok-de-cuadril-picante-con-mix-de-verduras-sobre-arroz', 'verduras-wok', 220),
  ('wok-de-cuadril-picante-con-mix-de-verduras-sobre-arroz', 'arroz', 65),
  ('wok-de-cuadril-picante-con-mix-de-verduras-sobre-arroz', 'salsa-soja', 10),
  ('wok-de-cuadril-picante-con-mix-de-verduras-sobre-arroz', 'salsa-picante', 10),
  ('wok-de-cuadril-picante-con-mix-de-verduras-sobre-arroz', 'miel', 5),
  ('wok-de-cuadril-picante-con-mix-de-verduras-sobre-arroz', 'aceite', 10),
  ('wok-de-cuadril-picante-con-mix-de-verduras-sobre-arroz', 'ajo', 1),
  ('wok-de-cuadril-picante-con-mix-de-verduras-sobre-arroz', 'sesamo', 4),
  ('wok-de-tofu-con-miel-y-soja-con-brocoli-y-morron-sobre', 'tofu', 130),
  ('wok-de-tofu-con-miel-y-soja-con-brocoli-y-morron-sobre', 'brocoli', 110),
  ('wok-de-tofu-con-miel-y-soja-con-brocoli-y-morron-sobre', 'morron', 0.5),
  ('wok-de-tofu-con-miel-y-soja-con-brocoli-y-morron-sobre', 'cuscus', 60),
  ('wok-de-tofu-con-miel-y-soja-con-brocoli-y-morron-sobre', 'salsa-soja', 15),
  ('wok-de-tofu-con-miel-y-soja-con-brocoli-y-morron-sobre', 'miel', 8),
  ('wok-de-tofu-con-miel-y-soja-con-brocoli-y-morron-sobre', 'aceite', 10),
  ('wok-de-tofu-con-miel-y-soja-con-brocoli-y-morron-sobre', 'ajo', 1),
  ('wok-de-tofu-con-miel-y-soja-con-brocoli-y-morron-sobre', 'sesamo', 4),
  ('wok-de-tempeh-con-miso-con-coliflor-y-zanahoria-sobre', 'tempeh', 110),
  ('wok-de-tempeh-con-miso-con-coliflor-y-zanahoria-sobre', 'coliflor', 100),
  ('wok-de-tempeh-con-miso-con-coliflor-y-zanahoria-sobre', 'zanahoria', 1),
  ('wok-de-tempeh-con-miso-con-coliflor-y-zanahoria-sobre', 'cebolla', 0.5),
  ('wok-de-tempeh-con-miso-con-coliflor-y-zanahoria-sobre', 'fideos', 70),
  ('wok-de-tempeh-con-miso-con-coliflor-y-zanahoria-sobre', 'pasta-miso', 10),
  ('wok-de-tempeh-con-miso-con-coliflor-y-zanahoria-sobre', 'vinagre-manzana', 5),
  ('wok-de-tempeh-con-miso-con-coliflor-y-zanahoria-sobre', 'aceite', 10),
  ('wok-de-tempeh-con-miso-con-coliflor-y-zanahoria-sobre', 'ajo', 1),
  ('wok-de-tempeh-con-miso-con-coliflor-y-zanahoria-sobre', 'sesamo', 4),
  ('wok-de-langostinos-con-miel-y-soja-con-coliflor-y', 'langostinos', 130),
  ('wok-de-langostinos-con-miel-y-soja-con-coliflor-y', 'coliflor', 100),
  ('wok-de-langostinos-con-miel-y-soja-con-coliflor-y', 'zanahoria', 1),
  ('wok-de-langostinos-con-miel-y-soja-con-coliflor-y', 'cebolla', 0.5),
  ('wok-de-langostinos-con-miel-y-soja-con-coliflor-y', 'fideos', 70),
  ('wok-de-langostinos-con-miel-y-soja-con-coliflor-y', 'salsa-soja', 15),
  ('wok-de-langostinos-con-miel-y-soja-con-coliflor-y', 'miel', 8),
  ('wok-de-langostinos-con-miel-y-soja-con-coliflor-y', 'aceite', 10),
  ('wok-de-langostinos-con-miel-y-soja-con-coliflor-y', 'ajo', 1),
  ('wok-de-langostinos-con-miel-y-soja-con-coliflor-y', 'sesamo', 4),
  ('salteado-de-cerdo-con-miso-con-mix-de-verduras-sobre', 'lomo-cerdo', 150),
  ('salteado-de-cerdo-con-miso-con-mix-de-verduras-sobre', 'verduras-wok', 220),
  ('salteado-de-cerdo-con-miso-con-mix-de-verduras-sobre', 'fideos', 70),
  ('salteado-de-cerdo-con-miso-con-mix-de-verduras-sobre', 'pasta-miso', 10),
  ('salteado-de-cerdo-con-miso-con-mix-de-verduras-sobre', 'vinagre-manzana', 5),
  ('salteado-de-cerdo-con-miso-con-mix-de-verduras-sobre', 'aceite', 10),
  ('salteado-de-cerdo-con-miso-con-mix-de-verduras-sobre', 'ajo', 1),
  ('salteado-de-cerdo-con-miso-con-mix-de-verduras-sobre', 'sesamo', 4),
  ('wok-de-pollo-al-teriyaki-con-brocoli-y-morron', 'pechuga-cruda', 150),
  ('wok-de-pollo-al-teriyaki-con-brocoli-y-morron', 'brocoli', 110),
  ('wok-de-pollo-al-teriyaki-con-brocoli-y-morron', 'morron', 0.5),
  ('wok-de-pollo-al-teriyaki-con-brocoli-y-morron', 'salsa-teriyaki', 30),
  ('wok-de-pollo-al-teriyaki-con-brocoli-y-morron', 'aceite', 10),
  ('wok-de-pollo-al-teriyaki-con-brocoli-y-morron', 'ajo', 1),
  ('wok-de-pollo-al-teriyaki-con-brocoli-y-morron', 'sesamo', 4),
  ('wok-de-tofu-picante-con-kale-y-champinones-sobre-fideos', 'tofu', 130),
  ('wok-de-tofu-picante-con-kale-y-champinones-sobre-fideos', 'kale', 60),
  ('wok-de-tofu-picante-con-kale-y-champinones-sobre-fideos', 'champinones', 90),
  ('wok-de-tofu-picante-con-kale-y-champinones-sobre-fideos', 'cebolla', 0.5),
  ('wok-de-tofu-picante-con-kale-y-champinones-sobre-fideos', 'fideos-arroz', 60),
  ('wok-de-tofu-picante-con-kale-y-champinones-sobre-fideos', 'salsa-soja', 10),
  ('wok-de-tofu-picante-con-kale-y-champinones-sobre-fideos', 'salsa-picante', 10),
  ('wok-de-tofu-picante-con-kale-y-champinones-sobre-fideos', 'miel', 5),
  ('wok-de-tofu-picante-con-kale-y-champinones-sobre-fideos', 'aceite', 10),
  ('wok-de-tofu-picante-con-kale-y-champinones-sobre-fideos', 'ajo', 1),
  ('wok-de-tofu-picante-con-kale-y-champinones-sobre-fideos', 'sesamo', 4),
  ('salteado-de-tempeh-picante-con-coliflor-y-zanahoria', 'tempeh', 110),
  ('salteado-de-tempeh-picante-con-coliflor-y-zanahoria', 'coliflor', 100),
  ('salteado-de-tempeh-picante-con-coliflor-y-zanahoria', 'zanahoria', 1),
  ('salteado-de-tempeh-picante-con-coliflor-y-zanahoria', 'cebolla', 0.5),
  ('salteado-de-tempeh-picante-con-coliflor-y-zanahoria', 'quinoa', 55),
  ('salteado-de-tempeh-picante-con-coliflor-y-zanahoria', 'salsa-soja', 10),
  ('salteado-de-tempeh-picante-con-coliflor-y-zanahoria', 'salsa-picante', 10),
  ('salteado-de-tempeh-picante-con-coliflor-y-zanahoria', 'miel', 5),
  ('salteado-de-tempeh-picante-con-coliflor-y-zanahoria', 'aceite', 10),
  ('salteado-de-tempeh-picante-con-coliflor-y-zanahoria', 'ajo', 1),
  ('salteado-de-tempeh-picante-con-coliflor-y-zanahoria', 'sesamo', 4),
  ('wok-de-tofu-picante-con-zanahoria-arvejas-y-choclo', 'tofu', 130),
  ('wok-de-tofu-picante-con-zanahoria-arvejas-y-choclo', 'zanahoria', 1),
  ('wok-de-tofu-picante-con-zanahoria-arvejas-y-choclo', 'arvejas-frescas', 50),
  ('wok-de-tofu-picante-con-zanahoria-arvejas-y-choclo', 'choclo', 50),
  ('wok-de-tofu-picante-con-zanahoria-arvejas-y-choclo', 'arroz-basmati', 65),
  ('wok-de-tofu-picante-con-zanahoria-arvejas-y-choclo', 'salsa-soja', 10),
  ('wok-de-tofu-picante-con-zanahoria-arvejas-y-choclo', 'salsa-picante', 10),
  ('wok-de-tofu-picante-con-zanahoria-arvejas-y-choclo', 'miel', 5),
  ('wok-de-tofu-picante-con-zanahoria-arvejas-y-choclo', 'aceite', 10),
  ('wok-de-tofu-picante-con-zanahoria-arvejas-y-choclo', 'ajo', 1),
  ('wok-de-tofu-picante-con-zanahoria-arvejas-y-choclo', 'sesamo', 4),
  ('wok-de-carne-al-limon-con-champinones-espinaca-y', 'bife-nalga', 150),
  ('wok-de-carne-al-limon-con-champinones-espinaca-y', 'champinones', 90),
  ('wok-de-carne-al-limon-con-champinones-espinaca-y', 'espinaca', 50),
  ('wok-de-carne-al-limon-con-champinones-espinaca-y', 'cebolla', 0.5),
  ('wok-de-carne-al-limon-con-champinones-espinaca-y', 'arroz', 65),
  ('wok-de-carne-al-limon-con-champinones-espinaca-y', 'salsa-soja', 10),
  ('wok-de-carne-al-limon-con-champinones-espinaca-y', 'limon-exprimido', 20),
  ('wok-de-carne-al-limon-con-champinones-espinaca-y', 'miel', 5),
  ('wok-de-carne-al-limon-con-champinones-espinaca-y', 'aceite', 10),
  ('wok-de-carne-al-limon-con-champinones-espinaca-y', 'ajo', 1),
  ('wok-de-carne-al-limon-con-champinones-espinaca-y', 'sesamo', 4),
  ('salteado-de-tempeh-agridulce-con-brocoli-y-morron-sobre', 'tempeh', 110),
  ('salteado-de-tempeh-agridulce-con-brocoli-y-morron-sobre', 'brocoli', 110),
  ('salteado-de-tempeh-agridulce-con-brocoli-y-morron-sobre', 'morron', 0.5),
  ('salteado-de-tempeh-agridulce-con-brocoli-y-morron-sobre', 'fideos', 70),
  ('salteado-de-tempeh-agridulce-con-brocoli-y-morron-sobre', 'ketchup', 15),
  ('salteado-de-tempeh-agridulce-con-brocoli-y-morron-sobre', 'salsa-soja', 10),
  ('salteado-de-tempeh-agridulce-con-brocoli-y-morron-sobre', 'vinagre-manzana', 8),
  ('salteado-de-tempeh-agridulce-con-brocoli-y-morron-sobre', 'azucar', 5),
  ('salteado-de-tempeh-agridulce-con-brocoli-y-morron-sobre', 'aceite', 10),
  ('salteado-de-tempeh-agridulce-con-brocoli-y-morron-sobre', 'ajo', 1),
  ('salteado-de-tempeh-agridulce-con-brocoli-y-morron-sobre', 'sesamo', 4),
  ('wok-de-calamar-con-salsa-de-mani-con-coliflor-y', 'calamar', 150),
  ('wok-de-calamar-con-salsa-de-mani-con-coliflor-y', 'coliflor', 100),
  ('wok-de-calamar-con-salsa-de-mani-con-coliflor-y', 'zanahoria', 1),
  ('wok-de-calamar-con-salsa-de-mani-con-coliflor-y', 'cebolla', 0.5),
  ('wok-de-calamar-con-salsa-de-mani-con-coliflor-y', 'arroz', 65),
  ('wok-de-calamar-con-salsa-de-mani-con-coliflor-y', 'mani-pasta', 20),
  ('wok-de-calamar-con-salsa-de-mani-con-coliflor-y', 'salsa-soja', 10),
  ('wok-de-calamar-con-salsa-de-mani-con-coliflor-y', 'limon-exprimido', 10),
  ('wok-de-calamar-con-salsa-de-mani-con-coliflor-y', 'aceite', 10),
  ('wok-de-calamar-con-salsa-de-mani-con-coliflor-y', 'ajo', 1),
  ('wok-de-calamar-con-salsa-de-mani-con-coliflor-y', 'sesamo', 4),
  ('wok-de-pavo-al-limon-con-zanahoria-cebolla-y-morron', 'pechuga-pavo', 150),
  ('wok-de-pavo-al-limon-con-zanahoria-cebolla-y-morron', 'zanahoria', 1),
  ('wok-de-pavo-al-limon-con-zanahoria-cebolla-y-morron', 'cebolla', 0.5),
  ('wok-de-pavo-al-limon-con-zanahoria-cebolla-y-morron', 'morron', 0.5),
  ('wok-de-pavo-al-limon-con-zanahoria-cebolla-y-morron', 'fideos', 70),
  ('wok-de-pavo-al-limon-con-zanahoria-cebolla-y-morron', 'salsa-soja', 10),
  ('wok-de-pavo-al-limon-con-zanahoria-cebolla-y-morron', 'limon-exprimido', 20),
  ('wok-de-pavo-al-limon-con-zanahoria-cebolla-y-morron', 'miel', 5),
  ('wok-de-pavo-al-limon-con-zanahoria-cebolla-y-morron', 'aceite', 10),
  ('wok-de-pavo-al-limon-con-zanahoria-cebolla-y-morron', 'ajo', 1),
  ('wok-de-pavo-al-limon-con-zanahoria-cebolla-y-morron', 'sesamo', 4),
  ('wok-de-langostinos-al-teriyaki-con-zanahoria-arvejas-y', 'langostinos', 130),
  ('wok-de-langostinos-al-teriyaki-con-zanahoria-arvejas-y', 'zanahoria', 1),
  ('wok-de-langostinos-al-teriyaki-con-zanahoria-arvejas-y', 'arvejas-frescas', 50),
  ('wok-de-langostinos-al-teriyaki-con-zanahoria-arvejas-y', 'choclo', 50),
  ('wok-de-langostinos-al-teriyaki-con-zanahoria-arvejas-y', 'arroz', 65),
  ('wok-de-langostinos-al-teriyaki-con-zanahoria-arvejas-y', 'salsa-teriyaki', 30),
  ('wok-de-langostinos-al-teriyaki-con-zanahoria-arvejas-y', 'aceite', 10),
  ('wok-de-langostinos-al-teriyaki-con-zanahoria-arvejas-y', 'ajo', 1),
  ('wok-de-langostinos-al-teriyaki-con-zanahoria-arvejas-y', 'sesamo', 4),
  ('wok-de-calamar-picante-con-chauchas-zanahoria-y-repollo', 'calamar', 150),
  ('wok-de-calamar-picante-con-chauchas-zanahoria-y-repollo', 'chauchas', 80),
  ('wok-de-calamar-picante-con-chauchas-zanahoria-y-repollo', 'zanahoria', 0.5),
  ('wok-de-calamar-picante-con-chauchas-zanahoria-y-repollo', 'repollo', 70),
  ('wok-de-calamar-picante-con-chauchas-zanahoria-y-repollo', 'cuscus', 60),
  ('wok-de-calamar-picante-con-chauchas-zanahoria-y-repollo', 'salsa-soja', 10),
  ('wok-de-calamar-picante-con-chauchas-zanahoria-y-repollo', 'salsa-picante', 10),
  ('wok-de-calamar-picante-con-chauchas-zanahoria-y-repollo', 'miel', 5),
  ('wok-de-calamar-picante-con-chauchas-zanahoria-y-repollo', 'aceite', 10),
  ('wok-de-calamar-picante-con-chauchas-zanahoria-y-repollo', 'ajo', 1),
  ('wok-de-calamar-picante-con-chauchas-zanahoria-y-repollo', 'sesamo', 4),
  ('wok-de-tofu-al-teriyaki-con-brocoli-y-morron-sobre', 'tofu', 130),
  ('wok-de-tofu-al-teriyaki-con-brocoli-y-morron-sobre', 'brocoli', 110),
  ('wok-de-tofu-al-teriyaki-con-brocoli-y-morron-sobre', 'morron', 0.5),
  ('wok-de-tofu-al-teriyaki-con-brocoli-y-morron-sobre', 'fideos', 70),
  ('wok-de-tofu-al-teriyaki-con-brocoli-y-morron-sobre', 'salsa-teriyaki', 30),
  ('wok-de-tofu-al-teriyaki-con-brocoli-y-morron-sobre', 'aceite', 10),
  ('wok-de-tofu-al-teriyaki-con-brocoli-y-morron-sobre', 'ajo', 1),
  ('wok-de-tofu-al-teriyaki-con-brocoli-y-morron-sobre', 'sesamo', 4),
  ('wok-de-pavo-al-teriyaki-con-berenjena-morron-y-cebolla', 'pechuga-pavo', 150),
  ('wok-de-pavo-al-teriyaki-con-berenjena-morron-y-cebolla', 'berenjena', 0.5),
  ('wok-de-pavo-al-teriyaki-con-berenjena-morron-y-cebolla', 'morron', 0.5),
  ('wok-de-pavo-al-teriyaki-con-berenjena-morron-y-cebolla', 'cebolla-morada', 0.5),
  ('wok-de-pavo-al-teriyaki-con-berenjena-morron-y-cebolla', 'salsa-teriyaki', 30),
  ('wok-de-pavo-al-teriyaki-con-berenjena-morron-y-cebolla', 'aceite', 10),
  ('wok-de-pavo-al-teriyaki-con-berenjena-morron-y-cebolla', 'ajo', 1),
  ('wok-de-pavo-al-teriyaki-con-berenjena-morron-y-cebolla', 'sesamo', 4),
  ('salteado-de-tofu-con-miel-y-soja-con-zanahoria-cebolla', 'tofu', 130),
  ('salteado-de-tofu-con-miel-y-soja-con-zanahoria-cebolla', 'zanahoria', 1),
  ('salteado-de-tofu-con-miel-y-soja-con-zanahoria-cebolla', 'cebolla', 0.5),
  ('salteado-de-tofu-con-miel-y-soja-con-zanahoria-cebolla', 'morron', 0.5),
  ('salteado-de-tofu-con-miel-y-soja-con-zanahoria-cebolla', 'salsa-soja', 15),
  ('salteado-de-tofu-con-miel-y-soja-con-zanahoria-cebolla', 'miel', 8),
  ('salteado-de-tofu-con-miel-y-soja-con-zanahoria-cebolla', 'aceite', 10),
  ('salteado-de-tofu-con-miel-y-soja-con-zanahoria-cebolla', 'ajo', 1),
  ('salteado-de-tofu-con-miel-y-soja-con-zanahoria-cebolla', 'sesamo', 4),
  ('wok-de-huevo-con-salsa-de-mani-con-esparragos-y', 'huevo', 2),
  ('wok-de-huevo-con-salsa-de-mani-con-esparragos-y', 'esparragos', 100),
  ('wok-de-huevo-con-salsa-de-mani-con-esparragos-y', 'zanahoria', 1),
  ('wok-de-huevo-con-salsa-de-mani-con-esparragos-y', 'cebolla-verdeo', 15),
  ('wok-de-huevo-con-salsa-de-mani-con-esparragos-y', 'arroz', 65),
  ('wok-de-huevo-con-salsa-de-mani-con-esparragos-y', 'mani-pasta', 20),
  ('wok-de-huevo-con-salsa-de-mani-con-esparragos-y', 'salsa-soja', 10),
  ('wok-de-huevo-con-salsa-de-mani-con-esparragos-y', 'limon-exprimido', 10),
  ('wok-de-huevo-con-salsa-de-mani-con-esparragos-y', 'aceite', 10),
  ('wok-de-huevo-con-salsa-de-mani-con-esparragos-y', 'ajo', 1),
  ('wok-de-huevo-con-salsa-de-mani-con-esparragos-y', 'sesamo', 4),
  ('wok-de-pollo-al-limon-con-esparragos-y-zanahoria-sobre', 'pechuga-cruda', 150),
  ('wok-de-pollo-al-limon-con-esparragos-y-zanahoria-sobre', 'esparragos', 100),
  ('wok-de-pollo-al-limon-con-esparragos-y-zanahoria-sobre', 'zanahoria', 1),
  ('wok-de-pollo-al-limon-con-esparragos-y-zanahoria-sobre', 'cebolla-verdeo', 15),
  ('wok-de-pollo-al-limon-con-esparragos-y-zanahoria-sobre', 'arroz', 65),
  ('wok-de-pollo-al-limon-con-esparragos-y-zanahoria-sobre', 'salsa-soja', 10),
  ('wok-de-pollo-al-limon-con-esparragos-y-zanahoria-sobre', 'limon-exprimido', 20),
  ('wok-de-pollo-al-limon-con-esparragos-y-zanahoria-sobre', 'miel', 5),
  ('wok-de-pollo-al-limon-con-esparragos-y-zanahoria-sobre', 'aceite', 10),
  ('wok-de-pollo-al-limon-con-esparragos-y-zanahoria-sobre', 'ajo', 1),
  ('wok-de-pollo-al-limon-con-esparragos-y-zanahoria-sobre', 'sesamo', 4),
  ('wok-de-cuadril-con-miso-con-repollo-zanahoria-y-brotes', 'cuadril', 150),
  ('wok-de-cuadril-con-miso-con-repollo-zanahoria-y-brotes', 'repollo', 80),
  ('wok-de-cuadril-con-miso-con-repollo-zanahoria-y-brotes', 'zanahoria', 0.5),
  ('wok-de-cuadril-con-miso-con-repollo-zanahoria-y-brotes', 'brotes-soja', 40),
  ('wok-de-cuadril-con-miso-con-repollo-zanahoria-y-brotes', 'pasta-miso', 10),
  ('wok-de-cuadril-con-miso-con-repollo-zanahoria-y-brotes', 'vinagre-manzana', 5),
  ('wok-de-cuadril-con-miso-con-repollo-zanahoria-y-brotes', 'aceite', 10),
  ('wok-de-cuadril-con-miso-con-repollo-zanahoria-y-brotes', 'ajo', 1),
  ('wok-de-cuadril-con-miso-con-repollo-zanahoria-y-brotes', 'sesamo', 4),
  ('wok-de-carne-al-limon-con-repollo-colorado-zanahoria-y', 'bife-nalga', 150),
  ('wok-de-carne-al-limon-con-repollo-colorado-zanahoria-y', 'repollo-colorado', 80),
  ('wok-de-carne-al-limon-con-repollo-colorado-zanahoria-y', 'zanahoria', 0.5),
  ('wok-de-carne-al-limon-con-repollo-colorado-zanahoria-y', 'apio', 40),
  ('wok-de-carne-al-limon-con-repollo-colorado-zanahoria-y', 'cuscus', 60),
  ('wok-de-carne-al-limon-con-repollo-colorado-zanahoria-y', 'salsa-soja', 10),
  ('wok-de-carne-al-limon-con-repollo-colorado-zanahoria-y', 'limon-exprimido', 20),
  ('wok-de-carne-al-limon-con-repollo-colorado-zanahoria-y', 'miel', 5),
  ('wok-de-carne-al-limon-con-repollo-colorado-zanahoria-y', 'aceite', 10),
  ('wok-de-carne-al-limon-con-repollo-colorado-zanahoria-y', 'ajo', 1),
  ('wok-de-carne-al-limon-con-repollo-colorado-zanahoria-y', 'sesamo', 4),
  ('wok-de-salmon-agridulce-con-chauchas-zanahoria-y', 'salmon', 140),
  ('wok-de-salmon-agridulce-con-chauchas-zanahoria-y', 'chauchas', 80),
  ('wok-de-salmon-agridulce-con-chauchas-zanahoria-y', 'zanahoria', 0.5),
  ('wok-de-salmon-agridulce-con-chauchas-zanahoria-y', 'repollo', 70),
  ('wok-de-salmon-agridulce-con-chauchas-zanahoria-y', 'fideos', 70),
  ('wok-de-salmon-agridulce-con-chauchas-zanahoria-y', 'ketchup', 15),
  ('wok-de-salmon-agridulce-con-chauchas-zanahoria-y', 'salsa-soja', 10),
  ('wok-de-salmon-agridulce-con-chauchas-zanahoria-y', 'vinagre-manzana', 8),
  ('wok-de-salmon-agridulce-con-chauchas-zanahoria-y', 'azucar', 5),
  ('wok-de-salmon-agridulce-con-chauchas-zanahoria-y', 'aceite', 10),
  ('wok-de-salmon-agridulce-con-chauchas-zanahoria-y', 'ajo', 1),
  ('wok-de-salmon-agridulce-con-chauchas-zanahoria-y', 'sesamo', 4),
  ('wok-de-pollo-con-salsa-de-mani-con-mix-de-verduras', 'pechuga-cruda', 150),
  ('wok-de-pollo-con-salsa-de-mani-con-mix-de-verduras', 'verduras-wok', 220),
  ('wok-de-pollo-con-salsa-de-mani-con-mix-de-verduras', 'arroz-basmati', 65),
  ('wok-de-pollo-con-salsa-de-mani-con-mix-de-verduras', 'mani-pasta', 20),
  ('wok-de-pollo-con-salsa-de-mani-con-mix-de-verduras', 'salsa-soja', 10),
  ('wok-de-pollo-con-salsa-de-mani-con-mix-de-verduras', 'limon-exprimido', 10),
  ('wok-de-pollo-con-salsa-de-mani-con-mix-de-verduras', 'aceite', 10),
  ('wok-de-pollo-con-salsa-de-mani-con-mix-de-verduras', 'ajo', 1),
  ('wok-de-pollo-con-salsa-de-mani-con-mix-de-verduras', 'sesamo', 4),
  ('wok-de-tofu-con-salsa-de-mani-con-coliflor-y-zanahoria', 'tofu', 130),
  ('wok-de-tofu-con-salsa-de-mani-con-coliflor-y-zanahoria', 'coliflor', 100),
  ('wok-de-tofu-con-salsa-de-mani-con-coliflor-y-zanahoria', 'zanahoria', 1),
  ('wok-de-tofu-con-salsa-de-mani-con-coliflor-y-zanahoria', 'cebolla', 0.5),
  ('wok-de-tofu-con-salsa-de-mani-con-coliflor-y-zanahoria', 'fideos', 70),
  ('wok-de-tofu-con-salsa-de-mani-con-coliflor-y-zanahoria', 'mani-pasta', 20),
  ('wok-de-tofu-con-salsa-de-mani-con-coliflor-y-zanahoria', 'salsa-soja', 10),
  ('wok-de-tofu-con-salsa-de-mani-con-coliflor-y-zanahoria', 'limon-exprimido', 10),
  ('wok-de-tofu-con-salsa-de-mani-con-coliflor-y-zanahoria', 'aceite', 10),
  ('wok-de-tofu-con-salsa-de-mani-con-coliflor-y-zanahoria', 'ajo', 1),
  ('wok-de-tofu-con-salsa-de-mani-con-coliflor-y-zanahoria', 'sesamo', 4),
  ('wok-de-carne-con-miel-y-soja-con-esparragos-y-zanahoria', 'bife-nalga', 150),
  ('wok-de-carne-con-miel-y-soja-con-esparragos-y-zanahoria', 'esparragos', 100),
  ('wok-de-carne-con-miel-y-soja-con-esparragos-y-zanahoria', 'zanahoria', 1),
  ('wok-de-carne-con-miel-y-soja-con-esparragos-y-zanahoria', 'cebolla-verdeo', 15),
  ('wok-de-carne-con-miel-y-soja-con-esparragos-y-zanahoria', 'cuscus', 60),
  ('wok-de-carne-con-miel-y-soja-con-esparragos-y-zanahoria', 'salsa-soja', 15),
  ('wok-de-carne-con-miel-y-soja-con-esparragos-y-zanahoria', 'miel', 8),
  ('wok-de-carne-con-miel-y-soja-con-esparragos-y-zanahoria', 'aceite', 10),
  ('wok-de-carne-con-miel-y-soja-con-esparragos-y-zanahoria', 'ajo', 1),
  ('wok-de-carne-con-miel-y-soja-con-esparragos-y-zanahoria', 'sesamo', 4),
  ('wok-de-pollo-con-miso-con-zapallito-morron-y-cebolla', 'pechuga-cruda', 150),
  ('wok-de-pollo-con-miso-con-zapallito-morron-y-cebolla', 'zapallito', 0.5),
  ('wok-de-pollo-con-miso-con-zapallito-morron-y-cebolla', 'morron', 0.5),
  ('wok-de-pollo-con-miso-con-zapallito-morron-y-cebolla', 'cebolla', 0.5),
  ('wok-de-pollo-con-miso-con-zapallito-morron-y-cebolla', 'pasta-miso', 10),
  ('wok-de-pollo-con-miso-con-zapallito-morron-y-cebolla', 'vinagre-manzana', 5),
  ('wok-de-pollo-con-miso-con-zapallito-morron-y-cebolla', 'aceite', 10),
  ('wok-de-pollo-con-miso-con-zapallito-morron-y-cebolla', 'ajo', 1),
  ('wok-de-pollo-con-miso-con-zapallito-morron-y-cebolla', 'sesamo', 4),
  ('wok-de-carne-con-salsa-de-mani-con-coliflor-y-zanahoria', 'bife-nalga', 150),
  ('wok-de-carne-con-salsa-de-mani-con-coliflor-y-zanahoria', 'coliflor', 100),
  ('wok-de-carne-con-salsa-de-mani-con-coliflor-y-zanahoria', 'zanahoria', 1),
  ('wok-de-carne-con-salsa-de-mani-con-coliflor-y-zanahoria', 'cebolla', 0.5),
  ('wok-de-carne-con-salsa-de-mani-con-coliflor-y-zanahoria', 'mani-pasta', 20),
  ('wok-de-carne-con-salsa-de-mani-con-coliflor-y-zanahoria', 'salsa-soja', 10),
  ('wok-de-carne-con-salsa-de-mani-con-coliflor-y-zanahoria', 'limon-exprimido', 10),
  ('wok-de-carne-con-salsa-de-mani-con-coliflor-y-zanahoria', 'aceite', 10),
  ('wok-de-carne-con-salsa-de-mani-con-coliflor-y-zanahoria', 'ajo', 1),
  ('wok-de-carne-con-salsa-de-mani-con-coliflor-y-zanahoria', 'sesamo', 4),
  ('wok-de-langostinos-con-miso-con-zanahoria-cebolla-y', 'langostinos', 130),
  ('wok-de-langostinos-con-miso-con-zanahoria-cebolla-y', 'zanahoria', 1),
  ('wok-de-langostinos-con-miso-con-zanahoria-cebolla-y', 'cebolla', 0.5),
  ('wok-de-langostinos-con-miso-con-zanahoria-cebolla-y', 'morron', 0.5),
  ('wok-de-langostinos-con-miso-con-zanahoria-cebolla-y', 'cuscus', 60),
  ('wok-de-langostinos-con-miso-con-zanahoria-cebolla-y', 'pasta-miso', 10),
  ('wok-de-langostinos-con-miso-con-zanahoria-cebolla-y', 'vinagre-manzana', 5),
  ('wok-de-langostinos-con-miso-con-zanahoria-cebolla-y', 'aceite', 10),
  ('wok-de-langostinos-con-miso-con-zanahoria-cebolla-y', 'ajo', 1),
  ('wok-de-langostinos-con-miso-con-zanahoria-cebolla-y', 'sesamo', 4)
) as v(recipe_slug, food_slug, qty)
join public.recipes r on r.slug = v.recipe_slug
join public.foods f on f.slug = v.food_slug
on conflict do nothing;
