import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'lib-data-intake',
  templateUrl: './data-intake.component.html',
  styleUrls: ['./data-intake.component.scss']
})
export class DataIntakeComponent implements OnInit {
  status = {
    stage: 'Reporting',
    progress: 'in-progress'
  };
  constructor() { }

  ngOnInit(): void {
  }

}
