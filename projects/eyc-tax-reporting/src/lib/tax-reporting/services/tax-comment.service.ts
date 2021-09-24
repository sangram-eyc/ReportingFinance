import { EventEmitter, Injectable, Output } from '@angular/core';
import {EycTaxSettingsService} from '../../services/eyc-tax-settings.service';
import {EycApiService} from '../../services/eyc-tax-api.service';

@Injectable({
  providedIn: 'root'
})
export class TaxCommentService {

  constructor(private apiService: EycApiService,private settingsService: EycTaxSettingsService) { }
  
  addComment(data) {
    if (this.settingsService.production) {
      //when the api is ready
      //return this.apiService.invokePostAPI(`${this.settingsService.taxReporting.add_comment}`, data);
      return this.apiService.invokeGetAPI(`${this.settingsService.taxReporting.add_comment}`);
    } 
    else{
      return this.apiService.invokeGetAPI(`${this.settingsService.taxReporting.add_comment}`);
    }   
  }

  uploadFile(data) { 
    if (this.settingsService.production) {
      //when the api is ready
      //return this.apiService.invokePostAPI(`${this.settingsService.taxReporting.upload}`, data);
      return this.apiService.invokeGetAPI(`${this.settingsService.taxReporting.add_comment}`);
    } 
    else{
      return this.apiService.invokeGetAPI(`${this.settingsService.taxReporting.add_comment}`);
    }     
  }

  getCommentsData(id){
    if (this.settingsService.production) {
      return this.apiService.invokeGetAPI(`${this.settingsService.taxReporting.comments_list}/funds/${id}/tasks`);
    } 
    else{
      return this.apiService.invokeGetAPI(`${this.settingsService.taxReporting.comments_list}`);
    }  
  }

}
