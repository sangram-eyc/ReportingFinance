import { Component, TemplateRef } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'lib-cell-renderer-template',
  templateUrl: './cell-renderer-template.component.html',
  styleUrls: ['./cell-renderer-template.component.scss']
})
export class CellRendererTemplateComponent implements ICellRendererAngularComp {
	template: TemplateRef<any>;
  templateContext: { $implicit: any, params: ICellRendererParams };

  agInit(params: ICellRendererParams) {
    this.template = params['ngTemplate'];
    this.refresh(params);
  }

  refresh(params: ICellRendererParams): boolean {
    this.templateContext = {
      $implicit: params.data,
      params
   };
    return true;
  }
}