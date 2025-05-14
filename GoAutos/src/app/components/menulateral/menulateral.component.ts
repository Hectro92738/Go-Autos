import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router, NavigationStart } from '@angular/router';
import { GeneralService } from '../../services/general.service';
import { AlertController } from '@ionic/angular';

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
    private alertController: AlertController
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
          text: 'Sí, regresar',
          handler: () => {
            this.generalService.eliminarToken();
            this.router.navigate(['/login']);
          },
          cssClass: 'alert-confirm-button',
        },
      ],
    });

    await alert.present();
  }
}
