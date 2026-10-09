import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CentroService } from '../../../centro/services/centro';
import { Centro } from '../../../../shared/interfaces/centro.interface';
import { LoadingService } from '../../../../core/services/loading.service';

@Component({
  selector: 'app-listar-centros',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listar-centros.html',
  styleUrl: './listar-centros.scss',
})
export class ListarCentrosComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly centroService = inject(CentroService);
  private readonly loadingService = inject(LoadingService);

  protected isLoading = this.loadingService.isLoading;
  protected centros = signal<Centro[] | null>(null);
  protected idEspecialidad!: number;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.idEspecialidad = Number(params['especialidad']);
      this.cargarCentros();
    });
  }

  cargarCentros(): void {
    this.centroService.listar().subscribe({
      next: (res) => this.centros.set(res.centros),
      error: () => this.centros.set(null),
    });
  }

  verMedicos(idCentro: number): void {
    this.router.navigate(['/coger-cita/medicos'], {
      queryParams: {
        especialidad: this.idEspecialidad,
        centro: idCentro,
      },
    });
  }

  volver(): void {
    this.router.navigate(['/coger-cita/especialidades']);
  }
}