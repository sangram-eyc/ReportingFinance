import { Injectable } from '@angular/core';
import { SettingService } from './setting.service';
import { ApiSharedService } from './api-shared.service';

@Injectable({
  providedIn: 'root'
})
export class EycTaxCommentApiService {

  constructor(
    private apiService: ApiSharedService,
    private settingsService: SettingService
  ) { }

  getTasksData(id) {
    if (this.settingsService.tax_Production) {
      //uncomment when endpoint is ready
      //return this.apiService.invokeGetAPI(`${this.settingsService.taxReportingComments.tasks_list}/funds/${id}/tasks`);
      return this.apiService.invokeGetAPI(`${this.settingsService.taxReportingComments.tasks_list}`);
    }
    else {
      return this.apiService.invokeGetAPI(`${this.settingsService.taxReportingComments.tasks_list}`);
    }
  }

  updateTaskStatus(idTask, data) {
    if (this.settingsService.tax_Production) {
      //uncomment when endpoint is ready
      //return this.apiService.invokePutAPI(`${this.settingsService.taxReportingComments.update_task_status}/tasks/${idTask}/status`, data);
      return this.apiService.invokeGetAPI(`${this.settingsService.taxReportingComments.update_task_status}`);
    }
    else {
      return this.apiService.invokeGetAPI(`${this.settingsService.taxReportingComments.update_task_status}`);
    }
  }


  deleteTag(idTask, tagId) {
    if (this.settingsService.tax_Production) {
      //uncomment when endpoint is ready
      //return this.apiService.invokeDeleteAPI(`${this.settingsService.taxReportingComments.delete_tag}/tasks/${idTask}/tags/${tagId}`);
      return this.apiService.invokeGetAPI(`${this.settingsService.taxReportingComments.delete_tag}`);
    }
    else {
      return this.apiService.invokeGetAPI(`${this.settingsService.taxReportingComments.delete_tag}`);
    }
  }

  deletePriority(idTask, data) {
    if (this.settingsService.tax_Production) {
      //uncomment when endpoint is ready
      //return this.apiService.invokePutAPI(`${this.settingsService.taxReportingComments.delete_priority}/tasks/${idTask}/priority`, data);
      return this.apiService.invokeGetAPI(`${this.settingsService.taxReportingComments.delete_priority}`);
    }
    else {
      return this.apiService.invokeGetAPI(`${this.settingsService.taxReportingComments.delete_priority}`);
    }
  }

  downloadFile(data) {
    if (this.settingsService.tax_Production) {
      //uncomment when endpoint is ready
      //return this.apiService.invokePostAPI(`${this.settingsService.taxReportingComments.download}`, data);
      return this.apiService.invokeGetAPI(`${this.settingsService.taxReportingComments.download}`);
    }
    else {
      return this.apiService.invokeGetAPI(`${this.settingsService.taxReportingComments.download}`);
    }
  }
}
