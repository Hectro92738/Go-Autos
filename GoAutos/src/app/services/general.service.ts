import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  public esMovil = new BehaviorSubject<boolean>(false);

  // Comportamiento reactivo del tipo de dispositivo
  private dispositivoSubject = new BehaviorSubject<'telefono' | 'tablet' | 'computadora'>('computadora');
  public dispositivo$ = this.dispositivoSubject.asObservable();

  constructor(private platform: Platform) {
    this.detectarDispositivo();
    this.detectarDispositivoSinze();
  }

  private detectarDispositivoSinze() {
    const width = window.innerWidth;

    if (width <= 768) {
      this.dispositivoSubject.next('telefono');
    } else if (width > 768 && width <= 1024) {
      this.dispositivoSubject.next('tablet');
    } else {
      this.dispositivoSubject.next('computadora');
    }
  }

  detectarDispositivo() {
    const isMobile = this.platform.is('ios') || this.platform.is('android');
    this.esMovil.next(isMobile);
  }
}
