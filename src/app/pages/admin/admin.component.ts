import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import { GlobalConstants } from '../../utils/global-constants';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  public _ = _;
  public input: string;
  public globalConstants: any = GlobalConstants;
  public transactions: Array<any>;
  public totalProfit: number = 0;

  constructor(firestore: AngularFirestore) {
    firestore.collection('transactions').valueChanges().subscribe((transactions) => {
      this.transactions = _.orderBy(transactions, (transaction: any) => _.get(transaction, ['orderForm', 'selectedDateTime', 'start', 'dateTime']), ['desc']);
      this.totalProfit = _.reduce(this.transactions, (sum: number, transaction: any) => {
        return sum + _.toNumber(_.get(transaction, ['orderForm', 'grandTotal'], 0));
      }, 0);
    });
  }

  ngOnInit(): void {
  }
}
