'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { useDashboardContext } from '@/app/context/dashboard-context';

const navItems = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/dashboard/user-a', label: 'User A Inputs' },
  { href: '/dashboard/user-b', label: 'User B Uploads' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const {
    user,
    hydrated,
    loading,
    error,
    clearError,
    activePersona,
    setActivePersona,
    logoutUser,
  } = useDashboardContext();

  const handleLogout = async () => {
    await logoutUser();
    router.push('/auth');
  };

  if (!hydrated) {
    return (
      <section className="rounded-2xl border border-white/10 bg-black/25 p-6 text-sm text-slate-300 backdrop-blur-md">
        Loading dashboard session...
      </section>
    );
  }

  if (!user) {
    return (
      <section className="mx-auto max-w-xl rounded-2xl border border-amber-300/30 bg-amber-500/10 p-6 text-center backdrop-blur-md">
        <h2 className="text-xl font-semibold text-amber-100">Authentication required</h2>
        <p className="mt-2 text-sm text-amber-50/90">
          Sign in first to access the role-based dashboard modules.
        </p>
        <Link
          href="/auth"
          className="mt-4 inline-flex rounded-lg bg-amber-300 px-4 py-2 text-sm font-semibold text-amber-950"
        >
          Go to auth screen
        </Link>
      </section>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="flex items-center justify-between rounded-xl border border-rose-300/30 bg-rose-500/10 px-4 py-2 text-sm text-rose-100">
          <span>{error}</span>
          <button type="button" onClick={clearError} className="text-xs font-medium text-rose-200">
            Dismiss
          </button>
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-2xl border border-white/10 bg-black/25 p-4 backdrop-blur-md">
          <div className="rounded-xl border border-cyan-300/30 bg-cyan-500/10 p-3">
            <p className="text-xs uppercase tracking-wide text-cyan-200">Signed in</p>
            <p className="mt-1 truncate text-sm font-semibold text-white">{user.email}</p>
            <p className="mt-1 text-xs text-slate-300">Role from token: {user.role}</p>
          </div>

          <div className="mt-4 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-lg px-3 py-2 text-sm transition ${
                    isActive
                      ? 'bg-white text-slate-950'
                      : 'border border-white/10 bg-white/5 text-slate-200 hover:bg-white/15'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-300">Persona view</p>
            <div className="mt-2 inline-flex rounded-full border border-white/15 bg-black/30 p-1 text-xs">
              <button
                type="button"
                onClick={() => setActivePersona('USER_A')}
                className={`rounded-full px-3 py-1 ${
                  activePersona === 'USER_A'
                    ? 'bg-cyan-300 text-slate-950'
                    : 'text-slate-300 hover:bg-white/10'
                }`}
              >
                User A
              </button>
              <button
                type="button"
                onClick={() => setActivePersona('USER_B')}
                className={`rounded-full px-3 py-1 ${
                  activePersona === 'USER_B'
                    ? 'bg-emerald-300 text-slate-950'
                    : 'text-slate-300 hover:bg-white/10'
                }`}
              >
                User B
              </button>
            </div>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={() => void handleLogout()}
            className="mt-4 w-full rounded-lg border border-rose-300/30 bg-rose-500/10 px-3 py-2 text-sm font-semibold text-rose-100 hover:bg-rose-500/20 disabled:opacity-60"
          >
            {loading ? 'Working...' : 'Logout'}
          </button>
        </aside>

        <section>{children}</section>
      </div>
    </div>
  );
}
