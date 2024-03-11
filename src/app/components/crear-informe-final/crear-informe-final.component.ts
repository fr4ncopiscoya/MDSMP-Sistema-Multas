import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SigtaService } from 'src/app/services/sigta.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-crear-informe-final',
  templateUrl: './crear-informe-final.component.html',
  styleUrls: ['./crear-informe-final.component.css']
})
export class CrearInformeFinalComponent implements OnInit {

  modalRefs: { [key: string]: BsModalRef } = {}; // Objeto para almacenar los modalRefs

    //FORMULARIO RESOLUCION
    cnumres: string = '';
    dfecres: string = '';
    dfecnot: string = '';
    observc: string = '';
    idcorrl: number = 0;

  constructor(
    private sigtaService: SigtaService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
  }

  cerrarModal(modalKey: string) {
    console.log("cerrarModal called with modalKey:", modalKey);
    if (this.modalRefs[modalKey]) {
      this.modalRefs[modalKey].hide(); // Cierra el modal si está definido
    } else {
      console.log("Modal reference not found for key:", modalKey);
    }
  }

}
