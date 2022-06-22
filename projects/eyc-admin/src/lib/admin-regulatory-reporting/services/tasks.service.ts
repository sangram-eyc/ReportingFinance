import { Injectable } from '@angular/core';
import { ApiSharedService } from '../../services/api-shared.service';
import { SettingService } from '../../services/setting.service';

@Injectable({
  providedIn: 'root'
})


export class TasksService {

  constructor(private apiService: ApiSharedService, private settingService: SettingService) { }

  getTaskAssignments(){

    if (this.settingService.production) {
      return this.apiService.invokeGetAPI(`${this.settingService.task_assignment.tasks_assignment_list}`);
    } 
    else{
      return this.apiService.invokeGetAPI(`${this.settingService.task_assignment.tasks_assignment_list}`);
    }
    
  }

 

}