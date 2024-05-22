import { Component, EventEmitter, OnInit, Output, ViewChild, OnDestroy, AfterViewInit, TemplateRef } from '@angular/core';
import { Subject } from 'rxjs';
import { SigtaService } from 'src/app/services/sigta.service';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-listar-referencia',
  templateUrl: './listar-referencia.component.html',
  styleUrls: ['./listar-referencia.component.css']
})
export class ListarReferenciaComponent implements OnInit, AfterViewInit, OnDestroy {

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
    this.confirmClicked.emit(data);
  }

  confirmClick(value: string) {
    // this.p_nomcontri = value;
    // this.busContribuyente(value);
    // this.modalService.hide(8);
  }
  modalCrearRefere(template: TemplateRef<any>) {
    this.modalRefs['crear-referencia'] = this.modalService.show(template, { id: 8, class: 'modal-lg crear-refe', backdrop: 'static', keyboard: false });
    const secondModalBackdrop = document.getElementsByClassName('crear-refe')[0]?.parentElement;
    if (secondModalBackdrop) {
      secondModalBackdrop.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    }
    // this.modalService.hide(1);
  }

  cerrarModal(modalKey: string) {
    if (this.modalRefs[modalKey]) {
      this.modalRefs[modalKey].hide(); // Cierra el modal si está definido
    } else {
    }
  }


  obtenerReferencia(value: any) {

    let post = {
      p_desubi: this.p_desubi,
    };

    if (this.p_desubi.length > 2) {

      this.spinner.show();

      this.sigtaService.listarReferencia(post).subscribe({
        next: (data: any) => {
          this.spinner.hide();
          this.datosReferencia = data;
          this.via = data[0].cdvia;
          this.haburb = data[0].cpbdo;

          this.ccodurb = data[0].cpoblad;
          this.dtipurb = data[0].dtippob;
          // this.dnomurb = data[0].dpoblad;
          this.ccodvia = data[0].v_codi;
          this.dtipvia = data[0].v_tipo;
          // this.dnomvia= data[0].cdvia;


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

    }
  }

  changeModal() {
    this.modalService.hide(1);
  }

}
