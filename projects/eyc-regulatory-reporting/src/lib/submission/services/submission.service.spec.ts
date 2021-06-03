import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../../../../src/environments/environment';
import { EycRrSettingsService } from '../../services/eyc-rr-settings.service';

import { SubmissionService } from './submission.service';

describe('SubmissionService', () => {
  let service: SubmissionService;
  let httpMock: HttpTestingController;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [EycRrSettingsService,
        {provide:"apiEndpoint",  useValue: environment.apiEndpoint},
        {provide:"rrproduction",  useValue: environment.production}]
    });
    service = TestBed.inject(SubmissionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('invokeGetAPI should http GET ', () => {

    const data = {

      "success": true,
      "message": "sucess",
      "data": [
            {
                "fileId": 1,
                "fileName": "XML File 1"
            },
            {
                "fileId": 2,
                "fileName": "XML File 2"
            },
            {
                "fileId": 3,
                "fileName": "XML File 3"
            }
        ]

    }
    const url = "/assets/eyc-regulatory-reporting/mock/xmlFilesList.json"
    service.getXmlFilesList().subscribe((res) => {
      expect(res).toEqual(JSON.parse(data.toString()));


      const req = httpMock.expectOne(url);
      expect(req.request.method).toEqual("GET");
      req.flush(data);

      httpMock.verify();
    });
  });

  it('invokeGetDownloadAPI should http GET ', () => {

    const data = {
      "success": true,
      "message": "sucess",
      "data": [
        {
          "name": "CPO-PQR",
          "status": {
            "stage": "Data Intake",
            "progress": "in-progress"
          },
          "comments": [],
          "dueDate": 1625112000000,
          "startDate": 1621276200000,
          "period": "Q3 2021"
        },
        {
          "name": "Form PF",
          "status": {
            "stage": "Data Intake",
            "progress": "in-progress"
          },
          "comments": [],
          "dueDate": 1625112000000,
          "startDate": 1621881000000,
          "period": "Q3 2021"
        }]
    }
    const url = "/assets/eyc-regulatory-reporting/mock/1.xml"
    service.downloadXMl(1).subscribe((res) => {
      expect(res).toEqual(JSON.parse(data.toString()));

      const req = httpMock.expectOne(url);
      expect(req.request.method).toEqual("GET");
      req.flush(data);

      httpMock.verify();
    });
  });

});
