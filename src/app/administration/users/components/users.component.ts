// import { Component, OnInit } from '@angular/core';
import { Component, ViewChild, ElementRef, TemplateRef, AfterViewInit, OnInit } from '@angular/core';
import { UsersService } from '../services/users.service';
import { MotifTableHeaderRendererComponent } from '@ey-xd/ng-motif';
import { MotifTableCellRendererComponent } from '@ey-xd/ng-motif';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, AfterViewInit {

  showAddUserModal = false;
  addUserForm: FormGroup;
  showToastAfterAddUser: boolean = false;

  showDeleteUserModal = false;
  showToastAfterDeleteUser = false;
  selectedUser = '';

  constructor(
    private userService: UsersService,
    private _formBuilder: FormBuilder
  ) {
  }

  usersListArr: any[] = [];

  MotifTableHeaderRendererComponent = MotifTableHeaderRendererComponent;
  MotifTableCellRendererComponent = MotifTableCellRendererComponent;
  columnDefs1;
  rowData;

  @ViewChild('motifTable') table: ElementRef;
  @ViewChild('headerTemplate')
  headerTemplate: TemplateRef<any>;
  @ViewChild("actionSection")
  actionSection: TemplateRef<any>;


  model = '';
  /* motifTypeahead = [
'Alaska',
'California',
'Georgia',
'Kansas',
'Michigan',
'North Carolina',
'South Carolina',
'Virginia',
'West Virginia',
  ]; */
  motifTypeahead = [];


  ngOnInit(): void {
    this.addUserForm = this._createAddUser();
  }

  getUsersData() {

    this.userService.getUsersList().subscribe(resp => {
      resp['data'].forEach((item) => {
        const eachitem: any = {
          name: item.firstName + ' ' + item.lastName,
          email: item.userEmail,
          teams: item.userId,
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
          width: 400,
          headerComponentFramework: MotifTableHeaderRendererComponent,
          headerName: 'Name',
          field: 'name',
          sortable: true,
          filter: true,
          cellClass: 'custom-user-name',
          // tooltipField: 'name',
          wrapText: true,
          autoHeight: true,
        },
        {
          width: 400,
          headerComponentFramework: MotifTableHeaderRendererComponent,
          headerName: 'Email',
          field: 'email',
          cellClass: 'custom-user-email',
          sortable: true,
          filter: true,
          // tooltipField: 'email',
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
          headerName: "Actions",
          field: "Actions",
          sortable: false,
          filter: false,
        },
      ];

    });
  }

  // Add user start here

  private _createAddUser() {
    return this._formBuilder.group({
      firstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z \-\']+'), Validators.maxLength(250), this.noWhitespaceValidator]],
      lastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z \-\']+'), Validators.maxLength(250), this.noWhitespaceValidator]],
      userEmail: ['', [Validators.required, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/), Validators.maxLength(250)]]
    });
  }

  onSubmitAddUserForm(form: FormGroup) {
    let obj = form.getRawValue()
    Object.keys(obj).map(key => obj[key] = obj[key].trim()
    );
    this.showToastAfterAddUser = !this.showToastAfterAddUser;
    this.userService.addUser(obj).subscribe(resp => {
      let userList = this.usersListArr
      this.usersListArr = []
      let lastitem = resp['data'].pop()
      userList.push({
        name: lastitem.firstName + ' ' + lastitem.lastName,
        email: lastitem.userEmail,
        teams: userList.length +3,
        options: '',
      });
      userList.forEach(ele => {
        this.usersListArr.push(ele);
        this.rowData = this.usersListArr;
      })
      this.showAddUserModal = false;
      this.addUserForm = this._createAddUser()
      setTimeout(() => {
        this.showToastAfterAddUser = !this.showToastAfterAddUser;
      }, 5000)
    })
  }

  public noWhitespaceValidator(control: FormControl) {
    if (control.value.length === 0) {
      return false
    } else {
      const isWhitespace = (control.value || '').trim().length === 0;
      const isValid = !isWhitespace;
      return isValid ? null : { 'whitespace': true };
    }
  }

  closeAddUserModal() {
    this.showAddUserModal = false;
    this.addUserForm = this._createAddUser()
  }
  // Add user end here

  
  // Remove user start here
  deleteUser() {
    let userList = this.usersListArr
    this.usersListArr = []
    this.rowData = []
    const index = userList.indexOf(this.selectedUser)    
    userList.splice(index, 1);
    
    userList.forEach(ele => {
      console.log("ele", ele);
      
      this.usersListArr.push(ele);
      this.rowData = this.usersListArr;
    })
    // const index = this.usersListArr.indexOf(this.selectedUser)
    // this.usersListArr.splice(index, 1)
    // this.rowData = this.usersListArr;

    this.showDeleteUserModal = false;
    this.showToastAfterDeleteUser = true
    setTimeout(() => {
      this.showToastAfterDeleteUser = false
    }, 5000)
  }


  onClickDeleteUserIcon(row) {
    this.selectedUser = row;
    this.showDeleteUserModal = true;
  }
// Remove user end here

}
