import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InicioPageRoutingModule } from './inicio-routing.module';
// importamos la navbar
import { NavbarComponent } from '../../components/navbar/navbar.component';
// importamos el componente de login
import { LoginComponent } from '../../components/login/login.component';
// importamos el componente de registro
import { RegistroComponent } from '../../components/registro/registro.component';

import { InicioPage } from './inicio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InicioPageRoutingModule,
    LoginComponent,
    NavbarComponent,
    RegistroComponent
  ],
  declarations: [InicioPage]
})
export class InicioPageModule {}
