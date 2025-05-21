import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard } from './guards/notauth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  // solo se muestra cuando no estoy autenticado
  {
    path: 'inicio',
    loadChildren: () => import('./pages/inicio/inicio.module').then( m => m.InicioPageModule),
    canActivate: [NotAuthGuard]
  },
  // se muestra con autenticación o sin autenticación
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule),
  },
  {
    path: 'nuevos',
    loadChildren: () => import('./pages/nuevos/nuevos.module').then( m => m.NuevosPageModule),
  },
  {
    path: 'seminuevos',
    loadChildren: () => import('./pages/seminuevos/seminuevos.module').then( m => m.SeminuevosPageModule),
  },
  // solo se muestra autenticado
  {
    path: 'faviritos',
    loadChildren: () => import('./pages/faviritos/faviritos.module').then( m => m.FaviritosPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'mensajes',
    loadChildren: () => import('./pages/mensajes/mensajes.module').then( m => m.MensajesPageModule),
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
