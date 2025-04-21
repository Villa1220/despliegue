import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'doctor'; 
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // Verificar autenticación al cargar
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Local authentication logic
    if (email === 'admin@gmail.com' && password) {
      const adminUser: User = {
        id: 1,
        name: 'Admin User',
        email: email,
        role: 'admin',
      };
      localStorage.setItem('token', 'fake-jwt-token-admin');
      localStorage.setItem('user', JSON.stringify(adminUser));
      setUser(adminUser);
      navigate('/admin');
      return true;
    } else if (email === 'doctor@gmail.com' && password) {
      const doctorUser: User = {
        id: 2,
        name: 'Doctor User',
        email: email,
        role: 'doctor',
      };
      localStorage.setItem('token', 'fake-jwt-token-doctor');
      localStorage.setItem('user', JSON.stringify(doctorUser));
      setUser(doctorUser);
      navigate('/admin/appointments'); // Default route for doctors
      return true;
    } else {
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};
