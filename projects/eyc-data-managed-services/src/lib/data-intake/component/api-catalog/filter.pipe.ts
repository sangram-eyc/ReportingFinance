import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(items: any[], searchKey: string): any[] {
    if(!items || !items.length) return items;
    if(!searchKey || !searchKey.length) return items;
    return items.filter(item => item.DOMAIN_NAME.toString().toLowerCase().includes(searchKey.toLowerCase()))
  }

}
