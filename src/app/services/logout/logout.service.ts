import { Injectable } from '@angular/core';
import { app_logout } from '@default/helper/api-config-helper';
import { ApiService } from '../api.service';


@Injectable({
  providedIn: 'root'
})
export class LogoutService {

  constructor(
    private apiService: ApiService,
  ) { }

  logoffNotification(body) {
    return this.apiService.invokePutAPI(`${app_logout.notification_logout}`,body);
  }
}
