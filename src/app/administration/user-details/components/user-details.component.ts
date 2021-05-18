import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../../users/services/users.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService:UsersService,
    private _formBuilder: FormBuilder
  ) {
    this.editUserForm = this._updateUser();
   }

  usersListArr: any[] = [];
  userInfo: any[] = [];
  curentUserId;
  enableEditor: boolean = false;
  editUserForm: FormGroup;
  showToastAfterEditUser: boolean = false;
  fullname;

  ngOnInit(): void {
    
    this.activatedRoute.params.subscribe(params => {
      this.curentUserId = params.userId;
      });
      this.getUsersData(); 
  }

  getUsersData() {
    this.userService.getUsersList().subscribe(resp => {
      resp['data'].forEach((item) => {
        this.usersListArr.push(item);
      });
      const currentTaskIndex = this.usersListArr.findIndex(task => task.userId == this.curentUserId);
      this.userInfo = this.usersListArr[currentTaskIndex];

      this.fullname = this.userInfo['lastName']+ ' '+ this.userInfo['firstName'];


      this.editUserForm.patchValue({
        firstName: this.userInfo['firstName'].trim(),
        lastName: this.userInfo['lastName'].trim(),
        userEmail: this.userInfo['userEmail'].trim()
        });

    });

  }

  private _updateUser() {
    return this._formBuilder.group({
      firstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z \-\]+$'), Validators.maxLength(250), this.noWhitespaceValidator]],
      lastName:  ['', [Validators.required, Validators.pattern('^[a-zA-Z \-\]+$'), Validators.maxLength(250), this.noWhitespaceValidator]],
      userEmail: ['', [Validators.required, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/), Validators.maxLength(250)]]
    });
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

  backtoUserAdmin(){
    this.router.navigate(['/admin-regulatory-reporting']);
  }

  enableEditForm() {
    this.enableEditor = !this.enableEditor;
  }

  cancelForm() {
    this.showToastAfterEditUser = false;
    this.editUserForm.patchValue({
      firstName: this.userInfo['firstName'].trim(),
      lastName: this.userInfo['lastName'].trim(),
      userEmail: this.userInfo['userEmail'].trim()
      });
      this.enableEditor = !this.enableEditor;
  }

  onSubmitEditUserForm(form: FormGroup) {

    let obj = form.getRawValue()
    Object.keys(obj).map(key => obj[key] = obj[key].trim()
    );

    if (this.editUserForm.valid) {
      this.userInfo['firstName'] = obj['firstName'].trim();
      this.userInfo['lastName'] = obj['lastName'].trim();
      this.userInfo['userEmail'] = obj['userEmail'].trim();

      this.showToastAfterEditUser = !this.showToastAfterEditUser;
      this.enableEditor = !this.enableEditor;
      setTimeout(() => {
        this.showToastAfterEditUser = !this.showToastAfterEditUser;
      }, 5000)
    }


  }

  

}
