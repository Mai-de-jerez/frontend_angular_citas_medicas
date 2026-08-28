export interface Cita {
  id: number;
  id_paciente: number;
  id_medico: number;
  fecha: string;
  hora: string;
  estado: string;
  motivo: string | null;
  notas: string | null;
}

export interface CitasListadoResponse {
  citas: Cita[];
  pagina_actual: number;
  ultima_pagina: number;
  por_pagina: number;
  total: number;
}