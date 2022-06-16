import { Component, OnInit } from '@angular/core';
import { DataManagedService } from '../../services/data-managed.service';
import { AutoUnsubscriberService } from 'eyc-ui-shared-component';
import { debug } from 'console';

@Component({
  selector: 'lib-api-catalog',
  templateUrl: './api-catalog.component.html',
  styleUrls: ['./api-catalog.component.scss']
})
export class ApiCatalogComponent implements OnInit {

  domains;
  show2:boolean=false;
  modeselect;
  columnDefs: string[] = [
    'name',
    'nullable',
    'description',
    'parameterType',
    'dataType',
  ];
  columnDefs1: string[] = ['key', 'description'];
  searchKey: string = '';
  currentPage = 1;
  dataset = [
    { disable: false, value: 5, name: '5', id: 0 },
    { disable: false, value: 10, name: '10', id: 1 },
    { disable: false, value: 20, name: '20', id: 2 },
    { disable: false, value: 50, name: '50', id: 3 },
    { disable: false, value: 100, name: '100', id: 4 },
  ];

  responsesTyps = [
    { key: 200, description: 'Successful' },
    { key: 400, description: 'Bad request' },
    { key: 500, description: 'Internal Server Error' },
  ];
  idefaultPagination = 5;
  showRules: number = 5;
  startFrom: number = 0;
  maxPages;
  fast_filters = [];
  response = 'abc';
  fetch_query_parameters_list: any = [];
  example_values = {};
  tab;
  gridApi;
  x;
  y;
  tooltip_content;

  warningMessage = 'There is some issue loading data from this API';
  toastArray = [];

  constructor(private dataManagedService: DataManagedService,private unsubscriber: AutoUnsubscriberService,
    // private postDataService: PostDataService, private toasterService: ToasterService
    ) {}

  ngOnInit(): void {

    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    let filter;
    this.getAPICatalog();
    // this.postDataService.getDomainURL().subscribe(
    //   (data) => {
    //     this.domains = data[0].apicatalog;
    //     this.temp_domains = this.domains;
    //     this.domains.forEach((domain) => {
    //       domain.loading = false;
    //       this.motifTypeahead = [...this.motifTypeahead, domain.DOMAIN_NAME]
    //       filter = { name: '', present: true };
    //       if (
    //         !this.fast_filters.some(
    //           (filter) => filter.name === domain.APIs[0].FAST_FILTERS
    //         )
    //       ) {
    //         filter.name = domain.APIs[0].FAST_FILTERS;
    //         this.fast_filters.push(filter);
    //       }
    //     });
    //     this.maxPages = Math.ceil(this.domains.length / this.showRules);
    //   },
    //   (err) => {
    //     this.toastArray.push(this.toasterService.showWarning(this.warningMessage));
    //   }
    // );
  }

  getAPICatalog(){
    this.dataManagedService.getApiCatalog().pipe(this.unsubscriber.takeUntilDestroy)
    .subscribe((data: any) => {
      this.domains=data.data;
    });
  }
  handlePageChange(val: number): void {
    this.currentPage = val;
    if (val === 1) {
      this.startFrom = 0;
    } else if (val > 1) {
      this.startFrom = this.showRules * (val - 1);
    }
  }

  get_filtered_domains(){}
  // get_filtered_domains = () => this.temp_domains = this.searchKey === '' || this.searchKey === null ? this.domains : this.domains.filter(item => item.DOMAIN_NAME.toString().toLowerCase().includes(this.searchKey.toLowerCase()))

  onPageChangeByUserInput(event: any) {
    this.currentPage = event.newCurrentPage;
    if (this.currentPage === 1) {
      this.startFrom = 0;
    } else if (this.currentPage > 1) {
      this.startFrom = this.showRules * (this.currentPage - 1);
    }
  }

  paginationChangeFunc(idefaultPagination) {
    // e.preventDefault();
    this.showRules = parseInt(idefaultPagination);

    // if (parseInt(`${this.domains.length % this.showRules}`) === 0) {
    //   this.maxPages = parseInt(`${this.temp_domains.length / this.showRules}`);
    // } else {
    //   this.maxPages = parseInt(`${this.temp_domains.length / this.showRules}`) + 1;
    // }

    // this.getMaxPages(this.domains);
    this.onPageChangeByUserInput({ newCurrentPage: 1 });
  }

  // getMaxPages(data) {
  //   if (parseInt(`${data.length % this.showRules}`) === 0) {
  //     this.maxPages = parseInt(`${data.length / this.showRules}`);
  //   } else {
  //     this.maxPages = parseInt(`${data.length / this.showRules}`) + 1;
  //   }
  // }

  // fetch_api_content(data) {
  //   let api;
  //   let parameter;
  //   let obj;

  //   Object.keys(this.jsn.paths).forEach((e) => {
  //     api = {
  //       path: null,
  //       summary: '',
  //       parameters: [],
  //       type: '',
  //       responses: [],
  //     };

  //     api.path = e;
  //     api.type = Object.keys(Object.values(this.jsn.paths)[Object.keys(this.jsn.paths).indexOf(e)])[0];
  //     let object = Object.values(Object.values(this.jsn.paths)[Object.keys(this.jsn.paths).indexOf(e)])[0];
  //     api.summary = object.summary;

  //     object.parameters.forEach((param) => {
  //       parameter = {
  //         field_name: null,
  //         required: null,
  //         description: null,
  //         parameter_type: null,
  //         data_type: null,
  //       };

  //       parameter.field_name = param.name;
  //       parameter.required = param.name ? 'Yes' : 'No';
  //       if (!param.description.startsWith('(required)'))
  //         parameter.description = param.description;
  //       parameter.parameter_type = param.in;
  //       parameter.data_type = param.type === undefined ? param.schema.type : param.type;
  //       api.parameters.push(parameter);
  //     });
  //     for (var key in object.responses) {
  //       obj = {
  //         key: null,
  //         value: null,
  //         description: null,
  //         content: null,
  //         response_dto: null,
  //       };
  //       obj.key = key;
  //       obj.value = object.responses[key];
  //       obj.description = object.responses[key].description;
  //       obj.response_dto = key.toString() === '200' ?
  //         (object.responses[key].content !== undefined ?
  //           Object.values(Object.values(Object.values(object.responses[key].content)[0]))[0].properties :
  //           (Object.values(object.responses[key])[1] !== undefined ? Object.values(Object.values(object.responses[key])[1])[1] :
  //             null)) :
  //         null;
  //       api.responses.push(obj);
  //     }
  //     data.api.push(api);
  //   });
  // }

  get_intro_params(url, api) {
    let parameter;

    return new Promise((resolve, reject) => {
      // this.postDataService.getIntrospectionOperation(url).subscribe(
      //   (data1) => {
      //     api.responses.url = data1.data.response.response;
      //     this.postDataService
      //       .getIntrospectionOperation(data1.data.request.parameters)
      //       .subscribe(
      //         (data2) => {
      //           data2.data.parameters.forEach((param) => {
      //             parameter = {
      //               field_name: null,
      //               required: null,
      //               description: null,
      //               parameter_type: null,
      //               data_type: null,
      //             };
      //             parameter.field_name = param.name;
      //             parameter.required = !param.nullable;
      //             parameter.description = param.description;
      //             parameter.parameter_type = param.parameterType;
      //             parameter.data_type = param.dataType;
      //             api.parameters.push(parameter);
      //           });
      //           resolve(api);
      //         },
      //         (err) => {
      //           this.toastArray.push(this.toasterService.showWarning(this.warningMessage));
      //         }
      //       );
      //   },
      //   (err) => {
      //     this.toastArray.push(this.toasterService.showWarning(this.warningMessage));
      //   }
      // );
    });
  }

  fetch_intro_content(data, content) {
    let api;
    let obj;

    obj = {
      key: null,
      value: null,
      description: null,
      content: null,
      response_dto: null,
    };

    return new Promise((resolve, reject) => {
      content.data.operations.forEach((e) => {
        api = {
          path: null,
          summary: '',
          parameters: [],
          type: '',
          responses: [],
        };
        api.path = e.operationDetails;
        api.type = e.methodType;
        api.summary = e.description;
        api.responses = [
          { key: 200, description: 'Successful' },
          { key: 400, description: 'Bad request' },
          { key: 500, description: 'Internal Server Error' },
        ];
        this.get_intro_params(e.operationDetails, api).then((api) => {
          data.api.push(api);
          resolve(data);
        });
      });
    });
  }

  getBaseUrl(host, basepath) {
    host = host.includes("http") ? host : "https://" + host;
    let url = basepath.split('/')[1] !== '' ? host + basepath : host;
    return url;
  }

  fetch_api(domain, type) {
    return new Promise((resolve, reject) => {
      let api_list = this.domains?.find((api) => api.DOMAIN_NAME === domain && api.API_TYP === type)?.APIs;

      api_list?.forEach((url, index) => {
        if (url.API_TYP === 'Swagger') {
          // this.postDataService.getSwagger(url.DOMAIN_URL).subscribe(
          //   (data) => {
          //     this.validate_swagger(data).then((d) => {
          //       this.jsn = d;
          //       if (this.api_data.some((api) => api.domain === domain && api.type === type))
          //         this.fetch_api_content(this.api_data.find((api) => api.domain === domain));
          //       else {
          //         let api_s = {
          //           url: null,
          //           ver: null,
          //           api: [],
          //           domain: domain,
          //           post: false,
          //           get: false,
          //           put: false,
          //           delete: false,
          //           type: type,
          //         };

          //         api_s.ver = this.jsn.swagger !== undefined && this.jsn.swagger.includes('2') ? 2 :
          //                     this.jsn.openapi !== undefined && this.jsn.openapi.includes('3') ? 3 : null;

          //         api_s.url = api_s.ver === 2 ? 
          //           this.getBaseUrl(Object.values(this.jsn.host)[0], Object.values(this.jsn.basePath)[0]) : 
          //           Object.values(this.jsn.servers[0])[Object.keys(this.jsn.servers[0]).indexOf('url')];

          //         this.fetch_api_content(api_s);

          //         this.api_data.push(api_s);
          //       }

          //       if (api_list.length === index + 1) resolve(this.api_data);

          //     });
          //   },
          //   (err) => {
          //     this.toastArray.push(this.toasterService.showWarning(this.warningMessage));
          //   }
          // );
        } else {
          //   this.postDataService
          //     .getIntrospectionOperation(url.DOMAIN_URL)
          //     .subscribe(
          //       (data) => {
          //         if (
          //           !this.api_data.some(
          //             (api) =>
          //               api.domain.replace('_', ' ').toLowerCase() ===
          //                 domain.toLowerCase() && api.API_TYP === 'graphQL'
          //           )
          //         ) {
          //           let api_s = {
          //             url: 'https://fdfd.api.ey.com',
          //             api: [],
          //             domain: data.data.domain,
          //             post: false,
          //             get: false,
          //             put: false,
          //             delete: false,
          //             type: type,
          //           };
          //           this.fetch_intro_content(api_s, data).then((data) =>
          //             this.api_data.push(api_s)
          //           );
          //         } else
          //           this.fetch_intro_content(
          //             this.api_data.find(
          //               (api) =>
          //                 api.domain.replace('_', ' ').toLowerCase() ===
          //                 domain.toLowerCase()
          //             ),
          //             data
          //           );
          //       },
          //       (err) => {
          //         this.toastArray.push(this.toasterService.showWarning(this.warningMessage));
          //       }
          //     );
        }
      });
      if (!api_list.length) resolve([]);
    });
  }

  // get_specific = (domain) => this.api_data.find((api) => api.domain.replace('_', ' ').toLowerCase() === domain.toLowerCase());

  get_specific_domain = (domain) => this.domains.find((api) => api.DOMAIN_NAME.replace('_', ' ').toLowerCase() === domain.toLowerCase());

  find_present = (domain_filter) => this.fast_filters.find((filter) => filter.name === domain_filter).present;

  is_available = (api, type) => api?.some((e) => e.type.toLowerCase() === type);

  // get_filter_maxpages = () => Math.ceil(this.get_filter(this.searchKey) / this.showRules)

  // get_filter = (event): number => event === '' ? 0 : this.temp_domains.length

  get_current_page() {
    this.currentPage = 1;
    return 1
  }

  // expand_all(data) {
  //   this.expand_api = !this.expand_api;
  //   // console.log('Expand all APIs', this.expand_api,data.path[5].childNodes[1].childNodes[0].childNodes[0].children[1].children[1]);
  //   console.log('Expand all APIs', this.expand_api, data.path[5].childNodes[1].childNodes[0].childNodes[0].children[1].children[1]);
  // }

  // fetch_domain_details(domain, type, data) {
  //   if (data == null || data.target.offsetParent.classList.contains('motif-expanded') == false) {
  //     this.get_specific_domain(domain).loading = true;

  //     if (!this.api_data.some((api) => api.domain.replace('_', ' ').toLowerCase() === domain.toLowerCase() && api.type === type)) {
  //       this.fetch_api(domain, type).then((data) => {
  //         this.get_specific(domain);
  //       }).catch(e => {
  //         console.log("Error ========>", e);
  //       });
  //     }

  //     setTimeout(() => {
  //       this.get_specific_domain(domain).loading = false;
  //     }, 500);
  //   }
  // }

  fetch_model(api, domain) {
    this.tab++;
    // this.fetch_schema(api, domain);
  }

  // fetch_schema(api, domain) {
  //   if (this.tab === 0)
  //     return
  //   if (api.responses.url) {
  //     // this.postDataService.getIntrospectionOperation(api.responses.url).subscribe((data) => {
  //     //       this.modal_content[domain.DOMAIN_NAME] = data.data;
  //     //     },
  //     //     (err) => {
  //     //       this.toastArray.push(this.toasterService.showWarning(this.warningMessage));
  //     //     }
  //     //   );
  //   } else {
  //     let dto_name = api.responses.find((res) => res.key === '200').response_dto;
  //     this.modal_content[domain.DOMAIN_NAME] = dto_name !== undefined ? dto_name : "{}";
  //   }
  // }

  validate_swagger(data) {
    // return new Promise((resolve, reject) => {
    //   data = this.removeEmpty(data);
    //   SwaggerParser.validate(data, (err, valid_data) => {
    //     if (err)
    //       this.toastArray.push(this.toasterService.showWarning(this.warningMessage));
    //     else {
    //       resolve(valid_data)
    //     }
    //   });
    // });
  }

  removeEmpty(obj) {
    Object.keys(obj).forEach((key) => {
      if (obj[key] && typeof obj[key] === 'object') {
        const childObject = this.removeEmpty(obj[key]);
        if (childObject === undefined) {
          delete obj[key];
        }
      } else if (obj[key] === '' || obj[key] === null || obj[key] === undefined) {
        delete obj[key];
      }
    });
    return Object.keys(obj).length > 0 || obj instanceof Array ? obj : undefined;
  };

  // fetch_query_parameters(api, domain) {
  //   this.tab = 0;
  //   api.parameters.forEach((e) => {
  //     let parameters = { name: '', type: '' };
  //     parameters.type = e.parameter_type;
  //     parameters.name = e.field_name;
  //     this.fetch_query_parameters_list.push(parameters);
  //   });
  //   this.modal_content[domain.DOMAIN_NAME] = this.fetch_query_parameters_list;
  // }

}
