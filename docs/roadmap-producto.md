# Roadmap de producto para MiObra

## Contexto

MiObra ya cubre una base operativa importante: proyectos, tareas, inventario,
pendientes, proveedores, solicitudes de materiales y usuarios.

El siguiente paso no es sumar pantallas sueltas, sino convertir el producto en
una plataforma realmente valiosa para empresas de construccion. En este
mercado, el valor esta en resolver:

- desorden operativo en obra,
- trazabilidad de materiales y compras,
- control de costos,
- evidencia y seguimiento,
- aprobaciones,
- documentos,
- y decision operativa con datos reales.

## 1. SaaS multi-tenant y aislamiento por empresa

MiObra deberia operar como una unica plataforma SaaS donde conviven muchas
empresas aisladas entre si. Cada empresa tendra su propio espacio, sus
usuarios, sus empleados, sus obras, su inventario y sus documentos.

### Recomendacion principal

1. Crear una entidad `Company` como raiz del tenant.
2. Asociar todo dato operativo a `companyId`.
3. Separar `User` de la empresa mediante membresias.
4. Resolver permisos y alcance de datos por empresa.
5. Permitir invitaciones por mail para sumar usuarios y empleados.
6. Mantener una sola base de codigo y una sola aplicacion para todos los
   clientes.

### Por que esta estrategia es la correcta

- es mas economica de operar,
- es mas simple de mantener,
- escala mejor que una instancia por cliente,
- permite onboardear empresas nuevas sin desplegar otra aplicacion,
- y evita duplicar logica o infraestructura.

### Implicancia de producto

- cada empresa compra una suscripcion o plan,
- cada empresa administra sus propios empleados y usuarios,
- ninguna empresa ve datos de otra,
- el sistema puede crecer con modulos por plan,
- y el soporte tecnico se vuelve mucho mas manejable.

### Regla de oro

Todo documento, tarea, proyecto, empleado, material, proveedor, invitacion o
configuracion que pertenezca a una empresa debe incluir `companyId`.

## 2. Validacion de email al crear cuenta

No existe una forma 100% confiable de saber si un mail "existe" sin que el
usuario interactue con esa casilla. La validacion correcta es confirmar que
tiene acceso al correo.

### Enfoque recomendado

1. Crear la cuenta en estado `pending` o `unverified`.
2. Enviar un email con link o codigo de verificacion.
3. Activar la cuenta solo cuando el usuario confirme.
4. Permitir reenviar verificacion.
5. Expirar el token de verificacion.
6. Agregar rate limit para evitar abuso.

### Capas complementarias

- Validar formato del email.
- Validar dominio y MX records.
- Opcionalmente usar un proveedor externo de deliverability si hay volumen.
- Para cuentas sensibles, pedir tambien OTP en el primer acceso.

### Recomendacion para MiObra

La implementacion mas util es:

- registro con cuenta no verificada,
- envio automatico de verificacion,
- bloqueo de acciones sensibles hasta validar email,
- reenvio de verificacion,
- y auditoria del estado de verificacion.

## 3. Empleados y vinculacion de cuentas

La empresa necesita una lista operativa de empleados independiente de las
cuentas de acceso. No todos los empleados deben tener usuario en el sistema,
pero todos deben poder ser asignados a tareas, obras y reportes.

### Modelo de datos exacto

#### `Employee`

Entidad operativa principal. Representa a la persona que trabaja para la
empresa, tenga o no acceso al sistema.

Campos recomendados:

- `_id`
- `fullName`
- `documentType`
- `documentNumber`
- `position`
- `department`
- `phone`
- `workEmail` nullable
- `status` con valores como `active`, `inactive`, `on_leave`, `left`
- `hireDate`
- `leaveDate` nullable
- `notes` nullable
- `userId` nullable y unico, referencia a `User`
- `createdByUserId`
- `createdAt`
- `updatedAt`

Reglas:

- `fullName` es obligatorio.
- `userId` solo existe cuando el empleado ya tiene cuenta de acceso.
- `workEmail` es opcional, pero si existe debe quedar normalizado en minusculas.
- `userId` debe ser unico para evitar que dos cuentas apunten al mismo empleado.

#### `User`

Cuenta de acceso al sistema.

Campos actuales:

- `_id`
- `name`
- `email`
- `passwordHash`
- `tipoUsuario`

Ajuste recomendado:

- mantener `User` como cuenta de autenticacion,
- no duplicar la relacion con otro campo persistido si no hace falta,
- resolver la vinculacion desde `Employee.userId` y, si se necesita navegar
  desde `User`, usar populate o una relacion virtual.

#### `EmployeeInvitation`

Registro de invitacion por mail para vincular una cuenta a un empleado.

Campos recomendados:

- `_id`
- `employeeId`
- `email`
- `tokenHash`
- `status` con valores `pending`, `sent`, `accepted`, `expired`, `revoked`
- `sentAt`
- `expiresAt`
- `acceptedAt` nullable
- `acceptedUserId` nullable
- `createdByUserId`
- `createdAt`
- `updatedAt`

Reglas:

- cada invitacion debe apuntar a un solo empleado,
- el token real no se guarda en claro, solo su hash,
- la invitacion expira,
- una invitacion aceptada o revocada no se reutiliza.

### Flujo recomendado

1. Admin crea el `Employee`.
2. Si el empleado tiene mail, el admin puede enviar una invitacion.
3. El sistema genera `EmployeeInvitation` y envia un link con token.
4. Si la persona se registra con ese mismo mail, la cuenta se vincula al
   empleado de forma automatica o en el paso final del registro.
5. Si la cuenta ya existe, el usuario puede aceptar la invitacion y quedar
   vinculada al `Employee`.
6. Si el empleado no tiene mail, el admin puede dejarlo sin vincular hasta que
   exista una cuenta o hacer la asociacion manual desde el panel.

### Relacion con tareas

Las tareas no deberian depender de `User` como entidad operativa principal.
Lo ideal es que la asignacion sea contra `Employee`.

Campos recomendados para `Task`:

- `assignedEmployeeIds` como array de referencias a `Employee`
- `createdByUserId`
- `updatedByUserId` opcional

Eso permite:

- asignar tareas a personas aunque no tengan cuenta,
- mantener trazabilidad real de obra,
- mostrar tareas a los usuarios que estan vinculados a su empleado,
- y no obligar a que todos los operarios tengan login.

### Por que este modelo es mejor

- separa acceso del sistema de la realidad operativa de la empresa,
- evita crear cuentas para todo el personal,
- mejora asignacion y trazabilidad,
- permite crecer hacia asistencia, cuadrillas, productividad y costos por
  persona.

## 4. Settings que conviene implementar

La seccion de settings no deberia quedar vacia. Deberia funcionar como el
centro de configuracion de la empresa y de la operacion.

### Settings de empresa

- nombre comercial,
- razon social,
- RUT y datos fiscales,
- logo,
- direccion,
- telefono,
- zona horaria,
- moneda,
- horarios de atencion.

### Seguridad y acceso

- forzar verificacion de email,
- activar o desactivar 2FA,
- politica de contraseñas,
- expiracion de sesiones,
- invitaciones por email,
- limite de intentos de login.

### Roles y permisos

- roles base por empresa,
- permisos por modulo,
- aprobaciones por nivel,
- visibilidad por rol,
- acceso a inventario, proveedores, tareas, materiales y compras.

### Obra y operacion

- estados custom de tareas,
- prioridades habilitadas,
- plantillas de proyecto,
- umbrales de stock critico,
- deposito o ubicaciones,
- notificaciones por evento.

### Compras y abastecimiento

- flujo de aprobacion de materiales,
- proveedores favoritos,
- centro de costos,
- reglas de reaprovisionamiento,
- alertas por entrega pendiente.

### Observabilidad operativa

- auditoria de cambios,
- historial de aprobaciones,
- retencion de documentos,
- logs de actividad,
- trazabilidad por usuario.

## 5. Features que agregan valor real

### Valor inmediato

- solicitudes de materiales con aprobacion,
- ordenes de compra,
- trazabilidad por obra,
- stock critico y alertas,
- fotos y evidencia por tarea,
- reporte diario de obra,
- gestion documental basica,
- estados configurables,
- roles y permisos mas finos.

### Valor economico

- presupuesto por obra,
- costo real vs costo estimado,
- desviacion de presupuesto,
- horas o jornales por proyecto,
- change orders o ampliaciones de alcance,
- margen estimado por obra.

### Valor operativo

- mobile-first real,
- PWA,
- modo offline o semioffline,
- checklist de avance,
- incidencias,
- firma o conformidad simple en campo.

### Valor estrategico

- portal de cliente,
- portal de proveedor,
- exportaciones PDF/CSV,
- analitica de productividad,
- alertas inteligentes,
- busqueda semantica sobre documentos.

### Valor diferencial con IA

- resumen automatico de actividad por obra,
- consulta conversacional de documentos,
- deteccion de riesgo de atraso,
- deteccion de stock critico,
- clasificacion de documentos,
- OCR para remitos o facturas,
- sugerencias de prioridad para supervisores.

## 6. Roadmap profesional

### Fase 0 - Base operativa

Objetivo:

- dejar el producto listo para operar como software serio de empresa.

Entregables:

- foundation multi-tenant con `Company` y `CompanyMember`,
- listado de empleados,
- invitacion por mail y vinculacion de cuentas,
- settings de empresa por company,
- verificacion de email,
- roles y permisos claros,
- auditoria basica,
- estandarizacion visual y de UX,
- configuracion de defaults operativos.

Resultado esperado:

- menos cuentas falsas,
- menos friccion de onboarding,
- mejor control de quien puede hacer que.

### Fase 1 - Control de obra y abastecimiento

Objetivo:

- cerrar el circuito entre obra, deposito, compras y aprobacion.

Entregables:

- solicitudes de materiales,
- aprobaciones,
- ordenes de compra,
- seguimiento de entrega,
- stock critico,
- trazabilidad completa por obra.

Resultado esperado:

- menos compras duplicadas,
- menos faltantes,
- menos dependencia de WhatsApp,
- mas control sobre materiales.

### Fase 2 - Control financiero

Objetivo:

- pasar de gestion operativa a gestion de rentabilidad.

Entregables:

- presupuesto por obra,
- costo real vs estimado,
- desviacion por rubro,
- horas o jornales,
- change orders,
- margen por proyecto.

Resultado esperado:

- visibilidad sobre donde se pierde margen,
- mejor toma de decisiones,
- priorizacion de obras y compras con criterio economico.

### Fase 3 - Campo digital

Objetivo:

- llevar la experiencia de obra al celular.

Entregables:

- PWA o app ligera,
- fotos por tarea y por obra,
- reporte diario,
- incidencias,
- checklists,
- modo offline si hace falta.

Resultado esperado:

- menos papel,
- menos perdida de informacion,
- mas evidencia y trazabilidad.

### Fase 4 - Calidad, seguridad y compliance

Objetivo:

- subir el nivel de control y profesionalizacion.

Entregables:

- checklist de seguridad,
- no conformidades,
- documentos obligatorios,
- vencimientos,
- auditoria de cambios,
- seguimiento de acciones correctivas.

Resultado esperado:

- menor riesgo,
- mejor cumplimiento,
- mejor posicionamiento para empresas mas grandes.

### Fase 5 - Inteligencia y automatizacion

Objetivo:

- convertir datos de obra en recomendaciones utiles.

Entregables:

- busqueda semantica,
- asistente de IA,
- resumenes automaticos,
- alertas de riesgo,
- OCR,
- clasificacion de documentos.

Resultado esperado:

- ahorro de tiempo real,
- menos busquedas manuales,
- mas capacidad de reaccion.

### Fase 6 - Ecosistema

Objetivo:

- expandir MiObra mas alla del equipo interno.

Entregables:

- portal de cliente,
- portal de proveedor,
- integraciones externas,
- exportaciones,
- multiempresa si el negocio lo pide.

Resultado esperado:

- mas retencion,
- mas valor por cuenta,
- posibilidad de escalar comercialmente.

## 7. Prioridad recomendada

### MUST HAVE

- settings de empresa,
- verificacion de email,
- roles y permisos,
- auditoria basica,
- solicitudes de materiales,
- aprobacion de materiales,
- ordenes de compra,
- stock critico,
- trazabilidad por obra,
- fotos y evidencia,
- reporte diario de obra,
- documentos basicos,
- estados configurables.

### SHOULD HAVE

- presupuesto por obra,
- costo real vs estimado,
- desvio de presupuesto,
- horas o jornales,
- change orders,
- mobile-first real,
- PWA,
- notificaciones configurables,
- portal de cliente de solo lectura,
- checklist de seguridad.

### COULD HAVE

- IA documental,
- busqueda semantica,
- OCR,
- resumenes automaticos,
- analitica avanzada,
- score de proveedores,
- portal de proveedor,
- exportaciones avanzadas,
- digital twin liviano,
- prediccion de riesgo.

### WON'T HAVE NOW

- chat interno social,
- gamificacion,
- CRM generico,
- funcionalidades sin proceso claro,
- multiempresa complejo desde el inicio,
- automatizaciones demasiado amplias sin datos.

## 6. Orden de ejecucion recomendado

1. Settings + verificacion de email + roles/permisos.
2. Solicitudes de materiales + aprobaciones + ordenes de compra.
3. Stock critico + trazabilidad de deposito.
4. Reporte diario + fotos + incidencias.
5. Presupuesto por obra + costo real.
6. Mobile/PWA.
7. IA documental y alertas inteligentes.
8. Portal de cliente y proveedor.

## 7. Posicionamiento del producto

MiObra deberia posicionarse como:

- control operativo de obra,
- abastecimiento y compras,
- seguimiento y evidencia,
- control financiero,
- y automatizacion con IA sobre procesos reales.

Eso tiene mas valor de mercado que un sistema de tareas generalista.
