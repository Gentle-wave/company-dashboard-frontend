import { Role } from '@/app/types/dashboard';

interface PersonaSelectorProps {
  activePersona: Role;
  onPersonaChange: (role: Role) => void;
}

export function PersonaSelector({ activePersona, onPersonaChange }: PersonaSelectorProps) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-lg shadow-slate-950/40">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-50">Choose persona</h2>
          <p className="mt-1 text-xs text-slate-400">
            User A owns data and submits company inputs. User B uploads images for a specific User A
            and reads their latest inputs.
          </p>
        </div>
        <div className="inline-flex rounded-full border border-slate-700 bg-slate-900 p-1 text-xs">
          <button
            type="button"
            onClick={() => onPersonaChange('USER_A')}
            className={`rounded-full px-3 py-1 transition ${
              activePersona === 'USER_A'
                ? 'bg-sky-500 text-slate-900 shadow'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            User A
          </button>
          <button
            type="button"
            onClick={() => onPersonaChange('USER_B')}
            className={`rounded-full px-3 py-1 transition ${
              activePersona === 'USER_B'
                ? 'bg-emerald-400 text-slate-900 shadow'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            User B
          </button>
        </div>
      </div>
    </section>
  );
}
