import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { MasterService } from 'src/app/services/master.service';
import { SanidadService } from 'src/app/services/sanidad.service';
import { SigtaService } from 'src/app/services/sigta.service';
import { DataTableDirective } from 'angular-datatables';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { createMask } from '@ngneat/input-mask';

@Component({
  selector: 'app-crear-multa',
  templateUrl: './crear-multa.component.html',
  styleUrls: ['./crear-multa.component.css'],
})
export class CrearMultaComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtTriggerModal: any;
  dtElementModal: any;
  modalRef?: BsModalRef;
  modalRefs: { [key: string]: BsModalRef } = {}; // Objeto para almacenar los modalRefs
  // dtElement: any;
  dtTrigger: Subject<void> = new Subject<void>();
  dtOptions: any = {
    columnDefs: [
      // { width: '2px', targets: 0 },
      // { width: '2px', targets: 1 },
      // { width: '50px', targets: 2 },
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

  currencyInputMask = createMask({
    alias: 'numeric',
    groupSeparator: ',',
    digits: 2,
    digitsOptional: false,
    prefix: 'S/. ',
    placeholder: '0',
  });

  //Almaceno la data
  datosAreaOficina: any;
  datosMedidaComp: any;
  datosGiroEstablecimiento: any;
  datosDocumentoInfra: any;
  datosReferencia: any;
  datosTipoEspecie: any;
  dataUsuario: any;

  //Variables
  p_desubi: string = '';
  p_anypro: string = '';
  p_codinf: string = '';

  r_descri: string = '';
  r_codint: string = '';

  dareas: string = '';
  carea: string = '';

  cnombre: string = '';
  dfiscal: string = '';

  p_desgir: string = '';

  ahora: any;

  error: string = '';


  //Registrar multa
  formInfraccion!: FormGroup;
  nnumnot: string = '' // --Numero de Notificacion =====
  // dfecnot: string = '' // --Fecha de Notificacion multa ====
  ccontri: string = '' // --Codigo Administrado ====
  cpredio: string = '' // --Pasar en Blanco
  dpredio: string = '' // --Dirección : Avenida / Jiron/Calle/Pasaje
  cmulta: string = '' //  --Codigo Multa o Infraccion =====
  dmulta: string = '' // -- Descripcion Multa
  nmonto: string = '' // --Monto Multa o Infraccion ======
  dfecres: string = '' // --Fecha de Resolucion
  cnumres: string = '' // --Numero de Resolucion
  cofisan: string = '' // --Area propietaria de la multa
  // dfecrec: string = '' // --Fecha de Recepcion
  crefere: string = '' // --Referencia =====
  // cusutra: string = 'N05' // --Usuario Transaccion
  csancio: string = '' // --Medida Complementaria - code ======
  dsancio: string = '' // --Medida Complementaria - descri ======
  mobserv: string = '' // --Observaciones =========
  nreinci: string = '' // --Reincidencia
  manzana: string = '' // --Manzana ======
  lote: string = '' // --Lote ===
  nro_fiscal: string = '' // --Numero ====
  dpto_int: string = '' // --Departamento o Interior ======
  referencia: string = '' // --Referencia ======
  ins_municipal: string = '' // --Inspector que impone la multa =====
  nro_acta: string = '' // --Numero de Acta ===
  nro_informe: string = '' // --Numero de Informe =======
  giro: string = '' // --Codigo Giro
  desgiro: string = '' // --Codigo Giro
  f_ejecucion: string = '' // --Fecha Ejecucion ====
  // f_registro: string = '' // --Fecha Registro
  via: string = '' // --Nombre Via o Calle
  haburb: string = '' //  --Nombre Habilitacion Urbana(Urbanizacion)
  nroActaConstatacion: string = '' // -- Numero Acta Constatacion ===
  chkact = 0;
  usuins: string = ''
  submited: boolean = false

  //Combo Documento Infraccion
  tdi_id: number = 0

  constructor(
    private appComponent: AppComponent,
    private serviceMaster: MasterService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private serviceSanidad: SanidadService,
    private sigtaService: SigtaService,
    private sanidadService: SanidadService,
    private modalService: BsModalService,
    private fb: FormBuilder
  ) {
    this.appComponent.login = false;
    this.dataUsuario = localStorage.getItem('dataUsuario');
  }

  ngOnInit(): void {
    this.listarMedidaComp();
    this.listarGiroEstablecimiento();
    this.listarDocumentosInfraccion();

    //Obtengo la fecha actual
    const fechaActual = new Date().toISOString().split('T')[0];

    this.p_anypro = fechaActual

  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  ngAfterViewInit() {
    this.dtTrigger.next();
  }


  // ================================== MENSAJES SWEET ALERT ========================================

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
        return 'error'; // Puedes establecer un icono predeterminado si no hay coincidencia
    }
  }

  private errorSweetAlert(icon: 'error' | 'warning' | 'info' | 'success' = 'error', callback?: () => void) {
    Swal.fire({
      icon: icon,
      text: this.error || 'Hubo un error al procesar la solicitud',
    }).then((result) => {
      if (result.isConfirmed && callback) {
        callback();
      }
    });
  }

  private errorSweetAlertCode() {
    Swal.fire({
      icon: 'error',
      text: 'Por favor ingrese un código válido',
    });
  }

  private errorSweetAlertDate() {
    Swal.fire({
      icon: 'info',
      text: 'Por favor asegurese de ingresar Fecha Multa o digitar Código Infracción válido',
    });
  }





  // =================================== MODALES ========================================

  cerrarModal(modalKey: string) {
    if (this.modalRefs[modalKey]) {
      this.modalRefs[modalKey].hide(); // Cierra el modal si está definido
    }
  }

  //Obtengo el valor seleccionado en el modal
  confirmClick(value: string) {
    this.ccontri = value;
    this.obtenerNombrePorCod(value);
    this.modalService.hide(1);
  }

  confirmClickRefere(value: any) {
    this.p_desubi = value.viaurb;
    this.obtenerReferencia();
    this.modalService.hide(2);
  }

  confirmClickRefereMulta(value: any) {
    this.p_desubi = value.viaurb;
    this.via = value.cpbdo;
    this.haburb = value.dpoblad;
    // this.obtenerReferencia();
    // this.modalService.hide(2);
  }

  //-----------------------------------------

  //Abre los modales
  asignarPerfil(template: TemplateRef<any>) {
    this.modalRefs['listar-persona'] = this.modalService.show(template, { id: 1, class: 'modal-lg', backdrop: 'static', keyboard: false });
  }

  modalRefere(template: TemplateRef<any>) {
    this.modalRefs['listar-descri'] = this.modalService.show(template, { id: 2, class: 'modal-lg', backdrop: 'static', keyboard: false });
  }

  modalRefereMulta(template: TemplateRef<any>) {
    this.modalRefs['listar-referencia-multa'] = this.modalService.show(template, { id: 12, class: 'modal-lg', backdrop: 'static', keyboard: false });
  }

  // modalRefereM(template: TemplateRef<any>) {
  //   this.modalRefs['listar-referenciaM'] = this.modalService.show(template, { id: 12, class: 'modal-lg', backdrop: 'static', keyboard: false });
  // }




  // =============================== EVENTOS ONCHANGE ===================================

  onSelectionChangeGiro(event: any) {
    this.giro = event.ccodgir
    this.desgiro = event.ddesgir
  }

  onSelectionChangeMedida(event: any) {
    this.csancio = event.CCODTIP
  }

  onInputChange(event: any) {
    event.target.value = event.target.value.toUpperCase();
  }

  onSelectionChange(event: any) {
    const value = event;
    if (value) {
      this.giro = value.ccodgir;
      this.desgiro = value.ddesgir;
    }

    console.log("giro:", this.giro);
    console.log("desgiro: ", this.desgiro);
  }

  listarDocInfra() {
    const disabled_nro_not = document.getElementById('nro_not') as HTMLInputElement

    if (this.tdi_id != 0) {
      disabled_nro_not.classList.remove('disabled-color');
      disabled_nro_not.removeAttribute('disabled')
    } else {
      disabled_nro_not.classList.add('disabled-color')
      disabled_nro_not.setAttribute('disabled', 'disabled')
      this.tdi_id = 0;
      this.nnumnot = ''
    }
  }

  validarCodigoMultaVacio(event: any) {
    if (this.ccontri.length < 7) {
      this.cnombre = ''
      this.dpredio = ''
    }
  }




  // ============================= METODOS ============================================

  listarDocumentosInfraccion() {
    let post = {

    };

    this.sigtaService.listarDocInfra(post).subscribe({
      next: (data: any) => {
        this.datosDocumentoInfra = data;
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  listarGiroEstablecimiento() {
    let post = {

    };

    this.sigtaService.listarGiroEstablecimiento(post).subscribe({
      next: (data: any) => {
        this.datosGiroEstablecimiento = data;

      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  listarMedidaComp() {
    let post = {

    };

    this.sigtaService.listarMedidaComp(post).subscribe({
      next: (data: any) => {
        // console.log(data);

        this.datosMedidaComp = data;
        // this.dsancio = data[0].DCODTIP
        this.csancio = data[0].CCODTIP;

      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  obtenerAreaPorCod(value: any) {
    const p_anyproDate = new Date(this.p_anypro).getFullYear();

    let post = {
      p_anypro: p_anyproDate.toString(),
      p_codinf: this.p_codinf,
      // p_desinf: this.r_descri,
      // p_arecod: this.carea,
      p_fecnot: this.p_anypro,
    };

    if (this.p_codinf != '') {

      // this.spinner.show()
      this.sigtaService.obtenerDescripcionPorCod(post).subscribe({
        next: (data: any) => {
          // this.spinner.hide();
          if (data && data.length > 0) {
            this.dareas = data[0].dareas;
            this.carea = data[0].carea;
            this.nmonto = data[0].nmontot;
            this.r_descri = data[0].r_descri;
            this.p_codinf = data[0].r_codint;
            this.removerClase();
            // this.formatNumber();
          } else {
            this.errorSweetAlertCode();
            this.dareas = '';
            this.carea = '';
            this.nmonto = '';
            this.r_descri = '';
            this.p_codinf = '';

          }
        },
        error: (error: any) => {
          // this.spinner.hide();
          this.errorSweetAlertCode();
          console.log(error);
        },
      });
    }

  }

  obtenerNombrePorCod(value: any) {
    let post = {
      p_codcon: this.ccontri,
      // cnombre: this.cnombre
    };

    if (this.ccontri != '') {

      // this.spinner.show();

      this.sigtaService.obtenerNombrePorCod(post).subscribe({
        next: (data: any) => {
          this.spinner.hide();


          if (data && data.length > 0 && data[0].cnombre) {
            this.cnombre = data[0].cnombre;
            this.dpredio = data[0].dfiscal;
            this.ccontri = data[0].ccontri;
          } else {
            this.errorSweetAlertCode();
          }

        },
        error: (error: any) => {
          // this.spinner.hide();
          // this.errorSweetAlertCode();
          console.log(error);
        },
      });
    }

  }

  obtenerReferencia() {
    let post = {
      p_desubi: this.p_desubi,
    };

    console.log(post);

    if (this.p_desubi != '') {

      this.spinner.show();

      this.sigtaService.listarReferencia(post).subscribe({
        next: (data: any) => {
          this.spinner.hide();
          this.datosReferencia = data;
          // this.manzana = data[0].cpostal;
          this.via = data[0].cdvia;
          this.haburb = data[0].cpbdo

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

  registrarInfraccion() {
    const montoLimpio = this.nmonto.replace('S/.', '').replace(',', '');
    const montoFloat = parseFloat(montoLimpio);

    const nmontoAsNumber = parseFloat(this.nmonto);

    let storedData = localStorage.getItem("dataUsuario");
    if (storedData !== null) {
      this.dataUsuario = JSON.parse(storedData);
    }

    let post = {
      tdi_id: this.tdi_id,
      nnumnot: this.nnumnot,
      dfecnot: this.p_anypro,
      ccontri: this.ccontri,
      cmulta: this.p_codinf,
      crefere: this.p_desubi,
      cusutra: this.dataUsuario.codusu,
      csancio: this.csancio,
      mobserv: this.mobserv,
      nreinci: this.nreinci,
      manzana: this.manzana,
      lote: this.lote,
      nro_fiscal: this.nro_fiscal,
      dpto_int: this.dpto_int,
      referencia: this.referencia,
      ins_municipal: this.ins_municipal,
      nro_acta: this.nro_acta,
      nro_informe: this.nro_informe,
      giro: this.giro,
      desgiro: this.desgiro,
      f_ejecucion: this.f_ejecucion,
      via: this.via,
      haburb: this.haburb,
      nroActaConstatacion: this.nroActaConstatacion,
      nmonto: montoFloat,
      usuins: this.sigtaService.cusuari
    };

    this.spinner.show();

    this.sigtaService.registrarMulta(post).subscribe({

      next: (data: any) => {
        this.spinner.hide();

        if (data && data.length > 0 && data[0].error) {
          this.error = data[0].mensa;
          const errorCode = data[0].error;
          console.log(this.error);

          // Selecciona el icono según el código de error
          const icon = this.getIconByErrorCode(errorCode);

          // Muestra el SweetAlert con el icono y el mensaje de error
          this.errorSweetAlert(icon, this.goBackToMultas.bind(this));
          // this.goBackToMultas()

          // window.location.reload();
        } else {
          this.errorSweetAlert();
        }
      },
      error: (error: any) => {
        this.spinner.hide();
        this.errorSweetAlert();
        console.log(error);
      },
    });
  }

  //--------------------------------------

  descargaExcel() {
    let btnExcel = document.querySelector(
      '#tablaAplicacion_wrapper .dt-buttons .dt-button.buttons-excel.buttons-html5'
    ) as HTMLButtonElement;
    btnExcel.click();
  }

  validarNumero(event: any): void {
    const keyCode = event.keyCode;
    if (keyCode < 48 || keyCode > 57) {
      event.preventDefault();
    }
  }

  validarNumeroInforme(event: any): void {
    const inputValue = event.target.value.toUpperCase(); // Convertir a mayúsculas
    const lastChar = inputValue.slice(-1);

    // Permitir letras mayúsculas, números (0-9), y el guion "-"
    if (/^[A-Z0-9-]+$/.test(lastChar)) {
      return;
    } else {
      event.target.value = inputValue.slice(0, -1); // Eliminar el último carácter ingresado
    }
  }




  validarFechaMulta() {
    if (this.p_anypro == '') {
      // this.errorSweetAlertDate();
      this.p_codinf = '';
      this.dareas = '';
      this.nmonto = '';
      this.r_descri = '';

    }
  }

  validarCodInfra() {
    if (this.p_codinf.length < 5) {

      this.dareas = '';
      this.nmonto = '';
      this.r_descri = '';

    } else {
    }
  }

  validarMonto(event: any): void {
    const keyCode = event.keyCode;
    // Permitir números del 0 al 9 (48-57) y el punto (46)
    if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) {
      event.preventDefault();
    }
  }

  setFormInfra() {
    this.formInfraccion = this.fb.group({
      ccontri: ['', [Validators.required]],
      nnumnot: ['', [Validators.required]],
      p_anypro: ['', [Validators.required]],
      p_codinf: ['', [Validators.required]],
      nmonto: ['', [Validators.required]],
    })
  }

  getMaxDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  goBackToMultas() {
    switch (this.error) {
      case 'Notificacion Grabada Correctamente':
      case 'Notificacion Actualizada Correctamente':
        this.router.navigateByUrl('/multas');
        break;
      default:
        // No hacer nada
        break;
    }
  }

  formatNumber() {
    // const nmontoAsNumber = parseFloat(this.nmonto);

    // let formattedNumber = nmontoAsNumber.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    // formattedNumber = formattedNumber.replace('.', '.');

    // formattedNumber = formattedNumber.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');

    // if (nmontoAsNumber >= 0) {
    //   this.nmonto = formattedNumber;
    // } else {
    //   this.nmonto = '0.00';
    // }
  }


  removerClase() {
    const nmontoAsNumber = parseFloat(this.nmonto);
    const disabledColor = document.getElementById("montoinfra") as HTMLInputElement

    if (nmontoAsNumber <= 0) {
      disabledColor.classList.remove('disabled-color');
      disabledColor.removeAttribute('disabled')
      disabledColor.focus();
    } else {
      disabledColor.classList.add('disabled-color');
      disabledColor.setAttribute('disabled', 'disabled')
    }
  }

}

