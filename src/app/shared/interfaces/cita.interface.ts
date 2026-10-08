export interface Cita {
  id: number;
  paciente: {
    id: number;
    nombre_completo: string;
  };
  medico: {
    id: number;
    nombre_completo: string;
  };
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

export interface HuecosMedicoRespuesta {
  medico: {
    id: number;
    nombre_completo: string;
  };
  fecha: string | null;
  huecos_disponibles: string[];
}