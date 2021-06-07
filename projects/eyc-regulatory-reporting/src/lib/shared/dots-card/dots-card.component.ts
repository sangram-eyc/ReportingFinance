import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { RegulatoryReportingFilingService } from '../../regulatory-reporting-filing/services/regulatory-reporting-filing.service';

@Component({
  selector: 'lib-dots-card',
  templateUrl: './dots-card.component.html',
  styleUrls: ['./dots-card.component.scss']
})
export class DotsCardComponent implements OnInit, OnChanges {

  @Input() status: Object = {
    stage: 'Submission',
    progress: 'in-progress'
  };

  @Output() filingDetails = new EventEmitter<any>();

  dueDate: string;
  filingName: string;
  period: string;
  filingId: number;
  states = [];

  constructor(
    public router: Router,
    private filingService: RegulatoryReportingFilingService
  ) { }

  ngOnInit(): void {
    this.filingService.filingData.subscribe(res => {
      if (res === null) {
        this.router.navigate(['home']);
        return;
      }
      this.dueDate = res.dueDate;
      this.filingName = res.filingName;
      this.period = res.period;
      this.filingId = res.filingId;
      this.filingDetails.emit(res);
      this.filingService.filingStatus.subscribe(res => {
        this.getFilingStatus();
      });
    });

  }

  ngOnChanges(changes: SimpleChanges) { 
  }

  setStatus() {
    this.states.sort(this.progressSort);
    this.states.forEach(state => {
      if (state.progress === 'In Progress' || state.progress === 'in-progress' || state.progress === 'IN_PROGRESS') {
        state.progress = "in-progress";
        state.disabled = false;
      } else if ((state.progress === 'Completed' || state.progress === 'completed' || state.progress === 'COMPLETED')) {
        state.progress = 'completed';
        state.disabled = false;
      } else {
        state.progress = 'not-set';
        state.disabled = true;
      }
    });
  }

  getFilingStatus(){
    this.filingService.getFilingStatus(this.filingId).subscribe(res => {
      this.states = res['data'];
      this.states.forEach(item => {
        switch (item['stageCode']) {
          case "FUND_SCOPING":
            item.customCls= 'cust-fund';
            item.url= '/fund-scoping';
            item.disabled= true;
            break;
          case "DATA_INTAKE":
            item.customCls= 'cust-intake';
            item.url= '/data-intake';
            item.disabled= true;
            break;
          case "REPORTING":
            item.customCls= 'cust-report';
            item.url= '/regulatory-reporting';
            item.disabled= true;
            break;
          case "CLIENT_REVIEW":
            item.customCls= 'cust-review';
            item.url= '/client-review';
            item.disabled= true;
            break;
          case "SUBMISSION":
            item.customCls= 'last-item-class';
            item.url= '/submission';
            item.disabled= true;
        }
      });
      this.setStatus();
    });
  }

  progressSort(a, b) {
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

  getStatus(index: number): string | null {
    return this.states[index].progress;
  }

  disState(index: number): boolean | null {
    return this.states[index].disabled;
  }

  handleStepClick(pageUrl, enableRoute) { // For clickable steps
    if (!enableRoute) { this.router.navigate([pageUrl]); }
  }

}
