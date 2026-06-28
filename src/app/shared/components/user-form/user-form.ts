import { Component, input, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { inject } from '@angular/core';

@Component({
  selector: 'app-user-form',
  imports: [ReactiveFormsModule],
  templateUrl: './user-form.html',
  styleUrl: './user-form.scss',
})
export class UserFormComponent {
  private fb = inject(FormBuilder);

  // Inputs
  esAdmin = input<boolean>(false);
  cargando = input<boolean>(false);
  textoBoton = input<string>('Registrarse');

  // Outputs
  formSubmit = output<FormData>();
  cancelar = output<void>();

  fotoPreview = signal<string | null>(null);
  fotoSeleccionada: File | null = null;

  form: FormGroup = this.fb.group({
    nombre:                ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100), Validators.pattern(/^[\p{L}\s]+$/u)]],
    apellidos:             ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150), Validators.pattern(/^[\p{L}\s]+$/u)]],
    email:                 ['', [Validators.required, Validators.email]],
    password:              ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)]],
    password_confirmation: ['', [Validators.required]],
    telefono:              [''],
    rol:                   ['paciente'],
    activo:                [true],
  }, { validators: this.passwordsCoinciden });

  private passwordsCoinciden(group: AbstractControl) {
    const pass = group.get('password')?.value;
    const confirm = group.get('password_confirmation')?.value;
    return pass === confirm ? null : { passwordMismatch: true };
  }

  onFotoChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.fotoSeleccionada = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => this.fotoPreview.set(e.target?.result as string);
      reader.readAsDataURL(this.fotoSeleccionada);
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    const valores = this.form.value;

    formData.append('nombre',                valores.nombre);
    formData.append('apellidos',             valores.apellidos);
    formData.append('email',                 valores.email);
    formData.append('password',              valores.password);
    formData.append('password_confirmation', valores.password_confirmation);
    if (valores.telefono) formData.append('telefono', valores.telefono);
    if (this.esAdmin()) {
      formData.append('rol',    valores.rol);
      formData.append('activo', valores.activo ? '1' : '0');
    }
    if (this.fotoSeleccionada) formData.append('foto', this.fotoSeleccionada);

    this.formSubmit.emit(formData);
  }
}
