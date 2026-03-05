import { Component, Input } from '@angular/core';
import { SHARED_IMPORTS } from '../../../shared/shared.imports';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categorias-screen',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  templateUrl: './categorias-screen.html',
  styleUrl: './categorias-screen.scss',
})


export class CategoriasScreen {
  @Input() categoriaNombre = 'Categoría';
  @Input() total = 0;

  searchQuery = '';
  sortBy: 'recent' | 'popular' | 'comments' = 'recent';

  constructor(private router: Router) {}

  goBackDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
