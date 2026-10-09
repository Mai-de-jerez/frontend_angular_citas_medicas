import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CentrosListadoResponse } from '../../../shared/interfaces/centro.interface';

@Injectable({
  providedIn: 'root',
})
export class CentroService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  /**
   * Lista todos los centros (id + nombre para selects).
   */
  listar(): Observable<CentrosListadoResponse> {
    return this.http.get<CentrosListadoResponse>(`${this.apiUrl}/centros`);
  }
}
