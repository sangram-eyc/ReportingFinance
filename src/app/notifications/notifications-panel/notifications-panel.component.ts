import { Component, OnInit } from '@angular/core';
import {NOTIFICATIONS_DATA} from '@default/notifications/notifications';
import { io, Socket } from 'socket.io-client';
import {Router} from "@angular/router";

@Component({
  selector: 'app-notifications-panel',
  templateUrl: './notifications-panel.component.html',
  styleUrls: ['./notifications-panel.component.scss']
})
export class NotificationsPanelComponent implements OnInit {

  public notifications;

  private socket: any;
  public data: any;

  constructor(private router: Router) {
    this.socket = io('http://127.0.0.1:3000');
  }

  ngOnInit(): void {
    this.socket.on('notification', data => {
      this.notifications.unshift(data.data);
    });

    this.notifications = JSON.parse(localStorage.getItem('notifications'));
  }

  delete(i): void {
    this.notifications.splice(i, 1);
    event.stopPropagation();
    event.preventDefault();
    localStorage.setItem('notifications', JSON.stringify(this.notifications));
  }

  archive(i): void {
    this.notifications[i].status = 'Archived';
    event.stopPropagation();
    event.preventDefault();
    localStorage.setItem('notifications', JSON.stringify(this.notifications));
  }

  expand(id): void {
   this.notifications.forEach( item => {
     if (item.id !== id) {
       item.expanded = false;
     }
   });

   this.notifications.find(item => item.id === id).expanded = !this.notifications.find(item => item.id === id).expanded;
  }

  countArchived() {
    const items = this.notifications.filter(item => item.status === 'Archived');
    return items.length;
  }

  goToArchived(): void {
    this.router.navigate(['archived-notifications']);
  }
}
