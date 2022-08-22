import { Component, OnInit, Input, SimpleChanges, HostListener } from '@angular/core';

@Component({
  selector: 'app-tax-card',
  templateUrl: './tax-card.component.html',
  styleUrls: ['./tax-card.component.scss']
})
export class TaxCardComponent implements OnInit {

  private _reportData;
  innerWidth: any;
  reportWidth = 25;
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
  };
 
  constructor() { }

  ngOnInit(): void {
    console.log(window.innerWidth);
    this.innerWidth = window.innerWidth;
    if(this.innerWidth > 650 && this.innerWidth < 899) {
      this.reportWidth = 40;
    }else if(this.innerWidth > 899 && this.innerWidth < 1250) {
      this.reportWidth = 35;
    } else if(this.innerWidth > 1250 && this.innerWidth < 1350) {
      this.reportWidth = 35;
    }else if(this.innerWidth > 1350 && this.innerWidth < 1700) {
      this.reportWidth = 35;
    } else if (this.innerWidth > 1701 && this.innerWidth < 1950) {
      this.reportWidth = 40;
    }else {
      this.reportWidth = 80;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    console.log('onResize innerWidth',window.innerWidth);
    this.innerWidth = window.innerWidth;
    console.log(this.innerWidth);
    this.innerWidth = window.innerWidth;
    this.innerWidth = window.innerWidth;
    if(this.innerWidth > 650 && this.innerWidth < 899) {
      this.reportWidth = 40;
    }else if(this.innerWidth > 899 && this.innerWidth < 1250) {
      this.reportWidth = 35;
    } else if(this.innerWidth > 1250 && this.innerWidth < 1350) {
      this.reportWidth = 35;
    }else if(this.innerWidth > 1350 && this.innerWidth < 1700) {
      this.reportWidth = 35;
    } else if (this.innerWidth > 1701 && this.innerWidth < 1950) {
      this.reportWidth = 40;
    }else {
      this.reportWidth = 80;
    }
  }
}
