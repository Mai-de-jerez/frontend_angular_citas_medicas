import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CitasService } from '../../../../citas/services/citas';
import { UserService } from '../../../../users/services/user.service';
import { LoadingService } from '../../../../../core/services/loading.service';
import { Cita } from '../../../../../shared/interfaces/cita.interface';
import { InputBusqueda } from '../../../../../shared/components/input-busqueda/input-busqueda';
import { SelectBusqueda } from '../../../../../shared/components/select-busqueda/select-busqueda';
import { Paginador } from '../../../../../shared/components/paginador/paginador';

@Component({
  selector: 'app-lista-citas',
  imports: [CommonModule, DatePipe, InputBusqueda, SelectBusqueda, FormsModule, Paginador],
  templateUrl: './listar-citas.html',
  styleUrl: './listar-citas.scss',
  standalone: true
})
export class ListarCitas implements OnInit, OnDestroy {
  private citasService = inject(CitasService);
  private userService = inject(UserService);
  private router = inject(Router);

  protected loadingService = inject(LoadingService);

  citas = signal<Cita[]>([]);

  filtros = {
    id: '',
    id_paciente: '',
    id_medico: '',
    estado: ''
  };

  estadosOpciones = [
    { value: 'activa', label: 'Activa' },
    { value: 'cancelada', label: 'Cancelada' },
    { value: 'finalizada', label: 'Finalizada' }
  ];

  paginaActual = signal<number>(1);
  ultimaPagina = signal<number>(1);
  total = signal<number>(0);
  porPagina = signal<number>(15);

  ngOnInit(): void {
    this.userService.setBotonAdmin('+ Crear cita', '/admin/citas/crear');
    this.cargarCitas();
  }

  ngOnDestroy(): void {
    this.userService.limpiarBotonAdmin();
  }

  cargarCitas(): void {
    this.citasService.listarCitas({
      id: this.filtros.id ? parseInt(this.filtros.id) : undefined,
      id_paciente: this.filtros.id_paciente ? parseInt(this.filtros.id_paciente) : undefined,
      id_medico: this.filtros.id_medico ? parseInt(this.filtros.id_medico) : undefined,
      estado: this.filtros.estado || undefined,
      page: this.paginaActual()
    }).subscribe({
      next: (response) => {
        this.citas.set(response.citas);
        this.paginaActual.set(response.pagina_actual);
        this.ultimaPagina.set(response.ultima_pagina);
        this.total.set(response.total);
        this.porPagina.set(response.por_pagina);
      }
    });
  }

  aplicarFiltros(): void {
    this.paginaActual.set(1);
    this.cargarCitas();
  }

  cambiarPagina(page: number): void {
    this.paginaActual.set(page);
    this.cargarCitas();
  }

  verCita(id: number): void {
    this.router.navigate(['/admin/citas', id]);
  }
}
