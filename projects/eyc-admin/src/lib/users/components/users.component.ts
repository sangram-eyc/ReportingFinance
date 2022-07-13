import { Component, ViewChild, ElementRef, TemplateRef, AfterViewInit, OnInit } from '@angular/core';
import { UsersService } from '../services/users.service';
import { MotifTableHeaderRendererComponent } from '@ey-xd/ng-motif';
import { MotifTableCellRendererComponent } from '@ey-xd/ng-motif';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {INPUT_VALIDATION,} from '../../config/setting-helper';
import { customComparator, PermissionService, TableHeaderRendererComponent } from 'eyc-ui-shared-component';
import { ErrorModalComponent, DEFAULT_PAGE_SIZE } from 'eyc-ui-shared-component';
import { MatDialog } from '@angular/material/dialog';
import { SettingService } from '../../services/setting.service';
import { AdministrationService } from '../../administration/services/administration.service';
import * as commonConstants from '../../shared/common-contstants'
import { CellRendererTemplateComponent } from 'eyc-ui-shared-component';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, AfterViewInit {

  showAddUserModal = false;
  addUserForm: FormGroup;
  showToastAfterAddUser = false;
  exportHeaders;

  showDeleteUserModal = false;
  showToastAfterDeleteUser = false;
  selectedUser: any;
  moduleName;
  displayCheckBox = true;
  exportUrl: any;

  constructor(
    private userService: UsersService,
    private router: Router,
    private formBuilder: FormBuilder,
    public permissions: PermissionService,
    private adminService: AdministrationService,
    public dialog: MatDialog,
    private apiHelpers: SettingService
  ) {
    const module = adminService.getCurrentModule;
    this.moduleName = module.moduleName;
   }

  usersListArr: any[] = [];

  MotifTableHeaderRendererComponent = MotifTableHeaderRendererComponent;
  MotifTableCellRendererComponent = MotifTableCellRendererComponent;
  columnDefs1;
  rowData;
  columnDefsAgGrid;

  @ViewChild('motifTable') table: ElementRef;
  @ViewChild('headerTemplate')
  headerTemplate: TemplateRef<any>;
  @ViewChild('actionSection')
  actionSection: TemplateRef<any>;
  model = '';
  motifTypeahead = [];
  userResp: any[] = [];
  gridApi;
  pageInfo = {
    currentPage: 0,
    totalRecords: 5,
    pageSize: DEFAULT_PAGE_SIZE,
    filter: '',
    sort: '',
  }
  pageChangeFunc;
  resetRowData = [];

  ngOnInit(): void {
    this.addUserForm = this._createAddUser();
    this.pageChangeFunc = this.onPageChange.bind(this);
    this.pageInfo.sort = 'userLastName:true';
  }

  resetData() {
    this.setUserRows();
    this.pageInfo.currentPage = 0;
    this.pageInfo.pageSize = DEFAULT_PAGE_SIZE;
  }


  getUsersData(resetData = false) {
    this.pageInfo.sort = resetData ? 'userLastName:true' : this.pageInfo.sort;
    if(this.permissions.validateAllPermission('adminPermissionList', this.moduleName, 'View Users')) {
      this.userService.getUsersList(this.pageInfo.currentPage,this.pageInfo.pageSize,this.pageInfo.sort,this.pageInfo.filter).subscribe(resp => {
        this.userResp =[];
        this.usersListArr= [];
        this.userResp.push(resp.data);
        this.userResp[0].forEach((item) => {
          const eachitem: any = {
            name: item.userLastName + ', ' + item.userFirstName,
            email: item.userEmail,
            teams: 0,
            userId: item.userId,
            options: '',
          };
          this.usersListArr.push(eachitem);
        });
        this.rowData = this.usersListArr;
        // this.resetRowData = this.rowData;
        this.pageInfo.totalRecords=resp['totalRecords'];
        if (resetData) {
          this.resetData();
        } else {
          this.gridApi.setRowData(this.rowData);
        }
        // this.gridApi.setRowData(this.usersListArr);
  
      });
    } else {
      this.openErrorModal("Access Denied", "User does not have access to view users. Please contact an administrator.");
    }
    

  }

  editAct($event) {
    return {
      ngTemplate: this.actionSection,
    };
  }

  disableComparator(data1, data2) {
    return 0; 
  }

  setUserRows() {
    this.columnDefs1 = [];
    this.columnDefsAgGrid = [];
    this.resetRowData = [];
    setTimeout(() => {
      this.columnDefsAgGrid =[
        {
          valueGetter: "node.rowIndex + 1",
          maxWidth: 75,
          sortable: false,
          menuTabs: ['generalMenuTab','columnsMenuTab'],
          pinned: 'left'
          },
          {
            headerName: 'Name',
            field: 'name',
            minWidth: 410,
            filter: 'agSetColumnFilter',
            filterParams: {
              buttons: ['reset']
            },
            sortable: true,
            sort: 'asc',
            tooltipField: 'name',
            menuTabs: ['filterMenuTab', 'generalMenuTab'],
          },
          {
            headerName: 'Email',
            field: 'email',
            minWidth: 410,
            filter: 'agSetColumnFilter',
            filterParams: {
              buttons: ['reset']
            },
            cellClass: 'custom-user-email',
            sortable: true,
            tooltipField: 'email',
            menuTabs: ['filterMenuTab', 'generalMenuTab'],
          },
          {
            cellRendererFramework: CellRendererTemplateComponent,
            cellRendererParams:this.editAct.bind(this),
            headerName: 'Actions',
            field: 'Actions',
            sortable: false,
            width: 80,
            menuTabs: ['filterMenuTab', 'generalMenuTab'],
          },
      ]
      // this.columnDefs1 = [
      //   {
      //     width: 410,
      //     headerComponentFramework: TableHeaderRendererComponent,
      //     headerName: 'Name',
      //     field: 'name',
      //     sortable: true,
      //     filter: true,
      //     cellClass: 'custom-user-name',
      //     sort: 'asc',
      //     wrapText: true,
      //     autoHeight: true,
      //     comparator: this.disableComparator
      //   },
      //   {
      //     width: 410,
      //     headerComponentFramework: TableHeaderRendererComponent,
      //     headerName: 'Email',
      //     field: 'email',
      //     cellClass: 'custom-user-email',
      //     sortable: true,
      //     filter: true,
      //     wrapText: true,
      //     autoHeight: true,
      //     comparator: this.disableComparator
      //   },
      //   {
      //     width: 80,
      //     headerComponentFramework: TableHeaderRendererComponent,
      //     cellRendererFramework: MotifTableCellRendererComponent,
      //     cellRendererParams: this.editAct.bind(this),
      //     headerName: 'Actions',
      //     field: 'Actions',
      //     sortable: false,
      //     filter: false,
      //   },
      // ];
      this.resetRowData = this.rowData;
    },1);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.getUsersData(true);
    });
  }

  handleGridReady(params) {
    this.gridApi = params.api;
  }

  // Add user start here

  private _createAddUser() {
    return this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.pattern(commonConstants['ADD_USER_REGEX'].FIRST_NAME), Validators.maxLength(250), this.noWhitespaceValidator]],
      lastName: ['', [Validators.required, Validators.pattern(commonConstants['ADD_USER_REGEX'].LAST_NAME), Validators.maxLength(250), this.noWhitespaceValidator]],
      email: ['', [Validators.required, Validators.pattern(commonConstants['ADD_USER_REGEX'].EMAIL), Validators.maxLength(250)]]
    });
  }
  onSubmitAddUserForm(form: FormGroup) {
    const obj = form.getRawValue();
    Object.keys(obj).map(key => obj[key] = obj[key].trim()
    );
    this.showAddUserModal = false;
    this.userService.addUser(obj).subscribe(resp => {
      this.addUserForm = this._createAddUser();
      this.getUsersData();
      if (resp) {
      this.updatePageSize(this.pageInfo.pageSize);
        this.showToastAfterAddUser = !this.showToastAfterAddUser;
        setTimeout(() => {
          this.showToastAfterAddUser = !this.showToastAfterAddUser;
        }, 5000);
      }

    }, error => {
      this.showAddUserModal = false;
      this.addUserForm = this._createAddUser();
      //Temp fix we will remove it after api response is fixed
      // this.getUsersData();
      // this.showToastAfterAddUser = !this.showToastAfterAddUser;
      // setTimeout(() => {
      //   this.showToastAfterAddUser = !this.showToastAfterAddUser;
      // }, 5000);
      // console.log("API Response is throwing error,user data loaded")
      
    });
  }

  onPageChange() {
    this.getUsersData();
  }

  sortChanged(event){
    switch(true) {
      case event === 'name:true':
        this.pageInfo.sort = 'userLastName:true';
        break;
      case event === 'name:false':
        this.pageInfo.sort = 'userLastName:false';
        break;
      case event === 'email:true':
        this.pageInfo.sort = 'userEmail:true';
        break;
      case event === 'email:false':
        this.pageInfo.sort = 'userEmail:false';
        break;
      default:
        this.pageInfo.sort =event;
    }
    console.log(this.pageInfo.sort);
    this.getUsersData();
  }

  searchGrid(input) {
    this.pageInfo.filter = input;
    this.pageInfo.currentPage = 0;
    this.getUsersData(true);
  }

  currentPageChange(event) {
    this.pageInfo.currentPage = event - 1;
  }

  updatePageSize(event) {
    this.pageInfo.pageSize = event;
    this.getUsersData();
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

  closeAddUserModal() {
    this.showAddUserModal = false;
    this.addUserForm = this._createAddUser();
  }

  addUser(event){
    this.showAddUserModal = true;
  }
  // Add user end here
  // Remove user start here
  deleteUser() {
    this.showDeleteUserModal = false;
    this.userService.removeUser(this.selectedUser['userId']).subscribe(resp => {
      
      const userList = this.usersListArr;
      this.usersListArr = [];
      this.rowData = [];
      const index = userList.indexOf(this.selectedUser);
      userList.splice(index, 1);

      userList.forEach(ele => {
        this.usersListArr.push(ele);
        this.rowData = this.usersListArr;
      });

      this.gridApi.setRowData(this.rowData);
      this.updatePageSize(this.pageInfo.pageSize);
      this.showToastAfterDeleteUser = true;
      setTimeout(() => {
        this.showToastAfterDeleteUser = false;
      }, 5000);

    }, error => {
      this.showDeleteUserModal = false;
    });

  }

  onClickDeleteUserIcon(row) {
    this.selectedUser = row;
    this.showDeleteUserModal = true;
  }
  // Remove user end here
  editUser(row) {
    this.router.navigate(['/user-details/' + row.userId]);
  }

  searchFilingValidation(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (INPUT_VALIDATION.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  onPasteSearchValidation(event: ClipboardEvent) {
    let clipboardData = event.clipboardData;
    let pastedText = (clipboardData.getData('text')).split("");    
    pastedText.forEach((ele, index) => {
      if (INPUT_VALIDATION.test(ele)) {
        if ((pastedText.length - 1) === index) {
          return true;
        }
      } else {
        event.preventDefault();
        return false;
      }
    });
  } 

  openErrorModal(header, description) {
    const dialogRef = this.dialog.open(ErrorModalComponent, {
      disableClose: true,
      width: '400px',
      data: {
        header: header,
        description: description,
        footer: {
          style: "start",
          YesButton: "OK"
        },
      }
    });
    dialogRef.afterClosed().subscribe(result => {
  
    });
  }

  exportUsersData() {
    this.exportHeaders = '';
    this.exportHeaders = 'userFirstName:First Name,userLastName:Last Name,userEmail:Email';
    this.exportUrl = this.apiHelpers.regulatory_Reporting.view_User+ "?module=" + this.moduleName +  "&export=" + true +"&headers=" + this.exportHeaders + "&reportType=csv";
    console.log("export URL > ", this.apiHelpers.regulatory_Reporting.view_User+ "?module=" + this.moduleName +  "&export=" + true +"&headers=" + this.exportHeaders + "&reportType=csv");
    this.userService.exportUsersData(this.exportUrl).subscribe(resp => {
      console.log(resp);
    })
    }
}
