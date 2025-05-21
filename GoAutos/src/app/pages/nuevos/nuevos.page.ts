import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { GeneralService } from '../../services/general.service';
import { CarsService } from '../../services/cars.service';
import { FiltroPopoverComponent } from '../../components/filtro-popover/filtro-popover.component';
import { PopoverController } from '@ionic/angular';

interface Auto {
  marca: string;
  modelo: string;
  anio: number;
  tipo: string;
  precio: number;
  imagen: string;
}

@Component({
  selector: 'app-nuevos',
  templateUrl: './nuevos.page.html',
  styleUrls: ['./nuevos.page.scss'],
  standalone: false,
})
export class NuevosPage implements OnInit {
  esDispositivoMovil: boolean = false;
  autosStorage: any[] = [];
  filtros = [
    { label: '$', tipo: 'precio' },
    { label: 'Color', tipo: 'color' },
    { label: 'Año', tipo: 'anio' },
    { label: 'Marca', tipo: 'marca' },
  ];
  paginaActual = 1;
  itemsPorPagina = 10;
  totalPaginas = 1;
  paginas: number[] = [];
  autos: Auto[] = [
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
    {
      marca: 'Chevrolet',
      modelo: 'Nova GT Sport',
      anio: 2022,
      tipo: 'Hatchback Deportivo',
      precio: 95899,
      imagen: 'assets/autos/rojo.webp',
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
      marca: 'Chevrolet',
      modelo: 'Nova GT Sport',
      anio: 2022,
      tipo: 'Hatchback Deportivo',
      precio: 95899,
      imagen: 'assets/autos/rojo.webp',
    },
  ];

  autosPaginados: Auto[] = [];
  showSplash: boolean = true;

  constructor(
    private menu: MenuController,
    private generalService: GeneralService,
    private popoverCtrl: PopoverController,
    private carsService: CarsService
  ) {}

  ngOnInit() {
    this.generalService.dispositivo$.subscribe((tipo) => {
      this.esDispositivoMovil = tipo === 'telefono' || tipo === 'tablet';
    });
    this.getCarsNews();
    this.calcularPaginacion();
  }

  getCarsNews() {
    this.carsService.getCarsNews().subscribe({
      next: (res: any) => {
        this.autosStorage = res.map((auto: any) => ({
          ...auto,
          imagen: auto.imagenes?.[0] || '/assets/default-car.webp', 
        }));
        // this.generalService.alert(
        //   '¡Autos optenidos correctamente!',
        //   '✅ Autos nuevos listos para ver.'
        // );
      },
      error: (err) => {
        // ocultar spinner
        this.generalService.loadingDismiss();
        const mensaje = err?.error?.message || 'Ocurrió un error inesperado';
        this.generalService.alert('Error al guardar los datos', mensaje);
      },
    });
  }

  async mostrarOpciones(ev: Event, tipo: string) {
    const popover = await this.popoverCtrl.create({
      component: FiltroPopoverComponent,
      event: ev,
      translucent: true,
      componentProps: { tipo },
    });

    await popover.present();

    const { data } = await popover.onDidDismiss();
    if (data) {
      console.log('Filtro seleccionado:', data);
      // Aquí puedes aplicar el filtro real
    }
  }

  //  --- # Calculación de paginación --- #

  calcularPaginacion() {
    this.totalPaginas = Math.ceil(this.autos.length / this.itemsPorPagina);
    this.paginas = Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
    this.mostrarPagina(this.paginaActual);
  }

  mostrarPagina(pagina: number) {
    this.paginaActual = pagina;
    const inicio = (pagina - 1) * this.itemsPorPagina;
    const fin = inicio + this.itemsPorPagina;
    this.autosPaginados = this.autos.slice(inicio, fin);
  }

  cambiarPagina(pagina: number) {
    this.mostrarPagina(pagina);
  }
}
