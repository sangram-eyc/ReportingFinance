import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from '../../../../../../src/environments/environment';
import { taxenvironment } from '../../../../../../src/environments/eyc-tax-reporting/tax-environment';
import { NoSanitizePipe } from "../../../../../eyc-ui-shared-component/src/lib/pipes/noSanitize.pipe";
import { TaxCommentModalComponent } from './tax-comment-modal.component';

describe('TaxCommentModalComponent', () => {
  let component: TaxCommentModalComponent;
  let fixture: ComponentFixture<TaxCommentModalComponent>;
  let mockedModal = {
    footer: {
      style : '',
      YesButton : true,
      NoButton : false
    },
    header: {
      style : ''
    },
    description: ''
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxCommentModalComponent,NoSanitizePipe ],
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
        FormBuilder,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxCommentModalComponent);
    component = fixture.componentInstance;
    component.modalDetails = mockedModal;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('it should set the variables', () => {
    expect(component.ConfirmationTextUpload).toEqual(false);
    expect(component.filesList).toEqual([]);
    expect(component.toastSuccessMessage).toEqual("Comment added successfully");
    expect(component.showToastAfterSubmit).toEqual(false);
    expect(component.showModal).toEqual(true);
    expect(component.markCritical).toEqual(false);
    expect(component.editReq).toEqual(false);
    expect(component.TagsToSend).toEqual([]);
  });
  it('should return false after click cancel', () => {
    spyOn(component, 'close');
    expect(component.modalDetails.footer.NoButton).toEqual(false);
  });
  it('should return true after click yes', () => {
    spyOn(component, 'closeToast');
    expect(component.modalDetails.footer.YesButton).toEqual(true);
    expect(component.showToastAfterSubmit).toEqual(false);
  });
  it('closeToast method should return true after click yes', () => {
    spyOn(component, 'closeToast');
    expect(component.modalDetails.footer.YesButton).toEqual(true);
    expect(component.showToastAfterSubmit).toEqual(false);
  });
  it('setMarkCritical method should return set markCritical variable', () => {
    spyOn(component, 'setMarkCritical');
    expect(component.markCritical).toEqual(false);
  });
  it('noWhiteSpaceValidator method should return validation',()=>{
    const mockData = {
      value:'abcde'
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
  it('uploadedFiles method should add selected files',()=>{
    component.modalForm = {
      patchValue:()=>{
        return []
      }
    } as any;
    let mockEmittedFiles = [];
    component.uploadedFiles(mockEmittedFiles);
  });
  it('setEditRequired method should patch value to Edit field', () => {
    component.modalForm = {
      patchValue:()=>{
        return []
      }
    } as any;
    component.setEditRequired();
    expect(component.editReq).toEqual(true)
  });
});