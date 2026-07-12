// src/app/shared/interfaces/horario.interface.ts
export interface Horario {
  id: number;
  id_medico: number;
  dia_semana: string;
  hora_inicio: string; // "09:00"
  hora_fin: string; // "14:00"
}

export interface HorarioResponse {
  horarios: Horario[];
}