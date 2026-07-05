// shared/components/paginador/paginador.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-paginador',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paginador.html',
  styleUrl: './paginador.scss',
})
export class Paginador {
  @Input() paginaActual: number = 1;
  @Input() ultimaPagina: number = 1;
  @Input() total: number = 0;
  @Input() porPagina: number = 15;
  @Output() cambiarPagina = new EventEmitter<number>();

  get ultimoItem(): number {
    return Math.min(this.paginaActual * this.porPagina, this.total);
  }

  get paginas(): number[] {
    const total = this.ultimaPagina;
    const actual = this.paginaActual;
    const paginas: number[] = [];

    if (total <= 5) {
      for (let i = 1; i <= total; i++) {
        paginas.push(i);
      }
    } else {
      paginas.push(1);
      if (actual > 3) paginas.push(-1);
      
      for (let i = Math.max(2, actual - 1); i <= Math.min(total - 1, actual + 1); i++) {
        if (i > 1 && i < total) paginas.push(i);
      }
      
      if (actual < total - 2) paginas.push(-1);
      if (total > 1) paginas.push(total);
    }

    return paginas;
  }

  irAPagina(pagina: number): void {
    if (pagina < 1 || pagina > this.ultimaPagina) return;
    this.cambiarPagina.emit(pagina);
  }
}