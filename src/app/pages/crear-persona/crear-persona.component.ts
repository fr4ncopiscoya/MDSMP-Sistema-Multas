import { Component, TemplateRef , OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { DomSanitizer } from '@angular/platform-browser';
import { MasterService } from 'src/app/services/master.service';
import { SanidadService } from 'src/app/services/sanidad.service';
import { ImageCroppedEvent, LoadedImage} from 'ngx-image-cropper';
import { NgxSpinnerService } from "ngx-spinner";
import Swal from 'sweetalert2';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';

@Component({
  selector: 'app-crear-persona',
  templateUrl: './crear-persona.component.html',
  styleUrls: ['./crear-persona.component.css']
})
export class CrearPersonaComponent implements OnInit {

  //Variables para Modal
  modalRef: any = BsModalRef;

  //Variables para Imagen
  imageUrl: string | null = 'assets/images/avatardefault_92824.png';
  selectedFile: File | null = null;
  p_car_imgfot : string = '';

  imagenseleccionada: File | null = null;
  imagenrecort: File | null = null;
  //Fin variables para Imagen

  //creación de formulario
  form!: FormGroup;

  datosOcupacion: any;
  datosRubro: any;
  datosEstablecimientos: any;

  //parámetros de formulario
  p_per_id: number = 0;
  p_tdi_id: number = 1;
  p_ude_id: number = 15;
  p_upr_id: number = 128;
  p_tdi_numero: string = '';
  p_rec_apepat: string = '';
  p_rec_apemat: string = '';
  p_rec_nombre: string = '';
  p_tge_id: number = 0;
  p_rec_correo: string = '';
  p_rec_telfij: string = '';
  p_rec_telcel: string = '';
  p_pai_id: number = 179;
  p_udi_id: number = 1315;
  p_rec_direcc: string = '';
  p_imgfot: string = '';
  p_etb_direcc: string = '';
  
  //p_etb_id: number = 0;
  
  p_manali: boolean = true;
  confsinomanali: string = '';

  //Desde aqui Para el TypeHead ESTABLECIMIENTO
  noResult: any;
  selectedOption: any;
  previewOption?: any;
  optionOnBlur: any;
  selectedValue: any;

  p_etb_id: string = '';
  //Fin variables

  //Desde aqui Para el TypeHead ESTABLECIMIENTO
  noResultRubro: any;
  selectedOptionRubro: any;
  previewOptionRubro?: any;
  optionOnBlurRubro: any;
  selectedValueRubro: any;

  p_act_id: string = ''; //ID RUBRO - GIRO
  //Fin variables
  
  //Desde aqui Para el TypeHead ESTABLECIMIENTO
  noResultOcupacion: any;
  selectedOptionOcupacion: any;
  previewOptionOcupacion?: any;
  optionOnBlurOcupacion: any;
  selectedValueOcupacion: any;

  p_ocu_id: string = ''; //ID OCUPACION
  //Fin variables

  //carga de datos en formulario
  datosDepartamento: any;
  datosProvincia: any;
  datosDistrito: any;
  datosTipoDocumento: any;
  datosTipoGenero: any;
  datosPais: any;

  showImageColumn: boolean = false;
  firstcolumn: string = '4';
  secondcolumn: string = '12';

  imageChangedEvent: any = '';
  croppedImage: any = 'assets/images/avatardefault_92824.png';
  textoimagenurl: any = 'assets/images/avatardefault_92824.png';

  constructor(private appComponent: AppComponent
    , private serviceMaster: MasterService
    , private sanidadService: SanidadService
    , private spinner: NgxSpinnerService
    , private fb: FormBuilder
    , private modalService: BsModalService
    , private sanitizer: DomSanitizer
    , private router: Router) {
    this.appComponent.login = false;
  }

  ngOnInit(): void {
    this.listarTipoDocumentoIdentidad();
    this.listarDepartamentos();
    this.listarProvincias();
    this.listarTipoGenero();
    this.listarPais();
    this.setForm();
    this.listarOcupacion();
    this.listarRubro();
    this.listarDistritos();
    this.listarEstablecimiento();
  }

  //ABRIR TYPEAHEAD ESTABLECIMIENTO
  typeaheadOnBlur(event: TypeaheadMatch): void {
    this.optionOnBlur = event.item;
    this.p_etb_id = '0';
    this.p_etb_direcc = '';
  }
  typeaheadNoResults(event: boolean): void {
    this.noResult = event;
    this.selectedOption = null;
  }
  onSelect(event: TypeaheadMatch): void {
    this.selectedOption = event.item;
    this.cambiarcampo();
  }
  cambiarcampo() {
    if (this.selectedOption !== null) {
      this.p_etb_id = this.selectedOption.etb_id;
      console.log('ESTE ES EL ID DEL ESTABLECIMIENTO: ' + this.p_etb_id);
      this.ChangeEstablecimiento(this.p_etb_id);
    } else {
      this.p_etb_id = '0';
      this.p_etb_direcc = '';
    }
  }
  onPreviewPuest(event: TypeaheadMatch): void {
    if (event) {
      this.previewOption = event.item;
    } else {
      this.previewOption = null;
    }
  }
  //TERMINAR TYPEAHEAD
  
  //ABRIR TYPEAHEAD RUBRO / GIRO
  typeaheadOnBlurRubro(event: TypeaheadMatch): void {
    this.optionOnBlurRubro = event.item;
    this.p_act_id = '0';
  }
  typeaheadNoResultsRubro(event: boolean): void {
    this.noResultRubro = event;
    this.selectedOptionRubro = null;
  }
  onSelectRubro(event: TypeaheadMatch): void {
    this.selectedOptionRubro = event.item;
    this.cambiarcampoRubro();
  }
  cambiarcampoRubro() {
    if (this.selectedOptionRubro !== null) {
      this.p_act_id = this.selectedOptionRubro.act_id;
      console.log('ESTE ES EL ID DEL RUBRO O ACTIVIDAD: ' + this.p_act_id);
    } else {
      this.p_act_id = '0';
    }
  }
  onPreviewPuestRubro(event: TypeaheadMatch): void {
    if (event) {
      this.previewOptionRubro = event.item;
    } else {
      this.previewOptionRubro = null;
    }
  }
  //TERMINAR TYPEAHEAD
  
  //ABRIR TYPEAHEAD OCUPACION
  typeaheadOnBlurOcupacion(event: TypeaheadMatch): void {
    this.optionOnBlurOcupacion = event.item;
    this.p_ocu_id = '0';
  }
  typeaheadNoResultsOcupacion(event: boolean): void {
    this.noResultOcupacion = event;
    this.selectedOptionOcupacion = null;
  }
  onSelectOcupacion(event: TypeaheadMatch): void {
    this.selectedOptionOcupacion = event.item;
    this.cambiarcampoOcupacion();
  }
  cambiarcampoOcupacion() {
    if (this.selectedOptionOcupacion !== null) {
      this.p_ocu_id = this.selectedOptionOcupacion.ocu_id;
      console.log('ESTE ES EL ID DE LA OCUPACION: ' + this.p_ocu_id);
    } else {
      this.p_ocu_id = '0';
    }
  }
  onPreviewPuestOcupacion(event: TypeaheadMatch): void {
    if (event) {
      this.previewOptionOcupacion = event.item;
    } else {
      this.previewOptionOcupacion = null;
    }
  }
  //TERMINAR TYPEAHEAD

  Changemanali(){
    console.log(this.p_manali);
    if (this.p_manali) {
      this.confsinomanali = 'SI';
    }else{
      this.confsinomanali = 'NO';
    }
  }

  setForm() {
    this.form = this.fb.group({
      p_tdi_id: ['', [Validators.required]],
      p_tdi_numero: ['', [Validators.required]],
      p_rec_apepat: ['', [Validators.required]],
      p_rec_apemat: ['', [Validators.required]],
      p_rec_nombre: ['', [Validators.required]],
      p_tge_id: ['', [Validators.required]],
      p_rec_correo: ['', [Validators.required]],
      p_pai_id: ['', [Validators.required]],
      p_udi_id: ['', [Validators.required]],
      p_rec_direcc: ['', [Validators.required]],
      p_ude_id: ['', [Validators.required]],
      p_upr_id: ['', [Validators.required]],
      p_rec_telcel: ['', [Validators.required]],
      p_etb_id: ['', [Validators.required]],
      p_etb_direcc: ['', [Validators.required]],
    })
  }

  openModal(template: TemplateRef<any>, clase: string) {
    this.modalRef = this.modalService.show(template, { class: clase });
  }
  
  cerrarModal() {
    this.modalRef?.hide();
  }

  ChangeEstablecimiento(p_etb_id : string){
    let post = {
      p_etb_id : parseInt(p_etb_id),
      p_etb_nombre : '',
      p_etb_activo : 9,
    };
    this.sanidadService.listarEstablecimiento(post).subscribe({
      next: (data: any) => {
        this.p_etb_direcc = data[0].etb_direcc;
        console.log(this.p_etb_direcc);
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }
  
  GuardarCambiosImagen() {
    this.imageUrl = this.croppedImage;
    this.cerrarModal();
  }

  listarDepartamentos() {
    let post = {
    };
    this.serviceMaster.listarDepartamento(post).subscribe({
      next: (data: any) => {
        this.datosDepartamento = data;
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  listarProvincias() {
    let post = {
      p_ude_id: this.p_ude_id
    };
    this.serviceMaster.listarProvincia(post).subscribe({
      next: (data: any) => {
        this.datosProvincia = data;
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  listarDistritos() {
    let post = {
      p_upr_id: this.p_upr_id
    };
    this.serviceMaster.listarDistrito(post).subscribe({
      next: (data: any) => {
        this.datosDistrito = data;
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

  listarOcupacion() {
    let post = {};
    this.sanidadService.listarOcupacion(post).subscribe({
      next: (data: any) => {
        this.datosOcupacion = data;
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  listarRubro() {
    let post = {
    };
    this.sanidadService.listarRubro(post).subscribe({
      next: (data: any) => {
        this.datosRubro = data;
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

  listarEstablecimiento() {
    let post = {
      p_etb_id : 0,
      p_etb_nombre : '',
      p_etb_activo : 9,
    };
    this.sanidadService.listarEstablecimiento(post).subscribe({
      next: (data: any) => {
        this.datosEstablecimientos = data;
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  llenarFormulario(data: any) {

  }

  buscarRecurrente() {
    let post = {
      p_tdi_id: this.p_tdi_id,
      p_per_numdoi: this.p_tdi_numero
    };
    this.spinner.show();
    this.sanidadService.listarRecurrente(post).subscribe({
      next: (data: any) => {
        if (Object.keys(data).length > 0) {
          this.p_per_id = data[0]['per_id'];
          this.p_rec_nombre = data[0]['pen_nombre'];
          this.p_rec_apepat = data[0]['pen_apepat'];
          this.p_rec_apemat = data[0]['pen_apemat'];
          this.p_tge_id = data[0]['tge_id'];
          this.p_rec_correo = data[0]['pen_correo'];
          this.p_rec_direcc = data[0]['rec_direcc'];
          this.p_pai_id = data[0]['pai_id'];
          this.p_ude_id = data[0]['ude_id'];
          setTimeout(() => {
            this.listarProvincias();
            this.p_upr_id = data[0]['upr_id'];
            setTimeout(() => {
              this.listarDistritos();
              this.p_udi_id = data[0]['udi_id'];
            }, 1000);
          }, 1000);
          this.spinner.hide();
        } else {
          this.buscarPersona();
        }

      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  buscarPersona() {
    let post = {
      p_tdi_id: this.p_tdi_id,
      p_per_numdoi: this.p_tdi_numero
    };
    this.serviceMaster.buscarPersonaBus(post).subscribe({
      next: (data: any) => {
        if (Object.keys(data).length > 0) {
          console.log(data);
          this.p_per_id = data[0]['per_id'];
          this.p_rec_nombre = data[0]['pen_nombre'];
          this.p_rec_apepat = data[0]['pen_apepat'];
          this.p_rec_apemat = data[0]['pen_apemat'];
          this.p_tge_id = data[0]['tge_id'];
          this.p_rec_correo = data[0]['pen_correo'];
          this.p_rec_telcel = data[0]['pen_numtel'];
          this.spinner.hide();
        } else {
          this.buscarPersonaPide();
        }

      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  buscarPersonaPide() {
    let post = {
      dni: this.p_tdi_numero,
      usuario: 75346505,
      app: 1
    };
    this.serviceMaster.buscarPersonaPide(post).subscribe({
      next: (data: any) => {
          if (data['consultarResponse']['return']['coResultado'] === '0000') {
            let response = data['consultarResponse']['return']['datosPersona'];
            console.log(response);
            this.p_rec_nombre = response['prenombres'];
            this.p_rec_apepat = response['apPrimer'];
            this.p_rec_apemat = response['apSegundo'];
            this.p_rec_direcc = response['direccion'];
            this.spinner.hide();
          } else {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Ocurrió un error, por favor registre los datos de manera manual.",
            });
          }
          this.spinner.hide();
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  guardarRecurrente() {
    let post = {
      p_per_id: this.p_per_id,
      p_tdi_id: this.p_tdi_id,
      p_tdi_numero: this.p_tdi_numero,
      p_rec_apepat: this.p_rec_apepat,
      p_rec_apemat: this.p_rec_apemat,
      p_rec_nombre: this.p_rec_nombre,
      p_tge_id: this.p_tge_id,
      p_rec_correo: this.p_rec_correo,
      p_rec_telfij: this.p_rec_telfij,
      p_rec_telcel: this.p_rec_telcel,
      p_pai_id: this.p_pai_id,
      p_udi_id: this.p_udi_id,
      p_rec_direcc: this.p_rec_direcc,
      p_imgfot: this.p_imgfot,
    }

    Swal.fire({
      title: '<b>Confirmación</b>',
      text: "¿Estás seguro de guardar la información?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.sanidadService.guardarRecurrente(post).subscribe({
          next: (data: any) => {
            let result = data[0];
            if (result.hasOwnProperty('error')) {
              if (result.error === 0) {
                Swal.fire({ title: '<h2>Confirmación</h2>', text: result.mensa, icon: 'success', confirmButtonText: 'Cerrar', confirmButtonColor: "#3085d6" }).then((result) => {
                  if (result.isConfirmed) {
                    this.router.navigate(['persona']);
                  }
                });
              }else{
                Swal.fire(result.mensa, 'Verifique los datos', 'error')
              }
            } else {
              Swal.fire('Ocurrió un error', 'Vuelva a intentarlo', 'error')
            }
          },
          error: (error: any) => {
            console.log(error);
          }
        });
      }
    })
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  
  async getObjectUrlBlob(objectUrl: string): Promise<File> {
    const response = await fetch(objectUrl);
    const blob = await response.blob();
    
    // Puedes ajustar el nombre del archivo según tus necesidades
    const fileName = this.p_car_imgfot;

    // Crear un nuevo archivo con el Blob y el nombre
    const file = new File([blob], fileName, { type: blob.type });

    return file;
  }

  imageCropped(event: any) {
    console.log(event);
    this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl);

    this.getObjectUrlBlob(event.objectUrl)
        .then(file => {
            // Manejar el archivo recortado como sea necesario
            this.imagenrecort = file;
            console.log('Archivo recortado:', this.imagenrecort);
        })
        .catch(error => {
            console.error('Error al obtener el Blob:', error);
        });

    if (event.base64) {
      this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl);
      const fileBlob = this.dataURItoBlob(event.base64);
      if (fileBlob) {
        const file = new File([fileBlob], this.p_car_imgfot, { type: 'image/png' });
        /* this.selectedFile = file; */
        console.log('Archivo recortado:', file);
      } else {
        console.error('No se pudo convertir la imagen recortada a Blob.');
      }
    } else {
      console.error('base64 en event es undefined.');
    }
  
  }
  
  dataURItoBlob(dataURI: string | undefined): Blob | null {
    if (!dataURI || typeof dataURI !== 'string') {
      console.error('dataURI no es válido:', dataURI);
      return null;
    }
  
    const commaIndex = dataURI.indexOf(',');
    if (commaIndex === -1) {
      console.error('dataURI no contiene una coma (,):', dataURI);
      return null;
    }
  
    const byteString = atob(dataURI.slice(commaIndex + 1));
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
  
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
  
    return new Blob([int8Array], { type: 'image/png' });
  }

  imageLoaded(image: LoadedImage) {
    // show cropper
  }
  
  cropperReady() {
    // cropper ready
  }

  loadImageFailed() {
    // show message
  }

  onFileSelected(event: any): void {
    this.imageChangedEvent = event;
    const file: File = event.target.files[0];
    
    this.selectedFile = file;
    this.p_car_imgfot = this.selectedFile.name;
    var p_car_imgext = this.p_car_imgfot.slice(((this.p_car_imgfot.lastIndexOf(".") - 1) >>> 0) + 2).toLocaleLowerCase();

    if (p_car_imgext == 'jpeg' || p_car_imgext == 'png' || p_car_imgext == 'jpg') {

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
      document.getElementById("btnmodalimagen")?.click();

    }else{
      Swal.fire('Solo se admite archivos con extensión jpeg , png o jpg', 'Vuelva a intentarlo', 'error');

      const fileInput = document.getElementById('fileimagenup') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = ''; // Esto restablecerá el valor del input file
        this.imageUrl = this.textoimagenurl;
      }
    }
  }

}


