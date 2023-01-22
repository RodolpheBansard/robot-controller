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
  errorMessage:string=''
  messageSent: string = '';
  isConnected = false;
  message:string='';

  constructor(private bluetoothSerial: BluetoothSerial,
              private alertController: AlertController,
              private deviceService: DeviceService) { }

  refresh(ev: any) {
    setTimeout(() => {
      (ev as RefresherCustomEvent).detail.complete();
    }, 3000);
  }


  ngOnInit(): void {
    this.devices = this.deviceService.devices;
    // this.checkBluetoothEnable();
  }

  checkBluetoothEnable(){
    this.bluetoothSerial.isEnabled().then((success) => {
      this.listDevices();

    },(error) => {
      this.alertController.create({
        header:'Error'
      })
      this.errorMessage= "bluetooth not enable"
    })
  }

  listDevices(){
    this.bluetoothSerial.list().then((success)=> {
      this.devices = success;
    },(error) => {
      this.alertController.create({
        header:'bluetooth error'
      })
      this.errorMessage="error while listing device"
    })
  }

  connect(device:Device){
    if(device.address){
      this.bluetoothSerial.connect(device.address).subscribe(()=> console.log('test'));
    }
  }

  sendMessage(){
    this.bluetoothSerial.write(this.message).then((success) => {
      this.messageSent = this.message;
    })
  }
}
