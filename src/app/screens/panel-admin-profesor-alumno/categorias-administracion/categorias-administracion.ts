import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CategoryService, Category, CreateCategoryPayload } from '../../../services/category.services';

@Component({
  selector: 'app-categorias-administracion',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './categorias-administracion.html',
  styleUrls: ['./categorias-administracion.scss'],
})
export class CategoriasAdministracion implements OnInit {
  categories: Category[] = [];
  loading = false;
  errorMessage = '';

  // Formulario nueva categoría
  newCategory: CreateCategoryPayload = { nombre: '', descripcion: '' };

  // UI
  search = '';
  editingId: number | null = null;
  editForm: CreateCategoryPayload = { nombre: '', descripcion: '' };

  constructor(private categoryService: CategoryService) {}

  ngOnInit() {
    this.loadCategories();
  }

  get filteredCategories(): Category[] {
    const q = this.search.trim().toLowerCase();
    if (!q) return this.categories;
    return this.categories.filter(c =>
      c.nombre.toLowerCase().includes(q) ||
      c.descripcion.toLowerCase().includes(q)
    );
  }

  loadCategories() {
    this.loading = true;
    this.errorMessage = '';

    this.categoryService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando categorías:', err);
        this.errorMessage = 'Error al cargar las categorías. Intenta de nuevo.';
        this.loading = false;
        
        if (err.status === 401) {
          this.errorMessage = 'No autorizado. Por favor, inicia sesión nuevamente.';
        }
      }
    });
  }

  createCategory() {
    const nombre = this.newCategory.nombre?.trim();
    const descripcion = this.newCategory.descripcion?.trim();

    if (!nombre || !descripcion) {
      alert('Completa nombre y descripción.');
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.categoryService.createCategory({ nombre, descripcion }).subscribe({
      next: (newCat) => {
        this.categories = [newCat, ...this.categories];
        this.newCategory = { nombre: '', descripcion: '' };
        this.loading = false;
      },
      error: (err) => {
        console.error('Error creando categoría:', err);
        this.errorMessage = 'Error al crear la categoría. Intenta de nuevo.';
        this.loading = false;
      }
    });
  }

  startEdit(cat: Category) {
    this.editingId = cat.id;
    this.editForm = {
      nombre: cat.nombre,
      descripcion: cat.descripcion,
    };
  }

  cancelEdit() {
    this.editingId = null;
  }

  saveEdit(cat: Category) {
    const nombre = this.editForm.nombre?.trim();
    const descripcion = this.editForm.descripcion?.trim();

    if (!nombre || !descripcion) {
      alert('Completa nombre y descripción.');
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.categoryService.updateCategory(cat.id, { nombre, descripcion }).subscribe({
      next: (updatedCat) => {
        this.categories = this.categories.map(c =>
          c.id === cat.id ? updatedCat : c
        );
        this.editingId = null;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error actualizando categoría:', err);
        this.errorMessage = 'Error al actualizar la categoría. Intenta de nuevo.';
        this.loading = false;
      }
    });
  }

  deleteCategory(cat: Category) {
    if (!confirm(`¿Eliminar categoría "${cat.nombre}"?`)) return;
    
    this.loading = true;
    this.errorMessage = '';

    this.categoryService.deleteCategory(cat.id).subscribe({
      next: () => {
        this.categories = this.categories.filter(c => c.id !== cat.id);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error eliminando categoría:', err);
        this.errorMessage = 'Error al eliminar la categoría. Intenta de nuevo.';
        this.loading = false;
      }
    });
  }
}