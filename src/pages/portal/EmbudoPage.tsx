import { get, patch } from '../../services/api';
import { useFetch } from '../../lib/useFetch';
import { ETAPA_LABEL, fechaHora } from '../../lib/formato';
import { descargarCSV } from '../../lib/csv';
import { Encabezado } from '../../components/portal/Encabezado';
import { Tabla } from '../../components/portal/Tabla';
import type { Evento, EtapaEvento, Listado } from '../../services/tipos';

const ETAPAS: EtapaEvento[] = ['COTIZACION_RECIBIDA', 'CONTACTADO', 'PROPUESTA_ENVIADA', 'CONFIRMADO', 'PERDIDO'];
const COLOR: Record<EtapaEvento, string> = {
  COTIZACION_RECIBIDA: '#f58220',
  CONTACTADO: '#e9a23b',
  PROPUESTA_ENVIADA: '#c9b03e',
  CONFIRMADO: '#5fbf7a',
  PERDIDO: '#6e6862'
};

export default function EmbudoPage() {
  const { data, error, cargando, recargar } = useFetch(() => get<Listado<Evento>>('/eventos'), []);
  const items = data?.items ?? [];

  const conteo = ETAPAS.map((etapa) => ({ etapa, n: items.filter((e) => e.etapa === etapa).length }));
  const max = Math.max(1, ...conteo.map((c) => c.n));
  const ganadas = conteo.find((c) => c.etapa === 'CONFIRMADO')?.n ?? 0;
  const enCurso = items.filter((e) => ['COTIZACION_RECIBIDA', 'CONTACTADO', 'PROPUESTA_ENVIADA'].includes(e.etapa)).length;

  async function moverEtapa(id: string, etapa: string) {
    await patch('/eventos/' + id + '/etapa', { etapa });
    recargar();
  }

  return (
    <>
      <Encabezado
        titulo="Embudo de eventos"
        subtitulo="Cotizaciones de eventos y su avance comercial"
        onRecargar={recargar}
        onExportar={() =>
          descargarCSV('santogrill-embudo', ['CLIENTE', 'CREADA', 'EVENTO', 'LUGAR', 'INVITADOS', 'SERVICIO', 'ETAPA'],
            items.map((e) => [e.nombre, fechaHora(e.creadoEn), e.fechaEvento ?? '', e.lugar ?? '', e.personas ?? '', e.servicio, ETAPA_LABEL[e.etapa] ?? e.etapa]))
        }
      />

      <div className="grid gap-3.5 [grid-template-columns:repeat(auto-fit,minmax(170px,1fr))] mb-5">
        <div className="bg-humo border border-borde/60 rounded-xl p-5"><div className="display font-bold text-[10px] tracking-[0.14em] text-ceniza">OPORTUNIDADES</div><div className="display font-black text-3xl mt-2">{items.length}</div></div>
        <div className="bg-humo border border-borde/60 rounded-xl p-5"><div className="display font-bold text-[10px] tracking-[0.14em] text-ceniza">EN CURSO</div><div className="display font-black text-3xl mt-2 text-brasa">{enCurso}</div></div>
        <div className="bg-humo border border-borde/60 rounded-xl p-5"><div className="display font-bold text-[10px] tracking-[0.14em] text-ceniza">CONFIRMADOS</div><div className="display font-black text-3xl mt-2">{ganadas}</div></div>
        <div className="bg-humo border border-borde/60 rounded-xl p-5"><div className="display font-bold text-[10px] tracking-[0.14em] text-ceniza">TASA DE CIERRE</div><div className="display font-black text-3xl mt-2">{items.length ? Math.round((ganadas / items.length) * 100) + '%' : '—'}</div></div>
      </div>

      <section className="bg-humo border border-borde/60 rounded-xl p-5 mb-4">
        <h2 className="display font-extrabold text-[13px] tracking-[0.08em] mb-4">EMBUDO POR ETAPA</h2>
        <ul className="flex flex-col gap-3">
          {conteo.map((c) => (
            <li key={c.etapa} className="flex items-center gap-3.5">
              <span className="flex-[0_0_170px] text-sm text-hueso/85">{ETAPA_LABEL[c.etapa]}</span>
              <span className="flex-1 h-6 bg-borde/50 rounded overflow-hidden">
                <span className="block h-full rounded" style={{ width: Math.max(4, (c.n / max) * 100) + '%', background: COLOR[c.etapa] }} />
              </span>
              <span className="flex-[0_0_34px] text-right display font-extrabold text-sm">{c.n}</span>
              <span className="flex-[0_0_52px] text-right text-[13px] text-ceniza">{items.length ? Math.round((c.n / items.length) * 100) + '%' : '0%'}</span>
            </li>
          ))}
        </ul>
      </section>

      {cargando && <p className="text-ceniza">Cargando…</p>}
      {error && <p className="text-brasa">{error}</p>}

      <Tabla
        columnas={['CLIENTE', 'EVENTO', 'INVITADOS', 'SERVICIO', 'ETAPA']}
        filas={items}
        clave={(e) => e.id}
        vacio="Aún no hay cotizaciones de eventos."
        render={(e) => [
          <>
            {e.nombre}
            <div className="text-xs text-ceniza">{fechaHora(e.creadoEn)}</div>
          </>,
          <>
            {e.fechaEvento ? new Date(e.fechaEvento).toLocaleDateString('es-CL') : 'por definir'}
            <div className="text-xs text-ceniza">{e.lugar ?? 'por definir'}</div>
          </>,
          e.personas ?? '—',
          e.servicio,
          <select value={e.etapa} onChange={(ev) => moverEtapa(e.id, ev.target.value)} className="bg-carbon border border-borde rounded-md px-2.5 py-2 text-[13px]">
            {ETAPAS.map((x) => <option key={x} value={x}>{ETAPA_LABEL[x]}</option>)}
          </select>
        ]}
      />
    </>
  );
}
