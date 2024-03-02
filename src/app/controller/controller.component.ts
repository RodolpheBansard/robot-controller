import { Component, OnInit } from '@angular/core';
import {DeviceService} from "../services/device.service";
import {Command} from "../services/command";
import { multi } from './data';
import {initializeApp} from "firebase/app";
import {collection, getDocs, getFirestore} from "firebase/firestore/lite";

interface Strat{
  id:string;
  name:string;
  steps:Step[];
}

interface  Step{
  name:string;
  yPos:number;
  xPos:number;
  angle:number;
  type:string;
  actions:string;
  speed:number;
}



@Component({
  selector: 'app-controller',
  templateUrl: './controller.component.html',
  styleUrls: ['./controller.component.scss'],
})
export class ControllerComponent implements OnInit {

  strats: Strat[] = [];

  multi : any
  view: [number, number] = [700, 300];

  xAxisLabelStyle = {
    color: 'red', // Change the color to your desired color
    font: '12px Arial' // You can set other font properties here
  };

  yAxisLabelStyle = {
    color: 'blue', // Change the color to your desired color
    font: 'italic bold 12px Times New Roman' // You can set other font properties here
  };

  // options
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Year';
  yAxisLabel: string = 'Population';
  timeline: boolean = true;

  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  p : string= '';
  i : string= '';
  d : string= '';
  terminalMessage : string= '';

  constructor(private deviceService:DeviceService) {
    // Your web app's Firebase configuration
    const firebaseConfig = {
      apiKey: "AIzaSyAFDv7bi3d-Sx8V-KmFiViTqskhhidxbEk",
      authDomain: "strat-editor.firebaseapp.com",
      projectId: "strat-editor",
      storageBucket: "strat-editor.appspot.com",
      messagingSenderId: "877652619508",
      appId: "1:877652619508:web:a5bc283d2bd35c07ebaea1"
    };

// Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    getStrats(db).then((data) => {
      this.strats = data as Strat[];
      console.log(this.strats)
    })

    deviceService.data$.subscribe((data) => {
      Object.assign(this, { data });
    })

  }

  ngOnInit() {}


  turnLeft(){
    this.sendMessage(Command.TURN_LEFT);
  }
  turnRight(){
    this.sendMessage(Command.TURN_RIGHT);
  }
  forward(){
    this.sendMessage(Command.FORWARD);
  }
  backward(){
    this.sendMessage(Command.BACKWARD);
  }
  stop(){
    this.sendMessage(Command.STOP);
  }
  setSpeed(value:any){
    const newSpeed = Command.SPEED + value.detail.value;
    this.sendMessage(newSpeed);
  }
  sendMovePID(){
    const pidConfig = Command.PID_MOVE + this.p +'/' + this.i +'/' +this.d
    this.sendMessage(pidConfig);
  }
  sendTurnPID(){
    const pidConfig = Command.PID_TURN + this.p +'/' + this.i +'/' +this.d
    this.sendMessage(pidConfig);
  }
  sendStrategy(strategy:Strat){
    const strategyJson = JSON.stringify(strategy);
    const strategyCommand = Command.STRAT + strategyJson;
    this.sendMessage(strategyCommand);
  }
  sendMessage(message: string){
    this.deviceService.sendMessage(message + ';');
  }

  getCounter(){
    return this.deviceService.counter$;
  }

  getChaine(){
    return this.deviceService.chaine$;
  }


  onSelect(data:any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data:any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data:any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }
}

async function getStrats(db:any) {
  const stratsCol = collection(db, 'strats');
  const citySnapshot = await getDocs(stratsCol);
  const stratList = citySnapshot.docs.map(doc => doc.data());
  return stratList;
}
