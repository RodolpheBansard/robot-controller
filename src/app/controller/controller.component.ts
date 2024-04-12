import { Component, OnInit } from '@angular/core';
import {DeviceService} from "../services/device.service";
import {Command} from "../services/command";
import { multi } from './data';
import {initializeApp} from "firebase/app";
import {collection, getDocs, getFirestore} from "firebase/firestore/lite";
import {Observable, from, map} from "rxjs";
import { ChangeDetectorRef } from '@angular/core'

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

interface StratToSend{
  id:string;
  name:string;
  steps:StepToSend[];
}

interface StepToSend{
  name:string;
  yPos:number;
  xPos:number;
  angle:number;
  type:string;
  actions:StepAction[];
  speed:number;
}

interface StepAction{
  type:string;
  index:number;
  setPoint:number;
  delay:number;
}



@Component({
  selector: 'app-controller',
  templateUrl: './controller.component.html',
  styleUrls: ['./controller.component.scss'],
})
export class ControllerComponent implements OnInit {
  strats$: Observable<Strat[]> = new Observable<Strat[]>();

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

  constructor(private deviceService:DeviceService,private changeRef: ChangeDetectorRef) {
    this.fetchStrat();

    deviceService.data$.subscribe((data) => {
      Object.assign(this, { data });
    })

  }

  ngOnInit() {this.changeRef.detectChanges();}

  fetchStrat(){
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
    this.strats$ = from(getStrats(db)).pipe(map((value) => {
      return value as Strat[];

    }));
  }


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

    const strategyJson = JSON.stringify(this.convertToStratToSend(strategy));
    const sendIteration = Math.ceil(strategyJson.length/200);
    this.sendMessage(Command.STRAT + "/" + sendIteration);
    let counter = 0;
    let i = 0;
    const interval = setInterval(() => {
      if(counter< sendIteration){
        this.sendMessage(Command.START_PART + strategyJson.slice(i, i+200));
        i+=200;
        counter++;
      }
      else{
        clearInterval(interval);
      }

    },100)

  }



  sendMessage(message: string){
    console.log(message)
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

  convertToStratToSend(strat: Strat){
    let stratToSend : StratToSend = {
      id:strat.id,
      name:strat.name,
      steps: []
    };

    strat.steps.forEach((step) => {
      let stepsToSend : StepToSend ={
        name: step.name,
        yPos: step.yPos,
        xPos:step.xPos,
        angle:step.angle,
        type:step.type,
        speed:step.speed,
        actions:[]
      }
      let actionsArray: StepAction[] = [];
      const actionsStringArray = step.actions.split('\n');
      actionsStringArray.forEach((action) => {
        actionsArray.push({
          type: action.split(' ')[0],
          index: +action.split(' ')[1],
          setPoint: +action.split(' ')[2],
          delay: +action.split(' ')[3]

        })

      })
      stepsToSend.actions = actionsArray

      stratToSend.steps.push(stepsToSend);
    })

    return stratToSend

  }
}



async function getStrats(db:any) {
  const stratsCol = collection(db, 'strats');
  const citySnapshot = await getDocs(stratsCol);
  const stratList = citySnapshot.docs.map(doc => doc.data());
  return stratList;
}
