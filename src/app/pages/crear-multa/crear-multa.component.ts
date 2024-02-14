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
import { HammerGestureConfig } from '@angular/platform-browser';

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

  datosAreaOficina: any;
  datosMedidaComp: any;
  datosGiroEstablecimiento: any;
  datosReferencia: any;
  datosTipoEspecie: any;

  tieneActa = false;


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



  // @nnumnot --Numero de Notificacion
  // @dfecnot smalldatetime = '01/01/1900 00:00:00', --Fecha de Notificacion
  // @ccontri--Codigo Administrado
  // @cpredio--Pasar en Blanco
  // @cmulta(7) ='', --Codigo Multa o Infraccion
  // @nmonto	 numeric(12, 2) = 0, --Monto Multa o Infraccion
  // @dfecres smalldatetime = '01/01/1900 00:00:00', --Fecha de Resolucion
  // @cnumres--Numero de Resolucion
  // @cofisan(3) ='', --Area propietaria de la multa
  // @dfecrec smalldatetime = '01/01/1900 00:00:00', --Fecha de Recepcion
  // @crefere(80) ='', --Referencia
  // @cusutra(3) ='', --Usuario Transaccion
  // @csancio(2) ='', --Medida Complementaria
  // @mobserv(500) ='', --Observaciones
  // @nreinci int = 0, --Reincidencia
  // @manzana(15) = '', --Manzana
  // @lote(15) = '', --Lote
  // @nro_fiscal(15) = '', --Numero
  // @dpto_int(15) = '', --Departamento o Interior
  // @referencia(150) = '', --Referencia
  // @ins_municipal(250) ='', --Inspector que impone la multa
  // @nro_acta(20) ='', --Numero de Acta
  // @nro_informe(20) ='', --Numero de Informe
  // @giro(8) = '', --Codigo Giro
  // @f_ejecucion smalldatetime = '01/01/1900 00:00:00', --Fecha Ejecucion
  // @f_registro smalldatetime = '01/01/1900 00:00:00', --Fecha Registro
  // @via(250) = '', --Nombre Via o Calle
  // @haburb(250) = '', --Nombre Habilitacion Urbana(Urbanizacion)
  // @nroActaConstatacion(15) = '' -- Numero Acta Constatacion



  constructor(
    private appComponent: AppComponent,
    private serviceMaster: MasterService,
    private router: Router,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private serviceSanidad: SanidadService,
    private sigtaService: SigtaService,
    private sanidadService: SanidadService,
    private modalService: BsModalService
  ) {
    this.appComponent.login = false;
  }

  ngOnInit(): void {
    // this.listarAreaOficina();
    this.listarMedidaComp();
    this.listarGiroEstablecimiento();

    const fechaActual = new Date().toISOString().split('T')[0];
    console.log(fechaActual);
    
    this.p_anypro = fechaActual
    
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  ngAfterViewInit() {
    this.dtTrigger.next();
  }

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

  private errorSweetAlertCode(icon: 'error' | 'warning' | 'info' | 'success' = 'error') {
    Swal.fire({
      icon: icon,
      text: this.error || 'Hubo un error al procesar la solicitud',
    });
  }

  private errorSweetAlertDate() {
    Swal.fire({
      icon: 'info',
      text: 'Por favor asegurese de ingresar Fecha Multa o digitar Código Infracción válido',
    });
  }

  // changeDate() {
  //   if (this.p_anypro = '') {
  //     this.p_codinf = '';
  //     this.dareas = '';
  //     this.nmonto = '';
  //     this.r_descri = '';
  //   }
  // }

  confirmClick(value: string) {
    this.ccontri = value;
    this.obtenerNombrePorCod(value);
    this.modalService.hide(1);
  }

  confirmClickRefere(value: any) {
    this.p_desubi = value.viaurb;
    this.obtenerReferencia();
    this.modalService.hide(1);
  }

  asignarPerfil(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { id: 1, class: 'modal-lg' });
  }

  onSelectionChangeGiro(event: any) {
    this.giro = event.ccodgir
    this.desgiro = event.ddesgir
    console.log(this.desgiro);
  }

  onSelectionChangeMedida(event: any) {
    this.csancio = event.CCODTIP
    console.log(this.csancio)
  }

  onInputChange(event: any) {
    event.target.value = event.target.value.toUpperCase();
  }

  getMaxDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  // listarAreaOficina() {
  //   let post = {

  //   };

  //   this.sigtaService.listarAreaOficina(post).subscribe({
  //     next: (data: any) => {
  //       console.log(data);

  //       this.datosAreaOficina = data;
  //     },
  //     error: (error: any) => {
  //       console.log(error);
  //     },
  //   });
  // }

  listarGiroEstablecimiento() {
    let post = {

    };

    this.sigtaService.listarGiroEstablecimiento(post).subscribe({
      next: (data: any) => {
        // console.log(data);

        this.datosGiroEstablecimiento = data;
        this.giro = data[0].ccodgir
        this.desgiro = data[0].ddesgir;
        console.log(this.desgiro);

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
        this.dsancio = data[0].DCODTIP
        this.csancio = data[0].CCODTIP;
        console.log(this.csancio);

      },
      error: (error: any) => {
        console.log(error);
      },
    });
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
    if (this.p_codinf == '') {
      // this.errorSweetAlertDate();
      // this.p_codinf = '';
      this.dareas = '';
      this.nmonto = '';
      this.r_descri = '';

    } else {
      console.log("no hagas nada");

    }
  }
  
  goBackToMultas(){
    setTimeout(() => {
      
    }, 4000);
    if(this.error = "Notificacion Actualizada Correctamente" ){
      this.router.navigateByUrl('/multas')
    }
  }

  removerClase() {
    const nmontoAsNumber = parseFloat(this.nmonto);
    const disabledColor = document.getElementById("montoinfra") as HTMLInputElement
    if (nmontoAsNumber <= 0) {
      disabledColor.classList.remove('disabled-color');
      disabledColor.removeAttribute('disabled')
      disabledColor.focus();

    }
  }

  obtenerAreaPorCod(value: any) {
    const p_anyproDate = new Date(this.p_anypro).getFullYear();

    let post = {
      p_anypro: p_anyproDate.toString(),
      p_codinf: this.p_codinf,
      // r_descri: this.r_descri,
      // p_arecod: this.carea
    };

    console.log(post);

    this.spinner.show();
    this.sigtaService.obtenerDescripcionPorCod(post).subscribe({
      next: (data: any) => {
        this.spinner.hide();

        if (this.p_anypro == '' || this.p_codinf == '') {
          this.errorSweetAlertDate();
          this.p_codinf = '';
          this.dareas = '';
          this.nmonto = '';
          this.r_descri = '';

        } else {
          if (data && data.length > 0 && data[0].dareas) {
            this.dareas = data[0].dareas;
            this.carea = data[0].carea;
            this.nmonto = data[0].nmontot;
            this.r_descri = data[0].r_descri;
            this.p_codinf = data[0].r_codint;
            this.removerClase();
            this.validarCodInfra();
          } else {
            this.errorSweetAlertCode();
          }
        }


        console.log(data);
      },
      error: (error: any) => {
        this.spinner.hide();
        this.errorSweetAlertCode();
        console.log(error);
      },
    });
  }

  obtenerNombrePorCod(value: any) {
    let post = {
      p_codcon: this.ccontri,
      // cnombre: this.cnombre
    };

    this.spinner.show();

    this.sigtaService.obtenerNombrePorCod(post).subscribe({
      next: (data: any) => {
        this.spinner.hide();

        if (this.ccontri == '') {
          console.log("nombrePorCod");

          this.errorSweetAlertDate();

        } else {
          if (data && data.length > 0 && data[0].cnombre) {
            this.cnombre = data[0].cnombre;
            this.dpredio = data[0].dfiscal;
            this.ccontri = data[0].ccontri;
          } else {
            this.errorSweetAlertCode();
          }
        }
        console.log(data);

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

    console.log(post);

    this.spinner.show();

    this.sigtaService.listarReferencia(post).subscribe({
      next: (data: any) => {
        this.spinner.hide();
        this.datosReferencia = data;
        console.log(data);
        // this.manzana = data[0].cpostal;
        this.via = data[0].cdvia;
        this.haburb = data[0].cpbdo
        console.log(this.via);


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

  //Registrar multa
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
  cusutra: string = 'N05' // --Usuario Transaccion
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

  registrarInfraccion() {
    let post = {
      nnumnot: this.nnumnot,
      dfecnot: this.p_anypro,
      ccontri: this.ccontri,
      cmulta: this.p_codinf,
      crefere: this.p_desubi,
      cusutra: this.cusutra,
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
      haburb: this.p_desubi,
      nroActaConstatacion: this.nroActaConstatacion
    };

    this.spinner.show();

    this.sigtaService.registrarMulta(post).subscribe({

      next: (data: any) => {
        this.spinner.hide();
        console.log(data);

        if (data && data.length > 0 && data[0].error) {
          this.error = data[0].mensa;
          const errorCode = data[0].error;
          console.log(this.error);

          // Selecciona el icono según el código de error
          const icon = this.getIconByErrorCode(errorCode);

          // Muestra el SweetAlert con el icono y el mensaje de error
          this.errorSweetAlertCode(icon);
          this.goBackToMultas()

          // window.location.reload();
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
}
