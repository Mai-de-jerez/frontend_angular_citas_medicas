// src/app/features/user/services/user.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment.development';
import { PerfilResponse, PerfilUpdateResponse } from '../../../shared/interfaces/perfil.interface';
import { Usuario, UsuariosListadoResponse } from '../../../shared/interfaces/usuario.interface';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  miPerfil(): Observable<Usuario> { 
    return this.http.get<PerfilResponse>(`${this.apiUrl}/mi-perfil`).pipe(
      map(res => res.usuario) 
    );
  }


  actualizarPerfil(formData: FormData): Observable<PerfilUpdateResponse> {
    return this.http.post<PerfilUpdateResponse>(
      `${this.apiUrl}/actualizar-perfil`,
      formData
    );
  }

  listarUsuarios(filtros?: { 
    id?: number;
    rol?: string; 
    nombre?: string; 
    apellidos?: string; 
    page?: number 
    }): Observable<UsuariosListadoResponse> {
    let params = new HttpParams();
    
    if (filtros?.id) params = params.set('id', filtros.id.toString());
    if (filtros?.rol) params = params.set('rol', filtros.rol);
    if (filtros?.nombre) params = params.set('nombre', filtros.nombre);
    if (filtros?.apellidos) params = params.set('apellidos', filtros.apellidos);
    if (filtros?.page) params = params.set('page', filtros.page.toString());
    
    return this.http.get<UsuariosListadoResponse>(`${this.apiUrl}/admin/usuarios`, { params });
  }

}