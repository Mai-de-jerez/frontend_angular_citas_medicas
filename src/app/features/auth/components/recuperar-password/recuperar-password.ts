import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { LoadingService } from '../../../../core/services/loading.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-recuperar-password',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './recuperar-password.html',
  styleUrl: './recuperar-password.scss',
})
export class RecuperarPasswordComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  protected readonly loadingService = inject(LoadingService);
  private readonly toastService = inject(ToastService);
  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.authService.recuperarPassword({ email: this.form.value.email }).subscribe({
      next: () => {
        this.toastService.success('Si el email introducido existe en nuestro sistema, recibirás un enlace para restablecer tu contraseña.');
        this.form.reset();
      },
      error: (err) => {
        if (err.status === 422) {
          this.form.reset();
          this.toastService.success('Si el email introducido existe en nuestro sistema, recibirás un enlace para restablecer tu contraseña.');
        }
      }
    });
  }
}