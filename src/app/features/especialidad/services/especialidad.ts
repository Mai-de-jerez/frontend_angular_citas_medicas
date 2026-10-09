import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { Especialidad } from '../../../shared/interfaces/especialidad.interface';

@Injectable({
  providedIn: 'root',
})
export class EspecialidadService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  /**
   * Listar todas las especialidades
   */
  listar(): Observable<Especialidad[]> {
    return this.http.get<{ especialidades: Especialidad[] }>(`${this.apiUrl}/especialidades`)
      .pipe(map(resp => resp.especialidades));
  }
}
