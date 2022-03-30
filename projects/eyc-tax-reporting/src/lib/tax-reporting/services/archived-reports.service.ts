//import { Injectable } from '@angular/core';
import { EventEmitter, Injectable, Output } from '@angular/core';
import {EycTaxSettingsService} from '../../services/eyc-tax-settings.service';
import {EycApiService} from '../../services/eyc-tax-api.service';

@Injectable({
  providedIn: 'root'
})

export class ArchivedReportsService {

  constructor(private apiService: EycApiService,private settingsService: EycTaxSettingsService) { }

  getArchivedReportsData(){
    return this.apiService.invokeGetAPI(`${this.settingsService.taxReporting.archived_reports}`);  
  }

}
