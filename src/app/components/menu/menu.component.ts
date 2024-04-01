import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  @ViewChildren('listElement') listElements!: QueryList<ElementRef>;

  constructor() { }

  ngOnInit(): void {
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


}
