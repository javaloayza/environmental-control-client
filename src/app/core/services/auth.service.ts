/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '@core/services/api.service';
import { SecureStorageService } from '@core/services/secure-storage.service';
import type { User } from '@auth/models/user';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private api = inject(ApiService);
  private secureStorage = inject(SecureStorageService);
  private currentUser: User | null = null;

  async login(email: string, password: string): Promise<User> {
    const apiUrl = `auth/login`;
    const response = await firstValueFrom(
      this.api.postData<any>(apiUrl, { email, password })
    );

    await this.secureStorage.setItem(ACCESS_TOKEN_KEY, response.accessToken);
    await this.secureStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);

    this.currentUser = response.user as User;
    return this.currentUser;
  }

  async logout(): Promise<void> {
    const apiUrl = `auth/logout`;
    await firstValueFrom(this.api.postData(apiUrl, {}));

    await this.secureStorage.removeItem(ACCESS_TOKEN_KEY);
    await this.secureStorage.removeItem(REFRESH_TOKEN_KEY);

    this.currentUser = null;
  }

  async getAccessToken(): Promise<string | null> {
    return this.secureStorage.getItem<string>(ACCESS_TOKEN_KEY);
  }

  async getRefreshToken(): Promise<string | null> {
    return this.secureStorage.getItem<string>(REFRESH_TOKEN_KEY);
  }

  async refreshToken(): Promise<void> {
    const refreshToken = await this.getRefreshToken();
    if (!refreshToken) throw new Error('No refresh token found');

    const apiUrl = `auth/refresh`;
    const response = await firstValueFrom(
      this.api.postData<any>(apiUrl, { refreshToken })
    );

    await this.secureStorage.setItem(ACCESS_TOKEN_KEY, response.accessToken);
    await this.secureStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
  }

  async getCurrentUser(): Promise<User | null> {
    if (this.currentUser) return this.currentUser;

    const apiUrl = `auth/me`;
    try {
      const response = await firstValueFrom(this.api.getData<User>(apiUrl));
      this.currentUser = response;
      return this.currentUser;
    } catch {
      return null;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getAccessToken();
    return !!token;
  }
}
