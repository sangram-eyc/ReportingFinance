import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EycDataApiService } from './eyc-data-api.service';
import { DataSummary } from '../models/data-summary.model';
import { DATA_FREQUENCY, DATA_INTAKE_TYPE, FILTER_TYPE } from '../../config/dms-config-helper';

describe('EycDataApiService', () => {
    let service: EycDataApiService;
    let httpMock: HttpTestingController;
    let httpQueryParams: DataSummary;
    
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [EycDataApiService],
        });
        service = TestBed.inject(EycDataApiService);
        httpMock = TestBed.get(HttpTestingController);
    });

    beforeEach(()=>{
        httpQueryParams ={
            startDate: '',
            endDate: '',
            dataFrequency: DATA_FREQUENCY.DAILY,
            dataIntakeType: DATA_INTAKE_TYPE.DATA_PROVIDER,
            dueDate: '2021-10-22',
            periodType: '',
            filterTypes: [
              FILTER_TYPE.NO_ISSUES, FILTER_TYPE.HIGH, FILTER_TYPE.LOW, FILTER_TYPE.MEDIUM,
              FILTER_TYPE.MISSING_FILES, FILTER_TYPE.FILE_NOT_RECIEVED]
          };
    });
    
      
    

    it('should be created', () => {
        const service: EycDataApiService = TestBed.get(EycDataApiService);
        expect(service).toBeTruthy();

    });

    it('invokeGetAPI should http GET ', () => {
        const url = "http://localhost:4200/assets/mock/file-summary-list-daily.json";
        const data={
            "success": true,
            "message": "success",
            "data": {
                "totalCount": 600,
                "dataSeries": [
                    {
                        "label": "No issue",
                        "value": 400
                    },
                    {
                        "label": "Medium / low priority issues",
                        "value": 50
                    },
                    {
                        "label": "High priority issues",
                        "value": 50
                    },
                    {
                        "label": "Missing files, past due",
                        "value": 50
                    },
                    {
                        "label": "Files not received",
                        "value": 50
                    }
                ]
            }
        }
        service.invokeGetAPI(url).subscribe((res) => {
          expect(res).toEqual(JSON.parse(data.toString()));
          const req = httpMock.expectOne(url);
          expect(req.request.method).toEqual("GET");
          req.flush(data);
    
          httpMock.verify();
        });
      });

      it('invokePostAPI  returned Observable should match the right data', () => {
        const url = "http://localhost:4200/assets/mock/file-summary-list-daily.json";
        const data={
            "success": true,
            "message": "success",
            "data": {
                "totalCount": 600,
                "dataSeries": [
                    {
                        "label": "No issue",
                        "value": 400
                    },
                    {
                        "label": "Medium / low priority issues",
                        "value": 50
                    },
                    {
                        "label": "High priority issues",
                        "value": 50
                    },
                    {
                        "label": "Missing files, past due",
                        "value": 50
                    },
                    {
                        "label": "Files not received",
                        "value": 50
                    }
                ]
            }
        }
        service.invokePostAPI(url, httpQueryParams)
          .subscribe(res => {
            expect(res).toEqual(JSON.parse(data.toString()));
          });
    
        const req = httpMock.expectOne(url);
        expect(req.request.method).toEqual('POST');
        req.flush(httpQueryParams);
      });
});
