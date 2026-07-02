import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../features/auth/services/auth';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive], 
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss', 
  standalone: true,
})
export class NavbarComponent {
  protected authService = inject(AuthService);
  menuAbierto = false;

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

  cerrarMenu() {
    this.menuAbierto = false;
  }

  onLogout() {
    this.authService.logout();
    this.cerrarMenu();
  }
}
