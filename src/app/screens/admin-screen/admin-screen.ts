import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-screen',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-screen.html',
  styleUrls: ['./admin-screen.scss'],
})
export class AdminScreen {}