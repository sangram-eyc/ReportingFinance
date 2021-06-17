import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../../users/services/users.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from './../../../../environments/environment';
import {IS_USER_DETAILS_EDITABLE} from '../../../services/settings-helpers';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UsersService,
    private formBuilder: FormBuilder,
  ) {
    this.editUserForm = this._updateUser();
  }

  usersListArr: any[] = [];
  isLocal = environment.SECURITY_ENABLED;
  userInfo;
  curentUserId;
  enableEditor = false;
  editUserForm: FormGroup;
  showToastAfterEditUser = false;
  fullname;
  userResp: any[] = [];
  is_editable = IS_USER_DETAILS_EDITABLE;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.curentUserId = params.userId;
    });
    this.getUsersData();
  }

  getUsersData() {

    // Below code will inly work,if it is a local environment reading data from json
     if(this.isLocal){
      this.userService.getUsersList().subscribe(resp => {
          this.userResp.push(resp);
        this.userResp[0].forEach((item) => {
          this.usersListArr.push(item);
        });
        const currentTaskIndex = this.usersListArr.findIndex(task => task.userId == this.curentUserId);
        this.userInfo = this.usersListArr[currentTaskIndex];
        this.fullname = this.userInfo.userLastName+ ' '+ this.userInfo.userFirstName;
        this.editUserForm.patchValue({
          userFirstName: this.userInfo.userFirstName.trim(),
          userLastName: this.userInfo.userLastName.trim(),
          userEmail: this.userInfo.userEmail.trim()
          });

      });
    } 
    // this.userService.userDetails(this.curentUserId).subscribe(resp => {
    //   this.userInfo = resp;
    //   this.fullname = this.userInfo.userLastName + ' ' + this.userInfo.userFirstName;
    //   this.editUserForm.patchValue({
    //     first: this.userInfo.userFirstName.trim(),
    //     last: this.userInfo.userLastName.trim(),
    //     email: this.userInfo.userEmail.trim()
    //   });

    // });
    

  }

  private _updateUser() {
    return this.formBuilder.group({
      first: ['', [Validators.required, Validators.pattern('^[a-zA-Z \-\]+$'), Validators.maxLength(250), this.noWhitespaceValidator]],
      last: ['', [Validators.required, Validators.pattern('^[a-zA-Z \-\]+$'), Validators.maxLength(250), this.noWhitespaceValidator]],
      email: ['', [Validators.required, Validators.pattern('^(?!.*?[.]{2})[a-zA-Z0-9]+[a-zA-Z0-9.]+[a-zA-Z0-9]+@[a-zA-Z0-9]+[a-z.]+\\.[a-z]{2,6}'), Validators.maxLength(250)]]
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

  backtoUserAdmin() {
    this.router.navigate(['/admin-regulatory-reporting']);
  }

  enableEditForm() {
    this.enableEditor = !this.enableEditor;
  }

  cancelForm() {
    this.showToastAfterEditUser = false;
    this.editUserForm.patchValue({
      first: this.userInfo.userFirstName.trim(),
      last: this.userInfo.userLastName.trim(),
      email: this.userInfo.userEmail.trim()
    });
    this.enableEditor = !this.enableEditor;
  }

  onSubmitEditUserForm(form: FormGroup) {
    const obj = form.getRawValue();
    Object.keys(obj).map(key => obj[key] = obj[key].trim()
    );

    if (this.editUserForm.valid) {
      this.userService.editUser(this.curentUserId, obj).subscribe(resp => {
        this.getUsersData();
        this.userInfo = resp;
        if (resp) {
          this.showToastAfterEditUser = !this.showToastAfterEditUser;
          this.enableEditor = !this.enableEditor;
          setTimeout(() => {
            this.showToastAfterEditUser = !this.showToastAfterEditUser;
          }, 5000);
        }

      }, error => {
        console.log(error);
      });
    }
  }
}
