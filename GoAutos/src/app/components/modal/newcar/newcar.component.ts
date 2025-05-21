import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router, NavigationStart } from '@angular/router';
import { GeneralService } from '../../../services/general.service';
import { AlertController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { RegistroService } from 'src/app/services/registro.service';
import imageCompression from 'browser-image-compression';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-newcar',
  templateUrl: './newcar.component.html',
  styleUrls: ['./newcar.component.scss'],
  standalone: true, // Si usando componentes independientes (standalone)
  imports: [CommonModule, IonicModule, ReactiveFormsModule, HttpClientModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], //esquema personalizado
})
export class NewcarComponent implements OnInit {
  autoForm: FormGroup;
  direccion: string = '';
  anioActual = new Date().getFullYear();
  anios_select: number[] = [];
  // facturaSeleccionada: string | null = null;
  facturaNombre: string = '';
  facturaSeleccionada: any = null;
  facturaArchivo: File | null = null;

  imagenes: File[] = [];
  imagenesPreview: string[] = [];

  excedeDescripcion: boolean = false;

  // ------ -----
  colores: string[] = [
    'Blanco',
    'Negro',
    'Gris',
    'Plata',
    'Rojo',
    'Azul',
    'Verde',
    'Amarillo',
    'Naranja',
    'Marrón',
    'Beige',
    'Dorado',
    'Vino',
    'Turquesa',
    'Morado',
    'Cobre',
    'Azul marino',
    'Gris oscuro',
    'Champán',
    'Rosado',
  ];

  cilindros: number[] = [2, 3, 4, 5, 6, 8, 10, 12, 16];

  tipos: string[] = [
    'Sedán',
    'SUV',
    'Pickup',
    'Hatchback',
    'Coupé',
    'Convertible',
    'Van',
    'Otro',
  ];

  transmisiones: string[] = [
    'Manual',
    'Automática',
    'Automatizada',
    'CVT',
    'Dual Clutch',
  ];

  marcas: string[] = [];
  modelos: string[] = [];
  anios: string[] = [];
  autosFiltrados: any[] = [];
  trims: string[] = [];

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private sanitizer: DomSanitizer,
    private generalService: GeneralService,
    private http: HttpClient,
    private registroService: RegistroService,
    private router: Router,
  ) {
    this.autoForm = this.fb.group({
      tipoVenta: ['', Validators.required],
      marca: ['', Validators.required],
      placas: [
        '',
        [Validators.maxLength(8), Validators.pattern('^[A-Z0-9]{1,8}$')],
      ],
      descripcion: ['', [Validators.required, maxWordsValidator(100)]],
      modelo: ['', Validators.required],
      anio: [
        '',
        [
          Validators.required,
          Validators.min(2009),
          Validators.max(this.anioActual),
        ],
      ],
      tipo: ['', Validators.required],
      transmision: ['', Validators.required],
      combustible: ['', Validators.required],
      cilindros: [
        '',
        [Validators.required, Validators.min(2), Validators.max(12)],
      ],
      kilometraje: ['', [Validators.min(0), Validators.max(300000)]],
      traccion: ['', Validators.required],
      moneda: ['MXN', Validators.required],
      puertas: ['', Validators.required],
      color: ['', Validators.required],
      precio: [
        '',
        [Validators.required, Validators.min(0), Validators.max(10_000_000)],
      ],
    });
  }

  ngOnInit() {
    this.obtenerMarcas();
    this.miUbicacion();
    this.generarAnios();
    this.varidacionInputs();
    // ## ------
    // this.obtenerPorMarca();
    // this.obtenerPorModelo();
    // this.obtenerPorAnio();
  }

  // ## ----- -----

  obtenerMarcas() {
    this.marcas = this.generalService.obtenerMarcas();
  }

  obtenerPorMarca() {
    this.autoForm.get('marca')?.valueChanges.subscribe((marca) => {
      // Limpia modelo y campos relacionados
      this.autoForm.patchValue({
        modelo: '',
        anio: '',
        tipo: '',
        transmision: '',
      });

      this.modelos = [];

      if (marca) {
        this.generalService.obtenerPorMarca(marca).subscribe((res) => {
          const trims = res?.Trims || [];
          const modelosUnicos = Array.from(
            new Set(trims.map((t: any) => t.model_name).filter(Boolean))
          ) as string[];

          this.modelos = modelosUnicos;
        });
      }
    });
  }

  obtenerPorModelo() {
    this.autoForm.get('modelo')?.valueChanges.subscribe((modelo) => {
      // Traer modelos
      // this.generalService.loading('Cargando...');
      this.autoForm.patchValue({
        anio: '',
        tipo: '',
        transmision: '',
      });

      this.anios = [];

      const marca = this.autoForm.get('marca')?.value;
      this.generalService.obtenerPorModelo(modelo, marca).subscribe((res) => {
        const trims = res?.Trims || [];

        const aniosUnicos = Array.from(
          new Set(trims.map((t: any) => t.model_year).filter(Boolean))
        ) as string[];
        this.anios = aniosUnicos;
        // ocultar spinner
        // this.generalService.loadingDismiss();
      });
    });
  }

  obtenerPorAnio() {
    this.autoForm.get('anio')?.valueChanges.subscribe((anio) => {
      // Traer modelos
      // this.generalService.loading('Cargando...');
      this.autoForm.patchValue({
        tipo: '',
        transmision: '',
      });

      this.autosFiltrados = [];

      const marca = this.autoForm.get('marca')?.value;
      const modelo = this.autoForm.get('modelo')?.value;

      this.generalService
        .obtenerPorAnio(modelo, marca, anio)
        .subscribe((res) => {
          const trims = res?.Trims || [];
          this.autosFiltrados = trims;

          this.trims = Array.from(
            new Set(trims.map((t: any) => t.model_trim).filter(Boolean))
          ) as string[];

          // ocultar spinner
          // this.generalService.loadingDismiss();
          console.log(this.autosFiltrados);
        });
    });
  }

  generarAnios() {
    for (let i = this.anioActual; i >= 2000; i--) {
      this.anios_select.push(i);
    }
  }
  // ☢️ validar algunos imput
  varidacionInputs() {
    this.autoForm.get('placas')?.valueChanges.subscribe((value) => {
      if (value) {
        const limpio = value.replace(/\s/g, '').toUpperCase();
        if (value !== limpio) {
          this.autoForm.get('placas')?.setValue(limpio, { emitEvent: false });
        }
      }
    });
    // ## -----
    this.autoForm.get('kilometraje')?.valueChanges.subscribe((value) => {
      if (value !== null && value !== undefined) {
        const limpio = value.toString().replace(/\D/g, '');
        const numero = parseInt(limpio, 10);
        if (numero > 300000) {
          this.autoForm.get('kilometraje')?.setErrors({ max: true });
          return;
        }
        const formateado = Number(numero).toLocaleString('en-US');

        if (value !== formateado) {
          this.autoForm
            .get('kilometraje')
            ?.setValue(formateado, { emitEvent: false });
        }
      }
    });

    // ## ------
    this.autoForm.get('descripcion')?.valueChanges.subscribe((value) => {
      if (value !== null && value !== undefined) {
        // Eliminar carácter @
        let limpio = value.replace(/@/g, '');

        // Contar palabras
        const palabras = limpio.trim().split(/\s+/);

        if (palabras.length > 100) {
          // Cortar el texto a las primeras 100 palabras
          const cortado = palabras.slice(0, 100).join(' ');

          // Sobrescribir el control sin emitir evento nuevamente
          this.autoForm
            .get('descripcion')
            ?.setValue(cortado, { emitEvent: false });
          return;
        }

        // Si solo se eliminó @, actualizar también
        if (value !== limpio) {
          this.autoForm
            .get('descripcion')
            ?.setValue(limpio, { emitEvent: false });
        }
      }
    });

    // ## -----
    this.autoForm.get('precio')?.valueChanges.subscribe((valor) => {
      if (valor !== null && valor !== undefined) {
        // Eliminar comas y espacios
        const limpio = valor.toString().replace(/,/g, '').replace(/\s/g, '');

        // Validar si es un número válido (con o sin decimales)
        const numero = parseFloat(limpio);
        if (isNaN(numero)) {
          return;
        }

        // Limitar a 10 millones
        if (numero > 10000000) {
          this.autoForm.get('precio')?.setErrors({ max: true });
          return;
        }

        // Separar parte entera y decimal
        const partes = limpio.split('.');
        const enteroFormateado = Number(partes[0]).toLocaleString('en-US');
        const resultado =
          partes.length > 1
            ? `${enteroFormateado}.${partes[1]}`
            : enteroFormateado;

        if (valor !== resultado) {
          this.autoForm
            .get('precio')
            ?.setValue(resultado, { emitEvent: false });
        }
      }
    });
  }

  // ## ----- -----

  async cerrarModal() {
    // Mostrar spinner
    await this.generalService.loading('Cancelando...');
    setTimeout(async () => {
      this.modalCtrl.dismiss();
      // Ocultar spinner
      await this.generalService.loadingDismiss();
    }, 1000);
  }

  async guardarAuto() {
    if (this.autoForm.invalid) {
      this.autoForm.markAllAsTouched();
      console.warn('Formulario incompleto o inválido:', this.autoForm.value);
      this.generalService.alert(
        'Formulario Incompleto',
        'Por favor completa todos los campos requeridos.'
      );
      return;
    }
    // Validar que haya al menos una imagen
    if (this.imagenes.length === 0) {
      this.generalService.alert(
        'Imágenes Requeridas',
        'Debes subir al menos una imagen del auto.'
      );
      return;
    }

    // Validar que se haya subido la factura PDF
    if (!(this.facturaArchivo instanceof File)) {
      this.generalService.alert(
        'Factura Requerida',
        'Debes subir el archivo PDF de la factura del auto.'
      );
      return;
    }

    const auto = this.autoForm.value;
    const formData = new FormData();

    // Campos del formulario
    for (const key in auto) {
      if (auto.hasOwnProperty(key)) {
        let valor = auto[key];

        // Limpiar precio (y convertir a número) si tiene comas
        if (key === 'precio' && typeof valor === 'string') {
          valor = parseFloat(valor.replace(/,/g, ''));
        }

        // Limpiar kilometraje también si es necesario
        if (key === 'kilometraje' && typeof valor === 'string') {
          valor = parseInt(valor.replace(/,/g, ''), 10);
        }

        formData.append(key, valor);
      }
    }

    // Coordenadas y dirección
    formData.append('ciudad', this.ubicacion[0]);
    formData.append('estado', this.ubicacion[1]);
    formData.append('lat', this.ubicacion[2].toString());
    formData.append('lng', this.ubicacion[3].toString());
    formData.append('direccion', this.direccion);

    // Imágenes del auto
    if (this.imagenes.length > 0) {
      for (const file of this.imagenes) {
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 1, // Máximo 1MB por imagen
          maxWidthOrHeight: 1024, // Redimensiona si es muy grande
          useWebWorker: true,
        });
        formData.append('imagenes', compressedFile);
      }
    }

    // Factura PDF
    if (this.facturaArchivo.size < 2 * 1024 * 1024) {
      formData.append('facturaPDF', this.facturaArchivo);
    } else {
      this.generalService.alert(
        'Factura demasiado pesada',
        'Por favor sube un PDF menor a 2MB.'
      );
      return;
    }

    // Enviar a backend
    this.generalService.loading('Guardando auto...');
    console.log(formData);
    this.registroService.guardarAutos(formData).subscribe({
      next: (res: any) => {
        this.router.navigate(['/nuevos']);
        // ocultar spinner
        this.generalService.loadingDismiss();
        this.generalService.alert(
          '¡Auto agregado correctamente!',
          '✅ El aúto fue agregado correctamente.'
        );
        this.autoForm.reset();
        this.modalCtrl.dismiss();
      },
      error: (err) => {
        // ocultar spinner
        this.generalService.loadingDismiss();

        const mensaje = err?.error?.message || 'Ocurrió un error inesperado';
        this.generalService.alert('Error al guardar los datos', mensaje);
      },
    });
  }

  // ----- ----- -----
  // ## --- IMAGENES
  // ----- ----- -----
  onImagenesSeleccionadas(event: any): void {
    const files: FileList = event.target.files;

    if (files && files.length > 0) {
      const total = this.imagenes.length + files.length;
      if (total > 10) {
        this.generalService.alert(
          'Error en las Imagenes',
          'Solo se pueden subir máximo 10 imágenes.'
        );
        return;
      }

      Array.from(files).forEach((file: File) => {
        this.imagenes.push(file);

        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagenesPreview.push(e.target.result);
        };
        reader.readAsDataURL(file);
      });
    }
  }

  eliminarImagen(index: number): void {
    this.imagenes.splice(index, 1);
    this.imagenesPreview.splice(index, 1);
  }

  // ----- ----- -----
  // ## --- Factura PDF
  // ----- ----- -----
  onFacturaSeleccionada(event: any): void {
    const file: File = event.target.files[0];

    if (!file || file.type !== 'application/pdf') {
      this.generalService.alert(
        'Datos incompletos',
        'Por favor selecciona un archivo PDF válido.'
      );
      return;
    }

    this.facturaNombre = file.name;
    this.facturaArchivo = file;

    const reader = new FileReader();
    reader.onload = () => {
      const blob = new Blob([reader.result as ArrayBuffer], {
        type: 'application/pdf',
      });

      this.facturaSeleccionada = this.sanitizer.bypassSecurityTrustResourceUrl(
        URL.createObjectURL(blob)
      );
    };

    reader.readAsArrayBuffer(file);
  }

  eliminarFacturaPDF(): void {
    this.facturaSeleccionada = null;
    this.facturaArchivo = null;
    this.facturaNombre = '';
  }

  // ----- ----- -----
  // ## --- Optener ubicacón
  // ----- ----- -----
  lat: number = 20.608087318885715;
  lng: number = -100.3790006528186;
  private apiKey = 'AIzaSyBsua2qXeqnOMVe2PaOUuwaGk8tGtJU5co';
  ubicacion: [ciudad: string, estado: string, lat: number, lng: number] = [
    '',
    '',
    0,
    0,
  ];

  async miUbicacion() {
    this.generalService.loading('Obteniendo Ubicación...');
    try {
      const position = await Geolocation.getCurrentPosition();
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;

      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${this.lat},${this.lng}&key=${this.apiKey}`;

      this.http.get(url).subscribe((res: any) => {
        this.generalService.loadingDismiss();
        if (res.status === 'OK' && res.results.length > 0) {
          this.direccion = res.results[0].formatted_address;

          // Obtener address_components
          const components = res.results[0].address_components;

          let ciudad = '';
          let estado = '';

          for (let comp of components) {
            if (comp.types.includes('locality')) {
              ciudad = comp.long_name;
            }
            if (comp.types.includes('administrative_area_level_1')) {
              estado = comp.long_name;
            }
          }

          this.ubicacion = [ciudad, estado, this.lat, this.lng];
          // console.log('📍 Ubicación extraída:', this.ubicacion);
        } else {
          this.generalService.alert(
            'Error en la Ubicación',
            'No se pudo obtener la dirección.'
          );
          this.direccion = 'No se pudo obtener la dirección.';
        }
      });
    } catch (err) {
      this.generalService.loadingDismiss();
      this.direccion = 'Error al obtener ubicación.';
      console.error(err);
    }
  }

  getMapaUrl() {
    const base = `https://maps.google.com/maps?q=${this.lat},${this.lng}&z=16&output=embed`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(base);
  }
}

function maxWordsValidator(maxWords: number) {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value || '';
    const words = value.trim().split(/\s+/);
    return words.length > maxWords ? { maxWords: true } : null;
  };
}
