import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
  private apiUrl = 'http://localhost:8000/api';

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  private getHeaders() {
    const token = this.auth.getToken();
    console.log('Token enviado:', token ? 'Bearer ' + token.substring(0, 20) + '...' : 'No token');
    
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  getCategories(): Observable<Category[]> {
    const headers = this.getHeaders();
    console.log('Headers:', headers);
    
    return this.http.get<Category[]>(`${this.apiUrl}/categorias/`, { headers });
  }

  getCategory(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/categorias/${id}/`, {
      headers: this.getHeaders()
    });
  }

  createCategory(payload: CreateCategoryPayload): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}/categorias/`, payload, {
      headers: this.getHeaders()
    });
  }

  updateCategory(id: number, payload: CreateCategoryPayload): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/categorias/${id}/`, payload, {
      headers: this.getHeaders()
    });
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/categorias/${id}/`, {
      headers: this.getHeaders()
    });
  }
}