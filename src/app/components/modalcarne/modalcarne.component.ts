import { Component, OnInit, ViewChild, ElementRef , TemplateRef,EventEmitter,Input,Output } from '@angular/core';

@Component({
  selector: 'app-modalcarne',
  templateUrl: './modalcarne.component.html',
  styleUrls: ['./modalcarne.component.css']
})

export class ModalcarneComponent implements OnInit {
  
  //IMPLEMENTACIÓN DE VARIABLES ENTRADAS - SALIDAS

  @ViewChild('contenidoDiv', { static: false }) contenidoDiv!: ElementRef;

  @Input() inputPersona : any;;
  @Output() confirmClicked: EventEmitter<void> = new EventEmitter<void>();
  @Output() cancelClicked: EventEmitter<void> = new EventEmitter<void>();

  

  constructor() { }

  ngOnInit(): void {
    console.log(this.inputPersona);
  }

  convertirAPDF() {
    const contenidoDiv = this.contenidoDiv.nativeElement.innerHTML;
    const ventanaImpresion = window.open('', '', 'width=1024 ,height=640');
    ventanaImpresion?.document.write('<html><head><title>Imprimir</title></head><body>');
    ventanaImpresion?.document.write(contenidoDiv);
    ventanaImpresion?.document.write('</body></html>');
    ventanaImpresion?.document.close();
    setTimeout(() => {
      ventanaImpresion?.print();
    }, 2000);

    /* const content: HTMLDivElement | null = this.contenidoDiv.nativeElement;
 
    if (content) {
       // Esperar a que todas las imágenes se carguen
       Promise.all(Array.from(content.querySelectorAll('img')).map(img => img.complete)).then(() => {
          const ventanaImpresion = window.open('', '');
          ventanaImpresion?.document.write(content.innerHTML);
          ventanaImpresion?.document.close();
 
          // Comprobación de nulabilidad antes de intentar asignar a onafterprint
          if (ventanaImpresion?.onafterprint) {
            ventanaImpresion.onafterprint = () => {
              ventanaImpresion?.close();
            };
          } else {
            console.error('La propiedad onafterprint no está definida en la ventana de impresión.');
          }

          ventanaImpresion?.print();
       });
    } else {
       console.error('No se encontró el elemento con el ID "contenido-a-convertir".');
    } */
 }
}
