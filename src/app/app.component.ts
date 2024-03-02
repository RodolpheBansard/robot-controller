import { Component } from '@angular/core';
import {DeviceService} from "./services/device.service";

import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private deviceService:DeviceService) {

  }

  refreshDevices(){
    this.deviceService.checkBluetoothEnable();
  }
}

async function getCities(db:any) {
  const citiesCol = collection(db, 'strats');
  const citySnapshot = await getDocs(citiesCol);
  const cityList = citySnapshot.docs.map(doc => doc.data());
  return cityList;
}
