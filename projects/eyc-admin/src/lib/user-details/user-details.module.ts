import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MotifAvatarModule, MotifButtonModule, MotifModule, MotifFormsModule} from '@ey-xd/ng-motif';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserDetailsComponent } from './components/user-details.component';
import { EycUiSharedComponentModule } from 'eyc-ui-shared-component';



@NgModule({
  declarations: [UserDetailsComponent],
  imports: [
    CommonModule,
    MotifModule,
    MotifFormsModule,
    MotifAvatarModule,
    MotifButtonModule,
    FormsModule,
    ReactiveFormsModule,
    EycUiSharedComponentModule
  ]
})
export class UserDetailsModule { }
