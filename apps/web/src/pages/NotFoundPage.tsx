import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <p className="text-6xl font-bold text-gray-200">404</p>
        <h1 className="mt-4 text-xl font-semibold text-gray-700">Página não encontrada</h1>
        <Link to="/" className="mt-4 inline-block text-sm text-blue-500 hover:text-blue-600">Voltar ao início →</Link>
      </div>
    </div>
  );
}
