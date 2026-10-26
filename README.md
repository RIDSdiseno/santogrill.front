# frontend-react — Santo Grill

SPA en React 19 + Vite 6 + Tailwind CSS 4 + TypeScript. Repositorio independiente: consume `backend-api` solo por HTTP.

## Arranque

```bash
cp .env.example .env
npm install
npm run dev        # http://localhost:5173 (proxy /api → http://localhost:4000)
```

## Estructura

```
src/
├─ app/           layouts y router (SitioLayout, PortalLayout)
├─ components/    UI reutilizable (Boton, Campo, Tabla, Encabezado)
├─ features/      dominios: carrito, catalogo, suscripcion, visitas, portal
├─ pages/         una página por ruta (públicas y /portal/*)
├─ services/      api.ts (cliente HTTP único) y tipos del contrato
├─ lib/           formato CLP/fechas, CSV, useFetch
└─ styles/        tokens de marca con @theme de Tailwind 4
```

## Reglas

- Nada de secretos: toda `VITE_*` termina en el bundle público.
- La sesión del portal es una **cookie httpOnly**; el front nunca ve el token.
- `RutaPrivada` es UX: la autorización real la impone la API en cada request.
- Los totales que muestra el carrito son estimación; el valor final lo calcula el backend.
- Cada pedido se envía con `Idempotency-Key` para evitar duplicados.

## Build

```bash
npm run typecheck && npm run build     # dist/ listo para Netlify, Vercel o Nginx
```

SPA: configura el fallback a `index.html` (Netlify: `/* /index.html 200`).
