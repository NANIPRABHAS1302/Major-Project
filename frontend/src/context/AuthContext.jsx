import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { success, error: showError } = useToast();

  const setAuthData = useCallback((token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  }, []);

  const clearAuthData = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await authService.getMe();
      setUser(response.user);
    } catch {
      clearAuthData();
    } finally {
      setLoading(false);
    }
  }, [clearAuthData]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const register = async (data) => {
    try {
      const response = await authService.register(data);
      setAuthData(response.token, response.user);
      success('Registration successful!');
      return response;
    } catch (err) {
      showError(err.message);
      throw err;
    }
  };

  const login = async (data) => {
    try {
      const response = await authService.login(data);
      setAuthData(response.token, response.user);
      success('Welcome back!');
      return response;
    } catch (err) {
      showError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // Continue logout even if API fails
    } finally {
      clearAuthData();
      success('Logged out successfully');
    }
  };

  const updateProfile = async (data) => {
    try {
      const response = await authService.updateProfile(data);
      setUser(response.user);
      localStorage.setItem('user', JSON.stringify(response.user));
      success('Profile updated successfully');
      return response;
    } catch (err) {
      showError(err.message);
      throw err;
    }
  };

  const changePassword = async (data) => {
    try {
      const response = await authService.changePassword(data);
      setAuthData(response.token, response.user);
      success('Password changed successfully');
      return response;
    } catch (err) {
      showError(err.message);
      throw err;
    }
  };

  const forgotPassword = async (email) => {
    try {
      const response = await authService.forgotPassword(email);
      success(response.message);
      return response;
    } catch (err) {
      showError(err.message);
      throw err;
    }
  };

  const resetPassword = async (resetToken, password) => {
    try {
      const response = await authService.resetPassword(resetToken, password);
      setAuthData(response.token, response.user);
      success('Password reset successful!');
      return response;
    } catch (err) {
      showError(err.message);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        register,
        login,
        logout,
        updateProfile,
        changePassword,
        forgotPassword,
        resetPassword,
        loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;
