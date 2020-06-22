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

  minTime: NgbTimeStruct = { hour: 9, minute: 0, second: 0 };
  maxTime: NgbTimeStruct = { hour: 21, minute: 0, second: 0 };
  timePickerModel: NgbTimeStruct;
  timePickerMeridian: boolean = true;
  timePickerSeconds: boolean = false;
  timePickerHourStep: number = 1;
  timePickerMinuteStep: number = 15;
  timePickerSecondStep: number = 0;

  timePickerFormControl = new FormControl('', (control: FormControl) => {
    const value = control.value;

    if (!value) {
      return null;
    }

    if (value.hour < this.minTime.hour) {
      return { tooEarly: true };
    }
    if ((value.hour > this.maxTime.hour) || ((value.hour === this.maxTime.hour) && (value.minute > this.maxTime.minute))) {
      return { tooLate: true };
    }

    return null;
  });

  constructor() { }

  ngOnInit(): void {
  }

}
