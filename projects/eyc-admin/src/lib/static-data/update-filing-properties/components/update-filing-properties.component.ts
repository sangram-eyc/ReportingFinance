import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { UpdateFilingService } from '../services/update-filing.service';
import { MotifTableCellRendererComponent } from '@ey-xd/ng-motif';
import { customComparator, TableHeaderRendererComponent } from 'eyc-ui-shared-component';
import { ModalComponent, PermissionService } from 'eyc-ui-shared-component';
import { MatDialog } from '@angular/material/dialog';
import { SettingService } from '../../../services/setting.service';
import * as commonConstants from '../../../shared/common-contstants'
import { CellRendererTemplateComponent } from 'eyc-ui-shared-component';

@Component({
  selector: 'lib-update-filing-properties',
  templateUrl: './update-filing-properties.component.html',
  styleUrls: ['./update-filing-properties.component.scss']
})
export class UpdateFilingPropertiesComponent implements OnInit {

  enableEditor = false;
  showToaster = false;
  toasterMessage;
  disableAddMemberButton = false;
  editForm: FormGroup;
  filingInfo;
  is_editable = true;
  filingStagesList = [];
  scopingStagesList = [];
  entityStagesList = [];
  tabIn = 1;
  columnDefs;
  columnDefsAgGrid;
  MotifTableHeaderRendererComponent = TableHeaderRendererComponent;
  MotifTableCellRendererComponent = MotifTableCellRendererComponent;
  PBIMappingData = []
  storePBIMappingData = [];
  @ViewChild('actionSection')
  actionSection: TemplateRef<any>;
  @ViewChild('reportIDSection')
  reportIDSection: TemplateRef<any>;
  @ViewChild('dataSetIdsSection')
  dataSetIdsSection: TemplateRef<any>;
  @ViewChild('questionSection')
  questionSection: TemplateRef<any>;
  displayCheckBox = true;
  showAddPBIReportModal = false;
  addPBIReportForm: FormGroup;
  questionsList = [];
  filingStages = [];
  scopingStages = [];
  entityStages = [];
  enableEditReportID = false;
  questionSwitch = false;
  filingData;
  backendFilingInfo;
  invalidEditReportIDs = [];
  invalidEditDatasetIDs = [];
  showToastAfterDeleteTeams = false;
  fundFrequency = [];
  fundFrequencyList =[];
  exportName: string;
  constructor(
    private location: Location,
    private formBuilder: FormBuilder,
    private service: UpdateFilingService,
    public permissions: PermissionService,
    private dialog: MatDialog,
    private apiHelpers: SettingService
  ) {
    this.editForm = this._updateForm();
  }

  ngOnInit(): void {
    console.log(this.service.getData);
    
    if (this.service.getData) {
      this.filingData = this.service.getData;

      this.service.getFilingDetails(this.filingData.formId).subscribe(res => {
        this.backendFilingInfo = res['data'];
        this.updateDataToDisplayandForm(this.backendFilingInfo);
      });
    

    this.getData();
    this.getPBIMappingDetailsData();
    this.getQuestionList();
    this.addPBIReportForm = this._createPBIReport();
  } else {
    this.location.back();
    sessionStorage.setItem('adminTab', '5');
  }
  }

  getData(){
    this.getFilingStages();
    this.getScopingStages();
    this.getEntityStages();
    this.getFundFrequency();
  }

  getFilingStages() {
    this.service.getStages("Filing").subscribe(resp => {
      this.filingStagesList = resp['data'];
    });
  }
  getScopingStages() {
    this.service.getStages("Fund Scoping").subscribe(resp => {
      this.scopingStagesList = resp['data'];
    });
  }
  getEntityStages() {
    this.service.getStages("Filing Entity").subscribe(resp => {
      this.entityStagesList = resp['data'];
    });
  }
  getFundFrequency() {
    this.service.getFrequency().subscribe(resp => {
      this.fundFrequencyList = resp['data'][0]?.split(',');
    });
  }

  enableEditForm() {
    this.enableEditor = true;
    console.log(this.editForm.value);
    this.disableAddMemberButton = !this.disableAddMemberButton;
  }

  cancelForm() {
    this.showToaster = false;
    this.editForm.patchValue({
      filerType: this.backendFilingInfo.filerTypes.join(','),
      filingStage: this.mapStageData(this.backendFilingInfo.stagesByType, 'Filing', 'stageCode'),
      scopingStages: this.mapStageData(this.backendFilingInfo.stagesByType, 'Fund Scoping', 'stageCode'),
      entityStages: this.mapStageData(this.backendFilingInfo.stagesByType, 'Filing Entity', 'stageCode'),
      fundFrequency: this.backendFilingInfo.frequency,
      regulationForm:this.backendFilingInfo.regulationFormApplicable,
    });
    this.filingStages = this.mapStageData(this.backendFilingInfo.stagesByType, 'Filing', 'stageCode');
    this.scopingStages = this.mapStageData(this.backendFilingInfo.stagesByType, 'Fund Scoping', 'stageCode');
    this.entityStages = this.mapStageData(this.backendFilingInfo.stagesByType, 'Filing Entity', 'stageCode');
    this.fundFrequency = this.backendFilingInfo.frequency;
    this.enableEditor = !this.enableEditor;
    this.disableAddMemberButton = !this.disableAddMemberButton;
  }

  updateDataToDisplayandForm(backendFilingInfo) {
    this.filingInfo = {
      "filingName": this.filingData.filingName,
      "filerType": backendFilingInfo.filerTypes,
      "filingStage": this.mapStageData(backendFilingInfo.stagesByType, 'Filing', 'stageName'),
      "scopingStages": this.mapStageData(backendFilingInfo.stagesByType, 'Fund Scoping', 'stageName'),
      "entityStages": this.mapStageData(backendFilingInfo.stagesByType, 'Filing Entity', 'stageName'),
      "fundFrequency": backendFilingInfo.frequency,
      "regulationForm" : backendFilingInfo.regulationFormApplicable,
    }

    this.editForm.patchValue({
      filerType: this.backendFilingInfo.filerTypes.join(','),
      filingStage: this.mapStageData(backendFilingInfo.stagesByType, 'Filing', 'stageCode'),
      scopingStages: this.mapStageData(backendFilingInfo.stagesByType, 'Fund Scoping', 'stageCode'),
      entityStages: this.mapStageData(backendFilingInfo.stagesByType, 'Filing Entity', 'stageCode'),
      fundFrequency: backendFilingInfo.frequency,
      regulationForm: backendFilingInfo.regulationFormApplicable,
    });
    this.filingStages = this.mapStageData(backendFilingInfo.stagesByType, 'Filing', 'stageCode');
    this.scopingStages = this.mapStageData(backendFilingInfo.stagesByType, 'Fund Scoping', 'stageCode');
    this.entityStages = this.mapStageData(backendFilingInfo.stagesByType, 'Filing Entity', 'stageCode');
    this.fundFrequency = backendFilingInfo.frequency;
  }

  mapStageData(stagesByType, type, mappingkey) {
    if (stagesByType.hasOwnProperty(type)) {
      return stagesByType[type].map(item => item[mappingkey]);
    } else {
      return [];
    }
  }

  getFilerTypes(filerTypes) {
    let types = filerTypes.split(',');
    let splittedFilerTypes = types.map(el => el.trim());
    return splittedFilerTypes;
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

  onSubmitEditForm() {
    const obj = this.editForm.getRawValue();
    let SELECTED_FILING_STAGES = this.getSelectedStages(obj.filingStage, this.filingStagesList, "Filing");
    let SELECTED_SCOPING_STAGES = this.getSelectedStages(obj.scopingStages, this.scopingStagesList, "Fund Scoping");
    let SELECTED_ENTITY_STAGES = this.getSelectedStages(obj.entityStages, this.entityStagesList, "Filing Entity");
    let SELECTED_FUND_FREQUENCY = obj.fundFrequency;
    const staticData = {
      "filingDisplayName": this.filingData.filingName,
      "filerTypes": this.getFilerTypes(obj.filerType),
      "stagesList": [...SELECTED_FILING_STAGES, ...SELECTED_SCOPING_STAGES, ...SELECTED_ENTITY_STAGES],
      "regulationFormApplicable":obj.regulationForm,
      "frequency":[...SELECTED_FUND_FREQUENCY]
    }
    this.enableEditor = !this.enableEditor;
    this.disableAddMemberButton = !this.disableAddMemberButton;
    this.service.updateStaticData(staticData).subscribe(res => {
      this.backendFilingInfo.filerTypes = staticData.filerTypes;
      this.backendFilingInfo.stagesByType['Filing'] = SELECTED_FILING_STAGES;
      this.backendFilingInfo.stagesByType['Fund Scoping'] = SELECTED_SCOPING_STAGES;
      this.backendFilingInfo.stagesByType['Filing Entity'] = SELECTED_ENTITY_STAGES;
      this.backendFilingInfo.frequency = SELECTED_FUND_FREQUENCY;
      this.backendFilingInfo.regulationFormApplicable = staticData.regulationFormApplicable;
      this.updateDataToDisplayandForm(this.backendFilingInfo);

      this.toasterMessage = "Filing has been updated successfully!";
      this.showToaster = true;
      setTimeout(() => {
        this.showToaster = false;
      }, 5000);
    }, error => {
      this.updateDataToDisplayandForm(this.backendFilingInfo);
    });
  }

  backtoLandingPage() {
    sessionStorage.setItem('adminTab', '5');
    this.location.back();
  }

  private _updateForm() {
    return this.formBuilder.group({
      filerType: ['', [Validators.maxLength(500), Validators.pattern(commonConstants['ADD_STATIC_DATA_REGEX_PATTERN'].FILER_TYPE),this.checkDuplicate.bind(this)]],
      filingStage: ['', [Validators.required]],
      scopingStages: ['', Validators.required],
      entityStages: ['', [Validators.required]],
      fundFrequency: ['', [Validators.required]],
      regulationForm:['', [Validators.required,Validators.maxLength(50), Validators.pattern(commonConstants['ADD_STATIC_DATA_REGEX_PATTERN'].REGULATION_FORM)]],
    });
  }

  public noWhitespaceValidator(control: FormControl) {
    if (control.value.length === 0) {
      return false;
    } else {
      const isWhitespace = (control.value || '').trim().length === 0;
      const isValid = !isWhitespace;
      return isValid ? null : { whitespace: true };
    }
  }

  adminTabChange(selectedTab) {
    this.tabIn = selectedTab;
  }


  getPBIMappingDetailsData() {
    this.service.getPBIMappingDetails(this.filingData.formId).subscribe(resp => {
      this.PBIMappingData = resp['data']['questionPbiMap'];
      this.storePBIMappingData = JSON.parse(JSON.stringify(this.PBIMappingData));
      this.createTeamsRowData();
      this.exportName = resp['data']?.['formName']+"_PBI mapping_"
    });
  }

  getQuestionList() {
    this.service.getPBIQuestionList().subscribe(res => {
      this.questionsList = res['data'];
    });
  }

  editAct($event) {
    return {
      ngTemplate: this.actionSection,
    };
  }

  editReportID($event) {
    return {
      ngTemplate: this.reportIDSection,
    };
  }

  editDatasetID($event) {
    return {
      ngTemplate: this.dataSetIdsSection,
    };
  }

  // editQuestion($event) {
  //   return {
  //     ngTemplate: this.questionSection,
  //   };
  // }

  createTeamsRowData(): void {
    this.columnDefsAgGrid =[
      {
        valueGetter: "node.rowIndex + 1",
        maxWidth: 75,
        sortable: false,
        menuTabs: ['generalMenuTab','columnsMenuTab'],
        pinned: 'left'
        },
        {
          headerName: 'Question',
          field: 'name',
          filter: 'agSetColumnFilter',
          filterParams: {
            buttons: ['reset']
          },
          sortable: true,
          sort: 'asc',
          tooltipField: 'name',
          menuTabs: ['filterMenuTab', 'generalMenuTab'],
          minWidth: 250,
          // cellStyle : { 'text-overflow':'ellipsis','white-space': 'nowrap', 'overflow': 'hidden', 'line-height': '22px'}       
         },
        {
          cellRendererFramework: CellRendererTemplateComponent,
          cellRendererParams: this.editReportID.bind(this),
          headerName: 'Report ID',
          field: 'pbiReportId',
          minWidth: 250,
          filter: 'agSetColumnFilter',
          filterParams: {
            buttons: ['reset']
          },
          sortable: true,
          tooltipField: 'pbiReportId',
          menuTabs: ['filterMenuTab', 'generalMenuTab'],
        },
        {
          cellRendererFramework: CellRendererTemplateComponent,
          cellRendererParams: this.editDatasetID.bind(this),
          headerName: 'Dataset ID(s)',
          field: 'dataSetIds',
          tooltipField: 'dataSetIds',
          minWidth: 500,
          filter: 'agSetColumnFilter',
          filterParams: {
            buttons: ['reset']
          },
          sortable: true,
          menuTabs: ['filterMenuTab', 'generalMenuTab'],
        },
        {
          cellRendererFramework: CellRendererTemplateComponent,
          cellRendererParams: this.editAct.bind(this),
          headerName: 'Actions',
          field: 'Actions',
          minWidth: 150,
          sortable: false,
          menuTabs: ['filterMenuTab', 'generalMenuTab'],
        }
    ]
    // this.columnDefs = [
    //   {
    //     headerComponentFramework: TableHeaderRendererComponent,
    //     // cellRendererFramework: MotifTableCellRendererComponent,
    //     // cellRendererParams: this.editQuestion.bind(this),
    //     headerName: 'Question',
    //     field: 'name',
    //     sortable: true,
    //     filter: true,
    //     wrapText: true,
    //     autoHeight: true,
    //     width: 370,
    //     sort: 'asc',
    //     comparator: customComparator
    //   },
    //   {
    //     headerComponentFramework: TableHeaderRendererComponent,
    //     cellRendererFramework: MotifTableCellRendererComponent,
    //     cellRendererParams: this.editReportID.bind(this),
    //     headerName: 'Report ID',
    //     field: 'pbiReportId',
    //     sortable: true,
    //     filter: true,
    //     wrapText: true,
    //     autoHeight: true,
    //     width: 370,
    //     sort: 'asc',
    //     comparator: customComparator
    //   },
    //   {
    //     headerComponentFramework: TableHeaderRendererComponent,
    //     cellRendererFramework: MotifTableCellRendererComponent,
    //     cellRendererParams: this.editDatasetID.bind(this),
    //     headerName: 'Dataset ID(s)',
    //     field: 'dataSetIds',
    //     sortable: true,
    //     filter: true,
    //     wrapText: true,
    //     autoHeight: true,
    //     width: 500,
    //     sort: 'asc',
    //     comparator: customComparator
    //   },
    //   {
    //     width: 80,
    //     headerComponentFramework: TableHeaderRendererComponent,
    //     cellRendererFramework: MotifTableCellRendererComponent,
    //     cellRendererParams: this.editAct.bind(this),
    //     headerName: 'Actions',
    //     field: 'name',
    //     sortable: false,
    //     filter: false,
    //   }
    // ];

  }


  addPBIReport(event) {
    this.onCancelReportID();
    this.showAddPBIReportModal = true;
  }

  private _createPBIReport() {
    return this.formBuilder.group({
      question: ['', [Validators.required, Validators.maxLength(100)]],
      reportID: ['', [Validators.required, Validators.maxLength(150)]],
      dataSetIds: ['', [Validators.required,Validators.pattern("^[0-9a-zA-Z-]+(,[0-9a-zA-Z-]+)*$"), Validators.maxLength(8000)]],
    });
  }

  checkDataSetIdPatternError(string){
    const regPattern = /^[0-9a-zA-Z-]+(,[0-9a-zA-Z-]+)*$/
    return !regPattern.test(string)
  }
  onSubmitNewQuestion() {
    const obj = this.addPBIReportForm.getRawValue();
    // const mappingData = {
    //   "formId": this.filingData.formId,
    //   "questionPbiMap": {
    //     [obj.question]: obj.reportID,
    //   }
    // }

    const mappingData = {
      "formId": this.filingData.formId,
      "questionPbiMap": {
        [obj.question]: {
          "pbiReportId":obj.reportID ,
          "dataSetIds": obj.dataSetIds
        }
      }
    }

    this.service.addPBIMapping(mappingData).subscribe(resp => {
      let mappingdata = this.PBIMappingData;
      this.PBIMappingData = []
      resp['data']['questionPbiMap'].forEach(element => {
        let isquestion = mappingdata.find(item => item.name == element.name);
        if (isquestion) {
          mappingdata[mappingdata.findIndex(item => item.name === element.name)]['pbiReportId'] = element.pbiReportId;
          mappingdata[mappingdata.findIndex(item => item.name === element.name)]['dataSetIds'] = element.dataSetIds;
        } else {
          mappingdata.push(element);
        }
      });
      mappingdata.forEach(ele => {
        this.PBIMappingData.push(ele);
      })
      this.storePBIMappingData = JSON.parse(JSON.stringify(this.PBIMappingData));
      this.createTeamsRowData();
      this.addPBIReportForm.reset();
      this.showAddPBIReportModal = false

      this.toasterMessage = "PBI Question added successfully!"
      this.showToaster = !this.showToaster;
      setTimeout(() => {
        this.showToaster = !this.showToaster;
      }, 5000);
    })
  }

  closeAddQuestionModal() {
    this.addPBIReportForm = this._createPBIReport();
    this.showAddPBIReportModal = false;

  }

  logEvent(event: any, type: string, model: any) {
    console.log(
      `Select Component Type: ${type}`,
      ' | $event output: ',
      event,
      ' | model value: ',
      model
    );
  }

  onChangeMultiSelect(event, type, inputFormControlName) {
    this.editForm.patchValue({
      [inputFormControlName]: event
    });
  }

  enableEditReportId() {
    this.enableEditReportID = true;
  }

  onSaveReportID() {
    this.enableEditReportID = false;

    let mappingData = {
      "formId": this.filingData.formId,
      "questionPbiMap": {}
    }
    this.PBIMappingData.forEach(ele => {
      mappingData.questionPbiMap[ele.name] = { "pbiReportId":ele.pbiReportId , "dataSetIds": ele.dataSetIds }
    });
    
    this.service.addPBIMapping(mappingData).subscribe(resp => {
      let mappingdata = this.PBIMappingData;
      this.PBIMappingData = []
      resp['data']['questionPbiMap'].forEach(element => {
        let isquestion = mappingdata.find(item => item.name == element.name);
        if (isquestion) {
          mappingdata[mappingdata.findIndex(item => item.name === element.name)]['pbiReportId'] = element.pbiReportId;
        } else {
          mappingdata.push(element);
        }
      });
      mappingdata.forEach(ele => {
        this.PBIMappingData.push(ele);
      })
      this.storePBIMappingData = JSON.parse(JSON.stringify(this.PBIMappingData));
      this.createTeamsRowData();
      this.addPBIReportForm.reset();
      this.showAddPBIReportModal = false

      this.toasterMessage = "Question and PBI report Id mapping upsert is successfull"
      this.showToaster = !this.showToaster;
      setTimeout(() => {
        this.showToaster = !this.showToaster;
      }, 5000);
    })
  }

  onCancelReportID() {
    this.enableEditReportID = false;
    let mapping = this.storePBIMappingData;
      this.PBIMappingData = [];
      mapping.forEach(ele => {
        this.PBIMappingData.push(ele);
      });
  }

  onChangeQuestionSwitch(event) {
    this.addPBIReportForm.reset();
  }

  deletePBIMapping(row){

    const dialogRef = this.dialog.open(ModalComponent, {
      width: '500px',
      data: {
        type: "Confirmation",
        header: "Delete PBI mapping",
        description: "Are you sure you want to remove PBI mapping?",
        footer: {
          style: "start",
          YesButton: "Yes",
          NoButton: "No"
        }
      }
    });
    let mappingData = {
      "formId": this.filingData.formId,
      "questionNames": [row.name]
    }
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      if(result.button == 'Yes') {
      this.service.deleteTeamMember(mappingData).subscribe(resp => {
        const pbimappingList = this.PBIMappingData;
        this.PBIMappingData = [];
        pbimappingList.splice(pbimappingList.findIndex(item => item.name === row.name),1);
        pbimappingList.forEach(ele => {
          this.PBIMappingData.push(ele);
        });
        this.showToastAfterDeleteTeams = !this.showToastAfterDeleteTeams;
        setTimeout(() => {
          this.showToastAfterDeleteTeams = !this.showToastAfterDeleteTeams;
        }, 5000);  });
      }
    });
  
    
  }

  onChangeEditReportID(question, isValid) {
    if (isValid) {
      if (!this.invalidEditReportIDs.includes(question)) this.invalidEditReportIDs.push(question);
    } else {
      const index = this.invalidEditReportIDs.indexOf(question);
      if (index > -1) {
        this.invalidEditReportIDs.splice(index, 1);
      }
    }
  }

  onChangeEditDatastID(question, isValid) {
    if (isValid) {
      if (!this.invalidEditDatasetIDs.includes(question)) this.invalidEditDatasetIDs.push(question);
    } else {
      const index = this.invalidEditDatasetIDs.indexOf(question);
      if (index > -1) {
        this.invalidEditDatasetIDs.splice(index, 1);
      }
    }
  }

  exportData() {
    let exportHeaders = 'name:Question,pbiReportId:Report ID,dataSetIds:Dataset ID(s)';
    let exportURL =  this.apiHelpers.static_data.pbi_mapping +this.filingData.formId +'/pbi-mapping' + "?export=" + true +"&headers=" + exportHeaders + "&reportType=csv";
  
    this.service.exportPBIMappingData(exportURL).subscribe(resp => {
      console.log(resp);
    })
  }

  checkDuplicate(control: FormControl){
    let value = (control.value).toUpperCase().split(',');
    if(value && new Set(value).size !== value.length){
      return {
        duplicateName: {
          filerType: value[0]
        }
    }
  }
}
  
}
