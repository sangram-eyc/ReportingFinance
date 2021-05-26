import { TestBed } from '@angular/core/testing';

import { ApiService } from './api.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpHeaders } from '@angular/common/http';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.get(HttpTestingController);
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
    const url = "http://localhost:4200/assets/mock/filings.json"
    service.invokeGetAPI(url).subscribe((res) => {
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
    const url = "http://localhost:4200/assets/mock/filings.json"
    service.invokeGetDownloadAPI(url).subscribe((res) => {
      expect(res).toEqual(JSON.parse(data.toString()));

      const req = httpMock.expectOne(url);
      expect(req.request.method).toEqual("GET");
      req.flush(data);

      httpMock.verify();
    });
  });


  it('invokePostAPI  returned Observable should match the right data', () => {
    const mockUser = {
      "firstName": "Akshay",
      "lastName": "Raskar",
      "userEmail": "Akshay.Raskar1@ey.com"
    };
    const url = "http://localhost:4200/assets/mock/users.json"
    service.invokePostAPI(url, mockUser)
      .subscribe(res => {
        expect(res['firstName']).toEqual('Akshay');
      });

    const req = httpMock.expectOne(url);
    expect(req.request.method).toEqual('POST');
    req.flush(mockUser);
  });

  it('invokePutAPI  returned Observable should match the right data', () => {
    const mockUser = {
      "firstName": "Akshay",
      "lastName": "Raskar",
      "userEmail": "Akshay.Raskar1@ey.com"
    };
    const url = "http://localhost:4200/assets/mock/users.json"
    service.invokePutAPI(url, mockUser)
      .subscribe(res => {
        expect(res['firstName']).toEqual('Akshay');
      });

    const req = httpMock.expectOne(url);
    expect(req.request.method).toEqual('PUT');
    req.flush(mockUser);
  });

  it('invokeDeleteAPI  returned Observable should match the right data', () => {
    const mockUserID = 1;
    const url = "http://localhost:4200/assets/mock/users.json/" +mockUserID
    service.invokeDeleteAPI(url)
      .subscribe(res => {
        expect(res).toBeTruthy;
      });

    const req = httpMock.expectOne(url);
    expect(req.request.method).toEqual('DELETE');
    req.flush(mockUserID);
  });
});
