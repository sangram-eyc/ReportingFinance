import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from '../../../../../../src/environments/environment';
import { taxenvironment } from '../../../../../../src/environments/eyc-tax-reporting/tax-environment';
import {WarningModalComponent} from './warning-modal.component';

describe('WarningModalComponent', () => {
  let component: WarningModalComponent;
  let fixture: ComponentFixture<WarningModalComponent>;
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
      declarations: [ WarningModalComponent ],
      imports: [RouterTestingModule,
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
    fixture = TestBed.createComponent(WarningModalComponent);
    component = fixture.componentInstance;
    component.modalDetails = mockedModal;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('it should set the variables', () => {
    expect(component.ConfirmationTextUpload).toEqual(true);
    expect(component.disabledBtn).toEqual(true);
    expect(component.toastSuccessMessage).toEqual("Users added successfully");
    expect(component.showModal).toEqual(true);
    expect(component.showToastAfterSubmit).toEqual(false);
    expect(component.rowClass).toEqual('row-style');
    expect(component.rowStyle.height).toEqual('74px');
    expect(component.domLayout).toEqual('autoHeight');
    expect(component.completedData).toEqual([]);
    expect(component.chk).toEqual(false);
    expect(component.initialUsers).toEqual([]);
    expect(component.selectedUsers).toEqual([]);
  });
  it('should return false after click cancel', () => {
    spyOn(component, 'close');
    expect(component.modalDetails.footer.NoButton).toEqual(false);
  });
  it('should return true after click yes', () => {
    spyOn(component, 'onClickYes');
    expect(component.modalDetails.footer.YesButton).toEqual(true);
    expect(component.showToastAfterSubmit).toEqual(false);
  });
});
