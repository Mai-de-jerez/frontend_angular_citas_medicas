import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service'; 
import { ToastService } from '../../../../core/services/toast.service';
import { Router } from '@angular/router';
import { LoadingService } from '../../../../core/services/loading.service';
import { AuthService } from '../../../auth/services/auth'; 

@Component({
  selector: 'app-actualizar-perfil',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './actualizar-perfil.html',
  styleUrl: './actualizar-perfil.scss',
})
export class ActualizarPerfil implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private router = inject(Router);
  private toastService = inject(ToastService);
  private loadingService = inject(LoadingService);
  private authService = inject(AuthService);
  
  // getter para usar en el HTML
  get cargando(): boolean {
    return this.loadingService.isLoading();
  }
  
  public get esPaciente(): boolean {
    return this.authService.isPaciente();
  }

  form!: FormGroup;
  fotoPreview = signal<string | null>(null);
  fotoSeleccionada: File | null = null;

  private readonly TIPOS_PERMITIDOS = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  private readonly TAMANO_MAXIMO = 2 * 1024 * 1024; // 2MB

  ngOnInit(): void {
    this.initForm();
    this.cargarDatosUsuario();
    this.aplicarValidacionesPorRol();
  }

  private initForm(): void {
    this.form = this.fb.group({
      nombre: ['', [
        Validators.required,
        Validators.minLength(3), 
        Validators.maxLength(100), 
        Validators.pattern(/^[\p{L}\s]+$/u)
      ]],
      apellidos: ['', [
        Validators.required,
        Validators.minLength(3), 
        Validators.maxLength(150), 
        Validators.pattern(/^[\p{L}\s]+$/u)
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      telefono: ['', [
        Validators.required, 
        Validators.pattern(/^[0-9+\-\s]{9,15}$/)
      ]],
      compania: ['', [
        Validators.minLength(3), 
        Validators.maxLength(100)
      ]],
      numero_tarjeta: ['', [ 
        Validators.pattern(/^\d{16}$/)
      ]],
      password:       ['', [
        Validators.minLength(8), 
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
      ]],
      password_confirmation: [''],
    });
  }

  private cargarDatosUsuario(): void {
    this.userService.miPerfil().subscribe({
      next: (usuario) => {
        this.form.patchValue({
          nombre: usuario.nombre,
          apellidos: usuario.apellidos,
          email: usuario.email,
          telefono: usuario.telefono,
          compania: usuario.paciente?.compania,
          numero_tarjeta: usuario.paciente?.numero_tarjeta,
        });
        if (usuario.foto_url) this.fotoPreview.set(usuario.foto_url);
      }
    });
  }

  private aplicarValidacionesPorRol(): void {
    const esPaciente = this.authService.isPaciente();

    if (esPaciente) {
      this.form.get('compania')?.setValidators([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]);
      this.form.get('numero_tarjeta')?.setValidators([
        Validators.required,
        Validators.pattern(/^\d{16}$/)
      ]);
    } else {
      this.form.get('compania')?.setValidators([
        Validators.minLength(3),
        Validators.maxLength(100)
      ]);
      this.form.get('numero_tarjeta')?.setValidators([
        Validators.pattern(/^\d{16}$/)
      ]);
    }

    this.form.get('compania')?.updateValueAndValidity();
    this.form.get('numero_tarjeta')?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loadingService.show();
    const formData = new FormData();

    Object.keys(this.form.controls).forEach(key => {
      if (!this.authService.isPaciente() && (key === 'compania' || key === 'numero_tarjeta')) {
        return;
      }
      const valor = this.form.get(key)?.value;
      if (valor) formData.append(key, valor);
    });

    if (this.fotoSeleccionada) formData.append('foto', this.fotoSeleccionada);

    this.userService.actualizarPerfil(formData).subscribe({
      next: (res) => {
        this.toastService.success(res.mensaje);
        this.loadingService.hide();
        this.router.navigate(['/mi-perfil']);
      },
      error: () => {
        this.loadingService.hide();
        this.toastService.error('Error al actualizar el perfil. Inténtalo de nuevo.');
      }
    }); 
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

  onCancelar(): void {
    this.router.navigate(['/mi-perfil']); 
  }
}
