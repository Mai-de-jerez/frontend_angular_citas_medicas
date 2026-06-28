import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './features/auth/layout/auth-layout/auth-layout';
import { PublicLayout } from './features/public/layout/public-layout/public-layout';

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
        loadComponent: () => import('./features/public/components/home/home').then(m => m.Home)
      }
    ]
  }
];