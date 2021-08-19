import { Component, OnInit, Input, SimpleChanges, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { TaxReportingFilingService } from '../../tax-reporting/services/tax-reporting-filing.service';

@Component({
  selector: 'app-filing-card',
  templateUrl: './filing-card.component.html',
  styleUrls: ['./filing-card.component.scss']
})
export class FilingCardComponent implements OnInit {

  private _filingData;
  innerWidth: any;
  filingWidth = 15;
  periodWidth = 10;

  author = '';
  name = '';
  createdDate = '';
  downloadUrl = '';
  
  @Input()
  set filingData(filingData: object) {
    this._filingData = filingData;
    this.name = this._filingData.name;
    this.author = this._filingData.author;
    this.createdDate = this._filingData.createdDate;
    this.downloadUrl = this._filingData.downloadUrl;
    
 /* 
    this.formatDate();
    this.setStatus(); */
  };
 
  constructor(
    private router: Router,
    private filingService: TaxReportingFilingService
  ) { }

  ngOnInit(): void {
    console.log(window.innerWidth);
    this.innerWidth = window.innerWidth;
    if(this.innerWidth > 850 && this.innerWidth < 1000) {
      this.filingWidth = 25;
      this.periodWidth = 20
    } else if(this.innerWidth > 1200 && this.innerWidth < 1950) {
      this.filingWidth = 25;
      this.periodWidth = 16
    } else if (this.innerWidth > 1950 && this.innerWidth < 2600) {
      this.filingWidth = 30;
      this.periodWidth = 20
    }else {
      this.filingWidth = 15;
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
      this.filingWidth = 25;
      this.periodWidth = 20
    } else if(this.innerWidth > 1200 && this.innerWidth < 1950) {
      this.filingWidth = 25;
      this.periodWidth = 16
    } else if (this.innerWidth > 1950 && this.innerWidth < 2600) {
      console.log("inside 1600");
      this.filingWidth = 30;
      this.periodWidth = 20
    }else {
      this.filingWidth = 15;
      this.periodWidth = 10
    }
  }
}
