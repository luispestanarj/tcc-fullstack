import { api } from '../lib/api';
import type { AuthResponse, User } from '../types';
import type { RegisterInput, LoginInput } from '@tcc/shared';

export async function login(data: LoginInput): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>('/auth/login', data);
  return res.data;
}

export async function register(data: RegisterInput): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>('/auth/register', data);
  return res.data;
}

export async function getMe(): Promise<User> {
  const res = await api.get<User>('/auth/me');
  return res.data;
}
