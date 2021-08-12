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
  filesListArr;
  constructor(private service: DataIntakeLandingService) { }

  ngOnInit(): void {
    this.curDate = formatDate(new Date(), 'MMMM  yyyy', 'en');
    this.getIntakeFilesList();
  }

  getIntakeFilesList() {
    this.service.getIntakeFilesList().subscribe(res => {
      this.filesListArr = res['data'];
    });
  }
}
