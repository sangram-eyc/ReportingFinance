import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { PermissionService } from 'eyc-ui-shared-component';

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

  constructor(
    private router: Router,
    public permissions: PermissionService,
  ) {
  }

  ngOnInit(): void {

    if (this.pageName == 'dataIntake') {
      this.tabIn = 1
    }
  }

  reportTabChange(selectedTab) {
    if (selectedTab == 3) {
      this.showPopup = true;
    } else {
      this.showPopup = false;
    }
    this.tabIn = selectedTab;
    this.messageEvent.emit(this.tabIn)
  }

  dataExplorer() {
    this.router.navigate(['/data-explorer'])
  }
}
