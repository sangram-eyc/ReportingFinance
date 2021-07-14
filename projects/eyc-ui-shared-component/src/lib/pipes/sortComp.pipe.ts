import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortComp'
})
export class SortCompPipe implements PipeTransform {

  transform(array: Array<string>): Array<string> {
        
    array.sort((a: any, b: any) => {
        if (a.ComponentType.toString().toLowerCase() < b.ComponentType.toString().toLowerCase()) {
            return -1;
        } else if (a.ComponentType.toString().toLowerCase() > b.ComponentType.toString().toLowerCase()) {
            return 1;
        } else {
            return 0;
        }
    });
    return array;
  }

}
