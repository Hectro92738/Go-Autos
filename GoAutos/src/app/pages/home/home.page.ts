import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { GeneralService } from '../../services/general.service';
import { FiltroPopoverComponent } from '../../components/filtro-popover/filtro-popover.component';
import { PopoverController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
    private fb: FormBuilder
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

  enviarNotificacion() {
    if (this.formNotificacion.valid) {
      const datos = this.formNotificacion.value;
      console.log('Datos del formulario:', datos);
      alert('¡Gracias! Te notificaremos pronto 🚀');
      this.formNotificacion.reset();
    }

    if (this.formNotificacion.invalid) {
      this.formNotificacion.markAllAsTouched();
      return;
    }

    const datos = this.formNotificacion.value;
    console.log('Datos del formulario:', datos);
    alert('¡Gracias! Te notificaremos pronto 🚀');
    this.formNotificacion.reset();
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
