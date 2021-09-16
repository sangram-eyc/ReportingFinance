import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdministrationService {

  module;

  constructor() { }

  set setCurrentModule(data) {
    this.module = data;
  }

  get getCurrentModule() {
    return this.module;
  }
}
