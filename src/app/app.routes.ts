import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './features/auth/layout/auth-layout/auth-layout';
import { PublicLayout } from './core/layout/public-layout/public-layout';
import { authGuard } from './features/auth/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/pages/login/login').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/pages/register/register').then(m => m.RegisterComponent)
      },
      {
        path: 'recuperar-password',
        loadComponent: () => import('./features/auth/pages/recuperar-password/recuperar-password').then(m => m.RecuperarPasswordComponent)
      },
      {
        path: 'restablecer-password',
        loadComponent: () => import('./features/auth/pages/restablecer-password/restablecer-password').then(m => m.RestablecerPasswordComponent)
      }
    ]
  },
  {
    path: '',
    component: PublicLayout,
    children: [
      {
        path: '',
        loadComponent: () => import('./core/pages/home/home').then(m => m.Home)
      },
      {
        path: 'contacto',
        loadComponent: () => import('./core/pages/contacto/contacto').then(m => m.Contacto)
      },
      {
        path: 'mi-perfil',
        loadComponent: () => import('./features/users/pages/perfil-usuario/perfil-usuario.component').then(m => m.PerfilUsuarioComponent),
        canActivate: [authGuard]
      },
      {
        path: 'actualizar-perfil',
        loadComponent: () => import('./features/users/pages/actualizar-perfil/actualizar-perfil').then(m => m.ActualizarPerfil),
        canActivate: [authGuard]
      },
      {
        path: 'mis-citas', 
        loadComponent: () => import('./features/users/pages/mis-citas/mis-citas').then(m => m.MisCitasComponent),
        canActivate: [authGuard]
      },
      {
        path: 'mis-horarios',
        loadComponent: () => import('./features/users/pages/mis-horarios/mis-horarios').then(m => m.MisHorariosComponent),
        canActivate: [authGuard]
      },

      // Rutas para la gestión de coger citas por especialidad, centro y médico
      {
        path: 'coger-cita/especialidades',
        loadComponent: () => import('./features/especialidad/pages/listar-especialidades/listar-especialidades').then(m => m.ListarEspecialidadesComponent)
      },
      {
        path: 'coger-cita/centros',
        loadComponent: () => import('./features/centro/pages/listar-centros/listar-centros').then(m => m.ListarCentrosComponent),
        canActivate: [authGuard]
      },
      {
        path: 'coger-cita/medicos',
        loadComponent: () => import('./features/medico/pages/listar-medicos/listar-medicos').then(m => m.ListarMedicosComponent),
        canActivate: [authGuard]
      },
      {
        path: 'coger-cita/medicos/:id/citas',
        loadComponent: () => import('./features/citas/pages/citas-medico/citas-medico').then(m => m.CitasMedicoComponent),
        canActivate: [authGuard]
      },
    ]
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/routes/admin.routes').then(m => m.ADMIN_ROUTES),
    // canActivate: [adminGuard] // guard en proceso
  }
];
