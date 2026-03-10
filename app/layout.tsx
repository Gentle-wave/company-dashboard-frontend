import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Takehome Dashboard',
  description: 'Two-user data sharing app (User A and User B)',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-50 antialiased">
        <div className="min-h-screen flex flex-col">
          <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur">
            <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
              <h1 className="text-lg font-semibold tracking-tight">
                Takehome <span className="text-sky-400">Dashboard</span>
              </h1>
              <p className="text-xs text-slate-400">
                NestJS · Prisma · Next.js · PostgreSQL
              </p>
            </div>
          </header>
          <main className="flex-1 mx-auto max-w-5xl w-full px-4 py-6">{children}</main>
          <footer className="border-t border-slate-800 bg-slate-900/60">
            <div className="mx-auto max-w-5xl px-4 py-3 text-xs text-slate-500 flex justify-between">
              <span>Built for the take-home assignment.</span>
              <span>Secure cookies · Role-based access</span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
