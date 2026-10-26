import { get, patch } from '../../services/api';
import { useFetch } from '../../lib/useFetch';
import { fechaHora } from '../../lib/formato';
import { Encabezado } from '../../components/portal/Encabezado';
import { Tabla } from '../../components/portal/Tabla';
import type { Listado, Mensaje } from '../../services/tipos';

const ESTADOS = ['NUEVO', 'LEIDO', 'RESPONDIDO'] as const;

export default function MensajesPage() {
  const { data, error, cargando, recargar } = useFetch(() => get<Listado<Mensaje>>('/mensajes'), []);
  const items = data?.items ?? [];

  async function cambiar(id: string, estado: string) {
    await patch('/mensajes/' + id, { estado });
    recargar();
  }

  return (
    <>
      <Encabezado titulo="Mensajes" subtitulo="Consultas enviadas desde el formulario de contacto" onRecargar={recargar} />
      {cargando && <p className="text-ceniza">Cargando…</p>}
      {error && <p className="text-brasa">{error}</p>}
      <Tabla
        columnas={['FECHA', 'NOMBRE', 'CORREO', 'MENSAJE', 'ESTADO']}
        filas={items}
        clave={(m) => m.id}
        vacio="Sin mensajes por ahora."
        render={(m) => [
          fechaHora(m.creadoEn),
          m.nombre,
          <a href={'mailto:' + m.email} className="text-brasa hover:text-brasa-claro">{m.email}</a>,
          <p className="max-w-md">{m.texto}</p>,
          <select value={m.estado} onChange={(e) => cambiar(m.id, e.target.value)} className="bg-carbon border border-borde rounded-md px-2.5 py-2 text-[13px]">
            {ESTADOS.map((e) => <option key={e} value={e}>{e[0] + e.slice(1).toLowerCase()}</option>)}
          </select>
        ]}
      />
    </>
  );
}
