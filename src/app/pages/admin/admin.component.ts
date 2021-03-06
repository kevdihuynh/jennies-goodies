import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { GlobalConstants } from '../../utils/global-constants';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  public _ = _;
  public moment = moment;
  public input: string;
  public globalConstants: any = GlobalConstants;
  public transactions: Array<any>;
  public totalProfit: number = 0;
  public selectedMode: string = 'all';
  public popularity: Array<any> = [];

  constructor(firestore: AngularFirestore) {
    firestore.collection('transactions').valueChanges().subscribe((transactions) => {
      this.transactions = _.orderBy(transactions, (transaction: any) => _.get(transaction, ['orderForm', 'selectedDateTime', 'start', 'dateTime']), ['desc']);
      this.totalProfit = _.reduce(this.transactions, (sum: number, transaction: any) => {
        return sum + _.toNumber(_.get(transaction, ['orderForm', 'grandTotal'], 0));
      }, 0);
      const popularityDict: object = {};
      _.forEach(this.transactions, (transaction: any) => {
        _.forEach(_.get(transaction, ['orderForm', 'orders'], []), (order: any) => {
          const name: string = _.get(order, ['name']);
          const quantity: number =  _.toNumber(_.get(order, ['quantity'], 1));
          popularityDict[name] =  (popularityDict[name] || 0) + quantity;
        });
      });
      this.popularity = _.orderBy(_.map(popularityDict, (quantity: number, name: string) => {
        return { name, quantity };
      }), ['quantity'], ['desc']);
    });
  }

  ngOnInit(): void {
  }

  isPickupToday(transaction: any): boolean {
    const dateSelected = _.get(transaction, ['orderForm', 'selectedDateTime', 'start', 'dateTime']);
    return moment(moment(dateSelected).format('YYYY-MM-DD')).isSame(moment().format('YYYY-MM-DD'))
  }

  isCreatedToday(transaction: any): boolean {
    const dateSelected = _.get(transaction, ['paypal', 'create_time']);
    return moment(moment(dateSelected).format('YYYY-MM-DD')).isSame(moment().format('YYYY-MM-DD'))
  }

  isCompletedSales(transaction: any): boolean {
    const dateSelected = _.get(transaction, ['orderForm', 'selectedDateTime', 'start', 'dateTime']);
    return moment(moment(dateSelected).format('YYYY-MM-DD')).isBefore(moment().format('YYYY-MM-DD'))
  }

  getFilteredTransactions(): Array<any> {
    switch (_.toLower(this.selectedMode)) {
      case 'pickup_today':
        return _.filter(this.transactions, (transaction: any) => this.isPickupToday(transaction));
      case 'created_today':
        return _.filter(this.transactions, (transaction: any) => this.isCreatedToday(transaction));
      case 'active':
        return _.filter(this.transactions, (transaction: any) => {
          const dateSelected = _.get(transaction, ['orderForm', 'selectedDateTime', 'start', 'dateTime']);
          return moment(moment(dateSelected).format('YYYY-MM-DD')).isAfter(moment().format('YYYY-MM-DD'))
        });
      case 'completed':
        return _.filter(this.transactions, (transaction: any) => this.isCompletedSales(transaction));
      default:
        return this.transactions;
      }
  }
}
