import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[libRemoveSpaces]'
})
export class RemoveSpacesDirective {

  timeout: any;
  constructor(private eleRef: ElementRef) {
  }

  @HostListener('input') keyup(){
    clearTimeout(this.timeout);
    let string = this.eleRef.nativeElement.value
    this.timeout = setTimeout(()=>{
      this.eleRef.nativeElement.value = string.trim();
    },1000)
  }

  @HostListener('blur') focusout(){
    let string = this.eleRef.nativeElement.value
    this.eleRef.nativeElement.value = string.trim();
  }
}
