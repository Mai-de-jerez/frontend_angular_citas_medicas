export interface Especialidad {
  id: number;
  nombre: string;
  descripcion?: string;
}

export interface EspecialidadesResponse {
  especialidades: Especialidad[];
}

export interface MedicoPorEspecialidadResponse {
  especialidad: {
    id: number;
    nombre: string;
  };
  medicos: {
    id: number;
    nombre_completo: string;
  }[];
}