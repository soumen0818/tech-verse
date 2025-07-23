import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useToast } from './use-toast';

interface User {
  id: string;
  username: string;
  email: string;
  display_name: string;
  avatar_url?: string;
  role: 'admin' | 'moderator' | 'user';
  bio?: string;
  location?: string;
  website_url?: string;
  twitter_handle?: string;
  github_handle?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, metadata: any) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<{ error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Get token from localStorage
  const getToken = () => localStorage.getItem('auth_token');

  // Set token to localStorage
  const setToken = (token: string) => localStorage.setItem('auth_token', token);

  // Remove token from localStorage
  const removeToken = () => localStorage.removeItem('auth_token');

  // Check if user is authenticated
  const checkAuth = async () => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        // Token is invalid, remove it
        removeToken();
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      removeToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setToken(data.token);
        setUser(data.user);
        toast({
          title: "Welcome back!",
          description: "You have been signed in successfully.",
        });
        return {};
      } else {
        toast({
          title: "Sign in failed",
          description: data.message || "Invalid credentials",
          variant: "destructive",
        });
        return { error: data.message };
      }
    } catch (error) {
      console.error('Sign in error:', error);
      const errorMessage = 'Network error. Please try again.';
      toast({
        title: "Sign in failed",
        description: errorMessage,
        variant: "destructive",
      });
      return { error: errorMessage };
    }
  };

  // Sign up function
  const signUp = async (email: string, password: string, metadata: any) => {
    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          username: metadata.username,
          displayName: metadata.displayName,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setToken(data.token);
        setUser(data.user);
        toast({
          title: "Welcome to TechVerse!",
          description: "Your account has been created successfully.",
        });
        return {};
      } else {
        toast({
          title: "Sign up failed",
          description: data.message || "Failed to create account",
          variant: "destructive",
        });
        return { error: data.message };
      }
    } catch (error) {
      console.error('Sign up error:', error);
      const errorMessage = 'Network error. Please try again.';
      toast({
        title: "Sign up failed",
        description: errorMessage,
        variant: "destructive",
      });
      return { error: errorMessage };
    }
  };

  // Sign out function
  const signOut = async () => {
    removeToken();
    setUser(null);
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
  };

  // Update profile function
  const updateProfile = async (updates: Partial<User>) => {
    const token = getToken();
    if (!token) {
      return { error: 'Not authenticated' };
    }

    try {
      const response = await fetch(`${API_BASE}/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully.",
        });
        return {};
      } else {
        toast({
          title: "Update failed",
          description: data.message || "Failed to update profile",
          variant: "destructive",
        });
        return { error: data.message };
      }
    } catch (error) {
      console.error('Profile update error:', error);
      const errorMessage = 'Network error. Please try again.';
      toast({
        title: "Update failed",
        description: errorMessage,
        variant: "destructive",
      });
      return { error: errorMessage };
    }
  };

  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}