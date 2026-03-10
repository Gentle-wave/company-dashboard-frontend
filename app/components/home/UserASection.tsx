import { FormEvent } from 'react';

import { CompanyFormState, CompanyInput } from '@/app/types/dashboard';

interface UserASectionProps {
  companyForm: CompanyFormState;
  isUserA: boolean;
  loading: boolean;
  latestCompanyInput: CompanyInput | null;
  onCompanyFormChange: (field: keyof CompanyFormState, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
}

export function UserASection({
  companyForm,
  isUserA,
  loading,
  latestCompanyInput,
  onCompanyFormChange,
  onSubmit,
}: UserASectionProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-lg shadow-slate-950/40">
      <header className="mb-3">
        <h2 className="text-sm font-semibold text-slate-50">User A · Company inputs</h2>
        <p className="mt-1 text-xs text-slate-400">
          Log in as User A and submit company metrics. The backend computes the percentage and
          stores the latest record.
        </p>
      </header>

      <form className="space-y-3" onSubmit={(event) => void onSubmit(event)}>
        <div className="space-y-1">
          <label className="text-xs font-medium text-slate-200" htmlFor="companyName">
            Company name
          </label>
          <input
            id="companyName"
            type="text"
            required
            value={companyForm.companyName}
            onChange={(event) => onCompanyFormChange('companyName', event.target.value)}
            placeholder="Acme Corp"
            className="w-full rounded-md border border-slate-700 bg-slate-950/70 px-2 py-1.5 text-sm text-slate-50 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-200" htmlFor="numberOfUsers">
              Number of users
            </label>
            <input
              id="numberOfUsers"
              type="number"
              min={1}
              required
              value={companyForm.numberOfUsers}
              onChange={(event) => onCompanyFormChange('numberOfUsers', event.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-950/70 px-2 py-1.5 text-sm text-slate-50 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-200" htmlFor="numberOfProducts">
              Number of products
            </label>
            <input
              id="numberOfProducts"
              type="number"
              min={0}
              required
              value={companyForm.numberOfProducts}
              onChange={(event) => onCompanyFormChange('numberOfProducts', event.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-950/70 px-2 py-1.5 text-sm text-slate-50 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading || !isUserA}
          className="inline-flex items-center justify-center rounded-md bg-sky-500 px-3 py-1.5 text-xs font-medium text-slate-950 shadow hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isUserA ? 'Submit company input' : 'Login as User A to submit'}
        </button>
      </form>

      <div className="mt-4">
        <h3 className="mb-1 text-xs font-semibold text-slate-200">
          Most recent input (for the loaded owner)
        </h3>
        {latestCompanyInput ? (
          <div className="space-y-1 rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-xs text-slate-300">
            <div className="font-medium text-slate-50">{latestCompanyInput.companyName}</div>
            <div className="flex flex-wrap gap-3">
              <span className="text-slate-400">
                Users: <span className="text-slate-100">{latestCompanyInput.numberOfUsers}</span>
              </span>
              <span className="text-slate-400">
                Products:{' '}
                <span className="text-slate-100">{latestCompanyInput.numberOfProducts}</span>
              </span>
              <span className="text-slate-400">
                Percentage:{' '}
                <span className="font-medium text-emerald-400">
                  {latestCompanyInput.percentage.toFixed(2)}%
                </span>
              </span>
            </div>
            <div className="text-slate-500">
              Recorded at {new Date(latestCompanyInput.createdAt).toLocaleString()}
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-500">No record loaded yet. Submit as User A or load as User B.</p>
        )}
      </div>
    </div>
  );
}
