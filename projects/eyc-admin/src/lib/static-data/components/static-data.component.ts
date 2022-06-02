import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { StaticDataService } from './../services/static-data.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomGlobalService } from 'eyc-ui-shared-component';
import { Router } from '@angular/router';
import { UpdateFilingService } from '../update-filing-properties/services/update-filing.service';
import { PermissionService } from 'eyc-ui-shared-component';
import * as commonConstants from '../../shared/common-contstants'

@Component({
  selector: 'lib-static-data',
  templateUrl: './static-data.component.html',
  styleUrls: ['./static-data.component.scss']
})
export class StaticDataComponent implements OnInit, OnChanges {

  activeFilings = [];
  @Input() tabHighlighted;
  addFilingForm: FormGroup;
  showAddFilingForm = false;
  activeReportsSearchNoDataAvilable = false;
  filingStages = [];
  scopeStages = [];
  filingEntitiyStages = [];
  showToastAfterFilingAdded = false;
  activeStaticData: any[] = []
  filterName: string;
  fundFrequency;
  selectList= [{
    "field": "filingStages",
    "value": false,
  },
  {
    "field": "scopeStages",
    "value": false,
  },
  {
    "field": "filingEntitiyStages",
    "value": false,
  }, 
  {
    "field": "fundFrequency",
    "value": false,
  }]


  constructor(
    private service: StaticDataService,
    private customglobalService: CustomGlobalService,
    private formBuilder: FormBuilder,
    private router: Router,
    private updateFilingService: UpdateFilingService,
    public permissions: PermissionService
  ) { }

  ngOnInit(): void {
    this.addFilingForm = this._createAddFiling()
  }

  ngOnChanges() {
    if (this.tabHighlighted == 5) {
      this.activeFilings = [];
      this.getData();
      this.filterName='';
      this.selectList.forEach((item) => {
        this.addFilingForm.get(item.field).valueChanges.subscribe(res => {
          if(res.length) {
             if(this.selectList?.includes(item)){
              item.value = false
            }
          }
           else if(this.selectList?.includes(item)){
            item.value = true
          }
          })
      })
    }
  }

  getData(){
    this.getStaticData();
    this.getFilingStages();
    this.getScopingStages();
    this.getEntityStages();
    this.getFundFrequency();
  }

  getFilingStages() {
    this.service.getStages("Filing").subscribe(resp => {
      this.filingStages = resp['data'];
    });
  }
  getScopingStages() {
    this.service.getStages("Fund Scoping").subscribe(resp => {
      this.scopeStages = resp['data'];
    });
  }
  getEntityStages() {
    this.service.getStages("Filing Entity").subscribe(resp => {
      this.filingEntitiyStages = resp['data'];
    });
  }
  getFundFrequency(){
    this.service.getFrequency().subscribe(resp => {
      this.fundFrequency = resp['data'][0]?.split(',');
    });
  }

  getStaticData() {
    this.service.getStaticData().subscribe(resp => {
      resp['data'].forEach((item) => {
        const eachitem: any = {
          filingName: item.filingName,
          formId: item.formId,
          approved: false
        };
        this.activeFilings.push(eachitem);
      });
      this.activeFilings = this.customglobalService.sortFilings(this.activeFilings);
      this.activeStaticData = this.activeFilings;
    });
  }

  addnewFiling() {
    this.selectList?.forEach((item) => {
    item.value=false;
    });
    console.log("addnewFiling",this.selectList)
    this.showAddFilingForm = true;
  }

  closeAddFilingModal() {
    this.showAddFilingForm = false;
    this.addFilingForm.reset();
  }

  private _createAddFiling() {
    return this.formBuilder.group({
      displayName: ['', [Validators.required, Validators.pattern(commonConstants['ADD_STATIC_DATA_REGEX_PATTERN'].DISPLAY_NAME), Validators.maxLength(150), this.noWhitespaceValidator]],
      scopeStages: ['', [Validators.required]],
      filingEntitiyStages: ['', [Validators.required]],
      filingStages: ['', [Validators.required]],
      filerType: ['', [Validators.maxLength(500), Validators.pattern(commonConstants['ADD_STATIC_DATA_REGEX_PATTERN'].FILER_TYPE),this.checkDuplicate.bind(this)]],
      regulationForm: ['', [Validators.required, Validators.pattern(commonConstants['ADD_STATIC_DATA_REGEX_PATTERN'].REGULATION_FORM), Validators.maxLength(50), this.noWhitespaceValidator]],
      fundFrequency:['', [Validators.required]]
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    if (control.value && control.value.length === 0) {
      return false;
    } else {
      const isWhitespace = (control.value || '').trim().length === 0;
      const isValid = !isWhitespace;
      return isValid ? null : { whitespace: true };
    }
  }

  getFilerTypes(filerTypes) {
    if (filerTypes.length && filerTypes) {
      let types = filerTypes.split(',');
      let splittedFilerTypes = types.map(el => el.trim());
      return splittedFilerTypes;
    } else {
      return [''];
    }
  }

  getSelectedStages(selectedStageCodes, allStages, stageType) {
    let selectedStages = [];
    let stagesArr = []
    selectedStageCodes.forEach((code) => {
      allStages.forEach((el) => {
        return el.stageCode === code ? stagesArr.push(el) : ''
      })
    });

    stagesArr.forEach((el) => {
      let stage = {
        "displayOrder": el.displayOrder,
        "stageCode": el.stageCode,
        "stageName": el.stageName,
        "stageType": stageType
      }
      selectedStages.push(stage);
    })
    return selectedStages;
  }

  onSubmitAddFiling(form: FormGroup) {
    const obj = this.addFilingForm.getRawValue();
    let SELECTED_FILING_STAGES = this.getSelectedStages(obj.filingStages, this.filingStages, "Filing");
    let SELECTED_SCOPING_STAGES = this.getSelectedStages(obj.scopeStages, this.scopeStages, "Fund Scoping");
    let SELECTED_ENTITY_STAGES = this.getSelectedStages(obj.filingEntitiyStages, this.filingEntitiyStages, "Filing Entity");
    let SELECTED_FUND_FREQUENCY = obj.fundFrequency;
    this.showAddFilingForm = false;
    const staticData = {
      "filingDisplayName": obj.displayName,
      "filerTypes": this.getFilerTypes(obj.filerType),
      "stagesList": [...SELECTED_FILING_STAGES, ...SELECTED_SCOPING_STAGES, ...SELECTED_ENTITY_STAGES],
      "regulationFormApplicable":obj.regulationForm,
      "frequency":[...SELECTED_FUND_FREQUENCY]
    }
    this.service.addStaticData(staticData).subscribe((res) => {
      let staticDataObj = {
        filingName: res['data'].filingDisplayName,
        formId: res['data'].formId,
        approved: res['data'].approved
      }
      if(!this.activeFilings.some(ele => ele.filingName == staticDataObj.filingName))
          this.activeFilings.push(staticDataObj);
      this.addFilingForm = this._createAddFiling();
      this.showToastAfterFilingAdded = !this.showToastAfterFilingAdded;
      setTimeout(() => {
        this.showToastAfterFilingAdded = !this.showToastAfterFilingAdded;
      }, 5000);
    }, error => {
      console.log("add static data error");
    });
  }

  searchStaticData(input) {
    this.activeFilings = this.activeStaticData.filter(item => item.filingName.toLowerCase().indexOf((input.el.nativeElement.value).toLowerCase()) !== -1)
    this.activeReportsSearchNoDataAvilable = !!(this.activeFilings.length === 0);
  }

  onPasteSearchStaticData(event: ClipboardEvent) {
    let clipboardData = event.clipboardData;
    let pastedText = (clipboardData.getData('text')).split("");
    pastedText.forEach((ele, index) => {
      if (/[A-Za-z0-9\-\_:/ ]+/.test(ele)) {
        if ((pastedText.length - 1) === index) {
          return true;
        }
      } else {
        event.preventDefault();
        return false;
      }
    });
  }



  searchFilingValidation(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/[A-Za-z0-9\-\_:/ ]+/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  onClickView(filing) {
    this.updateFilingService.setData = filing;
    this.router.navigate(['/update-filing']);
  }

  checkDuplicate(control: FormControl){
    let value = (control.value)?.toUpperCase().split(',');
    if(value && new Set(value).size !== value.length){
      return {
        duplicateName: {
          filerType: value[0]
        }
    }
  }
}
}
