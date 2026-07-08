// shared/components/user-form/user-form.ts

import { Component, input, output, signal, inject, OnInit, computed } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { ToastService } from '../../../../core/services/toast.service';
import { LoadingService } from '../../../../core/services/loading.service';
import { Usuario } from '../../../interfaces/usuario.interface';

@Component({
  selector: 'app-user-form',
  imports: [ReactiveFormsModule],
  templateUrl: './user-form.html',
  styleUrl: './user-form.scss',
})
export class UserFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);
  protected loadingService = inject(LoadingService);

  // inputs
  textoBoton = input<string>('Registrarse');
  usuario = input<Usuario | null>(null);
  // outputs
  formSubmit = output<FormData>();
  cancelar = output<void>();
  // estado de la foto seleccionada y su preview
  fotoPreview = signal<string | null>(null);
  fotoSeleccionada: File | null = null;
  // computed() property determina si el formulario está en modo edición o creación
  esEdicion = computed(() => !!this.usuario());
  // computed() property determina si el usuario es un paciente
  esPaciente = computed(() => {
    const u = this.usuario();
    return u?.rol === 'paciente';
  });
  // constantes para validación de la foto
  private readonly TIPOS_PERMITIDOS = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  private readonly TAMANO_MAXIMO = 2 * 1024 * 1024;

  // formulario reactivo
  form: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100), Validators.pattern(/^[\p{L}\s]+$/u)]],
    apellidos: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150), Validators.pattern(/^[\p{L}\s]+$/u)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)]],
    password_confirmation: [''],
    telefono: [''],
    compania: ['', [Validators.minLength(3), Validators.maxLength(100)]],
    numero_tarjeta: ['', [Validators.pattern(/^\d{16}$/)]],
  }, { validators: this.passwordsCoinciden });

  private passwordsCoinciden(group: AbstractControl) {
    const pass = group.get('password')?.value;
    const confirm = group.get('password_confirmation')?.value;
    return pass === confirm ? null : { passwordMismatch: true };
  }

  ngOnInit(): void {
    // si es edición, quitamos required de la contraseña
    if (this.esEdicion()) {
      this.form.get('password')?.clearValidators();
      this.form.get('password_confirmation')?.clearValidators();
    } else {
      this.form.get('password')?.setValidators([Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)]);
      this.form.get('password_confirmation')?.setValidators([Validators.required]);
    }

    this.form.get('password')?.updateValueAndValidity();
    this.form.get('password_confirmation')?.updateValueAndValidity();

    if (this.usuario()) {
      this.cargarUsuario();
    }
  }

  cargarUsuario(): void {
    const u = this.usuario();
    if (!u) return;

    this.form.patchValue({
      nombre: u.nombre,
      apellidos: u.apellidos,
      email: u.email,
      telefono: u.telefono,
      compania: u.paciente?.compania || '',
      numero_tarjeta: u.paciente?.numero_tarjeta || '',
    });

    if (this.esPaciente()) {
      this.form.get('compania')?.setValidators([Validators.required, Validators.minLength(3), Validators.maxLength(100)]);
      this.form.get('numero_tarjeta')?.setValidators([Validators.required, Validators.pattern(/^\d{16}$/)]);
    } else {
      this.form.get('compania')?.clearValidators();
      this.form.get('numero_tarjeta')?.clearValidators();
    }

    this.form.get('compania')?.updateValueAndValidity();
    this.form.get('numero_tarjeta')?.updateValueAndValidity();

    if (u.foto_url) {
      this.fotoPreview.set(u.foto_url);
    }
  }


  // función que maneja el cambio de la foto seleccionada
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
    const valores = this.form.value;

    // Campos comunes en todos los usuarios
    formData.append('nombre', valores.nombre);
    formData.append('apellidos', valores.apellidos);
    formData.append('email', valores.email);
    
    // solo agregamos la contraseña si el usuario la ha proporcionado
    if (valores.password) {
      formData.append('password', valores.password);
      formData.append('password_confirmation', valores.password_confirmation);
    }
    if (valores.telefono) formData.append('telefono', valores.telefono);

    // solo para registro de pacientes, agregamos rol y activo
    if (!this.esEdicion()) {
      formData.append('rol', 'paciente');
      formData.append('activo', '1');
    }

    // solo para pacientes, agregamos los campos de la relación con la tabla pacientes
    if (this.esPaciente()) {
      formData.append('numero_tarjeta', valores.numero_tarjeta);
      formData.append('compania', valores.compania);
    }

    if (this.fotoSeleccionada) {
      formData.append('foto', this.fotoSeleccionada);
    }

    this.formSubmit.emit(formData);
  }
}