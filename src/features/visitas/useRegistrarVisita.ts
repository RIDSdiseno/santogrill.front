import { useEffect } from 'react';
import { post } from '../../services/api';

const KEY = 'sg-visitante-id';

export function visitanteId(): string {
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = 'v-' + crypto.randomUUID();
    localStorage.setItem(KEY, id);
  }
  return id;
}

/** Registra una visita por sesión de navegador. Nunca bloquea el render. */
export function useRegistrarVisita() {
  useEffect(() => {
    if (sessionStorage.getItem('sg-visita-ok')) return;
    sessionStorage.setItem('sg-visita-ok', '1');
    post('/visitas', {
      visitanteId: visitanteId(),
      pagina: location.pathname,
      origen: document.referrer || 'directo',
      pantalla: window.innerWidth + 'x' + window.innerHeight,
      idioma: navigator.language
    }).catch(() => { /* la telemetría nunca rompe la experiencia */ });
  }, []);
}
