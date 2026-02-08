import { Injectable, inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

const ENCRYPTED_TOKEN_KEY = 'encrypted_token';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {
  private router = inject(Router);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(this.addTokenToRequest(req)).pipe(
      catchError((error: HttpErrorResponse) => {
        // Si es error 401, el token es inválido o expiró
        if (error.status === 401) {
          console.warn('Token inválido o expirado (401)');
          this.handleUnauthorized();
        }
        return throwError(() => error);
      })
    );
  }

  /**
   * Añade el token JWE al header Authorization
   */
  private addTokenToRequest(req: HttpRequest<any>): HttpRequest<any> {
    // Obtener token del localStorage
    const token = localStorage.getItem(ENCRYPTED_TOKEN_KEY);
    
    if (token) {
      // Clone la request y añade el header Authorization
      return req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return req;
  }

  /**
   * Maneja errores 401 (Unauthorized)
   */
  private handleUnauthorized(): void {
    // Limpiar tokens
    localStorage.removeItem(ENCRYPTED_TOKEN_KEY);
    sessionStorage.removeItem(ENCRYPTED_TOKEN_KEY);

    // Redirigir a login
    this.router.navigate(['/auth/login'], {
      queryParams: { returnUrl: this.router.url },
    });
  }
}
