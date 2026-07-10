import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UserFormAdmin } from '../../../../../shared/components/forms/user-form-admin/user-form-admin';
import { UserService } from '../../../../users/services/user.service';
import { ToastService } from '../../../../../core/services/toast.service';
import { LoadingService } from '../../../../../core/services/loading.service';
import { Usuario } from '../../../../../shared/interfaces/usuario.interface';

@Component({
  selector: 'app-editar-usuario',
  standalone: true,
  imports: [CommonModule, UserFormAdmin],
  templateUrl: './editar-usuario.html',
  styleUrl: './editar-usuario.scss',
})
export class EditarUsuario implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private userService = inject(UserService);
  private toastService = inject(ToastService);
  protected loadingService = inject(LoadingService);

  usuario = signal<Usuario | null>(null);
  cargando = signal<boolean>(true);

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.cargarUsuario(id);
  }

  cargarUsuario(id: number): void {
    this.userService.verUsuario(id).subscribe({
      next: (res) => {
        this.usuario.set(res.usuario);
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
        this.toastService.error('Error al cargar el usuario');
        this.router.navigate(['/admin/usuarios']);
      }
    });
  }

  onFormSubmit(formData: FormData): void {
    const id = this.usuario()?.id;
    if (!id) return;

    // llamamos a mi servicio para actualizar el usuario
    this.userService.actualizarUsuario(id, formData).subscribe({
      next: () => {
        this.toastService.success('Usuario actualizado correctamente');
        this.router.navigate(['/admin/usuarios', id]);
      }
    });
  }

  volver(): void {
    const id = this.usuario()?.id;
    this.router.navigate(['/admin/usuarios', id]);
  }
}
