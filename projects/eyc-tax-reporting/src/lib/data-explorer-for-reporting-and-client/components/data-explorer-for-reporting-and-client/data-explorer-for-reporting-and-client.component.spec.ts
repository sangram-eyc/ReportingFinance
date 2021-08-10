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
import { BehaviorSubject, of } from 'rxjs';
import { MotifFormsModule } from '@ey-xd/ng-motif';



describe('DataExplorerForReportingAndClientComponent', () => {
  let component: DataExplorerForReportingAndClientComponent;
  let fixture: ComponentFixture<DataExplorerForReportingAndClientComponent>;
  let router = {
    navigate: jasmine.createSpy('navigate')
  }
  const routerEvent$ = new BehaviorSubject<RouterEvent>(null);
  let testBedService: EycPbiService;
  let regulatoryReportingService: RegulatoryReportingFilingService
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataExplorerForReportingAndClientComponent ],
      imports: [RouterTestingModule, HttpClientTestingModule, FormsModule, ReactiveFormsModule, MotifFormsModule],
      providers: [{provide: Router, useValue: router},
        {provide:"apiEndpoint",  useValue: environment.apiEndpoint},
        {provide:"rrproduction",  useValue: environment.production}, EycPbiService, EycRrSettingsService, RegulatoryReportingFilingService]
    })
    .compileComponents();
    testBedService = TestBed.get(EycPbiService)
    regulatoryReportingService = TestBed.get(RegulatoryReportingFilingService)

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


  // it('filingId valuchanges', () => {
  //   let response = "FormPF"
  //   regulatoryReportingService.setfilingData = {filingName : "FormPF", period: "Q3 2021"}
  //   component.isUserInDataExplorerPage = true;
  //   component.filingDetails = { filingName: "FormPF", period: "Q3 2021" };
  //   component.filingList = 
  //   // spyOn(component.form.valueChanges, 'filingId').and.returnValue(Observable.of('hello'));
  //   component.form.get('filingId').valueChanges.subscribe( res => {

  //   })
  //   component.ngOnInit();
  //   expect(component.filingList).toBeDefined();
  // });


  it('get filing names', () => {
    let response = {
      "success": true,
      "message": "",
      "corelationId": null,
      "data": [
        {
          "filingName": "FDI",
          "formId": 2
        },
        {
          "filingName": "Form PF-Hedge Fund",
          "formId": 1
        },
        {
          "filingName": "FormPF",
          "formId": 3
        }
      ],
      "error": null
    }
    component.filingList = response['data'];
    regulatoryReportingService.setfilingData = {filingName : "FormPF", period: "Q3 2021"}
    component.isUserInDataExplorerPage = true;
    component.filingDetails = { filingName: "FormPF", period: "Q3 2021" };
    
    spyOn(testBedService, 'getFilingNames').and.returnValue(of(response));

    // component.form.get('filingId').valueChanges.subscribe(res => {
    //   console.log("formid res",res);
      
    //   component.filingName = component.filingList.find(item => item.filingName === res);
    //   expect(component.filingName).toEqual({
    //     "filingName": "FormPF",
    //     "formId": 3
    //   })
    // })
    component.ngOnInit();
    expect(component.filingList).toBeDefined();
  });

  it('getFilingData else ', () => {
    let response = {
      "success": true,
      "message": "",
      "corelationId": null,
      "data": [
        {
          "filingName": "FDI",
          "formId": 2
        },
        {
          "filingName": "Form PF-Hedge Fund",
          "formId": 1
        },
        {
          "filingName": "HK-QS",
          "formId": 3
        }
      ],
      "error": null
    }
    component.filingDetails = { filingName: "FormPF", period: "Q3 2021" };
    spyOn(testBedService, 'getFilingNames').and.returnValue(of(response));
    component.ngOnInit();
    expect(component.filingList).toBeDefined();
  })

  // it('filingModelChanged should assign value to selectedFiling', () => {
  //   let event = "CPO-PQR";
  //   component.filingModelChanged(event);
  //   expect(component.selectedFiling).toBe(event);
  // });

  it('should navigate back to regulatory-reporting or client-review', () => {
    component.back()
    expect(router.navigate).toHaveBeenCalledWith(['/regulatory-reporting']);
  })


  it('getPBIQuestions', () => {
    let response = {
      "success": true,
      "message": "",
      "corelationId": null,
      "data": [
        {
          "questionName": "Question 1",
          "id": 2
        },
        {
          "questionName": "Question 2",
          "id": 1
        },
        {
          "questionName": "Question 3",
          "id": 3
        }
      ],
      "error": null
    }
    component.filingName = {formId: 1};
    component.filingDetails = { filingName: "FormPF", period: "Q3 2021" };
    spyOn(testBedService, 'getPBIQuestion').and.returnValue(of(response));
    component.getPBIQuestions();
    expect(component.pbiQuestionList).toBeDefined();
  });

  it('getPeriods', () => {
    let response = {
      "success": true,
      "message": "",
      "corelationId": null,
      "data": [
        {
          "questionName": "Question 1",
          "id": 2
        },
        {
          "questionName": "Question 2",
          "id": 1
        },
        {
          "questionName": "Question 3",
          "id": 3
        }
      ],
      "error": null
    }
    component.filingName = {formId: 1, filingName: 'FormPF'};
    component.filingDetails = { filingName: "FormPF", period: "Q3 2021" };
    spyOn(testBedService, 'getPeriods').and.returnValue(of(response));
    component.getPeriods();
    expect(component.periodList).toBeDefined();
  });

  
  it('getPBIReportIDByFilingIdQuestionId', () => {
    let response = {
      "success": true,
      "message": "",
      "corelationId": null,
      "data": "sdgdfgdfgdfgbdbd",
      "error": null
    }
    component.filingName = {formId: 1, filingName: 'FormPF'};
    component.filingDetails = { filingName: "FormPF", period: "Q3 2021" };
    spyOn(testBedService, 'getPBIReportIDByFilingIdQuestionId').and.returnValue(of(response));
    component.getPowerBIReportID();
    expect(component.PBIReportId).toBeDefined();
  });

  it('getFilingNames ', () => {
    let response = {
      "success": true,
      "message": "",
      "corelationId": null,
      "data": [
        {
          "filingName": "FDI",
          "formId": 2
        },
        {
          "filingName": "Form PF-Hedge Fund",
          "formId": 1
        },
        {
          "filingName": "HK-QS",
          "formId": 3
        }
      ],
      "error": null
    }
    component.filingDetails = { filingName: "FormPF", period: "Q3 2021" };
    spyOn(testBedService, 'getFilingNames').and.returnValue(of(response));
    component.getFilingNames();
    expect(component.filingList).toBeDefined();
  })
});
