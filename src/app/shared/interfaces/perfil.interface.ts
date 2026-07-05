// src/app/shared/interfaces/perfil.interface.ts
import { Usuario } from "./usuario.interface";

export interface PerfilResponse {
  usuario: Usuario;
}

export interface PerfilUpdateResponse {
  mensaje: string;
  usuario: Usuario;
}





