import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss']
})
export class TimePickerComponent implements OnInit {
  @Input() time: NgbTimeStruct;
  @Output() timeChangeEmitter: EventEmitter<NgbTimeStruct> = new EventEmitter<NgbTimeStruct>();

  timePickerModel: NgbTimeStruct;
  timePickerMeridian: boolean = true;
  timePickerSeconds: boolean = false;
  timePickerHourStep: number = 1;
  timePickerMinuteStep: number = 15;
  timePickerSecondStep: number = 0;

  constructor() { }

  ngOnInit(): void {
  }

}
