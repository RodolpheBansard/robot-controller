import { Injectable } from '@angular/core';
import {BluetoothSerial} from "@ionic-native/bluetooth-serial/ngx";
import {BehaviorSubject} from "rxjs";
import {ToastController} from "@ionic/angular";
import {Router} from "@angular/router";

export interface Device {
  class?:number,
  id?:string,
  address?:string,
  name:string
}

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  errorMessage:string=''
  messageSent: string = '';
  isConnected = false;
  message:string='';
  public isLoadingDeviceBS= new BehaviorSubject(false);


  // devices: Device[] = [
  //   {name:'WH1000-M3'},
  //   {name:'HC-05'},
  //   {name:'LG-03458'},
  //   {name:'IPEN Tablet'},
  //   {name:'Bluetooth Mouse'},
  //   {name:'HC-06'},
  // ]
  devices: BehaviorSubject<Device[]> = new BehaviorSubject<Device[]>([]);

  constructor(private bluetoothSerial: BluetoothSerial,
              private toastController: ToastController,
              private router:Router) { }

  checkBluetoothEnable(){
    this.isLoadingDeviceBS.next(true);
    setTimeout(() => {
      this.isLoadingDeviceBS.next(false);
      this.bluetoothSerial.isEnabled().then((success) => {
        this.listDevices();
      },(error) => {
        this.displayToast(error).then();
      })
    },1000)

  }

  listDevices(){
    this.bluetoothSerial.list().then((success)=> {
      this.devices.next(success);
    },(error) => {
      this.displayToast('error while listing device').then();
    })
  }

  connect(device:Device){
    if(device.address){
      this.bluetoothSerial.connect(device.address).subscribe(() => {
        this.router.navigateByUrl('controller');
      });
    }
  }

  sendMessage(message:string){
    this.bluetoothSerial.write(message).then((success) => {
      this.displayToast('message sent')
    })
  }

  async displayToast(message:string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'bottom'
    });

    await toast.present();
  }
}
