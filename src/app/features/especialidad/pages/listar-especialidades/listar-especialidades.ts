import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EspecialidadService } from '../../services/especialidad';
import { Especialidad } from '../../../../shared/interfaces/especialidad.interface';

@Component({
  selector: 'app-listar-especialidades',
  imports: [CommonModule],
  templateUrl: './listar-especialidades.html',
  styleUrl: './listar-especialidades.scss',
  standalone: true
})
export class ListarEspecialidadesComponent implements OnInit {
  private especialidadService = inject(EspecialidadService);
  private router = inject(Router);

  especialidades = signal<Especialidad[]>([]);
  cargando = signal<boolean>(true);

  ngOnInit(): void {
    this.cargarEspecialidades();
  }

  cargarEspecialidades(): void {
    this.cargando.set(true);
    this.especialidadService.listar().subscribe({
      next: (data) => {
        this.especialidades.set(data);
        this.cargando.set(false);
      },
      error: () => {
        this.especialidades.set([]);
        this.cargando.set(false);
      }
    });
  }

  cogerCita(idEspecialidad: number): void {
    this.router.navigate(['/especialidades', idEspecialidad, 'medicos']);
  }
}
