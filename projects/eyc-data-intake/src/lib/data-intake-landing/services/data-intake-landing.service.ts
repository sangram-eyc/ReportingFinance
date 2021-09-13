import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataIntakeLandingService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getIntakeFilesList() {
    return this.httpClient.get('assets/eyc-data-intake/mock/exception_summary_9-9.json');
  }

  getComments() {
    return this.httpClient.get('assets/eyc-data-intake/mock/comments.json');
  }
}
