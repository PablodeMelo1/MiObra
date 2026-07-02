# Verificacion

## Frontend

La verificacion obligatoria para cambios en `client/` es:

```bash
npm run lint
npm run build:client
```

Si hace falta diagnosticar una falla por separado, ejecutar primero `npm run
lint` y luego `npm run build:client`.

## Backend

Hoy el repositorio no tiene una suite automatizada de tests para el backend.
Para cambios en API, controladores, repositorios o modelos, la verificacion
minima es:

```bash
npm run start
```

Luego hay que probar manualmente el flujo afectado, idealmente con
`postman_collection.json` y con una base MongoDB local o Atlas segun el
`MONGO_BD_IN_USE` que este usando el entorno.

## Despliegue

Si el cambio toca arranque, rutas o estructura del build, validar ademas que
`vercel.json` siga apuntando a `api/index.mjs` y a `client/dist`.

## Criterio de cierre

Una tarea puede considerarse terminada cuando:

- La solicitud del usuario esta implementada dentro del scope pedido.
- El frontend pasa `npm run lint` y `npm run build:client` si fue tocado.
- El backend arranca con `npm run start` y el flujo afectado fue probado.
- No quedan archivos temporales, logs de debug ni TODOs nuevos sin contexto.
- La respuesta final indica archivos modificados y verificacion corrida.
