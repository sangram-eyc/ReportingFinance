import { Injectable } from '@angular/core';
import {app_concurrent_sessions } from '@default/helper/api-config-helper';
import { ApiService } from '../api.service';


@Injectable({
  providedIn: 'root'
})
export class ConcurrentSessionsService {

  constructor(
    private apiService: ApiService,
  ) { }

  deleteSessionId(body) {
    return this.apiService.invokePutAPI(`${app_concurrent_sessions.delete_session_id}`,body).toPromise();
  }

  addSessionId(body){
    return this.apiService.invokePutAPI(`${app_concurrent_sessions.add_session_id}`,body).toPromise();  
  }
  
  exitSessionInactivity(body){
    return this.apiService.invokePutAPI(`${app_concurrent_sessions.exit_ui_inactivity}`,body);
  }
}
