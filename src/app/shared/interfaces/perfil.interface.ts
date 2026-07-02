// src/app/shared/interfaces/perfil.interface.ts

export interface PerfilPaciente {
  id: number;
  numero_tarjeta: string;
  compania: string;
}

export interface PerfilMedico {
  id: number;
  numero_colegiado: string;
  especialidad: {
    id: number;
    nombre: string;
  };
}

export interface PerfilUsuario {
  id: number;
  nombre: string;
  apellidos: string;
  email: string;
  telefono?: string;
  foto_url?: string;
  rol: 'admin' | 'medico' | 'paciente';
  activo: boolean;
  paciente?: PerfilPaciente;
  medico?: PerfilMedico;
}

export interface PerfilResponse {
  data: PerfilUsuario;
}





