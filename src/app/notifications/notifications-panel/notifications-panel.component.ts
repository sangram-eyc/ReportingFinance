import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {NOTIFICATIONS_DATA} from "@default/notifications/notifications";

@Component({
  selector: 'app-notifications-panel',
  templateUrl: './notifications-panel.component.html',
  styleUrls: ['./notifications-panel.component.scss']
})
export class NotificationsPanelComponent implements OnInit {
  public notifications;
  public data: any;

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    this.notifications = JSON.parse(localStorage.getItem('notifications'));
  }

  delete(i): void {
    this.notifications.splice(i, 1);
    event.stopPropagation();
    event.preventDefault();
    sessionStorage.setItem('notifications', JSON.stringify(this.notifications));
  }

  archive(i): void {
    this.notifications[i].status = 'Archived';
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
   this.notifications.find(item => item.engineId === id).request.expanded = !this.notifications.find(item => item.engineId === id).request.expanded;
  }

  countArchived() {
    const items = this.notifications.filter(item => item.status === 'Archived');
    return items.length;
  }

  goToArchived(): void {
    this.router.navigate(['archived-notifications']);
  }
}
