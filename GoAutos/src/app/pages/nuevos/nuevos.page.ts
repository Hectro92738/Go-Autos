import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { GeneralService } from '../../services/general.service';
import { FiltroPopoverComponent } from '../../components/filtro-popover/filtro-popover.component';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-nuevos',
  templateUrl: './nuevos.page.html',
  styleUrls: ['./nuevos.page.scss'],
  standalone: false,
})
export class NuevosPage implements OnInit {

  esDispositivoMovil: boolean = false;

  filtros = [
    { label: '$', tipo: 'precio' },
    { label: 'Color', tipo: 'color' },
    { label: 'Año', tipo: 'anio' },
    { label: 'Marca', tipo: 'marca' }
  ];

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
    private generalService: GeneralService,
    private popoverCtrl: PopoverController
  ) {}

  ngOnInit() {
    // this.mostrarBienvenida();
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

  async mostrarOpciones(ev: Event, tipo: string) {
    const popover = await this.popoverCtrl.create({
      component: FiltroPopoverComponent,
      event: ev,
      translucent: true,
      componentProps: { tipo }
    });

    await popover.present();

    const { data } = await popover.onDidDismiss();
    if (data) {
      console.log('Filtro seleccionado:', data);
      // Aquí puedes aplicar el filtro real
    }
  }
}
