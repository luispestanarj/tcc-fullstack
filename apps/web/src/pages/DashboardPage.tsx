import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLists } from '../hooks/useLists';
import { Spinner } from '../components/Spinner';

const typeConfig = {
  TASK: { label: 'Tarefas', icon: '✅', color: 'bg-blue-50 text-blue-600' },
  SHOPPING: { label: 'Compras', icon: '🛒', color: 'bg-green-50 text-green-600' },
  REMINDER: { label: 'Lembretes', icon: '🔔', color: 'bg-amber-50 text-amber-600' },
};

export function DashboardPage() {
  const { user } = useAuth();
  const { data: lists, isLoading } = useLists();

  const counts = {
    TASK: lists?.filter((l) => l.type === 'TASK').reduce((a, l) => a + (l._count?.items ?? 0), 0) ?? 0,
    SHOPPING: lists?.filter((l) => l.type === 'SHOPPING').reduce((a, l) => a + (l._count?.items ?? 0), 0) ?? 0,
    REMINDER: lists?.filter((l) => l.type === 'REMINDER').reduce((a, l) => a + (l._count?.items ?? 0), 0) ?? 0,
  };

  const recentLists = lists?.slice(0, 4) ?? [];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Olá, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="text-sm text-gray-500">Aqui está um resumo da sua rotina</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner /></div>
      ) : (
        <>
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {(Object.keys(typeConfig) as Array<keyof typeof typeConfig>).map((type) => (
              <div key={type} className={`rounded-xl p-5 ${typeConfig[type].color.split(' ')[0]}`}>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{typeConfig[type].icon}</span>
                  <div>
                    <p className="text-3xl font-bold">{counts[type]}</p>
                    <p className={`text-sm font-medium ${typeConfig[type].color.split(' ')[1]}`}>{typeConfig[type].label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Listas recentes</h2>
            <Link to="/lists" className="text-sm text-blue-500 hover:text-blue-600">Ver todas →</Link>
          </div>

          {recentLists.length === 0 ? (
            <div className="rounded-xl border border-dashed bg-white p-10 text-center">
              <p className="text-gray-400">Nenhuma lista criada ainda.</p>
              <Link to="/lists" className="mt-2 inline-block text-sm text-blue-500 hover:text-blue-600">Criar primeira lista →</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {recentLists.map((list) => (
                <Link key={list.id} to={`/lists/${list.id}`}
                  className="flex items-center gap-3 rounded-xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                  <span className="text-xl">{typeConfig[list.type].icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-medium text-gray-900">{list.title}</p>
                    <p className="text-xs text-gray-400">{list._count?.items ?? 0} itens</p>
                  </div>
                  {list.color && <div className="h-3 w-3 rounded-full flex-shrink-0" style={{ backgroundColor: list.color }} />}
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
