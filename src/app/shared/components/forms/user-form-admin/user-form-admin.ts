// app/shared/components/forms/user-form-admin/user-form-admin.ts
import { Component, input, output, signal, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../../core/services/toast.service';
import { EspecialidadService } from '../../../../features/especialidad/services/especialidad';
import { Especialidad, Usuario } from '../../../interfaces/usuario.interface';

@Component({
  selector: 'app-user-form-admin',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form-admin.html',
  styleUrl: './user-form-admin.scss',
})
export class UserFormAdmin implements OnInit {
  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);
  private especialidadService = inject(EspecialidadService);

  // inputs
  usuario = input<Usuario | null>(null); // Si viene, estamos en modo edición
  cargando = input<boolean>(false);
  textoBoton = input<string>('Crear usuario');

  // outputs
  formSubmit = output<FormData>();
  cancelar = output<void>();

  // estado interno
  fotoPreview = signal<string | null>(null);
  fotoSeleccionada: File | null = null;
  especialidades = signal<Especialidad[]>([]);
  esEdicion = signal<boolean>(false);

  private readonly TIPOS_PERMITIDOS = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  private readonly TAMANO_MAXIMO = 2 * 1024 * 1024;

  // formulario
  form: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100), Validators.pattern(/^[\p{L}\s]+$/u)]],
    apellidos: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150), Validators.pattern(/^[\p{L}\s]+$/u)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)]],
    password_confirmation: [''],
    telefono: [''],
    rol: ['paciente', [Validators.required]],
    activo: [true],
    // Campos condicionales
    compania: ['', [Validators.minLength(3), Validators.maxLength(100)]],
    numero_tarjeta: ['', [Validators.pattern(/^\d{16}$/)]],
    numero_colegiado: [''],
    id_especialidad: [''],
  }, { validators: this.passwordsCoinciden });

  private passwordsCoinciden(group: AbstractControl) {
    const pass = group.get('password')?.value;
    const confirm = group.get('password_confirmation')?.value;
    if (!pass && !confirm) return null; // Si ambos están vacíos, no hay error
    return pass === confirm ? null : { passwordMismatch: true };
  }

  ngOnInit(): void {
    // Cargar especialidades (siempre porque es admin)
    this.cargarEspecialidades();

    // Si hay usuario, es modo edición
    if (this.usuario()) {
      this.esEdicion.set(true);
      this.cargarUsuario();
    }

    // Validaciones dinámicas según rol
    this.actualizarValidaciones(this.form.get('rol')?.value || 'paciente');
    this.form.get('rol')?.valueChanges.subscribe((rol) => {
      this.actualizarValidaciones(rol);
    });
  }

  cargarEspecialidades(): void {
    this.especialidadService.listar().subscribe({
      next: (data) => this.especialidades.set(data || []),
      error: () => {
        this.especialidades.set([]);
        this.toastService.error('Error al cargar especialidades');
      }
    });
  }

  cargarUsuario(): void {
    const u = this.usuario();
    if (!u) return;

    // Rellenar formulario
    this.form.patchValue({
      nombre: u.nombre,
      apellidos: u.apellidos,
      email: u.email,
      telefono: u.telefono,
      rol: u.rol,
      activo: u.activo,
      numero_tarjeta: u.paciente?.numero_tarjeta || '',
      compania: u.paciente?.compania || '',
      numero_colegiado: u.medico?.numero_colegiado || '',
      id_especialidad: u.medico?.especialidad?.id || '',
    });

    // Si tiene foto, mostrar preview
    if (u.foto_url) {
      this.fotoPreview.set(u.foto_url);
    }
  }

  private actualizarValidaciones(rol: string): void {
    this.form.get('compania')?.clearValidators();
    this.form.get('numero_tarjeta')?.clearValidators();
    this.form.get('numero_colegiado')?.clearValidators();
    this.form.get('id_especialidad')?.clearValidators();

    if (rol === 'paciente') {
      this.form.get('compania')?.setValidators([Validators.required, Validators.minLength(3), Validators.maxLength(100)]);
      this.form.get('numero_tarjeta')?.setValidators([Validators.required, Validators.pattern(/^\d{16}$/)]);
    }

    if (rol === 'medico') {
      this.form.get('numero_colegiado')?.setValidators([Validators.required]);
      this.form.get('id_especialidad')?.setValidators([Validators.required]);
    }

    this.form.get('compania')?.updateValueAndValidity();
    this.form.get('numero_tarjeta')?.updateValueAndValidity();
    this.form.get('numero_colegiado')?.updateValueAndValidity();
    this.form.get('id_especialidad')?.updateValueAndValidity();
  }

  onFotoChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || !input.files[0]) return;

    const file = input.files[0];

    if (!this.TIPOS_PERMITIDOS.includes(file.type)) {
      this.toastService.error('Formato no permitido. Usa jpeg, jpg, png o webp');
      input.value = '';
      return;
    }

    if (file.size > this.TAMANO_MAXIMO) {
      this.toastService.error('La imagen no puede superar los 2MB');
      input.value = '';
      return;
    }

    this.fotoSeleccionada = file;
    const reader = new FileReader();
    reader.onload = (e) => this.fotoPreview.set(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    const v = this.form.value;

    // Campos comunes
    formData.append('nombre', v.nombre);
    formData.append('apellidos', v.apellidos);
    formData.append('email', v.email);
    formData.append('rol', v.rol);
    formData.append('activo', v.activo ? '1' : '0');
    if (v.telefono) formData.append('telefono', v.telefono);

    // Contraseña (solo si se ha rellenado)
    if (v.password) {
      formData.append('password', v.password);
      formData.append('password_confirmation', v.password_confirmation);
    }

    // Paciente
    if (v.rol === 'paciente') {
      formData.append('numero_tarjeta', v.numero_tarjeta);
      formData.append('compania', v.compania);
    }

    // Médico
    if (v.rol === 'medico') {
      formData.append('numero_colegiado', v.numero_colegiado);
      formData.append('id_especialidad', v.id_especialidad);
    }

    if (this.fotoSeleccionada) {
      formData.append('foto', this.fotoSeleccionada);
    }

    this.formSubmit.emit(formData);
  }
}
