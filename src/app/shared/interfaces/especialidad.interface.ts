export interface Especialidad {
  id: number;
  nombre: string;
  descripcion?: string;
}

export interface EspecialidadesResponse {
  especialidades: Especialidad[];
}