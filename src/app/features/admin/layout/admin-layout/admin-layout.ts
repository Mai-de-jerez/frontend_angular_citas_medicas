// features/admin/layout/admin-layout/admin-layout.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from '../../../auth/services/auth';
import { UserService } from '../../../users/services/user.service';


@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss',
})
export class AdminLayout {

  protected authService = inject(AuthService);
  protected userService = inject(UserService);

  onLogout() {
    this.authService.logout();
  }
}
