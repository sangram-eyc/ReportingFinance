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
    this.editUserForm = this._createAddUser();
   }

  usersListArr: any[] = [];
  userInfo: any[] = [];
  curentUserId;
  enableEditor: boolean = false;
  editUserForm: FormGroup;

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
    });

  }

  private _createAddUser() {
  return this._formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      userEmail: ['', [Validators.required]]
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

}
