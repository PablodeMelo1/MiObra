# Convenciones

Estas reglas buscan mantener MiObra simple, consistente y facil de modificar
sin cambiar comportamiento existente por accidente.

## Lenguaje y estilo

- Escribir documentacion y mensajes del proyecto en espanol.
- Mantener nombres claros y consistentes. Si un modulo ya esta en ingles,
  seguir ese idioma; si el dominio vive en espanol, no mezclar ambos dentro del
  mismo archivo sin necesidad.
- Seguir el estilo del archivo que se esta editando antes de introducir uno
  nuevo.
- Evitar comentarios obvios. Agregar comentarios solo cuando aclaren una regla
  de negocio o una decision no evidente.

## Backend

- Usar JavaScript en modo ESM.
- Las rutas viven en `src/routes/v1`.
- Los controladores viven en `src/controllers`.
- Los repositorios viven en `src/repositories`.
- Los modelos viven en `src/model`.
- Los middlewares viven en `src/middleware`.
- Los servicios viven en `src/services`.
- Los helpers compartidos viven en `src/utils`.
- Las validaciones viven en `src/validations`.
- No poner logica de negocio directamente en rutas.
- No consultar MongoDB directamente desde rutas si ya existe repositorio.
- Preferir repositorios para encapsular acceso a datos.
- Validar campos requeridos en el borde HTTP o con validadores dedicados.
- Responder errores HTTP de forma explicita y consistente.
- Mantener nombres alineados con el dominio: proyectos, tareas, comentarios,
  inventario, pendientes, proveedores, solicitudes de materiales, grupos,
  zonas y usuarios.

## Frontend

- Usar React con Vite y React Router.
- `client/src/pages` contiene vistas completas conectadas a rutas.
- `client/src/components` contiene componentes reutilizables o especificos de
  una feature.
- `client/src/context` contiene providers compartidos.
- `client/src/api` encapsula llamadas HTTP. Las paginas no deben construir URLs
  manualmente si ya existe un cliente de API.
- `client/src/services` agrupa transformaciones, snapshots y logica compartida
  entre pantallas.
- `client/src/utils` y `client/src/constants` guardan logica y valores
  compartidos.
- Reutilizar piezas existentes como `PageShell`, `Sidebar`, `ProtectedRoute`,
  `PublicRoute`, `LoadingScreen`, `EmptyState`, `MetricTile` y `StatusBadge`
  antes de crear algo nuevo.
- Evitar componentes monoliticos y codigo dificil de seguir. Separar
  presentacion, coordinacion, acceso a datos y logica reutilizable cuando esa
  separacion haga mas claro el flujo.
- No duplicar JSX, clases, logica de estado ni transformaciones. Antes de
  crear una implementacion nueva, revisar componentes, hooks y utilidades
  existentes.
- Mantener el codigo facil de leer: nombres descriptivos, props acotadas,
  condiciones simples y funciones pequenas con una unica intencion.
- Mantener mobile first y accesibilidad: HTML semantico, labels, estados de
  foco y soporte de movimiento reducido cuando haya animaciones.
- Preservar el estilo visual oscuro y operativo del dashboard actual.

## Validaciones y tipos

- Si en el futuro se agrega TypeScript, mantener tipos estrictos y evitar
  `any` o castings inseguros como regla general.
- No agregar dependencias sin justificarlo por la feature.

## Postman

- La coleccion local vive en `postman_collection.json`.
- Si una feature agrega, cambia o usa endpoints HTTP, actualizar esa coleccion
  con ejemplos suficientes para probar el flujo implementado.
- Incluir un caso feliz y, cuando aplique, casos de error relevantes.

## Git

- Usar ramas `feature/`, `fix/` o `refactor/` cuando el flujo de trabajo lo
  requiera.
- Escribir commits en ingles siguiendo Conventional Commits:
  `<type>(scope): description`.
- No subir credenciales ni `.env` con secretos.
