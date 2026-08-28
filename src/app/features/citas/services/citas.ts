import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CitasListadoResponse } from '../../../shared/interfaces/cita.interface';

@Injectable({
  providedIn: 'root',
})
export class CitasService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  listarCitas(filtros?: {
    id?: number;
    id_medico?: number;
    id_paciente?: number;
    estado?: string;
    fecha?: string;
    page?: number;
  }): Observable<CitasListadoResponse> {
    let params = new HttpParams();

    if (filtros?.id) params = params.set('id', filtros.id.toString());
    if (filtros?.id_medico) params = params.set('id_medico', filtros.id_medico.toString());
    if (filtros?.id_paciente) params = params.set('id_paciente', filtros.id_paciente.toString());
    if (filtros?.estado) params = params.set('estado', filtros.estado);
    if (filtros?.fecha) params = params.set('fecha', filtros.fecha);
    if (filtros?.page) params = params.set('page', filtros.page.toString());

    return this.http.get<CitasListadoResponse>(`${this.apiUrl}/admin/citas`, { params });
  }
}


