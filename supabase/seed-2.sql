-- Segunda tanda: bebidas, más alimentos y más recetas. Generado con scripts/gen-seed.mjs

insert into public.foods (slug, name, unit, unit_grams, unit_label, kcal, protein, carbs, fat, category) values
  ('agua', 'Agua', 'ml', null, null, 0, 0, 0, 0, 'Bebidas'),
  ('soda', 'Soda o agua con gas', 'ml', null, null, 0, 0, 0, 0, 'Bebidas'),
  ('agua-saborizada', 'Agua saborizada con azúcar', 'ml', null, null, 18, 0, 4.5, 0, 'Bebidas'),
  ('agua-saborizada-zero', 'Agua saborizada sin azúcar', 'ml', null, null, 1, 0, 0.2, 0, 'Bebidas'),
  ('tonica', 'Agua tónica', 'ml', null, null, 34, 0, 8.5, 0, 'Bebidas'),
  ('jugo-polvo', 'Jugo en polvo preparado', 'ml', null, null, 10, 0, 2.3, 0, 'Bebidas'),
  ('jugo-caja', 'Jugo de caja o botella', 'ml', null, null, 45, 0.3, 11, 0, 'Bebidas'),
  ('limonada', 'Limonada con azúcar', 'ml', null, null, 40, 0, 10, 0, 'Bebidas'),
  ('isotonica', 'Bebida isotónica (tipo Gatorade)', 'ml', null, null, 24, 0, 6, 0, 'Bebidas'),
  ('energizante', 'Energizante (tipo Speed o Red Bull)', 'ml', null, null, 45, 0, 11, 0, 'Bebidas'),
  ('energizante-zero', 'Energizante sin azúcar', 'ml', null, null, 3, 0, 0, 0, 'Bebidas'),
  ('cafe-con-leche', 'Café con leche', 'ml', null, null, 25, 1.6, 2.4, 0.8, 'Bebidas'),
  ('chocolatada', 'Leche chocolatada', 'ml', null, null, 75, 3, 12, 1.8, 'Bebidas'),
  ('licuado-banana', 'Licuado de banana con leche', 'ml', null, null, 70, 2.5, 12, 1.3, 'Bebidas'),
  ('yogur-bebible', 'Yogur bebible', 'ml', null, null, 75, 2.8, 12.5, 1.5, 'Bebidas'),
  ('cerveza-negra', 'Cerveza negra', 'ml', null, null, 55, 0.5, 5, 0, 'Bebidas'),
  ('cerveza-ipa', 'Cerveza IPA o artesanal', 'ml', null, null, 55, 0.5, 4.5, 0, 'Bebidas'),
  ('cerveza-sin-alcohol', 'Cerveza sin alcohol', 'ml', null, null, 25, 0.3, 5.5, 0, 'Bebidas'),
  ('vino-blanco', 'Vino blanco o rosado', 'ml', null, null, 80, 0, 2, 0, 'Bebidas'),
  ('espumante', 'Espumante o champagne', 'ml', null, null, 78, 0, 1.5, 0, 'Bebidas'),
  ('sidra', 'Sidra', 'ml', null, null, 50, 0, 5, 0, 'Bebidas'),
  ('fernet', 'Fernet solo', 'ml', null, null, 240, 0, 8, 0, 'Bebidas'),
  ('bebida-blanca', 'Vodka, gin, whisky o ron (solo)', 'ml', null, null, 222, 0, 0, 0, 'Bebidas'),
  ('gin-tonic', 'Gin tonic', 'ml', null, null, 80, 0, 6.4, 0, 'Bebidas'),
  ('ron-cola', 'Ron con coca (cuba libre)', 'ml', null, null, 75, 0, 7.5, 0, 'Bebidas'),
  ('campari', 'Campari u otro bitter (solo)', 'ml', null, null, 230, 0, 24, 0, 'Bebidas'),
  ('aperol-spritz', 'Aperol spritz', 'ml', null, null, 90, 0, 8, 0, 'Bebidas'),
  ('vermut', 'Vermut (Cinzano, Gancia)', 'ml', null, null, 140, 0, 12, 0, 'Bebidas'),
  ('trago-dulce', 'Trago dulce (daiquiri, mojito, caipirinha)', 'ml', null, null, 120, 0, 12, 0, 'Bebidas'),
  ('licor', 'Licor dulce', 'ml', null, null, 280, 0, 30, 0, 'Bebidas'),
  ('pechuga-cruda', 'Pechuga de pollo (cruda)', 'g', null, null, 110, 23, 0, 1.5, 'Proteínas'),
  ('carne-picada-cruda', 'Carne picada (cruda)', 'g', null, null, 200, 19, 0, 13, 'Proteínas'),
  ('bife-nalga', 'Bife de nalga o cuadrada (crudo)', 'g', null, null, 130, 21, 0, 5, 'Proteínas'),
  ('milanesa-carne', 'Milanesa de carne al horno', 'u', 120, 'unidad', 240, 20, 12, 12, 'Proteínas'),
  ('filet-merluza', 'Filet de merluza (crudo)', 'g', null, null, 85, 18, 0, 1, 'Proteínas'),
  ('garbanzos', 'Garbanzos en lata', 'g', null, null, 120, 7, 18, 2, 'Proteínas'),
  ('milanesa-soja', 'Milanesa de soja', 'u', 85, 'unidad', 200, 15, 15, 8, 'Proteínas'),
  ('polenta', 'Polenta (harina de maíz)', 'g', null, null, 350, 8, 77, 1.5, 'Carbohidratos'),
  ('tapa-tarta', 'Tapa de tarta', 'u', 200, 'unidad', 300, 6, 45, 10, 'Carbohidratos'),
  ('galleta-arroz', 'Galleta de arroz', 'u', 9, 'unidad', 385, 8, 81, 3, 'Carbohidratos'),
  ('pan-rallado', 'Pan rallado', 'g', null, null, 370, 11, 73, 3, 'Carbohidratos'),
  ('palta', 'Palta', 'u', 150, 'unidad', 160, 2, 9, 15, 'Verduras'),
  ('acelga', 'Acelga o espinaca', 'g', null, null, 22, 2.5, 3.5, 0.3, 'Verduras'),
  ('brocoli', 'Brócoli', 'g', null, null, 34, 2.8, 7, 0.4, 'Verduras'),
  ('pera', 'Pera', 'u', 150, 'unidad', 57, 0.4, 15, 0.1, 'Frutas'),
  ('durazno', 'Durazno', 'u', 130, 'unidad', 39, 0.9, 10, 0.3, 'Frutas'),
  ('frutilla', 'Frutillas', 'g', null, null, 32, 0.7, 7.7, 0.3, 'Frutas'),
  ('uva', 'Uvas', 'g', null, null, 69, 0.7, 18, 0.2, 'Frutas'),
  ('queso-port-salut', 'Queso port salut light', 'g', null, null, 230, 24, 2, 14, 'Lácteos'),
  ('ricota', 'Ricota', 'g', null, null, 150, 11, 3, 10, 'Lácteos'),
  ('crema', 'Crema de leche', 'g', null, null, 340, 2, 3, 35, 'Lácteos'),
  ('yogur-saborizado', 'Yogur saborizado', 'g', null, null, 90, 3.5, 14, 2.5, 'Lácteos'),
  ('salsa-soja', 'Salsa de soja', 'ml', null, null, 55, 8, 5, 0, 'Despensa'),
  ('mermelada', 'Mermelada', 'g', null, null, 250, 0.4, 62, 0, 'Despensa'),
  ('mermelada-light', 'Mermelada light', 'g', null, null, 120, 0.4, 30, 0, 'Despensa'),
  ('cacao', 'Cacao en polvo azucarado', 'g', null, null, 380, 4, 88, 2.5, 'Despensa'),
  ('aceitunas', 'Aceitunas', 'g', null, null, 145, 1, 4, 15, 'Despensa'),
  ('ketchup', 'Ketchup', 'g', null, null, 100, 1.2, 25, 0.1, 'Despensa'),
  ('nueces', 'Nueces', 'g', null, null, 650, 15, 14, 65, 'Snacks'),
  ('almendras', 'Almendras', 'g', null, null, 580, 21, 22, 50, 'Snacks'),
  ('barrita-cereal', 'Barrita de cereal', 'u', 23, 'unidad', 390, 6, 70, 9, 'Snacks'),
  ('turron', 'Turrón de maní', 'u', 25, 'unidad', 400, 9, 70, 10, 'Snacks'),
  ('papas-paquete', 'Papas fritas de paquete', 'g', null, null, 540, 6, 52, 34, 'Snacks'),
  ('sandwich-miga', 'Sándwich de miga', 'u', 60, 'unidad', 250, 9, 28, 11, 'Comidas hechas'),
  ('pancho', 'Pancho', 'u', 150, 'unidad', 250, 9, 24, 13, 'Comidas hechas'),
  ('choripan', 'Choripán', 'u', 250, 'unidad', 300, 13, 20, 18, 'Comidas hechas'),
  ('asado', 'Asado (carne)', 'g', null, null, 280, 24, 0, 20, 'Comidas hechas'),
  ('tarta-porcion', 'Tarta de jamón y queso (porción)', 'u', 150, 'porción', 250, 10, 20, 14, 'Comidas hechas'),
  ('sushi', 'Sushi (pieza)', 'u', 30, 'pieza', 150, 5, 25, 3, 'Comidas hechas'),
  ('wrap-comprado', 'Wrap de pollo comprado (estimado)', 'u', 300, 'unidad', 200, 11, 20, 8, 'Comidas hechas')
on conflict (slug) do nothing;

insert into public.recipes (slug, name, minutes, servings, meal_types, portable, steps) values
  ('desayuno-tostadas-untable', 'Tostadas con queso untable y mermelada light', 3, 1, '{desayuno}', false, 'Tostás el pan.
Untás el queso y la mermelada. Va con café con leche o mate.'),
  ('desayuno-yogur-avena', 'Yogur con avena y banana', 2, 1, '{desayuno}', true, 'Mezclás el yogur con la avena.
Banana cortada arriba. Se puede dejar armado la noche anterior.'),
  ('desayuno-copos', 'Copos de maíz con leche y banana', 2, 1, '{desayuno}', false, 'Copos con la leche fría o tibia.
Banana cortada arriba.'),
  ('desayuno-tostado', 'Tostado de jamón y queso con café con leche', 5, 1, '{desayuno}', true, 'Armás el sándwich con el jamón y el queso.
Lo tostás en sartén o tostadora, 2 min por lado.
Café con la leche.'),
  ('desayuno-palta-huevo', 'Tostadas con palta y huevo', 6, 1, '{desayuno}', false, 'Tostás el pan y pisás la media palta arriba, con sal.
Huevos revueltos o a la plancha, sin aceite.'),
  ('desayuno-licuado', 'Licuado de banana, leche y avena', 3, 1, '{desayuno}', false, 'Todo a la licuadora, 30 segundos. Sin azúcar.'),
  ('merienda-tostadas', 'Tostadas con queso untable', 3, 1, '{merienda}', true, 'Tostás el pan y untás el queso. Con mate o café sin azúcar.'),
  ('merienda-yogur-fruta', 'Yogur natural con manzana y avena', 2, 1, '{merienda}', true, 'Yogur con la manzana en cubos y la avena.'),
  ('merienda-sandwich', 'Sándwich de jamón y queso', 2, 1, '{merienda}', true, 'Pan, jamón y queso. Frío o tostado.'),
  ('merienda-fruta-nueces', 'Manzana con nueces', 1, 1, '{merienda}', true, '1 manzana y un puñado chico de nueces (25 g).'),
  ('merienda-galletas-arroz', 'Café con leche y galletas de arroz con queso', 3, 1, '{merienda}', false, 'Café con la leche, sin azúcar.
Galletas de arroz con el queso untable.'),
  ('merienda-huevos-banana', 'Huevos duros y banana', 1, 1, '{merienda}', true, '2 huevos duros (hechos de antes) y 1 banana.'),
  ('pechuga-ensalada', 'Pechuga a la plancha con ensalada', 12, 1, '{almuerzo,cena}', true, 'Pechuga fileteada fina, con sal y limón, a la plancha: 4–5 min por lado.
Ensalada de lechuga y tomate con el aceite.
Va con las 2 rodajas de pan.'),
  ('pechuga-arroz', 'Pechuga con arroz', 20, 1, '{almuerzo,cena}', true, 'Hervís el arroz.
Pechuga en cubos o fileteada, a la plancha con el aceite, sal y pimentón.
Tomate en rodajas al lado.'),
  ('pechuga-pure', 'Pechuga con puré de papa', 25, 1, '{almuerzo,cena}', true, 'Papas en cubos, hervidas 15 min. Las pisás con la leche y sal.
Pechuga a la plancha con el aceite, 4–5 min por lado.'),
  ('salteado-pollo', 'Salteado de pollo con arroz y verduras', 20, 1, '{almuerzo,cena}', true, 'Hervís el arroz.
Pollo en tiras a la sartén con el aceite, 5 min.
Sumás zanahoria rallada, morrón y cebolla en tiras, 5 min más.
Salsa de soja y mezclás con el arroz.'),
  ('pollo-brocoli', 'Pollo con brócoli y arroz', 20, 1, '{almuerzo,cena}', true, 'Hervís el arroz y el brócoli (5 min, que quede firme).
Pollo en cubos a la sartén con el aceite.
Juntás todo con la salsa de soja.'),
  ('pata-muslo-calabaza', 'Pata muslo al horno con calabaza', 55, 4, '{almuerzo,cena}', true, 'Horno a 200 °C. Pollo con sal, pimentón y ajo en una placa: 50–55 min.
Calabaza en cubos grandes con el aceite, en la misma placa o en otra: 35–40 min.
Porción: 1 pata sin piel con calabaza.'),
  ('fideos-bolonesa', 'Fideos con boloñesa casera', 25, 3, '{almuerzo,cena}', true, 'Rehogás la cebolla picada con el aceite y dorás la carne.
Agregás el puré de tomate, sal y orégano: 15 min a fuego bajo.
Hervís los fideos y servís con queso rallado. Sin pan.'),
  ('hamburguesas-caseras', 'Hamburguesas caseras con ensalada', 20, 2, '{almuerzo,cena}', true, 'Mezclás la carne con el huevo, el pan rallado, sal y ajo. Armás 4 hamburguesas.
A la plancha o al horno, 4–5 min por lado.
Ensalada de lechuga y tomate con el aceite.'),
  ('pastel-papa', 'Pastel de papa', 50, 4, '{almuerzo,cena}', true, 'Hervís las papas y hacés un puré con la leche.
Rehogás la cebolla con el aceite, dorás la carne y sumás los huevos duros picados.
En una fuente: carne abajo, puré arriba y queso rallado. Horno 200 °C, 15 min.'),
  ('bife-ensalada', 'Bife a la plancha con ensalada', 10, 1, '{almuerzo,cena}', true, 'Bife a la plancha bien caliente, 3–4 min por lado, sal al final.
Ensalada de lechuga y tomate con el aceite.
Va con las 2 rodajas de pan.'),
  ('bife-pure-calabaza', 'Bife con puré de calabaza', 25, 1, '{almuerzo,cena}', true, 'Calabaza en cubos, hervida o al microondas, 12–15 min. La pisás con sal y el queso rallado.
Bife a la plancha con el aceite, 3–4 min por lado.'),
  ('milanesa-carne-pure', 'Milanesa de carne al horno con puré', 25, 1, '{almuerzo,cena}', true, 'Milanesa al horno a 200 °C, 20 min, dándola vuelta a la mitad.
Puré: papas hervidas y pisadas con la leche.
Tomate en rodajas al lado.'),
  ('arroz-atun-huevo', 'Arroz con atún y huevo', 15, 1, '{almuerzo,cena}', true, 'Hervís el arroz y el huevo (10 min).
Mezclás el arroz con el atún escurrido, las arvejas y el aceite.
Huevo duro picado arriba.'),
  ('ensalada-arroz-atun', 'Ensalada de arroz, atún y choclo', 15, 1, '{almuerzo,cena}', true, 'Hervís el arroz y lo enfriás con agua.
Mezclás con el atún, el choclo, el tomate en cubos y el huevo duro.
Aceite, sal y limón o vinagre.'),
  ('ensalada-lentejas', 'Ensalada de lentejas, huevo y tomate', 30, 1, '{almuerzo,cena}', true, 'Hervís las lentejas 25 min, sin remojo, y las escurrís.
Mezclás con el tomate en cubos y los huevos duros.
Aceite, sal y vinagre.'),
  ('ensalada-garbanzos', 'Ensalada de garbanzos, atún y tomate', 5, 1, '{almuerzo,cena}', true, 'Escurrís los garbanzos y el atún.
Mezclás con el tomate en cubos, el aceite, sal y limón.'),
  ('ensalada-cesar', 'Ensalada César simple', 15, 1, '{almuerzo,cena}', true, 'Pechuga a la plancha y cortada en tiras.
Pan tostado en cubos.
Lechuga, pollo, pan, huevo duro y queso rallado, con el aceite y limón.'),
  ('tarta-atun', 'Tarta de atún', 40, 3, '{almuerzo,cena}', true, 'Tapa en una tartera. Mezclás el atún, la cebolla rehogada, los huevos batidos y el queso en cubos.
Relleno adentro, tomate en rodajas arriba.
Horno a 180 °C, 30 min.'),
  ('tarta-jamon-queso', 'Tarta de jamón y queso', 35, 3, '{almuerzo,cena}', true, 'Tapa en una tartera. Jamón y queso en capas.
Huevos batidos con sal por arriba.
Horno a 180 °C, 25–30 min.'),
  ('tarta-acelga', 'Tarta de acelga y ricota', 40, 3, '{almuerzo,cena}', true, 'Hervís la acelga 3 min, la escurrís bien y la picás.
Mezclás con la ricota, los huevos y el queso rallado.
Relleno sobre la tapa. Horno a 180 °C, 30 min.'),
  ('fideos-tuco', 'Fideos con tuco, huevo y queso', 15, 1, '{almuerzo,cena}', true, 'Hervís los fideos y los huevos.
Calentás el puré de tomate con el aceite, sal y orégano, 5 min.
Fideos con la salsa, huevo duro picado y queso rallado. Sin pan.'),
  ('revuelto-zapallitos', 'Revuelto de zapallitos con huevo', 15, 1, '{almuerzo,cena}', false, 'Cebolla y zapallitos en cubos chicos a la sartén con el aceite, 8 min.
Agregás los huevos batidos y revolvés hasta que cuajen.
Queso rallado arriba. Va con las 2 rodajas de pan.'),
  ('merluza-papas', 'Merluza al horno con papas', 30, 1, '{almuerzo,cena}', true, 'Papas en rodajas finas en una placa con el aceite y sal: 15 min a 200 °C.
Sumás la merluza arriba con sal y limón: 12–15 min más.'),
  ('merluza-ensalada', 'Merluza a la plancha con ensalada', 12, 1, '{almuerzo,cena}', false, 'Merluza a la plancha con sal y limón, 3–4 min por lado.
Ensalada de lechuga y tomate con el aceite.
Va con las 2 rodajas de pan.'),
  ('polenta-salsa', 'Polenta con salsa, queso y huevo', 12, 1, '{almuerzo,cena}', false, 'Polenta en lluvia sobre agua hirviendo con sal, revolviendo 3–5 min.
Calentás el puré de tomate con orégano.
Polenta, salsa, queso en cubos, huevo duro y queso rallado.'),
  ('guiso-arroz-pollo', 'Guiso de arroz con pollo', 35, 3, '{almuerzo,cena}', true, 'Rehogás la cebolla y la zanahoria rallada con el aceite.
Sumás el pollo sin piel, el puré de tomate, el caldo y 700 ml de agua: 15 min.
Agregás el arroz y cocinás 15 min más. Desmenuzás el pollo.'),
  ('guiso-fideos-carne', 'Guiso de fideos con carne', 30, 3, '{almuerzo,cena}', true, 'Rehogás la cebolla y la zanahoria rallada con el aceite y dorás la carne.
Sumás el puré de tomate, el caldo y 700 ml de agua: 10 min.
Agregás los fideos y cocinás hasta que estén.'),
  ('wrap-pollo', 'Wrap de pollo', 15, 1, '{almuerzo,cena}', true, 'Pechuga en tiras a la plancha.
Untás las rapiditas con el queso y armás con el pollo, la lechuga y el tomate.'),
  ('wrap-atun', 'Wrap de atún y huevo', 5, 1, '{almuerzo,cena}', true, 'Untás las rapiditas con el queso.
Atún escurrido, huevo duro picado, lechuga y tomate. Enrollás.'),
  ('sandwich-pollo', 'Sándwich de pollo, huevo y tomate', 12, 1, '{almuerzo,cena}', true, 'Pechuga a la plancha.
Armás 2 sándwiches con el pollo, huevo duro, tomate, lechuga y mostaza.'),
  ('tortilla-papa', 'Tortilla de papa', 25, 2, '{almuerzo,cena}', true, 'Papas en cubitos al microondas con un chorrito de agua, tapadas, 8 min.
Cebolla rehogada con parte del aceite. Mezclás todo con los huevos batidos y sal.
Sartén con el resto del aceite, fuego bajo, 5 min por lado.
Va con tomate en rodajas.'),
  ('omelette-jamon-queso', 'Omelette de jamón y queso con ensalada', 6, 1, '{almuerzo,cena}', false, 'Batís los huevos con sal.
Sartén antiadherente, huevos, jamón y queso en el medio y doblás: 3–4 min.
Ensalada de lechuga y tomate, con las 2 rodajas de pan.'),
  ('arroz-huevo-arvejas', 'Arroz con huevo y arvejas', 15, 1, '{almuerzo,cena}', true, 'Hervís el arroz.
Huevos revueltos en la sartén con el aceite.
Mezclás arroz, huevo y arvejas, con sal y pimentón.'),
  ('pizzetas-rapidita', 'Pizzetas de rapidita', 10, 1, '{almuerzo,cena}', false, 'Rapiditas en una placa. Puré de tomate con orégano, queso y jamón arriba.
Horno fuerte 6–8 min, hasta que se derrita el queso.'),
  ('milanesas-soja-arroz', 'Milanesas de soja con arroz y ensalada', 20, 1, '{almuerzo,cena}', true, 'Milanesas al horno a 200 °C, 15 min, dándolas vuelta.
Hervís el arroz.
Ensalada de lechuga y tomate con el aceite.')
on conflict (slug) do nothing;

insert into public.recipe_items (recipe_id, food_id, qty)
select r.id, f.id, v.qty from (values
  ('desayuno-tostadas-untable', 'pan-integral', 2),
  ('desayuno-tostadas-untable', 'queso-untable', 30),
  ('desayuno-tostadas-untable', 'mermelada-light', 20),
  ('desayuno-tostadas-untable', 'leche', 200),
  ('desayuno-yogur-avena', 'yogur-natural', 200),
  ('desayuno-yogur-avena', 'avena', 40),
  ('desayuno-yogur-avena', 'banana', 1),
  ('desayuno-copos', 'copos-maiz', 40),
  ('desayuno-copos', 'leche', 250),
  ('desayuno-copos', 'banana', 1),
  ('desayuno-tostado', 'pan-integral', 2),
  ('desayuno-tostado', 'jamon-cocido', 40),
  ('desayuno-tostado', 'queso-cremoso', 30),
  ('desayuno-tostado', 'leche', 150),
  ('desayuno-palta-huevo', 'pan-integral', 2),
  ('desayuno-palta-huevo', 'palta', 0.5),
  ('desayuno-palta-huevo', 'huevo', 2),
  ('desayuno-licuado', 'banana', 1),
  ('desayuno-licuado', 'leche', 300),
  ('desayuno-licuado', 'avena', 30),
  ('merienda-tostadas', 'pan-integral', 2),
  ('merienda-tostadas', 'queso-untable', 40),
  ('merienda-yogur-fruta', 'yogur-natural', 200),
  ('merienda-yogur-fruta', 'manzana', 1),
  ('merienda-yogur-fruta', 'avena', 20),
  ('merienda-sandwich', 'pan-integral', 2),
  ('merienda-sandwich', 'jamon-cocido', 40),
  ('merienda-sandwich', 'queso-cremoso', 30),
  ('merienda-fruta-nueces', 'manzana', 1),
  ('merienda-fruta-nueces', 'nueces', 25),
  ('merienda-galletas-arroz', 'leche', 200),
  ('merienda-galletas-arroz', 'galleta-arroz', 3),
  ('merienda-galletas-arroz', 'queso-untable', 30),
  ('merienda-huevos-banana', 'huevo', 2),
  ('merienda-huevos-banana', 'banana', 1),
  ('pechuga-ensalada', 'pechuga-cruda', 180),
  ('pechuga-ensalada', 'lechuga', 100),
  ('pechuga-ensalada', 'tomate', 1),
  ('pechuga-ensalada', 'aceite', 10),
  ('pechuga-ensalada', 'pan-integral', 2),
  ('pechuga-arroz', 'pechuga-cruda', 180),
  ('pechuga-arroz', 'arroz', 70),
  ('pechuga-arroz', 'tomate', 1),
  ('pechuga-arroz', 'aceite', 5),
  ('pechuga-pure', 'pechuga-cruda', 180),
  ('pechuga-pure', 'papa', 300),
  ('pechuga-pure', 'leche', 50),
  ('pechuga-pure', 'aceite', 5),
  ('salteado-pollo', 'pechuga-cruda', 150),
  ('salteado-pollo', 'arroz', 70),
  ('salteado-pollo', 'zanahoria', 1),
  ('salteado-pollo', 'morron', 0.5),
  ('salteado-pollo', 'cebolla', 0.5),
  ('salteado-pollo', 'salsa-soja', 15),
  ('salteado-pollo', 'aceite', 10),
  ('pollo-brocoli', 'pechuga-cruda', 180),
  ('pollo-brocoli', 'brocoli', 200),
  ('pollo-brocoli', 'arroz', 60),
  ('pollo-brocoli', 'salsa-soja', 10),
  ('pollo-brocoli', 'aceite', 5),
  ('pata-muslo-calabaza', 'pata-muslo', 4),
  ('pata-muslo-calabaza', 'calabaza', 800),
  ('pata-muslo-calabaza', 'aceite', 10),
  ('fideos-bolonesa', 'fideos', 240),
  ('fideos-bolonesa', 'carne-picada-cruda', 300),
  ('fideos-bolonesa', 'pure-tomate', 520),
  ('fideos-bolonesa', 'cebolla', 1),
  ('fideos-bolonesa', 'aceite', 10),
  ('fideos-bolonesa', 'queso-rallado', 30),
  ('hamburguesas-caseras', 'carne-picada-cruda', 300),
  ('hamburguesas-caseras', 'huevo', 1),
  ('hamburguesas-caseras', 'pan-rallado', 20),
  ('hamburguesas-caseras', 'lechuga', 150),
  ('hamburguesas-caseras', 'tomate', 2),
  ('hamburguesas-caseras', 'aceite', 10),
  ('pastel-papa', 'carne-picada-cruda', 500),
  ('pastel-papa', 'papa', 1000),
  ('pastel-papa', 'cebolla', 1),
  ('pastel-papa', 'huevo', 2),
  ('pastel-papa', 'leche', 100),
  ('pastel-papa', 'aceite', 10),
  ('pastel-papa', 'queso-rallado', 40),
  ('bife-ensalada', 'bife-nalga', 180),
  ('bife-ensalada', 'lechuga', 100),
  ('bife-ensalada', 'tomate', 1),
  ('bife-ensalada', 'aceite', 10),
  ('bife-ensalada', 'pan-integral', 2),
  ('bife-pure-calabaza', 'bife-nalga', 180),
  ('bife-pure-calabaza', 'calabaza', 300),
  ('bife-pure-calabaza', 'aceite', 5),
  ('bife-pure-calabaza', 'queso-rallado', 10),
  ('milanesa-carne-pure', 'milanesa-carne', 1),
  ('milanesa-carne-pure', 'papa', 300),
  ('milanesa-carne-pure', 'leche', 50),
  ('milanesa-carne-pure', 'tomate', 1),
  ('arroz-atun-huevo', 'arroz', 80),
  ('arroz-atun-huevo', 'atun-natural', 1),
  ('arroz-atun-huevo', 'huevo', 1),
  ('arroz-atun-huevo', 'arvejas', 60),
  ('arroz-atun-huevo', 'aceite', 5),
  ('ensalada-arroz-atun', 'arroz', 70),
  ('ensalada-arroz-atun', 'atun-natural', 1),
  ('ensalada-arroz-atun', 'choclo', 80),
  ('ensalada-arroz-atun', 'tomate', 1),
  ('ensalada-arroz-atun', 'huevo', 1),
  ('ensalada-arroz-atun', 'aceite', 5),
  ('ensalada-lentejas', 'lentejas', 80),
  ('ensalada-lentejas', 'huevo', 2),
  ('ensalada-lentejas', 'tomate', 1),
  ('ensalada-lentejas', 'aceite', 10),
  ('ensalada-garbanzos', 'garbanzos', 200),
  ('ensalada-garbanzos', 'atun-natural', 1),
  ('ensalada-garbanzos', 'tomate', 1),
  ('ensalada-garbanzos', 'aceite', 10),
  ('ensalada-cesar', 'pechuga-cruda', 150),
  ('ensalada-cesar', 'lechuga', 150),
  ('ensalada-cesar', 'queso-rallado', 20),
  ('ensalada-cesar', 'pan-integral', 2),
  ('ensalada-cesar', 'huevo', 1),
  ('ensalada-cesar', 'aceite', 10),
  ('tarta-atun', 'tapa-tarta', 1),
  ('tarta-atun', 'atun-natural', 2),
  ('tarta-atun', 'huevo', 3),
  ('tarta-atun', 'cebolla', 1),
  ('tarta-atun', 'queso-cremoso', 100),
  ('tarta-atun', 'tomate', 1),
  ('tarta-jamon-queso', 'tapa-tarta', 1),
  ('tarta-jamon-queso', 'jamon-cocido', 150),
  ('tarta-jamon-queso', 'queso-cremoso', 150),
  ('tarta-jamon-queso', 'huevo', 3),
  ('tarta-acelga', 'tapa-tarta', 1),
  ('tarta-acelga', 'acelga', 400),
  ('tarta-acelga', 'ricota', 250),
  ('tarta-acelga', 'huevo', 2),
  ('tarta-acelga', 'queso-rallado', 30),
  ('fideos-tuco', 'fideos', 90),
  ('fideos-tuco', 'pure-tomate', 150),
  ('fideos-tuco', 'huevo', 2),
  ('fideos-tuco', 'queso-rallado', 20),
  ('fideos-tuco', 'aceite', 5),
  ('revuelto-zapallitos', 'zapallito', 2),
  ('revuelto-zapallitos', 'huevo', 3),
  ('revuelto-zapallitos', 'cebolla', 0.5),
  ('revuelto-zapallitos', 'queso-rallado', 15),
  ('revuelto-zapallitos', 'aceite', 5),
  ('revuelto-zapallitos', 'pan-integral', 2),
  ('merluza-papas', 'filet-merluza', 250),
  ('merluza-papas', 'papa', 300),
  ('merluza-papas', 'aceite', 10),
  ('merluza-ensalada', 'filet-merluza', 250),
  ('merluza-ensalada', 'lechuga', 100),
  ('merluza-ensalada', 'tomate', 1),
  ('merluza-ensalada', 'aceite', 10),
  ('merluza-ensalada', 'pan-integral', 2),
  ('polenta-salsa', 'polenta', 80),
  ('polenta-salsa', 'pure-tomate', 150),
  ('polenta-salsa', 'queso-cremoso', 50),
  ('polenta-salsa', 'huevo', 1),
  ('polenta-salsa', 'queso-rallado', 10),
  ('guiso-arroz-pollo', 'arroz', 240),
  ('guiso-arroz-pollo', 'pata-muslo', 3),
  ('guiso-arroz-pollo', 'pure-tomate', 520),
  ('guiso-arroz-pollo', 'cebolla', 1),
  ('guiso-arroz-pollo', 'zanahoria', 1),
  ('guiso-arroz-pollo', 'caldo', 1),
  ('guiso-arroz-pollo', 'aceite', 10),
  ('guiso-fideos-carne', 'fideos', 240),
  ('guiso-fideos-carne', 'carne-picada-cruda', 300),
  ('guiso-fideos-carne', 'pure-tomate', 520),
  ('guiso-fideos-carne', 'cebolla', 1),
  ('guiso-fideos-carne', 'zanahoria', 1),
  ('guiso-fideos-carne', 'caldo', 1),
  ('guiso-fideos-carne', 'aceite', 10),
  ('wrap-pollo', 'rapidita', 2),
  ('wrap-pollo', 'pechuga-cruda', 150),
  ('wrap-pollo', 'lechuga', 50),
  ('wrap-pollo', 'tomate', 1),
  ('wrap-pollo', 'queso-untable', 30),
  ('wrap-atun', 'rapidita', 2),
  ('wrap-atun', 'atun-natural', 1),
  ('wrap-atun', 'huevo', 1),
  ('wrap-atun', 'lechuga', 50),
  ('wrap-atun', 'tomate', 1),
  ('wrap-atun', 'queso-untable', 30),
  ('sandwich-pollo', 'pan-integral', 4),
  ('sandwich-pollo', 'pechuga-cruda', 120),
  ('sandwich-pollo', 'huevo', 1),
  ('sandwich-pollo', 'tomate', 1),
  ('sandwich-pollo', 'lechuga', 30),
  ('sandwich-pollo', 'mostaza', 10),
  ('tortilla-papa', 'papa', 500),
  ('tortilla-papa', 'huevo', 5),
  ('tortilla-papa', 'cebolla', 1),
  ('tortilla-papa', 'aceite', 15),
  ('tortilla-papa', 'tomate', 2),
  ('omelette-jamon-queso', 'huevo', 3),
  ('omelette-jamon-queso', 'jamon-cocido', 40),
  ('omelette-jamon-queso', 'queso-cremoso', 30),
  ('omelette-jamon-queso', 'lechuga', 80),
  ('omelette-jamon-queso', 'tomate', 1),
  ('omelette-jamon-queso', 'pan-integral', 2),
  ('arroz-huevo-arvejas', 'arroz', 90),
  ('arroz-huevo-arvejas', 'huevo', 3),
  ('arroz-huevo-arvejas', 'arvejas', 100),
  ('arroz-huevo-arvejas', 'aceite', 5),
  ('pizzetas-rapidita', 'rapidita', 2),
  ('pizzetas-rapidita', 'pure-tomate', 80),
  ('pizzetas-rapidita', 'queso-cremoso', 80),
  ('pizzetas-rapidita', 'jamon-cocido', 40),
  ('milanesas-soja-arroz', 'milanesa-soja', 2),
  ('milanesas-soja-arroz', 'arroz', 60),
  ('milanesas-soja-arroz', 'lechuga', 80),
  ('milanesas-soja-arroz', 'tomate', 1),
  ('milanesas-soja-arroz', 'aceite', 5)
) as v(recipe_slug, food_slug, qty)
join public.recipes r on r.slug = v.recipe_slug
join public.foods f on f.slug = v.food_slug
on conflict do nothing;
