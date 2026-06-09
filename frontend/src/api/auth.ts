import { API_BASE_URL } from './index';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
}

export const authService = {
  login: async (data: LoginPayload) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }
    return response.json();
  },
  
  register: async (data: RegisterPayload) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }
    return response.json();
  },
  
  forgotPassword: async (data: ForgotPasswordPayload) => {
    console.log('Forgot password request:', data);
    return new Promise((resolve) => setTimeout(() => resolve({ message: 'Reset email sent' }), 1000));
  },
  
  resetPassword: async (data: ResetPasswordPayload) => {
    console.log('Reset password request:', data);
    return new Promise((resolve) => setTimeout(() => resolve({ message: 'Password successfully reset' }), 1000));
  },

  me: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }
    return response.json();
  },

  updateProfile: async (token: string, data: { name?: string; password?: string }) => {
    console.log('Updating profile...', data);
    const response = await fetch(`${API_BASE_URL}/auth/update`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Update failed');
    }
    return response.json();
  }
};
