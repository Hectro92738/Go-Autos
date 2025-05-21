import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RegistroService } from 'src/app/services/registro.service';
import { GeneralService } from '../../services/general.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  showPassword = false;
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private toastController: ToastController,
    private registroService: RegistroService,
    private generalService: GeneralService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  async onSubmit() {
    if (this.loginForm.invalid) {
      await this.generalService.alert(
        '¡Ups¡ a ocurrido un error',
        'Completa los campos correctamente'
      );
      // this.generalService.presentToast('Completa los campos correctamente');
      return;
    }

    // mostrar spinner
    this.generalService.loading('Verificando...');
    const { email, password } = this.loginForm.value;

    const datos = { email, password };

    this.registroService.login(datos).subscribe({
      next: (res: any) => {
        // ocultar spinner
        this.generalService.loadingDismiss();
        if (res.token && res.user) {
          this.generalService.alert(
            'Inicio de sesión exitoso',
            'Bienvenido a Go Autos'
          );
          this.generalService.guardarCredenciales(res.token, res.user);
          // this.generalService.presentToast(
          //   'Inicio de sesión exitoso',
          //   'success'
          // );
          this.router.navigate(['/nuevos']);
        } else {
          this.generalService.alert(
            'Error de conexión',
            'Ups, algo salió mal buelve a intentarlo'
          );
          // this.generalService.presentToast('Ups, algo salió mal buelve a intentarlo');
        }
      },
      error: () => {
        // ocultar spinner
        this.generalService.loadingDismiss();
          this.generalService.alert(
            'Verifica tus credenciales',
            'Email o contraseña incorrectos'
          );
        // this.generalService.presentToast('Email o contraseña incorrectos');
      },
    });
  }
}
