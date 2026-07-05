import { Routes } from '@angular/router';
import { AdminDashboard } from './../admin-dashboard/admin-dashboard';
import { AdminLayout } from '../layout/admin-layout/admin-layout';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayout,  
    children: [
      {
        path: '',
        component: AdminDashboard
      },
      {
        path: 'usuarios',
        loadComponent: () => import('./../users/lista-usuarios/lista-usuarios')
          .then(m => m.ListaUsuarios)
      }
    ]
  }
];