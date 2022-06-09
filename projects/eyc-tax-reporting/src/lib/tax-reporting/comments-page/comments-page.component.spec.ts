import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { taxenvironment } from '../../../../../../src/environments/eyc-tax-reporting/tax-environment';
import { AssignmentsFundsService } from '../services/assignments-funds.service';
import { TaxCommentService } from '../services/tax-comment.service';
import { CommentsPagecomponent} from './comments-page.component';
describe('CommentsPageComponent', () => {
  let component: CommentsPagecomponent;
  let fixture: ComponentFixture<CommentsPagecomponent>;
  let commentService: TaxCommentService;
  let mockedResp = {
    "success": true,
    "message": "",
    "corelationId": null,
    "data": [],
    "error": null
  }
  let mockedCommentDetailPerProdCycle = {
    "success": true,
    "message": "",
    "corelationId": "127a8df2-ffd5-4c6f-b7dd-82e50d5fb552",
    "data": {
        "totalOpen": 33,
        "totalClosed": 27,
        "open": [
            {
                "target": "EY",
                "status": "OPEN",
                "value": 33
            },
            {
                "target": "CLIENT",
                "status": "OPEN",
                "value": 33
            }
        ],
        "closed": [
            {
                "target": "CLIENT",
                "status": "ACCEPTED",
                "value": 8
            },
            {
                "target": "CLIENT",
                "status": "DECLINED",
                "value": 3
            },
            {
                "target": "EY",
                "status": "ACCEPTED",
                "value": 11
            },
            {
                "target": "EY",
                "status": "DECLINED",
                "value": 5
            }
        ]
    },
    "error": null
  }
  let mockedCycleCommentsDetails = {
    "success": true,
    "message": "",
    "corelationId": "12345-34567-789gh-45ruiyt",
    "data": [
        {
            "fundDTO": {
                "id": "01KV7KIYDTCHO7VZYWPVAYVMCX5K5OT5IN",
                "name": "7047 - T. Rowe Price Global Allocation Fund",
                "hasContent": true,
                "status": "open",
                "openCommentsEY": 2,
                "openCommentsClient": 0,
                "totalComments": 2,
                "assignedUsers": [
                    {
                        "userId": 9,
                        "userEmail": "francisco.carmona.garcia@ey.com",
                        "userFirstName": "Francisco",
                        "userLastName": "Carmona Garcia"
                    },
                    {
                        "userId": 7,
                        "userEmail": "jonnathan.caballero@ey.com",
                        "userFirstName": "Jonnathan",
                        "userLastName": "Caballero"
                    },
                    {
                        "userId": 3,
                        "userEmail": "diego.garavito.henao@ey.com",
                        "userFirstName": "Diego",
                        "userLastName": "Garavito Henao"
                    },
                    {
                        "userId": 5,
                        "userEmail": "diego.morini@ey.com",
                        "userFirstName": "Diego",
                        "userLastName": "Morini"
                    }
                ]
            },
            "tasks": [
                {
                    "id": 1,
                    "entityId": "01KV7KIYDTCHO7VZYWPVAYVMCX5K5OT5IN",
                    "description": "Comment two Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
                    "status": "OPEN",
                    "priority": 1,
                    "target": "CLIENT",
                    "company": "EY",
                    "author": null,
                    "createdBy": "anonymousUser",
                    "createdDate": "2021-10-21T12:02:30.43",
                    "tags": [
                        {
                            "id": 1,
                            "name": "Edit required",
                            "description": "Indicates that deliverable files need to be updated"
                        },
                        {
                            "id": 2,
                            "name": "Include in debrief",
                            "description": "Indicates that deliverable files need to be included in the cycle debrief"
                        }
                    ],
                    "replyCount": 13,
                    "attachments": []
                },
                {
                    "id": 2,
                    "entityId": "01KV7KIYDTCHO7VZYWPVAYVMCX5K5OT5IN",
                    "description": "This is a comment ",
                    "status": "ACCEPTED",
                    "priority": 1,
                    "target": "EY",
                    "company": "EY",
                    "author": {
                        "userId": 7,
                        "userEmail": "jonnathan.caballero@ey.com",
                        "userFirstName": "Jonnathan",
                        "userLastName": "Caballero"
                    },
                    "createdBy": "Jonnathan.Caballero@ey.com",
                    "createdDate": "2021-10-22T03:33:07.23",
                    "tags": [],
                    "replyCount": 8,
                    "attachments": []
                }
            ]
        },
        {
            "fundDTO": {
                "id": "01KV7KIYEUI5ES5WMBGVHLKGFAUFVV5YVI",
                "name": "70FB - T. Rowe Price European Stock Fund",
                "hasContent": true,
                "status": "open",
                "openCommentsEY": 0,
                "openCommentsClient": 1,
                "totalComments": 1,
                "assignedUsers": [
                    {
                        "userId": 4,
                        "userEmail": "jesus.toscano@ey.com",
                        "userFirstName": "Jesus",
                        "userLastName": "Toscano"
                    },
                    {
                        "userId": 5,
                        "userEmail": "diego.morini@ey.com",
                        "userFirstName": "Diego",
                        "userLastName": "Morini"
                    },
                    {
                        "userId": 2,
                        "userEmail": "gaston.raul.silva@ey.com",
                        "userFirstName": "Gaston",
                        "userLastName": "Silva"
                    }
                ]
            },
            "tasks": [ {
                "id": 1,
                "entityId": "01KV7KIYDTCHO7VZYWPVAYVMCX5K5OT5IN",
                "description": "Estimates Are wrong",
                "status": "OPEN",
                "priority": 0,
                "target": "CLIENT",
                "company": "EY",
                "author": null,
                "createdBy": "anonymousUser",
                "createdDate": "2021-10-17T12:02:30.43",
                "tags": [],
                "replyCount": 13,
                "attachments": []
            }]
        },
        {
            "fundDTO": {
                "id": "01KV7KIYCQDEPVH4VNLBAI7JHYYNIQJZZC",
                "name": "70V6 - T. Rowe Price European Stock Fund",
                "hasContent": true,
                "status": "open",
                "openCommentsEY": 10,
                "openCommentsClient": 0,
                "totalComments": 0,
                "assignedUsers": [
                    {
                        "userId": 9,
                        "userEmail": "francisco.carmona.garcia@ey.com",
                        "userFirstName": "Francisco",
                        "userLastName": "Carmona Garcia"
                    },
                    {
                        "userId": 5,
                        "userEmail": "diego.morini@ey.com",
                        "userFirstName": "Diego",
                        "userLastName": "Morini"
                    },
                    {
                        "userId": 3,
                        "userEmail": "diego.garavito.henao@ey.com",
                        "userFirstName": "Diego",
                        "userLastName": "Garavito Henao"
                    }
                ]
            },
            "tasks": null
        }
    ],
    "error": null
  }
  let mockedCommentList = {
    "success": true,
    "message": "",
    "corelationId": null,
    "data": [
        {
            "id": 123,
            "entityId": 111,
            "entityType": "Fund",
            "description": "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.",
            "status": "OPEN",
            "priority": 1,
            "target": "EY",
            "company": "EY",
            "author": {
                "userId": null,
                "userEmail": "Patrick.Mahomes@ey.com",
                "userFirstName": "Patrick",
                "userLastName": "Mahomes"
            },
            "createdBy": "Patrick.Mahomes@ey.com",
            "createdDate": "2021-09-21T00:00:00Z",
            "tags": [
                {
                    "id": 1,
                    "name": "Edit Required"
                },
                {
                    "id": 2,
                    "name": "Include in cycle debrief"
                }
            ],
            "replyCount": 7,
            "attachmentsCount": 3,
            "attachments": [
                {
                    "storageFileName": "ac3eb5b9-0217-4655-9c24-405b662abc4d.xlsx",
                    "fileName": "prueba.xlsx",
                    "attachmentId": 4
                },
                {
                    "storageFileName": "ac3eb5b9-0217-4655-9c24-405b662abc4d.xlsx",
                    "fileName": "prueba.xlsx",
                    "attachmentId": 4
                },
                {
                    "storageFileName": "SOME_STORAGE_FILE_NAME",
                    "fileName": "File_name_012345589.xls",
                    "attachmentId": 1
                }
            ]
        },
        {
            "id": 1234,
            "entityId": 111,
            "entityType": "Fund",
            "description": "Please fix the file. Calculations are wrong 1234",
            "status": "OPEN",
            "priority": 1,
            "target": "CLIENT",
            "company": "Client",
            "author": {
                "userId": null,
                "userEmail": "David.Miller@ey.com",
                "userFirstName": "David",
                "userLastName": "Miller"
            },
            "createdBy": "David.Miller@ey.com",
            "createdDate": "2021-09-21T00:00:00Z",
            "tags": [],
            "replyCount": 8,
            "attachmentsCount": 0,
            "attachments": [
                {
                    "storageFileName": "ac3eb5b9-0217-4655-9c24-405b662abc4d.xlsx",
                    "fileName": "prueba.xlsx",
                    "attachmentId": 4
                }
            ]
        },
        {
            "id": 12345,
            "entityId": 111,
            "entityType": "Fund",
            "description": "Please fix the file. Calculations are wrong 12345",
            "status": "OPEN",
            "priority": 0,
            "target": "CLIENT",
            "company": "Client",
            "author": {
                "userId": null,
                "userEmail": "Eric.Taylor@ey.com",
                "userFirstName": "Eric",
                "userLastName": "Taylor"
            },
            "createdBy": "Eric.Taylor@ey.com",
            "createdDate": "2021-09-21T00:00:00Z",
            "tags": [],
            "replyCount": 0,
            "attachmentsCount": 5,
            "attachments": [
                {
                    "storageFileName": "ac3eb5b9-0217-4655-9c24-405b662abc4d.xlsx",
                    "fileName": "prueba.xlsx",
                    "attachmentId": 4
                },
                {
                    "storageFileName": "ac3eb5b9-0217-4655-9c24-405b662abc4d.xlsx",
                    "fileName": "prueba.xlsx",
                    "attachmentId": 4
                },
                {
                    "storageFileName": "SOME_STORAGE_FILE_NAME",
                    "fileName": "File_name_012345589.xls",
                    "attachmentId": 1
                }
            ]
        },
        {
            "id": 123456,
            "entityId": 111,
            "entityType": "Fund",
            "description": "Please fix the file. Calculations are wrong 123456",
            "status": "ACCEPTED",
            "priority": 1,
            "target": "EY",
            "company": "EY",
            "author": {
                "userId": null,
                "userEmail": "Michael.Brown@ey.com",
                "userFirstName": "Michael",
                "userLastName": "Brown"
            },
            "createdBy": "Michael.Brown@ey.com",
            "createdDate": "2021-09-21T00:00:00Z",
            "tags": [
                {
                    "id": 1,
                    "name": "Edit Required"
                }
            ],
            "replyCount": 0,
            "attachmentsCount": 8,
            "attachments": [
                {
                    "storageFileName": "ac3eb5b9-0217-4655-9c24-405b662abc4d.xlsx",
                    "fileName": "prueba.xlsx",
                    "attachmentId": 4
                }
            ]
        },
        {
            "id": 1234567,
            "entityId": 111,
            "entityType": "Fund",
            "description": "Please fix the file. Calculations are wrong 1234567",
            "status": "DECLINED",
            "priority": 1,
            "target": "EY",
            "company": "EY",
            "author": null,
            "createdBy": "Michael.Brown@ey.com",
            "createdDate": "2021-09-21T00:00:00Z",
            "tags": [
                {
                    "id": 2,
                    "name": "Include in cycle debrief"
                }
            ],
            "replyCount": 0,
            "attachmentsCount": 9,
            "attachments": [
                {
                    "storageFileName": "ac3eb5b9-0217-4655-9c24-405b662abc4d.xlsx",
                    "fileName": "prueba.xlsx",
                    "attachmentId": 4
                }
            ]
        }
    ],
    "error": null
  };
  let commentServiceStub = {
    addTask: () =>  {return of(mockedResp)},
    addComment: () => {return of(mockedResp)},
    uploadFile: () => {return of(mockedResp)},
    getTasksData: () => {return of(mockedCommentList)},
    updateTaskStatus: () => {return of(mockedResp)},
    listComments: () => {return of(mockedResp)},
    deleteTag: () => {return of(mockedResp)},
    addTag: () => {return of(mockedResp)},
    updatePriority: () => {return of(mockedResp)},
    downloadFile: () => {return of(mockedResp)},
    cycleCommentsDetails: () => {return of(mockedCycleCommentsDetails)},
    getCommentsDetailsPerProductCycle: () => {return of(mockedCommentDetailPerProdCycle)},
    getCommentExpandDetails: () => {return of(mockedResp)},
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommentsPagecomponent ],
      imports: [
        MatDialogModule,
        RouterTestingModule,
        HttpClientTestingModule,
        RouterModule.forRoot([])
      ],
      providers: [
          AssignmentsFundsService,
          TaxCommentService,
          {provide: TaxCommentService, userValue: commentServiceStub},
          {provide:"taxapiEndpoint",  useValue: taxenvironment.apiEndpoint},
          {provide:"taxProduction",  useValue: taxenvironment.production},
          {provide: MatDialogRef, useValue: {} },
          {provide: MAT_DIALOG_DATA, useValue: {} },]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentsPagecomponent);
    commentService = TestBed.get(TaxCommentService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should check the service', () => {
    expect(commentService instanceof TaxCommentService).toBeTruthy();
  });
  it('ngOnInit method set route params, call getComments function and set comment details',()=>{
    spyOn(component, 'getComments');
    component.ngOnInit();
    expect(component.getComments).toHaveBeenCalled();
  });
  it('getComments method get taskData by fundId, and call updateHasOpenComments and countStatusTasks functions',()=>{
    spyOn(component['commentService'], 'getTasksData').and.callFake(() => {
      return of(mockedCommentList)
    });
    spyOn(component, 'updateHasOpenComments');
    spyOn(component, 'countStatusTasks');
    let mockedCompletedComments = [];
    let mockedType ='CLIENT'
    component.type = mockedType;
    mockedCommentList['data'].forEach((item : any) => {
      const eachitem: any = {
        id: item.id,
        entityId: item.entityId,
        entityType: item.entityType,
        description: item.description,
        status: item.status,
        priority: item.priority,
        target: item.target,
        company: item.company,
        author: item.author,
        createdBy: item.createdBy,
        createdDate: item.createdDate,
        tags: item.tags,
        replyCount: item.replyCount,
        attachmentsCount: (item.attachmentsCount == undefined || item.attachmentsCount == null) ? 0 : item.attachmentsCount,
        attachments:item.attachments,
        priorityToFind: item.priority == 1 ? "critical":"",
        tagEditTofind: item.tags.length > 0 ? (item.tags.find(tag => tag.id == 1) != undefined ? item.tags.find(tag => tag.id == 1).name.toLowerCase(): "" ) : "",
        tagIncludeTofind: item.tags.length > 0 ? (item.tags.find(tag => tag.id == 2) != undefined ? item.tags.find(tag => tag.id == 2).name.toLowerCase(): "" ) : "",
        authorTofind: item.author != null ? item.author.userFirstName + " " + item.author.userLastName : item.createdBy
      };
      mockedCompletedComments.push(eachitem);
    });
    let filteredComments = mockedCompletedComments.filter(item => (item.target.toUpperCase() === mockedType.toUpperCase() && item.status.toUpperCase() === "OPEN"));
    component.getComments();
    expect(component.updateHasOpenComments).toHaveBeenCalled();
    expect(component.countStatusTasks).toHaveBeenCalled();
    expect(component.completedComments).toEqual(mockedCompletedComments);
    expect(component.emptyCommentSearch).toEqual(false);
    expect(component.filteredComments).toEqual(filteredComments);
  });
  it('showOpenComments method should show or hide comments depending on the list of completedComments',()=>{
    let mockedTextToFind = 'test';
    component.textTofind = mockedTextToFind;
    component.completedComments = [1,2];
    spyOn(component, 'searchActiveComments');
    component.showOpenComments();
    expect(component.showOnlyOpenComments).toEqual(true);
    expect(component.searchActiveComments).toHaveBeenCalledWith(mockedTextToFind);
  });
  it('commentStatusUpdated method should find comment by id and change status, set the hasOpenComments variable and call countStatusTasks',()=>{
    let mockedCommentItem = {
      id: 123,
      status: 'OPEN'
    };
    let mockedCompletedComments = [];
    mockedCommentList['data'].forEach((item : any) => {
      const eachitem: any = {
        id: item.id,
        entityId: item.entityId,
        entityType: item.entityType,
        description: item.description,
        status: item.status,
        priority: item.priority,
        target: item.target,
        company: item.company,
        author: item.author,
        createdBy: item.createdBy,
        createdDate: item.createdDate,
        tags: item.tags,
        replyCount: item.replyCount,
        attachmentsCount: (item.attachmentsCount == undefined || item.attachmentsCount == null) ? 0 : item.attachmentsCount,
        attachments:item.attachments,
        priorityToFind: item.priority == 1 ? "critical":"",
        tagEditTofind: item.tags.length > 0 ? (item.tags.find(tag => tag.id == 1) != undefined ? item.tags.find(tag => tag.id == 1).name.toLowerCase(): "" ) : "",
        tagIncludeTofind: item.tags.length > 0 ? (item.tags.find(tag => tag.id == 2) != undefined ? item.tags.find(tag => tag.id == 2).name.toLowerCase(): "" ) : "",
        authorTofind: item.author != null ? item.author.userFirstName + " " + item.author.userLastName : item.createdBy
      };
      mockedCompletedComments.push(eachitem);
    });
    component.completedComments = mockedCompletedComments;
    spyOn(component, 'countStatusTasks');
    component.commentStatusUpdated(mockedCommentItem);
    expect(component.hasOpenComments).toEqual(true);
    expect(component.countStatusTasks).toHaveBeenCalled();
  });
  it('updateHasOpenComments method should set hasOpenComments variable and call isOpenStatus function',()=>{
    spyOn(component, 'updateHasOpenComments');
    let mockedCommenctStatus = 'OPEN'
    component.updateHasOpenComments(mockedCommenctStatus);
    expect(component.hasOpenComments).toEqual(false);
    expect(component.updateHasOpenComments).toHaveBeenCalledWith(mockedCommenctStatus)
  });
  it('backtoCycleView method should navigate to cycle-details path',()=>{
    spyOn(component['router'],'navigate');
    component.cycleId = '1';
    component.productCycleName = 'test';
    const url =  ['cycle-details', '1','test'];
    component.backtoCycleView();
    expect(component['router'].navigate).toHaveBeenCalledWith(url)
  });
  it('isOpenStatus method should return true or false depending on the status',()=>{
    expect(component.isOpenStatus('open')).toEqual(true)
  });
  it('canAddComments method should return true or false depending on the permissions',()=>{
    expect(component.canAddComments()).toEqual(false)
  });
  it('canApprove method should return true or false depending on the permissionApproval, isApproved and hasOpenComments variables',()=>{
    component.permissionApproval = true;
    component.isApproved = false;
    component.hasOpenComments = false;
    expect(component.canApprove()).toEqual(true)
  });
  it('closeToast method should set showToastAfterSubmit variable to false',()=>{
    component. closeToast();
    expect(component.showToastAfterSubmit).toEqual(false)
    });
    it('searchCommentsValidation method should set showToastAfterSubmit variable to false',()=>{
        component. closeToast();
        expect(component.showToastAfterSubmit).toEqual(false)
    });
     
  it(`searchCommentsValidation method should validate the event input`, () => {
    let keyEvent = new KeyboardEvent('keyCode', {key: "abc"},);
    const checkVal = component.searchCommentsValidation(keyEvent);
    expect(checkVal).toBeFalsy();
  }); 
  it(`searchActiveComments method should filter the completedComments for a match`, () => {
    spyOn(component['commentService'], 'getTasksData').and.callFake(() => {
        return of(mockedCommentList)
    });
    let inputFilter = 'EY';
    let mockedCompletedComments = [];
    mockedCommentList['data'].forEach((item : any) => {
        const eachitem: any = {
          id: item.id,
          entityId: item.entityId,
          entityType: item.entityType,
          description: item.description,
          status: item.status,
          priority: item.priority,
          target: item.target,
          company: item.company,
          author: item.author,
          createdBy: item.createdBy,
          createdDate: item.createdDate,
          tags: item.tags,
          replyCount: item.replyCount,
          attachmentsCount: (item.attachmentsCount == undefined || item.attachmentsCount == null) ? 0 : item.attachmentsCount,
          attachments:item.attachments,
          priorityToFind: item.priority == 1 ? "critical":"",
          tagEditTofind: item.tags.length > 0 ? (item.tags.find(tag => tag.id == 1) != undefined ? item.tags.find(tag => tag.id == 1).name.toLowerCase(): "" ) : "",
          tagIncludeTofind: item.tags.length > 0 ? (item.tags.find(tag => tag.id == 2) != undefined ? item.tags.find(tag => tag.id == 2).name.toLowerCase(): "" ) : "",
          authorTofind: item.author != null ? item.author.userFirstName + " " + item.author.userLastName : item.createdBy
        };
        mockedCompletedComments.push(eachitem);
    });
    let filtersArray = ['authorTofind','description','priorityToFind','tagEditTofind','tagIncludeTofind'];
    let mockedFilteredComments = mockedCompletedComments.filter(element => {    
        return filtersArray.filter(filterElement => {          
          return element[filterElement].toLowerCase().indexOf(inputFilter) > -1
          }).length > 0;
    });
    component.showOnlyOpenComments = false;
    component.type = '';
    component.searchActiveComments(inputFilter);
    expect(component.filteredComments).toEqual(mockedFilteredComments);
    expect(component.emptyCommentSearch).toEqual(false);
  }); 
  it('onPasteSearchActiveComments method should search data on paste', ()=>{
    const pasteData = new DataTransfer();
    pasteData.setData('text', 'asd');
    const pasteEvent = new ClipboardEvent('paste', {
      clipboardData: pasteData
    } as any);
    component.onPasteSearchActiveComments(pasteEvent);
  });
  it('countStatusTasks method should search data on paste', ()=>{
    let mockedType = 'EY';
    component.type = mockedType;
    let mockedCompletedComments = [];
    mockedCommentList['data'].forEach((item : any) => {
        const eachitem: any = {
          id: item.id,
          entityId: item.entityId,
          entityType: item.entityType,
          description: item.description,
          status: item.status,
          priority: item.priority,
          target: item.target,
          company: item.company,
          author: item.author,
          createdBy: item.createdBy,
          createdDate: item.createdDate,
          tags: item.tags,
          replyCount: item.replyCount,
          attachmentsCount: (item.attachmentsCount == undefined || item.attachmentsCount == null) ? 0 : item.attachmentsCount,
          attachments:item.attachments,
          priorityToFind: item.priority == 1 ? "critical":"",
          tagEditTofind: item.tags.length > 0 ? (item.tags.find(tag => tag.id == 1) != undefined ? item.tags.find(tag => tag.id == 1).name.toLowerCase(): "" ) : "",
          tagIncludeTofind: item.tags.length > 0 ? (item.tags.find(tag => tag.id == 2) != undefined ? item.tags.find(tag => tag.id == 2).name.toLowerCase(): "" ) : "",
          authorTofind: item.author != null ? item.author.userFirstName + " " + item.author.userLastName : item.createdBy
        };
        mockedCompletedComments.push(eachitem);
    });
    let mockedFilteredComments = mockedCompletedComments.filter(item => (item.target.toUpperCase() === mockedType.toUpperCase() && item.status.toUpperCase() === "OPEN"));
    component.filteredComments = mockedFilteredComments;
    component.countStatusTasks();
    expect(component.taskCount).toEqual(1);
    expect(component.openTaskCount).toEqual(1);
    expect(component.isData).toEqual(true);
    expect(component.hasOpenComments).toEqual(true);
    expect(component.emptyCommentSearch).toEqual(false);
    expect(component.filteredComments).toEqual(mockedFilteredComments);
  });

  it('should get getComments', () => {
    let commentsList = []
    fixture.detectChanges();
    const result$ = commentService.getTasksData(1);
    result$.subscribe(resp  => {
      resp['data'].forEach((item) => {
        if (item.fundDTO.totalComments > 0) {
          item.tasks.forEach(itemTask => {
            const eachitem: any = {
                id: item.id,
                entityId: item.entityId,
                entityType: item.entityType,
                description: item.description,
                status: item.status,
                priority: item.priority,
                target: item.target,
                company: item.company,
                author: item.author,
                createdBy: item.createdBy,
                createdDate: item.createdDate,
                tags: item.tags,
                replyCount: item.replyCount,
                attachmentsCount: (item.attachmentsCount == undefined || item.attachmentsCount == null) ? 0 : item.attachmentsCount,
                attachments:item.attachments,
                priorityToFind: item.priority == 1 ? "critical":"",
                tagEditTofind: item.tags.length > 0 ? (item.tags.find(tag => tag.id == 1) != undefined ? item.tags.find(tag => tag.id == 1).name.toLowerCase(): "" ) : "",
                tagIncludeTofind: item.tags.length > 0 ? (item.tags.find(tag => tag.id == 2) != undefined ? item.tags.find(tag => tag.id == 2).name.toLowerCase(): "" ) : "",
                authorTofind: item.author != null ? item.author.userFirstName + " " + item.author.userLastName : item.createdBy
              };
            commentsList.push(eachitem);
          });
        }
      });
    })
    expect(component.completedComments).toEqual(commentsList);
  });

});