import { Component, OnInit, Input, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SigtaService } from 'src/app/services/sigta.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { createMask } from '@ngneat/input-mask';

@Component({
  selector: 'app-cosgas-modal',
  templateUrl: './cosgas-modal.component.html',
  styleUrls: ['./cosgas-modal.component.css']
})
export class CosgasModalComponent implements OnInit {

  submitted: boolean = false;
  error: string = '';

  //FORMULARIO ANULAR MULTA
  resanu: string = '';

  modalRefs: { [key: string]: BsModalRef } = {}; // Objeto para almacenar los modalRefs

  idcorrl: number = 0

  //COSGAS
  // concid: number = 0;
  datosCosGas: any = [];

  p_expnid: number = 0;
  p_concid: number = 0;
  p_subcid: number = 0;
  p_feccga: string = '';
  p_fecncg: string = '';
  p_montot: string = '';



  selectedDesdil: string = '';
  destitulo: string = '';
  descombo: string = '';

  currencyInputMask = createMask({
    alias: 'numeric',
    groupSeparator: ',',
    digits: 2,
    digitsOptional: false,
    prefix: 'S/. ',
    placeholder: '0',
  });

  constructor(
    private sigtaService: SigtaService,
    private spinner: NgxSpinnerService,
    private modalService: BsModalService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.p_concid = this.sigtaService.p_concid;
    this.p_expnid = this.sigtaService.exp_id;
    console.log(this.p_expnid);
    this.mostrarValueCosGas();
    this.consultarCosGas();
    this.validarSelectDisable();
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

  goBackTo() {
    setTimeout(() => {
      switch (this.error) {
        case 'Registro Procesado Correctamente':
          this.modalService.hide(8)
          // location.reload();
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

  getMaxDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  onSelectionChange(event: any) {
    let value = event.target.value;
    let split = value.split('|');
    this.p_concid = split[0];
    this.p_subcid = split[1];
    // console.log(this.p_concid + " " + this.p_subcid)
    console.log(this.p_concid);
    console.log(this.p_subcid);
  }

  validarNumero(event: any): void {
    const keyCode = event.keyCode;
    if (keyCode < 48 || keyCode > 57) {
      event.preventDefault();
    }
  }

  mostrarValueCosGas() {
    if (this.p_concid === 5) {
      this.destitulo = 'Registrar Costas Procesales'
      this.descombo = 'Seleccione Diligencia'
    }
    if (this.p_concid === 6) {
      this.destitulo = 'Registrar Gastos Administrativos'
      this.descombo = 'Seleccione Gastos'
    }
  };

  formatNumber() {
    const nmontoAsNumber = parseFloat(this.p_montot);

    let formattedNumber = nmontoAsNumber.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    formattedNumber = formattedNumber.replace('.', '.');

    formattedNumber = formattedNumber.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');

    if (nmontoAsNumber >= 0) {
      this.p_montot = formattedNumber;
    } else {
      this.p_montot = '0.00';
    }
  }

  validarSelectDisable() {
    const cosgas = document.getElementById('cosgasid')

    if (this.p_concid === 6) {
      this.p_subcid = 699;
      console.log(this.p_concid);
      console.log(this.p_subcid);

      cosgas?.setAttribute('disabled', 'disabled')
      cosgas?.classList.add('disabled-color')
    } else {
      cosgas?.removeAttribute('disabled')
      cosgas?.classList.remove('disabled-color')
    }
  }



  consultarCosGas() {

    let post = {
      p_concid: this.p_concid,
      // p_subcid: this.p_fecini.toString(),
    };
    // console.log(post);
    this.sigtaService.listarCosGasValue(post).subscribe({
      next: (data: any) => {

        this.datosCosGas = data;
        // console.log(this.datosCosGas);

      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  registrarCosGas() {
    console.log("usuins: ", this.sigtaService.cusuari);
    const montoLimpio = this.p_montot.replace('S/.', '').replace(',', '');
    const montoFloat = parseFloat(montoLimpio);
    console.log("sin-format:", this.p_montot);
    console.log("format-number:", montoFloat);

    let post = {
      p_expnid: this.p_expnid,
      p_concid: this.p_concid,
      p_subcid: this.p_subcid,
      p_feccga: this.p_feccga,
      p_fecncg: this.p_fecncg,
      p_montot: montoFloat,
    };
    // console.log(post);
    this.sigtaService.registrarCosGas(post).subscribe({
      next: (data: any) => {

        this.error = data[0].mensa;
        const errorCode = data[0].error;
        console.log(this.error);

        // Selecciona el icono según el código de error
        const icon = this.getIconByErrorCode(errorCode);

        // Muestra el SweetAlert con el icono y el mensaje de error
        this.errorSweetAlert(icon, this.goBackTo.bind(this));

        // this.goBackTo();

        // this.datosCosGas = data;
        // console.log("data:", data);

      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

}
