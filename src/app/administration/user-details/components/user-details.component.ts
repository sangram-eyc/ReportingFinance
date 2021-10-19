import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../../users/services/users.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from './../../../../environments/environment';
import {IS_USER_DETAILS_EDITABLE} from '../../../services/settings-helpers';
import { Location } from '@angular/common';
import { PermissionService } from 'eyc-ui-shared-component';
import { AdministrationService } from '@default/administration/services/administration.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {

  moduleName;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UsersService,
    private formBuilder: FormBuilder,
    private location: Location,
    public permissions: PermissionService,
    private adminService: AdministrationService
  ) {
    this.editUserForm = this._updateUser();
    const module = adminService.getCurrentModule;
    this.moduleName = module.moduleName;
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

    
    this.userService.userDetails(this.curentUserId).subscribe(resp => {
      this.userInfo = resp.data;
      this.fullname = this.userInfo.userLastName + ' ' + this.userInfo.userFirstName;
      this.editUserForm.patchValue({
        firstName: this.userInfo.userFirstName.trim(),
        lastName: this.userInfo.userLastName.trim(),
        email: this.userInfo.userEmail.trim()
      });

    });
    

  }

  private _updateUser() {
    return this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z \-\]+$'), Validators.maxLength(250), this.noWhitespaceValidator]],
      lastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z \-\]+$'), Validators.maxLength(250), this.noWhitespaceValidator]],
      email: ['', [Validators.required, Validators.pattern('^(?!.*?[.]{2})[a-zA-Z0-9]+[a-zA-Z0-9.]+[a-zA-Z0-9]+@[a-zA-Z0-9]+[a-zA-Z.]+\\.[a-zA-Z]{2,6}'), Validators.maxLength(250)]]
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
    sessionStorage.setItem("adminTab", '2');
    this.location.back();
  }

  enableEditForm() {
    this.enableEditor = !this.enableEditor;
  }

  cancelForm() {
    this.showToastAfterEditUser = false;
    this.editUserForm.patchValue({
      firstName: this.userInfo.userFirstName.trim(),
      lastName: this.userInfo.userLastName.trim(),
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