import { Component, EventEmitter, OnInit, Output, ViewChild, OnDestroy, AfterViewInit, TemplateRef } from '@angular/core';
import { Subject } from 'rxjs';
import { SigtaService } from 'src/app/services/sigta.service';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import { CrearAdministradoComponent } from '../crear-administrado/crear-administrado.component';
import { ListarReferenciaComponent } from '../listar-referencia/listar-referencia.component';

@Component({
  selector: 'app-crear-referencia',
  templateUrl: './crear-referencia.component.html',
  styleUrls: ['./crear-referencia.component.css']
})
export class CrearReferenciaComponent implements OnInit {

  modalRefs: { [key: string]: BsModalRef } = {}; // Objeto para almacenar los modalRefs
  modalRef?: BsModalRef;

  //parámetros de búsqueda
  p_nomcontri: string = '';
  p_mensaje: string = '';
  datosVia: any;
  datosHabUrb: any;
  error: any;

  ctipvia: number = 0; // id_integral
  cdtipvia: string = '';
  cdescri: string = ''; // nombre via
  ccodhur: number = 0; // id_integral
  ctiphur: number = 0; // abrev_detalle
  cpostal: string = ''; // Distrito
  cpoblad: string = ''; //En blanco
  dpoblad: string = ''; // Nombre H.U


  @ViewChild(DataTableDirective, { static: false }) dtElementModal!: DataTableDirective;


  @Output() confirmClicked = new EventEmitter<any>();

  dtTriggerModal: Subject<void> = new Subject<void>();
  dtOptionsModal: DataTables.Settings = {};
  dtInstance: DataTables.Api | undefined;
  constructor(
    private sigtaService: SigtaService,
    private spinner: NgxSpinnerService,
    private modalService: BsModalService,
    private listarrEferenca: ListarReferenciaComponent
  ) { }

  ngOnInit(): void {
    this.dtOptionsModal = {
      paging: true,
      pagingType: 'numbers',
      info: false,
      scrollY: '320px',
      language: {
        url: "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json"
      },
    }
    this.cpostal = this.sigtaService.cpostal
    console.log(this.cpostal);

    this.listarVias();
    this.listarHabUrb();
  }

  ngOnDestroy(): void {
    this.dtTriggerModal.unsubscribe();
  }
  ngAfterViewInit() {
    this.dtTriggerModal.next();
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

  private errorSweetAlert(icon: 'error' | 'warning' | 'info' | 'success' = 'error') {
    Swal.fire({
      icon: icon,
      text: this.error || 'Hubo un error al procesar la solicitud',
    });
  }


  emitir(id: string): void {
    this.confirmClicked.emit(id);
  }

  confirmClick(value: string) {


    this.modalService.hide(1);
  }



  onSelectionChangeVia(event: any) {
    let value = event.target.value;
    let split = value.split('|');
    this.ctipvia = split[0];
    this.cdtipvia = split[1];
    // console.log(this.p_concid + " " + this.p_subcid)
    console.log(this.ctipvia);
    console.log(this.cdtipvia);

  }

  onSelectionChangeUrb(event: any) {
    let value = event.target.value;
    let split = value.split('|');
    this.ccodhur = split[0];
    this.ctiphur = split[1];
    // console.log(this.p_concid + " " + this.p_subcid)
    console.log(this.ccodhur);
    console.log(this.ctiphur);

  }



  goBackToReferencia() {
    console.log(this.error);
    setTimeout(() => {
      switch (this.error) {
        case 'Transaccion Registrada Correctamente':
          this.modalService.hide(8)
          // location.reload();
          break;
        default:
          //
          break;
      }
    }, 800);
  }



  cerrarModal(modalKey: string) {
    if (this.modalRefs[modalKey]) {
      this.modalRefs[modalKey].hide(); // Cierra el modal si está definido
    }
  }

  listarVias() {
    let post = {

    };
    this.spinner.show();

    console.log(post);
    this.sigtaService.listarVias(post).subscribe({
      next: (data: any) => {
        this.spinner.hide();
        console.log(data);

        this.datosVia = data;
      },
      error: (error: any) => {
        console.log(error);
        this.spinner.hide();
      },
    });

  }

  listarHabUrb() {
    let post = {

    };
    this.spinner.show();

    console.log(post);
    this.sigtaService.listarHabUrb(post).subscribe({
      next: (data: any) => {
        this.spinner.hide();
        console.log(data);

        this.datosHabUrb = data;
      },
      error: (error: any) => {
        console.log(error);
        this.spinner.hide();
      },
    });

  }

  aceptarDireccion() {

    let data = {
      cdvia: this.ctipvia,
      v_descri: this.cdtipvia,
      v_tipo: this.cdescri,
      ccodhur: this.ccodhur,
      dtippob: this.ctiphur,
      dpoblad: this.dpoblad,
    }
    this.listarrEferenca.emitir(data);

    console.log(this.ctipvia);
    console.log(this.cdtipvia);
    console.log(this.cdescri);
    console.log(this.ccodhur);
    console.log(this.ctiphur);
    console.log(this.dpoblad);


    this.modalService.hide(8)
  }

  registrarDireccion() {


    // let post = {
    //   ctipvia: this.ctipvia,
    //   cdescri: this.cdescri,
    //   ctiphur: this.ctiphur,
    //   dpoblad: this.dpoblad,
    //   cpostal: this.cpostal,
    //   v_error: 0,
    //   v_mensa: '',
    //   v_numid: 0,
    // };
    // this.spinner.show();

    // console.log(post);
    // this.sigtaService.registrarDireccion(post).subscribe({
    //   next: (data: any) => {
    //     this.spinner.hide();
    //     console.log(data);

    //     this.error = data[0].mensa;
    //     const errorCode = data[0].error;
    //     console.log(this.error);
    //     const icon = this.getIconByErrorCode(errorCode);
    //     this.errorSweetAlert(icon);
    //     this.goBackToReferencia()
    //   },
    //   error: (error: any) => {
    //     console.log(error);
    //     this.errorSweetAlert();
    //     this.spinner.hide();
    //   },
    // });

  }

  // busContribuyente(value: any) {
  //   let post = {
  //     p_nomcontri: this.p_nomcontri,
  //     p_mensaje: this.p_mensaje,
  //   };

  //   if (this.p_nomcontri.length > 2) {
  //     this.spinner.show();

  //     console.log(post);
  //     this.sigtaService.busContribuyente(post).subscribe({
  //       next: (data: any) => {
  //         this.spinner.hide();
  //         console.log();

  //         this.datosContribuyente = data;
  //         this.dtElementModal.dtInstance.then((dtInstance: DataTables.Api) => {
  //           dtInstance.destroy();
  //           this.dtTriggerModal.next();
  //         });
  //       },
  //       error: (error: any) => {
  //         console.log(error);
  //         this.spinner.hide();
  //       },
  //     });
  //   } else {
  //     console.log("cantidad");

  //   }
  // }

}
