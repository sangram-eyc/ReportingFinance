//import { Injectable } from '@angular/core';
import { EventEmitter, Injectable, Output } from '@angular/core';
import {EycTaxSettingsService} from '../../services/eyc-tax-settings.service';
import {EycApiService} from '../../services/eyc-tax-api.service';

@Injectable({
  providedIn: 'root'
})

export class ProductionCycleService {

  constructor(private apiService: EycApiService,private settingsService: EycTaxSettingsService) { }

   getProductionCycles(){
    return this.apiService.invokeGetAPI(`${this.settingsService.taxReporting.production_cycles}`);  
  }

  getProductionCyclesDetails(id:any){
    console.log('url cycles details', this.settingsService.taxReporting.production_cycles_details);
    if (this.settingsService.production) {
      return this.apiService.invokeGetAPI(`${this.settingsService.taxReporting.production_cycles_details}/${id}`);
    } 
    else{
      return this.apiService.invokeGetAPI(`${this.settingsService.taxReporting.production_cycles_details}`);
    }
  }

  getStatusTrackerLink(id:any){
    if (this.settingsService.production) {
      return this.apiService.invokeGetAPI(`${this.settingsService.taxReporting.production_cycles_statusTracker}/${id}/status-tracker`);
    } 
    else{
      return this.apiService.invokeGetAPI(`${this.settingsService.taxReporting.production_cycles_statusTracker}`);
    }
  }

  getDownloadFile(id:any, name:any){
    if (this.settingsService.production) {
      return this.apiService.invokeGetAPI(`${this.settingsService.taxReporting.production_cycles_downloadFile}/${id}/content?name=:${name}`);
    } 
    else{
      return this.apiService.invokeGetAPI(`${this.settingsService.taxReporting.production_cycles_downloadFile}`);
    }
  }

  putApproveEntities(bodyJson:any){
    //console.log(bodyJson);
    if (this.settingsService.production) {
      return this.apiService.invokePutAPI(`${this.settingsService.taxReporting.production_cycles_approveEntities}`, bodyJson); 
    }
    else{
      //To test locally you must return a get
      return this.apiService.invokeGetAPI(`${this.settingsService.taxReporting.production_cycles_approveEntities}`);    
    }
  }

}
