import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CitasService } from '../../services/citas';
import { HuecosMedicoRespuesta, DiaConHuecos } from '../../../../shared/interfaces/cita.interface';
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
  protected dias = signal<DiaConHuecos[]>([]);
  protected diaSeleccionado = signal<DiaConHuecos | null>(null);
  protected isLoading = this.loadingService.isLoading;

  protected idEspecialidad?: number;
  protected idCentro?: number;
  protected idMedico?: number;

  // Huecos del día seleccionado
  protected huecosDelDia = computed(() => this.diaSeleccionado()?.huecos ?? []);

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
        this.dias.set(respuesta.dias);

        // Seleccionar el primer día por defecto
        if (respuesta.dias.length > 0) {
          this.diaSeleccionado.set(respuesta.dias[0]);
        }
      },
      error: () => {
        this.dias.set([]);
      },
    });
  }

  seleccionarDia(dia: DiaConHuecos): void {
    this.diaSeleccionado.set(dia);
  }

  // Formatea la fecha corta: "Vie 16" o "Lun 19"
  formatearFechaCorta(fechaStr: string): string {
    const fecha = new Date(fechaStr);
    const dias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    return `${dias[fecha.getDay()]} ${fecha.getDate()}`;
  }

  // Formatea el mes corto: "OCT" o "NOV"
  formatearMes(fechaStr: string): string {
    const fecha = new Date(fechaStr);
    const meses = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN',
                   'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
    return meses[fecha.getMonth()];
  }

  // Formatea la fecha larga del bloque info
  formatearFechaLarga(fechaStr: string): string {
    const fecha = new Date(fechaStr);
    const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
                   'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    return `${dias[fecha.getDay()]}, ${fecha.getDate()} de ${meses[fecha.getMonth()]} de ${fecha.getFullYear()}`;
  }

  // Comprueba si un día es HOY
  esHoy(fechaStr: string): boolean {
    const hoy = new Date().toISOString().slice(0, 10);
    return fechaStr === hoy;
  }

  reservarHora(hora: string): void {
    const dia = this.diaSeleccionado();
    if (!dia) return;

    const queryParams: Record<string, any> = {
      medico: this.idMedico,
      fecha: dia.fecha,
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
