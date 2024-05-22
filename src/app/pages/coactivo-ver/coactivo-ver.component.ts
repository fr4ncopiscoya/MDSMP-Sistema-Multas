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
  selector: 'app-coactivo-ver',
  templateUrl: './coactivo-ver.component.html',
  styleUrls: ['./coactivo-ver.component.css']
})
export class CoactivoVerComponent implements OnInit {
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
  p_idcorrl: string[] = [];
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

  //DATOS REGISTRAR EXPEDIENTE
  // p_numexp: string = '';
  p_fecexp: string = ''
  // p_fecfin: string = '';
  p_expnid: number = 0;

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
    let id = Number(this.route.snapshot.paramMap.get('id'));
    this.p_expnid = id;
    this.consultarExpedienteTop();
    this.consultarExpediente();

    this.appComponent.login = false;
    this.dataUsuario = localStorage.getItem('dataUsuario');

  }

  ngOnInit(): void {
    this.dtOptionsModal = {
      info: false,
      scrollY: '400px',
      columnDefs: [
        { width: '500px', targets: 2 },
      ],
      language: {
        url: "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json"
      },
    }

    // this.listarFechas();

    const fechaActual = new Date().toISOString().split('T')[0];

  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    this.dtTriggerModal.unsubscribe();
  }

  ngAfterViewInit() {
    this.dtTrigger.next();
    this.dtTriggerModal.next();
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


  //OBTENGO LOS VALORES DE VARIABLES(MODAL)
  confirmClick(value: string) {
    this.p_codcon = value;
    this.obtenerNombrePorCod(value);
    this.modalService.hide(1);
  }

  busquedaTipoFecha() {
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

  onInputChange(event: any) {
    event.target.value = event.target.value.toUpperCase();
  }

  onSelectionDate(event: any) {
    this.mrf_id = event.mrf_id
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
  // getMaxDate(): string {
  //   return new Date().toISOString().split('T')[0];
  // }

  getDataUser(event: MouseEvent, data: any) {

    const target = event.target as HTMLInputElement;
    const tr = target.closest('tr') as HTMLTableRowElement | null;

    if (tr) {
      if (target.checked) {
        tr.classList.add('active-color');

        // Almacena el id de la casilla seleccionada en 'p_idcorrl'
        if (!this.p_idcorrl.includes(data.idcorr)) {
          this.p_idcorrl.push(data.idcorr);
        }
      } else {
        tr.classList.remove('active-color');

        // Elimina el id de la casilla deseleccionada de 'p_idcorrl'
        const index = this.p_idcorrl.indexOf(data.idcorr);
        if (index !== -1) {
          this.p_idcorrl.splice(index, 1);
        }
      }

    }
  }

  validarCamposBusqueda() {
    const disabled_numexp = document.getElementById('numexp') as HTMLInputElement
    const disabled_fecexp = document.getElementById('fecexp') as HTMLInputElement

    if (this.datosExpediente != '') {
      disabled_numexp.removeAttribute('disabled')
      disabled_numexp.classList.remove('disabled-color')

      disabled_fecexp.removeAttribute('disabled')
      disabled_fecexp.classList.remove('disabled-color')
    } else {
      disabled_numexp.setAttribute('disabled', 'disabled')
      disabled_numexp.classList.add('disabled-color')

      disabled_fecexp.setAttribute('disabled', 'disabled')
      disabled_fecexp.classList.add('disabled-color')

      this.p_numexp = '';
      this.p_fecexp = '';
    }
  }

  goBackToMultas() {
    console.log(this.error);
    setTimeout(() => {
      switch (this.error) {
        case 'Expediente Registrado Correctamente':
          this.router.navigate(['/coactivo'])
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
      // this.router.navigate(['/multas/editar-multa/', id]);
    } else {

    }
  }

  verDatosMulta(id: string | null) {
    if (id !== null) {
      this.router.navigate(['/multas/ver-multa/', id]);
    }
  }





  //====================== CONSULTAR =====================

  consultarExpedienteTop() {

    let post = {
      // p_numexp: Number(this.p_numexp),
      // p_fecini: this.p_fecini.toString(),
      // p_fecfin: this.p_fecfin.toString(),
      // p_codadm: this.p_codcon,
      p_expnid: this.p_expnid,
    };

    this.spinner.show();
    this.sigtaService.listarExpediente(post).subscribe({
      next: (data: any) => {
        this.spinner.hide();

        this.p_codcon = data[0].exp_admnom,
        this.cnombre = data[0].exp_codadm,
        this.p_numexp = data[0].exp_numexp,
        this.p_fecexp = data[0].exp_fecexp

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



  consultarExpediente() {

    let post = {
      p_expnid: this.p_expnid,
    };

    this.spinner.show();
    this.sigtaService.listarExpedienteVer(post).subscribe({
      next: (data: any) => {
        this.spinner.hide();
        // console.log(data);

        this.datosExpediente = data;
        // this.p_codcon = data[0].codadm;
        // this.cnombre = data[0].nomadm;

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

  registrarExpediente() {

    const idCorrlString = this.p_idcorrl.join(', ');

    let post = {
      p_codadm: this.p_codcon,
      p_expnum: Number(this.p_numexp),
      p_fecexp: this.p_fecexp,
      p_numnot: idCorrlString
    };

    this.sigtaService.registrarExpediente(post).subscribe({
      next: (data: any) => {

        if (data && data.length > 0) {
          this.error = data[0].mensa;
          const errorCode = data[0].error;
          console.log(this.error);

          // Selecciona el icono según el código de error
          const icon = this.getIconByErrorCode(errorCode);

          // Muestra el SweetAlert con el icono y el mensaje de error
          this.errorSweetAlert(icon);
          this.goBackToMultas()

          // window.location.reload();
        } else {
          this.errorSweetAlert();
        }

      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }



  listarFechas() {
    let post = {

    };

    this.sigtaService.listarFechas(post).subscribe({
      next: (data: any) => {

        this.datosFechas = data;
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

