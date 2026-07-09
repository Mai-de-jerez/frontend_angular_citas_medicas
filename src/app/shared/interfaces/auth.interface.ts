// app/shared/interfaces/auth.interface.ts
import { Usuario } from "./usuario.interface";

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
  foto?: File;
  numero_tarjeta: string;
  compania: string;
}

export interface RecuperarPasswordRequest {
  email: string;
}

export interface RestablecerPasswordRequest {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}


export interface AuthResponse {
  mensaje: string;
  token: string;
  usuario: Usuario;
}

export interface MensajeResponse {
  mensaje: string;
}







