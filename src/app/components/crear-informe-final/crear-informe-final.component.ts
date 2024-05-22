import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SigtaService } from 'src/app/services/sigta.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-informe-final',
  templateUrl: './crear-informe-final.component.html',
  styleUrls: ['./crear-informe-final.component.css']
})
export class CrearInformeFinalComponent implements OnInit {

  modalRefs: { [key: string]: BsModalRef } = {}; // Objeto para almacenar los modalRefs

  //FORMULARIO RESOLUCION
  idcorrl: number = 0;
  cnuinfi: string = '';
  dfeinfi: string = '';
  ptipop: string = '';

  error: string = '';

  constructor(
    private sigtaService: SigtaService,
    private spinner: NgxSpinnerService,
    private modalService: BsModalService,
  ) { }

  ngOnInit(): void {
    this.idcorrl = this.sigtaService.idcorrl;
    console.log(this.idcorrl);
    this.consultarMulta();
    // this.validarRegistroAnular();
  }

  goBackToMultas() {
    setTimeout(() => {
      switch (this.error) {
        case 'Informe Anulado Correctamente':
        case 'Informe Registrado Correctamente':
          this.modalService.hide(7)
          this.consultarMulta();
          break;
        default:
          //
          break;
      }
    });
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

  cerrarModal(modalKey: string) {
    console.log("cerrarModal called with modalKey:", modalKey);
    if (this.modalRefs[modalKey]) {
      this.modalRefs[modalKey].hide(); // Cierra el modal si está definido
    } else {
      console.log("Modal reference not found for key:", modalKey);
    }
  }

  validarRegistroAnular() {
    console.log(this.cnuinfi);
    console.log(this.dfeinfi);

    //BUTTONS
    const btnguardar = document.getElementById('btn-guardar');
    const btnanular = document.getElementById('btn-anular');

    //INPUTS
    const inputnumero = document.getElementById('input-cnuinfi');
    const inputfecha = document.getElementById('input-dfeinfi');

    if (this.cnuinfi === null && this.dfeinfi === null) {
      //buttons
      btnguardar?.classList.remove('show-hide');
      btnanular?.classList.add('show-hide');

      //inputs
      inputnumero?.classList.remove('disabled-color');
      inputfecha?.classList.remove('disabled-color');
      inputnumero?.removeAttribute('disabled')
      inputfecha?.removeAttribute('disabled')

    } else {
      //buttons
      btnanular?.classList.remove('show-hide');
      btnguardar?.classList.add('show-hide');

      //inputs
      inputnumero?.classList.add('disabled-color');
      inputfecha?.classList.add('disabled-color');
      inputnumero?.setAttribute('disabled', 'disabled')
      inputfecha?.setAttribute('disabled', 'disabled')

    }
  }

  getMaxDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  consultarMulta() {
    let post = {
      p_idcorr: this.idcorrl,
    };
    console.log(post);
    this.spinner.show();

    this.sigtaService.consultarMulta(post).subscribe({
      next: (data: any) => {
        // this.validarRegistroAnular();
        this.spinner.hide();

        if (data && data.length > 0) {


          this.cnuinfi = data[0].nuinfi;
          this.dfeinfi = data[0].feinfi;

          this.validarRegistroAnular();

        } else {
          // this.errorSweetAlertData();
        }
      },
      error: (error: any) => {
        // this.errorSweetAlertData();
        this.spinner.hide();
        console.log(error);
      },
    });
  }

  registrarInformeFinal() {
    let post = {
      idcorrl: Number(this.idcorrl),
      cnuinfi: this.cnuinfi,
      dfeinfi: this.dfeinfi,
      ptipope: 1,
    }

    console.log(post);
    this.spinner.show();

    this.sigtaService.registrarInformeFinal(post).subscribe({
      next: (data: any) => {
        this.spinner.hide();
        console.log(data);

        this.error = data[0].mensa;
        const errorCode = data[0].error;
        console.log(this.error);           // Selecciona el icono según el código de error
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

  anularInformeFinal() {
    let post = {
      idcorrl: Number(this.idcorrl),
      cnuinfi: this.cnuinfi,
      dfeinfi: this.dfeinfi,
      ptipop: 2,
    }

    console.log(post);
    this.spinner.show();

    this.sigtaService.registrarInformeFinal(post).subscribe({
      next: (data: any) => {
        this.spinner.hide();
        console.log(data);

        this.error = data[0].mensa;
        const errorCode = data[0].error;
        console.log(this.error);           // Selecciona el icono según el código de error
        const icon = this.getIconByErrorCode(errorCode);

        // Muestra el SweetAlert con el icono y el mensaje de error
        this.errorSweetAlert(icon);
        this.goBackToMultas();

      },
      error: (error: any) => {
        // this.errorSweetAlertData();
        this.spinner.hide();
        console.log(error);
      },
    });
  }

}
