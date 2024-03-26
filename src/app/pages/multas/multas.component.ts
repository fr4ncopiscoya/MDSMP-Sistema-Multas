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
import * as XLSX from 'xlsx';



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
  dataUsuario: any;
  datosFechas: any;

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

  error: string = ''

  //DATOS FECHAS
  p_tipfec: number = 0;
  mrf_id: number = 0;
  mrf_descri: string = '';

  //DATOS USUARIO
  nomusi: string = '';
  nomusm: string = '';
  fecins: string = '';
  fecmod: string = '';


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
    private platform: Platform,
  ) {
    this.appComponent.login = false;
    this.dataUsuario = localStorage.getItem('dataUsuario');
  }

  ngOnInit(): void {
    this.dtOptionsModal = {
      // paging: true,
      // pagingType: 'numbers',
      info: false,
      scrollY: '400px',
      columnDefs: [
        { width: '600px', targets: 2 },
      ],
      language: {
        url: "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json"
      },
    }

    this.listarFechas();

    const fechaActual = new Date().toISOString().split('T')[0];

    // this.p_fecini = fechaActual;
    // this.p_fecfin = fechaActual;
    // this.consultarMulta();
    /* setTimeout(() => {
      (document.querySelector('.dataTables_scrollBody') as HTMLElement).style.height = '100%';
    }, 1000); */
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    this.dtTriggerModal.unsubscribe();
  }

  ngAfterViewInit() {
    this.dtTrigger.next();
    this.dtTriggerModal.next();


    /* (document.querySelector('.dataTables_scrollBody') as HTMLElement).style.top = '150px'; */
  }


  exportarExcel() {
    let array = [];

    for (let i = 0; i < this.datosMulta.length; i++) {
      array.push({
        'Nº Notificación': this.datosMulta[i].nnumnot || "",
        'Código Administrado': this.datosMulta[i].ccontri || "",
        'Descripción Multa': this.datosMulta[i].dmulta || "",
        'Nº Resolución': this.datosMulta[i].cnumres || "",
        'Fecha de Notificiación': this.datosMulta[i].dfecnot || "",
        'Monto': this.datosMulta[i].nmonto || "",
        'Estado': this.datosMulta[i].estreg || ""
      });
    }

    const fileName = "Reporte.xlsx";
    const ws = XLSX.utils.json_to_sheet(array);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Hoja1");

    XLSX.writeFile(wb, fileName);
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

  onInputChange(event: any) {
    event.target.value = event.target.value.toUpperCase();
  }

  onSelectionDate(event: any) {
    this.mrf_id = event.mrf_id
    console.log(this.mrf_id)
  }

  //FILTROS DE BUSQUEDA POR FECHA 
  busquedaTipoFecha() {
    console.log('llegas');
    const fechaActual = new Date().toISOString().split('T')[0];

    const disabled_fecini = document.getElementById('fecini') as HTMLInputElement
    const disabled_fecfin = document.getElementById('fecfin') as HTMLInputElement

    if (this.mrf_id != 0) {
      disabled_fecini.classList.remove('disabled-color');
      disabled_fecfin.classList.remove('disabled-color');
      disabled_fecini.removeAttribute('disabled')
      disabled_fecfin.removeAttribute('disabled')
      this.p_fecini = fechaActual;
      this.p_fecfin = fechaActual;

    } else {
      disabled_fecini.classList.add('disabled-color')
      disabled_fecfin.classList.add('disabled-color')
      disabled_fecini.removeAttribute('disabled')
      disabled_fecfin.removeAttribute('disabled')
      this.p_fecini = '';
      this.p_fecfin = '';
    }
  }


  // validarFechas(): boolean {
  //   let result = false;

  //   console.log(this.p_fecfin);
  //   console.log(this.p_fecini);
  //   if (this.p_fecini != '' && this.p_fecfin != '') {

  //     if (this.p_fecini.length < 7 || this.p_fecfin.length < 7) {
  //       this.errorSweetAlertFechaIncompleta()
  //       result = true;
  //     } else {
  //       if (this.p_fecini > this.p_fecfin) {
  //         this.errorSweetAlertFecha();
  //         result = true;

  //       } else {
  //         console.log("todo bien en las fechas");
  //         result = false;
  //       }
  //     }
  //   } else {
  //     console.log('fuera del if');

  //   }

  //   return result;
  // }

  validarFechas(): boolean {
    let result = false;

    console.log(this.p_fecfin);
    console.log(this.p_fecini);
    if (this.p_fecini != '' && this.p_fecfin != '') {
      // result = true;

      if (this.p_fecini.length < 7 || this.p_fecfin.length < 7) {
        this.errorSweetAlertFechaIncompleta()
        result = true;
      } else {
        if (this.p_fecini > this.p_fecfin) {
          this.errorSweetAlertFecha();
          result = true;

        } else {
          console.log("todo bien en las fechas");
          result = false;
        }
      }
    } else {
      console.log('fuera del if');
      // result = false;
      // this.errorSweetAlertFiltros();

    }

    return result;
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

  // modalInformeFinal(modalInformeFinal: TemplateRef<any>) {
  //   this.modalRefs['modalInformeFinal'] = this.modalService.show(modalInformeFinal, { id: 7, class: 'modal-xl', backdrop: 'static', keyboard: false });
  // }

  modalAnularMulta(template: TemplateRef<any>, data: any) {
    this.idcorrl = data.id_corrl;
    console.log(this.idcorrl);

    this.modalRefs['modalAnularMulta'] = this.modalService.show(template, { id: 6, class: '', backdrop: 'static', keyboard: false });
    this.sigtaService.idcorrl = this.idcorrl;
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
      case '-104':
        return 'error';
      case '-105':
        return 'error';
      case '0':
        return 'success';
      default:
        return 'error';
    }
  }

  private errorSweetAlert(icon: 'error' | 'warning' | 'info' | 'success' = 'error') {
    Swal.fire({
      icon: icon,
      text: this.error || 'Hubo un error al procesar la solicitud',
    });
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

  private errorSweetAlertFechaIncompleta() {
    Swal.fire({
      icon: 'info',
      text: 'Fecha Incompleta',
    });
  }

  private errorSweetAlertFiltros() {
    Swal.fire({
      icon: 'info',
      text: 'Por favor ingrese un filtro de busqueda',
    });
  }




  // ===================== FUNCIONES =====================

  // Obtener la fecha actual en formato "YYYY-MM-DD"
  getMaxDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  // formatFecha(fechaBD: string): string {
  //   const fecha = new Date(fechaBD);

  //   fecha.setHours(fecha.getHours() - 5); 

  //   // Extract date components
  //   const dia = fecha.getDate().toString().padStart(2, '0');
  //   const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
  //   const año = fecha.getFullYear();

  //   return `${dia}/${mes}/${año}`;
  // }

  getDataUser(event: MouseEvent, data: any) {
    console.log(data);

    const trs = document.querySelectorAll('tbody tr') as NodeListOf<HTMLTableRowElement>;
    trs.forEach((tr: HTMLTableRowElement) => {
      tr.classList.remove('active-color');
    });

    const target = event.target as HTMLElement;
    const tr = target.closest('tr') as HTMLTableRowElement | null;
    if (tr) {
      tr.classList.add('active-color');
    }

    this.nomusi = data.nomusi;
    this.nomusm = data.nomusm;
    this.fecins = data.fecins;
    this.fecmod = data.fecmod;

  }

  validarBotones(data: any) {
    //Multa / Notificacion
    const verMultaElements = document.querySelectorAll('.verMulta');
    const editarMultaElements = document.querySelectorAll('.editarMulta');
    const anularMultaElements = document.querySelectorAll('.anularMulta');
    const reganuMultaElements = document.querySelectorAll('.registraranularInfo');

    //Resolucion
    const verResElements = document.querySelectorAll('.verRes');
    const anularResElements = document.querySelectorAll('.anularRes');
    const registrarResElements = document.querySelectorAll('.registrarRes');

    if (data.estreg === "Registrado" && data.cnumres > 0) {
      //Multa
      verMultaElements.forEach((element: Element) => {
        (element as HTMLElement).style.display = '';
      });
      editarMultaElements.forEach((element: Element) => {
        (element as HTMLElement).style.display = 'none';
      });
      anularMultaElements.forEach((element: Element) => {
        (element as HTMLElement).style.display = 'none';
      });
      reganuMultaElements.forEach((element: Element) => {
        (element as HTMLElement).style.display = 'none';
      });

      //Resolucion
      verResElements.forEach((element: Element) => {
        (element as HTMLElement).style.display = '';
      });
      anularResElements.forEach((element: Element) => {
        (element as HTMLElement).style.display = '';
      });
      registrarResElements.forEach((element: Element) => {
        (element as HTMLElement).style.display = 'none';
      });
    } else {
      verMultaElements.forEach((element: Element) => {
        (element as HTMLElement).style.display = '';
      });
      editarMultaElements.forEach((element: Element) => {
        (element as HTMLElement).style.display = '';
      });
      anularMultaElements.forEach((element: Element) => {
        (element as HTMLElement).style.display = '';
      });
      reganuMultaElements.forEach((element: Element) => {
        (element as HTMLElement).style.display = '';
      });

      verResElements.forEach((element: Element) => {
        (element as HTMLElement).style.display = '';
      });
      anularResElements.forEach((element: Element) => {
        (element as HTMLElement).style.display = '';
      });
      registrarResElements.forEach((element: Element) => {
        (element as HTMLElement).style.display = '';
      });
    }

    if (data.estreg != 'Registrado') {
      //Multa
      verMultaElements.forEach((element: Element) => {
        (element as HTMLElement).style.display = '';
      });
      editarMultaElements.forEach((element: Element) => {
        (element as HTMLElement).style.display = 'none';
      });
      anularMultaElements.forEach((element: Element) => {
        (element as HTMLElement).style.display = 'none';
      });
      reganuMultaElements.forEach((element: Element) => {
        (element as HTMLElement).style.display = 'none';
      });

      verResElements.forEach((element: Element) => {
        (element as HTMLElement).style.display = '';
      });
      anularResElements.forEach((element: Element) => {
        (element as HTMLElement).style.display = 'none';
      });
      registrarResElements.forEach((element: Element) => {
        (element as HTMLElement).style.display = 'none';
      });
      reganuMultaElements.forEach((element: Element) => {
        (element as HTMLElement).style.display = 'none';
      });

    }


  }


  validarMultaAnular(data: any) {
    const verMultaElements = document.querySelectorAll('.verMulta');
    const editarMultaElements = document.querySelectorAll('.editarMulta');
    const anularMultaElements = document.querySelectorAll('.anularMulta');

    if (data.estreg != "Registrado") {
      verMultaElements.forEach((element: Element) => {
        (element as HTMLElement).style.display = '';
      });
      editarMultaElements.forEach((element: Element) => {
        (element as HTMLElement).style.display = 'none';
      });
      anularMultaElements.forEach((element: Element) => {
        (element as HTMLElement).style.display = 'none';
      });
    } else {
      verMultaElements.forEach((element: Element) => {
        (element as HTMLElement).style.display = '';
      });
      editarMultaElements.forEach((element: Element) => {
        (element as HTMLElement).style.display = '';
      });
      anularMultaElements.forEach((element: Element) => {
        (element as HTMLElement).style.display = '';
      });
    }
  }

  validarReso(data: any) {
    const verResElements = document.querySelectorAll('.verRes');
    const anularResElements = document.querySelectorAll('.anularRes');
    const registrarResElements = document.querySelectorAll('.registrarRes');

    if (data.cnumres === "") {
      verResElements.forEach((element: Element) => {
        (element as HTMLElement).style.display = 'none';
      });
      anularResElements.forEach((element: Element) => {
        (element as HTMLElement).style.display = 'none';
      });
      registrarResElements.forEach((element: Element) => {
        (element as HTMLElement).style.display = '';
      });
    } else {
      verResElements.forEach((element: Element) => {
        (element as HTMLElement).style.display = '';
      });
      anularResElements.forEach((element: Element) => {
        (element as HTMLElement).style.display = '';
      });
      registrarResElements.forEach((element: Element) => {
        (element as HTMLElement).style.display = 'none';
      });
    }
  }

  goBackToMultas() {
    console.log(this.error);
    setTimeout(() => {
      switch (this.error) {
        case 'Resolucion Registrada Correctamente':
          this.consultarMulta();
          this.modalService.hide(3)
          // location.reload();
          break;
        default:
          //
          break;
      }
    }, 800);
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
      this.router.navigate(['/multas/editar-multa'], { queryParams: { id: id } });
      console.log(id);
      // this.router.navigate(['/multas/editar-multa/', id]);
    } else {
      console.log('ni pases');

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
    // let result;
    // result = this.validarFechas();
    // console.log(result);


    // if (!result) {

    let post = {
      p_codcon: this.p_codcon,
      p_numnot: this.p_numnot,
      p_codinf: this.p_codinf,
      p_tipfec: Number(this.mrf_id),
      p_fecini: this.p_fecini.toString(),
      p_fecfin: this.p_fecfin.toString(),
      p_idcorr: this.p_idcorr,
    };
    console.log(post);

    // if (this.p_codcon === '' || this.p_codinf === '' || this.p_numnot === '') {
    if (this.mrf_id > 0 || this.p_codcon != '' || this.p_codinf != '' || this.p_numnot != '') {
      this.spinner.show();

      this.sigtaService.consultarMulta(post).subscribe({
        next: (data: any) => {
          this.spinner.hide();
          console.log(data);

          this.datosMulta = data;

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
    } else {
      this.spinner.hide();
      this.errorSweetAlertFiltros();
    }
    // } 
    // else {
    //   this.spinner.hide();
    //   // console.log(error);
    //   this.errorSweetAlertFiltros();
    // }

    // }
  }

  consultarMultaExport() {
    console.log('llegasteebport');

    let result;
    result = this.validarFechas();
    console.log(result);

    if (!result) {

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

      this.sigtaService.consultarMultaExport(post).subscribe({
        next: (data: any) => {
          console.log(data);

          this.datosMulta = data;

        },
        error: (error: any) => {
          console.log(error);
        },
      });
    }
  }

  listarFechas() {
    let post = {

    };

    this.sigtaService.listarFechas(post).subscribe({
      next: (data: any) => {
        console.log(data);

        this.datosFechas = data;
        // this.mrf_descri = data[0].mrf_descri;
        // this.mrf_id = data[0].mrf_id;



      },
      error: (error: any) => {
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

  modalVerResolucion(template: TemplateRef<any>, data: any) {
    this.idcorrl = data.id_corrl;
    console.log(this.idcorrl);

    this.modalRefs['modalVerResolucion'] = this.modalService.show(template, { id: 4, class: 'modal-lg', backdrop: 'static', keyboard: false });
    this.sigtaService.idcorrl = this.idcorrl;
  }

  modalInforme(template: TemplateRef<any>, data: any) {
    this.idcorrl = data.id_corrl;
    console.log(this.idcorrl);

    this.modalRefs['modalInformeFinal'] = this.modalService.show(template, { id: 7, class: '', backdrop: 'static', keyboard: false });
    this.sigtaService.idcorrl = this.idcorrl;
  }

  guardarResolucion() {
    let storedData = localStorage.getItem("dataUsuario");
    if (storedData !== null) {
      this.dataUsuario = JSON.parse(storedData);
    }

    this.submitted = true;
    if (this.formResolucion.valid) {

      let post = {
        idcorrl: this.idcorrl,
        cnumres: this.cnumres,
        cusuari: this.dataUsuario.codusu,
        dfecres: this.dfecres,
        dfecnot: this.dfecnot,
        observc: this.observc
      }

      console.log(post);

      this.sigtaService.registrarResolucion(post).subscribe({
        next: (data: any) => {
          this.error = data[0].mensa;
          const errorCode = data[0].error;
          console.log(this.error);

          // Selecciona el icono según el código de error
          const icon = this.getIconByErrorCode(errorCode);

          // Muestra el SweetAlert con el icono y el mensaje de error
          this.errorSweetAlert(icon);
          this.goBackToMultas()

        },
        error: (error: any) => {
          this.spinner.hide();
          console.log(error);
        },
      });
    }
  }






  // ===================== ANULAR RESOLUCION ====================
  setFormAnularResolucion() {
    this.formAnularResolucion = this.fb.group({
      p_obsresol_anular: ['', [Validators.required]],
    })
  }

  modalAnularResolucion(template: TemplateRef<any>, data: any) {
    this.idcorrl = data.id_corrl;
    // this.dataMulta = data;
    // console.log(data);
    console.log(this.idcorrl);


    this.submitted = false;
    this.setFormAnularResolucion();
    this.modalRefs['modalAnularRes'] = this.modalService.show(template, { id: 5, class: 'modal-lg', backdrop: 'static', keyboard: false });
    this.sigtaService.idcorrl = this.idcorrl;
  }

  submitAnularResolucion() {
    this.submitted = true;
    if (this.formAnularResolucion.valid) {

    }
  }
}
