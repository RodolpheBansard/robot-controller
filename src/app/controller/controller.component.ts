import { Component, OnInit } from '@angular/core';
import {DeviceService} from "../services/device.service";
import {Command} from "../services/command";
import { multi } from './data';



@Component({
  selector: 'app-controller',
  templateUrl: './controller.component.html',
  styleUrls: ['./controller.component.scss'],
})
export class ControllerComponent implements OnInit {
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
  sendPID(){
    const pidConfig = Command.PID + this.p +'/' + this.i +'/' +this.d
    this.sendMessage(pidConfig);
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
