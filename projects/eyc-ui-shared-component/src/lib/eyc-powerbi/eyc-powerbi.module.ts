import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EycPowerbiEmbedComponent } from './eyc-powerbi-embed/eyc-powerbi-embed.component';



@NgModule({
  declarations: [EycPowerbiEmbedComponent],
  imports: [
    CommonModule
  ],
  exports: [
    EycPowerbiEmbedComponent
  ]
})
export class EycPowerbiModule { }
