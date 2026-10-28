/**
 * Cliente HTTP único. Toda llamada a la API pasa por aquí:
 * un solo lugar para credenciales, errores y tipos de respuesta.
 */
const BASE = import.meta.env.VITE_API_URL ?? '/api/v1';

export class ApiError extends Error {
  constructor(public status: number, public code: string, message: string, public details?: unknown) {
    super(message);
  }
}

interface Opciones extends RequestInit {
  idempotencyKey?: string;
}

export async function api<T>(path: string, opts: Opciones = {}): Promise<T> {
  const { idempotencyKey, headers, ...rest } = opts;
  const res = await fetch(BASE + path, {
    credentials: 'include', // cookie httpOnly de sesión
    headers: {
      'Content-Type': 'application/json',
      ...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {}),
      ...headers
    },
    ...rest
  });

  if (res.status === 204) return undefined as T;

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    const e = json?.error ?? {};
    throw new ApiError(res.status, e.code ?? 'UNKNOWN', e.message ?? 'Error de red', e.details);
  }

  return json.data as T;
}

export const get = <T>(p: string) => api<T>(p);
export const post = <T>(p: string, body: unknown, idempotencyKey?: string) =>
  api<T>(p, { method: 'POST', body: JSON.stringify(body), idempotencyKey });
export const patch = <T>(p: string, body: unknown) => api<T>(p, { method: 'PATCH', body: JSON.stringify(body) });
export const del = (p: string) => api<void>(p, { method: 'DELETE' });
