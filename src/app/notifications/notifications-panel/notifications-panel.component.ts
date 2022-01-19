import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-notifications-panel',
  templateUrl: './notifications-panel.component.html',
  styleUrls: ['./notifications-panel.component.scss']
})
export class NotificationsPanelComponent implements OnInit {
  public notifications;
  public data: any;
  public showPanel: boolean;
  public showFilters: boolean;

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    this.notifications = JSON.parse(sessionStorage.getItem('notifications'));
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
   this.notifications.forEach( item => {
     if (item.engineId !== id) {
       item.request.expanded = false;
     }
   });
   this.notifications.find(item => item.engineId === id).request.expanded
     = !this.notifications.find(item => item.engineId === id).request.expanded;
  }

  countArchived() {
    const items = this.notifications.filter(item => item.status === 'Archived');
    return items.length;
  }

  goToArchived(): void {
    this.router.navigate(['archived-notifications']);
  }
}
