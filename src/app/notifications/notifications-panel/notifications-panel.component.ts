import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {PouchdbService} from '@default/services/pouchdb.service';
import {NotificationService} from '@default/services/notification.service';
import {Subscription} from 'rxjs';
import { hideNotificationFeaturesForProd } from '@default/helper/api-config-helper';
@Component({
  selector: 'app-notifications-panel',
  templateUrl: './notifications-panel.component.html',
  styleUrls: ['./notifications-panel.component.scss']
})
export class NotificationsPanelComponent implements OnInit, OnDestroy {
  public notifications = [];
  public data: any;
  public showPanel: boolean;
  public showFilters: boolean;
  public archivedItems: number;
  public totalElements: number;
  public currentPage = 0;
  private notifiSub$: Subscription;
  hideNotificationFeaturesForProd = hideNotificationFeaturesForProd;
  
  constructor(
    private notificationService: NotificationService,
    private router: Router,
    private pouchDbService: PouchdbService) {
  }

  ngOnInit(): void {
    this.getArchivedNotifications();
    this.notifications = [];
    const ids = [];
    this.notificationService.getNotArchivedNotifications(this.currentPage).subscribe(res => {
      this.notifications = res.content;
      this.totalElements = res.totalElements;
      this.notifications.forEach(item => {
        if (!item.isRead) {
          ids.push(item.engineId);
        }
      });

      this.notificationService.setMultipleAsRead(ids).subscribe();
    });
    this.notifiSub$ = this.notificationService.notificationObs$.subscribe( res => {
      res.forEach( item => {
        const index = this.notifications.findIndex(noti => noti.engineId == item.engineId);
        if (index < 0) {
          this.notifications.unshift(item);
        }
      });
    });
  }

  delete(i): void {
    this.notifications.splice(i, 1);
    this.notifications = Object.assign([], this.notifications);
    this.notificationService.getNotArchivedNotifications(this.currentPage).subscribe(res => {
      this.totalElements = res.totalElements;
    });
    event.stopPropagation();
    event.preventDefault();
    sessionStorage.setItem('notifications', JSON.stringify(this.notifications));
  }

  archive(i): void {
    this.delete(i);
    setTimeout(() => {
      this.getArchivedNotifications();
      this.notificationService.getNotArchivedNotifications(this.currentPage).subscribe(res => {
        this.totalElements = res.totalElements;
      });
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

  onScroll() {
    this.currentPage += 1;
    this.notificationService.getNotArchivedNotifications(this.currentPage).subscribe(res => {
      res.content.forEach( item => {
        this.notifications.push(item);
      });
    });
  }

  getArchivedNotifications() {
    this.notificationService.getArchivedNotifications('', 0).subscribe(res => {
      this.archivedItems = res.totalElements;
    });
  }

  goToArchived(): void {
    this.router.navigate(['archived-notifications']);
  }

  onClickFilters($event) {
    this.eventStop($event);
    this.showFilters = !this.showFilters;
    this.showPanel = false;
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

  ngOnDestroy() {
    this.notifiSub$.unsubscribe();
  }
}
