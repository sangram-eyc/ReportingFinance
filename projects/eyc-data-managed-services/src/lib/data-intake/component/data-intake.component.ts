import { Component, OnInit } from '@angular/core';
import { DataManagedService } from '../services/data-managed.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'lib-data-intake',
  templateUrl: './data-intake.component.html',
  styleUrls: ['./data-intake.component.scss']
})
export class DataIntakeComponent implements OnInit {
  tabIn: number = 1;
  innerTabIn: number = 1;
  activeReports: any;
  
  // totalFileCount=50;
  totalFileCount=0;

  activeReportsSearchNoDataAvilable: boolean;
  noActivatedDataAvilable: boolean;
  searchNoDataAvilable: boolean;

  dataFetch: number[];
  fileSummaries = [];
  curDate;
  presentDate;

  constructor(private dataManagedService: DataManagedService) { }

  ngOnInit(): void {
    this.curDate = formatDate(new Date(), 'MMMM  yyyy', 'en');
    this.presentDate =  new Date();
    this.getFileSummuries();
  }

  reportTabChange(selectedTab) {
    this.tabIn = selectedTab;
  }
  innerTabChange(selectedTab) {
    this.innerTabIn = selectedTab;
  }

  getFileSummuries() {
    this.dataManagedService.getFileSummaryList().subscribe(dataSummuries => {
      this.fileSummaries = dataSummuries.data['dataSeries'];
      // this.fileSummaries = [{ "label": "No Issue", "value": 400 }, { "label": "Medium / low priority issues", "value": 50 }, { "label": "High priority issues", "value": 50 }, { "label": "Missing files, past due", "value": 50 }, { "label": "Files not received", "value": 50 }];
    });
  }
  dateSub(presentDate) {
    let curDateVal = presentDate;
    curDateVal.setMonth(curDateVal.getMonth() - 1);
    this.curDate = formatDate(curDateVal, 'MMMM  yyyy', 'en');

  }
  dateAdd(presentDate) {
    let curDateVal = presentDate;
    curDateVal.setMonth(curDateVal.getMonth() + 1);
    this.curDate = formatDate(curDateVal, 'MMMM  yyyy', 'en');
  }

}
