import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { environment } from '../../../../../../src/environments/environment';
import { taxenvironment } from '../../../../../../src/environments/eyc-tax-reporting/tax-environment';
import { ApproveFundModalComponent } from './approve-fund-modal.component';

describe('ApproveFundModalComponent', () => {
  let component: ApproveFundModalComponent;
  let fixture: ComponentFixture<ApproveFundModalComponent>;
  let mockedModal = {
    footer: {
      style : '',
      YesButton : 'Yes',
      NoButton : 'No'
    },
    header: {
      style : ''
    },
    funds: []
  };
  let matDialogStub = {
    open: () => {
      return { afterClosed: () => of() }
    },
    close: () => { }
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApproveFundModalComponent ],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        RouterModule.forRoot([]),
        MatDialogModule,
      ],
      providers: [
        {provide:"apiEndpoint",  useValue: environment.apiEndpoint},
        {provide:"taxapiEndpoint",  useValue: taxenvironment.apiEndpoint},
        {provide:"taxProduction",  useValue: taxenvironment.production},
        {provide:"rrproduction",  useValue: environment.production},
        {provide: MatDialogRef, useValue: matDialogStub },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveFundModalComponent);
    component = fixture.componentInstance;
    component.modalDetails = mockedModal;
    fixture.detectChanges();
  });
  it('should create', (done: DoneFn) => {
    expect(component).toBeTruthy();
    done();
  });
  it('should set variables', () => {
    expect(component.ConfirmationTextUpload).toEqual(true);
    expect(component.disabledBtn).toEqual(true);
    expect(component.toastSuccessMessage).toEqual("Users added successfully");
    expect(component.showModal).toEqual(true);
    expect(component.showToastAfterSubmit).toEqual(false);
    expect(component.rowClass).toEqual('row-style');
    expect(component.rowStyle.height).toEqual('74px');
    expect(component.domLayout).toEqual('autoHeight');
  });
  it('should return Yes after click ok', () => {
    spyOn(component['dialogRef'], 'close');
    component.onClickYes();
    expect(component['dialogRef'].close).toHaveBeenCalledWith({ button: 'Yes' })
  });
  it('should return No after click close', () => {
    spyOn(component['dialogRef'], 'close');
    component.close();
    expect(component['dialogRef'].close).toHaveBeenCalledWith({ button: 'No' })
  });
});