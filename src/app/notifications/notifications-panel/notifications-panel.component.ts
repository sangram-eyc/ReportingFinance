import { Component, OnInit } from '@angular/core';
import {NOTIFICATIONS_DATA} from "@default/notifications/notifications";

@Component({
  selector: 'app-notifications-panel',
  templateUrl: './notifications-panel.component.html',
  styleUrls: ['./notifications-panel.component.scss']
})
export class NotificationsPanelComponent implements OnInit {

  public notifications = NOTIFICATIONS_DATA;

  constructor() { }

  ngOnInit(): void {
  }

  expand(id): void {
   this.notifications.forEach( item => {
     if (item.id !== id) {
       item.expanded = false;
     }
   });

   this.notifications.find(item => item.id === id).expanded = !this.notifications.find(item => item.id === id).expanded
  }

  goToArchived(): void {
  }
}
