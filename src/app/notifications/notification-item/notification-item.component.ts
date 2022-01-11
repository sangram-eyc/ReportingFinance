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

  // We Should not a call a method from the template, it will hamper the performance. We need to implement a pipe to calculate the time or this prop should come from the API - By Debabrata 12-01-2022
  calculateNotificationTime(dateSent) {
    const sentOnDate = new Date(dateSent);
    const differenceInDays =
      (Math.abs(sentOnDate.getTime() - new Date().getTime()) / (1000 * 60)) % 60;
    return Math.ceil(differenceInDays) + 'min';

  }
  
}
