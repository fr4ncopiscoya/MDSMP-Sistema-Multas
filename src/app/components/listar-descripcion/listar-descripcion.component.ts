import { Component, EventEmitter, OnInit, Output, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { Subject } from 'rxjs';
import { SigtaService } from 'src/app/services/sigta.service';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-listar-descripcion',
  templateUrl: './listar-descripcion.component.html',
  styleUrls: ['./listar-descripcion.component.css']
})
export class ListarDescripcionComponent implements OnInit, AfterViewInit, OnDestroy {

  p_codinf: string = '';

  //parámetros de búsqueda
  p_desinf: string = '';
  datosDescripcion: any;

  @ViewChild(DataTableDirective, { static: false }) dtElementModal!: DataTableDirective;

  @Output() confirmClicked = new EventEmitter<any>();

  dtTriggerModal: Subject<void> = new Subject<void>();
  dtOptionsModal: DataTables.Settings = {
    columnDefs: [
      // { width: '2px', targets: 0 },
      // { width: '2px', targets: 1 },
    ],
  };
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
    // this.obtenerDescriPorCod();
  }

  ngOnDestroy(): void {
    this.dtTriggerModal.unsubscribe();
  }
  ngAfterViewInit() {
    this.dtTriggerModal.next();
    this.dtOptionsModal = {
      columnDefs: [
        // { width: '20px', targets: 0 },
        // { width: '20px', targets: 1 },
        // { width: '20px', targets: 2 },
        // { width: '20px', targets: 3 },
      ],};
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


  obtenerDescriPorCod() {
    const añoActual = new Date().getFullYear();

    let post = {
      p_anypro: añoActual.toString(),
      p_codinf: this.p_codinf,
      p_desinf: this.p_desinf
    };

    console.log(post);

    this.spinner.show();

    this.sigtaService.obtenerDescripcionPorCod(post).subscribe({
      next: (data: any) => {
        this.spinner.hide();
        console.log(data);
        this.datosDescripcion = data;
        this.p_codinf = data[0].r_codint;
        console.log("llgaste descri");
        

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
