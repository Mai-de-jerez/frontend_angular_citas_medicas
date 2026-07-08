// features/admin/pages/crear-usuario/crear-usuario.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../../../users/services/user.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { LoadingService } from '../../../../../core/services/loading.service';
import { UserFormAdmin } from '../../../../../shared/components/forms/user-form-admin/user-form-admin';

@Component({
  selector: 'app-crear-usuario',
  standalone: true,
  imports: [CommonModule, UserFormAdmin],
  templateUrl: './crear-usuario.html',
  styleUrl: './crear-usuario.scss',
})

export class CrearUsuario {
  private userService = inject(UserService);
  private router = inject(Router);
  private toastService = inject(ToastService);
  protected loadingService = inject(LoadingService);



  onFormSubmit(formData: FormData): void {
    this.userService.crearUsuario(formData).subscribe({
      next: () => {
        this.toastService.success('Usuario creado correctamente');
        this.router.navigate(['/admin/usuarios']);
      }
    });
  }

  volver(): void {
    this.router.navigate(['/admin/usuarios']);
  }
}
