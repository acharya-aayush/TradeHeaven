import axios from 'axios';

const API_URL = 'http://localhost:3001/auth';

// Define types
export interface User {
  id: string;
  username: string;
  email: string;
  full_name?: string;
  phone_number?: string;
  date_of_birth?: string;
  country?: string;
  created_at: string;
  last_login?: string;
}

export interface AuthResponse {
  success?: boolean;
  message?: string;
  token?: string;
  user?: User;
  error?: string;
}

// Login user
export const login = async (username: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_URL}/login`, { username, password }, { 
      timeout: 3000 // Reduced to 3 second timeout for faster fallback to demo mode
    });
    return response.data;
  } catch (error: any) {
    console.error('Login error:', error);
    
    if (error.code === 'ECONNABORTED') {
      return { 
        error: 'Request timed out. Server may be unavailable.',
        success: false
      };
    }
    
    if (error.code === 'ERR_NETWORK' || !error.response) {
      return { 
        error: 'Cannot connect to server. Please ensure the server is running or try again later.',
        success: false 
      };
    }
    
    if (error.response && error.response.data) {
      return { error: error.response.data.error || 'Login failed' };
    }
    
    return { error: 'An unexpected error occurred. Please try again.' };
  }
};

// Register user
export interface RegisterParams {
  username: string;
  email: string;
  password: string;
  fullName?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  country?: string;
}

export const register = async (params: RegisterParams): Promise<AuthResponse> => {
  try {
    // Map frontend field names to backend expected names
    const backendParams = {
      username: params.username,
      email: params.email,
      password: params.password,
      fullName: params.fullName,
      phoneNumber: params.phoneNumber,
      dateOfBirth: params.dateOfBirth,
      country: params.country
    };
    
    const response = await axios.post(`${API_URL}/register`, backendParams, {
      timeout: 3000 // Reduced timeout for faster fallback
    });
    return response.data;
  } catch (error: any) {
    console.error('Registration error:', error);
    
    // For development purposes: create a mock successful registration
    if (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK' || !error.response) {
      console.log('Server connection failed, returning mock registration response');
      // Create a mock user with the provided details
      const mockUser = {
        id: `user-${Date.now()}`,
        username: params.username,
        email: params.email,
        full_name: params.fullName || 'Demo User',
        created_at: new Date().toISOString()
      };
      
      // Create a mock token
      const mockToken = `demo-token-${Date.now()}`;
      
      // Return a successful response with the mock data
      return {
        success: true,
        message: 'Registration successful in demo mode!',
        token: mockToken,
        user: mockUser
      };
    }
    
    if (error.code === 'ECONNABORTED') {
      return { 
        error: 'Request timed out. Server may be unavailable.',
        success: false
      };
    }
    
    if (error.code === 'ERR_NETWORK' || !error.response) {
      return { 
        error: 'Cannot connect to server. Please ensure the server is running or try again later.',
        success: false 
      };
    }
    
    if (error.response && error.response.data) {
      return { error: error.response.data.error || 'Registration failed' };
    }
    
    return { error: 'An unexpected error occurred. Please try again.' };
  }
};

// Get current user
export const getCurrentUser = async (token: string): Promise<AuthResponse> => {
  try {
    const response = await axios.get(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 3000 // Reduced timeout
    });
    return { user: response.data };
  } catch (error: any) {
    console.error('Get user error:', error);
    
    if (error.code === 'ECONNABORTED') {
      return { 
        error: 'Request timed out. Server may be unavailable.',
        success: false
      };
    }
    
    if (error.code === 'ERR_NETWORK' || !error.response) {
      return { 
        error: 'Cannot connect to server. Please ensure the server is running or try again later.',
        success: false 
      };
    }
    
    if (error.response && error.response.data) {
      return { error: error.response.data.error || 'Failed to get user data' };
    }
    
    return { error: 'An unexpected error occurred. Please try again.' };
  }
};

// Update user profile
export const updateUserProfile = async (token: string, userData: Partial<User>): Promise<AuthResponse> => {
  try {
    const response = await axios.put(`${API_URL}/profile`, userData, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 3000 // Reduced timeout
    });
    return response.data;
  } catch (error: any) {
    console.error('Update profile error:', error);
    
    if (error.code === 'ECONNABORTED') {
      return { 
        error: 'Request timed out. Server may be unavailable.',
        success: false
      };
    }
    
    if (error.code === 'ERR_NETWORK' || !error.response) {
      return { 
        error: 'Cannot connect to server. Please ensure the server is running or try again later.',
        success: false 
      };
    }
    
    if (error.response && error.response.data) {
      return { error: error.response.data.error || 'Failed to update profile' };
    }
    
    return { error: 'An unexpected error occurred. Please try again.' };
  }
};

// Save token to local storage
export const setToken = (token: string) => {
  localStorage.setItem('tradeheaven_token', token);
};

// Get token from local storage
export const getToken = (): string | null => {
  return localStorage.getItem('tradeheaven_token');
};

// Remove token from local storage
export const removeToken = () => {
  localStorage.removeItem('tradeheaven_token');
};

// Save user to local storage
export const setUser = (user: User) => {
  localStorage.setItem('tradeheaven_user', JSON.stringify(user));
};

// Get user from local storage
export const getUser = (): User | null => {
  const userJson = localStorage.getItem('tradeheaven_user');
  if (userJson) {
    try {
      return JSON.parse(userJson);
    } catch (e) {
      return null;
    }
  }
  return null;
};

// Remove user from local storage
export const removeUser = () => {
  localStorage.removeItem('tradeheaven_user');
};

// Logout user (clear local storage)
export const logout = () => {
  removeToken();
  removeUser();
}; 