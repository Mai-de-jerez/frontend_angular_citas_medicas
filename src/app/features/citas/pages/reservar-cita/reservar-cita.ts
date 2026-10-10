import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CitasService } from '../../services/citas';
import { Medico } from '../../../../shared/interfaces/usuario.interface';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-reservar-cita',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservar-cita.html',
  styleUrl: './reservar-cita.scss',
})
export class ReservarCitaComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly citasService = inject(CitasService);
  private readonly toastService = inject(ToastService);

  protected medico = signal<Medico | null>(null);

  protected idMedico!: number;
  protected idEspecialidad?: number;
  protected idCentro?: number;
  protected fecha: string = '';
  protected hora: string = '';

  protected motivo = signal('');
  protected notas = signal('');
  protected creandoCita = signal(false);
  protected error = signal<string | null>(null);

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const idMed = Number(params['medico']);

      if (isNaN(idMed)) {
        this.router.navigate(['/coger-cita/medicos']);
        return;
      }

      this.idMedico = idMed;
      this.idEspecialidad = Number(params['especialidad']) || undefined;
      this.idCentro = Number(params['centro']) || undefined;
      this.fecha = params['fecha'] || '';
      this.hora = params['hora'] || '';

      if (!this.fecha || !this.hora) {
        this.router.navigate(['/coger-cita/citas'], {
          queryParams: {
            medico: this.idMedico,
            especialidad: this.idEspecialidad,
            centro: this.idCentro,
          },
        });
        return;
      }

      this.cargarMedico();
    });
  }

  cargarMedico(): void {
    this.citasService.obtenerHuecosMedico(this.idMedico).subscribe({
      next: (respuesta) => {
        this.medico.set(respuesta.medico);
      },
      error: () => {
        this.router.navigate(['/coger-cita/medicos']);
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

  confirmarCita(): void {
    this.creandoCita.set(true);
    this.error.set(null);

    const payload = {
      id_medico: this.idMedico,
      fecha: this.fecha,
      hora: this.hora,
      motivo: this.motivo() || undefined,
      notas: this.notas() || undefined,
    };

    this.citasService.crearMiCita(payload).subscribe({
      next: () => {
        this.creandoCita.set(false);
        this.toastService.success('Cita reservada correctamente');
        this.router.navigate(['/mis-citas']);
      },
      error: (err) => {
        this.creandoCita.set(false);
        this.error.set(err.error?.mensaje || 'Error al reservar la cita');
      },
    });
  }

  volver(): void {
    const queryParams: Record<string, any> = { medico: this.idMedico };

    if (this.idEspecialidad) queryParams['especialidad'] = this.idEspecialidad;
    if (this.idCentro) queryParams['centro'] = this.idCentro;

    this.router.navigate(['/coger-cita/citas'], { queryParams });
  }
}
