import { inject, Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import {
  AuthResponse,
  LoginRequest,
  RecuperarPasswordRequest,
  RestablecerPasswordRequest,
  Usuario
} from '../../../shared/interfaces/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly apiUrl = environment.apiUrl;

  // Estado privado
  #isLogged = signal<boolean>(false);
  #usuario = signal<Usuario | null>(null);

  // Exposición readonly
  public isLogged = this.#isLogged.asReadonly();
  public usuario = this.#usuario.asReadonly();

  // Computed
  public isAdmin = computed(() => this.#usuario()?.rol === 'admin');
  public isMedico = computed(() => this.#usuario()?.rol === 'medico');
  public isPaciente = computed(() => this.#usuario()?.rol === 'paciente');

  constructor() {
    this.initAuth();
  }

  private initAuth(): void {
    const token = sessionStorage.getItem('token');
    const usuarioJson = sessionStorage.getItem('usuario');

    if (token && usuarioJson) {
      this.#isLogged.set(true);
      this.#usuario.set(JSON.parse(usuarioJson));
    }
  }

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  private guardarSesion(res: AuthResponse): void {
    sessionStorage.setItem('token', res.token);
    sessionStorage.setItem('usuario', JSON.stringify(res.usuario));
    this.#isLogged.set(true);
    this.#usuario.set(res.usuario);
  }

  private limpiarSesion(): void {
    sessionStorage.clear();
    this.#isLogged.set(false);
    this.#usuario.set(null);
  }

  private redirigirSegunRol(): void {
    const rol = this.#usuario()?.rol;
    if (rol === 'admin') this.router.navigate(['/admin']);
    else if (rol === 'medico') this.router.navigate(['/medico']);
    else this.router.navigate(['/']);
  }

  register(formData: FormData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, formData).pipe(
      tap(res => {
        this.guardarSesion(res);
        this.redirigirSegunRol();
      })
    );
  }

  login(datos: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, datos).pipe(
      tap(res => {
        this.guardarSesion(res);
        this.redirigirSegunRol();
      })
    );
  }

  logout(): void {
    this.http.post(`${this.apiUrl}/logout`, {}).subscribe({
      next: () => {
        this.limpiarSesion();
        this.router.navigate(['/auth/login']);
      },
      error: () => {
        this.limpiarSesion();
        this.router.navigate(['/auth/login']);
      }
    });
  }

  recuperarPassword(datos: RecuperarPasswordRequest): Observable<{ mensaje: string }> {
    return this.http.post<{ mensaje: string }>(`${this.apiUrl}/recuperar-password`, datos);
  }

  restablecerPassword(datos: RestablecerPasswordRequest): Observable<{ mensaje: string }> {
    return this.http.post<{ mensaje: string }>(`${this.apiUrl}/restablecer-password`, datos);
  }
}