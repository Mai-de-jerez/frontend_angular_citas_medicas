// features/admin/users/detalle-usuario/detalle-usuario.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../../users/services/user.service';
import { Usuario } from '../../../../../shared/interfaces/usuario.interface';
import { LoadingService } from '../../../../../core/services/loading.service';

@Component({
  selector: 'app-detalle-usuario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalle-usuario.html',
  styleUrl: './detalle-usuario.scss',
})

export class DetalleUsuario implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private userService = inject(UserService);
  private loadingService = inject(LoadingService);

  protected isLoading = this.loadingService.isLoading;
  protected usuario = signal<Usuario | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.cargarUsuario(id);
  }

  cargarUsuario(id: number): void {
    this.userService.verUsuario(id).subscribe({
      next: (res) => {
        this.usuario.set(res.usuario);
      }
    });
  }

  irAEditar(): void {
    const userId = this.usuario()?.id;
    if (userId) {
      this.router.navigate(['/admin/usuarios/editar', userId]);
    }
  }

  volver(): void {
    this.router.navigate(['/admin/usuarios']);
  }
}