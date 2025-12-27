/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { openDB, type IDBPDatabase } from 'idb';

const DB_NAME = 'secure-storage-db';
const STORE_NAME = 'secure-store';
const ENCRYPTION_KEY = 'secure-key-256';

@Injectable({
  providedIn: 'root',
})
export class SecureStorageService {
  private dbPromise: Promise<IDBPDatabase> | null = null;
  private cryptoKey: CryptoKey | null = null;

  private async getDB(): Promise<IDBPDatabase> {
    if (!this.dbPromise) {
      this.dbPromise = openDB(DB_NAME, 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME);
          }
        },
      });
    }
    return this.dbPromise;
  }

  private async getKey(): Promise<CryptoKey> {
    if (this.cryptoKey) return this.cryptoKey;

    const storedKey = await Preferences.get({ key: ENCRYPTION_KEY });
    if (storedKey.value) {
      const rawKey = Uint8Array.from(atob(storedKey.value), c => c.charCodeAt(0));
      this.cryptoKey = await crypto.subtle.importKey(
        'raw',
        rawKey,
        { name: 'AES-GCM' },
        false,
        ['encrypt', 'decrypt']
      );
    } else {
      const key = await crypto.subtle.generateKey(
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
      );
      const exported = await crypto.subtle.exportKey('raw', key);
      const base64Key = btoa(String.fromCharCode(...new Uint8Array(exported)));
      await Preferences.set({ key: ENCRYPTION_KEY, value: base64Key });
      this.cryptoKey = key;
    }

    return this.cryptoKey;
  }

  private isNativePlatform(): boolean {
    return !!(globalThis as any).Capacitor?.isNativePlatform?.();
  }

  async setItem(key: string, value: any): Promise<void> {
    if (this.isNativePlatform()) {
      await Preferences.set({ key, value: JSON.stringify(value) });
    } else {
      const db = await this.getDB();
      const encValue = await this.encryptData(value);
      await db.put(STORE_NAME, encValue, key);
    }
  }

  async getItem<T>(key: string): Promise<T | null> {
    if (this.isNativePlatform()) {
      const res = await Preferences.get({ key });
      return res.value ? JSON.parse(res.value) : null;
    } else {
      const db = await this.getDB();
      const encValue = await db.get(STORE_NAME, key);
      if (!encValue) return null;
      return this.decryptData(encValue);
    }
  }

  async removeItem(key: string): Promise<void> {
    if (this.isNativePlatform()) {
      await Preferences.remove({ key });
    } else {
      const db = await this.getDB();
      await db.delete(STORE_NAME, key);
    }
  }

  async clear(): Promise<void> {
    if (this.isNativePlatform()) {
      await Preferences.clear();
    } else {
      const db = await this.getDB();
      await db.clear(STORE_NAME);
    }
  }

  private async encryptData(data: any): Promise<string> {
    const key = await this.getKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(JSON.stringify(data));
    const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded);
    const combined = new Uint8Array(iv.length + ciphertext.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(ciphertext), iv.length);
    return btoa(String.fromCharCode(...combined));
  }

  private async decryptData(encrypted: string): Promise<any> {
    const key = await this.getKey();
    const combined = Uint8Array.from(atob(encrypted), c => c.charCodeAt(0));
    const iv = combined.slice(0, 12);
    const data = combined.slice(12);
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data);
    const decoded = new TextDecoder().decode(decrypted);
    return JSON.parse(decoded);
  }
}
