import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, Renderer2, Type } from '@angular/core';
import {
  async,
  ComponentFixture,
  discardPeriodicTasks,
  fakeAsync,
  flush,
  TestBed,
  tick,
} from '@angular/core/testing';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AgGridModule } from 'ag-grid-angular';
import { environment } from '../../../../../../src/environments/environment';
import { taxenvironment } from '../../../../../../src/environments/eyc-tax-reporting/tax-environment';
import { ProductionCycleService } from '../services/production-cycle.service';
import { CycleDetailComponent } from './cycle-details.component';
import { Observable, of } from 'rxjs';
import { MotifFormsModule } from '@ey-xd/ng-motif';
import { TaxLoaderService } from '../services/tax-loader.service';
describe('EycCycleDetailsComponent', () => {
  let component: CycleDetailComponent;
  let fixture: ComponentFixture<CycleDetailComponent>;
  let productionCyclesService: ProductionCycleService;
  let fund = {
    status: 'In client review',
    openCommentsClient: 1,
    openCommentsEY: 1,
  };
  let row = { status: 'In client review' };
  let red = {
    name: 'red',
    selectable: true,
    group: 'ordinal',
    domain: ['#FF736A'],
  };
  let orange = {
    name: 'orange',
    selectable: true,
    group: 'ordinal',
    domain: ['#FF9831'],
  };
  let teal = {
    name: 'teal',
    selectable: true,
    group: 'ordinal',
    domain: ['#42C9C2'],
  };
  let productionCycleServiceStub: jasmine.SpyObj<ProductionCycleService>;
  let store = {};
  let mockedProductionCyclesDetails = {
    success: true,
    message: '',
    corelationId: null,
    data: [
      {
        name: '7047 - T. Rowe Price Global Allocation Fund',
        id: '1ASKDJ10398ASKDJO',
        hasContent: false,
        status: 'open',
        openCommentsEY: 2,
        openCommentsClient: 3,
        totalComments: 20,
        statusChangedDate: '2022-01-12T10:59:41.947+00:00',
        assignedUsers: [
          {
            userId: 123,
            userEmail: 'Jonnathan.Caballero@ey.com',
            userFirstName: 'Jonnathan',
            userLastName: 'Caballero',
          },
          {
            userId: 3303,
            userEmail: 'Gaston.Silva@email.com',
            userFirstName: 'Gaston',
            userLastName: 'Silva',
          },
          {
            userId: 3304,
            userEmail: 'Diego.Garavito@email.com',
            userFirstName: 'Diego',
            userLastName: 'Garavito',
          },
          {
            userId: 3305,
            userEmail: 'Gabriel.Loy@email.com',
            userFirstName: 'Gabriel',
            userLastName: 'Loy',
          },
          {
            userId: 2202,
            userEmail: 'Diego.Morini@ey.com',
            userFirstName: 'Diego',
            userLastName: 'Morini',
          },
        ],
      },
      {
        name: 'Fund 2',
        id: '2ASKDJ10398ASKDJO',
        hasContent: true,
        status: 'open',
        openCommentsEY: 200,
        openCommentsClient: 2,
        totalComments: 100,
        statusChangedDate: '2022-01-12T10:59:41.947+00:00',
        assignedUsers: [
          {
            userId: 123,
            userEmail: 'Jonnathan.Caballero@email.com',
            userFirstName: 'Jonnathan',
            userLastName: 'Caballero',
          },
          {
            userId: 3303,
            userEmail: 'Gaston.Silva@email.com',
            userFirstName: 'Gaston',
            userLastName: 'Silva',
          },
          {
            userId: 3304,
            userEmail: 'Diego.Garavito@email.com',
            userFirstName: 'Diego',
            userLastName: 'Garavito',
          },
        ],
      },
      {
        name: 'Fund 3',
        id: '3ASKDJ10398ASKDJO',
        hasContent: true,
        status: 'approved',
        openCommentsEY: 99,
        openCommentsClient: 660,
        totalComments: 2,
        statusChangedDate: '2022-01-12T10:59:41.947+00:00',
        assignedUsers: [
          {
            userId: 123,
            userEmail: 'Jonnathan.Caballero@email.com',
            userFirstName: 'Jonnathan',
            userLastName: 'Caballero',
          },
        ],
      },
      {
        name: 'Fund 4',
        id: '4ASKDJ10398ASKDJO',
        hasContent: true,
        status: 'open',
        openCommentsEY: '10',
        openCommentsClient: '10',
        totalComments: 30,
        statusChangedDate: '2022-01-12T10:59:41.947+00:00',
        assignedUsers: [
          {
            userId: 123,
            userEmail: 'Jonnathan.Caballero@email.com',
            userFirstName: 'Jonnathan',
            userLastName: 'Caballero',
          },
        ],
      },
      {
        name: 'Fund 5',
        id: '5ASKDJ10398ASKDJO',
        hasContent: true,
        status: 'open',
        openCommentsEY: 0,
        openCommentsClient: 5,
        statusChangedDate: '2022-01-12T10:59:41.947+00:00',
        assignedUsers: [],
      },
      {
        name: 'Fund 6',
        id: '6ASKDJ10398ASKDJO',
        hasContent: true,
        status: 'approved',
        openCommentsEY: 0,
        openCommentsClient: 0,
        statusChangedDate: '2022-01-12T10:59:41.947+00:00',
        assignedUsers: [],
      },
      {
        name: 'Fund 7',
        id: '7ASKDJ10398ASKDJO',
        hasContent: true,
        status: 'approved',
        openCommentsEY: 0,
        openCommentsClient: 0,
        statusChangedDate: '2022-01-12T10:59:41.947+00:00',
        assignedUsers: [],
      },
      {
        name: 'Fund 8',
        id: '8ASKDJ10398ASKDJ1',
        hasContent: true,
        status: 'approved',
        openCommentsEY: 0,
        openCommentsClient: 0,
        assignedUsers: [],
      },
      {
        name: 'Fund 9',
        id: '9ASKDJ10398ASKDJq',
        hasContent: true,
        status: 'open',
        openCommentsEY: 0,
        openCommentsClient: 0,
        assignedUsers: [],
      },
      {
        name: 'Fund 10',
        id: '10ASKDJ10398ASKrJO',
        hasContent: true,
        status: 'open',
        openCommentsEY: 0,
        openCommentsClient: 0,
        assignedUsers: [],
      },
      {
        name: 'Fund 11',
        id: '11ASKDJ103f8ASKDJO',
        hasContent: true,
        status: 'open',
        openCommentsEY: 0,
        openCommentsClient: 0,
        assignedUsers: [],
      },
      {
        name: 'Fund 12',
        id: '12ASKDJ10398ASKDJO',
        hasContent: true,
        status: 'open',
        openCommentsEY: 0,
        openCommentsClient: 0,
        assignedUsers: [],
      },
      {
        name: 'Fund 13',
        id: '13ASKDJ10398ASKDJO',
        hasContent: true,
        status: 'approved',
        openCommentsEY: 0,
        openCommentsClient: 1,
        assignedUsers: [],
      },
      {
        name: 'Fund 14',
        id: '14ASKDJ10398ASKDJO',
        hasContent: true,
        status: 'approved',
        openCommentsEY: 0,
        openCommentsClient: 0,
        assignedUsers: [],
      },
      {
        name: 'Fund 15',
        id: '15ASKDJ10398ASKDJO',
        hasContent: true,
        status: 'approved',
        openCommentsEY: 0,
        openCommentsClient: 0,
        assignedUsers: [],
      },
      {
        name: 'Fund 17',
        id: '17ASKDJ10398ASTTDJO',
        hasContent: true,
        status: 'OPEN',
        openCommentsEY: 0,
        openCommentsClient: 0,
        assignedUsers: [
          {
            userId: 123,
            userEmail: 'Jonnathan.Caballero@ey.com',
            userFirstName: 'Jonnathan',
            userLastName: 'Caballero',
          },
        ],
      },
      {
        name: 'Fund 18',
        id: '18ASKDJ10398PPKDJO',
        hasContent: true,
        status: 'approved',
        openCommentsEY: 0,
        openCommentsClient: 0,
        assignedUsers: [],
      },
      {
        name: 'Fund 19',
        id: '19ASKDJ10OO8ASKDJO',
        hasContent: false,
        status: 'OPEN',
        openCommentsEY: 0,
        openCommentsClient: 0,
        assignedUsers: [],
      },
      {
        name: 'Fund 20',
        id: '20ASKDJ10398ASKXJO',
        hasContent: true,
        status: 'approved',
        openCommentsEY: 0,
        openCommentsClient: 0,
        assignedUsers: [],
      },
      {
        name: 'Fund 21',
        id: '21ASKDJ1039JJSKDJO',
        hasContent: true,
        status: 'approved',
        openCommentsEY: 0,
        openCommentsClient: 0,
        assignedUsers: [],
      },
      {
        name: 'Fund 22',
        id: '22ASKDJ10398ALLDJO',
        hasContent: true,
        status: 'approved',
        openCommentsEY: 0,
        openCommentsClient: 0,
        assignedUsers: [],
      },
      {
        name: 'Fund D1',
        id: '23ASKDJ10398AJJDJO',
        hasContent: true,
        status: 'approved',
        openCommentsEY: 0,
        openCommentsClient: 0,
        assignedUsers: [],
      },
    ],
    error: null,
  };
  let mockDownloadResp = {
    success: true,
    message: '',
    corelationId: '36039d95-7078-4d2b-9d57-53efeffdb081',
    data: {
      fileUploadDTO: {
        attachmentId: null,
        blobFileName:
          'Bulk Download - 2021-12-13 16-00-52  - c4c48fc2-29d6-452d-a752-618af4e6647c.zip',
        contentType: '.zip',
        error: null,
        fileName:
          'Bulk Download - 2021-12-13 16-00-52  - c4c48fc2-29d6-452d-a752-618af4e6647c.zip',
        success: true,
        uiuuid: 'c4c48fc2-29d6-452d-a752-618af4e6647c',
        uploadTime: 15,
        url: 'https://usedeyctfastg01.blob.core.windows.net/eyc2-bulk-package-qa34/Bulk%20Download%20-%202021-12-13%2016-00-52%20%20-%20c4c48fc2-29d6-452d-a752-618af4e6647c.zip?sv=2020-08-04&se=2021-12-14T16%3A00%3A53Z&sr=b&sp=r&sig=lKEPZ8grO78HA%2B9wOEwILesJaG6b%2BBQK4FgOWknwrAI%3D',
      },
      successCount: 1,
      failureCount: 0,
    },
    error: null,
  };
  let matDialogStub = {
    open: () => {
      return { afterClosed: () => of() };
    },
  };
  let taxLoaderStub = {
    show: () => {
      return {};
    },
    hide: () => {
      return { afterClosed: () => of() };
    },
    isLoading: true,
  };
  let fb: FormBuilder;
  beforeEach(async(() => {
    productionCycleServiceStub = jasmine.createSpyObj('productcyclesService', [
      'getProductionCycles',
      'getProductionCyclesDetails',
      'getStatusTrackerLink',
      'getDownloadFile',
      'putApproveEntities',
    ]);
    TestBed.configureTestingModule({
      declarations: [CycleDetailComponent],
      imports: [
        CommonModule,
        RouterTestingModule,
        HttpClientTestingModule,
        RouterModule.forRoot([]),
        MatDialogModule,
        AgGridModule.withComponents([]),
        ReactiveFormsModule,
        FormsModule,
        MotifFormsModule,
      ],
      providers: [
        ProductionCycleService,
        {
          provide: ProductionCycleService,
          userValue: productionCycleServiceStub,
        },
        {
          provide: TaxLoaderService,
          userValue: taxLoaderStub,
        },
        { provide: 'apiEndpoint', useValue: environment.apiEndpoint },
        { provide: 'taxapiEndpoint', useValue: taxenvironment.apiEndpoint },
        { provide: 'taxProduction', useValue: taxenvironment.production },
        { provide: MatDialogRef, useValue: {} },
        { provide: MatDialog, useValue: matDialogStub },
        FormBuilder,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CycleDetailComponent);
    productionCyclesService = TestBed.get(ProductionCycleService);
    component = fixture.componentInstance;
    fb = TestBed.inject(FormBuilder);
    let mockedForm = fb.group({
      mySelect: ['EY'],
    });
    component.cycleSelectForm = mockedForm;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should check the service', () => {
    expect(
      productionCyclesService instanceof ProductionCycleService
    ).toBeTruthy();
  });
  it('ngOnInit should set variables and call getOptionsProductCycles function', () => {
    spyOn(component, 'getOptionsProductCycles');
    component.ngOnInit();
    expect(component.getOptionsProductCycles).toHaveBeenCalled();
    expect(component.colorsBarChart).toEqual(['#9C82D4', '#87D3F2', '#8CE8AD']);
    expect(component.labelsChart).toEqual([
      'In EY tax preparation',
      'In client review',
      'Approved by client',
    ]);
    expect(component.widthDivChart).toEqual(950);
  });
  it('ngAfterViewInit method should call getCompletedProductCyclesData and set downloadButton', () => {
    component.productCycleId = 1;
    spyOn(component, 'getCompletedProductCyclesData');
    component.ngAfterViewInit();
    expect(component.getCompletedProductCyclesData).toHaveBeenCalledWith(1);
  });
  it('backtoCycleView method should navigate to app-tax-reporting', () => {
    spyOn(component['router'], 'navigate');
    const url = ['app-tax-reporting'];
    component.backtoCycleView();
    expect(component['router'].navigate).toHaveBeenCalledWith(url);
  });
  it('showMyAssignedFunds method should check completedFunds, set showOnlyMyAssignedFunds and call gridFilter with filterKey', fakeAsync(() => {
    spyOn(component, 'gridFilter');
    let fakeStore = { userEmail: 'user@ey.com', pendingDownloadsBulk: '[]' };
    spyOn(window.sessionStorage, 'getItem').and.callFake((key: string) => {
      return fakeStore[key];
    });
    spyOn(document, 'querySelector').and.returnValue([
      { disabled: false },
    ] as any);
    component.completedFunds = [1];
    let filterKey = sessionStorage.getItem('userEmail');
    component.showMyAssignedFunds();
    expect(component.gridFilter).toHaveBeenCalledWith(filterKey);
    expect(sessionStorage.getItem).toHaveBeenCalledWith('userEmail');
  }));

  it('getCompletedProductCyclesData method should call details data', () => {
    spyOn(component, 'getStatusCount');
    spyOn(component, 'getFileSummuries');
    spyOn(component, 'createFundRowData');
    spyOn(component['router'], 'navigate');
    spyOn(
      component['productcyclesService'],
      'getProductionCyclesDetails'
    ).and.returnValue(of(mockedProductionCyclesDetails));
    const url = ['cycle-details', 1, 'test'];
    component.productCycleId = 1;
    component.productCycleName = 'test';
    let mockedCompletedFunds: any = [];
    let mockedOpenCommentsClientByProductCycle: any = 0;
    let mockedOpenCommentsEYByProductCycle: any = 0;
    mockedProductionCyclesDetails['data'].forEach((item) => {
      const eachitem: any = {
        name: item.name,
        hasContent: item.hasContent,
        id: item.id,
        status: component.setStatus(item.status, item.hasContent),
        approved:
          (!component.isApproved(item.status) && !item.hasContent) ||
          !component.permissionApproval,
        approvedBack: component.isApproved(item.status),
        openCommentsEY: item.openCommentsEY,
        openCommentsClient: item.openCommentsClient,
        totalComments: item.totalComments,
        statusChangedDate: item.statusChangedDate,
        assignedTo: item.assignedUsers == null ? [] : item.assignedUsers,
      };
      //total opens comments by product-cycle
      mockedOpenCommentsClientByProductCycle =
        mockedOpenCommentsClientByProductCycle +
        Number(item.openCommentsClient);
      mockedOpenCommentsEYByProductCycle =
        mockedOpenCommentsEYByProductCycle + Number(item.openCommentsEY);
      mockedCompletedFunds.push(eachitem);
    });
    component.getCompletedProductCyclesData(1);
    expect(component.openCommentsClientByProductCycle).toEqual(
      mockedOpenCommentsClientByProductCycle
    );
    expect(component.openCommentsEYByProductCycle).toEqual(
      mockedOpenCommentsEYByProductCycle
    );
    expect(component.completedFunds).toEqual(mockedCompletedFunds);
    expect(component.getStatusCount).toHaveBeenCalled();
    expect(component.getFileSummuries).toHaveBeenCalled();
    expect(component.createFundRowData).toHaveBeenCalledWith(
      mockedCompletedFunds
    );
    expect(component.createFundRowData).toHaveBeenCalled();
    expect(component['router'].navigate).toHaveBeenCalledWith(url);
  });
  it('gridFilter method should filter by assigned fund and call createCommentsRowData function', () => {
    let mockedCompletedFunds: any = [];
    spyOn(component, 'createFundRowData');
    mockedProductionCyclesDetails['data'].forEach((item) => {
      const eachitem: any = {
        name: item.name,
        hasContent: item.hasContent,
        id: item.id,
        status: component.setStatus(item.status, item.hasContent),
        approved:
          (!component.isApproved(item.status) && !item.hasContent) ||
          !component.permissionApproval,
        approvedBack: component.isApproved(item.status),
        openCommentsEY: item.openCommentsEY,
        openCommentsClient: item.openCommentsClient,
        totalComments: item.totalComments,
        statusChangedDate: item.statusChangedDate,
        assignedTo: item.assignedUsers == null ? [] : item.assignedUsers,
      };
      mockedCompletedFunds.push(eachitem);
    });
    component.completedFunds = mockedCompletedFunds;
    //spyOn(component, 'createCommentsRowData');
    let filterKey = 'Jonnathan.Caballero@email.com';
    let arrfilterFunds = mockedCompletedFunds.filter((fund) => {
      let filterByFund = fund.assignedTo.find((assignedByFund) => {
        return assignedByFund.userEmail.toLowerCase() == filterKey;
      });
      let res = filterByFund == undefined ? false : true;
      return res;
    });
    component.gridFilter(filterKey);
    expect(component.createFundRowData).toHaveBeenCalledWith(arrfilterFunds);
  });
  it('isToggleLeftDisabled method should set disabledLeftToggle to false if completedFunds list has more than 1 record', () => {
    component.completedFunds = [{ assignedTo: 'test' }];
    component.isToggleLeftDisabled();
    expect(component.disabledLeftToggle).toEqual(false);
  });
  it('createComment method should navigate to comment-page with the row parameters', () => {
    spyOn(component['router'], 'navigate');
    let mockID = 1;
    let mockName = 'test';
    let mockType = 'test';
    component.productCycleName = mockName;
    component.productCycleId = mockID;
    let row = {
      id: 1,
      name: 'name',
      status: 'approved',
      openCommentsEY: '',
      openCommentsClient: '',
    };
    const url = [
      'comment-page',
      row.id,
      row.name,
      mockName,
      row.status,
      row.openCommentsEY,
      row.openCommentsClient,
      mockType,
      mockID,
    ];
    component.createComment(row, mockType);
    expect(component['router'].navigate).toHaveBeenCalledWith(url);
  });
  it('getDownloadFile method should call getDownloadFile function from service with row data', () => {
    let row = {
      id: 1,
      name: 'name',
    };
    spyOn(component['productcyclesService'], 'getDownloadFile').and.returnValue(
      of(mockDownloadResp)
    );
    component.getDownloadFile(row);
    expect(
      component['productcyclesService'].getDownloadFile
    ).toHaveBeenCalledWith(row.id, row.name);
  });
  it('createFundRowData method should populate rowData and call isToggleLeftDisabled function', fakeAsync(() => {
    let mockedRowData: any = [];
    let mockedCompletedFunds: any = [];
    spyOn(component, 'isToggleLeftDisabled');
    mockedProductionCyclesDetails['data'].forEach((item) => {
      const eachitem: any = {
        name: item.name,
        hasContent: item.hasContent,
        id: item.id,
        status: component.setStatus(item.status, item.hasContent),
        approved:
          (!component.isApproved(item.status) && !item.hasContent) ||
          !component.permissionApproval,
        approvedBack: component.isApproved(item.status),
        openCommentsEY: item.openCommentsEY,
        openCommentsClient: item.openCommentsClient,
        totalComments: item.totalComments,
        statusChangedDate: item.statusChangedDate,
        assignedTo: item.assignedUsers == null ? [] : item.assignedUsers,
      };
      mockedCompletedFunds.push(eachitem);
    });
    tick();
    component.createFundRowData(mockedCompletedFunds);
    mockedCompletedFunds.forEach((fund) => {
      mockedRowData.push({
        name: fund.name,
        hasContent: fund.hasContent,
        id: fund.id,
        status: fund.status,
        approved: fund.approved,
        approvedBack: fund.approvedBack,
        openCommentsEY: fund.openCommentsEY,
        openCommentsClient: fund.openCommentsClient,
        totalComments: fund.totalComments,
        statusChangedDate: fund.statusChangedDate,
        assignedTo: fund.assignedTo,
        assignedToSearch:
          fund.assignedTo.length > 0
            ? component.splitAssignedUser(fund.assignedTo)
            : '',
      });
    });
    expect(component.rowData).toEqual(mockedRowData);
    expect(component.isToggleLeftDisabled).toHaveBeenCalled();
  }));
  it('datasetsReportRowsSelected method should set btns and datasetsSelectedRows variables', () => {
    let event = 'test';
    component.setClickApproveButton = true;
    let cancelBtn = { disabled: true };
    let approveBtn = { disabled: true };
    component.cancelbtn = cancelBtn;
    component.approveBtn = approveBtn;
    component.datasetsReportRowsSelected(event);
    expect(component.approveBtn.disabled).toEqual(false);
    expect(component.cancelbtn.disabled).toEqual(false);
    expect(component.datasetsSelectedRows).toEqual(event);
  });
  it('onSubmitApproveDatasets method should putApproveEntities and update productCyclesData', () => {
    spyOn(
      component['productcyclesService'],
      'putApproveEntities'
    ).and.returnValue(of(mockDownloadResp));
    let mockIDs: any = '';
    let mockedDatasetsSelectedRows = [{ id: 1 }, { id: 2 }, { id: 3 }];
    mockedDatasetsSelectedRows.forEach((ele) => {
      mockIDs = mockIDs === '' ? ele.id : mockIDs + ',' + ele.id;
    });
    const mockedBody = {
      status: 'approved',
      fundIds: mockIDs.split(','),
    };
    component.datasetsSelectedRows = mockedDatasetsSelectedRows;
    component.cancelbtn = {};
    component.onSubmitApproveDatasets();
    expect(component.cancelbtn.disabled).toEqual(true);
    expect(
      component['productcyclesService'].putApproveEntities
    ).toHaveBeenCalledWith(mockedBody);
  });
  it('should call handleGridReady', () => {
    let mockedAPI = {
      addEventListener: (input) => {
        return [{ column: '' }];
      },
    };
    component.handleGridReady({ api: mockedAPI });
    expect(component.gridApi).toEqual(mockedAPI);
  });
  it('approveFund method should call putApproveEntities afterClosed', () => {
    let mockResult = {
      button: 'Continue',
      data: {
        assignTo: 'abcd',
        comment: '',
        files: '',
      },
    };
    let mockData = {
      afterClosed: () => of(mockResult),
    };
    let _id: any = 0;
    let funds: any = [];
    funds.push(_id);
    const mockedBody = {
      status: 'approved',
      fundIds: funds,
    };
    spyOn(component['dialog'], 'open').and.returnValue(mockData as any);
    spyOn(
      component['productcyclesService'],
      'putApproveEntities'
    ).and.returnValue(of(mockDownloadResp));
    component.approveFund(_id);
    expect(
      component['productcyclesService'].putApproveEntities
    ).toHaveBeenCalledWith(mockedBody);
    expect(component['dialog'].open).toHaveBeenCalled();
  });
  it('addUsersToFund method should call getCompletedProductCyclesData afterClosed', () => {
    let mockResult = {
      button: 'Save',
      data: {
        assignTo: 'abcd',
        comment: '',
        files: '',
      },
    };
    let mockData = {
      afterClosed: () => of(mockResult),
    };
    component.productCycleId = 1;
    component.rowData = [];
    spyOn(component['dialog'], 'open').and.returnValue(mockData as any);
    spyOn(component, 'getCompletedProductCyclesData');
    component.addUsersToFund(1);
    expect(component.getCompletedProductCyclesData).toHaveBeenCalledWith(
      1,
      true,
      'Users added successfully'
    );
    expect(component['dialog'].open).toHaveBeenCalled();
  });
  it('addCommentToFund method should call getCompletedProductCyclesData afterClosed', () => {
    let mockResult = {
      button: 'Continue',
      data: {
        assignTo: 'abcd',
        comment: '',
        files: '',
      },
    };
    let mockData = {
      afterClosed: () => of(mockResult),
    };
    component.datasetsSelectedRows = [1];
    spyOn(component['dialog'], 'open').and.returnValue(mockData as any);
    spyOn(component, 'onSubmitApproveDatasets');
    component.openApprovalDialog();
    expect(component.onSubmitApproveDatasets).toHaveBeenCalled();
    expect(component['dialog'].open).toHaveBeenCalled();
  });
  it('openWarningDialog method should open modal', () => {
    spyOn(component['dialog'], 'open');
    component.openWarningDialog();
    expect(component['dialog'].open).toHaveBeenCalled();
  });
  it('openErrorModal method should open modal', () => {
    spyOn(component['dialog'], 'open');
    component.openErrorModal('', '');
    expect(component['dialog'].open).toHaveBeenCalled();
  });
  it('informationModal method should open modal', () => {
    spyOn(component['dialog'], 'open');
    component.informationModal();
    expect(component['dialog'].open).toHaveBeenCalled();
  });
  it('closeToast method should set showToastAfterSubmit to false', () => {
    component.closeToast();
    expect(component.showToastAfterSubmit).toEqual(false);
    expect(component.showToastAfterSubmitBulk).toEqual(false);
  });

  it('should call getCompletedProductCyclesDetails Data', fakeAsync(() => {
    let productionCycleDetails: any = [];
    fixture.detectChanges();
    const result$ = productionCyclesService.getProductionCyclesDetails(1);
    result$.subscribe((resp) => {
      resp['data'].forEach((item) => {
        const eachitem: any = {
          name: item.name,
          hasContent: item.hasContent,
          id: item.id,
          status: component.setStatus(item.status, item.hasContent),
          approved:
            (!component.isApproved(item.status) && !item.hasContent) ||
            !component.permissionApproval,
          approvedBack: component.isApproved(item.status),
          openCommentsEY: item.openCommentsEY,
          openCommentsClient: item.openCommentsClient,
          totalComments: item.totalComments,
          statusChangedDate: item.statusChangedDate,
          assignedTo: item.assignedUsers == null ? [] : item.assignedUsers,
        };
        //total opens comments by product-cycle
        productionCycleDetails.push(eachitem);
      });
    });
    expect(component.completedFunds).toEqual(productionCycleDetails);
  }));
  it('checkDataProcess should populate processingCheck with Data', () => {
    fixture.detectChanges();
    component.checkDataProcess(false);
    expect(component.processingCheck).toEqual(false);
  });
  it('getOptionsProductCycles method should get getOptionsProductCyclesList from sessionStorage', () => {
    let fakeStore = {
      userEmail: 'user@ey.com',
      productionCyclesList: '[1,2,3,4]',
    };
    spyOn(window.sessionStorage, 'getItem').and.callFake((key: string) => {
      return fakeStore[key];
    });
    component.getOptionsProductCycles();
    expect(component.options).toEqual([1, 2, 3, 4]);
    expect(sessionStorage.getItem).toHaveBeenCalledWith('productionCyclesList');
  });
  it('onOptionsSelected method should call getCompletedProductCyclesData and set product cycle data', () => {
    let mockedOptions: any = [
      { id: 1, name: 'test' },
      { id: 2, name: 'test' },
    ];
    component.options = mockedOptions;
    spyOn(component, 'getCompletedProductCyclesData');
    component.onOptionsSelected(1);
    expect(component.productCycleId).toEqual(1);
    expect(component.productCycleName).toEqual('test');
    expect(component.getCompletedProductCyclesData).toHaveBeenCalledWith(1);
  });
  it('getFileSummuries method should set the fileSummaries', () => {
    component.openCommentsClientByProductCycle = 1;
    component.openCommentsEYByProductCycle = 2;
    let mockedFileSummaries: any = [
      {
        label: 'Open client comments',
        value: 1,
      },
      {
        label: 'Open EY comments',
        value: 2,
      },
    ];
    component.getFileSummuries();
    expect(component.fileSummaries).toEqual(mockedFileSummaries);
  });
  it('setStatus method should return the status depending on the states parameter', () => {
    expect(component.setStatus('open', true)).toEqual('In client review');
    expect(component.setStatus('open', false)).toEqual('In EY tax preparation');
    expect(component.setStatus('approved', '')).toEqual('Approved by client');
  });
  it('isApproved method should return true if the string is equal to approved', () => {
    expect(component.isApproved('approved')).toEqual(true);
  });
  it('filterByOpenC method should return true the fund object is in client review', () => {
    expect(component.filterByOpenC(fund)).toEqual(true);
  });
  it('setColorScheme method should set colors', () => {
    component.setColorScheme();
    expect(component.colorScheme).toEqual(red);
    expect(component.colorScheme2).toEqual(orange);
    expect(component.colorScheme3).toEqual(teal);
  });
  it('getStatusCount method should get the count of status', () => {
    component.taxPreparationCount = 1;
    component.clientReviewCount = 2;
    component.approvedClientCount = 3;
    component.getStatusCount();
    let dataToChart = [
      {
        'in EY tax preparation': component.taxPreparationCount,
        'in client review': component.clientReviewCount,
        'Approved by client': component.approvedClientCount,
      },
    ];
    expect(component.dataToChart).toEqual(dataToChart);
  });
  it('setClasses method should set the status color', () => {
    expect(component.setClasses(row)).toEqual('#4EBEEB');
    row.status = 'In EY tax preparation';
    expect(component.setClasses(row)).toEqual('#724BC3');
    row.status = 'Approved by client';
    expect(component.setClasses(row)).toEqual('#57E188');
  });
  it('splitAssignedUser method should split users', () => {
    let users = [
      { userFirstName: 'test', userLastName: 'User' },
      { userFirstName: 'test', userLastName: 'User2' },
    ];
    let expectedResponse = 'test User,tU,test User2,tU';
    expect(component.splitAssignedUser(users)).toEqual(expectedResponse);
  });
  it('unApproveFund method should check for funds and call putApproveEntities', () => {
    let row = { id: 1 };
    let funds: any = [];
    funds.push(row.id);
    const body = {
      status: 'open',
      fundIds: funds,
    };
    component.productCycleId = 1;
    spyOn(component, 'getCompletedProductCyclesData');
    spyOn(
      component['productcyclesService'],
      'putApproveEntities'
    ).and.returnValue(of(mockDownloadResp));
    component.unApproveFund(row);
    expect(
      component['productcyclesService'].putApproveEntities
    ).toHaveBeenCalledWith(body);
    expect(component.getCompletedProductCyclesData).toHaveBeenCalledWith(
      1,
      true,
      'Fund unapproved successfully'
    );
  });
  it('getMoreDetailsPage method should navigate to comments-details', () => {
    spyOn(component['router'], 'navigate');
    component.productCycleId = 1;
    component.productCycleName = 'Test';
    const url = ['comments-details', 1, 'Test'];
    component.getMoreDetailsPage();
    expect(component['router'].navigate).toHaveBeenCalledWith(url);
  });
  it('approveClickEv method should call LoaderService and modals', fakeAsync(() => {
    let mockEvent = {
      stopPropagation: () => of({}),
    };
    spyOn(component['LoaderService'], 'show');
    spyOn(component['LoaderService'], 'hide');
    spyOn(component, 'openErrorModal');
    spyOn(component, 'openWarningDialog');
    spyOn(component, 'openApprovalDialog');
    component.processingCheck = 'finished';
    component.datasetsSelectedRows = [];
    component.approveClickEv(mockEvent);
    expect(component['LoaderService'].show).toHaveBeenCalled();
    tick(100);
    expect(component['LoaderService'].hide).toHaveBeenCalled();
    expect(component.openErrorModal).toHaveBeenCalledWith(
      'Warning',
      'You must select at least one fund in order to submit an approval request'
    );
    component.datasetsSelectedRows = [1,2];
    component.approveClickEv(mockEvent);
    tick(100);
    expect(component['LoaderService'].hide).toHaveBeenCalled();
    expect(component.openApprovalDialog).toHaveBeenCalled();
  }));
  it('onClickSecondButton method should call LoaderService and modals', fakeAsync(() => {
    spyOn(component['LoaderService'], 'show');
    spyOn(component['LoaderService'], 'hide');
    component.processingCheck = 'finished';
    let mockResult = {
      button: 'Continue',
      data: {
        assignTo: 'abcd',
        comment: '',
        files: '',
      },
    };
    let bulkprocesed = of('test','test', 'test');
    let mockData = {
      beforeClosed: () => of(mockResult),
      componentInstance: {
        bulkprocesed : bulkprocesed
      }
    };
    component.datasetsSelectedRows = [1];
    spyOn(component['dialog'], 'open').and.returnValue(mockData as any);
    component.onClickSecondButton();
    expect(component['LoaderService'].show).toHaveBeenCalled();
    tick(100);
    expect(component['LoaderService'].hide).toHaveBeenCalled();
    expect(component['dialog'].open).toHaveBeenCalled();
    flush();
  }));
});