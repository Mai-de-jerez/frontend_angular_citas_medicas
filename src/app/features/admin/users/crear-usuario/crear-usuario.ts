// features/admin/pages/crear-usuario/crear-usuario.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserFormComponent } from '../../../../shared/components/user-form/user-form';
import { UserService } from '../../../users/services/user.service';
import { EspecialidadService } from '../../../especialidad/services/especialidad';
import { ToastService } from '../../../../core/services/toast.service';
import { LoadingService } from '../../../../core/services/loading.service';
import { Especialidad } from '../../../../shared/interfaces/usuario.interface';

@Component({
  selector: 'app-crear-usuario',
  standalone: true,
  imports: [CommonModule, UserFormComponent],
  templateUrl: './crear-usuario.html',
  styleUrl: './crear-usuario.scss',
})
export class CrearUsuario implements OnInit {
  private userService = inject(UserService);
  private especialidadService = inject(EspecialidadService);
  private router = inject(Router);
  private toastService = inject(ToastService);
  protected loadingService = inject(LoadingService);

  especialidades = signal<Especialidad[]>([]);

  ngOnInit(): void {
    this.cargarEspecialidades();
  }

  cargarEspecialidades(): void {
    this.especialidadService.listar().subscribe({
      next: (data) => this.especialidades.set(data),
      error: () => this.toastService.error('Error al cargar especialidades')
    });
  }

  onFormSubmit(formData: FormData): void {
    this.userService.crearUsuario(formData).subscribe({
      next: () => {
        this.toastService.success('Usuario creado correctamente');
        this.router.navigate(['/admin/usuarios']);
      },
      error: () => {
        // El error interceptor ya muestra el toast
      }
    });
  }

  volver(): void {
    this.router.navigate(['/admin/usuarios']);
  }
}
