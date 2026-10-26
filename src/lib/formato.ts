export const clp = (n: number) => '$' + Math.round(n).toLocaleString('es-CL');

export const fechaHora = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString('es-CL') + ' ' + d.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
};

export const ETAPA_LABEL: Record<string, string> = {
  COTIZACION_RECIBIDA: 'Cotización recibida',
  CONTACTADO: 'Contactado',
  PROPUESTA_ENVIADA: 'Propuesta enviada',
  CONFIRMADO: 'Confirmado',
  PERDIDO: 'Perdido'
};

export const ESTADO_PEDIDO_LABEL: Record<string, string> = {
  RECIBIDO: 'Recibido',
  EN_PREPARACION: 'En preparación',
  DESPACHADO: 'Despachado',
  ENTREGADO: 'Entregado',
  ANULADO: 'Anulado'
};
