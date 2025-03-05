
import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const navigate = useNavigate();

  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();
      if (response.ok) {
        setToken(result.token);
        localStorage.setItem('token', result.token);
        navigate('/home'); 
        return { success: true };
      } else {
        return { success: false, message: result.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login Error:', error);
      return { success: false, message: 'Something went wrong' };
    }
  };

  // Logout function
  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
    navigate('/signin'); 
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};