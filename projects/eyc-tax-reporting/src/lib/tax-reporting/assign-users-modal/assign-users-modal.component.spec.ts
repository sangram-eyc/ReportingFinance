import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { taxenvironment } from '../../../../../../src/environments/eyc-tax-reporting/tax-environment';
import { AssignUsersModalComponent } from './assign-users-modal.component';
import { NoSanitizePipe } from "../../../../../eyc-ui-shared-component/src/lib/pipes/noSanitize.pipe";
import { AssignmentsFundsService } from '../services/assignments-funds.service';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
describe('AssignUsersModalComponent', () => {
  let component: AssignUsersModalComponent;
  let fixture: ComponentFixture<AssignUsersModalComponent>;
  let assignmentsService : AssignmentsFundsService;
  let mockedUsersToAdd = {
    "success": true,
    "message": "",
    "corelationId": null,
    "data": [
      {
          "userId": 123, 
          "userEmail": "Jonnathan.Caballero@email.com", 
          "userFirstName": "Jonnathan", 
          "userLastName": "Caballero" 
      },
      {
          "userId": 2202,
          "userEmail": "Diego.Morini@email.com", 
          "userFirstName": "Diego", 
          "userLastName": "Morini" 
      },
      {
          "userId": 3303,
          "userEmail": "Gaston.Silva@email.com", 
          "userFirstName": "Gaston", 
          "userLastName": "Silva" 
      },
      {
          "userId": 3304,
          "userEmail": "Diego.Garavito@email.com", 
          "userFirstName": "Diego", 
          "userLastName": "Garavito" 
      },
      {
          "userId": 3305,
          "userEmail": "Gabriel.Loy@email.com", 
          "userFirstName": "Gabriel", 
          "userLastName": "Loy" 
      },
      {
          "userId": 3306,
          "userEmail": "Juan.Perez@email.com", 
          "userFirstName": "Juan", 
          "userLastName": "Perez" 
      }
  ],
    "error": null
  }
  let mockedModal = {
    footer: {
      style : '',
      YesButton : 'Yes',
      NoButton : 'No'
    },
    header: {
      style : ''
    },
    fundsAssign: [
      {assignedTo : [{userId : 123},{userId : 2202}]}
    ],
    idFund: 1
  };
  let assignmentsServiceStub = {
    listUserToAdd: () =>  {return of(mockedUsersToAdd)},
    addUsersToFund: () => { },
  };
  let matDialogRefStub = {
    close: () => { }
  }
  let matDialogStub = {
    open: () => {
      return { afterClosed: () => of() }

    }
  }
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
      {provide: AssignmentsFundsService, useValue: assignmentsServiceStub},
      {provide:"taxapiEndpoint",  useValue: taxenvironment.apiEndpoint},
      {provide:"taxProduction",  useValue: taxenvironment.production},
      { provide: MatDialogRef, useValue: matDialogRefStub },
      {provide: MatDialog, useValue: matDialogStub },
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
    assignmentsService = TestBed.get(AssignmentsFundsService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get and set the list of users on init', () => {
    fixture.detectChanges();
    let listUsers = [];
    let mockedListofUsers = {
      "success": true,
      "message": "",
      "corelationId": null,
      "data": [
          {
              "userId": 123, 
              "userEmail": "Jonnathan.Caballero@email.com", 
              "userFirstName": "Jonnathan", 
              "userLastName": "Caballero" 
          },
          {
              "userId": 2202,
              "userEmail": "Diego.Morini@email.com", 
              "userFirstName": "Diego", 
              "userLastName": "Morini" 
          },
          {
              "userId": 3303,
              "userEmail": "Gaston.Silva@email.com", 
              "userFirstName": "Gaston", 
              "userLastName": "Silva" 
          },
          {
              "userId": 3304,
              "userEmail": "Diego.Garavito@email.com", 
              "userFirstName": "Diego", 
              "userLastName": "Garavito" 
          },
          {
              "userId": 3305,
              "userEmail": "Gabriel.Loy@email.com", 
              "userFirstName": "Gabriel", 
              "userLastName": "Loy" 
          },
          {
              "userId": 3306,
              "userEmail": "Juan.Perez@email.com", 
              "userFirstName": "Juan", 
              "userLastName": "Perez" 
          }
      ],
      "error": null
    };
    mockedListofUsers.data.forEach((item) => {
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
    expect(component.completedData).toEqual(listUsers);
  });
  it('should call getListUsers from the service and call createListUserToAddRowData', () => {
    component.completedData = [];
    let mockedListofUsers = {
      "success": true,
      "message": "",
      "corelationId": null,
      "data": [
          {
              "userId": 123, 
              "userEmail": "Jonnathan.Caballero@email.com", 
              "userFirstName": "Jonnathan", 
              "userLastName": "Caballero" 
          },
          {
              "userId": 2202,
              "userEmail": "Diego.Morini@email.com", 
              "userFirstName": "Diego", 
              "userLastName": "Morini" 
          },
          {
              "userId": 3303,
              "userEmail": "Gaston.Silva@email.com", 
              "userFirstName": "Gaston", 
              "userLastName": "Silva" 
          },
          {
              "userId": 3304,
              "userEmail": "Diego.Garavito@email.com", 
              "userFirstName": "Diego", 
              "userLastName": "Garavito" 
          },
          {
              "userId": 3305,
              "userEmail": "Gabriel.Loy@email.com", 
              "userFirstName": "Gabriel", 
              "userLastName": "Loy" 
          },
          {
              "userId": 3306,
              "userEmail": "Juan.Perez@email.com", 
              "userFirstName": "Juan", 
              "userLastName": "Perez" 
          }
      ],
      "error": null
    };
    spyOn(component['assignmentsService'], 'listUserToAdd').and.callFake(() => {
      return of(mockedListofUsers)
    });
    spyOn(component, 'createListUserToAddRowData');
    component.getListUsers();
    expect(component['assignmentsService'].listUserToAdd).toHaveBeenCalled();
    expect(component.createListUserToAddRowData).toHaveBeenCalled();
  });
  
  it('should call createListUserToAddRowData', fakeAsync(()=> {
    spyOn(component, 'createListUserToAddRowData');
    component.completedData = [];
    component.getListUsers();
    let listUsers = [];
    let rowData = [];
    mockedUsersToAdd.data.forEach((item) => {
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
    expect(component.rowData).toEqual(rowData);
  }));
  it('onClickYes method should call addUsersToFund and return Yes after click ok', () => {
    spyOn(component['dialogRef'], 'close');
    spyOn(component['assignmentsService'], 'addUsersToFund').and.callFake(() => {
      return of(mockedUsersToAdd);
    });
    component.onClickYes();
    expect(component['assignmentsService'].addUsersToFund).toHaveBeenCalledWith(mockedModal.idFund,{ userIds: [ 123, 2202 ] });
    expect(component['dialogRef'].close).toHaveBeenCalledWith({ button: 'Yes' });
  });
  it('should return true after click closeToast', () => {
    spyOn(component['dialogRef'], 'close');
    component.closeToast();
    expect(component.showToastAfterSubmit).toEqual(true);
    expect(component['dialogRef'].close).toHaveBeenCalledWith({ button: 'Yes' });
  });
  it('close method should hide the modal', () => {
    spyOn(component['dialogRef'], 'close');
    component.close();
    expect(component['dialogRef'].close).toHaveBeenCalledWith({ button: 'No' })
  });
  it('changeCheck method should filter the id from rowData and get the user from selectedUsers and set disableBtn to false', () => {
    component.changeCheck(123);
    expect(component.selectedUsers).toEqual([ 2202 ]);
    expect(component.disabledBtn).toEqual(false);
  });
  it('handleGridReady method should set the gridapi params', () => {
    component.handleGridReady({api: ''});
    expect(component.gridApi).toEqual('');
  });
  it('onGridReady method should set the gridApi params and size columns', () => {
    let mockedGrid = {
      sizeColumnsToFit: () => {
        return [{ column: '' }]
      }
    }
    component.onGridReady({api:mockedGrid});
  });
  it('should call arrayCompare and return false', () => {
    let array1 = [{number: 2}];
    let array2 = [{number: 1}];
    expect(component.arrayCompare(array1,array2)).toEqual(false);
  });
});
