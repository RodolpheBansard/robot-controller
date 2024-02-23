import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {IonicModule} from "@ionic/angular";
import {ControllerRoutingModule} from "./controller-routing.module";
import {ControllerComponent} from "./controller.component";
import {FormsModule} from "@angular/forms";
import { NgxChartsModule } from '@swimlane/ngx-charts';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";


@NgModule({
  declarations: [ControllerComponent],
    imports: [
        CommonModule,
        IonicModule,
        ControllerRoutingModule,
        FormsModule,
        NgxChartsModule,

    ],
})
export class ControllerModule { }
