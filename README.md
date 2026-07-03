# MiObra
Sistema de gestion de obras.

## Desarrollo

- Harness IA: [AGENTS.md](./AGENTS.md)
- Arquitectura: [docs/architecture.md](./docs/architecture.md)
- Convenciones: [docs/conventions.md](./docs/conventions.md)
- Roadmap de producto: [docs/roadmap-producto.md](./docs/roadmap-producto.md)
- SaaS multi-tenant: [docs/saas-multitenancy.md](./docs/saas-multitenancy.md)
- Verificacion: [docs/verification.md](./docs/verification.md)
- Convenciones rapidas: [CONVENTIONS.md](./CONVENTIONS.md)
- Validar frontend: `npm run lint`
- Build del cliente: `npm run build:client`
- Levantar backend en desarrollo: `npm run dev`
- Arranque de produccion local: `npm run start`

## Publicacion en Vercel

El repo esta preparado para desplegar frontend y API en un mismo proyecto de Vercel:

- `vercel.json` compila el frontend de `client` y lo publica desde `client/dist`.
- `api/index.mjs` expone la app Express como funcion serverless.
- Las rutas `/api/*` van al backend y el resto de rutas van al frontend React.

Variables de entorno necesarias en Vercel:

```env
NODE_ENV=production
PASS_JWT=<secreto-largo>
MONGO_BD_IN_USE=atlas
MONGO_ATLAS_URI=<connection-string-de-mongodb-atlas>
```

Opcional:

```env
CLIENT_URL=https://tu-dominio.vercel.app
VITE_API_URL=
```

Si frontend y API estan en el mismo proyecto de Vercel, `VITE_API_URL` puede quedar sin definir para usar `/api` en el mismo dominio.

Pasos:

1. Subir el repo a GitHub.
2. Entrar a Vercel y elegir `Add New... > Project`.
3. Importar el repositorio `MiObra`.
4. Dejar el framework como `Other`.
5. Agregar las variables de entorno anteriores en `Settings > Environment Variables`.
6. Hacer deploy.

Build command usado por Vercel:

```sh
npm --prefix client ci && npm --prefix client run build
```

Output directory:

```txt
client/dist
```

## MongoDB Atlas

Para usar Atlas, dejar `MONGO_BD_IN_USE=atlas` en `.env`.

Opcion recomendada:

```env
MONGO_ATLAS_URI=mongodb+srv://<user>:<password>@<cluster-host>/<database>?retryWrites=true&w=majority&appName=<app-name>
```

Opcion por partes:

```env
MONGO_ATLAS=<cluster-host>
MONGO_ATLAS_USER=<user>
MONGO_ATLAS_PASS=<password>
MONGO_ATLAS_DB=miobra_db
MONGO_ATLAS_APP_NAME=MiObra
```
