import { API_BASE_URL } from './index';

export const reportService = {
  generate: async (token: string, sheetId: string, title?: string, description?: string) => {
    const response = await fetch(`${API_BASE_URL}/reports/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ sheetId, title, description }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Generation failed');
    }

    return response.json();
  },

  getAll: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/reports`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch reports');
    }

    return response.json();
  },

  getById: async (token: string, id: string) => {
    const response = await fetch(`${API_BASE_URL}/reports/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch report');
    }

    return response.json();
  },

  getPublic: async (shareToken: string) => {
    const response = await fetch(`${API_BASE_URL}/reports/shared/${shareToken}`);

    if (!response.ok) {
      throw new Error('Failed to fetch public report');
    }

    return response.json();
  },
};
