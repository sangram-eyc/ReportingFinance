import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Renderer2, Type } from '@angular/core';
import { async, ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from '../../../../../../src/environments/environment';
import { taxenvironment } from '../../../../../../src/environments/eyc-tax-reporting/tax-environment';
import { ProductionCycleService } from '../services/production-cycle.service';
import { CycleDetailComponent } from './cycle-details.component';

describe('EycCycleDetailsComponent', () => {
  let component: CycleDetailComponent;
  let fixture: ComponentFixture<CycleDetailComponent>;
  let productionCyclesService: ProductionCycleService;
  let mockCyclesDetails = {
    "success": true,
    "message": "",
    "corelationId": null,
    "data": [
        {
        "name": "Fund 1",
        "id": "1ASKDJ10398ASKDJO",
        "hasContent": false,         
        "status": "open",
        "openCommentsEY": 2,
        "openCommentsClient": 3,
        "totalComments":20,
        "lastUpdatedDate": "2022-01-12T10:59:41.947+00:00",
        "assignedUsers": [
            {
                "userId": 123, 
                "userEmail": "Jonnathan.Caballero@ey.com", 
                "userFirstName": "Jonnathan", 
                "userLastName": "Caballero" 
            },
            {
                "userId": 3303,
                "userEmail": "Gaston.Silva@email.com", 
                "userFirstName": "Gaston", 
                "userLastName": "Silva" 
            },
            {
                "userId": 3304,
                "userEmail": "Diego.Garavito@email.com", 
                "userFirstName": "Diego", 
                "userLastName": "Garavito" 
            },
            {
                "userId": 3305,
                "userEmail": "Gabriel.Loy@email.com", 
                "userFirstName": "Gabriel", 
                "userLastName": "Loy" 
            },
            {
                "userId": 2202,
                "userEmail": "Diego.Morini@ey.com", 
                "userFirstName": "Diego", 
                "userLastName": "Morini" 
            }
        ]
    },
    {
        "name": "Fund 2",
        "id": "2ASKDJ10398ASKDJO",
        "hasContent": true,         
        "status": "open",
        "openCommentsEY": 200,
        "openCommentsClient": 2,
        "totalComments":100,
        "lastUpdatedDate": "2022-01-12T10:59:41.947+00:00",
        "assignedUsers":[
            {
                "userId": 123, 
                "userEmail": "Jonnathan.Caballero@email.com", 
                "userFirstName": "Jonnathan", 
                "userLastName": "Caballero" 
            },
            {
                "userId": 3303,
                "userEmail": "Gaston.Silva@email.com", 
                "userFirstName": "Gaston", 
                "userLastName": "Silva" 
            },
            {
                "userId": 3304,
                "userEmail": "Diego.Garavito@email.com", 
                "userFirstName": "Diego", 
                "userLastName": "Garavito" 
            }
        ]
    },
    {
        "name": "Fund 3",
        "id": "3ASKDJ10398ASKDJO",
        "hasContent": true,         
        "status": "approved",
        "openCommentsEY": 99,
        "openCommentsClient": 660,
        "totalComments":2,
        "lastUpdatedDate": "2022-01-12T10:59:41.947+00:00",
        "assignedUsers":[
            {

            "userId": 123, 
            "userEmail": "Jonnathan.Caballero@email.com", 
            "userFirstName": "Jonnathan", 
            "userLastName": "Caballero" 
            }]
    },
    {
        "name": "Fund 4",
        "id": "4ASKDJ10398ASKDJO",
        "hasContent": true,         
        "status": "open",
        "openCommentsEY":"10",
        "openCommentsClient":"10",
        "totalComments":30,
        "lastUpdatedDate": "2022-01-12T10:59:41.947+00:00",
        "assignedUsers":[
            {
            "userId": 123, 
            "userEmail": "Jonnathan.Caballero@email.com", 
            "userFirstName": "Jonnathan", 
            "userLastName": "Caballero" 
        }
       ]
    },
    {
        "name": "Fund 5",
        "id": "5ASKDJ10398ASKDJO",
        "hasContent": true,         
        "status": "open",
        "openCommentsEY": 0,
        "openCommentsClient": 5,
        "lastUpdatedDate": "2022-01-12T10:59:41.947+00:00",
        "assignedUsers":[]
    },
    {
        "name": "Fund 6",
        "id": "6ASKDJ10398ASKDJO",
        "hasContent": true,         
        "status": "approved",
        "openCommentsEY": 0,
        "openCommentsClient": 0,
        "lastUpdatedDate": "2022-01-12T10:59:41.947+00:00",
        "assignedUsers":[]

    },
    {
        "name": "Fund 7",
        "id": "7ASKDJ10398ASKDJO",
        "hasContent": true,         
        "status": "approved",
        "openCommentsEY": 0,
        "openCommentsClient": 0,
        "lastUpdatedDate": "2022-01-12T10:59:41.947+00:00",
        "assignedUsers":[]

    },
    {
        "name": "Fund 8",
        "id": "ASKDJ10398ASKDJ1",
        "hasContent": true,         
        "status": "approved",
        "openCommentsEY": 0,
        "openCommentsClient": 0,
        "assignedUsers":[]

    },
    {
        "name": "Fund 9",
        "id": "ASKDJ10398ASKDJq",
        "hasContent": true,         
        "status": "approved",
        "openCommentsEY": 0,
        "openCommentsClient": 0,
        "assignedUsers":[]

    },
    {
        "name": "Fund 10",
        "id": "ASKDJ10398ASKrJO",
        "hasContent": true,         
        "status": "approved",
        "openCommentsEY": 0,
        "openCommentsClient": 0,
        "assignedUsers":[]

    },
    {
        "name": "Fund 11",
        "id": "ASKDJ103f8ASKDJO",
        "hasContent": true,         
        "status": "approved",
        "openCommentsEY": 0,
        "openCommentsClient": 0,
        "assignedUsers":[]

    },
    {
        "name": "Fund 12",
        "id": "ASKDJ10398ASKDJO",
        "hasContent": true,         
        "status": "open",
        "openCommentsEY": 1,
        "openCommentsClient": 0,
        "assignedUsers":[]

    },
    {
        "name": "Fund 13",
        "id": "ASKDJ10398ASKDJO",
        "hasContent": true,         
        "status": "approved",
        "openCommentsEY": 0,
        "openCommentsClient": 1,
        "assignedUsers":[]

    },
    {
        "name": "Fund 14",
        "id": "ASKDJ10398ASKDJO",
        "hasContent": true,         
        "status": "approved",
        "openCommentsEY": 0,
        "openCommentsClient": 0,
        "assignedUsers":[]

    },
    {
        "name": "Fund 15",
        "id": "ASKDJ10398ASKDJO",
        "hasContent": true,         
        "status": "approved",
        "openCommentsEY": 0,
        "openCommentsClient": 0,
        "assignedUsers":[]

    },
    {
        "name": "Fund 17",
        "id": "ASKDJ10398ASTTDJO",
        "hasContent": true,         
        "status": "OPEN",
        "openCommentsEY": 0,
        "openCommentsClient": 0,
        "assignedUsers":[{
            "userId": 123, 
            "userEmail": "Jonnathan.Caballero@ey.com", 
            "userFirstName": "Jonnathan", 
            "userLastName": "Caballero" 
        }]

    },
    {
        "name": "Fund 18",
        "id": "ASKDJ10398PPKDJO",
        "hasContent": true,         
        "status": "approved",
        "openCommentsEY": 0,
        "openCommentsClient": 0,
        "assignedUsers":[]

    },
    {
        "name": "Fund 19",
        "id": "ASKDJ10OO8ASKDJO",
        "hasContent": false,         
        "status": "OPEN",
        "openCommentsEY": 0,
        "openCommentsClient": 0,
        "assignedUsers":[]

    },
    {
        "name": "Fund 20",
        "id": "ASKDJ10398ASKXJO",
        "hasContent": true,         
        "status": "approved",
        "openCommentsEY": 0,
        "openCommentsClient": 0,
        "assignedUsers":[]

    },
    {
        "name": "Fund 21",
        "id": "ASKDJ1039JJSKDJO",
        "hasContent": true,         
        "status": "approved",
        "openCommentsEY": 0,
        "openCommentsClient": 0,
        "assignedUsers":[]

    },
    {
        "name": "Fund 22",
        "id": "ASKDJ10398ALLDJO",
        "hasContent": true,         
        "status": "approved",
        "openCommentsEY": 0,
        "openCommentsClient": 0,
        "assignedUsers":[]

    },
    {
        "name": "Fund D1",
        "id": "ASKDJ10398AJJDJO",
        "hasContent": true,         
        "status": "approved",
        "openCommentsEY": 0,
        "openCommentsClient": 0,
        "assignedUsers":[]

    }],
    "error": null
  };
  let renderer: Renderer2;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        CycleDetailComponent,
      ],
      imports: [
        CommonModule,
        RouterTestingModule,
        HttpClientTestingModule,
        RouterModule.forRoot([]),
        MatDialogModule,
      ],
      providers: [
        ProductionCycleService,
        {provide:"apiEndpoint",  useValue: environment.apiEndpoint},
        {provide:"taxapiEndpoint",  useValue: taxenvironment.apiEndpoint},
        {provide:"taxProduction",  useValue: taxenvironment.production},
        {provide: MatDialogRef, useValue: {} },
        FormBuilder
      ]
    })
    .compileComponents();
  }));

    beforeEach(() => {
    fixture = TestBed.createComponent(CycleDetailComponent);
    component = fixture.componentInstance;
    productionCyclesService = TestBed.get(ProductionCycleService);
/*     component.downloadButton = { nativeElement: 'nativeElement' };
    component.approveBtn = { nativeElement: 'nativeElement' };
    renderer = fixture.componentRef.injector.get<Renderer2>(Renderer2 as Type<Renderer2>);
    spyOn(renderer, 'setAttribute'); */
    component.ngAfterViewInit();
    fixture.detectChanges();
  });
  
});