import { Component, EventEmitter, OnInit, Output, ViewChild, OnDestroy, AfterViewInit, TemplateRef } from '@angular/core';
import { Subject } from 'rxjs';
import { SigtaService } from 'src/app/services/sigta.service';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import { ListarAdministradoComponent } from '../listar-administrado/listar-administrado.component';
import { PersonasComponent } from 'src/app/pages/personas/personas.component';

@Component({
  selector: 'app-crear-administrado',
  templateUrl: './crear-administrado.component.html',
  styleUrls: ['./crear-administrado.component.css']
})
export class CrearAdministradoComponent implements OnInit, AfterViewInit, OnDestroy {
  modalRef?: BsModalRef;

  p_grutipDoc: string = '01';
  p_grutipPer: string = '02';
  p_codtip: string = '';
  p_dcodtip: string = '';
  crefere: string = '';
  via: string = '';
  haburb: string = '';

  error: string = '';


  datosTipoPersona: any;
  datosTipoDocumento: any;
  datosDistrito: any;
  datosReferencia: any;
  dataUsuario: any;
  datosPersonaPide: any
  datosPersona: any

  //Variables
  ccontri: string = ''
  ctipper: string = ''
  ctipdoc: string = ''
  dtipdoc: string = ''
  dpatern: string = ''
  dmatern: string = ''
  dnombre: string = ''
  cpostal: string = ''
  ccodurb: string = ''
  dtipurb: string = ''
  dnomurb: string = ''
  ccodvia: string = ''
  dtipvia: string = ''
  dnomvia: string = ''
  dnrofis: string = ''
  dintfis: string = ''
  ddepfis: string = ''
  dletfis: string = ''
  dlotfis: string = ''
  dblofis: string = ''
  dmzafis: string = ''
  drefere: string = ''
  dnumtel: string = ''
  de_mail: string = ''
  dnumcel: string = ''
  fecnaci: string = ''
  cusuari: string = ''

  //datos emitidos de crear referencia
  cdvia: string = ''
  cdtipvia: string = ''
  cdescri: string = ''
  ccodhur: string = ''
  ctiphur: string = ''
  dpoblad: string = ''
  ctipvia: string = ''

  dnomurbvalue: string = ''
  dnomviavalue: string = ''

  valor: boolean = false

  // template: any


  @ViewChild(DataTableDirective, { static: false }) dtElementModal!: DataTableDirective;

  @Output() confirmClicked = new EventEmitter<any>();

  modalRefs: { [key: string]: BsModalRef } = {}; // Objeto para almacenar los modalRefs

  dtTriggerModal: Subject<void> = new Subject<void>();
  dtOptionsModal: DataTables.Settings = {};
  dtInstance: DataTables.Api | undefined;

  constructor(
    private sigtaService: SigtaService,
    private spinner: NgxSpinnerService,
    private modalService: BsModalService,
    // private personaComponent: PersonasComponent
  ) {
    // this.datosPersona = this.personaComponent.dataPersonaExport
  }

  ngOnInit(): void {

    this.listarTipoDocumento();
    this.listarTipoPersona();
    this.listarDistrito();
    this.getDataAdm();

    this.cusuari = this.sigtaService.cusuari;
    console.log(this.cusuari);


    this.dtOptionsModal = {
      paging: true,
      pagingType: 'numbers',
      info: false,
      language: {
        url: "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json"
      },
    }
  }

  ngOnDestroy(): void {
    this.dtTriggerModal.unsubscribe();
  }
  ngAfterViewInit() {
    this.dtTriggerModal.next();
  }

  //============================ MENSAJES SWEET ALERT =================================

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


  goBackToMultas() {
    setTimeout(() => {
      switch (this.error) {
        case 'Transaccion Realizada Correctamente':
          this.modalService.hide(2)
          break;
        default:
          //
          break;
      }
    });
  }



  // =============================== MODALES ====================================

  // confirmClick(value: string) {
  //   // this.p_codcon = value;
  //   // this.obtenerNombrePorCod(value);
  //   // this.modalService.hide(1);
  // }

  emitir(id: string): void {
    this.confirmClicked.emit(id);
  }

  confirmClickRefere(value: any) {
    console.log(value);

    this.ctipvia = value.ctipvia
    this.ccodhur = value.ccodhur

    this.dnomviavalue = value.dpoblad;
    this.dnomurbvalue = value.v_tipo;
    this.ccodurb = value.cpoblad;
    this.dtipurb = value.dtippob;
    this.ccodvia = value.v_codi;
    // this.dtipvia = value.v_tipo;

    //Datos emitidos de crear referencia
    // this.dnomvia = value.cdvia;
    this.dtipvia = value.v_descri;
    this.cdescri = value.cdescri;
    // this.ccodhur = value.ccodhur;
    // this.dtipurb = value.ctiphur;
    this.dpoblad = value.dpoblad;

    let nombreVia: string = value.v_descri + ' ' + value.v_tipo;
    let nombreUrb: string = value.dtippob + ' ' + value.dpoblad;
    this.dnomvia = nombreVia;
    this.dnomurb = nombreUrb;

    this.modalService.hide(1);
  }

  cerrarModal(modalKey: string) {
    if (this.modalRefs[modalKey]) {
      this.modalRefs[modalKey].hide(); // Cierra el modal si está definido
    }
  }

  modalDescri(template: TemplateRef<any>) {
    this.modalRefs['listar-urba'] = this.modalService.show(template, { id: 1, class: ' modal-lg urba', backdrop: 'static', keyboard: false });
    const secondModalBackdrop = document.getElementsByClassName('urba')[0]?.parentElement;
    if (secondModalBackdrop) {
      secondModalBackdrop.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    }
    console.log("modal-descri-ubi");
  }





  // ========================== EVENTOS ONCHANGE ===============================

  ChangeTipoDoc(event: any) {
    // this.dtipdoc = event.dcodtip
    this.ctipdoc = event.ccodtip
    console.log(this.ctipdoc)
  }

  ChangeTipoPer(event: any) {
    this.ctipper = event.ccodtip
  }

  ChangeTipoDistrito(event: any) {
    this.cpostal = event.CPOSTAL
    console.log(this.cpostal)
    this.sigtaService.cpostal = this.cpostal
    console.log(this.sigtaService.cpostal);

  }

  onInputChange(event: any) {
    event.target.value = event.target.value.toUpperCase();
  }

  ChangeTipoInput(event: any): void {
    this.dtipdoc = ''

    const tipoDocumentoSeleccionado = event.ccodtip;

    if (tipoDocumentoSeleccionado === '01' || tipoDocumentoSeleccionado === '04') {
      this.valor = true;
    } else {
      this.valor = false;
    }
  }

  validarDni() {
    if (this.ctipdoc === 'DNI') {
      this.dtipdoc = ''
    }
  }




  // ============================== METODOS ======================================

  getDataAdm() {
    this.ctipper = this.datosPersona.ctipper //Tipo Persona
    this.ctipdoc = this.datosPersona.ctipdoc
    this.dtipdoc = this.datosPersona.dtipdoc
    this.dpatern = this.datosPersona.dpatern
    this.dmatern = this.datosPersona.dmatern
    this.dnombre = this.datosPersona.dnombre
    this.dnumcel = this.datosPersona.dnumcelular
    this.dnumtel = this.datosPersona.dnumtel
    this.de_mail = this.datosPersona.de_mail
    this.fecnaci = this.datosPersona.fecnac
    this.cpostal = this.datosPersona.cpostal
    this.dnomvia = this.datosPersona.dnomvia
    this.dnomurb = this.datosPersona.dnomurb
    this.dnrofis = this.datosPersona.dnrofis
    this.ddepfis = this.datosPersona.ddepfis
    this.dintfis = this.datosPersona.dintfis
    this.dletfis = this.datosPersona.dletfis
    this.dblofis = this.datosPersona.dblofis
    this.dmzafis = this.datosPersona.dmzafis
    this.dlotfis = this.datosPersona.dlotfis
    this.drefere = this.datosPersona.drefere
  }

  obtenerReferencia() {
    let post = {
      p_desubi: this.crefere,
    };

    console.log(post);

    this.spinner.show();

    this.sigtaService.listarReferencia(post).subscribe({
      next: (data: any) => {
        this.spinner.hide();
        console.log(data);
        this.datosReferencia = data;

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

  listarTipoDocumento() {
    let post = {
      p_grutip: this.p_grutipDoc,
    };

    this.spinner.show();

    console.log(post);
    this.sigtaService.listarTipoPersona(post).subscribe({
      next: (data: any) => {
        this.spinner.hide();
        console.log();

        this.datosTipoDocumento = data;
      },
      error: (error: any) => {
        console.log(error);
        this.spinner.hide();
      },
    });
  }

  listarTipoPersona() {
    let post = {
      p_grutip: this.p_grutipPer,
    };

    this.spinner.show();

    console.log(post);
    this.sigtaService.listarTipoPersona(post).subscribe({
      next: (data: any) => {
        this.spinner.hide();
        console.log();

        this.datosTipoPersona = data;
      },
      error: (error: any) => {
        console.log(error);
        this.spinner.hide();
      },
    });
  }

  listarDistrito() {
    let post = {
    };

    this.spinner.show();

    console.log(post);
    this.sigtaService.listarDistrito(post).subscribe({
      next: (data: any) => {
        this.spinner.hide();
        console.log();

        this.datosDistrito = data;
      },
      error: (error: any) => {
        console.log(error);
        this.spinner.hide();
      },
    });
  }

  validarTipDoc() {
    if (this.ctipdoc === '' || this.ctipdoc === null) {
      this.dpatern = ''
      this.dmatern = ''
      this.dnombre = ''
      this.fecnaci = ''
      this.dtipdoc = ''
      this.ctipdoc = ''
    }
  }

  validarNumDoc() {
    if (this.dtipdoc === '') {
      this.dpatern = ''
      this.dmatern = ''
      this.dnombre = ''
      this.fecnaci = ''
      this.dtipdoc = ''
      // this.ctipdoc = ''
    }
  }

  consultarPide() {
    let post = {
      p_tdi_id: this.ctipdoc,
      p_per_numdoi: this.dtipdoc,
    };

    // this.spinner.show();

    console.log(post);
    if (this.dtipdoc.length > 6) {
      this.sigtaService.consultarPide(post).subscribe({
        next: (data: any) => {

          // this.spinner.hide();
          console.log(data);
          this.datosPersonaPide = data['persona'];
          if (this.datosPersonaPide) {
            console.log(this.datosPersonaPide);

            this.dpatern = data['persona'].pen_apepat,
              this.dmatern = data['persona'].pen_apemat,
              this.dnombre = data['persona'].pen_nombre,
              this.fecnaci = data['persona'].pen_fecnac
          } else {
            this.dpatern = ''
            this.dmatern = ''
            this.dnombre = ''
            this.fecnaci = ''
            // this.spinner.hide();
          }

        },
        error: (error: any) => {
          console.log(error);
          // this.dpatern = ''
          // this.dmatern = ''
          // this.dnombre = ''
          // this.fecnaci = ''
          // this.spinner.hide();
        },
      });
    } else {
      // console.log('pocos digitos');
      this.dpatern = ''
      this.dmatern = ''
      this.dnombre = ''
      this.fecnaci = ''
      this.spinner.hide();

    }
  }

  registrarAdministrado() {

    let storedData = localStorage.getItem('dataUsuario')
    if (storedData != null) {
      this.dataUsuario = JSON.parse(storedData);
    }

    let post = {
      ccontri: this.ccontri,
      ctipper: this.ctipper,
      ctipdoc: this.ctipdoc,
      dtipdoc: this.dtipdoc,
      dpatern: this.dpatern,
      dmatern: this.dmatern,
      dnombre: this.dnombre,
      cpostal: this.cpostal,
      ccodurb: this.ccodurb,
      dtipurb: this.dtipurb,
      dnomurb: this.dnomurbvalue,
      ccodvia: this.ccodvia,
      dtipvia: this.dtipvia,
      dnomvia: this.dnomviavalue,
      dnrofis: this.dnrofis,
      dintfis: this.dintfis,
      ddepfis: this.ddepfis,
      dletfis: this.dletfis,
      dlotfis: this.dlotfis,
      dblofis: this.dblofis,
      dmzafis: this.dmzafis,
      drefere: this.drefere,
      dnumtel: this.dnumtel,
      de_mail: this.de_mail,
      dnumcel: this.dnumcel,
      fecnaci: this.fecnaci,
      cusuari: this.cusuari,
    };

    this.spinner.show();

    this.sigtaService.registrarAdministrado(post).subscribe({

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
          this.errorSweetAlertCode(icon, this.goBackToMultas.bind(this));

        } else {
          this.errorSweetAlertCode();
        }

        // if (this.error === "Registrado correctamente") {
        //   if (this.modalService) {
        //     setTimeout(() => {
        //       this.modalService.hide(2);
        //     }, 1000);
        //   }
        // }

      },
      error: (error: any) => {
        this.spinner.hide();
        this.errorSweetAlertCode();
        console.log(error);
      },
    });
  }

  //---------------------------------------------------------

  validarNumero(event: any): void {
    const keyCode = event.keyCode;
    if (keyCode < 48 || keyCode > 57) {
      event.preventDefault();
    }
  }

  validarDocumento(event: any): void {
    if (this.valor) {
      const keyCode = event.keyCode;
      if (keyCode < 48 || keyCode > 57) {
        event.preventDefault();
      }
    }
  }

  getMaxDate(): string {
    // Obtener la fecha actual en formato "YYYY-MM-DD"
    return new Date().toISOString().split('T')[0];
  }

}
