import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CitasListadoResponse, HuecosMedicoRespuesta } from '../../../shared/interfaces/cita.interface';

@Injectable({
  providedIn: 'root',
})
export class CitasService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  /**
   * Obtiene las citas del usuario autenticado (Médico o Paciente)
   */
  obtenerMisCitas(filtros?: {
    fecha?: string;
    estado?: string;
    por_pagina?: number;
    page?: number;
  }): Observable<CitasListadoResponse> {
    let params = new HttpParams();

    if (filtros?.fecha) params = params.set('fecha', filtros.fecha);
    if (filtros?.estado) params = params.set('estado', filtros.estado);
    if (filtros?.por_pagina) params = params.set('por_pagina', filtros.por_pagina.toString());
    if (filtros?.page) params = params.set('page', filtros.page.toString());

    return this.http.get<CitasListadoResponse>(`${this.apiUrl}/mis-citas`, { params });
  }


  listarCitas(filtros?: {
    id?: number;
    nombre_medico?: string;
    nombre_paciente?: string;
    estado?: string;
    fecha?: string;
    page?: number;
  }): Observable<CitasListadoResponse> {
    let params = new HttpParams();

    if (filtros?.id) params = params.set('id', filtros.id.toString());
    if (filtros?.nombre_medico) params = params.set('nombre_medico', filtros.nombre_medico);
    if (filtros?.nombre_paciente) params = params.set('nombre_paciente', filtros.nombre_paciente);
    if (filtros?.estado) params = params.set('estado', filtros.estado);
    if (filtros?.fecha) params = params.set('fecha', filtros.fecha);
    if (filtros?.page) params = params.set('page', filtros.page.toString());

    return this.http.get<CitasListadoResponse>(`${this.apiUrl}/admin/citas`, { params });
  }

  /**
   * Obtiene los huecos disponibles del médico (próximo día con huecos)
   */
  obtenerHuecosMedico(medicoId: number): Observable<HuecosMedicoRespuesta> {
    return this.http.get<HuecosMedicoRespuesta>(
      `${this.apiUrl}/medicos/${medicoId}/citas`
    );
  }
}


