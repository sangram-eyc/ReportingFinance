import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, HostListener } from '@angular/core';

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

  constructor() {
  }

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
    this.archiveNotification.emit();
  }

  flag(): void {
    this.flagNotification.emit();
    this.content.flagged = !this.content.flagged;
  }

  calculateNotificationTime(date) {
    let seconds = 0;
    if (Array.isArray(date)) {
      // tslint:disable-next-line:radix
      const initialDate = new Date(date[0], parseInt(date[1]) - 1, date[2], date[3], date[4], date[5]);
      // tslint:disable-next-line:radix
      const transformedDate = initialDate.getTime() - new Date().getTimezoneOffset() * 60 * 1000;

      // tslint:disable-next-line:radix
      // @ts-ignore
      seconds = Math.floor((new Date() - transformedDate) / 1000);
    } else {
      // @ts-ignore
      seconds = Math.floor((new Date() - new Date(date)) / 1000);
    }
    return this.getFormattedInterval(seconds);
  }

  private getFormattedInterval(seconds: number): string {
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
    return 'Just Now!';
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

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    // If we don't have an anchor tag, we don't need to do anything.
    if (!(event.target instanceof HTMLAnchorElement)) {
      return;
    }
    // Prevent page from reloading
    event.preventDefault();
    const target = event.target as HTMLAnchorElement;
    console.log('target > ', target);
    // Navigate to the path in the link
    window.open(target.href, '_self');
  }

}
