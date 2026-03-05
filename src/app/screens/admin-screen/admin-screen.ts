import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type AdminTab = 'users' | 'categories' | 'reports';

type UserRole = 'student' | 'professor' | 'admin';
type UserStatus = 'active' | 'suspended';

interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}

interface Category {
  id: number;
  name: string;
  description: string;
  postCount: number;
  colorClass: string;
}

type ReportStatus = 'pending' | 'resolved' | 'dismissed';
type ReportType = 'post' | 'comment';

interface Report {
  id: number;
  type: ReportType;
  contentTitle: string;
  reporter: string;
  reason: string;
  date: string;
  status: ReportStatus;
  reportedUser?: string;
}

@Component({
  selector: 'app-admin-screen',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-screen.html',
  styleUrls: ['./admin-screen.scss'],

})
export class AdminScreen {
  activeTab: AdminTab = 'users';

  // demo data
  users: User[] = [
    { id: 1, name: 'Juan Pérez', email: 'juan@buap.mx', role: 'student', status: 'active', createdAt: '2026-02-10' },
    { id: 2, name: 'María García', email: 'maria@buap.mx', role: 'student', status: 'active', createdAt: '2026-02-11' },
    { id: 3, name: 'Dr. Roberto Sánchez', email: 'roberto@buap.mx', role: 'professor', status: 'active', createdAt: '2026-02-01' },
    { id: 4, name: 'Admin Demo', email: 'admin@buap.mx', role: 'admin', status: 'active', createdAt: '2026-01-15' },
    { id: 5, name: 'Pedro Sánchez', email: 'pedro@buap.mx', role: 'student', status: 'suspended', createdAt: '2026-02-12' },
  ];

  categories: Category[] = [
    { id: 1, name: 'Matemáticas', description: 'Álgebra, Cálculo, Geometría', postCount: 245, colorClass: 'dot-blue' },
    { id: 2, name: 'Programación', description: 'Lenguajes, Algoritmos, Desarrollo', postCount: 189, colorClass: 'dot-green' },
    { id: 3, name: 'Física', description: 'Mecánica, Termodinámica, Óptica', postCount: 156, colorClass: 'dot-purple' },
    { id: 4, name: 'Campus', description: 'Eventos, Avisos, Horarios', postCount: 98, colorClass: 'dot-yellow' },
    { id: 5, name: 'Tecnología', description: 'IA, Innovación, Tendencias', postCount: 134, colorClass: 'dot-red' },
  ];

  reports: Report[] = [
    { id: 1, type: 'post', contentTitle: 'Spam sobre venta de productos', reporter: 'Juan Pérez', reason: 'Contenido comercial no permitido', date: '2024-02-01', status: 'pending', reportedUser: 'Pedro Sánchez' },
    { id: 2, type: 'comment', contentTitle: 'Lenguaje ofensivo en comentario', reporter: 'María García', reason: 'Uso de lenguaje inapropiado', date: '2024-02-01', status: 'pending', reportedUser: 'Juan Pérez' },
    { id: 3, type: 'post', contentTitle: 'Información errónea sobre exámenes', reporter: 'Carlos López', reason: 'Desinformación', date: '2024-01-31', status: 'resolved', reportedUser: 'Ana Martínez' },
    { id: 4, type: 'comment', contentTitle: 'Plagio de contenido académico', reporter: 'Ana Martínez', reason: 'Violación de derechos de autor', date: '2024-01-31', status: 'dismissed', reportedUser: 'María García' },
  ];

  // UI state (simple, sin modales todavía)
  newCategory = { name: '', description: '', colorClass: 'dot-blue' };
  userSearch = '';
  roleFilter: UserRole | 'all' = 'all';
  statusFilter: UserStatus | 'all' = 'all';

  setTab(tab: AdminTab) {
    this.activeTab = tab;
  }

  // Counters
  get pendingReportsCount() {
    return this.reports.filter(r => r.status === 'pending').length;
  }
  get usersCount() {
    return this.users.length;
  }
  get categoriesCount() {
    return this.categories.length;
  }

  // Helpers
  reportTypeLabel(t: ReportType) {
    return t === 'post' ? 'Publicación' : 'Comentario';
  }
  statusLabel(s: ReportStatus) {
    if (s === 'pending') return 'Pendiente';
    if (s === 'resolved') return 'Resuelto';
    return 'Desestimado';
  }
  statusClass(s: ReportStatus) {
    if (s === 'pending') return 'badge-pending';
    if (s === 'resolved') return 'badge-resolved';
    return 'badge-dismissed';
  }
  roleLabel(r: UserRole) {
    if (r === 'student') return 'Estudiante';
    if (r === 'professor') return 'Profesor';
    return 'Admin';
  }

  // Filters
  get filteredUsers(): User[] {
    const q = this.userSearch.trim().toLowerCase();
    return this.users.filter(u => {
      const matchesText =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q);

      const matchesRole = this.roleFilter === 'all' ? true : u.role === this.roleFilter;
      const matchesStatus = this.statusFilter === 'all' ? true : u.status === this.statusFilter;

      return matchesText && matchesRole && matchesStatus;
    });
  }

  // Admin actions (mock)
  toggleSuspend(user: User) {
    this.users = this.users.map(u =>
      u.id === user.id ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u
    );
  }

  setRole(user: User, role: UserRole) {
    this.users = this.users.map(u =>
      u.id === user.id ? { ...u, role } : u
    );
  }

  deleteUser(user: User) {
    if (!confirm(`¿Eliminar usuario "${user.name}"?`)) return;
    this.users = this.users.filter(u => u.id !== user.id);
  }

  addCategory() {
    if (!this.newCategory.name.trim() || !this.newCategory.description.trim()) {
      alert('Completa nombre y descripción.');
      return;
    }
    const c: Category = {
      id: Date.now(),
      name: this.newCategory.name.trim(),
      description: this.newCategory.description.trim(),
      postCount: 0,
      colorClass: this.newCategory.colorClass,
    };
    this.categories = [c, ...this.categories];
    this.newCategory = { name: '', description: '', colorClass: 'dot-blue' };
  }

  deleteCategory(cat: Category) {
    if (!confirm(`¿Eliminar categoría "${cat.name}"?`)) return;
    this.categories = this.categories.filter(c => c.id !== cat.id);
  }

  reportAction(id: number, action: 'resolve' | 'dismiss') {
    this.reports = this.reports.map(r =>
      r.id === id ? { ...r, status: action === 'resolve' ? 'resolved' : 'dismissed' } : r
    );
  }
}
