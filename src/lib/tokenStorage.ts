// src/lib/tokenStorage.ts

const TOKEN_KEY = 'auth_token';
const IS_AUTHENTICATED_KEY = 'isAuthenticated';

export const tokenStorage = {
  // Check if running in browser
  isBrowser: (): boolean => {
    return typeof window !== 'undefined' && typeof document !== 'undefined';
  },

  // Get cookie value by name
  getCookie: (name: string): string | null => {
    if (!tokenStorage.isBrowser()) return null;
    
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  },

  // Set token in both cookie and localStorage for backward compatibility
  setToken: (token: string) => {
    if (tokenStorage.isBrowser()) {
      // Store in localStorage for backward compatibility
      localStorage.setItem(TOKEN_KEY, token);
      
      // Set a flag in localStorage to indicate user is authenticated
      localStorage.setItem(IS_AUTHENTICATED_KEY, 'true');
    }
  },

  // Get token - try cookie first, then localStorage
  getToken: (): string | null => {
    if (!tokenStorage.isBrowser()) return null;
    
    // First try to get from cookie (server-set)
    const cookieToken = tokenStorage.getCookie(TOKEN_KEY);
    if (cookieToken) {
      // Update localStorage for backward compatibility
      localStorage.setItem(TOKEN_KEY, cookieToken);
      return cookieToken;
    }
    
    // Fallback to localStorage
    return localStorage.getItem(TOKEN_KEY);
  },

  // Remove token from both cookie and localStorage
  removeToken: () => {
    if (tokenStorage.isBrowser()) {
      // Remove from localStorage
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(IS_AUTHENTICATED_KEY);
      
      // Clear the cookie by setting an expired date
      document.cookie = `${TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      document.cookie = `${IS_AUTHENTICATED_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    if (!tokenStorage.isBrowser()) return false;
    
    // Check cookie first
    const hasAuthCookie = tokenStorage.getCookie(IS_AUTHENTICATED_KEY) === 'true';
    // Then check localStorage for backward compatibility
    const hasLocalStorageToken = localStorage.getItem(TOKEN_KEY) !== null;
    
    return hasAuthCookie || hasLocalStorageToken;
  },
  
  // Alias for backward compatibility
  hasToken: (): boolean => {
    return tokenStorage.isAuthenticated();
  }
};