import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { Especialidad, MedicoPorEspecialidadResponse } from '../../../shared/interfaces/especialidad.interface';

@Injectable({
  providedIn: 'root',
})
export class EspecialidadService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  listar(): Observable<Especialidad[]> {
    return this.http.get<{ especialidades: Especialidad[] }>(`${this.apiUrl}/especialidades`)
      .pipe(map(resp => resp.especialidades));
  }

  listarMedicosPorEspecialidad(id: number): Observable<MedicoPorEspecialidadResponse> {
    return this.http.get<MedicoPorEspecialidadResponse>(`${this.apiUrl}/especialidades/${id}/medicos`);
  }
}
