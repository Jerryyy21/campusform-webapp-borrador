import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api'; // Ajusta según tu configuración

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  register(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register/`, payload);
  }

  login(credentials: { email: string; password: string; role?: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login/`, credentials).pipe(
      tap((response: any) => {
        if (response.user) {
          // Guardar datos del usuario en localStorage
          localStorage.setItem('user', JSON.stringify(response.user));
          // Redirigir al dashboard
          this.router.navigate(['/dashboard']);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  getCurrentUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }
}