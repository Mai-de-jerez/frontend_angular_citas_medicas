import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CitasService } from '../../../../features/citas/services/citas';
import { Cita } from '../../../../shared/interfaces/cita.interface';
import { LoadingService } from '../../../../core/services/loading.service';
import { FormsModule } from '@angular/forms';
import { SelectBusqueda } from '../../../../shared/components/select-busqueda/select-busqueda';

@Component({
  selector: 'app-mis-citas',
  standalone: true,
  imports: [CommonModule, FormsModule, SelectBusqueda],
  templateUrl: './mis-citas.html',
  styleUrl: './mis-citas.scss',
})
export class MisCitasComponent implements OnInit {
  private readonly citasService = inject(CitasService);
  private readonly loadingService = inject(LoadingService);

  protected citas = signal<Cita[] | null>(null);
  protected isLoading = this.loadingService.isLoading;

  filtros = {
    fecha: '',
    estado: '',
  };

  estadosOpciones = [
    { value: 'activa', label: 'Activa' },
    { value: 'cancelada', label: 'Cancelada' },
    { value: 'finalizada', label: 'Finalizada' },
  ];

  ngOnInit(): void {
    this.cargarCitas();
  }

  cargarCitas(): void {
    this.citasService
      .obtenerMisCitas({
        fecha: this.filtros.fecha || undefined,
        estado: this.filtros.estado || undefined,
      })
      .subscribe({
        next: (respuesta) => {
          this.citas.set(respuesta.citas);
        },
        error: () => {
          this.citas.set(null);
        },
      });
  }

  aplicarFiltros(): void {
    this.cargarCitas();
  }
}
