import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { PermissionService } from './../../services/permission.service';

@Component({
  selector: 'lib-shared-tabs',
  templateUrl: './shared-tabs.component.html',
  styleUrls: ['./shared-tabs.component.scss']
})
export class SharedTabsComponent implements OnInit {

  @Output() messageEvent = new EventEmitter<string>();
  @Input() isDataInteake = false;
  @Input() pageName;
  @Input() tabIn: any = 2;
  @Input() dataExpPermission = true;
   

  showPopup: boolean;
  tabArr: any = ['Exception Reports', 'Filing Entities'];

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
