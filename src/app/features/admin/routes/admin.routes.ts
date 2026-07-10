import { Routes } from '@angular/router';
import { AdminDashboard } from '../pages/admin-dashboard/admin-dashboard';
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
        loadComponent: () => import('../pages/users/lista-usuarios/lista-usuarios')
          .then(m => m.ListaUsuarios)
      },
      {
        path: 'usuarios/crear',
        loadComponent: () => import('../pages/users/crear-usuario/crear-usuario')
          .then(m => m.CrearUsuario)
      },
      {
        path: 'usuarios/:id',
        loadComponent: () => import('../pages/users/detalle-usuario/detalle-usuario')
          .then(m => m.DetalleUsuario)
      },
      {
        path: 'usuarios/editar/:id',
        loadComponent: () => import('../pages/users/editar-usuario/editar-usuario')
          .then(m => m.EditarUsuario)  
      }
    ]
  }
];