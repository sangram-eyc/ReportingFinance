import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-notification-item',
  templateUrl: './notification-item.component.html',
  styleUrls: ['./notification-item.component.scss']
})
export class NotificationItemComponent implements OnInit {

  @Input() notification;
  @Output() expandNotification = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  expand(id): void {
    this.expandNotification.emit(id);
  }
}
