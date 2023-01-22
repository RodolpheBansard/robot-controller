import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {IonicModule} from "@ionic/angular";
import {ControllerRoutingModule} from "./controller-routing.module";
import {ControllerComponent} from "./controller.component";


@NgModule({
  declarations: [ControllerComponent],
  imports: [
    CommonModule,
    IonicModule,
    ControllerRoutingModule
  ],
})
export class ControllerModule { }
