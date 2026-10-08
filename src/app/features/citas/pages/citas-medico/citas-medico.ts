import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CitasService } from '../../services/citas';
import { HuecosMedicoRespuesta } from '../../../../shared/interfaces/cita.interface';
import { LoadingService } from '../../../../core/services/loading.service';

@Component({
  selector: 'app-citas-medico',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './citas-medico.html',
  styleUrl: './citas-medico.scss',
})
export class CitasMedicoComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly citasService = inject(CitasService);
  private readonly loadingService = inject(LoadingService);

  protected medico = signal<{ id: number; nombre_completo: string } | null>(null);
  protected fecha = signal<string | null>(null);
  protected huecos = signal<string[] | null>(null);
  protected isLoading = this.loadingService.isLoading;

  protected formatearFecha(fechaStr: string): string {
    const fecha = new Date(fechaStr);
    const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
                  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

    const dia = dias[fecha.getDay()];
    const num = fecha.getDate();
    const mes = meses[fecha.getMonth()];
    const anio = fecha.getFullYear();

    return `${dia}, ${num} de ${mes} de ${anio}`;
  }

  ngOnInit(): void {
    const medicoId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarHuecos(medicoId);
  }

  cargarHuecos(medicoId: number): void {
    this.citasService.obtenerHuecosMedico(medicoId).subscribe({
      next: (respuesta: HuecosMedicoRespuesta) => {
        this.medico.set(respuesta.medico);
        this.fecha.set(respuesta.fecha);
        this.huecos.set(respuesta.huecos_disponibles);
      },
      error: () => {
        this.huecos.set(null);
      },
    });
  }

  reservarHora(hora: string): void {
    // Aquí conectaremos con crear cita más adelante
    console.log('Reservar:', hora, 'con médico', this.medico()?.nombre_completo);
  }

  volver(): void {
    window.history.back();
  }
}
