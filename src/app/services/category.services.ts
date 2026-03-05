import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.services';

export interface Category {
  id: number;
  nombre: string;
  descripcion: string;
  post_count: number;
  creada_por: number;
  creada_por_nombre: string;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

export interface CreateCategoryPayload {
  nombre: string;
  descripcion: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  // ✅ TU BACKEND REAL ES /api/...
  private apiUrl = 'http://localhost:8000/api';

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  /** Helper para headers con token */
  private authHeaders(): HttpHeaders {
    const token = this.auth.getToken();

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  /** Obtiene todas las categorías - PÚBLICO */
  getCategories(): Observable<Category[]> {
    const url = `${this.apiUrl}/categorias/`;
    console.log('📡 GET categorías:', url);

    return this.http.get<Category[]>(url).pipe(
      catchError(error => {
        console.error('❌ Error en getCategories:', error);
        return throwError(() => error);
      })
    );
  }

  /** Obtiene una categoría por ID - PÚBLICO */
  getCategory(id: number): Observable<Category> {
    const url = `${this.apiUrl}/categorias/${id}/`;
    console.log('📡 GET categoría:', url);

    return this.http.get<Category>(url).pipe(
      catchError(error => {
        console.error('❌ Error en getCategory:', error);
        return throwError(() => error);
      })
    );
  }

  /** Crea una nueva categoría - REQUIERE TOKEN */
  createCategory(payload: CreateCategoryPayload): Observable<Category> {
    const url = `${this.apiUrl}/categorias/`;
    console.log('📡 POST crear categoría:', url);

    const token = this.auth.getToken();
    if (!token) {
      console.error('❌ No hay token en localStorage/sessionStorage');
      return throwError(() => new Error('No hay token de autenticación'));
    }

    return this.http.post<Category>(url, payload, { headers: this.authHeaders() }).pipe(
      catchError(error => {
        console.error('❌ Error en createCategory:', error);
        return throwError(() => error);
      })
    );
  }

  /** Actualiza una categoría - REQUIERE TOKEN */
  updateCategory(id: number, payload: CreateCategoryPayload): Observable<Category> {
    const url = `${this.apiUrl}/categorias/${id}/`;
    console.log('📡 PUT actualizar categoría:', url);

    const token = this.auth.getToken();
    if (!token) {
      return throwError(() => new Error('No hay token de autenticación'));
    }

    return this.http.put<Category>(url, payload, { headers: this.authHeaders() }).pipe(
      catchError(error => {
        console.error('❌ Error en updateCategory:', error);
        return throwError(() => error);
      })
    );
  }

  /** Elimina una categoría - REQUIERE TOKEN */
  deleteCategory(id: number): Observable<void> {
    const url = `${this.apiUrl}/categorias/${id}/`;
    console.log('📡 DELETE eliminar categoría:', url);

    const token = this.auth.getToken();
    if (!token) {
      return throwError(() => new Error('No hay token de autenticación'));
    }

    return this.http.delete<void>(url, { headers: this.authHeaders() }).pipe(
      catchError(error => {
        console.error('❌ Error en deleteCategory:', error);
        return throwError(() => error);
      })
    );
  }
}