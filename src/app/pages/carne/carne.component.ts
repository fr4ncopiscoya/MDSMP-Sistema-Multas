import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { MasterService } from 'src/app/services/master.service';
import { SanidadService } from 'src/app/services/sanidad.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-carne',
  templateUrl: './carne.component.html',
  styleUrls: ['./carne.component.css']
})
export class CarneComponent implements OnInit {
  modalRef!: BsModalRef;
  @ViewChild('contenidoDiv', { static: false }) contenidoDiv!: ElementRef;
  @ViewChild(DataTableDirective, { static: false }) dataTable!: DataTableDirective;
  @ViewChild(DataTableDirective, { static: false }) dtElement!: DataTableDirective;

  /* dtElement: any; */
  dtTrigger: Subject<void> = new Subject<void>();
  dtOptions: any = {
    columnDefs: [
      { width: '5px', targets: 0 },
      { width: '5px', targets: 1 },
      { width: '600px', targets: 2 },
      { width: '5px', targets: 3 },
      { width: '10px', targets: 4 },
      { width: '200px', targets: 5 },
      { width: '350px', targets: 6 },
    ],
    dom: 'Bfrtip',
    buttons: [
      {
        extend: 'excelHtml5',
        text: 'Exportar a Excel',
        filename: 'CARNET', // Nombre personalizado del archivo
      },
    ],
    lengthChange: false,
    searching: false,
    lengthMenu: [15],
    paging: true,
    language: {
      url: "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json"
    },
    responsive: false,
  }

  dataprueba: any;

  //Variables Globales
  dataCarnet: any;
  datosTipoDocumento: any;
  datosGiro: any;
  datosOcupacion: any;

  carneimg: string = '';

  //Listado de Persona
  selectedPais: string = '';

  p_car_id: number = 0;
  p_tdi_id: number = 0;
  p_per_numdoi: string = '';
  p_act_id: string = '';
  p_ocu_id: string = '';
  p_car_numero: number = 0;
  p_car_fecini: string = '';
  p_car_fecfin: string = '';
  p_car_activo: string = '';

  constructor(private modalService: BsModalService, private appComponent: AppComponent
    , private serviceMaster: MasterService
    , private router: Router
    , private route: ActivatedRoute
    , private spinner: NgxSpinnerService
    , private serviceSanidad: SanidadService) {
    this.appComponent.login = false;
  }

  ngOnInit(): void {
    this.setTodayDate();
    this.ListarCarne();
    this.listarTipoDocumentoIdentidad();
    this.listarGiro();
    this.listarOcupacion();
  }
  
  
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
  
  ngAfterViewInit() {
    this.dtTrigger.next();
    console.log(this.dataTable);
    console.log(this.contenidoDiv);
  }
  
  setTodayDate() {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
  
    this.p_car_fecini = formattedDate;
    this.p_car_fecfin = formattedDate;
  }
  
  descargaExcel() {
    let btnExcel = document.querySelector('#tablaAplicacion_wrapper .dt-buttons .dt-button.buttons-excel.buttons-html5') as HTMLButtonElement;
    btnExcel.click();
  }

  openModalWithClass(template: TemplateRef<any>,data:any) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg' })
    );
    this.dataprueba = data;
  }

  ListarCarne() {
    this.spinner.show();
    const data_post = {
      p_car_id: this.p_car_id,
      p_tdi_id: this.p_tdi_id,
      p_per_numdoi: this.p_per_numdoi,
      p_act_id: this.p_act_id,
      p_ocu_id: this.p_ocu_id,
      p_car_numero: this.p_car_numero,
      p_car_fecini: this.p_car_fecini,
      p_car_fecfin: this.p_car_fecfin,
      p_car_activo: this.p_car_activo,
    };

    this.serviceSanidad.listarCarne(data_post).subscribe({
      next: (data: any) => {
        this.dataCarnet = data;
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger.next();
        });
        setTimeout(() => {
          this.spinner.hide();
        }, 1000);
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  listarTipoDocumentoIdentidad() {
    let post = {
      p_tdi_id: 0,
      p_tpe_id: 1
    };
    this.serviceMaster.listarTipoDocumento(post).subscribe({
      next: (data: any) => {
        this.datosTipoDocumento = data;
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  listarGiro() {
    let post = {};
    this.serviceSanidad.listarGiro(post).subscribe({
      next: (data: any) => {
        console.log(data);
        this.datosGiro = data;
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  listarOcupacion() {
    let post = {};
    this.serviceSanidad.listarOcupacion(post).subscribe({
      next: (data: any) => {
        console.log(data);
        this.datosOcupacion = data;
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  DeImagenURLaBase64(nomfile: string) {
    let post = {
      ruta: nomfile
    };

    this.serviceSanidad.DeImagenURLaBase64(post).subscribe({
      next: (data: any) => {
        console.log(data);
        this.carneimg = data;
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  convertirAPDF() {
    const content: HTMLDivElement | null = this.contenidoDiv.nativeElement;

    if (content) {
      const ventanaImpresion = window.open('', '_blank');
      ventanaImpresion?.document.write(content.innerHTML);
      ventanaImpresion?.document.close();

      // Comprobación de nulabilidad antes de intentar asignar a onafterprint
      if (ventanaImpresion?.onafterprint) {
        ventanaImpresion.onafterprint = () => {
          ventanaImpresion?.close();
        };
      } else {
        console.error('La propiedad onafterprint no está definida en la ventana de impresión.');
      }
      setTimeout(() => {
        ventanaImpresion?.print();
      }, 1000);
    } else {
      console.error('No se encontró el elemento con el ID "contenido-a-convertir".');
    }
  }

}