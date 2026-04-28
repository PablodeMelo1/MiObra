export const ITEM_TYPES = [
  { value: 'unique', label: 'Unico' },
  { value: 'commodity', label: 'Herramienta contable' },
  { value: 'consumable', label: 'Consumible' },
];

export const ITEM_TYPE_LABELS = ITEM_TYPES.reduce((acc, itemType) => {
  acc[itemType.value] = itemType.label;
  return acc;
}, {});

export const MOVEMENT_TYPE_LABELS = {
  CHECK_OUT: 'Retiro',
  CHECK_IN: 'Devolucion',
};

export const MOVEMENT_STATUS_LABELS = {
  OPEN: 'Pendiente',
  CLOSED: 'Cerrado',
};

export const EMPTY_ITEM_FORM = {
  name: '',
  description: '',
  itemType: 'commodity',
  totalQuantity: '1',
  availableQuantity: '1',
};

export const DEFAULT_EDIT_FORM = {
  name: '',
  description: '',
  itemType: 'commodity',
  totalQuantity: '1',
  availableQuantity: '1',
};

export const selectClassName = 'w-full appearance-none rounded-lg border border-white/20 bg-[#0b111a] px-3 py-2 text-sm text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition focus:border-cyan-300/70 focus:ring-2 focus:ring-cyan-500/20';
