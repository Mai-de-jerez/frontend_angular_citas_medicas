import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service'; // Ajusta la ruta
import { ToastService } from '../../../../core/services/toast.service';
import { Router } from '@angular/router';
import { LoadingService } from '../../../../core/services/loading.service';

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
  
  // getter para usar en el HTML
  get cargando(): boolean {
    return this.loadingService.isLoading();
  }

  form!: FormGroup;
  fotoPreview = signal<string | null>(null);
  fotoSeleccionada: File | null = null;

  private readonly TIPOS_PERMITIDOS = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  private readonly TAMANO_MAXIMO = 2 * 1024 * 1024; // 2MB

  ngOnInit(): void {
    this.initForm();
    this.cargarDatosUsuario();
  }

  private initForm(): void {
    // Al ser edición, los campos ya no son required obligatoriamente si no cambian
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
        Validators.required, 
        Validators.minLength(3), 
        Validators.maxLength(100)
      ]],
      numero_tarjeta: ['', [
        Validators.required, // ← AÑADIDO
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

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loadingService.show();
    const formData = new FormData();

    Object.keys(this.form.controls).forEach(key => {
      const valor = this.form.get(key)?.value;
      if (valor) formData.append(key, valor);
    });

    if (this.fotoSeleccionada) formData.append('foto', this.fotoSeleccionada);

    this.userService.actualizarPerfil(formData).subscribe({
      next: () => {
        this.toastService.success('Perfil actualizado correctamente');
        this.loadingService.hide();
        this.router.navigate(['/mi-perfil']); 
      },
      error: () => {
        this.loadingService.hide();

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
