import { Component, OnInit, Input, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SigtaService } from 'src/app/services/sigta.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-anular-resolucion',
  templateUrl: './anular-resolucion.component.html',
  styleUrls: ['./anular-resolucion.component.css']
})
export class AnularResolucionComponent implements OnInit {


  submitted: boolean = false;
  error: string = '';

  //FORMULARIO ANULAR RESOLUCION
  formAnularResolucion!: FormGroup;
  mobserv: string = '';
  submitted_anular: boolean = false;

  modalRefs: { [key: string]: BsModalRef } = {}; // Objeto para almacenar los modalRefs

  idcorrl: number = 0

  constructor(
    private sigtaService: SigtaService,
    private spinner: NgxSpinnerService,
    private modalService: BsModalService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.idcorrl = this.sigtaService.idcorrl;
    console.log(this.idcorrl);
  }

  private errorSweetAlert(icon: 'error' | 'warning' | 'info' | 'success' = 'error', callback?: () => void) {
    Swal.fire({
      icon: icon,
      text: this.error || 'Hubo un error al procesar la solicitud',
    }).then((result) => {
      if (result.isConfirmed && callback) {
        callback();
      }
    });
  }

  private getIconByErrorCode(errorCode: string): 'error' | 'warning' | 'info' | 'success' {
    switch (errorCode) {
      case '-100':
        return 'error';
      case '-101':
        return 'error';
      case '-102':
        return 'error';
      case '-103':
        return 'error';
      case '0':
        return 'success';
      default:
        return 'error'; // Puedes establecer un icono predeterminado si no hay coincidencia
    }
  }

  goBackToMultas() {
    setTimeout(() => {
      switch (this.error) {
        case 'Resolucion Anulada Correctamente':
          location.reload();
          // this.modalService.hide(5)
          break;
        default:
          //
          break;
      }
    });
  }

  cerrarModal(modalKey: string) {
    console.log("cerrarModal called with modalKey:", modalKey);
    if (this.modalRefs[modalKey]) {
      this.modalRefs[modalKey].hide(); // Cierra el modal si está definido
    } else {
      console.log("Modal reference not found for key:", modalKey);
    }
  }

  anularResolucion() {
    let post = {
      p_idcorr: this.idcorrl,
      p_mobserv: this.mobserv,
    };
    console.log(post);
    this.spinner.show();

    this.sigtaService.anularResolucion(post).subscribe({
      next: (data: any) => {
        this.spinner.hide();
        console.log(data);

        this.error = data[0].mensa;
        const errorCode = data[0].error;
        console.log(this.error);

        // Selecciona el icono según el código de error
        const icon = this.getIconByErrorCode(errorCode);

        // Muestra el SweetAlert con el icono y el mensaje de error
        this.errorSweetAlert(icon, this.goBackToMultas.bind(this));
        // this.goBackToMultas()

      },
      error: (error: any) => {
        // this.errorSweetAlertData();
        this.spinner.hide();
        console.log(error);
      },
    });
  }

}
