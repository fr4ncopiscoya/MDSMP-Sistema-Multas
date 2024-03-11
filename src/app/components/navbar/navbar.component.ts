import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
// import { AdministracionService } from 'src/app/services/administracion.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  dataUsuario: any;

  layoutModeIcon: string = 'sun';
  dataEmpresas: any = [];

  constructor(
    private router: Router,
    // public appComponent:AppComponent
  ) { }

  ngOnInit(){
    // console.log(this.appComponent.dataUsuario.nomusu);
    const storedData = localStorage.getItem("dataUsuario");
    if (storedData !== null) {
      this.dataUsuario = JSON.parse(storedData);
    }
    
  }

  changeLayoutMode(mode: string){
    let htmlSelector = document.getElementsByTagName('html')[0];
    let tableSelector = document.querySelectorAll('thead, tfoot');

    if(mode == 'light'){
      htmlSelector.setAttribute('data-topbar', 'light');
      htmlSelector.setAttribute('data-sidebar', 'light');
      htmlSelector.setAttribute('data-bs-theme', 'light');

      tableSelector.forEach(element => {
        element.classList.remove('table-dark');
        element.classList.add('table-light');
      });

      this.layoutModeIcon = 'sun';
    }else{
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

  // companyList(){
  //   this.dataEmpresas = [];

  //   let data = {
  //     p_com_id: 0
  //   }

  //   this.administracionService.postGetCompanyList(data).subscribe({
  //     next: (result: any) => {
  //       console.log(result);
  //       this.dataEmpresas = result;
  //     },
  //     error: (error: any) => {
  //       console.error(error);
  //     }
  //   });
  // }

  setDefaultCompany(id: number){

  }

  logOut(){
    localStorage.removeItem('session-dashboard')
    // console.log("session closed");
    this.router.navigateByUrl('/login')
  }

}
