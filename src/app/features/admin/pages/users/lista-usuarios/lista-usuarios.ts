import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../../users/services/user.service';
import { LoadingService } from '../../../../../core/services/loading.service';
import { UsuarioListado } from '../../../../../shared/interfaces/usuario.interface';
import { InputBusqueda } from '../../../../../shared/components/input-busqueda/input-busqueda';
import { SelectBusqueda } from '../../../../../shared/components/select-busqueda/select-busqueda';
import { Paginador } from '../../../../../shared/components/paginador/paginador';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-usuarios',
  imports: [CommonModule, InputBusqueda, SelectBusqueda, FormsModule, Paginador],
  templateUrl: './lista-usuarios.html',
  styleUrl: './lista-usuarios.scss',
  standalone: true
})

export class ListaUsuarios implements OnInit {
  private userService = inject(UserService);

  usuarios = signal<UsuarioListado[]>([]);
  protected loadingService = inject(LoadingService);

  private router = inject(Router);

  // filtros de búsqueda
  filtros = {
    id: '',
    nombre: '',
    apellidos: '',
    rol: ''
  };

  // Opciones para el select de roles
  rolesOpciones = [
    { value: 'admin', label: 'Administrador' },
    { value: 'medico', label: 'Médico' },
    { value: 'paciente', label: 'Paciente' },
  ];

  // paginación
  paginaActual = signal<number>(1);
  ultimaPagina = signal<number>(1);
  total = signal<number>(0);
  porPagina = signal<number>(15);

  ngOnInit(): void {
    this.userService.setBotonAdmin('+ Crear usuario', '/admin/usuarios/crear');
    this.cargarUsuarios();
  }

  ngOnDestroy(): void {
    this.userService.limpiarBotonAdmin();
  }

  cargarUsuarios(): void {
    this.userService.listarUsuarios({
      id: this.filtros.id ? parseInt(this.filtros.id) : undefined,
      nombre: this.filtros.nombre || undefined,
      apellidos: this.filtros.apellidos || undefined,
      rol: this.filtros.rol || undefined,
      page: this.paginaActual(), 
    }).subscribe({
      next: (response) => {
        this.usuarios.set(response.usuarios);
        this.paginaActual.set(response.pagina_actual);
        this.ultimaPagina.set(response.ultima_pagina);
        this.total.set(response.total);
        this.porPagina.set(response.por_pagina);
      }
    });
  }

  aplicarFiltros(): void {
    this.paginaActual.set(1); 
    this.cargarUsuarios();
  }

  cambiarPagina(page: number): void {
    this.paginaActual.set(page);
    this.cargarUsuarios();
  }

  verUsuario(id: number): void {
    this.router.navigate(['/admin/usuarios', id]);
  }
}