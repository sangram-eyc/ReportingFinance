import {Component, OnDestroy, OnInit} from '@angular/core';
import {NotificationService} from '@default/services/notification.service';
import {Subscription} from 'rxjs';
import { hideNotificationFeaturesForProd } from '@default/helper/api-config-helper';
@Component({
  selector: 'app-notifications-panel',
  templateUrl: './notifications-panel.component.html',
  styleUrls: ['./notifications-panel.component.scss']
})
export class NotificationsPanelComponent implements OnInit, OnDestroy {
  public notifications = [];
  public data: any;
  public showPanel: boolean;
  public showFilters: boolean;
  private notifiSub$: Subscription;
  hideNotificationFeaturesForProd = hideNotificationFeaturesForProd;
  
  constructor(
    private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.notifications = JSON.parse(sessionStorage.getItem('notifications'));
    this.notifiSub$ = this.notificationService.notificationObs$.subscribe(res => {
      res.forEach(item => {
        const index = this.notifications.findIndex(noti => noti.engineId == item.engineId);
        if (index < 0) {
          this.notifications.unshift(item);
        }
      });
    });
  }

  delete(i): void {
    this.notifications.splice(i, 1);
    this.notifications = Object.assign([], this.notifications);
    event.stopPropagation();
    event.preventDefault();
    sessionStorage.setItem('notifications', JSON.stringify(this.notifications));
  }

  archive(i): void {
    const notificationContent = JSON.parse(this.notifications[i].request.content);
    notificationContent.extraParameters.isArchived = true;
    this.notifications[i].request.content = JSON.stringify(notificationContent);
    this.notifications = Object.assign([], this.notifications);
    event.stopPropagation();
    event.preventDefault();
    sessionStorage.setItem('notifications', JSON.stringify(this.notifications));
  }

  flag(i): void {
    const notificationContent = JSON.parse(this.notifications[i].request.content);
    notificationContent.extraParameters.flagged = !notificationContent.extraParameters.flagged;
    this.notifications[i].request.content = JSON.stringify(notificationContent);
    this.notifications = Object.assign([], this.notifications);
    event.stopPropagation();
    event.preventDefault();
    sessionStorage.setItem('notifications', JSON.stringify(this.notifications));
  }

  expand(id): void {
    this.notifications.forEach(item => {
      if (item.engineId !== id) {
        item.request.expanded = false;
      }
    });
    this.notifications.find(item => item.engineId === id).request.expanded
      = !this.notifications.find(item => item.engineId === id).request.expanded;

    event.stopPropagation();
    event.preventDefault();
  }

  onClickFilters($event) {
    this.eventStop($event);
    this.showFilters = !this.showFilters;
    this.showPanel = false;
  }

  onApplyFilters($event: MouseEvent) {
    this.eventStop($event);
    // TODO apply filters here
  }

  onCancelApplyFilters($event: MouseEvent) {
    this.eventStop($event);
    this.showFilters = false;
  }

  eventStop($event) {
    $event.stopPropagation();
    $event.preventDefault();
  }

  ngOnDestroy() {
    this.notifiSub$.unsubscribe();
  }
}
