import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {
  TableHeaderRendererComponent
} from '../../../../projects/eyc-regulatory-reporting/src/lib/shared/table-header-renderer/table-header-renderer.component';
import {NotificationService} from '@default/services/notification.service';
import {MotifTableCellRendererComponent} from '@ey-xd/ng-motif';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-archived-notifications',
  templateUrl: './archived-notifications.component.html',
  styleUrls: ['./archived-notifications.component.scss']
})
export class ArchivedNotificationsComponent implements OnInit {
  @ViewChild('dropdownTemplate')
  dropdownTemplate: TemplateRef<any>;

  @ViewChild('actions')
  actions: TemplateRef<any>;

  public notificationsData = null;
  public columnDefs;
  public searchText = '';

  constructor(
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.getData();
    setTimeout(() => {
      this.columnDefs = [
        {
          headerComponentFramework: TableHeaderRendererComponent,
          cellRendererFramework: MotifTableCellRendererComponent,
          cellRendererParams: {
            ngTemplate: this.dropdownTemplate,
          },
          field: 'selected',
          headerName: '',
          width: 20,
          sortable: false,
          pinned: 'left'
        },
        {
          headerComponentFramework: TableHeaderRendererComponent,
          headerName: 'Subject',
          field: 'subject',
          sortable: true,
          filter: false,
          wrapText: true,
          autoHeight: true,
          width: 300,
          sort: 'asc',
        },
        {
          headerComponentFramework: TableHeaderRendererComponent,
          headerName: 'Status',
          field: 'status',
          sortable: true,
          filter: false,
          wrapText: true,
          autoHeight: true,
          width: 300,
          sort: 'asc',
        },
        {
          headerComponentFramework: TableHeaderRendererComponent,
          headerName: 'Category',
          field: 'category',
          sortable: true,
          filter: false,
          wrapText: true,
          autoHeight: true,
          width: 300,

        },
        {
          headerComponentFramework: TableHeaderRendererComponent,
          headerName: 'Received on',
          field: 'sendDate',
          sortable: true,
          filter: false,
          wrapText: true,
          autoHeight: true,
          width: 300
        },
        {
          headerComponentFramework: TableHeaderRendererComponent,
          cellRendererFramework: MotifTableCellRendererComponent,
          cellRendererParams: {
            ngTemplate: this.actions,
          },
          field: 'actions',
          headerName: 'Actions',
          width: 200,
          sortable: false,
        },
      ];
    });
  }

  changeCheck(row) {
    console.log(row);
  }

  changes(change) {
    console.log(change);
  }

  onKey(event): void {
    this.searchText = event.target.value;
    this.notificationService.getArchivedNotifications(this.searchText).subscribe( (res: any) => {
      this.notificationsData = res.content;
      this.notificationsData.forEach( item => {
        item.selected = false;
        item.subject = item.request.subject;
        item.category = JSON.parse(item.request.content).category;
      });
    });
  }

  exportCsv() {
    this.notificationService.exportCsv().subscribe( res => {
        const blob = new Blob([res], {type: 'csv'});
        FileSaver.saveAs(blob, 'EY Comply - archived notifications.csv');
    });
  }

  flag(notification?): void {
    const content = JSON.parse(notification.request.content);
    this.notificationService.setNotificationFlagged(notification.engineId, !content.flagged).subscribe( res => {
      this.getData();
    });
  }

  delete(notification?): void {
    this.notificationService.deleteNotification(notification.engineId).subscribe( res => {
      this.getData();
    });
  }

  isFlagged(notification): boolean {
    const content = JSON.parse(notification.request.content);
    return content.flagged;
  }

  getData(): void {
    this.notificationService.getArchivedNotifications().subscribe( (res: any) => {
      this.notificationsData = res.content;
      this.notificationsData.forEach( item => {
        item.selected = false;
        item.subject = item.request.subject;
        item.category = JSON.parse(item.request.content).category;
      });
    });
  }
}
