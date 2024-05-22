import { Component, EventEmitter, OnInit, Output, ViewChild, OnDestroy, AfterViewInit, TemplateRef } from '@angular/core';
import { Subject } from 'rxjs';
import { SigtaService } from 'src/app/services/sigta.service';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-listar-referencia-multa',
  templateUrl: './listar-referencia-multa.component.html',
  styleUrls: ['./listar-referencia-multa.component.css']
})
export class ListarReferenciaMultaComponent implements OnInit {

  modalRefs: { [key: string]: BsModalRef } = {}; // Objeto para almacenar los modalRefs

  p_desubi: string = '';
  via: string = '';
  haburb: string = '';

  //Parametros de crear-admininstrado
  ccodurb: string = '';
  dtipurb: string = '';
  ccodvia: string = '';
  dtipvia: string = '';
  //parámetros de búsqueda
  p_desinf: string = '';
  datosReferencia: any;

  @ViewChild(DataTableDirective, { static: false }) dtElementModal!: DataTableDirective;

  @Output() confirmClicked = new EventEmitter<any>();

  dtTriggerModal: Subject<void> = new Subject<void>();
  dtOptionsModal: DataTables.Settings = {};
  dtInstance: DataTables.Api | undefined;
  constructor(
    private sigtaService: SigtaService,
    private spinner: NgxSpinnerService,
    private modalService: BsModalService
  ) { }

  ngOnInit(): void {
    this.dtOptionsModal = {
      paging: true,
      pagingType: 'numbers',
      info: false,
      language: {
        url: "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json"
      },
      scrollY: '400px'
    }
    // this.obtenerReferencia();
  }

  ngOnDestroy(): void {
    this.dtTriggerModal.unsubscribe();
  }
  ngAfterViewInit() {
    this.dtTriggerModal.next();
  }

  emitir(data: any): void {
    console.log("data ", data);
    this.confirmClicked.emit(data);
    this.modalService.hide(12)
  }

  confirmClick(value: string) {
    // this.p_nomcontri = value;
    // this.busContribuyente(value);
    // this.modalService.hide(8);
  }
  modalCrearRefereMulta(template: TemplateRef<any>) {
    this.modalRefs['crear-referencia-multa'] = this.modalService.show(template, { id: 8, class: 'modal-lg crear-refe-multa', backdrop: 'static', keyboard: false });
    this.modalService.hide(12)
  }

  cerrarModal(modalKey: string) {
    console.log("cerrarModal called with modalKey:", modalKey);
    if (this.modalRefs[modalKey]) {
      this.modalRefs[modalKey].hide(); // Cierra el modal si está definido
    } else {
      console.log("Modal reference not found for key:", modalKey);
    }
  }


  obtenerReferencia(value: any) {

    let post = {
      p_desubi: this.p_desubi,
    };

    console.log(post);

    if (this.p_desubi.length > 2) {

      this.spinner.show();

      this.sigtaService.listarReferencia(post).subscribe({
        next: (data: any) => {
          this.spinner.hide();
          console.log(data);
          this.datosReferencia = data;
          // this.via = data[0].cdvia;
          // this.haburb = data[0].cpbdo;

          // this.ccodurb = data[0].cpoblad;
          // this.dtipurb = data[0].dtippob;
          // this.dnomurb = data[0].dpoblad;
          // this.ccodvia = data[0].v_codi;
          // this.dtipvia = data[0].v_tipo;
          // this.dnomvia= data[0].cdvia;
          console.log(this.ccodurb);
          console.log(this.dtipurb);
          console.log(this.ccodvia);
          console.log(this.dtipvia);


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
    } else {
      console.log("cantidad-caracteres");

    }
  }

  changeModal() {
    console.log("holaRefe");

    this.modalService.hide(1);
  }

}
