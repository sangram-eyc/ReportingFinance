import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CustomGlobalService {

  constructor() { }

  checkSpcialChar(event) {
    if (!((event.keyCode >= 65) && (event.keyCode <= 90) || (event.keyCode >= 97) && (event.keyCode <= 122) || (event.keyCode >= 48) && (event.keyCode <= 57))) {
      event.returnValue = false;
      return;
    }
    event.returnValue = true;
  }

  sortFilings(array) {
    return array.sort((a, b) => {
      let date1 = new Date(a.dueDate)
      let date2 = new Date(b.dueDate)
      if (date1 > date2) {
        return 1;
      } else if (date1 < date2) {
        return -1;
      } else {
        let filing1 = a.filingName.toLowerCase();
        let filing2 = b.filingName.toLowerCase();
        if (filing1 > filing2) {
          return 1;
        } else if (filing1 < filing2) {
          return -1;
        } else {
          return 0;
        }
      }
    });
  }
}
