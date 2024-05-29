import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  AfterViewInit,
  ElementRef,
  HostListener,
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
import { Observable } from 'rxjs';
import { TRANSITION_DURATIONS } from 'ngx-bootstrap/modal/modal-options.class';



@Component({
  selector: 'app-coactivo',
  templateUrl: './coactivo.component.html',
  styleUrls: ['./coactivo.component.css']
})
export class CoactivoComponent implements OnInit {
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
  datosExpediente: any;
  datosContribuyente: any;
  datosNombreContribuyente: any = [];
  datosDescripcion: any;
  dataUsuario: any;
  datosFechas: any;

  //COSTAS
  datosCostas: any;
  datosGastos: any;

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

  //DATOS LISTA CUENTA CORRIENTE
  p_numexp: string = '';
  // p_fecini: string = '';
  // p_fecfin: string = '';
  p_codadm: string = '';

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

  p_concid: number = 0;
  exp_id: number = 0;

  botonesExpediente: any;

  //BOTONES
  btnNuevo: number;
  btnVer: number;
  btnEditar: number;
  btnAnular: number;
  btnPdf: number;
  btnExcel: number;

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
    this.botonesExpediente = this.appComponent.botonesPermisos;
  }

  // Redirige a la ruta especial al presionar F5
  // @HostListener('document:keydown', ['$event'])
  // handleKeyboardEvent(event: KeyboardEvent) {
  //   if (event.key === 'F5') {
  //     this.router.navigate(['/dashboard']);
  //   }
  // }

  ngOnInit(): void {
    this.dtOptionsModal = {
      // paging: true,
      // pagingType: 'numbers',
      info: false,
      scrollY: '500px',
      columnDefs: [
        { width: '500px', targets: 2 },
      ],
      language: {
        url: "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json"
      },
    }

    this.botonesExpediente = this.appComponent.botonesPermisos
    this.listarFechas();

    const fechaActual = new Date().toISOString().split('T')[0];

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

  validacionBotones() {
    const botonesCoactivo = JSON.parse(localStorage.getItem('menu-items'))
    // const botonesMultas = JSON.parse(this.botonesMultas);

    botonesCoactivo.forEach((item: any) => {
      switch (item.bot_id) {
        case 1:
          this.btnNuevo = item.apb_activo
          break;
        case 2:
          this.btnEditar = item.apb_activo
          break;
        case 3:
          this.btnVer = item.apb_activo
          break;
        case 4:
          this.btnAnular = item.apb_activo;
          break;
        case 5:
          this.btnExcel = item.apb_activo
          break;
        case 10:
          this.btnPdf = item.apb_activo
          break;
        default:
          break;
      }
    })
  }


  exportarccPDF() {
    let post = {
      p_codigo: this.p_codcon,
    };



    this.sigtaService.exportarccPDF(post).subscribe(
      (response: any) => { // Cambiado a 'any' en lugar de 'Blob'
        // Crea un objeto URL para el Blob
        const blobUrl = window.URL.createObjectURL(response);

        // Crea un enlace temporal
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = 'CuentaCorriente.pdf'; // Nombre del archivo que se descargará

        // Agrega el enlace al DOM y haz clic en él
        document.body.appendChild(link);
        link.click();

        // Elimina el enlace del DOM después de la descarga
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      },
      (error: any) => {
        // Maneja el error aquí
        console.error('Error al exportar PDF:', error);
        // Puedes mostrar un mensaje de error al usuario si lo deseas
      }
    );
  }





  exportarExcel() {
    let array = [];

    for (let i = 0; i < this.datosExpediente.length; i++) {
      array.push({
        'Descri. Concepto': this.datosExpediente[i].nnumnot || "",
        'Año Deuda': this.datosExpediente[i].ccontri || "",
        'Monto': this.datosExpediente[i].dmulta || "",
        'Monto Pendiente': this.datosExpediente[i].cnumres || "",
        'Num. Notificación': this.datosExpediente[i].dfecnot || "",
        'Fec. Notificación': this.datosExpediente[i].nmonto || "",
        'Num. Resolución': this.datosExpediente[i].estreg || "",
        'Fec. Resolucion': this.datosExpediente[i].estreg || "",
        'Fec. Pago': this.datosExpediente[i].estreg || "",
        'Num. Recibo': this.datosExpediente[i].estreg || ""
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

  //DIGITAR UNICAMENTE NUMEROS
  validarNumero(event: any): void {
    const keyCode = event.keyCode;
    if (keyCode < 48 || keyCode > 57) {
      event.preventDefault();
    }
  }

  rellenarCeros() {
    this.p_numexp = this.p_numexp.padStart(6, '0')
  }

  validarCodigoMultaVacio(event: any) {
    if (this.p_codcon.length < 7) {
      this.cnombre = ''
    }
  }

  onInputChange(event: any) {
    event.target.value = event.target.value.toUpperCase();
  }

  onSelectionDate(event: any) {
    this.mrf_id = event.mrf_id
    console.log(this.mrf_id)
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

  listarCosGas(id: any, template: TemplateRef<any>, exp_id: number) {
    this.p_concid = id;
    this.sigtaService.p_concid = this.p_concid;
    // console.log(this.sigtaService.p_concid);

    this.exp_id = exp_id;
    this.sigtaService.exp_id = this.exp_id;
    // console.log(this.exp_id);

    // this.consultarCosGas();
    this.modalRefs['cosgas'] = this.modalService.show(template, { id: 8, class: 'modal-lg', backdrop: 'static', keyboard: false });
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

  getDataUser(event: MouseEvent, data: any) {
    

    const trs = document.querySelectorAll('tbody tr') as NodeListOf<HTMLTableRowElement>;
    trs.forEach((tr: HTMLTableRowElement) => {
      tr.classList.remove('active-color');
    });

    const target = event.target as HTMLElement;
    const tr = target.closest('tr') as HTMLTableRowElement | null;
    if (tr) {
      tr.classList.add('active-color');
    }

    this.exp_id = data.exp_id;
    // this.sigtaService.exp_id = this.exp_id;
    // console.log(this.exp_id);
  }


  goBackToMultas() {
    console.log(this.error);
    setTimeout(() => {
      switch (this.error) {
        case 'Resolucion Registrada Correctamente':
          this.consultarExpediente();
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
    this.p_fecfin = '';
    this.p_fecini = '';
    this.p_numexp = '';
  }

  editarDatosMulta(id: string | null) {


    if (id !== null) {
      this.router.navigate(['/multas/editar-multa'], { queryParams: { id: id } });
      // this.router.navigate(['/multas/editar-multa/', id]);
    } else {

    }
  }

  verDatosExpediente(id: string | null) {
    if (id !== null) {

      this.router.navigate(['/coactivo/ver', id]);
    }
  }
  verDatosCosGas(id: string | null) {
    if (id !== null) {

      this.router.navigate(['/cosgas', id]);
    }
  }





  //====================== CONSULTAR/FILTRAR MULTA =====================
  consultarExpediente() {

    let post = {
      p_numexp: Number(this.p_numexp),
      p_fecini: this.p_fecini.toString(),
      p_fecfin: this.p_fecfin.toString(),
      p_codadm: this.p_codcon,
    };



    if (this.p_numexp.length > 0 || this.p_fecfin.length > 0 || this.p_fecini.length > 0 || this.p_codcon.length > 0) {
      this.spinner.show();
      this.sigtaService.listarExpediente(post).subscribe({
        next: (data: any) => {
          this.spinner.hide();
          

          this.datosExpediente = data;

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
  }

  consultarCosGas() {

    let post = {
      p_concid: this.p_concid,
      // p_subcid: this.p_fecini.toString(),
    };

    this.sigtaService.listarCosGasValue(post).subscribe({
      next: (data: any) => {
        

        this.datosCostas = data;

      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  // consultarGastos() {

  //   let post = {
  //     p_concid: this.idgas,
  //     // p_subcid: this.p_fecini.toString(),
  //   };
  //   console.log(post);
  //     this.sigtaService.listarCosGasValue(post).subscribe({
  //       next: (data: any) => {
  //         

  //         this.datosGastos = data;

  //       },
  //       error: (error: any) => {
  //         console.log(error);
  //       },
  //     });
  // }

  listarFechas() {
    let post = {

    };

    this.sigtaService.listarFechas(post).subscribe({
      next: (data: any) => {
        

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

      // this.spinner.show();

      this.sigtaService.obtenerNombrePorCod(post).subscribe({
        next: (data: any) => {
          // this.spinner.hide();

          if (data && data.length > 0) {
            this.cnombre = data[0].cnombre;
          } else {
            this.errorSweetAlertCode();
            this.cnombre = '';
            this.p_codcon = '';

          }
        },
        error: (error: any) => {
          // this.spinner.hide();
          this.errorSweetAlertCode();
          this.cnombre = '';
          this.p_codcon = '';
          console.log(error);
        },
      });
    }

  }

  obtenerCosGas(value: any) {
    let post = {
      p_codcon: this.p_codcon,
    };

    if (this.p_codcon != '') {

      this.spinner.show();

      this.sigtaService.listarCosGasValue(post).subscribe({
        next: (data: any) => {
          this.spinner.hide();

          if (data && data.length > 0) {
            this.cnombre = data[0].cnombre;
          } else {
            this.errorSweetAlertCode();
            this.cnombre = '';
            this.p_codcon = '';

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

  // ======================= MODAL - BUSCAR CONTRIBUYENTE ========================
  busContribuyente() {
    let post = {
      p_nomcontri: this.p_nomcontri,
      p_mensaje: this.p_mensaje,
    };

    this.spinner.show();


    this.sigtaService.busContribuyente(post).subscribe({
      next: (data: any) => {
        this.spinner.hide();

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

}
