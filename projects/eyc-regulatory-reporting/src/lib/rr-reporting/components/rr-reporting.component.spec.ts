import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MotifCardModule, MotifButtonModule, MotifFormsModule, MotifIconModule, MotifProrgressIndicatorsModule, MotifTableModule, MotifPaginationModule } from '@ey-xd/ng-motif';
import { AgGridModule } from 'ag-grid-angular';
import { environment } from '../../../../../../src/environments/environment';
import { RegulatoryReportingFilingService } from '../../regulatory-reporting-filing/services/regulatory-reporting-filing.service';

import { RrReportingComponent } from './rr-reporting.component';
import { DotsCardComponent } from '../../shared/dots-card/dots-card.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { RrReportingService } from '../services/rr-reporting.service';

describe('RrReportingComponent', () => {
  let component: RrReportingComponent;
  let fixture: ComponentFixture<RrReportingComponent>;
  let testBedService: RrReportingService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RrReportingComponent],
      imports: [AgGridModule.withComponents([]),
        CommonModule,
        MotifCardModule,
        MotifButtonModule,
        MotifFormsModule,
        MotifIconModule,
        MotifProrgressIndicatorsModule,
        MotifTableModule,
        HttpClientModule,
        MotifPaginationModule,
        RouterTestingModule,
        HttpClientTestingModule],
      providers: [RrReportingService, RegulatoryReportingFilingService,
        { provide: "apiEndpoint", useValue: environment.apiEndpoint },
        { provide:"rrproduction",  useValue: environment.production }]
    })
      .compileComponents();
      fixture = TestBed.createComponent(RrReportingComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      testBedService = TestBed.get(RrReportingService)
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check the service', () => {
    expect(testBedService instanceof RrReportingService).toBeTruthy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('grid API is available after `detectChanges`', () => {
    fixture.detectChanges();
    expect(component.gridApi).toBeTruthy();
  });

  describe('The function onRowSelected ...', () => {
    it(`- should do something`, () => {
      component.onRowSelected({ name: 'Mock Hero' });
      expect(component).toBeTruthy();
    });
  });

  it('should get filling entities list', () => {
    let response = {
      "success": true,
      "message": "sucess",
      "data": [
        {
          "entityId": 1,
          "entityGroup": "Trust A",
          "entityName": "Alpha Corporate Bond Fund",
          "resolve_exception": "--",
          "reviewLevel": "--",
          "myTasks": "",
          "comments": [],
          "approved": false
        }]
    };
    component.filingDetails = { filingName: "FormPF", period: "Q3 2021" };
    spyOn(testBedService, 'getfilingEntities').withArgs("FormPF", "Q3 2021").and.returnValue(of(response));
    component.getFilingEntities();
    expect(component.rowData).toBeDefined();
  });

  it('receiveMessage should return tab number', () => {
    let tab = 1
    component.receiveMessage(tab)
    expect(component.tabs).toBe(tab)
  })

  it('receive filing details should return filing details', () => {
    let filing = {filingName: "FormPF", period: "Q3 2021"}
    component.receiveFilingDetails(filing)
    expect(component.filingDetails).toBe(filing)
  });

  it('onSubmitApproveFilingEntities should return approved entities', () => {
    let response = {
      "success": true,
      "message": "",
      "corelationId": null,
      "data": [
        {
          "entityId": 3,
          "entityName": "Alpha Multi Asset Fund",
          "entityGroup": "",
          "resolveException": "",
          "reviewLevel": "",
          "comments": [],
          "approved": true
        }
      ],
      "error": null
    }

    const mockData = {
      "entityIds": [3],
      "filingName": "FormPF",
      "period": "Q3 2021",
      "stage": "Reporting"
    };
    component.filingDetails = { filingName: "FormPF", period: "Q3 2021" };
    component.selectedRows = [{
      "entityId": 3,
      "entityName": "Alpha Multi Asset Fund",
      "entityGroup": "",
      "resolveException": "",
      "reviewLevel": "",
      "comments": [],
      "approved": false
    }]
    component.rowData = [{
      "entityId": 3,
      "entityName": "Alpha Multi Asset Fund",
      "entityGroup": "",
      "resolveException": "",
      "reviewLevel": "",
      "comments": [],
      "approved": false
    }]
    spyOn(testBedService, 'approvefilingEntities').withArgs(mockData).and.returnValue(of(response));
    component.onSubmitApproveFilingEntities();
    expect(component.rowData).toBeDefined();
    expect(component.selectedRows.length).toBeFalsy()
  });
});
