import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '@env/environment';

@Injectable({
  providedIn: 'root'
})

export class TopsideService {

  constructor(
    private http: HttpClient
  ) {
  }

  getLastTopside(report: string, name: string) {
    return this.http.get(`${environment.SERVICE_URL}gatewayService/api/topsides/last?filingName=${name}&reportingType=${report}`);
  }

  startProcessing(report: string, name: string) {
    return this.http.post(`${environment.SERVICE_URL}gatewayService/api/template?filingName=${name}&reportingType=${report}`, {});
  }

  emailToRecipient() {
    return this.http.get(`${environment.apiEndpoint}gatewayService/api/notification/config/preferences/email-to-recipient-id?email=${sessionStorage.getItem('userEmail')}`, {responseType: 'text'});
  }
}
