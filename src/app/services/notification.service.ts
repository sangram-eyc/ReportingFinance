import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class NotificationService {

  constructor(
    private http: HttpClient
  ) {
  }

  getArchivedNotifications() {
    return this.http.get(`https://10.48.234.20/qa32/gatewayService//api/notification?isArchived=true`);
  }
}
