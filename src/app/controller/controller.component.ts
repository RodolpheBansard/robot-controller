import { Component, OnInit } from '@angular/core';
import {DeviceService} from "../services/device.service";

@Component({
  selector: 'app-controller',
  templateUrl: './controller.component.html',
  styleUrls: ['./controller.component.scss'],
})
export class ControllerComponent implements OnInit {

  constructor(private deviceService:DeviceService) { }

  ngOnInit() {}

}
