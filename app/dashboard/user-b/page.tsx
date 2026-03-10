'use client';

import { FormEvent, useCallback } from 'react';

import { UserBSection } from '@/app/components/home/UserBSection';
import { useDashboardContext } from '@/app/context/dashboard-context';

export default function UserBPage() {
  const {
    user,
    loading,
    uploading,
    selectedOwnerId,
    setSelectedOwnerId,
    latestImage,
    latestCompanyInput,
    fetchLatestForOwner,
    uploadImageForOwner,
  } = useDashboardContext();

  const handleLoadLatest = useCallback(() => {
    void fetchLatestForOwner(selectedOwnerId);
  }, [fetchLatestForOwner, selectedOwnerId]);

  const handleUploadImage = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const formData = new FormData(event.currentTarget);
      const file = formData.get('file');
      const ownerId = String(formData.get('ownerId') ?? '');
      await uploadImageForOwner(file instanceof File ? file : null, ownerId);
    },
    [uploadImageForOwner],
  );

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-emerald-300/30 bg-emerald-500/10 p-4">
        <h2 className="text-lg font-semibold text-emerald-100">User B Workspace</h2>
        <p className="mt-1 text-sm text-slate-200">
          Load a User A owner record, then upload image assets and inspect fresh metadata.
        </p>
      </section>

      <div className="grid gap-4 xl:grid-cols-[1fr_0.8fr]">
        <UserBSection
          selectedOwnerId={selectedOwnerId}
          isUserB={user?.role === 'USER_B'}
          loading={loading}
          uploading={uploading}
          latestImage={latestImage}
          onOwnerIdChange={setSelectedOwnerId}
          onLoadLatest={handleLoadLatest}
          onUploadImage={handleUploadImage}
        />

        <aside className="rounded-2xl border border-white/10 bg-black/25 p-4 backdrop-blur-md">
          <h3 className="text-sm font-semibold text-slate-100">Latest owner company data</h3>
          {latestCompanyInput ? (
            <div className="mt-3 space-y-2 rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-slate-200">
              <p className="text-sm font-semibold text-white">{latestCompanyInput.companyName}</p>
              <p>Users: {latestCompanyInput.numberOfUsers}</p>
              <p>Products: {latestCompanyInput.numberOfProducts}</p>
              <p className="text-emerald-300">Percentage: {latestCompanyInput.percentage.toFixed(2)}%</p>
              <p className="text-slate-400">
                Captured at {new Date(latestCompanyInput.createdAt).toLocaleString()}
              </p>
            </div>
          ) : (
            <p className="mt-3 text-xs text-slate-400">No owner company record loaded yet.</p>
          )}
        </aside>
      </div>
    </div>
  );
}
