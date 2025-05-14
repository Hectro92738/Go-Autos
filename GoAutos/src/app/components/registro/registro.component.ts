import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RegistroService } from '../../services/registro.service';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss'],
  standalone: true, // Si usando componentes independientes (standalone)
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], //esquema personalizado
})
export class RegistroComponent implements OnInit {
  paises: any[] = [];

  mostrarModal: boolean = false;
  ladaSeleccionada = {
    codigo: '+52',
    bandera: 'mx',
  };

  registroForm!: FormGroup;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private registroService: RegistroService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.inicializarFormulario();
    this.apiBanderas();
  }

  async EnvioRegistro() {
    if (this.registroForm.valid) {
      const datos = {
        usuario: this.registroForm.value.usuario,
        apellidos: this.registroForm.value.apellidos,
        email: this.registroForm.value.email,
        lada: this.ladaSeleccionada.codigo,
        telefono: this.registroForm.value.telefono,
      };

      this.registroService.registro(datos).subscribe({
        next: async (respuesta) => {
          const alert = await this.alertController.create({
            header: '¡Registro exitoso!',
            message: 'Tu cuenta ha sido creada correctamente.',
            buttons: ['Aceptar'],
          });
          await alert.present();
          this.registroForm.reset();
        },
        error: async (error) => {
          console.error('Error en el registro:', error);

          let mensaje = 'Ocurrió un error. Intenta más tarde.';
          if (error.status === 400 && error.error?.mensaje) {
            mensaje = error.error.mensaje;
          }

          const alert = await this.alertController.create({
            header: 'Error al registrar',
            message: mensaje,
            buttons: ['Aceptar'],
          });
          await alert.present();
        },
      });
    } else {
      console.log('Formulario inválido');
      this.registroForm.markAllAsTouched();

      const alert = await this.alertController.create({
        header: 'Formulario incompleto',
        message: 'Por favor completa todos los campos correctamente.',
        buttons: ['Entendido'],
      });
      await alert.present();
    }
  }

  inicializarFormulario() {
    this.registroForm = this.fb.group({
      usuario: [
        '',
        [
          Validators.required,
          Validators.maxLength(20),
          Validators.pattern(/^[A-Z ]+$/),
        ],
      ],
      apellidos: [
        '',
        [
          Validators.required,
          Validators.maxLength(40),
          Validators.pattern(/^[A-Z ]+$/),
        ],
      ],
      email: [
        '',
        [Validators.required, Validators.email, Validators.maxLength(30)],
      ],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    });
  }

  transformarMayuscula(campo: string) {
    const valor = this.registroForm.get(campo)?.value;
    if (valor) {
      this.registroForm
        .get(campo)
        ?.setValue(valor.toUpperCase(), { emitEvent: false });
    }
  }

  //  ##  ------
  apiBanderas() {
    this.http
      .get<any[]>(
        'https://restcountries.com/v3.1/all?fields=idd,flags,name,cca2'
      )
      .subscribe((data) => {
        this.paises = data
          .filter((p) => p.idd && p.idd.root)
          .map((p) => {
            const code = p.cca2.toLowerCase();
            return {
              nombre: p.name.common,
              codigo: `${p.idd.root}${p.idd.suffixes?.[0] || ''}`,
              bandera: this.getEmojiFlag(p.cca2),
              banderaUrl: `https://flagcdn.com/w40/${code}.png`,
            };
          })
          .sort((a, b) => a.nombre.localeCompare(b.nombre));
      });
  }
  getEmojiFlag(countryCode: string): string {
    return countryCode
      .toUpperCase()
      .replace(/./g, (char) =>
        String.fromCodePoint(127397 + char.charCodeAt(0))
      );
  }

  abrirModalLadas() {
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  seleccionarLada(pais: any) {
    this.ladaSeleccionada = {
      codigo: pais.codigo,
      bandera: pais.banderaUrl.split('/').pop()?.split('.')[0],
    };
    this.mostrarModal = false;
  }
}
