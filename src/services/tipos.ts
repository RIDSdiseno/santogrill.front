export interface Producto {
  id: string;
  slug: string;
  nombre: string;
  descripcion: string | null;
  categoria: string;
  precio: number;
  imagen: string | null;
}

export interface PedidoItem {
  id: string;
  nombreProducto: string;
  precioUnitario: number;
  cantidad: number;
}

export interface Pedido {
  id: string;
  numero: string;
  estado: 'RECIBIDO' | 'EN_PREPARACION' | 'DESPACHADO' | 'ENTREGADO' | 'ANULADO';
  clienteNombre: string;
  clienteFono: string;
  subtotal: number;
  descuento: number;
  envio: number;
  total: number;
  creadoEn: string;
  items: PedidoItem[];
}

export interface Suscriptor { id: string; nombre: string; email: string; telefono: string | null; creadoEn: string; }
export interface Mensaje { id: string; codigo: string; nombre: string; email: string; texto: string; estado: 'NUEVO' | 'LEIDO' | 'RESPONDIDO'; creadoEn: string; }
export interface Visita { id: string; visitanteId: string; pagina: string; origen: string | null; pantalla: string | null; idioma: string | null; creadoEn: string; }

export type EtapaEvento = 'COTIZACION_RECIBIDA' | 'CONTACTADO' | 'PROPUESTA_ENVIADA' | 'CONFIRMADO' | 'PERDIDO';

export interface Evento {
  id: string; codigo: string; nombre: string; email: string | null; telefono: string | null;
  fechaEvento: string | null; lugar: string | null; personas: number | null; servicio: string;
  detalle: string | null; etapa: EtapaEvento; creadoEn: string;
}

export interface Resumen {
  ventas: number; pedidos: number; ticketPromedio: number; suscriptores: number;
  visitas: number; mensajesNuevos: number; conversion: number;
  embudo: Array<{ etapa: EtapaEvento; n: number }>;
  topProductos: Array<{ nombre: string; cantidad: number }>;
}

export interface Usuario { sub: string; email: string; nombre: string; rol: 'ADMIN' | 'VENTAS'; }
export interface Listado<T> { items: T[]; total: number; }
