import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss']
})
export class DatePickerComponent implements OnInit {
  @Input() date: NgbDateStruct;
  @Output() dateChangeEmitter: EventEmitter<NgbDateStruct> = new EventEmitter<NgbDateStruct>();

  readOnly: boolean = true;
  minDaysFromToday: number = 2;
  maxDaysFromToday: number = 90;
  minDateFromToday = moment().add(this.minDaysFromToday, 'day');
  maxDateFromToday = _.cloneDeep(this.minDateFromToday).add(this.maxDaysFromToday, 'day');

  datePickerMinDate: NgbDateStruct = { year: this.minDateFromToday.year(), month: this.minDateFromToday.month(), day: this.minDateFromToday.date() };
  datePickerMaxDate: NgbDateStruct = { year: this.maxDateFromToday.year(), month: this.maxDateFromToday.month(), day: this.maxDateFromToday.date() };

  constructor() {}

  ngOnInit(): void {
  }
}
