'use client';

import { useRouter } from 'next/navigation';

import { AuthPanel } from '@/app/components/home/AuthPanel';
import { PersonaSelector } from '@/app/components/home/PersonaSelector';
import { useDashboardContext } from '@/app/context/dashboard-context';

export default function AuthPage() {
  const router = useRouter();
  const {
    activePersona,
    setActivePersona,
    user,
    loading,
    hydrated,
    error,
    authenticateUser,
    authenticateWithFirebase,
    logoutUser,
  } = useDashboardContext();

  const handleAuthenticate = async (
    credentials: { email: string; password: string },
    mode: 'login' | 'register',
  ) => {
    const authenticated = await authenticateUser(credentials, mode);

    if (authenticated) {
      router.push('/dashboard');
    }

    return authenticated;
  };

  const handleLogout = async () => {
    await logoutUser();
  };

  const handleFirebaseAuth = async () => {
    const authenticated = await authenticateWithFirebase();

    if (authenticated) {
      router.push('/dashboard');
    }

    return authenticated;
  };

  if (!hydrated) {
    return (
      <section className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-black/25 p-8 text-center text-sm text-slate-300 backdrop-blur-md">
        Loading your session...
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-cyan-300/30 bg-linear-to-br from-cyan-500/15 via-blue-500/10 to-emerald-500/15 p-6 shadow-[0_0_60px_rgba(6,182,212,0.15)]">
        <p className="text-xs uppercase tracking-[0.24em] text-cyan-200">Auth Gateway</p>
        <h2 className="mt-2 text-2xl font-semibold text-white md:text-3xl">
          Sign in and route work by role
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-200/90">
          Use persona-aware login for User A and User B, then jump into dedicated dashboard pages
          for each workflow.
        </p>
      </section>

      <PersonaSelector activePersona={activePersona} onPersonaChange={setActivePersona} />

      <section className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
        <AuthPanel
          activePersona={activePersona}
          user={user}
          loading={loading}
          error={error}
          onAuthenticate={handleAuthenticate}
          onAuthenticateWithFirebase={handleFirebaseAuth}
          onLogout={handleLogout}
        />

        <aside className="rounded-2xl border border-white/10 bg-black/25 p-5 backdrop-blur-md">
          <h3 className="text-sm font-semibold text-slate-100">Flow</h3>
          <ol className="mt-3 space-y-3 text-sm text-slate-300">
            <li>1. Pick persona role.</li>
            <li>2. Login or quick register.</li>
            <li>3. Continue to the dashboard workspace.</li>
          </ol>

          {user ? (
            <div className="mt-5 rounded-xl border border-emerald-300/30 bg-emerald-500/10 p-3 text-xs text-emerald-100">
              Already authenticated as {user.email}.{' '}
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="font-semibold underline underline-offset-2"
              >
                Open dashboard
              </button>
            </div>
          ) : (
            <p className="mt-5 text-xs text-slate-400">
              This session state is shared across dashboard pages once logged in.
            </p>
          )}
        </aside>
      </section>
    </div>
  );
}
