import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { MasterService } from 'src/app/services/master.service';
import { SanidadService } from 'src/app/services/sanidad.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-persona',
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.css']
})
export class PersonaComponent implements OnInit {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: any;
  dtTrigger: Subject<void> = new Subject<void>();
  dtOptions: any = {  
    columnDefs: [
      { width: '5px', targets: 0 },
      { width: '310px', targets: 1 },
      { width: '8px', targets: 2 },
      { width: '15px', targets: 3 },
    ],
    dom: 'Bfrtip',
    buttons: [
      {
        extend: 'excelHtml5',
        text: 'Exportar a Excel',
        filename: 'PERSONA', // Nombre personalizado del archivo
      },
    ],
    lengthChange: false,
    searching: false,
    lengthMenu: [15], 
    paging: true,
    language: {
      url: "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json"
    },
    responsive: false,
  }

  //Variables Globales
  dataRecurrente:any;
  datosTipoDocumento: any;
  datosTipoGenero: any;
  datosPais: any;

  //Listado de Persona
  selectedPais:string='';

  p_per_id:number=0;
  p_tdi_id:number=0;
  p_per_numdoi:string='';
  p_pai_id:number=0;
  p_tge_id:number=0;
  p_pen_apepat:string='';
  p_pen_apemat:string='';
  p_rec_activo:string='';

  constructor(private appComponent: AppComponent
    , private serviceMaster: MasterService
    , private router: Router
    , private route: ActivatedRoute
    , private spinner: NgxSpinnerService
    , private serviceSanidad: SanidadService) {
    this.appComponent.login = false;
  }

  ngOnInit(): void {
    /* this.ListarRecurrente(); */
    this.listarTipoDocumentoIdentidad();
    this.listarTipoGenero();
    this.listarPais();
  }
  
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
  
  ngAfterViewInit() {
    this.dtTrigger.next();
  }

  descargaExcel() {
    let btnExcel = document.querySelector('#tablaAplicacion_wrapper .dt-buttons .dt-button.buttons-excel.buttons-html5') as HTMLButtonElement;
    btnExcel.click();
  }

  ListarRecurrente() {
    this.spinner.show();
    const data_post = {
      p_per_id     : this.p_per_id,
      p_tdi_id     : this.p_tdi_id,
      p_per_numdoi : this.p_per_numdoi,
      p_pai_id     : parseInt(this.selectedPais),
      p_tge_id     : this.p_tge_id,
      p_pen_apepat : this.p_pen_apepat,
      p_pen_apemat : this.p_pen_apemat,
      p_rec_activo : this.p_rec_activo
    };

    this.serviceSanidad.listarRecurrente(data_post).subscribe({
      next: (data: any) => {
        this.spinner.show();
        this.dataRecurrente = data;
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          this.dtTrigger.next();
        });
        setTimeout(() => {
          this.spinner.hide();
        }, 1000);
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  listarTipoDocumentoIdentidad() {
    let post = {
      p_tdi_id: 0,
      p_tpe_id: 1
    };
    this.serviceMaster.listarTipoDocumento(post).subscribe({
      next: (data: any) => {
        this.datosTipoDocumento = data;
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  listarTipoGenero() {
    let post = {};
    this.serviceMaster.listarGenero(post).subscribe({
      next: (data: any) => {
        this.datosTipoGenero = data;
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  listarPais() {
    let post = {};
    this.serviceMaster.listarPais(post).subscribe({
      next: (data: any) => {
        this.datosPais = data;
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }
}
