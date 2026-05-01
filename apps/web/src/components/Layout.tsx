import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ToastProvider } from './Toast';

export function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`;

  return (
    <ToastProvider>
      <div className="flex min-h-screen">
        <aside className="hidden w-56 flex-shrink-0 border-r bg-white md:flex md:flex-col">
          <div className="px-4 py-5">
            <h1 className="text-base font-bold text-gray-900">Rotina Diária</h1>
            <p className="text-xs text-gray-500">Organize seu dia</p>
          </div>
          <nav className="flex flex-col gap-1 px-3">
            <NavLink to="/dashboard" className={navClass}>📊 Dashboard</NavLink>
            <NavLink to="/lists" className={navClass}>📋 Minhas Listas</NavLink>
          </nav>
          <div className="mt-auto border-t px-4 py-3">
            <p className="truncate text-xs font-medium text-gray-700">{user?.name}</p>
            <p className="truncate text-xs text-gray-400">{user?.email}</p>
            <button onClick={handleLogout} className="mt-2 text-xs text-red-500 hover:text-red-600">Sair</button>
          </div>
        </aside>
        <main className="flex-1 overflow-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </ToastProvider>
  );
}
