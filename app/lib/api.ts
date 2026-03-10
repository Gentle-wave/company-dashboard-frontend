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
  role: Role,
): Promise<AuthenticatedUser> {
  const response = await fetch(`${API_BASE_URL}/auth/${mode}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: credentials.email,
      password: credentials.password,
      role,
    }),
  });

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response, `Unable to ${mode}. Please check your credentials and try again.`),
    );
  }

  return (await response.json()) as AuthenticatedUser;
}

export async function logout(): Promise<void> {
  await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });
}

export async function submitCompanyInput(form: CompanyFormState): Promise<CompanyInput> {
  const response = await fetch(`${API_BASE_URL}/company-input`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
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

export async function fetchLatestCompany(ownerId: string): Promise<CompanyInput | null> {
  const response = await fetch(`${API_BASE_URL}/company-input/latest/${ownerId}`, {
    credentials: 'include',
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as CompanyInput | null;
}

export async function fetchLatestImage(ownerId: string): Promise<ImageUpload | null> {
  const response = await fetch(`${API_BASE_URL}/uploads/latest/${ownerId}`, {
    credentials: 'include',
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as ImageUpload | null;
}

export async function uploadImage(file: File, ownerId: string): Promise<ImageUpload> {
  const payload = new FormData();
  payload.append('file', file);
  payload.append('ownerId', ownerId);

  const response = await fetch(`${API_BASE_URL}/uploads`, {
    method: 'POST',
    credentials: 'include',
    body: payload,
  });

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response, 'Unable to upload image. Please check file type and size.'),
    );
  }

  return (await response.json()) as ImageUpload;
}
