import { API_BASE_URL } from '@/app/lib/config';
import { AuthenticatedUser, Role } from '@/app/types/dashboard';

interface SessionSnapshotProps {
  user: AuthenticatedUser | null;
  activePersona: Role;
}

export function SessionSnapshot({ user, activePersona }: SessionSnapshotProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-lg shadow-slate-950/40">
      <h2 className="mb-2 text-sm font-semibold text-slate-50">Session snapshot</h2>
      <div className="space-y-1 rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-xs text-slate-300">
        <div>
          <span className="text-slate-500">API base:</span> {API_BASE_URL}
        </div>
        <div>
          <span className="text-slate-500">Authenticated:</span> {user ? 'yes' : 'no'}
        </div>
        <div>
          <span className="text-slate-500">Persona view:</span>{' '}
          {activePersona === 'USER_A' ? 'User A' : 'User B'}
        </div>
        {user && (
          <>
            <div>
              <span className="text-slate-500">User ID (share with User B):</span> {user.id}
            </div>
            <div>
              <span className="text-slate-500">Role from token:</span>{' '}
              <span className="uppercase">{user.role}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
