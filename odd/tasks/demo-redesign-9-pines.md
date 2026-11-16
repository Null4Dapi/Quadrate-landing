# Feature: Lote de Cambios UI Demo Quadrate Live (9 Pines)
Status: completed
Route: direct inline

## Specs
- S1: "Este botón debe trasnformarse y cambiar. Me refiero a que debería estar en la página. Antes estaba como unas tablas en la parte superior, eso está mal. Creo que lo que debemos hacer es que después del apartado de paginación de las cocheras debe haber una sección desplegable y contraible que al desplegar se abrirá hacia abajo y mostrará la tabla que ahora está de manera flotante." (Pin #1, TelemetriaDrawerZustand)
- S2: "La presentación de esta información en la tarjeta está mal. Debe mostrarse por filas y no por columnas, como si fuera una factura" (Pin #2, TarjetaCochera métricas)
- S3: "El texto es largo para lo que se quiere hacer, osea debe ser directo. Además que, cuando no tiene espacio, el tamaño del botón cambia y se pone ancho. Está bien pero rompe con la estética" (Pin #3, TarjetaCochera botón)
- S4: "El espaciado del texto es poco" (Pin #4, SimuladorReserva desglose)
- S5: "Los botónes del tiempo están muy cuadriculada." (Pin #5, SimuladorReserva píldoras duración)
- S6: "Los botónes del tiempo están muy cuadriculada." (Pin #6, SimuladorReserva píldoras ETA)
- S7: "La tarjeta es muy cuadriculada. No va en juego con lo demás" (Pin #7, SimuladorReserva tarjeta)
- S8: "El bordes rapius es poco" (Pin #8, SimuladorReserva botón apartar plaza)
- S9: "Se debe mejorar y hacer minimalista el tema de filtrado" (Pin #9, CatalogoRemoto filtros)

## Tasks
- [x] T1 (S2, S3): Rediseñar métricas de TarjetaCochera a formato factura en filas y compactar botón directo 'Simular'. [inline, af4f002]
- [x] T2 (S4, S5, S6, S7, S8): Estilizar SimuladorReserva con tarjeta redondeada (20px), píldoras redondas pill para ETA y tiempo, botón CTA con radius pill y mayor espaciado en desglose. [inline, af4f002]
- [x] T3 (S9): Rediseñar barra de filtros de CatalogoRemoto a un estilo minimalista, pulido y sin etiquetas ruidosas. [inline, af4f002]
- [x] T4 (S1): Transformar TelemetriaDrawer de dock flotante fijo a sección acordeón integrada en la página tras la paginación. [inline, af4f002]
- [x] T5 (S1-S9): Transpilar componentes JSX con scripts/compilar-react.cjs, ejecutar npm test y validar visualmente con capturas Chromium Playwright. [inline, af4f002]

## Log
- L1: "Lote de Cambios UI (9 pines) en Quadrate Live (demo.html)"
- L2: Implementados los 9 pines: telemetría reubicada como acordeón en la página tras paginación, métricas en filas estilo factura, botón directo 'Simular', tarjeta de simulador redondeada (20px), píldoras y botón de reserva con radius pill, desglose espaciado y filtros minimalistas. 11/11 tests unitarios pasando y verificación visual en Chromium Playwright exitosa en modo claro y oscuro.
