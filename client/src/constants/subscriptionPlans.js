export const SUBSCRIPTION_PLANS = [
  {
    id: 'inicial',
    name: 'Inicial',
    price: 49,
    description: 'Para equipos pequenos que necesitan ordenar sus primeras obras en un solo lugar.',
    limits: ['Hasta 5 usuarios', 'Hasta 3 obras activas'],
    features: ['Obras y tareas', 'Pendientes y calendario', 'Inventario y proveedores', 'Solicitudes de materiales'],
  },
  {
    id: 'profesional',
    name: 'Profesional',
    price: 99,
    description: 'Para constructoras en crecimiento que coordinan varios frentes y responsables.',
    limits: ['Hasta 15 usuarios', 'Hasta 10 obras activas'],
    features: ['Todo lo incluido en Inicial', 'Gestion de empleados', 'Roles e invitaciones', 'Historial y control operativo'],
    featured: true,
  },
  {
    id: 'empresa',
    name: 'Empresa',
    price: 199,
    description: 'Para operaciones consolidadas que necesitan administrar equipos y empresas a escala.',
    limits: ['Hasta 40 usuarios', 'Obras activas ilimitadas'],
    features: ['Todo lo incluido en Profesional', 'Operacion preparada para mayor escala', 'Administracion de varias empresas', 'Cambio entre empresas del usuario'],
  },
];

export const SUBSCRIPTION_NOTICE = 'Valores de lanzamiento y referencia en USD por empresa/mes, impuestos no incluidos. La facturacion y los limites por plan todavia no se aplican automaticamente dentro del sistema.';
