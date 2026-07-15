# Roadmap de producto ejecutable para MiObra

## 1. Proposito y forma de uso

Este documento convierte el estado real de MiObra en una secuencia de trabajo
ejecutable para una plataforma de gestion de empresas constructoras. No es una
lista de ideas ni una promesa comercial. Cada paquete define el problema, las
capas a intervenir, los contratos, las validaciones y la condicion objetiva de
cierre para que un agente pueda implementarlo sin reinterpretar el alcance.

No se asignan fechas ni esfuerzos sin datos de capacidad, adopcion y operacion.
El orden se rige por dependencias y gates: un gate no se supera por tener una
pantalla, sino por cumplir todos sus criterios de aceptacion, seguridad y
verificacion.

### Estados usados

| Estado | Significado operativo |
| --- | --- |
| `IMPLEMENTADO` | Existe flujo util de backend y frontend, o infraestructura efectiva, verificable en el repositorio actual. Puede conservar deuda explicita. |
| `PARCIAL` | Existe una base funcional, pero falta una regla critica del negocio constructivo, seguridad, cobertura o cierre de punta a punta. |
| `NO IMPLEMENTADO` | No existe modelo y flujo de producto util; un texto, enlace o propuesta comercial no cuenta como implementacion. |
| `BLOQUEADO POR GATE` | No debe iniciarse hasta que el gate indicado este aprobado. |

Al finalizar un paquete, el agente debe actualizar este documento solo con
evidencia verificable y mover su estado; no debe declarar implementado un flujo
por modelos, mocks o UI aislados.

## 2. Linea base auditada

### Implementado

| Capacidad | Evidencia actual | Limite conocido |
| --- | --- | --- |
| Multiempresa y aislamiento base | `Company`, `CompanyMember`, `companyId` en modelos operativos, `loadCompanyContext`, repositorios scopiados, selector de empresa y `scripts/migrate-default-company.mjs` | Falta demostrar aislamiento con tests automatizados y completar permisos por modulo. |
| Autenticacion y email | Registro, login, cookie JWT, confirmacion y reenvio de email en `user-controller.mjs`, `email-service.mjs`, `VerifyEmailPage.jsx` | El rate limit de reenvio vive en memoria y no hay suite automatizada de seguridad. |
| Empresas, membresias e invitaciones | CRUD de contexto, invitaciones, cambio de empresa, roles base y Settings con perfil/miembros/invitaciones | Los roles no gobiernan aun todos los recursos operativos. |
| Empleados | `Employee`, invitaciones, vinculacion opcional a `User`, UI de empleados y `Task.assignedEmployeeIds` | No hay cuadrillas, asistencia ni costo de mano de obra. |
| Obras y coordinacion | Proyectos, miembros, tablero por listas, tareas, prioridades, estados, comentarios/bitacora y asignacion a empleados | Los roles de proyecto no se aplican sistematicamente a lectura y mutacion. |
| Abastecimiento base | Proveedores y solicitudes vinculables a obra/proveedor | El ciclo solo cubre `PEDIDO`, `COMPRADO`, `RECIBIDO`; no hay aprobacion ni orden de compra. |
| Inventario base | Items, zonas, entregas, devoluciones, pendientes por usuario e historial de movimientos | No hay deposito formal, stock minimo, reservas, valuacion ni transacciones atomicas completas. |
| Seguimiento general | Pendientes, calendario operativo y dashboard | Dashboard/calendario agregan datos en el cliente; no constituyen reporting historico ni KPI contractual. |
| Portal publico | Landing, explicacion de producto y planes propuestos | Los planes son informativos: no existe suscripcion, cobro ni enforcement. |

### Parcial y deuda que condiciona el roadmap

| Capacidad | Estado preciso |
| --- | --- |
| Autorizacion | `requireRole` protege administracion de empresa y empleados, pero gran parte de proyectos, tareas, miembros, proveedores, solicitudes, inventario, zonas, grupos, pendientes, comentarios y usuarios acepta cualquier membresia activa. |
| Validacion y errores | Joi cubre usuario, empresa, empleado, proyecto y parte de tareas; otros modulos validan manualmente y los formatos de error/respuesta no son uniformes. |
| Postman | Hay cobertura amplia por carpetas, pero contiene ejemplos desalineados; por ejemplo, acciones de prioridad/asignacion bajo solicitudes de materiales no corresponden al router actual. |
| Confiabilidad de inventario | Se registran item, actividad y movimiento, pero checkout/checkin actualizan varios documentos sin transaccion; una falla intermedia puede desalinear cantidades e historial. |
| Settings | Gestiona datos basicos de empresa, membresias e invitaciones; no configura aprobaciones, stock, costos, seguridad, notificaciones ni obra. |
| Reporting | Dashboard y calendario se calculan desde consultas cliente; no existe snapshot, consulta agregada de servidor, exportacion ni definicion estable de indicadores. |
| Verificacion | No existe suite automatizada backend; `npm test` falla deliberadamente. La verificacion actual es arranque, Postman manual, lint y build. |

### No implementado

- aprobaciones de solicitudes, ordenes de compra y recepciones parciales;
- presupuesto, compromisos, costos reales, jornales, desvios, margen y cambios
  de alcance;
- reportes diarios, documentos, fotos y evidencia con almacenamiento seguro;
- incidencias, inspecciones, no conformidades, calidad y seguridad laboral;
- PWA, cola offline y reconciliacion;
- auditoria global, metricas, trazas y alertas operativas;
- suscripciones, facturacion, pagos y enforcement de planes;
- portales de cliente y proveedor, y exportaciones gobernadas;
- OCR, busqueda semantica, resumenes y deteccion asistida de riesgos.

## 3. Principios de producto para construccion

1. **La obra es el eje de trazabilidad.** Solicitud, compra, recepcion,
   consumo, evidencia, costo, incidente y aprobacion deben poder explicarse por
   empresa, obra, actor y fecha.
2. **El dato de campo debe ser rapido y demostrable.** Capturar desde movil no
   puede exigir formularios administrativos; la evidencia debe conservar autor,
   momento, contexto y archivo original.
3. **Una recepcion no equivale a una compra.** Solicitado, aprobado, ordenado,
   entregado, rechazado, consumido y pagado son hechos distintos.
4. **El costo debe ser reproducible.** Presupuesto, compromiso y real se
   separan; los historicos no se recalculan silenciosamente con precios nuevos.
5. **Segregacion de funciones.** Quien solicita no debe autoaprobar por defecto;
   recepciones, ajustes de stock, costos y cierres requieren permisos explicitos.
6. **Offline no significa sin control.** Cada comando debe ser idempotente,
   auditable y reconciliable; los conflictos se muestran, no se pisan.
7. **Configuracion antes que excepciones en codigo.** Moneda, zona horaria,
   umbrales y niveles de aprobacion pertenecen a la empresa y deben versionarse.
8. **IA despues de datos confiables.** Ninguna inferencia automatica debe crear
   costos, aprobar compras o cerrar incidentes sin fuente, confianza y revision.

## 4. Mapa de dependencias y gates

```text
Fase 0  Confiabilidad y acceso
  └─ Gate G0: aislamiento, permisos, contratos, pruebas y auditoria confiables
      ├─ F2.1  Fundacion documental comun
      └─ Fase 1  Abastecimiento cerrado
          └─ F1.2 requiere F2.1 para remitos y evidencia
              └─ Gate G1: solicitud → aprobacion → OC → recepcion → stock trazable
                  ├─ Fase 2  Campo y evidencia (F2.2–F2.4)
                  │   └─ Gate G2: evidencia durable y captura movil confiable
                  └─ Fase 3  Economia de obra
                      └─ Gate G3: presupuesto, comprometido y real reconciliables
                          └─ Fase 4  Calidad, seguridad y cumplimiento
                              └─ Gate G4: inspecciones y acciones con trazabilidad
                                  └─ Fase 5  SaaS comercial
                                      └─ Gate G5: planes cobrables y enforcement seguro
                                          └─ Fase 6  Ecosistema y portales
                                              └─ Gate G6: exposicion externa acotada
                                                  └─ Fase 7  IA asistiva
```

F2.1 es la unica excepcion al orden numerico: es una fundacion comun que se
ejecuta despues de G0 y antes de F1.2 para que remitos y evidencia no nazcan
como adjuntos transitorios. El resto de fase 2 (F2.2–F2.4) y fase 3 pueden
desarrollarse en paralelo solo despues de G1. Fase 4 requiere G2 y G3; SaaS
requiere G4; todo el ecosistema externo requiere G5 y toda IA requiere G6.

## 5. Paquetes de ejecucion

## Fase 0 — Confiabilidad, acceso y contratos

### F0.1 — Matriz de permisos por empresa y obra

**Estado:** `PARCIAL`.

**Objetivo y problema probado.** Impedir que una membresia valida pueda leer o
mutar recursos fuera de su funcion. Hoy solo empresa y empleados usan
`requireRole` de forma consistente y `ProjectMember.role` no gobierna todo el
tablero.

**Alcance y exclusiones.** Incluye matriz de acciones por rol de empresa y rol
de obra, middleware reutilizable, ownership de comentarios y enforcement en
todas las rutas existentes. Excluye roles personalizados y aprobaciones de
compras, que pertenecen a F1.

**Dependencias.** Modelos `CompanyMember`, `ProjectMember`; contexto activo ya
implementado. No depende de features nuevas.

**Modelos y contratos.** Conservar roles actuales. Definir constantes de
acciones (`project.read`, `task.write`, `inventory.adjust`, etc.) y resolver
`can(action, context)`. Todo endpoint debe responder `401` sin sesion, `403`
sin permiso y `404` para un recurso ajeno cuando revelar su existencia sea un
riesgo. No aceptar `companyId` del body.

**Capas y archivos probables.** `src/constants/companyRoles.mjs`,
`projectRoles.mjs`, nuevo helper/middleware acotado en `src/middleware/`, rutas
de `src/routes/v1/`, controladores con ownership, repositorios de membresias y
UI que actualmente ofrece acciones sin consultar rol.

**Pasos de implementacion.**

1. Inventariar cada endpoint actual y asignarle una accion, rol de empresa y,
   cuando corresponda, rol de obra.
2. Documentar la matriz como fuente de verdad y convertirla en constantes.
3. Implementar middleware que cargue el proyecto scopiado antes de autorizar.
4. Aplicarlo a lectura, alta, edicion, borrado y movimientos, sin confiar en la
   visibilidad del frontend.
5. Restringir comentarios a autor o administrador y proteger endpoints de
   usuarios/grupos/miembros.
6. Ocultar o deshabilitar acciones cliente segun el contexto devuelto por API.
7. Ejecutar pruebas positivas y negativas por rol y acceso cruzado.

**Roles y segregacion.** `owner/admin` administran empresa; `manager/supervisor`
coordinan recursos segun matriz; `operator` registra solo acciones permitidas;
`viewer` no muta. El rol de empresa no reemplaza automaticamente el rol de una
obra.

**Migracion y compatibilidad.** Mantener roles existentes y asignar defaults
conservadores. Antes de activar restricciones, generar un reporte de miembros
sin rol valido. No elevar permisos durante la migracion.

**Frontend y estados.** Acciones no autorizadas no se muestran; si el permiso
cambia con una pantalla abierta, manejar `403` con mensaje y refresco de
sesion. Cubrir loading de permisos, read-only, disabled, error y cambio de
empresa.

**Aceptacion verificable.** Una matriz endpoint-accion sin huecos; un viewer no
puede mutar por HTTP; un usuario ajeno a la obra no la lee; owner/admin conserva
administracion; cambiar de empresa invalida acciones del contexto anterior.

**Tests.** Unitarios de matriz, integracion por rol, ownership, empresa A/B,
IDs conocidos de otro tenant y rol actualizado durante sesion.

**Postman.** Agregar carpeta `Autorizacion` con casos permitidos y denegados por
rol, variables para dos empresas y dos obras, y asserts de `403/404`.

**Seguridad, auditoria y observabilidad.** Auditar denegaciones relevantes sin
guardar tokens; medir rechazos por accion y tenant; alertar picos de acceso
cruzado.

**Definicion de terminado.** Matriz versionada, todas las rutas clasificadas,
tests verdes, Postman actualizado, UI coherente y reviewer sin endpoint
operativo desprotegido.

### F0.2 — Suite automatizada de contratos, aislamiento y concurrencia

**Estado:** `NO IMPLEMENTADO`.

**Objetivo y problema probado.** Reemplazar la dependencia exclusiva de
arranque y pruebas manuales. El script `npm test` no ejecuta tests y los flujos
criticos multiempresa no tienen regresion automatizada.

**Alcance y exclusiones.** Incluye runner backend, fixtures deterministas,
tests de servicios/repositorios/API y comandos CI. Excluye E2E visual completo
y performance a escala, que se incorporan cuando haya baseline.

**Dependencias.** F0.1 define expectativas de acceso. La base de tests puede
iniciarse en paralelo y debe estabilizarse antes de G0.

**Modelos y contratos.** Crear builders para User, Company, Membership,
Employee, Project, Item y solicitudes; cada test debe generar tenant propio y
limpiar datos. La API real, no los controladores invocados a mano, es el
contrato de integracion.

**Capas y archivos probables.** `package.json`, carpeta de tests alineada con
convenciones, bootstrap de app sin listener ya disponible en `src/app.mjs`,
configuracion de base de test y workflow CI si el repositorio lo usa.

**Pasos de implementacion.**

1. Elegir el runner minimo compatible con Node 22 y justificar cualquier
   dependencia.
2. Separar conexion, seed y teardown sin usar datos de desarrollo.
3. Crear helpers de autenticacion por cookie y `X-Company-Id`.
4. Cubrir auth/email, memberships, aislamiento CRUD y referencias cruzadas.
5. Cubrir concurrencia de ultimo owner, inventario y aceptacion de invitacion.
6. Agregar comandos `test`, `test:integration` y ejecucion reproducible en CI.
7. Documentar variables y diagnostico de fallas.

**Roles y segregacion.** Fixtures explicitas para cada rol; ninguna prueba debe
usar owner para todos los casos.

**Migracion y compatibilidad.** No cambiar contratos productivos para facilitar
tests. Mantener `npm start`; reemplazar el script placeholder con una suite
real.

**Frontend y estados.** No requiere pantalla. Agregar tests de componentes solo
para guardas/acciones de permisos de F0.1 si ya existe infraestructura adecuada.

**Aceptacion verificable.** Un comando local reproduce la suite desde cero;
una query sin `companyId`, una respuesta no autorizada o una carrera de stock
hace fallar un test especifico.

**Tests.** Este paquete entrega tests; incluir unitarios, integracion HTTP,
transacciones y casos de error, con nombres de negocio.

**Postman.** Mantener Postman como prueba exploratoria; no usarlo como sustituto
de la suite. Documentar correspondencia entre escenarios.

**Seguridad, auditoria y observabilidad.** Secretos y DB de test aislados;
redactar cookies y passwords en salidas; publicar resultado y duracion en CI.

**Definicion de terminado.** Suite verde y no flaky, comando documentado,
entorno aislado y cobertura de los gates G0/G1 incorporada al criterio de PR.

### F0.3 — Validacion Joi, errores y Postman como contrato ejecutable

**Estado:** `PARCIAL`.

**Objetivo y problema probado.** Uniformar entradas y respuestas para evitar
reglas distintas entre controladores. Joi no cubre todos los modulos y Postman
contiene requests que no existen en `materialRequest.mjs`.

**Alcance y exclusiones.** Incluye schemas de body/params/query, error envelope,
codigos estables y saneamiento de la coleccion actual. Excluye version v2 de API.

**Dependencias.** F0.1 para distinguir permiso de validacion; coordinacion con
F0.2 para fijar contratos.

**Modelos y contratos.** Normalizar error a `{ message, code, details? }` sin
stack; validar ObjectId, enums, limites, paginacion y campos desconocidos.
Conservar respuestas exitosas actuales salvo migracion documentada.

**Capas y archivos probables.** `src/validations/`,
`validation.middleware.mjs`, error handler de `src/app.mjs`, controladores,
clientes `client/src/api/`, `client/src/utils/apiError.js` y
`postman_collection.json`.

**Pasos de implementacion.**

1. Generar inventario ruta-metodo-payload-respuesta desde routers reales.
2. Crear schemas faltantes para comentarios, materiales, proveedores,
   pendientes, grupos, items, movimientos, zonas y miembros de obra.
3. Validar params/query y rechazar campos protegidos (`companyId`, creadores,
   cantidades derivadas).
4. Centralizar traduccion de Joi, Mongoose, duplicados y errores de dominio.
5. Adaptar cliente solo donde el envelope cambie de forma controlada.
6. Eliminar de Postman requests inexistentes y agregar casos feliz/error reales.
7. Agregar tests de contrato por modulo.

**Roles y segregacion.** Validar antes de negocio sin filtrar informacion; la
autorizacion sigue siendo obligatoria aunque el payload sea valido.

**Migracion y compatibilidad.** Aplicar por modulo; registrar contratos que
cambian y conservar aliases solo si un cliente real los usa.

**Frontend y estados.** Mostrar errores por campo cuando haya `details`, error
general recuperable, loading y retry; no exponer mensajes internos.

**Aceptacion verificable.** Ninguna ruta mutante usa validacion manual como
unica defensa; ObjectId invalido responde 400; Postman no referencia endpoints
ausentes; errores 4xx son estables.

**Tests.** Payload valido, requerido faltante, enum, limite, campo desconocido,
ObjectId, duplicado y error de persistencia controlado.

**Postman.** Actualizar todas las carpetas afectadas con scripts de captura de
IDs y asserts; incluir variables de tenant y documentar orden de ejecucion.

**Seguridad, auditoria y observabilidad.** Redactar datos sensibles; contar
errores por `code`, ruta y status; no registrar body completo por defecto.

**Definicion de terminado.** Inventario 1:1 entre routers y Postman, schemas en
el borde HTTP, tests verdes, envelope documentado y build cliente correcto.

### F0.4 — Auditoria de dominio y observabilidad operativa

**Estado:** `NO IMPLEMENTADO`.

**Objetivo y problema probado.** Poder responder quien cambio una obra, rol,
solicitud, stock o costo y diagnosticar fallas. Los timestamps y movimientos de
inventario no constituyen auditoria global.

**Alcance y exclusiones.** Incluye eventos de auditoria inmutables, request ID,
logging estructurado, metricas basicas y health/readiness. Excluye un data
warehouse analitico.

**Dependencias.** F0.3 aporta codigos de error; el catalogo de acciones de F0.1
alimenta eventos.

**Modelos y contratos.** `AuditEvent(companyId, actorUserId, action,
entityType, entityId, projectId?, before?, after?, requestId, occurredAt,
metadata)`. Definir redaccion, retencion y payload maximo. Exponer consulta
paginada solo a roles autorizados.

**Capas y archivos probables.** Nuevo modelo/repositorio/servicio de auditoria,
middleware de request context, instrumentacion en servicios/controladores,
`src/app.mjs`, Settings/visor de actividad y configuracion de logs.

**Pasos de implementacion.**

1. Catalogar eventos obligatorios y campos prohibidos.
2. Generar/capturar request ID y contexto de tenant/actor.
3. Persistir auditoria junto a mutaciones criticas o con estrategia durable
   explicitamente probada.
4. Instrumentar auth, membresias, obra, tareas, compras, inventario y settings.
5. Agregar logs JSON, latencia, status y health/readiness sin PII innecesaria.
6. Implementar consulta filtrada y paginada de auditoria.
7. Definir alertas para 5xx, denegaciones cruzadas y fallos de email.

**Roles y segregacion.** Owner/admin consultan auditoria empresarial;
supervisor puede ver eventos de sus obras si la matriz lo permite. Ningun
usuario edita o borra eventos desde producto.

**Migracion y compatibilidad.** No fabricar historia previa. Marcar fecha de
inicio de cobertura y versionar schema de eventos.

**Frontend y estados.** Tabla/filtros con loading, vacio, error, paginacion y
detalle redactado; no bloquear una operacion exitosa por un render de auditoria.

**Aceptacion verificable.** Cada mutacion critica genera un evento con tenant,
actor, entidad y request ID; passwords/tokens nunca aparecen; un 5xx se
correlaciona de API a log.

**Tests.** Emision por accion, redaccion, tenant, permisos de lectura, falla de
auditoria y correlacion de request.

**Postman.** Casos para consultar filtros y demostrar eventos tras mutaciones;
casos denegados para operator/viewer.

**Seguridad, auditoria y observabilidad.** Este paquete define la base; cifrar
transporte, limitar metadata, aplicar retencion y monitorear tasa de perdida.

**Definicion de terminado.** Catalogo y retencion documentados, cobertura de
eventos criticos verificada, consultas protegidas y dashboards/alertas minimos
operables.

### F0.5 — Integridad transaccional del inventario actual

**Estado:** `PARCIAL`.

**Objetivo y problema probado.** Evitar que cantidad disponible, actividad y
movimiento diverjan ante concurrencia o falla intermedia en checkout/checkin.

**Alcance y exclusiones.** Incluye comandos atomicos, idempotencia, invariantes
y correccion controlada de desbalances actuales. Excluye almacenes, reservas y
valuacion, incluidos en F1.3.

**Dependencias.** Tests de F0.2 y auditoria F0.4; Mongo debe soportar la
estrategia transaccional elegida en entornos objetivo.

**Modelos y contratos.** Mantener modelos actuales; agregar `operationId`
unico a movimiento/comando, versionado optimista si corresponde e invariantes
`0 <= availableQuantity <= totalQuantity`.

**Capas y archivos probables.** `itemInventory-controller.mjs`, repositorios de
item/activity/movement, modelos e indices, validadores, script de diagnostico y
APIs/clientes de movimientos.

**Pasos de implementacion.**

1. Definir invariantes y consultar desbalances sin modificar datos.
2. Mover checkout/checkin a servicio de dominio transaccional.
3. Hacer decremento/incremento condicional y escribir historial en la misma
   transaccion.
4. Incorporar `operationId` para reintentos seguros.
5. Crear migracion/reconciliacion con modo dry-run y respaldo.
6. Adaptar frontend para enviar idempotency key y resolver conflicto.
7. Probar carreras y fallas inyectadas entre pasos.

**Roles y segregacion.** Solo roles con permiso de entrega/devolucion; ajustes
manuales quedan fuera y luego requeriran permiso superior y motivo.

**Migracion y compatibilidad.** Backfill de `operationId` solo para nuevos
movimientos; dry-run reporta inconsistencias y la reparacion requiere
confirmacion operativa.

**Frontend y estados.** Loading no duplicable, exito, stock insuficiente,
conflicto por actualizacion, retry idempotente y estado desconocido tras corte.

**Aceptacion verificable.** Cien operaciones concurrentes no producen stock
negativo, duplicados ni movimiento sin contrapartida; repetir `operationId`
devuelve el resultado original.

**Tests.** Concurrencia, rollback en cada escritura, stock insuficiente,
devolucion excesiva, item ajeno e idempotencia.

**Postman.** Secuencia checkout/checkin, repeticion con mismo operation ID,
conflicto y concurrencia documentada.

**Seguridad, auditoria y observabilidad.** Evento por comando, actor y saldo
antes/despues; metrica de conflicto, rollback y desbalance detectado.

**Definicion de terminado.** Servicio atomico en produccion, diagnostico limpio
o excepciones resueltas, tests concurrentes verdes y Postman alineado.

**Gate G0.** Se aprueba cuando F0.1–F0.5 estan terminados, la suite corre en CI,
Postman refleja los routers, no hay acceso cruzado reproducible y cada mutacion
critica deja rastro correlacionable.

## Fase 1 — Abastecimiento cerrado y trazabilidad de materiales

### F1.1 — Solicitud de materiales con aprobacion configurable

**Estado:** `PARCIAL`, bloqueado por G0.

**Objetivo y problema probado.** Convertir el pedido basico en una solicitud
controlada por obra, responsable y nivel de autorizacion.

**Alcance y exclusiones.** Incluye borrador, envio, aprobacion, rechazo,
cancelacion, comentarios de decision y reglas por monto/categoria. Excluye OC,
recepcion y pago.

**Dependencias.** G0; settings de empresa existentes; catalogo de obra,
proveedor y empleado.

**Modelos y contratos.** Evolucionar `MaterialRequest` con lineas normalizadas,
`requestedBy`, `projectId`, `costCodeId?`, moneda, estimado, estado y version.
Agregar `ApprovalPolicy` y `ApprovalDecision`; transiciones por comandos, nunca
por patch libre de status.

**Capas y archivos probables.** Modelos/repositorios/servicio/validaciones/rutas
de material requests, settings de aprobacion, constantes, API cliente, pagina y
componentes del modulo.

**Pasos de implementacion.**

1. Definir maquina de estados y matriz de transiciones.
2. Modelar lineas, politica y decisiones inmutables.
3. Migrar pedidos actuales a un estado compatible sin inventar aprobaciones.
4. Implementar comandos submit/approve/reject/cancel con concurrencia optimista.
5. Agregar bandejas por rol y filtros por obra/estado/solicitante.
6. Notificar eventos sin bloquear la transaccion.
7. Cubrir flujo y negativas con tests/Postman.

**Roles y segregacion.** Operator solicita; supervisor/manager aprueba segun
politica; solicitante no autoaprueba salvo configuracion explicita; owner
configura politicas.

**Migracion y compatibilidad.** Pedidos existentes quedan `legacy_received` o
estado equivalente derivado solo de su dato real; conservar lectura del
contrato anterior durante transicion controlada.

**Frontend y estados.** Borrador editable, enviado read-only, aprobacion con
motivo, rechazo obligatorio, timeline, loading, vacio, error, conflicto de
version y disabled por permiso.

**Aceptacion verificable.** Ningun pedido llega a compra sin decisiones
requeridas; toda decision identifica actor/fecha/motivo; dos aprobadores
concurrentes no duplican transicion.

**Tests.** Maquina de estados, umbrales, autoaprobacion prohibida, tenant,
version, rechazo/cancelacion y politica modificada.

**Postman.** Flujo completo y casos sin permiso, transicion invalida, version
vieja y monto que exige segundo nivel.

**Seguridad, auditoria y observabilidad.** Auditar snapshot de politica y
decision; medir tiempo en estado, rechazos y solicitudes vencidas.

**Definicion de terminado.** Politica configurable, flujo de punta a punta,
historial inmutable, migracion ejecutada, tests y Postman verdes.

### F1.2 — Orden de compra y recepcion parcial

**Estado:** `NO IMPLEMENTADO`, bloqueado por F1.1 y F2.1.

**Objetivo y problema probado.** Separar lo aprobado de lo ordenado y recibido,
incluyendo faltantes, rechazo y entregas parciales reales de obra.

**Alcance y exclusiones.** Incluye OC numerada, lineas desde solicitudes,
emision, cancelacion, recepciones parciales, remito, cantidad aceptada/rechazada
y cierre. Excluye cuentas a pagar y conciliacion bancaria.

**Dependencias.** F1.1, proveedores existentes, inventario atomico F0.5 y la
fundacion documental F2.1 terminada para remitos y evidencia.

**Modelos y contratos.** `PurchaseOrder`, `PurchaseOrderLine`, `GoodsReceipt`,
`GoodsReceiptLine`; numeros unicos por empresa, snapshot de proveedor/precio,
moneda, impuestos, obra y estados. Comandos issue/cancel/receive/reject/close.

**Capas y archivos probables.** Nuevos modelos/repositorios/servicios/rutas/
validaciones, generador de secuencia, integracion con items/movimientos,
componentes de compras/recepcion y Postman.

**Pasos de implementacion.**

1. Definir cantidades solicitada, ordenada, recibida, aceptada y rechazada.
2. Modelar OC con snapshots y numeracion transaccional por tenant.
3. Crear OC solo desde saldo aprobado disponible.
4. Emitir/cancelar mediante comandos autorizados.
5. Registrar recepcion parcial con remito y discrepancia.
6. Integrar ingreso aceptado a inventario de forma atomica e idempotente.
7. Cerrar automaticamente solo cuando reglas y saldos lo permitan.

**Roles y segregacion.** Comprador crea/emite; receptor registra entrega; un
rol autorizado resuelve diferencias; solicitante no altera precios de OC
emitida.

**Migracion y compatibilidad.** No fabricar OCs para solicitudes historicas.
Mantenerlas como legado consultable; nuevos estados operan solo bajo flujo nuevo.

**Frontend y estados.** Editor de lineas, vista imprimible, recepcion mobile,
saldo pendiente, parcial, rechazo con motivo, duplicado idempotente, conflicto,
loading y error recuperable.

**Aceptacion verificable.** La suma aceptada nunca supera lo ordenado; una
recepcion repetida no duplica stock; cada ingreso se rastrea hasta OC,
solicitud, proveedor y obra.

**Tests.** Numeracion concurrente, redondeos, parciales, exceso, rechazo,
cancelacion, tenant, transaccion de stock e idempotencia.

**Postman.** Solicitud aprobada → OC → dos recepciones → cierre, mas exceso,
duplicado, cancelacion y rol incorrecto.

**Seguridad, auditoria y observabilidad.** Snapshot inmutable, eventos por
emision/recepcion, metrica de entrega tardia, diferencia y fallo de integracion.

**Definicion de terminado.** Flujo reconciliado por cantidades, ingreso atomico,
documentos identificables, tests, Postman y auditoria completos.

### F1.3 — Depositos, stock minimo, reservas y consumo por obra

**Estado:** `PARCIAL`, bloqueado por F1.2.

**Objetivo y problema probado.** Evolucionar zonas/items a stock operativo por
ubicacion y obra, con reposicion y consumo rastreable.

**Alcance y exclusiones.** Incluye depositos/ubicaciones, saldo por ubicacion,
transferencias, ajustes, minimo, reserva y consumo a obra. Excluye valuacion
contable, tratada en F3.

**Dependencias.** F0.5 y recepciones F1.2.

**Modelos y contratos.** `Warehouse`, `StockLocation`, `StockBalance`,
`StockLedgerEntry`, `StockReservation`; item pasa a catalogo y el ledger es
fuente de verdad. Comandos receive/transfer/reserve/release/consume/adjust con
operation ID.

**Capas y archivos probables.** Modelos/repositorios/servicio de inventario,
migracion desde `Zone` y cantidades actuales, rutas/validadores, UI de
inventario e historial/dashboard.

**Pasos de implementacion.**

1. Definir semantica de zona actual y mapeo a deposito/ubicacion.
2. Crear ledger inmutable y saldos derivados/transaccionales.
3. Migrar saldos con asiento de apertura auditable.
4. Implementar transferencias, ajustes con motivo, reservas y consumo.
5. Integrar recepcion de OC y entrega a obra.
6. Configurar minimo por item/ubicacion y alertas deduplicadas.
7. Reconciliar saldos y bloquear negativos segun politica.

**Roles y segregacion.** Almacenero mueve/recibe; supervisor reserva/consume
para obra; ajustes requieren permiso superior y motivo; viewer solo consulta.

**Migracion y compatibilidad.** Dry-run, asiento de apertura y reporte antes/
despues; no borrar historial actual; exponer vista compatible mientras migra UI.

**Frontend y estados.** Stock por deposito, transfer mobile, alertas, reserva
parcial, sin stock, conflicto, conteo en progreso y filtros sin scroll
horizontal accidental.

**Aceptacion verificable.** Cada saldo se explica por ledger; transferencia
conserva total; reservado no puede consumirse dos veces; alertas nacen al cruzar
umbral y no por cada lectura.

**Tests.** Invariantes, concurrencia, transferencia, reserva, liberacion,
ajuste, umbral, tenant y migracion.

**Postman.** Asiento inicial de fixture, recepcion, transferencia, reserva,
consumo, ajuste y casos de saldo insuficiente/permisos.

**Seguridad, auditoria y observabilidad.** Ledger inmutable, motivo y actor en
ajustes, metricas de stock negativo bloqueado, quiebres y diferencias.

**Definicion de terminado.** Saldos reconciliables, migracion validada,
operaciones idempotentes y cobertura completa de API/UI/tests/Postman.

### F1.4 — Desempeño de proveedores

**Estado:** `NO IMPLEMENTADO`, bloqueado por F1.2.

**Objetivo y problema probado.** Tomar decisiones de abastecimiento con hechos
de entrega y calidad, no solo datos de contacto.

**Alcance y exclusiones.** Incluye condiciones comerciales basicas, contactos,
categorias, entrega a tiempo, diferencias y evaluacion documentada. Excluye
portal proveedor, incluido en F6.2.

**Dependencias.** OCs y recepciones F1.2; incidentes/calidad enriquecen despues.

**Modelos y contratos.** Extender Supplier o agregar perfiles/contactos;
`SupplierEvaluation` con periodo, criterios, score, evidencia y evaluador. KPI
derivado de OC no se edita manualmente.

**Capas y archivos probables.** Supplier models/repositories/services/routes,
consultas agregadas, componentes de detalle y dashboard de compras.

**Pasos de implementacion.**

1. Definir indicadores y formula versionada.
2. Normalizar contactos/categorias sin romper proveedor actual.
3. Calcular puntualidad, completitud y rechazo desde recepciones.
4. Implementar evaluacion cualitativa con evidencia.
5. Mostrar origen y periodo de cada score.
6. Agregar filtros/comparacion sin ranking opaco.

**Roles y segregacion.** Compras consulta; evaluador autorizado registra
criterios; proveedor no edita su score.

**Migracion y compatibilidad.** Proveedores actuales permanecen activos con
`sin datos suficientes`; no asignar cero por ausencia de historial.

**Frontend y estados.** Perfil, tendencia, sin datos, periodo incompleto,
loading/error y detalle de calculo accesible.

**Aceptacion verificable.** Cada KPI se reproduce desde OCs/recepciones; el
sistema diferencia `sin datos` de bajo desempeño.

**Tests.** Formula, periodos, parciales, rechazo, sin datos, tenant y permisos.

**Postman.** Consulta de indicadores, alta de evaluacion, filtros y denegaciones.

**Seguridad, auditoria y observabilidad.** Auditar evaluaciones y formula;
medir jobs fallidos y datos incompletos.

**Definicion de terminado.** Indicadores explicables, evaluacion gobernada,
tests/Postman y UI completa.

**Gate G1.** Se aprueba cuando una necesidad puede rastrearse desde solicitud y
aprobacion hasta OC, recepciones parciales y saldo/consumo, sin superar
cantidades ni perder tenant, actor o evidencia.

## Fase 2 — Campo, evidencia y continuidad movil

### F2.1 — Documentos, fotos y evidencia durable

**Estado:** `NO IMPLEMENTADO`, bloqueado por G0.

**Objetivo y problema probado.** Sustituir links informales en comentarios por
evidencia gobernada, durable y vinculada a obra/entidad.

**Alcance y exclusiones.** Incluye carga, metadata, versiones, descarga segura,
preview, vinculos y eliminacion logica. Excluye OCR y busqueda semantica.

**Dependencias.** G0 auditoria/permisos; proveedor de objetos a seleccionar con
criterios de costo, region, firma de URL y retencion.

**Modelos y contratos.** `Document(companyId, projectId, entityType, entityId,
kind, objectKey, originalName, mimeType, size, checksum, version, status,
uploadedBy, capturedAt)`. Flujo de upload firmado o backend con limites; nunca
aceptar URL arbitraria como archivo confiable.

**Capas y archivos probables.** Modelo/repositorio/servicio de storage,
validaciones/rutas, configuracion, componentes uploader/gallery/document list y
adaptaciones en tareas, bitacora, OC/recepcion.

**Pasos de implementacion.**

1. Definir clasificacion, MIME/tamano, retencion y ownership.
2. Abstraer storage y separar metadata de binario.
3. Implementar carga idempotente con checksum y antivirus/validacion prevista.
4. Autorizar cada descarga contra tenant/obra, usando URL temporal.
5. Vincular documentos sin duplicar binario y versionar reemplazos.
6. Implementar preview, progreso, retry y captura movil.
7. Auditar carga, descarga sensible y baja.

**Roles y segregacion.** Acceso hereda entidad/obra; carga y baja son acciones
separadas; documentos contractuales pueden requerir admin.

**Migracion y compatibilidad.** Links existentes quedan como links legacy no
verificados; no descargarlos automaticamente. Definir importador posterior.

**Frontend y estados.** Seleccion/camara, progreso, cancelacion, error por tipo/
tamano, retry, offline pendiente, preview no disponible, vacio y reduced motion.

**Aceptacion verificable.** Un usuario sin acceso a obra no descarga con ID u
object key; checksum y metadata sobreviven; archivo reemplazado conserva
version anterior segun retencion.

**Tests.** Autorizacion, limites, MIME real, checksum, duplicado, storage fallido,
URL expirada, tenant y version.

**Postman.** Metadata, solicitud de carga/descarga, asociacion y errores; indicar
como adjuntar binarios sin incluir secretos.

**Seguridad, auditoria y observabilidad.** URLs temporales, object keys opacos,
escaneo, cifrado del proveedor, cuota, eventos y metricas de carga fallida.

**Definicion de terminado.** Evidencia durable y protegida en entidades
prioritarias, politica documentada, tests/Postman y recuperacion de fallos.

### F2.2 — Parte diario de obra

**Estado:** `NO IMPLEMENTADO`, bloqueado por G1 y F2.1.

**Objetivo y problema probado.** Registrar una fuente diaria aprobable sobre
avance, dotacion, clima, entregas, equipos, bloqueos y evidencia.

**Alcance y exclusiones.** Incluye borrador, envio, revision, cierre y reapertura
controlada. Excluye certificacion economica automatica.

**Dependencias.** Empleados/obras existentes, documentos F2.1, auditoria G0.

**Modelos y contratos.** `DailyReport` unico por obra/fecha/turno con estado y
version; secciones normalizadas para workforce, progress, deliveries,
equipment, weather, blockers y referencias. Comandos submit/approve/reopen.

**Capas y archivos probables.** Nuevos modelos/repositorios/servicios/rutas/
validaciones, APIs, pagina mobile-first y widgets de obra/calendario.

**Pasos de implementacion.**

1. Validar plantilla con jefes de obra y definir campos obligatorios minimos.
2. Modelar reporte y snapshots de personas/actividades.
3. Implementar autosave idempotente y control de version.
4. Adjuntar fotos/documentos y relacionar recepciones/incidentes.
5. Implementar envio, revision, reapertura con motivo y firma simple de actor.
6. Crear resumen semanal derivado, sin inventar datos faltantes.

**Roles y segregacion.** Supervisor redacta/envia; manager aprueba/reabre;
operator aporta datos si se habilita; viewer consulta.

**Migracion y compatibilidad.** Sin backfill ficticio; calendario anterior no se
convierte en parte diario.

**Frontend y estados.** Mobile-first, guardando/guardado, borrador offline,
conflicto, seccion incompleta, enviado read-only, reapertura, carga/error/vacio.

**Aceptacion verificable.** Un parte cerrado conserva snapshot, autor y
evidencia; no hay dos partes activos para misma clave; reapertura deja motivo.

**Tests.** Unicidad concurrente, autosave, version, permisos, transiciones,
tenant y documentos ajenos.

**Postman.** Crear borrador, actualizar, adjuntar referencia, enviar, aprobar,
reabrir y negativas.

**Seguridad, auditoria y observabilidad.** Audit trail completo; metrica de
partes faltantes/tardios y fallos de autosave, sin usarla como sancion opaca.

**Definicion de terminado.** Flujo diario usado de punta a punta, snapshot
inmutable al cierre, evidencia y suite/Postman completos.

### F2.3 — Incidencias y checklists de campo

**Estado:** `NO IMPLEMENTADO`, bloqueado por G1 y F2.1.

**Objetivo y problema probado.** Registrar problemas y verificaciones como
acciones responsables, no como comentarios sin vencimiento.

**Alcance y exclusiones.** Incluye incidentes operativos, plantillas de
checklist, ejecución, hallazgos, responsable, fecha y cierre con evidencia.
Excluye taxonomia especializada de calidad/seguridad de F4.

**Dependencias.** Empleados, tareas, documentos y permisos.

**Modelos y contratos.** `Issue`, `ChecklistTemplate`, `ChecklistRun`,
`ChecklistAnswer`, con severidad, estado, obra/zona/tarea, asignacion y version
de plantilla snapshot.

**Capas y archivos probables.** Nuevos modelos/repositorios/servicios/rutas,
componentes mobile, panel en obra/calendario/dashboard.

**Pasos de implementacion.**

1. Definir maquina de estados y campos por tipo de respuesta.
2. Versionar plantillas y guardar snapshot en cada ejecucion.
3. Crear incidencia desde hallazgo sin duplicar evidencia.
4. Asignar, vencer, resolver y verificar cierre.
5. Integrar notificaciones y filtros por severidad/obra.
6. Preparar extension tipada de F4 sin campos genericos ilimitados.

**Roles y segregacion.** Campo crea/responde; supervisor asigna/resuelve;
verificador distinto confirma cierres criticos.

**Migracion y compatibilidad.** Pendientes actuales no se migran automaticamente;
pueden enlazarse manualmente a una incidencia.

**Frontend y estados.** Checklist tactil, progreso, requerido, no aplica con
motivo, foto obligatoria, guardado parcial, conflicto y cierre rechazado.

**Aceptacion verificable.** Respuestas conservan version de plantilla; hallazgo
critico no se cierra sin evidencia/verificacion configurada.

**Tests.** Versiones, tipos de respuesta, required/no aplica, transiciones,
permisos, tenant y concurrencia.

**Postman.** Plantilla → ejecucion → hallazgo → incidencia → cierre/verificacion,
con casos invalidos.

**Seguridad, auditoria y observabilidad.** Auditar cambios y cierres; medir
vencidas, reaperturas y fallos de sincronizacion.

**Definicion de terminado.** Plantillas versionadas, incidencias accionables,
evidencia protegida y cobertura completa.

### F2.4 — PWA online-first y cola offline controlada

**Estado:** `NO IMPLEMENTADO`, bloqueado por G1 y F2.1–F2.3 estables online.

**Objetivo y problema probado.** Permitir captura de campo con conectividad
intermitente sin duplicar ni perder comandos.

**Alcance y exclusiones.** Primero instalabilidad/cache de shell y lectura
reciente; despues cola offline solo para parte diario, evidencia e incidencias.
Excluye offline de compras, permisos y ajustes de stock en la primera version.

**Dependencias.** APIs idempotentes, versionadas y auditadas; storage con retry.

**Modelos y contratos.** `clientOperationId`, `baseVersion`, timestamp cliente
informativo y respuesta de reconciliacion. Cola local cifrada cuando sea viable,
con estados pending/syncing/conflict/failed/synced.

**Capas y archivos probables.** Vite/PWA config justificada, manifest/service
worker, modulo de cola en cliente, APIs de comandos, banner/centro de sync.

**Pasos de implementacion.**

1. Medir flujos y navegadores objetivo; definir datos permitidos en dispositivo.
2. Implementar manifest, shell y estrategia de actualizacion segura.
3. Hacer idempotentes los comandos seleccionados.
4. Crear cola persistente y sincronizacion al recuperar red.
5. Mostrar conflictos para resolucion explicita; no last-write-wins silencioso.
6. Probar cierre de pestaña, token vencido, storage lleno y nueva version.
7. Activar por feature flag despues de telemetria en online-first.

**Roles y segregacion.** Permisos se revalidan al sincronizar; una operacion
encolada no conserva autoridad si el rol fue revocado.

**Migracion y compatibilidad.** Despliegue en dos etapas; service worker debe
tener rollback y limpieza de caches versionada.

**Frontend y estados.** Offline visible, cantidad pendiente, progreso, conflicto,
sesion vencida, storage lleno, retry/descartar con confirmacion y actualizacion
disponible.

**Aceptacion verificable.** Repetir sync no duplica; revocacion se respeta;
conflicto nunca pisa servidor; una actualizacion no deja app inutilizable.

**Tests.** Unitarios de cola, navegador offline/online, idempotencia, conflicto,
auth vencida, cuota y upgrade de service worker.

**Postman.** Documentar operation IDs y conflictos en endpoints sincronizables;
la PWA se verifica ademas con pruebas de navegador.

**Seguridad, auditoria y observabilidad.** Minimizar cache de PII, limpiar al
logout/cambio de empresa, auditar sincronizacion y medir cola/fallos/conflictos.

**Definicion de terminado.** PWA instalable, rollback probado, tres flujos
offline confiables, telemetria y pruebas de navegador verdes.

**Gate G2.** Se aprueba cuando partes, documentos e incidencias conservan
autor/version/evidencia, funcionan mobile-first y sus reintentos online/offline
son idempotentes y observables.

## Fase 3 — Economia y control de obra

### F3.1 — Codigos de costo, presupuesto y revisiones

**Estado:** `NO IMPLEMENTADO`, bloqueado por G1.

**Objetivo y problema probado.** Establecer una linea base economica por obra
antes de calcular desvio o margen.

**Alcance y exclusiones.** Incluye estructura de costos, presupuesto por
version, cantidades, precio unitario, moneda, aprobacion y baseline congelada.
Excluye contabilidad general y facturacion al cliente.

**Dependencias.** Empresa/moneda y obras existentes; permisos/auditoria G0.

**Modelos y contratos.** `CostCode`, `ProjectBudget`, `BudgetVersion`,
`BudgetLine`; importes en minor units o Decimal128 con regla unica, moneda y
precision explicitas. Comandos draft/submit/approve/set-baseline.

**Capas y archivos probables.** Nuevos modelos/repositorios/servicios/
validaciones/rutas, importador CSV gobernado, pagina economica de obra.

**Pasos de implementacion.**

1. Definir taxonomia y unidad monetaria sin floats binarios.
2. Modelar versiones y snapshots de lineas.
3. Crear editor/importador con validacion previa y reporte de errores.
4. Implementar aprobacion y baseline inmutable.
5. Permitir revisiones sin reescribir baseline historica.
6. Exponer consultas agregadas reproducibles.

**Roles y segregacion.** Cost controller prepara; manager/owner aprueba;
supervisor consulta; operator no ve valores si politica lo restringe.

**Migracion y compatibilidad.** No inferir presupuesto desde solicitudes.
Obras actuales quedan `sin presupuesto` hasta carga aprobada.

**Frontend y estados.** Tabla jerarquica responsive, import preview, errores por
fila, borrador, en aprobacion, baseline, revision y comparacion.

**Aceptacion verificable.** Totales reproducibles y exactos; baseline no se
edita; cada revision conserva autor, motivo y diferencia.

**Tests.** Precision, moneda, jerarquia, import, versiones, concurrencia,
permisos y tenant.

**Postman.** CRUD de codigos, draft, lineas, submit, approve, baseline y
transiciones invalidas.

**Seguridad, auditoria y observabilidad.** Auditar importes antes/despues;
limitar exportacion; medir imports fallidos y obras sin baseline.

**Definicion de terminado.** Una obra tiene baseline aprobada versionada,
totales exactos, import controlado y tests/Postman completos.

### F3.2 — Comprometido, recibido y costo real

**Estado:** `NO IMPLEMENTADO`, bloqueado por G1 y F3.1.

**Objetivo y problema probado.** Mostrar presupuesto, compromiso y real como
hechos separados y reconciliables.

**Alcance y exclusiones.** Incluye imputacion de solicitudes/OC/recepciones a
codigo de costo, snapshots de precio, costos de inventario consumido y ajustes
autorizados. Excluye pago bancario e impuestos contables complejos.

**Dependencias.** Baseline F3.1, OC/recepcion F1.2, ledger F1.3.

**Modelos y contratos.** `CostCommitment`, `ActualCostEntry`, `CostAllocation`,
politica de valuacion inicial documentada; ledger economico inmutable con
reversion, nunca delete/update silencioso.

**Capas y archivos probables.** Servicios de costing y agregacion, modelos/
repositorios, hooks desde compras/inventario, endpoints/reportes y panel de obra.

**Pasos de implementacion.**

1. Definir cuando nace/libera un compromiso y cuando nace un real.
2. Definir valuacion y redondeo por moneda/unidad.
3. Emitir asientos desde OC, recepcion, devolucion y consumo.
4. Implementar distribucion entre obra/codigo con balance obligatorio.
5. Crear reversiones y ajustes con motivo/aprobacion.
6. Reconciliar asientos con documentos fuente y presupuesto.
7. Exponer drill-down desde total hasta evidencia.

**Roles y segregacion.** Compras origina documentos; controller imputa/ajusta;
aprobador distinto confirma ajustes relevantes; campo consulta alcance acotado.

**Migracion y compatibilidad.** No valuar historico sin precio fuente. Marcar
`costo desconocido` y permitir carga inicial auditada.

**Frontend y estados.** Resumen y drill-down, pendiente de imputacion, costo
desconocido, conciliado, diferencia, loading/error y export restringido.

**Aceptacion verificable.** Cada monto llega a documento fuente; comprometido se
libera correctamente; recibido/consumido no se duplica; total del detalle iguala
agregado.

**Tests.** Precision, parciales, cancelacion, devolucion, distribucion,
reversion, concurrencia, tenant y moneda.

**Postman.** OC/recepcion/consumo con consulta de ledger, imputacion, ajuste y
reversion.

**Seguridad, auditoria y observabilidad.** Ledger inmutable, doble control de
ajustes, alertas de asientos huerfanos y conciliacion diaria.

**Definicion de terminado.** Reconciliacion sin diferencias no explicadas,
drill-down completo y tests/Postman verdes.

### F3.3 — Jornales y horas por obra

**Estado:** `NO IMPLEMENTADO`, bloqueado por G1, empleados y F3.1.

**Objetivo y problema probado.** Incorporar mano de obra real al control de
produccion y costo sin confundir empleado con cuenta de acceso.

**Alcance y exclusiones.** Incluye cuadrillas, partes de horas, obra/actividad,
aprobacion, tarifa efectiva versionada y ausencia basica. Excluye liquidacion de
sueldos y obligaciones laborales locales.

**Dependencias.** Employee implementado, codigos de costo F3.1, partes diarios
F2.2 para conciliacion opcional.

**Modelos y contratos.** `Crew`, `CrewMember`, `TimeEntry`, `LaborRateVersion`;
fecha, horas, obra/codigo, origen, estado y aprobacion. La tarifa es snapshot al
contabilizar y tiene acceso restringido.

**Capas y archivos probables.** Nuevos modelos/repositorios/servicios/rutas,
UI mobile de carga masiva y revision, integracion con costos/dashboard.

**Pasos de implementacion.**

1. Definir jornada, descanso, zona horaria y reglas de solapamiento.
2. Modelar cuadrillas, horas y tarifas versionadas.
3. Implementar carga individual/masiva con idempotencia.
4. Detectar solapamientos y horas atipicas sin bloquear excepcion autorizada.
5. Aprobar/reabrir con motivo.
6. Emitir costo laboral a F3.2 y conciliar con parte diario.

**Roles y segregacion.** Capataz carga; supervisor aprueba; controller gestiona
tarifas; acceso a tarifa no implica acceso a datos sensibles adicionales.

**Migracion y compatibilidad.** Empleados actuales quedan sin tarifa hasta alta
versionada; no reconstruir horas historicas.

**Frontend y estados.** Grilla mobile por cuadrilla, copia controlada, conflicto,
solapamiento, pendiente, aprobado, reabierto, offline futuro y total diario.

**Aceptacion verificable.** No hay doble contabilizacion; horas aprobadas generan
costo exacto; cambiar tarifa futura no altera historico.

**Tests.** Zona horaria, solapamiento, limites, lote idempotente, tarifa,
reapertura, tenant y permisos.

**Postman.** Cuadrilla, tarifa, carga, aprobacion, conflicto y consulta de costo.

**Seguridad, auditoria y observabilidad.** Minimizar datos personales, auditar
tarifas/aprobaciones y medir cargas rechazadas/pendientes.

**Definicion de terminado.** Horas aprobables y costo laboral reconciliado, con
privacidad, tests y Postman completos.

### F3.4 — Cambios de alcance, desvio y margen

**Estado:** `NO IMPLEMENTADO`, bloqueado por F3.1–F3.3.

**Objetivo y problema probado.** Explicar por que cambia el resultado de obra y
separar alcance aprobado de desvio operativo.

**Alcance y exclusiones.** Incluye change orders, impacto en costo/ingreso/plazo,
aprobacion, forecast, variance y margen estimado. Excluye reconocimiento contable
de ingresos.

**Dependencias.** Baseline, costos reales/comprometidos y, si aplica, horas.

**Modelos y contratos.** `ChangeOrder` versionado con lineas e impacto,
`ProjectForecastSnapshot`; formulas documentadas para variance y margen, con
fecha de corte y calidad de datos.

**Capas y archivos probables.** Modelos/repositorios/servicios de calculo,
endpoints de snapshot/drill-down, panel economico y export futuro.

**Pasos de implementacion.**

1. Definir formulas, signo, fecha de corte y estados de aprobacion.
2. Modelar cambio con evidencia y versiones.
3. Aplicar cambio aprobado sin reescribir baseline original.
4. Calcular forecast desde saldo, compromisos y reales.
5. Mostrar variaciones por codigo y causa.
6. Crear snapshots reproducibles y alertas por umbral configurado.

**Roles y segregacion.** Manager propone; owner/rol economico aprueba; controller
mantiene forecast; campo no altera importes.

**Migracion y compatibilidad.** Primera foto parte de datos disponibles y marca
calidad; no presentar margen si falta ingreso o costo material.

**Frontend y estados.** Comparador baseline/actual/forecast, pendiente de
aprobacion, datos incompletos, corte, drill-down y explicacion de formula.

**Aceptacion verificable.** Cada variacion se explica por cambio, cantidad,
precio o costo; snapshots de igual corte son reproducibles.

**Tests.** Formulas, signos, versiones, moneda, cambio rechazado/cancelado,
datos faltantes, tenant y permisos.

**Postman.** Crear/aprobar cambio, snapshot, filtros, drill-down y transiciones
invalidas.

**Seguridad, auditoria y observabilidad.** Auditar importes/aprobaciones;
restringir margen; monitorear snapshots fallidos y datos no imputados.

**Definicion de terminado.** Desvio y margen explicables con calidad visible,
snapshots auditados y cobertura completa.

**Gate G3.** Se aprueba cuando baseline, cambios, comprometido, real y mano de
obra cuadran al detalle para una obra piloto y ningun KPI oculta datos faltantes.

## Fase 4 — Calidad, seguridad y cumplimiento

### F4.1 — Inspecciones y no conformidades de calidad

**Estado:** `NO IMPLEMENTADO`, bloqueado por G2 y G3.

**Objetivo y problema probado.** Formalizar inspecciones, defectos, correccion y
verificacion de cierre con evidencia.

**Alcance y exclusiones.** Incluye planes de inspeccion, lotes/ubicaciones,
resultados, NCR, causa, accion correctiva y cierre. Excluye certificacion ante
organismos externos especificos.

**Dependencias.** G2, G3, checklists/incidencias F2.3, documentos F2.1 y
tareas/empleados; costos F3.2 permiten imputar retrabajo.

**Modelos y contratos.** `InspectionPlan`, `Inspection`, `NonConformance`,
`CorrectiveAction`; criterios versionados, resultado, severidad, disposition,
responsable, fechas y evidencia.

**Capas y archivos probables.** Extension tipada de checklist/issue o modelos
dedicados segun arquitectura, servicios/rutas/validaciones, UI de calidad.

**Pasos de implementacion.**

1. Definir taxonomia y estados con responsable de calidad.
2. Versionar plan/criterios y ejecutar inspeccion mobile.
3. Generar NCR desde resultado fallido.
4. Registrar causa, disposicion y accion correctiva.
5. Exigir verificacion independiente para cierre critico.
6. Vincular retrabajo, costo y documentos sin duplicarlos.

**Roles y segregacion.** Inspector registra; responsable ejecuta accion; calidad
verifica/cierra; autor de correccion no verifica casos criticos.

**Migracion y compatibilidad.** Incidencias previas solo se vinculan si un
usuario las clasifica; no reclasificar automaticamente.

**Frontend y estados.** Plan vigente, inspeccion parcial, conforme/no conforme,
NCR vencida, evidencia requerida, correccion, verificacion y reapertura.

**Aceptacion verificable.** NCR critica no cierra sin evidencia y verificador;
se rastrea desde criterio hasta accion/costo.

**Tests.** Versiones, severidad, segregacion, transiciones, evidencia, vencimiento,
tenant y costo opcional.

**Postman.** Plan → inspeccion → NCR → accion → verificacion/cierre y negativas.

**Seguridad, auditoria y observabilidad.** Historial inmutable; metricas de NCR
abiertas, reincidencia y tiempo de cierre con definicion visible.

**Definicion de terminado.** Flujo de calidad trazable, segregado, probado y
auditable de punta a punta.

### F4.2 — Seguridad laboral, permisos y acciones correctivas

**Estado:** `NO IMPLEMENTADO`, bloqueado por G2 y G3.

**Objetivo y problema probado.** Gestionar inspecciones de seguridad e
incidentes sin convertir MiObra en asesor legal ni ocultar obligaciones locales.

**Alcance y exclusiones.** Incluye observacion, incidente, casi accidente,
severidad, permiso/checklist configurable, accion y cierre. Excluye
interpretacion legal automatica, historia clinica y denuncia oficial integrada.

**Dependencias.** G2, G3, evidencia F2.1, empleados,
incidencias/checklists F2.3 y auditoria.

**Modelos y contratos.** `SafetyEvent`, `SafetyInspection`, `SafetyAction` con
clasificacion configurable, privacidad, participantes minimos, estado y
evidencia; plantillas por jurisdiccion versionadas por la empresa.

**Capas y archivos probables.** Modelos/servicios protegidos, rutas con permisos
especificos, storage con clasificacion sensible y UI de seguridad.

**Pasos de implementacion.**

1. Validar taxonomia y retencion con responsables locales.
2. Separar datos operativos de campos sensibles.
3. Implementar reporte rapido y escalamiento por severidad.
4. Crear investigacion, causa y acciones sin culpas automatizadas.
5. Exigir verificacion/cierre y controlar reapertura.
6. Implementar exportacion restringida y registro de acceso.

**Roles y segregacion.** Todo usuario habilitado reporta; seguridad investiga;
management consulta agregado; datos sensibles requieren permiso dedicado.

**Migracion y compatibilidad.** No migrar comentarios/pendientes automaticamente;
permitir vinculo manual y registrar origen.

**Frontend y estados.** Reporte mobile urgente, confirmacion clara, borrador,
escalado, investigacion restringida, accion vencida y contenido redactado.

**Aceptacion verificable.** Evento critico genera escalamiento; acceso sensible
queda auditado; cierre exige acciones/evidencia segun regla.

**Tests.** Privacidad, severidad, notificacion, segregacion, retencion,
transiciones, tenant y export.

**Postman.** Reporte, clasificacion, accion, cierre, acceso denegado y export
autorizado.

**Seguridad, auditoria y observabilidad.** Cifrado/proteccion reforzada, minimo
privilegio, log de lectura, alertas de evento critico y entrega fallida.

**Definicion de terminado.** Flujo aprobado por responsable de seguridad,
privacidad verificada y pruebas/Postman/auditoria completos.

**Gate G4.** Se aprueba cuando inspecciones, NCR y seguridad tienen plantillas
versionadas, segregacion, evidencia, acciones vencibles y cierre auditable.

## Fase 5 — Operacion SaaS comercial

### F5.1 — Suscripciones, pagos y enforcement de planes

**Estado:** `NO IMPLEMENTADO`, bloqueado por G4 y por definicion comercial
aprobada.

**Objetivo y problema probado.** Convertir los planes informativos del portal en
un servicio cobrable sin bloquear ni perder datos de una constructora por un
fallo de pago.

**Alcance y exclusiones.** Incluye catalogo versionado, trial, suscripcion,
checkout de proveedor, webhooks, facturas/estado, entitlements, limites, gracia,
morosidad, cancelacion y consola interna minima. Excluye contabilidad fiscal
multi-pais propia; se integra proveedor habilitado.

**Dependencias.** G4, matriz/permisos, auditoria, observabilidad, politicas de
retencion y decision de mercado/moneda/impuestos. No reutilizar directamente
`subscriptionPlans.js` como fuente de verdad de backend.

**Modelos y contratos.** `PlanVersion`, `Subscription`, `Entitlement`,
`BillingEvent`, referencia externa e idempotencia de webhook. Estado separado de
`Company.status`; servidor decide entitlement.

**Capas y archivos probables.** Modelos/repositorios/servicio billing, adaptador
de proveedor, rutas webhook/publicas/autenticadas, middleware entitlement,
Settings billing, consola interna y portal/constantes.

**Pasos de implementacion.**

1. Aprobar catalogo, metricas de limite y comportamiento de downgrade.
2. Elegir proveedor por pais, impuestos, medios y webhooks.
3. Modelar planes versionados y suscripcion sin confiar en precio cliente.
4. Implementar checkout/customer portal y webhooks firmados/idempotentes.
5. Calcular entitlements en servidor y cachearlos con invalidacion.
6. Aplicar limites primero con aviso, luego enforcement y gracia documentada.
7. Implementar morosidad/cancelacion sin borrar datos ni bloquear exportacion
   requerida por politica.
8. Conciliar eventos del proveedor y alertar diferencias.

**Roles y segregacion.** Owner administra billing; admin consulta si se habilita;
soporte interno usa consola auditada sin suplantacion invisible.

**Migracion y compatibilidad.** Empresas actuales reciben plan legacy/trial
explicito; activar enforcement solo tras reporte dry-run y comunicacion. Precios
del portal se sincronizan desde catalogo publicado.

**Frontend y estados.** Trial, plan actual, uso/limite, checkout, procesando,
pago fallido, gracia, downgrade pendiente, cancelado y portal proveedor.

**Aceptacion verificable.** Webhook repetido no duplica; precio/manipulacion
cliente no cambia plan; falla temporal no elimina acceso/datos; entitlement se
aplica igual en API y UI.

**Tests.** Firmas, idempotencia, orden fuera de secuencia, trial, pago fallido,
gracia, upgrade/downgrade, limite concurrente, tenant y reconciliacion.

**Postman.** APIs propias y fixtures de webhook firmados de test; secretos solo
como variables locales, nunca en coleccion.

**Seguridad, auditoria y observabilidad.** PCI delegado al proveedor, firma y
replay protection, auditoria de plan, metricas de webhook/reconciliacion y
alertas de bloqueo masivo.

**Definicion de terminado.** Ciclo de vida probado en sandbox y empresa piloto,
entitlements server-side, reconciliacion, rollback y soporte documentados.

**Gate G5.** Se aprueba cuando billing se reconcilia con proveedor, todos los
limites se aplican en servidor, existe gracia/rollback y ningun cambio de plan
borra datos.

## Fase 6 — Ecosistema, exportaciones y portales

### F6.1 — Exportaciones gobernadas y portal de cliente

**Estado:** `NO IMPLEMENTADO`, bloqueado por G5.

**Objetivo y problema probado.** Compartir avance, decisiones y entregables con
el cliente sin otorgarle acceso al backoffice ni exponer costos internos.

**Alcance y exclusiones.** Incluye export CSV/PDF versionada, paquetes de
reporte, usuarios externos, permisos por obra/documento, comentarios/aprobacion
acotada y revocacion. Excluye edicion de operacion interna.

**Dependencias.** G5, reporting confiable, documentos, auditoria, permisos y
entitlements aplicables.

**Modelos y contratos.** `ExternalAccess`, `ReportSnapshot`, `SharedDocument`,
`ClientDecision`; scopes explicitos, expiracion y snapshot de datos publicados.

**Capas y archivos probables.** Servicio de export/render, storage, rutas bajo
scope externo separado, modelos/repositorios, frontend portal y administracion
interna.

**Pasos de implementacion.**

1. Definir dataset publicable y campos siempre excluidos.
2. Crear snapshot/export asincrono con estado y checksum.
3. Modelar acceso externo por obra y expiracion.
4. Implementar portal separado con navegacion minima.
5. Agregar decisiones/comentarios acotados y notificacion.
6. Probar revocacion, descarga y cache.

**Roles y segregacion.** Manager publica; cliente externo solo ve scopes
otorgados; costos/margen/seguridad sensible quedan excluidos por defecto.

**Migracion y compatibilidad.** No compartir automaticamente documentos
existentes; cada publicacion requiere seleccion explicita.

**Frontend y estados.** Generando/listo/fallido/expirado, sin acceso, revocado,
sin reportes, decision pendiente y descarga accesible responsive.

**Aceptacion verificable.** Un cliente no enumera otras obras ni campos
internos; export refleja snapshot/fecha/filtros; revocacion corta acceso.

**Tests.** Field allowlist, tenant, scope, expiracion, revocacion, cache,
snapshot y descarga concurrente.

**Postman.** Crear acceso, publicar snapshot, consultar como externo, revocar y
casos cross-project.

**Seguridad, auditoria y observabilidad.** Tokens/sesiones externas separados,
watermark opcional, log de publicacion/descarga y alertas de enumeracion.

**Definicion de terminado.** Dataset gobernado, portal aislado, revocacion y
export reproducible con tests/Postman.

### F6.2 — Portal de proveedor

**Estado:** `NO IMPLEMENTADO`, bloqueado por G5 y F6.1 como patron de acceso
externo.

**Objetivo y problema probado.** Confirmar OC, fechas y documentos sin dar
acceso al modulo interno de compras.

**Alcance y exclusiones.** Incluye acceso por proveedor, OC publicadas,
confirmacion/rechazo, fecha prometida, carga de remito/factura y mensajes
acotados. Excluye subasta, marketplace y pago.

**Dependencias.** G5, OCs/recepciones, documentos, acceso externo F6.1 y
auditoria.

**Modelos y contratos.** `SupplierPortalAccess`, `PurchaseOrderDispatch`,
`SupplierAcknowledgement`; estados y version de OC publicada, contactos
autorizados, expiracion.

**Capas y archivos probables.** Modelos/servicios/rutas externas, notificaciones,
frontend portal, integracion con compra/documentos.

**Pasos de implementacion.**

1. Definir que campos de OC se publican y cuando.
2. Crear contacto/acceso revocable por proveedor.
3. Publicar version de OC y registrar entrega del aviso.
4. Permitir acuse, propuesta de fecha y documentos.
5. Convertir respuestas en eventos para compras, no en mutacion irrestricta.
6. Manejar revision/cancelacion de OC ya publicada.

**Roles y segregacion.** Comprador publica/resuelve; proveedor actua solo sobre
sus OCs; receptor interno conserva la recepcion fisica.

**Migracion y compatibilidad.** OCs anteriores no se publican automaticamente;
contactos se habilitan explicitamente.

**Frontend y estados.** Invitado, acceso vencido/revocado, OC vigente/revisada/
cancelada, confirmando, documento cargando y discrepancia.

**Aceptacion verificable.** Proveedor A no conoce OC de B; acuse no registra
recepcion; revision muestra version nueva y conserva respuesta previa.

**Tests.** Scope, version, expiracion, revocacion, documentos, cancelacion,
idempotencia y tenant.

**Postman.** Publicar, consultar externo, confirmar, proponer fecha, adjuntar,
revisar y negar cross-supplier.

**Seguridad, auditoria y observabilidad.** Acceso externo minimo, rate limit,
escaneo de archivos, auditoria y metricas de entrega/acuse.

**Definicion de terminado.** Portal aislado, versionado y auditable, con
respuestas integradas sin saltar controles internos.

**Gate G6.** Se aprueba cuando accesos externos estan separados, revocables y
probados contra enumeracion, y cada dato compartido proviene de un snapshot o
version explicita.

## Fase 7 — IA asistiva y explicable

### F7.1 — OCR de remitos y facturas con revision humana

**Estado:** `NO IMPLEMENTADO`, bloqueado por G6 y datos etiquetados suficientes.

**Objetivo y problema probado.** Reducir transcripcion sin convertir una
prediccion en recepcion o costo definitivo.

**Alcance y exclusiones.** Incluye OCR, extraccion de campos/lineas, confianza,
comparacion con OC y bandeja de revision. Excluye aprobacion, recepcion o pago
automaticos.

**Dependencias.** G6, documentos seguros F2.1, OC/recepcion F1.2, proveedor de
OCR evaluado, dataset representativo y politica de privacidad.

**Modelos y contratos.** `DocumentExtraction` versionada con proveedor/modelo,
campos, bounding boxes si existen, confianza, estado y correcciones humanas.
El documento original sigue siendo fuente primaria.

**Capas y archivos probables.** Adaptador OCR, job/cola durable, modelos/
repositorios/servicios, webhook si aplica, UI de comparacion y observabilidad.

**Pasos de implementacion.**

1. Medir baseline manual y definir campos/metricas de precision.
2. Preparar muestra anonimizada y evaluar proveedor/costo/region.
3. Implementar procesamiento asincrono idempotente.
4. Mostrar campo extraido junto a imagen, confianza y diferencia contra OC.
5. Exigir confirmacion humana antes de crear borrador de recepcion/costo.
6. Guardar correcciones para evaluacion, no entrenamiento implicito sin permiso.
7. Activar por tipos de documento y feature flag.

**Roles y segregacion.** Receptor/compras revisa; OCR nunca hereda permiso para
aprobar; acceso al documento respeta su clasificacion.

**Migracion y compatibilidad.** Procesar solo documentos seleccionados; no
realizar backfill masivo sin costo, consentimiento y dry-run.

**Frontend y estados.** En cola, procesando, baja confianza, no legible,
comparacion, correccion, confirmado y fallo/retry.

**Aceptacion verificable.** Ningun dato extraido impacta stock/costo sin humano;
se puede rastrear a archivo, region, modelo y correccion; precision se reporta
por campo.

**Tests.** Jobs duplicados, timeout, documento invalido, mapping, confianza,
permisos, tenant y confirmacion.

**Postman.** Encolar, consultar resultado, corregir/confirmar y errores; archivos
de prueba sin datos reales sensibles.

**Seguridad, auditoria y observabilidad.** DPA/retencion del proveedor,
redaccion, auditoria de envio/confirmacion y metricas de precision/costo/fallo.

**Definicion de terminado.** Piloto supera umbral acordado por campo, revision
humana obligatoria, costo observable y rollback por feature flag.

### F7.2 — Busqueda semantica, resumenes y alertas explicables

**Estado:** `NO IMPLEMENTADO`, bloqueado por G6 y calidad de datos medida.

**Objetivo y problema probado.** Ayudar a encontrar evidencia y priorizar
riesgos sin presentar texto plausible como hecho de obra.

**Alcance y exclusiones.** Incluye busqueda hibrida con ACL, resumen de partes/
incidencias, alertas basadas primero en reglas y luego modelos evaluados.
Excluye decisiones autonomas, aprobaciones y modificacion de registros fuente.

**Dependencias.** G6, documentos/partes/incidencias/costos versionados, permisos
centrales, auditoria, dataset de evaluacion y politica de proveedor/modelo.

**Modelos y contratos.** `SearchChunk` con tenant/ACL/source/version,
`GeneratedInsight` con fuentes, modelo/prompt version, confianza, periodo,
estado y feedback. Toda respuesta devuelve citas internas a entidades reales.

**Capas y archivos probables.** Pipeline de indexacion, vector/search store
justificado, servicio de retrieval, jobs, API, componentes de resultado/
fuentes/feedback y telemetria.

**Pasos de implementacion.**

1. Definir preguntas y alertas concretas con usuarios de obra.
2. Crear set de evaluacion con respuestas/fuentes esperadas y casos sin dato.
3. Implementar indexacion incremental respetando tenant y ACL.
4. Lanzar busqueda lexical/hibrida antes de resumen generativo.
5. Generar respuestas solo con contexto recuperado, citas y abstencion.
6. Implementar alertas deterministicas explicables; evaluar ML aparte.
7. Agregar feedback, monitoreo de calidad/costo/latencia y feature flag.

**Roles y segregacion.** Retrieval aplica permisos antes y despues de buscar;
IA no amplifica acceso. Margen, seguridad y datos personales mantienen ACL
especifica.

**Migracion y compatibilidad.** Indexar por lotes con checkpoint y borrado por
retencion; reindexar al cambiar ACL/version. Producto sigue operativo sin IA.

**Frontend y estados.** Buscando, fuentes, sin evidencia suficiente, respuesta
parcial, dato desactualizado, error/retry, feedback y aviso claro de asistencia.

**Aceptacion verificable.** Cero resultados cruzados en corpus adversarial;
respuesta cita fuentes accesibles o se abstiene; cada alerta explica regla y
datos; desactivar IA no afecta operacion.

**Tests.** ACL/tenant, borrado, version, prompt injection documental,
abstencion, citas, eval offline, timeout y fallback.

**Postman.** Indexar en entorno de test, buscar, resumir, feedback y casos de
ACL; no guardar claves de proveedor.

**Seguridad, auditoria y observabilidad.** Defensa contra prompt injection,
minimizacion/retencion, log de modelo/fuentes sin contenido sensible excesivo,
metricas de groundedness, costo, latencia y abstencion.

**Definicion de terminado.** Evaluacion acordada superada, aislamiento probado,
citas/abstencion obligatorias, feature flag y monitoreo operativo.

## 6. Orden obligatorio de toma de paquetes

1. Completar F0.1–F0.5 y aprobar G0.
2. Despues de G0, ejecutar F2.1 como fundacion documental comun; F1.1 puede
   avanzar en paralelo, pero F1.2 no comienza hasta que ambas esten terminadas.
3. Completar F1.2 y F1.3 y aprobar G1; F1.4 puede cerrar despues sin impedir el
   nucleo de G1 si sus indicadores no forman parte del piloto.
4. Tras G1, ejecutar F2.2–F2.4 y F3 respetando dependencias internas; no
   construir KPI economico sobre datos no reconciliados. Aprobar G2 y G3 antes
   de continuar.
5. Ejecutar F4 solo despues de G2 y G3, y aprobar G4.
6. Ejecutar F5 solo despues de G4 y con definicion comercial, soporte y rollback
   acordados; aprobar G5 antes de exponer el ecosistema.
7. Ejecutar todos los paquetes F6 despues de G5 y aprobar G6.
8. Ejecutar todos los paquetes F7 solo despues de G6 y con corpus, ACL,
   evaluacion y costo observables.

## 7. Reglas de entrega para cualquier agente

Para tomar un paquete, el agente debe:

1. confirmar su gate y dependencias con evidencia del repositorio;
2. relevar cambios ajenos con `git status --short`;
3. leer arquitectura, convenciones y verificacion;
4. publicar un plan limitado al paquete y sus criterios de aceptacion;
5. implementar verticalmente modelo, repositorio, servicio/controlador, ruta,
   validacion, cliente y UI solo cuando correspondan;
6. crear migracion idempotente, dry-run y rollback cuando cambie datos;
7. actualizar `postman_collection.json` para todo endpoint agregado, cambiado o
   usado, eliminando ejemplos obsoletos del modulo;
8. agregar tests automatizados del caso feliz, errores, permisos, tenant,
   concurrencia e idempotencia que apliquen;
9. ejecutar `npm run lint`, `npm run build:client`, suite relacionada y
   `npm run start` segun las capas tocadas;
10. entregar evidencia de aceptacion, comandos/resultados, archivos, migracion,
    riesgos y TODO real; el reviewer debe emitir veredicto.

No se considera terminado un paquete con solo UI, solo schemas, mocks, tests
omitidos, Postman desactualizado o una migracion no ensayada. Tampoco se debe
ampliar el alcance al paquete siguiente para “preparar” arquitectura: las
interfaces futuras se agregan cuando una dependencia concreta las requiera.
