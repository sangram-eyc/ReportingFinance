import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {PermissionService} from 'eyc-ui-shared-component';
import {TopsideService} from "@default/services/topside.service";
import {
  RegulatoryReportingFilingService
} from "../../../regulatory-reporting-filing/services/regulatory-reporting-filing.service";

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
      this.topsideService.getLastTopside(this.fillingService.getFilingData.period, this.fillingService.getFilingData.filingName).subscribe((res: any) => {
        this.processingStatus = res.processingStatus;
      });
    } else {
      this.showPopup = false;
    }
    this.tabIn = selectedTab;
    this.messageEvent.emit(this.tabIn)
  }

  startProcessing() {
    this.topsideService.startProcessing(this.fillingService.getFilingData.period, this.fillingService.getFilingData.filingName).subscribe(res => {
    });
    setInterval(() => {
      this.topsideService.getLastTopside(this.fillingService.getFilingData.period, this.fillingService.getFilingData.filingName).subscribe((res: any) => {
        this.processingStatus = res.processingStatus;
      });
    }, 10000);
  }

  dataExplorer() {
    this.router.navigate(['/data-explorer'])
  }
}
