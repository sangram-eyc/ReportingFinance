import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'lib-data-intake',
  templateUrl: './data-intake.component.html',
  styleUrls: ['./data-intake.component.scss']
})
export class DataIntakeComponent implements OnInit {
  tabIn: number = 1;
  activeReports: any;

  activeReportsSearchNoDataAvilable: boolean;
  noActivatedDataAvilable: boolean;
  searchNoDataAvilable: boolean;

  dataFetch: number[];
  fileSummaries = [];
  constructor() { }

  ngOnInit(): void {
    this.dataFetch = [400, 50, 50, 50, 50];
    this.fileSummaries = ["No Issue", "Medium / low priority issues", "High priority issues", "Missing files, past due", "Files not received"];
  }

  reportTabChange(selectedTab) {
    this.tabIn = selectedTab;
  }

}
