import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {NotificationService} from '@default/services/notification.service';

@Component({
  selector: 'app-notification-item',
  templateUrl: './notification-item.component.html',
  styleUrls: ['./notification-item.component.scss']
})
export class NotificationItemComponent implements OnInit, OnChanges {

  @Input() notification;
  @Output() expandNotification = new EventEmitter<any>();
  @Output() deleteNotification = new EventEmitter<any>();
  @Output() archiveNotification = new EventEmitter<any>();
  @Output() flagNotification = new EventEmitter<any>();

  public content: any;

  constructor(private notificationService: NotificationService) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.notification) {
      this.content = JSON.parse(changes.notification.currentValue.content);
    }
  }

  expand(id): void {
    this.notificationService.setNotificationRead(id).subscribe();
    this.expandNotification.emit(id);
  }

  delete(): void {
    this.notificationService.deleteNotification(this.notification.engineId).subscribe(res => {

    });
    this.deleteNotification.emit();
  }

  archive(): void {
    this.notificationService.setAsArchived(this.notification.engineId).subscribe();
    this.archiveNotification.emit();
  }

  flag(): void {
    this.notificationService.setNotificationFlagged(this.notification.engineId, !this.content.flagged).subscribe(res => {
      this.content.flagged = !this.content.flagged;
    });
  }

  calculateNotificationTime(date) {

    if (Array.isArray(date)) {
      // tslint:disable-next-line:radix
      const initialDate = new Date(date[0], parseInt(date[1]) - 1, date[2], date[3], date[4], date[5]);
      // tslint:disable-next-line:radix
      const transformedDate = initialDate.getTime() - new Date().getTimezoneOffset() * 60 * 1000;

      // tslint:disable-next-line:radix
      // @ts-ignore

      const seconds = Math.floor((new Date() - transformedDate) / 1000);

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
    } else {
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
  }

  getContentHtml(content): any {
    if (content) {
      const json = JSON.parse(content);
      if (json && json.content) {
        return json.content;
      } else {
        return false;
      }
    }
    return false;
  }
}
