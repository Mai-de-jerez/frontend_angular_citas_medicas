import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth';
import { LoadingService } from '../../../../core/services/loading.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-restablecer-password',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './restablecer-password.html',
  styleUrl: './restablecer-password.scss',
})
export class RestablecerPasswordComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  protected readonly loadingService = inject(LoadingService);
  private readonly toastService = inject(ToastService);

  form!: FormGroup;
  private token: string = '';
  private email: string = '';

  ngOnInit(): void {
    // Pillamos el token que viene en la URL (?token=xxxx)
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    this.email = this.route.snapshot.queryParamMap.get('email') || '';

    if (!this.token || !this.email) {
      this.toastService.error('Falta el token de recuperación o no es válido.');
      this.router.navigate(['/auth/login']);
      return;
    }

    // Inicializamos el formulario con la validación de coincidencia
    this.form = this.fb.group({
        password: ['', [
          Validators.required, 
          Validators.minLength(8),
          // Validators.pattern(/(?=.*[a-z])(?=.*[A-Z])/), 
          // Validators.pattern(/(?=.*\d)/) 
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)              
        ]],
        password_confirmation: ['', [Validators.required]]
      }, { validators: this.passwordMatchValidator });
    }

  // Validador personalizado para asegurar que repitió bien la contraseña
  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmation = control.get('password_confirmation')?.value;
    return password === confirmation ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loadingService.show();

    const payload = {
      token: this.token,
      email: this.email,
      password: this.form.value.password,
      password_confirmation: this.form.value.password_confirmation
    };

    this.authService.restablecerPassword(payload).subscribe({
      next: (res) => {
        this.loadingService.hide();
        this.toastService.success(res.mensaje);
        this.router.navigate(['/auth/login']);
      },
      error: () => {
        this.loadingService.hide();
        this.toastService.error('No se pudo restablecer la contraseña.');
      }
    });
  }
}