import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';
import { Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {

      if (error.status === 401) {
        const mensaje401 = error.error?.mensaje || 'Sesión expirada o no autorizado';        
        toastService.error(mensaje401); 
        sessionStorage.clear();      
        router.navigate(['/auth/login']); 
        
        return throwError(() => error);
      }

      let mensaje = 'Ha ocurrido un error inesperado';

      if (error.error?.errores) {
        const errores = error.error.errores;
        mensaje = Object.values(errores).flat().join(', ');
      } else if (error.error?.mensaje) {
        mensaje = error.error.mensaje;
      } else {
        switch (error.status) {
          case 0:   mensaje = 'Sin conexión al servidor'; break;
          case 403: mensaje = 'Acceso denegado'; break;
          case 404: mensaje = 'Recurso no encontrado'; break;
          case 500: mensaje = 'Error interno del servidor'; break;
        }
      }

      toastService.error(mensaje);
      return throwError(() => error);
    })
  );
};