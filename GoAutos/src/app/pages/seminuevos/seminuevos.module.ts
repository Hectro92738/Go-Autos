import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SeminuevosPageRoutingModule } from './seminuevos-routing.module';
// importamos la navbar
import { NavbarComponent } from '../../components/navbar/navbar.component';

import { SeminuevosPage } from './seminuevos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SeminuevosPageRoutingModule,
    NavbarComponent
  ],
  declarations: [SeminuevosPage]
})
export class SeminuevosPageModule {}
