import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../../users/services/users.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from './../../../../environments/environment';

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
    private _formBuilder: FormBuilder,
  ) {
    this.editUserForm = this._updateUser();
   }

  usersListArr: any[] = [];
  // userInfo: any[] = [];
  isLocal = environment.SECURITY_ENABLED;
  userInfo;
  curentUserId;
  enableEditor: boolean = false;
  editUserForm: FormGroup;
  showToastAfterEditUser: boolean = false;
  fullname;
  userResp: any[] = [];

  ngOnInit(): void {
    
    this.activatedRoute.params.subscribe(params => {
      this.curentUserId = params.userId;
      });
      this.getUsersData(); 
  }

  getUsersData() {
    

    /* if(this.isLocal){ 
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
    } else { */
      this.userService.userDetails(this.curentUserId).subscribe(resp => {
        this.userInfo = resp;
        this.fullname = this.userInfo.userLastName+ ' '+ this.userInfo.userFirstName;
        this.editUserForm.patchValue({
          userFirstName: this.userInfo.userFirstName.trim(),
          userLastName: this.userInfo.userLastName.trim(),
          userEmail: this.userInfo.userEmail.trim()
          });
  
      });
    // }

  }

  private _updateUser() {
    return this._formBuilder.group({
      userFirstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z \-\]+$'), Validators.maxLength(250), this.noWhitespaceValidator]],
      userLastName:  ['', [Validators.required, Validators.pattern('^[a-zA-Z \-\]+$'), Validators.maxLength(250), this.noWhitespaceValidator]],
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
      userFirstName: this.userInfo.userFirstName.trim(),
      userLastName: this.userInfo.userLastName.trim(),
      userEmail: this.userInfo.userEmail.trim()
      });
      this.enableEditor = !this.enableEditor;
  }

  onSubmitEditUserForm(form: FormGroup) {

    let obj = form.getRawValue()
    Object.keys(obj).map(key => obj[key] = obj[key].trim()
    );

    if (this.editUserForm.valid) {
      /* this.userInfo['userFirstName'] = obj['firstName'].trim();
      this.userInfo['userLastName'] = obj['lastName'].trim();
      this.userInfo['userEmail'] = obj['userEmail'].trim();

      this.showToastAfterEditUser = !this.showToastAfterEditUser;
      this.enableEditor = !this.enableEditor;
      setTimeout(() => {
        this.showToastAfterEditUser = !this.showToastAfterEditUser;
      }, 5000) */
      this.userService.editUser(this.curentUserId, obj).subscribe(resp => {
        // this.getUsersData();
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
