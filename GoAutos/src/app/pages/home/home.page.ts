import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { GeneralService } from '../../services/general.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {

  esDispositivoMovil: boolean = false;

  filtros: string[] = ['Color', '$', 'Año', 'Marca'];

  autos = [
    {
      marca: 'Chevrolet',
      modelo: 'Nova GT Sport',
      anio: 2022,
      tipo: 'Hatchback Deportivo',
      precio: 95899,
      imagen: 'assets/autos/rojo.webp',
    },
    {
      marca: 'BMW',
      modelo: 'Nova GT Sport',
      anio: 2019,
      tipo: 'Hatchback Deportivo',
      precio: 95899,
      imagen: 'assets/autos/blanco.webp',
    },
    {
      marca: 'Audi',
      modelo: 'Nova GT Sport',
      anio: 2018,
      tipo: 'Hatchback Deportivo',
      precio: 95899,
      imagen: 'assets/autos/azul.webp',
    },
    {
      marca: 'Mazda',
      modelo: 'Nova GT Sport',
      anio: 2020,
      tipo: 'Hatchback Deportivo',
      precio: 95899,
      imagen: 'assets/autos/verde.webp',
    },
    {
      marca: 'Tesla',
      modelo: 'Nova GT Sport',
      anio: 2021,
      tipo: 'Hatchback Deportivo',
      precio: 95899,
      imagen: 'assets/autos/blanco.webp',
    },
    {
      marca: 'Suzuki',
      modelo: 'Nova GT Sport',
      anio: 2024,
      tipo: 'Hatchback Deportivo',
      precio: 95899,
      imagen: 'assets/autos/verde.webp',
    },
  ];

  showSplash: boolean = true;

  constructor(
    private menu: MenuController,
    private generalService: GeneralService
  ) {}

  ngOnInit() {
    this.mostrarBienvenida();
    this.generalService.dispositivo$.subscribe((tipo) => {
      this.esDispositivoMovil = tipo === 'telefono' || tipo === 'tablet';
    });
  }

  mostrarBienvenida() {
    const splashMostrado = localStorage.getItem('splashMostrado');
    if (splashMostrado) {
      this.showSplash = false;
    } else {
      setTimeout(() => {
        this.showSplash = false;
        localStorage.setItem('splashMostrado', 'true');
      }, 5000);
    }
  }
}
