import { Component, OnInit } from '@angular/core';
import {formatDate} from '@angular/common';

@Component({
  selector: 'lib-data-intake-landing',
  templateUrl: './data-intake-landing.component.html',
  styleUrls: ['./data-intake-landing.component.scss']
})
export class DataIntakeLandingComponent implements OnInit {

  curDate;
  constructor() { }
  ngOnInit(): void {
    this.curDate = formatDate(new Date(), 'MMMM  yyyy', 'en');
  }
}
