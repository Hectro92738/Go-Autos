import { Component, OnInit } from '@angular/core';
import { GeneralService } from '../../services/general.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: false,
})
export class InicioPage implements OnInit {
  esDispositivoMovil: boolean = false;
  showSplash: boolean = true;
  MostrarLogin: boolean = true;
  constructor(private generalService: GeneralService) {}

  async ngOnInit() {
    setTimeout(() => {
      this.showSplash = false;
    }, 5000);

    this.generalService.dispositivo$.subscribe((tipo) => {
      this.esDispositivoMovil = tipo === 'telefono' || tipo === 'tablet';
    });
  }

  RegistroLogin() {
    this.MostrarLogin = !this.MostrarLogin;
  }
}
