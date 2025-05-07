import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-menulateral',
  templateUrl: './menulateral.component.html',
  styleUrls: ['./menulateral.component.scss'],
  standalone: true, // Si usando componentes independientes (standalone)
  imports: [IonicModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], //esquema personalizado
})
export class MenulateralComponent implements OnInit {
  constructor(private router: Router, private menuCtrl: MenuController) {}

  ngOnInit() {}

  async redirecion(url: string) {
    this.cerrarMenu()
    this.router.navigate([url]);
  }

  cerrarMenu() {
    this.menuCtrl.close('menuLateral');
  }
}
