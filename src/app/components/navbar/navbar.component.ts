import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { SigtaService } from 'src/app/services/sigta.service';
import { AppComponent } from 'src/app/app.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
// import { AdministracionService } from 'src/app/services/administracion.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  modalRefs: { [key: string]: BsModalRef } = {}; // Objeto para almacenar los modalRefs

  dataUsuario: any;
  dataUser: any

  p_usu_apepat: string = ''
  p_usu_apemat: string = ''
  p_usu_nombre: string = ''
  p_usu_loging: string = ''

  usu_nomcom: string = '';
  cusuari: string = '';
  // p_usu_activo: string = ''
  error: string = '';

  layoutModeIcon: string = 'sun';
  dataEmpresas: any = [];

  //CAMBIAR PASS
  p_usu_id: number;
  p_usu_passwd: string;
  p_usu_pasnew: string;
  p_usu_pasval: string;

  constructor(
    private router: Router,
    // public appComponent:AppComponent
    private sigtaService: SigtaService,
    private modalService: BsModalService
  ) {
    // this.dataUsuario = localStorage.getItem('dataUsuario');
    const storedData = localStorage.getItem("dataUsuario");
    if (storedData !== null) {
      this.dataUsuario = JSON.parse(storedData);
    }
  }

  ngOnInit() {
    this.listarUsuario();
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

  private getIconByErrorCode(errorCode: number): 'error' | 'warning' | 'info' | 'success' {
    if (errorCode < 0 || errorCode === 999) {
      return 'error';
    }
    if (errorCode === 0) {
      return 'success';
    }
    // Puedes agregar más condiciones aquí para otros códigos de error y sus iconos correspondientes
    return 'info'; // Valor por defecto si no se cumple ninguna condición
  }

  // private getIconByErrorCode(errorCode: number): 'error' | 'warning' | 'info' | 'success' {
  //   switch (errorCode) {
  //     case -101:
  //       return 'error';
  //     case -102:
  //       return 'error';
  //     case -103:
  //       return 'error';
  //     case -104:
  //       return 'error';
  //     case -105:
  //       return 'error';
  //     case -107:
  //       return 'error';
  //     case 999:
  //       return 'error';
  //     case 0:
  //       return 'success';
  //     default:
  //       return 'error';
  //   }
  // }

  goBackToMultas() {
    setTimeout(() => {
      switch (this.error) {
        case 'Clave Actualizada Correctamente':
          this.modalService.hide(7)
          this.logOut()
          break;
        default:
          break;
      }
    });
  }

  changeLayoutMode(mode: string) {
    let htmlSelector = document.getElementsByTagName('html')[0];
    let tableSelector = document.querySelectorAll('thead, tfoot');

    if (mode == 'light') {
      htmlSelector.setAttribute('data-topbar', 'light');
      htmlSelector.setAttribute('data-sidebar', 'light');
      htmlSelector.setAttribute('data-bs-theme', 'light');

      tableSelector.forEach(element => {
        element.classList.remove('table-dark');
        element.classList.add('table-light');
      });

      this.layoutModeIcon = 'sun';
    } else {
      htmlSelector.setAttribute('data-topbar', 'dark');
      htmlSelector.setAttribute('data-sidebar', 'dark');
      htmlSelector.setAttribute('data-bs-theme', 'dark');

      tableSelector.forEach(element => {
        element.classList.remove('table-light');
        element.classList.add('table-dark');
      });

      this.layoutModeIcon = 'moon';
    }
  }


  listarUsuario() {
    let post = {
      p_usu_id: this.dataUsuario.numid,
      p_usu_activo: 1,
    };

    this.sigtaService.listarUsuario(post).subscribe({
      next: (data: any) => {
        this.dataUser = data;
        this.usu_nomcom = data[0].usu_nomcom
        this.cusuari = data[0].usu_loging;
        this.p_usu_id = data[0].usu_id;
        this.sigtaService.cusuari = this.cusuari;
      }
    });
  }

  cambiarPass() {
    let post = {
      p_usu_id: this.p_usu_id,
      p_usu_passwd: this.p_usu_passwd,
      p_usu_pasnew: this.p_usu_pasnew,
      p_usu_pasval: this.p_usu_pasval,
    };

    this.sigtaService.cambiarPass(post).subscribe({
      next: (data: any) => {
        console.log(data);

        this.error = data[0].mensa;
        const errorCode = data[0].error;
        console.log(this.error);

        // Selecciona el icono según el código de error
        const icon = this.getIconByErrorCode(errorCode);

        // Muestra el SweetAlert con el icono y el mensaje de error
        this.errorSweetAlert(icon, this.goBackToMultas.bind(this));

      }
    });
  }

  modalPass(template: TemplateRef<any>) {
    // this.idcorrl = data.id_corrl;

    this.modalRefs['modalCambiarPass'] = this.modalService.show(template, { id: 7, class: '', backdrop: 'static', keyboard: false });
    // this.sigtaService.idcorrl = this.idcorrl;
  }

  cerrarModal(modalKey: string) {
    if (this.modalRefs[modalKey]) {
      this.modalRefs[modalKey].hide(); // Cierra el modal si está definido
    }
  }

  togglePasswordActual() {
    let passwordInput = document.getElementById('password-input') as HTMLInputElement;
    let passwordIcon = document.getElementById('passwordEye') as HTMLSpanElement;

    if (passwordIcon.classList.contains('ri-eye-fill')) {
      passwordInput.type = 'text';
      passwordIcon.classList.remove('ri-eye-fill');
      passwordIcon.classList.add('ri-eye-off-fill');
    } else {
      passwordInput.type = 'password';
      passwordIcon.classList.remove('ri-eye-off-fill');
      passwordIcon.classList.add('ri-eye-fill');
    }
  }
  togglePasswordNew() {
    let passwordInput = document.getElementById('password-input-new') as HTMLInputElement;
    let passwordIcon = document.getElementById('passwordEye-new') as HTMLSpanElement;

    if (passwordIcon.classList.contains('ri-eye-fill')) {
      passwordInput.type = 'text';
      passwordIcon.classList.remove('ri-eye-fill');
      passwordIcon.classList.add('ri-eye-off-fill');
    } else {
      passwordInput.type = 'password';
      passwordIcon.classList.remove('ri-eye-off-fill');
      passwordIcon.classList.add('ri-eye-fill');
    }
  }

  togglePasswordConfirm() {
    let passwordInput = document.getElementById('password-input-confirm') as HTMLInputElement;
    let passwordIcon = document.getElementById('passwordEye-confirm') as HTMLSpanElement;

    if (passwordIcon.classList.contains('ri-eye-fill')) {
      passwordInput.type = 'text';
      passwordIcon.classList.remove('ri-eye-fill');
      passwordIcon.classList.add('ri-eye-off-fill');
    } else {
      passwordInput.type = 'password';
      passwordIcon.classList.remove('ri-eye-off-fill');
      passwordIcon.classList.add('ri-eye-fill');
    }
  }

  setDefaultCompany(id: number) {

  }

  logOut() {
    localStorage.clear()
    this.router.navigateByUrl('/login')

    // this.dataUsuario.removeItem('dataUsuario')
  }

}
