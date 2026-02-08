/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '@core/services/api.service';
import type { User } from '@auth/models/user';

const ENCRYPTED_TOKEN_KEY = 'encrypted_token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private api = inject(ApiService);
  private currentUser: User | null = null;

  async login(email: string, password: string): Promise<User> {
    const response = await firstValueFrom(
      this.api.postData<any>('api/v1/auth/login', { email, password })
    );

    // Guardar token en localStorage
    localStorage.setItem(ENCRYPTED_TOKEN_KEY, response.token);

    // Crear objeto usuario a partir de la respuesta
    this.currentUser = {
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

    return this.currentUser;
  }

  async logout(): Promise<void> {
    try {
      await firstValueFrom(this.api.postData('api/v1/auth/logout', {}));
    } catch (error) {
      console.warn('Error al desconectar del backend:', error);
    }

    // Limpiar token del storage
    localStorage.removeItem(ENCRYPTED_TOKEN_KEY);
    sessionStorage.removeItem(ENCRYPTED_TOKEN_KEY);
    this.currentUser = null;
  }


  isAuthenticated(): boolean {
    return !!localStorage.getItem(ENCRYPTED_TOKEN_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(ENCRYPTED_TOKEN_KEY);
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }
}
