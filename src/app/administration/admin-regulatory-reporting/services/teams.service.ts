import { Injectable } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { userAdminstration } from '../../../helper/api-config-helper';

@Injectable({
  providedIn: 'root'
})
export class TeamsService {

  constructor(private apiService: ApiService) { }

  getTeamsList() {
    return this.apiService.invokeGetAPI(`${userAdminstration.teams.teams_list}`);
  }
}
