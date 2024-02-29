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
import { Platform } from '@angular/cdk/platform';

@Component({
  selector: 'app-multas',
  templateUrl: './multas.component.html',
  styleUrls: ['./multas.component.css'],
})
export class MultasComponent implements OnInit {
  // MODAL
  @ViewChild('template') miModal!: ElementRef;
  modalRefs: { [key: string]: BsModalRef } = {}; // Objeto para almacenar los modalRefs
  modalRef?: BsModalRef;
  //FORMULARIO
  form!: FormGroup;

  @ViewChild(DataTableDirective, { static: false })
  dtElement: any;
  dtElementModal: any;

  dtTrigger: Subject<void> = new Subject<void>();
  dtTriggerModal: Subject<void> = new Subject<void>();
  // dtOptionsModal: any;
  dtOptionsModal: DataTables.Settings = {};



  /// ================== VARIABLES ============================

  //DATA PARA ALMACENAR
  data: any;
  dataMulta: any;
  datosMulta: any;
  datosContribuyente: any;
  datosNombreContribuyente: any = [];
  datosDescripcion: any;

  // BUSQUEDA POR CODIGO CONTRIBUYENTE
  cnombre: string = '';
  r_descri: string = '';

  //BUSQUEDA POR CODIGO DE INFRACCION
  p_anypro: string = '';
  p_codinf: string = '';

  //BUSQUEDA DE CONTRIBUYENTE (MODAL)
  p_nomcontri: string = '';
  p_mensaje: string = '';

  //REGISTRO DE MULTA
  p_idcorr: number = 0;
  p_codcon: string = '';
  p_numnot: string = '';
  p_desinf: string = '';
  p_fecini: string = '';
  p_fecfin: string = '';

  //FORMULARIO RESOLUCION
  formResolucion!: FormGroup;
  cnumres: string = '';
  dfecres: string = '';
  dfecnot: string = '';
  observc: string = '';
  idcorrl: number = 0;
  submitted: boolean = false;

  //FORMULARIO ANULAR RESOLUCION
  formAnularResolucion!: FormGroup;
  p_obsresol_anular: string = '';
  submitted_anular: boolean = false;


  constructor(
    private appComponent: AppComponent,
    private serviceMaster: MasterService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private serviceSanidad: SanidadService,
    private sanidadService: SanidadService,
    private sigtaService: SigtaService,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private platform: Platform
  ) {
    this.appComponent.login = false;
  }

  ngOnInit(): void {
    this.dtOptionsModal = {
      paging: true,
      pagingType: 'numbers',
      info: false,
      scrollY: '320px',
      columnDefs: [
              { width: '600px', targets: 2 },
            ],
      language: {
        url: "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json"
      },
    }

    const fechaActual = new Date().toISOString().split('T')[0];

    this.p_fecini = fechaActual;
    this.p_fecfin = fechaActual;
    this.consultarMulta();

  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    this.dtTriggerModal.unsubscribe();
  }

  ngAfterViewInit() {
    this.dtTrigger.next();
    this.dtTriggerModal.next();
  }


  //OBTENGO LOS VALORES DE VARIABLES(MODAL)
  confirmClick(value: string) {
    this.p_codcon = value;
    this.obtenerNombrePorCod(value);
    this.modalService.hide(1);
  }

  confirmClickDescri(value: string) {
    this.p_codinf = value;
    this.obtenerDescriPorCod(value);
    this.modalService.hide(2);
  }


  //DIGITAR UNICAMENTE NUMEROS
  validarNumero(event: any): void {
    const keyCode = event.keyCode;
    if (keyCode < 48 || keyCode > 57) {
      event.preventDefault();
    }
  }

  //FILTROS DE BUSQUEDA POR FECHA 
  validarFechas() {
    if (this.p_fecini > this.p_fecfin) {
      this.errorSweetAlertFecha()
    } else {
      console.log("todo bien en las fechas");

    }
  }

  descargaExcel() {
    let btnExcel = document.querySelector(
      '#tablaAplicacion_wrapper .dt-buttons .dt-button.buttons-excel.buttons-html5'
    ) as HTMLButtonElement;
    btnExcel.click();
  }




  //=========================== MODALES =============================
  cerrarModal(modalKey: string) {
    if (this.modalRefs[modalKey]) {
      this.modalRefs[modalKey].hide(); // Cierra el modal si está definido
    }
  }

  listarAdm(template: TemplateRef<any>) {
    this.modalRefs['listar-administrado'] = this.modalService.show(template, { id: 1, class: 'modal-lg', backdrop: 'static', keyboard: false });
  }

  modalDescri(templateDescri: TemplateRef<any>) {
    this.modalRefs['listar-descri'] = this.modalService.show(templateDescri, { id: 2, class: 'modal-xl', backdrop: 'static', keyboard: false });
  }

  



  // ================== MENSAJES SWEETALERT =====================
  private getIconByErrorCode(errorCode: string): 'error' | 'warning' | 'info' | 'success' {
    switch (errorCode) {
      case '-100':
        return 'error';
      case '-101':
        return 'error';
      case '-102':
        return 'error';
      case '-103':
        return 'error';
      case '0':
        return 'success';
      default:
        return 'error';
    }
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
  private errorSweetAlertFecha() {
    Swal.fire({
      icon: 'info',
      text: 'Fecha Inicio no puede ser mayor a Fecha Fin',
    });
  }




  // ===================== FUNCIONES =====================

  // Obtener la fecha actual en formato "YYYY-MM-DD"
  getMaxDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  formatFecha(fechaBD: string): string {
    // Parse the date string
    const fecha = new Date(fechaBD);
    
    // Adjust for Peru Standard Time (UTC-5)
    fecha.setHours(fecha.getHours() - 5); // Assuming Peru is always UTC-5, adjust this if necessary

    // Extract date components
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const año = fecha.getFullYear();

    return `${dia}/${mes}/${año}`;
}




  limpiarCampos() {
    this.spinner.show()
    setTimeout(() => {
      this.spinner.hide();
    }, 200);

    this.p_codcon = '';
    this.cnombre = '';
    // this.p_fecini = '';
    // this.p_fecfin = '';
    this.p_codinf = '';
    this.r_descri = '';
    this.p_numnot = '';
  }

  editarDatosMulta(id: string | null) {
    if (id !== null) {
      console.log(id);
      this.router.navigate(['/multas/editar-multa/', id]);
    }

  }
  verDatosMulta(id: string | null) {
    if (id !== null) {
      console.log(id);
      this.router.navigate(['/multas/ver-multa/', id]);
    }
  }





  //====================== CONSULTAR/FILTRAR MULTA =====================
  consultarMulta() {
    let post = {
      p_codcon: this.p_codcon,
      p_numnot: this.p_numnot,
      p_codinf: this.p_codinf,
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

        // if (data && data.length > 0) {
          this.datosMulta = data;
        // } else {
        // }

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




  // ==================== ENCUENTRA NOMBRE DIGITANDO CODIGO ==================
  obtenerNombrePorCod(value: any) {
    let post = {
      p_codcon: this.p_codcon,
    };

    if (this.p_codcon != '') {

      this.spinner.show();

      this.sigtaService.obtenerNombrePorCod(post).subscribe({
        next: (data: any) => {
          this.spinner.hide();
          console.log(data);

          if (data && data.length > 0) {
            this.cnombre = data[0].cnombre;
          } else {
            this.errorSweetAlertCode();
            this.cnombre = '';
            this.p_codcon = '';
            console.log("noData");

          }
        },
        error: (error: any) => {
          this.spinner.hide();
          this.errorSweetAlertCode();
          this.cnombre = '';
          this.p_codcon = '';
          console.log(error);
        },
      });
    }

  }




  //========================= MODAL - BUSCAR DESCRIPCION ====================
  obtenerDescriPorCod(value: any) {
    const añoActual = new Date().getFullYear();

    let post = {
      p_anypro: añoActual.toString(),
      p_codinf: this.p_codinf,
    };

    if (this.p_codinf != '') {

      console.log(post);

      this.spinner.show();

      this.sigtaService.obtenerDescripcionPorCod(post).subscribe({
        next: (data: any) => {
          this.spinner.hide();
          console.log(data);

          if (this.p_codinf == '') {
            console.log("vacio codinf");
            this.errorSweetAlertCode()
            this.r_descri = '';
          } else {
            if (data && data.length > 0) {
              this.r_descri = data[0].r_descri;
            } else {
              this.errorSweetAlertCode();
              this.r_descri = '';
              this.p_codinf = '';
            }
          }


        },
        error: (error: any) => {
          this.spinner.hide();
          this.errorSweetAlertCode();
          this.r_descri = '';
          this.p_codinf = '';
          console.log(error);
        },
      });
    }

  }





  // ======================= MODAL - BUSCAR CONTRIBUYENTE ========================
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






  //====================== RESOLUCIÓN =====================

  setFormResolucion() {
    this.formResolucion = this.fb.group({
      cnumres: ['', [Validators.required]],
      dfecres: ['', [Validators.required]],
      dfecnot: ['', [Validators.required]],
      observc: ['', [Validators.required]],
    })
  }

  rellenarCerosResolucion() {
    this.cnumres = this.cnumres.padStart(6, '0');
  }

  modalRegistrarResolucion(template: TemplateRef<any>, data: any) {
    this.idcorrl = data.id_corrl;
    this.submitted = false;
    this.setFormResolucion();
    this.modalRefs['modalRegistrarRes'] = this.modalService.show(template, { id: 3, class: 'modal-lg', backdrop: 'static', keyboard: false });
  }

  guardarResolucion() {
    this.submitted = true;
    if (this.formResolucion.valid) {

      let post = {
        idcorrl: this.idcorrl,
        cnumres: this.cnumres,
        dfecres: this.dfecres,
        dfecnot: this.dfecnot,
        cusuari: 0,
        observc: this.observc
      }

      console.log(post);

      // this.sigtaService.registrarResolucion(post).subscribe({
      //   next: (data: any) => {

      //     console.log(data);

      //   },
      //   error: (error: any) => {
      //     this.spinner.hide();
      //     console.log(error);
      //   },
      // });
    }
  }






  // ===================== ANULAR RESOLUCION ====================
  setFormAnularResolucion() {
    this.formAnularResolucion = this.fb.group({
      p_obsresol_anular: ['', [Validators.required]],
    })
  }

  modalAnularResolucion(template: TemplateRef<any>, data: any) {
    this.dataMulta = data;
    this.submitted = false;
    this.setFormAnularResolucion();
    this.modalRefs['modalAnularRes'] = this.modalService.show(template, { id: 4, class: 'modal-lg', backdrop: 'static', keyboard: false });
  }

  submitAnularResolucion() {
    this.submitted = true;
    if (this.formAnularResolucion.valid) {
    }
  }
}
