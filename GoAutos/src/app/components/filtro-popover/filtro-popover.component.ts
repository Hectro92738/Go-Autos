import { Component, OnInit, Input  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-filtro-popover',
  templateUrl: './filtro-popover.component.html',
  styleUrls: ['./filtro-popover.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], //esquema personalizado
})

export class FiltroPopoverComponent  implements OnInit {

  @Input() tipo: string = '';

  opciones: any[] = [];

  constructor(private popoverCtrl: PopoverController) {}

  ngOnInit() {
    if (this.tipo === 'precio') {
      this.opciones = [
        { label: '$5,000 - $20,000', rango: [5000, 20000] },
        { label: '$20,000 - $50,000', rango: [20000, 50000] },
        { label: '$50,000+', rango: [50000, Infinity] }
      ];
    } else if (this.tipo === 'anio') {
      this.opciones = [
        { label: '2024 o más nuevo', anio: 2024 },
        { label: '2020 - 2023', anio: 2020 },
        { label: 'Antes de 2020', anio: 2010 }
      ];
    } else if (this.tipo === 'color') {
      this.opciones = [
        { label: 'Rojo' }, { label: 'Blanco' }, { label: 'Negro' }
      ];
    } else if (this.tipo === 'marca') {
      this.opciones = [
        { label: 'Tesla' }, { label: 'BMW' }, { label: 'Mazda' }
      ];
    }
  }

  seleccionar(opcion: any) {
    this.popoverCtrl.dismiss(opcion);
  }

}

// Usados (3 meses de garantia),
// Seminuevos (),
// Nuevos
