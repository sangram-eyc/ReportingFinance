import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstcap'
})
export class FirstcapPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
   return value[0].toUpperCase() + value.substr(1).toLowerCase();
  }

}
