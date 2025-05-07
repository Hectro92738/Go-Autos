import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
    standalone: true, // Si usando componentes independientes (standalone)
    imports: [IonicModule, CommonModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA], //esquema personalizado
})
export class LoginComponent  implements OnInit {

  showPassword: boolean = false;

  constructor() { }

  ngOnInit() {
  }

}
