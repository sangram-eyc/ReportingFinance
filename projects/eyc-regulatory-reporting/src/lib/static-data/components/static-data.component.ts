import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { StaticDataService }  from './../services/static-data.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomGlobalService } from 'eyc-ui-shared-component';

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

  constructor(
    private service: StaticDataService,
    private customglobalService: CustomGlobalService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.addFilingForm = this._createAddFiling()
  }

  ngOnChanges() {
     if(this.tabHighlighted == 3) {
      this.activeFilings = [];
      this.getStaticData();
      this.getFilingStages();
      this.getScopingStages();
      this.getEntityStages();
       }
  }

  getFilingStages() {
    this.service.filingStages().subscribe(resp => {
      this.filingStages = resp['data'];
    });
  }
  getScopingStages() {
    this.service.scopingStages().subscribe(resp => {
      this.scopeStages = resp['data'];
    });
  }
  getEntityStages() {
    this.service.entityStages().subscribe(resp => {
      this.filingEntitiyStages = resp['data'];
    });
  }

  getStaticData() {
    this.service.getStaticData().subscribe(resp => {
     resp['data'].forEach((item) => {
      const eachitem: any = {
        name: item.filingName,
        dueDate: item.dueDate,
        startDate: item.startDate,
        comments: [],
        status: item.filingStatus,
        filingName: item.filingName,
        period: item.period,
        filingId: item.filingId,
        totalFunds: item.totalFunds
      };
      this.activeFilings.push(eachitem);
    });
    this.activeFilings = this.customglobalService.sortFilings(this.activeFilings)
    });
  }

  addnewFiling() {
    this.showAddFilingForm = true;
  }

  closeAddFilingModal() {
    this.showAddFilingForm = false;
    this.addFilingForm = this._createAddFiling();
  }

  private _createAddFiling() {
    return this.formBuilder.group({
      displayName: ['', [Validators.required, Validators.pattern('^[a-zA-Z \-\]+$'), Validators.maxLength(250), this.noWhitespaceValidator]],
      scopeStages: ['', [Validators.required]],
      filingEntitiyStages: ['', [Validators.required]],
      filingStages: ['', [Validators.required]],
      filerType: ['', [Validators.pattern('^[a-zA-Z \-\]+$'), Validators.maxLength(250), this.noWhitespaceValidator]]
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

  onSubmitAddFiling(form: FormGroup) {
    this.showAddFilingForm = false;
    this.addFilingForm = this._createAddFiling();
    this.showToastAfterFilingAdded = !this.showToastAfterFilingAdded;
    setTimeout(() => {
      this.showToastAfterFilingAdded = !this.showToastAfterFilingAdded;
    }, 5000);

  }

  searchStaticData(input) {
    this.activeFilings = this.activeFilings.filter(item => item.name.toLowerCase().indexOf((input.el.nativeElement.value).toLowerCase()) !== -1)
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

}
