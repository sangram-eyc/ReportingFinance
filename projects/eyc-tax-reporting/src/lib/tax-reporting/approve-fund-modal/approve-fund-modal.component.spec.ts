import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from '../../../../../../src/environments/environment';
import { taxenvironment } from '../../../../../../src/environments/eyc-tax-reporting/tax-environment';
import { ApproveFundModalComponent } from './approve-fund-modal.component';

describe('ApproveFundModalComponent', () => {
  let component: ApproveFundModalComponent;
  let fixture: ComponentFixture<ApproveFundModalComponent>;
  let mockedModal = {
    footer: {
      style : '',
      YesButton : true,
      NoButton : false
    },
    header: {
      style : ''
    }
  }
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
        {provide: MatDialogRef, useValue: {} },
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
  it('should return true after click ok', () => {
    spyOn(component, 'onClickYes');
    expect(component.modalDetails.footer.YesButton).toEqual(true);
  });
  it('should return false after click cancel', () => {
    spyOn(component, 'close');
    expect(component.modalDetails.footer.NoButton).toEqual(false);
  });
});