import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let mensaje = 'Ha ocurrido un error inesperado';

      if (error.error?.mensaje) {
        mensaje = error.error.mensaje;
      } else if (error.error?.errores) {
        const errores = error.error.errores;
        mensaje = Object.values(errores).flat().join(', ');
      } else {
        switch (error.status) {
          case 0:    mensaje = 'Sin conexión al servidor'; break;
          case 401:  mensaje = 'No autorizado'; break;
          case 403:  mensaje = 'Acceso denegado'; break;
          case 404:  mensaje = 'Recurso no encontrado'; break;
          case 422:  mensaje = 'Error de validación'; break;
          case 500:  mensaje = 'Error interno del servidor'; break;
        }
      }

      toastService.error(mensaje);
      return throwError(() => error);
    })
  );
};