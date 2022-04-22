import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MotifChipModule, MotifIconModule, MotifModalModule, MotifTabBarModule, MotifToastModule  } from '@ey-xd/ng-motif';
import { MotifFormsModule,  MotifTableModule, MotifModule} from '@ey-xd/ng-motif';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { EycUiSharedComponentModule } from 'eyc-ui-shared-component';
import { StaticDataComponent } from './components/static-data.component';
import { UpdateFilingPropertiesComponent } from './update-filing-properties/components/update-filing-properties.component';




@NgModule({
  declarations: [
    StaticDataComponent,
    UpdateFilingPropertiesComponent
  ],
  imports: [
    CommonModule,
    MotifModule,
    MotifTabBarModule,
    MotifFormsModule,
    MotifTableModule,
    MotifModalModule,
    MotifChipModule,
    FormsModule,
    ReactiveFormsModule,
    MotifToastModule,
    HttpClientModule,
    MotifIconModule,
    EycUiSharedComponentModule,
  ],
  exports: [
    StaticDataComponent,
    UpdateFilingPropertiesComponent 
  ]
})
export class StaticDataModule { }

