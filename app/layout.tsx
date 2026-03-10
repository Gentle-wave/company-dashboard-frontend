import type { Metadata } from 'next';
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';

import { DashboardProvider } from '@/app/context/dashboard-context';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
  title: 'Company Relay Dashboard',
  description: 'Role-based collaboration between User A and User B',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${jetBrainsMono.variable} min-h-screen bg-[#09090f] text-slate-100 antialiased`}
      >
        <DashboardProvider>
          <div className="relative min-h-screen overflow-x-clip">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(16,185,129,0.2),transparent_35%),radial-gradient(circle_at_88%_4%,rgba(14,165,233,0.28),transparent_32%),radial-gradient(circle_at_68%_82%,rgba(251,191,36,0.15),transparent_32%)]" />
            <div className="relative z-10 flex min-h-screen flex-col">
              <header className="border-b border-white/10 bg-black/25 backdrop-blur-xl">
                <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 md:px-6">
                  <h1 className="text-lg font-semibold tracking-tight md:text-xl">
                    Company Relay <span className="text-cyan-300">Control Deck</span>
                  </h1>
                  <p className="hidden text-xs text-slate-300/80 md:block">
                    Next.js app router · Tailwind CSS · Role-based workflows
                  </p>
                </div>
              </header>
              <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 md:px-6 md:py-8">{children}</main>
              <footer className="border-t border-white/10 bg-black/20">
                <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 text-xs text-slate-300/70 md:px-6">
                  <span>Designed for the take-home exercise.</span>
                  <span className="font-mono">secure cookies · scoped roles</span>
                </div>
              </footer>
            </div>
          </div>
        </DashboardProvider>
      </body>
    </html>
  );
}
