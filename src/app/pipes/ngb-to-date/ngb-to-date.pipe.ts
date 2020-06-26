import {formatDate} from '@angular/common';
import {Inject, LOCALE_ID, Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'ngbToDate'
})
export class NgbToDatePipe implements PipeTransform {

  constructor(@Inject(LOCALE_ID) private locale: string) {}

  transform(ngbDate: any, format?: string): string {
    try {
      return formatDate(new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day), format || 'fullDate', this.locale);
    } catch(e) {
      return undefined;
    }
  }
}