import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router, NavigationStart } from '@angular/router';
import { GeneralService } from '../../services/general.service';
import { AlertController } from '@ionic/angular';

import { ModalController } from '@ionic/angular';
// Importamos la modal de perfil
import { PerfilComponent } from '../modal/perfil/perfil.component';
// importamos la modal de nuevo car
import { NewcarComponent } from '../modal/newcar/newcar.component';

@Component({
  selector: 'app-menulateral',
  templateUrl: './menulateral.component.html',
  styleUrls: ['./menulateral.component.scss'],
  standalone: true, // Si usando componentes independientes (standalone)
  imports: [IonicModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], //esquema personalizado
})
export class MenulateralComponent implements OnInit {
  public isLoggedIn: boolean = false;

  constructor(
    private router: Router,
    private menuCtrl: MenuController,
    public generalService: GeneralService,
    private alertController: AlertController,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.generalService.tokenExistente$.subscribe((estado) => {
      this.isLoggedIn = estado;
    });
  }

  async redirecion(url: string) {
    this.cerrarMenu();
    this.router.navigate([url]);
  }

  cerrarMenu() {
    this.menuCtrl.close('menuLateral');
  }

  async logout() {
    const alert = await this.alertController.create({
      header: '¿Deseas salir?',
      message: '¿Estás seguro de que deseas salir de la aplicación?',
      cssClass: 'alert-confirm',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'alert-cancel-button',
        },
        {
          text: 'Sí, salir',
          handler: () => {
            this.generalService.eliminarToken();
            this.cerrarMenu();
            this.router.navigate(['/home']);
            this.generalService.alert(
              '¡Saliste de ti sesión!',
              '¡Hasta pronto!'
            );
          },
          cssClass: 'alert-confirm-button',
        },
      ],
    });

    await alert.present();
  }

  async abrirModalPerfil() {
    // Mostrar spinner
    await this.generalService.loading('Cargando...');
    this.cerrarMenu();
    setTimeout(async () => {
      // Ocultar spinner
      await this.generalService.loadingDismiss();
      const modal = await this.modalCtrl.create({
        component: PerfilComponent,
        breakpoints: [1],
        cssClass: 'modal-perfil',
        initialBreakpoint: 1,
        handle: true,
        showBackdrop: true,
      });
      await modal.present();
    }, 800);
  }

  async abrirModalNewCar() {
    // Mostrar spinner
    await this.generalService.loading('Cargando...');
    this.cerrarMenu();
    setTimeout(async () => {
      // Ocultar spinner
      await this.generalService.loadingDismiss();
      const modal = await this.modalCtrl.create({
        component: NewcarComponent,
        // cssClass: 'modal-fullscreen',
        // backdropDismiss: true,
        // showBackdrop: true,
        // // # ....
        breakpoints: [1],
        initialBreakpoint: 1,
        cssClass: 'modal-ancha',
        handle: false,
        showBackdrop: false,
        backdropDismiss: false,
      });
      await modal.present();
    }, 1000);
  }
}
