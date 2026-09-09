import { apiRequest } from './api-client';
import type { AuthUser } from '@/store/auth-store';

interface LoginResponse extends AuthUser {
  accessToken: string;
  refreshToken: string;
}

export async function login(username: string, password: string): Promise<LoginResponse> {
  return apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    skipAuth: true,
    body: JSON.stringify({
      username,
      password,
      expiresInMins: 1,
    }),
  });
}

export async function getCurrentUser(): Promise<AuthUser> {
  return apiRequest<AuthUser>('/auth/me');
}
