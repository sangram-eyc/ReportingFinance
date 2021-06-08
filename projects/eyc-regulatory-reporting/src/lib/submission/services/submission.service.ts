
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

  getXmlFilesList(filingName: any,period: any) {
    return this.apiService.invokeGetAPI(`${this.settingsService.regReportingFiling.submission_xml_files}?filing=${filingName}&period=${period}`);
  }

  downloadXMl(fileName: any, filingName: any,period: any) {
    return this.apiService.invokePostDownloadAPI(`${this.settingsService.regReportingFiling.submission_download_xml}?filenames=${fileName}&filing=${filingName}&period=${period}`);
    // return this.http.get(this.settingsService.API_ENDPOINT+'assets/eyc-regulatory-reporting/mock/'+id+'.xml',  { headers , responseType: 'blob' as 'json' , observe: 'response' });
  }

}
