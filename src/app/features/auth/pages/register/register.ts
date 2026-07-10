import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth';
import { UserFormComponent } from '../../../../shared/components/forms/user-form/user-form';
import { Router } from '@angular/router';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-register',
  imports: [ UserFormComponent ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  onCancelar(): void {
    this.router.navigate(['/auth/login']);
  }

   onFormSubmit(formData: FormData): void {
    this.authService.register(formData).subscribe({
      next: (res) => {
        this.toastService.success(res.mensaje);
      }
    });
  }
}

