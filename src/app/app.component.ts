import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  login: boolean = true;
  dataUsuario: any;
  botonesPermisos: any;

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
