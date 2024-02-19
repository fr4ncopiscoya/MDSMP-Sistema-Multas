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

@Component({
  selector: 'app-editar-multa',
  templateUrl: './editar-multa.component.html',
  styleUrls: ['./editar-multa.component.css']
})
export class EditarMultaComponent implements OnInit {

  @ViewChild(DataTableDirective, { static: false })

  modalRefs: { [key: string]: BsModalRef } = {}; // Objeto para almacenar los modalRefs

  dtTriggerModal: any;
  dtElementModal: any;
  modalRef?: BsModalRef;
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

  datosAreaOficina: any;
  datosMedidaComp: any;
  datosGiroEstablecimiento: any;
  datosMulta: any;
  datosTipoEspecie: any;
  datosReferencia: any;
  error: string = '';
  chkact = 0;


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


  ahora: any;



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
    let id = Number(this.route.snapshot.paramMap.get('id'));
    this.id_corrl = id;
    this.consultarMulta();
    this.appComponent.login = false;
  }

  ngOnInit(): void {
    // console.log(id);
    // this.consultarMulta();
    this.listarMedidaComp();
    this.listarGiroEstablecimiento();

    const datePite = new DatePipe('en-Us')
    this.ahora = datePite.transform(new Date(), 'yyyy-MM-dd')
  }



  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  ngAfterViewInit() {
    this.dtTrigger.next();
  }


  cerrarModal(modalKey: string) {
    if (this.modalRefs[modalKey]) {
      this.modalRefs[modalKey].hide(); // Cierra el modal si está definido
    }
  }

  modalRefere(templateRefere: TemplateRef<any>) {
    this.modalRefs['listar-descri'] = this.modalService.show(templateRefere, { id: 3, class: 'modal-lg', backdrop: 'static' });
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

  removerClase() {
    const nmontoAsNumber = parseFloat(this.nmonto);
    const disabledColor = document.getElementById("montoinfra") as HTMLInputElement
    if (nmontoAsNumber <= 0) {
      disabledColor.classList.remove('disabled-color');
      disabledColor.removeAttribute('disabled')
      disabledColor.focus();
    }else{
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
    }, 1000);
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
      text: 'Por favor ingrese la Fecha Multa',
    });
  }

  onSelectionChangeGiro(event: any) {
    this.giro = event.ccodgir
    this.desgiro = event.ddesgir
    console.log(this.giro);
    console.log(this.desgiro);
  }

  onSelectionChangeMedida(event: any) {
    this.csancio = event.CCODTIP
    console.log(this.csancio)
  }

  onInputChange(event: any) {
    event.target.value = event.target.value.toUpperCase();
  }

  confirmClickRefere(value: any) {
    this.p_desubi = value.viaurb;
    this.obtenerReferencia();
    this.modalService.hide(1);
  }


  private errorSweetAlertData() {
    Swal.fire({
      icon: 'info',
      text: 'No se encontraron datos en su busqueda',
    });
  }

  consultarMulta() {
    let post = {
      // p_codcon: this.p_codcon,
      // p_numnot: this.nnumnot,
      // p_codinf: this.r_descri,
      // p_fecini: this.p_fecini.toString(),
      // p_fecfin: this.p_fecfin.toString(),
      p_idcorr: this.id_corrl,
    };
    console.log(post);
    this.spinner.show();

    this.sigtaService.consultarMulta(post).subscribe({
      next: (data: any) => {
        this.spinner.hide();
        console.log(data);

        if (data && data.length > 0 && data) {
          this.datosMulta = data[0];
          this.ccontri = data[0].ccontri;
          this.cnombre = data[0].cnombre;
          this.dpredio = data[0].dpredio;
          this.p_desubi = data[0].crefere
          this.manzana = data[0].manzana
          this.lote = data[0].lote
          this.nro_fiscal = data[0].nro_fiscal
          this.dpto_int = data[0].dpto_int
          this.referencia = data[0].referencia
          this.nnumnot = data[0].nnumnot
          this.nro_acta = data[0].nro_acta
          this.p_anypro = data[0].dfecnot //Fecha Multa
          this.cnumres = data[0].cnumres
          this.dfecres = data[0].dfectra
          this.dsancio = data[0].dsancio
          this.chkact = data[0].chkact
          this.nroActaConstatacion = data[0].ACTA_CONSTATACION
          this.f_ejecucion = data[0].f_ejecucion
          this.giro = data[0].giro
          this.desgiro = data[0].OTROS_GIROS
          this.cmulta = data[0].cmulta
          this.nmonto = data[0].nmonto
          this.dareas = data[0].dareas
          this.dmulta = data[0].dmulta
          this.mobserv = data[0].mobserv
          this.ins_municipal = data[0].ins_municipal
          this.nro_informe = data[0].nro_informe

          console.log(this.desgiro);

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
        // console.log(data);

        this.datosGiroEstablecimiento = data;
        // this.desgiro = data[0].ddesgir
        this.giro = data[0].ccodgir;
        console.log(this.giro);

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

        if (data && data.length > 0 && data) {
          this.datosMedidaComp = data;
          this.csancio = data[0].CCODTIP;
          console.log(this.csancio);
        } else {

        }

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

  obtenerAreaPorCod(value: any) {
    const p_anyproDate = new Date(this.p_anypro).getFullYear();

    let post = {
      p_anypro: p_anyproDate.toString(),
      p_codinf: this.cmulta,
      // r_descri: this.dmulta,
      // p_arecod: this.carea
    };

    console.log(post);

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

  obtenerNombrePorCod() {
    let post = {
      p_codcon: this.p_codcon,
      cnombre: this.cnombre
    };

    this.spinner.show();

    this.sigtaService.obtenerNombrePorCod(post).subscribe({
      next: (data: any) => {
        this.spinner.hide();
        console.log(data);

        if (this.p_codcon = '') {
          console.log("Esta vacio: " + this.p_codcon);

        } else {
          if (data && data.length > 0 && data[0].cnombre) {
            this.cnombre = data[0].cnombre;
            this.dfiscal = data[0].dfiscal;
            this.ccontri = data[0].ccontri;

            console.log(this.ccontri);

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

  editarInfraccion() {
    let post = {
      id_corrl: this.id_corrl,
      nnumnot: this.nnumnot,
      dfecnot: this.p_anypro,
      ccontri: this.ccontri,
      cmulta: this.cmulta,
      nmonto: this.nmonto,
      crefere: this.crefere,
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
      haburb: this.haburb,
      nroActaConstatacion: this.nroActaConstatacion

    };
    console.log(post);
    console.log(this.nmonto);

    this.spinner.show();

    this.sigtaService.editarInfraccion(post).subscribe({

      next: (data: any) => {
        this.spinner.hide();
        console.log(data);

        if (data && data.length > 0 && data[0].error) {
          this.error = data[0].mensa;
          const errorCode = data[0].error;
          console.log(this.error);

          const icon = this.getIconByErrorCode(errorCode);

          this.errorSweetAlertCode(icon);

          this.goBackToMultas();

        } else {
          // this.errorSweetAlertCode();
        }
      },
      error: (error: any) => {
        this.spinner.hide();
        // this.errorSweetAlertCode();
        console.log(error);
      },
    });
  }

}

