import { EventEmitter, Injectable, Output } from '@angular/core';
import {EycTaxSettingsService} from '../../services/eyc-tax-settings.service';
import {EycApiService} from '../../services/eyc-tax-api.service';

@Injectable({
  providedIn: 'root'
})
export class TaxCommentService {

  constructor(private apiService: EycApiService,private settingsService: EycTaxSettingsService) { }
  
  addTask(data, entityId) {
    if (this.settingsService.production) {
      return this.apiService.invokePostAPI(`${this.settingsService.taxReporting.add_task}/funds/${entityId}/tasks`, data);
    } 
    else{
      return this.apiService.invokeGetAPI(`${this.settingsService.taxReporting.add_task}`);
    }   
  }

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
      //when the api is ready
      //return this.apiService.invokePostAPI(`${this.settingsService.taxReporting.upload}`, data);
      return this.apiService.invokeGetAPI(`${this.settingsService.taxReporting.add_comment}`);
    } 
    else{
      return this.apiService.invokeGetAPI(`${this.settingsService.taxReporting.add_comment}`);
    }     
  }

  getTasksData(id){
    if (this.settingsService.production) {
      return this.apiService.invokeGetAPI(`${this.settingsService.taxReporting.tasks_list}/funds/${id}/tasks`);
    } 
    else{
      return this.apiService.invokeGetAPI(`${this.settingsService.taxReporting.tasks_list}`);
    }  
  }

  updateTaskStatus(id, data){
    if(this.settingsService.production){
      //when the api is ready
      //return this.apiService.invokePutAPI(`${this.settingsService.taxReporting.update_task_status}/tasks/${id}/status`, data);
      return this.apiService.invokeGetAPI(`${this.settingsService.taxReporting.update_task_status}`);
    }
    else{
      return this.apiService.invokeGetAPI(`${this.settingsService.taxReporting.update_task_status}`);
    }
  }

  listComments(entityId) {
    if(this.settingsService.production){      
      return this.apiService.invokeGetAPI(`${this.settingsService.taxReporting.comments_list}/TASK/${entityId}/comments`);
    }
    else{
      return this.apiService.invokeGetAPI(`${this.settingsService.taxReporting.comments_list}`);
    }
  }

}
