import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { environment } from '../../../../../../src/environments/environment';
import { taxenvironment } from '../../../../../../src/environments/eyc-tax-reporting/tax-environment';
import { NoSanitizePipe } from '../../../../../eyc-ui-shared-component/src/lib/pipes/noSanitize.pipe';
import { TaxCommentService } from '../../tax-reporting/services/tax-comment.service';
import { TaxCommentModalComponent } from './tax-comment-modal.component';

describe('TaxCommentModalComponent', () => {
  let component: TaxCommentModalComponent;
  let fixture: ComponentFixture<TaxCommentModalComponent>;
  let commentService: TaxCommentService;
  let mockedModal = {
    footer: {
      style: '',
      YesButton: 'Yes',
      NoButton: 'No',
    },
    header: {
      style: '',
    },
    funds: [],
    type: 'ConfirmationTextUpload',
    description: 'abc',
    forms: {
      textareaDetails: {
        label: '',
        validationMessage: '',
      },
    },
    entityId: '1',
  };
  let matDialogStub = {
    open: () => {
      return { afterClosed: () => of() };
    },
    close: () => {},
  };
  let mockedAddTask = {
    success: true,
    message: '',
    corelationId: null,
    data: {
      id: 123,
      entityId: 111,
      description: 'Please fix the file. Calculations are wrong',
      status: 'open',
      priority: 'critical',
      target: 'EY',
      company: 'Client',
      createdBy: 'some.user@client.company.com',
      createdDate: '2021-09-21T00:00:00Z',
      tags: ['Edit Required', 'Include in cycle debrief'],
      replyCount: 0,
      attachmentCount: 0,
    },
    error: null,
  };
  let commentServiceStub: jasmine.SpyObj<TaxCommentService>;
  let fb: FormBuilder;
  beforeEach(async(() => {
    commentServiceStub = jasmine.createSpyObj('commentService', [,
      'addComment',
      'addTask',
      'uploadFile',
      'getTasksData',
      'updateTaskStatus',
      'deleteTag',
      'listComments',
      'addTag',
      'updatePriority',
      'downloadFile',
      'cycleCommentsDetails',
      'getCommentsDetailsPerProductCycle',
      'getCommentExpandDetails',
    ]);
    TestBed.configureTestingModule({
      declarations: [TaxCommentModalComponent, NoSanitizePipe],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        RouterModule.forRoot([]),
        MatDialogModule,
        ReactiveFormsModule,
        FormsModule,
      ],
      providers: [
        TaxCommentService,
        { provide: TaxCommentService, useValue: commentServiceStub },
        { provide: 'apiEndpoint', useValue: environment.apiEndpoint },
        { provide: 'taxapiEndpoint', useValue: taxenvironment.apiEndpoint },
        { provide: 'taxProduction', useValue: taxenvironment.production },
        { provide: 'rrproduction', useValue: environment.production },
        { provide: MatDialogRef, useValue: matDialogStub },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        FormBuilder,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxCommentModalComponent);
    commentServiceStub.addTask.and.returnValue(
      of(mockedAddTask)
    );
    commentServiceStub.uploadFile.and.returnValue(
      of(mockedAddTask)
    );
    commentService = TestBed.get(TaxCommentService);
    fb = TestBed.inject(FormBuilder);
    let mockedForm = fb.group({
      sendTo: ['EY'],
      comment: ['', [Validators.required, Validators.maxLength(250), Validators.pattern('[a-zA-Z0-9-_:/*$%.,@+? ]*')]],
      edit:[false],
      assignTo:['1'],
      critical: [false],
      IncludeDebrief : [false],
      files: ['']
    });
    component = fixture.componentInstance;
    component.modalDetails = mockedModal;
    component.modalForm = mockedForm;
    fixture.detectChanges();
    component.ngOnInit();
  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('it should set the variables', () => {
    expect(component.ConfirmationTextUpload).toEqual(false);
    expect(component.filesList).toEqual([]);
    expect(component.toastSuccessMessage).toEqual('Comment added successfully');
    expect(component.showToastAfterSubmit).toEqual(false);
    expect(component.showModal).toEqual(true);
    expect(component.markCritical).toEqual(false);
    expect(component.editReq).toEqual(false);
    expect(component.TagsToSend).toEqual([]);
  });
  it('form controls fields valid', () => {
    let sendTo = component.modalForm.controls['sendTo'];
    expect(sendTo.value).toEqual('EY');
  });
  it('form invalid when empty', () => {
    expect(component.modalForm.valid).toBeFalsy();
  });
  it('onClickYes should return Yes and make calls to comment service', () => {
    component.filesList = [{ file: { rawFile: 'abc' } }];
    spyOn(component['dialogRef'], 'close');
    component.onClickYes();
    expect(component['dialogRef'].close).toHaveBeenCalledWith({
      button: 'Yes',
    });
    expect(component['commentService'].addTask).toHaveBeenCalled();
    expect(component['commentService'].uploadFile).toHaveBeenCalled();
  });
  it('should return No after click close', () => {
    spyOn(component['dialogRef'], 'close');
    component.close();
    expect(component['dialogRef'].close).toHaveBeenCalledWith({ button: 'No' });
  });
  it('closeToast method should return true after click yes', () => {
    spyOn(component['dialogRef'], 'close');
    component.closeToast();
    expect(component['dialogRef'].close).toHaveBeenCalledWith({
      button: 'Yes',
    });

    expect(component.showToastAfterSubmit).toEqual(true);
  });
  it('setMarkCritical method should return set markCritical variable', () => {
    spyOn(component, 'setMarkCritical');
    expect(component.markCritical).toEqual(false);
  });
  it('noWhiteSpaceValidator method should return validation', () => {
    const mockData = {
      value: 'abcde',
    };
    let result = component.noWhitespaceValidator(mockData as FormControl);
    expect(result).toEqual(null);
  });
  it('noWhiteSpaceValidator method should return validation with whitespace', () => {
    const mockData = {
      value: ' ',
    };
    let result = component.noWhitespaceValidator(mockData as FormControl);
    expect(result).toEqual({ whitespace: true });
  });
  it('uploadedFiles method should add selected files', () => {
    component.modalForm = {
      patchValue: () => {
        return [];
      },
    } as any;
    let mockEmittedFiles = [];
    component.uploadedFiles(mockEmittedFiles);
  });
  it('setEditRequired method should patch value to Edit field', () => {
    component.modalForm = {
      patchValue: () => {
        return [];
      },
    } as any;
    component.setEditRequired();
    expect(component.editReq).toEqual(true);
  });
});
