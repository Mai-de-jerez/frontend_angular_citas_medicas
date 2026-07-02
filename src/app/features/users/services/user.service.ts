// src/app/features/user/services/user.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment.development';
import { PerfilResponse, PerfilUsuario } from '../../../shared/interfaces/perfil.interface';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  miPerfil(): Observable<PerfilUsuario> { 
    return this.http.get<PerfilResponse>(`${this.apiUrl}/mi-perfil`).pipe(
      map(res => res.data) 
    );
  }

  actualizarPerfil(formData: FormData): Observable<PerfilUsuario> {
    return this.http.post<PerfilResponse>(`${this.apiUrl}/actualizar-perfil`, formData).pipe(
      map(res => res.data)
    );
  }
}