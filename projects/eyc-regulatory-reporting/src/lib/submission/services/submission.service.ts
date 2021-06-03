
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EycRrApiService } from '../../services/eyc-rr-api.service';
import { EycRrSettingsService } from '../../services/eyc-rr-settings.service';

@Injectable({
  providedIn: 'root'
})
export class SubmissionService {

  constructor(
    private apiService: EycRrApiService, private settingsService: EycRrSettingsService
  ) { }

  getXmlFilesList() {
    return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.submission_xml_files}`);
  }

  downloadXMl(id: any) {
    return this.apiService.invokeGetDownloadAPI(`${this.settingsService.regReportingFiling.submission_download_xml}${id}.xml`);
    // return this.http.get(this.settingsService.API_ENDPOINT+'assets/eyc-regulatory-reporting/mock/'+id+'.xml',  { headers , responseType: 'blob' as 'json' , observe: 'response' });
  }

}
