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

  onSubmit() {
    if (this.loginForm.invalid) {
      this.generalService.presentToast('Completa los campos correctamente');
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
        if (res.token) {
          this.generalService.guardarToken(res.token);
          this.generalService.presentToast(
            'Inicio de sesión exitoso',
            'success'
          );
          this.router.navigate(['/nuevos']);
        } else {
          this.generalService.presentToast('Respuesta inválida del servidor');
        }
      },
      error: () => {
        // ocultar spinner
        this.generalService.loadingDismiss();
        this.generalService.presentToast('Email o contraseña incorrectos');
      },
    });
  }
}
