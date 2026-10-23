-- Sexta tanda de la base (1.25): recetas, parte 5 de 8. Después de seed-8-alimentos.sql. Se puede correr de nuevo: agrega solo lo que falta. Generado con scripts/gen-seed.mjs

insert into public.recipes (slug, name, minutes, servings, meal_types, portable, steps) values
  ('pechuga-de-pavo-al-horno-con-zapallitos-grillados', 'Pechuga de pavo al horno con zapallitos grillados (mostaza y miel)', 45, 1, '{almuerzo,cena}', true, 'Mezclás la mostaza con la miel, el aceite, sal y pimienta y la pincelás sobre la pieza.
Cortás los zapallitos a lo largo en tiras, los pincelás con el aceite, salás y los grillás en sartén o en la placa los últimos 12 minutos.
Horno a 190 °C, 25–30 minutos, tapada con papel aluminio los primeros 15. La dejás reposar 5 minutos antes de cortar.
Servís la porción con zapallitos grillados y los jugos de la placa por encima.'),
  ('cuadril-al-horno-con-verduras-asadas-ajo-y-perejil', 'Cuadril al horno con verduras asadas (ajo y perejil)', 60, 1, '{almuerzo,cena}', true, 'Picás el ajo con el perejil, los mezclás con el aceite de oliva, sal y pimienta y los frotás sobre la pieza.
Cortás las verduras en trozos grandes, las mezclás con el aceite, sal y orégano y las ponés en la placa alrededor.
Sellás por todos lados y horneás a 190 °C, 30–35 minutos para que quede jugoso. Reposo de 10 minutos antes de cortar.
Servís la porción con verduras asadas y los jugos de la placa por encima.'),
  ('pejerrey-al-horno-con-papas-y-cebolla-ajo-y-perejil', 'Pejerrey al horno con papas y cebolla (ajo y perejil)', 32, 1, '{almuerzo,cena}', true, 'Picás el ajo con el perejil, los mezclás con el aceite de oliva, sal y pimienta y los frotás sobre la pieza.
Cortás las papas en gajos y la cebolla en plumas; las mezclás con el aceite, sal y pimentón y las ponés en la placa, que entra 15 minutos antes que el pescado.
Horno a 200 °C, 10–12 minutos, hasta que estén dorados y se separen de la espina.
Servís la porción de pescado con papas y cebolla y los jugos de la placa por encima.'),
  ('vacio-al-horno-con-papines-y-ajo-yogur-y-especias', 'Vacío al horno con papines y ajo (yogur y especias)', 120, 1, '{almuerzo,cena}', true, 'Mezclás el yogur con el ajo, el jugo de limón, comino, pimentón y sal; cubrís la pieza y marinás 1 hora en la heladera.
Cortás los papines al medio, los mezclás con el aceite, el ajo con piel, sal y romero y los ponés en una placa aparte, que van al horno los últimos 40 minutos.
Horno a 170 °C, 1 hora 30 minutos, tapado con papel aluminio, y 15 minutos más sin tapar para dorar. Reposo de 10 minutos.
Servís la porción con papines y ajo y los jugos de la placa por encima.'),
  ('bacalao-fresco-al-horno-con-brocoli-y-ajo-ajo-y-perejil', 'Bacalao fresco al horno con brócoli y ajo (ajo y perejil)', 36, 1, '{almuerzo,cena}', true, 'Picás el ajo con el perejil, los mezclás con el aceite de oliva, sal y pimienta y los frotás sobre la pieza.
Cortás el brócoli en arbolitos, lo mezclás con el aceite, el ajo laminado y sal, y lo asás en una placa aparte los últimos 15 minutos.
Horno a 200 °C, 14–16 minutos, hasta que se desarme en lascas.
Servís la porción de pescado con brócoli y ajo y los jugos de la placa por encima.'),
  ('surubi-al-horno-con-esparragos-pimenton-ahumado', 'Surubí al horno con espárragos (pimentón ahumado)', 38, 1, '{almuerzo,cena}', true, 'Frotás la pieza con el aceite, el ajo picado, pimentón ahumado, comino, sal y pimienta.
Cortás la base dura de los espárragos, los mezclás con el aceite y sal y los asás en la placa los últimos 10 minutos; terminás con limón.
Horno a 200 °C, 15–18 minutos, hasta que la carne se desarme en lascas.
Servís la porción de pescado con espárragos y los jugos de la placa por encima.'),
  ('surubi-al-horno-con-ensalada-de-rucula-y-tomates-cherry', 'Surubí al horno con ensalada de rúcula y tomates cherry (tomate y orégano)', 38, 1, '{almuerzo,cena}', true, 'Mezclás el tomate triturado con el ajo picado, orégano, el aceite, sal y pimienta y lo ponés por encima de la pieza.
Mezclás la rúcula con los cherry cortados al medio, lascas de parmesano, el aceite de oliva y sal.
Horno a 200 °C, 15–18 minutos, hasta que la carne se desarme en lascas.
Servís la porción de pescado con ensalada de rúcula y tomates cherry y los jugos de la placa por encima.'),
  ('lenguado-al-horno-con-papas-y-cebolla-soja-y-jengibre', 'Lenguado al horno con papas y cebolla (soja y jengibre)', 32, 1, '{almuerzo,cena}', true, 'Mezclás la soja con el jengibre rallado y la miel, y marinás la pieza 30 minutos.
Cortás las papas en gajos y la cebolla en plumas; las mezclás con el aceite, sal y pimentón y las ponés en la placa, que entra 15 minutos antes que el pescado.
Horno a 200 °C, 10–12 minutos, hasta que se desarme en lascas.
Servís la porción de pescado con papas y cebolla y los jugos de la placa por encima.'),
  ('abadejo-al-horno-con-ensalada-mixta-mostaza-y-miel', 'Abadejo al horno con ensalada mixta (mostaza y miel)', 35, 1, '{almuerzo,cena}', true, 'Mezclás la mostaza con la miel, el aceite, sal y pimienta y la pincelás sobre la pieza.
Lavás la lechuga, cortás el tomate en gajos y la cebolla en plumas finas; aderezás al servir con el aceite de oliva, el limón y sal.
Horno a 200 °C, 12–15 minutos, hasta que se desarme en lascas.
Servís la porción de pescado con ensalada mixta y los jugos de la placa por encima.'),
  ('solomillo-de-cerdo-al-horno-con-esparragos-ajo-y-perejil', 'Solomillo de cerdo al horno con espárragos (ajo y perejil)', 40, 1, '{almuerzo,cena}', true, 'Picás el ajo con el perejil, los mezclás con el aceite de oliva, sal y pimienta y los frotás sobre la pieza.
Cortás la base dura de los espárragos, los mezclás con el aceite y sal y los asás en la placa los últimos 10 minutos; terminás con limón.
Sellás 2 minutos por lado y lo llevás a horno a 200 °C, 15–18 minutos. Reposo de 5 minutos antes de cortar en medallones.
Servís la porción con espárragos y los jugos de la placa por encima.'),
  ('trucha-al-horno-con-esparragos-limon-y-romero', 'Trucha al horno con espárragos (limón y romero)', 38, 1, '{almuerzo,cena}', true, 'Mezclás el jugo de limón con el aceite de oliva, el ajo picado, romero, sal y pimienta. Marinás la pieza 30 minutos (o toda la noche, en la heladera).
Cortás la base dura de los espárragos, los mezclás con el aceite y sal y los asás en la placa los últimos 10 minutos; terminás con limón.
Horno a 200 °C, 15–18 minutos, hasta que la carne se desarme en lascas.
Servís la porción de pescado con espárragos y los jugos de la placa por encima.'),
  ('salmon-al-horno-con-brocoli-y-ajo-queso-gratinado', 'Salmón al horno con brócoli y ajo (queso gratinado)', 35, 1, '{almuerzo,cena}', true, 'Condimentás la pieza con sal, pimienta y orégano; los últimos 5 minutos la cubrís con el queso y gratinás.
Cortás el brócoli en arbolitos, lo mezclás con el aceite, el ajo laminado y sal, y lo asás en una placa aparte los últimos 15 minutos.
Horno a 200 °C, 12–14 minutos, hasta que esté apenas rosado en el centro.
Servís la porción de pescado con brócoli y ajo y los jugos de la placa por encima.'),
  ('bacalao-fresco-al-horno-con-verduras-asadas-pimenton', 'Bacalao fresco al horno con verduras asadas (pimentón ahumado)', 36, 1, '{almuerzo,cena}', true, 'Frotás la pieza con el aceite, el ajo picado, pimentón ahumado, comino, sal y pimienta.
Cortás las verduras en trozos grandes, las mezclás con el aceite, sal y orégano y las ponés en la placa, que entra 15 minutos antes que el pescado.
Horno a 200 °C, 14–16 minutos, hasta que se desarme en lascas.
Servís la porción de pescado con verduras asadas y los jugos de la placa por encima.'),
  ('carre-de-cerdo-al-horno-con-batatas-pimenton-ahumado', 'Carré de cerdo al horno con batatas (pimentón ahumado)', 55, 1, '{almuerzo,cena}', true, 'Frotás la pieza con el aceite, el ajo picado, pimentón ahumado, comino, sal y pimienta.
Cortás las batatas en bastones o gajos, sin pelar, las mezclás con el aceite y sal y las ponés en la placa alrededor.
Horno a 180 °C, 35–40 minutos, hasta que esté dorado por fuera y apenas rosado por dentro. Reposo de 5 minutos.
Servís la porción con batatas y los jugos de la placa por encima.'),
  ('atun-fresco-al-horno-con-coliflor-gratinada-ajo-y', 'Atún fresco al horno con coliflor gratinada (ajo y perejil)', 30, 1, '{almuerzo,cena}', true, 'Picás el ajo con el perejil, los mezclás con el aceite de oliva, sal y pimienta y los frotás sobre la pieza.
Cortás la coliflor en arbolitos, la mezclás con el aceite y sal, y la asás en una placa aparte 20 minutos; los últimos 5 le sumás el queso rallado.
Horno a 220 °C, 6–8 minutos, para que quede rosado en el centro.
Servís la porción de pescado con coliflor gratinada y los jugos de la placa por encima.'),
  ('vacio-al-horno-con-berenjenas-y-tomate-tomate-y-oregano', 'Vacío al horno con berenjenas y tomate (tomate y orégano)', 120, 1, '{almuerzo,cena}', true, 'Mezclás el tomate triturado con el ajo picado, orégano, el aceite, sal y pimienta y lo ponés por encima de la pieza.
Cortás la berenjena en rodajas gruesas y el tomate en gajos; los pincelás con el aceite, salás y los asás en una placa aparte, que van al horno los últimos 40 minutos.
Horno a 170 °C, 1 hora 30 minutos, tapado con papel aluminio, y 15 minutos más sin tapar para dorar. Reposo de 10 minutos.
Servís la porción con berenjenas y tomate y los jugos de la placa por encima.'),
  ('abadejo-al-horno-con-batatas-tomate-y-oregano', 'Abadejo al horno con batatas (tomate y orégano)', 35, 1, '{almuerzo,cena}', true, 'Mezclás el tomate triturado con el ajo picado, orégano, el aceite, sal y pimienta y lo ponés por encima de la pieza.
Cortás las batatas en bastones o gajos, sin pelar, las mezclás con el aceite y sal y las ponés en la placa, que entra 15 minutos antes que el pescado.
Horno a 200 °C, 12–15 minutos, hasta que se desarme en lascas.
Servís la porción de pescado con batatas y los jugos de la placa por encima.'),
  ('pejerrey-al-horno-con-coliflor-gratinada-ajo-y-perejil', 'Pejerrey al horno con coliflor gratinada (ajo y perejil)', 32, 1, '{almuerzo,cena}', true, 'Picás el ajo con el perejil, los mezclás con el aceite de oliva, sal y pimienta y los frotás sobre la pieza.
Cortás la coliflor en arbolitos, la mezclás con el aceite y sal, y la asás en una placa aparte 20 minutos; los últimos 5 le sumás el queso rallado.
Horno a 200 °C, 10–12 minutos, hasta que estén dorados y se separen de la espina.
Servís la porción de pescado con coliflor gratinada y los jugos de la placa por encima.'),
  ('conejo-al-horno-con-calabaza-soja-y-jengibre', 'Conejo al horno con calabaza (soja y jengibre)', 80, 1, '{almuerzo,cena}', true, 'Mezclás la soja con el jengibre rallado y la miel, y marinás la pieza 30 minutos.
Cortás la calabaza en cubos grandes, con cáscara, las mezclás con el aceite, sal y romero y las ponés en una placa aparte, que van al horno los últimos 40 minutos.
Horno a 180 °C, 50–60 minutos, dándolo vuelta una vez, hasta que esté tierno y dorado.
Servís la porción con calabaza y los jugos de la placa por encima.'),
  ('salmon-al-horno-con-ensalada-de-repollo-y-zanahoria', 'Salmón al horno con ensalada de repollo y zanahoria (tomate y orégano)', 35, 1, '{almuerzo,cena}', true, 'Mezclás el tomate triturado con el ajo picado, orégano, el aceite, sal y pimienta y lo ponés por encima de la pieza.
Cortás el repollo muy fino, rallás la zanahoria y aderezás con el aceite de oliva, el limón y sal.
Horno a 200 °C, 12–14 minutos, hasta que esté apenas rosado en el centro.
Servís la porción de pescado con ensalada de repollo y zanahoria y los jugos de la placa por encima.'),
  ('surubi-al-horno-con-ensalada-de-repollo-y-zanahoria', 'Surubí al horno con ensalada de repollo y zanahoria (queso gratinado)', 38, 1, '{almuerzo,cena}', true, 'Condimentás la pieza con sal, pimienta y orégano; los últimos 5 minutos la cubrís con el queso y gratinás.
Cortás el repollo muy fino, rallás la zanahoria y aderezás con el aceite de oliva, el limón y sal.
Horno a 200 °C, 15–18 minutos, hasta que la carne se desarme en lascas.
Servís la porción de pescado con ensalada de repollo y zanahoria y los jugos de la placa por encima.'),
  ('merluza-al-horno-con-batatas-mostaza-y-miel', 'Merluza al horno con batatas (mostaza y miel)', 35, 1, '{almuerzo,cena}', true, 'Mezclás la mostaza con la miel, el aceite, sal y pimienta y la pincelás sobre la pieza.
Cortás las batatas en bastones o gajos, sin pelar, las mezclás con el aceite y sal y las ponés en la placa, que entra 15 minutos antes que el pescado.
Horno a 200 °C, 12–15 minutos, hasta que la carne se desarme en lascas.
Servís la porción de pescado con batatas y los jugos de la placa por encima.'),
  ('solomillo-de-cerdo-al-horno-con-brocoli-y-ajo-queso', 'Solomillo de cerdo al horno con brócoli y ajo (queso gratinado)', 40, 1, '{almuerzo,cena}', true, 'Condimentás la pieza con sal, pimienta y orégano; los últimos 5 minutos la cubrís con el queso y gratinás.
Cortás el brócoli en arbolitos, lo mezclás con el aceite, el ajo laminado y sal, y lo asás en una placa aparte los últimos 15 minutos.
Sellás 2 minutos por lado y lo llevás a horno a 200 °C, 15–18 minutos. Reposo de 5 minutos antes de cortar en medallones.
Servís la porción con brócoli y ajo y los jugos de la placa por encima.'),
  ('cuadril-al-horno-con-coliflor-gratinada-soja-y-jengibre', 'Cuadril al horno con coliflor gratinada (soja y jengibre)', 60, 1, '{almuerzo,cena}', true, 'Mezclás la soja con el jengibre rallado y la miel, y marinás la pieza 30 minutos.
Cortás la coliflor en arbolitos, la mezclás con el aceite y sal, y la asás en una placa aparte 20 minutos; los últimos 5 le sumás el queso rallado.
Sellás por todos lados y horneás a 190 °C, 30–35 minutos para que quede jugoso. Reposo de 10 minutos antes de cortar.
Servís la porción con coliflor gratinada y los jugos de la placa por encima.'),
  ('salmon-al-horno-con-arroz-blanco-yogur-y-especias', 'Salmón al horno con arroz blanco (yogur y especias)', 35, 1, '{almuerzo,cena}', true, 'Mezclás el yogur con el ajo, el jugo de limón, comino, pimentón y sal; cubrís la pieza y marinás 1 hora en la heladera.
Hervís el arroz en abundante agua con sal 12 minutos y lo escurrís.
Horno a 200 °C, 12–14 minutos, hasta que esté apenas rosado en el centro.
Servís la porción de pescado con arroz blanco y los jugos de la placa por encima.'),
  ('pechuga-de-pavo-al-horno-con-ensalada-mixta-pimenton', 'Pechuga de pavo al horno con ensalada mixta (pimentón ahumado)', 45, 1, '{almuerzo,cena}', true, 'Frotás la pieza con el aceite, el ajo picado, pimentón ahumado, comino, sal y pimienta.
Lavás la lechuga, cortás el tomate en gajos y la cebolla en plumas finas; aderezás al servir con el aceite de oliva, el limón y sal.
Horno a 190 °C, 25–30 minutos, tapada con papel aluminio los primeros 15. La dejás reposar 5 minutos antes de cortar.
Servís la porción con ensalada mixta y los jugos de la placa por encima.'),
  ('pechuga-de-pollo-al-horno-con-berenjenas-y-tomate-queso', 'Pechuga de pollo al horno con berenjenas y tomate (queso gratinado)', 40, 1, '{almuerzo,cena}', true, 'Condimentás la pieza con sal, pimienta y orégano; los últimos 5 minutos la cubrís con el queso y gratinás.
Cortás la berenjena en rodajas gruesas y el tomate en gajos; los pincelás con el aceite, salás y los asás en la placa alrededor.
Horno a 200 °C, 22–25 minutos, hasta que no quede nada rosado por dentro (74 °C). La dejás reposar 5 minutos antes de cortar.
Servís la porción con berenjenas y tomate y los jugos de la placa por encima.'),
  ('pierna-de-cordero-al-horno-con-pure-de-papa-pimenton', 'Pierna de cordero al horno con puré de papa (pimentón ahumado)', 100, 1, '{almuerzo,cena}', true, 'Frotás la pieza con el aceite, el ajo picado, pimentón ahumado, comino, sal y pimienta.
Hervís las papas peladas 20 minutos, las hacés puré con la leche, la manteca, sal y nuez moscada.
Horno a 170 °C, 1 hora 15 minutos, tapada la primera hora. Reposo de 10 minutos antes de cortar.
Servís la porción con puré de papa y los jugos de la placa por encima.'),
  ('trucha-al-horno-con-batatas-yogur-y-especias', 'Trucha al horno con batatas (yogur y especias)', 38, 1, '{almuerzo,cena}', true, 'Mezclás el yogur con el ajo, el jugo de limón, comino, pimentón y sal; cubrís la pieza y marinás 1 hora en la heladera.
Cortás las batatas en bastones o gajos, sin pelar, las mezclás con el aceite y sal y las ponés en la placa, que entra 15 minutos antes que el pescado.
Horno a 200 °C, 15–18 minutos, hasta que la carne se desarme en lascas.
Servís la porción de pescado con batatas y los jugos de la placa por encima.'),
  ('cuadril-al-horno-con-pure-de-calabaza-queso-gratinado', 'Cuadril al horno con puré de calabaza (queso gratinado)', 60, 1, '{almuerzo,cena}', true, 'Condimentás la pieza con sal, pimienta y orégano; los últimos 5 minutos la cubrís con el queso y gratinás.
Hervís la calabaza pelada en cubos 15 minutos y la hacés puré con la manteca, sal y nuez moscada.
Sellás por todos lados y horneás a 190 °C, 30–35 minutos para que quede jugoso. Reposo de 10 minutos antes de cortar.
Servís la porción con puré de calabaza y los jugos de la placa por encima.'),
  ('brotola-al-horno-con-papas-y-cebolla-queso-gratinado', 'Brótola al horno con papas y cebolla (queso gratinado)', 35, 1, '{almuerzo,cena}', true, 'Condimentás la pieza con sal, pimienta y orégano; los últimos 5 minutos la cubrís con el queso y gratinás.
Cortás las papas en gajos y la cebolla en plumas; las mezclás con el aceite, sal y pimentón y las ponés en la placa, que entra 15 minutos antes que el pescado.
Horno a 200 °C, 12–15 minutos, hasta que se desarme en lascas.
Servís la porción de pescado con papas y cebolla y los jugos de la placa por encima.'),
  ('surubi-al-horno-con-ensalada-de-rucula-y-tomates-cherr-2', 'Surubí al horno con ensalada de rúcula y tomates cherry (limón y romero)', 38, 1, '{almuerzo,cena}', true, 'Mezclás el jugo de limón con el aceite de oliva, el ajo picado, romero, sal y pimienta. Marinás la pieza 30 minutos (o toda la noche, en la heladera).
Mezclás la rúcula con los cherry cortados al medio, lascas de parmesano, el aceite de oliva y sal.
Horno a 200 °C, 15–18 minutos, hasta que la carne se desarme en lascas.
Servís la porción de pescado con ensalada de rúcula y tomates cherry y los jugos de la placa por encima.'),
  ('conejo-al-horno-con-berenjenas-y-tomate-queso-gratinado', 'Conejo al horno con berenjenas y tomate (queso gratinado)', 80, 1, '{almuerzo,cena}', true, 'Condimentás la pieza con sal, pimienta y orégano; los últimos 5 minutos la cubrís con el queso y gratinás.
Cortás la berenjena en rodajas gruesas y el tomate en gajos; los pincelás con el aceite, salás y los asás en una placa aparte, que van al horno los últimos 40 minutos.
Horno a 180 °C, 50–60 minutos, dándolo vuelta una vez, hasta que esté tierno y dorado.
Servís la porción con berenjenas y tomate y los jugos de la placa por encima.'),
  ('matambre-de-cerdo-al-horno-con-papas-y-cebolla-limon-y', 'Matambre de cerdo al horno con papas y cebolla (limón y romero)', 85, 1, '{almuerzo,cena}', true, 'Mezclás el jugo de limón con el aceite de oliva, el ajo picado, romero, sal y pimienta. Marinás la pieza 30 minutos (o toda la noche, en la heladera).
Cortás las papas en gajos y la cebolla en plumas; las mezclás con el aceite, sal y pimentón y las ponés en una placa aparte, que van al horno los últimos 40 minutos.
Horno a 180 °C, 1 hora, hasta que esté tierno y dorado. Reposo de 10 minutos antes de cortar.
Servís la porción con papas y cebolla y los jugos de la placa por encima.'),
  ('pata-muslo-al-horno-con-arroz-blanco-soja-y-jengibre', 'Pata muslo al horno con arroz blanco (soja y jengibre)', 65, 1, '{almuerzo,cena}', true, 'Mezclás la soja con el jengibre rallado y la miel, y marinás la pieza 30 minutos.
Hervís el arroz en abundante agua con sal 12 minutos y lo escurrís.
Horno a 200 °C, 45–50 minutos, dando vuelta las piezas a la mitad, hasta que la piel esté dorada y los jugos salgan claros.
Servís la porción con arroz blanco y los jugos de la placa por encima.'),
  ('salmon-al-horno-con-ensalada-de-repollo-y-zanahoria-2', 'Salmón al horno con ensalada de repollo y zanahoria (mostaza y miel)', 35, 1, '{almuerzo,cena}', true, 'Mezclás la mostaza con la miel, el aceite, sal y pimienta y la pincelás sobre la pieza.
Cortás el repollo muy fino, rallás la zanahoria y aderezás con el aceite de oliva, el limón y sal.
Horno a 200 °C, 12–14 minutos, hasta que esté apenas rosado en el centro.
Servís la porción de pescado con ensalada de repollo y zanahoria y los jugos de la placa por encima.'),
  ('vacio-al-horno-con-arroz-blanco-limon-y-romero', 'Vacío al horno con arroz blanco (limón y romero)', 120, 1, '{almuerzo,cena}', true, 'Mezclás el jugo de limón con el aceite de oliva, el ajo picado, romero, sal y pimienta. Marinás la pieza 30 minutos (o toda la noche, en la heladera).
Hervís el arroz en abundante agua con sal 12 minutos y lo escurrís.
Horno a 170 °C, 1 hora 30 minutos, tapado con papel aluminio, y 15 minutos más sin tapar para dorar. Reposo de 10 minutos.
Servís la porción con arroz blanco y los jugos de la placa por encima.'),
  ('cuadril-al-horno-con-papas-y-cebolla-tomate-y-oregano', 'Cuadril al horno con papas y cebolla (tomate y orégano)', 60, 1, '{almuerzo,cena}', true, 'Mezclás el tomate triturado con el ajo picado, orégano, el aceite, sal y pimienta y lo ponés por encima de la pieza.
Cortás las papas en gajos y la cebolla en plumas; las mezclás con el aceite, sal y pimentón y las ponés en la placa alrededor.
Sellás por todos lados y horneás a 190 °C, 30–35 minutos para que quede jugoso. Reposo de 10 minutos antes de cortar.
Servís la porción con papas y cebolla y los jugos de la placa por encima.'),
  ('pechuga-de-pavo-al-horno-con-calabaza-pimenton-ahumado', 'Pechuga de pavo al horno con calabaza (pimentón ahumado)', 45, 1, '{almuerzo,cena}', true, 'Frotás la pieza con el aceite, el ajo picado, pimentón ahumado, comino, sal y pimienta.
Cortás la calabaza en cubos grandes, con cáscara, las mezclás con el aceite, sal y romero y las ponés en la placa alrededor.
Horno a 190 °C, 25–30 minutos, tapada con papel aluminio los primeros 15. La dejás reposar 5 minutos antes de cortar.
Servís la porción con calabaza y los jugos de la placa por encima.'),
  ('peceto-al-horno-con-calabaza-mostaza-y-miel', 'Peceto al horno con calabaza (mostaza y miel)', 70, 1, '{almuerzo,cena}', true, 'Mezclás la mostaza con la miel, el aceite, sal y pimienta y la pincelás sobre la pieza.
Cortás la calabaza en cubos grandes, con cáscara, las mezclás con el aceite, sal y romero y las ponés en la placa alrededor.
Sellás por todos lados en una sartén caliente y horneás a 180 °C, 40–45 minutos (hasta 65 °C por dentro). Reposo de 10 minutos antes de cortar en láminas finas.
Servís la porción con calabaza y los jugos de la placa por encima.'),
  ('matambre-de-cerdo-al-horno-con-coliflor-gratinada-yogur', 'Matambre de cerdo al horno con coliflor gratinada (yogur y especias)', 85, 1, '{almuerzo,cena}', true, 'Mezclás el yogur con el ajo, el jugo de limón, comino, pimentón y sal; cubrís la pieza y marinás 1 hora en la heladera.
Cortás la coliflor en arbolitos, la mezclás con el aceite y sal, y la asás en una placa aparte 20 minutos; los últimos 5 le sumás el queso rallado.
Horno a 180 °C, 1 hora, hasta que esté tierno y dorado. Reposo de 10 minutos antes de cortar.
Servís la porción con coliflor gratinada y los jugos de la placa por encima.'),
  ('solomillo-de-cerdo-al-horno-con-coliflor-gratinada', 'Solomillo de cerdo al horno con coliflor gratinada (pimentón ahumado)', 40, 1, '{almuerzo,cena}', true, 'Frotás la pieza con el aceite, el ajo picado, pimentón ahumado, comino, sal y pimienta.
Cortás la coliflor en arbolitos, la mezclás con el aceite y sal, y la asás en una placa aparte 20 minutos; los últimos 5 le sumás el queso rallado.
Sellás 2 minutos por lado y lo llevás a horno a 200 °C, 15–18 minutos. Reposo de 5 minutos antes de cortar en medallones.
Servís la porción con coliflor gratinada y los jugos de la placa por encima.'),
  ('surubi-al-horno-con-coliflor-gratinada-queso-gratinado', 'Surubí al horno con coliflor gratinada (queso gratinado)', 38, 1, '{almuerzo,cena}', true, 'Condimentás la pieza con sal, pimienta y orégano; los últimos 5 minutos la cubrís con el queso y gratinás.
Cortás la coliflor en arbolitos, la mezclás con el aceite y sal, y la asás en una placa aparte 20 minutos; los últimos 5 le sumás el queso rallado.
Horno a 200 °C, 15–18 minutos, hasta que la carne se desarme en lascas.
Servís la porción de pescado con coliflor gratinada y los jugos de la placa por encima.'),
  ('abadejo-al-horno-con-berenjenas-y-tomate-limon-y-romero', 'Abadejo al horno con berenjenas y tomate (limón y romero)', 35, 1, '{almuerzo,cena}', true, 'Mezclás el jugo de limón con el aceite de oliva, el ajo picado, romero, sal y pimienta. Marinás la pieza 30 minutos (o toda la noche, en la heladera).
Cortás la berenjena en rodajas gruesas y el tomate en gajos; los pincelás con el aceite, salás y los asás en la placa, que entra 15 minutos antes que el pescado.
Horno a 200 °C, 12–15 minutos, hasta que se desarme en lascas.
Servís la porción de pescado con berenjenas y tomate y los jugos de la placa por encima.'),
  ('peceto-al-horno-con-pure-de-papa-limon-y-romero', 'Peceto al horno con puré de papa (limón y romero)', 70, 1, '{almuerzo,cena}', true, 'Mezclás el jugo de limón con el aceite de oliva, el ajo picado, romero, sal y pimienta. Marinás la pieza 30 minutos (o toda la noche, en la heladera).
Hervís las papas peladas 20 minutos, las hacés puré con la leche, la manteca, sal y nuez moscada.
Sellás por todos lados en una sartén caliente y horneás a 180 °C, 40–45 minutos (hasta 65 °C por dentro). Reposo de 10 minutos antes de cortar en láminas finas.
Servís la porción con puré de papa y los jugos de la placa por encima.'),
  ('brotola-al-horno-con-calabaza-tomate-y-oregano', 'Brótola al horno con calabaza (tomate y orégano)', 35, 1, '{almuerzo,cena}', true, 'Mezclás el tomate triturado con el ajo picado, orégano, el aceite, sal y pimienta y lo ponés por encima de la pieza.
Cortás la calabaza en cubos grandes, con cáscara, las mezclás con el aceite, sal y romero y las ponés en la placa, que entra 15 minutos antes que el pescado.
Horno a 200 °C, 12–15 minutos, hasta que se desarme en lascas.
Servís la porción de pescado con calabaza y los jugos de la placa por encima.'),
  ('solomillo-de-cerdo-al-horno-con-papines-y-ajo-yogur-y', 'Solomillo de cerdo al horno con papines y ajo (yogur y especias)', 40, 1, '{almuerzo,cena}', true, 'Mezclás el yogur con el ajo, el jugo de limón, comino, pimentón y sal; cubrís la pieza y marinás 1 hora en la heladera.
Cortás los papines al medio, los mezclás con el aceite, el ajo con piel, sal y romero y los ponés en la placa alrededor.
Sellás 2 minutos por lado y lo llevás a horno a 200 °C, 15–18 minutos. Reposo de 5 minutos antes de cortar en medallones.
Servís la porción con papines y ajo y los jugos de la placa por encima.'),
  ('peceto-al-horno-con-brocoli-y-ajo-yogur-y-especias', 'Peceto al horno con brócoli y ajo (yogur y especias)', 70, 1, '{almuerzo,cena}', true, 'Mezclás el yogur con el ajo, el jugo de limón, comino, pimentón y sal; cubrís la pieza y marinás 1 hora en la heladera.
Cortás el brócoli en arbolitos, lo mezclás con el aceite, el ajo laminado y sal, y lo asás en una placa aparte los últimos 15 minutos.
Sellás por todos lados en una sartén caliente y horneás a 180 °C, 40–45 minutos (hasta 65 °C por dentro). Reposo de 10 minutos antes de cortar en láminas finas.
Servís la porción con brócoli y ajo y los jugos de la placa por encima.'),
  ('pechuga-de-pavo-al-horno-con-berenjenas-y-tomate-limon', 'Pechuga de pavo al horno con berenjenas y tomate (limón y romero)', 45, 1, '{almuerzo,cena}', true, 'Mezclás el jugo de limón con el aceite de oliva, el ajo picado, romero, sal y pimienta. Marinás la pieza 30 minutos (o toda la noche, en la heladera).
Cortás la berenjena en rodajas gruesas y el tomate en gajos; los pincelás con el aceite, salás y los asás en la placa alrededor.
Horno a 190 °C, 25–30 minutos, tapada con papel aluminio los primeros 15. La dejás reposar 5 minutos antes de cortar.
Servís la porción con berenjenas y tomate y los jugos de la placa por encima.'),
  ('pierna-de-cordero-al-horno-con-coliflor-gratinada-yogur', 'Pierna de cordero al horno con coliflor gratinada (yogur y especias)', 100, 1, '{almuerzo,cena}', true, 'Mezclás el yogur con el ajo, el jugo de limón, comino, pimentón y sal; cubrís la pieza y marinás 1 hora en la heladera.
Cortás la coliflor en arbolitos, la mezclás con el aceite y sal, y la asás en una placa aparte 20 minutos; los últimos 5 le sumás el queso rallado.
Horno a 170 °C, 1 hora 15 minutos, tapada la primera hora. Reposo de 10 minutos antes de cortar.
Servís la porción con coliflor gratinada y los jugos de la placa por encima.'),
  ('pechuga-de-pollo-al-horno-con-batatas-limon-y-romero', 'Pechuga de pollo al horno con batatas (limón y romero)', 40, 1, '{almuerzo,cena}', true, 'Mezclás el jugo de limón con el aceite de oliva, el ajo picado, romero, sal y pimienta. Marinás la pieza 30 minutos (o toda la noche, en la heladera).
Cortás las batatas en bastones o gajos, sin pelar, las mezclás con el aceite y sal y las ponés en la placa alrededor.
Horno a 200 °C, 22–25 minutos, hasta que no quede nada rosado por dentro (74 °C). La dejás reposar 5 minutos antes de cortar.
Servís la porción con batatas y los jugos de la placa por encima.'),
  ('bondiola-al-horno-con-verduras-asadas-tomate-y-oregano', 'Bondiola al horno con verduras asadas (tomate y orégano)', 110, 1, '{almuerzo,cena}', true, 'Mezclás el tomate triturado con el ajo picado, orégano, el aceite, sal y pimienta y lo ponés por encima de la pieza.
Cortás las verduras en trozos grandes, las mezclás con el aceite, sal y orégano y las ponés en una placa aparte, que van al horno los últimos 40 minutos.
Horno a 160 °C, 1 hora 30 minutos, tapada con papel aluminio y destapada los últimos 20 minutos, hasta que esté tierna.
Servís la porción con verduras asadas y los jugos de la placa por encima.'),
  ('conejo-al-horno-con-esparragos-yogur-y-especias', 'Conejo al horno con espárragos (yogur y especias)', 80, 1, '{almuerzo,cena}', true, 'Mezclás el yogur con el ajo, el jugo de limón, comino, pimentón y sal; cubrís la pieza y marinás 1 hora en la heladera.
Cortás la base dura de los espárragos, los mezclás con el aceite y sal y los asás en la placa los últimos 10 minutos; terminás con limón.
Horno a 180 °C, 50–60 minutos, dándolo vuelta una vez, hasta que esté tierno y dorado.
Servís la porción con espárragos y los jugos de la placa por encima.'),
  ('salmon-al-horno-con-batatas-pimenton-ahumado', 'Salmón al horno con batatas (pimentón ahumado)', 35, 1, '{almuerzo,cena}', true, 'Frotás la pieza con el aceite, el ajo picado, pimentón ahumado, comino, sal y pimienta.
Cortás las batatas en bastones o gajos, sin pelar, las mezclás con el aceite y sal y las ponés en la placa, que entra 15 minutos antes que el pescado.
Horno a 200 °C, 12–14 minutos, hasta que esté apenas rosado en el centro.
Servís la porción de pescado con batatas y los jugos de la placa por encima.'),
  ('pejerrey-al-horno-con-berenjenas-y-tomate-limon-y-romero', 'Pejerrey al horno con berenjenas y tomate (limón y romero)', 32, 1, '{almuerzo,cena}', true, 'Mezclás el jugo de limón con el aceite de oliva, el ajo picado, romero, sal y pimienta. Marinás la pieza 30 minutos (o toda la noche, en la heladera).
Cortás la berenjena en rodajas gruesas y el tomate en gajos; los pincelás con el aceite, salás y los asás en la placa, que entra 15 minutos antes que el pescado.
Horno a 200 °C, 10–12 minutos, hasta que estén dorados y se separen de la espina.
Servís la porción de pescado con berenjenas y tomate y los jugos de la placa por encima.'),
  ('vacio-al-horno-con-brocoli-y-ajo-tomate-y-oregano', 'Vacío al horno con brócoli y ajo (tomate y orégano)', 120, 1, '{almuerzo,cena}', true, 'Mezclás el tomate triturado con el ajo picado, orégano, el aceite, sal y pimienta y lo ponés por encima de la pieza.
Cortás el brócoli en arbolitos, lo mezclás con el aceite, el ajo laminado y sal, y lo asás en una placa aparte los últimos 15 minutos.
Horno a 170 °C, 1 hora 30 minutos, tapado con papel aluminio, y 15 minutos más sin tapar para dorar. Reposo de 10 minutos.
Servís la porción con brócoli y ajo y los jugos de la placa por encima.'),
  ('cuadril-al-horno-con-esparragos-mostaza-y-miel', 'Cuadril al horno con espárragos (mostaza y miel)', 60, 1, '{almuerzo,cena}', true, 'Mezclás la mostaza con la miel, el aceite, sal y pimienta y la pincelás sobre la pieza.
Cortás la base dura de los espárragos, los mezclás con el aceite y sal y los asás en la placa los últimos 10 minutos; terminás con limón.
Sellás por todos lados y horneás a 190 °C, 30–35 minutos para que quede jugoso. Reposo de 10 minutos antes de cortar.
Servís la porción con espárragos y los jugos de la placa por encima.'),
  ('matambre-de-cerdo-al-horno-con-calabaza-ajo-y-perejil', 'Matambre de cerdo al horno con calabaza (ajo y perejil)', 85, 1, '{almuerzo,cena}', true, 'Picás el ajo con el perejil, los mezclás con el aceite de oliva, sal y pimienta y los frotás sobre la pieza.
Cortás la calabaza en cubos grandes, con cáscara, las mezclás con el aceite, sal y romero y las ponés en una placa aparte, que van al horno los últimos 40 minutos.
Horno a 180 °C, 1 hora, hasta que esté tierno y dorado. Reposo de 10 minutos antes de cortar.
Servís la porción con calabaza y los jugos de la placa por encima.'),
  ('peceto-al-horno-con-papas-y-cebolla-queso-gratinado', 'Peceto al horno con papas y cebolla (queso gratinado)', 70, 1, '{almuerzo,cena}', true, 'Condimentás la pieza con sal, pimienta y orégano; los últimos 5 minutos la cubrís con el queso y gratinás.
Cortás las papas en gajos y la cebolla en plumas; las mezclás con el aceite, sal y pimentón y las ponés en la placa alrededor.
Sellás por todos lados en una sartén caliente y horneás a 180 °C, 40–45 minutos (hasta 65 °C por dentro). Reposo de 10 minutos antes de cortar en láminas finas.
Servís la porción con papas y cebolla y los jugos de la placa por encima.'),
  ('peceto-al-horno-con-ensalada-de-rucula-y-tomates-cherry', 'Peceto al horno con ensalada de rúcula y tomates cherry (queso gratinado)', 70, 1, '{almuerzo,cena}', true, 'Condimentás la pieza con sal, pimienta y orégano; los últimos 5 minutos la cubrís con el queso y gratinás.
Mezclás la rúcula con los cherry cortados al medio, lascas de parmesano, el aceite de oliva y sal.
Sellás por todos lados en una sartén caliente y horneás a 180 °C, 40–45 minutos (hasta 65 °C por dentro). Reposo de 10 minutos antes de cortar en láminas finas.
Servís la porción con ensalada de rúcula y tomates cherry y los jugos de la placa por encima.'),
  ('abadejo-al-horno-con-coliflor-gratinada-ajo-y-perejil', 'Abadejo al horno con coliflor gratinada (ajo y perejil)', 35, 1, '{almuerzo,cena}', true, 'Picás el ajo con el perejil, los mezclás con el aceite de oliva, sal y pimienta y los frotás sobre la pieza.
Cortás la coliflor en arbolitos, la mezclás con el aceite y sal, y la asás en una placa aparte 20 minutos; los últimos 5 le sumás el queso rallado.
Horno a 200 °C, 12–15 minutos, hasta que se desarme en lascas.
Servís la porción de pescado con coliflor gratinada y los jugos de la placa por encima.'),
  ('matambre-de-cerdo-al-horno-con-pure-de-papa-pimenton', 'Matambre de cerdo al horno con puré de papa (pimentón ahumado)', 85, 1, '{almuerzo,cena}', true, 'Frotás la pieza con el aceite, el ajo picado, pimentón ahumado, comino, sal y pimienta.
Hervís las papas peladas 20 minutos, las hacés puré con la leche, la manteca, sal y nuez moscada.
Horno a 180 °C, 1 hora, hasta que esté tierno y dorado. Reposo de 10 minutos antes de cortar.
Servís la porción con puré de papa y los jugos de la placa por encima.'),
  ('vacio-al-horno-con-ensalada-de-repollo-y-zanahoria', 'Vacío al horno con ensalada de repollo y zanahoria (queso gratinado)', 120, 1, '{almuerzo,cena}', true, 'Condimentás la pieza con sal, pimienta y orégano; los últimos 5 minutos la cubrís con el queso y gratinás.
Cortás el repollo muy fino, rallás la zanahoria y aderezás con el aceite de oliva, el limón y sal.
Horno a 170 °C, 1 hora 30 minutos, tapado con papel aluminio, y 15 minutos más sin tapar para dorar. Reposo de 10 minutos.
Servís la porción con ensalada de repollo y zanahoria y los jugos de la placa por encima.'),
  ('lenguado-al-horno-con-verduras-asadas-tomate-y-oregano', 'Lenguado al horno con verduras asadas (tomate y orégano)', 32, 1, '{almuerzo,cena}', true, 'Mezclás el tomate triturado con el ajo picado, orégano, el aceite, sal y pimienta y lo ponés por encima de la pieza.
Cortás las verduras en trozos grandes, las mezclás con el aceite, sal y orégano y las ponés en la placa, que entra 15 minutos antes que el pescado.
Horno a 200 °C, 10–12 minutos, hasta que se desarme en lascas.
Servís la porción de pescado con verduras asadas y los jugos de la placa por encima.'),
  ('matambre-de-cerdo-al-horno-con-verduras-asadas-queso', 'Matambre de cerdo al horno con verduras asadas (queso gratinado)', 85, 1, '{almuerzo,cena}', true, 'Condimentás la pieza con sal, pimienta y orégano; los últimos 5 minutos la cubrís con el queso y gratinás.
Cortás las verduras en trozos grandes, las mezclás con el aceite, sal y orégano y las ponés en una placa aparte, que van al horno los últimos 40 minutos.
Horno a 180 °C, 1 hora, hasta que esté tierno y dorado. Reposo de 10 minutos antes de cortar.
Servís la porción con verduras asadas y los jugos de la placa por encima.'),
  ('matambre-de-cerdo-al-horno-con-batatas-pimenton-ahumado', 'Matambre de cerdo al horno con batatas (pimentón ahumado)', 85, 1, '{almuerzo,cena}', true, 'Frotás la pieza con el aceite, el ajo picado, pimentón ahumado, comino, sal y pimienta.
Cortás las batatas en bastones o gajos, sin pelar, las mezclás con el aceite y sal y las ponés en una placa aparte, que van al horno los últimos 40 minutos.
Horno a 180 °C, 1 hora, hasta que esté tierno y dorado. Reposo de 10 minutos antes de cortar.
Servís la porción con batatas y los jugos de la placa por encima.'),
  ('pierna-de-cordero-al-horno-con-batatas-soja-y-jengibre', 'Pierna de cordero al horno con batatas (soja y jengibre)', 100, 1, '{almuerzo,cena}', true, 'Mezclás la soja con el jengibre rallado y la miel, y marinás la pieza 30 minutos.
Cortás las batatas en bastones o gajos, sin pelar, las mezclás con el aceite y sal y las ponés en una placa aparte, que van al horno los últimos 40 minutos.
Horno a 170 °C, 1 hora 15 minutos, tapada la primera hora. Reposo de 10 minutos antes de cortar.
Servís la porción con batatas y los jugos de la placa por encima.'),
  ('pejerrey-al-horno-con-batatas-limon-y-romero', 'Pejerrey al horno con batatas (limón y romero)', 32, 1, '{almuerzo,cena}', true, 'Mezclás el jugo de limón con el aceite de oliva, el ajo picado, romero, sal y pimienta. Marinás la pieza 30 minutos (o toda la noche, en la heladera).
Cortás las batatas en bastones o gajos, sin pelar, las mezclás con el aceite y sal y las ponés en la placa, que entra 15 minutos antes que el pescado.
Horno a 200 °C, 10–12 minutos, hasta que estén dorados y se separen de la espina.
Servís la porción de pescado con batatas y los jugos de la placa por encima.'),
  ('merluza-al-horno-con-papines-y-ajo-queso-gratinado', 'Merluza al horno con papines y ajo (queso gratinado)', 35, 1, '{almuerzo,cena}', true, 'Condimentás la pieza con sal, pimienta y orégano; los últimos 5 minutos la cubrís con el queso y gratinás.
Cortás los papines al medio, los mezclás con el aceite, el ajo con piel, sal y romero y los ponés en la placa, que entra 15 minutos antes que el pescado.
Horno a 200 °C, 12–15 minutos, hasta que la carne se desarme en lascas.
Servís la porción de pescado con papines y ajo y los jugos de la placa por encima.'),
  ('carre-de-cerdo-al-horno-con-arroz-blanco-limon-y-romero', 'Carré de cerdo al horno con arroz blanco (limón y romero)', 55, 1, '{almuerzo,cena}', true, 'Mezclás el jugo de limón con el aceite de oliva, el ajo picado, romero, sal y pimienta. Marinás la pieza 30 minutos (o toda la noche, en la heladera).
Hervís el arroz en abundante agua con sal 12 minutos y lo escurrís.
Horno a 180 °C, 35–40 minutos, hasta que esté dorado por fuera y apenas rosado por dentro. Reposo de 5 minutos.
Servís la porción con arroz blanco y los jugos de la placa por encima.'),
  ('merluza-al-horno-con-brocoli-y-ajo-pimenton-ahumado', 'Merluza al horno con brócoli y ajo (pimentón ahumado)', 35, 1, '{almuerzo,cena}', true, 'Frotás la pieza con el aceite, el ajo picado, pimentón ahumado, comino, sal y pimienta.
Cortás el brócoli en arbolitos, lo mezclás con el aceite, el ajo laminado y sal, y lo asás en una placa aparte los últimos 15 minutos.
Horno a 200 °C, 12–15 minutos, hasta que la carne se desarme en lascas.
Servís la porción de pescado con brócoli y ajo y los jugos de la placa por encima.'),
  ('vacio-al-horno-con-berenjenas-y-tomate-ajo-y-perejil', 'Vacío al horno con berenjenas y tomate (ajo y perejil)', 120, 1, '{almuerzo,cena}', true, 'Picás el ajo con el perejil, los mezclás con el aceite de oliva, sal y pimienta y los frotás sobre la pieza.
Cortás la berenjena en rodajas gruesas y el tomate en gajos; los pincelás con el aceite, salás y los asás en una placa aparte, que van al horno los últimos 40 minutos.
Horno a 170 °C, 1 hora 30 minutos, tapado con papel aluminio, y 15 minutos más sin tapar para dorar. Reposo de 10 minutos.
Servís la porción con berenjenas y tomate y los jugos de la placa por encima.'),
  ('pejerrey-al-horno-con-papines-y-ajo-queso-gratinado', 'Pejerrey al horno con papines y ajo (queso gratinado)', 32, 1, '{almuerzo,cena}', true, 'Condimentás la pieza con sal, pimienta y orégano; los últimos 5 minutos la cubrís con el queso y gratinás.
Cortás los papines al medio, los mezclás con el aceite, el ajo con piel, sal y romero y los ponés en la placa, que entra 15 minutos antes que el pescado.
Horno a 200 °C, 10–12 minutos, hasta que estén dorados y se separen de la espina.
Servís la porción de pescado con papines y ajo y los jugos de la placa por encima.'),
  ('salmon-al-horno-con-papas-y-cebolla-soja-y-jengibre', 'Salmón al horno con papas y cebolla (soja y jengibre)', 35, 1, '{almuerzo,cena}', true, 'Mezclás la soja con el jengibre rallado y la miel, y marinás la pieza 30 minutos.
Cortás las papas en gajos y la cebolla en plumas; las mezclás con el aceite, sal y pimentón y las ponés en la placa, que entra 15 minutos antes que el pescado.
Horno a 200 °C, 12–14 minutos, hasta que esté apenas rosado en el centro.
Servís la porción de pescado con papas y cebolla y los jugos de la placa por encima.'),
  ('merluza-al-horno-con-ensalada-mixta-ajo-y-perejil', 'Merluza al horno con ensalada mixta (ajo y perejil)', 35, 1, '{almuerzo,cena}', true, 'Picás el ajo con el perejil, los mezclás con el aceite de oliva, sal y pimienta y los frotás sobre la pieza.
Lavás la lechuga, cortás el tomate en gajos y la cebolla en plumas finas; aderezás al servir con el aceite de oliva, el limón y sal.
Horno a 200 °C, 12–15 minutos, hasta que la carne se desarme en lascas.
Servís la porción de pescado con ensalada mixta y los jugos de la placa por encima.'),
  ('pata-muslo-al-horno-con-ensalada-mixta-yogur-y-especias', 'Pata muslo al horno con ensalada mixta (yogur y especias)', 65, 1, '{almuerzo,cena}', true, 'Mezclás el yogur con el ajo, el jugo de limón, comino, pimentón y sal; cubrís la pieza y marinás 1 hora en la heladera.
Lavás la lechuga, cortás el tomate en gajos y la cebolla en plumas finas; aderezás al servir con el aceite de oliva, el limón y sal.
Horno a 200 °C, 45–50 minutos, dando vuelta las piezas a la mitad, hasta que la piel esté dorada y los jugos salgan claros.
Servís la porción con ensalada mixta y los jugos de la placa por encima.'),
  ('bondiola-al-horno-con-ensalada-mixta-limon-y-romero', 'Bondiola al horno con ensalada mixta (limón y romero)', 110, 1, '{almuerzo,cena}', true, 'Mezclás el jugo de limón con el aceite de oliva, el ajo picado, romero, sal y pimienta. Marinás la pieza 30 minutos (o toda la noche, en la heladera).
Lavás la lechuga, cortás el tomate en gajos y la cebolla en plumas finas; aderezás al servir con el aceite de oliva, el limón y sal.
Horno a 160 °C, 1 hora 30 minutos, tapada con papel aluminio y destapada los últimos 20 minutos, hasta que esté tierna.
Servís la porción con ensalada mixta y los jugos de la placa por encima.'),
  ('matambre-de-cerdo-al-horno-con-brocoli-y-ajo-pimenton', 'Matambre de cerdo al horno con brócoli y ajo (pimentón ahumado)', 85, 1, '{almuerzo,cena}', true, 'Frotás la pieza con el aceite, el ajo picado, pimentón ahumado, comino, sal y pimienta.
Cortás el brócoli en arbolitos, lo mezclás con el aceite, el ajo laminado y sal, y lo asás en una placa aparte los últimos 15 minutos.
Horno a 180 °C, 1 hora, hasta que esté tierno y dorado. Reposo de 10 minutos antes de cortar.
Servís la porción con brócoli y ajo y los jugos de la placa por encima.'),
  ('lenguado-al-horno-con-ensalada-de-rucula-y-tomates', 'Lenguado al horno con ensalada de rúcula y tomates cherry (mostaza y miel)', 32, 1, '{almuerzo,cena}', true, 'Mezclás la mostaza con la miel, el aceite, sal y pimienta y la pincelás sobre la pieza.
Mezclás la rúcula con los cherry cortados al medio, lascas de parmesano, el aceite de oliva y sal.
Horno a 200 °C, 10–12 minutos, hasta que se desarme en lascas.
Servís la porción de pescado con ensalada de rúcula y tomates cherry y los jugos de la placa por encima.'),
  ('pata-muslo-al-horno-con-brocoli-y-ajo-ajo-y-perejil', 'Pata muslo al horno con brócoli y ajo (ajo y perejil)', 65, 1, '{almuerzo,cena}', true, 'Picás el ajo con el perejil, los mezclás con el aceite de oliva, sal y pimienta y los frotás sobre la pieza.
Cortás el brócoli en arbolitos, lo mezclás con el aceite, el ajo laminado y sal, y lo asás en una placa aparte los últimos 15 minutos.
Horno a 200 °C, 45–50 minutos, dando vuelta las piezas a la mitad, hasta que la piel esté dorada y los jugos salgan claros.
Servís la porción con brócoli y ajo y los jugos de la placa por encima.'),
  ('pata-muslo-al-horno-con-esparragos-pimenton-ahumado', 'Pata muslo al horno con espárragos (pimentón ahumado)', 65, 1, '{almuerzo,cena}', true, 'Frotás la pieza con el aceite, el ajo picado, pimentón ahumado, comino, sal y pimienta.
Cortás la base dura de los espárragos, los mezclás con el aceite y sal y los asás en la placa los últimos 10 minutos; terminás con limón.
Horno a 200 °C, 45–50 minutos, dando vuelta las piezas a la mitad, hasta que la piel esté dorada y los jugos salgan claros.
Servís la porción con espárragos y los jugos de la placa por encima.'),
  ('matambre-de-cerdo-al-horno-con-pure-de-papa-mostaza-y', 'Matambre de cerdo al horno con puré de papa (mostaza y miel)', 85, 1, '{almuerzo,cena}', true, 'Mezclás la mostaza con la miel, el aceite, sal y pimienta y la pincelás sobre la pieza.
Hervís las papas peladas 20 minutos, las hacés puré con la leche, la manteca, sal y nuez moscada.
Horno a 180 °C, 1 hora, hasta que esté tierno y dorado. Reposo de 10 minutos antes de cortar.
Servís la porción con puré de papa y los jugos de la placa por encima.'),
  ('pechuga-de-pavo-al-horno-con-verduras-asadas-limon-y', 'Pechuga de pavo al horno con verduras asadas (limón y romero)', 45, 1, '{almuerzo,cena}', true, 'Mezclás el jugo de limón con el aceite de oliva, el ajo picado, romero, sal y pimienta. Marinás la pieza 30 minutos (o toda la noche, en la heladera).
Cortás las verduras en trozos grandes, las mezclás con el aceite, sal y orégano y las ponés en la placa alrededor.
Horno a 190 °C, 25–30 minutos, tapada con papel aluminio los primeros 15. La dejás reposar 5 minutos antes de cortar.
Servís la porción con verduras asadas y los jugos de la placa por encima.'),
  ('solomillo-de-cerdo-al-horno-con-verduras-asadas', 'Solomillo de cerdo al horno con verduras asadas (pimentón ahumado)', 40, 1, '{almuerzo,cena}', true, 'Frotás la pieza con el aceite, el ajo picado, pimentón ahumado, comino, sal y pimienta.
Cortás las verduras en trozos grandes, las mezclás con el aceite, sal y orégano y las ponés en la placa alrededor.
Sellás 2 minutos por lado y lo llevás a horno a 200 °C, 15–18 minutos. Reposo de 5 minutos antes de cortar en medallones.
Servís la porción con verduras asadas y los jugos de la placa por encima.'),
  ('hamburguesa-de-pollo-con-ensalada-de-lechuga-y-tomate', 'Hamburguesa de pollo con ensalada de lechuga y tomate', 28, 1, '{almuerzo,cena}', true, 'Mezclás el pollo picado con la cebolla rallada, el ajo, el perejil, sal y pimienta; formás una hamburguesa de 2 cm.
Cocinás en una plancha o sartén antiadherente con una gota de aceite, 4–5 minutos por lado a fuego medio (o 20 minutos en horno a 200 °C, dándola vuelta a la mitad).
Servís con la ensalada de lechuga y tomate aderezada con el aceite de oliva y sal.'),
  ('hamburguesa-de-pavo-en-pan-con-tomate-y-lechuga', 'Hamburguesa de pavo en pan con tomate y lechuga', 28, 1, '{almuerzo,cena}', true, 'Mezclás el pavo picado con la cebolla rallada, el perejil, sal y pimienta; formás una hamburguesa de 2 cm.
Cocinás en una plancha o sartén antiadherente con una gota de aceite, 4–5 minutos por lado a fuego medio (o 20 minutos en horno a 200 °C, dándola vuelta a la mitad).
Tostás el pan, armás con la hamburguesa, rodajas de tomate, lechuga y mostaza.'),
  ('hamburguesa-de-garbanzos-con-papas-al-horno', 'Hamburguesa de garbanzos con papas al horno', 43, 1, '{almuerzo,cena}', true, 'Procesás los garbanzos con la cebolla, el ajo, el perejil, la avena, comino y sal hasta que quede una pasta gruesa; formás la hamburguesa y la dejás descansar 15 minutos en la heladera.
Cocinás en una plancha o sartén antiadherente con una gota de aceite, 4–5 minutos por lado a fuego medio (o 20 minutos en horno a 200 °C, dándola vuelta a la mitad).
Servís con papas al horno: en gajos con el aceite y sal, 35 minutos a 220 °C.'),
  ('hamburguesa-de-cerdo-con-ensalada-de-repollo', 'Hamburguesa de cerdo con ensalada de repollo', 28, 1, '{almuerzo,cena}', true, 'Mezclás la carne picada de cerdo con la cebolla rallada, la mostaza, sal y pimienta; formás una hamburguesa de 2 cm.
Cocinás en una plancha o sartén antiadherente con una gota de aceite, 4–5 minutos por lado a fuego medio (o 20 minutos en horno a 200 °C, dándola vuelta a la mitad).
Servís con ensalada de repollo y zanahoria rallados, con aceite de oliva y limón.'),
  ('hamburguesa-de-merluza-con-papas-al-horno', 'Hamburguesa de merluza con papas al horno', 38, 1, '{almuerzo,cena}', true, 'Procesás la merluza cruda en trozos, la mezclás con la papa hervida pisada, el perejil, el huevo, el pan rallado, sal y limón; formás la hamburguesa.
Cocinás en una plancha o sartén antiadherente con una gota de aceite, 4–5 minutos por lado a fuego medio (o 20 minutos en horno a 200 °C, dándola vuelta a la mitad).
Servís con papas al horno: en gajos con el aceite y sal, 35 minutos a 220 °C.'),
  ('hamburguesa-de-merluza-en-pan-con-tomate-y-lechuga', 'Hamburguesa de merluza en pan con tomate y lechuga', 38, 1, '{almuerzo,cena}', true, 'Procesás la merluza cruda en trozos, la mezclás con la papa hervida pisada, el perejil, el huevo, el pan rallado, sal y limón; formás la hamburguesa.
Cocinás en una plancha o sartén antiadherente con una gota de aceite, 4–5 minutos por lado a fuego medio (o 20 minutos en horno a 200 °C, dándola vuelta a la mitad).
Tostás el pan, armás con la hamburguesa, rodajas de tomate, lechuga y mostaza.'),
  ('hamburguesa-de-garbanzos-con-batatas-al-horno', 'Hamburguesa de garbanzos con batatas al horno', 43, 1, '{almuerzo,cena}', true, 'Procesás los garbanzos con la cebolla, el ajo, el perejil, la avena, comino y sal hasta que quede una pasta gruesa; formás la hamburguesa y la dejás descansar 15 minutos en la heladera.
Cocinás en una plancha o sartén antiadherente con una gota de aceite, 4–5 minutos por lado a fuego medio (o 20 minutos en horno a 200 °C, dándola vuelta a la mitad).
Servís con batatas en gajos, con el aceite y sal, horneadas 35 minutos a 220 °C.'),
  ('hamburguesa-de-cerdo-con-papas-al-horno', 'Hamburguesa de cerdo con papas al horno', 28, 1, '{almuerzo,cena}', true, 'Mezclás la carne picada de cerdo con la cebolla rallada, la mostaza, sal y pimienta; formás una hamburguesa de 2 cm.
Cocinás en una plancha o sartén antiadherente con una gota de aceite, 4–5 minutos por lado a fuego medio (o 20 minutos en horno a 200 °C, dándola vuelta a la mitad).
Servís con papas al horno: en gajos con el aceite y sal, 35 minutos a 220 °C.'),
  ('hamburguesa-de-cerdo-con-pure-de-papa', 'Hamburguesa de cerdo con puré de papa', 28, 1, '{almuerzo,cena}', true, 'Mezclás la carne picada de cerdo con la cebolla rallada, la mostaza, sal y pimienta; formás una hamburguesa de 2 cm.
Cocinás en una plancha o sartén antiadherente con una gota de aceite, 4–5 minutos por lado a fuego medio (o 20 minutos en horno a 200 °C, dándola vuelta a la mitad).
Servís con el puré de papa: papas hervidas y pisadas con la leche, la manteca y nuez moscada.'),
  ('hamburguesa-de-carne-con-arroz-y-zanahoria', 'Hamburguesa de carne con arroz y zanahoria', 28, 1, '{almuerzo,cena}', true, 'Mezclás la carne con la cebolla rallada, el perejil, sal y pimienta; formás una hamburguesa de 2 cm de alto.
Cocinás en una plancha o sartén antiadherente con una gota de aceite, 4–5 minutos por lado a fuego medio (o 20 minutos en horno a 200 °C, dándola vuelta a la mitad).
Servís con arroz hervido y zanahoria rallada cruda.'),
  ('hamburguesa-de-espinaca-y-ricota-con-pure-de-papa', 'Hamburguesa de espinaca y ricota con puré de papa', 38, 1, '{almuerzo,cena}', true, 'Salteás la espinaca picada hasta que se achique y la mezclás con la ricota, la avena, el huevo, el queso rallado, sal y nuez moscada; formás la hamburguesa.
Cocinás en una plancha o sartén antiadherente con una gota de aceite, 4–5 minutos por lado a fuego medio (o 20 minutos en horno a 200 °C, dándola vuelta a la mitad).
Servís con el puré de papa: papas hervidas y pisadas con la leche, la manteca y nuez moscada.'),
  ('hamburguesa-de-atun-con-vegetales-grillados', 'Hamburguesa de atún con vegetales grillados', 33, 1, '{almuerzo,cena}', true, 'Desmenuzás el atún escurrido y lo mezclás con la papa hervida pisada, el huevo, el perejil, el pan rallado, sal y pimienta; formás la hamburguesa.
Cocinás en una plancha o sartén antiadherente con una gota de aceite, 4–5 minutos por lado a fuego medio (o 20 minutos en horno a 200 °C, dándola vuelta a la mitad).
Servís con zapallito, berenjena y morrón en tiras, grillados en la plancha con el aceite y sal.'),
  ('hamburguesa-de-garbanzos-con-ensalada-de-repollo', 'Hamburguesa de garbanzos con ensalada de repollo', 43, 1, '{almuerzo,cena}', true, 'Procesás los garbanzos con la cebolla, el ajo, el perejil, la avena, comino y sal hasta que quede una pasta gruesa; formás la hamburguesa y la dejás descansar 15 minutos en la heladera.
Cocinás en una plancha o sartén antiadherente con una gota de aceite, 4–5 minutos por lado a fuego medio (o 20 minutos en horno a 200 °C, dándola vuelta a la mitad).
Servís con ensalada de repollo y zanahoria rallados, con aceite de oliva y limón.'),
  ('hamburguesa-de-merluza-con-ensalada-de-lechuga-y-tomate', 'Hamburguesa de merluza con ensalada de lechuga y tomate', 38, 1, '{almuerzo,cena}', true, 'Procesás la merluza cruda en trozos, la mezclás con la papa hervida pisada, el perejil, el huevo, el pan rallado, sal y limón; formás la hamburguesa.
Cocinás en una plancha o sartén antiadherente con una gota de aceite, 4–5 minutos por lado a fuego medio (o 20 minutos en horno a 200 °C, dándola vuelta a la mitad).
Servís con la ensalada de lechuga y tomate aderezada con el aceite de oliva y sal.'),
  ('hamburguesa-de-pollo-con-papas-al-horno', 'Hamburguesa de pollo con papas al horno', 28, 1, '{almuerzo,cena}', true, 'Mezclás el pollo picado con la cebolla rallada, el ajo, el perejil, sal y pimienta; formás una hamburguesa de 2 cm.
Cocinás en una plancha o sartén antiadherente con una gota de aceite, 4–5 minutos por lado a fuego medio (o 20 minutos en horno a 200 °C, dándola vuelta a la mitad).
Servís con papas al horno: en gajos con el aceite y sal, 35 minutos a 220 °C.'),
  ('hamburguesa-de-atun-con-papas-al-horno', 'Hamburguesa de atún con papas al horno', 33, 1, '{almuerzo,cena}', true, 'Desmenuzás el atún escurrido y lo mezclás con la papa hervida pisada, el huevo, el perejil, el pan rallado, sal y pimienta; formás la hamburguesa.
Cocinás en una plancha o sartén antiadherente con una gota de aceite, 4–5 minutos por lado a fuego medio (o 20 minutos en horno a 200 °C, dándola vuelta a la mitad).
Servís con papas al horno: en gajos con el aceite y sal, 35 minutos a 220 °C.'),
  ('hamburguesa-de-pavo-con-ensalada-de-lechuga-y-tomate', 'Hamburguesa de pavo con ensalada de lechuga y tomate', 28, 1, '{almuerzo,cena}', true, 'Mezclás el pavo picado con la cebolla rallada, el perejil, sal y pimienta; formás una hamburguesa de 2 cm.
Cocinás en una plancha o sartén antiadherente con una gota de aceite, 4–5 minutos por lado a fuego medio (o 20 minutos en horno a 200 °C, dándola vuelta a la mitad).
Servís con la ensalada de lechuga y tomate aderezada con el aceite de oliva y sal.'),
  ('hamburguesa-de-pavo-con-arroz-y-zanahoria', 'Hamburguesa de pavo con arroz y zanahoria', 28, 1, '{almuerzo,cena}', true, 'Mezclás el pavo picado con la cebolla rallada, el perejil, sal y pimienta; formás una hamburguesa de 2 cm.
Cocinás en una plancha o sartén antiadherente con una gota de aceite, 4–5 minutos por lado a fuego medio (o 20 minutos en horno a 200 °C, dándola vuelta a la mitad).
Servís con arroz hervido y zanahoria rallada cruda.'),
  ('hamburguesa-de-pavo-con-batatas-al-horno', 'Hamburguesa de pavo con batatas al horno', 28, 1, '{almuerzo,cena}', true, 'Mezclás el pavo picado con la cebolla rallada, el perejil, sal y pimienta; formás una hamburguesa de 2 cm.
Cocinás en una plancha o sartén antiadherente con una gota de aceite, 4–5 minutos por lado a fuego medio (o 20 minutos en horno a 200 °C, dándola vuelta a la mitad).
Servís con batatas en gajos, con el aceite y sal, horneadas 35 minutos a 220 °C.'),
  ('hamburguesa-de-espinaca-y-ricota-con-arroz-y-zanahoria', 'Hamburguesa de espinaca y ricota con arroz y zanahoria', 38, 1, '{almuerzo,cena}', true, 'Salteás la espinaca picada hasta que se achique y la mezclás con la ricota, la avena, el huevo, el queso rallado, sal y nuez moscada; formás la hamburguesa.
Cocinás en una plancha o sartén antiadherente con una gota de aceite, 4–5 minutos por lado a fuego medio (o 20 minutos en horno a 200 °C, dándola vuelta a la mitad).
Servís con arroz hervido y zanahoria rallada cruda.'),
  ('hamburguesa-de-pollo-con-batatas-al-horno', 'Hamburguesa de pollo con batatas al horno', 28, 1, '{almuerzo,cena}', true, 'Mezclás el pollo picado con la cebolla rallada, el ajo, el perejil, sal y pimienta; formás una hamburguesa de 2 cm.
Cocinás en una plancha o sartén antiadherente con una gota de aceite, 4–5 minutos por lado a fuego medio (o 20 minutos en horno a 200 °C, dándola vuelta a la mitad).
Servís con batatas en gajos, con el aceite y sal, horneadas 35 minutos a 220 °C.'),
  ('hamburguesa-de-espinaca-y-ricota-con-papas-al-horno', 'Hamburguesa de espinaca y ricota con papas al horno', 38, 1, '{almuerzo,cena}', true, 'Salteás la espinaca picada hasta que se achique y la mezclás con la ricota, la avena, el huevo, el queso rallado, sal y nuez moscada; formás la hamburguesa.
Cocinás en una plancha o sartén antiadherente con una gota de aceite, 4–5 minutos por lado a fuego medio (o 20 minutos en horno a 200 °C, dándola vuelta a la mitad).
Servís con papas al horno: en gajos con el aceite y sal, 35 minutos a 220 °C.'),
  ('hamburguesa-de-atun-con-pure-de-papa', 'Hamburguesa de atún con puré de papa', 33, 1, '{almuerzo,cena}', true, 'Desmenuzás el atún escurrido y lo mezclás con la papa hervida pisada, el huevo, el perejil, el pan rallado, sal y pimienta; formás la hamburguesa.
Cocinás en una plancha o sartén antiadherente con una gota de aceite, 4–5 minutos por lado a fuego medio (o 20 minutos en horno a 200 °C, dándola vuelta a la mitad).
Servís con el puré de papa: papas hervidas y pisadas con la leche, la manteca y nuez moscada.'),
  ('hamburguesa-de-lentejas-con-papas-al-horno', 'Hamburguesa de lentejas con papas al horno', 43, 1, '{almuerzo,cena}', true, 'Aplastás las lentejas hervidas con un tenedor, las mezclás con la zanahoria rallada, la cebolla picada, la avena, el huevo, comino y sal; formás la hamburguesa y la dejás descansar 15 minutos en la heladera.
Cocinás en una plancha o sartén antiadherente con una gota de aceite, 4–5 minutos por lado a fuego medio (o 20 minutos en horno a 200 °C, dándola vuelta a la mitad).
Servís con papas al horno: en gajos con el aceite y sal, 35 minutos a 220 °C.'),
  ('hamburguesa-de-lentejas-con-vegetales-grillados', 'Hamburguesa de lentejas con vegetales grillados', 43, 1, '{almuerzo,cena}', true, 'Aplastás las lentejas hervidas con un tenedor, las mezclás con la zanahoria rallada, la cebolla picada, la avena, el huevo, comino y sal; formás la hamburguesa y la dejás descansar 15 minutos en la heladera.
Cocinás en una plancha o sartén antiadherente con una gota de aceite, 4–5 minutos por lado a fuego medio (o 20 minutos en horno a 200 °C, dándola vuelta a la mitad).
Servís con zapallito, berenjena y morrón en tiras, grillados en la plancha con el aceite y sal.'),
  ('hamburguesa-de-espinaca-y-ricota-con-batatas-al-horno', 'Hamburguesa de espinaca y ricota con batatas al horno', 38, 1, '{almuerzo,cena}', true, 'Salteás la espinaca picada hasta que se achique y la mezclás con la ricota, la avena, el huevo, el queso rallado, sal y nuez moscada; formás la hamburguesa.
Cocinás en una plancha o sartén antiadherente con una gota de aceite, 4–5 minutos por lado a fuego medio (o 20 minutos en horno a 200 °C, dándola vuelta a la mitad).
Servís con batatas en gajos, con el aceite y sal, horneadas 35 minutos a 220 °C.'),
  ('hamburguesa-de-carne-con-vegetales-grillados', 'Hamburguesa de carne con vegetales grillados', 28, 1, '{almuerzo,cena}', true, 'Mezclás la carne con la cebolla rallada, el perejil, sal y pimienta; formás una hamburguesa de 2 cm de alto.
Cocinás en una plancha o sartén antiadherente con una gota de aceite, 4–5 minutos por lado a fuego medio (o 20 minutos en horno a 200 °C, dándola vuelta a la mitad).
Servís con zapallito, berenjena y morrón en tiras, grillados en la plancha con el aceite y sal.'),
  ('hamburguesa-de-merluza-con-vegetales-grillados', 'Hamburguesa de merluza con vegetales grillados', 38, 1, '{almuerzo,cena}', true, 'Procesás la merluza cruda en trozos, la mezclás con la papa hervida pisada, el perejil, el huevo, el pan rallado, sal y limón; formás la hamburguesa.
Cocinás en una plancha o sartén antiadherente con una gota de aceite, 4–5 minutos por lado a fuego medio (o 20 minutos en horno a 200 °C, dándola vuelta a la mitad).
Servís con zapallito, berenjena y morrón en tiras, grillados en la plancha con el aceite y sal.'),
  ('hamburguesa-de-pavo-con-pure-de-papa', 'Hamburguesa de pavo con puré de papa', 28, 1, '{almuerzo,cena}', true, 'Mezclás el pavo picado con la cebolla rallada, el perejil, sal y pimienta; formás una hamburguesa de 2 cm.
Cocinás en una plancha o sartén antiadherente con una gota de aceite, 4–5 minutos por lado a fuego medio (o 20 minutos en horno a 200 °C, dándola vuelta a la mitad).
Servís con el puré de papa: papas hervidas y pisadas con la leche, la manteca y nuez moscada.'),
  ('hamburguesa-de-espinaca-y-ricota-con-ensalada-de-repollo', 'Hamburguesa de espinaca y ricota con ensalada de repollo', 38, 1, '{almuerzo,cena}', true, 'Salteás la espinaca picada hasta que se achique y la mezclás con la ricota, la avena, el huevo, el queso rallado, sal y nuez moscada; formás la hamburguesa.
Cocinás en una plancha o sartén antiadherente con una gota de aceite, 4–5 minutos por lado a fuego medio (o 20 minutos en horno a 200 °C, dándola vuelta a la mitad).
Servís con ensalada de repollo y zanahoria rallados, con aceite de oliva y limón.'),
  ('hamburguesa-de-garbanzos-con-ensalada-de-lechuga-y', 'Hamburguesa de garbanzos con ensalada de lechuga y tomate', 43, 1, '{almuerzo,cena}', true, 'Procesás los garbanzos con la cebolla, el ajo, el perejil, la avena, comino y sal hasta que quede una pasta gruesa; formás la hamburguesa y la dejás descansar 15 minutos en la heladera.
Cocinás en una plancha o sartén antiadherente con una gota de aceite, 4–5 minutos por lado a fuego medio (o 20 minutos en horno a 200 °C, dándola vuelta a la mitad).
Servís con la ensalada de lechuga y tomate aderezada con el aceite de oliva y sal.'),
  ('hamburguesa-de-pollo-con-vegetales-grillados', 'Hamburguesa de pollo con vegetales grillados', 28, 1, '{almuerzo,cena}', true, 'Mezclás el pollo picado con la cebolla rallada, el ajo, el perejil, sal y pimienta; formás una hamburguesa de 2 cm.
Cocinás en una plancha o sartén antiadherente con una gota de aceite, 4–5 minutos por lado a fuego medio (o 20 minutos en horno a 200 °C, dándola vuelta a la mitad).
Servís con zapallito, berenjena y morrón en tiras, grillados en la plancha con el aceite y sal.'),
  ('hamburguesa-de-garbanzos-con-arroz-y-zanahoria', 'Hamburguesa de garbanzos con arroz y zanahoria', 43, 1, '{almuerzo,cena}', true, 'Procesás los garbanzos con la cebolla, el ajo, el perejil, la avena, comino y sal hasta que quede una pasta gruesa; formás la hamburguesa y la dejás descansar 15 minutos en la heladera.
Cocinás en una plancha o sartén antiadherente con una gota de aceite, 4–5 minutos por lado a fuego medio (o 20 minutos en horno a 200 °C, dándola vuelta a la mitad).
Servís con arroz hervido y zanahoria rallada cruda.'),
  ('hamburguesa-de-pollo-en-pan-con-tomate-y-lechuga', 'Hamburguesa de pollo en pan con tomate y lechuga', 28, 1, '{almuerzo,cena}', true, 'Mezclás el pollo picado con la cebolla rallada, el ajo, el perejil, sal y pimienta; formás una hamburguesa de 2 cm.
Cocinás en una plancha o sartén antiadherente con una gota de aceite, 4–5 minutos por lado a fuego medio (o 20 minutos en horno a 200 °C, dándola vuelta a la mitad).
Tostás el pan, armás con la hamburguesa, rodajas de tomate, lechuga y mostaza.'),
  ('hamburguesa-de-carne-con-ensalada-de-lechuga-y-tomate', 'Hamburguesa de carne con ensalada de lechuga y tomate', 28, 1, '{almuerzo,cena}', true, 'Mezclás la carne con la cebolla rallada, el perejil, sal y pimienta; formás una hamburguesa de 2 cm de alto.
Cocinás en una plancha o sartén antiadherente con una gota de aceite, 4–5 minutos por lado a fuego medio (o 20 minutos en horno a 200 °C, dándola vuelta a la mitad).
Servís con la ensalada de lechuga y tomate aderezada con el aceite de oliva y sal.'),
  ('hamburguesa-de-garbanzos-con-pure-de-papa', 'Hamburguesa de garbanzos con puré de papa', 43, 1, '{almuerzo,cena}', true, 'Procesás los garbanzos con la cebolla, el ajo, el perejil, la avena, comino y sal hasta que quede una pasta gruesa; formás la hamburguesa y la dejás descansar 15 minutos en la heladera.
Cocinás en una plancha o sartén antiadherente con una gota de aceite, 4–5 minutos por lado a fuego medio (o 20 minutos en horno a 200 °C, dándola vuelta a la mitad).
Servís con el puré de papa: papas hervidas y pisadas con la leche, la manteca y nuez moscada.'),
  ('hamburguesa-de-cerdo-con-vegetales-grillados', 'Hamburguesa de cerdo con vegetales grillados', 28, 1, '{almuerzo,cena}', true, 'Mezclás la carne picada de cerdo con la cebolla rallada, la mostaza, sal y pimienta; formás una hamburguesa de 2 cm.
Cocinás en una plancha o sartén antiadherente con una gota de aceite, 4–5 minutos por lado a fuego medio (o 20 minutos en horno a 200 °C, dándola vuelta a la mitad).
Servís con zapallito, berenjena y morrón en tiras, grillados en la plancha con el aceite y sal.'),
  ('hamburguesa-de-garbanzos-en-pan-con-tomate-y-lechuga', 'Hamburguesa de garbanzos en pan con tomate y lechuga', 43, 1, '{almuerzo,cena}', true, 'Procesás los garbanzos con la cebolla, el ajo, el perejil, la avena, comino y sal hasta que quede una pasta gruesa; formás la hamburguesa y la dejás descansar 15 minutos en la heladera.
Cocinás en una plancha o sartén antiadherente con una gota de aceite, 4–5 minutos por lado a fuego medio (o 20 minutos en horno a 200 °C, dándola vuelta a la mitad).
Tostás el pan, armás con la hamburguesa, rodajas de tomate, lechuga y mostaza.'),
  ('hamburguesa-de-pollo-con-ensalada-de-repollo', 'Hamburguesa de pollo con ensalada de repollo', 28, 1, '{almuerzo,cena}', true, 'Mezclás el pollo picado con la cebolla rallada, el ajo, el perejil, sal y pimienta; formás una hamburguesa de 2 cm.
Cocinás en una plancha o sartén antiadherente con una gota de aceite, 4–5 minutos por lado a fuego medio (o 20 minutos en horno a 200 °C, dándola vuelta a la mitad).
Servís con ensalada de repollo y zanahoria rallados, con aceite de oliva y limón.'),
  ('hamburguesa-de-calabaza-y-queso-con-pure-de-papa', 'Hamburguesa de calabaza y queso con puré de papa', 48, 1, '{almuerzo,cena}', true, 'Hervís la calabaza hasta que esté tierna, la pisás y la mezclás con la avena, el queso en cubitos, la cebolla rallada, sal y nuez moscada; formás la hamburguesa.
Cocinás en una plancha o sartén antiadherente con una gota de aceite, 4–5 minutos por lado a fuego medio (o 20 minutos en horno a 200 °C, dándola vuelta a la mitad).
Servís con el puré de papa: papas hervidas y pisadas con la leche, la manteca y nuez moscada.'),
  ('hamburguesa-de-merluza-con-ensalada-de-repollo', 'Hamburguesa de merluza con ensalada de repollo', 38, 1, '{almuerzo,cena}', true, 'Procesás la merluza cruda en trozos, la mezclás con la papa hervida pisada, el perejil, el huevo, el pan rallado, sal y limón; formás la hamburguesa.
Cocinás en una plancha o sartén antiadherente con una gota de aceite, 4–5 minutos por lado a fuego medio (o 20 minutos en horno a 200 °C, dándola vuelta a la mitad).
Servís con ensalada de repollo y zanahoria rallados, con aceite de oliva y limón.'),
  ('hamburguesa-de-pollo-con-arroz-y-zanahoria', 'Hamburguesa de pollo con arroz y zanahoria', 28, 1, '{almuerzo,cena}', true, 'Mezclás el pollo picado con la cebolla rallada, el ajo, el perejil, sal y pimienta; formás una hamburguesa de 2 cm.
Cocinás en una plancha o sartén antiadherente con una gota de aceite, 4–5 minutos por lado a fuego medio (o 20 minutos en horno a 200 °C, dándola vuelta a la mitad).
Servís con arroz hervido y zanahoria rallada cruda.'),
  ('hamburguesa-de-carne-con-batatas-al-horno', 'Hamburguesa de carne con batatas al horno', 28, 1, '{almuerzo,cena}', true, 'Mezclás la carne con la cebolla rallada, el perejil, sal y pimienta; formás una hamburguesa de 2 cm de alto.
Cocinás en una plancha o sartén antiadherente con una gota de aceite, 4–5 minutos por lado a fuego medio (o 20 minutos en horno a 200 °C, dándola vuelta a la mitad).
Servís con batatas en gajos, con el aceite y sal, horneadas 35 minutos a 220 °C.'),
  ('hamburguesa-de-lentejas-con-ensalada-de-lechuga-y-tomate', 'Hamburguesa de lentejas con ensalada de lechuga y tomate', 43, 1, '{almuerzo,cena}', true, 'Aplastás las lentejas hervidas con un tenedor, las mezclás con la zanahoria rallada, la cebolla picada, la avena, el huevo, comino y sal; formás la hamburguesa y la dejás descansar 15 minutos en la heladera.
Cocinás en una plancha o sartén antiadherente con una gota de aceite, 4–5 minutos por lado a fuego medio (o 20 minutos en horno a 200 °C, dándola vuelta a la mitad).
Servís con la ensalada de lechuga y tomate aderezada con el aceite de oliva y sal.'),
  ('hamburguesa-de-cerdo-con-arroz-y-zanahoria', 'Hamburguesa de cerdo con arroz y zanahoria', 28, 1, '{almuerzo,cena}', true, 'Mezclás la carne picada de cerdo con la cebolla rallada, la mostaza, sal y pimienta; formás una hamburguesa de 2 cm.
Cocinás en una plancha o sartén antiadherente con una gota de aceite, 4–5 minutos por lado a fuego medio (o 20 minutos en horno a 200 °C, dándola vuelta a la mitad).
Servís con arroz hervido y zanahoria rallada cruda.'),
  ('hamburguesa-de-calabaza-y-queso-con-arroz-y-zanahoria', 'Hamburguesa de calabaza y queso con arroz y zanahoria', 48, 1, '{almuerzo,cena}', true, 'Hervís la calabaza hasta que esté tierna, la pisás y la mezclás con la avena, el queso en cubitos, la cebolla rallada, sal y nuez moscada; formás la hamburguesa.
Cocinás en una plancha o sartén antiadherente con una gota de aceite, 4–5 minutos por lado a fuego medio (o 20 minutos en horno a 200 °C, dándola vuelta a la mitad).
Servís con arroz hervido y zanahoria rallada cruda.'),
  ('hamburguesa-de-lentejas-con-batatas-al-horno', 'Hamburguesa de lentejas con batatas al horno', 43, 1, '{almuerzo,cena}', true, 'Aplastás las lentejas hervidas con un tenedor, las mezclás con la zanahoria rallada, la cebolla picada, la avena, el huevo, comino y sal; formás la hamburguesa y la dejás descansar 15 minutos en la heladera.
Cocinás en una plancha o sartén antiadherente con una gota de aceite, 4–5 minutos por lado a fuego medio (o 20 minutos en horno a 200 °C, dándola vuelta a la mitad).
Servís con batatas en gajos, con el aceite y sal, horneadas 35 minutos a 220 °C.'),
  ('hamburguesa-de-atun-con-ensalada-de-lechuga-y-tomate', 'Hamburguesa de atún con ensalada de lechuga y tomate', 33, 1, '{almuerzo,cena}', true, 'Desmenuzás el atún escurrido y lo mezclás con la papa hervida pisada, el huevo, el perejil, el pan rallado, sal y pimienta; formás la hamburguesa.
Cocinás en una plancha o sartén antiadherente con una gota de aceite, 4–5 minutos por lado a fuego medio (o 20 minutos en horno a 200 °C, dándola vuelta a la mitad).
Servís con la ensalada de lechuga y tomate aderezada con el aceite de oliva y sal.'),
  ('hamburguesa-de-atun-con-batatas-al-horno', 'Hamburguesa de atún con batatas al horno', 33, 1, '{almuerzo,cena}', true, 'Desmenuzás el atún escurrido y lo mezclás con la papa hervida pisada, el huevo, el perejil, el pan rallado, sal y pimienta; formás la hamburguesa.
Cocinás en una plancha o sartén antiadherente con una gota de aceite, 4–5 minutos por lado a fuego medio (o 20 minutos en horno a 200 °C, dándola vuelta a la mitad).
Servís con batatas en gajos, con el aceite y sal, horneadas 35 minutos a 220 °C.'),
  ('hamburguesa-de-espinaca-y-ricota-en-pan-con-tomate-y', 'Hamburguesa de espinaca y ricota en pan con tomate y lechuga', 38, 1, '{almuerzo,cena}', true, 'Salteás la espinaca picada hasta que se achique y la mezclás con la ricota, la avena, el huevo, el queso rallado, sal y nuez moscada; formás la hamburguesa.
Cocinás en una plancha o sartén antiadherente con una gota de aceite, 4–5 minutos por lado a fuego medio (o 20 minutos en horno a 200 °C, dándola vuelta a la mitad).
Tostás el pan, armás con la hamburguesa, rodajas de tomate, lechuga y mostaza.'),
  ('hamburguesa-de-merluza-con-batatas-al-horno', 'Hamburguesa de merluza con batatas al horno', 38, 1, '{almuerzo,cena}', true, 'Procesás la merluza cruda en trozos, la mezclás con la papa hervida pisada, el perejil, el huevo, el pan rallado, sal y limón; formás la hamburguesa.
Cocinás en una plancha o sartén antiadherente con una gota de aceite, 4–5 minutos por lado a fuego medio (o 20 minutos en horno a 200 °C, dándola vuelta a la mitad).
Servís con batatas en gajos, con el aceite y sal, horneadas 35 minutos a 220 °C.'),
  ('hamburguesa-de-carne-con-ensalada-de-repollo', 'Hamburguesa de carne con ensalada de repollo', 28, 1, '{almuerzo,cena}', true, 'Mezclás la carne con la cebolla rallada, el perejil, sal y pimienta; formás una hamburguesa de 2 cm de alto.
Cocinás en una plancha o sartén antiadherente con una gota de aceite, 4–5 minutos por lado a fuego medio (o 20 minutos en horno a 200 °C, dándola vuelta a la mitad).
Servís con ensalada de repollo y zanahoria rallados, con aceite de oliva y limón.'),
  ('hamburguesa-de-merluza-con-arroz-y-zanahoria', 'Hamburguesa de merluza con arroz y zanahoria', 38, 1, '{almuerzo,cena}', true, 'Procesás la merluza cruda en trozos, la mezclás con la papa hervida pisada, el perejil, el huevo, el pan rallado, sal y limón; formás la hamburguesa.
Cocinás en una plancha o sartén antiadherente con una gota de aceite, 4–5 minutos por lado a fuego medio (o 20 minutos en horno a 200 °C, dándola vuelta a la mitad).
Servís con arroz hervido y zanahoria rallada cruda.'),
  ('hamburguesa-de-carne-en-pan-con-tomate-y-lechuga', 'Hamburguesa de carne en pan con tomate y lechuga', 28, 1, '{almuerzo,cena}', true, 'Mezclás la carne con la cebolla rallada, el perejil, sal y pimienta; formás una hamburguesa de 2 cm de alto.
Cocinás en una plancha o sartén antiadherente con una gota de aceite, 4–5 minutos por lado a fuego medio (o 20 minutos en horno a 200 °C, dándola vuelta a la mitad).
Tostás el pan, armás con la hamburguesa, rodajas de tomate, lechuga y mostaza.'),
  ('hamburguesa-de-atun-con-arroz-y-zanahoria', 'Hamburguesa de atún con arroz y zanahoria', 33, 1, '{almuerzo,cena}', true, 'Desmenuzás el atún escurrido y lo mezclás con la papa hervida pisada, el huevo, el perejil, el pan rallado, sal y pimienta; formás la hamburguesa.
Cocinás en una plancha o sartén antiadherente con una gota de aceite, 4–5 minutos por lado a fuego medio (o 20 minutos en horno a 200 °C, dándola vuelta a la mitad).
Servís con arroz hervido y zanahoria rallada cruda.'),
  ('hamburguesa-de-espinaca-y-ricota-con-ensalada-de', 'Hamburguesa de espinaca y ricota con ensalada de lechuga y tomate', 38, 1, '{almuerzo,cena}', true, 'Salteás la espinaca picada hasta que se achique y la mezclás con la ricota, la avena, el huevo, el queso rallado, sal y nuez moscada; formás la hamburguesa.
Cocinás en una plancha o sartén antiadherente con una gota de aceite, 4–5 minutos por lado a fuego medio (o 20 minutos en horno a 200 °C, dándola vuelta a la mitad).
Servís con la ensalada de lechuga y tomate aderezada con el aceite de oliva y sal.'),
  ('hamburguesa-de-merluza-con-pure-de-papa', 'Hamburguesa de merluza con puré de papa', 38, 1, '{almuerzo,cena}', true, 'Procesás la merluza cruda en trozos, la mezclás con la papa hervida pisada, el perejil, el huevo, el pan rallado, sal y limón; formás la hamburguesa.
Cocinás en una plancha o sartén antiadherente con una gota de aceite, 4–5 minutos por lado a fuego medio (o 20 minutos en horno a 200 °C, dándola vuelta a la mitad).
Servís con el puré de papa: papas hervidas y pisadas con la leche, la manteca y nuez moscada.'),
  ('hamburguesa-de-cerdo-en-pan-con-tomate-y-lechuga', 'Hamburguesa de cerdo en pan con tomate y lechuga', 28, 1, '{almuerzo,cena}', true, 'Mezclás la carne picada de cerdo con la cebolla rallada, la mostaza, sal y pimienta; formás una hamburguesa de 2 cm.
Cocinás en una plancha o sartén antiadherente con una gota de aceite, 4–5 minutos por lado a fuego medio (o 20 minutos en horno a 200 °C, dándola vuelta a la mitad).
Tostás el pan, armás con la hamburguesa, rodajas de tomate, lechuga y mostaza.'),
  ('hamburguesa-de-carne-con-papas-al-horno', 'Hamburguesa de carne con papas al horno', 28, 1, '{almuerzo,cena}', true, 'Mezclás la carne con la cebolla rallada, el perejil, sal y pimienta; formás una hamburguesa de 2 cm de alto.
Cocinás en una plancha o sartén antiadherente con una gota de aceite, 4–5 minutos por lado a fuego medio (o 20 minutos en horno a 200 °C, dándola vuelta a la mitad).
Servís con papas al horno: en gajos con el aceite y sal, 35 minutos a 220 °C.'),
  ('hamburguesa-de-garbanzos-con-vegetales-grillados', 'Hamburguesa de garbanzos con vegetales grillados', 43, 1, '{almuerzo,cena}', true, 'Procesás los garbanzos con la cebolla, el ajo, el perejil, la avena, comino y sal hasta que quede una pasta gruesa; formás la hamburguesa y la dejás descansar 15 minutos en la heladera.
Cocinás en una plancha o sartén antiadherente con una gota de aceite, 4–5 minutos por lado a fuego medio (o 20 minutos en horno a 200 °C, dándola vuelta a la mitad).
Servís con zapallito, berenjena y morrón en tiras, grillados en la plancha con el aceite y sal.'),
  ('milanesa-de-cerdo-al-horno-con-ensalada-de-repollo-y', 'Milanesa de cerdo al horno con ensalada de repollo y zanahoria', 45, 1, '{almuerzo,cena}', true, 'Cortás el solomillo en medallones y los aplastás finos con un palo de amasar.
Pasás cada pieza por huevo batido con sal, ajo y perejil, y después por pan rallado, presionando para que se adhiera.
Las ponés en una placa aceitada, rociás con un hilo de aceite y horneás a 220 °C, 12 minutos de cada lado, hasta que estén doradas y crocantes.
Servís con ensalada de repollo y zanahoria.'),
  ('milanesa-de-cerdo-al-horno-con-pure-de-papa', 'Milanesa de cerdo al horno con puré de papa', 45, 1, '{almuerzo,cena}', true, 'Cortás el solomillo en medallones y los aplastás finos con un palo de amasar.
Pasás cada pieza por huevo batido con sal, ajo y perejil, y después por pan rallado, presionando para que se adhiera.
Las ponés en una placa aceitada, rociás con un hilo de aceite y horneás a 220 °C, 12 minutos de cada lado, hasta que estén doradas y crocantes.
Servís con puré de papa.'),
  ('milanesa-de-cerdo-al-horno-con-arroz', 'Milanesa de cerdo al horno con arroz', 45, 1, '{almuerzo,cena}', true, 'Cortás el solomillo en medallones y los aplastás finos con un palo de amasar.
Pasás cada pieza por huevo batido con sal, ajo y perejil, y después por pan rallado, presionando para que se adhiera.
Las ponés en una placa aceitada, rociás con un hilo de aceite y horneás a 220 °C, 12 minutos de cada lado, hasta que estén doradas y crocantes.
Servís con arroz blanco.'),
  ('milanesa-de-pavo-al-horno-con-ensalada-de-repollo-y', 'Milanesa de pavo al horno con ensalada de repollo y zanahoria', 45, 1, '{almuerzo,cena}', true, 'Aplastás la pechuga de pavo en filetes finos con un palo de amasar.
Pasás cada pieza por huevo batido con sal, ajo y perejil, y después por pan rallado, presionando para que se adhiera.
Las ponés en una placa aceitada, rociás con un hilo de aceite y horneás a 220 °C, 12 minutos de cada lado, hasta que estén doradas y crocantes.
Servís con ensalada de repollo y zanahoria.'),
  ('milanesa-de-coliflor-al-horno-con-ensalada-mixta', 'Milanesa de coliflor al horno con ensalada mixta', 50, 1, '{almuerzo,cena}', true, 'Cortás la coliflor en rodajas gruesas (1,5 cm) y las hervís 3 minutos; las secás bien.
Pasás cada pieza por huevo batido con sal, ajo y perejil, y después por pan rallado, presionando para que se adhiera.
Las ponés en una placa aceitada, rociás con un hilo de aceite y horneás a 220 °C, 12 minutos de cada lado, hasta que estén doradas y crocantes.
Servís con ensalada de lechuga, tomate y cebolla morada.'),
  ('milanesa-de-pavo-al-horno-con-pure-de-calabaza', 'Milanesa de pavo al horno con puré de calabaza', 45, 1, '{almuerzo,cena}', true, 'Aplastás la pechuga de pavo en filetes finos con un palo de amasar.
Pasás cada pieza por huevo batido con sal, ajo y perejil, y después por pan rallado, presionando para que se adhiera.
Las ponés en una placa aceitada, rociás con un hilo de aceite y horneás a 220 °C, 12 minutos de cada lado, hasta que estén doradas y crocantes.
Servís con puré de calabaza.'),
  ('milanesa-de-calabaza-al-horno-con-papas-al-horno', 'Milanesa de calabaza al horno con papas al horno', 50, 1, '{almuerzo,cena}', true, 'Cortás la calabaza en rodajas de 1 cm y las hervís 5 minutos, que queden firmes; las secás.
Pasás cada pieza por huevo batido con sal, ajo y perejil, y después por pan rallado, presionando para que se adhiera.
Las ponés en una placa aceitada, rociás con un hilo de aceite y horneás a 220 °C, 12 minutos de cada lado, hasta que estén doradas y crocantes.
Servís con papas al horno en gajos.'),
  ('milanesa-de-pavo-al-horno-con-arroz', 'Milanesa de pavo al horno con arroz', 45, 1, '{almuerzo,cena}', true, 'Aplastás la pechuga de pavo en filetes finos con un palo de amasar.
Pasás cada pieza por huevo batido con sal, ajo y perejil, y después por pan rallado, presionando para que se adhiera.
Las ponés en una placa aceitada, rociás con un hilo de aceite y horneás a 220 °C, 12 minutos de cada lado, hasta que estén doradas y crocantes.
Servís con arroz blanco.'),
  ('milanesa-de-berenjena-al-horno-con-batatas-al-horno', 'Milanesa de berenjena al horno con batatas al horno', 50, 1, '{almuerzo,cena}', true, 'Cortás la berenjena en rodajas de 1 cm y las salás 10 minutos para que larguen el agua; las secás con papel.
Pasás cada pieza por huevo batido con sal, ajo y perejil, y después por pan rallado, presionando para que se adhiera.
Las ponés en una placa aceitada, rociás con un hilo de aceite y horneás a 220 °C, 12 minutos de cada lado, hasta que estén doradas y crocantes.
Servís con batatas al horno.'),
  ('milanesa-de-nalga-al-horno-con-ensalada-de-repollo-y', 'Milanesa de nalga al horno con ensalada de repollo y zanahoria', 45, 1, '{almuerzo,cena}', true, 'Pedís la nalga en bifes finos o los aplastás con un palo de amasar.
Pasás cada pieza por huevo batido con sal, ajo y perejil, y después por pan rallado, presionando para que se adhiera.
Las ponés en una placa aceitada, rociás con un hilo de aceite y horneás a 220 °C, 12 minutos de cada lado, hasta que estén doradas y crocantes.
Servís con ensalada de repollo y zanahoria.'),
  ('milanesa-de-pollo-al-horno-con-papas-al-horno', 'Milanesa de pollo al horno con papas al horno', 45, 1, '{almuerzo,cena}', true, 'Aplastás la pechuga en filetes finos con un palo de amasar.
Pasás cada pieza por huevo batido con sal, ajo y perejil, y después por pan rallado, presionando para que se adhiera.
Las ponés en una placa aceitada, rociás con un hilo de aceite y horneás a 220 °C, 12 minutos de cada lado, hasta que estén doradas y crocantes.
Servís con papas al horno en gajos.'),
  ('milanesa-de-cerdo-al-horno-con-ensalada-de-rucula-y', 'Milanesa de cerdo al horno con ensalada de rúcula y tomates cherry', 45, 1, '{almuerzo,cena}', true, 'Cortás el solomillo en medallones y los aplastás finos con un palo de amasar.
Pasás cada pieza por huevo batido con sal, ajo y perejil, y después por pan rallado, presionando para que se adhiera.
Las ponés en una placa aceitada, rociás con un hilo de aceite y horneás a 220 °C, 12 minutos de cada lado, hasta que estén doradas y crocantes.
Servís con ensalada de rúcula, cherry y lascas de parmesano.'),
  ('milanesa-de-pollo-al-horno-con-pure-de-calabaza', 'Milanesa de pollo al horno con puré de calabaza', 45, 1, '{almuerzo,cena}', true, 'Aplastás la pechuga en filetes finos con un palo de amasar.
Pasás cada pieza por huevo batido con sal, ajo y perejil, y después por pan rallado, presionando para que se adhiera.
Las ponés en una placa aceitada, rociás con un hilo de aceite y horneás a 220 °C, 12 minutos de cada lado, hasta que estén doradas y crocantes.
Servís con puré de calabaza.'),
  ('milanesa-de-pavo-al-horno-con-pure-de-papa', 'Milanesa de pavo al horno con puré de papa', 45, 1, '{almuerzo,cena}', true, 'Aplastás la pechuga de pavo en filetes finos con un palo de amasar.
Pasás cada pieza por huevo batido con sal, ajo y perejil, y después por pan rallado, presionando para que se adhiera.
Las ponés en una placa aceitada, rociás con un hilo de aceite y horneás a 220 °C, 12 minutos de cada lado, hasta que estén doradas y crocantes.
Servís con puré de papa.'),
  ('milanesa-de-berenjena-al-horno-con-pure-de-papa', 'Milanesa de berenjena al horno con puré de papa', 50, 1, '{almuerzo,cena}', true, 'Cortás la berenjena en rodajas de 1 cm y las salás 10 minutos para que larguen el agua; las secás con papel.
Pasás cada pieza por huevo batido con sal, ajo y perejil, y después por pan rallado, presionando para que se adhiera.
Las ponés en una placa aceitada, rociás con un hilo de aceite y horneás a 220 °C, 12 minutos de cada lado, hasta que estén doradas y crocantes.
Servís con puré de papa.'),
  ('milanesa-de-pollo-al-horno-con-pure-de-papa', 'Milanesa de pollo al horno con puré de papa', 45, 1, '{almuerzo,cena}', true, 'Aplastás la pechuga en filetes finos con un palo de amasar.
Pasás cada pieza por huevo batido con sal, ajo y perejil, y después por pan rallado, presionando para que se adhiera.
Las ponés en una placa aceitada, rociás con un hilo de aceite y horneás a 220 °C, 12 minutos de cada lado, hasta que estén doradas y crocantes.
Servís con puré de papa.'),
  ('milanesa-de-nalga-al-horno-con-ensalada-de-rucula-y', 'Milanesa de nalga al horno con ensalada de rúcula y tomates cherry', 45, 1, '{almuerzo,cena}', true, 'Pedís la nalga en bifes finos o los aplastás con un palo de amasar.
Pasás cada pieza por huevo batido con sal, ajo y perejil, y después por pan rallado, presionando para que se adhiera.
Las ponés en una placa aceitada, rociás con un hilo de aceite y horneás a 220 °C, 12 minutos de cada lado, hasta que estén doradas y crocantes.
Servís con ensalada de rúcula, cherry y lascas de parmesano.'),
  ('milanesa-de-coliflor-al-horno-con-batatas-al-horno', 'Milanesa de coliflor al horno con batatas al horno', 50, 1, '{almuerzo,cena}', true, 'Cortás la coliflor en rodajas gruesas (1,5 cm) y las hervís 3 minutos; las secás bien.
Pasás cada pieza por huevo batido con sal, ajo y perejil, y después por pan rallado, presionando para que se adhiera.
Las ponés en una placa aceitada, rociás con un hilo de aceite y horneás a 220 °C, 12 minutos de cada lado, hasta que estén doradas y crocantes.
Servís con batatas al horno.'),
  ('milanesa-de-calabaza-al-horno-con-batatas-al-horno', 'Milanesa de calabaza al horno con batatas al horno', 50, 1, '{almuerzo,cena}', true, 'Cortás la calabaza en rodajas de 1 cm y las hervís 5 minutos, que queden firmes; las secás.
Pasás cada pieza por huevo batido con sal, ajo y perejil, y después por pan rallado, presionando para que se adhiera.
Las ponés en una placa aceitada, rociás con un hilo de aceite y horneás a 220 °C, 12 minutos de cada lado, hasta que estén doradas y crocantes.
Servís con batatas al horno.'),
  ('milanesa-de-coliflor-al-horno-con-zapallitos-grillados', 'Milanesa de coliflor al horno con zapallitos grillados', 50, 1, '{almuerzo,cena}', true, 'Cortás la coliflor en rodajas gruesas (1,5 cm) y las hervís 3 minutos; las secás bien.
Pasás cada pieza por huevo batido con sal, ajo y perejil, y después por pan rallado, presionando para que se adhiera.
Las ponés en una placa aceitada, rociás con un hilo de aceite y horneás a 220 °C, 12 minutos de cada lado, hasta que estén doradas y crocantes.
Servís con zapallitos grillados.'),
  ('milanesa-de-pavo-al-horno-con-ensalada-de-rucula-y', 'Milanesa de pavo al horno con ensalada de rúcula y tomates cherry', 45, 1, '{almuerzo,cena}', true, 'Aplastás la pechuga de pavo en filetes finos con un palo de amasar.
Pasás cada pieza por huevo batido con sal, ajo y perejil, y después por pan rallado, presionando para que se adhiera.
Las ponés en una placa aceitada, rociás con un hilo de aceite y horneás a 220 °C, 12 minutos de cada lado, hasta que estén doradas y crocantes.
Servís con ensalada de rúcula, cherry y lascas de parmesano.'),
  ('milanesa-de-merluza-al-horno-con-ensalada-de-rucula-y', 'Milanesa de merluza al horno con ensalada de rúcula y tomates cherry', 40, 1, '{almuerzo,cena}', true, 'Secás bien los filetes de merluza con papel.
Pasás cada pieza por huevo batido con sal, ajo y perejil, y después por pan rallado, presionando para que se adhiera.
Las ponés en una placa aceitada, rociás con un hilo de aceite y horneás a 220 °C, 12 minutos de cada lado, hasta que estén doradas y crocantes.
Servís con ensalada de rúcula, cherry y lascas de parmesano.'),
  ('milanesa-de-coliflor-al-horno-con-pure-de-calabaza', 'Milanesa de coliflor al horno con puré de calabaza', 50, 1, '{almuerzo,cena}', true, 'Cortás la coliflor en rodajas gruesas (1,5 cm) y las hervís 3 minutos; las secás bien.
Pasás cada pieza por huevo batido con sal, ajo y perejil, y después por pan rallado, presionando para que se adhiera.
Las ponés en una placa aceitada, rociás con un hilo de aceite y horneás a 220 °C, 12 minutos de cada lado, hasta que estén doradas y crocantes.
Servís con puré de calabaza.'),
  ('milanesa-de-nalga-al-horno-con-arroz', 'Milanesa de nalga al horno con arroz', 45, 1, '{almuerzo,cena}', true, 'Pedís la nalga en bifes finos o los aplastás con un palo de amasar.
Pasás cada pieza por huevo batido con sal, ajo y perejil, y después por pan rallado, presionando para que se adhiera.
Las ponés en una placa aceitada, rociás con un hilo de aceite y horneás a 220 °C, 12 minutos de cada lado, hasta que estén doradas y crocantes.
Servís con arroz blanco.'),
  ('milanesa-de-coliflor-al-horno-con-ensalada-de-repollo-y', 'Milanesa de coliflor al horno con ensalada de repollo y zanahoria', 50, 1, '{almuerzo,cena}', true, 'Cortás la coliflor en rodajas gruesas (1,5 cm) y las hervís 3 minutos; las secás bien.
Pasás cada pieza por huevo batido con sal, ajo y perejil, y después por pan rallado, presionando para que se adhiera.
Las ponés en una placa aceitada, rociás con un hilo de aceite y horneás a 220 °C, 12 minutos de cada lado, hasta que estén doradas y crocantes.
Servís con ensalada de repollo y zanahoria.'),
  ('milanesa-de-calabaza-al-horno-con-ensalada-mixta', 'Milanesa de calabaza al horno con ensalada mixta', 50, 1, '{almuerzo,cena}', true, 'Cortás la calabaza en rodajas de 1 cm y las hervís 5 minutos, que queden firmes; las secás.
Pasás cada pieza por huevo batido con sal, ajo y perejil, y después por pan rallado, presionando para que se adhiera.
Las ponés en una placa aceitada, rociás con un hilo de aceite y horneás a 220 °C, 12 minutos de cada lado, hasta que estén doradas y crocantes.
Servís con ensalada de lechuga, tomate y cebolla morada.'),
  ('milanesa-de-merluza-al-horno-con-arroz', 'Milanesa de merluza al horno con arroz', 40, 1, '{almuerzo,cena}', true, 'Secás bien los filetes de merluza con papel.
Pasás cada pieza por huevo batido con sal, ajo y perejil, y después por pan rallado, presionando para que se adhiera.
Las ponés en una placa aceitada, rociás con un hilo de aceite y horneás a 220 °C, 12 minutos de cada lado, hasta que estén doradas y crocantes.
Servís con arroz blanco.'),
  ('milanesa-de-nalga-al-horno-con-ensalada-mixta', 'Milanesa de nalga al horno con ensalada mixta', 45, 1, '{almuerzo,cena}', true, 'Pedís la nalga en bifes finos o los aplastás con un palo de amasar.
Pasás cada pieza por huevo batido con sal, ajo y perejil, y después por pan rallado, presionando para que se adhiera.
Las ponés en una placa aceitada, rociás con un hilo de aceite y horneás a 220 °C, 12 minutos de cada lado, hasta que estén doradas y crocantes.
Servís con ensalada de lechuga, tomate y cebolla morada.'),
  ('milanesa-de-pavo-al-horno-con-zapallitos-grillados', 'Milanesa de pavo al horno con zapallitos grillados', 45, 1, '{almuerzo,cena}', true, 'Aplastás la pechuga de pavo en filetes finos con un palo de amasar.
Pasás cada pieza por huevo batido con sal, ajo y perejil, y después por pan rallado, presionando para que se adhiera.
Las ponés en una placa aceitada, rociás con un hilo de aceite y horneás a 220 °C, 12 minutos de cada lado, hasta que estén doradas y crocantes.
Servís con zapallitos grillados.'),
  ('milanesa-de-pollo-al-horno-con-arroz', 'Milanesa de pollo al horno con arroz', 45, 1, '{almuerzo,cena}', true, 'Aplastás la pechuga en filetes finos con un palo de amasar.
Pasás cada pieza por huevo batido con sal, ajo y perejil, y después por pan rallado, presionando para que se adhiera.
Las ponés en una placa aceitada, rociás con un hilo de aceite y horneás a 220 °C, 12 minutos de cada lado, hasta que estén doradas y crocantes.
Servís con arroz blanco.'),
  ('milanesa-de-nalga-al-horno-con-batatas-al-horno', 'Milanesa de nalga al horno con batatas al horno', 45, 1, '{almuerzo,cena}', true, 'Pedís la nalga en bifes finos o los aplastás con un palo de amasar.
Pasás cada pieza por huevo batido con sal, ajo y perejil, y después por pan rallado, presionando para que se adhiera.
Las ponés en una placa aceitada, rociás con un hilo de aceite y horneás a 220 °C, 12 minutos de cada lado, hasta que estén doradas y crocantes.
Servís con batatas al horno.'),
  ('milanesa-de-merluza-al-horno-con-ensalada-mixta', 'Milanesa de merluza al horno con ensalada mixta', 40, 1, '{almuerzo,cena}', true, 'Secás bien los filetes de merluza con papel.
Pasás cada pieza por huevo batido con sal, ajo y perejil, y después por pan rallado, presionando para que se adhiera.
Las ponés en una placa aceitada, rociás con un hilo de aceite y horneás a 220 °C, 12 minutos de cada lado, hasta que estén doradas y crocantes.
Servís con ensalada de lechuga, tomate y cebolla morada.'),
  ('milanesa-de-coliflor-al-horno-con-arroz', 'Milanesa de coliflor al horno con arroz', 50, 1, '{almuerzo,cena}', true, 'Cortás la coliflor en rodajas gruesas (1,5 cm) y las hervís 3 minutos; las secás bien.
Pasás cada pieza por huevo batido con sal, ajo y perejil, y después por pan rallado, presionando para que se adhiera.
Las ponés en una placa aceitada, rociás con un hilo de aceite y horneás a 220 °C, 12 minutos de cada lado, hasta que estén doradas y crocantes.
Servís con arroz blanco.'),
  ('milanesa-de-berenjena-al-horno-con-papas-al-horno', 'Milanesa de berenjena al horno con papas al horno', 50, 1, '{almuerzo,cena}', true, 'Cortás la berenjena en rodajas de 1 cm y las salás 10 minutos para que larguen el agua; las secás con papel.
Pasás cada pieza por huevo batido con sal, ajo y perejil, y después por pan rallado, presionando para que se adhiera.
Las ponés en una placa aceitada, rociás con un hilo de aceite y horneás a 220 °C, 12 minutos de cada lado, hasta que estén doradas y crocantes.
Servís con papas al horno en gajos.'),
  ('milanesa-de-merluza-al-horno-con-ensalada-de-repollo-y', 'Milanesa de merluza al horno con ensalada de repollo y zanahoria', 40, 1, '{almuerzo,cena}', true, 'Secás bien los filetes de merluza con papel.
Pasás cada pieza por huevo batido con sal, ajo y perejil, y después por pan rallado, presionando para que se adhiera.
Las ponés en una placa aceitada, rociás con un hilo de aceite y horneás a 220 °C, 12 minutos de cada lado, hasta que estén doradas y crocantes.
Servís con ensalada de repollo y zanahoria.'),
  ('milanesa-de-merluza-al-horno-con-papas-al-horno', 'Milanesa de merluza al horno con papas al horno', 40, 1, '{almuerzo,cena}', true, 'Secás bien los filetes de merluza con papel.
Pasás cada pieza por huevo batido con sal, ajo y perejil, y después por pan rallado, presionando para que se adhiera.
Las ponés en una placa aceitada, rociás con un hilo de aceite y horneás a 220 °C, 12 minutos de cada lado, hasta que estén doradas y crocantes.
Servís con papas al horno en gajos.'),
  ('milanesa-de-calabaza-al-horno-con-pure-de-papa', 'Milanesa de calabaza al horno con puré de papa', 50, 1, '{almuerzo,cena}', true, 'Cortás la calabaza en rodajas de 1 cm y las hervís 5 minutos, que queden firmes; las secás.
Pasás cada pieza por huevo batido con sal, ajo y perejil, y después por pan rallado, presionando para que se adhiera.
Las ponés en una placa aceitada, rociás con un hilo de aceite y horneás a 220 °C, 12 minutos de cada lado, hasta que estén doradas y crocantes.
Servís con puré de papa.'),
  ('milanesa-de-berenjena-al-horno-con-ensalada-de-repollo', 'Milanesa de berenjena al horno con ensalada de repollo y zanahoria', 50, 1, '{almuerzo,cena}', true, 'Cortás la berenjena en rodajas de 1 cm y las salás 10 minutos para que larguen el agua; las secás con papel.
Pasás cada pieza por huevo batido con sal, ajo y perejil, y después por pan rallado, presionando para que se adhiera.
Las ponés en una placa aceitada, rociás con un hilo de aceite y horneás a 220 °C, 12 minutos de cada lado, hasta que estén doradas y crocantes.
Servís con ensalada de repollo y zanahoria.'),
  ('milanesa-de-pollo-al-horno-con-zapallitos-grillados', 'Milanesa de pollo al horno con zapallitos grillados', 45, 1, '{almuerzo,cena}', true, 'Aplastás la pechuga en filetes finos con un palo de amasar.
Pasás cada pieza por huevo batido con sal, ajo y perejil, y después por pan rallado, presionando para que se adhiera.
Las ponés en una placa aceitada, rociás con un hilo de aceite y horneás a 220 °C, 12 minutos de cada lado, hasta que estén doradas y crocantes.
Servís con zapallitos grillados.'),
  ('milanesa-de-coliflor-al-horno-con-papas-al-horno', 'Milanesa de coliflor al horno con papas al horno', 50, 1, '{almuerzo,cena}', true, 'Cortás la coliflor en rodajas gruesas (1,5 cm) y las hervís 3 minutos; las secás bien.
Pasás cada pieza por huevo batido con sal, ajo y perejil, y después por pan rallado, presionando para que se adhiera.
Las ponés en una placa aceitada, rociás con un hilo de aceite y horneás a 220 °C, 12 minutos de cada lado, hasta que estén doradas y crocantes.
Servís con papas al horno en gajos.'),
  ('milanesa-de-berenjena-al-horno-con-ensalada-mixta', 'Milanesa de berenjena al horno con ensalada mixta', 50, 1, '{almuerzo,cena}', true, 'Cortás la berenjena en rodajas de 1 cm y las salás 10 minutos para que larguen el agua; las secás con papel.
Pasás cada pieza por huevo batido con sal, ajo y perejil, y después por pan rallado, presionando para que se adhiera.
Las ponés en una placa aceitada, rociás con un hilo de aceite y horneás a 220 °C, 12 minutos de cada lado, hasta que estén doradas y crocantes.
Servís con ensalada de lechuga, tomate y cebolla morada.'),
  ('milanesa-de-pollo-al-horno-con-ensalada-de-repollo-y', 'Milanesa de pollo al horno con ensalada de repollo y zanahoria', 45, 1, '{almuerzo,cena}', true, 'Aplastás la pechuga en filetes finos con un palo de amasar.
Pasás cada pieza por huevo batido con sal, ajo y perejil, y después por pan rallado, presionando para que se adhiera.
Las ponés en una placa aceitada, rociás con un hilo de aceite y horneás a 220 °C, 12 minutos de cada lado, hasta que estén doradas y crocantes.
Servís con ensalada de repollo y zanahoria.'),
  ('milanesa-de-pavo-al-horno-con-batatas-al-horno', 'Milanesa de pavo al horno con batatas al horno', 45, 1, '{almuerzo,cena}', true, 'Aplastás la pechuga de pavo en filetes finos con un palo de amasar.
Pasás cada pieza por huevo batido con sal, ajo y perejil, y después por pan rallado, presionando para que se adhiera.
Las ponés en una placa aceitada, rociás con un hilo de aceite y horneás a 220 °C, 12 minutos de cada lado, hasta que estén doradas y crocantes.
Servís con batatas al horno.'),
  ('milanesa-de-calabaza-al-horno-con-ensalada-de-rucula-y', 'Milanesa de calabaza al horno con ensalada de rúcula y tomates cherry', 50, 1, '{almuerzo,cena}', true, 'Cortás la calabaza en rodajas de 1 cm y las hervís 5 minutos, que queden firmes; las secás.
Pasás cada pieza por huevo batido con sal, ajo y perejil, y después por pan rallado, presionando para que se adhiera.
Las ponés en una placa aceitada, rociás con un hilo de aceite y horneás a 220 °C, 12 minutos de cada lado, hasta que estén doradas y crocantes.
Servís con ensalada de rúcula, cherry y lascas de parmesano.'),
  ('milanesa-de-nalga-al-horno-con-papas-al-horno', 'Milanesa de nalga al horno con papas al horno', 45, 1, '{almuerzo,cena}', true, 'Pedís la nalga en bifes finos o los aplastás con un palo de amasar.
Pasás cada pieza por huevo batido con sal, ajo y perejil, y después por pan rallado, presionando para que se adhiera.
Las ponés en una placa aceitada, rociás con un hilo de aceite y horneás a 220 °C, 12 minutos de cada lado, hasta que estén doradas y crocantes.
Servís con papas al horno en gajos.'),
  ('milanesa-de-merluza-al-horno-con-zapallitos-grillados', 'Milanesa de merluza al horno con zapallitos grillados', 40, 1, '{almuerzo,cena}', true, 'Secás bien los filetes de merluza con papel.
Pasás cada pieza por huevo batido con sal, ajo y perejil, y después por pan rallado, presionando para que se adhiera.
Las ponés en una placa aceitada, rociás con un hilo de aceite y horneás a 220 °C, 12 minutos de cada lado, hasta que estén doradas y crocantes.
Servís con zapallitos grillados.'),
  ('milanesa-de-calabaza-al-horno-con-arroz', 'Milanesa de calabaza al horno con arroz', 50, 1, '{almuerzo,cena}', true, 'Cortás la calabaza en rodajas de 1 cm y las hervís 5 minutos, que queden firmes; las secás.
Pasás cada pieza por huevo batido con sal, ajo y perejil, y después por pan rallado, presionando para que se adhiera.
Las ponés en una placa aceitada, rociás con un hilo de aceite y horneás a 220 °C, 12 minutos de cada lado, hasta que estén doradas y crocantes.
Servís con arroz blanco.'),
  ('milanesa-de-cerdo-al-horno-con-papas-al-horno', 'Milanesa de cerdo al horno con papas al horno', 45, 1, '{almuerzo,cena}', true, 'Cortás el solomillo en medallones y los aplastás finos con un palo de amasar.
Pasás cada pieza por huevo batido con sal, ajo y perejil, y después por pan rallado, presionando para que se adhiera.
Las ponés en una placa aceitada, rociás con un hilo de aceite y horneás a 220 °C, 12 minutos de cada lado, hasta que estén doradas y crocantes.
Servís con papas al horno en gajos.'),
  ('milanesa-de-pollo-al-horno-con-batatas-al-horno', 'Milanesa de pollo al horno con batatas al horno', 45, 1, '{almuerzo,cena}', true, 'Aplastás la pechuga en filetes finos con un palo de amasar.
Pasás cada pieza por huevo batido con sal, ajo y perejil, y después por pan rallado, presionando para que se adhiera.
Las ponés en una placa aceitada, rociás con un hilo de aceite y horneás a 220 °C, 12 minutos de cada lado, hasta que estén doradas y crocantes.
Servís con batatas al horno.'),
  ('milanesa-de-calabaza-al-horno-con-zapallitos-grillados', 'Milanesa de calabaza al horno con zapallitos grillados', 50, 1, '{almuerzo,cena}', true, 'Cortás la calabaza en rodajas de 1 cm y las hervís 5 minutos, que queden firmes; las secás.
Pasás cada pieza por huevo batido con sal, ajo y perejil, y después por pan rallado, presionando para que se adhiera.
Las ponés en una placa aceitada, rociás con un hilo de aceite y horneás a 220 °C, 12 minutos de cada lado, hasta que estén doradas y crocantes.
Servís con zapallitos grillados.'),
  ('albondigas-de-carne-en-salsa-de-tomate-con-arroz', 'Albóndigas de carne en salsa de tomate con arroz', 45, 1, '{almuerzo,cena}', true, 'Mezclás la carne con la cebolla rallada, el ajo, el huevo, el pan rallado, perejil, sal y pimienta; armás bolitas.
Las dorás con el aceite 5 minutos, sumás el tomate triturado y cocinás tapadas 20 minutos.
Hervís el arroz y servís las albóndigas encima.'),
  ('albondigas-de-pollo-con-pure-de-calabaza', 'Albóndigas de pollo con puré de calabaza', 45, 1, '{almuerzo,cena}', true, 'Mezclás el pollo picado con la cebolla rallada, el huevo, el pan rallado, sal, perejil y pimienta; armás bolitas.
Las horneás en placa aceitada a 200 °C, 18 minutos.
Hervís la calabaza y la hacés puré con la manteca y sal; servís las albóndigas encima.'),
  ('albondigas-de-pavo-con-fideos', 'Albóndigas de pavo con fideos', 40, 1, '{almuerzo,cena}', true, 'Mezclás el pavo con la cebolla rallada, el huevo, el pan rallado, sal y pimienta; armás bolitas.
Las dorás con el aceite 4 minutos y las terminás 12 minutos en el tomate triturado.
Hervís los fideos y los servís con las albóndigas.'),
  ('albondigas-de-atun-y-papa-con-ensalada', 'Albóndigas de atún y papa con ensalada', 35, 1, '{almuerzo,cena}', true, 'Mezclás el atún escurrido con la papa hervida pisada, el huevo, el pan rallado, perejil, sal y limón; armás bolitas.
Las horneás en placa aceitada 15 minutos a 200 °C.
Servís con ensalada de lechuga y tomate.'),
  ('albondigas-de-lentejas-con-arroz', 'Albóndigas de lentejas con arroz', 40, 1, '{almuerzo,cena}', true, 'Pisás las lentejas con la cebolla rallada, el huevo, la avena, comino y sal; armás bolitas.
Las dorás con el aceite 5 minutos y las terminás 8 minutos en el tomate triturado.
Hervís el arroz y servís las albóndigas encima.'),
  ('medallones-de-pollo-y-espinaca-con-ensalada', 'Medallones de pollo y espinaca con ensalada', 30, 1, '{almuerzo,cena}', true, 'Salteás la espinaca picada hasta que se achique y la mezclás con el pollo picado, el huevo, el pan rallado, sal y nuez moscada.
Formás medallones y los cocinás en sartén antiadherente 4 minutos por lado.
Servís con ensalada de lechuga y tomate.')
on conflict (slug) do nothing;

insert into public.recipe_items (recipe_id, food_id, qty)
select r.id, f.id, v.qty from (values
  ('pechuga-de-pavo-al-horno-con-zapallitos-grillados', 'pechuga-pavo', 170),
  ('pechuga-de-pavo-al-horno-con-zapallitos-grillados', 'zapallito', 1),
  ('pechuga-de-pavo-al-horno-con-zapallitos-grillados', 'aceite', 10),
  ('pechuga-de-pavo-al-horno-con-zapallitos-grillados', 'mostaza', 10),
  ('pechuga-de-pavo-al-horno-con-zapallitos-grillados', 'miel', 8),
  ('cuadril-al-horno-con-verduras-asadas-ajo-y-perejil', 'cuadril', 180),
  ('cuadril-al-horno-con-verduras-asadas-ajo-y-perejil', 'zanahoria', 1),
  ('cuadril-al-horno-con-verduras-asadas-ajo-y-perejil', 'morron', 0.5),
  ('cuadril-al-horno-con-verduras-asadas-ajo-y-perejil', 'cebolla', 0.5),
  ('cuadril-al-horno-con-verduras-asadas-ajo-y-perejil', 'zapallito', 0.5),
  ('cuadril-al-horno-con-verduras-asadas-ajo-y-perejil', 'aceite', 8),
  ('cuadril-al-horno-con-verduras-asadas-ajo-y-perejil', 'ajo', 1.5),
  ('cuadril-al-horno-con-verduras-asadas-ajo-y-perejil', 'perejil', 6),
  ('cuadril-al-horno-con-verduras-asadas-ajo-y-perejil', 'aceite-oliva', 10),
  ('pejerrey-al-horno-con-papas-y-cebolla-ajo-y-perejil', 'pejerrey', 160),
  ('pejerrey-al-horno-con-papas-y-cebolla-ajo-y-perejil', 'papa', 200),
  ('pejerrey-al-horno-con-papas-y-cebolla-ajo-y-perejil', 'cebolla', 0.5),
  ('pejerrey-al-horno-con-papas-y-cebolla-ajo-y-perejil', 'aceite', 8),
  ('pejerrey-al-horno-con-papas-y-cebolla-ajo-y-perejil', 'ajo', 1.5),
  ('pejerrey-al-horno-con-papas-y-cebolla-ajo-y-perejil', 'perejil', 6),
  ('pejerrey-al-horno-con-papas-y-cebolla-ajo-y-perejil', 'aceite-oliva', 10),
  ('vacio-al-horno-con-papines-y-ajo-yogur-y-especias', 'vacio', 200),
  ('vacio-al-horno-con-papines-y-ajo-yogur-y-especias', 'papines', 220),
  ('vacio-al-horno-con-papines-y-ajo-yogur-y-especias', 'ajo', 2.5),
  ('vacio-al-horno-con-papines-y-ajo-yogur-y-especias', 'aceite', 8),
  ('vacio-al-horno-con-papines-y-ajo-yogur-y-especias', 'yogur-natural', 50),
  ('vacio-al-horno-con-papines-y-ajo-yogur-y-especias', 'limon-exprimido', 8),
  ('bacalao-fresco-al-horno-con-brocoli-y-ajo-ajo-y-perejil', 'bacalao', 170),
  ('bacalao-fresco-al-horno-con-brocoli-y-ajo-ajo-y-perejil', 'brocoli', 170),
  ('bacalao-fresco-al-horno-con-brocoli-y-ajo-ajo-y-perejil', 'ajo', 3),
  ('bacalao-fresco-al-horno-con-brocoli-y-ajo-ajo-y-perejil', 'aceite', 8),
  ('bacalao-fresco-al-horno-con-brocoli-y-ajo-ajo-y-perejil', 'perejil', 6),
  ('bacalao-fresco-al-horno-con-brocoli-y-ajo-ajo-y-perejil', 'aceite-oliva', 10),
  ('surubi-al-horno-con-esparragos-pimenton-ahumado', 'surubi', 170),
  ('surubi-al-horno-con-esparragos-pimenton-ahumado', 'esparragos', 150),
  ('surubi-al-horno-con-esparragos-pimenton-ahumado', 'aceite', 15),
  ('surubi-al-horno-con-esparragos-pimenton-ahumado', 'limon-exprimido', 8),
  ('surubi-al-horno-con-esparragos-pimenton-ahumado', 'ajo', 1),
  ('surubi-al-horno-con-ensalada-de-rucula-y-tomates-cherry', 'surubi', 170),
  ('surubi-al-horno-con-ensalada-de-rucula-y-tomates-cherry', 'rucula', 50),
  ('surubi-al-horno-con-ensalada-de-rucula-y-tomates-cherry', 'tomate-cherry', 100),
  ('surubi-al-horno-con-ensalada-de-rucula-y-tomates-cherry', 'parmesano', 10),
  ('surubi-al-horno-con-ensalada-de-rucula-y-tomates-cherry', 'aceite-oliva', 8),
  ('surubi-al-horno-con-ensalada-de-rucula-y-tomates-cherry', 'tomate-triturado', 50),
  ('surubi-al-horno-con-ensalada-de-rucula-y-tomates-cherry', 'ajo', 1),
  ('surubi-al-horno-con-ensalada-de-rucula-y-tomates-cherry', 'aceite', 6),
  ('lenguado-al-horno-con-papas-y-cebolla-soja-y-jengibre', 'lenguado', 170),
  ('lenguado-al-horno-con-papas-y-cebolla-soja-y-jengibre', 'papa', 200),
  ('lenguado-al-horno-con-papas-y-cebolla-soja-y-jengibre', 'cebolla', 0.5),
  ('lenguado-al-horno-con-papas-y-cebolla-soja-y-jengibre', 'aceite', 8),
  ('lenguado-al-horno-con-papas-y-cebolla-soja-y-jengibre', 'salsa-soja', 15),
  ('lenguado-al-horno-con-papas-y-cebolla-soja-y-jengibre', 'jengibre', 5),
  ('lenguado-al-horno-con-papas-y-cebolla-soja-y-jengibre', 'miel', 5),
  ('abadejo-al-horno-con-ensalada-mixta-mostaza-y-miel', 'abadejo', 170),
  ('abadejo-al-horno-con-ensalada-mixta-mostaza-y-miel', 'lechuga', 70),
  ('abadejo-al-horno-con-ensalada-mixta-mostaza-y-miel', 'tomate', 1),
  ('abadejo-al-horno-con-ensalada-mixta-mostaza-y-miel', 'cebolla-morada', 0.5),
  ('abadejo-al-horno-con-ensalada-mixta-mostaza-y-miel', 'aceite-oliva', 8),
  ('abadejo-al-horno-con-ensalada-mixta-mostaza-y-miel', 'limon-exprimido', 10),
  ('abadejo-al-horno-con-ensalada-mixta-mostaza-y-miel', 'mostaza', 10),
  ('abadejo-al-horno-con-ensalada-mixta-mostaza-y-miel', 'miel', 8),
  ('abadejo-al-horno-con-ensalada-mixta-mostaza-y-miel', 'aceite', 6),
  ('solomillo-de-cerdo-al-horno-con-esparragos-ajo-y-perejil', 'lomo-cerdo', 160),
  ('solomillo-de-cerdo-al-horno-con-esparragos-ajo-y-perejil', 'esparragos', 150),
  ('solomillo-de-cerdo-al-horno-con-esparragos-ajo-y-perejil', 'aceite', 6),
  ('solomillo-de-cerdo-al-horno-con-esparragos-ajo-y-perejil', 'limon-exprimido', 8),
  ('solomillo-de-cerdo-al-horno-con-esparragos-ajo-y-perejil', 'ajo', 1.5),
  ('solomillo-de-cerdo-al-horno-con-esparragos-ajo-y-perejil', 'perejil', 6),
  ('solomillo-de-cerdo-al-horno-con-esparragos-ajo-y-perejil', 'aceite-oliva', 10),
  ('trucha-al-horno-con-esparragos-limon-y-romero', 'trucha', 170),
  ('trucha-al-horno-con-esparragos-limon-y-romero', 'esparragos', 150),
  ('trucha-al-horno-con-esparragos-limon-y-romero', 'aceite', 6),
  ('trucha-al-horno-con-esparragos-limon-y-romero', 'limon-exprimido', 30),
  ('trucha-al-horno-con-esparragos-limon-y-romero', 'aceite-oliva', 8),
  ('trucha-al-horno-con-esparragos-limon-y-romero', 'ajo', 1),
  ('salmon-al-horno-con-brocoli-y-ajo-queso-gratinado', 'salmon', 160),
  ('salmon-al-horno-con-brocoli-y-ajo-queso-gratinado', 'brocoli', 170),
  ('salmon-al-horno-con-brocoli-y-ajo-queso-gratinado', 'ajo', 1),
  ('salmon-al-horno-con-brocoli-y-ajo-queso-gratinado', 'aceite', 15),
  ('salmon-al-horno-con-brocoli-y-ajo-queso-gratinado', 'queso-cremoso', 30),
  ('bacalao-fresco-al-horno-con-verduras-asadas-pimenton', 'bacalao', 170),
  ('bacalao-fresco-al-horno-con-verduras-asadas-pimenton', 'zanahoria', 1),
  ('bacalao-fresco-al-horno-con-verduras-asadas-pimenton', 'morron', 0.5),
  ('bacalao-fresco-al-horno-con-verduras-asadas-pimenton', 'cebolla', 0.5),
  ('bacalao-fresco-al-horno-con-verduras-asadas-pimenton', 'zapallito', 0.5),
  ('bacalao-fresco-al-horno-con-verduras-asadas-pimenton', 'aceite', 15),
  ('bacalao-fresco-al-horno-con-verduras-asadas-pimenton', 'ajo', 1),
  ('carre-de-cerdo-al-horno-con-batatas-pimenton-ahumado', 'carre-cerdo', 170),
  ('carre-de-cerdo-al-horno-con-batatas-pimenton-ahumado', 'batata', 200),
  ('carre-de-cerdo-al-horno-con-batatas-pimenton-ahumado', 'aceite', 15),
  ('carre-de-cerdo-al-horno-con-batatas-pimenton-ahumado', 'ajo', 1),
  ('atun-fresco-al-horno-con-coliflor-gratinada-ajo-y', 'atun-fresco', 150),
  ('atun-fresco-al-horno-con-coliflor-gratinada-ajo-y', 'coliflor', 180),
  ('atun-fresco-al-horno-con-coliflor-gratinada-ajo-y', 'queso-rallado', 15),
  ('atun-fresco-al-horno-con-coliflor-gratinada-ajo-y', 'aceite', 6),
  ('atun-fresco-al-horno-con-coliflor-gratinada-ajo-y', 'ajo', 1.5),
  ('atun-fresco-al-horno-con-coliflor-gratinada-ajo-y', 'perejil', 6),
  ('atun-fresco-al-horno-con-coliflor-gratinada-ajo-y', 'aceite-oliva', 10),
  ('vacio-al-horno-con-berenjenas-y-tomate-tomate-y-oregano', 'vacio', 200),
  ('vacio-al-horno-con-berenjenas-y-tomate-tomate-y-oregano', 'berenjena', 0.5),
  ('vacio-al-horno-con-berenjenas-y-tomate-tomate-y-oregano', 'tomate', 1),
  ('vacio-al-horno-con-berenjenas-y-tomate-tomate-y-oregano', 'aceite', 15),
  ('vacio-al-horno-con-berenjenas-y-tomate-tomate-y-oregano', 'tomate-triturado', 50),
  ('vacio-al-horno-con-berenjenas-y-tomate-tomate-y-oregano', 'ajo', 1),
  ('abadejo-al-horno-con-batatas-tomate-y-oregano', 'abadejo', 170),
  ('abadejo-al-horno-con-batatas-tomate-y-oregano', 'batata', 200),
  ('abadejo-al-horno-con-batatas-tomate-y-oregano', 'aceite', 15),
  ('abadejo-al-horno-con-batatas-tomate-y-oregano', 'tomate-triturado', 50),
  ('abadejo-al-horno-con-batatas-tomate-y-oregano', 'ajo', 1),
  ('pejerrey-al-horno-con-coliflor-gratinada-ajo-y-perejil', 'pejerrey', 160),
  ('pejerrey-al-horno-con-coliflor-gratinada-ajo-y-perejil', 'coliflor', 180),
  ('pejerrey-al-horno-con-coliflor-gratinada-ajo-y-perejil', 'queso-rallado', 15),
  ('pejerrey-al-horno-con-coliflor-gratinada-ajo-y-perejil', 'aceite', 6),
  ('pejerrey-al-horno-con-coliflor-gratinada-ajo-y-perejil', 'ajo', 1.5),
  ('pejerrey-al-horno-con-coliflor-gratinada-ajo-y-perejil', 'perejil', 6),
  ('pejerrey-al-horno-con-coliflor-gratinada-ajo-y-perejil', 'aceite-oliva', 10),
  ('conejo-al-horno-con-calabaza-soja-y-jengibre', 'conejo', 200),
  ('conejo-al-horno-con-calabaza-soja-y-jengibre', 'calabaza', 220),
  ('conejo-al-horno-con-calabaza-soja-y-jengibre', 'aceite', 8),
  ('conejo-al-horno-con-calabaza-soja-y-jengibre', 'salsa-soja', 15),
  ('conejo-al-horno-con-calabaza-soja-y-jengibre', 'jengibre', 5),
  ('conejo-al-horno-con-calabaza-soja-y-jengibre', 'miel', 5),
  ('salmon-al-horno-con-ensalada-de-repollo-y-zanahoria', 'salmon', 160),
  ('salmon-al-horno-con-ensalada-de-repollo-y-zanahoria', 'repollo', 90),
  ('salmon-al-horno-con-ensalada-de-repollo-y-zanahoria', 'zanahoria', 1),
  ('salmon-al-horno-con-ensalada-de-repollo-y-zanahoria', 'aceite-oliva', 8),
  ('salmon-al-horno-con-ensalada-de-repollo-y-zanahoria', 'limon-exprimido', 10),
  ('salmon-al-horno-con-ensalada-de-repollo-y-zanahoria', 'tomate-triturado', 50),
  ('salmon-al-horno-con-ensalada-de-repollo-y-zanahoria', 'ajo', 1),
  ('salmon-al-horno-con-ensalada-de-repollo-y-zanahoria', 'aceite', 6),
  ('surubi-al-horno-con-ensalada-de-repollo-y-zanahoria', 'surubi', 170),
  ('surubi-al-horno-con-ensalada-de-repollo-y-zanahoria', 'repollo', 90),
  ('surubi-al-horno-con-ensalada-de-repollo-y-zanahoria', 'zanahoria', 1),
  ('surubi-al-horno-con-ensalada-de-repollo-y-zanahoria', 'aceite-oliva', 8),
  ('surubi-al-horno-con-ensalada-de-repollo-y-zanahoria', 'limon-exprimido', 10),
  ('surubi-al-horno-con-ensalada-de-repollo-y-zanahoria', 'queso-cremoso', 30),
  ('surubi-al-horno-con-ensalada-de-repollo-y-zanahoria', 'aceite', 6),
  ('merluza-al-horno-con-batatas-mostaza-y-miel', 'merluza-cruda', 170),
  ('merluza-al-horno-con-batatas-mostaza-y-miel', 'batata', 200),
  ('merluza-al-horno-con-batatas-mostaza-y-miel', 'aceite', 15),
  ('merluza-al-horno-con-batatas-mostaza-y-miel', 'mostaza', 10),
  ('merluza-al-horno-con-batatas-mostaza-y-miel', 'miel', 8),
  ('solomillo-de-cerdo-al-horno-con-brocoli-y-ajo-queso', 'lomo-cerdo', 160),
  ('solomillo-de-cerdo-al-horno-con-brocoli-y-ajo-queso', 'brocoli', 170),
  ('solomillo-de-cerdo-al-horno-con-brocoli-y-ajo-queso', 'ajo', 1),
  ('solomillo-de-cerdo-al-horno-con-brocoli-y-ajo-queso', 'aceite', 15),
  ('solomillo-de-cerdo-al-horno-con-brocoli-y-ajo-queso', 'queso-cremoso', 30),
  ('cuadril-al-horno-con-coliflor-gratinada-soja-y-jengibre', 'cuadril', 180),
  ('cuadril-al-horno-con-coliflor-gratinada-soja-y-jengibre', 'coliflor', 180),
  ('cuadril-al-horno-con-coliflor-gratinada-soja-y-jengibre', 'queso-rallado', 15),
  ('cuadril-al-horno-con-coliflor-gratinada-soja-y-jengibre', 'aceite', 6),
  ('cuadril-al-horno-con-coliflor-gratinada-soja-y-jengibre', 'salsa-soja', 15),
  ('cuadril-al-horno-con-coliflor-gratinada-soja-y-jengibre', 'jengibre', 5),
  ('cuadril-al-horno-con-coliflor-gratinada-soja-y-jengibre', 'miel', 5),
  ('salmon-al-horno-con-arroz-blanco-yogur-y-especias', 'salmon', 160),
  ('salmon-al-horno-con-arroz-blanco-yogur-y-especias', 'arroz', 60),
  ('salmon-al-horno-con-arroz-blanco-yogur-y-especias', 'yogur-natural', 50),
  ('salmon-al-horno-con-arroz-blanco-yogur-y-especias', 'ajo', 1),
  ('salmon-al-horno-con-arroz-blanco-yogur-y-especias', 'limon-exprimido', 8),
  ('pechuga-de-pavo-al-horno-con-ensalada-mixta-pimenton', 'pechuga-pavo', 170),
  ('pechuga-de-pavo-al-horno-con-ensalada-mixta-pimenton', 'lechuga', 70),
  ('pechuga-de-pavo-al-horno-con-ensalada-mixta-pimenton', 'tomate', 1),
  ('pechuga-de-pavo-al-horno-con-ensalada-mixta-pimenton', 'cebolla-morada', 0.5),
  ('pechuga-de-pavo-al-horno-con-ensalada-mixta-pimenton', 'aceite-oliva', 8),
  ('pechuga-de-pavo-al-horno-con-ensalada-mixta-pimenton', 'limon-exprimido', 10),
  ('pechuga-de-pavo-al-horno-con-ensalada-mixta-pimenton', 'aceite', 8),
  ('pechuga-de-pavo-al-horno-con-ensalada-mixta-pimenton', 'ajo', 1),
  ('pechuga-de-pollo-al-horno-con-berenjenas-y-tomate-queso', 'pechuga-cruda', 170),
  ('pechuga-de-pollo-al-horno-con-berenjenas-y-tomate-queso', 'berenjena', 0.5),
  ('pechuga-de-pollo-al-horno-con-berenjenas-y-tomate-queso', 'tomate', 1),
  ('pechuga-de-pollo-al-horno-con-berenjenas-y-tomate-queso', 'aceite', 15),
  ('pechuga-de-pollo-al-horno-con-berenjenas-y-tomate-queso', 'queso-cremoso', 30),
  ('pierna-de-cordero-al-horno-con-pure-de-papa-pimenton', 'cordero', 190),
  ('pierna-de-cordero-al-horno-con-pure-de-papa-pimenton', 'papa', 220),
  ('pierna-de-cordero-al-horno-con-pure-de-papa-pimenton', 'leche', 40),
  ('pierna-de-cordero-al-horno-con-pure-de-papa-pimenton', 'manteca', 5),
  ('pierna-de-cordero-al-horno-con-pure-de-papa-pimenton', 'aceite', 8),
  ('pierna-de-cordero-al-horno-con-pure-de-papa-pimenton', 'ajo', 1),
  ('trucha-al-horno-con-batatas-yogur-y-especias', 'trucha', 170),
  ('trucha-al-horno-con-batatas-yogur-y-especias', 'batata', 200),
  ('trucha-al-horno-con-batatas-yogur-y-especias', 'aceite', 8),
  ('trucha-al-horno-con-batatas-yogur-y-especias', 'yogur-natural', 50),
  ('trucha-al-horno-con-batatas-yogur-y-especias', 'ajo', 1),
  ('trucha-al-horno-con-batatas-yogur-y-especias', 'limon-exprimido', 8),
  ('cuadril-al-horno-con-pure-de-calabaza-queso-gratinado', 'cuadril', 180),
  ('cuadril-al-horno-con-pure-de-calabaza-queso-gratinado', 'calabaza', 220),
  ('cuadril-al-horno-con-pure-de-calabaza-queso-gratinado', 'manteca', 5),
  ('cuadril-al-horno-con-pure-de-calabaza-queso-gratinado', 'queso-cremoso', 30),
  ('cuadril-al-horno-con-pure-de-calabaza-queso-gratinado', 'aceite', 6),
  ('brotola-al-horno-con-papas-y-cebolla-queso-gratinado', 'brotola', 170),
  ('brotola-al-horno-con-papas-y-cebolla-queso-gratinado', 'papa', 200),
  ('brotola-al-horno-con-papas-y-cebolla-queso-gratinado', 'cebolla', 0.5),
  ('brotola-al-horno-con-papas-y-cebolla-queso-gratinado', 'aceite', 15),
  ('brotola-al-horno-con-papas-y-cebolla-queso-gratinado', 'queso-cremoso', 30),
  ('surubi-al-horno-con-ensalada-de-rucula-y-tomates-cherr-2', 'surubi', 170),
  ('surubi-al-horno-con-ensalada-de-rucula-y-tomates-cherr-2', 'rucula', 50),
  ('surubi-al-horno-con-ensalada-de-rucula-y-tomates-cherr-2', 'tomate-cherry', 100),
  ('surubi-al-horno-con-ensalada-de-rucula-y-tomates-cherr-2', 'parmesano', 10),
  ('surubi-al-horno-con-ensalada-de-rucula-y-tomates-cherr-2', 'aceite-oliva', 15),
  ('surubi-al-horno-con-ensalada-de-rucula-y-tomates-cherr-2', 'limon-exprimido', 20),
  ('surubi-al-horno-con-ensalada-de-rucula-y-tomates-cherr-2', 'ajo', 1),
  ('conejo-al-horno-con-berenjenas-y-tomate-queso-gratinado', 'conejo', 200),
  ('conejo-al-horno-con-berenjenas-y-tomate-queso-gratinado', 'berenjena', 0.5),
  ('conejo-al-horno-con-berenjenas-y-tomate-queso-gratinado', 'tomate', 1),
  ('conejo-al-horno-con-berenjenas-y-tomate-queso-gratinado', 'aceite', 15),
  ('conejo-al-horno-con-berenjenas-y-tomate-queso-gratinado', 'queso-cremoso', 30),
  ('matambre-de-cerdo-al-horno-con-papas-y-cebolla-limon-y', 'matambre-cerdo', 190),
  ('matambre-de-cerdo-al-horno-con-papas-y-cebolla-limon-y', 'papa', 200),
  ('matambre-de-cerdo-al-horno-con-papas-y-cebolla-limon-y', 'cebolla', 0.5),
  ('matambre-de-cerdo-al-horno-con-papas-y-cebolla-limon-y', 'aceite', 8),
  ('matambre-de-cerdo-al-horno-con-papas-y-cebolla-limon-y', 'limon-exprimido', 20),
  ('matambre-de-cerdo-al-horno-con-papas-y-cebolla-limon-y', 'aceite-oliva', 8),
  ('matambre-de-cerdo-al-horno-con-papas-y-cebolla-limon-y', 'ajo', 1),
  ('pata-muslo-al-horno-con-arroz-blanco-soja-y-jengibre', 'pata-muslo', 1),
  ('pata-muslo-al-horno-con-arroz-blanco-soja-y-jengibre', 'arroz', 60),
  ('pata-muslo-al-horno-con-arroz-blanco-soja-y-jengibre', 'salsa-soja', 15),
  ('pata-muslo-al-horno-con-arroz-blanco-soja-y-jengibre', 'jengibre', 5),
  ('pata-muslo-al-horno-con-arroz-blanco-soja-y-jengibre', 'miel', 5),
  ('salmon-al-horno-con-ensalada-de-repollo-y-zanahoria-2', 'salmon', 160),
  ('salmon-al-horno-con-ensalada-de-repollo-y-zanahoria-2', 'repollo', 90),
  ('salmon-al-horno-con-ensalada-de-repollo-y-zanahoria-2', 'zanahoria', 1),
  ('salmon-al-horno-con-ensalada-de-repollo-y-zanahoria-2', 'aceite-oliva', 8),
  ('salmon-al-horno-con-ensalada-de-repollo-y-zanahoria-2', 'limon-exprimido', 10),
  ('salmon-al-horno-con-ensalada-de-repollo-y-zanahoria-2', 'mostaza', 10),
  ('salmon-al-horno-con-ensalada-de-repollo-y-zanahoria-2', 'miel', 8),
  ('salmon-al-horno-con-ensalada-de-repollo-y-zanahoria-2', 'aceite', 6),
  ('vacio-al-horno-con-arroz-blanco-limon-y-romero', 'vacio', 200),
  ('vacio-al-horno-con-arroz-blanco-limon-y-romero', 'arroz', 60),
  ('vacio-al-horno-con-arroz-blanco-limon-y-romero', 'limon-exprimido', 20),
  ('vacio-al-horno-con-arroz-blanco-limon-y-romero', 'aceite-oliva', 8),
  ('vacio-al-horno-con-arroz-blanco-limon-y-romero', 'ajo', 1),
  ('cuadril-al-horno-con-papas-y-cebolla-tomate-y-oregano', 'cuadril', 180),
  ('cuadril-al-horno-con-papas-y-cebolla-tomate-y-oregano', 'papa', 200),
  ('cuadril-al-horno-con-papas-y-cebolla-tomate-y-oregano', 'cebolla', 0.5),
  ('cuadril-al-horno-con-papas-y-cebolla-tomate-y-oregano', 'aceite', 15),
  ('cuadril-al-horno-con-papas-y-cebolla-tomate-y-oregano', 'tomate-triturado', 50),
  ('cuadril-al-horno-con-papas-y-cebolla-tomate-y-oregano', 'ajo', 1),
  ('pechuga-de-pavo-al-horno-con-calabaza-pimenton-ahumado', 'pechuga-pavo', 170),
  ('pechuga-de-pavo-al-horno-con-calabaza-pimenton-ahumado', 'calabaza', 220),
  ('pechuga-de-pavo-al-horno-con-calabaza-pimenton-ahumado', 'aceite', 15),
  ('pechuga-de-pavo-al-horno-con-calabaza-pimenton-ahumado', 'ajo', 1),
  ('peceto-al-horno-con-calabaza-mostaza-y-miel', 'peceto', 170),
  ('peceto-al-horno-con-calabaza-mostaza-y-miel', 'calabaza', 220),
  ('peceto-al-horno-con-calabaza-mostaza-y-miel', 'aceite', 15),
  ('peceto-al-horno-con-calabaza-mostaza-y-miel', 'mostaza', 10),
  ('peceto-al-horno-con-calabaza-mostaza-y-miel', 'miel', 8),
  ('matambre-de-cerdo-al-horno-con-coliflor-gratinada-yogur', 'matambre-cerdo', 190),
  ('matambre-de-cerdo-al-horno-con-coliflor-gratinada-yogur', 'coliflor', 180),
  ('matambre-de-cerdo-al-horno-con-coliflor-gratinada-yogur', 'queso-rallado', 15),
  ('matambre-de-cerdo-al-horno-con-coliflor-gratinada-yogur', 'aceite', 6),
  ('matambre-de-cerdo-al-horno-con-coliflor-gratinada-yogur', 'yogur-natural', 50),
  ('matambre-de-cerdo-al-horno-con-coliflor-gratinada-yogur', 'ajo', 1),
  ('matambre-de-cerdo-al-horno-con-coliflor-gratinada-yogur', 'limon-exprimido', 8),
  ('solomillo-de-cerdo-al-horno-con-coliflor-gratinada', 'lomo-cerdo', 160),
  ('solomillo-de-cerdo-al-horno-con-coliflor-gratinada', 'coliflor', 180),
  ('solomillo-de-cerdo-al-horno-con-coliflor-gratinada', 'queso-rallado', 15),
  ('solomillo-de-cerdo-al-horno-con-coliflor-gratinada', 'aceite', 15),
  ('solomillo-de-cerdo-al-horno-con-coliflor-gratinada', 'ajo', 1),
  ('surubi-al-horno-con-coliflor-gratinada-queso-gratinado', 'surubi', 170),
  ('surubi-al-horno-con-coliflor-gratinada-queso-gratinado', 'coliflor', 180),
  ('surubi-al-horno-con-coliflor-gratinada-queso-gratinado', 'queso-rallado', 15),
  ('surubi-al-horno-con-coliflor-gratinada-queso-gratinado', 'aceite', 10),
  ('surubi-al-horno-con-coliflor-gratinada-queso-gratinado', 'queso-cremoso', 30),
  ('abadejo-al-horno-con-berenjenas-y-tomate-limon-y-romero', 'abadejo', 170),
  ('abadejo-al-horno-con-berenjenas-y-tomate-limon-y-romero', 'berenjena', 0.5),
  ('abadejo-al-horno-con-berenjenas-y-tomate-limon-y-romero', 'tomate', 1),
  ('abadejo-al-horno-con-berenjenas-y-tomate-limon-y-romero', 'aceite', 8),
  ('abadejo-al-horno-con-berenjenas-y-tomate-limon-y-romero', 'limon-exprimido', 20),
  ('abadejo-al-horno-con-berenjenas-y-tomate-limon-y-romero', 'aceite-oliva', 8),
  ('abadejo-al-horno-con-berenjenas-y-tomate-limon-y-romero', 'ajo', 1),
  ('peceto-al-horno-con-pure-de-papa-limon-y-romero', 'peceto', 170),
  ('peceto-al-horno-con-pure-de-papa-limon-y-romero', 'papa', 220),
  ('peceto-al-horno-con-pure-de-papa-limon-y-romero', 'leche', 40),
  ('peceto-al-horno-con-pure-de-papa-limon-y-romero', 'manteca', 5),
  ('peceto-al-horno-con-pure-de-papa-limon-y-romero', 'limon-exprimido', 20),
  ('peceto-al-horno-con-pure-de-papa-limon-y-romero', 'aceite-oliva', 8),
  ('peceto-al-horno-con-pure-de-papa-limon-y-romero', 'ajo', 1),
  ('brotola-al-horno-con-calabaza-tomate-y-oregano', 'brotola', 170),
  ('brotola-al-horno-con-calabaza-tomate-y-oregano', 'calabaza', 220),
  ('brotola-al-horno-con-calabaza-tomate-y-oregano', 'aceite', 15),
  ('brotola-al-horno-con-calabaza-tomate-y-oregano', 'tomate-triturado', 50),
  ('brotola-al-horno-con-calabaza-tomate-y-oregano', 'ajo', 1),
  ('solomillo-de-cerdo-al-horno-con-papines-y-ajo-yogur-y', 'lomo-cerdo', 160),
  ('solomillo-de-cerdo-al-horno-con-papines-y-ajo-yogur-y', 'papines', 220),
  ('solomillo-de-cerdo-al-horno-con-papines-y-ajo-yogur-y', 'ajo', 2.5),
  ('solomillo-de-cerdo-al-horno-con-papines-y-ajo-yogur-y', 'aceite', 8),
  ('solomillo-de-cerdo-al-horno-con-papines-y-ajo-yogur-y', 'yogur-natural', 50),
  ('solomillo-de-cerdo-al-horno-con-papines-y-ajo-yogur-y', 'limon-exprimido', 8),
  ('peceto-al-horno-con-brocoli-y-ajo-yogur-y-especias', 'peceto', 170),
  ('peceto-al-horno-con-brocoli-y-ajo-yogur-y-especias', 'brocoli', 170),
  ('peceto-al-horno-con-brocoli-y-ajo-yogur-y-especias', 'ajo', 2),
  ('peceto-al-horno-con-brocoli-y-ajo-yogur-y-especias', 'aceite', 8),
  ('peceto-al-horno-con-brocoli-y-ajo-yogur-y-especias', 'yogur-natural', 50),
  ('peceto-al-horno-con-brocoli-y-ajo-yogur-y-especias', 'limon-exprimido', 8),
  ('pechuga-de-pavo-al-horno-con-berenjenas-y-tomate-limon', 'pechuga-pavo', 170),
  ('pechuga-de-pavo-al-horno-con-berenjenas-y-tomate-limon', 'berenjena', 0.5),
  ('pechuga-de-pavo-al-horno-con-berenjenas-y-tomate-limon', 'tomate', 1),
  ('pechuga-de-pavo-al-horno-con-berenjenas-y-tomate-limon', 'aceite', 8),
  ('pechuga-de-pavo-al-horno-con-berenjenas-y-tomate-limon', 'limon-exprimido', 20),
  ('pechuga-de-pavo-al-horno-con-berenjenas-y-tomate-limon', 'aceite-oliva', 8),
  ('pechuga-de-pavo-al-horno-con-berenjenas-y-tomate-limon', 'ajo', 1),
  ('pierna-de-cordero-al-horno-con-coliflor-gratinada-yogur', 'cordero', 190),
  ('pierna-de-cordero-al-horno-con-coliflor-gratinada-yogur', 'coliflor', 180),
  ('pierna-de-cordero-al-horno-con-coliflor-gratinada-yogur', 'queso-rallado', 15),
  ('pierna-de-cordero-al-horno-con-coliflor-gratinada-yogur', 'aceite', 6),
  ('pierna-de-cordero-al-horno-con-coliflor-gratinada-yogur', 'yogur-natural', 50),
  ('pierna-de-cordero-al-horno-con-coliflor-gratinada-yogur', 'ajo', 1),
  ('pierna-de-cordero-al-horno-con-coliflor-gratinada-yogur', 'limon-exprimido', 8),
  ('pechuga-de-pollo-al-horno-con-batatas-limon-y-romero', 'pechuga-cruda', 170),
  ('pechuga-de-pollo-al-horno-con-batatas-limon-y-romero', 'batata', 200),
  ('pechuga-de-pollo-al-horno-con-batatas-limon-y-romero', 'aceite', 8),
  ('pechuga-de-pollo-al-horno-con-batatas-limon-y-romero', 'limon-exprimido', 20),
  ('pechuga-de-pollo-al-horno-con-batatas-limon-y-romero', 'aceite-oliva', 8),
  ('pechuga-de-pollo-al-horno-con-batatas-limon-y-romero', 'ajo', 1),
  ('bondiola-al-horno-con-verduras-asadas-tomate-y-oregano', 'bondiola-cerdo', 170),
  ('bondiola-al-horno-con-verduras-asadas-tomate-y-oregano', 'zanahoria', 1),
  ('bondiola-al-horno-con-verduras-asadas-tomate-y-oregano', 'morron', 0.5),
  ('bondiola-al-horno-con-verduras-asadas-tomate-y-oregano', 'cebolla', 0.5),
  ('bondiola-al-horno-con-verduras-asadas-tomate-y-oregano', 'zapallito', 0.5),
  ('bondiola-al-horno-con-verduras-asadas-tomate-y-oregano', 'aceite', 15),
  ('bondiola-al-horno-con-verduras-asadas-tomate-y-oregano', 'tomate-triturado', 50),
  ('bondiola-al-horno-con-verduras-asadas-tomate-y-oregano', 'ajo', 1),
  ('conejo-al-horno-con-esparragos-yogur-y-especias', 'conejo', 200),
  ('conejo-al-horno-con-esparragos-yogur-y-especias', 'esparragos', 150),
  ('conejo-al-horno-con-esparragos-yogur-y-especias', 'aceite', 6),
  ('conejo-al-horno-con-esparragos-yogur-y-especias', 'limon-exprimido', 15),
  ('conejo-al-horno-con-esparragos-yogur-y-especias', 'yogur-natural', 50),
  ('conejo-al-horno-con-esparragos-yogur-y-especias', 'ajo', 1),
  ('salmon-al-horno-con-batatas-pimenton-ahumado', 'salmon', 160),
  ('salmon-al-horno-con-batatas-pimenton-ahumado', 'batata', 200),
  ('salmon-al-horno-con-batatas-pimenton-ahumado', 'aceite', 15),
  ('salmon-al-horno-con-batatas-pimenton-ahumado', 'ajo', 1),
  ('pejerrey-al-horno-con-berenjenas-y-tomate-limon-y-romero', 'pejerrey', 160),
  ('pejerrey-al-horno-con-berenjenas-y-tomate-limon-y-romero', 'berenjena', 0.5),
  ('pejerrey-al-horno-con-berenjenas-y-tomate-limon-y-romero', 'tomate', 1),
  ('pejerrey-al-horno-con-berenjenas-y-tomate-limon-y-romero', 'aceite', 8),
  ('pejerrey-al-horno-con-berenjenas-y-tomate-limon-y-romero', 'limon-exprimido', 20),
  ('pejerrey-al-horno-con-berenjenas-y-tomate-limon-y-romero', 'aceite-oliva', 8),
  ('pejerrey-al-horno-con-berenjenas-y-tomate-limon-y-romero', 'ajo', 1),
  ('vacio-al-horno-con-brocoli-y-ajo-tomate-y-oregano', 'vacio', 200),
  ('vacio-al-horno-con-brocoli-y-ajo-tomate-y-oregano', 'brocoli', 170),
  ('vacio-al-horno-con-brocoli-y-ajo-tomate-y-oregano', 'ajo', 2),
  ('vacio-al-horno-con-brocoli-y-ajo-tomate-y-oregano', 'aceite', 15),
  ('vacio-al-horno-con-brocoli-y-ajo-tomate-y-oregano', 'tomate-triturado', 50),
  ('cuadril-al-horno-con-esparragos-mostaza-y-miel', 'cuadril', 180),
  ('cuadril-al-horno-con-esparragos-mostaza-y-miel', 'esparragos', 150),
  ('cuadril-al-horno-con-esparragos-mostaza-y-miel', 'aceite', 10),
  ('cuadril-al-horno-con-esparragos-mostaza-y-miel', 'limon-exprimido', 8),
  ('cuadril-al-horno-con-esparragos-mostaza-y-miel', 'mostaza', 10),
  ('cuadril-al-horno-con-esparragos-mostaza-y-miel', 'miel', 8),
  ('matambre-de-cerdo-al-horno-con-calabaza-ajo-y-perejil', 'matambre-cerdo', 190),
  ('matambre-de-cerdo-al-horno-con-calabaza-ajo-y-perejil', 'calabaza', 220),
  ('matambre-de-cerdo-al-horno-con-calabaza-ajo-y-perejil', 'aceite', 8),
  ('matambre-de-cerdo-al-horno-con-calabaza-ajo-y-perejil', 'ajo', 1.5),
  ('matambre-de-cerdo-al-horno-con-calabaza-ajo-y-perejil', 'perejil', 6),
  ('matambre-de-cerdo-al-horno-con-calabaza-ajo-y-perejil', 'aceite-oliva', 10),
  ('peceto-al-horno-con-papas-y-cebolla-queso-gratinado', 'peceto', 170),
  ('peceto-al-horno-con-papas-y-cebolla-queso-gratinado', 'papa', 200),
  ('peceto-al-horno-con-papas-y-cebolla-queso-gratinado', 'cebolla', 0.5),
  ('peceto-al-horno-con-papas-y-cebolla-queso-gratinado', 'aceite', 15),
  ('peceto-al-horno-con-papas-y-cebolla-queso-gratinado', 'queso-cremoso', 30),
  ('peceto-al-horno-con-ensalada-de-rucula-y-tomates-cherry', 'peceto', 170),
  ('peceto-al-horno-con-ensalada-de-rucula-y-tomates-cherry', 'rucula', 50),
  ('peceto-al-horno-con-ensalada-de-rucula-y-tomates-cherry', 'tomate-cherry', 100),
  ('peceto-al-horno-con-ensalada-de-rucula-y-tomates-cherry', 'parmesano', 10),
  ('peceto-al-horno-con-ensalada-de-rucula-y-tomates-cherry', 'aceite-oliva', 8),
  ('peceto-al-horno-con-ensalada-de-rucula-y-tomates-cherry', 'queso-cremoso', 30),
  ('peceto-al-horno-con-ensalada-de-rucula-y-tomates-cherry', 'aceite', 6),
  ('abadejo-al-horno-con-coliflor-gratinada-ajo-y-perejil', 'abadejo', 170),
  ('abadejo-al-horno-con-coliflor-gratinada-ajo-y-perejil', 'coliflor', 180),
  ('abadejo-al-horno-con-coliflor-gratinada-ajo-y-perejil', 'queso-rallado', 15),
  ('abadejo-al-horno-con-coliflor-gratinada-ajo-y-perejil', 'aceite', 6),
  ('abadejo-al-horno-con-coliflor-gratinada-ajo-y-perejil', 'ajo', 1.5),
  ('abadejo-al-horno-con-coliflor-gratinada-ajo-y-perejil', 'perejil', 6),
  ('abadejo-al-horno-con-coliflor-gratinada-ajo-y-perejil', 'aceite-oliva', 10),
  ('matambre-de-cerdo-al-horno-con-pure-de-papa-pimenton', 'matambre-cerdo', 190),
  ('matambre-de-cerdo-al-horno-con-pure-de-papa-pimenton', 'papa', 220),
  ('matambre-de-cerdo-al-horno-con-pure-de-papa-pimenton', 'leche', 40),
  ('matambre-de-cerdo-al-horno-con-pure-de-papa-pimenton', 'manteca', 5),
  ('matambre-de-cerdo-al-horno-con-pure-de-papa-pimenton', 'aceite', 8),
  ('matambre-de-cerdo-al-horno-con-pure-de-papa-pimenton', 'ajo', 1),
  ('vacio-al-horno-con-ensalada-de-repollo-y-zanahoria', 'vacio', 200),
  ('vacio-al-horno-con-ensalada-de-repollo-y-zanahoria', 'repollo', 90),
  ('vacio-al-horno-con-ensalada-de-repollo-y-zanahoria', 'zanahoria', 1),
  ('vacio-al-horno-con-ensalada-de-repollo-y-zanahoria', 'aceite-oliva', 8),
  ('vacio-al-horno-con-ensalada-de-repollo-y-zanahoria', 'limon-exprimido', 10),
  ('vacio-al-horno-con-ensalada-de-repollo-y-zanahoria', 'queso-cremoso', 30),
  ('vacio-al-horno-con-ensalada-de-repollo-y-zanahoria', 'aceite', 6),
  ('lenguado-al-horno-con-verduras-asadas-tomate-y-oregano', 'lenguado', 170),
  ('lenguado-al-horno-con-verduras-asadas-tomate-y-oregano', 'zanahoria', 1),
  ('lenguado-al-horno-con-verduras-asadas-tomate-y-oregano', 'morron', 0.5),
  ('lenguado-al-horno-con-verduras-asadas-tomate-y-oregano', 'cebolla', 0.5),
  ('lenguado-al-horno-con-verduras-asadas-tomate-y-oregano', 'zapallito', 0.5),
  ('lenguado-al-horno-con-verduras-asadas-tomate-y-oregano', 'aceite', 15),
  ('lenguado-al-horno-con-verduras-asadas-tomate-y-oregano', 'tomate-triturado', 50),
  ('lenguado-al-horno-con-verduras-asadas-tomate-y-oregano', 'ajo', 1),
  ('matambre-de-cerdo-al-horno-con-verduras-asadas-queso', 'matambre-cerdo', 190),
  ('matambre-de-cerdo-al-horno-con-verduras-asadas-queso', 'zanahoria', 1),
  ('matambre-de-cerdo-al-horno-con-verduras-asadas-queso', 'morron', 0.5),
  ('matambre-de-cerdo-al-horno-con-verduras-asadas-queso', 'cebolla', 0.5),
  ('matambre-de-cerdo-al-horno-con-verduras-asadas-queso', 'zapallito', 0.5),
  ('matambre-de-cerdo-al-horno-con-verduras-asadas-queso', 'aceite', 15),
  ('matambre-de-cerdo-al-horno-con-verduras-asadas-queso', 'queso-cremoso', 30),
  ('matambre-de-cerdo-al-horno-con-batatas-pimenton-ahumado', 'matambre-cerdo', 190),
  ('matambre-de-cerdo-al-horno-con-batatas-pimenton-ahumado', 'batata', 200),
  ('matambre-de-cerdo-al-horno-con-batatas-pimenton-ahumado', 'aceite', 15),
  ('matambre-de-cerdo-al-horno-con-batatas-pimenton-ahumado', 'ajo', 1),
  ('pierna-de-cordero-al-horno-con-batatas-soja-y-jengibre', 'cordero', 190),
  ('pierna-de-cordero-al-horno-con-batatas-soja-y-jengibre', 'batata', 200),
  ('pierna-de-cordero-al-horno-con-batatas-soja-y-jengibre', 'aceite', 8),
  ('pierna-de-cordero-al-horno-con-batatas-soja-y-jengibre', 'salsa-soja', 15),
  ('pierna-de-cordero-al-horno-con-batatas-soja-y-jengibre', 'jengibre', 5),
  ('pierna-de-cordero-al-horno-con-batatas-soja-y-jengibre', 'miel', 5),
  ('pejerrey-al-horno-con-batatas-limon-y-romero', 'pejerrey', 160),
  ('pejerrey-al-horno-con-batatas-limon-y-romero', 'batata', 200),
  ('pejerrey-al-horno-con-batatas-limon-y-romero', 'aceite', 8),
  ('pejerrey-al-horno-con-batatas-limon-y-romero', 'limon-exprimido', 20),
  ('pejerrey-al-horno-con-batatas-limon-y-romero', 'aceite-oliva', 8),
  ('pejerrey-al-horno-con-batatas-limon-y-romero', 'ajo', 1),
  ('merluza-al-horno-con-papines-y-ajo-queso-gratinado', 'merluza-cruda', 170),
  ('merluza-al-horno-con-papines-y-ajo-queso-gratinado', 'papines', 220),
  ('merluza-al-horno-con-papines-y-ajo-queso-gratinado', 'ajo', 1.5),
  ('merluza-al-horno-con-papines-y-ajo-queso-gratinado', 'aceite', 15),
  ('merluza-al-horno-con-papines-y-ajo-queso-gratinado', 'queso-cremoso', 30),
  ('carre-de-cerdo-al-horno-con-arroz-blanco-limon-y-romero', 'carre-cerdo', 170),
  ('carre-de-cerdo-al-horno-con-arroz-blanco-limon-y-romero', 'arroz', 60),
  ('carre-de-cerdo-al-horno-con-arroz-blanco-limon-y-romero', 'limon-exprimido', 20),
  ('carre-de-cerdo-al-horno-con-arroz-blanco-limon-y-romero', 'aceite-oliva', 8),
  ('carre-de-cerdo-al-horno-con-arroz-blanco-limon-y-romero', 'ajo', 1),
  ('merluza-al-horno-con-brocoli-y-ajo-pimenton-ahumado', 'merluza-cruda', 170),
  ('merluza-al-horno-con-brocoli-y-ajo-pimenton-ahumado', 'brocoli', 170),
  ('merluza-al-horno-con-brocoli-y-ajo-pimenton-ahumado', 'ajo', 2),
  ('merluza-al-horno-con-brocoli-y-ajo-pimenton-ahumado', 'aceite', 15),
  ('vacio-al-horno-con-berenjenas-y-tomate-ajo-y-perejil', 'vacio', 200),
  ('vacio-al-horno-con-berenjenas-y-tomate-ajo-y-perejil', 'berenjena', 0.5),
  ('vacio-al-horno-con-berenjenas-y-tomate-ajo-y-perejil', 'tomate', 1),
  ('vacio-al-horno-con-berenjenas-y-tomate-ajo-y-perejil', 'aceite', 8),
  ('vacio-al-horno-con-berenjenas-y-tomate-ajo-y-perejil', 'ajo', 1.5),
  ('vacio-al-horno-con-berenjenas-y-tomate-ajo-y-perejil', 'perejil', 6),
  ('vacio-al-horno-con-berenjenas-y-tomate-ajo-y-perejil', 'aceite-oliva', 10),
  ('pejerrey-al-horno-con-papines-y-ajo-queso-gratinado', 'pejerrey', 160),
  ('pejerrey-al-horno-con-papines-y-ajo-queso-gratinado', 'papines', 220),
  ('pejerrey-al-horno-con-papines-y-ajo-queso-gratinado', 'ajo', 1.5),
  ('pejerrey-al-horno-con-papines-y-ajo-queso-gratinado', 'aceite', 15),
  ('pejerrey-al-horno-con-papines-y-ajo-queso-gratinado', 'queso-cremoso', 30),
  ('salmon-al-horno-con-papas-y-cebolla-soja-y-jengibre', 'salmon', 160),
  ('salmon-al-horno-con-papas-y-cebolla-soja-y-jengibre', 'papa', 200),
  ('salmon-al-horno-con-papas-y-cebolla-soja-y-jengibre', 'cebolla', 0.5),
  ('salmon-al-horno-con-papas-y-cebolla-soja-y-jengibre', 'aceite', 8),
  ('salmon-al-horno-con-papas-y-cebolla-soja-y-jengibre', 'salsa-soja', 15),
  ('salmon-al-horno-con-papas-y-cebolla-soja-y-jengibre', 'jengibre', 5),
  ('salmon-al-horno-con-papas-y-cebolla-soja-y-jengibre', 'miel', 5),
  ('merluza-al-horno-con-ensalada-mixta-ajo-y-perejil', 'merluza-cruda', 170),
  ('merluza-al-horno-con-ensalada-mixta-ajo-y-perejil', 'lechuga', 70),
  ('merluza-al-horno-con-ensalada-mixta-ajo-y-perejil', 'tomate', 1),
  ('merluza-al-horno-con-ensalada-mixta-ajo-y-perejil', 'cebolla-morada', 0.5),
  ('merluza-al-horno-con-ensalada-mixta-ajo-y-perejil', 'aceite-oliva', 20),
  ('merluza-al-horno-con-ensalada-mixta-ajo-y-perejil', 'limon-exprimido', 10),
  ('merluza-al-horno-con-ensalada-mixta-ajo-y-perejil', 'ajo', 1.5),
  ('merluza-al-horno-con-ensalada-mixta-ajo-y-perejil', 'perejil', 6),
  ('pata-muslo-al-horno-con-ensalada-mixta-yogur-y-especias', 'pata-muslo', 1),
  ('pata-muslo-al-horno-con-ensalada-mixta-yogur-y-especias', 'lechuga', 70),
  ('pata-muslo-al-horno-con-ensalada-mixta-yogur-y-especias', 'tomate', 1),
  ('pata-muslo-al-horno-con-ensalada-mixta-yogur-y-especias', 'cebolla-morada', 0.5),
  ('pata-muslo-al-horno-con-ensalada-mixta-yogur-y-especias', 'aceite-oliva', 8),
  ('pata-muslo-al-horno-con-ensalada-mixta-yogur-y-especias', 'limon-exprimido', 20),
  ('pata-muslo-al-horno-con-ensalada-mixta-yogur-y-especias', 'yogur-natural', 50),
  ('pata-muslo-al-horno-con-ensalada-mixta-yogur-y-especias', 'ajo', 1),
  ('bondiola-al-horno-con-ensalada-mixta-limon-y-romero', 'bondiola-cerdo', 170),
  ('bondiola-al-horno-con-ensalada-mixta-limon-y-romero', 'lechuga', 70),
  ('bondiola-al-horno-con-ensalada-mixta-limon-y-romero', 'tomate', 1),
  ('bondiola-al-horno-con-ensalada-mixta-limon-y-romero', 'cebolla-morada', 0.5),
  ('bondiola-al-horno-con-ensalada-mixta-limon-y-romero', 'aceite-oliva', 15),
  ('bondiola-al-horno-con-ensalada-mixta-limon-y-romero', 'limon-exprimido', 30),
  ('bondiola-al-horno-con-ensalada-mixta-limon-y-romero', 'ajo', 1),
  ('matambre-de-cerdo-al-horno-con-brocoli-y-ajo-pimenton', 'matambre-cerdo', 190),
  ('matambre-de-cerdo-al-horno-con-brocoli-y-ajo-pimenton', 'brocoli', 170),
  ('matambre-de-cerdo-al-horno-con-brocoli-y-ajo-pimenton', 'ajo', 2),
  ('matambre-de-cerdo-al-horno-con-brocoli-y-ajo-pimenton', 'aceite', 15),
  ('lenguado-al-horno-con-ensalada-de-rucula-y-tomates', 'lenguado', 170),
  ('lenguado-al-horno-con-ensalada-de-rucula-y-tomates', 'rucula', 50),
  ('lenguado-al-horno-con-ensalada-de-rucula-y-tomates', 'tomate-cherry', 100),
  ('lenguado-al-horno-con-ensalada-de-rucula-y-tomates', 'parmesano', 10),
  ('lenguado-al-horno-con-ensalada-de-rucula-y-tomates', 'aceite-oliva', 8),
  ('lenguado-al-horno-con-ensalada-de-rucula-y-tomates', 'mostaza', 10),
  ('lenguado-al-horno-con-ensalada-de-rucula-y-tomates', 'miel', 8),
  ('lenguado-al-horno-con-ensalada-de-rucula-y-tomates', 'aceite', 6),
  ('pata-muslo-al-horno-con-brocoli-y-ajo-ajo-y-perejil', 'pata-muslo', 1),
  ('pata-muslo-al-horno-con-brocoli-y-ajo-ajo-y-perejil', 'brocoli', 170),
  ('pata-muslo-al-horno-con-brocoli-y-ajo-ajo-y-perejil', 'ajo', 3),
  ('pata-muslo-al-horno-con-brocoli-y-ajo-ajo-y-perejil', 'aceite', 8),
  ('pata-muslo-al-horno-con-brocoli-y-ajo-ajo-y-perejil', 'perejil', 6),
  ('pata-muslo-al-horno-con-brocoli-y-ajo-ajo-y-perejil', 'aceite-oliva', 10),
  ('pata-muslo-al-horno-con-esparragos-pimenton-ahumado', 'pata-muslo', 1),
  ('pata-muslo-al-horno-con-esparragos-pimenton-ahumado', 'esparragos', 150),
  ('pata-muslo-al-horno-con-esparragos-pimenton-ahumado', 'aceite', 15),
  ('pata-muslo-al-horno-con-esparragos-pimenton-ahumado', 'limon-exprimido', 8),
  ('pata-muslo-al-horno-con-esparragos-pimenton-ahumado', 'ajo', 1),
  ('matambre-de-cerdo-al-horno-con-pure-de-papa-mostaza-y', 'matambre-cerdo', 190),
  ('matambre-de-cerdo-al-horno-con-pure-de-papa-mostaza-y', 'papa', 220),
  ('matambre-de-cerdo-al-horno-con-pure-de-papa-mostaza-y', 'leche', 40),
  ('matambre-de-cerdo-al-horno-con-pure-de-papa-mostaza-y', 'manteca', 5),
  ('matambre-de-cerdo-al-horno-con-pure-de-papa-mostaza-y', 'mostaza', 10),
  ('matambre-de-cerdo-al-horno-con-pure-de-papa-mostaza-y', 'miel', 8),
  ('matambre-de-cerdo-al-horno-con-pure-de-papa-mostaza-y', 'aceite', 6),
  ('pechuga-de-pavo-al-horno-con-verduras-asadas-limon-y', 'pechuga-pavo', 170),
  ('pechuga-de-pavo-al-horno-con-verduras-asadas-limon-y', 'zanahoria', 1),
  ('pechuga-de-pavo-al-horno-con-verduras-asadas-limon-y', 'morron', 0.5),
  ('pechuga-de-pavo-al-horno-con-verduras-asadas-limon-y', 'cebolla', 0.5),
  ('pechuga-de-pavo-al-horno-con-verduras-asadas-limon-y', 'zapallito', 0.5),
  ('pechuga-de-pavo-al-horno-con-verduras-asadas-limon-y', 'aceite', 8),
  ('pechuga-de-pavo-al-horno-con-verduras-asadas-limon-y', 'limon-exprimido', 20),
  ('pechuga-de-pavo-al-horno-con-verduras-asadas-limon-y', 'aceite-oliva', 8),
  ('pechuga-de-pavo-al-horno-con-verduras-asadas-limon-y', 'ajo', 1),
  ('solomillo-de-cerdo-al-horno-con-verduras-asadas', 'lomo-cerdo', 160),
  ('solomillo-de-cerdo-al-horno-con-verduras-asadas', 'zanahoria', 1),
  ('solomillo-de-cerdo-al-horno-con-verduras-asadas', 'morron', 0.5),
  ('solomillo-de-cerdo-al-horno-con-verduras-asadas', 'cebolla', 0.5),
  ('solomillo-de-cerdo-al-horno-con-verduras-asadas', 'zapallito', 0.5),
  ('solomillo-de-cerdo-al-horno-con-verduras-asadas', 'aceite', 15),
  ('solomillo-de-cerdo-al-horno-con-verduras-asadas', 'ajo', 1),
  ('hamburguesa-de-pollo-con-ensalada-de-lechuga-y-tomate', 'picada-pollo', 140),
  ('hamburguesa-de-pollo-con-ensalada-de-lechuga-y-tomate', 'cebolla', 0.5),
  ('hamburguesa-de-pollo-con-ensalada-de-lechuga-y-tomate', 'ajo', 0.5),
  ('hamburguesa-de-pollo-con-ensalada-de-lechuga-y-tomate', 'perejil', 3),
  ('hamburguesa-de-pollo-con-ensalada-de-lechuga-y-tomate', 'lechuga', 70),
  ('hamburguesa-de-pollo-con-ensalada-de-lechuga-y-tomate', 'tomate', 1),
  ('hamburguesa-de-pollo-con-ensalada-de-lechuga-y-tomate', 'aceite-oliva', 8),
  ('hamburguesa-de-pollo-con-ensalada-de-lechuga-y-tomate', 'aceite', 4),
  ('hamburguesa-de-pavo-en-pan-con-tomate-y-lechuga', 'picada-pavo', 140),
  ('hamburguesa-de-pavo-en-pan-con-tomate-y-lechuga', 'cebolla', 0.5),
  ('hamburguesa-de-pavo-en-pan-con-tomate-y-lechuga', 'perejil', 3),
  ('hamburguesa-de-pavo-en-pan-con-tomate-y-lechuga', 'pan-hamburguesa', 1),
  ('hamburguesa-de-pavo-en-pan-con-tomate-y-lechuga', 'tomate', 0.5),
  ('hamburguesa-de-pavo-en-pan-con-tomate-y-lechuga', 'lechuga', 25),
  ('hamburguesa-de-pavo-en-pan-con-tomate-y-lechuga', 'mostaza', 5),
  ('hamburguesa-de-pavo-en-pan-con-tomate-y-lechuga', 'aceite', 4),
  ('hamburguesa-de-garbanzos-con-papas-al-horno', 'garbanzos-hervidos', 150),
  ('hamburguesa-de-garbanzos-con-papas-al-horno', 'avena', 20),
  ('hamburguesa-de-garbanzos-con-papas-al-horno', 'cebolla', 0.5),
  ('hamburguesa-de-garbanzos-con-papas-al-horno', 'ajo', 0.5),
  ('hamburguesa-de-garbanzos-con-papas-al-horno', 'perejil', 4),
  ('hamburguesa-de-garbanzos-con-papas-al-horno', 'papa', 200),
  ('hamburguesa-de-garbanzos-con-papas-al-horno', 'aceite', 10),
  ('hamburguesa-de-cerdo-con-ensalada-de-repollo', 'picada-cerdo', 120),
  ('hamburguesa-de-cerdo-con-ensalada-de-repollo', 'cebolla', 0.5),
  ('hamburguesa-de-cerdo-con-ensalada-de-repollo', 'mostaza', 5),
  ('hamburguesa-de-cerdo-con-ensalada-de-repollo', 'repollo', 90),
  ('hamburguesa-de-cerdo-con-ensalada-de-repollo', 'zanahoria', 0.5),
  ('hamburguesa-de-cerdo-con-ensalada-de-repollo', 'aceite-oliva', 8),
  ('hamburguesa-de-cerdo-con-ensalada-de-repollo', 'limon-exprimido', 10),
  ('hamburguesa-de-cerdo-con-ensalada-de-repollo', 'aceite', 4),
  ('hamburguesa-de-merluza-con-papas-al-horno', 'merluza-cruda', 150),
  ('hamburguesa-de-merluza-con-papas-al-horno', 'papa-hervida', 50),
  ('hamburguesa-de-merluza-con-papas-al-horno', 'perejil', 4),
  ('hamburguesa-de-merluza-con-papas-al-horno', 'pan-rallado', 15),
  ('hamburguesa-de-merluza-con-papas-al-horno', 'huevo', 0.5),
  ('hamburguesa-de-merluza-con-papas-al-horno', 'papa', 200),
  ('hamburguesa-de-merluza-con-papas-al-horno', 'aceite', 10),
  ('hamburguesa-de-merluza-en-pan-con-tomate-y-lechuga', 'merluza-cruda', 150),
  ('hamburguesa-de-merluza-en-pan-con-tomate-y-lechuga', 'papa-hervida', 50),
  ('hamburguesa-de-merluza-en-pan-con-tomate-y-lechuga', 'perejil', 4),
  ('hamburguesa-de-merluza-en-pan-con-tomate-y-lechuga', 'pan-rallado', 15),
  ('hamburguesa-de-merluza-en-pan-con-tomate-y-lechuga', 'huevo', 0.5),
  ('hamburguesa-de-merluza-en-pan-con-tomate-y-lechuga', 'pan-hamburguesa', 1),
  ('hamburguesa-de-merluza-en-pan-con-tomate-y-lechuga', 'tomate', 0.5),
  ('hamburguesa-de-merluza-en-pan-con-tomate-y-lechuga', 'lechuga', 25),
  ('hamburguesa-de-merluza-en-pan-con-tomate-y-lechuga', 'mostaza', 5),
  ('hamburguesa-de-merluza-en-pan-con-tomate-y-lechuga', 'aceite', 4),
  ('hamburguesa-de-garbanzos-con-batatas-al-horno', 'garbanzos-hervidos', 150),
  ('hamburguesa-de-garbanzos-con-batatas-al-horno', 'avena', 20),
  ('hamburguesa-de-garbanzos-con-batatas-al-horno', 'cebolla', 0.5),
  ('hamburguesa-de-garbanzos-con-batatas-al-horno', 'ajo', 0.5),
  ('hamburguesa-de-garbanzos-con-batatas-al-horno', 'perejil', 4),
  ('hamburguesa-de-garbanzos-con-batatas-al-horno', 'batata', 200),
  ('hamburguesa-de-garbanzos-con-batatas-al-horno', 'aceite', 10),
  ('hamburguesa-de-cerdo-con-papas-al-horno', 'picada-cerdo', 120),
  ('hamburguesa-de-cerdo-con-papas-al-horno', 'cebolla', 0.5),
  ('hamburguesa-de-cerdo-con-papas-al-horno', 'mostaza', 5),
  ('hamburguesa-de-cerdo-con-papas-al-horno', 'papa', 200),
  ('hamburguesa-de-cerdo-con-papas-al-horno', 'aceite', 10),
  ('hamburguesa-de-cerdo-con-pure-de-papa', 'picada-cerdo', 120),
  ('hamburguesa-de-cerdo-con-pure-de-papa', 'cebolla', 0.5),
  ('hamburguesa-de-cerdo-con-pure-de-papa', 'mostaza', 5),
  ('hamburguesa-de-cerdo-con-pure-de-papa', 'papa', 200),
  ('hamburguesa-de-cerdo-con-pure-de-papa', 'leche', 40),
  ('hamburguesa-de-cerdo-con-pure-de-papa', 'manteca', 5),
  ('hamburguesa-de-cerdo-con-pure-de-papa', 'aceite', 4),
  ('hamburguesa-de-carne-con-arroz-y-zanahoria', 'carne-picada-magra', 130),
  ('hamburguesa-de-carne-con-arroz-y-zanahoria', 'cebolla', 0.5),
  ('hamburguesa-de-carne-con-arroz-y-zanahoria', 'perejil', 3),
  ('hamburguesa-de-carne-con-arroz-y-zanahoria', 'arroz', 60),
  ('hamburguesa-de-carne-con-arroz-y-zanahoria', 'zanahoria', 1),
  ('hamburguesa-de-carne-con-arroz-y-zanahoria', 'aceite', 4),
  ('hamburguesa-de-espinaca-y-ricota-con-pure-de-papa', 'espinaca', 80),
  ('hamburguesa-de-espinaca-y-ricota-con-pure-de-papa', 'ricota', 80),
  ('hamburguesa-de-espinaca-y-ricota-con-pure-de-papa', 'avena', 25),
  ('hamburguesa-de-espinaca-y-ricota-con-pure-de-papa', 'huevo', 0.5),
  ('hamburguesa-de-espinaca-y-ricota-con-pure-de-papa', 'queso-rallado', 10),
  ('hamburguesa-de-espinaca-y-ricota-con-pure-de-papa', 'papa', 200),
  ('hamburguesa-de-espinaca-y-ricota-con-pure-de-papa', 'leche', 40),
  ('hamburguesa-de-espinaca-y-ricota-con-pure-de-papa', 'manteca', 5),
  ('hamburguesa-de-espinaca-y-ricota-con-pure-de-papa', 'aceite', 4),
  ('hamburguesa-de-atun-con-vegetales-grillados', 'atun-natural', 1),
  ('hamburguesa-de-atun-con-vegetales-grillados', 'papa-hervida', 70),
  ('hamburguesa-de-atun-con-vegetales-grillados', 'huevo', 0.5),
  ('hamburguesa-de-atun-con-vegetales-grillados', 'perejil', 3),
  ('hamburguesa-de-atun-con-vegetales-grillados', 'pan-rallado', 10),
  ('hamburguesa-de-atun-con-vegetales-grillados', 'zapallito', 0.5),
  ('hamburguesa-de-atun-con-vegetales-grillados', 'berenjena', 0.5),
  ('hamburguesa-de-atun-con-vegetales-grillados', 'morron', 0.5),
  ('hamburguesa-de-atun-con-vegetales-grillados', 'aceite', 10),
  ('hamburguesa-de-garbanzos-con-ensalada-de-repollo', 'garbanzos-hervidos', 150),
  ('hamburguesa-de-garbanzos-con-ensalada-de-repollo', 'avena', 20),
  ('hamburguesa-de-garbanzos-con-ensalada-de-repollo', 'cebolla', 0.5),
  ('hamburguesa-de-garbanzos-con-ensalada-de-repollo', 'ajo', 0.5),
  ('hamburguesa-de-garbanzos-con-ensalada-de-repollo', 'perejil', 4),
  ('hamburguesa-de-garbanzos-con-ensalada-de-repollo', 'repollo', 90),
  ('hamburguesa-de-garbanzos-con-ensalada-de-repollo', 'zanahoria', 0.5),
  ('hamburguesa-de-garbanzos-con-ensalada-de-repollo', 'aceite-oliva', 8),
  ('hamburguesa-de-garbanzos-con-ensalada-de-repollo', 'limon-exprimido', 10),
  ('hamburguesa-de-garbanzos-con-ensalada-de-repollo', 'aceite', 4),
  ('hamburguesa-de-merluza-con-ensalada-de-lechuga-y-tomate', 'merluza-cruda', 150),
  ('hamburguesa-de-merluza-con-ensalada-de-lechuga-y-tomate', 'papa-hervida', 50),
  ('hamburguesa-de-merluza-con-ensalada-de-lechuga-y-tomate', 'perejil', 4),
  ('hamburguesa-de-merluza-con-ensalada-de-lechuga-y-tomate', 'pan-rallado', 15),
  ('hamburguesa-de-merluza-con-ensalada-de-lechuga-y-tomate', 'huevo', 0.5),
  ('hamburguesa-de-merluza-con-ensalada-de-lechuga-y-tomate', 'lechuga', 70),
  ('hamburguesa-de-merluza-con-ensalada-de-lechuga-y-tomate', 'tomate', 1),
  ('hamburguesa-de-merluza-con-ensalada-de-lechuga-y-tomate', 'aceite-oliva', 8),
  ('hamburguesa-de-merluza-con-ensalada-de-lechuga-y-tomate', 'aceite', 4),
  ('hamburguesa-de-pollo-con-papas-al-horno', 'picada-pollo', 140),
  ('hamburguesa-de-pollo-con-papas-al-horno', 'cebolla', 0.5),
  ('hamburguesa-de-pollo-con-papas-al-horno', 'ajo', 0.5),
  ('hamburguesa-de-pollo-con-papas-al-horno', 'perejil', 3),
  ('hamburguesa-de-pollo-con-papas-al-horno', 'papa', 200),
  ('hamburguesa-de-pollo-con-papas-al-horno', 'aceite', 10),
  ('hamburguesa-de-atun-con-papas-al-horno', 'atun-natural', 1),
  ('hamburguesa-de-atun-con-papas-al-horno', 'papa-hervida', 70),
  ('hamburguesa-de-atun-con-papas-al-horno', 'huevo', 0.5),
  ('hamburguesa-de-atun-con-papas-al-horno', 'perejil', 3),
  ('hamburguesa-de-atun-con-papas-al-horno', 'pan-rallado', 10),
  ('hamburguesa-de-atun-con-papas-al-horno', 'papa', 200),
  ('hamburguesa-de-atun-con-papas-al-horno', 'aceite', 10),
  ('hamburguesa-de-pavo-con-ensalada-de-lechuga-y-tomate', 'picada-pavo', 140),
  ('hamburguesa-de-pavo-con-ensalada-de-lechuga-y-tomate', 'cebolla', 0.5),
  ('hamburguesa-de-pavo-con-ensalada-de-lechuga-y-tomate', 'perejil', 3),
  ('hamburguesa-de-pavo-con-ensalada-de-lechuga-y-tomate', 'lechuga', 70),
  ('hamburguesa-de-pavo-con-ensalada-de-lechuga-y-tomate', 'tomate', 1),
  ('hamburguesa-de-pavo-con-ensalada-de-lechuga-y-tomate', 'aceite-oliva', 8),
  ('hamburguesa-de-pavo-con-ensalada-de-lechuga-y-tomate', 'aceite', 4),
  ('hamburguesa-de-pavo-con-arroz-y-zanahoria', 'picada-pavo', 140),
  ('hamburguesa-de-pavo-con-arroz-y-zanahoria', 'cebolla', 0.5),
  ('hamburguesa-de-pavo-con-arroz-y-zanahoria', 'perejil', 3),
  ('hamburguesa-de-pavo-con-arroz-y-zanahoria', 'arroz', 60),
  ('hamburguesa-de-pavo-con-arroz-y-zanahoria', 'zanahoria', 1),
  ('hamburguesa-de-pavo-con-arroz-y-zanahoria', 'aceite', 4),
  ('hamburguesa-de-pavo-con-batatas-al-horno', 'picada-pavo', 140),
  ('hamburguesa-de-pavo-con-batatas-al-horno', 'cebolla', 0.5),
  ('hamburguesa-de-pavo-con-batatas-al-horno', 'perejil', 3),
  ('hamburguesa-de-pavo-con-batatas-al-horno', 'batata', 200),
  ('hamburguesa-de-pavo-con-batatas-al-horno', 'aceite', 10),
  ('hamburguesa-de-espinaca-y-ricota-con-arroz-y-zanahoria', 'espinaca', 80),
  ('hamburguesa-de-espinaca-y-ricota-con-arroz-y-zanahoria', 'ricota', 80),
  ('hamburguesa-de-espinaca-y-ricota-con-arroz-y-zanahoria', 'avena', 25),
  ('hamburguesa-de-espinaca-y-ricota-con-arroz-y-zanahoria', 'huevo', 0.5),
  ('hamburguesa-de-espinaca-y-ricota-con-arroz-y-zanahoria', 'queso-rallado', 10),
  ('hamburguesa-de-espinaca-y-ricota-con-arroz-y-zanahoria', 'arroz', 60),
  ('hamburguesa-de-espinaca-y-ricota-con-arroz-y-zanahoria', 'zanahoria', 1),
  ('hamburguesa-de-espinaca-y-ricota-con-arroz-y-zanahoria', 'aceite', 4),
  ('hamburguesa-de-pollo-con-batatas-al-horno', 'picada-pollo', 140),
  ('hamburguesa-de-pollo-con-batatas-al-horno', 'cebolla', 0.5),
  ('hamburguesa-de-pollo-con-batatas-al-horno', 'ajo', 0.5),
  ('hamburguesa-de-pollo-con-batatas-al-horno', 'perejil', 3),
  ('hamburguesa-de-pollo-con-batatas-al-horno', 'batata', 200),
  ('hamburguesa-de-pollo-con-batatas-al-horno', 'aceite', 10),
  ('hamburguesa-de-espinaca-y-ricota-con-papas-al-horno', 'espinaca', 80),
  ('hamburguesa-de-espinaca-y-ricota-con-papas-al-horno', 'ricota', 80),
  ('hamburguesa-de-espinaca-y-ricota-con-papas-al-horno', 'avena', 25),
  ('hamburguesa-de-espinaca-y-ricota-con-papas-al-horno', 'huevo', 0.5),
  ('hamburguesa-de-espinaca-y-ricota-con-papas-al-horno', 'queso-rallado', 10),
  ('hamburguesa-de-espinaca-y-ricota-con-papas-al-horno', 'papa', 200),
  ('hamburguesa-de-espinaca-y-ricota-con-papas-al-horno', 'aceite', 10),
  ('hamburguesa-de-atun-con-pure-de-papa', 'atun-natural', 1),
  ('hamburguesa-de-atun-con-pure-de-papa', 'papa-hervida', 70),
  ('hamburguesa-de-atun-con-pure-de-papa', 'huevo', 0.5),
  ('hamburguesa-de-atun-con-pure-de-papa', 'perejil', 3),
  ('hamburguesa-de-atun-con-pure-de-papa', 'pan-rallado', 10),
  ('hamburguesa-de-atun-con-pure-de-papa', 'papa', 200),
  ('hamburguesa-de-atun-con-pure-de-papa', 'leche', 40),
  ('hamburguesa-de-atun-con-pure-de-papa', 'manteca', 5),
  ('hamburguesa-de-atun-con-pure-de-papa', 'aceite', 4),
  ('hamburguesa-de-lentejas-con-papas-al-horno', 'lentejas-hervidas', 150),
  ('hamburguesa-de-lentejas-con-papas-al-horno', 'avena', 20),
  ('hamburguesa-de-lentejas-con-papas-al-horno', 'zanahoria', 0.5),
  ('hamburguesa-de-lentejas-con-papas-al-horno', 'cebolla', 0.5),
  ('hamburguesa-de-lentejas-con-papas-al-horno', 'huevo', 0.5),
  ('hamburguesa-de-lentejas-con-papas-al-horno', 'papa', 200),
  ('hamburguesa-de-lentejas-con-papas-al-horno', 'aceite', 10),
  ('hamburguesa-de-lentejas-con-vegetales-grillados', 'lentejas-hervidas', 150),
  ('hamburguesa-de-lentejas-con-vegetales-grillados', 'avena', 20),
  ('hamburguesa-de-lentejas-con-vegetales-grillados', 'zanahoria', 0.5),
  ('hamburguesa-de-lentejas-con-vegetales-grillados', 'cebolla', 0.5),
  ('hamburguesa-de-lentejas-con-vegetales-grillados', 'huevo', 0.5),
  ('hamburguesa-de-lentejas-con-vegetales-grillados', 'zapallito', 0.5),
  ('hamburguesa-de-lentejas-con-vegetales-grillados', 'berenjena', 0.5),
  ('hamburguesa-de-lentejas-con-vegetales-grillados', 'morron', 0.5),
  ('hamburguesa-de-lentejas-con-vegetales-grillados', 'aceite', 10),
  ('hamburguesa-de-espinaca-y-ricota-con-batatas-al-horno', 'espinaca', 80),
  ('hamburguesa-de-espinaca-y-ricota-con-batatas-al-horno', 'ricota', 80),
  ('hamburguesa-de-espinaca-y-ricota-con-batatas-al-horno', 'avena', 25),
  ('hamburguesa-de-espinaca-y-ricota-con-batatas-al-horno', 'huevo', 0.5),
  ('hamburguesa-de-espinaca-y-ricota-con-batatas-al-horno', 'queso-rallado', 10),
  ('hamburguesa-de-espinaca-y-ricota-con-batatas-al-horno', 'batata', 200),
  ('hamburguesa-de-espinaca-y-ricota-con-batatas-al-horno', 'aceite', 10),
  ('hamburguesa-de-carne-con-vegetales-grillados', 'carne-picada-magra', 130),
  ('hamburguesa-de-carne-con-vegetales-grillados', 'cebolla', 0.5),
  ('hamburguesa-de-carne-con-vegetales-grillados', 'perejil', 3),
  ('hamburguesa-de-carne-con-vegetales-grillados', 'zapallito', 0.5),
  ('hamburguesa-de-carne-con-vegetales-grillados', 'berenjena', 0.5),
  ('hamburguesa-de-carne-con-vegetales-grillados', 'morron', 0.5),
  ('hamburguesa-de-carne-con-vegetales-grillados', 'aceite', 10),
  ('hamburguesa-de-merluza-con-vegetales-grillados', 'merluza-cruda', 150),
  ('hamburguesa-de-merluza-con-vegetales-grillados', 'papa-hervida', 50),
  ('hamburguesa-de-merluza-con-vegetales-grillados', 'perejil', 4),
  ('hamburguesa-de-merluza-con-vegetales-grillados', 'pan-rallado', 15),
  ('hamburguesa-de-merluza-con-vegetales-grillados', 'huevo', 0.5),
  ('hamburguesa-de-merluza-con-vegetales-grillados', 'zapallito', 0.5),
  ('hamburguesa-de-merluza-con-vegetales-grillados', 'berenjena', 0.5),
  ('hamburguesa-de-merluza-con-vegetales-grillados', 'morron', 0.5),
  ('hamburguesa-de-merluza-con-vegetales-grillados', 'aceite', 10),
  ('hamburguesa-de-pavo-con-pure-de-papa', 'picada-pavo', 140),
  ('hamburguesa-de-pavo-con-pure-de-papa', 'cebolla', 0.5),
  ('hamburguesa-de-pavo-con-pure-de-papa', 'perejil', 3),
  ('hamburguesa-de-pavo-con-pure-de-papa', 'papa', 200),
  ('hamburguesa-de-pavo-con-pure-de-papa', 'leche', 40),
  ('hamburguesa-de-pavo-con-pure-de-papa', 'manteca', 5),
  ('hamburguesa-de-pavo-con-pure-de-papa', 'aceite', 4),
  ('hamburguesa-de-espinaca-y-ricota-con-ensalada-de-repollo', 'espinaca', 80),
  ('hamburguesa-de-espinaca-y-ricota-con-ensalada-de-repollo', 'ricota', 80),
  ('hamburguesa-de-espinaca-y-ricota-con-ensalada-de-repollo', 'avena', 25),
  ('hamburguesa-de-espinaca-y-ricota-con-ensalada-de-repollo', 'huevo', 0.5),
  ('hamburguesa-de-espinaca-y-ricota-con-ensalada-de-repollo', 'queso-rallado', 10),
  ('hamburguesa-de-espinaca-y-ricota-con-ensalada-de-repollo', 'repollo', 90),
  ('hamburguesa-de-espinaca-y-ricota-con-ensalada-de-repollo', 'zanahoria', 0.5),
  ('hamburguesa-de-espinaca-y-ricota-con-ensalada-de-repollo', 'aceite-oliva', 8),
  ('hamburguesa-de-espinaca-y-ricota-con-ensalada-de-repollo', 'limon-exprimido', 10),
  ('hamburguesa-de-espinaca-y-ricota-con-ensalada-de-repollo', 'aceite', 4),
  ('hamburguesa-de-garbanzos-con-ensalada-de-lechuga-y', 'garbanzos-hervidos', 150),
  ('hamburguesa-de-garbanzos-con-ensalada-de-lechuga-y', 'avena', 20),
  ('hamburguesa-de-garbanzos-con-ensalada-de-lechuga-y', 'cebolla', 0.5),
  ('hamburguesa-de-garbanzos-con-ensalada-de-lechuga-y', 'ajo', 0.5),
  ('hamburguesa-de-garbanzos-con-ensalada-de-lechuga-y', 'perejil', 4),
  ('hamburguesa-de-garbanzos-con-ensalada-de-lechuga-y', 'lechuga', 70),
  ('hamburguesa-de-garbanzos-con-ensalada-de-lechuga-y', 'tomate', 1),
  ('hamburguesa-de-garbanzos-con-ensalada-de-lechuga-y', 'aceite-oliva', 8),
  ('hamburguesa-de-garbanzos-con-ensalada-de-lechuga-y', 'aceite', 4),
  ('hamburguesa-de-pollo-con-vegetales-grillados', 'picada-pollo', 140),
  ('hamburguesa-de-pollo-con-vegetales-grillados', 'cebolla', 0.5),
  ('hamburguesa-de-pollo-con-vegetales-grillados', 'ajo', 0.5),
  ('hamburguesa-de-pollo-con-vegetales-grillados', 'perejil', 3),
  ('hamburguesa-de-pollo-con-vegetales-grillados', 'zapallito', 0.5),
  ('hamburguesa-de-pollo-con-vegetales-grillados', 'berenjena', 0.5),
  ('hamburguesa-de-pollo-con-vegetales-grillados', 'morron', 0.5),
  ('hamburguesa-de-pollo-con-vegetales-grillados', 'aceite', 10),
  ('hamburguesa-de-garbanzos-con-arroz-y-zanahoria', 'garbanzos-hervidos', 150),
  ('hamburguesa-de-garbanzos-con-arroz-y-zanahoria', 'avena', 20),
  ('hamburguesa-de-garbanzos-con-arroz-y-zanahoria', 'cebolla', 0.5),
  ('hamburguesa-de-garbanzos-con-arroz-y-zanahoria', 'ajo', 0.5),
  ('hamburguesa-de-garbanzos-con-arroz-y-zanahoria', 'perejil', 4),
  ('hamburguesa-de-garbanzos-con-arroz-y-zanahoria', 'arroz', 60),
  ('hamburguesa-de-garbanzos-con-arroz-y-zanahoria', 'zanahoria', 1),
  ('hamburguesa-de-garbanzos-con-arroz-y-zanahoria', 'aceite', 4),
  ('hamburguesa-de-pollo-en-pan-con-tomate-y-lechuga', 'picada-pollo', 140),
  ('hamburguesa-de-pollo-en-pan-con-tomate-y-lechuga', 'cebolla', 0.5),
  ('hamburguesa-de-pollo-en-pan-con-tomate-y-lechuga', 'ajo', 0.5),
  ('hamburguesa-de-pollo-en-pan-con-tomate-y-lechuga', 'perejil', 3),
  ('hamburguesa-de-pollo-en-pan-con-tomate-y-lechuga', 'pan-hamburguesa', 1),
  ('hamburguesa-de-pollo-en-pan-con-tomate-y-lechuga', 'tomate', 0.5),
  ('hamburguesa-de-pollo-en-pan-con-tomate-y-lechuga', 'lechuga', 25),
  ('hamburguesa-de-pollo-en-pan-con-tomate-y-lechuga', 'mostaza', 5),
  ('hamburguesa-de-pollo-en-pan-con-tomate-y-lechuga', 'aceite', 4),
  ('hamburguesa-de-carne-con-ensalada-de-lechuga-y-tomate', 'carne-picada-magra', 130),
  ('hamburguesa-de-carne-con-ensalada-de-lechuga-y-tomate', 'cebolla', 0.5),
  ('hamburguesa-de-carne-con-ensalada-de-lechuga-y-tomate', 'perejil', 3),
  ('hamburguesa-de-carne-con-ensalada-de-lechuga-y-tomate', 'lechuga', 70),
  ('hamburguesa-de-carne-con-ensalada-de-lechuga-y-tomate', 'tomate', 1),
  ('hamburguesa-de-carne-con-ensalada-de-lechuga-y-tomate', 'aceite-oliva', 8),
  ('hamburguesa-de-carne-con-ensalada-de-lechuga-y-tomate', 'aceite', 4),
  ('hamburguesa-de-garbanzos-con-pure-de-papa', 'garbanzos-hervidos', 150),
  ('hamburguesa-de-garbanzos-con-pure-de-papa', 'avena', 20),
  ('hamburguesa-de-garbanzos-con-pure-de-papa', 'cebolla', 0.5),
  ('hamburguesa-de-garbanzos-con-pure-de-papa', 'ajo', 0.5),
  ('hamburguesa-de-garbanzos-con-pure-de-papa', 'perejil', 4),
  ('hamburguesa-de-garbanzos-con-pure-de-papa', 'papa', 200),
  ('hamburguesa-de-garbanzos-con-pure-de-papa', 'leche', 40),
  ('hamburguesa-de-garbanzos-con-pure-de-papa', 'manteca', 5),
  ('hamburguesa-de-garbanzos-con-pure-de-papa', 'aceite', 4),
  ('hamburguesa-de-cerdo-con-vegetales-grillados', 'picada-cerdo', 120),
  ('hamburguesa-de-cerdo-con-vegetales-grillados', 'cebolla', 0.5),
  ('hamburguesa-de-cerdo-con-vegetales-grillados', 'mostaza', 5),
  ('hamburguesa-de-cerdo-con-vegetales-grillados', 'zapallito', 0.5),
  ('hamburguesa-de-cerdo-con-vegetales-grillados', 'berenjena', 0.5),
  ('hamburguesa-de-cerdo-con-vegetales-grillados', 'morron', 0.5),
  ('hamburguesa-de-cerdo-con-vegetales-grillados', 'aceite', 10),
  ('hamburguesa-de-garbanzos-en-pan-con-tomate-y-lechuga', 'garbanzos-hervidos', 150),
  ('hamburguesa-de-garbanzos-en-pan-con-tomate-y-lechuga', 'avena', 20),
  ('hamburguesa-de-garbanzos-en-pan-con-tomate-y-lechuga', 'cebolla', 0.5),
  ('hamburguesa-de-garbanzos-en-pan-con-tomate-y-lechuga', 'ajo', 0.5),
  ('hamburguesa-de-garbanzos-en-pan-con-tomate-y-lechuga', 'perejil', 4),
  ('hamburguesa-de-garbanzos-en-pan-con-tomate-y-lechuga', 'pan-hamburguesa', 1),
  ('hamburguesa-de-garbanzos-en-pan-con-tomate-y-lechuga', 'tomate', 0.5),
  ('hamburguesa-de-garbanzos-en-pan-con-tomate-y-lechuga', 'lechuga', 25),
  ('hamburguesa-de-garbanzos-en-pan-con-tomate-y-lechuga', 'mostaza', 5),
  ('hamburguesa-de-garbanzos-en-pan-con-tomate-y-lechuga', 'aceite', 4),
  ('hamburguesa-de-pollo-con-ensalada-de-repollo', 'picada-pollo', 140),
  ('hamburguesa-de-pollo-con-ensalada-de-repollo', 'cebolla', 0.5),
  ('hamburguesa-de-pollo-con-ensalada-de-repollo', 'ajo', 0.5),
  ('hamburguesa-de-pollo-con-ensalada-de-repollo', 'perejil', 3),
  ('hamburguesa-de-pollo-con-ensalada-de-repollo', 'repollo', 90),
  ('hamburguesa-de-pollo-con-ensalada-de-repollo', 'zanahoria', 0.5),
  ('hamburguesa-de-pollo-con-ensalada-de-repollo', 'aceite-oliva', 8),
  ('hamburguesa-de-pollo-con-ensalada-de-repollo', 'limon-exprimido', 10),
  ('hamburguesa-de-pollo-con-ensalada-de-repollo', 'aceite', 4),
  ('hamburguesa-de-calabaza-y-queso-con-pure-de-papa', 'calabaza', 120),
  ('hamburguesa-de-calabaza-y-queso-con-pure-de-papa', 'avena', 30),
  ('hamburguesa-de-calabaza-y-queso-con-pure-de-papa', 'queso-cremoso', 30),
  ('hamburguesa-de-calabaza-y-queso-con-pure-de-papa', 'cebolla', 0.5),
  ('hamburguesa-de-calabaza-y-queso-con-pure-de-papa', 'papa', 200),
  ('hamburguesa-de-calabaza-y-queso-con-pure-de-papa', 'leche', 40),
  ('hamburguesa-de-calabaza-y-queso-con-pure-de-papa', 'manteca', 5),
  ('hamburguesa-de-calabaza-y-queso-con-pure-de-papa', 'aceite', 4),
  ('hamburguesa-de-merluza-con-ensalada-de-repollo', 'merluza-cruda', 150),
  ('hamburguesa-de-merluza-con-ensalada-de-repollo', 'papa-hervida', 50),
  ('hamburguesa-de-merluza-con-ensalada-de-repollo', 'perejil', 4),
  ('hamburguesa-de-merluza-con-ensalada-de-repollo', 'pan-rallado', 15),
  ('hamburguesa-de-merluza-con-ensalada-de-repollo', 'huevo', 0.5),
  ('hamburguesa-de-merluza-con-ensalada-de-repollo', 'repollo', 90),
  ('hamburguesa-de-merluza-con-ensalada-de-repollo', 'zanahoria', 0.5),
  ('hamburguesa-de-merluza-con-ensalada-de-repollo', 'aceite-oliva', 8),
  ('hamburguesa-de-merluza-con-ensalada-de-repollo', 'limon-exprimido', 10),
  ('hamburguesa-de-merluza-con-ensalada-de-repollo', 'aceite', 4),
  ('hamburguesa-de-pollo-con-arroz-y-zanahoria', 'picada-pollo', 140),
  ('hamburguesa-de-pollo-con-arroz-y-zanahoria', 'cebolla', 0.5),
  ('hamburguesa-de-pollo-con-arroz-y-zanahoria', 'ajo', 0.5),
  ('hamburguesa-de-pollo-con-arroz-y-zanahoria', 'perejil', 3),
  ('hamburguesa-de-pollo-con-arroz-y-zanahoria', 'arroz', 60),
  ('hamburguesa-de-pollo-con-arroz-y-zanahoria', 'zanahoria', 1),
  ('hamburguesa-de-pollo-con-arroz-y-zanahoria', 'aceite', 4),
  ('hamburguesa-de-carne-con-batatas-al-horno', 'carne-picada-magra', 130),
  ('hamburguesa-de-carne-con-batatas-al-horno', 'cebolla', 0.5),
  ('hamburguesa-de-carne-con-batatas-al-horno', 'perejil', 3),
  ('hamburguesa-de-carne-con-batatas-al-horno', 'batata', 200),
  ('hamburguesa-de-carne-con-batatas-al-horno', 'aceite', 10),
  ('hamburguesa-de-lentejas-con-ensalada-de-lechuga-y-tomate', 'lentejas-hervidas', 150),
  ('hamburguesa-de-lentejas-con-ensalada-de-lechuga-y-tomate', 'avena', 20),
  ('hamburguesa-de-lentejas-con-ensalada-de-lechuga-y-tomate', 'zanahoria', 0.5),
  ('hamburguesa-de-lentejas-con-ensalada-de-lechuga-y-tomate', 'cebolla', 0.5),
  ('hamburguesa-de-lentejas-con-ensalada-de-lechuga-y-tomate', 'huevo', 0.5),
  ('hamburguesa-de-lentejas-con-ensalada-de-lechuga-y-tomate', 'lechuga', 70),
  ('hamburguesa-de-lentejas-con-ensalada-de-lechuga-y-tomate', 'tomate', 1),
  ('hamburguesa-de-lentejas-con-ensalada-de-lechuga-y-tomate', 'aceite-oliva', 8),
  ('hamburguesa-de-lentejas-con-ensalada-de-lechuga-y-tomate', 'aceite', 4),
  ('hamburguesa-de-cerdo-con-arroz-y-zanahoria', 'picada-cerdo', 120),
  ('hamburguesa-de-cerdo-con-arroz-y-zanahoria', 'cebolla', 0.5),
  ('hamburguesa-de-cerdo-con-arroz-y-zanahoria', 'mostaza', 5),
  ('hamburguesa-de-cerdo-con-arroz-y-zanahoria', 'arroz', 60),
  ('hamburguesa-de-cerdo-con-arroz-y-zanahoria', 'zanahoria', 1),
  ('hamburguesa-de-cerdo-con-arroz-y-zanahoria', 'aceite', 4),
  ('hamburguesa-de-calabaza-y-queso-con-arroz-y-zanahoria', 'calabaza', 120),
  ('hamburguesa-de-calabaza-y-queso-con-arroz-y-zanahoria', 'avena', 30),
  ('hamburguesa-de-calabaza-y-queso-con-arroz-y-zanahoria', 'queso-cremoso', 30),
  ('hamburguesa-de-calabaza-y-queso-con-arroz-y-zanahoria', 'cebolla', 0.5),
  ('hamburguesa-de-calabaza-y-queso-con-arroz-y-zanahoria', 'arroz', 60),
  ('hamburguesa-de-calabaza-y-queso-con-arroz-y-zanahoria', 'zanahoria', 1),
  ('hamburguesa-de-calabaza-y-queso-con-arroz-y-zanahoria', 'aceite', 4),
  ('hamburguesa-de-lentejas-con-batatas-al-horno', 'lentejas-hervidas', 150),
  ('hamburguesa-de-lentejas-con-batatas-al-horno', 'avena', 20),
  ('hamburguesa-de-lentejas-con-batatas-al-horno', 'zanahoria', 0.5),
  ('hamburguesa-de-lentejas-con-batatas-al-horno', 'cebolla', 0.5),
  ('hamburguesa-de-lentejas-con-batatas-al-horno', 'huevo', 0.5),
  ('hamburguesa-de-lentejas-con-batatas-al-horno', 'batata', 200),
  ('hamburguesa-de-lentejas-con-batatas-al-horno', 'aceite', 10),
  ('hamburguesa-de-atun-con-ensalada-de-lechuga-y-tomate', 'atun-natural', 1),
  ('hamburguesa-de-atun-con-ensalada-de-lechuga-y-tomate', 'papa-hervida', 70),
  ('hamburguesa-de-atun-con-ensalada-de-lechuga-y-tomate', 'huevo', 0.5),
  ('hamburguesa-de-atun-con-ensalada-de-lechuga-y-tomate', 'perejil', 3),
  ('hamburguesa-de-atun-con-ensalada-de-lechuga-y-tomate', 'pan-rallado', 10),
  ('hamburguesa-de-atun-con-ensalada-de-lechuga-y-tomate', 'lechuga', 70),
  ('hamburguesa-de-atun-con-ensalada-de-lechuga-y-tomate', 'tomate', 1),
  ('hamburguesa-de-atun-con-ensalada-de-lechuga-y-tomate', 'aceite-oliva', 8),
  ('hamburguesa-de-atun-con-ensalada-de-lechuga-y-tomate', 'aceite', 4),
  ('hamburguesa-de-atun-con-batatas-al-horno', 'atun-natural', 1),
  ('hamburguesa-de-atun-con-batatas-al-horno', 'papa-hervida', 70),
  ('hamburguesa-de-atun-con-batatas-al-horno', 'huevo', 0.5),
  ('hamburguesa-de-atun-con-batatas-al-horno', 'perejil', 3),
  ('hamburguesa-de-atun-con-batatas-al-horno', 'pan-rallado', 10),
  ('hamburguesa-de-atun-con-batatas-al-horno', 'batata', 200),
  ('hamburguesa-de-atun-con-batatas-al-horno', 'aceite', 10),
  ('hamburguesa-de-espinaca-y-ricota-en-pan-con-tomate-y', 'espinaca', 80),
  ('hamburguesa-de-espinaca-y-ricota-en-pan-con-tomate-y', 'ricota', 80),
  ('hamburguesa-de-espinaca-y-ricota-en-pan-con-tomate-y', 'avena', 25),
  ('hamburguesa-de-espinaca-y-ricota-en-pan-con-tomate-y', 'huevo', 0.5),
  ('hamburguesa-de-espinaca-y-ricota-en-pan-con-tomate-y', 'queso-rallado', 10),
  ('hamburguesa-de-espinaca-y-ricota-en-pan-con-tomate-y', 'pan-hamburguesa', 1),
  ('hamburguesa-de-espinaca-y-ricota-en-pan-con-tomate-y', 'tomate', 0.5),
  ('hamburguesa-de-espinaca-y-ricota-en-pan-con-tomate-y', 'lechuga', 25),
  ('hamburguesa-de-espinaca-y-ricota-en-pan-con-tomate-y', 'mostaza', 5),
  ('hamburguesa-de-espinaca-y-ricota-en-pan-con-tomate-y', 'aceite', 4),
  ('hamburguesa-de-merluza-con-batatas-al-horno', 'merluza-cruda', 150),
  ('hamburguesa-de-merluza-con-batatas-al-horno', 'papa-hervida', 50),
  ('hamburguesa-de-merluza-con-batatas-al-horno', 'perejil', 4),
  ('hamburguesa-de-merluza-con-batatas-al-horno', 'pan-rallado', 15),
  ('hamburguesa-de-merluza-con-batatas-al-horno', 'huevo', 0.5),
  ('hamburguesa-de-merluza-con-batatas-al-horno', 'batata', 200),
  ('hamburguesa-de-merluza-con-batatas-al-horno', 'aceite', 10),
  ('hamburguesa-de-carne-con-ensalada-de-repollo', 'carne-picada-magra', 130),
  ('hamburguesa-de-carne-con-ensalada-de-repollo', 'cebolla', 0.5),
  ('hamburguesa-de-carne-con-ensalada-de-repollo', 'perejil', 3),
  ('hamburguesa-de-carne-con-ensalada-de-repollo', 'repollo', 90),
  ('hamburguesa-de-carne-con-ensalada-de-repollo', 'zanahoria', 0.5),
  ('hamburguesa-de-carne-con-ensalada-de-repollo', 'aceite-oliva', 8),
  ('hamburguesa-de-carne-con-ensalada-de-repollo', 'limon-exprimido', 10),
  ('hamburguesa-de-carne-con-ensalada-de-repollo', 'aceite', 4),
  ('hamburguesa-de-merluza-con-arroz-y-zanahoria', 'merluza-cruda', 150),
  ('hamburguesa-de-merluza-con-arroz-y-zanahoria', 'papa-hervida', 50),
  ('hamburguesa-de-merluza-con-arroz-y-zanahoria', 'perejil', 4),
  ('hamburguesa-de-merluza-con-arroz-y-zanahoria', 'pan-rallado', 15),
  ('hamburguesa-de-merluza-con-arroz-y-zanahoria', 'huevo', 0.5),
  ('hamburguesa-de-merluza-con-arroz-y-zanahoria', 'arroz', 60),
  ('hamburguesa-de-merluza-con-arroz-y-zanahoria', 'zanahoria', 1),
  ('hamburguesa-de-merluza-con-arroz-y-zanahoria', 'aceite', 4),
  ('hamburguesa-de-carne-en-pan-con-tomate-y-lechuga', 'carne-picada-magra', 130),
  ('hamburguesa-de-carne-en-pan-con-tomate-y-lechuga', 'cebolla', 0.5),
  ('hamburguesa-de-carne-en-pan-con-tomate-y-lechuga', 'perejil', 3),
  ('hamburguesa-de-carne-en-pan-con-tomate-y-lechuga', 'pan-hamburguesa', 1),
  ('hamburguesa-de-carne-en-pan-con-tomate-y-lechuga', 'tomate', 0.5),
  ('hamburguesa-de-carne-en-pan-con-tomate-y-lechuga', 'lechuga', 25),
  ('hamburguesa-de-carne-en-pan-con-tomate-y-lechuga', 'mostaza', 5),
  ('hamburguesa-de-carne-en-pan-con-tomate-y-lechuga', 'aceite', 4),
  ('hamburguesa-de-atun-con-arroz-y-zanahoria', 'atun-natural', 1),
  ('hamburguesa-de-atun-con-arroz-y-zanahoria', 'papa-hervida', 70),
  ('hamburguesa-de-atun-con-arroz-y-zanahoria', 'huevo', 0.5),
  ('hamburguesa-de-atun-con-arroz-y-zanahoria', 'perejil', 3),
  ('hamburguesa-de-atun-con-arroz-y-zanahoria', 'pan-rallado', 10),
  ('hamburguesa-de-atun-con-arroz-y-zanahoria', 'arroz', 60),
  ('hamburguesa-de-atun-con-arroz-y-zanahoria', 'zanahoria', 1),
  ('hamburguesa-de-atun-con-arroz-y-zanahoria', 'aceite', 4),
  ('hamburguesa-de-espinaca-y-ricota-con-ensalada-de', 'espinaca', 80),
  ('hamburguesa-de-espinaca-y-ricota-con-ensalada-de', 'ricota', 80),
  ('hamburguesa-de-espinaca-y-ricota-con-ensalada-de', 'avena', 25),
  ('hamburguesa-de-espinaca-y-ricota-con-ensalada-de', 'huevo', 0.5),
  ('hamburguesa-de-espinaca-y-ricota-con-ensalada-de', 'queso-rallado', 10),
  ('hamburguesa-de-espinaca-y-ricota-con-ensalada-de', 'lechuga', 70),
  ('hamburguesa-de-espinaca-y-ricota-con-ensalada-de', 'tomate', 1),
  ('hamburguesa-de-espinaca-y-ricota-con-ensalada-de', 'aceite-oliva', 8),
  ('hamburguesa-de-espinaca-y-ricota-con-ensalada-de', 'aceite', 4),
  ('hamburguesa-de-merluza-con-pure-de-papa', 'merluza-cruda', 150),
  ('hamburguesa-de-merluza-con-pure-de-papa', 'papa-hervida', 50),
  ('hamburguesa-de-merluza-con-pure-de-papa', 'perejil', 4),
  ('hamburguesa-de-merluza-con-pure-de-papa', 'pan-rallado', 15),
  ('hamburguesa-de-merluza-con-pure-de-papa', 'huevo', 0.5),
  ('hamburguesa-de-merluza-con-pure-de-papa', 'papa', 200),
  ('hamburguesa-de-merluza-con-pure-de-papa', 'leche', 40),
  ('hamburguesa-de-merluza-con-pure-de-papa', 'manteca', 5),
  ('hamburguesa-de-merluza-con-pure-de-papa', 'aceite', 4),
  ('hamburguesa-de-cerdo-en-pan-con-tomate-y-lechuga', 'picada-cerdo', 120),
  ('hamburguesa-de-cerdo-en-pan-con-tomate-y-lechuga', 'cebolla', 0.5),
  ('hamburguesa-de-cerdo-en-pan-con-tomate-y-lechuga', 'mostaza', 10),
  ('hamburguesa-de-cerdo-en-pan-con-tomate-y-lechuga', 'pan-hamburguesa', 1),
  ('hamburguesa-de-cerdo-en-pan-con-tomate-y-lechuga', 'tomate', 0.5),
  ('hamburguesa-de-cerdo-en-pan-con-tomate-y-lechuga', 'lechuga', 25),
  ('hamburguesa-de-cerdo-en-pan-con-tomate-y-lechuga', 'aceite', 4),
  ('hamburguesa-de-carne-con-papas-al-horno', 'carne-picada-magra', 130),
  ('hamburguesa-de-carne-con-papas-al-horno', 'cebolla', 0.5),
  ('hamburguesa-de-carne-con-papas-al-horno', 'perejil', 3),
  ('hamburguesa-de-carne-con-papas-al-horno', 'papa', 200),
  ('hamburguesa-de-carne-con-papas-al-horno', 'aceite', 10),
  ('hamburguesa-de-garbanzos-con-vegetales-grillados', 'garbanzos-hervidos', 150),
  ('hamburguesa-de-garbanzos-con-vegetales-grillados', 'avena', 20),
  ('hamburguesa-de-garbanzos-con-vegetales-grillados', 'cebolla', 0.5),
  ('hamburguesa-de-garbanzos-con-vegetales-grillados', 'ajo', 0.5),
  ('hamburguesa-de-garbanzos-con-vegetales-grillados', 'perejil', 4),
  ('hamburguesa-de-garbanzos-con-vegetales-grillados', 'zapallito', 0.5),
  ('hamburguesa-de-garbanzos-con-vegetales-grillados', 'berenjena', 0.5),
  ('hamburguesa-de-garbanzos-con-vegetales-grillados', 'morron', 0.5),
  ('hamburguesa-de-garbanzos-con-vegetales-grillados', 'aceite', 10),
  ('milanesa-de-cerdo-al-horno-con-ensalada-de-repollo-y', 'lomo-cerdo', 150),
  ('milanesa-de-cerdo-al-horno-con-ensalada-de-repollo-y', 'huevo', 1),
  ('milanesa-de-cerdo-al-horno-con-ensalada-de-repollo-y', 'pan-rallado', 30),
  ('milanesa-de-cerdo-al-horno-con-ensalada-de-repollo-y', 'aceite', 6),
  ('milanesa-de-cerdo-al-horno-con-ensalada-de-repollo-y', 'repollo', 90),
  ('milanesa-de-cerdo-al-horno-con-ensalada-de-repollo-y', 'zanahoria', 1),
  ('milanesa-de-cerdo-al-horno-con-ensalada-de-repollo-y', 'aceite-oliva', 8),
  ('milanesa-de-cerdo-al-horno-con-ensalada-de-repollo-y', 'limon-exprimido', 10),
  ('milanesa-de-cerdo-al-horno-con-pure-de-papa', 'lomo-cerdo', 150),
  ('milanesa-de-cerdo-al-horno-con-pure-de-papa', 'huevo', 1),
  ('milanesa-de-cerdo-al-horno-con-pure-de-papa', 'pan-rallado', 30),
  ('milanesa-de-cerdo-al-horno-con-pure-de-papa', 'aceite', 6),
  ('milanesa-de-cerdo-al-horno-con-pure-de-papa', 'papa', 200),
  ('milanesa-de-cerdo-al-horno-con-pure-de-papa', 'leche', 40),
  ('milanesa-de-cerdo-al-horno-con-pure-de-papa', 'manteca', 5),
  ('milanesa-de-cerdo-al-horno-con-arroz', 'lomo-cerdo', 150),
  ('milanesa-de-cerdo-al-horno-con-arroz', 'huevo', 1),
  ('milanesa-de-cerdo-al-horno-con-arroz', 'pan-rallado', 30),
  ('milanesa-de-cerdo-al-horno-con-arroz', 'aceite', 6),
  ('milanesa-de-cerdo-al-horno-con-arroz', 'arroz', 60),
  ('milanesa-de-pavo-al-horno-con-ensalada-de-repollo-y', 'pechuga-pavo', 150),
  ('milanesa-de-pavo-al-horno-con-ensalada-de-repollo-y', 'huevo', 1),
  ('milanesa-de-pavo-al-horno-con-ensalada-de-repollo-y', 'pan-rallado', 30),
  ('milanesa-de-pavo-al-horno-con-ensalada-de-repollo-y', 'aceite', 6),
  ('milanesa-de-pavo-al-horno-con-ensalada-de-repollo-y', 'repollo', 90),
  ('milanesa-de-pavo-al-horno-con-ensalada-de-repollo-y', 'zanahoria', 1),
  ('milanesa-de-pavo-al-horno-con-ensalada-de-repollo-y', 'aceite-oliva', 8),
  ('milanesa-de-pavo-al-horno-con-ensalada-de-repollo-y', 'limon-exprimido', 10),
  ('milanesa-de-coliflor-al-horno-con-ensalada-mixta', 'coliflor', 200),
  ('milanesa-de-coliflor-al-horno-con-ensalada-mixta', 'huevo', 1),
  ('milanesa-de-coliflor-al-horno-con-ensalada-mixta', 'pan-rallado', 30),
  ('milanesa-de-coliflor-al-horno-con-ensalada-mixta', 'aceite', 6),
  ('milanesa-de-coliflor-al-horno-con-ensalada-mixta', 'lechuga', 70),
  ('milanesa-de-coliflor-al-horno-con-ensalada-mixta', 'tomate', 1),
  ('milanesa-de-coliflor-al-horno-con-ensalada-mixta', 'cebolla-morada', 0.5),
  ('milanesa-de-coliflor-al-horno-con-ensalada-mixta', 'aceite-oliva', 8),
  ('milanesa-de-pavo-al-horno-con-pure-de-calabaza', 'pechuga-pavo', 150),
  ('milanesa-de-pavo-al-horno-con-pure-de-calabaza', 'huevo', 1),
  ('milanesa-de-pavo-al-horno-con-pure-de-calabaza', 'pan-rallado', 30),
  ('milanesa-de-pavo-al-horno-con-pure-de-calabaza', 'aceite', 6),
  ('milanesa-de-pavo-al-horno-con-pure-de-calabaza', 'calabaza', 220),
  ('milanesa-de-pavo-al-horno-con-pure-de-calabaza', 'manteca', 5),
  ('milanesa-de-calabaza-al-horno-con-papas-al-horno', 'calabaza', 200),
  ('milanesa-de-calabaza-al-horno-con-papas-al-horno', 'huevo', 1),
  ('milanesa-de-calabaza-al-horno-con-papas-al-horno', 'pan-rallado', 30),
  ('milanesa-de-calabaza-al-horno-con-papas-al-horno', 'aceite', 15),
  ('milanesa-de-calabaza-al-horno-con-papas-al-horno', 'papa', 200),
  ('milanesa-de-pavo-al-horno-con-arroz', 'pechuga-pavo', 150),
  ('milanesa-de-pavo-al-horno-con-arroz', 'huevo', 1),
  ('milanesa-de-pavo-al-horno-con-arroz', 'pan-rallado', 30),
  ('milanesa-de-pavo-al-horno-con-arroz', 'aceite', 6),
  ('milanesa-de-pavo-al-horno-con-arroz', 'arroz', 60),
  ('milanesa-de-berenjena-al-horno-con-batatas-al-horno', 'berenjena', 0.5),
  ('milanesa-de-berenjena-al-horno-con-batatas-al-horno', 'huevo', 1),
  ('milanesa-de-berenjena-al-horno-con-batatas-al-horno', 'pan-rallado', 30),
  ('milanesa-de-berenjena-al-horno-con-batatas-al-horno', 'aceite', 10),
  ('milanesa-de-berenjena-al-horno-con-batatas-al-horno', 'batata', 200),
  ('milanesa-de-nalga-al-horno-con-ensalada-de-repollo-y', 'bife-nalga', 150),
  ('milanesa-de-nalga-al-horno-con-ensalada-de-repollo-y', 'huevo', 1),
  ('milanesa-de-nalga-al-horno-con-ensalada-de-repollo-y', 'pan-rallado', 30),
  ('milanesa-de-nalga-al-horno-con-ensalada-de-repollo-y', 'aceite', 6),
  ('milanesa-de-nalga-al-horno-con-ensalada-de-repollo-y', 'repollo', 90),
  ('milanesa-de-nalga-al-horno-con-ensalada-de-repollo-y', 'zanahoria', 1),
  ('milanesa-de-nalga-al-horno-con-ensalada-de-repollo-y', 'aceite-oliva', 8),
  ('milanesa-de-nalga-al-horno-con-ensalada-de-repollo-y', 'limon-exprimido', 10),
  ('milanesa-de-pollo-al-horno-con-papas-al-horno', 'pechuga-cruda', 150),
  ('milanesa-de-pollo-al-horno-con-papas-al-horno', 'huevo', 1),
  ('milanesa-de-pollo-al-horno-con-papas-al-horno', 'pan-rallado', 30),
  ('milanesa-de-pollo-al-horno-con-papas-al-horno', 'aceite', 15),
  ('milanesa-de-pollo-al-horno-con-papas-al-horno', 'papa', 200),
  ('milanesa-de-cerdo-al-horno-con-ensalada-de-rucula-y', 'lomo-cerdo', 150),
  ('milanesa-de-cerdo-al-horno-con-ensalada-de-rucula-y', 'huevo', 1),
  ('milanesa-de-cerdo-al-horno-con-ensalada-de-rucula-y', 'pan-rallado', 30),
  ('milanesa-de-cerdo-al-horno-con-ensalada-de-rucula-y', 'aceite', 6),
  ('milanesa-de-cerdo-al-horno-con-ensalada-de-rucula-y', 'rucula', 50),
  ('milanesa-de-cerdo-al-horno-con-ensalada-de-rucula-y', 'tomate-cherry', 100),
  ('milanesa-de-cerdo-al-horno-con-ensalada-de-rucula-y', 'aceite-oliva', 8),
  ('milanesa-de-cerdo-al-horno-con-ensalada-de-rucula-y', 'parmesano', 10),
  ('milanesa-de-pollo-al-horno-con-pure-de-calabaza', 'pechuga-cruda', 150),
  ('milanesa-de-pollo-al-horno-con-pure-de-calabaza', 'huevo', 1),
  ('milanesa-de-pollo-al-horno-con-pure-de-calabaza', 'pan-rallado', 30),
  ('milanesa-de-pollo-al-horno-con-pure-de-calabaza', 'aceite', 6),
  ('milanesa-de-pollo-al-horno-con-pure-de-calabaza', 'calabaza', 220),
  ('milanesa-de-pollo-al-horno-con-pure-de-calabaza', 'manteca', 5),
  ('milanesa-de-pavo-al-horno-con-pure-de-papa', 'pechuga-pavo', 150),
  ('milanesa-de-pavo-al-horno-con-pure-de-papa', 'huevo', 1),
  ('milanesa-de-pavo-al-horno-con-pure-de-papa', 'pan-rallado', 30),
  ('milanesa-de-pavo-al-horno-con-pure-de-papa', 'aceite', 6),
  ('milanesa-de-pavo-al-horno-con-pure-de-papa', 'papa', 200),
  ('milanesa-de-pavo-al-horno-con-pure-de-papa', 'leche', 40),
  ('milanesa-de-pavo-al-horno-con-pure-de-papa', 'manteca', 5),
  ('milanesa-de-berenjena-al-horno-con-pure-de-papa', 'berenjena', 0.5),
  ('milanesa-de-berenjena-al-horno-con-pure-de-papa', 'huevo', 1),
  ('milanesa-de-berenjena-al-horno-con-pure-de-papa', 'pan-rallado', 30),
  ('milanesa-de-berenjena-al-horno-con-pure-de-papa', 'aceite', 6),
  ('milanesa-de-berenjena-al-horno-con-pure-de-papa', 'papa', 200),
  ('milanesa-de-berenjena-al-horno-con-pure-de-papa', 'leche', 40),
  ('milanesa-de-berenjena-al-horno-con-pure-de-papa', 'manteca', 5),
  ('milanesa-de-pollo-al-horno-con-pure-de-papa', 'pechuga-cruda', 150),
  ('milanesa-de-pollo-al-horno-con-pure-de-papa', 'huevo', 1),
  ('milanesa-de-pollo-al-horno-con-pure-de-papa', 'pan-rallado', 30),
  ('milanesa-de-pollo-al-horno-con-pure-de-papa', 'aceite', 6),
  ('milanesa-de-pollo-al-horno-con-pure-de-papa', 'papa', 200),
  ('milanesa-de-pollo-al-horno-con-pure-de-papa', 'leche', 40),
  ('milanesa-de-pollo-al-horno-con-pure-de-papa', 'manteca', 5),
  ('milanesa-de-nalga-al-horno-con-ensalada-de-rucula-y', 'bife-nalga', 150),
  ('milanesa-de-nalga-al-horno-con-ensalada-de-rucula-y', 'huevo', 1),
  ('milanesa-de-nalga-al-horno-con-ensalada-de-rucula-y', 'pan-rallado', 30),
  ('milanesa-de-nalga-al-horno-con-ensalada-de-rucula-y', 'aceite', 6),
  ('milanesa-de-nalga-al-horno-con-ensalada-de-rucula-y', 'rucula', 50),
  ('milanesa-de-nalga-al-horno-con-ensalada-de-rucula-y', 'tomate-cherry', 100),
  ('milanesa-de-nalga-al-horno-con-ensalada-de-rucula-y', 'aceite-oliva', 8),
  ('milanesa-de-nalga-al-horno-con-ensalada-de-rucula-y', 'parmesano', 10),
  ('milanesa-de-coliflor-al-horno-con-batatas-al-horno', 'coliflor', 200),
  ('milanesa-de-coliflor-al-horno-con-batatas-al-horno', 'huevo', 1),
  ('milanesa-de-coliflor-al-horno-con-batatas-al-horno', 'pan-rallado', 30),
  ('milanesa-de-coliflor-al-horno-con-batatas-al-horno', 'aceite', 10),
  ('milanesa-de-coliflor-al-horno-con-batatas-al-horno', 'batata', 200),
  ('milanesa-de-calabaza-al-horno-con-batatas-al-horno', 'calabaza', 200),
  ('milanesa-de-calabaza-al-horno-con-batatas-al-horno', 'huevo', 1),
  ('milanesa-de-calabaza-al-horno-con-batatas-al-horno', 'pan-rallado', 30),
  ('milanesa-de-calabaza-al-horno-con-batatas-al-horno', 'aceite', 10),
  ('milanesa-de-calabaza-al-horno-con-batatas-al-horno', 'batata', 200),
  ('milanesa-de-coliflor-al-horno-con-zapallitos-grillados', 'coliflor', 200),
  ('milanesa-de-coliflor-al-horno-con-zapallitos-grillados', 'huevo', 1),
  ('milanesa-de-coliflor-al-horno-con-zapallitos-grillados', 'pan-rallado', 30),
  ('milanesa-de-coliflor-al-horno-con-zapallitos-grillados', 'aceite', 10),
  ('milanesa-de-coliflor-al-horno-con-zapallitos-grillados', 'zapallito', 1),
  ('milanesa-de-pavo-al-horno-con-ensalada-de-rucula-y', 'pechuga-pavo', 150),
  ('milanesa-de-pavo-al-horno-con-ensalada-de-rucula-y', 'huevo', 1),
  ('milanesa-de-pavo-al-horno-con-ensalada-de-rucula-y', 'pan-rallado', 30),
  ('milanesa-de-pavo-al-horno-con-ensalada-de-rucula-y', 'aceite', 6),
  ('milanesa-de-pavo-al-horno-con-ensalada-de-rucula-y', 'rucula', 50),
  ('milanesa-de-pavo-al-horno-con-ensalada-de-rucula-y', 'tomate-cherry', 100),
  ('milanesa-de-pavo-al-horno-con-ensalada-de-rucula-y', 'aceite-oliva', 8),
  ('milanesa-de-pavo-al-horno-con-ensalada-de-rucula-y', 'parmesano', 10),
  ('milanesa-de-merluza-al-horno-con-ensalada-de-rucula-y', 'merluza-cruda', 160),
  ('milanesa-de-merluza-al-horno-con-ensalada-de-rucula-y', 'huevo', 1),
  ('milanesa-de-merluza-al-horno-con-ensalada-de-rucula-y', 'pan-rallado', 30),
  ('milanesa-de-merluza-al-horno-con-ensalada-de-rucula-y', 'aceite', 6),
  ('milanesa-de-merluza-al-horno-con-ensalada-de-rucula-y', 'rucula', 50),
  ('milanesa-de-merluza-al-horno-con-ensalada-de-rucula-y', 'tomate-cherry', 100),
  ('milanesa-de-merluza-al-horno-con-ensalada-de-rucula-y', 'aceite-oliva', 8),
  ('milanesa-de-merluza-al-horno-con-ensalada-de-rucula-y', 'parmesano', 10),
  ('milanesa-de-coliflor-al-horno-con-pure-de-calabaza', 'coliflor', 200),
  ('milanesa-de-coliflor-al-horno-con-pure-de-calabaza', 'huevo', 1),
  ('milanesa-de-coliflor-al-horno-con-pure-de-calabaza', 'pan-rallado', 30),
  ('milanesa-de-coliflor-al-horno-con-pure-de-calabaza', 'aceite', 6),
  ('milanesa-de-coliflor-al-horno-con-pure-de-calabaza', 'calabaza', 220),
  ('milanesa-de-coliflor-al-horno-con-pure-de-calabaza', 'manteca', 5),
  ('milanesa-de-nalga-al-horno-con-arroz', 'bife-nalga', 150),
  ('milanesa-de-nalga-al-horno-con-arroz', 'huevo', 1),
  ('milanesa-de-nalga-al-horno-con-arroz', 'pan-rallado', 30),
  ('milanesa-de-nalga-al-horno-con-arroz', 'aceite', 6),
  ('milanesa-de-nalga-al-horno-con-arroz', 'arroz', 60),
  ('milanesa-de-coliflor-al-horno-con-ensalada-de-repollo-y', 'coliflor', 200),
  ('milanesa-de-coliflor-al-horno-con-ensalada-de-repollo-y', 'huevo', 1),
  ('milanesa-de-coliflor-al-horno-con-ensalada-de-repollo-y', 'pan-rallado', 30),
  ('milanesa-de-coliflor-al-horno-con-ensalada-de-repollo-y', 'aceite', 6),
  ('milanesa-de-coliflor-al-horno-con-ensalada-de-repollo-y', 'repollo', 90),
  ('milanesa-de-coliflor-al-horno-con-ensalada-de-repollo-y', 'zanahoria', 1),
  ('milanesa-de-coliflor-al-horno-con-ensalada-de-repollo-y', 'aceite-oliva', 8),
  ('milanesa-de-coliflor-al-horno-con-ensalada-de-repollo-y', 'limon-exprimido', 10),
  ('milanesa-de-calabaza-al-horno-con-ensalada-mixta', 'calabaza', 200),
  ('milanesa-de-calabaza-al-horno-con-ensalada-mixta', 'huevo', 1),
  ('milanesa-de-calabaza-al-horno-con-ensalada-mixta', 'pan-rallado', 30),
  ('milanesa-de-calabaza-al-horno-con-ensalada-mixta', 'aceite', 6),
  ('milanesa-de-calabaza-al-horno-con-ensalada-mixta', 'lechuga', 70),
  ('milanesa-de-calabaza-al-horno-con-ensalada-mixta', 'tomate', 1),
  ('milanesa-de-calabaza-al-horno-con-ensalada-mixta', 'cebolla-morada', 0.5),
  ('milanesa-de-calabaza-al-horno-con-ensalada-mixta', 'aceite-oliva', 8),
  ('milanesa-de-merluza-al-horno-con-arroz', 'merluza-cruda', 160),
  ('milanesa-de-merluza-al-horno-con-arroz', 'huevo', 1),
  ('milanesa-de-merluza-al-horno-con-arroz', 'pan-rallado', 30),
  ('milanesa-de-merluza-al-horno-con-arroz', 'aceite', 6),
  ('milanesa-de-merluza-al-horno-con-arroz', 'arroz', 60),
  ('milanesa-de-nalga-al-horno-con-ensalada-mixta', 'bife-nalga', 150),
  ('milanesa-de-nalga-al-horno-con-ensalada-mixta', 'huevo', 1),
  ('milanesa-de-nalga-al-horno-con-ensalada-mixta', 'pan-rallado', 30),
  ('milanesa-de-nalga-al-horno-con-ensalada-mixta', 'aceite', 6),
  ('milanesa-de-nalga-al-horno-con-ensalada-mixta', 'lechuga', 70),
  ('milanesa-de-nalga-al-horno-con-ensalada-mixta', 'tomate', 1),
  ('milanesa-de-nalga-al-horno-con-ensalada-mixta', 'cebolla-morada', 0.5),
  ('milanesa-de-nalga-al-horno-con-ensalada-mixta', 'aceite-oliva', 8),
  ('milanesa-de-pavo-al-horno-con-zapallitos-grillados', 'pechuga-pavo', 150),
  ('milanesa-de-pavo-al-horno-con-zapallitos-grillados', 'huevo', 1),
  ('milanesa-de-pavo-al-horno-con-zapallitos-grillados', 'pan-rallado', 30),
  ('milanesa-de-pavo-al-horno-con-zapallitos-grillados', 'aceite', 10),
  ('milanesa-de-pavo-al-horno-con-zapallitos-grillados', 'zapallito', 1),
  ('milanesa-de-pollo-al-horno-con-arroz', 'pechuga-cruda', 150),
  ('milanesa-de-pollo-al-horno-con-arroz', 'huevo', 1),
  ('milanesa-de-pollo-al-horno-con-arroz', 'pan-rallado', 30),
  ('milanesa-de-pollo-al-horno-con-arroz', 'aceite', 6),
  ('milanesa-de-pollo-al-horno-con-arroz', 'arroz', 60),
  ('milanesa-de-nalga-al-horno-con-batatas-al-horno', 'bife-nalga', 150),
  ('milanesa-de-nalga-al-horno-con-batatas-al-horno', 'huevo', 1),
  ('milanesa-de-nalga-al-horno-con-batatas-al-horno', 'pan-rallado', 30),
  ('milanesa-de-nalga-al-horno-con-batatas-al-horno', 'aceite', 10),
  ('milanesa-de-nalga-al-horno-con-batatas-al-horno', 'batata', 200),
  ('milanesa-de-merluza-al-horno-con-ensalada-mixta', 'merluza-cruda', 160),
  ('milanesa-de-merluza-al-horno-con-ensalada-mixta', 'huevo', 1),
  ('milanesa-de-merluza-al-horno-con-ensalada-mixta', 'pan-rallado', 30),
  ('milanesa-de-merluza-al-horno-con-ensalada-mixta', 'aceite', 6),
  ('milanesa-de-merluza-al-horno-con-ensalada-mixta', 'lechuga', 70),
  ('milanesa-de-merluza-al-horno-con-ensalada-mixta', 'tomate', 1),
  ('milanesa-de-merluza-al-horno-con-ensalada-mixta', 'cebolla-morada', 0.5),
  ('milanesa-de-merluza-al-horno-con-ensalada-mixta', 'aceite-oliva', 8),
  ('milanesa-de-coliflor-al-horno-con-arroz', 'coliflor', 200),
  ('milanesa-de-coliflor-al-horno-con-arroz', 'huevo', 1),
  ('milanesa-de-coliflor-al-horno-con-arroz', 'pan-rallado', 30),
  ('milanesa-de-coliflor-al-horno-con-arroz', 'aceite', 6),
  ('milanesa-de-coliflor-al-horno-con-arroz', 'arroz', 60),
  ('milanesa-de-berenjena-al-horno-con-papas-al-horno', 'berenjena', 0.5),
  ('milanesa-de-berenjena-al-horno-con-papas-al-horno', 'huevo', 1),
  ('milanesa-de-berenjena-al-horno-con-papas-al-horno', 'pan-rallado', 30),
  ('milanesa-de-berenjena-al-horno-con-papas-al-horno', 'aceite', 15),
  ('milanesa-de-berenjena-al-horno-con-papas-al-horno', 'papa', 200),
  ('milanesa-de-merluza-al-horno-con-ensalada-de-repollo-y', 'merluza-cruda', 160),
  ('milanesa-de-merluza-al-horno-con-ensalada-de-repollo-y', 'huevo', 1),
  ('milanesa-de-merluza-al-horno-con-ensalada-de-repollo-y', 'pan-rallado', 30),
  ('milanesa-de-merluza-al-horno-con-ensalada-de-repollo-y', 'aceite', 6),
  ('milanesa-de-merluza-al-horno-con-ensalada-de-repollo-y', 'repollo', 90),
  ('milanesa-de-merluza-al-horno-con-ensalada-de-repollo-y', 'zanahoria', 1),
  ('milanesa-de-merluza-al-horno-con-ensalada-de-repollo-y', 'aceite-oliva', 8),
  ('milanesa-de-merluza-al-horno-con-ensalada-de-repollo-y', 'limon-exprimido', 10),
  ('milanesa-de-merluza-al-horno-con-papas-al-horno', 'merluza-cruda', 160),
  ('milanesa-de-merluza-al-horno-con-papas-al-horno', 'huevo', 1),
  ('milanesa-de-merluza-al-horno-con-papas-al-horno', 'pan-rallado', 30),
  ('milanesa-de-merluza-al-horno-con-papas-al-horno', 'aceite', 15),
  ('milanesa-de-merluza-al-horno-con-papas-al-horno', 'papa', 200),
  ('milanesa-de-calabaza-al-horno-con-pure-de-papa', 'calabaza', 200),
  ('milanesa-de-calabaza-al-horno-con-pure-de-papa', 'huevo', 1),
  ('milanesa-de-calabaza-al-horno-con-pure-de-papa', 'pan-rallado', 30),
  ('milanesa-de-calabaza-al-horno-con-pure-de-papa', 'aceite', 6),
  ('milanesa-de-calabaza-al-horno-con-pure-de-papa', 'papa', 200),
  ('milanesa-de-calabaza-al-horno-con-pure-de-papa', 'leche', 40),
  ('milanesa-de-calabaza-al-horno-con-pure-de-papa', 'manteca', 5),
  ('milanesa-de-berenjena-al-horno-con-ensalada-de-repollo', 'berenjena', 0.5),
  ('milanesa-de-berenjena-al-horno-con-ensalada-de-repollo', 'huevo', 1),
  ('milanesa-de-berenjena-al-horno-con-ensalada-de-repollo', 'pan-rallado', 30),
  ('milanesa-de-berenjena-al-horno-con-ensalada-de-repollo', 'aceite', 6),
  ('milanesa-de-berenjena-al-horno-con-ensalada-de-repollo', 'repollo', 90),
  ('milanesa-de-berenjena-al-horno-con-ensalada-de-repollo', 'zanahoria', 1),
  ('milanesa-de-berenjena-al-horno-con-ensalada-de-repollo', 'aceite-oliva', 8),
  ('milanesa-de-berenjena-al-horno-con-ensalada-de-repollo', 'limon-exprimido', 10),
  ('milanesa-de-pollo-al-horno-con-zapallitos-grillados', 'pechuga-cruda', 150),
  ('milanesa-de-pollo-al-horno-con-zapallitos-grillados', 'huevo', 1),
  ('milanesa-de-pollo-al-horno-con-zapallitos-grillados', 'pan-rallado', 30),
  ('milanesa-de-pollo-al-horno-con-zapallitos-grillados', 'aceite', 10),
  ('milanesa-de-pollo-al-horno-con-zapallitos-grillados', 'zapallito', 1),
  ('milanesa-de-coliflor-al-horno-con-papas-al-horno', 'coliflor', 200),
  ('milanesa-de-coliflor-al-horno-con-papas-al-horno', 'huevo', 1),
  ('milanesa-de-coliflor-al-horno-con-papas-al-horno', 'pan-rallado', 30),
  ('milanesa-de-coliflor-al-horno-con-papas-al-horno', 'aceite', 15),
  ('milanesa-de-coliflor-al-horno-con-papas-al-horno', 'papa', 200),
  ('milanesa-de-berenjena-al-horno-con-ensalada-mixta', 'berenjena', 0.5),
  ('milanesa-de-berenjena-al-horno-con-ensalada-mixta', 'huevo', 1),
  ('milanesa-de-berenjena-al-horno-con-ensalada-mixta', 'pan-rallado', 30),
  ('milanesa-de-berenjena-al-horno-con-ensalada-mixta', 'aceite', 6),
  ('milanesa-de-berenjena-al-horno-con-ensalada-mixta', 'lechuga', 70),
  ('milanesa-de-berenjena-al-horno-con-ensalada-mixta', 'tomate', 1),
  ('milanesa-de-berenjena-al-horno-con-ensalada-mixta', 'cebolla-morada', 0.5),
  ('milanesa-de-berenjena-al-horno-con-ensalada-mixta', 'aceite-oliva', 8),
  ('milanesa-de-pollo-al-horno-con-ensalada-de-repollo-y', 'pechuga-cruda', 150),
  ('milanesa-de-pollo-al-horno-con-ensalada-de-repollo-y', 'huevo', 1),
  ('milanesa-de-pollo-al-horno-con-ensalada-de-repollo-y', 'pan-rallado', 30),
  ('milanesa-de-pollo-al-horno-con-ensalada-de-repollo-y', 'aceite', 6),
  ('milanesa-de-pollo-al-horno-con-ensalada-de-repollo-y', 'repollo', 90),
  ('milanesa-de-pollo-al-horno-con-ensalada-de-repollo-y', 'zanahoria', 1),
  ('milanesa-de-pollo-al-horno-con-ensalada-de-repollo-y', 'aceite-oliva', 8),
  ('milanesa-de-pollo-al-horno-con-ensalada-de-repollo-y', 'limon-exprimido', 10),
  ('milanesa-de-pavo-al-horno-con-batatas-al-horno', 'pechuga-pavo', 150),
  ('milanesa-de-pavo-al-horno-con-batatas-al-horno', 'huevo', 1),
  ('milanesa-de-pavo-al-horno-con-batatas-al-horno', 'pan-rallado', 30),
  ('milanesa-de-pavo-al-horno-con-batatas-al-horno', 'aceite', 10),
  ('milanesa-de-pavo-al-horno-con-batatas-al-horno', 'batata', 200),
  ('milanesa-de-calabaza-al-horno-con-ensalada-de-rucula-y', 'calabaza', 200),
  ('milanesa-de-calabaza-al-horno-con-ensalada-de-rucula-y', 'huevo', 1),
  ('milanesa-de-calabaza-al-horno-con-ensalada-de-rucula-y', 'pan-rallado', 30),
  ('milanesa-de-calabaza-al-horno-con-ensalada-de-rucula-y', 'aceite', 6),
  ('milanesa-de-calabaza-al-horno-con-ensalada-de-rucula-y', 'rucula', 50),
  ('milanesa-de-calabaza-al-horno-con-ensalada-de-rucula-y', 'tomate-cherry', 100),
  ('milanesa-de-calabaza-al-horno-con-ensalada-de-rucula-y', 'aceite-oliva', 8),
  ('milanesa-de-calabaza-al-horno-con-ensalada-de-rucula-y', 'parmesano', 10),
  ('milanesa-de-nalga-al-horno-con-papas-al-horno', 'bife-nalga', 150),
  ('milanesa-de-nalga-al-horno-con-papas-al-horno', 'huevo', 1),
  ('milanesa-de-nalga-al-horno-con-papas-al-horno', 'pan-rallado', 30),
  ('milanesa-de-nalga-al-horno-con-papas-al-horno', 'aceite', 15),
  ('milanesa-de-nalga-al-horno-con-papas-al-horno', 'papa', 200),
  ('milanesa-de-merluza-al-horno-con-zapallitos-grillados', 'merluza-cruda', 160),
  ('milanesa-de-merluza-al-horno-con-zapallitos-grillados', 'huevo', 1),
  ('milanesa-de-merluza-al-horno-con-zapallitos-grillados', 'pan-rallado', 30),
  ('milanesa-de-merluza-al-horno-con-zapallitos-grillados', 'aceite', 10),
  ('milanesa-de-merluza-al-horno-con-zapallitos-grillados', 'zapallito', 1),
  ('milanesa-de-calabaza-al-horno-con-arroz', 'calabaza', 200),
  ('milanesa-de-calabaza-al-horno-con-arroz', 'huevo', 1),
  ('milanesa-de-calabaza-al-horno-con-arroz', 'pan-rallado', 30),
  ('milanesa-de-calabaza-al-horno-con-arroz', 'aceite', 6),
  ('milanesa-de-calabaza-al-horno-con-arroz', 'arroz', 60),
  ('milanesa-de-cerdo-al-horno-con-papas-al-horno', 'lomo-cerdo', 150),
  ('milanesa-de-cerdo-al-horno-con-papas-al-horno', 'huevo', 1),
  ('milanesa-de-cerdo-al-horno-con-papas-al-horno', 'pan-rallado', 30),
  ('milanesa-de-cerdo-al-horno-con-papas-al-horno', 'aceite', 15),
  ('milanesa-de-cerdo-al-horno-con-papas-al-horno', 'papa', 200),
  ('milanesa-de-pollo-al-horno-con-batatas-al-horno', 'pechuga-cruda', 150),
  ('milanesa-de-pollo-al-horno-con-batatas-al-horno', 'huevo', 1),
  ('milanesa-de-pollo-al-horno-con-batatas-al-horno', 'pan-rallado', 30),
  ('milanesa-de-pollo-al-horno-con-batatas-al-horno', 'aceite', 10),
  ('milanesa-de-pollo-al-horno-con-batatas-al-horno', 'batata', 200),
  ('milanesa-de-calabaza-al-horno-con-zapallitos-grillados', 'calabaza', 200),
  ('milanesa-de-calabaza-al-horno-con-zapallitos-grillados', 'huevo', 1),
  ('milanesa-de-calabaza-al-horno-con-zapallitos-grillados', 'pan-rallado', 30),
  ('milanesa-de-calabaza-al-horno-con-zapallitos-grillados', 'aceite', 10),
  ('milanesa-de-calabaza-al-horno-con-zapallitos-grillados', 'zapallito', 1),
  ('albondigas-de-carne-en-salsa-de-tomate-con-arroz', 'carne-picada-magra', 110),
  ('albondigas-de-carne-en-salsa-de-tomate-con-arroz', 'tomate-triturado', 120),
  ('albondigas-de-carne-en-salsa-de-tomate-con-arroz', 'arroz', 60),
  ('albondigas-de-carne-en-salsa-de-tomate-con-arroz', 'cebolla', 0.5),
  ('albondigas-de-carne-en-salsa-de-tomate-con-arroz', 'ajo', 1),
  ('albondigas-de-carne-en-salsa-de-tomate-con-arroz', 'huevo', 0.5),
  ('albondigas-de-carne-en-salsa-de-tomate-con-arroz', 'pan-rallado', 10),
  ('albondigas-de-carne-en-salsa-de-tomate-con-arroz', 'aceite', 6),
  ('albondigas-de-pollo-con-pure-de-calabaza', 'picada-pollo', 120),
  ('albondigas-de-pollo-con-pure-de-calabaza', 'calabaza', 200),
  ('albondigas-de-pollo-con-pure-de-calabaza', 'cebolla', 0.5),
  ('albondigas-de-pollo-con-pure-de-calabaza', 'huevo', 0.5),
  ('albondigas-de-pollo-con-pure-de-calabaza', 'pan-rallado', 10),
  ('albondigas-de-pollo-con-pure-de-calabaza', 'manteca', 5),
  ('albondigas-de-pollo-con-pure-de-calabaza', 'aceite', 6),
  ('albondigas-de-pavo-con-fideos', 'picada-pavo', 120),
  ('albondigas-de-pavo-con-fideos', 'fideos', 70),
  ('albondigas-de-pavo-con-fideos', 'tomate-triturado', 100),
  ('albondigas-de-pavo-con-fideos', 'cebolla', 0.5),
  ('albondigas-de-pavo-con-fideos', 'huevo', 0.5),
  ('albondigas-de-pavo-con-fideos', 'pan-rallado', 10),
  ('albondigas-de-pavo-con-fideos', 'aceite', 6),
  ('albondigas-de-atun-y-papa-con-ensalada', 'atun-natural', 1),
  ('albondigas-de-atun-y-papa-con-ensalada', 'papa-hervida', 80),
  ('albondigas-de-atun-y-papa-con-ensalada', 'huevo', 0.5),
  ('albondigas-de-atun-y-papa-con-ensalada', 'pan-rallado', 15),
  ('albondigas-de-atun-y-papa-con-ensalada', 'lechuga', 60),
  ('albondigas-de-atun-y-papa-con-ensalada', 'tomate', 1),
  ('albondigas-de-atun-y-papa-con-ensalada', 'aceite', 8),
  ('albondigas-de-lentejas-con-arroz', 'lentejas-hervidas', 140),
  ('albondigas-de-lentejas-con-arroz', 'avena', 25),
  ('albondigas-de-lentejas-con-arroz', 'arroz', 60),
  ('albondigas-de-lentejas-con-arroz', 'tomate-triturado', 100),
  ('albondigas-de-lentejas-con-arroz', 'cebolla', 0.5),
  ('albondigas-de-lentejas-con-arroz', 'huevo', 0.5),
  ('albondigas-de-lentejas-con-arroz', 'aceite', 6),
  ('medallones-de-pollo-y-espinaca-con-ensalada', 'picada-pollo', 130),
  ('medallones-de-pollo-y-espinaca-con-ensalada', 'espinaca', 70),
  ('medallones-de-pollo-y-espinaca-con-ensalada', 'huevo', 0.5),
  ('medallones-de-pollo-y-espinaca-con-ensalada', 'pan-rallado', 15),
  ('medallones-de-pollo-y-espinaca-con-ensalada', 'lechuga', 60),
  ('medallones-de-pollo-y-espinaca-con-ensalada', 'tomate', 1),
  ('medallones-de-pollo-y-espinaca-con-ensalada', 'aceite', 8)
) as v(recipe_slug, food_slug, qty)
join public.recipes r on r.slug = v.recipe_slug
join public.foods f on f.slug = v.food_slug
on conflict do nothing;
