import { Injectable } from '@angular/core';
import {BluetoothSerial} from "@awesome-cordova-plugins/bluetooth-serial/ngx";
import {BehaviorSubject, from, Observable} from "rxjs";
import {ToastController} from "@ionic/angular";
import {Router} from "@angular/router";

export interface ErrorData{
  name:string,
  series:ErrorDataElement[]
}

export interface ErrorDataElement{
  name:string,
  value:number
}

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

  data : ErrorDataElement[] = [];

  public counter$ = new BehaviorSubject(0);
  public chaine$ = new BehaviorSubject('');
  public data$ = new BehaviorSubject<ErrorData>({
    name:"test",
    series:[]
  });




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
              private router:Router) {
    // Reset bluetooth
    this.bluetoothSerial.disconnect();
  }

  checkBluetoothEnable(){

    this.isLoadingDeviceBS.next(true);
    setTimeout(() => {
      this.isLoadingDeviceBS.next(false);
      this.bluetoothSerial.isEnabled().then((success) => {
        this.listDevices();
      },(error) => {
        this.displayToast(error,500).then();
      })
    },1000)

  }

  listDevices(){
    this.bluetoothSerial.list().then((success)=> {
      this.devices.next(success);
    },(error) => {
      this.displayToast('error while listing device',500).then();
      this.devices.next([])
    })
  }

  connect(device:Device){
    if(device.address){
      this.bluetoothSerial.connect(device.address).subscribe(success => {
        this.displayToast("Successfully Connected",500);
        this.router.navigateByUrl('controller')
        this.startReading();
      }, error => {
        this.displayToast(error,500);
      });
    }
  }

  startReading() {
    this.bluetoothSerial.subscribe('\n').subscribe(
      (data:string) => {
        const name = data.split(':')[0];
        const value = +data.split(':')[1];
        this.data.push({
          name:name,
          value:value
        });
        this.counter$.next(this.counter$.getValue() + 1);
        this.chaine$.next(data);
        const temp = this.data$.getValue();
        temp.series = this.data;
        this.data$.next(temp);
        this.counter$.next(temp.series.length);
      },
      (error) => {
        this.displayToast('Error while reading message',500)
      }
    );
  }



  sendMessage(message:string){
    this.bluetoothSerial.isConnected().then((success) => {
      this.bluetoothSerial.write(message).then((success) => {
        this.displayToast('message sent',500).then()
      })
    }, (error) => {
      this.displayToast('Error while sending message',500)
    })

  }

  async displayToast(message:string,duration:number) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration,
      position: 'bottom'
    });

    await toast.present();
  }
}
