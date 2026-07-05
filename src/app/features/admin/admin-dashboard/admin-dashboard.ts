import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  imports: [],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss',
})

export class AdminDashboard {
  constructor(private router: Router) {}

  irAUsuarios(): void {
    this.router.navigate(['/admin/usuarios']);
  }
}
