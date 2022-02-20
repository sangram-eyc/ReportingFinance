import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '@env/environment';

@Injectable({
  providedIn: 'root'
})

export class PreferencesService {

  constructor(
    private http: HttpClient
  ) {
  }

  getSubscriptionTypes() {
    return this.http.get(`${environment.apiEndpoint}gatewayService/api/notification/config/notification-type?page-size=10&page-no=1`);
  }

  emailToRecipient() {
    return this.http.get(`${environment.apiEndpoint}gatewayService/api/notification/config/preferences/email-to-recipient-id?email=${sessionStorage.getItem('userEmail')}`, {responseType: 'text'});
  }

  notificationSubscription(recipient: string, name: string) {
    return this.http.post(`${environment.apiEndpoint}gatewayService/api/notification/config/notification-subscription`, {
      notificationTypeName: name,
      recipientId: recipient
    });
  }

  getRecipientSubscriptions(recipient) {
    return this.http.get(`${environment.apiEndpoint}gatewayService/api/notification/config/notification-subscription/recipient/${recipient}`);
  }

  deleteSubscription(id) {
    return this.http.delete(`${environment.apiEndpoint}gatewayService/api/notification/config/notification-subscription/${id}`, {responseType: 'text'});
  }

  getRecipientPreferences(id) {
    return this.http.get(`${environment.apiEndpoint}gatewayService/api/notification/config/recipient-preferences/${id}`);
  }

  createRecipientPreferences(body) {
    return this.http.post(`${environment.apiEndpoint}gatewayService/api/notification/config/recipient-preferences`, body);
  }

  updateRecipientPreferences(body) {
    return this.http.put(`${environment.apiEndpoint}gatewayService/api/notification/config/recipient-preferences`, body);
  }

  createRecipient() {
    const body = {
      recipientName: sessionStorage.getItem('userEmail'),
      addresses: [
        {
          addressValue: sessionStorage.getItem('userEmail'),
          channel: 'IN_APP'
        },
        {
          addressValue: '+48123456',
          channel: 'TEXT_MESSAGE'
        },
        {
          addressValue: sessionStorage.getItem('userEmail'),
          channel: 'EMAIL'
        }
      ],
      defaultChannel: 'IN_APP',
      defaultContentType: 'PLAIN_TEXT',
      defaultLanguage: 'enUS'
    };

    return this.http.post(`${environment.apiEndpoint}gatewayService/api/notification/config/notification-recipient`, body);
  }
}
