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
  {
    path: 'inicio',
    loadChildren: () => import('./pages/inicio/inicio.module').then( m => m.InicioPageModule),
    canActivate: [NotAuthGuard]
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule),
  },
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
  {
    path: 'nuevos',
    loadChildren: () => import('./pages/nuevos/nuevos.module').then( m => m.NuevosPageModule),
  },
  {
    path: 'seminuevos',
    loadChildren: () => import('./pages/seminuevos/seminuevos.module').then( m => m.SeminuevosPageModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
