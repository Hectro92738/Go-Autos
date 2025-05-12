import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NuevosPageRoutingModule } from './nuevos-routing.module';
// importamos la navbar
import { NavbarComponent } from '../../components/navbar/navbar.component';

import { NuevosPage } from './nuevos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NuevosPageRoutingModule,
    NavbarComponent,
  ],
  declarations: [NuevosPage]
})
export class NuevosPageModule {}
