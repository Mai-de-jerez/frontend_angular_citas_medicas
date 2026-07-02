// app/shared/interfaces/auth.interface.ts
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nombre: string;
  apellidos: string;
  email: string;
  password: string;
  password_confirmation: string;
  telefono?: string;
}

export interface RecuperarPasswordRequest {
  email: string;
}

export interface RestablecerPasswordRequest {
  token: string;
  password: string;
  password_confirmation: string;
}

export interface Usuario {
  id: number;
  nombre: string;
  apellidos: string;
  email: string;
  telefono?: string;
  //foto?: string;
  rol: 'admin' | 'medico' | 'paciente';
  activo: boolean;
}

export interface AuthResponse {
  mensaje: string;
  token: string;
  usuario: Usuario;
}







