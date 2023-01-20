import {Component, OnInit} from '@angular/core';
import {AlertController, RefresherCustomEvent} from '@ionic/angular';

import { DataService, Message } from '../services/data.service';
import {BluetoothSerial} from "@ionic-native/bluetooth-serial/ngx";

interface Device {
  class:number,
  id:string,
  address:string,
  name:string
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  devices: Device[] = [];
  errorMessage:string=''
  messageSent: string = '';
  isConnected = false;
  message:string='';

  constructor(private data: DataService,
              private bluetoothSerial: BluetoothSerial,
              private alertController: AlertController) { }

  refresh(ev: any) {
    setTimeout(() => {
      (ev as RefresherCustomEvent).detail.complete();
    }, 3000);
  }


  ngOnInit(): void {
    this.checkBluetoothEnable();
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
    this.bluetoothSerial.connect(device.address).subscribe(()=> console.log('test'));
  }

  sendMessage(){
    this.bluetoothSerial.write(this.message).then((success) => {
      this.messageSent = this.message;
    })
  }
}
