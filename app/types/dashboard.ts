export type Role = 'USER_A' | 'USER_B';

export type AuthMode = 'login' | 'register';

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: Role;
}

export interface CompanyInput {
  id: string;
  companyName: string;
  numberOfUsers: number;
  numberOfProducts: number;
  percentage: number;
  createdAt: string;
}

export interface CompanyFormState {
  companyName: string;
  numberOfUsers: string;
  numberOfProducts: string;
}

export interface ImageUpload {
  id: string;
  filename: string;
  mimetype: string;
  size: number;
  createdAt: string;
  url?: string;
  path?: string;
}
