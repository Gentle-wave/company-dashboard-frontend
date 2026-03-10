'use client';

import Link from 'next/link';

import { SessionSnapshot } from '@/app/components/home/SessionSnapshot';
import { useDashboardContext } from '@/app/context/dashboard-context';

export default function DashboardPage() {
  const { user, activePersona, latestCompanyInput, latestImage, selectedOwnerId } = useDashboardContext();

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-fuchsia-300/30 bg-linear-to-r from-fuchsia-500/15 via-cyan-500/10 to-emerald-500/15 p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-fuchsia-100">Dashboard Overview</p>
        <h2 className="mt-2 text-2xl font-semibold text-white">Pick a workflow module</h2>
        <p className="mt-2 text-sm text-slate-100/90">
          Use dedicated pages for each role to keep state focused and reduce cognitive load.
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <Link
          href="/dashboard/user-a"
          className="rounded-2xl border border-cyan-300/30 bg-cyan-500/10 p-5 transition hover:-translate-y-0.5 hover:bg-cyan-500/20"
        >
          <p className="text-xs uppercase tracking-wide text-cyan-100">User A</p>
          <h3 className="mt-1 text-lg font-semibold text-white">Company Input Studio</h3>
          <p className="mt-1 text-sm text-slate-200">Submit metrics and inspect the latest computed percentage.</p>
        </Link>

        <Link
          href="/dashboard/user-b"
          className="rounded-2xl border border-emerald-300/30 bg-emerald-500/10 p-5 transition hover:-translate-y-0.5 hover:bg-emerald-500/20"
        >
          <p className="text-xs uppercase tracking-wide text-emerald-100">User B</p>
          <h3 className="mt-1 text-lg font-semibold text-white">Upload + Owner Inspector</h3>
          <p className="mt-1 text-sm text-slate-200">Load owner data and upload image assets for a selected User A account.</p>
        </Link>
      </div>

      <section className="grid gap-4 lg:grid-cols-2">
        <SessionSnapshot user={user} activePersona={activePersona} />

        <div className="rounded-2xl border border-white/10 bg-black/25 p-4 backdrop-blur-md">
          <h3 className="text-sm font-semibold text-slate-100">Recent shared state</h3>
          <div className="mt-3 space-y-3 text-xs text-slate-300">
            <div className="rounded-lg border border-white/10 bg-white/5 p-3">
              <p className="text-slate-400">Latest company</p>
              {latestCompanyInput ? (
                <p className="mt-1 text-slate-100">
                  {latestCompanyInput.companyName} · {latestCompanyInput.percentage.toFixed(2)}%
                </p>
              ) : (
                <p className="mt-1 text-slate-500">No company snapshot loaded.</p>
              )}
            </div>

            <div className="rounded-lg border border-white/10 bg-white/5 p-3">
              <p className="text-slate-400">Latest upload</p>
              {latestImage ? (
                <p className="mt-1 text-slate-100">
                  {latestImage.filename} ({(latestImage.size / 1024).toFixed(1)} KB)
                </p>
              ) : (
                <p className="mt-1 text-slate-500">No image metadata loaded.</p>
              )}
            </div>

            <p className="text-slate-400">Selected owner ID: {selectedOwnerId || 'n/a'}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
