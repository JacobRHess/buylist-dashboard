import { useState, useEffect } from 'react';
import { authService } from '../services';

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const user = await authService.login(username, password);
    setCurrentUser(user);
    return user;
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  return {
    currentUser,
    loading,
    login,
    logout,
    isAuthenticated: !!currentUser
  };
};