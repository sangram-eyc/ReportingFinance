import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CustomGlobalService {

  constructor() { }

  checkSpcialChar(event){
      if(!((event.keyCode >= 65) && (event.keyCode <= 90) || (event.keyCode >= 97) && (event.keyCode <= 122) || (event.keyCode >= 48) && (event.keyCode <= 57))){
          event.returnValue = false;
          return;
      }
      event.returnValue = true;
  }
}
