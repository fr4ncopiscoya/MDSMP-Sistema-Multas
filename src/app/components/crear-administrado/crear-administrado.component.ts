import { Component, EventEmitter, OnInit, Output, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { Subject } from 'rxjs';
import { SigtaService } from 'src/app/services/sigta.service';
import { DataTableDirective } from 'angular-datatables';
import { NgxSpinnerService } from 'ngx-spinner';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-crear-administrado',
  templateUrl: './crear-administrado.component.html',
  styleUrls: ['./crear-administrado.component.css']
})
export class CrearAdministradoComponent implements OnInit, AfterViewInit, OnDestroy {

  p_grutipDoc: string = '01';
  p_grutipPer: string = '02';
  p_codtip: string = '';
  p_dcodtip: string = '';

  datosTipoPersona: any;
  datosTipoDocumento: any;

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

    this.listarTipoDocumento();
    this.listarTipoPersona();

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

  emitir(id: string): void {
    this.confirmClicked.emit(id);
  }


  validarNumero(event: any): void {
    const keyCode = event.keyCode;
    if (keyCode < 48 || keyCode > 57) {
      event.preventDefault();
    }
  }

  
  getMaxDate(): string {
    // Obtener la fecha actual en formato "YYYY-MM-DD"
    return new Date().toISOString().split('T')[0];
  }
  
  onSelectionChangeMedida(event: any) {
    this.p_codtip= event.ccodtip
    // console.log(this.csancio)
  }

  onInputChange(event: any) {
    event.target.value = event.target.value.toUpperCase();
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
        console.log("entra")
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
        console.log("entra")
      },
      error: (error: any) => {
        console.log(error);
        this.spinner.hide();
      },
    });
  }

}
