import { HttpClientModule, HttpParams } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../../../../src/environments/environment';
import { DataManagedService } from './data-managed.service';
import { DataSummary } from '../models/data-summary.model';

import { DATA_FREQUENCY, DATA_INTAKE_TYPE, FILTER_TYPE } from '../../config/dms-config-helper';

describe('DataManagedService', () => {
  let service: DataManagedService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [
         {provide:"dataManagedEndPoint",  useValue: environment.apiEndpoint},
        {provide:"dataManagedProduction",  useValue: environment.production}]
    });
    service = TestBed.inject(DataManagedService);
    httpMock = TestBed.get(HttpTestingController);
  });

  let httpQueryParams: DataSummary;
  beforeEach(() => {
    httpQueryParams =
    {
      startDate: '',
      EndDate: '',
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
    expect(service).toBeTruthy();
  });

  it('should return list DataProviderList', () => {
    const data= {
      "success": true,
      "message": "success",
      "data": {
          "totalCount": 350,
          "dataSeries": [{
              "name": "Statestreet",
              "value": 50632
            },
            {
              "name": "JP Morgan",
              "value": 40000
            },
            {
              "name": "Bluming",
              "value": 36745
            },
            {
              "name": "BNYM",
              "value": 30000
            },
            {
              "name": "South Gate",
              "value": 20000
            },
            {
              "name": "Data H",
              "value": 10000
            }
            ] 
      }
  }
    service.getDataProviderList().subscribe(resp => {
      expect(resp).toEqual(data);
    //   let req = httpMock.expectOne(environment.apiEndpoint + 'assets/eyc-regulatory-reporting/mock/filings.json1');
    // expect(req.request.method).toEqual("GET");
    // req.flush(filingSearch);
    // httpMock.verify();
    })
  });

  it('should return list daily data providers', () => {
    const data={
      "success": true,
      "message": "",
      "corelationId": "1293081023",
      "data": [
          {
              "totalCount": 162,
              "dataProvideCount": 3,
              "dataDomainCount": 6,
              "totalSeriesItem": [
                  {
                      "label": "No issue",
                      "value": 84,
                      "seriesItemDTO": [
                          {
                              "name": "Admin - SEI",
                              "value": 24
                          },
                          {
                              "name": "EY - Manual",
                              "value": 1
                          },
                          {
                              "name": "BNYM",
                              "value": 59
                          }
                      ]
                  },
                  {
                      "label": "Medium / low priority issues",
                      "value": 3,
                      "seriesItemDTO": [
                          {
                              "name": "BNYM",
                              "value": 3
                          }
                      ]
                  },
                  {
                      "label": "High priority issues",
                      "value": 6,
                      "seriesItemDTO": [
                          {
                              "name": "BNYM",
                              "value": 6
                          }
                      ]
                  },
                  {
                      "label": "Missing files, past due",
                      "value": 9,
                      "seriesItemDTO": [
                          {
                              "name": "BNYM",
                              "value": 9
                          }
                      ]
                  },
                  {
                      "label": "Files not received",
                      "value": 60,
                      "seriesItemDTO": [
                          {
                              "name": "BNYM",
                              "value": 60
                          }
                      ]
                  }
              ]
          }
      ],
      "error": null
  }
    service.getDailyDataProviderList().subscribe(resp => {
      expect(resp).toEqual(data)
    })
  });

  it('should return list monthly data providers', () => {
    const data= {
      "success": true,
      "message": "",
      "corelationId": "1293081023",
      "data": [
          {
              "totalCount": 260,
              "dataProvideCount": 3,
              "dataDomainCount": 6,
              "totalSeriesItem": [
                  {
                      "label": "No issue",
                      "value": 184,
                      "seriesItemDTO": [
                          {
                              "name": "Admin - SEI",
                              "value": 124
                          },
                          {
                              "name": "EY - Manual",
                              "value": 1
                          },
                          {
                              "name": "BNYM",
                              "value": 59
                          }
                      ]
                  },
                  {
                      "label": "Medium / low priority issues",
                      "value": 13,
                      "seriesItemDTO": [
                          {
                              "name": "BNYM",
                              "value": 13
                          }
                      ]
                  },
                  {
                      "label": "Missing files, past due",
                      "value": 30,
                      "seriesItemDTO": [
                          {
                              "name": "BNYM",
                              "value": 30
                          }
                      ]
                  },
                  {
                      "label": "Files not received",
                      "value": 33,
                      "seriesItemDTO": [
                          {
                              "name": "BNYM",
                              "value": 33
                          }
                      ]
                  }
              ]
          }
      ],
      "error": null
  }
    service.getMonthlyDataProviderList().subscribe(resp => {
      expect(resp).toEqual(data)
    })
  });

  it('should return data domain daily list', () => {
    const data={
      "success": true,
      "message": "",
      "corelationId": "1293081023",
      "data": [
        {
          "totalCount": 98,
          "dataProvideCount": 3,
          "dataDomainCount": 6,
          "totalSeriesItem": [
            {
              "label": "No issue",
              "value": 84,
              "seriesItemDTO": [
                {
                  "name": "General Ledger",
                  "value": 40
                },
                {
                  "name": "Positions",
                  "value": 19
                },
                {
                  "name": "Reference Data",
                  "value": 14
                },
                {
                  "name": "Transactions",
                  "value": 6
                },
                {
                  "name": "Account and Fund Hierarchy",
                  "value": 2
                },
                {
                  "name": "Portfolio Valuation",
                  "value": 3
                }
              ]
            },
            {
              "label": "Medium / low priority issues",
              "value": 3,
              "seriesItemDTO": [
                {
                  "name": "Positions",
                  "value": 2
                },
                {
                  "name": "Entity",
                  "value": 1
                }
              ]
            },
            {
              "label": "High priority issues",
              "value": 4,
              "seriesItemDTO": [
                {
                  "name": "Positions",
                  "value": 2
                },
                {
                  "name": "Entity",
                  "value": 2
                }
              ]
            },
            {
              "label": "Files not received",
              "value": 6,
              "seriesItemDTO": [
                {
                  "name": "Positions",
                  "value": 2
                },
                {
                  "name": "Entity",
                  "value": 4
                }
              ]
            }
          ]
        }
      ],
      "error": null
    }
    service.getDailyDataDomainList().subscribe(resp => {
      expect(resp).toEqual(data)
    })
  });

  it('should return data domain monthly list', () => {
    const data= {
      "success": true,
      "message": "",
      "corelationId": "1293081023",
      "data": [
        {
          "totalCount": 178,
          "dataProvideCount": 3,
          "dataDomainCount": 6,
          "totalSeriesItem": [
            {
              "label": "No issue",
              "value": 124,
              "seriesItemDTO": [
                {
                  "name": "General Ledger",
                  "value": 50
                },
                {
                  "name": "Positions",
                  "value": 29
                },
                {
                  "name": "Reference Data",
                  "value": 24
                },
                {
                  "name": "Transactions",
                  "value": 16
                },
                {
                  "name": "Account and Fund Hierarchy",
                  "value": 2
                },
                {
                  "name": "Portfolio Valuation",
                  "value": 3
                }
              ]
            },
            {
              "label": "Medium / low priority issues",
              "value": 3,
              "seriesItemDTO": [
                {
                  "name": "Positions",
                  "value": 2
                },
                {
                  "name": "Entity",
                  "value": 1
                }
              ]
            },
            {
              "label": "High priority issues",
              "value": 13,
              "seriesItemDTO": [
                {
                  "name": "Positions",
                  "value": 12
                },
                {
                  "name": "Entity",
                  "value": 1
                }
              ]
            },
            {
              "label": "Missing files, past due",
              "value": 17,
              "seriesItemDTO": [
                {
                  "name": "Positions",
                  "value": 6
                },
                {
                  "name": "Entity",
                  "value": 11
                }
              ]
            },
            {
              "label": "Files not received",
              "value": 21,
              "seriesItemDTO": [
                {
                  "name": "Positions",
                  "value": 20
                },
                {
                  "name": "Entity",
                  "value": 1
                }
              ]
            }
          ]
        }
      ],
      "error": null
    }
    service.getMonthlyDataDomainList().subscribe(resp => {
      expect(resp).toEqual(data )
    })
  });

  it('should return ExceptionReports', () => {
    const data= {
      "success": true,
      "message": "success",
      "data": {
          "rowData": [
              {
                  "type": "Valuation",
                  "exposure": "Listed Equity",
                  "classification": "Financial",
                  "category": "DiffLVL",
                  "value": "(64,27,000)",
                  "variance": "2.47%"
              },
              {
                  "type": "Valuation",
                  "exposure": "Listed Equity",
                  "classification": "Non-financial",
                  "category": "DiffLVL",
                  "value": "(4,27,000)",
                  "variance": "2.47%"
              },
              {
                  "type": "Valuation",
                  "exposure": "Listed Equity",
                  "classification": "Financial",
                  "category": "DiffLVL",
                  "value": "(4,02,000)",
                  "variance": "0.47%"
              },
              {
                  "type": "Valuation",
                  "exposure": "Listed Equity",
                  "classification": "Non-financial",
                  "category": "DiffLVL",
                  "value": "(4,56,000)",
                  "variance": "0.87%"
              },
              {
                  "type": "Valuation",
                  "exposure": "Listed Equity",
                  "classification": "Non-financial",
                  "category": "DiffLVL",
                  "value": "(3,70,000)",
                  "variance": "0.37%"
              },
              {
                  "type": "Valuation",
                  "exposure": "Listed Equity Derivatives",
                  "classification": "Financial",
                  "category": "DiffLVL",
                  "value": "(2,27,000)",
                  "variance": "0.10%"
              },
              {
                  "type": "Valuation",
                  "exposure": "Listed Equity Derivatives",
                  "classification": "Non-financial",
                  "category": "DiffLVL",
                  "value": "(3,43,000)",
                  "variance": "0.37%"
              },
              {
                  "type": "Valuation",
                  "exposure": "Listed Equity Derivatives",
                  "classification": "Financial",
                  "category": "DiffLVL",
                  "value": "(2,27,000)",
                  "variance": "0.56%"
              },
              {
                  "type": "Valuation",
                  "exposure": "Listed Equity Derivatives",
                  "classification": "Financial",
                  "category": "DiffLVL",
                  "value": "(5,23,000)",
                  "variance": "0.87%"
              }
          ]
      }
  }
    service.getExceptionReportstable().subscribe(resp => {
      expect(resp).toEqual(data)
    })
  });

  it('should return ReviewFilesData', () => {
    const data= {
      "success": true,
      "message": "success",
      "data": {
          "totalCount": 50,
          "dataseries": [
              {
                  "name": "Statestreet",
                  "series": [
                      {
                          "name": "Files not received",
                          "value": 3000,
                          "status":"Files not received"
                      },
                      {
                          "name": "Missing files, past due",
                          "value": 2500,
                          "status":"Missing files, past due"
                      },
                      {
                          "name": "High priority issues",
                          "value": 2500,
                          "status":"High priority issues"
                      },
                      {
                          "name": "Medium / low priority issues",
                          "value": 2600,
                          "status":"Medium / low priority issues"
                      },
                      {
                          "name": "No issues",
                          "value": 1006,
                          "status":"No issues"
                      }
                  ]
              },
              {
                  "name": "Data H",
                  "series": [
                      {
                          "name": "Files not received",
                          "value": 2000,
                          "status":"Files not received"
                      },
                      {
                          "name": "Missing files, past due",
                          "value": 1000,
                          "status":"Missing files, past due"
                      },
                      {
                          "name": "High priority issues",
                          "value": 1000,
                          "status":"High priority issues"
                      },
                      {
                          "name": "Medium / low priority issues",
                          "value": 3093,
                          "status":"Medium / low priority issues"
                      },
                      {
                          "name": "No issues",
                          "value": 1376,
                          "status":"No issues"
                      }
                  ]
              },
              {
                  "name": "South Gate",
                  "series": [
                      {
                          "name": "Files not received",
                          "value": 3000,
                          "status":"Files not received"
                      },
                      {
                          "name": "Missing files, past due",
                          "value": 1300,
                          "status":"Missing files, past due"
                      },
                      {
                          "name": "High priority issues",
                          "value": 1100,
                          "status":"High priority issues"
                      },
                      {
                          "name": "Medium / low priority issues",
                          "value": 3000,
                          "status":"Medium / low priority issues"
                      },
                      {
                          "name": "No issues",
                          "value": 2300,
                          "status":"No issues"
                      }
                  ]
              },
              {
                  "name": "BNYM",
                  "series": [
                      {
                          "name": "Files not received",
                          "value": 2000,
                          "status":"Files not received"
                      },
                      {
                          "name": "Missing files, past due",
                          "value": 2400,
                          "status":"Missing files, past due"
                      },
                      {
                          "name": "High priority issues",
                          "value": 1700,
                          "status":"High priority issues"
                      },
                      {
                          "name": "Medium / low priority issues",
                          "value": 3100,
                          "status":"Medium / low priority issues"
                      },
                      {
                          "name": "No issues",
                          "value": 2400,
                          "status":"No issues"
                      }
                  ]
              },
              {
                  "name": "Bluming",
                  "series": [
                      {
                          "name": "Files not received",
                          "value": 2300,
                          "status":"Files not received"
                      },
                      {
                          "name": "Missing files, past due",
                          "value": 2200,
                          "status":"Missing files, past due"
                      },
                      {
                          "name": "High priority issues",
                          "value": 1400,
                          "status":"High priority issues"
                      },
                      {
                          "name": "Medium / low priority issues",
                          "value": 3000,
                          "status":"Medium / low priority issues"
                      },
                      {
                          "name": "No issues",
                          "value": 1200,
                          "status":"No issues"
                      }
                  ]
              },
              {
                  "name": "JP Morgan",
                  "series": [
                      {
                          "name": "Files not received",
                          "value": 4000,
                          "status":"Files not received"
                      },
                      {
                          "name": "Missing files, past due",
                          "value": 2000,
                          "status":"Missing files, past due"
                      },
                      {
                          "name": "High priority issues",
                          "value": 1500,
                          "status":"High priority issues"
                      },
                      {
                          "name": "Medium / low priority issues",
                          "value": 3693,
                          "status":"Medium / low priority issues"
                      },
                      {
                          "name": "No issues",
                          "value": 1476,
                          "status":"No issues"
                      }
                  ]
              },
              {
                  "name": "Tata",
                  "series": [
                      {
                          "name": "Files not received",
                          "value": 1000,
                          "status":"Files not received"
                      },
                      {
                          "name": "Missing files, past due",
                          "value": 1500,
                          "status":"Missing files, past due"
                      },
                      {
                          "name": "High priority issues",
                          "value": 2000,
                          "status":"High priority issues"
                      },
                      {
                          "name": "Medium / low priority issues",
                          "value": 3693,
                          "status":"Medium / low priority issues"
                      },
                      {
                          "name": "No issues",
                          "value": 4476,
                          "status":"No issues"
                      }
                  ]
              }
          ]
      }
  }
    service.getReviewFilesData().subscribe(resp => {
      expect(resp).toEqual(data)
    })
  });

  it('should return ReviewFileTableData', () => {
    const data ={
      "success": true,
      "message": "success",
      "data": {
          "totalCount": 50,
          "rowData": [
              {
                  "file": "General_Ledger_09",
                  "provider": "Data H",
                  "data_domain": "General Ledger",
                  "functions": "TRMS, ",
                  "due_date": "10/19/2021 | 9:00am EST",
                  "exceptions": "Fund completeness",
                  "Status": "High"
              },
              {
                  "file": "General_Ledger_091",
                  "provider": "Statestreet",
                  "data_domain": "General Ledger",
                  "functions": "TRMS,",
                  "due_date": "10/15/2021 | 9:00am EST",
                  "exceptions": "",
                  "Status": "No Issues"
              },
              {
                  "file": "General_Ledger_09",
                  "provider": "Data H",
                  "data_domain": "General Ledger",
                  "functions": "TRMS, ",
                  "due_date": "10/19/2021 | 9:00am EST",
                  "exceptions": "Fund completeness",
                  "Status": "High"
              },
              {
                  "file": "Positions_state_071",
                  "provider": "Facet",
                  "data_domain": "Positions",
                  "functions": "RRMS, ",
                  "due_date": "-12 Days ",
                  "exceptions": "",
                  "Status": "Missing"
              },
              {
                  "file": "General_Ledger_09",
                  "provider": "Data H",
                  "data_domain": "General Ledger",
                  "functions": "TRMS, ",
                  "due_date": "10/19/2021 | 9:00am EST",
                  "exceptions": "Fund completeness",
                  "Status": "High"
              },
              {
                  "file": "General_Ledger_091",
                  "provider": "Statestreet",
                  "data_domain": "General Ledger",
                  "functions": "TRMS, ",
                  "due_date": "10/15/2021 | 9:00am EST",
                  "exceptions": "Fund completeness",
                  "Status": "Medium / Low"
              },
              {
                  "file": "Positions_state_071",
                  "provider": "Facet",
                  "data_domain": "Positions",
                  "functions": "RRMS, ",
                  "due_date": "-12 Days ",
                  "exceptions": "",
                  "Status": "Missing"
              },
              {
                  "file": "General_Ledger_091",
                  "provider": "Statestreet",
                  "data_domain": "General Ledger",
                  "functions": "TRMS, ",
                  "due_date": "10/15/2021 | 9:00am EST",
                  "exceptions": "Fund completeness",
                  "Status": "Medium / Low"
              }
          ]
      }
  }
    service.getReviewFileTableData().subscribe(resp => {
      expect(resp).toEqual(data)
    })
  });

  it('should return FileSummaryList', () => {
    const data= {
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
    service.getFileSummaryList(httpQueryParams).subscribe(resp => {
      expect(resp).toEqual(data)
    })
  })
  
  it('should return API DailyGeneralLedgerList', () => {
    const data={
      "success": true,
      "message": "success",
      "data": {
          "totalCount": 600,
          "dataSeries": [
              {
                  "label": "No issue",
                  "value": 200
              },
              {
                  "label": "Medium / low priority issues",
                  "value": 0
              },
              {
                  "label": "High priority issues",
                  "value": 0
              },
              {
                  "label": "Missing files, past due",
                  "value": 0
              },
              {
                  "label": "Files not received",
                  "value": 50
              }
          ]
      }
  }
    service.getDailyGeneralLedgerList(0, 0).subscribe(resp => {
      expect(resp).toEqual(data)
    })
  });
});
