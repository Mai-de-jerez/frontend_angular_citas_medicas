import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth'; 

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Comprobamos si el usuario tiene un token válido
  if (authService.isLogged()) {
    return true;
  }

  // Si no está logueado, lo mandamos al login y bloqueamos la carga de la ruta
  router.navigate(['/auth/login']);
  return false;
};