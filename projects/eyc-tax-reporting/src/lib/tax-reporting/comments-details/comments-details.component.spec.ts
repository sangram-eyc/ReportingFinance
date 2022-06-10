import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { taxenvironment } from '../../../../../../src/environments/eyc-tax-reporting/tax-environment';
import { AssignmentsFundsService } from '../services/assignments-funds.service';
import { TaxCommentService } from '../services/tax-comment.service';
import { CommentsDetailsComponent } from './comments-details.component';

describe('CommentsDetailsComponent', () => {
  let component: CommentsDetailsComponent;
  let fixture: ComponentFixture<CommentsDetailsComponent>;
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
  let commentServiceStub = {
    addTask: () =>  {return of(mockedResp)},
    addComment: () => {return of(mockedResp)},
    uploadFile: () => {return of(mockedResp)},
    getTasksData: () => {return of(mockedResp)},
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
      declarations: [ CommentsDetailsComponent ],
      imports: [
        MatDialogModule,
        RouterTestingModule,
        HttpClientTestingModule,
        RouterModule.forRoot([]),
        BrowserModule,
      ],
      providers: [
          AssignmentsFundsService,
          TaxCommentService,
          {provide:TaxCommentService,  useValue: commentServiceStub},
          {provide:"taxapiEndpoint",  useValue: taxenvironment.apiEndpoint},
          {provide:"taxProduction",  useValue: taxenvironment.production},
          {provide: MatDialogRef, useValue: {} },
          {provide: MAT_DIALOG_DATA, useValue: {} },]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentsDetailsComponent);
    commentService = TestBed.get(TaxCommentService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('ngOnInit method set route params, call getCommentsList function and set comment details',()=>{
    spyOn(component, 'getCommentsList');
    let openByEY = mockedCommentDetailPerProdCycle.data.open.find(status => status.target === 'EY')
    let openByClient = mockedCommentDetailPerProdCycle.data.open.find(status => status.target === 'CLIENT')
    let AcceptedByEY = mockedCommentDetailPerProdCycle.data.closed.find(status => status.target === 'EY' && status.status === "ACCEPTED")
    let DeclinedByEY = mockedCommentDetailPerProdCycle.data.closed.find(status => status.target === 'EY' && status.status === "DECLINED")
    let AcceptedByClient = mockedCommentDetailPerProdCycle.data.closed.find(status => status.target === 'CLIENT' && status.status === "ACCEPTED")
    let DeclinedByClient = mockedCommentDetailPerProdCycle.data.closed.find(status => status.target === 'CLIENT' && status.status === "DECLINED")
    let mockedTextCountNumber = Number(mockedCommentDetailPerProdCycle.data.totalOpen) + Number(mockedCommentDetailPerProdCycle.data.totalClosed);
    let mockedTotalOpenedCommentsDetails =

        [
          {
            "label": "Open client comments",
            "value": (openByClient != undefined) ? openByClient.value : 0,
          },
          {
            "label": "Open EY comments",
            "value": (openByEY != undefined) ? openByEY.value : 0,
          }
    ];
    let mockedTotalClosedCommentsDetails =
        [
          {
            "label": "Accepted",
            "value": ((AcceptedByEY != undefined) ? AcceptedByEY.value : 0 )  +  ( (AcceptedByClient != undefined) ? AcceptedByClient.value : 0)
          },
          {
            "label": "Declined",
            "value": ((DeclinedByEY != undefined) ? DeclinedByEY.value : 0 )  +  ( (DeclinedByClient != undefined) ? DeclinedByClient.value : 0)
          }
    ];
    component.ngOnInit();
    expect(component.getCommentsList).toHaveBeenCalled();
    expect(component.totalOpenedComments).toEqual(mockedCommentDetailPerProdCycle.data.totalOpen);
    expect(component.totalClosedComments).toEqual(mockedCommentDetailPerProdCycle.data.totalClosed);
    expect(component.textCountNumber).toEqual(mockedTextCountNumber);
    expect(component.totalOpenedCommentsDetails).toEqual(mockedTotalOpenedCommentsDetails);
    expect(component.totalClosedCommentsDetails).toEqual(mockedTotalClosedCommentsDetails);
  });

  it('backtoCycleView method should navigate to cycle-details path',()=>{
    spyOn(component['router'],'navigate');
    component.productCycleId = 1;
    component.productCycleName = 'test';
    const url =  ['cycle-details', 1,'test'];
    component.backtoCycleView();
    expect(component['router'].navigate).toHaveBeenCalledWith(url)
  });
  
  it('should get getCommentsList', () => {
    let commentsList = []
    fixture.detectChanges();
    const result$ = commentService.cycleCommentsDetails(10);
    console.log(result$);
    result$.subscribe(resp  => {
      resp['data'].forEach((item) => {
        if (item.fundDTO.totalComments > 0) {
          item.tasks.forEach(itemTask => {
            const eachitem: any = {
              id: itemTask.id,
              entityId: item.fundDTO.id,
              entityName: item.fundDTO.name,
              description: itemTask.description,
              completedComment: itemTask.description,
              status: itemTask.status.toLowerCase(),
              priority: itemTask.priority,
              target: itemTask.target.toUpperCase(),
              company: itemTask.company,
              author: itemTask.author != null ? (itemTask.author.userFirstName + " " + itemTask.author.userLastName) : itemTask.createdBy, //toDo if null
              createdBy: itemTask.createdBy,
              createdDate: itemTask.createdDate,
              tags: itemTask.tags,
              replyCount: itemTask.replyCount,
              assignedTo: item.fundDTO.assignedUsers == null ? [] : item.fundDTO.assignedUsers
            };
            commentsList.push(eachitem);
          });
        }
      });
    })
    expect(component.completedComments).toEqual(commentsList);
  });

  it('should call getCommentsList from the service and call createCommentsRowData', () => {
    component.completedComments = [];
    let mockedCompletedComments = [];
    spyOn(component['commentService'], 'cycleCommentsDetails').and.callFake(() => {
      return of(mockedCycleCommentsDetails)
    });
    spyOn(component, 'createCommentsRowData');
    mockedCycleCommentsDetails['data'].forEach((item: any) => {
      if (item.fundDTO.totalComments > 0) {
        item.tasks.forEach(itemTask => {
          const eachitem: any = {
            id: itemTask.id,
            entityId: item.fundDTO.id,
            entityName: item.fundDTO.name,
            description: itemTask.description,
            completedComment: itemTask.description,
            status: itemTask.status.toLowerCase(),
            priority: itemTask.priority,
            target: itemTask.target.toUpperCase(),
            company: itemTask.company,
            author: itemTask.author != null ? (itemTask.author.userFirstName + " " + itemTask.author.userLastName) : itemTask.createdBy, //toDo if null
            createdBy: itemTask.createdBy,
            createdDate: itemTask.createdDate,
            tags: itemTask.tags,
            replyCount: itemTask.replyCount,
            assignedTo: item.fundDTO.assignedUsers == null ? [] : item.fundDTO.assignedUsers
          };
          mockedCompletedComments.push(eachitem);
        });
      }
    });
    component.getCommentsList();
    expect(component.completedComments).toEqual(mockedCompletedComments);
    expect(component.createCommentsRowData).toHaveBeenCalledWith(mockedCompletedComments);
  });

  it('createCommentsRowData method should populate rowData and call isToggleLeftDisabled function', () => {
    let mockedRowData = [];
    let mockedCompletedComments = [];
    spyOn(component, 'isToggleLeftDisabled');
    mockedCycleCommentsDetails['data'].forEach((item: any) => {
      if (item.fundDTO.totalComments > 0) {
        item.tasks.forEach(itemTask => {
          const eachitem: any = {
            id: itemTask.id,
            entityId: item.fundDTO.id,
            entityName: item.fundDTO.name,
            description: itemTask.description,
            completedComment: itemTask.description,
            status: itemTask.status.toLowerCase(),
            priority: itemTask.priority,
            target: itemTask.target.toUpperCase(),
            company: itemTask.company,
            author: itemTask.author != null ? (itemTask.author.userFirstName + " " + itemTask.author.userLastName) : itemTask.createdBy, //toDo if null
            createdBy: itemTask.createdBy,
            createdDate: itemTask.createdDate,
            tags: itemTask.tags,
            replyCount: itemTask.replyCount,
            assignedTo: item.fundDTO.assignedUsers == null ? [] : item.fundDTO.assignedUsers
          };
          mockedCompletedComments.push(eachitem);
        });
      }
    });
    component.createCommentsRowData(mockedCompletedComments);
    mockedCompletedComments.forEach((item) =>{
        mockedRowData.push({
        id: item.id,
        entityId: item.entityId,
        entityName: item.entityName,
        description: item.description,
        splitComment: item.description.match(/.{1,35}/g),
        completedComment: item.completedComment.match(/.{1,50}/g),
        status: item.status,
        priority: item.priority,
        target: item.target,
        company: item.company,
        author: item.author,
        createdBy: item.createdBy,
        createdDate: item.createdDate,
        tags: item.tags,
        replyCount: item.replyCount,
        assignedTo: item.assignedUsers == null ? [] : item.assignedUsers,
        tagsToSearch: item.priority == 1 ? component.splitTags(item.tags, true): component.splitTags(item.tags, false)
      })
    });
    expect(component.rowData).toEqual(mockedRowData);
    expect(component.isToggleLeftDisabled).toHaveBeenCalled();
  });

  it('showMyAssignedFunds method should call gridFilter and storage userEmail', () => {
    component.completedComments = [1,2];
    component.showOnlyMyAssignedFunds = false;
    spyOn(component, 'gridFilter');
    spyOn(sessionStorage, 'getItem').and.returnValue("test");
    component.showMyAssignedFunds();
    expect(component.gridFilter).toHaveBeenCalledWith('test');
    expect(sessionStorage.getItem).toHaveBeenCalledWith('userEmail');
  });

  it('gridFilter method should filter by assigned fund and call createCommentsRowData function', () => {
    let mockedCompletedComments = [];
    mockedCycleCommentsDetails['data'].forEach((item: any) => {
      if (item.fundDTO.totalComments > 0) {
        item.tasks.forEach(itemTask => {
          const eachitem: any = {
            id: itemTask.id,
            entityId: item.fundDTO.id,
            entityName: item.fundDTO.name,
            description: itemTask.description,
            completedComment: itemTask.description,
            status: itemTask.status.toLowerCase(),
            priority: itemTask.priority,
            target: itemTask.target.toUpperCase(),
            company: itemTask.company,
            author: itemTask.author != null ? (itemTask.author.userFirstName + " " + itemTask.author.userLastName) : itemTask.createdBy, //toDo if null
            createdBy: itemTask.createdBy,
            createdDate: itemTask.createdDate,
            tags: itemTask.tags,
            replyCount: itemTask.replyCount,
            assignedTo: item.fundDTO.assignedUsers == null ? [] : item.fundDTO.assignedUsers
          };
          mockedCompletedComments.push(eachitem);
        });
      }
    });
    component.completedComments = mockedCompletedComments;
    spyOn(component, 'createCommentsRowData');
    let filterKey = 'jonnathan.caballero@ey.com';
    let res;
    let mockedArrfilterFunds = mockedCompletedComments.filter(fund => {
      let filterByFund = fund.assignedTo.find((assignedByFund) => {
        return assignedByFund.userEmail.toLowerCase() == filterKey
      })
      res = (filterByFund == undefined) ? false : true;
      return res;
    })
    component.gridFilter(filterKey);
    expect(component.createCommentsRowData).toHaveBeenCalledWith(mockedArrfilterFunds);
  });

  it('isToggleLeftDisabled method should check completedComments and set disabledLeftToggle variable', () => {
    component.isToggleLeftDisabled();
    expect(component.disabledLeftToggle).toEqual(false);
  });
  
  it('handleGridReady method should set grid', () => {
    let mockData = {
      api: '/data'
    };
    component.handleGridReady(mockData);
    expect(component.gridApi).toEqual('/data')
  });

  it('searchGrid method should set quick filter and set searchNoDataAvilable variable', () => {
    let mockedGrid = {
      setQuickFilter: (input) => {
        return [{ column: '' }]
      },
      rowModel: {
        rowsToDisplay : 1
      }
    };
    component.gridApi = mockedGrid;
    component.searchGrid(mockedGrid);
    expect(component.searchNoDataAvilable).toEqual(false)
  });

  it('splitAssignedUser method should split users',()=>{ 
    let users = [{name: "test"},{name: "test"}];
    let expectedResponse = 'test,test';
    expect(component.splitTags(users,false)).toEqual(expectedResponse);
  });

  it('openDialog method should call commentService and expandDetails',()=>{ 
    let mockedCommentExpand = {
      "success": true,
      "message": "",
      "corelationId": null,
      "data" : {
          "taskResponse": {
              "id": 110,
              "entityId": "01KV7KIYCQDEPVH4VNLBAI7JHYYNIQJZZC",
              "description": "Test comment.",
              "status": "OPEN",
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
              "createdDate": "2021-10-19T13:42:38.723",
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
              "replyCount": 0,
              "attachments": [
                  {
                      "storageFileName": "ac3eb5b9-0217-4655-9c24-405b662abc4d.xlsx",
                      "fileName": "prueba.xlsx",
                      "attachmentId": 4
                  }
              ]
          },
          "repliesDetail": [
              {
                  "commentId": 1,
                  "commentText": "This is a test comment",
                  "assignee": null,
                  "timeStamp": 1633419658603,
                  "status": "NEW",
                  "replies": [],
                  "commentGrouping": "FILING",
                  "authorFirstName": "anonymousUser",
                  "authorLastName": "",
                  "attachments": []
              },
              {
                  "commentId": 2,
                  "commentText": "This is a test comment",
                  "assignee": null,
                  "timeStamp": 1633420462725,
                  "status": "NEW",
                  "replies": [],
                  "commentGrouping": "FILING",
                  "authorFirstName": "anonymousUser",
                  "authorLastName": "",
                  "attachments": []
              },
              {
                  "commentId": 3,
                  "commentText": "This is a test comment",
                  "assignee": null,
                  "timeStamp": 1633422333470,
                  "status": "NEW",
                  "replies": [],
                  "commentGrouping": "FILING",
                  "authorFirstName": "Diego",
                  "authorLastName": "Morini",
                  "attachments": []
              },
              {
                  "commentId": 4,
                  "commentText": "This is a test comment 2",
                  "assignee": null,
                  "timeStamp": 1633422833135,
                  "status": "NEW",
                  "replies": [],
                  "commentGrouping": "FILING",
                  "authorFirstName": "Diego",
                  "authorLastName": "Morini",
                  "attachments": []
              }
          ]
      },
      "error": null
    }
    spyOn(component['commentService'], 'getCommentExpandDetails').and.callFake(() => {
      return of(mockedCommentExpand)
    });
    spyOn(component, 'getCommentsList');
    component.openDialog(1);
    const item = mockedCommentExpand['data'].taskResponse;
    const _replies = mockedCommentExpand['data'].repliesDetail;
    const comment: any = {
        id: item.id,
        entityId: item.entityId,
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
        attachments:item.attachments,
        priorityToFind: item.priority == 1 ? "critical":"",
        tagEditTofind: item.tags.length > 0 ? (item.tags.find(tag => tag.id == 1) != undefined ? item.tags.find(tag => tag.id == 1).name.toLowerCase(): "" ) : "",
        tagIncludeTofind: item.tags.length > 0 ? (item.tags.find(tag => tag.id == 2) != undefined ? item.tags.find(tag => tag.id == 2).name.toLowerCase(): "" ) : "",
        authorTofind: item.author != null ? item.author.userFirstName + " " + item.author.userLastName : item.createdBy,
        replies : _replies
    };
    let mockedCommentDetails = comment;      
    expect(component.commentDetails).toEqual(mockedCommentDetails);
  });
});
