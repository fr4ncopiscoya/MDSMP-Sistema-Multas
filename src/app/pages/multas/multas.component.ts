import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  AfterViewInit,
  ElementRef,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { MasterService } from 'src/app/services/master.service';
import { SanidadService } from 'src/app/services/sanidad.service';
import { SigtaService } from 'src/app/services/sigta.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-multas',
  templateUrl: './multas.component.html',
  styleUrls: ['./multas.component.css'],
})
export class MultasComponent implements OnInit {
  // MODAL
  @ViewChild('template') miModal!: ElementRef;
  modalRef?: BsModalRef;
  //FORMULARIO
  form!: FormGroup;
  @ViewChild(DataTableDirective, { static: false })
  dtElement: any;
  dtElementModal: any;

  dtTrigger: Subject<void> = new Subject<void>();
  dtTriggerModal: Subject<void> = new Subject<void>();
  dtOptionsModal: any;
  dtOptions: any = {
    columnDefs: [
      { width: '2px', targets: 0 },
      { width: '2px', targets: 1 },
      { width: '2px', targets: 2 },
      { width: '200px', targets: 3 },
      { width: '400px', targets: 4 },
      { width: '2px', targets: 5 },
      { width: '2px', targets: 6 },
      { width: '2px', targets: 7 },
      { width: '2px', targets: 8 },
      { width: '2px', targets: 9 },
    ],

    paging: true,
    language: {
      url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json',
    },
    responsive: false,
  };

  //Variables Globales

  datosMulta: any;
  datosContribuyente: any;
  datosNombreContribuyente: any = [];
  datosDescripcion: any;
  cnombre: string = '';
  r_descri: string = '';

  data: any;

  p_idcorr: number = 0;
  p_codcon: string = '';
  p_numnot: string = '';
  p_desinf: string = '';
  p_fecini: string = '';
  p_fecfin: string = '';

  p_anypro: string = '';
  p_codinf: string = '';

  p_nomcontri: string = '';
  p_mensaje: string = '';

  constructor(
    private appComponent: AppComponent,
    private serviceMaster: MasterService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private serviceSanidad: SanidadService,
    private sanidadService: SanidadService,
    private sigtaService: SigtaService,
    private modalService: BsModalService
  ) {
    this.appComponent.login = false;
  }

  ngOnInit(): void {
    const fechaActual = new Date().toISOString().split('T')[0];

    this.p_fecini = fechaActual;
    this.p_fecfin = fechaActual;
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    this.dtTriggerModal.unsubscribe();
  }

  ngAfterViewInit() {
    this.dtTrigger.next();
    this.dtTriggerModal.next();
    console.log('MODL');
    $(this.miModal.nativeElement).on('shown.bs.modal', () => {
      this.dtOptionsModal = {
        columnDefs: [
          { width: '400px', targets: 3 },
          { width: '400px', targets: 4 },
        ],
        dom: 'Bfrtip',
        buttons: [
          {
            extend: 'excelHtml5',
            text: 'Exportar a Excel',
            filename: 'MULTA', // Nombre personalizado del archivo
          },
        ],
        lengthChange: false,
        searching: false,
        lengthMenu: [15],
        paging: true,
        language: {
          url: '//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json',
        },
        responsive: false,
      };
      // Inicializa DataTables en el modal
      $(this.miModal.nativeElement)
        .find('tabla')
        .DataTable(this.dtOptionsModal);
    });
  }


  //GLOBAL

  confirmClick(value: string) {
    this.p_codcon = value;
    this.obtenerNombrePorCod(value);
    this.modalService.hide(1);
  }

  confirmClickDescri(value: string) {
    this.p_codinf = value;
    this.obtenerDescriPorCod(value);
    this.modalService.hide(1);
  }

  validarNumero(event: any): void {
    const keyCode = event.keyCode;
    if (keyCode < 48 || keyCode > 57) {
      event.preventDefault();
    }
  }

  // validarCodAdm() {
  //   if (this.p_anypro == '') {
  //     // this.errorSweetAlertDate();
  //     this.p_codinf = '';
  //     this.dareas = '';
  //     this.nmonto = '';
  //     this.r_descri = '';

  //   }

  descargaExcel() {
    let btnExcel = document.querySelector(
      '#tablaAplicacion_wrapper .dt-buttons .dt-button.buttons-excel.buttons-html5'
    ) as HTMLButtonElement;
    btnExcel.click();
  }

  asignarPerfil(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { id: 1 , class: 'modal-lg'});
  }

  modalDescri(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { id: 1 , class: 'modal-xl'});
  }

  formatFecha(fechaBD: string): string {
    const fecha = new Date(fechaBD);
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Nota: en JavaScript, los meses van de 0 a 11
    const año = fecha.getFullYear();

    return `${dia}/${mes}/${año}`;
  }

  private errorSweetAlertCode() {
    Swal.fire({
      icon: 'error',
      text: 'Por favor ingrese un código válido',
    });
  }
  private errorSweetAlertData() {
    Swal.fire({
      icon: 'info',
      text: 'No se encontraron datos en su busqueda',
    });
  }

  getMaxDate(): string {
    // Obtener la fecha actual en formato "YYYY-MM-DD"
    return new Date().toISOString().split('T')[0];
  }



  //METODOS

  editarDatosMulta(id: string | null) {
    if (id !== null) {
      this.router.navigate(['/multas/editar-multa/', id]);
    }
  }


  consultarMulta() {
    let post = {
      p_codcon: this.p_codcon,
      p_numnot: this.p_numnot,
      p_codinf: this.r_descri,
      p_fecini: this.p_fecini.toString(),
      p_fecfin: this.p_fecfin.toString(),
      p_idcorr: this.p_idcorr,
    };
    console.log(post);
    this.spinner.show();

    this.sigtaService.consultarMulta(post).subscribe({
      next: (data: any) => {
        this.spinner.hide();
        console.log(data);

        if (data && data.length > 0 && data) {
          this.datosMulta = data;
        } else {
          this.errorSweetAlertData();
        }

        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger.next();
        });
      },
      error: (error: any) => {
        this.errorSweetAlertData();
        this.spinner.hide();
        console.log(error);
      },
    });
  }

  obtenerNombrePorCod(value:any) {
    let post = {
      p_codcon: this.p_codcon,
    };

    this.spinner.show();

    this.sigtaService.obtenerNombrePorCod(post).subscribe({
      next: (data: any) => {
        this.spinner.hide();
        console.log(data);

        if (data && data.length > 0 && data[0].cnombre) {
          this.cnombre = data[0].cnombre;
        } else {
          this.errorSweetAlertCode();
        }
      },
      error: (error: any) => {
        this.spinner.hide();
        this.errorSweetAlertCode();
        console.log(error);
      },
    });
  }

  obtenerDescriPorCod(value:any) {
    const añoActual = new Date().getFullYear();

    let post = {
      p_anypro: añoActual.toString(),
      p_codinf: this.p_codinf,
    };

    console.log(post);

    this.spinner.show();

    this.sigtaService.obtenerDescripcionPorCod(post).subscribe({
      next: (data: any) => {
        this.spinner.hide();
        console.log(data);


        if (data && data.length > 0 && data[0].r_descri) {
          this.r_descri = data[0].r_descri;
        } else {
          this.errorSweetAlertCode();
        }

      },
      error: (error: any) => {
        this.spinner.hide();
        this.errorSweetAlertCode();
        console.log(error);
      },
    });
  }

  busContribuyente() {
    let post = {
      p_nomcontri: this.p_nomcontri,
      p_mensaje: this.p_mensaje,
    };

    this.spinner.show();

    console.log(post);
    this.sigtaService.busContribuyente(post).subscribe({
      next: (data: any) => {
        this.spinner.hide();
        console.log();

        this.datosContribuyente = data;
        this.dtElementModal.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTriggerModal.next();
        });
      },
      error: (error: any) => {
        this.spinner.hide();
        console.log(error);
      },
    });
  }

  buscarMulta() {
    let post = {
      p_codcon: this.p_codcon,
      p_numnot: this.p_numnot,
      p_desinf: this.p_desinf,
      p_fecini: this.p_fecini,
      p_fecfin: this.p_fecfin,
    };

    console.log(post);
    this.sigtaService.buscarMulta(post).subscribe({
      next: (data: any) => {
        this.spinner.show();
        console.log();

        this.datosMulta = data;
        this.dtElementModal.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTriggerModal.next();
        });
        setTimeout(() => {
          this.spinner.hide();
        }, 1000);
      },
      error: (error: any) => {
        this.spinner.hide();
        console.log(error);
      },
    });
  }
}
