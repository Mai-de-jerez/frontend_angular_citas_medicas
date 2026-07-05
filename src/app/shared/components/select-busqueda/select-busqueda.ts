// select-busqueda.ts (sin cambios necesarios en el .ts, solo el HTML cambia)
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface SelectOption {
  value: any;
  label: string;
}

@Component({
  selector: 'app-select-busqueda',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './select-busqueda.html',
  styleUrl: './select-busqueda.scss',
})
export class SelectBusqueda {
  @Input() placeholder: string = 'Seleccionar...';
  @Input() opciones: SelectOption[] = [];
  @Input() value: any = '';
  @Output() valueChange = new EventEmitter<any>();
  @Output() seleccion = new EventEmitter<any>();

  onCambio(): void {
    this.valueChange.emit(this.value);
    this.seleccion.emit(this.value);
  }
}
