import { Component, OnInit,TemplateRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AppComponent } from 'src/app/app.component';
import { MasterService } from 'src/app/services/master.service';
import { SanidadService } from 'src/app/services/sanidad.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FunctionsUtils } from 'src/app/utils/functions.utils';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-crear-certificado',
  templateUrl: './crear-certificado.component.html',
  styleUrls: ['./crear-certificado.component.css']
})
export class CrearCertificadoComponent implements OnInit {
  //Variables para Modal
  modalRef: any = BsModalRef;

  //Variables para Imagen
  imageChangedEvent: any = '';
  croppedImage: any = 'assets/images/avatardefault_92824.png';
  
  imageUrl: string | null = 'assets/images/avatardefault_92824.png';
  textoimagenurl: string | null = 'assets/images/avatardefault_92824.png';
  
  selectedFile: File | null = null;

  imagenseleccionada: File | null = null;
  imagenrecort: File | null = null;
  p_cer_imgfot : string = '';

  form!: FormGroup;

  p_tdi_id: Number = 1;
  p_per_numdoi: string = '';
  p_ruc: string = '';
  p_razon_social: string = '';
  datosTipoDocumento: any;
  datosOcupacion: any;
  datosRubro: any;

  //DATOS PERSONA
  per_id: Number = 0;
  pen_nombre: String = " ";
  pen_apepat: String = " ";
  pen_apemat: String = " ";
  rec_direcc: String = "";
  rec_correo: String = "";

  //DATOS FORMULARIO
  p_cer_id: string = '0';
  p_per_id: string = '';
  p_act_id: string = '';
  p_ocu_id: string = '';
  p_udi_id: string = '';
  p_emp_id: string = '';
  p_cer_direcc: string = ' ';
  p_cer_correo: string = ' ';
  p_cer_manali: boolean = true;
  confsinomanali: string = '';
  p_cer_fecemi: string = '';
  p_cer_numrec: string = '';
  p_emp_numruc: string = '';
  p_emp_nomrso: string = '';

  constructor(private appComponent: AppComponent,
    private serviceMaster: MasterService,
    private router: Router, private route: ActivatedRoute,
    private modalService: BsModalService,
    private spinner: NgxSpinnerService,
    private serviceSanidad: SanidadService, private sanitizer: DomSanitizer, private fb: FormBuilder, private utils: FunctionsUtils) {
    this.appComponent.login = false;
  }

  ngOnInit(): void {
    this.listarOcupacion();
    this.listarTipoDocumentoIdentidad();
    this.listarRubro();
    this.setForm();
    
    if (this.p_cer_manali) {
      this.confsinomanali = 'SI';
    }else{
      this.confsinomanali = 'NO';
    }
  
  }

  Changemanali(){
    console.log(this.p_cer_manali);
    if (this.p_cer_manali) {
      this.confsinomanali = 'SI';
    }else{
      this.confsinomanali = 'NO';
    }
  }

  setForm() {
    this.form = this.fb.group({
      p_cer_id: ['', [Validators.required]],
      p_per_id: ['', [Validators.required]],
      p_act_id: ['', [Validators.required]],
      p_ocu_id: ['', [Validators.required]],
      p_udi_id: ['', [Validators.required]],
      p_emp_id: ['', [Validators.required]],
      p_cer_direcc: [' ', [Validators.required]],
      p_cer_correo: [' ', [Validators.required]],
      p_cer_manali: ['', [Validators.required]],
      p_cer_fecemi: ['', [Validators.required]],
      p_cer_numrec: ['', [Validators.required]],
      p_emp_numruc: ['', [Validators.required]],
      p_emp_nomrso: ['', [Validators.required]],
    });
  }

  buscarPersonaJuridica() {
    this.spinner.show();
    let post = {
      p_per_id: 0,
      p_tdi_id: 2,
      p_per_numdoi: this.p_ruc
    };

    this.serviceMaster.ListarPersona(post).subscribe({
      next: (data: any) => {
        console.log(data);
        if (Object.keys(data).length > 0) {
          let result = data[0];
          this.p_emp_id = result['per_id'];
          this.p_razon_social = result['per_nombre'];
          this.spinner.hide();
        } else {
          this.buscarEmpresaPide()
        }
      },
      error: (error: any) => {
        console.log(error);
      }
    });
    this.spinner.hide();
  }

  buscarEmpresaPide() {
    this.spinner.show();
    let post = {
      ruc: this.p_ruc,
      usuario: 75346505,
      app: 1
    };
    this.serviceMaster.buscarEmpresaPide(post).subscribe({
      next: (data: any) => {
          console.log(data);
          if (data['datos']['list']['multiRef']['ddp_nombre'] !== "true") {
            let response = data['datos']['list']['multiRef']['ddp_nombre'];
            this.p_emp_id = '0';
            this.p_razon_social = response['$'];
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

  listarOcupacion() {
    let post = {};
    this.serviceSanidad.listarOcupacion(post).subscribe({
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
    this.serviceSanidad.listarRubro(post).subscribe({
      next: (data: any) => {
        this.datosRubro = data;
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  buscarPersona() {
    this.spinner.show();
    if(this.p_per_numdoi.length > 6) {
      let post = {
        p_tdi_id: this.p_tdi_id,
        p_per_numdoi: this.p_per_numdoi
      };

      this.serviceSanidad.listarRecurrente(post).subscribe({
        next: (data: any) => {
          console.log(data);
          if (Object.keys(data).length > 0) {
            let result = data[0];
            this.p_per_id = result['per_id'];
            this.pen_nombre = result['pen_nombre'];
            this.pen_apepat = result['pen_apepat'];
            this.pen_apemat = result['pen_apemat'];
            /* this.p_cer_direcc = result['rec_direcc'];
            this.p_cer_correo = result['rec_correo']; */
            this.spinner.hide();
          }else{
            Swal.fire('No se encontraron resultados', 'Vuelva a intentarlo', 'error');
            this.p_per_id = '';
            this.spinner.hide();
          }
        },
        error: (error: any) => {
          console.log(error);
        }
      });
    }else{
      Swal.fire('Número de documento invalido', 'Vuelva a intentarlo', 'error')
    }
    this.spinner.hide();
  }

  guardarCertificado() {
    if(this.p_per_numdoi.length < 6 || this.p_per_id == ''){
      Swal.fire('Ingresar número de documento válido', 'Vuelva a intentarlo', 'error');
    }else{
      const dataPost = new FormData();
      if (this.imagenrecort) {
        var p_cer_id = this.p_cer_id;
        var p_per_id = this.p_per_id;
        var p_act_id = this.p_act_id;
        var p_ocu_id = this.p_ocu_id;
        var p_udi_id = 1315;
        var p_emp_id = this.p_emp_id;
        var p_cer_direcc = this.p_cer_direcc;
        var p_cer_correo = this.p_cer_correo;
        var p_cer_manali = this.utils.setBooleanToInteger(this.p_cer_manali);
        var p_cer_fecemi = this.p_cer_fecemi;
        var p_cer_numrec = this.utils.convertirNumeroceroIZQ(this.p_cer_numrec, 13);
        var p_emp_numruc = this.p_ruc;
        var p_emp_nomrso = this.p_razon_social;
        var p_cer_imgfot = this.p_cer_imgfot;
        var p_cer_imgext = p_cer_imgfot.slice(((p_cer_imgfot.lastIndexOf(".") - 1) >>> 0) + 2);
        var p_tdi_id = this.p_tdi_id;
        var p_per_numdoi = this.p_per_numdoi;
  
        dataPost.append('p_cer_id',p_cer_id);
        dataPost.append('p_per_id',p_per_id);
        dataPost.append('p_act_id',p_act_id);
        dataPost.append('p_ocu_id',p_ocu_id);
        dataPost.append('p_udi_id',p_udi_id.toString());
        dataPost.append('p_emp_id',p_emp_id);
        dataPost.append('p_cer_direcc',p_cer_direcc);
        dataPost.append('p_cer_correo',p_cer_correo.toString());
        dataPost.append('p_cer_manali',p_cer_manali.toString());
        dataPost.append('p_cer_fecemi',p_cer_fecemi);
        dataPost.append('p_cer_numrec',p_cer_numrec);
        dataPost.append('p_emp_numruc',p_emp_numruc);
        dataPost.append('p_emp_nomrso',p_emp_nomrso);
        dataPost.append('p_cer_imgfot',p_cer_imgfot);
        dataPost.append('p_cer_imgfot_file[]', this.imagenrecort, this.imagenrecort.name);
        dataPost.append('p_cer_imgext',p_cer_imgext);
        dataPost.append('p_tdi_id',p_tdi_id.toString());
        dataPost.append('p_per_numdoi',p_per_numdoi.toString());
  
      } else {
        console.error('No se ha seleccionado ningún archivo.');
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
          this.serviceSanidad.guardarCertificado(dataPost).subscribe({
            next: (data: any) => {
              let result = data[0];
              if (result.hasOwnProperty('error')) {
                if (result.error === 0) {
                  Swal.fire({ title: '<h2>Confirmación</h2>', text: result.mensa, icon: 'success', confirmButtonText: 'Cerrar', confirmButtonColor: "#3085d6" }).then((result) => {
                    if (result.isConfirmed) {
                      this.router.navigate(['certificado']);
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

  }

  //FUNCIONES PARA MODAL
  openModal(template: TemplateRef<any>, clase: string) {
    this.modalRef = this.modalService.show(template, { class: clase });
  }
  
  cerrarModal() {
    this.modalRef?.hide();
  }
  
  //FUNCIONES PARA IMAGEN CROP

  imageLoaded(image: LoadedImage) {
    // show cropper
  }
  
  cropperReady() {
    // cropper ready
  }

  loadImageFailed() {
    // show message
  }

  async getObjectUrlBlob(objectUrl: string): Promise<File> {
    const response = await fetch(objectUrl);
    const blob = await response.blob();
    
    // Puedes ajustar el nombre del archivo según tus necesidades
    const fileName = this.p_cer_imgfot;

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
        const file = new File([fileBlob], this.p_cer_imgfot, { type: 'image/png' });
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

  onFileSelected(event: any): void {
    this.imageChangedEvent = event;
    const file: File = event.target.files[0];
    
    this.selectedFile = file;
    this.p_cer_imgfot = this.selectedFile.name;
    var p_cer_imgext = this.p_cer_imgfot.slice(((this.p_cer_imgfot.lastIndexOf(".") - 1) >>> 0) + 2).toLocaleLowerCase();

    if (p_cer_imgext == 'jpeg' || p_cer_imgext == 'png' || p_cer_imgext == 'jpg') {

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

  GuardarCambiosImagen() {
    this.imageUrl = this.croppedImage;
    this.cerrarModal();
  }
}
