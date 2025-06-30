'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { User, UserRole } from '@/types';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Sample users for demonstration
const sampleUsers: User[] = [
  {
    id: '1',
    name: 'Ahmad Susanto',
    email: 'ahmad@harvestsun.com',
    role: 'konsultan_tani',
    region: 'Jawa Barat',
    phone: '+62812345671',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: '2',
    name: 'Siti Rahayu',
    email: 'siti@harvestsun.com',
    role: 'penyuluh',
    region: 'Jawa Tengah',
    phone: '+62812345672',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: '3',
    name: 'Budi Hartono',
    email: 'budi@harvestsun.com',
    role: 'admin',
    region: 'Jakarta',
    phone: '+62812345673',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  }
];

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem('app_user') || sessionStorage.getItem('app_user');
    const savedToken = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    } else {
      setUser(null);
      setToken(null);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    // Simulate API call
    const res = await fetch('http://localhost:4000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login gagal');
    setUser(data.user);
    setToken(data.access_token);
    localStorage.setItem('app_user', JSON.stringify(data.user));
    localStorage.setItem('token', data.access_token);
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('app_user');
    localStorage.removeItem('token');
    sessionStorage.removeItem('app_user');
    sessionStorage.removeItem('token');
    router.push('/login');
  };

  const switchRole = (role: UserRole) => {
    const newUser = sampleUsers.find(u => u.role === role);
    if (newUser) {
      setUser(newUser);
      localStorage.setItem('app_user', JSON.stringify(newUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, token, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}