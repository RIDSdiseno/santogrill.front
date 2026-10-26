import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { get } from '../services/api';

interface EstadoPago { estado: string; pagado: boolean; orderId: string; }

type Vista = 'cargando' | 'aprobado' | 'pendiente' | 'rechazado';

export default function PagoResultadoPage() {
  const [params] = useSearchParams();

  // 1. Número de pedido en la URL — lo incluimos nosotros en returnUrl, Getnet lo preserva
  const pedidoParam = params.get('pedido') || '';
  // 2. requestId directo en URL (fallback)
  const requestIdUrl = params.get('requestId') ?? params.get('request_id') ?? '';
  // 3. localStorage como último recurso
  const requestIdStorage = localStorage.getItem('getnet_requestId') || '';
  const numeroPedidoStorage = localStorage.getItem('getnet_numeroPedido') || '';

  // Construimos la query para el endpoint /estado
  const estadoQuery = pedidoParam
    ? `pedido=${encodeURIComponent(pedidoParam)}`
    : requestIdUrl
      ? `requestId=${encodeURIComponent(requestIdUrl)}`
      : requestIdStorage
        ? `requestId=${encodeURIComponent(requestIdStorage)}`
        : '';

  const tieneId = Boolean(estadoQuery);
  const numeroPedidoInicial = pedidoParam || numeroPedidoStorage;

  const [vista, setVista] = useState<Vista>('cargando');
  const [orderId, setOrderId] = useState(numeroPedidoInicial);
  const [errorMsg, setErrorMsg] = useState('');
  const [intentando, setIntentando] = useState(false);

  function iniciarVerificacion() {
    if (!tieneId) {
      setVista('pendiente');
      setErrorMsg('No se encontró el ID de pago. Contacta por WhatsApp con tu número de pedido.');
      return;
    }

    setVista('cargando');
    setErrorMsg('');
    let cancelado = false;
    const MAX_INTENTOS = 10;  // 10 × 3s = 30 segundos
    const ESPERA_MS = 3000;

    async function verificar(intento: number) {
      try {
        const data = await get<EstadoPago>(`/pagos/estado?${estadoQuery}`);
        if (cancelado) return;

        if (data.orderId) setOrderId(data.orderId);

        if (data.pagado || /^(APPROVED|APPROVED_PARTIAL|PAID|OK)$/i.test(data.estado)) {
          localStorage.removeItem('getnet_requestId');  // limpiamos por si acá
          localStorage.removeItem('getnet_numeroPedido');
          setVista('aprobado');
        } else if (/^(REJECTED|FAILED|CANCELLED|REVERSED|DECLINED)$/i.test(data.estado)) {
          setVista('rechazado');
        } else if (intento < MAX_INTENTOS) {
          setTimeout(() => { if (!cancelado) verificar(intento + 1); }, ESPERA_MS);
        } else {
          setErrorMsg(`Estado Getnet: ${data.estado} (pedido: ${pedidoParam || requestIdStorage})`);
          setVista('pendiente');
        }
      } catch (e) {
        if (!cancelado) {
          if (intento < MAX_INTENTOS) {
            setTimeout(() => { if (!cancelado) verificar(intento + 1); }, ESPERA_MS);
          } else {
            setErrorMsg(e instanceof Error ? e.message : 'Error de red al consultar el estado');
            setVista('pendiente');
          }
        }
      }
    }

    verificar(0);
    return () => { cancelado = true; };
  }

  useEffect(() => {
    const cleanup = iniciarVerificacion();
    return cleanup;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estadoQuery]);

  const waConfirmar = `https://wa.me/56961213577?text=${encodeURIComponent(`Hola, acabo de pagar en la tienda Santo Grill${orderId ? ` (pedido ${orderId})` : ''} y quiero confirmar mi pedido.`)}`;

  if (vista === 'cargando') {
    return (
      <section className="bg-carbon min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-5">
          <div className="w-14 h-14 rounded-full border-2 border-brasa border-t-transparent animate-spin" />
          <div className="text-center">
            <p className="display font-black text-[13px] tracking-[0.12em] text-hueso">VERIFICANDO PAGO</p>
            <p className="text-[12px] text-ceniza mt-1">Consultando estado con Getnet…</p>
          </div>
        </div>
      </section>
    );
  }

  if (vista === 'aprobado') {
    return (
      <section className="bg-carbon min-h-screen flex items-center justify-center py-20">
        <div className="mx-auto max-w-[520px] px-6 text-center">
          <div className="w-20 h-20 rounded-full bg-brasa/10 border-2 border-brasa/40 flex items-center justify-center mx-auto mb-6 text-4xl">🎉</div>
          <h2 className="display font-black text-5xl text-hueso">¡PAGO<br/>APROBADO!</h2>
          <div className="w-20 h-1 bg-brasa mx-auto mt-4 mb-6" />
          {orderId && (
            <div className="bg-humo border border-borde rounded-2xl px-6 py-4 mb-6">
              <div className="display font-bold text-[11px] tracking-[0.1em] text-ceniza mb-1">NÚMERO DE PEDIDO</div>
              <div className="display font-black text-2xl text-brasa">{orderId}</div>
            </div>
          )}
          <p className="text-ceniza text-[14px] leading-relaxed mb-8">
            Tu pago fue procesado con éxito por Getnet (Santander).<br/>
            Te contactaremos por WhatsApp para coordinar el despacho o retiro.
          </p>
          <Link
            to="/tienda"
            className="display font-black text-[12px] tracking-[0.08em] border border-borde text-hueso px-8 py-3.5 rounded-xl hover:border-brasa hover:text-brasa transition-colors"
          >
            VOLVER A LA TIENDA
          </Link>
        </div>
      </section>
    );
  }

  if (vista === 'rechazado') {
    return (
      <section className="bg-carbon min-h-screen flex items-center justify-center py-20">
        <div className="mx-auto max-w-[520px] px-6 text-center">
          <div className="w-20 h-20 rounded-full bg-red-950/30 border-2 border-red-800/40 flex items-center justify-center mx-auto mb-6 text-4xl">❌</div>
          <h2 className="display font-black text-4xl text-hueso">PAGO RECHAZADO</h2>
          <div className="w-20 h-1 bg-red-700 mx-auto mt-3 mb-6" />
          <p className="text-ceniza text-[14px] leading-relaxed mb-8">
            El pago no fue aprobado. Puedes intentarlo de nuevo o contactarnos directamente.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/tienda" className="display font-black text-[12px] tracking-[0.08em] border border-borde text-hueso px-8 py-3.5 rounded-xl hover:border-brasa hover:text-brasa transition-colors">
              INTENTAR DE NUEVO
            </Link>
            <a href={waConfirmar} target="_blank" rel="noopener noreferrer"
              className="display font-black text-[12px] tracking-[0.08em] bg-[#25d366] text-white px-8 py-3.5 rounded-xl hover:brightness-110 transition-all">
              CONTACTAR POR WHATSAPP
            </a>
          </div>
        </div>
      </section>
    );
  }

  // pendiente
  return (
    <section className="bg-carbon min-h-screen flex items-center justify-center py-20">
      <div className="mx-auto max-w-[520px] px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-yellow-900/20 border-2 border-yellow-700/40 flex items-center justify-center mx-auto mb-6 text-4xl">⏳</div>
        <h2 className="display font-black text-4xl text-hueso">PAGO EN PROCESO</h2>
        <div className="w-20 h-1 bg-yellow-600 mx-auto mt-3 mb-6" />
        <p className="text-ceniza text-[14px] leading-relaxed mb-6">
          Si realizaste el pago exitosamente en Getnet, tu pedido está siendo confirmado.
          Escríbenos por WhatsApp para coordinar de inmediato.
        </p>
        {errorMsg && (
          <p className="text-[11px] text-yellow-500/80 bg-yellow-950/30 border border-yellow-900/40 rounded-lg px-3 py-2 mb-5 font-mono">
            {errorMsg}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-3">
          <button
            disabled={intentando}
            onClick={() => { setIntentando(true); iniciarVerificacion(); setTimeout(() => setIntentando(false), 35000); }}
            className="display font-black text-[12px] tracking-[0.08em] border border-brasa text-brasa px-8 py-3.5 rounded-xl hover:bg-brasa hover:text-carbon transition-colors disabled:opacity-40"
          >
            {intentando ? 'VERIFICANDO…' : 'VERIFICAR DE NUEVO'}
          </button>
          <a href={waConfirmar} target="_blank" rel="noopener noreferrer"
            className="display font-black text-[12px] tracking-[0.08em] bg-[#25d366] text-white px-8 py-3.5 rounded-xl hover:brightness-110 transition-all">
            CONFIRMAR POR WHATSAPP
          </a>
        </div>
        <Link to="/tienda" className="display font-bold text-[11px] tracking-[0.06em] text-ceniza hover:text-hueso transition-colors">
          Volver a la tienda
        </Link>
      </div>
    </section>
  );
}
