// src/app/features/user/services/user.service.ts

import { Injectable, inject, signal } from '@angular/core';
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

  // Boton dinamico para el layout de admin
  private botonAdminSignal = signal<{ texto: string; ruta: string; mostrar: boolean }>({
    texto: '',
    ruta: '',
    mostrar: false
  });

  botonAdmin = this.botonAdminSignal.asReadonly();

  setBotonAdmin(texto: string, ruta: string): void {
    this.botonAdminSignal.set({ texto, ruta, mostrar: true });
  }

  limpiarBotonAdmin(): void {
    this.botonAdminSignal.set({ texto: '', ruta: '', mostrar: false });
  }

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

  verUsuario(id: number): Observable<{ usuario: Usuario }> {
    return this.http.get<{ usuario: Usuario }>(`${this.apiUrl}/admin/usuarios/${id}`);
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

  crearUsuario(formData: FormData): Observable<{ mensaje: string; usuario: Usuario }> {
    return this.http.post<{ mensaje: string; usuario: Usuario }>(
      `${this.apiUrl}/admin/usuarios`,
      formData
    );
  }
}