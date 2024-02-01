import { Component, EventEmitter, OnInit, Output, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { Subject } from 'rxjs';
import { SigtaService } from 'src/app/services/sigta.service';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-listar-referencia',
  templateUrl: './listar-referencia.component.html',
  styleUrls: ['./listar-referencia.component.css']
})
export class ListarReferenciaComponent implements OnInit, AfterViewInit, OnDestroy {

  crefere: string = '';

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

  emitir(id: string): void {
    this.confirmClicked.emit(id);
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
      p_desubi: this.crefere,
    };

    console.log(post);

    this.spinner.show();

    this.sigtaService.listarReferencia(post).subscribe({
      next: (data: any) => {
        this.spinner.hide();
        console.log(data);
        this.datosReferencia = data;
        // this.crefere = data[0].viaurb;
        console.log("llgaste refere");


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
