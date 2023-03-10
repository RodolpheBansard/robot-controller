import { Component } from '@angular/core';
import {DeviceService} from "./services/device.service";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private deviceService:DeviceService) {}

  refreshDevices(){
    this.deviceService.checkBluetoothEnable();
  }
}
