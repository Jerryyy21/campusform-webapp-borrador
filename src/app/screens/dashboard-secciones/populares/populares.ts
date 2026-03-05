import { Component } from '@angular/core';
import { SHARED_IMPORTS } from '../../../shared/shared.imports';
import { Router } from '@angular/router';

@Component({
  selector: 'app-populares',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  templateUrl: './populares.html',
  styleUrl: './populares.scss',
})
export class PopularesComponent {
  searchQuery = '';
  sortBy: 'recent' | 'popular' | 'comments' = 'recent';

  constructor(private router: Router) {}

  goBackDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
