import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {PermissionService} from 'eyc-ui-shared-component';
import {
  RegulatoryReportingFilingService
} from '../../../regulatory-reporting-filing/services/regulatory-reporting-filing.service';
import {TopsideService} from '../../../topsides/services/topside.service';

@Component({
  selector: 'lib-reporting-tabs-card',
  templateUrl: './reporting-tabs-card.component.html',
  styleUrls: ['./reporting-tabs-card.component.scss']
})
export class ReportingTabsCardComponent implements OnInit {


  @Output() messageEvent = new EventEmitter<string>();
  @Input() isDataInteake = false;
  @Input() pageName;
  @Input() tabIn: any = 2;
  @Input() dataExpPermission = true;

  showPopup: boolean;
  processingStatus = null;
  generateInterval;

  constructor(
    private router: Router,
    private topsideService: TopsideService,
    private fillingService: RegulatoryReportingFilingService,
    public permissions: PermissionService,
  ) {
  }

  ngOnInit(): void {
    if (this.pageName == 'dataIntake') {
      this.tabIn = 1;
    }
  }

  reportTabChange(selectedTab) {
    if (selectedTab == 3) {
      this.showPopup = true;
      this.topsideService.getLastTopside(this.fillingService.getFilingData.filingId).subscribe((res: any) => {
        this.processingStatus = res.processingStatus;
      });
    } else {
      this.showPopup = false;
    }
    this.tabIn = selectedTab;
    this.messageEvent.emit(this.tabIn);
  }

  startProcessing() {
    this.topsideService.startProcessing(this.fillingService.getFilingData.period, this.fillingService.getFilingData.filingName, this.fillingService.getFilingData.filingId).subscribe((res: any) => {
      this.processingStatus = res.processingStatus;
    });
    clearInterval(this.generateInterval);
    setInterval(() => {
      this.topsideService.getLastTopside(this.fillingService.getFilingData.filingId).subscribe((res: any) => {
        this.processingStatus = res.processingStatus;
      });
    }, 20000);
  }

  generateTemplate() {
    this.topsideService.generateTemplate(this.fillingService.getFilingData.period, this.fillingService.getFilingData.filingName, this.fillingService.getFilingData.filingId).subscribe((res: any) => {
      this.processingStatus = res.processingStatus;
    });
    this.generateInterval = setInterval(() => {
      this.topsideService.getLastTopside(this.fillingService.getFilingData.filingId).subscribe((res: any) => {
        this.processingStatus = res.processingStatus;
      });
    }, 20000);
  }

  dataExplorer() {
    this.router.navigate(['/data-explorer']);
  }
}