import { Component, EventEmitter, OnInit, Output, ViewChild, OnDestroy, AfterViewInit, TemplateRef } from '@angular/core';
import { Subject } from 'rxjs';
import { SigtaService } from 'src/app/services/sigta.service';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-listar-administrado',
  templateUrl: './listar-administrado.component.html',
  styleUrls: ['./listar-administrado.component.css']
})
export class ListarAdministradoComponent implements OnInit, AfterViewInit, OnDestroy {

  modalRefs: { [key: string]: BsModalRef } = {}; // Objeto para almacenar los modalRefs
  modalRef?: BsModalRef;

  //parámetros de búsqueda
  p_nomcontri: string = '';
  p_mensaje: string = '';
  datosContribuyente: any;

  @ViewChild(DataTableDirective, { static: false }) dtElementModal!: DataTableDirective;


  @Output() confirmClicked = new EventEmitter<any>();

  dtTriggerModal: Subject<void> = new Subject<void>();
  dtOptionsModal: DataTables.Settings = {};
  dtInstance: DataTables.Api | undefined;
  constructor(
    private sigtaService: SigtaService,
    private spinner: NgxSpinnerService,
    private modalService: BsModalService
  ) {
    this.dtOptionsModal = {
      paging: true,
      pagingType: 'numbers',
      info: false,
      scrollY: '320px',
      language: {
        // url: "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json"
      },
    }
  }

  ngOnInit(): void {
    // this.busContribuyente();
  }

  ngOnDestroy(): void {
    this.dtTriggerModal.unsubscribe();
  }
  ngAfterViewInit() {
    this.dtTriggerModal.next();
  }

  emitir(id: string): void {
    this.confirmClicked.emit(id);
  }

  confirmClick(value: string) {
    this.p_nomcontri = value;
    this.busContribuyente(value);
    this.modalService.hide(1);
  }

  cerrarModal(modalKey: string) {
    if (this.modalRefs[modalKey]) {
      this.modalRefs[modalKey].hide(); // Cierra el modal si está definido
    }
  }

  modalDescri(template: TemplateRef<any>) {
    this.modalRefs['listar-descri'] = this.modalService.show(template, { id: 2, class: 'modal-xl', backdrop: 'static', keyboard: false });
    this.modalService.hide(1);
  }

  busContribuyente(value: any) {
    let post = {
      p_nomcontri: this.p_nomcontri,
      p_mensaje: this.p_mensaje,
    };

    if (this.p_nomcontri.length > 2) {
      this.spinner.show();

     
      this.sigtaService.busContribuyente(post).subscribe({
        next: (data: any) => {
          this.spinner.hide();

          this.datosContribuyente = data;
          this.dtElementModal.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.destroy();
            this.dtTriggerModal.next();
          });
        },
        error: (error: any) => {
          console.log(error);
          this.spinner.hide();
        },
      });
    } else {

    }
  }

}
