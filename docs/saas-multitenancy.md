# Arquitectura SaaS multi-tenant para MiObra

## Objetivo

MiObra debe operar como una sola plataforma SaaS donde muchas empresas
conviven de forma aislada. Cada empresa ve solo sus propios datos y administra
sus usuarios, empleados, obras, inventario, proveedores, documentos y
settings.

La recomendacion es usar un modelo de **base compartida con scoping por
`companyId`**:

- una sola aplicacion,
- una sola base de codigo,
- una sola base de datos,
- y todos los registros de negocio asociados a una empresa.

## Por que este modelo

### Economia

- reduce costo de infraestructura,
- evita despliegues por cliente,
- simplifica soporte,
- permite vender por suscripcion,
- y escala sin multiplicar operaciones.

### Mantenimiento

- una sola version del software,
- una sola evolucion funcional,
- menos ramas de codigo por cliente,
- menos riesgo de inconsistencia entre instalaciones.

### Usabilidad

- una empresa entra a su propio espacio,
- no ve datos de otras empresas,
- puede invitar empleados y usuarios,
- y trabaja con un contexto estable.

### Escalabilidad

- permite miles de empresas pequeñas y medianas,
- deja abierta la posibilidad de aislar una cuenta enterprise mas adelante,
- y mantiene consultas eficientes con indices compuestos.

## Modelo de datos exacto

### `Company`

Entidad raiz del tenant.

Campos recomendados:

- `_id`
- `name`
- `legalName`
- `taxId`
- `status` con valores `active`, `trial`, `suspended`, `inactive`
- `plan`
- `billingStatus`
- `timezone`
- `currency`
- `logoUrl`
- `createdByUserId`
- `createdAt`
- `updatedAt`

Reglas:

- toda entidad operativa de la empresa debe referenciar `companyId`,
- `Company` es la fuente de verdad del tenant,
- el plan y el estado de facturacion pueden vivir dentro de `Company` al
  principio; si luego hacen falta facturas o suscripciones mas complejas, se
  separan a `Subscription` o `BillingAccount`.

### `CompanyMember`

Relacion entre usuario y empresa.

Campos recomendados:

- `_id`
- `companyId`
- `userId`
- `role` con valores como `owner`, `admin`, `manager`, `supervisor`,
  `operator`, `viewer`
- `status` con valores `active`, `invited`, `disabled`
- `invitedByUserId`
- `joinedAt`
- `createdAt`
- `updatedAt`

Reglas:

- un usuario accede a una empresa a traves de esta membresia,
- `companyId + userId` debe ser unico,
- el rol se evalua dentro del contexto de la empresa, no globalmente.

### `Employee`

Persona operativa dentro de una empresa.

Campos recomendados:

- `_id`
- `companyId`
- `fullName`
- `documentType`
- `documentNumber`
- `position`
- `department`
- `phone`
- `workEmail`
- `status`
- `hireDate`
- `leaveDate`
- `notes`
- `userId` nullable y unico
- `createdByUserId`
- `createdAt`
- `updatedAt`

Reglas:

- un empleado pertenece a una sola empresa,
- `userId` es opcional porque no todos los empleados necesitan cuenta,
- si existe `workEmail`, se usa para invitacion o vinculo automatico,
- `companyId + documentNumber` deberia ser unico si el negocio lo permite.

### `EmployeeInvitation`

Invitacion por mail para vincular un usuario a un empleado.

Campos recomendados:

- `_id`
- `companyId`
- `employeeId`
- `email`
- `tokenHash`
- `status` con valores `pending`, `sent`, `accepted`, `expired`, `revoked`
- `sentAt`
- `expiresAt`
- `acceptedAt`
- `acceptedUserId`
- `createdByUserId`
- `createdAt`
- `updatedAt`

Reglas:

- la invitacion debe pertenecer a una empresa,
- el token real no se guarda en claro,
- la invitacion vence,
- una invitacion aceptada o revocada no se reutiliza.

### Scope obligatorio por empresa

Todo modelo de negocio debe incluir `companyId`, por ejemplo:

- `Project`
- `Task`
- `ProjectMember`
- `Item`
- `InventoryMovement`
- `MaterialRequest`
- `Supplier`
- `Pending`
- `Group`
- `Zone`
- `Comment`
- `Document` o futura entidad documental

## Como funciona

### Registro de la primera cuenta

1. Una empresa nueva se registra.
2. Se crea `Company`.
3. Se crea `User` para el admin inicial.
4. Se crea `CompanyMember` con rol `owner` o `admin`.
5. El admin queda dentro del contexto de esa empresa.

### Ingreso normal

1. El usuario inicia sesion con su email y password.
2. El backend valida sus credenciales.
3. Se resuelve su empresa activa.
4. La sesion guarda o deriva `activeCompanyId`.
5. Todas las consultas posteriores se ejecutan filtradas por esa empresa.

### Cambio de empresa

Si un usuario pertenece a mas de una empresa:

1. el frontend muestra un selector de empresa,
2. el usuario elige contexto,
3. el backend valida membresia,
4. se actualiza la empresa activa de la sesion.

Si el producto arranca con una sola empresa por usuario, el mismo modelo
sigue sirviendo. La diferencia es que el selector de empresa queda oculto hasta
que haga falta.

### Alta de empleados

1. Un admin crea un `Employee`.
2. Si hay `workEmail`, puede enviar una invitacion.
3. El sistema crea `EmployeeInvitation`.
4. Se envia un link con token al mail del empleado.
5. Si el empleado ya tiene `User`, se vincula la cuenta.
6. Si no tiene cuenta, se crea al registrarse o se asocia manualmente luego.

### Asignacion de tareas

Las tareas deben asignarse a `Employee`, no a `User`.

Flujo:

1. El supervisor crea una tarea dentro de una empresa.
2. La tarea se guarda con `companyId`.
3. La asignacion apunta a uno o mas `employeeId`.
4. Si el empleado tiene usuario vinculado, puede ver sus tareas en su sesion.

### Aislamiento de datos

La regla de seguridad es simple:

- toda query de negocio debe filtrar por `companyId`,
- el middleware de autorizacion debe confirmar que el usuario pertenece a esa
  empresa,
- y ninguna empresa debe poder leer datos de otra aunque conozca un `_id`.

## Como implementarlo en MiObra

### 1. Agregar el modelo `Company`

Crear `src/model/company-schema.mjs` y su repositorio/controlador si hace
falta para administrar empresas.

### 2. Agregar membresias

Crear `src/model/companyMember-schema.mjs` y `CompanyMemberRepository`.

### 3. Migrar entidades a `companyId`

Agregar `companyId` a:

- proyectos,
- tareas,
- comentarios,
- inventario,
- movimientos,
- solicitudes de materiales,
- proveedores,
- pendientes,
- grupos,
- zonas,
- empleados,
- invitaciones,
- settings.

### 4. Resolver contexto activo

Actualizar autenticacion y middlewares para que cada request conozca:

- `userId`
- `companyId`
- `role`

La fuente del contexto puede ser:

- la sesion,
- un header `X-Company-Id`,
- o el ultimo contexto activo guardado por el frontend.

### 5. Filtrar repositorios

Todos los repositorios deben recibir o inferir `companyId` y usarlo en cada
query.

### 6. Ajustar frontend

Agregar:

- selector de empresa,
- invitaciones,
- onboarding de empresa,
- administracion de empleados,
- cambio de contexto visible solo cuando el usuario pertenezca a mas de una
  empresa.

### 7. Ajustar verificaciones

- pruebas de aislamiento por empresa,
- casos de invitacion,
- casos de cambio de contexto,
- casos de intento de acceso cruzado entre empresas.

### 8. Migracion de datos existentes

Para pasar el sistema actual a multi-tenant:

1. crear una empresa por defecto,
2. asignar los registros existentes a esa empresa,
3. crear el owner inicial,
4. migrar usuarios y relaciones,
5. validar que todas las consultas queden scopiadas.

## Reglas tecnicas recomendadas

- No confiar en IDs sueltos sin `companyId`.
- No guardar datos globales si en realidad pertenecen a una empresa.
- Usar indices compuestos por `companyId`.
- Mantener la membresia como base de autorizacion.
- Preferir una sola estrategia de scoping en backend y frontend.
- No duplicar estado de empresa en demasiados lugares; usar un contexto activo.

## Resultado esperado

Con este modelo, MiObra queda preparado para:

- venderse por empresa,
- crecer por planes,
- mantener aislamiento fuerte entre clientes,
- y escalar sin rehacer la arquitectura.

