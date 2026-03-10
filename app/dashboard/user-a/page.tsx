'use client';

import { FormEvent, useCallback, useState } from 'react';

import { UserASection } from '@/app/components/home/UserASection';
import { useDashboardContext } from '@/app/context/dashboard-context';
import { CompanyFormState } from '@/app/types/dashboard';

const INITIAL_FORM: CompanyFormState = {
  companyName: '',
  numberOfUsers: '',
  numberOfProducts: '',
};

export default function UserAPage() {
  const [companyForm, setCompanyForm] = useState<CompanyFormState>(INITIAL_FORM);
  const { user, loading, latestCompanyInput, submitCompanyForm } = useDashboardContext();

  const handleCompanyFormChange = useCallback((field: keyof CompanyFormState, value: string) => {
    setCompanyForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      await submitCompanyForm(companyForm);
    },
    [companyForm, submitCompanyForm],
  );

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-cyan-300/30 bg-cyan-500/10 p-4">
        <h2 className="text-lg font-semibold text-cyan-100">User A Workspace</h2>
        <p className="mt-1 text-sm text-slate-200">
          Role-locked input page for company metrics. Only authenticated User A accounts can submit.
        </p>
      </section>

      <UserASection
        companyForm={companyForm}
        isUserA={user?.role === 'USER_A'}
        loading={loading}
        latestCompanyInput={latestCompanyInput}
        onCompanyFormChange={handleCompanyFormChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
