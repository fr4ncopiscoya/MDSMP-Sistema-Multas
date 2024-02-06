import { Component, EventEmitter, OnInit, Output, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { Subject } from 'rxjs';
import { SigtaService } from 'src/app/services/sigta.service';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-listar-referencia',
  templateUrl: './listar-referencia.component.html',
  styleUrls: ['./listar-referencia.component.css']
})
export class ListarReferenciaComponent implements OnInit, AfterViewInit, OnDestroy {

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

  emitir(data:any): void {
    this.confirmClicked.emit(data);
  }

  // busContribuyente() {
  //   let post = {
  //     p_nomcontri: this.p_nomcontri,
  //     p_mensaje: this.p_mensaje,
  //   };

  //   this.spinner.show();

  //   console.log(post);
  //   this.sigtaService.busContribuyente(post).subscribe({
  //     next: (data: any) => {
  //       this.spinner.hide();
  //       console.log();

  //       this.datosDescripcion = data;
  //       console.log("entra")
  //       this.dtElementModal.dtInstance.then((dtInstance: DataTables.Api) => {
  //         dtInstance.destroy();
  //         this.dtTriggerModal.next();
  //       });
  //     },
  //     error: (error: any) => {
  //       console.log(error);
  //       this.spinner.hide();
  //     },
  //   });
  // }


  obtenerReferencia() {

    let post = {
      p_desubi: this.p_desubi,
    };

    console.log(post);

    this.spinner.show();

    this.sigtaService.listarReferencia(post).subscribe({
      next: (data: any) => {
        this.spinner.hide();
        console.log(data);
        this.datosReferencia = data;
        this.via = data[0].cdvia;
        this.haburb = data[0].cpbdo;

        this.ccodurb = data[0].cpoblad;
        this.dtipurb = data[0].dtippob;
        // this.dnomurb = data[0].dpoblad;
        this.ccodvia = data[0].v_codi;
        this.dtipvia = data[0].v_tipo;
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
  }

}
