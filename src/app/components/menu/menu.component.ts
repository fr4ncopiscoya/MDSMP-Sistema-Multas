import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { SigtaService } from 'src/app/services/sigta.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  @ViewChildren('listElement') listElements!: QueryList<ElementRef>;

  dataUsuario: any;
  databotones: any;
  datosMenu: any[] = [];
  collapsedMenus: Set<string> = new Set<string>();

  id_enlace: string = '';
  enlace: string = '';
  cusuari: string = '';

  obj_id: string = '';
  apb_activo: any;
  bot_id: string = ''
  activeMenuId: any | null = null;
  activeMenuColor: any

  //BOTONES
  btnNuevo: number;
  btnVer: number;
  btnEditar: number;
  btnAnular: number;
  btnPdf: number;
  btnExcel: number;

  constructor(
    private router: Router,
    private sigtaService: SigtaService,
    private appComponent: AppComponent
  ) {
    const storedData = localStorage.getItem("dataUsuario");
    if (storedData !== null) {
      this.dataUsuario = JSON.parse(storedData);
    }
  }

  ngOnInit(): void {
    this.listarMenu();
    const storedActiveMenuId = localStorage.getItem('activeMenuId');
    if (storedActiveMenuId) {
      this.activeMenuId = storedActiveMenuId;
    }

    const storedActiveMenuColor = localStorage.getItem('activeMenuColor');
    if (storedActiveMenuColor) {
      this.activeMenuColor = storedActiveMenuColor;
    }
  }

  toggleCollapse(id: string) {
    if (this.collapsedMenus.has(id)) {
      this.collapsedMenus.delete(id);
    } else {
      this.collapsedMenus.add(id);
    }
  }

  isCollapsed(id: string): boolean {
    return !this.collapsedMenus.has(id);
  }

  listarMenu() {

    let post = {
      p_usu_id: this.dataUsuario.numid,
      p_apl_id: 10,
      p_obp_id: 0,
    };

    this.sigtaService.listarMenu(post).subscribe({
      next: (data: any) => {

        this.datosMenu = data;
      },
      error: (error: any) => {
      },
    });
  }

  getMenuID(id: any, enlace: any) {
    this.obj_id = id;
    this.enlace = enlace;

    this.permisoBotones(id);
    this.activeMenuId = this.obj_id
  }

  permisoBotones(obj_id: number) {
    let post = {
      p_usu_id: this.dataUsuario.numid,
      p_apl_id: 10,
      p_obj_id: obj_id,
    };

    this.sigtaService.permisoBotones(post).subscribe({
      next: (data: any) => {
        this.databotones = data;
        this.appComponent.botonesPermisos = data;
        localStorage.setItem('menu-items', JSON.stringify(data))
        // this.validacionBotones();
        this.router.navigateByUrl(this.enlace)
      }
    });
  }

  // validacionBotones() {
  //   this.btnNuevo = 0,
  //   this.btnVer = 0,
  //   this.btnEditar = 0,
  //   this.btnAnular = 0,
  //   this.btnPdf = 0,
  //   this.btnExcel = 0,

  //   this.appComponent.botonesPermisos.forEach((item: any) => {
  //     switch (item.bot_id) {
  //       case 1:
  //         // this.btnNuevo = item.apb_activo
  //         this.appComponent.btnNuevo = item.apb_activo
  //         console.log("btnNuevo: ", this.appComponent.btnNuevo);
  //         break;
  //       case 2:
  //         // this.btnEditar = item.apb_activo
  //         this.appComponent.btnEditar = item.apb_activo
  //         console.log("btnEditar: ", this.appComponent.btnEditar);
  //         break;
  //       case 3:
  //         // this.btnVer = item.apb_activo
  //         this.appComponent.btnVer = item.apb_activo
  //         console.log("btnVer: ", this.appComponent.btnVer);
  //         break;
  //       case 4:
  //         // this.btnAnular = item.apb_activo;
  //         this.appComponent.btnAnular = item.apb_activo
  //         console.log("btnAnular: ", this.btnAnular);
  //         break;
  //       case 5:
  //         // this.btnExcel = item.apb_activo;
  //         this.appComponent.btnExcel = item.apb_activo
  //         console.log("btnExcel: ", this.appComponent.btnExcel);
  //         break;
  //       case 10:
  //         // this.btnPdf = item.apb_activo;
  //         this.appComponent.btnPdf = item.apb_activo
  //         console.log("btnPdf: ", this.appComponent.btnPdf);
  //         break;
  //       default:
  //         break;
  //     }
  //   })
  // }

}
