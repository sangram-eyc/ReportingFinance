import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { TeamsService } from '../services/teams.service';
import { MotifTableCellRendererComponent } from '@ey-xd/ng-motif';
import { MatDialog } from '@angular/material/dialog';
import { DEFAULT_PAGE_SIZE, customComparator, ModalComponent, PermissionService, TableHeaderRendererComponent } from 'eyc-ui-shared-component';
import { UsersService } from '../../users/services/users.service';
import { SettingService } from '../../services/setting.service';
import { AdministrationService } from '../../administration/services/administration.service';
import { IS_TEAM_DETAILS_EDITABLE, IS_TEAM_ASSIGNMNETS_TABS } from '../../config/setting-helper';
import * as commonConstants from '../../shared/common-contstants'
import { TasksService } from '../services/tasks.service'
import { DataExplorerService } from '../services/data-explorer.service'
import { CellRendererTemplateComponent } from 'eyc-ui-shared-component';
import { FilingEntityService} from '../services/filing-entity.service'
import { FilingsTabService } from '../services/filings-tab.service'

@Component({
  selector: 'app-eyc-team-details',
  templateUrl: './eyc-team-details.component.html',
  styleUrls: ['./eyc-team-details.component.scss']
})
export class EycTeamDetailsComponent implements OnInit, AfterViewInit {

  exportHeaders;
  exportUrl: string;
  exportName: any;
  constructor(private location: Location,
    private teamService: TeamsService,
    private taskService:TasksService,
    private adminService: AdministrationService,
    private activatedRoute: ActivatedRoute,
    private userService: UsersService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    public permissions: PermissionService,
    private apiHelpers: SettingService,
    private dataExplorerService: DataExplorerService,
    private filingEntityService: FilingEntityService,
    private filingsTabService:FilingsTabService) {
    const module = adminService.getCurrentModule;
    this.module = module.moduleName;
    this.moduleId = module.moduleId;
    this.editTeamForm = this._updateTeam();
    
  }

  @ViewChild('actionSection')
  actionSection: TemplateRef<any>;
  @ViewChild('toggleSwitchFilings')
  toggleSwitchFilings: TemplateRef<any>;
  @ViewChild('toggleSwitchTaskAssignments')
  toggleSwitchTaskAssignments: TemplateRef<any>;
  @ViewChild('toggleDataExplorer')
  toggleDataExplorer: TemplateRef<any>;
  @ViewChild('toggleSwitchFilingEntities')
  toggleSwitchFilingEntities: TemplateRef<any>;
  teamsListArr: any[] = [];
  teamInfo;
  curentTeamId;
  enableEditor = false;
  editTeamForm: FormGroup;
  showToastAfterEditTeam = false;
  disableAddMemberButton = false;
  fullname;
  teamResp: any[] = [];
  teamsData;
  is_editable = IS_TEAM_DETAILS_EDITABLE;
  is_enable_assignmnet_tabs = IS_TEAM_ASSIGNMNETS_TABS;
  roleList = [];
  assignments = [];
  columnDefs;
  columnDefsAgGrid;
  columnDefsAgGridTab2;
  MotifTableHeaderRendererComponent = TableHeaderRendererComponent;
  MotifTableCellRendererComponent = MotifTableCellRendererComponent;
  tabIn;
  gridApi;
  teamsMemberData: any[] = [];
  displayCheckBox = true;
  showToastAfterDeleteTeams = false;

  showToastAfterAddTeamMember;
  addTeamMemberModal = false;
  addTeamMemberForm: FormGroup;
  users;
  allUsers = []
  multiSelectValues = [];
  selectedFilings = [];
  presentRole;
  module;
  moduleId;
  currentPage = 0;
  totalRecords = 5;
  pageSize = DEFAULT_PAGE_SIZE;
  filter = '';
  sort = '';
  pageChangeFunc;
  taskAssignmentData;
  dataExplorerData;
  filingEntitiesData;
  searchNoDataAvilable = false;
  currentlySelectedPageSizeNewTabs = {
    disable: false,
    value: 10,
    name: '10',
    id: 0
  };
  submitFilingsAssignments;
  submitDisableFilings;
  selectedRows = [];
  approveBtn: any;
  cancelbtn: any;
  showToastAfterAssignmensFilings = false;
  toastMessage;
  filingTabData: any[] = [];
  exceptionModalConfig = {
    width: '550px',
    data: {
      type: "Confirmation",
      header: "Enable Selected",
      description: "Are you sure you want to enable the filings you have selected? This action will make the selected filings visbile.",
      footer: {
        style: "start",
        YesButton: "Yes",
        NoButton: "No"
      }
    }
  };
  disablefilings = {
    width: '550px',
    data: {
      type: "Confirmation",
      header: "Disable Selected",
      description: "Are you sure you want to disable the filings you have selected? This action will not make the selected filings visbile.",
      footer: {
        style: "start",
        YesButton: "Yes",
        NoButton: "No"
      }
    }
  };

  ngOnInit(): void {
    if (this.teamService.getTeamDetailsData) {
      this.pageChangeFunc = this.onPageChange.bind(this);
      const teamInfoObj = this.teamService.getTeamDetailsData;
      this.teamInfo = {
        "teamName": teamInfoObj.teamName,
        "teamDescription": unescape(teamInfoObj.teamDescription),
        "role": teamInfoObj.role,
        "assignments": '',
        "assignmentsArray": []
      }
    } else {
      this.location.back();
    }

    this.activatedRoute.params.subscribe(params => {
      this.curentTeamId = params.teamId;
      this.getFilingAssignments();
      this.getTeamDetailsData(true);
    });
    this.tabIn = 1;
    if (this.permissions.validateAllPermission('adminPermissionList', this.module, 'Update Teams')) {
      this.teamService.getRoles(this.module).subscribe(resp => {
        this.roleList = resp['data'];
      })
    }
    this.addTeamMemberForm = this._createTeamMembers();
    if (this.module == 'Regulatory Reporting'){
      this.submitFilingsAssignments = this.onSubmitFilingsAssignments.bind(this);
      this.submitDisableFilings = this.onSubmitDisableFilingsAssignments.bind(this);
    } 
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      const addMemberButton = document.querySelector('.approve-button .motif-button');
      addMemberButton.setAttribute("color", "primary-alt");
    }, 10); 
  }



  getFilingAssignments() {
    if (this.module == 'Regulatory Reporting') {
      this.teamService.getFileType().subscribe(res => {
        this.assignments = res['data']
        this.getTeamDetailsData(true);
        this.getFilingsData();
      });
    }
  }

  private _createTeamMembers() {
    return this.formBuilder.group({
      members: ['', [Validators.required]],
    });
  }

  backtoTeamVIew() {
    sessionStorage.setItem('adminTab', '1');
    this.location.back();
  }

  onPageChange() {
    this.getTeamDetailsData();
  }

  currentPageChange(event) {
    this.currentPage = event - 1;
  }

  updatePageSize(event) {
    this.pageSize = event;
    this.getTeamDetailsData();
  }

  searchGrid(input) {
    this.filter = input;
    this.currentPage = 0;
    this.getTeamDetailsData(true);
  }

  searchGrid_opc2(input){
    this.gridApi.setQuickFilter(input);
    this.searchNoDataAvilable = (this.gridApi.rowModel.rowsToDisplay.length === 0);
  }

  sortChanged(event) {
    switch(true) {
      case event === 'memberName:true':
        this.sort = 'userFirstName:true';
        break;
      case event === 'memberName:false':
        this.sort = 'userFirstName:false';
        break;
      default:
        this.sort =event;
    }
    this.getTeamDetailsData();
  }

  handleGridReady(params) {
    this.gridApi = params.api;
  }

  enableEditForm() {
    this.enableEditor = true;//!this.enableEditor;
    this.disableAddMemberButton = false;//!this.disableAddMemberButton;
  }

  getUsersList() {
    this.exportName = this.module+"_Team_Members_"
    if (this.permissions.validateAllPermission('adminPermissionList', this.module, 'Update Teams')) {
      this.userService.getAllUsersList().subscribe(resp => {
        this.allUsers = resp.data
        this.users = this.allUsers.filter(item => !this.teamsMemberData.find(item2 => item.userEmail === item2.userEmail));
      });
    }
  }

  getTeamDetailsData(resetData = false) {
    this.sort = resetData ? 'userFirstName:true' : this.sort;
    this.teamService.getTeamsDetails(this.curentTeamId).subscribe(resp => {
      this.editTeamForm.patchValue({
        teamName: this.teamInfo.teamName.trim(),
        role: this.teamInfo.role.trim(),
        teamDescription: this.teamInfo.teamDescription.trim(),
        assignments: []
      });
      if (this.module == 'Regulatory Reporting') {
        this.teamInfo["assignments"] = resp['data'].assignments.map(item => (this.assignments.find(ele => ele.formId == item.entityId)).filingName);
        this.teamInfo["assignmentsArray"] = resp['data'].assignments;
        this.selectedFilings = resp['data'].assignments.map(item => item.entityId)
      }
      this.teamsMemberData = [];
      resp['data'].teamMembers.forEach((element, i) => {
        this.teamsMemberData.push({
          userId: element.userId,
          userEmail: element.userEmail,
          memberName: element.userFirstName + ' ' + element.userLastName
        })

      this.totalRecords=resp['totalRecords'];
      });
      if (resetData) {
        this.createTeamsRowData();
      } 
    });
    this.exportName = this.module+"_"+this.teamService?.getTeamDetailsData?.teamName+"_Team_Members_";
  }


  editAct($event) {
    return {
      ngTemplate: this.actionSection,
    };
  }

  createTeamsRowData(): void {
    this.columnDefsAgGrid = [
      {
        valueGetter: "node.rowIndex + 1",
        maxWidth: 120,
        sortable: false,
        menuTabs: [],
        pinned: 'left'
        },
        {
          headerName: 'Name',
          field: 'memberName',
          width: 370,
          filter: 'agSetColumnFilter',
          filterParams: {
            buttons: ['reset']
          },
          sortable: true,
          menuTabs: ['filterMenuTab', 'generalMenuTab'],
        },
        {
          headerName: 'Email',
          field: 'userEmail',
          width: 370,
          filter: 'agSetColumnFilter',
          filterParams: {
            buttons: ['reset']
          },
          sortable: true,
          menuTabs: ['filterMenuTab', 'generalMenuTab'],
        },
        {
          cellRendererFramework: CellRendererTemplateComponent,
          cellRendererParams: this.editAct.bind(this),
          headerName: 'Actions',
          field: 'Actions',
          sortable: false,
          menuTabs: ['filterMenuTab', 'generalMenuTab'],
        }
    ]
    // this.columnDefs = [
    //   {
    //     headerComponentFramework: TableHeaderRendererComponent,
    //     headerName: 'Name',
    //     field: 'memberName',
    //     sortable: true,
    //     filter: true,
    //     wrapText: true,
    //     autoHeight: true,
    //     width: 370,
    //     comparator: customComparator
    //   },
    //   {
    //     headerComponentFramework: TableHeaderRendererComponent,
    //     headerName: 'Email',
    //     field: 'userEmail',
    //     sortable: true,
    //     filter: true,
    //     wrapText: true,
    //     autoHeight: true,
    //     width: 370,
    //     comparator: customComparator
    //   },
    //   {
    //     width: 80,
    //     headerComponentFramework: TableHeaderRendererComponent,
    //     cellRendererFramework: MotifTableCellRendererComponent,
    //     cellRendererParams: this.editAct.bind(this),
    //     headerName: 'Actions',
    //     field: 'userId',
    //     sortable: false,
    //     filter: false,
    //   }
    // ];

  }

  createFilingsRowData(): void{
    this.columnDefsAgGridTab2 = [];
    setTimeout(() => {
      this.columnDefsAgGridTab2 = [
        {
          headerCheckboxSelection: true,
          headerCheckboxSelectionFilteredOnly: true,
          checkboxSelection: true,
          valueGetter: "node.rowIndex + 1",
          maxWidth: 120,
          sortable: false,
          menuTabs: ['generalMenuTab','columnsMenuTab'],
          pinned: 'left'
          },
        {
          cellRendererFramework: CellRendererTemplateComponent,
          cellRendererParams: { ngTemplate: this.toggleSwitchFilings },
          headerName: 'Access',
          sortable: false,
          menuTabs: ['filterMenuTab', 'generalMenuTab'],
        },
        {
          headerName: 'Filing name',
          field: 'filingName',
          filter: 'agSetColumnFilter',
          filterParams: {
            buttons: ['reset']
          },
          sortable: true,
          width: 370,
          menuTabs: ['filterMenuTab', 'generalMenuTab'],
        },
        {
          headerName: 'Frequency',
          field: 'frequency',
          filter: 'agSetColumnFilter',
          filterParams: {
            buttons: ['reset']
          },
          sortable: true,
          width: 370,
          menuTabs: ['filterMenuTab', 'generalMenuTab'],
        }
      ];
      this.exportName = this.module+"_Filings_Assignment_";
    },100)
  }

  getFilingsData(){
    this.filingsTabService.getFilingData().subscribe(res => {
      this.filingTabData = [];
      res["data"].forEach((item:any) =>{
        const filing = {
          formId: item.formId,
          filingName: item.filingName,
          frequency: item.fundFrequency,
          approved: false,
          addedToTeam: this.selectedFilings.length > 0 ? (this.selectedFilings.findIndex((element) => element === item.formId) === -1 ? false : true) : false
        };
        this.filingTabData.push(filing);
      });
    });
  }

  adminTabChange(selectedTab) {
    this.tabIn = selectedTab;
    if (selectedTab == 1) {
      this.createTeamsRowData()
      this.getTeamDetailsData(true) 
      this.gridApi.setRowData(this.teamsMemberData);
      this.exportName = this.module+"_Team_Members_"
    }
    else if (selectedTab == 2) {
      this.createFilingsRowData();
      this.getFilingsData();
      this.gridApi.setRowData(this.filingTabData);     
    }
    else if (selectedTab == 3) {
      this.taskService.getTaskAssignments(this.selectedFilings).subscribe(res =>{
        this.taskAssignmentData = res.data
        this.gridApi.setRowData(res.data);
      })
      setTimeout(() =>{
      this.columnDefsAgGrid = [
        {
          headerCheckboxSelection: true,
          headerCheckboxSelectionFilteredOnly: true,
          checkboxSelection: true,
          valueGetter: "node.rowIndex + 1",
          maxWidth: 120,
          minWidth: 120,
          sortable: false,
          menuTabs: [],
          pinned: 'left'
          },
        {
          cellRendererFramework: CellRendererTemplateComponent,
          cellRendererParams: { ngTemplate: this.toggleSwitchTaskAssignments },
          headerName: 'Access',
          field: 'userId',
          maxWidth: 200,
          sortable: false,
          menuTabs: ['filterMenuTab', 'generalMenuTab'],
        },
          {
            headerName: 'Filling Type',
            field: 'filingName',
            filter: 'agSetColumnFilter',
            filterParams: {
              buttons: ['reset']
            },
            sortable: true,
            maxWidth: 200,
            width: 200,
            menuTabs: ['filterMenuTab', 'generalMenuTab'],
          },
          {
            headerName: 'Task Assignment',
            field: 'taskAssignment',
            filter: 'agSetColumnFilter',
            filterParams: {
              buttons: ['reset']
            },
            sortable: true,
            menuTabs: ['filterMenuTab', 'generalMenuTab'],
          }
      ]

      // this.columnDefs = [
      //   {
      //     headerComponentFramework: TableHeaderRendererComponent,
      //     cellRendererFramework: MotifTableCellRendererComponent,
      //     cellRendererParams: { ngTemplate: this.toggleSwitch } ,
      //     headerName: 'Access',
      //     field: 'userId',
      //     sortable: false,
      //     filter: false,
      //   },
      //   {
      //     headerComponentFramework: TableHeaderRendererComponent,
      //     headerName: 'Filling Type',
      //     field: 'fillingType',
      //     sortable: true,
      //     filter: true,
      //     wrapText: true,
      //     autoHeight: true,
      //     width: 370,
      //     comparator: customComparator
      //   },
      //   {
      //     headerComponentFramework: TableHeaderRendererComponent,
      //     headerName: 'Task Assignment',
      //     field: 'taskAssingment',
      //     sortable: true,
      //     filter: true,
      //     wrapText: true,
      //     autoHeight: true,
      //     width: 370,
      //     comparator: customComparator
      //   }
        
      // ];     
    }, 100)
      this.exportName = this.module+"_Task_Assignment_"
    }
    else if (selectedTab == 4) {
      this.dataExplorerService.getDataExplorerInformation().subscribe(res =>{
        this.dataExplorerData = res.data
        this.gridApi.setRowData(res.data);
      })
      this.columnDefsAgGrid = [
        {
          headerCheckboxSelection: true,
          headerCheckboxSelectionFilteredOnly: true,
          checkboxSelection: true,
          valueGetter: "node.rowIndex + 1",
          getQuickFilterText: function(params) {
            return '';
          },
          maxWidth: 120,
          sortable: false,
          menuTabs: [],
          pinned: 'left'
          },
        {
          cellRendererFramework: CellRendererTemplateComponent,
          cellRendererParams: { ngTemplate: this.toggleDataExplorer },
          headerName: 'Access',
          field: 'userId',
          sortable: false,
          menuTabs: ['filterMenuTab', 'generalMenuTab'],
        },
          {
            headerName: 'Filling name',
            field: 'fillingType',
            filter: 'agSetColumnFilter',
            filterParams: {
              buttons: ['reset']
            },
            sortable: true,
            width: 370,
            menuTabs: ['filterMenuTab', 'generalMenuTab'],
          },
          {
            headerName: 'Report name',
            field: 'taskAssingment',
            filter: 'agSetColumnFilter',
            filterParams: {
              buttons: ['reset']
            },
            sortable: true,
            width: 370,
            menuTabs: ['filterMenuTab', 'generalMenuTab'],
          }
      ]

      // this.columnDefs = [
      //   {
      //     headerComponentFramework: TableHeaderRendererComponent,
      //     cellRendererFramework: MotifTableCellRendererComponent,
      //     cellRendererParams: { ngTemplate: this.toggleSwitch } ,
      //     headerName: 'Access',
      //     field: 'userId',
      //     sortable: false,
      //     filter: false,
      //   },
      //   {
      //     headerComponentFramework: TableHeaderRendererComponent,
      //     headerName: 'Filling name',
      //     field: 'fillingType',
      //     sortable: true,
      //     filter: true,
      //     wrapText: true,
      //     autoHeight: true,
      //     width: 370,
      //     comparator: customComparator
      //   },
      //   {
      //     headerComponentFramework: TableHeaderRendererComponent,
      //     headerName: 'Report name',
      //     field: 'taskAssingment',
      //     sortable: true,
      //     filter: true,
      //     wrapText: true,
      //     autoHeight: true,
      //     width: 370,
      //     comparator: customComparator
      //   }
        
      // ];   
      this.exportName = this.module+"_Data_Explorer_"
    }
    else if (selectedTab == 5) {
      this.filingEntityService.getFilingEntitiesData().subscribe(res =>{
        this.filingEntitiesData = res.data
        this.gridApi.setRowData(res.data);
      })

      this.columnDefsAgGrid = [
        {
          headerCheckboxSelection: true,
          headerCheckboxSelectionFilteredOnly: true,
          checkboxSelection: true,
          valueGetter: "node.rowIndex + 1",
          maxWidth: 120,
          sortable: false,
          menuTabs: ['generalMenuTab','columnsMenuTab'],
          pinned: 'left'
          },
        {
          cellRendererFramework: CellRendererTemplateComponent,
          cellRendererParams: { ngTemplate: this.toggleSwitchFilingEntities },
          headerName: 'Access',
          field: 'userId',
          sortable: false,
          menuTabs: ['filterMenuTab', 'generalMenuTab'],
        },
          {
            headerName: 'Filing Type',
            field: 'fillingType',
            filter: 'agSetColumnFilter',
            filterParams: {
              buttons: ['reset']
            },
            sortable: true,
            width: 370,
            menuTabs: ['filterMenuTab', 'generalMenuTab'],
          },
          {
            headerName: 'Filing Entity Name',
            field: 'entityName',
            filter: 'agSetColumnFilter',
            filterParams: {
              buttons: ['reset']
            },
            sortable: true,
            width: 370,
            menuTabs: ['filterMenuTab', 'generalMenuTab'],
          },
          {
            headerName: 'Filing Entity Code',
            field: 'entityCode',
            filter: 'agSetColumnFilter',
            filterParams: {
              buttons: ['reset']
            },
            sortable: true,
            width: 370,
            menuTabs: ['filterMenuTab', 'generalMenuTab'],
          }   
      ]
      this.exportName = this.module+"_Filing_Entity_"

     /*  this.columnDefs = [
        {
          headerComponentFramework: TableHeaderRendererComponent,
          cellRendererFramework: MotifTableCellRendererComponent,
          cellRendererParams: { ngTemplate: this.toggleSwitch } ,
          headerName: 'Access',
          field: 'approved',
          sortable: false,
          filter: false,
        },
        {
          headerComponentFramework: TableHeaderRendererComponent,
          headerName: 'Filing Type',
          field: 'fillingType',
          sortable: true,
          filter: true,
          wrapText: true,
          autoHeight: true,
          width: 260,
          comparator: customComparator
        },
        {
          headerComponentFramework: TableHeaderRendererComponent,
          headerName: 'Filing Entity Name',
          field: 'entityName',
          sortable: true,
          filter: true,
          wrapText: true,
          autoHeight: true,
          width: 260,
          comparator: customComparator
        },
        {
          headerComponentFramework: TableHeaderRendererComponent,
          headerName: 'Filing Entity ID',
          field: 'entityId',
          sortable: true,
          filter: true,
          wrapText: true,
          autoHeight: true,
          width: 260,
          comparator: customComparator
        },
        {
          headerComponentFramework: TableHeaderRendererComponent,
          headerName: 'Filing Entity Code',
          field: 'entityCode',
          sortable: true,
          filter: true,
          wrapText: true,
          autoHeight: true,
          width: 260,
          comparator: customComparator
        }
      ];  */    
    }
  }

  private _updateTeam() {
/*     if (this.module == 'Regulatory Reporting') { 
      return this.formBuilder.group({
        teamName: ['', [Validators.required, Validators.pattern(commonConstants['ADD_TEAM_REGEX_PATTERN'].TEAM_NAME), Validators.maxLength(50), this.noWhitespaceValidator]],
        role: ['', [Validators.required]],
        teamDescription: ['', Validators.maxLength(250)],
        assignments: [[], [Validators.required]]
      });
    } else {
      return this.formBuilder.group({
        teamName: ['', [Validators.required, Validators.pattern(commonConstants['ADD_TEAM_REGEX_PATTERN'].TEAM_NAME), Validators.maxLength(50), this.noWhitespaceValidator]],
        role: ['', [Validators.required]],
        teamDescription: ['', Validators.maxLength(250)],
      });
    } */
    return this.formBuilder.group({
      teamName: ['', [Validators.required, Validators.pattern(commonConstants['ADD_TEAM_REGEX_PATTERN'].TEAM_NAME), Validators.maxLength(50), this.noWhitespaceValidator]],
      role: ['', [Validators.required]],
      teamDescription: ['', Validators.maxLength(250)],
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    if (control.value.length === 0) {
      return false;
    } else {
      const isWhitespace = (control.value || '').trim().length === 0;
      const isValid = !isWhitespace;
      return isValid ? null : { whitespace: true };
    }
  }



  onSubmitEditTeamForm(form: FormGroup) {
    const obj = this.editTeamForm.getRawValue();
    if (this.editTeamForm.valid) {
      this.enableEditor = !this.enableEditor;
      this.disableAddMemberButton = false;//!this.disableAddMemberButton;
      let team;
      console.log(obj);
      
/*       if (this.module == 'Regulatory Reporting') { 
        team = {
          "teamName": obj.teamName.trim(),
          "roleName": obj.role,
          "teamDescription": escape(obj.teamDescription.trim()),
          "moduleId": this.moduleId,
          "teamId": this.curentTeamId,
          "assignments": obj.assignments.map(item => ({
            "entityId": item,
            "entityName": (this.assignments.find(ele => ele.formId == item)).filingName
          }))
        }
      } else {
        team = {
          "teamName": obj.teamName.trim(),
          "roleName": obj.role,
          "teamDescription": escape(obj.teamDescription.trim()),
          "moduleId": this.moduleId,
          "teamId": this.curentTeamId
        }
      } */

      team = {
        "teamName": obj.teamName.trim(),
        "roleName": obj.role,
        "teamDescription": escape(obj.teamDescription.trim()),
        "moduleId": this.moduleId,
        "teamId": this.curentTeamId
      }
      
      const dupTeamInfo = this.teamInfo;
      this.teamInfo = [];
      this.teamService.EditTeam(team).subscribe(resp => {
        // this.teamInfo = resp['data'];
        const teamInfoObj = resp['data'];
/*         if (this.module == 'Regulatory Reporting') {
          this.teamInfo = {
            "teamName": teamInfoObj.teamName.trim(),
            "teamDescription": unescape(teamInfoObj.teamDescription),
            "role": teamInfoObj.role,
            "assignments": teamInfoObj.assignments.map(item => (this.assignments.find(ele => ele.formId == item.entityId)).filingName),
            "assignmentsArray": teamInfoObj.assignments
          }
         } else {
          this.teamInfo = {
            "teamName": teamInfoObj.teamName.trim(),
            "teamDescription": unescape(teamInfoObj.teamDescription),
            "role": teamInfoObj.role,
          }
        } */

        this.teamInfo = {
          "teamName": teamInfoObj.teamName.trim(),
          "teamDescription": unescape(teamInfoObj.teamDescription),
          "role": teamInfoObj.role,
        }
        
        this.showToastAfterEditTeam = !this.showToastAfterEditTeam;
        setTimeout(() => {
          this.showToastAfterEditTeam = !this.showToastAfterEditTeam;
        }, 5000);
      }, error => {
        const teamDup = {
          "teamName": dupTeamInfo['teamName'].trim(),
          "role": dupTeamInfo['role'],
          "teamDescription": unescape(dupTeamInfo['teamDescription']),
          "moduleId": this.moduleId,
          "teamId": this.curentTeamId,
          "assignments": dupTeamInfo["assignments"],
          "assignmentsArray": dupTeamInfo["assignmentsArray"]
        }
        this.teamInfo = teamDup;

        this.editTeamForm.patchValue({
          teamName: this.teamInfo.teamName.trim(),
          role: this.teamInfo.role.trim(),
          teamDescription: this.teamInfo.teamDescription.trim()
        });
        this.selectedFilings = this.teamInfo.assignmentsArray.map(item => item.entityId);
      });
    }
  }

  teamDuplicateCheck(event) {
    let teamDupcheck = this.teamsListArr.findIndex(item => item.teamName === event);
    if (teamDupcheck != -1) {
      this.editTeamForm.controls['teamName'].setErrors({ 'teamDuplicate': true });
    }
  }

  cancelForm() {
    this.showToastAfterEditTeam = false;
    this.editTeamForm.patchValue({
      teamName: this.teamInfo.teamName.trim(),
      role: this.teamInfo.role.trim(),
      teamDescription: this.teamInfo.teamDescription.trim()
    });
    if (this.module == 'Regulatory Reporting') {
      this.selectedFilings = this.teamInfo.assignmentsArray.map(item => item.entityId);
    }
    this.enableEditor = !this.enableEditor;
    this.disableAddMemberButton = !this.disableAddMemberButton;
  }


  deleteTeamMember(row) {

    const dialogRef = this.dialog.open(ModalComponent, {
      width: '500px',
      data: {
        type: 'Confirmation',
        header: 'Delete team member',
        description: 'Are you sure you want to delete this team member from the team?',
        footer: {
          style: 'start',
          YesButton: 'Yes',
          NoButton: 'No'
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      if (result.button == 'Yes') {

        const deleteTeam = {
          "teamId": this.curentTeamId,
          "userId": [row.userId]
        }

        this.teamService.deleteTeamMember(deleteTeam).subscribe(resp => {
          const teamsList = this.teamsMemberData;
          this.teamsMemberData = [];
          teamsList.splice(teamsList.findIndex(item => item.userId === row.userId), 1);
          teamsList.forEach(ele => {
            this.teamsMemberData.push(ele);
          });
          this.users = this.allUsers.filter(item => !this.teamsMemberData.find(item2 => item.userEmail === item2.userEmail));
          this.updatePageSize(this.pageSize);
          this.showToastAfterDeleteTeams = !this.showToastAfterDeleteTeams;
          setTimeout(() => {
            this.showToastAfterDeleteTeams = !this.showToastAfterDeleteTeams;
          }, 5000);

        });

      }
    });
  }

  addTeamMembers(event) {
    this.getUsersList();
    this.addTeamMemberModal = true;
  }

  onSubmitNewTeamMembers() {
    const obj = this.addTeamMemberForm.getRawValue();
    this.addTeamMemberModal = false
    const teamMembersToAdd = {
      "teamId": Number(this.curentTeamId),
      "userId": obj.members
    }
    this.teamService.addTeamMemebr(teamMembersToAdd).subscribe(resp => {
      this.teamsMemberData = [];
      resp['data'].forEach((element, i) => {
        this.teamsMemberData.push({
          userId: element.userId,
          userEmail: element.userEmail,
          memberName: element.userFirstName + ' ' + element.userLastName
        })
      });
      this.users = this.allUsers.filter(item => !this.teamsMemberData.find(item2 => item.userEmail === item2.userEmail));
      this.addTeamMemberForm.reset();
      this.getTeamDetailsData(true);
      console.log('AFTER FORM RESET', this.addTeamMemberForm);
      this.showToastAfterAddTeamMember = !this.showToastAfterAddTeamMember;
      setTimeout(() => {
        this.showToastAfterAddTeamMember = !this.showToastAfterAddTeamMember;
      }, 5000);
    });
  }

  closeTeamMemberModal() {
    this.addTeamMemberModal = false;
    this.addTeamMemberForm.reset();
    this.multiSelectValues = null;

  }

  /**
   * 
   * Retry this method after upgrading motif version
   */
  removeChipMember(event, index) {
    console.log(index);
    console.log(this.multiSelectValues);
    this.multiSelectValues.splice(index, 1);
    this.multiSelectValues = [...this.multiSelectValues];
    console.log('AFTER SPLICE', this.multiSelectValues);
  }

  logEvent(event: any, type: string, model: any) {
    console.log(
      `Select Component Type: ${type}`,
      ' | $event output: ',
      event,
      ' | model value: ',
      model
    );
  }

  filingTypeLogEvent(event, type, model) {
    this.editTeamForm.patchValue({
      assignments: model
    });
  }

  exportTeamsDetailsData() {
    this.exportHeaders = '';
    this.exportHeaders = 'userFirstName:First Name,userLastName:Last Name,userEmail:Email';
    this.exportUrl = this.apiHelpers.teams.teams_Details + "?teamId="+this.curentTeamId + "&module="+ this.module+"&teamName="+ this.teamInfo.teamName+"&export=" + true +"&headers=" + this.exportHeaders + "&reportType=csv";
    console.log("export URL > ", this.exportUrl);
    this.teamService.exportTeamsDetailsData(this.exportUrl).subscribe(resp => {
      console.log(resp);
    })
  }

  onChangeFilingsToggle(event, row){
    //Just for test
    console.log("Filings toggle ->", event);
    console.log("Filings Row ->", row);
  }

  onChangeTaskAssignToggle(event, row){
    //Just for test
    console.log("TaskAssign toggle ->", event);
    console.log("TaskAssign Row ->", row);
  }

  onChangeDataExplorerToggle(event, row){
    //Just for test
    console.log("DataExplorer toggle ->", event);
    console.log("DataExplorer Row ->", row);
  }

  onChangeFilingEntities(event, row){
    //Just for test
    console.log("Filing Entities toggle ->", event);
    console.log("Filing Entities Row ->", row);
  }

  RowsSelected(event){
    this.selectedRows = event;
    this.approveBtn = document.querySelector('.approve-button button');
    this.cancelbtn = document.querySelector('.second-button');
    this.approveBtn.disabled = this.selectedRows.length > 0 ? false : true;
    this.cancelbtn.disabled = this.selectedRows.length > 0 ? false : true;
    console.log("selectedRows ->", this.selectedRows);
  }

  onSubmitFilingsAssignments(){
    //To do
    console.log("Enable filings...");
    this.toastMessage = "Selected items has been successfully enabled!";
    this.showToastAfterAssignmensFilings = true;
    setTimeout(() => {
      this.showToastAfterAssignmensFilings = false;
    }, 5000);
  }

  onSubmitDisableFilingsAssignments(){
    //To do
    console.log("Disable filings...");
    this.showToastAfterAssignmensFilings = true;
    this.toastMessage = "Selected items has been successfully disabled!";
    setTimeout(() => {
      this.showToastAfterAssignmensFilings = false;
    }, 5000);
  }

  
  closeToast() {
    this.showToastAfterAssignmensFilings = false;
  }

}
