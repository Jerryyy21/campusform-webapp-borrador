import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'teacher' | 'admin';
}

export interface LoginPayload {
  email: string;
  password: string;
  role?: 'student' | 'teacher' | 'admin';
}

export interface AuthResponse {
  message: string;
  token: string;
  refresh: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: 'student' | 'teacher' | 'admin';
  };
  redirect: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api'; // Ajusta según tu configuración

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  register(payload: RegisterPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register/`, payload);
  }

  login(credentials: LoginPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login/`, credentials).pipe(
      tap((response: AuthResponse) => {
        if (response.user && response.token) {
          // Guardar token y datos del usuario
          localStorage.setItem('token', response.token);
          localStorage.setItem('refresh', response.refresh);
          localStorage.setItem('user', JSON.stringify(response.user));
          
          // Mostrar información de depuración
          console.log('Usuario autenticado:', response.user);
          console.log('Rol:', response.user.role);
          console.log('Redirigiendo a:', response.redirect);
          
          // Redirigir según el rol usando la URL que viene del backend
          if (response.redirect) {
            this.router.navigate([response.redirect]);
          } else {
            // Fallback por si el backend no envía redirect
            const redirectMap = {
              'student': '/dashboard',
              'teacher': '/profesor',
              'admin': '/admin'
            };
            const redirectPath = redirectMap[response.user.role];
            console.log('Usando fallback redirect:', redirectPath);
            this.router.navigate([redirectPath]);
          }
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getRole(): string | null {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  }

  // Método para verificar si el usuario tiene un rol específico
  hasRole(role: 'student' | 'teacher' | 'admin'): boolean {
    const userRole = this.getRole();
    return userRole === role;
  }

  // Método para refrescar el token (útil cuando expira)
  refreshToken(): Observable<any> {
    const refresh = localStorage.getItem('refresh');
    return this.http.post(`${this.apiUrl}/auth/refresh/`, { refresh }).pipe(
      tap((response: any) => {
        if (response.access) {
          localStorage.setItem('token', response.access);
        }
      })
    );
  }
}