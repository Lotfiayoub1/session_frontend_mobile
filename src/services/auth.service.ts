import { User, AuthUser, LoginRequest } from '../models';
import { USERS } from '../data/mock-data';
import { StorageService, KEYS } from './storage.service';

export interface AuthServiceInterface {
  login(request: LoginRequest): Promise<AuthUser>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
}

const generateToken = (userId: number): string =>
  `mock-token-${userId}-${Date.now()}`;

export const AuthService: AuthServiceInterface = {
  async login({ email, password }): Promise<AuthUser> {
    const user = USERS.find(
      (u) => u.email === email && u.password === password
    );
    if (!user) throw new Error('Invalid email or password');
    const authUser: AuthUser = { user, token: generateToken(user.id) };
    await StorageService.set(KEYS.AUTH_USER, authUser);
    return authUser;
  },

  async logout(): Promise<void> {
    await StorageService.remove(KEYS.AUTH_USER);
  },

  async getCurrentUser(): Promise<User | null> {
    const authUser = await StorageService.get<AuthUser>(KEYS.AUTH_USER);
    return authUser?.user ?? null;
  },
};
