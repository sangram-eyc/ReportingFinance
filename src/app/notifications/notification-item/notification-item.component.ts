import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';

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

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.notification) {
     this.content = JSON.parse(changes.notification.currentValue.content);
    }
  }

  expand(id): void {
    this.expandNotification.emit(id);
  }

  delete(): void {
    this.deleteNotification.emit();
  }

  archive(): void {
    this.content.extraParameters.isArchived = true;
    this.archiveNotification.emit();
  }

  flag(): void {
    this.content.extraParameters.flagged = !this.content.extraParameters.flagged;
    this.flagNotification.emit();
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
