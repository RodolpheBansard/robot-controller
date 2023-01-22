import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { FindDeviceComponent } from './find-device.component';
import {FindDeviceRoutingModule} from "./find-device-routing.module";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FindDeviceRoutingModule
  ],
  declarations: [FindDeviceComponent]
})
export class FindDeviceModule {}
