import { Component } from '@angular/core';
import { SHARED_IMPORTS } from '../../../shared/shared.imports';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { NewPostModal } from '../../../partials/new-post-modal/new-post-modal';

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

  constructor(private dialog: MatDialog, private router: Router) {}

  openNewPostModal() {
    this.dialog.open(NewPostModal, {
      width: '720px',
      maxWidth: '92vw',
      panelClass: 'cf-dialog',
      autoFocus: false,
    });
  }
  goBackDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
