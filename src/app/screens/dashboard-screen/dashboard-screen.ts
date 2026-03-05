import { Component, HostListener, ViewChild } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/shared.imports';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { NewPostModal } from '../../partials/new-post-modal/new-post-modal';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-screen',
  standalone: true,
  imports: [...SHARED_IMPORTS],
  templateUrl: './dashboard-screen.html',
  styleUrl: './dashboard-screen.scss',
})
export class DashboardScreen {

  activeSection = 'Inicio';
  activeCategory = 'Todas';


  searchQuery = '';
  sortBy: 'recent' | 'popular' | 'comments' = 'recent';

  userType = localStorage.getItem('userType') || 'Alumno';


  @ViewChild('sidenav') sidenav!: MatSidenav;

  isMobile = window.innerWidth <= 768;

  constructor(private dialog: MatDialog, private router: Router) {}

  @HostListener('window:resize')
  onResize() {
    const nowMobile = window.innerWidth <= 768;

    // si cambia el modo, ajusta el sidenav
    if (nowMobile !== this.isMobile) {
      this.isMobile = nowMobile;

      // en desktop: abierto; en móvil: cerrado
      if (this.sidenav) {
        this.isMobile ? this.sidenav.close() : this.sidenav.open();
      }
    }
  }

  toggleSidenav() {
    if (this.isMobile && this.sidenav) this.sidenav.toggle();
  }

  closeIfMobile() {
    if (this.isMobile && this.sidenav) this.sidenav.close();
  }

  // ====== Navegación ======
  setSection(section: string) {
    this.activeSection = section;
    this.closeIfMobile();
  }

  setCategory(category: string) {
    this.activeCategory = category;
    this.closeIfMobile();
  }


  openNewPostModal() {
    const dialogRef = this.dialog.open(NewPostModal, {
      width: '720px',
      maxWidth: '92vw',
      panelClass: 'cf-dialog',
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Modal result:', result);
    });
  }

  goToCategory(label: string) {
    this.activeCategory = label;
    this.closeIfMobile();

    if (label === 'Todas') {
      this.router.navigate(['/dashboard']);
      return;
    }

    const slug = label
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    this.router.navigate(['/dashboard/categoria', slug]);
  }
}
