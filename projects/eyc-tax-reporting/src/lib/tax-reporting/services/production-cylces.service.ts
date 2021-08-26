//import { Injectable } from '@angular/core';
import { EventEmitter, Injectable, Output } from '@angular/core';
import {EycTaxSettingsService} from '../../services/eyc-tax-settings.service';
import {EycRrApiService} from '../../services/eyc-tax-api.service';

@Injectable({
  providedIn: 'root'
})
export class ProductionCylcesService {

  constructor(private apiService: EycRrApiService,private settingsService: EycTaxSettingsService) { }

  getProductionCycles(){
    return this.apiService.invokeGetAPI(`${this.settingsService.taxReportingFiling.production_cycles}`);  
  }
  getProductionCyclesDetails(){
    return this.apiService.invokeGetAPI(`${this.settingsService.taxReportingFiling.production_cycles_details}`);  
  }

}
