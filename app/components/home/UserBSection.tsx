import { FormEvent } from 'react';

import { ImageUpload } from '@/app/types/dashboard';

interface UserBSectionProps {
  selectedOwnerId: string;
  isUserB: boolean;
  loading: boolean;
  uploading: boolean;
  latestImage: ImageUpload | null;
  onOwnerIdChange: (value: string) => void;
  onLoadLatest: () => void;
  onUploadImage: (event: FormEvent<HTMLFormElement>) => Promise<void>;
}

export function UserBSection({
  selectedOwnerId,
  isUserB,
  loading,
  uploading,
  latestImage,
  onOwnerIdChange,
  onLoadLatest,
  onUploadImage,
}: UserBSectionProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-lg shadow-slate-950/40">
      <header className="mb-3">
        <h2 className="text-sm font-semibold text-slate-50">User B · Upload & view</h2>
        <p className="mt-1 text-xs text-slate-400">
          Log in as User B, paste a User A ID, then upload an image and fetch the most recent
          record for that User A.
        </p>
      </header>

      <div className="space-y-3">
        <form
          className="space-y-3 rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2"
          onSubmit={(event) => {
            event.preventDefault();
            onLoadLatest();
          }}
        >
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-200" htmlFor="ownerId">
              User A ID
            </label>
            <input
              id="ownerId"
              type="text"
              placeholder="Paste User A ID here"
              value={selectedOwnerId}
              onChange={(event) => onOwnerIdChange(event.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-950/70 px-2 py-1.5 text-sm text-slate-50 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={loading || !isUserB}
              className="inline-flex items-center justify-center rounded-md bg-emerald-400 px-3 py-1.5 text-xs font-medium text-slate-950 shadow hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Load latest data
            </button>
          </div>
        </form>

        <form
          className="space-y-3 rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2"
          onSubmit={(event) => void onUploadImage(event)}
        >
          <input type="hidden" name="ownerId" value={selectedOwnerId} />
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-200" htmlFor="file">
              Upload image (PNG/JPEG, max 5MB)
            </label>
            <input
              id="file"
              name="file"
              type="file"
              accept="image/*"
              className="w-full text-xs text-slate-300 file:mr-3 file:rounded-md file:border-0 file:bg-slate-800 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-slate-100 hover:file:bg-slate-700"
            />
          </div>
          <button
            type="submit"
            disabled={uploading || !isUserB}
            className="inline-flex items-center justify-center rounded-md bg-emerald-400 px-3 py-1.5 text-xs font-medium text-slate-950 shadow hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Upload to User A account'}
          </button>
        </form>
      </div>

      <div className="mt-4 space-y-3">
        <div>
          <h3 className="mb-1 text-xs font-semibold text-slate-200">
            Latest image metadata for selected User A
          </h3>
          {latestImage ? (
            <div className="space-y-1 rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-xs text-slate-300">
              <div className="font-medium text-slate-50">{latestImage.filename}</div>
              <div className="flex flex-wrap gap-3">
                <span className="text-slate-400">
                  MIME: <span className="text-slate-100">{latestImage.mimetype}</span>
                </span>
                <span className="text-slate-400">
                  Size: <span className="text-slate-100">{(latestImage.size / 1024).toFixed(1)} KB</span>
                </span>
              </div>
              <div className="text-slate-500">
                Uploaded at {new Date(latestImage.createdAt).toLocaleString()}
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500">No image metadata loaded yet for this User A.</p>
          )}
        </div>
      </div>
    </div>
  );
}
