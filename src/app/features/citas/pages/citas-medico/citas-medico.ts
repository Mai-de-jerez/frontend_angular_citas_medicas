import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CitasService } from '../../services/citas';
import { HuecosMedicoRespuesta } from '../../../../shared/interfaces/cita.interface';
import { LoadingService } from '../../../../core/services/loading.service';
import { Medico } from '../../../../shared/interfaces/usuario.interface';

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

  protected medico = signal<Medico | null>(null);
  protected fecha = signal<string | null>(null);
  protected huecos = signal<string[] | null>(null);
  protected isLoading = this.loadingService.isLoading;

  protected idEspecialidad?: number;
  protected idCentro?: number;
  protected idMedico?: number;

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
    this.route.queryParams.subscribe(params => {
      const idMed = Number(params['medico']);
      const idEsp = Number(params['especialidad']);
      const idCen = Number(params['centro']);

      if (isNaN(idMed)) {
        this.router.navigate(['/coger-cita/medicos']);
        return;
      }

      this.idMedico = idMed;
      this.idEspecialidad = (!isNaN(idEsp)) ? idEsp : undefined;
      this.idCentro = (!isNaN(idCen)) ? idCen : undefined;

      this.cargarHuecos(idMed);
    });
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
    const queryParams: Record<string, any> = {
      medico: this.idMedico,
      fecha: this.fecha(),
      hora: hora,
    };

    if (this.idEspecialidad) queryParams['especialidad'] = this.idEspecialidad;
    if (this.idCentro) queryParams['centro'] = this.idCentro;

    this.router.navigate(['/coger-cita/reservar'], { queryParams });
  }

  volver(): void {
    
    const queryParams: Record<string, any> = {};

    if (this.idEspecialidad) queryParams['especialidad'] = this.idEspecialidad;
    if (this.idCentro) queryParams['centro'] = this.idCentro;

    this.router.navigate(['/coger-cita/medicos'], { queryParams });
  }
}
