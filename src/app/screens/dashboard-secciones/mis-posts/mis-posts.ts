import { Component } from '@angular/core';
import { SHARED_IMPORTS } from '../../../shared/shared.imports';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mis-posts',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  templateUrl: './mis-posts.html',
  styleUrl: './mis-posts.scss',
})
export class  MisPostsComponent {
   searchQuery = '';
  sortBy: 'recent' | 'popular' | 'comments' = 'recent';

  constructor(private router: Router) {}

  goBackDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
