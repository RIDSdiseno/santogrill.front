import { useState } from 'react';
import { post } from '../../services/api';
import { clp } from '../../lib/formato';
import { Campo } from '../../components/Campo';
import { SelectorPais } from '../../components/SelectorPais';
import { useCarrito } from './CarritoContext';
import { useSuscriptor } from '../suscripcion/useSuscriptor';
import { visitanteId } from '../visitas/useRegistrarVisita';
import type { Pedido } from '../../services/tipos';

interface IniciarPagoResp { processUrl: string; numeroPedido: string; requestId: number; }

const WA = import.meta.env.VITE_WHATSAPP ?? '56961213577';
const ENVIO = 2990;
const ENVIO_GRATIS_DESDE = 40000;

const IconTarjeta = () => (
  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);
const IconWA = () => (
  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.554 4.117 1.528 5.847L.057 23.5l5.797-1.522A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.797 9.797 0 01-5.002-1.372l-.36-.214-3.719.977.992-3.638-.234-.374A9.788 9.788 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182c5.43 0 9.818 4.388 9.818 9.818 0 5.43-4.388 9.818-9.818 9.818z"/>
  </svg>
);

export function PanelCarrito() {
  const { lineas, subtotal, cambiar, quitar, vaciar } = useCarrito();
  const { esSuscriptor } = useSuscriptor();
  const [nombre, setNombre] = useState('');
  const [codigoPais, setCodigoPais] = useState('+56');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [direccion, setDireccion] = useState('');
  const [comuna, setComuna] = useState('');
  const [masOpciones, setMasOpciones] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [pagandoTarjeta, setPagandoTarjeta] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmado, setConfirmado] = useState<Pedido | null>(null);

  const telefonoCompleto = codigoPais + telefono.replace(/^\+\d+\s*/, '');

  const descuento = esSuscriptor ? Math.round(subtotal * 0.05) : 0;
  const envio = lineas.length === 0 ? 0 : subtotal >= ENVIO_GRATIS_DESDE ? 0 : ENVIO;
  const total = subtotal - descuento + envio;
  const formularioValido = nombre.trim() && telefono.trim() && direccion.trim() && comuna.trim();

  const clientePayload = {
    nombre, telefono: telefonoCompleto,
    email: email || undefined,
    direccion: direccion || undefined,
    comuna: comuna || undefined,
  };

  async function pagarConTarjeta() {
    setPagandoTarjeta(true); setError(null);
    try {
      const resp = await post<IniciarPagoResp>('/pagos/iniciar', {
        cliente: clientePayload,
        items: lineas.map((l) => ({ productoId: l.producto.id, cantidad: l.cantidad })),
        visitanteId: visitanteId(),
      });
      localStorage.setItem('getnet_requestId', String(resp.requestId));
      localStorage.setItem('getnet_numeroPedido', resp.numeroPedido);
      vaciar();
      window.location.href = resp.processUrl;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo iniciar el pago');
    } finally { setPagandoTarjeta(false); }
  }

  async function confirmar() {
    setEnviando(true); setError(null);
    try {
      const pedido = await post<Pedido>('/pedidos', {
        cliente: clientePayload,
        items: lineas.map((l) => ({ productoId: l.producto.id, cantidad: l.cantidad })),
        visitanteId: visitanteId(),
      }, crypto.randomUUID());
      setConfirmado(pedido); vaciar();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No pudimos registrar tu pedido');
    } finally { setEnviando(false); }
  }

  function pedirWhatsApp() {
    const items = lineas.map((l) => `  • ${l.producto.nombre} x${l.cantidad} — ${clp(l.producto.precio * l.cantidad)}`).join('\n');
    const msg = [
      `Hola Santo Grill, quiero hacer un pedido 🛒\n`,
      `*Productos:*\n${items}`,
      descuento > 0 ? `\n🏷️ Descuento suscriptor (5%): -${clp(descuento)}` : null,
      `📦 Envío: ${envio === 0 ? 'Gratis' : clp(envio)}`,
      `💰 *Total: ${clp(total)}*`,
      nombre ? `\n👤 Nombre: ${nombre}` : null,
      telefono ? `📞 WhatsApp: ${telefonoCompleto}` : null,
      direccion ? `📍 Dirección: ${direccion}${comuna ? `, ${comuna}` : ''}` : null,
    ].filter(Boolean).join('\n');
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`, '_blank');
  }

  if (confirmado) {
    return (
      <aside className="bg-humo border border-borde rounded-2xl p-6 flex flex-col gap-4">
        <div className="flex flex-col items-center text-center gap-3 py-4">
          <div className="w-16 h-16 rounded-full bg-brasa/10 border-2 border-brasa/40 flex items-center justify-center text-3xl">🎉</div>
          <div className="display font-black text-xl text-hueso">¡Pedido recibido!</div>
          <div className="display font-black text-brasa text-3xl">#{confirmado.numero}</div>
          <p className="text-[13px] text-ceniza leading-relaxed">
            Te contactaremos por WhatsApp.<br />Total: <span className="text-hueso font-semibold">{clp(confirmado.total)}</span>
          </p>
        </div>
        <button onClick={() => setConfirmado(null)}
          className="w-full display font-black text-[12px] tracking-[0.08em] border border-borde text-hueso py-3.5 rounded-xl hover:border-brasa hover:text-brasa transition-colors">
          HACER OTRO PEDIDO
        </button>
      </aside>
    );
  }

  return (
    <>
      {/* ── Barra fija inferior — solo móvil ── */}
      {lineas.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-carbon/95 backdrop-blur border-t border-borde px-4 py-3 flex items-center gap-2.5">
          <div className="flex-1 min-w-0">
            <div className="display font-bold text-[10px] tracking-[0.1em] text-ceniza">TOTAL</div>
            <div className="display font-black text-xl text-hueso leading-none">{clp(total)}</div>
          </div>
          <button
            onClick={pagarConTarjeta}
            disabled={pagandoTarjeta || !formularioValido}
            className="flex items-center gap-1.5 display font-black text-[11px] tracking-[0.06em] bg-hueso text-carbon px-3.5 py-3 rounded-xl disabled:opacity-30 transition-all flex-shrink-0"
          >
            {pagandoTarjeta
              ? <span className="w-4 h-4 rounded-full border-2 border-carbon border-t-transparent animate-spin" />
              : <><IconTarjeta />TARJETA</>}
          </button>
          <button
            onClick={pedirWhatsApp}
            disabled={!formularioValido}
            className="flex items-center gap-1.5 display font-black text-[11px] tracking-[0.06em] bg-[#25d366] text-white px-3.5 py-3 rounded-xl disabled:opacity-30 transition-all flex-shrink-0"
          >
            <IconWA />WA
          </button>
        </div>
      )}

      {/* ── Panel del carrito ── */}
      <aside className="bg-humo border border-borde rounded-2xl overflow-hidden lg:sticky lg:top-24 pb-24 lg:pb-0">
        {/* Header */}
        <div className="bg-carbon border-b border-borde px-5 py-4 flex items-center justify-between">
          <div className="display font-black text-[12px] tracking-[0.12em] text-ceniza">TU CARRITO</div>
          {lineas.length > 0 && (
            <button onClick={vaciar} className="display font-bold text-[10px] tracking-[0.08em] text-ceniza hover:text-brasa transition-colors">
              VACIAR
            </button>
          )}
        </div>

        <div className="p-5 flex flex-col gap-4">
          {/* Productos */}
          {lineas.length === 0
            ? <p className="text-[13px] text-ceniza text-center py-6">Aún no agregas productos.</p>
            : (
              <ul className="flex flex-col gap-3 max-h-40 overflow-y-auto pr-1 scrollbar-thin">
                {lineas.map((l) => (
                  <li key={l.producto.id} className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-[14px] text-hueso leading-snug">{l.producto.nombre}</div>
                      <div className="text-[12px] text-ceniza mt-0.5">{clp(l.producto.precio)} c/u</div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button onClick={() => cambiar(l.producto.id, -1)} className="w-7 h-7 rounded-lg border border-borde text-ceniza hover:border-brasa hover:text-brasa flex items-center justify-center text-lg leading-none transition-colors">−</button>
                      <span className="w-6 text-center display font-bold text-[14px] text-hueso">{l.cantidad}</span>
                      <button onClick={() => cambiar(l.producto.id, 1)} className="w-7 h-7 rounded-lg border border-borde text-ceniza hover:border-brasa hover:text-brasa flex items-center justify-center text-lg leading-none transition-colors">+</button>
                      <button onClick={() => quitar(l.producto.id)} className="ml-1 text-ceniza hover:text-brasa transition-colors text-xl leading-none">×</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

          {lineas.length > 0 && (<>
            {/* Totales */}
            <div className="border-t border-borde/60 pt-4 flex flex-col gap-1.5">
              <div className="flex justify-between text-[13px] text-ceniza"><span>Subtotal</span><span>{clp(subtotal)}</span></div>
              {descuento > 0 && <div className="flex justify-between text-[13px] text-brasa font-semibold"><span>Desc. suscriptor 5%</span><span>− {clp(descuento)}</span></div>}
              <div className="flex justify-between text-[13px] text-ceniza">
                <span>Envío</span>
                <span>{envio === 0 ? <span className="text-green-400">Gratis</span> : clp(envio)}</span>
              </div>
              <div className="flex justify-between items-baseline border-t border-borde/60 pt-3 mt-1">
                <span className="display font-black text-[12px] tracking-[0.08em] text-ceniza">TOTAL</span>
                <span className="display font-black text-2xl text-hueso">{clp(total)}</span>
              </div>
            </div>

            {/* Datos requeridos */}
            <div className="border-t border-borde/60 pt-4 flex flex-col gap-3">
              <div className="display font-black text-[11px] tracking-[0.1em] text-ceniza">TUS DATOS</div>
              <Campo etiqueta="Nombre *" value={nombre} onChange={(e) => setNombre(e.target.value)} required />

              {/* WhatsApp con selector de país */}
              <label className="flex flex-col gap-1.5">
                <span className="display font-bold text-[10px] tracking-[0.14em] text-ceniza">WHATSAPP *</span>
                <div className="flex gap-2">
                  <SelectorPais value={codigoPais} onChange={setCodigoPais} />
                  <input
                    type="tel"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    placeholder="9 1234 5678"
                    className="w-full bg-carbon border border-borde rounded-lg px-3.5 py-3 text-hueso text-[15px] outline-none focus:border-brasa"
                    required
                  />
                </div>
              </label>
              <Campo etiqueta="Dirección *" value={direccion} onChange={(e) => setDireccion(e.target.value)} required />
              <Campo etiqueta="Comuna *" value={comuna} onChange={(e) => setComuna(e.target.value)} required />
            </div>

            {/* ── BOTONES DE PAGO — justo después de los 2 campos ── */}
            {error && <p className="text-[13px] text-red-400 bg-red-950/40 border border-red-900/50 rounded-lg px-3 py-2">{error}</p>}

            <div className="flex flex-col gap-2.5">
              <button
                onClick={pagarConTarjeta}
                disabled={pagandoTarjeta || !formularioValido}
                className="w-full flex items-center justify-center gap-2.5 display font-black text-[13px] tracking-[0.08em] bg-hueso text-carbon py-4 rounded-xl hover:brightness-95 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                {pagandoTarjeta
                  ? <><span className="w-4 h-4 rounded-full border-2 border-carbon border-t-transparent animate-spin" />REDIRIGIENDO…</>
                  : <><IconTarjeta />PAGAR CON TARJETA</>}
              </button>

              <button
                onClick={pedirWhatsApp}
                disabled={!formularioValido}
                className="w-full flex items-center justify-center gap-2.5 display font-black text-[13px] tracking-[0.08em] bg-[#25d366] text-white py-4 rounded-xl hover:brightness-110 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <IconWA />PEDIR POR WHATSAPP
              </button>
            </div>

            {/* Correo opcional colapsable */}
            <div className="border-t border-borde/40 pt-3">
              <button
                onClick={() => setMasOpciones(!masOpciones)}
                className="w-full flex items-center justify-between display font-bold text-[11px] tracking-[0.08em] text-ceniza hover:text-hueso transition-colors"
              >
                <span>+ AGREGAR CORREO (opcional)</span>
                <span className={`transition-transform ${masOpciones ? 'rotate-180' : ''}`}>▾</span>
              </button>
              {masOpciones && (
                <div className="flex flex-col gap-3 mt-3">
                  <Campo etiqueta="Correo" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Para historial y descuento 5%" />
                  <button
                    onClick={confirmar}
                    disabled={enviando || !formularioValido}
                    className="w-full display font-black text-[12px] tracking-[0.08em] bg-brasa text-carbon py-3.5 rounded-xl hover:brightness-110 disabled:opacity-30 transition-all"
                  >
                    {enviando ? 'ENVIANDO…' : 'CONFIRMAR PEDIDO (sin pago online)'}
                  </button>
                </div>
              )}
            </div>

            <p className="text-[11px] text-ceniza text-center pt-1">
              Despacho gratis sobre {clp(ENVIO_GRATIS_DESDE)} · Santiago
            </p>
          </>)}
        </div>
      </aside>
    </>
  );
}
