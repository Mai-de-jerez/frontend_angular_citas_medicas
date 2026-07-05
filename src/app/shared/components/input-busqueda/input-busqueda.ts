// shared/components/input-busqueda/input-busqueda.ts
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-busqueda',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './input-busqueda.html',
  styleUrl: './input-busqueda.scss',
})
export class InputBusqueda {
  @Input() label: string = '';
  @Input() placeholder: string = 'Buscar...';
  @Input() value: string = '';
  @Output() valueChange = new EventEmitter<string>();
  @Output() buscar = new EventEmitter<string>();

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.value = value;
    this.valueChange.emit(value);
    this.buscar.emit(value);
  }
}
