import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '@env/environment';
import {notification} from '@default/helper/api-config-helper';

@Injectable({
  providedIn: 'root'
})

export class NotificationService {

  constructor(
    private http: HttpClient
  ) {
  }

  getArchivedNotifications(search = ''): Observable<any> {
    return this.http.get(`${environment.apiEndpoint}gatewayService/api/notification?isArchived=true&channelType=IN_APP&search=${search}`);
  }

  getNotArchivedNotifications(): Observable<any> {
    return this.http.get(`${environment.apiEndpoint}gatewayService/api/notification?isArchived=false&channelType=IN_APP`);
  }

  setNotificationFlagged(id, flag): Observable<any> {
    return this.http.post(`${environment.apiEndpoint}gatewayService/api/notification/${id}/set-flagged?flagged=${flag}`, {});
  }

  setNotificationRead(id): Observable<any> {
    return this.http.post(`${environment.apiEndpoint}gatewayService/api/notification/${id}/mark-as-read`, {});
  }

  deleteNotification(id): Observable<any> {
    return this.http.delete(`${environment.apiEndpoint}gatewayService/api/notification/${id}`);
  }

  exportCsv(): Observable<any> {
    return this.http.get(`${notification.export_Archived_Csv}`, {responseType: 'text'});
  }

  setAsArchived(id): Observable<any> {
    return this.http.post(`${environment.apiEndpoint}gatewayService/api/notification/${id}/mark-as-archived`, {});
  }
}
