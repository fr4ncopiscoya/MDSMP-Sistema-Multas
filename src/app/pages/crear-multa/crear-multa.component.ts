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

@Component({
  selector: 'app-crear-multa',
  templateUrl: './crear-multa.component.html',
  styleUrls: ['./crear-multa.component.css'],
})
export class CrearMultaComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
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

  booleanValue: boolean = false;

  datosTipoEspecie: any;

  tieneActa = false;


  //Variables
  p_anypro: string = '';
  p_codinf: string = '';

  r_descri: string = '';
  r_codint: string = '';

  dareas: string = '';
  carea: string = '';

  p_codcon: string = '';

  cnombre: string = '';
  dfiscal: string = '';

  p_desgir: string = '';




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
  ) {
    this.appComponent.login = false;
  }

  ngOnInit(): void {
    // this.listarAreaOficina();
    this.listarMedidaComp();
    this.listarGiroEstablecimiento();

    const fechaActual = new Date().toISOString().split('T')[0];

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

  private errorSweetAlertCode() {
    Swal.fire({
      icon: 'error',
      text: 'Por favor ingrese un código válido',
    });
  }
  private errorSweetAlertDate() {
    Swal.fire({
      icon: 'info',
      text: 'Por favor ingrese la Fecha Multa',
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

  onSelectionChangeGiro(event: any) {
    this.giro = event.ccodgir
    console.log(this.giro);
  }

  onSelectionChangeMedida(event: any) {
    this.csancio = event.CCODTIP
    console.log(this.csancio)
  }

  onInputChange(event: any) {
    event.target.value = event.target.value.toUpperCase();
  }

  getMaxDate(): string {
    // Obtener la fecha actual en formato "YYYY-MM-DD"
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
        this.giro = data[0].ddesgir;
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
        // console.log(data);

        this.datosMedidaComp = data;
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

  obtenerAreaPorCod() {
    const p_anyproDate = new Date(this.p_anypro).getFullYear();

    let post = {
      p_anypro: p_anyproDate.toString(),
      p_codinf: this.p_codinf,
      r_descri: this.r_descri,
      p_arecod: this.carea
    };

    console.log(post);

    this.spinner.show();

    this.sigtaService.obtenerDescripcionPorCod(post).subscribe({
      next: (data: any) => {
        this.spinner.hide();
        if (this.p_anypro == '') {
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
            this.r_codint = data[0].r_codint;
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

  //Registrar multa
  nnumnot: string = '' // --Numero de Notificacion =====
  dfecnot: string = '' // --Fecha de Notificacion multa ====
  ccontri: string = '' // --Codigo Administrado ====
  cpredio: string = '' // --Pasar en Blanco
  cmulta: string = '' //  --Codigo Multa o Infraccion =====
  nmonto: string = '' // --Monto Multa o Infraccion ======
  // dfecres: string = '' // --Fecha de Resolucion
  // cnumres: string = '' // --Numero de Resolucion
  cofisan: string = '' // --Area propietaria de la multa
  // dfecrec: string = '' // --Fecha de Recepcion
  crefere: string = '' // --Referencia =====
  cusutra: string = '' // --Usuario Transaccion
  csancio: string = '' // --Medida Complementaria ======
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
  f_ejecucion: string = '' // --Fecha Ejecucion ====
  // f_registro: string = '' // --Fecha Registro
  via: string = '' // --Nombre Via o Calle
  haburb: string = '' //  --Nombre Habilitacion Urbana(Urbanizacion)
  nroActaConstatacion: string = '' // -- Numero Acta Constatacion ===

  // registrarInfraccion() {
  //   const dataPost = new FormData();
  //   var nnumnot = this.nnumnot;
  //   var p_codcon = this.p_codcon; //ccontri
  //   var cpredio = this.cpredio;
  //   var r_codint = this.r_codint; //cmulta
  //   var nmonto = this.nmonto;
  //   var cofisan = this.cofisan;
  //   var carea = this.carea;
  //   var p_act_id = this.p_act_id;
  //   var p_ocu_id = this.p_ocu_id;
  //   var p_udi_id = this.noseque;
  //   var p_car_direcc = this.p_car_direcc;
  //   var p_car_correo = this.p_car_correo;
  //   var p_car_fecemi = this.p_car_fecemi;
  //   var p_car_imgfot = this.p_car_imgfot;
  //   var p_tdi_id = this.p_tdi_id;
  //   var p_per_numdoi = this.p_per_numdoi;

  //   dataPost.append('p_car_id', p_car_id);
  //   dataPost.append('p_per_id', p_per_id);
  //   dataPost.append('p_act_id', p_act_id);
  //   dataPost.append('p_ocu_id', p_ocu_id);
  //   dataPost.append('p_udi_id', p_udi_id);
  //   dataPost.append('p_car_direcc', p_Fcar_direcc);
  //   dataPost.append('p_car_correo', p_car_correo);
  //   dataPost.append('p_car_manali', p_car_manali.toString());
  //   dataPost.append('p_car_fecemi', p_car_fecemi);
  //   dataPost.append('p_car_numrec', p_car_numrec);
  //   dataPost.append('p_car_imgfot', p_car_imgfot);
  //   dataPost.append('p_car_imgfot_file[]', this.imagenrecort, this.imagenrecort.name);
  //   dataPost.append('p_car_imgext', p_car_imgext);
  //   dataPost.append('p_tdi_id', p_tdi_id.toString());
  //   dataPost.append('p_per_numdoi', p_per_numdoi.toString());
  // }
}
