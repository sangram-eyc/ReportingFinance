import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateEllipsis'
})
export class TruncateEllipsisPipe implements PipeTransform {

  transform(value: any, mode = 'normal', limit = 25) {
		switch (mode) {
			case 'middle':
				if (value && value.length >= 15) {
					return value.substr(0, 6).concat('...').concat(value.slice(-5));
				} else {
					return value;
				}
			case 'normal':
				if (value && value.length >= limit) {
					limit = value.substr(0, 13).lastIndexOf(' ');
					return `${value.substr(0, limit)}${'...'}`;
				} else {
					return value;
				}
			case 'normalLong':
				if (value && value.length >= limit) {
					limit = value.substr(0, limit).lastIndexOf(' ');
					return `${value.substr(0, limit)}${'...'}`;
				} else {
					return value;
				}
		}
	}

}
