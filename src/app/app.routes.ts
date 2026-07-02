import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './features/auth/layout/auth-layout/auth-layout';
import { PublicLayout } from './core/layout/public-layout/public-layout';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/components/login/login').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/components/register/register').then(m => m.RegisterComponent)
      },
      {
        path: 'recuperar-password',
        loadComponent: () => import('./features/auth/components/recuperar-password/recuperar-password').then(m => m.RecuperarPasswordComponent)
      },
      {
        path: 'restablecer-password',
        loadComponent: () => import('./features/auth/components/restablecer-password/restablecer-password').then(m => m.RestablecerPasswordComponent)
      }
    ]
  },
  {
    path: '',
    component: PublicLayout,
    children: [
      {
        path: '',
        loadComponent: () => import('./core/components/home/home').then(m => m.Home)
      },
      {
        path: 'contacto',
        loadComponent: () => import('./core/components/contacto/contacto').then(m => m.Contacto)
      },
      {
        path: 'mi-perfil',
        loadComponent: () => import('./features/users/components/perfil-usuario/perfil-usuario.component').then(m => m.PerfilUsuarioComponent),
        canActivate: [authGuard]
      },
      {
        path: 'actualizar-perfil',
        loadComponent: () => import('./features/users/components/actualizar-perfil/actualizar-perfil').then(m => m.ActualizarPerfil),
        canActivate: [authGuard]
      },
      {
        path: 'mis-citas', 
        loadComponent: () => import('./features/users/components/mis-citas/mis-citas').then(m => m.MisCitasComponent),
        canActivate: [authGuard]
      }
    ]
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/routes/admin.routes').then(m => m.ADMIN_ROUTES),
    // canActivate: [adminGuard] // Cuando lo tengas, descomenta esto
  }
];
