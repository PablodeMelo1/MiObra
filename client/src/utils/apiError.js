const validationLabels = { name: 'nombre', email: 'email', password: 'contrasena' };

export function getApiErrorMessage(error, fallback = 'Ocurrio un error. Intenta nuevamente.') {
  if (error?.code === 'ECONNABORTED') return 'El servidor demoro demasiado en responder. Intenta nuevamente.';
  if (!error?.response) return 'No se pudo conectar con el servidor. Revisa tu conexion e intenta nuevamente.';

  const data = error.response.data;
  const details = Array.isArray(data?.detalles) ? data.detalles : [];
  if (details.length > 0) {
    return details.map((detail) => {
      const text = typeof detail === 'string' ? detail : detail?.message;
      const field = typeof detail === 'object' ? detail?.field : null;
      return field && validationLabels[field] ? `${validationLabels[field]}: ${text}` : text;
    }).filter(Boolean).join('. ');
  }
  return data?.message || fallback;
}
