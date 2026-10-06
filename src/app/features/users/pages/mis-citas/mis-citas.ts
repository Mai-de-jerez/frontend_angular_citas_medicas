import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CitasService } from '../../../../features/citas/services/citas';
import { Cita } from '../../../../shared/interfaces/cita.interface';
import { LoadingService } from '../../../../core/services/loading.service';

@Component({
  selector: 'app-mis-citas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mis-citas.html',
  styleUrl: './mis-citas.scss',
})
export class MisCitasComponent implements OnInit {
  private readonly citasService = inject(CitasService);
  private readonly loadingService = inject(LoadingService);

  protected citas = signal<Cita[] | null>(null);
  protected isLoading = this.loadingService.isLoading;

  ngOnInit(): void {
    this.cargarCitas();
  }

  cargarCitas(): void {
    this.citasService.obtenerMisCitas().subscribe({
      next: (respuesta) => {
        this.citas.set(respuesta.citas);
      },
      error: () => {
        this.citas.set(null);
      },
    });
  }
}
