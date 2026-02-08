import { Injectable, inject } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

/**
 * Guard que valida si el usuario está autenticado
 */
@Injectable({
  providedIn: 'root'
})
export class JweAuthGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    console.log('JweAuthGuard: Checking access to:', state.url);
    try {
      // Verificar si el usuario está autenticado (tiene token)
      const isAuthenticated = await this.authService.isAuthenticated();
      console.log('JweAuthGuard: isAuthenticated =', isAuthenticated);

      if (!isAuthenticated) {
        // Redirigir al login si no está autenticado
        console.log('JweAuthGuard: Not authenticated, redirecting to login');
        this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
        return false;
      }

      // Si tiene token, permitir acceso
      // El backend validará el token en cada request (interceptor lo enviará)
      console.log('JweAuthGuard: Access granted');
      return true;
    } catch (error) {
      console.error('Error en JweAuthGuard:', error);
      this.router.navigate(['/auth/login']);
      return false;
    }
  }
}
