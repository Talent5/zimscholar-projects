// Auth Configuration
// JWT-based authentication with backend validation

import { apiRequest, AUTH_TOKEN_KEY, getAuthToken, setAuthToken, removeAuthToken } from '../../../config/api.config';

export interface AuthUser {
  username: string;
  role: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: AuthUser;
}

export const AUTH_CONFIG = {
  SESSION_TIMEOUT: 86400000, // 24 hours (matches JWT expiry)
};

/**
 * Login with username and password
 */
export const login = async (username: string, password: string): Promise<LoginResponse> => {
  const response = await apiRequest('/api/admin/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Login failed');
  }

  const data: LoginResponse = await response.json();
  
  // Store token
  if (data.token) {
    setAuthToken(data.token);
  }
  
  return data;
};

/**
 * Verify current token
 */
export const verifyAuth = async (): Promise<boolean> => {
  const token = getAuthToken();
  
  if (!token) {
    return false;
  }

  try {
    const response = await apiRequest('/api/admin/verify', {
      method: 'GET',
    });

    return response.ok;
  } catch (error) {
    return false;
  }
};

/**
 * Logout and clear token
 */
export const logout = (): void => {
  removeAuthToken();
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

