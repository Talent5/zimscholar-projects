// Admin API utilities with authentication
import { apiRequest } from '../../../config/api.config';

// Re-export apiRequest for use in other components
export { apiRequest };

/**
 * Fetch admin dashboard statistics
 */
export const fetchStats = async () => {
  const response = await apiRequest('/api/admin/stats', {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch statistics');
  }

  return response.json();
};

/**
 * Fetch all contacts
 */
export const fetchContacts = async () => {
  const response = await apiRequest('/api/admin/contacts', {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch contacts');
  }

  return response.json();
};

/**
 * Update contact status
 */
export const updateContactStatus = async (id: string, status: string) => {
  const response = await apiRequest(`/api/admin/contacts/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error('Failed to update contact status');
  }

  return response.json();
};

/**
 * Fetch all quote requests
 */
export const fetchQuoteRequests = async () => {
  const response = await apiRequest('/api/admin/quote-requests', {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch quote requests');
  }

  return response.json();
};

/**
 * Update quote request status
 */
export const updateQuoteStatus = async (id: string, status: string) => {
  const response = await apiRequest(`/api/admin/quote-requests/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error('Failed to update quote status');
  }

  return response.json();
};

/**
 * Fetch all project requests
 */
export const fetchProjectRequests = async () => {
  const response = await apiRequest('/api/admin/project-requests', {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch project requests');
  }

  return response.json();
};

/**
 * Update project request status
 */
export const updateProjectStatus = async (id: string, status: string) => {
  const response = await apiRequest(`/api/admin/project-requests/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error('Failed to update project status');
  }

  return response.json();
};

/**
 * Send admin reply
 */
export const sendReply = async (formData: FormData) => {
  const response = await apiRequest('/api/admin/send-reply', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to send reply');
  }

  return response.json();
};

/**
 * Fetch all services (admin view)
 */
export const fetchAdminServices = async () => {
  const response = await apiRequest('/api/admin/services', {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch services');
  }

  return response.json();
};

/**
 * Create new service
 */
export const createService = async (serviceData: any) => {
  const response = await apiRequest('/api/admin/services', {
    method: 'POST',
    body: JSON.stringify(serviceData),
  });

  if (!response.ok) {
    throw new Error('Failed to create service');
  }

  return response.json();
};

/**
 * Update service
 */
export const updateService = async (id: string, serviceData: any) => {
  const response = await apiRequest(`/api/admin/services/${id}`, {
    method: 'PUT',
    body: JSON.stringify(serviceData),
  });

  if (!response.ok) {
    throw new Error('Failed to update service');
  }

  return response.json();
};

/**
 * Patch service (partial update)
 */
export const patchService = async (id: string, partialData: any) => {
  const response = await apiRequest(`/api/admin/services/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(partialData),
  });

  if (!response.ok) {
    throw new Error('Failed to patch service');
  }

  return response.json();
};

/**
 * Delete service
 */
export const deleteService = async (id: string) => {
  const response = await apiRequest(`/api/admin/services/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete service');
  }

  return response.json();
};

/**
 * Fetch all portfolio projects (admin view)
 */
export const fetchAdminPortfolio = async () => {
  const response = await apiRequest('/api/admin/portfolio', {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch portfolio');
  }

  return response.json();
};

/**
 * Create new portfolio project
 */
export const createPortfolioProject = async (formData: FormData) => {
  const response = await apiRequest('/api/admin/portfolio', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to create portfolio project');
  }

  return response.json();
};

/**
 * Update portfolio project
 */
export const updatePortfolioProject = async (id: string, formData: FormData) => {
  const response = await apiRequest(`/api/admin/portfolio/${id}`, {
    method: 'PUT',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to update portfolio project');
  }

  return response.json();
};

/**
 * Patch portfolio project (partial update)
 */
export const patchPortfolioProject = async (id: string, partialData: any) => {
  const response = await apiRequest(`/api/admin/portfolio/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(partialData),
  });

  if (!response.ok) {
    throw new Error('Failed to patch portfolio project');
  }

  return response.json();
};

/**
 * Delete portfolio project
 */
export const deletePortfolioProject = async (id: string) => {
  const response = await apiRequest(`/api/admin/portfolio/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete portfolio project');
  }

  return response.json();
};
// ==================== PRICING MANAGEMENT ====================

/**
 * Fetch all pricing packages (admin)
 */
export const fetchPricingPackages = async () => {
  const response = await apiRequest('/api/admin/pricing', {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch pricing packages');
  }

  return response.json();
};

/**
 * Delete pricing package
 */
export const deletePricingPackage = async (id: string) => {
  const response = await apiRequest(`/api/admin/pricing/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete pricing package');
  }

  return response.json();
};

/**
 * Patch pricing package (partial update)
 */
export const patchPricingPackage = async (id: string, data: any) => {
  const response = await apiRequest(`/api/admin/pricing/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to update pricing package');
  }

  return response.json();
};