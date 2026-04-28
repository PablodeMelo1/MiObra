import { ITEM_TYPE_LABELS } from './constants';
import { getLabel } from './utils';

function ItemSummaryCard({ item }) {
  if (!item) return null;

  return (
    <>
      <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg border border-white/10 bg-black/20 p-3">
          <p className="text-white/50">Nombre</p>
          <p className="font-semibold">{item.name}</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-black/20 p-3">
          <p className="text-white/50">Tipo</p>
          <p className="font-semibold">{getLabel(ITEM_TYPE_LABELS, item.itemType)}</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-black/20 p-3">
          <p className="text-white/50">Total</p>
          <p className="font-semibold">{item.totalQuantity}</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-black/20 p-3">
          <p className="text-white/50">Disponible</p>
          <p className="font-semibold text-emerald-200">{item.availableQuantity}</p>
        </div>
      </div>

      {item?.description ? (
        <p className="mt-3 rounded-lg border border-white/10 bg-black/20 p-3 text-sm text-white/85">{item.description}</p>
      ) : null}
    </>
  );
}

export default ItemSummaryCard;
