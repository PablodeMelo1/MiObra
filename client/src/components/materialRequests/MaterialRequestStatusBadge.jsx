import { MATERIAL_REQUEST_STATUS_STYLES } from '../../constants/materialRequest';

function MaterialRequestStatusBadge({ status }) {
  const style = MATERIAL_REQUEST_STATUS_STYLES[status] || MATERIAL_REQUEST_STATUS_STYLES.DEFAULT;

  return (
    <span className={`inline-flex items-center rounded border px-2 py-0.5 text-[11px] font-semibold tracking-wide ${style.badge}`}>
      {status || '-'}
    </span>
  );
}

export default MaterialRequestStatusBadge;
