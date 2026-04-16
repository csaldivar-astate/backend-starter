import { api } from './api';

export interface User {
  id: string;
  email: string;
  displayName: string;
}

class AuthStore {
  user = $state<User | null>(null);
  loading = $state<boolean>(true);

  async refresh(): Promise<void> {
    this.loading = true;
    try {
      this.user = await api.get<User>('/me');
    } catch {
      this.user = null;
    } finally {
      this.loading = false;
    }
  }

  setUser(user: User | null): void {
    this.user = user;
  }

  get isLoggedIn(): boolean {
    return this.user !== null;
  }
}

export const auth = new AuthStore();
