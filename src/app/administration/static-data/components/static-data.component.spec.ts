import { HttpClient, HttpClientModule, HttpHandler } from '@angular/common/http';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StaticDataService } from '../services/static-data.service';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { StaticDataComponent } from './static-data.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EycRrApiService } from '../../services/eyc-rr-api.service';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialog, MatDialogModule, MAT_DIALOG_SCROLL_STRATEGY } from '@angular/material/dialog';
import { UpdateFilingService } from '../../update-filing-properties/services/update-filing.service';
import { of } from 'rxjs';
describe('StaticDataComponent', () => {
  let component: StaticDataComponent;
  let fixture: ComponentFixture<StaticDataComponent>;
  const routerStub = {
    navigate: () => { }
  };
  const staticDataServiceStub = {
    getStages: () => {
      return of({})
    },

    getStaticData: () => {
      return of({})
    },

    addStaticData:()=>{
      return of({})
    }
  }
  const updateFilingServiceStub = {}
  const permissionServiceStub = {}

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MatDialogModule,
        HttpClientModule,
        ReactiveFormsModule,
        BrowserDynamicTestingModule,
        BrowserAnimationsModule,
        FormsModule
      ],
      declarations: [StaticDataComponent],
      providers: [HttpHandler, BrowserDynamicTestingModule,
        FormBuilder,
        { provide: StaticDataService, useValue: staticDataServiceStub },
        { provide: Router, useValue: routerStub },
        { provide: UpdateFilingService, useValue: updateFilingServiceStub }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaticDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnChanges should set filings and stages data', () => {
    component.tabHighlighted = 3;
    spyOn(component, 'getStaticData');
    spyOn(component, 'getFilingStages');
    spyOn(component, 'getScopingStages');
    spyOn(component, 'getEntityStages');
    component.ngOnChanges();
    expect(component.getStaticData).toHaveBeenCalled()
    expect(component.getFilingStages).toHaveBeenCalled()
    expect(component.getScopingStages).toHaveBeenCalled()
    expect(component.getEntityStages).toHaveBeenCalled()
  });

  it('ngOnChanges should not set filings and stages data', () => {
    component.tabHighlighted = 2;
    spyOn(component, 'getStaticData');
    spyOn(component, 'getFilingStages');
    spyOn(component, 'getScopingStages');
    spyOn(component, 'getEntityStages');
    component.ngOnChanges();
    expect(component.getStaticData).not.toHaveBeenCalled()
    expect(component.getFilingStages).not.toHaveBeenCalled()
    expect(component.getScopingStages).not.toHaveBeenCalled()
    expect(component.getEntityStages).not.toHaveBeenCalled()

  })

  it('should call getFilingStages method and set filing stages', () => {
    let mockData = {
      "data": [
        {
          "stageId": 0,
          "stageCode": "FUND_SCOPING",
          "stageName": "Scoping",
          "displayOrder": 1
        }
      ]
    }
    spyOn(component['service'], 'getStages').and.callFake(() => {
      return of(mockData)
    });
    component.getFilingStages();
    expect(component['service'].getStages).toHaveBeenCalledWith('Filing');
    expect(component.filingStages).toEqual(mockData['data'])
  })

  it('should call getScopingStages method and set scoping stages', () => {
    let mockData = {
      "data": [
        {
          "stageId": 0,
          "stageCode": "FUND_SCOPING",
          "stageName": "Scoping",
          "displayOrder": 1
        }
      ]
    }
    spyOn(component['service'], 'getStages').and.callFake(() => {
      return of(mockData)
    });
    component.getScopingStages();
    expect(component['service'].getStages).toHaveBeenCalledWith('Fund Scoping');
    expect(component.scopeStages).toEqual(mockData['data'])
  })

  it('should call getEntityStages method and set entity stages', () => {
    let mockData = {
      "data": [
        {
          "stageId": 0,
          "stageCode": "EY_REVIEW",
          "stageName": "EY Review",
          "displayOrder": 1
        }
      ]
    }
    spyOn(component['service'], 'getStages').and.callFake(() => {
      return of(mockData)
    });
    component.getEntityStages();
    expect(component['service'].getStages).toHaveBeenCalledWith('Filing Entity');
    expect(component.filingEntitiyStages).toEqual(mockData['data'])
  })

  it('should call getStaticData method and set static data', () => {
    let mockData = {
      data: [{
        filingName: 'PF Filing',
        formId: 11,
        approved: false
      }]
    }
    spyOn(component['service'], 'getStaticData').and.callFake(() => {
      return of(mockData)
    });

    component.getStaticData();
    expect(component['service'].getStaticData).toHaveBeenCalled();
    expect(component.activeFilings).toEqual([{ filingName: 'PF Filing', formId: 11, approved: false }])
  })

  it('addnewFiling should show  add filing form', () => {
    component.showAddFilingForm = false;
    component.addnewFiling()
    expect(component.showAddFilingForm).toEqual(true)
  })

  it('closeAddFilingModal should hide add filing form', () => {
    component.showAddFilingForm = true;
    component.closeAddFilingModal()
    expect(component.showAddFilingForm).toEqual(false)
  })

  it('noWhiteSpaceValidator method should return validation', () => {
    const mockData = {
      value: 'abcde'
    }
    let result = component.noWhitespaceValidator(mockData as FormControl);
    expect(result).toEqual(null)
  });

  it('noWhiteSpaceValidator method should return validation with whitespace', () => {
    const mockData = {
      value: ' '
    }
    let result = component.noWhitespaceValidator(mockData as FormControl);
    expect(result).toEqual({ whitespace: true })
  });


  it('getFilerTypes method should return splitted filerTypes array', () => {
    let mockFilerTypes = "Loan,PF";
    let splittedFilerTypes = component.getFilerTypes(mockFilerTypes);
    expect(splittedFilerTypes).toEqual(['Loan', 'PF'])
  });

  it('getSelectedStages method should return selected stages for submit api call', () => {
    let mockStagesCodes = ['DATA_INTAKE', 'REPORTING'];
    let mockAllStages = [
      {
        "stageId": 0,
        "stageCode": "FUND_SCOPING",
        "stageName": "Scoping",
        "displayOrder": 1
      },
      {
        "stageId": 0,
        "stageCode": "DATA_INTAKE",
        "stageName": "Intake",
        "displayOrder": 2
      },
      {
        "stageId": 0,
        "stageCode": "REPORTING",
        "stageName": "Reporting",
        "displayOrder": 3
      }
    ];
    let mockStageType = 'Filing';

    let mockSelectedStages = [
      {
        "displayOrder": 2,
        "stageCode": "DATA_INTAKE",
        "stageName": "Intake",
        "stageType": "Filing"
      },
      {
        "displayOrder": 3,
        "stageCode": "REPORTING",
        "stageName": "Reporting",
        "stageType": "Filing"
      }
    ]
    let selectedSTages = component.getSelectedStages(mockStagesCodes, mockAllStages, mockStageType);
    expect(selectedSTages).toEqual(mockSelectedStages);
  });

  it('onSubmitAddFiling method should call api and add new static data', fakeAsync(() => {
    let mockFormData = {
      displayName: 'PF Loan',
      filerType: 'PF1,PF2',
      filingStages: [{
        "displayOrder": 3,
        "stageCode": "REPORTING",
        "stageName": "Reporting",
        "stageType": "Filing"
      }],
      scopeStages: [{
        "displayOrder": 3,
        "stageCode": "REPORTING",
        "stageName": "Reporting",
        "stageType": "Filing"
      }],
      filingEntitiyStages: [{
        "displayOrder": 3,
        "stageCode": "REPORTING",
        "stageName": "Reporting",
        "stageType": "Filing"
      }]
    }

    let newStaticDataObjToAdd ={
      'filingDisplayName': 'PF Loan',
      'filerTypes': ['PF1','PF2'],
      'stagesList': [{
        "displayOrder": 3,
        "stageCode": "REPORTING",
        "stageName": "Reporting",
        "stageType": "Filing"
      },{
        "displayOrder": 3,
        "stageCode": "REPORTING",
        "stageName": "Reporting",
        "stageType": "Filing"
      },{
        "displayOrder": 3,
        "stageCode": "REPORTING",
        "stageName": "Reporting",
        "stageType": "Filing"
      }]
    }

    let addedStaticDataObjRes = {
      data : {
        filingDisplayName : 'PF Loan',
        formId:101,
        approved : true
      }
    }
    spyOn(component,'getSelectedStages').and.returnValue(mockFormData.filingStages);
    spyOn(component['addFilingForm'],'getRawValue').and.returnValue(mockFormData);
    spyOn(component['service'],'addStaticData').and.callFake(()=>{
      return of(addedStaticDataObjRes)
    });
    component.showToastAfterFilingAdded = false;
    component.onSubmitAddFiling({} as FormGroup);
    expect(component['service'].addStaticData).toHaveBeenCalledWith(newStaticDataObjToAdd);
    expect(component.activeFilings).toEqual([{filingName : 'PF Loan',formId:101,approved : true}])
    expect(component.showToastAfterFilingAdded).toEqual(true);
    tick(5000)
    expect(component.showToastAfterFilingAdded).toEqual(false);
  }));

  it('onClickView method should navigate to update-filing details page',()=>{
    spyOn(component['router'],'navigate');
    let mockData = {
      filingDisplayName : 'PF Loan',
      formId:101,
      approved : true
    }
    component.onClickView(mockData);
    expect(component['updateFilingService'].setData).toEqual(mockData);
    expect(component['router'].navigate).toHaveBeenCalledWith(['/update-filing'])
  });

  xit('onPasteSearchStaticData method should search data on paste',()=>{
    let data = {
      clipboardData : {
        getData:()=>{ 'text'}
      }
    }
    component.onPasteSearchStaticData(data as unknown as ClipboardEvent);
  });

  it('searchFilingValidation method should validate search and retrun false',()=>{
    let data = {
      keyCode:'abcd',
      preventDefault:()=>{}
    }
    spyOn(data,'preventDefault')
    let result = component.searchFilingValidation(data);
    expect(data.preventDefault).toHaveBeenCalled();
    expect(result).toEqual(false)
  })
  it('searchFilingValidation method should validate search and return true',()=>{
    let data = {
      keyCode:'72',
      preventDefault:()=>{}
    }
    let result = component.searchFilingValidation(data);
    expect(result).toEqual(true)
  })
});
