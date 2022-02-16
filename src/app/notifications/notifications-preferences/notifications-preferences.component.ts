import {Component, OnInit} from '@angular/core';
import {PreferencesService} from '@default/services/preferences.service';

@Component({
  selector: 'app-notifications-preferences',
  templateUrl: './notifications-preferences.component.html',
  styleUrls: ['./notifications-preferences.component.scss']
})
export class NotificationsPreferencesComponent implements OnInit {

  public webOpen: boolean;
  public mobileOpen: boolean;
  public emailOpen: boolean;
  public preferences;
  public recipientId: string;
  public havePreferences: boolean;
  public preferencesId: number;
  public notificationEmailObject: any = [];
  public notificationInAppObject: any = [];
  public subscriptions: any;
  public subscriptionTypes;
  public emailPreferences;
  public inAppPreferences;

  public channel = [
    {
      channel: 'EMAIL',
      blackoutTimeFrom: null,
      blackoutTimeTo: null,
      enabled: true,
      blackoutEnabled: false
    },
    {
      channel: 'IN_APP',
      blackoutTimeFrom: null,
      blackoutTimeTo: null,
      enabled: true,
      blackoutEnabled: false
    }
  ];

  constructor(
    private preferencesService: PreferencesService
  ) {
  }

  ngOnInit(): void {
    this.preferencesService.emailToRecipient().subscribe(res => {
      this.recipientId = res;
      this.preferencesService.getSubscriptionTypes().subscribe((types: any) => {
        this.subscriptionTypes = types;
        this.transformNotifications(this.recipientId);
        this.transformEmailPreferences(this.recipientId);
        this.transformInAppPreferences(this.recipientId);
      });
    }, error => {
      this.preferencesService.createRecipient().subscribe( recipient => {
        this.preferencesService.emailToRecipient().subscribe(res => {
          this.recipientId = res;
          this.preferencesService.getSubscriptionTypes().subscribe((types: any) => {
            this.subscriptionTypes = types;
            this.transformNotifications(this.recipientId);
            this.transformEmailPreferences(this.recipientId);
            this.transformInAppPreferences(this.recipientId);
          });
        });
      });
    });
  }

  transformNotifications(recipientId) {
    this.preferencesService.getRecipientSubscriptions(recipientId).subscribe((recipientPreferences: any) => {
      const types = JSON.parse(JSON.stringify(this.subscriptionTypes));
      types.forEach(item => {
          recipientPreferences.forEach(preference => {
            if (item.name === preference.notificationTypeName) {
              item.selected = true;
              item.id = preference.id;
            }
          });
        });
      this.subscriptions = types;
      });
  }

  transformInAppPreferences(recipientId) {
    this.preferencesService.getRecipientPreferences(recipientId).subscribe( (res: any) => {
      const types = JSON.parse(JSON.stringify(this.subscriptionTypes));
      types.forEach(item => {
        if (res) {
          res.notification.forEach(preference => {
            if (preference.preferredChannel === 'IN_APP') {
              this.notificationInAppObject = [];
              this.notificationInAppObject.push(preference);
            }
            if (item.name === preference.notificationTypeName && preference.preferredChannel === 'IN_APP') {
              item.selected = true;
            }
          });
        }
      });
      this.inAppPreferences = types;
      if (res) {
        this.havePreferences = true;
        this.preferencesId = res.id;
      }
    });
  }

  transformEmailPreferences(recipientId) {
    this.preferencesService.getRecipientPreferences(recipientId).subscribe( (res: any) => {
      const types = JSON.parse(JSON.stringify(this.subscriptionTypes));
      types.forEach(item => {
        if (res) {
          res.notification.forEach(preference => {
            if (preference.preferredChannel === 'EMAIL') {
              this.notificationEmailObject = [];
              this.notificationEmailObject.push(preference);
            }
            if (item.name === preference.notificationTypeName && preference.preferredChannel === 'EMAIL') {
              item.selected = true;
            }
          });
        }
      });
      this.emailPreferences = types;
      if (res) {
       this.havePreferences = true;
       this.preferencesId = res.id;
     }
    });
  }

  changeSubscription(web, event) {
    if (event === true) {
      this.preferencesService.notificationSubscription(this.recipientId, web.name).subscribe(res => {
        this.transformNotifications(this.recipientId);
      });
    } else {
      this.preferencesService.deleteSubscription(web.id).subscribe();
    }
  }

  changeEmailPreferences(web, event) {
    if (this.havePreferences) {
      if (!event) {
        this.notificationEmailObject.forEach(item => {
          if (item.notificationTypeName == web.name) {
            item = null;
          }
        });
      } else {
        this.notificationEmailObject.push({
            notificationTypeName: web.name,
            preferredChannel: 'EMAIL',
            preferredContentType: 'HTML',
            preferredLanguage: 'enUS'
          });
      }
      this.preferencesService.updateRecipientPreferences(
        {
          id: this.preferencesId,
          recipientId: this.recipientId,
          notification: this.notificationEmailObject.concat(this.notificationInAppObject),
          channel: this.channel
        }
      ).subscribe();
    } else {
      this.notificationInAppObject.push({
        notificationTypeName: web.name,
        preferredChannel: 'EMAIL',
        preferredContentType: 'HTML',
        preferredLanguage: 'enUS'
      });

      this.preferencesService.createRecipientPreferences(
        {
          recipientId: this.recipientId,
          notification: this.notificationInAppObject.concat(this.notificationEmailObject),
          channel: this.channel
        }).subscribe()
    }
  }

  changeInAppPreferences(web, event) {
    if (this.havePreferences) {
      if (!event) {
        this.notificationInAppObject.forEach(item => {
          if (item.notificationTypeName == web.name) {
            item = null;
          }
        });
      } else {
        this.notificationInAppObject.push({
          notificationTypeName: web.name,
          preferredChannel: 'IN_APP',
          preferredContentType: 'HTML',
          preferredLanguage: 'enUS'
        });
      }
      this.preferencesService.updateRecipientPreferences(
        {
          id: this.preferencesId,
          recipientId: this.recipientId,
          notification: this.notificationInAppObject.concat(this.notificationEmailObject),
          channel: this.channel
        }
      ).subscribe();
    } else {
      this.notificationInAppObject.push({
        notificationTypeName: web.name,
        preferredChannel: 'IN_APP',
        preferredContentType: 'HTML',
        preferredLanguage: 'enUS'
      });

      this.preferencesService.createRecipientPreferences(
        {
          recipientId: this.recipientId,
          notification: this.notificationInAppObject.concat(this.notificationEmailObject),
          channel: this.channel
        }).subscribe();
    }
  }
}
