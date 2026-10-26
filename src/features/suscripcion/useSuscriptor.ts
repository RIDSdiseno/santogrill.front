import { useCallback, useEffect, useState } from 'react';
import { post } from '../../services/api';
import { visitanteId } from '../visitas/useRegistrarVisita';

const KEY = 'sg-suscriptor';

export interface DatosSuscriptor { nombre: string; email: string; }

export function useSuscriptor() {
  const [suscriptor, setSuscriptor] = useState<DatosSuscriptor | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    if (raw) { try { setSuscriptor(JSON.parse(raw) as DatosSuscriptor); } catch { /* dato corrupto */ } }
  }, []);

  const suscribir = useCallback(async (datos: DatosSuscriptor & { telefono?: string }) => {
    await post('/suscriptores', { ...datos, visitanteId: visitanteId() });
    const guardado = { nombre: datos.nombre, email: datos.email };
    localStorage.setItem(KEY, JSON.stringify(guardado));
    setSuscriptor(guardado);
  }, []);

  return { suscriptor, esSuscriptor: Boolean(suscriptor), suscribir };
}
