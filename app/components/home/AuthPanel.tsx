import { FormEvent, useState } from 'react';

import { AuthCredentials, AuthMode, AuthenticatedUser, Role } from '@/app/types/dashboard';

interface AuthPanelProps {
  activePersona: Role;
  user: AuthenticatedUser | null;
  loading: boolean;
  error: string | null;
  onAuthenticate: (credentials: AuthCredentials, mode: AuthMode) => Promise<boolean>;
  onLogout: () => Promise<void>;
}

export function AuthPanel({
  activePersona,
  user,
  loading,
  error,
  onAuthenticate,
  onLogout,
}: AuthPanelProps) {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get('email') ?? '');
    const password = String(formData.get('password') ?? '');

    const nativeEvent = event.nativeEvent as SubmitEvent;
    const submitter = nativeEvent.submitter as HTMLButtonElement | null;
    const mode = submitter?.value === 'register' ? 'register' : 'login';

    const wasSuccessful = await onAuthenticate({ email, password }, mode);

    if (wasSuccessful) {
      event.currentTarget.reset();
      setShowPassword(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-lg shadow-slate-950/40">
      <header className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-50">
            {activePersona === 'USER_A' ? 'User A' : 'User B'} authentication
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            One-click switch between personas; credentials are independent.
          </p>
        </div>
        {user && (
          <div className="text-right text-xs text-slate-300">
            <div className="font-medium">{user.email}</div>
            <div className="text-slate-500">
              Active as <span className="uppercase">{user.role}</span>
            </div>
          </div>
        )}
      </header>

      <form className="space-y-3" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-200" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="w-full rounded-md border border-slate-700 bg-slate-950/70 px-2 py-1.5 text-sm text-slate-50 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-200" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              minLength={8}
              required
              placeholder="Minimum 8 characters"
              className="w-full rounded-md border border-slate-700 bg-slate-950/70 px-2 py-1.5 pr-16 text-sm text-slate-50 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-2 my-auto h-6 rounded px-2 text-[11px] font-medium text-slate-300 hover:bg-slate-800"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showPassword}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 pt-1">
          <button
            type="submit"
            value="login"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-md bg-sky-500 px-3 py-1.5 text-xs font-medium text-slate-950 shadow hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Working...' : 'Login'}
          </button>
          <button
            type="submit"
            value="register"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-md border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-100 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Quick register
          </button>
          <button
            type="button"
            disabled={loading || !user}
            onClick={() => void onLogout()}
            className="ml-auto inline-flex items-center justify-center rounded-md border border-red-700/70 px-3 py-1.5 text-xs font-medium text-red-200 hover:bg-red-900/40 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Logout
          </button>
        </div>
      </form>

      {error && (
        <p className="mt-3 rounded-md border border-red-800 bg-red-950/50 px-2 py-1.5 text-xs text-red-200">
          {error}
        </p>
      )}
    </div>
  );
}
