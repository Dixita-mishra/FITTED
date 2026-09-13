import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { MOCK_USER } from '../data/mockData';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('fitted_user');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.name === 'Alex Vance' || !parsed.name) {
        return { ...parsed, name: 'Dixita Mishra', email: 'dixita.mishra@fitted.ai' };
      }
      return parsed;
    }
    return MOCK_USER;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('fitted_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('fitted_user');
    }
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.auth.login(email, password);
      if (res.user) {
        setUser(res.user);
        setIsAuthenticated(true);
      }
      return res;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const res = await api.auth.register(name, email, password);
      if (res.user) {
        setUser(res.user);
        setIsAuthenticated(true);
      }
      return res;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('fitted_user');
  };

  const updateUserProfile = (updatedFields) => {
    setUser(prev => ({ ...prev, ...updatedFields }));
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, register, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
