# Convenciones rapidas

Resumen corto. La documentacion detallada vive en `docs/conventions.md`.

## Principios generales

- Mantener cambios chicos y orientados a una sola feature o bug.
- Separar responsabilidades entre rutas, controladores, repositorios, modelos
  y componentes React.
- Evitar logica duplicada. Si una regla se repite, moverla a un helper, un
  servicio o un componente reutilizable.
- No mezclar refactors con cambios funcionales grandes.
- Preferir nombres explicitos sobre abreviaciones.

## Verificacion basica

Desde la raiz:

```bash
npm run lint
npm run build:client
```

Si se toca el backend, validar ademas que la app arranque con:

```bash
npm run start
```
