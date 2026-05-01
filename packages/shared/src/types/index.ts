export type Role = 'USER' | 'ADMIN';
export type ListType = 'TASK' | 'SHOPPING' | 'REMINDER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface List {
  id: string;
  title: string;
  type: ListType;
  color: string | null;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  _count?: { items: number };
}

export interface Item {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  quantity: number | null;
  unit: string | null;
  dueDate: string | null;
  position: number;
  listId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiError {
  error: string;
  message: string;
  details?: unknown;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
}
