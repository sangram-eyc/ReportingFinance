import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from "@env/environment";

@Injectable({
  providedIn: 'root'
})

export class NotificationService {

  constructor(
    private http: HttpClient
  ) {
  }

  getArchivedNotifications(): Observable<any> {
    return this.http.get(`${environment.apiEndpoint}gatewayService/api/notification?isArchived=true`);
  }

  getNotArchivedNotifications(): Observable<any> {
    return this.http.get(`${environment.apiEndpoint}gatewayService/api/notification?isArchived=false`);
  }
  setNotificationFlagged(id): Observable<any> {
    return this.http.post(`${environment.apiEndpoint}gatewayService/api/notification/${id}/set-flagged?flagged=true`, {});
  }

  setNotificationRead(id): Observable<any> {
    return this.http.post(`${environment.apiEndpoint}gatewayService/api/notification/${id}/mark-as-read`, {});
  }

  exportCsv(): Observable<any> {
    return this.http.get(`${environment.apiEndpoint}gatewayService/api/notification/csv?isArchived=true`, {responseType: 'text'});
  }
}
