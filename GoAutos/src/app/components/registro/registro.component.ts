import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RegistroService } from '../../services/registro.service';
import { GeneralService } from '../../services/general.service';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import {
  AbstractControl,
  ValidatorFn,
  ValidationErrors,
  FormGroup,
} from '@angular/forms';

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
  Seccionamostrar: number = 1;
  verPassword: boolean = false;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private registroService: RegistroService,
    private alertController: AlertController,
    private generalService: GeneralService,
    private loadingController: LoadingController,
    private router: Router,
  ) {}

  async ngOnInit() {
    this.inicializarFormulario();
    this.apiBanderas();
    // mostrar spinner
    // await this.generalService.loading('Verificando...');
  }

  inicializarFormulario() {
    this.registroForm = this.fb.group(
      {
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
        telefono: [
          '',
          [Validators.required, Validators.pattern(/^[0-9]{10}$/)],
        ],
        numeroConfirm: [
          '',
          [
            Validators.required,
            Validators.maxLength(6),
            Validators.pattern(/^[0-9]{6}$/),
          ],
        ],
        contrasena: ['', [Validators.required, validarPasswordFuerte()]],
        confirmarContrasena: ['', [Validators.required]],
      },
      {
        validators: [
          validarCoincidenciaPasswords('contrasena', 'confirmarContrasena'),
        ],
      }
    );
  }

  transformarMayuscula(campo: string) {
    const valor = this.registroForm.get(campo)?.value;
    if (valor) {
      this.registroForm
        .get(campo)
        ?.setValue(valor.toUpperCase(), { emitEvent: false });
    }
  }

  // VALIDACION DE EMAIL, NUMERO DE TELEFONO Y NOMBRE
  async validarSeccion1() {
    const campos = ['usuario', 'apellidos', 'email', 'telefono'];
    let valido = true;

    campos.forEach((campo) => {
      const control = this.registroForm.get(campo);
      control?.markAsTouched();
      // console.log(`${campo}:`, control?.value);
      if (control?.invalid || control?.value.trim() === '') {
        valido = false;
      }
    });

    if (valido) {
      // mostrar spinner
      await this.generalService.loading('Verificando...');
      const datos = {
        nombre: this.registroForm.value.usuario,
        apellidos: this.registroForm.value.apellidos,
        email: this.registroForm.value.email,
        lada: this.ladaSeleccionada.codigo,
        telefono: this.registroForm.value.telefono,
      };

      this.registroService.preregistro(datos).subscribe({
        next: async (respuesta) => {
          // ocultar spinner
          await this.generalService.loadingDismiss();
          await this.generalService.alert(
            '¡Estas a un paso de tu registro!',
            'Revisa tu correo para confirmar tu registro.'
          );
          // this.registroForm.reset();
          this.Seccionamostrar = 2;
        },
        error: async (error) => {
          // Ocultar spinner
          await this.generalService.loadingDismiss();

          console.error('Error en el registro:', error);

          // Obtener mensaje del backend
          const mensaje =
            error.error?.message || 'Ocurrió un error. Intenta más tarde.';

          await this.generalService.alert('Error al registrar', mensaje);
        },
      });
    } else {
      this.registroForm.markAllAsTouched();
      await this.generalService.alert(
        'Datos incompletos',
        'Por favor completa todos los campos correctamente.'
      );
    }
  }

  // BOTON DE REGRESAR A SECCION 1  ←
  async regresarASeccion1() {
    const alert = await this.alertController.create({
      header: '¿Deseas regresar?',
      message: 'Perderás los datos ingresados en esta sección.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'alert-cancel-button',
        },
        {
          text: 'Sí, regresar',
          handler: () => {
            this.Seccionamostrar = 1;
          },
          cssClass: 'alert-confirm-button',
        },
      ],
    });

    await alert.present();
  }

  // VALIDAR SECCIÓN DE CÓDIGO
  async validarSeccion2() {
    const campos = ['numeroConfirm'];
    let valido = true;

    campos.forEach((campo) => {
      const control = this.registroForm.get(campo);
      control?.markAsTouched();

      if (control?.invalid) {
        valido = false;
      }
    });

    if (valido) {
      // mostrar spinner
      await this.generalService.loading('Verificando...');
      const datos = {
        email: this.registroForm.value.email,
        code: String(this.registroForm.value.numeroConfirm),
      };

      this.registroService.validacioncodigo(datos).subscribe({
        next: async (respuesta) => {
          // ocultar spinner
          await this.generalService.loadingDismiss();
          await this.generalService.alert(
            '¡Código verificado exitosamente!',
            'Por favor crea una contrseña por seguridad'
          );
          // this.registroForm.reset();
          this.Seccionamostrar = 3;
        },
        error: async (error) => {
          // Ocultar spinner
          await this.generalService.loadingDismiss();
          console.error('Error en el registro:', error);
          // Obtener mensaje del backend
          const mensaje =
            error.error?.message || 'Ocurrió un error. Intenta más tarde.';
          await this.generalService.alert('Error al registrar', mensaje);
        },
      });
    } else {
      this.registroForm.markAllAsTouched();
      await this.generalService.alert(
        'Datos incompletos',
        'Por favor completa todos los campos correctamente.'
      );
    }
  }

  // REGISTRO DESPUES DE VALIDAR PASSWORD, EMAIL,  TELEFONO Y NOMBRE
  async EnvioRegistro() {
    const campos = ['usuario', 'apellidos', 'email', 'telefono'];
    let valido = true;

    campos.forEach((campo) => {
      const control = this.registroForm.get(campo);
      control?.markAsTouched();
      // console.log(`${campo}:`, control?.value);
      if (control?.invalid || control?.value.trim() === '') {
        valido = false;
      }
    });

    if (valido) {
      const datos = {
        nombre: this.registroForm.value.usuario,
        apellidos: this.registroForm.value.apellidos,
        email: this.registroForm.value.email,
        lada: this.ladaSeleccionada.codigo,
        telefono: this.registroForm.value.telefono,
        password: this.registroForm.value.contrasena,
      };

      this.registroService.registro(datos).subscribe({
        next: async (res) => {
          await this.generalService.alert(
            '¡Bienvenido a Go Autos!',
            'Tu registro ha sido exitoso.'
          );
          if (res.token) {
            this.generalService.guardarToken(res.token);
            this.generalService.presentToast(
              'Inicio de sesión exitoso',
              'success'
            );
            this.router.navigate(['/home']);
          } else {
            this.generalService.presentToast('Respuesta inválida del servidor');
          }
        },
        error: async (error) => {
          console.error('Error en el registro:', error);
          let mensaje = 'Ocurrió un error. Intenta más tarde.';
          if (error.status === 400 && error.error?.mensaje) {
            mensaje = error.error.mensaje;
          }
          await this.generalService.alert('Error al registrar', mensaje);
        },
      });
    } else {
      this.registroForm.markAllAsTouched();
      await this.generalService.alert(
        'Datos incompletos',
        'Por favor completa todos los campos correctamente.'
      );
    }
  }

  toggleVerPassword() {
    this.verPassword = !this.verPassword;
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

function validarPasswordFuerte(): ValidatorFn {
  return (control: AbstractControl) => {
    const value = control.value || '';
    const errores: any = {};

    if (value.length < 6) {
      errores.minlength = true;
    }

    if (!/[A-Z]/.test(value)) {
      errores.mayuscula = true;
    }

    if (!/\d/.test(value)) {
      errores.numero = true;
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      errores.especial = true;
    }

    return Object.keys(errores).length ? errores : null;
  };
}

function validarCoincidenciaPasswords(
  nombre1: string,
  nombre2: string
): ValidatorFn {
  return (form: AbstractControl) => {
    const group = form as FormGroup;
    const pass1 = group.get(nombre1)?.value;
    const pass2 = group.get(nombre2)?.value;

    if (pass1 !== pass2) {
      group
        .get(nombre2)
        ?.setErrors({ ...group.get(nombre2)?.errors, noCoincide: true });
    } else {
      const errores = group.get(nombre2)?.errors;
      if (errores) {
        delete errores['noCoincide'];
        if (Object.keys(errores).length === 0) {
          group.get(nombre2)?.setErrors(null);
        }
      }
    }

    return null;
  };
}
