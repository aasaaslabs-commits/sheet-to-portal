import { API_BASE_URL } from './index';

export const sheetService = {
  upload: async (token: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/sheets/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Upload failed');
    }

    return response.json();
  },

  getAll: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/sheets`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch sheets');
    }

    return response.json();
  },

  getData: async (token: string, id: string) => {
    const response = await fetch(`${API_BASE_URL}/sheets/${id}/data`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch sheet data');
    }

    return response.json();
  },
};
