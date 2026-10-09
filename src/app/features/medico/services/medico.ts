import { Injectable, inject } from '@angular/core';
import { MedicosResponse } from '../../../shared/interfaces/usuario.interface';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
                                           
@Injectable({ providedIn: 'root' })

export class MedicoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  listar(filtros?: { idEspecialidad?: number; idCentro?: number }): Observable<MedicosResponse> {
    let params = new HttpParams();

    if (filtros?.idEspecialidad) {
      params = params.set('id_especialidad', filtros.idEspecialidad.toString());
    }
    if (filtros?.idCentro) {
      params = params.set('id_centro', filtros.idCentro.toString());
    }

    return this.http.get<MedicosResponse>(`${this.apiUrl}/medicos`, { params });
  }
}