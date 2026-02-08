import { Injectable } from '@angular/core';
import { CompactEncrypt, compactDecrypt } from 'jose';

/**
 * Servicio para manejar encriptación y desencriptación JWE
 * Utiliza la librería jose para operaciones criptográficas seguras
 */
@Injectable({
  providedIn: 'root'
})
export class JweService {
  private secretKey: string = 'my-secret-key-16'; // Debe ser exactamente 16 caracteres para A128GCM
  private algorithm = 'dir';
  private encryption = 'A128GCM';

  /**
   * Encripta datos en formato JWE
   * @param payload Datos a encriptar
   * @returns Token JWE encriptado
   */
  async encryptData(payload: Record<string, any>): Promise<string> {
    try {
      const secret = new TextEncoder().encode(this.secretKey);

      // Serializar payload a JSON y convertir a Uint8Array
      const payloadBytes = new TextEncoder().encode(JSON.stringify(payload));

      const jwe = await new CompactEncrypt(payloadBytes)
        .setProtectedHeader({
          alg: this.algorithm,
          enc: this.encryption
        })
        .encrypt(secret);

      return jwe.toString();
    } catch (error) {
      console.error('Error al encriptar datos:', error);
      throw new Error('Error al encriptar datos');
    }
  }

  /**
   * Desencripta un token JWE
   * @param token Token JWE a desencriptar
   * @returns Datos desencriptados
   */
  async decryptData(token: string): Promise<Record<string, any>> {
    try {
      const secret = new TextEncoder().encode(this.secretKey);

      const { plaintext } = await compactDecrypt(token, secret);

      // Convertir Uint8Array a string y parsear JSON
      const decoded = new TextDecoder().decode(plaintext);
      return JSON.parse(decoded) as Record<string, any>;
    } catch (error) {
      console.error('Error al desencriptar datos:', error);
      throw new Error('Error al desencriptar datos');
    }
  }

  /**
   * Valida si un token JWE es válido y no ha expirado
   * @param token Token a validar
   * @returns true si es válido, false si no
   */
  async isValidToken(token: string): Promise<boolean> {
    try {
      const payload = await this.decryptData(token);

      // Validar expiración
      if (payload['exp']) {
        const expirationTime = payload['exp'] as number;
        const currentTime = Math.floor(Date.now() / 1000);

        if (expirationTime < currentTime) {
          return false;
        }
      }

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Obtiene el tiempo de expiración de un token
   * @param token Token a analizar
   * @returns Tiempo de expiración en milisegundos desde epoch
   */
  async getTokenExpiration(token: string): Promise<number | null> {
    try {
      const payload = await this.decryptData(token);
      return payload['exp'] ? (payload['exp'] as number) * 1000 : null;
    } catch {
      return null;
    }
  }
}
