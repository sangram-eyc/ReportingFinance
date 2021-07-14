import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'limitTo'
})
export class TruncatePipe implements PipeTransform {

  transform(value: string, args: string) : string {
    let limit = args ? parseInt(args, 3) : 3;
    let trail = '...';

    return value.length > limit ? value.substring(0, limit) + trail : value;
  }

}
