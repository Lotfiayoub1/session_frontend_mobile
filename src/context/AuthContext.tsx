import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { User, LoginRequest } from '../models';
import { AuthService } from '../services';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (request: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: () => boolean;
  isSuperAdmin: () => boolean;
  isStudent: () => boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AuthService.getCurrentUser()
      .then(setUser)
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (request: LoginRequest) => {
    const authUser = await AuthService.login(request);
    setUser(authUser.user);
  };

  const logout = async () => {
    await AuthService.logout();
    setUser(null);
  };

  const isAdmin = () => user?.role === 'admin' || user?.role === 'super-admin';
  const isSuperAdmin = () => user?.role === 'super-admin';
  const isStudent = () => user?.role === 'student';

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, logout, isAdmin, isSuperAdmin, isStudent }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
