import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import { environment } from '../../environments/environment';
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { IonicModule, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class GeneralService {
  public esMovil = new BehaviorSubject<boolean>(false);

  // Comportamiento reactivo del tipo de dispositivo
  private dispositivoSubject = new BehaviorSubject<
    'telefono' | 'tablet' | 'computadora'
  >('computadora');
  public dispositivo$ = this.dispositivoSubject.asObservable();


  private tokenSubject = new BehaviorSubject<boolean>(this.hasToken());
  public tokenExistente$ = this.tokenSubject.asObservable();

  constructor(
    private platform: Platform,
    private http: HttpClient,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {
    this.detectarDispositivo();
    this.detectarDispositivoSinze();
  }

  // Verifica si el token existe en localStorage
  tokenPresente(): boolean {
    const isAuthenticated = this.hasToken();
    this.tokenSubject.next(isAuthenticated);
    console.log('Token presente:', isAuthenticated);
    return isAuthenticated;
  }

  hasToken(): boolean {
    const token = localStorage.getItem('token');
    console.log('Token:', token);
    return !!localStorage.getItem('token');
  }

  // Guarda token y actualiza el estado reactivo
  guardarToken(token: string): void {
    localStorage.setItem('token', token);
    this.tokenSubject.next(true);
  }

  // Elimina token y notifica cambio
  eliminarToken(): void {
    localStorage.removeItem('token');
    this.tokenSubject.next(false);
  }

  // Obtener token si lo necesitas
  obtenerToken(): string | null {
    return localStorage.getItem('token');
  }

  // ----------------- DISPOSITIVO -----------------
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

  enviarCorreoContacto(nombre: string, correo: string) {
    return this.http.post(`${environment.api_key}/api/contacto`, {
      nombre,
      correo,
    });
  }

  async alert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['Aceptar'],
    });
    await alert.present();
  }

  async loading(message: string) {
    const loading = await this.loadingController.create({
      message: message,
      spinner: 'crescent',
      cssClass: 'spinner-rojo',
      backdropDismiss: false,
    });
    await loading.present();
  }

  async loadingDismiss() {
    return await this.loadingController.dismiss();
  }

  async presentToast(message: string, color: string = 'danger') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
    });
    toast.present();
  }
}
