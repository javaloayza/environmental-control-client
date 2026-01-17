import { Injectable, inject } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, from, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '@core/services';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private auth = inject(AuthService);
  private isRefreshing = false;

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return from(this.addAuthHeader(req)).pipe(
      switchMap(authReq => next.handle(authReq)),
      catchError(err => this.handleError(err, req, next))
    );
  }

  private async addAuthHeader(req: HttpRequest<unknown>): Promise<HttpRequest<unknown>> {
    const token = await this.auth.getAccessToken();
    if (!token) return req;

    return req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  private handleError(
    error: any,
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (error instanceof HttpErrorResponse && error.status === 401 && !this.isRefreshing) {
      this.isRefreshing = true;
      return from(this.auth.refreshToken()).pipe(
        switchMap(() => from(this.addAuthHeader(req)).pipe(switchMap(authReq => next.handle(authReq)))),
        catchError(refreshErr => {
          this.isRefreshing = false;
          this.auth.logout();
          return throwError(() => refreshErr);
        }),
        switchMap(res => {
          this.isRefreshing = false;
          return [res];
        })
      );
    }

    return throwError(() => error);
  }
}
