<<<<<<< HEAD
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
=======
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, logout as authLogout, loadUser } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user: currentUser, loading, isAuthenticated, error } = useSelector(state => state.auth);

  // Load user on mount if token exists
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token && !isAuthenticated && !loading) {
      dispatch(loadUser());
    }
  }, [dispatch, isAuthenticated, loading]);

  const login = async (username, password) => {
    const result = await dispatch(loginUser({ username, password }));
    if (result.type === 'auth/login/fulfilled') {
      return result.payload.employee;
    }
    throw new Error(result.payload || 'Login failed');
  };

  const logout = () => {
    dispatch(authLogout());
>>>>>>> 6e0dcc1 (Add real API integration and authentication system)
  };

  return {
    currentUser,
    loading,
    login,
    logout,
<<<<<<< HEAD
    isAuthenticated: !!currentUser
=======
    isAuthenticated,
    error
>>>>>>> 6e0dcc1 (Add real API integration and authentication system)
  };
};