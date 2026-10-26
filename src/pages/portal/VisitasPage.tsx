import { get } from '../../services/api';
import { useFetch } from '../../lib/useFetch';
import { fechaHora } from '../../lib/formato';
import { descargarCSV } from '../../lib/csv';
import { Encabezado } from '../../components/portal/Encabezado';
import { Tabla } from '../../components/portal/Tabla';
import type { Listado, Visita } from '../../services/tipos';

export default function VisitasPage() {
  const { data, error, cargando, recargar } = useFetch(() => get<Listado<Visita>>('/visitas'), []);
  const items = data?.items ?? [];

  return (
    <>
      <Encabezado
        titulo="Visitas"
        subtitulo="Registro anónimo de cada ingreso al sitio"
        onRecargar={recargar}
        onExportar={() =>
          descargarCSV('santogrill-visitas', ['VISITANTE', 'FECHA', 'ORIGEN', 'PÁGINA', 'PANTALLA', 'IDIOMA'],
            items.map((v) => [v.visitanteId, fechaHora(v.creadoEn), v.origen ?? '', v.pagina, v.pantalla ?? '', v.idioma ?? '']))
        }
      />
      {cargando && <p className="text-ceniza">Cargando…</p>}
      {error && <p className="text-brasa">{error}</p>}
      <Tabla
        columnas={['VISITANTE', 'FECHA', 'ORIGEN', 'PÁGINA', 'PANTALLA']}
        filas={items}
        clave={(v) => v.id}
        vacio="Sin visitas registradas."
        render={(v) => [v.visitanteId, fechaHora(v.creadoEn), v.origen ?? 'directo', v.pagina, v.pantalla ?? '—']}
      />
    </>
  );
}
