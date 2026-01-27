// API Configuration
// Centralized API configuration for the application

const isDevelopment = import.meta.env.MODE === 'development';

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  TIMEOUT: 30000, // 30 seconds
  
  // Public endpoints (no authentication required)
  PUBLIC: {
    HEALTH: '/api/health',
    SERVICES: '/api/services',
    SERVICE_DETAIL: (slug: string) => `/api/services/${slug}`,
    PORTFOLIO: '/api/portfolio',
    PORTFOLIO_DETAIL: (slug: string) => `/api/portfolio/${slug}`,
    CONTACT: '/api/contact',
    QUOTE_REQUEST: '/api/quote-request',
    PROJECT_REQUEST: '/api/project-request',
  },
  
  // Admin authentication endpoints
  AUTH: {
    LOGIN: '/api/admin/login',
    VERIFY: '/api/admin/verify',
  },
  
  // Admin endpoints (require authentication)
  ADMIN: {
    STATS: '/api/admin/stats',
    CONTACTS: '/api/admin/contacts',
    CONTACT_STATUS: (id: string) => `/api/admin/contacts/${id}/status`,
    QUOTE_REQUESTS: '/api/admin/quote-requests',
    QUOTE_STATUS: (id: string) => `/api/admin/quote-requests/${id}/status`,
    PROJECT_REQUESTS: '/api/admin/project-requests',
    PROJECT_STATUS: (id: string) => `/api/admin/project-requests/${id}/status`,
    SEND_REPLY: '/api/admin/send-reply',
    SERVICES: '/api/admin/services',
    SERVICE_DETAIL: (id: string) => `/api/admin/services/${id}`,
    PORTFOLIO: '/api/admin/portfolio',
    PORTFOLIO_DETAIL: (id: string) => `/api/admin/portfolio/${id}`,
  },
};

// Auth token management
export const AUTH_TOKEN_KEY = 'scholarxafrica_auth_token';

export const getAuthToken = (): string | null => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

// Helper function to build full URLs
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function for file URLs
export const getFileUrl = (path: string): string => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${API_CONFIG.BASE_URL}${path}`;
};

// Helper function to get auth headers
export const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  return token ? { 
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  } : {
    'Content-Type': 'application/json'
  };
};

// API request wrapper with authentication
export const apiRequest = async (
  endpoint: string, 
  options: RequestInit = {}
): Promise<Response> => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    ...(options.headers || {}),
  };
  
  // Add auth token if available
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // Add Content-Type for JSON requests if not already set
  if (options.body && typeof options.body === 'string' && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }
  
  const response = await fetch(getApiUrl(endpoint), {
    ...options,
    headers,
  });
  
  // Handle authentication errors
  if (response.status === 401) {
    removeAuthToken();
    // Redirect to login if on admin page
    if (window.location.pathname.startsWith('/admin')) {
      window.location.href = '/admin';
    }
  }
  
  return response;
};

export default API_CONFIG;

