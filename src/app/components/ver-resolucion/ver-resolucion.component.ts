import { Component, OnInit,Input, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SigtaService } from 'src/app/services/sigta.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-ver-resolucion',
  templateUrl: './ver-resolucion.component.html',
  styleUrls: ['./ver-resolucion.component.css']
})
export class VerResolucionComponent implements OnInit {

  modalRefs: { [key: string]: BsModalRef } = {}; // Objeto para almacenar los modalRefs

  datosMulta:any;

    //FORMULARIO VER RESOLUCION 
  // formResolucion!: FormGroup;
  vercnumres: string = '';
  verdfecres: string = '';
  verdfecnot: string = '';
  verobservc: string = '';
  // veridcorrl: number = 0;
  // versubmitted: boolean = false;

  idcorrl: number = 0

  constructor(
    private sigtaService: SigtaService,
    private spinner: NgxSpinnerService,
  ) {
    
   }

  ngOnInit(): void {
    this.idcorrl = this.sigtaService.idcorrl;
    console.log(this.idcorrl);
    this.consultarResolucion();
  }

  cerrarModal(modalKey: string) {
    console.log("cerrarModal called with modalKey:", modalKey);
    if (this.modalRefs[modalKey]) {
      this.modalRefs[modalKey].hide(); // Cierra el modal si está definido
    } else {
      console.log("Modal reference not found for key:", modalKey);
    }
  }

  consultarResolucion(){
    let post = {
      // p_codcon: this.p_codcon,
      // p_numnot: this.p_numnot,
      // p_codinf: this.p_codinf,
      // p_fecini: this.p_fecini.toString(),
      // p_fecfin: this.p_fecfin.toString(),
      p_idcorr: this.idcorrl,
    };
    console.log(post);
    this.spinner.show();

    this.sigtaService.consultarMulta(post).subscribe({
      next: (data: any) => {
        this.spinner.hide();
        console.log(data);

        // if (data && data.length > 0) {
          this.datosMulta = data;
          this.vercnumres = data[0].cnumres;
          this.verobservc = data[0].mobserv;
          this.verdfecres = data[0].dfecres;
          this.verdfecnot = data[0].dfecnot;
          
      },
      error: (error: any) => {
        // this.errorSweetAlertData();
        this.spinner.hide();
        console.log(error);
      },
    });
  }


  

}
