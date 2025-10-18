const API_BASE_URL = window.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function to get token from localStorage
const getToken = () => {
  return localStorage.getItem('jwtToken');
};

// Helper function to set token in localStorage
const setToken = (token) => {
  localStorage.setItem('jwtToken', token);
};

// Helper function to remove token
const removeToken = () => {
  localStorage.removeItem('jwtToken');
};

// Generic fetch with auth headers
const authFetch = async (url, options = {}) => {
  const token = getToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // If token is expired or invalid, redirect to login
  if (response.status === 401) {
    removeToken();
    window.location.href = '/';
    throw new Error('Session expired. Please login again.');
  }

  return response;
};

class ApiService {
  // Auth endpoints
  static async login(username, password, campus) {
    try {
      const response = await authFetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        body: JSON.stringify({ username, password, campus }),
      });
      
      const result = await response.json();
      
      if (result.success && result.token) {
        setToken(result.token);
      }
      
      return result;
    } catch (error) {
      console.error('Login API error:', error);
      throw new Error('Unable to connect to server. Please check your connection.');
    }
  }

  static async verifyToken() {
    try {
      const response = await authFetch(`${API_BASE_URL}/auth/verify`);
      return await response.json();
    } catch (error) {
      console.error('Token verification error:', error);
      throw error;
    }
  }

  static logout() {
    removeToken();
    // You can also call the backend logout endpoint if needed
  }

  // Employee endpoints (updated with authFetch)
  static async getEmployees() {
    try {
      const response = await authFetch(`${API_BASE_URL}/employees`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Get employees error:', error);
      throw new Error('Failed to fetch employees');
    }
  }

  static async getEmployee(id) {
    try {
      const response = await authFetch(`${API_BASE_URL}/employees/${id}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Get employee error:', error);
      throw new Error('Failed to fetch employee');
    }
  }

  static async saveEmployee(employeeData) {
    try {
      const response = await authFetch(`${API_BASE_URL}/employees`, {
        method: 'POST',
        body: JSON.stringify(employeeData),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Save employee error:', error);
      throw new Error('Failed to save employee');
    }
  }

  // Update all other methods to use authFetch instead of fetch...
  // Repeat for all other API methods (updateAttendance, updateLeaves, etc.)
}

// Add token management to window object for debugging
window.getToken = getToken;
window.setToken = setToken;
window.removeToken = removeToken;

export { getToken, setToken, removeToken };
export default ApiService;