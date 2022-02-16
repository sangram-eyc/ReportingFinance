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

  public notificationsData = null;
  public columnDefs;

  constructor(
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.notificationService.getArchivedNotifications().subscribe( (res: any) => {
      this.notificationsData = res.content;
      this.notificationsData.forEach( item => {
        item.selected = false;
        item.subject = item.request.subject;
        item.category = JSON.parse(item.request.content).category;
      });
    });

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
          width: 200,
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
          width: 200,
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
          width: 200,

        },
        {
          headerComponentFramework: TableHeaderRendererComponent,
          headerName: 'Received on',
          field: 'sendDate',
          sortable: true,
          filter: false,
          wrapText: true,
          autoHeight: true,
          width: 200
        },
        {
          width: 200,
          headerComponentFramework: TableHeaderRendererComponent,
          headerName: 'Actions',
          field: 'Actions',
          sortable: false,
          filter: false,
        },
      ];
    });
  }

  changeCheck(row) {
    console.log(row);
  }

  changes(change) {
    console.log(change)
  }

  onKey(event): void {
    this.notificationService.getArchivedNotifications(event.target.value).subscribe( (res: any) =>{
      this.notificationsData = res.content;
      this.notificationsData.forEach( item => {
        item.selected = false;
        item.subject = item.request.subject;
        item.category = JSON.parse(item.request.content).category;
      });
    })
  }

  exportCsv() {
    this.notificationService.exportCsv().subscribe( res => {
        const blob = new Blob([res], {type: 'csv'});
        FileSaver.saveAs(blob, 'EY Comply - archived notifications.csv');
    });
  }
}
