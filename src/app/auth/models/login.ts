/**
 * Modelo para las credenciales de login
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Modelo para la respuesta del login
 */
export interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
  };
  accessToken: string;
  refreshToken: string;
}

/**
 * Modelo para el payload del token JWE
 */
export interface JweTokenPayload {
  id: string;
  email: string;
  name: string;
  roles: string[];
  iat: number; // Issued at
  exp: number; // Expiration time
}
