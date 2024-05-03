import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SigtaService } from 'src/app/services/sigta.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  @ViewChildren('listElement') listElements!: QueryList<ElementRef>;

  dataUsuario: any;
  datosMenu: any[] = [];
  collapsedMenus: Set<string> = new Set<string>();

  id_enlace: string = '';
  enlace: string = '';

  constructor(
    private router: Router,
    private sigtaService: SigtaService
  ) {
    const storedData = localStorage.getItem("dataUsuario");
    if (storedData !== null) {
      this.dataUsuario = JSON.parse(storedData);
    }
    console.log(this.dataUsuario);
  }

  ngOnInit(): void {
    this.listarMenu();
  }

  activeChange(event: MouseEvent) {
    // Obtener todos los elementos con la clase "nav-link"
    const links = document.querySelectorAll('.nav-link');

    // Eliminar la clase "active" de todos los enlaces
    links.forEach(link => {
      link.classList.remove('active');
    });

    // Añadir la clase "active" al enlace que se ha hecho clic
    const target = event.target as HTMLElement;
    target.classList.add('active');
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

  getRoute(data:any) {
    this.id_enlace = data.obj_id;
    this.enlace = data.obj_enlace;
    console.log("id:", this.id_enlace);
    console.log("enlace:", this.enlace);
    this.router.navigate([this.enlace]);
  }

  listarMenu() {

    let post = {
      p_usu_id: this.dataUsuario.numid,
      p_apl_id: 10
    };
    console.log(post);

    this.sigtaService.listarMenu(post).subscribe({
      next: (data: any) => {
        
        this.datosMenu = data;
        console.log(this.datosMenu);
        // this.id_enlace = data[0].obj_id;
        // this.enlace = data[0].obj_enlace;

      },
      error: (error: any) => {
      },
    });

  }


}
