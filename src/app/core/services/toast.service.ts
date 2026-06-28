import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  mensaje: string;
  tipo: 'success' | 'error' | 'info' | 'warning';
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  public toasts = signal<Toast[]>([]);
  private contador = 0;

  private agregar(mensaje: string, tipo: Toast['tipo']): void {
    const id = ++this.contador;
    this.toasts.update(t => [...t, { id, mensaje, tipo }]);
    setTimeout(() => this.eliminar(id), 4000);
  }

  eliminar(id: number): void {
    this.toasts.update(t => t.filter(toast => toast.id !== id));
  }

  success(mensaje: string): void { this.agregar(mensaje, 'success'); }
  error(mensaje: string): void { this.agregar(mensaje, 'error'); }
  info(mensaje: string): void { this.agregar(mensaje, 'info'); }
  warning(mensaje: string): void { this.agregar(mensaje, 'warning'); }
}