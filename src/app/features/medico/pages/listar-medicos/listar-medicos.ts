import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MedicoService } from '../../services/medico';
import { Medico } from '../../../../shared/interfaces/usuario.interface';
import { LoadingService } from '../../../../core/services/loading.service';

@Component({
  selector: 'app-listar-medicos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listar-medicos.html',
  styleUrl: './listar-medicos.scss',
})
export class ListarMedicosComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly medicoService = inject(MedicoService);
  private readonly loadingService = inject(LoadingService);

  protected isLoading = this.loadingService.isLoading;
  protected medicos = signal<Medico[] | null>(null);
  protected idEspecialidad!: number;
  protected idCentro!: number;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.idEspecialidad = Number(params['especialidad']);
      this.idCentro = Number(params['centro']);

      if (this.idEspecialidad && this.idCentro) {
        this.cargarMedicos();
      }
    });
  }

  cargarMedicos(): void {
    this.medicoService.listar({
      idEspecialidad: this.idEspecialidad,
      idCentro: this.idCentro,
    }).subscribe({
      next: (res) => this.medicos.set(res.medicos),
      error: () => this.medicos.set(null),
    });
  }

  verCitasDisponibles(idMedico: number): void {
    this.router.navigate(['/coger-cita/medicos', idMedico, 'citas']);
  }

  volver(): void {
    this.router.navigate(['/coger-cita/centros'], {
      queryParams: { especialidad: this.idEspecialidad },
    });
  }
}
