import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RegistroService } from 'src/app/services/registro.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  showPassword = false;
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private toastController: ToastController,
    private registroService: RegistroService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  async presentToast(message: string, color: string = 'danger') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color
    });
    toast.present();
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.presentToast('Completa los campos correctamente');
      return;
    }

    const { email, password } = this.loginForm.value;

    const datos = { email, password };

    this.registroService.login(datos).subscribe({
      next: (res: any) => {
        if (res.token) {
          localStorage.setItem('token', res.token);
          this.presentToast('Inicio de sesión exitoso', 'success');
          this.router.navigate(['/nuevos']);
        } else {
          this.presentToast('Respuesta inválida del servidor');
        }
      },
      error: () => {
        this.presentToast('Email o contraseña incorrectos');
      }
    });
  }
}
