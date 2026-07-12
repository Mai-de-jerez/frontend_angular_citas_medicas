import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Horario, HorarioResponse } from '../../../shared/interfaces/horario.interface';
import { Observable, tap, map } from 'rxjs';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class HorarioService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;
  
  getMisHorarios(): Observable<Horario[]> {
    return this.http.get<{ horarios: Horario[] }>(`${this.apiUrl}/mis-horarios`)
      .pipe(map(resp => resp.horarios));
  }
} 
