import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[libRemoveSpaces]'
})
export class RemoveSpacesDirective {
  timeout: any;

  constructor(private eleRef: ElementRef) {}
   
  @HostListener('input',['$event']) keyup(event){
    clearTimeout(this.timeout);
    let string = this.eleRef.nativeElement.value
    this.timeout = setTimeout(()=>{
      this.eleRef.nativeElement.value = string.trim();
    },1000)
  }

  @HostListener('blur') focusout(event){
    let string = this.eleRef.nativeElement.value
    this.eleRef.nativeElement.value = string.trim();
  }
}