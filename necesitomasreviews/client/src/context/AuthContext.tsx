import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, apiService } from '../services/api';
import axios from 'axios';
import { toast } from 'react-hot-toast';

// User roles enum
export enum UserRole {
  USER = 'USER',
  PROMOTER = 'PROMOTER',
  REGIONAL_ADMIN = 'REGIONAL_ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN'
}

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  region?: string;
  profilePicture?: string;
  isEmailVerified?: boolean;
  createdAt?: string;
}

// Auth context interface
interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  checkAuth: () => Promise<boolean>;
  clearError: () => void;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isRegionalAdmin: boolean;
  isPromoter: boolean;
  isUser: boolean;
}

// MODO DESARROLLO: Crear datos simulados para desarrollo
const MOCK_USERS = {
  user: {
    id: 'user-123',
    name: 'Usuario Normal',
    email: 'usuario@example.com',
    role: UserRole.USER,
    isEmailVerified: true,
    createdAt: new Date().toISOString()
  },
  admin: {
    id: 'admin-123',
    name: 'Administrador',
    email: 'admin@example.com',
    role: UserRole.ADMIN,
    isEmailVerified: true,
    createdAt: new Date().toISOString()
  },
  promoter: {
    id: 'promoter-123',
    name: 'Promotor',
    email: 'promotor@example.com',
    role: UserRole.PROMOTER,
    isEmailVerified: true,
    createdAt: new Date().toISOString()
  },
  superAdmin: {
    id: 'superadmin-123',
    name: 'Super Admin',
    email: 'superadmin@example.com',
    role: UserRole.SUPER_ADMIN,
    isEmailVerified: true,
    createdAt: new Date().toISOString()
  }
};

// Helper function para configurar el token de manera segura
const setAuthToken = (token: string | null) => {
  try {
    if (token) {
      // Usamos una forma alternativa de establecer los headers
      (api as any).defaults = (api as any).defaults || {};
      (api as any).defaults.headers = (api as any).defaults.headers || {};
      (api as any).defaults.headers.common = (api as any).defaults.headers.common || {};
      (api as any).defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // También configuramos axios global
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      // Eliminar token de manera segura
      if ((api as any).defaults?.headers?.common) {
        delete (api as any).defaults.headers.common['Authorization'];
      }
      delete axios.defaults.headers.common['Authorization'];
    }
  } catch (error) {
    console.error('Error al configurar el token:', error);
  }
};

// Create the context - IMPORTANTE: Exportar como named export
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider props interface
interface AuthProviderProps {
  children: ReactNode;
}

// Auth Provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Determinar si estamos en modo desarrollo
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Configurar interceptor para agregar token a las solicitudes
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
    }
  }, []);

  // Check if user is already logged in (on initial load)
  useEffect(() => {
    checkAuth();
  }, []);

  // Function to check authentication status
  const checkAuth = async (): Promise<boolean> => {
    try {
      // MODO DESARROLLO: Siempre usar datos simulados en desarrollo
      if (isDevelopment) {
        // Verificar si hay un token en localStorage
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (!token && !storedUser) {
          // No hay datos de usuario, terminar la verificación
          setLoading(false);
          return false;
        }

        if (storedUser) {
          // Usar el usuario guardado en localStorage
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setLoading(false);
          return true;
        } else {
          // Crear usuario simulado por defecto
          const mockUser = MOCK_USERS.user;
          const mockToken = 'dev-token-' + Date.now();

          // Guardar en localStorage
          localStorage.setItem('token', mockToken);
          localStorage.setItem('user', JSON.stringify(mockUser));

          // Configurar token y usuario
          setAuthToken(mockToken);
          setUser(mockUser);

          console.log('MODO DESARROLLO: Usuario simulado creado', mockUser);

          setLoading(false);
          return true;
        }
      }

      // MODO PRODUCCIÓN: Verificación normal con backend
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (!token) {
        setLoading(false);
        return false;
      }

      // Configurar token en el header
      setAuthToken(token);

      if (storedUser) {
        // Sí hay un usuario en localStorage, usarlo directamente
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        // Actualizar en segundo plano
        try {
          const response = await apiService.auth.getCurrentUser();
          const userData = response.data.data || response.data;

          // Convertir el formato si es necesario
          const formattedUser: User = {
            id: userData._id || userData.id,
            name: userData.name,
            email: userData.email,
            role: userData.role,
            region: userData.region,
            profilePicture: userData.profilePicture,
            isEmailVerified: userData.isEmailVerified,
            createdAt: userData.createdAt
          };

          setUser(formattedUser);
          localStorage.setItem('user', JSON.stringify(formattedUser));

        } catch (error) {
          console.log('Error actualizando datos del usuario:', error);
          // No cerramos sesión en caso de error aquí, solo seguimos con los datos del localStorage
        }

        setLoading(false);
        return true;
      } else {
        setLoading(false);
        return false;
      }
    } catch (err) {
      console.error('Authentication check failed', err);
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setUser(null);
      setLoading(false);
      return false;
    }
  };

  // Login function
  const login = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // MODO DESARROLLO: Simular login en desarrollo
      if (isDevelopment) {
        console.log('MODO DESARROLLO: Simulando login para', email);

        // Buscar un usuario mock que coincida con el email o usar el usuario por defecto
        let mockUser: User | null = null;

        if (email.includes('admin')) {
          mockUser = MOCK_USERS.admin;
        } else if (email.includes('promotor') || email.includes('promoter')) {
          mockUser = MOCK_USERS.promoter;
        } else if (email.includes('super')) {
          mockUser = MOCK_USERS.superAdmin;
        } else {
          mockUser = MOCK_USERS.user;
        }

        // Generar token simulado
        const mockToken = 'dev-token-' + Date.now();

        // Guardar en localStorage
        localStorage.setItem('token', mockToken);
        localStorage.setItem('user', JSON.stringify(mockUser));

        // Configurar token y usuario
        setAuthToken(mockToken);
        setUser(mockUser);

        // Redirigir según el rol
        redirectBasedOnRole(mockUser.role);

        toast.success('Login simulado exitoso!');
        setLoading(false);
        return;
      }

      // MODO PRODUCCIÓN: Login normal con backend
      const response = await apiService.auth.login(email, password);

      // El backend devuelve los datos en un formato específico, necesitamos extraerlos correctamente
      const responseData = response.data.data || response.data;
      const token = responseData.token;
      const refreshToken = responseData.refreshToken;

      // Formatear el usuario según nuestra interfaz
      const userData: User = {
        id: responseData._id || responseData.id,
        name: responseData.name,
        email: responseData.email,
        role: responseData.role,
        region: responseData.region,
        profilePicture: responseData.profilePicture,
        isEmailVerified: responseData.isEmailVerified,
        createdAt: responseData.createdAt
      };

      localStorage.setItem('token', token);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
      localStorage.setItem('user', JSON.stringify(userData));

      // Configurar token para futuras solicitudes
      setAuthToken(token);

      setUser(userData);

      // Redirect based on user role
      redirectBasedOnRole(userData.role);

      toast.success('Login successful!');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Login failed. Please try again.';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Resto del código...

  // Helper to redirect based on user role
  const redirectBasedOnRole = (role: UserRole): void => {
    switch (role) {
      case UserRole.SUPER_ADMIN:
      case UserRole.REGIONAL_ADMIN:
      case UserRole.ADMIN:
        navigate('/admin/dashboard');
        break;
      case UserRole.PROMOTER:
        navigate('/promoter/dashboard');
        break;
      case UserRole.USER:
      default:
        navigate('/dashboard');
        break;
    }
  };

  // Propiedades computadas para roles
  const isAdmin = user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN || user?.role === UserRole.REGIONAL_ADMIN;
  const isSuperAdmin = user?.role === UserRole.SUPER_ADMIN;
  const isRegionalAdmin = user?.role === UserRole.REGIONAL_ADMIN;
  const isPromoter = user?.role === UserRole.PROMOTER;
  const isUser = user?.role === UserRole.USER;

  // Context value
  const contextValue: AuthContextType = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register: async (userData) => {
      // MODO DESARROLLO: Simular registro
      if (isDevelopment) {
        console.log('MODO DESARROLLO: Simulando registro para', userData.email);
        await login(userData.email, userData.password);
        return;
      }

      // Implementación normal...
    },
    logout: () => {
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');

      // Remove token from headers
      setAuthToken(null);

      // Update state
      setUser(null);

      // Redirect to home page
      navigate('/');

      toast.success('Logged out successfully');
    },
    forgotPassword: async (email) => {
      if (isDevelopment) {
        toast.success('MODO DESARROLLO: Simulación de correo de recuperación enviado');
        return;
      }

      // Implementación normal...
    },
    resetPassword: async (token, password) => {
      if (isDevelopment) {
        toast.success('MODO DESARROLLO: Contraseña restablecida correctamente');
        navigate('/login');
        return;
      }

      // Implementación normal...
    },
    updateProfile: async (userData) => {
      if (isDevelopment) {
        // Actualizar perfil en desarrollo
        const updatedUser = {
          ...user,
          ...userData
        };
        setUser(updatedUser as User);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        toast.success('MODO DESARROLLO: Perfil actualizado correctamente');
        return;
      }

      // Implementación normal...
    },
    checkAuth,
    clearError: () => setError(null),
    isAdmin,
    isSuperAdmin,
    isRegionalAdmin,
    isPromoter,
    isUser
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};