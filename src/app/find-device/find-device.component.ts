import {Component, OnInit} from '@angular/core';
import {AlertController, RefresherCustomEvent} from '@ionic/angular';
import {BluetoothSerial} from "@ionic-native/bluetooth-serial/ngx";
import {Device, DeviceService} from "../services/device.service";



@Component({
  selector: 'app-find-device',
  templateUrl: 'find-device.component.html',
  styleUrls: ['find-device.component.scss'],
})
export class FindDeviceComponent implements OnInit{
  devices: Device[] = [];


  constructor(public deviceService: DeviceService) { }



  ngOnInit(): void {
    this.deviceService.checkBluetoothEnable()

    this.deviceService.devices.subscribe((data) => {
      if(data) {
        this.devices=data;
      }
    })
  }

  selectDevice(device: Device){
    this.deviceService.connect(device);
  }


}
