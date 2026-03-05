import { Component } from '@angular/core';
import { CategoriasScreen } from '../categorias-screen/categorias-screen';

@Component({
  selector: 'app-matematicas',
  standalone: true,
  imports: [CategoriasScreen],
  templateUrl: './matematicas.html',
  styleUrl: './matematicas.scss',
})
export class MatematicasComponent {}
