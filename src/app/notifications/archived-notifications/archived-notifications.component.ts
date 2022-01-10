import { Component, OnInit } from '@angular/core';
import {
  TableHeaderRendererComponent
} from '../../../../projects/eyc-regulatory-reporting/src/lib/shared/table-header-renderer/table-header-renderer.component';

@Component({
  selector: 'app-archived-notifications',
  templateUrl: './archived-notifications.component.html',
  styleUrls: ['./archived-notifications.component.scss']
})
export class ArchivedNotificationsComponent implements OnInit {

  public notificationsData = JSON.parse(localStorage.getItem('notifications')).filter(item => item.status === 'Archived');
  public columnDefs = [
    {
      headerComponentFramework: TableHeaderRendererComponent,
      headerName: 'Subject',
      field: 'title',
      sortable: true,
      filter: false,
      wrapText: true,
      autoHeight: true,
      width: 350,
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
      width: 150,

    },
    {
      headerComponentFramework: TableHeaderRendererComponent,
      headerName: 'Received on',
      field: 'received',
      sortable: true,
      filter: false,
      wrapText: true,
      autoHeight: true,
      width: 150
    },
    {
      width: 80,
      headerComponentFramework: TableHeaderRendererComponent,
      headerName: 'Actions',
      field: 'Actions',
      sortable: false,
      filter: false,
    },
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
