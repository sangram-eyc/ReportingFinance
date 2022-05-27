import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Renderer2, Type } from '@angular/core';
import { async, ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AgGridModule } from 'ag-grid-angular';
import { environment } from '../../../../../../src/environments/environment';
import { taxenvironment } from '../../../../../../src/environments/eyc-tax-reporting/tax-environment';
import { ProductionCycleService } from '../services/production-cycle.service';
import { CycleDetailComponent } from './cycle-details.component';
describe('EycCycleDetailsComponent', () => {
  let component: CycleDetailComponent;
  let fixture: ComponentFixture<CycleDetailComponent>;
  let productionCyclesService: ProductionCycleService;
  let dummyFunds = [
    {
      "name": "Goldman Sachs China A-Share Equity Portfolio",
      "code": "19614011",
      "id": "PV100356"
    },
    {
      "name": "Goldman Sachs China B-Share Equity Portfolio",
      "code": "19614012",
      "id": "PV100357"
    },
    {
      "name": "Goldman Sachs China C-Share Equity Portfolio",
      "code": "19614013",
      "id": "PV100358"
    },
    {
      "name": "Goldman Sachs China D-Share Equity Portfolio",
      "code": "19614014",
      "id": "PV100359"
    },
    {
      "name": "Goldman Sachs China E-Share Equity Portfolio",
      "code": "19614015",
      "id": "PV100360"
    }
  ];
  let fund = {
    status : 'In client review',
    openCommentsClient: 1,
    openCommentsEY: 1
  }
  let row = {status : 'In client review'};
  let red = { name: 'red', selectable: true, group: 'ordinal', domain: [ '#FF736A' ] };
  let orange = { name: 'orange', selectable: true, group: 'ordinal', domain: [ '#FF9831' ] };
  let teal = { name: 'teal', selectable: true, group: 'ordinal', domain: [ '#42C9C2' ] };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        CycleDetailComponent,
      ],
      imports: [
        CommonModule,
        RouterTestingModule,
        HttpClientTestingModule,
        RouterModule.forRoot([]),
        MatDialogModule,
        AgGridModule.withComponents([])
      ],
      providers: [
        ProductionCycleService,
        {provide:"apiEndpoint",  useValue: environment.apiEndpoint},
        {provide:"taxapiEndpoint",  useValue: taxenvironment.apiEndpoint},
        {provide:"taxProduction",  useValue: taxenvironment.production},
        {provide: MatDialogRef, useValue: {} },
        FormBuilder
      ]
    })
    .compileComponents();
  }));

    beforeEach(() => {
    fixture = TestBed.createComponent(CycleDetailComponent);
    component = fixture.componentInstance;
    productionCyclesService = TestBed.get(ProductionCycleService);
    component.ngAfterViewInit();
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should check the service', () => {
    expect(productionCyclesService instanceof ProductionCycleService).toBeTruthy();
  });
  it('should call getCompletedProductCyclesDetails Data', fakeAsync(()=> {
    let productionCycleDetails = []
    fixture.detectChanges();
    const result$ = productionCyclesService.getProductionCyclesDetails(1);
    result$.subscribe(resp  => {
        resp['data'].forEach((item) => {
            const eachitem: any = {
              name: item.name,
              hasContent: item.hasContent,
              id: item.id,
              status: component.setStatus(item.status, item.hasContent),
              approved: (!component.isApproved(item.status) && !item.hasContent) || !component.permissionApproval,
              approvedBack: component.isApproved(item.status),
              openCommentsEY: item.openCommentsEY,
              openCommentsClient: item.openCommentsClient,
              totalComments: item.totalComments,
              statusChangedDate: item.statusChangedDate,
              assignedTo: item.assignedUsers == null ? [] : item.assignedUsers
            };
            //total opens comments by product-cycle
            productionCycleDetails.push(eachitem);
          });
    })
    expect(component.completedFunds).toEqual(productionCycleDetails);
  }));
  it('checkDataProcess should populate processingCheck with Data', () => {
    fixture.detectChanges();
    component.checkDataProcess(false)
    expect(component.processingCheck).toEqual(false);
  });
  it('closeToast method should set showToastAfterSubmit to false',()=>{
    component.closeToast();
    expect(component.showToastAfterSubmit).toEqual(false);
    expect(component.showToastAfterSubmitBulk).toEqual(false);
  });
  it('closeToast method should set showToastAfterSubmit to false',()=>{
    component.closeToast();
    expect(component.showToastAfterSubmit).toEqual(false);
    expect(component.showToastAfterSubmitBulk).toEqual(false);
  });
  it('getOptionsProductCycles method should get getOptionsProductCyclesList from sessionStorage',()=>{
    component.getOptionsProductCycles();
    let mockedOptions = JSON.parse(sessionStorage.getItem('productionCyclesList'));
    expect(component.options).toEqual(mockedOptions);
  });
  it('getFileSummuries method should set the fileSummaries',()=>{
    let fileSummaries = [
      {
        label: "Open client comments",
        value: component.openCommentsClientByProductCycle
      },
      {
        label: "Open EY comments",
        value: component.openCommentsEYByProductCycle
      }
    ]
    component.getFileSummuries();
    expect(component.fileSummaries).toEqual(fileSummaries);
  });
  it('setStatus method should return the status depending on the states parameter',()=>{
    expect(component.setStatus('open', true)).toEqual('In client review');
    expect(component.setStatus('open', false)).toEqual('In EY tax preparation');
    expect(component.setStatus('approved', '')).toEqual('Approved by client');
  });
  it('isApproved method should return true if the string is equal to approved',()=>{
    expect(component.isApproved('approved')).toEqual(true);
  });
  it('filterByOpenC method should return true the fund object is in client review',()=>{
    expect(component.filterByOpenC(fund)).toEqual(true);
  });
  it('onSubmitApproveDatasets method should putApproveEntities and update productCyclesData',()=>{
    let body = {
      "status": "approved",
      "fundIds": "1,2"
    };
    let mockedDatasetsSelectedRows = [{id:1},{id:2},{id:3}];
    component.datasetsSelectedRows = mockedDatasetsSelectedRows;
    component.cancelbtn = {};
    component.onSubmitApproveDatasets();
    expect(component.cancelbtn.disabled).toEqual(true)
  });
 /*  it('backtoCycleView method should go back to CycleView',fakeAsync(()=>{
    let routerSpy = {navigate: jasmine.createSpy('navigate')};
    spyOn(component,'backtoCycleView');
    component.backtoCycleView(); 
    tick(500);
    expect(routerSpy.navigate).toHaveBeenCalledWith('app-tax-reporting');
  })); */
  it('setColorScheme method should set colors',()=>{
    component.setColorScheme(); 
    expect(component.colorScheme).toEqual(red);
    expect(component.colorScheme2).toEqual(orange);
    expect(component.colorScheme3).toEqual(teal);
  });
  it('getStatusCount method should get the count of status',()=>{
    component.taxPreparationCount = 1;
    component.clientReviewCount = 2;
    component.approvedClientCount = 3;
    component.getStatusCount(); 
    let dataToChart = [
      {
        "in EY tax preparation": component.taxPreparationCount,
        "in client review": component.clientReviewCount,
        "Approved by client": component.approvedClientCount
      }
    ];
    expect(component.dataToChart).toEqual(dataToChart);
  });
  it('setClasses method should set the status color',()=>{ 
    expect(component.setClasses(row)).toEqual('#4EBEEB');
    row.status = 'In EY tax preparation';
    expect(component.setClasses(row)).toEqual('#724BC3');
    row.status = 'Approved by client';
    expect(component.setClasses(row)).toEqual('#57E188');
  });
  it('splitAssignedUser method should split users',()=>{ 
    let users = [{userFirstName: "test", userLastName: 'User'},{userFirstName: "test",userLastName: 'User2'}];
    let expectedResponse = 'test User,tU,test User2,tU';
    expect(component.splitAssignedUser(users)).toEqual(expectedResponse);
  });
  
});