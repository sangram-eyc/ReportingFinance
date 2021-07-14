import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Pipe({
  name: 'million'
})
export class MillionPipe implements PipeTransform {

  constructor(private decimalPipe: DecimalPipe) {
  }

  transform(value: any, digits?: any): any {
   

  if (value === 0) {
      return 0;
  } else if ( value < 0) {
    value = value * -1;
    if (value <= 999) {
      return value * -1 ;
    } else if (value >= 1000 && value <= 999999) {
      return Math.round(value * -1 / 1000) + 'K';
    } else if (value >= 1000000 && value <= 999999999) {
      return this.decimalPipe.transform(value * -1 / 1000000, digits) + 'M';
    } else if (value >= 1000000000 && value <= 999999999999) {
      return  this.decimalPipe.transform(value * -1 / 1000000000, digits) + 'B';
    } else {
      return value ;
    }
  } else  {
        if (value <= 999) {
          return value ;
        } else if (value >= 1000 && value <= 999999) {
          return Math.round(value / 1000) + 'K';
        } else if (value >= 1000000 && value <= 999999999) {
          return this.decimalPipe.transform(value / 1000000, digits) + 'M';
        } else if (value >= 1000000000 && value <= 999999999999) {
          return  this.decimalPipe.transform(value / 1000000000, digits) + 'B';
        } else {
          return value ;
        }
  }
}

}
