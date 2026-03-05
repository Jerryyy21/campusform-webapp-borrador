import { Component } from '@angular/core';
import { CategoriasScreen } from '../categorias-screen/categorias-screen';

@Component({
  selector: 'app-programacion',
  standalone: true,
  imports: [CategoriasScreen],
  templateUrl: './programacion.html',
  styleUrl: './programacion.scss',
})
export class ProgramacionComponent {}

