import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { Especialidad } from '../../../shared/interfaces/usuario.interface';

@Injectable({
  providedIn: 'root',
})


export class EspecialidadService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  listar(): Observable<Especialidad[]> {
    return this.http.get<Especialidad[]>(`${this.apiUrl}/especialidades`);
  }
}
