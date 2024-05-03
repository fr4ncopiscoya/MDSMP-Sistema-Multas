import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SigtaService } from 'src/app/services/sigta.service';
import { AppComponent } from 'src/app/app.component';
// import { AdministracionService } from 'src/app/services/administracion.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  dataUsuario: any;
  dataUser:any

  p_usu_apepat: string = ''
  p_usu_apemat: string = ''
  p_usu_nombre: string = ''
  p_usu_loging: string = ''

  usu_nomcom: string = '';
  // p_usu_activo: string = ''

  layoutModeIcon: string = 'sun';
  dataEmpresas: any = [];

  constructor(
    private router: Router,
    // public appComponent:AppComponent
    private sigtaService: SigtaService
  ) {
    // this.dataUsuario = localStorage.getItem('dataUsuario');
    const storedData = localStorage.getItem("dataUsuario");
    if (storedData !== null) {
      this.dataUsuario = JSON.parse(storedData);
    }
    console.log(this.dataUsuario);
  }

  ngOnInit() {
    this.listarUsuario();
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
      p_usu_apepat: this.p_usu_apepat,
      p_usu_apemat: this.p_usu_apemat,
      p_usu_nombre: this.p_usu_nombre,
      p_usu_loging: this.p_usu_loging,
      p_usu_activo: 1,
    };

    this.sigtaService.listarUsuario(post).subscribe({
      next: (data: any) => {

        // localStorage.setItem("dataUsuario", JSON.stringify(data[0]));

        // console.log(this.dataUsuario);
        this.dataUser = data;
        this.usu_nomcom = data[0].usu_nomcom
        // this.usu_nomcom = data[0].desare;
        console.log(this.usu_nomcom);

        // this.dataUsuario = data[0];
      }
    });
  }


  setDefaultCompany(id: number) {

  }

  logOut() {
    localStorage.removeItem('session-dashboard')
    localStorage.removeItem('dataUsuario')
    // console.log("session closed");
    this.router.navigateByUrl('/login')

    // this.dataUsuario.removeItem('dataUsuario')
  }

}
