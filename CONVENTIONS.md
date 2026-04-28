# Convenciones del proyecto

Estas reglas buscan mantener MiObra simple, escalable y facil de modificar sin cambiar comportamiento existente por accidente.

## Principios generales

- Mantener cambios chicos y orientados a una feature o bug.
- Separar responsabilidades: rutas definen endpoints, controladores coordinan request/response, repositorios acceden a datos, modelos definen persistencia y componentes React renderizan UI.
- Evitar logica duplicada. Si una regla se repite en varios lugares, moverla a una funcion utilitaria, constante o servicio.
- No mezclar refactors con cambios funcionales grandes. Primero ordenar, despues cambiar comportamiento.
- Preferir nombres explicitos sobre abreviaciones.

## Backend

- `src/app.mjs` solo configura infraestructura: middlewares globales, rutas, healthcheck, error handler y arranque del servidor.
- `src/routes/v1/*.mjs` solo conecta HTTP con controladores y middlewares.
- `src/controllers/*.mjs` valida datos minimos de request, llama repositorios/servicios y devuelve respuestas HTTP.
- `src/repositories/*.mjs` encapsula consultas a Mongoose. Los controladores no deben usar modelos directamente si ya existe un repositorio.
- `src/model/*.mjs` define schemas, indices y defaults de Mongoose.
- `src/constants/*.mjs` guarda enums, estados y valores compartidos.
- `src/services/*.mjs` se usa cuando una operacion combina varias reglas de negocio o repositorios.
- Los errores deben pasar por `createError` o respuestas HTTP explicitas cuando el error es esperado.

## Frontend

- `client/src/pages` contiene vistas completas conectadas a rutas.
- `client/src/components` contiene componentes reutilizables o especificos de una feature.
- `client/src/api` encapsula llamadas HTTP. Las paginas no deben construir URLs manualmente si ya existe un cliente de API.
- `client/src/constants` guarda constantes compartidas entre features.
- Constantes locales de una feature pueden vivir junto a sus componentes en archivos `.js`, no `.jsx`.
- Contextos y hooks compartidos deben vivir separados del provider cuando ESLint/Fast Refresh lo requiera.
- Los hooks (`useEffect`, `useMemo`, `useCallback`) siempre deben declararse antes de retornos condicionales.

## SOLID aplicado al proyecto

- Single Responsibility: cada modulo debe tener un motivo principal de cambio.
- Open/Closed: agregar nuevos estados, filtros o tipos mediante constantes y funciones chicas, evitando `if` repetidos en muchas pantallas.
- Liskov Substitution: mantener contratos de funciones y respuestas consistentes; no cambiar la forma de un payload sin actualizar todos sus consumidores.
- Interface Segregation: pasar a los componentes solo las props que usan.
- Dependency Inversion: las capas altas dependen de APIs internas estables (`api`, `repositories`, `services`), no de detalles de implementacion.

## Validaciones antes de entregar

Desde la raiz:

```bash
npm run lint
npm run build:client
```

El proyecto todavia no tiene suite de tests automatizados. Cuando se agreguen tests, el comando `npm test` debe dejar de fallar por defecto.
