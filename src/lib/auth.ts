import api from './api';

export interface AuthData {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    created_at: string;
    updated_at: string;
  };
}

export const checkExistingAuth = (): AuthData | null => {
  try {
    const authData = localStorage.getItem('auth');
    if (!authData) {
      return null;
    }
    
    const parsed = JSON.parse(authData) as AuthData;
    
    // Basic validation
    if (!parsed.access_token || !parsed.user) {
      localStorage.removeItem('auth');
      return null;
    }
    
    return parsed;
  } catch (error) {
    console.error('Error parsing auth data:', error);
    localStorage.removeItem('auth');
    return null;
  }
};

export const validateToken = async (token: string): Promise<boolean> => {
  try {
    const response = await api.get('/auth/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.status === 200;
  } catch (error) {
    console.error('Token validation failed:', error);
    return false;
  }
};

export const clearAuth = (): void => {
  localStorage.removeItem('auth');
};

export const setAuth = (authData: AuthData): void => {
  localStorage.setItem('auth', JSON.stringify(authData));
}; 