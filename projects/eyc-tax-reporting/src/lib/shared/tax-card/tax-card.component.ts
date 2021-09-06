import { Component, OnInit, Input, SimpleChanges, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ManagementReportsService } from '../../tax-reporting/services/management-reports.service';

@Component({
  selector: 'app-tax-card',
  templateUrl: './tax-card.component.html',
  styleUrls: ['./tax-card.component.scss']
})
export class TaxCardComponent implements OnInit {

  private _reportData;
  innerWidth: any;
  reportWidth = 15;
  periodWidth = 10;

  author = '';
  name = '';
  createdDate = '';
  downloadUrl = '';
  
  @Input()
  set reportData(reportData: object) {
    this._reportData = reportData;
    this.name = this._reportData.name;
    this.author = this._reportData.author;
    this.createdDate = this._reportData.createdDate;
    this.downloadUrl = this._reportData.downloadUrl;
    
 /* 
    this.formatDate();
    this.setStatus(); */
  };
 
  constructor(
    private router: Router,
    private reportService: ManagementReportsService
  ) { }

  ngOnInit(): void {
    console.log(window.innerWidth);
    this.innerWidth = window.innerWidth;
    if(this.innerWidth > 850 && this.innerWidth < 1000) {
      this.reportWidth = 25;
      this.periodWidth = 20
    } else if(this.innerWidth > 1200 && this.innerWidth < 1950) {
      this.reportWidth = 25;
      this.periodWidth = 16
    } else if (this.innerWidth > 1950 && this.innerWidth < 2600) {
      this.reportWidth = 30;
      this.periodWidth = 20
    }else {
      this.reportWidth = 15;
      this.periodWidth = 10
    }
  }


  sortStates(a, b) {
    let stage1 = a.displayOrder;
    let stage2 = b.displayOrder;

    if (stage1 > stage2) {
      return 1;
    } else if (stage1 < stage2) {
      return -1;
    } else {
      return 0;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    console.log(this.innerWidth);
    if(this.innerWidth > 850 && this.innerWidth < 1000) {
      this.reportWidth = 25;
      this.periodWidth = 20
    } else if(this.innerWidth > 1200 && this.innerWidth < 1950) {
      this.reportWidth = 25;
      this.periodWidth = 16
    } else if (this.innerWidth > 1950 && this.innerWidth < 2600) {
      console.log("inside 1600");
      this.reportWidth = 30;
      this.periodWidth = 20
    }else {
      this.reportWidth = 15;
      this.periodWidth = 10
    }
  }
}
