import { Component, ViewChild, ElementRef, TemplateRef, AfterViewInit, OnInit } from '@angular/core';
import { UsersService } from '../services/users.service';
import { MotifTableHeaderRendererComponent } from '@ey-xd/ng-motif';
import { MotifTableCellRendererComponent } from '@ey-xd/ng-motif';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {INPUT_VALIDATION,customComparator} from '../../../services/settings-helpers';
import { PermissionService, TableHeaderRendererComponent } from 'eyc-ui-shared-component';
import { AdministrationService } from '@default/administration/services/administration.service';
import { ErrorModalComponent } from 'eyc-ui-shared-component';
import { MatDialog } from '@angular/material/dialog';
import * as helpers from './../../../helper/api-config-helper';


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
  apiHelpers = helpers.userAdminstration;

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
    public dialog: MatDialog
  ) {
    const module = adminService.getCurrentModule;
    this.moduleName = module.moduleName;
   }

  usersListArr: any[] = [];

  MotifTableHeaderRendererComponent = MotifTableHeaderRendererComponent;
  MotifTableCellRendererComponent = MotifTableCellRendererComponent;
  columnDefs1;
  rowData;

  @ViewChild('motifTable') table: ElementRef;
  @ViewChild('headerTemplate')
  headerTemplate: TemplateRef<any>;
  @ViewChild('actionSection')
  actionSection: TemplateRef<any>;
  model = '';
  motifTypeahead = [];
  userResp: any[] = [];
  gridApi;
  currentPage = 0;
  totalRecords = 5;
  pageSize = 10;
  filter = '';
  sort = '';

  ngOnInit(): void {
    this.addUserForm = this._createAddUser();
  }

  getUsersData() {
    if(this.permissions.validateAllPermission('adminPermissionList', this.moduleName, 'View Users')) {
      this.userService.getUsersList(this.currentPage,this.pageSize,this.sort,this.filter).subscribe(resp => {
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
          this.rowData = this.usersListArr;
          this.totalRecords=resp['totalRecords'];
          // this.gridApi.setRowData(this.usersListArr);
        });
  
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

  ngAfterViewInit(): void {
    setTimeout(() => {
    this.getUsersData();
      
      this.columnDefs1 = [
        {
          width: 410,
          headerComponentFramework: TableHeaderRendererComponent,
          headerName: 'Name',
          field: 'name',
          sortable: true,
          filter: true,
          cellClass: 'custom-user-name',
          sort: 'asc',
          wrapText: true,
          autoHeight: true,
          comparator: customComparator
        },
        {
          width: 410,
          headerComponentFramework: TableHeaderRendererComponent,
          headerName: 'Email',
          field: 'email',
          cellClass: 'custom-user-email',
          sortable: true,
          filter: true,
          wrapText: true,
          autoHeight: true,
          sort:'asc',
          comparator: customComparator
        },
        // {
        //   width: 90,
        //   headerComponentFramework: TableHeaderRendererComponent,
        //   headerName: 'Teams',
        //   field: 'teams',
        //   sortable: true,
        //   filter: true,
        // },
        {
          width: 80,
          headerComponentFramework: TableHeaderRendererComponent,
          cellRendererFramework: MotifTableCellRendererComponent,
          cellRendererParams: this.editAct.bind(this),
          headerName: 'Actions',
          field: 'Actions',
          sortable: false,
          filter: false,
        },
      ];

    });
  }
  handleGridReady(params) {
    this.gridApi = params.api;
  }

  // Add user start here

  private _createAddUser() {
    return this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z \-\]+$'), Validators.maxLength(250), this.noWhitespaceValidator]],
      lastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z \-\]+$'), Validators.maxLength(250), this.noWhitespaceValidator]],
      email: ['', [Validators.required, Validators.pattern('^(?!.*?[.]{2})[a-zA-Z0-9]+[a-zA-Z0-9.]+[a-zA-Z0-9]+@[a-zA-Z0-9]+[a-zA-Z.]+\\.[a-zA-Z]{2,6}'), Validators.maxLength(250)]]
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

  sortChanged(event){
    this.sort = event;
    this.getUsersData();
  }

  searchGrid(input) {
    this.filter = input;
    this.currentPage = 0;
    this.getUsersData();
  }

  currentPageChange(event) {
    this.currentPage = event - 1;
  }

  updatePageSize(event) {
    this.pageSize = event;
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
