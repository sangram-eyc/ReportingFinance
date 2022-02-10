import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'lib-eyc-data-managed-services',
  template: `<lib-data-intake></lib-data-intake>`,

  styles: [
  ]
})
export class EycDataManagementServicesComponent implements OnInit, OnDestroy {

  constructor() { }

  ngOnDestroy(): void {}

  ngOnInit(): void {
  }

}
