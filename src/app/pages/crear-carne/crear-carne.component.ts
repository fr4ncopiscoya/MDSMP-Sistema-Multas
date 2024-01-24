import { Component, TemplateRef , OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AppComponent } from 'src/app/app.component';
import { MasterService } from 'src/app/services/master.service';
import { SanidadService } from 'src/app/services/sanidad.service';
import Swal from 'sweetalert2';
import { ImageCroppedEvent, LoadedImage} from 'ngx-image-cropper';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FunctionsUtils } from 'src/app/utils/functions.utils';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-crear-carne',
  templateUrl: './crear-carne.component.html',
  styleUrls: ['./crear-carne.component.css']
})
export class CrearCarneComponent implements OnInit {

  //Variables para Modal
  modalRef: any = BsModalRef;

  //Variables para Imagen
  imageUrl: string | null = 'assets/images/avatardefault_92824.png';
  selectedFile: File | null = null;
  p_car_imgfot : string = '';

  imagenseleccionada: File | null = null;
  imagenrecort: File | null = null;
  //Fin variables para Imagen

  form!: FormGroup;

  p_tdi_id: Number = 1;
  p_per_numdoi: String = "";
  datosTipoDocumento: any;
  datosOcupacion: any;
  datosRubro: any;

  //DATOS PERSONA
  per_id: Number = 0;
  pen_nombre: String = "";
  pen_apepat: String = "";
  pen_apemat: String = "";
  rec_direcc: String = "";
  rec_correo: String = "";

  //DATOS FORMULARIO
  p_car_id: string = '';
  p_per_id: string = '';
  p_act_id: string = '';
  p_ocu_id: string = '';
  p_udi_id: string = '';
  p_car_direcc: string = ' ';
  p_car_correo: string = ' ';
  p_car_manali: boolean = true;
  confsinomanali: string = '';
  p_car_fecemi: string = '';
  p_car_numrec: string = '';

  showImageColumn: boolean = false;
  firstcolumn: string = '4';
  secondcolumn: string = '12';

  imageChangedEvent: any = '';
  croppedImage: any = 'assets/images/avatardefault_92824.png';

  textoimagenurl: any = 'assets/images/avatardefault_92824.png';

  constructor(private appComponent: AppComponent,
    private serviceMaster: MasterService,
    private router: Router,
    private modalService: BsModalService,
    private serviceSanidad: SanidadService, private sanitizer: DomSanitizer, private fb: FormBuilder, private utils: FunctionsUtils) {
    this.appComponent.login = false;
  }

  ngOnInit() {
    this.listarTipoDocumentoIdentidad();
    this.listarOcupacion();
    this.listarRubro();
  }

  Changemanali(){
    console.log(this.p_car_manali);
    if (this.p_car_manali) {
      this.confsinomanali = 'SI';
    }else{
      this.confsinomanali = 'NO';
    }
  }

  setForm() {
    this.form = this.fb.group({

      p_tdi_id: ['', [Validators.required]],
      p_per_numdoi: ['', [Validators.required]],
      pen_nombre: ['', [Validators.required]],
      pen_apepat: ['', [Validators.required]],
      pen_apemat: ['', [Validators.required]],
      p_car_id: ['', [Validators.required]],
      p_per_id: ['', [Validators.required]],
      p_act_id: ['', [Validators.required]],
      p_ocu_id: ['', [Validators.required]],
      p_udi_id: ['', [Validators.required]],
      rec_direcc: ['', [Validators.required]],
      rec_correo: ['', [Validators.required]],
      p_car_manali: ['', [Validators.required]],
      p_car_fecemi: ['', [Validators.required]],
      p_car_numrec: ['', [Validators.required]],
    });
  }

  openModal(template: TemplateRef<any>, clase: string) {
    this.modalRef = this.modalService.show(template, { class: clase });
  }
  
  cerrarModal() {
    this.modalRef?.hide();
  }
  
  GuardarCambiosImagen() {
    this.imageUrl = this.croppedImage;
    this.cerrarModal();
  }

  guardarCarne() {
    if(this.p_per_numdoi.length < 6 || this.p_per_id == ''){
      Swal.fire('Ingresar número de documento válido', 'Vuelva a intentarlo', 'error');
    }else{
      const dataPost = new FormData();
      if (this.imagenrecort) {
  
        var p_car_id = '0';
        var p_per_id = this.p_per_id;
        var p_act_id = this.p_act_id;
        var p_ocu_id = this.p_ocu_id;
        var p_udi_id = '1315';
        var p_car_direcc = this.p_car_direcc;
        var p_car_correo = this.p_car_correo;
        var p_car_manali = this.utils.setBooleanToInteger(this.p_car_manali);
        var p_car_fecemi = this.p_car_fecemi;
        var p_car_numrec = this.utils.convertirNumeroceroIZQ(this.p_car_numrec, 13);
        var p_car_imgfot = this.p_car_imgfot;
        var p_car_imgext = p_car_imgfot.slice(((p_car_imgfot.lastIndexOf(".") - 1) >>> 0) + 2);
        var p_tdi_id = this.p_tdi_id;
        var p_per_numdoi = this.p_per_numdoi;
  
        dataPost.append('p_car_id',p_car_id);
        dataPost.append('p_per_id',p_per_id);
        dataPost.append('p_act_id',p_act_id);
        dataPost.append('p_ocu_id',p_ocu_id);
        dataPost.append('p_udi_id',p_udi_id);
        dataPost.append('p_car_direcc',p_car_direcc);
        dataPost.append('p_car_correo',p_car_correo);
        dataPost.append('p_car_manali',p_car_manali.toString());
        dataPost.append('p_car_fecemi',p_car_fecemi);
        dataPost.append('p_car_numrec',p_car_numrec);
        dataPost.append('p_car_imgfot',p_car_imgfot);
        dataPost.append('p_car_imgfot_file[]', this.imagenrecort, this.imagenrecort.name);
        dataPost.append('p_car_imgext',p_car_imgext);
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
          this.serviceSanidad.guardarCarne(dataPost).subscribe({
            next: (data: any) => {
              let result = data[0];
              if (result.hasOwnProperty('error')) {
                if (result.error === 0) {
                  Swal.fire({ title: '<h2>Confirmación</h2>', text: result.mensa, icon: 'success', confirmButtonText: 'Cerrar', confirmButtonColor: "#3085d6" }).then((result) => {
                    if (result.isConfirmed) {
                      this.router.navigate(['carne']);
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
    console.log(this.p_per_numdoi.length);
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

            this.showImageColumn = true;
            this.firstcolumn = '4';
            this.secondcolumn = '8';
            /* this.p_car_direcc = result['rec_direcc'];
            this.p_car_correo = result['rec_correo']; */
          }else{
            Swal.fire('No se encontraron resultados', 'Vuelva a intentarlo', 'error');
            this.p_per_id = '';

            this.showImageColumn = false;
            this.firstcolumn = '4';
            this.secondcolumn = '12';
          }
        },
        error: (error: any) => {
          console.log(error);
        }
      }); 
    }else{
      Swal.fire('Número de documento invalido', 'Vuelva a intentarlo', 'error')
      this.showImageColumn = false;
      this.firstcolumn = '4';
      this.secondcolumn = '12';
    }
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
