// src/app/shared/interfaces/usuario.interface.ts
import { Especialidad } from "./especialidad.interface";
import { Centro } from "./centro.interface";  

export interface Usuario {
  id: number;
  nombre: string;
  apellidos: string;
  email: string;
  telefono?: string;
  foto_url?: string;
  rol: 'admin' | 'medico' | 'paciente';
  activo: boolean;
  paciente?: Paciente;
  medico?: Medico;
}

export interface UsuarioListado {
  id: number;
  nombre: string;
  apellidos: string;
  email: string;
  rol: 'admin' | 'medico' | 'paciente';
  activo: boolean;
  fecha_creacion: string;
  fecha_modificacion: string;
}

export interface UsuariosListadoResponse {
  usuarios: UsuarioListado[];
  pagina_actual: number;
  ultima_pagina: number;
  por_pagina: number;
  total: number;
}

export interface Paciente {
  id: number;
  numero_tarjeta: string;
  compania: string;
}

export interface Medico {
  id: number;
  nombre_completo: string;
  numero_colegiado: string;
  especialidad: Especialidad;
  id_centro?: number;                                            
  centro?: Centro;
}

export interface MedicosResponse {
  medicos: Medico[];
}
