import { Injectable,Inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EycRrSettingsService {

  constructor(@Inject('apiEndpoint') private apiEndpoint) { }
  public API_ENDPOINT = this.apiEndpoint.slice(-1) === "." ?
   this.apiEndpoint.substr(0,  this.apiEndpoint.length - 1) :this.apiEndpoint;
}
