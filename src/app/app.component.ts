import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  login: boolean = true;
  dataUsuario: any;
  botonesPermisos: any;

  // @HostListener('window:beforeunload', ['$event'])
  // clearLocalStorage(event: Event) {
  //  localStorage.clear()
  // }

  //BOTONES
  // btnNuevo: number;
  // btnVer: number;
  // btnEditar: number;
  // btnAnular: number;
  // btnPdf: number;
  // btnExcel: number;

  constructor() {
  }

  ngOnInit() {
  }
}
