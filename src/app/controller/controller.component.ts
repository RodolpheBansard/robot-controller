import { Component, OnInit } from '@angular/core';
import {DeviceService} from "../services/device.service";
import {Command} from "../services/command";

@Component({
  selector: 'app-controller',
  templateUrl: './controller.component.html',
  styleUrls: ['./controller.component.scss'],
})
export class ControllerComponent implements OnInit {

  p : string= '';
  i : string= '';
  d : string= '';
  terminalMessage : string= '';

  constructor(private deviceService:DeviceService) { }

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
    this.sendMessage(value.detail.value);
  }
  sendPID(){
    const pidConfig = Command.PID + this.p +'/' + this.i +'/' +this.d
    this.sendMessage(pidConfig);
  }
  sendMessage(message: string){
    this.deviceService.sendMessage(message + ';');
  }

}
