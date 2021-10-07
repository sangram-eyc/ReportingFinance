import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-notification',
  templateUrl: './dashboard-notification.component.html',
  styleUrls: ['./dashboard-notification.component.scss']
})
export class DashboardNotificationComponent implements OnInit {
  searchModel= '';
  searchTypeHead=[];
  constructor() { }

  ngOnInit(): void {
  }

}
