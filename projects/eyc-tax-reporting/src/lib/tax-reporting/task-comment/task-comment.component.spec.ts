import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from '../../../../../../src/environments/environment';
import { taxenvironment } from '../../../../../../src/environments/eyc-tax-reporting/tax-environment';
import { TaskCommentComponent } from './task-comment.component';
import { TaxCommentService } from '../services/tax-comment.service';
import { of } from 'rxjs';

describe('TaskCommentComponent', () => {
  let component: TaskCommentComponent;
  let fixture: ComponentFixture<TaskCommentComponent>;
  let mockedTaskCommentData: any = {
    createdDate: '11/06/2022',
    author: { userFirstName: 'name', userLastName: 'last name' },
    createdBy: 'test',
    description: '',
    status: '',
    target: '',
    company: '',
    priority: 1,
    id: 1,
    tags: [{ id: 1 }],
    entityId: 1,
    entityType: '',
    replyCount: 2,
    attachmentsCount: 2,
    attachments: [],
  };
  let service: TaxCommentService;
  let mockedResp = {
    success: true,
    message: '',
    corelationId: null,
    data: [],
    error: null,
  };
  let mockedCommentDetailPerProdCycle = {
    success: true,
    message: '',
    corelationId: '127a8df2-ffd5-4c6f-b7dd-82e50d5fb552',
    data: {
      totalOpen: 33,
      totalClosed: 27,
      open: [
        {
          target: 'EY',
          status: 'OPEN',
          value: 33,
        },
        {
          target: 'CLIENT',
          status: 'OPEN',
          value: 33,
        },
      ],
      closed: [
        {
          target: 'CLIENT',
          status: 'ACCEPTED',
          value: 8,
        },
        {
          target: 'CLIENT',
          status: 'DECLINED',
          value: 3,
        },
        {
          target: 'EY',
          status: 'ACCEPTED',
          value: 11,
        },
        {
          target: 'EY',
          status: 'DECLINED',
          value: 5,
        },
      ],
    },
    error: null,
  };
  let mockedCycleCommentsDetails = {
    success: true,
    message: '',
    corelationId: '12345-34567-789gh-45ruiyt',
    data: [
      {
        fundDTO: {
          id: '01KV7KIYDTCHO7VZYWPVAYVMCX5K5OT5IN',
          name: '7047 - T. Rowe Price Global Allocation Fund',
          hasContent: true,
          status: 'open',
          openCommentsEY: 2,
          openCommentsClient: 0,
          totalComments: 2,
          assignedUsers: [
            {
              userId: 9,
              userEmail: 'francisco.carmona.garcia@ey.com',
              userFirstName: 'Francisco',
              userLastName: 'Carmona Garcia',
            },
            {
              userId: 7,
              userEmail: 'jonnathan.caballero@ey.com',
              userFirstName: 'Jonnathan',
              userLastName: 'Caballero',
            },
            {
              userId: 3,
              userEmail: 'diego.garavito.henao@ey.com',
              userFirstName: 'Diego',
              userLastName: 'Garavito Henao',
            },
            {
              userId: 5,
              userEmail: 'diego.morini@ey.com',
              userFirstName: 'Diego',
              userLastName: 'Morini',
            },
          ],
        },
        tasks: [
          {
            id: 1,
            entityId: '01KV7KIYDTCHO7VZYWPVAYVMCX5K5OT5IN',
            description:
              'Comment two Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.',
            status: 'OPEN',
            priority: 1,
            target: 'CLIENT',
            company: 'EY',
            author: null,
            createdBy: 'anonymousUser',
            createdDate: '2021-10-21T12:02:30.43',
            tags: [
              {
                id: 1,
                name: 'Edit required',
                description:
                  'Indicates that deliverable files need to be updated',
              },
              {
                id: 2,
                name: 'Include in debrief',
                description:
                  'Indicates that deliverable files need to be included in the cycle debrief',
              },
            ],
            replyCount: 13,
            attachments: [],
          },
          {
            id: 2,
            entityId: '01KV7KIYDTCHO7VZYWPVAYVMCX5K5OT5IN',
            description: 'This is a comment ',
            status: 'ACCEPTED',
            priority: 1,
            target: 'EY',
            company: 'EY',
            author: {
              userId: 7,
              userEmail: 'jonnathan.caballero@ey.com',
              userFirstName: 'Jonnathan',
              userLastName: 'Caballero',
            },
            createdBy: 'Jonnathan.Caballero@ey.com',
            createdDate: '2021-10-22T03:33:07.23',
            tags: [],
            replyCount: 8,
            attachments: [],
          },
        ],
      },
      {
        fundDTO: {
          id: '01KV7KIYEUI5ES5WMBGVHLKGFAUFVV5YVI',
          name: '70FB - T. Rowe Price European Stock Fund',
          hasContent: true,
          status: 'open',
          openCommentsEY: 0,
          openCommentsClient: 1,
          totalComments: 1,
          assignedUsers: [
            {
              userId: 4,
              userEmail: 'jesus.toscano@ey.com',
              userFirstName: 'Jesus',
              userLastName: 'Toscano',
            },
            {
              userId: 5,
              userEmail: 'diego.morini@ey.com',
              userFirstName: 'Diego',
              userLastName: 'Morini',
            },
            {
              userId: 2,
              userEmail: 'gaston.raul.silva@ey.com',
              userFirstName: 'Gaston',
              userLastName: 'Silva',
            },
          ],
        },
        tasks: [
          {
            id: 1,
            entityId: '01KV7KIYDTCHO7VZYWPVAYVMCX5K5OT5IN',
            description: 'Estimates Are wrong',
            status: 'OPEN',
            priority: 0,
            target: 'CLIENT',
            company: 'EY',
            author: null,
            createdBy: 'anonymousUser',
            createdDate: '2021-10-17T12:02:30.43',
            tags: [],
            replyCount: 13,
            attachments: [],
          },
        ],
      },
      {
        fundDTO: {
          id: '01KV7KIYCQDEPVH4VNLBAI7JHYYNIQJZZC',
          name: '70V6 - T. Rowe Price European Stock Fund',
          hasContent: true,
          status: 'open',
          openCommentsEY: 10,
          openCommentsClient: 0,
          totalComments: 0,
          assignedUsers: [
            {
              userId: 9,
              userEmail: 'francisco.carmona.garcia@ey.com',
              userFirstName: 'Francisco',
              userLastName: 'Carmona Garcia',
            },
            {
              userId: 5,
              userEmail: 'diego.morini@ey.com',
              userFirstName: 'Diego',
              userLastName: 'Morini',
            },
            {
              userId: 3,
              userEmail: 'diego.garavito.henao@ey.com',
              userFirstName: 'Diego',
              userLastName: 'Garavito Henao',
            },
          ],
        },
        tasks: null,
      },
    ],
    error: null,
  };
  let mockedCommentList = {
    success: true,
    message: '',
    corelationId: null,
    data: [
      {
        id: 123,
        entityId: 111,
        entityType: 'Fund',
        description:
          'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.',
        status: 'OPEN',
        priority: 1,
        target: 'EY',
        company: 'EY',
        author: {
          userId: null,
          userEmail: 'Patrick.Mahomes@ey.com',
          userFirstName: 'Patrick',
          userLastName: 'Mahomes',
        },
        createdBy: 'Patrick.Mahomes@ey.com',
        createdDate: '2021-09-21T00:00:00Z',
        tags: [
          {
            id: 1,
            name: 'Edit Required',
          },
          {
            id: 2,
            name: 'Include in cycle debrief',
          },
        ],
        replyCount: 7,
        attachmentsCount: 3,
        attachments: [
          {
            storageFileName: 'ac3eb5b9-0217-4655-9c24-405b662abc4d.xlsx',
            fileName: 'prueba.xlsx',
            attachmentId: 4,
          },
          {
            storageFileName: 'ac3eb5b9-0217-4655-9c24-405b662abc4d.xlsx',
            fileName: 'prueba.xlsx',
            attachmentId: 4,
          },
          {
            storageFileName: 'SOME_STORAGE_FILE_NAME',
            fileName: 'File_name_012345589.xls',
            attachmentId: 1,
          },
        ],
      },
      {
        id: 1234,
        entityId: 111,
        entityType: 'Fund',
        description: 'Please fix the file. Calculations are wrong 1234',
        status: 'OPEN',
        priority: 1,
        target: 'CLIENT',
        company: 'Client',
        author: {
          userId: null,
          userEmail: 'David.Miller@ey.com',
          userFirstName: 'David',
          userLastName: 'Miller',
        },
        createdBy: 'David.Miller@ey.com',
        createdDate: '2021-09-21T00:00:00Z',
        tags: [],
        replyCount: 8,
        attachmentsCount: 0,
        attachments: [
          {
            storageFileName: 'ac3eb5b9-0217-4655-9c24-405b662abc4d.xlsx',
            fileName: 'prueba.xlsx',
            attachmentId: 4,
          },
        ],
      },
      {
        id: 12345,
        entityId: 111,
        entityType: 'Fund',
        description: 'Please fix the file. Calculations are wrong 12345',
        status: 'OPEN',
        priority: 0,
        target: 'CLIENT',
        company: 'Client',
        author: {
          userId: null,
          userEmail: 'Eric.Taylor@ey.com',
          userFirstName: 'Eric',
          userLastName: 'Taylor',
        },
        createdBy: 'Eric.Taylor@ey.com',
        createdDate: '2021-09-21T00:00:00Z',
        tags: [],
        replyCount: 0,
        attachmentsCount: 5,
        attachments: [
          {
            storageFileName: 'ac3eb5b9-0217-4655-9c24-405b662abc4d.xlsx',
            fileName: 'prueba.xlsx',
            attachmentId: 4,
          },
          {
            storageFileName: 'ac3eb5b9-0217-4655-9c24-405b662abc4d.xlsx',
            fileName: 'prueba.xlsx',
            attachmentId: 4,
          },
          {
            storageFileName: 'SOME_STORAGE_FILE_NAME',
            fileName: 'File_name_012345589.xls',
            attachmentId: 1,
          },
        ],
      },
      {
        id: 123456,
        entityId: 111,
        entityType: 'Fund',
        description: 'Please fix the file. Calculations are wrong 123456',
        status: 'ACCEPTED',
        priority: 1,
        target: 'EY',
        company: 'EY',
        author: {
          userId: null,
          userEmail: 'Michael.Brown@ey.com',
          userFirstName: 'Michael',
          userLastName: 'Brown',
        },
        createdBy: 'Michael.Brown@ey.com',
        createdDate: '2021-09-21T00:00:00Z',
        tags: [
          {
            id: 1,
            name: 'Edit Required',
          },
        ],
        replyCount: 0,
        attachmentsCount: 8,
        attachments: [
          {
            storageFileName: 'ac3eb5b9-0217-4655-9c24-405b662abc4d.xlsx',
            fileName: 'prueba.xlsx',
            attachmentId: 4,
          },
        ],
      },
      {
        id: 1234567,
        entityId: 111,
        entityType: 'Fund',
        description: 'Please fix the file. Calculations are wrong 1234567',
        status: 'DECLINED',
        priority: 1,
        target: 'EY',
        company: 'EY',
        author: null,
        createdBy: 'Michael.Brown@ey.com',
        createdDate: '2021-09-21T00:00:00Z',
        tags: [
          {
            id: 2,
            name: 'Include in cycle debrief',
          },
        ],
        replyCount: 0,
        attachmentsCount: 9,
        attachments: [
          {
            storageFileName: 'ac3eb5b9-0217-4655-9c24-405b662abc4d.xlsx',
            fileName: 'prueba.xlsx',
            attachmentId: 4,
          },
        ],
      },
    ],
    error: null,
  };
  let commentServiceStub = {
    addTask: () => {
      return of(mockedResp);
    },
    addComment: () => {
      return of(mockedResp);
    },
    uploadFile: () => {
      return of(mockedResp);
    },
    getTasksData: () => {
      return of(mockedCommentList);
    },
    updateTaskStatus: () => {
      return of(mockedResp);
    },
    listComments: () => {
      return of(mockedResp);
    },
    deleteTag: () => {
      return of(mockedResp);
    },
    addTag: () => {
      return of(mockedResp);
    },
    updatePriority: () => {
      return of(mockedResp);
    },
    downloadFile: () => {
      return of(mockedResp);
    },
    cycleCommentsDetails: () => {
      return of(mockedCycleCommentsDetails);
    },
    getCommentsDetailsPerProductCycle: () => {
      return of(mockedCommentDetailPerProdCycle);
    },
    getCommentExpandDetails: () => {
      return of(mockedResp);
    },
  };
  let mockedUpdateTask = {
    success: true,
    message: '',
    corelationId: null,
    data: {
      id: 123,
      status: 'DECLINED',
    },
    error: null,
  };
  let mockedAddCommentResponse = {
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
  let matDialogStub = {
    open: () => {
      return { afterClosed: () => of() };
    },
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TaskCommentComponent],
      imports: [
        CommonModule,
        RouterTestingModule,
        HttpClientTestingModule,
        RouterModule.forRoot([]),
        MatDialogModule,
      ],
      providers: [
        TaxCommentService,
        { provide: TaxCommentService, userValue: commentServiceStub },
        { provide: 'apiEndpoint', useValue: environment.apiEndpoint },
        { provide: 'taxapiEndpoint', useValue: taxenvironment.apiEndpoint },
        { provide: 'taxProduction', useValue: taxenvironment.production },
        { provide: MatDialogRef, useValue: {} },
        { provide: MatDialog, useValue: matDialogStub },
        FormBuilder,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskCommentComponent);
    component = fixture.componentInstance;
    component.TaskCommentData = mockedTaskCommentData;
    service = TestBed.get(TaxCommentService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('ngOnInit method should set variables and call functions', () => {
    spyOn(component, 'getCreatedBy');
    spyOn(component, 'formatTarget');
    component.ngOnInit();
    expect(component.getCreatedBy).toHaveBeenCalledWith(
      mockedTaskCommentData.author,
      mockedTaskCommentData.createdBy
    );
    expect(component.formatTarget).toHaveBeenCalledWith(
      mockedTaskCommentData.target
    );
    expect(component.formatTarget).toHaveBeenCalledWith(
      mockedTaskCommentData.company
    );
  });
  it('validation of ReplayForm', () => {
    fixture.detectChanges();
    let fb = TestBed.inject(FormBuilder);
    let mockedForm = fb.group({
      comment: [
        '',
        [
          Validators.required,
          Validators.maxLength(250),
          component.noWhitespaceValidator,
          Validators.pattern('[a-zA-Z0-9-_:/*$%.,@+? ]*'),
        ],
      ],
      statusReplay: ['open'],
    });
    const replayFormValues = {
      comment: '',
      statusReplay: 'open'
    }
    let commentValue = component.ReplayForm.controls['comment'];
    component.ReplayForm = mockedForm;
    expect(component.ReplayForm.value).toEqual(replayFormValues);
    expect(component.ReplayForm.valid).toBeFalsy();
    commentValue.setValue('test comment');
    expect(commentValue.valid).toBeTruthy();
  });
  it('the method getCreatedBy should return the creator', () => {
    let author: {
        userFirstName: 'Test';
        userLastName: 'User';
      };
    let createdBy = 'User';
    expect(component.getCreatedBy(author, createdBy)).toEqual('User');
  });
  it('the method setStatusComment should call updateTaskStatus from service and handleStatusChangedResponse', () => {
    spyOn(component['commentService'], 'updateTaskStatus').and.callFake(() => {
      return of(mockedUpdateTask);
    });
    spyOn(component, 'handleStatusChangedResponse');
    component.idTask = 1;
    let _status = 'open';
    const objData = {
      status: _status,
    };
    component.setStatusComment(_status);
    expect(component['commentService'].updateTaskStatus).toHaveBeenCalledWith(
      1,
      objData
    );
    expect(component.handleStatusChangedResponse).toHaveBeenCalledWith(
      mockedUpdateTask
    );
  });

  it('the method handleStatusChangedResponse should set the status', () => {
    let mockedRes: any = {
      data: {
        status: '',
      },
    };
    spyOn(component.onCommentStatusChanged, 'emit');
    mockedRes['data'].status = 'approved';
    component.handleStatusChangedResponse(mockedRes);
    expect(component.onCommentStatusChanged.emit).toHaveBeenCalledWith(
      mockedRes['data']
    );
    expect(component.status).toEqual('approved');
  });

  it('the method ReplyComment should call showReplyNewComment, addComment, updateTaskStatus from service and handleStatusChangedResponse', () => {
    component.replyCount = 0;
    spyOn(component, 'showReplyNewComment');
    spyOn(component, 'handleStatusChangedResponse');
    spyOn(component['commentService'], 'addComment').and.callFake(() => {
      return of(mockedAddCommentResponse);
    });
    spyOn(component['commentService'], 'updateTaskStatus').and.callFake(() => {
      return of(mockedUpdateTask);
    });
    component.permissionStatus = true;
    component.idTask = 1;
    component.ReplyComment();
    const commentObj = {
      comment: '',
      entityId: component.idTask,
      entityType: 'TASK',
    };
    let newStatus = 'open';
    const objStatus = {
      status: newStatus,
    };
    expect(component['commentService'].addComment).toHaveBeenCalledWith(
      commentObj
    );
    expect(component['commentService'].updateTaskStatus).toHaveBeenCalledWith(
      1,
      objStatus
    );
    expect(component.showReplyNewComment).toHaveBeenCalled();
    expect(component.handleStatusChangedResponse).toHaveBeenCalledWith(
      mockedUpdateTask
    );
    expect(component.replyCount).toEqual(1);
    expect(component.showToastAfterSubmit).toEqual(true);
  });
  it('the method cancelReplyComment should call showReplyNewComment and set formValues', () => {
    spyOn(component, 'showReplyNewComment');
    component.cancelReplyComment();
    let statusReplay = component.ReplayForm.controls['statusReplay'].value;
    expect(component.showReplyNewComment).toHaveBeenCalled();
    expect(statusReplay).toEqual('open');
  });
  it('the method closeToast should set showToastAfterSubmit to false', () => {
    component.closeToast();
    let statusReplay = component.ReplayForm.controls['statusReplay'].value;
    expect(component.showToastAfterSubmit).toEqual(false);
    expect(statusReplay).toEqual('open');
  });
  it('the method getListComments should call listComments from service and get the list of comments', () => {
    spyOn(component['commentService'], 'listComments').and.callFake(() => {
      return of(mockedCommentList);
    });
    component.replyData = '';
    component.replyCount = 1;
    component.idTask = 1;
    component.getListComments();
    expect(component['commentService'].listComments).toHaveBeenCalledWith(1);
    expect(component.showReplyComment).toEqual(false);
    expect(component.replyData).toEqual(mockedCommentList['data']);
  });
  it('the method showReplyNewComment should set the showReplies and showReplyComment', () => {
    component.showReplyComment = true;
    component.showReplyNewComment();
    expect(component.showReplies).toEqual(false);
    expect(component.showReplyComment).toEqual(false);
  });

  it('the method deleteTag should set the showReplies and showReplyComment', () => {
    component.showReplyComment = true;
    component.showReplyNewComment();
    expect(component.showReplies).toEqual(false);
    expect(component.showReplyComment).toEqual(false);
  });

  it('the method deleteTag should call deleteTag afterClosed', () => {
    let mockResult = {
      button: 'Yes',
      data: {
        assignTo: 'abcd',
        comment: '',
        files: '',
      },
    };
    let mockData = {
      afterClosed: () => of(mockResult),
    };
    component.idTask = 2;
    spyOn(component['dialog'], 'open').and.returnValue(mockData as any);
    spyOn(component['commentService'], 'deleteTag').and.callFake(() => {
      return of(mockedAddCommentResponse);
    });
    spyOn(component.onCommentTagDeleted, 'emit');
    const tagDeleted = {
      id: 2,
      idTag: 1,
    };
    component.deleteTag('test', 1);
    expect(component['commentService'].deleteTag).toHaveBeenCalledWith(2, 1);
    expect(component.editRequired).toEqual(null);
    expect(component.onCommentTagDeleted.emit).toHaveBeenCalledWith(tagDeleted);
    expect(component['dialog'].open).toHaveBeenCalled();
  });

  it('the method deletePriority should call updatePriority afterClosed', () => {
    let mockResult = {
      button: 'Yes',
      data: {
        assignTo: 'abcd',
        comment: '',
        files: '',
      },
    };
    let mockData = {
      afterClosed: () => of(mockResult),
    };
    component.idTask = 2;
    const data = {
      priority: 0,
    };
    spyOn(component['dialog'], 'open').and.returnValue(mockData as any);
    spyOn(component['commentService'], 'updatePriority').and.callFake(() => {
      return of(mockedAddCommentResponse);
    });
    spyOn(component.onCommentPriorityUpdated, 'emit');
    const Prioritydeleted = {
      id: 2,
      priority: 0,
    };
    component.deletePriority('test');
    expect(component['commentService'].updatePriority).toHaveBeenCalledWith(
      2,
      data
    );
    expect(component.priority).toEqual(0);
    expect(component.onCommentPriorityUpdated.emit).toHaveBeenCalledWith(
      Prioritydeleted
    );
    expect(component['dialog'].open).toHaveBeenCalled();
  });

  it('the method downloadFile should call downloadFile from comment service', () => {
    let fileName = 'test.txt';
    let type = fileName.split('.').pop();
    const requestobj = {
      fileName: fileName,
      fileType: 'TXT',
    };
    spyOn(component['commentService'], 'downloadFile').and.callFake(() => {
      return of(mockedResp);
    });
    component.downloadFile(fileName, fileName);
    expect(component['commentService'].downloadFile).toHaveBeenCalledWith(
      requestobj
    );
  });
  it('the method base64ToBlob should create and return a file', async(() => {
    const contentType = 'text/xml';
    const mockb64Data =
      'iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==';
    const sliceSize = 512;
    let b64Data = mockb64Data; //IE compatibility...
    let byteCharacters = atob(b64Data);
    let byteArrays: any = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);
      let byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      let byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    let mockedBlob = new Blob(byteArrays, { type: contentType });
    let resultBlob = component.base64ToBlob(mockb64Data, contentType, sliceSize);
    expect(resultBlob).toEqual(
      mockedBlob
    );
  }));

  it('the method updatePriority should call updatePriority from comment service', () => {
    const data = {
      priority: 1,
    };
    component.idTask = 2;
    spyOn(component['commentService'], 'updatePriority').and.callFake(() => {
      return of(mockedAddCommentResponse);
    });
    spyOn(component.onCommentPriorityUpdated, 'emit');
    const PriorityUpdated = {
      id: 2,
      priority: 1,
    };
    component.updatePriority();
    expect(component['commentService'].updatePriority).toHaveBeenCalledWith(
      2,
      data
    );
    expect(component.onCommentPriorityUpdated.emit).toHaveBeenCalledWith(
      PriorityUpdated
    );
    expect(component.priority).toEqual(1);
  });

  it('the method addTag should call addTag from comment service', () => {
    const mockedTagID = 2;
    component.idTask = 2;
    const tagAdded = {
      id: 2,
      idTag: mockedTagID,
    };
    spyOn(component.onCommentaddTag, 'emit');
    spyOn(component['commentService'], 'addTag').and.callFake(() => {
      return of(mockedAddCommentResponse);
    });
    component.addTag(mockedTagID);
    expect(component['commentService'].addTag).toHaveBeenCalledWith(2, 2);
    expect(component.includeDebrief).toEqual({
      id: 2,
      name: 'Include in cycle debrief',
    });
    expect(component.onCommentaddTag.emit).toHaveBeenCalledWith(tagAdded);
  });

  it('the method capitalizeFirstLetter should return word with capitalize on the first letter', () => {
    expect(component.capitalizeFirstLetter('test')).toEqual('Test');
  });
  it('the method formatTarget should return the target formatted', () => {
    expect(component.formatTarget('EY')).toEqual('EY');
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
  it('should call getListComments data', fakeAsync(() => {
    fixture.detectChanges();
    let replyData = [];
    const result$ = service.listComments(1);
    component.getListComments();
    result$.subscribe((resp) => {
      replyData = resp;
      component.replyData = resp;
    });
    expect(component.replyData).toEqual(replyData);
  }));
  it('formatDate should return 3 months ago from today', () => {
    var date = new Date();
    date.setMonth(date.getMonth() - 3);
    expect(component.formatDate(date)).toEqual('3 months ago');
  });
});
