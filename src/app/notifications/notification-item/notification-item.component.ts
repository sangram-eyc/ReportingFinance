import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-notification-item',
  templateUrl: './notification-item.component.html',
  styleUrls: ['./notification-item.component.scss']
})
export class NotificationItemComponent implements OnInit {

  @Input() notification;
  @Output() expandNotification = new EventEmitter<any>();
  @Output() deleteNotification = new EventEmitter<any>();
  @Output() archiveNotification = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  expand(id): void {
    this.expandNotification.emit(id);
  }

  delete(): void {
    this.deleteNotification.emit();
  }

  archive(): void {
    this.archiveNotification.emit();
  }

  calculateNotificationTime(date) {
    // @ts-ignore
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    let interval = seconds / 31536000;

    if (interval > 1) {
      return Math.floor(interval) + ' y';
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + ' m';
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + ' d';
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + ' h';
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + ' min';
    }
    return Math.floor(seconds) + ' sec';
  }

  getContentHtml(content): any {
    return JSON.parse(content).content;
  }
}
