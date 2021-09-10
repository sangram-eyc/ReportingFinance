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
      return this.apiService.invokeGetAPI(`${this.settingsService.taxReporting.production_cycles_downloadFile_}/${id}/content?name=:${name}`);
    } 
    else{
      return this.apiService.invokeGetAPI(`${this.settingsService.taxReporting.production_cycles_downloadFile}`);
    }
  }
}