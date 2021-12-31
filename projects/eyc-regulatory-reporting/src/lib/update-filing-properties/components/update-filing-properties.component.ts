import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { UpdateFilingService } from '../services/update-filing.service';
import { MotifTableCellRendererComponent } from '@ey-xd/ng-motif';
import { TableHeaderRendererComponent } from 'projects/eyc-regulatory-reporting/src/lib/shared/table-header-renderer/table-header-renderer.component';
import { customComparator } from '../../config/rr-config-helper';
import { ModalComponent, PermissionService } from 'eyc-ui-shared-component';
import { MatDialog } from '@angular/material/dialog';
import { resolvePtr } from 'dns';

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
  MotifTableHeaderRendererComponent = TableHeaderRendererComponent;
  MotifTableCellRendererComponent = MotifTableCellRendererComponent;
  PBIMappingData = []

  @ViewChild('actionSection')
  actionSection: TemplateRef<any>;
  @ViewChild('reportIDSection')
  reportIDSection: TemplateRef<any>;
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
  constructor(
    private location: Location,
    private formBuilder: FormBuilder,
    private service: UpdateFilingService,
    public permissions: PermissionService,
    private dialog: MatDialog
  ) {
    this.editForm = this._updateForm();
  }

  ngOnInit(): void {
    if (this.service.getData) {
      this.filingData = this.service.getData;

      this.service.getFilingDetails(this.filingData.formId).subscribe(res => {
        this.backendFilingInfo = res['data'];
        this.updateDataToDisplayandForm(this.backendFilingInfo);
      });
    } else {
      this.location.back();
      sessionStorage.setItem('regReportingLandingpageTab', '3');
    }

    this.getFilingStages();
    this.getScopingStages();
    this.getEntityStages();
    this.getPBIMappingDetailsData();
    this.getQuestionList();
    this.addPBIReportForm = this._createPBIReport();
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

  enableEditForm() {
    this.enableEditor = true;
    console.log(this.editForm.value);
    this.disableAddMemberButton = !this.disableAddMemberButton;
  }

  cancelForm() {
    this.showToaster = false;
    this.editForm.patchValue({
      filerType: this.backendFilingInfo.filerTypes.join(', '),
      filingStage: this.backendFilingInfo.stagesByType['Filing'].map(item => item.stageCode),
      scopingStages: this.backendFilingInfo.stagesByType['Fund Scoping'].map(item => item.stageCode),
      entityStages: this.backendFilingInfo.stagesByType['Filing Entity'].map(item => item.stageCode)
    });
    this.filingStages = this.backendFilingInfo.stagesByType['Filing'].map(item => item.stageCode);
    this.scopingStages = this.backendFilingInfo.stagesByType['Fund Scoping'].map(item => item.stageCode);
    this.entityStages = this.backendFilingInfo.stagesByType['Filing Entity'].map(item => item.stageCode);
    this.enableEditor = !this.enableEditor;
    this.disableAddMemberButton = !this.disableAddMemberButton;
  }

  updateDataToDisplayandForm(backendFilingInfo) {
    this.filingInfo = {
      "filingName": this.filingData.filingName,
      "filerType": backendFilingInfo.filerTypes,
      "filingStage": this.mapStageData(backendFilingInfo.stagesByType, 'Filing', 'stageName'),
      "scopingStages": this.mapStageData(backendFilingInfo.stagesByType, 'Fund Scoping', 'stageName'),
      "entityStages": this.mapStageData(backendFilingInfo.stagesByType, 'Filing Entity', 'stageName')
    }

    this.editForm.patchValue({
      filerType: this.backendFilingInfo.filerTypes.join(', '),
      filingStage: this.mapStageData(backendFilingInfo.stagesByType, 'Filing', 'stageCode'),
      scopingStages: this.mapStageData(backendFilingInfo.stagesByType, 'Fund Scoping', 'stageCode'),
      entityStages: this.mapStageData(this.backendFilingInfo.stagesByType, 'Filing Entity', 'stageCode')
    });
    this.filingStages = this.mapStageData(backendFilingInfo.stagesByType, 'Filing', 'stageCode');
    this.scopingStages = this.mapStageData(backendFilingInfo.stagesByType, 'Fund Scoping', 'stageCode');
    this.entityStages = this.mapStageData(backendFilingInfo.stagesByType, 'Filing Entity', 'stageCode');
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
    const staticData = {
      "filingDisplayName": this.filingData.filingName,
      "filerTypes": this.getFilerTypes(obj.filerType),
      "stagesList": [...SELECTED_FILING_STAGES, ...SELECTED_SCOPING_STAGES, ...SELECTED_ENTITY_STAGES]
    }
    this.enableEditor = !this.enableEditor;
    this.disableAddMemberButton = !this.disableAddMemberButton;
    this.service.updateStaticData(staticData).subscribe(res => {

      this.backendFilingInfo.filerTypes = staticData.filerTypes;
      this.backendFilingInfo.stagesByType['Filing'] = SELECTED_FILING_STAGES;
      this.backendFilingInfo.stagesByType['Fund Scoping'] = SELECTED_SCOPING_STAGES;
      this.backendFilingInfo.stagesByType['Filing Entity'] = SELECTED_ENTITY_STAGES;
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
    sessionStorage.setItem('regReportingLandingpageTab', '3');
    this.location.back();
  }

  private _updateForm() {
    return this.formBuilder.group({
      filerType: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 \,-\]+$'), Validators.maxLength(50), this.noWhitespaceValidator]],
      filingStage: ['', [Validators.required]],
      scopingStages: ['', Validators.required],
      entityStages: ['', [Validators.required]]
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
      this.createTeamsRowData();
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


  editQuestion($event) {
    return {
      ngTemplate: this.questionSection,
    };
  }

  createTeamsRowData(): void {
    this.columnDefs = [
      {
        headerComponentFramework: TableHeaderRendererComponent,
        cellRendererFramework: MotifTableCellRendererComponent,
        cellRendererParams: this.editQuestion.bind(this),
        headerName: 'Question',
        field: 'name',
        sortable: true,
        filter: false,
        wrapText: true,
        autoHeight: true,
        width: 370,
        sort: 'asc',
        comparator: customComparator
      },
      {
        headerComponentFramework: TableHeaderRendererComponent,
        cellRendererFramework: MotifTableCellRendererComponent,
        cellRendererParams: this.editReportID.bind(this),
        headerName: 'Report ID',
        field: 'pbiReportId',
        sortable: true,
        filter: false,
        wrapText: true,
        autoHeight: true,
        width: 370,
        sort: 'asc',
        comparator: customComparator
      },
      // {
      //   width: 80,
      //   headerComponentFramework: TableHeaderRendererComponent,
      //   cellRendererFramework: MotifTableCellRendererComponent,
      //   cellRendererParams: this.editAct.bind(this),
      //   headerName: 'Actions',
      //   field: 'userId',
      //   sortable: false,
      //   filter: false,
      // }
    ];

  }

  deletePBIMapping(row) {

    const dialogRef = this.dialog.open(ModalComponent, {
      width: '500px',
      data: {
        type: 'Confirmation',
        header: 'Delete PBI Mapping',
        description: 'Are you sure you want to delete this PBI details from the filing?',
        footer: {
          style: 'start',
          YesButton: 'Yes',
          NoButton: 'No'
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      if (result.button == 'Yes') {

        // const deleteTeam = {
        //   "teamId": this.curentTeamId,
        //   "userId": [row.userId]
        // }

        // this.service.deleteTeamMember(deleteTeam).subscribe(resp => {
        //   const teamsList = this.teamsMemberData;
        //   this.teamsMemberData = [];
        //   teamsList.splice(teamsList.findIndex(item => item.userId === row.userId), 1);
        //   teamsList.forEach(ele => {
        //     this.teamsMemberData.push(ele);
        //   });
        //   this.users = this.allUsers.filter(item => !this.teamsMemberData.find(item2 => item.userEmail === item2.userEmail));

        //   this.showToasterAfterDelete = !this.showToasterAfterDelete;
        //   setTimeout(() => {
        //     this.showToasterAfterDelete = !this.showToasterAfterDelete;
        //   }, 5000);

        // });

      }
    });
  }

  addPBIReport(event) {
    this.showAddPBIReportModal = true;
  }

  private _createPBIReport() {
    return this.formBuilder.group({
      question: ['', [Validators.required]],
      reportID: ['', [Validators.required]]
    });
  }

  onSubmitNewQuestion() {
    const obj = this.addPBIReportForm.getRawValue();
    const mappingData = {
      "formId": this.filingData.formId,
      "questionPbiMap": {
        [obj.question]: obj.reportID,
      }
    }

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
        this.PBIMappingData.push(ele)
      })
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
    // api call
    console.log(this.PBIMappingData);
    
    this.enableEditReportID = false;

    let mappingData = {
      "formId": this.filingData.formId,
      "questionPbiMap": {}
    }
    this.PBIMappingData.forEach(ele => {
      mappingData.questionPbiMap[ele.name] = ele.pbiReportId
    });
    console.log(mappingData);
    
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
        this.PBIMappingData.push(ele)
      })
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

  onChangeQuestionSwitch(event) {
    this.addPBIReportForm.reset();
  }
}
