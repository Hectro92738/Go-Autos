import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InicioPageRoutingModule } from './inicio-routing.module';
// importamos el componente de splash
import { BienvenidaComponent } from '../../components/bienvenida/bienvenida.component';
// importamos el componente de login
import { LoginComponent } from '../../components/login/login.component';
// importamos la navbar
import { NavbarComponent } from '../../components/navbar/navbar.component';
// importamos
import { TabsComponent } from '../../components/tabs/tabs.component';
// importamos
import { MenulateralComponent } from '../../components/menulateral/menulateral.component';

import { InicioPage } from './inicio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InicioPageRoutingModule,
    BienvenidaComponent,
    LoginComponent,
    NavbarComponent,
    TabsComponent,
    MenulateralComponent,
  ],
  declarations: [InicioPage]
})
export class InicioPageModule {}
