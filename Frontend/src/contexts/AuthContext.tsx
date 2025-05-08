import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from '@/components/ui/sonner';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// Set up axios instance
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  verified: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  verificationEmail: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (firstname: string, lastname: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  verifyEmail: (verificationCode: string) => Promise<void>;
  resendVerification: () => Promise<void>;
  clearVerificationEmail: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [verificationEmail, setVerificationEmail] = useState<string | null>(null);

  // Add JWT expiry check
  useEffect(() => {
    const savedUser = localStorage.getItem('bookish_user');
    const token = localStorage.getItem('bookish_token');

    if (token) {
      try {
        const decodedToken = jwtDecode<{ exp: number }>(token);
        const isTokenExpired = decodedToken.exp * 1000 < Date.now();

        if (isTokenExpired) {
          logout(); // Logout if token is expired
        } else {
          // Set auth headers for axios requests
          console.log(token);
          
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Restore user if token is valid
          if (savedUser) {
            setUser(JSON.parse(savedUser));
          }
        }
      } catch (err) {
        console.error('Failed to decode token:', err);
        logout(); // Logout if token decoding fails
      }
    }

    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });

      const { token, user } = response.data;

      localStorage.setItem('bookish_token', token);
      localStorage.setItem('bookish_user', JSON.stringify(user));

      // Set axios headers with token
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setUser(user);
      toast.success('Login successful!');
      return true;
    } catch (error: any) {
      console.error('Login failed:', error);
      toast.error(error.response?.data?.error || 'Login failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (firstname: string, lastname: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      await axios.post(`${API_URL}/auth/signup`, { firstname, lastname, email, password });
      setVerificationEmail(email);
      toast.success('Check your email for a verification code.');
    } catch (error: any) {
      console.error('Signup failed:', error);
      toast.error(error.response?.data?.error || 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async (verificationCode: string) => {
    setIsLoading(true);
    try {
      await axios.post(`${API_URL}/auth/verify`, {
        email: verificationEmail,
        code: verificationCode.trim(),
      });
      toast.success('Email verified successfully! Please log in.');
      setVerificationEmail(null);
    } catch (error) {
      console.error('Verification failed:', error);
      toast.error('Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
    console.log('Sending verification:', {
      email: verificationEmail,
      code: verificationCode
    });
  };

  const resendVerification = async () => {
    if (!verificationEmail) return;

    setIsLoading(true);
    try {
      await axios.post(`${API_URL}/auth/resend-verification`, { email: verificationEmail });
      toast.success('Verification email resent. Please check your inbox.');
    } catch (error) {
      console.error('Failed to resend verification:', error);
      toast.error('Failed to resend verification email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearVerificationEmail = () => {
    setVerificationEmail(null);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('bookish_user');
    localStorage.removeItem('bookish_token');
    delete axios.defaults.headers.common['Authorization'];
    delete axiosInstance.defaults.headers.common['Authorization']; // Ensure axios instance clears the token too
    toast.success('Logged out successfully!');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        verificationEmail,
        login,
        signup,
        logout,
        verifyEmail,
        resendVerification,
        clearVerificationEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
