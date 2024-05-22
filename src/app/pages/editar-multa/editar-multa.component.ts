import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { MasterService } from 'src/app/services/master.service';
import { SanidadService } from 'src/app/services/sanidad.service';
import { SigtaService } from 'src/app/services/sigta.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FunctionsUtils } from 'src/app/utils/functions.utils';
import { CleaveDirective } from 'src/cleave.directive';
import { createMask } from '@ngneat/input-mask';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-editar-multa',
  templateUrl: './editar-multa.component.html',
  styleUrls: ['./editar-multa.component.css']
})
export class EditarMultaComponent implements OnInit {

  currencyInputMask = createMask({
    alias: 'numeric',
    groupSeparator: ',',
    digits: 2,
    digitsOptional: false,
    prefix: 'S/. ',
    placeholder: '0',
  });
  // currencyFC = new FormControl('');

  @ViewChild(DataTableDirective, { static: false })


  dtTriggerModal: any;
  dtElementModal: any;
  modalRef?: BsModalRef;
  modalRefs: { [key: string]: BsModalRef } = {}; // Objeto para almacenar los modalRefs
  dtElement: any;
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

  //Almacena los datos
  datosAreaOficina: any;
  datosMedidaComp: any;
  datosGiroEstablecimiento: any;
  datosDocumentoInfra: any;
  datosMulta: any;
  datosTipoEspecie: any;
  datosReferencia: any;
  dataUsuario: any;



  //Variables
  p_anypro: string = ''; // --Fecha de Notificacion multa ====
  p_codinf: string = '';
  p_desubi: string = '';

  r_descri: string = '';
  r_codint: string = '';

  dareas: string = '';
  carea: string = '';

  p_codcon: string = '';

  cnombre: string = '';
  dfiscal: string = '';

  p_desgir: string = '';
  p_fecini: string = '';
  p_fecfin: string = '';

  id_corrl: number = 0;

  error: string = '';
  activeacta: boolean;
  ahora: any;

  tdi_id: number = 0;



  //Registrar multa
  nnumnot: string = '' // --Numero de Notificacion =====
  // dfecnot: string = '' // --Fecha de Notificacion multa ====
  ccontri: string = '' // --Codigo infractor ====
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

  girovalue: string = ''


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
    private utils: FunctionsUtils
  ) {

    this.dataUsuario = localStorage.getItem('dataUsuario');
    this.appComponent.login = false;
  }

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      //Obtengo el id del infractor
      let id = Number(this.route.snapshot.paramMap.get('id'));

      //Almaceno el id en una variable
      this.id_corrl = id;

      this.id_corrl = params['id'];
      // Utiliza el ID como necesites en este componente
    });
    //Carga todos los datos del infractor
    this.consultarMulta();

    const datePite = new DatePipe('en-Us')
    this.ahora = datePite.transform(new Date(), 'yyyy-MM-dd')
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  ngAfterViewInit() {
    this.dtTrigger.next();
  }


  // ============================ MODALES ===================================

  cerrarModal(modalKey: string) {
    if (this.modalRefs[modalKey]) {
      this.modalRefs[modalKey].hide(); // Cierra el modal si está definido
    } else {
    }
  }

  //Obtengo el valor seleccionado en el modal
  confirmClickRefereMulta(value: any) {
    this.p_desubi = value.viaurb;
    this.via = value.cpbdo;
    this.haburb = value.dpoblad;
    // this.obtenerReferencia();
    // this.modalService.hide(2);
  }

  modalRefere(template: TemplateRef<any>) {
    this.modalRefs['listar-refere'] = this.modalService.show(template, { id: 2, class: 'modal-lg', backdrop: 'static', keyboard: false });
  }






  // ======================= MENSAJES SWEET ALERT ============================

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

  private errorSweetAlertCode(icon: 'error' | 'warning' | 'info' | 'success' = 'error', callback?: () => void) {
    Swal.fire({
      icon: icon,
      text: this.error || 'Hubo un error al procesar la solicitud',
    }).then((result) => {
      if (result.isConfirmed && callback) {
        callback();
      }
    });
  }

  private errorSweetAlertDate() {
    Swal.fire({
      icon: 'info',
      text: 'Por favor ingrese la Fecha Multa',
    });
  }

  private errorSweetAlertData() {
    Swal.fire({
      icon: 'info',
      text: 'No se encontraron datos en su busqueda',
    });
  }




  // ============================ EVENTOS ONCHANGE ==========================

  onInputChange(event: any) {
    event.target.value = event.target.value.toUpperCase();
  }

  onSelectionChange(event: any) {
    const value = event;
    if (value) {
      this.girovalue = value.ccodgir;
      this.desgiro = value.ddesgir;
    }

    console.log("giro:", this.girovalue);
    console.log("desgiro: ", this.desgiro);
  }

  onSelectionChangeMedida(event: any) {
    this.csancio = event.CCODTIP
  }


  validarChkactive() {
    const chkacta = document.getElementById("chkacta") as HTMLInputElement;
    if (chkacta && chkacta.checked) {
    } else {
      this.nro_acta = '';
      this.f_ejecucion = '';
    }
  }



  // ============================= METODOS =============================

  //Trae todos los datos del infractor
  consultarMulta() {
    let post = {
      p_idcorr: this.id_corrl,
    };
    this.spinner.show();

    this.sigtaService.consultarMulta(post).subscribe({
      next: (data: any) => {
        this.spinner.hide();

        if (data && data.length > 0 && data) {
          this.tdi_id = data[0].tdi_id;
          this.ccontri = data[0].ccontri;
          this.cnombre = data[0].cnombre;
          this.dpredio = data[0].dpredio;
          this.csancio = data[0].csancio;
          this.p_desubi = data[0].crefere;
          this.manzana = data[0].manzana;
          this.lote = data[0].lote;
          this.nro_fiscal = data[0].nro_fiscal;
          this.dpto_int = data[0].dpto_int;
          this.referencia = data[0].referencia;
          this.nnumnot = data[0].nnumnot;
          this.nro_acta = data[0].nro_acta;
          this.p_anypro = data[0].dfecnot; //Fecha Multa
          this.cnumres = data[0].cnumres;
          this.dfecres = data[0].dfectra;
          this.dsancio = data[0].dsancio;
          this.activeacta = this.utils.setNumberToBoolean(data[0].chkact);
          this.nroActaConstatacion = data[0].ACTA_CONSTATACION;
          this.f_ejecucion = data[0].f_ejecucion;
          this.giro = data[0].giro;
          this.desgiro = data[0].OTROS_GIROS;
          this.cmulta = data[0].cmulta;
          this.nmonto = data[0].nmonto;
          this.dareas = data[0].dareas;
          this.dmulta = data[0].dmulta;
          this.mobserv = data[0].mobserv;
          this.ins_municipal = data[0].ins_municipal;
          this.nro_informe = data[0].nro_informe;
          this.via = data[0].via;
          this.haburb = data[0].haburb;

          this.listarGiroEstablecimiento();
          this.listarMedidaComp();
          this.listarDocumentosInfraccion();

          // console.log("giro: ", this.giro);



        } else {
          this.errorSweetAlertData();
        }
      },
      error: (error: any) => {
        this.errorSweetAlertData();
        this.spinner.hide();
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
        this.datosMedidaComp = data;
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  validarFechaMulta() {
    if (this.p_anypro === '') {
      // this.errorSweetAlertDate();
      this.cmulta = '';
      this.dareas = '';
      this.nmonto = '';
      this.dmulta = '';

    }
  }


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

  obtenerAreaPorCod(value: any) {
    const p_anyproDate = new Date(this.p_anypro).getFullYear();

    let post = {
      p_anypro: p_anyproDate.toString(),
      p_codinf: this.p_codinf,
      // p_desinf: this.r_descri,
      // p_arecod: this.carea,
      p_fecnot: this.p_anypro,
    };

    this.spinner.show();

    this.sigtaService.obtenerDescripcionPorCod(post).subscribe({
      next: (data: any) => {
        this.spinner.hide();
        if (this.p_anypro == '') {
          this.errorSweetAlertDate();
          this.cmulta = '';
          this.dareas = '';
          this.nmonto = '';
          this.dmulta = '';

        } else {
          if (data && data.length > 0 && data[0].dareas) {
            this.dareas = data[0].dareas;
            this.carea = data[0].carea;
            this.nmonto = data[0].nmontot;
            this.dmulta = data[0].r_descri;
            this.r_codint = data[0].r_codint;

            this.removerClase();
            // this.formatNumber();
          } else {
            this.errorSweetAlertCode();
            this.dareas = '';
            this.carea = '';
            this.nmonto = '';
            this.dmulta = '';
            this.r_codint = '';
            this.cmulta = '';

          }
        }



      },
      error: (error: any) => {
        this.spinner.hide();
        this.errorSweetAlertCode();
        console.log(error);
      },
    });
  }

  obtenerNombrePorCod() {
    let post = {
      p_codcon: this.p_codcon,
      cnombre: this.cnombre
    };

    this.spinner.show();

    this.sigtaService.obtenerNombrePorCod(post).subscribe({
      next: (data: any) => {
        this.spinner.hide();


        if (this.p_codcon = '') {
        } else {
          if (data && data.length > 0 && data[0].cnombre) {
            this.cnombre = data[0].cnombre;
            this.dfiscal = data[0].dfiscal;
            this.ccontri = data[0].ccontri;

          } else {
            this.errorSweetAlertCode();
          }
        }

      },
      error: (error: any) => {
        this.spinner.hide();
        this.errorSweetAlertCode();
        console.log(error);
      },
    });
  }

  obtenerReferencia() {
    let post = {
      p_desubi: this.p_desubi,
    };


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
        // this.errorSweetAlertCode();
        console.log(error);
      },
    });
  }

  editarInfraccion() {
    const montoLimpio = this.nmonto.replace('S/.', '').replace(',', '');
    const montoFloat = parseFloat(montoLimpio);

    let storedData = localStorage.getItem("dataUsuario");
    if (storedData !== null) {
      this.dataUsuario = JSON.parse(storedData);
    }

    let post = {
      id_corrl: this.id_corrl,
      nnumnot: this.nnumnot,
      dfecnot: this.p_anypro,
      ccontri: this.ccontri,
      cmulta: this.cmulta,
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
      giro: this.girovalue,
      desgiro: this.desgiro,
      f_ejecucion: this.f_ejecucion,
      via: this.via,
      haburb: this.haburb,
      nroActaConstatacion: this.nroActaConstatacion,
      nmonto: montoFloat,
      usumod: this.sigtaService.cusuari
    };

    console.log("data-informe", post);


    this.spinner.show();

    this.sigtaService.editarInfraccion(post).subscribe({

      next: (data: any) => {
        this.spinner.hide();


        if (data && data.length > 0 && data[0].error) {
          this.error = data[0].mensa;
          const errorCode = data[0].error;
          console.log(this.error);

          const icon = this.getIconByErrorCode(errorCode);

          this.errorSweetAlertCode(icon, this.goBackToMultas.bind(this));
          // this.goBackToMultas();

        } else {
        }
      },
      error: (error: any) => {
        this.spinner.hide();
        console.log(error);
      },
    });
  }

  //------------------------------------

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

  validarMonto(event: any): void {
    const keyCode = event.keyCode;
    // Permitir números del 0 al 9 (48-57) y el punto (46)
    if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) {
      event.preventDefault();
    }
  }

  validarCodInfra() {
    if (this.p_codinf == '') {
      // this.errorSweetAlertDate();
      // this.p_codinf = '';
      this.dareas = '';
      this.nmonto = '';
      this.r_descri = '';

    } else {
    }
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


  formatNumber() {
    // Eliminar el símbolo de moneda y los separadores de miles
    const montoLimpio = this.nmonto.replace('S/.', '').replace(',', '');

    // Convertir el monto limpio a tipo float
    const montoFloat = parseFloat(montoLimpio);

    // Imprimir el monto convertido en la consola
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

  goBackToMultas() {
    setTimeout(() => {
      switch (this.error) {
        case 'Notificacion Grabada Correctamente':
        case 'Notificacion Actualizada Correctamente':
          this.router.navigateByUrl('/multas');
          break;
        default:
          // Handle other cases if needed
          break;
      }
    });
  }

}

