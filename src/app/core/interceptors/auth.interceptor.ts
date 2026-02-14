import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AUTH_CONSTANTS } from '@core/constants/auth.constants';

/**
 * Interceptor funcional que añade el token JWE al header Authorization
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  // Obtener token del localStorage
  const token = localStorage.getItem(AUTH_CONSTANTS.ENCRYPTED_TOKEN_KEY);

  // Clonar la request y añadir el Authorization header si existe token
  let modifiedReq = req;
  if (token) {
    modifiedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(modifiedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Si es error 401, el token es inválido o expiró
      if (error.status === 401) {
        // Limpiar tokens
        localStorage.removeItem(AUTH_CONSTANTS.ENCRYPTED_TOKEN_KEY);
        sessionStorage.removeItem(AUTH_CONSTANTS.ENCRYPTED_TOKEN_KEY);
        // Redirigir a login
        router.navigate(['/auth/login'], {
          queryParams: { returnUrl: router.url },
        });
      }
      return throwError(() => error);
    })
  );
};
