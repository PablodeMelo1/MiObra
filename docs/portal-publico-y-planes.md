# Portal publico y propuesta de planes

## Objetivo

El portal publico es la pagina de bienvenida de MiObra para visitantes sin una
sesion activa. Explica el problema que resuelve el sistema, su funcionamiento,
las capacidades disponibles y una propuesta comercial de suscripciones.

La ruta publica es `/`. Cuando la aplicacion detecta una sesion autenticada,
`PublicRoute` conserva el comportamiento existente y redirige a `/dashboard`.
Los accesos a registro e inicio de sesion siguen disponibles en `/register` y
`/login`.

## Contenido del portal

El recorrido se organiza en estas secciones:

1. Presentacion de MiObra y llamados a crear una cuenta o conocer el flujo.
2. Problemas operativos que busca resolver en empresas constructoras.
3. Funcionamiento en cuatro pasos: empresa, obras, recursos y control.
4. Capacidades que existen actualmente en el sistema.
5. Propuesta de planes mensuales.
6. Llamado final a registro e ingreso.

Las capacidades comunicadas corresponden a modulos actuales: obras, tareas,
grupos y zonas, calendario, inventario y movimientos, proveedores, solicitudes
de materiales, pendientes, empleados, invitaciones, roles y administracion de
varias empresas.

## Propuesta comercial

Los valores son precios de lanzamiento y referencia expresados en dolares
estadounidenses por empresa/mes, con impuestos no incluidos. Sirven como base
para validar la oferta comercial.

| Plan | Precio mensual | Limites propuestos | Alcance |
| --- | ---: | --- | --- |
| Inicial | USD 49 | 5 usuarios y 3 obras activas | Obras, tareas, pendientes, calendario, inventario, proveedores y solicitudes de materiales |
| Profesional | USD 99 | 15 usuarios y 10 obras activas | Todo Inicial, mas empleados, roles, invitaciones, historial y control operativo |
| Empresa | USD 199 | 40 usuarios y obras activas ilimitadas | Todo Profesional, mas operacion a escala, administracion y cambio entre empresas |

El plan Profesional se presenta como la opcion recomendada porque cubre una
constructora en crecimiento sin llevarla directamente al nivel de mayor escala.

## Estado de implementacion de suscripciones

La aplicacion no implementa todavia facturacion, cobros, seleccion persistente
de plan ni enforcement o restricciones automaticas por cantidad de usuarios u
obras. Los precios, limites y agrupaciones son una propuesta de producto
visible en el portal; no deben interpretarse como controles activos.

La definicion que consume la interfaz esta centralizada en
`client/src/constants/subscriptionPlans.js`. Esto evita duplicar precios y
facilita ajustar la propuesta mientras se valida comercialmente. Para convertir
la propuesta en suscripciones operativas sera necesario definir facturacion,
persistencia del plan, estados de suscripcion y reglas de autorizacion en una
tarea futura separada.

## Navegacion y mantenimiento

- El portal vive en `client/src/pages/WelcomePage.jsx`.
- El encabezado y la grilla de precios viven en `client/src/components/landing/`.
- Los enlaces internos usan anclas semanticas para recorrer el contenido.
- Los llamados principales llevan al registro y los secundarios al inicio de
  sesion.
- Elegir un llamado desde una tarjeta de plan no persiste una seleccion: todos
  llevan al registro general mientras no exista facturacion.
- Login y registro permiten volver al portal.
- El diseño conserva la interfaz oscura, operativa, responsive y accesible del
  cliente actual.
