import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {FindDeviceComponent} from "./find-device.component";

const routes: Routes = [
  {
    path: '',
    component: FindDeviceComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FindDeviceRoutingModule {}
