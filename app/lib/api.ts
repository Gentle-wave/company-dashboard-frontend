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

interface ErrorPayload {
  message?: string | string[];
}

type UnknownRecord = Record<string, unknown>;

const TOKEN_STORAGE_KEY = 'takehome-dashboard:accessToken';
const USER_STORAGE_KEY = 'takehome-dashboard:user';

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null;
}

function getStringValue(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim().length > 0 ? value : undefined;
}

function getStoredAccessToken(): string | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }

  const directToken = getStringValue(window.localStorage.getItem(TOKEN_STORAGE_KEY));
  if (directToken) {
    return directToken;
  }

  const storedUser = window.localStorage.getItem(USER_STORAGE_KEY);
  if (!storedUser) {
    return undefined;
  }

  try {
    const parsed = JSON.parse(storedUser) as unknown;
    if (!isRecord(parsed)) {
      return undefined;
    }

    return (
      getStringValue(parsed.accessToken) ??
      getStringValue(parsed.access_token) ??
      getStringValue(parsed.token)
    );
  } catch {
    return undefined;
  }
}

function normalizeAuthenticatedUser(payload: unknown): AuthenticatedUser {
  if (!isRecord(payload)) {
    throw new Error('Invalid auth response payload.');
  }

  const root = payload;
  const nestedUser = isRecord(root.user) ? root.user : undefined;
  const source = nestedUser ?? root;

  const id = getStringValue(source.id) ?? getStringValue(source.userId) ?? getStringValue(root.userId);
  const email = getStringValue(source.email) ?? getStringValue(root.email);
  const roleValue = getStringValue(source.role) ?? getStringValue(root.role);
  const role = roleValue === 'USER_A' || roleValue === 'USER_B' ? roleValue : undefined;

  if (!id || !email || !role) {
    throw new Error('Auth response is missing required user fields.');
  }

  const accessToken =
    getStringValue(root.accessToken) ??
    getStringValue(root.access_token) ??
    getStringValue(root.token) ??
    getStringValue(root.jwt) ??
    getStringValue(source.accessToken) ??
    getStringValue(source.access_token) ??
    getStringValue(source.token);

  return {
    id,
    email,
    role,
    accessToken,
  };
}

function buildAuthHeaders(token?: string, extra?: Record<string, string>): Record<string, string> {
  const headers: Record<string, string> = { ...extra };
  const fallbackToken = getStoredAccessToken();
  const resolvedToken = token ?? fallbackToken;

  if (resolvedToken) {
    headers['Authorization'] = `Bearer ${resolvedToken}`;
  }
  return headers;
}

async function getErrorMessage(response: Response, fallback: string): Promise<string> {
  const payload = (await response.json().catch(() => null)) as ErrorPayload | null;
  const message = payload?.message;

  if (!message) {
    return fallback;
  }

  return Array.isArray(message) ? message.join(', ') : message;
}

export async function authenticate(
  credentials: AuthCredentials,
  mode: AuthMode,
  role?: Role,
): Promise<AuthenticatedUser> {
  const authPayload: {
    email: string;
    password: string;
    role?: Role;
  } = {
    email: credentials.email,
    password: credentials.password,
  };

  if (mode === 'register' && role) {
    authPayload.role = role;
  }

  const response = await fetch(`${API_BASE_URL}/auth/${mode}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(authPayload),
  });

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response, `Unable to ${mode}. Please check your credentials and try again.`),
    );
  }

  return normalizeAuthenticatedUser(await response.json());
}

export async function authenticateWithFirebase(
  idToken: string,
  role?: Role,
): Promise<AuthenticatedUser> {
  const response = await fetch(`${API_BASE_URL}/auth/firebase/login`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      idToken,
      role,
    }),
  });

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response, 'Unable to authenticate with Firebase. Please try again.'),
    );
  }

  return normalizeAuthenticatedUser(await response.json());
}

export async function logout(token?: string): Promise<void> {
  await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
    headers: buildAuthHeaders(token),
  });
}

export async function submitCompanyInput(form: CompanyFormState, token?: string): Promise<CompanyInput> {
  const response = await fetch(`${API_BASE_URL}/company-input`, {
    method: 'POST',
    credentials: 'include',
    headers: buildAuthHeaders(token, { 'Content-Type': 'application/json' }),
    body: JSON.stringify({
      companyName: form.companyName,
      numberOfUsers: Number(form.numberOfUsers),
      numberOfProducts: Number(form.numberOfProducts),
    }),
  });

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response, 'Unable to store company input. Please try again shortly.'),
    );
  }

  return (await response.json()) as CompanyInput;
}

export async function fetchLatestCompany(ownerId: string, token?: string): Promise<CompanyInput | null> {
  const response = await fetch(`${API_BASE_URL}/company-input/latest/${ownerId}`, {
    credentials: 'include',
    headers: buildAuthHeaders(token),
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as CompanyInput | null;
}

export async function fetchLatestImage(ownerId: string, token?: string): Promise<ImageUpload | null> {
  const response = await fetch(`${API_BASE_URL}/uploads/latest/${ownerId}`, {
    credentials: 'include',
    headers: buildAuthHeaders(token),
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as ImageUpload | null;
}

export async function uploadImage(file: File, ownerId: string, token?: string): Promise<ImageUpload> {
  const payload = new FormData();
  payload.append('file', file);
  payload.append('ownerId', ownerId);

  const response = await fetch(`${API_BASE_URL}/uploads`, {
    method: 'POST',
    credentials: 'include',
    headers: buildAuthHeaders(token),
    body: payload,
  });

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response, 'Unable to upload image. Please check file type and size.'),
    );
  }

  return (await response.json()) as ImageUpload;
}
