import { Component, OnInit } from '@angular/core';
import {formatDate} from '@angular/common';
import { DataIntakeLandingService } from './../services/data-intake-landing.service';

@Component({
  selector: 'lib-data-intake-landing',
  templateUrl: './data-intake-landing.component.html',
  styleUrls: ['./data-intake-landing.component.scss']
})
export class DataIntakeLandingComponent implements OnInit {

  curDate;
  presentDate;
  filesListArr;
  constructor(private service: DataIntakeLandingService) { }

  ngOnInit(): void {
    this.curDate = formatDate(new Date(), 'MMMM  yyyy', 'en');
    this.presentDate =  new Date();
    this.getIntakeFilesList();
  }

  getIntakeFilesList() {
    this.service.getIntakeFilesList().subscribe(res => {
      this.filesListArr = res['data'];
    });
  }

  dateSub(presentDate){
    let curDateVal = presentDate;
    curDateVal.setMonth(curDateVal.getMonth() - 1);
    this.curDate = formatDate(curDateVal, 'MMMM  yyyy', 'en');
    
  }
  dateAdd(presentDate){
    let curDateVal = presentDate;
    curDateVal.setMonth(curDateVal.getMonth() + 1);
    this.curDate = formatDate(curDateVal, 'MMMM  yyyy', 'en');
  }
}
