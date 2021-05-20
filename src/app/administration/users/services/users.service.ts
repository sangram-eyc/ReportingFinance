import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import {SettingsService} from '../../../services/settings.service';
import {map} from 'rxjs/operators';
import {ApiService} from '../../../services/api.service';
import {userAdminstration} from '../../../helper/api-config-helper';
@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private http: HttpClient, private settingsService: SettingsService,private apiService: ApiService
  ) { }


  getUsersList() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    // return this.http.get(this.settingsService.API_ENDPOINT +'/assets/mock/users.json', {
    //   headers
    // });
    return this.apiService.invokeGetAPI(`${userAdminstration.regulatory_Reporting.view_User}`);
  }

  addUser(data){
    return this.apiService.invokePostAPI(`${userAdminstration.regulatory_Reporting.add_User}`,data);
  }

  removeUser(userId) {
    return this.apiService.invokeDeleteAPI(`${userAdminstration.regulatory_Reporting.remove_User}/${userId}`);
  }

}
