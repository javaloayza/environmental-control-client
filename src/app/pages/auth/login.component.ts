import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { NotificationService } from '@core/services';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h2>Login</h2>
        <p class="subtitle">Demo con Mock Data y Encriptación JWE</p>

        <form (ngSubmit)="login()">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              id="email"
              type="email"
              [(ngModel)]="email"
              name="email"
              placeholder="test@example.com"
              [disabled]="loading"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              id="password"
              type="password"
              [(ngModel)]="password"
              name="password"
              placeholder="123456"
              [disabled]="loading"
              class="form-input"
            />
          </div>

          <button type="submit" [disabled]="loading" class="btn-submit">
            {{ loading ? 'Iniciando sesión...' : 'Entrar' }}
          </button>

          <p *ngIf="error" class="error-message">{{ error }}</p>
        </form>

        <div class="mock-credentials">
          <h4>Credenciales de Prueba:</h4>
          <p><strong>Email:</strong> test@example.com</p>
          <p><strong>Password:</strong> 123456</p>
        </div>

        <div class="info-box">
          <h4>ℹ️ Esta demostración:</h4>
          <ul>
            <li>Usa datos mock (sin backend real)</li>
            <li>Encripta los datos con JWE</li>
            <li>Almacena el token en localStorage</li>
            <li>Valida la expiración del token</li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 1rem;
    }

    .login-card {
      background: white;
      border-radius: 8px;
      padding: 2rem;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      width: 100%;
      max-width: 400px;
    }

    h2 {
      margin: 0 0 0.5rem 0;
      color: #333;
      text-align: center;
    }

    .subtitle {
      margin: 0 0 2rem 0;
      text-align: center;
      color: #666;
      font-size: 0.9rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #333;
    }

    .form-input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      box-sizing: border-box;
      transition: border-color 0.3s;
    }

    .form-input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .btn-submit {
      width: 100%;
      padding: 0.75rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .btn-submit:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 5px 20px rgba(102, 126, 234, 0.3);
    }

    .btn-submit:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .error-message {
      margin-top: 1rem;
      padding: 0.75rem;
      background-color: #fee;
      color: #c33;
      border-radius: 4px;
      font-size: 0.9rem;
    }

    .mock-credentials {
      margin-top: 2rem;
      padding: 1rem;
      background-color: #f5f5f5;
      border-radius: 4px;
      border-left: 4px solid #667eea;
    }

    .mock-credentials h4 {
      margin: 0 0 0.75rem 0;
      color: #333;
    }

    .mock-credentials p {
      margin: 0.25rem 0;
      font-size: 0.9rem;
      color: #666;
      font-family: monospace;
    }

    .info-box {
      margin-top: 1.5rem;
      padding: 1rem;
      background-color: #e8f4f8;
      border-radius: 4px;
      border-left: 4px solid #0288d1;
    }

    .info-box h4 {
      margin: 0 0 0.75rem 0;
      color: #0288d1;
    }

    .info-box ul {
      margin: 0;
      padding-left: 1.25rem;
    }

    .info-box li {
      margin: 0.25rem 0;
      font-size: 0.9rem;
      color: #555;
    }
  `]
})
export class LoginComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  email = '';
  password = '';
  loading = false;
  error = '';

  ngOnInit() {
    // Prellenar con credenciales mock para facilitar las pruebas
    const mockCreds = this.authService.getMockCredentials();
    this.email = mockCreds.email;
    this.password = mockCreds.password;
  }

  async login() {
    this.error = '';
    this.loading = true;

    console.log('Login attempt:', this.email, this.password);

    try {
      // Usar mockLoginWithJWE para la demostración
      await this.authService.mockLoginWithJWE(this.email, this.password);

      console.log('Login exitoso');
      this.notificationService.success('Sesión iniciada correctamente');
      this.router.navigate(['/dashboard']);
    } catch (err: unknown) {
      console.error('Login error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al iniciar sesión';
      this.error = errorMessage;
      this.notificationService.error(this.error);
    } finally {
      this.loading = false;
    }
  }
}

export default LoginComponent;
