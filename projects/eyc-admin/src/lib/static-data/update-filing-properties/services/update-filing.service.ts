import { Injectable } from '@angular/core';
import { ApiSharedService } from '../../../services/api-shared.service';
import { SettingService } from '../../../services/setting.service';

@Injectable({
  providedIn: 'root'
})
export class UpdateFilingService {

  filingDetails;
  constructor(
    private apiService: ApiSharedService, private settingService: SettingService
  ) { }

  set setData(data) {
    this.filingDetails = data;
  }

  get getData() {
    return this.filingDetails;
  }

  editFiling(data) {
    
  }

  getFilingDetails(formId) {
    return this.apiService.invokeGetAPI(`${this.settingService.static_data.get_static_data_details}` + formId);
  }

  updateStaticData(staticData){
    return this.apiService.invokePutAPI(`${this.settingService.static_data.add_static_data}`,staticData);
  }

  getStages(stageType) {
    return this.apiService.invokeGetAPI(`${this.settingService.static_data.static_data_stages}${stageType}`)
  }

  getPBIMappingDetails(formId) {
    return this.apiService.invokeGetAPI(`${this.settingService.static_data.pbi_mapping}`+ formId+ '/pbi-mapping');
  }

  getPBIQuestionList() {
    return this.apiService.invokeGetAPI(`${this.settingService.static_data.pbi_question_list}`);
  }

  addPBIMapping(mappingData) {
    return this.apiService.invokePutAPI(`${this.settingService.static_data.add_pbi_mapping}`, mappingData)
  }

  deleteTeamMember(pbiMappingData) {
    return this.apiService.invokeDeleteAPIBody(`${this.settingService.static_data.delete_pbi_mapping}`,pbiMappingData);
  }

  exportPBIMappingData(exportURL) {
    return this.apiService.invokeGetAPI(`${exportURL}`);
  }
}
