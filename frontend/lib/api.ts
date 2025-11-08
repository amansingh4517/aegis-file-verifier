// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Token management
export const setAuthToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', token);
  }
};

export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

export const removeAuthToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
  }
};

export const setUser = (user: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user));
  }
};

export const getUser = () => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
  return null;
};

export const removeUser = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user');
  }
};

// Helper to create headers
const getHeaders = (includeAuth = true): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

// Auth API
export const authAPI = {
  signup: async (data: { name: string; email: string; password: string }) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Signup failed');

    if (result.data.token) {
      setAuthToken(result.data.token);
      setUser(result.data.user);
    }

    return result;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Login failed');

    if (result.data.token) {
      setAuthToken(result.data.token);
      setUser(result.data.user);
    }

    return result;
  },

  getMe: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getHeaders(),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to get user');

    return result;
  },

  updateProfile: async (data: { name?: string; email?: string }) => {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to update profile');

    if (result.data.user) {
      setUser(result.data.user);
    }

    return result;
  },

  logout: () => {
    removeAuthToken();
    removeUser();
  },
};

// Verification API
export const verificationAPI = {
  upload: async (file: File, quickScanOnly = false) => {
    // File size validation (10MB limit)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > MAX_FILE_SIZE) {
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      throw new Error(`File size is too large (${fileSizeMB}MB). Maximum allowed size is 10MB.`);
    }
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('quickScanOnly', quickScanOnly.toString());

    const token = getAuthToken();
    
    if (!token) {
      console.error('No auth token found in localStorage');
      throw new Error('Not authorized. Please login again.');
    }

    console.log('Uploading with token:', token.substring(0, 20) + '...');

    try {
      const response = await fetch(`${API_BASE_URL}/verify/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      let result;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      } else {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error(`Server error: ${response.status} - ${text.substring(0, 100)}`);
      }
      
      if (!response.ok) {
        console.error('Upload failed:', result);
        // Extract error message from backend response
        const errorMessage = result.error || result.message || 'Upload failed';
        throw new Error(errorMessage);
      }

      return result;
    } catch (error: any) {
      console.error('Upload error:', error);
      // If it's already our custom error, just throw it
      if (error.message) {
        throw error;
      }
      // Otherwise create a generic error
      throw new Error('Upload failed. Please try again.');
    }
  },

  getHistory: async (params?: { page?: number; limit?: number; status?: string; riskLevel?: string }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.riskLevel) queryParams.append('riskLevel', params.riskLevel);

    const response = await fetch(`${API_BASE_URL}/verify/history?${queryParams.toString()}`, {
      headers: getHeaders(),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to get history');

    return result;
  },

  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/verify/stats`, {
      headers: getHeaders(),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to get stats');

    return result;
  },

  getVerification: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/verify/${id}`, {
      headers: getHeaders(),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to get verification');

    return result;
  },

  deleteVerification: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/verify/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to delete verification');

    return result;
  },

  getReport: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/verify/${id}/report`, {
      headers: getHeaders(),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to get report');

    return result;
  },
};

export default {
  authAPI,
  verificationAPI,
};
