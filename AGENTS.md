# AGENTS.md - Guia de trabajo para agentes de IA

Este archivo es el punto de entrada para cualquier agente que trabaje en
MiObra. El harness usa un flujo multiagente secuencial obligatorio:
`leader` -> `frontend-designer` -> `implementer` -> `reviewer`.

El objetivo es orientar al agente, evitar trabajo fuera de scope y validar con
comandos reales del repositorio.

## 1. Flujo obligatorio

Toda tarea debe pasar por estas etapas:

1. `leader`: analiza la solicitud, lee contexto, define scope y prepara un
   plan corto.
2. `frontend-designer`: cuando el scope incluye frontend, analiza el producto
   y el sistema visual, prepara el plan de interfaz e implementa la
   presentacion; en tareas sin frontend emite `NO_APLICA` sin editar archivos.
3. `implementer`: completa e integra exactamente ese scope y ajusta o agrega
   ejemplos y verificaciones cuando corresponda.
4. `reviewer`: revisa el diff, valida contra los docs y ejecuta la verificacion
   final disponible para el area tocada.

La configuracion del harness vive en `.agents/settings.json` y las definiciones
de cada agente estan en `.agents/agentes/`.

## 2. Antes de tocar codigo

1. Lee la solicitud del usuario. La tarea viene por prompt; no existe
   `feature_list.json`.
2. Lee `.agents/settings.json` para confirmar el pipeline activo.
3. Lee solo la documentacion necesaria:
   - `README.md` para contexto general del proyecto.
   - `docs/architecture.md` antes de cambiar capas o estructura.
   - `docs/conventions.md` antes de editar codigo.
   - `docs/verification.md` antes de cerrar el trabajo.
4. Revisa el estado del repo con `git status --short` para no pisar cambios
   ajenos.
5. Si falta contexto imprescindible, pregunta antes de asumir.

## 3. Mapa del repositorio

| Archivo / carpeta | Que contiene | Cuando leerlo |
| --- | --- | --- |
| `README.md` | Contexto general del proyecto, stack, despliegue y enlaces al harness | Al iniciar o cuando falte contexto |
| `docs/architecture.md` | Arquitectura esperada y separacion de responsabilidades | Antes de cambiar capas o contratos |
| `docs/conventions.md` | Reglas de estilo, estructura y criterios practicos de codigo | Antes de escribir codigo |
| `docs/verification.md` | Comandos de verificacion y criterio de cierre | Antes de finalizar |
| `src/` | Backend Express/Mongoose del sistema | Para implementar cambios de API o negocio |
| `client/src/` | Frontend React/Vite de la aplicacion | Para implementar cambios de UI |
| `api/index.mjs` | Entrada serverless usada por Vercel | Cuando el cambio afecta deploy o arranque |
| `postman_collection.json` | Coleccion local de requests para probar endpoints | Cuando cambian endpoints HTTP |
| `.agents/settings.json` | Configuracion del harness multiagente y comandos | Siempre, al iniciar |
| `.agents/agentes/` | Perfiles obligatorios de `leader`, `frontend-designer`, `implementer` y `reviewer` | Siempre que se ejecute una tarea |

## 4. Reglas de trabajo

- Trabaja una sola solicitud por vez. No mezcles features no pedidas.
- Usa siempre el orden `leader` -> `frontend-designer` -> `implementer` ->
  `reviewer`.
- `frontend-designer` concentra UX, UI, estructura visual, componentes
  frontend y calidad de presentacion. `implementer` conserva la
  responsabilidad general de completar e integrar el alcance, incluida la
  logica de negocio, backend, contratos y verificaciones.
- Mantene el cambio lo mas chico posible y alineado con la estructura
  existente.
- No inventes sistemas de progreso, checkpoints ni listas de features.
- No agregues dependencias, carpetas o abstracciones si la solicitud no lo pide
  o si el repo ya tiene una forma simple de resolverlo.
- En frontend, reutiliza componentes, hooks, servicios y utilidades
  existentes antes de crear una pieza nueva.
- Evita componentes monoliticos y codigo dificil de seguir. Cada componente
  debe tener una responsabilidad clara.
- No componetices por anticipado: una abstraccion debe mejorar reutilizacion,
  legibilidad o separacion de responsabilidades.
- No reviertas cambios que no hiciste.
- Si el README y los docs no alcanzan para decidir algo importante, pregunta.
- Si la implementacion agrega, cambia o usa endpoints HTTP, actualiza
  `postman_collection.json` con ejemplos suficientes para probar el flujo.
- La coleccion local de Postman es la fuente de verdad para este repo. No hay
  un repositorio externo configurado por defecto.

## 5. Verificacion

Para cambios de frontend, ejecuta la verificacion disponible del cliente:

```bash
npm run lint
npm run build:client
```

Si el cambio toca la capa backend, valida al menos que la aplicacion levante
correctamente con:

```bash
npm run start
```

Si el cambio afecta una ruta, un flujo o un contrato HTTP, probalo ademas con
la coleccion `postman_collection.json`.

No declares terminado un cambio si la verificacion relevante falla por causa
de tus ediciones. Si ya existia una falla ajena al cambio, reportala con el
error concreto.

## 6. Cierre

Antes de responder al usuario:

1. Confirma que `reviewer` emitio veredicto.
2. Resume los archivos modificados.
3. Indica que comandos de verificacion corriste y su resultado.
4. Menciona cualquier TODO real que haya quedado documentado.
5. Si hubo endpoints HTTP, confirma que `postman_collection.json` fue
   actualizado con ejemplos para probarlos.
6. No generes archivos temporales ni logs de debug.
