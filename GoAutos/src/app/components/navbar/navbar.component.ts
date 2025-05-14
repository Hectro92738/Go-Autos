import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router,NavigationEnd  } from '@angular/router';
import { filter } from 'rxjs/operators';
import { GeneralService } from '../../services/general.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class NavbarComponent implements OnInit {
  esDispositivoMovil: boolean = false;
  estaEnHome: boolean = false;
  public isLoggedIn: boolean = false;

  constructor(
    private menu: MenuController,
    private router: Router,
    public generalService: GeneralService
  ) {}

  ngOnInit() {
    // Detectar tipo de dispositivo
    this.generalService.dispositivo$.subscribe(tipo => {
      this.esDispositivoMovil = (tipo === 'telefono' || tipo === 'tablet');
    });

    // Detectar ruta actual
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.estaEnHome = event.urlAfterRedirects === '/home';
      });

     this.generalService.tokenExistente$.subscribe((estado) => {
      this.isLoggedIn = estado;
    });

  }

  openMenu() {
    this.menu.enable(true, 'menuLateral');
    this.menu.open('menuLateral');
  }

  redirecion(url: string) {
    this.router.navigate([url]);
  }
}
