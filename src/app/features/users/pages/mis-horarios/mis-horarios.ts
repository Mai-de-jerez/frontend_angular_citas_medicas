import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { HorarioService } from '../../../horarios/services/horario';
import { Horario } from '../../../../shared/interfaces/horario.interface';
import { LoadingService } from '../../../../core/services/loading.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mis-horarios',
  standalone: true, 
  imports: [CommonModule], 
  templateUrl: './mis-horarios.html',
  styleUrl: './mis-horarios.scss'
})

export class MisHorariosComponent implements OnInit {
  private readonly horarioService = inject(HorarioService);
  private readonly loadingService = inject(LoadingService);

  protected horarios = signal<Horario[] | null>(null);
  protected isLoading = this.loadingService.isLoading;

  // Días de la semana 
  protected readonly diasSemana = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];

  // Rango de horas 
  protected readonly horas = [
    '00:00', '01:00', '02:00', '03:00', '04:00', '05:00',
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
  ];
  // Computed: genera la tabla de disponibilidad
  protected disponibilidad = computed(() => {
    const lista = this.horarios();
    if (!lista) return null;

    // Mapa: día -> array de intervalos { inicio, fin }
    const mapa = new Map<string, { inicio: string; fin: string }[]>();
    lista.forEach(h => {
      if (!mapa.has(h.dia_semana)) {
        mapa.set(h.dia_semana, []);
      }
      mapa.get(h.dia_semana)!.push({ inicio: h.hora_inicio, fin: h.hora_fin });
    });

    // Construir tabla: por cada hora, por cada día, indicar si está disponible
    const tabla = this.horas.map(hora => {
      const fila = {
        hora: hora,
        dias: this.diasSemana.map(dia => {
          const intervalos = mapa.get(dia) || [];
          const disponible = intervalos.some(intervalo => {
            // La hora está dentro del intervalo [inicio, fin)
            return hora >= intervalo.inicio && hora < intervalo.fin;
          });
          return { dia, disponible };
        })
      };
      return fila;
    });

    return tabla;
  });

  ngOnInit(): void {
    this.cargarHorarios();
  }

  cargarHorarios(): void {
    this.horarioService.getMisHorarios().subscribe({
      next: (data) => {
        this.horarios.set(data);
      },
      error: () => {
        this.horarios.set(null);
      }
    });
  }
}
