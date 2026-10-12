import { Medico } from "./usuario.interface";

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
  centro: {                        
    id: number;
    nombre: string;
  } | null;
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


// para la respuesta de obtener huecos del médico
export interface DiaConHuecos {
  fecha: string;
  huecos: string[];
}

export interface HuecosMedicoRespuesta {
  medico: Medico;
  dias: DiaConHuecos[];
}