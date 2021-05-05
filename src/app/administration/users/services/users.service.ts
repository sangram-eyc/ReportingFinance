import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AdminUsersResponse } from './../../../shared/model/AdminUsersResponse'
import {map} from 'rxjs/operators'
@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private http: HttpClient
  ) { }


  getUsersList() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.get('http://localhost:4200/assets/mock/users.json', {
      headers
    });
  }

  addUser(data){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.get('http://localhost:4200/assets/mock/users.json',{
      headers
    }).pipe(map(res=> {
      console.log(res);
      data.userId = res['data'].length+1;
      res['data'].push(data)
      return res;
    }));
  }

}
