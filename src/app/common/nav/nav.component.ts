import { Component, OnInit } from '@angular/core';
import { GlobalConstants } from './../../utils/global-constants';
import { AngularFirestore } from '@angular/fire/firestore';
import * as _ from 'lodash';
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  public globalConstants = GlobalConstants;
  public banner: string;
  public _ = _;

  constructor(firestore: AngularFirestore) {
    firestore.collection('settings').doc('banner').valueChanges().subscribe((banner) => {
      this.banner = _.get(banner, ['message']);
    });
  }

  ngOnInit(): void {
  }

}
