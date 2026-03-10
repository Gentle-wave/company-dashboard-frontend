'use client';

import { FormEvent, useCallback, useState } from 'react';

import { AuthPanel } from '@/app/components/home/AuthPanel';
import { PersonaSelector } from '@/app/components/home/PersonaSelector';
import { SessionSnapshot } from '@/app/components/home/SessionSnapshot';
import { UserASection } from '@/app/components/home/UserASection';
import { UserBSection } from '@/app/components/home/UserBSection';
import { API_BASE_URL } from '@/app/lib/config';
import {
  AuthCredentials,
  AuthMode,
  AuthenticatedUser,
  CompanyFormState,
  CompanyInput,
  ImageUpload,
  Role,
} from '@/app/types/dashboard';

export default function HomePage() {
  const [activePersona, setActivePersona] = useState<Role>('USER_A');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [user, setUser] = useState<AuthenticatedUser | null>(null);

  const [companyForm, setCompanyForm] = useState<CompanyFormState>({
    companyName: '',
    numberOfUsers: '',
    numberOfProducts: '',
  });
  const [latestCompanyInput, setLatestCompanyInput] = useState<CompanyInput | null>(null);

  const [selectedOwnerId, setSelectedOwnerId] = useState('');
  const [latestImage, setLatestImage] = useState<ImageUpload | null>(null);
  const [uploading, setUploading] = useState(false);

  const isUserA = user?.role === 'USER_A';
  const isUserB = user?.role === 'USER_B';

  const handleAuthenticate = useCallback(
    async (credentials: AuthCredentials, mode: AuthMode) => {
      setError(null);
      setLoading(true);

      try {
        const response = await fetch(`${API_BASE_URL}/auth/${mode}`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
            role: activePersona,
          }),
        });

        if (!response.ok) {
          const payload = await response.json().catch(() => null);
          const message =
            payload?.message ?? `Unable to ${mode}. Please check your credentials and try again.`;
          throw new Error(Array.isArray(message) ? message.join(', ') : message);
        }

        const body = (await response.json()) as AuthenticatedUser;
        setUser(body);
        setError(null);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unexpected error during auth.';
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [activePersona],
  );

  const handleLogout = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      setUser(null);
      setLatestCompanyInput(null);
      setLatestImage(null);
      setSelectedOwnerId('');
    } catch {
      // silent - logout is best effort
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCompanyFormChange = useCallback((field: keyof CompanyFormState, value: string) => {
    setCompanyForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const submitCompanyInput = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!user || !isUserA) {
        setError('You must be logged in as User A to submit this form.');
        return;
      }

      setError(null);
      setLoading(true);

      try {
        const response = await fetch(`${API_BASE_URL}/company-input`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            companyName: companyForm.companyName,
            numberOfUsers: Number(companyForm.numberOfUsers),
            numberOfProducts: Number(companyForm.numberOfProducts),
          }),
        });

        if (!response.ok) {
          const payload = await response.json().catch(() => null);
          const message =
            payload?.message ?? 'Unable to store company input. Please try again shortly.';
          throw new Error(Array.isArray(message) ? message.join(', ') : message);
        }

        const body = (await response.json()) as CompanyInput;
        setLatestCompanyInput(body);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unexpected error.';
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [companyForm, isUserA, user],
  );

  const fetchLatestForOwner = useCallback(
    async (ownerId: string) => {
      if (!ownerId) {
        setError('Please provide a valid User A ID.');
        return;
      }
      if (!user || !isUserB) {
        setError('You must be logged in as User B to view User A data.');
        return;
      }

      setError(null);
      setLoading(true);
      try {
        const [companyRes, imageRes] = await Promise.all([
          fetch(`${API_BASE_URL}/company-input/latest/${ownerId}`, {
            credentials: 'include',
          }),
          fetch(`${API_BASE_URL}/uploads/latest/${ownerId}`, {
            credentials: 'include',
          }),
        ]);

        if (companyRes.ok) {
          const company = (await companyRes.json()) as CompanyInput | null;
          setLatestCompanyInput(company);
        } else {
          setLatestCompanyInput(null);
        }

        if (imageRes.ok) {
          const image = (await imageRes.json()) as ImageUpload | null;
          setLatestImage(image);
        } else {
          setLatestImage(null);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unable to load latest data.';
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [isUserB, user],
  );

  const loadLatestForSelectedOwner = useCallback(() => {
    void fetchLatestForOwner(selectedOwnerId);
  }, [fetchLatestForOwner, selectedOwnerId]);

  const uploadImage = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!user || !isUserB) {
        setError('You must be logged in as User B to upload an image.');
        return;
      }

      const formData = new FormData(event.currentTarget);
      const file = formData.get('file');
      const ownerId = String(formData.get('ownerId') ?? '');

      if (!(file instanceof File)) {
        setError('Please choose an image file.');
        return;
      }
      if (!ownerId) {
        setError('Please enter the User A ID you are uploading for.');
        return;
      }

      setError(null);
      setUploading(true);

      try {
        const payload = new FormData();
        payload.append('file', file);
        payload.append('ownerId', ownerId);

        const response = await fetch(`${API_BASE_URL}/uploads`, {
          method: 'POST',
          credentials: 'include',
          body: payload,
        });

        if (!response.ok) {
          const data = await response.json().catch(() => null);
          const message =
            data?.message ?? 'Unable to upload image. Please check file type and size.';
          throw new Error(Array.isArray(message) ? message.join(', ') : message);
        }

        const body = (await response.json()) as ImageUpload;
        setLatestImage(body);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unexpected error while uploading.';
        setError(message);
      } finally {
        setUploading(false);
      }
    },
    [isUserB, user],
  );

  return (
    <div className="space-y-6">
      <PersonaSelector activePersona={activePersona} onPersonaChange={setActivePersona} />

      <section className="grid gap-6 md:grid-cols-2">
        <AuthPanel
          activePersona={activePersona}
          user={user}
          loading={loading}
          error={error}
          onAuthenticate={handleAuthenticate}
          onLogout={handleLogout}
        />
        <SessionSnapshot user={user} activePersona={activePersona} />
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <UserASection
          companyForm={companyForm}
          isUserA={isUserA}
          loading={loading}
          latestCompanyInput={latestCompanyInput}
          onCompanyFormChange={handleCompanyFormChange}
          onSubmit={submitCompanyInput}
        />
        <UserBSection
          selectedOwnerId={selectedOwnerId}
          isUserB={isUserB}
          loading={loading}
          uploading={uploading}
          latestImage={latestImage}
          onOwnerIdChange={setSelectedOwnerId}
          onLoadLatest={loadLatestForSelectedOwner}
          onUploadImage={uploadImage}
        />
      </section>
    </div>
  );
}
