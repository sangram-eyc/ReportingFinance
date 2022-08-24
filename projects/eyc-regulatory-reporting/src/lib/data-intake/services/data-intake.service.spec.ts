import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { EycRrApiService } from '../../services/eyc-rr-api.service';
import { EycRrSettingsService } from '../../services/eyc-rr-settings.service';

import { DataIntakeService } from './data-intake.service';

describe('DataIntakeService', () => {
  let service: DataIntakeService;
  let eycRrSettingsServiceStub = {
    regReportingFiling : {
      di_exception_reports:'/di_exception_reports',
      di_files:'/di_files',
      exception_summary:'/exception_summary',
      bd_files_list:'/bd_files_list',
      datasets_list:'/datasets_list',
      rr_comments:'/rr_comments',
      approve_intake_exception_report:'/approve_intake_exception_report',
      mark_intake_complete:'/mark_intake_complete'
    }
  };
  let eycRrApiServiceStub = {
    invokeGetAPI :()=>{},
    invokePutAPI:()=>{}
  }
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [
        { provide: EycRrSettingsService, useValue: eycRrSettingsServiceStub },
        { provide: EycRrApiService, useValue: eycRrApiServiceStub }]
    });
    service = TestBed.inject(DataIntakeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getExceptionReports method should call api and should return exception reports',()=>{
    spyOn(service['apiService'],'invokeGetAPI')
    service.getExceptionReports('form PF','Q2 2022');
    expect(service['apiService'].invokeGetAPI).toHaveBeenCalled();
  });

  it('getExceptionReports method should call api and should return exception reports when mockDataEnable is true',()=>{
    service['mockDataEnable'] = true;
    spyOn(service['apiService'],'invokeGetAPI');
    service.getExceptionReports('form PF','Q2 2022');
    expect(service['apiService'].invokeGetAPI).toHaveBeenCalled();
  });

  it('getfilingEntities method should call api and should return filing entities',()=>{
    spyOn(service['apiService'],'invokeGetAPI')
    service.getfilingEntities('form PF','Q2 2022');
    expect(service['apiService'].invokeGetAPI).toHaveBeenCalled();
  });

  it('getfilesList method should call api and should return files list',()=>{
    spyOn(service['apiService'],'invokeGetAPI')
    service.getfilesList('form PF','Q2 2022');
    expect(service['apiService'].invokeGetAPI).toHaveBeenCalledWith('/exception_summaryfilingName=form PF&period=Q2 2022');
  });

  it('getfilesList method should call api and should return files list, mockDataEnable is true',()=>{
    service['mockDataEnable'] = true;
    spyOn(service['apiService'],'invokeGetAPI')
    service.getfilesList('form PF','Q2 2022');
    expect(service['apiService'].invokeGetAPI).toHaveBeenCalledWith('/exception_summary');
  });

  it('getBDFilesList method should call api and should return BD files list',()=>{
    spyOn(service['apiService'],'invokeGetAPI')
    service.getBDFilesList('form PF','01/03/2022','Q2 2022');
    expect(service['apiService'].invokeGetAPI).toHaveBeenCalledWith('/bd_files_listfilingName=form PF&lastFileDueDate=01/03/2022&period=Q2 2022');
  });

  it('getBDFilesList method should call api and should return BD files list, mockDataEnable is true',()=>{
    service['mockDataEnable'] = true;
    spyOn(service['apiService'],'invokeGetAPI')
    service.getBDFilesList('form PF','01/03/2022','Q2 2022');
    expect(service['apiService'].invokeGetAPI).toHaveBeenCalledWith('/bd_files_list');
  });

  it('getDatasetsrecords method should call api and should return dataset records',()=>{
    spyOn(service['apiService'],'invokeGetAPI');
    service.getDatasetsrecords('form PF','Q2 2022');
    expect(service['apiService'].invokeGetAPI).toHaveBeenCalledWith('/datasets_listfilingName=form PF&period=Q2 2022');
  });

  it('getDatasetsrecords method should call api and should return dataset records, mockDataEnable is true',()=>{
    service['mockDataEnable'] = true;
    spyOn(service['apiService'],'invokeGetAPI');
    service.getDatasetsrecords('form PF','Q2 2022');
    expect(service['apiService'].invokeGetAPI).toHaveBeenCalledWith('/datasets_list');
  });

  it('getComments method should set fetch comments',()=>{
    spyOn(service['apiService'],'invokeGetAPI');
    service.getComments('dataset','101');
    expect(service['apiService'].invokeGetAPI).toHaveBeenCalledWith('/rr_comments');
  })
  
  it('approveExceptionReports method should call api and should approve exception reports',()=>{
    spyOn(service['apiService'],'invokePutAPI');
    service.approveExceptionReports([{exceptionId:'1011',exceptionName:'files'}]);
    expect(service['apiService'].invokePutAPI).toHaveBeenCalledWith('/approve_intake_exception_report',[{exceptionId:'1011',exceptionName:'files'}]);
  });

  it('exportIntakeData method should call api for export intake data',()=>{
    spyOn(service['apiService'],'invokeGetAPI');
    service.exportIntakeData('/exportURL');
    expect(service['apiService'].invokeGetAPI).toHaveBeenCalledWith('/exportURL');

  })

  it('markDatantakeComplete method should call api and should mark data intake complete',()=>{
    spyOn(service['apiService'],'invokePutAPI');
    service.markDatantakeComplete('form PF','Q2 2022','stage1');
    expect(service['apiService'].invokePutAPI).toHaveBeenCalledWith('/mark_intake_completecomplete?filingName=form PF&period=Q2 2022&stage=stage1');
  });
});
