-- Sexta tanda de la base (1.25): recetas, parte 3 de 8. Después de seed-8-alimentos.sql. Se puede correr de nuevo: agrega solo lo que falta. Generado con scripts/gen-seed.mjs

insert into public.recipes (slug, name, minutes, servings, meal_types, portable, steps) values
  ('frittata-de-champinones-y-cebolla-al-horno', 'Frittata de champiñones y cebolla al horno', 20, 2, '{almuerzo,cena}', true, 'Precalentás el horno a 190 °C.
Salteás la cebolla en plumas con el aceite, sumás los champiñones laminados y cocinás 7 minutos hasta que se doren.
Batís los huevos con sal, pimienta y una cucharada de queso rallado; sumás el relleno.
Volcás la mezcla en una sartén que vaya al horno (o una tartera aceitada) y cocinás 18–20 minutos, hasta que esté firme y dorada. Cortás en porciones.'),
  ('omelette-de-atun-y-tomate', 'Omelette de atún y tomate', 10, 1, '{almuerzo,cena}', true, 'Escurrís el atún y lo desmenuzás; cortás el tomate en cubitos sin semillas.
Batís los huevos con sal y pimienta.
En una sartén antiadherente con una gota de aceite, volcás los huevos a fuego medio y los dejás cuajar sin mover 2 minutos.
Ponés el relleno en la mitad, doblás el omelette y lo cocinás 1 minuto más. Servís enseguida.'),
  ('frittata-de-jamon-y-queso-al-horno', 'Frittata de jamón y queso al horno', 13, 2, '{almuerzo,cena}', true, 'Precalentás el horno a 190 °C.
Cortás el jamón y el queso en cubitos.
Batís los huevos con sal, pimienta y una cucharada de queso rallado; sumás el relleno.
Volcás la mezcla en una sartén que vaya al horno (o una tartera aceitada) y cocinás 18–20 minutos, hasta que esté firme y dorada. Cortás en porciones.'),
  ('revuelto-de-choclo-y-cebolla-de-verdeo', 'Revuelto de choclo y cebolla de verdeo', 9, 1, '{almuerzo,cena}', true, 'Escurrís el choclo, picás la cebolla de verdeo y cortás el queso en cubitos.
En una sartén antiadherente calentás el relleno 1 minuto.
Sumás los huevos batidos con sal y pimienta y revolvés suave con una espátula, 2–3 minutos, hasta que cuajen pero queden cremosos.
Servís enseguida, con una tostada si querés.'),
  ('tarta-de-berenjena-y-tomate', 'Tarta de berenjena y tomate', 49, 4, '{almuerzo,cena}', true, 'Precalentás el horno a 200 °C. Forrás una tartera con la tapa de tarta y la pinchás con un tenedor.
Cortás la berenjena en cubos y la dorás con el aceite 8 minutos; sumás el tomate en cubitos y cocinás 3 minutos más.
Batís los huevos con la leche, sal, pimienta y nuez moscada. Mezclás con el relleno.
Volcás en la tartera y horneás 30–35 minutos, hasta que esté firme y dorada. Dejás entibiar 5 minutos antes de cortar en 4 porciones.'),
  ('omelette-de-palmitos-y-queso', 'Omelette de palmitos y queso', 10, 1, '{almuerzo,cena}', true, 'Escurrís los palmitos y los cortás en rodajas; picás la cebolla de verdeo y cortás el queso en cubitos.
Batís los huevos con sal y pimienta.
En una sartén antiadherente con una gota de aceite, volcás los huevos a fuego medio y los dejás cuajar sin mover 2 minutos.
Ponés el relleno en la mitad, doblás el omelette y lo cocinás 1 minuto más. Servís enseguida.'),
  ('frittata-de-chauchas-y-queso-al-horno', 'Frittata de chauchas y queso al horno', 20, 2, '{almuerzo,cena}', true, 'Precalentás el horno a 190 °C.
Hervís las chauchas en trozos 6 minutos, las escurrís; cortás el queso en cubitos.
Batís los huevos con sal, pimienta y una cucharada de queso rallado; sumás el relleno.
Volcás la mezcla en una sartén que vaya al horno (o una tartera aceitada) y cocinás 18–20 minutos, hasta que esté firme y dorada. Cortás en porciones.'),
  ('omelette-de-salmon-ahumado-y-cebolla-de-verdeo', 'Omelette de salmón ahumado y cebolla de verdeo', 10, 1, '{almuerzo,cena}', true, 'Cortás el salmón ahumado en tiras y la cebolla de verdeo en rodajitas.
Batís los huevos con sal y pimienta.
En una sartén antiadherente con una gota de aceite, volcás los huevos a fuego medio y los dejás cuajar sin mover 2 minutos.
Ponés el relleno en la mitad, doblás el omelette y lo cocinás 1 minuto más. Servís enseguida.'),
  ('frittata-de-salmon-ahumado-y-cebolla-de-verdeo-al-horno', 'Frittata de salmón ahumado y cebolla de verdeo al horno', 14, 2, '{almuerzo,cena}', true, 'Precalentás el horno a 190 °C.
Cortás el salmón ahumado en tiras y la cebolla de verdeo en rodajitas.
Batís los huevos con sal, pimienta y una cucharada de queso rallado; sumás el relleno.
Volcás la mezcla en una sartén que vaya al horno (o una tartera aceitada) y cocinás 18–20 minutos, hasta que esté firme y dorada. Cortás en porciones.'),
  ('frittata-de-cebolla-y-queso-azul-al-horno', 'Frittata de cebolla y queso azul al horno', 28, 2, '{almuerzo,cena}', true, 'Precalentás el horno a 190 °C.
Cocinás la cebolla en plumas con el aceite a fuego bajo, 15 minutos, hasta que esté dorada y dulce. Desmenuzás el queso azul.
Batís los huevos con sal, pimienta y una cucharada de queso rallado; sumás el relleno.
Volcás la mezcla en una sartén que vaya al horno (o una tartera aceitada) y cocinás 18–20 minutos, hasta que esté firme y dorada. Cortás en porciones.'),
  ('tortilla-de-berenjena-y-tomate', 'Tortilla de berenjena y tomate', 22, 1, '{almuerzo,cena}', true, 'Cortás la berenjena en cubos y la dorás con el aceite 8 minutos; sumás el tomate en cubitos y cocinás 3 minutos más.
Batís los huevos con sal y pimienta, sumás el relleno y mezclás.
Volcás todo en una sartén antiadherente con una gota de aceite a fuego medio. Cocinás 4–5 minutos, hasta que los bordes estén firmes.
Das vuelta la tortilla con ayuda de un plato y cocinás 3 minutos del otro lado. Servís tibia o fría.'),
  ('frittata-de-verduras-asadas-al-horno', 'Frittata de verduras asadas al horno', 35, 2, '{almuerzo,cena}', true, 'Precalentás el horno a 190 °C.
Cortás las verduras en cubos, las mezclás con el aceite y sal, y las asás en horno a 220 °C, 20 minutos.
Batís los huevos con sal, pimienta y una cucharada de queso rallado; sumás el relleno.
Volcás la mezcla en una sartén que vaya al horno (o una tartera aceitada) y cocinás 18–20 minutos, hasta que esté firme y dorada. Cortás en porciones.'),
  ('tarta-de-calabaza-y-cebolla', 'Tarta de calabaza y cebolla', 51, 4, '{almuerzo,cena}', true, 'Precalentás el horno a 200 °C. Forrás una tartera con la tapa de tarta y la pinchás con un tenedor.
Cortás la calabaza en cubitos chicos y la cebolla en plumas; los cocinás en la sartén con el aceite, tapados, 12 minutos, hasta que se ablanden.
Batís los huevos con la leche, sal, pimienta y nuez moscada. Mezclás con el relleno.
Volcás en la tartera y horneás 30–35 minutos, hasta que esté firme y dorada. Dejás entibiar 5 minutos antes de cortar en 4 porciones.'),
  ('omelette-de-panceta-y-queso', 'Omelette de panceta y queso', 15, 1, '{almuerzo,cena}', true, 'Cortás la panceta en tiritas y la dorás en la sartén sin aceite, 4 minutos; sumás la cebolla picada 3 minutos. Cortás el queso en cubitos.
Batís los huevos con sal y pimienta.
En una sartén antiadherente con una gota de aceite, volcás los huevos a fuego medio y los dejás cuajar sin mover 2 minutos.
Ponés el relleno en la mitad, doblás el omelette y lo cocinás 1 minuto más. Servís enseguida.'),
  ('revuelto-de-puerro-y-queso', 'Revuelto de puerro y queso', 17, 1, '{almuerzo,cena}', true, 'Cortás el puerro en rodajas finas y lo cocinás con el aceite, tapado, 8 minutos hasta que se ablande. Cortás el queso en cubitos.
En una sartén antiadherente calentás el relleno 1 minuto.
Sumás los huevos batidos con sal y pimienta y revolvés suave con una espátula, 2–3 minutos, hasta que cuajen pero queden cremosos.
Servís enseguida, con una tostada si querés.'),
  ('tortilla-de-puerro-y-queso', 'Tortilla de puerro y queso', 20, 1, '{almuerzo,cena}', true, 'Cortás el puerro en rodajas finas y lo cocinás con el aceite, tapado, 8 minutos hasta que se ablande. Cortás el queso en cubitos.
Batís los huevos con sal y pimienta, sumás el relleno y mezclás.
Volcás todo en una sartén antiadherente con una gota de aceite a fuego medio. Cocinás 4–5 minutos, hasta que los bordes estén firmes.
Das vuelta la tortilla con ayuda de un plato y cocinás 3 minutos del otro lado. Servís tibia o fría.'),
  ('omelette-de-zanahoria-y-arvejas', 'Omelette de zanahoria y arvejas', 14, 1, '{almuerzo,cena}', true, 'Rallás la zanahoria gruesa y la salteás con las arvejas y el aceite, 5 minutos.
Batís los huevos con sal y pimienta.
En una sartén antiadherente con una gota de aceite, volcás los huevos a fuego medio y los dejás cuajar sin mover 2 minutos.
Ponés el relleno en la mitad, doblás el omelette y lo cocinás 1 minuto más. Servís enseguida.'),
  ('tarta-de-puerro-y-queso', 'Tarta de puerro y queso', 47, 4, '{almuerzo,cena}', true, 'Precalentás el horno a 200 °C. Forrás una tartera con la tapa de tarta y la pinchás con un tenedor.
Cortás el puerro en rodajas finas y lo cocinás con el aceite, tapado, 8 minutos hasta que se ablande. Cortás el queso en cubitos.
Batís los huevos con la leche, sal, pimienta y nuez moscada. Mezclás con el relleno.
Volcás en la tartera y horneás 30–35 minutos, hasta que esté firme y dorada. Dejás entibiar 5 minutos antes de cortar en 4 porciones.'),
  ('tarta-de-zanahoria-y-arvejas', 'Tarta de zanahoria y arvejas', 43, 4, '{almuerzo,cena}', true, 'Precalentás el horno a 200 °C. Forrás una tartera con la tapa de tarta y la pinchás con un tenedor.
Rallás la zanahoria gruesa y la salteás con las arvejas y el aceite, 5 minutos.
Batís los huevos con la leche, sal, pimienta y nuez moscada. Mezclás con el relleno.
Volcás en la tartera y horneás 30–35 minutos, hasta que esté firme y dorada. Dejás entibiar 5 minutos antes de cortar en 4 porciones.'),
  ('frittata-de-calabaza-y-cebolla-al-horno', 'Frittata de calabaza y cebolla al horno', 26, 2, '{almuerzo,cena}', true, 'Precalentás el horno a 190 °C.
Cortás la calabaza en cubitos chicos y la cebolla en plumas; los cocinás en la sartén con el aceite, tapados, 12 minutos, hasta que se ablanden.
Batís los huevos con sal, pimienta y una cucharada de queso rallado; sumás el relleno.
Volcás la mezcla en una sartén que vaya al horno (o una tartera aceitada) y cocinás 18–20 minutos, hasta que esté firme y dorada. Cortás en porciones.'),
  ('tarta-de-remolacha-y-queso', 'Tarta de remolacha y queso', 41, 4, '{almuerzo,cena}', true, 'Precalentás el horno a 200 °C. Forrás una tartera con la tapa de tarta y la pinchás con un tenedor.
Rallás la remolacha cocida y escurrís el exceso de jugo; desmenuzás el queso de cabra y picás la cebolla de verdeo.
Batís los huevos con la leche, sal, pimienta y nuez moscada. Mezclás con el relleno.
Volcás en la tartera y horneás 30–35 minutos, hasta que esté firme y dorada. Dejás entibiar 5 minutos antes de cortar en 4 porciones.'),
  ('tortilla-de-atun-y-tomate', 'Tortilla de atún y tomate', 12, 1, '{almuerzo,cena}', true, 'Escurrís el atún y lo desmenuzás; cortás el tomate en cubitos sin semillas.
Batís los huevos con sal y pimienta, sumás el relleno y mezclás.
Volcás todo en una sartén antiadherente con una gota de aceite a fuego medio. Cocinás 4–5 minutos, hasta que los bordes estén firmes.
Das vuelta la tortilla con ayuda de un plato y cocinás 3 minutos del otro lado. Servís tibia o fría.'),
  ('tarta-de-atun-y-tomate', 'Tarta de atún y tomate', 39, 4, '{almuerzo,cena}', true, 'Precalentás el horno a 200 °C. Forrás una tartera con la tapa de tarta y la pinchás con un tenedor.
Escurrís el atún y lo desmenuzás; cortás el tomate en cubitos sin semillas.
Batís los huevos con la leche, sal, pimienta y nuez moscada. Mezclás con el relleno.
Volcás en la tartera y horneás 30–35 minutos, hasta que esté firme y dorada. Dejás entibiar 5 minutos antes de cortar en 4 porciones.'),
  ('omelette-de-berenjena-y-tomate', 'Omelette de berenjena y tomate', 20, 1, '{almuerzo,cena}', true, 'Cortás la berenjena en cubos y la dorás con el aceite 8 minutos; sumás el tomate en cubitos y cocinás 3 minutos más.
Batís los huevos con sal y pimienta.
En una sartén antiadherente con una gota de aceite, volcás los huevos a fuego medio y los dejás cuajar sin mover 2 minutos.
Ponés el relleno en la mitad, doblás el omelette y lo cocinás 1 minuto más. Servís enseguida.'),
  ('tortilla-de-calabaza-y-feta', 'Tortilla de calabaza y feta', 28, 1, '{almuerzo,cena}', true, 'Asás o hervís la calabaza en cubitos hasta que esté tierna y la dejás entibiar; desmenuzás el feta.
Batís los huevos con sal y pimienta, sumás el relleno y mezclás.
Volcás todo en una sartén antiadherente con una gota de aceite a fuego medio. Cocinás 4–5 minutos, hasta que los bordes estén firmes.
Das vuelta la tortilla con ayuda de un plato y cocinás 3 minutos del otro lado. Servís tibia o fría.'),
  ('frittata-de-remolacha-y-queso-al-horno', 'Frittata de remolacha y queso al horno', 16, 2, '{almuerzo,cena}', true, 'Precalentás el horno a 190 °C.
Rallás la remolacha cocida y escurrís el exceso de jugo; desmenuzás el queso de cabra y picás la cebolla de verdeo.
Batís los huevos con sal, pimienta y una cucharada de queso rallado; sumás el relleno.
Volcás la mezcla en una sartén que vaya al horno (o una tartera aceitada) y cocinás 18–20 minutos, hasta que esté firme y dorada. Cortás en porciones.'),
  ('omelette-de-brocoli-y-queso', 'Omelette de brócoli y queso', 14, 1, '{almuerzo,cena}', true, 'Hervís el brócoli en arbolitos 4 minutos, lo escurrís y lo picás. Cortás el queso en cubitos.
Batís los huevos con sal y pimienta.
En una sartén antiadherente con una gota de aceite, volcás los huevos a fuego medio y los dejás cuajar sin mover 2 minutos.
Ponés el relleno en la mitad, doblás el omelette y lo cocinás 1 minuto más. Servís enseguida.'),
  ('omelette-de-chauchas-y-queso', 'Omelette de chauchas y queso', 16, 1, '{almuerzo,cena}', true, 'Hervís las chauchas en trozos 6 minutos, las escurrís; cortás el queso en cubitos.
Batís los huevos con sal y pimienta.
En una sartén antiadherente con una gota de aceite, volcás los huevos a fuego medio y los dejás cuajar sin mover 2 minutos.
Ponés el relleno en la mitad, doblás el omelette y lo cocinás 1 minuto más. Servís enseguida.'),
  ('revuelto-de-berenjena-y-tomate', 'Revuelto de berenjena y tomate', 19, 1, '{almuerzo,cena}', true, 'Cortás la berenjena en cubos y la dorás con el aceite 8 minutos; sumás el tomate en cubitos y cocinás 3 minutos más.
En una sartén antiadherente calentás el relleno 1 minuto.
Sumás los huevos batidos con sal y pimienta y revolvés suave con una espátula, 2–3 minutos, hasta que cuajen pero queden cremosos.
Servís enseguida, con una tostada si querés.'),
  ('revuelto-de-papa-y-cebolla', 'Revuelto de papa y cebolla', 25, 1, '{almuerzo,cena}', true, 'Pelás las papas y las cortás en rodajas finas; picás la cebolla. Las cocinás en una sartén con el aceite y sal, tapadas y a fuego bajo, 15 minutos, hasta que estén tiernas.
En una sartén antiadherente calentás el relleno 1 minuto.
Sumás los huevos batidos con sal y pimienta y revolvés suave con una espátula, 2–3 minutos, hasta que cuajen pero queden cremosos.
Servís enseguida, con una tostada si querés.'),
  ('mijo-con-salmon-y-brocoli', 'Mijo con salmón y brócoli', 27, 1, '{almuerzo,cena}', true, 'Tostás el mijo 2 minutos en seco, lo hervís 18 minutos en el doble de agua con sal y lo dejás tapado 5 minutos.
Cocinás el salmón en plancha con una gota de aceite, 3 minutos por lado. Hervís el brócoli 4 minutos y lo salteás con el resto del aceite. Servís con limón.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('arroz-yamani-con-calabaza-asada-y-queso-de-cabra', 'Arroz yamaní con calabaza asada y queso de cabra', 35, 1, '{almuerzo,cena}', true, 'Hervís el arroz yamaní en abundante agua con sal, 25 minutos, y lo escurrís.
Cortás la calabaza en cubos, la mezclás con el aceite, sal y romero y la asás a 200 °C, 25 minutos. Servís con el queso de cabra desmenuzado y las nueces picadas.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('mijo-con-huevo-poche-y-espinaca', 'Mijo con huevo poché y espinaca', 27, 1, '{almuerzo,cena}', true, 'Tostás el mijo 2 minutos en seco, lo hervís 18 minutos en el doble de agua con sal y lo dejás tapado 5 minutos.
Salteás la espinaca con el aceite y el ajo 2 minutos. Poché: hervís agua con un chorrito de vinagre, creás un remolino y cocinás los huevos 3 minutos. Servís sobre la espinaca con parmesano.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('trigo-sarraceno-con-lentejas-y-cebolla-caramelizada', 'Trigo sarraceno con lentejas y cebolla caramelizada', 22, 1, '{almuerzo,cena}', true, 'Hervís el trigo sarraceno 12 minutos en el doble de agua con sal y lo dejás tapado 5 minutos.
Calentás las lentejas con la zanahoria rallada y el aceite 5 minutos. Servís con la cebolla caramelizada arriba, y una pizca de comino.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('burgol-con-carne-morron-y-cebolla', 'Burgol con carne, morrón y cebolla', 25, 1, '{almuerzo,cena}', true, 'Hervís el burgol 12 minutos en el doble de agua con sal; lo escurrís y lo desgranás con un tenedor.
Cortás la carne, el morrón y la cebolla en tiras. Sellás la carne con el aceite 2–3 minutos, la retirás y salteás las verduras 6 minutos; devolvés la carne y sazonás con sal, pimienta y pimentón.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('cebada-con-ricota-tomate-seco-y-rucula', 'Cebada con ricota, tomate seco y rúcula', 40, 1, '{almuerzo,cena}', true, 'Hervís la cebada perlada 30 minutos en abundante agua con sal y la escurrís.
Mezclás el grano tibio con la ricota en cucharadas, los tomates secos picados, la rúcula, las nueces y el aceite de oliva.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('trigo-sarraceno-con-huevo-poche-y-espinaca', 'Trigo sarraceno con huevo poché y espinaca', 22, 1, '{almuerzo,cena}', true, 'Hervís el trigo sarraceno 12 minutos en el doble de agua con sal y lo dejás tapado 5 minutos.
Salteás la espinaca con el aceite y el ajo 2 minutos. Poché: hervís agua con un chorrito de vinagre, creás un remolino y cocinás los huevos 3 minutos. Servís sobre la espinaca con parmesano.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('cebada-con-merluza-y-tomate', 'Cebada con merluza y tomate', 40, 1, '{almuerzo,cena}', true, 'Hervís la cebada perlada 30 minutos en abundante agua con sal y la escurrís.
Dorás la cebolla con el aceite, sumás el tomate en cubos 5 minutos, apoyás los filetes de merluza, tapás y cocinás 6 minutos. Perejil por encima.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('polenta-cremosa-con-berenjenas-tomate-y-muzzarella', 'Polenta cremosa con berenjenas, tomate y muzzarella', 30, 1, '{almuerzo,cena}', true, 'Hervís 3 tazas de agua con sal, volcás la polenta en lluvia revolviendo y cocinás 3–5 minutos hasta que espese; sumás un puñado de queso rallado.
Dorás la berenjena en cubos con el aceite 8 minutos, sumás el tomate triturado y cocinás 8 minutos. Gratinás con la muzzarella 2 minutos tapado. Terminás con albahaca.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('arroz-integral-con-pollo-y-verduras-salteadas', 'Arroz integral con pollo y verduras salteadas', 40, 1, '{almuerzo,cena}', true, 'Hervís el arroz integral en abundante agua con sal, 30 minutos, y lo escurrís.
Cortás la pechuga y las verduras en tiras. Dorás el pollo con el aceite 5 minutos, sumás las verduras y salteás 5 minutos más, con sal, pimienta y pimentón.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('burgol-con-calabaza-asada-y-queso-de-cabra', 'Burgol con calabaza asada y queso de cabra', 35, 1, '{almuerzo,cena}', true, 'Hervís el burgol 12 minutos en el doble de agua con sal; lo escurrís y lo desgranás con un tenedor.
Cortás la calabaza en cubos, la mezclás con el aceite, sal y romero y la asás a 200 °C, 25 minutos. Servís con el queso de cabra desmenuzado y las nueces picadas.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('arroz-con-huevo-espinaca-y-tomates-cherry', 'Arroz con huevo, espinaca y tomates cherry', 20, 1, '{almuerzo,cena}', true, 'Hervís el arroz en abundante agua con sal, 12 minutos, y lo escurrís.
Salteás los cherry y la espinaca con la mitad del aceite 3 minutos. En otra sartén hacés los huevos fritos con el resto del aceite, con la yema líquida.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('arroz-yamani-con-pollo-choclo-y-morron', 'Arroz yamaní con pollo, choclo y morrón', 35, 1, '{almuerzo,cena}', true, 'Hervís el arroz yamaní en abundante agua con sal, 25 minutos, y lo escurrís.
Cortás la pechuga en cubos y la dorás con el aceite 5 minutos. Sumás el morrón en cubitos, el choclo y la cebolla de verdeo 5 minutos más. Sal, pimienta y pimentón.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('mijo-con-huevo-espinaca-y-tomates-cherry', 'Mijo con huevo, espinaca y tomates cherry', 27, 1, '{almuerzo,cena}', true, 'Tostás el mijo 2 minutos en seco, lo hervís 18 minutos en el doble de agua con sal y lo dejás tapado 5 minutos.
Salteás los cherry y la espinaca con la mitad del aceite 3 minutos. En otra sartén hacés los huevos fritos con el resto del aceite, con la yema líquida.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('burgol-con-atun-tomate-y-aceitunas', 'Burgol con atún, tomate y aceitunas', 23, 1, '{almuerzo,cena}', true, 'Hervís el burgol 12 minutos en el doble de agua con sal; lo escurrís y lo desgranás con un tenedor.
Escurrís el atún, cortás el tomate en cubos y la cebolla morada en plumas finitas. Mezclás todo con las aceitunas, el aceite de oliva, perejil y jugo de limón.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('arroz-yamani-con-ricota-tomate-seco-y-rucula', 'Arroz yamaní con ricota, tomate seco y rúcula', 35, 1, '{almuerzo,cena}', true, 'Hervís el arroz yamaní en abundante agua con sal, 25 minutos, y lo escurrís.
Mezclás el grano tibio con la ricota en cucharadas, los tomates secos picados, la rúcula, las nueces y el aceite de oliva.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('arroz-integral-con-ricota-tomate-seco-y-rucula', 'Arroz integral con ricota, tomate seco y rúcula', 40, 1, '{almuerzo,cena}', true, 'Hervís el arroz integral en abundante agua con sal, 30 minutos, y lo escurrís.
Mezclás el grano tibio con la ricota en cucharadas, los tomates secos picados, la rúcula, las nueces y el aceite de oliva.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('trigo-sarraceno-con-espinaca-garbanzos-y-limon', 'Trigo sarraceno con espinaca, garbanzos y limón', 22, 1, '{almuerzo,cena}', true, 'Hervís el trigo sarraceno 12 minutos en el doble de agua con sal y lo dejás tapado 5 minutos.
Salteás el ajo con el aceite y una pizca de comino, sumás los garbanzos escurridos 4 minutos, y al final la espinaca hasta que se achique. Terminás con jugo de limón.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('trigo-sarraceno-con-pavo-y-calabaza', 'Trigo sarraceno con pavo y calabaza', 27, 1, '{almuerzo,cena}', true, 'Hervís el trigo sarraceno 12 minutos en el doble de agua con sal y lo dejás tapado 5 minutos.
Cortás el pavo y la calabaza en cubos; dorás el pavo con el aceite 5 minutos, retirás, y cocinás la calabaza con la cebolla 10 minutos, tapada. Mezclás todo con sal, pimienta y salvia.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('cebada-con-huevo-espinaca-y-tomates-cherry', 'Cebada con huevo, espinaca y tomates cherry', 40, 1, '{almuerzo,cena}', true, 'Hervís la cebada perlada 30 minutos en abundante agua con sal y la escurrís.
Salteás los cherry y la espinaca con la mitad del aceite 3 minutos. En otra sartén hacés los huevos fritos con el resto del aceite, con la yema líquida.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('polenta-cremosa-con-langostinos-y-zapallitos', 'Polenta cremosa con langostinos y zapallitos', 20, 1, '{almuerzo,cena}', true, 'Hervís 3 tazas de agua con sal, volcás la polenta en lluvia revolviendo y cocinás 3–5 minutos hasta que espese; sumás un puñado de queso rallado.
Salteás los zapallitos en medias lunas con el aceite 5 minutos. Sumás el ajo y los langostinos pelados 2 minutos por lado, y terminás con jugo de limón.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('mijo-con-verduras-asadas-y-queso-feta', 'Mijo con verduras asadas y queso feta', 35, 1, '{almuerzo,cena}', true, 'Tostás el mijo 2 minutos en seco, lo hervís 18 minutos en el doble de agua con sal y lo dejás tapado 5 minutos.
Cortás las verduras en cubos, las mezclás con el aceite, sal y orégano y las asás a 220 °C, 25 minutos. Servís con el feta desmenuzado.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('arroz-integral-con-huevo-espinaca-y-tomates-cherry', 'Arroz integral con huevo, espinaca y tomates cherry', 40, 1, '{almuerzo,cena}', true, 'Hervís el arroz integral en abundante agua con sal, 30 minutos, y lo escurrís.
Salteás los cherry y la espinaca con la mitad del aceite 3 minutos. En otra sartén hacés los huevos fritos con el resto del aceite, con la yema líquida.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('burgol-con-langostinos-y-zapallitos', 'Burgol con langostinos y zapallitos', 23, 1, '{almuerzo,cena}', true, 'Hervís el burgol 12 minutos en el doble de agua con sal; lo escurrís y lo desgranás con un tenedor.
Salteás los zapallitos en medias lunas con el aceite 5 minutos. Sumás el ajo y los langostinos pelados 2 minutos por lado, y terminás con jugo de limón.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('trigo-sarraceno-con-calabaza-asada-y-queso-de-cabra', 'Trigo sarraceno con calabaza asada y queso de cabra', 35, 1, '{almuerzo,cena}', true, 'Hervís el trigo sarraceno 12 minutos en el doble de agua con sal y lo dejás tapado 5 minutos.
Cortás la calabaza en cubos, la mezclás con el aceite, sal y romero y la asás a 200 °C, 25 minutos. Servís con el queso de cabra desmenuzado y las nueces picadas.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('burgol-con-ricota-tomate-seco-y-rucula', 'Burgol con ricota, tomate seco y rúcula', 23, 1, '{almuerzo,cena}', true, 'Hervís el burgol 12 minutos en el doble de agua con sal; lo escurrís y lo desgranás con un tenedor.
Mezclás el grano tibio con la ricota en cucharadas, los tomates secos picados, la rúcula, las nueces y el aceite de oliva.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('cuscus-con-verduras-asadas-y-queso-feta', 'Cuscús con verduras asadas y queso feta', 35, 1, '{almuerzo,cena}', true, 'Cubrís el cuscús con la misma cantidad de agua hirviendo con sal y una gota de aceite, tapás 5 minutos y lo desgranás con un tenedor.
Cortás las verduras en cubos, las mezclás con el aceite, sal y orégano y las asás a 220 °C, 25 minutos. Servís con el feta desmenuzado.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('arroz-basmati-con-berenjenas-tomate-y-muzzarella', 'Arroz basmati con berenjenas, tomate y muzzarella', 30, 1, '{almuerzo,cena}', true, 'Lavás el arroz hasta que el agua salga clara y lo hervís 10 minutos con sal; escurrís.
Dorás la berenjena en cubos con el aceite 8 minutos, sumás el tomate triturado y cocinás 8 minutos. Gratinás con la muzzarella 2 minutos tapado. Terminás con albahaca.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('arroz-con-lentejas-y-cebolla-caramelizada', 'Arroz con lentejas y cebolla caramelizada', 20, 1, '{almuerzo,cena}', true, 'Hervís el arroz en abundante agua con sal, 12 minutos, y lo escurrís.
Calentás las lentejas con la zanahoria rallada y el aceite 5 minutos. Servís con la cebolla caramelizada arriba, y una pizca de comino.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('arroz-integral-con-huevo-poche-y-espinaca', 'Arroz integral con huevo poché y espinaca', 40, 1, '{almuerzo,cena}', true, 'Hervís el arroz integral en abundante agua con sal, 30 minutos, y lo escurrís.
Salteás la espinaca con el aceite y el ajo 2 minutos. Poché: hervís agua con un chorrito de vinagre, creás un remolino y cocinás los huevos 3 minutos. Servís sobre la espinaca con parmesano.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('arroz-con-huevo-poche-y-espinaca', 'Arroz con huevo poché y espinaca', 20, 1, '{almuerzo,cena}', true, 'Hervís el arroz en abundante agua con sal, 12 minutos, y lo escurrís.
Salteás la espinaca con el aceite y el ajo 2 minutos. Poché: hervís agua con un chorrito de vinagre, creás un remolino y cocinás los huevos 3 minutos. Servís sobre la espinaca con parmesano.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('cebada-con-pollo-y-verduras-salteadas', 'Cebada con pollo y verduras salteadas', 40, 1, '{almuerzo,cena}', true, 'Hervís la cebada perlada 30 minutos en abundante agua con sal y la escurrís.
Cortás la pechuga y las verduras en tiras. Dorás el pollo con el aceite 5 minutos, sumás las verduras y salteás 5 minutos más, con sal, pimienta y pimentón.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('trigo-sarraceno-con-berenjenas-tomate-y-muzzarella', 'Trigo sarraceno con berenjenas, tomate y muzzarella', 30, 1, '{almuerzo,cena}', true, 'Hervís el trigo sarraceno 12 minutos en el doble de agua con sal y lo dejás tapado 5 minutos.
Dorás la berenjena en cubos con el aceite 8 minutos, sumás el tomate triturado y cocinás 8 minutos. Gratinás con la muzzarella 2 minutos tapado. Terminás con albahaca.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('cuscus-con-salmon-y-brocoli', 'Cuscús con salmón y brócoli', 23, 1, '{almuerzo,cena}', true, 'Cubrís el cuscús con la misma cantidad de agua hirviendo con sal y una gota de aceite, tapás 5 minutos y lo desgranás con un tenedor.
Cocinás el salmón en plancha con una gota de aceite, 3 minutos por lado. Hervís el brócoli 4 minutos y lo salteás con el resto del aceite. Servís con limón.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('mijo-con-merluza-y-tomate', 'Mijo con merluza y tomate', 27, 1, '{almuerzo,cena}', true, 'Tostás el mijo 2 minutos en seco, lo hervís 18 minutos en el doble de agua con sal y lo dejás tapado 5 minutos.
Dorás la cebolla con el aceite, sumás el tomate en cubos 5 minutos, apoyás los filetes de merluza, tapás y cocinás 6 minutos. Perejil por encima.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('arroz-yamani-con-espinaca-garbanzos-y-limon', 'Arroz yamaní con espinaca, garbanzos y limón', 35, 1, '{almuerzo,cena}', true, 'Hervís el arroz yamaní en abundante agua con sal, 25 minutos, y lo escurrís.
Salteás el ajo con el aceite y una pizca de comino, sumás los garbanzos escurridos 4 minutos, y al final la espinaca hasta que se achique. Terminás con jugo de limón.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('quinoa-con-cerdo-y-manzana', 'Quinoa con cerdo y manzana', 25, 1, '{almuerzo,cena}', true, 'Enjuagás bien la quinoa. La hervís 12 minutos en el doble de agua con sal y la dejás tapada 5 minutos fuera del fuego; la desgranás con un tenedor.
Cortás el solomillo en medallones y lo dorás con el aceite 4 minutos por lado. Retirás, y en la misma sartén salteás la cebolla y la manzana en gajos 5 minutos con la mostaza; servís sobre los medallones.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('arroz-integral-con-carne-morron-y-cebolla', 'Arroz integral con carne, morrón y cebolla', 40, 1, '{almuerzo,cena}', true, 'Hervís el arroz integral en abundante agua con sal, 30 minutos, y lo escurrís.
Cortás la carne, el morrón y la cebolla en tiras. Sellás la carne con el aceite 2–3 minutos, la retirás y salteás las verduras 6 minutos; devolvés la carne y sazonás con sal, pimienta y pimentón.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('burgol-con-pollo-choclo-y-morron', 'Burgol con pollo, choclo y morrón', 25, 1, '{almuerzo,cena}', true, 'Hervís el burgol 12 minutos en el doble de agua con sal; lo escurrís y lo desgranás con un tenedor.
Cortás la pechuga en cubos y la dorás con el aceite 5 minutos. Sumás el morrón en cubitos, el choclo y la cebolla de verdeo 5 minutos más. Sal, pimienta y pimentón.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('quinoa-con-calabaza-asada-y-queso-de-cabra', 'Quinoa con calabaza asada y queso de cabra', 35, 1, '{almuerzo,cena}', true, 'Enjuagás bien la quinoa. La hervís 12 minutos en el doble de agua con sal y la dejás tapada 5 minutos fuera del fuego; la desgranás con un tenedor.
Cortás la calabaza en cubos, la mezclás con el aceite, sal y romero y la asás a 200 °C, 25 minutos. Servís con el queso de cabra desmenuzado y las nueces picadas.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('burgol-con-tofu-y-vegetales-al-curry', 'Burgol con tofu y vegetales al curry', 27, 1, '{almuerzo,cena}', true, 'Hervís el burgol 12 minutos en el doble de agua con sal; lo escurrís y lo desgranás con un tenedor.
Dorás el tofu en cubos con el aceite 4 minutos; retirás. Salteás la cebolla, la zanahoria y la coliflor 6 minutos con una cucharadita de curry en polvo, sumás la leche de coco y el tofu y cocinás 5 minutos.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('arroz-con-pavo-y-calabaza', 'Arroz con pavo y calabaza', 27, 1, '{almuerzo,cena}', true, 'Hervís el arroz en abundante agua con sal, 12 minutos, y lo escurrís.
Cortás el pavo y la calabaza en cubos; dorás el pavo con el aceite 5 minutos, retirás, y cocinás la calabaza con la cebolla 10 minutos, tapada. Mezclás todo con sal, pimienta y salvia.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('burgol-con-merluza-y-tomate', 'Burgol con merluza y tomate', 23, 1, '{almuerzo,cena}', true, 'Hervís el burgol 12 minutos en el doble de agua con sal; lo escurrís y lo desgranás con un tenedor.
Dorás la cebolla con el aceite, sumás el tomate en cubos 5 minutos, apoyás los filetes de merluza, tapás y cocinás 6 minutos. Perejil por encima.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('cebada-con-champinones-y-arvejas', 'Cebada con champiñones y arvejas', 40, 1, '{almuerzo,cena}', true, 'Hervís la cebada perlada 30 minutos en abundante agua con sal y la escurrís.
Dorás la cebolla y el ajo con el aceite, sumás los champiñones laminados 6 minutos y las arvejas 3 minutos; sazonás con sal, pimienta y perejil.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('cebada-con-hummus-y-vegetales-crudos', 'Cebada con hummus y vegetales crudos', 40, 1, '{almuerzo,cena}', true, 'Hervís la cebada perlada 30 minutos en abundante agua con sal y la escurrís.
Cortás la zanahoria y el pepino en bastones y los cherry al medio. Servís el grano con el hummus y las verduras, con un hilo de aceite de oliva.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('trigo-sarraceno-con-hummus-y-vegetales-crudos', 'Trigo sarraceno con hummus y vegetales crudos', 22, 1, '{almuerzo,cena}', true, 'Hervís el trigo sarraceno 12 minutos en el doble de agua con sal y lo dejás tapado 5 minutos.
Cortás la zanahoria y el pepino en bastones y los cherry al medio. Servís el grano con el hummus y las verduras, con un hilo de aceite de oliva.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('arroz-con-verduras-asadas-y-queso-feta', 'Arroz con verduras asadas y queso feta', 35, 1, '{almuerzo,cena}', true, 'Hervís el arroz en abundante agua con sal, 12 minutos, y lo escurrís.
Cortás las verduras en cubos, las mezclás con el aceite, sal y orégano y las asás a 220 °C, 25 minutos. Servís con el feta desmenuzado.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('burgol-con-hummus-y-vegetales-crudos', 'Burgol con hummus y vegetales crudos', 23, 1, '{almuerzo,cena}', true, 'Hervís el burgol 12 minutos en el doble de agua con sal; lo escurrís y lo desgranás con un tenedor.
Cortás la zanahoria y el pepino en bastones y los cherry al medio. Servís el grano con el hummus y las verduras, con un hilo de aceite de oliva.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('cebada-con-carne-morron-y-cebolla', 'Cebada con carne, morrón y cebolla', 40, 1, '{almuerzo,cena}', true, 'Hervís la cebada perlada 30 minutos en abundante agua con sal y la escurrís.
Cortás la carne, el morrón y la cebolla en tiras. Sellás la carne con el aceite 2–3 minutos, la retirás y salteás las verduras 6 minutos; devolvés la carne y sazonás con sal, pimienta y pimentón.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('mijo-con-espinaca-garbanzos-y-limon', 'Mijo con espinaca, garbanzos y limón', 27, 1, '{almuerzo,cena}', true, 'Tostás el mijo 2 minutos en seco, lo hervís 18 minutos en el doble de agua con sal y lo dejás tapado 5 minutos.
Salteás el ajo con el aceite y una pizca de comino, sumás los garbanzos escurridos 4 minutos, y al final la espinaca hasta que se achique. Terminás con jugo de limón.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('burgol-con-lentejas-y-cebolla-caramelizada', 'Burgol con lentejas y cebolla caramelizada', 23, 1, '{almuerzo,cena}', true, 'Hervís el burgol 12 minutos en el doble de agua con sal; lo escurrís y lo desgranás con un tenedor.
Calentás las lentejas con la zanahoria rallada y el aceite 5 minutos. Servís con la cebolla caramelizada arriba, y una pizca de comino.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('arroz-yamani-con-berenjenas-tomate-y-muzzarella', 'Arroz yamaní con berenjenas, tomate y muzzarella', 35, 1, '{almuerzo,cena}', true, 'Hervís el arroz yamaní en abundante agua con sal, 25 minutos, y lo escurrís.
Dorás la berenjena en cubos con el aceite 8 minutos, sumás el tomate triturado y cocinás 8 minutos. Gratinás con la muzzarella 2 minutos tapado. Terminás con albahaca.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('arroz-con-salmon-y-brocoli', 'Arroz con salmón y brócoli', 23, 1, '{almuerzo,cena}', true, 'Hervís el arroz en abundante agua con sal, 12 minutos, y lo escurrís.
Cocinás el salmón en plancha con una gota de aceite, 3 minutos por lado. Hervís el brócoli 4 minutos y lo salteás con el resto del aceite. Servís con limón.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('arroz-basmati-con-atun-tomate-y-aceitunas', 'Arroz basmati con atún, tomate y aceitunas', 19, 1, '{almuerzo,cena}', true, 'Lavás el arroz hasta que el agua salga clara y lo hervís 10 minutos con sal; escurrís.
Escurrís el atún, cortás el tomate en cubos y la cebolla morada en plumas finitas. Mezclás todo con las aceitunas, el aceite de oliva, perejil y jugo de limón.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('mijo-con-atun-tomate-y-aceitunas', 'Mijo con atún, tomate y aceitunas', 27, 1, '{almuerzo,cena}', true, 'Tostás el mijo 2 minutos en seco, lo hervís 18 minutos en el doble de agua con sal y lo dejás tapado 5 minutos.
Escurrís el atún, cortás el tomate en cubos y la cebolla morada en plumas finitas. Mezclás todo con las aceitunas, el aceite de oliva, perejil y jugo de limón.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('arroz-yamani-con-champinones-y-arvejas', 'Arroz yamaní con champiñones y arvejas', 35, 1, '{almuerzo,cena}', true, 'Hervís el arroz yamaní en abundante agua con sal, 25 minutos, y lo escurrís.
Dorás la cebolla y el ajo con el aceite, sumás los champiñones laminados 6 minutos y las arvejas 3 minutos; sazonás con sal, pimienta y perejil.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('mijo-con-langostinos-y-zapallitos', 'Mijo con langostinos y zapallitos', 27, 1, '{almuerzo,cena}', true, 'Tostás el mijo 2 minutos en seco, lo hervís 18 minutos en el doble de agua con sal y lo dejás tapado 5 minutos.
Salteás los zapallitos en medias lunas con el aceite 5 minutos. Sumás el ajo y los langostinos pelados 2 minutos por lado, y terminás con jugo de limón.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('mijo-con-calabaza-asada-y-queso-de-cabra', 'Mijo con calabaza asada y queso de cabra', 35, 1, '{almuerzo,cena}', true, 'Tostás el mijo 2 minutos en seco, lo hervís 18 minutos en el doble de agua con sal y lo dejás tapado 5 minutos.
Cortás la calabaza en cubos, la mezclás con el aceite, sal y romero y la asás a 200 °C, 25 minutos. Servís con el queso de cabra desmenuzado y las nueces picadas.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('cuscus-con-pollo-y-verduras-salteadas', 'Cuscús con pollo y verduras salteadas', 25, 1, '{almuerzo,cena}', true, 'Cubrís el cuscús con la misma cantidad de agua hirviendo con sal y una gota de aceite, tapás 5 minutos y lo desgranás con un tenedor.
Cortás la pechuga y las verduras en tiras. Dorás el pollo con el aceite 5 minutos, sumás las verduras y salteás 5 minutos más, con sal, pimienta y pimentón.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('mijo-con-pollo-y-verduras-salteadas', 'Mijo con pollo y verduras salteadas', 27, 1, '{almuerzo,cena}', true, 'Tostás el mijo 2 minutos en seco, lo hervís 18 minutos en el doble de agua con sal y lo dejás tapado 5 minutos.
Cortás la pechuga y las verduras en tiras. Dorás el pollo con el aceite 5 minutos, sumás las verduras y salteás 5 minutos más, con sal, pimienta y pimentón.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('burgol-con-espinaca-garbanzos-y-limon', 'Burgol con espinaca, garbanzos y limón', 23, 1, '{almuerzo,cena}', true, 'Hervís el burgol 12 minutos en el doble de agua con sal; lo escurrís y lo desgranás con un tenedor.
Salteás el ajo con el aceite y una pizca de comino, sumás los garbanzos escurridos 4 minutos, y al final la espinaca hasta que se achique. Terminás con jugo de limón.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('arroz-basmati-con-espinaca-garbanzos-y-limon', 'Arroz basmati con espinaca, garbanzos y limón', 19, 1, '{almuerzo,cena}', true, 'Lavás el arroz hasta que el agua salga clara y lo hervís 10 minutos con sal; escurrís.
Salteás el ajo con el aceite y una pizca de comino, sumás los garbanzos escurridos 4 minutos, y al final la espinaca hasta que se achique. Terminás con jugo de limón.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('arroz-integral-con-tofu-y-vegetales-al-curry', 'Arroz integral con tofu y vegetales al curry', 40, 1, '{almuerzo,cena}', true, 'Hervís el arroz integral en abundante agua con sal, 30 minutos, y lo escurrís.
Dorás el tofu en cubos con el aceite 4 minutos; retirás. Salteás la cebolla, la zanahoria y la coliflor 6 minutos con una cucharadita de curry en polvo, sumás la leche de coco y el tofu y cocinás 5 minutos.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('cebada-con-langostinos-y-zapallitos', 'Cebada con langostinos y zapallitos', 40, 1, '{almuerzo,cena}', true, 'Hervís la cebada perlada 30 minutos en abundante agua con sal y la escurrís.
Salteás los zapallitos en medias lunas con el aceite 5 minutos. Sumás el ajo y los langostinos pelados 2 minutos por lado, y terminás con jugo de limón.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('arroz-basmati-con-verduras-asadas-y-queso-feta', 'Arroz basmati con verduras asadas y queso feta', 35, 1, '{almuerzo,cena}', true, 'Lavás el arroz hasta que el agua salga clara y lo hervís 10 minutos con sal; escurrís.
Cortás las verduras en cubos, las mezclás con el aceite, sal y orégano y las asás a 220 °C, 25 minutos. Servís con el feta desmenuzado.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('cebada-con-calabaza-asada-y-queso-de-cabra', 'Cebada con calabaza asada y queso de cabra', 40, 1, '{almuerzo,cena}', true, 'Hervís la cebada perlada 30 minutos en abundante agua con sal y la escurrís.
Cortás la calabaza en cubos, la mezclás con el aceite, sal y romero y la asás a 200 °C, 25 minutos. Servís con el queso de cabra desmenuzado y las nueces picadas.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('polenta-cremosa-con-huevo-poche-y-espinaca', 'Polenta cremosa con huevo poché y espinaca', 19, 1, '{almuerzo,cena}', true, 'Hervís 3 tazas de agua con sal, volcás la polenta en lluvia revolviendo y cocinás 3–5 minutos hasta que espese; sumás un puñado de queso rallado.
Salteás la espinaca con el aceite y el ajo 2 minutos. Poché: hervís agua con un chorrito de vinagre, creás un remolino y cocinás los huevos 3 minutos. Servís sobre la espinaca con parmesano.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('arroz-yamani-con-pavo-y-calabaza', 'Arroz yamaní con pavo y calabaza', 35, 1, '{almuerzo,cena}', true, 'Hervís el arroz yamaní en abundante agua con sal, 25 minutos, y lo escurrís.
Cortás el pavo y la calabaza en cubos; dorás el pavo con el aceite 5 minutos, retirás, y cocinás la calabaza con la cebolla 10 minutos, tapada. Mezclás todo con sal, pimienta y salvia.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('arroz-integral-con-langostinos-y-zapallitos', 'Arroz integral con langostinos y zapallitos', 40, 1, '{almuerzo,cena}', true, 'Hervís el arroz integral en abundante agua con sal, 30 minutos, y lo escurrís.
Salteás los zapallitos en medias lunas con el aceite 5 minutos. Sumás el ajo y los langostinos pelados 2 minutos por lado, y terminás con jugo de limón.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('arroz-yamani-con-tofu-y-vegetales-al-curry', 'Arroz yamaní con tofu y vegetales al curry', 35, 1, '{almuerzo,cena}', true, 'Hervís el arroz yamaní en abundante agua con sal, 25 minutos, y lo escurrís.
Dorás el tofu en cubos con el aceite 4 minutos; retirás. Salteás la cebolla, la zanahoria y la coliflor 6 minutos con una cucharadita de curry en polvo, sumás la leche de coco y el tofu y cocinás 5 minutos.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('cuscus-con-berenjenas-tomate-y-muzzarella', 'Cuscús con berenjenas, tomate y muzzarella', 30, 1, '{almuerzo,cena}', true, 'Cubrís el cuscús con la misma cantidad de agua hirviendo con sal y una gota de aceite, tapás 5 minutos y lo desgranás con un tenedor.
Dorás la berenjena en cubos con el aceite 8 minutos, sumás el tomate triturado y cocinás 8 minutos. Gratinás con la muzzarella 2 minutos tapado. Terminás con albahaca.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('trigo-sarraceno-con-cerdo-y-manzana', 'Trigo sarraceno con cerdo y manzana', 25, 1, '{almuerzo,cena}', true, 'Hervís el trigo sarraceno 12 minutos en el doble de agua con sal y lo dejás tapado 5 minutos.
Cortás el solomillo en medallones y lo dorás con el aceite 4 minutos por lado. Retirás, y en la misma sartén salteás la cebolla y la manzana en gajos 5 minutos con la mostaza; servís sobre los medallones.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('mijo-con-lentejas-y-cebolla-caramelizada', 'Mijo con lentejas y cebolla caramelizada', 27, 1, '{almuerzo,cena}', true, 'Tostás el mijo 2 minutos en seco, lo hervís 18 minutos en el doble de agua con sal y lo dejás tapado 5 minutos.
Calentás las lentejas con la zanahoria rallada y el aceite 5 minutos. Servís con la cebolla caramelizada arriba, y una pizca de comino.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('burgol-con-cerdo-y-manzana', 'Burgol con cerdo y manzana', 25, 1, '{almuerzo,cena}', true, 'Hervís el burgol 12 minutos en el doble de agua con sal; lo escurrís y lo desgranás con un tenedor.
Cortás el solomillo en medallones y lo dorás con el aceite 4 minutos por lado. Retirás, y en la misma sartén salteás la cebolla y la manzana en gajos 5 minutos con la mostaza; servís sobre los medallones.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('polenta-cremosa-con-lentejas-y-cebolla-caramelizada', 'Polenta cremosa con lentejas y cebolla caramelizada', 20, 1, '{almuerzo,cena}', true, 'Hervís 3 tazas de agua con sal, volcás la polenta en lluvia revolviendo y cocinás 3–5 minutos hasta que espese; sumás un puñado de queso rallado.
Calentás las lentejas con la zanahoria rallada y el aceite 5 minutos. Servís con la cebolla caramelizada arriba, y una pizca de comino.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('quinoa-con-pavo-y-calabaza', 'Quinoa con pavo y calabaza', 27, 1, '{almuerzo,cena}', true, 'Enjuagás bien la quinoa. La hervís 12 minutos en el doble de agua con sal y la dejás tapada 5 minutos fuera del fuego; la desgranás con un tenedor.
Cortás el pavo y la calabaza en cubos; dorás el pavo con el aceite 5 minutos, retirás, y cocinás la calabaza con la cebolla 10 minutos, tapada. Mezclás todo con sal, pimienta y salvia.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('cuscus-con-hummus-y-vegetales-crudos', 'Cuscús con hummus y vegetales crudos', 13, 1, '{almuerzo,cena}', true, 'Cubrís el cuscús con la misma cantidad de agua hirviendo con sal y una gota de aceite, tapás 5 minutos y lo desgranás con un tenedor.
Cortás la zanahoria y el pepino en bastones y los cherry al medio. Servís el grano con el hummus y las verduras, con un hilo de aceite de oliva.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('arroz-yamani-con-carne-morron-y-cebolla', 'Arroz yamaní con carne, morrón y cebolla', 35, 1, '{almuerzo,cena}', true, 'Hervís el arroz yamaní en abundante agua con sal, 25 minutos, y lo escurrís.
Cortás la carne, el morrón y la cebolla en tiras. Sellás la carne con el aceite 2–3 minutos, la retirás y salteás las verduras 6 minutos; devolvés la carne y sazonás con sal, pimienta y pimentón.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('trigo-sarraceno-con-ricota-tomate-seco-y-rucula', 'Trigo sarraceno con ricota, tomate seco y rúcula', 22, 1, '{almuerzo,cena}', true, 'Hervís el trigo sarraceno 12 minutos en el doble de agua con sal y lo dejás tapado 5 minutos.
Mezclás el grano tibio con la ricota en cucharadas, los tomates secos picados, la rúcula, las nueces y el aceite de oliva.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('quinoa-con-pollo-choclo-y-morron', 'Quinoa con pollo, choclo y morrón', 25, 1, '{almuerzo,cena}', true, 'Enjuagás bien la quinoa. La hervís 12 minutos en el doble de agua con sal y la dejás tapada 5 minutos fuera del fuego; la desgranás con un tenedor.
Cortás la pechuga en cubos y la dorás con el aceite 5 minutos. Sumás el morrón en cubitos, el choclo y la cebolla de verdeo 5 minutos más. Sal, pimienta y pimentón.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('arroz-con-carne-morron-y-cebolla', 'Arroz con carne, morrón y cebolla', 25, 1, '{almuerzo,cena}', true, 'Hervís el arroz en abundante agua con sal, 12 minutos, y lo escurrís.
Cortás la carne, el morrón y la cebolla en tiras. Sellás la carne con el aceite 2–3 minutos, la retirás y salteás las verduras 6 minutos; devolvés la carne y sazonás con sal, pimienta y pimentón.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('mijo-con-champinones-y-arvejas', 'Mijo con champiñones y arvejas', 27, 1, '{almuerzo,cena}', true, 'Tostás el mijo 2 minutos en seco, lo hervís 18 minutos en el doble de agua con sal y lo dejás tapado 5 minutos.
Dorás la cebolla y el ajo con el aceite, sumás los champiñones laminados 6 minutos y las arvejas 3 minutos; sazonás con sal, pimienta y perejil.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('arroz-yamani-con-huevo-espinaca-y-tomates-cherry', 'Arroz yamaní con huevo, espinaca y tomates cherry', 35, 1, '{almuerzo,cena}', true, 'Hervís el arroz yamaní en abundante agua con sal, 25 minutos, y lo escurrís.
Salteás los cherry y la espinaca con la mitad del aceite 3 minutos. En otra sartén hacés los huevos fritos con el resto del aceite, con la yema líquida.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('arroz-integral-con-pavo-y-calabaza', 'Arroz integral con pavo y calabaza', 40, 1, '{almuerzo,cena}', true, 'Hervís el arroz integral en abundante agua con sal, 30 minutos, y lo escurrís.
Cortás el pavo y la calabaza en cubos; dorás el pavo con el aceite 5 minutos, retirás, y cocinás la calabaza con la cebolla 10 minutos, tapada. Mezclás todo con sal, pimienta y salvia.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('arroz-basmati-con-pollo-y-verduras-salteadas', 'Arroz basmati con pollo y verduras salteadas', 25, 1, '{almuerzo,cena}', true, 'Lavás el arroz hasta que el agua salga clara y lo hervís 10 minutos con sal; escurrís.
Cortás la pechuga y las verduras en tiras. Dorás el pollo con el aceite 5 minutos, sumás las verduras y salteás 5 minutos más, con sal, pimienta y pimentón.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('cebada-con-salmon-y-brocoli', 'Cebada con salmón y brócoli', 40, 1, '{almuerzo,cena}', true, 'Hervís la cebada perlada 30 minutos en abundante agua con sal y la escurrís.
Cocinás el salmón en plancha con una gota de aceite, 3 minutos por lado. Hervís el brócoli 4 minutos y lo salteás con el resto del aceite. Servís con limón.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('mijo-con-pollo-choclo-y-morron', 'Mijo con pollo, choclo y morrón', 27, 1, '{almuerzo,cena}', true, 'Tostás el mijo 2 minutos en seco, lo hervís 18 minutos en el doble de agua con sal y lo dejás tapado 5 minutos.
Cortás la pechuga en cubos y la dorás con el aceite 5 minutos. Sumás el morrón en cubitos, el choclo y la cebolla de verdeo 5 minutos más. Sal, pimienta y pimentón.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('polenta-cremosa-con-atun-tomate-y-aceitunas', 'Polenta cremosa con atún, tomate y aceitunas', 13, 1, '{almuerzo,cena}', true, 'Hervís 3 tazas de agua con sal, volcás la polenta en lluvia revolviendo y cocinás 3–5 minutos hasta que espese; sumás un puñado de queso rallado.
Escurrís el atún, cortás el tomate en cubos y la cebolla morada en plumas finitas. Mezclás todo con las aceitunas, el aceite de oliva, perejil y jugo de limón.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('cuscus-con-langostinos-y-zapallitos', 'Cuscús con langostinos y zapallitos', 20, 1, '{almuerzo,cena}', true, 'Cubrís el cuscús con la misma cantidad de agua hirviendo con sal y una gota de aceite, tapás 5 minutos y lo desgranás con un tenedor.
Salteás los zapallitos en medias lunas con el aceite 5 minutos. Sumás el ajo y los langostinos pelados 2 minutos por lado, y terminás con jugo de limón.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('arroz-yamani-con-lentejas-y-cebolla-caramelizada', 'Arroz yamaní con lentejas y cebolla caramelizada', 35, 1, '{almuerzo,cena}', true, 'Hervís el arroz yamaní en abundante agua con sal, 25 minutos, y lo escurrís.
Calentás las lentejas con la zanahoria rallada y el aceite 5 minutos. Servís con la cebolla caramelizada arriba, y una pizca de comino.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('arroz-integral-con-salmon-y-brocoli', 'Arroz integral con salmón y brócoli', 40, 1, '{almuerzo,cena}', true, 'Hervís el arroz integral en abundante agua con sal, 30 minutos, y lo escurrís.
Cocinás el salmón en plancha con una gota de aceite, 3 minutos por lado. Hervís el brócoli 4 minutos y lo salteás con el resto del aceite. Servís con limón.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('mijo-con-tofu-y-vegetales-al-curry', 'Mijo con tofu y vegetales al curry', 27, 1, '{almuerzo,cena}', true, 'Tostás el mijo 2 minutos en seco, lo hervís 18 minutos en el doble de agua con sal y lo dejás tapado 5 minutos.
Dorás el tofu en cubos con el aceite 4 minutos; retirás. Salteás la cebolla, la zanahoria y la coliflor 6 minutos con una cucharadita de curry en polvo, sumás la leche de coco y el tofu y cocinás 5 minutos.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('polenta-cremosa-con-calabaza-asada-y-queso-de-cabra', 'Polenta cremosa con calabaza asada y queso de cabra', 35, 1, '{almuerzo,cena}', true, 'Hervís 3 tazas de agua con sal, volcás la polenta en lluvia revolviendo y cocinás 3–5 minutos hasta que espese; sumás un puñado de queso rallado.
Cortás la calabaza en cubos, la mezclás con el aceite, sal y romero y la asás a 200 °C, 25 minutos. Servís con el queso de cabra desmenuzado y las nueces picadas.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('trigo-sarraceno-con-verduras-asadas-y-queso-feta', 'Trigo sarraceno con verduras asadas y queso feta', 35, 1, '{almuerzo,cena}', true, 'Hervís el trigo sarraceno 12 minutos en el doble de agua con sal y lo dejás tapado 5 minutos.
Cortás las verduras en cubos, las mezclás con el aceite, sal y orégano y las asás a 220 °C, 25 minutos. Servís con el feta desmenuzado.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('mijo-con-cerdo-y-manzana', 'Mijo con cerdo y manzana', 27, 1, '{almuerzo,cena}', true, 'Tostás el mijo 2 minutos en seco, lo hervís 18 minutos en el doble de agua con sal y lo dejás tapado 5 minutos.
Cortás el solomillo en medallones y lo dorás con el aceite 4 minutos por lado. Retirás, y en la misma sartén salteás la cebolla y la manzana en gajos 5 minutos con la mostaza; servís sobre los medallones.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('arroz-yamani-con-atun-tomate-y-aceitunas', 'Arroz yamaní con atún, tomate y aceitunas', 35, 1, '{almuerzo,cena}', true, 'Hervís el arroz yamaní en abundante agua con sal, 25 minutos, y lo escurrís.
Escurrís el atún, cortás el tomate en cubos y la cebolla morada en plumas finitas. Mezclás todo con las aceitunas, el aceite de oliva, perejil y jugo de limón.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('arroz-con-cerdo-y-manzana', 'Arroz con cerdo y manzana', 25, 1, '{almuerzo,cena}', true, 'Hervís el arroz en abundante agua con sal, 12 minutos, y lo escurrís.
Cortás el solomillo en medallones y lo dorás con el aceite 4 minutos por lado. Retirás, y en la misma sartén salteás la cebolla y la manzana en gajos 5 minutos con la mostaza; servís sobre los medallones.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('cebada-con-berenjenas-tomate-y-muzzarella', 'Cebada con berenjenas, tomate y muzzarella', 40, 1, '{almuerzo,cena}', true, 'Hervís la cebada perlada 30 minutos en abundante agua con sal y la escurrís.
Dorás la berenjena en cubos con el aceite 8 minutos, sumás el tomate triturado y cocinás 8 minutos. Gratinás con la muzzarella 2 minutos tapado. Terminás con albahaca.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('cebada-con-huevo-poche-y-espinaca', 'Cebada con huevo poché y espinaca', 40, 1, '{almuerzo,cena}', true, 'Hervís la cebada perlada 30 minutos en abundante agua con sal y la escurrís.
Salteás la espinaca con el aceite y el ajo 2 minutos. Poché: hervís agua con un chorrito de vinagre, creás un remolino y cocinás los huevos 3 minutos. Servís sobre la espinaca con parmesano.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('arroz-con-espinaca-garbanzos-y-limon', 'Arroz con espinaca, garbanzos y limón', 20, 1, '{almuerzo,cena}', true, 'Hervís el arroz en abundante agua con sal, 12 minutos, y lo escurrís.
Salteás el ajo con el aceite y una pizca de comino, sumás los garbanzos escurridos 4 minutos, y al final la espinaca hasta que se achique. Terminás con jugo de limón.
Servís el grano en un plato hondo y ponés el resto arriba. Corregís la sal.'),
  ('risotto-de-esparragos', 'Risotto de espárragos', 35, 1, '{almuerzo,cena}', false, 'Calentás el caldo y lo mantenés a fuego mínimo al lado.
Sofreís la cebolla picada fina con la manteca y el aceite 4 minutos, sin que tome color. Sumás el arroz y lo nacarás 2 minutos, revolviendo.
Agregás el caldo de a un cucharón, revolviendo seguido; esperás a que se absorba antes de sumar el siguiente. Son unos 18 minutos.
Cortás los espárragos en trozos de 3 cm y los sumás al arroz en los últimos 8 minutos; ralladura y jugo de limón al final.
Fuera del fuego sumás el parmesano rallado, tapás 2 minutos y servís enseguida: tiene que quedar cremoso, que corra apenas en el plato.'),
  ('risotto-de-cuatro-hongos-y-tomillo', 'Risotto de cuatro hongos y tomillo', 43, 1, '{almuerzo,cena}', false, 'Calentás el caldo y lo mantenés a fuego mínimo al lado.
Sofreís la cebolla picada fina con la manteca y el aceite 4 minutos, sin que tome color. Sumás el arroz y lo nacarás 2 minutos, revolviendo.
Agregás el caldo de a un cucharón, revolviendo seguido; esperás a que se absorba antes de sumar el siguiente. Son unos 18 minutos.
Salteás los hongos cortados en láminas, a fuego fuerte y sin amontonar, con tomillo y una gota de aceite; los sumás al arroz al final.
Fuera del fuego sumás el parmesano rallado, tapás 2 minutos y servís enseguida: tiene que quedar cremoso, que corra apenas en el plato.'),
  ('risotto-de-salmon', 'Risotto de salmón', 35, 1, '{almuerzo,cena}', false, 'Calentás el caldo y lo mantenés a fuego mínimo al lado.
Sofreís la cebolla picada fina con la manteca y el aceite 4 minutos, sin que tome color. Sumás el arroz y lo nacarás 2 minutos, revolviendo.
Agregás el caldo de a un cucharón, revolviendo seguido; esperás a que se absorba antes de sumar el siguiente. Son unos 18 minutos.
Cortás el salmón en cubos, lo sumás en los últimos 4 minutos de cocción del arroz y servís con cebolla de verdeo por arriba.
Fuera del fuego sumás el parmesano rallado, tapás 2 minutos y servís enseguida: tiene que quedar cremoso, que corra apenas en el plato.'),
  ('risotto-de-puerro-y-queso-azul', 'Risotto de puerro y queso azul', 35, 1, '{almuerzo,cena}', false, 'Calentás el caldo y lo mantenés a fuego mínimo al lado.
Sofreís la cebolla picada fina con la manteca y el aceite 4 minutos, sin que tome color. Sumás el arroz y lo nacarás 2 minutos, revolviendo.
Agregás el caldo de a un cucharón, revolviendo seguido; esperás a que se absorba antes de sumar el siguiente. Son unos 18 minutos.
Cocinás el puerro en rodajas finas con el arroz desde el principio. Al final sumás el queso azul desmenuzado.
Fuera del fuego sumás el parmesano rallado, tapás 2 minutos y servís enseguida: tiene que quedar cremoso, que corra apenas en el plato.'),
  ('risotto-de-brocoli', 'Risotto de brócoli', 40, 1, '{almuerzo,cena}', false, 'Calentás el caldo y lo mantenés a fuego mínimo al lado.
Sofreís la cebolla picada fina con la manteca y el aceite 4 minutos, sin que tome color. Sumás el arroz y lo nacarás 2 minutos, revolviendo.
Agregás el caldo de a un cucharón, revolviendo seguido; esperás a que se absorba antes de sumar el siguiente. Son unos 18 minutos.
Hervís el brócoli en arbolitos chicos 3 minutos, los escurrís y los sumás al arroz al final, aplastando algunos para que suelten sabor.
Fuera del fuego sumás el parmesano rallado, tapás 2 minutos y servís enseguida: tiene que quedar cremoso, que corra apenas en el plato.'),
  ('risotto-de-arvejas-y-jamon', 'Risotto de arvejas y jamón', 35, 1, '{almuerzo,cena}', false, 'Calentás el caldo y lo mantenés a fuego mínimo al lado.
Sofreís la cebolla picada fina con la manteca y el aceite 4 minutos, sin que tome color. Sumás el arroz y lo nacarás 2 minutos, revolviendo.
Agregás el caldo de a un cucharón, revolviendo seguido; esperás a que se absorba antes de sumar el siguiente. Son unos 18 minutos.
Cortás el jamón en cubitos y lo sumás junto con las arvejas en los últimos 5 minutos.
Fuera del fuego sumás el parmesano rallado, tapás 2 minutos y servís enseguida: tiene que quedar cremoso, que corra apenas en el plato.'),
  ('risotto-de-zapallitos', 'Risotto de zapallitos', 41, 1, '{almuerzo,cena}', false, 'Calentás el caldo y lo mantenés a fuego mínimo al lado.
Sofreís la cebolla picada fina con la manteca y el aceite 4 minutos, sin que tome color. Sumás el arroz y lo nacarás 2 minutos, revolviendo.
Agregás el caldo de a un cucharón, revolviendo seguido; esperás a que se absorba antes de sumar el siguiente. Son unos 18 minutos.
Cortás los zapallitos en cubitos y los salteás aparte 4 minutos; los sumás al arroz al final.
Fuera del fuego sumás el parmesano rallado, tapás 2 minutos y servís enseguida: tiene que quedar cremoso, que corra apenas en el plato.'),
  ('risotto-de-hongos', 'Risotto de hongos', 43, 1, '{almuerzo,cena}', false, 'Calentás el caldo y lo mantenés a fuego mínimo al lado.
Sofreís la cebolla picada fina con la manteca y el aceite 4 minutos, sin que tome color. Sumás el arroz y lo nacarás 2 minutos, revolviendo.
Agregás el caldo de a un cucharón, revolviendo seguido; esperás a que se absorba antes de sumar el siguiente. Son unos 18 minutos.
Salteás los champiñones laminados en otra sartén con una gota de aceite hasta que se doren (6 minutos) y los sumás al arroz al final.
Fuera del fuego sumás el parmesano rallado, tapás 2 minutos y servís enseguida: tiene que quedar cremoso, que corra apenas en el plato.'),
  ('risotto-de-espinaca', 'Risotto de espinaca', 35, 1, '{almuerzo,cena}', false, 'Calentás el caldo y lo mantenés a fuego mínimo al lado.
Sofreís la cebolla picada fina con la manteca y el aceite 4 minutos, sin que tome color. Sumás el arroz y lo nacarás 2 minutos, revolviendo.
Agregás el caldo de a un cucharón, revolviendo seguido; esperás a que se absorba antes de sumar el siguiente. Son unos 18 minutos.
Picás la espinaca y la sumás al arroz en los últimos 3 minutos para que se achique.
Fuera del fuego sumás el parmesano rallado, tapás 2 minutos y servís enseguida: tiene que quedar cremoso, que corra apenas en el plato.'),
  ('risotto-de-remolacha', 'Risotto de remolacha', 38, 1, '{almuerzo,cena}', false, 'Calentás el caldo y lo mantenés a fuego mínimo al lado.
Sofreís la cebolla picada fina con la manteca y el aceite 4 minutos, sin que tome color. Sumás el arroz y lo nacarás 2 minutos, revolviendo.
Agregás el caldo de a un cucharón, revolviendo seguido; esperás a que se absorba antes de sumar el siguiente. Son unos 18 minutos.
Procesás la mitad de la remolacha cocida con un poco de caldo y la sumás al arroz a mitad de cocción; la otra mitad, en cubitos, va al final. Queda de un color rosa intenso.
Fuera del fuego sumás el parmesano rallado, tapás 2 minutos y servís enseguida: tiene que quedar cremoso, que corra apenas en el plato.'),
  ('risotto-de-pollo-y-limon', 'Risotto de pollo y limón', 43, 1, '{almuerzo,cena}', false, 'Calentás el caldo y lo mantenés a fuego mínimo al lado.
Sofreís la cebolla picada fina con la manteca y el aceite 4 minutos, sin que tome color. Sumás el arroz y lo nacarás 2 minutos, revolviendo.
Agregás el caldo de a un cucharón, revolviendo seguido; esperás a que se absorba antes de sumar el siguiente. Son unos 18 minutos.
Cortás la pechuga en cubitos, la salteás con una gota de aceite 4 minutos y la sumás al arroz con el jugo de limón en los últimos 5 minutos.
Fuera del fuego sumás el parmesano rallado, tapás 2 minutos y servís enseguida: tiene que quedar cremoso, que corra apenas en el plato.'),
  ('risotto-de-calabaza', 'Risotto de calabaza', 35, 1, '{almuerzo,cena}', false, 'Calentás el caldo y lo mantenés a fuego mínimo al lado.
Sofreís la cebolla picada fina con la manteca y el aceite 4 minutos, sin que tome color. Sumás el arroz y lo nacarás 2 minutos, revolviendo.
Agregás el caldo de a un cucharón, revolviendo seguido; esperás a que se absorba antes de sumar el siguiente. Son unos 18 minutos.
Cortás la calabaza en cubitos chicos y la sumás al arroz con el primer cucharón de caldo; se deshace y le da cremosidad.
Fuera del fuego sumás el parmesano rallado, tapás 2 minutos y servís enseguida: tiene que quedar cremoso, que corra apenas en el plato.'),
  ('risotto-de-tomates-cherry-y-albahaca', 'Risotto de tomates cherry y albahaca', 35, 1, '{almuerzo,cena}', false, 'Calentás el caldo y lo mantenés a fuego mínimo al lado.
Sofreís la cebolla picada fina con la manteca y el aceite 4 minutos, sin que tome color. Sumás el arroz y lo nacarás 2 minutos, revolviendo.
Agregás el caldo de a un cucharón, revolviendo seguido; esperás a que se absorba antes de sumar el siguiente. Son unos 18 minutos.
Cortás los cherry al medio y los sumás al arroz a mitad de cocción; al final, albahaca picada.
Fuera del fuego sumás el parmesano rallado, tapás 2 minutos y servís enseguida: tiene que quedar cremoso, que corra apenas en el plato.'),
  ('risotto-de-langostinos', 'Risotto de langostinos', 41, 1, '{almuerzo,cena}', false, 'Calentás el caldo y lo mantenés a fuego mínimo al lado.
Sofreís la cebolla picada fina con la manteca y el aceite 4 minutos, sin que tome color. Sumás el arroz y lo nacarás 2 minutos, revolviendo.
Agregás el caldo de a un cucharón, revolviendo seguido; esperás a que se absorba antes de sumar el siguiente. Son unos 18 minutos.
Salteás los langostinos pelados con el ajo y una gota de aceite, 2 minutos por lado, y los sumás al arroz al final.
Fuera del fuego sumás el parmesano rallado, tapás 2 minutos y servís enseguida: tiene que quedar cremoso, que corra apenas en el plato.'),
  ('crema-de-espinaca-con-semillas-de-zapallo', 'Crema de espinaca con semillas de zapallo', 35, 4, '{almuerzo,cena}', true, 'Lavás la espinaca y cortás la papa en cubos.
Sofreís la cebolla picada con el aceite 4 minutos. Sumás las verduras y el caldo (cubre justo) con sal y pimienta; tapás y hervís 20 minutos hasta que estén bien tiernas.
Procesás con minipimer hasta que quede lisa. Si queda muy espesa, la aligerás con agua caliente; si queda líquida, la hervís 5 minutos sin tapa.
Servís con semillas de zapallo tostadas y un hilo de aceite de oliva.
Rinde 4 platos. Se conserva 4 días en la heladera y se puede freezar.'),
  ('crema-de-choclo-con-yogur', 'Crema de choclo con yogur', 35, 4, '{almuerzo,cena}', true, 'Escurrís el choclo y cortás la papa en cubos.
Sofreís la cebolla picada con el aceite 4 minutos. Sumás las verduras y el caldo (cubre justo) con sal y pimienta; tapás y hervís 20 minutos hasta que estén bien tiernas.
Procesás con minipimer hasta que quede lisa. Si queda muy espesa, la aligerás con agua caliente; si queda líquida, la hervís 5 minutos sin tapa.
Servís con una cucharada de yogur griego y pimienta.
Rinde 4 platos. Se conserva 4 días en la heladera y se puede freezar.'),
  ('crema-de-mandioca-con-jamon-crudo-crocante', 'Crema de mandioca con jamón crudo crocante', 35, 4, '{almuerzo,cena}', true, 'Pelás la mandioca (sacando el centro fibroso) y la zanahoria, y las cortás en cubos.
Sofreís la cebolla picada con el aceite 4 minutos. Sumás las verduras y el caldo (cubre justo) con sal y pimienta; tapás y hervís 20 minutos hasta que estén bien tiernas.
Procesás con minipimer hasta que quede lisa. Si queda muy espesa, la aligerás con agua caliente; si queda líquida, la hervís 5 minutos sin tapa.
Dorás el jamón crudo en tiritas en una sartén seca hasta que quede crocante y lo desmenuzás arriba.
Rinde 4 platos. Se conserva 4 días en la heladera y se puede freezar.'),
  ('crema-de-hinojo-y-papa-con-queso-rallado', 'Crema de hinojo y papa con queso rallado', 35, 4, '{almuerzo,cena}', true, 'Cortás el hinojo en láminas y la papa en cubos.
Sofreís la cebolla picada con el aceite 4 minutos. Sumás las verduras y el caldo (cubre justo) con sal y pimienta; tapás y hervís 20 minutos hasta que estén bien tiernas.
Procesás con minipimer hasta que quede lisa. Si queda muy espesa, la aligerás con agua caliente; si queda líquida, la hervís 5 minutos sin tapa.
Servís con queso rallado por encima.
Rinde 4 platos. Se conserva 4 días en la heladera y se puede freezar.'),
  ('crema-de-arvejas-con-queso-rallado', 'Crema de arvejas con queso rallado', 35, 4, '{almuerzo,cena}', true, 'Cortás la papa en cubos; las arvejas van enteras.
Sofreís la cebolla picada con el aceite 4 minutos. Sumás las verduras y el caldo (cubre justo) con sal y pimienta; tapás y hervís 20 minutos hasta que estén bien tiernas.
Procesás con minipimer hasta que quede lisa. Si queda muy espesa, la aligerás con agua caliente; si queda líquida, la hervís 5 minutos sin tapa.
Servís con queso rallado por encima.
Rinde 4 platos. Se conserva 4 días en la heladera y se puede freezar.'),
  ('crema-de-esparragos-con-pollo-desmenuzado', 'Crema de espárragos con pollo desmenuzado', 35, 4, '{almuerzo,cena}', true, 'Cortás los espárragos en trozos (sin la parte dura) y la papa en cubos.
Sofreís la cebolla picada con el aceite 4 minutos. Sumás las verduras y el caldo (cubre justo) con sal y pimienta; tapás y hervís 20 minutos hasta que estén bien tiernas.
Procesás con minipimer hasta que quede lisa. Si queda muy espesa, la aligerás con agua caliente; si queda líquida, la hervís 5 minutos sin tapa.
Servís con pollo desmenuzado (de una pata o una pechuga hervida) calentado en la sopa.
Rinde 4 platos. Se conserva 4 días en la heladera y se puede freezar.'),
  ('crema-de-mandioca-con-queso-rallado', 'Crema de mandioca con queso rallado', 35, 4, '{almuerzo,cena}', true, 'Pelás la mandioca (sacando el centro fibroso) y la zanahoria, y las cortás en cubos.
Sofreís la cebolla picada con el aceite 4 minutos. Sumás las verduras y el caldo (cubre justo) con sal y pimienta; tapás y hervís 20 minutos hasta que estén bien tiernas.
Procesás con minipimer hasta que quede lisa. Si queda muy espesa, la aligerás con agua caliente; si queda líquida, la hervís 5 minutos sin tapa.
Servís con queso rallado por encima.
Rinde 4 platos. Se conserva 4 días en la heladera y se puede freezar.'),
  ('crema-de-choclo-con-queso-de-cabra', 'Crema de choclo con queso de cabra', 35, 4, '{almuerzo,cena}', true, 'Escurrís el choclo y cortás la papa en cubos.
Sofreís la cebolla picada con el aceite 4 minutos. Sumás las verduras y el caldo (cubre justo) con sal y pimienta; tapás y hervís 20 minutos hasta que estén bien tiernas.
Procesás con minipimer hasta que quede lisa. Si queda muy espesa, la aligerás con agua caliente; si queda líquida, la hervís 5 minutos sin tapa.
Servís con queso de cabra desmenuzado.
Rinde 4 platos. Se conserva 4 días en la heladera y se puede freezar.'),
  ('crema-de-tomate-con-croutons', 'Crema de tomate con croutons', 35, 4, '{almuerzo,cena}', true, 'Cortás los tomates en cuartos y la zanahoria en rodajas.
Sofreís la cebolla picada con el aceite 4 minutos. Sumás las verduras y el caldo (cubre justo) con sal y pimienta; tapás y hervís 20 minutos hasta que estén bien tiernas.
Procesás con minipimer hasta que quede lisa. Si queda muy espesa, la aligerás con agua caliente; si queda líquida, la hervís 5 minutos sin tapa.
Servís con croutons por encima.
Rinde 4 platos. Se conserva 4 días en la heladera y se puede freezar.'),
  ('crema-de-esparragos-con-huevo-duro', 'Crema de espárragos con huevo duro', 35, 4, '{almuerzo,cena}', true, 'Cortás los espárragos en trozos (sin la parte dura) y la papa en cubos.
Sofreís la cebolla picada con el aceite 4 minutos. Sumás las verduras y el caldo (cubre justo) con sal y pimienta; tapás y hervís 20 minutos hasta que estén bien tiernas.
Procesás con minipimer hasta que quede lisa. Si queda muy espesa, la aligerás con agua caliente; si queda líquida, la hervís 5 minutos sin tapa.
Servís con medio huevo duro picado en cada plato.
Rinde 4 platos. Se conserva 4 días en la heladera y se puede freezar.'),
  ('crema-de-coliflor-con-croutons', 'Crema de coliflor con croutons', 35, 4, '{almuerzo,cena}', true, 'Cortás la coliflor en arbolitos y la papa en cubos.
Sofreís la cebolla picada con el aceite 4 minutos. Sumás las verduras y el caldo (cubre justo) con sal y pimienta; tapás y hervís 20 minutos hasta que estén bien tiernas.
Procesás con minipimer hasta que quede lisa. Si queda muy espesa, la aligerás con agua caliente; si queda líquida, la hervís 5 minutos sin tapa.
Servís con croutons por encima.
Rinde 4 platos. Se conserva 4 días en la heladera y se puede freezar.'),
  ('crema-de-esparragos-con-semillas-de-zapallo', 'Crema de espárragos con semillas de zapallo', 35, 4, '{almuerzo,cena}', true, 'Cortás los espárragos en trozos (sin la parte dura) y la papa en cubos.
Sofreís la cebolla picada con el aceite 4 minutos. Sumás las verduras y el caldo (cubre justo) con sal y pimienta; tapás y hervís 20 minutos hasta que estén bien tiernas.
Procesás con minipimer hasta que quede lisa. Si queda muy espesa, la aligerás con agua caliente; si queda líquida, la hervís 5 minutos sin tapa.
Servís con semillas de zapallo tostadas y un hilo de aceite de oliva.
Rinde 4 platos. Se conserva 4 días en la heladera y se puede freezar.'),
  ('crema-de-zapallo-y-jengibre-con-yogur', 'Crema de zapallo y jengibre con yogur', 35, 4, '{almuerzo,cena}', true, 'Pelás el zapallo y la papa y los cortás en cubos; rallás el jengibre.
Sofreís la cebolla picada con el aceite 4 minutos. Sumás las verduras y el caldo (cubre justo) con sal y pimienta; tapás y hervís 20 minutos hasta que estén bien tiernas.
Procesás con minipimer hasta que quede lisa. Si queda muy espesa, la aligerás con agua caliente; si queda líquida, la hervís 5 minutos sin tapa.
Servís con una cucharada de yogur griego y pimienta.
Rinde 4 platos. Se conserva 4 días en la heladera y se puede freezar.'),
  ('crema-de-esparragos-con-queso-de-cabra', 'Crema de espárragos con queso de cabra', 35, 4, '{almuerzo,cena}', true, 'Cortás los espárragos en trozos (sin la parte dura) y la papa en cubos.
Sofreís la cebolla picada con el aceite 4 minutos. Sumás las verduras y el caldo (cubre justo) con sal y pimienta; tapás y hervís 20 minutos hasta que estén bien tiernas.
Procesás con minipimer hasta que quede lisa. Si queda muy espesa, la aligerás con agua caliente; si queda líquida, la hervís 5 minutos sin tapa.
Servís con queso de cabra desmenuzado.
Rinde 4 platos. Se conserva 4 días en la heladera y se puede freezar.'),
  ('crema-de-zapallito-con-croutons', 'Crema de zapallito con croutons', 35, 4, '{almuerzo,cena}', true, 'Cortás los zapallitos en rodajas, sin pelar, y la papa en cubos.
Sofreís la cebolla picada con el aceite 4 minutos. Sumás las verduras y el caldo (cubre justo) con sal y pimienta; tapás y hervís 20 minutos hasta que estén bien tiernas.
Procesás con minipimer hasta que quede lisa. Si queda muy espesa, la aligerás con agua caliente; si queda líquida, la hervís 5 minutos sin tapa.
Servís con croutons por encima.
Rinde 4 platos. Se conserva 4 días en la heladera y se puede freezar.'),
  ('crema-de-brocoli-con-queso-de-cabra', 'Crema de brócoli con queso de cabra', 35, 4, '{almuerzo,cena}', true, 'Cortás el brócoli en arbolitos (los tallos también, pelados y en rodajas) y la papa en cubos.
Sofreís la cebolla picada con el aceite 4 minutos. Sumás las verduras y el caldo (cubre justo) con sal y pimienta; tapás y hervís 20 minutos hasta que estén bien tiernas.
Procesás con minipimer hasta que quede lisa. Si queda muy espesa, la aligerás con agua caliente; si queda líquida, la hervís 5 minutos sin tapa.
Servís con queso de cabra desmenuzado.
Rinde 4 platos. Se conserva 4 días en la heladera y se puede freezar.'),
  ('crema-de-calabaza-con-queso-rallado', 'Crema de calabaza con queso rallado', 35, 4, '{almuerzo,cena}', true, 'Pelás la calabaza y la papa y las cortás en cubos.
Sofreís la cebolla picada con el aceite 4 minutos. Sumás las verduras y el caldo (cubre justo) con sal y pimienta; tapás y hervís 20 minutos hasta que estén bien tiernas.
Procesás con minipimer hasta que quede lisa. Si queda muy espesa, la aligerás con agua caliente; si queda líquida, la hervís 5 minutos sin tapa.
Servís con queso rallado por encima.
Rinde 4 platos. Se conserva 4 días en la heladera y se puede freezar.'),
  ('crema-de-brocoli-con-queso-rallado', 'Crema de brócoli con queso rallado', 35, 4, '{almuerzo,cena}', true, 'Cortás el brócoli en arbolitos (los tallos también, pelados y en rodajas) y la papa en cubos.
Sofreís la cebolla picada con el aceite 4 minutos. Sumás las verduras y el caldo (cubre justo) con sal y pimienta; tapás y hervís 20 minutos hasta que estén bien tiernas.
Procesás con minipimer hasta que quede lisa. Si queda muy espesa, la aligerás con agua caliente; si queda líquida, la hervís 5 minutos sin tapa.
Servís con queso rallado por encima.
Rinde 4 platos. Se conserva 4 días en la heladera y se puede freezar.'),
  ('crema-de-hinojo-y-papa-con-croutons', 'Crema de hinojo y papa con croutons', 35, 4, '{almuerzo,cena}', true, 'Cortás el hinojo en láminas y la papa en cubos.
Sofreís la cebolla picada con el aceite 4 minutos. Sumás las verduras y el caldo (cubre justo) con sal y pimienta; tapás y hervís 20 minutos hasta que estén bien tiernas.
Procesás con minipimer hasta que quede lisa. Si queda muy espesa, la aligerás con agua caliente; si queda líquida, la hervís 5 minutos sin tapa.
Servís con croutons por encima.
Rinde 4 platos. Se conserva 4 días en la heladera y se puede freezar.'),
  ('crema-de-brocoli-con-yogur', 'Crema de brócoli con yogur', 35, 4, '{almuerzo,cena}', true, 'Cortás el brócoli en arbolitos (los tallos también, pelados y en rodajas) y la papa en cubos.
Sofreís la cebolla picada con el aceite 4 minutos. Sumás las verduras y el caldo (cubre justo) con sal y pimienta; tapás y hervís 20 minutos hasta que estén bien tiernas.
Procesás con minipimer hasta que quede lisa. Si queda muy espesa, la aligerás con agua caliente; si queda líquida, la hervís 5 minutos sin tapa.
Servís con una cucharada de yogur griego y pimienta.
Rinde 4 platos. Se conserva 4 días en la heladera y se puede freezar.'),
  ('crema-de-espinaca-con-pollo-desmenuzado', 'Crema de espinaca con pollo desmenuzado', 35, 4, '{almuerzo,cena}', true, 'Lavás la espinaca y cortás la papa en cubos.
Sofreís la cebolla picada con el aceite 4 minutos. Sumás las verduras y el caldo (cubre justo) con sal y pimienta; tapás y hervís 20 minutos hasta que estén bien tiernas.
Procesás con minipimer hasta que quede lisa. Si queda muy espesa, la aligerás con agua caliente; si queda líquida, la hervís 5 minutos sin tapa.
Servís con pollo desmenuzado (de una pata o una pechuga hervida) calentado en la sopa.
Rinde 4 platos. Se conserva 4 días en la heladera y se puede freezar.'),
  ('crema-de-espinaca-con-queso-de-cabra', 'Crema de espinaca con queso de cabra', 35, 4, '{almuerzo,cena}', true, 'Lavás la espinaca y cortás la papa en cubos.
Sofreís la cebolla picada con el aceite 4 minutos. Sumás las verduras y el caldo (cubre justo) con sal y pimienta; tapás y hervís 20 minutos hasta que estén bien tiernas.
Procesás con minipimer hasta que quede lisa. Si queda muy espesa, la aligerás con agua caliente; si queda líquida, la hervís 5 minutos sin tapa.
Servís con queso de cabra desmenuzado.
Rinde 4 platos. Se conserva 4 días en la heladera y se puede freezar.'),
  ('crema-de-remolacha-con-queso-de-cabra', 'Crema de remolacha con queso de cabra', 35, 4, '{almuerzo,cena}', true, 'Cortás la remolacha cocida y la papa en cubos.
Sofreís la cebolla picada con el aceite 4 minutos. Sumás las verduras y el caldo (cubre justo) con sal y pimienta; tapás y hervís 20 minutos hasta que estén bien tiernas.
Procesás con minipimer hasta que quede lisa. Si queda muy espesa, la aligerás con agua caliente; si queda líquida, la hervís 5 minutos sin tapa.
Servís con queso de cabra desmenuzado.
Rinde 4 platos. Se conserva 4 días en la heladera y se puede freezar.'),
  ('crema-de-esparragos-con-croutons', 'Crema de espárragos con croutons', 35, 4, '{almuerzo,cena}', true, 'Cortás los espárragos en trozos (sin la parte dura) y la papa en cubos.
Sofreís la cebolla picada con el aceite 4 minutos. Sumás las verduras y el caldo (cubre justo) con sal y pimienta; tapás y hervís 20 minutos hasta que estén bien tiernas.
Procesás con minipimer hasta que quede lisa. Si queda muy espesa, la aligerás con agua caliente; si queda líquida, la hervís 5 minutos sin tapa.
Servís con croutons por encima.
Rinde 4 platos. Se conserva 4 días en la heladera y se puede freezar.'),
  ('crema-de-batata-con-pollo-desmenuzado', 'Crema de batata con pollo desmenuzado', 35, 4, '{almuerzo,cena}', true, 'Pelás la batata y la zanahoria y las cortás en cubos.
Sofreís la cebolla picada con el aceite 4 minutos. Sumás las verduras y el caldo (cubre justo) con sal y pimienta; tapás y hervís 20 minutos hasta que estén bien tiernas.
Procesás con minipimer hasta que quede lisa. Si queda muy espesa, la aligerás con agua caliente; si queda líquida, la hervís 5 minutos sin tapa.
Servís con pollo desmenuzado (de una pata o una pechuga hervida) calentado en la sopa.
Rinde 4 platos. Se conserva 4 días en la heladera y se puede freezar.'),
  ('crema-de-zapallo-y-jengibre-con-queso-de-cabra', 'Crema de zapallo y jengibre con queso de cabra', 35, 4, '{almuerzo,cena}', true, 'Pelás el zapallo y la papa y los cortás en cubos; rallás el jengibre.
Sofreís la cebolla picada con el aceite 4 minutos. Sumás las verduras y el caldo (cubre justo) con sal y pimienta; tapás y hervís 20 minutos hasta que estén bien tiernas.
Procesás con minipimer hasta que quede lisa. Si queda muy espesa, la aligerás con agua caliente; si queda líquida, la hervís 5 minutos sin tapa.
Servís con queso de cabra desmenuzado.
Rinde 4 platos. Se conserva 4 días en la heladera y se puede freezar.'),
  ('crema-de-batata-con-semillas-de-zapallo', 'Crema de batata con semillas de zapallo', 35, 4, '{almuerzo,cena}', true, 'Pelás la batata y la zanahoria y las cortás en cubos.
Sofreís la cebolla picada con el aceite 4 minutos. Sumás las verduras y el caldo (cubre justo) con sal y pimienta; tapás y hervís 20 minutos hasta que estén bien tiernas.
Procesás con minipimer hasta que quede lisa. Si queda muy espesa, la aligerás con agua caliente; si queda líquida, la hervís 5 minutos sin tapa.
Servís con semillas de zapallo tostadas y un hilo de aceite de oliva.
Rinde 4 platos. Se conserva 4 días en la heladera y se puede freezar.'),
  ('crema-de-tomate-con-jamon-crudo-crocante', 'Crema de tomate con jamón crudo crocante', 35, 4, '{almuerzo,cena}', true, 'Cortás los tomates en cuartos y la zanahoria en rodajas.
Sofreís la cebolla picada con el aceite 4 minutos. Sumás las verduras y el caldo (cubre justo) con sal y pimienta; tapás y hervís 20 minutos hasta que estén bien tiernas.
Procesás con minipimer hasta que quede lisa. Si queda muy espesa, la aligerás con agua caliente; si queda líquida, la hervís 5 minutos sin tapa.
Dorás el jamón crudo en tiritas en una sartén seca hasta que quede crocante y lo desmenuzás arriba.
Rinde 4 platos. Se conserva 4 días en la heladera y se puede freezar.'),
  ('crema-de-hinojo-y-papa-con-huevo-duro', 'Crema de hinojo y papa con huevo duro', 35, 4, '{almuerzo,cena}', true, 'Cortás el hinojo en láminas y la papa en cubos.
Sofreís la cebolla picada con el aceite 4 minutos. Sumás las verduras y el caldo (cubre justo) con sal y pimienta; tapás y hervís 20 minutos hasta que estén bien tiernas.
Procesás con minipimer hasta que quede lisa. Si queda muy espesa, la aligerás con agua caliente; si queda líquida, la hervís 5 minutos sin tapa.
Servís con medio huevo duro picado en cada plato.
Rinde 4 platos. Se conserva 4 días en la heladera y se puede freezar.'),
  ('crema-de-remolacha-con-yogur', 'Crema de remolacha con yogur', 35, 4, '{almuerzo,cena}', true, 'Cortás la remolacha cocida y la papa en cubos.
Sofreís la cebolla picada con el aceite 4 minutos. Sumás las verduras y el caldo (cubre justo) con sal y pimienta; tapás y hervís 20 minutos hasta que estén bien tiernas.
Procesás con minipimer hasta que quede lisa. Si queda muy espesa, la aligerás con agua caliente; si queda líquida, la hervís 5 minutos sin tapa.
Servís con una cucharada de yogur griego y pimienta.
Rinde 4 platos. Se conserva 4 días en la heladera y se puede freezar.'),
  ('crema-de-tomate-con-queso-rallado', 'Crema de tomate con queso rallado', 35, 4, '{almuerzo,cena}', true, 'Cortás los tomates en cuartos y la zanahoria en rodajas.
Sofreís la cebolla picada con el aceite 4 minutos. Sumás las verduras y el caldo (cubre justo) con sal y pimienta; tapás y hervís 20 minutos hasta que estén bien tiernas.
Procesás con minipimer hasta que quede lisa. Si queda muy espesa, la aligerás con agua caliente; si queda líquida, la hervís 5 minutos sin tapa.
Servís con queso rallado por encima.
Rinde 4 platos. Se conserva 4 días en la heladera y se puede freezar.'),
  ('crema-de-arvejas-con-yogur', 'Crema de arvejas con yogur', 35, 4, '{almuerzo,cena}', true, 'Cortás la papa en cubos; las arvejas van enteras.
Sofreís la cebolla picada con el aceite 4 minutos. Sumás las verduras y el caldo (cubre justo) con sal y pimienta; tapás y hervís 20 minutos hasta que estén bien tiernas.
Procesás con minipimer hasta que quede lisa. Si queda muy espesa, la aligerás con agua caliente; si queda líquida, la hervís 5 minutos sin tapa.
Servís con una cucharada de yogur griego y pimienta.
Rinde 4 platos. Se conserva 4 días en la heladera y se puede freezar.'),
  ('crema-de-calabaza-con-pollo-desmenuzado', 'Crema de calabaza con pollo desmenuzado', 35, 4, '{almuerzo,cena}', true, 'Pelás la calabaza y la papa y las cortás en cubos.
Sofreís la cebolla picada con el aceite 4 minutos. Sumás las verduras y el caldo (cubre justo) con sal y pimienta; tapás y hervís 20 minutos hasta que estén bien tiernas.
Procesás con minipimer hasta que quede lisa. Si queda muy espesa, la aligerás con agua caliente; si queda líquida, la hervís 5 minutos sin tapa.
Servís con pollo desmenuzado (de una pata o una pechuga hervida) calentado en la sopa.
Rinde 4 platos. Se conserva 4 días en la heladera y se puede freezar.'),
  ('crema-de-mandioca-con-semillas-de-zapallo', 'Crema de mandioca con semillas de zapallo', 35, 4, '{almuerzo,cena}', true, 'Pelás la mandioca (sacando el centro fibroso) y la zanahoria, y las cortás en cubos.
Sofreís la cebolla picada con el aceite 4 minutos. Sumás las verduras y el caldo (cubre justo) con sal y pimienta; tapás y hervís 20 minutos hasta que estén bien tiernas.
Procesás con minipimer hasta que quede lisa. Si queda muy espesa, la aligerás con agua caliente; si queda líquida, la hervís 5 minutos sin tapa.
Servís con semillas de zapallo tostadas y un hilo de aceite de oliva.
Rinde 4 platos. Se conserva 4 días en la heladera y se puede freezar.'),
  ('crema-de-zapallo-y-jengibre-con-jamon-crudo-crocante', 'Crema de zapallo y jengibre con jamón crudo crocante', 35, 4, '{almuerzo,cena}', true, 'Pelás el zapallo y la papa y los cortás en cubos; rallás el jengibre.
Sofreís la cebolla picada con el aceite 4 minutos. Sumás las verduras y el caldo (cubre justo) con sal y pimienta; tapás y hervís 20 minutos hasta que estén bien tiernas.
Procesás con minipimer hasta que quede lisa. Si queda muy espesa, la aligerás con agua caliente; si queda líquida, la hervís 5 minutos sin tapa.
Dorás el jamón crudo en tiritas en una sartén seca hasta que quede crocante y lo desmenuzás arriba.
Rinde 4 platos. Se conserva 4 días en la heladera y se puede freezar.'),
  ('crema-de-champinones-con-croutons', 'Crema de champiñones con croutons', 35, 4, '{almuerzo,cena}', true, 'Laminás los champiñones y cortás la papa en cubos.
Sofreís la cebolla picada con el aceite 4 minutos. Sumás las verduras y el caldo (cubre justo) con sal y pimienta; tapás y hervís 20 minutos hasta que estén bien tiernas.
Procesás con minipimer hasta que quede lisa. Si queda muy espesa, la aligerás con agua caliente; si queda líquida, la hervís 5 minutos sin tapa.
Servís con croutons por encima.
Rinde 4 platos. Se conserva 4 días en la heladera y se puede freezar.'),
  ('crema-de-brocoli-con-semillas-de-zapallo', 'Crema de brócoli con semillas de zapallo', 35, 4, '{almuerzo,cena}', true, 'Cortás el brócoli en arbolitos (los tallos también, pelados y en rodajas) y la papa en cubos.
Sofreís la cebolla picada con el aceite 4 minutos. Sumás las verduras y el caldo (cubre justo) con sal y pimienta; tapás y hervís 20 minutos hasta que estén bien tiernas.
Procesás con minipimer hasta que quede lisa. Si queda muy espesa, la aligerás con agua caliente; si queda líquida, la hervís 5 minutos sin tapa.
Servís con semillas de zapallo tostadas y un hilo de aceite de oliva.
Rinde 4 platos. Se conserva 4 días en la heladera y se puede freezar.'),
  ('crema-de-batata-con-queso-rallado', 'Crema de batata con queso rallado', 35, 4, '{almuerzo,cena}', true, 'Pelás la batata y la zanahoria y las cortás en cubos.
Sofreís la cebolla picada con el aceite 4 minutos. Sumás las verduras y el caldo (cubre justo) con sal y pimienta; tapás y hervís 20 minutos hasta que estén bien tiernas.
Procesás con minipimer hasta que quede lisa. Si queda muy espesa, la aligerás con agua caliente; si queda líquida, la hervís 5 minutos sin tapa.
Servís con queso rallado por encima.
Rinde 4 platos. Se conserva 4 días en la heladera y se puede freezar.'),
  ('crema-de-coliflor-con-huevo-duro', 'Crema de coliflor con huevo duro', 35, 4, '{almuerzo,cena}', true, 'Cortás la coliflor en arbolitos y la papa en cubos.
Sofreís la cebolla picada con el aceite 4 minutos. Sumás las verduras y el caldo (cubre justo) con sal y pimienta; tapás y hervís 20 minutos hasta que estén bien tiernas.
Procesás con minipimer hasta que quede lisa. Si queda muy espesa, la aligerás con agua caliente; si queda líquida, la hervís 5 minutos sin tapa.
Servís con medio huevo duro picado en cada plato.
Rinde 4 platos. Se conserva 4 días en la heladera y se puede freezar.'),
  ('crema-de-hinojo-y-papa-con-pollo-desmenuzado', 'Crema de hinojo y papa con pollo desmenuzado', 35, 4, '{almuerzo,cena}', true, 'Cortás el hinojo en láminas y la papa en cubos.
Sofreís la cebolla picada con el aceite 4 minutos. Sumás las verduras y el caldo (cubre justo) con sal y pimienta; tapás y hervís 20 minutos hasta que estén bien tiernas.
Procesás con minipimer hasta que quede lisa. Si queda muy espesa, la aligerás con agua caliente; si queda líquida, la hervís 5 minutos sin tapa.
Servís con pollo desmenuzado (de una pata o una pechuga hervida) calentado en la sopa.
Rinde 4 platos. Se conserva 4 días en la heladera y se puede freezar.'),
  ('crema-de-arvejas-con-pollo-desmenuzado', 'Crema de arvejas con pollo desmenuzado', 35, 4, '{almuerzo,cena}', true, 'Cortás la papa en cubos; las arvejas van enteras.
Sofreís la cebolla picada con el aceite 4 minutos. Sumás las verduras y el caldo (cubre justo) con sal y pimienta; tapás y hervís 20 minutos hasta que estén bien tiernas.
Procesás con minipimer hasta que quede lisa. Si queda muy espesa, la aligerás con agua caliente; si queda líquida, la hervís 5 minutos sin tapa.
Servís con pollo desmenuzado (de una pata o una pechuga hervida) calentado en la sopa.
Rinde 4 platos. Se conserva 4 días en la heladera y se puede freezar.'),
  ('crema-de-mandioca-con-pollo-desmenuzado', 'Crema de mandioca con pollo desmenuzado', 35, 4, '{almuerzo,cena}', true, 'Pelás la mandioca (sacando el centro fibroso) y la zanahoria, y las cortás en cubos.
Sofreís la cebolla picada con el aceite 4 minutos. Sumás las verduras y el caldo (cubre justo) con sal y pimienta; tapás y hervís 20 minutos hasta que estén bien tiernas.
Procesás con minipimer hasta que quede lisa. Si queda muy espesa, la aligerás con agua caliente; si queda líquida, la hervís 5 minutos sin tapa.
Servís con pollo desmenuzado (de una pata o una pechuga hervida) calentado en la sopa.
Rinde 4 platos. Se conserva 4 días en la heladera y se puede freezar.'),
  ('crema-de-brocoli-con-croutons', 'Crema de brócoli con croutons', 35, 4, '{almuerzo,cena}', true, 'Cortás el brócoli en arbolitos (los tallos también, pelados y en rodajas) y la papa en cubos.
Sofreís la cebolla picada con el aceite 4 minutos. Sumás las verduras y el caldo (cubre justo) con sal y pimienta; tapás y hervís 20 minutos hasta que estén bien tiernas.
Procesás con minipimer hasta que quede lisa. Si queda muy espesa, la aligerás con agua caliente; si queda líquida, la hervís 5 minutos sin tapa.
Servís con croutons por encima.
Rinde 4 platos. Se conserva 4 días en la heladera y se puede freezar.'),
  ('crema-de-zanahoria-con-queso-rallado', 'Crema de zanahoria con queso rallado', 35, 4, '{almuerzo,cena}', true, 'Pelás las zanahorias y la papa y las cortás en rodajas.
Sofreís la cebolla picada con el aceite 4 minutos. Sumás las verduras y el caldo (cubre justo) con sal y pimienta; tapás y hervís 20 minutos hasta que estén bien tiernas.
Procesás con minipimer hasta que quede lisa. Si queda muy espesa, la aligerás con agua caliente; si queda líquida, la hervís 5 minutos sin tapa.
Servís con queso rallado por encima.
Rinde 4 platos. Se conserva 4 días en la heladera y se puede freezar.'),
  ('crema-de-espinaca-con-croutons', 'Crema de espinaca con croutons', 35, 4, '{almuerzo,cena}', true, 'Lavás la espinaca y cortás la papa en cubos.
Sofreís la cebolla picada con el aceite 4 minutos. Sumás las verduras y el caldo (cubre justo) con sal y pimienta; tapás y hervís 20 minutos hasta que estén bien tiernas.
Procesás con minipimer hasta que quede lisa. Si queda muy espesa, la aligerás con agua caliente; si queda líquida, la hervís 5 minutos sin tapa.
Servís con croutons por encima.
Rinde 4 platos. Se conserva 4 días en la heladera y se puede freezar.'),
  ('crema-de-choclo-con-pollo-desmenuzado', 'Crema de choclo con pollo desmenuzado', 35, 4, '{almuerzo,cena}', true, 'Escurrís el choclo y cortás la papa en cubos.
Sofreís la cebolla picada con el aceite 4 minutos. Sumás las verduras y el caldo (cubre justo) con sal y pimienta; tapás y hervís 20 minutos hasta que estén bien tiernas.
Procesás con minipimer hasta que quede lisa. Si queda muy espesa, la aligerás con agua caliente; si queda líquida, la hervís 5 minutos sin tapa.
Servís con pollo desmenuzado (de una pata o una pechuga hervida) calentado en la sopa.
Rinde 4 platos. Se conserva 4 días en la heladera y se puede freezar.'),
  ('crema-de-choclo-con-croutons', 'Crema de choclo con croutons', 35, 4, '{almuerzo,cena}', true, 'Escurrís el choclo y cortás la papa en cubos.
Sofreís la cebolla picada con el aceite 4 minutos. Sumás las verduras y el caldo (cubre justo) con sal y pimienta; tapás y hervís 20 minutos hasta que estén bien tiernas.
Procesás con minipimer hasta que quede lisa. Si queda muy espesa, la aligerás con agua caliente; si queda líquida, la hervís 5 minutos sin tapa.
Servís con croutons por encima.
Rinde 4 platos. Se conserva 4 días en la heladera y se puede freezar.'),
  ('crema-de-puerro-y-papa-con-pollo-desmenuzado', 'Crema de puerro y papa con pollo desmenuzado', 35, 4, '{almuerzo,cena}', true, 'Cortás los puerros en rodajas finas (la parte blanca y un poco de la verde) y la papa en cubos.
Sofreís la cebolla picada con el aceite 4 minutos. Sumás las verduras y el caldo (cubre justo) con sal y pimienta; tapás y hervís 20 minutos hasta que estén bien tiernas.
Procesás con minipimer hasta que quede lisa. Si queda muy espesa, la aligerás con agua caliente; si queda líquida, la hervís 5 minutos sin tapa.
Servís con pollo desmenuzado (de una pata o una pechuga hervida) calentado en la sopa.
Rinde 4 platos. Se conserva 4 días en la heladera y se puede freezar.'),
  ('crema-de-tomate-con-semillas-de-zapallo', 'Crema de tomate con semillas de zapallo', 35, 4, '{almuerzo,cena}', true, 'Cortás los tomates en cuartos y la zanahoria en rodajas.
Sofreís la cebolla picada con el aceite 4 minutos. Sumás las verduras y el caldo (cubre justo) con sal y pimienta; tapás y hervís 20 minutos hasta que estén bien tiernas.
Procesás con minipimer hasta que quede lisa. Si queda muy espesa, la aligerás con agua caliente; si queda líquida, la hervís 5 minutos sin tapa.
Servís con semillas de zapallo tostadas y un hilo de aceite de oliva.
Rinde 4 platos. Se conserva 4 días en la heladera y se puede freezar.'),
  ('crema-de-coliflor-con-jamon-crudo-crocante', 'Crema de coliflor con jamón crudo crocante', 35, 4, '{almuerzo,cena}', true, 'Cortás la coliflor en arbolitos y la papa en cubos.
Sofreís la cebolla picada con el aceite 4 minutos. Sumás las verduras y el caldo (cubre justo) con sal y pimienta; tapás y hervís 20 minutos hasta que estén bien tiernas.
Procesás con minipimer hasta que quede lisa. Si queda muy espesa, la aligerás con agua caliente; si queda líquida, la hervís 5 minutos sin tapa.
Dorás el jamón crudo en tiritas en una sartén seca hasta que quede crocante y lo desmenuzás arriba.
Rinde 4 platos. Se conserva 4 días en la heladera y se puede freezar.'),
  ('crema-de-calabaza-con-huevo-duro', 'Crema de calabaza con huevo duro', 35, 4, '{almuerzo,cena}', true, 'Pelás la calabaza y la papa y las cortás en cubos.
Sofreís la cebolla picada con el aceite 4 minutos. Sumás las verduras y el caldo (cubre justo) con sal y pimienta; tapás y hervís 20 minutos hasta que estén bien tiernas.
Procesás con minipimer hasta que quede lisa. Si queda muy espesa, la aligerás con agua caliente; si queda líquida, la hervís 5 minutos sin tapa.
Servís con medio huevo duro picado en cada plato.
Rinde 4 platos. Se conserva 4 días en la heladera y se puede freezar.'),
  ('crema-de-brocoli-con-jamon-crudo-crocante', 'Crema de brócoli con jamón crudo crocante', 35, 4, '{almuerzo,cena}', true, 'Cortás el brócoli en arbolitos (los tallos también, pelados y en rodajas) y la papa en cubos.
Sofreís la cebolla picada con el aceite 4 minutos. Sumás las verduras y el caldo (cubre justo) con sal y pimienta; tapás y hervís 20 minutos hasta que estén bien tiernas.
Procesás con minipimer hasta que quede lisa. Si queda muy espesa, la aligerás con agua caliente; si queda líquida, la hervís 5 minutos sin tapa.
Dorás el jamón crudo en tiritas en una sartén seca hasta que quede crocante y lo desmenuzás arriba.
Rinde 4 platos. Se conserva 4 días en la heladera y se puede freezar.'),
  ('crema-de-arvejas-con-queso-de-cabra', 'Crema de arvejas con queso de cabra', 35, 4, '{almuerzo,cena}', true, 'Cortás la papa en cubos; las arvejas van enteras.
Sofreís la cebolla picada con el aceite 4 minutos. Sumás las verduras y el caldo (cubre justo) con sal y pimienta; tapás y hervís 20 minutos hasta que estén bien tiernas.
Procesás con minipimer hasta que quede lisa. Si queda muy espesa, la aligerás con agua caliente; si queda líquida, la hervís 5 minutos sin tapa.
Servís con queso de cabra desmenuzado.
Rinde 4 platos. Se conserva 4 días en la heladera y se puede freezar.'),
  ('crema-de-batata-con-huevo-duro', 'Crema de batata con huevo duro', 35, 4, '{almuerzo,cena}', true, 'Pelás la batata y la zanahoria y las cortás en cubos.
Sofreís la cebolla picada con el aceite 4 minutos. Sumás las verduras y el caldo (cubre justo) con sal y pimienta; tapás y hervís 20 minutos hasta que estén bien tiernas.
Procesás con minipimer hasta que quede lisa. Si queda muy espesa, la aligerás con agua caliente; si queda líquida, la hervís 5 minutos sin tapa.
Servís con medio huevo duro picado en cada plato.
Rinde 4 platos. Se conserva 4 días en la heladera y se puede freezar.'),
  ('crema-de-tomate-con-huevo-duro', 'Crema de tomate con huevo duro', 35, 4, '{almuerzo,cena}', true, 'Cortás los tomates en cuartos y la zanahoria en rodajas.
Sofreís la cebolla picada con el aceite 4 minutos. Sumás las verduras y el caldo (cubre justo) con sal y pimienta; tapás y hervís 20 minutos hasta que estén bien tiernas.
Procesás con minipimer hasta que quede lisa. Si queda muy espesa, la aligerás con agua caliente; si queda líquida, la hervís 5 minutos sin tapa.
Servís con medio huevo duro picado en cada plato.
Rinde 4 platos. Se conserva 4 días en la heladera y se puede freezar.'),
  ('crema-de-mandioca-con-croutons', 'Crema de mandioca con croutons', 35, 4, '{almuerzo,cena}', true, 'Pelás la mandioca (sacando el centro fibroso) y la zanahoria, y las cortás en cubos.
Sofreís la cebolla picada con el aceite 4 minutos. Sumás las verduras y el caldo (cubre justo) con sal y pimienta; tapás y hervís 20 minutos hasta que estén bien tiernas.
Procesás con minipimer hasta que quede lisa. Si queda muy espesa, la aligerás con agua caliente; si queda líquida, la hervís 5 minutos sin tapa.
Servís con croutons por encima.
Rinde 4 platos. Se conserva 4 días en la heladera y se puede freezar.')
on conflict (slug) do nothing;

insert into public.recipe_items (recipe_id, food_id, qty)
select r.id, f.id, v.qty from (values
  ('frittata-de-champinones-y-cebolla-al-horno', 'huevo', 6),
  ('frittata-de-champinones-y-cebolla-al-horno', 'champinones', 240),
  ('frittata-de-champinones-y-cebolla-al-horno', 'cebolla', 0.5),
  ('frittata-de-champinones-y-cebolla-al-horno', 'aceite', 20),
  ('frittata-de-champinones-y-cebolla-al-horno', 'queso-rallado', 20),
  ('omelette-de-atun-y-tomate', 'huevo', 3),
  ('omelette-de-atun-y-tomate', 'atun-natural', 1),
  ('omelette-de-atun-y-tomate', 'tomate', 0.5),
  ('omelette-de-atun-y-tomate', 'aceite', 3),
  ('frittata-de-jamon-y-queso-al-horno', 'huevo', 6),
  ('frittata-de-jamon-y-queso-al-horno', 'jamon-cocido', 100),
  ('frittata-de-jamon-y-queso-al-horno', 'queso-cremoso', 80),
  ('frittata-de-jamon-y-queso-al-horno', 'queso-rallado', 20),
  ('frittata-de-jamon-y-queso-al-horno', 'aceite', 6),
  ('revuelto-de-choclo-y-cebolla-de-verdeo', 'huevo', 3),
  ('revuelto-de-choclo-y-cebolla-de-verdeo', 'choclo', 80),
  ('revuelto-de-choclo-y-cebolla-de-verdeo', 'cebolla-verdeo', 25),
  ('revuelto-de-choclo-y-cebolla-de-verdeo', 'queso-cremoso', 30),
  ('revuelto-de-choclo-y-cebolla-de-verdeo', 'aceite', 3),
  ('tarta-de-berenjena-y-tomate', 'huevo', 3),
  ('tarta-de-berenjena-y-tomate', 'berenjena', 2),
  ('tarta-de-berenjena-y-tomate', 'tomate', 3),
  ('tarta-de-berenjena-y-tomate', 'aceite', 30),
  ('tarta-de-berenjena-y-tomate', 'tapa-tarta', 1),
  ('tarta-de-berenjena-y-tomate', 'leche', 160),
  ('tarta-de-berenjena-y-tomate', 'queso-rallado', 30),
  ('omelette-de-palmitos-y-queso', 'huevo', 3),
  ('omelette-de-palmitos-y-queso', 'palmitos', 100),
  ('omelette-de-palmitos-y-queso', 'queso-cremoso', 40),
  ('omelette-de-palmitos-y-queso', 'cebolla-verdeo', 15),
  ('omelette-de-palmitos-y-queso', 'aceite', 3),
  ('frittata-de-chauchas-y-queso-al-horno', 'huevo', 6),
  ('frittata-de-chauchas-y-queso-al-horno', 'chauchas', 240),
  ('frittata-de-chauchas-y-queso-al-horno', 'queso-cremoso', 80),
  ('frittata-de-chauchas-y-queso-al-horno', 'queso-rallado', 20),
  ('frittata-de-chauchas-y-queso-al-horno', 'aceite', 6),
  ('omelette-de-salmon-ahumado-y-cebolla-de-verdeo', 'huevo', 3),
  ('omelette-de-salmon-ahumado-y-cebolla-de-verdeo', 'salmon-ahumado', 60),
  ('omelette-de-salmon-ahumado-y-cebolla-de-verdeo', 'cebolla-verdeo', 25),
  ('omelette-de-salmon-ahumado-y-cebolla-de-verdeo', 'queso-untable', 30),
  ('omelette-de-salmon-ahumado-y-cebolla-de-verdeo', 'aceite', 3),
  ('frittata-de-salmon-ahumado-y-cebolla-de-verdeo-al-horno', 'huevo', 6),
  ('frittata-de-salmon-ahumado-y-cebolla-de-verdeo-al-horno', 'salmon-ahumado', 120),
  ('frittata-de-salmon-ahumado-y-cebolla-de-verdeo-al-horno', 'cebolla-verdeo', 50),
  ('frittata-de-salmon-ahumado-y-cebolla-de-verdeo-al-horno', 'queso-untable', 60),
  ('frittata-de-salmon-ahumado-y-cebolla-de-verdeo-al-horno', 'queso-rallado', 20),
  ('frittata-de-salmon-ahumado-y-cebolla-de-verdeo-al-horno', 'aceite', 6),
  ('frittata-de-cebolla-y-queso-azul-al-horno', 'huevo', 6),
  ('frittata-de-cebolla-y-queso-azul-al-horno', 'cebolla', 1.5),
  ('frittata-de-cebolla-y-queso-azul-al-horno', 'queso-azul', 50),
  ('frittata-de-cebolla-y-queso-azul-al-horno', 'aceite', 20),
  ('frittata-de-cebolla-y-queso-azul-al-horno', 'queso-rallado', 20),
  ('tortilla-de-berenjena-y-tomate', 'huevo', 3),
  ('tortilla-de-berenjena-y-tomate', 'berenjena', 0.5),
  ('tortilla-de-berenjena-y-tomate', 'tomate', 1),
  ('tortilla-de-berenjena-y-tomate', 'aceite', 11),
  ('frittata-de-verduras-asadas-al-horno', 'huevo', 6),
  ('frittata-de-verduras-asadas-al-horno', 'berenjena', 0.5),
  ('frittata-de-verduras-asadas-al-horno', 'morron', 1),
  ('frittata-de-verduras-asadas-al-horno', 'zapallito', 1),
  ('frittata-de-verduras-asadas-al-horno', 'cebolla', 0.5),
  ('frittata-de-verduras-asadas-al-horno', 'aceite', 20),
  ('frittata-de-verduras-asadas-al-horno', 'queso-rallado', 20),
  ('tarta-de-calabaza-y-cebolla', 'huevo', 3),
  ('tarta-de-calabaza-y-cebolla', 'calabaza', 600),
  ('tarta-de-calabaza-y-cebolla', 'cebolla', 1.5),
  ('tarta-de-calabaza-y-cebolla', 'aceite', 25),
  ('tarta-de-calabaza-y-cebolla', 'tapa-tarta', 1),
  ('tarta-de-calabaza-y-cebolla', 'leche', 160),
  ('tarta-de-calabaza-y-cebolla', 'queso-rallado', 30),
  ('omelette-de-panceta-y-queso', 'huevo', 3),
  ('omelette-de-panceta-y-queso', 'panceta', 30),
  ('omelette-de-panceta-y-queso', 'queso-cremoso', 40),
  ('omelette-de-panceta-y-queso', 'cebolla', 0.5),
  ('omelette-de-panceta-y-queso', 'aceite', 3),
  ('revuelto-de-puerro-y-queso', 'huevo', 3),
  ('revuelto-de-puerro-y-queso', 'puerro', 100),
  ('revuelto-de-puerro-y-queso', 'queso-cremoso', 40),
  ('revuelto-de-puerro-y-queso', 'aceite', 8),
  ('tortilla-de-puerro-y-queso', 'huevo', 3),
  ('tortilla-de-puerro-y-queso', 'puerro', 100),
  ('tortilla-de-puerro-y-queso', 'queso-cremoso', 40),
  ('tortilla-de-puerro-y-queso', 'aceite', 8),
  ('omelette-de-zanahoria-y-arvejas', 'huevo', 3),
  ('omelette-de-zanahoria-y-arvejas', 'zanahoria', 1),
  ('omelette-de-zanahoria-y-arvejas', 'arvejas-frescas', 60),
  ('omelette-de-zanahoria-y-arvejas', 'aceite', 8),
  ('tarta-de-puerro-y-queso', 'huevo', 3),
  ('tarta-de-puerro-y-queso', 'puerro', 400),
  ('tarta-de-puerro-y-queso', 'queso-cremoso', 160),
  ('tarta-de-puerro-y-queso', 'aceite', 20),
  ('tarta-de-puerro-y-queso', 'tapa-tarta', 1),
  ('tarta-de-puerro-y-queso', 'leche', 160),
  ('tarta-de-puerro-y-queso', 'queso-rallado', 30),
  ('tarta-de-zanahoria-y-arvejas', 'huevo', 3),
  ('tarta-de-zanahoria-y-arvejas', 'zanahoria', 4),
  ('tarta-de-zanahoria-y-arvejas', 'arvejas-frescas', 240),
  ('tarta-de-zanahoria-y-arvejas', 'aceite', 20),
  ('tarta-de-zanahoria-y-arvejas', 'tapa-tarta', 1),
  ('tarta-de-zanahoria-y-arvejas', 'leche', 160),
  ('tarta-de-zanahoria-y-arvejas', 'queso-rallado', 30),
  ('frittata-de-calabaza-y-cebolla-al-horno', 'huevo', 6),
  ('frittata-de-calabaza-y-cebolla-al-horno', 'calabaza', 300),
  ('frittata-de-calabaza-y-cebolla-al-horno', 'cebolla', 0.5),
  ('frittata-de-calabaza-y-cebolla-al-horno', 'aceite', 20),
  ('frittata-de-calabaza-y-cebolla-al-horno', 'queso-rallado', 20),
  ('tarta-de-remolacha-y-queso', 'huevo', 3),
  ('tarta-de-remolacha-y-queso', 'remolacha-cocida', 400),
  ('tarta-de-remolacha-y-queso', 'queso-cabra', 160),
  ('tarta-de-remolacha-y-queso', 'cebolla-verdeo', 60),
  ('tarta-de-remolacha-y-queso', 'tapa-tarta', 1),
  ('tarta-de-remolacha-y-queso', 'leche', 160),
  ('tarta-de-remolacha-y-queso', 'queso-rallado', 30),
  ('tortilla-de-atun-y-tomate', 'huevo', 3),
  ('tortilla-de-atun-y-tomate', 'atun-natural', 1),
  ('tortilla-de-atun-y-tomate', 'tomate', 0.5),
  ('tortilla-de-atun-y-tomate', 'aceite', 3),
  ('tarta-de-atun-y-tomate', 'huevo', 3),
  ('tarta-de-atun-y-tomate', 'atun-natural', 4),
  ('tarta-de-atun-y-tomate', 'tomate', 2.5),
  ('tarta-de-atun-y-tomate', 'tapa-tarta', 1),
  ('tarta-de-atun-y-tomate', 'leche', 160),
  ('tarta-de-atun-y-tomate', 'queso-rallado', 30),
  ('omelette-de-berenjena-y-tomate', 'huevo', 3),
  ('omelette-de-berenjena-y-tomate', 'berenjena', 0.5),
  ('omelette-de-berenjena-y-tomate', 'tomate', 1),
  ('omelette-de-berenjena-y-tomate', 'aceite', 11),
  ('tortilla-de-calabaza-y-feta', 'huevo', 3),
  ('tortilla-de-calabaza-y-feta', 'calabaza', 140),
  ('tortilla-de-calabaza-y-feta', 'feta', 40),
  ('tortilla-de-calabaza-y-feta', 'aceite', 8),
  ('frittata-de-remolacha-y-queso-al-horno', 'huevo', 6),
  ('frittata-de-remolacha-y-queso-al-horno', 'remolacha-cocida', 200),
  ('frittata-de-remolacha-y-queso-al-horno', 'queso-cabra', 80),
  ('frittata-de-remolacha-y-queso-al-horno', 'cebolla-verdeo', 30),
  ('frittata-de-remolacha-y-queso-al-horno', 'queso-rallado', 20),
  ('frittata-de-remolacha-y-queso-al-horno', 'aceite', 6),
  ('omelette-de-brocoli-y-queso', 'huevo', 3),
  ('omelette-de-brocoli-y-queso', 'brocoli', 120),
  ('omelette-de-brocoli-y-queso', 'queso-cremoso', 40),
  ('omelette-de-brocoli-y-queso', 'aceite', 3),
  ('omelette-de-chauchas-y-queso', 'huevo', 3),
  ('omelette-de-chauchas-y-queso', 'chauchas', 120),
  ('omelette-de-chauchas-y-queso', 'queso-cremoso', 40),
  ('omelette-de-chauchas-y-queso', 'aceite', 3),
  ('revuelto-de-berenjena-y-tomate', 'huevo', 3),
  ('revuelto-de-berenjena-y-tomate', 'berenjena', 0.5),
  ('revuelto-de-berenjena-y-tomate', 'tomate', 1),
  ('revuelto-de-berenjena-y-tomate', 'aceite', 11),
  ('revuelto-de-papa-y-cebolla', 'huevo', 3),
  ('revuelto-de-papa-y-cebolla', 'papa', 160),
  ('revuelto-de-papa-y-cebolla', 'cebolla', 0.5),
  ('revuelto-de-papa-y-cebolla', 'aceite', 15),
  ('mijo-con-salmon-y-brocoli', 'mijo', 60),
  ('mijo-con-salmon-y-brocoli', 'salmon', 130),
  ('mijo-con-salmon-y-brocoli', 'brocoli', 120),
  ('mijo-con-salmon-y-brocoli', 'aceite', 6),
  ('mijo-con-salmon-y-brocoli', 'limon-exprimido', 10),
  ('arroz-yamani-con-calabaza-asada-y-queso-de-cabra', 'arroz-yamani', 65),
  ('arroz-yamani-con-calabaza-asada-y-queso-de-cabra', 'calabaza', 170),
  ('arroz-yamani-con-calabaza-asada-y-queso-de-cabra', 'queso-cabra', 40),
  ('arroz-yamani-con-calabaza-asada-y-queso-de-cabra', 'aceite', 8),
  ('arroz-yamani-con-calabaza-asada-y-queso-de-cabra', 'nueces', 10),
  ('mijo-con-huevo-poche-y-espinaca', 'mijo', 60),
  ('mijo-con-huevo-poche-y-espinaca', 'huevo', 2),
  ('mijo-con-huevo-poche-y-espinaca', 'espinaca', 80),
  ('mijo-con-huevo-poche-y-espinaca', 'ajo', 0.5),
  ('mijo-con-huevo-poche-y-espinaca', 'aceite', 6),
  ('mijo-con-huevo-poche-y-espinaca', 'parmesano', 10),
  ('trigo-sarraceno-con-lentejas-y-cebolla-caramelizada', 'trigo-sarraceno', 60),
  ('trigo-sarraceno-con-lentejas-y-cebolla-caramelizada', 'lentejas-hervidas', 130),
  ('trigo-sarraceno-con-lentejas-y-cebolla-caramelizada', 'cebolla-caramelizada', 50),
  ('trigo-sarraceno-con-lentejas-y-cebolla-caramelizada', 'zanahoria', 0.5),
  ('trigo-sarraceno-con-lentejas-y-cebolla-caramelizada', 'aceite', 6),
  ('burgol-con-carne-morron-y-cebolla', 'burgol', 60),
  ('burgol-con-carne-morron-y-cebolla', 'bife-nalga', 130),
  ('burgol-con-carne-morron-y-cebolla', 'morron', 0.5),
  ('burgol-con-carne-morron-y-cebolla', 'cebolla', 0.5),
  ('burgol-con-carne-morron-y-cebolla', 'aceite', 8),
  ('cebada-con-ricota-tomate-seco-y-rucula', 'cebada', 60),
  ('cebada-con-ricota-tomate-seco-y-rucula', 'ricota', 70),
  ('cebada-con-ricota-tomate-seco-y-rucula', 'tomate-seco', 15),
  ('cebada-con-ricota-tomate-seco-y-rucula', 'rucula', 40),
  ('cebada-con-ricota-tomate-seco-y-rucula', 'aceite-oliva', 8),
  ('cebada-con-ricota-tomate-seco-y-rucula', 'nueces', 10),
  ('trigo-sarraceno-con-huevo-poche-y-espinaca', 'trigo-sarraceno', 60),
  ('trigo-sarraceno-con-huevo-poche-y-espinaca', 'huevo', 2),
  ('trigo-sarraceno-con-huevo-poche-y-espinaca', 'espinaca', 80),
  ('trigo-sarraceno-con-huevo-poche-y-espinaca', 'ajo', 0.5),
  ('trigo-sarraceno-con-huevo-poche-y-espinaca', 'aceite', 6),
  ('trigo-sarraceno-con-huevo-poche-y-espinaca', 'parmesano', 10),
  ('cebada-con-merluza-y-tomate', 'cebada', 60),
  ('cebada-con-merluza-y-tomate', 'merluza-cruda', 150),
  ('cebada-con-merluza-y-tomate', 'tomate', 1),
  ('cebada-con-merluza-y-tomate', 'cebolla', 0.5),
  ('cebada-con-merluza-y-tomate', 'aceite-oliva', 8),
  ('cebada-con-merluza-y-tomate', 'perejil', 3),
  ('polenta-cremosa-con-berenjenas-tomate-y-muzzarella', 'polenta-instantanea', 60),
  ('polenta-cremosa-con-berenjenas-tomate-y-muzzarella', 'queso-rallado', 10),
  ('polenta-cremosa-con-berenjenas-tomate-y-muzzarella', 'berenjena', 0.5),
  ('polenta-cremosa-con-berenjenas-tomate-y-muzzarella', 'tomate-triturado', 80),
  ('polenta-cremosa-con-berenjenas-tomate-y-muzzarella', 'muzzarella', 50),
  ('polenta-cremosa-con-berenjenas-tomate-y-muzzarella', 'aceite', 8),
  ('polenta-cremosa-con-berenjenas-tomate-y-muzzarella', 'albahaca', 3),
  ('arroz-integral-con-pollo-y-verduras-salteadas', 'arroz-integral', 65),
  ('arroz-integral-con-pollo-y-verduras-salteadas', 'pechuga-cruda', 130),
  ('arroz-integral-con-pollo-y-verduras-salteadas', 'zanahoria', 0.5),
  ('arroz-integral-con-pollo-y-verduras-salteadas', 'zapallito', 0.5),
  ('arroz-integral-con-pollo-y-verduras-salteadas', 'morron', 0.5),
  ('arroz-integral-con-pollo-y-verduras-salteadas', 'aceite', 8),
  ('burgol-con-calabaza-asada-y-queso-de-cabra', 'burgol', 60),
  ('burgol-con-calabaza-asada-y-queso-de-cabra', 'calabaza', 170),
  ('burgol-con-calabaza-asada-y-queso-de-cabra', 'queso-cabra', 40),
  ('burgol-con-calabaza-asada-y-queso-de-cabra', 'aceite', 8),
  ('burgol-con-calabaza-asada-y-queso-de-cabra', 'nueces', 10),
  ('arroz-con-huevo-espinaca-y-tomates-cherry', 'arroz', 65),
  ('arroz-con-huevo-espinaca-y-tomates-cherry', 'huevo', 2),
  ('arroz-con-huevo-espinaca-y-tomates-cherry', 'espinaca', 70),
  ('arroz-con-huevo-espinaca-y-tomates-cherry', 'tomate-cherry', 90),
  ('arroz-con-huevo-espinaca-y-tomates-cherry', 'aceite', 6),
  ('arroz-yamani-con-pollo-choclo-y-morron', 'arroz-yamani', 65),
  ('arroz-yamani-con-pollo-choclo-y-morron', 'pechuga-cruda', 130),
  ('arroz-yamani-con-pollo-choclo-y-morron', 'choclo', 70),
  ('arroz-yamani-con-pollo-choclo-y-morron', 'morron', 0.5),
  ('arroz-yamani-con-pollo-choclo-y-morron', 'cebolla-verdeo', 20),
  ('arroz-yamani-con-pollo-choclo-y-morron', 'aceite', 8),
  ('mijo-con-huevo-espinaca-y-tomates-cherry', 'mijo', 60),
  ('mijo-con-huevo-espinaca-y-tomates-cherry', 'huevo', 2),
  ('mijo-con-huevo-espinaca-y-tomates-cherry', 'espinaca', 70),
  ('mijo-con-huevo-espinaca-y-tomates-cherry', 'tomate-cherry', 90),
  ('mijo-con-huevo-espinaca-y-tomates-cherry', 'aceite', 6),
  ('burgol-con-atun-tomate-y-aceitunas', 'burgol', 60),
  ('burgol-con-atun-tomate-y-aceitunas', 'atun-natural', 1),
  ('burgol-con-atun-tomate-y-aceitunas', 'tomate', 1),
  ('burgol-con-atun-tomate-y-aceitunas', 'aceitunas', 15),
  ('burgol-con-atun-tomate-y-aceitunas', 'cebolla-morada', 0.5),
  ('burgol-con-atun-tomate-y-aceitunas', 'aceite-oliva', 8),
  ('burgol-con-atun-tomate-y-aceitunas', 'perejil', 3),
  ('arroz-yamani-con-ricota-tomate-seco-y-rucula', 'arroz-yamani', 65),
  ('arroz-yamani-con-ricota-tomate-seco-y-rucula', 'ricota', 70),
  ('arroz-yamani-con-ricota-tomate-seco-y-rucula', 'tomate-seco', 15),
  ('arroz-yamani-con-ricota-tomate-seco-y-rucula', 'rucula', 40),
  ('arroz-yamani-con-ricota-tomate-seco-y-rucula', 'aceite-oliva', 8),
  ('arroz-yamani-con-ricota-tomate-seco-y-rucula', 'nueces', 10),
  ('arroz-integral-con-ricota-tomate-seco-y-rucula', 'arroz-integral', 65),
  ('arroz-integral-con-ricota-tomate-seco-y-rucula', 'ricota', 70),
  ('arroz-integral-con-ricota-tomate-seco-y-rucula', 'tomate-seco', 15),
  ('arroz-integral-con-ricota-tomate-seco-y-rucula', 'rucula', 40),
  ('arroz-integral-con-ricota-tomate-seco-y-rucula', 'aceite-oliva', 8),
  ('arroz-integral-con-ricota-tomate-seco-y-rucula', 'nueces', 10),
  ('trigo-sarraceno-con-espinaca-garbanzos-y-limon', 'trigo-sarraceno', 60),
  ('trigo-sarraceno-con-espinaca-garbanzos-y-limon', 'garbanzos-hervidos', 120),
  ('trigo-sarraceno-con-espinaca-garbanzos-y-limon', 'espinaca', 80),
  ('trigo-sarraceno-con-espinaca-garbanzos-y-limon', 'ajo', 1),
  ('trigo-sarraceno-con-espinaca-garbanzos-y-limon', 'aceite', 8),
  ('trigo-sarraceno-con-espinaca-garbanzos-y-limon', 'limon-exprimido', 10),
  ('trigo-sarraceno-con-pavo-y-calabaza', 'trigo-sarraceno', 60),
  ('trigo-sarraceno-con-pavo-y-calabaza', 'pechuga-pavo', 130),
  ('trigo-sarraceno-con-pavo-y-calabaza', 'calabaza', 120),
  ('trigo-sarraceno-con-pavo-y-calabaza', 'cebolla', 0.5),
  ('trigo-sarraceno-con-pavo-y-calabaza', 'aceite', 8),
  ('cebada-con-huevo-espinaca-y-tomates-cherry', 'cebada', 60),
  ('cebada-con-huevo-espinaca-y-tomates-cherry', 'huevo', 2),
  ('cebada-con-huevo-espinaca-y-tomates-cherry', 'espinaca', 70),
  ('cebada-con-huevo-espinaca-y-tomates-cherry', 'tomate-cherry', 90),
  ('cebada-con-huevo-espinaca-y-tomates-cherry', 'aceite', 6),
  ('polenta-cremosa-con-langostinos-y-zapallitos', 'polenta-instantanea', 60),
  ('polenta-cremosa-con-langostinos-y-zapallitos', 'queso-rallado', 10),
  ('polenta-cremosa-con-langostinos-y-zapallitos', 'langostinos', 120),
  ('polenta-cremosa-con-langostinos-y-zapallitos', 'zapallito', 1),
  ('polenta-cremosa-con-langostinos-y-zapallitos', 'ajo', 1),
  ('polenta-cremosa-con-langostinos-y-zapallitos', 'aceite-oliva', 10),
  ('polenta-cremosa-con-langostinos-y-zapallitos', 'limon-exprimido', 8),
  ('mijo-con-verduras-asadas-y-queso-feta', 'mijo', 60),
  ('mijo-con-verduras-asadas-y-queso-feta', 'berenjena', 0.5),
  ('mijo-con-verduras-asadas-y-queso-feta', 'morron', 0.5),
  ('mijo-con-verduras-asadas-y-queso-feta', 'zapallito', 0.5),
  ('mijo-con-verduras-asadas-y-queso-feta', 'cebolla', 0.5),
  ('mijo-con-verduras-asadas-y-queso-feta', 'aceite', 8),
  ('mijo-con-verduras-asadas-y-queso-feta', 'feta', 40),
  ('arroz-integral-con-huevo-espinaca-y-tomates-cherry', 'arroz-integral', 65),
  ('arroz-integral-con-huevo-espinaca-y-tomates-cherry', 'huevo', 2),
  ('arroz-integral-con-huevo-espinaca-y-tomates-cherry', 'espinaca', 70),
  ('arroz-integral-con-huevo-espinaca-y-tomates-cherry', 'tomate-cherry', 90),
  ('arroz-integral-con-huevo-espinaca-y-tomates-cherry', 'aceite', 6),
  ('burgol-con-langostinos-y-zapallitos', 'burgol', 60),
  ('burgol-con-langostinos-y-zapallitos', 'langostinos', 120),
  ('burgol-con-langostinos-y-zapallitos', 'zapallito', 1),
  ('burgol-con-langostinos-y-zapallitos', 'ajo', 1),
  ('burgol-con-langostinos-y-zapallitos', 'aceite-oliva', 10),
  ('burgol-con-langostinos-y-zapallitos', 'limon-exprimido', 8),
  ('trigo-sarraceno-con-calabaza-asada-y-queso-de-cabra', 'trigo-sarraceno', 60),
  ('trigo-sarraceno-con-calabaza-asada-y-queso-de-cabra', 'calabaza', 170),
  ('trigo-sarraceno-con-calabaza-asada-y-queso-de-cabra', 'queso-cabra', 40),
  ('trigo-sarraceno-con-calabaza-asada-y-queso-de-cabra', 'aceite', 8),
  ('trigo-sarraceno-con-calabaza-asada-y-queso-de-cabra', 'nueces', 10),
  ('burgol-con-ricota-tomate-seco-y-rucula', 'burgol', 60),
  ('burgol-con-ricota-tomate-seco-y-rucula', 'ricota', 70),
  ('burgol-con-ricota-tomate-seco-y-rucula', 'tomate-seco', 15),
  ('burgol-con-ricota-tomate-seco-y-rucula', 'rucula', 40),
  ('burgol-con-ricota-tomate-seco-y-rucula', 'aceite-oliva', 8),
  ('burgol-con-ricota-tomate-seco-y-rucula', 'nueces', 10),
  ('cuscus-con-verduras-asadas-y-queso-feta', 'cuscus', 65),
  ('cuscus-con-verduras-asadas-y-queso-feta', 'berenjena', 0.5),
  ('cuscus-con-verduras-asadas-y-queso-feta', 'morron', 0.5),
  ('cuscus-con-verduras-asadas-y-queso-feta', 'zapallito', 0.5),
  ('cuscus-con-verduras-asadas-y-queso-feta', 'cebolla', 0.5),
  ('cuscus-con-verduras-asadas-y-queso-feta', 'aceite', 8),
  ('cuscus-con-verduras-asadas-y-queso-feta', 'feta', 40),
  ('arroz-basmati-con-berenjenas-tomate-y-muzzarella', 'arroz-basmati', 65),
  ('arroz-basmati-con-berenjenas-tomate-y-muzzarella', 'berenjena', 0.5),
  ('arroz-basmati-con-berenjenas-tomate-y-muzzarella', 'tomate-triturado', 80),
  ('arroz-basmati-con-berenjenas-tomate-y-muzzarella', 'muzzarella', 50),
  ('arroz-basmati-con-berenjenas-tomate-y-muzzarella', 'aceite', 8),
  ('arroz-basmati-con-berenjenas-tomate-y-muzzarella', 'albahaca', 3),
  ('arroz-con-lentejas-y-cebolla-caramelizada', 'arroz', 65),
  ('arroz-con-lentejas-y-cebolla-caramelizada', 'lentejas-hervidas', 130),
  ('arroz-con-lentejas-y-cebolla-caramelizada', 'cebolla-caramelizada', 50),
  ('arroz-con-lentejas-y-cebolla-caramelizada', 'zanahoria', 0.5),
  ('arroz-con-lentejas-y-cebolla-caramelizada', 'aceite', 6),
  ('arroz-integral-con-huevo-poche-y-espinaca', 'arroz-integral', 65),
  ('arroz-integral-con-huevo-poche-y-espinaca', 'huevo', 2),
  ('arroz-integral-con-huevo-poche-y-espinaca', 'espinaca', 80),
  ('arroz-integral-con-huevo-poche-y-espinaca', 'ajo', 0.5),
  ('arroz-integral-con-huevo-poche-y-espinaca', 'aceite', 6),
  ('arroz-integral-con-huevo-poche-y-espinaca', 'parmesano', 10),
  ('arroz-con-huevo-poche-y-espinaca', 'arroz', 65),
  ('arroz-con-huevo-poche-y-espinaca', 'huevo', 2),
  ('arroz-con-huevo-poche-y-espinaca', 'espinaca', 80),
  ('arroz-con-huevo-poche-y-espinaca', 'ajo', 0.5),
  ('arroz-con-huevo-poche-y-espinaca', 'aceite', 6),
  ('arroz-con-huevo-poche-y-espinaca', 'parmesano', 10),
  ('cebada-con-pollo-y-verduras-salteadas', 'cebada', 60),
  ('cebada-con-pollo-y-verduras-salteadas', 'pechuga-cruda', 130),
  ('cebada-con-pollo-y-verduras-salteadas', 'zanahoria', 0.5),
  ('cebada-con-pollo-y-verduras-salteadas', 'zapallito', 0.5),
  ('cebada-con-pollo-y-verduras-salteadas', 'morron', 0.5),
  ('cebada-con-pollo-y-verduras-salteadas', 'aceite', 8),
  ('trigo-sarraceno-con-berenjenas-tomate-y-muzzarella', 'trigo-sarraceno', 60),
  ('trigo-sarraceno-con-berenjenas-tomate-y-muzzarella', 'berenjena', 0.5),
  ('trigo-sarraceno-con-berenjenas-tomate-y-muzzarella', 'tomate-triturado', 80),
  ('trigo-sarraceno-con-berenjenas-tomate-y-muzzarella', 'muzzarella', 50),
  ('trigo-sarraceno-con-berenjenas-tomate-y-muzzarella', 'aceite', 8),
  ('trigo-sarraceno-con-berenjenas-tomate-y-muzzarella', 'albahaca', 3),
  ('cuscus-con-salmon-y-brocoli', 'cuscus', 65),
  ('cuscus-con-salmon-y-brocoli', 'salmon', 130),
  ('cuscus-con-salmon-y-brocoli', 'brocoli', 120),
  ('cuscus-con-salmon-y-brocoli', 'aceite', 6),
  ('cuscus-con-salmon-y-brocoli', 'limon-exprimido', 10),
  ('mijo-con-merluza-y-tomate', 'mijo', 60),
  ('mijo-con-merluza-y-tomate', 'merluza-cruda', 150),
  ('mijo-con-merluza-y-tomate', 'tomate', 1),
  ('mijo-con-merluza-y-tomate', 'cebolla', 0.5),
  ('mijo-con-merluza-y-tomate', 'aceite-oliva', 8),
  ('mijo-con-merluza-y-tomate', 'perejil', 3),
  ('arroz-yamani-con-espinaca-garbanzos-y-limon', 'arroz-yamani', 65),
  ('arroz-yamani-con-espinaca-garbanzos-y-limon', 'garbanzos-hervidos', 120),
  ('arroz-yamani-con-espinaca-garbanzos-y-limon', 'espinaca', 80),
  ('arroz-yamani-con-espinaca-garbanzos-y-limon', 'ajo', 1),
  ('arroz-yamani-con-espinaca-garbanzos-y-limon', 'aceite', 8),
  ('arroz-yamani-con-espinaca-garbanzos-y-limon', 'limon-exprimido', 10),
  ('quinoa-con-cerdo-y-manzana', 'quinoa', 60),
  ('quinoa-con-cerdo-y-manzana', 'lomo-cerdo', 130),
  ('quinoa-con-cerdo-y-manzana', 'manzana-verde', 0.5),
  ('quinoa-con-cerdo-y-manzana', 'cebolla', 0.5),
  ('quinoa-con-cerdo-y-manzana', 'aceite', 8),
  ('quinoa-con-cerdo-y-manzana', 'mostaza', 8),
  ('arroz-integral-con-carne-morron-y-cebolla', 'arroz-integral', 65),
  ('arroz-integral-con-carne-morron-y-cebolla', 'bife-nalga', 130),
  ('arroz-integral-con-carne-morron-y-cebolla', 'morron', 0.5),
  ('arroz-integral-con-carne-morron-y-cebolla', 'cebolla', 0.5),
  ('arroz-integral-con-carne-morron-y-cebolla', 'aceite', 8),
  ('burgol-con-pollo-choclo-y-morron', 'burgol', 60),
  ('burgol-con-pollo-choclo-y-morron', 'pechuga-cruda', 130),
  ('burgol-con-pollo-choclo-y-morron', 'choclo', 70),
  ('burgol-con-pollo-choclo-y-morron', 'morron', 0.5),
  ('burgol-con-pollo-choclo-y-morron', 'cebolla-verdeo', 20),
  ('burgol-con-pollo-choclo-y-morron', 'aceite', 8),
  ('quinoa-con-calabaza-asada-y-queso-de-cabra', 'quinoa', 60),
  ('quinoa-con-calabaza-asada-y-queso-de-cabra', 'calabaza', 170),
  ('quinoa-con-calabaza-asada-y-queso-de-cabra', 'queso-cabra', 40),
  ('quinoa-con-calabaza-asada-y-queso-de-cabra', 'aceite', 8),
  ('quinoa-con-calabaza-asada-y-queso-de-cabra', 'nueces', 10),
  ('burgol-con-tofu-y-vegetales-al-curry', 'burgol', 60),
  ('burgol-con-tofu-y-vegetales-al-curry', 'tofu', 130),
  ('burgol-con-tofu-y-vegetales-al-curry', 'zanahoria', 0.5),
  ('burgol-con-tofu-y-vegetales-al-curry', 'coliflor', 80),
  ('burgol-con-tofu-y-vegetales-al-curry', 'cebolla', 0.5),
  ('burgol-con-tofu-y-vegetales-al-curry', 'leche-coco', 50),
  ('burgol-con-tofu-y-vegetales-al-curry', 'aceite', 8),
  ('arroz-con-pavo-y-calabaza', 'arroz', 65),
  ('arroz-con-pavo-y-calabaza', 'pechuga-pavo', 130),
  ('arroz-con-pavo-y-calabaza', 'calabaza', 120),
  ('arroz-con-pavo-y-calabaza', 'cebolla', 0.5),
  ('arroz-con-pavo-y-calabaza', 'aceite', 8),
  ('burgol-con-merluza-y-tomate', 'burgol', 60),
  ('burgol-con-merluza-y-tomate', 'merluza-cruda', 150),
  ('burgol-con-merluza-y-tomate', 'tomate', 1),
  ('burgol-con-merluza-y-tomate', 'cebolla', 0.5),
  ('burgol-con-merluza-y-tomate', 'aceite-oliva', 8),
  ('burgol-con-merluza-y-tomate', 'perejil', 3),
  ('cebada-con-champinones-y-arvejas', 'cebada', 60),
  ('cebada-con-champinones-y-arvejas', 'champinones', 120),
  ('cebada-con-champinones-y-arvejas', 'arvejas-frescas', 60),
  ('cebada-con-champinones-y-arvejas', 'cebolla', 0.5),
  ('cebada-con-champinones-y-arvejas', 'ajo', 1),
  ('cebada-con-champinones-y-arvejas', 'aceite', 8),
  ('cebada-con-hummus-y-vegetales-crudos', 'cebada', 60),
  ('cebada-con-hummus-y-vegetales-crudos', 'hummus', 70),
  ('cebada-con-hummus-y-vegetales-crudos', 'zanahoria', 1),
  ('cebada-con-hummus-y-vegetales-crudos', 'pepino', 0.5),
  ('cebada-con-hummus-y-vegetales-crudos', 'tomate-cherry', 70),
  ('cebada-con-hummus-y-vegetales-crudos', 'aceite-oliva', 6),
  ('trigo-sarraceno-con-hummus-y-vegetales-crudos', 'trigo-sarraceno', 60),
  ('trigo-sarraceno-con-hummus-y-vegetales-crudos', 'hummus', 70),
  ('trigo-sarraceno-con-hummus-y-vegetales-crudos', 'zanahoria', 1),
  ('trigo-sarraceno-con-hummus-y-vegetales-crudos', 'pepino', 0.5),
  ('trigo-sarraceno-con-hummus-y-vegetales-crudos', 'tomate-cherry', 70),
  ('trigo-sarraceno-con-hummus-y-vegetales-crudos', 'aceite-oliva', 6),
  ('arroz-con-verduras-asadas-y-queso-feta', 'arroz', 65),
  ('arroz-con-verduras-asadas-y-queso-feta', 'berenjena', 0.5),
  ('arroz-con-verduras-asadas-y-queso-feta', 'morron', 0.5),
  ('arroz-con-verduras-asadas-y-queso-feta', 'zapallito', 0.5),
  ('arroz-con-verduras-asadas-y-queso-feta', 'cebolla', 0.5),
  ('arroz-con-verduras-asadas-y-queso-feta', 'aceite', 8),
  ('arroz-con-verduras-asadas-y-queso-feta', 'feta', 40),
  ('burgol-con-hummus-y-vegetales-crudos', 'burgol', 60),
  ('burgol-con-hummus-y-vegetales-crudos', 'hummus', 70),
  ('burgol-con-hummus-y-vegetales-crudos', 'zanahoria', 1),
  ('burgol-con-hummus-y-vegetales-crudos', 'pepino', 0.5),
  ('burgol-con-hummus-y-vegetales-crudos', 'tomate-cherry', 70),
  ('burgol-con-hummus-y-vegetales-crudos', 'aceite-oliva', 6),
  ('cebada-con-carne-morron-y-cebolla', 'cebada', 60),
  ('cebada-con-carne-morron-y-cebolla', 'bife-nalga', 130),
  ('cebada-con-carne-morron-y-cebolla', 'morron', 0.5),
  ('cebada-con-carne-morron-y-cebolla', 'cebolla', 0.5),
  ('cebada-con-carne-morron-y-cebolla', 'aceite', 8),
  ('mijo-con-espinaca-garbanzos-y-limon', 'mijo', 60),
  ('mijo-con-espinaca-garbanzos-y-limon', 'garbanzos-hervidos', 120),
  ('mijo-con-espinaca-garbanzos-y-limon', 'espinaca', 80),
  ('mijo-con-espinaca-garbanzos-y-limon', 'ajo', 1),
  ('mijo-con-espinaca-garbanzos-y-limon', 'aceite', 8),
  ('mijo-con-espinaca-garbanzos-y-limon', 'limon-exprimido', 10),
  ('burgol-con-lentejas-y-cebolla-caramelizada', 'burgol', 60),
  ('burgol-con-lentejas-y-cebolla-caramelizada', 'lentejas-hervidas', 130),
  ('burgol-con-lentejas-y-cebolla-caramelizada', 'cebolla-caramelizada', 50),
  ('burgol-con-lentejas-y-cebolla-caramelizada', 'zanahoria', 0.5),
  ('burgol-con-lentejas-y-cebolla-caramelizada', 'aceite', 6),
  ('arroz-yamani-con-berenjenas-tomate-y-muzzarella', 'arroz-yamani', 65),
  ('arroz-yamani-con-berenjenas-tomate-y-muzzarella', 'berenjena', 0.5),
  ('arroz-yamani-con-berenjenas-tomate-y-muzzarella', 'tomate-triturado', 80),
  ('arroz-yamani-con-berenjenas-tomate-y-muzzarella', 'muzzarella', 50),
  ('arroz-yamani-con-berenjenas-tomate-y-muzzarella', 'aceite', 8),
  ('arroz-yamani-con-berenjenas-tomate-y-muzzarella', 'albahaca', 3),
  ('arroz-con-salmon-y-brocoli', 'arroz', 65),
  ('arroz-con-salmon-y-brocoli', 'salmon', 130),
  ('arroz-con-salmon-y-brocoli', 'brocoli', 120),
  ('arroz-con-salmon-y-brocoli', 'aceite', 6),
  ('arroz-con-salmon-y-brocoli', 'limon-exprimido', 10),
  ('arroz-basmati-con-atun-tomate-y-aceitunas', 'arroz-basmati', 65),
  ('arroz-basmati-con-atun-tomate-y-aceitunas', 'atun-natural', 1),
  ('arroz-basmati-con-atun-tomate-y-aceitunas', 'tomate', 1),
  ('arroz-basmati-con-atun-tomate-y-aceitunas', 'aceitunas', 15),
  ('arroz-basmati-con-atun-tomate-y-aceitunas', 'cebolla-morada', 0.5),
  ('arroz-basmati-con-atun-tomate-y-aceitunas', 'aceite-oliva', 8),
  ('arroz-basmati-con-atun-tomate-y-aceitunas', 'perejil', 3),
  ('mijo-con-atun-tomate-y-aceitunas', 'mijo', 60),
  ('mijo-con-atun-tomate-y-aceitunas', 'atun-natural', 1),
  ('mijo-con-atun-tomate-y-aceitunas', 'tomate', 1),
  ('mijo-con-atun-tomate-y-aceitunas', 'aceitunas', 15),
  ('mijo-con-atun-tomate-y-aceitunas', 'cebolla-morada', 0.5),
  ('mijo-con-atun-tomate-y-aceitunas', 'aceite-oliva', 8),
  ('mijo-con-atun-tomate-y-aceitunas', 'perejil', 3),
  ('arroz-yamani-con-champinones-y-arvejas', 'arroz-yamani', 65),
  ('arroz-yamani-con-champinones-y-arvejas', 'champinones', 120),
  ('arroz-yamani-con-champinones-y-arvejas', 'arvejas-frescas', 60),
  ('arroz-yamani-con-champinones-y-arvejas', 'cebolla', 0.5),
  ('arroz-yamani-con-champinones-y-arvejas', 'ajo', 1),
  ('arroz-yamani-con-champinones-y-arvejas', 'aceite', 8),
  ('mijo-con-langostinos-y-zapallitos', 'mijo', 60),
  ('mijo-con-langostinos-y-zapallitos', 'langostinos', 120),
  ('mijo-con-langostinos-y-zapallitos', 'zapallito', 1),
  ('mijo-con-langostinos-y-zapallitos', 'ajo', 1),
  ('mijo-con-langostinos-y-zapallitos', 'aceite-oliva', 10),
  ('mijo-con-langostinos-y-zapallitos', 'limon-exprimido', 8),
  ('mijo-con-calabaza-asada-y-queso-de-cabra', 'mijo', 60),
  ('mijo-con-calabaza-asada-y-queso-de-cabra', 'calabaza', 170),
  ('mijo-con-calabaza-asada-y-queso-de-cabra', 'queso-cabra', 40),
  ('mijo-con-calabaza-asada-y-queso-de-cabra', 'aceite', 8),
  ('mijo-con-calabaza-asada-y-queso-de-cabra', 'nueces', 10),
  ('cuscus-con-pollo-y-verduras-salteadas', 'cuscus', 65),
  ('cuscus-con-pollo-y-verduras-salteadas', 'pechuga-cruda', 130),
  ('cuscus-con-pollo-y-verduras-salteadas', 'zanahoria', 0.5),
  ('cuscus-con-pollo-y-verduras-salteadas', 'zapallito', 0.5),
  ('cuscus-con-pollo-y-verduras-salteadas', 'morron', 0.5),
  ('cuscus-con-pollo-y-verduras-salteadas', 'aceite', 8),
  ('mijo-con-pollo-y-verduras-salteadas', 'mijo', 60),
  ('mijo-con-pollo-y-verduras-salteadas', 'pechuga-cruda', 130),
  ('mijo-con-pollo-y-verduras-salteadas', 'zanahoria', 0.5),
  ('mijo-con-pollo-y-verduras-salteadas', 'zapallito', 0.5),
  ('mijo-con-pollo-y-verduras-salteadas', 'morron', 0.5),
  ('mijo-con-pollo-y-verduras-salteadas', 'aceite', 8),
  ('burgol-con-espinaca-garbanzos-y-limon', 'burgol', 60),
  ('burgol-con-espinaca-garbanzos-y-limon', 'garbanzos-hervidos', 120),
  ('burgol-con-espinaca-garbanzos-y-limon', 'espinaca', 80),
  ('burgol-con-espinaca-garbanzos-y-limon', 'ajo', 1),
  ('burgol-con-espinaca-garbanzos-y-limon', 'aceite', 8),
  ('burgol-con-espinaca-garbanzos-y-limon', 'limon-exprimido', 10),
  ('arroz-basmati-con-espinaca-garbanzos-y-limon', 'arroz-basmati', 65),
  ('arroz-basmati-con-espinaca-garbanzos-y-limon', 'garbanzos-hervidos', 120),
  ('arroz-basmati-con-espinaca-garbanzos-y-limon', 'espinaca', 80),
  ('arroz-basmati-con-espinaca-garbanzos-y-limon', 'ajo', 1),
  ('arroz-basmati-con-espinaca-garbanzos-y-limon', 'aceite', 8),
  ('arroz-basmati-con-espinaca-garbanzos-y-limon', 'limon-exprimido', 10),
  ('arroz-integral-con-tofu-y-vegetales-al-curry', 'arroz-integral', 65),
  ('arroz-integral-con-tofu-y-vegetales-al-curry', 'tofu', 130),
  ('arroz-integral-con-tofu-y-vegetales-al-curry', 'zanahoria', 0.5),
  ('arroz-integral-con-tofu-y-vegetales-al-curry', 'coliflor', 80),
  ('arroz-integral-con-tofu-y-vegetales-al-curry', 'cebolla', 0.5),
  ('arroz-integral-con-tofu-y-vegetales-al-curry', 'leche-coco', 50),
  ('arroz-integral-con-tofu-y-vegetales-al-curry', 'aceite', 8),
  ('cebada-con-langostinos-y-zapallitos', 'cebada', 60),
  ('cebada-con-langostinos-y-zapallitos', 'langostinos', 120),
  ('cebada-con-langostinos-y-zapallitos', 'zapallito', 1),
  ('cebada-con-langostinos-y-zapallitos', 'ajo', 1),
  ('cebada-con-langostinos-y-zapallitos', 'aceite-oliva', 10),
  ('cebada-con-langostinos-y-zapallitos', 'limon-exprimido', 8),
  ('arroz-basmati-con-verduras-asadas-y-queso-feta', 'arroz-basmati', 65),
  ('arroz-basmati-con-verduras-asadas-y-queso-feta', 'berenjena', 0.5),
  ('arroz-basmati-con-verduras-asadas-y-queso-feta', 'morron', 0.5),
  ('arroz-basmati-con-verduras-asadas-y-queso-feta', 'zapallito', 0.5),
  ('arroz-basmati-con-verduras-asadas-y-queso-feta', 'cebolla', 0.5),
  ('arroz-basmati-con-verduras-asadas-y-queso-feta', 'aceite', 8),
  ('arroz-basmati-con-verduras-asadas-y-queso-feta', 'feta', 40),
  ('cebada-con-calabaza-asada-y-queso-de-cabra', 'cebada', 60),
  ('cebada-con-calabaza-asada-y-queso-de-cabra', 'calabaza', 170),
  ('cebada-con-calabaza-asada-y-queso-de-cabra', 'queso-cabra', 40),
  ('cebada-con-calabaza-asada-y-queso-de-cabra', 'aceite', 8),
  ('cebada-con-calabaza-asada-y-queso-de-cabra', 'nueces', 10),
  ('polenta-cremosa-con-huevo-poche-y-espinaca', 'polenta-instantanea', 60),
  ('polenta-cremosa-con-huevo-poche-y-espinaca', 'queso-rallado', 10),
  ('polenta-cremosa-con-huevo-poche-y-espinaca', 'huevo', 2),
  ('polenta-cremosa-con-huevo-poche-y-espinaca', 'espinaca', 80),
  ('polenta-cremosa-con-huevo-poche-y-espinaca', 'ajo', 0.5),
  ('polenta-cremosa-con-huevo-poche-y-espinaca', 'aceite', 6),
  ('polenta-cremosa-con-huevo-poche-y-espinaca', 'parmesano', 10),
  ('arroz-yamani-con-pavo-y-calabaza', 'arroz-yamani', 65),
  ('arroz-yamani-con-pavo-y-calabaza', 'pechuga-pavo', 130),
  ('arroz-yamani-con-pavo-y-calabaza', 'calabaza', 120),
  ('arroz-yamani-con-pavo-y-calabaza', 'cebolla', 0.5),
  ('arroz-yamani-con-pavo-y-calabaza', 'aceite', 8),
  ('arroz-integral-con-langostinos-y-zapallitos', 'arroz-integral', 65),
  ('arroz-integral-con-langostinos-y-zapallitos', 'langostinos', 120),
  ('arroz-integral-con-langostinos-y-zapallitos', 'zapallito', 1),
  ('arroz-integral-con-langostinos-y-zapallitos', 'ajo', 1),
  ('arroz-integral-con-langostinos-y-zapallitos', 'aceite-oliva', 10),
  ('arroz-integral-con-langostinos-y-zapallitos', 'limon-exprimido', 8),
  ('arroz-yamani-con-tofu-y-vegetales-al-curry', 'arroz-yamani', 65),
  ('arroz-yamani-con-tofu-y-vegetales-al-curry', 'tofu', 130),
  ('arroz-yamani-con-tofu-y-vegetales-al-curry', 'zanahoria', 0.5),
  ('arroz-yamani-con-tofu-y-vegetales-al-curry', 'coliflor', 80),
  ('arroz-yamani-con-tofu-y-vegetales-al-curry', 'cebolla', 0.5),
  ('arroz-yamani-con-tofu-y-vegetales-al-curry', 'leche-coco', 50),
  ('arroz-yamani-con-tofu-y-vegetales-al-curry', 'aceite', 8),
  ('cuscus-con-berenjenas-tomate-y-muzzarella', 'cuscus', 65),
  ('cuscus-con-berenjenas-tomate-y-muzzarella', 'berenjena', 0.5),
  ('cuscus-con-berenjenas-tomate-y-muzzarella', 'tomate-triturado', 80),
  ('cuscus-con-berenjenas-tomate-y-muzzarella', 'muzzarella', 50),
  ('cuscus-con-berenjenas-tomate-y-muzzarella', 'aceite', 8),
  ('cuscus-con-berenjenas-tomate-y-muzzarella', 'albahaca', 3),
  ('trigo-sarraceno-con-cerdo-y-manzana', 'trigo-sarraceno', 60),
  ('trigo-sarraceno-con-cerdo-y-manzana', 'lomo-cerdo', 130),
  ('trigo-sarraceno-con-cerdo-y-manzana', 'manzana-verde', 0.5),
  ('trigo-sarraceno-con-cerdo-y-manzana', 'cebolla', 0.5),
  ('trigo-sarraceno-con-cerdo-y-manzana', 'aceite', 8),
  ('trigo-sarraceno-con-cerdo-y-manzana', 'mostaza', 8),
  ('mijo-con-lentejas-y-cebolla-caramelizada', 'mijo', 60),
  ('mijo-con-lentejas-y-cebolla-caramelizada', 'lentejas-hervidas', 130),
  ('mijo-con-lentejas-y-cebolla-caramelizada', 'cebolla-caramelizada', 50),
  ('mijo-con-lentejas-y-cebolla-caramelizada', 'zanahoria', 0.5),
  ('mijo-con-lentejas-y-cebolla-caramelizada', 'aceite', 6),
  ('burgol-con-cerdo-y-manzana', 'burgol', 60),
  ('burgol-con-cerdo-y-manzana', 'lomo-cerdo', 130),
  ('burgol-con-cerdo-y-manzana', 'manzana-verde', 0.5),
  ('burgol-con-cerdo-y-manzana', 'cebolla', 0.5),
  ('burgol-con-cerdo-y-manzana', 'aceite', 8),
  ('burgol-con-cerdo-y-manzana', 'mostaza', 8),
  ('polenta-cremosa-con-lentejas-y-cebolla-caramelizada', 'polenta-instantanea', 60),
  ('polenta-cremosa-con-lentejas-y-cebolla-caramelizada', 'queso-rallado', 10),
  ('polenta-cremosa-con-lentejas-y-cebolla-caramelizada', 'lentejas-hervidas', 130),
  ('polenta-cremosa-con-lentejas-y-cebolla-caramelizada', 'cebolla-caramelizada', 50),
  ('polenta-cremosa-con-lentejas-y-cebolla-caramelizada', 'zanahoria', 0.5),
  ('polenta-cremosa-con-lentejas-y-cebolla-caramelizada', 'aceite', 6),
  ('quinoa-con-pavo-y-calabaza', 'quinoa', 60),
  ('quinoa-con-pavo-y-calabaza', 'pechuga-pavo', 130),
  ('quinoa-con-pavo-y-calabaza', 'calabaza', 120),
  ('quinoa-con-pavo-y-calabaza', 'cebolla', 0.5),
  ('quinoa-con-pavo-y-calabaza', 'aceite', 8),
  ('cuscus-con-hummus-y-vegetales-crudos', 'cuscus', 65),
  ('cuscus-con-hummus-y-vegetales-crudos', 'hummus', 70),
  ('cuscus-con-hummus-y-vegetales-crudos', 'zanahoria', 1),
  ('cuscus-con-hummus-y-vegetales-crudos', 'pepino', 0.5),
  ('cuscus-con-hummus-y-vegetales-crudos', 'tomate-cherry', 70),
  ('cuscus-con-hummus-y-vegetales-crudos', 'aceite-oliva', 6),
  ('arroz-yamani-con-carne-morron-y-cebolla', 'arroz-yamani', 65),
  ('arroz-yamani-con-carne-morron-y-cebolla', 'bife-nalga', 130),
  ('arroz-yamani-con-carne-morron-y-cebolla', 'morron', 0.5),
  ('arroz-yamani-con-carne-morron-y-cebolla', 'cebolla', 0.5),
  ('arroz-yamani-con-carne-morron-y-cebolla', 'aceite', 8),
  ('trigo-sarraceno-con-ricota-tomate-seco-y-rucula', 'trigo-sarraceno', 60),
  ('trigo-sarraceno-con-ricota-tomate-seco-y-rucula', 'ricota', 70),
  ('trigo-sarraceno-con-ricota-tomate-seco-y-rucula', 'tomate-seco', 15),
  ('trigo-sarraceno-con-ricota-tomate-seco-y-rucula', 'rucula', 40),
  ('trigo-sarraceno-con-ricota-tomate-seco-y-rucula', 'aceite-oliva', 8),
  ('trigo-sarraceno-con-ricota-tomate-seco-y-rucula', 'nueces', 10),
  ('quinoa-con-pollo-choclo-y-morron', 'quinoa', 60),
  ('quinoa-con-pollo-choclo-y-morron', 'pechuga-cruda', 130),
  ('quinoa-con-pollo-choclo-y-morron', 'choclo', 70),
  ('quinoa-con-pollo-choclo-y-morron', 'morron', 0.5),
  ('quinoa-con-pollo-choclo-y-morron', 'cebolla-verdeo', 20),
  ('quinoa-con-pollo-choclo-y-morron', 'aceite', 8),
  ('arroz-con-carne-morron-y-cebolla', 'arroz', 65),
  ('arroz-con-carne-morron-y-cebolla', 'bife-nalga', 130),
  ('arroz-con-carne-morron-y-cebolla', 'morron', 0.5),
  ('arroz-con-carne-morron-y-cebolla', 'cebolla', 0.5),
  ('arroz-con-carne-morron-y-cebolla', 'aceite', 8),
  ('mijo-con-champinones-y-arvejas', 'mijo', 60),
  ('mijo-con-champinones-y-arvejas', 'champinones', 120),
  ('mijo-con-champinones-y-arvejas', 'arvejas-frescas', 60),
  ('mijo-con-champinones-y-arvejas', 'cebolla', 0.5),
  ('mijo-con-champinones-y-arvejas', 'ajo', 1),
  ('mijo-con-champinones-y-arvejas', 'aceite', 8),
  ('arroz-yamani-con-huevo-espinaca-y-tomates-cherry', 'arroz-yamani', 65),
  ('arroz-yamani-con-huevo-espinaca-y-tomates-cherry', 'huevo', 2),
  ('arroz-yamani-con-huevo-espinaca-y-tomates-cherry', 'espinaca', 70),
  ('arroz-yamani-con-huevo-espinaca-y-tomates-cherry', 'tomate-cherry', 90),
  ('arroz-yamani-con-huevo-espinaca-y-tomates-cherry', 'aceite', 6),
  ('arroz-integral-con-pavo-y-calabaza', 'arroz-integral', 65),
  ('arroz-integral-con-pavo-y-calabaza', 'pechuga-pavo', 130),
  ('arroz-integral-con-pavo-y-calabaza', 'calabaza', 120),
  ('arroz-integral-con-pavo-y-calabaza', 'cebolla', 0.5),
  ('arroz-integral-con-pavo-y-calabaza', 'aceite', 8),
  ('arroz-basmati-con-pollo-y-verduras-salteadas', 'arroz-basmati', 65),
  ('arroz-basmati-con-pollo-y-verduras-salteadas', 'pechuga-cruda', 130),
  ('arroz-basmati-con-pollo-y-verduras-salteadas', 'zanahoria', 0.5),
  ('arroz-basmati-con-pollo-y-verduras-salteadas', 'zapallito', 0.5),
  ('arroz-basmati-con-pollo-y-verduras-salteadas', 'morron', 0.5),
  ('arroz-basmati-con-pollo-y-verduras-salteadas', 'aceite', 8),
  ('cebada-con-salmon-y-brocoli', 'cebada', 60),
  ('cebada-con-salmon-y-brocoli', 'salmon', 130),
  ('cebada-con-salmon-y-brocoli', 'brocoli', 120),
  ('cebada-con-salmon-y-brocoli', 'aceite', 6),
  ('cebada-con-salmon-y-brocoli', 'limon-exprimido', 10),
  ('mijo-con-pollo-choclo-y-morron', 'mijo', 60),
  ('mijo-con-pollo-choclo-y-morron', 'pechuga-cruda', 130),
  ('mijo-con-pollo-choclo-y-morron', 'choclo', 70),
  ('mijo-con-pollo-choclo-y-morron', 'morron', 0.5),
  ('mijo-con-pollo-choclo-y-morron', 'cebolla-verdeo', 20),
  ('mijo-con-pollo-choclo-y-morron', 'aceite', 8),
  ('polenta-cremosa-con-atun-tomate-y-aceitunas', 'polenta-instantanea', 60),
  ('polenta-cremosa-con-atun-tomate-y-aceitunas', 'queso-rallado', 10),
  ('polenta-cremosa-con-atun-tomate-y-aceitunas', 'atun-natural', 1),
  ('polenta-cremosa-con-atun-tomate-y-aceitunas', 'tomate', 1),
  ('polenta-cremosa-con-atun-tomate-y-aceitunas', 'aceitunas', 15),
  ('polenta-cremosa-con-atun-tomate-y-aceitunas', 'cebolla-morada', 0.5),
  ('polenta-cremosa-con-atun-tomate-y-aceitunas', 'aceite-oliva', 8),
  ('polenta-cremosa-con-atun-tomate-y-aceitunas', 'perejil', 3),
  ('cuscus-con-langostinos-y-zapallitos', 'cuscus', 65),
  ('cuscus-con-langostinos-y-zapallitos', 'langostinos', 120),
  ('cuscus-con-langostinos-y-zapallitos', 'zapallito', 1),
  ('cuscus-con-langostinos-y-zapallitos', 'ajo', 1),
  ('cuscus-con-langostinos-y-zapallitos', 'aceite-oliva', 10),
  ('cuscus-con-langostinos-y-zapallitos', 'limon-exprimido', 8),
  ('arroz-yamani-con-lentejas-y-cebolla-caramelizada', 'arroz-yamani', 65),
  ('arroz-yamani-con-lentejas-y-cebolla-caramelizada', 'lentejas-hervidas', 130),
  ('arroz-yamani-con-lentejas-y-cebolla-caramelizada', 'cebolla-caramelizada', 50),
  ('arroz-yamani-con-lentejas-y-cebolla-caramelizada', 'zanahoria', 0.5),
  ('arroz-yamani-con-lentejas-y-cebolla-caramelizada', 'aceite', 6),
  ('arroz-integral-con-salmon-y-brocoli', 'arroz-integral', 65),
  ('arroz-integral-con-salmon-y-brocoli', 'salmon', 130),
  ('arroz-integral-con-salmon-y-brocoli', 'brocoli', 120),
  ('arroz-integral-con-salmon-y-brocoli', 'aceite', 6),
  ('arroz-integral-con-salmon-y-brocoli', 'limon-exprimido', 10),
  ('mijo-con-tofu-y-vegetales-al-curry', 'mijo', 60),
  ('mijo-con-tofu-y-vegetales-al-curry', 'tofu', 130),
  ('mijo-con-tofu-y-vegetales-al-curry', 'zanahoria', 0.5),
  ('mijo-con-tofu-y-vegetales-al-curry', 'coliflor', 80),
  ('mijo-con-tofu-y-vegetales-al-curry', 'cebolla', 0.5),
  ('mijo-con-tofu-y-vegetales-al-curry', 'leche-coco', 50),
  ('mijo-con-tofu-y-vegetales-al-curry', 'aceite', 8),
  ('polenta-cremosa-con-calabaza-asada-y-queso-de-cabra', 'polenta-instantanea', 60),
  ('polenta-cremosa-con-calabaza-asada-y-queso-de-cabra', 'queso-rallado', 10),
  ('polenta-cremosa-con-calabaza-asada-y-queso-de-cabra', 'calabaza', 170),
  ('polenta-cremosa-con-calabaza-asada-y-queso-de-cabra', 'queso-cabra', 40),
  ('polenta-cremosa-con-calabaza-asada-y-queso-de-cabra', 'aceite', 8),
  ('polenta-cremosa-con-calabaza-asada-y-queso-de-cabra', 'nueces', 10),
  ('trigo-sarraceno-con-verduras-asadas-y-queso-feta', 'trigo-sarraceno', 60),
  ('trigo-sarraceno-con-verduras-asadas-y-queso-feta', 'berenjena', 0.5),
  ('trigo-sarraceno-con-verduras-asadas-y-queso-feta', 'morron', 0.5),
  ('trigo-sarraceno-con-verduras-asadas-y-queso-feta', 'zapallito', 0.5),
  ('trigo-sarraceno-con-verduras-asadas-y-queso-feta', 'cebolla', 0.5),
  ('trigo-sarraceno-con-verduras-asadas-y-queso-feta', 'aceite', 8),
  ('trigo-sarraceno-con-verduras-asadas-y-queso-feta', 'feta', 40),
  ('mijo-con-cerdo-y-manzana', 'mijo', 60),
  ('mijo-con-cerdo-y-manzana', 'lomo-cerdo', 130),
  ('mijo-con-cerdo-y-manzana', 'manzana-verde', 0.5),
  ('mijo-con-cerdo-y-manzana', 'cebolla', 0.5),
  ('mijo-con-cerdo-y-manzana', 'aceite', 8),
  ('mijo-con-cerdo-y-manzana', 'mostaza', 8),
  ('arroz-yamani-con-atun-tomate-y-aceitunas', 'arroz-yamani', 65),
  ('arroz-yamani-con-atun-tomate-y-aceitunas', 'atun-natural', 1),
  ('arroz-yamani-con-atun-tomate-y-aceitunas', 'tomate', 1),
  ('arroz-yamani-con-atun-tomate-y-aceitunas', 'aceitunas', 15),
  ('arroz-yamani-con-atun-tomate-y-aceitunas', 'cebolla-morada', 0.5),
  ('arroz-yamani-con-atun-tomate-y-aceitunas', 'aceite-oliva', 8),
  ('arroz-yamani-con-atun-tomate-y-aceitunas', 'perejil', 3),
  ('arroz-con-cerdo-y-manzana', 'arroz', 65),
  ('arroz-con-cerdo-y-manzana', 'lomo-cerdo', 130),
  ('arroz-con-cerdo-y-manzana', 'manzana-verde', 0.5),
  ('arroz-con-cerdo-y-manzana', 'cebolla', 0.5),
  ('arroz-con-cerdo-y-manzana', 'aceite', 8),
  ('arroz-con-cerdo-y-manzana', 'mostaza', 8),
  ('cebada-con-berenjenas-tomate-y-muzzarella', 'cebada', 60),
  ('cebada-con-berenjenas-tomate-y-muzzarella', 'berenjena', 0.5),
  ('cebada-con-berenjenas-tomate-y-muzzarella', 'tomate-triturado', 80),
  ('cebada-con-berenjenas-tomate-y-muzzarella', 'muzzarella', 50),
  ('cebada-con-berenjenas-tomate-y-muzzarella', 'aceite', 8),
  ('cebada-con-berenjenas-tomate-y-muzzarella', 'albahaca', 3),
  ('cebada-con-huevo-poche-y-espinaca', 'cebada', 60),
  ('cebada-con-huevo-poche-y-espinaca', 'huevo', 2),
  ('cebada-con-huevo-poche-y-espinaca', 'espinaca', 80),
  ('cebada-con-huevo-poche-y-espinaca', 'ajo', 0.5),
  ('cebada-con-huevo-poche-y-espinaca', 'aceite', 6),
  ('cebada-con-huevo-poche-y-espinaca', 'parmesano', 10),
  ('arroz-con-espinaca-garbanzos-y-limon', 'arroz', 65),
  ('arroz-con-espinaca-garbanzos-y-limon', 'garbanzos-hervidos', 120),
  ('arroz-con-espinaca-garbanzos-y-limon', 'espinaca', 80),
  ('arroz-con-espinaca-garbanzos-y-limon', 'ajo', 1),
  ('arroz-con-espinaca-garbanzos-y-limon', 'aceite', 8),
  ('arroz-con-espinaca-garbanzos-y-limon', 'limon-exprimido', 10),
  ('risotto-de-esparragos', 'arroz-risotto', 70),
  ('risotto-de-esparragos', 'caldo-liquido', 280),
  ('risotto-de-esparragos', 'cebolla', 0.5),
  ('risotto-de-esparragos', 'parmesano', 20),
  ('risotto-de-esparragos', 'manteca', 8),
  ('risotto-de-esparragos', 'aceite', 4),
  ('risotto-de-esparragos', 'esparragos', 120),
  ('risotto-de-esparragos', 'limon-exprimido', 8),
  ('risotto-de-cuatro-hongos-y-tomillo', 'arroz-risotto', 70),
  ('risotto-de-cuatro-hongos-y-tomillo', 'caldo-liquido', 280),
  ('risotto-de-cuatro-hongos-y-tomillo', 'cebolla', 0.5),
  ('risotto-de-cuatro-hongos-y-tomillo', 'parmesano', 20),
  ('risotto-de-cuatro-hongos-y-tomillo', 'manteca', 8),
  ('risotto-de-cuatro-hongos-y-tomillo', 'aceite', 4),
  ('risotto-de-cuatro-hongos-y-tomillo', 'champinones', 90),
  ('risotto-de-cuatro-hongos-y-tomillo', 'girgolas', 50),
  ('risotto-de-cuatro-hongos-y-tomillo', 'shiitake', 30),
  ('risotto-de-salmon', 'arroz-risotto', 70),
  ('risotto-de-salmon', 'caldo-liquido', 280),
  ('risotto-de-salmon', 'cebolla', 0.5),
  ('risotto-de-salmon', 'parmesano', 20),
  ('risotto-de-salmon', 'manteca', 8),
  ('risotto-de-salmon', 'aceite', 4),
  ('risotto-de-salmon', 'salmon', 110),
  ('risotto-de-salmon', 'cebolla-verdeo', 15),
  ('risotto-de-puerro-y-queso-azul', 'arroz-risotto', 70),
  ('risotto-de-puerro-y-queso-azul', 'caldo-liquido', 280),
  ('risotto-de-puerro-y-queso-azul', 'cebolla', 0.5),
  ('risotto-de-puerro-y-queso-azul', 'parmesano', 20),
  ('risotto-de-puerro-y-queso-azul', 'manteca', 8),
  ('risotto-de-puerro-y-queso-azul', 'aceite', 4),
  ('risotto-de-puerro-y-queso-azul', 'puerro', 100),
  ('risotto-de-puerro-y-queso-azul', 'queso-azul', 25),
  ('risotto-de-brocoli', 'arroz-risotto', 70),
  ('risotto-de-brocoli', 'caldo-liquido', 280),
  ('risotto-de-brocoli', 'cebolla', 0.5),
  ('risotto-de-brocoli', 'parmesano', 20),
  ('risotto-de-brocoli', 'manteca', 8),
  ('risotto-de-brocoli', 'aceite', 4),
  ('risotto-de-brocoli', 'brocoli', 130),
  ('risotto-de-arvejas-y-jamon', 'arroz-risotto', 70),
  ('risotto-de-arvejas-y-jamon', 'caldo-liquido', 280),
  ('risotto-de-arvejas-y-jamon', 'cebolla', 0.5),
  ('risotto-de-arvejas-y-jamon', 'parmesano', 20),
  ('risotto-de-arvejas-y-jamon', 'manteca', 8),
  ('risotto-de-arvejas-y-jamon', 'aceite', 4),
  ('risotto-de-arvejas-y-jamon', 'arvejas-frescas', 70),
  ('risotto-de-arvejas-y-jamon', 'jamon-cocido', 50),
  ('risotto-de-zapallitos', 'arroz-risotto', 70),
  ('risotto-de-zapallitos', 'caldo-liquido', 280),
  ('risotto-de-zapallitos', 'cebolla', 0.5),
  ('risotto-de-zapallitos', 'parmesano', 20),
  ('risotto-de-zapallitos', 'manteca', 8),
  ('risotto-de-zapallitos', 'aceite', 4),
  ('risotto-de-zapallitos', 'zapallito', 1),
  ('risotto-de-hongos', 'arroz-risotto', 70),
  ('risotto-de-hongos', 'caldo-liquido', 280),
  ('risotto-de-hongos', 'cebolla', 0.5),
  ('risotto-de-hongos', 'parmesano', 20),
  ('risotto-de-hongos', 'manteca', 8),
  ('risotto-de-hongos', 'aceite', 4),
  ('risotto-de-hongos', 'champinones', 130),
  ('risotto-de-hongos', 'perejil', 3),
  ('risotto-de-espinaca', 'arroz-risotto', 70),
  ('risotto-de-espinaca', 'caldo-liquido', 280),
  ('risotto-de-espinaca', 'cebolla', 0.5),
  ('risotto-de-espinaca', 'parmesano', 20),
  ('risotto-de-espinaca', 'manteca', 8),
  ('risotto-de-espinaca', 'aceite', 4),
  ('risotto-de-espinaca', 'espinaca', 100),
  ('risotto-de-remolacha', 'arroz-risotto', 70),
  ('risotto-de-remolacha', 'caldo-liquido', 280),
  ('risotto-de-remolacha', 'cebolla', 0.5),
  ('risotto-de-remolacha', 'parmesano', 20),
  ('risotto-de-remolacha', 'manteca', 8),
  ('risotto-de-remolacha', 'aceite', 4),
  ('risotto-de-remolacha', 'remolacha-cocida', 120),
  ('risotto-de-pollo-y-limon', 'arroz-risotto', 70),
  ('risotto-de-pollo-y-limon', 'caldo-liquido', 280),
  ('risotto-de-pollo-y-limon', 'cebolla', 0.5),
  ('risotto-de-pollo-y-limon', 'parmesano', 20),
  ('risotto-de-pollo-y-limon', 'manteca', 8),
  ('risotto-de-pollo-y-limon', 'aceite', 4),
  ('risotto-de-pollo-y-limon', 'pechuga-cruda', 100),
  ('risotto-de-pollo-y-limon', 'limon-exprimido', 15),
  ('risotto-de-calabaza', 'arroz-risotto', 70),
  ('risotto-de-calabaza', 'caldo-liquido', 280),
  ('risotto-de-calabaza', 'cebolla', 0.5),
  ('risotto-de-calabaza', 'parmesano', 20),
  ('risotto-de-calabaza', 'manteca', 8),
  ('risotto-de-calabaza', 'aceite', 4),
  ('risotto-de-calabaza', 'calabaza', 150),
  ('risotto-de-tomates-cherry-y-albahaca', 'arroz-risotto', 70),
  ('risotto-de-tomates-cherry-y-albahaca', 'caldo-liquido', 280),
  ('risotto-de-tomates-cherry-y-albahaca', 'cebolla', 0.5),
  ('risotto-de-tomates-cherry-y-albahaca', 'parmesano', 20),
  ('risotto-de-tomates-cherry-y-albahaca', 'manteca', 8),
  ('risotto-de-tomates-cherry-y-albahaca', 'aceite', 4),
  ('risotto-de-tomates-cherry-y-albahaca', 'tomate-cherry', 150),
  ('risotto-de-tomates-cherry-y-albahaca', 'albahaca', 4),
  ('risotto-de-langostinos', 'arroz-risotto', 70),
  ('risotto-de-langostinos', 'caldo-liquido', 280),
  ('risotto-de-langostinos', 'cebolla', 0.5),
  ('risotto-de-langostinos', 'parmesano', 20),
  ('risotto-de-langostinos', 'manteca', 8),
  ('risotto-de-langostinos', 'aceite', 4),
  ('risotto-de-langostinos', 'langostinos', 110),
  ('risotto-de-langostinos', 'ajo', 1),
  ('crema-de-espinaca-con-semillas-de-zapallo', 'espinaca', 800),
  ('crema-de-espinaca-con-semillas-de-zapallo', 'papa', 320),
  ('crema-de-espinaca-con-semillas-de-zapallo', 'cebolla', 1.5),
  ('crema-de-espinaca-con-semillas-de-zapallo', 'aceite', 25),
  ('crema-de-espinaca-con-semillas-de-zapallo', 'caldo-liquido', 880),
  ('crema-de-espinaca-con-semillas-de-zapallo', 'semillas-zapallo', 30),
  ('crema-de-choclo-con-yogur', 'choclo', 800),
  ('crema-de-choclo-con-yogur', 'papa', 280),
  ('crema-de-choclo-con-yogur', 'cebolla', 1.5),
  ('crema-de-choclo-con-yogur', 'aceite', 25),
  ('crema-de-choclo-con-yogur', 'caldo-liquido', 880),
  ('crema-de-choclo-con-yogur', 'yogur-griego', 100),
  ('crema-de-mandioca-con-jamon-crudo-crocante', 'mandioca', 640),
  ('crema-de-mandioca-con-jamon-crudo-crocante', 'zanahoria', 3),
  ('crema-de-mandioca-con-jamon-crudo-crocante', 'cebolla', 1.5),
  ('crema-de-mandioca-con-jamon-crudo-crocante', 'aceite', 25),
  ('crema-de-mandioca-con-jamon-crudo-crocante', 'caldo-liquido', 880),
  ('crema-de-mandioca-con-jamon-crudo-crocante', 'jamon-crudo', 60),
  ('crema-de-hinojo-y-papa-con-queso-rallado', 'hinojo', 800),
  ('crema-de-hinojo-y-papa-con-queso-rallado', 'papa', 400),
  ('crema-de-hinojo-y-papa-con-queso-rallado', 'cebolla', 1.5),
  ('crema-de-hinojo-y-papa-con-queso-rallado', 'aceite', 25),
  ('crema-de-hinojo-y-papa-con-queso-rallado', 'caldo-liquido', 880),
  ('crema-de-hinojo-y-papa-con-queso-rallado', 'queso-rallado', 40),
  ('crema-de-arvejas-con-queso-rallado', 'arvejas-frescas', 800),
  ('crema-de-arvejas-con-queso-rallado', 'papa', 240),
  ('crema-de-arvejas-con-queso-rallado', 'cebolla', 1.5),
  ('crema-de-arvejas-con-queso-rallado', 'aceite', 25),
  ('crema-de-arvejas-con-queso-rallado', 'caldo-liquido', 880),
  ('crema-de-arvejas-con-queso-rallado', 'queso-rallado', 40),
  ('crema-de-esparragos-con-pollo-desmenuzado', 'esparragos', 800),
  ('crema-de-esparragos-con-pollo-desmenuzado', 'papa', 320),
  ('crema-de-esparragos-con-pollo-desmenuzado', 'cebolla', 1.5),
  ('crema-de-esparragos-con-pollo-desmenuzado', 'aceite', 25),
  ('crema-de-esparragos-con-pollo-desmenuzado', 'caldo-liquido', 880),
  ('crema-de-esparragos-con-pollo-desmenuzado', 'pollo-desmenuzado', 240),
  ('crema-de-mandioca-con-queso-rallado', 'mandioca', 640),
  ('crema-de-mandioca-con-queso-rallado', 'zanahoria', 3),
  ('crema-de-mandioca-con-queso-rallado', 'cebolla', 1.5),
  ('crema-de-mandioca-con-queso-rallado', 'aceite', 25),
  ('crema-de-mandioca-con-queso-rallado', 'caldo-liquido', 880),
  ('crema-de-mandioca-con-queso-rallado', 'queso-rallado', 40),
  ('crema-de-choclo-con-queso-de-cabra', 'choclo', 800),
  ('crema-de-choclo-con-queso-de-cabra', 'papa', 280),
  ('crema-de-choclo-con-queso-de-cabra', 'cebolla', 1.5),
  ('crema-de-choclo-con-queso-de-cabra', 'aceite', 25),
  ('crema-de-choclo-con-queso-de-cabra', 'caldo-liquido', 880),
  ('crema-de-choclo-con-queso-de-cabra', 'queso-cabra', 80),
  ('crema-de-tomate-con-croutons', 'tomate', 9.5),
  ('crema-de-tomate-con-croutons', 'zanahoria', 2.5),
  ('crema-de-tomate-con-croutons', 'cebolla', 1.5),
  ('crema-de-tomate-con-croutons', 'aceite', 25),
  ('crema-de-tomate-con-croutons', 'caldo-liquido', 880),
  ('crema-de-tomate-con-croutons', 'croutons', 50),
  ('crema-de-esparragos-con-huevo-duro', 'esparragos', 800),
  ('crema-de-esparragos-con-huevo-duro', 'papa', 320),
  ('crema-de-esparragos-con-huevo-duro', 'cebolla', 1.5),
  ('crema-de-esparragos-con-huevo-duro', 'aceite', 25),
  ('crema-de-esparragos-con-huevo-duro', 'caldo-liquido', 880),
  ('crema-de-esparragos-con-huevo-duro', 'huevo', 4),
  ('crema-de-coliflor-con-croutons', 'coliflor', 960),
  ('crema-de-coliflor-con-croutons', 'papa', 240),
  ('crema-de-coliflor-con-croutons', 'cebolla', 1.5),
  ('crema-de-coliflor-con-croutons', 'aceite', 25),
  ('crema-de-coliflor-con-croutons', 'caldo-liquido', 880),
  ('crema-de-coliflor-con-croutons', 'croutons', 50),
  ('crema-de-esparragos-con-semillas-de-zapallo', 'esparragos', 800),
  ('crema-de-esparragos-con-semillas-de-zapallo', 'papa', 320),
  ('crema-de-esparragos-con-semillas-de-zapallo', 'cebolla', 1.5),
  ('crema-de-esparragos-con-semillas-de-zapallo', 'aceite', 25),
  ('crema-de-esparragos-con-semillas-de-zapallo', 'caldo-liquido', 880),
  ('crema-de-esparragos-con-semillas-de-zapallo', 'semillas-zapallo', 30),
  ('crema-de-zapallo-y-jengibre-con-yogur', 'zapallo-anco', 920),
  ('crema-de-zapallo-y-jengibre-con-yogur', 'jengibre', 30),
  ('crema-de-zapallo-y-jengibre-con-yogur', 'papa', 200),
  ('crema-de-zapallo-y-jengibre-con-yogur', 'cebolla', 1.5),
  ('crema-de-zapallo-y-jengibre-con-yogur', 'aceite', 25),
  ('crema-de-zapallo-y-jengibre-con-yogur', 'caldo-liquido', 880),
  ('crema-de-zapallo-y-jengibre-con-yogur', 'yogur-griego', 100),
  ('crema-de-esparragos-con-queso-de-cabra', 'esparragos', 800),
  ('crema-de-esparragos-con-queso-de-cabra', 'papa', 320),
  ('crema-de-esparragos-con-queso-de-cabra', 'cebolla', 1.5),
  ('crema-de-esparragos-con-queso-de-cabra', 'aceite', 25),
  ('crema-de-esparragos-con-queso-de-cabra', 'caldo-liquido', 880),
  ('crema-de-esparragos-con-queso-de-cabra', 'queso-cabra', 80),
  ('crema-de-zapallito-con-croutons', 'zapallito', 6.5),
  ('crema-de-zapallito-con-croutons', 'papa', 280),
  ('crema-de-zapallito-con-croutons', 'cebolla', 1.5),
  ('crema-de-zapallito-con-croutons', 'aceite', 25),
  ('crema-de-zapallito-con-croutons', 'caldo-liquido', 880),
  ('crema-de-zapallito-con-croutons', 'croutons', 50),
  ('crema-de-brocoli-con-queso-de-cabra', 'brocoli', 880),
  ('crema-de-brocoli-con-queso-de-cabra', 'papa', 280),
  ('crema-de-brocoli-con-queso-de-cabra', 'cebolla', 1.5),
  ('crema-de-brocoli-con-queso-de-cabra', 'aceite', 25),
  ('crema-de-brocoli-con-queso-de-cabra', 'caldo-liquido', 880),
  ('crema-de-brocoli-con-queso-de-cabra', 'queso-cabra', 80),
  ('crema-de-calabaza-con-queso-rallado', 'calabaza', 880),
  ('crema-de-calabaza-con-queso-rallado', 'papa', 240),
  ('crema-de-calabaza-con-queso-rallado', 'cebolla', 1.5),
  ('crema-de-calabaza-con-queso-rallado', 'aceite', 25),
  ('crema-de-calabaza-con-queso-rallado', 'caldo-liquido', 880),
  ('crema-de-calabaza-con-queso-rallado', 'queso-rallado', 40),
  ('crema-de-brocoli-con-queso-rallado', 'brocoli', 880),
  ('crema-de-brocoli-con-queso-rallado', 'papa', 280),
  ('crema-de-brocoli-con-queso-rallado', 'cebolla', 1.5),
  ('crema-de-brocoli-con-queso-rallado', 'aceite', 25),
  ('crema-de-brocoli-con-queso-rallado', 'caldo-liquido', 880),
  ('crema-de-brocoli-con-queso-rallado', 'queso-rallado', 40),
  ('crema-de-hinojo-y-papa-con-croutons', 'hinojo', 800),
  ('crema-de-hinojo-y-papa-con-croutons', 'papa', 400),
  ('crema-de-hinojo-y-papa-con-croutons', 'cebolla', 1.5),
  ('crema-de-hinojo-y-papa-con-croutons', 'aceite', 25),
  ('crema-de-hinojo-y-papa-con-croutons', 'caldo-liquido', 880),
  ('crema-de-hinojo-y-papa-con-croutons', 'croutons', 50),
  ('crema-de-brocoli-con-yogur', 'brocoli', 880),
  ('crema-de-brocoli-con-yogur', 'papa', 280),
  ('crema-de-brocoli-con-yogur', 'cebolla', 1.5),
  ('crema-de-brocoli-con-yogur', 'aceite', 25),
  ('crema-de-brocoli-con-yogur', 'caldo-liquido', 880),
  ('crema-de-brocoli-con-yogur', 'yogur-griego', 100),
  ('crema-de-espinaca-con-pollo-desmenuzado', 'espinaca', 800),
  ('crema-de-espinaca-con-pollo-desmenuzado', 'papa', 320),
  ('crema-de-espinaca-con-pollo-desmenuzado', 'cebolla', 1.5),
  ('crema-de-espinaca-con-pollo-desmenuzado', 'aceite', 25),
  ('crema-de-espinaca-con-pollo-desmenuzado', 'caldo-liquido', 880),
  ('crema-de-espinaca-con-pollo-desmenuzado', 'pollo-desmenuzado', 240),
  ('crema-de-espinaca-con-queso-de-cabra', 'espinaca', 800),
  ('crema-de-espinaca-con-queso-de-cabra', 'papa', 320),
  ('crema-de-espinaca-con-queso-de-cabra', 'cebolla', 1.5),
  ('crema-de-espinaca-con-queso-de-cabra', 'aceite', 25),
  ('crema-de-espinaca-con-queso-de-cabra', 'caldo-liquido', 880),
  ('crema-de-espinaca-con-queso-de-cabra', 'queso-cabra', 80),
  ('crema-de-remolacha-con-queso-de-cabra', 'remolacha-cocida', 880),
  ('crema-de-remolacha-con-queso-de-cabra', 'papa', 280),
  ('crema-de-remolacha-con-queso-de-cabra', 'cebolla', 1.5),
  ('crema-de-remolacha-con-queso-de-cabra', 'aceite', 25),
  ('crema-de-remolacha-con-queso-de-cabra', 'caldo-liquido', 880),
  ('crema-de-remolacha-con-queso-de-cabra', 'queso-cabra', 80),
  ('crema-de-esparragos-con-croutons', 'esparragos', 800),
  ('crema-de-esparragos-con-croutons', 'papa', 320),
  ('crema-de-esparragos-con-croutons', 'cebolla', 1.5),
  ('crema-de-esparragos-con-croutons', 'aceite', 25),
  ('crema-de-esparragos-con-croutons', 'caldo-liquido', 880),
  ('crema-de-esparragos-con-croutons', 'croutons', 50),
  ('crema-de-batata-con-pollo-desmenuzado', 'batata', 880),
  ('crema-de-batata-con-pollo-desmenuzado', 'zanahoria', 2.5),
  ('crema-de-batata-con-pollo-desmenuzado', 'cebolla', 1.5),
  ('crema-de-batata-con-pollo-desmenuzado', 'aceite', 25),
  ('crema-de-batata-con-pollo-desmenuzado', 'caldo-liquido', 880),
  ('crema-de-batata-con-pollo-desmenuzado', 'pollo-desmenuzado', 240),
  ('crema-de-zapallo-y-jengibre-con-queso-de-cabra', 'zapallo-anco', 920),
  ('crema-de-zapallo-y-jengibre-con-queso-de-cabra', 'jengibre', 30),
  ('crema-de-zapallo-y-jengibre-con-queso-de-cabra', 'papa', 200),
  ('crema-de-zapallo-y-jengibre-con-queso-de-cabra', 'cebolla', 1.5),
  ('crema-de-zapallo-y-jengibre-con-queso-de-cabra', 'aceite', 25),
  ('crema-de-zapallo-y-jengibre-con-queso-de-cabra', 'caldo-liquido', 880),
  ('crema-de-zapallo-y-jengibre-con-queso-de-cabra', 'queso-cabra', 80),
  ('crema-de-batata-con-semillas-de-zapallo', 'batata', 880),
  ('crema-de-batata-con-semillas-de-zapallo', 'zanahoria', 2.5),
  ('crema-de-batata-con-semillas-de-zapallo', 'cebolla', 1.5),
  ('crema-de-batata-con-semillas-de-zapallo', 'aceite', 25),
  ('crema-de-batata-con-semillas-de-zapallo', 'caldo-liquido', 880),
  ('crema-de-batata-con-semillas-de-zapallo', 'semillas-zapallo', 30),
  ('crema-de-tomate-con-jamon-crudo-crocante', 'tomate', 9.5),
  ('crema-de-tomate-con-jamon-crudo-crocante', 'zanahoria', 2.5),
  ('crema-de-tomate-con-jamon-crudo-crocante', 'cebolla', 1.5),
  ('crema-de-tomate-con-jamon-crudo-crocante', 'aceite', 25),
  ('crema-de-tomate-con-jamon-crudo-crocante', 'caldo-liquido', 880),
  ('crema-de-tomate-con-jamon-crudo-crocante', 'jamon-crudo', 60),
  ('crema-de-hinojo-y-papa-con-huevo-duro', 'hinojo', 800),
  ('crema-de-hinojo-y-papa-con-huevo-duro', 'papa', 400),
  ('crema-de-hinojo-y-papa-con-huevo-duro', 'cebolla', 1.5),
  ('crema-de-hinojo-y-papa-con-huevo-duro', 'aceite', 25),
  ('crema-de-hinojo-y-papa-con-huevo-duro', 'caldo-liquido', 880),
  ('crema-de-hinojo-y-papa-con-huevo-duro', 'huevo', 4),
  ('crema-de-remolacha-con-yogur', 'remolacha-cocida', 880),
  ('crema-de-remolacha-con-yogur', 'papa', 280),
  ('crema-de-remolacha-con-yogur', 'cebolla', 1.5),
  ('crema-de-remolacha-con-yogur', 'aceite', 25),
  ('crema-de-remolacha-con-yogur', 'caldo-liquido', 880),
  ('crema-de-remolacha-con-yogur', 'yogur-griego', 100),
  ('crema-de-tomate-con-queso-rallado', 'tomate', 9.5),
  ('crema-de-tomate-con-queso-rallado', 'zanahoria', 2.5),
  ('crema-de-tomate-con-queso-rallado', 'cebolla', 1.5),
  ('crema-de-tomate-con-queso-rallado', 'aceite', 25),
  ('crema-de-tomate-con-queso-rallado', 'caldo-liquido', 880),
  ('crema-de-tomate-con-queso-rallado', 'queso-rallado', 40),
  ('crema-de-arvejas-con-yogur', 'arvejas-frescas', 800),
  ('crema-de-arvejas-con-yogur', 'papa', 240),
  ('crema-de-arvejas-con-yogur', 'cebolla', 1.5),
  ('crema-de-arvejas-con-yogur', 'aceite', 25),
  ('crema-de-arvejas-con-yogur', 'caldo-liquido', 880),
  ('crema-de-arvejas-con-yogur', 'yogur-griego', 100),
  ('crema-de-calabaza-con-pollo-desmenuzado', 'calabaza', 880),
  ('crema-de-calabaza-con-pollo-desmenuzado', 'papa', 240),
  ('crema-de-calabaza-con-pollo-desmenuzado', 'cebolla', 1.5),
  ('crema-de-calabaza-con-pollo-desmenuzado', 'aceite', 25),
  ('crema-de-calabaza-con-pollo-desmenuzado', 'caldo-liquido', 880),
  ('crema-de-calabaza-con-pollo-desmenuzado', 'pollo-desmenuzado', 240),
  ('crema-de-mandioca-con-semillas-de-zapallo', 'mandioca', 640),
  ('crema-de-mandioca-con-semillas-de-zapallo', 'zanahoria', 3),
  ('crema-de-mandioca-con-semillas-de-zapallo', 'cebolla', 1.5),
  ('crema-de-mandioca-con-semillas-de-zapallo', 'aceite', 25),
  ('crema-de-mandioca-con-semillas-de-zapallo', 'caldo-liquido', 880),
  ('crema-de-mandioca-con-semillas-de-zapallo', 'semillas-zapallo', 30),
  ('crema-de-zapallo-y-jengibre-con-jamon-crudo-crocante', 'zapallo-anco', 920),
  ('crema-de-zapallo-y-jengibre-con-jamon-crudo-crocante', 'jengibre', 30),
  ('crema-de-zapallo-y-jengibre-con-jamon-crudo-crocante', 'papa', 200),
  ('crema-de-zapallo-y-jengibre-con-jamon-crudo-crocante', 'cebolla', 1.5),
  ('crema-de-zapallo-y-jengibre-con-jamon-crudo-crocante', 'aceite', 25),
  ('crema-de-zapallo-y-jengibre-con-jamon-crudo-crocante', 'caldo-liquido', 880),
  ('crema-de-zapallo-y-jengibre-con-jamon-crudo-crocante', 'jamon-crudo', 60),
  ('crema-de-champinones-con-croutons', 'champinones', 880),
  ('crema-de-champinones-con-croutons', 'papa', 280),
  ('crema-de-champinones-con-croutons', 'cebolla', 1.5),
  ('crema-de-champinones-con-croutons', 'aceite', 25),
  ('crema-de-champinones-con-croutons', 'caldo-liquido', 880),
  ('crema-de-champinones-con-croutons', 'croutons', 50),
  ('crema-de-brocoli-con-semillas-de-zapallo', 'brocoli', 880),
  ('crema-de-brocoli-con-semillas-de-zapallo', 'papa', 280),
  ('crema-de-brocoli-con-semillas-de-zapallo', 'cebolla', 1.5),
  ('crema-de-brocoli-con-semillas-de-zapallo', 'aceite', 25),
  ('crema-de-brocoli-con-semillas-de-zapallo', 'caldo-liquido', 880),
  ('crema-de-brocoli-con-semillas-de-zapallo', 'semillas-zapallo', 30),
  ('crema-de-batata-con-queso-rallado', 'batata', 880),
  ('crema-de-batata-con-queso-rallado', 'zanahoria', 2.5),
  ('crema-de-batata-con-queso-rallado', 'cebolla', 1.5),
  ('crema-de-batata-con-queso-rallado', 'aceite', 25),
  ('crema-de-batata-con-queso-rallado', 'caldo-liquido', 880),
  ('crema-de-batata-con-queso-rallado', 'queso-rallado', 40),
  ('crema-de-coliflor-con-huevo-duro', 'coliflor', 960),
  ('crema-de-coliflor-con-huevo-duro', 'papa', 240),
  ('crema-de-coliflor-con-huevo-duro', 'cebolla', 1.5),
  ('crema-de-coliflor-con-huevo-duro', 'aceite', 25),
  ('crema-de-coliflor-con-huevo-duro', 'caldo-liquido', 880),
  ('crema-de-coliflor-con-huevo-duro', 'huevo', 4),
  ('crema-de-hinojo-y-papa-con-pollo-desmenuzado', 'hinojo', 800),
  ('crema-de-hinojo-y-papa-con-pollo-desmenuzado', 'papa', 400),
  ('crema-de-hinojo-y-papa-con-pollo-desmenuzado', 'cebolla', 1.5),
  ('crema-de-hinojo-y-papa-con-pollo-desmenuzado', 'aceite', 25),
  ('crema-de-hinojo-y-papa-con-pollo-desmenuzado', 'caldo-liquido', 880),
  ('crema-de-hinojo-y-papa-con-pollo-desmenuzado', 'pollo-desmenuzado', 240),
  ('crema-de-arvejas-con-pollo-desmenuzado', 'arvejas-frescas', 800),
  ('crema-de-arvejas-con-pollo-desmenuzado', 'papa', 240),
  ('crema-de-arvejas-con-pollo-desmenuzado', 'cebolla', 1.5),
  ('crema-de-arvejas-con-pollo-desmenuzado', 'aceite', 25),
  ('crema-de-arvejas-con-pollo-desmenuzado', 'caldo-liquido', 880),
  ('crema-de-arvejas-con-pollo-desmenuzado', 'pollo-desmenuzado', 240),
  ('crema-de-mandioca-con-pollo-desmenuzado', 'mandioca', 640),
  ('crema-de-mandioca-con-pollo-desmenuzado', 'zanahoria', 3),
  ('crema-de-mandioca-con-pollo-desmenuzado', 'cebolla', 1.5),
  ('crema-de-mandioca-con-pollo-desmenuzado', 'aceite', 25),
  ('crema-de-mandioca-con-pollo-desmenuzado', 'caldo-liquido', 880),
  ('crema-de-mandioca-con-pollo-desmenuzado', 'pollo-desmenuzado', 240),
  ('crema-de-brocoli-con-croutons', 'brocoli', 880),
  ('crema-de-brocoli-con-croutons', 'papa', 280),
  ('crema-de-brocoli-con-croutons', 'cebolla', 1.5),
  ('crema-de-brocoli-con-croutons', 'aceite', 25),
  ('crema-de-brocoli-con-croutons', 'caldo-liquido', 880),
  ('crema-de-brocoli-con-croutons', 'croutons', 50),
  ('crema-de-zanahoria-con-queso-rallado', 'zanahoria', 11),
  ('crema-de-zanahoria-con-queso-rallado', 'papa', 240),
  ('crema-de-zanahoria-con-queso-rallado', 'cebolla', 1.5),
  ('crema-de-zanahoria-con-queso-rallado', 'aceite', 25),
  ('crema-de-zanahoria-con-queso-rallado', 'caldo-liquido', 880),
  ('crema-de-zanahoria-con-queso-rallado', 'queso-rallado', 40),
  ('crema-de-espinaca-con-croutons', 'espinaca', 800),
  ('crema-de-espinaca-con-croutons', 'papa', 320),
  ('crema-de-espinaca-con-croutons', 'cebolla', 1.5),
  ('crema-de-espinaca-con-croutons', 'aceite', 25),
  ('crema-de-espinaca-con-croutons', 'caldo-liquido', 880),
  ('crema-de-espinaca-con-croutons', 'croutons', 50),
  ('crema-de-choclo-con-pollo-desmenuzado', 'choclo', 800),
  ('crema-de-choclo-con-pollo-desmenuzado', 'papa', 280),
  ('crema-de-choclo-con-pollo-desmenuzado', 'cebolla', 1.5),
  ('crema-de-choclo-con-pollo-desmenuzado', 'aceite', 25),
  ('crema-de-choclo-con-pollo-desmenuzado', 'caldo-liquido', 880),
  ('crema-de-choclo-con-pollo-desmenuzado', 'pollo-desmenuzado', 240),
  ('crema-de-choclo-con-croutons', 'choclo', 800),
  ('crema-de-choclo-con-croutons', 'papa', 280),
  ('crema-de-choclo-con-croutons', 'cebolla', 1.5),
  ('crema-de-choclo-con-croutons', 'aceite', 25),
  ('crema-de-choclo-con-croutons', 'caldo-liquido', 880),
  ('crema-de-choclo-con-croutons', 'croutons', 50),
  ('crema-de-puerro-y-papa-con-pollo-desmenuzado', 'puerro', 600),
  ('crema-de-puerro-y-papa-con-pollo-desmenuzado', 'papa', 560),
  ('crema-de-puerro-y-papa-con-pollo-desmenuzado', 'cebolla', 1.5),
  ('crema-de-puerro-y-papa-con-pollo-desmenuzado', 'aceite', 25),
  ('crema-de-puerro-y-papa-con-pollo-desmenuzado', 'caldo-liquido', 880),
  ('crema-de-puerro-y-papa-con-pollo-desmenuzado', 'pollo-desmenuzado', 240),
  ('crema-de-tomate-con-semillas-de-zapallo', 'tomate', 9.5),
  ('crema-de-tomate-con-semillas-de-zapallo', 'zanahoria', 2.5),
  ('crema-de-tomate-con-semillas-de-zapallo', 'cebolla', 1.5),
  ('crema-de-tomate-con-semillas-de-zapallo', 'aceite', 25),
  ('crema-de-tomate-con-semillas-de-zapallo', 'caldo-liquido', 880),
  ('crema-de-tomate-con-semillas-de-zapallo', 'semillas-zapallo', 30),
  ('crema-de-coliflor-con-jamon-crudo-crocante', 'coliflor', 960),
  ('crema-de-coliflor-con-jamon-crudo-crocante', 'papa', 240),
  ('crema-de-coliflor-con-jamon-crudo-crocante', 'cebolla', 1.5),
  ('crema-de-coliflor-con-jamon-crudo-crocante', 'aceite', 25),
  ('crema-de-coliflor-con-jamon-crudo-crocante', 'caldo-liquido', 880),
  ('crema-de-coliflor-con-jamon-crudo-crocante', 'jamon-crudo', 60),
  ('crema-de-calabaza-con-huevo-duro', 'calabaza', 880),
  ('crema-de-calabaza-con-huevo-duro', 'papa', 240),
  ('crema-de-calabaza-con-huevo-duro', 'cebolla', 1.5),
  ('crema-de-calabaza-con-huevo-duro', 'aceite', 25),
  ('crema-de-calabaza-con-huevo-duro', 'caldo-liquido', 880),
  ('crema-de-calabaza-con-huevo-duro', 'huevo', 4),
  ('crema-de-brocoli-con-jamon-crudo-crocante', 'brocoli', 880),
  ('crema-de-brocoli-con-jamon-crudo-crocante', 'papa', 280),
  ('crema-de-brocoli-con-jamon-crudo-crocante', 'cebolla', 1.5),
  ('crema-de-brocoli-con-jamon-crudo-crocante', 'aceite', 25),
  ('crema-de-brocoli-con-jamon-crudo-crocante', 'caldo-liquido', 880),
  ('crema-de-brocoli-con-jamon-crudo-crocante', 'jamon-crudo', 60),
  ('crema-de-arvejas-con-queso-de-cabra', 'arvejas-frescas', 800),
  ('crema-de-arvejas-con-queso-de-cabra', 'papa', 240),
  ('crema-de-arvejas-con-queso-de-cabra', 'cebolla', 1.5),
  ('crema-de-arvejas-con-queso-de-cabra', 'aceite', 25),
  ('crema-de-arvejas-con-queso-de-cabra', 'caldo-liquido', 880),
  ('crema-de-arvejas-con-queso-de-cabra', 'queso-cabra', 80),
  ('crema-de-batata-con-huevo-duro', 'batata', 880),
  ('crema-de-batata-con-huevo-duro', 'zanahoria', 2.5),
  ('crema-de-batata-con-huevo-duro', 'cebolla', 1.5),
  ('crema-de-batata-con-huevo-duro', 'aceite', 25),
  ('crema-de-batata-con-huevo-duro', 'caldo-liquido', 880),
  ('crema-de-batata-con-huevo-duro', 'huevo', 4),
  ('crema-de-tomate-con-huevo-duro', 'tomate', 9.5),
  ('crema-de-tomate-con-huevo-duro', 'zanahoria', 2.5),
  ('crema-de-tomate-con-huevo-duro', 'cebolla', 1.5),
  ('crema-de-tomate-con-huevo-duro', 'aceite', 25),
  ('crema-de-tomate-con-huevo-duro', 'caldo-liquido', 880),
  ('crema-de-tomate-con-huevo-duro', 'huevo', 4),
  ('crema-de-mandioca-con-croutons', 'mandioca', 640),
  ('crema-de-mandioca-con-croutons', 'zanahoria', 3),
  ('crema-de-mandioca-con-croutons', 'cebolla', 1.5),
  ('crema-de-mandioca-con-croutons', 'aceite', 25),
  ('crema-de-mandioca-con-croutons', 'caldo-liquido', 880),
  ('crema-de-mandioca-con-croutons', 'croutons', 50)
) as v(recipe_slug, food_slug, qty)
join public.recipes r on r.slug = v.recipe_slug
join public.foods f on f.slug = v.food_slug
on conflict do nothing;
