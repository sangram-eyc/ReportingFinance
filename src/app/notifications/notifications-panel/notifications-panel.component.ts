import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {PouchdbService} from "@default/services/pouchdb.service";
import {NotificationService} from "@default/services/notification.service";

@Component({
  selector: 'app-notifications-panel',
  templateUrl: './notifications-panel.component.html',
  styleUrls: ['./notifications-panel.component.scss']
})
export class NotificationsPanelComponent implements OnInit {
  public notifications = [];
  public data: any;
  public showPanel: boolean;
  public showFilters: boolean;
  public archivedItems: number;

  constructor(
    private notificationService: NotificationService,
    private router: Router,
    private pouchDbService: PouchdbService) {
  }

  ngOnInit(): void {
    this.getArchivedNotifications();
    this.notifications = JSON.parse(sessionStorage.getItem('notifications')) || [];
    this.notificationService.getNotArchivedNotifications().subscribe( res => {
      res.content.forEach(item => {
        this.notifications.push(item);
      });
    });
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
    this.getArchivedNotifications();
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

  getArchivedNotifications() {
    this.notificationService.getArchivedNotifications().subscribe( res => {
      this.archivedItems = res.totalElements;
    });
  }

  goToArchived(): void {
    this.router.navigate(['archived-notifications']);
  }

  onClickFilters($event) {
    this.eventStop($event);
    this.showFilters = !this.showFilters;
    this.showPanel = false
  }

  onApplyFilters($event: MouseEvent) {
    this.eventStop($event);
    // TODO apply filters here
  }

  onCancelApplyFilters($event: MouseEvent) {
    this.eventStop($event);
    this.showFilters = false;
  }

  eventStop($event) {
    $event.stopPropagation();
    $event.preventDefault();
  }
}
