import { Injectable } from '@angular/core';

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

  devices: Device[] = [
    {name:'WH1000-M3'},
    {name:'HC-05'},
    {name:'LG-03458'},
    {name:'IPEN Tablet'},
    {name:'Bluetooth Mouse'},
    {name:'HC-06'},
  ]

  constructor() { }
}
