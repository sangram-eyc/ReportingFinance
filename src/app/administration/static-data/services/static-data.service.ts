import { EventEmitter, Injectable, Output } from '@angular/core';
import { userAdminstration } from '@default/helper/api-config-helper';
import { EycRrApiService } from 'projects/eyc-regulatory-reporting/src/lib/services/eyc-rr-api.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StaticDataService {

  constructor(
    private apiService: EycRrApiService
  ) { }

  getStaticData() {
    return this.apiService.invokeGetAPI(`${userAdminstration.static_data.filing_names}`)
  }

  getStages(stageType) {
    return this.apiService.invokeGetAPI(`${userAdminstration.static_data.static_data_stages}${stageType}`)
  }

  addStaticData(staticData){
    return this.apiService.invokePutAPI(`${userAdminstration.static_data.add_static_data}`,staticData);
  }
}
