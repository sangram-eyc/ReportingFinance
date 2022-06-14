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

  getLastTopside(id: any) {
    return this.http.get(`${environment.apiEndpoint}gatewayService/api/topsides/last?filingId=${id}`);
  }

  startProcessing(report: string, name: string, id: any) {
    return this.http.post(`${environment.apiEndpoint}gatewayService/api/template?filingId=${id}&filingName=${name}&period=${report}`, {});
  }

  generateProcessing(report: string, name: string, id: any) {
    return this.http.post(`${environment.apiEndpoint}gatewayService/api/template/generate?filingId=${id}&filingName=${name}&period=${report}`, {});
  }
}
