import { useState } from 'react';
import { get, patch } from '../../services/api';
import { useFetch } from '../../lib/useFetch';
import { clp, ESTADO_PEDIDO_LABEL, fechaHora } from '../../lib/formato';
import { descargarCSV } from '../../lib/csv';
import { Encabezado } from '../../components/portal/Encabezado';
import { Tabla } from '../../components/portal/Tabla';
import type { Listado, Pedido } from '../../services/tipos';

const ESTADOS = ['RECIBIDO', 'EN_PREPARACION', 'DESPACHADO', 'ENTREGADO', 'ANULADO'] as const;

export default function PedidosPage() {
  const { data, error, cargando, recargar } = useFetch(() => get<Listado<Pedido>>('/pedidos?porPagina=100'), []);
  const [filtro, setFiltro] = useState('');

  const items = (data?.items ?? []).filter((p) =>
    (p.numero + p.clienteNombre + p.items.map((i) => i.nombreProducto).join(' ')).toLowerCase().includes(filtro.toLowerCase())
  );

  async function cambiarEstado(id: string, estado: string) {
    await patch('/pedidos/' + id, { estado });
    recargar();
  }

  return (
    <>
      <Encabezado
        titulo="Pedidos"
        subtitulo="Cada compra de la tienda queda registrada aquí"
        onRecargar={recargar}
        onExportar={() =>
          descargarCSV('santogrill-pedidos', ['N°', 'FECHA', 'CLIENTE', 'DETALLE', 'TOTAL', 'ESTADO'],
            items.map((p) => [p.numero, fechaHora(p.creadoEn), p.clienteNombre, p.items.map((i) => i.cantidad + 'x ' + i.nombreProducto).join(' | '), p.total, p.estado]))
        }
      />

      <div className="flex gap-2.5 flex-wrap mb-3.5">
        <input
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          placeholder="Buscar por número, cliente o producto…"
          className="flex-1 min-w-[220px] bg-humo border border-borde rounded-lg px-3.5 py-3 text-sm"
        />
        <span className="flex items-center px-3.5 bg-humo border border-borde/60 rounded-lg text-[13px] text-ceniza">{items.length} registros</span>
      </div>

      {cargando && <p className="text-ceniza">Cargando pedidos…</p>}
      {error && <p className="text-brasa">{error}</p>}

      <Tabla
        columnas={['N° PEDIDO', 'FECHA', 'CLIENTE', 'DETALLE', 'TOTAL', 'ESTADO']}
        filas={items}
        clave={(p) => p.id}
        vacio="Todavía no hay pedidos."
        render={(p) => [
          <span className="display font-bold">{p.numero}</span>,
          fechaHora(p.creadoEn),
          <>
            {p.clienteNombre}
            <div className="text-xs text-ceniza">{p.clienteFono}</div>
          </>,
          <ul className="text-[13px]">
            {p.items.map((i) => <li key={i.id}>{i.cantidad}x {i.nombreProducto}</li>)}
          </ul>,
          <>
            <div className="display font-extrabold">{clp(p.total)}</div>
            {p.descuento > 0 && <div className="text-xs text-brasa">−{clp(p.descuento)} suscriptor</div>}
          </>,
          <select
            value={p.estado}
            onChange={(e) => cambiarEstado(p.id, e.target.value)}
            className="bg-carbon border border-borde rounded-md px-2.5 py-2 text-[13px]"
          >
            {ESTADOS.map((e) => <option key={e} value={e}>{ESTADO_PEDIDO_LABEL[e]}</option>)}
          </select>
        ]}
      />
    </>
  );
}
