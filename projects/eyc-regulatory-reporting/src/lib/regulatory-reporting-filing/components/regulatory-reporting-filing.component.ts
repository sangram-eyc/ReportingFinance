import { Component, OnInit } from '@angular/core';
import { FilingCardComponent } from '../../../../../../src/app/shared/filing-card/filing-card.component';
import { RegulatoryReportingFilingService } from '../services/regulatory-reporting-filing.service';

@Component({
  selector: 'lib-regulatory-reporting-filing',
  templateUrl: './regulatory-reporting-filing.component.html',
  styleUrls: ['./regulatory-reporting-filing.component.scss']
})
export class RegulatoryReportingFilingComponent implements OnInit {

  constructor(
    private filingService: RegulatoryReportingFilingService
  ) { }

  activeFilings: any[] = [];
  loading: boolean = false;

  ngOnInit(): void {
    this.getFilingsData();
    
  }

  getFilingsData() {
    this.filingService.getFilings().subscribe(resp => {
      resp['data'].forEach((item) => {
        const eachitem: any  = {
          name: item.name + ' // ' + item.period,
          dueDate: item.dueDate,
          startDate: item.startDate,
          comments: item.comments,
          status: item.status
        };
        if (eachitem.startDate !== null) {
          this.activeFilings.push(eachitem);
        }
      });
      console.log(this.activeFilings);
      console.log(this.activeFilings.length);
    });

  }


}
