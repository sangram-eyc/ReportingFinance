import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { EycRrCommentApiService } from '../../../services/eyc-rr-comment-api.service';

import { ResolveModalComponent } from './resolve-modal.component';

describe('ResolveModalComponent', () => {
  let component: ResolveModalComponent;
  let fixture: ComponentFixture<ResolveModalComponent>;
  let matDialogStub = {
    open: () => {
      return { afterClosed: () => of() }

    }
  }

  let matDialogRefStub = {
    close: () => { }
  }

  let routerStub = {
    getCurrentNavigation: () => {
      return {
        extras: {}
      }
    }
  }

  let eycRrCommentApiServiceStub = {
    updateStatus: () => {
      return of({})
    },

    addComment: () => {
      return of({})
    },

    uploadFile: ()=>{
      return of({})
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ResolveModalComponent],
      imports: [
        HttpClientModule,
        RouterTestingModule,
        HttpClientTestingModule,
        MatDialogModule
      ],
      providers: [
        FormBuilder,
        { provide: MatDialogRef, useValue: matDialogRefStub },
        { provide: MAT_DIALOG_DATA, useValue: [] },
        { provide: MatDialog, useValue: matDialogStub },
        { provide: Router, useValue: routerStub },
        { provide: Location, useValue: {} },
        { provide: EycRrCommentApiService, useValue: eycRrCommentApiServiceStub }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResolveModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('close method should hide the comment modal', () => {
    component.modalDetails = {
      footer: {
        NoButton: 'No'
      }
    }
    spyOn(component['dialogRef'], 'close');
    component.close();
    expect(component['dialogRef'].close).toHaveBeenCalledWith({ button: 'No' })
  });

  it('onClickYes method should set data and call resolve exception API', () => {
    component.modalDetails = {
      type: 'ConfirmationTextUpload',
      entityId: '1110',
      entityType: 'Tax',
      filingName: 'PF Loan',
      period: 'Q2 2022',
      stage: 'scoping',
      filingId: '111',
      footer : {
        YesButton :'Confirm'
      }
    }

    component.modalForm = {
      comment: 'abcd',
      get: () => {
        return {
          comment: {
            value: 'abcd'
          }
        }
      },
      getRawValue :()=>{}
    } as any;
    component.filesList =[
      { file: { rawFile : 'ok' }}
    ]
    spyOn(component['commentService'], 'updateStatus').and.callFake(() => {
      return of({
        data: {}
      })
    })

    spyOn(component['commentService'], 'addComment').and.callFake(() => {
      return of({
        data: {
          commentId: '101'
        }
      })
    })
    spyOn(component['commentService'], 'uploadFile').and.callFake(() => {
      return of({})
    });
    spyOn(component['dialogRef'], 'close');
    component.onClickYes();
    expect(component['dialogRef'].close).toHaveBeenCalled()
  });


  it('onClickYes method should handle the error when addComment api is fail', () => {
    component.modalDetails = {
      type: 'ConfirmationTextUpload',
      entityId: '1110',
      entityType: 'Tax',
      filingName: 'PF Loan',
      period: 'Q2 2022',
      stage: 'scoping',
      filingId: '111',
      footer : {
        YesButton :'Confirm'
      }
    }

    component.modalForm = {
      comment: 'abcd',
      get: () => {
        return {
          comment: {
            value: 'abcd'
          }
        }
      },
      getRawValue :()=>{}
    } as any;
    let errorResponse = new HttpErrorResponse({
      "error": {
        "errorCode": '403'
      }
    })
    spyOn(component['dialogRef'],'close');
    spyOn(component['commentService'], 'updateStatus').and.callFake(() => {
      return of({
        data: {}
      })
    })
    spyOn(component['commentService'], 'addComment').and.returnValue(throwError(errorResponse))
    component.onClickYes();

  });

  it('onClickYes method should handle the error when uploadFile api is fail', () => {
    component.modalDetails = {
      type: 'ConfirmationTextUpload',
      entityId: '1110',
      entityType: 'Tax',
      filingName: 'PF Loan',
      period: 'Q2 2022',
      stage: 'scoping',
      filingId: '111',
      footer : {
        YesButton :'Confirm'
      }
    }

    component.modalForm = {
      comment: 'abcd',
      get: () => {
        return {
          comment: {
            value: 'abcd'
          }
        }
      },
      getRawValue :()=>{}
    } as any;

    component.filesList =[
      { file: { rawFile : 'ok' }}
    ]
    let errorResponse = new HttpErrorResponse({
      "error": {
        "errorCode": '403'
      }
    })
    spyOn(component['commentService'], 'updateStatus').and.callFake(() => {
      return of({
        data: {}
      })
    })
    spyOn(component['commentService'], 'addComment').and.callFake(() => {
      return of({
        data: {
          commentId: '101'
        }
      })
    })
    spyOn(component['commentService'], 'uploadFile').and.returnValue(throwError(errorResponse))
    spyOn(component['dialogRef'], 'close');
    component.onClickYes();
    expect(component['dialogRef'].close).toHaveBeenCalled()

  });

  it('onClickYes method should close the modal when modal is Not ConfirmationTextUpload', () => {
    component.modalDetails = {
      type: 'NotConfirmationTextUpload',
      footer : {
        YesButton :'Confirm'
      }
    }
    spyOn(component['dialogRef'],'close');
    component.onClickYes();
    expect(component['dialogRef'].close).toHaveBeenCalled()
  });


  it('onClickYes method should close the modal when no files data available', () => {
    component.modalDetails = {
      type: 'ConfirmationTextUpload',
      entityId: '1110',
      entityType: 'Tax',
      filingName: 'PF Loan',
      period: 'Q2 2022',
      stage: 'scoping',
      filingId: '111',
      footer : {
        YesButton :'Confirm'
      }
    }

    component.modalForm = {
      comment: 'abcd',
      get: () => {
        return {
          comment: {
            value: 'abcd'
          }
        }
      },
      getRawValue :()=>{}
    } as any;

    component.filesList =[];
    spyOn(component['dialogRef'],'close');
    spyOn(component['commentService'], 'updateStatus').and.callFake(() => {
      return of({
        data: {}
      })
    })
    spyOn(component['commentService'], 'addComment').and.callFake(() => {
      return of({
        data: {
          commentId: '101'
        }
      })
    });
    component.onClickYes();
    expect(component['dialogRef'].close).toHaveBeenCalled()

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

  it('noWhiteSpaceValidator method should return validation',()=>{
    const mockData = {
      value:'abcde'
    }
    let result = component.noWhitespaceValidator(mockData as FormControl);
    expect(result).toEqual(null)
  });

  it('noWhiteSpaceValidator method should return validation with whitespace',()=>{
    const mockData = {
      value:' '
    }
    let result = component.noWhitespaceValidator(mockData as FormControl);
    expect(result).toEqual({whitespace:true})
  });
});
