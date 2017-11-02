import { Directive, ElementRef, Input, OnInit, Renderer } from '@angular/core';
@Directive({
  selector: '[PaletteKey]'
})
export class BPaletteKeyDirective implements OnInit {
  @Input() PaletteKey: string;
  constructor(private el: ElementRef, private render: Renderer) { }
  ngOnInit() {
    this.render.setElementAttribute(this.el.nativeElement, 'b-palette-key', this.PaletteKey)
  }
}
