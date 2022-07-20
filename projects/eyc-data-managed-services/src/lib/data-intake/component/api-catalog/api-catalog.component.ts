import { Component, OnInit,AfterViewInit } from '@angular/core';
import { DataManagedService } from '../../services/data-managed.service';
import { AutoUnsubscriberService } from 'eyc-ui-shared-component';

@Component({
  selector: 'lib-api-catalog',
  templateUrl: './api-catalog.component.html',
  styleUrls: ['./api-catalog.component.scss']
})
export class ApiCatalogComponent implements OnInit,AfterViewInit {

  apiCatalog;
  domains;
  operations;
  parameters;
  response;

  ready:boolean = false
  show2:boolean=false;
  modeselect;
  selectedFilter:string="Daily";
  motifTypeahead;
  editTrigger;
  columnDefs: string[] = [
    'name',
    'nullable',
    'description',
    'parameterType',
    'dataType',
  ];
  columnDefs1: string[] = ['key', 'description'];
  searchKey: string = '';

  responsesTyps = [
    { key: 200, description: 'Successful' },
    { key: 400, description: 'Bad request' },
    { key: 500, description: 'Internal Server Error' },
  ];
  maxPages;
  fast_filters = [];
  tab;
  tooltip_content;

  warningMessage = 'There is some issue loading data from this API';
  toastArray = [];

  constructor(private dataManagedService: DataManagedService,private unsubscriber: AutoUnsubscriberService

    ) {}

  ngOnInit(): void {

  }
  ngAfterViewInit(){ 
    this.ready = true; }


  getAPICatalog(){
    this.dataManagedService.getApiCatalog().pipe(this.unsubscriber.takeUntilDestroy)
    .subscribe((data: any) => {
      this.fast_filters=data.filters;
      this.apiCatalog=data.APICatalog;
      this.domains=data.APICatalog.map((item)=> { 
        return {"domain":item.domain}
      });
    });
  }

  getApiList(index,event){
    this.operations= this.apiCatalog[index].operations; 
  }
  getApiDetails(i,j,event){
    this.parameters= this.apiCatalog[i].operations[j].request.parameters;
    this.response=this.apiCatalog[i].operations[j].response.response;  
  }
 
  get_filtered_domains(){}

  filterCatalog(filter){
    this.selectedFilter=filter;
  }

  trackByFn(index, item) {
    if(!item) return null;
    return index;
  }
 
}
