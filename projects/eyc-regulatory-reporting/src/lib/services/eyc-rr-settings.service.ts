import { Injectable,Inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EycRrSettingsService {

  constructor(@Inject('apiEndpoint') private apiEndpoint) { }
  public API_ENDPOINT = this.apiEndpoint;
}
