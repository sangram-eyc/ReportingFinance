import { HttpClientModule, HttpHandler } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { UpdateFilingService } from '../services/update-filing.service';

import { UpdateFilingPropertiesComponent } from './update-filing-properties.component';

describe('UpdateFilingPropertiesComponent', () => {
  let component: UpdateFilingPropertiesComponent;
  let fixture: ComponentFixture<UpdateFilingPropertiesComponent>;
  const routerStub = {
    navigate: () => { }
  };

  let mockResp = {
    data: {
      "filerTypes": ['PF', 'Loan'],
      "filingDisplayName": null,
      "formId": 72,
      "stagesByType": {
        "Filing": [],
        "Filing Entity": [],
        "Fund Scoping": [],
      }
    }
  }
  const updateFilingServiceStub = {
    getStages: () => {
      return of({})
    },
    getData: () => {
      return of({})
    },
    getFilingDetails: () => {
      return of(mockResp)
    },
    getPBIMappingDetails: () => {
      return of({
        data: {
          questionPbiMap: ''
        }
      })
    },
    getPBIQuestionList: () => {
      return of({})
    },

    addPBIMapping: () => {
      return of({})
    },

    updateStaticData:()=>{}
  }
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
      declarations: [UpdateFilingPropertiesComponent],
      providers: [HttpHandler, BrowserDynamicTestingModule,
        FormBuilder,
        { provide: Router, useValue: routerStub },
        { provide: UpdateFilingService, useValue: updateFilingServiceStub }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateFilingPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

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
    expect(component.filingStagesList).toEqual(mockData['data'])
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
    expect(component.scopingStagesList).toEqual(mockData['data'])
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
    expect(component.entityStagesList).toEqual(mockData['data'])
  })

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

  it('enableEditForm method should enable edit form', () => {
    component.disableAddMemberButton = false;
    component.enableEditForm();
    expect(component.enableEditor).toEqual(true);
    expect(component.disableAddMemberButton).toEqual(true);
  });

  it('cancelForm method should ', () => {
    component.backendFilingInfo = {
      "filerTypes": ['Data', 'PF'],
      "formId": 36,
      "stagesByType": {
        "Filing": [{
          'displayOrder': 5,
          'stageCode': 'SUBMISSION',
          'stageName': 'Submission',
          'stageType': 'Filing'
        }],
        "Filing Entity": [{
          "displayOrder": 1,
          "stageCode": 'REPORTING',
          "stageName": 'Reporting',
          "stageType": 'Filing Entity'
        }],
        "Fund Scoping": [{
          "displayOrder": 1,
          "stageCode": 'EY_REVIEW',
          "stageName": 'EY Review',
          "stageType": 'Fund Scoping'
        }]
      }
    }

    let mockData = {
      filerType: "Data,PF",
      filingStage: ['SUBMISSION'],
      scopingStages: ['EY_REVIEW'],
      entityStages: ['REPORTING']
    }
    spyOn(component['editForm'], 'patchValue');
    spyOn(component, 'mapStageData');
    component.filingStages = []
    component.cancelForm();
    expect(component.mapStageData).toHaveBeenCalled();
    //expect(component.editForm.patchValue).toHaveBeenCalledWith(mockData);
  });

  it('updateDataToDisplayandForm method should update data to display', () => {
    let mockBackendFilingInfo = {
      "filerTypes": ['Data', 'PF'],
      "formId": 36,
      "stagesByType": {
        "Filing": [{
          'displayOrder': 5,
          'stageCode': 'SUBMISSION',
          'stageName': 'Submission',
          'stageType': 'Filing'
        }],
        "Filing Entity": [{
          "displayOrder": 1,
          "stageCode": 'REPORTING',
          "stageName": 'Reporting',
          "stageType": 'Filing Entity'
        }],
        "Fund Scoping": [{
          "displayOrder": 1,
          "stageCode": 'EY_REVIEW',
          "stageName": 'EY Review',
          "stageType": 'Fund Scoping'
        }]
      }
    }

    let mockFilingInfo = {
      entityStages: ['Reporting'],
      filerType: ['Data', 'PF'],
      filingName: "AIFMD",
      filingStage: ['Submission'],
      scopingStages: ['EY Review'],
    }

    component.backendFilingInfo = {
      "filerTypes": ['Data', 'PF']
    }
    spyOn(component, 'mapStageData');
    component.updateDataToDisplayandForm(mockBackendFilingInfo);
    expect(component.mapStageData).toHaveBeenCalled();
  });

  it('mapStageData mthod should return stages By Type', () => {
    let mockStagesByType = {
      "Filing": [{
        'displayOrder': 5,
        'stageCode': 'SUBMISSION',
        'stageName': 'Submission',
        'stageType': 'Filing'
      }],
      "Filing Entity": [{
        "displayOrder": 1,
        "stageCode": 'REPORTING',
        "stageName": 'Reporting',
        "stageType": 'Filing Entity'
      }],
      "Fund Scoping": [{
        "displayOrder": 1,
        "stageCode": 'EY_REVIEW',
        "stageName": 'EY Review',
        "stageType": 'Fund Scoping'
      }]
    };
    let res = component.mapStageData(mockStagesByType, 'Filing', 'stageCode');
    expect(res).toEqual(['SUBMISSION'])
  });

  it('mapStageData mthod should return empty array if type not found', () => {
    let mockStagesByType = {
      "Filing Entity": [{
        "displayOrder": 1,
        "stageCode": 'REPORTING',
        "stageName": 'Reporting',
        "stageType": 'Filing Entity'
      }],
      "Fund Scoping": [{
        "displayOrder": 1,
        "stageCode": 'EY_REVIEW',
        "stageName": 'EY Review',
        "stageType": 'Fund Scoping'
      }]
    };
    let res = component.mapStageData(mockStagesByType, 'Filing', 'stageCode');
    expect(res).toEqual([])
  });

  it('backtoLandingPage method should navigate to landing page', () => {
    spyOn(sessionStorage, 'setItem');
    spyOn(component['location'], 'back');
    component.backtoLandingPage();
    expect(sessionStorage.setItem).toHaveBeenCalled();
    expect(component['location'].back).toHaveBeenCalled();
  })

  it('adminTabChange method should update tab', () => {
    component.adminTabChange(3);
    expect(component.tabIn).toEqual(3)
  });

  it('editAct method should return action section template', () => {
    component.editAct(event as any);
  });

  it('editReportID method should return report id section template', () => {
    component.editReportID(event as any);
  });

  it('addPBIReport should show add PBI report modal', () => {
    spyOn(component, 'onCancelReportID');
    component.showAddPBIReportModal = false;
    component.addPBIReport(event as any);
    expect(component.onCancelReportID).toHaveBeenCalled();
    expect(component.showAddPBIReportModal).toEqual(true)
  });

  it('closeAddQuestionModal should hide add PBI report modal', () => {
    component.showAddPBIReportModal = true;
    component.closeAddQuestionModal();
    expect(component.showAddPBIReportModal).toEqual(false)
  });

  it('enableEditReportId should enable dit report ID', () => {
    component.enableEditReportID = false;
    component.enableEditReportId();
    expect(component.enableEditReportID).toEqual(true)
  });

  it('onCancelReportID should set PBI mapping data', () => {
    component.enableEditReportID = true;
    component.storePBIMappingData = [
      { name: 'PBI DATA' }
    ]
    component.onCancelReportID();
    expect(component.enableEditReportID).toEqual(false)
    expect(component.PBIMappingData).toEqual([{ name: 'PBI DATA' }])
  });

  it('onChangeQuestionSwitch should reset PBI report form', () => {
    spyOn(component['addPBIReportForm'], 'reset');
    component.onChangeQuestionSwitch(event as any);
    expect(component['addPBIReportForm'].reset).toHaveBeenCalled()
  });

  it('onChangeEditReportID method should push que to invalidEditReportIDs ', () => {
    let data = {
      qustion: "AIF 001-013",
      e: false
    }

    component.invalidEditReportIDs = ["AIF 001-011"];
    component.onChangeEditReportID("AIF 001-013", true);
    expect(component.invalidEditReportIDs).toEqual(["AIF 001-011", "AIF 001-013"])
  })

  it('onChangeEditReportID method should ', () => {
    component.invalidEditReportIDs = ["AIF 001-011"];
    component.onChangeEditReportID("AIF 001-013", false);
  });

  it('onSubmitNewQuestion method should submit new question', fakeAsync(() => {
    component.filingData = {
      formId: 36
    }
    let mockObj = {
      reportID: '61f1aa60-5953-4e0b-a887-e98bdf20ecebb',
      question: 'AIF 002-011'
    }

    let mockMappingDataObj = {
      formId: 36,
      questionPbiMap: {
        'AIF 002-011': '61f1aa60-5953-4e0b-a887-e98bdf20ecebb'
      }
    }

    let mockResp = {
      data: {
        questionPbiMap: [
          {
            name: "AIF 002-011",
            pbiReportId: "61f1aa60-5953-4e0b-a887-e98bdf20ecebb"
          }
        ]
      }
    }

    component.PBIMappingData = [
      { name: 'AIF 001-013', pbiReportId: '61f1aa60-5953-4e0b-a887-e98bdf20ecefd' },
      { name: 'AIF 014-015', pbiReportId: '8ec43f2f-e817-4f6e-98fa-a2a328ba86a9hh' }
    ]
    spyOn(component['addPBIReportForm'], 'getRawValue').and.returnValue(mockObj);
    spyOn(component['service'], 'addPBIMapping').and.callFake(() => {
      return of(mockResp)
    });
    component.onSubmitNewQuestion();
    expect(component['service'].addPBIMapping).toHaveBeenCalledWith(mockMappingDataObj);
    expect(component.PBIMappingData).toEqual([
      { name: 'AIF 001-013', pbiReportId: '61f1aa60-5953-4e0b-a887-e98bdf20ecefd' },
      { name: 'AIF 014-015', pbiReportId: '8ec43f2f-e817-4f6e-98fa-a2a328ba86a9hh' },
      { name: "AIF 002-011", pbiReportId: "61f1aa60-5953-4e0b-a887-e98bdf20ecebb" }
    ])
    expect(component.showToaster).toEqual(true);
    tick(5000)
    expect(component.showToaster).toEqual(false);
  }))

  it('onSaveReportID method should update report ID', fakeAsync(() => {

    component.filingData = {
      formId: 36
    }
    component.PBIMappingData = [
      { name: 'AIF 001-013', pbiReportId: '61f1aa60-5953-4e0b-a887-e98bdf20ecefd' },
      { name: 'AIF 002-011', pbiReportId: '61f1aa60-5953-4e0b-a887-e98bdf20ecebb' }
    ]
    let mappingDataObj = {
      "formId": 36,
      "questionPbiMap": {
        'AIF 001-013': "61f1aa60-5953-4e0b-a887-e98bdf20ecefd",
        'AIF 002-011': "61f1aa60-5953-4e0b-a887-e98bdf20ecebb"
      }
    }

    let mockResp = {
      data: {
        questionPbiMap: [
          {
            name: "AIF 002-011",
            pbiReportId: "61f1aa60-5953-4e0b-a887-e98bdf20ecebb"
          }
        ]
      }
    }

    spyOn(component['service'], 'addPBIMapping').and.callFake(() => {
      return of(mockResp)
    });
    component.onSaveReportID()
    expect(component['service'].addPBIMapping).toHaveBeenCalledWith(mappingDataObj);
    expect(component.showToaster).toEqual(true);
    tick(5000)
    expect(component.showToaster).toEqual(false);
  }));

  it('onSubmitEditForm method should add static data', fakeAsync(() => {
    component.filingData = {
      filingName : 'PF Loan'
    }
    let mockFormData = {
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

    let staticDataObjToAdd ={
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
        filerType: ['PF1','PF2'],
        entityStages: ['Reporting'],
        filingStage: ['Reporting'],
        scopingStages: ['Reporting'],
      }
    }
    spyOn(component,'getSelectedStages').and.returnValue(mockFormData.filingStages);
    spyOn(component['editForm'],'getRawValue').and.returnValue(mockFormData);
    spyOn(component['service'],'updateStaticData').and.callFake(()=>{
      return of(addedStaticDataObjRes)
    });
    component.showToaster  = false;
    spyOn(component,'updateDataToDisplayandForm');
    component.onSubmitEditForm();
    expect(component['service'].updateStaticData).toHaveBeenCalledWith(staticDataObjToAdd);
    expect(component.showToaster ).toEqual(true);
    tick(5000)
    expect(component.showToaster ).toEqual(false);
    expect(component.updateDataToDisplayandForm).toHaveBeenCalled()
  }));
});
