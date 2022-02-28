import {Component, OnInit} from '@angular/core';
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
    this.notifications = [];
    this.notificationService.getNotArchivedNotifications().subscribe(res => {
      this.notifications = res.content;
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
    this.delete(i);
    setTimeout(() => {
      this.getArchivedNotifications();
    }, 1000);
  }

  expand(id): void {
    this.notifications.forEach(item => {
      if (item.engineId !== id) {
        item.request.expanded = false;
      }
    });
    this.notifications.find(item => item.engineId === id).request.expanded
      = !this.notifications.find(item => item.engineId === id).request.expanded;

    event.stopPropagation();
    event.preventDefault();
  }

  getArchivedNotifications() {
    this.notificationService.getArchivedNotifications().subscribe(res => {
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
