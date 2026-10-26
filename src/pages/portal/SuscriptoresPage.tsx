import { get } from '../../services/api';
import { useFetch } from '../../lib/useFetch';
import { fechaHora } from '../../lib/formato';
import { descargarCSV } from '../../lib/csv';
import { Encabezado } from '../../components/portal/Encabezado';
import { Tabla } from '../../components/portal/Tabla';
import type { Listado, Suscriptor } from '../../services/tipos';

export default function SuscriptoresPage() {
  const { data, error, cargando, recargar } = useFetch(() => get<Listado<Suscriptor>>('/suscriptores'), []);
  const items = data?.items ?? [];

  return (
    <>
      <Encabezado
        titulo="Suscriptores"
        subtitulo="Inscritos a ofertas con 5% de descuento activo"
        onRecargar={recargar}
        onExportar={() =>
          descargarCSV('santogrill-suscriptores', ['NOMBRE', 'CORREO', 'WHATSAPP', 'INSCRITO'],
            items.map((s) => [s.nombre, s.email, s.telefono ?? '', fechaHora(s.creadoEn)]))
        }
      />
      {cargando && <p className="text-ceniza">Cargando…</p>}
      {error && <p className="text-brasa">{error}</p>}
      <Tabla
        columnas={['NOMBRE', 'CORREO', 'WHATSAPP', 'INSCRITO']}
        filas={items}
        clave={(s) => s.id}
        vacio="Nadie se ha inscrito todavía."
        render={(s) => [s.nombre, s.email, s.telefono ?? '—', fechaHora(s.creadoEn)]}
      />
    </>
  );
}
