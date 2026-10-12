import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CitasService } from '../../../../citas/services/citas';
import { Cita } from '../../../../../shared/interfaces/cita.interface';
import { LoadingService } from '../../../../../core/services/loading.service';

@Component({
  selector: 'app-detalle-cita',
  standalone: true,
  imports: [CommonModule ],
  templateUrl: './detalle-cita.html',
  styleUrl: './detalle-cita.scss',
})
export class DetalleCitaComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly citasService = inject(CitasService);
  private readonly loadingService = inject(LoadingService);

  protected isLoading = this.loadingService.isLoading;
  protected cita = signal<Cita | null>(null);
  protected error = signal<string | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id || isNaN(id)) {
      this.router.navigate(['/admin/citas']);
      return;
    }

    this.cargarCita(id);
  }

  cargarCita(id: number): void {
    this.citasService.verCitaAdmin(id).subscribe({
      next: (res) => this.cita.set(res.cita),
      error: (err) => {
        this.error.set(err.error?.mensaje || 'Error al cargar la cita');
      },
    });
  }

  formatearFecha(fechaStr: string): string {
    const fecha = new Date(fechaStr);
    const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
                   'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

    return `${dias[fecha.getDay()]}, ${fecha.getDate()} de ${meses[fecha.getMonth()]} de ${fecha.getFullYear()}`;
  }

  volver(): void {
    this.router.navigate(['/admin/citas']);
  }
}
