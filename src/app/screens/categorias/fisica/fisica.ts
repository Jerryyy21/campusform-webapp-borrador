import { Component } from '@angular/core';
import { CategoriasScreen } from '../categorias-screen/categorias-screen';

@Component({
  selector: 'app-fisica',
  standalone: true,
  imports: [CategoriasScreen],
  templateUrl: './fisica.html',
  styleUrl: './fisica.scss',
})
export class FisicaComponent {}
