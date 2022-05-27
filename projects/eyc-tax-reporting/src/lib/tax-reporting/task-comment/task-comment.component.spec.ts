import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from '../../../../../../src/environments/environment';
import { taxenvironment } from '../../../../../../src/environments/eyc-tax-reporting/tax-environment';
import { TaskCommentComponent } from './task-comment.component';
import { TaxCommentService } from '../services/tax-comment.service';

describe('TaskCommentComponent', () => {
  let component: TaskCommentComponent;
  let fixture: ComponentFixture<TaskCommentComponent>;
  let mockedTaskCommentData = {
    createdDate: '11/06/2022',
    author: 'test',
    createdBy: 'test',
    description: '',
    status: '',
    target: '',
    company: '',
    priority: 1,
    id: 1,
    tags: [{id:1}],
    entityId: 1,
    entityType: '',
    replyCount: 2,
    attachmentsCount: 2,
    attachments: []
  };
  let service : TaxCommentService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskCommentComponent ],
      imports:[ 
        CommonModule,
        RouterTestingModule,
        HttpClientTestingModule,
        RouterModule.forRoot([]),  
        MatDialogModule ],
      providers: [{provide:"apiEndpoint",  useValue: environment.apiEndpoint},
      {provide:"taxapiEndpoint",  useValue: taxenvironment.apiEndpoint},
      {provide:"taxProduction",  useValue: taxenvironment.production},
      {provide: MatDialogRef, useValue: {} },
      FormBuilder]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskCommentComponent);
    component = fixture.componentInstance;
    component.TaskCommentData = mockedTaskCommentData;
    service = TestBed.get(TaxCommentService);
    fixture.detectChanges();
  });

  it('should create',() => {
    expect(component).toBeTruthy();
  });
  it('the method getCreatedBy should return the creator',() => {
    let author : {
        userFirstName: 'Test',
        userLastName: 'User',
    },
    createdBy = 'User';
    expect(component.getCreatedBy(author, createdBy)).toEqual('User');
  });
  it('the method handleStatusChangedResponse should set the status',() => {
    let mockedRes: any = {
        data: {
            status : ''
        }
    };
    mockedRes['data'].status = 'approved';
    component.handleStatusChangedResponse(mockedRes);
    expect(component.status).toEqual('approved');
  });
  it('the method showReplyNewComment should set the showReplies and showReplyComment',() => {
    component.showReplyComment = true;
    component.showReplyNewComment();
    expect(component.showReplies).toEqual(false);
    expect(component.showReplyComment).toEqual(false);
  });
  it('the method capitalizeFirstLetter should return word with capitalize on the first letter',() => {
    expect(component.capitalizeFirstLetter('test')).toEqual('Test');
  });
    it('the method formatTarget should return the target formatted',() => {
    expect(component.formatTarget('EY')).toEqual('EY');
  });
  /* it('the method noWhitespaceValidator should check for spaces', async(() => {
    fixture.whenStable().then(() => {
        let control = new FormControl();        
        expect(component.noWhitespaceValidator(control)).toEqual(true);
    })
  })); */
  it('should call getListComments data', fakeAsync(()=> {
    fixture.detectChanges();
    let replyData= [];
    const result$ = service.listComments(1);
    component.getListComments();
    result$.subscribe(resp  => {
        replyData = resp;
        component.replyData = resp
    })
    expect(component.replyData).toEqual(replyData);
  }));
  it('formatDate should return 2 months ago from today', () => {
    var date = new Date();
    date.setMonth(date.getMonth() - 3);
    expect(component.formatDate(date)).toEqual('2 months ago');
  });
  
});