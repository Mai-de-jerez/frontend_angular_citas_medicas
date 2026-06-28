import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth';
import { LoadingService } from '../../../../core/services/loading.service';
import { UserFormComponent } from '../../../../shared/components/user-form/user-form';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ UserFormComponent ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  protected loadingService = inject(LoadingService);

  onCancelar(): void {
    this.router.navigate(['/auth/login']);
  }

  onFormSubmit(formData: FormData): void {
    this.authService.register(formData).subscribe();
  }
}
