import {formatDate} from '@angular/common';
import {Inject, LOCALE_ID, Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'toDate'
})
export class ToDatePipe implements PipeTransform {

  constructor(@Inject(LOCALE_ID) private locale: string) {}

  transform(value: string, format?: string): string {
    try {
      return formatDate(new Date(value), format || 'fullDate', this.locale);
    } catch(e) {
      return '';
    }
  }
}