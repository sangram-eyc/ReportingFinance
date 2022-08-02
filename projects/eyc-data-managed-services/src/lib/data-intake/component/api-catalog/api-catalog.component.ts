import { Component } from '@angular/core';
import { DataManagedService } from '../../services/data-managed.service';
import { AutoUnsubscriberService } from 'eyc-ui-shared-component';
import { SearchFilterPipe } from '../../../pipes/search-filter.pipe'
@Component({
  selector: 'lib-api-catalog',
  templateUrl: './api-catalog.component.html',
  styleUrls: ['./api-catalog.component.scss']
})
export class ApiCatalogComponent {

  apiCatalog;
  domains;
  operations;
  parameters;
  response;
  popupResponse;
  frequencyFilter;
  panelOpenState = false;

  ready:boolean = false
  show2:boolean=false;
  modeselect="app/json";
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
    ,private searchFilter:SearchFilterPipe) {}

  getAPICatalog(){
    this.dataManagedService.getApiCatalog().pipe(this.unsubscriber.takeUntilDestroy)
    .subscribe((data: any) => {
      this.fast_filters=data.filters;
      this.frequencyFilter=data.APICatalog;
      this.apiCatalog=data.APICatalog;
      this.domains=data.APICatalog.map((item)=> { 
        return {"domain":item.domain}
      });
    });
  }

  getApiList(index, event) {
    this.operations= this.apiCatalog[index].operations; 
  }
  getApiDetails(i,j,event){
    this.parameters= this.apiCatalog[i].operations[j].request.parameters;
    this.response=JSON.stringify(this.apiCatalog[i].operations[j].response.response,null,2)
    .replace(/ /g, '&nbsp;') // note the usage of `/ /g` instead of `' '` in order to replace all occurences
    .replace(/\n/g, '<br/>'); // same here;  
    
  }

  filterCatalog(filter){
    this.selectedFilter=filter;
    // this.apiCatalog=this.searchFilter.transform(this.frequencyFilter,this.selectedFilter,'');
    // console.log(filter);
    // console.log(this.apiCatalog);
  }

  showRightPopUp(data){
    this.show2 = true;
    this.popupResponse=data;
  }
  trackByFn(index, item) {
    if(!item) return null;
    return index;
  }
 
}
