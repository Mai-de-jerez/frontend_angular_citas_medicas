import { Component, inject, OnInit, signal } from '@angular/core';
import { UserService } from '../../../../features/users/services/user.service';
import { PerfilUsuario } from '../../../../shared/interfaces/perfil.interface';
import { LoadingService } from '../../../../core/services/loading.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.component.html',
  styleUrls: ['./perfil-usuario.component.scss']
})

export class PerfilUsuarioComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly loadingService = inject(LoadingService);
  private readonly router = inject(Router);
  
  // Solo necesitamos el signal del perfil
  protected perfil = signal<PerfilUsuario | null>(null);

  // Usamos el signal global del servicio de loading para el HTML
  protected isLoading = this.loadingService.isLoading;

  editarPerfil(): void {
    this.router.navigate(['/actualizar-perfil']);
  }

  ngOnInit(): void {
    this.userService.miPerfil().subscribe({
      next: (data) => {
        this.perfil.set(data);
      }
    });
  }
}