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

@Component({
    selector: 'app-ver-multa',
  templateUrl: './ver-multa.component.html',
  styleUrls: ['./ver-multa.component.css']
})
export class VerMultaComponent implements OnInit {
  

  datosAreaOficina: any;
  datosMedidaComp: any;
  datosGiroEstablecimiento: any;
  datosMulta: any;
  datosTipoEspecie: any;
  error: string = '';
  chkact = 0;


  //Variables
  p_anypro: string = ''; // --Fecha de Notificacion multa ====
  p_codinf: string = '';

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
  ) {
    let id = Number(this.route.snapshot.paramMap.get('id'));
    this.id_corrl = id;
    this.consultarMulta();
    this.appComponent.login = false;
  }

  ngOnInit(): void {
    console.log("ver-multa");
    

    const datePite = new DatePipe('en-Us')
    this.ahora = datePite.transform(new Date(), 'yyyy-MM-dd')
  }


  ngOnDestroy(): void {
    // this.dtTrigger.unsubscribe();
  }

  ngAfterViewInit() {
    // this.dtTrigger.next();
  }

  private errorSweetAlertData() {
    Swal.fire({
      icon: 'info',
      text: 'No se encontraron datos en su busqueda',
    });
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

  onInputChange(event: any) {
    event.target.value = event.target.value.toUpperCase();
  }

  consultarMulta() {
    let post = {
      p_codcon: this.p_codcon,
      p_numnot: this.nnumnot,
      p_codinf: this.r_descri,
      p_fecini: this.p_fecini.toString(),
      p_fecfin: this.p_fecfin.toString(),
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
          this.crefere = data[0].crefere,
          this.manzana = data[0].manzana,
          this.lote = data[0].lote,
          this.nro_fiscal = data[0].nro_fiscal,
          this.dpto_int = data[0].dpto_int,
          this.referencia = data[0].referencia,
          this.nnumnot = data[0].nnumnot,
          this.nro_acta = data[0].nro_acta,
          this.p_anypro = data[0].dfecnot ,//Fecha Multa
          this.cnumres = data[0].cnumres,
          this.dfecres = data[0].dfectra,
          this.dsancio = data[0].dsancio,
          this.chkact = data[0].chkact,
          this.nroActaConstatacion = data [0].ACTA_CONSTATACION ,
          this.f_ejecucion = data[0].f_ejecucion,
          this.giro = data [0].giro,
          this.desgiro= data [0].OTROS_GIROS,
          this.cmulta = data[0].cmulta,
          this.nmonto = data[0].nmonto,
          this.dareas = data[0].dareas,
          this.dmulta = data[0].dmulta,
          this.mobserv = data[0].mobserv,
          this.ins_municipal = data[0].ins_municipal,
          this.nro_informe = data[0].nro_informe,

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

}

