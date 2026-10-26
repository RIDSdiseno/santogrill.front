import { get } from '../../services/api';
import { useFetch } from '../../lib/useFetch';
import { clp, ETAPA_LABEL } from '../../lib/formato';
import { Encabezado } from '../../components/portal/Encabezado';
import type { Resumen } from '../../services/tipos';

function Kpi({ titulo, valor, pie }: { titulo: string; valor: string | number; pie?: string }) {
  return (
    <div className="bg-humo border border-borde/60 rounded-xl p-5">
      <div className="display font-bold text-[10px] tracking-[0.14em] text-ceniza">{titulo}</div>
      <div className="display font-black text-3xl mt-2">{valor}</div>
      {pie && <div className="text-[13px] text-ceniza mt-0.5">{pie}</div>}
    </div>
  );
}

export default function ResumenPage() {
  const { data, error, cargando, recargar } = useFetch(() => get<Resumen>('/metricas/resumen'), []);
  const max = Math.max(1, ...(data?.topProductos ?? []).map((p) => p.cantidad));

  return (
    <>
      <Encabezado titulo="Resumen" subtitulo="Actividad del sitio y de la tienda online" onRecargar={recargar} />

      {cargando && <p className="text-ceniza">Cargando métricas…</p>}
      {error && <p className="text-brasa">No pudimos cargar las métricas: {error}</p>}

      {data && (
        <>
          <div className="grid gap-3.5 [grid-template-columns:repeat(auto-fit,minmax(190px,1fr))] mb-5">
            <Kpi titulo="VENTAS REGISTRADAS" valor={clp(data.ventas)} pie={data.pedidos + ' pedidos'} />
            <Kpi titulo="TICKET PROMEDIO" valor={clp(data.ticketPromedio)} />
            <Kpi titulo="SUSCRIPTORES" valor={data.suscriptores} pie="con 5% de descuento activo" />
            <Kpi titulo="VISITAS" valor={data.visitas} pie={data.conversion + '% de conversión'} />
            <Kpi titulo="MENSAJES NUEVOS" valor={data.mensajesNuevos} />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <section className="bg-humo border border-borde/60 rounded-xl p-5">
              <h2 className="display font-extrabold text-[13px] tracking-[0.08em] mb-4">PRODUCTOS MÁS PEDIDOS</h2>
              {data.topProductos.length === 0 && <p className="text-sm text-ceniza">Aún no hay pedidos registrados.</p>}
              <ul className="flex flex-col gap-2.5">
                {data.topProductos.map((p) => (
                  <li key={p.nombre} className="flex items-center gap-3">
                    <span className="flex-[0_0_190px] text-sm text-hueso/85 truncate">{p.nombre}</span>
                    <span className="flex-1 h-2 bg-borde/60 rounded overflow-hidden">
                      <span className="block h-full bg-brasa" style={{ width: (p.cantidad / max) * 100 + '%' }} />
                    </span>
                    <span className="flex-[0_0_40px] text-right display font-extrabold text-sm">{p.cantidad}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="bg-humo border border-borde/60 rounded-xl p-5">
              <h2 className="display font-extrabold text-[13px] tracking-[0.08em] mb-4">EVENTOS POR ETAPA</h2>
              <ul className="flex flex-col gap-2.5">
                {data.embudo.map((e) => (
                  <li key={e.etapa} className="flex items-center justify-between text-sm">
                    <span className="text-hueso/85">{ETAPA_LABEL[e.etapa] ?? e.etapa}</span>
                    <span className="display font-extrabold">{e.n}</span>
                  </li>
                ))}
                {data.embudo.length === 0 && <li className="text-sm text-ceniza">Sin cotizaciones todavía.</li>}
              </ul>
            </section>
          </div>
        </>
      )}
    </>
  );
}
