'use client';

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import * as api from '@/app/lib/api';
import { getFirebaseIdTokenWithGooglePopup, signOutFirebaseClient } from '@/app/lib/firebase-auth';
import {
  AuthCredentials,
  AuthMode,
  AuthenticatedUser,
  CompanyFormState,
  CompanyInput,
  ImageUpload,
  Role,
} from '@/app/types/dashboard';

interface DashboardContextValue {
  activePersona: Role;
  setActivePersona: (role: Role) => void;
  user: AuthenticatedUser | null;
  loading: boolean;
  uploading: boolean;
  hydrated: boolean;
  error: string | null;
  latestCompanyInput: CompanyInput | null;
  latestImage: ImageUpload | null;
  selectedOwnerId: string;
  setSelectedOwnerId: (ownerId: string) => void;
  clearError: () => void;
  authenticateUser: (
    credentials: AuthCredentials,
    mode: AuthMode,
  ) => Promise<boolean>;
  authenticateWithFirebase: () => Promise<boolean>;
  logoutUser: () => Promise<void>;
  submitCompanyForm: (form: CompanyFormState) => Promise<boolean>;
  fetchLatestForOwner: (ownerId: string) => Promise<void>;
  uploadImageForOwner: (file: File | null, ownerId: string) => Promise<boolean>;
}

const USER_STORAGE_KEY = 'takehome-dashboard:user';

const DashboardContext = createContext<DashboardContextValue | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [activePersona, setActivePersona] = useState<Role>('USER_A');
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [latestCompanyInput, setLatestCompanyInput] = useState<CompanyInput | null>(null);
  const [latestImage, setLatestImage] = useState<ImageUpload | null>(null);
  const [selectedOwnerId, setSelectedOwnerId] = useState('');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(USER_STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored) as AuthenticatedUser);
      }
    } catch {
      window.localStorage.removeItem(USER_STORAGE_KEY);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    if (user) {
      window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      return;
    }

    window.localStorage.removeItem(USER_STORAGE_KEY);
  }, [hydrated, user]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const authenticateUser = useCallback(
    async (credentials: AuthCredentials, mode: AuthMode) => {
      setError(null);
      setLoading(true);

      try {
        const authenticated = await api.authenticate(
          credentials,
          mode,
          mode === 'register' ? activePersona : undefined,
        );
        setUser(authenticated);
        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unexpected error during auth.';
        setError(message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [activePersona],
  );

  const authenticateWithFirebase = useCallback(async () => {
    try {
      // Trigger popup immediately before any state updates to preserve user gesture
      const idToken = await getFirebaseIdTokenWithGooglePopup();
      
      setError(null);
      setLoading(true);

      const authenticated = await api.authenticateWithFirebase(idToken, activePersona);
      setUser(authenticated);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unexpected Firebase auth error.';
      setError(message);
      setLoading(false);
      return false;
    } finally {
      setLoading(false);
    }
  }, [activePersona]);

  const logoutUser = useCallback(async () => {
    setError(null);
    setLoading(true);

    try {
      await api.logout(user?.accessToken);
      await signOutFirebaseClient();
    } catch {
      // logout remains best-effort for UX flow
    } finally {
      setUser(null);
      setLatestCompanyInput(null);
      setLatestImage(null);
      setSelectedOwnerId('');
      setLoading(false);
    }
  }, []);

  const submitCompanyForm = useCallback(
    async (form: CompanyFormState) => {
      if (!user || user.role !== 'USER_A') {
        setError('You must be logged in as User A to submit this form.');
        return false;
      }

      setError(null);
      setLoading(true);

      try {
        const company = await api.submitCompanyInput(form, user.accessToken);
        setLatestCompanyInput(company);
        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unexpected error.';
        setError(message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [user],
  );

  const fetchLatestForOwner = useCallback(
    async (ownerId: string) => {
      if (!ownerId) {
        setError('Please provide a valid User A ID.');
        return;
      }
      if (!user || user.role !== 'USER_B') {
        setError('You must be logged in as User B to view User A data.');
        return;
      }

      setError(null);
      setLoading(true);
      setSelectedOwnerId(ownerId);

      try {
        const [company, image] = await Promise.all([
          api.fetchLatestCompany(ownerId, user.accessToken),
          api.fetchLatestImage(ownerId, user.accessToken),
        ]);

        setLatestCompanyInput(company);
        setLatestImage(image);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unable to load latest data.';
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [user],
  );

  const uploadImageForOwner = useCallback(
    async (file: File | null, ownerId: string) => {
      if (!user || user.role !== 'USER_B') {
        setError('You must be logged in as User B to upload an image.');
        return false;
      }
      if (!file) {
        setError('Please choose an image file.');
        return false;
      }
      if (!ownerId) {
        setError('Please enter the User A ID you are uploading for.');
        return false;
      }

      setError(null);
      setUploading(true);

      try {
        const image = await api.uploadImage(file, ownerId, user.accessToken);
        setSelectedOwnerId(ownerId);
        setLatestImage(image);
        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unexpected error while uploading.';
        setError(message);
        return false;
      } finally {
        setUploading(false);
      }
    },
    [user],
  );

  const value = useMemo<DashboardContextValue>(
    () => ({
      activePersona,
      setActivePersona,
      user,
      loading,
      uploading,
      hydrated,
      error,
      latestCompanyInput,
      latestImage,
      selectedOwnerId,
      setSelectedOwnerId,
      clearError,
      authenticateUser,
      authenticateWithFirebase,
      logoutUser,
      submitCompanyForm,
      fetchLatestForOwner,
      uploadImageForOwner,
    }),
    [
      activePersona,
      user,
      loading,
      uploading,
      hydrated,
      error,
      latestCompanyInput,
      latestImage,
      selectedOwnerId,
      clearError,
      authenticateUser,
      authenticateWithFirebase,
      logoutUser,
      submitCompanyForm,
      fetchLatestForOwner,
      uploadImageForOwner,
    ],
  );

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export function useDashboardContext() {
  const context = useContext(DashboardContext);

  if (!context) {
    throw new Error('useDashboardContext must be used within DashboardProvider.');
  }

  return context;
}
