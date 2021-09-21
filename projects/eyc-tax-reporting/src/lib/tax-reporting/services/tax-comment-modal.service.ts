import { EventEmitter, Injectable, Output } from '@angular/core';
import {EycTaxSettingsService} from '../../services/eyc-tax-settings.service';
import {EycApiService} from '../../services/eyc-tax-api.service';

@Injectable({
  providedIn: 'root'
})
export class TaxCommentModalService {

  constructor(private apiService: EycApiService,private settingsService: EycTaxSettingsService) { }
  
  addComment(data) {
    if (this.settingsService.production) {
      return this.apiService.invokePostAPI(`${this.settingsService.taxReporting.add_comment}`, data);
    } 
    else{
      return this.apiService.invokeGetAPI(`${this.settingsService.taxReporting.add_comment}`);
    }   
  }

  uploadFile(data) { 
    if (this.settingsService.production) {
      return this.apiService.invokePostAPI(`${this.settingsService.taxReporting.upload}`, data);
    } 
    else{
      return this.apiService.invokeGetAPI(`${this.settingsService.taxReporting.add_comment}`);
    }     
  }
}
