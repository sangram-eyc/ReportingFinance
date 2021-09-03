import { Component, OnInit, ViewChild } from '@angular/core';
import {formatDate} from '@angular/common';
import { DataIntakeLandingService } from './../services/data-intake-landing.service';
import { ProcessingExceptionService } from '../../processing-exception/services/processing-exception.service';

@Component({
  selector: 'lib-data-intake-landing',
  templateUrl: './data-intake-landing.component.html',
  styleUrls: ['./data-intake-landing.component.scss']
})
export class DataIntakeLandingComponent implements OnInit {

  curDate;
  presentDate;
  filesListArr;
  filesDatasets = {};
  commentsData;
  commentsName;
  showComments = false;
  constructor(private service: DataIntakeLandingService, public processingService: ProcessingExceptionService) { }

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

  getDataSet(event) {
    let index = event.index;
    console.log('INDEX', index);
    this.processingService.getDataSets().subscribe(res => {
      this.filesDatasets[index] = res['data'];
    },error=>{
      this.filesDatasets[index] = [];
      console.log("Dataset error");
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
  openComments(event) {
    console.log('OPEN COMMENTS');
    this.commentsData = [];
    this.commentsName = 'Data Intake';
    this.service.getComments().subscribe(res => {
      this.commentsData = res['data'];
    },error=>{
      this.commentsData =[];
      console.log("Comments error");
    });
    this.showComments = true;
  }
}
