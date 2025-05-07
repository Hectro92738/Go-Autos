import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router, NavigationStart } from '@angular/router';
import { GeneralService } from '../../services/general.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TabsComponent  implements OnInit {

  esDispositivoMovil: boolean = false;

  constructor(
    private generalService: GeneralService,
    private router: Router
  ) { }

  notificacionesFavoritos: number = 9;

  ngOnInit() {
    this.generalService.dispositivo$.subscribe(tipo => {
      this.esDispositivoMovil = (tipo === 'telefono' || tipo === 'tablet');
    });
  }
  async redirecion(url: string) {
    this.router.navigate([url]);
  }

}
