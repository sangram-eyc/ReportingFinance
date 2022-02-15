import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class NotificationService {

  constructor(
    private http: HttpClient
  ) {
  }

  getArchivedNotifications(): Observable<any> {
    return this.http.get(`https://10.48.234.20/qa32/gatewayService/api/notification?isArchived=true`);
  }

  getNotArchivedNotifications(): Observable<any> {
    return this.http.get(`https://10.48.234.20/qa32/gatewayService/api/notification?isArchived=false`);
  }

  setNotificationFlagged(id): Observable<any> {
    return this.http.post(`https://10.48.234.20/qa32/gatewayService/api/notification/${id}/set-flagged?flagged=true`, {});
  }

  setNotificationRead(id): Observable<any> {
    return this.http.post(`https://10.48.234.20/qa32/gatewayService/api/notification/${id}/mark-as-read`, {});
  }

  exportCsv(): Observable<any> {
    return this.http.get('https://10.48.234.20/qa32/gatewayService/api/notification/csv?isArchived=true', {responseType: 'text'});
  }
}
