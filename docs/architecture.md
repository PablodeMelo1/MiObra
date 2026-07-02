# Arquitectura

## Objetivo del proyecto

MiObra es un sistema interno de gestion de obras para centralizar proyectos,
tareas, inventario, solicitudes de materiales, proveedores, pendientes y
usuarios en una sola plataforma.

## Stack actual

- MongoDB
- Node.js
- Express
- Mongoose
- JavaScript en modo ESM
- Joi para validacion de requests
- JWT, cookies y `cookie-parser` para sesion y autenticacion
- bcrypt para contraseñas
- React
- Vite
- React Router
- Tailwind CSS
- Vercel para despliegue del frontend y la API

## Estructura general del repositorio

```text
MiObra/
  AGENTS.md
  .agents/
  api/
  client/
  docs/
  postman_collection.json
  src/
  README.md
  CONVENTIONS.md
  vercel.json
```

## Backend

### Entrada y bootstrap

- `src/app.mjs` configura Express, CORS, JSON, cookies, healthcheck y rutas.
- `src/config/mongo-config.mjs` resuelve la conexion a MongoDB local o Atlas.
- `api/index.mjs` expone la app para Vercel.
- `vercel.json` conecta `/api/*` con la API y deja el resto para el frontend.

### Capas del backend

```text
src/
  config/
  constants/
  controllers/
  error/
  middleware/
  model/
  repositories/
  routes/v1/
  services/
  utils/
  validations/
```

- `config/`: configuracion general y conexiones.
- `constants/`: enums, estados y valores compartidos.
- `controllers/`: coordinan request y response. No deberian contener acceso
  directo a Mongo si ya existe repositorio.
- `error/`: helpers para errores HTTP y manejo consistente.
- `middleware/`: autenticacion, autorizacion, validacion y sanitizacion.
- `model/`: schemas de Mongoose.
- `repositories/`: acceso a datos y consultas encapsuladas.
- `routes/v1/`: declaracion de endpoints y middlewares asociados.
- `services/`: reglas que combinan varios repositorios o pasos de negocio.
- `utils/`: helpers reutilizables.
- `validations/`: validaciones de entrada con Joi.

### Flujo recomendado de una request

1. La ruta recibe la solicitud.
2. El middleware valida autenticacion, permisos o payload si corresponde.
3. El controlador valida lo minimo necesario y delega.
4. El repositorio consulta o modifica MongoDB.
5. El controlador devuelve la respuesta HTTP.

### Dominios principales del backend

- autenticacion y sesion de usuario
- proyectos y miembros de proyecto
- tareas y comentarios
- solicitudes de materiales
- inventario y movimientos
- pendientes
- proveedores
- grupos
- zonas
- usuarios

## Frontend

### Estructura

```text
client/
  src/
    api/
    components/
    constants/
    context/
    pages/
    services/
    utils/
    App.jsx
    main.jsx
```

- `client/src/App.jsx` define el routing principal.
- `client/src/context/` contiene providers compartidos, como autenticacion.
- `client/src/api/` encapsula llamadas HTTP.
- `client/src/services/` agrupa transformaciones y consultas de datos.
- `client/src/components/` contiene UI reutilizable y componentes por feature.
- `client/src/pages/` contiene las vistas conectadas a rutas.

### Piezas de UI y flujo

- `ProtectedRoute` y `PublicRoute` separan rutas privadas y publicas.
- `LoadingScreen` cubre estados de carga.
- `PageShell` y `Sidebar` estructuran la aplicacion autenticada.
- El dashboard consume datos agregados para mostrar metricas de obra,
  materiales, tareas e inventario.

## Criterios arquitectonicos

- Mantener separadas las capas HTTP, negocio y persistencia.
- Evitar logica de negocio directamente en rutas.
- Evitar acceso directo a modelos desde controladores si ya existe repositorio.
- Validar entradas antes de procesarlas.
- Reutilizar componentes, hooks, servicios y utilidades existentes antes de
  crear una nueva abstraccion.
- Diseñar para crecimiento sin rehacer estructura.
- Preservar el estilo oscuro y operativo del frontend actual.

## Despliegue

El proyecto esta preparado para Vercel:

- `api/index.mjs` expone la API Express.
- `vercel.json` publica `client/dist` como frontend estatico.
- Las rutas `/api/*` van al backend y el resto a `index.html`.
