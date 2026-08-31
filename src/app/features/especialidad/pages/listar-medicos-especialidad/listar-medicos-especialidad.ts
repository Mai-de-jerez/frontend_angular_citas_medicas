import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { EspecialidadService } from '../../services/especialidad';
import { MedicoPorEspecialidadResponse } from '../../../../shared/interfaces/especialidad.interface';

@Component({
  selector: 'app-listar-medicos-especialidad',
  imports: [CommonModule],
  templateUrl: './listar-medicos-especialidad.html',
  styleUrl: './listar-medicos-especialidad.scss',
  standalone: true
})
export class ListarMedicosEspecialidadComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private especialidadService = inject(EspecialidadService);

  datos = signal<MedicoPorEspecialidadResponse | null>(null);
  cargando = signal<boolean>(true);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.cargarMedicos(Number(idParam));
    }
  }

  cargarMedicos(id: number): void {
    this.cargando.set(true);
    this.especialidadService.listarMedicosPorEspecialidad(id).subscribe({
      next: (response) => {
        this.datos.set(response);
        this.cargando.set(false);
      },
      error: () => {
        this.datos.set(null);
        this.cargando.set(false);
      }
    });
  }

  verCitasDisponibles(idMedico: number): void {
    this.router.navigate(['/medicos', idMedico, 'citas']);
  }

  volver(): void {
    this.router.navigate(['/especialidades']); 
  }
}
