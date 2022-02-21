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

  updateTaskStatus(idTask, data) {
    if (this.settingsService.tax_Production) {
      return this.apiService.invokePutAPI(`${this.settingsService.taxReportingComments.update_task_status}/tasks/${idTask}/status`, data);
    }
    else {
      return this.apiService.invokeGetAPI(`${this.settingsService.taxReportingComments.update_task_status}`);
    }
  }

  deleteTag(idTask, tagId) {
    if (this.settingsService.tax_Production) {
      return this.apiService.invokeDeleteAPI(`${this.settingsService.taxReportingComments.delete_tag}/tasks/${idTask}/tags/${tagId}`);
    }
    else {
      return this.apiService.invokeGetAPI(`${this.settingsService.taxReportingComments.delete_tag}`);
    }
  }

  deletePriority(idTask, data) {
    if (this.settingsService.tax_Production) {
      return this.apiService.invokePutAPI(`${this.settingsService.taxReportingComments.delete_priority}/tasks/${idTask}/priority`, data);
    }
    else {
      return this.apiService.invokeGetAPI(`${this.settingsService.taxReportingComments.delete_priority}`);
    }
  }

  downloadFile(data) {
    if (this.settingsService.tax_Production) {
      return this.apiService.invokePostAPI(`${this.settingsService.taxReportingComments.download}`, data);
    }
    else {
      return this.apiService.invokeGetAPI(`${this.settingsService.taxReportingComments.download}`);
    }
  }
}
