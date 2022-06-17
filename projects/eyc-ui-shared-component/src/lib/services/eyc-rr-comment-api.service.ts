import { Injectable } from '@angular/core';
import { SettingService } from './setting.service';
import { ApiSharedService } from './api-shared.service';
@Injectable({
  providedIn: 'root'
})
export class EycRrCommentApiService {
moduleOrigin="Data Managed Services";
  constructor(
    private apiService: ApiSharedService,
    private settingsService: SettingService
  ) { }

  addComment(data) {
    debugger;
    if(data.moduleOriginated?.replace(/\s/g, '') === this.moduleOrigin.replace(/\s/g, '')){
    return this.apiService.invokePostAPI(`${this.settingsService.DMSFilling.add_comment}`, data);
    }
    else{
      return this.apiService.invokePostAPI(`${this.settingsService.regReportingFiling.add_comment}`, data);
    }
  }

  uploadFile(data) { 
    return this.apiService.invokePostAPI(`${this.settingsService.regReportingFiling.upload}`, data);
  }

  downloadFile(data) { 
    return this.apiService.invokePostAPI(`${this.settingsService.regReportingFiling.download}`, data);
  }
  
  listComments(entityId, entityType, moduleOriginated) {
    return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.list_comments}`+entityType+'/'+entityId+'/comments?module='+moduleOriginated);
  }

  updateStatus(exceptionId,data,statusTo) {
    return this.apiService.invokePutAPI(`${this.settingsService.regReportingFiling.resolve}`+exceptionId+'/'+statusTo,data);
  }

  addBulkComment(data){
    return this.apiService.invokePostAPI(`${this.settingsService.regReportingFiling.add_bulk_comment}`, data);
  }

  uploadBulkFile(data) { 
    return this.apiService.invokePostAPI(`${this.settingsService.regReportingFiling.bulk_upload}`, data);
  }
}
