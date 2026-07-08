// features/users/components/actualizar-perfil/actualizar-perfil.ts
import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserFormComponent } from '../../../../shared/components/forms/user-form/user-form';
import { UserService } from '../../services/user.service';
import { ToastService } from '../../../../core/services/toast.service';
import { AuthService } from '../../../auth/services/auth';
import { Usuario } from '../../../../shared/interfaces/usuario.interface';

@Component({
  selector: 'app-actualizar-perfil',
  standalone: true,
  imports: [CommonModule, UserFormComponent],
  templateUrl: './actualizar-perfil.html',
  styleUrl: './actualizar-perfil.scss',
})
export class ActualizarPerfil implements OnInit {
  private userService = inject(UserService);
  private router = inject(Router);
  private toastService = inject(ToastService);
  private authService = inject(AuthService);

  usuario = signal<Usuario | null>(null);

  ngOnInit(): void {
    this.usuario.set(this.authService.usuario());
  }

  onFormSubmit(formData: FormData): void {
    this.userService.actualizarPerfil(formData).subscribe({
      next: (res) => {
        this.toastService.success(res.mensaje);
        this.authService.actualizarUsuario(res.usuario);
        this.router.navigate(['/mi-perfil']);
      }
    });
  }

  onCancelar(): void {
    this.router.navigate(['/mi-perfil']);
  }
}
