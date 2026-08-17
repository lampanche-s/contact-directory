import { apiRequest } from '../../../services/http/apiClient';

export type AdminSession = {
  authenticated: boolean;
  admin: {
    id: string;
    username: string;
    role: string;
  } | null;
};

export const apiAuthService = {
  async getSession(): Promise<AdminSession> {
    const response = await apiRequest<AdminSession>('/auth/me');
    return response.data;
  },

  async login(password: string): Promise<AdminSession> {
    const response = await apiRequest<AdminSession>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        username: 'admin',
        password
      })
    });

    return response.data;
  },

  async logout(): Promise<AdminSession> {
    const response = await apiRequest<AdminSession>('/auth/logout', {
      method: 'POST'
    });

    return response.data;
  }
};
