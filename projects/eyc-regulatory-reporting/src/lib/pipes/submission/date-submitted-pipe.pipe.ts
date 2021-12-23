import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateSubmittedPipe'
})
export class DateSubmittedPipePipe implements PipeTransform {

  transform(value) {
    let inputStr = value.trim();
    let resultString = inputStr.replace('AM','am').replace('PM','pm');
    return resultString
  }

}
