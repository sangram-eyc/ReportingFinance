import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class TopsideService {

  constructor(
    @Inject('apiEndpoint') private apiEndpoint,
    private http: HttpClient
  ) {
  }

  public API_ENDPOINT = this.apiEndpoint.slice(-1) === '.' ?
    this.apiEndpoint.substr(0, this.apiEndpoint.length - 1) : this.apiEndpoint;

  getLastTopside(id: any) {
    return this.http.get(`${this.API_ENDPOINT}gatewayService/api/topsides/last?filingId=${id}`);
  }

  startProcessing(period: string, name: string, id: any) {
    return this.http.post(`${this.API_ENDPOINT}gatewayService/api/template?filingId=${id}&filingName=${name}&period=${period}`, {});
  }

  generateTemplate(period: string, name: string, id: any) {
    return this.http.post(`${this.API_ENDPOINT}gatewayService/api/template/generate?filingId=${id}&filingName=${name}&period=${period}`, {});
  }
}
