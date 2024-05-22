import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import Cleave from 'cleave.js';

@Directive({
  selector: '[appCleave]'
})
export class CleaveDirective implements OnInit {
  @Input('appCleave') cleaveOptions: any;

  constructor(private el: ElementRef) { }

  ngOnInit() {
    new Cleave(this.el.nativeElement, this.cleaveOptions);
  }
}
