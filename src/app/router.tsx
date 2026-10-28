import { createBrowserRouter } from 'react-router-dom';
import { SitioLayout } from './SitioLayout';
import { PortalLayout } from './PortalLayout';
import { RutaPrivada } from '../features/portal/RutaPrivada';
import SelectorPage from '../pages/SelectorPage';
import HomePage from '../pages/HomePage';
import TiendaPage from '../pages/TiendaPage';
import AgendaPage from '../pages/AgendaPage';
import PagoResultadoPage from '../pages/PagoResultadoPage';
import LoginPage from '../pages/portal/LoginPage';
import ResumenPage from '../pages/portal/ResumenPage';
import PedidosPage from '../pages/portal/PedidosPage';
import SuscriptoresPage from '../pages/portal/SuscriptoresPage';
import MensajesPage from '../pages/portal/MensajesPage';
import EmbudoPage from '../pages/portal/EmbudoPage';
import VisitasPage from '../pages/portal/VisitasPage';
import ContenidoPage from '../pages/portal/ContenidoPage';
import ProductosPage from '../pages/portal/ProductosPage';
import BannersPage from '../pages/portal/BannersPage';
import NotFoundPage from '../pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    element: <SitioLayout />,
    children: [
      { path: '/', element: <SelectorPage /> },
      { path: '/eventos', element: <HomePage /> },
      { path: '/tienda', element: <TiendaPage /> },
      { path: '/agenda', element: <AgendaPage /> },
      { path: '/pago/resultado', element: <PagoResultadoPage /> }
    ]
  },
  { path: '/portal/login', element: <LoginPage /> },
  {
    path: '/portal',
    element: (
      <RutaPrivada>
        <PortalLayout />
      </RutaPrivada>
    ),
    children: [
      { index: true, element: <ResumenPage /> },
      { path: 'pedidos', element: <PedidosPage /> },
      { path: 'suscriptores', element: <SuscriptoresPage /> },
      { path: 'mensajes', element: <MensajesPage /> },
      { path: 'embudo', element: <EmbudoPage /> },
      { path: 'visitas', element: <VisitasPage /> },
      { path: 'contenido', element: <ContenidoPage /> },
      { path: 'productos', element: <ProductosPage /> },
      { path: 'banners', element: <BannersPage /> }
    ]
  },
  { path: '*', element: <NotFoundPage /> }
]);
