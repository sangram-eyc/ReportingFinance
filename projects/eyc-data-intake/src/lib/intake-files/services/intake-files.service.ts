import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class IntakeFilesService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getIntakeFilesList() {
    return this.httpClient.get('assets/eyc-data-intake/mock/intake-files-list.json');
  }
}
