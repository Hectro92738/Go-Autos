import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';
// importamos el componente de splash
import { BienvenidaComponent } from '../../components/bienvenida/bienvenida.component';
// importamos la navbar
import { NavbarComponent } from '../../components/navbar/navbar.component';

import { HomePage } from './home.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    BienvenidaComponent,
    NavbarComponent,
  ],
  declarations: [HomePage],
})
export class HomePageModule {}
