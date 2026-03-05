import { Component } from '@angular/core';
import { SHARED_IMPORTS } from '../../../shared/shared.imports';
import { Router } from '@angular/router';



@Component({
  selector: 'app-guardados',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  templateUrl: './guardados.html',
  styleUrl: './guardados.scss',
})
export class GuardadosComponent  {
  searchQuery = '';
  sortBy: 'recent' | 'popular' | 'comments' = 'recent';

  constructor(private router: Router) {}

  goBackDashboard() {
    this.router.navigate(['/dashboard']);
  }
}

