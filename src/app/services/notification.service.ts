import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from "@env/environment";
import {notification} from "@default/helper/api-config-helper";

@Injectable({
  providedIn: 'root'
})

export class NotificationService {

  constructor(
    private http: HttpClient
  ) {
  }

  getArchivedNotifications(search = ''): Observable<any> {
    return this.http.get(`${environment.apiEndpoint}/gatewayService/api/notification?isArchived=true&search=${search}`);
  }

  getNotArchivedNotifications(): Observable<any> {
    return this.http.get(`${notification.no_Archived_Notifications}`);
  }

  setNotificationFlagged(id): Observable<any> {
    return this.http.post(`${environment.apiEndpoint}gatewayService/api/notification/${id}/set-flagged?flagged=true`, {});
  }

  setNotificationRead(id): Observable<any> {
    return this.http.post(`${environment.apiEndpoint}gatewayService/api/notification/${id}/mark-as-read`, {});
  }

  exportCsv(): Observable<any> {
    return this.http.get(`${notification.export_Archived_Csv}`, {responseType: 'text'});
  }

  setAsArchived(id): Observable<any> {
    return this.http.post(`${environment.apiEndpoint}gatewayService/api/notification/${id}/mark-as-archived`, {});
  }
}
