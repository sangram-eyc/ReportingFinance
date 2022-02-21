import { EventEmitter, Injectable, Output } from '@angular/core';
import { EycTaxSettingsService } from '../../services/eyc-tax-settings.service';
import { EycApiService } from '../../services/eyc-tax-api.service';

@Injectable({
  providedIn: 'root'
})
export class TaxCommentService {

  constructor(private apiService: EycApiService, private settingsService: EycTaxSettingsService) { }

  addTask(data, entityId) {
    if (this.settingsService.production) {
      return this.apiService.invokePostAPI(`${this.settingsService.taxReporting.add_task}/funds/${entityId}/tasks`, data);
    }
    else {
      return this.apiService.invokeGetAPI(`${this.settingsService.taxReporting.add_task}`);
    }
  }

  addComment(data) {
    if (this.settingsService.production) {
      return this.apiService.invokePostAPI(`${this.settingsService.taxReporting.add_comment}`, data);
    }
    else {
      return this.apiService.invokeGetAPI(`${this.settingsService.taxReporting.add_comment}`);
    }
  }


  uploadFile(data) {
    if (this.settingsService.production) {
      return this.apiService.invokePostAPI(`${this.settingsService.taxReporting.upload}`, data);
    }
    else {
      return this.apiService.invokeGetAPI(`${this.settingsService.taxReporting.upload}`);
    }
  }

  getTasksData(id) {
    if (this.settingsService.production) {
      return this.apiService.invokeGetAPI(`${this.settingsService.taxReporting.tasks_list}/funds/${id}/tasks`);
    }
    else {
      return this.apiService.invokeGetAPI(`${this.settingsService.taxReporting.tasks_list}`);
    }
  }

  updateTaskStatus(idTask, data) {
    if (this.settingsService.production) {
      return this.apiService.invokePutAPI(`${this.settingsService.taxReporting.update_task_status}/tasks/${idTask}/status`, data);
    }
    else {
      return this.apiService.invokeGetAPI(`${this.settingsService.taxReporting.update_task_status}`);
    }
  }

  listComments(entityId) {
    if (this.settingsService.production) {
      return this.apiService.invokeGetAPI(`${this.settingsService.taxReporting.comments_list}/TASK/${entityId}/comments`);
    }
    else {
      return this.apiService.invokeGetAPI(`${this.settingsService.taxReporting.comments_list}`);
    }
  }

  deleteTag(idTask, tagId) {
    if (this.settingsService.production) {
      return this.apiService.invokeDeleteAPI(`${this.settingsService.taxReporting.delete_tag}/tasks/${idTask}/tags/${tagId}`);
    }
    else {
      return this.apiService.invokeGetAPI(`${this.settingsService.taxReporting.delete_tag}`);
    }
  }

  deletePriority(idTask, data) {
    if (this.settingsService.production) {
      return this.apiService.invokePutAPI(`${this.settingsService.taxReporting.delete_priority}/tasks/${idTask}/priority`, data);
    }
    else {
      return this.apiService.invokeGetAPI(`${this.settingsService.taxReporting.delete_priority}`);
    }
  }

  downloadFile(data) {
    if (this.settingsService.production) {
      return this.apiService.invokePostAPI(`${this.settingsService.taxReporting.download}`, data);
    }
    else {
      return this.apiService.invokeGetAPI(`${this.settingsService.taxReporting.download}`);
    }
  }

  cycleCommentsDetails(cycleId){
    if (this.settingsService.production) {
      return this.apiService.invokeGetAPI(`${this.settingsService.taxReporting.production_cycles_comments_details}/${cycleId}/more-details`);
    }
    else {
      return this.apiService.invokeGetAPI(`${this.settingsService.taxReporting.production_cycles_comments_details}`);
  }}

  getCommentsDetailsPerProductCycle(id){
    if (this.settingsService.production) {
      return this.apiService.invokeGetAPI(`${this.settingsService.taxReporting.comments_details}/${id}/tasks-by-status`);
    }
    else {
      return this.apiService.invokeGetAPI(`${this.settingsService.taxReporting.comments_details}`);
    }
  }

  getCommentExpandDetails(id) {
    if (this.settingsService.production) {
      return this.apiService.invokeGetAPI(`${this.settingsService.taxReporting.comment_expand_details}/tasks/${id}`);
    }
    else {
      return this.apiService.invokeGetAPI(`${this.settingsService.taxReporting.comment_expand_details}`);
    }
  }

}
