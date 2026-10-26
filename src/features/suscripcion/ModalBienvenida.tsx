import { useEffect, useState } from 'react';
import { Boton } from '../../components/Boton';
import { Campo } from '../../components/Campo';
import { useSuscriptor } from './useSuscriptor';

/** Se muestra una vez por visitante y activa el 5% de descuento. */
export function ModalBienvenida() {
  const { esSuscriptor, suscribir } = useSuscriptor();
  const [abierto, setAbierto] = useState(false);
  const [datos, setDatos] = useState({ nombre: '', email: '', telefono: '' });
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (esSuscriptor || sessionStorage.getItem('sg-modal-visto')) return;
    const t = setTimeout(() => setAbierto(true), 1200);
    return () => clearTimeout(t);
  }, [esSuscriptor]);

  function cerrar() {
    sessionStorage.setItem('sg-modal-visto', '1');
    setAbierto(false);
  }

  async function enviar() {
    setEnviando(true);
    try {
      await suscribir(datos);
      cerrar();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No pudimos registrarte');
    } finally {
      setEnviando(false);
    }
  }

  if (!abierto) return null;

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-[120] bg-black/75 flex items-center justify-center p-5">
      <div className="w-full max-w-md bg-humo border border-borde rounded-xl p-7 flex flex-col gap-3.5 relative">
        <button onClick={cerrar} aria-label="Cerrar" className="absolute top-3 right-4 text-ceniza text-2xl leading-none">×</button>
        <div className="font-[var(--font-script)] text-2xl text-brasa" style={{ fontFamily: 'var(--font-script)' }}>¡Bienvenido a Santo Grill!</div>
        <h3 className="display font-black text-2xl leading-tight">INSCRÍBETE Y OBTÉN UN 5% DE DESCUENTO</h3>
        <p className="text-sm text-ceniza">Recibe nuestras ofertas. El descuento se aplica al instante en tu carrito.</p>
        <Campo placeholder="Tu nombre" value={datos.nombre} onChange={(e) => setDatos({ ...datos, nombre: e.target.value })} />
        <Campo placeholder="Tu correo" type="email" value={datos.email} onChange={(e) => setDatos({ ...datos, email: e.target.value })} />
        <Campo placeholder="WhatsApp (opcional)" value={datos.telefono} onChange={(e) => setDatos({ ...datos, telefono: e.target.value })} />
        {error && <p className="text-sm text-brasa">{error}</p>}
        <Boton onClick={enviar} disabled={enviando || !datos.nombre || !datos.email}>ACTIVAR MI 5% DE DESCUENTO</Boton>
        <button onClick={cerrar} className="text-sm text-ceniza">Ahora no, gracias</button>
      </div>
    </div>
  );
}
