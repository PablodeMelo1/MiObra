export const MATERIAL_REQUEST_STATUS_OPTIONS = Object.freeze(['PEDIDO', 'COMPRADO', 'RECIBIDO']);

export const MATERIAL_REQUEST_FILTER_OPTIONS = Object.freeze([
  { value: 'ALL', label: 'Todos' },
  ...MATERIAL_REQUEST_STATUS_OPTIONS.map((status) => ({ value: status, label: status })),
]);

export const MATERIAL_REQUEST_STATUS_STYLES = Object.freeze({
  PEDIDO: {
    badge: 'border-sky-300/30 bg-sky-500/20 text-sky-100',
    row: 'bg-sky-500/5 hover:bg-sky-500/10',
  },
  COMPRADO: {
    badge: 'border-amber-300/30 bg-amber-500/20 text-amber-100',
    row: 'bg-amber-500/5 hover:bg-amber-500/10',
  },
  RECIBIDO: {
    badge: 'border-emerald-300/30 bg-emerald-500/20 text-emerald-100',
    row: 'bg-emerald-500/5 hover:bg-emerald-500/10',
  },
  DEFAULT: {
    badge: 'border-white/20 bg-white/10 text-white/80',
    row: 'bg-transparent hover:bg-white/5',
  },
});

export const MATERIAL_REQUEST_FORM_DEFAULTS = Object.freeze({
  materialName: '',
  description: '',
  quantity: '1',
  status: MATERIAL_REQUEST_STATUS_OPTIONS[0],
  orderDate: '',
  supplierId: '',
  arrivalDate: '',
  projectId: '',
  length: '',
  width: '',
  thickness: '',
});
