import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {environment} from '@env/environment';

@Injectable({
  providedIn: 'root'
})

export class NotificationService {

  notification = new BehaviorSubject<any>(null);
  notificationObs$ = this.notification.asObservable();

  constructor(
    private http: HttpClient
  ) {
  }

  getArchivedNotifications(search = ''): Observable<any> {
    return this.http.get(`${environment.apiEndpoint}gatewayService/api/notification?isArchived=true&channelType=IN_APP&search=${search}`);
  }

  getNotArchivedNotifications(page: number): Observable<any> {
    return this.http.get(`${environment.apiEndpoint}gatewayService/api/notification?isArchived=false&channelType=IN_APP&sort=receiveTime,DESC&page=${page}&pageSize=20`);
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

  exportCsv(ids): Observable<any> {
    let params = '';

    if (ids.length) {
     params = `&ids=${ids}`;
    }
    return this.http.get(`${environment.apiEndpoint}gatewayService/api/notification/csv?isArchived=true${params}`, {responseType: 'text'});
  }

  setAsArchived(id): Observable<any> {
    return this.http.post(`${environment.apiEndpoint}gatewayService/api/notification/${id}/mark-as-archived`, {});
  }
}
