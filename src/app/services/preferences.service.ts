import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class PreferencesService {

  constructor(
    private http: HttpClient
  ) {
  }

  getPreferencesTypes() {
    return this.http.get('https://10.48.234.20/qa32/gatewayService/api/notification/config/notification-type?page-size=10&page-no=1');
  }

  emailToRecipient() {
    return this.http.get(`https://10.48.234.20/qa32/gatewayService/api/notification/config/preferences/email-to-recipient-id?email=${sessionStorage.getItem('userEmail')}`, {responseType: 'text'});
  }

  notificationSubscription() {
    return this.http.post('https://10.48.234.20/qa32/gatewayService/api/notification/config/notification-subscription', {});
  }

  recipientPreferences() {
    return this.http.post('https://10.48.234.20/qa32/gatewayService/api/notification/config/recipient-preferences', {});
  }

  getRecipientPreferences(recipient) {
    return this.http.get(`https://10.48.234.20/qa32/gatewayService/api/notification/config/recipient-preferences/${recipient}`);
  }
}
