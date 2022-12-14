import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProcessingExceptionService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getExceptionReports() {
    return this.httpClient.get('assets/eyc-data-intake/mock/exception_details_9-9.json');
  }
  getDataSets() {
    return this.httpClient.get('assets/eyc-data-intake/mock/exception_details_9-9.json');
  }
  getBDFilesList() {
    return this.httpClient.get('assets/eyc-data-intake/mock/bd_files_list.json');
  }
}
