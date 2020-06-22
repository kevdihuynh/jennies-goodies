import { Component, OnInit } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss']
})
export class DatePickerComponent implements OnInit {
  minDaysFromToday: number = 2;
  maxDaysFromToday: number = 90;
  minDateFromToday = moment().add(this.minDaysFromToday, 'day');
  maxDateFromToday = _.cloneDeep(this.minDateFromToday).add(this.maxDaysFromToday, 'day');

  datePickerModel: NgbDateStruct = { year: this.minDateFromToday.year(), month: this.minDateFromToday.month() + 1, day: this.minDateFromToday.date() };
  datePickerMinDate: NgbDateStruct = { year: this.minDateFromToday.year(), month: this.minDateFromToday.month() + 1, day: this.minDateFromToday.date() };
  datePickerMaxDate: NgbDateStruct = { year: this.maxDateFromToday.year(), month: this.maxDateFromToday.month() + 1, day: this.maxDateFromToday.date() };

  constructor() { }

  ngOnInit(): void {
  }

}
