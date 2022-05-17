import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { taxenvironment } from '../../../../../../src/environments/eyc-tax-reporting/tax-environment';
import { AssignUsersModalComponent } from './assign-users-modal.component';
import { NoSanitizePipe } from "../../../../../eyc-ui-shared-component/src/lib/pipes/noSanitize.pipe";
import { AssignmentsFundsService } from '../services/assignments-funds.service';
describe('AssignUsersModalComponent', () => {
  let component: AssignUsersModalComponent;
  let fixture: ComponentFixture<AssignUsersModalComponent>;
  let assignmentsService : AssignmentsFundsService;
  let mockedModal = {
    footer: {
      style : '',
      YesButton : true,
      NoButton : false
    },
    header: {
      style : ''
    }
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignUsersModalComponent,NoSanitizePipe],
      imports: [
        MatDialogModule,
        RouterTestingModule,
        HttpClientTestingModule,
        RouterModule.forRoot([]),
      ],
      providers: [
      AssignmentsFundsService,
      {provide:"taxapiEndpoint",  useValue: taxenvironment.apiEndpoint},
      {provide:"taxProduction",  useValue: taxenvironment.production},
      {provide: MatDialogRef, useValue: {} },
      {provide: MAT_DIALOG_DATA, useValue: {} },]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignUsersModalComponent);
    assignmentsService = TestBed.get(AssignmentsFundsService);
    component = fixture.componentInstance;
    component.modalDetails = mockedModal;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should return true after click ok', () => {
    spyOn(component, 'onClickYes');
    expect(component.modalDetails.footer.YesButton).toEqual(true);
  });
  it('should return true after click closeToast', () => {
    spyOn(component, 'closeToast');
    expect(component.modalDetails.footer.YesButton).toEqual(true);
  });
  it('should return false after click cancel', () => {
    spyOn(component, 'close');
    expect(component.modalDetails.footer.NoButton).toEqual(false);
  });
  it('should call handleGridReady', () => {
    component.handleGridReady({api: ''});
    expect(component.gridApi).toEqual('');
  });
  it('should call arrayCompare and return false', () => {
    let array1 = [{number: 2}];
    let array2 = [{number: 1}];
    expect(component.arrayCompare(array1,array2)).toEqual(false);
  });
  it('should call getListUsers and return list of users', fakeAsync(()=> {
    let listUsers = []
    fixture.detectChanges();
    const result$ = assignmentsService.listUserToAdd();
    result$.subscribe(resp  => {
      resp['data'].forEach((item) => {
        const eachitem: any  = {
          id: item.userId,
          userEmail: item.userEmail,
          userFirstName: item.userFirstName,
          userLastName: item.userLastName,
          approved:true,
          check: component.modalDetails.fundsAssign[0].assignedTo.findIndex(x=> x.userId === item.userId) === -1 ? false:true
        };
        listUsers.push(eachitem);
      });
    })
    expect(component.completedData).toEqual(listUsers);
  }));
  it('should call createListUserToAddRowData', fakeAsync(()=> {
    component.getListUsers();
    component.createListUserToAddRowData();
    fixture.detectChanges();
    let listUsers = [];
    let rowData = [];
    const result$ = assignmentsService.listUserToAdd();
    result$.subscribe(resp  => {
      resp['data'].forEach((item) => {
        const eachitem: any  = {
          id: item.userId,
          userEmail: item.userEmail,
          userFirstName: item.userFirstName,
          userLastName: item.userLastName,
          approved:true,
          check: component.modalDetails.fundsAssign[0].assignedTo.findIndex(x=> x.userId === item.userId) === -1 ? false:true
        };
        listUsers.push(eachitem);
      });
      listUsers.forEach(row => {
        rowData.push({
         id: row.id,
         userEmail: row.userEmail,
         name: row.userFirstName + ' ' + row.userLastName,
         approved:row.approved,
         check:row.check  
        })
      });
    })
    spyOn(component, 'createListUserToAddRowData');
    expect(component.rowData).toEqual(rowData);
  }));
});
