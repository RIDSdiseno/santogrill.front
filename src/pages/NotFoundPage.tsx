import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center"
         style={{ background: 'var(--color-carbon, #0a0a0a)', color: 'var(--color-hueso, #f1efec)' }}>
      <p className="text-8xl font-black" style={{ color: 'var(--color-brasa, #f58220)' }}>404</p>
      <h1 className="text-2xl font-bold">Página no encontrada</h1>
      <p className="text-sm max-w-xs" style={{ color: 'var(--color-ceniza, #8e8882)' }}>
        La página que buscas no existe o fue movida.
      </p>
      <Link
        to="/"
        className="mt-2 px-6 py-3 rounded font-semibold text-sm transition-opacity hover:opacity-80"
        style={{ background: 'var(--color-brasa, #f58220)', color: '#fff' }}
      >
        Volver al inicio
      </Link>
    </div>
  );
}
