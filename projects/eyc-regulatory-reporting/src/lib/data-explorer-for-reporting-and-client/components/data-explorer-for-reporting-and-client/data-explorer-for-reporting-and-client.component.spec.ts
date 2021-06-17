import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataExplorerForReportingAndClientComponent } from './data-explorer-for-reporting-and-client.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, RouterEvent } from '@angular/router';
import { EycPbiService } from '../../../services/eyc-pbi.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EycRrSettingsService } from '../../../services/eyc-rr-settings.service';
import { environment } from '../../../../../../../src/environments/environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegulatoryReportingFilingService } from '../../../regulatory-reporting-filing/services/regulatory-reporting-filing.service';
import { BehaviorSubject } from 'rxjs';
import { MotifFormsModule } from '@ey-xd/ng-motif';



describe('DataExplorerForReportingAndClientComponent', () => {
  let component: DataExplorerForReportingAndClientComponent;
  let fixture: ComponentFixture<DataExplorerForReportingAndClientComponent>;
  let router = {
    navigate: jasmine.createSpy('navigate')
  }
  const routerEvent$ = new BehaviorSubject<RouterEvent>(null);
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataExplorerForReportingAndClientComponent ],
      imports: [RouterTestingModule, HttpClientTestingModule, FormsModule, ReactiveFormsModule, MotifFormsModule],
      providers: [{provide: Router, useValue: router},
        {provide:"apiEndpoint",  useValue: environment.apiEndpoint},
        {provide:"rrproduction",  useValue: environment.production}, EycPbiService, EycRrSettingsService, RegulatoryReportingFilingService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    router = TestBed.get(Router);
    (<any>router).events = routerEvent$.asObservable();
    fixture = TestBed.createComponent(DataExplorerForReportingAndClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('filingModelChanged should assign value to selectedFiling', () => {
  //   let event = "CPO-PQR";
  //   component.filingModelChanged(event);
  //   expect(component.selectedFiling).toBe(event);
  // });

  it('should navigate back to regulatory-reporting or client-review', () => {
    component.back()
    expect(router.navigate).toHaveBeenCalledWith(['/regulatory-reporting']);
  })
});
