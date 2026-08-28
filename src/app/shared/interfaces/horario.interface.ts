// src/app/shared/interfaces/horario.interface.ts
export interface Horario {
  id: number;
  id_medico: number;
  dia_semana: string;
  hora_inicio: string; 
  hora_fin: string; 
}

export interface HorarioResponse {
  horarios: Horario[];
}