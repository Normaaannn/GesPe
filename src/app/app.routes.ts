import { Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'home',
    canActivate: [AuthGuard],
    loadComponent: () => import('./pages/home/home.page').then( m => m.HomePage)
  },
  {
    path: 'registro',
    loadComponent: () => import('./pages/registro/registro.page').then( m => m.RegistroPage)
  },
  {
    path: 'pedido-detalle',
    canActivate: [AuthGuard],
    loadComponent: () => import('./pages/home/pedido-detalle/pedido-detalle.page').then( m => m.PedidoDetallePage)
  },
  {
    path: 'clientes',
    canActivate: [AuthGuard],
    loadComponent: () => import('./pages/clientes/clientes.page').then( m => m.ClientesPage)
  },
  {
    path: 'productos',
    canActivate: [AuthGuard],
    loadComponent: () => import('./pages/productos/productos.page').then( m => m.ProductosPage)
  },
  {
    path: 'cliente-detalle',
    canActivate: [AuthGuard],
    loadComponent: () => import('./pages/clientes/cliente-detalle/cliente-detalle.page').then( m => m.ClienteDetallePage)
  },
  {
    path: 'producto-detalle',
    canActivate: [AuthGuard],
    loadComponent: () => import('./pages/productos/producto-detalle/producto-detalle.page').then( m => m.ProductoDetallePage)
  },
  {
    path: 'pedido-add',
    canActivate: [AuthGuard],
    loadComponent: () => import('./pages/home/pedido-add/pedido-add.page').then( m => m.PedidoAddPage)
  },
  {
    path: 'cliente-add',
    canActivate: [AuthGuard],
    loadComponent: () => import('./pages/clientes/cliente-add/cliente-add.page').then( m => m.ClienteAddPage)
  },
  {
    path: 'producto-add',
    canActivate: [AuthGuard],
    loadComponent: () => import('./pages/productos/producto-add/producto-add.page').then( m => m.ProductoAddPage)
  },
  {
    path: 'ajustes',
    loadComponent: () => import('./pages/ajustes/ajustes.page').then( m => m.AjustesPage)
  },
  {
    path: 'cambiar-password',
    loadComponent: () => import('./pages/ajustes/cambiar-password/cambiar-password.page').then( m => m.CambiarPasswordPage)
  },
  {
    path: 'usuarios',
    loadComponent: () => import('./pages/ajustes/usuarios/usuarios.page').then( m => m.UsuariosPage)
  },
  {
    path: 'usuario-detalle',
    loadComponent: () => import('./pages/ajustes/usuarios/usuario-detalle/usuario-detalle.page').then( m => m.UsuarioDetallePage)
  },
  {
    path: 'info-empresa',
    loadComponent: () => import('./pages/ajustes/info-empresa/info-empresa.page').then( m => m.InfoEmpresaPage)
  },
];
