import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FaviritosPageRoutingModule } from './faviritos-routing.module';
// importamos la navbar
import { NavbarComponent } from '../../components/navbar/navbar.component';

import { FaviritosPage } from './faviritos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FaviritosPageRoutingModule,
    NavbarComponent
  ],
  declarations: [FaviritosPage]
})
export class FaviritosPageModule {}
