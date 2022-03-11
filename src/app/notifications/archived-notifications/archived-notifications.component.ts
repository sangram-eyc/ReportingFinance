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
  public selectedItems = [];
  public currentPage = 0;

  constructor(
    private notificationService: NotificationService
  ) {
  }

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
    row.selected = !row.selected;
    if (row.selected) {
      this.selectedItems.push(row.engineId);
    } else {
      const index = this.selectedItems.findIndex(id => id === row.engineId);
      this.selectedItems.splice(index, 1);
    }
  }

  onKey(event): void {
    this.searchText = event.target.value;
    this.notificationService.getArchivedNotifications(this.searchText, 0).subscribe((res: any) => {
      this.notificationsData = res.content;
      this.notificationsData.forEach(item => {
        item.selected = false;
        item.subject = item.request.subject < 20 ? item.request.subject : item.request.subject + '...';
        item.category = JSON.parse(item.request.content).category;
        item.sendDate = `${item.sendDate[0]}/${item.sendDate[1]}/${item.sendDate[2]}`;
      });
    });
  }

  exportCsv() {
    this.notificationService.exportCsv(this.selectedItems).subscribe(res => {
      const blob = new Blob([res], {type: 'csv'});
      FileSaver.saveAs(blob, 'EY Comply - archived notifications.csv');
    });
  }

  flag(notification?): void {
    const content = JSON.parse(notification.request.content);
    notification.flagged = true;
    this.notificationService.setNotificationFlagged(notification.engineId, !content.flagged).subscribe(res => {
    });
  }

  delete(notification?): void {
    const index = this.notificationsData.findIndex(item => item.engineId == notification.engineId);
    this.notificationsData.splice(index, 1);
    this.notificationService.deleteNotification(notification.engineId).subscribe(res => {
    });
  }

  isFlagged(notification): boolean {
    const content = JSON.parse(notification.request.content);
    return content.flagged || notification.flagged;
  }

  getData(): void {
    this.notificationService.getArchivedNotifications('', this.currentPage).subscribe((res: any) => {
      this.notificationsData = res.content;
      this.notificationsData.forEach(item => {
        item.selected = false;
        item.subject = item.request.subject < 20 ? item.request.subject : item.request.subject + '...';
        item.category = JSON.parse(item.request.content).category;
        item.sendDate = `${item.sendDate[0]}/${item.sendDate[1]}/${item.sendDate[2]}`;
      });
    });
  }

  selectAll(event): void {
    if (event.target.checked) {
      this.notificationsData.forEach(item => {
        const index = this.selectedItems.findIndex(id => id === item.engineId);
        if (index < 0) {
          this.selectedItems.push(item.engineId);
        }
      });
    } else {
      this.selectedItems = [];
    }

    this.notificationsData.forEach(item => item.selected = event.target.checked);
  }

  onScroll() {
    this.currentPage += 1;
    this.notificationService.getArchivedNotifications(this.searchText, this.currentPage).subscribe( res => {
      res.content.forEach(item => {
        this.notificationsData.push(item);
      });
    });
  }
}
