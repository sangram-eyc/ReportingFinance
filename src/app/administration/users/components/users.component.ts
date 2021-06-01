import { Component, ViewChild, ElementRef, TemplateRef, AfterViewInit, OnInit } from '@angular/core';
import { UsersService } from '../services/users.service';
import { MotifTableHeaderRendererComponent } from '@ey-xd/ng-motif';
import { MotifTableCellRendererComponent } from '@ey-xd/ng-motif';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, AfterViewInit {

  showAddUserModal = false;
  addUserForm: FormGroup;
  showToastAfterAddUser = false;

  showDeleteUserModal = false;
  showToastAfterDeleteUser = false;
  selectedUser = '';

  constructor(
    private userService: UsersService,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

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

  ngOnInit(): void {
    this.addUserForm = this._createAddUser();
  }

  getUsersData() {

    this.userService.getUsersList().subscribe(resp => {
      this.userResp =[];
      this.userResp.push(resp);
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
      });

    });

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
          headerComponentFramework: MotifTableHeaderRendererComponent,
          headerName: 'Name',
          field: 'name',
          sortable: true,
          filter: true,
          cellClass: 'custom-user-name',
          sort: 'asc',
          wrapText: true,
          autoHeight: true,
        },
        {
          width: 410,
          headerComponentFramework: MotifTableHeaderRendererComponent,
          headerName: 'Email',
          field: 'email',
          cellClass: 'custom-user-email',
          sortable: true,
          filter: true,
          wrapText: true,
          autoHeight: true,
        },
        {
          width: 90,
          headerComponentFramework: MotifTableHeaderRendererComponent,
          headerName: 'Teams',
          field: 'teams',
          sortable: true,
          filter: true,
        },
        {
          width: 80,
          headerComponentFramework: MotifTableHeaderRendererComponent,
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

  // Add user start here

  private _createAddUser() {
    return this.formBuilder.group({
      first: ['', [Validators.required, Validators.pattern('^[a-zA-Z \-\]+$'), Validators.maxLength(250), this.noWhitespaceValidator]],
      last: ['', [Validators.required, Validators.pattern('^[a-zA-Z \-\]+$'), Validators.maxLength(250), this.noWhitespaceValidator]],
      email: ['', [Validators.required, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/), Validators.maxLength(250)]]
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
      this.getUsersData();
      this.showToastAfterAddUser = !this.showToastAfterAddUser;
      setTimeout(() => {
        this.showToastAfterAddUser = !this.showToastAfterAddUser;
      }, 5000);
      console.log("API Response is throwing error,user data loaded")
      
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

  closeAddUserModal() {
    this.showAddUserModal = false;
    this.addUserForm = this._createAddUser();
  }
  // Add user end here
  // Remove user start here
  deleteUser() {
    const userList = this.usersListArr;
    this.usersListArr = [];
    this.rowData = [];
    const index = userList.indexOf(this.selectedUser);
    userList.splice(index, 1);
    this.showDeleteUserModal = false;
    this.userService.removeUser(this.selectedUser['userId']).subscribe(resp => {
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
}
