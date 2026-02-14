/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '@core/services/api.service';
import { NotificationService } from '@core/services/notification.service';
import type { User } from '@auth/models/user';
import { AUTH_CONSTANTS } from '@core/constants/auth.constants';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private api = inject(ApiService);
  private notificationService = inject(NotificationService);

  currentUser = signal<User | null>(null);

  async login(email: string, password: string): Promise<User> {
    try {
      const response = await firstValueFrom(
        this.api.postData<any>('auth/login', { email, password })
      );

      // Guardar token en localStorage
      localStorage.setItem(AUTH_CONSTANTS.ENCRYPTED_TOKEN_KEY, response.token);

      // Crear objeto usuario a partir de la respuesta
      const user: User = {
        id: 1,
        username: response.email?.split('@')[0] || 'user',
        email: response.email || '',
        firstName: 'Usuario',
        lastName: '',
        role: 'user',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      this.currentUser.set(user);
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await firstValueFrom(this.api.postData('api/v1/auth/logout', {}));
    } catch (error) {
      console.warn('Error al desconectar del backend:', error);
    }

    // Limpiar token del storage
    localStorage.removeItem(AUTH_CONSTANTS.ENCRYPTED_TOKEN_KEY);
    sessionStorage.removeItem(AUTH_CONSTANTS.ENCRYPTED_TOKEN_KEY);
    this.currentUser.set(null);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(AUTH_CONSTANTS.ENCRYPTED_TOKEN_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(AUTH_CONSTANTS.ENCRYPTED_TOKEN_KEY);
  }

  getCurrentUser(): User | null {
    return this.currentUser();
  }
}
