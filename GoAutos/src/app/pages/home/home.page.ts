import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { GeneralService } from '../../services/general.service';
import { FiltroPopoverComponent } from '../../components/filtro-popover/filtro-popover.component';
import { PopoverController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { AlertController } from '@ionic/angular';



@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {

  textoCompleto: string = 'Compra y acelera';
  textoAnimado: string = '';
  textoIndex = 0;
  totalTextos = 2;
  esDispositivoMovil: boolean = false;
  formNotificacion: FormGroup;

  constructor(
    private menu: MenuController,
    private generalService: GeneralService,
    private popoverCtrl: PopoverController,
    private fb: FormBuilder,
    private alertCtrl: AlertController
  ) {
    this.formNotificacion = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit() {
    this.escribirTexto();
    this.generalService.dispositivo$.subscribe((tipo) => {
      this.esDispositivoMovil = tipo === 'telefono' || tipo === 'tablet';
    });

    setInterval(() => {
      this.textoIndex = (this.textoIndex + 1) % this.totalTextos;
    }, 10000);
  }

  async presentAlertaConfirmacion() {
  const alert = await this.alertCtrl.create({
    header: '¡Gracias!',
    message: 'Tu mensaje fue recibido. Te notificaremos pronto',
    buttons: [],
    backdropDismiss: false,
  });

  await alert.present();

  setTimeout(() => {
    alert.dismiss();
  }, 3000);
}


  enviarNotificacion() {
  if (this.formNotificacion.invalid) {
    this.formNotificacion.markAllAsTouched();
    return;
  }

  this.presentAlertaConfirmacion();


  const datos = this.formNotificacion.value;
  this.generalService.enviarCorreoContacto(datos.nombre, datos.correo).subscribe({
    next: () => {
      this.formNotificacion.reset();
      console.log('Correo enviado correctamente');
    },
    error: (error) => {
      console.error('Error al enviar notificación:', error);
    },
  });
}

  escribirTexto() {
    let index = 0;
    const intervalo = setInterval(() => {
      this.textoAnimado += this.textoCompleto[index];
      index++;
      if (index === this.textoCompleto.length) {
        clearInterval(intervalo);
      }
    }, 150);
  }

}
