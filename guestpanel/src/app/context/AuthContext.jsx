"use client"
import { createContext, useContext, useState, useEffect } from 'react';
import { useClientSide } from '../hooks/useClientSide';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const isClient = useClientSide();

  // Load auth state from localStorage on mount (client-side only)
  useEffect(() => {
    if (!isClient) return;
    
    const savedAuth = localStorage.getItem('authState');
    if (savedAuth) {
      try {
        const { user: savedUser, token: savedToken } = JSON.parse(savedAuth);
        if (savedUser && savedToken) {
          setUser(savedUser);
          setToken(savedToken);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error loading auth state:', error);
        localStorage.removeItem('authState');
      }
    }
  }, [isClient]);

  // Save auth state to localStorage whenever it changes (client-side only)
  useEffect(() => {
    if (!isClient) return;
    
    if (user && token) {
      localStorage.setItem('authState', JSON.stringify({ user, token }));
    } else {
      localStorage.removeItem('authState');
    }
  }, [user, token, isClient]);

  const loginStart = (message = 'Signing in...') => {
    setLoading(true);
    setLoadingMessage(message);
    setLoadingProgress(0);
    setError(null);
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);
  };

  const loginSuccess = (result) => {
    setLoadingProgress(100);
    setTimeout(() => {
      setLoading(false);
      setLoadingMessage('');
      setLoadingProgress(0);
      setIsAuthenticated(true);
      setUser(result.user);
      setToken(result.user.token);
      setError(null);
    }, 500);
  };

  const loginFailure = (errorMessage) => {
    setLoading(false);
    setLoadingMessage('');
    setLoadingProgress(0);
    setError(errorMessage);
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
  };

  const signupStart = (message = 'Creating account...') => {
    setLoading(true);
    setLoadingMessage(message);
    setLoadingProgress(0);
    setError(null);
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 15;
      });
    }, 150);
  };

  const signupSuccess = (result) => {
    setLoadingProgress(100);
    setTimeout(() => {
      setLoading(false);
      setLoadingMessage('');
      setLoadingProgress(0);
      setIsAuthenticated(true);
      setUser(result.user);
      setToken(result.user.token);
      setError(null);
    }, 500);
  };

  const signupFailure = (errorMessage) => {
    setLoading(false);
    setLoadingMessage('');
    setLoadingProgress(0);
    setError(errorMessage);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setToken(null);
    setLoading(false);
    setLoadingMessage('');
    setLoadingProgress(0);
    setError(null);
    localStorage.removeItem('authState');
  };

  const clearError = () => {
    setError(null);
  };

  const updateUser = (updates) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const value = {
    user,
    isAuthenticated,
    token,
    loading,
    loadingMessage,
    loadingProgress,
    error,
    loginStart,
    loginSuccess,
    loginFailure,
    signupStart,
    signupSuccess,
    signupFailure,
    logout,
    clearError,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
